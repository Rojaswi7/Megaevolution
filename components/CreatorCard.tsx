// Creator tile used on the home page, search, hubs and "similar creators".
// It looks like the creator's own post on their main platform (TikTok side counts,
// YouTube duration + progress, Instagram reel mark), and then says everything a
// buyer needs: handle, flag, every platform they are on with follower counts,
// followers, average views, engagement, and a "from" rate in the creator's
// currency plus the visitor's currency.
import Link from 'next/link'
import { href } from '@/data/site'
import type { Creator } from '@/data/creators'
import { marketById } from '@/data/markets'
import { categoryBySlug } from '@/data/categories'
import { compact, localMoney } from '@/lib/format'
import { Flag, Icon, PlatformIcon } from './Icon'
import { Money } from './Money'
import { SaveButton } from './client'

export function Verified() {
  return (
    <svg className="verified" width="15" height="15" viewBox="0 0 24 24" role="img" aria-label="Verified">
      <path d="M12 2l2.4 1.800 3-.200.900 2.900 2.500 1.700-1 2.800 1 2.800-2.500 1.700-.900 2.900-3-.200L12 22l-2.400-1.800-3 .200-.900-2.900-2.500-1.700 1-2.800-1-2.800 2.500-1.700.900-2.900 3 .200L12 2Z" fill="currentColor" />
      <path d="M8 12.300l2.600 2.500L16 9.500" fill="none" stroke="var(--vf, #fff)" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Avatar({ c, size }: { c: { name: string; tone: number }; size?: number }) {
  return <span className={`av tone-${c.tone}`} style={size ? ({ ['--s' as any]: `${size}px` }) : undefined} aria-hidden="true">{c.name[0]}</span>
}

// deterministic sample numbers for the post chrome
function seed(s: string) { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h }
export function postStats(c: Creator) {
  const s = seed(c.handle)
  return { likes: compact(Math.round(c.avgViews * (0.05 + (s % 9) / 100))), comments: compact(300 + (s % 9000)), mins: `${6 + (s % 14)}:${String(s % 60).padStart(2, '0')}`, days: 1 + (s % 6), progress: 22 + (s % 55) }
}

/** The look of a post on that platform, drawn flat. No real media in the mockup. */
export function PlatformChrome({ c, platform }: { c: Creator; platform: string }) {
  const st = postStats(c)
  if (platform === 'TikTok') {
    return (
      <span className="pc pc--tt" aria-hidden="true">
        <span><Icon name="heart" size={17} stroke={0} className="pc__fill" />{st.likes}</span>
        <span><Icon name="message" size={16} stroke={0} className="pc__fill" />{st.comments}</span>
        <span><Icon name="arrowUpRight" size={16} stroke={2.2} /></span>
      </span>
    )
  }
  if (platform === 'YouTube') return <span className="pc pc--yt" aria-hidden="true"><b>{st.mins}</b><i style={{ width: `${st.progress}%` }} /></span>
  if (platform === 'Instagram') return <span className="pc pc--ig" aria-hidden="true"><Icon name="film" size={17} /></span>
  return null
}

/** Flat cover tile: the creator's caption as cover text, like a video title card. */
export function Thumb({ c, caption, views, ratio, tone, platform }: { c: Creator; caption?: string; views?: number; ratio?: string; tone?: number; platform?: string }) {
  const p = platform || c.platforms[0].platform
  return (
    <div className={`thumb tone-${tone ?? c.tone}`} style={ratio ? ({ ['--ar' as any]: ratio }) : undefined}>
      <div className="thumb__top"><PlatformIcon name={p} size={15} mono /></div>
      <p className="thumb__cap">{caption || c.caption}</p>
      <div className="thumb__bot"><span className="thumb__views"><Icon name="play" size={11} stroke={2.2} />{compact(views ?? c.avgViews)}</span></div>
    </div>
  )
}

/** Every platform the creator is on, with follower counts. */
export function PlatformList({ c, size = 14 }: { c: Creator; size?: number }) {
  return (
    <ul className="plist" aria-label="Available on">
      {c.platforms.map((p) => <li key={p.platform} title={`${p.platform}: ${compact(p.followers)} followers`}><PlatformIcon name={p.platform} size={size} /><span>{compact(p.followers)}</span></li>)}
    </ul>
  )
}

type CardProps = { c: Creator; lang: string; gmvSlot?: boolean; selected?: boolean; onSelect?: () => void }

export function CreatorCard({ c, lang, gmvSlot = false, selected = false, onSelect }: CardProps) {
  const m = marketById[c.market]
  const main = c.platforms[0].platform
  return (
    <article className={`rt ${selected ? 'is-on' : ''}`} data-handle={c.handle} onMouseEnter={onSelect} onFocus={onSelect}>
      <div className={`rt__media tone-${c.tone}`}>
        <div className="rt__top">
          <span className="rt__plat"><PlatformIcon name={main} size={14} />{main}</span>
          <span className="rt__rate" title="Starting rate in the creator's own currency">{localMoney(c.rateLocal, c.currency)}+</span>
        </div>
        <PlatformChrome c={c} platform={main} />
        <p className="rt__cap">{c.caption}</p>
        <span className="rt__views"><Icon name="play" size={11} stroke={2.2} />{compact(c.avgViews)} avg views</span>
      </div>
      <SaveButton handle={c.handle} />
      <div className="rt__body">
        <div className="rt__who">
          <Avatar c={{ name: c.name, tone: (c.tone + 5) % 8 }} size={38} />
          <div className="rt__id">
            <p className="rt__handle">
              <Link href={href(lang, `/@${c.handle}`)} className="rt__link" data-cta="creator_card_view_profile" prefetch={false}>@{c.handle}</Link>
              {c.verified && <Verified />}
            </p>
            <p className="rt__place"><Flag market={c.market} title={m.name} />{c.city} · {categoryBySlug[c.category].label}</p>
          </div>
        </div>
        <dl className="rt__stats">
          <div><dt>Followers</dt><dd>{compact(c.followers)}</dd></div>
          <div><dt>Avg views</dt><dd>{compact(c.avgViews)}</dd></div>
          <div><dt>Eng.</dt><dd>{c.er}%</dd></div>
        </dl>
        <div className="rt__foot">
          <PlatformList c={c} />
          <p className="rt__from">from <b>{c.currency === 'USD' ? localMoney(c.rateLocal, 'USD') : <Money usd={c.rateUsd} />}</b></p>
        </div>
        {gmvSlot && <p className="rt__gmv" title="Coming soon: TikTok Shop sales per creator"><Icon name="bag" size={13} />TikTok Shop sales · coming soon</p>}
      </div>
    </article>
  )
}
