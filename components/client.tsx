'use client'
// Small client-only pieces: click tracking, save-to-list, the review dock and a sign-up gate dialog.
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { href } from '@/data/site'
import { ACCOUNTS, ROLE_LABEL } from '@/data/accounts'
import { Icon, Arrow } from './Icon'
import { useApp, type Role } from './AppState'
import { track } from '@/lib/track'

/** One listener for the whole site: any element with data-cta fires track('cta_click'). */
export function TrackClicks() {
  useEffect(() => {
    const on = (e: MouseEvent) => {
      // explicit ids first; any other button or arrow link still gets tracked under an id built from its label
      const el = (e.target as HTMLElement | null)?.closest?.('[data-cta], .btn, .tlink') as HTMLElement | null
      if (!el) return
      const auto = 'auto_' + (el.textContent || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40)
      track('cta_click', { cta: el.dataset.cta || auto, label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 60), href: el.getAttribute('href') || undefined })
    }
    document.addEventListener('click', on, true)
    return () => document.removeEventListener('click', on, true)
  }, [])
  return null
}

/** Sign-up gate dialog used by "Save to list", "Export as PDF" and the search soft gate. */
export function GateDialog({ lang, reason, title, text, onClose }: { lang: string; reason: string; title: string; text: string; onClose: () => void }) {
  useEffect(() => {
    track('gate_shown', { gate: reason })
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [reason, onClose])
  return (
    <div className="cmdk" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cmdk__box" style={{ padding: 28, gap: 14, maxWidth: 440, height: 'auto' }}>
        <span className="tag tag--accent" style={{ alignSelf: 'flex-start' }}>Free account</span>
        <h2 className="h3">{title}</h2>
        <p style={{ color: 'var(--ink-2)' }}>{text}</p>
        <div className="row" style={{ marginTop: 6 }}>
          <Link className="btn" href={href(lang, `/signup?from=${reason}`)} data-cta={`gate_signup_${reason}`} onClick={() => track('gate_converted', { gate: reason, to: 'signup' })}>Sign up free<Arrow /></Link>
          <Link className="btn btn--ghost" href={href(lang, '/login')} data-cta={`gate_login_${reason}`} onClick={() => track('gate_converted', { gate: reason, to: 'login' })}>Log in</Link>
        </div>
        <button className="small muted ulink" style={{ justifySelf: 'start', alignSelf: 'flex-start' }} onClick={() => { track('gate_dismissed', { gate: reason }); onClose() }}>Not now</button>
      </div>
    </div>
  )
}

/** Save to list. Logged out, it opens the sign-up gate; logged in (any dummy account), it saves. */
export function SaveButton({ handle, label = false }: { handle: string; label?: boolean }) {
  const { role, saved, toggleSaved } = useApp()
  const [gate, setGate] = useState(false)
  const on = saved.includes(handle)
  const lang = typeof document !== 'undefined' ? document.documentElement.lang || 'en' : 'en'
  const click = () => {
    if (role === 'guest') { setGate(true); return }
    toggleSaved(handle); track('creator_saved', { handle, saved: !on })
  }
  return (
    <>
      <button className={label ? 'btn btn--ghost' : 'cc__save'} aria-pressed={on} aria-label={`${on ? 'Remove' : 'Save'} @${handle} ${on ? 'from' : 'to'} list`} onClick={click} data-cta="save_to_list">
        <Icon name="bookmark" size={label ? 17 : 16} />{label ? (on ? 'Saved' : 'Save to list') : null}
      </button>
      {gate && <GateDialog lang={lang} reason="save_to_list" title="Save creators to a list" text="Create a free account to save creators, compare them side by side and share the list with your team." onClose={() => setGate(false)} />}
    </>
  )
}

/** Gated button (Export as PDF and similar): sign-up gate when logged out, plan prompt when logged in. */
export function GatedButton({ lang, reason, children, title, text, icon = 'download', variant = 'ghost' }: { lang: string; reason: string; children: React.ReactNode; title: string; text: string; icon?: string; variant?: string }) {
  const { role } = useApp()
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(false)
  return (
    <>
      <button className={`btn btn--${variant} btn--sm`} data-cta={reason} onClick={() => (role === 'guest' ? setOpen(true) : (setNote(true), track('gate_shown', { gate: `${reason}_plan` })))}>
        <Icon name={icon} size={15} />{children}<Icon name="lock" size={13} />
      </button>
      {note && <span className="small" role="status"> Included in paid plans. <Link className="ulink" href={href(lang, '/pricing')} data-cta={`${reason}_upgrade`} onClick={() => track('gate_converted', { gate: `${reason}_plan`, to: 'pricing' })}>Choose plan</Link></span>}
      {open && <GateDialog lang={lang} reason={reason} title={title} text={text} onClose={() => setOpen(false)} />}
    </>
  )
}

/** Mockup-only controls: theme, roadmap tags and "Preview as" (dummy accounts). Not part of the real site. */
export function ReviewDock({ lang }: { lang: string }) {
  const { theme, setTheme, roadmap, setRoadmap, role, setRole } = useApp()
  const [open, setOpen] = useState(false)
  const pick = (r: Role) => {
    setRole(r)
    const home = r === 'guest' ? '/' : ACCOUNTS.find((a) => a.role === r)!.home
    window.location.href = href(lang, home)
  }
  return (
    <div className="dock">
      {open && (
        <div className="dock__panel" role="group" aria-label="Mockup review controls">
          <div>
            <h2>Preview as (dummy accounts)</h2>
            <div className="dock__seg">
              <button aria-pressed={role === 'guest'} onClick={() => pick('guest')}>Logged out</button>
              {ACCOUNTS.map((a) => <button key={a.role} aria-pressed={role === a.role} onClick={() => pick(a.role)}>{ROLE_LABEL[a.role]}</button>)}
            </div>
          </div>
          <div>
            <h2>Theme</h2>
            <div className="dock__seg">
              <button aria-pressed={theme === 'lime'} onClick={() => setTheme('lime')}>Lime (deck)</button>
              <button aria-pressed={theme === 'purple'} onClick={() => setTheme('purple')}>Purple (brand)</button>
            </div>
          </div>
          <div>
            <h2>Roadmap tags</h2>
            <div className="dock__seg">
              <button aria-pressed={!roadmap} onClick={() => setRoadmap(false)}>Hidden</button>
              <button aria-pressed={roadmap} onClick={() => { setRoadmap(true); track('roadmap_tags_shown') }}>Show roadmap tags</button>
            </div>
          </div>
          <div className="dock__seg"><a href={href(lang, '/login')}>All demo logins</a><a href={href(lang, '/preview')}>All screens</a></div>
        </div>
      )}
      <button className="dock__btn" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Review mode (mockup controls)"><Icon name="settings" size={15} /><span>Review mode</span></button>
    </div>
  )
}
