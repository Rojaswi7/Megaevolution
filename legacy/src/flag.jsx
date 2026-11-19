// Country flags (country-flag-icons, MIT). Regions without one flag get a globe badge.
import { ID, VN, TH, PH, MY, SG, TW, CN, KR, JP, IN, EU, US } from 'country-flag-icons/react/3x2'

const FLAGS = { id: ID, vn: VN, th: TH, ph: PH, my: MY, sg: SG, tw: TW, cn: CN, kr: KR, jp: JP, in: IN, eu: EU, us: US }

export function Flag({ market, title }) {
  const F = FLAGS[market]
  if (F) return <F className="flag" title={title} aria-hidden={title ? undefined : true} />
  return (
    <span className="flag flag--region" title={title} aria-hidden={title ? undefined : true}>
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3.5 12h17M12 3.5c2.6 2.6 2.6 14.4 0 17M12 3.5c-2.6 2.6-2.6 14.4 0 17" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
    </span>
  )
}
