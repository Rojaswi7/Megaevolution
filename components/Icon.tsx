// One small stroke icon set, drawn on a 24 grid. No emoji anywhere on the site.
import { siTiktok, siYoutube, siInstagram, siLinkedin } from 'simple-icons'

const P: Record<string, string> = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  arrowUpRight: 'M7 17 17 7M9 7h8v8',
  chevron: 'M6 9l6 6 6-6',
  chevronRight: 'M9 6l6 6-6 6',
  close: 'M6 6l12 12M18 6 6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  plus: 'M12 5v14M5 12h14',
  bookmark: 'M7 4h10v16l-5-3.6L7 20V4Z',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16ZM10 20a2 2 0 0 0 4 0',
  message: 'M4 5h16v11H9l-5 4V5Z',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c2.6 2.8 2.6 15.2 0 18M12 3c-2.6 2.8-2.6 15.2 0 18',
  filter: 'M4 6h16M7 12h10M10 18h4',
  play: 'M8 5.5v13l11-6.5-11-6.5Z',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5v-9Z',
  shield: 'M12 3l7 3v5c0 4.6-2.9 8.3-7 10-4.1-1.7-7-5.4-7-10V6l7-3ZM9 12l2.2 2.2L15 10.5',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM12 8v4.5l3 1.8',
  refresh: 'M4 12a8 8 0 0 1 13.7-5.6L20 9M20 4v5h-5M20 12a8 8 0 0 1-13.7 5.6L4 15M4 20v-5h5',
  card: 'M3 6h18v12H3V6ZM3 10h18M7 15h4',
  download: 'M12 4v11M7 11l5 5 5-5M5 20h14',
  upload: 'M12 16V5M7 9l5-5 5 5M5 20h14',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.5a6.5 6.5 0 0 1 3.5 5.5',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  film: 'M4 5h16v14H4V5ZM8 5v14M16 5v14M4 9.5h4M4 14.5h4M16 9.5h4M16 14.5h4',
  bag: 'M5 8h14l-1 12H6L5 8ZM9 8V7a3 3 0 0 1 6 0v1',
  pen: 'M4 20l1-4L16 5l3 3L8 19l-4 1ZM14 7l3 3',
  plug: 'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4',
  mail: 'M3 6h18v12H3V6ZM3 7l9 7 9-7',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  home: 'M4 11l8-7 8 7v9h-5v-6H9v6H4v-9Z',
  inbox: 'M4 13l2.5-8h11L20 13v6H4v-6ZM4 13h5l1 2.5h4l1-2.5h5',
  building: 'M5 20V5h9v15M14 10h5v10M3 20h18M8 9h3M8 13h3M8 17h3',
  layout: 'M4 5h16v14H4V5ZM4 10h16M10 10v9',
  file: 'M7 3h7l4 4v14H7V3ZM14 3v4h4M10 12h5M10 16h5',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12ZM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  star: 'M12 4l2.4 5 5.6.8-4 3.9.9 5.5L12 16.6 7.1 19.200l.9-5.5-4-3.9 5.600-.8L12 4Z',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.800 1.800M16.6 16.6l1.800 1.800M5.6 18.4l1.800-1.800M16.6 7.400l1.800-1.800',
  // categories
  beauty: 'M9 21h6V11H9v10ZM10 11V7l4-3v7M9 15h6',
  food: 'M7 3v8a2 2 0 0 0 2 2v8M5 3v5M9 3v5M16 21V3c2.5 1.500 3.500 4 3.500 7s-1.500 4-3.500 4',
  fashion: 'M8 4l4 2 4-2 5 4-3 3-2-1.500V20H8V9.500L6 11 3 8l5-4Z',
  gaming: 'M7 9h10a4 4 0 0 1 4 4v1a3 3 0 0 1-5.400 1.800L14.500 14h-5l-1.100 1.800A3 3 0 0 1 3 14v-1a4 4 0 0 1 4-4ZM8 11.500v3M6.500 13h3M16 12h.01M18 14h.01',
  tech: 'M7 3h10v18H7V3ZM11 18h2',
  lifestyle: 'M3 7h12v10H3V7ZM15 10.500 21 7v10l-6-3.500',
}

export function Icon({ name, size = 18, stroke = 1.7, className = '', title }: { name: string; size?: number; stroke?: number; className?: string; title?: string }) {
  const d = P[name]
  if (!d) return null
  return (
    <svg className={`ico ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} aria-label={title}>
      <path d={d} />
    </svg>
  )
}

/** Arrow that stays level and nudges right on hover (no diagonal "AI" arrows). */
export const Arrow = ({ size = 16 }: { size?: number }) => <Icon name="arrow" size={size} className="arr" stroke={1.9} />

// ---------- flags (real flags, never emoji) ----------
const FLAGS = ['id', 'vn', 'th', 'ph', 'cn', 'kr', 'jp', 'eu', 'us', 'mx', 'br']
/** Real flag artwork (country-flag-icons, MIT) served as small cached SVG files. */
export function Flag({ market, title }: { market: string; title?: string }) {
  if (!FLAGS.includes(market)) return <span className="flag flag--region"><Icon name="globe" size={12} /></span>
  return <img className="flag" src={'/flags/' + market + '.svg'} alt={title || ''} title={title} width={30} height={20} loading="lazy" decoding="async" />
}

// ---------- platforms: Instagram, TikTok and YouTube logos only ----------
const PLATFORM: Record<string, any> = { TikTok: siTiktok, YouTube: siYoutube, Instagram: siInstagram, LinkedIn: siLinkedin }
export function PlatformIcon({ name, size = 15, mono = false }: { name: string; size?: number; mono?: boolean }) {
  const icon = PLATFORM[name]
  if (!icon) return null
  const fill = mono ? 'currentColor' : name === 'TikTok' ? 'currentColor' : `#${icon.hex}`
  return (
    <svg className="pi" width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={name}>
      <path d={icon.path} fill={fill} />
    </svg>
  )
}
/** A platform by name: logo for IG / TikTok / YouTube, plain text for local apps (LINE, Naver, Douyin…). */
export function PlatformName({ name, size = 15 }: { name: string; size?: number }) {
  return <span className="pname">{PLATFORM[name] && name !== 'LinkedIn' ? <PlatformIcon name={name} size={size} /> : null}{name}</span>
}
