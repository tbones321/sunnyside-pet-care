import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import WalkRequest from './pages/WalkRequest'
import SittingRequest from './pages/SittingRequest'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import PhotoMarquee from './components/PhotoMarquee'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function AppContent() {
  const { isAuthenticated, logout, username } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let currentUrl = null

    const cleanupCurrentUrl = () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
        currentUrl = null
      }
    }

    const loadBackgroundImage = async () => {
      try {
        const apiBaseRaw = import.meta.env.VITE_API_BASE_URL || ''
        const apiBase = apiBaseRaw.replace(/\/+$|^\s+|\s+$/g, '')
        const response = await fetch(`${apiBase}/api/settings/background-image`)
        if (!response.ok) {
          cleanupCurrentUrl()
          return
        }

        const blob = await response.blob()
        cleanupCurrentUrl()
        currentUrl = URL.createObjectURL(blob)
        document.body.style.backgroundImage = `url(${currentUrl})`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
        document.body.style.backgroundRepeat = 'no-repeat'
        document.body.style.backgroundAttachment = 'fixed'
      } catch (error) {
        console.error('Failed to load background image:', error)
      }
    }

    loadBackgroundImage()
    window.addEventListener('background-updated', loadBackgroundImage)

    return () => {
      window.removeEventListener('background-updated', loadBackgroundImage)
      cleanupCurrentUrl()
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app">
      <aside className="photo-column left">
        <PhotoMarquee direction="down" reverse={true} />
      </aside>
      <div className="content">
        <header className="header">
          <h1>Sunny With A Chance Pet Care</h1>
          <button className={"hamburger" + (menuOpen ? " open" : "")} aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
          <nav className={menuOpen ? 'mobile-open' : ''} onClick={() => setMenuOpen(false)}>
            <Link to="/">Home</Link>
            <Link to="/request-walk">Request a Walk</Link>
            <Link to="/request-sitting">Request Sitting</Link>
            <Link to="/admin">Admin Dashboard</Link>
            <Link to="/about">About</Link>
            {isAuthenticated && (
              <div className="auth-section">
                <span className="username">Welcome, {username}</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/request-walk" element={<WalkRequest />} />
            <Route path="/request-sitting" element={<SittingRequest />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
          </Routes>
        </main>
      </div>
      <aside className="photo-column right">
        <PhotoMarquee direction="up" />
      </aside>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}