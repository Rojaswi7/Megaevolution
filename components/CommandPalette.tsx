'use client'
// ⌘K search over creators, pages, sections and help articles. Full-screen on phones.
// Empty: jump tiles and popular searches. Typing: grouped results with scope tabs and the match highlighted.
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { href } from '@/data/site'
import type { Dict } from '@/data/i18n'
import { SEARCH_INDEX, QUICK, POPULAR, type SearchItem } from '@/data/searchIndex'
import { Icon, Flag } from './Icon'
import { track } from '@/lib/track'

type Group = SearchItem['group']
const GROUP_ICON: Record<Group, string> = { Creators: 'user', Pages: 'file', Sections: 'layout', Help: 'message' }
const ORDER: Group[] = ['Creators', 'Pages', 'Sections', 'Help']

function Mark({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig')
  return <>{text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>))}</>
}

export default function CommandPalette({ lang, dict, onClose }: { lang: string; dict: Dict; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [scope, setScope] = useState<Group | ''>('')
  const [on, setOn] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const term = q.trim().toLowerCase()
  const words = term ? term.split(/\s+/) : []

  const hits = useMemo(() => {
    if (!term) return []
    const ws = term.split(/\s+/)
    return SEARCH_INDEX.filter((it) => { const hay = `${it.title} ${it.sub || ''} ${it.keywords || ''}`.toLowerCase(); return ws.every((w) => hay.includes(w)) })
  }, [term])
  const counts = Object.fromEntries(ORDER.map((g) => [g, hits.filter((h) => h.group === g).length])) as Record<Group, number>
  const sc: Group | '' = scope && counts[scope] ? scope : ''
  const results: SearchItem[] = term
    ? ORDER.filter((g) => !sc || g === sc).flatMap((g) => hits.filter((h) => h.group === g).slice(0, sc ? 30 : g === 'Creators' ? 6 : 5))
    : [...QUICK, ...POPULAR]

  useEffect(() => { input.current?.focus() }, [])
  useEffect(() => { setOn(0) }, [q, scope])
  useEffect(() => {
    if (!term) return
    const t = setTimeout(() => track('search', { query: term, results: hits.length, source: 'palette' }), 600)
    return () => clearTimeout(t)
  }, [term, hits.length])
  useEffect(() => { list.current?.querySelector('.is-on')?.scrollIntoView({ block: 'nearest' }) }, [on])

  const searchAll = () => { window.location.href = href(lang, `/creators?q=${encodeURIComponent(q.trim())}`) }
  const go = (it: SearchItem) => { track('search_result_click', { query: q, title: it.title, group: it.group }); window.location.href = href(lang, it.path) }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' && !term) { e.preventDefault(); setOn((v) => Math.min(v + 1, results.length - 1)) }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' && !term) { e.preventDefault(); setOn((v) => Math.max(v - 1, 0)) }
    if (e.key === 'Enter') { e.preventDefault(); if (results[on]) go(results[on]); else if (term) searchAll() }
  }
  const pickScope = (g: Group | '') => { setScope(g); track('filter_changed', { scope: g || 'all', source: 'palette' }); input.current?.focus() }

  let last = ''
  return (
    <div className="cmdk" role="dialog" aria-modal="true" aria-label="Search" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cmdk__box" onKeyDown={onKey}>
        <div className="cmdk__in">
          <span className="cmdk__glass"><Icon name="search" size={19} /></span>
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={dict.searchPlaceholder} aria-label={dict.searchPlaceholder} autoComplete="off" spellCheck={false} />
          {q ? <button className="cmdk__clear" onClick={() => { setQ(''); input.current?.focus() }}>Clear</button> : null}
          <button className="cmdk__esc" onClick={onClose} aria-label={dict.close}><kbd>Esc</kbd><Icon name="close" size={18} /></button>
        </div>

        {term && (
          <div className="cmdk__scopes" role="group" aria-label="Show">
            {(['', ...ORDER] as const).map((g) => (
              <button key={g || 'all'} aria-pressed={sc === g} onClick={() => pickScope(g)} disabled={!!g && !counts[g]}>
                {g || 'All'}<span>{g ? counts[g] : hits.length}</span>
              </button>
            ))}
          </div>
        )}

        <div className="cmdk__list" ref={list}>
          {!term ? (
            <>
              <p className="cmdk__grp">Jump to</p>
              <div className="cmdk__tiles">
                {QUICK.map((it, i) => (
                  <button key={it.path} className={`cmdk__tile ${i === on ? 'is-on' : ''}`} onMouseEnter={() => setOn(i)} onClick={() => go(it)}>
                    <span className="cmdk__ico"><Icon name={it.icon} size={18} /></span>
                    <b>{it.title}</b><small>{it.sub}</small>
                  </button>
                ))}
              </div>
              <p className="cmdk__grp">Popular searches</p>
              <div className="cmdk__pop">
                {POPULAR.map((it, j) => {
                  const i = QUICK.length + j
                  return (
                    <button key={it.path} className={`cmdk__chip ${i === on ? 'is-on' : ''}`} onMouseEnter={() => setOn(i)} onClick={() => go(it)}>
                      <Flag market={it.market} /><Icon name={it.icon} size={15} />{it.title}
                    </button>
                  )
                })}
              </div>
            </>
          ) : results.length === 0 ? (
            <div className="cmdk__empty">
              <span className="cmdk__ico"><Icon name="search" size={20} /></span>
              <b>No match for “{q.trim()}”</b>
              <p>Try a creator handle, a country or a category.</p>
              <button className="btn btn--sm" onClick={searchAll}>Search all creators for “{q.trim()}”</button>
            </div>
          ) : (
            results.map((it, i) => {
              const head = !sc && it.group !== last ? <p className="cmdk__grp">{it.group}<span>{counts[it.group]}</span></p> : null
              last = it.group
              return (
                <Fragment key={it.group + it.path + it.title}>
                  {head}
                  <button className={`cmdk__item ${i === on ? 'is-on' : ''}`} onMouseEnter={() => setOn(i)} onClick={() => go(it)}>
                    {it.group === 'Creators'
                      ? <span className={`av tone-${it.tone}`}>{it.initial}</span>
                      : <span className={`cmdk__ico cmdk__ico--${it.group.toLowerCase()}`}><Icon name={GROUP_ICON[it.group]} size={16} /></span>}
                    <span className="cmdk__txt"><b><Mark text={it.title} words={words} /></b>{it.sub ? <small>{it.sub}</small> : null}</span>
                    <kbd className="cmdk__enter" aria-hidden="true">↵</kbd>
                  </button>
                </Fragment>
              )
            })
          )}
        </div>

        <div className="cmdk__foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span><kbd>Esc</kbd> close</span>
          {term && results.length > 0 ? <button className="cmdk__all" onClick={searchAll}>All creators matching “{q.trim()}” →</button> : null}
        </div>
      </div>
    </div>
  )
}
