'use client'
// Video Editing Studio: drag the handle to compare the raw clip with the edit.
// Under it, the edit's timeline (cuts, captions, music) so the work is visible.
// Placeholders until real sample videos are supplied (poster + lazy load, no autoplay with sound).
import { useState } from 'react'
import { Icon } from '../Icon'
import { track } from '@/lib/track'

export default function BeforeAfter() {
  const [x, setX] = useState(52)
  return (
    <div className="ba">
      <div className="ba__frame" style={{ ['--x' as any]: `${x}%` }}>
        <div className="ba__after" role="img" aria-label="After: edited video — TODO: real sample video">
          <span className="ba__tag ba__tag--r">After · 00:21</span>
          <p>3 things I’d<br />buy again</p>
          <span className="ba__sub">and one I wouldn’t</span>
          <span className="ba__prog"><i /></span>
        </div>
        <div className="ba__before" role="img" aria-label="Before: raw clip — TODO: real sample video">
          <span className="ba__tag">Before · 00:47</span>
          <span className="ba__raw">RAW_0412.MOV</span>
        </div>
        <span className="ba__handle" aria-hidden="true"><Icon name="arrow" size={14} className="ba__flip" /><Icon name="arrow" size={14} /></span>
        <input className="ba__range" type="range" min={4} max={96} value={x} aria-label="Compare before and after"
          onChange={(e) => setX(Number(e.target.value))} onPointerUp={() => track('cta_click', { cta: 'studio_before_after_drag', at: x })} />
      </div>
      <div className="ba__tl" aria-hidden="true">
        <div><span>Cuts</span><p className="ba__cuts"><i /><i /><i /><i /><i /><i /><i /></p></div>
        <div><span>Captions</span><p className="ba__caps"><i /><i /><i /><i /></p></div>
        <div><span>Music</span><p className="ba__music"><i /></p></div>
      </div>
    </div>
  )
}
