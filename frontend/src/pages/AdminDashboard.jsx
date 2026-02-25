import React, { useEffect, useState } from 'react'
import Calendar from '../components/Calendar'
import AcceptedList from '../components/AcceptedList'

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
    setStatus('loading')
    fetch('http://localhost:8080/api/requests')
      .then(async res => {
        if (!res.ok) {
          const txt = await res.text()
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
  }, [])

  function handleDecline(recordId) {
    fetch(`http://localhost:8080/api/requests/${recordId}`, { 
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
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
    fetch(`http://localhost:8080/api/requests/${record.id}`, { 
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
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

  return (
    <section>
      <h2>Admin Dashboard</h2>
      <p>View pet walk and sitting requests.</p>

      {acceptedRequests.length > 0 && (
        <div style={{ marginBottom: 24, padding: 12, backgroundColor: '#e8f5e9', borderRadius: 8, border: '1px solid #c8e6c9' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#2e7d32' }}>Accepted Walks & Sittings Calendar</h3>
          <Calendar acceptedRequests={acceptedRequests} />
          <AcceptedList acceptedRequests={acceptedRequests} onRemove={handleRemoveAccepted} />
        </div>
      )}

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
                    <tr onClick={() => setExpandedId(isExpanded ? null : record.id)} style={{ cursor: 'pointer' }}>
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
                      <td style={{ fontWeight: isExpanded ? 'bold' : 'normal' }}>{petNames || 'N/A'}</td>
                    </tr>
                    {isExpanded && pets.length > 0 && (
                      <tr style={{ backgroundColor: '#f9f9f9' }}>
                        <td colSpan={8} style={{ padding: '12px' }}>
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
                          <div style={{ marginTop: '16px', display: 'flex', gap: 8 }}>
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
