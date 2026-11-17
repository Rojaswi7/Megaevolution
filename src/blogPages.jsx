import { useMemo, useState } from 'react'
import { BLOG_POSTS, BLOG_URL, BLOG_CATEGORIES } from './blogPosts.js'
import { Flag } from './flag.jsx'

/* ---------- helpers ---------- */
const COUNTRY_TAGS = [
  ['Indonesia', 'id'], ['Vietnam', 'vn'], ['Thailand', 'th'], ['Philippines', 'ph'], ['Malaysia', 'my'],
  ['Singapore', 'sg'], ['Taiwan', 'tw'], ['China', 'cn'], ['Korea', 'kr'], ['Japan', 'jp'], ['India', 'in'],
  ['Middle East', 'me'], ['Europe', 'eu'], ['US', 'us'], ['Latin America', 'latam'], ['Mexico', 'latam'],
]
const countryOf = (title) => {
  const hit = COUNTRY_TAGS.find(([name]) => new RegExp(`\\b${name}\\b`).test(title))
  return hit ? { name: hit[0], id: hit[1] } : null
}
const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const readMins = (html) => Math.max(1, Math.round(html.replace(/<[^>]+>/g, ' ').split(/\s+/).length / 220))
// posts we hold the full text for open on our own article page; the rest open on the blog
const hrefOf = (p) => (p.body ? `/blog/post/?p=${encodeURIComponent(p.slug)}` : p.url)
const isExternal = (p) => !p.body

function Arrow({ dir = 'ne' }) {
  const d = { ne: 'M3 11 11 3M5 3h6v6', w: 'M13 7H1M6 2 1 7l5 5' }[dir]
  return (
    <svg className="arrow" width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function Tag({ post }) {
  const c = countryOf(post.title)
  return c ? <span className="bpost__tag"><Flag market={c.id} />{c.name}</span> : null
}

function Card({ post, size = 'md' }) {
  const ext = isExternal(post)
  return (
    <a className={`bcard bcard--${size}`} href={hrefOf(post)} {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})}>
      <span className="bcard__img">{post.image && <img src={post.image} alt="" loading="lazy" referrerPolicy="no-referrer" />}</span>
      <span className="bcard__body">
        <span className="bpost__meta"><Tag post={post} /><time dateTime={post.date}>{fmtDate(post.date)}</time></span>
        <span className="bcard__title">{post.title}</span>
        {size !== 'sm' && <span className="bcard__excerpt">{post.excerpt}</span>}
        <span className="bcard__read">{ext ? 'Read on our blog' : 'Read'} <Arrow /></span>
      </span>
    </a>
  )
}

/* ============================================================
   Blog listing page
   ============================================================ */
export function BlogIndex() {
  const [cat, setCat] = useState('All')
  const [market, setMarket] = useState('All')
  const [q, setQ] = useState('')

  const markets = useMemo(() => {
    const seen = new Map()
    BLOG_POSTS.forEach((p) => { const c = countryOf(p.title); if (c) seen.set(c.id, c) })
    return [...seen.values()]
  }, [])

  const list = BLOG_POSTS.filter((p) =>
    (cat === 'All' || p.category === cat) &&
    (market === 'All' || countryOf(p.title)?.id === market) &&
    (!q || p.title.toLowerCase().includes(q.toLowerCase()))
  )
  const [lead, ...rest] = list

  return (
    <div className="bpage">
      <section className="bhero">
        <div className="wrap">
          <p className="hd__eyebrow">Blog</p>
          <div className="bhero__row">
            <h1 className="bhero__title">Notes from our markets</h1>
            <p className="bhero__note">
              Rules, shopping seasons and platform changes in the markets we work in, written by our local teams.
            </p>
          </div>

          <div className="bfilters">
            <div className="bfilters__tabs" role="tablist" aria-label="Category">
              {['All', ...BLOG_CATEGORIES].map((c) => (
                <button key={c} role="tab" aria-selected={c === cat} className={c === cat ? 'is-on' : ''} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
            <label className="bsearch">
              <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15ZM21 21l-5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts" aria-label="Search posts" />
            </label>
          </div>
          <div className="bmarkets" role="group" aria-label="Market">
            <button className={market === 'All' ? 'is-on' : ''} onClick={() => setMarket('All')}>All markets</button>
            {markets.map((m) => (
              <button key={m.id} className={market === m.id ? 'is-on' : ''} onClick={() => setMarket(m.id)}><Flag market={m.id} />{m.name}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="blist">
        <div className="wrap">
          {!lead && <p className="blist__empty">No posts match. Try another category or market.</p>}
          {lead && <Card post={lead} size="lg" />}
          {rest.length > 0 && <div className="blist__grid">{rest.map((p) => <Card key={p.url} post={p} />)}</div>}
          <div className="blist__more">
            <a className="btn btn--line" href={BLOG_URL} target="_blank" rel="noreferrer">See every post on our blog <Arrow /></a>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ============================================================
   Article page (design reference: renders the posts we hold in full)
   ============================================================ */
export function PostPage() {
  const withBody = BLOG_POSTS.filter((p) => p.body)
  const slug = new URLSearchParams(window.location.search).get('p')
  const post = withBody.find((p) => p.slug === slug) || withBody[0]
  if (!post) return <div className="wrap" style={{ padding: '80px 0' }}>Post not found. <a href="/blog/">Back to the blog</a></div>
  const more = BLOG_POSTS.filter((p) => p.url !== post.url).slice(0, 3)
  const c = countryOf(post.title)
  // the feed repeats the title as the first heading
  const body = post.body.replace(/^\s*<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>/, (m) => (m.replace(/<[^>]+>/g, '').trim() === post.title ? '' : m))

  return (
    <article className="post">
      <div className="wrap post__head">
        <a className="post__back" href="/blog/"><Arrow dir="w" /> All posts</a>
        <p className="post__crumbs">{post.category}</p>
        <h1 className="post__title">{post.title}</h1>
        <div className="post__meta">
          {c && <span className="bpost__tag"><Flag market={c.id} />{c.name}</span>}
          <time dateTime={post.date}>{fmtDate(post.date)}</time>
          <span>{readMins(post.body)} min read</span>
          <span>By the MegaEvolution team</span>
        </div>
      </div>

      {post.image && (
        <div className="wrap"><figure className="post__cover"><img src={post.image} alt="" referrerPolicy="no-referrer" /></figure></div>
      )}

      <div className="wrap post__layout">
        <div className="post__body" dangerouslySetInnerHTML={{ __html: body }} />
        <aside className="post__aside">
          <div className="post__cta">
            <p className="post__cta-k">Planning a launch{c ? ` in ${c.name}` : ''}?</p>
            <p>Our team there can suggest creators and rates for your product.</p>
            <a className="btn btn--shine" href="/#contact">Start a campaign <Arrow /></a>
          </div>
          <a className="post__orig" href={post.url} target="_blank" rel="noreferrer">Original post on our blog <Arrow /></a>
        </aside>
      </div>

      <section className="post__more">
        <div className="wrap">
          <p className="hd__eyebrow">More from the blog</p>
          <div className="blist__grid">{more.map((p) => <Card key={p.url} post={p} size="sm" />)}</div>
        </div>
      </section>
    </article>
  )
}
