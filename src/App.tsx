import { useState } from 'react'
import { SplashGate } from './components/SplashGate'
import { ScheduleView } from './components/ScheduleView'

export function App() {
  const [unlocked, setUnlocked] = useState(false)

  return unlocked
    ? <ScheduleView />
    : <SplashGate onUnlock={() => setUnlocked(true)} />
}
