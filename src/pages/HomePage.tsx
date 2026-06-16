import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { events } from '../data/scheduleData'
import { eventStartMs, eventEndMs } from '../utils/eventTime'
import { RSVPModal } from '../components/RSVPModal'

function getNowAndNext() {
  const now = Date.now()
  const current = events.find(
    e => now >= eventStartMs(e.isoDate, e.startTime) && now < eventEndMs(e.isoDate, e.endTime)
  )
  const upcoming = events.filter(e => eventStartMs(e.isoDate, e.startTime) > now).slice(0, 3)
  return { current, upcoming }
}

export function HomePage() {
  const navigate = useNavigate()
  const [rsvpOpen, setRsvpOpen] = useState(false)
  const { current, upcoming } = getNowAndNext()

  return (
    <>
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight">TrexCon 2026</h1>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate('/schedule')}
                className="hidden sm:block px-3 py-2 rounded-lg text-gray-400 hover:text-white text-sm font-medium transition-all"
              >
                Itinerary
              </button>
              <button
                onClick={() => navigate('/rsvps')}
                className="hidden sm:block px-3 py-2 rounded-lg text-gray-400 hover:text-white text-sm font-medium transition-all"
              >
                Attendees
              </button>
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

        {/* Mobile-only nav row */}
        <div className="sm:hidden border-b border-white/10 bg-[#0d0d0d]/95">
          <div className="max-w-2xl mx-auto px-4 flex gap-1 py-1">
            <button
              onClick={() => navigate('/schedule')}
              className="px-3 py-2 rounded-lg text-gray-400 hover:text-white text-sm font-medium transition-all"
            >
              Itinerary
            </button>
            <button
              onClick={() => navigate('/rsvps')}
              className="px-3 py-2 rounded-lg text-gray-400 hover:text-white text-sm font-medium transition-all"
            >
              Attendees
            </button>
          </div>
        </div>

        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 space-y-6">

          {/* Announcement banner */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-5 py-3 text-yellow-300 text-sm text-center">
            ⚠️ Please bring close toed shoes for the brewery tour ⚠️
          </div>

          {/* Happening Now */}
          {current ? (
            <section>
              <p className="text-green-500 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Happening Now
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-4">
                <h2 className="text-white text-lg font-bold leading-snug">{current.title}</h2>
                {current.location && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(current.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 text-xs underline underline-offset-2 mt-0.5 inline-block"
                  >
                    {current.location}
                  </a>
                )}
                <p className="text-gray-400 text-sm mt-1">
                  {current.startTime} – {current.endTime}
                </p>
              </div>
            </section>
          ) : (
            <section>
              <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">Happening Now</p>
              <div className="bg-white/5 rounded-xl px-5 py-4 text-gray-600 text-sm">
                Nothing happening right now.
              </div>
            </section>
          )}

          {/* Up Next */}
          {upcoming.length > 0 ? (
            <section>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">Up Next</p>
              <div className="space-y-2">
                {upcoming.map(event => (
                  <div key={event.id} className="bg-white/5 rounded-xl px-5 py-4">
                    <h2 className="text-white text-lg font-bold leading-snug">{event.title}</h2>
                    {event.location && (
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-400 text-xs underline underline-offset-2 mt-0.5 inline-block"
                      >
                        {event.location}
                      </a>
                    )}
                    <p className="text-gray-400 text-sm mt-1">
                      {event.startTime} – {event.endTime}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : events.length > 0 ? (
            <section>
              <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">Up Next</p>
              <div className="bg-white/5 rounded-xl px-5 py-4 text-gray-600 text-sm">
                That's a wrap — see you next year! 🦕
              </div>
            </section>
          ) : null}

          {/* Full schedule button */}
          <button
            onClick={() => navigate('/schedule')}
            className="w-full py-3 rounded-xl border border-white/15 text-gray-300 hover:border-white/30 hover:text-white text-sm font-semibold tracking-wide transition-all"
          >
            View Full Itinerary →
          </button>
        </main>

        {/* Sticky RSVP footer */}
        <div className="sticky bottom-0 border-t border-white/8 bg-[#0d0d0d]/95 backdrop-blur px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">Joining us this year?</p>
            <button
              onClick={() => setRsvpOpen(true)}
              className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-400 active:bg-green-600 text-black font-bold text-sm transition-all"
            >
              RSVP Now
            </button>
          </div>
        </div>
      </div>

      {rsvpOpen && <RSVPModal onClose={() => setRsvpOpen(false)} />}
    </>
  )
}
