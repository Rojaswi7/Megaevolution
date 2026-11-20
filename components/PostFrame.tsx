// A creator's post drawn the way their main platform shows it, so a brand can
// read the tile at a glance:
//   YouTube   → video card: 16:9 thumbnail, duration, progress, title, channel line
//   TikTok    → vertical For You frame: right rail, @handle, caption, sound line
//   Instagram → post: header, square image, action row, likes
// Flat colour + the creator's own caption stand in for real media.
import type { Creator } from '@/data/creators'
import { compact } from '@/lib/format'
import { Icon, PlatformIcon } from './Icon'

function seed(s: string) { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h }
export function postStats(c: Creator) {
  const s = seed(c.handle)
  return {
    likes: compact(Math.round(c.avgViews * (0.05 + (s % 9) / 100))), comments: compact(300 + (s % 9000)), shares: compact(80 + (s % 4000)),
    mins: `${6 + (s % 14)}:${String(s % 60).padStart(2, '0')}`, days: 1 + (s % 6), progress: 22 + (s % 55),
  }
}

const Fill = ({ d }: { d: string }) => <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d={d} fill="currentColor" /></svg>
const HEART = 'M12 20.6s-7.6-4.6-7.6-10.3A4.3 4.3 0 0 1 12 7.7a4.3 4.3 0 0 1 7.6 2.6c0 5.7-7.6 10.3-7.6 10.3Z'
const BUBBLE = 'M4 11.4a7.6 7.1 0 1 1 3.4 6L4 18.6l1-3.4a6.7 6.7 0 0 1-1-3.8Z'
const SHARE = 'M13 5l7.2 6.6L13 18.2v-4.1c-5.1 0-8.1 1.5-10.2 5.1.5-5.6 3.6-10.2 10.2-10.2V5Z'

export function PostFrame({ c, platform, size = 'tile' }: { c: Creator; platform?: string; size?: 'tile' | 'spot' }) {
  const p = platform || c.platforms[0].platform
  const st = postStats(c)
  const first = c.name[0]

  if (p === 'YouTube') {
    return (
      <div className={`pf pf--yt pf--${size}`}>
        <div className={`pf__thumb tone-${c.tone}`}>
          <span className="pf__cap">{c.caption}</span>
          <span className="pf__dur">{st.mins}</span>
          <span className="pf__bar"><i style={{ width: `${st.progress}%` }} /></span>
        </div>
        <div className="pf__ytmeta">
          <span className={`av tone-${(c.tone + 5) % 8}`}>{first}</span>
          <span className="pf__yttext">
            <b>{c.caption}</b>
            <small>{c.name} · {compact(Math.round(c.avgViews * 1.2))} views · {st.days}d ago</small>
          </span>
        </div>
        <span className="pf__brand"><PlatformIcon name="YouTube" size={14} />YouTube</span>
      </div>
    )
  }

  if (p === 'Instagram') {
    return (
      <div className={`pf pf--ig pf--${size}`}>
        <div className="pf__ighead">
          <span className={`av tone-${(c.tone + 5) % 8}`}>{first}</span>
          <b>{c.handle}</b>
          <span className="pf__dots" aria-hidden="true">···</span>
        </div>
        <div className={`pf__square tone-${c.tone}`}>
          <span className="pf__cap">{c.caption}</span>
          <span className="pf__reel"><Icon name="film" size={15} /></span>
        </div>
        <div className="pf__igact" aria-hidden="true">
          <Icon name="heart" size={18} /><Icon name="message" size={17} /><Icon name="arrowUpRight" size={17} />
          <Icon name="bookmark" size={17} className="pf__igsave" />
        </div>
        <p className="pf__iglikes">{st.likes} likes</p>
        <span className="pf__brand"><PlatformIcon name="Instagram" size={14} />Instagram</span>
      </div>
    )
  }

  // TikTok (and any vertical-first platform)
  return (
    <div className={`pf pf--tt pf--${size} tone-${c.tone}`}>
      <span className="pf__tttop" aria-hidden="true"><span>Following</span><b>For You</b></span>
      <span className="pf__rail" aria-hidden="true">
        <span className={`av tone-${(c.tone + 5) % 8}`}>{first}</span>
        <span><Fill d={HEART} />{st.likes}</span>
        <span><Fill d={BUBBLE} />{st.comments}</span>
        <span><Fill d={SHARE} />{st.shares}</span>
      </span>
      <span className="pf__ttcopy">
        <b>@{c.handle}</b>
        <span className="pf__cap">{c.caption}</span>
        <small><Icon name="play" size={10} stroke={0} className="pc__fill" />original sound · {c.name}</small>
      </span>
      <span className="pf__brand"><PlatformIcon name="TikTok" size={14} />TikTok</span>
    </div>
  )
}
