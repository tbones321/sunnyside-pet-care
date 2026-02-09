import React from 'react'

// import all images from src/assets/pet-photos using Vite's glob (eager to get URLs)
const imagesMap = import.meta.glob('../assets/pet-photos/*.{jpg,jpeg,png,gif}', { eager: true, as: 'url' })
const images = Object.values(imagesMap || {})

export default function PhotoMarquee({ width = 220, speed = 30, direction = 'up', reverse = false }) {
  if (!images || images.length === 0) {
    return (
      <div style={{ padding: 12, color: '#666' }}>
        No photos found. Put your images in <strong>frontend/src/assets/pet-photos</strong>.
      </div>
    )
  }

  // Optionally reverse the source order for one side, then duplicate so the scroll can loop seamlessly
  const base = reverse ? [...images].reverse() : images
  const doubled = [...base, ...base]

  const itemStyle = { width: '100%', display: 'block', borderRadius: 8, marginBottom: 12 }

  const trackStyle = { animationDuration: `${speed * images.length}s`, animationDirection: direction === 'down' ? 'reverse' : 'normal' }

  return (
    <div className="photo-marquee-root" style={{ width }}>
      <div className="photo-marquee-track" style={trackStyle}>
        {doubled.map((src, i) => (
          <img key={i} src={src} alt={`pet-${i}`} style={itemStyle} />
        ))}
      </div>
    </div>
  )
}
