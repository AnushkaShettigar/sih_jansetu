import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ImageUpload from './ImageUpload'
import LocationPicker from './LocationPicker'
import DuplicateWarning from './DuplicateWarning'

const categories = ['Pothole', 'Broken Streetlight', 'Garbage Not Collected', 'Water Leakage', 'Drainage / Waterlogging', 'Damaged Public Infrastructure', 'Normal Street']
const severities = ['Low', 'Medium', 'High', 'Critical']

function ComplaintForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', category: '', severity: 'Medium', safetyRisk: false, additional: '' })
  const [photo, setPhoto] = useState(null)
  const [location, setLocation] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
    setErrors({ ...errors, [name]: '' })
  }

  function validate() {
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Add a short title for this issue.'
    if (!form.description.trim()) nextErrors.description = 'Describe what needs attention.'
    if (!form.category) nextErrors.category = 'Select an issue category.'
    if (!photo) nextErrors.photo = 'Photo evidence is required.'
    if (!location?.coordinates) nextErrors.location = 'Select a location on the map.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function submitComplaint(event) {
    event.preventDefault()
    if (isSubmitting || !validate()) return
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('category', form.category)
      formData.append('severity', form.severity)
      formData.append('safetyRisk', form.safetyRisk)
      formData.append('additional', form.additional)
      
      // Extract formatted address string or default coordinates string
      const locationText = location.address || `${location.coordinates[0].toFixed(4)}, ${location.coordinates[1].toFixed(4)}`
      formData.append('location', locationText)

      if (photo) {
        formData.append('image', photo)
      }

      const response = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to submit complaint to the server.')
      }

      const result = await response.json()

      setSuccess({
        id: result.issue?.customId || `JS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        submittedAt: new Date().toLocaleDateString('en-IN'),
        location,
      })
    } catch (err) {
      console.error('Submission Error:', err)
      alert('Error submitting complaint. Please check if backend server is running.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) return <section className="complaint-success" aria-labelledby="success-title"><div className="success-mark"><CheckCircle2 size={27} /></div><span className="complaint-kicker">Submission received</span><h2 id="success-title">Complaint Submitted Successfully</h2><p>Thank you for helping improve your community.</p><div className="success-details"><div><span>Complaint ID</span><strong>{success.id}</strong></div><div><span>Status</span><strong className="success-text">Submitted</strong></div><div><span>Category</span><strong>{form.category}</strong></div><div><span>Location</span><strong>{success.location.coordinates[0].toFixed(4)}, {success.location.coordinates[1].toFixed(4)}</strong></div></div><div className="success-actions"><a className="complaint-primary-button" href="/">Back to Home</a><button type="button" className="complaint-secondary-button" onClick={() => navigate('/#track')}>View Complaint</button></div></section>

  return <form className="complaint-form" onSubmit={submitComplaint} noValidate>
    <section className="complaint-form-section"><span className="complaint-label">01 <b>ISSUE DETAILS</b></span><div className="complaint-grid"><div className="complaint-field complaint-field-wide"><label htmlFor="complaint-title">Title <em>Required</em></label><input id="complaint-title" name="title" value={form.title} onChange={updateField} placeholder="e.g. Large pothole near Main Road" aria-invalid={Boolean(errors.title)} />{errors.title && <small className="complaint-field-error">{errors.title}</small>}</div><div className="complaint-field complaint-field-wide"><label htmlFor="complaint-description">Description <em>Required</em></label><textarea id="complaint-description" name="description" value={form.description} onChange={updateField} placeholder="Describe the issue, its exact surroundings, and how it affects the community." rows="5" aria-invalid={Boolean(errors.description)} />{errors.description && <small className="complaint-field-error">{errors.description}</small>}</div><div className="complaint-field"><label htmlFor="complaint-category">Category <em>Required</em></label><select id="complaint-category" name="category" value={form.category} onChange={updateField} aria-invalid={Boolean(errors.category)}><option value="">Select a category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>{errors.category && <small className="complaint-field-error">{errors.category}</small>}</div><fieldset className="severity-field"><legend>Severity</legend><div>{severities.map((severity) => <label className={form.severity === severity ? 'is-selected' : ''} key={severity}><input type="radio" name="severity" value={severity} checked={form.severity === severity} onChange={updateField} />{severity}</label>)}</div></fieldset></div></section>
    <section className="complaint-form-section"><ImageUpload file={photo} onChange={setPhoto} />{errors.photo && <small className="complaint-field-error">{errors.photo}</small>}</section>
    <LocationPicker value={location} onChange={setLocation} error={errors.location} />
    <section className="complaint-form-section additional-section"><span className="complaint-label">04 <b>ADDITIONAL INFORMATION</b></span><div className="complaint-field"><label htmlFor="complaint-additional">Anything else we should know? <em>Optional</em></label><textarea id="complaint-additional" name="additional" value={form.additional} onChange={updateField} placeholder="Add any useful context for the civic team." rows="3" /></div><label className="safety-check"><input type="checkbox" name="safetyRisk" checked={form.safetyRisk} onChange={updateField} /><span>This issue poses an immediate safety risk.</span></label></section>
    <DuplicateWarning />
    <div className="complaint-submit-row"><span>Required fields help civic teams respond with clarity.</span><button className="complaint-primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Complaint'} {!isSubmitting && <ArrowRight size={16} />}</button></div>
  </form>
}

export default ComplaintForm