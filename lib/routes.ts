// Every public, indexable path — one list shared by the sitemaps and HANDOFF.md.
// English paths; locale variants are added by the sitemap as hreflang alternates.
import { MARKETS } from '@/data/markets'
import { CATEGORIES } from '@/data/categories'
import { CREATORS, creatorsIn, MIN_INDEXABLE } from '@/data/creators'
import { TOOLS } from '@/data/tools'
import { CASES } from '@/data/cases'
import { HELP } from '@/data/help'
import { BLOG } from '@/data/blog'
import { MCNS } from '@/data/mcns'

export type SitemapEntry = { path: string; priority: number; changefreq: 'daily' | 'weekly' | 'monthly'; lastmod?: string }
const e = (path: string, priority: number, changefreq: SitemapEntry['changefreq'] = 'weekly', lastmod?: string): SitemapEntry => ({ path, priority, changefreq, lastmod })

/** A country × category hub is indexable only with enough creators (no thin duplicates). */
export const isIndexableHub = (marketId: string, category: string) => creatorsIn(marketId, category).length >= MIN_INDEXABLE

export const SITEMAPS: Record<string, () => SitemapEntry[]> = {
  pages: () => [
    e('/', 1, 'daily'), e('/creators', 0.9, 'daily'), e('/about-agency', 0.9), e('/video-editing', 0.9), e('/tools', 0.8), e('/pricing', 0.8),
    ...TOOLS.map((t) => e(`/tools/${t.slug}`, 0.7)),
    e('/case-studies', 0.7), e('/mcn', 0.6), ...MCNS.map((m) => e(`/mcn/${m.slug}`, 0.4, 'monthly')),
    e('/for-creators', 0.7), e('/connect-ai', 0.6), e('/help', 0.5),
    ...HELP.filter((h) => !h.legal).map((h) => e(`/help/${h.slug}`, 0.4, 'monthly')),
    ...HELP.filter((h) => h.legal).map((h) => e(`/help/${h.slug}`, 0.2, 'monthly')),
  ],
  creators: () => [
    ...MARKETS.map((m) => e(`/creators/${m.slug}`, 0.8, 'daily')),
    ...MARKETS.flatMap((m) => CATEGORIES.filter((c) => isIndexableHub(m.id, c.slug)).map((c) => e(`/creators/${m.slug}/${c.slug}`, 0.8, 'daily'))),
    ...CREATORS.map((c) => e(`/@${c.handle}`, 0.6)),
  ],
  markets: () => [e('/markets', 0.8), ...MARKETS.map((m) => e(`/markets/${m.slug}`, 0.8))],
  cases: () => CASES.map((c) => e(`/case-studies/${c.slug}`, 0.7, 'monthly', c.date)),
  blog: () => [e('/blog', 0.6, 'daily'), ...BLOG.map((p) => e(`/blog/${p.slug}`, 0.5, 'monthly', p.date))],
}
