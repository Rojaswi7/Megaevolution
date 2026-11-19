// For MCNs: homepage builder, talent manager dashboard, contracts with counter-offers,
// signed-creator portal and shared inbox. Primary CTA: Apply as an MCN.
import '@/styles/content.css'
import { MCN_FAQ } from '@/data/faq'
import { MCNS } from '@/data/mcns'
import { pageMeta, serviceLd } from '@/lib/seo'
import { Cta, TLink, SectionHead, Breadcrumbs, Faq, JsonLd, RoadmapTag, StickyCta } from '@/components/ui'
import { Icon } from '@/components/Icon'

type P = { params: Promise<{ lang: string }> }
const TITLE = 'For MCNs — Homepage Builder, Talent Dashboard and Contracts'
const DESC = 'Give your MCN a public page for its roster, a talent manager dashboard, contracts with counter-offers and one inbox for brand requests. Apply as an MCN.'

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/mcn', title: TITLE, description: DESC })
}

const FEATURES: { n: string; t: string; d: string; status: 'live' | 'dev' | 'planned'; cls?: string }[] = [
  { n: '1', t: 'Homepage builder', d: 'Blocks and templates for a public page: roster, services, contact form. Publish at megaevolution.io/mcn/your-name; your own domain comes later.', status: 'planned', cls: 'ct-feat--dark ct-feat--wide' },
  { n: '2', t: 'Talent manager dashboard', d: 'Every signed creator in one table: open orders, earnings, last post and who on your team looks after them.', status: 'planned' },
  { n: '3', t: 'Contracts and counter-offers', d: 'Send a contract with your share. The creator can accept, or counter with a lower share, and you answer in the same thread.', status: 'planned' },
  { n: '4', t: 'Signed-creator portal', d: 'Your creators see their own orders, payouts and contract terms without seeing anyone else’s.', status: 'planned' },
  { n: '5', t: 'Shared inbox', d: 'Brand requests for any creator on your roster land in one inbox your whole team can answer.', status: 'dev', cls: 'ct-feat--accent' },
]
const TONES = [1, 3, 2, 4]

export default async function McnPage({ params }: P) {
  const { lang } = await params
  const sample = MCNS[0]
  return (
    <>
      <JsonLd data={serviceLd({ name: 'MegaEvolution for MCNs', description: DESC, path: '/mcn' })} />
      <div className="wrap">
        <Breadcrumbs lang={lang} items={[{ name: 'For MCNs', path: '/mcn' }]} />
        <div className="slab ct-hero">
          <div>
            <p className="eyebrow">For MCNs <RoadmapTag status="planned" /></p>
            <h1 className="h1">Your roster, your page,<span className="it">your contracts.</span></h1>
            <p className="lede">Bring your MCN to MegaEvolution. Build a public page for your creators, manage them from one dashboard and settle your share with each creator in writing.</p>
            <div className="ct-hero__cta">
              <Cta lang={lang} to="/signup?as=mcn" cta="mcn_apply_hero" size="lg">Apply as an MCN</Cta>
              <TLink lang={lang} to={`/mcn/${sample.slug}`} cta="mcn_see_sample">See a sample MCN page</TLink>
            </div>
          </div>
          <div className="ct-win" aria-label="Preview of the homepage builder">
            <div className="ct-win__bar"><i /><i /><i /><span>Homepage builder · megaevolution.io/mcn/{sample.slug}</span></div>
            <div className="ct-builder">
              <div className="ct-builder__blocks">
                <p>Blocks</p>
                {[['layout', 'Header'], ['users', 'Roster'], ['list', 'Services'], ['chart', 'Numbers'], ['mail', 'Contact']].map(([i, t], k) => <span key={t} className={k === 1 ? 'is-on' : ''}><Icon name={i} size={14} />{t}</span>)}
              </div>
              <div className="ct-builder__page">
                <div className="ct-builder__hero"><b>{sample.name}</b><small>{sample.tagline}</small></div>
                <div className="ct-builder__roster">{['@minh', '@linh', '@thao', '@vy'].map((h, i) => <div key={h} className={`tone-${TONES[i]}`}>{h}</div>)}</div>
                <div className="ct-builder__row"><i /><i /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="wrap sec">
        <SectionHead eyebrow="What MCNs get" title="Five things,|one login.">Each one replaces a spreadsheet, a shared mailbox or a PDF sent back and forth.</SectionHead>
        <div className="ct-feats">
          {FEATURES.map((f) => (
            <article key={f.t} className={`ct-feat ${f.cls || ''}`}>
              <div className="ct-feat__top"><span className="ct-feat__n">{f.n}</span><RoadmapTag status={f.status} /></div>
              <h3 className="h3">{f.t}</h3>
              <p>{f.d}</p>
            </article>
          ))}
        </div>
        <div className="row" style={{ marginTop: 28 }}>
          <Cta lang={lang} to="/signup?as=mcn" cta="mcn_apply_after_features">Apply as an MCN</Cta>
        </div>
      </section>

      <section className="wrap sec">
        <div className="ct-duo">
          <div className="ct-duo__copy">
            <p className="eyebrow">Homepage builder <RoadmapTag status="planned" /></p>
            <h2 className="h2">Pick a template.<span className="it">Drag in your roster.</span></h2>
            <p>Start from a template, add the blocks you need and publish. The roster block pulls live numbers from each creator’s profile, so the page never goes out of date.</p>
            <div className="ct-tpls">{['Roster first', 'Editorial', 'One page', 'Case-study led'].map((t, i) => <span key={t} className={`chip ${i === 0 ? 'is-on' : ''}`}>{t}</span>)}</div>
            <TLink lang={lang} to={`/mcn/${sample.slug}`} cta="mcn_sample_from_builder">Open the sample result: {sample.name}</TLink>
          </div>
          <div className="ct-win">
            <div className="ct-win__bar"><i /><i /><i /><span>Contract · Lotus Talent × @minh.beauty</span></div>
            <div className="ct-win__body">
              <p className="eyebrow eyebrow--plain">Contracts and counter-offers</p>
              <div className="ct-offer">
                <div className="ct-offer__row"><span>MCN proposes<small>Sent by Trang Lê · 2 days ago</small></span><b>30% share</b></div>
                <div className="ct-offer__row"><span>Creator counters with a lower share<small>“I bring my own brand deals for beauty.”</small></span><b>20% share</b></div>
                <div className="ct-offer__row ct-offer__row--now"><span>MCN replies<small>Accept, or meet in the middle</small></span><b>25% share</b></div>
              </div>
              <p className="small muted">Sample numbers. Both sides sign the final terms in the same thread.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <div className="faqwrap">
          <SectionHead eyebrow="FAQ" title="Questions|from MCNs." />
          <Faq items={MCN_FAQ} />
        </div>
      </section>

      <section className="wrap">
        <div className="slab final">
          <h2 className="h1">Bring your<span className="it">MCN.</span></h2>
          <p className="lede">Apply with your MCN’s name and roster size. We set up your workspace and send invite links for your creators.</p>
          <div className="row">
            <Cta lang={lang} to="/signup?as=mcn" cta="mcn_apply_final" size="lg">Apply as an MCN</Cta>
            <Cta lang={lang} to="/login" cta="mcn_preview_workspace" size="lg" variant="ghost">Try the MCN demo login</Cta>
          </div>
        </div>
      </section>
      <StickyCta lang={lang} to="/signup?as=mcn" cta="apply_mcn" label="Apply as an MCN" />
    </>
  )
}
