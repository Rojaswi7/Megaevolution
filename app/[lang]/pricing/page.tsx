// All plans in one place: tools, Studio (one-time + Plus / Max), audience analytics access,
// pay-per-use and enterprise. Every value comes from data/pricing.ts.
import '@/styles/tools.css'
import '@/styles/studio.css'
import { CTA } from '@/data/site'
import { TOOL_PLANS, STUDIO, STUDIO_SUBSCRIPTIONS, ANALYTICS_LIMITS, isTBD } from '@/data/pricing'
import { PRICING_FAQ } from '@/data/faq'
import { pageMeta, productLd, offerLd, abs } from '@/lib/seo'
import { Cta, TLink, SectionHead, Breadcrumbs, Faq, JsonLd, RoadmapTag, StickyCta } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { Money } from '@/components/Money'
import PlanTable from '@/components/tools/PlanTable'
import { StudioTrust, pct } from '@/components/studio/shared'

type P = { params: Promise<{ lang: string }> }
const DESC = 'Every MegaEvolution price in one place: tool plans (monthly, yearly, pay per use), Video Editing Studio prices and subscriptions, and audience analytics access.'

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/pricing', title: 'Pricing — Tool Plans, Video Editing & Audience Analytics', description: DESC })
}

const n = (v: unknown) => (isTBD(v) ? 'TBD' : String(v))

