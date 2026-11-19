// SAMPLE DATA — dummy accounts for the mockup. Nothing is checked against a server:
// picking one on /login (or typing its email with any password) signs you in
// as that role in this browser only, so every flow can be walked end to end.
export type Role = 'guest' | 'brand' | 'agency' | 'creator' | 'mcn' | 'editor'

export type Account = {
  role: Exclude<Role, 'guest'>; email: string; password: string
  name: string; org: string; title: string; initial: string; tone: number
  home: string // where this role lands after login
  can: string[] // what this account is allowed to open — drives permission-aware tabs
  blurb: string
}

export const ACCOUNTS: Account[] = [
  {
    role: 'brand', email: 'brand@demo.megaevolution.io', password: 'demo1234',
    name: 'Hana Park', org: 'Lumi Skin (sample brand)', title: 'Brand admin', initial: 'H', tone: 2,
    home: '/preview/brand', can: ['orders', 'lists', 'inbox-readonly', 'billing', 'team', 'agency-orders'],
    blurb: 'Search creators, order packages and videos, track orders, manage the team and billing.',
  },
  {
    role: 'agency', email: 'agency@demo.megaevolution.io', password: 'demo1234',
    name: 'Daniel Cho', org: 'Northside Agency (sample)', title: 'Agency lead', initial: 'D', tone: 0,
    home: '/preview/agency', can: ['agency-orders', 'inbox', 'lists', 'reports', 'billing', 'team'],
    blurb: 'Run client campaigns: Agency Orders, listings, Campaign Inbox, reports and per-brand invoices.',
  },
  {
    role: 'creator', email: 'creator@demo.megaevolution.io', password: 'demo1234',
    name: 'Minh', org: '@minh.beauty', title: 'Creator', initial: 'M', tone: 1,
    home: '/preview/creator', can: ['profile', 'rates', 'orders', 'scripts', 'earnings'],
    blurb: 'Profile and My Rates, AI pricing, incoming orders, Script Studio, earnings and PDFs.',
  },
  {
    role: 'mcn', email: 'mcn@demo.megaevolution.io', password: 'demo1234',
    name: 'Trang Lê', org: 'Lotus Talent (sample MCN)', title: 'Talent manager', initial: 'T', tone: 5,
    home: '/preview/mcn', can: ['talent', 'contracts', 'homepage-builder', 'inbox', 'agency-orders', 'billing'],
    blurb: 'Talent dashboard, creator applications, contracts and counter-offers, homepage builder.',
  },
  {
    role: 'editor', email: 'editor@demo.megaevolution.io', password: 'demo1234',
    name: 'Jae Kim', org: 'Video Editing Studio', title: 'Editor', initial: 'J', tone: 4,
    home: '/preview/editor', can: ['editor-queue'],
    blurb: 'Pick up Studio orders, upload drafts and handle revision requests.',
  },
]

export const accountByRole = Object.fromEntries(ACCOUNTS.map((a) => [a.role, a])) as Record<string, Account>
export const accountByEmail = Object.fromEntries(ACCOUNTS.map((a) => [a.email, a])) as Record<string, Account>

/** Roles that may open Agency Orders (the header tab is hidden for everyone else). */
export const canSeeAgencyOrders = (role: Role) => role !== 'guest' && accountByRole[role]?.can.includes('agency-orders')
