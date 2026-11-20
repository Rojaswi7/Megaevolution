'use client'
// Mock forms. They validate, show a success state and fire track() — nothing is sent anywhere.
import { useState } from 'react'
import { Icon, Arrow } from './Icon'
import { track } from '@/lib/track'
import { MARKETS } from '@/data/markets'

export function NewsletterForm({ source, label = 'Work email', cta = 'Subscribe' }: { source: string; label?: string; cta?: string }) {
  const [done, setDone] = useState(false)
  if (done) return <p className="form-ok" role="status"><Icon name="check" />You’re on the list. The next market report lands in your inbox.</p>
  return (
    <form className="nl" onSubmit={(e) => { e.preventDefault(); setDone(true); track('form_submitted', { form: 'newsletter', source }) }}>
      <label className="sr" htmlFor={`nl-${source}`}>{label}</label>
      <input id={`nl-${source}`} className="input" type="email" required placeholder={label} autoComplete="email" />
      <button className="btn" data-cta={`newsletter_${source}`}>{cta}</button>
    </form>
  )
}

export function WaitlistForm({ source, cta = 'Join the waitlist' }: { source: string; cta?: string }) {
  const [done, setDone] = useState(false)
  if (done) return <p className="form-ok" role="status"><Icon name="check" />You’re on the waitlist. We’ll email you before anyone else.</p>
  return (
    <form className="nl" onSubmit={(e) => { e.preventDefault(); setDone(true); track('form_submitted', { form: 'waitlist', source }) }}>
      <label className="sr" htmlFor={`wl-${source}`}>Work email</label>
      <input id={`wl-${source}`} className="input" type="email" required placeholder="Work email" autoComplete="email" />
      <button className="btn" data-cta={`waitlist_${source}`}>{cta}</button>
    </form>
  )
}

/** The one agency inquiry form. Short on purpose: budget and timing are optional, no brief needed. */
export function InquiryForm({ source = 'agency', market }: { source?: string; market?: string }) {
  const [done, setDone] = useState(false)
  if (done) {
    return (
      <div className="form-ok" role="status" style={{ display: 'grid', gap: 6 }}>
        <strong style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="check" />Thanks — your request is in.</strong>
        <span>A campaign manager replies within one business day with two or three options and rough costs. Nothing is charged, and you don’t need a brief.</span>
      </div>
    )
  }
  return (
    <form className="stack" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); setDone(true); track('form_submitted', { form: 'agency_inquiry', source, market: String(f.get('market') || ''), has_budget: !!f.get('budget'), has_timing: !!f.get('timing') }) }}>
      <div className="grid-2">
        <label className="field"><span>Your name</span><input className="input" name="name" required autoComplete="name" /></label>
        <label className="field"><span>Work email</span><input className="input" name="email" type="email" required autoComplete="email" /></label>
      </div>
      <div className="grid-2">
        <label className="field"><span>Company or brand</span><input className="input" name="company" required autoComplete="organization" /></label>
        <label className="field"><span>Market you want to reach</span>
          <select className="select" name="market" defaultValue={market || ''}>
            <option value="">Not sure yet</option>
            {MARKETS.map((m) => <option key={m.id} value={m.slug}>{m.name}</option>)}
            <option value="middle-east">Middle East</option><option value="latin-america">Latin America</option><option value="several">Several markets</option>
          </select>
        </label>
      </div>
      <div className="grid-2">
        <label className="field"><span>Budget <small>(optional)</small></span>
          <select className="select" name="budget" defaultValue=""><option value="">Prefer to discuss</option><option>Under $5,000</option><option>$5,000 – $20,000</option><option>$20,000 – $50,000</option><option>$50,000+</option></select>
        </label>
        <label className="field"><span>Timing <small>(optional)</small></span>
          <select className="select" name="timing" defaultValue=""><option value="">Flexible</option><option>This month</option><option>In 1–3 months</option><option>Later this year</option></select>
        </label>
      </div>
      <label className="field"><span>Anything we should know? <small>(optional — no brief needed)</small></span><textarea className="textarea" name="note" placeholder="Product, goal, or a link is plenty." /></label>
      <div className="row">
        <button className="btn btn--lg" data-cta={`inquiry_submit_${source}`}>Explore your campaign options<Arrow /></button>
        <span className="small muted">Free, no commitment. Reply within one business day.</span>
      </div>
    </form>
  )
}
