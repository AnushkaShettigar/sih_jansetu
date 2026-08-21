import { useMemo, useState } from 'react'
import { ArrowLeft, BarChart3, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Navbar } from '../App'
import Footer from '../components/Footer'
import ComplaintCard from '../components/reports/ComplaintCard'
import ComplaintFilters from '../components/reports/ComplaintFilters'
import ComplaintMap from '../components/reports/ComplaintMap'
import MockComplaints, { locationSets, reportStats } from '../components/reports/MockComplaints'

function ExploreReports() {
  const [city, setCity] = useState('Mumbai')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const filtered = useMemo(() => MockComplaints.filter((complaint) => {
    const query = search.toLowerCase()
    return (category === 'All' || complaint.category === category) && (status === 'All' || complaint.status === status) && (!query || [complaint.title, complaint.location, complaint.category].join(' ').toLowerCase().includes(query))
  }), [category, search, status])
  const cityReports = filtered.filter((complaint) => city === 'Other Areas' || complaint.city === city || (city === 'Mumbai' && complaint.city === 'Mumbai'))

  return <div className="reports-page"><Navbar /><main><header className="reports-hero"><Link className="complaint-back-link" to="/"><ArrowLeft size={15} /> Back to Home</Link><span className="complaint-kicker"><BarChart3 size={15} /> Civic transparency</span><h1>Explore Civic Reports</h1><p>See reported issues, track their progress, and understand what's happening across your community.</p></header><section className="reports-shell"><div className="reports-map-heading"><div><span className="complaint-label">Live civic overview</span><h2>Where attention is needed</h2></div><label className="reports-location-select" htmlFor="report-city"><MapPin size={15} /><select id="report-city" value={city} onChange={(event) => setCity(event.target.value)}>{Object.keys(locationSets).map((item) => <option key={item}>{item}</option>)}</select></label></div><ComplaintMap city={city} complaints={cityReports} /><div className="reports-stats">{reportStats.map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}</div><ComplaintFilters search={search} onSearch={setSearch} category={category} onCategory={setCategory} status={status} onStatus={setStatus} /><div className="reports-results-heading"><h2>Recent community reports</h2><span>{cityReports.length} demo reports shown</span></div><div className="reports-grid">{cityReports.length ? cityReports.map((complaint) => <ComplaintCard complaint={complaint} key={complaint.id} />) : <div className="reports-empty">No demo reports match these filters.</div>}</div></section></main><Footer /></div>
}

export default ExploreReports
