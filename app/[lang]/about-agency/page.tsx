// Agency landing page — also the Google Ads landing page (Pattern A):
// hero → compact market list → case studies (moved up) → why → how we work →
// markets → one merged inquiry section → FAQ. The primary CTA repeats after each block.
import Link from 'next/link'
import '@/styles/agency.css'
import { href, PROOF, CTA } from '@/data/site'
import { MARKETS, REGIONS } from '@/data/markets'
import { HOME_CASES } from '@/data/cases'
import { AGENCY_FAQ } from '@/data/faq'
import { pageMeta, serviceLd, offerLd } from '@/lib/seo'
import { Cta, TLink, SectionHead, JsonLd, Breadcrumbs, StickyCta, Stat } from '@/components/ui'
import { Icon, Flag } from '@/components/Icon'
import { CaseCard } from '@/components/CaseCard'
import MarketMap from '@/components/MarketMap'
import InquirySection from '@/components/agency/InquirySection'
import CampaignRuns from '@/components/sections/CampaignRuns'
import FaqCards from '@/components/home/FaqCards'
import ServicesFan from '@/components/sections/ServicesFan'

type P = { params: Promise<{ lang: string }> }
const PATH = '/about-agency'
const DESC = 'A full-service influencer marketing agency for Korea, Japan, Southeast Asia and the Americas. One dedicated account manager, a local manager in every market. No brief needed to start.'

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: PATH, title: 'Influencer Marketing Agency — Local Managers in Every Market', description: DESC })
}

const WHY = [
  { t: 'One person to talk to', d: 'Your account manager speaks your language and owns the whole campaign. You never chase five people in five inboxes.' },
  { t: 'Someone local in every market', d: 'A manager who lives there picks the creators, rewrites the brief so it sounds native, and handles contracts and posting.' },
  { t: 'Rates you can check', d: 'Creator fees and our management fee are shown separately. You approve the budget before anything is booked.' },
  { t: 'Data from the platforms', d: PROOF.approvals.join(', ') + '. Channel numbers come from official access, not screenshots.' },
  { t: 'One report for every country', d: 'Views, engagement and sales in one place, with each platform shown next to the totals.' },
]

const HOW = [
  { t: 'Tell us the product and the market', d: 'A short form is enough. No brief needed.', w: 'Day 1' },
  { t: 'Get two or three campaign options', d: 'Your account manager sends options with creators, formats and rough costs.', w: 'Within one business day' },
  { t: 'Approve creators and budget', d: 'You see every creator and their fee before we contract anyone.', w: 'You decide' },
  { t: 'Local managers run it', d: 'Briefing, scripts, drafts, revisions and posting, in the local language.', w: 'Timeline in your plan' },
  { t: 'Read one report', d: 'Results for every market and platform, with the links to every post.', w: 'After the last post' },
]

