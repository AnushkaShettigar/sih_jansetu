import { useEffect, useState } from 'react'
import { BarChart3, Bell, CheckCircle2, ClipboardList, Clock3, FileText, LayoutDashboard, LogOut, Menu, Settings, Users, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clearDemoAuth } from './auth'

function AdminDashboard() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Dynamic state for backend integration
  const [reports, setReports] = useState([])
  const [statsData, setStatsData] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 })
  const [loading, setLoading] = useState(true)

  // Fetch real-time data from backend
  const fetchDashboardData = () => {
    Promise.all([
      fetch('http://localhost:5000/api/admin/stats').then((res) => res.json()),
      fetch('http://localhost:5000/api/admin/reports').then((res) => res.json()),
    ])
      .then(([stats, reportList]) => {
        setStatsData(stats)
        setReports(reportList)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error connecting to backend:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Handle inline status update from the admin panel
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchDashboardData() // Refresh list and counters upon change
      }
    } catch (error) {
      console.error('Failed to update report status:', error)
    }
  }

  const stats = [
    ['Total Reports', statsData.total.toLocaleString(), ClipboardList],
    ['Pending', statsData.pending.toLocaleString(), Clock3],
    ['In Progress', statsData.inProgress.toLocaleString(), BarChart3],
    ['Resolved', statsData.resolved.toLocaleString(), CheckCircle2],
  ]

  return (
    <main className="admin-page">
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-logo"><span>J</span><strong>JANSETU</strong></div>
        <div className="admin-profile"><span>AD</span><div><strong>Admin Desk</strong><small>Jharkhand Civic Services</small></div></div>
        <nav aria-label="Admin navigation">
          <span className="admin-nav-label">Workspace</span>
          <a className="is-active" href="#overview"><LayoutDashboard size={17} /> Overview</a>
          <a href="#reports"><FileText size={17} /> Reports <b>{statsData.pending}</b></a>
          <a href="#citizens"><Users size={17} /> Citizens</a>
          <span className="admin-nav-label">System</span>
          <a href="#analytics"><BarChart3 size={17} /> Analytics</a>
          <a href="#settings"><Settings size={17} /> Settings</a>
        </nav>
        <button className="admin-logout" type="button" onClick={() => { clearDemoAuth(); navigate('/login') }}>
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <button className="admin-menu" type="button" aria-label="Toggle sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <span className="admin-eyebrow">Government of Jharkhand / Civic Operations</span>
            <h1>Dashboard overview</h1>
          </div>
          <button className="admin-notification" type="button" aria-label="Notifications"><Bell size={18} /><i /></button>
        </header>

        <div className="admin-welcome">
          <div>
            <span>Wednesday, 21 August 2026</span>
            <h2>Good morning, Admin Desk.</h2>
            <p>Here is the latest pulse of civic reports across your service area.</p>
          </div>
          <button type="button" onClick={() => navigate('/')} className="admin-public-link">View public site</button>
        </div>

        <div className="admin-stat-grid">
          {stats.map(([label, value, Icon]) => (
            <article key={label}>
              <div className="admin-stat-icon"><Icon size={18} /></div>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{label === 'Resolved' ? '+12.4%' : 'Updated live'}</small>
            </article>
          ))}
        </div>

        <section className="admin-report-panel" id="reports">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">Live queue</span>
              <h2>Recent reports</h2>
            </div>
            <button type="button">View all reports <ArrowIcon /></button>
          </div>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Citizen</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>Loading live reports...</td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>No reports recorded in MongoDB.</td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id}>
                      <td><strong>{report.title}</strong><small>{report.id}</small></td>
                      <td>{report.category}</td>
                      <td>
                        <span className={`admin-badge priority-${report.priority.toLowerCase()}`}>
                          {report.priority}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`admin-badge status-${report.status.toLowerCase().replace(' ', '-')}`}
                          value={report.status}
                          onChange={(e) => handleStatusChange(report.id, e.target.value)}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td>{report.citizen}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  )
}

function ArrowIcon() { return <span className="admin-arrow">-&gt;</span> }

export default AdminDashboard
