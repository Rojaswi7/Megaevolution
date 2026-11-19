// SEO helpers: metadata (title, description, canonical, hreflang, OG/Twitter) and JSON-LD builders.
import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME, LOCALES, LOCALE_HREFLANG, DEFAULT_LOCALE, href, CONTACT_EMAIL } from '@/data/site'

export const abs = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path === '/' ? '' : path}` || SITE_URL)

type MetaInput = {
  lang: string
  path: string // English path, e.g. "/creators/vietnam/beauty"
  title: string // without the brand suffix
  description: string
  noindex?: boolean
  ogImage?: string // path under the site
  type?: 'website' | 'article' | 'profile'
}

/**
 * One call per page. Canonical is the page in its own locale; hreflang lists
 * every locale plus x-default. Currency never appears in a URL, so switching
 * it cannot change the canonical.
 */
export function pageMeta({ lang, path, title, description, noindex, ogImage, type = 'website' }: MetaInput): Metadata {
  const url = abs(href(lang, path))
  const languages: Record<string, string> = {}
  for (const l of LOCALES) languages[LOCALE_HREFLANG[l]] = abs(href(l, path))
  languages['x-default'] = abs(href(DEFAULT_LOCALE, path))
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const image = abs(ogImage || '/og/default.png')
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url, languages },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: fullTitle, description, url, siteName: SITE_NAME, type, locale: lang, images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [image] },
  }
}

// ---------- JSON-LD ----------
export const orgLd = () => ({
  '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE_URL}/#org`,
  name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/logo-black.png`, email: CONTACT_EMAIL,
  sameAs: ['https://www.instagram.com/megaevo1ution/', 'https://tiktok.com/@megaevo1ution', 'https://www.linkedin.com/company/megaevolution/'],
})

export const websiteLd = () => ({
  '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME,
  publisher: { '@id': `${SITE_URL}/#org` },
  potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/creators?q={search_term_string}` }, 'query-input': 'required name=search_term_string' },
})

export const breadcrumbLd = (lang: string, items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(href(lang, it.path)) })),
})

export const faqLd = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
})

/** Offer is only emitted with a price once the price is a real number (not TBD). */
export const offerLd = (price: unknown, currency = 'USD', url?: string) =>
  typeof price === 'number'
    ? { '@type': 'Offer', price: String(price), priceCurrency: currency, availability: 'https://schema.org/InStock', ...(url ? { url } : {}) }
    : { '@type': 'Offer', priceCurrency: currency, availability: 'https://schema.org/PreOrder', description: 'Price to be announced', ...(url ? { url } : {}) }

export const serviceLd = (o: { name: string; description: string; path: string; areaServed?: string[]; offers?: object[] }) => ({
  '@context': 'https://schema.org', '@type': 'Service', name: o.name, description: o.description, url: abs(o.path),
  provider: { '@id': `${SITE_URL}/#org` }, ...(o.areaServed ? { areaServed: o.areaServed } : {}), ...(o.offers ? { offers: o.offers } : {}),
})

export const productLd = (o: { name: string; description: string; path: string; offers: object[] }) => ({
  '@context': 'https://schema.org', '@type': 'Product', name: o.name, description: o.description, url: abs(o.path),
  brand: { '@type': 'Brand', name: SITE_NAME }, offers: o.offers,
})

export const articleLd = (o: { title: string; description: string; path: string; date: string; image?: string }) => ({
  '@context': 'https://schema.org', '@type': 'Article', headline: o.title, description: o.description,
  datePublished: o.date, dateModified: o.date, mainEntityOfPage: abs(o.path),
  author: { '@id': `${SITE_URL}/#org` }, publisher: { '@id': `${SITE_URL}/#org` }, image: abs(o.image || '/og/default.png'),
})

export const itemListLd = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: abs(it.url) })),
})
