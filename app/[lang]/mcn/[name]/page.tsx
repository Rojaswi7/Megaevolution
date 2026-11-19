// Sample MCN public page — what the homepage builder produces. SAMPLE DATA (data/mcns.ts).
import { notFound } from 'next/navigation'
import '@/styles/content.css'
import { MCNS, mcnBySlug, rosterOf } from '@/data/mcns'
import { marketById } from '@/data/markets'
import { pageMeta } from '@/lib/seo'
import { Cta, TLink, SectionHead, Breadcrumbs, RoadmapTag, StickyCta, Stat } from '@/components/ui'
import { Flag } from '@/components/Icon'
import { CreatorCard } from '@/components/CreatorCard'
import { McnContactForm } from '@/components/content/Interactive'

type P = { params: Promise<{ lang: string; name: string }> }
export const dynamicParams = false
export function generateStaticParams() { return MCNS.map((m) => ({ name: m.slug })) }

export async function generateMetadata({ params }: P) {
  const { lang, name } = await params
  const m = mcnBySlug[name]
  if (!m) return {}
  return pageMeta({ lang, path: `/mcn/${m.slug}`, title: `${m.name} — ${marketById[m.market].adjective} Creator MCN in ${m.city}`, description: `${m.tagline} See the ${m.name} roster, services and contact details on MegaEvolution.` })
}

export default async function McnPublicPage({ params }: P) {
  const { lang, name } = await params
  const m = mcnBySlug[name]
  if (!m) notFound()
  const market = marketById[m.market]
  const roster = rosterOf(m.name).sort((a, b) => b.followers - a.followers).slice(0, 8)
  return (
    <>
      <div className="wrap">
        <Breadcrumbs lang={lang} items={[{ name: 'For MCNs', path: '/mcn' }, { name: m.name, path: `/mcn/${m.slug}` }]} />
        <header className="slab ct-mcn__head">
          <span className="ct-mcn__logo" aria-hidden="true">{m.initials}</span>
          <div>
            <p className="eyebrow">MCN · Template: {m.template} <RoadmapTag status="planned" /></p>
            <h1 className="h1" style={{ marginTop: 12 }}>{m.name}</h1>
            <p><Flag market={m.market} title={market.name} />{m.city}, {market.name} · {m.tagline}</p>
          </div>
          <div className="ct-mcn__stats">{m.stats.map((s) => <Stat key={s.label} value={s.value} label={s.label} />)}</div>
        </header>
      </div>

      <section className="wrap sec--tight">
        <div className="ct-mcn__body">
          <div className="card card--pad stack">
            <p className="eyebrow eyebrow--plain">About</p>
            <p className="lede" style={{ maxWidth: 'none' }}>{m.about}</p>
            <p className="eyebrow eyebrow--plain" style={{ marginTop: 10 }}>Services</p>
            <ul className="ct-mcn__services">{m.services.map((s, i) => <li key={s}><small>{i + 1}</small>{s}</li>)}</ul>
          </div>
          <div className="card card--pad stack" id="contact">
            <p className="eyebrow eyebrow--plain">Work with {m.name}</p>
            <h2 className="h3">Send a request</h2>
            <McnContactForm mcn={m.name} slug={m.slug} />
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <SectionHead eyebrow="Roster" title={`Creators signed to|${m.name}.`}>Numbers come from each creator’s own profile. Sample profiles for the mockup.</SectionHead>
        {roster.length ? <div className="cgrid">{roster.map((c) => <CreatorCard key={c.handle} c={c} lang={lang} />)}</div> : <p className="muted">The roster block is empty in this sample.</p>}
        <div className="row" style={{ marginTop: 26 }}>
          <Cta lang={lang} to={`/creators/${market.slug}`} cta="mcn_page_search_country">Search creators in {market.short}</Cta>
          <TLink lang={lang} to="/about-agency" cta="mcn_page_agency">Run a multi-country campaign with a manager</TLink>
        </div>
      </section>

      <section className="wrap">
        <div className="band band--accent ct-app" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
          <div>
            <p className="eyebrow">For creators</p>
            <h2 className="h2" style={{ marginTop: 12 }}>Are you a creator?<span className="it">Join {m.name}.</span></h2>
            <p style={{ marginTop: 14, maxWidth: '48ch' }}>Sign up with this link and “Join {m.name} as my MCN” is ticked for you. {m.name} reviews your application.</p>
          </div>
          <Cta lang={lang} to={`/signup?as=creator&mcn=${m.slug}`} cta="mcn_page_join" variant="dark" size="lg">Join {m.name}</Cta>
        </div>
        <p className="ct-made">Made with the MegaEvolution homepage builder · later on a custom domain <TLink lang={lang} to="/mcn" cta="mcn_page_made_with">Build a page for your MCN</TLink></p>
      </section>
      <StickyCta lang={lang} to={`/signup?as=creator&mcn=${m.slug}`} cta="join_mcn" label={`Join ${m.name}`} />
    </>
  )
}
