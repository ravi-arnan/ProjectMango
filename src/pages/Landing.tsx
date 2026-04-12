import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'

const navLinks = ['Features', 'Map', 'Forecasts']

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-stone-900">
      {/* ===================== TOP NAV BAR ===================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f5]/80 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="travel_explore" size="18px" className="text-on-primary" />
            </div>
            <span className="text-lg font-extrabold text-on-surface">BaliSense</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="bg-primary text-on-primary text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Access App
            </Link>
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? 'close' : 'menu'} size="24px" className="text-on-surface" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#fff8f5]/95 backdrop-blur-xl border-t border-stone-200/50 px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm font-medium text-on-surface-variant py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative h-[600px] lg:h-[870px] overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQZrkgR9E8aRTbbl2lzoV3nu0Dzn7NKA7v6W8NR5Stvcu-r73ly8vaq19HsCEJoEf0IX-jcz4U-htDzF5z7RUnC_qi6Eyk7o8ut2PUvmA9lvqYMXNXTXwUH4gQ4nmZ6giUW6teZIbEzhUTJkqGpfWM0xg8BAq1qX8Uo39bfNtIUGlrV6QK_qE4wzVr5-Wc3eh8yO2qO2eEq9kf4lmNd7o4dPZdJBR80IWol_0y3B-tVusuHLO528WS1jeaAIxGasz8OGeZ3tDdkkbG"
          alt="Bali temple"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16 lg:pb-24">
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-bold px-3.5 py-1.5 rounded-full w-fit mb-5">
            <Icon name="auto_awesome" size="14px" />
            Island Intelligence
          </span>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-white max-w-3xl leading-tight">
            Travel Smarter,{' '}
            <span className="text-primary-container">Avoid the Crowds</span>
          </h1>
          <p className="text-white/70 text-base lg:text-lg max-w-xl mt-4">
            Real-time crowd monitoring powered by AI. Know before you go -- find the perfect moment to visit Bali's most beautiful destinations.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button className="bg-primary text-on-primary font-bold text-sm px-6 py-3.5 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Icon name="install_mobile" size="18px" />
              Add to Home Screen
            </button>
            <Link
              to="/app/peta"
              className="bg-white/15 backdrop-blur-sm text-white font-bold text-sm px-6 py-3.5 rounded-full flex items-center gap-2 hover:bg-white/25 transition-colors"
            >
              <Icon name="map" size="18px" />
              View Live Map
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== FEATURE GRID (BENTO) ===================== */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-on-surface">Built for Smarter Travel</h2>
          <p className="text-on-surface-variant mt-3 max-w-lg mx-auto">
            Everything you need to navigate Bali's tourism landscape with confidence
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Real-time density tracking */}
          <div className="col-span-12 lg:col-span-7 bg-surface-container-low rounded-[2rem] p-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon name="speed" size="22px" className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-on-surface">Real-time density tracking</h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-6 max-w-md">
              Monitor crowd levels at every destination in real-time. Get instant updates so you always know the best time to visit.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Tanah Lot', density: 87, level: 'Peak', color: 'bg-error' },
                { name: 'Ubud Monkey Forest', density: 45, level: 'Moderate', color: 'bg-amber-500' },
                { name: 'Bedugul', density: 22, level: 'Ideal', color: 'bg-primary' },
              ].map((d) => (
                <div key={d.name} className="bg-white/60 rounded-xl p-4 flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${d.color} shrink-0`} />
                  <span className="text-sm font-semibold text-on-surface flex-1">{d.name}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${d.color} text-white`}>
                    {d.density}% {d.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 7-day forecasts */}
          <div className="col-span-12 lg:col-span-5 bg-tertiary-container rounded-[2rem] p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-on-tertiary-container/10 flex items-center justify-center">
                <Icon name="analytics" size="22px" className="text-on-tertiary-container" />
              </div>
              <h3 className="text-lg font-bold text-on-tertiary-container">7-day crowd forecasts</h3>
            </div>
            <p className="text-sm text-on-tertiary-container/70 mb-6">
              Plan ahead with AI-powered predictions for the week
            </p>
            <div className="flex-1 flex items-end gap-2">
              {[40, 65, 85, 70, 35, 25, 50].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-lg ${
                      h > 70 ? 'bg-error/80' : h > 50 ? 'bg-amber-500/80' : 'bg-on-tertiary-container/30'
                    }`}
                    style={{ height: `${h}px` }}
                  />
                  <span className="text-[10px] font-semibold text-on-tertiary-container/60">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI-powered recommendations */}
          <div className="col-span-12 bg-surface-container-low rounded-[2rem] p-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon name="auto_awesome" size="22px" className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-on-surface">AI-powered recommendations</h3>
                </div>
                <p className="text-sm text-on-surface-variant mb-4 max-w-md">
                  Get personalized destination suggestions based on your preferences, current crowd levels, and weather conditions.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Hidden Gems', 'Off-Peak Hours', 'Similar Vibes', 'Local Favorites', 'Budget Friendly'].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <div className="w-[140px] h-[180px] lg:w-[160px] lg:h-[200px] rounded-2xl overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOiPb4R_lTPY_1v0Bnqtuwp0PkLxJyGhONL3Dsvdg4usHWy5OWuTNBLi6eDlULDkFbE-YaaxTIyRG73HKci6HHQa_MRK2e6OJ_DA7BY33b36KQS3YY9sQ-roxZrd76W7hz-pJoT8LarVyZt9PZgbF5WjBiBFYmjnsMeGsPCoaPUUzj4cXJ4fcWlWXarc0ax92-pJOukDf6QmV05UUbWqWFEw9wNbyC1KMqVFhAJwq7Tsr7mzDSqcPeId60ySMS4S6qiwnJypIe2_LG"
                    alt="Bedugul"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-[140px] h-[180px] lg:w-[160px] lg:h-[200px] rounded-2xl overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsXSktpF3R6KkvhXzlAB8uQuGxq2iw7cy5ThjZqShUKo-GdCAqFcxJuC-QyrOEuNMQ1xFZuadYwgavd0J_c01cTa9Epg8TTaxL91OrXXrOPanHhCCTuubbeYomCoTqpXPs4k1bX1YodFFom2o40t5_f5J78d0k-SRIg-0dlWW9EeCdSa6-YfiHpmEJ9ErVYTITCZIoU4qkbDTfNQREO3a_VHng2iSQbWqU25jcTH5isZoubzCdBf_AAcR6g97S6kC2bqD7m7HSV_Km"
                    alt="Sanur"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== LIVE NOW SECTION ===================== */}
      <section id="map" className="bg-surface-container-low py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left - Text + Cards */}
            <div>
              <span className="inline-flex items-center gap-1.5 bg-error/10 text-error text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                Live Now
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-on-surface mb-3">
                See What's Happening Right Now
              </h2>
              <p className="text-on-surface-variant mb-8 max-w-md">
                Real-time crowd data from across the island. Plan your next move with confidence.
              </p>
              <div className="flex flex-col gap-3">
                <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF4oacVI2oNDBhKrKKx6XnxC3RY1U-Lbid1sQ-Y1zhyENTJw8QKj4z2YBwNP1BcGSV9lMRep8kyxWxdQ5fTGpmZqaYBEvmH6H_wG62x2fVIsjdRTYLGTgBCeC52UV8UoFXxPdV_ttwz9X3ftAJuf6LCf5FwozQ1HNpqVESrZri6ZXPQe8-J91Hyj4P2C_OI1C-xjgaOVTb9Ipcu8254RV8WdXnRA5Qsg-9ejPWngj_3bmWkA88BsCGPQi3yoU30fwTiJx7CofBUBLk"
                      alt="Uluwatu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface">Uluwatu Temple</p>
                    <p className="text-xs text-on-surface-variant">Pecatu, Badung</p>
                  </div>
                  <span className="bg-error text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
                    88% Peak
                  </span>
                </div>
                <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo6aKGaGU92q0xYEQ_QqBmxMDrcUuvJUoTh9qV4p8ZbVglihhmVeVSj566VKf2HICoufCLyPKeRPh_WTKzOe5aLZ_5BPVeoTU5V2pyMioOTfcMKRgVbqoFaPc7vSo-S7OCBG326fQeTX0rEqKGKHco6eciD1dgAF3xsadpi_2GYwfTMVIkSHMA2B2EVjIxDXDEDSx70QJI1R6f5NEsK5OM8jmFHHyU6_XCz_XKLMyEhT5us9D7Q5nWV1VOxZr7nVvZjFEnPOMjiwsO"
                      alt="Tegalalang"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface">Tegalalang Rice Terrace</p>
                    <p className="text-xs text-on-surface-variant">Ubud, Gianyar</p>
                  </div>
                  <span className="bg-primary text-on-primary text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
                    12% Ideal
                  </span>
                </div>
              </div>
            </div>

            {/* Right - Map Mockup */}
            <div className="bg-stone-100 rounded-[2rem] p-6 relative overflow-hidden" style={{ minHeight: '420px' }}>
              <svg
                viewBox="0 0 400 300"
                className="w-full h-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simplified Bali island shape */}
                <path
                  d="M80 180 C90 140, 120 100, 170 80 C200 70, 230 65, 260 70 C290 75, 320 90, 340 110 C355 125, 360 145, 350 165 C340 180, 320 195, 290 200 C260 210, 230 215, 200 210 C170 205, 140 200, 110 195 C95 190, 80 185, 80 180Z"
                  fill="#e8f5e9"
                  stroke="#4caf50"
                  strokeWidth="2"
                />
                {/* Destination markers */}
                {/* Tanah Lot */}
                <circle cx="130" cy="170" r="8" fill="#ef4444" />
                <text x="130" y="160" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#374151">Tanah Lot</text>
                <text x="130" y="193" textAnchor="middle" fontSize="7" fill="#6b7280">87%</text>

                {/* Uluwatu */}
                <circle cx="220" cy="200" r="8" fill="#ef4444" />
                <text x="220" y="218" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#374151">Uluwatu</text>
                <text x="220" y="228" textAnchor="middle" fontSize="7" fill="#6b7280">88%</text>

                {/* Ubud */}
                <circle cx="240" cy="110" r="8" fill="#f59e0b" />
                <text x="240" y="100" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#374151">Ubud</text>
                <text x="240" y="130" textAnchor="middle" fontSize="7" fill="#6b7280">45%</text>

                {/* Kintamani */}
                <circle cx="270" cy="80" r="8" fill="#22c55e" />
                <text x="270" y="70" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#374151">Kintamani</text>
                <text x="270" y="98" textAnchor="middle" fontSize="7" fill="#6b7280">35%</text>

                {/* Bedugul */}
                <circle cx="190" cy="100" r="8" fill="#22c55e" />
                <text x="190" y="90" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#374151">Bedugul</text>
                <text x="190" y="118" textAnchor="middle" fontSize="7" fill="#6b7280">22%</text>
              </svg>

              {/* Legend */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-3 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-error" />
                  <span className="text-[10px] font-medium text-stone-600">Peak (&gt;80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-medium text-stone-600">Moderate (30-80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-[10px] font-medium text-stone-600">Ideal (&lt;30%)</span>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="absolute top-6 right-6 flex flex-col gap-1">
                <button className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-stone-600 text-lg font-bold">
                  +
                </button>
                <button className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-stone-600 text-lg font-bold">
                  &minus;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA SECTION ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="bg-primary rounded-[40px] px-8 py-16 lg:px-16 lg:py-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-on-primary mb-4">
            Ready for a quieter paradise?
          </h2>
          <p className="text-on-primary/70 max-w-lg mx-auto mb-8">
            Download BaliSense and start exploring Bali with real-time crowd insights. Available on all platforms.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="bg-on-primary text-primary font-bold text-sm px-7 py-3.5 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              App Store
            </button>
            <button className="bg-on-primary text-primary font-bold text-sm px-7 py-3.5 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.04c-.63-.37-.87-1.04-.87-1.82V2.78c0-.78.24-1.45.87-1.82l11.05 11.05L3.18 23.04zM15.36 13.14l2.93 1.7-3.79 3.78-2.93-2.93 3.79-2.55zM15.36 10.86L11.57 8.31l2.93-2.93 3.79 3.79-2.93 1.69zM18.51 15.62l3.05 1.76c.79.46.79 1.22 0 1.68l-3.05 1.76-3.19-3.2 3.19-2z" />
              </svg>
              Google Play
            </button>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="travel_explore" size="16px" className="text-on-primary" />
              </div>
              <span className="text-sm font-extrabold text-on-surface">BaliSense</span>
            </div>
            <p className="text-xs text-on-surface-variant">
              &copy; 2026 BaliSense. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">
                Privacy
              </a>
              <a href="#" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">
                Terms
              </a>
              <a href="#" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
