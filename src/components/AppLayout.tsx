import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import SideNav from './SideNav'
import MobileHeader from './MobileHeader'
import DesktopHeader from './DesktopHeader'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <SideNav />
      <MobileHeader />
      <main className="lg:ml-64">
        <DesktopHeader />
        <div className="max-w-[390px] mx-auto lg:max-w-none pt-14 pb-24 lg:pt-0 lg:pb-0 px-4 lg:px-10 lg:py-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
