'use client'
// "Tell us about your launch": the agency inquiry as a four-step brief with a live
// summary beside it. Mock only — it validates, shows success and fires track().
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { href, CONTACT_EMAIL } from '@/data/site'
import { MARKETS, REGIONS, LOGO_PLATFORMS } from '@/data/markets'
import { CATEGORIES, categoryBySlug } from '@/data/categories'
import { CURRENCIES } from '@/data/pricing'
import { Flag, Icon, Arrow, PlatformIcon } from '../Icon'
import { useApp } from '../AppState'
import { track } from '@/lib/track'

const MIN = 1000, MAX = 100000

export type BriefPoolItem = { handle: string; name: string; tone: number; market: string; category: string }

export default function BriefForm({ lang, pool }: { lang: string; pool: BriefPoolItem[] }) {
  const { currency } = useApp()
  const [product, setProduct] = useState('')
  const [cat, setCat] = useState('beauty')
  const [picked, setPicked] = useState<string[]>(['vn', 'id'])
  const [budget, setBudget] = useState(10000)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const cur = CURRENCIES[currency]
  const money = (usd: number, short = false) => {
    const v = usd * cur.rate
    if (short || v >= 1e6) return `${cur.symbol}${v >= 1e6 ? `${+(v / 1e6).toFixed(1)}M` : `${Math.round(v / 1e3)}K`}`
    return `${cur.symbol}${Math.round(v).toLocaleString('en-US')}`
  }
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const teams = picked.map((id) => MARKETS.find((m) => m.id === id) || REGIONS.find((r) => r.id === id)!).filter(Boolean)
  const matches = useMemo(() => pool.filter((c) => c.category === cat && (picked.length === 0 || picked.includes(c.market))), [cat, picked, pool])
  const pct = ((budget - MIN) / (MAX - MIN)) * 100

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    track('form_submitted', { form: 'brief', source: 'home', category: cat, markets: picked.join(','), budget_usd: budget })
  }

  return (
    <div className="bf">
      <form className="bf__form" onSubmit={submit}>
        <p className="eyebrow">Start a campaign</p>
        <h2 className="h2">Tell us about <span className="it it--inline">your launch.</span></h2>

        <fieldset className="bf__q">
          <legend><i>1</i>What are you launching?</legend>
          <label className="sr" htmlFor="bf-product">Product</label>
          <input id="bf-product" className="input" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. A sunscreen for humid weather" required />
          <div className="bf__chips" role="group" aria-label="Category">
            {CATEGORIES.map((c) => (
              <button type="button" key={c.slug} className="chip" aria-pressed={cat === c.slug} onClick={() => setCat(c.slug)}><Icon name={c.icon} size={15} />{c.label}</button>
            ))}
          </div>
        </fieldset>

        <fieldset className="bf__q">
          <legend><i>2</i>Where?</legend>
          <div className="bf__chips" role="group" aria-label="Markets">
            {MARKETS.map((m) => (
              <button type="button" key={m.id} className="chip" aria-pressed={picked.includes(m.id)} onClick={() => toggle(m.id)}><Flag market={m.id} />{m.name}</button>
            ))}
            {REGIONS.map((r) => (
              <button type="button" key={r.id} className="chip" aria-pressed={picked.includes(r.id)} onClick={() => toggle(r.id)}><Icon name="globe" size={14} />{r.name}</button>
            ))}
          </div>
        </fieldset>

        <fieldset className="bf__q">
          <legend><i>3</i>Budget<em>{money(budget)}{budget >= MAX ? '+' : ''}</em></legend>
          <input type="range" className="bf__range" min={MIN} max={MAX} step={1000} value={budget} style={{ ['--p' as any]: `${pct}%` }}
            onChange={(e) => setBudget(Number(e.target.value))} aria-label="Budget" aria-valuetext={money(budget)} />
          <div className="bf__scale"><span>{money(MIN, true)}</span><span>{money(25000, true)}</span><span>{money(50000, true)}</span><span>{money(MAX, true)}+</span></div>
        </fieldset>

        <fieldset className="bf__q bf__q--last">
          <legend><i>4</i>Where should we reply?</legend>
          <div className="bf__reply">
            <label className="sr" htmlFor="bf-email">Work email</label>
            <input id="bf-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@brand.com" autoComplete="email" required />
            <button className="btn btn--lg" data-cta="home_brief_send">Send brief<Arrow /></button>
          </div>
          <p className="bf__fine">No brief document needed. Free, and we reply within one business day.</p>
        </fieldset>
      </form>

      <aside className="bf__sum" aria-live="polite">
        {sent ? (
          <div className="bf__done">
            <span className="bf__ok"><Icon name="check" size={26} /></span>
            <h3 className="h3">Brief received.</h3>
            <p>Our team in {teams.map((t: any) => t.city || t.name).join(', ') || 'your markets'} will reply to {email} with a shortlist and rates.</p>
            <div className="row">
              <button className="btn btn--white btn--sm" onClick={() => setSent(false)}>Edit brief</button>
              <Link className="tlink" href={href(lang, '/creators')} data-cta="brief_done_search">Search creators meanwhile<Arrow size={15} /></Link>
            </div>
          </div>
        ) : (
          <>
            <p className="bf__k">Your brief</p>
            <p className="bf__product">{product || 'Your product'}</p>
            <dl className="bf__rows">
              <div><dt>Category</dt><dd>{categoryBySlug[cat].label}</dd></div>
              <div><dt>Budget</dt><dd>{money(budget)}{budget >= MAX ? '+' : ''}</dd></div>
            </dl>
            <p className="bf__k">Local teams on it</p>
            <ul className="bf__teams">
              {teams.length === 0 && <li className="bf__empty">Pick at least one market</li>}
              {teams.map((t: any) => {
                const top = t.watches ? t.watches.find((w: string) => LOGO_PLATFORMS.includes(w)) || t.watches[0] : null
                return (
                  <li key={t.id}>
                    {t.watches ? <Flag market={t.id} /> : <Icon name="globe" size={16} />}
                    <span>{t.city || t.name}</span>
                    {top ? <small>{LOGO_PLATFORMS.includes(top) ? <PlatformIcon name={top} size={13} mono /> : null}{top}</small> : <small>Ask our team</small>}
                  </li>
                )
              })}
            </ul>
            <p className="bf__k">What happens next</p>
            <ol className="bf__next">
              <li><i>1</i>Our team in that market reads your brief</li>
              <li><i>2</i>You get a shortlist with rates</li>
              <li><i>3</i>You approve, then we launch</li>
            </ol>
            <div className="bf__match">
              <span className="bf__avs">{matches.slice(0, 4).map((c) => <span key={c.handle} className={`av tone-${(c.tone + 5) % 8}`}>{c.name[0]}</span>)}</span>
              <p><b>{matches.length}</b> sample {categoryBySlug[cat].noun} creators match<small>Your real shortlist comes from our local teams.</small></p>
            </div>
            <div className="bf__talk">
              <span className="bf__talkav" role="img" aria-label="TODO: real photo of an account manager"><Icon name="user" size={18} /></span>
              <p><b>Prefer to talk first?</b><small>Write to {CONTACT_EMAIL}</small></p>
              <a className="btn btn--white btn--sm" href={`mailto:${CONTACT_EMAIL}`} data-cta="brief_email_us">Email us</a>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
