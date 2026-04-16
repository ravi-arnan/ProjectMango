import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { destinations, getDensityBgColor } from '../data/destinations'
import { useAuth, getUserDisplayName } from '../context/AuthContext'
import { showToast } from '../components/Toast'

const categories = ['Semua', 'Pantai', 'Pura', 'Alam', 'Budaya']

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [showInstallBanner, setShowInstallBanner] = useState(true)
  const { user } = useAuth()
  const displayName = getUserDisplayName(user)

  const popularDestinations = destinations.slice(0, 3)

  const getRecommendations = () => {
    return [...destinations]
      .filter((d) => d.density < 0.5)
      .sort((a, b) => {
        const scoreA = (1 - a.density) * 0.5 + (a.rating / 5) * 0.3 + (1 - a.visitors / a.maxCapacity) * 0.2
        const scoreB = (1 - b.density) * 0.5 + (b.rating / 5) * 0.3 + (1 - b.visitors / b.maxCapacity) * 0.2
        return scoreB - scoreA
      })
  }

  const recommended = getRecommendations()
  const recommendedMobile = recommended.slice(0, 2)
  const desktopRecommended = recommended.slice(0, 3)

  return (
    <div>
      {/* ===================== MOBILE VIEW ===================== */}
      <div className="lg:hidden flex flex-col gap-4 pb-6">
        {/* PWA Install Banner */}
        {showInstallBanner && (
          <div className="bg-primary-container text-on-primary-container rounded-2xl p-4 flex items-center gap-3">
            <Icon name="install_mobile" size="24px" />
            <p className="flex-1 text-sm">
              Gunakan aplikasi untuk akses lebih cepat
            </p>
            <button
              onClick={() => {
                const deferredPrompt = (window as any).__pwaInstallPrompt
                if (deferredPrompt) {
                  deferredPrompt.prompt()
                } else {
                  showToast('Buka menu browser dan pilih "Tambahkan ke Layar Utama"', 'info')
                }
              }}
              className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-full"
            >
              Pasang
            </button>
            <button onClick={() => setShowInstallBanner(false)}>
              <Icon name="close" size="20px" />
            </button>
          </div>
        )}

        {/* AI Analysis Banner */}
        <Link
          to="/app/ai-analysis"
          className="bg-gradient-to-r from-primary to-primary-container rounded-2xl p-4 flex items-center gap-3 text-white no-underline active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Icon name="auto_awesome" size="22px" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">AI Analysis</p>
            <p className="text-[11px] text-white/80">Tanyakan rekomendasi wisata cerdas</p>
          </div>
          <Icon name="arrow_forward" size="20px" />
        </Link>

        {/* Greeting Card */}
        <div className="bg-gradient-to-br from-[#e0f2fe] to-[#f0fdf4] rounded-2xl p-5">
          <h2 className="text-lg font-bold text-on-surface">Halo, {displayName}!</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Cek keramaian destinasimu sebelum berangkat hari ini.
          </p>
          <div className="flex gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 bg-error/15 text-error text-xs font-bold px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-error" />
              3 Sangat Ramai
            </span>
            <span className="inline-flex items-center gap-1.5 bg-tertiary/15 text-tertiary text-xs font-bold px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              4 Ramai
            </span>
            <span className="inline-flex items-center gap-1.5 bg-primary/15 text-primary text-xs font-bold px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary" />
              5 Sepi
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-surface-container-low rounded-xl flex items-center gap-2 px-4 py-3">
          <Icon name="search" className="text-on-surface-variant" size="20px" />
          <input
            type="text"
            placeholder="Cari destinasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant outline-none"
          />
          <Icon name="tune" className="text-on-surface-variant" size="20px" />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full text-xs font-bold px-4 py-2 ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Destinasi Populer */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-on-surface">Destinasi Populer</h3>
            <Link to="/app/destinasi" className="text-xs font-semibold text-primary">
              Lihat semua
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {popularDestinations.map((dest) => (
              <Link
                key={dest.id}
                to={`/app/destinasi/${dest.id}`}
                className="shrink-0 w-[160px] h-[220px] rounded-2xl overflow-hidden relative block"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Density badge */}
                <span
                  className={`absolute top-2 right-2 ${getDensityBgColor(dest.density)} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}
                >
                  {dest.densityLabel}
                </span>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-bold leading-tight">{dest.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon name="location_on" className="text-white/80" size="12px" />
                    <span className="text-white/80 text-[10px]">{dest.location}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Icon name="directions_walk" className="text-white/80" size="12px" />
                    <span className="text-white/80 text-[10px]">{dest.distance}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Rekomendasi untuk Kamu */}
        <div>
          <h3 className="text-base font-bold text-on-surface">Rekomendasi untuk Kamu</h3>
          <p className="text-xs text-on-surface-variant mt-0.5 mb-3">
            Berdasarkan lokasi dan preferensimu
          </p>
          <div className="flex flex-col gap-3">
            {recommendedMobile.map((dest) => (
              <Link
                key={dest.id}
                to={`/app/destinasi/${dest.id}`}
                className="flex gap-3 bg-surface-container-low rounded-xl p-3"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-[72px] h-[72px] rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-on-surface truncate">{dest.name}</p>
                    <span className={`shrink-0 ${getDensityBgColor(dest.density)} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                      {Math.round(dest.density * 100)}%
                    </span>
                  </div>
                  {dest.density < 0.25 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1">
                      <Icon name="diamond" size="10px" />Hidden Gem
                    </span>
                  )}
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">
                    Sepi saat ini — {Math.round(dest.density * 100)}% kapasitas
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      <Icon name="star" className="text-amber-500" size="14px" />
                      <span className="text-xs text-on-surface-variant">{dest.rating}</span>
                    </div>
                    <span className="text-xs text-on-surface-variant">&middot; {dest.region}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== DESKTOP VIEW ===================== */}
      <div className="hidden lg:flex flex-col gap-6 pb-8">
        {/* Welcome Banner */}
        <div className="relative w-full rounded-3xl h-[320px] bg-stone-900 overflow-hidden">
          <img
            src={destinations[0].image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="relative z-10 flex flex-col justify-center h-full px-10">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-4">
              <Icon name="explore" size="16px" />
              Discovery Mode
            </span>
            <h1 className="text-5xl font-bold text-white mb-2">Halo, {displayName}!</h1>
            <p className="text-white/80 text-lg max-w-xl mb-6">
              Cek keramaian destinasimu sebelum berangkat hari ini.
            </p>
            <div className="flex gap-3">
              <Link to="/app/peta" className="bg-primary text-on-primary font-bold px-6 py-3 rounded-full text-sm flex items-center gap-2">
                <Icon name="map" size="18px" />
                Lihat Peta Kepadatan
              </Link>
              <Link to="/app/profil" className="bg-white/20 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-full text-sm flex items-center gap-2">
                <Icon name="tune" size="18px" />
                Atur Preferensi
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full text-sm font-bold px-5 py-2.5 ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Destinasi Populer - Bento Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-on-surface">Destinasi Populer</h2>
            <Link to="/app/destinasi" className="text-sm font-semibold text-primary">
              Lihat semua
            </Link>
          </div>
          <div className="grid grid-cols-12 gap-4">
            {/* Large card */}
            <Link
              to={`/app/destinasi/${popularDestinations[0].id}`}
              className="col-span-8 h-[400px] rounded-3xl overflow-hidden relative block"
            >
              <img
                src={popularDestinations[0].image}
                alt={popularDestinations[0].name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span
                className={`absolute top-4 right-4 ${getDensityBgColor(popularDestinations[0].density)} text-white text-xs font-bold px-3 py-1 rounded-full`}
              >
                {popularDestinations[0].densityLabel}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-2xl font-bold">{popularDestinations[0].name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="location_on" className="text-white/80" size="16px" />
                  <span className="text-white/80 text-sm">{popularDestinations[0].region}</span>
                </div>
              </div>
            </Link>

            {/* Small card */}
            <Link
              to={`/app/destinasi/${popularDestinations[1].id}`}
              className="col-span-4 h-[400px] rounded-3xl overflow-hidden relative block"
            >
              <img
                src={popularDestinations[1].image}
                alt={popularDestinations[1].name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span
                className={`absolute top-4 right-4 ${getDensityBgColor(popularDestinations[1].density)} text-white text-xs font-bold px-3 py-1 rounded-full`}
              >
                {popularDestinations[1].densityLabel}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-xl font-bold">{popularDestinations[1].name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="location_on" className="text-white/80" size="16px" />
                  <span className="text-white/80 text-sm">{popularDestinations[1].region}</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Rekomendasi */}
        <div>
          <h2 className="text-xl font-bold text-on-surface mb-1">Rekomendasi untuk Kamu</h2>
          <p className="text-sm text-on-surface-variant mb-4">
            Berdasarkan lokasi dan preferensimu
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {desktopRecommended.map((dest) => (
              <div
                key={dest.id}
                className="bg-surface-container-low rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="relative h-[180px]">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className={`absolute top-3 left-3 ${dest.density <= 0.25 ? 'bg-primary' : 'bg-tertiary'} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}>
                    {dest.density <= 0.25 ? 'Hidden Gem' : 'Sepi'}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-on-surface">{dest.name}</h3>
                  <p className="text-xs text-emerald-600 font-medium mt-1">Sepi saat ini — {Math.round(dest.density * 100)}% kapasitas</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Icon name="star" className="text-amber-500" size="16px" />
                    <span className="text-sm font-semibold text-on-surface">{dest.rating}</span>
                    <span className="text-xs text-on-surface-variant ml-1">
                      ({dest.reviewCount})
                    </span>
                  </div>
                  <div className="mt-auto pt-4">
                    <Link
                      to={`/app/destinasi/${dest.id}`}
                      className="inline-flex items-center justify-center w-full gap-2 bg-primary text-on-primary text-sm font-bold px-4 py-2.5 rounded-full"
                    >
                      <Icon name="directions" size="18px" />
                      Detail & Rute
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
