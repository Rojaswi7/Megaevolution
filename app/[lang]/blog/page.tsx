// Blog listing. Posts come from the company's public blog (data/blog.ts), used as placeholder articles.
import '@/styles/content.css'
import { BLOG, BLOG_TOPICS } from '@/data/blog'
import { pageMeta, itemListLd } from '@/lib/seo'
import { Cta, TLink, SectionHead, Breadcrumbs, JsonLd } from '@/components/ui'
import { NewsletterForm } from '@/components/forms'
import { BlogList } from '@/components/content/Interactive'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/blog', title: 'Blog — Influencer Marketing by Market: Asia, the US and Latin America', description: 'Market notes for brands working with creators: shopping seasons, platform shifts, disclosure rules and what creators charge in Korea, Japan, Southeast Asia and beyond.' })
}

export default async function BlogPage({ params }: P) {
  const { lang } = await params
  const posts = BLOG.map(({ body, ...p }) => p) // the listing doesn't need article bodies
  return (
    <>
      <JsonLd data={itemListLd(BLOG.map((p) => ({ name: p.title, url: `/blog/${p.slug}` })))} />
      <div className="wrap">
        <Breadcrumbs lang={lang} items={[{ name: 'Blog', path: '/blog' }]} />
        <div className="phero">
          <SectionHead as="h1" eyebrow="Blog" title="What’s moving,|market by market.">Shopping seasons, platform shifts and rules that change how creator campaigns run.</SectionHead>
          <BlogList lang={lang} posts={posts} topics={BLOG_TOPICS} />
        </div>
        <div className="slab ct-news" style={{ marginTop: 0 }}>
          <div>
            <h2 className="h2">The market report,<span className="it">once a month.</span></h2>
            <p>What’s selling, which platforms are moving and what creators charge, by market.</p>
          </div>
          <NewsletterForm source="blog" />
        </div>
        <div className="row" style={{ marginTop: 28 }}>
          <Cta lang={lang} to="/creators" cta="blog_search_creators">Search creators</Cta>
          <TLink lang={lang} to="/markets" cta="blog_to_markets">See every market</TLink>
        </div>
      </div>
    </>
  )
}
