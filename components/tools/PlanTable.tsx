'use client'
// Tool plans: monthly / yearly toggle, one recommended plan, pay-per-use and enterprise contact.
// All values come from data/pricing.ts — Basic is still $TBD ($10 vs $19 not decided).
import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { href } from '@/data/site'
import { TOOL_PLANS, PAY_PER_USE, YEARLY_DISCOUNT, isTBD } from '@/data/pricing'
import { TOOLS } from '@/data/tools'
import { Icon, Arrow } from '@/components/Icon'
import { Money } from '@/components/Money'
import { Trust } from '@/components/ui'
import { track } from '@/lib/track'
import { planTrustItems } from './shared'

const saving = isTBD(YEARLY_DISCOUNT) ? 'TBD%' : `${YEARLY_DISCOUNT}%`


export default function PlanTable({ lang, source, payPerUse = true, tool, head }: { lang: string; source: string; payPerUse?: boolean; tool?: string; head?: ReactNode }) {
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly')
  const pick = (id: string) => track('plan_selected', { product: 'tools', plan: id, cycle, source, tool })

  return (
    <div className="tl-plans">
      <div className="tl-plans__bar">
        {head}
        <div className="tl-seg" role="group" aria-label="Billing period">
          <button aria-pressed={cycle === 'monthly'} onClick={() => { setCycle('monthly'); track('billing_cycle_changed', { cycle: 'monthly', source }) }} data-cta="plans_toggle_monthly">Monthly</button>
          <button aria-pressed={cycle === 'yearly'} onClick={() => { setCycle('yearly'); track('billing_cycle_changed', { cycle: 'yearly', source }) }} data-cta="plans_toggle_yearly">Yearly <em>save {saving}</em></button>
        </div>
        {head ? null : <p className="small muted">Prices show in your currency. Tax is added at checkout where it applies.</p>}
      </div>

      <div className="tl-plans__grid">
        {TOOL_PLANS.map((p) => {
          const rec = 'recommended' in p && p.recommended
          const contact = 'contact' in p && p.contact
          const free = p.monthly === 0
          return (
            <article key={p.id} className={`tl-plan ${rec ? 'tl-plan--rec' : ''}`} aria-label={`${p.name} plan`}>
              <header>
                <h3 className="h3">{p.name}</h3>
                {rec ? <span className="tag tag--accent">Recommended</span> : null}
              </header>
              <p className="tl-plan__blurb">{p.blurb}</p>
              <p className="tl-plan__amt">
                {contact ? <b className="num">Let’s talk</b> : free ? <b className="num"><Money usd={0} /></b> : <b className="num"><Money usd={cycle === 'monthly' ? p.monthly : p.yearly} /></b>}
                {!contact ? <span>{free ? 'forever' : cycle === 'monthly' ? '/month' : '/year'}</span> : null}
              </p>
              <p className="tl-plan__save">{contact ? 'Custom limits and invoicing' : free ? 'No card needed' : cycle === 'yearly' ? `Billed once a year · saves ${saving}` : `Or save ${saving} with yearly`}</p>
              {contact ? (
                <Link className={`btn btn--block ${rec ? '' : 'btn--ghost'}`} href={href(lang, '/about-agency#inquiry')} data-cta={`plan_contact_${source}`} onClick={() => pick(p.id)} prefetch={false}>Contact us<Arrow /></Link>
              ) : (
                <Link className={`btn btn--block ${rec ? '' : free ? 'btn--ghost' : 'btn--dark'}`} href={href(lang, `/signup?plan=${p.id}&cycle=${cycle}`)} data-cta={`plan_${free ? 'start_free' : 'choose'}_${p.id}_${source}`} onClick={() => pick(p.id)} prefetch={false}>{free ? 'Start free' : 'Choose plan'}<Arrow /></Link>
              )}
              <ul className="ticks">
                {p.features.map((f) => <li key={f}><Icon name="check" size={16} />{f}</li>)}
              </ul>
            </article>
          )
        })}
      </div>

      {payPerUse && (
        <div className="tl-ppu" id="pay-per-use">
          <div className="tl-ppu__head">
            <h3 className="h3">Pay per use</h3>
            <p className="muted small">No plan needed. Pay for a single run of any tool.</p>
          </div>
          <ul>
            {TOOLS.map((t) => {
              const u = (PAY_PER_USE as any)[t.slug]
              return (
                <li key={t.slug}>
                  <Link href={href(lang, `/tools/${t.slug}`)} data-cta={`ppu_tool_${t.slug}`} prefetch={false}>{t.name}</Link>
                  <span><b><Money usd={u.price} /></b> {u.unit}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="tl-plans__trust"><Trust row items={planTrustItems} /></div>
    </div>
  )
}
