// Video Editing Studio. Sells edited videos: one primary CTA ("Order a video") that goes straight to checkout.
import '@/styles/studio.css'
import { CTA } from '@/data/site'
import { STUDIO, STUDIO_SUBSCRIPTIONS, isTBD } from '@/data/pricing'
import { STUDIO_FAQ } from '@/data/faq'
import { pageMeta, serviceLd, offerLd, abs } from '@/lib/seo'
import { Cta, TLink, SectionHead, Breadcrumbs, Faq, JsonLd, RoadmapTag, StickyCta } from '@/components/ui'
import { Icon, Arrow } from '@/components/Icon'
import { Money } from '@/components/Money'
import Portfolio from '@/components/studio/Portfolio'
import { StudioTrust, pct } from '@/components/studio/shared'

type P = { params: Promise<{ lang: string }> }
const PATH = '/video-editing'
const DESC = 'Send raw footage and get short or long videos back, ready for TikTok, Reels and YouTube. Human editors, revisions included, order online by card.'

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: PATH, title: 'Short Video Editing Service — TikTok, Reels & YouTube Editors', description: DESC })
}

const STEPS = [
  { icon: 'card', title: 'Order online', text: 'Choose short or long videos and how many. Pay once by card, or use a Plus or Max plan.' },
  { icon: 'upload', title: 'Send your brief and files', text: 'Right after payment, upload your footage and tell us what the video is for. A few lines is enough.' },
  { icon: 'film', title: 'Review the draft', text: 'An editor picks up the order and uploads a draft. You see each video’s status on your order page.' },
  { icon: 'refresh', title: 'Ask for revisions', text: `Free revisions are included (${isTBD(STUDIO.freeRevisions) ? 'number TBD' : STUDIO.freeRevisions}). More can be added from the order page.` },
  { icon: 'download', title: 'Download the final', text: 'Download drafts and finals from My orders. Files stay there for your whole team.' },
]

const INCLUDED = ['Cuts, pacing and a hook in the first seconds', 'Captions and on-screen text in your language', 'Music and sound clean-up', 'Export sized for TikTok, Reels, Shorts or YouTube']

