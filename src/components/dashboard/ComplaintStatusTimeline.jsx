const statuses = ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved']

function ComplaintStatusTimeline({ status }) {
  const current = Math.max(0, statuses.indexOf(status))
  return <div className="authority-timeline">{statuses.map((item, index) => <div className={index < current ? 'done' : index === current ? 'active' : ''} key={item}><span>{index < current ? '✓' : index === current ? '●' : '○'}</span><small>{item}</small></div>)}</div>
}

export default ComplaintStatusTimeline
