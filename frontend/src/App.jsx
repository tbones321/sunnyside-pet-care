import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import WalkRequest from './pages/WalkRequest'
import SittingRequest from './pages/SittingRequest'
import AdminDashboard from './pages/AdminDashboard'
import PhotoMarquee from './components/PhotoMarquee'

export default function App() {
  return (
    <div className="app">
      <aside className="photo-column left">
        <PhotoMarquee direction="down" reverse={true} />
      </aside>
      <div className="content">
        <header className="header">
          <h1>Sunnyside Pet Care</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/request-walk">Request a Walk</Link>
            <Link to="/request-sitting">Request Sitting</Link>
            <Link to="/admin">Admin Dashboard</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/request-walk" element={<WalkRequest />} />
            <Route path="/request-sitting" element={<SittingRequest />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
      <aside className="photo-column right">
        <PhotoMarquee direction="up" />
      </aside>
    </div>
  )
}
