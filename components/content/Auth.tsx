'use client'
// Login and sign-up for the mockup. Nothing is sent anywhere: signing in just sets the
// dummy account for this browser (see data/accounts.ts) and opens that role's workspace.
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { href } from '@/data/site'
import { ACCOUNTS, accountByEmail, accountByRole, type Account } from '@/data/accounts'
import { mcnBySlug } from '@/data/mcns'
import { Icon, Arrow } from '../Icon'
import { useApp } from '../AppState'
import { track } from '@/lib/track'

const roleName = (r: string) => (r === 'mcn' ? 'MCN' : r[0].toUpperCase() + r.slice(1))

/** One-click cards for every dummy account. */
export function DemoAccounts({ lang }: { lang: string }) {
  const { setRole } = useApp()
  const go = (a: Account) => {
    setRole(a.role)
    track('login', { method: 'demo_card', role: a.role })
    window.location.href = href(lang, a.home)
  }
  return (
    <div className="ct-demo">
      {ACCOUNTS.map((a) => (
        <button key={a.role} className="ct-demo__card" onClick={() => go(a)} data-cta={`login_demo_${a.role}`} data-role={a.role}>
          <span className={`av tone-${a.tone}`}>{a.initial}</span>
          <b>{roleName(a.role)} <small>{a.name} · {a.org}</small></b>
          <span className="ct-demo__go">Sign in<Arrow size={14} /></span>
          <p>{a.blurb}</p>
          <code>{a.email} · {a.password}</code>
        </button>
      ))}
    </div>
  )
}

export function LoginForm({ lang }: { lang: string }) {
  const { setRole } = useApp()
  const [mode, setMode] = useState<'password' | 'code'>('password')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [err, setErr] = useState(false)

  const find = () => accountByEmail[email.trim().toLowerCase()]
  const signIn = (a: Account, method: string) => {
    setRole(a.role)
    track('login', { method, role: a.role })
    window.location.href = href(lang, a.home)
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const a = find()
    track('form_submitted', { form: 'login', mode, step, known: !!a })
    if (!a) { setErr(true); return }
    setErr(false)
    if (mode === 'code' && step === 'email') { setStep('code'); track('login_code_sent', { role: a.role }); return }
    signIn(a, mode === 'code' ? 'email_code' : 'password')
  }

  return (
    <form className="stack" onSubmit={submit} noValidate>
      <div className="wseg-like row" role="group" aria-label="Sign-in method">
        <button type="button" className="chip" aria-pressed={mode === 'password'} onClick={() => { setMode('password'); setStep('email') }}>Password</button>
        <button type="button" className="chip" aria-pressed={mode === 'code'} onClick={() => { setMode('code'); setStep('email') }} data-cta="login_use_code">Email me a login code</button>
      </div>

      {step === 'email' ? (
        <>
          <label className="field"><span>Email</span>
            <input className="input" type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(false) }} placeholder="brand@demo.megaevolution.io" autoComplete="email" required />
          </label>
          {mode === 'password' && (
            <label className="field"><span>Password <small>(any password works in the mockup)</small></span>
              <input className="input" type="password" name="password" placeholder="demo1234" autoComplete="current-password" />
            </label>
          )}
        </>
      ) : (
        <div className="stack">
          <p className="small">We sent a 6-digit code to <b>{email}</b>. In the mockup, any 6 digits work.</p>
          <div className="ct-code" role="group" aria-label="Login code">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input key={i} inputMode="numeric" maxLength={1} aria-label={`Digit ${i + 1}`} defaultValue={i < 6 ? String((i * 3 + 4) % 10) : ''}
                onInput={(e) => { const n = (e.currentTarget.nextElementSibling as HTMLInputElement | null); if (e.currentTarget.value && n) n.focus() }} />
            ))}
          </div>
          <button type="button" className="small ulink" style={{ justifySelf: 'start' }} onClick={() => setStep('email')}>Use a different email</button>
        </div>
      )}

      {err && (
        <div className="ct-err" role="alert">
          That email isn’t one of the demo accounts. Use one of these (any password):
          <ul>{ACCOUNTS.map((a) => <li key={a.email}>{a.email}</li>)}</ul>
        </div>
      )}

      <button className="btn btn--lg btn--block" data-cta="login_submit">
        {mode === 'code' ? (step === 'email' ? 'Send login code' : 'Verify and log in') : 'Log in'}<Arrow />
      </button>
      <p className="small muted">New here? <Link className="ulink" href={href(lang, '/signup')} data-cta="login_to_signup">Create a free account</Link></p>
    </form>
  )
}

