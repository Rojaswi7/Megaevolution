// Case studies listing. Only the public figures in data/cases.ts are shown.
import '@/styles/agency.css'
import { PROOF, CTA } from '@/data/site'
import { CASES } from '@/data/cases'
import { pageMeta, itemListLd } from '@/lib/seo'
import { Cta, TLink, SectionHead, JsonLd, Breadcrumbs, StickyCta, Stat } from '@/components/ui'
import { CaseCard } from '@/components/CaseCard'

type P = { params: Promise<{ lang: string }> }
const PATH = '/case-studies'

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({
    lang, path: PATH, title: 'Influencer Marketing Case Studies — JINRO, Rejuran and More',
    description: 'Real campaign results: 670 creators in 14 countries for JINRO, +1,502% TikTok Shop GMV for Rejuran in the Philippines, and 10× sales volume for a beauty company in one month.',
  })
}

export default async function CaseStudies({ params }: P) {
  const { lang } = await params
  return (
    <>
      <JsonLd data={itemListLd(CASES.map((c) => ({ name: c.title, url: `${PATH}/${c.slug}` })))} />
      <div className="wrap"><Breadcrumbs lang={lang} items={[{ name: 'Case studies', path: PATH }]} /></div>

      <section className="wrap phero">
        <SectionHead as="h1" eyebrow="Case studies" title="What happened|when brands tried it.">
          Each case follows the same order: what the client wanted, what they got, and what they said about it. Where a client asked us not to share something, we left it out.
        </SectionHead>
        <div className="ag-proof">
          <Stat value={PROOF.creators} label="creators worked with" />
          <Stat value={PROOF.views} label="views" />
          <Stat value={PROOF.engagement} label={`average engagement on paid posts, from ${PROOF.reports} campaign reports`} />
        </div>
        <div className="ag-cases">{CASES.map((c) => <CaseCard key={c.slug} c={c} lang={lang} />)}</div>
        <div className="ag-after">
          <Cta lang={lang} to="/about-agency#inquiry" cta="cases_explore_options" size="lg">{CTA.agency}</Cta>
          <TLink lang={lang} to="/creators" cta="cases_to_search">Or search creators yourself</TLink>
        </div>
      </section>

      <StickyCta lang={lang} to="/about-agency#inquiry" cta="agency_inquiry" label={CTA.agency} />
    </>
  )
}
