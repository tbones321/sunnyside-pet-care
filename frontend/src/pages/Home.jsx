import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  // Default pricing taken from the current backend defaults so the UI still shows values
  // if the backend is temporarily unavailable/restarting.
  const DEFAULT_PRICING = [
    { id: 1, serviceType: 'walk', durationLabel: '20 min', durationMinutes: 20, price: 17.0 },
    { id: 2, serviceType: 'walk', durationLabel: '30 min', durationMinutes: 30, price: 23.0 },
    { id: 3, serviceType: 'walk', durationLabel: '45 min', durationMinutes: 45, price: 29.0 },
    { id: 4, serviceType: 'walk', durationLabel: '1 hour', durationMinutes: 60, price: 33.0 },
    { id: 5, serviceType: 'sitting', durationLabel: 'Full day (24 hours)', durationMinutes: 1440, price: 70.0 }
  ]
  const DEFAULT_EXTRA = { walk: 10, sitting: 20 }

  const [pricing, setPricing] = useState(DEFAULT_PRICING)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [extraPetFees, setExtraPetFees] = useState(DEFAULT_EXTRA)

  useEffect(() => {
    const apiBaseRaw = import.meta.env.VITE_API_BASE_URL || ''
    const apiBase = apiBaseRaw.replace(/\/+$|^\s+|\s+$/g, '')
    console.log('Fetching pricing data...')
    fetch(`${apiBase}/api/pricing`)
      .then(res => {
        console.log('Pricing response status:', res.status)
        return res.json()
      })
      .then(data => {
        console.log('Pricing data received:', data)
        setPricing(Array.isArray(data) ? data : DEFAULT_PRICING)
        setLoading(false)
        setError(null)
      })
      .catch(err => {
        console.error('Failed to load pricing, using defaults:', err)
        setError('Failed to load pricing — showing default values')
        setLoading(false)
        // keep DEFAULT_PRICING in state so the UI remains usable
      })

    fetch(`${apiBase}/api/pricing/extra-pet`)
      .then(res => {
        console.log('Extra pet response status:', res.status)
        return res.json()
      })
      .then(data => {
        console.log('Extra pet data received:', data)
        if (data && typeof data.walkExtraPetPrice === 'number' && typeof data.sittingExtraPetPrice === 'number') {
          setExtraPetFees({ walk: data.walkExtraPetPrice, sitting: data.sittingExtraPetPrice })
        }
      })
      .catch(err => {
        console.error('Failed to load extra pet fees, using defaults:', err)
        // keep DEFAULT_EXTRA if extra pet fee fetch fails
      })
  }, [])

  const walkPricing = pricing.filter(p => p.serviceType === 'walk')
  const sittingPricing = pricing.filter(p => p.serviceType === 'sitting')

  return (
    <section style={{ textAlign: 'center' }}>
      <h2 className="home-title">Sunny With A Chance Pet Care</h2>
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
        {!loading && (
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
                  <span>+${extraPetFees.walk.toFixed(2)}</span>
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
                  <span>+${extraPetFees.sitting.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}