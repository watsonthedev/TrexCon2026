import type { Event } from '../types/event'
import { CATEGORY_LABELS } from '../types/event'

export function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white/5 rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-white font-semibold leading-snug">{event.title}</h3>
        <span className="text-green-400 text-xs shrink-0 mt-0.5">{CATEGORY_LABELS[event.category]}</span>
      </div>
      <p className="text-gray-500 text-xs">
        {event.startTime} – {event.endTime} · {event.location}
      </p>
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{event.details}</p>
    </div>
  )
}
