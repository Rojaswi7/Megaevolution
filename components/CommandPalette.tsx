'use client'
// ⌘K search over creators, pages, sections and help articles. Full-screen on phones.
import { useEffect, useMemo, useRef, useState } from 'react'
import { href } from '@/data/site'
import type { Dict } from '@/data/i18n'
import { SEARCH_INDEX, SUGGESTED, type SearchItem } from '@/data/searchIndex'
import { Icon } from './Icon'
import { track } from '@/lib/track'

const GROUP_ICON: Record<string, string> = { Pages: 'file', Sections: 'layout', Help: 'message' }
const ORDER = ['Creators', 'Pages', 'Sections', 'Help']

export default function CommandPalette({ lang, dict, onClose }: { lang: string; dict: Dict; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [on, setOn] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return SUGGESTED
    const words = term.split(/\s+/)
    const hits = SEARCH_INDEX.filter((it) => { const hay = `${it.title} ${it.sub || ''} ${it.keywords || ''}`.toLowerCase(); return words.every((w) => hay.includes(w)) })
    const out: SearchItem[] = []
    for (const g of ORDER) out.push(...hits.filter((h) => h.group === g).slice(0, g === 'Creators' ? 6 : 5))
    return out
  }, [q])

  useEffect(() => { input.current?.focus() }, [])
  useEffect(() => { setOn(0) }, [q])
  useEffect(() => {
    if (!q.trim()) return
    const t = setTimeout(() => track('search', { query: q.trim(), results: results.length, source: 'palette' }), 600)
    return () => clearTimeout(t)
  }, [q, results.length])

  const go = (it: SearchItem) => { track('search_result_click', { query: q, title: it.title, group: it.group }); window.location.href = href(lang, it.path) }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowDown') { e.preventDefault(); setOn((v) => Math.min(v + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setOn((v) => Math.max(v - 1, 0)) }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (results[on]) go(results[on])
      else if (q.trim()) window.location.href = href(lang, `/creators?q=${encodeURIComponent(q.trim())}`)
    }
  }
  useEffect(() => { list.current?.querySelector('.is-on')?.scrollIntoView({ block: 'nearest' }) }, [on])

  let last = ''
  return (
    <div className="cmdk" role="dialog" aria-modal="true" aria-label="Search" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cmdk__box" onKeyDown={onKey}>
        <div className="cmdk__in">
          <Icon name="search" size={20} />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={dict.searchPlaceholder} aria-label={dict.searchPlaceholder} autoComplete="off" spellCheck={false} />
          <button className="hdr__icon" onClick={onClose} aria-label={dict.close}><Icon name="close" /></button>
        </div>
        <div className="cmdk__list" ref={list}>
          {!q.trim() && <p className="cmdk__grp">Popular</p>}
          {results.length === 0 && (
            <div className="cmdk__empty">
              <p>No match for “{q}”.</p>
              <button className="tlink" style={{ marginTop: 12 }} onClick={() => (window.location.href = href(lang, `/creators?q=${encodeURIComponent(q.trim())}`))}>Search all creators for “{q}”</button>
            </div>
          )}
          {results.map((it, i) => {
            const head = q.trim() && it.group !== last ? <p className="cmdk__grp" key={`g-${it.group}`}>{it.group}</p> : null
            last = it.group
            return (
              <span key={it.group + it.path + it.title} style={{ display: 'contents' }}>
                {head}
                <button className={`cmdk__item ${i === on ? 'is-on' : ''}`} onMouseEnter={() => setOn(i)} onClick={() => go(it)}>
                  {it.group === 'Creators' ? <span className={`av tone-${it.tone}`}>{it.initial}</span> : <Icon name={GROUP_ICON[it.group] || 'file'} size={17} />}
                  <span>{it.title}</span>
                  {it.sub ? <small>{it.sub}</small> : null}
                </button>
              </span>
            )
          })}
        </div>
        <div className="cmdk__foot"><span>↑↓ to move</span><span>Enter to open</span><span>Esc to close</span></div>
      </div>
    </div>
  )
}
