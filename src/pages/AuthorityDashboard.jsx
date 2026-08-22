import { BarChart3, Bell, CheckCircle2, ClipboardList, LogOut, MapPin, Menu, Settings, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearDemoAuth, getDemoUser } from '../auth'
import MockComplaints from '../components/reports/MockComplaints'
import DashboardMap from '../components/dashboard/DashboardMap'
import IssueQueue from '../components/dashboard/IssueQueue'

function AuthorityDashboard() {
  const navigate = useNavigate(); const user = getDemoUser(); const department = user?.department || 'Roads'; const [open, setOpen] = useState(false); const [reports, setReports] = useState(MockComplaints)
  const complaints = useMemo(() => reports.filter((item) => item.department === department), [department, reports])
  const stats = { total: complaints.length, pending: complaints.filter((item) => ['Reported', 'Verified', 'Assigned'].includes(item.status)).length, progress: complaints.filter((item) => item.status === 'In Progress').length, resolved: complaints.filter((item) => item.status === 'Resolved').length }
  const common = complaints.length ? complaints.reduce((a, b) => (a.category > b.category ? a : b)).category : 'No reports'
  function updateStatus(id, status) { setReports((items) => items.map((item) => item.id === id ? { ...item, status } : item)) }
  return <main className="authority-page"><aside className={`authority-sidebar ${open ? 'open' : ''}`}><div className="admin-logo"><span>J</span><strong>JANSETU</strong></div><div className="authority-identity"><span>AUTH</span><strong>{department} Department</strong><small>Authority workspace</small></div><nav><a className="active" href="#overview"><ClipboardList size={16} /> Overview</a><a href="#queue"><MapPin size={16} /> Issue Queue</a><a href="#analytics"><BarChart3 size={16} /> Analytics</a><a href="/settings"><Settings size={16} /> Settings</a></nav><button onClick={() => { clearDemoAuth(); navigate('/login') }}><LogOut size={16} /> Sign out</button></aside><section className="authority-content"><header className="authority-topbar"><button className="authority-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X size={20} /> : <Menu size={20} />}</button><div><span className="admin-eyebrow">Authority workspace / Department operations</span><h1>{department} Department</h1><p>Authority Dashboard · {complaints.length} assigned demo complaints</p></div><Bell size={18} /></header><div className="authority-stat-grid">{[['Total Issues', stats.total, ClipboardList], ['Pending', stats.pending, MapPin], ['In Progress', stats.progress, BarChart3], ['Resolved', stats.resolved, CheckCircle2]].map(([label, value, Icon]) => <article key={label}><Icon size={18} /><span>{label}</span><strong>{value}</strong></article>)}</div><div className="authority-overview" id="analytics"><section className="authority-panel"><span className="admin-eyebrow">Department analytics</span><h2>Operational snapshot</h2><div className="authority-analytics"><div><strong>{common}</strong><small>Most common issue</small></div><div><strong>{complaints[0]?.resolutionTime || '—'}</strong><small>Average resolution time</small></div><div><strong>{new Set(complaints.map((item) => item.location)).size}</strong><small>Areas reporting</small></div></div></section><DashboardMap complaints={complaints} /></div><div id="queue"><IssueQueue complaints={complaints} onStatusChange={updateStatus} /></div></section></main>
}

export default AuthorityDashboard
    