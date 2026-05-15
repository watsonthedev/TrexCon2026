import { useState } from 'react'
import { events } from '../data/scheduleData'
import { ALL_CATEGORIES, CATEGORY_LABELS, type EventCategory } from '../types/event'
import { FilterChip } from './FilterChip'
import { EventCard } from './EventCard'

const DAY_ORDER = ['Friday', 'Saturday', 'Sunday']

export function ScheduleView() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null)

  const filteredEvents = selectedCategory
    ? events.filter(e => e.category === selectedCategory)
    : events

  const groupedByDay = DAY_ORDER.reduce<Record<string, typeof events>>((acc, day) => {
    const dayEvents = filteredEvents.filter(e => e.dayLabel === day)
    if (dayEvents.length > 0) acc[day] = dayEvents
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <header className="sticky top-0 z-10 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-3">
          <h1 className="text-2xl font-bold tracking-tight">TrexCon Schedule</h1>
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
    </div>
  )
}
