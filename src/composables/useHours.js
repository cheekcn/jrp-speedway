// src/composables/useHours.js
// Shared hours-of-operation state. Loaded once from Firestore (settings/hours)
// and used by the Track page, the footer, and the admin Hours editor.
import { reactive } from 'vue'
import { getHours } from '@/firebase/services'

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Fallback shown until Firestore responds (or if it can't be reached).
export const defaultHours = () => ({
  season: '',
  footnote: 'Hours subject to change for special events. Check social media or call ahead.',
  days: DAYS.map(day => ({
    day,
    closed: day === 'Sunday',
    open: '09:00',
    close: '18:00',
    note: '',
  })),
})

// Always return exactly 7 days in Mon→Sun order, whatever is stored.
export const normalizeHours = (data = {}) => {
  const base = defaultHours()
  const stored = Array.isArray(data.days) ? data.days : []
  return {
    season: data.season ?? base.season,
    footnote: data.footnote ?? base.footnote,
    days: base.days.map(def => {
      const s = stored.find(d => d?.day === def.day) || {}
      return {
        day: def.day,
        closed: typeof s.closed === 'boolean' ? s.closed : def.closed,
        open: s.open || def.open,
        close: s.close || def.close,
        note: s.note || '',
      }
    }),
    updatedAt: data.updatedAt || null,
  }
}

const state = reactive({ ...normalizeHours(), loaded: false })
let pending = null

export const loadHours = (force = false) => {
  if (pending && !force) return pending
  pending = getHours()
    .then(data => { if (data) setHours(data) })
    .catch(() => { /* keep defaults — e.g. offline or rules not yet deployed */ })
    .finally(() => { state.loaded = true })
  return pending
}

// Update the shared state (used after the admin saves, so the site updates instantly).
export const setHours = (data) => {
  Object.assign(state, normalizeHours(data))
}

export const useHours = () => {
  loadHours()
  return state
}

// ─── Formatting ─────────────────────────────────────────────────────────────
// "13:30" → "1:30 PM"  (short: "1:30pm", "9am")
export const formatTime = (hhmm, short = false) => {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  if (short) return `${h12}${m ? ':' + String(m).padStart(2, '0') : ''}${suffix.toLowerCase()}`
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

export const formatDayHours = (d, short = false) =>
  d.closed ? 'Closed' : `${formatTime(d.open, short)} – ${formatTime(d.close, short)}`

// Collapse consecutive days with identical hours: [{ label: 'Mon–Sat', time: '9am – 6pm' }, ...]
export const groupHours = (days) => {
  const groups = []
  for (const d of days) {
    const time = formatDayHours(d, true)
    const last = groups[groups.length - 1]
    if (last && last.time === time) last.days.push(d.day)
    else groups.push({ time, days: [d.day] })
  }
  return groups.map(g => ({
    time: g.time,
    label: g.days.length === 1
      ? g.days[0]
      : `${g.days[0].slice(0, 3)}–${g.days[g.days.length - 1].slice(0, 3)}`,
  }))
}
