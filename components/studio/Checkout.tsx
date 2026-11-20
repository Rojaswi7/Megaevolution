'use client'
// Mock Studio checkout: cart → account → card → receipt → brief → My orders.
// Nothing is charged or sent. Every amount comes from data/pricing.ts; while a
// price is TBD the totals read "$TBD" instead of inventing a number.
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { href } from '@/data/site'
import { STUDIO, STUDIO_SUBSCRIPTIONS, TBD, isTBD, type Amount } from '@/data/pricing'
import { accountByRole } from '@/data/accounts'
import { Icon, Arrow } from '@/components/Icon'
import { Money } from '@/components/Money'
import { Trust } from '@/components/ui'
import { useApp, useAccount } from '@/components/AppState'
import { track } from '@/lib/track'
import { studioTrustItems, pct } from './shared'

type Step = 'cart' | 'account' | 'payment' | 'done' | 'brief' | 'finish'
const STEPS: { id: Step; label: string }[] = [
  { id: 'cart', label: 'Your order' }, { id: 'account', label: 'Account' }, { id: 'payment', label: 'Payment' },
  { id: 'done', label: 'Receipt' }, { id: 'brief', label: 'Brief and files' }, { id: 'finish', label: 'My orders' },
]
const SAMPLE_FILES = [['raw_footage_01.mp4', '412 MB'], ['raw_footage_02.mp4', '388 MB'], ['brand_guide.pdf', '2.1 MB'], ['logo_pack.zip', '14 MB']]

