'use client'
// "How a campaign runs" — a four-step timeline next to a phone that plays the
// four screens on its own. Tap the phone (or a step) to take over; it carries on
// by itself after a pause. Ported from the earlier mockup onto the new tokens.
// Everything inside the phone is SAMPLE data.
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import '@/styles/sections.css'
import { href } from '@/data/site'
import { CREATORS, creatorByHandle } from '@/data/creators'
import { categoryBySlug } from '@/data/categories'
import { formatAmount } from '@/data/pricing'
import { compact, localMoney } from '@/lib/format'
import { Icon, Arrow, Flag, PlatformIcon } from '../Icon'
import { SectionHead } from '../ui'
import { useApp } from '../AppState'
import { track } from '@/lib/track'

const STEPS = [
  { t: 'Brief', d: 'Tell us the product, the markets and the budget.', you: 'Product, markets, budget', we: 'Read it with our team in each market' },
  { t: 'Shortlist', d: 'Our team in each market suggests creators who fit, with their rates.', you: 'Pick the creators you like', we: 'Suggest creators, with rates' },
  { t: 'Launch', d: 'You approve the content. We handle contracts, timing and posting.', you: 'Approve the content', we: 'Contracts, timing and posting' },
  { t: 'Learn', d: 'One report across every market, so you can see what actually sold.', you: 'See what sold', we: 'One report for every market' },
]
const STEP_MS = 6000
const PHONE_MARKETS: [string, string][] = [['vn', 'Vietnam'], ['id', 'Indonesia'], ['kr', 'Korea'], ['ph', 'Philippines']]
const PHONE_PLATFORMS = ['TikTok', 'Instagram', 'YouTube']
const CHECKS = ['Product shown in first 3s', 'Brand tagged in caption', '#ad label added']
// two food creators from each of Vietnam and Indonesia
const SHORT = [...CREATORS.filter((c) => c.market === 'vn' && c.category === 'food').slice(0, 2), ...CREATORS.filter((c) => c.market === 'id' && c.category === 'food').slice(0, 2)]
const REVIEW = creatorByHandle['vy.eats'] || SHORT[0]
const REPORT: Record<string, Record<string, number[]>> = {
  vn: { Views: [30, 46, 42, 64, 58, 80, 74], Clicks: [18, 26, 34, 30, 44, 52, 61], Sales: [8, 12, 15, 22, 26, 31, 38] },
  id: { Views: [22, 30, 38, 35, 50, 56, 68], Clicks: [12, 20, 22, 30, 28, 40, 47], Sales: [5, 9, 11, 14, 19, 23, 29] },
}
const KPI: Record<string, [string, string]> = { Views: ['1.2M', '+18%'], Clicks: ['38.4K', '+11%'], Sales: ['2,140', '+24%'] }
const TOP: [number, Record<string, string>][] = [[2, { Views: '420K', Clicks: '14.2K', Sales: '860' }], [0, { Views: '310K', Clicks: '9.8K', Sales: '540' }], [3, { Views: '180K', Clicks: '6.1K', Sales: '310' }]]
const TABS: [string, string][] = [['Brief', 'file'], ['Creators', 'users'], ['Content', 'film'], ['Report', 'chart']]

type S = { markets: string[]; platforms: string[]; budget: number; picked: string[]; filter: string; checks: boolean[]; review: null | 'ok' | 'changes'; rMarket: string; metric: string }
const INITIAL: S = { markets: ['vn', 'id'], platforms: ['TikTok', 'Instagram'], budget: 8000, picked: [], filter: 'All', checks: [true, true, false], review: null, rMarket: 'vn', metric: 'Views' }

function AppHead({ title, sub, step }: { title: string; sub: string; step: number }) {
  return (
    <div className="ph2-head">
      <div className="ph2-head__row">
        <img src="/logo-black.png" alt="" width={120} height={18} loading="lazy" />
        <span className="ph2-head__me">R</span>
      </div>
      <p className="ph2-head__title">{title}</p>
      <p className="ph2-head__sub">{sub}</p>
      <div className="ph2-head__steps" aria-hidden="true">{[0, 1, 2, 3].map((k) => <i key={k} className={k <= step ? 'on' : ''} />)}</div>
    </div>
  )
}

