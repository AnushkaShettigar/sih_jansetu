import { useEffect } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { LocateFixed, MapPin } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

const defaultLocation = [23.3441, 85.3096]

function MapInteractions({ onSelect }) {
  useMapEvents({ click: (event) => onSelect([event.latlng.lat, event.latlng.lng]) })
  return null
}

function MapCenter({ location }) {
  const map = useMap()
  useEffect(() => {
    if (location) map.setView(location, 16, { animate: false })
  }, [location, map])
  return null
}

function LocationPicker({ value, onChange, error }) {
  const mapLocation = value || defaultLocation

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      onChange({ error: 'Geolocation is not supported by this browser.' })
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => onChange({ coordinates: [coords.latitude, coords.longitude], source: 'Current location' }),
      (geolocationError) => {
        const messages = { 1: 'Location permission was denied.', 2: 'Your location is unavailable.', 3: 'Location request timed out.' }
        onChange({ error: messages[geolocationError.code] || 'Unable to access your location.' })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  return <section className="location-picker">
    <div className="complaint-section-heading"><span className="complaint-label">03 <b>LOCATION</b></span><p>Select a point on the map or use your current location.</p></div>
    <div className="location-actions"><button type="button" className="location-current-button" onClick={useCurrentLocation}><LocateFixed size={16} /> Use My Current Location</button><span>or click directly on the map to pin a location</span></div>
    <div className="complaint-map"><MapContainer center={defaultLocation} zoom={13} scrollWheelZoom className="complaint-leaflet-map"><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapInteractions onSelect={(coordinates) => onChange({ coordinates, source: 'Pinned on map' })} /><MapCenter location={value?.coordinates} />{value?.coordinates && <CircleMarker center={value.coordinates} radius={10} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: .9 }} />}</MapContainer><div className="map-hint"><MapPin size={15} /> Pin Location on Map</div></div>
    {value?.error && <p className="complaint-field-error" role="alert">{value.error}</p>}
    {value?.coordinates && <div className="selected-location"><span><MapPin size={16} /> Location Selected</span><div><strong>{value.source || 'Pinned location'}</strong><small>Latitude: {value.coordinates[0].toFixed(6)} &nbsp; Longitude: {value.coordinates[1].toFixed(6)}</small></div></div>}
    {error && <p className="complaint-field-error" role="alert">{error}</p>}
  </section>
}

export { defaultLocation }
export default LocationPicker
