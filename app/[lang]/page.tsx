// Main page. Section order follows the brief: hero with search → creator results →
// logos → splitter → market map → tools → Studio → proof → Connect your AI →
// creators & MCNs → FAQ → final CTA. Every section ends with the next click.
import Link from 'next/link'
import { href, CLIENT_LOGOS, PROOF, CTA, MCP_URL } from '@/data/site'
import { CREATORS, FEATURED, creatorsIn } from '@/data/creators'
import { CATEGORIES, categoryBySlug } from '@/data/categories'
import { MARKETS } from '@/data/markets'
import ReelWall from '@/components/home/ReelWall'
import ToolsShowcase from '@/components/home/ToolsShowcase'
import BeforeAfter from '@/components/home/BeforeAfter'
import BriefForm from '@/components/home/BriefForm'
import ServicesFan from '@/components/sections/ServicesFan'
import { TOOLS } from '@/data/tools'
import { HOME_CASES } from '@/data/cases'
import { STUDIO, TOOL_FROM } from '@/data/pricing'
import { HOME_FAQ } from '@/data/faq'
import { pageMeta, orgLd, websiteLd } from '@/lib/seo'
import { Cta, TLink, SectionHead, Faq, JsonLd, RoadmapTag, StickyCta, Trust, Stat } from '@/components/ui'
import { Icon, Arrow, Flag, PlatformIcon } from '@/components/Icon'
import { Thumb, Avatar, Verified } from '@/components/CreatorCard'
import CreatorExplorer, { HeroSearch, QuickChip } from '@/components/CreatorExplorer'
import MarketMap from '@/components/MarketMap'
import { Money } from '@/components/Money'
import { CaseCard } from '@/components/CaseCard'
import { compact, localMoney } from '@/lib/format'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({
    lang, path: '/',
    title: 'Find and Book Local Creators in Any Market — Influencer Marketing',
    description: 'Search TikTok, Instagram and YouTube creators in Korea, Japan, Vietnam, the Philippines and more. See rates up front, or let our local managers run the campaign.',
  })
}

const CHIPS = [
  { country: 'vietnam', category: 'beauty', label: 'Beauty · Vietnam' },
  { country: 'philippines', category: 'food', label: 'F & B · Philippines' },
  { country: 'japan', category: 'gaming', label: 'Gaming · Japan' },
  { country: 'korea', category: 'fashion', label: 'Fashion · Korea' },
]

const PROMPTS = [
  'Find 10 beauty creators in Vietnam under $300 with 5%+ engagement.',
  'Which of my open orders are waiting on a draft?',
  'Draft a reply to @minh.beauty asking for one more revision.',
]

