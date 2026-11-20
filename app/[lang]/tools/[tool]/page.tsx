// One SEO page per tool, with an interactive demo of the screen it will have.
import Link from 'next/link'
import { notFound } from 'next/navigation'
import '@/styles/tools.css'
import { href, CTA, LOCALES } from '@/data/site'
import { TOOLS, toolBySlug } from '@/data/tools'
import { TOOL_FROM, PAY_PER_USE, TOOL_PLANS } from '@/data/pricing'
import { pageMeta, productLd, offerLd, abs } from '@/lib/seo'
import { Cta, TLink, SectionHead, Breadcrumbs, JsonLd, RoadmapTag, StickyCta, Trust } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { Money } from '@/components/Money'
import ToolDemo from '@/components/tools/demos'
import FaqCards from '@/components/home/FaqCards'
import { planTrustItems } from '@/components/tools/shared'

type P = { params: Promise<{ lang: string; tool: string }> }
const ICON: Record<string, string> = { 'ai-listup': 'list', 'performance-report': 'chart', 'ai-video-edit': 'film', 'commerce-data': 'bag', 'script-studio': 'pen' }
// Headline split for the two-line title: bold line | italic line.
const HEAD: Record<string, string> = {
  'ai-listup': 'Paste a brief.|Get a checked creator list.',
  'performance-report': 'One campaign report|your client can read.',
  'ai-video-edit': 'From script or raw clip|to a sample video.',
  'commerce-data': 'See which creators|really sell.',
  'script-studio': 'Scripts that pass|the brand’s guidelines.',
}

export const dynamicParams = false
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => TOOLS.map((t) => ({ lang, tool: t.slug })))
}

export async function generateMetadata({ params }: P) {
  const { lang, tool } = await params
  const t = toolBySlug[tool]
  if (!t) return {}
  return pageMeta({ lang, path: `/tools/${t.slug}`, title: t.title, description: t.description })
}

