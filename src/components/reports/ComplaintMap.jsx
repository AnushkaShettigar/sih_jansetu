import React from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Default center (Mumbai coordinates)
const DEFAULT_CENTER = [19.076, 72.8777]

export default function ComplaintMap({ city, complaints = [] }) {
  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {Array.isArray(complaints) &&
          complaints.map((item) => {
            // Safe coordinate extraction
            let position = null

            if (Array.isArray(item.coordinates) && item.coordinates.length === 2) {
              const lat = Number(item.coordinates[0])
              const lng = Number(item.coordinates[1])
              if (!isNaN(lat) && !isNaN(lng)) {
                position = [lat, lng]
              }
            } else if (item.lat && item.lng) {
              const lat = Number(item.lat)
              const lng = Number(item.lng)
              if (!isNaN(lat) && !isNaN(lng)) {
                position = [lat, lng]
              }
            }

            // Skip rendering if coordinates are missing/undefined to prevent Leaflet crash
            if (!position) return null

            return (
              <CircleMarker
                key={item.id || item.mongoId || Math.random()}
                center={position}
                radius={8}
                pathOptions={{ color: '#e53e3e', fillColor: '#e53e3e', fillOpacity: 0.6 }}
              >
                <Popup>
                  <strong>{item.title || 'Civic Issue'}</strong>
                  <br />
                  {item.location || 'Location unspecified'}
                </Popup>
              </CircleMarker>
            )
          })}
      </MapContainer>
    </div>
  )
}