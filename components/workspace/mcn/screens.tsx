'use client'
// MCN workspace screens (dummy account: Trang Lê, Lotus Talent). State lives in the browser tab only.
// Every screen opens with the shared navy band; Home uses the brand-home hero / KPI / columns.
import Link from 'next/link'
import { useState } from 'react'
import '@/styles/brand-home.css'
import '@/styles/ws-mcn.css'
import { href } from '@/data/site'
import type { Mcn } from '@/data/mcns'
import {
  MCN_KPIS, ROSTER_STATUS, MCN_DEALS, APPLICATIONS, CONTRACTS, BUILDER_BLOCKS, BUILDER_TEMPLATES, PORTAL, AGENCY_REQUESTS, MCN_SPLITS,
  type Application, type Contract, type AgencyRequest,
} from '@/data/workspace-b'
import { localMoney, fmtDate, compact } from '@/lib/format'
import { track } from '@/lib/track'
import { Icon, Arrow } from '../../Icon'
import { Pill } from '../Shell'
import { createStore, useToast, goTab, BandHead } from '../common-b'

export type RosterRow = { handle: string; name: string; city: string; category: string; followers: number; er: number; tone: number }
const vnd = (n: number) => localMoney(n, 'VND')
const Av = ({ r, size = 30 }: { r: { name: string; tone: number }; size?: number }) => <span className={`av tone-${r.tone}`} style={{ ['--s' as string]: `${size}px` }} aria-hidden="true">{r.name[0]}</span>
const statusOf = (i: number) => ROSTER_STATUS[i % ROSTER_STATUS.length]
const statusPill = (s: string) => (s === 'Paused' ? 'pill--warn' : s === 'On a deal' ? 'pill--do' : 'pill--ok')

const apps = createStore<Application[]>(APPLICATIONS)
const contracts = createStore<Contract[]>(CONTRACTS)

