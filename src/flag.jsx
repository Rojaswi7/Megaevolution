// Country flags (country-flag-icons, MIT). SVG so they render the same on every OS.
import { ID, VN, TW, KR, JP, US } from 'country-flag-icons/react/3x2'

const FLAGS = { id: ID, vn: VN, tw: TW, kr: KR, jp: JP, us: US }

export function Flag({ market, title }) {
  const F = FLAGS[market]
  return F ? <F className="flag" title={title} aria-hidden={title ? undefined : true} /> : null
}
