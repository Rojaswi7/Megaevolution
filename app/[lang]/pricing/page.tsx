// All plans in one place: tools, Studio (one-time + Plus / Max), audience analytics access,
// pay-per-use and enterprise. Every value comes from data/pricing.ts.
import '@/styles/tools.css'
import '@/styles/studio.css'
import '@/styles/pricing.css'
import { CTA } from '@/data/site'
import { TOOL_PLANS, STUDIO, STUDIO_SUBSCRIPTIONS, ANALYTICS_LIMITS, isTBD } from '@/data/pricing'
import { PRICING_FAQ } from '@/data/faq'
import { pageMeta, productLd, offerLd, abs } from '@/lib/seo'
import { Cta, TLink, SectionHead, Breadcrumbs, JsonLd, RoadmapTag, StickyCta } from '@/components/ui'
import { Icon, Arrow } from '@/components/Icon'
import { Money } from '@/components/Money'
import PlanTable from '@/components/tools/PlanTable'
import FaqCards from '@/components/home/FaqCards'
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
  const basic = TOOL_PLANS.find((p) => p.id === 'basic')
  const tiers = [
    { who: 'Not logged in', limit: n(ANALYTICS_LIMITS.loggedOut), note: 'Open any creator profile. No account needed.', cta: null as null | [string, string, string] },
    { who: 'Verified brand', limit: n(ANALYTICS_LIMITS.verifiedBrand), note: 'Free account with a verified work email.', cta: ['Sign up free', '/signup', 'pricing_analytics_signup'] as [string, string, string] },
    { who: 'Basic plan', limit: n(ANALYTICS_LIMITS.basic), note: 'Plus PDF export of analytics and rate cards.', cta: ['Choose Basic', '/pricing#tools', 'pricing_analytics_basic'] as [string, string, string] },
    { who: 'Pro plan', limit: n(ANALYTICS_LIMITS.pro), note: 'For teams comparing many creators a day.', cta: ['Choose Pro', '/pricing#tools', 'pricing_analytics_pro'] as [string, string, string] },
  ]
  const glance = [
    { k: 'Tool plans', v: <Money usd={basic?.monthly} from per="/mo" />, to: '#tools' },
    { k: 'Edited videos', v: <Money usd={STUDIO.products[0].price} from per="/video" />, to: '#studio' },
    { k: 'Audience data', v: <>{n(ANALYTICS_LIMITS.loggedOut)} free a day</>, to: '#analytics' },
    { k: 'Enterprise', v: <>Let’s talk</>, to: '#enterprise' },
  ]
  return (
    <>
      <JsonLd data={[
        productLd({ name: 'MegaEvolution tool plans', description: DESC, path: '/pricing', offers: TOOL_PLANS.filter((p) => !('contact' in p && p.contact)).map((p) => ({ ...offerLd(p.monthly, 'USD', abs('/pricing')), name: `${p.name} plan, monthly` })) }),
        productLd({ name: 'Video Editing Studio', description: 'Edited short and long videos, ordered online.', path: '/video-editing', offers: STUDIO.products.map((p) => ({ ...offerLd(p.price, 'USD', abs('/video-editing/checkout')), name: p.name })) }),
      ]} />

      <div className="wrap"><Breadcrumbs lang={lang} items={[{ name: 'Pricing', path: '/pricing' }]} /></div>

      <section className="pr-hero on-dark">
        <div className="wrap pr-hero__grid">
          <div className="pr-hero__copy">
            <p className="eyebrow">Pricing</p>
            <h1 className="h1">Every price,<span className="it">on one page.</span></h1>
            <p className="lede">Searching creators is free. You pay for tools, edited videos and deeper audience data. Numbers marked TBD are still being set.</p>
          </div>
          <div className="pr-glance">
            <div className="pr-glance__free">
              <span className="pr-glance__badge">Free</span>
              <p><b>Search every creator, open profiles and rates, save lists.</b> No card, no trial clock.</p>
            </div>
            <ul aria-label="On this page">
              {glance.map((g) => (
                <li key={g.k}><a href={g.to} data-cta={`pricing_jump_${g.to.slice(1)}`}><span className="pr-glance__k">{g.k}</span><b>{g.v}</b><Arrow size={14} /></a></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap pr-sec" id="tools">
        <SectionHead eyebrow="Tools" title="Tool plans.|Start free.">AI Listup, Performance Report, AI Video Edit, Script Studio and, soon, Creator Commerce Data. <RoadmapTag status="planned" /></SectionHead>
        <PlanTable lang={lang} source="pricing" />
      </section>

      <section className="wrap pr-sec" id="studio">
        <SectionHead eyebrow="Video Editing Studio" title="Pay per video,|or subscribe.">Order online by card. Bundles of several videos cost less. <RoadmapTag status="dev" /></SectionHead>
        <div className="pr-studio">
          <div className="pr-once">
            <p className="tl-k">One-time order</p>
            <ul>
              {STUDIO.products.map((p) => (
                <li key={p.id}><div><b>{p.name}</b><small>{p.spec}</small></div><span className="num"><Money usd={p.price} /></span></li>
              ))}
            </ul>
            <div className="pr-once__chips">
              {STUDIO.bundles.map((b) => <span key={b.min}><b>{b.min}+ videos</b>{pct(b.percent)} off</span>)}
              <span><b>Extra revision</b><Money usd={STUDIO.paidRevision} /></span>
            </div>
            <small className="pr-once__note">{n(STUDIO.freeRevisions)} revisions included. Bundles apply at checkout.</small>
            <Cta lang={lang} to="/video-editing/checkout" cta="pricing_order_video" block>{CTA.video}</Cta>
          </div>
          {STUDIO_SUBSCRIPTIONS.map((s) => {
            const rec = 'recommended' in s && s.recommended
            return (
              <article key={s.id} className={`pr-sub ${rec ? 'pr-sub--rec' : ''}`}>
                <header><h3 className="h3">{s.name}</h3>{rec ? <span className="tag tag--accent">Recommended</span> : <span className="pr-sub__kind">Subscription</span>}</header>
                <p className="tl-plan__amt"><b className="num"><Money usd={s.monthly} /></b><span>/month</span></p>
                <p className="small">{s.blurb}</p>
                <ul className="ticks">
                  <li><Icon name="check" size={16} />Videos each month: {n(s.videos)}</li>
                  <li><Icon name="check" size={16} />{pct(s.saving)} off every video</li>
                  <li><Icon name="check" size={16} />Change or cancel any time</li>
                </ul>
                <Cta lang={lang} to={`/video-editing/checkout?plan=${s.id}`} cta={`pricing_subscribe_${s.id}`} block variant={rec ? 'accent' : 'ghost'}>Choose {s.name}</Cta>
              </article>
            )
          })}
        </div>
        <div className="pr-trust"><StudioTrust row /></div>
      </section>

      <section className="wrap pr-sec" id="analytics">
        <SectionHead eyebrow="Audience analytics" title="Audience breakdowns|you can open a day.">Where a creator’s followers live, their age and gender split, and what else they watch. <RoadmapTag status="dev" /></SectionHead>
        <ol className="pr-meter">
          {tiers.map((t, i) => (
            <li key={t.who} className={i === 1 ? 'is-free' : ''} style={{ ['--lvl' as string]: (i + 1) / 4 }}>
              <span className="pr-meter__bar" aria-hidden="true"><i /></span>
              <p className="tl-k">{t.who}</p>
              <p className="pr-meter__n"><b className="num">{t.limit}</b><span>a day</span></p>
              <p className="small">{t.note}</p>
              {t.cta ? <Cta lang={lang} to={t.cta[1]} cta={t.cta[2]} size="sm" variant={i === 1 ? 'accent' : 'ghost'}>{t.cta[0]}</Cta> : <span className="small muted">Then the panel blurs until you sign up.</span>}
            </li>
          ))}
        </ol>
        <p className="pr-note"><Icon name="lock" size={15} />After the daily limit the audience panel is blurred with “Unlock full audience data”. PDF export of analytics or a rate card needs a paid plan.</p>
      </section>

      <section className="wrap pr-sec" id="enterprise">
        <div className="pr-ent on-dark">
          <span className="pr-ent__ico"><Icon name="building" size={24} /></span>
          <div>
            <h2 className="h3">Agencies and multi-brand groups</h2>
            <p>Organisations with teams and roles, per-brand invoices on shared orders, custom limits and a named account manager.</p>
          </div>
          <div className="pr-ent__cta">
            <Cta lang={lang} to="/about-agency#inquiry" cta="pricing_enterprise_contact" variant="accent">Contact us</Cta>
            <TLink lang={lang} to="/about-agency" cta="pricing_cross_agency">Or let our team run the campaign</TLink>
          </div>
        </div>
      </section>

      <section className="wrap pr-sec" id="faq">
        <FaqCards lang={lang} items={PRICING_FAQ} title="Pricing|questions." />
      </section>

      <StickyCta lang={lang} to="/pricing#tools" cta="choose_plan" label={CTA.plan} />
    </>
  )
}