export default async function ToolPage({ params }: P) {
  const { lang, tool } = await params
  const t = toolBySlug[tool]
  if (!t) notFound()
  const path = `/tools/${t.slug}`
  const ppu = (PAY_PER_USE as any)[t.slug]
  const tryLabel = t.comingSoon ? 'Join the waitlist' : `Try ${t.name}`
  const others = TOOLS.filter((x) => x.slug !== t.slug)
  const paid = TOOL_PLANS.filter((p) => typeof p.monthly !== 'number' || p.monthly > 0).filter((p) => !('contact' in p && p.contact))

  return (
    <>
      <JsonLd data={productLd({
        name: t.name, description: t.description, path,
        offers: [
          { ...offerLd(TOOL_FROM[t.slug], 'USD', abs('/pricing')), name: `${t.name} on a monthly plan` },
          { ...offerLd(ppu.price, 'USD', abs('/pricing#pay-per-use')), name: `${t.name}, ${ppu.unit}` },
        ],
      })} />

      <div className="wrap">
        <Breadcrumbs lang={lang} items={[{ name: 'Tools', path: '/tools' }, { name: t.name, path }]} />
        <header className="phero tl-thero">
          <div>
            <p className="eyebrow"><Icon name={ICON[t.slug]} size={15} />{t.name} {t.comingSoon ? <span className="tag tag--soon">Coming soon</span> : null} <RoadmapTag status={t.status} /></p>
            <h1 className="h1">{HEAD[t.slug].split('|')[0]}<span className="it">{HEAD[t.slug].split('|')[1]}</span></h1>
            <p className="lede">{t.description}</p>
            <div className="phero__cta">
              <a className="btn btn--lg" href="#demo" data-cta={`tool_hero_try_${t.slug}`}>{tryLabel}<Icon name="arrow" size={16} className="arr" stroke={1.9} /></a>
              <TLink lang={lang} to="/pricing" cta={`tool_hero_pricing_${t.slug}`}>See plans and pricing</TLink>
            </div>
          </div>
          <aside className="tl-thero__price" aria-label={`${t.name} pricing`}>
            <p className="tl-k">On a plan</p>
            <p className="tl-thero__amt"><b className="num"><Money usd={TOOL_FROM[t.slug]} from /></b><span>/month</span></p>
            <hr className="rule" />
            <p className="tl-k">Pay per use</p>
            <p className="tl-thero__amt"><b className="num"><Money usd={ppu.price} /></b><span>{ppu.unit}</span></p>
            <Cta lang={lang} to="/pricing" cta={`tool_price_choose_plan_${t.slug}`} block>{CTA.plan}</Cta>
            <Trust items={planTrustItems.slice(0, 2)} />
          </aside>
        </header>
      </div>

      {/* demo */}
      <section className="wrap sec--tight" id="demo" aria-labelledby="h-demo">
        <div className="tl-demohead">
          <h2 className="h3" id="h-demo">{t.comingSoon ? 'A first look' : 'Try it here'} <span className="it it--inline">with sample data</span></h2>
          <p className="small muted">A working mock of the real screen. Nothing you type is sent.</p>
        </div>
        <ToolDemo slug={t.slug} lang={lang} />
        <div className="row tl-after">
          <Cta lang={lang} to={t.comingSoon ? `${path}#demo` : `/signup?tool=${t.slug}`} cta={`tool_demo_cta_${t.slug}`}>{t.comingSoon ? 'Join the waitlist' : `Start free with ${t.name}`}</Cta>
          <TLink lang={lang} to="/pricing" cta={`tool_demo_pricing_${t.slug}`}>See plans and pricing</TLink>
        </div>
      </section>

      {/* how it works */}
      <section className="wrap sec" id="how">
        <SectionHead eyebrow="How it works" title={`${t.steps.length} steps,|start to finish.`}>{t.job}</SectionHead>
        <ol className="tl-steps" style={{ ['--n' as any]: t.steps.length }}>
          {t.steps.map((s, i) => (
            <li key={s.title}><span className="num">{i + 1}</span><h3 className="h3">{s.title}</h3><p>{s.text}</p></li>
          ))}
        </ol>
      </section>

      {/* features */}
      <section className="wrap sec" id="features">
        <SectionHead eyebrow="What you get" title={`Inside|${t.name}.`} />
        <ul className="tl-feat">
          {t.features.map((f) => (
            <li key={f.title}><Icon name="check" size={18} /><div><h3>{f.title}</h3><p>{f.text}</p></div></li>
          ))}
        </ul>
      </section>

      {/* plans strip */}
      <section className="wrap sec" id="pricing">
        <div className="slab tl-strip">
          <div>
            <p className="eyebrow">Pricing</p>
            <h2 className="h2">Use it once,<span className="it">or put it on a plan.</span></h2>
            <ul className="tl-strip__rows">
              <li><span>Pay per use</span><b><Money usd={ppu.price} /> {ppu.unit}</b></li>
              {paid.map((p) => <li key={p.id}><span>{p.name} plan</span><b><Money usd={p.monthly} per="/month" /></b></li>)}
              <li><span>Enterprise</span><b>Contact us</b></li>
            </ul>
          </div>
          <div className="tl-strip__cta">
            <Cta lang={lang} to="/pricing" cta={`tool_strip_choose_plan_${t.slug}`} size="lg">{CTA.plan}</Cta>
            <TLink lang={lang} to="/tools#plans" cta={`tool_strip_compare_${t.slug}`}>Compare plans</TLink>
            <Trust items={planTrustItems} />
          </div>
        </div>
      </section>

      {/* cross-sell */}
      <section className="wrap sec">
        <div className="band tl-cross">
          <div>
            <p className="eyebrow">Want us to do it for you?</p>
            <h2 className="h3">A campaign manager runs {t.name} and the rest of the campaign for you.</h2>
          </div>
          <Cta lang={lang} to="/about-agency" cta={`tool_cross_agency_${t.slug}`} variant="dark">{CTA.agency}</Cta>
        </div>
      </section>

      {/* FAQ */}
      <section className="wrap sec" id="faq">
        <FaqCards lang={lang} items={t.faq} title={`About|${t.name}.`} />
          <div className="row tl-after">
            <a className="btn" href="#demo" data-cta={`tool_faq_try_${t.slug}`}>{tryLabel}<Icon name="arrow" size={16} className="arr" stroke={1.9} /></a>
            <TLink lang={lang} to="/pricing" cta={`tool_faq_pricing_${t.slug}`}>Pricing</TLink>
          </div>
      </section>

      {/* other tools */}
      <section className="wrap sec" aria-labelledby="h-more">
        <h2 className="eyebrow" id="h-more">More tools</h2>
        <ul className="tl-more">
          {others.map((o) => (
            <li key={o.slug}><Link href={href(lang, `/tools/${o.slug}`)} prefetch={false} data-cta={`tool_more_${o.slug}`}><Icon name={ICON[o.slug]} size={18} /><b>{o.name}</b><span>{o.job}</span></Link></li>
          ))}
        </ul>
      </section>

      <StickyCta lang={lang} to="/pricing" cta="choose_plan" label={CTA.plan} />
    </>
  )
}
