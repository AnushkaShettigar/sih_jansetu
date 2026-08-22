import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, ChevronDown, CloudSun, Droplets, ImagePlus, Menu, MapPin, Moon, Search, Sun, UserRound, X } from 'lucide-react'
import './App.css'
import Footer from './components/Footer'
import { loadClassifierModel, classifyImage } from "./imageClassifier";

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
const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }
const greenStages = [
  ['01', 'Report', 'Submit an issue with location, description and supporting evidence.'],
  ['02', 'Verify', 'The issue is categorized and reviewed.'],
  ['03', 'Resolve', 'Authorities can act on verified civic complaints.'],
  ['04', 'Track', 'Citizens can follow the progress.'],
]
const issueNames = ['Roads', 'Garbage', 'Water', 'Drainage', 'Streetlights', 'Infrastructure']

function Logo() { return <a className="logo-mark" href="/" aria-label="JanSetu home"><span>J</span><strong>JanSetu</strong></a> }
export function Navbar() {
  const [open, setOpen] = useState(false); const links = [['Home', '/'], ['Report Issue', '/report-complaint'], ['Explore Reports', '/explore-reports'], ['Contact Us', '/contact']]
  return <header className="navbar-wrap"><nav className="navbar" aria-label="Main navigation"><a className="nav-brand" href="/" aria-label="JanSetu home">JanSetu</a><div className={`nav-links ${open ? 'is-open' : ''}`}>{links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}</div><div className="gov-mark" title="Government of Jharkhand" aria-label="Government of Jharkhand"><UserRound size={20} /></div><button className="icon-button menu-button" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button></nav></header>
}
function LiveInfo() {
  const [time, setTime] = useState(new Date()); useEffect(() => { const timer = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timer) }, [])
  const [weather, setWeather] = useState({ temperature: liveInfo.temperature, condition: liveInfo.condition, humidity: liveInfo.humidity })
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=23.6102&longitude=85.2799&current=temperature_2m,weather_code,relative_humidity_2m&timezone=auto')
      .then((response) => { if (!response.ok) throw new Error('Weather request failed'); return response.json() })
      .then(({ current }) => setWeather({ temperature: `${Math.round(current.temperature_2m)}°C`, condition: weatherCondition(current.weather_code), humidity: `${current.relative_humidity_2m}%` }))
      .catch(() => { })
  }, [])
  const currentTime = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(time)
  return <div className="live-info glass-panel" aria-label="Local civic information"><div className="info-top"><span className="live-dot" /> Live in your community <ChevronDown size={15} /></div><div className="info-location"><MapPin size={18} /><span>{liveInfo.location}</span></div><div className="info-grid"><div><CloudSun size={17} /><small>Weather</small><strong>{weather.temperature}</strong></div><div><Sun size={17} /><small>Condition</small><strong>{weather.condition}</strong></div><div><Droplets size={17} /><small>Humidity</small><strong>{weather.humidity}</strong></div><div><Moon size={17} /><small>Local time</small><strong>{currentTime}</strong></div></div></div>
}
function Hero() { return <section className="hero-section" id="top"><img className="hero-pattern" src="/pattern.png" alt="" aria-hidden="true" /><div className="hero-word" aria-hidden="true">JANSETU</div><div className="hero-copy"><motion.div initial="hidden" animate="visible" variants={fadeUp} className="eyebrow">CITIZEN <span>•</span> GOVERNMENT <span>•</span> COMMUNITY</motion.div><motion.h1 initial="hidden" animate="visible" variants={fadeUp}>Your City.<br />Your Voice.<br /><em>Your JanSetu.</em></motion.h1><motion.p initial="hidden" animate="visible" variants={fadeUp}>JanSetu empowers citizens to report civic issues, collaborate with local authorities, and contribute to cleaner, safer, and better-managed communities.</motion.p><motion.div initial="hidden" animate="visible" variants={fadeUp} className="hero-actions"><a className="button button-primary" href="/report-complaint">Report an Issue <ArrowUpRight size={17} /></a><a className="button button-secondary" href="/explore-reports">Explore Reports <Search size={16} /></a></motion.div></div><div className="monument-ground" aria-hidden="true" /><img className="hero-monument" src="/monument-transparent.png" alt="" /></section> }
function ReportIssue() {
  return <section className="section report-section why-section" id="report"><img className="chakra-art" src="/chakra.png" alt="" aria-hidden="true" /><div className="why-content"><span className="why-kicker">Why JanSetu?</span><h2>Connecting citizens,<br /><em>civic issues,</em> and the<br />authorities responsible<br />for solving them.</h2><div className="why-accent" /><div className="civic-flow" aria-label="Citizens to civic action"><span>CITIZENS</span><i>→</i><span>CIVIC ISSUES</span><i>→</i><span>AUTHORITIES</span><i>→</i><span>ACTION</span></div><p>JanSetu creates a direct digital connection between citizens and civic authorities, making it easier to report issues, track progress, and build greater transparency in the communities we share.</p></div></section>
}
function GreenSection() {
  return <section className="green-section" id="track">
    <div className="green-inner">
      <motion.div className="green-moment how-moment" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={fadeUp}>
        <motion.div className="moment-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .3 }} variants={fadeUp}><span className="green-kicker how-kicker">01 / How JanSetu works</span><h2><span className="report-heading-dark">From Report</span><br />to <em>Resolution.</em></h2><p>One platform connecting citizens, civic issues, and the authorities responsible for action.</p></motion.div>
        <div className="stage-list">{greenStages.map(([number, title, description], index) => <motion.div className="stage-item" key={title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .25 }} variants={fadeUp} transition={{ delay: index * .1 }}><span className="stage-number">{number}</span><div><h4>{title}</h4><p>{description}</p></div><span className="stage-status">READY</span></motion.div>)}</div>
        <motion.div className="issue-strip" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}><span>COMMON CIVIC ISSUES</span>{issueNames.map((name) => <a href="#report" key={name}>{name}</a>)}</motion.div>
      </motion.div>

      <motion.div className="green-moment smart-moment" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .18 }} variants={fadeUp}>
        <motion.div className="smart-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .3 }} variants={fadeUp}><span className="green-kicker">02 / Smart civic reporting</span><h2>Smarter reporting.<br /><em>Better response.</em></h2><p>JanSetu uses image recognition to help identify civic issues and suggest the appropriate category while citizens report them.</p><motion.div className="benefit-row" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .35 }} variants={fadeUp} transition={{ delay: .12 }}><div><span>FOR CITIZENS</span><strong>Report easily.<br />Track progress.<br />Stay informed.</strong></div><div><span>FOR AUTHORITIES</span><strong>Centralize complaints.<br />Prioritize issues.<br />Respond efficiently.</strong></div></motion.div></motion.div>
        <motion.div className="ai-interface" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .25 }} variants={fadeUp} transition={{ delay: .16 }} aria-label="Prototype AI recognition interface, coming soon"><div className="ai-toolbar"><span>JANSETU / REPORT ASSIST</span><i>PROTOTYPE</i></div><div className="ai-interface-body"><div className="ai-image"><ImagePlus size={22} /><span>CIVIC IMAGE</span><small>Upload preview</small><b /></div><div className="ai-analysis"><span className="analysis-label">AI ANALYSIS <i /></span><div className="analysis-line" /><small>VISUAL SIGNAL DETECTED</small></div><div className="ai-result"><small>SUGGESTED CATEGORY</small><strong>POTHOLE</strong><span>Confidence indicator <b>82%</b></span><div className="confidence"><i /></div></div></div></motion.div>
      </motion.div>

      <motion.div className="green-moment cta-moment" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .35 }} variants={fadeUp}><span className="green-kicker">03 / Take action</span><h2>See something that<br />needs attention?</h2><p>Your report can be the first step toward action.</p><a className="green-cta-button" href="/report-complaint">Report an Issue <ArrowUpRight size={17} /></a></motion.div>
    </div>
  </section>
}
function App() {
  return <div className="app-shell"><Navbar /><main><Hero /><ReportIssue /><GreenSection /></main><Footer /></div>
}

export default App
