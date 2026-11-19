'use client'
// Pieces shared by the creator, MCN and editor workspaces: toast, inbox, alerts, saved, a tiny store.
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import '@/styles/wsb.css'
import type { Chat } from '@/data/workspace-b'
import { Icon } from '../Icon'
import { WsHead } from './Shell'
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

export function Inbox({ title, sub, chats, role }: { title: string; sub: string; chats: Chat[]; role: string }) {
  const [list, setList] = useState(chats)
  const [id, setId] = useState(chats[0]?.id)
  const [text, setText] = useState('')
  const cur = list.find((c) => c.id === id) || list[0]
  const open = (cid: string) => { setId(cid); setList((l) => l.map((c) => (c.id === cid ? { ...c, unread: false } : c))) }
  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setList((l) => l.map((c) => (c.id === cur.id ? { ...c, messages: [...c.messages, { me: true, text: text.trim(), when: 'Just now' }] } : c)))
    setText(''); track('message_sent', { role, thread: cur.id })
  }
  return (
    <>
      <WsHead title={title} sub={sub} />
      <div className="wcard wcard--flush wb-inbox">
        <ul className="wb-inbox__list" aria-label="Conversations">
          {list.map((c) => (
            <li key={c.id}>
              <button className={c.id === cur.id ? 'is-on' : ''} onClick={() => open(c.id)}>
                <b>{c.who}{c.unread ? <i aria-label="Unread" /> : null}</b>
                <small>{c.sub}</small>
                <span>{c.messages[c.messages.length - 1].text}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="wb-inbox__thread">
          <header><b>{cur.who}</b><small>{cur.sub}</small></header>
          <div className="wb-inbox__msgs">
            {cur.messages.map((m, i) => <p key={i} className={m.me ? 'is-me' : ''}>{m.text}<small>{m.when}</small></p>)}
          </div>
          <form onSubmit={send} className="wb-inbox__reply">
            <label className="sr" htmlFor={`reply-${role}`}>Reply</label>
            <input id={`reply-${role}`} className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a reply" />
            <button className="btn btn--sm" data-cta={`ws_${role}_send_message`}>Send</button>
          </form>
        </div>
      </div>
    </>
  )
}

export function Alerts({ items }: { items: { text: string; when: string; tab: string }[] }) {
  return (
    <>
      <WsHead title="Alerts" sub="What changed since you last looked." />
      <div className="wcard">
        {items.map((a) => (
          <div className="wrow" key={a.text}>
            <Icon name="bell" size={17} />
            <div className="wrow__t"><b>{a.text}</b><small>{a.when}</small></div>
            <button className="btn btn--ghost btn--sm" onClick={() => goTab(a.tab)}>Open</button>
          </div>
        ))}
      </div>
    </>
  )
}

export function Saved({ title = 'Saved', sub, items }: { title?: string; sub: string; items: { title: string; sub: string }[] }) {
  return (
    <>
      <WsHead title={title} sub={sub} />
      <div className="wcard">
        {items.map((a) => (
          <div className="wrow" key={a.title}>
            <Icon name="bookmark" size={17} />
            <div className="wrow__t"><b>{a.title}</b><small>{a.sub}</small></div>
          </div>
        ))}
      </div>
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
