export type EventCategory =
  | 'PANEL'
  | 'GAME'
  | 'PERFORMANCE'
  | 'MEET_GREET'
  | 'WORKSHOP'
  | 'SOCIAL'

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  PANEL: 'Panels',
  GAME: 'Games',
  PERFORMANCE: 'Performances',
  MEET_GREET: 'Meet & Greets',
  WORKSHOP: 'Workshops',
  SOCIAL: 'Social Events',
}

export const ALL_CATEGORIES: EventCategory[] = [
  'PANEL',
  'GAME',
  'PERFORMANCE',
  'MEET_GREET',
  'WORKSHOP',
  'SOCIAL',
]

export interface Event {
  id: string
  title: string
  details: string
  category: EventCategory
  dayLabel: string
  startTime: string
  endTime: string
  location: string
}
