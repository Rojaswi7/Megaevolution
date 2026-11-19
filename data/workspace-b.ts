// SAMPLE DATA for the creator, MCN and editor workspaces. Every number, name, note and
// amount in this file is made up for the mockup. Replace with the real APIs (see HANDOFF.md).

// ---------- creator (@minh.beauty) ----------
export const RATE_CURRENCY = 'VND' // one currency per rate card

export type RateRow = { id: string; name: string; platform: string; detail: string; price: number; aiFilled: boolean }
export const RATE_CARD: RateRow[] = [
  { id: 'tt-video', name: '1 TikTok video', platform: 'TikTok', detail: '30–60 seconds, 1 revision', price: 12_000_000, aiFilled: true },
  { id: 'tt-set', name: '1 TikTok video + 1 story', platform: 'TikTok', detail: 'Video plus a 24-hour story with link', price: 15_500_000, aiFilled: true },
  { id: 'ig-reel', name: '1 Instagram Reel', platform: 'Instagram', detail: 'Up to 60 seconds, cross-posted to feed', price: 9_000_000, aiFilled: true },
  { id: 'yt-short', name: '1 YouTube Short', platform: 'YouTube', detail: 'Up to 60 seconds', price: 8_000_000, aiFilled: true },
  { id: 'tt-live', name: 'TikTok LIVE, 60 minutes', platform: 'TikTok', detail: 'Product demo with pinned link', price: 18_000_000, aiFilled: false },
  { id: 'usage', name: 'Usage rights, 30 days', platform: '', detail: 'Brand may run the video as a paid ad', price: 4_000_000, aiFilled: false },
]
export const AI_SUGGESTIONS = [
  { id: 'tt-video', to: 13_200_000, why: 'Your average TikTok views are up 18% over the last 30 days.' },
  { id: 'ig-reel', to: 8_400_000, why: 'Reel views are below creators with a similar rate. A lower price should win more orders.' },
  { id: 'tt-live', to: 20_000_000, why: 'Your last two LIVEs sold out. Similar sellers in Vietnam charge more.' },
]

export const CREATOR_KPIS = [
  { value: '₫58.5M', label: 'Earned this month', note: '4 orders paid' },
  { value: '₫27.5M', label: 'Waiting for approval', note: '2 orders in review' },
  { value: '3', label: 'Orders need you', note: '1 new request' },
  { value: '4.9', label: 'Brand rating', note: 'from 31 reviews' },
]
export const PROFILE_CHECKLIST = [
  { label: 'Full name and bio', done: true },
  { label: 'TikTok, YouTube and Instagram connected', done: true },
  { label: 'Rate card published', done: true },
  { label: 'Audience analytics shared', done: true },
  { label: 'Three sample videos pinned', done: false },
  { label: 'Payout details added', done: false },
]

export type CStatus = 'New request' | 'Script needed' | 'Script review' | 'Draft needed' | 'Draft review' | 'Revision requested' | 'Posted' | 'Completed' | 'Declined'
export type COrder = { id: string; brand: string; pkg: string; platform: string; amount: number; status: CStatus; due: string; campaign: string; note?: string }
// Extra orders for @minh.beauty on top of the shared ones in data/workspace.ts
export const CREATOR_EXTRA_ORDERS: COrder[] = [
  { id: 'ORD-5131', brand: 'Dewy Lab (sample)', pkg: '1 TikTok video', platform: 'TikTok', amount: 12_000_000, status: 'New request', due: '2026-12-04', campaign: 'Cleansing balm launch', note: 'We loved your morning routine video. Could you post in the first week of December?' },
  { id: 'ORD-5127', brand: 'Petal & Co (sample)', pkg: '1 TikTok video + 1 story', platform: 'TikTok', amount: 15_500_000, status: 'Script needed', due: '2026-11-29', campaign: 'Tết gift set', note: 'Please send a script before filming. Must mention the gift box and free shipping.' },
  { id: 'ORD-5116', brand: 'Sora Sun (sample)', pkg: '1 Instagram Reel', platform: 'Instagram', amount: 9_000_000, status: 'Revision requested', due: '2026-11-21', campaign: 'Sunscreen refill', note: 'Great energy. Please show the refill step earlier, and add the disclosure tag in the first line of the caption.' },
  { id: 'ORD-5098', brand: 'Lumi Skin', pkg: '1 TikTok video', platform: 'TikTok', amount: 11_000_000, status: 'Completed', due: '2026-10-30', campaign: 'Toner restock' },
]

