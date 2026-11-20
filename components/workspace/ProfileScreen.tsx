'use client'
// Every workspace user's own profile and settings: personal details, organisation (brand,
// agency, MCN only), sign-in and security, notifications, preferences and the danger zone.
// Mockup only: nothing is saved anywhere.
import { useEffect, useState } from 'react'
import '@/styles/brand-profile.css'
import { LOCALES, LOCALE_NAMES } from '@/data/site'
import { CURRENCIES, type Currency } from '@/data/pricing'
import { MARKETS } from '@/data/markets'
import { CATEGORIES } from '@/data/categories'
import { accountByRole, type Role } from '@/data/accounts'
import { useApp } from '../AppState'
import { Icon, Flag } from '../Icon'
import { track } from '@/lib/track'

type R = Exclude<Role, 'guest'>
const ORG: Partial<Record<R, { label: string; sub: string; markets: string; site: string }>> = {
  brand: { label: 'Company', sub: 'Shown on your orders and to creators you work with.', markets: 'Markets you sell in', site: 'lumiskin.example' },
  agency: { label: 'Organisation', sub: 'The team brands and creators see when you run their campaigns.', markets: 'Markets you run campaigns in', site: 'megaevolution.io' },
  mcn: { label: 'MCN', sub: 'Shown on your MCN page and on deals with brands.', markets: 'Markets your creators are in', site: 'lotustalent.example' },
}
const NEWS = { id: 'news', t: 'Product news', d: 'New features, at most once a month.' }
const NOTIFY_BY: Record<R, { id: string; t: string; d: string }[]> = {
  brand: [
    { id: 'orders', t: 'Order updates', d: 'A creator accepts, posts or asks for something.' },
    { id: 'drafts', t: 'Drafts ready to review', d: 'Studio videos and creator drafts.' },
    { id: 'messages', t: 'New messages', d: 'Replies in Campaign Inbox.' },
    { id: 'team', t: 'Team access requests', d: 'Someone asks to join or for more access.' },
    NEWS,
  ],
  agency: [
    { id: 'approvals', t: 'Client approvals', d: 'A brand approves or declines a listed creator.' },
    { id: 'replies', t: 'Creator replies', d: 'New messages in Campaign Inbox.' },
    { id: 'team', t: 'Team access requests', d: 'Someone asks to join or for more access.' },
    NEWS,
  ],
  creator: [
    { id: 'orders', t: 'New order requests', d: 'A brand wants to book one of your packages.' },
    { id: 'revisions', t: 'Revision requests', d: 'A brand asks for changes to a script or draft.' },
    { id: 'payouts', t: 'Payouts', d: 'Money is on its way to your account.' },
    { id: 'messages', t: 'New messages', d: 'Brands and your MCN.' },
    NEWS,
  ],
  mcn: [
    { id: 'deals', t: 'Deal requests', d: 'A brand asks for one of your creators.' },
    { id: 'contracts', t: 'Contracts', d: 'Signed, expiring or waiting for a signature.' },
    { id: 'messages', t: 'New messages', d: 'Brands and your creators.' },
    NEWS,
  ],
  editor: [
    { id: 'jobs', t: 'New jobs in the queue', d: 'Videos ready for an editor to pick up.' },
    { id: 'revisions', t: 'Revision requests', d: 'A brand asks for changes to your draft.' },
    { id: 'messages', t: 'New messages', d: 'From the Studio team.' },
    NEWS,
  ],
}

const SECTIONS = [
  { id: 'pf-personal', label: 'Personal details', icon: 'user' },
  { id: 'pf-company', label: 'Company', icon: 'building' },
  { id: 'pf-security', label: 'Sign-in and security', icon: 'shield' },
  { id: 'pf-notify', label: 'Notifications', icon: 'bell' },
  { id: 'pf-prefs', label: 'Preferences', icon: 'settings' },
  { id: 'pf-danger', label: 'Leave or delete', icon: 'lock' },
]
const ZONES = ['Asia/Seoul (GMT+9)', 'Asia/Ho_Chi_Minh (GMT+7)', 'Asia/Tokyo (GMT+9)', 'America/New_York (GMT−5)', 'Europe/London (GMT+0)']
const SIZES = ['Just me', '2–10', '11–50', '51–200', '200+']