export default async function Studio({ params }: P) {
  const { lang } = await params
  return (
    <>
      <JsonLd data={serviceLd({
        name: 'Video Editing Studio', description: DESC, path: PATH,
        offers: STUDIO.products.map((p) => ({ ...offerLd(p.price, 'USD', abs(`${PATH}/checkout`)), name: p.name })),
      })} />

      <div className="wrap"><Breadcrumbs lang={lang} items={[{ name: 'Video Editing Studio', path: PATH }]} /></div>

      {/* hero */}
      <section className="wrap st-hero-wrap">
        <div className="slab st-hero">
          <div className="st-hero__copy">
            <p className="eyebrow">Video Editing Studio <RoadmapTag status="dev" /></p>
            <h1 className="h1">Raw footage in.<span className="it">Ready-to-post videos out.</span></h1>
            <p className="lede">Human editors who cut for TikTok, Reels and YouTube every day. Order online, send your brief, review the draft.</p>
            <div className="row">
              <Cta lang={lang} to={`${PATH}/checkout`} cta="studio_hero_order_video" size="lg">{CTA.video}</Cta>
              <a className="tlink" href="#portfolio" data-cta="studio_hero_see_samples">See sample videos<Arrow size={15} /></a>
            </div>
            <StudioTrust row logos={false} />
          </div>
          <div className="st-hero__side">
            <ul className="st-hero__prices">
              {STUDIO.products.map((p) => (
                <li key={p.id}>
                  <span className="st-k">{p.name}</span>
                  <b className="num"><Money usd={p.price} from /></b>
                  <small>{p.spec}</small>
                </li>
              ))}
              <li className="st-hero__bundle">
                <span className="st-k">Bundle discount</span>
                <b className="num">{pct(STUDIO.bundles[0].percent)} off</b>
                <small>{STUDIO.bundles[0].min}+ videos in one order</small>
              </li>
            </ul>
            <p className="small st-hero__cur">Prices show in your currency. Change it in the header.</p>
          </div>
        </div>
      </section>

      {/* portfolio */}
      <section className="wrap sec" id="portfolio">
        <SectionHead eyebrow="Portfolio" title="Edits by market.|Pick yours.">Different markets cut differently. Browse samples edited for Korean, Japanese and English-speaking audiences. <RoadmapTag status="planned" /></SectionHead>
        <Portfolio />
        <div className="row st-after">
          <Cta lang={lang} to={`${PATH}/checkout`} cta="studio_portfolio_order_video">{CTA.video}</Cta>
          <span className="small muted">Samples are placeholders until real videos are added.</span>
        </div>
      </section>

      {/* pricing */}
      <section className="wrap sec" id="pricing">
        <SectionHead eyebrow="Pricing" title="Pay per video.|Save when you order more.">One-time card checkout. No subscription needed. <RoadmapTag status="dev" /></SectionHead>
        <div className="st-price">
          {STUDIO.products.map((p, i) => (
            <article className={`st-price__card ${i === 0 ? 'st-price__card--main' : ''}`} key={p.id}>
              <header>
                <h3 className="h3">{p.name}</h3>
                <p className="muted small">{p.spec}</p>
              </header>
              <p className="st-price__amt"><b className="num"><Money usd={p.price} /></b><span>per video</span></p>
              <ul className="ticks">
                {INCLUDED.map((t) => <li key={t}><Icon name="check" size={16} />{t}</li>)}
                <li><Icon name="clock" size={16} />{p.delivery}</li>
              </ul>
              <Cta lang={lang} to={`${PATH}/checkout?type=${p.id}`} cta={`studio_price_order_${p.id}`} block variant={i === 0 ? 'accent' : 'dark'}>{CTA.video}</Cta>
            </article>
          ))}
          <aside className="st-price__bundle">
            <p className="st-k">Bundle discount</p>
            <ul>
              {STUDIO.bundles.map((b) => (
                <li key={b.min}><b className="num">{pct(b.percent)}</b><span>off when you order {b.min} or more videos at once</span></li>
              ))}
            </ul>
            <p className="small">Applied automatically at checkout. Mix short and long videos in one order.</p>
            <hr className="rule" />
            <p className="st-k">Revisions</p>
            <p className="small">Free revisions on every video: <b>{isTBD(STUDIO.freeRevisions) ? 'TBD' : STUDIO.freeRevisions}</b>. After that, <b><Money usd={STUDIO.paidRevision} /></b> per extra revision.</p>
          </aside>
        </div>
        <div className="st-paytrust"><StudioTrust row /></div>
      </section>

      {/* how it works */}
      <section className="wrap sec" id="how">
        <SectionHead eyebrow="How it works" title="Five steps,|all on one order page.">You always know which video is where: in queue, being edited, draft ready, in revision or delivered. <RoadmapTag status="dev" /></SectionHead>
        <ol className="st-steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="st-steps__n num">{i + 1}</span>
              <span className="st-steps__ico"><Icon name={s.icon} size={20} /></span>
              <h3 className="h3">{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="row st-after">
          <Cta lang={lang} to={`${PATH}/checkout`} cta="studio_steps_order_video">{CTA.video}</Cta>
          <TLink lang={lang} to="/preview/brand?tab=orders" cta="studio_see_my_orders">See what My orders looks like</TLink>
        </div>
      </section>

      {/* subscriptions */}
      <section className="wrap sec" id="subscriptions">
        <div className="slab st-subs">
          <div className="st-subs__copy">
            <p className="eyebrow">Plus and Max <RoadmapTag status="planned" /></p>
            <h2 className="h2">Order every month?<span className="it">Pay less per video.</span></h2>
            <p className="lede">Two monthly plans for teams with a steady flow of videos. Change or cancel any time in the billing portal — no email to send, no call to book.</p>
            <ul className="ticks st-subs__ticks">
              <li><Icon name="check" size={16} />A lower price on every video</li>
              <li><Icon name="check" size={16} />Self-serve billing portal: upgrade, downgrade or cancel</li>
              <li><Icon name="check" size={16} />Receipts and invoices for every payment</li>
            </ul>
          </div>
          <div className="st-subs__plans">
            {STUDIO_SUBSCRIPTIONS.map((s) => (
              <article key={s.id} className={`st-plan ${'recommended' in s && s.recommended ? 'st-plan--rec' : ''}`}>
                <header>
                  <h3 className="h3">{s.name}</h3>
                  {'recommended' in s && s.recommended ? <span className="tag tag--accent">Recommended</span> : null}
                </header>
                <p className="st-plan__amt"><b className="num"><Money usd={s.monthly} /></b><span>/month</span></p>
                <p className="small">{s.blurb}</p>
                <dl>
                  <div><dt>Videos each month</dt><dd>{isTBD(s.videos) ? 'TBD' : s.videos}</dd></div>
                  <div><dt>Saving per video</dt><dd>{pct(s.saving)}</dd></div>
                </dl>
                <Cta lang={lang} to={`${PATH}/checkout?plan=${s.id}`} cta={`studio_subscribe_${s.id}`} block variant={'recommended' in s && s.recommended ? 'accent' : 'white'}>Choose {s.name}</Cta>
              </article>
            ))}
          </div>
          <div className="st-subs__trust"><StudioTrust row logos={false} /></div>
        </div>
      </section>

      {/* cross-sell to agency */}
      <section className="wrap sec">
        <div className="band st-cross">
          <div>
            <p className="eyebrow">Need the creators too?</p>
            <h2 className="h3">We can cast, brief and manage the creators, then edit what they film.</h2>
          </div>
          <Cta lang={lang} to="/about-agency" cta="studio_cross_agency" variant="dark">{CTA.agency}</Cta>
        </div>
      </section>

      {/* FAQ */}
      <section className="wrap sec" id="faq">
        <div className="faqwrap">
          <SectionHead eyebrow="FAQ" title="Before you|order." />
          <div>
            <Faq items={STUDIO_FAQ} />
            <div className="row st-after">
              <Cta lang={lang} to={`${PATH}/checkout`} cta="studio_faq_order_video">{CTA.video}</Cta>
              <TLink lang={lang} to="/pricing" cta="studio_to_pricing">See all plans</TLink>
            </div>
          </div>
        </div>
      </section>

      <StickyCta lang={lang} to={`${PATH}/checkout`} cta="order_video" label={CTA.video} />
    </>
  )
}
