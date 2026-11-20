// Programmatic SEO hub: /creators/[country]/[category] — ranks for "[category] influencers in [country]".
// Thin combos (fewer than MIN_INDEXABLE creators) are noindex and only linked from the country hub.
import Link from 'next/link'
import { notFound } from 'next/navigation'
import '@/styles/creators.css'
import { LOCALES, href } from '@/data/site'
import { MARKETS, marketBySlug } from '@/data/markets'
import { CATEGORIES, categoryBySlug } from '@/data/categories'
import { creatorsIn, MIN_INDEXABLE } from '@/data/creators'
import { pageMeta, itemListLd } from '@/lib/seo'
import { hubTitle, hubDescription, hubIntro, hubFaq } from '@/lib/hubCopy'
import { Breadcrumbs, JsonLd, StickyCta, Cta, TLink } from '@/components/ui'
import { Flag, Icon } from '@/components/Icon'
import { CreatorCard } from '@/components/CreatorCard'
import CreatorExplorer from '@/components/CreatorExplorer'
import FaqCards from '@/components/home/FaqCards'
import { slim, MarketFacts, CategoryLinks, CountryLinks } from '@/components/creators/HubParts'

type P = { params: Promise<{ lang: string; country: string; category: string }> }
export const dynamicParams = false
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => MARKETS.flatMap((m) => CATEGORIES.map((c) => ({ lang, country: m.slug, category: c.slug }))))
}

export async function generateMetadata({ params }: P) {
  const { lang, country, category } = await params
  const m = marketBySlug[country]
  const cat = categoryBySlug[category]
  if (!m || !cat) return {}
  const list = creatorsIn(m.id, cat.slug)
  return pageMeta({ lang, path: `/creators/${m.slug}/${cat.slug}`, title: hubTitle(m, cat), description: hubDescription(m, list, cat), noindex: list.length < MIN_INDEXABLE })
}

export default async function CategoryHub({ params }: P) {
  const { lang, country, category } = await params
  const m = marketBySlug[country]
  const cat = categoryBySlug[category]
  if (!m || !cat) notFound()
  const list = creatorsIn(m.id, cat.slug)
  const thin = list.length < MIN_INDEXABLE
  const intro = hubIntro(m, list, cat)
  const related = CATEGORIES.filter((c) => c.slug !== cat.slug)
  return (
    <>
      <JsonLd data={itemListLd(list.map((c) => ({ name: `@${c.handle}`, url: `/@${c.handle}` })))} />
      <div className="wrap">
        <Breadcrumbs lang={lang} items={[{ name: 'Creators', path: '/creators' }, { name: m.name, path: `/creators/${m.slug}` }, { name: cat.label, path: `/creators/${m.slug}/${cat.slug}` }]} />
        <header className="cr-top cr-top--hub">
          <div>
            <p className="eyebrow"><Flag market={m.id} />{cat.label} · {m.name}</p>
            <h1 className="h2">{cat.label} influencers in {m.name}<span className="it">with rates up front.</span></h1>
          </div>
          <div className="cr-intro">{intro.map((p, i) => <p key={i}>{p}</p>)}</div>
        </header>

        <h2 className="sr">Top {cat.noun} creators in {m.name}</h2>
        {thin ? (
          <>
            <p className="wnote cr-thin"><Icon name="sparkle" size={15} />Only {list.length} {cat.noun} {list.length === 1 ? 'creator' : 'creators'} listed in {m.name} so far. Our {m.short} manager can find more for you, or see <Link className="ulink" href={href(lang, `/creators/${m.slug}`)} prefetch={false}>all creators in {m.name}</Link>.</p>
            <div className="cgrid">{list.map((c) => <CreatorCard key={c.handle} c={c} lang={lang} />)}</div>
          </>
        ) : (
          <CreatorExplorer lang={lang} creators={slim(list) as any} pageSize={20} mode="full" lock={['country', 'category']} initial={{ country: m.slug, category: cat.slug }} />
        )}

        <section className="sec--tight" aria-labelledby="h-market">
          <div className="cr-similar__head">
            <h2 className="h3" id="h-market">Platforms and shopping apps in {m.name}</h2>
            <TLink lang={lang} to={`/markets/${m.slug}`} cta="hub_market_page">Influencer marketing in {m.name}</TLink>
          </div>
          <MarketFacts m={m} lang={lang} />
        </section>

        <section className="sec--tight" aria-labelledby="h-rel">
          <h2 className="h3 cr-h" id="h-rel">Related categories in {m.name}</h2>
          <CategoryLinks m={m} lang={lang} current={cat.slug} />
          <h2 className="h3 cr-h">{cat.label} creators in nearby markets</h2>
          <CountryLinks lang={lang} category={cat.slug} only={m.near} />
        </section>

        <section className="sec--tight">
          <FaqCards lang={lang} items={hubFaq(m, list, cat)} title={`${cat.label} creators|in ${m.name}.`} />
        </section>

        <div className="slab cr-help">
          <div>
            <p className="eyebrow">Agency</p>
            <h2 className="h2">Need more than a list?<span className="it">Our {m.short} manager runs it.</span></h2>
          </div>
          <Cta lang={lang} to={`/about-agency?market=${m.slug}#inquiry`} cta="hub_to_agency" size="lg">Explore your campaign options</Cta>
        </div>
      </div>
      <StickyCta lang={lang} to={`/creators?country=${m.slug}&category=${cat.slug}`} cta="search_creators" label="Search creators" />
    </>
  )
}
