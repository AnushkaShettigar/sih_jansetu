import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Building2, Check, ChevronDown, CloudSun, Droplets, ImagePlus, Landmark, Lightbulb, Menu, MapPin, Minus, Moon, MoveUpRight, Route, Search, Send, ShieldCheck, Sun, Trash2, UserRound, Waves, X } from 'lucide-react'
import './App.css'

const liveInfo = { location: 'Ranchi, Jharkhand', temperature: '28°C', condition: 'Partly cloudy', humidity: '—' }
const weatherCondition = (code) => {
  if (code === 0) return 'Clear sky'
  if ([1, 2, 3].includes(code)) return 'Partly cloudy'
  if ([45, 48].includes(code)) return 'Foggy'
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rainy'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snowy'
  if ([95, 96, 99].includes(code)) return 'Thunderstorm'
  return 'Partly cloudy'
}
const categories = [
  { name: 'Roads', icon: Route, detail: 'Potholes, signs & surfaces' }, { name: 'Garbage', icon: Trash2, detail: 'Collection & clean-up' },
  { name: 'Water', icon: Droplets, detail: 'Supply & leakage' }, { name: 'Streetlights', icon: Lightbulb, detail: 'Lighting & safety' },
  { name: 'Drainage', icon: Waves, detail: 'Blocked drains & flooding' }, { name: 'Infrastructure', icon: Building2, detail: 'Public spaces & works' },
]
const statistics = [{ value: '12,480', label: 'Issues reported' }, { value: '8,920', label: 'Issues resolved' }, { value: '2,340', label: 'Active reports' }, { value: '18,700+', label: 'Citizens engaged' }]
const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

