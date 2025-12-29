import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// API URL - dynamic for production
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Advanced filters
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    skills: '',
    company: '',
    sort: 'newest',
    datePosted: '', // last24h, last7d, last30d
    salaryMin: '',
    salaryMax: '',
    experience: '' // entry, mid, senior
  });

  useEffect(() => {
    loadSavedJobs();
    performSearch();
  }, [filters, currentPage]);

  const loadSavedJobs = () => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(saved);
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: filters.q,
        location: filters.location,
        type: filters.type,
        page: currentPage,
        limit: 12,
        sort: filters.sort
      });

      // Add advanced filters
      if (filters.skills) params.set('skills', filters.skills);
      if (filters.company) params.set('company', filters.company);
      if (filters.datePosted) params.set('datePosted', filters.datePosted);
      if (filters.salaryMin) params.set('salaryMin', filters.salaryMin);
      if (filters.salaryMax) params.set('salaryMax', filters.salaryMax);
      if (filters.experience) params.set('experience', filters.experience);

      const response = await axios.get(`${API_BASE}/jobs?${params}`);
      setJobs(response.data.jobs || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const toggleSaved = (jobId) => {
    const current = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const isCurrentlySaved = current.includes(jobId);
    const updated = isCurrentlySaved
      ? current.filter(id => id !== jobId)
      : [...current, jobId];
    localStorage.setItem('savedJobs', JSON.stringify(updated));
    setSavedJobs(updated);
    showToast(isCurrentlySaved ? 'Removed from saved jobs' : 'Added to saved jobs');
  };

  const isSaved = (jobId) => savedJobs.includes(jobId);

  const handleApply = (jobId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/job/${jobId}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{
            fontSize: 36,
            color: '#fbbf24',
            marginBottom: 10,
            fontWeight: 700
          }}>
            🔍 Advanced Job Search
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: 16 }}>
            Find your perfect job with advanced filters and search options
          </p>
        </div>

        {/* Advanced Filters */}
        <div style={{
          background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
          padding: 30,
          borderRadius: 15,
          border: '2px solid #3a3a3a',
          marginBottom: 30
        }}>
          <h3 style={{ color: '#fbbf24', marginBottom: 20 }}>Search Filters</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {/* Basic Search */}
            <div>
              <label style={{ color: '#d4d4d4', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Keywords
              </label>
              <input
                type="text"
                value={filters.q}
                onChange={(e) => handleFilterChange('q', e.target.value)}
                placeholder="Job title, company, skills..."
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #4a4a4a',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ color: '#d4d4d4', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Location
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="City, state, or remote"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #4a4a4a',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ color: '#d4d4d4', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Job Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #4a4a4a',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontSize: 14
                }}
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#d4d4d4', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Company
              </label>
              <input
                type="text"
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                placeholder="Company name"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #4a4a4a',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ color: '#d4d4d4', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Skills
              </label>
              <input
                type="text"
                value={filters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
                placeholder="React, Node.js, Python..."
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #4a4a4a',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ color: '#d4d4d4', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Date Posted
              </label>
              <select
                value={filters.datePosted}
                onChange={(e) => handleFilterChange('datePosted', e.target.value)}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #4a4a4a',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontSize: 14
                }}
              >
                <option value="">Any time</option>
                <option value="last24h">Last 24 hours</option>
                <option value="last7d">Last 7 days</option>
                <option value="last30d">Last 30 days</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#d4d4d4', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Experience Level
              </label>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #4a4a4a',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontSize: 14
                }}
              >
                <option value="">All levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#d4d4d4', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #4a4a4a',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontSize: 14
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ color: '#fbbf24', margin: 0 }}>
              Search Results {jobs.length > 0 && `(${jobs.length} jobs found)`}
            </h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#fbbf24' }}>
              Searching jobs...
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#737373' }}>
              <p style={{ fontSize: 18 }}>No jobs found matching your criteria.</p>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => navigate(`/job/${job._id}`)}
                    style={{
                      background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
                      padding: 20,
                      borderRadius: 12,
                      border: '2px solid #3a3a3a',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      height: 'fit-content'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#fbbf24'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#3a3a3a'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                      <h4 style={{ color: '#fbbf24', margin: 0, fontSize: 18, fontWeight: 600 }}>
                        {job.title}
                      </h4>
                      <span style={{
                        background: '#fbbf24',
                        color: '#000',
                        padding: '4px 10px',
                        borderRadius: 15,
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {job.type}
                      </span>
                    </div>

                    <p style={{ color: '#a3a3a3', margin: '8px 0', fontSize: 14 }}>
                      🏢 {job.company || 'Company'} • 📍 {job.location || 'Location'}
                    </p>

                    <p style={{ color: '#737373', fontSize: 12, margin: '8px 0' }}>
                      {dayjs(job.createdAt).fromNow()}
                    </p>

                    {job.description && (
                      <p style={{ color: '#d4d4d4', fontSize: 14, lineHeight: 1.4, margin: '12px 0' }}>
                        {job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: 8, marginTop: 15 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaved(job._id);
                        }}
                        style={{
                          background: isSaved(job._id) ? '#fbbf24' : '#3a3a3a',
                          color: isSaved(job._id) ? '#000' : '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer',
                          flex: 1
                        }}
                      >
                        {isSaved(job._id) ? '❤️ Saved' : '🤍 Save'}
                      </button>

                      {user && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(job._id);
                          }}
                          style={{
                            background: '#28a745',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: 6,
                            fontSize: 12,
                            cursor: 'pointer',
                            flex: 1
                          }}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 30 }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage <= 1}
                    style={{
                      background: '#2b2b2b',
                      color: '#fff',
                      border: '1px solid #3a3a3a',
                      padding: '8px 16px',
                      borderRadius: 6,
                      cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage <= 1 ? 0.5 : 1
                    }}
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          background: pageNum === currentPage ? '#fbbf24' : '#2b2b2b',
                          color: pageNum === currentPage ? '#000' : '#fff',
                          border: '1px solid #3a3a3a',
                          padding: '8px 12px',
                          borderRadius: 6,
                          cursor: 'pointer',
                          minWidth: 40
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages}
                    style={{
                      background: '#2b2b2b',
                      color: '#fff',
                      border: '1px solid #3a3a3a',
                      padding: '8px 16px',
                      borderRadius: 6,
                      cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage >= totalPages ? 0.5 : 1
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: toast.type === 'error' ? '#dc3545' : '#28a745',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;