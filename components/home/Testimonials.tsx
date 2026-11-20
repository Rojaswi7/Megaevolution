'use client'
// Testimonials band: cards drift sideways on their own and stop while the pointer is over them.
// Arrows nudge the row for people who prefer to click. Reduced motion: no drift, plain scroll.
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { href } from '@/data/site'
import { TESTIMONIALS, type Testimonial } from '@/data/testimonials'
import { Icon } from '../Icon'
import { track } from '@/lib/track'

function Card({ t, lang, hidden }: { t: Testimonial; lang: string; hidden?: boolean }) {
  return (
    <li className="tq__card" aria-hidden={hidden || undefined}>
      <span className="tq__cat">{t.category}</span>
      <blockquote>“{t.quote}”</blockquote>
      <p className="tq__res">{t.result}</p>
      <p className="tq__who"><span className="tq__av">{t.initial}</span><b>{t.brand}</b><span>· {t.role}</span></p>
      {t.caseSlug && !hidden ? <Link className="tq__link" href={href(lang, `/case-studies/${t.caseSlug}`)} data-cta="testimonial_case" prefetch={false} aria-label={`Read the ${t.brand} case`} /> : null}
    </li>
  )
}

export default function Testimonials({ lang }: { lang: string }) {
  const row = useRef<HTMLDivElement>(null)
  const paused = useRef(false)

  useEffect(() => {
    const el = row.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let last = performance.now()
    const step = (now: number) => {
      const dt = now - last
      last = now
      if (!paused.current) {
        el.scrollLeft += dt * 0.04
        // the list is rendered twice; jump back by one copy so the loop has no seam
        const half = el.scrollWidth / 2
        if (el.scrollLeft >= half) el.scrollLeft -= half
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  const nudge = (dir: 1 | -1) => {
    const el = row.current
    if (!el) return
    const card = el.querySelector('li') as HTMLElement | null
    el.scrollBy({ left: dir * ((card?.offsetWidth || 560) + 20), behavior: 'smooth' })
    track('cta_click', { cta: 'testimonials_scroll', dir })
  }
  const items = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <div className="tq on-dark">
      <div className="wrap tq__head">
        <p className="eyebrow eyebrow--plain">What clients say</p>
        <div className="tq__nav">
          <button onClick={() => nudge(-1)} aria-label="Previous testimonials"><Icon name="chevronRight" size={18} className="tq__flip" /></button>
          <button onClick={() => nudge(1)} aria-label="More testimonials"><Icon name="chevronRight" size={18} /></button>
        </div>
      </div>
      <div className="tq__view" ref={row}
        onMouseEnter={() => { paused.current = true }} onMouseLeave={() => { paused.current = false }}
        onFocus={() => { paused.current = true }} onBlur={() => { paused.current = false }}
        onTouchStart={() => { paused.current = true }} onTouchEnd={() => { paused.current = false }}>
        <ul className="tq__row" aria-label="Testimonials">
          {[...items, ...items].map((t, i) => <Card key={i} t={t} lang={lang} hidden={i >= TESTIMONIALS.length} />)}
        </ul>
      </div>
    </div>
  )
}
