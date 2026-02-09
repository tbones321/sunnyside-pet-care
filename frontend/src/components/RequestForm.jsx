import React, { useState } from 'react'

export default function RequestForm({ serviceName = 'Service', onSubmit }) {
  const [form, setForm] = useState({ ownerName: '', address: '', email: '', phone: '' })
  const [petForm, setPetForm] = useState({ name: '', species: '', breed: '', age: '', size: 'Medium', sex: 'Unknown', weight: '', vaccines: [], behaviors: [], behaviorOther: '', notes: '' })
  const [pets, setPets] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handlePetChange(e) {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox' && name.startsWith('vaccine-')) {
      const vaccine = name.replace('vaccine-', '')
      setPetForm(prev => {
        const has = prev.vaccines.includes(vaccine)
        return { ...prev, vaccines: has ? prev.vaccines.filter(v => v !== vaccine) : [...prev.vaccines, vaccine] }
      })
      return
    }
    if (type === 'checkbox' && name.startsWith('behavior-')) {
      const behavior = name.replace('behavior-', '')
      setPetForm(prev => {
        const has = prev.behaviors.includes(behavior)
        return { ...prev, behaviors: has ? prev.behaviors.filter(b => b !== behavior) : [...prev.behaviors, behavior] }
      })
      return
    }
    setPetForm(prev => ({ ...prev, [name]: value }))
  }

  function validateAddress(addr) {
    if (!addr) return false
    const s = addr.trim()
    // Expect formats like: "123 Main St, Springfield, IL 62704" or "123 Main St, Springfield, IL, 62704"
    const parts = s.split(',').map(p => p.trim()).filter(Boolean)
    if (parts.length < 3) return false
    // street = parts[0], city = parts[1], the rest should contain state and zip
    const stateZip = parts.slice(2).join(' ')
    const szParts = stateZip.split(/\s+/).filter(Boolean)
    if (szParts.length < 2) return false
    const zip = szParts[szParts.length - 1]
    // US zip simple validation 5 or 5-4
    if (!/^\d{5}(-\d{4})?$/.test(zip)) return false
    // state token is the first token in the stateZip portion
    const stateToken = szParts[0].replace(/[^A-Za-z]/g, '').toUpperCase()
    const states = new Set([
      'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
    ])
    if (!states.has(stateToken)) return false
    return true
  }

  function addPet(e) {
    e && e.preventDefault()
    if (!petForm.name || !petForm.name.trim()) {
      setError("Please provide the pet's name.")
      return
    }
    // Species is optional for Walk and Sitting requests
    if (serviceName && !['walk', 'sitting'].includes(serviceName.toLowerCase())) {
      if (!petForm.species || !petForm.species.trim()) {
        setError("Please provide the pet's species.")
        return
      }
    }
    const species = petForm.species.trim()
    const breed = petForm.breed && petForm.breed.toString().trim() ? petForm.breed.toString().trim() : 'N/A'
    const age = petForm.age && petForm.age.toString().trim() ? petForm.age.toString().trim() : '0'
    const behaviors = petForm.behaviors ? [...petForm.behaviors] : []
    if (petForm.behaviorOther && petForm.behaviorOther.toString().trim()) behaviors.push(petForm.behaviorOther.toString().trim())
    setPets(prev => [...prev, { ...petForm, species, breed, age, behaviors }])
    setPetForm({ name: '', species: '', breed: '', age: '', size: 'Medium', sex: 'Unknown', weight: '', vaccines: [], behaviors: [], behaviorOther: '', notes: '' })
    setError(null)
  }

  function removePet(index) {
    setPets(prev => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!form.ownerName || !form.email || !form.address || !form.address.trim() || !form.phone || !form.phone.trim()) {
      setError('Please provide your name, email, phone, and address.')
      return
    }
    if (!validateAddress(form.address)) {
      setError('Address must include street, city, state, and ZIP (e.g. "123 Main St, Springfield, IL 62704").')
      return
    }
    if (!pets || pets.length === 0) {
      setError('Please add at least one pet to the request.')
      return
    }
    const payload = { service: serviceName, ...form, pets }
    try {
      if (onSubmit) {
        const result = onSubmit(payload)
        // If the page-level handler returns `false`, treat it as a cancelled validation
        if (result === false) return
        if (result && typeof result.then === 'function') {
          result.then(() => setSubmitted(true)).catch(err => setError(err && err.message ? err.message : String(err)))
        } else if (result && typeof result.then !== 'function') {
          // synchronous success
          setSubmitted(true)
        }
      } else {
        console.log('Request submitted:', payload)
        setSubmitted(true)
      }
    } catch (err) {
      setError(err && err.message ? err.message : String(err))
    }
  }

  if (submitted) {
    return (
      <div>
        <p>Thank you — your {serviceName.toLowerCase()} request has been received.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        {error && (
          <div style={{ color: '#721c24', padding: 8, border: '1px solid #f5c6cb', background: '#f8d7da' }}>
            {error}
          </div>
        )}
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <label>
              Owner's name
              <input className="form-input" name="ownerName" value={form.ownerName} onChange={handleChange} required />
            </label>

            <label>
              Email
              <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <label>
              Address
              <input className="form-input" name="address" placeholder="123 Main St, City, ST 12345" value={form.address} onChange={handleChange} required />
            </label>

            <label>
              Phone number
              <input className="form-input" name="phone" value={form.phone} onChange={handleChange} required />
            </label>
          </div>
        </div>

        <fieldset style={{ marginTop: 12, padding: 8 }}>
          <legend>Add a Pet</legend>
          <div className="pet-grid">
            <div className="pet-form" style={{ display: 'grid', gap: 8 }}>
              <label>
                Pet's name
                <input className="form-input" name="name" value={petForm.name} onChange={handlePetChange} />
              </label>

              <label>
                Species
                <input className="form-input" name="species" value={petForm.species} onChange={handlePetChange} required={serviceName && !['walk', 'sitting'].includes(serviceName.toLowerCase())} />
              </label>

              <label>
                Breed
                <input className="form-input" name="breed" value={petForm.breed} onChange={handlePetChange} />
              </label>

              <label>
                Age
                <input className="form-input" name="age" value={petForm.age} onChange={handlePetChange} />
              </label>

              <label>
                Size
                <select className="form-input" name="size" value={petForm.size} onChange={handlePetChange}>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </label>

              <label>
                Sex
                <select className="form-input" name="sex" value={petForm.sex} onChange={handlePetChange}>
                  <option>Unknown</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </label>

              <label>
                Weight (lbs)
                <input className="form-input" name="weight" value={petForm.weight} onChange={handlePetChange} />
              </label>

              <label style={{ display: 'block' }}>
                Vaccinations
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <label style={{ fontWeight: 400 }}><input type="checkbox" name="vaccine-Rabies" checked={petForm.vaccines.includes('Rabies')} onChange={handlePetChange} /> Rabies</label>
                  <label style={{ fontWeight: 400 }}><input type="checkbox" name="vaccine-DHPP" checked={petForm.vaccines.includes('DHPP')} onChange={handlePetChange} /> DHPP</label>
                  <label style={{ fontWeight: 400 }}><input type="checkbox" name="vaccine-Bordetella" checked={petForm.vaccines.includes('Bordetella')} onChange={handlePetChange} /> Bordetella</label>
                </div>
              </label>

              <label style={{ display: 'block' }}>
                Behavior / Triggers
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  <label style={{ fontWeight: 400 }}><input type="checkbox" name="behavior-Barks" checked={petForm.behaviors.includes('Barks')} onChange={handlePetChange} /> Barks</label>
                  <label style={{ fontWeight: 400 }}><input type="checkbox" name="behavior-Aggressive" checked={petForm.behaviors.includes('Aggressive')} onChange={handlePetChange} /> Aggressive</label>
                  <label style={{ fontWeight: 400 }}><input type="checkbox" name="behavior-FriendlyWithDogs" checked={petForm.behaviors.includes('FriendlyWithDogs')} onChange={handlePetChange} /> Friendly with dogs</label>
                  <label style={{ fontWeight: 400 }}><input type="checkbox" name="behavior-LeashReactive" checked={petForm.behaviors.includes('LeashReactive')} onChange={handlePetChange} /> Leash reactive</label>
                  <label style={{ fontWeight: 400 }}><input type="checkbox" name="behavior-FoodAggressive" checked={petForm.behaviors.includes('FoodAggressive')} onChange={handlePetChange} /> Food aggressive</label>
                  <label style={{ fontWeight: 400 }}><input type="checkbox" name="behavior-NeedsMedication" checked={petForm.behaviors.includes('NeedsMedication')} onChange={handlePetChange} /> Needs medication</label>
                  <label style={{ fontWeight: 400 }}><input type="checkbox" name="behavior-HouseTrained" checked={petForm.behaviors.includes('HouseTrained')} onChange={handlePetChange} /> House-trained</label>
                  <label style={{ fontWeight: 400 }}><input type="checkbox" name="behavior-EscapeArtist" checked={petForm.behaviors.includes('EscapeArtist')} onChange={handlePetChange} /> Escape artist</label>
                </div>
                <div style={{ marginTop: 8 }}>
                  <input className="form-input" name="behaviorOther" placeholder="Other behavior/trigger" value={petForm.behaviorOther} onChange={handlePetChange} />
                </div>
              </label>

              <label>
                Notes / Special Instructions
                <textarea className="form-input" name="notes" value={petForm.notes} onChange={handlePetChange} rows={3} />
              </label>

              <div>
                <button className="btn btn-ghost" onClick={addPet} type="button">Add Pet</button>
              </div>
            </div>

            <div className="pet-list" style={{ minWidth: 320 }}>
              <h4 style={{ marginTop: 0 }}>Pets</h4>
              <table className="pets-table">
                <thead>
                  <tr>
                            <th>Name</th>
                            <th>Species</th>
                            <th>Breed</th>
                            <th>Age</th>
                            <th>Size</th>
                            <th>Sex</th>
                            <th>Wt</th>
                            <th>Behaviors</th>
                            <th>Vaccines</th>
                            <th>Notes</th>
                            <th></th>
                  </tr>
                </thead>
                <tbody>
                          {pets.length === 0 ? (
                            <tr><td colSpan={11} style={{ padding: 8, color: '#666' }}>No pets yet</td></tr>
                          ) : (
                            pets.map((p, i) => (
                              <tr key={i}>
                                <td style={{ padding: '6px 0' }}>{p.name}</td>
                                <td style={{ padding: '6px 0' }}>{p.species}</td>
                                <td style={{ padding: '6px 0' }}>{p.breed}</td>
                                <td style={{ padding: '6px 0' }}>{p.age}</td>
                                <td style={{ padding: '6px 0' }}>{p.size}</td>
                                <td style={{ padding: '6px 0' }}>{p.sex}</td>
                                <td style={{ padding: '6px 0' }}>{p.weight}</td>
                                <td style={{ padding: '6px 0' }}>{p.behaviors ? p.behaviors.join(', ') : ''}</td>
                                <td style={{ padding: '6px 0' }}>{p.vaccines ? p.vaccines.join(', ') : ''}</td>
                                <td style={{ padding: '6px 0', maxWidth: 160 }}>{p.notes ? (p.notes.length > 60 ? p.notes.slice(0, 57) + '...' : p.notes) : ''}</td>
                                <td style={{ padding: '6px 0' }}><button type="button" onClick={() => removePet(i)}>Remove</button></td>
                              </tr>
                            ))
                          )}
                </tbody>
              </table>
            </div>
          </div>
        </fieldset>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={pets.length === 0}>Submit Request</button>
          {pets.length === 0 && (
            <div style={{ color: '#856404', marginTop: 8 }}>Add at least one pet before submitting.</div>
          )}
        </div>
      </form>
    </div>
  )
}
