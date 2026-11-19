// Help center. Placeholder articles from data/help.ts; search and topics filter on the client,
// but every article link is in the server HTML.
import Link from 'next/link'
import '@/styles/content.css'
import { href, CONTACT_EMAIL } from '@/data/site'
import { HELP, HELP_TOPICS } from '@/data/help'
import { pageMeta, itemListLd } from '@/lib/seo'
import { Cta, Breadcrumbs, JsonLd, RoadmapTag } from '@/components/ui'
import { HelpBrowser } from '@/components/content/Interactive'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/help', title: 'Help Center — Creator Search, Orders, Video Editing and Plans', description: 'Answers for brands, creators and MCNs: finding creators, ordering packages, payments and refunds, the Video Editing Studio, tool plans and accounts.' })
}

export default async function HelpPage({ params }: P) {
  const { lang } = await params
  const articles = HELP.filter((h) => !h.legal)
  return (
    <>
      <JsonLd data={itemListLd(articles.map((a) => ({ name: a.title, url: `/help/${a.slug}` })))} />
      <div className="wrap">
        <Breadcrumbs lang={lang} items={[{ name: 'Help center', path: '/help' }]} />
        <div style={{ marginTop: 14 }}><HelpBrowser lang={lang} articles={articles} topics={HELP_TOPICS} /></div>
        <RoadmapTag status="dev" />
        <nav className="ct-legal" aria-label="Legal">
          {HELP.filter((h) => h.legal).map((h) => <Link key={h.slug} className="ulink" href={href(lang, `/help/${h.slug}`)} prefetch={false}>{h.title}</Link>)}
        </nav>
      </div>
      <section className="wrap sec">
        <div className="band ct-app" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
          <div>
            <h2 className="h2">Still stuck?<span className="it">Ask a person.</span></h2>
            <p style={{ marginTop: 14, color: 'var(--ink-2)' }}>Write to <span style={{ userSelect: 'all', fontWeight: 600, color: 'var(--ink)' }}>{CONTACT_EMAIL}</span>. For a campaign, the short form is quicker — no brief needed.</p>
          </div>
          <Cta lang={lang} to="/about-agency#inquiry" cta="help_to_agency">Explore your campaign options</Cta>
        </div>
      </section>
    </>
  )
}
