'use client'
// Market map: a dotted world map (static SVG image) with a pin per market.
// Picking a market shows what it watches, where it shops and its local manager.
// No time zones, no gradients, real flags, logos only for Instagram / TikTok / YouTube.
import { useState } from 'react'
import Link from 'next/link'
import { href } from '@/data/site'
import { MARKETS, REGIONS, LOGO_PLATFORMS } from '@/data/markets'
import { categoryBySlug } from '@/data/categories'
import { project } from '@/data/mapView'
import { Flag, PlatformIcon, Arrow, Icon } from './Icon'
import { track } from '@/lib/track'

// label side per pin so neighbours don't overlap
const SIDE: Record<string, string> = { kr: 'tr', jp: 'r', cn: 'l', vn: 'l', th: 'tl', id: 'b', ph: 'r', us: 'l', mx: 'b', br: 'r', eu: 't' }

export default function MarketMap({ lang, initial = 'vn' }: { lang: string; initial?: string }) {
  const [active, setActive] = useState(initial)
  const m = MARKETS.find((x) => x.id === active)!
  const pick = (id: string) => { setActive(id); track('market_selected', { market: id }) }

  return (
    <div className="mm">
      <div className="mm__tabs scroller" role="tablist" aria-label="Markets">
        {MARKETS.map((x) => (
          <button key={x.id} role="tab" aria-selected={x.id === active} className="chip" aria-pressed={x.id === active} onClick={() => pick(x.id)}>
            <Flag market={x.id} />{x.short}
          </button>
        ))}
      </div>

      <div className="mm__body">
        <div className="mm__map"><div className="mm__stage">
          <img src="/map-dots.svg" alt="" width={364} height={118} loading="lazy" decoding="async" />
          {MARKETS.map((x) => {
            const p = project(x.lat, x.lon)
            return (
              <button key={x.id} className={`mm__pin mm__pin--${SIDE[x.id] || 'r'} ${x.id === active ? 'is-on' : ''}`} style={{ left: `${p.left}%`, top: `${p.top}%` }}
                onClick={() => pick(x.id)} aria-label={`${x.name}: show market details`} aria-pressed={x.id === active}>
                <i /><span>{x.short}</span>
              </button>
            )
          })}
          {REGIONS.map((r) => {
            const p = project(r.lat, r.lon)
            return <Link key={r.id} className="mm__region" style={{ left: `${p.left}%`, top: `${p.top}%` }} href={href(lang, '/about-agency#inquiry')} data-cta={`map_region_${r.id}`} prefetch={false}>{r.name}</Link>
          })}
        </div></div>

        <article className="mm__card" aria-live="polite">
          <header>
            <Flag market={m.id} />
            <div>
              <h3 className="h3">{m.name}</h3>
              <p className="small muted">{m.city} · {m.langs.join(', ')}</p>
            </div>
          </header>
          <div className="mm__row">
            <h4>What it watches</h4>
            <ol>
              {m.watches.map((p, i) => (
                <li key={p}><small>{i + 1}</small>{LOGO_PLATFORMS.includes(p) ? <PlatformIcon name={p} size={15} /> : null}{p}</li>
              ))}
            </ol>
          </div>
          <div className="mm__row">
            <h4>Where it shops</h4>
            <ul className="mm__shops">{m.shops.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="mm__row">
            <h4>Strongest categories</h4>
            <p>{m.strong.map((s) => categoryBySlug[s].label).join(' · ')}</p>
          </div>
          <div className="mm__mgr">
            <span className="mm__photo" role="img" aria-label="TODO: real photo of the local manager"><Icon name="user" size={18} /></span>
            <div><b>{m.manager.role}</b><small>Local manager · photo TODO: real photo</small></div>
          </div>
          <div className="mm__cta">
            <Link className="btn btn--block" href={href(lang, `/creators/${m.slug}`)} data-cta="map_search_creators_in_country" prefetch={false}>Search creators in {m.short}<Arrow /></Link>
            <Link className="tlink" href={href(lang, `/markets/${m.slug}`)} data-cta="map_market_page" prefetch={false}>Influencer marketing in {m.name}<Arrow size={15} /></Link>
          </div>
        </article>
      </div>
    </div>
  )
}
