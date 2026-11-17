// Platform-specific mock interfaces for the creator spotlight and reel tiles.
// Engagement numbers are sample values derived from the creator handle.
import { PlatformIcon } from './platformIcon.jsx'

const P = {
  heart: 'M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z',
  comment: 'M4 11.5a7.5 7 0 1 1 3.4 5.9L4 18.5l1-3.3a6.6 6.6 0 0 1-1-3.7Z',
  send: 'M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z',
  bookmark: 'M6.5 3.5h11v17l-5.5-4-5.5 4v-17Z',
  share: 'M13 5l7 6.5-7 6.5v-4c-5 0-8 1.5-10 5 .5-5.5 3.5-10 10-10V5Z',
  music: 'M9 18a2.5 2.5 0 1 1-2.5-2.5H9V5l10-2v12.5a2.5 2.5 0 1 1-2.5-2.5H19',
  dots: 'M5 12h.01M12 12h.01M19 12h.01',
  reels: 'M3.5 7.5h17M8 3.5l3 4M14 3.5l3 4M4 3.5h16a.5.5 0 0 1 .5.5v16a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5ZM10 11v6l5-3-5-3Z',
}
function Ico({ d, fill = false, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={fill ? 0 : 1.7} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// deterministic sample numbers per creator
function seed(handle) {
  let h = 0
  for (const ch of handle) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}
const short = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}K` : `${n}`)
function stats(c) {
  const s = seed(c.handle)
  return {
    likes: short(20000 + (s % 380000)),
    comments: short(300 + (s % 9000)),
    saves: short(500 + (s % 30000)),
    shares: short(200 + (s % 12000)),
    views: short(80000 + (s % 2400000)),
    mins: `${8 + (s % 14)}:${String(s % 60).padStart(2, '0')}`,
    days: 1 + (s % 6),
  }
}

/* ---------------- spotlight frames ---------------- */

function YouTubeFrame({ c, m, tone }) {
  const st = stats(c)
  return (
    <div className="pf pf--yt">
      <div className={`pf__thumb tone-${tone}`}>
        {c.img && <img src={c.img} alt="" />}
        <span className="pf__dur">{st.mins}</span>
        <span className="pf__ytbar"><i /></span>
      </div>
      <div className="pf__ytmeta">
        <span className="pf__av">{c.name[0]}</span>
        <div className="pf__yttext">
          <p className="pf__yttitle">{c.caption}</p>
          <p className="pf__ytsub">{c.name} · {st.views} views · {st.days} day{st.days === 1 ? '' : 's'} ago</p>
        </div>
      </div>
      <div className="pf__ytchan">
        <span><b>{c.name}</b><small>{c.followers} subscribers</small></span>
        <span className="pf__subscribe">Subscribe</span>
      </div>
      <div className="pf__upnext">
        <small>Up next</small>
        {['sand', 'stone'].map((t, k) => (
          <div key={k} className="pf__nextrow">
            <span className={`pf__nextthumb tone-${k ? tone : t}`} />
            <span className="pf__nextlines"><i /><i /></span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TikTokFrame({ c, tone }) {
  const st = stats(c)
  return (
    <div className={`pf pf--tt tone-${tone}`}>
      {c.img && <img src={c.img} alt="" />}
      <div className="pf__tttabs"><span>Following</span><b>For You</b></div>
      <div className="pf__ttrail">
        <span className="pf__ttav">{c.name[0]}<i>+</i></span>
        <span><Ico d={P.heart} fill /><small>{st.likes}</small></span>
        <span><Ico d={P.comment} fill /><small>{st.comments}</small></span>
        <span><Ico d={P.bookmark} fill /><small>{st.saves}</small></span>
        <span><Ico d={P.share} fill /><small>{st.shares}</small></span>
      </div>
      <div className="pf__ttcap">
        <b>@{c.handle}</b>
        <p>{c.caption}</p>
        <span className="pf__ttsound"><Ico d={P.music} size={13} /><span><em>original sound · {c.handle}</em></span></span>
      </div>
    </div>
  )
}

function InstagramFrame({ c, m, tone }) {
  const st = stats(c)
  return (
    <div className="pf pf--ig">
      <div className="pf__ighead">
        <span className="pf__igring"><span>{c.name[0]}</span></span>
        <span><b>{c.handle}</b><small>{m.city}</small></span>
        <Ico d={P.dots} />
      </div>
      <div className={`pf__igmedia tone-${tone}`}>{c.img && <img src={c.img} alt="" />}</div>
      <div className="pf__igactions">
        <Ico d={P.heart} /><Ico d={P.comment} /><Ico d={P.send} />
        <span className="pf__igsave"><Ico d={P.bookmark} /></span>
      </div>
      <p className="pf__iglikes">{st.likes} likes</p>
      <p className="pf__igcap"><b>{c.handle}</b> {c.caption}</p>
    </div>
  )
}

export function SpotFrame({ c, m, tone }) {
  const Frame = c.platform === 'YouTube' ? YouTubeFrame : c.platform === 'TikTok' ? TikTokFrame : InstagramFrame
  return (
    <div className="spot__media spot__media--frame">
      <Frame c={c} m={m} tone={tone} />
      <span className="spot__plat"><PlatformIcon name={c.platform} />{c.platform}</span>
    </div>
  )
}

/* ---------------- small tile chrome ---------------- */

export function TileChrome({ c }) {
  const st = stats(c)
  if (c.platform === 'TikTok')
    return (
      <span className="tc tc--tt" aria-hidden="true">
        <span><Ico d={P.heart} fill size={16} /><small>{st.likes}</small></span>
        <span><Ico d={P.comment} fill size={16} /><small>{st.comments}</small></span>
        <span><Ico d={P.share} fill size={16} /></span>
      </span>
    )
  if (c.platform === 'YouTube')
    return (
      <span className="tc tc--yt" aria-hidden="true">
        <span className="tc__dur">{st.mins}</span>
        <span className="tc__ytbar"><i /></span>
      </span>
    )
  return (
    <span className="tc tc--ig" aria-hidden="true">
      <span className="tc__reels"><Ico d={P.reels} size={16} /></span>
    </span>
  )
}
