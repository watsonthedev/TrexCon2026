import { useState } from 'react'
import { events } from '../data/scheduleData'
import { EventCard } from './EventCard'
import { RSVPModal } from './RSVPModal'

const DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Derive unique days from actual events, sorted by day-of-week
const days = [...new Set(events.map(e => e.dayLabel))].sort(
  (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
)

export function ScheduleView() {
  const [rsvpOpen, setRsvpOpen] = useState(false)

  const groupedByDay = days.reduce<Record<string, typeof events>>((acc, day) => {
    acc[day] = events.filter(e => e.dayLabel === day)
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
          {days.map(day => (
            <section key={day}>
              <h2 className="text-green-500 font-bold text-xs uppercase tracking-widest mb-3">
                {day}
              </h2>
              <div className="space-y-3">
                {groupedByDay[day].map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          ))}
          {days.length === 0 && (
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
