import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { destinations, type Destination } from '../data/destinations'
import Icon from '../components/Icon'
import { Link, useNavigate } from 'react-router-dom'
import { useWatchlist } from '../hooks/useWatchlist'

const categories = ['Semua', 'Pantai', 'Pura', 'Alam']

function getDensityHex(density: number): string {
  if (density > 0.8) return '#ba1a1a'
  if (density > 0.6) return '#f97316'
  if (density > 0.3) return '#facc15'
  return '#10b981'
}

function createMarkerIcon(density: number): L.DivIcon {
  const size = Math.round(10 + density * 12)
  const color = getDensityHex(density)
  const pulse =
    density > 0.8
      ? `<div style="position:absolute;inset:-4px;border-radius:50%;background:${color};opacity:0.4;animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;"></div>`
      : ''

  return L.divIcon({
    className: '',
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
    popupAnchor: [0, -size],
    html: `
      <div style="position:relative;width:${size * 2}px;height:${size * 2}px;display:flex;align-items:center;justify-content:center;">
        ${pulse}
        <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);position:relative;z-index:1;"></div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.8); opacity: 0; }
        }
      </style>
    `,
  })
}

function ZoomControls() {
  const map = useMap()
  return (
    <div className="absolute bottom-8 left-8 z-20 hidden lg:flex flex-col gap-2">
      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 rounded-xl bg-surface-container-lowest shadow-lg flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
      >
        <Icon name="add" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 rounded-xl bg-surface-container-lowest shadow-lg flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
      >
        <Icon name="remove" />
      </button>
    </div>
  )
}

