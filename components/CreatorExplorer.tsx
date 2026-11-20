'use client'
// Creator search: filters + list. Used on the home page (right below the hero)
// and on /creators and the country / category hubs.
// The first page of results is server-rendered and never gated.
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { href } from '@/data/site'
import type { Creator } from '@/data/creators'
import { MARKETS, marketById } from '@/data/markets'
import { CATEGORIES, categoryBySlug } from '@/data/categories'
import { SEARCH_GATE } from '@/data/pricing'
import { CreatorCard, CreatorRow, Avatar, Verified, postStats } from './CreatorCard'
import { PostFrame } from './PostFrame'
import { Money } from './Money'
import { SaveButton } from './client'
import { compact, localMoney } from '@/lib/format'
import { Flag, Icon, PlatformIcon, Arrow } from './Icon'
import { GateDialog } from './client'
import { useApp } from './AppState'
import { track } from '@/lib/track'

export type Filters = { q: string; country: string; category: string; platform: string; followers: string; er: string; posts: string; language: string; sort: string }
const EMPTY: Filters = { q: '', country: '', category: '', platform: '', followers: '', er: '', posts: '', language: '', sort: 'followers' }
const BANDS: Record<string, [number, number, string]> = {
  nano: [0, 50_000, 'Under 50K'], micro: [50_000, 250_000, '50K – 250K'], mid: [250_000, 1_000_000, '250K – 1M'], macro: [1_000_000, Infinity, '1M and up'],
}
const PLATFORMS = ['Instagram', 'TikTok', 'YouTube']

function apply(list: Creator[], f: Filters) {
  const q = f.q.trim().toLowerCase()
  const out = list.filter((c) => {
    if (f.country && marketById[c.market].slug !== f.country) return false
    if (f.category && c.category !== f.category) return false
    if (f.platform && !c.platforms.some((p) => p.platform === f.platform)) return false
    if (f.followers) { const [lo, hi] = BANDS[f.followers]; if (c.followers < lo || c.followers >= hi) return false }
    if (f.er && c.er < Number(f.er)) return false
    if (f.posts && c.posts < Number(f.posts)) return false
    if (f.language && !c.langs.includes(f.language)) return false
    if (q) {
      const m = marketById[c.market]
      const hay = `${c.handle} ${c.name} ${c.city} ${m.name} ${m.short} ${m.adjective} ${categoryBySlug[c.category].label} ${c.category} ${c.platforms.map((p) => p.platform).join(' ')}`.toLowerCase()
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false
    }
    return true
  })
  const key = f.sort
  if (key === 'featured') return out
  return out.sort((a, b) => (key === 'er' ? b.er - a.er : key === 'views' ? b.avgViews - a.avgViews : key === 'rate' ? a.rateUsd - b.rateUsd : b.followers - a.followers))
}

type Props = {
  lang: string
  creators: Creator[] // full sample set (compact)
  initial?: Partial<Filters>
  pageSize?: number
  mode?: 'home' | 'full'
  lock?: ('country' | 'category')[] // hubs fix these filters
  total?: number // size of the whole catalogue, when only a slice is passed in (home page)
  heading?: React.ReactNode // shown inside the filter console (home page)
}

