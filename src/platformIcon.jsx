// Official platform marks from Simple Icons (CC0) — https://simpleicons.org
import { siTiktok, siYoutube, siInstagram, siFacebook, siLine, siNaver, siX } from 'simple-icons'

const ICONS = {
  TikTok: siTiktok,
  YouTube: siYoutube,
  Instagram: siInstagram,
  Facebook: siFacebook,
  LINE: siLine,
  Naver: siNaver,
  X: siX,
}

/** Platform logo in its brand colour (or `mono` to inherit text colour). */
export function PlatformIcon({ name, size = 14, mono = false }) {
  const icon = ICONS[name]
  if (!icon) return null
  return (
    <svg className="pi" width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={name}>
      <path d={icon.path} fill={mono ? 'currentColor' : `#${icon.hex}`} />
    </svg>
  )
}
