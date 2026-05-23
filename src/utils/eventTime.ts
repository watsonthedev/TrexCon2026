/**
 * Utilities for converting stored event times (MDT, UTC-6) back to timestamps.
 * The sync script stores times as local MDT strings; we add 6 hours to get UTC.
 */

const MDT_OFFSET_HOURS = 6 // MDT = UTC-6, so UTC = local + 6

function parseMs(isoDate: string, timeStr: string): number {
  const [time, ampm] = timeStr.split(' ')
  const [hStr, mStr] = time.split(':')
  let h = parseInt(hStr)
  const m = parseInt(mStr)
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  const [year, month, day] = isoDate.split('-').map(Number)
  return Date.UTC(year, month - 1, day, h + MDT_OFFSET_HOURS, m)
}

export const eventStartMs = (isoDate: string, startTime: string) =>
  parseMs(isoDate, startTime)

export const eventEndMs = (isoDate: string, endTime: string) =>
  parseMs(isoDate, endTime)
