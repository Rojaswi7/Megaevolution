// Video Editing Studio. Sells edited videos: one primary CTA ("Order a video") that goes straight to checkout.
import '@/styles/studio.css'
import '@/styles/video-editing.css'
import { CTA, href } from '@/data/site'
import { STUDIO, STUDIO_SUBSCRIPTIONS, isTBD } from '@/data/pricing'
import { STUDIO_FAQ } from '@/data/faq'
import { pageMeta, serviceLd, offerLd, abs } from '@/lib/seo'
import { Cta, TLink, SectionHead, Breadcrumbs, JsonLd, RoadmapTag, StickyCta } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { Money } from '@/components/Money'
import Portfolio from '@/components/studio/Portfolio'
import BeforeAfter from '@/components/home/BeforeAfter'
import FaqCards from '@/components/home/FaqCards'
import { StudioTrust, pct } from '@/components/studio/shared'

type P = { params: Promise<{ lang: string }> }
const PATH = '/video-editing'
const DESC = 'Send raw footage and get short or long videos back, ready for TikTok, Reels and YouTube. Human editors, revisions included, order online by card.'

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: PATH, title: 'Short Video Editing Service — TikTok, Reels & YouTube Editors', description: DESC })
}

const revisions = isTBD(STUDIO.freeRevisions) ? 'TBD' : String(STUDIO.freeRevisions)

// Each step shows the status the order page uses at that point.
const STEPS = [
  { icon: 'card', status: 'Paid', title: 'Order online', text: 'Choose short or long videos and how many. Pay once by card, or use Plus or Max.' },
  { icon: 'upload', status: 'In queue', title: 'Send your brief and files', text: 'Upload your footage right after paying and say what the video is for. A few lines is enough.' },
  { icon: 'film', status: 'Draft ready', title: 'Review the draft', text: 'An editor picks up the order and uploads a draft to your order page.' },
  { icon: 'refresh', status: 'In revision', title: 'Ask for changes', text: `Free revisions are included (${revisions}). More can be added from the order page.` },
  { icon: 'download', status: 'Delivered', title: 'Download the final', text: 'Drafts and finals stay in My orders for your whole team.' },
]

const INCLUDED = ['A hook in the first seconds', 'Cuts and pacing', 'Captions in your language', 'Music and sound clean-up', 'Sized for TikTok, Reels, Shorts or YouTube']

