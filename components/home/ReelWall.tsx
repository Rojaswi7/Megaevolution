// Hero visual: three even columns of creator posts drifting slowly in opposite
// directions. Every tile has the same shape and the same four facts (platform,
// rate, handle, place), so the wall reads as a catalogue, not a collage.
// Pure CSS motion; it stops for reduced-motion and pauses on hover.
import { PlatformIcon } from '../Icon'

export type ReelItem = { handle: string; name: string; place: string; caption: string; tone: number; platform: string; followers: string; from: string; video?: string; poster?: string }

function Tile({ it }: { it: ReelItem }) {
  return (
    <div className={`rw__tile tone-${it.tone}`}>
      {it.video ? <video src={it.video} poster={it.poster} muted loop playsInline preload="none" /> : null}
      <span className="rw__top"><span className="rw__plat"><PlatformIcon name={it.platform} size={13} />{it.followers}</span><span className="rw__rate">{it.from}+</span></span>
      <span className="rw__cap">{it.caption}</span>
      <span className="rw__who"><span className={`av tone-${(it.tone + 5) % 8}`}>{it.name[0]}</span><span><b>@{it.handle}</b><small>{it.place}</small></span></span>
    </div>
  )
}

export default function ReelWall({ items }: { items: ReelItem[] }) {
  const n = Math.ceil(items.length / 3)
  const cols = [items.slice(0, n), items.slice(n, n * 2), items.slice(n * 2)]
  return (
    <div className="rw" aria-hidden="true">
      {cols.map((col, i) => (
        <div className={`rw__col rw__col--${i}`} key={i}>
          {/* the list is rendered twice so the loop has no seam */}
          <div className="rw__track">{[...col, ...col].map((it, k) => <Tile it={it} key={it.handle + k} />)}</div>
        </div>
      ))}
    </div>
  )
}
