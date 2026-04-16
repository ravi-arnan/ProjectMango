import { NavLink, Link } from 'react-router-dom'
import Icon from './Icon'

const navLinks = [
  { to: '/app', icon: 'home', label: 'Home' },
  { to: '/app/peta', icon: 'map', label: 'Peta' },
  { to: '/app/prediksi', icon: 'online_prediction', label: 'Prediksi' },
  { to: '/app/profil', icon: 'person', label: 'Profil' },
]

export default function SideNav() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 w-64 h-screen bg-white border-r border-stone-100 p-6 flex-col">
      {/* Brand header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
          <Icon name="sensors" className="text-white" size="20px" />
        </div>
        <div>
          <h1 className="text-xl font-black text-cyan-800">Mango</h1>
          <p className="text-[10px] uppercase tracking-widest text-stone-400">
            Smart Tourism Platform
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/app'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? 'text-cyan-800 bg-cyan-50 rounded-lg font-bold'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-lg'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={link.icon} filled={isActive} />
                <span>{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom button */}
      <Link
        to="/app/ai-analysis"
        className="w-full py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold flex items-center justify-center gap-2"
      >
        <Icon name="auto_awesome" size="18px" />
        AI Analysis
      </Link>
    </aside>
  )
}
