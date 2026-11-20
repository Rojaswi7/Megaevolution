'use client'
// Every market side by side: filter by region or by a category it is strong in.
// Matching rows stay in place and the rest dim, so the comparison keeps its shape.
import Link from 'next/link'
import { useState } from 'react'
import { href } from '@/data/site'
import { MARKETS, LOGO_PLATFORMS } from '@/data/markets'
import { CATEGORIES, categoryBySlug } from '@/data/categories'
import { Flag, PlatformIcon, Arrow } from '../Icon'
import { track } from '@/lib/track'

const REGION_OF: Record<string, string> = { kr: 'East Asia', jp: 'East Asia', cn: 'East Asia', vn: 'Southeast Asia', th: 'Southeast Asia', id: 'Southeast Asia', ph: 'Southeast Asia', us: 'Americas', mx: 'Americas', br: 'Americas', eu: 'Europe' }
const REGION_NAMES = ['East Asia', 'Southeast Asia', 'Americas', 'Europe']

export default function MarketCompare({ lang }: { lang: string }) {
  const [region, setRegion] = useState('')
  const [cat, setCat] = useState('')
  const hit = (m: (typeof MARKETS)[number]) => (!region || REGION_OF[m.id] === region) && (!cat || m.strong.includes(cat))
  const count = MARKETS.filter(hit).length
  const pickRegion = (r: string) => { setRegion(r); track('filter_changed', { region: r || 'all', source: 'markets_compare' }) }
  const pickCat = (c: string) => { setCat(c); track('filter_changed', { category: c || 'any', source: 'markets_compare' }) }

  return (
    <div className="mc">
      <div className="mc__bar">
        <div className="mc__seg" role="group" aria-label="Region">
          {['', ...REGION_NAMES].map((r) => <button key={r || 'all'} aria-pressed={region === r} onClick={() => pickRegion(r)}>{r || 'All regions'}</button>)}
        </div>
        <div className="mc__cats" role="group" aria-label="Strong in">
          <span>Strong in</span>
          {CATEGORIES.map((c) => <button key={c.slug} aria-pressed={cat === c.slug} onClick={() => pickCat(cat === c.slug ? '' : c.slug)}>{c.label}</button>)}
        </div>
      </div>
      <p className="mc__count" aria-live="polite"><b>{count}</b> of {MARKETS.length} markets{region ? ` in ${region}` : ''}{cat ? `, strong in ${categoryBySlug[cat].label}` : ''}</p>

      <div className="mc__table" role="table" aria-label="Markets compared">
        <div className="mc__row mc__row--head" role="row">
          <span role="columnheader">Market</span><span role="columnheader">Most watched</span><span role="columnheader">Shops on</span><span role="columnheader">Strong in</span><span role="columnheader">Big seasons</span><span role="columnheader" className="sr">Open</span>
        </div>
        {MARKETS.map((m) => (
          <div key={m.id} role="row" className={`mc__row ${hit(m) ? '' : 'is-dim'}`}>
            <span role="cell" className="mc__name">
              <Flag market={m.id} />
              <span><Link href={href(lang, `/markets/${m.slug}`)} data-cta="markets_compare_row" prefetch={false}>{m.name}</Link><small>{REGION_OF[m.id]} · {m.langs.slice(0, 2).join(', ')}</small></span>
            </span>
            <span role="cell" className="mc__watch">
              {m.watches.slice(0, 3).map((p, i) => <span key={p}><i>{i + 1}</i>{LOGO_PLATFORMS.includes(p) ? <PlatformIcon name={p} size={14} /> : null}{p}</span>)}
            </span>
            <span role="cell" className="mc__shops">{m.shops.slice(0, 3).join(' · ')}</span>
            <span role="cell" className="mc__strong">{m.strong.map((s) => <em key={s} className={cat === s ? 'is-hit' : ''}>{categoryBySlug[s]?.label ?? s}</em>)}</span>
            <span role="cell" className="mc__season">{m.season}</span>
            <span role="cell" className="mc__go" aria-hidden="true"><Arrow size={16} /></span>
          </div>
        ))}
      </div>
    </div>
  )
}
