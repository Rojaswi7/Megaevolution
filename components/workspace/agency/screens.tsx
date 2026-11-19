'use client'
// Agency workspace screens: home, Agency Orders (compact / full, pricing options), Campaign Inbox, reports, clients.
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { href } from '@/data/site'
import { creatorByHandle, CREATORS } from '@/data/creators'
import { AGENCY_ORDERS, THREADS, type AgencyOrder, type Thread } from '@/data/workspace'
import { REPORTS, CLIENT_INVOICES, AGENCY_NOTIFICATIONS } from '@/data/workspaceAgency'
import { track } from '@/lib/track'
import { Icon, Arrow } from '../../Icon'
import { Money } from '../../Money'
import { WsHead, Pill } from '../Shell'
import { useToast, goTab, CreatorCell, Market } from '../brand/common'

const STAGES: AgencyOrder['stage'][] = ['Listing', 'Brand approval', 'Contracting', 'Live', 'Reporting']
const PRICING: AgencyOrder['pricing'][] = ['Per creator', 'Package', 'Management fee %']
const PRICING_NOTE: Record<string, string> = {
  'Per creator': 'The client sees each creator’s fee as its own line.',
  Package: 'One price for the whole set of creators. Individual fees stay internal.',
  'Management fee %': 'Creator fees at cost, plus a management fee (rate TBD) on top.',
}