export default async function AboutAgency({ params }: P) {
  const { lang } = await params
  const primary = (id: string, size: 'md' | 'lg' = 'md') => <Cta lang={lang} to={`${PATH}#inquiry`} cta={`agency_${id}`} size={size}>{CTA.agency}</Cta>

  return (
    <>
      <JsonLd data={serviceLd({
        name: 'MegaEvolution influencer marketing agency', description: DESC, path: href(lang, PATH),
        areaServed: [...MARKETS.map((m) => m.name), ...REGIONS.map((r) => r.name)],
        offers: [offerLd(null, 'USD', href(lang, `${PATH}#inquiry`))],
      })} />

      <div className="wrap"><Breadcrumbs lang={lang} items={[{ name: 'Agency', path: PATH }]} /></div>

      {/* hero */}
      <section className="wrap">
        <div className="slab ag-hero">
          <div>
            <p className="eyebrow">Agency · full-service campaigns</p>
            <h1 className="h1">One dedicated account manager.<span className="it">A local manager in every market.</span></h1>
            <p className="lede">Tell us the product and where you want to sell it. We find the creators, handle the contracts and get the posts live, in each country’s own language.</p>
            <div className="ag-hero__cta">
              {primary('hero', 'lg')}
              <TLink lang={lang} to="/case-studies" cta="agency_hero_cases">See results</TLink>
            </div>
            <p className="ag-hero__note">No brief needed. Reply within one business day.</p>
          </div>
          <div className="ag-desk" aria-label="How your team is set up">
            <div className="ag-desk__row ag-desk__row--you">
              <span className="ag-desk__ph"><Icon name="user" size={18} /></span>
              <div><b>Your account manager</b><small>One contact, in your language</small></div>
            </div>
            <span className="ag-desk__link" />
            {(['kr', 'vn', 'ph'] as const).map((id) => {
              const m = MARKETS.find((x) => x.id === id)!
              return (
                <div className="ag-desk__row" key={id}>
                  <span className="ag-desk__ph" role="img" aria-label="TODO: real photo"><Icon name="user" size={18} /></span>
                  <div><b>{m.manager.role}</b><small>Lives in {m.city}</small></div>
                  <Flag market={id} />
                </div>
              )
            })}
            <p className="ag-desk__todo">+ {MARKETS.length - 3} more markets · photos TODO: real photo</p>
          </div>
        </div>
      </section>

      {/* compact market list */}
      <section className="wrap" aria-label="Markets we run campaigns in">
        <div className="ag-mk">
          <p className="eyebrow eyebrow--plain">Local managers in</p>
          <ul>
            {MARKETS.map((m) => (
              <li key={m.id}><Link className="chip" href={href(lang, `/markets/${m.slug}`)} data-cta="agency_market_chip" prefetch={false}><Flag market={m.id} />{m.short}</Link></li>
            ))}
            {REGIONS.map((r) => <li key={r.id}><span className="chip chip--region">{r.name}</span></li>)}
          </ul>
        </div>
      </section>

      {/* what we do for brands */}
      <ServicesFan lang={lang} />

      {/* case studies, moved up */}
      <section className="wrap sec" id="results">
        <SectionHead eyebrow="Results" title="Campaigns we ran,|and what they did.">Three recent ones. The numbers are the clients’ own.</SectionHead>
        <div className="ag-proof">
          <Stat value={PROOF.creators} label="creators worked with" />
          <Stat value={PROOF.views} label="views" />
          <Stat value={PROOF.engagement} label={`average engagement on paid posts, from ${PROOF.reports} campaign reports`} />
        </div>
        <div className="grid-3">{HOME_CASES.map((c) => <CaseCard key={c.slug} c={c} lang={lang} />)}</div>
        <div className="ag-after">{primary('after_cases')}<TLink lang={lang} to="/case-studies" cta="agency_all_cases">See all case studies</TLink></div>
      </section>

      {/* why */}
      <section className="wrap sec" id="why">
        <SectionHead eyebrow="Why MegaEvolution" title="What you get|that a spreadsheet can’t." />
        <div className="ag-why">
          {WHY.map((w, i) => (
            <article className="ag-why__c" key={w.t}>
              <span className="ag-why__n">0{i + 1}</span>
              <h3 className="h3">{w.t}</h3>
              <p>{w.d}</p>
            </article>
          ))}
        </div>
        <div className="ag-after">{primary('after_why')}</div>
      </section>

      {/* how we work */}
      <section className="wrap sec" id="how">
        <CampaignRuns lang={lang} />
        <div className="ag-after">{primary('after_how')}</div>
      </section>

      {/* markets */}
      <section className="wrap sec" id="markets">
        <SectionHead eyebrow="Markets" title="Where we can run|your campaign.">Pick a country to see what people watch and where they shop. For the Middle East and the rest of Latin America, ask us.</SectionHead>
        <MarketMap lang={lang} initial="kr" />
        <div className="ag-after">{primary('after_markets')}<TLink lang={lang} to="/markets" cta="agency_all_markets">All market pages</TLink></div>
      </section>

      {/* the one inquiry section */}
      <section className="wrap sec">
        <div className="slab ag-inq" id="inquiry">
          <div className="ag-inq__copy">
            <span className="tag tag--accent">No brief needed</span>
            <h2 className="h2">Explore your<span className="it">campaign options.</span></h2>
            <div>
              <h3>What you get</h3>
              <ul className="ticks">
                <li><Icon name="check" size={16} />Two or three campaign options for your market</li>
                <li><Icon name="check" size={16} />Example creators with their real rates</li>
                <li><Icon name="check" size={16} />A rough cost and a timeline</li>
              </ul>
            </div>
            <div>
              <h3>What happens next</h3>
              <ol className="ag-inq__next">
                <li>A campaign manager reads your note and replies within one business day.</li>
                <li>You get the options by email. A call is optional.</li>
                <li>Nothing is booked or charged until you approve a budget.</li>
              </ol>
            </div>
          </div>
          <div className="ag-inq__form"><InquirySection source="agency" /></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="wrap sec" id="faq">
        <FaqCards lang={lang} items={AGENCY_FAQ} title="Questions brands|ask first." />
        <div className="ag-after">{primary('after_faq')}<TLink lang={lang} to="/creators" cta="agency_to_search">Or search creators yourself</TLink></div>
      </section>

      <StickyCta lang={lang} to={`${PATH}#inquiry`} cta="agency_inquiry" label={CTA.agency} />
    </>
  )
}
