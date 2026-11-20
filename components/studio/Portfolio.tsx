'use client'
// Portfolio carousel with KR / JP / EN tabs. Tiles are flat placeholders until real videos
// (poster + lazy load, never autoplay) are added. The admin controls are a mock of what
// admins get: add, reorder and hide items per market.
import { useRef, useState } from 'react'
import { PORTFOLIO, type PortfolioItem } from '@/data/portfolio'
import { Icon } from '@/components/Icon'
import { track } from '@/lib/track'

const TABS: { id: PortfolioItem['market']; label: string }[] = [{ id: 'KR', label: 'Korea' }, { id: 'JP', label: 'Japan' }, { id: 'EN', label: 'English' }]

export default function Portfolio({ orderHref }: { orderHref?: string }) {
  const [tab, setTab] = useState<PortfolioItem['market']>('KR')
  const [items, setItems] = useState(PORTFOLIO.map((p) => ({ ...p, hidden: false })))
  const [admin, setAdmin] = useState(false)
  const rail = useRef<HTMLDivElement>(null)
  const list = items.filter((p) => p.market === tab && (admin || !p.hidden))

  const move = (id: string, dir: -1 | 1) => setItems((all) => {
    const same = all.filter((p) => p.market === tab)
    const i = same.findIndex((p) => p.id === id), j = i + dir
    if (j < 0 || j >= same.length) return all
    const a = all.indexOf(same[i]), b = all.indexOf(same[j])
    const next = [...all]; [next[a], next[b]] = [next[b], next[a]]
    return next
  })
  const toggle = (id: string) => setItems((all) => all.map((p) => (p.id === id ? { ...p, hidden: !p.hidden } : p)))
  const add = () => setItems((all) => [...all, { id: `${tab}-new-${all.length}`, market: tab, title: 'New portfolio video', type: 'Short', length: '0:00', tone: all.length % 8, note: 'Added in admin (mock)', hidden: false }])
  const scroll = (dir: number) => rail.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })

  return (
    <div className="st-pf">
      <div className="st-pf__bar">
        <div className="st-seg" role="group" aria-label="Portfolio market">
          {TABS.map((t) => (
            <button key={t.id} aria-pressed={tab === t.id} onClick={() => { setTab(t.id); track('portfolio_tab', { market: t.id }) }} data-cta="studio_portfolio_tab">{t.id} <span>{t.label}</span></button>
          ))}
        </div>
        <div className="st-pf__nav">
          <button className="st-pf__admin" aria-pressed={admin} onClick={() => setAdmin(!admin)} data-cta="studio_portfolio_admin_toggle"><Icon name="settings" size={14} />Admin view (mock)</button>
          <button className="st-pf__arrow" onClick={() => scroll(-1)} aria-label="Previous videos"><Icon name="arrow" size={17} className="st-flip" /></button>
          <button className="st-pf__arrow" onClick={() => scroll(1)} aria-label="Next videos"><Icon name="arrow" size={17} /></button>
        </div>
      </div>

      <div className="st-pf__rail" ref={rail} tabIndex={0} aria-label={`${tab} portfolio videos`}>
        {list.map((p, i) => (
          <figure key={p.id} className={`st-pf__item ${p.hidden ? 'is-hidden' : ''}`}>
            <div className={`st-pf__tile tone-${p.tone} ${p.type === 'Long' ? 'st-pf__tile--long' : ''}`} role="img" aria-label={`${p.title} — TODO: real video`}>
              <span className="st-pf__len">{p.length}</span>
              <b lang={tab === 'KR' ? 'ko' : tab === 'JP' ? 'ja' : 'en'}>{p.title}</b>
              <span className="st-pf__play"><Icon name="play" size={16} stroke={2} /></span>
              <small>TODO: real video</small>
            </div>
            <figcaption><span className="tag">{p.type}</span>{p.note}</figcaption>
            {admin && (
              <div className="st-pf__ctl" role="group" aria-label={`Admin controls for ${p.title}`}>
                <button onClick={() => move(p.id, -1)} disabled={i === 0} aria-label="Move earlier"><Icon name="arrow" size={14} className="st-flip" /></button>
                <button onClick={() => move(p.id, 1)} disabled={i === list.length - 1} aria-label="Move later"><Icon name="arrow" size={14} /></button>
                <button onClick={() => toggle(p.id)}><Icon name="eye" size={14} />{p.hidden ? 'Show' : 'Hide'}</button>
              </div>
            )}
          </figure>
        ))}
        {admin && (
          <button className="st-pf__add" onClick={add} data-cta="studio_portfolio_admin_add"><Icon name="plus" size={20} />Add a video to {tab}</button>
        )}
        {!admin && orderHref ? (
          <a className="st-pf__end" href={orderHref} data-cta="studio_portfolio_end_order">
            <span className="st-pf__play"><Icon name="plus" size={16} stroke={2} /></span>
            <b>Your video next</b>
            <small>Send raw footage, get an edit cut for {TABS.find((t) => t.id === tab)!.label}.</small>
            <span className="st-pf__end-go">Order a video<Icon name="arrow" size={15} /></span>
          </a>
        ) : null}
      </div>
      {admin && <p className="small muted">Admin view is a mock: changes stay in this browser tab. Hidden items are dimmed here and not shown to visitors.</p>}
    </div>
  )
}
