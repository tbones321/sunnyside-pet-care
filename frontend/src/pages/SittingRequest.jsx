import React, { useState } from 'react'
import RequestForm from '../components/RequestForm'

export default function SittingRequest() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [petCount, setPetCount] = useState(0)

  const today = new Date().toISOString().slice(0, 10)

  // Calculate number of days (inclusive)
  const calculateDays = () => {
    if (!fromDate || !toDate) return 0
    const from = new Date(fromDate)
    const to = new Date(toDate)
    const diffTime = to - from
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1 // inclusive of both start and end dates
  }

  const numDays = calculateDays()
  const dailyRate = numDays >= 3 ? 60 : 70
  const basePrice = numDays * dailyRate
  const additionalPets = Math.max(0, petCount - 1)
  const totalPrice = basePrice + (additionalPets * 20)

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
    const full = { ...payload, fromDate, toDate, price: `$${totalPrice}` }
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

      <RequestForm 
        serviceName="Sitting" 
        onSubmit={handleSubmit}
        onPetsChange={setPetCount}
        priceBreakdown={petCount > 0 && numDays > 0 ? (
          <div style={{ marginTop: 12, padding: 12, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Price Breakdown</div>
            <div style={{ marginTop: 8 }}>
              <div>{numDays} {numDays === 1 ? 'day' : 'days'} at ${dailyRate}/day: ${basePrice}</div>
              {additionalPets > 0 && (
                <div>Additional pets ({additionalPets} × $20): ${additionalPets * 20}</div>
              )}
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #bae6fd', fontSize: 18, fontWeight: 600 }}>
                Total Price: ${totalPrice}
              </div>
            </div>
          </div>
        ) : null}
      />
    </section>
  )
}
