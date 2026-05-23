import { useState } from 'react'

interface Props {
  onClose: () => void
}

type Days = 'friday' | 'saturday' | 'sunday' | 'all'

export function RSVPModal({ onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [days, setDays] = useState<Days>('all')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const validate = () => {
    const e: typeof errors = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitted(true)
  }

  const DAY_OPTIONS: { value: Days; label: string }[] = [
    { value: 'all', label: 'All Weekend' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md rounded-xl bg-[#111] border border-white/10 shadow-2xl animate-slide-up"
          onClick={e => e.stopPropagation()}
          style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)' }}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/8">
            <div>
              <h2 className="text-white font-bold text-lg tracking-tight">RSVP for TrexCon 2026</h2>
              <p className="text-gray-500 text-sm mt-0.5">Lock in your spot. We'll see you there.</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all text-lg leading-none"
            >
              ×
            </button>
          </div>

          {submitted ? (
            // ── Confirmation ─────────────────────────────────────────────────
            <div className="px-6 py-10 flex flex-col items-center text-center gap-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center text-2xl">
                🦖
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">You're on the list, {name.split(' ')[0]}!</h3>
                <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
                  We've got you down for{' '}
                  <span className="text-green-400 font-medium">
                    {days === 'all' ? 'the full weekend' : DAY_OPTIONS.find(d => d.value === days)?.label}
                  </span>
                  . Keep an eye on <span className="text-green-400">{email}</span> for updates.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/20 transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            // ── Form ─────────────────────────────────────────────────────────
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: undefined })) }}
                  placeholder="Your name"
                  className={`w-full bg-white/5 rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder-gray-600 transition-all focus:bg-white/8 ${errors.name ? 'border border-red-500/60 ring-1 ring-red-500/30' : 'border border-white/10 focus:border-white/20'}`}
                />
                {errors.name && <p className="text-red-400/80 text-xs">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: undefined })) }}
                  placeholder="you@example.com"
                  className={`w-full bg-white/5 rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder-gray-600 transition-all focus:bg-white/8 ${errors.email ? 'border border-red-500/60 ring-1 ring-red-500/30' : 'border border-white/10 focus:border-white/20'}`}
                />
                {errors.email && <p className="text-red-400/80 text-xs">{errors.email}</p>}
              </div>

              {/* Days attending */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Days attending
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DAY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDays(opt.value)}
                      className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all border ${
                        days === opt.value
                          ? 'bg-green-500/15 border-green-500/40 text-green-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/8 hover:text-gray-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-lg bg-green-500 hover:bg-green-400 active:bg-green-600 text-black font-bold text-sm tracking-wide transition-all"
              >
                I'll be there! 🦖
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
