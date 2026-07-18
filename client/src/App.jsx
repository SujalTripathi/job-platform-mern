import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import SearchResults from './pages/SearchResults'
import CityPage from './pages/CityPage'
import TypePage from './pages/TypePage'
import Login from './Login'
import Register from './Register'
import SavedJobs from './pages/SavedJobs'
import JobDetails from './pages/JobDetails'
import Profile from './pages/Profile'
import AdvancedSearch from './pages/AdvancedSearch'
import EmployerDashboard from './pages/EmployerDashboard'
import JobPosting from './pages/JobPosting'
import { useAuth } from './AuthContext'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <Header />
      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>
      <main>
        <RoutesWrapper />
      </main>
      <Footer />
    </>
  )
}

function RoutesWrapper() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/advanced-search" element={<AdvancedSearch />} />
      <Route path="/by-city" element={<CityPage />} />
      <Route path="/by-type" element={<TypePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/saved" element={<SavedJobs />} />
      <Route path="/job/:id" element={<JobDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/employer-dashboard" element={<EmployerDashboard />} />
      <Route path="/job-posting" element={<JobPosting />} />
    </Routes>
  )
}

export default App
