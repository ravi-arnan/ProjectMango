import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon'

export default function DesktopHeader() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  return (
    <header className="hidden lg:flex sticky top-0 z-40 bg-[#fff8f5]/80 backdrop-blur-xl items-center justify-between px-10 py-4 border-b border-stone-100/50">
      {/* Search bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <span className="absolute inset-y-0 left-4 flex items-center text-stone-400 group-focus-within:text-primary">
            <Icon name="search" />
          </span>
          <input
            type="text"
            placeholder="Cari destinasi tenang di Bali..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate('/app') }}
            className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-12 pr-4 focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-sm font-medium text-on-surface placeholder:text-on-surface-variant/60"
          />
        </div>
      </div>

      {/* Right side: notifications, settings, avatar */}
      <div className="flex items-center gap-3 ml-8">
        <button onClick={() => alert('Belum ada notifikasi baru.')} className="p-2.5 hover:bg-stone-100 rounded-full transition-colors text-stone-500">
          <Icon name="notifications" />
        </button>
        <button onClick={() => navigate('/app/profil')} className="p-2.5 hover:bg-stone-100 rounded-full transition-colors text-stone-500">
          <Icon name="settings" />
        </button>
        <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
          <span className="text-xs font-bold text-on-primary">LT</span>
        </div>
      </div>
    </header>
  )
}
