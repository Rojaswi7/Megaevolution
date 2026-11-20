// Agency landing page — also the Google Ads landing page. Follows the reviewed design
// (Pattern A v2, Mai's 2nd feedback): hero with rotating market → client logos → results and
// client quotes → creator videos → usual way vs us → services → how we work → markets →
// inquiry → FAQ. The primary CTA repeats after each block.
import Link from 'next/link'
import '@/styles/agency.css'
import '@/styles/cases.css'
import '@/styles/agency2.css'
import { href, PROOF, CTA, CLIENT_LOGOS } from '@/data/site'
import { MARKETS, REGIONS } from '@/data/markets'
import { HOME_CASES } from '@/data/cases'
import { AGENCY_FAQ } from '@/data/faq'
import { pageMeta, serviceLd, offerLd } from '@/lib/seo'
import { Cta, TLink, SectionHead, JsonLd, Breadcrumbs, StickyCta } from '@/components/ui'
import { Icon, Flag, Arrow } from '@/components/Icon'
import { CaseTile } from '@/components/CaseTile'
import MarketMap from '@/components/MarketMap'
import InquirySection from '@/components/agency/InquirySection'
import RotatingMarket from '@/components/agency/RotatingMarket'
import CreatorShorts from '@/components/agency/CreatorShorts'
import ServicesFan from '@/components/sections/ServicesFan'
import Testimonials from '@/components/home/Testimonials'
import FaqCards from '@/components/home/FaqCards'

type P = { params: Promise<{ lang: string }> }
const PATH = '/about-agency'
const DESC = 'A full-service influencer marketing agency for Korea, Japan, Southeast Asia and the Americas. One dedicated account manager, a local manager in every market. No brief needed to start.'

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: PATH, title: 'Influencer Marketing Agency — Local Managers in Every Market', description: DESC })
}

const USUAL = ['A different agency in every country', 'Quality that changes from market to market', 'Briefs lost in translation', 'Creators you can’t vet yourself', 'Reports that don’t line up']
const WITH_US = ['One dedicated account manager, plus a local manager in each market', 'The same process and checks in every market', 'Native managers brief creators in their own language', 'Every creator hand-picked and checked by a local manager', 'One report across all markets']
const SHAPE = [
  { t: 'Strategy', d: 'Built on your KPI: awareness, traffic or sales' },
  { t: 'Campaign format', d: 'Seeding, paid posts, TikTok LIVE or on-site events, per market' },
  { t: 'Creator selection', d: '60%+ of each creator’s audience in your target country' },
]
const RUN = [
  { t: 'Plan and cast', d: 'Goals, markets and budget agreed. Creators shortlisted per market.' },
  { t: 'Run', d: 'Briefs in each creator’s language. You approve every draft before it goes live.' },
  { t: 'Report', d: 'One report across all markets: views, engagement and sales.' },
]
const NEXT = [
  { t: 'Within 24 hours', d: 'Your account manager replies' },
  { t: 'Short call', d: 'We go over goals, markets and timing' },
  { t: 'Your plan', d: 'Creator shortlist and proposal for each market' },
]

