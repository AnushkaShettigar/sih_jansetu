const statuses = ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved']

function ComplaintStatus({ status }) {
  const activeIndex = Math.max(0, statuses.indexOf(status))
  return <div className="report-timeline" aria-label={`Complaint status: ${status}`}>
    {statuses.map((item, index) => <div className={`report-timeline-step ${index < activeIndex ? 'is-complete' : ''} ${index === activeIndex ? 'is-current' : ''}`} key={item}><span>{index < activeIndex ? '✓' : index === activeIndex ? '●' : '○'}</span><small>{item}</small></div>)}
  </div>
}

export default ComplaintStatus
