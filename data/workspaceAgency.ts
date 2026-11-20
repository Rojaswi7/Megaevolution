// SAMPLE DATA for the agency workspace and the preview index — all made up.
// (The shared orders, threads and invoices live in data/workspace.ts.)

export const AGENCY_TEAM = [
  { name: 'Daniel Cho', email: 'agency@demo.megaevolution.io', role: 'Admin', access: 'Everything', status: 'Active' },
  { name: 'Yuna Seo', email: 'yuna@northside.example', role: 'Campaign manager', access: 'Agency Orders, inbox, lists', status: 'Active' },
  { name: 'Ngọc Trần', email: 'ngoc@northside.example', role: 'Campaign manager', access: 'Vietnam orders, inbox', status: 'Active' },
  { name: 'Marco Ruiz', email: 'marco@northside.example', role: 'Finance', access: 'Billing and invoices', status: 'Invited' },
]
export const AGENCY_REQUESTS = [
  { name: 'Hana Park (Lumi Skin)', email: 'brand@demo.megaevolution.io', wants: 'Read-only Campaign Inbox', note: 'Wants to follow creator replies for the serum launch.' },
]
export const AGENCY_NOTIFICATIONS = [
  { text: 'Lumi Skin approved @minh.beauty for “Serum launch, 3 markets”', when: '25 min ago', to: 'agency-orders' },
  { text: 'Thùy Linh replied about her rate', when: '1 h ago', to: 'messages' },
  { text: 'Report ready: Earbuds review seeding, US', when: 'Yesterday', to: 'reports' },
  { text: 'Hana Park requested read-only inbox access', when: 'Yesterday', to: 'team' },
]

export const REPORTS = [
  { id: 'RP-118', order: 'AO-305', client: 'Nova Audio (sample)', title: 'Earbuds review seeding, US', posts: 2, status: 'Ready', updated: '2026-11-17' },
  { id: 'RP-121', order: 'AO-308', client: 'Kiro Snacks (sample)', title: 'Convenience-store launch, Japan', posts: 1, status: 'Collecting', updated: '2026-11-18' },
  { id: 'RP-124', order: 'AO-311', client: 'Lumi Skin', title: 'Serum launch, 3 markets', posts: 1, status: 'Collecting', updated: '2026-11-19' },
]

// Per-brand invoices on shared orders. Management fee values are not decided → TBD.
export const CLIENT_INVOICES = [
  { id: 'INV-A-204', date: '2026-11-15', client: 'Lumi Skin', order: 'AO-311', what: 'Creator fees, first batch', amountUsd: 1492, tbd: false, status: 'Paid' },
  { id: 'INV-A-205', date: '2026-11-15', client: 'Lumi Skin', order: 'AO-311', what: 'Management fee', amountUsd: 0, tbd: true, status: 'Pending' },
  { id: 'INV-A-198', date: '2026-11-09', client: 'Kiro Snacks (sample)', order: 'AO-308', what: 'Package: 2 creators', amountUsd: 930, tbd: false, status: 'Paid' },
  { id: 'INV-A-190', date: '2026-10-30', client: 'Nova Audio (sample)', order: 'AO-305', what: 'Creator fees', amountUsd: 2600, tbd: false, status: 'Paid' },
  { id: 'INV-A-191', date: '2026-10-30', client: 'Nova Audio (sample)', order: 'AO-305', what: 'Management fee', amountUsd: 0, tbd: true, status: 'Paid' },
]

// Deep links shown on /preview. Creator, MCN and editor tabs are owned by their own workspaces.
export const PREVIEW_LINKS: Record<string, { label: string; tab?: string }[]> = {
  brand: [
    { label: 'Workspace home', tab: 'home' }, { label: 'My orders: brief, drafts, revisions', tab: 'orders' }, { label: 'Saved lists', tab: 'lists' },
    { label: 'Campaign Inbox (read-only board)', tab: 'messages' }, { label: 'Agency Orders: approve listings', tab: 'agency-orders' },
    { label: 'Team, roles and access requests', tab: 'team' }, { label: 'Billing portal', tab: 'billing' }, { label: 'Alerts', tab: 'alerts' },
  ],
  agency: [
    { label: 'Workspace home', tab: 'home' }, { label: 'Agency Orders: compact and full views', tab: 'agency-orders' }, { label: 'AI Listup → listings', tab: 'listup' },
    { label: 'Campaign Inbox: Gmail, board, AI replies', tab: 'messages' }, { label: 'Reports', tab: 'reports' }, { label: 'Clients and per-brand invoices', tab: 'clients' },
    { label: 'Team', tab: 'team' }, { label: 'Billing', tab: 'billing' },
  ],
  creator: [{ label: 'Creator dashboard, My Rates, AI pricing, Script Studio' }],
  mcn: [{ label: 'Talent manager dashboard, contracts, homepage builder' }],
  editor: [{ label: 'Editor queue, draft upload, revisions' }],
}
