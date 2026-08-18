import React, { useEffect, useState } from 'react'
import RequestForm from '../components/RequestForm'

export default function SittingRequest() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [petCount, setPetCount] = useState(0)
  const [extraPetFee, setExtraPetFee] = useState(20)
  const [pricingError, setPricingError] = useState(null)

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || ''
    fetch(`${apiBase}/api/pricing/extra-pet`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
        return res.json()
      })
      .then(data => {
        if (data && typeof data.sittingExtraPetPrice === 'number') {
          setExtraPetFee(data.sittingExtraPetPrice)
        } else {
          console.error('Unexpected pricing payload', data)
          setPricingError('Unable to load extra pet fee, using default values. (invalid payload)')
        }
      })
      .catch(err => {
        console.error('Failed to fetch extra pet pricing:', err)
        setPricingError(`Unable to load extra pet fee, using default values. (${err.message})`)
      })
  }, [])

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
  const totalPrice = basePrice + (additionalPets * extraPetFee)

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
    const apiBase = import.meta.env.VITE_API_BASE_URL || ''
    return fetch(`${apiBase}/api/requests`, {
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
      {pricingError && (
        <div style={{ marginBottom: 12, padding: 10, borderRadius: 8, backgroundColor: '#fff4e5', color: '#7a4f01', border: '1px solid #ffdd99' }}>
          {pricingError}
        </div>
      )}

      <div className="date-row">
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
                <div>Additional pets ({additionalPets} × ${extraPetFee.toFixed(2)}): ${ (additionalPets * extraPetFee).toFixed(2) }</div>
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
