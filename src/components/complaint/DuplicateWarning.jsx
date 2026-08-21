function DuplicateWarning({ visible = false, onContinue, onViewSimilar }) {
  if (!visible) return null

  return <aside className="duplicate-warning" role="alert">
    <strong>Similar reports found nearby</strong>
    <p>A similar complaint may already exist in this area.</p>
    <div><button type="button" onClick={onViewSimilar}>View Similar Reports</button><button type="button" onClick={onContinue}>Continue Anyway</button></div>
  </aside>
}

export default DuplicateWarning
