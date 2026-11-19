// Connect your AI: use MegaEvolution from Claude, ChatGPT, Cursor or Gemini. Plus the AI-native app teaser.
import '@/styles/content.css'
import { pageMeta } from '@/lib/seo'
import { Cta, TLink, SectionHead, Breadcrumbs, Faq, RoadmapTag, StickyCta } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { WaitlistForm } from '@/components/forms'
import { ConnectTabs, CopyUrl } from '@/components/content/Interactive'

type P = { params: Promise<{ lang: string }> }
const TITLE = 'Connect Your AI — Use MegaEvolution from Claude or ChatGPT'
const DESC = 'Add the MegaEvolution connector to Claude, ChatGPT, Cursor or Gemini. Search creators, check orders and draft replies by asking in plain words.'

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/connect-ai', title: TITLE, description: DESC })
}

const PROMPTS: [string, string][] = [
  ['Find creators', 'Find 10 beauty creators in Vietnam under $300 with 5%+ engagement.'],
  ['Check orders', 'Which of my open orders are waiting on a draft?'],
  ['Draft a reply', 'Draft a reply to @minh.beauty asking for one more revision.'],
  ['Build a list', 'Add the top three to my “Serum launch · Vietnam” list.'],
  ['Read a report', 'Summarise last month’s campaign: views, engagement and best post.'],
  ['Plan a market', 'What do people in the Philippines watch, and where do they shop?'],
]
const CAN = ['Search creators with the same filters as the site', 'Open a creator’s overview and rates', 'Create and edit saved lists', 'Read orders, drafts, deadlines and messages', 'Draft messages — sending waits for your approval when you set it so', 'See billing records and refunds']
const FAQ = [
  { q: 'Is the connector free?', a: 'Yes. Connecting your AI is free. It works with the same account and plan you already use on MegaEvolution.' },
  { q: 'Can the AI spend money or accept orders by itself?', a: 'No. Accepting an order and publishing a homepage always wait for your approval on MegaEvolution. You can also require approval before any message is sent.' },
  { q: 'Which AI apps work?', a: 'Claude, ChatGPT, Cursor and Gemini, and any other app that supports MCP connectors.' },
  { q: 'What is the connector URL?', a: 'https://api.megaevolution.io/mcp — paste it where your AI app asks for a custom connector or MCP server.' },
]

export default async function ConnectAi({ params }: P) {
  const { lang } = await params
  return (
    <>
      <div className="wrap">
        <Breadcrumbs lang={lang} items={[{ name: 'Connect your AI', path: '/connect-ai' }]} />
        <div className="band band--accent ct-hero">
          <div>
            <p className="eyebrow" style={{ color: 'var(--accent-ink)' }}>Connect your AI <span className="tag tag--dark">New</span> <RoadmapTag status="live" /></p>
            <h1 className="h1">Use MegaEvolution<span className="it">from Claude or ChatGPT.</span></h1>
            <p style={{ marginTop: 18, maxWidth: '48ch', fontSize: '1.1rem' }}>Add one connector, then ask in plain words. No dashboard to learn.</p>
            <div className="ct-hero__cta">
              <Cta lang={lang} to="#connect" cta="connect_ai_hero" variant="dark" size="lg">Connect your AI</Cta>
            </div>
            <CopyUrl source="hero" />
          </div>
          <div className="ct-chat" aria-label="Example conversation" style={{ position: 'static' }}>
            <p>Find 10 beauty creators in Vietnam under $300 with 5%+ engagement.</p>
            <div>
              <small>MegaEvolution · searchCreators</small>
              <span><b>@minh.beauty</b><em style={{ fontStyle: 'normal' }}>250K · 5.2%</em></span>
              <span><b>@linh.glow</b><em style={{ fontStyle: 'normal' }}>180K · 6.4%</em></span>
              <span><b>@thao.skincare</b><em style={{ fontStyle: 'normal' }}>96K · 7.1%</em></span>
              <small>7 more (sample numbers). Want them in a list?</small>
            </div>
            <p>Yes, call it “Serum launch · Vietnam”.</p>
          </div>
        </div>
      </div>

      <section className="wrap sec" id="connect">
        <SectionHead eyebrow="Set it up" title="Four steps.|About two minutes.">Pick your AI app. The connector URL is the same everywhere.</SectionHead>
        <div className="ct-connect">
          <ConnectTabs />
          <div className="card card--pad stack">
            <p className="eyebrow eyebrow--plain">What you can do</p>
            <ul className="ticks">{CAN.map((c) => <li key={c}><Icon name="check" size={16} />{c}</li>)}</ul>
            <p className="small muted">The connector acts as you: it can only see what your account can see.</p>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <SectionHead eyebrow="Example prompts" title="Things people|ask first." />
        <div className="ct-prompts">
          {PROMPTS.map(([k, p]) => <div className="ct-prompt" key={k}><small>{k}</small><p>{p}</p></div>)}
        </div>
        <div className="row" style={{ marginTop: 28 }}>
          <Cta lang={lang} to="#connect" cta="connect_ai_after_prompts">Connect your AI</Cta>
          <TLink lang={lang} to="/help/connect-your-ai" cta="connect_ai_help">Read the help article</TLink>
        </div>
      </section>

      <section className="wrap sec" id="app">
        <div className="slab ct-app">
          <div>
            <p className="eyebrow">AI-native app <RoadmapTag status="planned" /></p>
            <h2 className="h2" style={{ marginTop: 14 }}>An AI manager for every creator,<span className="it">and a brand dashboard you run by chat.</span></h2>
            <p className="lede" style={{ marginTop: 18 }}>The next step after the connector: MegaEvolution itself, built around a conversation. Join the waitlist and we’ll tell you first.</p>
            <div style={{ marginTop: 22, maxWidth: 480 }}><WaitlistForm source="ai_native_app" /></div>
          </div>
          <div className="ct-app__two">
            <div><b>For creators</b><small>An AI manager that answers brand requests, keeps your rates current and chases approvals.</small></div>
            <div><b>For brands</b><small>Ask for a campaign, get a shortlist, approve drafts and read the report in one chat.</small></div>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <div className="faqwrap">
          <SectionHead eyebrow="FAQ" title="Before you|connect." />
          <Faq items={FAQ} />
        </div>
      </section>

      <section className="wrap">
        <div className="slab final">
          <h2 className="h1">Prefer a person?<span className="it">We have those too.</span></h2>
          <p className="lede">A campaign manager can run the whole thing for you. No brief needed.</p>
          <div className="row">
            <Cta lang={lang} to="/about-agency" cta="connect_ai_to_agency" size="lg">Explore your campaign options</Cta>
            <Cta lang={lang} to="/creators" cta="connect_ai_to_search" size="lg" variant="ghost">Search creators</Cta>
          </div>
        </div>
      </section>
      <StickyCta lang={lang} to="#connect" cta="connect_ai" label="Connect your AI" />
    </>
  )
}
