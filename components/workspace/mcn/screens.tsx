'use client'
// MCN workspace screens (dummy account: Trang Lê, Lotus Talent). State lives in the browser tab only.
import Link from 'next/link'
import { useState } from 'react'
import { href } from '@/data/site'
import type { Mcn } from '@/data/mcns'
import {
  MCN_KPIS, ROSTER_STATUS, MCN_DEALS, APPLICATIONS, CONTRACTS, BUILDER_BLOCKS, BUILDER_TEMPLATES, PORTAL, AGENCY_REQUESTS, MCN_SPLITS,
  type Application, type Contract, type AgencyRequest,
} from '@/data/workspace-b'
import { localMoney, fmtDate, compact } from '@/lib/format'
import { track } from '@/lib/track'
import { Icon, Arrow } from '../../Icon'
import { WsHead, Pill } from '../Shell'
import { createStore, useToast, goTab } from '../common-b'

export type RosterRow = { handle: string; name: string; city: string; category: string; followers: number; er: number; tone: number }
const vnd = (n: number) => localMoney(n, 'VND')
const Av = ({ r, size = 30 }: { r: { name: string; tone: number }; size?: number }) => <span className={`av tone-${r.tone}`} style={{ ['--s' as any]: `${size}px` }} aria-hidden="true">{r.name[0]}</span>

const apps = createStore<Application[]>(APPLICATIONS)
const contracts = createStore<Contract[]>(CONTRACTS)

