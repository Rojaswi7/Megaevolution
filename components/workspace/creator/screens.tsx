'use client'
// Creator workspace screens (dummy account: @minh.beauty). All state is local to the browser tab.
import Link from 'next/link'
import { useState } from 'react'
import { href, LOCALES, LOCALE_NAMES } from '@/data/site'
import type { Creator } from '@/data/creators'
import { CATEGORIES } from '@/data/categories'
import { CREATOR_FX, formatAmount } from '@/data/pricing'
import { CREATOR_ORDERS } from '@/data/workspace'
import {
  RATE_CARD, RATE_CURRENCY, AI_SUGGESTIONS, CREATOR_KPIS, PROFILE_CHECKLIST, CREATOR_EXTRA_ORDERS, RANKING, SCRIPTS, PAYOUTS,
  type COrder, type CStatus,
} from '@/data/workspace-b'
import { localMoney, fmtDate, compact } from '@/lib/format'
import { track } from '@/lib/track'
import { Icon, PlatformIcon, Arrow } from '../../Icon'
import { useApp } from '../../AppState'
import { WsHead, Pill } from '../Shell'
import { createStore, useToast, goTab, DropButton } from '../common-b'

const ME = 'minh.beauty'
const fx = CREATOR_FX[RATE_CURRENCY]
const vnd = (n: number) => localMoney(n, RATE_CURRENCY)

const orders = createStore<COrder[]>([
  ...CREATOR_ORDERS.filter((o) => o.creator === ME).map((o): COrder => ({ id: o.id, brand: o.brand, pkg: o.pkg, platform: o.platform, amount: 12_000_000, status: 'Draft review', due: o.due, campaign: o.campaign })),
  ...CREATOR_EXTRA_ORDERS,
])
const mcnApp = createStore<'Pending' | 'Withdrawn'>('Pending')
const NEEDS_ME: CStatus[] = ['New request', 'Script needed', 'Draft needed', 'Revision requested']

/* ---------- home ---------- */
export function CreatorHome({ c, lang }: { c: Creator; lang: string }) {
  const list = orders.use()
  const todo = list.filter((o) => NEEDS_ME.includes(o.status))
  const done = PROFILE_CHECKLIST.filter((p) => p.done).length
  const pct = Math.round((done / PROFILE_CHECKLIST.length) * 100)
  return (
    <>
      <WsHead title={`Good morning, ${c.name}`} sub={`@${c.handle} · ${compact(c.followers)} followers · amounts below are sample numbers`}>
        <Link className="btn btn--ghost btn--sm" href={href(lang, `/@${c.handle}`)} data-cta="ws_creator_view_public_profile" prefetch={false}><Icon name="eye" size={15} />View public profile</Link>
      </WsHead>
      <div className="wgrid-4">
        {CREATOR_KPIS.map((k, i) => <div className="kpi" key={k.label}><b>{i === 2 ? todo.length : k.value}</b><span>{k.label}</span><small>{k.note}</small></div>)}
      </div>
      <div className="wgrid-main">
        <div className="wcard">
          <div className="wcard__h"><h3>Orders that need you</h3><button className="tlink small" onClick={() => goTab('orders')}>All orders<Arrow size={14} /></button></div>
          {todo.length ? todo.map((o) => (
            <div className="wrow" key={o.id}>
              <PlatformIcon name={o.platform} size={17} />
              <div className="wrow__t"><b>{o.brand} · {o.pkg}</b><small>{o.id} · due {fmtDate(o.due)} · {vnd(o.amount)}</small></div>
              <Pill>{o.status}</Pill>
              <button className="btn btn--sm" onClick={() => goTab('orders')} data-cta="ws_creator_home_open_order">Open</button>
            </div>
          )) : <p className="wnote"><Icon name="check" size={16} />Nothing is waiting on you.</p>}
        </div>
        <div className="wcard">
          <div className="wcard__h"><h3>Profile completeness</h3><b className="tnum">{pct}%</b></div>
          <div className="wbar"><i style={{ width: `${pct}%` }} /></div>
          <ul className="wb-check">
            {PROFILE_CHECKLIST.map((p) => <li key={p.label} className={p.done ? 'is-done' : ''}><Icon name={p.done ? 'check' : 'plus'} size={15} />{p.label}</li>)}
          </ul>
          <button className="btn btn--ghost btn--sm" onClick={() => goTab('profile')} data-cta="ws_creator_finish_profile">Finish your profile</button>
        </div>
      </div>
      <div className="wgrid-2">
        <button className="wcard wb-jump" onClick={() => goTab('rates')}>
          <span className="tag tag--accent">AI</span><b>3 suggested rate changes</b><small>Your TikTok views are up. See what AI would change on your rate card.</small>
        </button>
        <button className="wcard wb-jump" onClick={() => goTab('ranking')}>
          <span className="tag">Ranking</span><b>#{RANKING.position} of {RANKING.outOf} {RANKING.scope}</b><small>Up {RANKING.change} places this month. See what moves you higher.</small>
        </button>
      </div>
    </>
  )
}

