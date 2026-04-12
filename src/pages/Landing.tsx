import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Map', href: '#map' },
  { label: 'Forecasts', href: '#forecasts' },
]

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-on-surface font-body">
      {/* ==================== TOP NAV ==================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f5]/80 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between">
          <span className="text-xl font-extrabold text-cyan-900 font-headline tracking-tight">BaliSense</span>

          <div className="hidden md:flex items-center gap-8 font-headline font-medium text-sm tracking-tight">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                className={
                  i === 0
                    ? 'text-cyan-700 border-b-2 border-cyan-600 pb-0.5'
                    : 'text-slate-600 hover:text-cyan-600 transition-colors'
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="bg-primary hover:opacity-90 transition-opacity text-on-primary px-5 py-2 rounded-lg font-headline font-bold text-sm"
            >
              Access App
            </Link>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? 'close' : 'menu'} className="text-on-surface" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#fff8f5]/95 backdrop-blur-xl border-t border-stone-200/50 px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-on-surface-variant py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <main className="pt-14">
        {/* ==================== HERO ==================== */}
        <section className="relative h-[520px] sm:h-[600px] lg:h-[85vh] min-h-[600px] overflow-hidden mx-3 sm:mx-4 lg:mx-6 mt-3 rounded-2xl lg:rounded-3xl">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPkyKpOUGRxjZaYoSPnwTv6kQxiuRodxfFVuy8pf_OspiMe_t_ARtW81u-N0HRKbzRZWPEUaGU4XiIYxxpDWxPE5CYvzeKAjwgL6narP9awa6i2AqpxdKgd9IXw76EGOdb2QtQbSYJWxmkAX_hq56a30lKRNF30uZDX5InyuU8A8vNcwEar1bcUPUBIZNmATetRwRlhNUuEGyZ_-bVLdc3N4BsYh9F7ruytFA4eiCXBjchmVjh9OCMZJGJuLCj7n0wre71c7Eorp81"
            alt="Tanah Lot temple at sunset"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-10 lg:px-14 pb-10 lg:pb-14 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white/90 text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-widest">
              Island Intelligence
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-headline font-extrabold text-white leading-[1.1] mb-4">
              Travel Smarter,<br />Avoid the Crowds
            </h1>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
              Experience Bali's serenity exactly how it was meant to be. Our AI-driven
              forecasts help you find the quietest moments at the island's most iconic destinations.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/app"
                className="bg-primary text-on-primary font-bold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Add to Home Screen
              </Link>
              <a
                href="#map"
                className="bg-white/15 backdrop-blur-sm text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-white/25 transition-colors border border-white/20"
              >
                View Live Map
              </a>
            </div>
          </div>
        </section>

        {/* ==================== FEATURES BENTO ==================== */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24">
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {/* Real-time density tracking */}
            <div className="col-span-12 lg:col-span-7 bg-surface-container-low rounded-[1.5rem] lg:rounded-[2rem] p-7 lg:p-10 flex flex-col justify-between min-h-[320px]">
              <div>
                <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white mb-5">
                  <Icon name="speed" />
                </div>
                <h3 className="text-xl lg:text-2xl font-headline font-bold text-on-surface mb-3">
                  Real-time density tracking
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-md">
                  Using anonymized satellite data and ground-level sensors,
                  we provide live occupancy updates for over 200 locations across Bali.
                </p>
              </div>
              <div className="flex gap-3 mt-6 overflow-x-auto no-scrollbar">
                <div className="bg-surface-container-lowest p-3.5 rounded-xl min-w-[170px] shadow-sm border border-stone-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-bold text-on-surface-variant tracking-wide">ULI KITCHEN</span>
                    <span className="bg-error/10 text-error px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">BUSY</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="bg-error h-full rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-3.5 rounded-xl min-w-[170px] shadow-sm border border-stone-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-bold text-on-surface-variant tracking-wide">MELASTI BEACH</span>
                    <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">CALM</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 7-day crowd forecasts */}
            <div className="col-span-12 lg:col-span-5 bg-tertiary-container rounded-[1.5rem] lg:rounded-[2rem] p-7 lg:p-10 text-white flex flex-col justify-between min-h-[320px]">
              <div>
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                  <Icon name="analytics" />
                </div>
                <h3 className="text-xl lg:text-2xl font-headline font-bold mb-3">
                  7-day crowd forecasts
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Plan your itinerary with precision. Our machine learning models predict peaks
                  based on tourism trends, local ceremonies, and flight data.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mt-6 border border-white/10">
                <div className="flex items-end gap-2 h-24">
                  {[38, 55, 42, 80, 62, 48, 30].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-md ${i === 3 ? 'bg-white' : 'bg-white/40'}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-bold opacity-60 uppercase">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI-powered recommendations */}
            <div className="col-span-12 bg-surface-container-highest rounded-[1.5rem] lg:rounded-[2rem] p-7 lg:p-10">
              <div className="flex flex-col md:flex-row md:items-start gap-6 lg:gap-10">
                <div className="flex-1">
                  <div className="w-11 h-11 bg-primary-container rounded-xl flex items-center justify-center text-white mb-5">
                    <Icon name="auto_awesome" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-headline font-bold text-on-surface mb-3">
                    AI-powered recommendations
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-5 max-w-md">
                    Tailored suggestions that adapt to your style and the current island vibe.
                    Whether you seek hidden waterfalls or sunset cocktails, BaliSense guides you
                    to the perfect spot at the perfect time.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['#HiddenGems', '#QuietMorning', '#SurfReport'].map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 bg-surface-container-low text-on-surface-variant text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 shrink-0">
                  <div className="w-[130px] h-[170px] lg:w-[160px] lg:h-[200px] rounded-2xl overflow-hidden">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgmeM2kxs0PnMzEiCZXeSVytMB3vvx2I9K2zm7YDk-KpNdC9KmoYAcrDGaO_Dn8QL4YqGKgFG9PnWuyLIVztHgPNvs5MqM0otb1bAmyNIMoC2CZ6_JXr7uYfYkY_PrTx3U7MERHLQd6loHnpnkpkme4Vcu3FIkXupKasHJDmudu9JBeEGbSYTh0r-luNn4x9Byu-GeUdpCXcx_WFF4gscGVUZL6wQ2i6UnXR7i5vjwcXR2lS8ZWuT5VotScLdOemLvNnxfnTEshYJY"
                      alt="Tropical breakfast"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-[130px] h-[170px] lg:w-[160px] lg:h-[200px] rounded-2xl overflow-hidden">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzSaLnUuBNhk1IxlNanTZ-nP0p3RHZpBG1bD8kAcB4V0HOU3L3NwGBHwex3p8BVkhiAYcrs8cfOB4vU2nAB5TfqurxCHfttaHL7i-N3DxfJhHpKWkGWKPz5vzGPmATH315rSmeYxifYZFERhGeEWpiaVu9I-xc5oQMoHdxccEZk0XxJminbPuyluuJ6xyBAOLK8gffLEOjvpnzzSE8e6H2oIZCnxKWLHUGpRsN7U_H8oglOgtx6qEa5qJbhIUyTFkIMOaAl1m0FOq_"
                      alt="Waterfall"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== LIVE NOW ==================== */}
        <section id="map" className="bg-surface-container-low py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left text + cards */}
              <div>
                <h2 className="text-3xl lg:text-4xl font-headline font-extrabold text-on-surface mb-4">Live Now</h2>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-8 max-w-md">
                  The island is breathing. Watch live density pulses across Bali's hotspots.
                  Green markers indicate optimal visiting times, while amber and red show growing crowds.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl shadow-sm">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shrink-0">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF4oacVI2oNDBhKrKKx6XnxC3RY1U-Lbid1sQ-Y1zhyENTJw8QKj4z2YBwNP1BcGSV9lMRep8kyxWxdQ5fTGpmZqaYBEvmH6H_wG62x2fVIsjdRTYLGTgBCeC52UV8UoFXxPdV_ttwz9X3ftAJuf6LCf5FwozQ1HNpqVESrZri6ZXPQe8-J91Hyj4P2C_OI1C-xjgaOVTb9Ipcu8254RV8WdXnRA5Qsg-9ejPWngj_3bmWkA88BsCGPQi3yoU30fwTiJx7CofBUBLk"
                        alt="Uluwatu"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface">Uluwatu Temple</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-error" />
                        <span className="text-xs text-error font-bold">Peak Crowd (88%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl shadow-sm border border-primary/10">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shrink-0">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo6aKGaGU92q0xYEQ_QqBmxMDrcUuvJUoTh9qV4p8ZbVglihhmVeVSj566VKf2HICoufCLyPKeRPh_WTKzOe5aLZ_5BPVeoTU5V2pyMioOTfcMKRgVbqoFaPc7vSo-S7OCBG326fQeTX0rEqKGKHco6eciD1dgAF3xsadpi_2GYwfTMVIkSHMA2B2EVjIxDXDEDSx70QJI1R6f5NEsK5OM8jmFHHyU6_XCz_XKLMyEhT5us9D7Q5nWV1VOxZr7nVvZjFEnPOMjiwsO"
                        alt="Tegallalang"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface">Tegallalang Terraces</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs text-primary font-bold">Ideal Visit (12%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right map mockup */}
              <div className="relative bg-[#aad3df] rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 lg:border-8 border-white" style={{ minHeight: '440px' }}>
                {/* Grid texture background */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: '#e5e7eb',
                    backgroundImage:
                      'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                >
                  <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none">
                    <path
                      d="M100,300 Q200,150 400,100 T700,120 T900,300 T700,500 T400,550 T100,450 Z"
                      fill="#f2efe9"
                      stroke="#99b3cc"
                      strokeWidth="2"
                    />
                    <path d="M450,150 Q500,200 480,250 T400,230 Z" fill="#cfe6d1" />
                    <path d="M600,350 Q650,400 630,450 T550,430 Z" fill="#cfe6d1" />
                    <path d="M400,100 L420,550" stroke="#fff" strokeWidth="4" />
                    <path d="M100,300 L900,320" stroke="#fff" strokeWidth="3" />
                  </svg>
                </div>

                {/* Live badge */}
                <div className="absolute top-4 lg:top-6 left-4 lg:left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-slate-200">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    Live Density Updates
                  </span>
                </div>

                {/* Zoom controls */}
                <div className="absolute top-4 lg:top-6 right-4 lg:right-6 flex flex-col gap-1.5 z-20">
                  <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-xl shadow flex items-center justify-center text-on-surface hover:bg-white transition-colors">
                    <Icon name="add" />
                  </button>
                  <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-xl shadow flex items-center justify-center text-on-surface hover:bg-white transition-colors">
                    <Icon name="remove" />
                  </button>
                  <button className="w-10 h-10 bg-primary text-on-primary rounded-xl shadow flex items-center justify-center hover:opacity-90 transition-opacity mt-1">
                    <Icon name="my_location" filled />
                  </button>
                </div>

                {/* Tanah Lot marker */}
                <div className="absolute z-20" style={{ top: '32%', left: '30%' }}>
                  <div className="relative flex flex-col items-center">
                    <div className="absolute -inset-5 bg-primary/20 rounded-full animate-pulse" />
                    <div className="w-5 h-5 bg-primary border-[3px] border-white rounded-full relative z-10 shadow-lg" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap border border-slate-100 flex flex-col pointer-events-none">
                      <span className="text-[11px] font-bold text-on-surface">Tanah Lot Temple</span>
                      <span className="text-[10px] font-medium text-primary flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Calm · 15% Busy
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ubud marker */}
                <div className="absolute z-20" style={{ top: '48%', left: '50%' }}>
                  <div className="relative flex flex-col items-center">
                    <div className="w-4 h-4 bg-tertiary border-[3px] border-white rounded-full shadow-md" />
                  </div>
                </div>

                {/* Uluwatu marker */}
                <div className="absolute z-20" style={{ bottom: '22%', left: '42%' }}>
                  <div className="relative flex flex-col items-center">
                    <div className="absolute -inset-6 bg-error/25 rounded-full animate-pulse" />
                    <div className="w-5 h-5 bg-error border-[3px] border-white rounded-full relative z-10 shadow-lg" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap border border-slate-100 flex flex-col pointer-events-none">
                      <span className="text-[11px] font-bold text-on-surface">Uluwatu Temple</span>
                      <span className="text-[10px] font-medium text-error flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-error" />
                        Peak Crowds · 88% Busy
                      </span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl flex flex-col gap-2 border border-white/40 shadow-xl z-20">
                  {[
                    { color: 'bg-primary', label: 'CALM' },
                    { color: 'bg-tertiary', label: 'MODERATE' },
                    { color: 'bg-error', label: 'BUSY' },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                      <span className="text-[10px] font-bold text-on-surface uppercase tracking-tight">{l.label}</span>
                    </div>
                  ))}
                </div>

                {/* Active users */}
                <div className="absolute bottom-4 lg:bottom-6 right-4 lg:right-6 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl flex items-center gap-3 border border-white/40 shadow-xl z-20">
                  <div className="flex -space-x-2.5">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 shadow-sm">
                      JD
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-700 shadow-sm">
                      AS
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[9px] font-bold shadow-sm">
                      +12
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-on-surface">1,204 users exploring live</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section id="forecasts" className="px-4 sm:px-6 lg:px-12 py-16 lg:py-28 text-center">
          <div className="max-w-4xl mx-auto bg-primary py-14 lg:py-20 px-8 lg:px-16 rounded-[2rem] lg:rounded-[2.5rem] text-on-primary relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-container/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            <h2 className="text-3xl lg:text-5xl font-headline font-extrabold mb-4 lg:mb-6 relative z-10">
              Ready for a quieter paradise?
            </h2>
            <p className="text-base lg:text-lg opacity-80 mb-8 lg:mb-10 max-w-xl mx-auto relative z-10">
              Join over 50,000 travelers who use BaliSense to discover the island's hidden peace.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center relative z-10">
              <button onClick={() => alert('Segera tersedia di App Store!')} className="bg-white text-primary px-8 py-3.5 lg:py-4 rounded-xl font-headline font-bold text-base hover:bg-surface-container-lowest transition-all shadow-lg">
                App Store
              </button>
              <button onClick={() => alert('Segera tersedia di Google Play!')} className="bg-primary-container border border-white/20 text-white px-8 py-3.5 lg:py-4 rounded-xl font-headline font-bold text-base hover:bg-primary-container/80 transition-all shadow-lg">
                Google Play
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="w-full py-8 lg:py-10 px-4 sm:px-6 lg:px-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-cyan-900 text-lg font-headline">BaliSense</span>
            <p className="text-[11px] text-slate-500">
              © 2024 BaliSense Intelligence. Preserving the island's harmony.
            </p>
          </div>
          <div className="flex gap-8 text-xs text-slate-500">
            <a className="hover:text-cyan-600 transition-colors" href="#" onClick={(e) => { e.preventDefault(); alert('Kebijakan privasi akan segera tersedia.') }}>Privacy Policy</a>
            <a className="hover:text-cyan-600 transition-colors" href="#" onClick={(e) => { e.preventDefault(); alert('Ketentuan layanan akan segera tersedia.') }}>Terms of Service</a>
            <a className="hover:text-cyan-600 transition-colors" href="#" onClick={(e) => { e.preventDefault(); alert('Hubungi kami di support@balisense.id') }}>Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
