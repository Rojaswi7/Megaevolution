'use client'
// Brand workspace screens: home, My orders (brief, drafts, revisions), read-only Campaign Inbox, Agency Orders approval.
import Link from 'next/link'
import { useState } from 'react'
import { href } from '@/data/site'
import { STUDIO } from '@/data/pricing'
import { STUDIO_ORDERS, CREATOR_ORDERS, AGENCY_ORDERS, THREADS, NOTIFICATIONS, type StudioOrder, type VideoStatus, type OrderStatus, type Listing } from '@/data/workspace'
import { track } from '@/lib/track'
import { Icon, Arrow, PlatformIcon } from '../../Icon'
import { Money } from '../../Money'
import { WsHead, Pill } from '../Shell'
import { useToast, goTab, CreatorCell, Market } from './common'
import { creatorByHandle } from '@/data/creators'
import '@/styles/brand-home.css'

// Free revisions per order come from the pricing config. While that number is TBD the
// mockup assumes 2, only so the free → paid switch can be seen.
const FREE_SET = typeof STUDIO.freeRevisions === 'number'
const FREE = FREE_SET ? (STUDIO.freeRevisions as number) : 2
const STEPS: VideoStatus[] = ['Waiting for brief', 'In queue', 'Editing', 'Draft ready', 'Final delivered']
const STEP_LABEL = ['Brief', 'In queue', 'Editing', 'Draft', 'Final']
const stepIndex = (s: VideoStatus) => (s === 'Revision requested' ? 2 : STEPS.indexOf(s))