/* ---------- home: talent manager dashboard ---------- */
export function McnHome({ roster, lang }: { roster: RosterRow[]; lang: string }) {
  const a = apps.use().filter((x) => x.status === 'Pending')
  const counters = contracts.use().filter((x) => x.status === 'Counter-offer').length
  const agencyPending = AGENCY_REQUESTS.filter((r) => r.status === 'Pending').length
  const needs = [
    a.length ? { icon: 'users', t: `${a.length} creator${a.length === 1 ? '' : 's'} want to join`, s: 'Approve them and a contract draft is ready.', to: 'talent', cta: 'Review', tag: 'Talent' } : null,
    counters ? { icon: 'file', t: `${counters} counter-offer waiting`, s: 'Accept, counter again or decline.', to: 'contracts', cta: 'Open', tag: 'Contracts' } : null,
    agencyPending ? { icon: 'building', t: `${agencyPending} agency request${agencyPending === 1 ? '' : 's'}`, s: 'An agency wants creators from your roster.', to: 'agency-orders', cta: 'Decide', tag: 'Agency' } : null,
  ].filter(Boolean) as { icon: string; t: string; s: string; to: string; cta: string; tag: string }[]
  const kpiIcon = ['users', 'bag', 'card', 'file']

  return (
    <>
      <section className="bh-hero" aria-label="Today">
        <div className="bh-hero__copy">
          <p className="bh-hero__date">Friday, 20 Nov · Lotus Talent</p>
          <h2>Good morning, <span className="it">Trang.</span></h2>
          <p><b>{MCN_KPIS[0].value} signed creators</b> and <b>{MCN_KPIS[1].value} open deals</b>. <b>{needs.length} things</b> need you. Sample figures.</p>
        </div>
        <div className="bh-quick">
          <button onClick={() => goTab('talent')} data-cta="ws_mcn_review_applications"><Icon name="users" size={18} /><b>Review applications</b><small>{a.length} waiting</small></button>
          <button onClick={() => goTab('contracts')} data-cta="ws_mcn_home_contracts"><Icon name="file" size={18} /><b>Contracts</b><small>{counters} counter-offer</small></button>
          <button onClick={() => goTab('builder')} data-cta="ws_mcn_home_builder"><Icon name="layout" size={18} /><b>Edit your page</b><small>Homepage builder</small></button>
          <button onClick={() => goTab('messages')} data-cta="ws_mcn_home_inbox"><Icon name="message" size={18} /><b>Shared inbox</b><small>Brands, agencies, creators</small></button>
        </div>
      </section>

      <div className="bh-kpis">
        {MCN_KPIS.map((k, i) => (
          <div className={`bh-kpi ${i === 2 ? 'bh-kpi--spend' : ''}`} key={k.label}>
            <span className="bh-kpi__ico"><Icon name={kpiIcon[i] || 'chart'} size={17} /></span>
            <b className="num">{i === 3 ? a.length : k.value}</b>
            <span className="bh-kpi__l">{k.label}</span>
            <small>{i === 3 ? `${counters} counter-offer waiting` : k.note}</small>
          </div>
        ))}
      </div>

      <div className="bh-cols">
        <div className="bh-col">
          <section className="wcard bh-needs">
            <div className="wcard__h"><h3>Needs you</h3><span className="bh-count">{needs.length}</span></div>
            {needs.length ? (
              <ol>
                {needs.map((n, i) => (
                  <li key={n.t}>
                    <span className="bh-needs__ico"><Icon name={n.icon} size={17} /></span>
                    <div><b>{n.t}</b><small><em>{n.tag}</em>{n.s}</small></div>
                    <button className={`btn btn--sm ${i ? 'btn--ghost' : ''}`} onClick={() => goTab(n.to)} data-cta="ws_mcn_home_needs_you">{n.cta}<Arrow size={13} /></button>
                  </li>
                ))}
              </ol>
            ) : <p className="mc2-muted">You’re all caught up.</p>}
          </section>
          <section className="wcard">
            <div className="wcard__h"><h3>Roster</h3><button className="ulink small" onClick={() => goTab('talent')}>Manage talent</button></div>
            <Roster roster={roster.slice(0, 5)} lang={lang} />
          </section>
        </div>
        <div className="bh-col">
          <section className="wcard">
            <div className="wcard__h"><h3>Open deals</h3><span className="bh-count">{MCN_DEALS.length}</span></div>
            <ul className="mc2-deals">
              {MCN_DEALS.map((d) => (
                <li key={d.creator + d.brand}>
                  <span className="mc2-deals__t"><b>@{d.creator}</b><small>{d.brand} · {d.what}</small></span>
                  <span className="mc2-deals__r"><b className="num">{vnd(d.fee)}</b><Pill>{d.status}</Pill></span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}

function Roster({ roster, lang, offset = 0 }: { roster: RosterRow[]; lang: string; offset?: number }) {
  return (
    <div className="mc2-roster">
      <div className="mc2-roster__h" aria-hidden="true"><span>Creator</span><span>Category</span><span>Followers</span><span>Eng.</span><span>Status</span></div>
      <ol>
        {roster.map((r, i) => {
          const s = statusOf(i + offset)
          return (
            <li key={r.handle}>
              <Link className="mc2-who" href={href(lang, `/@${r.handle}`)} prefetch={false}><Av r={r} size={34} /><span><b>@{r.handle}</b><small>{r.name} · {r.city}</small></span></Link>
              <span data-k="Category">{r.category}</span>
              <span data-k="Followers" className="num">{compact(r.followers)}</span>
              <span data-k="Eng." className="num">{r.er}%</span>
              <span data-k="Status"><span className={`pill ${statusPill(s)}`}>{s}</span></span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/* ---------- talent: roster + applications ---------- */
export function McnTalent({ roster, lang }: { roster: RosterRow[]; lang: string }) {
  const list = apps.use()
  const [toast, show] = useToast()
  const [copied, setCopied] = useState(false)
  const pending = list.filter((x) => x.status === 'Pending').length
  const decide = (handle: string, status: 'Approved' | 'Declined') => {
    apps.set((l) => l.map((x) => (x.handle === handle ? { ...x, status } : x)))
    track(status === 'Approved' ? 'mcn_application_approved' : 'mcn_application_declined', { creator: handle })
    show(status === 'Approved' ? `@${handle} approved. A contract draft is ready under Contracts.` : `@${handle} declined`)
  }
  return (
    <>
      <BandHead icon="users" title="Talent" sub="Your roster, and creators who applied to join."
        stats={[{ n: MCN_KPIS[0].value, l: 'signed creators' }, { n: pending, l: 'applications to review', hot: pending > 0 }, { n: roster.filter((_, i) => statusOf(i) === 'On a deal').length, l: 'on a deal now' }]}>
        <button className="btn btn--sm" onClick={() => { setCopied(true); track('mcn_invite_link_copied'); show('Invite link copied: megaevolution.io/signup?mcn=lotus-talent') }} data-cta="ws_mcn_copy_invite"><Icon name={copied ? 'check' : 'plus'} size={15} />{copied ? 'Invite link copied' : 'Copy invite link'}</button>
      </BandHead>

      <section className="wcard">
        <div className="wcard__h"><h3>Applications</h3><span className="bh-count">{pending}</span></div>
        <div className="mc2-apps">
          {list.map((x) => (
            <article key={x.handle} className={`mc2-app ${x.status === 'Pending' ? 'is-pending' : ''}`}>
              <Av r={{ name: x.name, tone: x.handle === 'minh.beauty' ? 1 : 4 }} size={44} />
              <div className="mc2-app__t"><b>@{x.handle}</b><small>{x.name} · {x.when}</small><p>{x.note}</p></div>
              {x.status === 'Pending' ? (
                <div className="mc2-app__act">
                  <button className="btn btn--sm" onClick={() => decide(x.handle, 'Approved')} data-cta="ws_mcn_approve_application">Approve</button>
                  <button className="btn btn--sm btn--ghost" onClick={() => decide(x.handle, 'Declined')} data-cta="ws_mcn_decline_application">Decline</button>
                  <Link className="ulink small" href={href(lang, `/@${x.handle}`)} prefetch={false}>View profile</Link>
                </div>
              ) : <span className={`pill ${x.status === 'Approved' ? 'pill--ok' : 'pill--bad'}`}>{x.status}</span>}
            </article>
          ))}
        </div>
        <p className="mc2-note"><Icon name="users" size={16} />Creators who sign up with your invite link see “Join Lotus Talent as my MCN” ticked by default.</p>
      </section>

      <section className="wcard">
        <div className="wcard__h"><h3>Roster</h3><span className="mc2-muted">{roster.length} of {MCN_KPIS[0].value} shown</span></div>
        <Roster roster={roster} lang={lang} />
      </section>
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
  const label = (s: Contract['status']) => (s === 'Counter sent' ? 'Pending' : s)
  const update = (patch: Partial<Contract>, step?: Contract['history'][number]) => contracts.set((l) => l.map((x) => (x.id === c.id ? { ...x, ...patch, history: step ? [...x.history, step] : x.history } : x)))
  const accept = () => { update({ status: 'Signed', share: last.share }, { by: 'MCN', share: last.share, note: `Accepted at ${last.share}%. Contract sent for signature.`, when: 'Just now' }); track('counter_offer_accepted', { contract: c.id, share: last.share }); show(`Accepted at ${last.share}%`) }
  const send = () => { update({ status: 'Counter sent', share: counter }, { by: 'MCN', share: counter, note: `Counter-offer: ${counter}% MCN share, same term.`, when: 'Just now' }); setMode('idle'); track('counter_offer_sent', { contract: c.id, share: counter }); show(`Counter-offer of ${counter}% sent to @${c.handle}`) }
  const decline = () => { update({ status: 'Declined' }, { by: 'MCN', share: c.share, note: 'Declined the counter-offer. Contract closed.', when: 'Just now' }); track('counter_offer_declined', { contract: c.id }); show('Counter-offer declined') }
  const creatorKeeps = 100 - last.share

  return (
    <>
      <BandHead icon="file" title="Contracts" sub="Revenue share with each creator, and any counter-offers."
        stats={[{ n: list.filter((x) => x.status === 'Signed').length, l: 'signed' }, { n: list.filter((x) => x.status === 'Counter-offer').length, l: 'counter-offers', hot: list.some((x) => x.status === 'Counter-offer') }, { n: list.filter((x) => x.status === 'Pending' || x.status === 'Counter sent').length, l: 'waiting on creators' }]} />

      <div className="mc2-split">
        <section className="wcard mc2-clist" aria-label="Contracts">
          <ul>
            {list.map((x) => (
              <li key={x.id}>
                <button className={`${x.id === c.id ? 'is-on' : ''} ${x.status === 'Counter-offer' ? 'is-hot' : ''}`} aria-label={`Open contract ${x.id}`} aria-current={x.id === c.id} onClick={() => { setId(x.id); setMode('idle') }}>
                  <span className="mc2-clist__t"><b>@{x.handle}</b><small>{x.id} · {x.term}</small></span>
                  <span className="mc2-clist__r"><b className="num">{x.share}%</b><Pill>{label(x.status)}</Pill></span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="wcard mc2-cdetail" aria-live="polite">
          <header className="mc2-cdetail__h"><div><small>{c.id}</small><h3>@{c.handle}</h3><p>{c.term}</p></div><Pill>{label(c.status)}</Pill></header>

          <div className="mc2-share">
            <div><small>Your offer</small><b className="num">{c.history[0].share}%</b></div>
            <Icon name="arrow" size={18} />
            <div className={c.status === 'Counter-offer' ? 'is-hot' : ''}><small>{c.status === 'Counter-offer' ? 'Creator asks for' : 'Latest'}</small><b className="num">{last.share}%</b></div>
            <div className="mc2-share__bar" aria-label={`MCN ${last.share}%, creator ${creatorKeeps}%`}><i style={{ flex: last.share }} /><i style={{ flex: creatorKeeps }} /></div>
            <p>On a ₫10M deal the creator keeps <b>{vnd(10_000_000 * (1 - last.share / 100))}</b> and the MCN <b>{vnd(10_000_000 * (last.share / 100))}</b>.</p>
          </div>

          <ol className="mc2-tl">
            {c.history.map((h, i) => (
              <li key={i} className={h.by === 'MCN' ? 'is-me' : ''}>
                <span className="mc2-tl__dot" />
                <div><b>{h.by === 'MCN' ? 'Lotus Talent' : `@${c.handle}`} · {h.share}%</b><p>{h.note}</p><small>{h.when}</small></div>
              </li>
            ))}
          </ol>

          {c.status === 'Counter-offer' && mode === 'idle' && (
            <div className="mc2-act">
              <button className="btn btn--sm" onClick={accept} data-cta="ws_mcn_accept_counter">Accept {last.share}%</button>
              <button className="btn btn--sm btn--ghost" onClick={() => setMode('counter')} data-cta="ws_mcn_counter_again">Counter again</button>
              <button className="ulink small" onClick={decline} data-cta="ws_mcn_decline_counter">Decline</button>
            </div>
          )}
          {c.status === 'Counter-offer' && mode === 'counter' && (
            <div className="mc2-counter">
              <label htmlFor="counter-share"><span>Your new offer</span><b className="num">{counter}%</b><small>MCN share</small></label>
              <input id="counter-share" type="range" min={10} max={30} value={counter} onChange={(e) => setCounter(Number(e.target.value))} />
              <div className="mc2-act"><button className="btn btn--sm" onClick={send} data-cta="ws_mcn_send_counter">Send counter-offer</button><button className="ulink small" onClick={() => setMode('idle')}>Cancel</button></div>
            </div>
          )}
          {c.status === 'Counter sent' && <p className="mc2-note"><Icon name="clock" size={16} /><span>Waiting for @{c.handle} to reply. <button className="ulink" onClick={() => { update({ status: 'Signed' }, { by: 'Creator', share: c.share, note: 'Accepted and signed.', when: 'Just now' }); show('Demo: the creator accepted and signed') }}>Demo: creator accepts</button></span></p>}
          {c.status === 'Signed' && <p className="mc2-note mc2-note--ok"><Icon name="check" size={16} />Signed at {c.share}%. {c.term}.</p>}
          {c.status === 'Pending' && <p className="mc2-note"><Icon name="clock" size={16} />Sent. Waiting for the creator to sign or send a counter-offer.</p>}
          {c.status === 'Declined' && <p className="mc2-note"><Icon name="close" size={16} />This contract was closed without a deal.</p>}
        </section>
      </div>
      {toast}
    </>
  )
}

/* ---------- homepage builder ---------- */
const BLOCK_ICON: Record<string, string> = { hero: 'star', stats: 'chart', roster: 'users', services: 'list', about: 'file', contact: 'mail' }
export function McnBuilder({ lang, mcn, roster }: { lang: string; mcn: Mcn; roster: RosterRow[] }) {
  const [tpl, setTpl] = useState(BUILDER_TEMPLATES[0].id)
  const [blocks, setBlocks] = useState<string[]>(BUILDER_TEMPLATES[0].blocks)
  const [published, setPublished] = useState(false)
  const [device, setDevice] = useState<'desktop' | 'phone'>('desktop')
  const [toast, show] = useToast()
  const pickTpl = (id: string) => { const t = BUILDER_TEMPLATES.find((x) => x.id === id)!; setTpl(id); setBlocks(t.blocks); setPublished(false); track('homepage_template_selected', { template: id }) }
  const move = (i: number, d: number) => { setPublished(false); setBlocks((b) => { const n = [...b]; const j = i + d; if (j < 0 || j >= n.length) return b; [n[i], n[j]] = [n[j], n[i]]; return n }) }
  const remove = (k: string) => { setPublished(false); setBlocks((b) => b.filter((x) => x !== k)) }
  const add = (k: string) => { setPublished(false); setBlocks((b) => [...b, k]); track('homepage_block_added', { block: k }) }
  const unused = Object.keys(BUILDER_BLOCKS).filter((k) => !blocks.includes(k))
  const publish = () => { setPublished(true); track('homepage_published', { template: tpl, blocks: blocks.join(',') }); show('Homepage published at megaevolution.io/mcn/lotus-talent') }

  return (
    <>
      <BandHead icon="layout" title="Homepage builder" sub="Your public page at megaevolution.io/mcn/lotus-talent. Custom domain comes later."
        stats={[{ n: blocks.length, l: 'sections on the page' }, { n: BUILDER_TEMPLATES.find((t) => t.id === tpl)?.name || '', l: 'template' }, { n: published ? 'Live' : 'Draft', l: 'status', hot: published }]}>
        <Link className="btn btn--sm mc2-ghost-dark" href={href(lang, `/mcn/${mcn.slug}`)} prefetch={false} data-cta="ws_mcn_view_public_page"><Icon name="eye" size={15} />View live page</Link>
        <button className="btn btn--sm" onClick={publish} data-cta="ws_mcn_publish_homepage">{published ? <><Icon name="check" size={14} />Published</> : 'Publish'}</button>
      </BandHead>

      <div className="mc2-builder">
        <aside className="mc2-panel">
          <section>
            <h3 className="mc2-k">Template</h3>
            <div className="mc2-tpls" role="group" aria-label="Template">
              {BUILDER_TEMPLATES.map((t) => (
                <button key={t.id} aria-pressed={tpl === t.id} onClick={() => pickTpl(t.id)}>
                  <span className={`mc2-tpl mc2-tpl--${t.id}`} aria-hidden="true"><i /><i /><i /></span>
                  {t.name}
                </button>
              ))}
            </div>
          </section>
          <section>
            <h3 className="mc2-k">Sections <small>{blocks.length} on the page</small></h3>
            <ol className="mc2-blocks">
              {blocks.map((k, i) => (
                <li key={k}>
                  <span className="mc2-blocks__ico"><Icon name={BLOCK_ICON[k] || 'layout'} size={15} /></span>
                  <div><b>{BUILDER_BLOCKS[k].name}</b><small>{BUILDER_BLOCKS[k].hint}</small></div>
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${BUILDER_BLOCKS[k].name} up`}><Icon name="chevron" size={16} className="mc2-up" /></button>
                  <button onClick={() => move(i, 1)} disabled={i === blocks.length - 1} aria-label={`Move ${BUILDER_BLOCKS[k].name} down`}><Icon name="chevron" size={16} /></button>
                  <button onClick={() => remove(k)} aria-label={`Remove ${BUILDER_BLOCKS[k].name}`}><Icon name="close" size={15} /></button>
                </li>
              ))}
            </ol>
            {unused.length ? (
              <div className="mc2-addblk">
                <small>Add a section</small>
                <div>{unused.map((k) => <button key={k} onClick={() => add(k)} data-cta="ws_mcn_add_block"><Icon name="plus" size={14} />{BUILDER_BLOCKS[k].name}</button>)}</div>
              </div>
            ) : null}
          </section>
          {published ? <p className="mc2-note mc2-note--ok"><Icon name="check" size={16} /><span>Published. <Link className="ulink" href={href(lang, `/mcn/${mcn.slug}`)} prefetch={false}>Open megaevolution.io/mcn/{mcn.slug}</Link></span></p> : null}
        </aside>

        <div className="mc2-stage">
          <div className="mc2-stage__bar">
            <span className="mc2-live"><i />Live preview</span>
            <div className="wb2-seg" role="group" aria-label="Preview size">
              <button aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}><Icon name="layout" size={14} />Desktop</button>
              <button aria-pressed={device === 'phone'} onClick={() => setDevice('phone')}><Icon name="tech" size={14} />Phone</button>
            </div>
          </div>
          <div className={`wb-prev wb-prev--${tpl} mc2-prev mc2-prev--${device}`} aria-label="Live preview">
            <div className="wb-prev__bar"><i /><i /><i /><span>megaevolution.io/mcn/{mcn.slug}</span></div>
            <div className="wb-prev__page">
              {blocks.length === 0 ? <p className="mc2-muted" style={{ padding: 30, textAlign: 'center' }}>Add a section to start your page.</p> : null}
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
      <BandHead icon="eye" title="Signed-creator portal" sub={`A preview of what @${PORTAL.handle} sees after signing with Lotus Talent.`} />
      <div className="mc2-portal">
        <header className="mc2-portal__top">
          <span className="wb-logo">LT</span>
          <div><b>Lotus Talent</b><small>Signed creator · @{PORTAL.handle}</small></div>
          <span className="pill pill--ok">Contract active</span>
        </header>
        <div className="mc2-portal__kpis">
          <div className="is-hot"><b className="num">{100 - PORTAL.share}%</b><span>Your share of every deal</span><small>MCN share {PORTAL.share}%</small></div>
          <div><b className="num">{vnd(total * (1 - PORTAL.share / 100))}</b><span>Your earnings</span><small>from {PORTAL.deals.length} deals</small></div>
          <div><b>Trang Lê</b><span>Your talent manager</span><small>replies within a day</small></div>
        </div>
        <div className="mc2-portal__cols">
          <section className="wcard">
            <div className="wcard__h"><h3>My deals</h3></div>
            <ul className="mc2-pdeals">
              {PORTAL.deals.map((d) => (
                <li key={d.brand + d.what}>
                  <span className="mc2-pdeals__t"><b>{d.brand}</b><small>{d.what}</small></span>
                  <span data-k="Fee" className="num">{vnd(d.fee)}</span>
                  <span data-k="You keep" className="num mc2-keep">{vnd(d.fee * (1 - PORTAL.share / 100))}</span>
                  <span data-k="Status"><Pill>{d.status}</Pill></span>
                </li>
              ))}
            </ul>
          </section>
          <section className="wcard">
            <div className="wcard__h"><h3>Documents</h3></div>
            <ul className="mc2-docs">
              {PORTAL.docs.map((d) => <li key={d}><span className="wb2-ico"><Icon name="file" size={16} /></span><b>{d}</b><Icon name="download" size={16} /></li>)}
            </ul>
          </section>
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
  const pending = list.filter((r) => r.status === 'Pending').length
  return (
    <>
      <BandHead icon="building" title="Agency Orders" sub="Agencies asking for creators on your roster. Shown only to roles that can open it."
        stats={[{ n: pending, l: 'waiting for you', hot: pending > 0 }, { n: list.filter((r) => r.status === 'Accepted').length, l: 'accepted' }, { n: vnd(list.filter((r) => r.status !== 'Declined').reduce((s, r) => s + r.budget, 0)), l: 'creator fees in play' }]} />
      <div className="mc2-reqs">
        {list.map((r) => (
          <article key={r.id} className={`mc2-req ${r.status === 'Pending' ? 'is-pending' : ''} ${r.status === 'Declined' ? 'is-out' : ''}`}>
            <header>
              <span className="mc2-logo">{r.agency.replace(/\(.*?\)/g, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}</span>
              <div><small>{r.id}</small><h3>{r.agency}</h3><p>for {r.client}</p></div>
              <Pill>{r.status}</Pill>
            </header>
            <dl className="mc2-req__facts"><div><dt>Wants</dt><dd>{r.wants}</dd></div><div><dt>Creator fees</dt><dd className="num">{vnd(r.budget)}</dd></div></dl>
            <div className="mc2-req__cr">{r.creators.map((h) => <Link key={h} href={href(lang, `/@${h}`)} prefetch={false}><span className="av tone-3">{h[0].toUpperCase()}</span>@{h}</Link>)}</div>
            {r.status === 'Pending' ? (
              <footer>
                <button className="btn btn--sm" onClick={() => decide(r.id, 'Accepted')} data-cta="ws_mcn_accept_agency_request">Accept request</button>
                <button className="btn btn--sm btn--ghost" onClick={() => decide(r.id, 'Declined')} data-cta="ws_mcn_decline_agency_request">Decline</button>
                <button className="ulink small" onClick={() => goTab('messages')}>Message the agency</button>
              </footer>
            ) : null}
          </article>
        ))}
      </div>
      {toast}
    </>
  )
}

/* ---------- billing: payout splits ---------- */
export function McnBilling() {
  const [show, setShow] = useState<'all' | 'Paid' | 'Pending'>('all')
  const paid = MCN_SPLITS.filter((s) => s.status === 'Paid')
  const mcnCut = paid.reduce((a, s) => a + (s.fee * s.share) / 100, 0)
  const toCreators = paid.reduce((a, s) => a + s.fee * (1 - s.share / 100), 0)
  const rows = MCN_SPLITS.filter((s) => show === 'all' || (show === 'Paid' ? s.status === 'Paid' : s.status !== 'Paid'))
  const pick = (k: typeof show) => { setShow(k); track('filter_changed', { status: k, source: 'mcn_billing' }) }
  return (
    <>
      <BandHead icon="card" title="Billing" sub="How each deal is split between the creator and the MCN. Sample figures."
        stats={[{ n: vnd(mcnCut), l: 'MCN share received this month', hot: true }, { n: vnd(toCreators), l: 'paid to creators this month' }, { n: MCN_SPLITS.length - paid.length, l: 'splits pending brand approval' }]} />

      <section className="wcard mc2-splitviz">
        <div className="wcard__h"><h3>Where this month’s money went</h3><span className="mc2-muted">{paid.length} paid deals</span></div>
        <div className="mc2-share__bar mc2-share__bar--lg"><i style={{ flex: mcnCut }} /><i style={{ flex: toCreators }} /></div>
        <p className="mc2-legend"><span><i className="is-mcn" />Lotus Talent {vnd(mcnCut)}</span><span><i />Creators {vnd(toCreators)}</span></p>
      </section>

      <div className="wb2-seg" role="group" aria-label="Show">
        {([['all', 'All', MCN_SPLITS.length], ['Paid', 'Paid', paid.length], ['Pending', 'Pending', MCN_SPLITS.length - paid.length]] as const).map(([k, l, n]) => (
          <button key={k} aria-pressed={show === k} onClick={() => pick(k)}>{l}<span>{n}</span></button>
        ))}
      </div>

      <section className="wcard mc2-splits">
        <div className="mc2-splits__h" aria-hidden="true"><span>Split</span><span>Creator</span><span>Deal</span><span>Fee</span><span>Creator gets</span><span>MCN gets</span><span>Status</span></div>
        <ol>
          {rows.map((s) => (
            <li key={s.id}>
              <span className="mc2-splits__id"><b>{s.id}</b><small>{fmtDate(s.date)}</small></span>
              <span data-k="Creator">@{s.creator}</span>
              <span data-k="Deal">{s.deal}</span>
              <span data-k="Fee" className="num">{vnd(s.fee)}</span>
              <span data-k="Creator gets" className="num">{vnd(s.fee * (1 - s.share / 100))}</span>
              <span data-k="MCN gets"><b className="num">{vnd((s.fee * s.share) / 100)}</b> <small>{s.share}%</small></span>
              <span data-k="Status"><Pill>{s.status}</Pill></span>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
