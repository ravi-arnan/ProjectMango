import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Legal from './pages/Legal'

const Home = lazy(() => import('./pages/Home'))
const Peta = lazy(() => import('./pages/Peta'))
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'))
const Prediksi = lazy(() => import('./pages/Prediksi'))
const Profil = lazy(() => import('./pages/Profil'))
const AiAnalysis = lazy(() => import('./pages/AiAnalysis'))

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/privacy" element={<Legal page="privacy" />} />
            <Route path="/terms" element={<Legal page="terms" />} />
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="peta" element={<Peta />} />
              <Route path="destinasi/:id" element={<DestinationDetail />} />
              <Route path="prediksi" element={<Prediksi />} />
              <Route path="ai-analysis" element={<AiAnalysis />} />
              <Route path="profil" element={<Profil />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
