// Markets index: the map plus one card per market. Taiwan is intentionally not listed.
import Link from 'next/link'
import '@/styles/agency.css'
import { href, CTA } from '@/data/site'
import { MARKETS, REGIONS, LOGO_PLATFORMS } from '@/data/markets'
import { pageMeta, itemListLd } from '@/lib/seo'
import { Cta, TLink, SectionHead, JsonLd, Breadcrumbs, StickyCta } from '@/components/ui'
import { Flag, PlatformIcon, Arrow } from '@/components/Icon'
import MarketMap from '@/components/MarketMap'

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
  return (
    <>
      <JsonLd data={itemListLd(MARKETS.map((m) => ({ name: `Influencer marketing in ${m.name}`, url: `${PATH}/${m.slug}` })))} />
      <div className="wrap"><Breadcrumbs lang={lang} items={[{ name: 'Markets', path: PATH }]} /></div>

      <section className="wrap phero">
        <SectionHead as="h1" eyebrow={`Markets · ${MARKETS.length} with a local manager`} title="Every market works differently.|Here’s how each one does.">
          The apps people watch, the places they shop and the seasons that matter change from country to country. Pick one to see the details and who would run your campaign there.
        </SectionHead>
        <MarketMap lang={lang} />
      </section>

      <section className="wrap sec" aria-labelledby="all-markets">
        <SectionHead eyebrow="All markets" title="Country by country" id="all-markets" />
        <div className="ag-mgrid">
          {MARKETS.map((m) => (
            <article className="ag-mcard" key={m.id}>
              <header>
                <Flag market={m.id} />
                <div>
                  <h3 className="h3"><Link href={href(lang, `${PATH}/${m.slug}`)} data-cta="markets_card" prefetch={false}>{m.name}</Link></h3>
                  <span className="small muted">{m.city} · {m.langs.join(', ')}</span>
                </div>
              </header>
              <p>{m.fact}</p>
              <dl>
                <div><dt>Watches</dt><dd>{m.watches.slice(0, 3).map((p) => <span className="pname" key={p}>{LOGO_PLATFORMS.includes(p) ? <PlatformIcon name={p} size={14} /> : null}{p}</span>)}</dd></div>
                <div><dt>Shops on</dt><dd>{m.shops.slice(0, 3).join(' · ')}</dd></div>
              </dl>
              <span className="tlink" style={{ alignSelf: 'flex-start', fontSize: 14 }}>Influencer marketing in {m.short}<Arrow size={15} /></span>
            </article>
          ))}
          {REGIONS.map((r) => (
            <article className="ag-mcard ag-mcard--region" key={r.id}>
              <header><div><h3 className="h3"><Link href={href(lang, '/about-agency#inquiry')} data-cta={`markets_region_${r.id}`} prefetch={false}>{r.name}</Link></h3><span className="small muted">Run through our agency team</span></div></header>
              <p>We run campaigns here on request. Tell us the country and the product and a manager will come back with options.</p>
              <span className="tlink" style={{ alignSelf: 'flex-start', fontSize: 14, marginTop: 'auto' }}>{CTA.agency}<Arrow size={15} /></span>
            </article>
          ))}
        </div>
        <div className="ag-after">
          <Cta lang={lang} to="/creators" cta="markets_search_creators">{CTA.search}</Cta>
          <TLink lang={lang} to="/about-agency#inquiry" cta="markets_explore_options">{CTA.agency}</TLink>
        </div>
      </section>

      <StickyCta lang={lang} to="/creators" cta="search_creators" label={CTA.search} />
    </>
  )
}
