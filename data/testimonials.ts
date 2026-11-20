// Testimonials for the scrolling row after Proof.
// The first two are the public client quotes from the brief. The rest are SAMPLE
// placeholders, marked as such on the page, to be replaced with real, approved quotes.
export type Testimonial = { quote: string; who: string; org: string; result?: string; sample?: boolean; tone: number; caseSlug?: string }

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Within just one month: a 7x increase in traffic, a 10x surge in sales volume, and a 50% increase in revenue.',
    who: 'Global Marketing Manager', org: 'Beauty company P', result: '10× sales volume', tone: 1, caseSlug: 'beauty-company-p',
  },
  {
    quote: 'We were able to successfully run campaigns in 3 countries simultaneously, which significantly reduced our workload.',
    who: 'Global Marketing Manager', org: 'Beauty brand R', result: '3 countries at once', tone: 0, caseSlug: 'beauty-brand-r',
  },
  { quote: 'We saw every creator’s rate before we wrote to anyone. That alone saved us a week of back-and-forth.', who: 'Brand manager', org: 'Sample quote', sample: true, tone: 2 },
  { quote: 'One contact in Seoul, and someone on the ground in Manila and Ho Chi Minh City. The posts went live on the same day.', who: 'Head of growth', org: 'Sample quote', sample: true, tone: 3 },
  { quote: 'The edited cut-downs from the Studio ran as ads with no changes. Two rounds of revisions, delivered on time.', who: 'Performance lead', org: 'Sample quote', sample: true, tone: 4 },
  { quote: 'Our MCN page took an afternoon to build, and brand requests now land in one inbox instead of five.', who: 'MCN founder', org: 'Sample quote', sample: true, tone: 7 },
]
