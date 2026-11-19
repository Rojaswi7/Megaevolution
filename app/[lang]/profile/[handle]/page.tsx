// Creator profile. Public URL is /@handle (rewritten here — see next.config.mjs).
// Job: turn a brand into an order. Primary CTA: "Order a package".
import Link from 'next/link'
import { notFound } from 'next/navigation'
import '@/styles/creators.css'
import '@/styles/workspace.css'
import { href, LOCALES, SITE_URL } from '@/data/site'
import { CREATORS, creatorByHandle, creatorsIn, captionMix } from '@/data/creators'
import { marketById } from '@/data/markets'
import { categoryBySlug } from '@/data/categories'
import { packagesFor, audienceFor } from '@/data/rates'
import { mcnBySlug, MCNS } from '@/data/mcns'
import { STUDIO } from '@/data/pricing'
import { pageMeta, abs } from '@/lib/seo'
import { compact, localMoney } from '@/lib/format'
import { Breadcrumbs, JsonLd, RoadmapTag, StickyCta, Cta, TLink } from '@/components/ui'
import { Flag, Icon, PlatformIcon, Arrow } from '@/components/Icon'
import { Avatar, Thumb, Verified, CreatorCard } from '@/components/CreatorCard'
import { SaveButton, GatedButton } from '@/components/client'
import { Money } from '@/components/Money'
import { RateCard, AudiencePanel } from '@/components/creators/ProfileClient'

type P = { params: Promise<{ lang: string; handle: string }> }

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => CREATORS.map((c) => ({ lang, handle: c.handle })))
}
export const dynamicParams = false

export async function generateMetadata({ params }: P) {
  const { lang, handle } = await params
  const c = creatorByHandle[decodeURIComponent(handle)]
  if (!c) return {}
  const m = marketById[c.market]
  const cat = categoryBySlug[c.category]
  const plats = c.platforms.map((p) => p.platform).join(', ')
  return pageMeta({
    lang, path: `/@${c.handle}`, type: 'profile', ogImage: `/og/creator/${c.handle}.png`,
    title: `@${c.handle} — ${cat.label} Creator in ${m.name} · Rates & Audience`,
    description: `${c.name} (@${c.handle}) is a ${cat.noun} creator in ${c.city}, ${m.name} on ${plats}: ${compact(c.followers)} followers, ${c.er}% engagement. See rates from ${localMoney(c.rateLocal, c.currency)} and order a package.`,
  })
}

