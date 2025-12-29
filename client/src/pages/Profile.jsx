import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadApplications();
  }, [user, navigate]);

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:4000/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    showToast('Logged out successfully');
  };

  if (!user) {
    return null; // Will redirect to login
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
        Loading profile...
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
        {/* Profile Header */}
        <div style={{
          background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
          padding: 30,
          borderRadius: 15,
          border: '2px solid #3a3a3a',
          marginBottom: 30,
          textAlign: 'center'
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontWeight: 'bold',
            color: '#000',
            margin: '0 auto 20px'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 style={{ color: '#fbbf24', fontSize: 28, margin: 0 }}>{user.name}</h1>
          <p style={{ color: '#a3a3a3', margin: '5px 0' }}>{user.email}</p>
          <span style={{
            background: user.role === 'employer' ? '#28a745' : '#007bff',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'capitalize'
          }}>
            {user.role}
          </span>
          <div style={{ marginTop: 20 }}>
            <button
              onClick={handleLogout}
              style={{
                background: '#dc3545',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
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
              My Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              style={{
                background: activeTab === 'saved' ? '#fbbf24' : 'transparent',
                color: activeTab === 'saved' ? '#000' : '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Saved Jobs
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              style={{
                background: activeTab === 'settings' ? '#fbbf24' : 'transparent',
                color: activeTab === 'settings' ? '#000' : '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ paddingTop: 20 }}>
            {activeTab === 'applications' && (
              <div>
                <h3 style={{ color: '#fbbf24', marginBottom: 20 }}>My Job Applications</h3>
                {applications.length === 0 ? (
                  <p style={{ color: '#a3a3a3' }}>You haven't applied to any jobs yet.</p>
                ) : (
                  <div style={{ display: 'grid', gap: 15 }}>
                    {applications.map((app) => (
                      <div
                        key={app._id}
                        onClick={() => navigate(`/job/${app.jobId._id}`)}
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
                            <h4 style={{ color: '#fbbf24', margin: 0 }}>{app.jobId.title}</h4>
                            <p style={{ color: '#a3a3a3', margin: '5px 0' }}>
                              🏢 {app.jobId.company} • 📍 {app.jobId.location}
                            </p>
                            <p style={{ color: '#737373', fontSize: 14 }}>
                              Applied on {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                          </div>
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

            {activeTab === 'saved' && (
              <div>
                <h3 style={{ color: '#fbbf24', marginBottom: 20 }}>Saved Jobs</h3>
                <p style={{ color: '#a3a3a3' }}>
                  View your saved jobs on the <a href="/saved" style={{ color: '#fbbf24' }}>Saved Jobs</a> page.
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 style={{ color: '#fbbf24', marginBottom: 20 }}>Account Settings</h3>
                <div style={{ color: '#d4d4d4' }}>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Member since:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
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

export default Profile;