import { useEffect, useRef, useState } from 'react'
import { MARKETS, MARKET_INFO, PLATFORM_COLORS, CREATORS } from './data.js'
import { MAP_DOTS, MAP_VIEW } from './mapDots.js'

const fmt = (date, tz, opts) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, ...opts }).format(date)

function useReduced() {
  const [r, setR] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setR(mq.matches)
  }, [])
  return r
}

/* ============================================================
   Market map — Pacific-centred dotted map with live pins
   ============================================================ */
const W = MAP_VIEW.lon1 - MAP_VIEW.lon0
const H = MAP_VIEW.lat0 - MAP_VIEW.lat1
const project = (lat, lon) => [(lon < 0 ? lon + 360 : lon) - MAP_VIEW.lon0, MAP_VIEW.lat0 - lat]

export function MarketMap() {
  const reduced = useReduced()
  const [active, setActive] = useState('vn')
  const touched = useRef(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => {
      if (touched.current) return
      setActive((a) => MARKETS[(MARKETS.findIndex((m) => m.id === a) + 1) % MARKETS.length].id)
    }, 4200)
    return () => clearInterval(t)
  }, [reduced])

  const pick = (id) => { touched.current = true; setActive(id) }
  const m = MARKETS.find((x) => x.id === active)
  const info = MARKET_INFO[active]
  const [ax, ay] = project(info.lat, info.lon)

  return (
    <div className="mmap">
      <div className="mmap__stage">
        <svg viewBox={`0 0 ${W} ${H}`} className="mmap__svg" role="img" aria-label="Map of MegaEvolution markets across Asia and the US">
          <g className="mmap__dots">
            {MAP_DOTS.map(([x, y], k) => <circle key={k} cx={x} cy={y} r="0.48" />)}
          </g>
          <g className="mmap__arcs">
            {MARKETS.filter((x) => x.id !== active).map((x) => {
              const i = MARKET_INFO[x.id]
              const [bx, by] = project(i.lat, i.lon)
              const mx = (ax + bx) / 2
              const my = Math.min(ay, by) - Math.abs(bx - ax) * 0.22 - 3
              return <path key={x.id} d={`M${ax},${ay} Q${mx},${my} ${bx},${by}`} />
            })}
          </g>
          {MARKETS.map((x) => {
            const i = MARKET_INFO[x.id]
            const [px, py] = project(i.lat, i.lon)
            const on = x.id === active
            return (
              <g
                key={x.id}
                className={`pin ${on ? 'is-on' : ''}`}
                transform={`translate(${px} ${py})`}
                onMouseEnter={() => pick(x.id)}
                onClick={() => pick(x.id)}
                tabIndex={0}
                role="button"
                aria-label={`${x.country}`}
                onFocus={() => pick(x.id)}
              >
                <circle className="pin__pulse" r="2.4" />
                <circle className="pin__hit" r="4" />
                <circle className="pin__dot" r="1.15" />
                <text className="pin__label" x={['id', 'vn', 'us'].includes(x.id) ? -2.2 : 2.2} y={x.id === 'vn' ? 3.6 : x.id === 'us' ? 4 : -2} textAnchor={['id', 'vn', 'us'].includes(x.id) ? 'end' : 'start'}>
                  {x.short || x.city}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="mmap__tabs" role="tablist" aria-label="Markets">
          {MARKETS.map((x) => (
            <button key={x.id} role="tab" aria-selected={x.id === active} className={x.id === active ? 'is-on' : ''} onClick={() => pick(x.id)}>
              {x.country}
            </button>
          ))}
        </div>
      </div>

      <article className="mcard2" key={active} aria-live="polite">
        <header>
          <span className="mcard2__code">{info.code}</span>
          <h3>{m.country}</h3>
          <span className="mcard2__time">{fmt(now, m.tz, { hour: '2-digit', minute: '2-digit' })} in {m.short || m.city}</span>
        </header>
        <dl>
          <div><dt>Team</dt><dd>{info.team}</dd></div>
          <div><dt>Language</dt><dd>{m.langs}</dd></div>
          <div>
            <dt>Most watched</dt>
            <dd className="pills">
              {info.watched.map((p, k) => (
                <span key={p} className="pill2"><small>{k + 1}</small><i style={{ background: PLATFORM_COLORS[p] || '#999' }} />{p}</span>
              ))}
            </dd>
          </div>
          <div>
            <dt>Where they buy</dt>
            <dd className="pills">{info.buy.map((b) => <span key={b} className="pill2">{b}</span>)}</dd>
          </div>
          <div>
            <dt>Strongest</dt>
            <dd className="pills">{m.strong.map((c) => <span key={c} className="pill2 pill2--soft">{c}</span>)}</dd>
          </div>
        </dl>
        <p className="mcard2__hint">Hover or tap any market.</p>
      </article>
    </div>
  )
}

/* ============================================================
   Hero floaters — small UI moments around the collage
   ============================================================ */
export function HeroFloaters() {
  const c = CREATORS[3]
  return (
    <>
      <div className="float float--live" aria-hidden="true">
        <i /> Live in 6 markets
      </div>
      <div className="float float--profile" aria-hidden="true">
        <span className="float__avatar">{c.name[0]}</span>
        <span className="float__who">
          <b>@{c.handle}</b>
          <small>{c.cat} · Seoul</small>
        </span>
        <span className="float__rate">
          <b>{c.followers}</b>
          <small>from ${c.rate}</small>
        </span>
      </div>
      <div className="float float--toast" aria-hidden="true">
        <span className="float__check">✓</span>
        <span><b>Shortlist ready</b><small>Food creators · Saigon</small></span>
      </div>
    </>
  )
}

/* ============================================================
   Platform strip
   ============================================================ */
export function PlatformStrip() {
  const list = ['TikTok', 'YouTube', 'Instagram', 'Facebook', 'LINE', 'Naver', 'X']
  return (
    <section className="platforms" aria-label="Platforms our creators publish on">
      <div className="wrap platforms__inner">
        <span className="platforms__label">Campaigns run on</span>
        <ul>
          {list.map((p) => (
            <li key={p} style={{ '--pc': PLATFORM_COLORS[p] }}>{p}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ============================================================
   Process story — sticky phone whose screen follows the scroll
   ============================================================ */
const STEPS = [
  ['Brief', 'Tell us the product, the markets and the budget. Ten minutes, in English.'],
  ['Shortlist', 'Our team in each market suggests creators who fit — with rates, before any calls.'],
  ['Launch', 'You approve creators and content. We handle contracts, timing and posting.'],
  ['Learn', 'One report across every market, so you can see what actually sold.'],
]

function Screen({ step }) {
  if (step === 0)
    return (
      <div className="scr">
        <p className="scr__title">New brief</p>
        <label className="scr__field"><small>Product</small><span>Sunscreen SPF50, 50ml</span></label>
        <div className="scr__field"><small>Markets</small><span className="scr__chips"><b>Vietnam</b><b>Indonesia</b><b className="ghost">+</b></span></div>
        <div className="scr__field"><small>Budget</small><span className="scr__range"><i /></span><span className="scr__mono">USD 8,000</span></div>
        <div className="scr__field"><small>Timing</small><span>Launch in March</span></div>
        <span className="scr__btn">Send brief</span>
      </div>
    )
  if (step === 1)
    return (
      <div className="scr">
        <p className="scr__title">Shortlist · Vietnam</p>
        {CREATORS.filter((c) => ['vn', 'id'].includes(c.market)).slice(0, 4).map((c, k) => (
          <div className="scr__row" key={c.handle}>
            <span className="scr__av">{c.name[0]}</span>
            <span className="scr__who"><b>@{c.handle}</b><small>{c.followers} · {c.cat}</small></span>
            <span className="scr__mono">${c.rate}</span>
            <span className={`scr__tick ${k < 3 ? 'on' : ''}`}>{k < 3 ? '✓' : ''}</span>
          </div>
        ))}
        <span className="scr__btn">Approve 3 creators</span>
      </div>
    )
  if (step === 2)
    return (
      <div className="scr">
        <p className="scr__title">Content review</p>
        <div className="scr__video"><span className="scr__play" /><small>@bao.an.eats · draft 2</small></div>
        <p className="scr__caption">“Ăn thử bánh mì ngon nhất Sài Gòn — with SPF that survives the heat”</p>
        <div className="scr__actions"><span className="scr__btn">Approve</span><span className="scr__btn ghost">Request changes</span></div>
        <p className="scr__note">Posting Fri · 19:00 local</p>
      </div>
    )
  return (
    <div className="scr">
      <p className="scr__title">Campaign report <small className="scr__sample">sample</small></p>
      <div className="scr__bars">{[30, 46, 42, 64, 58, 80, 74].map((v, k) => <i key={k} style={{ height: `${v}%` }} />)}</div>
      <div className="scr__split">
        <span><small>Vietnam</small><b>58%</b></span>
        <span><small>Indonesia</small><b>42%</b></span>
      </div>
      <div className="scr__row scr__row--plain"><small>Top creator</small><b>@dapurnadia</b></div>
    </div>
  )
}

export function ProcessStory() {
  const [step, setStep] = useState(0)
  const refs = useRef([])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setStep(Number(e.target.dataset.i))),
      { rootMargin: '-45% 0px -45% 0px' }
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="story">
      <ol className="story__steps">
        {STEPS.map(([t, d], k) => (
          <li key={t} ref={(el) => (refs.current[k] = el)} data-i={k} className={k === step ? 'is-on' : ''}>
            <span className="story__n">0{k + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </li>
        ))}
      </ol>
      <div className="story__device" aria-hidden="true">
        <div className="phone">
          <div className="phone__notch" />
          <div className="phone__screen" key={step}><Screen step={step} /></div>
          <div className="phone__dots">{STEPS.map((_, k) => <i key={k} className={k === step ? 'on' : ''} />)}</div>
        </div>
      </div>
    </div>
  )
}
