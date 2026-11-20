'use client'
// Creator workspace screens (dummy account: @minh.beauty). All state is local to the browser tab.
import Link from 'next/link'
import { useState } from 'react'
import '@/styles/brand-home.css'
import '@/styles/ws-creator.css'
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
import { Pill } from '../Shell'
import { createStore, useToast, goTab, BandHead } from '../common-b'

const ME = 'minh.beauty'
const fx = CREATOR_FX[RATE_CURRENCY]
const vnd = (n: number) => localMoney(n, RATE_CURRENCY)

const orders = createStore<COrder[]>([
  ...CREATOR_ORDERS.filter((o) => o.creator === ME).map((o): COrder => ({ id: o.id, brand: o.brand, pkg: o.pkg, platform: o.platform, amount: 12_000_000, status: 'Draft review', due: o.due, campaign: o.campaign })),
  ...CREATOR_EXTRA_ORDERS,
])
const mcnApp = createStore<'Pending' | 'Withdrawn'>('Pending')
const NEEDS_ME: CStatus[] = ['New request', 'Script needed', 'Draft needed', 'Revision requested']
const NEXT_STEP: Partial<Record<CStatus, string>> = { 'New request': 'Accept or decline', 'Script needed': 'Write the script', 'Draft needed': 'Upload the draft', 'Revision requested': 'Fix and re-upload' }
const brandMono = (s: string) => s.replace(/\(.*?\)/g, '').replace(/[^\p{L}\s]/gu, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

// sample "today" so countdowns read the same every time
const TODAY = '2026-11-20'
const daysLeft = (d: string) => Math.round((Date.parse(`${d}T00:00:00Z`) - Date.parse(`${TODAY}T00:00:00Z`)) / 86400000)
function Due({ d }: { d: string }) {
  const n = daysLeft(d)
  const tone = n < 0 ? 'is-late' : n <= 1 ? 'is-soon' : ''
  return <span className={`cr2-due ${tone}`}><Icon name="clock" size={12} />{n < 0 ? `${-n}d late` : n === 0 ? 'Due today' : n === 1 ? 'Due tomorrow' : `Due ${fmtDate(d)}`}</span>
}

/* ---------- home ---------- */
export function CreatorHome({ c, lang }: { c: Creator; lang: string }) {
  const list = orders.use()
  const todo = list.filter((o) => NEEDS_ME.includes(o.status))
  const done = PROFILE_CHECKLIST.filter((p) => p.done).length
  const pct = Math.round((done / PROFILE_CHECKLIST.length) * 100)
  const KPI_ICON = ['card', 'clock', 'bell', 'star']
  const KPI_TAB = ['earnings', 'earnings', 'orders', 'ranking']
  return (
    <>
      <section className="bh-hero" aria-label="Today">
        <div className="bh-hero__copy">
          <p className="bh-hero__date">Friday, 20 Nov · @{c.handle}</p>
          <h2>Good morning, <span className="it">{c.name}.</span></h2>
          <p><b>{todo.length} order{todo.length === 1 ? '' : 's'}</b> need you, and you have <b>{compact(c.followers)} followers</b>. Amounts are sample numbers.</p>
        </div>
        <div className="bh-quick">
          <button onClick={() => goTab('orders')} data-cta="ws_creator_home_quick_orders"><Icon name="inbox" size={18} /><b>Orders</b><small>{todo.length} waiting on you</small></button>
          <button onClick={() => goTab('rates')} data-cta="ws_creator_home_quick_rates"><Icon name="card" size={18} /><b>My Rates</b><small>{AI_SUGGESTIONS.length} AI suggestions</small></button>
          <Link href={href(lang, '/tools/script-studio')} data-cta="ws_creator_home_quick_scripts" prefetch={false}><Icon name="pen" size={18} /><b>Write a script</b><small>Script Studio</small></Link>
          <Link href={href(lang, `/@${c.handle}`)} data-cta="ws_creator_view_public_profile" prefetch={false}><Icon name="eye" size={18} /><b>Public profile</b><small>What brands see</small></Link>
        </div>
      </section>

      <div className="bh-kpis">
        {CREATOR_KPIS.map((k, i) => (
          <button key={k.label} className={`bh-kpi ${i === 0 ? 'bh-kpi--spend' : ''}`} onClick={() => goTab(KPI_TAB[i])} data-cta={`ws_creator_kpi_${KPI_TAB[i]}`}>
            <span className="bh-kpi__ico"><Icon name={KPI_ICON[i]} size={17} /></span>
            <b className="num">{i === 2 ? todo.length : k.value}</b>
            <span className="bh-kpi__l">{k.label}</span>
            <span className="bh-kpi__bar"><i style={{ width: `${[78, 46, Math.min(todo.length * 25, 100), 98][i]}%` }} /></span>
            <small>{k.note}</small>
          </button>
        ))}
      </div>

      <div className="bh-cols">
        <div className="bh-col">
          <section className="wcard bh-needs">
            <div className="wcard__h"><h3>Orders that need you</h3><span className="bh-count">{todo.length}</span></div>
            {todo.length ? (
              <ol>
                {todo.map((o, i) => (
                  <li key={o.id}>
                    <span className="bh-needs__ico"><PlatformIcon name={o.platform} size={17} /></span>
                    <div><b>{o.brand} · {o.pkg}</b><small><em>{o.status}</em>{NEXT_STEP[o.status]} · {vnd(o.amount)} · <Due d={o.due} /></small></div>
                    <button className={`btn btn--sm ${i ? 'btn--ghost' : ''}`} onClick={() => goTab('orders')} data-cta="ws_creator_home_open_order">Open<Arrow size={13} /></button>
                  </li>
                ))}
              </ol>
            ) : <div className="wb2-empty"><span className="wb2-ico"><Icon name="check" size={18} /></span><b>Nothing is waiting on you</b><p>New requests from brands show up here.</p></div>}
          </section>
          <div className="cr2-jumps">
            <button className="wb2-card cr2-jump" onClick={() => goTab('rates')} data-cta="ws_creator_home_jump_rates">
              <span className="wb2-ico wb2-ico--lime"><Icon name="sparkle" size={17} /></span>
              <b>{AI_SUGGESTIONS.length} suggested rate changes</b><small>Your TikTok views are up. See what AI would change on your rate card.</small><Arrow size={15} />
            </button>
            <button className="wb2-card cr2-jump" onClick={() => goTab('ranking')} data-cta="ws_creator_home_jump_ranking">
              <span className="wb2-ico wb2-ico--lime"><Icon name="chart" size={17} /></span>
              <b>#{RANKING.position} of {RANKING.outOf} {RANKING.scope}</b><small>Up {RANKING.change} places this month. See what moves you higher.</small><Arrow size={15} />
            </button>
          </div>
        </div>
        <div className="bh-col">
          <section className="wcard cr2-complete">
            <div className="wcard__h"><h3>Profile completeness</h3></div>
            <div className="cr2-ringrow">
              <div className="cr2-ring" style={{ ['--p' as string]: pct }}><b className="num">{pct}%</b></div>
              <p>{PROFILE_CHECKLIST.length - done} step{PROFILE_CHECKLIST.length - done === 1 ? '' : 's'} left. Complete profiles rank higher and get more orders.</p>
            </div>
            <ul className="cr2-check">
              {PROFILE_CHECKLIST.map((p) => <li key={p.label} className={p.done ? 'is-done' : ''}><span><Icon name={p.done ? 'check' : 'plus'} size={13} stroke={2.4} /></span>{p.label}</li>)}
            </ul>
            <button className="btn btn--sm" onClick={() => goTab('profile')} data-cta="ws_creator_finish_profile">Finish your profile<Arrow size={13} /></button>
          </section>
        </div>
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
      <BandHead icon="user" title="Profile" sub="What brands see on your public page."
        stats={[{ n: compact(c.followers), l: 'followers' }, { n: c.platforms.length, l: 'platforms connected' }, { n: cats.length, l: 'categories (max 3)' }]}>
        <Link className="btn btn--sm" href={href(lang, `/@${c.handle}`)} prefetch={false} data-cta="ws_creator_preview_profile"><Icon name="eye" size={15} />Preview</Link>
      </BandHead>
      <div className="cr2-split">
        <form className="wb2-card cr2-form" onSubmit={(e) => { e.preventDefault(); show('Profile saved'); track('creator_profile_saved', { categories: cats.join(',') }) }}>
          <div className="cr2-ident">
            <span className={`av tone-${c.tone}`}>{c.name[0]}</span>
            <div><b>@{c.handle}</b><small>Profile photo · TODO: real photo upload</small></div>
          </div>
          <div className="cr2-fields">
            <label><span>Full name</span><input defaultValue="Nguyễn Hoàng Minh" autoComplete="name" /></label>
            <label><span>Display name</span><input defaultValue={c.name} /></label>
            <label className="cr2-span"><span>Bio <small>shown under your name</small></span><textarea defaultValue={c.bio} /></label>
            <label><span>City</span><input defaultValue={c.city} /></label>
            <label><span>Languages</span><input defaultValue={c.langs.join(', ')} /></label>
          </div>
          <fieldset className="cr2-fs">
            <legend>Categories <small>up to 3</small></legend>
            <div className="cr2-chips">
              {CATEGORIES.map((k) => <button type="button" key={k.slug} aria-pressed={cats.includes(k.slug)} onClick={() => toggle(k.slug)}><Icon name={k.icon} size={15} />{k.label}</button>)}
            </div>
          </fieldset>
          <fieldset className="cr2-fs">
            <legend>Connected platforms</legend>
            <ul className="cr2-plats">
              {c.platforms.map((p) => (
                <li key={p.platform}>
                  <span className="wb2-ico"><PlatformIcon name={p.platform} size={18} /></span>
                  <div><b>{p.platform}</b><small>{compact(p.followers)} followers · {p.posts} posts · refreshes daily</small></div>
                  <Pill>Active</Pill>
                </li>
              ))}
            </ul>
          </fieldset>
          <div className="cr2-formfoot"><button className="btn" data-cta="ws_creator_save_profile">Save profile</button></div>
        </form>

        <div className="cr2-aside">
          <section className="wb2-card">
            <div className="cr2-cardh"><h3>MCN application</h3><Pill>{app === 'Pending' ? 'Pending' : 'Declined'}</Pill></div>
            {app === 'Pending' ? (
              <>
                <div className="cr2-mcn"><span className="cr2-logo">LT</span><div><b>Lotus Talent · Pending</b><small>Sent 2 days ago, when you signed up with their invite link.</small></div></div>
                <p className="cr2-p">Lotus Talent is reviewing your profile. If they accept, you get a contract to sign or counter.</p>
                <div className="cr2-acts">
                  <button className="btn btn--sm btn--ghost" onClick={() => goTab('messages')}>Message the MCN</button>
                  <button className="ulink small" onClick={() => { mcnApp.set('Withdrawn'); show('Application withdrawn'); track('mcn_application_withdrawn', { mcn: 'lotus-talent' }) }} data-cta="ws_creator_withdraw_mcn">Withdraw application</button>
                </div>
              </>
            ) : (
              <>
                <p className="cr2-p">You withdrew your application to Lotus Talent. You are not signed to an MCN.</p>
                <div className="cr2-acts"><button className="btn btn--sm" onClick={() => { mcnApp.set('Pending'); show('Application sent to Lotus Talent'); track('mcn_application_sent', { mcn: 'lotus-talent' }) }} data-cta="ws_creator_apply_mcn">Apply again</button></div>
              </>
            )}
          </section>
          <section className="wb2-card">
            <div className="cr2-cardh"><h3>Sample videos</h3><small>Pin three</small></div>
            <div className="cr2-tiles">{c.captions.concat('Add a video').slice(0, 3).map((cap, i) => <div key={i} className={`thumb tone-${[2, 4, 6][i]}`} style={{ ['--ar' as string]: '9 / 14', ['--cap' as string]: '0.8rem' }}><p className="thumb__cap">{cap}</p></div>)}</div>
            <p className="cr2-p">Pin three videos brands should see first.</p>
          </section>
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
  const low = Math.min(...rows.map((r) => r.price))
  return (
    <>
      <BandHead icon="card" title="My Rates" sub="Your rate card. Brands see these prices on your profile and order directly."
        stats={[{ n: rows.length, l: 'packages' }, { n: vnd(low), l: 'starting price' }, { n: open.length, l: 'AI suggestions open', hot: open.length > 0 }]}>
        <button className="btn btn--sm" onClick={() => { show('Rate card saved and published'); track('rate_card_saved', { rows: rows.length, currency: RATE_CURRENCY }) }} data-cta="ws_creator_save_rates">Save rate card</button>
      </BandHead>
      <div className="cr2-split">
        <section className="wb2-card cr2-rates">
          <div className="cr2-cardh"><h3>Rate card</h3><span className="cr2-cur" title="One currency per rate card"><Icon name="lock" size={13} />{RATE_CURRENCY} · one currency per rate card</span></div>
          <div className="cr2-rates__h" aria-hidden="true"><span>Package</span><span>Your price ({RATE_CURRENCY})</span><span>Brands see</span></div>
          <ul>
            {rows.map((r) => (
              <li key={r.id} className={r.aiFilled ? 'is-ai' : ''}>
                <span className="cr2-pkg"><span className="wb2-ico">{r.platform ? <PlatformIcon name={r.platform} size={16} /> : <Icon name="file" size={16} />}</span><span><b>{r.name}</b><small>{r.detail}</small></span></span>
                <span className="cr2-pricecell">
                  <label className="cr2-price"><span className="sr">Price for {r.name} in {RATE_CURRENCY}</span><i>₫</i>
                    <input type="number" min={0} step={100000} value={r.price} onChange={(e) => setPrice(r.id, Number(e.target.value))} />
                  </label>
                  {r.aiFilled ? <span className="cr2-ai"><Icon name="sparkle" size={11} />Filled by AI</span> : null}
                </span>
                <span className="cr2-see" data-k="Brands see">≈ {formatAmount(Math.round(r.price / fx), currency)}</span>
              </li>
            ))}
          </ul>
          <p className="cr2-note"><Icon name="globe" size={15} />You set prices once, in {RATE_CURRENCY}. Each brand sees them converted to its own currency, so there is nothing to maintain per market.</p>
        </section>

        <div className="cr2-aside">
          <section className={`cr2-aicard ${ai ? 'is-on' : ''}`}>
            <div className="cr2-cardh"><h3>Let AI adjust my rates</h3>
              <button className="wtoggle" role="switch" aria-checked={ai} aria-label="Let AI adjust my rates" onClick={toggleAi} data-cta="ws_creator_ai_pricing_toggle" />
            </div>
            <p>AI looks at your recent views, engagement and what similar creators charge, then moves each price a little at a time — never more than 15% in a month. You can switch it off or edit any price whenever you like.</p>
            <p className="cr2-aicard__s"><b>{ai ? 'On.' : 'Off.'}</b> {ai ? 'Changes are applied for you and listed here.' : 'Suggestions wait for you to accept them.'}</p>
          </section>
          <section className="wb2-card">
            <div className="cr2-cardh"><h3>Suggested changes</h3><span className="cr2-count">{open.length} open</span></div>
            {open.length ? (
              <div className="cr2-sugs">
                {AI_SUGGESTIONS.filter((s) => open.includes(s.id)).map((s) => {
                  const row = rows.find((r) => r.id === s.id)!
                  const up = s.to > row.price
                  return (
                    <div className="cr2-sug" key={s.id}>
                      <b>{row.name}</b>
                      <p className="cr2-sug__p"><span>{vnd(row.price)}</span><Icon name="arrow" size={13} /><mark className={up ? 'is-up' : 'is-down'}>{vnd(s.to)}</mark></p>
                      <small>{s.why}</small>
                      <div className="cr2-acts"><button className="btn btn--sm" onClick={() => accept(s.id)} data-cta="ws_creator_accept_ai_rate">Accept</button><button className="ulink small" onClick={() => setOpen((o) => o.filter((x) => x !== s.id))}>Dismiss</button></div>
                    </div>
                  )
                })}
              </div>
            ) : <div className="cr2-ok"><Icon name="check" size={16} />Your rate card matches what AI would suggest.</div>}
          </section>
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
      <BandHead icon="chart" title="How you rank for brands" sub="Where you appear when a brand searches your category and country. Sample figures."
        stats={[{ n: `#${RANKING.position}`, l: `of ${RANKING.outOf} ${RANKING.scope}`, hot: true }, { n: `+${RANKING.change}`, l: 'places this month' }, { n: Math.round(RANKING.factors.reduce((s, f) => s + f.score, 0) / RANKING.factors.length), l: 'average factor score' }]} />
      <div className="cr2-split">
        <section className="wb2-card">
          <div className="cr2-cardh"><h3>What the ranking looks at</h3></div>
          <ul className="cr2-factors">
            {RANKING.factors.map((f) => (
              <li key={f.name} className={f.score < 70 ? 'is-low' : ''}>
                <div className="cr2-factors__t"><b>{f.name}</b><span className="num">{f.score}<small>/100</small></span></div>
                <div className="cr2-bar"><i style={{ width: `${f.score}%` }} /></div>
                <small>{f.note}</small>
              </li>
            ))}
          </ul>
        </section>
        <div className="cr2-aside">
          <section className="cr2-improve">
            <div className="cr2-cardh"><h3>What would move you up</h3></div>
            <ol>{RANKING.improve.map((t, i) => <li key={t}><span>{i + 1}</span>{t}</li>)}</ol>
          </section>
          <section className="wb2-card">
            <p className="cr2-p">Ranking is never for sale. It follows your results and how reliably you deliver, so brands can trust the order of the list.</p>
            <div className="cr2-acts">
              <button className="btn btn--sm btn--ghost" onClick={() => goTab('rates')}>Open My Rates</button>
              <button className="btn btn--sm btn--ghost" onClick={() => goTab('profile')}>Edit profile</button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

/* ---------- orders ---------- */
const STEPS = ['Request', 'Script', 'Draft', 'Review', 'Posted']
const stepOf = (s: CStatus) => ({ 'New request': 0, 'Script needed': 1, 'Script review': 1, 'Draft needed': 2, 'Draft review': 3, 'Revision requested': 3, Posted: 4, Completed: 5, Declined: -1 }[s])
type OFilter = 'all' | 'me' | 'brand' | 'done'
const inFilter = (o: COrder, f: OFilter) => f === 'all' || (f === 'me' ? NEEDS_ME.includes(o.status) : f === 'done' ? o.status === 'Completed' || o.status === 'Declined' : !NEEDS_ME.includes(o.status) && o.status !== 'Completed' && o.status !== 'Declined')

export function CreatorOrders({ lang }: { lang: string }) {
  const list = orders.use()
  const [toast, show] = useToast()
  const [filter, setFilter] = useState<OFilter>('all')
  const [openId, setOpenId] = useState(list.find((o) => NEEDS_ME.includes(o.status))?.id || list[0].id)
  const [script, setScript] = useState('Hook: “I gave my mum a skincare gift box for Tết — her reaction.”\nScene 1: unboxing at the kitchen table…')
  const move = (id: string, status: CStatus, event: string, msg: string) => { orders.set((l) => l.map((o) => (o.id === id ? { ...o, status } : o))); track(event, { order: id, status }); show(msg) }
  const o = list.find((x) => x.id === openId) || list[0]
  const step = stepOf(o.status)
  const shown = list.filter((x) => inFilter(x, filter))
  const pick = (id: string) => {
    setOpenId(id)
    if (window.matchMedia('(max-width: 1100px)').matches) document.getElementById('cr2-order')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const FILTERS: [OFilter, string][] = [['all', 'All'], ['me', 'Needs you'], ['brand', 'With the brand'], ['done', 'Done']]

  return (
    <>
      <BandHead icon="inbox" title="Orders" sub="Requests from brands, and where each one stands."
        stats={[{ n: list.filter((x) => NEEDS_ME.includes(x.status)).length, l: 'need you', hot: true }, { n: list.filter((x) => inFilter(x, 'brand')).length, l: 'with the brand' }, { n: list.filter((x) => x.status === 'Completed').length, l: 'completed' }, { n: vnd(list.filter((x) => x.status !== 'Declined').reduce((s, x) => s + x.amount, 0)), l: 'order value' }]} />

      <div className="wb2-seg cr2-seg" role="group" aria-label="Show">
        {FILTERS.map(([k, l]) => <button key={k} aria-pressed={filter === k} onClick={() => { setFilter(k); track('filter_changed', { status: k, source: 'creator_orders' }) }}>{l}<span>{list.filter((x) => inFilter(x, k)).length}</span></button>)}
      </div>

      <div className="cr2-orders">
        <ul className="cr2-olist" aria-label="Orders">
          {shown.map((x) => (
            <li key={x.id}>
              <button className={`cr2-orow ${x.id === o.id ? 'is-on' : ''} ${NEEDS_ME.includes(x.status) ? 'is-me' : ''}`} onClick={() => pick(x.id)} aria-label={`Open ${x.id}`} aria-current={x.id === o.id}>
                <span className="cr2-logo">{brandMono(x.brand)}</span>
                <span className="cr2-orow__t">
                  <b>{x.brand}</b>
                  <small><PlatformIcon name={x.platform} size={13} />{x.pkg}</small>
                  <span className="cr2-orow__m"><Pill>{x.status}</Pill>{x.status === 'Completed' || x.status === 'Declined' ? null : <Due d={x.due} />}</span>
                </span>
                <span className="cr2-orow__amt num">{vnd(x.amount)}</span>
              </button>
            </li>
          ))}
          {shown.length === 0 ? <li className="wb2-empty"><b>No orders here</b><p>Try another filter.</p></li> : null}
        </ul>

        <section className="cr2-order" id="cr2-order" aria-live="polite">
          <header className="cr2-order__h">
            <span className="cr2-logo cr2-logo--lg">{brandMono(o.brand)}</span>
            <div><small>{o.id} · {o.campaign}</small><h3>{o.brand}</h3><p><PlatformIcon name={o.platform} size={14} />{o.pkg} · <b>{vnd(o.amount)}</b>{o.status === 'Completed' || o.status === 'Declined' ? null : <> · <Due d={o.due} /></>}</p></div>
            <Pill>{o.status}</Pill>
          </header>
          {step >= 0 ? (
            <ol className="cr2-steps" aria-label="Progress">
              {STEPS.map((s, i) => <li key={s} className={i < step ? 'is-done' : i === step ? 'is-now' : ''}><i />{s}</li>)}
            </ol>
          ) : null}
          {o.note ? (
            <div className={`cr2-note2 ${o.status === 'Revision requested' ? 'is-rev' : ''}`}>
              <span className="cr2-logo">{brandMono(o.brand)}</span>
              <div><small>{o.status === 'Revision requested' ? 'Revision request from the brand' : 'From the brand'}</small><p>{o.note}</p></div>
            </div>
          ) : null}

          {o.status === 'New request' && (
            <div className="cr2-acts">
              <button className="btn" onClick={() => move(o.id, 'Script needed', 'order_accepted', 'Order accepted. The brand has been told.')} data-cta="ws_creator_accept_order">Accept order<Arrow size={14} /></button>
              <button className="btn btn--ghost" onClick={() => move(o.id, 'Declined', 'order_declined', 'Order declined')} data-cta="ws_creator_decline_order">Decline</button>
            </div>
          )}
          {o.status === 'Script needed' && (
            <div className="cr2-scriptbox">
              <label><span>Script</span><textarea value={script} onChange={(e) => setScript(e.target.value)} /></label>
              <div className="cr2-acts">
                <button className="btn" onClick={() => move(o.id, 'Script review', 'script_submitted', 'Script sent to the brand')} data-cta="ws_creator_submit_script">Submit script<Arrow size={14} /></button>
                <Link className="tlink small" href={href(lang, '/tools/script-studio')} prefetch={false} data-cta="ws_creator_order_to_script_studio">Write it in Script Studio<Arrow size={14} /></Link>
              </div>
            </div>
          )}
          {o.status === 'Script review' && (
            <div className="cr2-wait"><Icon name="clock" size={16} /><span>Waiting for the brand to approve your script. <button className="ulink" onClick={() => move(o.id, 'Draft needed', 'demo_brand_approved_script', 'Demo: the brand approved the script')}>Demo: brand approves</button></span></div>
          )}
          {(o.status === 'Draft needed' || o.status === 'Revision requested') && (
            <button type="button" className="cr2-drop" data-cta="ws_creator_upload_draft" onClick={() => move(o.id, 'Draft review', 'draft_uploaded', 'Draft uploaded. The brand will review it.')}>
              <span><Icon name="upload" size={18} /></span><b>{o.status === 'Draft needed' ? 'Upload your draft video' : 'Upload a new draft'}</b><small>MP4 or MOV. The brand reviews it before you post.</small>
            </button>
          )}
          {o.status === 'Draft review' && (
            <div className="cr2-wait"><Icon name="clock" size={16} /><span>The brand is reviewing your draft.{' '}
              <button className="ulink" onClick={() => move(o.id, 'Posted', 'demo_brand_approved_draft', 'Demo: draft approved. Post it and paste the link.')}>Demo: brand approves</button> ·{' '}
              <button className="ulink" onClick={() => { orders.set((l) => l.map((x) => (x.id === o.id ? { ...x, note: 'Please make the first three seconds faster and keep the product in frame.' } : x))); move(o.id, 'Revision requested', 'demo_brand_requested_revision', 'Demo: the brand asked for a revision') }}>Demo: brand asks for a revision</button></span></div>
          )}
          {o.status === 'Posted' && (
            <div className="cr2-acts"><button className="btn" onClick={() => move(o.id, 'Completed', 'order_completed', 'Marked as posted. Payout is on its way.')} data-cta="ws_creator_confirm_posted">Confirm post link</button><small className="cr2-muted">Payment is released once the brand confirms.</small></div>
          )}
          {o.status === 'Completed' && <div className="cr2-ok"><Icon name="check" size={16} />Completed and paid. <button className="ulink" onClick={() => goTab('earnings')}>See it under Earnings</button></div>}
          {o.status === 'Declined' && <div className="cr2-wait"><Icon name="close" size={16} />You declined this order.</div>}
        </section>
      </div>
      {toast}
    </>
  )
}

/* ---------- scripts ---------- */
export function CreatorScripts({ lang }: { lang: string }) {
  const toFix = SCRIPTS.filter((s) => !/passed/i.test(s.check)).length
  return (
    <>
      <BandHead icon="pen" title="Script Studio" sub="Write scripts from proven hooks and check them against the brand’s brief before you film."
        stats={[{ n: SCRIPTS.length, l: 'recent scripts' }, { n: SCRIPTS.length - toFix, l: 'passed the check' }, { n: toFix, l: 'need a fix', hot: toFix > 0 }]}>
        <Link className="btn btn--sm" href={href(lang, '/tools/script-studio')} data-cta="ws_creator_open_script_studio" prefetch={false}>Open Script Studio<Arrow size={14} /></Link>
      </BandHead>
      <div className="cr2-split">
        <section className="wb2-card">
          <div className="cr2-cardh"><h3>Recent scripts</h3></div>
          <ul className="cr2-scripts">
            {SCRIPTS.map((s) => {
              const ok = /passed/i.test(s.check)
              return (
                <li key={s.title}>
                  <span className={`wb2-ico ${ok ? '' : 'wb2-ico--lime'}`}><Icon name="pen" size={16} /></span>
                  <div><b>{s.title}</b><small>{s.order} · {s.updated}</small><span className={`cr2-check2 ${ok ? 'is-ok' : 'is-fix'}`}><Icon name={ok ? 'check' : 'bell'} size={12} />{s.check}</span></div>
                  <Link className="btn btn--ghost btn--sm" href={href(lang, '/tools/script-studio')} prefetch={false} data-cta="ws_creator_open_script">Open</Link>
                </li>
              )
            })}
          </ul>
        </section>
        <section className="cr2-aicard is-on">
          <div className="cr2-cardh"><h3>What it does</h3></div>
          <ul className="cr2-does">
            <li><span><Icon name="list" size={15} /></span><div><b>Hook bank</b><small>Sorted by category and market.</small></div></li>
            <li><span><Icon name="shield" size={15} /></span><div><b>Guideline check</b><small>Against the brand’s brief, before you film.</small></div></li>
            <li><span><Icon name="download" size={15} /></span><div><b>PDF export</b><small>Send it to the brand for approval.</small></div></li>
          </ul>
        </section>
      </div>
    </>
  )
}

/* ---------- PDFs ---------- */
export function CreatorPdfs({ lang }: { lang: string }) {
  const [toast, show] = useToast()
  const [l, setL] = useState(lang)
  const docs = [
    { id: 'analytics', name: 'Audience analytics', sub: 'Followers by country, age and gender, plus your last 30 days', pages: '4 pages', icon: 'chart' },
    { id: 'ratecard', name: 'Rate card', sub: 'Your packages and prices, with your channel numbers on the cover', pages: '2 pages', icon: 'card' },
  ]
  return (
    <>
      <BandHead icon="download" title="PDF exports" sub="Send brands a clean PDF of your numbers or your prices."
        stats={[{ n: docs.length, l: 'documents' }, { n: LOCALE_NAMES[l as keyof typeof LOCALE_NAMES], l: 'PDF language' }]}>
        <label className="cr2-lang"><span>PDF language</span>
          <select value={l} onChange={(e) => setL(e.target.value)}>{LOCALES.map((x) => <option key={x} value={x}>{LOCALE_NAMES[x]}</option>)}</select>
        </label>
      </BandHead>
      <div className="cr2-pdfs">
        {docs.map((d) => (
          <article className="wb2-card cr2-pdfcard" key={d.id}>
            <div className="cr2-paper" aria-hidden="true">
              <span className="cr2-paper__ico"><Icon name={d.icon} size={18} /></span>
              <b>{d.name}</b><i /><i /><i /><i className="is-short" />
              <em>{d.pages}</em>
            </div>
            <div className="cr2-pdfcard__t"><b>{d.name}</b><small>{d.sub} · {d.pages}</small></div>
            <button className="btn" data-cta={`ws_creator_export_pdf_${d.id}`} onClick={() => { show(`${d.name} PDF prepared in ${LOCALE_NAMES[l as keyof typeof LOCALE_NAMES]} (mock download)`); track('pdf_exported', { doc: d.id, language: l }) }}>
              <Icon name="download" size={16} />Export as PDF
            </button>
          </article>
        ))}
      </div>
      <div className="cr2-wait"><Icon name="lock" size={16} /><span>PDF export is part of paid plans. The PDF follows the site’s language unless you pick another one here.</span></div>
      {toast}
    </>
  )
}

/* ---------- earnings ---------- */
export function CreatorEarnings() {
  const paid = PAYOUTS.filter((p) => p.status === 'Paid').reduce((a, p) => a + p.amount, 0)
  const pending = PAYOUTS.filter((p) => p.status !== 'Paid').reduce((a, p) => a + p.amount, 0)
  const max = Math.max(...PAYOUTS.map((p) => p.amount))
  const byDate = [...PAYOUTS].sort((a, b) => a.date.localeCompare(b.date))
  return (
    <>
      <BandHead icon="card" title="Earnings" sub="Payouts are sent in your rate-card currency. Sample figures."
        stats={[{ n: vnd(paid), l: 'paid out, last 30 days', hot: true }, { n: vnd(pending), l: 'pending brand approval' }, { n: '3 days', l: 'average payout time' }]} />
      <section className="wb2-card cr2-chart">
        <div className="cr2-cardh"><h3>Payouts over time</h3><span className="cr2-legend"><i />Paid<i className="is-pend" />Pending</span></div>
        <div className="cr2-bars">
          {byDate.map((p) => (
            <div key={p.id} className={p.status === 'Paid' ? '' : 'is-pend'} title={`${p.id} · ${vnd(p.amount)}`}>
              <span className="num">{vnd(p.amount)}</span>
              <i style={{ height: `${(p.amount / max) * 100}%` }} />
              <small>{fmtDate(p.date).replace(/ 2026$/, '')}</small>
            </div>
          ))}
        </div>
      </section>
      <section className="wb2-card cr2-pay">
        <div className="cr2-cardh"><h3>Payout history</h3></div>
        <div className="cr2-pay__h" aria-hidden="true"><span>Payout</span><span>Date</span><span>For</span><span>Amount</span><span>Status</span></div>
        <ol>
          {PAYOUTS.map((p) => (
            <li key={p.id}>
              <span className="cr2-pay__id"><span className={`wb2-ico ${p.status === 'Paid' ? '' : 'wb2-ico--lime'}`}><Icon name={p.status === 'Paid' ? 'check' : 'clock'} size={15} /></span><b>{p.id}</b></span>
              <span data-k="Date">{fmtDate(p.date)}</span>
              <span data-k="For">{p.what}</span>
              <span data-k="Amount" className="cr2-pay__amt">{vnd(p.amount)}</span>
              <span data-k="Status"><Pill>{p.status}</Pill></span>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
