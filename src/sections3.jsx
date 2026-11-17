import { useEffect, useMemo, useState } from 'react'
import { MARKETS, MARKET_INFO, CATEGORIES, CREATORS, PLATFORM_COLORS, localRate, minUsd } from './data.js'
import { MAP_DOTS, MAP_VIEW } from './mapDots.js'
import { Head } from './head.jsx'
import { PlatformIcon } from './platformIcon.jsx'

const fmt = (date, tz, opts) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, ...opts }).format(date)
const marketById = Object.fromEntries(MARKETS.map((m) => [m.id, m]))
const TONE = { clay: 'clay', saffron: 'butter', forest: 'forest', sage: 'sage', night: 'ink', sand: 'sand' }

function useReduced() {
  const [r, setR] = useState(false)
  useEffect(() => setR(window.matchMedia('(prefers-reduced-motion: reduce)').matches), [])
  return r
}
function useNow(ms) {
  const [n, setN] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setN(new Date()), ms)
    return () => clearInterval(t)
  }, [ms])
  return n
}
function Arrow({ dir = 'ne' }) {
  const d = { ne: 'M3 11 11 3M5 3h6v6', e: 'M1 7h12M8 2l5 5-5 5', w: 'M13 7H1M6 2 1 7l5 5' }[dir]
  return (
    <svg className="arrow" width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" />
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
   02 · Creators — spotlight + reel grid
   ============================================================ */
const PER_PAGE = 6
const SPOT_MS = 4500

export function Creators() {
  const reduced = useReduced()
  const [cat, setCat] = useState('All')
  const list = useMemo(() => CREATORS.filter((c) => cat === 'All' || c.cat === cat), [cat])
  const [active, setActive] = useState(0)
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE))

  useEffect(() => { setActive(0); setPage(0) }, [cat])
  useEffect(() => {
    if (reduced || paused || list.length < 2) return
    const t = setTimeout(() => {
      const next = (active + 1) % list.length
      setActive(next)
      setPage(Math.floor(next / PER_PAGE))
    }, SPOT_MS)
    return () => clearTimeout(t)
  }, [active, paused, reduced, list.length])

  const c = list[active] || list[0]
  const m = c && marketById[c.market]
  const visible = list.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  return (
    <section className="cx" id="creators">
      <div className="wrap">
        <Head label="Creators" title="Creators on MegaEvolution" layout="split">
          Each creator shows a starting rate in their own currency. Tap one to see more.
        </Head>
        <div className="cx__filters" role="group" aria-label="Category">
          {['All', ...CATEGORIES].map((x) => (
            <button key={x} className={x === cat ? 'is-on' : ''} onClick={() => setCat(x)}>
              {x}{x !== 'All' && <small>{CREATORS.filter((k) => k.cat === x).length}</small>}
            </button>
          ))}
        </div>

        {c && (
          <div className="cx__layout" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <article className="spot" key={c.handle}>
              <div className={`spot__media tone-${TONE[c.tone] || 'sand'}`}>
                {c.img && <img src={c.img} alt={`${c.name}, ${c.cat} creator in ${m.city}`} />}
                <span className="spot__plat"><PlatformIcon name={c.platform} />{c.platform}</span>
                <span className="spot__live">Featured</span>
                <div className="spot__over">
                  <p className="spot__caption">“{c.caption}”</p>
                </div>
              </div>
              <div className="spot__body">
                <div className="spot__who">
                  <span className="spot__av">{c.name[0]}</span>
                  <div>
                    <h3>{c.name} <Verified /></h3>
                    <p>@{c.handle} · {m.city}</p>
                  </div>
                </div>
                <dl className="spot__stats">
                  <div><dt>Followers</dt><dd>{c.followers}</dd></div>
                  <div><dt>From</dt><dd>{localRate(minUsd(c.rate), c.market)}</dd></div>
                  <div><dt>Market</dt><dd>{MARKET_INFO[c.market].code}</dd></div>
                </dl>
                <div className="spot__tags">
                  <span>{c.cat}</span><span>{c.platform}</span><span>{m.langs.split(',')[0]}</span>
                </div>
                <div className="spot__cta">
                  <a className="btn btn--shine" href="#contact">Request {c.name.split(' ')[0]} <Arrow /></a>
                  <button className="spot__save" aria-label="Save creator">
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                  </button>
                </div>
              </div>
            </article>

            <div className="reels">
              <div className="reels__grid">
                {visible.map((x, k) => {
                  const idx = page * PER_PAGE + k
                  const on = idx === active
                  const xm = marketById[x.market]
                  return (
                    <button
                      key={x.handle}
                      className={`reel ${on ? 'is-on' : ''}`}
                      onClick={() => setActive(idx)}
                      aria-pressed={on}
                      aria-label={`${x.name}, ${x.cat}, ${xm.city}`}
                    >
                      <span className={`reel__media tone-${TONE[x.tone] || 'sand'}`}>
                        {x.img && <img src={x.img} alt="" />}
                      </span>
                      <span className="reel__top">
                        <span className="reel__plat"><PlatformIcon name={x.platform} size={12} />{x.platform}</span>
                        <span className="reel__rate">{localRate(minUsd(x.rate), x.market)}+</span>
                      </span>
                      <span className="reel__bottom">
                        <b>@{x.handle}</b>
                        <small>{x.followers} · {xm.short || xm.city}</small>
                      </span>
                      <span className="reel__bar">
                        {on && <i key={`${idx}-${paused}`} style={{ animationDuration: `${SPOT_MS}ms`, animationPlayState: paused || reduced ? 'paused' : 'running' }} />}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="reels__nav">
                <span>{String(active + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span>
                <div className="reels__dots">
                  {Array.from({ length: pages }, (_, k) => <i key={k} className={k === page ? 'on' : ''} />)}
                </div>
                <div className="car__btns">
                  <button aria-label="Previous creators" onClick={() => setPage((p) => (p - 1 + pages) % pages)}><Arrow dir="w" /></button>
                  <button aria-label="Next creators" onClick={() => setPage((p) => (p + 1) % pages)}><Arrow dir="e" /></button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/* ============================================================
   04 · Markets — immersive map panel
   ============================================================ */
const W = MAP_VIEW.lon1 - MAP_VIEW.lon0
const H = MAP_VIEW.lat0 - MAP_VIEW.lat1
const project = (lat, lon) => [(lon < 0 ? lon + 360 : lon) - MAP_VIEW.lon0, MAP_VIEW.lat0 - lat]

export function Markets() {
  const reduced = useReduced()
  const now = useNow(1000)
  const [active, setActive] = useState('vn')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (reduced || touched) return
    const t = setInterval(() => setActive((a) => MARKETS[(MARKETS.findIndex((x) => x.id === a) + 1) % MARKETS.length].id), 4500)
    return () => clearInterval(t)
  }, [reduced, touched])

  const pick = (id) => { setTouched(true); setActive(id) }
  const m = marketById[active]
  const info = MARKET_INFO[active]
  const [ax, ay] = project(info.lat, info.lon)

  return (
    <section className="mx" id="markets">
      <div className="wrap">
        <Head label="Markets" title="Where our teams are">
          Some of the cities we work in. Pick one to see which apps people use and where they shop.
        </Head>

        <div className="mx__panel">
          <div className="mx__map">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Map of MegaEvolution markets">
              <g className="mx__dots">{MAP_DOTS.map(([x, y], k) => <circle key={k} cx={x} cy={y} r="0.46" />)}</g>
              <g className="mx__arcs">
                {MARKETS.filter((x) => x.id !== active).map((x) => {
                  const i = MARKET_INFO[x.id]
                  const [bx, by] = project(i.lat, i.lon)
                  const my = Math.min(ay, by) - Math.abs(bx - ax) * 0.22 - 3
                  return <path key={x.id} d={`M${ax},${ay} Q${(ax + bx) / 2},${my} ${bx},${by}`} />
                })}
              </g>
              {MARKETS.map((x) => {
                const i = MARKET_INFO[x.id]
                const [px, py] = project(i.lat, i.lon)
                const left = ['id', 'vn', 'us'].includes(x.id)
                return (
                  <g key={x.id} className={`mpin ${x.id === active ? 'is-on' : ''}`} transform={`translate(${px} ${py})`}
                    onMouseEnter={() => pick(x.id)} onClick={() => pick(x.id)} role="button" tabIndex={0} aria-label={x.country} onFocus={() => pick(x.id)}>
                    <circle className="mpin__pulse" r="2.4" />
                    <circle className="mpin__hit" r="4" />
                    <circle className="mpin__dot" r="1.1" />
                    <text x={left ? -2.2 : 2.2} y={x.id === 'vn' ? 3.6 : x.id === 'us' ? 4 : -2} textAnchor={left ? 'end' : 'start'}>{x.short || x.city}</text>
                  </g>
                )
              })}
            </svg>

            <article className="mx__card" key={active} aria-live="polite">
              <header>
                <span className="mx__code">{info.code}</span>
                <div>
                  <h3>{m.country}</h3>
                  <small>{m.city} · {m.langs}</small>
                </div>
              </header>
              <div className="mx__row">
                <span className="mx__label">Most watched</span>
                <ol className="mx__rank">
                  {info.watched.map((p, k) => (
                    <li key={p}><small>{k + 1}</small><PlatformIcon name={p} size={13} />{p}</li>
                  ))}
                </ol>
              </div>
              <div className="mx__row">
                <span className="mx__label">Where they buy</span>
                <div className="mx__chips">{info.buy.map((b) => <span key={b}>{b}</span>)}</div>
              </div>
              <div className="mx__row mx__row--split">
                <span><span className="mx__label">Strongest</span><b>{m.strong.join(' · ')}</b></span>
              </div>
            </article>
          </div>

          <div className="mx__rail" role="tablist" aria-label="Markets">
            {MARKETS.map((x) => {
              const i = MARKET_INFO[x.id]
              const h = Number(fmt(now, x.tz, { hour: '2-digit', hour12: false }))
              return (
                <button key={x.id} role="tab" aria-selected={x.id === active} className={`mx__tab ${x.id === active ? 'is-on' : ''}`} onClick={() => pick(x.id)}>
                  <span className="mx__tabtop">
                    <b>{i.code}</b>
                    <span className={`mx__dot ${h >= 8 && h < 23 ? 'day' : 'night'}`} />
                  </span>
                  <span className="mx__city">{x.short || x.city}</span>
                  <span className="mx__time">{fmt(now, x.tz, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  <span className="mx__plats">{i.watched.slice(0, 3).map((p) => <PlatformIcon key={p} name={p} size={13} />)}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
