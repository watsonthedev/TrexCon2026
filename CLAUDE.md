# TrexCon — Project Context

## What This Is
A **React + TypeScript** web app for **TrexCon**, a fan convention run by Twitch streamer **Trexcapades**. Displays the convention schedule with category filtering.

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Data | Hardcoded (backend TBD) |

## Project Structure
```
TrexCon/
├── src/
│   ├── types/
│   │   └── event.ts              # Event interface, EventCategory type, CATEGORY_LABELS
│   ├── data/
│   │   └── scheduleData.ts       # Hardcoded event list (12 events, Fri/Sat/Sun)
│   ├── components/
│   │   ├── ScheduleView.tsx      # Root view — filter state, day grouping, layout
│   │   ├── EventCard.tsx         # Single event card
│   │   └── FilterChip.tsx        # Category filter button
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                 # Tailwind directives
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── postcss.config.js
```

## New Developer Setup
```bash
npm install
npm run dev
```
That's it. No Gradle, no Xcode, no Android Studio required.

## Common Commands
| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at http://localhost:5173 |
| `npm run build` | Type-check + production build into `dist/` |
| `npm run preview` | Serve the production build locally |

## Key Design Decisions
- **Dark-only theme**: Background `#0d0d0d`, card `bg-white/5`, green accent `green-500`. No light mode toggle — the convention aesthetic is intentionally dark.
- **No backend yet**: All data is hardcoded in `src/data/scheduleData.ts`. The `Event` interface and data file are the only things that need to change when a real API is added.
- **No router**: Single-page schedule view only. Add React Router if detail pages or other sections are needed.
- **Filter state lives in ScheduleView**: Simple `useState` — no global state needed at this scale.

## Adding Events
Edit `src/data/scheduleData.ts`. Each event follows the `Event` interface in `src/types/event.ts`:
```ts
{
  id: string           // unique, e.g. 'f01'
  title: string
  details: string
  category: EventCategory   // 'PANEL' | 'GAME' | 'PERFORMANCE' | 'MEET_GREET' | 'WORKSHOP' | 'SOCIAL'
  dayLabel: string     // 'Friday' | 'Saturday' | 'Sunday'
  startTime: string    // e.g. '5:00 PM'
  endTime: string
  location: string
}
```

## Feature Roadmap
- [ ] Maps & venue navigation
- [ ] Tickets & badge check-in
- [ ] Social / community feed
- [ ] Push notifications for schedule changes
- [ ] Real backend (Firebase or custom REST API)
- [ ] PWA manifest so it's installable on mobile home screens

## Convention Details
- **Convention name**: TrexCon
- **Streamer**: Trexcapades
