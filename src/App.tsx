import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SplashGate } from './components/SplashGate'
import { HomePage } from './pages/HomePage'
import { ScheduleView } from './components/ScheduleView'
import { RSVPsPage } from './pages/RSVPsPage'

export function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('unlocked') === 'true')

  if (!unlocked) {
    return <SplashGate onUnlock={() => { sessionStorage.setItem('unlocked', 'true'); setUnlocked(true) }} />
  }

  return (
    <BrowserRouter>
      {import.meta.env.VITE_APP_ENV === 'development' && (
        <div className="w-full bg-yellow-400 text-black text-center text-sm font-bold py-1">
          DEV ENVIRONMENT
        </div>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<ScheduleView />} />
        <Route path="/rsvps" element={<RSVPsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
