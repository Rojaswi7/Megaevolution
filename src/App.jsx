import { cloneElement, useEffect, useMemo, useRef, useState } from 'react'
import { MARKETS, CATEGORIES, CREATORS, MEDIA } from './data.js'
import { MarketMap, HeroFloaters } from './extras.jsx'
import { Creators as Creators3, Markets as Markets3 } from './sections3.jsx'
import { Head as Head2 } from './head.jsx'
import { About as About2, Process as Process2, ForCreators as ForCreators2, Contact as Contact2 } from './sections2.jsx'

const SITE = 'https://www.megaevolution.io'
const marketById = Object.fromEntries(MARKETS.map((m) => [m.id, m]))

/* ---------- hooks ---------- */

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = (e) => setReduced(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

const fmt = (date, tz, opts) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, ...opts }).format(date)

function Arrow({ dir = 'ne' }) {
  const d = { ne: 'M3 11 11 3M5 3h6v6', e: 'M1 7h12M8 2l5 5-5 5', w: 'M13 7H1M6 2 1 7l5 5' }[dir]
  return (
    <svg className="arrow" width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

/* ---------- media ---------- */

/** One image or video. With no src yet it renders a quiet tonal placeholder. */
function Media({ item, eager = false }) {
  return (
    <div className={`media tone-${item.tone}`}>
      {item.src && item.type === 'video' && (
        <video src={item.src} poster={item.poster || undefined} autoPlay muted loop playsInline preload={eager ? 'auto' : 'metadata'} />
      )}
      {item.src && item.type === 'image' && <img src={item.src} alt={`${item.credit} in ${item.place}`} loading={eager ? 'eager' : 'lazy'} />}
      {!item.src && item.type === 'video' && <span className="media__play" aria-hidden="true" />}
      <span className="media__credit">{item.credit} <em>{item.place}</em></span>
    </div>
  )
}

/*
  Collage — five slots that glide between layouts every few seconds,
  swapping in new media as they move. Positions are % of the stage: [x, y, w, h].
*/
const LAYOUTS = [
  [[0, 0, 46, 100], [46, 0, 27, 56], [73, 0, 27, 56], [46, 56, 32, 44], [78, 56, 22, 44]],
  [[0, 0, 28, 58], [0, 58, 28, 42], [28, 0, 44, 100], [72, 0, 28, 46], [72, 46, 28, 54]],
  [[0, 0, 24, 100], [24, 0, 44, 52], [24, 52, 21, 48], [45, 52, 23, 48], [68, 0, 32, 100]],
  [[0, 0, 38, 46], [0, 46, 38, 54], [38, 0, 34, 68], [38, 68, 34, 32], [72, 0, 28, 100]],
]

function Collage() {
  const reduced = useReducedMotion()
  const [layout, setLayout] = useState(0)
  const [slots, setSlots] = useState([0, 1, 2, 3, 4])
  const next = useRef(5)

  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => {
      setLayout((l) => (l + 1) % LAYOUTS.length)
      // swap two slots per beat so the collage evolves rather than resets
      setSlots((s) => {
        const copy = [...s]
        for (let k = 0; k < 2; k++) {
          const at = Math.floor(Math.random() * copy.length)
          let idx = next.current % MEDIA.length
          while (copy.includes(idx)) idx = (idx + 1) % MEDIA.length
          copy[at] = idx
          next.current = idx + 1
        }
        return copy
      })
    }, 3200)
    return () => clearInterval(t)
  }, [reduced])

  return (
    <div className="collage" aria-label="Recent creator content">
      {LAYOUTS[layout].map(([x, y, w, h], k) => (
        <div
          key={k}
          className="collage__slot"
          style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
        >
          <div key={slots[k]} className="collage__fade">
            <Media item={MEDIA[slots[k]]} eager />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- carousel ---------- */

/**
 * Carousel that glides on its own (pauses on hover, drag or focus) and loops.
 * Children are rendered twice so the loop is seamless. Arrows step one card.
 */
function Carousel({ children, label, speed = 0.45 }) {
  const ref = useRef(null)
  const drag = useRef(null)
  const pos = useRef(0)
  const paused = useRef(false)
  const reduced = useReducedMotion()
  const items = Array.isArray(children) ? children : [children]

  const loopWidth = () => {
    const el = ref.current
    const first = el?.children[0]
    const twin = el?.children[items.length]
    return first && twin ? twin.offsetLeft - first.offsetLeft : 0
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(64, (now ?? performance.now()) - last)
      last = now ?? performance.now()
      const w = loopWidth()
      if (Math.abs(el.scrollLeft - pos.current) > 2) pos.current = el.scrollLeft // user moved it
      if (!paused.current && !reduced && w) pos.current += speed * (dt / 16.7)
      if (w && pos.current >= w) pos.current -= w
      if (w && pos.current < 0) pos.current += w
      el.scrollLeft = pos.current
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, speed, items.length])

  const go = (dir) => {
    const el = ref.current
    const step = (el.children[0]?.getBoundingClientRect().width || 300) + 20
    paused.current = true
    const start = pos.current
    const t0 = performance.now()
    const anim = (t) => {
      const k = Math.min(1, (t - t0) / 500)
      pos.current = start + dir * step * (1 - Math.pow(1 - k, 3))
      el.scrollLeft = pos.current
      if (k < 1) requestAnimationFrame(anim)
      else paused.current = false
    }
    requestAnimationFrame(anim)
  }
  const down = (e) => {
    if (e.pointerType !== 'mouse') return
    drag.current = { x: e.clientX, left: pos.current }
    ref.current.classList.add('is-dragging')
  }
  const move = (e) => {
    if (!drag.current) return
    pos.current = drag.current.left - (e.clientX - drag.current.x)
    ref.current.scrollLeft = pos.current
  }
  const up = () => {
    if (!drag.current) return
    ref.current.classList.remove('is-dragging')
    drag.current = null
  }

  return (
    <div className="car">
      <div className="car__ui wrap">
        <span className="car__count">Drag, or let it drift</span>
        <div className="car__btns">
          <button aria-label="Previous" onClick={() => go(-1)}><Arrow dir="w" /></button>
          <button aria-label="Next" onClick={() => go(1)}><Arrow dir="e" /></button>
        </div>
      </div>
      <div
        ref={ref}
        className="car__track car__track--auto"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => { paused.current = false; up() }}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
        onTouchStart={() => (paused.current = true)}
        onTouchEnd={() => setTimeout(() => (paused.current = false), 1500)}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {items}
        {items.map((child, k) => cloneElement(child, { key: `dup-${k}` }))}
      </div>
    </div>
  )
}

function CreatorCard({ c, index }) {
  const m = marketById[c.market]
  const media = { type: 'image', src: c.img, credit: `@${c.handle}`, place: m.short || m.city, tone: TONE_MAP[c.tone] || 'sand' }
  return (
    <article className="ccard">
      <Media item={media} />
      <div className="ccard__meta">
        <span className="ccard__idx">({String(index + 1).padStart(2, '0')})</span>
        <div>
          <p className="ccard__name">{c.name}</p>
          <p className="ccard__sub">{c.cat}, {m.city}</p>
        </div>
        <div className="ccard__nums">
          <p>{c.followers}</p>
          <p className="ccard__sub">from ${c.rate}</p>
        </div>
      </div>
    </article>
  )
}
const TONE_MAP = { clay: 'clay', saffron: 'butter', forest: 'forest', sage: 'sage', night: 'ink', sand: 'sand' }

/* ---------- sections ---------- */

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="nav wrap">
      <a href="#top" className="nav__logo" aria-label="MegaEvolution home">
        <img className="logo--onlight" src="/logo.png" alt="MegaEvolution" width="138" height="20" />
        <img className="logo--ondark" src="/logo-light.png" alt="" width="138" height="20" />
      </a>
      <nav className={`nav__links ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)}>
        <a href="#creators">Creators</a>
        <a href="#services">Services</a>
        <a href="#markets">Markets</a>
        <a href="#for-creators">For creators</a>
        <a href={`${SITE}/login`}>Log in</a>
      </nav>
      <a className="nav__cta" href="#contact">Start a campaign <Arrow /></a>
      <button className="nav__burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Menu'}
      </button>
    </header>
  )
}

/** Organic cloud layer drawn with SVG noise — tinted by the theme behind it. */
function Clouds({ id, seed = 7 }) {
  return (
    <svg className="clouds" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1600 900">
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.0028 0.0055" numOctaves="5" seed={seed} />
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  3.4 0 0 0 -1.55" />
        <feGaussianBlur stdDeviation="1.2" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  )
}

/** Five-petal sakura mark used as a small accent. */
function Blossom({ size = 12 }) {
  return (
    <svg className="blossom" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((r) => (
        <path key={r} d="M12 12C9.5 8.5 9.6 4.6 12 2.6c2.4 2 2.5 5.9 0 9.4Z" transform={`rotate(${r} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="1.6" className="blossom__c" />
    </svg>
  )
}

/** A handful of petals drifting across the hero (sakura theme only). */
const PETALS = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: -((i * 2.3) % 18),
  dur: 14 + ((i * 7) % 10),
  size: 9 + ((i * 5) % 9),
  sway: 30 + ((i * 13) % 50),
}))

