// Tools hub: a card per tool, then the plan table. Primary CTA: Choose plan.
import Link from 'next/link'
import '@/styles/tools.css'
import { href, CTA } from '@/data/site'
import { TOOLS } from '@/data/tools'
import { TOOL_FROM, TOOL_PLANS, PAY_PER_USE } from '@/data/pricing'
import { PRICING_FAQ } from '@/data/faq'
import { pageMeta, productLd, offerLd, abs, itemListLd } from '@/lib/seo'
import { Cta, TLink, SectionHead, Breadcrumbs, Faq, JsonLd, RoadmapTag, StickyCta } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { Money } from '@/components/Money'
import PlanTable from '@/components/tools/PlanTable'

type P = { params: Promise<{ lang: string }> }
const DESC = 'Five tools for influencer marketing: build creator lists from a brief, report on campaigns, draft videos and scripts, and see TikTok Shop sales per creator. Monthly, yearly or pay per use.'
const TOOL_ICON: Record<string, string> = { 'ai-listup': 'list', 'performance-report': 'chart', 'ai-video-edit': 'film', 'commerce-data': 'bag', 'script-studio': 'pen' }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/tools', title: 'Influencer Marketing Tools & Plans — AI Listup, Reports, Scripts', description: DESC })
}

export default async function ToolsHub({ params }: P) {
  const { lang } = await params
  return (
    <>
      <JsonLd data={[
        itemListLd(TOOLS.map((t) => ({ name: t.name, url: `/tools/${t.slug}` }))),
        productLd({
          name: 'MegaEvolution tools', description: DESC, path: '/tools',
          offers: TOOL_PLANS.filter((p) => !('contact' in p && p.contact)).map((p) => ({ ...offerLd(p.monthly, 'USD', abs('/pricing')), name: `${p.name} plan, monthly` })),
        }),
      ]} />

      <div className="wrap">
        <Breadcrumbs lang={lang} items={[{ name: 'Tools', path: '/tools' }]} />
        <header className="phero tl-hero">
          <div>
            <p className="eyebrow">Tools <RoadmapTag status="dev" /></p>
            <h1 className="h1">The tools our managers use,<span className="it">open to you.</span></h1>
            <p className="lede">Each tool does one job in a campaign. Use one for a single run, or put the set on a plan.</p>
            <div className="phero__cta">
              <Cta lang={lang} to="/tools#plans" cta="tools_hero_choose_plan" size="lg">{CTA.plan}</Cta>
              <TLink lang={lang} to="/signup?plan=free" cta="tools_hero_start_free">{CTA.startFree}</TLink>
            </div>
          </div>
          <ol className="tl-hero__flow" aria-label="Where each tool fits in a campaign">
            {[['Find', 'AI Listup', 'ai-listup'], ['Check sales', 'Commerce Data', 'commerce-data'], ['Script', 'Script Studio', 'script-studio'], ['Draft', 'AI Video Edit', 'ai-video-edit'], ['Report', 'Performance Report', 'performance-report']].map(([k, n, s], i) => (
              <li key={s}><span className="num">{i + 1}</span><small>{k}</small><Link href={href(lang, `/tools/${s}`)} prefetch={false} data-cta={`tools_flow_${s}`}>{n}</Link></li>
            ))}
          </ol>
        </header>
      </div>

      <section className="wrap sec--tight" aria-label="All tools">
        <div className="tl-grid">
          {TOOLS.map((t, i) => (
            <article className={`tl-card ${i === 0 ? 'tl-card--lead' : ''}`} key={t.slug}>
              <div className="tl-card__top">
                <span className="tl-card__ico"><Icon name={TOOL_ICON[t.slug]} size={22} /></span>
                {t.comingSoon ? <span className="tag tag--soon">Coming soon</span> : null}
                <RoadmapTag status={t.status} />
              </div>
              <h2 className="h3"><Link href={href(lang, `/tools/${t.slug}`)} prefetch={false} data-cta={`tools_card_title_${t.slug}`}>{t.name}</Link></h2>
              <p className="tl-card__job">{t.job}</p>
              <ul className="ticks tl-card__feat">
                {t.features.slice(0, 3).map((f) => <li key={f.title}><Icon name="check" size={15} />{f.title}</li>)}
              </ul>
              <div className="tl-card__foot">
                <p className="tl-card__price"><Money usd={TOOL_FROM[t.slug]} from per="/mo" /><small>or <Money usd={(PAY_PER_USE as any)[t.slug].price} /> {(PAY_PER_USE as any)[t.slug].unit}</small></p>
                <Cta lang={lang} to={`/tools/${t.slug}`} cta={`tools_card_try_${t.slug}`} size="sm" variant={t.comingSoon ? 'ghost' : 'accent'}>{t.comingSoon ? 'Join waitlist' : `Try ${t.name}`}</Cta>
              </div>
            </article>
          ))}
          <aside className="tl-card tl-card--agency">
            <p className="eyebrow">Short on time?</p>
            <h2 className="h3">Want us to do it for you?</h2>
            <p>Our managers run the same tools for you, from the first list to the final report.</p>
            <Cta lang={lang} to="/about-agency" cta="tools_cross_agency" variant="white" size="sm">{CTA.agency}</Cta>
          </aside>
        </div>
      </section>

      <section className="wrap sec" id="plans">
        <SectionHead eyebrow="Plans" title="Monthly, yearly|or pay per use.">Start free. Move up when you run campaigns every month. <RoadmapTag status="planned" /></SectionHead>
        <PlanTable lang={lang} source="tools" />
        <div className="row tl-after">
          <TLink lang={lang} to="/pricing" cta="tools_to_pricing">Compare everything on the pricing page</TLink>
        </div>
      </section>

      <section className="wrap sec" id="faq">
        <div className="faqwrap">
          <SectionHead eyebrow="FAQ" title="Plans and|billing." />
          <div>
            <Faq items={PRICING_FAQ} />
            <div className="row tl-after"><Cta lang={lang} to="/tools#plans" cta="tools_faq_choose_plan">{CTA.plan}</Cta></div>
          </div>
        </div>
      </section>

      <StickyCta lang={lang} to="/tools#plans" cta="choose_plan" label={CTA.plan} />
    </>
  )
}
