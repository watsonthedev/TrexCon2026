import { useState } from 'react'
import { supabase } from '../lib/supabase'

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
  arrivalDate: '2026-06-18',    // Convention starts Thursday June 18
  arrivalTime: '15:00',         // Default 3pm
  hotel: '',
  hotelCheckin: '2026-06-18',
  departureFlight: '',
  departureDate: '2026-06-21',  // Day after convention ends
  departureTime: '10:00',       // Default 10am
  needsRide: null,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTime(t: string) {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

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
  const [driving, setDriving] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConfirming(true)
  }

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('rsvps').insert({
      twitch_username:  form.twitchUsername,
      nickname:         form.nickname         || null,
      arrival_flight:   driving ? null : (form.arrivalFlight    || null),
      arrival_date:     form.arrivalDate      || null,
      arrival_time:     form.arrivalTime      || null,
      hotel:            form.hotel            || null,
      hotel_checkin:    form.hotelCheckin     || null,
      departure_flight: driving ? null : (form.departureFlight  || null),
      departure_date:   form.departureDate    || null,
      departure_time:   form.departureTime    || null,
      needs_ride:       form.needsRide,
      driving:          driving,
    })

    setLoading(false)

    if (error) {
      setError('Something went wrong — please try again.')
      console.error('RSVP insert error:', error)
      setConfirming(false)
      return
    }

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
              {confirming
                ? !loading && <p className="text-red-400 text-sm mt-0.5">Once you hit confirm you will not be able to edit this info.<br />If you need to make changes please contact Trex.</p>
                : <p className="text-gray-500 text-sm mt-0.5">Lock in your spot. We'll see you there.</p>
              }
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all text-lg leading-none"
            >
              ×
            </button>
          </div>

          {confirming && !submitted ? (
            // ── Preview / confirm ─────────────────────────────────────────────
            <div className="overflow-y-auto px-6 py-5 space-y-5">
              <p className="text-gray-400 text-sm">Does everything look right?</p>

              {/* Attendee card preview */}
              <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {/* Name + pills */}
                <div className="sm:col-span-2 flex items-start justify-between gap-2">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-white font-bold">@{form.twitchUsername}</span>
                    {form.nickname && <span className="text-gray-400 text-sm">"{form.nickname}"</span>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs text-green-400 border border-green-400/30 bg-green-400/10 rounded-full px-2 py-0.5">
                      {driving ? 'Driving' : 'Flying'}
                    </span>
                    {driving ? (
                      form.needsRide === true &&
                        <span className="text-xs text-green-400 border border-green-400/30 bg-green-400/10 rounded-full px-2 py-0.5">Can provide carpool</span>
                    ) : (
                      form.needsRide === true &&
                        <span className="text-xs text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 rounded-full px-2 py-0.5">Needs ride</span>
                    )}
                  </div>
                </div>

                {/* Arrival */}
                <div className="text-sm space-y-2">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Arrival</p>
                    <p className="text-gray-300">
                      {formatDate(form.arrivalDate)}
                      {form.arrivalTime ? ` · ${formatTime(form.arrivalTime)}` : ''}
                    </p>
                  </div>
                  {!driving && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Flight Info</p>
                      <p className="text-gray-300">{form.arrivalFlight || '—'}</p>
                    </div>
                  )}
                </div>

                {/* Departure */}
                <div className="text-sm space-y-2">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Departure</p>
                    <p className="text-gray-300">
                      {formatDate(form.departureDate)}
                      {form.departureTime ? ` · ${formatTime(form.departureTime)}` : ''}
                    </p>
                  </div>
                  {!driving && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Flight Info</p>
                      <p className="text-gray-300">{form.departureFlight || '—'}</p>
                    </div>
                  )}
                </div>

                {/* Hotel */}
                {(form.hotel || form.hotelCheckin) && (
                  <div className="text-sm sm:col-span-2">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Hotel</p>
                    <p className="text-gray-300">
                      {form.hotel}
                      {form.hotelCheckin ? ` · Check-in ${formatDate(form.hotelCheckin)}` : ''}
                    </p>
                  </div>
                )}
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="py-3 rounded-lg border border-white/15 text-gray-300 hover:border-white/30 hover:text-white text-sm font-semibold transition-all"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                  className="py-3 rounded-lg bg-green-500 hover:bg-green-400 active:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm tracking-wide transition-all"
                >
                  {loading ? 'Sending…' : 'Confirm'}
                </button>
              </div>
              <div className="h-1" />
            </div>
          ) : submitted ? (
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
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                    Arrival
                  </p>
                  <button
                    type="button"
                    onClick={() => setDriving(d => !d)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all ${
                      driving
                        ? 'bg-green-500/15 border-green-500/40 text-green-400'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    🚗 I'm driving
                  </button>
                </div>

                {!driving && (
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
                )}

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

                {!driving && (
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
                )}

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
                  {driving
                    ? 'Are you willing to provide a carpool?'
                    : 'Do you need help getting from Denver (DEN) to Fort Collins?'}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(driving
                    ? [{ val: true, label: 'Yes I can carpool' }, { val: false, label: "No I'm riding solo" }]
                    : [{ val: true, label: 'Yes please' }, { val: false, label: "I'm good" }]
                  ).map(opt => (
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

              {/* Error */}
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

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
