import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (!user || user.role !== 'employer') {
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      // Load jobs posted by this employer
      const jobsResponse = await axios.get('http://localhost:4000/api/jobs');
      // For demo purposes, we'll show all jobs. In a real app, you'd filter by employer
      setJobs(jobsResponse.data.jobs.slice(0, 10)); // Limit for demo

      // Load applications (in a real app, you'd filter by employer's jobs)
      const token = localStorage.getItem('authToken');
      const appsResponse = await axios.get('http://localhost:4000/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(appsResponse.data);

      // Calculate stats
      setStats({
        totalJobs: jobsResponse.data.jobs.length,
        totalApplications: appsResponse.data.length,
        pendingApplications: appsResponse.data.filter(app => app.status === 'pending').length,
        acceptedApplications: appsResponse.data.filter(app => app.status === 'accepted').length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('authToken');
      // In a real app, you'd have an API endpoint to update application status
      // For now, we'll just show a success message
      showToast(`Application ${status} successfully!`);
      // Reload data
      loadDashboardData();
    } catch (error) {
      showToast('Error updating application status', 'error');
    }
  };

  if (!user || user.role !== 'employer') {
    return null;
  }

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
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ color: '#fbbf24', fontSize: 32, marginBottom: 10 }}>
            🏢 Employer Dashboard
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: 16 }}>
            Manage your job postings and review applications
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 20,
          marginBottom: 30
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
            padding: 25,
            borderRadius: 12,
            border: '2px solid #3a3a3a',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#fbbf24', fontSize: 28, margin: 0 }}>{stats.totalJobs}</h3>
            <p style={{ color: '#a3a3a3', margin: 5 }}>Jobs Posted</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
            padding: 25,
            borderRadius: 12,
            border: '2px solid #3a3a3a',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#007bff', fontSize: 28, margin: 0 }}>{stats.totalApplications}</h3>
            <p style={{ color: '#a3a3a3', margin: 5 }}>Total Applications</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
            padding: 25,
            borderRadius: 12,
            border: '2px solid #3a3a3a',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ffc107', fontSize: 28, margin: 0 }}>{stats.pendingApplications}</h3>
            <p style={{ color: '#a3a3a3', margin: 5 }}>Pending Review</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
            padding: 25,
            borderRadius: 12,
            border: '2px solid #3a3a3a',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#28a745', fontSize: 28, margin: 0 }}>{stats.acceptedApplications}</h3>
            <p style={{ color: '#a3a3a3', margin: 5 }}>Accepted</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
          padding: 20,
          borderRadius: 15,
          border: '2px solid #3a3a3a',
          marginBottom: 30
        }}>
          <div style={{ display: 'flex', gap: 20, borderBottom: '1px solid #3a3a3a', paddingBottom: 15 }}>
            <button
              onClick={() => setActiveTab('jobs')}
              style={{
                background: activeTab === 'jobs' ? '#fbbf24' : 'transparent',
                color: activeTab === 'jobs' ? '#000' : '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              My Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              style={{
                background: activeTab === 'applications' ? '#fbbf24' : 'transparent',
                color: activeTab === 'applications' ? '#000' : '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Applications ({applications.length})
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ paddingTop: 20 }}>
            {activeTab === 'jobs' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ color: '#fbbf24', margin: 0 }}>Posted Jobs</h3>
                  <button
                    onClick={() => navigate('/')}
                    style={{
                      background: '#28a745',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    + Post New Job
                  </button>
                </div>

                {jobs.length === 0 ? (
                  <p style={{ color: '#a3a3a3' }}>You haven't posted any jobs yet.</p>
                ) : (
                  <div style={{ display: 'grid', gap: 15 }}>
                    {jobs.map((job) => (
                      <div
                        key={job._id}
                        onClick={() => navigate(`/job/${job._id}`)}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div>
                            <h4 style={{ color: '#fbbf24', margin: 0 }}>{job.title}</h4>
                            <p style={{ color: '#a3a3a3', margin: '5px 0' }}>
                              📍 {job.location} • {job.type}
                            </p>
                            <p style={{ color: '#737373', fontSize: 14 }}>
                              Posted {new Date(job.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span style={{
                            background: job.status === 'open' ? '#28a745' : '#dc3545',
                            color: '#fff',
                            padding: '4px 12px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <h3 style={{ color: '#fbbf24', marginBottom: 20 }}>Job Applications</h3>
                {applications.length === 0 ? (
                  <p style={{ color: '#a3a3a3' }}>No applications received yet.</p>
                ) : (
                  <div style={{ display: 'grid', gap: 15 }}>
                    {applications.map((app) => (
                      <div
                        key={app._id}
                        style={{
                          background: '#1a1a1a',
                          padding: 20,
                          borderRadius: 10,
                          border: '1px solid #3a3a3a'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 15 }}>
                          <div>
                            <h4 style={{ color: '#fbbf24', margin: 0 }}>{app.jobId.title}</h4>
                            <p style={{ color: '#a3a3a3', margin: '5px 0' }}>
                              👤 {app.userId.name} • 📧 {app.userId.email}
                            </p>
                            <p style={{ color: '#737373', fontSize: 14 }}>
                              Applied on {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => updateApplicationStatus(app._id, 'accepted')}
                              style={{
                                background: '#28a745',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: 6,
                                cursor: 'pointer',
                                fontSize: 12
                              }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(app._id, 'rejected')}
                              style={{
                                background: '#dc3545',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: 6,
                                cursor: 'pointer',
                                fontSize: 12
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>

                        {app.coverLetter && (
                          <div style={{ marginTop: 15 }}>
                            <h5 style={{ color: '#d4d4d4', margin: 0, marginBottom: 8 }}>Cover Letter:</h5>
                            <p style={{ color: '#a3a3a3', fontSize: 14, lineHeight: 1.4 }}>
                              {app.coverLetter}
                            </p>
                          </div>
                        )}

                        <div style={{ marginTop: 15, paddingTop: 15, borderTop: '1px solid #3a3a3a' }}>
                          <span style={{
                            background: app.status === 'pending' ? '#ffc107' :
                                       app.status === 'reviewed' ? '#007bff' :
                                       app.status === 'accepted' ? '#28a745' : '#dc3545',
                            color: app.status === 'pending' ? '#000' : '#fff',
                            padding: '4px 12px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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

export default EmployerDashboard;