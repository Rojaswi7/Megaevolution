// Blog article. `body` is HTML from the company's own blog feed (data/blogPosts.js), so it is
// rendered as-is inside .ct-prose; remote images are hidden and a flat tile is used instead.
import Link from 'next/link'
import { notFound } from 'next/navigation'
import '@/styles/content.css'
import { href } from '@/data/site'
import { BLOG, postBySlug } from '@/data/blog'
import { MARKETS } from '@/data/markets'
import { pageMeta, articleLd } from '@/lib/seo'
import { Cta, Breadcrumbs, JsonLd } from '@/components/ui'
import { NewsletterForm } from '@/components/forms'
import { fmtDate } from '@/lib/format'

type P = { params: Promise<{ lang: string; slug: string }> }
export const dynamicParams = false
export function generateStaticParams() { return BLOG.map((p) => ({ slug: p.slug })) }

const clip = (s: string, n = 155) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s)

export async function generateMetadata({ params }: P) {
  const { lang, slug } = await params
  const p = postBySlug[slug]
  if (!p) return {}
  return pageMeta({ lang, path: `/blog/${p.slug}`, title: p.title, description: clip(p.excerpt), type: 'article' })
}

export default async function BlogPost({ params }: P) {
  const { lang, slug } = await params
  const p = postBySlug[slug]
  if (!p) notFound()
  // the market this post is about decides the contextual CTA
  const market = MARKETS.find((m) => new RegExp(`\\b(${m.name}|${m.short})\\b`).test(p.title))
  const related = [...BLOG.filter((x) => x.slug !== p.slug && x.category === p.category), ...BLOG.filter((x) => x.slug !== p.slug && x.category !== p.category)].slice(0, 4)
  const html = String(p.body).replace(/<script[\s\S]*?<\/script>/gi, '')
  return (
    <div className="wrap">
      <JsonLd data={articleLd({ title: p.title, description: clip(p.excerpt), path: `/blog/${p.slug}`, date: p.date })} />
      <Breadcrumbs lang={lang} items={[{ name: 'Blog', path: '/blog' }, { name: p.title, path: `/blog/${p.slug}` }]} />
      <header className="ct-post__head">
        <p className="eyebrow">{p.category}</p>
        <h1>{p.title}</h1>
        <div className="ct-post__meta"><time dateTime={p.date}>{fmtDate(p.date)}</time><span>MegaEvolution</span>{market ? <Link className="ulink" href={href(lang, `/markets/${market.slug}`)} prefetch={false}>Influencer marketing in {market.name}</Link> : null}</div>
      </header>
      <div className={`ct-post__cover tone-${p.tone}`} role="img" aria-label={`Cover: ${p.title}`}>{p.title.split(':')[0]}</div>
      <div className="ct-post">
        <article className="ct-prose" dangerouslySetInnerHTML={{ __html: html }} />
        <aside className="ct-aside">
          <div className="ct-aside__cta">
            {market ? (
              <>
                <h2 className="h3">Planning a campaign in {market.short}?</h2>
                <p>See {market.adjective} creators with their rates, or ask our {market.short} manager.</p>
                <Cta lang={lang} to={`/creators/${market.slug}`} cta="blog_post_search_country">Search creators in {market.short}</Cta>
                <Link className="tlink" style={{ color: '#fff' }} href={href(lang, '/about-agency#inquiry')} data-cta="blog_post_talk_manager" prefetch={false}>Talk to our {market.short} manager</Link>
              </>
            ) : (
              <>
                <h2 className="h3">Want this run for you?</h2>
                <p>One account manager, and a local manager in every market. No brief needed.</p>
                <Cta lang={lang} to="/about-agency" cta="blog_post_agency">Explore your campaign options</Cta>
              </>
            )}
          </div>
          <nav className="card ct-aside__list" aria-label="Related posts">
            <h2>Keep reading</h2>
            {related.map((r) => <Link key={r.slug} href={href(lang, `/blog/${r.slug}`)} data-cta="blog_related_open" prefetch={false}>{r.title}</Link>)}
          </nav>
        </aside>
      </div>
      <div className="slab ct-news">
        <div>
          <h2 className="h2">The market report,<span className="it">once a month.</span></h2>
          <p>What’s selling, which platforms are moving and what creators charge, by market.</p>
        </div>
        <NewsletterForm source="blog" />
      </div>
    </div>
  )
}
