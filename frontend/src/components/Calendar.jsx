import React, { useState } from 'react'

function formatSchedule(payload) {
  if (payload.walkTime) {
    const duration = payload.duration ? `${payload.duration}m` : ''
    return `Walk ${duration}`.trim()
  }
  if (payload.fromDate || payload.toDate) {
    return 'Sitting'
  }
  return ''
}

export default function Calendar({ acceptedRequests = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Create array of all dates to display (including prev/next month padding)
  const calendarDays = []
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ date: daysInPrevMonth - i, isCurrentMonth: false })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ date: i, isCurrentMonth: true })
  }
  const remainingDays = 42 - calendarDays.length
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({ date: i, isCurrentMonth: false })
  }

  // Helper: get requests for a specific date
  function getRequestsForDate(day) {
    if (!day.isCurrentMonth) return []
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`
    return acceptedRequests.filter(record => {
      const payload = record.payload || {}
      if (payload.walkTime && payload.walkTime.startsWith(dateStr)) return true
      if (payload.fromDate && payload.toDate) {
        return dateStr >= payload.fromDate && dateStr <= payload.toDate
      }
      return false
    })
  }

  function previousMonth() {
    setCurrentDate(new Date(year, month - 1))
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1))
  }

  const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' })
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button className="btn btn-ghost" onClick={previousMonth} style={{ padding: '6px 12px' }}>← Prev</button>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{monthName}</h3>
        <button className="btn btn-ghost" onClick={nextMonth} style={{ padding: '6px 12px' }}>Next →</button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: 1, 
        backgroundColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid #bbb'
      }}>
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} style={{
            backgroundColor: '#2b7a78',
            color: '#fff',
            padding: 8,
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '0.85rem'
          }}>
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, idx) => {
          const requests = getRequestsForDate(day)
          return (
            <div
              key={idx}
              style={{
                backgroundColor: day.isCurrentMonth ? '#fff' : '#f5f5f5',
                padding: 8,
                minHeight: 100,
                borderRight: (idx + 1) % 7 !== 0 ? '1px solid #ddd' : 'none',
                borderBottom: idx < calendarDays.length - 7 ? '1px solid #ddd' : 'none',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: 4, color: day.isCurrentMonth ? '#000' : '#999' }}>
                {day.date}
              </div>
              <div style={{ fontSize: '0.75rem', flex: 1 }}>
                {requests.map((record, i) => {
                  const payload = record.payload || {}
                  const petNames = Array.isArray(payload.pets) ? payload.pets.map(p => p.name).join(',') : ''
                  const schedule = formatSchedule(payload)
                  return (
                    <div
                      key={i}
                      style={{
                        backgroundColor: schedule.includes('Walk') ? '#89d18f' : '#ffd54f',
                        color: '#000',
                        padding: '2px 4px',
                        marginBottom: 2,
                        borderRadius: 3,
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={`${schedule} - ${petNames}\n${payload.address}`}
                    >
                      {schedule} • {petNames}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 16, display: 'flex', gap: 16, fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#89d18f', borderRadius: 3 }}></div>
          <span>Walk Request</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#ffd54f', borderRadius: 3 }}></div>
          <span>Sitting Request</span>
        </div>
      </div>
    </div>
  )
}