function MapEventHandler({
  onMarkerClick,
  filteredDests,
}: {
  onMarkerClick: (dest: Destination) => void
  filteredDests: Destination[]
}) {
  return (
    <>
      {filteredDests.map((dest) => (
        <Marker
          key={dest.id}
          position={[dest.lat, dest.lng]}
          icon={createMarkerIcon(dest.density)}
          eventHandlers={{
            click: () => onMarkerClick(dest),
          }}
        >
          <Popup>
            <span className="font-semibold">{dest.name}</span>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

const legendItems = [
  { label: 'Sepi', color: '#10b981', ping: false },
  { label: 'Sedang', color: '#facc15', ping: false },
  { label: 'Ramai', color: '#f97316', ping: false },
  { label: 'Sangat Ramai', color: '#ba1a1a', ping: true },
]

export default function Peta() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const { isWatchlisted, toggleWatchlist } = useWatchlist()
  const navigate = useNavigate()

  const categoryFiltered = activeCategory === 'Semua' ? destinations : destinations.filter((d) => d.category === activeCategory)

  const filteredDestinations = searchQuery
    ? categoryFiltered.filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : null

  return (
    <div className="relative w-full h-full -mx-4 -mb-24 lg:-mx-10 lg:-my-8 w-[calc(100%+2rem)] lg:w-[calc(100%+5rem)]">
      {/* ===== MOBILE VIEW ===== */}
      <div className="lg:hidden relative w-full h-[calc(100vh-56px-80px)]">
        {/* Floating Search */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)]">
          <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-full flex items-center gap-2 px-4 py-2.5 shadow-lg">
            <Icon name="search" className="text-on-surface-variant" size="20px" />
            <input
              type="text"
              placeholder="Cari destinasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm text-on-surface placeholder:text-outline"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="cursor-pointer">
                <Icon name="close" className="text-on-surface-variant" size="18px" />
              </button>
            )}
          </div>
          {/* Search Results Dropdown */}
          {filteredDestinations && filteredDestinations.length > 0 && (
            <div className="mt-2 bg-surface-container-lowest rounded-2xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
              {filteredDestinations.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => {
                    setSelectedDestination(dest)
                    setSearchQuery('')
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-surface-container-high flex items-center gap-3 cursor-pointer"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: getDensityHex(dest.density) }}
                  />
                  <div>
                    <p className="text-sm font-medium text-on-surface">{dest.name}</p>
                    <p className="text-xs text-on-surface-variant">{dest.location}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <MapContainer
          center={[-8.4095, 115.1889]}
          zoom={10}
          zoomControl={false}
          className="w-full h-full z-0"
          style={{ background: '#e2d8d2' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventHandler onMarkerClick={setSelectedDestination} filteredDests={categoryFiltered} />
          <ZoomControls />
        </MapContainer>

        {/* Category Filter - Mobile */}
        <div className="absolute top-[68px] left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${activeCategory === cat ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest/90 text-on-surface-variant'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Floating Legend - Mobile */}
        <div className="absolute bottom-4 right-4 z-20 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl p-3 shadow-lg">
          <div className="flex flex-col gap-1.5">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="relative">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: item.color }}
                  />
                  {item.ping && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: item.color, opacity: 0.5 }}
                    />
                  )}
                </div>
                <span className="text-[10px] text-on-surface-variant whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Sheet - Mobile */}
        {selectedDestination && (
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-surface-container-lowest rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] transition-transform duration-300">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-outline-variant" />
            </div>
            <div className="px-5 pb-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-on-surface">
                    {selectedDestination.name}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {selectedDestination.location} &middot; {selectedDestination.category}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="p-1 rounded-full hover:bg-surface-container-high cursor-pointer"
                >
                  <Icon name="close" size="20px" className="text-on-surface-variant" />
                </button>
              </div>

              {/* Density Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                  style={{ background: getDensityHex(selectedDestination.density) }}
                >
                  <Icon name="groups" size="14px" />
                  {selectedDestination.densityLabel}
                </span>
                <span className="text-xs text-on-surface-variant">
                  {Math.round(selectedDestination.density * 100)}% kapasitas
                </span>
              </div>

              {/* Visitor Count */}
              <div className="flex items-center gap-2 mb-2">
                <Icon name="person" size="16px" className="text-on-surface-variant" />
                <span className="text-sm text-on-surface">
                  <strong>{selectedDestination.visitors.toLocaleString('id-ID')}</strong>{' '}
                  / {selectedDestination.maxCapacity.toLocaleString('id-ID')} pengunjung
                </span>
              </div>

              {/* Capacity Bar */}
              <div className="w-full h-2 rounded-full bg-surface-container-high mb-4">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(selectedDestination.density * 100, 100)}%`,
                    background: getDensityHex(selectedDestination.density),
                  }}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Link to={`/app/destinasi/${selectedDestination.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium no-underline">
                  <Icon name="info" size="18px" />Detail
                </Link>
                <button onClick={() => navigate(`/app/destinasi/${selectedDestination.id}`)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-outline text-on-surface text-sm font-medium cursor-pointer bg-transparent">
                  <Icon name="confirmation_number" size="18px" />Pesan
                </button>
                <button onClick={() => toggleWatchlist(selectedDestination.id)}
                  className="w-11 h-11 rounded-full border border-outline flex items-center justify-center cursor-pointer bg-transparent shrink-0">
                  <Icon name="bookmark" filled={isWatchlisted(selectedDestination.id)} size="20px" className={isWatchlisted(selectedDestination.id) ? 'text-primary' : 'text-on-surface'} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== DESKTOP VIEW ===== */}
      <div className="hidden lg:block relative w-full h-[calc(100vh-64px)]">
        {/* Floating Search - Desktop */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[420px]">
          <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-full flex items-center gap-3 px-5 py-3 shadow-lg">
            <Icon name="search" className="text-on-surface-variant" size="22px" />
            <input
              type="text"
              placeholder="Cari destinasi di peta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-on-surface placeholder:text-outline"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="cursor-pointer">
                <Icon name="close" className="text-on-surface-variant" size="20px" />
              </button>
            )}
          </div>
          {filteredDestinations && filteredDestinations.length > 0 && (
            <div className="mt-2 bg-surface-container-lowest rounded-2xl shadow-lg overflow-hidden max-h-72 overflow-y-auto">
              {filteredDestinations.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => {
                    setSelectedDestination(dest)
                    setSearchQuery('')
                  }}
                  className="w-full px-5 py-3 text-left hover:bg-surface-container-high flex items-center gap-3 cursor-pointer"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: getDensityHex(dest.density) }}
                  />
                  <div>
                    <p className="text-sm font-medium text-on-surface">{dest.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {dest.location} &middot; {dest.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter - Desktop */}
        <div className="absolute top-[76px] left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold shadow-md backdrop-blur-md ${activeCategory === cat ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest/90 text-on-surface-variant'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Full Map - Desktop */}
        <MapContainer
          center={[-8.4095, 115.1889]}
          zoom={10}
          zoomControl={false}
          className="w-full h-full z-0"
          style={{ background: '#e2d8d2' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventHandler onMarkerClick={setSelectedDestination} filteredDests={categoryFiltered} />
          <ZoomControls />
        </MapContainer>

        {/* Side Card - Desktop */}
        {selectedDestination && (
          <div className="absolute left-8 top-[20%] z-20 w-80 bg-surface-container-lowest rounded-3xl shadow-xl overflow-hidden">
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center cursor-pointer"
              >
                <Icon name="close" size="18px" className="text-white" />
              </button>
              {/* Density badge on image */}
              <span
                className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                style={{ background: getDensityHex(selectedDestination.density) }}
              >
                {selectedDestination.densityLabel}
              </span>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-on-surface mb-1">
                {selectedDestination.name}
              </h3>
              <p className="text-sm text-on-surface-variant mb-3">
                {selectedDestination.region}
              </p>

              {/* Sensory Score */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 text-tertiary">
                  <Icon name="star" filled size="16px" />
                  <span className="text-sm font-semibold">{selectedDestination.rating}</span>
                </div>
                <span className="text-xs text-on-surface-variant">
                  ({selectedDestination.reviewCount.toLocaleString('id-ID')} ulasan)
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant">
                  {selectedDestination.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant">
                  {selectedDestination.distance}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant">
                  {selectedDestination.ticketPrice}
                </span>
              </div>

              {/* Capacity */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                  <span>{selectedDestination.visitors.toLocaleString('id-ID')} pengunjung</span>
                  <span>{Math.round(selectedDestination.density * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(selectedDestination.density * 100, 100)}%`,
                      background: getDensityHex(selectedDestination.density),
                    }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Link to={`/app/destinasi/${selectedDestination.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium no-underline">
                  <Icon name="analytics" size="18px" />Detail
                </Link>
                <button onClick={() => toggleWatchlist(selectedDestination.id)}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center cursor-pointer shrink-0 ${isWatchlisted(selectedDestination.id) ? 'bg-primary/10 border-primary' : 'border-outline bg-transparent'}`}>
                  <Icon name="bookmark" filled={isWatchlisted(selectedDestination.id)} size="20px" className={isWatchlisted(selectedDestination.id) ? 'text-primary' : 'text-on-surface'} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Legend Card - Desktop */}
        <div className="absolute bottom-8 right-8 z-20 bg-surface-container-lowest rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="info" size="16px" className="text-on-surface-variant" />
            <span className="text-xs font-semibold text-on-surface">Tingkat Keramaian</span>
          </div>
          <div className="flex flex-col gap-2">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: item.color }}
                  />
                  {item.ping && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: item.color, opacity: 0.5 }}
                    />
                  )}
                </div>
                <span className="text-xs text-on-surface-variant">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-outline-variant flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] text-on-surface-variant">Live update aktif</span>
          </div>
        </div>
      </div>
    </div>
  )
}
