import { ArrowUpRight, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplaintStatus from './ComplaintStatus'

function ComplaintCard({ complaint }) {
  const [confirmed, setConfirmed] = useState(false)
  return <article className="report-card-item">
    <Link className="report-card-main" to={`/complaint/${complaint.id}`}>
      <div className="report-card-placeholder" aria-hidden="true"><span>{complaint.category.slice(0, 2).toUpperCase()}</span></div>
      <div className="report-card-content"><div className="report-card-meta"><span>{complaint.category}</span><b className={`report-priority priority-${complaint.priority.toLowerCase()}`}>{complaint.priority} priority</b></div><h2>{complaint.title}</h2><p>{complaint.description}</p><div className="report-card-location"><MapPin size={14} /> {complaint.location}, {complaint.city}</div><div className="report-card-footer"><span>{complaint.createdAt}</span><span className={`report-status status-${complaint.status.toLowerCase().replace(' ', '-')}`}>{complaint.status}</span></div></div>
    </Link>
    <div className="report-card-confirm"><button type="button" className={confirmed ? 'is-confirmed' : ''} onClick={() => setConfirmed(true)} disabled={confirmed}>{confirmed ? 'Issue confirmed' : 'Confirm This Issue'}</button><span>{complaint.confirmations + (confirmed ? 1 : 0)} citizens confirmed</span><Link to={`/complaint/${complaint.id}`} aria-label={`View ${complaint.title}`}>View Complaint <ArrowUpRight size={14} /></Link></div>
    <ComplaintStatus status={complaint.status} />
  </article>
}

export default ComplaintCard
