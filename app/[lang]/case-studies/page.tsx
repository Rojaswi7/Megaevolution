// Case studies listing. Only the public figures in data/cases.ts are shown.
import Link from 'next/link'
import '@/styles/agency.css'
import '@/styles/cases.css'
import { PROOF, CTA, href } from '@/data/site'
import { CASES } from '@/data/cases'
import { marketBySlug } from '@/data/markets'
import { pageMeta, itemListLd } from '@/lib/seo'
import { Cta, TLink, SectionHead, JsonLd, Breadcrumbs, StickyCta } from '@/components/ui'
import { Arrow, Flag } from '@/components/Icon'
import { CaseMeta, CaseTile } from '@/components/CaseTile'

type P = { params: Promise<{ lang: string }> }
const PATH = '/case-studies'

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({
    lang, path: PATH, title: 'Influencer Marketing Case Studies — JINRO, Rejuran and More',
    description: 'Real campaign results: 670 creators in 14 countries for JINRO, +1,502% TikTok Shop GMV for Rejuran in the Philippines, and 10× sales volume for a beauty company in one month.',
  })
}

const TONES = ['accent', 'light', 'dark'] as const

export default async function CaseStudies({ params }: P) {
  const { lang } = await params
  const [feat, ...rest] = CASES
  const [head, tail] = feat.title.includes(': ') ? feat.title.split(': ') : [feat.title, '']
  const featMarkets = feat.markets.map((s) => marketBySlug[s]).filter(Boolean)
  return (
    <>
      <JsonLd data={itemListLd(CASES.map((c) => ({ name: c.title, url: `${PATH}/${c.slug}` })))} />
      <div className="wrap"><Breadcrumbs lang={lang} items={[{ name: 'Case studies', path: PATH }]} /></div>

      <section className="wrap cs-sec">
        <SectionHead as="h1" eyebrow="Case studies" title="What happened|when brands tried it.">
          What the client wanted, what they got, and what they said about it. Where a client asked us not to share something, we left it out.
        </SectionHead>
        <ul className="cs-proof" aria-label="Across all campaigns">
          <li><b className="num">{PROOF.creators}</b>creators worked with</li>
          <li><b className="num">{PROOF.views}</b>views</li>
          <li><b className="num">{PROOF.engagement}</b>average engagement on paid posts, from {PROOF.reports} reports</li>
        </ul>

        <article className="cs-feat on-dark">
          <div className="cs-feat__copy">
            <CaseMeta c={feat} />
            <h2 className="h1">{head}{tail ? <span className="it">{tail}</span> : null}</h2>
            <p className="lede">{feat.achieved}</p>
            <div className="cs-feat__cta">
              <Link className="btn" href={href(lang, `${PATH}/${feat.slug}`)} data-cta="case_feature_open" prefetch={false}>Read the case<Arrow /></Link>
              {featMarkets.length ? (
                <span className="cs-feat__flags">{featMarkets.map((m) => <Flag key={m.id} market={m.id} title={m.name} />)}{feat.target ? <small>{feat.target} in total</small> : null}</span>
              ) : null}
            </div>
          </div>
          <ul className="cs-feat__stats">
            {feat.stats.map((s) => <li key={s.label}><b className="num">{s.value}</b><span>{s.label}</span></li>)}
          </ul>
        </article>

        <div className="cs-grid">
          {rest.map((c, i) => <CaseTile key={c.slug} c={c} lang={lang} tone={TONES[i % TONES.length]} />)}
        </div>
      </section>

      <section className="wrap cs-sec">
        <div className="cs-next">
          <p className="cs-next__no" aria-hidden="true">05</p>
          <div>
            <h2 className="h2">Your brand<span className="it">could be case 05.</span></h2>
            <p>Tell us the product and the markets. A campaign manager comes back with creators, prices and a plan within one business day.</p>
          </div>
          <div className="cs-next__cta">
            <Cta lang={lang} to="/about-agency#inquiry" cta="cases_explore_options" variant="dark" size="lg">{CTA.agency}</Cta>
            <TLink lang={lang} to="/creators" cta="cases_to_search">Or search creators yourself</TLink>
          </div>
        </div>
      </section>

      <StickyCta lang={lang} to="/about-agency#inquiry" cta="agency_inquiry" label={CTA.agency} />
    </>
  )
}
