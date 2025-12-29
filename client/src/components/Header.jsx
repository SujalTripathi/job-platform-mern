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
    <header style={{
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      borderBottom: '1px solid #333',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 70
        }}>
          {/* Logo */}
          <Link to="/" style={{
            fontSize: 24,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            ⚡ Job Platform
          </Link>

          {/* Desktop Navigation */}
          <nav style={{
            display: window.innerWidth < 768 ? 'none' : 'flex',
            alignItems: 'center',
            gap: 30
          }}>
            <Link to="/" style={navLinkStyle}>Home</Link>
            <Link to="/advanced-search" style={navLinkStyle}>Advanced Search</Link>
            <Link to="/job-posting" style={navLinkStyle}>Job Posting</Link>
            <Link to="/by-type" style={navLinkStyle}>By Type</Link>
            {user && <Link to="/saved" style={navLinkStyle}>Saved Jobs</Link>}
          </nav>

          {/* Search Form */}
          <form onSubmit={handleSearch} style={{
            display: window.innerWidth < 768 ? 'none' : 'flex',
            alignItems: 'center',
            gap: 10,
            marginRight: 20
          }}>
            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={searchInputStyle}
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={searchSelectStyle}
            >
              <option value="">Any Type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
            </select>
            <button type="submit" style={searchButtonStyle}>
              Search
            </button>
          </form>

          {/* User Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 15
          }}>
            {user ? (
              <>
                <Link to="/profile" style={navLinkStyle}>Profile</Link>
                {user.role === 'employer' && (
                  <Link to="/employer-dashboard" style={navLinkStyle}>Dashboard</Link>
                )}
                <Notifications />
                <span style={{ color: '#a3a3a3', fontSize: 14 }}>
                  Welcome, {user.name}
                </span>
                <button onClick={handleLogout} style={logoutButtonStyle}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={navLinkStyle}>Login</Link>
                <Link to="/register" style={registerButtonStyle}>Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: window.innerWidth < 768 ? 'block' : 'none',
              background: 'none',
              border: 'none',
              color: '#fbbf24',
              fontSize: 24,
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && window.innerWidth < 768 && (
          <div style={{
            background: '#1a1a1a',
            borderTop: '1px solid #333',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 15
          }}>
            <Link to="/" style={mobileNavLinkStyle} onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/advanced-search" style={mobileNavLinkStyle} onClick={() => setIsMenuOpen(false)}>Advanced Search</Link>
            <Link to="/job-posting" style={mobileNavLinkStyle} onClick={() => setIsMenuOpen(false)}>Job Posting</Link>
            <Link to="/by-type" style={mobileNavLinkStyle} onClick={() => setIsMenuOpen(false)}>By Type</Link>
            {user && <Link to="/saved" style={mobileNavLinkStyle} onClick={() => setIsMenuOpen(false)}>Saved Jobs</Link>}

            <form onSubmit={handleSearch} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 10
            }}>
              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={mobileSearchInputStyle}
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={mobileSearchSelectStyle}
              >
                <option value="">Any Type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
              </select>
              <button type="submit" style={mobileSearchButtonStyle}>
                Search
              </button>
            </form>

            {user ? (
              <>
                <Link to="/profile" style={mobileNavLinkStyle} onClick={() => setIsMenuOpen(false)}>Profile</Link>
                {user.role === 'employer' && (
                  <Link to="/employer-dashboard" style={mobileNavLinkStyle} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                )}
                <span style={{ color: '#a3a3a3', fontSize: 14, textAlign: 'center' }}>
                  Welcome, {user.name}
                </span>
                <button onClick={handleLogout} style={mobileLogoutButtonStyle}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={mobileNavLinkStyle} onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" style={mobileRegisterButtonStyle} onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

// Styles
const navLinkStyle = {
  color: '#d4d4d4',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 500,
  transition: 'color 0.3s',
  padding: '8px 12px',
  borderRadius: 6
}

const searchInputStyle = {
  padding: '8px 12px',
  border: '1px solid #3a3a3a',
  borderRadius: 6,
  background: '#0a0a0a',
  color: '#ffffff',
  fontSize: 14,
  outline: 'none',
  width: 120
}

const searchSelectStyle = {
  padding: '8px 12px',
  border: '1px solid #3a3a3a',
  borderRadius: 6,
  background: '#0a0a0a',
  color: '#ffffff',
  fontSize: 14,
  outline: 'none',
  width: 120
}

const searchButtonStyle = {
  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  color: '#000000',
  border: 'none',
  padding: '8px 16px',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'transform 0.2s'
}

const logoutButtonStyle = {
  background: 'transparent',
  color: '#fbbf24',
  border: '1px solid #fbbf24',
  padding: '6px 12px',
  borderRadius: 6,
  fontSize: 14,
  cursor: 'pointer',
  transition: 'all 0.3s'
}

const registerButtonStyle = {
  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  color: '#000000',
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 600,
  transition: 'transform 0.2s'
}

const mobileNavLinkStyle = {
  color: '#d4d4d4',
  textDecoration: 'none',
  fontSize: 16,
  fontWeight: 500,
  padding: '10px 0',
  borderBottom: '1px solid #333',
  display: 'block'
}

const mobileSearchInputStyle = {
  padding: '12px',
  border: '1px solid #3a3a3a',
  borderRadius: 6,
  background: '#0a0a0a',
  color: '#ffffff',
  fontSize: 16,
  outline: 'none',
  width: '100%'
}

const mobileSearchSelectStyle = {
  padding: '12px',
  border: '1px solid #3a3a3a',
  borderRadius: 6,
  background: '#0a0a0a',
  color: '#ffffff',
  fontSize: 16,
  outline: 'none',
  width: '100%'
}

const mobileSearchButtonStyle = {
  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  color: '#000000',
  border: 'none',
  padding: '12px',
  borderRadius: 6,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  width: '100%'
}

const mobileLogoutButtonStyle = {
  background: 'transparent',
  color: '#fbbf24',
  border: '1px solid #fbbf24',
  padding: '10px',
  borderRadius: 6,
  fontSize: 16,
  cursor: 'pointer',
  width: '100%',
  marginTop: 10
}

const mobileRegisterButtonStyle = {
  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  color: '#000000',
  textDecoration: 'none',
  padding: '12px',
  borderRadius: 6,
  fontSize: 16,
  fontWeight: 600,
  display: 'block',
  textAlign: 'center',
  marginTop: 10
}

export default Header