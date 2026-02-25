import React, { useState } from 'react'
import RequestForm from '../components/RequestForm'

export default function WalkRequest() {
  const [date, setDate] = useState('')
  const [hour, setHour] = useState('09')
  const [minute, setMinute] = useState('00')
  const [ampm, setAmpm] = useState('AM')
  const [duration, setDuration] = useState('30')
  const [petCount, setPetCount] = useState(0)

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
  const minutes = ['00', '15', '30', '45']

  const today = new Date().toISOString().slice(0, 10)

  // Calculate total price
  const basePrices = {
    '20': 16,
    '30': 23,
    '45': 29,
    '60': 33
  }
  const basePrice = basePrices[duration] || 0
  const additionalPets = Math.max(0, petCount - 1)
  const totalPrice = basePrice + (additionalPets * 10)

  function handleSubmit(payload) {
    if (!date || !hour) {
      alert('Please select a walk date and time.')
      return false
    }
    if (date < today) {
      alert('Please select today or a future date.')
      return false
    }
    // Convert 12-hour hour + AM/PM into 24-hour hour string
    let h = parseInt(hour, 10)
    if (ampm === 'PM') {
      if (h !== 12) h += 12
    } else {
      if (h === 12) h = 0
    }
    const hour24 = String(h).padStart(2, '0')
    const walkTime = `${date}T${hour24}:${minute}`
    const full = { ...payload, walkTime, duration }
    // send to backend and return a promise that resolves/rejects for RequestForm to handle
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
      <h2>Request a Walk</h2>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Walk date
          <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Hour
          <select value={hour} onChange={e => setHour(e.target.value)}>
            {hours.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Minute
          <select value={minute} onChange={e => setMinute(e.target.value)}>
            {minutes.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          AM/PM
          <select value={ampm} onChange={e => setAmpm(e.target.value)}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Duration
          <select value={duration} onChange={e => setDuration(e.target.value)}>
            <option value="20">20 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </label>
      </div>

      <RequestForm 
        serviceName="Walk" 
        onSubmit={handleSubmit} 
        onPetsChange={setPetCount}
        priceBreakdown={petCount > 0 ? (
          <div style={{ marginTop: 12, padding: 12, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Price Breakdown</div>
            <div style={{ marginTop: 8 }}>
              <div>{duration} minute walk: ${basePrice}</div>
              {additionalPets > 0 && (
                <div>Additional pets ({additionalPets} × $10): ${additionalPets * 10}</div>
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