export default function Checkout({ lang }: { lang: string }) {
  const { setRole } = useApp()
  const account = useAccount()
  const brand = accountByRole.brand
  const [step, setStep] = useState<Step>('cart')
  const [qty, setQty] = useState<Record<string, number>>({ short: 1, long: 0 })
  const [plan, setPlan] = useState<'once' | 'plus' | 'max'>('once')
  const [guest, setGuest] = useState('')
  const [files, setFiles] = useState<string[][]>([])
  const [orderId] = useState('VE-2045')

  // ?type=long or ?plan=max preselect from the Studio page buttons
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('type') === 'long') setQty({ short: 0, long: 1 })
    const p = q.get('plan')
    if (p === 'plus' || p === 'max') setPlan(p)
    track('checkout_started', { product: 'studio', type: q.get('type') || 'short', plan: p || 'once' })
  }, [])

  const count = qty.short + qty.long
  const bundle = useMemo(() => [...STUDIO.bundles].reverse().find((b) => count >= b.min) || null, [count])
  const nextBundle = STUDIO.bundles.find((b) => count < b.min) || null
  const sub = STUDIO_SUBSCRIPTIONS.find((s) => s.id === plan) || null

  // Totals stay TBD until every price involved is a real number.
  const subtotal: Amount = STUDIO.products.some((p) => qty[p.id] > 0 && isTBD(p.price)) ? TBD : STUDIO.products.reduce((n, p) => n + qty[p.id] * (p.price as number), 0)
  const discount: Amount = !bundle ? 0 : isTBD(subtotal) || isTBD(bundle.percent) ? TBD : ((subtotal as number) * (bundle.percent as number)) / 100
  const planFee: Amount = sub ? sub.monthly : 0
  const total: Amount = [subtotal, discount, planFee].some(isTBD) ? TBD : (subtotal as number) - (discount as number) + (planFee as number)

  const go = (s: Step) => { setStep(s); track('checkout_step', { step: s, videos: count, plan }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const change = (id: string, d: number) => setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(50, q[id] + d)) }))
  const pickPlan = (p: 'once' | 'plus' | 'max') => { setPlan(p); track('plan_selected', { product: 'studio', plan: p, source: step === 'done' ? 'post_checkout_upsell' : 'checkout_cart' }) }
  const idx = STEPS.findIndex((s) => s.id === step)
  const who = account ? `${account.name} · ${account.org.replace(/ \(.*\)/, '')}` : guest || 'Guest'

  const summary = (
    <aside className="st-sum" aria-label="Order summary">
      <h2>Order summary</h2>
      <dl>
        {STUDIO.products.filter((p) => qty[p.id] > 0).map((p) => (
          <div key={p.id}><dt>{qty[p.id]} × {p.name}</dt><dd><Money usd={isTBD(p.price) ? TBD : (p.price as number) * qty[p.id]} /></dd></div>
        ))}
        {count === 0 ? <div><dt>No videos yet</dt><dd>—</dd></div> : null}
        {bundle ? <div><dt>Bundle discount ({pct(bundle.percent)})</dt><dd>− <Money usd={discount} /></dd></div> : null}
        {sub ? <div><dt>{sub.name} plan, first month</dt><dd><Money usd={sub.monthly} /></dd></div> : null}
      </dl>
      <p className="st-sum__total"><span>Total today</span><b><Money usd={total} /></b></p>
      <Trust items={studioTrustItems()} />
      <p className="small">Mockup: no card is charged and nothing is sent.</p>
    </aside>
  )

  return (
    <div className="st-co__body">
      <ol className="st-co__steps" aria-label="Checkout steps">
        {STEPS.map((s, i) => <li key={s.id} className={i < idx ? 'is-done' : i === idx ? 'is-now' : ''} aria-current={i === idx ? 'step' : undefined}>{i + 1}. {s.label}</li>)}
      </ol>

      <div className="st-co__grid">
        <div className="st-co__main">
          {step === 'cart' && (
            <section className="st-box" aria-labelledby="co-cart">
              <h2 id="co-cart">What do you need edited?</h2>
              <div>
                {STUDIO.products.map((p) => (
                  <div className="st-line" key={p.id}>
                    <div><b>{p.name}</b><small>{p.spec} · {p.delivery}</small></div>
                    <div className="st-qty" role="group" aria-label={`${p.name} quantity`}>
                      <button onClick={() => change(p.id, -1)} disabled={qty[p.id] === 0} aria-label={`Fewer ${p.name}s`}>−</button>
                      <output aria-live="polite">{qty[p.id]}</output>
                      <button onClick={() => change(p.id, 1)} aria-label={`More ${p.name}s`}>+</button>
                    </div>
                    <span className="st-line__price"><Money usd={p.price} /> each</span>
                  </div>
                ))}
              </div>
              <p className={`st-bundle ${bundle ? 'is-on' : ''}`} role="status">
                <Icon name={bundle ? 'check' : 'sparkle'} size={16} />
                <span>
                  {bundle ? <><b>Bundle discount applied: {pct(bundle.percent)} off</b> for {bundle.min}+ videos in one order. </> : null}
                  {nextBundle ? <>Add {nextBundle.min - count} more to get {pct(nextBundle.percent)} off the whole order.</> : null}
                </span>
              </p>

              <h2>How do you want to pay?</h2>
              <div className="st-opts">
                <button className="st-opt" aria-pressed={plan === 'once'} onClick={() => pickPlan('once')} data-cta="checkout_plan_once">
                  <b>One-time</b><span>Pay for this order</span><small>No subscription. Card checkout.</small>
                </button>
                {STUDIO_SUBSCRIPTIONS.map((s) => (
                  <button key={s.id} className="st-opt" aria-pressed={plan === s.id} onClick={() => pickPlan(s.id as 'plus' | 'max')} data-cta={`checkout_plan_${s.id}`}>
                    <b>{s.name}{'recommended' in s && s.recommended ? <span className="tag tag--accent">Saves most</span> : null}</b>
                    <span><Money usd={s.monthly} per="/month" /></span>
                    <small>{pct(s.saving)} off every video. Change or cancel in the billing portal.</small>
                  </button>
                ))}
              </div>
              <div className="row">
                <button className="btn btn--lg" disabled={count === 0} onClick={() => go(account ? 'payment' : 'account')} data-cta="checkout_continue_cart">Continue<Arrow /></button>
                {count === 0 ? <span className="small muted">Add at least one video.</span> : null}
              </div>
            </section>
          )}

          {step === 'account' && (
            <section className="st-box" aria-labelledby="co-acct">
              <h2 id="co-acct">Log in to keep your order in one place</h2>
              <p>Your drafts, revisions and receipts live on your order page. Use the dummy brand account, or continue with an email.</p>
              <button className="st-acct" onClick={() => { setRole('brand'); track('gate_converted', { gate: 'checkout_login', to: 'dummy_brand' }); go('payment') }} data-cta="checkout_continue_as_brand">
                <span className={`av tone-${brand.tone}`}>{brand.initial}</span>
                <div><b>Continue as {brand.name} (brand, dummy)</b><small>{brand.email} · {brand.org}</small></div>
                <Arrow />
              </button>
              <p className="st-or">or</p>
              <form className="stack" onSubmit={(e) => { e.preventDefault(); track('form_submitted', { form: 'checkout_guest_email' }); go('payment') }}>
                <label className="field"><span>Work email</span><input className="input" type="email" required value={guest} onChange={(e) => setGuest(e.target.value)} placeholder="you@company.com" autoComplete="email" /></label>
                <p className="small muted">We email a login code, so there is no password to remember. (Mock: any address works.)</p>
                <div className="row">
                  <button className="btn" data-cta="checkout_continue_guest">Continue with email<Arrow /></button>
                  <button type="button" className="tlink" onClick={() => go('cart')}>Back to order</button>
                </div>
              </form>
            </section>
          )}

          {step === 'payment' && (
            <section className="st-box" aria-labelledby="co-pay">
              <h2 id="co-pay">Payment</h2>
              <p>Paying as <b>{who}</b>.</p>
              <form className="stack" onSubmit={(e) => { e.preventDefault(); track('form_submitted', { form: 'checkout_card' }); track('checkout_completed', { product: 'studio', order: orderId, videos: count, plan, total: isTBD(total) ? 'TBD' : (total as number) }); go('done') }}>
                <label className="field"><span>Name on card</span><input className="input" required defaultValue={account?.name || ''} autoComplete="off" /></label>
                <label className="field"><span>Card number</span><input className="input" required inputMode="numeric" defaultValue="4242 4242 4242 4242" autoComplete="off" /></label>
                <div className="st-cardrow">
                  <label className="field"><span>Expiry</span><input className="input" required defaultValue="12 / 28" autoComplete="off" /></label>
                  <label className="field"><span>Security code</span><input className="input" required defaultValue="123" autoComplete="off" /></label>
                </div>
                <label className="field"><span>Company name for the invoice <small>(optional)</small></span><input className="input" defaultValue={account ? account.org.replace(/ \(.*\)/, '') : ''} autoComplete="off" /></label>
                <p className="st-fake"><Icon name="lock" size={14} />These are test values. This mockup never sends or stores card details.</p>
                <div className="st-pay">
                  <div className="stack">
                    <button className="btn btn--lg" data-cta="checkout_pay">Pay <Money usd={total} /><Arrow /></button>
                    <button type="button" className="tlink" style={{ justifySelf: 'start' }} onClick={() => go('cart')}>Back to order</button>
                  </div>
                  <Trust items={studioTrustItems()} />
                </div>
              </form>
            </section>
          )}

          {step === 'done' && (
            <>
              <section className="st-done" role="status">
                <span className="st-done__check"><Icon name="check" size={24} stroke={2.4} /></span>
                <h2>Payment received. Thank you.</h2>
                <p>Order <b>{orderId}</b> is open. Next, send your brief and files so an editor can start.</p>
                <div className="row"><button className="btn btn--dark btn--lg" onClick={() => go('brief')} data-cta="checkout_send_brief">Send your brief<Arrow /></button></div>
              </section>
              <section className="st-box" aria-labelledby="co-rec">
                <h2 id="co-rec">Receipt</h2>
                <dl className="st-receipt">
                  <div><dt>Order</dt><dd>{orderId}</dd></div>
                  <div><dt>Billed to</dt><dd>{who}</dd></div>
                  {STUDIO.products.filter((p) => qty[p.id] > 0).map((p) => <div key={p.id}><dt>{qty[p.id]} × {p.name}</dt><dd><Money usd={isTBD(p.price) ? TBD : (p.price as number) * qty[p.id]} /></dd></div>)}
                  {bundle ? <div><dt>Bundle discount ({pct(bundle.percent)})</dt><dd>− <Money usd={discount} /></dd></div> : null}
                  {sub ? <div><dt>{sub.name} plan, first month</dt><dd><Money usd={sub.monthly} /></dd></div> : null}
                  <div><dt><b>Total paid</b></dt><dd><b><Money usd={total} /></b></dd></div>
                </dl>
                <p className="small muted">A copy is emailed and kept under Billing. {STUDIO.refundNote}</p>
              </section>
              {plan === 'once' && (
                <section className="st-box" aria-labelledby="co-up">
                  <h2 id="co-up">Save on every order with Plus or Max</h2>
                  <p>Ordering again next month? A plan lowers the price of every video. Change or cancel any time in the billing portal.</p>
                  <div className="st-upsell">
                    {STUDIO_SUBSCRIPTIONS.map((s) => (
                      <button key={s.id} className="st-opt" onClick={() => pickPlan(s.id as 'plus' | 'max')} data-cta={`checkout_upsell_${s.id}`}>
                        <b>{s.name}{'recommended' in s && s.recommended ? <span className="tag tag--accent">Recommended</span> : null}</b>
                        <span><Money usd={s.monthly} per="/month" /></span>
                        <small>{s.blurb} {pct(s.saving)} off every video.</small>
                      </button>
                    ))}
                  </div>
                </section>
              )}
              {plan !== 'once' && sub ? <p className="st-bundle is-on" role="status"><Icon name="check" size={16} /><span><b>{sub.name} is active.</b> Manage it under Billing in your workspace.</span></p> : null}
            </>
          )}

          {step === 'brief' && (
            <section className="st-box" aria-labelledby="co-brief">
              <h2 id="co-brief">Send your brief and files</h2>
              <p>Short is fine. Editors read this before they open your footage.</p>
              <form className="stack" onSubmit={(e) => { e.preventDefault(); track('brief_submitted', { order: orderId, files: files.length }); track('form_submitted', { form: 'studio_brief' }); go('finish') }}>
                <label className="field"><span>What is the video for?</span><input className="input" required defaultValue="Serum launch, TikTok and Reels" /></label>
                <label className="field"><span>Anything the editor should know? <small>(tone, must-have shots, examples you like)</small></span><textarea className="textarea" defaultValue="Hook in the first second. Show the texture shot before the price. Captions in English." /></label>
                <div className="field">
                  <span>Files</span>
                  <button type="button" className="st-drop" onClick={() => setFiles((f) => (f.length < SAMPLE_FILES.length ? [...f, SAMPLE_FILES[f.length]] : f))} data-cta="checkout_add_file">
                    <Icon name="upload" size={22} />
                    <b>Add footage, logos or a brand guide</b>
                    <small className="muted">Mock upload: each click adds a sample file.</small>
                  </button>
                  {files.length ? (
                    <ul className="st-files">
                      {files.map(([n, s]) => <li key={n}><Icon name="file" size={16} /><span>{n}</span><small>{s}</small><button type="button" aria-label={`Remove ${n}`} onClick={() => setFiles((f) => f.filter((x) => x[0] !== n))}><Icon name="close" size={15} /></button></li>)}
                    </ul>
                  ) : null}
                </div>
                <div className="row">
                  <button className="btn btn--lg" data-cta="checkout_submit_brief">Send brief to the editor<Arrow /></button>
                  <button type="button" className="tlink" onClick={() => go('finish')}>I’ll send it later</button>
                </div>
              </form>
            </section>
          )}

          {step === 'finish' && (
            <>
              <section className="st-done" role="status">
                <span className="st-done__check"><Icon name="check" size={24} stroke={2.4} /></span>
                <h2>You’re all set.</h2>
                <p>Order <b>{orderId}</b> is in the editor queue. Follow each video on your order page.</p>
                <div className="row">
                  <Link className="btn btn--dark btn--lg" href={href(lang, '/preview/brand?tab=orders')} data-cta="checkout_go_my_orders" prefetch={false}>Go to My orders<Arrow /></Link>
                </div>
              </section>
              <section className="st-box">
                <h2>What happens next</h2>
                <ol className="st-next">
                  <li><b>1</b><span>An editor picks up your order and the status changes to “Editing”.</span></li>
                  <li><b>2</b><span>You get an email when a draft is ready. Download it from My orders.</span></li>
                  <li><b>3</b><span>Ask for revisions on the same page. Free revisions included: {isTBD(STUDIO.freeRevisions) ? 'TBD' : STUDIO.freeRevisions}.</span></li>
                  <li><b>4</b><span>Approve, then download the final video.</span></li>
                </ol>
                <p className="small muted">Need creators to film it too? <Link className="ulink" href={href(lang, '/about-agency')} data-cta="checkout_cross_agency" prefetch={false}>Explore your campaign options</Link></p>
              </section>
            </>
          )}
        </div>
        {summary}
      </div>
    </div>
  )
}
