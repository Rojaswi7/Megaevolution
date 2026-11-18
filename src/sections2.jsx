import { useEffect, useMemo, useRef, useState } from 'react'
import { MARKETS, MARKET_INFO, CATEGORIES, CREATORS, PLATFORM_COLORS, localRate, minUsd, money } from './data.js'
import { Head, Eyebrow } from './head.jsx'
import { Flag } from './flag.jsx'
import { PlatformIcon } from './platformIcon.jsx'

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
        <Head label="About us" title="Why brands|work with us" />
        <div className="bento2">
          <article className="b2 b2--hello">
            <div className="b2__copy">
              <p className="b2__statement">
                Your customers already follow creators in their own city, in their own language. We find those
                creators and run the campaign with them.
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
              <span className="b2__big b2__big--text">One contact</span>
              <p>for every market you launch in. We coordinate the local teams for you.</p>
            </div>
            <div className="codes" aria-hidden="true">
              {MARKETS.slice(0, 8).map((m, k) => <span key={m.id} className={k === lit % 8 ? 'is-on' : ''}>{MARKET_INFO[m.id].code}</span>)}
            </div>
          </article>

          <article className="b2 b2--rate">
            <div className="rate" aria-hidden="true">
              <span className="rate__av">B</span>
              <span className="rate__who"><b>@bao.an.eats</b><small>F&amp;B · Saigon · 500K</small></span>
              <span className="rate__price"><small>from</small><b>{localRate(100, 'vn')}</b></span>
            </div>
            <div className="b2__foot">
              <h3>Rates up front</h3>
              <p>Every creator shows a starting rate in their own currency before you get in touch.</p>
            </div>
          </article>

          <article className="b2 b2--team">
            <div className="stack" aria-hidden="true">
              {MARKETS.slice(0, 6).map((m) => <span key={m.id}>{MARKET_INFO[m.id].code}</span>)}
              <span className="stack__more">+{MARKETS.length - 6}</span>
              <i className="stack__live" />
            </div>
            <div className="b2__foot">
              <h3>Local teams</h3>
              <p>People in each country who know which creators actually sell, not just who has the most followers.</p>
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
              <p>One contract and one invoice, however many markets you launch in.</p>
            </div>
          </article>

          <article className="b2 b2--platforms">
            <div className="plats" aria-hidden="true">
              {Object.keys(PLATFORM_COLORS).map((p) => (
                <span key={p} style={{ '--pc': PLATFORM_COLORS[p] }}><PlatformIcon name={p} size={13} />{p}</span>
              ))}
            </div>
            <div className="b2__foot">
              <h3>Campaigns run on</h3>
              <p>We plan around the apps people in each market actually use.</p>
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
  { t: 'Brief', d: 'Tell us the product, the markets and the budget.', you: 'Product, markets, budget', we: 'Read it with our team in each market' },
  { t: 'Shortlist', d: 'Our team in each market suggests creators who fit, with their rates.', you: 'Pick the creators you like', we: 'Suggest creators, with rates' },
  { t: 'Launch', d: 'You approve the content. We handle contracts, timing and posting.', you: 'Approve the content', we: 'Contracts, timing and posting' },
  { t: 'Learn', d: 'One report across every market, so you can see what actually sold.', you: 'See what sold', we: 'One report for every market' },
]
const STEP_MS = 6000
const SHORT = CREATORS.filter((c) => ['vn', 'id'].includes(c.market)).slice(0, 4)
const minRate = (r) => Number(String(r).split('–')[0].replace(/,/g, ''))
const REPORT = {
  vn: { Views: [30, 46, 42, 64, 58, 80, 74], Clicks: [18, 26, 34, 30, 44, 52, 61], Sales: [8, 12, 15, 22, 26, 31, 38] },
  id: { Views: [22, 30, 38, 35, 50, 56, 68], Clicks: [12, 20, 22, 30, 28, 40, 47], Sales: [5, 9, 11, 14, 19, 23, 29] },
}
const PHONE_MARKETS = [['vn', 'Vietnam'], ['id', 'Indonesia'], ['tw', 'Taiwan'], ['kr', 'Korea']]

