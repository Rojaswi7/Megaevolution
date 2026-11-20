// Markets index: the map in a navy hero, then every market compared side by side, then the
// regions we cover on request. Taiwan is intentionally not listed.
import '@/styles/agency.css'
import '@/styles/markets-hub.css'
import { CTA } from '@/data/site'
import { MARKETS, REGIONS } from '@/data/markets'
import { pageMeta, itemListLd } from '@/lib/seo'
import { Cta, TLink, SectionHead, JsonLd, Breadcrumbs, StickyCta } from '@/components/ui'
import { Icon } from '@/components/Icon'
import MarketMap from '@/components/MarketMap'
import MarketCompare from '@/components/markets/MarketCompare'

type P = { params: Promise<{ lang: string }> }
const PATH = '/markets'

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({
    lang, path: PATH, title: 'Influencer Marketing by Country — Platforms, Shopping Apps and Local Managers',
    description: 'What people watch and where they shop in Korea, Japan, China, Vietnam, Thailand, Indonesia, the Philippines, the US, Mexico, Brazil and Europe, with a local campaign manager in each.',
  })
}

export default async function Markets({ params }: P) {
  const { lang } = await params
  const languages = new Set(MARKETS.flatMap((m) => m.langs)).size
  const apps = new Set(MARKETS.flatMap((m) => m.shops)).size
  return (
    <>
      <JsonLd data={itemListLd(MARKETS.map((m) => ({ name: `Influencer marketing in ${m.name}`, url: `${PATH}/${m.slug}` })))} />
      <div className="wrap"><Breadcrumbs lang={lang} items={[{ name: 'Markets', path: PATH }]} /></div>

      <section className="mh-hero on-dark">
        <div className="wrap">
          <div className="mh-hero__top">
            <div>
              <p className="eyebrow">Markets</p>
              <h1 className="h1">Every market works differently.<span className="it">Here’s how each one does.</span></h1>
            </div>
            <div className="mh-hero__side">
              <p>The apps people watch, the places they shop and the seasons that matter change from country to country. Pick one on the map, or compare them all side by side.</p>
              <dl className="mh-stats">
                <div><dt>markets with a local manager</dt><dd className="num">{MARKETS.length}</dd></div>
                <div><dt>languages briefed natively</dt><dd className="num">{languages}</dd></div>
                <div><dt>shopping apps covered</dt><dd className="num">{apps}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap sec mh-map" id="map">
        <SectionHead eyebrow="Map" title="Pick a country.|See what works there.">What people watch, where they shop and who runs your campaign locally.</SectionHead>
        <MarketMap lang={lang} />
      </section>

      <section className="wrap sec" id="compare">
        <SectionHead eyebrow="Compare markets" title="Side by side.|Pick where to start.">Filter by region or by the category you sell. Every row opens that market’s full page.</SectionHead>
        <MarketCompare lang={lang} />
      </section>

      <section className="wrap sec" aria-label="Other regions">
        <div className="mh-more on-dark">
          <span className="mh-more__ico"><Icon name="globe" size={22} /></span>
          <div>
            <b>Not on the list?</b>
            <p>We also run campaigns in {REGIONS.map((r) => (r.name === 'Latin America' ? 'the rest of Latin America' : `the ${r.name}`)).join(' and ')} on request, through our agency team.</p>
          </div>
          <div className="mh-more__cta">
            <Cta lang={lang} to="/about-agency#inquiry" cta="markets_other_region" size="sm">{CTA.agency}</Cta>
            <TLink lang={lang} to="/creators" cta="markets_search_creators">{CTA.search}</TLink>
          </div>
        </div>
      </section>

      <StickyCta lang={lang} to="/creators" cta="search_creators" label={CTA.search} />
    </>
  )
}
