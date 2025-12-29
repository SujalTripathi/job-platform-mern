import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobPosting = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    description: '',
    requirements: '',
    skills: '',
    salary: '',
    experience: 'entry-level',
    benefits: '',
    remote: false,
    urgent: false
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setToast({ show: true, message: 'Please login to post a job', type: 'error' });
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const jobData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        postedBy: user._id
      };

      await axios.post('http://localhost:4000/api/jobs', jobData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setToast({ show: true, message: '🎉 Job posted successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error posting job:', error);
      setToast({ show: true, message: '❌ Error posting job. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fbbf24',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '20px', textAlign: 'center' }}>🔒 Access Restricted</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', textAlign: 'center' }}>
          You need to be logged in to post a job
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            color: '#000',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: '0 8px 24px rgba(251, 191, 36, 0.4)',
            transition: 'transform 0.3s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          🚀 Login to Post Jobs
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
          padding: '30px',
          borderRadius: '20px',
          border: '2px solid #2a2a2a'
        }}>
          <h1 style={{
            fontSize: '3rem',
            margin: 0,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
            lineHeight: 1.2
          }}>
            📝 Post Your Job
          </h1>
          <p style={{
            fontSize: '1.2rem',
            margin: '15px 0 0 0',
            color: '#a3a3a3'
          }}>
            Find the perfect candidate for your team
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px',
          gap: '20px'
        }}>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: currentStep >= step ? '#fbbf24' : '#3a3a3a',
                color: currentStep >= step ? '#000' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                transition: 'all 0.3s'
              }}
            >
              {step}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
          padding: '40px',
          borderRadius: '20px',
          border: '2px solid #3a3a3a',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
          {currentStep === 1 && (
            <div>
              <h3 style={{ color: '#fbbf24', marginBottom: '30px', fontSize: '1.8rem' }}>
                📋 Basic Information
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ color: '#fbbf24', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '2px solid #3a3a3a',
                      background: '#1a1a1a',
                      color: '#fff',
                      fontSize: '16px',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                    onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                    placeholder="e.g. Senior React Developer"
                  />
                </div>

                <div>
                  <label style={{ color: '#fbbf24', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '2px solid #3a3a3a',
                      background: '#1a1a1a',
                      color: '#fff',
                      fontSize: '16px',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                    onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                    placeholder="e.g. Tech Corp Inc."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ color: '#fbbf24', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '2px solid #3a3a3a',
                      background: '#1a1a1a',
                      color: '#fff',
                      fontSize: '16px',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                    onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                    placeholder="e.g. New York, NY or Remote"
                  />
                </div>

                <div>
                  <label style={{ color: '#fbbf24', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Job Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '2px solid #3a3a3a',
                      background: '#1a1a1a',
                      color: '#fff',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3a3a3', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="remote"
                    checked={formData.remote}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  🏠 Remote Work Available
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3a3a3', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="urgent"
                    checked={formData.urgent}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  ⚡ Urgent Hiring
                </label>
              </div>

              <button
                type="button"
                onClick={nextStep}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#000',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  float: 'right'
                }}
              >
                Next Step →
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 style={{ color: '#fbbf24', marginBottom: '30px', fontSize: '1.8rem' }}>
                📝 Job Details
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#fbbf24', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '2px solid #3a3a3a',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: '16px',
                    resize: 'vertical',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                  onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                  placeholder="Describe the job responsibilities, what the candidate will do, team structure, etc."
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#fbbf24', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '2px solid #3a3a3a',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: '16px',
                    resize: 'vertical',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                  onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                  placeholder="List the qualifications, education, experience needed, etc."
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    background: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#000',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginLeft: 'auto'
                  }}
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 style={{ color: '#fbbf24', marginBottom: '30px', fontSize: '1.8rem' }}>
                🎯 Final Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ color: '#fbbf24', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '2px solid #3a3a3a',
                      background: '#1a1a1a',
                      color: '#fff',
                      fontSize: '16px',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                    onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                    placeholder="e.g. $80,000 - $120,000"
                  />
                </div>

                <div>
                  <label style={{ color: '#fbbf24', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Experience Level
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '2px solid #3a3a3a',
                      background: '#1a1a1a',
                      color: '#fff',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="entry-level">Entry Level</option>
                    <option value="mid-level">Mid Level (2-5 years)</option>
                    <option value="senior">Senior Level (5+ years)</option>
                    <option value="executive">Executive Level</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#fbbf24', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '2px solid #3a3a3a',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: '16px',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                  onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                  placeholder="e.g. React, Node.js, MongoDB, AWS, Docker"
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ color: '#fbbf24', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Benefits & Perks
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '2px solid #3a3a3a',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: '16px',
                    resize: 'vertical',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                  onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                  placeholder="e.g. Health insurance, flexible hours, remote work, professional development budget"
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    background: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  ← Previous
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? '#6c757d' : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginLeft: 'auto',
                    boxShadow: loading ? 'none' : '0 8px 24px rgba(40, 167, 69, 0.4)'
                  }}
                >
                  {loading ? '🚀 Posting...' : '🚀 Post Job'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Toast */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: toast.type === 'error' ? '#dc3545' : '#28a745',
          color: '#fff',
          padding: '15px 25px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default JobPosting;