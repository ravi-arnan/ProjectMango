import { useState } from 'react'
import Icon from '../components/Icon'

const settingsItems = [
  { icon: 'notifications', label: 'Notifikasi', type: 'toggle' as const, value: true },
  { icon: 'language', label: 'Bahasa', type: 'detail' as const, detail: 'Indonesia' },
  { icon: 'shield', label: 'Privasi', type: 'chevron' as const },
  { icon: 'help', label: 'Bantuan', type: 'chevron' as const },
  { icon: 'info', label: 'Tentang', type: 'detail' as const, detail: 'v1.0.0' },
]

const desktopSettings = [
  { icon: 'notifications', label: 'Notifications', subtitle: 'Manage alerts and push notifications' },
  { icon: 'shield', label: 'Privacy & Security', subtitle: 'Control your data and visibility' },
  { icon: 'language', label: 'Language', subtitle: 'App language and region preferences' },
  { icon: 'help', label: 'Help & Support', subtitle: 'FAQ, contact us, report a problem' },
  { icon: 'dark_mode', label: 'Appearance', subtitle: 'Theme, display, and accessibility' },
  { icon: 'logout', label: 'Logout', subtitle: 'Sign out of your account' },
]

export default function Profil() {
  const [notifEnabled, setNotifEnabled] = useState(true)

  return (
    <div>
      {/* ===================== MOBILE VIEW ===================== */}
      <div className="lg:hidden flex flex-col gap-5 pb-6">
        {/* Profile Hero */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="relative">
            <div className="w-[72px] h-[72px] rounded-full bg-primary flex items-center justify-center">
              <span className="text-on-primary text-xl font-bold">LT</span>
            </div>
            <button onClick={() => alert('Fitur ubah foto profil akan segera hadir!')} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center shadow-md">
              <Icon name="edit" size="14px" className="text-on-surface" />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-on-surface">Lintang Pratiwi</h1>
            <p className="text-sm text-on-surface-variant mt-0.5">Traveler aktif &middot; Bali</p>
          </div>
        </div>

        {/* Stat Chips */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="bg-surface-container-high rounded-full px-4 py-2 text-xs font-semibold text-on-surface">
            12 Destinasi
          </span>
          <span className="bg-surface-container-high rounded-full px-4 py-2 text-xs font-semibold text-on-surface">
            3 Ulasan
          </span>
          <span className="bg-surface-container-high rounded-full px-4 py-2 text-xs font-semibold text-on-surface">
            Anggota sejak 2025
          </span>
        </div>

        {/* Settings List */}
        <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-1">
          {settingsItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 py-3 cursor-pointer"
              onClick={() => {
                if (item.label === 'Bahasa') alert('Fitur pengaturan bahasa akan segera hadir!')
                else if (item.label === 'Privasi') alert('Fitur pengaturan privasi akan segera hadir!')
                else if (item.label === 'Bantuan') alert('Hubungi kami di support@balisense.id')
                else if (item.label === 'Tentang') alert('BaliSense v1.0.0\nDibangun untuk AI Impact Challenge')
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon name={item.icon} size="20px" className="text-primary" />
              </div>
              <span className="flex-1 text-sm font-semibold text-on-surface">{item.label}</span>
              {item.type === 'toggle' && (
                <button
                  onClick={() => setNotifEnabled(!notifEnabled)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    notifEnabled ? 'bg-primary' : 'bg-on-surface/20'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      notifEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              )}
              {item.type === 'detail' && (
                <span className="text-xs text-on-surface-variant">{item.detail}</span>
              )}
              {item.type === 'chevron' && (
                <Icon name="chevron_right" size="20px" className="text-on-surface-variant" />
              )}
            </div>
          ))}
        </div>

        {/* Azure Badge */}
        <div className="flex flex-col items-center gap-3 py-4 px-6">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M33.7 0L0 32.5l17.5 50.4L33.7 96l62.3-76.3L33.7 0z" fill="#0078D4" />
              <path d="M33.7 0L9.5 56.3 33.7 96 96 19.7 33.7 0z" fill="url(#azure-a)" />
              <path d="M62.3 44.4L33.7 96l62.3-76.3-33.7 24.7z" fill="#0078D4" />
              <defs>
                <linearGradient id="azure-a" x1="33.7" y1="0" x2="33.7" y2="96" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1988D9" />
                  <stop offset="1" stopColor="#54AEF0" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xs font-semibold text-on-surface-variant">Didukung Microsoft Azure AI</span>
          </div>
          <p className="text-[10px] text-on-surface-variant/60 text-center leading-relaxed">
            BaliSense dikembangkan sebagai bagian dari Microsoft AI Impact Challenge untuk membantu pariwisata berkelanjutan di Bali.
          </p>
        </div>
      </div>

      {/* ===================== DESKTOP VIEW ===================== */}
      <div className="hidden lg:flex flex-col gap-8 pb-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-on-surface">Your Sanctuary</h1>
          <p className="text-on-surface-variant mt-1">Manage your profile, preferences, and account settings</p>
        </div>

        {/* Profile Overview Bento Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Large Avatar Card */}
          <div className="col-span-7 bg-surface-container-low rounded-[2.5rem] p-8 flex items-center gap-8">
            <div className="w-[160px] h-[160px] rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-on-primary text-5xl font-bold">ES</span>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-on-surface">Elena Sastro</h2>
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Icon name="verified" size="16px" className="text-on-primary" filled />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="location_on" size="16px" className="text-on-surface-variant" />
                  <span className="text-sm text-on-surface-variant">Denpasar, Bali</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => alert('Fitur edit profil akan segera hadir!')} className="bg-primary text-on-primary text-sm font-bold px-6 py-2.5 rounded-full flex items-center gap-2">
                  <Icon name="edit" size="16px" />
                  Edit Profile
                </button>
                <button onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'Profil BaliSense', url: window.location.href })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link profil disalin!')
                  }
                }} className="bg-surface-container-high text-on-surface text-sm font-bold px-6 py-2.5 rounded-full flex items-center gap-2">
                  <Icon name="share" size="16px" />
                  Share Profile
                </button>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="col-span-5 grid grid-cols-2 gap-4">
            {/* Destinations Card */}
            <div className="bg-surface-container-low rounded-[2rem] p-6 flex flex-col justify-between">
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Destinations</p>
                <p className="text-4xl font-extrabold text-on-surface mt-1">42</p>
              </div>
              <div className="flex -space-x-2 mt-4">
                {['bg-primary', 'bg-tertiary', 'bg-error', 'bg-amber-500'].map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-surface-container-low flex items-center justify-center`}
                  >
                    <span className="text-white text-[10px] font-bold">{['B', 'U', 'K', 'T'][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Card */}
            <div className="bg-surface-container-low rounded-[2rem] p-6 flex flex-col justify-between">
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Reviews</p>
                <p className="text-4xl font-extrabold text-on-surface mt-1">128</p>
              </div>
              <div className="flex items-center gap-1 mt-4">
                {[1, 2, 3, 4].map((s) => (
                  <Icon key={s} name="star" size="18px" className="text-amber-500" filled />
                ))}
                <Icon name="star_half" size="18px" className="text-amber-500" filled />
                <span className="text-sm font-semibold text-on-surface ml-1">4.8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-surface-container-low/50 rounded-[2.5rem] p-10">
          <h2 className="text-xl font-bold text-on-surface mb-6">Account Settings</h2>
          <div className="grid grid-cols-2 gap-3">
            {desktopSettings.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === 'Notifications') alert('Fitur pengaturan notifikasi akan segera hadir!')
                  else if (item.label === 'Privacy & Security') alert('Fitur pengaturan privasi akan segera hadir!')
                  else if (item.label === 'Language') alert('Fitur pengaturan bahasa akan segera hadir!')
                  else if (item.label === 'Help & Support') alert('Hubungi kami di support@balisense.id')
                  else if (item.label === 'Appearance') alert('Fitur pengaturan tampilan akan segera hadir!')
                  else if (item.label === 'Logout') alert('Fitur logout akan segera hadir!')
                }}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-container-high/50 transition-all hover:translate-x-1 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon name={item.icon} size="22px" className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface">{item.label}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{item.subtitle}</p>
                </div>
                <Icon name="chevron_right" size="20px" className="text-on-surface-variant shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Support Banner */}
        <div className="relative bg-stone-900 rounded-[2.5rem] h-48 overflow-hidden flex items-center">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQZrkgR9E8aRTbbl2lzoV3nu0Dzn7NKA7v6W8NR5Stvcu-r73ly8vaq19HsCEJoEf0IX-jcz4U-htDzF5z7RUnC_qi6Eyk7o8ut2PUvmA9lvqYMXNXTXwUH4gQ4nmZ6giUW6teZIbEzhUTJkqGpfWM0xg8BAq1qX8Uo39bfNtIUGlrV6QK_qE4wzVr5-Wc3eh8yO2qO2eEq9kf4lmNd7o4dPZdJBR80IWol_0y3B-tVusuHLO528WS1jeaAIxGasz8OGeZ3tDdkkbG"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent" />
          <div className="relative z-10 px-10 flex items-center justify-between w-full">
            <div>
              <h3 className="text-2xl font-bold text-white">Sukai BaliSense?</h3>
              <p className="text-white/60 text-sm mt-1">Bantu kami mewujudkan pariwisata berkelanjutan di Bali</p>
            </div>
            <a href="https://balisense.id" target="_blank" rel="noopener noreferrer" className="bg-white text-stone-900 font-bold text-sm px-6 py-3 rounded-full shrink-0">
              Kunjungi Website
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
