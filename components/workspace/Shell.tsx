'use client'
// Shell for every logged-in preview: account card + side nav on the left, one screen on the right.
// The active screen comes from ?tab=. If you open a workspace without being signed in as that
// role, a one-click bar signs you in with the matching dummy account.
import Link from 'next/link'
import { useEffect, useState } from 'react'
import '@/styles/workspace.css'
import { href } from '@/data/site'
import { accountByRole, type Role } from '@/data/accounts'
import { Icon } from '../Icon'
import { useApp } from '../AppState'
import { track } from '@/lib/track'

export type WsTab = { id: string; label: string; icon: string; group?: string; badge?: string | number; status?: 'live' | 'dev' | 'planned'; content: React.ReactNode }

export default function WorkspaceShell({ lang, role, tabs, title }: { lang: string; role: Exclude<Role, 'guest'>; tabs: WsTab[]; title: string }) {
  const { role: current, setRole, ready } = useApp()
  const account = accountByRole[role]
  const [tab, setTab] = useState(tabs[0].id)

  useEffect(() => {
    const read = () => { const t = new URLSearchParams(window.location.search).get('tab'); setTab(t && tabs.some((x) => x.id === t) ? t : tabs[0].id) }
    read()
    window.addEventListener('popstate', read)
    // other screens can switch tab with: window.dispatchEvent(new CustomEvent('ws:tab', { detail: 'orders' }))
    const on = (e: Event) => go((e as CustomEvent).detail)
    window.addEventListener('ws:tab', on)
    return () => { window.removeEventListener('popstate', read); window.removeEventListener('ws:tab', on) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function go(id: string) {
    if (!tabs.some((x) => x.id === id)) return
    setTab(id)
    const u = new URL(window.location.href); u.searchParams.set('tab', id)
    window.history.pushState({}, '', u)
    track('workspace_tab', { role, tab: id })
    document.getElementById('ws-main')?.scrollIntoView({ block: 'start' })
  }

  const groups = Array.from(new Set(tabs.map((t) => t.group || '')))
  const active = tabs.find((t) => t.id === tab) || tabs[0]

  return (
    <div className="wrap ws">
      {ready && current !== role && (
        <div className="ws__signin" role="status">
          <span><Icon name="lock" size={15} />You’re looking at the <b>{title}</b> without being signed in as {account.name}.</span>
          <button className="btn btn--sm" data-cta={`preview_signin_${role}`} onClick={() => setRole(role)}>Sign in as {account.title} (dummy)</button>
        </div>
      )}
      <div className="ws__grid">
        <aside className="ws__side">
          <div className="ws__acct">
            <span className={`av tone-${account.tone}`}>{account.initial}</span>
            <div><b>{account.name}</b><small>{account.org}</small></div>
          </div>
          <nav aria-label={title}>
            {groups.map((g) => (
              <div key={g} className="ws__group">
                {g ? <p>{g}</p> : null}
                {tabs.filter((t) => (t.group || '') === g).map((t) => (
                  <button key={t.id} className={t.id === tab ? 'is-on' : ''} aria-current={t.id === tab ? 'page' : undefined} onClick={() => go(t.id)} data-cta={`ws_${role}_${t.id}`}>
                    <Icon name={t.icon} size={17} /><span>{t.label}</span>
                    {t.status ? <i className={`rtag rtag--${t.status}`}>{{ live: 'Live', dev: 'In dev', planned: 'Planned' }[t.status]}</i> : null}
                    {t.badge ? <em>{t.badge}</em> : null}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="ws__sidefoot">
            <Link href={href(lang, '/preview')} prefetch={false}>All preview screens</Link>
            <button onClick={() => { setRole('guest'); window.location.href = href(lang, '/login') }} data-cta="ws_logout">Log out</button>
          </div>
        </aside>

        <div className="ws__tabs scroller" role="group" aria-label={title}>
          {tabs.map((t) => <button key={t.id} className="chip" aria-pressed={t.id === tab} onClick={() => go(t.id)}><Icon name={t.icon} size={15} />{t.label}</button>)}
        </div>

        <section className="ws__main" id="ws-main" aria-label={active.label}>
          {/* every screen stays mounted so a flow keeps its state when you switch tabs */}
          {tabs.map((t) => <div key={t.id} hidden={t.id !== tab}>{t.content}</div>)}
        </section>
      </div>
    </div>
  )
}

/** Screen header inside a workspace. The page's single h1 is the workspace title; screens use h2. */
export function WsHead({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <header className="ws__head">
      <div><h2 className="h3">{title}</h2>{sub ? <p className="muted small">{sub}</p> : null}</div>
      {children ? <div className="row">{children}</div> : null}
    </header>
  )
}

const PILL: Record<string, string> = {
  'Final delivered': 'ok', Completed: 'ok', Posted: 'ok', Paid: 'ok', Active: 'ok', 'Approved by brand': 'ok', Contracted: 'ok', Signed: 'ok', Accepted: 'ok', Live: 'ok',
  'Draft ready': 'do', 'Draft review': 'do', 'Script review': 'do', 'Brand approval': 'do', 'Awaiting creator': 'do', Proposed: 'do', Invited: 'do', Pending: 'do', 'Counter-offer': 'do', 'Waiting for brief': 'do', 'New request': 'do', 'Script needed': 'do', 'Draft needed': 'do', Editing: 'do', Scheduled: 'do', 'Counter sent': 'do', New: 'do', Negotiating: 'do', Agreed: 'ok',
  'Revision requested': 'warn', Revision: 'warn', Refunded: 'warn', Declined: 'bad', Overdue: 'bad',
}
/** Status pill. Colour comes from the status text; unknown statuses are neutral. */
export function Pill({ children }: { children: string }) {
  return <span className={`pill pill--${PILL[children] || 'idle'}`}>{children}</span>
}
