import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [searchTitle, setSearchTitle] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [searchType, setSearchType] = useState('')
  const [stats, setStats] = useState({ totalJobs: 0, totalCompanies: 0, totalUsers: 0 })
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.allSettled([
          axios.get(`${API}/stats`),
          axios.get(`${API}/jobs?limit=6&featured=true`)
        ])
        
        if (isMounted) {
          if (statsRes.status === 'fulfilled') {
            setStats(statsRes.value.data)
          }
          if (jobsRes.status === 'fulfilled') {
            setFeaturedJobs(jobsRes.value.data.jobs || [])
          }
        }
      } catch (error) {
        console.error('Error loading home data:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    
    fetchData()
    return () => { isMounted = false }
  }, [])

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
    try {
      const token = localStorage.getItem('authToken')
      await axios.post(`${API}/applications`, {
        jobId,
        coverLetter: '',
        resume: 'dummy-resume.pdf'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Application submitted successfully!')
    } catch (error) {
      toast.error('Error applying for job')
    }
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="container text-center pt-16 pb-8" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
          Find Your Dream Job<br/>
          <span className="text-gradient">Today</span>
        </h1>
        
        <p className="text-lg text-secondary mb-12 max-w-2xl mx-auto">
          Connect with top companies and discover opportunities that match your skills and ambitions. Your next career move starts here.
        </p>

        {/* Enhanced Search Bar */}
        <form onSubmit={handleSearch} className="glass-panel p-6 md:p-8 max-w-4xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <input
              placeholder="Job title, keywords..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="form-input"
            />
            <input
              placeholder="Location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="form-input"
            />
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
            </select>
            <button type="submit" className="btn btn-primary h-full">
              Search
            </button>
          </div>
        </form>

        {/* Quick Stats */}
        <div className="flex justify-center flex-wrap gap-4 md:gap-8 mt-12">
          <div className="glass-card flex-1" style={{ minWidth: '150px' }}>
            <div className="text-3xl text-gradient font-bold mb-2">{stats.totalJobs}+</div>
            <div className="text-sm text-secondary">Active Jobs</div>
          </div>
          <div className="glass-card flex-1" style={{ minWidth: '150px' }}>
            <div className="text-3xl text-gradient font-bold mb-2">{stats.totalCompanies}+</div>
            <div className="text-sm text-secondary">Companies</div>
          </div>
          <div className="glass-card flex-1" style={{ minWidth: '150px' }}>
            <div className="text-3xl text-gradient font-bold mb-2">{stats.totalUsers}+</div>
            <div className="text-sm text-secondary">Job Seekers</div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Opportunities</h2>
            <p className="text-secondary">Hand-picked positions from top companies hiring now</p>
          </div>
          <button onClick={() => navigate('/advanced-search')} className="btn btn-secondary hidden md:flex">
            View All Jobs
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card skeleton" style={{ height: '250px' }}></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <div key={job._id} className="glass-card flex flex-col cursor-pointer" onClick={() => navigate(`/job/${job._id}`)}>
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="text-xl font-bold text-primary mb-2">{job.title}</h3>
                    <span className="badge badge-info whitespace-nowrap">{job.type}</span>
                  </div>
                  <div className="text-sm text-secondary mb-4 flex gap-4">
                    <span>{job.company}</span>
                    <span>{job.location}</span>
                  </div>
                  <p className="text-muted text-sm mb-6 flex-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.description}
                  </p>
                  <div className="flex gap-4 mt-auto">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleApply(job._id); }}
                      className="btn btn-primary flex-1"
                    >
                      {user ? 'Apply Now' : 'Login to Apply'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-secondary">
                No featured jobs available at the moment.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home