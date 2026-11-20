// 404 with search. Rendered inside the locale layout, so header, footer and ⌘K all work.
import Link from 'next/link'
import { HeroSearch } from '@/components/CreatorExplorer'
import { Arrow } from '@/components/Icon'

export const metadata = { title: 'Page not found | MegaEvolution', robots: { index: false, follow: true } }

export default function NotFound() {
  const links: [string, string][] = [['Search creators', '/creators'], ['Agency', '/about-agency'], ['Video Editing Studio', '/video-editing'], ['Tools & plans', '/tools'], ['Markets', '/markets'], ['Help center', '/help']]
  return (
    <section className="wrap sec">
      <div className="slab nf">
        <p className="eyebrow">Error 404</p>
        <h1 className="h1">That page isn’t here.<span className="it">A creator probably is.</span></h1>
        <p className="lede">The link may be old or mistyped. Search for a creator, or pick one of the pages below.</p>
        <HeroSearch lang="en" action="navigate" />
        <ul className="nf__links">
          {links.map(([t, to]) => <li key={to}><Link className="tlink" href={to} data-cta="404_link" prefetch={false}>{t}<Arrow size={15} /></Link></li>)}
        </ul>
      </div>
    </section>
  )
}
