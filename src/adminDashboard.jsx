import { useCallback, useEffect, useMemo, useState } from 'react'
import { Activity, AlertTriangle, BarChart3, CheckCircle2, ClipboardList, Clock3, FileText, LogOut, Map, Menu, RefreshCw, Search, Settings, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clearDemoAuth, getDemoUser } from './auth'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'

const API_URL = 'http://localhost:5000'
const statusLabels = { reported: 'Reported', verified: 'Verified', assigned: 'Assigned', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed', reopened: 'Reopened' }
const statusOrder = ['reported', 'verified', 'assigned', 'in_progress', 'resolved']
const statusOptions = ['Pending', 'In Progress', 'Resolved']
const severityOrder = ['Low', 'Medium', 'High', 'Critical']

function getStatusLabel(status) {
  if (statusLabels[status]) return statusLabels[status]
  return status || 'Reported'
}

function normalizeReport(report) {
  const status = Object.keys(statusLabels).includes(report.status) ? report.status : ({ Pending: 'reported', 'In Progress': 'in_progress', Resolved: 'resolved' }[report.status] || 'reported')
  return { ...report, id: String(report.id), status, statusLabel: getStatusLabel(status), severity: report.severity || report.priority || 'Medium', location: report.location || 'Location unavailable', city: report.city || '', createdAt: report.createdAt || 'Date unavailable', imageUrl: report.imageUrl || report.image || null }
}

function formatDate(value) {
  if (!value || value === 'Date unavailable') return value
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function AdminMap({ reports, selectedId, onSelect }) {
  const mapped = reports.filter((report) => Number.isFinite(Number(report.latitude)) && Number.isFinite(Number(report.longitude)))
  const center = mapped[0] ? [Number(mapped[0].latitude), Number(mapped[0].longitude)] : [23.3441, 85.3096]
  return <div className="admin-map-wrap"><MapContainer key={center.join('-')} center={center} zoom={mapped.length ? 11 : 12} scrollWheelZoom className="admin-map"><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{mapped.map((report) => <CircleMarker key={report.id} center={[Number(report.latitude), Number(report.longitude)]} radius={selectedId === report.id ? 11 : 8} eventHandlers={{ click: () => onSelect(report.id) }} pathOptions={{ color: report.severity === 'Critical' || report.severity === 'High' ? '#e85d04' : '#2f7d4a', fillColor: report.severity === 'Critical' || report.severity === 'High' ? '#e85d04' : '#2f7d4a', fillOpacity: .82 }}><Popup><strong>{report.title || report.category}</strong><br />{report.category}<br />{report.location}<br />{report.statusLabel} ┬╖ {report.severity}</Popup></CircleMarker>)}</MapContainer>{mapped.length === 0 && <div className="admin-map-empty"><Map size={19} /><strong>Map coordinates are not available</strong><span>Live complaint coordinates will appear here when the API provides them.</span></div>}<div className="admin-map-key"><span><i className="map-dot map-dot-high" /> High priority</span><span><i className="map-dot map-dot-normal" /> Other reports</span></div></div>
}

function StatusTimeline({ status }) {
  const current = statusOrder.indexOf(status)
  return <div className="admin-timeline" aria-label={`Status: ${getStatusLabel(status)}`}>{statusOrder.map((item, index) => <div className={`${index < current ? 'is-done' : ''} ${index === current ? 'is-current' : ''}`} key={item}><span>{index < current ? 'Γ£ô' : index === current ? 'ΓùÅ' : 'Γùï'}</span><small>{getStatusLabel(item)}</small></div>)}</div>
}

function AdminDashboard() {
  const navigate = useNavigate()
  const user = getDemoUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 })
  const [analytics, setAnalytics] = useState({ categories: [], departments: [] })
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true); setError('')
    const token = user?.token
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    try {
      if (!token) throw new Error('Sign in with a backend account to load live complaints.')
      const responses = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/reports`, { headers }),
        fetch(`${API_URL}/api/complaints`, { headers }),
        fetch(`${API_URL}/api/analytics/by-category`, { headers }),
        fetch(`${API_URL}/api/analytics/by-department`, { headers }),
      ])
      if (responses.some((response) => !response.ok)) throw new Error('The live admin API rejected one or more requests.')
      const [statsData, reportData, complaintData, categoryData, departmentData] = await Promise.all(responses.map((response) => response.json()))
      const detailed = complaintData.complaints || []
      const detailById = new Map(detailed.flatMap((item) => [[String(item.id), item], [String(item.customId), item]]))
      const merged = (reportData || []).map((item) => normalizeReport({ ...detailById.get(String(item.id)), ...item, id: item.id }))
      setStats(statsData); setReports(merged); setAnalytics({ categories: categoryData.categories || [], departments: departmentData.departments || [] })
    } catch (loadError) {
      setError(loadError.message); setReports([]); setStats({ total: 0, pending: 0, inProgress: 0, resolved: 0 })
    } finally { setLoading(false) }
  }, [user?.token])

  useEffect(() => {
    const timer = setTimeout(loadDashboard, 0)
    return () => clearTimeout(timer)
  }, [loadDashboard])

  const filteredReports = useMemo(() => reports.filter((report) => {
    const haystack = `${report.id} ${report.title} ${report.category} ${report.location}`.toLowerCase()
    return (!query || haystack.includes(query.toLowerCase())) && (statusFilter === 'All' || report.statusLabel === statusFilter) && (priorityFilter === 'All' || report.severity === priorityFilter)
  }), [priorityFilter, query, reports, statusFilter])

  const categoryCounts = reports.reduce((counts, report) => { counts[report.category] = (counts[report.category] || 0) + 1; return counts }, {})
  const commonIssue = analytics.categories[0]?.category || Object.entries(categoryCounts).sort(([, first], [, second]) => second - first)[0]?.[0] || 'Unavailable'
  const selectedReport = reports.find((report) => report.id === selectedId) || filteredReports[0]

  const updateStatus = async (id, legacyStatus) => {
    const token = user?.token
    if (!token) { setNotice('A backend JWT is required to update complaint status.'); return }
    setUpdatingId(id); setNotice('')
    try {
      const response = await fetch(`${API_URL}/api/admin/reports/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: legacyStatus }) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.message || 'Status update was rejected by the backend.')
      setNotice('Complaint status updated.'); await loadDashboard()
    } catch (updateError) { setNotice(updateError.message) } finally { setUpdatingId(null) }
  }

  const signOut = () => { clearDemoAuth(); navigate('/login') }
  const statCards = [['Total Issues', stats.total, ClipboardList], ['Pending', stats.pending, Clock3], ['In Progress', stats.inProgress, Activity], ['Resolved', stats.resolved, CheckCircle2]]

  return <main className="authority-page admin-live-page"><aside className={`authority-sidebar ${sidebarOpen ? 'open' : ''}`}><div className="admin-logo"><span>J</span><strong>JANSETU</strong></div><div className="authority-identity"><span>ADMIN / CENTRAL OPERATIONS</span><strong>{user?.name || 'Admin Desk'}</strong><small>All departments ┬╖ live workspace</small></div><nav><a className="active" href="#overview"><ClipboardList size={16} /> Overview</a><a href="#map"><Map size={16} /> Civic map</a><a href="#queue"><FileText size={16} /> Issue queue</a><a href="#analytics"><BarChart3 size={16} /> Analytics</a><a href="/settings"><Settings size={16} /> Settings</a></nav><button onClick={signOut}><LogOut size={16} /> Sign out</button></aside><section className="authority-content"><header className="authority-topbar" id="overview"><button className="authority-menu" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle navigation">{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button><div><span className="admin-eyebrow">Government operations / All departments</span><h1>Admin Dashboard</h1><p>One view for the civic issues that need attention now.</p></div><button className="admin-refresh" type="button" onClick={loadDashboard} disabled={loading} title="Refresh live data"><RefreshCw size={17} className={loading ? 'is-spinning' : ''} /></button></header>{error && <div className="admin-api-note" role="alert"><AlertTriangle size={17} /><span>{error}</span><button type="button" onClick={() => navigate('/login')}>Return to login</button></div>}{notice && <div className="admin-action-note" role="status">{notice}</div>}<div className="authority-stat-grid">{statCards.map(([label, value, Icon]) => <article key={label}><Icon size={18} /><span>{label}</span><strong>{Number(value || 0).toLocaleString()}</strong><small>Live from JanSetu API</small></article>)}</div><section className="admin-analytics-strip" id="analytics"><div><span>Most common issue</span><strong>{commonIssue}</strong><small>Based on available category data</small></div><div><span>Categories tracked</span><strong>{analytics.categories.length || 'ΓÇö'}</strong><small>Current analytics response</small></div><div><span>Departments reporting</span><strong>{analytics.departments.length || 'ΓÇö'}</strong><small>Current analytics response</small></div></section><section className="admin-map-panel" id="map"><div className="admin-section-heading"><div><span className="admin-eyebrow">Geographic overview</span><h2>Civic activity map</h2></div><span className="admin-data-label">{reports.filter((report) => Number.isFinite(Number(report.latitude))).length} mapped issues</span></div><AdminMap reports={reports} selectedId={selectedReport?.id} onSelect={setSelectedId} /></section><section className="admin-queue-panel" id="queue"><div className="admin-section-heading admin-queue-heading"><div><span className="admin-eyebrow">Live operations</span><h2>Issue queue</h2></div><div className="admin-filter-controls"><label className="admin-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search complaints" aria-label="Search complaints" /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status"><option>All</option>{['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Reopened'].map((item) => <option key={item}>{item}</option>)}</select><select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} aria-label="Filter by priority"><option>All</option>{severityOrder.map((item) => <option key={item}>{item}</option>)}</select></div></div>{loading ? <div className="admin-empty-state"><RefreshCw size={18} className="is-spinning" /> Loading live complaints...</div> : filteredReports.length === 0 ? <div className="admin-empty-state"><ClipboardList size={18} /> No live complaints match the current filters.</div> : <div className="admin-queue-list">{filteredReports.map((report) => <article className={`admin-queue-item ${selectedReport?.id === report.id ? 'is-selected' : ''}`} key={report.id} onClick={() => setSelectedId(report.id)}><div className={`admin-severity-mark severity-${report.severity.toLowerCase()}`} /><div className="admin-queue-main"><div className="admin-queue-meta"><strong>{report.id}</strong><span className={`admin-status status-${report.statusLabel.toLowerCase().replace(' ', '-')}`}>{report.statusLabel}</span></div><h3>{report.title || report.category}</h3><p>{report.category} ┬╖ {report.location}{report.city ? `, ${report.city}` : ''}</p><small>{formatDate(report.createdAt)} ┬╖ {report.severity} priority</small>{report.imageUrl && <img className="admin-queue-image" src={report.imageUrl.startsWith('http') ? report.imageUrl : `${API_URL}${report.imageUrl}`} alt="Complaint evidence" />}</div><div className="admin-queue-actions"><label>Status<select value={report.statusLabel === 'Reported' || report.statusLabel === 'Verified' || report.statusLabel === 'Assigned' ? 'Pending' : report.statusLabel} disabled={updatingId === report.id} onClick={(event) => event.stopPropagation()} onChange={(event) => updateStatus(report.id, event.target.value)}>{statusOptions.map((item) => <option key={item}>{item}</option>)}</select></label><StatusTimeline status={report.status} /></div></article>)}</div>}</section></section></main>
}

export default AdminDashboard
