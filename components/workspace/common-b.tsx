'use client'
// Pieces shared by the creator, MCN and editor workspaces: toast, inbox, alerts, saved, a tiny store.
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import '@/styles/wsb.css'
import '@/styles/wsb2.css'
import type { Chat } from '@/data/workspace-b'
import { Icon } from '../Icon'
import { track } from '@/lib/track'

/** Shared state across the tabs of one workspace (tabs are separate trees inside the shell). */
export function createStore<T>(initial: T) {
  let state = initial
  const subs = new Set<() => void>()
  const get = () => state
  const set = (next: T | ((s: T) => T)) => { state = typeof next === 'function' ? (next as (s: T) => T)(state) : next; subs.forEach((f) => f()) }
  const use = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, get, () => initial)
  return { get, set, use }
}

/** Small confirmation toast. Returns [node, show]. */
export function useToast(): [React.ReactNode, (msg: string) => void] {
  const [msg, setMsg] = useState('')
  const t = useRef<any>(null)
  const show = useCallback((m: string) => { setMsg(m); clearTimeout(t.current); t.current = setTimeout(() => setMsg(''), 3200) }, [])
  useEffect(() => () => clearTimeout(t.current), [])
  return [msg ? <div className="wtoast" role="status">{msg}</div> : null, show]
}

export const goTab = (id: string) => window.dispatchEvent(new CustomEvent('ws:tab', { detail: id }))

/** Navy header band used by every creator, MCN and editor screen: icon, title, one line, stat tiles. */
export function BandHead({ icon, title, sub, stats = [], children }: { icon: string; title: string; sub: React.ReactNode; stats?: { n: React.ReactNode; l: string; hot?: boolean }[]; children?: React.ReactNode }) {
  return (
    <header className="wb2-band">
      <div className="wb2-band__top">
        <span className="wb2-band__ico"><Icon name={icon} size={20} /></span>
        <div className="wb2-band__t"><h2>{title}</h2><p>{sub}</p></div>
        {children ? <div className="wb2-band__act">{children}</div> : null}
      </div>
      {stats.length ? (
        <dl className="wb2-band__stats" style={{ ['--n' as string]: stats.length }}>
          {stats.map((x) => <div key={x.l} className={x.hot ? 'is-hot' : ''}><dd className="num">{x.n}</dd><dt>{x.l}</dt></div>)}
        </dl>
      ) : null}
    </header>
  )
}

