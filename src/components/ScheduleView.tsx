import { useState } from 'react'
import { events } from '../data/scheduleData'
import { ALL_CATEGORIES, CATEGORY_LABELS, type EventCategory } from '../types/event'
import { FilterChip } from './FilterChip'
import { EventCard } from './EventCard'
import { RSVPModal } from './RSVPModal'

const DAY_ORDER = ['Friday', 'Saturday', 'Sunday']

export function ScheduleView() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null)
  const [rsvpOpen, setRsvpOpen] = useState(false)

  const filteredEvents = selectedCategory
    ? events.filter(e => e.category === selectedCategory)
    : events

  const groupedByDay = DAY_ORDER.reduce<Record<string, typeof events>>((acc, day) => {
    const dayEvents = filteredEvents.filter(e => e.dayLabel === day)
    if (dayEvents.length > 0) acc[day] = dayEvents
    return acc
  }, {})

  return (
    <>
      <div className="min-h-screen bg-[#0d0d0d] text-white animate-fade-in">
        <header className="sticky top-0 z-10 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/10">
          <div className="max-w-2xl mx-auto px-4 pt-6 pb-3 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight">TrexCon 2026</h1>
            <button
              onClick={() => setRsvpOpen(true)}
              className="shrink-0 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 active:bg-green-600 text-black font-bold text-sm tracking-wide transition-all"
            >
              RSVP
            </button>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 px-4 pb-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <FilterChip
                label="All"
                isSelected={selectedCategory === null}
                onClick={() => setSelectedCategory(null)}
              />
              {ALL_CATEGORIES.map(cat => (
                <FilterChip
                  key={cat}
                  label={CATEGORY_LABELS[cat]}
                  isSelected={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                />
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
          {DAY_ORDER.map(day =>
            groupedByDay[day] ? (
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
            ) : null
          )}
          {Object.keys(groupedByDay).length === 0 && (
            <p className="text-gray-600 text-center py-16">No events in this category.</p>
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
