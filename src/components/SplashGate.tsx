import { useState, useRef } from 'react'

// ── Change the passcode here ──────────────────────────────────────────────────
const PASSCODE = 'trex2026'
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  onUnlock: () => void
}

export function SplashGate({ onUnlock }: Props) {
  const [slitOpen, setSlitOpen] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [wrongCode, setWrongCode] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const openSlit = () => {
    if (slitOpen || unlocking) return
    setSlitOpen(true)
    setTimeout(() => inputRef.current?.focus(), 400)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode.toLowerCase().trim() === PASSCODE) {
      setUnlocking(true)
      setTimeout(onUnlock, 900)
    } else {
      setWrongCode(true)
      setTimeout(() => {
        setWrongCode(false)
        setPasscode('')
        inputRef.current?.focus()
      }, 700)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: 'radial-gradient(ellipse at 50% 60%, #100c06 0%, #060503 70%, #020201 100%)' }}
    >
      {/* Floor glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-40 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(ellipse, rgba(180,100,20,0.07) 0%, transparent 70%)' }}
      />
      {/* Ceiling light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 blur-3xl opacity-30"
        style={{ background: 'radial-gradient(ellipse, rgba(180,100,20,0.08) 0%, transparent 70%)' }}
      />

      {/* Door */}
      <div
        className="relative w-72 sm:w-80 select-none"
        style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.9)) drop-shadow(0 0 30px rgba(180,100,10,0.08))' }}
      >
        {/* ── TOP HALF ── */}
        <div
          className="relative flex flex-col items-center pt-10 pb-8 px-5 transition-transform duration-700 ease-in-out"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.08) 40px), linear-gradient(180deg, #1d1409 0%, #221608 50%, #1a1107 100%)',
            border: '3px solid #3b2610',
            borderBottom: 'none',
            borderRadius: '3px 3px 0 0',
            transform: unlocking ? 'translateY(-110%)' : 'translateY(0)',
          }}
        >
          {/* Panel inset decoration */}
          <div className="absolute inset-5 rounded-sm pointer-events-none"
            style={{ border: '1px solid rgba(90,55,20,0.35)' }} />
          <div className="absolute inset-8 rounded-sm pointer-events-none"
            style={{ border: '1px solid rgba(90,55,20,0.18)' }} />

          {/* Emblem */}
          <div className="mb-5 relative">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(circle, #2a1a08 0%, #1a1007 100%)', border: '1.5px solid #5a3a18', boxShadow: '0 0 12px rgba(180,100,10,0.15), inset 0 1px 0 rgba(180,100,10,0.1)' }}
            >
              {/* Dino silhouette (simple T-rex shape using text/emoji) */}
              <span className="text-2xl" style={{ filter: 'sepia(1) hue-rotate(10deg) brightness(0.6)' }}>🦖</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center leading-none"
            style={{ color: '#c9a060', fontWeight: 800, fontSize: '1.35rem', letterSpacing: '0.22em', textTransform: 'uppercase', textShadow: '0 0 20px rgba(200,150,50,0.25)' }}
          >
            TrexCon
          </h1>
          <p className="mt-1.5 font-mono font-semibold"
            style={{ color: '#7a5528', fontSize: '0.8rem', letterSpacing: '0.45em' }}
          >
            2 0 2 6
          </p>

          {/* "Knock to enter" hint */}
          <p
            className="mt-8 text-xs uppercase tracking-widest transition-opacity duration-300"
            style={{
              color: '#5a3a18',
              letterSpacing: '0.28em',
              opacity: slitOpen ? 0 : 1,
              animation: slitOpen ? 'none' : undefined,
            }}
          >
            {!slitOpen && <span className="animate-pulse">knock to enter</span>}
          </p>
        </div>

        {/* ── SLIT ── */}
        <div
          className="relative overflow-hidden cursor-pointer"
          style={{
            height: slitOpen ? '176px' : '14px',
            transition: 'height 0.45s cubic-bezier(0.4,0,0.2,1)',
            borderLeft: '3px solid #3b2610',
            borderRight: '3px solid #3b2610',
            background: 'linear-gradient(90deg, #0e0903 0%, #1a1006 40%, #201408 50%, #1a1006 60%, #0e0903 100%)',
          }}
          onClick={openSlit}
        >
          {/* Top metal lip */}
          <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
            style={{ height: '7px', background: 'linear-gradient(180deg, #6a4020 0%, #3d2210 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          />
          {/* Bottom metal lip */}
          <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
            style={{ height: '7px', background: 'linear-gradient(0deg, #6a4020 0%, #3d2210 100%)', boxShadow: '0 -2px 4px rgba(0,0,0,0.5)' }}
          />

          {/* Ambient glow lines at the crack */}
          <div className="absolute inset-x-8 top-[3px] h-[1px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(220,160,50,0.5) 30%, rgba(255,200,80,0.7) 50%, rgba(220,160,50,0.5) 70%, transparent)', boxShadow: '0 0 6px rgba(220,160,50,0.4)' }}
          />
          <div className="absolute inset-x-8 bottom-[3px] h-[1px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(220,160,50,0.5) 30%, rgba(255,200,80,0.7) 50%, rgba(220,160,50,0.5) 70%, transparent)', boxShadow: '0 0 6px rgba(220,160,50,0.4)' }}
          />

          {/* Form content — fades in once slit is open */}
          <div
            className="absolute inset-x-0 flex flex-col items-center justify-center px-6 gap-3"
            style={{
              top: '7px',
              bottom: '7px',
              opacity: slitOpen ? 1 : 0,
              transition: 'opacity 0.25s ease 0.25s',
              pointerEvents: slitOpen ? 'auto' : 'none',
            }}
          >
            <p className="text-xs uppercase tracking-widest"
              style={{ color: '#8a6030', letterSpacing: '0.3em' }}
            >
              Password
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2.5">
              <input
                ref={inputRef}
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="••••••••"
                autoComplete="off"
                className={`w-full text-center text-sm py-2.5 px-4 rounded outline-none tracking-widest placeholder-amber-950 transition-all ${wrongCode ? 'animate-shake' : ''}`}
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: wrongCode ? '1px solid rgba(220,50,50,0.6)' : '1px solid rgba(90,55,20,0.5)',
                  color: '#d4a855',
                  caretColor: '#d4a855',
                }}
              />
              <button
                type="submit"
                className="w-full text-xs uppercase tracking-widest py-2.5 rounded transition-all"
                style={{
                  background: 'rgba(60,35,10,0.5)',
                  border: '1px solid rgba(90,55,20,0.5)',
                  color: '#c9a060',
                  letterSpacing: '0.3em',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(90,55,15,0.7)' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(60,35,10,0.5)' }}
              >
                Enter
              </button>
            </form>

            {wrongCode && (
              <p className="text-xs" style={{ color: 'rgba(220,80,80,0.85)', letterSpacing: '0.1em' }}>
                Wrong code. Try again.
              </p>
            )}
          </div>
        </div>

        {/* ── BOTTOM HALF ── */}
        <div
          className="relative transition-transform duration-700 ease-in-out"
          style={{
            height: '140px',
            background: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.08) 40px), linear-gradient(0deg, #1d1409 0%, #221608 50%, #1a1107 100%)',
            border: '3px solid #3b2610',
            borderTop: 'none',
            borderRadius: '0 0 3px 3px',
            transform: unlocking ? 'translateY(110%)' : 'translateY(0)',
          }}
        >
          {/* Panel inset decoration */}
          <div className="absolute inset-4 bottom-6 rounded-sm pointer-events-none"
            style={{ border: '1px solid rgba(90,55,20,0.35)' }} />

          {/* Keyhole */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
            <div className="rounded-full"
              style={{ width: '12px', height: '12px', border: '1.5px solid rgba(100,65,25,0.7)', background: 'rgba(0,0,0,0.5)' }}
            />
            <div className="rounded-b-sm"
              style={{ width: '7px', height: '8px', border: '1.5px solid rgba(100,65,25,0.7)', borderTop: 'none', background: 'rgba(0,0,0,0.5)' }}
            />
          </div>
        </div>
      </div>

      {/* Tiny hint at very bottom */}
      <p className="absolute bottom-6 text-xs tracking-widest"
        style={{ color: 'rgba(60,40,15,0.6)', letterSpacing: '0.25em' }}
      >
        MEMBERS ONLY
      </p>
    </div>
  )
}
