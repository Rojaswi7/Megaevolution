'use client'
// MegaEvolution team workspace screens: home, Agency Orders (compact / full, pricing options), AI Listup,
// Campaign Inbox, reports, clients. Every screen opens with the shared navy band.
import Link from 'next/link'
import { useMemo, useState } from 'react'
import '@/styles/brand-home.css'
import '@/styles/ws-agency.css'
import { href } from '@/data/site'
import { creatorByHandle, CREATORS } from '@/data/creators'
import { AGENCY_ORDERS, THREADS, type AgencyOrder, type Thread } from '@/data/workspace'
import { REPORTS, CLIENT_INVOICES, AGENCY_NOTIFICATIONS } from '@/data/workspaceAgency'
import { track } from '@/lib/track'
import { Icon, Arrow, Flag } from '../../Icon'
import { Money } from '../../Money'
import { Pill } from '../Shell'
import { useToast, goTab, CreatorCell, Market } from '../brand/common'
import { BandHead } from '../common-b'

const STAGES: AgencyOrder['stage'][] = ['Listing', 'Brand approval', 'Contracting', 'Live', 'Reporting']
const PRICING: AgencyOrder['pricing'][] = ['Per creator', 'Package', 'Management fee %']
const PRICING_NOTE: Record<string, string> = {
  'Per creator': 'The client sees each creator’s fee as its own line.',
  Package: 'One price for the whole set of creators. Individual fees stay internal.',
  'Management fee %': 'Creator fees at cost, plus a management fee (rate TBD) on top.',
}
const avTone = (handle: string) => { const c = creatorByHandle[handle]; return c ? (c.tone + 5) % 8 : 2 }
const monogram = (s: string) => s.replace(/\(.*?\)/g, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

function StageTrack({ stage }: { stage: AgencyOrder['stage'] }) {
  const at = STAGES.indexOf(stage)
  return (
    <ol className="ag-track" aria-label={`Stage: ${stage}`}>
      {STAGES.map((s, i) => <li key={s} className={i < at ? 'is-done' : i === at ? 'is-now' : ''}><i />{s}</li>)}
    </ol>
  )
}

// ---------- Home ----------
export function AgencyHome({ lang }: { lang: string }) {
  const waiting = AGENCY_ORDERS.flatMap((o) => o.listings).filter((l) => l.status === 'Proposed').length
  const unread = THREADS.filter((t) => t.unread).length
  const budget = AGENCY_ORDERS.reduce((s, o) => s + o.budgetUsd, 0)
  const committed = AGENCY_ORDERS.flatMap((o) => o.listings).filter((l) => l.status !== 'Declined' && l.status !== 'Proposed').reduce((s, l) => s + l.feeUsd, 0)
  const live = AGENCY_ORDERS.filter((o) => o.stage === 'Live').length
  const ready = REPORTS.filter((r) => r.status === 'Ready').length
  const clients = Array.from(new Set(AGENCY_ORDERS.map((o) => o.client)))
  const needs = [
    waiting ? { icon: 'list', t: `${waiting} listing${waiting === 1 ? '' : 's'} waiting on brands`, s: 'Nudge the client or swap creators.', to: 'agency-orders', cta: 'Open orders', tag: 'Orders' } : null,
    unread ? { icon: 'mail', t: `${unread} unread creator repl${unread === 1 ? 'y' : 'ies'}`, s: 'AI drafts are ready to edit and send.', to: 'messages', cta: 'Reply', tag: 'Inbox' } : null,
    ready ? { icon: 'chart', t: `${ready} report${ready === 1 ? '' : 's'} ready for the client`, s: 'Export the PDF and send it over.', to: 'reports', cta: 'Send', tag: 'Reports' } : null,
  ].filter(Boolean) as { icon: string; t: string; s: string; to: string; cta: string; tag: string }[]

  return (
    <>
      <section className="bh-hero" aria-label="Today">
        <div className="bh-hero__copy">
          <p className="bh-hero__date">Friday, 20 Nov · MegaEvolution team</p>
          <h2>Good morning, <span className="it">Daniel.</span></h2>
          <p><b>{AGENCY_ORDERS.length} campaigns</b> for <b>{clients.length} clients</b>, {live} live right now. <b>{needs.length} things</b> need you.</p>
        </div>
        <div className="bh-quick">
          <Link href={href(lang, '/tools/ai-listup')} data-cta="agency_home_ai_listup" prefetch={false}><Icon name="sparkle" size={18} /><b>New AI Listup</b><small>Brief in, creators out</small></Link>
          <button onClick={() => goTab('agency-orders')} data-cta="agency_home_orders"><Icon name="list" size={18} /><b>Agency Orders</b><small>{AGENCY_ORDERS.length} campaigns</small></button>
          <button onClick={() => goTab('messages')} data-cta="agency_home_inbox"><Icon name="inbox" size={18} /><b>Campaign Inbox</b><small>{unread} unread</small></button>
          <Link href={href(lang, '/tools/performance-report')} data-cta="agency_home_report" prefetch={false}><Icon name="chart" size={18} /><b>New report</b><small>From post links</small></Link>
        </div>
      </section>

      <div className="bh-kpis">
        <button className="bh-kpi" onClick={() => goTab('agency-orders')}><span className="bh-kpi__ico"><Icon name="list" size={17} /></span><b className="num">{AGENCY_ORDERS.length}</b><span className="bh-kpi__l">Agency orders</span><span className="bh-kpi__bar"><i style={{ width: `${(live / AGENCY_ORDERS.length) * 100}%` }} /></span><small>{live} live now</small></button>
        <button className="bh-kpi" onClick={() => goTab('agency-orders')}><span className="bh-kpi__ico"><Icon name="users" size={17} /></span><b className="num">{waiting}</b><span className="bh-kpi__l">Listings waiting on brands</span><span className="bh-kpi__bar"><i style={{ width: waiting ? '100%' : '0' }} /></span><small>proposed, not yet approved</small></button>
        <button className="bh-kpi" onClick={() => goTab('messages')}><span className="bh-kpi__ico"><Icon name="mail" size={17} /></span><b className="num">{unread}</b><span className="bh-kpi__l">Unread creator replies</span><span className="bh-kpi__bar"><i style={{ width: `${(unread / THREADS.length) * 100}%` }} /></span><small>Gmail connected</small></button>
        <div className="bh-kpi bh-kpi--spend"><span className="bh-kpi__ico"><Icon name="card" size={17} /></span><b className="num"><Money usd={budget} /></b><span className="bh-kpi__l">Budget under management</span><span className="bh-kpi__bar"><i style={{ width: `${(committed / budget) * 100}%` }} /></span><small><Money usd={committed} /> committed to creators</small></div>
      </div>

      <div className="bh-cols">
        <div className="bh-col">
          <section className="wcard bh-needs">
            <div className="wcard__h"><h3>Needs you</h3><span className="bh-count">{needs.length}</span></div>
            <ol>
              {needs.map((n, i) => (
                <li key={n.t}>
                  <span className="bh-needs__ico"><Icon name={n.icon} size={17} /></span>
                  <div><b>{n.t}</b><small><em>{n.tag}</em>{n.s}</small></div>
                  <button className={`btn btn--sm ${i ? 'btn--ghost' : ''}`} onClick={() => goTab(n.to)} data-cta="agency_home_needs_you">{n.cta}<Arrow size={13} /></button>
                </li>
              ))}
            </ol>
          </section>
          <section className="wcard">
            <div className="wcard__h"><h3>Campaign pipeline</h3><button className="ulink small" onClick={() => goTab('agency-orders')}>Open Agency Orders</button></div>
            <div className="ag-pipe">
              {AGENCY_ORDERS.map((o) => (
                <button key={o.id} className="ag-pipe__row" onClick={() => goTab('agency-orders')} data-cta="agency_home_pipeline_row">
                  <span className="ag-pipe__t"><b>{o.title}</b><small>{o.client} · {o.id} · <span className="ag-flags">{o.markets.map((m) => <Flag key={m} market={m} />)}</span></small></span>
                  <StageTrack stage={o.stage} />
                </button>
              ))}
            </div>
          </section>
        </div>
        <div className="bh-col">
          <section className="wcard bh-feed">
            <div className="wcard__h"><h3>Latest</h3><button className="ulink small" onClick={() => goTab('alerts')}>All alerts</button></div>
            <ol>
              {AGENCY_NOTIFICATIONS.slice(0, 4).map((n) => (
                <li key={n.text}>
                  <span className="bh-feed__ico"><Icon name={n.to === 'messages' ? 'mail' : n.to === 'reports' ? 'chart' : n.to === 'team' ? 'users' : 'list'} size={14} /></span>
                  <div><button onClick={() => goTab(n.to)}>{n.text}</button><small>{n.when}</small></div>
                </li>
              ))}
            </ol>
          </section>
          <section className="wcard">
            <div className="wcard__h"><h3>Clients</h3><button className="ulink small" onClick={() => goTab('clients')}>All clients</button></div>
            <ul className="ag-mini">
              {clients.map((c) => {
                const os = AGENCY_ORDERS.filter((o) => o.client === c)
                return <li key={c}><span className="ag-logo">{monogram(c)}</span><span><b>{c}</b><small>{os.length} order{os.length === 1 ? '' : 's'} · <Money usd={os.reduce((s, o) => s + o.budgetUsd, 0)} /></small></span></li>
              })}
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}

// ---------- Agency Orders ----------
export function AgencyOrdersScreen({ lang }: { lang: string }) {
  const [view, setView] = useState<'compact' | 'full'>('full')
  const [orders, setOrders] = useState(AGENCY_ORDERS)
  const [adding, setAdding] = useState<string | null>(null)
  const [toast, show] = useToast()
  const patch = (id: string, p: Partial<AgencyOrder>) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, ...p } : o)))
  const advance = (o: AgencyOrder) => {
    const next = STAGES[Math.min(STAGES.indexOf(o.stage) + 1, STAGES.length - 1)]
    patch(o.id, { stage: next }); track('agency_order_stage_moved', { order: o.id, to: next }); show(`${o.id} moved to ${next}`)
  }
  const add = (o: AgencyOrder, handle: string) => {
    const c = creatorByHandle[handle]; if (!c) return
    patch(o.id, { listings: [...o.listings, { creator: handle, market: c.market, status: 'Proposed', feeUsd: c.rateUsd, option: `1 ${c.platforms[0].platform} video` }] })
    setAdding(null); track('listing_added', { order: o.id, creator: handle }); show(`@${handle} added as Proposed`)
  }
  const pickView = (v: typeof view) => { setView(v); track('agency_orders_view', { view: v }) }
  const all = orders.flatMap((o) => o.listings)

  return (
    <>
      <BandHead icon="list" title="Agency Orders" sub="Listings and orders for every client campaign."
        stats={[{ n: orders.length, l: 'campaigns' }, { n: orders.filter((o) => o.stage === 'Live').length, l: 'live now' }, { n: all.filter((l) => l.status === 'Proposed').length, l: 'waiting on brands', hot: true }, { n: <Money usd={orders.reduce((s, o) => s + o.budgetUsd, 0)} />, l: 'total budget' }]}>
        <div className="ag-viewseg" role="group" aria-label="View">
          <button aria-pressed={view === 'compact'} onClick={() => pickView('compact')}>Compact</button>
          <button aria-pressed={view === 'full'} onClick={() => pickView('full')}>Full</button>
        </div>
      </BandHead>

      {view === 'compact' ? (
        <div className="wb2-card ag-rows">
          <div className="ag-rows__h" aria-hidden="true"><span>Campaign</span><span>Markets</span><span>Stage</span><span>Listings</span><span>Budget</span><span /></div>
          <ol>
            {orders.map((o) => (
              <li key={o.id}>
                <span className="ag-rows__t"><b>{o.title}</b><small>{o.id} · {o.client} · {o.pricing}</small></span>
                <span data-k="Markets" className="ag-flags">{o.markets.map((m) => <Market key={m} id={m} />)}</span>
                <span data-k="Stage"><Pill>{o.stage}</Pill></span>
                <span data-k="Listings">{o.listings.filter((l) => l.status !== 'Declined').length} active · <b>{o.listings.filter((l) => l.status === 'Proposed').length}</b> proposed</span>
                <span data-k="Budget" className="ag-money"><Money usd={o.budgetUsd} /></span>
                <span><button className="btn btn--sm btn--ghost" data-cta="agency_order_open_full" onClick={() => pickView('full')}>Open<Arrow size={13} /></button></span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="ag-orders">
          {orders.map((o) => {
            const active = o.listings.filter((l) => l.status !== 'Declined')
            const committed = active.filter((l) => l.status !== 'Proposed').reduce((s, l) => s + l.feeUsd, 0)
            const proposed = active.filter((l) => l.status === 'Proposed').reduce((s, l) => s + l.feeUsd, 0)
            const left = o.budgetUsd - committed - proposed
            const pool = CREATORS.filter((c) => o.markets.includes(c.market) && !o.listings.some((l) => l.creator === c.handle)).slice(0, 6)
            const next = STAGES[STAGES.indexOf(o.stage) + 1]
            return (
              <article className="ag-order" key={o.id}>
                <header className="ag-order__h">
                  <div>
                    <small>{o.id} · {o.client}</small>
                    <h3>{o.title}</h3>
                    <p className="ag-order__meta"><span className="ag-mgr"><span className="ag-logo ag-logo--sm">{monogram(o.manager)}</span>Manager {o.manager}</span><span className="ag-flags">{o.markets.map((m) => <Market key={m} id={m} />)}</span></p>
                  </div>
                  <div className="ag-order__act">
                    <Pill>{o.stage}</Pill>
                    {next ? <button className="btn btn--sm" data-cta="agency_order_move_stage" onClick={() => advance(o)}>Move to {next}<Arrow size={13} /></button> : null}
                  </div>
                </header>
                <StageTrack stage={o.stage} />

                <div className="ag-money-panel">
                  <div className="ag-money-panel__n">
                    <span><small>Budget</small><b className="num"><Money usd={o.budgetUsd} /></b></span>
                    <span><small><i className="is-c" />Committed</small><b className="num"><Money usd={committed} /></b></span>
                    <span><small><i className="is-p" />Proposed</small><b className="num"><Money usd={proposed} /></b></span>
                    <span><small><i />Left</small><b className={`num ${left < 0 ? 'is-over' : ''}`}><Money usd={left} /></b></span>
                  </div>
                  <div className="ag-split" aria-hidden="true">
                    <i className="is-c" style={{ flex: committed }} /><i className="is-p" style={{ flex: proposed }} /><i style={{ flex: Math.max(left, 0) }} />
                  </div>
                  <div className="ag-pricing">
                    <small>Pricing shown to the client</small>
                    <div className="wb2-seg" role="group" aria-label="Pricing option">
                      {PRICING.map((p) => <button key={p} aria-pressed={o.pricing === p} data-cta="agency_order_pricing_option" onClick={() => { patch(o.id, { pricing: p }); track('agency_order_pricing_changed', { order: o.id, pricing: p }) }}>{p}</button>)}
                    </div>
                    <p>{PRICING_NOTE[o.pricing]}</p>
                  </div>
                </div>

                <div className="ag-list">
                  {o.listings.map((l) => (
                    <div key={l.creator} className={`ag-li ${l.status === 'Proposed' ? 'is-prop' : ''} ${l.status === 'Declined' ? 'is-out' : ''}`}>
                      <CreatorCell handle={l.creator} lang={lang} />
                      <span className="ag-li__opt">{l.option}</span>
                      <span className="ag-li__fee">{o.pricing === 'Package' ? <small>in package</small> : <b className="num"><Money usd={l.feeUsd} /></b>}</span>
                      <Pill>{l.status}</Pill>
                    </div>
                  ))}
                </div>

                <footer className="ag-order__foot">
                  {adding === o.id ? (
                    <div className="ag-add">
                      <p>Suggested for {o.markets.map((m) => m.toUpperCase()).join(', ')}</p>
                      <div className="ag-add__pool">
                        {pool.map((c) => (
                          <button key={c.handle} data-cta="agency_order_add_creator_pick" onClick={() => add(o, c.handle)}>
                            <span className={`av tone-${avTone(c.handle)}`}>{c.name[0]}</span>
                            <span><b>@{c.handle}</b><small><Money usd={c.rateUsd} /> · {c.platforms[0].platform}</small></span>
                            <Icon name="plus" size={15} />
                          </button>
                        ))}
                      </div>
                      <button className="ulink small" onClick={() => setAdding(null)}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <button className="btn btn--sm btn--ghost" data-cta="agency_order_add_creator" onClick={() => setAdding(o.id)}><Icon name="plus" size={14} />Add a creator</button>
                      <Link className="tlink small" href={href(lang, '/tools/ai-listup')} data-cta="agency_order_listup" prefetch={false}><Icon name="sparkle" size={14} />Fill from AI Listup<Arrow size={14} /></Link>
                    </>
                  )}
                </footer>
              </article>
            )
          })}
        </div>
      )}
      {toast}
    </>
  )
}

// ---------- AI Listup shortcut ----------
const LISTUP_STEPS = [
  { t: 'Paste the brief', d: 'Product, market, budget and what to avoid.', icon: 'pen' },
  { t: 'Review the list', d: 'Each creator checked against your Must / Nice / Avoid cards.', icon: 'list' },
  { t: 'Pick the order', d: 'Choose which Agency Order the creators go into.', icon: 'building' },
  { t: 'Listings created', d: 'They land as Proposed, ready for the client.', icon: 'check' },
]
export function ListupCard({ lang }: { lang: string }) {
  const sample = CREATORS.filter((c) => c.market === 'vn' && c.category === 'beauty').slice(0, 3)
  return (
    <>
      <BandHead icon="sparkle" title="AI Listup" sub="Brief in, checked creator list out, straight into a listing.">
        <Link className="btn btn--sm" href={href(lang, '/tools/ai-listup')} data-cta="agency_listup_open" prefetch={false}>Open AI Listup<Arrow size={14} /></Link>
      </BandHead>
      <div className="ag-lu">
        <ol className="ag-lu__steps">
          {LISTUP_STEPS.map((s, i) => (
            <li key={s.t} className="wb2-card">
              <span className="ag-lu__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="wb2-ico wb2-ico--lime"><Icon name={s.icon} size={17} /></span>
              <b>{s.t}</b><small>{s.d}</small>
            </li>
          ))}
        </ol>
        <section className="ag-lu__demo" aria-label="Example run">
          <p className="ag-lu__k">Example run · sample data</p>
          <blockquote>“Serum launch in Vietnam. Beauty creators, 100K–500K on TikTok, honest reviews. No one who promoted a competitor in the last 6 months.”</blockquote>
          <div className="ag-lu__cards">
            <span className="is-must">Must · Vietnam, TikTok</span><span className="is-nice">Nice · skincare routines</span><span className="is-avoid">Avoid · competitor posts</span>
          </div>
          <ul className="ag-lu__res">
            {sample.map((c, i) => (
              <li key={c.handle}>
                <span className={`av tone-${avTone(c.handle)}`}>{c.name[0]}</span>
                <span><b>@{c.handle}</b><small><Flag market={c.market} /> {c.platforms[0].platform}</small></span>
                <em>{[96, 91, 87][i]}% match</em>
              </li>
            ))}
          </ul>
          <div className="ag-lu__cta">
            <Link className="btn btn--sm" href={href(lang, '/tools/ai-listup')} data-cta="agency_listup_open_demo" prefetch={false}>Try it with a real brief<Arrow size={14} /></Link>
            <button className="ulink small" data-cta="agency_listup_to_orders" onClick={() => goTab('agency-orders')}>See Agency Orders</button>
          </div>
        </section>
      </div>
    </>
  )
}

// ---------- Campaign Inbox ----------
const BOARD = ['New', 'Negotiating', 'Agreed', 'Posted'] as const
export function AgencyInbox({ lang }: { lang: string }) {
  const [gmail, setGmail] = useState(true)
  const [q, setQ] = useState('')
  const [mode, setMode] = useState<'board' | 'list'>('board')
  const [threads, setThreads] = useState<Thread[]>(THREADS)
  const [open, setOpen] = useState(THREADS[0].id)
  const [reply, setReply] = useState('')
  const [toast, show] = useToast()
  const shown = useMemo(() => { const t = q.trim().toLowerCase(); return threads.filter((x) => !t || `${x.from} ${x.creator} ${x.subject} ${x.preview}`.toLowerCase().includes(t)) }, [q, threads])
  const t = threads.find((x) => x.id === open) || threads[0]
  const unread = threads.filter((x) => x.unread).length
  const pick = (id: string) => {
    setOpen(id); setReply(''); setThreads((l) => l.map((x) => (x.id === id ? { ...x, unread: false } : x))); track('thread_opened', { thread: id })
    document.getElementById('ag-thread')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
  const send = () => { track('reply_sent', { thread: t.id, length: reply.length }); setReply(''); show(`Reply sent to ${t.from} from Gmail (mock)`) }
  const move = (stage: Thread['stage']) => { setThreads((l) => l.map((x) => (x.id === t.id ? { ...x, stage } : x))); track('thread_stage_moved', { thread: t.id, stage }) }

  if (!gmail) {
    return (
      <>
        <BandHead icon="inbox" title="Campaign Inbox" sub="Creator email, on a board." />
        <div className="wb2-empty ag-connect">
          <span className="wb2-ico wb2-ico--lime"><Icon name="mail" size={20} /></span>
          <b>Connect Gmail to see creator replies here</b>
          <p>Threads with creators are pulled into a board by stage. Nothing else in your mailbox is read.</p>
          <button className="btn" data-cta="inbox_connect_gmail" onClick={() => { setGmail(true); track('gmail_connected'); show('Gmail connected (mock)') }}>Connect Gmail<Arrow /></button>
        </div>
        {toast}
      </>
    )
  }
  return (
    <>
      <BandHead icon="inbox" title="Campaign Inbox" sub={<>Creator email on a board, with AI-drafted replies. {unread ? <b>{unread} unread.</b> : null}</>}
        stats={BOARD.map((s) => ({ n: threads.filter((x) => x.stage === s).length, l: s, hot: s === 'Negotiating' }))}>
        <span className="ag-gmail"><i />Gmail connected<button data-cta="inbox_disconnect_gmail" onClick={() => { setGmail(false); track('gmail_disconnected') }}>Disconnect</button></span>
      </BandHead>

      <div className="ag-inbar">
        <label className="wb2-search ag-inbar__s"><Icon name="search" size={16} /><span className="sr">Search email</span><input value={q} onChange={(e) => { setQ(e.target.value); if (e.target.value.length > 2) track('search', { query: e.target.value, source: 'campaign_inbox' }) }} placeholder="Search email by creator, subject or text" /></label>
        <div className="wb2-seg" role="group" aria-label="Layout"><button aria-pressed={mode === 'board'} onClick={() => setMode('board')}>Creator board</button><button aria-pressed={mode === 'list'} onClick={() => setMode('list')}>List</button></div>
      </div>

      {mode === 'board' ? (
        <div className="ag-board">
          {BOARD.map((s) => {
            const items = shown.filter((x) => x.stage === s)
            return (
              <div className="ag-board__col" key={s}>
                <h4><span>{s}</span><em>{items.length}</em></h4>
                {items.map((x) => (
                  <button className={`ag-tcard ${x.id === t.id ? 'is-on' : ''} ${x.unread ? 'is-new' : ''}`} key={x.id} data-cta="inbox_open_thread" onClick={() => pick(x.id)}>
                    <span className="ag-tcard__who"><span className={`av tone-${avTone(x.creator || '')}`}>{x.from[0]}</span><b>{x.from}</b><small>{x.when}</small></span>
                    <span className="ag-tcard__s">{x.subject}</span>
                    <span className="ag-tcard__p">{x.preview}</span>
                  </button>
                ))}
                {!items.length ? <p className="ag-board__none">Nothing here</p> : null}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="wb2-card ag-tlist">
          {shown.map((x) => (
            <button className={`ag-tlist__row ${x.id === t.id ? 'is-on' : ''} ${x.unread ? 'is-new' : ''}`} key={x.id} data-cta="inbox_open_thread" onClick={() => pick(x.id)}>
              <span className={`av tone-${avTone(x.creator || '')}`}>{x.from[0]}</span>
              <span className="ag-tlist__t"><b>{x.from} · {x.subject}</b><small>{x.preview}</small></span>
              <Pill>{x.stage}</Pill><small className="ag-tlist__w">{x.when}</small>
            </button>
          ))}
          {!shown.length ? <p className="wb2-none">No email matches “{q}”.</p> : null}
        </div>
      )}

      <section className="ag-thread" id="ag-thread" aria-label={`Thread: ${t.subject}`}>
        <header className="ag-thread__h">
          <div><small>Thread</small><h3>{t.subject}</h3></div>
          <div className="ag-stagepick" role="group" aria-label="Move to stage">
            {BOARD.map((s) => <button key={s} aria-pressed={t.stage === s} onClick={() => move(s)}>{s}</button>)}
          </div>
        </header>
        {t.creator ? <CreatorCell handle={t.creator} lang={lang} /> : null}
        <div className="ag-bubble"><p>{t.preview}</p><small>{t.from} · {t.when}</small></div>
        <div className="ag-compose">
          <div className="ag-compose__h">
            <span>Reply as agency@northside.example</span>
            <button className="btn btn--sm btn--ghost" data-cta="inbox_insert_ai_draft" onClick={() => { setReply(t.aiDraft); track('ai_draft_inserted', { thread: t.id }) }}><Icon name="sparkle" size={14} />Insert AI draft</button>
          </div>
          <label className="sr" htmlFor="wa-reply">Reply</label>
          <textarea id="wa-reply" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply, or insert the AI draft and edit it." />
          <div className="ag-compose__f">
            <span>AI drafts are suggestions. Nothing is sent until you press send.</span>
            <button className="btn btn--sm" disabled={!reply.trim()} data-cta="inbox_send_reply" onClick={send}>Send reply<Arrow size={13} /></button>
          </div>
        </div>
      </section>
      {toast}
    </>
  )
}

// ---------- Reports ----------
export function ReportsScreen({ lang }: { lang: string }) {
  const [toast, show] = useToast()
  const ready = REPORTS.filter((r) => r.status === 'Ready').length
  return (
    <>
      <BandHead icon="chart" title="Reports" sub="One report per campaign, built from post links."
        stats={[{ n: ready, l: 'ready for clients', hot: ready > 0 }, { n: REPORTS.length - ready, l: 'collecting data' }, { n: REPORTS.reduce((s, r) => s + r.posts, 0), l: 'posts tracked' }]}>
        <Link className="btn btn--sm" href={href(lang, '/tools/performance-report')} data-cta="reports_new" prefetch={false}>New report<Arrow size={14} /></Link>
      </BandHead>
      <div className="ag-reports">
        {REPORTS.map((r, i) => {
          const isReady = r.status === 'Ready'
          return (
            <article key={r.id} className={`wb2-card ag-rep ${isReady ? 'is-ready' : ''}`}>
              <header><span className="wb2-ico wb2-ico--lime"><Icon name="chart" size={17} /></span><span className={`pill ${isReady ? 'pill--ok' : 'pill--do'}`}>{r.status}</span></header>
              <small>{r.id} · {r.order} · {r.client}</small>
              <h3>{r.title}</h3>
              <div className="ag-spark" aria-hidden="true">{[3, 5, 4, 7, 6, 9, 8].map((h, j) => <i key={j} style={{ height: `${(h + i) * 7}%`, opacity: isReady ? 1 : 0.35 }} />)}</div>
              <dl><div><dt>Posts</dt><dd className="num">{r.posts}</dd></div><div><dt>Updated</dt><dd>{r.updated.slice(5).replace('-', '/')}</dd></div></dl>
              <footer>
                <Link className="btn btn--sm btn--ghost" href={href(lang, '/tools/performance-report')} data-cta="report_open" prefetch={false}>Open</Link>
                <button className="btn btn--sm" disabled={!isReady} aria-label={`Export ${r.id} as PDF`} data-cta="report_export_pdf" onClick={() => { track('report_exported', { report: r.id }); show(`Client PDF for ${r.id} exported (mock)`) }}><Icon name="download" size={14} />PDF</button>
              </footer>
            </article>
          )
        })}
      </div>
      {toast}
    </>
  )
}

// ---------- Clients (organisations) ----------
export function ClientsScreen() {
  const [client, setClient] = useState('All')
  const [toast, show] = useToast()
  const clients = Array.from(new Set(AGENCY_ORDERS.map((o) => o.client)))
  const rows = CLIENT_INVOICES.filter((i) => client === 'All' || i.client === client)
  const paid = CLIENT_INVOICES.filter((i) => i.status === 'Paid' && !i.tbd).reduce((s, i) => s + i.amountUsd, 0)
  return (
    <>
      <BandHead icon="building" title="Clients" sub="Each client brand is an organisation with its own orders, people and invoices."
        stats={[{ n: clients.length, l: 'client brands' }, { n: AGENCY_ORDERS.length, l: 'campaigns' }, { n: <Money usd={paid} />, l: 'paid so far', hot: true }]}>
        <button className="btn btn--sm" data-cta="clients_add" onClick={() => show('New client form opens here (mock).')}><Icon name="plus" size={14} />Add a client</button>
      </BandHead>
      <div className="ag-clients">
        {clients.map((c) => {
          const os = AGENCY_ORDERS.filter((o) => o.client === c)
          const on = client === c
          return (
            <button className={`wb2-card ag-client ${on ? 'is-on' : ''}`} key={c} data-cta="clients_pick" aria-pressed={on} onClick={() => setClient(on ? 'All' : c)}>
              <span className="ag-logo ag-logo--lg">{monogram(c)}</span>
              <b>{c}</b>
              <small>{os.length} {os.length === 1 ? 'order' : 'orders'} · <Money usd={os.reduce((s, o) => s + o.budgetUsd, 0)} /> budget</small>
              <span className="ag-flags">{Array.from(new Set(os.flatMap((o) => o.markets))).map((m) => <Market key={m} id={m} />)}</span>
              <span className="ag-client__stage">{os.map((o) => <Pill key={o.id}>{o.stage}</Pill>)}</span>
            </button>
          )
        })}
      </div>
      <section className="wb2-card ag-inv">
        <div className="ag-inv__h"><h3>Per-brand invoices on shared orders{client !== 'All' ? <em>{client}</em> : null}</h3>{client !== 'All' ? <button className="ulink small" onClick={() => setClient('All')}>Show all</button> : <small>Pick a client to filter</small>}</div>
        <div className="ag-rows ag-rows--inv">
          <div className="ag-rows__h" aria-hidden="true"><span>Invoice</span><span>Client</span><span>Order</span><span>For</span><span>Amount</span><span>Status</span></div>
          <ol>
            {rows.map((i) => (
              <li key={i.id}>
                <span className="ag-rows__t"><b>{i.id}</b><small>{i.date}</small></span>
                <span data-k="Client">{i.client}</span>
                <span data-k="Order">{i.order}</span>
                <span data-k="For">{i.what}</span>
                <span data-k="Amount" className="ag-money"><Money usd={i.tbd ? 'TBD' : i.amountUsd} /></span>
                <span data-k="Status"><Pill>{i.status}</Pill></span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {toast}
    </>
  )
}