export default async function Home({ params }: P) {
  const { lang } = await params

  // The home list gets a slice of the catalogue: the featured mix first, then
  // everything the quick chips can filter to, then the biggest accounts.
  const chipSets = CHIPS.flatMap((c) => creatorsIn(undefined, c.category).filter((x) => x.market === (c.country === 'vietnam' ? 'vn' : c.country === 'philippines' ? 'ph' : c.country === 'japan' ? 'jp' : 'kr')))
  const seen = new Set<string>()
  const slice = [...FEATURED, ...chipSets, ...[...CREATORS].sort((a, b) => b.followers - a.followers)].filter((c) => !seen.has(c.handle) && seen.add(c.handle)).slice(0, 84)
    .map(({ bio, captions, mcn, ...c }) => ({ ...c, bio: '', captions: [], mcn: null }))
  const wall = [...FEATURED, ...slice.slice(12, 18)].slice(0, 15).map((c, i) => ({
    handle: c.handle, name: c.name, place: `${categoryBySlug[c.category].label} · ${c.city}`, caption: c.caption, tone: [6, 5, 1, 2, 0, 3, 4, 7, 1, 5, 2, 6, 0, 4, 3][i],
    platform: c.platforms[0].platform, followers: compact(c.followers), from: localMoney(c.rateLocal, c.currency),
  }))

  return (
    <>
      <JsonLd data={[orgLd(), websiteLd()]} />

      {/* 1 — hero: headline and search on the left, an ordered wall of creator posts on the right */}
      <section className="hero3 on-dark">
        <div className="wrap hero3__grid">
          <div className="hero3__copy">
            <p className="eyebrow">Creator marketing · 11 markets</p>
            <h1 className="h1">Find and book the creators<span className="it">your customers already watch.</span></h1>
            <p className="lede">Local creators on TikTok, Instagram and YouTube. See the rate first, book in a few clicks.</p>
            <HeroSearch lang={lang} />
            <div className="hero3__quick">
              {CHIPS.map((c) => <QuickChip key={c.label} lang={lang} country={c.country} category={c.category}>{c.label}</QuickChip>)}
                          </div>
            <nav className="hero3__cats" aria-label="Browse by category">
              <span>Browse</span>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} href={href(lang, '/creators?category=' + c.slug)} data-cta="hero_category" prefetch={false}><Icon name={c.icon} size={14} />{c.label}</Link>
              ))}
            </nav>
            <p className="hero3__alt">
              <span>Need us to run it? <TLink lang={lang} to="/about-agency" cta="hero_to_agency">Agency</TLink></span>
              <span>Need videos edited? <TLink lang={lang} to="/video-editing" cta="hero_to_video">Video Editing</TLink></span>
            </p>
          </div>
          <ReelWall items={wall} />
        </div>
      </section>

      {/* 2 — creator search results, directly below the hero */}
      <section className="wrap sec--tight home-results" aria-labelledby="h-results">
        <CreatorExplorer lang={lang} creators={slice as any} total={CREATORS.length} pageSize={12} mode="home" initial={{ sort: 'featured' }}
          heading={<><p className="eyebrow">Creator search <RoadmapTag status="dev" /></p><h2 className="h2" id="h-results">Creators on <span className="it it--inline">MegaEvolution</span></h2></>} />
      </section>

      {/* 3 — logo strip */}
      <section className="wrap logos" aria-label="Brands we have worked with">
        <p className="eyebrow eyebrow--plain">Brands we’ve worked with</p>
        <ul>
          {CLIENT_LOGOS.map((l) => <li key={l} title={`${l} logo — TODO: real logo file`}>{l}</li>)}
        </ul>
      </section>

      {/* 4 — how can we help */}
      <section className="wrap sec" id="help">
        <SectionHead eyebrow="How can we help?" title="Three ways in.|Pick the one that fits.">You can switch any time. Plenty of brands start with a search and hand the next campaign to a manager.</SectionHead>
        <div className="split">
          <Link className="split__card" href={href(lang, '/creators')} data-cta="splitter_find_creators" prefetch={false}>
            <span className="split__k">Do it yourself</span>
            <h3 className="h2">Find creators yourself</h3>
            <p>Filter by country, category and platform. Rates are on every card, so there’s no guessing and no waiting for a quote.</p>
            <ul className="split__mini" aria-hidden="true">{FEATURED.slice(0, 4).map((c) => <li key={c.handle}><Avatar c={c} size={34} /></li>)}<li className="split__n">+{PROOF.creators.replace('+', '')}</li></ul>
            <span className="tlink">{CTA.search}<Arrow size={15} /></span>
          </Link>
          <Link className="split__card split__card--dark" href={href(lang, '/about-agency')} data-cta="splitter_agency" prefetch={false}>
            <span className="split__k">Done for you</span>
            <h3 className="h2">Let our team run it</h3>
            <p>One dedicated account manager, and a local manager in every market who handles creators, contracts and posting.</p>
            <ul className="split__flags" aria-hidden="true">{['kr', 'jp', 'vn', 'ph', 'th', 'id', 'us', 'mx', 'br'].map((m) => <li key={m}><Flag market={m} /></li>)}</ul>
            <span className="tlink">{CTA.agency}<Arrow size={15} /></span>
          </Link>
          <Link className="split__card split__card--accent" href={href(lang, '/video-editing')} data-cta="splitter_video" prefetch={false}>
            <span className="split__k">Just the edit</span>
            <h3 className="h2">Get videos edited</h3>
            <p>Send raw footage, get short or long videos back, ready to post. Revisions included.</p>
            <div className="split__bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
            <span className="tlink">{CTA.video}<Arrow size={15} /></span>
          </Link>
        </div>
      </section>

      {/* 4b — what we do for brands (services fan) */}
      <ServicesFan lang={lang} />

      {/* 5 — market map */}
      <section className="wrap sec" id="markets">
        <SectionHead eyebrow="Markets" title="Every market works differently.|We have someone there.">Pick a country to see what people watch, where they shop and who would run your campaign.</SectionHead>
        <MarketMap lang={lang} />
      </section>

      {/* 6 — tools */}
      <section className="wrap sec" id="tools">
        <SectionHead eyebrow="Tools" title="The tools our own managers use,|open to you.">Pick one to see it. Use it for a single job, or put the set on a plan.</SectionHead>
        <ToolsShowcase lang={lang} />
      </section>

      {/* 7 — Video Editing Studio */}
      <section className="wrap sec" id="studio">
        <div className="slab studio2">
          <div className="studio2__copy">
            <p className="eyebrow">Video Editing Studio <RoadmapTag status="dev" /></p>
            <h2 className="h2">Raw footage in.<span className="it">Ready-to-post videos out.</span></h2>
            <p className="lede">Human editors who cut for TikTok, Reels and YouTube every day. Drag the handle to see the difference.</p>
            <ul className="studio2__prices">
              {STUDIO.products.map((p) => <li key={p.id}><span>{p.name}</span><b><Money usd={p.price} from /></b><small>{p.spec}</small></li>)}
              <li className="is-accent"><span>Bundle</span><b>{typeof STUDIO.bundles[0].percent === 'number' ? `${STUDIO.bundles[0].percent}% off` : 'TBD% off'}</b><small>{STUDIO.bundles[0].min}+ videos in one order</small></li>
            </ul>
            <div className="row">
              <Cta lang={lang} to="/video-editing/checkout" cta="home_order_video" size="lg">{CTA.video}</Cta>
              <TLink lang={lang} to="/video-editing" cta="home_studio_details">See samples and pricing</TLink>
            </div>
            <Trust row items={[
              { icon: 'lock', text: 'Secure card checkout' },
              { icon: 'refresh', text: `Revisions included (${STUDIO.freeRevisions})` },
              { icon: 'clock', text: STUDIO.products[0].delivery },
            ]} />
          </div>
          <BeforeAfter />
        </div>
      </section>

      {/* 8 — proof */}
      <section className="wrap sec" id="proof">
        <SectionHead eyebrow="Proof" title="What happened|when brands tried it.">
          <span className="proof__stats"><b className="num">{PROOF.views}</b> views · <b className="num">{PROOF.engagement}</b> average engagement on paid posts, from {PROOF.reports} campaign reports.</span>
        </SectionHead>
        <div className="grid-3">
          {HOME_CASES.map((c) => <CaseCard key={c.slug} c={c} lang={lang} />)}
        </div>
        <div className="row proof__cta">
          <Cta lang={lang} to="/creators" cta="proof_search_creators">{CTA.search}</Cta>
          <TLink lang={lang} to="/case-studies" cta="home_all_cases">See all case studies</TLink>
        </div>
      </section>

      {/* 9 — Connect your AI */}
      <section className="wrap sec" id="ai">
        <div className="band band--accent ai">
          <div>
            <p className="eyebrow">Connect your AI <span className="tag tag--dark">New</span> <RoadmapTag status="live" /></p>
            <h2 className="h2">Use MegaEvolution<span className="it">from Claude or ChatGPT.</span></h2>
            <p className="ai__text">Add one connector and ask in plain words. Search creators, check orders and draft replies without opening a dashboard.</p>
            <div className="row">
              <Cta lang={lang} to="/connect-ai" cta="home_connect_ai" variant="dark">Connect your AI</Cta>
              <code className="ai__url">{MCP_URL}</code>
            </div>
          </div>
          <ul className="ai__prompts" aria-label="Example prompts">
            {PROMPTS.map((p, i) => <li key={i} className={`ai__p ai__p--${i}`}><Icon name="sparkle" size={15} />{p}</li>)}
          </ul>
        </div>
      </section>

      {/* 10 — creators and MCNs */}
      <section className="wrap sec" id="join">
        <div className="grid-2 join">
          <Link className="card card--pad join__card" href={href(lang, '/for-creators')} data-cta="home_create_profile" prefetch={false}>
            <div className="join__av">{FEATURED.slice(4, 7).map((c) => <Avatar key={c.handle} c={c} size={40} />)}</div>
            <p className="eyebrow eyebrow--plain">For creators</p>
            <h3 className="h3">Create your creator profile</h3>
            <p className="muted">Set My Rates once, in your own currency. Brands see your price and order directly.</p>
            <span className="tlink">Create your profile<Arrow size={15} /></span>
          </Link>
          <Link className="card card--pad join__card" href={href(lang, '/mcn')} data-cta="home_bring_mcn" prefetch={false}>
            <div className="join__av"><span className="join__logo">LT</span><span className="join__logo join__logo--2">SW</span></div>
            <p className="eyebrow eyebrow--plain">For MCNs</p>
            <h3 className="h3">Bring your MCN</h3>
            <p className="muted">A public page for your roster, a talent dashboard and contracts in one place.</p>
            <span className="tlink">Apply as an MCN<Arrow size={15} /></span>
          </Link>
        </div>
      </section>

      {/* 11 — FAQ */}
      <section className="wrap sec" id="faq">
        <div className="faqwrap">
          <SectionHead eyebrow="FAQ" title="Before you|ask us." />
          <Faq items={HOME_FAQ} />
        </div>
      </section>

      {/* 12 — start a campaign: the brief form */}
      <section className="wrap sec" id="brief">
        <BriefForm lang={lang} />
        <ul className="bf__ok">{PROOF.approvals.map((a) => <li key={a}><Icon name="check" size={15} />{a}</li>)}</ul>
      </section>

      <StickyCta lang={lang} to="/creators" cta="search_creators" label={CTA.search} />
    </>
  )
}
