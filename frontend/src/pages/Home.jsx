import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section style={{ textAlign: 'center' }}>
      <h2 className="home-title">Sunnyside Pet Care</h2>
      <p className="home-subtitle">We care for your pets like family. Choose a service to get started.</p>
      <div className="home-actions">
        <Link to="/request-walk" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
          Request a Walk
        </Link>
        <Link to="/request-sitting" className="btn btn-success btn-lg" style={{ textDecoration: 'none' }}>
          Request a Sitting
        </Link>
      </div>
      
    </section>
  )
}
