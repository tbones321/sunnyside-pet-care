import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Calendar from '../components/Calendar'
import AcceptedList from '../components/AcceptedList'
import PricingSection from '../components/PricingSection'
import { useAuth } from '../contexts/AuthContext'

function formatSchedule(payload) {
  if (payload.walkTime) {
    const duration = payload.duration ? `${payload.duration} min` : 'N/A'
    return `Walk: ${payload.walkTime} (${duration})`
  }
  if (payload.fromDate || payload.toDate) {
    const from = payload.fromDate || '?'
    const to = payload.toDate || '?'
    return `Sitting: ${from} to ${to}`
  }
  return 'N/A'
}

function formatReceivedAt(value) {
  if (!value) return 'N/A'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString()
}

export default function AdminDashboard() {
  const { getAuthToken, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated || !getAuthToken()) {
      navigate('/login')
      return
    }
  }, [isAuthenticated, getAuthToken, navigate])
  const [backgroundFile, setBackgroundFile] = useState(null)
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState(null)
  const [backgroundMessage, setBackgroundMessage] = useState(null)
  
  // Initialize acceptedRequests from localStorage
  const [acceptedRequests, setAcceptedRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('acceptedRequests')
      return saved ? JSON.parse(saved) : []
    } catch (err) {
      console.error('Failed to load accepted requests:', err)
      return []
    }
  })
  const [requests, setRequests] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  // Save accepted requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('acceptedRequests', JSON.stringify(acceptedRequests))
  }, [acceptedRequests])

  useEffect(() => {
    let active = true
    let currentUrl = null

    const cleanup = () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
        currentUrl = null
      }
    }

    const loadBackgroundPreview = async () => {
      try {
        const apiBaseRaw = import.meta.env.VITE_API_BASE_URL || ''
        const apiBase = apiBaseRaw.replace(/\/+$|^\s+|\s+$/g, '')
        const response = await fetch(`${apiBase}/api/settings/background-image`)
        if (!response.ok) {
          cleanup()
          setBackgroundPreviewUrl(null)
          return
        }
        const blob = await response.blob()
        cleanup()
        currentUrl = URL.createObjectURL(blob)
        if (active) {
          setBackgroundPreviewUrl(currentUrl)
        }
      } catch (err) {
        console.error('Failed to load background image preview:', err)
        setBackgroundPreviewUrl(null)
      }
    }

    loadBackgroundPreview()
    return () => {
      active = false
      cleanup()
    }
  }, [])

  useEffect(() => {
    let active = true
    setStatus('loading')
    const token = getAuthToken()
    const apiBaseRaw = import.meta.env.VITE_API_BASE_URL || ''
    const apiBase = apiBaseRaw.replace(/\/+$|^\s+|\s+$/g, '')
    fetch(`${apiBase}/api/requests`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(async res => {
        if (!res.ok) {
          const txt = await res.text()
          if (res.status === 401 || txt.includes('Invalid token')) {
            throw new Error('Your session has expired. Please log in again.')
          }
          throw new Error(txt || res.statusText || 'Failed to load requests')
        }
        return res.json()
      })
      .then(data => {
        if (!active) return
        setRequests(Array.isArray(data) ? data : [])
        setStatus('ready')
      })
      .catch(err => {
        if (!active) return
        setError(err && err.message ? err.message : String(err))
        setStatus('error')
      })

    return () => { active = false }
  }, [getAuthToken])

  function handleDecline(recordId) {
    if (!window.confirm('Are you sure you want to delete this request? Consider emailing the client first using the Email Client button.')) {
      return
    }
    const token = getAuthToken()
    const apiBaseRaw = import.meta.env.VITE_API_BASE_URL || ''
    const apiBase = apiBaseRaw.replace(/\/+$|^\s+|\s+$/g, '')
    fetch(`${apiBase}/api/requests/${recordId}`, { 
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    })
      .then(() => {
        setRequests(prev => prev.filter(r => r.id !== recordId))
        setExpandedId(null)
      })
      .catch(err => setError('Failed to decline request'))
  }

  function handleAccept(record) {
    const payload = record.payload || {}
    setAcceptedRequests(prev => [...prev, { ...record, payload }])
    const token = getAuthToken()
    const apiBaseRaw = import.meta.env.VITE_API_BASE_URL || ''
    const apiBase = apiBaseRaw.replace(/\/+$|^\s+|\s+$/g, '')
    fetch(`${apiBase}/api/requests/${record.id}`, { 
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    })
      .then(() => {
        setRequests(prev => prev.filter(r => r.id !== record.id))
        setExpandedId(null)
      })
      .catch(err => setError('Failed to accept request'))
  }

  function handleRemoveAccepted(recordId) {
    setAcceptedRequests(prev => prev.filter(r => r.id !== recordId))
  }

  function handleBackgroundFileChange(event) {
    const file = event.target.files?.[0] ?? null
    setBackgroundFile(file)
    if (backgroundPreviewUrl) {
      URL.revokeObjectURL(backgroundPreviewUrl)
    }
    if (file) {
      setBackgroundPreviewUrl(URL.createObjectURL(file))
    } else {
      setBackgroundPreviewUrl(null)
    }
  }

  async function handleBackgroundUpload(event) {
    event.preventDefault()
    setBackgroundMessage(null)

    if (!backgroundFile) {
      setBackgroundMessage('Please choose an image to upload.')
      return
    }

    const formData = new FormData()
    formData.append('image', backgroundFile)

    try {
    const apiBaseRaw = import.meta.env.VITE_API_BASE_URL || ''
    const apiBase = apiBaseRaw.replace(/\/+$|^\s+|\s+$/g, '')
    const response = await fetch(`${apiBase}/api/settings/background-image`, {
      method: 'POST',
      body: formData
    })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Upload failed')
      }

      setBackgroundMessage('Background image uploaded successfully.')
      window.dispatchEvent(new Event('background-updated'))
    } catch (err) {
      setBackgroundMessage(err.message || 'Failed to upload background image.')
    }
  }

  return (
    <section>
      <h2>Admin Dashboard</h2>
      <p>View pet walk and sitting requests.</p>

      <div style={{ marginBottom: 24, padding: 16, backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 12px 0' }}>Upload Site Background</h3>
        <p style={{ margin: '0 0 12px 0', color: '#444' }}>Choose an image to use as the website background for all pages.</p>
        {backgroundMessage && (
          <div style={{ marginBottom: 12, padding: 10, borderRadius: 8, backgroundColor: 'rgba(232,245,233,0.85)', color: '#2e7d32' }}>
            {backgroundMessage}
          </div>
        )}
        <form onSubmit={handleBackgroundUpload} style={{ display: 'grid', gap: 12 }}>
          <input type="file" accept="image/*" onChange={handleBackgroundFileChange} />
          {backgroundPreviewUrl && (
            <img
              src={backgroundPreviewUrl}
              alt="Background preview"
              style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)' }}
            />
          )}
          <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
            Upload Background Image
          </button>
        </form>
      </div>

      <PricingSection />

      {/* Calendar Section - Always visible */}
      <div style={{ marginBottom: 24, padding: 12, backgroundColor: '#e8f5e9', borderRadius: 8, border: '1px solid #c8e6c9' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#2e7d32' }}>Accepted Walks & Sittings Calendar</h3>
        {acceptedRequests.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No accepted requests yet. Calendar will show scheduled walks and sittings here.</p>
        ) : (
          <>
            <Calendar acceptedRequests={acceptedRequests} />
            <AcceptedList acceptedRequests={acceptedRequests} onRemove={handleRemoveAccepted} />
          </>
        )}
      </div>

      {status === 'loading' && <div>Loading requests...</div>}
      {status === 'error' && <div className="error">{error}</div>}
      {status === 'ready' && requests.length === 0 && (
        <div className="notice">{acceptedRequests.length === 0 ? 'No requests yet.' : 'All requests processed!'}</div>
      )}

      {status === 'ready' && requests.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table className="pets-table admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Received</th>
                <th>Service</th>
                <th>Owner</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Schedule</th>
                <th>Price</th>
                <th>Pets</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(record => {
                const payload = record.payload || {}
                const pets = Array.isArray(payload.pets) ? payload.pets : []
                const petNames = pets.map(p => p.name).filter(Boolean).join(', ')
                const isExpanded = expandedId === record.id

                return (
                  <React.Fragment key={record.id}>
                    <tr className="admin-row" onClick={() => setExpandedId(isExpanded ? null : record.id)} style={{ cursor: 'pointer' }}>
                      <td>{record.id}</td>
                      <td>{formatReceivedAt(record.receivedAt)}</td>
                      <td>{payload.service || 'N/A'}</td>
                      <td>{payload.ownerName || 'N/A'}</td>
                      <td>
                        <div>{payload.phone || 'N/A'}</div>
                        <div>{payload.email || 'N/A'}</div>
                      </td>
                      <td>{payload.address || 'N/A'}</td>
                      <td>{formatSchedule(payload)}</td>
                      <td>{payload.price || 'N/A'}</td>
                      <td style={{ fontWeight: isExpanded ? 'bold' : 'normal' }}>{petNames || 'N/A'}</td>
                    </tr>
                    {isExpanded && pets.length > 0 && (
                      <tr style={{ backgroundColor: '#f9f9f9' }}>
                        <td colSpan={9} style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>Pet Details:</div>
                          {pets.map((pet, idx) => (
                            <div key={idx} style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #ddd' }}>
                              <div><strong>Name:</strong> {pet.name || 'N/A'}</div>
                              <div><strong>Species:</strong> {pet.species || 'N/A'}</div>
                              <div><strong>Breed:</strong> {pet.breed || 'N/A'}</div>
                              <div><strong>Age:</strong> {pet.age || 'N/A'}</div>
                              <div><strong>Size:</strong> {pet.size || 'N/A'}</div>
                              <div><strong>Sex:</strong> {pet.sex || 'N/A'}</div>
                              <div><strong>Weight:</strong> {pet.weight || 'N/A'} lbs</div>
                              <div><strong>Vaccines:</strong> {Array.isArray(pet.vaccines) && pet.vaccines.length > 0 ? pet.vaccines.join(', ') : 'None'}</div>
                              <div><strong>Behaviors:</strong> {Array.isArray(pet.behaviors) && pet.behaviors.length > 0 ? pet.behaviors.join(', ') : 'None'}</div>
                              <div><strong>Notes:</strong> {pet.notes || 'None'}</div>
                            </div>
                          ))}
                          <div style={{ marginBottom: '12px', color: '#8a2b06', fontWeight: 600 }}>
                            Please email the client before accepting this request.
                          </div>
                          <div style={{ marginTop: '16px', display: 'flex', gap: 8 }}>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                const clientEmail = payload.email || ''
                                const subject = encodeURIComponent('Re: Pet Care Service Request')
                                const body = encodeURIComponent(`Hi ${payload.ownerName || 'there'},\n\nI'm following up on your pet care service request.\n\nBest regards\nAnthony Filippo`)
                                const mailtoUrl = `https://compose.mail.yahoo.com/?to=${clientEmail}&subject=${subject}&body=${body}`
                                window.open(mailtoUrl, '_blank')
                              }}
                              style={{ flex: 1 }}
                            >
                              Email Client
                            </button>
                            <button className="btn btn-ghost" onClick={() => handleDecline(record.id)} style={{ flex: 1 }}>Decline</button>
                            <button className="btn btn-success" onClick={() => handleAccept(record)} style={{ flex: 1 }}>Accept</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
