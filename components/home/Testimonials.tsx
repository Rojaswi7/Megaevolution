'use client'
// Scrollable testimonials after Proof: drag, swipe or use the arrows. Snap scrolling, no autoplay.
import Link from 'next/link'
import { useRef } from 'react'
import { href } from '@/data/site'
import { TESTIMONIALS } from '@/data/testimonials'
import { Icon } from '../Icon'
import { track } from '@/lib/track'

export default function Testimonials({ lang }: { lang: string }) {
  const row = useRef<HTMLUListElement>(null)
  const move = (dir: 1 | -1) => {
    const el = row.current
    if (!el) return
    const card = el.querySelector('li') as HTMLElement | null
    el.scrollBy({ left: dir * ((card?.offsetWidth || 400) + 16), behavior: 'smooth' })
    track('cta_click', { cta: 'testimonials_scroll', dir })
  }
  return (
    <div className="tm">
      <div className="tm__head">
        <p className="eyebrow">What clients say</p>
        <div className="tm__nav">
          <button onClick={() => move(-1)} aria-label="Previous testimonials"><Icon name="arrow" size={18} className="tm__flip" /></button>
          <button onClick={() => move(1)} aria-label="More testimonials"><Icon name="arrow" size={18} /></button>
        </div>
      </div>
      <ul className="tm__row" ref={row} aria-label="Testimonials">
        {TESTIMONIALS.map((t, i) => (
          <li key={i} className={`tm__card tone-${t.tone} ${t.sample ? 'is-sample' : ''}`}>
            <span className="tm__mark" aria-hidden="true">“</span>
            <blockquote>{t.quote}</blockquote>
            <div className="tm__foot">
              <span className="tm__who"><b>{t.who}</b><small>{t.org}</small></span>
              {t.result ? <span className="tm__res">{t.result}</span> : null}
              {t.sample ? <span className="tm__sample">Sample · replace</span> : null}
            </div>
            {t.caseSlug ? <Link className="tm__link" href={href(lang, `/case-studies/${t.caseSlug}`)} data-cta="testimonial_case" prefetch={false} aria-label={`Read the ${t.org} case`} /> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