// ---------- Home ----------
export function BrandHome({ lang }: { lang: string }) {
  const drafts = STUDIO_ORDERS.flatMap((o) => o.videos).filter((v) => v.status === 'Draft ready').length
  const review = CREATOR_ORDERS.filter((o) => o.status === 'Draft review' || o.status === 'Script review').length
  const proposed = AGENCY_ORDERS.filter((o) => o.client === 'Lumi Skin').flatMap((o) => o.listings).filter((l) => l.status === 'Proposed').length
  const noBrief = STUDIO_ORDERS.filter((o) => !o.briefSent).length
  const spend = CREATOR_ORDERS.reduce((s, o) => s + o.amountUsd, 0)
  const needs = [
    noBrief ? { t: `${noBrief} Studio order is waiting for your brief`, s: 'Editing starts as soon as the brief is in.', to: 'orders', cta: 'Send brief' } : null,
    drafts ? { t: `${drafts} video draft is ready to review`, s: 'Approve it, or ask for a revision.', to: 'orders', cta: 'Review' } : null,
    review ? { t: `${review} creator orders need your review`, s: 'A script and a draft are waiting.', to: 'orders', cta: 'Open orders' } : null,
    proposed ? { t: `${proposed} creator proposed by your agency`, s: 'Approve or decline the listing.', to: 'agency-orders', cta: 'Decide' } : null,
  ].filter(Boolean) as { t: string; s: string; to: string; cta: string }[]
  const NEED_ICON = ['pen', 'play', 'users', 'list']
  const NEED_TAG = ['Studio', 'Studio', 'Creator orders', 'Agency']
  const videos = STUDIO_ORDERS.flatMap((o) => o.videos)
  const openOrders = CREATOR_ORDERS.filter((o) => o.status !== 'Completed')
  const posting = CREATOR_ORDERS.filter((o) => o.status === 'Scheduled').length

  // the next deadlines across creator orders and Studio videos (sample "today" is TODAY)
  const upcoming = [
    ...openOrders.map((o) => ({ due: o.due, t: `@${o.creator}`, s: `${o.pkg} · ${o.status}`, market: o.market, to: 'orders' })),
    ...videos.filter((v) => v.due !== '—' && v.status !== 'Final delivered').map((v) => ({ due: v.due, t: v.title, s: `Studio · ${v.status}`, market: '', to: 'orders' })),
  ].filter((x) => x.due >= TODAY).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 5)

  const campaigns = Array.from(new Set(CREATOR_ORDERS.map((o) => o.campaign))).map((name) => {
    const os = CREATOR_ORDERS.filter((o) => o.campaign === name)
    const done = os.filter((o) => o.status === 'Posted' || o.status === 'Completed').length
    const live = os.filter((o) => o.status === 'Scheduled').length
    const work = os.length - done - live
    return { name, os, done, live, work, spend: os.reduce((s, o) => s + o.amountUsd, 0), markets: Array.from(new Set(os.map((o) => o.market))) }
  })

  const kpis = [
    { icon: 'users', n: openOrders.length, label: 'Open creator orders', sub: `${review} need your review`, to: 'orders', part: review / Math.max(openOrders.length, 1) },
    { icon: 'film', n: videos.filter((v) => v.status !== 'Final delivered').length, label: 'Videos in the Studio', sub: `${drafts} draft ready`, to: 'orders', part: drafts / Math.max(videos.length, 1) },
    { icon: 'list', n: proposed, label: 'Listings to approve', sub: 'from your agency team', to: 'agency-orders', part: proposed ? 1 : 0 },
  ]

  return (
    <>
      <section className="bh-hero" aria-label="Today">
        <div className="bh-hero__copy">
          <p className="bh-hero__date">{fmtDay(TODAY, true)} · Lumi Skin</p>
          <h2>Good morning, <span className="it">Hana.</span></h2>
          <p><b>{needs.length} things</b> are waiting for you and <b>{posting} post{posting === 1 ? '' : 's'}</b> go live soon.</p>
        </div>
        <div className="bh-quick">
          <Link href={href(lang, '/creators')} data-cta="brand_home_search_creators" prefetch={false}><Icon name="search" size={18} /><b>Search creators</b><small>Shortlist by market</small></Link>
          <Link href={href(lang, '/video-editing/checkout')} data-cta="brand_home_order_video" prefetch={false}><Icon name="film" size={18} /><b>Order a video</b><small>Edited by the Studio</small></Link>
          <Link href={href(lang, '/about-agency#inquiry')} data-cta="brand_home_request_campaign" prefetch={false}><Icon name="building" size={18} /><b>Request a campaign</b><small>We run it for you</small></Link>
          <button data-cta="brand_home_invite" onClick={() => goTab('team')}><Icon name="plus" size={18} /><b>Invite a teammate</b><small>Share this workspace</small></button>
        </div>
      </section>

      <div className="bh-kpis">
        {kpis.map((k) => (
          <button key={k.label} className="bh-kpi" onClick={() => goTab(k.to)} data-cta={`brand_home_kpi_${k.to}`}>
            <span className="bh-kpi__ico"><Icon name={k.icon} size={17} /></span>
            <b className="num">{k.n}</b>
            <span className="bh-kpi__l">{k.label}</span>
            <span className="bh-kpi__bar"><i style={{ width: `${Math.round(k.part * 100)}%` }} /></span>
            <small>{k.sub}</small>
          </button>
        ))}
        <div className="bh-kpi bh-kpi--spend">
          <span className="bh-kpi__ico"><Icon name="card" size={17} /></span>
          <b className="num"><Money usd={spend} /></b>
          <span className="bh-kpi__l">Creator spend this month</span>
          <span className="bh-kpi__bar">{campaigns.map((c) => <i key={c.name} style={{ width: `${(c.spend / spend) * 100}%` }} title={c.name} />)}</span>
          <small>across {CREATOR_ORDERS.length} orders, {campaigns.length} campaigns</small>
        </div>
      </div>

      <div className="bh-main">
        <section className="wcard bh-needs">
          <div className="wcard__h"><h3>Needs you</h3><span className="bh-count">{needs.length}</span></div>
          <ol>
            {needs.map((n, i) => (
              <li key={n.t}>
                <span className="bh-needs__ico"><Icon name={NEED_ICON[i] || 'bell'} size={17} /></span>
                <div><b>{n.t}</b><small><em>{NEED_TAG[i]}</em>{n.s}</small></div>
                <button className={`btn btn--sm ${i ? 'btn--ghost' : ''}`} data-cta="brand_home_needs_you" onClick={() => goTab(n.to)}>{n.cta}<Arrow size={13} /></button>
              </li>
            ))}
          </ol>
        </section>

        <section className="wcard bh-week">
          <div className="wcard__h"><h3>Coming up</h3><button className="ulink small" onClick={() => goTab('orders')}>All orders</button></div>
          <ol>
            {upcoming.map((u) => (
              <li key={u.t + u.due}>
                <span className="bh-date"><b>{u.due.slice(8)}</b><small>{fmtDay(u.due).split(' ')[0]}</small></span>
                <div><b>{u.t}</b><small>{u.market ? <Market id={u.market} /> : null}{u.s}</small></div>
                <span className={`bh-when ${u.due === TODAY ? 'is-today' : ''}`}>{u.due === TODAY ? 'Today' : relDay(u.due)}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="bh-main">
        <section className="wcard bh-camps">
          <div className="wcard__h"><h3>Campaigns</h3><button className="ulink small" onClick={() => goTab('orders')}>Creator orders</button></div>
          <div className="bh-camps__list">
            {campaigns.map((c) => (
              <article key={c.name}>
                <header>
                  <b>{c.name}</b>
                  <span className="bh-camps__mk">{c.markets.map((m) => <Market key={m} id={m} />)}</span>
                </header>
                <div className="bh-camps__avs">
                  {c.os.slice(0, 5).map((o) => { const cr = creatorByHandle[o.creator]; return <span key={o.id} className={`av tone-${cr ? (cr.tone + 5) % 8 : 2}`} title={`@${o.creator}`}>{o.creator[0].toUpperCase()}</span> })}
                  <small>{c.os.length} creator{c.os.length === 1 ? '' : 's'} · <Money usd={c.spend} /></small>
                </div>
                <div className="bh-prog" aria-label={`${c.done} posted, ${c.live} scheduled, ${c.work} in progress`}>
                  <i className="is-done" style={{ flex: c.done }} /><i className="is-live" style={{ flex: c.live }} /><i style={{ flex: c.work }} />
                </div>
                <p className="bh-prog__k"><span><i className="is-done" />{c.done} posted</span><span><i className="is-live" />{c.live} scheduled</span><span><i />{c.work} in progress</span></p>
              </article>
            ))}
          </div>
        </section>

        <section className="wcard bh-feed">
          <div className="wcard__h"><h3>Latest</h3><button className="ulink small" onClick={() => goTab('alerts')}>All alerts</button></div>
          <ol>
            {NOTIFICATIONS.map((n) => (
              <li key={n.text}>
                <span className="bh-feed__ico"><Icon name={n.to === 'team' ? 'users' : 'film'} size={14} /></span>
                <div><button onClick={() => goTab(n.to)}>{n.text}</button><small>{n.when}</small></div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  )
}

const TODAY = '2026-11-20'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const asDate = (d: string) => new Date(`${d}T00:00:00Z`)
function fmtDay(d: string, long = false) {
  const x = asDate(d)
  return long ? `${DAYS[x.getUTCDay()]}, ${x.getUTCDate()} ${MONTHS[x.getUTCMonth()]}` : `${MONTHS[x.getUTCMonth()]} ${x.getUTCDate()}`
}
function relDay(d: string) {
  const n = Math.round((asDate(d).getTime() - asDate(TODAY).getTime()) / 86400000)
  return n === 1 ? 'Tomorrow' : `In ${n} days`
}

// ---------- My orders ----------
export function BrandOrders({ lang }: { lang: string }) {
  const [kind, setKind] = useState<'studio' | 'creator'>('studio')
  const [orders, setOrders] = useState<StudioOrder[]>(STUDIO_ORDERS)
  const [corders, setCorders] = useState(CREATOR_ORDERS)
  const [revising, setRevising] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [files, setFiles] = useState<Record<string, string[]>>({})
  const [toast, show] = useToast()

  const patchVideo = (oid: string, vid: string, p: Partial<StudioOrder['videos'][number]>) =>
    setOrders((os) => os.map((o) => (o.id !== oid ? o : { ...o, videos: o.videos.map((v) => (v.id === vid ? { ...v, ...p } : v)) })))

  const sendBrief = (e: React.FormEvent<HTMLFormElement>, o: StudioOrder) => {
    e.preventDefault()
    setOrders((os) => os.map((x) => (x.id !== o.id ? x : { ...x, briefSent: true, files: files[o.id] || ['brief_notes.txt'], videos: x.videos.map((v) => ({ ...v, status: 'In queue' as VideoStatus, due: '2026-11-27' })) })))
    track('brief_submitted', { order: o.id, files: (files[o.id] || []).length }); show('Brief sent. Your videos are in the queue.')
  }
  const requestRevision = (o: StudioOrder, vid: string, used: number) => {
    const paid = used >= FREE
    patchVideo(o.id, vid, { status: 'Revision requested', revisionsUsed: used + 1 })
    track('revision_requested', { order: o.id, video: vid, paid, number: used + 1 })
    if (paid) track('checkout_completed', { product: 'paid_revision', order: o.id })
    setRevising(null); setNote(''); show(paid ? 'Paid revision ordered. The editor has your notes.' : 'Revision requested. The editor has your notes.')
  }
  const setStatus = (id: string, status: OrderStatus, msg: string, ev: string) => { setCorders((l) => l.map((o) => (o.id === id ? { ...o, status } : o))); track(ev, { order: id }); show(msg) }

  return (
    <>
      <WsHead title="My orders" sub="Send briefs, follow each video, download drafts and finals, ask for revisions.">
        <div className="wseg" role="group" aria-label="Order type">
          <button aria-pressed={kind === 'studio'} onClick={() => setKind('studio')}>Video Editing Studio · {orders.length}</button>
          <button aria-pressed={kind === 'creator'} onClick={() => setKind('creator')}>Creator orders · {corders.length}</button>
        </div>
      </WsHead>

      {kind === 'studio' && (
        <>
          <p className="wnote"><Icon name="refresh" size={16} />
            <span>Each video includes <b>{FREE_SET ? FREE : 'TBD'}</b> free revisions; after that a revision costs <b><Money usd={STUDIO.paidRevision} /></b>.{!FREE_SET ? ' The mockup assumes 2 free revisions until the number is set in the pricing config.' : ''}</span>
          </p>
          {orders.map((o) => (
            <article className="wcard wa-order" key={o.id}>
              <header className="wa-order__h">
                <div><h3>{o.id}<span className="muted"> · {o.videos.length} {o.videos.length === 1 ? 'video' : 'videos'}</span></h3><p className="small muted">Placed {o.placed}{o.plan ? ` · ${o.plan} plan` : ''}{o.files.length ? ` · ${o.files.length} files sent` : ''}</p></div>
                {o.briefSent ? <span className="pill pill--ok">Brief received</span> : <Pill>Waiting for brief</Pill>}
              </header>

              {!o.briefSent && (
                <form className="wa-brief" onSubmit={(e) => sendBrief(e, o)}>
                  <label className="field"><span>Your brief <small>(what the video is for, examples you like)</small></span>
                    <textarea className="textarea" required placeholder="A 20-second teaser for the holiday set. Fast cuts, captions on, end on the box." /></label>
                  <button type="button" className="wdrop" data-cta="brief_add_files" onClick={() => setFiles((f) => ({ ...f, [o.id]: [...(f[o.id] || []), `footage_${(f[o.id] || []).length + 1}.mp4`] }))}>
                    <Icon name="upload" size={20} /><span>Drop footage and files here, or click to add (mock)</span>
                  </button>
                  {(files[o.id] || []).length ? <ul className="wa-files">{files[o.id].map((f) => <li key={f}><Icon name="film" size={14} />{f}</li>)}</ul> : null}
                  <button className="btn btn--sm" data-cta="brief_submit">Send brief</button>
                </form>
              )}

              {o.videos.map((v) => {
                const i = stepIndex(v.status)
                const paid = v.revisionsUsed >= FREE
                return (
                  <div className="wa-video" key={v.id}>
                    <div className="wa-video__top">
                      <div><b>{v.title}</b><small>{v.type === 'short' ? 'Short video' : 'Long video'} · due {v.due}{v.editor ? ` · editor ${v.editor}` : ''}</small></div>
                      <Pill>{v.status}</Pill>
                    </div>
                    <ol className="wsteps">{STEP_LABEL.map((s, k) => <li key={s} className={k < i || v.status === 'Final delivered' ? 'is-done' : k === i ? 'is-now' : ''}>{s}</li>)}</ol>
                    <div className="wa-video__act">
                      <span className="small muted">Revisions used: {v.revisionsUsed} of {FREE_SET ? FREE : 'TBD'} free</span>
                      {v.status === 'Draft ready' && (
                        <>
                          <button className="btn btn--sm btn--ghost" data-cta="order_download_draft" onClick={() => { track('draft_downloaded', { video: v.id }); show(`Draft ${v.draft} downloaded (mock)`) }}><Icon name="download" size={14} />Draft {v.draft}</button>
                          <button className="btn btn--sm btn--ghost" data-cta="order_ask_revision" onClick={() => { setRevising(v.id); setNote('') }}>Ask for a revision</button>
                          <button className="btn btn--sm" data-cta="order_approve_final" onClick={() => { patchVideo(o.id, v.id, { status: 'Final delivered' }); track('final_approved', { video: v.id }); show('Approved. The final file is ready to download.') }}>Approve as final</button>
                        </>
                      )}
                      {v.status === 'Final delivered' && <button className="btn btn--sm" data-cta="order_download_final" onClick={() => { track('final_downloaded', { video: v.id }); show('Final video downloaded (mock)') }}><Icon name="download" size={14} />Download final</button>}
                      {v.status === 'Revision requested' && <span className="small">The editor is working on your notes.</span>}
                    </div>
                    {revising === v.id && (
                      <div className="wa-rev">
                        <label className="field"><span>What should change?</span><textarea className="textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Cut the first two seconds, make the captions bigger." /></label>
                        {paid ? <p className="wnote"><Icon name="card" size={16} /><span>The free revisions for this video are used. This one costs <b><Money usd={STUDIO.paidRevision} /></b>, charged to Visa ending 4242. Secure card checkout · {STUDIO.refundNote}</span></p>
                          : <p className="small muted">Free revision {v.revisionsUsed + 1} of {FREE_SET ? FREE : 'TBD'}.</p>}
                        <div className="row">
                          <button className="btn btn--sm" disabled={!note.trim()} data-cta={paid ? 'revision_pay_and_request' : 'revision_request_free'} onClick={() => requestRevision(o, v.id, v.revisionsUsed)}>{paid ? 'Pay and request revision' : 'Request revision'}</button>
                          <button className="btn btn--sm btn--ghost" onClick={() => setRevising(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </article>
          ))}
        </>
      )}

      {kind === 'creator' && (
        <div className="wcard wcard--flush">
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Order</th><th>Creator</th><th>Package</th><th>Amount</th><th>Status</th><th>Due</th><th>Next step</th></tr></thead>
              <tbody>
                {corders.map((o) => (
                  <tr key={o.id}>
                    <td className="tnum wa-b">{o.id}<small className="wa-sub">{o.campaign}</small></td>
                    <td><CreatorCell handle={o.creator} lang={lang} /></td>
                    <td className="small"><span className="pname"><PlatformIcon name={o.platform} size={14} />{o.pkg}</span></td>
                    <td className="tnum"><Money usd={o.amountUsd} /></td>
                    <td><Pill>{o.status}</Pill></td>
                    <td className="tnum small">{o.due}</td>
                    <td>
                      <div className="wa-acts">
                        {o.status === 'Draft review' && <><button className="btn btn--sm" data-cta="creator_order_approve_draft" onClick={() => setStatus(o.id, 'Scheduled', 'Draft approved. The creator will schedule the post.', 'draft_approved')}>Approve</button><button className="btn btn--sm btn--ghost" data-cta="creator_order_request_revision" onClick={() => setStatus(o.id, 'Revision', 'Revision requested from the creator.', 'revision_requested')}>Revision</button></>}
                        {o.status === 'Script review' && <button className="btn btn--sm" data-cta="creator_order_approve_script" onClick={() => setStatus(o.id, 'Draft review', 'Script approved. Draft comes next.', 'script_approved')}>Approve script</button>}
                        {o.status === 'Posted' && <button className="btn btn--sm btn--ghost" data-cta="creator_order_complete" onClick={() => setStatus(o.id, 'Completed', 'Order completed. Payment released to the creator.', 'order_completed')}>Mark complete</button>}
                        {!['Draft review', 'Script review', 'Posted'].includes(o.status) && <span className="small muted">{o.status === 'Awaiting creator' ? 'Waiting for the creator to accept' : o.status === 'Revision' ? 'Creator is revising' : o.status === 'Scheduled' ? 'Goes live on the due date' : 'Nothing to do'}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {toast}
    </>
  )
}

// ---------- Campaign Inbox, read-only board for brands ----------
const STAGES = ['New', 'Negotiating', 'Agreed', 'Posted'] as const
export function BrandInbox({ lang }: { lang: string }) {
  const [open, setOpen] = useState(THREADS[0].id)
  const t = THREADS.find((x) => x.id === open)!
  return (
    <>
      <WsHead title="Campaign Inbox" sub="A read-only board of your agency’s conversations with creators." />
      <p className="wnote"><Icon name="eye" size={16} /><span><b>Read-only.</b> the MegaEvolution team writes to creators on your behalf. You can follow every thread here, but replies are sent by your campaign manager.</span></p>
      <div className="kan">
        {STAGES.map((s) => {
          const items = THREADS.filter((x) => x.stage === s)
          return (
            <div className="kan__col" key={s}>
              <h4><span>{s}</span><span>{items.length}</span></h4>
              {items.map((x) => (
                <button className={`kan__card ${x.id === open ? 'wa-on' : ''}`} key={x.id} data-cta="brand_inbox_open_thread" onClick={() => { setOpen(x.id); track('thread_opened', { thread: x.id, readonly: true }) }}>
                  <b>{x.from}{x.creator ? <span className="muted"> · @{x.creator}</span> : null}</b>
                  <span>{x.subject}</span><small className="muted">{x.when}</small>
                </button>
              ))}
            </div>
          )
        })}
      </div>
      <div className="wcard wa-thread">
        <div className="wcard__h"><h3>{t.subject}</h3><Pill>{t.stage}</Pill></div>
        {t.creator ? <CreatorCell handle={t.creator} lang={lang} /> : null}
        <p className="wa-msg">{t.preview}</p>
        <div className="wa-locked"><Icon name="lock" size={15} />Replying is turned off for brand accounts. <button className="ulink" data-cta="brand_inbox_ask_manager" onClick={() => track('cta_click', { cta: 'ask_manager' })}>Ask your campaign manager</button></div>
      </div>
    </>
  )
}

// ---------- Agency Orders, the brand's side ----------
export function BrandAgencyOrders({ lang }: { lang: string }) {
  const [view, setView] = useState<'compact' | 'full'>('full')
  const [orders, setOrders] = useState(AGENCY_ORDERS.filter((o) => o.client === 'Lumi Skin'))
  const [toast, show] = useToast()
  const decide = (oid: string, creator: string, status: Listing['status']) => {
    setOrders((os) => os.map((o) => (o.id !== oid ? o : { ...o, listings: o.listings.map((l) => (l.creator === creator ? { ...l, status } : l)) })))
    track(status === 'Declined' ? 'listing_declined' : 'listing_approved', { order: oid, creator }); show(status === 'Declined' ? `@${creator} declined` : `@${creator} approved. Your agency will contract them.`)
  }
  return (
    <>
      <WsHead title="Agency Orders" sub="Campaigns the MegaEvolution team runs for you. Approve or decline each proposed creator.">
        <div className="wseg" role="group" aria-label="View">
          <button aria-pressed={view === 'compact'} onClick={() => { setView('compact'); track('agency_orders_view', { view: 'compact' }) }}>Compact</button>
          <button aria-pressed={view === 'full'} onClick={() => { setView('full'); track('agency_orders_view', { view: 'full' }) }}>Full</button>
        </div>
      </WsHead>
      {orders.map((o) => {
        const total = o.listings.filter((l) => l.status !== 'Declined').reduce((s, l) => s + l.feeUsd, 0)
        return (
          <article className="wcard wcard--flush" key={o.id}>
            <header className="wa-ao">
              <div><h3>{o.title}</h3><p className="small muted">{o.id} · managed by {o.manager} · pricing: {o.pricing}</p></div>
              <div className="wa-ao__r">{o.markets.map((m) => <Market key={m} id={m} />)}<Pill>{o.stage}</Pill></div>
            </header>
            <div className="wa-ao__sum">
              <span><small>Budget</small><b><Money usd={o.budgetUsd} /></b></span>
              <span><small>Listed so far</small><b><Money usd={total} /></b></span>
              <span><small>Creators</small><b>{o.listings.length}</b></span>
              <span><small>Waiting for you</small><b>{o.listings.filter((l) => l.status === 'Proposed').length}</b></span>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>Creator</th>{view === 'full' ? <th>Option</th> : null}<th>Fee</th><th>Status</th><th>Your decision</th></tr></thead>
                <tbody>
                  {o.listings.map((l) => (
                    <tr key={l.creator}>
                      <td>{view === 'full' ? <CreatorCell handle={l.creator} lang={lang} /> : <span className="wa-b">@{l.creator}</span>}</td>
                      {view === 'full' ? <td className="small">{l.option}</td> : null}
                      <td className="tnum"><Money usd={l.feeUsd} /></td>
                      <td><Pill>{l.status}</Pill></td>
                      <td>
                        {l.status === 'Proposed' ? (
                          <div className="wa-acts">
                            <button className="btn btn--sm" data-cta="listing_approve" onClick={() => decide(o.id, l.creator, 'Approved by brand')}>Approve</button>
                            <button className="btn btn--sm btn--ghost" data-cta="listing_decline" onClick={() => decide(o.id, l.creator, 'Declined')}>Decline</button>
                          </div>
                        ) : <span className="small muted">{l.status === 'Declined' ? 'Declined' : 'Decided'}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        )
      })}
      {toast}
    </>
  )
}
