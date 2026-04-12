import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Peta from './pages/Peta'
import DestinationDetail from './pages/DestinationDetail'
import Prediksi from './pages/Prediksi'
import Profil from './pages/Profil'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="peta" element={<Peta />} />
          <Route path="destinasi/:id" element={<DestinationDetail />} />
          <Route path="prediksi" element={<Prediksi />} />
          <Route path="profil" element={<Profil />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
