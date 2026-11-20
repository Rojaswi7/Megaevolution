// Help center. Placeholder articles from data/help.ts; search, audience and topics filter on the
// client, but every article link is in the server HTML.
import Link from 'next/link'
import '@/styles/content.css'
import '@/styles/help.css'
import { href } from '@/data/site'
import { HELP, HELP_TOPICS } from '@/data/help'
import { pageMeta, itemListLd } from '@/lib/seo'
import { Breadcrumbs, JsonLd, RoadmapTag } from '@/components/ui'
import HelpCenter from '@/components/content/HelpCenter'

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
      <div className="wrap hc-crumbs"><Breadcrumbs lang={lang} items={[{ name: 'Help center', path: '/help' }]} /><RoadmapTag status="dev" /></div>
      <HelpCenter lang={lang} articles={articles} topics={HELP_TOPICS} />
      <nav className="wrap hc-legal" aria-label="Legal">
        <span>Legal</span>
        {HELP.filter((h) => h.legal).map((h) => <Link key={h.slug} href={href(lang, `/help/${h.slug}`)} prefetch={false}>{h.title}</Link>)}
      </nav>
    </>
  )
}
