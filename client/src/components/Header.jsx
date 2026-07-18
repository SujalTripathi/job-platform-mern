import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Notifications from './Notifications'

const Header = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.set('location', city)
    if (type) params.set('type', type)
    navigate(`/search?${params.toString()}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="glass-nav" style={{ padding: '1rem 0' }}>
      <div className="container flex justify-between items-center h-full">
        {/* Logo */}
        <Link to="/" className="text-2xl text-gradient flex items-center gap-2" style={{ fontWeight: 900 }}>
          JobPlatform
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-secondary hover:text-primary">Home</Link>
          <Link to="/advanced-search" className="text-secondary hover:text-primary">Search</Link>
          <Link to="/job-posting" className="text-secondary hover:text-primary">Post Job</Link>
          {user && <Link to="/saved" className="text-secondary hover:text-primary">Saved Jobs</Link>}
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearch} className="flex gap-2 mr-4">
            <input
              placeholder="City..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-input"
              style={{ width: '120px', padding: '0.5rem' }}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>

          {user ? (
            <div className="flex items-center gap-4">
              <Notifications />
              <Link to="/profile" className="text-secondary hover:text-primary">Profile</Link>
              {user.role === 'employer' && (
                <Link to="/employer-dashboard" className="text-secondary hover:text-primary">Dashboard</Link>
              )}
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-panel mt-4 p-4 mx-4 flex-col gap-4" style={{ display: 'flex' }}>
          <Link to="/" className="text-primary" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/advanced-search" className="text-primary" onClick={() => setIsMenuOpen(false)}>Search</Link>
          <Link to="/job-posting" className="text-primary" onClick={() => setIsMenuOpen(false)}>Post Job</Link>
          {user && <Link to="/saved" className="text-primary" onClick={() => setIsMenuOpen(false)}>Saved Jobs</Link>}

          <hr style={{ borderColor: 'var(--glass-border)', margin: '0.5rem 0' }} />

          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <input
              placeholder="City..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <hr style={{ borderColor: 'var(--glass-border)', margin: '0.5rem 0' }} />

          {user ? (
            <div className="flex flex-col gap-2">
              <Link to="/profile" className="text-primary" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              {user.role === 'employer' && (
                <Link to="/employer-dashboard" className="text-primary" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              )}
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Header