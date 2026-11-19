// Case studies. ONLY the public figures from the brief are used here.
// Flexible format: any field can be empty and the card simply leaves it out.
export type CaseStudy = {
  slug: string; no: string; title: string; client: string
  category: string; origin: string; target: string; markets: string[] // market slugs
  goal: string; achieved: string; feedback: string; feedbackBy: string
  stats: { value: string; label: string }[]
  summary: string; date: string
}

export const CASES: CaseStudy[] = [
  {
    slug: 'jinro-14-countries', no: '01', title: 'JINRO: 670 creators in 14 countries at once', client: 'JINRO',
    category: 'F & B', origin: 'Korea', target: '14 countries', markets: ['vietnam', 'thailand', 'philippines', 'indonesia'],
    goal: 'Launch in many markets at the same moment, with local creators in each one.',
    achieved: '670 creators published 744 posts across 14 countries at once, for 30M+ views. Paid posts in Vietnam and three other markets reached 4.4M views.',
    feedback: '', feedbackBy: '',
    stats: [{ value: '670', label: 'creators' }, { value: '744', label: 'posts' }, { value: '14', label: 'countries at once' }, { value: '30M+', label: 'views' }],
    summary: 'One brief, 14 countries, 670 creators posting in the same window.', date: '2026-06-12',
  },
  {
    slug: 'rejuran-philippines-tiktok-shop', no: '02', title: 'Rejuran: +1,502% GMV in the Philippines', client: 'Rejuran',
    category: 'Beauty', origin: 'Korea', target: 'Philippines', markets: ['philippines'],
    goal: 'Grow TikTok Shop sales in the Philippines with local creators and LIVE selling.',
    achieved: 'GMV grew +1,502%, reaching PHP 51.3M between January and May 2026. One creator’s TikTok LIVEs alone brought in PHP 6.11M.',
    feedback: '', feedbackBy: '',
    stats: [{ value: '+1,502%', label: 'GMV growth' }, { value: '₱51.3M', label: 'GMV, Jan–May 2026' }, { value: '₱6.11M', label: 'from one creator’s LIVEs' }],
    summary: 'TikTok Shop sales in the Philippines, driven by creators and LIVE.', date: '2026-07-03',
  },
  {
    slug: 'beauty-company-p', no: '03', title: 'Beauty company P: 10× sales volume in one month', client: 'Beauty company P',
    category: 'Beauty', origin: 'Korea', target: '', markets: [],
    goal: 'Lift traffic and sales quickly in a new market.',
    achieved: 'Within one month: 7× traffic, 10× sales volume and +50% revenue.',
    feedback: '…within just one month: a 7x increase in traffic, a 10x surge in sales volume, and a 50% increase in revenue.',
    feedbackBy: 'Global Marketing Manager',
    stats: [{ value: '7×', label: 'traffic' }, { value: '10×', label: 'sales volume' }, { value: '+50%', label: 'revenue in one month' }],
    summary: 'Seven times the traffic and ten times the sales volume, inside a month.', date: '2026-04-22',
  },
  {
    slug: 'beauty-brand-r', no: '04', title: 'Beauty brand R: three countries, one team', client: 'Beauty brand R',
    category: 'Beauty', origin: 'Korea', target: '3 countries', markets: [],
    goal: 'Run campaigns in three countries without tripling the team’s workload.',
    achieved: 'Campaigns ran in 3 countries at the same time through one point of contact.',
    feedback: '…we were able to successfully run campaigns in 3 countries simultaneously, which significantly reduced our workload.',
    feedbackBy: 'Global Marketing Manager',
    stats: [{ value: '3', label: 'countries at once' }],
    summary: 'Three countries at once, with one point of contact.', date: '2026-03-10',
  },
]

export const caseBySlug = Object.fromEntries(CASES.map((c) => [c.slug, c]))
// The three shown on the home page: JINRO, Rejuran, Company P.
export const HOME_CASES = CASES.slice(0, 3)
