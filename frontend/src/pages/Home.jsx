import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [pricing, setPricing] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8080/api/pricing')
      .then(res => res.json())
      .then(data => {
        setPricing(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load pricing')
        setLoading(false)
      })
  }, [])

  const walkPricing = pricing.filter(p => p.serviceType === 'walk')
  const sittingPricing = pricing.filter(p => p.serviceType === 'sitting')

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

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '2px solid #e0e0e0' }}>
        <h3 style={{ marginTop: 0 }}>Pricing</h3>
        {loading && <div>Loading pricing...</div>}
        {error && <div style={{ color: 'red', padding: 12, backgroundColor: '#ffebee', borderRadius: 4 }}>{error}</div>}
        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 800, margin: '0 auto' }}>
            {/* Walk Pricing */}
            <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f9f9f9' }}>
              <h4 style={{ marginTop: 0, color: '#2563eb' }}>Dog Walks</h4>
              <div style={{ textAlign: 'left' }}>
                {walkPricing.length === 0 ? (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>No walk pricing available</p>
                ) : (
                  walkPricing.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                      <span>{p.durationLabel}</span>
                      <span style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</span>
                    </div>
                  ))
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#666', fontSize: 14, marginTop: 8 }}>
                  <span>Each additional pet</span>
                  <span>+$10</span>
                </div>
              </div>
            </div>

            {/* Sitting Pricing */}
            <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f9f9f9' }}>
              <h4 style={{ marginTop: 0, color: '#16a34a' }}>Pet Sitting</h4>
              <div style={{ textAlign: 'left' }}>
                {sittingPricing.length === 0 ? (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>No sitting pricing available</p>
                ) : (
                  sittingPricing.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                      <span>{p.durationLabel}</span>
                      <span style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</span>
                    </div>
                  ))
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#666', fontSize: 14, marginTop: 8 }}>
                  <span>Each additional pet</span>
                  <span>+$10</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}