export default async function Profile({ params }: P) {
  const { lang, handle } = await params
  const c = creatorByHandle[decodeURIComponent(handle)]
  if (!c) notFound()
  const m = marketById[c.market]
  const cat = categoryBySlug[c.category]
  const packages = packagesFor(c)
  const audience = audienceFor(c, m.name)
  const similar = creatorsIn(c.market, c.category).filter((x) => x.handle !== c.handle).slice(0, 4)
  const mcn = c.mcn ? MCNS.find((x) => x.name === c.mcn) : null
  const first = c.name.split(' ')[0]
  const mix = captionMix(c)
  const tiles = [0, 1, 2, 3, 4, 5].map((i) => ({ caption: mix[i], tone: (c.tone + i * 3) % 8, views: Math.round(c.avgViews * [1.4, 0.8, 1.1, 0.6, 2.1, 0.9][i]), platform: c.platforms[i % c.platforms.length].platform }))

  const ld = {
    '@context': 'https://schema.org', '@type': 'ProfilePage', url: abs(href(lang, `/@${c.handle}`)), dateModified: '2026-11-19',
    mainEntity: {
      '@type': 'Person', name: c.name, alternateName: `@${c.handle}`, identifier: c.handle, description: c.bio,
      homeLocation: { '@type': 'Place', name: `${c.city}, ${m.name}` }, knowsLanguage: c.langs,
      interactionStatistic: [{ '@type': 'InteractionCounter', interactionType: 'https://schema.org/FollowAction', userInteractionCount: c.followers }],
      makesOffer: { '@type': 'Offer', price: String(c.rateUsd), priceCurrency: 'USD', description: `Sponsored ${cat.noun} content from ${localMoney(c.rateLocal, c.currency)}`, url: `${SITE_URL}/@${c.handle}#rates` },
    },
  }

  return (
    <>
      <JsonLd data={ld} />
      <div className="wrap">
        <Breadcrumbs lang={lang} items={[
          { name: 'Creators', path: '/creators' },
          { name: m.name, path: `/creators/${m.slug}` },
          { name: cat.label, path: `/creators/${m.slug}/${c.category}` },
          { name: `@${c.handle}`, path: `/@${c.handle}` },
        ]} />

        <div className="cr-prof">
          <div className="cr-main">
            <header className="cr-head">
              <Avatar c={{ name: c.name, tone: (c.tone + 5) % 8 }} size={104} />
              <div className="cr-head__id">
                <h1 className="cr-head__h">@{c.handle}{c.verified ? <Verified /> : null}</h1>
                <p className="cr-head__name">{c.name} <span className="sr">(full name)</span></p>
                <p className="cr-head__meta">
                  <Link href={href(lang, `/creators/${m.slug}`)} prefetch={false}><Flag market={c.market} title={m.name} />{c.city}, {m.name}</Link>
                  <Link href={href(lang, `/creators/${m.slug}/${c.category}`)} className="tag" prefetch={false}>{cat.label}</Link>
                  <span>{c.langs.join(' · ')}</span>
                </p>
                <p className="cr-head__bio">{c.bio}</p>
                {mcn ? <p className="cr-head__mcn"><Icon name="building" size={14} />Managed by <Link className="ulink" href={href(lang, `/mcn/${mcn.slug}`)} prefetch={false}>{mcn.name}</Link></p> : null}
                <div className="row cr-head__act">
                  <a className="btn" href="#rates" data-cta="profile_order_package_top">Order a package<Arrow /></a>
                  <SaveButton handle={c.handle} label />
                  <GatedButton lang={lang} reason="export_pdf_profile" title="Export this profile as a PDF" text="Create a free account to export rate cards and audience analytics as a PDF, in your language.">Export as PDF</GatedButton>
                  <RoadmapTag status="dev" />
                </div>
              </div>
            </header>

            <section className="cr-plats" aria-label="Channel numbers">
              {c.platforms.map((p) => (
                <div className="cr-plat" key={p.platform}>
                  <p className="cr-plat__n"><PlatformIcon name={p.platform} size={18} />{p.platform}</p>
                  <dl>
                    <div><dt>Followers</dt><dd className="num">{compact(p.followers)}</dd></div>
                    <div><dt>Avg views</dt><dd className="num">{compact(p.avgViews)}</dd></div>
                    <div><dt>Engagement</dt><dd className="num">{p.er}%</dd></div>
                    <div><dt>Posts</dt><dd className="num">{p.posts}</dd></div>
                  </dl>
                </div>
              ))}
              <div className="cr-plat cr-plat--soon" title="Coming soon: TikTok Shop sales per creator">
                <p className="cr-plat__n"><Icon name="bag" size={18} />TikTok Shop sales <RoadmapTag status="planned" /></p>
                <p className="small muted">Coming soon: sales per creator and product. <Link className="ulink" href={href(lang, '/tools/commerce-data')} data-cta="profile_commerce_waitlist" prefetch={false}>Join the waitlist</Link></p>
              </div>
            </section>

            <section aria-labelledby="h-recent">
              <h2 className="h3 cr-h" id="h-recent">Recent content</h2>
              <div className="cr-tiles">
                {tiles.map((t, i) => <Thumb key={i} c={c} caption={t.caption} tone={t.tone} views={t.views} platform={t.platform} ratio="9 / 14" />)}
              </div>
              <p className="small muted cr-note">Sample tiles. Real profiles show the creator’s latest posts with a poster image, loaded as you scroll.</p>
            </section>

            <AudiencePanel lang={lang} handle={c.handle} audience={audience} />

            <section className="cr-cross2">
              <div className="card card--pad">
                <p className="eyebrow eyebrow--plain">Video Editing Studio</p>
                <h2 className="h3">Need {first}’s video edited?</h2>
                <p className="muted">Add editing <Money usd={STUDIO.addOnFrom} from />. Our editors cut ad-ready versions from the raw footage.</p>
                <TLink lang={lang} to="/video-editing" cta="profile_cross_sell_editing">Order a video</TLink>
              </div>
              <div className="card card--pad cr-cross2__dark">
                <p className="eyebrow eyebrow--plain">Agency</p>
                <h2 className="h3">Run a multi-country campaign with a manager</h2>
                <p>One account manager, a local manager in {m.name} and every other market.</p>
                <TLink lang={lang} to={`/about-agency?market=${m.slug}`} cta="profile_cross_sell_agency">Explore your campaign options</TLink>
              </div>
            </section>
          </div>

          <aside className="cr-side">
            <RateCard lang={lang} handle={c.handle} name={c.name} currency={c.currency} packages={packages} />
          </aside>
        </div>

        {similar.length ? (
          <section className="sec--tight cr-similar" aria-labelledby="h-similar">
            <div className="cr-similar__head">
              <h2 className="h3" id="h-similar">More {cat.noun} creators in {m.name}</h2>
              <TLink lang={lang} to={`/creators/${m.slug}/${c.category}`} cta="profile_see_hub">See all {cat.noun} creators in {m.short}</TLink>
            </div>
            <div className="cgrid">{similar.map((s) => <CreatorCard key={s.handle} c={s} lang={lang} />)}</div>
            <p className="cr-hublinks">
              Also browse <Link className="ulink" href={href(lang, `/creators/${m.slug}`)} prefetch={false}>all creators in {m.name}</Link>, read about <Link className="ulink" href={href(lang, `/markets/${m.slug}`)} prefetch={false}>influencer marketing in {m.name}</Link>, or <Link className="ulink" href={href(lang, '/creators')} prefetch={false}>search every market</Link>.
            </p>
          </section>
        ) : null}
      </div>

      <StickyCta lang={lang} to={`/@${c.handle}#rates`} cta="order_package" label="Order a package" note={`from ${localMoney(c.rateLocal, c.currency)}`} />
    </>
  )
}