export default async function Pricing({ params }: P) {
  const { lang } = await params
  const tiers = [
    { who: 'Not logged in', limit: n(ANALYTICS_LIMITS.loggedOut), note: 'Open any creator profile. No account needed.', cta: null as null | [string, string, string] },
    { who: 'Verified brand', limit: n(ANALYTICS_LIMITS.verifiedBrand), note: 'Free account with a verified work email.', cta: ['Sign up free', '/signup', 'pricing_analytics_signup'] as [string, string, string] },
    { who: 'Basic plan', limit: n(ANALYTICS_LIMITS.basic), note: 'Plus PDF export of analytics and rate cards.', cta: ['Choose plan', '/pricing#tools', 'pricing_analytics_basic'] as [string, string, string] },
    { who: 'Pro plan', limit: n(ANALYTICS_LIMITS.pro), note: 'For teams comparing many creators a day.', cta: ['Choose plan', '/pricing#tools', 'pricing_analytics_pro'] as [string, string, string] },
  ]
  return (
    <>
      <JsonLd data={[
        productLd({ name: 'MegaEvolution tool plans', description: DESC, path: '/pricing', offers: TOOL_PLANS.filter((p) => !('contact' in p && p.contact)).map((p) => ({ ...offerLd(p.monthly, 'USD', abs('/pricing')), name: `${p.name} plan, monthly` })) }),
        productLd({ name: 'Video Editing Studio', description: 'Edited short and long videos, ordered online.', path: '/video-editing', offers: STUDIO.products.map((p) => ({ ...offerLd(p.price, 'USD', abs('/video-editing/checkout')), name: p.name })) }),
      ]} />

      <div className="wrap">
        <Breadcrumbs lang={lang} items={[{ name: 'Pricing', path: '/pricing' }]} />
        <header className="phero tl-phero">
          <p className="eyebrow">Pricing</p>
          <h1 className="h1">Every price,<span className="it">on one page.</span></h1>
          <p className="lede">Searching creators is free. You pay for tools, edited videos and deeper audience data. Numbers marked TBD are still being set.</p>
          <nav className="tl-jump" aria-label="On this page">
            {[['Tool plans', '#tools'], ['Pay per use', '#pay-per-use'], ['Video Editing Studio', '#studio'], ['Audience analytics', '#analytics'], ['Enterprise', '#enterprise']].map(([t, h]) => <a key={h} className="chip" href={h} data-cta={`pricing_jump_${h.slice(1)}`}>{t}</a>)}
          </nav>
        </header>
      </div>

      <section className="wrap sec--tight" id="tools">
        <SectionHead eyebrow="Tools" title="Tool plans.|Start free.">AI Listup, Performance Report, AI Video Edit, Script Studio and, soon, Creator Commerce Data. <RoadmapTag status="planned" /></SectionHead>
        <PlanTable lang={lang} source="pricing" />
      </section>

      <section className="wrap sec" id="studio">
        <SectionHead eyebrow="Video Editing Studio" title="Pay per video,|or subscribe.">Order online by card. Bundles of several videos cost less. <RoadmapTag status="dev" /></SectionHead>
        <div className="tl-studio">
          <div className="tl-studio__once">
            <h3 className="tl-k">One-time order</h3>
            <ul>
              {STUDIO.products.map((p) => (
                <li key={p.id}><div><b>{p.name}</b><small>{p.spec}</small></div><span className="num"><Money usd={p.price} /></span></li>
              ))}
              {STUDIO.bundles.map((b) => (
                <li key={b.min}><div><b>Bundle: {b.min}+ videos</b><small>Applied automatically at checkout</small></div><span className="num">{pct(b.percent)} off</span></li>
              ))}
              <li><div><b>Extra revision</b><small>After the free ones ({n(STUDIO.freeRevisions)} included)</small></div><span className="num"><Money usd={STUDIO.paidRevision} /></span></li>
            </ul>
            <Cta lang={lang} to="/video-editing/checkout" cta="pricing_order_video" block>{CTA.video}</Cta>
          </div>
          {STUDIO_SUBSCRIPTIONS.map((s) => {
            const rec = 'recommended' in s && s.recommended
            return (
              <article key={s.id} className={`tl-studio__sub ${rec ? 'tl-studio__sub--rec' : ''}`}>
                <header><h3 className="h3">{s.name}</h3>{rec ? <span className="tag tag--accent">Recommended</span> : null}</header>
                <p className="tl-plan__amt"><b className="num"><Money usd={s.monthly} /></b><span>/month</span></p>
                <p className="small">{s.blurb}</p>
                <ul className="ticks">
                  <li><Icon name="check" size={16} />Videos each month: {n(s.videos)}</li>
                  <li><Icon name="check" size={16} />{pct(s.saving)} off every video</li>
                  <li><Icon name="check" size={16} />Change or cancel in the billing portal</li>
                </ul>
                <Cta lang={lang} to={`/video-editing/checkout?plan=${s.id}`} cta={`pricing_subscribe_${s.id}`} block variant={rec ? 'accent' : 'ghost'}>Choose {s.name}</Cta>
              </article>
            )
          })}
        </div>
        <div className="st-paytrust"><StudioTrust row /></div>
      </section>

      <section className="wrap sec" id="analytics">
        <SectionHead eyebrow="Audience analytics" title="How many audience breakdowns|you can open a day.">Where a creator’s followers live, their age and gender split, and what else they watch. <RoadmapTag status="dev" /></SectionHead>
        <ol className="tl-tiers">
          {tiers.map((t, i) => (
            <li key={t.who} className={i === 1 ? 'is-free' : ''}>
              <p className="tl-k">{t.who}</p>
              <p className="tl-tiers__n"><b className="num">{t.limit}</b><span>a day</span></p>
              <p className="small">{t.note}</p>
              {t.cta ? <Cta lang={lang} to={t.cta[1]} cta={t.cta[2]} size="sm" variant={i === 1 ? 'accent' : 'ghost'}>{t.cta[0]}</Cta> : <span className="small muted">Then the panel is blurred until you sign up.</span>}
            </li>
          ))}
        </ol>
        <p className="tl-note"><Icon name="lock" size={15} />After the daily limit, the audience panel is blurred with “Unlock full audience data”. Exporting analytics or a rate card as a PDF needs an account and a paid plan.</p>
      </section>

      <section className="wrap sec" id="enterprise">
        <div className="slab tl-ent">
          <div>
            <p className="eyebrow">Enterprise</p>
            <h2 className="h2">Agencies and<span className="it">multi-brand groups.</span></h2>
            <p className="lede">Organisations with teams and roles, per-brand invoices on shared orders, custom limits and a named account manager.</p>
          </div>
          <div className="tl-ent__cta">
            <Cta lang={lang} to="/about-agency#inquiry" cta="pricing_enterprise_contact" size="lg">Contact us</Cta>
            <TLink lang={lang} to="/about-agency" cta="pricing_cross_agency">Or let our team run the campaign</TLink>
          </div>
        </div>
      </section>

      <section className="wrap sec" id="faq">
        <div className="faqwrap">
          <SectionHead eyebrow="FAQ" title="Pricing|questions." />
          <div>
            <Faq items={PRICING_FAQ} />
            <div className="row tl-after"><Cta lang={lang} to="/pricing#tools" cta="pricing_faq_choose_plan">{CTA.plan}</Cta><TLink lang={lang} to="/tools" cta="pricing_to_tools">See what each tool does</TLink></div>
          </div>
        </div>
      </section>

      <StickyCta lang={lang} to="/pricing#tools" cta="choose_plan" label={CTA.plan} />
    </>
  )
}
