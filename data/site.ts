// Site-wide constants. Everything the header, footer, sitemap and SEO helpers share.

export const SITE_URL = 'https://www.megaevolution.io'
export const SITE_NAME = 'MegaEvolution'
export const CONTACT_EMAIL = 'info@megaevolution.io'
export const MCP_URL = 'https://api.megaevolution.io/mcp'

// DECISIONS.md #3 — the five launch languages. English has no URL prefix.
export const LOCALES = ['en', 'ko', 'ja', 'zh', 'vi'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_NAMES: Record<Locale, string> = { en: 'English', ko: '한국어', ja: '日本語', zh: '中文', vi: 'Tiếng Việt' }
export const LOCALE_HREFLANG: Record<Locale, string> = { en: 'en', ko: 'ko', ja: 'ja', zh: 'zh-Hans', vi: 'vi' }

/** Path for a locale. `path` is the English path, starting with "/". */
export function href(lang: string, path: string) {
  if (/^(https?:|mailto:|#)/.test(path)) return path
  if (lang === DEFAULT_LOCALE) return path
  return path === '/' ? `/${lang}` : `/${lang}${path}`
}

// Main navigation. Keys map to the dictionaries in data/i18n.ts.
export const NAV = [
  { key: 'creators', path: '/creators' },
  { key: 'tools', path: '/tools' },
  { key: 'video', path: '/video-editing' },
  { key: 'agency', path: '/about-agency' },
  { key: 'markets', path: '/markets' },
  { key: 'ai', path: '/connect-ai', isNew: true },
  { key: 'blog', path: '/blog' },
] as const

// The one wording per action, site-wide (prompt section 5).
export const CTA = {
  search: 'Search creators',
  agency: 'Explore your campaign options',
  video: 'Order a video',
  plan: 'Choose plan',
  startFree: 'Start free',
  request: 'Request a campaign',
  order: 'Order a package',
} as const

// Public proof figures (prompt section 6). These are the only real numbers on the site.
export const PROOF = {
  creators: '1,200+',
  views: '44M+',
  engagement: '6.1%',
  reports: 103,
  approvals: ['YouTube API approved', 'Meta API verified', 'TikTok app approved'],
}

// Logos only, no claims attached. LG H&H must stay logo-only.
export const CLIENT_LOGOS = ['Samsung', 'LG H&H', 'Olive Young', 'CJ', 'Hite Jinro', 'Sony']
