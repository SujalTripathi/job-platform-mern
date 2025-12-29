import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from './context/AuthContext'
import './App.css'

const API = 'http://localhost:5000/api'

function App() {
  const { user } = useContext(AuthContext)
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
      alert('✅ Application submitted successfully!')
    } catch (error) {
      alert('❌ Error applying for job')
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
          <div style={{ fontSize: 48, marginBottom: 20 }}>⚡</div>
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
          <h1 style={{
            fontSize: 64,
            margin: 0,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
            lineHeight: 1.1,
            marginBottom: 20
          }}>
            Find Your Dream Job
            <br />
            <span style={{ fontSize: 48, fontWeight: 700 }}>Today</span>
          </h1>

          <p style={{
            fontSize: 22,
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
          <form onSubmit={handleSearch} style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
            padding: 35,
            borderRadius: 25,
            boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
            border: '2px solid #2a2a2a',
            maxWidth: 700,
            margin: '0 auto',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.5fr 1fr auto',
              gap: 20,
              alignItems: 'center'
            }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#fbbf24', fontSize: 18 }}>🔍</span>
                <input
                  placeholder="Job title, keywords, company..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '18px 18px 18px 50px',
                    border: '2px solid #3a3a3a',
                    borderRadius: 15,
                    fontSize: 16,
                    background: '#0a0a0a',
                    color: '#ffffff',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                  onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#fbbf24', fontSize: 18 }}>📍</span>
                <input
                  placeholder="Location, city, remote..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '18px 18px 18px 50px',
                    border: '2px solid #3a3a3a',
                    borderRadius: 15,
                    fontSize: 16,
                    background: '#0a0a0a',
                    color: '#ffffff',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                  onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                />
              </div>

              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                style={{
                  padding: '18px 18px',
                  border: '2px solid #3a3a3a',
                  borderRadius: 15,
                  fontSize: 16,
                  background: '#0a0a0a',
                  color: '#ffffff',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#000000',
                  padding: '18px 35px',
                  border: 'none',
                  borderRadius: 15,
                  fontSize: 18,
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)'
                  e.target.style.boxShadow = '0 12px 35px rgba(251, 191, 36, 0.6)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.4)'
                }}
              >
                Search Jobs
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
            marginTop: 50,
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#fbbf24' }}>{stats.totalJobs}+</div>
              <div style={{ color: '#a3a3a3', fontSize: 14 }}>Active Jobs</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#007bff' }}>{stats.totalCompanies}+</div>
              <div style={{ color: '#a3a3a3', fontSize: 14 }}>Companies</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#28a745' }}>{stats.totalUsers}+</div>
              <div style={{ color: '#a3a3a3', fontSize: 14 }}>Job Seekers</div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </section>

      {/* Popular Categories */}
      <section style={{ padding: '80px 20px', background: '#0f0f0f' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{
              fontSize: 48,
              margin: 0,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 15
            }}>
              Popular Categories
            </h2>
            <p style={{ color: '#a3a3a3', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
              Explore trending job categories and find opportunities in your field of expertise
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 30
          }}>
            {[
              { name: 'Technology', icon: '💻', count: '250+ jobs', color: '#007bff', gradient: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)' },
              { name: 'Design', icon: '🎨', count: '180+ jobs', color: '#e83e8c', gradient: 'linear-gradient(135deg, #e83e8c 0%, #c82384 100%)' },
              { name: 'Marketing', icon: '📈', count: '220+ jobs', color: '#fd7e14', gradient: 'linear-gradient(135deg, #fd7e14 0%, #e8680d 100%)' },
              { name: 'Finance', icon: '💰', count: '190+ jobs', color: '#28a745', gradient: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)' },
              { name: 'Healthcare', icon: '🏥', count: '160+ jobs', color: '#20c997', gradient: 'linear-gradient(135deg, #20c997 0%, #17a2b8 100%)' },
              { name: 'Education', icon: '📚', count: '140+ jobs', color: '#6f42c1', gradient: 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)' },
              { name: 'Engineering', icon: '⚙️', count: '200+ jobs', color: '#dc3545', gradient: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' },
              { name: 'Sales', icon: '📊', count: '170+ jobs', color: '#ffc107', gradient: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)' }
            ].map((category, index) => (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #262626 100%)',
                  padding: 35,
                  borderRadius: 20,
                  border: '2px solid #3a3a3a',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.4s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = category.color
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${category.color}20`
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a3a'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  fontSize: 60,
                  marginBottom: 20,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}>
                  {category.icon}
                </div>
                <h3 style={{
                  color: '#ffffff',
                  margin: '0 0 10px 0',
                  fontSize: 24,
                  fontWeight: 700
                }}>
                  {category.name}
                </h3>
                <p style={{
                  color: category.color,
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600
                }}>
                  {category.count}
                </p>
              </div>
            ))}
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
              <h2 style={{
                fontSize: 48,
                margin: 0,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 10
              }}>
                Featured Opportunities
              </h2>
              <p style={{
                color: '#a3a3a3',
                fontSize: 18,
                margin: 0,
                maxWidth: 500
              }}>
                Hand-picked positions from top companies hiring now
              </p>
            </div>
            <button
              onClick={() => navigate('/advanced-search')}
              style={{
                background: 'transparent',
                color: '#fbbf24',
                border: '2px solid #fbbf24',
                padding: '15px 30px',
                borderRadius: 25,
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#fbbf24'
                e.target.style.color = '#000'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = '#fbbf24'
                e.target.style.transform = 'translateY(0)'
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
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #262626 100%)',
                  padding: 30,
                  borderRadius: 20,
                  border: '2px solid #3a3a3a',
                  cursor: 'pointer',
                  transition: 'all 0.4s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#fbbf24'
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(251, 191, 36, 0.2)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a3a'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
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

                {job.skills && job.skills.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginBottom: 20
                  }}>
                    {job.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} style={{
                        background: '#3a3a3a',
                        color: '#fbbf24',
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 13,
                        fontWeight: 600
                      }}>
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span style={{
                        background: '#3a3a3a',
                        color: '#737373',
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 13,
                        fontWeight: 600
                      }}>
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
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
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
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
                    style={{
                      background: '#007bff',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: 12,
                      fontSize: 14,
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    📤 Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 20px', background: '#0f0f0f' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{
              fontSize: 48,
              margin: 0,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 15
            }}>
              How It Works
            </h2>
            <p style={{ color: '#a3a3a3', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
              Get started in just 3 simple steps
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 40
          }}>
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up and build your professional profile to showcase your skills and experience.',
                icon: '👤',
                color: '#007bff'
              },
              {
                step: '02',
                title: 'Find Perfect Matches',
                description: 'Browse thousands of job opportunities and use our advanced filters to find your ideal role.',
                icon: '🔍',
                color: '#28a745'
              },
              {
                step: '03',
                title: 'Apply & Get Hired',
                description: 'Submit applications with personalized cover letters and connect with top employers.',
                icon: '🚀',
                color: '#fbbf24'
              }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #262626 100%)',
                  padding: 40,
                  borderRadius: 20,
                  border: '2px solid #3a3a3a',
                  textAlign: 'center',
                  position: 'relative',
                  transition: 'all 0.4s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = item.color
                  e.currentTarget.style.transform = 'translateY(-5px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a3a'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: -20,
                  left: 20,
                  background: item.color,
                  color: '#000',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 900
                }}>
                  {item.step}
                </div>

                <div style={{
                  fontSize: 60,
                  marginBottom: 20,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}>
                  {item.icon}
                </div>

                <h3 style={{
                  color: '#ffffff',
                  margin: '0 0 15px 0',
                  fontSize: 24,
                  fontWeight: 700
                }}>
                  {item.title}
                </h3>

                <p style={{
                  color: '#a3a3a3',
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.6
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{
              fontSize: 48,
              margin: 0,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 15
            }}>
              Success Stories
            </h2>
            <p style={{ color: '#a3a3a3', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
              Real people, real careers transformed
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 30
          }}>
            {[
              {
                name: 'Sarah Johnson',
                role: 'Senior Developer',
                company: 'TechCorp',
                quote: 'Found my dream job in just 2 weeks! The platform made it so easy to connect with the right opportunities.',
                image: '👩‍💻'
              },
              {
                name: 'Michael Chen',
                role: 'Product Manager',
                company: 'InnovateLabs',
                quote: 'The advanced search helped me find exactly what I was looking for. Highly recommend!',
                image: '👨‍💼'
              },
              {
                name: 'Emily Rodriguez',
                role: 'UX Designer',
                company: 'CreativeStudio',
                quote: 'Got multiple offers within a month. The application process was smooth and professional.',
                image: '👩‍🎨'
              }
            ].map((story, index) => (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #262626 100%)',
                  padding: 30,
                  borderRadius: 20,
                  border: '2px solid #3a3a3a',
                  textAlign: 'center',
                  transition: 'all 0.4s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#fbbf24'
                  e.currentTarget.style.transform = 'translateY(-5px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a3a'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  fontSize: 60,
                  marginBottom: 20,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}>
                  {story.image}
                </div>

                <blockquote style={{
                  color: '#d4d4d4',
                  fontSize: 16,
                  lineHeight: 1.6,
                  margin: '0 0 20px 0',
                  fontStyle: 'italic'
                }}>
                  "{story.quote}"
                </blockquote>

                <div>
                  <h4 style={{
                    color: '#fbbf24',
                    margin: '0 0 5px 0',
                    fontSize: 18,
                    fontWeight: 700
                  }}>
                    {story.name}
                  </h4>
                  <p style={{
                    color: '#a3a3a3',
                    margin: 0,
                    fontSize: 14
                  }}>
                    {story.role} at {story.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 48,
            margin: 0,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 20
          }}>
            Ready to Get Started?
          </h2>

          <p style={{
            color: '#a3a3a3',
            fontSize: 18,
            margin: '0 0 40px 0',
            lineHeight: 1.6
          }}>
            Join thousands of professionals who found their perfect career match
          </p>

          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {!user ? (
              <>
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '18px 35px',
                    borderRadius: 25,
                    fontSize: 18,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Join as Job Seeker
                </button>
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '18px 35px',
                    borderRadius: 25,
                    fontSize: 18,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Join as Employer
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/advanced-search')}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#000',
                  border: 'none',
                  padding: '18px 35px',
                  borderRadius: 25,
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Browse Jobs Now
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default App