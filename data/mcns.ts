// SAMPLE DATA — made-up MCNs. /mcn/[slug] shows what the homepage builder produces.
import { CREATORS } from './creators'

export type Mcn = { slug: string; name: string; initials: string; city: string; market: string; tagline: string; about: string; services: string[]; template: string; stats: { value: string; label: string }[] }

export const MCNS: Mcn[] = [
  {
    slug: 'lotus-talent', name: 'Lotus Talent', initials: 'LT', city: 'Ho Chi Minh City', market: 'vn', template: 'Roster first',
    tagline: 'Beauty and lifestyle creators across Vietnam.',
    about: 'Lotus Talent is a sample MCN used to show the homepage builder. It manages beauty, F & B and lifestyle creators in Ho Chi Minh City, Hanoi and Da Nang.',
    services: ['Creator casting', 'TikTok Shop LIVE selling', 'Brand ambassador programmes', 'Content licensing'],
    stats: [{ value: '38', label: 'signed creators' }, { value: '3', label: 'cities' }, { value: 'VN', label: 'home market' }],
  },
  {
    slug: 'seoul-wave-media', name: 'Seoul Wave Media', initials: 'SW', city: 'Seoul', market: 'kr', template: 'Editorial',
    tagline: 'K-beauty and fashion creators for global brands.',
    about: 'Seoul Wave Media is a sample MCN. It represents beauty and fashion creators in Seoul and Busan.',
    services: ['Creator casting', 'Global brand deals', 'Shoot production'],
    stats: [{ value: '24', label: 'signed creators' }, { value: 'KR', label: 'home market' }],
  },
]
export const mcnBySlug = Object.fromEntries(MCNS.map((m) => [m.slug, m]))
export const rosterOf = (name: string) => CREATORS.filter((c) => c.mcn === name)
