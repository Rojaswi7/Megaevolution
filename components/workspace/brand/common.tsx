'use client'
// Pieces shared by the brand and agency workspaces: toast, creator cell, team, billing, lists, alerts.
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import '@/styles/wsa.css'
import '@/styles/brand-org.css'
import { href } from '@/data/site'
import { creatorByHandle } from '@/data/creators'
import { marketById } from '@/data/markets'
import { categoryBySlug } from '@/data/categories'
import { STUDIO_SUBSCRIPTIONS } from '@/data/pricing'
import { LISTS } from '@/data/workspace'
import { compact } from '@/lib/format'
import { track } from '@/lib/track'
import { Flag, Icon, Arrow } from '../../Icon'
import { Money } from '../../Money'
import { useApp } from '../../AppState'
import { Pill } from '../Shell'

/** Small confirmation message at the bottom of the screen. */
export function useToast(): [React.ReactNode, (msg: string) => void] {
  const [msg, setMsg] = useState('')
  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(''), 2600); return () => clearTimeout(t) }, [msg])
  const show = useCallback((m: string) => setMsg(m), [])
  return [msg ? <div className="wtoast" role="status" key={msg}>{msg}</div> : null, show]
}

export const goTab = (id: string) => window.dispatchEvent(new CustomEvent('ws:tab', { detail: id }))

/** Creator by handle, safe when the handle is not in the sample set. */
export function CreatorCell({ handle, lang, sub }: { handle: string; lang: string; sub?: string }) {
  const c = creatorByHandle[handle]
  const m = c ? marketById[c.market] : null
  return (
    <span className="wa-cr">
      <span className={`av tone-${c ? (c.tone + 5) % 8 : 2}`}>{(c?.name || handle)[0].toUpperCase()}</span>
      <span className="wa-cr__t">
        {c ? <Link href={href(lang, `/@${handle}`)} prefetch={false} data-cta="ws_open_creator">@{handle}</Link> : <span>@{handle}</span>}
        <small>{sub || (c && m ? <><Flag market={c.market} /> {m.short} · {categoryBySlug[c.category].label} · {compact(c.followers)}</> : 'Sample creator')}</small>
      </span>
    </span>
  )
}

export const Market = ({ id }: { id: string }) => <span className="wa-mk"><Flag market={id} />{marketById[id]?.short || id.toUpperCase()}</span>

/** Compact navy band at the top of an organisation screen: title, a few numbers, actions. */
function OrgHead({ icon, title, sub, stats, children }: { icon: string; title: string; sub: string; stats?: { n: React.ReactNode; l: string; hot?: boolean }[]; children?: React.ReactNode }) {
  return (
    <header className="bo-head">
      <div className="bo-head__t">
        <span className="bo-head__ico"><Icon name={icon} size={20} /></span>
        <div><h2>{title}</h2><p>{sub}</p></div>
      </div>
      {stats?.length ? (
        <dl className="bo-head__stats">
          {stats.map((s) => <div key={s.l} className={s.hot ? 'is-hot' : ''}><dd className="num">{s.n}</dd><dt>{s.l}</dt></div>)}
        </dl>
      ) : null}
      {children ? <div className="bo-head__act">{children}</div> : null}
    </header>
  )
}

