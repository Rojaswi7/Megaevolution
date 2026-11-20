// Creator side: profile with My Rates, AI pricing, brand ranking, Script Studio, PDFs, Join my MCN.
import '@/styles/content.css'
import { CREATOR_FAQ } from '@/data/faq'
import { pageMeta, serviceLd } from '@/lib/seo'
import { Cta, TLink, SectionHead, Breadcrumbs, JsonLd, RoadmapTag, StickyCta } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { RateCardMock } from '@/components/content/Interactive'
import FaqCards from '@/components/home/FaqCards'
import { GatedButton } from '@/components/client'

type P = { params: Promise<{ lang: string }> }
const TITLE = 'For Creators — Set Your Rates and Get Booked by Brands'
const DESC = 'Create a creator profile, set My Rates once in your own currency, and let brands order directly. AI pre-fills your rate card and Script Studio checks scripts before you film.'

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/for-creators', title: TITLE, description: DESC })
}

const RANK: [string, number][] = [['Engagement', 86], ['Posting rhythm', 72], ['Reply time', 91], ['Rate vs. similar', 64]]

export default async function ForCreators({ params }: P) {
  const { lang } = await params
  return (
    <>
      <JsonLd data={serviceLd({ name: 'MegaEvolution for creators', description: DESC, path: '/for-creators' })} />
      <div className="wrap">
        <Breadcrumbs lang={lang} items={[{ name: 'For creators', path: '/for-creators' }]} />
        <div className="slab ct-hero">
          <div>
            <p className="eyebrow">For creators <RoadmapTag status="dev" /></p>
            <h1 className="h1">Set your rates once.<span className="it">Get booked directly.</span></h1>
            <p className="lede">Your profile shows your price up front, in your own currency. Brands see it converted to theirs and order a package without the back-and-forth.</p>
            <div className="ct-hero__cta">
              <Cta lang={lang} to="/signup?as=creator" cta="for_creators_create_profile_hero" size="lg">Create your profile</Cta>
              <TLink lang={lang} to="/@minh.beauty" cta="for_creators_see_sample_profile">See a sample profile</TLink>
            </div>
          </div>
          <RateCardMock />
        </div>
      </div>

      <section className="wrap sec">
        <SectionHead eyebrow="My Rates" title="A rate card that|fills itself in.">One currency per rate card. You stay in charge of every number.</SectionHead>
        <div className="ct-feats">
          <article className="ct-feat">
            <div className="ct-feat__top"><span className="ct-feat__n">1</span><RoadmapTag status="dev" /></div>
            <h3 className="h3">Pre-filled by AI</h3>
            <p>We read your channel numbers and suggest a rate for each package. Edit any of them before you publish.</p>
          </article>
          <article className="ct-feat ct-feat--dark">
            <div className="ct-feat__top"><span className="ct-feat__n">2</span><RoadmapTag status="dev" /></div>
            <h3 className="h3">One currency, shown converted</h3>
            <p>Set rates in dong, won, yen, pesos or dollars. A brand in Seoul sees won; a brand in Tokyo sees yen.</p>
          </article>
          <article className="ct-feat">
            <div className="ct-feat__top"><span className="ct-feat__n">3</span><RoadmapTag status="planned" /></div>
            <h3 className="h3">Let AI adjust my rates</h3>
            <p>Turn it on and your rates follow your views and engagement. Turn it off and nothing changes without you.</p>
          </article>
        </div>
      </section>

      <section className="wrap sec">
        <div className="ct-duo ct-duo--flip">
          <div className="ct-duo__copy">
            <p className="eyebrow">Brand ranking <RoadmapTag status="planned" /></p>
            <h2 className="h2">See how you rank<span className="it">for brands.</span></h2>
            <p>Brands sort search results. This card shows where you land for your category and country, and which one thing would move you up.</p>
            <Cta lang={lang} to="/signup?as=creator" cta="for_creators_create_profile_rank">Create your profile</Cta>
          </div>
          <div className="ct-win">
            <div className="ct-win__bar"><i /><i /><i /><span>How you rank for brands · Beauty · Vietnam</span></div>
            <div className="ct-win__body ct-rank">
              <div className="ct-rank__top"><b>#14</b><span className="muted small">of 212 beauty creators in Vietnam (sample)</span></div>
              {RANK.map(([l, v]) => <div className="ct-rank__bar" key={l}><span>{l}</span><i style={{ ['--w' as any]: `${v}%` }} /><em>{v}</em></div>)}
              <p className="wnote" style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 12, background: 'var(--surface-2)', fontSize: 13.5 }}><Icon name="sparkle" size={15} />Your rate is above similar creators. Adding a bundle package would lift “Rate vs. similar”.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <div className="ct-duo">
          <div className="ct-duo__copy">
            <p className="eyebrow">Script Studio <RoadmapTag status="planned" /></p>
            <h2 className="h2">Write the script.<span className="it">Pass the brief first time.</span></h2>
            <p>Start from a hook that worked, write scene by scene, and run the guideline check before you film. Export a PDF for the brand to approve.</p>
            <TLink lang={lang} to="/tools/script-studio" cta="for_creators_script_studio">Try Script Studio</TLink>
          </div>
          <div className="ct-win">
            <div className="ct-win__bar"><i /><i /><i /><span>Script Studio · Serum launch · 30 sec</span></div>
            <div className="ct-win__body ct-script">
              <div className="ct-script__line"><small>0:00</small><span><b>Hook:</b> “I stopped using three products for this one.”</span></div>
              <div className="ct-script__line"><small>0:04</small><span>Texture shot on the back of the hand. On-screen: “2 drops”.</span></div>
              <div className="ct-script__line"><small>0:18</small><span>Before / after, same light. Mention price and where to buy.</span></div>
              <p className="ct-script__ok"><Icon name="check" size={15} />Disclosure tag is in the first line</p>
              <p className="ct-script__ok ct-script__warn"><Icon name="shield" size={15} />“Cures acne” is a banned claim in this brief — reword it</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <div className="grid-2">
          <div className="card card--pad stack">
            <p className="eyebrow eyebrow--plain">PDFs <RoadmapTag status="planned" /></p>
            <h3 className="h3">Analytics and rate card as a PDF</h3>
            <p className="muted">Send your numbers and prices to a brand that isn’t on MegaEvolution yet. The PDF is in the site’s language.</p>
            <div className="row">
              <GatedButton lang={lang} reason="export_pdf_rate_card" title="Export your rate card as a PDF" text="Create your free creator profile to export your rate card and analytics as a PDF.">Export as PDF</GatedButton>
            </div>
          </div>
          <div className="card card--pad stack">
            <p className="eyebrow eyebrow--plain">MCN <RoadmapTag status="planned" /></p>
            <h3 className="h3">Join my MCN at sign-up</h3>
            <p className="muted">If an MCN invited you, the box is ticked for you. Your application shows as pending on your profile until they answer.</p>
            <p className="ct-check"><i><Icon name="check" size={14} stroke={2.6} /></i><span>Join Lotus Talent as my MCN</span></p>
            <TLink lang={lang} to="/signup?as=creator&mcn=lotus-talent" cta="for_creators_invite_example" className="">See the invited sign-up</TLink>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <FaqCards lang={lang} items={CREATOR_FAQ} title="Questions|from creators." />
      </section>

      <section className="wrap">
        <div className="slab final">
          <h2 className="h1">Your price,<span className="it">on your profile.</span></h2>
          <p className="lede">Creating a profile is free. It takes a few minutes, and AI fills in the first draft of your rates.</p>
          <div className="row">
            <Cta lang={lang} to="/signup?as=creator" cta="for_creators_create_profile_final" size="lg">Create your profile</Cta>
            <Cta lang={lang} to="/login" cta="for_creators_demo_login" size="lg" variant="ghost">Try the creator demo login</Cta>
          </div>
        </div>
      </section>
      <StickyCta lang={lang} to="/signup?as=creator" cta="create_profile" label="Create your profile" />
    </>
  )
}