function Petals() {
  return (
    <div className="petals" aria-hidden="true">
      {PETALS.map((p, i) => (
        <span
          key={i}
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.8, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, '--sway': `${p.sway}px` }}
        />
      ))}
    </div>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero__split">
        <div className="hero__copy">
          <p className="pill"><Blossom /> Creator marketing · Southeast Asia & beyond</p>
          <h1>Reach globally.<br /><span className="shine-text">Delivered locally.</span></h1>
          <p className="hero__lede">
            MegaEvolution connects brands with local creators — and the people on the ground who know them — in
            Jakarta, Saigon, Taipei, Seoul, Tokyo and Los Angeles.
          </p>
          <div className="hero__actions">
            <a className="btn btn--shine" href="#contact">Start a campaign <Arrow /></a>
            <a className="btn btn--glass" href="#creators">Browse creators</a>
          </div>
          <dl className="hero__stats">
            <div><dt>6</dt><dd>markets</dd></div>
            <div><dt>5</dt><dd>creator categories</dd></div>
            <div><dt>USD</dt><dd>rates up front</dd></div>
          </dl>
        </div>
        <div className="collage-wrap">
          <Collage />
          <HeroFloaters />
          <a className="glass" href="#creators">
            <span className="glass__thumb glass__thumb--accent tone-butter" />
            <span>
              <small>Featured</small>
              Food creators<br />in Saigon
            </span>
            <Arrow />
          </a>
        </div>
      </div>
      <div className="ribbon" aria-label="Markets with local teams">
        <div className="ribbon__track">
          {[...MARKETS, ...MARKETS, ...MARKETS, ...MARKETS].map((m, k) => (
            <span className="chip" key={k} aria-hidden={k >= MARKETS.length}>
              <i />
              <b>{m.city}</b>
              <span>{m.country}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

const ICON = {
  people: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2.5 19c.6-3 2.9-5 5.5-5s4.9 2 5.5 5M14 14.3c.6-.2 1.3-.3 2-.3 2.3 0 4.3 1.7 4.8 4.5',
  tag: 'M3 12.5V4h8.5l9 9-8.5 8.5-9-9ZM7.5 8.5h.01',
  doc: 'M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5M10 16h5',
}
function Icon({ name }) {
  return (
    <svg className="icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICON[name]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SectionHead({ n, label, title, children }) {
  return (
    <div className="shead">
      <div>
        <span className="tag">({n}) {label}</span>
        <h2>{title}</h2>
      </div>
      {children && <p>{children}</p>}
    </div>
  )
}

function About() {
  return (
    <section className="about">
      <div className="wrap">
        <SectionHead n="01" label="About" title="Local first, everywhere we work." />
        <div className="bento">
          <article className="card card--statement">
            <p className="card__kicker">Why MegaEvolution</p>
            <p className="card__statement">
              The creator your customer trusts most probably lives in their city, speaks their language — and has never
              heard of your brand. <span>Our job is to introduce you properly.</span>
            </p>
            <a className="link" href="#how">See how it works <Arrow /></a>
          </article>
          <article className="card card--accent">
            <span className="card__big">6</span>
            <p>markets, each with a team on the ground</p>
          </article>
          <article className="card card--quiet">
            <span className="card__big card__big--ink">USD</span>
            <p>Every creator shows a starting rate before you message them.</p>
          </article>
          {[
            ['people', 'Local teams', 'People in each market who know which creators actually move product — not just who has big numbers.'],
            ['tag', 'Honest pricing', 'Rates are visible up front. No back and forth to find out what something costs.'],
            ['doc', 'One agreement', 'One contract and one invoice, whether you launch in one market or six.'],
          ].map(([icon, t, d]) => (
            <article className="card card--feature" key={t}>
              <span className="card__icon"><Icon name={icon} /></span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Creators() {
  const [cat, setCat] = useState('All')
  const list = useMemo(() => CREATORS.filter((c) => cat === 'All' || c.cat === cat), [cat])
  return (
    <section className="creators" id="creators">
      <div className="wrap">
        <SectionHead n="02" label="Creators" title="A few of the people brands book with us.">
          Every creator lists a starting rate in USD.
        </SectionHead>
        <div className="filters filters--pills" role="group" aria-label="Category">
          {['All', ...CATEGORIES].map((c) => (
            <button key={c} className={cat === c ? 'is-on' : ''} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>
      <Carousel label="Creators" key={cat}>
        {list.map((c, k) => <CreatorCard key={c.handle} c={c} index={k} />)}
      </Carousel>
    </section>
  )
}

function Services() {
  const items = [
    ['Creator discovery', 'Shortlists by market, category and real rate.', 0],
    ['Localised briefs', 'Your message, rewritten by someone who lives there.', 2],
    ['Campaign management', 'Booking, contracts, approvals and timelines.', 4],
    ['Content & usage rights', 'Native videos you can reuse in ads, rights agreed up front.', 6],
    ['Reporting', 'One view of every market, so you can see what actually sold.', 8],
  ]
  const reduced = useReducedMotion()
  const small = useMedia('(max-width: 760px)')
  const [active, setActive] = useState(2)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduced || paused) return
    const t = setInterval(() => setActive((a) => (a + 1) % items.length), 3600)
    return () => clearInterval(t)
  }, [reduced, paused, items.length])

  // size of each tile by distance from the active one: [width %, height vw, max height px]
  const SIZES = small
    ? [[56, 84, 9999], [20, 60, 9999], [2, 40, 9999], [0, 30, 9999], [0, 30, 9999]]
    : [[27, 31, 470], [19, 23, 360], [13, 17, 270], [10, 13, 210], [8, 10, 160]]

  return (
    <section className="services" id="services">
      <div className="wrap services__head">
        <Head2 n="03" label="Services" title="What we do for *brands*." center>
          Everything between “we want to launch in Vietnam” and seeing it in your sales.
        </Head2>
      </div>
      <div
        className="fan"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {items.map(([t, , mi], k) => {
          const [w, h, max] = SIZES[Math.abs(k - active)]
          return (
            <button
              key={t}
              className={`fan__item ${k === active ? 'is-active' : ''}`}
              style={{ width: `${w}%`, '--h': `min(${h}vw, ${max}px)` }}
              onMouseEnter={() => setActive(k)}
              onFocus={() => setActive(k)}
              onClick={() => setActive(k)}
              aria-pressed={k === active}
            >
              <span className="fan__img"><Media item={MEDIA[mi]} /></span>
              <span className="fan__label">{t}</span>
            </button>
          )
        })}
      </div>
      <p className="fan__desc wrap" key={active}>{items[active][1]}</p>
    </section>
  )
}

function useMedia(query) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = (e) => setMatch(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

function Markets() {
  return (
    <section className="markets" id="markets">
      <div className="wrap">
        <SectionHead n="04" label="Markets" title="Where we work.">
          Six markets across the Pacific, each with a local team. Hover a city to see how people there watch and shop.
        </SectionHead>
        <MarketMap />
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="process" id="how">
      <div className="wrap">
        <SectionHead n="05" label="Process" title="From brief to posted content." />
        <ProcessStory />
      </div>
    </section>
  )
}

function ForCreators() {
  return (
    <section className="forc" id="for-creators">
      <div className="forc__sky" aria-hidden="true" />
      <div className="wrap forc__grid">
        <div className="forc__media">
          <Media item={MEDIA[1]} />
          <Media item={MEDIA[6]} />
        </div>
        <div className="forc__copy">
          <p className="eyebrow">(06) For creators</p>
          <h2>Work with brands from other countries, without the admin.</h2>
          <p>Set your own rate, get verified once, and let brands from Seoul to San Francisco find you. We handle contracts and make sure you get paid.</p>
          <a className="btn" href={SITE}>Get verified as a creator <Arrow /></a>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  const [picked, setPicked] = useState(['vn', 'id'])
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="card contact__card">
          <span className="tag">(07) Contact</span>
          <h2>Tell us what you’re launching.</h2>
          <p className="soft contact__lede">Someone from our local team replies with a shortlist and rates. Usually within a couple of days.</p>
          {sent ? (
            <div className="sent">
              <p>Thank you — your brief is with our team in {picked.map((id) => marketById[id].city).join(', ') || 'your markets'}.</p>
              <button className="link" onClick={() => setSent(false)}>Send another</button>
            </div>
          ) : (
            <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
              <label className="field"><span>Product</span><input required placeholder="A sunscreen for humid weather" /></label>
              <label className="field"><span>Email</span><input required type="email" placeholder="you@brand.com" /></label>
              <div className="field">
                <span>Markets</span>
                <div className="picks">
                  {MARKETS.map((m) => (
                    <button type="button" key={m.id} className={picked.includes(m.id) ? 'is-on' : ''} onClick={() => toggle(m.id)}>{m.country}</button>
                  ))}
                </div>
              </div>
              <label className="field">
                <span>Budget</span>
                <select defaultValue="5-20">
                  <option value="lt5">Under USD 5,000</option>
                  <option value="5-20">USD 5,000 – 20,000</option>
                  <option value="20-50">USD 20,000 – 50,000</option>
                  <option value="50+">USD 50,000+</option>
                </select>
              </label>
              <button className="btn" type="submit">Send brief <Arrow /></button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const cols = [
    ['Marketing', [['Creator marketing', SITE], ['Start a campaign', '#contact'], ['Business inquiry', `${SITE}/business-inquiry`]]],
    ['Support', [['Help Center', `${SITE}/help`], ['Creator FAQ', `${SITE}/help`], ['Company · Brand FAQ', `${SITE}/help`], ['Connect your AI', SITE]]],
    ['Information', [['Terms & Conditions', `${SITE}/terms`], ['Privacy Policy', `${SITE}/privacy`], ['Blog', SITE]]],
  ]
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <img src="/logo-light.png" alt="MegaEvolution" width="150" height="22" />
          <p className="soft">Reach globally, delivered locally.</p>
        </div>
        {cols.map(([h, links]) => (
          <div key={h}>
            <p className="footer__h">{h}</p>
            <ul>{links.map(([t, href]) => <li key={t}><a href={href}>{t}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="wrap footer__bottom">
        <span>© 2026 MegaEvolution Inc.</span>
        <span>Wilmington, DE, USA</span>
      </div>
    </footer>
  )
}

const THEMES = [['brand', 'Brand'], ['coast', 'Coast'], ['icy', 'Icy'], ['sakura', 'Sakura'], ['lavender', 'Lavender'], ['sand', 'Sand']]

function ThemeSwitch() {
  const [theme, setTheme] = useState(() => {
    const q = new URLSearchParams(window.location.search).get('theme')
    if (THEMES.some(([id]) => id === q)) return q
    try { return localStorage.getItem('me-theme') || 'brand' } catch { return 'brand' }
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('me-theme', theme) } catch {}
  }, [theme])
  return (
    <div className="themeswitch" role="group" aria-label="Colour theme (review only)">
      {THEMES.map(([id, name]) => (
        <button key={id} className={theme === id ? 'is-on' : ''} onClick={() => setTheme(id)}>{name}</button>
      ))}
    </div>
  )
}

export default function App() {
  return (
    <>
      <ThemeSwitch />
      <div className="top">
        <div className="sky" aria-hidden="true">
          <span className="sky__glow" />
          <Petals />
        </div>
        <Nav />
        <Hero />
      </div>
      <main>
        <About2 />
        <Creators3 />
        <Services />
        <Markets3 />
        <Process2 />
        <ForCreators2 />
        <Contact2 />
      </main>
      <Footer />
    </>
  )
}