const initials = (name: string) => name.split(/[\s.@]+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('')

// ---------- Team, roles, access requests ----------
type Member = { name: string; email: string; role: string; access: string; status: string }
type Request = { name: string; email: string; wants: string; note: string }
const ROLES: Record<string, string> = {
  Admin: 'Everything, including billing and team',
  'Campaign manager': 'Orders, lists, inbox and Agency Orders',
  Finance: 'Billing and invoices only',
  Viewer: 'Read only. No Agency Orders tab',
}
const ROLE_ICON: Record<string, string> = { Admin: 'shield', 'Campaign manager': 'list', Finance: 'card', Viewer: 'eye' }

export function TeamScreen({ org, members, requests }: { org: string; members: Member[]; requests: Request[] }) {
  const [list, setList] = useState(members)
  const [reqs, setReqs] = useState(requests)
  const [codes, setCodes] = useState(true)
  const [toast, show] = useToast()
  const invite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const email = String(f.get('email')); const role = String(f.get('role'))
    setList((l) => [...l, { name: email.split('@')[0], email, role, access: ROLES[role].split('.')[0], status: 'Invited' }])
    track('form_submitted', { form: 'team_invite', role }); show(`Invite sent to ${email}`); e.currentTarget.reset()
  }
  const decide = (r: Request, ok: boolean) => {
    setReqs((x) => x.filter((y) => y.email !== r.email))
    if (ok) setList((l) => [...l, { name: r.name, email: r.email, role: 'Campaign manager', access: r.wants, status: 'Active' }])
    track(ok ? 'access_request_approved' : 'access_request_denied', { wants: r.wants }); show(ok ? `${r.name} now has access to ${r.wants}` : `Request from ${r.name} denied`)
  }
  const setRole = (m: Member, role: string) => {
    setList((l) => l.map((x) => (x.email === m.email ? { ...x, role, access: ROLES[role] ? ROLES[role].split('.')[0] : x.access } : x)))
    track('team_role_changed', { role }); show(`${m.name} is now ${role}`)
  }
  const active = list.filter((m) => m.status === 'Active').length

  return (
    <>
      <OrgHead icon="users" title="Team and roles" sub={`${org} · roles decide which tabs a person sees`}
        stats={[{ n: list.length, l: 'people' }, { n: active, l: 'active' }, { n: list.length - active, l: 'invited' }, { n: reqs.length, l: 'requests', hot: reqs.length > 0 }]} />

      {reqs.length ? (
        <div className="bo-reqs">
          {reqs.map((r) => (
            <article className="bo-req" key={r.email}>
              <span className="bo-av">{initials(r.name)}</span>
              <div>
                <p className="bo-req__k">Access request</p>
                <p><b>{r.name}</b> wants <b>{r.wants}</b></p>
                <small>“{r.note}”</small>
              </div>
              <div className="bo-req__act">
                <button className="btn btn--sm bo-btn-navy" data-cta="team_request_approve" onClick={() => decide(r, true)}><Icon name="check" size={14} />Approve</button>
                <button className="btn btn--sm btn--ghost" data-cta="team_request_deny" onClick={() => decide(r, false)}>Deny</button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <div className="bo-split">
        <section className="wcard bo-members">
          <div className="wcard__h"><h3>Members</h3><span className="bo-count">{list.length}</span></div>
          <ul>
            {list.map((m, i) => (
              <li key={m.email}>
                <span className={`bo-av tone-${(i + 2) % 8}`}>{initials(m.name)}</span>
                <div className="bo-members__who"><b>{m.name}</b><small>{m.email}</small></div>
                <div className="bo-members__role">
                  <label className="sr" htmlFor={`role-${m.email}`}>Role for {m.name}</label>
                  <select id={`role-${m.email}`} className="wa-sel" value={m.role} onChange={(e) => setRole(m, e.target.value)}>
                    {!ROLES[m.role] ? <option>{m.role}</option> : null}
                    {Object.keys(ROLES).map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <small>{m.access}</small>
                </div>
                <Pill>{m.status}</Pill>
              </li>
            ))}
          </ul>
        </section>

        <div className="bo-col">
          <form className="wcard bo-invite" onSubmit={invite}>
            <div className="wcard__h"><h3>Invite a teammate</h3><Icon name="mail" size={18} /></div>
            <label className="field"><span>Work email</span><input className="input" name="email" type="email" required placeholder="name@company.com" /></label>
            <label className="field"><span>Role</span><select className="select" name="role" defaultValue="Campaign manager">{Object.keys(ROLES).map((r) => <option key={r}>{r}</option>)}</select></label>
            <button className="btn btn--sm" data-cta="team_invite_send">Send invite<Arrow size={14} /></button>
          </form>
          <section className="wcard bo-signin">
            <div className="bo-signin__row">
              <span className="bo-chip"><Icon name="shield" size={17} /></span>
              <div><b>Email login codes</b><small>A 6-digit code by email at each new sign-in, no password.</small></div>
              <button className="wtoggle" role="switch" aria-checked={codes} aria-label="Email login codes" data-cta="team_email_codes_toggle" onClick={() => { setCodes(!codes); track('setting_changed', { setting: 'email_login_codes', on: !codes }) }} />
            </div>
            <p className={`bo-state ${codes ? 'is-on' : ''}`}><i />{codes ? 'On for everyone in this workspace' : 'Off: members sign in with a password'}</p>
          </section>
        </div>
      </div>

      <section className="wcard">
        <div className="wcard__h"><h3>What each role can open</h3></div>
        <div className="bo-roles">
          {Object.entries(ROLES).map(([r, t]) => {
            const n = list.filter((m) => m.role === r).length
            return (
              <div key={r}>
                <span className="bo-chip"><Icon name={ROLE_ICON[r]} size={16} /></span>
                <b>{r}</b>
                <p>{t}</p>
                <small>{n} {n === 1 ? 'person' : 'people'}</small>
              </div>
            )
          })}
        </div>
      </section>
      {toast}
    </>
  )
}

// ---------- Billing portal ----------
type Invoice = { id: string; date: string; what: string; brand?: string; client?: string; order?: string; amountUsd: number; tbd: boolean; status: string }
const kindOf = (what: string) => (/studio|video/i.test(what) ? 'Video Editing Studio' : /subscription/i.test(what) ? 'Subscription' : /management/i.test(what) ? 'Management fees' : 'Creator fees')
const KIND_ICON: Record<string, string> = { 'Video Editing Studio': 'film', Subscription: 'refresh', 'Management fees': 'building', 'Creator fees': 'users' }

export function BillingScreen({ invoices, who }: { invoices: Invoice[]; who: 'brand' | 'agency' }) {
  const [plan, setPlan] = useState<string | null>(who === 'brand' ? 'plus' : null)
  const [confirm, setConfirm] = useState<null | 'cancel' | string>(null)
  const [split, setSplit] = useState(true)
  const [status, setStatus] = useState('')
  const [toast, show] = useToast()
  const current = STUDIO_SUBSCRIPTIONS.find((s) => s.id === plan)
  const change = (id: string | null) => {
    track('plan_changed', { from: plan || 'none', to: id || 'cancelled', product: 'studio_subscription' })
    setPlan(id); setConfirm(null); show(id ? `Plan changed to ${STUDIO_SUBSCRIPTIONS.find((s) => s.id === id)!.name}` : 'Subscription cancelled. It stays active until the end of the period.')
  }
  const paid = invoices.filter((i) => i.status === 'Paid' && !i.tbd).reduce((s, i) => s + i.amountUsd, 0)
  const statuses = Array.from(new Set(invoices.map((i) => i.status)))
  const shown = invoices.filter((i) => !status || i.status === status)
  const kinds = Array.from(new Set(invoices.map((i) => kindOf(i.what)))).map((k) => {
    const rows = invoices.filter((i) => kindOf(i.what) === k)
    return { k, n: rows.length, usd: rows.filter((i) => !i.tbd && i.status !== 'Refunded').reduce((s, i) => s + i.amountUsd, 0), tbd: rows.some((i) => i.tbd) }
  })
  const maxN = Math.max(...kinds.map((k) => k.n), 1)

  return (
    <>
      <OrgHead icon="card" title="Billing" sub="Change or cancel your plan yourself. Every payment has a receipt."
        stats={[{ n: <Money usd={paid} />, l: 'paid, priced lines' }, { n: invoices.length, l: 'invoices' }, { n: current ? '1 Dec' : '—', l: 'next renewal' }]} />

      <div className="bo-bill">
        <section className="bo-plan">
          <div className="bo-plan__top">
            <p className="wa-k">Video Editing Studio subscription</p>
            {current ? <span className="bo-plan__badge">Active</span> : null}
          </div>
          <p className="bo-plan__name">{current ? current.name : 'No plan'}</p>
          <p className="bo-plan__meta">{current ? <><Money usd={current.monthly} per="/mo" /> · renews 1 December 2026</> : 'You pay per order. Plus and Max lower the price of every video.'}</p>
          {current ? <p className="bo-plan__blurb"><Icon name="check" size={14} />{current.blurb}</p> : null}
          <div className="bo-plan__act">
            {STUDIO_SUBSCRIPTIONS.filter((s) => s.id !== plan).map((s) => (
              <button key={s.id} className="btn btn--sm" data-cta={`billing_switch_${s.id}`} onClick={() => setConfirm(s.id)}>{plan ? 'Switch to' : 'Start'} {s.name}</button>
            ))}
            {plan ? <button className="btn btn--sm btn--ghost" data-cta="billing_cancel" onClick={() => setConfirm('cancel')}>Cancel plan</button> : null}
          </div>
          {confirm ? (
            <div className="wa-confirm" role="alertdialog" aria-label="Confirm plan change">
              {confirm === 'cancel'
                ? <p>Cancel {current?.name}? You keep it until 30 November, then orders go back to the standard price.</p>
                : <p>Switch to {STUDIO_SUBSCRIPTIONS.find((s) => s.id === confirm)!.name} at <Money usd={STUDIO_SUBSCRIPTIONS.find((s) => s.id === confirm)!.monthly} per="/mo" />? The change applies from the next billing date.</p>}
              <div className="row">
                <button className="btn btn--sm btn--white" data-cta="billing_confirm" onClick={() => change(confirm === 'cancel' ? null : confirm)}>Confirm</button>
                <button className="btn btn--sm btn--ghost" onClick={() => setConfirm(null)}>Keep current</button>
              </div>
            </div>
          ) : null}
        </section>

        <section className="wcard bo-pay">
          <div className="wcard__h"><h3>Payment method</h3><button className="ulink small" data-cta="billing_update_card" onClick={() => show('Card form opens here (mock).')}>Update</button></div>
          <div className="bo-cc" aria-label="Visa ending 4242, sample card">
            <span className="bo-cc__chip" />
            <span className="bo-cc__no">•••• •••• •••• 4242</span>
            <span className="bo-cc__row"><small>Expires 08 / 2028</small><b>VISA</b></span>
          </div>
          <p className="bo-state is-on"><i />Active · sample card</p>
        </section>

        <section className="wcard bo-use">
          <div className="wcard__h"><h3>Where it went</h3><span className="small muted">{invoices.length} invoices</span></div>
          <ul>
            {kinds.map((k) => (
              <li key={k.k}>
                <span className="bo-chip"><Icon name={KIND_ICON[k.k]} size={15} /></span>
                <div>
                  <p><b>{k.k}</b><span>{k.usd ? <Money usd={k.usd} /> : null}{k.tbd ? <em>price TBD</em> : null}</span></p>
                  <span className="bo-bar"><i style={{ width: `${(k.n / maxN) * 100}%` }} /></span>
                  <small>{k.n} invoice{k.n === 1 ? '' : 's'}</small>
                </div>
              </li>
            ))}
          </ul>
          <div className="bo-signin__row bo-use__split">
            <div><b>Per-brand invoices on shared orders</b><small>{who === 'agency' ? 'Each client brand gets its own invoice for its share.' : 'When an order is shared across brands, each brand is invoiced separately.'}</small></div>
            <button className="wtoggle" role="switch" aria-checked={split} aria-label="Per-brand invoices" data-cta="billing_per_brand_toggle" onClick={() => { setSplit(!split); track('setting_changed', { setting: 'per_brand_invoices', on: !split }) }} />
          </div>
        </section>
      </div>

      <section className="wcard wcard--flush bo-inv">
        <div className="wcard__h">
          <h3>Invoices and receipts</h3>
          <div className="bo-filter" role="group" aria-label="Invoice status">
            {['', ...statuses].map((s) => <button key={s || 'all'} aria-pressed={status === s} onClick={() => { setStatus(s); track('filter_changed', { status: s || 'all', source: 'billing_invoices' }) }}>{s || 'All'}</button>)}
          </div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Invoice</th><th>Date</th><th>For</th>{split ? <th>{who === 'agency' ? 'Client' : 'Brand'}</th> : null}<th>Amount</th><th>Status</th><th><span className="sr">Receipt</span></th></tr></thead>
            <tbody>
              {shown.map((i) => (
                <tr key={i.id}>
                  <td className="bo-td-id"><span className="bo-inv__id"><span className="bo-chip"><Icon name={KIND_ICON[kindOf(i.what)]} size={14} /></span>{i.id}</span></td>
                  <td className="tnum small bo-td-date">{i.date}</td><td className="small bo-td-for">{i.what}</td>
                  {split ? <td className="small bo-td-who">{i.client || i.brand}</td> : null}
                  <td className="tnum bo-inv__amt bo-td-amt"><Money usd={i.tbd ? 'TBD' : i.amountUsd} /></td>
                  <td className="bo-td-st"><Pill>{i.status}</Pill></td>
                  <td className="bo-td-dl"><button className="wa-icobtn" aria-label={`Download receipt ${i.id}`} data-cta="billing_receipt_download" onClick={() => { track('receipt_downloaded', { invoice: i.id }); show(`Receipt ${i.id} downloaded (mock)`) }}><Icon name="download" size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="bo-inv__foot">Refunds appear as their own line.</p>
      </section>
      {toast}
    </>
  )
}

// ---------- Lists ----------
export function ListsScreen({ lang }: { lang: string }) {
  const { saved, toggleSaved } = useApp()
  const lists = [...(saved.length ? [{ name: 'Saved from search', creators: saved, updated: 'Just now', mine: true }] : []), ...LISTS.map((l) => ({ ...l, mine: false }))]
  const [pick, setPick] = useState(0)
  const sel = lists[Math.min(pick, lists.length - 1)]
  const all = Array.from(new Set(lists.flatMap((l) => l.creators)))
  const marketsOf = (hs: string[]) => Array.from(new Set(hs.map((h) => creatorByHandle[h]?.market).filter(Boolean))) as string[]
  const from = sel.creators.reduce((s, h) => s + (creatorByHandle[h]?.rateUsd || 0), 0)
  const open = (i: number) => { setPick(i); track('cta_click', { cta: 'lists_open_list', list: lists[i].name }) }

  return (
    <>
      <OrgHead icon="bookmark" title="Lists" sub="Creators you saved, grouped by campaign."
        stats={[{ n: lists.length, l: 'lists' }, { n: all.length, l: 'creators' }, { n: marketsOf(all).length, l: 'markets' }]}>
        <Link className="btn btn--sm" href={href(lang, '/creators')} data-cta="lists_search_creators" prefetch={false}>Search creators<Arrow size={14} /></Link>
      </OrgHead>
      {!saved.length ? <p className="bo-hint"><span className="bo-chip"><Icon name="bookmark" size={15} /></span>Tap the bookmark on any creator card and it lands here in “Saved from search”.</p> : null}

      <div className="bo-lists">
        <div className="bo-lists__nav" role="list">
          {lists.map((l, i) => (
            <button key={l.name} role="listitem" className={`bo-list ${l === sel ? 'is-on' : ''}`} aria-pressed={l === sel} onClick={() => open(i)}>
              <span className="bo-list__top"><b>{l.name}</b>{l.mine ? <em>Yours</em> : null}</span>
              <span className="bo-stack">
                {l.creators.slice(0, 5).map((h) => { const c = creatorByHandle[h]; return <span key={h} className={`av tone-${c ? (c.tone + 5) % 8 : 2}`}>{(c?.name || h)[0].toUpperCase()}</span> })}
                {l.creators.length > 5 ? <span className="av bo-stack__more">+{l.creators.length - 5}</span> : null}
              </span>
              <span className="bo-list__meta"><span>{l.creators.length} creators · {l.updated}</span><span className="bo-list__flags">{marketsOf(l.creators).map((m) => <Flag key={m} market={m} />)}</span></span>
            </button>
          ))}
        </div>

        <section className="wcard bo-listview" aria-live="polite">
          <header className="bo-listview__h">
            <div><h3>{sel.name}</h3><small>{sel.creators.length} creators · updated {sel.updated.toLowerCase()}</small></div>
            {from ? <p className="bo-listview__sum"><span>Starting rates add up to</span><b className="num"><Money usd={from} /></b></p> : null}
          </header>
          <ul>
            {sel.creators.map((h) => (
              <li key={h}>
                <CreatorCell handle={h} lang={lang} />
                <span className="bo-listview__rate">{creatorByHandle[h] ? <><small>from</small><Money usd={creatorByHandle[h].rateUsd} /></> : null}</span>
                {creatorByHandle[h] ? <Link className="bo-listview__open" href={href(lang, `/@${h}`)} prefetch={false} data-cta="lists_open_profile">Profile<Arrow size={13} /></Link> : null}
                {sel.mine ? <button className="wa-icobtn" aria-label={`Remove @${h}`} onClick={() => toggleSaved(h)}><Icon name="close" size={15} /></button> : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

// ---------- Alerts ----------
const ALERT_KIND: Record<string, { icon: string; label: string }> = {
  orders: { icon: 'film', label: 'Orders' }, team: { icon: 'users', label: 'Team' }, messages: { icon: 'message', label: 'Messages' },
  'agency-orders': { icon: 'list', label: 'Agency Orders' }, reports: { icon: 'chart', label: 'Reports' },
}
const kindOfAlert = (to: string) => ALERT_KIND[to] || { icon: 'bell', label: 'Other' }

export function AlertsScreen({ items }: { items: { text: string; when: string; to: string }[] }) {
  const [read, setRead] = useState<string[]>([])
  const [filter, setFilter] = useState('')
  const unread = items.filter((n) => !read.includes(n.text)).length
  const kinds = Array.from(new Set(items.map((n) => n.to)))
  const shown = items.filter((n) => (filter === 'unread' ? !read.includes(n.text) : !filter || n.to === filter))
  const isToday = (w: string) => /min|\bh\b|hour|now/i.test(w)
  const groups = [{ g: 'Today', rows: shown.filter((n) => isToday(n.when)) }, { g: 'Earlier', rows: shown.filter((n) => !isToday(n.when)) }].filter((x) => x.rows.length)
  const pickFilter = (f: string) => { setFilter(f); track('filter_changed', { filter: f || 'all', source: 'alerts' }) }
  const markAll = () => { setRead(items.map((n) => n.text)); track('cta_click', { cta: 'alerts_mark_all_read' }) }
  const open = (n: { text: string; to: string }) => { setRead((r) => (r.includes(n.text) ? r : [...r, n.text])); goTab(n.to) }

  return (
    <>
      <OrgHead icon="bell" title="Alerts" sub="Things that changed since you last looked."
        stats={[{ n: unread, l: 'unread', hot: unread > 0 }, { n: items.length, l: 'in total' }]}>
        <button className="btn btn--sm" data-cta="alerts_mark_all_read" onClick={markAll} disabled={!unread}><Icon name="check" size={14} />Mark all read</button>
      </OrgHead>

      <section className="wcard bo-alerts">
        <div className="bo-filter" role="group" aria-label="Show">
          <button aria-pressed={!filter} onClick={() => pickFilter('')}>All<span>{items.length}</span></button>
          <button aria-pressed={filter === 'unread'} onClick={() => pickFilter('unread')}>Unread<span>{unread}</span></button>
          {kinds.map((k) => <button key={k} aria-pressed={filter === k} onClick={() => pickFilter(k)}>{kindOfAlert(k).label}</button>)}
        </div>
        {groups.length === 0 ? (
          <p className="bo-empty"><span className="bo-chip"><Icon name="check" size={16} /></span>All caught up.</p>
        ) : groups.map((grp) => (
          <div key={grp.g} className="bo-alerts__grp">
            <p className="bo-alerts__g">{grp.g}</p>
            <ul>
              {grp.rows.map((n) => {
                const k = kindOfAlert(n.to); const isNew = !read.includes(n.text)
                return (
                  <li key={n.text} className={isNew ? 'is-new' : ''}>
                    <span className="bo-chip"><Icon name={k.icon} size={16} /></span>
                    <div><b>{n.text}</b><small><em>{k.label}</em>{n.when}</small></div>
                    {isNew ? <span className="bo-dot" aria-label="Unread" /> : null}
                    <button className="btn btn--sm btn--ghost" data-cta="alert_open" onClick={() => open(n)}>Open<Arrow size={13} /></button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </section>
    </>
  )
}
