// Creator categories. "F & B" is written with spaces on purpose (never "Food").
export type Category = { slug: string; label: string; noun: string; icon: string; blurb: string }

export const CATEGORIES: Category[] = [
  { slug: 'beauty', label: 'Beauty', noun: 'beauty', icon: 'beauty', blurb: 'skincare routines, make-up tutorials and honest product reviews' },
  { slug: 'food', label: 'F & B', noun: 'F & B', icon: 'food', blurb: 'street food runs, café visits, recipes and taste tests' },
  { slug: 'fashion', label: 'Fashion', noun: 'fashion', icon: 'fashion', blurb: 'outfit ideas, hauls and styling videos' },
  { slug: 'gaming', label: 'Gaming', noun: 'gaming', icon: 'gaming', blurb: 'gameplay, live streams and game reviews' },
  { slug: 'tech', label: 'Tech', noun: 'tech', icon: 'tech', blurb: 'unboxings, device reviews and app walkthroughs' },
  { slug: 'lifestyle', label: 'Lifestyle', noun: 'lifestyle', icon: 'lifestyle', blurb: 'daily vlogs, travel, home and family content' },
]

export const categoryBySlug = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]))
