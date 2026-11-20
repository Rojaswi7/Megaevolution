// Client quotes for the scrolling testimonials band. Real, public quotes only —
// add a new one here once the client has approved it.
export type Testimonial = { quote: string; brand: string; role: string; initial: string; category: string; result: string; caseSlug?: string }

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'I thought it would be impossible to find any more suitable influencers, but I was amazed that MegaEvolution, using data, was able to identify the most optimal influencers we had never reached before.',
    brand: 'F&B brand N', role: 'Marketing Director', initial: 'N', category: 'F&B', result: 'Creators found with data',
  },
  {
    quote: 'By running global KOL campaigns together with MegaEvolution, we achieved remarkable results within just one month: a 7x increase in traffic, a 10x surge in sales volume, and a 50% increase in revenue.',
    brand: 'Beauty company P', role: 'Global Marketing Manager', initial: 'P', category: 'Beauty', result: '7× traffic · 10× sales volume · +50% revenue', caseSlug: 'beauty-company-p',
  },
  {
    quote: 'By collaborating with MegaEvolution, a global company, we were able to successfully run campaigns in 3 countries simultaneously, which significantly reduced our workload.',
    brand: 'Beauty brand R', role: 'Global Marketing Manager', initial: 'R', category: 'Beauty', result: '3 countries at once', caseSlug: 'beauty-brand-r',
  },
]
