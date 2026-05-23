import { useState } from 'react'

interface Props {
  onClose: () => void
}

interface FormData {
  twitchUsername: string
  nickname: string
  // Arrival
  arrivalFlight: string
  arrivalDate: string
  arrivalTime: string
  // Hotel
  hotel: string
  hotelCheckin: string
  // Departure
  departureFlight: string
  departureDate: string
  departureTime: string
  // Logistics
  needsRide: boolean | null
}

const EMPTY: FormData = {
  twitchUsername: '',
  nickname: '',
  arrivalFlight: '',
  arrivalDate: '',
  arrivalTime: '',
  hotel: '',
  hotelCheckin: '',
  departureFlight: '',
  departureDate: '',
  departureTime: '',
  needsRide: null,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function airlineFromFlight(flight: string): string | null {
  const code = flight.trim().toUpperCase().replace(/\d.*/, '')
  const airlines: Record<string, string> = {
    AA: 'American Airlines', AS: 'Alaska Airlines', B6: 'JetBlue',
    DL: 'Delta', F9: 'Frontier', G4: 'Allegiant', NK: 'Spirit',
    UA: 'United', WN: 'Southwest', SY: 'Sun Country',
  }
  return airlines[code] ?? null
}

// ── Input helpers ─────────────────────────────────────────────────────────────

function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </label>
        {hint && <span className="text-gray-600 text-xs">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder-gray-600 transition-all focus:bg-white/8 focus:border-white/20'

// ── Main component ────────────────────────────────────────────────────────────

export function RSVPModal({ onClose }: Props) {
  const [form, setForm] = useState<FormData>(EMPTY)
  const [submitted, setSubmitted] = useState(false)

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire up to a backend / form service
    console.log('RSVP submitted:', form)
    setSubmitted(true)
  }

  const displayName = form.nickname.trim() || form.twitchUsername.trim() || 'friend'

  const arrivalAirline = airlineFromFlight(form.arrivalFlight)
  const departureAirline = airlineFromFlight(form.departureFlight)

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md rounded-xl bg-[#111] border border-white/10 shadow-2xl flex flex-col max-h-[90vh]"
          onClick={e => e.stopPropagation()}
          style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)' }}
        >
          {/* Header — fixed */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/8 shrink-0">
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
            // ── Confirmation ──────────────────────────────────────────────────
            <div className="px-6 py-10 flex flex-col items-center text-center gap-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center text-2xl">
                🦖
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  You're on the list, {displayName}!
                </h3>
                <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
                  We've got your info and we'll be in touch. See you in Fort Collins! 🎉
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
            // ── Form — scrollable ─────────────────────────────────────────────
            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto px-6 py-5 space-y-6"
            >

              {/* ── Personal ──────────────────────────────────────────────── */}
              <div className="space-y-4">
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                  About You
                </p>

                <Field label="Twitch Username">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none">@</span>
                    <input
                      type="text"
                      value={form.twitchUsername}
                      onChange={e => set('twitchUsername', e.target.value)}
                      placeholder="your_username"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </Field>

                <Field label="Nickname" hint="(optional)">
                  <input
                    type="text"
                    value={form.nickname}
                    onChange={e => set('nickname', e.target.value)}
                    placeholder="What should we call you?"
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* ── Arrival ───────────────────────────────────────────────── */}
              <div className="space-y-4">
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                  Arrival
                </p>

                <Field label="Flight Number" hint="(optional)">
                  <input
                    type="text"
                    value={form.arrivalFlight}
                    onChange={e => set('arrivalFlight', e.target.value.toUpperCase())}
                    placeholder="e.g. UA1234"
                    className={inputClass}
                  />
                  {arrivalAirline && (
                    <p className="text-green-400 text-xs mt-1">✓ {arrivalAirline}</p>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Arrival Date">
                    <input
                      type="date"
                      value={form.arrivalDate}
                      onChange={e => set('arrivalDate', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Arrival Time">
                    <input
                      type="time"
                      value={form.arrivalTime}
                      onChange={e => set('arrivalTime', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              {/* ── Hotel ─────────────────────────────────────────────────── */}
              <div className="space-y-4">
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                  Hotel
                </p>

                <Field label="Hotel Name" hint="(optional)">
                  <input
                    type="text"
                    value={form.hotel}
                    onChange={e => set('hotel', e.target.value)}
                    placeholder="e.g. Marriott Fort Collins"
                    className={inputClass}
                  />
                </Field>

                <Field label="Check-in Date">
                  <input
                    type="date"
                    value={form.hotelCheckin}
                    onChange={e => set('hotelCheckin', e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* ── Departure ─────────────────────────────────────────────── */}
              <div className="space-y-4">
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                  Departure
                </p>

                <Field label="Flight Number" hint="(optional)">
                  <input
                    type="text"
                    value={form.departureFlight}
                    onChange={e => set('departureFlight', e.target.value.toUpperCase())}
                    placeholder="e.g. DL5678"
                    className={inputClass}
                  />
                  {departureAirline && (
                    <p className="text-green-400 text-xs mt-1">✓ {departureAirline}</p>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Departure Date">
                    <input
                      type="date"
                      value={form.departureDate}
                      onChange={e => set('departureDate', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Departure Time">
                    <input
                      type="time"
                      value={form.departureTime}
                      onChange={e => set('departureTime', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              {/* ── Logistics ─────────────────────────────────────────────── */}
              <div className="space-y-3">
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                  Getting There
                </p>
                <p className="text-gray-400 text-sm">
                  Do you need help getting from Denver (DEN) to Fort Collins?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: true, label: 'Yes please' },
                    { val: false, label: "I'm good" },
                  ].map(opt => (
                    <button
                      key={String(opt.val)}
                      type="button"
                      onClick={() => set('needsRide', opt.val)}
                      className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all border ${
                        form.needsRide === opt.val
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
                className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-400 active:bg-green-600 text-black font-bold text-sm tracking-wide transition-all"
              >
                I'll be there! 🦖
              </button>

              {/* Spacer so last field isn't flush to the scroll edge */}
              <div className="h-1" />
            </form>
          )}
        </div>
      </div>
    </>
  )
}
