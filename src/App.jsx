import { cloneElement, useEffect, useMemo, useRef, useState } from 'react'
import { MARKETS, CATEGORIES, CREATORS, MEDIA } from './data.js'
import { HeroFloaters } from './extras.jsx'
import { Flag } from './flag.jsx'
import { PlatformIcon } from './platformIcon.jsx'
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


/* ---------- sections ---------- */

export function Nav({ home = true }) {
  const pre = home ? '' : '/'
  const [open, setOpen] = useState(false)
  return (
    <header className="nav wrap">
      <a href={home ? '#top' : '/'} className="nav__logo" aria-label="MegaEvolution home">
        <img className="logo--onlight" src="/logo.png" alt="MegaEvolution" width="138" height="20" />
        <img className="logo--ondark" src="/logo-light.png" alt="" width="138" height="20" />
      </a>
      <nav className={`nav__links ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)}>
        <a href={`${pre}#creators`}>Creators</a>
        <a href={`${pre}#services`}>Services</a>
        <a href={`${pre}#markets`}>Markets</a>
        <a href={`${pre}#for-creators`}>For creators</a>
        <a href="/blog/">Blog</a>
        <a href={`${SITE}/login`}>Log in</a>
      </nav>
      <a className="nav__cta" href={`${pre}#contact`}>Start a campaign <Arrow /></a>
      <button className="nav__burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Menu'}
      </button>
    </header>
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
          <p className="hero__kicker">Creator marketing for brands</p>
          <h1>Find the creators your customers already watch.</h1>
          <p className="hero__lede">
            We work with creators across Southeast and East Asia, India, the Middle East, Europe and the Americas. You get one point
            of contact, and our people in each country handle the creators, the contracts and the posting.
          </p>
          <div className="hero__actions">
            <a className="btn btn--shine" href="#contact">Start a campaign <Arrow /></a>
            <a className="btn btn--glass" href="#creators">See creators</a>
          </div>
          <dl className="hero__stats">
            <div><dt>One contact</dt><dd>for every market</dd></div>
            <div><dt>Rates first</dt><dd>before you reach out</dd></div>
            <div><dt>Verified</dt><dd>brands and creators</dd></div>
          </dl>
        </div>
        <div className="collage-wrap">
          <Collage />
          <HeroFloaters />
        </div>
      </div>
      <div className="wrap">
        <div className="cbar">
          <span className="cbar__lbl">Local teams in</span>
          <ul className="cbar__list">
            {MARKETS.map((m) => (
              <li key={m.id} title={m.city}>
                <Flag market={m.id} />
                {{ kr: 'Korea', eu: 'EU', us: 'US', me: 'Middle East', latam: 'Latin America' }[m.id] || m.country}
              </li>
            ))}
          </ul>
        </div>
      </div>
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
        <Head2 label="Services" title="What we do for brands" layout="center">
          From the first brief to the last report.
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





export function Footer() {
  const cols = [
    ['Marketing', [['Creator marketing', SITE], ['Start a campaign', '/#contact'], ['Business inquiry', `${SITE}/business-inquiry`]]],
    ['Support', [['Help Center', `${SITE}/help-center`], ['Creator FAQ', `${SITE}/help-center`], ['Company · Brand FAQ', `${SITE}/help-center`], ['Connect your AI', SITE]]],
    ['Information', [['Terms & Conditions', `${SITE}/terms`], ['Privacy Policy', `${SITE}/privacy`], ['Blog', '/blog/']]],
  ]
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <img src="/logo-light.png" alt="MegaEvolution" width="150" height="22" />
          <p className="soft">Reach globally, delivered locally.</p>
          <div className="socials">
            {[['Instagram', 'https://www.instagram.com/megaevo1ution/'], ['TikTok', 'https://tiktok.com/@megaevo1ution'], ['LinkedIn', 'https://www.linkedin.com/company/megaevolution/']].map(([n, u]) => (
              <a key={n} href={u} target="_blank" rel="noreferrer" aria-label={`MegaEvolution on ${n}`}><PlatformIcon name={n} size={16} mono /></a>
            ))}
          </div>
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
    return THEMES.some(([id]) => id === q) ? q : 'brand'
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
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
