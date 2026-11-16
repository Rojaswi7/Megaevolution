import { useEffect, useMemo, useRef, useState } from 'react'
import { MARKETS, MARKET_INFO, CATEGORIES, CREATORS, PLATFORM_COLORS } from './data.js'
import { Head, Eyebrow } from './head.jsx'

const fmt = (date, tz, opts) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, ...opts }).format(date)
const SITE = 'https://www.megaevolution.io'

function useReduced() {
  const [r, setR] = useState(false)
  useEffect(() => setR(window.matchMedia('(prefers-reduced-motion: reduce)').matches), [])
  return r
}
function useTick(ms, on = true) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) return
    const t = setInterval(() => setN((x) => x + 1), ms)
    return () => clearInterval(t)
  }, [ms, on])
  return n
}

function Arrow({ dir = 'ne' }) {
  const d = { ne: 'M3 11 11 3M5 3h6v6', e: 'M1 7h12M8 2l5 5-5 5' }[dir]
  return (
    <svg className="arrow" width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}
function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function Verified() {
  return (
    <svg className="verified" width="16" height="16" viewBox="0 0 24 24" aria-label="Verified">
      <path d="M12 2l2.4 1.8 3-.2.9 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.9 2.9-3-.2L12 22l-2.4-1.8-3 .2-.9-2.9-2.5-1.7 1-2.8-1-2.8 2.5-1.7.9-2.9 3 .2z" fill="currentColor" />
      <path d="M8 12.3l2.6 2.5L16 9.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}


/* ============================================================
   01 · About — bento of live micro-interfaces
   ============================================================ */
const HELLOS = [
  ['ID', 'Halo, kak! Ada promo baru?'],
  ['VN', 'Xin chào! Cái này dùng thử chưa?'],
  ['KR', '안녕하세요! 이거 써봤어요?'],
  ['JP', 'こんにちは！これ使ってみた？'],
  ['TW', '你好！這個真的好用嗎？'],
  ['US', 'Hey! Has anyone tried this?'],
]

export function About() {
  const reduced = useReduced()
  const tick = useTick(2200, !reduced)
  const lit = reduced ? -1 : tick % MARKETS.length

  return (
    <section className="about2">
      <div className="wrap">
        <Head n="01" label="About" title="Local first, *everywhere* we work.">A creator marketplace with people on the ground in every market.</Head>
        <div className="bento2">
          <article className="b2 b2--hello">
            <div className="b2__copy">
              <p className="b2__kicker">Why MegaEvolution</p>
              <p className="b2__statement">
                The creator your customer trusts already lives in their city and speaks their language.{' '}
                <span>We introduce you properly.</span>
              </p>
            </div>
            <div className="chat" aria-hidden="true">
              {[0, 1, 2, 3].map((k) => {
                const i = tick + k
                const [c, m] = HELLOS[i % HELLOS.length]
                return (
                  <div className={`chat__msg ${i % 2 ? 'is-right' : ''}`} key={i}>
                    <span className="chat__code">{c}</span>
                    <span className="chat__bubble">{m}</span>
                  </div>
                )
              })}
            </div>
          </article>

          <article className="b2 b2--markets">
            <div>
              <span className="b2__big">6</span>
              <p>markets, each with a team on the ground</p>
            </div>
            <div className="codes" aria-hidden="true">
              {MARKETS.map((m, k) => <span key={m.id} className={k === lit ? 'is-on' : ''}>{MARKET_INFO[m.id].code}</span>)}
            </div>
          </article>

          <article className="b2 b2--rate">
            <div className="rate" aria-hidden="true">
              <span className="rate__av">B</span>
              <span className="rate__who"><b>@bao.an.eats</b><small>Food · Saigon · 500K</small></span>
              <span className="rate__price"><small>from</small><b>$100</b></span>
            </div>
            <div className="b2__foot">
              <h3>Honest pricing</h3>
              <p>Every creator shows a starting rate in USD before you message them.</p>
            </div>
          </article>

          <article className="b2 b2--team">
            <div className="stack" aria-hidden="true">
              {MARKETS.map((m) => <span key={m.id}>{MARKET_INFO[m.id].code}</span>)}
              <i className="stack__live" />
            </div>
            <div className="b2__foot">
              <h3>Local teams</h3>
              <p>People who know which creators move product — not just who has big numbers.</p>
            </div>
          </article>

          <article className="b2 b2--deal">
            <div className="doc" aria-hidden="true">
              <i /><i /><i className="short" />
              <svg viewBox="0 0 120 28" className="doc__sign"><path d="M4 20c10-14 16-14 14 0s10-10 16-8 4 12 12 6 10-12 18-8 6 10 14 6 12-8 22-6" /></svg>
              <span className="doc__ok"><Check /> Signed</span>
            </div>
            <div className="b2__foot">
              <h3>One agreement</h3>
              <p>One contract, one invoice — one market or six.</p>
            </div>
          </article>

          <article className="b2 b2--platforms">
            <div className="plats" aria-hidden="true">
              {Object.keys(PLATFORM_COLORS).map((p) => (
                <span key={p} style={{ '--pc': PLATFORM_COLORS[p] }}><i />{p}</span>
              ))}
            </div>
            <div className="b2__foot">
              <h3>Campaigns run on</h3>
              <p>Whatever your customers actually open — market by market.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   05 · Process — autoplay product tour
   ============================================================ */
const STEPS = [
  { t: 'Brief', d: 'Tell us the product, markets and budget. Ten minutes, in English.', notes: ['10 minutes', 'In English'] },
  { t: 'Shortlist', d: 'Our team in each market suggests creators who fit — with rates, before any calls.', notes: ['Rates shown', 'Picked locally'] },
  { t: 'Launch', d: 'You approve creators and content. We handle contracts, timing and posting.', notes: ['You approve', 'Posted on time'] },
  { t: 'Learn', d: 'One report across every market, so you can see what actually sold.', notes: ['Every market', 'One report'] },
]
const STEP_MS = 5200
const SHORT = CREATORS.filter((c) => ['vn', 'id'].includes(c.market)).slice(0, 4)
const minRate = (r) => Number(String(r).split('–')[0].replace(/,/g, ''))
const REPORT = {
  vn: { Views: [30, 46, 42, 64, 58, 80, 74], Clicks: [18, 26, 34, 30, 44, 52, 61], Sales: [8, 12, 15, 22, 26, 31, 38] },
  id: { Views: [22, 30, 38, 35, 50, 56, 68], Clicks: [12, 20, 22, 30, 28, 40, 47], Sales: [5, 9, 11, 14, 19, 23, 29] },
}
const PHONE_MARKETS = [['vn', 'Vietnam'], ['id', 'Indonesia'], ['tw', 'Taiwan'], ['kr', 'Korea']]

function Screen({ step, s, set, next, live }) {
  if (step === 0)
    return (
      <div className="scr">
        <p className="scr__title">New brief</p>
        <label className="scr__field"><small>Product</small><span>Sunscreen SPF50, 50ml</span></label>
        <div className="scr__field">
          <small>Markets · tap to change</small>
          <span className="scr__chips">
            {PHONE_MARKETS.map(([id, name]) => (
              <button type="button" key={id} className={s.markets.includes(id) ? '' : 'ghost'}
                onClick={() => set({ markets: s.markets.includes(id) ? s.markets.filter((x) => x !== id) : [...s.markets, id] })}>
                {name}
              </button>
            ))}
          </span>
        </div>
        <div className="scr__field">
          <small>Budget</small>
          <input type="range" min="1000" max="30000" step="500" value={s.budget} className="scr__slider"
            style={{ '--p': `${((s.budget - 1000) / 29000) * 100}%` }}
            onChange={(e) => set({ budget: Number(e.target.value) })} aria-label="Budget" />
          <span className="scr__mono">USD {s.budget.toLocaleString('en-US')}</span>
        </div>
        <button type="button" className="scr__btn" onClick={next} disabled={s.markets.length === 0}>
          {s.markets.length === 0 ? 'Pick a market' : `Send brief · ${s.markets.length} market${s.markets.length > 1 ? 's' : ''}`}
        </button>
      </div>
    )

  if (step === 1) {
    const picked = SHORT.filter((c) => s.picked.includes(c.handle))
    const total = picked.reduce((a, c) => a + minRate(c.rate), 0)
    return (
      <div className="scr">
        <p className="scr__title">Shortlist · Vietnam</p>
        {SHORT.map((c, k) => {
          const on = s.picked.includes(c.handle)
          return (
            <button type="button" className={`scr__row ${on ? 'is-on' : ''}`} key={c.handle} style={{ animationDelay: `${k * 90}ms` }}
              onClick={() => set({ picked: on ? s.picked.filter((x) => x !== c.handle) : [...s.picked, c.handle] })} aria-pressed={on}>
              <span className="scr__av">{c.name[0]}</span>
              <span className="scr__who"><b>@{c.handle}</b><small>{c.followers} · {c.cat}</small></span>
              <span className="scr__mono">${minRate(c.rate).toLocaleString('en-US')}+</span>
              <span className={`scr__tick ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
            </button>
          )
        })}
        <div className="scr__total"><small>Estimated from</small><b>${total.toLocaleString('en-US')}</b></div>
        <button type="button" className="scr__btn" onClick={next} disabled={picked.length === 0}>
          {picked.length === 0 ? 'Pick a creator' : `Approve ${picked.length} creator${picked.length > 1 ? 's' : ''}`}
        </button>
      </div>
    )
  }

  if (step === 2)
    return (
      <div className="scr">
        <p className="scr__title">Content review</p>
        <div className={`scr__video ${s.review === 'ok' ? 'is-ok' : ''}`}>
          <span className="scr__play" />
          <span className="scr__progress"><i /></span>
          <small>@bao.an.eats · draft 2</small>
        </div>
        <p className="scr__caption">“Ăn thử bánh mì ngon nhất Sài Gòn — with SPF that survives the heat”</p>
        {s.review === 'ok' && <p className="scr__status ok">✓ Approved · posting Fri 19:00 local</p>}
        {s.review === 'changes' && <p className="scr__status">Feedback sent to @bao.an.eats</p>}
        <div className="scr__actions">
          <button type="button" className="scr__btn" onClick={() => { set({ review: 'ok' }); setTimeout(next, 1400) }}>Approve</button>
          <button type="button" className="scr__btn ghost" onClick={() => set({ review: 'changes' })}>Changes</button>
        </div>
      </div>
    )

  const data = REPORT[s.rMarket][s.metric]
  const max = Math.max(...data)
  return (
    <div className="scr">
      <p className="scr__title">Report <small className="scr__sample">sample</small></p>
      <div className="scr__seg">
        {['Views', 'Clicks', 'Sales'].map((m) => (
          <button type="button" key={m} className={s.metric === m ? 'on' : ''} onClick={() => set({ metric: m })}>{m}</button>
        ))}
      </div>
      <div className="scr__bars">
        {data.map((v, k) => <i key={k} style={{ height: `${(v / max) * 100}%` }} />)}
      </div>
      <div className="scr__split">
        {[['vn', 'Vietnam'], ['id', 'Indonesia']].map(([id, name]) => {
          const sum = REPORT[id][s.metric].reduce((a, b) => a + b, 0)
          const all = REPORT.vn[s.metric].reduce((a, b) => a + b, 0) + REPORT.id[s.metric].reduce((a, b) => a + b, 0)
          return (
            <button type="button" key={id} className={s.rMarket === id ? 'on' : ''} onClick={() => set({ rMarket: id })}>
              <small>{name}</small><b>{Math.round((sum / all) * 100)}%</b>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const INITIAL = { markets: ['vn', 'id'], budget: 8000, picked: [], review: null, rMarket: 'vn', metric: 'Views' }

export function Process() {
  const reduced = useReduced()
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const [touched, setTouched] = useState(false)
  const [s, setS] = useState(INITIAL)
  const userActed = useRef(false)

  const set = (patch) => setS((p) => ({ ...p, ...patch }))
  const userSet = (patch) => { userActed.current = true; setTouched(true); set(patch) }
  const next = () => setStep((x) => Math.min(x + 1, STEPS.length - 1))

  // autoplay through steps until the visitor touches the phone
  useEffect(() => {
    if (reduced || paused || touched) return
    const t = setTimeout(() => setStep((x) => (x + 1) % STEPS.length), STEP_MS)
    return () => clearTimeout(t)
  }, [step, paused, touched, reduced])

  // live demo: on the shortlist screen, tick creators one by one
  useEffect(() => {
    if (step !== 1 || touched) return
    set({ picked: [] })
    const timers = SHORT.slice(0, 3).map((c, k) =>
      setTimeout(() => setS((p) => (p.picked.includes(c.handle) ? p : { ...p, picked: [...p.picked, c.handle] })), 700 + k * 650)
    )
    return () => timers.forEach(clearTimeout)
  }, [step, touched])

  // live demo: approve on the launch screen, cycle metrics on the report screen
  useEffect(() => {
    if (touched) return
    if (step === 2) {
      set({ review: null })
      const t = setTimeout(() => set({ review: 'ok' }), 2600)
      return () => clearTimeout(t)
    }
    if (step === 3) {
      set({ metric: 'Views' })
      const a = setTimeout(() => set({ metric: 'Clicks' }), 1700)
      const b = setTimeout(() => set({ metric: 'Sales' }), 3400)
      return () => { clearTimeout(a); clearTimeout(b) }
    }
  }, [step, touched])

  const goto = (k) => { setStep(k); if (k === 2) set({ review: null }) }

  return (
    <section className="process2" id="how">
      <div className="wrap">
        <Head n="05" label="Process" title="From brief to *posted* content.">Four steps, a local team on every one. The phone is live — try it.</Head>
        <div className="tour" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <ol className="tour__tabs">
            {STEPS.map((st, k) => (
              <li key={st.t}>
                <button className={k === step ? 'is-on' : ''} onClick={() => goto(k)} aria-pressed={k === step}>
                  <span className="tour__n">0{k + 1}</span>
                  <span className="tour__t">{st.t}</span>
                  <span className="tour__d">{st.d}</span>
                  <span className="tour__bar">
                    {k === step && !touched && <i key={`${step}-${paused}`} style={{ animationDuration: `${STEP_MS}ms`, animationPlayState: paused || reduced ? 'paused' : 'running' }} />}
                    {(k < step || (k === step && touched)) && <i className="done" />}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="tour__stage">
            <div className="tour__glow" />
            <div className="phone2" onPointerDown={() => { userActed.current = true; setTouched(true) }}>
              <div className="phone2__notch" />
              <div className="phone2__screen" key={step}>
                <Screen step={step} s={s} set={userSet} next={next} live={userActed} />
              </div>
            </div>
            <span className="note note--a" key={`a${step}`} aria-hidden="true"><Check /> {STEPS[step].notes[0]}</span>
            <span className="note note--b" key={`b${step}`} aria-hidden="true"><Check /> {STEPS[step].notes[1]}</span>
            <span className={`tour__hint ${touched ? 'is-off' : ''}`}>Tap the phone to try it</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   06 · For creators — creator dashboard mock
   ============================================================ */
export function ForCreators() {
  const [rate, setRate] = useState(150)
  const requests = [
    ['Skincare brand', 'Seoul', 450, 'New'],
    ['Snack brand', 'Jakarta', 300, 'Accepted'],
    ['Phone brand', 'Taipei', 600, 'Paid'],
  ]
  return (
    <section className="forc2" id="for-creators">
      <div className="wrap forc2__grid">
        <div className="forc2__copy">
          <Eyebrow n="06" label="For creators" />
          <h2 className="hd__title">Work with brands abroad, <em>without the admin.</em></h2>
          <p>Set your own rate, get verified once, and let brands from Seoul to San Francisco find you. We handle contracts and make sure you get paid.</p>
          <ul className="ticks">
            <li><Check /> Your rate, your call</li>
            <li><Check /> Contracts handled for you</li>
            <li><Check /> Paid on time, every time</li>
          </ul>
          <a className="btn btn--shine" href={SITE}>Get verified as a creator <Arrow /></a>
        </div>

        <div className="dash" aria-label="Example creator dashboard">
          <div className="dash__card">
            <header className="dash__head">
              <span className="dash__av">L</span>
              <span>
                <b>@linh.glow <Verified /></b>
                <small>Beauty · Saigon · 410K</small>
              </span>
              <span className="dash__status"><i /> Open to offers</span>
            </header>

            <div className="dash__rate">
              <span><small>Your starting rate</small><b>${rate}</b></span>
              <span className="dash__step">
                <button aria-label="Lower rate" onClick={() => setRate((r) => Math.max(50, r - 25))}>−</button>
                <button aria-label="Raise rate" onClick={() => setRate((r) => Math.min(2000, r + 25))}>+</button>
              </span>
            </div>

            <p className="dash__label">Brand requests</p>
            <ul className="dash__list">
              {requests.map(([b, city, amt, st]) => (
                <li key={b}>
                  <span className="dash__logo">{b[0]}</span>
                  <span><b>{b}</b><small>{city}</small></span>
                  <span className="dash__amt">${amt}</span>
                  <span className={`dash__chip dash__chip--${st.toLowerCase()}`}>{st}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="dash__toast"><span><Check /></span><b>Payout sent</b><small>$600 · Phone brand</small></div>
          <p className="dash__note">Example dashboard</p>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   07 · Contact — interactive brief builder
   ============================================================ */
export function Contact() {
  const [cat, setCat] = useState('Beauty')
  const [picked, setPicked] = useState(['vn', 'id'])
  const [budget, setBudget] = useState(10000)
  const [product, setProduct] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const now = new Date()

  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const matches = useMemo(() => CREATORS.filter((c) => c.cat === cat && (picked.length === 0 || picked.includes(c.market))), [cat, picked])
  const pct = ((budget - 1000) / (100000 - 1000)) * 100

  return (
    <section className="contact2" id="contact">
      <div className="wrap">
        <div className="builder">
          <form className="builder__form" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <Eyebrow n="07" label="Start a campaign" />
            <h2 className="hd__title">Build your <em>brief.</em></h2>

            <fieldset className="q">
              <legend><span>1</span> What are you launching?</legend>
              <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. A sunscreen for humid weather" required />
              <div className="seg">
                {CATEGORIES.map((c) => (
                  <button type="button" key={c} className={c === cat ? 'is-on' : ''} onClick={() => setCat(c)}>{c}</button>
                ))}
              </div>
            </fieldset>

            <fieldset className="q">
              <legend><span>2</span> Where?</legend>
              <div className="seg seg--wrap">
                {MARKETS.map((m) => (
                  <button type="button" key={m.id} className={picked.includes(m.id) ? 'is-on' : ''} onClick={() => toggle(m.id)}>
                    <b>{MARKET_INFO[m.id].code}</b> {m.country}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="q">
              <legend><span>3</span> Budget <em>USD {budget.toLocaleString('en-US')}{budget >= 100000 ? '+' : ''}</em></legend>
              <input
                type="range" min="1000" max="100000" step="1000" value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="slider" style={{ '--p': `${pct}%` }} aria-label="Budget in USD"
              />
              <div className="slider__scale"><span>1K</span><span>25K</span><span>50K</span><span>100K+</span></div>
            </fieldset>

            <fieldset className="q q--last">
              <legend><span>4</span> Where should we reply?</legend>
              <div className="emailrow">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@brand.com" required />
                <button className="btn btn--shine" type="submit">Send brief <Arrow /></button>
              </div>
            </fieldset>
          </form>

          <aside className="summary" aria-live="polite">
            {sent ? (
              <div className="summary__done">
                <span className="summary__ok"><Check /></span>
                <h3>Brief received.</h3>
                <p>Our teams in {picked.map((id) => MARKETS.find((m) => m.id === id).city).join(', ') || 'your markets'} will reply with a shortlist and rates.</p>
                <button className="link" onClick={() => setSent(false)}>Edit brief</button>
              </div>
            ) : (
              <>
                <p className="summary__kicker">Your brief</p>
                <p className="summary__product">{product || 'Your product'}</p>
                <dl className="summary__rows">
                  <div><dt>Category</dt><dd>{cat}</dd></div>
                  <div><dt>Budget</dt><dd>USD {budget.toLocaleString('en-US')}</dd></div>
                </dl>
                <p className="summary__label">Local teams on it</p>
                <ul className="summary__teams">
                  {picked.length === 0 && <li className="summary__empty">Pick at least one market</li>}
                  {picked.map((id) => {
                    const m = MARKETS.find((x) => x.id === id)
                    return (
                      <li key={id}>
                        <span className="summary__code">{MARKET_INFO[id].code}</span>
                        <span>{m.city}</span>
                        <small>{fmt(now, m.tz, { hour: '2-digit', minute: '2-digit' })}</small>
                      </li>
                    )
                  })}
                </ul>
                <p className="summary__label">What happens next</p>
                <ol className="summary__next">
                  <li><i>1</i><span>A local manager reads your brief</span></li>
                  <li><i>2</i><span>You get a shortlist with rates</span></li>
                  <li><i>3</i><span>You approve — we launch</span></li>
                </ol>
                <div className="summary__match">
                  <div className="summary__avs">
                    {matches.slice(0, 4).map((c) => <span key={c.handle}>{c.name[0]}</span>)}
                    {matches.length === 0 && <span className="ghost">?</span>}
                  </div>
                  <p>
                    <b>{matches.length}</b> sample {cat.toLowerCase()} creator{matches.length === 1 ? '' : 's'} match
                    <small>Your real shortlist comes from our local teams.</small>
                  </p>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
