import React, { useState } from 'react'
import RequestForm from '../components/RequestForm'

export default function SittingRequest() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const today = new Date().toISOString().slice(0, 10)

  function handleSubmit(payload) {
    if (!fromDate || !toDate) {
      alert('Please select both start and end dates for sitting.')
      return false
    }
    if (fromDate < today || toDate < today) {
      alert('Please select today or future dates.')
      return false
    }
    if (toDate < fromDate) {
      alert('End date must be the same or after the start date.')
      return false
    }
    const full = { ...payload, fromDate, toDate }
    // send to backend and return a promise that resolves/rejects so RequestForm can handle errors
    return fetch('http://localhost:8080/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(full)
    }).then(async res => {
      if (res.ok) return
      const txt = await res.text()
      throw new Error(txt || res.statusText || 'Failed to send request')
    }).catch(err => {
      throw err
    })
  }

  return (
    <section>
      <h2>Request a Sitting</h2>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          From date
          <input
            type="date"
            min={today}
            value={fromDate}
            onChange={e => {
              const v = e.target.value
              setFromDate(v)
              if (!toDate || toDate < v) setToDate(v)
            }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          To date
          <input type="date" min={fromDate || today} value={toDate} onChange={e => setToDate(e.target.value)} />
        </label>
      </div>

      <RequestForm serviceName="Sitting" onSubmit={handleSubmit} />
    </section>
  )
}
