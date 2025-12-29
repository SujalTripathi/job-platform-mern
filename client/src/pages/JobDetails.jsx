import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// API URL - dynamic for production
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const loadJobDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE}/jobs`);
      const foundJob = response.data.jobs.find(j => j._id === id);
      if (foundJob) {
        setJob(foundJob);
        // Load similar jobs
        const similar = response.data.jobs
          .filter(j => j._id !== id && j.type === foundJob.type)
          .slice(0, 3);
        setSimilarJobs(similar);
      }
    } catch (error) {
      console.error('Error loading job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const coverLetter = prompt('Enter your cover letter:');
    if (coverLetter === null) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE}/applications`, {
        jobId: job._id,
        coverLetter,
        resume: 'dummy-resume.pdf'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('✅ Application submitted successfully!');
    } catch (error) {
      showToast('❌ Error applying for job', 'error');
    }
  };

  const toggleSaved = () => {
    const current = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const isCurrentlySaved = current.includes(job._id);
    const updated = isCurrentlySaved
      ? current.filter(jobId => jobId !== job._id)
      : [...current, job._id];
    localStorage.setItem('savedJobs', JSON.stringify(updated));
    showToast(isCurrentlySaved ? 'Removed from saved jobs' : 'Added to saved jobs');
    // Trigger re-render
    setJob({...job});
  };

  const isSaved = () => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    return saved.includes(job._id);
  };

  const shareJob = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      showToast('Job link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fbbf24'
      }}>
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fbbf24'
      }}>
        Job not found
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#3a3a3a',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 8,
            marginBottom: 20,
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>

        {/* Job Header */}
        <div style={{
          background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
          padding: 30,
          borderRadius: 15,
          border: '2px solid #3a3a3a',
          marginBottom: 30
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 20 }}>
            <div>
              <h1 style={{ color: '#fbbf24', fontSize: 32, margin: 0, fontWeight: 700 }}>
                {job.title}
              </h1>
              <p style={{ color: '#a3a3a3', fontSize: 18, margin: '8px 0' }}>
                🏢 {job.company || 'Company'} • 📍 {job.location || 'Location not specified'}
              </p>
              <p style={{ color: '#737373', fontSize: 14 }}>
                Posted {dayjs(job.createdAt).fromNow()}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{
                background: '#fbbf24',
                color: '#000',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 700,
                textTransform: 'capitalize'
              }}>
                {job.type}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {user && (
              <button
                onClick={handleApply}
                style={{
                  background: '#28a745',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                📄 Apply Now
              </button>
            )}

            <button
              onClick={toggleSaved}
              style={{
                background: isSaved() ? '#fbbf24' : '#3a3a3a',
                color: isSaved() ? '#000' : '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isSaved() ? '❤️ Saved' : '🤍 Save Job'}
            </button>

            <button
              onClick={shareJob}
              style={{
                background: '#007bff',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🔗 Share
            </button>
          </div>
        </div>

        {/* Job Description */}
        <div style={{
          background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
          padding: 30,
          borderRadius: 15,
          border: '2px solid #3a3a3a',
          marginBottom: 30
        }}>
          <h2 style={{ color: '#fbbf24', fontSize: 24, marginBottom: 20 }}>Job Description</h2>
          <div style={{ color: '#d4d4d4', lineHeight: 1.6, fontSize: 16 }}>
            {job.description ? (
              <div dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br>') }} />
            ) : (
              <p>No description provided.</p>
            )}
          </div>

          {job.skills && job.skills.length > 0 && (
            <div style={{ marginTop: 30 }}>
              <h3 style={{ color: '#fbbf24', fontSize: 20, marginBottom: 15 }}>Required Skills</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {job.skills.map((skill, i) => (
                  <span key={i} style={{
                    background: '#3a3a3a',
                    color: '#fbbf24',
                    padding: '8px 16px',
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 600
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
            padding: 30,
            borderRadius: 15,
            border: '2px solid #3a3a3a'
          }}>
            <h2 style={{ color: '#fbbf24', fontSize: 24, marginBottom: 20 }}>Similar Jobs</h2>
            <div style={{ display: 'grid', gap: 20 }}>
              {similarJobs.map((similarJob) => (
                <div
                  key={similarJob._id}
                  onClick={() => navigate(`/job/${similarJob._id}`)}
                  style={{
                    background: '#1a1a1a',
                    padding: 20,
                    borderRadius: 10,
                    border: '1px solid #3a3a3a',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#fbbf24'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#3a3a3a'}
                >
                  <h4 style={{ color: '#fbbf24', margin: 0, fontSize: 18 }}>{similarJob.title}</h4>
                  <p style={{ color: '#a3a3a3', margin: '5px 0' }}>
                    🏢 {similarJob.company} • 📍 {similarJob.location}
                  </p>
                  <p style={{ color: '#737373', fontSize: 14 }}>
                    Posted {dayjs(similarJob.createdAt).fromNow()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
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

export default JobDetails;