import { useState } from 'react'
import { events } from '../data/scheduleData'
import { EventCard } from './EventCard'
import { RSVPModal } from './RSVPModal'

// Unique dates in chronological order
const sortedDates = [...new Set(events.map(e => e.isoDate))].sort()

/** Format '2026-05-26' → 'Tuesday, May 26' */
function formatDateHeader(isoDate: string) {
  // Parse as UTC noon to avoid timezone-shift date changes
  const d = new Date(`${isoDate}T12:00:00Z`)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function ScheduleView() {
  const [rsvpOpen, setRsvpOpen] = useState(false)

  const groupedByDate = sortedDates.reduce<Record<string, typeof events>>((acc, date) => {
    acc[date] = events.filter(e => e.isoDate === date)
    return acc
  }, {})

  return (
    <>
      <div className="min-h-screen bg-[#0d0d0d] text-white animate-fade-in">
        <header className="sticky top-0 z-10 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight">TrexCon 2026</h1>
            <button
              onClick={() => setRsvpOpen(true)}
              className="shrink-0 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 active:bg-green-600 text-black font-bold text-sm tracking-wide transition-all"
            >
              RSVP
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
          {sortedDates.map(date => (
            <section key={date}>
              <h2 className="text-green-500 font-bold text-xs uppercase tracking-widest mb-3">
                {formatDateHeader(date)}
              </h2>
              <div className="space-y-3">
                {groupedByDate[date].map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          ))}
          {sortedDates.length === 0 && (
            <p className="text-gray-600 text-center py-16">No events scheduled yet.</p>
          )}
        </main>

        {/* Sticky RSVP footer (mobile-friendly) */}
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
