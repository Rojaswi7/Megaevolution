// Country flags (country-flag-icons, MIT). SVG so they render the same on every OS.
import { ID, VN, SG, TW, CN, KR, JP, IN, EG, EU, US } from 'country-flag-icons/react/3x2'

const FLAGS = { id: ID, vn: VN, sg: SG, tw: TW, cn: CN, kr: KR, jp: JP, in: IN, eg: EG, eu: EU, us: US }

export function Flag({ market, title }) {
  const F = FLAGS[market]
  return F ? <F className="flag" title={title} aria-hidden={title ? undefined : true} /> : null
}
