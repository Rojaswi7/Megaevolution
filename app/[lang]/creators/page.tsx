// Creator search: filters + list. Job: find and shortlist creators.
import '@/styles/creators.css'
import { CREATORS } from '@/data/creators'
import { MARKETS } from '@/data/markets'
import { CATEGORIES } from '@/data/categories'
import { PROOF } from '@/data/site'
import { pageMeta, itemListLd } from '@/lib/seo'
import { Breadcrumbs, JsonLd, RoadmapTag, StickyCta, Cta, SectionHead } from '@/components/ui'
import FaqCards from '@/components/home/FaqCards'
import CreatorExplorer from '@/components/CreatorExplorer'
import { slim, CountryLinks } from '@/components/creators/HubParts'
import { HOME_FAQ } from '@/data/faq'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({
    lang, path: '/creators',
    title: 'Find Influencers by Country, Category & Platform · Creator Search',
    description: `Search ${CREATORS.length} TikTok, Instagram and YouTube creators across ${MARKETS.length} markets. Filter by country, category, followers, engagement and language, and see every creator’s starting rate.`,
  })
}

export default async function Creators({ params }: P) {
  const { lang } = await params
  const sorted = [...CREATORS].sort((a, b) => b.followers - a.followers)
  return (
    <>
      <JsonLd data={itemListLd(sorted.slice(0, 20).map((c) => ({ name: `@${c.handle}`, url: `/@${c.handle}` })))} />
      <div className="wrap">
        <Breadcrumbs lang={lang} items={[{ name: 'Creators', path: '/creators' }]} />
        <header className="cr-top">
          <div>
            <p className="eyebrow">Creator search <RoadmapTag status="dev" /></p>
            <h1 className="h2">Find creators<span className="it">with rates up front.</span></h1>
          </div>
          <p className="cr-top__note">{CREATORS.length} sample creators in {MARKETS.length} markets on TikTok, Instagram and YouTube. Filter, open a profile, save to a list or order a package. TikTok Shop sales per creator are coming soon.</p>
        </header>

        <CreatorExplorer lang={lang} creators={slim(sorted) as any} pageSize={24} mode="full" />

        <section className="sec--tight" aria-label="Browse creators">
          <SectionHead eyebrow="Browse" title="By country|or by category.">Every market and category has its own page with local creators and rates.</SectionHead>
          <div className="cr-browse">
            <div>
              <h3 className="cr-browse__k">Countries</h3>
              <CountryLinks lang={lang} />
            </div>
            <div>
              <h3 className="cr-browse__k">Popular categories</h3>
              <ul className="cr-links">
                {CATEGORIES.flatMap((c) => MARKETS.filter((m) => m.strong[0] === c.slug || m.strong[1] === c.slug).slice(0, 3).map((m) => (
                  <li key={c.slug + m.id}><a href={lang === 'en' ? `/creators/${m.slug}/${c.slug}` : `/${lang}/creators/${m.slug}/${c.slug}`} data-cta="search_category_hub"><span>{c.label} creators in {m.short}</span></a></li>
                )))}
              </ul>
            </div>
          </div>
        </section>

        <section className="sec--tight">
          <div className="slab cr-help">
            <div>
              <p className="eyebrow">Short on time?</p>
              <h2 className="h2">Send us the product.<span className="it">We’ll send back a shortlist.</span></h2>
              <p className="lede">A local manager casts, contracts and briefs the creators. {PROOF.creators} creators worked with so far.</p>
            </div>
            <Cta lang={lang} to="/about-agency#inquiry" cta="search_to_agency" size="lg">Explore your campaign options</Cta>
          </div>
        </section>

        <section className="sec--tight">
          <FaqCards lang={lang} items={HOME_FAQ.slice(0, 4)} title="Finding|creators." />
        </section>
      </div>
      <StickyCta lang={lang} to="/about-agency#inquiry" cta="request_campaign" label="Request a campaign" note="Want a shortlist made for you?" />
    </>
  )
}
