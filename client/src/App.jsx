import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import SearchResults from './pages/SearchResults'
import CityPage from './pages/CityPage'
import TypePage from './pages/TypePage'

function App() {
  return (
    <>
      <Header />
      <RoutesWrapper />
    </>
  )
}

function RoutesWrapper() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/by-city" element={<CityPage />} />
      <Route path="/by-type" element={<TypePage />} />
    </Routes>
  )
}

// --- the original Home content is preserved here ---
import { useEffect, useState } from 'react'
const API = 'http://localhost:4000/api'

function Home() {
  const [jobs, setJobs] = useState([])
  const [searchTitle, setSearchTitle] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [searchType, setSearchType] = useState('')
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    skills: '',
    description: ''
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState('newest')

  const loadJobs = async (page = 1, _sort = sort) => {
    try {
      const params = new URLSearchParams({
        q: searchTitle,
        location: searchLocation,
        type: searchType,
        page,
        limit: 6,
        sort: _sort
      })
      const response = await fetch(`${API}/jobs?${params}`)
      const data = await response.json()
      // data has { jobs, totalPages, currentPage }
      setJobs(data.jobs || data)
      setTotalPages(data.totalPages || 1)
      setCurrentPage(data.currentPage || page)
    } catch (error) {
      console.log('Error loading jobs')
    }
  }

  useEffect(() => {
    loadJobs(1, sort)
  }, [sort])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (response.ok) {
        alert('✅ Job posted successfully!')
        setForm({ title: '', company: '', location: '', type: 'full-time', skills: '', description: '' })
        loadJobs()
      }
    } catch (error) {
      alert('❌ Error posting job')
    }
  }

  const getTypeColor = (type) => {
    if (type === 'full-time') return '#fbbf24'
    if (type === 'part-time') return '#fcd34d'
    return '#fde68a'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
      padding: '40px 20px'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: 50
      }}>
        <h1 style={{
          fontSize: 48,
          margin: 0,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(251, 191, 36, 0.3)'
        }}>
          ⚡ Job & Internship Platform
        </h1>
        <p style={{ fontSize: 18, marginTop: 10, color: '#a3a3a3' }}>
          Find your dream job or post opportunities
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 40 }}>
        
        {/* Post Job Form */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: 20,
          padding: 40,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          border: '2px solid #2a2a2a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
            <span style={{ fontSize: 32 }}>📝</span>
            <h2 style={{ margin: 0, fontSize: 28, color: '#fbbf24' }}>Post a New Job</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="post-form">
            <div className="two-col">
              <div>
                <label className="form-label">
                  Job Title *
                </label>
                <input
                  required
                  placeholder="e.g. Frontend Developer"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #3a3a3a',
                    borderRadius: 10,
                    fontSize: 15,
                    background: '#0f0f0f',
                    color: '#ffffff',
                    transition: 'border-color 0.3s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                  onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#d4d4d4' }}>
                  Company Name
                </label>
                <input
                  placeholder="e.g. Tech Solutions Inc"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #3a3a3a',
                    borderRadius: 10,
                    fontSize: 15,
                    background: '#0f0f0f',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                  onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                />
              </div>
            </div>

            <div className="two-col">
              <div>
                <label className="form-label">
                  Location
                </label>
                <input
                  placeholder="e.g. Remote / Mumbai"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #3a3a3a',
                    borderRadius: 10,
                    fontSize: 15,
                    background: '#0f0f0f',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                  onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#d4d4d4' }}>
                  Job Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #3a3a3a',
                    borderRadius: 10,
                    fontSize: 15,
                    background: '#0f0f0f',
                    color: '#ffffff',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#d4d4d4' }}>
                Skills (comma separated)
              </label>
              <input
                placeholder="e.g. React, Node.js, MongoDB"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #3a3a3a',
                  borderRadius: 10,
                  fontSize: 15,
                  background: '#0f0f0f',
                  color: '#ffffff',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#d4d4d4' }}>
                Job Description
              </label>
              <textarea
                placeholder="Describe the role, responsibilities, requirements..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #3a3a3a',
                  borderRadius: 10,
                  fontSize: 15,
                  fontFamily: 'inherit',
                  background: '#0f0f0f',
                  color: '#ffffff',
                  outline: 'none',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
              />
            </div>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#000000',
                padding: '16px 32px',
                border: 'none',
                borderRadius: 10,
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 8px 24px rgba(251, 191, 36, 0.4)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              ⚡ Post Job
            </button>
          </form>
        </div>

        {/* Search & Filter */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: 20,
          padding: 30,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          border: '2px solid #2a2a2a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 32 }}>🔍</span>
            <h2 style={{ margin: 0, fontSize: 28, color: '#fbbf24' }}>Browse Jobs</h2>
          </div>

          <div className="search-grid">
            <input
              placeholder="Search by title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '2px solid #3a3a3a',
                borderRadius: 10,
                fontSize: 14,
                background: '#0f0f0f',
                color: '#ffffff',
                outline: 'none'
              }}
            />
            <input
              placeholder="Location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '2px solid #3a3a3a',
                borderRadius: 10,
                fontSize: 14,
                background: '#0f0f0f',
                color: '#ffffff',
                outline: 'none'
              }}
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '2px solid #3a3a3a',
                borderRadius: 10,
                fontSize: 14,
                background: '#0f0f0f',
                color: '#ffffff',
                outline: 'none'
              }}
            >
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
            </select>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => loadJobs(1, sort)}
                style={{
                  background: '#fbbf24',
                  color: '#000000',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{ padding: '10px', borderRadius: 8, background: '#0f0f0f', color: '#fff', border: '1px solid #3a3a3a' }}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          {/* Jobs List */}
          <div style={{ display: 'grid', gap: 20 }}>
            {jobs.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#737373' }}>
                <p style={{ fontSize: 18 }}>📭 No jobs found. Post the first one!</p>
              </div>
            )}
            
            {jobs.map((job) => (
              <div
                key={job._id}
                className="job-card"
                style={{
                  background: 'linear-gradient(135deg, #262626 0%, #1a1a1a 100%)',
                  padding: 24,
                  borderRadius: 15,
                  border: '2px solid #3a3a3a',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#fbbf24'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(251, 191, 36, 0.2)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a3a'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 22, color: '#fbbf24', fontWeight: 600 }}>
                    {job.title}
                  </h3>
                  <span style={{
                    background: getTypeColor(job.type),
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

                {job.skills && job.skills.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    {job.skills.map((skill, i) => (
                      <span key={i} style={{
                        background: '#3a3a3a',
                        color: '#fbbf24',
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 13,
                        fontWeight: 600,
                        border: '1px solid #4a4a4a'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {job.description && (
                  <p style={{ color: '#d4d4d4', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                    {job.description}
                  </p>
                )}
              </div>
            ))}

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
              <button
                className="btn btn-sm"
                onClick={() => {
                  if (currentPage > 1) {
                    loadJobs(currentPage - 1)
                  }
                }}
                disabled={currentPage <= 1}
                style={{ background: '#2b2b2b', color: '#fff', border: '1px solid #3a3a3a' }}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
                const p = i + 1
                return (
                  <button
                    key={p}
                    className={`btn btn-sm ${p === currentPage ? 'btn-warning' : 'btn-outline-secondary'}`}
                    onClick={() => loadJobs(p)}
                    style={{ minWidth: 36 }}
                  >
                    {p}
                  </button>
                )
              })}

              <button
                className="btn btn-sm"
                onClick={() => {
                  if (currentPage < totalPages) {
                    loadJobs(currentPage + 1)
                  }
                }}
                disabled={currentPage >= totalPages}
                style={{ background: '#2b2b2b', color: '#fff', border: '1px solid #3a3a3a' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 60, color: '#737373' }}>
        <p style={{ fontSize: 14 }}>Built with ❤️ using MERN Stack</p>
      </div>
    </div>
  )
}

export default App
