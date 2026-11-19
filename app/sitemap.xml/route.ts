// Sitemap index. The sitemaps themselves are split by type under /sitemaps/.
import { SITE_URL } from '@/data/site'
import { SITEMAPS } from '@/lib/routes'
export const dynamic = 'force-static'

export function GET() {
  const items = Object.keys(SITEMAPS).map((n) => `  <sitemap><loc>${SITE_URL}/sitemaps/${n}.xml</loc></sitemap>`).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } })
}