const ROLES: { id: 'brand' | 'agency' | 'creator' | 'mcn'; label: string; sub: string; org: string }[] = [
  { id: 'brand', label: 'Brand', sub: 'Find and book creators', org: 'Company or brand' },
  { id: 'agency', label: 'Agency', sub: 'Run client campaigns', org: 'Agency name' },
  { id: 'creator', label: 'Creator', sub: 'Get booked by brands', org: 'Main handle, e.g. @you' },
  { id: 'mcn', label: 'MCN', sub: 'Manage a roster', org: 'MCN name' },
]

export function SignupForm({ lang }: { lang: string }) {
  const { setRole } = useApp()
  const [role, setR] = useState<(typeof ROLES)[number]['id']>('brand')
  const [mcn, setMcn] = useState<string | null>(null)
  const [join, setJoin] = useState(true) // "Join {MCN} as my MCN" is ticked by default
  const [from, setFrom] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const as = q.get('as')
    const invite = q.get('mcn')
    if (invite && mcnBySlug[invite]) { setMcn(invite); setR('creator') }
    else if (as && ROLES.some((r) => r.id === as)) setR(as as any)
    setFrom(q.get('from') || '')
  }, [])

  const invited = mcn ? mcnBySlug[mcn] : null
  const cfg = ROLES.find((r) => r.id === role)!
  const account = accountByRole[role]

  if (done) {
    return (
      <div className="stack">
        <div className="form-ok" role="status" style={{ display: 'grid', gap: 6 }}>
          <strong style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="check" />Your {cfg.label.toLowerCase()} account is ready.</strong>
          <span>In the mockup you’re now signed in as the dummy {cfg.label.toLowerCase()} account ({account.name}).</span>
          {invited && role === 'creator' && join ? <span>Your application to join <b>{invited.name}</b> was sent. It shows as pending on your profile until they respond.</span> : null}
        </div>
        <Link className="btn btn--lg" href={href(lang, account.home)} data-cta={`signup_open_workspace_${role}`}>Open my workspace<Arrow /></Link>
        {role === 'brand' ? <Link className="tlink" style={{ justifySelf: 'start' }} href={href(lang, '/creators')} data-cta="signup_to_search">Search creators<Arrow size={15} /></Link> : null}
      </div>
    )
  }

  return (
    <form className="stack" onSubmit={(e) => {
      e.preventDefault()
      setRole(role); setDone(true)
      track('form_submitted', { form: 'signup', role })
      track('signup', { role, from, invited_by_mcn: invited?.slug || null, join_mcn: !!(invited && role === 'creator' && join) })
      if (from) track('gate_converted', { gate: from, to: 'signup_completed' })
    }}>
      <div>
        <span className="label">I’m signing up as</span>
        <div className="ct-roles" role="group" aria-label="Account type" style={{ marginTop: 8 }}>
          {ROLES.map((r) => <button type="button" key={r.id} aria-pressed={role === r.id} onClick={() => { setR(r.id); track('signup_role_selected', { role: r.id }) }}>{r.label}<small>{r.sub}</small></button>)}
        </div>
      </div>
      <div className="grid-2">
        <label className="field"><span>Full name</span><input className="input" name="name" required autoComplete="name" /></label>
        <label className="field"><span>{cfg.org}</span><input className="input" name="org" required /></label>
      </div>
      <label className="field"><span>{role === 'creator' ? 'Email' : 'Work email'}</span><input className="input" name="email" type="email" required autoComplete="email" /></label>
      <label className="field"><span>Password <small>(or leave empty and use email login codes)</small></span><input className="input" name="password" type="password" autoComplete="new-password" /></label>

      {invited && role === 'creator' && (
        <label className="ct-invite">
          <input type="checkbox" name="join_mcn" checked={join} onChange={(e) => { setJoin(e.target.checked); track('signup_join_mcn_toggled', { on: e.target.checked, mcn: invited.slug }) }} />
          <span><b>Join {invited.name} as my MCN</b><small>{invited.name} invited you. They’ll see your application and can manage brand deals for you. Untick to sign up on your own.</small></span>
        </label>
      )}

      <label className="check"><input type="checkbox" required /><span>I agree to the <Link className="ulink" href={href(lang, '/help/terms')}>Terms</Link> and <Link className="ulink" href={href(lang, '/help/privacy')}>Privacy Policy</Link>.</span></label>
      <button className="btn btn--lg btn--block" data-cta="signup_submit">{role === 'creator' ? 'Create your profile' : role === 'mcn' ? 'Apply as an MCN' : 'Create free account'}<Arrow /></button>
      <p className="small muted">Already have an account? <Link className="ulink" href={href(lang, '/login')} data-cta="signup_to_login">Log in</Link></p>
    </form>
  )
}