/* ---------- profile ---------- */
export function CreatorProfile({ c, lang }: { c: Creator; lang: string }) {
  const [toast, show] = useToast()
  const app = mcnApp.use()
  const [cats, setCats] = useState<string[]>([c.category, 'lifestyle'])
  const toggle = (s: string) => setCats((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s].slice(-3)))
  return (
    <>
      <WsHead title="Profile" sub="What brands see on your public page.">
        <Link className="btn btn--ghost btn--sm" href={href(lang, `/@${c.handle}`)} prefetch={false} data-cta="ws_creator_preview_profile"><Icon name="eye" size={15} />Preview</Link>
      </WsHead>
      <div className="wgrid-main">
        <form className="wcard stack" onSubmit={(e) => { e.preventDefault(); show('Profile saved'); track('creator_profile_saved', { categories: cats.join(',') }) }}>
          <div className="wb-ident">
            <span className={`av tone-${c.tone}`} style={{ ['--s' as any]: '64px' }}>{c.name[0]}</span>
            <div><b>@{c.handle}</b><small className="muted">Profile photo — TODO: real photo upload</small></div>
          </div>
          <div className="wgrid-2">
            <label className="field"><span>Full name</span><input className="input" defaultValue="Nguyễn Hoàng Minh" autoComplete="name" /></label>
            <label className="field"><span>Display name</span><input className="input" defaultValue={c.name} /></label>
          </div>
          <label className="field"><span>Bio <small>(shown under your name)</small></span><textarea className="textarea" defaultValue={c.bio} /></label>
          <div className="wgrid-2">
            <label className="field"><span>City</span><input className="input" defaultValue={c.city} /></label>
            <label className="field"><span>Languages</span><input className="input" defaultValue={c.langs.join(', ')} /></label>
          </div>
          <fieldset className="wb-fs">
            <legend className="label">Categories <small className="muted">(up to 3)</small></legend>
            <div className="row" style={{ gap: 8 }}>
              {CATEGORIES.map((k) => <button type="button" key={k.slug} className="chip" aria-pressed={cats.includes(k.slug)} onClick={() => toggle(k.slug)}><Icon name={k.icon} size={15} />{k.label}</button>)}
            </div>
          </fieldset>
          <fieldset className="wb-fs">
            <legend className="label">Connected platforms</legend>
            {c.platforms.map((p) => (
              <div className="wrow" key={p.platform}>
                <PlatformIcon name={p.platform} size={18} />
                <div className="wrow__t"><b>{p.platform}</b><small>{compact(p.followers)} followers · {p.posts} posts · numbers refresh daily</small></div>
                <Pill>Active</Pill>
              </div>
            ))}
          </fieldset>
          <div className="row"><button className="btn" data-cta="ws_creator_save_profile">Save profile</button></div>
        </form>

        <div className="stack">
          <div className="wcard">
            <div className="wcard__h"><h3>MCN application</h3><Pill>{app === 'Pending' ? 'Pending' : 'Declined'}</Pill></div>
            {app === 'Pending' ? (
              <>
                <div className="wb-mcn"><span className="wb-logo">LT</span><div><b>Application to Lotus Talent · Pending</b><small className="muted">Sent 2 days ago, when you signed up with their invite link.</small></div></div>
                <p className="small muted" style={{ margin: '10px 0' }}>Lotus Talent is reviewing your profile. If they accept, you get a contract to sign or counter.</p>
                <div className="row">
                  <button className="btn btn--ghost btn--sm" onClick={() => goTab('messages')}>Message the MCN</button>
                  <button className="ulink small" onClick={() => { mcnApp.set('Withdrawn'); show('Application withdrawn'); track('mcn_application_withdrawn', { mcn: 'lotus-talent' }) }} data-cta="ws_creator_withdraw_mcn">Withdraw application</button>
                </div>
              </>
            ) : (
              <>
                <p className="small muted">You withdrew your application to Lotus Talent. You are not signed to an MCN.</p>
                <button className="btn btn--ghost btn--sm" style={{ marginTop: 10 }} onClick={() => { mcnApp.set('Pending'); show('Application sent to Lotus Talent'); track('mcn_application_sent', { mcn: 'lotus-talent' }) }} data-cta="ws_creator_apply_mcn">Apply again</button>
              </>
            )}
          </div>
          <div className="wcard">
            <div className="wcard__h"><h3>Sample videos</h3></div>
            <div className="wb-tiles">{c.captions.concat('Add a video').slice(0, 3).map((cap, i) => <div key={i} className={`thumb tone-${[2, 4, 6][i]}`} style={{ ['--ar' as any]: '9 / 14', ['--cap' as any]: '0.8rem' }}><p className="thumb__cap">{cap}</p></div>)}</div>
            <p className="small muted" style={{ marginTop: 10 }}>Pin three videos brands should see first.</p>
          </div>
        </div>
      </div>
      {toast}
    </>
  )
}

