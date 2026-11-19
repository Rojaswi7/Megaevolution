// One help article (placeholder copy), with related articles and a CTA that fits the reader.
import Link from 'next/link'
import { notFound } from 'next/navigation'
import '@/styles/content.css'
import { href, CONTACT_EMAIL } from '@/data/site'
import { HELP, helpBySlug, type HelpArticle } from '@/data/help'
import { pageMeta, articleLd } from '@/lib/seo'
import { Cta, Breadcrumbs, JsonLd } from '@/components/ui'

type P = { params: Promise<{ lang: string; article: string }> }
export const dynamicParams = false
export function generateStaticParams() { return HELP.map((h) => ({ article: h.slug })) }

export async function generateMetadata({ params }: P) {
  const { lang, article } = await params
  const a = helpBySlug[article]
  if (!a) return {}
  return pageMeta({ lang, path: `/help/${a.slug}`, title: `${a.title} — Help Center`, description: a.summary, type: 'article' })
}

/** The next click depends on who the article is for. */
function ctaFor(a: HelpArticle) {
  if (a.audience === 'Creators') return { title: 'Ready to set your rates?', text: 'Create a free profile and AI fills in the first draft.', label: 'Create your profile', to: '/signup?as=creator', cta: 'help_article_create_profile' }
  if (a.audience === 'MCNs') return { title: 'Bring your MCN', text: 'A public page, a talent dashboard and contracts in one place.', label: 'Apply as an MCN', to: '/signup?as=mcn', cta: 'help_article_apply_mcn' }
  if (a.topic === 'Video Editing Studio') return { title: 'Need videos edited?', text: 'Send raw footage, get ready-to-post videos back.', label: 'Order a video', to: '/video-editing', cta: 'help_article_order_video' }
  if (a.topic === 'Tools and plans') return { title: 'Compare the plans', text: 'Monthly, yearly or pay per use.', label: 'Choose plan', to: '/pricing', cta: 'help_article_choose_plan' }
  if (a.topic === 'Getting started' || a.topic === 'Account') return { title: 'Rather hand it over?', text: 'A local manager runs the campaign for you. No brief needed.', label: 'Explore your campaign options', to: '/about-agency', cta: 'help_article_agency' }
  return { title: 'Find your creators', text: 'Every card shows a starting rate.', label: 'Search creators', to: '/creators', cta: 'help_article_search_creators' }
}

export default async function HelpArticlePage({ params }: P) {
  const { lang, article } = await params
  const a = helpBySlug[article]
  if (!a) notFound()
  const related = HELP.filter((h) => h.slug !== a.slug && !h.legal && (h.topic === a.topic || h.audience === a.audience)).slice(0, 4)
  const c = ctaFor(a)
  return (
    <div className="wrap">
      <JsonLd data={articleLd({ title: a.title, description: a.summary, path: `/help/${a.slug}`, date: '2026-11-01' })} />
      <Breadcrumbs lang={lang} items={[{ name: 'Help center', path: '/help' }, { name: a.title, path: `/help/${a.slug}` }]} />
      <header className="ct-post__head">
        <p className="eyebrow">{a.legal ? 'Legal' : a.topic}</p>
        <h1>{a.title}</h1>
        <div className="ct-post__meta"><span className="tag">{a.audience}</span><span>{a.summary}</span></div>
      </header>
      <div className="ct-post">
        <article className="ct-prose">
          {a.body.map((p, i) => <p key={i}>{p}</p>)}
          {a.legal ? null : <p className="small muted">Placeholder article for the mockup. Still have a question? Write to <span style={{ userSelect: 'all' }}>{CONTACT_EMAIL}</span>.</p>}
        </article>
        <aside className="ct-aside">
          {!a.legal && (
            <div className="ct-aside__cta">
              <h2 className="h3">{c.title}</h2>
              <p>{c.text}</p>
              <Cta lang={lang} to={c.to} cta={c.cta}>{c.label}</Cta>
            </div>
          )}
          {related.length ? (
            <nav className="card ct-aside__list" aria-label="Related articles">
              <h2>Related articles</h2>
              {related.map((r) => <Link key={r.slug} href={href(lang, `/help/${r.slug}`)} data-cta="help_related_open" prefetch={false}>{r.title}</Link>)}
            </nav>
          ) : null}
          <Link className="tlink" style={{ justifySelf: 'start' }} href={href(lang, '/help')} prefetch={false}>All help articles</Link>
        </aside>
      </div>
    </div>
  )
}
