// Creator tile used on the home page, search, hubs and "similar creators".
// Top: the creator's post as their main platform shows it (PostFrame).
// Bottom: always the same four rows, so every tile in a row lines up:
//   who · stats · platforms they post on · starting rate + save
import Link from 'next/link'
import { href } from '@/data/site'
import type { Creator } from '@/data/creators'
import { marketById } from '@/data/markets'
import { categoryBySlug } from '@/data/categories'
import { compact, localMoney } from '@/lib/format'
import { Flag, Icon, PlatformIcon } from './Icon'
import { Money } from './Money'
import { SaveButton } from './client'
import { PostFrame, postStats } from './PostFrame'

export { postStats }
const LOGOS = ['Instagram', 'TikTok', 'YouTube']

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

/** Flat cover tile: the creator's caption as cover text (used on profiles and the hero). */
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
      {c.platforms.map((p) => <li key={p.platform} title={`${p.platform}: ${compact(p.followers)} followers`}>{LOGOS.includes(p.platform) ? <PlatformIcon name={p.platform} size={size} /> : <em className="plist__name">{p.platform}</em>}<span>{compact(p.followers)}</span></li>)}
    </ul>
  )
}

type CardProps = { c: Creator; lang: string; selected?: boolean; onSelect?: () => void }

export function CreatorCard({ c, lang, selected = false, onSelect }: CardProps) {
  const m = marketById[c.market]
  return (
    <article className={`rt ${selected ? 'is-on' : ''} ${onSelect ? 'rt--pick' : ''}`} data-handle={c.handle}>
      {onSelect ? <button className="rt__pick" onClick={onSelect} aria-pressed={selected} aria-label={`Show @${c.handle} in the spotlight`} data-cta="creator_card_spotlight" /> : null}
      <div className="rt__media"><PostFrame c={c} /></div>
      <div className="rt__body">
        <div className="rt__who">
          <Avatar c={{ name: c.name, tone: (c.tone + 5) % 8 }} size={36} />
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
        <div className="rt__on"><span>On</span><PlatformList c={c} size={13} /></div>
        <div className="rt__foot">
          <p className="rt__from">from <b>{localMoney(c.rateLocal, c.currency)}</b>{c.currency !== 'USD' ? <small>≈ <Money usd={c.rateUsd} /></small> : null}</p>
          <SaveButton handle={c.handle} />
        </div>
      </div>
    </article>
  )
}

/** Compact "up next" row for the home spotlight list. Clicking the row features the creator. */
export function CreatorRow({ c, lang, selected, onSelect }: { c: Creator; lang: string; selected: boolean; onSelect: () => void }) {
  const m = marketById[c.market]
  const main = c.platforms[0].platform
  return (
    <article className={`cr ${selected ? 'is-on' : ''}`} data-handle={c.handle}>
      <button className="rt__pick" onClick={onSelect} aria-pressed={selected} aria-label={`Show @${c.handle} in the spotlight`} data-cta="creator_row_spotlight" />
      <div className={`cr__thumb tone-${c.tone} cr__thumb--${main.toLowerCase()}`} aria-hidden="true">
        {LOGOS.includes(main) ? <span className="cr__plat"><PlatformIcon name={main} size={13} /></span> : <span className="cr__plat cr__plat--name">{main}</span>}
        <span className="cr__cap">{c.caption}</span>
        <span className="cr__views"><Icon name="play" size={10} stroke={0} className="pc__fill" />{compact(c.avgViews)}</span>
      </div>
      <div className="cr__info">
        <p className="cr__handle">
          <Link href={href(lang, `/@${c.handle}`)} className="rt__link" data-cta="creator_row_view_profile" prefetch={false}>@{c.handle}</Link>
          {c.verified && <Verified />}
        </p>
        <p className="cr__place"><Flag market={c.market} title={m.name} />{c.city} · {categoryBySlug[c.category].label}</p>
        <dl className="cr__stats">
          <div><dt>Followers</dt><dd>{compact(c.followers)}</dd></div>
          <div><dt>Avg views</dt><dd>{compact(c.avgViews)}</dd></div>
          <div><dt>Eng.</dt><dd>{c.er}%</dd></div>
        </dl>
        <PlatformList c={c} size={13} />
      </div>
      <div className="cr__side">
        <SaveButton handle={c.handle} />
        <p className="cr__from"><small>from</small><b>{localMoney(c.rateLocal, c.currency)}</b>{c.currency !== 'USD' ? <small>≈ <Money usd={c.rateUsd} /></small> : null}</p>
      </div>
    </article>
  )
}
