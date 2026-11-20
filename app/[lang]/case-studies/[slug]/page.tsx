// Case study detail. Flexible format: any empty field (goal, achieved, feedback, markets) is left out.
import Link from 'next/link'
import { notFound } from 'next/navigation'
import '@/styles/agency.css'
import '@/styles/cases.css'
import { href, CTA, LOCALES } from '@/data/site'
import { CASES, caseBySlug } from '@/data/cases'
import { marketBySlug } from '@/data/markets'
import { pageMeta, articleLd } from '@/lib/seo'
import { fmtDate } from '@/lib/format'
import { Cta, TLink, SectionHead, JsonLd, Breadcrumbs, StickyCta } from '@/components/ui'
import { Flag } from '@/components/Icon'
import { CaseMeta, CaseTile } from '@/components/CaseTile'

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
        <header className="wrap cs-sec">
          <div className="cs-feat on-dark">
            <div className="cs-feat__copy">
              <CaseMeta c={c} />
              <h1 className="h1">{head}{tail ? <span className="it">{tail}</span> : null}</h1>
              <p className="lede">{c.summary}</p>
            </div>
            {c.stats.length ? (
              <ul className={`cs-feat__stats ${c.stats.length === 1 ? 'cs-feat__stats--one' : ''}`}>
                {c.stats.map((s) => <li key={s.label}><b className="num">{s.value}</b><span>{s.label}</span></li>)}
              </ul>
            ) : null}
          </div>
        </header>

        <section className="wrap cs-sec" aria-label="The story">
          <ol className="cs-story">
            {c.goal ? <li><span className="cs-story__n">01</span><h2 className="cs-story__k">Client goal</h2><p>{c.goal}</p></li> : null}
            {c.achieved ? <li className="cs-story--result"><span className="cs-story__n">02</span><h2 className="cs-story__k">What they achieved</h2><p>{c.achieved}</p></li> : null}
            {c.feedback ? (
              <li className="cs-story--quote on-dark">
                <span className="cs-story__n">03</span><h2 className="cs-story__k">Their feedback</h2>
                <blockquote><q>{c.feedback}</q></blockquote>
                {c.feedbackBy ? <cite>{c.feedbackBy}, {c.client}</cite> : null}
              </li>
            ) : (
              <li className="cs-story--quote on-dark">
                <span className="cs-story__n">03</span><h2 className="cs-story__k">Want the same?</h2>
                <p>Tell us the product and the markets. A campaign manager replies within one business day.</p>
                <Cta lang={lang} to="/about-agency#inquiry" cta="case_story_explore_options" size="sm">{CTA.agency}</Cta>
              </li>
            )}
          </ol>

          <dl className="cs-facts">
            <div><dt>Client</dt><dd>{c.client}</dd></div>
            {c.category ? <div><dt>Category</dt><dd>{c.category}</dd></div> : null}
            {c.origin ? <div><dt>Brand origin</dt><dd>{c.origin}</dd></div> : null}
            {c.target ? <div><dt>Target market</dt><dd>{c.target}</dd></div> : null}
            <div><dt>Published</dt><dd><time dateTime={c.date}>{fmtDate(c.date)}</time></dd></div>
            <div className="cs-facts__mk">
              <dt>Markets in this case</dt>
              <dd>
                {markets.length ? markets.map((m) => (
                  <Link key={m.id} href={href(lang, `/markets/${m.slug}`)} data-cta="case_market_link" prefetch={false} aria-label={`Influencer marketing in ${m.name}`}><Flag market={m.id} />{m.name}</Link>
                )) : <Link href={href(lang, '/markets')} data-cta="case_all_markets" prefetch={false}>See all markets</Link>}
              </dd>
            </div>
          </dl>
        </section>
      </article>

      <section className="wrap cs-sec">
        <SectionHead eyebrow="More cases" title="Other campaigns|we ran." />
        <div className="cs-grid">{others.map((o, i) => <CaseTile key={o.slug} c={o} lang={lang} tone={(['light', 'accent', 'dark'] as const)[i % 3]} />)}</div>
        <div className="ag-after">
          <Cta lang={lang} to="/about-agency#inquiry" cta="case_bottom_explore_options">{CTA.agency}</Cta>
          <TLink lang={lang} to="/case-studies" cta="case_all_cases">See all case studies</TLink>
        </div>
      </section>

      <StickyCta lang={lang} to="/about-agency#inquiry" cta="agency_inquiry" label={CTA.agency} />
    </>
  )
}