function Screen({ step, s, set, next }: { step: number; s: S; set: (p: Partial<S>) => void; next: () => void }) {
  const { currency } = useApp()
  if (step === 0) {
    const est = Math.max(2, Math.round(s.budget / 1200)) * Math.max(1, s.markets.length)
    return (
      <div className="ph2-scr">
        <AppHead title="New brief" sub="Step 1 of 4 · Draft" step={0} />
        <div className="ph2-prod">
          <span className="ph2-prod__thumb">SPF</span>
          <span className="ph2-prod__txt"><b>Sunscreen SPF50</b><small>Skincare · 50ml · sample</small></span>
          <span className="ph2-prod__edit">Edit</span>
        </div>
        <div className="ph2-fld">
          <span className="ph2-lbl">Platforms</span>
          <div className="ph2-tg">
            {PHONE_PLATFORMS.map((p) => {
              const on = s.platforms.includes(p)
              return <button type="button" key={p} className={on ? 'on' : ''} aria-pressed={on} onClick={() => set({ platforms: on ? s.platforms.filter((x) => x !== p) : [...s.platforms, p] })}><PlatformIcon name={p} size={14} />{p}</button>
            })}
          </div>
        </div>
        <div className="ph2-fld">
          <span className="ph2-lbl">Markets</span>
          <div className="ph2-tg">
            {PHONE_MARKETS.map(([id, name]) => {
              const on = s.markets.includes(id)
              return <button type="button" key={id} className={on ? 'on' : ''} aria-pressed={on} onClick={() => set({ markets: on ? s.markets.filter((x) => x !== id) : [...s.markets, id] })}><Flag market={id} />{name}</button>
            })}
          </div>
        </div>
        <div className="ph2-fld">
          <span className="ph2-lbl">Budget <b suppressHydrationWarning>{formatAmount(s.budget, currency)}</b></span>
          <input type="range" min={1000} max={30000} step={500} value={s.budget} className="ph2-slider" style={{ ['--p' as any]: `${((s.budget - 1000) / 29000) * 100}%` }} onChange={(e) => set({ budget: Number(e.target.value) })} aria-label="Budget" />
        </div>
        <div className="ph2-foot">
          <span className="ph2-foot__note">About {est} creators fit this budget</span>
          <button type="button" className="ph2-btn" onClick={next} disabled={!s.markets.length || !s.platforms.length}>{s.markets.length === 0 ? 'Pick a market' : 'Send brief'}</button>
        </div>
      </div>
    )
  }

  if (step === 1) {
    const list = SHORT.filter((c) => s.filter === 'All' || c.platforms.some((p) => p.platform === s.filter))
    const picked = SHORT.filter((c) => s.picked.includes(c.handle))
    return (
      <div className="ph2-scr">
        <AppHead title="Shortlist" sub="Vietnam · Indonesia" step={1} />
        <div className="ph2-seg">
          {['All', ...PHONE_PLATFORMS].map((f) => <button type="button" key={f} className={s.filter === f ? 'on' : ''} onClick={() => set({ filter: f })} aria-label={f} aria-pressed={s.filter === f}>{f === 'All' ? 'All' : <PlatformIcon name={f} size={13} />}</button>)}
        </div>
        <div className="ph2-rows">
          {list.length === 0 && <p className="ph2-empty">No creators on this platform yet.</p>}
          {list.map((c) => {
            const on = s.picked.includes(c.handle)
            return (
              <button type="button" className={`ph2-row ${on ? 'is-on' : ''}`} key={c.handle} aria-pressed={on} onClick={() => set({ picked: on ? s.picked.filter((x) => x !== c.handle) : [...s.picked, c.handle] })}>
                <span className="ph2-av">{c.name[0]}<span className="ph2-av__flag"><Flag market={c.market} /></span></span>
                <span className="ph2-who">
                  <b>@{c.handle}</b>
                  <small><PlatformIcon name={c.platforms[0].platform} size={10} /> {compact(c.followers)} · {categoryBySlug[c.category].label}</small>
                  <em>from {localMoney(c.rateLocal, c.currency)}</em>
                </span>
                <span className={`ph2-tick ${on ? 'on' : ''}`}>{on ? <Icon name="check" size={13} stroke={2.6} /> : null}</span>
              </button>
            )
          })}
        </div>
        <div className="ph2-foot ph2-foot--row">
          <span className="ph2-stack">{picked.map((c) => <i key={c.handle}>{c.name[0]}</i>)}</span>
          <button type="button" className="ph2-btn" onClick={next} disabled={!picked.length}>{picked.length ? `Approve ${picked.length}` : 'Pick creators'}</button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    const done = s.checks.filter(Boolean).length
    return (
      <div className="ph2-scr">
        <AppHead title="Content review" sub={`@${REVIEW.handle} · Draft 2`} step={2} />
        <div className="ph2-vid">
          <span className="ph2-vid__plat"><PlatformIcon name="TikTok" size={11} mono /> TikTok</span>
          {s.review === 'ok' && <span className="ph2-vid__ok"><Icon name="check" size={12} stroke={2.6} />Approved</span>}
          <span className="ph2-vid__play"><Icon name="play" size={18} stroke={0} className="pc__fill" /></span>
          <span className="ph2-vid__rail"><i /><i /><i /></span>
          <span className="ph2-vid__cap"><b>@{REVIEW.handle}</b>{REVIEW.caption}</span>
          <span className="ph2-vid__bar"><i /></span>
        </div>
        <ul className="ph2-chk">
          {CHECKS.map((t, k) => (
            <li key={t}>
              <button type="button" className={s.checks[k] ? 'on' : ''} aria-pressed={s.checks[k]} onClick={() => set({ checks: s.checks.map((v, i) => (i === k ? !v : v)) })}>
                <span>{s.checks[k] ? <Icon name="check" size={12} stroke={2.6} /> : null}</span>{t}
              </button>
            </li>
          ))}
        </ul>
        {s.review === 'changes' && <p className="ph2-status">Feedback sent to @{REVIEW.handle}</p>}
        <div className="ph2-actions">
          <button type="button" className="ph2-btn ghost" onClick={() => set({ review: 'changes' })}>Changes</button>
          <button type="button" className="ph2-btn" disabled={done < CHECKS.length} onClick={() => { set({ review: 'ok' }); setTimeout(next, 1400) }}>{done < CHECKS.length ? `${done}/${CHECKS.length} checked` : 'Approve'}</button>
        </div>
      </div>
    )
  }

  const data = REPORT[s.rMarket][s.metric]
  const max = Math.max(...data)
  const pts = data.map((v, k) => [k * (100 / 6), 38 - (v / max) * 32])
  const line = pts.map(([x, y], k) => `${k ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const sum = (a: number[]) => a.reduce((x, y) => x + y, 0)
  const vnShare = Math.round((sum(REPORT.vn[s.metric]) / (sum(REPORT.vn[s.metric]) + sum(REPORT.id[s.metric]))) * 100)
  return (
    <div className="ph2-scr">
      <AppHead title="Report" sub="Sample campaign · 4 weeks" step={3} />
      <div className="ph2-kpis">
        {['Views', 'Clicks', 'Sales'].map((m) => <button type="button" key={m} className={s.metric === m ? 'on' : ''} aria-pressed={s.metric === m} onClick={() => set({ metric: m })}><small>{m}</small><b>{KPI[m][0]}</b><em>{KPI[m][1]}</em></button>)}
      </div>
      <div className="ph2-area">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          {[10, 20, 30].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} />)}
          <path className="ph2-area__fill" d={`${line} L100,40 L0,40 Z`} />
          <path className="ph2-area__line" d={line} />
        </svg>
        <div className="ph2-area__x">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, k) => <span key={k}>{d}</span>)}</div>
      </div>
      <div className="ph2-mix" role="group" aria-label="Market split">
        <div className="ph2-mix__bar"><i style={{ width: `${vnShare}%` }} /></div>
        <div className="ph2-mix__legend">
          <button type="button" className={s.rMarket === 'vn' ? 'on' : ''} onClick={() => set({ rMarket: 'vn' })}><Flag market="vn" />Vietnam <b>{vnShare}%</b></button>
          <button type="button" className={s.rMarket === 'id' ? 'on' : ''} onClick={() => set({ rMarket: 'id' })}><Flag market="id" />Indonesia <b>{100 - vnShare}%</b></button>
        </div>
      </div>
      <p className="ph2-lbl">Top creators</p>
      <ul className="ph2-top">
        {TOP.map(([i, v], k) => {
          const c = SHORT[i] || SHORT[0]
          return (
            <li key={c.handle}>
              <span className="ph2-top__n">{k + 1}</span>
              <span className="ph2-av ph2-av--s">{c.name[0]}<span className="ph2-av__flag"><Flag market={c.market} /></span></span>
              <span className="ph2-top__h"><PlatformIcon name={c.platforms[0].platform} size={10} />@{c.handle}</span>
              <b>{v[s.metric]}</b>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function CampaignRuns({ lang }: { lang: string }) {
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const [touched, setTouched] = useState(false)
  const [reduced, setReduced] = useState(true) // no motion until we know the visitor allows it
  const [s, setS] = useState<S>(INITIAL)
  const idle = useRef<any>(null)

  const set = (patch: Partial<S>) => setS((p) => ({ ...p, ...patch }))
  const touch = () => { setTouched(true); clearTimeout(idle.current); idle.current = setTimeout(() => setTouched(false), 12000) }
  const userSet = (patch: Partial<S>) => { touch(); set(patch) }
  const userGoto = (k: number) => { touch(); setStep(k); if (k === 2) set({ review: null }); track('campaign_demo_step', { step: STEPS[k].t.toLowerCase() }) }
  const next = () => setStep((x) => { const n = Math.min(x + 1, STEPS.length - 1); if (n !== x) track('campaign_demo_step', { step: STEPS[n].t.toLowerCase() }); return n })

  useEffect(() => { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches); return () => clearTimeout(idle.current) }, [])

  // autoplay through the steps until the visitor touches the phone
  useEffect(() => {
    if (reduced || paused || touched) return
    const t = setTimeout(() => setStep((x) => (x + 1) % STEPS.length), STEP_MS)
    return () => clearTimeout(t)
  }, [step, paused, touched, reduced])

  // live demo on each screen while it plays on its own
  useEffect(() => {
    if (touched || reduced) return
    if (step === 1) {
      set({ picked: [] })
      const timers = SHORT.slice(0, 3).map((c, k) => setTimeout(() => setS((p) => (p.picked.includes(c.handle) ? p : { ...p, picked: [...p.picked, c.handle] })), 700 + k * 650))
      return () => timers.forEach(clearTimeout)
    }
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
  }, [step, touched, reduced])

  return (
    <div className="cr2">
      <SectionHead eyebrow="How we work" title="How a campaign|runs">Four steps. Tap the phone to try each one.</SectionHead>
      <div className="cr2-tour">
        <div className="cr2-left">
          <ol className="cr2-tl">
            {STEPS.map((st, k) => (
              <li key={st.t} className={k === step ? 'is-on' : k < step ? 'is-done' : ''}>
                <button type="button" onClick={() => userGoto(k)} aria-pressed={k === step} data-cta="campaign_demo_timeline">
                  <span className="cr2-dot">
                    {k < step ? <Icon name="check" size={20} stroke={2.6} /> : k + 1}
                    {k === step && !touched && !reduced && (
                      <svg className="cr2-ring" viewBox="0 0 36 36" aria-hidden="true">
                        <circle key={`${step}-${paused}`} cx="18" cy="18" r="16" style={{ animationDuration: `${STEP_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
                      </svg>
                    )}
                  </span>
                  <span className="cr2-body">
                    <span className="cr2-t">{st.t}</span>
                    <span className="cr2-d">{st.d}</span>
                    <span className="cr2-who"><span><b>You</b>{st.you}</span><span><b className="we">We</b>{st.we}</span></span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="cr2-cta">
            <Link className="btn" href={href(lang, '/about-agency#inquiry')} data-cta="campaign_demo_explore_options" prefetch={false}>Explore your campaign options<Arrow /></Link>
            <span>{touched ? 'You’re driving. It carries on by itself in a moment.' : 'Playing on its own. Tap the phone to take over.'}</span>
          </div>
        </div>

        <div className="cr2-stage">
          <div className="ph2" onPointerDown={touch} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div className="ph2__notch" />
            <div className="ph2__screen">
              <div className="ph2-sbar" aria-hidden="true">
                <span>9:41</span>
                <span>
                  <svg width="16" height="10" viewBox="0 0 16 10"><rect x="0" y="6" width="3" height="4" rx="1" /><rect x="4.3" y="4" width="3" height="6" rx="1" /><rect x="8.6" y="2" width="3" height="8" rx="1" /><rect x="12.9" y="0" width="3" height="10" rx="1" /></svg>
                  <svg width="22" height="11" viewBox="0 0 22 11"><rect x="0.5" y="0.5" width="18" height="10" rx="3" fill="none" stroke="currentColor" /><rect x="2" y="2" width="13" height="7" rx="1.6" /><rect x="19.6" y="3.5" width="1.6" height="4" rx="0.8" /></svg>
                </span>
              </div>
              <div className="ph2-body" key={step}><Screen step={step} s={s} set={userSet} next={next} /></div>
              <nav className="ph2-tabs" aria-label="App sections">
                {TABS.map(([t, ic], k) => (
                  <button type="button" key={t} className={k === step ? 'on' : ''} aria-pressed={k === step} onClick={() => userGoto(k)}><Icon name={ic} size={20} /><small>{t}</small></button>
                ))}
              </nav>
            </div>
            <span className="ph2__btn ph2__btn--a" /><span className="ph2__btn ph2__btn--b" /><span className="ph2__btn ph2__btn--c" />
          </div>
        </div>
      </div>
    </div>
  )
}
