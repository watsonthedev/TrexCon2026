import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SplashGate } from './components/SplashGate'
import { HomePage } from './pages/HomePage'
import { ScheduleView } from './components/ScheduleView'
import { RSVPsPage } from './pages/RSVPsPage'

export function App() {
  const [unlocked, setUnlocked] = useState(false)

  if (!unlocked) {
    return <SplashGate onUnlock={() => setUnlocked(true)} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<ScheduleView />} />
        <Route path="/rsvps" element={<RSVPsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
