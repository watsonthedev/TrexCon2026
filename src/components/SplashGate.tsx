import { useState, useRef } from 'react'

// ── Change the passcode here ──────────────────────────────────────────────────
const PASSCODE = 'trex2026'
// ─────────────────────────────────────────────────────────────────────────────

const AVATAR_URL =
  'https://yt3.googleusercontent.com/ytc/AIdro_kzfwO4143ppc_qc-__YmZQ9z6grkNH0iXTB1i5pHBD7zA=s160-c-k-c0x00ffffff-no-rj'

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

  // Shared door-half click handler — only activates before slit is open
  const doorClick = () => { if (!slitOpen) openSlit() }

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: 'radial-gradient(ellipse at 50% 55%, #2a1a08 0%, #150e04 50%, #0a0602 100%)' }}
    >
      {/* Floor glow — brighter */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(ellipse, rgba(220,130,30,0.18) 0%, transparent 70%)' }}
      />
      {/* Overhead light */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-32 blur-3xl"
        style={{ background: 'radial-gradient(ellipse, rgba(220,140,30,0.14) 0%, transparent 70%)' }}
      />

      {/* Door */}
      <div
        className="relative w-72 sm:w-80 select-none"
        style={{
          filter:
            'drop-shadow(0 40px 80px rgba(0,0,0,0.85)) drop-shadow(0 0 40px rgba(200,120,20,0.15))',
        }}
      >
        {/* ── TOP HALF ── */}
        <div
          className={`relative flex flex-col items-center pt-10 pb-8 px-5 transition-transform duration-700 ease-in-out ${!slitOpen ? 'cursor-pointer' : ''}`}
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.06) 40px), linear-gradient(180deg, #3a2410 0%, #2e1c0c 50%, #271808 100%)',
            border: '3px solid #6b4020',
            borderBottom: 'none',
            borderRadius: '3px 3px 0 0',
            transform: unlocking ? 'translateY(-110%)' : 'translateY(0)',
            boxShadow: 'inset 0 1px 0 rgba(255,180,60,0.08)',
          }}
          onClick={doorClick}
        >
          {/* Panel inset decoration */}
          <div
            className="absolute inset-5 rounded-sm pointer-events-none"
            style={{ border: '1px solid rgba(160,95,35,0.45)' }}
          />
          <div
            className="absolute inset-8 rounded-sm pointer-events-none"
            style={{ border: '1px solid rgba(160,95,35,0.22)' }}
          />

          {/* Avatar emblem */}
          <div className="mb-5 relative">
            <img
              src={AVATAR_URL}
              alt="Trexcapades"
              className="w-20 h-20 rounded-full object-cover"
              style={{
                border: '2.5px solid #c08040',
                boxShadow:
                  '0 0 0 1px rgba(200,130,40,0.3), 0 0 20px rgba(200,120,20,0.35), 0 4px 12px rgba(0,0,0,0.5)',
              }}
            />
          </div>

          {/* Title */}
          <h1
            className="text-center leading-none"
            style={{
              color: '#f0d080',
              fontWeight: 800,
              fontSize: '1.4rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textShadow: '0 0 24px rgba(240,180,60,0.4), 0 1px 0 rgba(0,0,0,0.6)',
            }}
          >
            TrexCon
          </h1>
          <p
            className="mt-1.5 font-mono font-semibold"
            style={{ color: '#c08840', fontSize: '0.82rem', letterSpacing: '0.45em' }}
          >
            2 0 2 6
          </p>

          {/* Knock hint */}
          <p
            className="mt-8 text-xs uppercase tracking-widest transition-opacity duration-300"
            style={{ color: '#a07040', letterSpacing: '0.28em', opacity: slitOpen ? 0 : 1 }}
          >
            {!slitOpen && <span className="animate-pulse">knock to enter</span>}
          </p>
        </div>

        {/* ── SLIT ── */}
        <div
          className={`relative overflow-hidden ${!slitOpen ? 'cursor-pointer' : ''}`}
          style={{
            height: slitOpen ? '176px' : '16px',
            transition: 'height 0.45s cubic-bezier(0.4,0,0.2,1)',
            borderLeft: '3px solid #6b4020',
            borderRight: '3px solid #6b4020',
            background:
              'linear-gradient(90deg, #1a0e04 0%, #2e1c0a 40%, #381f0b 50%, #2e1c0a 60%, #1a0e04 100%)',
          }}
          onClick={openSlit}
        >
          {/* Top metal lip */}
          <div
            className="absolute inset-x-0 top-0 z-10 pointer-events-none"
            style={{
              height: '8px',
              background: 'linear-gradient(180deg, #a06030 0%, #6b3e18 100%)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
            }}
          />
          {/* Bottom metal lip */}
          <div
            className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
            style={{
              height: '8px',
              background: 'linear-gradient(0deg, #a06030 0%, #6b3e18 100%)',
              boxShadow: '0 -2px 6px rgba(0,0,0,0.6)',
            }}
          />

          {/* Glow line — top crack */}
          <div
            className="absolute inset-x-6 top-[3px] h-[2px] pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,190,60,0.7) 25%, rgba(255,220,100,1) 50%, rgba(255,190,60,0.7) 75%, transparent)',
              boxShadow: '0 0 8px rgba(255,190,60,0.6)',
            }}
          />
          {/* Glow line — bottom crack */}
          <div
            className="absolute inset-x-6 bottom-[3px] h-[2px] pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,190,60,0.7) 25%, rgba(255,220,100,1) 50%, rgba(255,190,60,0.7) 75%, transparent)',
              boxShadow: '0 0 8px rgba(255,190,60,0.6)',
            }}
          />

          {/* Form — fades in once slit is open */}
          <div
            className="absolute inset-x-0 flex flex-col items-center justify-center px-6 gap-3"
            style={{
              top: '8px',
              bottom: '8px',
              opacity: slitOpen ? 1 : 0,
              transition: 'opacity 0.25s ease 0.25s',
              pointerEvents: slitOpen ? 'auto' : 'none',
            }}
          >
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: '#c09050', letterSpacing: '0.3em' }}
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
                className={`w-full text-center text-sm py-2.5 px-4 rounded outline-none tracking-widest transition-all ${wrongCode ? 'animate-shake' : ''}`}
                style={{
                  background: 'rgba(0,0,0,0.55)',
                  border: wrongCode
                    ? '1px solid rgba(220,60,60,0.7)'
                    : '1px solid rgba(160,95,35,0.55)',
                  color: '#f0c860',
                  caretColor: '#f0c860',
                }}
              />
              <button
                type="submit"
                className="w-full text-xs uppercase tracking-widest py-2.5 rounded transition-all"
                style={{
                  background: 'rgba(100,60,15,0.55)',
                  border: '1px solid rgba(160,95,35,0.55)',
                  color: '#f0d080',
                  letterSpacing: '0.3em',
                }}
                onMouseEnter={e => {
                  ;(e.target as HTMLElement).style.background = 'rgba(140,85,20,0.75)'
                }}
                onMouseLeave={e => {
                  ;(e.target as HTMLElement).style.background = 'rgba(100,60,15,0.55)'
                }}
              >
                Enter
              </button>
            </form>

            {wrongCode && (
              <p className="text-xs" style={{ color: 'rgba(230,90,90,0.9)', letterSpacing: '0.1em' }}>
                Wrong code. Try again.
              </p>
            )}
          </div>
        </div>

        {/* ── BOTTOM HALF ── */}
        <div
          className={`relative transition-transform duration-700 ease-in-out ${!slitOpen ? 'cursor-pointer' : ''}`}
          style={{
            height: '140px',
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.06) 40px), linear-gradient(0deg, #3a2410 0%, #2e1c0c 50%, #271808 100%)',
            border: '3px solid #6b4020',
            borderTop: 'none',
            borderRadius: '0 0 3px 3px',
            transform: unlocking ? 'translateY(110%)' : 'translateY(0)',
            boxShadow: 'inset 0 -1px 0 rgba(255,180,60,0.06)',
          }}
          onClick={doorClick}
        >
          {/* Panel inset decoration */}
          <div
            className="absolute inset-4 bottom-6 rounded-sm pointer-events-none"
            style={{ border: '1px solid rgba(160,95,35,0.45)' }}
          />

          {/* Keyhole */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
            <div
              className="rounded-full"
              style={{
                width: '13px',
                height: '13px',
                border: '2px solid rgba(180,110,40,0.8)',
                background: 'rgba(0,0,0,0.6)',
              }}
            />
            <div
              className="rounded-b-sm"
              style={{
                width: '8px',
                height: '9px',
                border: '2px solid rgba(180,110,40,0.8)',
                borderTop: 'none',
                background: 'rgba(0,0,0,0.6)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Hint */}
      <p
        className="absolute bottom-6 text-xs tracking-widest"
        style={{ color: 'rgba(140,90,30,0.7)', letterSpacing: '0.25em' }}
      >
        MEMBERS ONLY
      </p>
    </div>
  )
}
