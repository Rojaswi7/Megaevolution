import { SITE_URL, LOCALES } from '@/data/site'
export const dynamic = 'force-static'

// Logged-in previews, checkout and the debug modes are never crawled.
export function GET() {
  const prefixes = ['', ...LOCALES.filter((l) => l !== 'en').map((l) => `/${l}`)]
  const lines = [
    'User-agent: *', 'Allow: /',
    ...prefixes.flatMap((p) => [`Disallow: ${p}/preview`, `Disallow: ${p}/video-editing/checkout`]),
    'Disallow: /*?roadmap=', 'Disallow: /*?theme=', 'Disallow: /*?as=', '',
    `Sitemap: ${SITE_URL}/sitemap.xml`, '',
  ]
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