function Logo() { return <a className="logo-mark" href="#top" aria-label="JanSetu home"><span>J</span><strong>JanSetu</strong></a> }
function Navbar() {
  const [open, setOpen] = useState(false); const links = [['Home', '#top'], ['Report Issue', '#report'], ['Track Complaint', '#track'], ['About', '#about']]
  return <header className="navbar-wrap"><nav className="navbar" aria-label="Main navigation"><a className="nav-brand" href="#top" aria-label="JanSetu home">JanSetu</a><div className={`nav-links ${open ? 'is-open' : ''}`}>{links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}</div><div className="gov-mark" title="Government of Jharkhand" aria-label="Government of Jharkhand"><UserRound size={20} /></div><button className="icon-button menu-button" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button></nav></header>
}
function LiveInfo() {
  const [time, setTime] = useState(new Date()); useEffect(() => { const timer = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timer) }, [])
  const [weather, setWeather] = useState({ temperature: liveInfo.temperature, condition: liveInfo.condition, humidity: liveInfo.humidity })
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=23.6102&longitude=85.2799&current=temperature_2m,weather_code,relative_humidity_2m&timezone=auto')
      .then((response) => { if (!response.ok) throw new Error('Weather request failed'); return response.json() })
      .then(({ current }) => setWeather({ temperature: `${Math.round(current.temperature_2m)}°C`, condition: weatherCondition(current.weather_code), humidity: `${current.relative_humidity_2m}%` }))
      .catch(() => {})
  }, [])
  const currentTime = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(time)
  return <div className="live-info glass-panel" aria-label="Local civic information"><div className="info-top"><span className="live-dot" /> Live in your community <ChevronDown size={15} /></div><div className="info-location"><MapPin size={18} /><span>{liveInfo.location}</span></div><div className="info-grid"><div><CloudSun size={17} /><small>Weather</small><strong>{weather.temperature}</strong></div><div><Sun size={17} /><small>Condition</small><strong>{weather.condition}</strong></div><div><Droplets size={17} /><small>Humidity</small><strong>{weather.humidity}</strong></div><div><Moon size={17} /><small>Local time</small><strong>{currentTime}</strong></div></div></div>
}
function Hero() { return <section className="hero-section" id="top"><img className="hero-pattern" src="/pattern.png" alt="" aria-hidden="true" /><div className="hero-word" aria-hidden="true">JANSETU</div><div className="hero-copy"><motion.div initial="hidden" animate="visible" variants={fadeUp} className="eyebrow">CITIZEN <span>•</span> GOVERNMENT <span>•</span> COMMUNITY</motion.div><motion.h1 initial="hidden" animate="visible" variants={fadeUp}>Your City.<br />Your Voice.<br /><em>Your JanSetu.</em></motion.h1><motion.p initial="hidden" animate="visible" variants={fadeUp}>JanSetu empowers citizens to report civic issues, collaborate with local authorities, and contribute to cleaner, safer, and better-managed communities.</motion.p><motion.div initial="hidden" animate="visible" variants={fadeUp} className="hero-actions"><a className="button button-primary" href="#report">Report an Issue <ArrowUpRight size={17} /></a><a className="button button-secondary" href="#track">Explore Reports <Search size={16} /></a></motion.div></div><div className="monument-ground" aria-hidden="true" /><img className="hero-monument" src="/monument-transparent.png" alt="" /></section> }
function ReportIssue() {
  return <section className="section report-section why-section" id="report"><img className="chakra-art" src="/chakra.png" alt="" aria-hidden="true" /><div className="why-content"><span className="why-kicker">Why JanSetu?</span><h2>Connecting citizens,<br /><em>civic issues,</em> and the<br />authorities responsible<br />for solving them.</h2><div className="why-accent" /><div className="civic-flow" aria-label="Citizens to civic action"><span>CITIZENS</span><i>→</i><span>CIVIC ISSUES</span><i>→</i><span>AUTHORITIES</span><i>→</i><span>ACTION</span></div><p>JanSetu creates a direct digital connection between citizens and civic authorities, making it easier to report issues, track progress, and build greater transparency in the communities we share.</p></div></section>
}
function IssueCategories() { return <section className="section categories-section"><div className="section-heading compact"><div><span className="section-kicker">02 / What needs fixing?</span><h2>Everyday issues.<br /><em>Real impact.</em></h2></div><p>Choose a category to get started. Small reports can lead to meaningful change.</p></div><div className="category-grid">{categories.map(({ name, icon: Icon, detail }, index) => <motion.a initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.06 }} className="category-card" href="#report" key={name}><span className="category-icon"><Icon size={22} /></span><span><strong>{name}</strong><small>{detail}</small></span><MoveUpRight size={17} className="card-arrow" /></motion.a>)}</div></section> }
function ImpactStats() { return <section className="stats-band"><div className="section stats-section"><div className="stats-intro"><span className="section-kicker">03 / The collective effort</span><h2>Progress you<br /><em>can see.</em></h2><p>When communities speak up, civic teams can move with clarity. Here is what we are building together.</p></div><div className="stats-grid">{statistics.map((stat, index) => <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.1 }} key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span><i>{index === 0 ? <ArrowUpRight size={13} /> : <Minus size={13} />}</i></motion.div>)}</div></div></section> }
function TrackComplaint() { const [status, setStatus] = useState(''); return <section className="section track-section" id="track"><div className="track-inner"><div><span className="section-kicker">04 / Stay informed</span><h2>Track your<br /><em>complaint.</em></h2><p>Enter your complaint ID to see its current status and follow every step towards resolution.</p></div><form className="track-form" onSubmit={(event) => { event.preventDefault(); setStatus('Tracking will be available when reports go live.') }}><label htmlFor="complaint-id">Complaint ID</label><div className="track-input"><input id="complaint-id" required placeholder="e.g. JS-2026-00421" onChange={() => setStatus('')} /><button className="button button-primary" type="submit">Track status <Search size={16} /></button></div>{status && <p className="status-message" role="status">{status}</p>}<span className="track-note"><ShieldCheck size={14} /> Your complaint details stay private.</span></form></div></section> }
function Footer() { return <footer id="about"><div className="footer-main"><div><Logo /><p>A citizen-focused civic service<br />platform for Jharkhand.</p></div><div className="footer-links"><span>Explore</span><a href="#report">Report issue</a><a href="#track">Track complaint</a><a href="#about">About JanSetu</a></div><div className="footer-official"><Landmark size={18} /><span>Government of<br /><b>Jharkhand</b></span></div></div><div className="footer-bottom"><span>© 2026 JanSetu. Built for the people of Jharkhand.</span><span>Public service, made simpler.</span></div></footer> }

function App() {
  return <div className="app-shell"><Navbar /><main><Hero /><ReportIssue /><IssueCategories /><ImpactStats /><TrackComplaint /></main><Footer /></div>
}

export default App
