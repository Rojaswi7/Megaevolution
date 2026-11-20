// Connect your AI: use MegaEvolution from Claude, ChatGPT, Cursor or Gemini. Plus the AI-native app teaser.
import '@/styles/content.css'
import '@/styles/connect-ai.css'
import { pageMeta } from '@/lib/seo'
import { Breadcrumbs, RoadmapTag, StickyCta, SectionHead } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { WaitlistForm } from '@/components/forms'
import { CopyUrl } from '@/components/content/Interactive'
import { ChatDemo, SetupSteps } from '@/components/content/ConnectAi'
import FaqCards from '@/components/home/FaqCards'

type P = { params: Promise<{ lang: string }> }
const TITLE = 'Connect Your AI — Use MegaEvolution from Claude or ChatGPT'
const DESC = 'Add the MegaEvolution connector to Claude, ChatGPT, Cursor or Gemini. Search creators, check orders and draft replies by asking in plain words.'

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/connect-ai', title: TITLE, description: DESC })
}

const CAN = [
  ['search', 'Search creators', 'Same filters as the site: country, category, platform, followers, engagement.'],
  ['user', 'Open a creator', 'Overview, channels, audience and rates.'],
  ['bookmark', 'Build lists', 'Create, rename and add to saved lists.'],
  ['inbox', 'Follow orders', 'Status, drafts, deadlines and messages.'],
  ['pen', 'Draft messages', 'Write replies to creators and MCNs.'],
  ['card', 'Read billing', 'Payments, invoices and refunds.'],
]
const ASKS = ['Accepting an order', 'Publishing an MCN homepage', 'Sending a message, if you turn this on', 'Anything that spends money']
const FAQ = [
  { q: 'Is the connector free?', a: 'Yes. Connecting your AI is free. It works with the same account and plan you already use on MegaEvolution.' },
  { q: 'Can the AI spend money or accept orders by itself?', a: 'No. Accepting an order and publishing a homepage always wait for your approval on MegaEvolution. You can also require approval before any message is sent.' },
  { q: 'Which AI apps work?', a: 'Claude, ChatGPT, Cursor and Gemini, and any other app that supports MCP connectors.' },
  { q: 'What can the AI see?', a: 'Exactly what your account can see, in every organization you belong to — nothing more.' },
  { q: 'What is the connector URL?', a: 'https://api.megaevolution.io/mcp — paste it where your AI app asks for a custom connector or MCP server.' },
]

export default async function ConnectAi({ params }: P) {
  const { lang } = await params
  return (
    <>
      <div className="wrap"><Breadcrumbs lang={lang} items={[{ name: 'Connect your AI', path: '/connect-ai' }]} /></div>

      <section className="cai-hero on-dark">
        <div className="wrap cai-hero__grid">
          <div className="cai-hero__copy">
            <p className="eyebrow">Connect your AI <span className="tag tag--accent">New</span> <RoadmapTag status="live" /></p>
            <h1 className="h1">Run MegaEvolution<span className="it">from the chat you already use.</span></h1>
            <p className="lede">Add one connector to Claude, ChatGPT, Cursor or Gemini. Then ask in plain words: find creators, check orders, draft replies.</p>
            <div className="cai-url">
              <span className="cai-url__k">Connector URL</span>
              <CopyUrl source="hero" />
            </div>
            <ul className="cai-works" aria-label="Works with">
              <li>Works with</li><li>Claude</li><li>ChatGPT</li><li>Cursor</li><li>Gemini</li><li>any MCP app</li>
            </ul>
          </div>
          <ChatDemo />
        </div>
      </section>

      <section className="wrap sec" id="connect">
        <SectionHead eyebrow="Set it up" title="Four steps.|About two minutes.">Pick your AI app. The connector URL is the same everywhere.</SectionHead>
        <SetupSteps />
      </section>

      <section className="wrap sec cai-trust" aria-label="What the connector can do">
        <div className="cai-can">
          <p className="eyebrow">What it can do</p>
          <h2 className="h3">Everything your account can, by asking.</h2>
          <ul>{CAN.map(([i, t, d]) => <li key={t}><span><Icon name={i} size={18} /></span><b>{t}</b><small>{d}</small></li>)}</ul>
        </div>
        <div className="cai-asks on-dark">
          <span className="cai-asks__ico"><Icon name="shield" size={24} /></span>
          <h2 className="h3">Always asks you first</h2>
          <ul>{ASKS.map((a) => <li key={a}><Icon name="lock" size={15} />{a}</li>)}</ul>
          <p>The connector acts as you. It sees only what your account sees, and important actions wait for your approval on MegaEvolution.</p>
        </div>
      </section>

      <section className="wrap sec" id="app">
        <div className="cai-app">
          <div className="cai-app__copy">
            <p className="eyebrow">Coming next <RoadmapTag status="planned" /></p>
            <h2 className="h2">An AI manager for every creator,<span className="it">and a brand dashboard you run by chat.</span></h2>
            <div className="cai-app__form"><WaitlistForm source="ai_native_app" /></div>
          </div>
          <div className="cai-app__two">
            <div><Icon name="user" size={20} /><b>For creators</b><small>Answers brand requests, keeps your rates current and chases approvals.</small></div>
            <div><Icon name="building" size={20} /><b>For brands</b><small>Ask for a campaign, get a shortlist, approve drafts and read the report in one chat.</small></div>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <FaqCards lang={lang} items={FAQ} title="Before you|connect." />
      </section>
      <StickyCta lang={lang} to="#connect" cta="connect_ai" label="Connect your AI" />
    </>
  )
}