const initials = (s: string) => s.replace(/[^\p{L}\s]/gu, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'

export function Inbox({ title, sub, chats, role }: { title: string; sub: string; chats: Chat[]; role: string }) {
  const [list, setList] = useState(chats)
  const [id, setId] = useState(chats[0]?.id)
  const [text, setText] = useState('')
  const [q, setQ] = useState('')
  const cur = list.find((c) => c.id === id) || list[0]
  const unread = list.filter((c) => c.unread).length
  const shown = list.filter((c) => `${c.who} ${c.sub} ${c.messages.map((m) => m.text).join(' ')}`.toLowerCase().includes(q.trim().toLowerCase()))
  const open = (cid: string) => {
    setId(cid); setList((l) => l.map((c) => (c.id === cid ? { ...c, unread: false } : c)))
    if (window.matchMedia('(max-width: 860px)').matches) document.getElementById(`wb2-thread-${role}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setList((l) => l.map((c) => (c.id === cur.id ? { ...c, messages: [...c.messages, { me: true, text: text.trim(), when: 'Just now' }] } : c)))
    setText(''); track('message_sent', { role, thread: cur.id })
  }
  return (
    <>
      <BandHead icon="message" title={title} sub={<>{sub} {unread ? <b>{unread} unread.</b> : 'All read.'}</>}
        stats={[{ n: list.length, l: 'conversations' }, { n: unread, l: 'unread', hot: unread > 0 }, { n: list.reduce((s, c) => s + c.messages.length, 0), l: 'messages' }]} />
      <div className="wb2-inbox">
        <aside className="wb2-inbox__side">
          <label className="wb2-search"><Icon name="search" size={16} /><span className="sr">Search conversations</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations" /></label>
          <ul aria-label="Conversations">
            {shown.map((c) => {
              const last = c.messages[c.messages.length - 1]
              return (
                <li key={c.id}>
                  <button className={`${c.id === cur.id ? 'is-on' : ''} ${c.unread ? 'is-new' : ''}`} onClick={() => open(c.id)} aria-current={c.id === cur.id}>
                    <span className="wb2-av">{initials(c.who)}</span>
                    <span className="wb2-inbox__t">
                      <b>{c.who}<em>{last.when}</em></b>
                      <small>{c.sub}</small>
                      <span>{last.me ? 'You: ' : ''}{last.text}</span>
                    </span>
                  </button>
                </li>
              )
            })}
            {shown.length === 0 ? <li className="wb2-none">No conversation matches “{q}”.</li> : null}
          </ul>
        </aside>
        <section className="wb2-inbox__thread" id={`wb2-thread-${role}`} aria-label={`Conversation with ${cur.who}`}>
          <header><span className="wb2-av">{initials(cur.who)}</span><div><b>{cur.who}</b><small>{cur.sub}</small></div></header>
          <div className="wb2-msgs">
            {cur.messages.map((m, i) => (
              <div key={i} className={`wb2-msg ${m.me ? 'is-me' : ''}`}>
                <p>{m.text}</p><small>{m.me ? 'You' : cur.who} · {m.when}</small>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="wb2-reply">
            <label className="sr" htmlFor={`reply-${role}`}>Reply to {cur.who}</label>
            <input id={`reply-${role}`} value={text} onChange={(e) => setText(e.target.value)} placeholder={`Reply to ${cur.who}`} autoComplete="off" />
            <button className="btn btn--sm" disabled={!text.trim()} data-cta={`ws_${role}_send_message`}>Send<Icon name="arrow" size={14} /></button>
          </form>
        </section>
      </div>
    </>
  )
}

const ALERT_ICON: Record<string, string> = { orders: 'film', queue: 'inbox', mine: 'film', revisions: 'refresh', delivered: 'check', messages: 'message', earnings: 'card', rates: 'card', profile: 'user', talent: 'users', contracts: 'file', billing: 'card', deals: 'bag', ranking: 'chart' }

export function Alerts({ items }: { items: { text: string; when: string; tab: string }[] }) {
  const [read, setRead] = useState<string[]>([])
  const [only, setOnly] = useState(false)
  const unread = items.filter((a) => !read.includes(a.text))
  const shown = only ? unread : items
  const today = shown.filter((a) => /ago|today|just now/i.test(a.when))
  const earlier = shown.filter((a) => !today.includes(a))
  const openAlert = (a: { text: string; tab: string }) => { setRead((r) => [...r, a.text]); track('cta_click', { cta: 'alert_open', tab: a.tab }); goTab(a.tab) }
  const group = (label: string, list: typeof items) => list.length ? (
    <section className="wb2-card" key={label}>
      <h3 className="wb2-k">{label}</h3>
      <ol className="wb2-alerts">
        {list.map((a) => {
          const isNew = !read.includes(a.text)
          return (
            <li key={a.text} className={isNew ? 'is-new' : ''}>
              <span className="wb2-ico"><Icon name={ALERT_ICON[a.tab] || 'bell'} size={16} /></span>
              <div><b>{a.text}</b><small>{a.when}</small></div>
              <button className="btn btn--sm btn--ghost" onClick={() => openAlert(a)}>Open<Icon name="arrow" size={13} /></button>
            </li>
          )
        })}
      </ol>
    </section>
  ) : null
  return (
    <>
      <BandHead icon="bell" title="Alerts" sub={unread.length ? <>What changed since you last looked. <b>{unread.length} unread.</b></> : 'You’re all caught up.'}
        stats={[{ n: items.length, l: 'alerts' }, { n: unread.length, l: 'unread', hot: unread.length > 0 }]}>
        {unread.length ? <button className="btn btn--sm" onClick={() => { setRead(items.map((a) => a.text)); track('cta_click', { cta: 'alerts_mark_all_read' }) }}>Mark all read</button> : null}
      </BandHead>
      <div className="wb2-seg" role="group" aria-label="Show">
        <button aria-pressed={!only} onClick={() => setOnly(false)}>All<span>{items.length}</span></button>
        <button aria-pressed={only} onClick={() => setOnly(true)}>Unread<span>{unread.length}</span></button>
      </div>
      {shown.length === 0 ? <div className="wb2-empty"><span className="wb2-ico"><Icon name="check" size={18} /></span><b>Nothing unread</b><p>New alerts show up here.</p></div> : null}
      {group('Today', today)}
      {group('Earlier', earlier)}
    </>
  )
}

const SAVED_ICON = (t: string) => (/guide/i.test(t) ? 'file' : /music|audio/i.test(t) ? 'play' : /preset|caption/i.test(t) ? 'layout' : /brief/i.test(t) ? 'pen' : /list|creator/i.test(t) ? 'users' : 'bookmark')

export function Saved({ title = 'Saved', sub, items }: { title?: string; sub: string; items: { title: string; sub: string }[] }) {
  const [list, setList] = useState(items)
  const [toast, show] = useToast()
  return (
    <>
      <BandHead icon="bookmark" title={title} sub={sub} stats={[{ n: list.length, l: 'saved items' }]} />
      {list.length === 0 ? <div className="wb2-empty"><span className="wb2-ico"><Icon name="bookmark" size={18} /></span><b>Nothing saved yet</b><p>Save guides, presets and lists to find them fast.</p></div> : null}
      <div className="wb2-saved">
        {list.map((a) => (
          <article key={a.title} className="wb2-card wb2-saved__item">
            <span className="wb2-ico wb2-ico--lime"><Icon name={SAVED_ICON(a.title)} size={18} /></span>
            <b>{a.title}</b>
            <small>{a.sub}</small>
            <div className="wb2-saved__act">
              <button className="btn btn--sm btn--ghost" onClick={() => { show(`Opened “${a.title}” (sample).`); track('cta_click', { cta: 'saved_open', item: a.title }) }}>Open</button>
              <button className="wb2-x" aria-label={`Remove ${a.title}`} onClick={() => { setList((l) => l.filter((x) => x.title !== a.title)); show('Removed from saved.'); track('cta_click', { cta: 'saved_remove', item: a.title }) }}><Icon name="close" size={15} /></button>
            </div>
          </article>
        ))}
      </div>
      {toast}
    </>
  )
}

/** Mock file picker: a dashed drop button that reports a made-up file name. */
export function DropButton({ label, hint, onPick, cta }: { label: string; hint?: string; onPick: () => void; cta: string }) {
  return (
    <button type="button" className="wdrop" onClick={onPick} data-cta={cta}>
      <Icon name="upload" size={20} /><b>{label}</b>{hint ? <span className="small muted">{hint}</span> : null}
    </button>
  )
}