// ---------- Home ----------
export function AgencyHome({ lang }: { lang: string }) {
  const waiting = AGENCY_ORDERS.flatMap((o) => o.listings).filter((l) => l.status === 'Proposed').length
  const unread = THREADS.filter((t) => t.unread).length
  const budget = AGENCY_ORDERS.reduce((s, o) => s + o.budgetUsd, 0)
  return (
    <>
      <WsHead title="Good morning, Daniel" sub="Northside Agency · sample data">
        <Link className="btn btn--sm" href={href(lang, '/tools/ai-listup')} data-cta="agency_home_ai_listup" prefetch={false}>New list with AI Listup<Arrow size={14} /></Link>
      </WsHead>
      <div className="wgrid-4">
        <div className="kpi"><b>{AGENCY_ORDERS.length}</b><span>Agency orders</span><small>{AGENCY_ORDERS.filter((o) => o.stage === 'Live').length} live now</small></div>
        <div className="kpi"><b>{waiting}</b><span>Listings waiting on brands</span><small>proposed, not yet approved</small></div>
        <div className="kpi"><b>{unread}</b><span>Unread creator replies</span><small>Gmail connected</small></div>
        <div className="kpi"><b><Money usd={budget} /></b><span>Budget under management</span><small>{new Set(AGENCY_ORDERS.map((o) => o.client)).size} client brands</small></div>
      </div>
      <div className="wgrid-main">
        <div className="wcard">
          <div className="wcard__h"><h3>Orders by stage</h3><button className="ulink small" onClick={() => goTab('agency-orders')}>Open Agency Orders</button></div>
          {AGENCY_ORDERS.map((o) => (
            <div className="wa-stage" key={o.id}>
              <div className="wa-stage__t"><b>{o.title}</b><small>{o.client} · {o.id}</small></div>
              <ol className="wsteps">{STAGES.map((s, i) => <li key={s} className={i < STAGES.indexOf(o.stage) ? 'is-done' : i === STAGES.indexOf(o.stage) ? 'is-now' : ''}>{s}</li>)}</ol>
            </div>
          ))}
        </div>
        <div className="wcard">
          <div className="wcard__h"><h3>Latest</h3><button className="ulink small" onClick={() => goTab('alerts')}>All alerts</button></div>
          {AGENCY_NOTIFICATIONS.slice(0, 3).map((n) => (
            <div className="wrow" key={n.text}><div className="wrow__t"><b style={{ whiteSpace: 'normal' }}>{n.text}</b><small>{n.when}</small></div><button className="wa-icobtn" aria-label="Open" onClick={() => goTab(n.to)}><Icon name="chevronRight" size={16} /></button></div>
          ))}
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
  return (
    <>
      <WsHead title="Agency Orders" sub="Listings and orders for every client campaign.">
        <div className="wseg" role="group" aria-label="View">
          <button aria-pressed={view === 'compact'} onClick={() => { setView('compact'); track('agency_orders_view', { view: 'compact' }) }}>Compact</button>
          <button aria-pressed={view === 'full'} onClick={() => { setView('full'); track('agency_orders_view', { view: 'full' }) }}>Full</button>
        </div>
      </WsHead>

      {view === 'compact' ? (
        <div className="wcard wcard--flush">
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Order</th><th>Client</th><th>Markets</th><th>Stage</th><th>Listings</th><th>Budget</th><th>Pricing</th><th><span className="sr">Open</span></th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td><b className="wa-b">{o.title}</b><small className="wa-sub">{o.id}</small></td>
                    <td className="small">{o.client}</td>
                    <td><span className="wa-mks">{o.markets.map((m) => <Market key={m} id={m} />)}</span></td>
                    <td><Pill>{o.stage}</Pill></td>
                    <td className="tnum small">{o.listings.filter((l) => l.status !== 'Declined').length} active · {o.listings.filter((l) => l.status === 'Proposed').length} proposed</td>
                    <td className="tnum"><Money usd={o.budgetUsd} /></td>
                    <td className="small">{o.pricing}</td>
                    <td><button className="btn btn--sm btn--ghost" data-cta="agency_order_open_full" onClick={() => setView('full')}>Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : orders.map((o) => {
        const total = o.listings.filter((l) => l.status !== 'Declined').reduce((s, l) => s + l.feeUsd, 0)
        const pool = CREATORS.filter((c) => o.markets.includes(c.market) && !o.listings.some((l) => l.creator === c.handle)).slice(0, 6)
        return (
          <article className="wcard wcard--flush" key={o.id}>
            <header className="wa-ao">
              <div><h3>{o.title}</h3><p className="small muted">{o.id} · {o.client} · manager {o.manager}</p></div>
              <div className="wa-ao__r">{o.markets.map((m) => <Market key={m} id={m} />)}<Pill>{o.stage}</Pill>
                {o.stage !== 'Reporting' ? <button className="btn btn--sm btn--ghost" data-cta="agency_order_move_stage" onClick={() => advance(o)}>Move to {STAGES[STAGES.indexOf(o.stage) + 1]}<Arrow size={13} /></button> : null}
              </div>
            </header>
            <div className="wa-ao__sum">
              <span><small>Budget</small><b><Money usd={o.budgetUsd} /></b></span>
              <span><small>Listed</small><b><Money usd={total} /></b></span>
              <span><small>Left</small><b><Money usd={o.budgetUsd - total} /></b></span>
              <span className="wa-ao__price">
                <small>Pricing shown to the client</small>
                <span className="wseg" role="group" aria-label="Pricing option">
                  {PRICING.map((p) => <button key={p} aria-pressed={o.pricing === p} data-cta="agency_order_pricing_option" onClick={() => { patch(o.id, { pricing: p }); track('agency_order_pricing_changed', { order: o.id, pricing: p }) }}>{p}</button>)}
                </span>
                <small>{PRICING_NOTE[o.pricing]}</small>
              </span>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>Creator</th><th>Option</th><th>Fee</th><th>Status</th></tr></thead>
                <tbody>
                  {o.listings.map((l) => (
                    <tr key={l.creator}><td><CreatorCell handle={l.creator} lang={lang} /></td><td className="small">{l.option}</td><td className="tnum">{o.pricing === 'Package' ? <span className="small muted">in package</span> : <Money usd={l.feeUsd} />}</td><td><Pill>{l.status}</Pill></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="wa-ao__foot">
              {adding === o.id ? (
                <div className="wa-add">
                  <p className="small muted">Suggested for {o.markets.map((m) => m.toUpperCase()).join(', ')}:</p>
                  <div className="row">{pool.map((c) => <button key={c.handle} className="chip" data-cta="agency_order_add_creator_pick" onClick={() => add(o, c.handle)}>@{c.handle}</button>)}<button className="btn btn--sm btn--ghost" onClick={() => setAdding(null)}>Cancel</button></div>
                </div>
              ) : (
                <div className="row">
                  <button className="btn btn--sm btn--ghost" data-cta="agency_order_add_creator" onClick={() => setAdding(o.id)}><Icon name="plus" size={14} />Add a creator</button>
                  <Link className="tlink small" href={href(lang, '/tools/ai-listup')} data-cta="agency_order_listup" prefetch={false}>Fill from AI Listup<Arrow size={14} /></Link>
                </div>
              )}
            </footer>
          </article>
        )
      })}
      {toast}
    </>
  )
}

// ---------- AI Listup shortcut ----------
export function ListupCard({ lang }: { lang: string }) {
  return (
    <>
      <WsHead title="AI Listup" sub="Brief in, checked creator list out, straight into a listing." />
      <div className="wcard wcard--dark wa-listup">
        <p className="wa-k">Tool</p>
        <h3 className="h3">Create agency listings straight from results</h3>
        <p className="muted">Paste the client brief. AI Listup searches wide, checks each creator’s posts against your Must / Nice / Avoid cards, and sends the ones you approve into an Agency Order as Proposed listings.</p>
        <ol className="wa-listup__steps"><li>Paste brief</li><li>Review the list</li><li>Pick the order</li><li>Listings created</li></ol>
        <div className="row"><Link className="btn" href={href(lang, '/tools/ai-listup')} data-cta="agency_listup_open" prefetch={false}>Open AI Listup<Arrow /></Link>
          <button className="btn btn--ghost" data-cta="agency_listup_to_orders" onClick={() => goTab('agency-orders')}>See Agency Orders</button></div>
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
  const pick = (id: string) => { setOpen(id); setReply(''); setThreads((l) => l.map((x) => (x.id === id ? { ...x, unread: false } : x))); track('thread_opened', { thread: id }) }
  const send = () => { track('reply_sent', { thread: t.id, length: reply.length }); setReply(''); show(`Reply sent to ${t.from} from Gmail (mock)`) }
  const move = (stage: Thread['stage']) => { setThreads((l) => l.map((x) => (x.id === t.id ? { ...x, stage } : x))); track('thread_stage_moved', { thread: t.id, stage }) }

  if (!gmail) {
    return (
      <>
        <WsHead title="Campaign Inbox" sub="Creator email, on a board." />
        <div className="wcard wa-connect">
          <span className="wa-cardico"><Icon name="mail" size={20} /></span>
          <h3 className="h3">Connect Gmail to see creator replies here</h3>
          <p className="muted">Threads with creators are pulled into a board by stage. Nothing else in your mailbox is read.</p>
          <button className="btn" data-cta="inbox_connect_gmail" onClick={() => { setGmail(true); track('gmail_connected'); show('Gmail connected (mock)') }}>Connect Gmail<Arrow /></button>
        </div>
        {toast}
      </>
    )
  }
  return (
    <>
      <WsHead title="Campaign Inbox" sub="Creator email on a board, with AI-drafted replies.">
        <span className="wa-gmail"><span className="pill pill--ok">Gmail connected</span><button className="ulink small" data-cta="inbox_disconnect_gmail" onClick={() => { setGmail(false); track('gmail_disconnected') }}>Disconnect</button></span>
      </WsHead>
      <div className="wa-inboxbar">
        <label className="wa-search"><Icon name="search" size={16} /><span className="sr">Search email</span><input value={q} onChange={(e) => { setQ(e.target.value); if (e.target.value.length > 2) track('search', { query: e.target.value, source: 'campaign_inbox' }) }} placeholder="Search email by creator, subject or text" /></label>
        <div className="wseg" role="group" aria-label="Layout"><button aria-pressed={mode === 'board'} onClick={() => setMode('board')}>Creator board</button><button aria-pressed={mode === 'list'} onClick={() => setMode('list')}>List</button></div>
      </div>
      {mode === 'board' ? (
        <div className="kan">
          {BOARD.map((s) => {
            const items = shown.filter((x) => x.stage === s)
            return (
              <div className="kan__col" key={s}>
                <h4><span>{s}</span><span>{items.length}</span></h4>
                {items.map((x) => (
                  <button className={`kan__card ${x.id === t.id ? 'wa-on' : ''}`} key={x.id} data-cta="inbox_open_thread" onClick={() => pick(x.id)}>
                    <b>{x.unread ? <i className="wa-unread" aria-label="Unread" /> : null}{x.from}</b><span>{x.subject}</span><small className="muted">{x.when}</small>
                  </button>
                ))}
                {!items.length ? <p className="small muted" style={{ padding: 4 }}>Nothing here</p> : null}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="wcard">
          {shown.map((x) => (
            <button className="wrow wa-rowbtn" key={x.id} data-cta="inbox_open_thread" onClick={() => pick(x.id)}>
              {x.unread ? <i className="wa-unread" aria-label="Unread" /> : <i className="wa-read" />}
              <span className="wrow__t"><b>{x.from} · {x.subject}</b><small>{x.preview}</small></span><Pill>{x.stage}</Pill><small className="muted">{x.when}</small>
            </button>
          ))}
          {!shown.length ? <p className="small muted">No email matches “{q}”.</p> : null}
        </div>
      )}
      <div className="wcard wa-thread">
        <div className="wcard__h"><h3>{t.subject}</h3>
          <label className="wa-stagepick"><span className="sr">Stage</span><select className="wa-sel" value={t.stage} onChange={(e) => move(e.target.value as Thread['stage'])}>{BOARD.map((s) => <option key={s}>{s}</option>)}</select></label>
        </div>
        {t.creator ? <CreatorCell handle={t.creator} lang={lang} /> : null}
        <p className="wa-msg">{t.preview}</p>
        <div className="wa-reply">
          <div className="wa-reply__h"><span className="small muted">Reply as agency@northside.example</span>
            <button className="btn btn--sm btn--ghost" data-cta="inbox_insert_ai_draft" onClick={() => { setReply(t.aiDraft); track('ai_draft_inserted', { thread: t.id }) }}><Icon name="sparkle" size={14} />Insert AI draft</button></div>
          <label className="sr" htmlFor="wa-reply">Reply</label>
          <textarea id="wa-reply" className="textarea" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply, or insert the AI draft and edit it." />
          <div className="row"><button className="btn btn--sm" disabled={!reply.trim()} data-cta="inbox_send_reply" onClick={send}>Send reply</button><span className="small muted">AI drafts are suggestions. Nothing is sent until you press send.</span></div>
        </div>
      </div>
      {toast}
    </>
  )
}

// ---------- Reports ----------
export function ReportsScreen({ lang }: { lang: string }) {
  const [toast, show] = useToast()
  return (
    <>
      <WsHead title="Reports" sub="One report per campaign, built from post links.">
        <Link className="btn btn--sm" href={href(lang, '/tools/performance-report')} data-cta="reports_new" prefetch={false}>New report<Arrow size={14} /></Link>
      </WsHead>
      <div className="wcard wcard--flush">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Report</th><th>Client</th><th>Posts tracked</th><th>Status</th><th>Updated</th><th><span className="sr">Actions</span></th></tr></thead>
            <tbody>
              {REPORTS.map((r) => (
                <tr key={r.id}>
                  <td><b className="wa-b">{r.title}</b><small className="wa-sub">{r.id} · {r.order}</small></td><td className="small">{r.client}</td><td className="tnum">{r.posts}</td>
                  <td><span className={`pill ${r.status === 'Ready' ? 'pill--ok' : 'pill--do'}`}>{r.status}</span></td><td className="tnum small">{r.updated}</td>
                  <td><div className="wa-acts"><Link className="btn btn--sm btn--ghost" href={href(lang, '/tools/performance-report')} data-cta="report_open" prefetch={false}>Open</Link>
                    <button className="wa-icobtn" aria-label={`Export ${r.id} as PDF`} data-cta="report_export_pdf" onClick={() => { track('report_exported', { report: r.id }); show(`Client PDF for ${r.id} exported (mock)`) }}><Icon name="download" size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  return (
    <>
      <WsHead title="Clients" sub="Each client brand is an organisation with its own orders, people and invoices.">
        <button className="btn btn--sm btn--ghost" data-cta="clients_add" onClick={() => show('New client form opens here (mock).')}><Icon name="plus" size={14} />Add a client</button>
      </WsHead>
      <div className="wgrid-3">
        {clients.map((c) => {
          const os = AGENCY_ORDERS.filter((o) => o.client === c)
          return (
            <button className={`wcard wa-client ${client === c ? 'wa-on' : ''}`} key={c} data-cta="clients_pick" onClick={() => setClient(client === c ? 'All' : c)}>
              <span className="wa-logo">{c.split(' ').slice(0, 2).map((w) => w[0]).join('')}</span>
              <b>{c}</b>
              <small className="muted">{os.length} {os.length === 1 ? 'order' : 'orders'} · <Money usd={os.reduce((s, o) => s + o.budgetUsd, 0)} /> budget</small>
              <span className="wa-mks">{Array.from(new Set(os.flatMap((o) => o.markets))).map((m) => <Market key={m} id={m} />)}</span>
            </button>
          )
        })}
      </div>
      <div className="wcard wcard--flush">
        <div className="wcard__h"><h3>Per-brand invoices on shared orders{client !== 'All' ? ` · ${client}` : ''}</h3>{client !== 'All' ? <button className="ulink small" onClick={() => setClient('All')}>Show all</button> : <span className="small muted">Pick a client to filter</span>}</div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Invoice</th><th>Date</th><th>Client</th><th>Order</th><th>For</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>{rows.map((i) => <tr key={i.id}><td className="tnum wa-b">{i.id}</td><td className="tnum small">{i.date}</td><td className="small">{i.client}</td><td className="tnum small">{i.order}</td><td>{i.what}</td><td className="tnum"><Money usd={i.tbd ? 'TBD' : i.amountUsd} /></td><td><Pill>{i.status}</Pill></td></tr>)}</tbody>
          </table>
        </div>
      </div>
      {toast}
    </>
  )
}