export const RANKING = {
  position: 14, outOf: 212, scope: 'beauty creators in Vietnam', change: 3,
  factors: [
    { name: 'Engagement on recent posts', score: 86, note: '5.2% on TikTok, above the category median.' },
    { name: 'On-time delivery', score: 94, note: '17 of the last 18 orders were delivered on or before the due date.' },
    { name: 'Reply speed', score: 61, note: 'You reply to new requests in about 19 hours. The top 10 reply within 4.' },
    { name: 'Rate against similar creators', score: 72, note: 'Your TikTok rate sits slightly above creators with similar views.' },
    { name: 'Profile completeness', score: 67, note: 'Sample videos and payout details are missing.' },
  ],
  improve: ['Reply to new requests within a few hours.', 'Pin three sample videos to your profile.', 'Turn on “Let AI adjust my rates” so prices follow your views.'],
}

export const SCRIPTS = [
  { title: 'Tết gift set — unboxing with mum', order: 'ORD-5127', check: 'Guideline check: 1 item to fix', updated: 'Today' },
  { title: 'Serum launch — 7-day test', order: 'ORD-5120', check: 'Passed guideline check', updated: '3 days ago' },
  { title: 'Sunscreen refill — bag check', order: 'ORD-5116', check: 'Passed guideline check', updated: 'Last week' },
]

export const PAYOUTS = [
  { id: 'PO-771', date: '2026-11-15', what: 'ORD-5098 · Lumi Skin', amount: 11_000_000, status: 'Paid' },
  { id: 'PO-764', date: '2026-11-08', what: 'ORD-5091 · Dewy Lab (sample)', amount: 15_500_000, status: 'Paid' },
  { id: 'PO-759', date: '2026-11-02', what: 'ORD-5084 · Petal & Co (sample)', amount: 20_000_000, status: 'Paid' },
  { id: 'PO-748', date: '2026-10-24', what: 'ORD-5077 · Sora Sun (sample)', amount: 12_000_000, status: 'Paid' },
  { id: 'PO-780', date: '2026-11-22', what: 'ORD-5120 · Lumi Skin', amount: 12_000_000, status: 'Pending' },
]

// ---------- shared inbox shape ----------
export type Msg = { me: boolean; text: string; when: string }
export type Chat = { id: string; who: string; sub: string; unread: boolean; messages: Msg[] }

export const CREATOR_CHATS: Chat[] = [
  { id: 'c1', who: 'Lumi Skin', sub: 'ORD-5120 · Serum launch', unread: true, messages: [
    { me: true, text: 'Draft v2 is uploaded. I shortened the intro like you asked.', when: 'Tue 16:20' },
    { me: false, text: 'Thanks Minh — v2 reads much better. Please show the texture shot before the price.', when: '10:42' },
  ] },
  { id: 'c2', who: 'Dewy Lab (sample)', sub: 'ORD-5131 · New request', unread: true, messages: [
    { me: false, text: 'Hi Minh, we would love one TikTok video for our cleansing balm in early December. Is your rate card price still right?', when: '09:15' },
  ] },
  { id: 'c3', who: 'Trang Lê · Lotus Talent', sub: 'Your MCN application', unread: false, messages: [
    { me: false, text: 'Thanks for applying. We are reviewing your profile this week and will send a contract if it is a fit.', when: 'Mon' },
  ] },
]

