// Tiny analytics shim for the mockup. Logs to the console and keeps the last
// events on window.__meEvents so they can be inspected. Swap the body of
// `track` for the real analytics call later — every event name is in TRACKING.md.

export type TrackProps = Record<string, string | number | boolean | null | undefined>

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid']
const UTM_STORE = 'me.utm'

/** Read UTM / gclid from the URL once and keep them for the session (ad tracking). */
export function captureUtm() {
  if (typeof window === 'undefined') return
  try {
    const q = new URLSearchParams(window.location.search)
    const found: Record<string, string> = {}
    for (const k of UTM_KEYS) { const v = q.get(k); if (v) found[k] = v }
    if (Object.keys(found).length) {
      sessionStorage.setItem(UTM_STORE, JSON.stringify({ ...found, landing: window.location.pathname }))
      track('utm_captured', found)
    }
  } catch {}
}

function utm(): TrackProps {
  try { return JSON.parse(sessionStorage.getItem(UTM_STORE) || '{}') } catch { return {} }
}

export function track(event: string, props: TrackProps = {}) {
  if (typeof window === 'undefined') return
  const payload = { event, ...props, ...utm(), path: window.location.pathname, ts: new Date().toISOString() }
  const w = window as any
  ;(w.__meEvents ||= []).push(payload)
  if (w.__meEvents.length > 200) w.__meEvents.shift()
  // eslint-disable-next-line no-console
  console.log('%c[track]', 'color:#0E0D39;background:#C6F04D;padding:1px 5px;border-radius:3px', event, payload)
}
