import React from 'react'
import { Link } from 'react-router-dom'

const POPULAR = ['Mumbai', 'Bengaluru', 'Delhi', 'Pune', 'Hyderabad', 'Remote']

const CityPage = () => {
  return (
    <div className="container container-custom mt-5">
      <h2 className="header-title mb-4">Browse by City</h2>
      <div className="d-flex flex-wrap gap-3">
        {POPULAR.map((c) => (
          <Link key={c} to={`/search?location=${encodeURIComponent(c)}`} className="btn btn-outline-warning">{c}</Link>
        ))}
      </div>
    </div>
  )
}

export default CityPage