export default async function Studio({ params }: P) {
  const { lang } = await params
  return (
    <>
      <JsonLd data={serviceLd({
        name: 'Video Editing Studio', description: DESC, path: PATH,
        offers: STUDIO.products.map((p) => ({ ...offerLd(p.price, 'USD', abs(`${PATH}/checkout`)), name: p.name })),
      })} />

      <div className="wrap"><Breadcrumbs lang={lang} items={[{ name: 'Video Editing Studio', path: PATH }]} /></div>

      <section className="ve-hero on-dark">
        <div className="wrap ve-hero__grid">
          <div className="ve-hero__copy">
            <p className="eyebrow">Video Editing Studio <RoadmapTag status="dev" /></p>
            <h1 className="h1">Raw footage in.<span className="it">Ready-to-post videos out.</span></h1>
            <p className="lede">Human editors who cut for TikTok, Reels and YouTube every day. Order online, send your brief, review the draft.</p>
            <div className="ve-hero__cta">
              <Cta lang={lang} to={`${PATH}/checkout`} cta="studio_hero_order_video" size="lg">{CTA.video}</Cta>
              <a className="tlink" href="#portfolio" data-cta="studio_hero_see_samples">See sample videos</a>
            </div>
            <ul className="ve-hero__from">
              {STUDIO.products.map((p) => <li key={p.id}><span className="ve-hero__k">{p.name}</span><b><Money usd={p.price} from /></b></li>)}
              <li><span className="ve-hero__k">Revisions</span><b>{revisions} free</b></li>
            </ul>
          </div>
          <BeforeAfter />
        </div>
      </section>

      <section className="wrap sec ve-pf" id="portfolio">
        <SectionHead eyebrow="Portfolio" title="Edits by market.|Pick yours.">Korea, Japan and English-speaking audiences cut differently. Samples are placeholders until real videos are added. <RoadmapTag status="planned" /></SectionHead>
        <Portfolio orderHref={href(lang, `${PATH}/checkout`)} />
      </section>

      <section className="wrap sec" id="pricing">
        <SectionHead eyebrow="Pricing" title="Pay per video,|or subscribe.">One-time card checkout, or a monthly plan if you order every month. <RoadmapTag status="dev" /></SectionHead>
        <div className="ve-price">
          {STUDIO.products.map((p, i) => (
            <article className={`ve-card ${i === 0 ? 've-card--accent' : ''}`} key={p.id}>
              <p className="ve-card__k">One-time</p>
              <h3 className="h3">{p.name}</h3>
              <p className="ve-card__amt"><b className="num"><Money usd={p.price} /></b><span className="ve-card__per">per video</span></p>
              <p className="ve-card__note">{p.spec} · {p.delivery}</p>
              <Cta lang={lang} to={`${PATH}/checkout?type=${p.id}`} cta={`studio_price_order_${p.id}`} block variant={i === 0 ? 'dark' : 'ghost'}>{CTA.video}</Cta>
            </article>
          ))}
          {STUDIO_SUBSCRIPTIONS.map((s) => {
            const rec = 'recommended' in s && s.recommended
            return (
              <article key={s.id} className={`ve-card ${rec ? 've-card--dark on-dark' : ''}`}>
                <p className="ve-card__k">Monthly {rec ? <span className="tag tag--accent">Recommended</span> : null}</p>
                <h3 className="h3">{s.name}</h3>
                <p className="ve-card__amt"><b className="num"><Money usd={s.monthly} /></b><span className="ve-card__per">/month</span></p>
                <p className="ve-card__note">{isTBD(s.videos) ? 'TBD' : s.videos} videos a month · {pct(s.saving)} off each</p>
                <Cta lang={lang} to={`${PATH}/checkout?plan=${s.id}`} cta={`studio_subscribe_${s.id}`} block variant={rec ? 'accent' : 'ghost'}>Choose {s.name}</Cta>
              </article>
            )
          })}
        </div>
        <div className="ve-extras">
          <div>
            <p className="ve-extras__k">Every video includes</p>
            <ul className="ve-chips">{INCLUDED.map((t) => <li key={t}><Icon name="check" size={14} />{t}</li>)}</ul>
          </div>
          <div>
            <p className="ve-extras__k">Bundles and revisions</p>
            <ul className="ve-chips ve-chips--accent">
              {STUDIO.bundles.map((b) => <li key={b.min}><b>{pct(b.percent)} off</b>{b.min}+ videos in one order</li>)}
              <li><b>{revisions} free</b>revisions, then <Money usd={STUDIO.paidRevision} /> each</li>
            </ul>
          </div>
        </div>
        <div className="ve-trust"><StudioTrust row /></div>
      </section>

      <section className="wrap sec" id="how">
        <SectionHead eyebrow="How it works" title="Five steps,|all on one order page.">You always know which video is where. The tag on each step is the status you’ll see. <RoadmapTag status="dev" /></SectionHead>
        <ol className="ve-steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className={i === STEPS.length - 1 ? 'is-last' : ''}>
              <div className="ve-steps__top">
                <span className="ve-steps__ico"><Icon name={s.icon} size={19} /></span>
                <span className="ve-steps__status">{s.status}</span>
              </div>
              <h3><span className="num">{i + 1}</span>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="ve-after"><TLink lang={lang} to="/preview/brand?tab=orders" cta="studio_see_my_orders">See what My orders looks like</TLink></p>
      </section>

      <section className="wrap sec">
        <div className="ve-cross on-dark">
          <span className="ve-cross__ico"><Icon name="users" size={22} /></span>
          <p><b>Need the creators too?</b> We can cast, brief and manage the creators, then edit what they film.</p>
          <Cta lang={lang} to="/about-agency" cta="studio_cross_agency" size="sm">{CTA.agency}</Cta>
        </div>
      </section>

      <section className="wrap sec" id="faq">
        <FaqCards lang={lang} items={STUDIO_FAQ} title="Before you|order." />
      </section>

      <StickyCta lang={lang} to={`${PATH}/checkout`} cta="order_video" label={CTA.video} />
    </>
  )
}
