import type { Event } from '../types/event'

export function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white/5 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
      <div>
        <h3 className="text-white font-semibold leading-snug">{event.title}</h3>
        {event.location && (
          <p className="text-gray-500 text-xs mt-0.5">{event.location}</p>
        )}
      </div>
      <p className="text-gray-400 text-xs shrink-0 text-right">
        {event.startTime}<br />{event.endTime}
      </p>
    </div>
  )
}
