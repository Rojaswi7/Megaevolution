'use client'
// Hero collage: five slots that glide between layouts every few seconds and swap in
// new creators as they move. Each slot is a creator's post (flat tile + their own
// caption until real video is dropped in: set `video`/`poster` on the item).
// Pauses on hover and respects reduced motion. Videos never autoplay with sound.
import { useEffect, useRef, useState } from 'react'
import { Icon, PlatformIcon } from './Icon'

export type CollageItem = { handle: string; name: string; city: string; caption: string; tone: number; platform: string; followers: string; from: string; category: string; video?: string; poster?: string }

// positions in % of the stage: [x, y, w, h]
const LAYOUTS = [
  [[0, 0, 30, 54], [0, 54, 30, 46], [30, 0, 43, 100], [73, 0, 27, 46], [73, 46, 27, 54]],
  [[0, 0, 44, 100], [44, 0, 28, 56], [72, 0, 28, 56], [44, 56, 32, 44], [76, 56, 24, 44]],
  [[0, 0, 26, 100], [26, 0, 42, 52], [26, 52, 20, 48], [46, 52, 22, 48], [68, 0, 32, 100]],
  [[0, 0, 38, 46], [0, 46, 38, 54], [38, 0, 34, 66], [38, 66, 34, 34], [72, 0, 28, 100]],
]

export default function Collage({ items }: { items: CollageItem[] }) {
  const [layout, setLayout] = useState(0)
  const [slots, setSlots] = useState([0, 1, 2, 3, 4])
  const [paused, setPaused] = useState(false)
  const next = useRef(5)
  const featured = items[slots[2]] || items[0]

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => {
      setLayout((l) => (l + 1) % LAYOUTS.length)
      // swap two slots per beat so the collage evolves rather than resets
      setSlots((s) => {
        const copy = [...s]
        for (let k = 0; k < 2; k++) {
          const at = (next.current + k * 2) % copy.length
          let idx = next.current % items.length
          while (copy.includes(idx)) idx = (idx + 1) % items.length
          copy[at] = idx
          next.current = idx + 1
        }
        return copy
      })
    }, 3400)
    return () => clearInterval(t)
  }, [paused, items.length])

  return (
    <div className="col" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-label="Recent creator content" role="img">
      <div className="col__stage">
        {LAYOUTS[layout].map(([x, y, w, h], k) => {
          const it = items[slots[k]]
          return (
            <div key={k} className="col__slot" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}>
              <div key={it.handle} className={`col__tile tone-${it.tone}`}>
                {it.video ? <video src={it.video} poster={it.poster} muted loop playsInline preload="none" /> : null}
                <span className="col__top"><PlatformIcon name={it.platform} size={15} mono />{k % 2 === 0 ? <i><Icon name="play" size={11} stroke={0} className="pc__fill" /></i> : null}</span>
                <span className="col__cap">{it.caption}</span>
                <span className="col__credit"><b>@{it.handle}</b>{it.city}</span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="col__float" key={featured.handle}>
        <span className={`av tone-${(featured.tone + 5) % 8}`}>{featured.name[0]}</span>
        <span><b>@{featured.handle}</b><small>{featured.category}, {featured.city}</small></span>
        <span className="col__rate"><b>{featured.followers}</b><small>from {featured.from}</small></span>
      </div>
    </div>
  )
}
