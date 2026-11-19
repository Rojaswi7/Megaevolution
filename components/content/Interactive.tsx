'use client'
// Small interactive pieces for the content pages: connector tabs, help search, blog filter,
// the MCN contact form and the creator-side mock toggles.
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { href, MCP_URL } from '@/data/site'
import type { HelpArticle } from '@/data/help'
import type { Post } from '@/data/blog'
import { Icon, Arrow } from '../Icon'
import { fmtDate } from '@/lib/format'
import { track } from '@/lib/track'

// ---------- /connect-ai ----------
const APPS: { id: string; name: string; steps: { t: string; d: string; url?: boolean }[] }[] = [
  { id: 'claude', name: 'Claude', steps: [
    { t: 'Open Settings → Connectors', d: 'In Claude on the web or desktop, choose “Add custom connector”.' },
    { t: 'Paste the connector URL', d: 'Name it MegaEvolution and paste this address.', url: true },
    { t: 'Sign in to MegaEvolution', d: 'A MegaEvolution window opens. Log in and allow access. Sending messages and accepting orders still ask for your approval.' },
    { t: 'Ask in plain words', d: 'Try “Find 10 beauty creators in Vietnam under $300”.' },
  ] },
  { id: 'chatgpt', name: 'ChatGPT', steps: [
    { t: 'Open Settings → Connectors', d: 'Turn on developer mode if your plan needs it, then choose “Create”.' },
    { t: 'Paste the connector URL', d: 'Use this address as the MCP server URL.', url: true },
    { t: 'Sign in to MegaEvolution', d: 'Log in when the window opens and allow access.' },
    { t: 'Pick MegaEvolution in a chat', d: 'Select the connector in the tools menu, then ask your question.' },
  ] },
  { id: 'cursor', name: 'Cursor', steps: [
    { t: 'Open Settings → MCP', d: 'Choose “Add new MCP server”.' },
    { t: 'Add the server URL', d: 'Type: HTTP. URL:', url: true },
    { t: 'Sign in to MegaEvolution', d: 'Cursor opens the login page in your browser.' },
    { t: 'Use it from the agent', d: 'Ask the agent to pull creator data or order status into your work.' },
  ] },
  { id: 'gemini', name: 'Gemini', steps: [
    { t: 'Open the Gemini CLI settings', d: 'Add a new MCP server entry.' },
    { t: 'Add the server URL', d: 'Use this address as the HTTP URL.', url: true },
    { t: 'Sign in to MegaEvolution', d: 'Run the auth command and log in in the browser.' },
    { t: 'Ask in plain words', d: 'MegaEvolution tools are now available in your session.' },
  ] },
]

export function CopyUrl({ source }: { source: string }) {
  const [ok, setOk] = useState(false)
  return (
    <span className="ct-url">
      <code>{MCP_URL}</code>
      <button type="button" className="btn btn--sm" data-cta={`connect_copy_url_${source}`} onClick={() => { try { navigator.clipboard?.writeText(MCP_URL) } catch {} setOk(true); track('connector_url_copied', { source }); setTimeout(() => setOk(false), 1800) }}>
        <Icon name={ok ? 'check' : 'file'} size={14} />{ok ? 'Copied' : 'Copy'}
      </button>
    </span>
  )
}

export function ConnectTabs() {
  const [id, setId] = useState('claude')
  const app = APPS.find((a) => a.id === id)!
  return (
    <div>
      <div className="ct-tabs" role="group" aria-label="AI app">
        {APPS.map((a) => <button key={a.id} aria-pressed={a.id === id} className="chip" onClick={() => { setId(a.id); track('connect_app_selected', { app: a.id }) }}>{a.name}</button>)}
      </div>
      <ol className="ct-steps" aria-label={`Steps for ${app.name}`}>
        {app.steps.map((s) => (
          <li key={s.t}><div><b>{s.t}</b><p>{s.d}</p>{s.url ? <CopyUrl source={app.id} /> : null}</div></li>
        ))}
      </ol>
    </div>
  )
}

