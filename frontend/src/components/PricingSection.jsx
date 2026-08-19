import React, { useEffect, useState } from 'react'

export default function PricingSection() {
  // Defaults mirror backend controller defaults so admin and public views remain usable
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
  const [extraPetMessage, setExtraPetMessage] = useState(null)
  const [newForm, setNewForm] = useState({
    serviceType: 'walk',
    durationLabel: '',
    durationMinutes: '',
    price: ''
  })

  useEffect(() => {
    fetchPricing()
    fetchExtraPetPricing()
  }, [])

  function fetchPricing() {
    const apiBaseRaw = import.meta.env.VITE_API_BASE_URL || ''
    const apiBase = apiBaseRaw.replace(/\/+$|^\s+|\s+$/g, '')
    fetch(`${apiBase}/api/pricing`)
      .then(res => res.json())
      .then(data => {
        setPricing(Array.isArray(data) ? data : DEFAULT_PRICING)
        setLoading(false)
        setError(null)
      })
      .catch(err => {
        setError('Failed to load pricing — showing defaults')
        setLoading(false)
        // keep DEFAULT_PRICING
      })
  }

  function fetchExtraPetPricing() {
    const apiBase = import.meta.env.VITE_API_BASE_URL || ''
    fetch(`${apiBase}/api/pricing/extra-pet`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.walkExtraPetPrice === 'number' && typeof data.sittingExtraPetPrice === 'number') {
          setExtraPetFees({ walk: data.walkExtraPetPrice, sitting: data.sittingExtraPetPrice })
        }
      })
      .catch(() => {
        // Ignore this error in admin UI, keep DEFAULT_EXTRA
      })
  }

  function handleUpdateExtraPetPricing(e) {
    e.preventDefault()
    setExtraPetMessage(null)

    const walkFee = parseFloat(extraPetFees.walk)
    const sittingFee = parseFloat(extraPetFees.sitting)
    if (Number.isNaN(walkFee) || Number.isNaN(sittingFee) || walkFee < 0 || sittingFee < 0) {
      setExtraPetMessage('Please enter valid positive extra pet fees.')
      return
    }

    const apiBase = import.meta.env.VITE_API_BASE_URL || ''
    fetch(`${apiBase}/api/pricing/extra-pet`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walkExtraPetPrice: walkFee,
        sittingExtraPetPrice: sittingFee
      })
    })
      .then(async res => {
        if (!res.ok) {
          const txt = await res.text()
          throw new Error(txt || res.statusText || 'Failed to update extra pet fees')
        }
        return res.json()
      })
      .then(data => {
        setExtraPetFees({ walk: data.walkExtraPetPrice, sitting: data.sittingExtraPetPrice })
        setExtraPetMessage('Extra pet fees updated successfully.')
      })
      .catch(() => {
        setExtraPetMessage('Failed to update extra pet fees.')
      })
  }

  function handleAddPricing(e) {
    e.preventDefault()
    if (!newForm.durationLabel || !newForm.durationMinutes || !newForm.price) {
      setError('Please fill in all fields')
      return
    }

    const payload = {
      serviceType: newForm.serviceType,
      durationLabel: newForm.durationLabel,
      durationMinutes: parseInt(newForm.durationMinutes),
      price: parseFloat(newForm.price)
    }

    const apiBase = import.meta.env.VITE_API_BASE_URL || ''
    fetch(`${apiBase}/api/pricing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setPricing(prev => [...prev, data])
        setNewForm({
          serviceType: 'walk',
          durationLabel: '',
          durationMinutes: '',
          price: ''
        })
        setError(null)
      })
      .catch(err => setError('Failed to add pricing'))
  }

  function handleDeletePricing(id) {
    if (!window.confirm('Are you sure you want to delete this pricing option?')) return

    const apiBase = import.meta.env.VITE_API_BASE_URL || ''
    fetch(`${apiBase}/api/pricing/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => {
        setPricing(prev => prev.filter(p => p.id !== id))
      })
      .catch(err => setError('Failed to delete pricing'))
  }

  const walkPricing = pricing.filter(p => p.serviceType === 'walk')
  const sittingPricing = pricing.filter(p => p.serviceType === 'sitting')

  return (
    <div style={{ marginBottom: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, border: '1px solid #ddd' }}>
      <h3 style={{ margin: '0 0 16px 0' }}>Pricing Management</h3>

      {error && <div style={{ color: 'red', marginBottom: 12, padding: 8, backgroundColor: '#ffebee', borderRadius: 4 }}>{error}</div>}

      <form onSubmit={handleUpdateExtraPetPricing} style={{ display: 'grid', gap: 12, marginBottom: 24, padding: 12, background: 'white', borderRadius: 8, border: '1px solid #ddd' }}>
        <h4 style={{ margin: '0 0 12px 0' }}>Extra Pet Fee Settings</h4>
        {extraPetMessage && <div style={{ color: extraPetMessage.includes('Failed') ? '#c62828' : '#2e7d32', padding: 8, borderRadius: 6, backgroundColor: extraPetMessage.includes('Failed') ? '#ffebee' : '#e8f5e9' }}>{extraPetMessage}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            Walk extra pet fee ($)
            <input
              type="number"
              min="0"
              step="0.01"
              value={extraPetFees.walk}
              onChange={e => setExtraPetFees({ ...extraPetFees, walk: e.target.value })}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            Sitting extra pet fee ($)
            <input
              type="number"
              min="0"
              step="0.01"
              value={extraPetFees.sitting}
              onChange={e => setExtraPetFees({ ...extraPetFees, sitting: e.target.value })}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            />
          </label>
        </div>
        <button type="submit" style={{ width: 'fit-content', padding: '10px 16px', backgroundColor: '#1976d2', color: '#fff', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
          Save Extra Pet Fees
        </button>
      </form>

      {loading && <div>Loading pricing...</div>}

      {!loading && (
        <>
          {/* Walk Pricing */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#1976d2' }}>Walk Pricing</h4>
            {walkPricing.length === 0 ? (
              <p style={{ color: '#999' }}>No walk pricing options yet</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                {walkPricing.map(p => (
                  <div key={p.id} style={{ padding: 12, backgroundColor: 'white', borderRadius: 6, border: '1px solid #ddd' }}>
                    <div><strong>{p.durationLabel}</strong></div>
                    <div style={{ fontSize: '14px', color: '#666' }}>{p.durationMinutes} min</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1976d2', margin: '8px 0' }}>${p.price.toFixed(2)}</div>
                    <button
                      onClick={() => handleDeletePricing(p.id)}
                      style={{
                        width: '100%',
                        padding: '6px',
                        backgroundColor: '#ff5252',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sitting Pricing */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#388e3c' }}>Sitting Pricing</h4>
            {sittingPricing.length === 0 ? (
              <p style={{ color: '#999' }}>No sitting pricing options yet</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                {sittingPricing.map(p => (
                  <div key={p.id} style={{ padding: 12, backgroundColor: 'white', borderRadius: 6, border: '1px solid #ddd' }}>
                    <div><strong>{p.durationLabel}</strong></div>
                    <div style={{ fontSize: '14px', color: '#666' }}>{p.durationMinutes} min</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#388e3c', margin: '8px 0' }}>${p.price.toFixed(2)}</div>
                    <button
                      onClick={() => handleDeletePricing(p.id)}
                      style={{
                        width: '100%',
                        padding: '6px',
                        backgroundColor: '#ff5252',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Pricing Form */}
          <div style={{ padding: 12, backgroundColor: 'white', borderRadius: 6, border: '1px solid #ddd' }}>
            <h4 style={{ margin: '0 0 12px 0' }}>Add New Pricing Option</h4>
            <form onSubmit={handleAddPricing} style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Service Type</label>
                <select
                  value={newForm.serviceType}
                  onChange={e => setNewForm({ ...newForm, serviceType: e.target.value })}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                >
                  <option value="walk">Walk</option>
                  <option value="sitting">Sitting</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Duration Label</label>
                <input
                  type="text"
                  placeholder="e.g., 30 min, 1 hour"
                  value={newForm.durationLabel}
                  onChange={e => setNewForm({ ...newForm, durationLabel: e.target.value })}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Duration (minutes)</label>
                <input
                  type="number"
                  placeholder="30"
                  value={newForm.durationMinutes}
                  onChange={e => setNewForm({ ...newForm, durationMinutes: e.target.value })}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Price ($)</label>
                <input
                  type="number"
                  placeholder="15.00"
                  step="0.01"
                  value={newForm.price}
                  onChange={e => setNewForm({ ...newForm, price: e.target.value })}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Add Pricing Option
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
