// ------------------------------------------------------------------
// THE ONE PLACE FOR EVERY PRICE, PLAN AND LIMIT.
// Components never hard-code a number. Change a value here and every page follows.
// `TBD` means the team has not decided yet — it renders as "$TBD" on the site.
// All amounts are USD; the currency switch converts them for display.
// ------------------------------------------------------------------

export const TBD = 'TBD' as const
export type Amount = number | typeof TBD

// --- currency -------------------------------------------------------
// Display currencies offered in the switch. KRW / JPY / USD first, more later.
export const CURRENCIES = {
  USD: { symbol: '$', rate: 1, label: 'US dollar' },
  KRW: { symbol: '₩', rate: 1380, label: 'Korean won' },
  JPY: { symbol: '¥', rate: 152, label: 'Japanese yen' },
} as const
export type Currency = keyof typeof CURRENCIES
export const DEFAULT_CURRENCY: Currency = 'USD'

// Creator-side currencies (one per rate card), with rough USD rates for conversion.
export const CREATOR_FX: Record<string, number> = {
  USD: 1, KRW: 1380, JPY: 152, CNY: 7.2, VND: 25400, THB: 35, IDR: 16200, PHP: 57, MXN: 18.5, BRL: 5.6, EUR: 0.92,
}

// --- tools ----------------------------------------------------------
export const YEARLY_DISCOUNT = TBD as Amount // percent saved on yearly billing, e.g. 20

export const TOOL_PLANS = [
  {
    id: 'free', name: 'Free', monthly: 0 as Amount, yearly: 0 as Amount,
    blurb: 'Search creators and try each tool.',
    features: ['Creator search and saved lists', 'Limited runs of each tool (count TBD)', 'Audience breakdowns: verified-brand limit'],
  },
  {
    id: 'basic', name: 'Basic', monthly: TBD as Amount, yearly: TBD as Amount, // $10 vs $19 not decided
    blurb: 'For one brand running a few campaigns.',
    features: ['Everything in Free', 'One tool of your choice', 'PDF exports', 'More audience breakdowns (count TBD)'],
  },
  {
    id: 'pro', name: 'Pro', monthly: TBD as Amount, yearly: TBD as Amount, recommended: true,
    blurb: 'For teams running campaigns every month.',
    features: ['Everything in Basic', 'All tools', 'Team seats and roles', 'Client-ready reports', 'Audience breakdowns (count TBD)'],
  },
  {
    id: 'enterprise', name: 'Enterprise', monthly: null, yearly: null, contact: true,
    blurb: 'Agencies and multi-brand groups.',
    features: ['Everything in Pro', 'Organisations and per-brand invoices', 'Custom limits', 'A named account manager'],
  },
]

// Pay-per-use: one run of a tool without a plan.
export const PAY_PER_USE = {
  'ai-listup': { unit: 'per list', price: TBD as Amount },
  'performance-report': { unit: 'per report', price: TBD as Amount },
  'ai-video-edit': { unit: 'per sample video', price: TBD as Amount },
  'commerce-data': { unit: 'per creator lookup', price: TBD as Amount },
  'script-studio': { unit: 'per script', price: TBD as Amount },
}

// "from $X/mo" shown on each tool card.
export const TOOL_FROM: Record<string, Amount> = {
  'ai-listup': TBD, 'performance-report': TBD, 'ai-video-edit': TBD, 'commerce-data': TBD, 'script-studio': TBD,
}

// --- Video Editing Studio ------------------------------------------
export const STUDIO = {
  products: [
    { id: 'short', name: 'Short video', spec: 'Up to 60 seconds · 9:16', price: TBD as Amount, delivery: 'Delivery time TBD' },
    { id: 'long', name: 'Long video', spec: 'Up to 10 minutes · 16:9', price: TBD as Amount, delivery: 'Delivery time TBD' },
  ],
  // bundle discount: buy `min` or more videos in one order, save `percent`
  bundles: [
    { min: 3, percent: TBD as Amount },
    { min: 10, percent: TBD as Amount },
  ],
  freeRevisions: TBD as Amount, // revisions included in every order
  paidRevision: TBD as Amount, // price of each revision after the free ones
  refundNote: 'Refund terms TBD — shown here before every payment.',
  // editing add-on cross-sold on creator profiles
  addOnFrom: TBD as Amount,
}

export const STUDIO_SUBSCRIPTIONS = [
  { id: 'plus', name: 'Plus', monthly: TBD as Amount, videos: TBD as Amount, saving: TBD as Amount, blurb: 'A few videos every month.' },
  { id: 'max', name: 'Max', monthly: TBD as Amount, videos: TBD as Amount, saving: TBD as Amount, blurb: 'A steady flow for always-on channels.', recommended: true },
]

// --- audience analytics access --------------------------------------
// How many creator audience breakdowns a visitor can open per day.
export const ANALYTICS_LIMITS = {
  loggedOut: 2,
  verifiedBrand: 10,
  basic: TBD as Amount,
  pro: TBD as Amount,
}

// --- creator search soft gate (logged out) ---------------------------
export const SEARCH_GATE = { results: 20, filterChanges: 3 }

/** "TBD" stays "TBD"; numbers get formatted in the chosen currency. */
export function formatAmount(v: Amount | null | undefined, cur: Currency = 'USD') {
  const c = CURRENCIES[cur]
  if (v === TBD || v == null) return `${c.symbol}TBD`
  const n = v * c.rate
  const rounded = cur === 'USD' ? Math.round(n * 100) / 100 : Math.round(n / (cur === 'KRW' ? 100 : 10)) * (cur === 'KRW' ? 100 : 10)
  return `${c.symbol}${rounded.toLocaleString('en-US', { maximumFractionDigits: cur === 'USD' ? 2 : 0 })}`
}
export const isTBD = (v: unknown) => v === TBD
