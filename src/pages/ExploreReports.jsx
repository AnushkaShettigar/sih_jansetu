import { useMemo, useState, useEffect } from 'react'
import { ArrowLeft, BarChart3, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Navbar } from '../App'
import Footer from '../components/Footer'
import ComplaintCard from '../components/reports/ComplaintCard'
import ComplaintFilters from '../components/reports/ComplaintFilters'
import ComplaintMap from '../components/reports/ComplaintMap'
import { locationSets } from '../components/reports/MockComplaints'

function ExploreReports() {
  const [city, setCity] = useState('Mumbai')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 })

  useEffect(() => {
    async function fetchBackendData() {
      try {
        setLoading(true)

        // Automatically detects current IP or localhost and appends port 5000
        const host = window.location.hostname || 'localhost'
        const API_URL = `http://${host}:5000`

        // Fetch Live Reports
        const reportsRes = await fetch(`${API_URL}/api/admin/reports`)
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json()
          setReports(Array.isArray(reportsData) ? reportsData : [])
        }

        // Fetch Live Stats
        const statsRes = await fetch(`${API_URL}/api/admin/stats`)
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }
      } catch (err) {
        console.error('Failed to connect to backend server:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBackendData()
  }, [])

  // Safe filtering logic
  const filtered = useMemo(() => {
    if (!Array.isArray(reports)) return []
    return reports.filter((complaint) => {
      const query = search.toLowerCase()
      const titleMatch = (complaint.title || '').toLowerCase().includes(query)
      const locationMatch = (complaint.location || '').toLowerCase().includes(query)
      const categoryMatch = (complaint.category || '').toLowerCase().includes(query)

      const matchesCategory = category === 'All' || complaint.category === category
      const matchesStatus = status === 'All' || complaint.status === status
      const matchesSearch = !query || titleMatch || locationMatch || categoryMatch

      return matchesCategory && matchesStatus && matchesSearch
    })
  }, [reports, category, search, status])

  const cityReports = useMemo(() => {
    return filtered.filter((complaint) => {
      if (city === 'Other Areas') return true
      const loc = complaint.location || ''
      return loc.includes(city) || complaint.city === city || city === 'Mumbai'
    })
  }, [filtered, city])

  const reportStatsDisplay = [
    [stats.total || 0, 'Total Reports'],
    [stats.pending || 0, 'Pending Action'],
    [stats.inProgress || 0, 'Under Investigation'],
    [stats.resolved || 0, 'Resolved Issues'],
  ]

  return (
    <div className="reports-page">
      <Navbar />
      <main>
        <header className="reports-hero">
          <Link className="complaint-back-link" to="/">
            <ArrowLeft size={15} /> Back to Home
          </Link>
          <span className="complaint-kicker">
            <BarChart3 size={15} /> Civic transparency
          </span>
          <h1>Explore Civic Reports</h1>
          <p>See reported issues, track their progress, and understand what's happening across your community.</p>
        </header>

        <section className="reports-shell">
          <div className="reports-map-heading">
            <div>
              <span className="complaint-label">Live civic overview</span>
              <h2>Where attention is needed</h2>
            </div>
            <label className="reports-location-select" htmlFor="report-city">
              <MapPin size={15} />
              <select id="report-city" value={city} onChange={(event) => setCity(event.target.value)}>
                {Object.keys(locationSets || {}).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <ComplaintMap city={city} complaints={cityReports} />

          <div className="reports-stats">
            {reportStatsDisplay.map(([value, label]) => (
              <article key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>

          <ComplaintFilters
            search={search}
            onSearch={setSearch}
            category={category}
            onCategory={setCategory}
            status={status}
            onStatus={setStatus}
          />

          <div className="reports-results-heading">
            <h2>Recent community reports</h2>
            <span>{loading ? 'Loading...' : `${cityReports.length} reports shown`}</span>
          </div>

          <div className="reports-grid">
            {loading ? (
              <div className="reports-empty">Loading live reports from MongoDB...</div>
            ) : cityReports.length ? (
              cityReports.map((complaint) => (
                <ComplaintCard complaint={complaint} key={complaint.id || complaint.mongoId} />
              ))
            ) : (
              <div className="reports-empty">No community reports match these filters.</div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default ExploreReports