export default async function AboutAgency({ params }: P) {
  const { lang } = await params
  const primary = (id: string, size: 'md' | 'lg' = 'md', variant?: 'dark') => <Cta lang={lang} to={`${PATH}#inquiry`} cta={`agency_${id}`} size={size} variant={variant}>{CTA.agency}</Cta>
  const names = MARKETS.map((m) => (m.id === 'us' ? 'the US' : m.short))

  return (
    <>
      <JsonLd data={serviceLd({
        name: 'MegaEvolution influencer marketing agency', description: DESC, path: href(lang, PATH),
        areaServed: [...MARKETS.map((m) => m.name), ...REGIONS.map((r) => r.name)],
        offers: [offerLd(null, 'USD', href(lang, `${PATH}#inquiry`))],
      })} />

      <div className="wrap"><Breadcrumbs lang={lang} items={[{ name: 'Agency', path: PATH }]} /></div>

      {/* hero */}
      <section className="ag2-hero on-dark">
        <div className="wrap">
          <div className="ag2-hero__top">
            <div>
              <p className="eyebrow">Overseas influencer campaigns, run for you</p>
              <h1 className="h1">Launching campaigns in <RotatingMarket names={names} suffix="?" /></h1>
            </div>
            <div className="ag2-hero__side">
              <h2 className="h3">One dedicated account manager.<span className="it">A local manager in every market.</span></h2>
              <p>Campaigns built around your KPIs and adapted to each market.</p>
              <div className="ag2-hero__cta">
                {primary('hero', 'lg')}
                <TLink lang={lang} to="/case-studies" cta="agency_hero_cases">See case studies</TLink>
              </div>
            </div>
          </div>

          <div className="ag2-collage">
            <div className="ag2-mk">
              <p className="ag2-k">Markets we run</p>
              <p className="ag2-mk__n"><b>{MARKETS.length}</b> markets</p>
              <ul>
                {MARKETS.map((m) => <li key={m.id}><Link href={href(lang, `/markets/${m.slug}`)} data-cta="agency_hero_market" prefetch={false}><Flag market={m.id} />{m.id === 'us' ? 'United States' : m.short}</Link></li>)}
              </ul>
              <Link className="tlink" href={href(lang, '/markets')} data-cta="agency_hero_all_markets" prefetch={false}>See all markets<Arrow size={15} /></Link>
            </div>
            <div className="ag2-ph ag2-ph--a tone-7" role="img" aria-label="Creator photo — TODO: real photo"><small>TODO: real photo</small></div>
            <div className="ag2-ph ag2-ph--b tone-2" role="img" aria-label="Creator photo — TODO: real photo"><small>TODO: real photo</small></div>
            <div className="ag2-ph ag2-ph--tall tone-3" role="img" aria-label="JINRO creator post — TODO: real photo">
              <span className="ag2-ph__chip"><i />JINRO · 670 creators, 14 countries</span>
              <small>TODO: real photo</small>
            </div>
          </div>
        </div>
      </section>

      {/* client logos */}
      <section className="wrap" aria-label="Brands we have worked with">
        <p className="ag2-logos">
          {CLIENT_LOGOS.map((l) => <b key={l} title={`${l} logo — TODO: real logo file`}>{l}</b>)}
          <span>+ Bibigo, Rejuran, Round Lab and more</span>
        </p>
      </section>

      {/* results */}
      <section className="wrap sec" id="results">
        <SectionHead eyebrow="Case studies" title="Real campaigns.|Real sales.">The same format for every case: what the brand wanted, where it ran, and what it delivered.</SectionHead>
        <div className="cs-grid">{HOME_CASES.map((c, i) => <CaseTile key={c.slug} c={c} lang={lang} tone={(['dark', 'accent', 'light'] as const)[i % 3]} />)}</div>
        <div className="ag-after">{primary('after_cases')}<TLink lang={lang} to="/case-studies" cta="agency_all_cases">See all case studies</TLink></div>
      </section>

      <section className="tq-sec" aria-label="What clients say">
        <Testimonials lang={lang} />
      </section>

      {/* creator videos */}
      <section className="wrap sec" id="shorts">
        <SectionHead eyebrow="Creator content" title="Local creators,|for local audiences.">Short-form posts from creators we work with, in their own language and style. Samples until real videos are added.</SectionHead>
        <CreatorShorts />
      </section>

      {/* usual way vs us */}
      <section className="wrap sec" id="why">
        <SectionHead eyebrow="Why MegaEvolution" title="One manager.|Every market." />
        <div className="ag2-vs">
          <div className="ag2-vs__col">
            <p className="ag2-k">The usual way</p>
            <ul>{USUAL.map((t) => <li key={t}><span className="ag2-vs__x"><Icon name="close" size={12} stroke={2.4} /></span>{t}</li>)}</ul>
          </div>
          <div className="ag2-vs__col ag2-vs__col--us on-dark">
            <p className="ag2-k">With MegaEvolution</p>
            <ul>{WITH_US.map((t) => <li key={t}><span className="ag2-vs__ok"><Icon name="check" size={13} stroke={2.6} /></span>{t}</li>)}</ul>
          </div>
        </div>
        <div className="ag-after">{primary('after_why', 'md', 'dark')}<span className="small muted">A reply within 24 hours, from the manager who would run your campaign.</span></div>
      </section>

      {/* what we do for brands */}
      <ServicesFan lang={lang} />

      {/* how we work */}
      <section className="wrap sec" id="how">
        <div className="ag2-how">
          <div className="ag2-how__left on-dark">
            <p className="eyebrow">How we work</p>
            <h2 className="h2">Built around your goals.<span className="it">Adapted to each market.</span></h2>
            <p>No fixed package. We shape the plan around your KPIs and what works in each country.</p>
            <ol className="ag2-shape">
              {SHAPE.map((s, i) => <li key={s.t}><span className="num">0{i + 1}</span><div><b>{s.t}</b><small>{s.d}</small></div></li>)}
            </ol>
          </div>
          <div className="ag2-how__right">
            <p className="ag2-k">How we run a campaign</p>
            <ol className="ag2-run">
              {RUN.map((s, i) => <li key={s.t}><span className="num">0{i + 1}</span><div><b>{s.t}</b><p>{s.d}</p></div></li>)}
            </ol>
            <div className="ag2-proof on-dark">
              <dl>
                <div><dt>creators worked with</dt><dd className="num">{PROOF.creators}</dd></div>
                <div><dt>views across our campaigns</dt><dd className="num">{PROOF.views}</dd></div>
                <div><dt>average engagement on paid posts</dt><dd className="num">{PROOF.engagement}</dd></div>
              </dl>
              <p>From {PROOF.reports} campaign reports · {PROOF.approvals.join(' · ')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* markets */}
      <section className="wrap sec" id="markets">
        <SectionHead eyebrow="Markets" title="Every market,|run the same way.">A local manager in each market who knows its creators and platforms. For the Middle East and the rest of Latin America, ask us.</SectionHead>
        <MarketMap lang={lang} initial="vn" />
        <div className="ag-after">{primary('after_markets', 'md', 'dark')}<span className="small muted">Not sure which market to start with? We’ll help you choose.</span></div>
      </section>

      {/* inquiry */}
      <section className="wrap sec">
        <div className="ag2-inq on-dark" id="inquiry">
          <div className="ag2-inq__copy">
            <p className="eyebrow">Explore your campaign options</p>
            <h2 className="h1">Let’s make something<span className="it">happen.</span></h2>
            <p className="lede">No brief needed. A quick note on your markets or goals is enough to start.</p>
            <div>
              <p className="ag2-k">What you get</p>
              <ul className="ticks">
                <li><Icon name="check" size={16} />Suggested markets, creators and campaign format for your goal</li>
                <li><Icon name="check" size={16} />A rough budget range and timeline</li>
              </ul>
            </div>
            <div>
              <p className="ag2-k">What happens next</p>
              <ol className="ag2-next">{NEXT.map((n, i) => <li key={n.t}><span>{i + 1}</span><div><b>{n.t}</b><small>{n.d}</small></div></li>)}</ol>
            </div>
          </div>
          <div className="ag2-inq__form"><InquirySection source="agency" /></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="wrap sec" id="faq">
        <FaqCards lang={lang} items={AGENCY_FAQ} title="Questions brands|ask first." />
      </section>

      <StickyCta lang={lang} to={`${PATH}#inquiry`} cta="agency_inquiry" label={CTA.agency} />
    </>
  )
}