export const CREATOR_ALERTS = [
  { text: 'Dewy Lab (sample) sent a new order request', when: '2 h ago', tab: 'orders' },
  { text: 'Sora Sun (sample) asked for a revision on ORD-5116', when: 'Yesterday', tab: 'orders' },
  { text: 'AI has 3 suggested changes for your rate card', when: 'Yesterday', tab: 'rates' },
  { text: 'Payout PO-771 of ₫11M was sent to your bank', when: '15 Nov', tab: 'earnings' },
]
export const CREATOR_SAVED = [
  { title: 'Brief: Tết gift set', sub: 'Petal & Co (sample) · PDF' },
  { title: 'Hook bank: beauty openers', sub: 'Script Studio · 24 hooks' },
  { title: 'Lumi Skin brand guide', sub: 'Shared in ORD-5120' },
]

// ---------- MCN (Lotus Talent) ----------
export const MCN_KPIS = [
  { value: '38', label: 'Signed creators', note: '8 shown in this mockup' },
  { value: '11', label: 'Open deals', note: '4 waiting on a brand' },
  { value: '₫412M', label: 'Booked this month', note: 'creator fees, before share' },
  { value: '2', label: 'Applications to review', note: '1 counter-offer waiting' },
]
export const ROSTER_STATUS = ['Active', 'Active', 'Active', 'On a deal', 'Active', 'On a deal', 'Paused', 'Active']
export const MCN_DEALS = [
  { creator: 'linh.glow', brand: 'Lumi Skin', what: '1 TikTok video + 1 story', fee: 7_800_000, status: 'Script review' },
  { creator: 'thao.skincare', brand: 'Lumi Skin', what: '1 TikTok video', fee: 4_800_000, status: 'Awaiting creator' },
  { creator: 'huong.makeup', brand: 'Petal & Co (sample)', what: 'TikTok LIVE, 60 min', fee: 9_500_000, status: 'Scheduled' },
  { creator: 'ngocskin', brand: 'Dewy Lab (sample)', what: '1 Instagram Reel', fee: 5_200_000, status: 'Draft review' },
]

export type Application = { handle: string; name: string; note: string; when: string; status: 'Pending' | 'Approved' | 'Declined' }
export const APPLICATIONS: Application[] = [
  { handle: 'minh.beauty', name: 'Minh', note: 'Joined through your invite link (“Join Lotus Talent as my MCN” was ticked at sign-up).', when: '2 days ago', status: 'Pending' },
  { handle: 'khoa.beauty', name: 'Khoa', note: 'Applied from the creator profile page.', when: '5 days ago', status: 'Pending' },
]

export type OfferStep = { by: 'MCN' | 'Creator'; share: number; note: string; when: string }
export type Contract = { id: string; handle: string; share: number; term: string; status: 'Signed' | 'Counter-offer' | 'Pending' | 'Declined' | 'Counter sent'; history: OfferStep[] }
export const CONTRACTS: Contract[] = [
  { id: 'CT-118', handle: 'thao.skincare', share: 25, term: '12 months, exclusive in Vietnam', status: 'Counter-offer', history: [
    { by: 'MCN', share: 25, note: 'Standard contract: 25% MCN share, 12 months, exclusive in Vietnam.', when: '12 Nov' },
    { by: 'Creator', share: 18, note: 'I already bring my own brand deals. I can sign at 18%, or 20% if deals I source myself are excluded.', when: '15 Nov' },
  ] },
  { id: 'CT-112', handle: 'linh.glow', share: 20, term: '12 months, exclusive in Vietnam', status: 'Signed', history: [
    { by: 'MCN', share: 20, note: 'Standard contract: 20% MCN share.', when: '3 Sep' },
    { by: 'Creator', share: 20, note: 'Accepted and signed.', when: '5 Sep' },
  ] },
  { id: 'CT-115', handle: 'huong.makeup', share: 20, term: '6 months, non-exclusive', status: 'Signed', history: [
    { by: 'MCN', share: 22, note: 'Offer at 22%.', when: '20 Oct' },
    { by: 'Creator', share: 20, note: 'Counter-offer: 20% and a shorter term.', when: '22 Oct' },
    { by: 'MCN', share: 20, note: 'Accepted at 20%, 6 months.', when: '23 Oct' },
  ] },
  { id: 'CT-120', handle: 'ngocskin', share: 22, term: '12 months, exclusive in Vietnam', status: 'Pending', history: [
    { by: 'MCN', share: 22, note: 'Contract sent. Waiting for the creator to sign or reply.', when: '17 Nov' },
  ] },
]

