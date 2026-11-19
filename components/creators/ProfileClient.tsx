'use client'
// Interactive parts of the creator profile: the rate card with the mock order flow,
// and the audience panel with its daily view limit.
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { href } from '@/data/site'
import type { Package, Audience } from '@/data/rates'
import { ANALYTICS_LIMITS, STUDIO, formatAmount, isTBD } from '@/data/pricing'
import { accountByRole } from '@/data/accounts'
import { localMoney } from '@/lib/format'
import { Icon, Arrow, PlatformIcon } from '../Icon'
import { Money } from '../Money'
import { useApp } from '../AppState'
import { track } from '@/lib/track'

/* ---------------- My Rates + order flow ---------------- */

type Step = 'pick' | 'account' | 'pay' | 'done' | 'brief' | 'sent'

export function RateCard({ lang, handle, name, currency, packages }: { lang: string; handle: string; name: string; currency: string; packages: Package[] }) {
  const { role, setRole, currency: viewCur } = useApp()
  const [sel, setSel] = useState(packages.find((p) => p.popular)?.id || packages[0].id)
  const [step, setStep] = useState<Step>('pick')
  const [edit, setEdit] = useState(false)
  const pkg = packages.find((p) => p.id === sel)!
  const brand = accountByRole.brand
  const first = name.split(' ')[0]

  const start = () => { track('checkout_started', { type: 'creator_package', handle, package: pkg.id, usd: pkg.priceUsd }); setStep(role === 'guest' ? 'account' : 'pay') }
  const pay = (e: React.FormEvent) => { e.preventDefault(); track('checkout_completed', { type: 'creator_package', handle, package: pkg.id, usd: pkg.priceUsd, editing_addon: edit }); setStep('done') }
  const close = () => setStep('pick')

  return (
    <div className="cr-rates" id="rates">
      <div className="cr-rates__head">
        <h2 className="h3">My Rates</h2>
        <span className="small muted">Prices in {currency}{currency !== viewCur ? `, shown in ${viewCur} too` : ''}</span>
      </div>
      <div className="cr-rates__list" role="radiogroup" aria-label={`Packages from ${name}`}>
        {packages.map((p) => (
          <label key={p.id} className={`cr-pkg ${p.id === sel ? 'is-on' : ''}`}>
            <input type="radio" name="pkg" className="sr" checked={p.id === sel} onChange={() => { setSel(p.id); track('package_selected', { handle, package: p.id }) }} />
            <span className="cr-pkg__dot" aria-hidden="true" />
            <span className="cr-pkg__t">
              <b><PlatformIcon name={p.platform} size={14} />{p.name}{p.popular ? <i className="tag tag--accent">Most ordered</i> : null}</b>
              <small>{p.detail}</small>
            </span>
            <span className="cr-pkg__p"><b>{localMoney(p.priceLocal, currency)}</b>{currency !== 'USD' || viewCur !== 'USD' ? <small>≈ <Money usd={p.priceUsd} /></small> : null}</span>
          </label>
        ))}
      </div>

      <label className="cr-addon">
        <input type="checkbox" checked={edit} onChange={(e) => { setEdit(e.target.checked); track('cta_click', { cta: 'profile_editing_addon', checked: e.target.checked }) }} />
        <span><b>Need this creator’s video edited?</b> Add editing from {formatAmount(STUDIO.addOnFrom, viewCur)}. Our Studio cuts ad versions from the raw footage.</span>
      </label>

      <button className="btn btn--lg btn--block" onClick={start} data-cta="profile_order_package">Order a package<Arrow /></button>
      <ul className="trust">
        <li><Icon name="lock" size={16} />Secure card checkout</li>
        <li><Icon name="refresh" size={16} />Revisions included ({isTBD(STUDIO.freeRevisions) ? 'number TBD' : STUDIO.freeRevisions})</li>
        <li><Icon name="clock" size={16} />Draft delivery date agreed before you pay</li>
        <li><Icon name="shield" size={16} />{STUDIO.refundNote}</li>
      </ul>

      {step !== 'pick' && (
        <div className="cmdk" role="dialog" aria-modal="true" aria-label={`Order from ${name}`} onMouseDown={(e) => { if (e.target === e.currentTarget) close() }}>
          <div className="cmdk__box cr-order">
            <div className="cr-order__top">
              <ol className="wsteps cr-order__steps">
                {['Account', 'Payment', 'Brief'].map((s, i) => { const at = step === 'account' ? 0 : step === 'pay' ? 1 : 2; return <li key={s} className={i < at ? 'is-done' : i === at ? 'is-now' : ''}>{s}</li> })}
              </ol>
              <button className="hdr__icon" onClick={close} aria-label="Close"><Icon name="close" /></button>
            </div>

            <div className="cr-order__sum">
              <span><b>{pkg.name}</b><small>@{handle}{edit ? ' · with Studio editing' : ''}</small></span>
              <span className="cr-pkg__p"><b>{localMoney(pkg.priceLocal, currency)}</b><small>≈ <Money usd={pkg.priceUsd} /></small></span>
            </div>

            {step === 'account' && (
              <div className="stack">
                <h3 className="h3">Sign in to order</h3>
                <p className="muted small">This is a mockup. Use the dummy brand account — nothing is sent anywhere.</p>
                <button className="btn btn--block" data-cta="order_continue_dummy_brand" onClick={() => { setRole('brand'); track('login', { role: 'brand', via: 'order_flow' }); setStep('pay') }}>
                  Continue as {brand.name} (brand, dummy)<Arrow />
                </button>
                <Link className="btn btn--ghost btn--block" href={href(lang, '/signup?as=brand&from=order')} data-cta="order_signup">Create a free brand account</Link>
              </div>
            )}

            {step === 'pay' && (
              <form className="stack" onSubmit={pay}>
                <h3 className="h3">Payment</h3>
                <label className="field"><span>Card number</span><input className="input" inputMode="numeric" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" aria-describedby="cr-mock" /></label>
                <div className="grid-2">
                  <label className="field"><span>Expiry</span><input className="input" placeholder="MM / YY" defaultValue="12 / 28" /></label>
                  <label className="field"><span>CVC</span><input className="input" placeholder="123" defaultValue="123" /></label>
                </div>
                <p className="wnote" id="cr-mock"><Icon name="lock" size={15} />Mock checkout. No card is charged and nothing leaves this page.</p>
                <button className="btn btn--lg btn--block" data-cta="order_pay">Pay {localMoney(pkg.priceLocal, currency)}<Arrow /></button>
                <ul className="trust">
                  <li><Icon name="shield" size={16} />{STUDIO.refundNote}</li>
                </ul>
              </form>
            )}

            {step === 'done' && (
              <div className="stack">
                <p className="form-ok"><Icon name="check" />Order placed. Receipt sent to {brand.email}.</p>
                <h3 className="h3">Now send {first} your brief</h3>
                <p className="muted small">A few lines are enough. You can add files and edit it later from My orders.</p>
                <button className="btn btn--block" onClick={() => setStep('brief')} data-cta="order_write_brief">Write the brief<Arrow /></button>
              </div>
            )}

            {step === 'brief' && (
              <form className="stack" onSubmit={(e) => { e.preventDefault(); track('brief_submitted', { type: 'creator_package', handle }); setStep('sent') }}>
                <h3 className="h3">Brief for {first}</h3>
                <label className="field"><span>What should the video get across?</span><textarea className="textarea" required placeholder="Product, the one thing to say, anything to avoid." /></label>
                <button type="button" className="wdrop" data-cta="order_brief_upload"><Icon name="upload" />Add files (product shots, guidelines)</button>
                <button className="btn btn--block" data-cta="order_send_brief">Send brief<Arrow /></button>
              </form>
            )}

            {step === 'sent' && (
              <div className="stack">
                <p className="form-ok"><Icon name="check" />Brief sent. You’ll be notified when {first} accepts.</p>
                <Link className="btn btn--block" href={href(lang, '/preview/brand?tab=orders')} data-cta="order_go_to_orders">Go to My orders<Arrow /></Link>
                <div className="cr-cross">
                  <b>Running this in more than one country?</b>
                  <span>A manager can cast, contract and report across markets for you.</span>
                  <Link className="tlink" href={href(lang, '/about-agency')} data-cta="order_cross_sell_agency">Explore your campaign options<Arrow size={15} /></Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------- Audience analytics with the daily limit ---------------- */

const today = () => new Date().toISOString().slice(0, 10)

export function AudiencePanel({ lang, handle, audience }: { lang: string; handle: string; audience: Audience }) {
  const { role, ready } = useApp()
  const [state, setState] = useState<'loading' | 'open' | 'locked'>('loading')
  const [used, setUsed] = useState(0)
  const limit = role === 'guest' ? ANALYTICS_LIMITS.loggedOut : ANALYTICS_LIMITS.verifiedBrand

  useEffect(() => {
    if (!ready) return
    let seen: string[] = []
    const key = `me.audience.${today()}`
    try { seen = JSON.parse(localStorage.getItem(key) || '[]') } catch {}
    if (seen.includes(handle)) { setUsed(seen.length); setState('open'); return }
    if (seen.length < limit) {
      seen.push(handle)
      try { localStorage.setItem(key, JSON.stringify(seen)) } catch {}
      setUsed(seen.length); setState('open'); track('audience_viewed', { handle, used: seen.length, limit })
    } else { setUsed(seen.length); setState('locked'); track('gate_shown', { gate: 'audience_analytics', handle, limit }) }
  }, [ready, role, handle, limit])

  const body = (
    <div className="cr-aud__grid">
      <div>
        <h3>Gender</h3>
        <div className="cr-split" role="img" aria-label={audience.gender.map(([k, v]) => `${k} ${v}%`).join(', ')}>
          <i style={{ width: `${audience.gender[0][1]}%` }} /><i style={{ width: `${audience.gender[1][1]}%` }} />
        </div>
        <ul className="cr-legend">{audience.gender.map(([k, v]) => <li key={k}><b>{v}%</b>{k}</li>)}</ul>
      </div>
      <div>
        <h3>Age</h3>
        <ul className="cr-bars">{audience.age.map(([k, v]) => <li key={k}><span>{k}</span><div className="wbar"><i style={{ width: `${v * 2}%` }} /></div><b>{v}%</b></li>)}</ul>
      </div>
      <div>
        <h3>Where followers live</h3>
        <ul className="cr-bars">{audience.countries.map(([k, v]) => <li key={k}><span>{k}</span><div className="wbar"><i style={{ width: `${v}%` }} /></div><b>{v}%</b></li>)}</ul>
      </div>
      <div>
        <h3>Also interested in</h3>
        <ul className="cr-ints">{audience.interests.map((i) => <li key={i} className="chip">{i}</li>)}</ul>
        <p className="cr-real"><b className="num">{audience.realFollowers}%</b> followers judged real</p>
      </div>
    </div>
  )

  return (
    <section className="cr-aud" id="audience" aria-labelledby="h-aud">
      <div className="cr-aud__head">
        <h2 className="h3" id="h-aud">Audience</h2>
        {state === 'open' && <span className="small muted">{used} of {limit} breakdowns used today{role === 'guest' ? ' · sign up for more' : ''}</span>}
      </div>
      {state === 'loading' && <div className="cr-aud__wait" aria-busy="true">Loading audience data…</div>}
      {state === 'open' && body}
      {state === 'locked' && (
        <div className="gate">
          <div className="gate__blur" aria-hidden="true">{body}</div>
          <div className="gate__box">
            <Icon name="lock" size={22} />
            <h3>Unlock full audience data</h3>
            <p>{role === 'guest'
              ? `You’ve opened your ${ANALYTICS_LIMITS.loggedOut} free breakdowns for today. Verified brands get ${ANALYTICS_LIMITS.verifiedBrand} a day, and paid plans more.`
              : `You’ve used today’s ${limit} breakdowns. Paid plans raise the limit.`}</p>
            <div className="row" style={{ justifyContent: 'center' }}>
              {role === 'guest'
                ? <Link className="btn" href={href(lang, '/signup?from=audience')} data-cta="audience_gate_signup" onClick={() => track('gate_converted', { gate: 'audience_analytics', to: 'signup' })}>Sign up free<Arrow /></Link>
                : null}
              <Link className={`btn ${role === 'guest' ? 'btn--ghost' : ''}`} href={href(lang, '/pricing#analytics')} data-cta="audience_gate_upgrade" onClick={() => track('gate_converted', { gate: 'audience_analytics', to: 'pricing' })}>{role === 'guest' ? 'See plans' : 'Choose plan'}</Link>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