/* ---------- home: talent manager dashboard ---------- */
export function McnHome({ roster, lang }: { roster: RosterRow[]; lang: string }) {
  const a = apps.use().filter((x) => x.status === 'Pending')
  const counters = contracts.use().filter((x) => x.status === 'Counter-offer').length
  return (
    <>
      <WsHead title="Talent manager dashboard" sub="Lotus Talent · sample figures">
        <button className="btn btn--sm" onClick={() => goTab('talent')} data-cta="ws_mcn_review_applications">Review applications</button>
      </WsHead>
      <div className="wgrid-4">
        {MCN_KPIS.map((k, i) => <div className="kpi" key={k.label}><b>{i === 3 ? a.length : k.value}</b><span>{k.label}</span><small>{i === 3 ? `${counters} counter-offer waiting` : k.note}</small></div>)}
      </div>
      <div className="wgrid-main">
        <div className="wcard wcard--flush">
          <div className="wcard__h" style={{ paddingBottom: 8 }}><h3>Roster</h3><button className="tlink small" onClick={() => goTab('talent')}>Manage talent<Arrow size={14} /></button></div>
          <RosterTable roster={roster} lang={lang} />
        </div>
        <div className="wcard">
          <div className="wcard__h"><h3>Open deals</h3></div>
          {MCN_DEALS.map((d) => (
            <div className="wrow" key={d.creator + d.brand}>
              <div className="wrow__t"><b>@{d.creator} · {d.brand}</b><small>{d.what} · {vnd(d.fee)}</small></div>
              <Pill>{d.status}</Pill>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function RosterTable({ roster, lang }: { roster: RosterRow[]; lang: string }) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead><tr><th>Creator</th><th>Category</th><th>Followers</th><th>Eng.</th><th>Status</th></tr></thead>
        <tbody>
          {roster.map((r, i) => (
            <tr key={r.handle}>
              <td><Link className="wb-who" href={href(lang, `/@${r.handle}`)} prefetch={false}><Av r={r} /><span><b>@{r.handle}</b><small>{r.name} · {r.city}</small></span></Link></td>
              <td>{r.category}</td><td className="tnum">{compact(r.followers)}</td><td className="tnum">{r.er}%</td>
              <td><span className={`pill ${ROSTER_STATUS[i % ROSTER_STATUS.length] === 'Paused' ? 'pill--warn' : ROSTER_STATUS[i % ROSTER_STATUS.length] === 'On a deal' ? 'pill--do' : 'pill--ok'}`}>{ROSTER_STATUS[i % ROSTER_STATUS.length]}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- talent: roster + applications ---------- */
export function McnTalent({ roster, lang }: { roster: RosterRow[]; lang: string }) {
  const list = apps.use()
  const [toast, show] = useToast()
  const decide = (handle: string, status: 'Approved' | 'Declined') => {
    apps.set((l) => l.map((x) => (x.handle === handle ? { ...x, status } : x)))
    track(status === 'Approved' ? 'mcn_application_approved' : 'mcn_application_declined', { creator: handle })
    show(status === 'Approved' ? `@${handle} approved. A contract draft is ready under Contracts.` : `@${handle} declined`)
  }
  const [copied, setCopied] = useState(false)
  return (
    <>
      <WsHead title="Talent" sub="Your roster, and creators who applied to join.">
        <button className="btn btn--ghost btn--sm" onClick={() => { setCopied(true); track('mcn_invite_link_copied'); show('Invite link copied: megaevolution.io/signup?mcn=lotus-talent') }} data-cta="ws_mcn_copy_invite"><Icon name="plus" size={15} />{copied ? 'Invite link copied' : 'Copy invite link'}</button>
      </WsHead>
      <div className="wcard">
        <div className="wcard__h"><h3>Applications</h3><span className="small muted">{list.filter((x) => x.status === 'Pending').length} to review</span></div>
        {list.map((x) => (
          <div className="wrow wb-wrap" key={x.handle}>
            <Av r={{ name: x.name, tone: x.handle === 'minh.beauty' ? 1 : 4 }} size={36} />
            <div className="wrow__t"><b>@{x.handle}</b><small>{x.note} · {x.when}</small></div>
            {x.status === 'Pending' ? (
              <div className="row" style={{ gap: 8 }}>
                <Link className="btn btn--ghost btn--sm" href={href(lang, `/@${x.handle}`)} prefetch={false}>View profile</Link>
                <button className="btn btn--sm" onClick={() => decide(x.handle, 'Approved')} data-cta="ws_mcn_approve_application">Approve</button>
                <button className="btn btn--ghost btn--sm" onClick={() => decide(x.handle, 'Declined')} data-cta="ws_mcn_decline_application">Decline</button>
              </div>
            ) : <span className={`pill ${x.status === 'Approved' ? 'pill--ok' : 'pill--bad'}`}>{x.status}</span>}
          </div>
        ))}
        <p className="wnote" style={{ marginTop: 12 }}><Icon name="users" size={16} />Creators who sign up with your invite link see “Join Lotus Talent as my MCN” ticked by default.</p>
      </div>
      <div className="wcard wcard--flush">
        <div className="wcard__h" style={{ paddingBottom: 8 }}><h3>Roster</h3><span className="small muted">{roster.length} of 38 shown</span></div>
        <RosterTable roster={roster} lang={lang} />
      </div>
      {toast}
    </>
  )
}

/* ---------- contracts + counter-offers ---------- */
export function McnContracts() {
  const list = contracts.use()
  const [id, setId] = useState(list.find((c) => c.status === 'Counter-offer')?.id || list[0].id)
  const [counter, setCounter] = useState(21)
  const [mode, setMode] = useState<'idle' | 'counter'>('idle')
  const [toast, show] = useToast()
  const c = list.find((x) => x.id === id) || list[0]
  const last = c.history[c.history.length - 1]
  const update = (patch: Partial<Contract>, step?: Contract['history'][number]) => contracts.set((l) => l.map((x) => (x.id === c.id ? { ...x, ...patch, history: step ? [...x.history, step] : x.history } : x)))
  const accept = () => { update({ status: 'Signed', share: last.share }, { by: 'MCN', share: last.share, note: `Accepted at ${last.share}%. Contract sent for signature.`, when: 'Just now' }); track('counter_offer_accepted', { contract: c.id, share: last.share }); show(`Accepted at ${last.share}%`) }
  const send = () => { update({ status: 'Counter sent', share: counter }, { by: 'MCN', share: counter, note: `Counter-offer: ${counter}% MCN share, same term.`, when: 'Just now' }); setMode('idle'); track('counter_offer_sent', { contract: c.id, share: counter }); show(`Counter-offer of ${counter}% sent to @${c.handle}`) }
  const decline = () => { update({ status: 'Declined' }, { by: 'MCN', share: c.share, note: 'Declined the counter-offer. Contract closed.', when: 'Just now' }); track('counter_offer_declined', { contract: c.id }); show('Counter-offer declined') }
  return (
    <>
      <WsHead title="Contracts" sub="Revenue share with each creator, and any counter-offers." />
      <div className="wgrid-main wb-orders">
        <div className="wcard wcard--flush">
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Creator</th><th>MCN share</th><th>Term</th><th>Status</th></tr></thead>
              <tbody>
                {list.map((x) => (
                  <tr key={x.id} className={x.id === c.id ? 'is-on' : ''} onClick={() => { setId(x.id); setMode('idle') }}>
                    <td><button className="wb-rowbtn" aria-label={`Open contract ${x.id}`}><b>@{x.handle}</b><small>{x.id}</small></button></td>
                    <td className="tnum"><b>{x.share}%</b></td><td>{x.term}</td>
                    <td><Pill>{x.status === 'Counter sent' ? 'Pending' : x.status}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="wcard stack" aria-live="polite">
          <div className="wcard__h" style={{ marginBottom: 0 }}><h3>{c.id} · @{c.handle}</h3><Pill>{c.status === 'Counter sent' ? 'Pending' : c.status}</Pill></div>
          <div className="wb-share">
            <div><small>Your offer</small><b className="num">{c.history[0].share}%</b></div>
            <Icon name="arrow" size={18} />
            <div><small>{c.status === 'Counter-offer' ? 'Creator asks for' : 'Latest'}</small><b className="num">{last.share}%</b></div>
            <p className="small muted">On a ₫10M deal the creator keeps {vnd(10_000_000 * (1 - last.share / 100))} and the MCN {vnd(10_000_000 * (last.share / 100))}.</p>
          </div>
          <ol className="wb-tl">
            {c.history.map((h, i) => <li key={i} className={h.by === 'MCN' ? 'is-me' : ''}><b>{h.by === 'MCN' ? 'Lotus Talent' : `@${c.handle}`} · {h.share}%</b><span>{h.note}</span><small>{h.when}</small></li>)}
          </ol>
          {c.status === 'Counter-offer' && mode === 'idle' && (
            <div className="row">
              <button className="btn" onClick={accept} data-cta="ws_mcn_accept_counter">Accept {last.share}%</button>
              <button className="btn btn--ghost" onClick={() => setMode('counter')} data-cta="ws_mcn_counter_again">Counter again</button>
              <button className="ulink small" onClick={decline} data-cta="ws_mcn_decline_counter">Decline</button>
            </div>
          )}
          {c.status === 'Counter-offer' && mode === 'counter' && (
            <div className="wb-counter">
              <label htmlFor="counter-share"><span className="label">Your new offer: <b className="tnum">{counter}%</b> MCN share</span>
                <input id="counter-share" type="range" min={10} max={30} value={counter} onChange={(e) => setCounter(Number(e.target.value))} />
              </label>
              <div className="row"><button className="btn" onClick={send} data-cta="ws_mcn_send_counter">Send counter-offer</button><button className="ulink small" onClick={() => setMode('idle')}>Cancel</button></div>
            </div>
          )}
          {c.status === 'Counter sent' && <p className="wnote"><Icon name="clock" size={16} /><span>Waiting for @{c.handle} to reply. <button className="ulink" onClick={() => { update({ status: 'Signed' }, { by: 'Creator', share: c.share, note: 'Accepted and signed.', when: 'Just now' }); show('Demo: the creator accepted and signed') }}>Demo: creator accepts</button></span></p>}
          {c.status === 'Signed' && <p className="wnote"><Icon name="check" size={16} />Signed at {c.share}%. {c.term}.</p>}
          {c.status === 'Pending' && <p className="wnote"><Icon name="clock" size={16} />Sent. Waiting for the creator to sign or send a counter-offer.</p>}
          {c.status === 'Declined' && <p className="wnote"><Icon name="close" size={16} />This contract was closed without a deal.</p>}
        </div>
      </div>
      {toast}
    </>
  )
}

/* ---------- homepage builder ---------- */
export function McnBuilder({ lang, mcn, roster }: { lang: string; mcn: Mcn; roster: RosterRow[] }) {
  const [tpl, setTpl] = useState(BUILDER_TEMPLATES[0].id)
  const [blocks, setBlocks] = useState<string[]>(BUILDER_TEMPLATES[0].blocks)
  const [published, setPublished] = useState(false)
  const [toast, show] = useToast()
  const pickTpl = (id: string) => { const t = BUILDER_TEMPLATES.find((x) => x.id === id)!; setTpl(id); setBlocks(t.blocks); setPublished(false); track('homepage_template_selected', { template: id }) }
  const move = (i: number, d: number) => setBlocks((b) => { const n = [...b]; const j = i + d; if (j < 0 || j >= n.length) return b; [n[i], n[j]] = [n[j], n[i]]; return n })
  const remove = (k: string) => setBlocks((b) => b.filter((x) => x !== k))
  const add = (k: string) => { setBlocks((b) => [...b, k]); track('homepage_block_added', { block: k }) }
  const unused = Object.keys(BUILDER_BLOCKS).filter((k) => !blocks.includes(k))
  const publish = () => { setPublished(true); track('homepage_published', { template: tpl, blocks: blocks.join(',') }); show('Homepage published at megaevolution.io/mcn/lotus-talent') }
  return (
    <>
      <WsHead title="Homepage builder" sub="Your public page at megaevolution.io/mcn/lotus-talent. Custom domain comes later.">
        <Link className="btn btn--ghost btn--sm" href={href(lang, `/mcn/${mcn.slug}`)} prefetch={false} data-cta="ws_mcn_view_public_page"><Icon name="eye" size={15} />View live page</Link>
        <button className="btn btn--sm" onClick={publish} data-cta="ws_mcn_publish_homepage">{published ? 'Published' : 'Publish'}</button>
      </WsHead>
      <div className="wb-builder">
        <div className="stack">
          <div className="wcard">
            <div className="wcard__h"><h3>Template</h3></div>
            <div className="wseg" role="group" aria-label="Template">{BUILDER_TEMPLATES.map((t) => <button key={t.id} aria-pressed={tpl === t.id} onClick={() => pickTpl(t.id)}>{t.name}</button>)}</div>
          </div>
          <div className="wcard">
            <div className="wcard__h"><h3>Blocks</h3><span className="small muted">{blocks.length} on the page</span></div>
            <ol className="wb-blocks">
              {blocks.map((k, i) => (
                <li key={k}>
                  <span className="wb-blocks__n">{i + 1}</span>
                  <div><b>{BUILDER_BLOCKS[k].name}</b><small>{BUILDER_BLOCKS[k].hint}</small></div>
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${BUILDER_BLOCKS[k].name} up`}><Icon name="chevron" size={16} className="wb-up" /></button>
                  <button onClick={() => move(i, 1)} disabled={i === blocks.length - 1} aria-label={`Move ${BUILDER_BLOCKS[k].name} down`}><Icon name="chevron" size={16} /></button>
                  <button onClick={() => remove(k)} aria-label={`Remove ${BUILDER_BLOCKS[k].name}`}><Icon name="close" size={15} /></button>
                </li>
              ))}
            </ol>
            {unused.length ? <div className="row" style={{ gap: 6, marginTop: 12 }}>{unused.map((k) => <button key={k} className="chip" onClick={() => add(k)} data-cta="ws_mcn_add_block"><Icon name="plus" size={14} />{BUILDER_BLOCKS[k].name}</button>)}</div> : null}
          </div>
          {published ? <p className="wnote"><Icon name="check" size={16} /><span>Published. <Link className="ulink" href={href(lang, `/mcn/${mcn.slug}`)} prefetch={false}>Open megaevolution.io/mcn/{mcn.slug}</Link></span></p> : null}
        </div>

        <div className={`wb-prev wb-prev--${tpl}`} aria-label="Live preview">
          <div className="wb-prev__bar"><i /><i /><i /><span>megaevolution.io/mcn/{mcn.slug}</span></div>
          <div className="wb-prev__page">
            {blocks.length === 0 ? <p className="muted small" style={{ padding: 30, textAlign: 'center' }}>Add a block to start your page.</p> : null}
            {blocks.map((k) => (
              <section key={k} className={`wb-b wb-b--${k}`}>
                {k === 'hero' && <><span className="wb-logo">{mcn.initials}</span><h3>{mcn.name}</h3><p>{mcn.tagline}</p><span className="wb-fakebtn">Work with us</span></>}
                {k === 'stats' && <ul>{mcn.stats.map((s) => <li key={s.label}><b className="num">{s.value}</b>{s.label}</li>)}</ul>}
                {k === 'roster' && <><h4>Our creators</h4><ul>{roster.slice(0, 6).map((r) => <li key={r.handle}><Av r={r} size={34} /><b>@{r.handle}</b><small>{compact(r.followers)}</small></li>)}</ul></>}
                {k === 'services' && <><h4>Services</h4><ul>{mcn.services.map((s) => <li key={s}>{s}</li>)}</ul></>}
                {k === 'about' && <><h4>About</h4><p>{mcn.about}</p></>}
                {k === 'contact' && <><h4>Contact</h4><div className="wb-fakeform"><i /><i /><span className="wb-fakebtn">Send request</span></div></>}
              </section>
            ))}
          </div>
        </div>
      </div>
      {toast}
    </>
  )
}

/* ---------- signed-creator portal ---------- */
export function McnPortal() {
  const total = PORTAL.deals.reduce((a, d) => a + d.fee, 0)
  return (
    <>
      <WsHead title="Signed-creator portal" sub={`A preview of what @${PORTAL.handle} sees after signing with Lotus Talent.`} />
      <div className="wb-portal">
        <div className="wb-portal__top"><span className="wb-logo">LT</span><div><b>Lotus Talent</b><small>Signed creator · @{PORTAL.handle}</small></div><span className="pill pill--ok">Contract active</span></div>
        <div className="wgrid-3">
          <div className="kpi"><b>{100 - PORTAL.share}%</b><span>Your share of every deal</span><small>MCN share {PORTAL.share}%</small></div>
          <div className="kpi"><b>{vnd(total * (1 - PORTAL.share / 100))}</b><span>Your earnings</span><small>from {PORTAL.deals.length} deals</small></div>
          <div className="kpi"><b>Trang Lê</b><span>Your talent manager</span><small>replies within a day</small></div>
        </div>
        <div className="wgrid-main">
          <div className="wcard wcard--flush">
            <div className="wcard__h" style={{ paddingBottom: 8 }}><h3>My deals</h3></div>
            <div className="tbl-wrap"><table className="tbl">
              <thead><tr><th>Brand</th><th>Deal</th><th>Fee</th><th>You keep</th><th>Status</th></tr></thead>
              <tbody>{PORTAL.deals.map((d) => <tr key={d.brand + d.what}><td><b>{d.brand}</b></td><td>{d.what}</td><td className="tnum">{vnd(d.fee)}</td><td className="tnum"><b>{vnd(d.fee * (1 - PORTAL.share / 100))}</b></td><td><Pill>{d.status}</Pill></td></tr>)}</tbody>
            </table></div>
          </div>
          <div className="wcard">
            <div className="wcard__h"><h3>Documents</h3></div>
            {PORTAL.docs.map((d) => <div className="wrow" key={d}><Icon name="file" size={17} /><div className="wrow__t"><b>{d}</b></div><Icon name="download" size={16} /></div>)}
          </div>
        </div>
      </div>
    </>
  )
}

/* ---------- agency requests ---------- */
export function McnAgencyOrders({ lang }: { lang: string }) {
  const [list, setList] = useState<AgencyRequest[]>(AGENCY_REQUESTS)
  const [toast, show] = useToast()
  const decide = (id: string, status: 'Accepted' | 'Declined') => { setList((l) => l.map((x) => (x.id === id ? { ...x, status } : x))); track('agency_request_' + status.toLowerCase(), { order: id }); show(status === 'Accepted' ? 'Request accepted. The agency can now add these creators to its listing.' : 'Request declined') }
  return (
    <>
      <WsHead title="Agency Orders" sub="Agencies asking for creators on your roster. Shown only to roles that can open it." />
      <div className="stack">
        {list.map((r) => (
          <div className="wcard" key={r.id}>
            <div className="wcard__h"><h3>{r.agency} · for {r.client}</h3><Pill>{r.status}</Pill></div>
            <p className="small muted">{r.id} · {r.wants} · total creator fees {vnd(r.budget)}</p>
            <div className="row" style={{ gap: 6, margin: '12px 0' }}>{r.creators.map((h) => <Link key={h} className="chip" href={href(lang, `/@${h}`)} prefetch={false}>@{h}</Link>)}</div>
            {r.status === 'Pending' ? (
              <div className="row">
                <button className="btn btn--sm" onClick={() => decide(r.id, 'Accepted')} data-cta="ws_mcn_accept_agency_request">Accept request</button>
                <button className="btn btn--ghost btn--sm" onClick={() => decide(r.id, 'Declined')} data-cta="ws_mcn_decline_agency_request">Decline</button>
                <button className="ulink small" onClick={() => goTab('messages')}>Message the agency</button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {toast}
    </>
  )
}

/* ---------- billing: payout splits ---------- */
export function McnBilling() {
  const paid = MCN_SPLITS.filter((s) => s.status === 'Paid')
  const mcnCut = paid.reduce((a, s) => a + (s.fee * s.share) / 100, 0)
  const toCreators = paid.reduce((a, s) => a + s.fee * (1 - s.share / 100), 0)
  return (
    <>
      <WsHead title="Billing" sub="How each deal is split between the creator and the MCN. Sample figures." />
      <div className="wgrid-3">
        <div className="kpi"><b>{vnd(mcnCut)}</b><span>MCN share received</span><small>this month</small></div>
        <div className="kpi"><b>{vnd(toCreators)}</b><span>Paid to creators</span><small>this month</small></div>
        <div className="kpi"><b>{MCN_SPLITS.length - paid.length}</b><span>Split pending</span><small>released on brand approval</small></div>
      </div>
      <div className="wcard wcard--flush">
        <div className="wcard__h" style={{ paddingBottom: 8 }}><h3>Payout splits</h3></div>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th>Split</th><th>Date</th><th>Creator</th><th>Deal</th><th>Fee</th><th>Creator gets</th><th>MCN gets</th><th>Status</th></tr></thead>
          <tbody>{MCN_SPLITS.map((s) => (
            <tr key={s.id}><td>{s.id}</td><td className="tnum">{fmtDate(s.date)}</td><td>@{s.creator}</td><td>{s.deal}</td><td className="tnum">{vnd(s.fee)}</td>
              <td className="tnum">{vnd(s.fee * (1 - s.share / 100))}</td><td className="tnum"><b>{vnd((s.fee * s.share) / 100)}</b> <small className="muted">{s.share}%</small></td><td><Pill>{s.status}</Pill></td></tr>
          ))}</tbody>
        </table></div>
      </div>
    </>
  )
}