export const BUILDER_BLOCKS: Record<string, { name: string; hint: string }> = {
  hero: { name: 'Hero', hint: 'Name, tagline and contact button' },
  stats: { name: 'Numbers', hint: 'Signed creators, cities, home market' },
  roster: { name: 'Roster', hint: 'Your creators, linked to their profiles' },
  services: { name: 'Services', hint: 'What brands can hire you for' },
  about: { name: 'About', hint: 'A short paragraph about the MCN' },
  contact: { name: 'Contact form', hint: 'Brand requests land in your inbox' },
}
export const BUILDER_TEMPLATES = [
  { id: 'roster', name: 'Roster first', blocks: ['hero', 'roster', 'services', 'contact'] },
  { id: 'editorial', name: 'Editorial', blocks: ['hero', 'about', 'stats', 'roster', 'contact'] },
  { id: 'minimal', name: 'Minimal', blocks: ['hero', 'roster', 'contact'] },
]

export const PORTAL = {
  handle: 'linh.glow', share: 20,
  deals: [
    { brand: 'Lumi Skin', what: '1 TikTok video + 1 story', fee: 7_800_000, status: 'Script review' },
    { brand: 'Dewy Lab (sample)', what: '1 TikTok video', fee: 6_000_000, status: 'Completed' },
    { brand: 'Petal & Co (sample)', what: '1 Instagram Reel', fee: 5_000_000, status: 'Completed' },
  ],
  docs: ['MCN contract CT-112 (signed 5 Sep 2026)', 'November statement', 'Brand safety guidelines'],
}

export const MCN_CHATS: Chat[] = [
  { id: 'm1', who: 'Northside Agency (sample)', sub: 'Request: 3 beauty creators for Lumi Skin', unread: true, messages: [
    { me: false, text: 'Hi Trang, we need three beauty creators in Ho Chi Minh City for late November. Can you share who is free?', when: '11:05' },
  ] },
  { id: 'm2', who: 'Thảo · @thao.skincare', sub: 'Contract CT-118', unread: true, messages: [
    { me: true, text: 'Contract is in your inbox. Tell me if anything is unclear.', when: '12 Nov' },
    { me: false, text: 'Thanks. I sent a counter-offer on the share. Happy to talk it through.', when: '15 Nov' },
  ] },
  { id: 'm3', who: 'Lumi Skin', sub: 'ORD-5121 · @linh.glow', unread: false, messages: [
    { me: false, text: 'Script from Linh looks good. One note on the disclosure line, sent in the order.', when: 'Mon' },
  ] },
]
export type AgencyRequest = { id: string; agency: string; client: string; wants: string; creators: string[]; budget: number; status: 'Pending' | 'Accepted' | 'Declined' }
export const AGENCY_REQUESTS: AgencyRequest[] = [
  { id: 'AO-311', agency: 'Northside Agency (sample)', client: 'Lumi Skin', wants: '3 TikTok videos, late November', creators: ['linh.glow', 'thao.skincare', 'huong.makeup'], budget: 21_000_000, status: 'Pending' },
  { id: 'AO-314', agency: 'Harbor Media (sample)', client: 'Petal & Co (sample)', wants: '1 TikTok LIVE before Tết', creators: ['huong.makeup'], budget: 9_500_000, status: 'Accepted' },
  { id: 'AO-302', agency: 'Northside Agency (sample)', client: 'Sora Sun (sample)', wants: '2 Instagram Reels', creators: ['ngocskin', 'linh.glow'], budget: 10_000_000, status: 'Declined' },
]
export const MCN_SPLITS = [
  { id: 'SP-441', date: '2026-11-15', creator: 'linh.glow', deal: 'Dewy Lab (sample) · 1 TikTok video', fee: 6_000_000, share: 20, status: 'Paid' },
  { id: 'SP-438', date: '2026-11-10', creator: 'huong.makeup', deal: 'Petal & Co (sample) · LIVE', fee: 9_500_000, share: 20, status: 'Paid' },
  { id: 'SP-436', date: '2026-11-06', creator: 'linh.glow', deal: 'Petal & Co (sample) · 1 Reel', fee: 5_000_000, share: 20, status: 'Paid' },
  { id: 'SP-447', date: '2026-11-25', creator: 'linh.glow', deal: 'Lumi Skin · video + story', fee: 7_800_000, share: 20, status: 'Pending' },
]
export const MCN_ALERTS = [
  { text: '@thao.skincare sent a counter-offer on contract CT-118', when: '15 Nov', tab: 'contracts' },
  { text: '@minh.beauty applied to join Lotus Talent', when: '2 days ago', tab: 'talent' },
  { text: 'Northside Agency (sample) requested 3 creators', when: 'Today', tab: 'agency-orders' },
]
export const MCN_SAVED = [
  { title: 'Scouting: Hanoi beauty', sub: '6 creators · updated last week' },
  { title: 'LIVE sellers to approach', sub: '4 creators · updated 3 weeks ago' },
]

