// Programmatic SEO hub: /creators/[country] — ranks for "[country] influencers / creators".
import { notFound } from 'next/navigation'
import '@/styles/creators.css'
import { LOCALES } from '@/data/site'
import { MARKETS, marketBySlug } from '@/data/markets'
import { creatorsIn } from '@/data/creators'
import { pageMeta, itemListLd } from '@/lib/seo'
import { hubTitle, hubDescription, hubIntro, hubFaq } from '@/lib/hubCopy'
import { Breadcrumbs, JsonLd, StickyCta, Cta, TLink } from '@/components/ui'
import { Flag } from '@/components/Icon'
import CreatorExplorer from '@/components/CreatorExplorer'
import FaqCards from '@/components/home/FaqCards'
import { slim, MarketFacts, CategoryLinks, CountryLinks } from '@/components/creators/HubParts'

type P = { params: Promise<{ lang: string; country: string }> }
export const dynamicParams = false
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => MARKETS.map((m) => ({ lang, country: m.slug })))
}

export async function generateMetadata({ params }: P) {
  const { lang, country } = await params
  const m = marketBySlug[country]
  if (!m) return {}
  const list = creatorsIn(m.id)
  return pageMeta({ lang, path: `/creators/${m.slug}`, title: hubTitle(m), description: hubDescription(m, list) })
}

export default async function CountryHub({ params }: P) {
  const { lang, country } = await params
  const m = marketBySlug[country]
  if (!m) notFound()
  const list = creatorsIn(m.id)
  const intro = hubIntro(m, list)
  return (
    <>
      <JsonLd data={itemListLd(list.slice(0, 20).map((c) => ({ name: `@${c.handle}`, url: `/@${c.handle}` })))} />
      <div className="wrap">
        <Breadcrumbs lang={lang} items={[{ name: 'Creators', path: '/creators' }, { name: m.name, path: `/creators/${m.slug}` }]} />
        <header className="cr-top cr-top--hub">
          <div>
            <p className="eyebrow"><Flag market={m.id} />Creators in {m.name}</p>
            <h1 className="h2">{m.adjective} influencers<span className="it">you can book with rates up front.</span></h1>
          </div>
          <div className="cr-intro">{intro.map((p, i) => <p key={i}>{p}</p>)}</div>
        </header>

        <h2 className="sr">Top creators in {m.name}</h2>
        <CreatorExplorer lang={lang} creators={slim(list) as any} pageSize={20} mode="full" lock={['country']} initial={{ country: m.slug }} />

        <section className="sec--tight" aria-labelledby="h-cats">
          <h2 className="h3 cr-h" id="h-cats">{m.adjective} creators by category</h2>
          <CategoryLinks m={m} lang={lang} />
        </section>

        <section className="sec--tight" aria-labelledby="h-market">
          <div className="cr-similar__head">
            <h2 className="h3" id="h-market">The {m.short} market in short</h2>
            <TLink lang={lang} to={`/markets/${m.slug}`} cta="hub_market_page">Influencer marketing in {m.name}</TLink>
          </div>
          <MarketFacts m={m} lang={lang} />
        </section>

        <section className="sec--tight" aria-labelledby="h-near">
          <h2 className="h3 cr-h" id="h-near">Nearby markets</h2>
          <CountryLinks lang={lang} only={m.near} />
        </section>

        <section className="sec--tight">
          <FaqCards lang={lang} items={hubFaq(m, list)} title={`Hiring creators|in ${m.name}.`} />
        </section>

        <div className="slab cr-help">
          <div>
            <p className="eyebrow">Agency</p>
            <h2 className="h2">Rather hand it over?<span className="it">Our {m.short} manager runs it.</span></h2>
          </div>
          <Cta lang={lang} to={`/about-agency?market=${m.slug}#inquiry`} cta="hub_to_agency" size="lg">Explore your campaign options</Cta>
        </div>
      </div>
      <StickyCta lang={lang} to={`/about-agency?market=${m.slug}#inquiry`} cta="talk_to_manager" label={`Talk to our ${m.short} manager`} />
    </>
  )
}
