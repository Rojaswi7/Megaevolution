'use client'
// Signed-in header icons: Alerts and Messages open a panel; Saved jumps to the lists tab.
// Opening a workspace tab from the page you are already on switches the tab in place
// (the workspace listens for 'ws:tab'); from anywhere else it navigates there.
import { useEffect, useRef, useState } from 'react'
import { href } from '@/data/site'
import { NOTIFICATIONS, THREADS } from '@/data/workspace'
import { AGENCY_NOTIFICATIONS } from '@/data/workspaceAgency'
import { CREATOR_ALERTS, MCN_ALERTS, EDITOR_ALERTS } from '@/data/workspace-b'
import { creatorByHandle } from '@/data/creators'
import { Icon } from './Icon'
import { track } from '@/lib/track'
import '@/styles/header-panels.css'

type Alert = { text: string; when: string; to?: string; tab?: string }
const ALERTS: Record<string, Alert[]> = { brand: NOTIFICATIONS, agency: AGENCY_NOTIFICATIONS, creator: CREATOR_ALERTS, mcn: MCN_ALERTS, editor: EDITOR_ALERTS }
const ALERT_ICON: Record<string, string> = { orders: 'film', team: 'users', messages: 'message', 'agency-orders': 'list', billing: 'card', earnings: 'card', profile: 'user', rates: 'card' }

export default function HeaderPanels({ lang, role, saved }: { lang: string; role: string; saved: number }) {
  const [open, setOpen] = useState<'' | 'alerts' | 'messages'>('')
  const [read, setRead] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const alerts = ALERTS[role] || []
  const threads = role === 'brand' || role === 'agency' ? THREADS : []
  const unreadMsgs = threads.filter((t) => t.unread).length || (role === 'brand' || role === 'agency' ? 0 : 2)

  useEffect(() => {
    if (!open) return
    const out = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen('') }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen('') }
    document.addEventListener('mousedown', out); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('keydown', esc) }
  }, [open])

  const goTab = (tab: string, from: string) => {
    setOpen('')
    track('cta_click', { cta: `header_${from}`, tab })
    const here = window.location.pathname.replace(/^\/(ko|ja|zh|vi)(?=\/|$)/, '') === `/preview/${role}`
    if (here) window.dispatchEvent(new CustomEvent('ws:tab', { detail: tab }))
    else window.location.href = href(lang, `/preview/${role}?tab=${tab}`)
  }
  const toggle = (p: 'alerts' | 'messages') => { setOpen((o) => (o === p ? '' : p)); if (open !== p) track('cta_click', { cta: `header_${p}_open` }) }

  return (
    <div className="hp" ref={box}>
      <button className={`hdr__icon ${open === 'alerts' ? 'is-open' : ''}`} aria-label="Alerts" aria-expanded={open === 'alerts'} onClick={() => toggle('alerts')} data-cta="header_alerts">
        <Icon name="bell" />{!read && alerts.length ? <i>{alerts.length}</i> : null}
      </button>
      <button className="hdr__icon hdr__opt" aria-label="Saved creators" onClick={() => goTab('lists', 'saved')} data-cta="header_saved">
        <Icon name="bookmark" />{saved ? <i>{saved}</i> : null}
      </button>
      <button className={`hdr__icon hdr__opt ${open === 'messages' ? 'is-open' : ''}`} aria-label="Messages" aria-expanded={open === 'messages'} onClick={() => toggle('messages')} data-cta="header_messages">
        <Icon name="message" />{unreadMsgs ? <i>{unreadMsgs}</i> : null}
      </button>

      {open === 'alerts' && (
        <div className="hp__panel" role="dialog" aria-label="Alerts">
          <header><b>Alerts</b>{alerts.length && !read ? <button onClick={() => setRead(true)}>Mark all read</button> : <span>All caught up</span>}</header>
          <ol>
            {alerts.map((a, i) => {
              const tab = a.to || a.tab || 'alerts'
              return (
                <li key={a.text}>
                  <button onClick={() => goTab(tab, 'alert_item')} className={!read && i < 2 ? 'is-new' : ''}>
                    <span className="hp__ico"><Icon name={ALERT_ICON[tab] || 'bell'} size={15} /></span>
                    <span className="hp__t"><b>{a.text}</b><small>{a.when}</small></span>
                  </button>
                </li>
              )
            })}
          </ol>
          <footer><button onClick={() => goTab('alerts', 'alerts_all')}>See all alerts<Icon name="arrow" size={14} /></button></footer>
        </div>
      )}

      {open === 'messages' && (
        <div className="hp__panel" role="dialog" aria-label="Messages">
          <header><b>Messages</b><span>{unreadMsgs} unread</span></header>
          {threads.length ? (
            <ol>
              {threads.slice(0, 4).map((t) => {
                const c = t.creator ? creatorByHandle[t.creator] : null
                return (
                  <li key={t.id}>
                    <button onClick={() => goTab('messages', 'message_item')} className={t.unread ? 'is-new' : ''}>
                      <span className={`av tone-${c ? (c.tone + 5) % 8 : 2}`}>{t.from[0]}</span>
                      <span className="hp__t"><b>{t.from}<em>{t.when}</em></b><small>{t.preview}</small></span>
                    </button>
                  </li>
                )
              })}
            </ol>
          ) : (
            <p className="hp__empty">You have {unreadMsgs} unread messages in your inbox.</p>
          )}
          <footer><button onClick={() => goTab('messages', 'messages_all')}>Open inbox<Icon name="arrow" size={14} /></button></footer>
        </div>
      )}
    </div>
  )
}