function AppHead({ title, sub, step }) {
  return (
    <div className="ah">
      <div className="ah__row">
        <span className="ah__logo"><img className="ah__logo-std" src="/logo.png" alt="" /><img className="ah__logo-deck" src="/logo-deck-light.png" alt="" /></span>
        <span className="ah__me">R</span>
      </div>
      <p className="ah__title">{title}</p>
      {sub && <p className="ah__sub">{sub}</p>}
      <div className="ah__steps" aria-hidden="true">{[0, 1, 2, 3].map((k) => <i key={k} className={k <= step ? 'on' : ''} />)}</div>
    </div>
  )
}

const PHONE_PLATFORMS = ['TikTok', 'Instagram', 'YouTube']
const CHECKS = ['Product shown in first 3s', 'Brand tagged in caption', '#ad label added']

function Screen({ step, s, set, next }) {
  if (step === 0) {
    const est = Math.max(2, Math.round(s.budget / 1200)) * Math.max(1, s.markets.length)
    return (
      <div className="scr scr--brief">
        <AppHead title="New brief" sub="Step 1 of 4 · Draft" step={0} />
        <div className="pc">
          <span className="pc__thumb"><span>SPF</span></span>
          <span className="pc__txt"><b>Sunscreen SPF50</b><small>Skincare · 50ml</small></span>
          <span className="pc__edit">Edit</span>
        </div>
        <div className="fld">
          <span className="fld__lbl">Platforms</span>
          <div className="tg">
            {PHONE_PLATFORMS.map((p) => {
              const on = s.platforms.includes(p)
              return (
                <button type="button" key={p} className={on ? 'on' : ''} aria-pressed={on}
                  onClick={() => set({ platforms: on ? s.platforms.filter((x) => x !== p) : [...s.platforms, p] })}>
                  <PlatformIcon name={p} size={14} />{p}
                </button>
              )
            })}
          </div>
        </div>
        <div className="fld">
          <span className="fld__lbl">Markets</span>
          <div className="tg">
            {PHONE_MARKETS.map(([id, name]) => {
              const on = s.markets.includes(id)
              return (
                <button type="button" key={id} className={on ? 'on' : ''} aria-pressed={on}
                  onClick={() => set({ markets: on ? s.markets.filter((x) => x !== id) : [...s.markets, id] })}>
                  <Flag market={id} />{name}
                </button>
              )
            })}
          </div>
        </div>
        <div className="fld">
          <span className="fld__lbl">Budget <b>{money(s.budget)}</b></span>
          <input type="range" min="1000" max="30000" step="500" value={s.budget} className="scr__slider"
            style={{ '--p': `${((s.budget - 1000) / 29000) * 100}%` }}
            onChange={(e) => set({ budget: Number(e.target.value) })} aria-label="Budget" />
        </div>
        <div className="foot">
          <span className="foot__note">About {est} creators fit this budget</span>
          <button type="button" className="scr__btn" onClick={next} disabled={s.markets.length === 0 || s.platforms.length === 0}>
            {s.markets.length === 0 ? 'Pick a market' : 'Send brief'}
          </button>
        </div>
      </div>
    )
  }

  if (step === 1) {
    const list = SHORT.filter((c) => s.filter === 'All' || c.platform === s.filter)
    const picked = SHORT.filter((c) => s.picked.includes(c.handle))
    return (
      <div className="scr">
        <AppHead title="Shortlist" sub="Vietnam · Indonesia" step={1} />
        <div className="seg2">
          {['All', 'TikTok', 'Instagram', 'YouTube'].map((f) => (
            <button type="button" key={f} className={s.filter === f ? 'on' : ''} onClick={() => set({ filter: f })} aria-label={f}>
              {f === 'All' ? 'All' : <PlatformIcon name={f} size={13} />}
            </button>
          ))}
        </div>
        <div className="list">
          {list.length === 0 && <p className="list__empty">No creators on this platform yet.</p>}
          {list.map((c, k) => {
            const on = s.picked.includes(c.handle)
            return (
              <button type="button" className={`scr__row ${on ? 'is-on' : ''}`} key={c.handle} style={{ animationDelay: `${k * 70}ms` }}
                onClick={() => set({ picked: on ? s.picked.filter((x) => x !== c.handle) : [...s.picked, c.handle] })} aria-pressed={on}>
                <span className="scr__av">{c.name[0]}<span className="scr__avflag"><Flag market={c.market} /></span></span>
                <span className="scr__who">
                  <b>@{c.handle}</b>
                  <small><PlatformIcon name={c.platform} size={10} /> {c.followers} · {c.cat}</small>
                  <em>from {localRate(minUsd(c.rate), c.market)}</em>
                </span>
                <span className={`scr__tick ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
              </button>
            )
          })}
        </div>
        <div className="foot foot--row">
          <span className="stackav">{picked.map((c) => <i key={c.handle}>{c.name[0]}</i>)}</span>
          <button type="button" className="scr__btn" onClick={next} disabled={picked.length === 0}>
            {picked.length === 0 ? 'Pick creators' : `Approve ${picked.length}`}
          </button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    const done = s.checks.filter(Boolean).length
    return (
      <div className="scr">
        <AppHead title="Content review" sub="@bao.an.eats · Draft 2" step={2} />
        <div className="vid">
          <span className="vid__plat"><PlatformIcon name="TikTok" size={11} mono /> TikTok</span>
          {s.review === 'ok' && <span className="vid__ok">✓ Approved</span>}
          <span className="vid__play" />
          <span className="vid__rail"><i /><i /><i /></span>
          <span className="vid__cap"><b>@bao.an.eats</b>Ăn thử bánh mì ngon nhất Sài Gòn ☀️</span>
          <span className="vid__bar"><i /></span>
        </div>
        <ul className="chk">
          {CHECKS.map((t, k) => (
            <li key={t}>
              <button type="button" className={s.checks[k] ? 'on' : ''} aria-pressed={s.checks[k]}
                onClick={() => set({ checks: s.checks.map((v, i) => (i === k ? !v : v)) })}>
                <span>{s.checks[k] ? '✓' : ''}</span>{t}
              </button>
            </li>
          ))}
        </ul>
        {s.review === 'changes' && <p className="scr__status">Feedback sent to @bao.an.eats</p>}
        <div className="scr__actions">
          <button type="button" className="scr__btn ghost" onClick={() => set({ review: 'changes' })}>Changes</button>
          <button type="button" className="scr__btn" disabled={done < CHECKS.length} onClick={() => { set({ review: 'ok' }); setTimeout(next, 1400) }}>
            {done < CHECKS.length ? `${done}/${CHECKS.length} checked` : 'Approve'}
          </button>
        </div>
      </div>
    )
  }

  const data = REPORT[s.rMarket][s.metric]
  const max = Math.max(...data)
  const KPI = { Views: ['1.2M', '+18%'], Clicks: ['38.4K', '+11%'], Sales: ['2,140', '+24%'] }
  const pts = data.map((v, k) => [k * (100 / 6), 38 - (v / max) * 32])
  const line = pts.map(([x, y], k) => `${k ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const vnShare = Math.round((REPORT.vn[s.metric].reduce((a, b) => a + b, 0) /
    (REPORT.vn[s.metric].reduce((a, b) => a + b, 0) + REPORT.id[s.metric].reduce((a, b) => a + b, 0))) * 100)
  const TOP = [
    ['dapurnadia', 'id', 'TikTok', { Views: '420K', Clicks: '14.2K', Sales: '860' }],
    ['bao.an.eats', 'vn', 'TikTok', { Views: '310K', Clicks: '9.8K', Sales: '540' }],
    ['rizky.jalan', 'id', 'Instagram', { Views: '180K', Clicks: '6.1K', Sales: '310' }],
  ]
  return (
    <div className="scr">
      <AppHead title="Report" sub="Sample campaign · 4 weeks" step={3} />
      <div className="kpis">
        {['Views', 'Clicks', 'Sales'].map((m) => (
          <button type="button" key={m} className={s.metric === m ? 'on' : ''} onClick={() => set({ metric: m })}>
            <small>{m}</small><b>{KPI[m][0]}</b><em>{KPI[m][1]}</em>
          </button>
        ))}
      </div>
      <div className="area">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          {[10, 20, 30].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} />)}
          <path className="area__fill" d={`${line} L100,40 L0,40 Z`} />
          <path className="area__line" d={line} />
        </svg>
        <span className="area__dot" style={{ left: '100%', top: `${(pts[6][1] / 40) * 100}%` }} />
        <div className="chart__x">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, k) => <span key={k}>{d}</span>)}</div>
      </div>
      <div className="mix" role="group" aria-label="Market split">
        <div className="mix__bar"><i style={{ width: `${vnShare}%` }} /></div>
        <div className="mix__legend">
          <button type="button" className={s.rMarket === 'vn' ? 'on' : ''} onClick={() => set({ rMarket: 'vn' })}><Flag market="vn" />Vietnam <b>{vnShare}%</b></button>
          <button type="button" className={s.rMarket === 'id' ? 'on' : ''} onClick={() => set({ rMarket: 'id' })}><Flag market="id" />Indonesia <b>{100 - vnShare}%</b></button>
        </div>
      </div>
      <p className="sect">Top creators</p>
      <ul className="topc">
        {TOP.map(([h, mk, pl, v], k) => (
          <li key={h}>
            <span className="topc__n">{k + 1}</span>
            <span className="topc__av">{h[0].toUpperCase()}<span className="scr__avflag"><Flag market={mk} /></span></span>
            <span className="topc__h"><PlatformIcon name={pl} size={10} />@{h}</span>
            <b>{v[s.metric]}</b>
          </li>
        ))}
      </ul>
    </div>
  )
}

const INITIAL = { markets: ['vn', 'id'], platforms: ['TikTok', 'Instagram'], budget: 8000, picked: [], filter: 'All', checks: [true, true, false], review: null, rMarket: 'vn', metric: 'Views' }

export function Process() {
  const reduced = useReduced()
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const [touched, setTouched] = useState(false)
  const [s, setS] = useState(INITIAL)
  const userActed = useRef(false)

  const set = (patch) => setS((p) => ({ ...p, ...patch }))
  const idle = useRef(null)
  const touch = () => {
    userActed.current = true
    setTouched(true)
    clearTimeout(idle.current)
    idle.current = setTimeout(() => setTouched(false), 12000)
  }
  useEffect(() => () => clearTimeout(idle.current), [])
  const userSet = (patch) => { touch(); set(patch) }
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
      set({ review: null, checks: [true, true, false] })
      const a = setTimeout(() => set({ checks: [true, true, true] }), 1300)
      const b = setTimeout(() => set({ review: 'ok' }), 2800)
      return () => { clearTimeout(a); clearTimeout(b) }
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
        <Head label="Process" title="How a campaign|runs" layout="split">Four steps. Tap the phone to try each one.</Head>
        <div className="tour">
          <div className="tour__left">
            <ol className="tl">
              {STEPS.map((st, k) => (
                <li key={st.t} className={k === step ? 'is-on' : k < step ? 'is-done' : ''}>
                  <button type="button" onClick={() => goto(k)} aria-pressed={k === step}>
                    <span className="tl__dot">
                      {k < step ? <Check /> : k + 1}
                      {k === step && !touched && !reduced && (
                        <svg className="tl__ring" viewBox="0 0 36 36" aria-hidden="true">
                          <circle key={`${step}-${paused}`} cx="18" cy="18" r="16" style={{ animationDuration: `${STEP_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
                        </svg>
                      )}
                    </span>
                    <span className="tl__body">
                      <span className="tl__t">{st.t}</span>
                      <span className="tl__d">{st.d}</span>
                      <span className="tl__who">
                        <span><b>You</b>{st.you}</span>
                        <span><b>We</b>{st.we}</span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="tour__cta">
              <a className="btn btn--shine" href="#contact">Start a campaign <Arrow /></a>
              <span>{touched ? 'You’re driving. It carries on by itself in a moment.' : 'Playing on its own. Tap the phone to take over.'}</span>
            </div>
          </div>
          <div className="tour__stage">
            <div className="tour__glow" />
            <div className="phone2" onPointerDown={touch} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              <div className="phone2__notch" />
              <div className="phone2__screen">
                <div className="sbar" aria-hidden="true">
                  <span>9:41</span>
                  <span className="sbar__icons">
                    <svg width="16" height="10" viewBox="0 0 16 10"><rect x="0" y="6" width="3" height="4" rx="1" /><rect x="4.3" y="4" width="3" height="6" rx="1" /><rect x="8.6" y="2" width="3" height="8" rx="1" /><rect x="12.9" y="0" width="3" height="10" rx="1" /></svg>
                    <svg width="22" height="11" viewBox="0 0 22 11"><rect x="0.5" y="0.5" width="18" height="10" rx="3" fill="none" stroke="currentColor" /><rect x="2" y="2" width="13" height="7" rx="1.6" /><rect x="19.6" y="3.5" width="1.6" height="4" rx="0.8" /></svg>
                  </span>
                </div>
                <div className="scr-body" key={step}>
                  <Screen step={step} s={s} set={userSet} next={next} live={userActed} />
                </div>
                <nav className="tabbar" aria-label="App sections">
                  {[['Brief', 'M5 4h10l4 4v12H5zM14 4v4h4M8 12h8M8 16h6'], ['Creators', 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 0a2.5 2.5 0 1 0 0-5M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5M15 14c2.6 0 4.6 1.8 5.2 4.6'], ['Content', 'M4 5h16v14H4zM10 9.5v5l4.5-2.5z'], ['Report', 'M5 19V11M10 19V6M15 19v-5M20 19V9']].map(([t, d], k) => (
                    <button type="button" key={t} className={k === step ? 'on' : ''} onClick={() => { touch(); setStep(k) }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <small>{t}</small>
                    </button>
                  ))}
                </nav>
              </div>
              <span className="phone2__btn phone2__btn--a" /><span className="phone2__btn phone2__btn--b" /><span className="phone2__btn phone2__btn--c" />
            </div>
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
          <Eyebrow label="For creators" />
          <h2 className="hd__title">Get booked by brands <span className="it">in other countries</span></h2>
          <p>Set your rate in your own currency and get verified once. Brands from other markets can then find you, and we take care of the contract and the payment.</p>
          <ul className="ticks">
            <li><Check /> You set your own rate</li>
            <li><Check /> We write and send the contract</li>
            <li><Check /> We make sure you get paid</li>
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
              <span><small>Your starting rate</small><b>{localRate(rate, 'vn')}</b></span>
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
                  <span className="dash__amt">{localRate(amt, 'vn')}</span>
                  <span className={`dash__chip dash__chip--${st.toLowerCase()}`}>{st}</span>
                </li>
              ))}
            </ul>
          </div>
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
            <Eyebrow label="Start a campaign" />
            <h2 className="hd__title">Tell us about <span className="it">your launch</span></h2>

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
              <legend><span>3</span> Budget <em>{money(budget)}{budget >= 100000 ? '+' : ''}</em></legend>
              <input
                type="range" min="1000" max="100000" step="1000" value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="slider" style={{ '--p': `${pct}%` }} aria-label="Budget"
              />
              <div className="slider__scale"><span>{money(1000, { compact: true })}</span><span>{money(25000, { compact: true })}</span><span>{money(50000, { compact: true })}</span><span>{money(100000, { compact: true })}+</span></div>
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
                <p>Our team in {picked.map((id) => MARKETS.find((m) => m.id === id).city).join(', ') || 'your markets'} will reply with a shortlist and rates.</p>
                <button className="link" onClick={() => setSent(false)}>Edit brief</button>
              </div>
            ) : (
              <>
                <p className="summary__kicker">Your brief</p>
                <p className="summary__product">{product || 'Your product'}</p>
                <dl className="summary__rows">
                  <div><dt>Category</dt><dd>{cat}</dd></div>
                  <div><dt>Budget</dt><dd>{money(budget)}</dd></div>
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
                        <small className="summary__app"><PlatformIcon name={MARKET_INFO[id].watched[0]} size={12} mono />{MARKET_INFO[id].watched[0]}</small>
                      </li>
                    )
                  })}
                </ul>
                <p className="summary__label">What happens next</p>
                <ol className="summary__next">
                  <li><i>1</i><span>Our team in that market reads your brief</span></li>
                  <li><i>2</i><span>You get a shortlist with rates</span></li>
                  <li><i>3</i><span>You approve, then we launch</span></li>
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
