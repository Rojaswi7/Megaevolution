// Index behind the ⌘K search: creators, pages, page sections and help articles.
// Loaded only when the palette opens, so it costs nothing on first paint.
import { CREATORS } from './creators'
import { MARKETS, marketById } from './markets'
import { CATEGORIES, categoryBySlug } from './categories'
import { TOOLS } from './tools'
import { CASES } from './cases'
import { HELP } from './help'

export type SearchItem = { group: 'Creators' | 'Pages' | 'Sections' | 'Help'; title: string; sub?: string; path: string; keywords?: string; initial?: string; tone?: number }

const pages: SearchItem[] = [
  { group: 'Pages', title: 'Creator search', sub: 'Filter and shortlist creators', path: '/creators', keywords: 'influencer find list filter' },
  { group: 'Pages', title: 'Agency', sub: 'Let our team run your campaign', path: '/about-agency', keywords: 'managed campaign inquiry request' },
  { group: 'Pages', title: 'Video Editing Studio', sub: 'Order edited videos', path: '/video-editing', keywords: 'edit short long video order' },
  { group: 'Pages', title: 'Tools', sub: 'AI Listup, reports and more', path: '/tools' },
  { group: 'Pages', title: 'Pricing', sub: 'All plans in one place', path: '/pricing', keywords: 'plans price cost subscription' },
  { group: 'Pages', title: 'Markets', sub: 'Platforms, shopping apps, local managers', path: '/markets' },
  { group: 'Pages', title: 'Case studies', sub: 'JINRO, Rejuran and more', path: '/case-studies' },
  { group: 'Pages', title: 'Connect your AI', sub: 'Use MegaEvolution from Claude or ChatGPT', path: '/connect-ai', keywords: 'mcp claude chatgpt cursor gemini' },
  { group: 'Pages', title: 'For creators', sub: 'Profile, My Rates, Script Studio', path: '/for-creators' },
  { group: 'Pages', title: 'For MCNs', sub: 'Bring your MCN', path: '/mcn' },
  { group: 'Pages', title: 'Help center', path: '/help' },
  { group: 'Pages', title: 'Blog', path: '/blog' },
  { group: 'Pages', title: 'Log in', sub: 'Dummy accounts for every role', path: '/login' },
  ...TOOLS.map((t): SearchItem => ({ group: 'Pages', title: t.name, sub: t.job, path: `/tools/${t.slug}` })),
  ...MARKETS.map((m): SearchItem => ({ group: 'Pages', title: `Influencer marketing in ${m.name}`, sub: `${m.city} · ${m.watches.slice(0, 3).join(', ')}`, path: `/markets/${m.slug}`, keywords: m.short })),
  ...MARKETS.flatMap((m) => m.strong.map((c): SearchItem => ({ group: 'Pages', title: `${categoryBySlug[c].label} creators in ${m.name}`, path: `/creators/${m.slug}/${c}`, keywords: `${m.short} influencers` }))),
  ...CASES.map((c): SearchItem => ({ group: 'Pages', title: c.title, sub: 'Case study', path: `/case-studies/${c.slug}` })),
]

const sections: SearchItem[] = [
  { group: 'Sections', title: 'Market map', sub: 'Home', path: '/#markets' },
  { group: 'Sections', title: 'How can we help?', sub: 'Home', path: '/#help' },
  { group: 'Sections', title: 'Agency inquiry form', sub: 'Agency', path: '/about-agency#inquiry' },
  { group: 'Sections', title: 'How we work', sub: 'Agency', path: '/about-agency#how' },
  { group: 'Sections', title: 'Studio pricing', sub: 'Video Editing', path: '/video-editing#pricing' },
  { group: 'Sections', title: 'Plus and Max subscriptions', sub: 'Video Editing', path: '/video-editing#subscriptions' },
  { group: 'Sections', title: 'Portfolio videos', sub: 'Video Editing', path: '/video-editing#portfolio' },
  { group: 'Sections', title: 'Tool plans', sub: 'Tools', path: '/tools#plans' },
  { group: 'Sections', title: 'Audience analytics access', sub: 'Pricing', path: '/pricing#analytics' },
  { group: 'Sections', title: 'AI-native app waitlist', sub: 'Connect your AI', path: '/connect-ai#app' },
]

export const SEARCH_INDEX: SearchItem[] = [
  ...CREATORS.map((c): SearchItem => ({
    group: 'Creators', title: `@${c.handle}`, sub: `${categoryBySlug[c.category].label} · ${marketById[c.market].short}`,
    path: `/@${c.handle}`, keywords: `${c.name} ${c.city} ${marketById[c.market].name} ${categoryBySlug[c.category].label} ${c.platforms.map((p) => p.platform).join(' ')}`,
    initial: c.name[0], tone: c.tone,
  })),
  ...pages,
  ...sections,
  ...HELP.map((h): SearchItem => ({ group: 'Help', title: h.title, sub: h.topic, path: `/help/${h.slug}`, keywords: h.summary })),
]

export const SUGGESTED: SearchItem[] = [
  ...CATEGORIES.slice(0, 3).map((c, i): SearchItem => ({ group: 'Pages', title: `${c.label} creators in ${MARKETS[[3, 6, 1][i]].name}`, path: `/creators/${MARKETS[[3, 6, 1][i]].slug}/${c.slug}` })),
  pages[0], pages[1], pages[2], pages[4],
]
