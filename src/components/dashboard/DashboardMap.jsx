import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'

function DashboardMap({ complaints }) {
  const center = complaints[0] ? [complaints[0].latitude, complaints[0].longitude] : [23.3441, 85.3096]
  return <div className="authority-map"><MapContainer key={center.join('-')} center={center} zoom={11} scrollWheelZoom className="authority-map-inner"><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{complaints.map((item) => <CircleMarker key={item.id} center={[item.latitude, item.longitude]} radius={8} pathOptions={{ color: item.severity === 'Critical' || item.severity === 'High' ? '#f97316' : '#4e9160', fillColor: item.severity === 'Critical' || item.severity === 'High' ? '#f97316' : '#4e9160', fillOpacity: .8 }}><Popup><strong>{item.id}</strong><br />{item.category}<br />{item.location}<br />{item.severity} · {item.status}<br />{item.createdAt}</Popup></CircleMarker>)}</MapContainer><span className="authority-demo-label">Frontend demo map</span></div>
}

export default DashboardMap
