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
import '@/styles/brand-work.css'

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

      <div className="bh-cols">
        <div className="bh-col">
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
        </div>
        <div className="bh-col">
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

// ---------- shared header band for the work screens ----------
function WorkHead({ icon, title, sub, stats, children }: { icon: string; title: string; sub: React.ReactNode; stats?: { n: React.ReactNode; l: string; hot?: boolean }[]; children?: React.ReactNode }) {
  return (
    <header className="bw-head">
      <div className="bw-head__t">
        <span className="bw-head__ico"><Icon name={icon} size={20} /></span>
        <div><h2>{title}</h2><p>{sub}</p></div>
        {children ? <div className="bw-head__act">{children}</div> : null}
      </div>
      {stats ? (
        <dl className="bw-head__stats">
          {stats.map((s) => <div key={s.l} className={s.hot ? 'is-hot' : ''}><dt>{s.l}</dt><dd className="num">{s.n}</dd></div>)}
        </dl>
      ) : null}
    </header>
  )
}

const avatarOf = (handle: string) => { const c = creatorByHandle[handle]; return { tone: c ? (c.tone + 5) % 8 : 2, initial: (c?.name || handle)[0].toUpperCase() } }

// ---------- My orders ----------
const CO_FILTERS = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'you', label: 'Needs you', match: (s: OrderStatus) => s === 'Draft review' || s === 'Script review' || s === 'Posted' },
  { id: 'progress', label: 'In progress', match: (s: OrderStatus) => ['Awaiting creator', 'Brief sent', 'Revision', 'Scheduled'].includes(s) },
  { id: 'done', label: 'Done', match: (s: OrderStatus) => s === 'Completed' },
] as const

