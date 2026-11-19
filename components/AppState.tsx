'use client'
// Client-side mockup state: display currency, "Preview as" role, roadmap tags, theme.
// Everything persists in localStorage. None of it changes a URL or a canonical.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CURRENCIES, DEFAULT_CURRENCY, type Currency } from '@/data/pricing'
import { track, captureUtm } from '@/lib/track'

import { accountByRole, canSeeAgencyOrders, type Role, type Account } from '@/data/accounts'
export type { Role }
export { canSeeAgencyOrders }
type State = {
  currency: Currency; setCurrency: (c: Currency) => void
  role: Role; setRole: (r: Role) => void
  roadmap: boolean; setRoadmap: (v: boolean) => void
  theme: 'lime' | 'purple'; setTheme: (t: 'lime' | 'purple') => void
  saved: string[]; toggleSaved: (handle: string) => void
  ready: boolean
}
const Ctx = createContext<State | null>(null)

const read = (k: string) => { try { return localStorage.getItem(k) } catch { return null } }
const write = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch {} }

/** Mock of "currency by IP or domain": saved choice, then domain, then timezone, then USD. */
function detectCurrency(): Currency {
  const saved = read('me.currency') as Currency | null
  if (saved && CURRENCIES[saved]) return saved
  try {
    const host = window.location.hostname
    if (/\.kr$|^kr\./.test(host)) return 'KRW'
    if (/\.jp$|^jp\./.test(host)) return 'JPY'
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz === 'Asia/Seoul') return 'KRW'
    if (tz === 'Asia/Tokyo') return 'JPY'
  } catch {}
  return DEFAULT_CURRENCY
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCur] = useState<Currency>(DEFAULT_CURRENCY)
  const [role, setRoleS] = useState<Role>('guest')
  const [roadmap, setRoadmapS] = useState(false)
  const [theme, setThemeS] = useState<'lime' | 'purple'>('lime')
  const [saved, setSaved] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    setCur(detectCurrency())
    setRoleS(((q.get('as') && ['brand', 'agency', 'creator', 'mcn', 'editor'].includes(q.get('as')!) && window.location.pathname.includes('/preview') ? q.get('as') : read('me.role')) as Role) || 'guest')
    const rm = q.get('roadmap') ? q.get('roadmap') === '1' : read('me.roadmap') === '1'
    setRoadmapS(rm)
    const th = (q.get('theme') === 'purple' || q.get('theme') === 'lime' ? q.get('theme') : read('me.theme')) as 'lime' | 'purple' | null
    if (th) setThemeS(th)
    try { setSaved(JSON.parse(read('me.saved') || '[]')) } catch {}
    setReady(true)
    captureUtm()
    track('page_view', { title: document.title })
  }, [])

  useEffect(() => { if (ready) { document.documentElement.dataset.roadmap = roadmap ? 'on' : 'off'; write('me.roadmap', roadmap ? '1' : '0') } }, [roadmap, ready])
  useEffect(() => { if (ready) { document.documentElement.dataset.theme = theme; write('me.theme', theme) } }, [theme, ready])

  const setCurrency = useCallback((c: Currency) => { setCur(c); write('me.currency', c); track('currency_changed', { currency: c }) }, [])
  const setRole = useCallback((r: Role) => { setRoleS(r); write('me.role', r); track('preview_role_changed', { role: r }) }, [])
  const toggleSaved = useCallback((h: string) => setSaved((s) => { const n = s.includes(h) ? s.filter((x) => x !== h) : [...s, h]; write('me.saved', JSON.stringify(n)); return n }), [])

  const value = useMemo(() => ({ currency, setCurrency, role, setRole, roadmap, setRoadmap: setRoadmapS, theme, setTheme: setThemeS, saved, toggleSaved, ready }),
    [currency, setCurrency, role, setRole, roadmap, theme, saved, toggleSaved, ready])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside AppStateProvider')
  return v
}

/** The signed-in dummy account, or null when browsing logged out. */
export function useAccount(): Account | null {
  const { role } = useApp()
  return role === 'guest' ? null : accountByRole[role] || null
}
