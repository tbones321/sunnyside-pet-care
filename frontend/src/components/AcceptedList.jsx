import React, { useState } from 'react'

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

export default function AcceptedList({ acceptedRequests = [], onRemove }) {
  const [openIds, setOpenIds] = useState(() => new Set())

  function toggleDetails(recordId) {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(recordId)) next.delete(recordId)
      else next.add(recordId)
      return next
    })
  }

  function handleDelete(recordId) {
    const ok = window.confirm('Are you sure you want to delete this request?')
    if (!ok) return
    if (onRemove) onRemove(recordId)
  }
  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#2e7d32' }}>Accepted Requests List</h3>
      <div style={{ display: 'grid', gap: 12 }}>
        {acceptedRequests.map(record => {
          const payload = record.payload || {}
          const pets = Array.isArray(payload.pets) ? payload.pets : []
          const petNames = pets.map(p => p.name).filter(Boolean).join(', ')
          const isOpen = openIds.has(record.id)

          return (
            <div key={record.id} style={{ padding: 12, backgroundColor: '#fff', borderRadius: 6, border: '1px solid #a5d6a7', display: 'grid', gap: 8 }}>
              <div><strong>{payload.service || 'N/A'}</strong> - {petNames || 'N/A'}</div>
              <div style={{ color: '#555', fontSize: '0.9rem' }}>{payload.ownerName || 'N/A'} ({payload.phone || 'N/A'})</div>
              <div style={{ color: '#1565c0', fontWeight: 500 }}>{formatSchedule(payload)}</div>
              <div style={{ fontSize: '0.85rem', color: '#444' }}>{payload.address || 'N/A'}</div>
              <div style={{ fontSize: '0.85rem', color: '#444' }}>{payload.email || 'N/A'}</div>
              <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #e6e6e6' }}>
                <button className="btn btn-ghost" onClick={() => toggleDetails(record.id)}>
                  {isOpen ? 'Hide Pet Details' : 'Show Pet Details'}
                </button>
                {isOpen && (
                  <div style={{ marginTop: 8 }}>
                    {pets.length === 0 && <div style={{ color: '#666' }}>No pets listed.</div>}
                    {pets.map((pet, idx) => (
                      <div key={idx} style={{ marginBottom: 10, paddingBottom: 8, borderBottom: '1px dashed #e6e6e6' }}>
                        <div><strong>Name:</strong> {pet.name || 'N/A'}</div>
                        <div><strong>Species:</strong> {pet.species || 'N/A'}</div>
                        <div><strong>Breed:</strong> {pet.breed || 'N/A'}</div>
                        <div><strong>Age:</strong> {pet.age || 'N/A'}</div>
                        <div><strong>Size:</strong> {pet.size || 'N/A'}</div>
                        <div><strong>Sex:</strong> {pet.sex || 'N/A'}</div>
                        <div><strong>Weight:</strong> {pet.weight ? `${pet.weight} lbs` : 'N/A'}</div>
                        <div><strong>Vaccines:</strong> {Array.isArray(pet.vaccines) && pet.vaccines.length > 0 ? pet.vaccines.join(', ') : 'None'}</div>
                        <div><strong>Behaviors:</strong> {Array.isArray(pet.behaviors) && pet.behaviors.length > 0 ? pet.behaviors.join(', ') : 'None'}</div>
                        <div><strong>Notes:</strong> {pet.notes || 'None'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {onRemove && (
                <div style={{ marginTop: 4 }}>
                  <button className="btn btn-danger" onClick={() => handleDelete(record.id)}>Delete</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
