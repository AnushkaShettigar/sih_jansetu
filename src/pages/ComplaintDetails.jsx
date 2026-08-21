import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Navbar } from '../App'
import Footer from '../components/Footer'
import ComplaintStatus from '../components/reports/ComplaintStatus'
import ComplaintMap from '../components/reports/ComplaintMap'
import MockComplaints from '../components/reports/MockComplaints'

function ComplaintDetails() {
  const { id } = useParams()
  const complaint = MockComplaints.find((item) => item.id === id) || MockComplaints[0]
  const [confirmed, setConfirmed] = useState(false)
  return <div className="complaint-details-page"><Navbar /><main><header className="details-hero"><Link className="complaint-back-link" to="/explore-reports"><ArrowLeft size={15} /> Back to Explore Reports</Link><span className="complaint-kicker">Complaint record / {complaint.id}</span><h1>{complaint.title}</h1><p>{complaint.description}</p></header><section className="details-shell"><div className="details-main"><div className="details-image-placeholder"><span>{complaint.category.slice(0, 2).toUpperCase()}</span><small>Mock evidence preview</small></div><div className="details-copy"><span className="details-category">{complaint.category}</span><h2>Complaint details</h2><p>{complaint.description}</p><div className="details-facts"><span><MapPin size={15} /> {complaint.location}, {complaint.city}</span><span><CalendarDays size={15} /> Reported {complaint.createdAt}</span></div></div></div><aside className="details-sidebar"><div><span>Priority</span><strong className={`report-priority priority-${complaint.priority.toLowerCase()}`}>{complaint.priority}</strong></div><div><span>Current status</span><strong className={`report-status status-${complaint.status.toLowerCase().replace(' ', '-')}`}>{complaint.status}</strong></div><div><span>Citizen confirmations</span><strong>{complaint.confirmations + (confirmed ? 1 : 0)}</strong></div><button className="complaint-primary-button" type="button" onClick={() => setConfirmed(true)} disabled={confirmed}>{confirmed ? 'Issue confirmed' : 'Confirm This Issue'}</button></aside><section className="details-status"><span className="complaint-label">Progress</span><h2>Status timeline</h2><ComplaintStatus status={complaint.status} /></section><section className="details-location"><span className="complaint-label">Location</span><h2>Reported area</h2><ComplaintMap city={complaint.city} complaints={[complaint]} /><div className="details-location-card"><MapPin size={17} /><strong>{complaint.location}, {complaint.city}</strong><span>Coordinates: {complaint.latitude.toFixed(6)}, {complaint.longitude.toFixed(6)}</span></div></section></section></main><Footer /></div>
}

export default ComplaintDetails
