// Tools hub: a live preview, a card per tool in campaign order, then the plan table.
// Primary CTA: Choose plan.
import Link from 'next/link'
import '@/styles/tools.css'
import '@/styles/tools-hub.css'
import { href, CTA } from '@/data/site'
import { TOOLS, type Tool } from '@/data/tools'
import { TOOL_FROM, TOOL_PLANS, PAY_PER_USE } from '@/data/pricing'
import { PRICING_FAQ } from '@/data/faq'
import { pageMeta, productLd, offerLd, abs, itemListLd } from '@/lib/seo'
import { Cta, TLink, SectionHead, Breadcrumbs, JsonLd, RoadmapTag, StickyCta } from '@/components/ui'
import { Icon, Arrow } from '@/components/Icon'
import { Money } from '@/components/Money'
import PlanTable from '@/components/tools/PlanTable'
import ToolsShowcase from '@/components/home/ToolsShowcase'
import FaqCards from '@/components/home/FaqCards'

type P = { params: Promise<{ lang: string }> }
const DESC = 'Five tools for influencer marketing: build creator lists from a brief, report on campaigns, draft videos and scripts, and see TikTok Shop sales per creator. Monthly, yearly or pay per use.'
const TOOL_ICON: Record<string, string> = { 'ai-listup': 'list', 'performance-report': 'chart', 'ai-video-edit': 'film', 'commerce-data': 'bag', 'script-studio': 'pen' }
// The order a campaign actually runs in.
const FLOW: [string, string][] = [['Find', 'ai-listup'], ['Check sales', 'commerce-data'], ['Script', 'script-studio'], ['Draft', 'ai-video-edit'], ['Report', 'performance-report']]
const toolBySlug = Object.fromEntries(TOOLS.map((t) => [t.slug, t]))
const ppu = (slug: string) => (PAY_PER_USE as Record<string, { price: number | 'TBD'; unit: string }>)[slug]

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/tools', title: 'Influencer Marketing Tools & Plans — AI Listup, Reports, Scripts', description: DESC })
}

function ToolCard({ t, lang, step, lead }: { t: Tool; lang: string; step: string; lead?: boolean }) {
  const u = ppu(t.slug)
  return (
    <article className={`th-card ${lead ? 'th-card--lead' : ''} ${t.comingSoon ? 'th-card--soon' : ''}`}>
      <div className="th-card__top">
        <span className="th-card__ico"><Icon name={TOOL_ICON[t.slug]} size={22} /></span>
        <span className="th-card__step">{step}</span>
        {t.comingSoon ? <span className="tag tag--soon">Coming soon</span> : null}
        <RoadmapTag status={t.status} />
      </div>
      <h3 className="h3"><Link className="th-card__link" href={href(lang, `/tools/${t.slug}`)} prefetch={false} data-cta={`tools_card_title_${t.slug}`}>{t.name}</Link></h3>
      <p className="th-card__job">{t.job}</p>
      <ul className="th-card__feat">
        {t.features.slice(0, lead ? 4 : 3).map((f) => <li key={f.title}><Icon name="check" size={14} />{lead ? <span><b>{f.title}</b>{f.text}</span> : f.title}</li>)}
      </ul>
      <div className="th-card__foot">
        <p className="th-card__price"><Money usd={TOOL_FROM[t.slug]} from per="/mo" /><small>or <Money usd={u.price} /> {u.unit}</small></p>
        <span className="th-card__go">{t.comingSoon ? 'Join the waitlist' : `Try ${t.name}`}<Arrow size={15} /></span>
      </div>
    </article>
  )
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

      <div className="wrap"><Breadcrumbs lang={lang} items={[{ name: 'Tools', path: '/tools' }]} /></div>

      <section className="th-hero on-dark">
        <div className="wrap">
          <div className="th-hero__copy">
            <div>
              <p className="eyebrow">Tools <RoadmapTag status="dev" /></p>
              <h1 className="h1">The tools our managers use,<span className="it">open to you.</span></h1>
            </div>
            <div className="th-hero__side">
              <p className="lede">Five tools, one for each job in a campaign. Use one for a single run, or put the set on a plan.</p>
              <div className="th-hero__cta">
                <Cta lang={lang} to="/tools#plans" cta="tools_hero_choose_plan" size="lg">{CTA.plan}</Cta>
                <TLink lang={lang} to="/signup?plan=free" cta="tools_hero_start_free">{CTA.startFree}</TLink>
              </div>
            </div>
          </div>
          <ToolsShowcase lang={lang} />
        </div>
      </section>

      <section className="wrap sec" aria-label="All tools">
        <SectionHead eyebrow="All tools, in campaign order" title="One job each.|Priced on their own.">Every tool has a monthly price and a pay-per-use price, so you only pay for what you run.</SectionHead>
        <div className="th-grid">
          {FLOW.map(([k, s], i) => <ToolCard key={s} t={toolBySlug[s]} lang={lang} step={`${String(i + 1).padStart(2, '0')} · ${k}`} lead={i === 0} />)}
        </div>
        <div className="th-agency on-dark">
          <span className="th-agency__ico"><Icon name="users" size={22} /></span>
          <p><b>Short on time?</b> Our managers run the same tools for you, from the first list to the final report.</p>
          <Cta lang={lang} to="/about-agency" cta="tools_cross_agency" size="sm">{CTA.agency}</Cta>
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
        <FaqCards lang={lang} items={PRICING_FAQ} title="Plans and|billing." />
      </section>

      <StickyCta lang={lang} to="/tools#plans" cta="choose_plan" label={CTA.plan} />
    </>
  )
}