const startFor = (role: R) => {
  const a = accountByRole[role]
  return {
    name: a.name, title: a.title, phone: '+82 10-0000-0000', brand: a.org, site: ORG[role]?.site || '',
    industry: 'beauty', size: '11–50', markets: ['kr', 'vn', 'ph'], zone: role === 'creator' || role === 'mcn' ? ZONES[1] : ZONES[0],
  }
}
type Form = ReturnType<typeof startFor>

export default function ProfileScreen({ role }: { role: R }) {
  const acct = accountByRole[role]
  const org = ORG[role]
  const NOTIFY = NOTIFY_BY[role]
  const START = startFor(role)
  const sections = SECTIONS.filter((x) => x.id !== 'pf-company' || org).map((x) => (x.id === 'pf-company' && org ? { ...x, label: org.label } : x))
  const { currency, setCurrency } = useApp()
  const [f, setF] = useState(START)
  const [saved, setSaved] = useState(START)
  const [photo, setPhoto] = useState('')
  const [twoStep, setTwoStep] = useState(true)
  const [google, setGoogle] = useState(false)
  const [pw, setPw] = useState(false)
  const [notify, setNotify] = useState<Record<string, { email: boolean; app: boolean }>>(Object.fromEntries(NOTIFY.map((n) => [n.id, { email: n.id !== 'news', app: true }])))
  const [sessions, setSessions] = useState([{ id: 's1', d: 'Chrome on Windows', w: 'Seoul · this device', now: true }, { id: 's2', d: 'Safari on iPhone', w: 'Seoul · 2 days ago', now: false }])
  const [del, setDel] = useState('')
  const [toast, setToast] = useState('')
  const dirty = JSON.stringify(f) !== JSON.stringify(saved)

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t) }, [toast])
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }))
  const toggleMarket = (id: string) => set('markets', f.markets.includes(id) ? f.markets.filter((m) => m !== id) : [...f.markets, id])
  const say = (msg: string, ev: string, props: Record<string, string | boolean> = {}) => { setToast(msg); track(ev, props) }
  const save = () => { setSaved(f); say('Profile saved.', 'profile_saved', { fields: Object.keys(f).filter((k) => JSON.stringify(f[k as keyof typeof f]) !== JSON.stringify(saved[k as keyof typeof saved])).join(',') }) }
  const checks = [f.name, f.title, f.phone, photo, twoStep ? 't' : '', ...(org ? [f.site, f.markets.length ? 'm' : ''] : [])]
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100)
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="pf">
      <section className="pf-hero">
        <div className="pf-hero__av">
          {photo ? <img src={photo} alt="" /> : <span className={`av tone-${acct.tone}`}>{f.name[0] || acct.initial}</span>}
          <label className="pf-hero__cam" title="Change photo">
            <Icon name="upload" size={15} />
            <input type="file" accept="image/*" className="sr" aria-label="Change profile photo" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setPhoto(URL.createObjectURL(file)); say('Photo updated.', 'profile_photo_changed') } }} />
          </label>
        </div>
        <div className="pf-hero__who">
          <h2>{f.name || 'Your name'}</h2>
          <p>{f.title} · {f.brand}</p>
          <p className="pf-hero__mail"><Icon name="mail" size={14} />{acct.email}<span className="pf-ok"><Icon name="check" size={12} stroke={2.4} />Verified</span></p>
        </div>
        <div className="pf-hero__done">
          <div className="pf-ring" style={{ ['--p' as string]: pct }}><b className="num">{pct}%</b></div>
          <div><b>Profile complete</b><small>{pct < 100 ? (org ? 'Add a photo and website so people recognise you.' : 'Add a photo so people recognise you.') : 'All set.'}</small></div>
        </div>
      </section>

      <div className="pf-grid">
        <nav className="pf-nav" aria-label="Profile sections">
          {sections.map((s) => <button key={s.id} onClick={() => jump(s.id)}><Icon name={s.icon} size={16} />{s.label}</button>)}
        </nav>

        <div className="pf-main">
          <section className="pf-card" id="pf-personal">
            <header><span className="pf-card__ico"><Icon name="user" size={17} /></span><div><h3>Personal details</h3><p>Creators and your team see your name and title.</p></div></header>
            <div className="pf-fields">
              <label><span>Full name</span><input value={f.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" /></label>
              <label><span>Job title</span><input value={f.title} onChange={(e) => set('title', e.target.value)} autoComplete="organization-title" /></label>
              <label className="pf-span">
                <span>Work email</span>
                <div className="pf-lock"><input value={acct.email} readOnly aria-readonly="true" /><button type="button" onClick={() => say('We sent a confirmation code to your current email first.', 'email_change_started')}>Change</button></div>
                <small>Changing your email asks you to confirm with a code first.</small>
              </label>
              <label><span>Phone</span><input value={f.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" inputMode="tel" /></label>
            </div>
          </section>

          {org && <section className="pf-card" id="pf-company">
            <header><span className="pf-card__ico"><Icon name="building" size={17} /></span><div><h3>{org.label}</h3><p>{org.sub}</p></div></header>
            <div className="pf-fields">
              <label><span>{role === 'brand' ? 'Brand name' : 'Name'}</span><input value={f.brand} onChange={(e) => set('brand', e.target.value)} /></label>
              <label><span>Website</span><div className="pf-pre"><em>https://</em><input value={f.site} onChange={(e) => set('site', e.target.value)} inputMode="url" /></div></label>
              <label><span>Industry</span>
                <select value={f.industry} onChange={(e) => set('industry', e.target.value)}>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}</select>
              </label>
              <div className="pf-field"><span>Company size</span>
                <div className="pf-seg" role="radiogroup" aria-label="Company size">{SIZES.map((s) => <button type="button" key={s} role="radio" aria-checked={f.size === s} onClick={() => set('size', s)}>{s}</button>)}</div>
              </div>
              <div className="pf-field pf-span"><span>{org.markets} <small>{f.markets.length} selected</small></span>
                <div className="pf-chips">{MARKETS.map((m) => <button type="button" key={m.id} aria-pressed={f.markets.includes(m.id)} onClick={() => toggleMarket(m.id)}><Flag market={m.id} />{m.short}{f.markets.includes(m.id) ? <Icon name="check" size={13} stroke={2.4} /> : null}</button>)}</div>
              </div>
            </div>
          </section>}

          <section className="pf-card" id="pf-security">
            <header><span className="pf-card__ico"><Icon name="shield" size={17} /></span><div><h3>Sign-in and security</h3><p>How you get into MegaEvolution.</p></div></header>
            <ul className="pf-rows">
              <li>
                <span className="pf-row__ico"><Icon name="lock" size={16} /></span>
                <div><b>Password</b><small>Last changed 3 months ago</small></div>
                <button className="btn btn--sm btn--ghost" onClick={() => setPw(!pw)}>{pw ? 'Cancel' : 'Change'}</button>
              </li>
              {pw && (
                <li className="pf-pw">
                  <form onSubmit={(e) => { e.preventDefault(); setPw(false); say('Password changed. Other devices were signed out.', 'password_changed') }}>
                    <label><span>Current password</span><input type="password" required autoComplete="current-password" /></label>
                    <label><span>New password</span><input type="password" required minLength={8} autoComplete="new-password" /></label>
                    <button className="btn btn--sm">Update password</button>
                  </form>
                </li>
              )}
              <li>
                <span className="pf-row__ico"><Icon name="shield" size={16} /></span>
                <div><b>Two-step verification</b><small>{twoStep ? 'On · a code by email when you sign in on a new device' : 'Off · we recommend turning this on'}</small></div>
                <button className="wtoggle" role="switch" aria-checked={twoStep} aria-label="Two-step verification" onClick={() => { setTwoStep(!twoStep); track('setting_changed', { setting: 'two_step', on: !twoStep }) }} />
              </li>
              <li>
                <span className="pf-row__ico pf-row__ico--g">G</span>
                <div><b>Google</b><small>{google ? 'Connected · hana@lumiskin.example' : 'Sign in with your Google account'}</small></div>
                <button className="btn btn--sm btn--ghost" onClick={() => { setGoogle(!google); say(google ? 'Google disconnected.' : 'Google connected (sample).', 'login_method_changed', { method: 'google', on: !google }) }}>{google ? 'Disconnect' : 'Connect'}</button>
              </li>
              <li>
                <span className="pf-row__ico"><Icon name="user" size={16} /></span>
                <div><b>Passkeys</b><small>Sign in with your fingerprint or face instead of a password.</small></div>
                <button className="btn btn--sm btn--ghost" onClick={() => say('Passkeys are coming soon.', 'passkey_add_clicked')}>Add passkey</button>
              </li>
            </ul>
            <h4 className="pf-sub">Where you’re signed in</h4>
            <ul className="pf-rows pf-rows--tight">
              {sessions.map((s) => (
                <li key={s.id}>
                  <span className="pf-row__ico"><Icon name={s.d.includes('iPhone') ? 'tech' : 'layout'} size={16} /></span>
                  <div><b>{s.d}{s.now ? <em className="pf-now">This device</em> : null}</b><small>{s.w}</small></div>
                  {!s.now && <button className="ulink small" onClick={() => { setSessions((l) => l.filter((x) => x.id !== s.id)); say('Signed out of that device.', 'session_revoked') }}>Sign out</button>}
                </li>
              ))}
            </ul>
          </section>

          <section className="pf-card" id="pf-notify">
            <header><span className="pf-card__ico"><Icon name="bell" size={17} /></span><div><h3>Notifications</h3><p>Choose what reaches you, and where.</p></div></header>
            <div className="pf-matrix" role="table" aria-label="Notification settings">
              <div className="pf-matrix__h" role="row"><span role="columnheader">Notify me about</span><span role="columnheader">Email</span><span role="columnheader">In app</span></div>
              {NOTIFY.map((n) => (
                <div key={n.id} role="row">
                  <span role="cell"><b>{n.t}</b><small>{n.d}</small></span>
                  {(['email', 'app'] as const).map((ch) => (
                    <span role="cell" key={ch}>
                      <button className="wtoggle" role="switch" aria-checked={notify[n.id][ch]} aria-label={`${n.t} by ${ch === 'app' ? 'in-app alert' : 'email'}`}
                        onClick={() => { setNotify((x) => ({ ...x, [n.id]: { ...x[n.id], [ch]: !x[n.id][ch] } })); track('setting_changed', { setting: `notify_${n.id}_${ch}`, on: !notify[n.id][ch] }) }} />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="pf-card" id="pf-prefs">
            <header><span className="pf-card__ico"><Icon name="settings" size={17} /></span><div><h3>Preferences</h3><p>Language, currency and time zone for your workspace.</p></div></header>
            <div className="pf-fields pf-fields--3">
              <label><span>Language</span><select defaultValue="en" onChange={(e) => say(`Language set to ${LOCALE_NAMES[e.target.value as keyof typeof LOCALE_NAMES]}.`, 'language_changed', { to: e.target.value })}>{LOCALES.map((l) => <option key={l} value={l}>{LOCALE_NAMES[l]}</option>)}</select></label>
              <label><span>Currency</span><select value={currency} onChange={(e) => { setCurrency(e.target.value as Currency); say(`Prices now show in ${e.target.value}.`, 'currency_changed', { currency: e.target.value }) }}>{(Object.keys(CURRENCIES) as Currency[]).map((c) => <option key={c} value={c}>{CURRENCIES[c].symbol} {c}</option>)}</select></label>
              <label><span>Time zone</span><select value={f.zone} onChange={(e) => set('zone', e.target.value)}>{ZONES.map((z) => <option key={z}>{z}</option>)}</select></label>
            </div>
          </section>

          <section className="pf-card pf-danger" id="pf-danger">
            <header><span className="pf-card__ico"><Icon name="lock" size={17} /></span><div><h3>Leave or delete</h3><p>These can’t be undone.</p></div></header>
            <ul className="pf-rows">
              {org && (
                <li>
                  <div><b>Leave {f.brand}</b><small>You lose access to its orders, lists and billing. An owner can invite you again.</small></div>
                  <button className="btn btn--sm btn--ghost" onClick={() => say('You are the only owner. Make someone else owner first.', 'leave_org_blocked')}>Leave</button>
                </li>
              )}
              <li className="pf-del">
                <div><b>Delete my account</b><small>Type <code>DELETE</code> to confirm. {role === 'creator' ? 'Orders in progress are finished first, and pending payouts are still paid.' : role === 'editor' ? 'Videos you are editing go back to the queue.' : 'Orders in progress are finished by our team.'}</small></div>
                <input value={del} onChange={(e) => setDel(e.target.value)} placeholder="DELETE" aria-label="Type DELETE to confirm" />
                <button className="btn btn--sm pf-btn-bad" disabled={del !== 'DELETE'} onClick={() => { setDel(''); say('This is a preview, so nothing was deleted.', 'account_delete_clicked') }}>Delete</button>
              </li>
            </ul>
          </section>
        </div>
      </div>

      {dirty && (
        <div className="pf-savebar" role="status">
          <span><i />You have unsaved changes</span>
          <div><button className="btn btn--sm btn--ghost" onClick={() => setF(saved)}>Discard</button><button className="btn btn--sm" onClick={save}>Save changes</button></div>
        </div>
      )}
      {toast && <div className="wtoast" role="status">{toast}</div>}
    </div>
  )
}
