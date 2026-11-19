'use client'
// "What we do for brands" — five tiles that grow and shrink around the active one.
// It advances on its own, pauses on hover, and stops for reduced motion.
// Ported from the earlier mockup onto the new tokens (flat colour blocks, no gradients).
import { useEffect, useState } from 'react'
import '@/styles/sections.css'
import { Icon } from '../Icon'
import { SectionHead, Cta } from '../ui'
import { track } from '@/lib/track'

const ITEMS = [
  { t: 'Creator discovery', d: 'Shortlists by market, category and real rate.', icon: 'search', tone: 6 },
  { t: 'Localised briefs', d: 'Your message, rewritten by someone who lives there.', icon: 'pen', tone: 0 },
  { t: 'Campaign management', d: 'Booking, contracts, approvals and timelines.', icon: 'users', tone: 1 },
  { t: 'Content & usage rights', d: 'Native videos you can reuse in ads, rights agreed up front.', icon: 'film', tone: 4 },
  { t: 'Reporting', d: 'One view of every market, so you can see what actually sold.', icon: 'chart', tone: 5 },
]
// size by distance from the active tile: [flex-grow, height %]
const SIZES = [[2.9, 100], [2.05, 74], [1.4, 55], [1.05, 42], [0.85, 34]]

export default function ServicesFan({ lang }: { lang: string }) {
  const [active, setActive] = useState(2)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setActive((a) => (a + 1) % ITEMS.length), 3600)
    return () => clearInterval(t)
  }, [paused])

  const pick = (k: number, by: 'click' | 'hover') => { setActive(k); if (by === 'click') track('services_fan_select', { service: ITEMS[k].t }) }

  return (
    <section className="wrap sec fan-sec" aria-labelledby="h-fan">
      <SectionHead eyebrow="Services" title="What we do|for brands" center id="h-fan">From the first brief to the last report.</SectionHead>
      <div className="fan" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {ITEMS.map((it, k) => {
          const [grow, h] = SIZES[Math.abs(k - active)]
          return (
            <button key={it.t} type="button" className={`fan__item ${k === active ? 'is-on' : ''}`} style={{ flexGrow: grow, ['--h' as any]: `${h}%` }}
              aria-pressed={k === active} onMouseEnter={() => pick(k, 'hover')} onFocus={() => pick(k, 'hover')} onClick={() => pick(k, 'click')} data-cta="services_fan_tile">
              <span className={`fan__tile tone-${it.tone}`}>
                <span className="fan__n">0{k + 1}</span>
                <Icon name={it.icon} size={26} />
              </span>
              <span className="fan__label">{it.t}</span>
            </button>
          )
        })}
      </div>
      <p className="fan__desc" aria-live="polite">{ITEMS[active].d}</p>
      <ul className="sr">{ITEMS.map((it) => <li key={it.t}>{it.t}: {it.d}</li>)}</ul>
      <div className="fan__cta"><Cta lang={lang} to="/about-agency#inquiry" cta="services_fan_explore_options">Explore your campaign options</Cta></div>
    </section>
  )
}
