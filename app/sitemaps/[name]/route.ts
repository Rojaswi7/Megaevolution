// /sitemaps/pages.xml, creators.xml, markets.xml, cases.xml, blog.xml
// Every URL lists its hreflang alternates for all locales plus x-default.
import { SITE_URL, LOCALES, LOCALE_HREFLANG, href } from '@/data/site'
import { SITEMAPS } from '@/lib/routes'
export const dynamic = 'force-static'
export const dynamicParams = false
export function generateStaticParams() { return Object.keys(SITEMAPS).map((n) => ({ name: `${n}.xml` })) }

const abs = (p: string) => (`${SITE_URL}${p === '/' ? '' : p}`).replace(/&/g, '&amp;')

export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const make = SITEMAPS[name.replace(/\.xml$/, '')]
  if (!make) return new Response('Not found', { status: 404 })
  const urls = make().map((u) => {
    const alts = LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${LOCALE_HREFLANG[l]}" href="${abs(href(l, u.path))}"/>`).join('\n')
    const lastmod = u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''
    return `  <url>\n    <loc>${abs(u.path)}</loc>\n${lastmod}    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(u.path)}"/>\n  </url>`
  }).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } })
}
