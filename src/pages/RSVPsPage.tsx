import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { RSVPModal } from '../components/RSVPModal'

interface RSVP {
  id: string
  created_at: string
  twitch_username: string
  nickname: string | null
  arrival_flight: string | null
  arrival_date: string | null
  arrival_time: string | null
  hotel: string | null
  hotel_checkin: string | null
  departure_flight: string | null
  departure_date: string | null
  departure_time: string | null
  needs_ride: boolean | null
  driving: boolean | null
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })
}

function formatTime(t: string | null) {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

export function RSVPsPage() {
  const navigate = useNavigate()
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const [rsvpOpen, setRsvpOpen] = useState(false)

  useEffect(() => {
    supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError('Failed to load RSVPs.')
          setErrorDetail(error.message)
          console.error(error)
        } else {
          setRsvps(data ?? [])
        }
        setLoading(false)
      })
  }, [])

  return (
    <>
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold tracking-tight">Attendees</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setRsvpOpen(true)}
              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 active:bg-green-600 text-black font-bold text-sm tracking-wide transition-all"
            >
              RSVP
            </button>
            <a
              href="https://discord.com/channels/199772014653734912/1502359278265307187"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-sm tracking-wide transition-all text-white hover:opacity-80"
              style={{ backgroundColor: '#5865F2' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Discord
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-gray-500 text-sm text-center py-20">Loading…</div>
        )}

        {error && (
          <div className="text-red-400 text-sm text-center py-20">
            <p>{error}</p>
            {errorDetail && (
              <p className="mt-1 text-red-500/70 text-xs">Error: {errorDetail}</p>
            )}
          </div>
        )}

        {!loading && !error && rsvps.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-gray-500 text-sm">Nobody has RSVP'd yet — be the first!</p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-400 active:bg-green-600 text-black font-bold text-sm transition-all"
            >
              RSVP Now
            </button>
          </div>
        )}

        {!loading && !error && rsvps.length > 0 && (
          <div className="space-y-3">
            {rsvps.map(r => (
              <div
                key={r.id}
                className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2"
              >
                {/* Name + pills */}
                <div className="sm:col-span-2 flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-white font-bold">@{r.twitch_username}</span>
                    {r.nickname && (
                      <span className="text-gray-400 text-sm">"{r.nickname}"</span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {/* Transport pill */}
                    <span className="text-xs text-green-400 border border-green-400/30 bg-green-400/10 rounded-full px-2 py-0.5">
                      {r.driving ? 'Driving' : 'Flying'}
                    </span>
                    {/* Carpool/ride sub-pill */}
                    {r.driving ? (
                      r.needs_ride === true
                        ? <span className="text-xs text-green-400 border border-green-400/30 bg-green-400/10 rounded-full px-2 py-0.5">Can provide carpool</span>
                        : <span className="text-xs text-red-400 border border-red-400/30 bg-red-400/10 rounded-full px-2 py-0.5">No carpool</span>
                    ) : (
                      r.needs_ride === true &&
                        <span className="text-xs text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 rounded-full px-2 py-0.5">Needs ride</span>
                    )}
                  </div>
                </div>

                {/* Arrival */}
                <div className="text-sm">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Arrival</p>
                  <p className="text-gray-300">
                    {formatDate(r.arrival_date)}
                    {r.arrival_time ? ` · ${formatTime(r.arrival_time)}` : ''}
                    {r.arrival_flight ? ` · ${r.arrival_flight}` : ''}
                  </p>
                </div>

                {/* Departure */}
                <div className="text-sm">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Departure</p>
                  <p className="text-gray-300">
                    {formatDate(r.departure_date)}
                    {r.departure_time ? ` · ${formatTime(r.departure_time)}` : ''}
                    {r.departure_flight ? ` · ${r.departure_flight}` : ''}
                  </p>
                </div>

                {/* Hotel */}
                {(r.hotel || r.hotel_checkin) && (
                  <div className="text-sm sm:col-span-2">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Hotel</p>
                    <p className="text-gray-300">
                      {r.hotel ?? ''}
                      {r.hotel_checkin ? ` · Check-in ${formatDate(r.hotel_checkin)}` : ''}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
    {rsvpOpen && <RSVPModal onClose={() => setRsvpOpen(false)} />}
    </>
  )
}