export function BrandOrders({ lang }: { lang: string }) {
  const [kind, setKind] = useState<'studio' | 'creator'>('studio')
  const [orders, setOrders] = useState<StudioOrder[]>(STUDIO_ORDERS)
  const [corders, setCorders] = useState(CREATOR_ORDERS)
  const [revising, setRevising] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [files, setFiles] = useState<Record<string, string[]>>({})
  const [cf, setCf] = useState<(typeof CO_FILTERS)[number]['id']>('all')
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

  const videos = orders.flatMap((o) => o.videos)
  const draftsReady = videos.filter((v) => v.status === 'Draft ready').length
  const noBrief = orders.filter((o) => !o.briefSent).length
  const coNeeds = corders.filter((o) => CO_FILTERS[1].match(o.status)).length
  const shown = corders.filter((o) => CO_FILTERS.find((f) => f.id === cf)!.match(o.status))
  const pickKind = (k: 'studio' | 'creator') => { setKind(k); track('filter_changed', { orders: k, source: 'brand_orders' }) }

  return (
    <>
      <WorkHead icon="film" title="My orders"
        sub={draftsReady + noBrief + coNeeds ? <><b>{draftsReady + noBrief + coNeeds} things</b> need you: {[noBrief ? `${noBrief} brief to send` : '', draftsReady ? `${draftsReady} draft to review` : '', coNeeds ? `${coNeeds} creator order${coNeeds === 1 ? '' : 's'} to check` : ''].filter(Boolean).join(', ')}.</> : 'You’re all caught up. Nothing needs you right now.'}
        stats={[
          { n: videos.filter((v) => v.status !== 'Final delivered').length, l: 'Videos in the Studio' },
          { n: corders.filter((o) => o.status !== 'Completed').length, l: 'Open creator orders' },
          { n: <Money usd={corders.reduce((s, o) => s + o.amountUsd, 0)} />, l: 'With creators' },
          { n: draftsReady + noBrief + coNeeds, l: 'Need you', hot: true },
        ]}>
        <Link className="btn btn--sm" href={href(lang, '/video-editing/checkout')} data-cta="orders_new_video" prefetch={false}>Order a video<Arrow size={14} /></Link>
      </WorkHead>

      <div className="bw-bar">
        <div className="bw-seg" role="group" aria-label="Order type">
          <button aria-pressed={kind === 'studio'} onClick={() => pickKind('studio')}><Icon name="film" size={15} />Video Editing Studio<span>{orders.length}</span></button>
          <button aria-pressed={kind === 'creator'} onClick={() => pickKind('creator')}><Icon name="users" size={15} />Creator orders<span>{corders.length}</span></button>
        </div>
        {kind === 'studio' ? (
          <p className="bw-hint"><Icon name="refresh" size={14} /><span><b>{FREE_SET ? FREE : 'TBD'}</b> free revisions per video, then <b><Money usd={STUDIO.paidRevision} /></b> each.{!FREE_SET ? ' (Mockup assumes 2 until the pricing config is set.)' : ''}</span></p>
        ) : (
          <div className="bw-chips" role="group" aria-label="Show">
            {CO_FILTERS.map((f) => {
              const n = corders.filter((o) => f.match(o.status)).length
              return <button key={f.id} aria-pressed={cf === f.id} onClick={() => setCf(f.id)}>{f.label}<span>{n}</span></button>
            })}
          </div>
        )}
      </div>

      {kind === 'studio' && orders.map((o) => {
        const done = o.videos.filter((v) => v.status === 'Final delivered').length
        return (
          <article className={`bw-card bw-order ${!o.briefSent ? 'is-hot' : ''}`} key={o.id}>
            <header className="bw-order__h">
              <span className="bw-order__ico"><Icon name="film" size={18} /></span>
              <div>
                <h3>{o.id}{o.plan ? <em className="bw-tag">{o.plan} plan</em> : null}</h3>
                <p>Placed {fmtDay(o.placed)} · {o.videos.length} {o.videos.length === 1 ? 'video' : 'videos'} · {done} delivered</p>
              </div>
              {o.briefSent ? <span className="pill pill--ok">Brief received</span> : <Pill>Waiting for brief</Pill>}
            </header>
            {o.files.length ? <ul className="bw-files">{o.files.map((f) => <li key={f}><Icon name={/\.(mp4|zip)$/.test(f) ? 'film' : 'file'} size={13} />{f}</li>)}</ul> : null}

            {!o.briefSent && (
              <form className="bw-brief" onSubmit={(e) => sendBrief(e, o)}>
                <label className="field"><span>Your brief <small>(what the video is for, examples you like)</small></span>
                  <textarea className="textarea" required placeholder="A 20-second teaser for the holiday set. Fast cuts, captions on, end on the box." /></label>
                <div className="bw-brief__side">
                  <button type="button" className="bw-drop" data-cta="brief_add_files" onClick={() => setFiles((f) => ({ ...f, [o.id]: [...(f[o.id] || []), `footage_${(f[o.id] || []).length + 1}.mp4`] }))}>
                    <span><Icon name="upload" size={20} /></span><b>Drop footage here</b><small>or click to add (mock)</small>
                  </button>
                  {(files[o.id] || []).length ? <ul className="bw-files">{files[o.id].map((f) => <li key={f}><Icon name="film" size={13} />{f}</li>)}</ul> : null}
                  <button className="btn btn--sm" data-cta="brief_submit">Send brief<Arrow size={14} /></button>
                </div>
              </form>
            )}

            <ul className="bw-videos">
              {o.videos.map((v) => {
                const i = stepIndex(v.status)
                const paid = v.revisionsUsed >= FREE
                const final = v.status === 'Final delivered'
                return (
                  <li className="bw-video" key={v.id}>
                    <div className="bw-video__top">
                      <span className={`bw-thumb bw-thumb--${v.type}`}><Icon name="play" size={14} /><small>{v.type === 'short' ? '9:16' : '16:9'}</small></span>
                      <div className="bw-video__t"><b>{v.title}</b><small>{v.type === 'short' ? 'Short video' : 'Long video'}{v.due !== '—' ? ` · due ${fmtDay(v.due)}` : ''}{v.editor ? ` · editor ${v.editor}` : ''}</small></div>
                      <Pill>{v.status}</Pill>
                    </div>
                    <ol className="bw-steps" aria-label={`Step: ${v.status}`}>
                      {STEP_LABEL.map((s, k) => <li key={s} className={k < i || final ? 'is-done' : k === i ? 'is-now' : ''}><i />{s}</li>)}
                    </ol>
                    <div className="bw-video__act">
                      <span className="bw-revs" title="Revisions used">
                        {Array.from({ length: FREE }, (_, k) => <i key={k} className={k < v.revisionsUsed ? 'is-used' : ''} />)}
                        <small>{v.revisionsUsed} of {FREE_SET ? FREE : 'TBD'} free revisions used</small>
                      </span>
                      {v.status === 'Draft ready' && (
                        <span className="bw-acts">
                          <button className="btn btn--sm btn--ghost" data-cta="order_download_draft" onClick={() => { track('draft_downloaded', { video: v.id }); show(`Draft ${v.draft} downloaded (mock)`) }}><Icon name="download" size={14} />Draft {v.draft}</button>
                          <button className="btn btn--sm btn--ghost" data-cta="order_ask_revision" onClick={() => { setRevising(v.id); setNote('') }}>Ask for a revision</button>
                          <button className="btn btn--sm" data-cta="order_approve_final" onClick={() => { patchVideo(o.id, v.id, { status: 'Final delivered' }); track('final_approved', { video: v.id }); show('Approved. The final file is ready to download.') }}>Approve as final</button>
                        </span>
                      )}
                      {final && <button className="btn btn--sm" data-cta="order_download_final" onClick={() => { track('final_downloaded', { video: v.id }); show('Final video downloaded (mock)') }}><Icon name="download" size={14} />Download final</button>}
                      {v.status === 'Revision requested' && <span className="bw-wait"><Icon name="clock" size={14} />The editor is working on your notes.</span>}
                      {(v.status === 'In queue' || v.status === 'Editing') && <span className="bw-wait"><Icon name="clock" size={14} />{v.status === 'Editing' ? 'Being edited now' : 'Queued for an editor'}</span>}
                    </div>
                    {revising === v.id && (
                      <div className="bw-rev">
                        <label className="field"><span>What should change?</span><textarea className="textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Cut the first two seconds, make the captions bigger." /></label>
                        {paid ? <p className="bw-pay"><Icon name="card" size={16} /><span>The free revisions for this video are used. This one costs <b><Money usd={STUDIO.paidRevision} /></b>, charged to Visa ending 4242. Secure card checkout · {STUDIO.refundNote}</span></p>
                          : <p className="bw-free">Free revision {v.revisionsUsed + 1} of {FREE_SET ? FREE : 'TBD'}.</p>}
                        <div className="bw-acts">
                          <button className="btn btn--sm" disabled={!note.trim()} data-cta={paid ? 'revision_pay_and_request' : 'revision_request_free'} onClick={() => requestRevision(o, v.id, v.revisionsUsed)}>{paid ? 'Pay and request revision' : 'Request revision'}</button>
                          <button className="btn btn--sm btn--ghost" onClick={() => setRevising(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </article>
        )
      })}

      {kind === 'creator' && (
        <section className="bw-card bw-co">
          <div className="bw-co__head" aria-hidden="true"><span>Creator</span><span>Package</span><span>Amount</span><span>Status</span><span>Due</span><span>Next step</span></div>
          {shown.length === 0 ? (
            <div className="bw-empty"><span><Icon name="check" size={20} /></span><b>Nothing here</b><p>No creator orders match this filter.</p></div>
          ) : shown.map((o) => (
            <div className={`bw-co__row ${CO_FILTERS[1].match(o.status) ? 'is-hot' : ''}`} key={o.id}>
              <div className="bw-co__who"><CreatorCell handle={o.creator} lang={lang} /><small>{o.id} · {o.campaign}</small></div>
              <span className="bw-co__pkg" data-k="Package"><PlatformIcon name={o.platform} size={14} />{o.pkg}</span>
              <span className="bw-co__amt num" data-k="Amount"><Money usd={o.amountUsd} /></span>
              <span data-k="Status"><Pill>{o.status}</Pill></span>
              <span className="bw-co__due" data-k="Due">{fmtDay(o.due)}</span>
              <div className="bw-acts bw-co__next">
                {o.status === 'Draft review' && <><button className="btn btn--sm" data-cta="creator_order_approve_draft" onClick={() => setStatus(o.id, 'Scheduled', 'Draft approved. The creator will schedule the post.', 'draft_approved')}>Approve</button><button className="btn btn--sm btn--ghost" data-cta="creator_order_request_revision" onClick={() => setStatus(o.id, 'Revision', 'Revision requested from the creator.', 'revision_requested')}>Revision</button></>}
                {o.status === 'Script review' && <button className="btn btn--sm" data-cta="creator_order_approve_script" onClick={() => setStatus(o.id, 'Draft review', 'Script approved. Draft comes next.', 'script_approved')}>Approve script</button>}
                {o.status === 'Posted' && <button className="btn btn--sm btn--ghost" data-cta="creator_order_complete" onClick={() => setStatus(o.id, 'Completed', 'Order completed. Payment released to the creator.', 'order_completed')}>Mark complete</button>}
                {!['Draft review', 'Script review', 'Posted'].includes(o.status) && <span className="bw-wait">{o.status === 'Awaiting creator' ? 'Waiting for the creator to accept' : o.status === 'Revision' ? 'Creator is revising' : o.status === 'Scheduled' ? 'Goes live on the due date' : 'Nothing to do'}</span>}
              </div>
            </div>
          ))}
        </section>
      )}
      {toast}
    </>
  )
}

// ---------- Campaign Inbox, read-only for brands ----------
const STAGES = ['New', 'Negotiating', 'Agreed', 'Posted'] as const
export function BrandInbox({ lang }: { lang: string }) {
  const [open, setOpen] = useState(THREADS[0].id)
  const [stage, setStage] = useState<(typeof STAGES)[number] | ''>('')
  const [q, setQ] = useState('')
  const [read, setRead] = useState<string[]>([])
  const term = q.trim().toLowerCase()
  const list = THREADS.filter((x) => (!stage || x.stage === stage) && (!term || `${x.from} ${x.creator || ''} ${x.subject} ${x.preview}`.toLowerCase().includes(term)))
  const t = THREADS.find((x) => x.id === open)!
  const unread = THREADS.filter((x) => x.unread && !read.includes(x.id)).length
  const si = STAGES.indexOf(t.stage)
  const pick = (id: string) => {
    setOpen(id); setRead((r) => (r.includes(id) ? r : [...r, id])); track('thread_opened', { thread: id, readonly: true })
    if (window.matchMedia('(max-width: 900px)').matches) document.getElementById('bw-conv')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const av = t.creator ? avatarOf(t.creator) : { tone: 2, initial: t.from[0] }

  return (
    <>
      <WorkHead icon="inbox" title="Campaign Inbox"
        sub={<>Follow every conversation your campaign manager has with creators. <b>{unread} unread.</b></>}
        stats={STAGES.map((s) => ({ n: THREADS.filter((x) => x.stage === s).length, l: s, hot: s === 'Negotiating' }))}>
        <span className="bw-ro"><Icon name="eye" size={15} />Read-only</span>
      </WorkHead>

      <div className="bw-card bw-inbox">
        <aside className="bw-inbox__list">
          <label className="bw-search"><Icon name="search" size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search threads" aria-label="Search threads" /></label>
          <div className="bw-chips bw-chips--sm" role="group" aria-label="Stage">
            {(['', ...STAGES] as const).map((s) => <button key={s || 'all'} aria-pressed={stage === s} onClick={() => setStage(s)}>{s || 'All'}<span>{s ? THREADS.filter((x) => x.stage === s).length : THREADS.length}</span></button>)}
          </div>
          <ul>
            {list.length === 0 ? <li className="bw-empty bw-empty--sm"><b>No threads</b><p>Try another stage or search.</p></li> : list.map((x) => {
              const a = x.creator ? avatarOf(x.creator) : { tone: 2, initial: x.from[0] }
              const isUnread = x.unread && !read.includes(x.id)
              return (
                <li key={x.id}>
                  <button className={`bw-thread ${x.id === open ? 'is-on' : ''} ${isUnread ? 'is-unread' : ''}`} data-cta="brand_inbox_open_thread" onClick={() => pick(x.id)}>
                    <span className={`av tone-${a.tone}`}>{a.initial}</span>
                    <span className="bw-thread__t">
                      <span className="bw-thread__top"><b>{x.from}{x.creator ? <small> @{x.creator}</small> : null}</b><time>{x.when}</time></span>
                      <span className="bw-thread__s">{x.subject}</span>
                      <span className="bw-thread__p">{x.preview}</span>
                    </span>
                    {isUnread ? <i className="bw-dot" aria-label="Unread" /> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <section className="bw-conv" id="bw-conv" aria-label={t.subject}>
          <header className="bw-conv__h">
            <span className={`av tone-${av.tone}`}>{av.initial}</span>
            <div><h3>{t.subject}</h3><p>{t.creator ? <>with @{t.creator}</> : t.from} · run by your campaign manager</p></div>
            <Pill>{t.stage}</Pill>
          </header>
          <ol className="bw-stage" aria-label="Deal stage">{STAGES.map((s, k) => <li key={s} className={k < si ? 'is-done' : k === si ? 'is-now' : ''}><i />{s}</li>)}</ol>
          <div className="bw-msgs">
            <p className="bw-day">{t.when}</p>
            <div className="bw-msg bw-msg--in">
              <span className={`av tone-${av.tone}`}>{av.initial}</span>
              <div><small>{t.from}{t.creator ? ` · @${t.creator}` : ''}</small><p>{t.preview}</p></div>
            </div>
            <div className="bw-msg bw-msg--out">
              <div><small>Your campaign manager · draft, not sent yet</small><p>{t.aiDraft}</p></div>
            </div>
          </div>
          <div className="bw-locked">
            <span><Icon name="lock" size={15} /></span>
            <p><b>Replying is turned off for brand accounts.</b> Your campaign manager sends every message to creators for you.</p>
            <button className="btn btn--sm" data-cta="brand_inbox_ask_manager" onClick={() => track('cta_click', { cta: 'ask_manager' })}>Ask your campaign manager</button>
          </div>
          {t.creator ? <div className="bw-conv__who"><CreatorCell handle={t.creator} lang={lang} /></div> : null}
        </section>
      </div>
    </>
  )
}

// ---------- Agency Orders, the brand's side ----------
const AO_STAGES = ['Listing', 'Brand approval', 'Contracting', 'Live', 'Reporting'] as const
export function BrandAgencyOrders({ lang }: { lang: string }) {
  const [view, setView] = useState<'compact' | 'full'>('full')
  const [orders, setOrders] = useState(AGENCY_ORDERS.filter((o) => o.client === 'Lumi Skin'))
  const [toast, show] = useToast()
  const decide = (oid: string, creator: string, status: Listing['status']) => {
    setOrders((os) => os.map((o) => (o.id !== oid ? o : { ...o, listings: o.listings.map((l) => (l.creator === creator ? { ...l, status } : l)) })))
    track(status === 'Declined' ? 'listing_declined' : 'listing_approved', { order: oid, creator }); show(status === 'Declined' ? `@${creator} declined` : `@${creator} approved. Your agency will contract them.`)
  }
  const waiting = orders.flatMap((o) => o.listings).filter((l) => l.status === 'Proposed').length
  const budget = orders.reduce((s, o) => s + o.budgetUsd, 0)

  return (
    <>
      <WorkHead icon="list" title="Agency Orders"
        sub={<>Campaigns the MegaEvolution team runs for you. {waiting ? <><b>{waiting} creator{waiting === 1 ? '' : 's'}</b> waiting for your decision.</> : 'Nothing waiting for you.'}</>}
        stats={[
          { n: orders.length, l: 'Campaigns' },
          { n: <Money usd={budget} />, l: 'Total budget' },
          { n: orders.reduce((s, o) => s + o.listings.length, 0), l: 'Creators listed' },
          { n: waiting, l: 'Waiting for you', hot: true },
        ]}>
        <div className="bw-seg bw-seg--dark" role="group" aria-label="View">
          <button aria-pressed={view === 'compact'} onClick={() => { setView('compact'); track('agency_orders_view', { view: 'compact' }) }}>Compact</button>
          <button aria-pressed={view === 'full'} onClick={() => { setView('full'); track('agency_orders_view', { view: 'full' }) }}>Full</button>
        </div>
      </WorkHead>

      {orders.length === 0 ? <div className="bw-card bw-empty"><span><Icon name="list" size={20} /></span><b>No agency campaigns yet</b><p>When the MegaEvolution team runs a campaign for you, it shows up here.</p></div> : null}

      {orders.map((o) => {
        const live = o.listings.filter((l) => l.status !== 'Declined')
        const committed = live.filter((l) => l.status !== 'Proposed').reduce((s, l) => s + l.feeUsd, 0)
        const proposed = live.filter((l) => l.status === 'Proposed').reduce((s, l) => s + l.feeUsd, 0)
        const left = Math.max(o.budgetUsd - committed - proposed, 0)
        const si = AO_STAGES.indexOf(o.stage)
        const sorted = [...o.listings].sort((a, b) => Number(b.status === 'Proposed') - Number(a.status === 'Proposed') || Number(a.status === 'Declined') - Number(b.status === 'Declined'))
        return (
          <article className="bw-card bw-ao" key={o.id}>
            <header className="bw-ao__h">
              <div>
                <p className="bw-ao__id">{o.id} · {o.pricing}</p>
                <h3>{o.title}</h3>
                <p className="bw-ao__meta"><span className="bw-mgr"><span className="av tone-3">{o.manager[0]}</span>Managed by {o.manager}</span>{o.markets.map((m) => <Market key={m} id={m} />)}</p>
              </div>
              <Pill>{o.stage}</Pill>
            </header>
            <ol className="bw-stage bw-stage--wide" aria-label="Campaign stage">{AO_STAGES.map((s, k) => <li key={s} className={k < si ? 'is-done' : k === si ? 'is-now' : ''}><i />{s}</li>)}</ol>

            <div className="bw-budget">
              <div className="bw-budget__nums">
                <span><small>Budget</small><b className="num"><Money usd={o.budgetUsd} /></b></span>
                <span><i className="is-c" /><small>Committed</small><b><Money usd={committed} /></b></span>
                <span><i className="is-p" /><small>Proposed</small><b><Money usd={proposed} /></b></span>
                <span><i /><small>Left</small><b><Money usd={left} /></b></span>
              </div>
              <div className="bw-budget__bar" aria-hidden="true">
                <i className="is-c" style={{ width: `${(committed / o.budgetUsd) * 100}%` }} />
                <i className="is-p" style={{ width: `${(proposed / o.budgetUsd) * 100}%` }} />
              </div>
            </div>

            <div className={`bw-listings ${view === 'compact' ? 'is-compact' : ''}`}>
              {sorted.map((l) => {
                const a = avatarOf(l.creator)
                return (
                  <div className={`bw-li ${l.status === 'Proposed' ? 'is-hot' : ''} ${l.status === 'Declined' ? 'is-off' : ''}`} key={l.creator}>
                    {view === 'full'
                      ? <div className="bw-li__who"><CreatorCell handle={l.creator} lang={lang} /></div>
                      : <div className="bw-li__who bw-li__who--sm"><span className={`av tone-${a.tone}`}>{a.initial}</span><b>@{l.creator}</b><Market id={l.market} /></div>}
                    {view === 'full' ? <p className="bw-li__opt"><Icon name="play" size={13} />{l.option}</p> : null}
                    <div className="bw-li__row">
                      <b className="num bw-li__fee"><Money usd={l.feeUsd} /></b>
                      <Pill>{l.status}</Pill>
                    </div>
                    {l.status === 'Proposed' ? (
                      <div className="bw-acts">
                        <button className="btn btn--sm" data-cta="listing_approve" onClick={() => decide(o.id, l.creator, 'Approved by brand')}><Icon name="check" size={14} />Approve</button>
                        <button className="btn btn--sm btn--ghost" data-cta="listing_decline" onClick={() => decide(o.id, l.creator, 'Declined')}>Decline</button>
                      </div>
                    ) : <p className="bw-li__done">{l.status === 'Declined' ? 'You declined this creator' : 'You approved this creator'}</p>}
                  </div>
                )
              })}
            </div>
          </article>
        )
      })}
      {toast}
    </>
  )
}