// ---------- editor (Video Editing Studio) ----------
export const EDITOR_NAME = 'Jae Kim'
// Queue items from other brands, on top of the shared STUDIO_ORDERS
export const EDITOR_EXTRA_QUEUE = [
  { id: 'VE-2046-1', order: 'VE-2046', brand: 'Kiro Snacks (sample)', title: 'Convenience-store haul, 3 cuts', type: 'short' as const, due: '2026-11-26', files: ['haul_takes.zip', 'logo_pack.zip'] },
  { id: 'VE-2047-1', order: 'VE-2047', brand: 'Nova Audio (sample)', title: 'Earbuds review, long form', type: 'long' as const, due: '2026-11-30', files: ['a_cam.mp4', 'b_cam.mp4', 'voiceover.wav'] },
]
export const BRIEFS: Record<string, string> = {
  'VE-2041': 'Three videos for the serum launch. Hook tests A and B use the same footage with a different first 3 seconds. Captions in English, brand font in the guide. Keep the texture shot.',
  'VE-2037': 'Cut the unboxing down to 20 seconds and make a 40-second routine tutorial. Warm colour grade, no stock music with vocals.',
  'VE-2046': 'Three 15-second cuts from one haul. Fast pace, price tag overlay on each product, end card with the logo.',
  'VE-2047': 'A 6–8 minute review. Two cameras, voiceover supplied. Chapters for sound, fit, battery and verdict.',
}
export const REVISION_NOTES: Record<string, string> = {
  'VE-2037-2': 'Step 2 goes by too fast. Please hold it for a second longer and make the caption bigger. Music is a little loud under the voice.',
}
export const EDITOR_CHATS: Chat[] = [
  { id: 'e1', who: 'Lumi Skin', sub: 'VE-2041 · Serum launch', unread: true, messages: [
    { me: true, text: 'Draft 2 of hook test A is up. I kept the texture shot at 0:04.', when: 'Tue 17:10' },
    { me: false, text: 'Looks good. Can hook test B open on the dropper close-up?', when: '09:30' },
  ] },
  { id: 'e2', who: 'Studio lead', sub: 'Queue for this week', unread: false, messages: [
    { me: false, text: 'Two new orders are in the queue. Long-form review is due on the 30th.', when: 'Mon' },
  ] },
]
export const EDITOR_ALERTS = [
  { text: 'Lumi Skin asked for a revision on “Routine tutorial”', when: 'Yesterday', tab: 'revisions' },
  { text: '2 new videos are waiting in the queue', when: 'Today', tab: 'queue' },
  { text: 'Brief and files arrived for VE-2041', when: '12 Nov', tab: 'mine' },
]
export const EDITOR_SAVED = [
  { title: 'Lumi Skin brand guide', sub: 'Fonts, colours, caption style' },
  { title: 'Caption presets', sub: 'TikTok, Reels and Shorts safe areas' },
  { title: 'Licensed music list', sub: 'Tracks cleared for client work' },
]