export default function CreatorExplorer({ lang, creators, initial = {}, pageSize = 12, mode = 'full', lock = [], total, heading }: Props) {
  const { role } = useApp()
  const [f, setF] = useState<Filters>({ ...EMPTY, ...initial })
  const [shown, setShown] = useState(pageSize)
  const [changes, setChanges] = useState(0)
  const [gate, setGate] = useState<null | 'filters' | 'results'>(null)
  const [gateSeen, setGateSeen] = useState(false)
  const [open, setOpen] = useState(false)
  const top = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0) // spotlight index (home)
  const [page, setPage] = useState(0)
  const [hold, setHold] = useState(false)
  const [picked, setPicked] = useState(false) // once someone picks a creator, the spotlight stops rotating

  // read ?q=&country=&category=&platform= on the client so the page itself stays static
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const fromUrl: Partial<Filters> = {}
    for (const k of ['q', 'country', 'category', 'platform'] as const) { const v = p.get(k); if (v && !lock.includes(k as any)) fromUrl[k] = v }
    if (Object.keys(fromUrl).length) { setF((x) => ({ ...x, ...fromUrl })); track('search', { ...fromUrl, source: 'url' }) }
    // the hero search bar and quick chips talk to this list through one event
    const on = (e: Event) => {
      const d = (e as CustomEvent).detail as Partial<Filters>
      setF({ ...EMPTY, ...initial, ...d }); setShown(pageSize)
      top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    window.addEventListener('me:search', on)
    return () => window.removeEventListener('me:search', on)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const results = useMemo(() => apply(creators, f), [creators, f])
  const languages = useMemo(() => Array.from(new Set(creators.flatMap((c) => c.langs))).sort(), [creators])
  const activeCount = (['country', 'category', 'platform', 'followers', 'er', 'posts', 'language'] as const).filter((k) => f[k] && !lock.includes(k as any)).length

  const set = (k: keyof Filters, v: string) => {
    setF((x) => ({ ...x, [k]: v })); setShown(pageSize)
    track(k === 'q' ? 'search' : 'filter_changed', { [k]: v, source: mode })
    if (k !== 'q' && k !== 'sort') {
      const n = changes + 1; setChanges(n)
      if (role === 'guest' && !gateSeen && n >= SEARCH_GATE.filterChanges) setGate('filters')
    }
  }
  const more = () => {
    if (role === 'guest' && !gateSeen && shown >= SEARCH_GATE.results) { setGate('results'); return }
    setShown((s) => s + pageSize); track('results_load_more', { shown: shown + pageSize })
  }
  const reset = () => { setF({ ...EMPTY, ...initial }); setShown(pageSize); track('filters_reset', { source: mode }) }
  const closeGate = () => { setGate(null); setGateSeen(true); if (gate === 'results') setShown((s) => s + pageSize) }

  // "+N if you relax this" — the AI Listup idea, in the plain search
  const relax = useMemo(() => {
    if (results.length >= 6 || !activeCount) return null
    let best: { k: keyof Filters; n: number } | null = null
    for (const k of ['er', 'posts', 'followers', 'language', 'platform'] as const) {
      if (!f[k]) continue
      const n = apply(creators, { ...f, [k]: '' }).length - results.length
      if (n > 0 && (!best || n > best.n)) best = { k, n }
    }
    return best
  }, [results.length, activeCount, f, creators])
  const relaxName: Record<string, string> = { er: 'engagement', posts: 'minimum posts', followers: 'follower range', language: 'language', platform: 'platform' }

  const list = results.slice(0, shown)
  // home: spotlight + six tiles per page; the spotlight walks through the page on its own
  const PER = 4
  const pages = Math.max(1, Math.ceil(Math.min(results.length, 12) / PER))
  const pageList = results.slice(page * PER, page * PER + PER)
  const spot = pageList[active] || pageList[0]
  useEffect(() => { setActive(0); setPage(0) }, [f])
  useEffect(() => {
    if (mode !== 'home' || hold || picked || pageList.length < 2) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setActive((a) => (a + 1) % pageList.length), 4600)
    return () => clearTimeout(t)
  }, [mode, hold, picked, active, pageList.length])
  const allHref = href(lang, '/creators') + (f.country || f.category || f.q ? `?${new URLSearchParams(Object.entries({ q: f.q, country: f.country, category: f.category, platform: f.platform }).filter(([, v]) => v) as any).toString()}` : '')

  return (
    <div className="cx" ref={top} id="results">
      {heading ? (
        <div className="ct__head">
          <div className="ct__title">{heading}</div>
          <p className="ct__count" aria-live="polite"><b>{results.length}</b> {results.length === 1 ? 'creator' : 'creators'}{f.category ? <> in {CATEGORIES.find((c) => c.slug === f.category)!.label}</> : null}</p>
        </div>
      ) : null}

      <div className="ct">
        <label className="ct__q">
          <Icon name="search" size={17} />
          <span className="sr">Search creators by name, handle or keyword</span>
          <input value={f.q} onChange={(e) => set('q', e.target.value)} placeholder="Search creators" />
        </label>
        {!lock.includes('category') && (
          <div className="ct__cats scroller" role="group" aria-label="Category">
            <button className={!f.category ? 'is-on' : ''} aria-pressed={!f.category} onClick={() => set('category', '')}>All</button>
            {CATEGORIES.map((c) => <button key={c.slug} className={f.category === c.slug ? 'is-on' : ''} aria-pressed={f.category === c.slug} onClick={() => set('category', f.category === c.slug ? '' : c.slug)}><Icon name={c.icon} size={15} />{c.label}</button>)}
          </div>
        )}
        <div className="ct__plat" role="group" aria-label="Platform">
          {PLATFORMS.map((p) => (
            <button key={p} aria-pressed={f.platform === p} aria-label={p} title={p} onClick={() => set('platform', f.platform === p ? '' : p)}><PlatformIcon name={p} size={16} /></button>
          ))}
        </div>
        <div className="ct__pop">
          <button className={`ct__more ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-expanded={open}><Icon name="filter" size={16} />Filters{activeCount ? <i>{activeCount}</i> : null}</button>
          {open ? (
            <div className="ct__panel" role="dialog" aria-label="Filters">
              <div className="ct__grid">
                {!lock.includes('country') && (
                  <label className={`ct__f ${f.country ? 'is-set' : ''}`}><span>Country</span>
                <select value={f.country} onChange={(e) => set('country', e.target.value)}><option value="">Any</option>{MARKETS.map((m) => <option key={m.id} value={m.slug}>{m.name}</option>)}</select>
              </label>
                )}
                <label className={`ct__f ${f.followers ? 'is-set' : ''}`}><span>Followers</span>
                <select value={f.followers} onChange={(e) => set('followers', e.target.value)}><option value="">Any</option>{Object.entries(BANDS).map(([k, v]) => <option key={k} value={k}>{v[2]}</option>)}</select>
              </label>
                <label className={`ct__f ${f.er ? 'is-set' : ''}`}><span>Engagement</span>
                <select value={f.er} onChange={(e) => set('er', e.target.value)}><option value="">Any</option><option value="3">3% and up</option><option value="5">5% and up</option><option value="7">7% and up</option></select>
              </label>
                <label className={`ct__f ${f.posts ? 'is-set' : ''}`}><span>Minimum posts</span>
                <select value={f.posts} onChange={(e) => set('posts', e.target.value)}><option value="">Any</option><option value="50">50+</option><option value="150">150+</option><option value="400">400+</option></select>
              </label>
                <label className={`ct__f ${f.language ? 'is-set' : ''}`}><span>Language</span>
                <select value={f.language} onChange={(e) => set('language', e.target.value)}><option value="">Any</option>{languages.map((l) => <option key={l}>{l}</option>)}</select>
              </label>
                <span className="ct__f ct__f--soon" aria-disabled="true" title="Coming soon: TikTok Shop sales per creator"><span>Sales (GMV)</span><em><Icon name="lock" size={12} />Coming soon</em></span>
              </div>
              <div className="ct__panelfoot">
                <button className="ulink" onClick={reset}>Clear all</button>
                <button className="btn btn--sm" onClick={() => setOpen(false)}>Show {results.length} creators</button>
              </div>
            </div>
          ) : null}
        </div>
        <label className="ct__sort"><span className="sr">Sort</span>
          <select aria-label="Sort creators" value={f.sort} onChange={(e) => set('sort', e.target.value)}>
            {mode === 'home' ? <option value="featured">Featured</option> : null}<option value="followers">Most followers</option><option value="views">Most views</option><option value="er">Highest engagement</option><option value="rate">Lowest starting rate</option>
            <option value="gmv" disabled>TikTok Shop sales (soon)</option>
          </select>
        </label>
      </div>

      {activeCount || f.q ? (
        <div className="ct__chips">
          {f.q ? <button onClick={() => set('q', '')}>“{f.q}”<Icon name="close" size={12} /></button> : null}
          {(['country', 'platform', 'followers', 'er', 'posts', 'language'] as const).filter((k) => f[k] && !lock.includes(k as any)).map((k) => (
            <button key={k} onClick={() => set(k, '')}>
              {k === 'country' ? MARKETS.find((m) => m.slug === f.country)?.name : k === 'followers' ? BANDS[f.followers]?.[2] : k === 'er' ? `${f.er}%+ engagement` : k === 'posts' ? `${f.posts}+ posts` : f[k]}
              <Icon name="close" size={12} />
            </button>
          ))}
          <button className="ct__clear" onClick={reset}>Clear all</button>
          {!heading ? <span className="ct__n"><b>{results.length}</b> creators</span> : null}
        </div>
      ) : !heading ? <p className="ct__chips"><span className="ct__n"><b>{results.length}</b> creators</span></p> : null}

      {relax && <p className="cx__relax"><Icon name="sparkle" size={15} /><span><b>+{relax.n} more</b> if you relax {relaxName[relax.k]}.</span><button className="ulink" onClick={() => set(relax.k, '')}>Relax it</button></p>}

      {list.length && mode === 'home' && spot ? (
        <div className="show" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
          <Spotlight c={spot} lang={lang} />
          <div className="show__side">
            <div className="show__grid">
              {pageList.map((c, i) => <CreatorRow key={c.handle} c={c} lang={lang} selected={i === active} onSelect={() => { setActive(i); setPicked(true); track('spotlight_selected', { handle: c.handle }) }} />)}
            </div>
            {pages > 1 ? (
              <div className="show__pager">
                <span className="small muted">Showing {page * PER + 1}–{page * PER + pageList.length} of {results.length}</span>
                <button className="show__nav" aria-label="Previous creators" disabled={page === 0} onClick={() => { setPage(page - 1); setActive(0) }}><Icon name="arrow" size={18} className="show__flip" /></button>
                <button className="show__nav" aria-label="More creators" disabled={page >= pages - 1} onClick={() => { setPage(page + 1); setActive(0); track('results_load_more', { source: 'home_pager' }) }}><Icon name="arrow" size={18} /></button>
              </div>
            ) : null}
          </div>
        </div>
      ) : list.length ? (
        <div className="cgrid">{list.map((c) => <CreatorCard key={c.handle} c={c} lang={lang} gmvSlot={mode === 'full'} />)}</div>
      ) : (
        <div className="cx__empty card card--pad">
          <h3 className="h3">No creators match all of that.</h3>
          <p className="muted">Try clearing a filter, or let our team shortlist for you.</p>
          <div className="row" style={{ justifyContent: 'center', marginTop: 8 }}>
            <button className="btn btn--ghost" onClick={reset}>Clear filters</button>
            <Link className="btn" href={href(lang, '/about-agency#inquiry')} data-cta="search_empty_agency">Explore your campaign options<Arrow /></Link>
          </div>
        </div>
      )}

      <div className="cx__more">
        {mode === 'home' ? (
          <Link className="btn btn--lg" href={allHref} data-cta="home_see_all_creators">See all {total || creators.length} creators<Arrow /></Link>
        ) : shown < results.length ? (
          <button className="btn btn--ghost btn--lg" onClick={more} data-cta="results_load_more">Show more creators</button>
        ) : null}
        {mode === 'full' ? <p className="small muted">Sample profiles for the mockup.</p> : null}
      </div>

      {gate && (
        <GateDialog lang={lang} reason={gate === 'filters' ? 'search_filters' : 'search_results'}
          title={gate === 'filters' ? 'Keep your filters and save lists' : 'See every creator, free'}
          text="Create a free account to keep filtering, save creators to lists and get the full results. It takes under a minute."
          onClose={closeGate} />
      )}
    </div>
  )
}

/** The featured creator on the home page, framed like a post on their main platform. */
function Spotlight({ c, lang }: { c: Creator; lang: string }) {
  const m = marketById[c.market]
  const main = c.platforms[0]
  const st = postStats(c)
  return (
    <article className={'spot' + (main.platform === 'YouTube' ? '' : ' spot--vert')} key={c.handle} aria-live="polite">
      <div className={'spot__media tone-' + c.tone + ' spot__media--' + main.platform.toLowerCase()}>
        <PostFrame c={c} size="spot" />
      </div>
      <div className="spot__body">
        <div className="spot__title">
          <Avatar c={{ name: c.name, tone: (c.tone + 5) % 8 }} size={46} />
          <div>
            <h3>{c.caption}</h3>
            <p>{c.name} · {compact(Math.round(c.avgViews * 1.3))} views · {st.days} {st.days === 1 ? 'day' : 'days'} ago</p>
          </div>
        </div>
        <div className="spot__chan">
          <div>
            <p className="spot__handle">@{c.handle}{c.verified ? <Verified /> : null}</p>
            <p className="spot__place"><Flag market={c.market} title={m.name} />{c.city}, {m.name} · {categoryBySlug[c.category].label}</p>
          </div>
          <div className="row">
            <SaveButton handle={c.handle} />
            <Link className="btn btn--dark" href={href(lang, '/@' + c.handle)} data-cta="spotlight_view_profile" prefetch={false}>View profile &amp; rates<Arrow /></Link>
          </div>
        </div>
        <div className="spot__on">
          <span className="spot__lbl">Available on</span>
          <ul>
            {c.platforms.map((p) => (
              <li key={p.platform}><PlatformIcon name={p.platform} size={17} /><b>{compact(p.followers)}</b><span>{p.platform} · {p.er}% eng.</span></li>
            ))}
          </ul>
        </div>
        <dl className="spot__stats">
          <div><dt>Followers</dt><dd>{compact(c.followers)}</dd></div>
          <div><dt>Avg views</dt><dd>{compact(c.avgViews)}</dd></div>
          <div><dt>Engagement</dt><dd>{c.er}%</dd></div>
          <div><dt>From</dt><dd>{localMoney(c.rateLocal, c.currency)}{c.currency !== 'USD' ? <small>≈ <Money usd={c.rateUsd} /></small> : null}</dd></div>
        </dl>
      </div>
    </article>
  )
}

/** Hero search bar: keyword + country + platform. Works without JS as a GET form to /creators. */
export function HeroSearch({ lang, action = 'event' }: { lang: string; action?: 'event' | 'navigate' }) {
  const [platform, setPlatform] = useState('')
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget)
    const detail = { q: String(fd.get('q') || ''), country: String(fd.get('country') || ''), platform }
    track('search', { ...detail, source: 'hero' })
    if (action === 'event' && document.getElementById('results')) { e.preventDefault(); window.dispatchEvent(new CustomEvent('me:search', { detail })) }
  }
  return (
    <form className="hs" action={href(lang, '/creators')} method="get" onSubmit={submit} role="search" aria-label="Search creators">
      <label className="hs__f hs__f--q">
        <span>Keyword</span>
        <input name="q" placeholder="skincare, street food, unboxing…" autoComplete="off" />
      </label>
      <label className="hs__f">
        <span>Country</span>
        <select name="country" defaultValue=""><option value="">Any market</option>{MARKETS.map((m) => <option key={m.id} value={m.slug}>{m.name}</option>)}</select>
      </label>
      <div className="hs__f hs__f--plat" role="group" aria-label="Platform">
        <span>Platform</span>
        <div>
          {PLATFORMS.map((p) => <button type="button" key={p} aria-pressed={platform === p} aria-label={p} title={p} onClick={() => setPlatform(platform === p ? '' : p)}><PlatformIcon name={p} size={18} /></button>)}
          <input type="hidden" name="platform" value={platform} />
        </div>
      </div>
      <button className="btn btn--lg hs__go" data-cta="hero_search_creators" aria-label="Search creators"><Icon name="search" size={18} stroke={2.1} /><span className="hs__golabel">Search creators</span></button>
    </form>
  )
}

/** Quick chip under the hero search, e.g. "Beauty · Vietnam". Real link for crawlers, in-page filter for people. */
export function QuickChip({ lang, country, category, children }: { lang: string; country: string; category: string; children: React.ReactNode }) {
  return (
    <a className="chip" href={href(lang, `/creators/${country}/${category}`)} data-cta="hero_quick_chip"
      onClick={(e) => { if (document.getElementById('results')) { e.preventDefault(); track('search', { country, category, source: 'quick_chip' }); window.dispatchEvent(new CustomEvent('me:search', { detail: { country, category } })) } }}>
      {children}
    </a>
  )
}
