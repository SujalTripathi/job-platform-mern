import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const [city, setCity] = useState('')
  const [type, setType] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.set('location', city)
    if (type) params.set('type', type)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">⚡ Job Platform</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/by-city">By City</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/by-type">By Type</Link></li>
          </ul>

          <form className="d-flex" onSubmit={handleSearch} role="search">
            <input className="form-control me-2" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <select className="form-select me-2" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Any Type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
            </select>
            <button className="btn btn-warning" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  )
}

export default Header