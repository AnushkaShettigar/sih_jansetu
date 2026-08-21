import { useRef, useState } from 'react'
import { ImagePlus, RefreshCw, Upload, X } from 'lucide-react'

const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxFileSize = 5 * 1024 * 1024

function ImageUpload({ file, onChange }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  function selectFile(nextFile) {
    if (!nextFile) return
    if (!acceptedTypes.includes(nextFile.type)) {
      setError('Please select a JPG, JPEG, PNG or WEBP image.')
      return
    }
    if (nextFile.size > maxFileSize) {
      setError('Please select an image smaller than 5 MB.')
      return
    }
    setError('')
    onChange(nextFile)
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    selectFile(event.dataTransfer.files[0])
  }

  return <div className="complaint-upload">
    <span className="complaint-label">02 <b>EVIDENCE</b></span>
    {file ? <div className="upload-preview">
      <img src={URL.createObjectURL(file)} alt={`Preview of ${file.name}`} />
      <div className="upload-preview-info"><div><strong>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small></div><div className="upload-preview-actions"><button type="button" onClick={() => inputRef.current?.click()} aria-label="Replace photo"><RefreshCw size={15} /></button><button type="button" onClick={() => onChange(null)} aria-label="Remove photo"><X size={16} /></button></div></div>
    </div> : <button type="button" className={`upload-dropzone ${isDragging ? 'is-dragging' : ''}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}><ImagePlus size={23} /><strong>Upload Photo Evidence</strong><span>JPG, PNG or WEBP</span><small><Upload size={13} /> Browse or drop a file</small></button>}
    <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => selectFile(event.target.files[0])} hidden />
    {error && <p className="complaint-field-error" role="alert">{error}</p>}
  </div>
}

export default ImageUpload
