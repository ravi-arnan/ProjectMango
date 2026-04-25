import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './hooks/useNotifications'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AppLayout from './components/AppLayout'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Legal from './pages/Legal'

const Home = lazy(() => import('./pages/Home'))
const Peta = lazy(() => import('./pages/Peta'))
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'))
const Destinasi = lazy(() => import('./pages/Destinasi'))
const Prediksi = lazy(() => import('./pages/Prediksi'))
const Profil = lazy(() => import('./pages/Profil'))
const AiAnalysis = lazy(() => import('./pages/AiAnalysis'))
const Admin = lazy(() => import('./pages/Admin'))
const AiAgent = lazy(() => import('./pages/AiAgent'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/privacy" element={<Legal page="privacy" />} />
            <Route path="/terms" element={<Legal page="terms" />} />
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="peta" element={<Peta />} />
              <Route path="destinasi" element={<Destinasi />} />
              <Route path="destinasi/:id" element={<DestinationDetail />} />
              <Route path="prediksi" element={<Prediksi />} />
              <Route path="ai-analysis" element={<AiAnalysis />} />
              <Route path="profil" element={<Profil />} />
              <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="ai-agent" element={<AdminRoute><AiAgent /></AdminRoute>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
