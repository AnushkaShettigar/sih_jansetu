import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet'
import { locationSets } from './MockComplaints'

function ComplaintMap({ city, complaints }) {
  const settings = locationSets[city]
  const visible = city === 'Other Areas' ? [] : complaints
  return <div className="reports-map-wrap"><MapContainer key={city} center={settings.center} zoom={settings.zoom} scrollWheelZoom className="reports-map"><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{visible.map((complaint) => <CircleMarker key={complaint.id} center={[complaint.latitude, complaint.longitude]} radius={complaint.priority === 'Critical' ? 10 : 7} pathOptions={{ color: complaint.priority === 'High' || complaint.priority === 'Critical' ? '#f97316' : '#4e9160', fillColor: complaint.priority === 'High' || complaint.priority === 'Critical' ? '#f97316' : '#4e9160', fillOpacity: .7 }} />)}</MapContainer><div className="reports-demo-note">Demo data only</div><div className="reports-map-legend"><strong>Complaint Density</strong><span><i className="density-low" /> Low</span><span><i className="density-medium" /> Medium</span><span><i className="density-high" /> High</span></div></div>
}

export default ComplaintMap
