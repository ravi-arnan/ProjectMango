import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import SettingsModal from '../components/SettingsModal'
import { useAuth, getUserInitials, getUserFullName } from '../context/AuthContext'
import { useBookings } from '../hooks/useBookings'
import { useWatchlist } from '../hooks/useWatchlist'
import { useNotifications } from '../hooks/useNotifications'
import { destinations } from '../data/destinations'
import { formatDate, formatCurrency } from '../lib/utils'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../lib/storage'
import { showToast } from '../components/Toast'
import { supabase } from '../lib/supabase'

type ModalType = 'language' | 'privacy' | 'about' | 'edit' | 'help' | 'appearance' | null

export default function Profil() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { bookings, cancelBooking, getUpcomingBookings } = useBookings()
  const { watchlist } = useWatchlist()
  const { prefs, updatePrefs } = useNotifications()
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [editName, setEditName] = useState(user?.user_metadata?.full_name || '')
  const [selectedLang, setSelectedLang] = useState(() => getStorageItem(STORAGE_KEYS.SETTINGS + '_lang', 'id'))
  const [selectedAvatar, setSelectedAvatar] = useState(() => getStorageItem<number>(STORAGE_KEYS.AVATAR, 0))

  const displayName = getUserFullName(user)
  const initials = getUserInitials(user)
  const isGuest = user?.is_anonymous
  const upcomingBookings = getUpcomingBookings()
  const watchlistedDests = destinations.filter((d) => watchlist.includes(d.id))

  const avatarColors = ['bg-primary', 'bg-tertiary', 'bg-error', 'bg-amber-500', 'bg-emerald-500', 'bg-violet-500']

  async function handleLogout() {
    await signOut()
    navigate('/auth')
  }

  async function handleEditProfile() {
    if (editName.trim() && !isGuest) {
      await supabase.auth.updateUser({ data: { full_name: editName.trim() } })
      showToast('Profil berhasil diperbarui')
    }
    setActiveModal(null)
  }

  function handleLanguageChange(lang: string) {
    setSelectedLang(lang)
    setStorageItem(STORAGE_KEYS.SETTINGS + '_lang', lang)
    showToast('Bahasa berhasil diubah')
  }

  function handleAvatarChange(idx: number) {
    setSelectedAvatar(idx)
    setStorageItem(STORAGE_KEYS.AVATAR, idx)
    showToast('Avatar berhasil diubah')
  }

  const settingsItems = [
    { icon: 'notifications', label: 'Notifikasi', type: 'toggle' as const },
    { icon: 'language', label: 'Bahasa', type: 'detail' as const, detail: selectedLang === 'id' ? 'Indonesia' : 'English', action: () => setActiveModal('language') },
    { icon: 'shield', label: 'Privasi', type: 'chevron' as const, action: () => setActiveModal('privacy') },
    { icon: 'help', label: 'Bantuan', type: 'chevron' as const, action: () => setActiveModal('help') },
    { icon: 'info', label: 'Tentang', type: 'detail' as const, detail: 'v1.0.0', action: () => setActiveModal('about') },
  ]

  const desktopSettings = [
    { icon: 'notifications', label: 'Notifications', subtitle: 'Manage alerts and push notifications', action: () => setActiveModal('privacy') },
    { icon: 'shield', label: 'Privacy & Security', subtitle: 'Control your data and visibility', action: () => setActiveModal('privacy') },
    { icon: 'language', label: 'Language', subtitle: 'App language and region preferences', action: () => setActiveModal('language') },
    { icon: 'help', label: 'Help & Support', subtitle: 'FAQ, contact us, report a problem', action: () => setActiveModal('help') },
    { icon: 'dark_mode', label: 'Appearance', subtitle: 'Theme, display, and accessibility', action: () => setActiveModal('appearance') },
    { icon: 'logout', label: 'Logout', subtitle: 'Sign out of your account', action: handleLogout },
  ]

  return (
    <div>
      {/* MOBILE VIEW */}
      <div className="lg:hidden flex flex-col gap-5 pb-6">
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="relative">
            <div className={`w-[72px] h-[72px] rounded-full ${avatarColors[selectedAvatar]} flex items-center justify-center`}>
              <span className="text-white text-xl font-bold">{initials}</span>
            </div>
            <button onClick={() => {
              const next = (selectedAvatar + 1) % avatarColors.length
              handleAvatarChange(next)
            }} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center shadow-md">
              <Icon name="edit" size="14px" className="text-on-surface" />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-on-surface">{displayName}</h1>
            <p className="text-sm text-on-surface-variant mt-0.5">{isGuest ? 'Tamu' : 'Traveler aktif'} &middot; Bali</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <span className="bg-surface-container-high rounded-full px-4 py-2 text-xs font-semibold text-on-surface">{watchlist.length} Destinasi</span>
          <span className="bg-surface-container-high rounded-full px-4 py-2 text-xs font-semibold text-on-surface">{bookings.length} Booking</span>
          <span className="bg-surface-container-high rounded-full px-4 py-2 text-xs font-semibold text-on-surface">Anggota sejak 2025</span>
        </div>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-on-surface mb-3">Booking Mendatang</h3>
            <div className="flex flex-col gap-2">
              {upcomingBookings.slice(0, 3).map((b) => (
                <div key={b.id} className="bg-surface-container-low rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-on-surface">{b.destinationName}</p>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Confirmed</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">{formatDate(b.date)} &middot; {b.visitors} orang</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-mono text-on-surface-variant">{b.ticketCode}</span>
                    <button onClick={() => cancelBooking(b.id)} className="text-xs text-error font-semibold">Batalkan</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Watchlist */}
        {watchlistedDests.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-on-surface mb-3">Watchlist</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {watchlistedDests.map((dest) => (
                <div key={dest.id} className="shrink-0 w-32 bg-surface-container-low rounded-xl overflow-hidden" onClick={() => navigate(`/app/destinasi/${dest.id}`)}>
                  <img src={dest.image} alt={dest.name} className="w-full h-20 object-cover" />
                  <div className="p-2">
                    <p className="text-xs font-bold text-on-surface truncate">{dest.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{dest.densityLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-1">
          {settingsItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-3 cursor-pointer" onClick={item.action}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon name={item.icon} size="20px" className="text-primary" />
              </div>
              <span className="flex-1 text-sm font-semibold text-on-surface">{item.label}</span>
              {item.type === 'toggle' && (
                <button onClick={(e) => { e.stopPropagation(); updatePrefs({ crowdAlerts: !prefs.crowdAlerts }) }}
                  className={`w-11 h-6 rounded-full relative transition-colors ${prefs.crowdAlerts ? 'bg-primary' : 'bg-on-surface/20'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${prefs.crowdAlerts ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              )}
              {item.type === 'detail' && <span className="text-xs text-on-surface-variant">{item.detail}</span>}
              {item.type === 'chevron' && <Icon name="chevron_right" size="20px" className="text-on-surface-variant" />}
            </div>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="w-full py-3 bg-error/10 text-error rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
          <Icon name="logout" size="18px" />Keluar
        </button>

        <div className="flex flex-col items-center gap-3 py-4 px-6">
          <p className="text-[10px] text-on-surface-variant/60 text-center leading-relaxed">
            Mango dikembangkan sebagai bagian dari Microsoft AI Impact Challenge untuk membantu pariwisata berkelanjutan di Bali.
          </p>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden lg:flex flex-col gap-8 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-on-surface">Profil Anda</h1>
          <p className="text-on-surface-variant mt-1">Manage your profile, preferences, and account settings</p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7 bg-surface-container-low rounded-[2.5rem] p-8 flex items-center gap-8">
            <div className={`w-[160px] h-[160px] rounded-full ${avatarColors[selectedAvatar]} flex items-center justify-center shrink-0 cursor-pointer`}
              onClick={() => handleAvatarChange((selectedAvatar + 1) % avatarColors.length)}>
              <span className="text-white text-5xl font-bold">{initials}</span>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-on-surface">{displayName}</h2>
                  {!isGuest && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Icon name="verified" size="16px" className="text-on-primary" filled />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="location_on" size="16px" className="text-on-surface-variant" />
                  <span className="text-sm text-on-surface-variant">Denpasar, Bali</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setEditName(user?.user_metadata?.full_name || ''); setActiveModal('edit') }}
                  className="bg-primary text-on-primary text-sm font-bold px-6 py-2.5 rounded-full flex items-center gap-2">
                  <Icon name="edit" size="16px" />Edit Profile
                </button>
                <button onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'Profil Mango', url: window.location.href })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    showToast('Link profil disalin!')
                  }
                }} className="bg-surface-container-high text-on-surface text-sm font-bold px-6 py-2.5 rounded-full flex items-center gap-2">
                  <Icon name="share" size="16px" />Share Profile
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low rounded-[2rem] p-6 flex flex-col justify-between">
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Destinations</p>
                <p className="text-4xl font-extrabold text-on-surface mt-1">{watchlist.length}</p>
              </div>
              <p className="text-xs text-on-surface-variant mt-4">di watchlist</p>
            </div>
            <div className="bg-surface-container-low rounded-[2rem] p-6 flex flex-col justify-between">
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Bookings</p>
                <p className="text-4xl font-extrabold text-on-surface mt-1">{bookings.length}</p>
              </div>
              <p className="text-xs text-on-surface-variant mt-4">{upcomingBookings.length} mendatang</p>
            </div>
          </div>
        </div>

        {/* Booking History */}
        {bookings.length > 0 && (
          <div className="bg-surface-container-low/50 rounded-[2.5rem] p-8">
            <h2 className="text-xl font-bold text-on-surface mb-4">Riwayat Booking</h2>
            <div className="grid grid-cols-2 gap-4">
              {bookings.slice(0, 4).map((b) => (
                <div key={b.id} className="bg-surface-container-lowest rounded-2xl p-5 flex items-start justify-between">
                  <div>
                    <p className="font-bold text-on-surface">{b.destinationName}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{formatDate(b.date)} &middot; {b.visitors} orang</p>
                    <p className="text-xs font-mono text-on-surface-variant mt-1">{b.ticketCode}</p>
                    <p className="text-sm font-semibold text-primary mt-2">{b.totalPrice === 0 ? 'Gratis' : formatCurrency(b.totalPrice)}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    b.status === 'cancelled' ? 'bg-error/10 text-error' : 'bg-stone-100 text-stone-600'
                  }`}>{b.status === 'confirmed' ? 'Confirmed' : b.status === 'cancelled' ? 'Cancelled' : 'Completed'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="bg-surface-container-low/50 rounded-[2.5rem] p-10">
          <h2 className="text-xl font-bold text-on-surface mb-6">Account Settings</h2>
          <div className="grid grid-cols-2 gap-3">
            {desktopSettings.map((item) => (
              <button key={item.label} onClick={item.action}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-container-high/50 transition-all hover:translate-x-1 text-left">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon name={item.icon} size="22px" className={item.label === 'Logout' ? 'text-error' : 'text-primary'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${item.label === 'Logout' ? 'text-error' : 'text-on-surface'}`}>{item.label}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{item.subtitle}</p>
                </div>
                <Icon name="chevron_right" size="20px" className="text-on-surface-variant shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="relative bg-stone-900 rounded-[2.5rem] h-48 overflow-hidden flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent" />
          <div className="relative z-10 px-10 flex items-center justify-between w-full">
            <div>
              <h3 className="text-2xl font-bold text-white">Sukai Mango?</h3>
              <p className="text-white/60 text-sm mt-1">Bantu kami mewujudkan pariwisata berkelanjutan di Indonesia</p>
            </div>
            <a href="mailto:support@mango.id" className="bg-white text-stone-900 font-bold text-sm px-6 py-3 rounded-full shrink-0">
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>

      {/* Settings Modals */}
      <SettingsModal title="Bahasa" isOpen={activeModal === 'language'} onClose={() => setActiveModal(null)}>
        <div className="space-y-2">
          {[{ code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' }, { code: 'en', label: 'English', flag: '🇬🇧' }].map((lang) => (
            <button key={lang.code} onClick={() => { handleLanguageChange(lang.code); setActiveModal(null) }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${selectedLang === lang.code ? 'bg-primary/10 border border-primary/20' : 'hover:bg-stone-50'}`}>
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm font-semibold text-on-surface">{lang.label}</span>
              {selectedLang === lang.code && <Icon name="check_circle" size="20px" className="text-primary ml-auto" filled />}
            </button>
          ))}
        </div>
      </SettingsModal>

      <SettingsModal title="Privasi & Keamanan" isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)}>
        <div className="space-y-4">
          {[
            { label: 'Notifikasi keramaian', desc: 'Terima pemberitahuan saat destinasi favorit mulai sepi', key: 'crowdAlerts' as const, value: prefs.crowdAlerts },
            { label: 'Pengingat booking', desc: 'Ingatkan sehari sebelum jadwal kunjungan', key: 'bookingReminders' as const, value: prefs.bookingReminders },
            { label: 'Rekomendasi', desc: 'Saran destinasi berdasarkan preferensi Anda', key: 'recommendations' as const, value: prefs.recommendations },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-on-surface">{item.label}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
              </div>
              <button onClick={() => updatePrefs({ [item.key]: !item.value })}
                className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${item.value ? 'bg-primary' : 'bg-on-surface/20'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${item.value ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </SettingsModal>

      <SettingsModal title="Tentang Mango" isOpen={activeModal === 'about'} onClose={() => setActiveModal(null)}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Icon name="travel_explore" size="32px" className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface">Mango</h3>
            <p className="text-sm text-on-surface-variant">Smart Tourism Platform</p>
            <p className="text-xs text-on-surface-variant mt-1">Versi 1.0.0</p>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Mango adalah platform pariwisata cerdas berbasis AI yang membantu wisatawan merencanakan kunjungan dengan menyajikan data keramaian destinasi secara real-time dan prediktif.
          </p>
          <p className="text-[10px] text-on-surface-variant/60">
            Dikembangkan untuk Microsoft AI Impact Challenge 2025
          </p>
        </div>
      </SettingsModal>

      <SettingsModal title="Edit Profil" isOpen={activeModal === 'edit'} onClose={() => setActiveModal(null)}>
        {isGuest ? (
          <p className="text-sm text-on-surface-variant text-center py-4">Buat akun untuk mengedit profil Anda.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-on-surface mb-1.5 block">Nama Lengkap</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm font-semibold text-on-surface mb-1.5 block">Email</label>
              <input type="email" value={user?.email || ''} disabled
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface-variant outline-none opacity-60" />
            </div>
            <button onClick={handleEditProfile} className="w-full bg-primary text-on-primary rounded-xl py-3 font-bold text-sm">
              Simpan Perubahan
            </button>
          </div>
        )}
      </SettingsModal>

      <SettingsModal title="Bantuan & Dukungan" isOpen={activeModal === 'help'} onClose={() => setActiveModal(null)}>
        <div className="space-y-4">
          <div className="space-y-3">
            {[
              { q: 'Bagaimana data keramaian dikumpulkan?', a: 'Kami menggunakan kombinasi data sensor, analisis citra satelit, dan AI untuk memperkirakan tingkat keramaian.' },
              { q: 'Apakah prediksi akurat?', a: 'Prediksi kami memiliki tingkat akurasi tinggi berdasarkan pola historis, cuaca, dan event lokal.' },
              { q: 'Bagaimana cara membatalkan booking?', a: 'Buka halaman Profil > Booking Mendatang > klik Batalkan.' },
            ].map((faq) => (
              <details key={faq.q} className="group">
                <summary className="flex items-center justify-between cursor-pointer py-2 text-sm font-semibold text-on-surface">
                  {faq.q}
                  <Icon name="expand_more" size="20px" className="text-on-surface-variant group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-xs text-on-surface-variant pb-2 pl-1">{faq.a}</p>
              </details>
            ))}
          </div>
          <a href="mailto:support@mango.id" className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary rounded-xl py-3 font-bold text-sm">
            <Icon name="mail" size="18px" />Hubungi Support
          </a>
        </div>
      </SettingsModal>

      <SettingsModal title="Tampilan" isOpen={activeModal === 'appearance'} onClose={() => setActiveModal(null)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-on-surface">Mode Gelap</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Akan segera hadir</p>
            </div>
            <div className="w-11 h-6 rounded-full bg-on-surface/10 relative opacity-50">
              <span className="absolute top-0.5 translate-x-0.5 w-5 h-5 rounded-full bg-white shadow" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface mb-3">Warna Avatar</p>
            <div className="flex gap-3">
              {avatarColors.map((color, i) => (
                <button key={i} onClick={() => { handleAvatarChange(i); setActiveModal(null) }}
                  className={`w-10 h-10 rounded-full ${color} flex items-center justify-center ${selectedAvatar === i ? 'ring-2 ring-offset-2 ring-primary' : ''}`}>
                  {selectedAvatar === i && <Icon name="check" size="18px" className="text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsModal>
    </div>
  )
}
