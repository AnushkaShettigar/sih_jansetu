import { useState } from 'react'
import { Image, MapPin } from 'lucide-react'
import ComplaintStatusTimeline from './ComplaintStatusTimeline'

function IssueQueue({ complaints, onStatusChange }) {
  const [sort, setSort] = useState('createdAt')
  const ordered = [...complaints].sort((a, b) => sort === 'severity' ? ['Low', 'Medium', 'High', 'Critical'].indexOf(b.severity) - ['Low', 'Medium', 'High', 'Critical'].indexOf(a.severity) : sort === 'distance' ? a.distance - b.distance : 0)
  return <section className="authority-panel issue-queue"><div className="authority-panel-header"><div><span className="admin-eyebrow">Department queue</span><h2>Assigned complaints</h2></div><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort complaints"><option value="createdAt">Latest first</option><option value="severity">Severity</option><option value="distance">Distance</option></select></div><div className="authority-queue-list">{ordered.map((item) => <article key={item.id}><div className="queue-thumb">{item.image ? <img src={item.image} alt="" /> : <Image size={18} />}</div><div className="queue-main"><div><strong>{item.id}</strong><span className={`authority-badge severity-${item.severity.toLowerCase()}`}>{item.severity}</span></div><h3>{item.category}</h3><p><MapPin size={13} /> {item.location}, {item.city} · {item.distance} km away</p><small>{item.createdAt} · {item.resolutionTime}</small></div><label className="queue-status">Status<select value={item.status} onChange={(event) => onStatusChange(item.id, event.target.value)}><option>Reported</option><option>Verified</option><option>Assigned</option><option>In Progress</option><option>Resolved</option></select></label><ComplaintStatusTimeline status={item.status} /></article>)}</div></section>
}

export default IssueQueue
