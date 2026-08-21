import { ArrowLeft, ClipboardCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Navbar } from '../App'
import Footer from '../components/Footer'
import ComplaintForm from '../components/complaint/ComplaintForm'

function ReportComplaint() {
  return <div className="complaint-page"><Navbar /><main><header className="complaint-hero"><Link className="complaint-back-link" to="/"><ArrowLeft size={15} /> Back to Home</Link><div className="complaint-hero-copy"><span className="complaint-kicker"><ClipboardCheck size={15} /> Citizen reporting service</span><h1>Report a Civic Issue</h1><span className="complaint-accent" /><p>Help improve your community by reporting problems in your area with clear details, evidence, and location.</p></div></header><section className="complaint-shell"><ComplaintForm /></section></main><Footer /></div>
}

export default ReportComplaint
