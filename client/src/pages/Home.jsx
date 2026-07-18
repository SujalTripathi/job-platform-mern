import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Updated state variables for the new advanced home page
  const [searchTitle, setSearchTitle] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [searchType, setSearchType] = useState('')
  const [stats, setStats] = useState({ totalJobs: 0, totalCompanies: 0, totalUsers: 0 })
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`)
      setStats(response.data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs?limit=6&featured=true`)
      setFeaturedJobs(response.data.jobs || [])
    } catch (error) {
      console.error('Error loading jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchTitle) params.set('q', searchTitle)
    if (searchLocation) params.set('location', searchLocation)
    if (searchType) params.set('type', searchType)
    navigate(`/search?${params.toString()}`)
  }

  const handleApply = async (jobId) => {
    if (!user) {
      navigate('/login')
      return
    }
    const coverLetter = prompt('Enter cover letter (optional):')
    try {
      const token = localStorage.getItem('authToken')
      await axios.post(`${API}/applications`, {
        jobId,
        coverLetter: coverLetter || '',
        resume: 'dummy-resume.pdf'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Application submitted successfully!')
    } catch (error) {
      toast.error('Error applying for job')
    }
  }

  useEffect(() => {
    loadJobs()
    loadStats()
  }, [])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fbbf24',
        fontSize: 24
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-float" style={{ fontSize: 48, marginBottom: 20 }}>⚡</div>
          Loading amazing opportunities...
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)'
    }}>
      {/* Hero Section */}
      <section style={{
        padding: '100px 20px 80px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(245, 158, 11, 0.04) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>

        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 className="header-title" style={{
            fontSize: window.innerWidth < 768 ? 36 : window.innerWidth < 1024 ? 48 : 64,
            margin: 0,
            marginBottom: 20
          }}>
            Find Your Dream Job
            <br />
            <span style={{ fontSize: window.innerWidth < 768 ? 28 : window.innerWidth < 1024 ? 36 : 48, fontWeight: 700 }}>Today</span>
          </h1>

          <p style={{
            fontSize: window.innerWidth < 768 ? 16 : 22,
            margin: '0 0 50px 0',
            color: '#d4d4d4',
            lineHeight: 1.6,
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Connect with top companies and discover opportunities that match your skills and ambitions.
            Your next career move starts here.
          </p>

          {/* Enhanced Search Bar */}
          <form className="glass-panel" onSubmit={handleSearch} style={{
            padding: window.innerWidth < 768 ? 20 : 35,
            maxWidth: 700,
            margin: '0 auto'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '2fr 1.5fr 1fr auto',
              gap: window.innerWidth < 768 ? 15 : 20,
              alignItems: 'center'
            }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#fbbf24', fontSize: window.innerWidth < 768 ? 16 : 18 }}>🔍</span>
                <input
                  placeholder="Job title, keywords..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="form-control"
                  style={{
                    paddingLeft: 45
                  }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#fbbf24', fontSize: window.innerWidth < 768 ? 16 : 18 }}>📍</span>
                <input
                  placeholder="Location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="form-control"
                  style={{
                    paddingLeft: 45
                  }}
                />
              </div>

              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="form-select"
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>

              <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: 15 }}>
                Search
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: window.innerWidth < 768 ? 20 : 40,
            marginTop: 50,
            flexWrap: 'wrap'
          }}>
            <div className="glass-panel" style={{ padding: 20, flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: window.innerWidth < 768 ? 24 : 32, fontWeight: 900, color: '#fbbf24' }}>{stats.totalJobs}+</div>
              <div style={{ color: '#a3a3a3', fontSize: 14 }}>Active Jobs</div>
            </div>
            <div className="glass-panel" style={{ padding: 20, flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: window.innerWidth < 768 ? 24 : 32, fontWeight: 900, color: '#007bff' }}>{stats.totalCompanies}+</div>
              <div style={{ color: '#a3a3a3', fontSize: 14 }}>Companies</div>
            </div>
            <div className="glass-panel" style={{ padding: 20, flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: window.innerWidth < 768 ? 24 : 32, fontWeight: 900, color: '#28a745' }}>{stats.totalUsers}+</div>
              <div style={{ color: '#a3a3a3', fontSize: 14 }}>Job Seekers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 50,
            flexWrap: 'wrap',
            gap: 20
          }}>
            <div>
              <h2 className="header-title" style={{
                fontSize: 48,
                margin: 0,
                marginBottom: 10
              }}>
                Featured Opportunities
              </h2>
              <p style={{ color: '#a3a3a3', fontSize: 18, margin: 0, maxWidth: 500 }}>
                Hand-picked positions from top companies hiring now
              </p>
            </div>
            <button
              onClick={() => navigate('/advanced-search')}
              className="btn"
              style={{
                color: '#fbbf24',
                border: '2px solid #fbbf24',
                padding: '10px 30px',
                borderRadius: 25,
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              View All Jobs →
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 30
          }}>
            {featuredJobs.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/job/${job._id}`)}
                className="card-dark"
                style={{
                  padding: 30,
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {/* Job Type Badge */}
                <div style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  background: job.type === 'full-time' ? '#28a745' :
                             job.type === 'part-time' ? '#ffc107' :
                             job.type === 'internship' ? '#007bff' : '#6c757d',
                  color: job.type === 'part-time' ? '#000' : '#fff',
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'capitalize'
                }}>
                  {job.type}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h3 style={{
                    color: '#fbbf24',
                    margin: '0 0 10px 0',
                    fontSize: 24,
                    fontWeight: 700,
                    lineHeight: 1.3
                  }}>
                    {job.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 15,
                    marginBottom: 15
                  }}>
                    <span style={{ color: '#a3a3a3', fontSize: 16 }}>
                      🏢 {job.company}
                    </span>
                    <span style={{ color: '#737373', fontSize: 14 }}>
                      📍 {job.location}
                    </span>
                  </div>
                </div>

                {job.description && (
                  <p style={{
                    color: '#d4d4d4',
                    fontSize: 15,
                    lineHeight: 1.6,
                    margin: '0 0 20px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {job.description}
                  </p>
                )}

                <div style={{
                  display: 'flex',
                  gap: 12,
                  marginTop: 'auto'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleApply(job._id)
                    }}
                    className="btn btn-primary"
                    style={{ flex: 1, borderRadius: 12 }}
                  >
                    {user ? 'Apply Now' : 'Login to Apply'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigator.share ? navigator.share({
                        title: job.title,
                        text: `Check out this job: ${job.title} at ${job.company}`,
                        url: window.location.href
                      }) : navigator.clipboard.writeText(window.location.href)
                    }}
                    className="btn"
                    style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 12 }}
                  >
                    📤 Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home