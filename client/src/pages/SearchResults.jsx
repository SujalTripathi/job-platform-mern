import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

// API URL - dynamic for production
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const location = searchParams.get('location') || ''
  const type = searchParams.get('type') || ''
  const pageParam = parseInt(searchParams.get('page') || '1', 10)
  const sortParam = searchParams.get('sort') || 'newest'

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(pageParam)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState(sortParam)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_BASE}/jobs`, {
          params: { q, location, type, page: currentPage, limit: 6, sort }
        })
        const data = res.data
        // Support both old array responses and new object responses
        if (Array.isArray(data)) {
          setJobs(data)
          setTotalPages(1)
          setCurrentPage(pageParam)
        } else {
          setJobs(data.jobs || [])
          setTotalPages(data.totalPages || 1)
          setCurrentPage(data.currentPage || pageParam)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [q, location, type, currentPage, sort])

  const updateQuery = (updates) => {
    const newParams = new URLSearchParams(Object.fromEntries(searchParams.entries()))
    Object.entries(updates).forEach(([k, v]) => {
      if (v == null || v === '') newParams.delete(k)
      else newParams.set(k, v)
    })
    setSearchParams(newParams)
  }

  return (
    <div className="container container-custom mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="header-title">Search Results</h2>
        <div>
          <select value={sort} onChange={(e) => { setSort(e.target.value); updateQuery({ sort: e.target.value, page: 1 }); }} className="form-select form-select-sm">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && jobs.length === 0 && <p>No jobs found.</p>}
      <div className="row">
        {jobs.map((job) => (
          <div key={job._id} className="col-12 mb-4">
            <div className="p-4 card-dark rounded">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h4 className="mb-1" style={{ color: '#fbbf24' }}>{job.title}</h4>
                  <div className="text-muted">🏢 {job.company || 'Company'} • 📍 {job.location || 'Location'}</div>
                </div>
                <div className="text-end">
                  <span className="badge bg-warning text-dark">{job.type}</span>
                  <div className="text-muted" style={{ fontSize: 12 }}>{dayjs(job.createdAt).fromNow()}</div>
                </div>
              </div>
              <p className="mb-2" style={{ color: '#d4d4d4' }}>{job.description}</p>
              {job.skills && job.skills.length > 0 && (
                <div className="mt-2">
                  {job.skills.map((s, i) => (
                    <button key={i} onClick={() => updateQuery({ q: s, page: 1 })} className="btn btn-sm btn-outline-warning me-2 mb-2">{s}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
        <button className="btn btn-sm" onClick={() => { if (currentPage > 1) { setCurrentPage(currentPage - 1); updateQuery({ page: currentPage - 1 }); } }} disabled={currentPage <= 1}>Prev</button>
        {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
          const p = i + 1
          return (
            <button key={p} className={`btn btn-sm ${p === currentPage ? 'btn-warning' : 'btn-outline-secondary'}`} onClick={() => { setCurrentPage(p); updateQuery({ page: p }); }}>{p}</button>
          )
        })}
        <button className="btn btn-sm" onClick={() => { if (currentPage < totalPages) { setCurrentPage(currentPage + 1); updateQuery({ page: currentPage + 1 }); } }} disabled={currentPage >= totalPages}>Next</button>
      </div>
    </div>
  )
}

export default SearchResults