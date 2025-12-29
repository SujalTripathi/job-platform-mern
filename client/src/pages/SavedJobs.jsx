import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';

const SavedJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      if (user) {
        // Server-side bookmarks for logged-in users
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:4000/api/bookmarks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(response.data.map(b => b.jobId));
      } else {
        // Client-side bookmarks for guests
        const savedIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        if (savedIds.length > 0) {
          const response = await axios.get(`http://localhost:4000/api/jobs?q=${savedIds.join(',')}`);
          setJobs(response.data.jobs.filter(job => savedIds.includes(job._id)));
        } else {
          setJobs([]);
        }
      }
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ color: '#fbbf24', textAlign: 'center', marginBottom: 40 }}>
          Saved Jobs
        </h1>

        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#737373' }}>
            <p style={{ fontSize: 18 }}>No saved jobs yet. Start saving jobs you're interested in!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 20 }}>
            {jobs.map((job) => (
              <div
                key={job._id}
                style={{
                  background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
                  padding: 24,
                  borderRadius: 15,
                  border: '2px solid #3a3a3a'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 22, color: '#fbbf24', fontWeight: 600 }}>
                    {job.title}
                  </h3>
                  <span style={{
                    background: '#fbbf24',
                    color: '#000000',
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    textTransform: 'capitalize'
                  }}>
                    {job.type}
                  </span>
                </div>

                <p style={{ color: '#a3a3a3', marginBottom: 12, fontSize: 15 }}>
                  🏢 {job.company || 'Company'} • 📍 {job.location || 'Location not specified'}
                </p>

                {job.description && (
                  <p style={{ color: '#d4d4d4', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                    {job.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;