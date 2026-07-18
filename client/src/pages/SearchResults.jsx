import React, { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
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
    let isMounted = true;
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_BASE}/jobs`, {
          params: { q, location, type, page: currentPage, limit: 6, sort }
        })
        if (!isMounted) return;
        const data = res.data
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
        if (isMounted) setLoading(false)
      }
    }
    fetch()
    return () => { isMounted = false }
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
    <div className="container py-8 flex-1">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold">Search Results</h2>
        <div>
          <select value={sort} onChange={(e) => { setSort(e.target.value); updateQuery({ sort: e.target.value, page: 1 }); }} className="form-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card skeleton" style={{ height: '200px' }}></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 text-secondary glass-panel">
          No jobs found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="glass-card flex flex-col cursor-pointer" onClick={() => navigate(`/job/${job._id}`)}>
              <div className="flex justify-between items-start mb-4 gap-4">
                <div>
                  <h4 className="text-xl font-bold text-primary mb-1">{job.title}</h4>
                  <div className="text-sm text-secondary">
                    <span>{job.company || 'Company'}</span> • <span>{job.location || 'Location'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="badge badge-warning whitespace-nowrap mb-2">{job.type}</span>
                  <div className="text-xs text-muted">{dayjs(job.createdAt).fromNow()}</div>
                </div>
              </div>
              <p className="text-muted text-sm mb-4 flex-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {job.description}
              </p>
              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {job.skills.map((s, i) => (
                    <span 
                      key={i} 
                      onClick={(e) => { e.stopPropagation(); updateQuery({ q: s, page: 1 }); }} 
                      className="badge badge-neutral cursor-pointer hover:bg-opacity-20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="btn btn-secondary btn-sm" onClick={() => { if (currentPage > 1) { setCurrentPage(currentPage - 1); updateQuery({ page: currentPage - 1 }); } }} disabled={currentPage <= 1}>Prev</button>
          {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
            const p = i + 1
            return (
              <button key={p} className={`btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setCurrentPage(p); updateQuery({ page: p }); }}>{p}</button>
            )
          })}
          <button className="btn btn-secondary btn-sm" onClick={() => { if (currentPage < totalPages) { setCurrentPage(currentPage + 1); updateQuery({ page: currentPage + 1 }); } }} disabled={currentPage >= totalPages}>Next</button>
        </div>
      )}
    </div>
  )
}

export default SearchResults