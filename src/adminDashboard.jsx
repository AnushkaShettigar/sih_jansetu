import { BarChart3, Bell, CheckCircle2, ClipboardList, Clock3, FileText, LayoutDashboard, LogOut, Menu, Settings, Users, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearDemoAuth } from './auth'

const reports = [
	{ id: 'JS-2048', title: 'Road damage near Main Market', category: 'Roads', priority: 'High', status: 'Pending', citizen: 'R. Kumar' },
	{ id: 'JS-2047', title: 'Streetlight outage on Lake Road', category: 'Streetlights', priority: 'Medium', status: 'In Progress', citizen: 'A. Singh' },
	{ id: 'JS-2046', title: 'Overflowing community bin', category: 'Garbage', priority: 'Low', status: 'Resolved', citizen: 'P. Das' },
	{ id: 'JS-2045', title: 'Blocked drainage near Ward 12', category: 'Drainage', priority: 'High', status: 'In Progress', citizen: 'M. Devi' },
]
const stats = [['Total Reports', '1,284', ClipboardList], ['Pending', '248', Clock3], ['In Progress', '376', BarChart3], ['Resolved', '660', CheckCircle2]]

function AdminDashboard() {
	const navigate = useNavigate()
	const [sidebarOpen, setSidebarOpen] = useState(false)
	return <main className="admin-page">
		<aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
			<div className="admin-logo"><span>J</span><strong>JANSETU</strong></div>
			<div className="admin-profile"><span>AD</span><div><strong>Admin Desk</strong><small>Jharkhand Civic Services</small></div></div>
			<nav aria-label="Admin navigation">
				<span className="admin-nav-label">Workspace</span>
				<a className="is-active" href="#overview"><LayoutDashboard size={17} /> Overview</a><a href="#reports"><FileText size={17} /> Reports <b>248</b></a><a href="#citizens"><Users size={17} /> Citizens</a>
				<span className="admin-nav-label">System</span><a href="#analytics"><BarChart3 size={17} /> Analytics</a><a href="#settings"><Settings size={17} /> Settings</a>
			</nav>
			<button className="admin-logout" type="button" onClick={() => { clearDemoAuth(); navigate('/login') }}><LogOut size={16} /> Sign out</button>
		</aside>
		<section className="admin-content">
			<header className="admin-topbar"><button className="admin-menu" type="button" aria-label="Toggle sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button><div><span className="admin-eyebrow">Government of Jharkhand / Civic Operations</span><h1>Dashboard overview</h1></div><button className="admin-notification" type="button" aria-label="Notifications"><Bell size={18} /><i /></button></header>
			<div className="admin-welcome"><div><span>Wednesday, 21 August 2026</span><h2>Good morning, Admin Desk.</h2><p>Here is the latest pulse of civic reports across your service area.</p></div><button type="button" onClick={() => navigate('/')} className="admin-public-link">View public site</button></div>
			<div className="admin-stat-grid">{stats.map(([label, value, Icon]) => <article key={label}><div className="admin-stat-icon"><Icon size={18} /></div><span>{label}</span><strong>{value}</strong><small>{label === 'Resolved' ? '+12.4%' : 'Updated today'}</small></article>)}</div>
			<section className="admin-report-panel" id="reports"><div className="admin-panel-heading"><div><span className="admin-eyebrow">Live queue</span><h2>Recent reports</h2></div><button type="button">View all reports <ArrowIcon /></button></div><div className="admin-table-wrap"><table><thead><tr><th>Report</th><th>Category</th><th>Priority</th><th>Status</th><th>Citizen</th></tr></thead><tbody>{reports.map((report) => <tr key={report.id}><td><strong>{report.title}</strong><small>{report.id}</small></td><td>{report.category}</td><td><span className={`admin-badge priority-${report.priority.toLowerCase()}`}>{report.priority}</span></td><td><span className={`admin-badge status-${report.status.toLowerCase().replace(' ', '-')}`}>{report.status}</span></td><td>{report.citizen}</td></tr>)}</tbody></table></div></section>
		</section>
	</main>
}

function ArrowIcon() { return <span className="admin-arrow">-&gt;</span> }

export default AdminDashboard
