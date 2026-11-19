// Case study detail. Flexible format: any empty field (goal, achieved, feedback, markets) is left out.
import Link from 'next/link'
import { notFound } from 'next/navigation'
import '@/styles/agency.css'
import { href, CTA, LOCALES } from '@/data/site'
import { CASES, caseBySlug } from '@/data/cases'
import { marketBySlug } from '@/data/markets'
import { pageMeta, articleLd } from '@/lib/seo'
import { fmtDate } from '@/lib/format'
import { Cta, TLink, SectionHead, JsonLd, Breadcrumbs, StickyCta, Stat } from '@/components/ui'
import { Flag, Icon } from '@/components/Icon'
import { CaseCard } from '@/components/CaseCard'

type P = { params: Promise<{ lang: string; slug: string }> }
export const dynamicParams = false
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => CASES.map((c) => ({ lang, slug: c.slug })))
}

const describe = (slug: string) => { const c = caseBySlug[slug]; return `${c.summary} ${c.achieved}`.slice(0, 158) }

export async function generateMetadata({ params }: P) {
  const { lang, slug } = await params
  const c = caseBySlug[slug]
  if (!c) return {}
  return pageMeta({ lang, path: `/case-studies/${slug}`, title: `${c.title} — Case Study`, description: describe(slug), ogImage: `/og/case/${slug}.png`, type: 'article' })
}

export default async function CasePage({ params }: P) {
  const { lang, slug } = await params
  const c = caseBySlug[slug]
  if (!c) notFound()
  const path = `/case-studies/${slug}`
  const markets = c.markets.map((s) => marketBySlug[s]).filter(Boolean)
  const others = CASES.filter((x) => x.slug !== slug).slice(0, 3)
  const [head, tail] = c.title.includes(': ') ? c.title.split(': ') : [c.title, '']

  return (
    <>
      <JsonLd data={articleLd({ title: c.title, description: describe(slug), path: href(lang, path), date: c.date, image: `/og/case/${slug}.png` })} />
      <div className="wrap"><Breadcrumbs lang={lang} items={[{ name: 'Case studies', path: '/case-studies' }, { name: c.client, path }]} /></div>

      <article>
        <header className="wrap">
          <div className="slab ag-chero">
            <p className="case__meta">
              <span className="case__no">Case {c.no}</span>
              {c.category ? <span>{c.category}</span> : null}
              {c.origin || c.target ? <span>{[c.origin, c.target].filter(Boolean).join(' → ')}</span> : null}
            </p>
            <h1 className="h1">{head}{tail ? <span className="it">{tail}</span> : null}</h1>
            <p className="lede">{c.summary}</p>
            {c.stats.length ? <div className="ag-chero__stats">{c.stats.map((s) => <Stat key={s.label} value={s.value} label={s.label} />)}</div> : null}
          </div>
        </header>

        <section className="wrap sec">
          <div className="ag-cbody">
            <div className="ag-cbody__main">
              {c.goal ? <div><h2>Client goal</h2><p>{c.goal}</p></div> : null}
              {c.achieved ? <div><h2>What they achieved</h2><p>{c.achieved}</p></div> : null}
              {c.feedback ? (
                <figure className="ag-quote">
                  <blockquote><q>{c.feedback}</q></blockquote>
                  {c.feedbackBy ? <figcaption><cite>{c.feedbackBy}, {c.client}</cite></figcaption> : null}
                </figure>
              ) : null}
              <div className="ag-after" style={{ marginTop: 0 }}>
                <Cta lang={lang} to="/about-agency#inquiry" cta="case_explore_options" size="lg">{CTA.agency}</Cta>
                <TLink lang={lang} to="/about-agency#how" cta="case_how_we_work">How we work</TLink>
              </div>
            </div>

            <aside className="card card--pad ag-cside" aria-label="About this case">
              <dl>
                <div><dt>Client</dt><dd>{c.client}</dd></div>
                {c.category ? <div><dt>Category</dt><dd>{c.category}</dd></div> : null}
                {c.origin ? <div><dt>Brand origin</dt><dd>{c.origin}</dd></div> : null}
                {c.target ? <div><dt>Target market</dt><dd>{c.target}</dd></div> : null}
                <div><dt>Published</dt><dd><time dateTime={c.date}>{fmtDate(c.date)}</time></dd></div>
              </dl>
              {markets.length ? (
                <div>
                  <dl><dt style={{ marginBottom: 8 }}>Markets in this case</dt></dl>
                  <ul>
                    {markets.map((m) => (
                      <li key={m.id}><Link href={href(lang, `/markets/${m.slug}`)} data-cta="case_market_link" prefetch={false}><Flag market={m.id} />Influencer marketing in {m.name}<Icon name="chevronRight" size={13} /></Link></li>
                    ))}
                  </ul>
                </div>
              ) : (
                <TLink lang={lang} to="/markets" cta="case_all_markets">See all markets</TLink>
              )}
            </aside>
          </div>
        </section>
      </article>

      <section className="wrap sec">
        <SectionHead eyebrow="More cases" title="Other campaigns|we ran." />
        <div className="grid-3">{others.map((o) => <CaseCard key={o.slug} c={o} lang={lang} />)}</div>
        <div className="ag-after">
          <Cta lang={lang} to="/about-agency#inquiry" cta="case_bottom_explore_options">{CTA.agency}</Cta>
          <TLink lang={lang} to="/case-studies" cta="case_all_cases">See all case studies</TLink>
        </div>
      </section>

      <StickyCta lang={lang} to="/about-agency#inquiry" cta="agency_inquiry" label={CTA.agency} />
    </>
  )
}
