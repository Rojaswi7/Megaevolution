// Market page, built for "influencer marketing [country]".
// Intro = market fact + season (data/markets.ts) + the public copy from the current site (strengths()).
import Link from 'next/link'
import { notFound } from 'next/navigation'
import '@/styles/agency.css'
import { href, LOCALES } from '@/data/site'
import { MARKETS, marketBySlug, strengths, LOGO_PLATFORMS } from '@/data/markets'
import { categoryBySlug } from '@/data/categories'
import { creatorsIn } from '@/data/creators'
import { CASES } from '@/data/cases'
import { pageMeta, serviceLd } from '@/lib/seo'
import { Cta, TLink, SectionHead, JsonLd, Breadcrumbs, StickyCta, Todo } from '@/components/ui'
import { Flag, Icon, PlatformIcon, Arrow } from '@/components/Icon'
import { CreatorCard } from '@/components/CreatorCard'
import FaqCards from '@/components/home/FaqCards'
import { CaseCard } from '@/components/CaseCard'

type P = { params: Promise<{ lang: string; country: string }> }
export const dynamicParams = false
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => MARKETS.map((m) => ({ lang, country: m.slug })))
}

const logos = (list: string[]) => list.filter((p) => LOGO_PLATFORMS.includes(p))
const listText = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}` : a[0])

export async function generateMetadata({ params }: P) {
  const { lang, country } = await params
  const m = marketBySlug[country]
  if (!m) return {}
  return pageMeta({
    lang, path: `/markets/${m.slug}`,
    title: `Influencer Marketing in ${m.name} · ${m.watches.slice(0, 3).join(', ')} Creators`,
    description: `Run influencer campaigns in ${m.name} with a local manager in ${m.city}. See what ${m.adjective} audiences watch (${m.watches.slice(0, 3).join(', ')}), where they shop (${m.shops.slice(0, 2).join(', ')}) and which creators to book.`,
  })
}

export default async function MarketPage({ params }: P) {
  const { lang, country } = await params
  const m = marketBySlug[country]
  if (!m) notFound()
  const path = `/markets/${m.slug}`
  // some markets only have the generic template on the live site; use the copy only where it is market-specific
  const raw = strengths(m.id)
  const s = raw && !/^Why brands use us/.test(raw.summary || '') ? raw : null
  const creators = creatorsIn(m.id).slice(0, 8)
  const total = creatorsIn(m.id).length
  const cases = CASES.filter((c) => c.markets.includes(m.slug)).slice(0, 3)
  const cats = m.strong.map((c) => categoryBySlug[c])
  const talk = `/about-agency?market=${m.slug}#inquiry`

  const faq = [
    { q: `Which platforms matter most for influencer marketing in ${m.name}?`, a: `${listText(m.watches.slice(0, 3))} are the most watched, in that order.${m.watches.length > 3 ? ` ${listText(m.watches.slice(3))} also ${m.watches.length > 4 ? 'matter' : 'matters'} locally.` : ''} ${m.fact}` },
    { q: `Where do people in ${m.name} shop online?`, a: `Mostly on ${listText(m.shops)}. We link creator content to the shop your product is listed on.` },
    { q: `When should a campaign in ${m.name} run?`, a: `The biggest selling seasons are ${m.season}. Creators book up early for these, so plan ahead.` },
    { q: `Which creator categories are strongest in ${m.name}?`, a: `${listText(cats.map((c) => c.label))}. You can browse ${m.adjective} creators in each category, with starting rates in ${m.currency}.` },
  ]

  return (
    <>
      <JsonLd data={serviceLd({ name: `Influencer marketing in ${m.name}`, description: m.fact, path: href(lang, path), areaServed: [m.name] })} />
      <div className="wrap"><Breadcrumbs lang={lang} items={[{ name: 'Markets', path: '/markets' }, { name: m.name, path }]} /></div>

      {/* hero */}
      <section className="wrap">
        <div className="slab ag-mhero">
          <div>
            <p className="ag-mhero__flag"><Flag market={m.id} /><span className="eyebrow eyebrow--plain">{m.city} · {m.langs.join(', ')}</span></p>
            <h1 className="h1">Influencer marketing<span className="it">in {m.name}.</span></h1>
            <p className="lede">{m.fact}</p>
            {s?.summary ? <p className="body-2">{s.summary}</p> : null}
            <div className="ag-mhero__cta">
              <Cta lang={lang} to={`/creators/${m.slug}`} cta="market_search_creators" size="lg">Search creators in {m.short}</Cta>
              <TLink lang={lang} to={talk} cta="market_talk_to_manager">Talk to our {m.short} manager</TLink>
            </div>
          </div>
          <aside className="ag-mgr" aria-label="Local manager">
            <Todo label="TODO: real photo" ratio="4 / 3" />
            <div><b>{m.manager.role}</b><small>Based in {m.city}. Works with {m.adjective} creators directly, in {m.langs[0]}.</small></div>
          </aside>
        </div>
      </section>

      {/* watches / shops / categories */}
      <section className="wrap sec" aria-label={`${m.name} at a glance`}>
        <div className="ag-facts">
          <div className="ag-fact">
            <h2>What {m.short} watches</h2>
            <ol className="ag-rank">
              {m.watches.map((p, i) => <li key={p}><small>{i + 1}</small>{LOGO_PLATFORMS.includes(p) ? <PlatformIcon name={p} size={19} /> : null}{p}</li>)}
            </ol>
          </div>
          <div className="ag-fact">
            <h2>Where {m.short} shops</h2>
            <ul className="ag-shops">{m.shops.map((x) => <li className="chip" key={x}>{x}</li>)}</ul>
            <p>Biggest selling seasons: {m.season}.</p>
          </div>
          <div className="ag-fact">
            <h2>Strongest categories</h2>
            <nav className="ag-cats" aria-label={`Creator categories in ${m.name}`}>
              {cats.map((c) => (
                <Link key={c.slug} href={href(lang, `/creators/${m.slug}/${c.slug}`)} data-cta="market_category_hub" prefetch={false}>
                  <span><Icon name={c.icon} size={17} />{c.label} creators in {m.short}</span><Arrow size={15} />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* creators */}
      <section className="wrap sec">
        <SectionHead eyebrow={`Creators · ${total} in ${m.short}`} title={`${m.adjective} creators|you can book.`}>
          Starting rates are in {m.currency}, converted to your currency. {logos(m.watches).length ? `Covers ${listText(logos(m.watches))}.` : 'Local platforms are handled by our team.'}
        </SectionHead>
        <div className="cgrid">{creators.map((c) => <CreatorCard key={c.handle} c={c} lang={lang} />)}</div>
        <div className="ag-after">
          <Cta lang={lang} to={`/creators/${m.slug}`} cta="market_all_creators">Search creators in {m.short}</Cta>
          <span className="small muted">Sample profiles for the mockup.</span>
        </div>
      </section>

      {/* hard / different — copy from the current megaevolution.io market pages */}
      {s?.hard?.length && s?.different?.length ? (
        <section className="wrap sec">
          <SectionHead eyebrow="On the ground" title={`What makes ${m.short} hard,|and what we do about it.`} />
          <div className="ag-hd">
            <div className="ag-hd__c"><h3>What’s hard</h3><ul>{s.hard.map((t: string) => <li key={t}>{t}</li>)}</ul></div>
            <div className="ag-hd__c ag-hd__c--dark"><h3>What we do differently</h3><ul>{s.different.map((t: string) => <li key={t}>{t}</li>)}</ul></div>
          </div>
        </section>
      ) : null}

      {cases.length ? (
        <section className="wrap sec">
          <SectionHead eyebrow="Proof" title={`Campaigns that ran|in ${m.name}.`} />
          <div className="grid-3">{cases.map((c) => <CaseCard key={c.slug} c={c} lang={lang} />)}</div>
        </section>
      ) : null}

      {/* talk to the manager */}
      <section className="wrap sec">
        <div className="slab ag-talk">
          <div>
            <h2 className="h2">Want someone in {m.city}<span className="it">to run it for you?</span></h2>
            <p className="lede">Our {m.short} manager casts the creators, localises the brief and gets the posts live. You talk to one account manager. No brief needed.</p>
          </div>
          <div className="ag-talk__cta">
            <Cta lang={lang} to={talk} cta="market_talk_to_manager_band" size="lg">Talk to our {m.short} manager</Cta>
            <TLink lang={lang} to="/about-agency#how" cta="market_how_we_work">How we work</TLink>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="wrap sec">
        <FaqCards lang={lang} items={faq} title={`${m.name},|in short.`} />
      </section>

      {/* nearby */}
      <section className="wrap sec" aria-labelledby="near">
        <p className="eyebrow" id="near" style={{ marginBottom: 14 }}>Nearby markets</p>
        <nav className="ag-near" aria-label="Nearby markets">
          {m.near.map((slug) => marketBySlug[slug]).filter(Boolean).map((n) => (
            <Link key={n.id} className="chip" href={href(lang, `/markets/${n.slug}`)} data-cta="market_nearby" prefetch={false}><Flag market={n.id} />Influencer marketing in {n.name}</Link>
          ))}
          <Link className="chip" href={href(lang, '/markets')} data-cta="market_all_markets" prefetch={false}>All markets</Link>
        </nav>
      </section>

      <StickyCta lang={lang} to={`/creators/${m.slug}`} cta="search_creators_in_country" label={`Search creators in ${m.short}`} />
    </>
  )
}