// ---------- /help ----------
export function HelpBrowser({ lang, articles, topics }: { lang: string; articles: HelpArticle[]; topics: string[] }) {
  const [q, setQ] = useState('')
  const [topic, setTopic] = useState('')
  const list = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return articles.filter((a) => (!topic || a.topic === topic) && words.every((w) => `${a.title} ${a.summary} ${a.topic} ${a.body.join(' ')}`.toLowerCase().includes(w)))
  }, [q, topic, articles])
  return (
    <>
      <div className="slab ct-hero ct-hero--one">
        <div>
          <p className="eyebrow">Help center</p>
          <h1 className="h1">How can we<span className="it">help you?</span></h1>
          <label className="ct-search">
            <Icon name="search" size={20} />
            <span className="sr">Search help articles</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => q.trim() && track('search', { query: q.trim(), results: list.length, source: 'help' })} placeholder="Search: refunds, rate card, revisions…" />
          </label>
        </div>
      </div>
      <div className="sec--tight ct-help" style={{ paddingBottom: 0 }}>
        <div className="ct-help__topics" role="group" aria-label="Topics">
          <button aria-pressed={!topic} onClick={() => setTopic('')}>All topics<small>{articles.length}</small></button>
          {topics.map((t) => <button key={t} aria-pressed={topic === t} onClick={() => { setTopic(t); track('filter_changed', { topic: t, source: 'help' }) }}>{t}<small>{articles.filter((a) => a.topic === t).length}</small></button>)}
        </div>
        <div>
          <p className="small muted" aria-live="polite" style={{ marginBottom: 12 }}>{list.length} {list.length === 1 ? 'article' : 'articles'}{topic ? ` in ${topic}` : ''}{q.trim() ? ` for “${q.trim()}”` : ''}</p>
          {list.length ? (
            <div className="ct-arts">
              {list.map((a) => (
                <article className="ct-art" key={a.slug}>
                  <h3><Link href={href(lang, `/help/${a.slug}`)} data-cta="help_article_open" prefetch={false}>{a.title}</Link></h3>
                  <p>{a.summary}</p>
                  <div className="ct-art__meta"><span className="tag">{a.topic}</span><span className="tag tag--soon">{a.audience}</span></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="card card--pad stack center">
              <h3 className="h3">Nothing matches that.</h3>
              <p className="muted">Try another word, or write to us and a person will answer.</p>
              <button className="btn btn--ghost" onClick={() => { setQ(''); setTopic('') }}>Clear search</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ---------- /blog ----------
export function BlogList({ lang, posts, topics }: { lang: string; posts: Omit<Post, 'body'>[]; topics: string[] }) {
  const [topic, setTopic] = useState('')
  const list = posts.filter((p) => !topic || p.category === topic)
  const [lead, ...rest] = list
  const used = topics.filter((t) => posts.some((p) => p.category === t))
  return (
    <>
      <div className="ct-filter" role="group" aria-label="Category">
        <button className="chip" aria-pressed={!topic} onClick={() => setTopic('')}>All posts</button>
        {used.map((t) => <button key={t} className="chip" aria-pressed={topic === t} onClick={() => { setTopic(t); track('filter_changed', { category: t, source: 'blog' }) }}>{t}</button>)}
      </div>
      {lead && (
        <article className="ct-lead">
          <div className={`ct-lead__tile tone-${lead.tone}`} aria-hidden="true">{lead.title.split(':')[0]}</div>
          <div className="ct-lead__body">
            <div className="ct-card__meta" style={{ padding: 0 }}><span className="tag tag--accent">Latest</span><span>{lead.category}</span><time dateTime={lead.date}>{fmtDate(lead.date)}</time></div>
            <h2><Link href={href(lang, `/blog/${lead.slug}`)} data-cta="blog_post_open" prefetch={false}>{lead.title}</Link></h2>
            <p>{lead.excerpt}</p>
            <span className="tlink" style={{ alignSelf: 'flex-start' }}>Read the article<Arrow size={15} /></span>
          </div>
        </article>
      )}
      <div className="ct-cards">
        {rest.map((p) => (
          <article className="ct-card" key={p.slug}>
            <div className={`ct-card__tile tone-${p.tone}`} aria-hidden="true">{p.title.split(':')[0]}</div>
            <div className="ct-card__meta"><span>{p.category}</span><time dateTime={p.date}>{fmtDate(p.date)}</time></div>
            <h3><Link href={href(lang, `/blog/${p.slug}`)} data-cta="blog_post_open" prefetch={false}>{p.title}</Link></h3>
            <p>{p.excerpt}</p>
          </article>
        ))}
      </div>
    </>
  )
}

// ---------- /mcn/[name] ----------
export function McnContactForm({ mcn, slug }: { mcn: string; slug: string }) {
  const [done, setDone] = useState(false)
  if (done) return <p className="form-ok" role="status"><Icon name="check" />Sent. {mcn} replies through the shared inbox, usually within a day.</p>
  return (
    <form className="stack" onSubmit={(e) => { e.preventDefault(); setDone(true); track('form_submitted', { form: 'mcn_contact', mcn: slug }) }}>
      <label className="field"><span>Your name</span><input className="input" name="name" required autoComplete="name" /></label>
      <label className="field"><span>Work email</span><input className="input" name="email" type="email" required autoComplete="email" /></label>
      <label className="field"><span>What do you need? <small>(optional)</small></span><textarea className="textarea" name="note" placeholder="Product, market and rough timing." /></label>
      <button className="btn btn--block" data-cta="mcn_page_contact_submit">Contact {mcn}<Arrow /></button>
    </form>
  )
}

// ---------- /for-creators ----------
/** "Let AI adjust my rates" — flipping it nudges the sample rates so the effect is visible. */
export function RateCardMock() {
  const [ai, setAi] = useState(true)
  const rows: [string, number, number][] = [['1 TikTok video', 12_000_000, 13_500_000], ['1 Instagram Reel', 9_000_000, 9_800_000], ['TikTok LIVE, 60 min', 15_000_000, 16_000_000], ['Bundle: 2 videos + 3 stories', 24_000_000, 26_500_000]]
  return (
    <div className="ct-win">
      <div className="ct-win__bar"><i /><i /><i /><span>My Rates · @minh.beauty · rate card in VND</span></div>
      <div className="ct-win__body">
        <div className="ct-rate">
          {rows.map(([name, base, tuned]) => {
            const v = ai ? tuned : base
            return (
              <div className="ct-rate__row" key={name}>
                <span>{name}<i className="ct-ai" style={{ fontStyle: 'normal' }}>AI pre-filled</i></span>
                <b>₫{(v / 1e6).toFixed(1).replace(/\.0$/, '')}M</b>
                <small>≈ ${Math.round(v / 25400).toLocaleString('en-US')}</small>
              </div>
            )
          })}
        </div>
        <div className="ct-toggle">
          <div><b>Let AI adjust my rates</b><small>{ai ? 'On — rates follow your last 30 days of views and engagement.' : 'Off — rates stay exactly as you set them.'}</small></div>
          <button type="button" role="switch" aria-checked={ai} aria-label="Let AI adjust my rates" className="ct-switch" data-cta="for_creators_ai_pricing_toggle" onClick={() => { setAi(!ai); track('ai_pricing_toggled', { on: !ai, source: 'for_creators' }) }} />
        </div>
        <p className="small muted">One currency per rate card. Brands see the converted price in their own currency. Sample numbers.</p>
      </div>
    </div>
  )
}
