'use client'
// Short-form posts from creators we work with. The centre slot is featured; arrows and dots move it.
// Slots are placeholders until admins add real videos (poster + lazy load, never autoplay with sound).
import { useState } from 'react'
import { Icon } from '../Icon'
import { track } from '@/lib/track'

const SLOTS = [
  { market: 'Vietnam', handle: '@minh.beauty', tone: 3 },
  { market: 'Korea', handle: '@seoyeon.glow', tone: 7 },
  { market: 'Japan', handle: '@sakura.games', tone: 2 },
  { market: 'Philippines', handle: '@pia.fits', tone: 5 },
  { market: 'Thailand', handle: '@ning.vlogs', tone: 1 },
  { market: 'Indonesia', handle: '@bima.eats', tone: 6 },
]

export default function CreatorShorts() {
  const [on, setOn] = useState(2)
  const go = (i: number) => { const n = (i + SLOTS.length) % SLOTS.length; setOn(n); track('cta_click', { cta: 'agency_shorts_slot', slot: n + 1 }) }
  return (
    <div className="ag2-shorts">
      <ul className="ag2-shorts__rail" aria-label="Creator videos">
        {SLOTS.map((s, i) => {
          const d = Math.min(Math.abs(i - on), SLOTS.length - Math.abs(i - on))
          return (
            <li key={s.handle} className={`tone-${s.tone} ${i === on ? 'is-on' : ''} ${d > 2 ? 'is-far' : ''}`} aria-current={i === on || undefined}>
              <button onClick={() => go(i)} aria-label={`Play ${s.handle}, ${s.market} (sample)`}>
                <span className="ag2-shorts__tag">Sample</span>
                <span className="ag2-shorts__play"><Icon name="play" size={18} stroke={2.2} /></span>
                <span className="ag2-shorts__cap"><b>{s.handle}</b>{s.market} · TODO: real video</span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="ag2-shorts__ctl">
        <button className="ag2-round" onClick={() => go(on - 1)} aria-label="Previous video"><Icon name="arrow" size={17} className="st-flip" /></button>
        <div className="ag2-shorts__dots" role="group" aria-label="Choose a video">
          {SLOTS.map((s, i) => <button key={s.handle} aria-label={`Video ${i + 1}`} aria-pressed={i === on} onClick={() => go(i)} />)}
        </div>
        <button className="ag2-round" onClick={() => go(on + 1)} aria-label="Next video"><Icon name="arrow" size={17} /></button>
      </div>
    </div>
  )
}
