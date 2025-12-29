import React from 'react'
import { Link } from 'react-router-dom'

const TYPES = [
  { id: 'full-time', label: 'Full-time' },
  { id: 'part-time', label: 'Part-time' },
  { id: 'internship', label: 'Internship' }
]

const TypePage = () => (
  <div className="container container-custom mt-5">
    <h2 className="header-title mb-4">Browse by Job Type</h2>
    <div className="d-flex gap-3">
      {TYPES.map((t) => (
        <Link key={t.id} to={`/search?type=${t.id}`} className="btn btn-outline-warning">{t.label}</Link>
      ))}
    </div>
  </div>
)

export default TypePage