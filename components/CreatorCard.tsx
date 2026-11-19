// Creator card used on the home page, search, hubs and "similar creators".
// Shows: cover tile with the creator's own caption, handle, flag, platform logos,
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
      <path d="M8 12.300l2.600 2.500L16 9.500" fill="none" stroke="#fff" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Avatar({ c, size }: { c: { name: string; tone: number }; size?: number }) {
  return <span className={`av tone-${c.tone}`} style={size ? ({ ['--s' as any]: `${size}px` }) : undefined} aria-hidden="true">{c.name[0]}</span>
}

/** Flat cover tile: the creator's caption as cover text, like a video title card. */
export function Thumb({ c, caption, views, ratio, tone, platform }: { c: Creator; caption?: string; views?: number; ratio?: string; tone?: number; platform?: string }) {
  const p = platform || c.platforms[0].platform
  return (
    <div className={`thumb tone-${tone ?? c.tone}`} style={ratio ? ({ ['--ar' as any]: ratio }) : undefined}>
      <div className="thumb__top"><PlatformIcon name={p} size={15} mono /></div>
      <p className="thumb__cap" lang={c.market === 'us' || c.market === 'ph' ? 'en' : undefined}>{caption || c.caption}</p>
      <div className="thumb__bot"><span className="thumb__views"><Icon name="play" size={11} stroke={2.2} />{compact(views ?? c.avgViews)}</span></div>
    </div>
  )
}

export function CreatorCard({ c, lang, gmvSlot = false, priority = false }: { c: Creator; lang: string; gmvSlot?: boolean; priority?: boolean }) {
  const m = marketById[c.market]
  const local = c.currency !== 'USD'
  return (
    <article className="cc" data-handle={c.handle}>
      <Thumb c={c} />
      <SaveButton handle={c.handle} />
      <div className="cc__who">
        <Avatar c={{ name: c.name, tone: (c.tone + 5) % 8 }} />
        <div className="cc__id">
          <h3 className="cc__handle">
            <Link href={href(lang, `/@${c.handle}`)} className="cc__link" data-cta="creator_card_view_profile" prefetch={false}><span>@{c.handle}</span></Link>
            {c.verified && <Verified />}
          </h3>
          <p className="cc__place"><Flag market={c.market} title={m.name} />{c.city} · {categoryBySlug[c.category].label}</p>
        </div>
      </div>
      <dl className="cc__stats">
        <div><dt>Followers</dt><dd>{compact(c.followers)}</dd></div>
        <div><dt><i>Avg </i>views</dt><dd>{compact(c.avgViews)}</dd></div>
        <div><dt>Eng.</dt><dd>{c.er}%</dd></div>
      </dl>
      <div className="cc__foot">
        <p className="cc__rate">from <b>{localMoney(c.rateLocal, c.currency)}</b>{local ? <>≈ <Money usd={c.rateUsd} /></> : <span className="sr">US dollars</span>}</p>
        <span className="plats">{c.platforms.map((p) => <PlatformIcon key={p.platform} name={p.platform} size={15} />)}</span>
      </div>
      {gmvSlot && <p className="cc__gmv" title="Coming soon: TikTok Shop sales per creator"><Icon name="bag" size={13} />TikTok Shop sales · coming soon</p>}
    </article>
  )
}