/* ---------- My Rates ---------- */
export function CreatorRates() {
  const { currency } = useApp()
  const [toast, show] = useToast()
  const [rows, setRows] = useState(RATE_CARD)
  const [ai, setAi] = useState(false)
  const [open, setOpen] = useState(AI_SUGGESTIONS.map((s) => s.id))
  const setPrice = (id: string, v: number) => setRows((r) => r.map((x) => (x.id === id ? { ...x, price: v, aiFilled: false } : x)))
  const accept = (id: string) => {
    const s = AI_SUGGESTIONS.find((x) => x.id === id)!
    setRows((r) => r.map((x) => (x.id === id ? { ...x, price: s.to, aiFilled: true } : x)))
    setOpen((o) => o.filter((x) => x !== id)); track('ai_rate_suggestion_accepted', { rate: id })
  }
  const toggleAi = () => { const v = !ai; setAi(v); track('ai_pricing_toggled', { on: v }); if (v) { open.forEach(accept); show('AI will adjust your rates. You get a note before each change.') } }
  return (
    <>
      <WsHead title="My Rates" sub="Your rate card. Brands see these prices on your profile and order directly.">
        <button className="btn btn--sm" onClick={() => { show('Rate card saved and published'); track('rate_card_saved', { rows: rows.length, currency: RATE_CURRENCY }) }} data-cta="ws_creator_save_rates">Save rate card</button>
      </WsHead>
      <div className="wgrid-main">
        <div className="wcard wcard--flush">
          <div className="wcard__h" style={{ paddingBottom: 12 }}>
            <h3>Rate card</h3>
            <span className="wb-cur" title="One currency per rate card"><Icon name="lock" size={13} />{RATE_CURRENCY} · one currency per rate card</span>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Package</th><th>Your price ({RATE_CURRENCY})</th><th>Brands see</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span className="wb-pkg">{r.platform ? <PlatformIcon name={r.platform} size={16} /> : <Icon name="file" size={16} />}<span><b>{r.name}</b><small>{r.detail}</small></span></span>
                    </td>
                    <td>
                      <label className="wb-price"><span className="sr">Price for {r.name} in {RATE_CURRENCY}</span><i>₫</i>
                        <input type="number" min={0} step={100000} value={r.price} onChange={(e) => setPrice(r.id, Number(e.target.value))} />
                      </label>
                      {r.aiFilled ? <span className="tag wb-ai"><Icon name="sparkle" size={11} />Filled by AI</span> : null}
                    </td>
                    <td className="tnum">≈ {formatAmount(Math.round(r.price / fx), currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="wnote" style={{ margin: 14 }}><Icon name="globe" size={16} />You set prices once, in {RATE_CURRENCY}. Each brand sees them converted to its own currency, so there is nothing to maintain per market.</p>
        </div>

        <div className="stack">
          <div className="wcard wcard--dark">
            <div className="wcard__h"><h3>Let AI adjust my rates</h3>
              <button className="wtoggle" role="switch" aria-checked={ai} aria-label="Let AI adjust my rates" onClick={toggleAi} data-cta="ws_creator_ai_pricing_toggle" />
            </div>
            <p className="small muted">AI looks at your recent views, engagement and what similar creators charge, then moves each price a little at a time — never more than 15% in a month. You can switch it off or edit any price whenever you like.</p>
            <p className="small" style={{ marginTop: 10 }}><b>{ai ? 'On.' : 'Off.'}</b> {ai ? 'Changes are applied for you and listed here.' : 'Suggestions wait for you to accept them.'}</p>
          </div>
          <div className="wcard">
            <div className="wcard__h"><h3>Suggested changes</h3><span className="small muted">{open.length} open</span></div>
            {open.length ? AI_SUGGESTIONS.filter((s) => open.includes(s.id)).map((s) => {
              const row = rows.find((r) => r.id === s.id)!
              return (
                <div className="wb-sug" key={s.id}>
                  <b>{row.name}</b>
                  <p className="tnum">{vnd(row.price)} <Icon name="arrow" size={13} /> <mark>{vnd(s.to)}</mark></p>
                  <small className="muted">{s.why}</small>
                  <div className="row"><button className="btn btn--sm" onClick={() => accept(s.id)} data-cta="ws_creator_accept_ai_rate">Accept</button><button className="ulink small" onClick={() => setOpen((o) => o.filter((x) => x !== s.id))}>Dismiss</button></div>
                </div>
              )
            }) : <p className="wnote"><Icon name="check" size={16} />Your rate card matches what AI would suggest.</p>}
          </div>
        </div>
      </div>
      {toast}
    </>
  )
}

/* ---------- ranking ---------- */
export function CreatorRanking() {
  return (
    <>
      <WsHead title="How you rank for brands" sub="Where you appear when a brand searches your category and country. Sample figures." />
      <div className="wgrid-main">
        <div className="wcard">
          <div className="wb-rank">
            <p><b className="num">#{RANKING.position}</b><span>of {RANKING.outOf} {RANKING.scope}</span></p>
            <span className="pill pill--ok">Up {RANKING.change} places this month</span>
          </div>
          <ul className="wb-factors">
            {RANKING.factors.map((f) => (
              <li key={f.name}>
                <div><b>{f.name}</b><span className="tnum">{f.score}/100</span></div>
                <div className="wbar"><i style={{ width: `${f.score}%` }} /></div>
                <small className="muted">{f.note}</small>
              </li>
            ))}
          </ul>
        </div>
        <div className="stack">
          <div className="wcard wcard--accent">
            <div className="wcard__h"><h3>What would move you up</h3></div>
            <ul className="ticks">{RANKING.improve.map((t) => <li key={t}><Icon name="check" size={16} />{t}</li>)}</ul>
          </div>
          <div className="wcard">
            <p className="small muted">Ranking is never for sale. It follows your results and how reliably you deliver, so brands can trust the order of the list.</p>
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn btn--ghost btn--sm" onClick={() => goTab('rates')}>Open My Rates</button>
              <button className="btn btn--ghost btn--sm" onClick={() => goTab('profile')}>Edit profile</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ---------- orders ---------- */
const STEPS = ['Request', 'Script', 'Draft', 'Review', 'Posted']
const stepOf = (s: CStatus) => ({ 'New request': 0, 'Script needed': 1, 'Script review': 1, 'Draft needed': 2, 'Draft review': 3, 'Revision requested': 3, Posted: 4, Completed: 5, Declined: -1 }[s])

export function CreatorOrders({ lang }: { lang: string }) {
  const list = orders.use()
  const [toast, show] = useToast()
  const [openId, setOpenId] = useState(list.find((o) => NEEDS_ME.includes(o.status))?.id || list[0].id)
  const [script, setScript] = useState('Hook: “I gave my mum a skincare gift box for Tết — her reaction.”\nScene 1: unboxing at the kitchen table…')
  const move = (id: string, status: CStatus, event: string, msg: string) => { orders.set((l) => l.map((o) => (o.id === id ? { ...o, status } : o))); track(event, { order: id, status }); show(msg) }
  const o = list.find((x) => x.id === openId) || list[0]
  const step = stepOf(o.status)
  return (
    <>
      <WsHead title="Orders" sub="Requests from brands, and where each one stands." />
      <div className="wgrid-main wb-orders">
        <div className="wcard wcard--flush">
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Order</th><th>Package</th><th>Due</th><th>Status</th></tr></thead>
              <tbody>
                {list.map((x) => (
                  <tr key={x.id} className={x.id === o.id ? 'is-on' : ''} onClick={() => setOpenId(x.id)}>
                    <td><button className="wb-rowbtn" aria-label={`Open ${x.id}`}><b>{x.brand}</b><small>{x.id}</small></button></td>
                    <td><span className="wb-pkg"><PlatformIcon name={x.platform} size={15} /><span>{x.pkg}<small>{vnd(x.amount)}</small></span></span></td>
                    <td className="tnum">{fmtDate(x.due)}</td>
                    <td><Pill>{x.status}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="wcard stack" aria-live="polite">
          <div className="wcard__h" style={{ marginBottom: 0 }}><h3>{o.brand} · {o.id}</h3><Pill>{o.status}</Pill></div>
          <p className="small muted">{o.campaign} · {o.pkg} · {vnd(o.amount)} · due {fmtDate(o.due)}</p>
          {step >= 0 ? <ol className="wsteps">{STEPS.map((s, i) => <li key={s} className={i < step ? 'is-done' : i === step ? 'is-now' : ''}>{s}</li>)}</ol> : null}
          {o.note ? <p className="wnote"><Icon name="message" size={16} /><span><b>{o.status === 'Revision requested' ? 'Revision request from the brand' : 'From the brand'}:</b> {o.note}</span></p> : null}

          {o.status === 'New request' && (
            <div className="row">
              <button className="btn" onClick={() => move(o.id, 'Script needed', 'order_accepted', 'Order accepted. The brand has been told.')} data-cta="ws_creator_accept_order">Accept order</button>
              <button className="btn btn--ghost" onClick={() => move(o.id, 'Declined', 'order_declined', 'Order declined')} data-cta="ws_creator_decline_order">Decline</button>
            </div>
          )}
          {o.status === 'Script needed' && (
            <>
              <label className="field"><span>Script</span><textarea className="textarea" value={script} onChange={(e) => setScript(e.target.value)} /></label>
              <div className="row">
                <button className="btn" onClick={() => move(o.id, 'Script review', 'script_submitted', 'Script sent to the brand')} data-cta="ws_creator_submit_script">Submit script</button>
                <Link className="tlink small" href={href(lang, '/tools/script-studio')} prefetch={false} data-cta="ws_creator_order_to_script_studio">Write it in Script Studio<Arrow size={14} /></Link>
              </div>
            </>
          )}
          {o.status === 'Script review' && (
            <p className="wnote"><Icon name="clock" size={16} /><span>Waiting for the brand to approve your script. <button className="ulink" onClick={() => move(o.id, 'Draft needed', 'demo_brand_approved_script', 'Demo: the brand approved the script')}>Demo: brand approves</button></span></p>
          )}
          {(o.status === 'Draft needed' || o.status === 'Revision requested') && (
            <DropButton label={o.status === 'Draft needed' ? 'Upload your draft video' : 'Upload a new draft'} hint="MP4 or MOV. The brand reviews it before you post." cta="ws_creator_upload_draft"
              onPick={() => move(o.id, 'Draft review', 'draft_uploaded', 'Draft uploaded. The brand will review it.')} />
          )}
          {o.status === 'Draft review' && (
            <p className="wnote"><Icon name="clock" size={16} /><span>The brand is reviewing your draft.{' '}
              <button className="ulink" onClick={() => move(o.id, 'Posted', 'demo_brand_approved_draft', 'Demo: draft approved. Post it and paste the link.')}>Demo: brand approves</button> ·{' '}
              <button className="ulink" onClick={() => { orders.set((l) => l.map((x) => (x.id === o.id ? { ...x, note: 'Please make the first three seconds faster and keep the product in frame.' } : x))); move(o.id, 'Revision requested', 'demo_brand_requested_revision', 'Demo: the brand asked for a revision') }}>Demo: brand asks for a revision</button></span></p>
          )}
          {o.status === 'Posted' && (
            <div className="row"><button className="btn" onClick={() => move(o.id, 'Completed', 'order_completed', 'Marked as posted. Payout is on its way.')} data-cta="ws_creator_confirm_posted">Confirm post link</button><span className="small muted">Payment is released once the brand confirms.</span></div>
          )}
          {o.status === 'Completed' && <p className="wnote"><Icon name="check" size={16} />Completed and paid. See it under Earnings.</p>}
          {o.status === 'Declined' && <p className="wnote"><Icon name="close" size={16} />You declined this order.</p>}
        </div>
      </div>
      {toast}
    </>
  )
}

/* ---------- scripts ---------- */
export function CreatorScripts({ lang }: { lang: string }) {
  return (
    <>
      <WsHead title="Script Studio" sub="Write scripts from proven hooks and check them against the brand’s brief before you film.">
        <Link className="btn btn--sm" href={href(lang, '/tools/script-studio')} data-cta="ws_creator_open_script_studio" prefetch={false}>Open Script Studio<Arrow size={14} /></Link>
      </WsHead>
      <div className="wgrid-main">
        <div className="wcard">
          <div className="wcard__h"><h3>Recent scripts</h3></div>
          {SCRIPTS.map((s) => (
            <div className="wrow" key={s.title}>
              <Icon name="pen" size={17} />
              <div className="wrow__t"><b>{s.title}</b><small>{s.order} · {s.check} · {s.updated}</small></div>
              <Link className="btn btn--ghost btn--sm" href={href(lang, '/tools/script-studio')} prefetch={false} data-cta="ws_creator_open_script">Open</Link>
            </div>
          ))}
        </div>
        <div className="wcard wcard--dark">
          <div className="wcard__h"><h3>What it does</h3></div>
          <ul className="ticks">
            <li><Icon name="check" size={16} />Hook bank sorted by category and market</li>
            <li><Icon name="check" size={16} />Guideline check against the brand’s brief</li>
            <li><Icon name="check" size={16} />PDF export to send for approval</li>
          </ul>
        </div>
      </div>
    </>
  )
}

/* ---------- PDFs ---------- */
export function CreatorPdfs({ lang }: { lang: string }) {
  const [toast, show] = useToast()
  const [l, setL] = useState(lang)
  const docs = [
    { id: 'analytics', name: 'Audience analytics', sub: 'Followers by country, age and gender, plus your last 30 days', pages: '4 pages' },
    { id: 'ratecard', name: 'Rate card', sub: 'Your packages and prices, with your channel numbers on the cover', pages: '2 pages' },
  ]
  return (
    <>
      <WsHead title="PDF exports" sub="Send brands a clean PDF of your numbers or your prices.">
        <label className="wb-lang"><span>PDF language</span>
          <select className="select" value={l} onChange={(e) => setL(e.target.value)}>{LOCALES.map((x) => <option key={x} value={x}>{LOCALE_NAMES[x]}</option>)}</select>
        </label>
      </WsHead>
      <div className="wgrid-2">
        {docs.map((d) => (
          <div className="wcard stack" key={d.id}>
            <div className="wb-pdf" aria-hidden="true"><i /><i /><i /><b>{d.name}</b></div>
            <div><b>{d.name}</b><p className="small muted">{d.sub} · {d.pages}</p></div>
            <button className="btn btn--ghost" data-cta={`ws_creator_export_pdf_${d.id}`} onClick={() => { show(`${d.name} PDF prepared in ${LOCALE_NAMES[l as keyof typeof LOCALE_NAMES]} (mock download)`); track('pdf_exported', { doc: d.id, language: l }) }}>
              <Icon name="download" size={16} />Export as PDF
            </button>
          </div>
        ))}
      </div>
      <p className="wnote"><Icon name="lock" size={16} />PDF export is part of paid plans. The PDF follows the site’s language unless you pick another one here.</p>
      {toast}
    </>
  )
}

/* ---------- earnings ---------- */
export function CreatorEarnings() {
  const paid = PAYOUTS.filter((p) => p.status === 'Paid').reduce((a, p) => a + p.amount, 0)
  const pending = PAYOUTS.filter((p) => p.status !== 'Paid').reduce((a, p) => a + p.amount, 0)
  return (
    <>
      <WsHead title="Earnings" sub="Payouts are sent in your rate-card currency. Sample figures." />
      <div className="wgrid-3">
        <div className="kpi"><b>{vnd(paid)}</b><span>Paid out</span><small>last 30 days</small></div>
        <div className="kpi"><b>{vnd(pending)}</b><span>Pending</span><small>released when the brand approves</small></div>
        <div className="kpi"><b>3 days</b><span>Average payout time</span><small>after approval</small></div>
      </div>
      <div className="wcard wcard--flush">
        <div className="wcard__h" style={{ paddingBottom: 8 }}><h3>Payout history</h3></div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Payout</th><th>Date</th><th>For</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>{PAYOUTS.map((p) => <tr key={p.id}><td>{p.id}</td><td className="tnum">{fmtDate(p.date)}</td><td>{p.what}</td><td className="tnum"><b>{vnd(p.amount)}</b></td><td><Pill>{p.status}</Pill></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </>
  )
}
