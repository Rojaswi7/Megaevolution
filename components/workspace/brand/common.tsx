'use client'
// Pieces shared by the brand and agency workspaces: toast, creator cell, team, billing, lists, alerts.
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import '@/styles/wsa.css'
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
import { WsHead, Pill } from '../Shell'

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

// ---------- Team, roles, access requests ----------
type Member = { name: string; email: string; role: string; access: string; status: string }
type Request = { name: string; email: string; wants: string; note: string }
const ROLES: Record<string, string> = {
  Admin: 'Everything, including billing and team',
  'Campaign manager': 'Orders, lists, inbox and Agency Orders',
  Finance: 'Billing and invoices only',
  Viewer: 'Read only. No Agency Orders tab',
}

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
  return (
    <>
      <WsHead title="Team and roles" sub={`${org} · ${list.length} people`} />
      <div className="wgrid-main">
        <div className="wcard wcard--flush">
          <div className="wcard__h"><h3>Members</h3><span className="small muted">Roles decide which tabs a person sees</span></div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Person</th><th>Role</th><th>Can open</th><th>Status</th></tr></thead>
              <tbody>
                {list.map((m) => (
                  <tr key={m.email}>
                    <td><b className="wa-b">{m.name}</b><small className="wa-sub">{m.email}</small></td>
                    <td>
                      <label className="sr" htmlFor={`role-${m.email}`}>Role for {m.name}</label>
                      <select id={`role-${m.email}`} className="wa-sel" value={m.role} onChange={(e) => { const role = e.target.value; setList((l) => l.map((x) => (x.email === m.email ? { ...x, role, access: ROLES[role].split('.')[0] } : x))); track('team_role_changed', { role }); show(`${m.name} is now ${role}`) }}>
                        {Object.keys(ROLES).map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="small">{m.access}</td>
                    <td><Pill>{m.status}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="stack">
          <div className="wcard">
            <div className="wcard__h"><h3>Access requests</h3><span className="pill">{reqs.length}</span></div>
            {reqs.length === 0 ? <p className="small muted">No open requests.</p> : reqs.map((r) => (
              <div className="wa-req" key={r.email}>
                <p><b>{r.name}</b> wants <b>{r.wants}</b></p>
                <p className="small muted">{r.note}</p>
                <div className="row">
                  <button className="btn btn--sm" data-cta="team_request_approve" onClick={() => decide(r, true)}>Approve</button>
                  <button className="btn btn--sm btn--ghost" data-cta="team_request_deny" onClick={() => decide(r, false)}>Deny</button>
                </div>
              </div>
            ))}
          </div>
          <form className="wcard stack" onSubmit={invite}>
            <div className="wcard__h" style={{ marginBottom: 0 }}><h3>Invite a teammate</h3></div>
            <label className="field"><span>Work email</span><input className="input" name="email" type="email" required placeholder="name@company.com" /></label>
            <label className="field"><span>Role</span><select className="select" name="role" defaultValue="Campaign manager">{Object.keys(ROLES).map((r) => <option key={r}>{r}</option>)}</select></label>
            <button className="btn btn--sm" data-cta="team_invite_send">Send invite</button>
          </form>
        </div>
      </div>
      <div className="wgrid-2">
        <div className="wcard">
          <div className="wcard__h"><h3>What each role can open</h3></div>
          <dl className="wa-dl">{Object.entries(ROLES).map(([r, t]) => <div key={r}><dt>{r}</dt><dd>{t}</dd></div>)}</dl>
        </div>
        <div className="wcard">
          <div className="wcard__h"><h3>Sign-in</h3></div>
          <div className="wrow">
            <div className="wrow__t"><b>Email login codes</b><small>Sign in with a 6-digit code sent by email, no password.</small></div>
            <button className="wtoggle" role="switch" aria-checked={codes} aria-label="Email login codes" data-cta="team_email_codes_toggle" onClick={() => { setCodes(!codes); track('setting_changed', { setting: 'email_login_codes', on: !codes }) }} />
          </div>
          <p className="wnote" style={{ marginTop: 10 }}><Icon name="shield" size={16} />{codes ? 'On: members get a one-time code at each new sign-in.' : 'Off: members sign in with a password.'}</p>
        </div>
      </div>
      {toast}
    </>
  )
}

// ---------- Billing portal ----------
type Invoice = { id: string; date: string; what: string; brand?: string; client?: string; order?: string; amountUsd: number; tbd: boolean; status: string }

export function BillingScreen({ invoices, who }: { invoices: Invoice[]; who: 'brand' | 'agency' }) {
  const [plan, setPlan] = useState<string | null>(who === 'brand' ? 'plus' : null)
  const [confirm, setConfirm] = useState<null | 'cancel' | string>(null)
  const [split, setSplit] = useState(true)
  const [toast, show] = useToast()
  const current = STUDIO_SUBSCRIPTIONS.find((s) => s.id === plan)
  const change = (id: string | null) => {
    track('plan_changed', { from: plan || 'none', to: id || 'cancelled', product: 'studio_subscription' })
    setPlan(id); setConfirm(null); show(id ? `Plan changed to ${STUDIO_SUBSCRIPTIONS.find((s) => s.id === id)!.name}` : 'Subscription cancelled. It stays active until the end of the period.')
  }
  return (
    <>
      <WsHead title="Billing portal" sub="Change or cancel your plan yourself. Every payment has a receipt." />
      <div className="wgrid-2">
        <div className="wcard wcard--dark wa-plan">
          <p className="wa-k">Video Editing Studio subscription</p>
          {current ? (
            <>
              <p className="wa-plan__name">{current.name}</p>
              <p className="muted"><Money usd={current.monthly} per="/mo" /> · renews 1 December 2026</p>
            </>
          ) : (
            <><p className="wa-plan__name">No subscription</p><p className="muted">You pay per order. Plus and Max lower the price of every video.</p></>
          )}
          <div className="row" style={{ marginTop: 14 }}>
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
        </div>
        <div className="stack">
          <div className="wcard">
            <div className="wcard__h"><h3>Payment method</h3><button className="ulink small" data-cta="billing_update_card" onClick={() => show('Card form opens here (mock).')}>Update</button></div>
            <div className="wrow"><span className="wa-cardico"><Icon name="card" size={18} /></span><div className="wrow__t"><b>Visa ending 4242</b><small>Expires 08 / 2028 · sample card</small></div><Pill>Active</Pill></div>
          </div>
          <div className="wcard">
            <div className="wrow">
              <div className="wrow__t"><b>Per-brand invoices on shared orders</b><small>{who === 'agency' ? 'Each client brand gets its own invoice for its share.' : 'When an order is shared across brands, each brand is invoiced separately.'}</small></div>
              <button className="wtoggle" role="switch" aria-checked={split} aria-label="Per-brand invoices" data-cta="billing_per_brand_toggle" onClick={() => { setSplit(!split); track('setting_changed', { setting: 'per_brand_invoices', on: !split }) }} />
            </div>
          </div>
        </div>
      </div>
      <div className="wcard wcard--flush">
        <div className="wcard__h"><h3>Invoices and receipts</h3><span className="small muted">Refunds appear as their own line</span></div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Invoice</th><th>Date</th><th>For</th>{split ? <th>{who === 'agency' ? 'Client' : 'Brand'}</th> : null}<th>Amount</th><th>Status</th><th><span className="sr">Receipt</span></th></tr></thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id}>
                  <td className="tnum wa-b">{i.id}</td><td className="tnum small">{i.date}</td><td>{i.what}</td>
                  {split ? <td className="small">{i.client || i.brand}</td> : null}
                  <td className="tnum"><Money usd={i.tbd ? 'TBD' : i.amountUsd} /></td>
                  <td><Pill>{i.status}</Pill></td>
                  <td><button className="wa-icobtn" aria-label={`Download receipt ${i.id}`} data-cta="billing_receipt_download" onClick={() => { track('receipt_downloaded', { invoice: i.id }); show(`Receipt ${i.id} downloaded (mock)`) }}><Icon name="download" size={16} /></button></td>
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

// ---------- Lists ----------
export function ListsScreen({ lang }: { lang: string }) {
  const { saved, toggleSaved } = useApp()
  const lists = [...(saved.length ? [{ name: 'Saved from search', creators: saved, updated: 'Just now', mine: true }] : []), ...LISTS.map((l) => ({ ...l, mine: false }))]
  return (
    <>
      <WsHead title="Lists" sub="Creators you saved, grouped by campaign.">
        <Link className="btn btn--sm" href={href(lang, '/creators')} data-cta="lists_search_creators" prefetch={false}>Search creators<Arrow size={14} /></Link>
      </WsHead>
      {!saved.length ? <p className="wnote"><Icon name="bookmark" size={16} />Tap the bookmark on any creator card and it lands here in “Saved from search”.</p> : null}
      <div className="wgrid-2">
        {lists.map((l) => (
          <div className="wcard" key={l.name}>
            <div className="wcard__h"><h3>{l.name}</h3><span className="small muted">{l.creators.length} creators · {l.updated}</span></div>
            {l.creators.map((h) => (
              <div className="wrow" key={h}>
                <CreatorCell handle={h} lang={lang} />
                <span className="wa-push small tnum">{creatorByHandle[h] ? <>from <Money usd={creatorByHandle[h].rateUsd} /></> : null}</span>
                {l.mine ? <button className="wa-icobtn" aria-label={`Remove @${h}`} onClick={() => toggleSaved(h)}><Icon name="close" size={15} /></button> : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

// ---------- Alerts ----------
export function AlertsScreen({ items }: { items: { text: string; when: string; to: string }[] }) {
  return (
    <>
      <WsHead title="Alerts" sub="Things that changed since you last looked." />
      <div className="wcard">
        {items.map((n) => (
          <div className="wrow" key={n.text}>
            <span className="wa-dot" />
            <div className="wrow__t"><b>{n.text}</b><small>{n.when}</small></div>
            <button className="btn btn--sm btn--ghost" data-cta="alert_open" onClick={() => goTab(n.to)}>Open</button>
          </div>
        ))}
      </div>
    </>
  )
}
