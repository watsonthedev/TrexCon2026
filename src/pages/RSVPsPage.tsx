import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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

  useEffect(() => {
    supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError('Failed to load RSVPs.')
          console.error(error)
        } else {
          setRsvps(data ?? [])
        }
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold tracking-tight">RSVPs</h1>
          {!loading && (
            <span className="ml-auto text-gray-500 text-sm">{rsvps.length} attending</span>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-gray-500 text-sm text-center py-20">Loading…</div>
        )}

        {error && (
          <div className="text-red-400 text-sm text-center py-20">{error}</div>
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
                {/* Name */}
                <div className="sm:col-span-2 flex items-baseline gap-2 mb-1">
                  <span className="text-white font-bold">@{r.twitch_username}</span>
                  {r.nickname && (
                    <span className="text-gray-400 text-sm">"{r.nickname}"</span>
                  )}
                  {r.needs_ride === true && (
                    <span className="ml-auto text-xs text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 rounded-full px-2 py-0.5">
                      Needs ride
                    </span>
                  )}
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
  )
}
