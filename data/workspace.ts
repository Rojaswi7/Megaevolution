// SAMPLE DATA for the logged-in previews — every order, message, invoice and person here is made up.
// Shared by the brand, agency, creator, MCN and editor workspaces so the same order shows up on each side.

export type VideoStatus = 'Waiting for brief' | 'In queue' | 'Editing' | 'Draft ready' | 'Revision requested' | 'Final delivered'
export type StudioVideo = { id: string; title: string; type: 'short' | 'long'; status: VideoStatus; draft: number; revisionsUsed: number; editor?: string; due: string }
export type StudioOrder = { id: string; brand: string; placed: string; videos: StudioVideo[]; briefSent: boolean; files: string[]; plan?: 'Plus' | 'Max' }

export const STUDIO_ORDERS: StudioOrder[] = [
  {
    id: 'VE-2041', brand: 'Lumi Skin', placed: '2026-11-12', briefSent: true, files: ['raw_footage_01.mp4', 'raw_footage_02.mp4', 'brand_guide.pdf'], plan: 'Plus',
    videos: [
      { id: 'VE-2041-1', title: 'Serum launch — hook test A', type: 'short', status: 'Draft ready', draft: 2, revisionsUsed: 1, editor: 'Jae Kim', due: '2026-11-21' },
      { id: 'VE-2041-2', title: 'Serum launch — hook test B', type: 'short', status: 'Editing', draft: 0, revisionsUsed: 0, editor: 'Jae Kim', due: '2026-11-22' },
      { id: 'VE-2041-3', title: 'Founder story', type: 'long', status: 'In queue', draft: 0, revisionsUsed: 0, due: '2026-11-27' },
    ],
  },
  {
    id: 'VE-2037', brand: 'Lumi Skin', placed: '2026-11-03', briefSent: true, files: ['unboxing_takes.zip'],
    videos: [
      { id: 'VE-2037-1', title: 'Unboxing cut-down', type: 'short', status: 'Final delivered', draft: 3, revisionsUsed: 2, editor: 'Jae Kim', due: '2026-11-10' },
      { id: 'VE-2037-2', title: 'Routine tutorial', type: 'short', status: 'Revision requested', draft: 1, revisionsUsed: 1, editor: 'Jae Kim', due: '2026-11-20' },
    ],
  },
  {
    id: 'VE-2044', brand: 'Lumi Skin', placed: '2026-11-18', briefSent: false, files: [],
    videos: [{ id: 'VE-2044-1', title: 'Holiday set teaser', type: 'short', status: 'Waiting for brief', draft: 0, revisionsUsed: 0, due: '—' }],
  },
]

export type OrderStatus = 'Awaiting creator' | 'Brief sent' | 'Script review' | 'Draft review' | 'Revision' | 'Scheduled' | 'Posted' | 'Completed'
export type CreatorOrder = { id: string; brand: string; creator: string; market: string; pkg: string; platform: string; amountUsd: number; status: OrderStatus; due: string; campaign: string; manager?: string }

export const CREATOR_ORDERS: CreatorOrder[] = [
  { id: 'ORD-5120', brand: 'Lumi Skin', creator: 'minh.beauty', market: 'vn', pkg: '1 TikTok video', platform: 'TikTok', amountUsd: 472, status: 'Draft review', due: '2026-11-22', campaign: 'Serum launch · Vietnam' },
  { id: 'ORD-5121', brand: 'Lumi Skin', creator: 'linh.glow', market: 'vn', pkg: '1 TikTok video + 1 story', platform: 'TikTok', amountUsd: 310, status: 'Script review', due: '2026-11-25', campaign: 'Serum launch · Vietnam' },
  { id: 'ORD-5118', brand: 'Lumi Skin', creator: 'minji.beauty', market: 'kr', pkg: '1 Instagram Reel', platform: 'Instagram', amountUsd: 640, status: 'Scheduled', due: '2026-11-20', campaign: 'Serum launch · Korea' },
  { id: 'ORD-5109', brand: 'Lumi Skin', creator: 'bea.beauty', market: 'ph', pkg: 'TikTok LIVE, 60 min', platform: 'TikTok', amountUsd: 380, status: 'Posted', due: '2026-11-14', campaign: 'Serum launch · Philippines' },
  { id: 'ORD-5102', brand: 'Lumi Skin', creator: 'kenta.eats', market: 'jp', pkg: '1 YouTube Short', platform: 'YouTube', amountUsd: 520, status: 'Completed', due: '2026-11-05', campaign: 'Tokyo pop-up' },
  { id: 'ORD-5125', brand: 'Lumi Skin', creator: 'thao.skincare', market: 'vn', pkg: '1 TikTok video', platform: 'TikTok', amountUsd: 190, status: 'Awaiting creator', due: '2026-11-28', campaign: 'Serum launch · Vietnam' },
]

// Agency Orders: a campaign run by the agency for a client brand, with listings (shortlisted creators).
export type Listing = { creator: string; market: string; status: 'Proposed' | 'Approved by brand' | 'Contracted' | 'Posted' | 'Declined'; feeUsd: number; option: string }
export type AgencyOrder = { id: string; client: string; title: string; markets: string[]; budgetUsd: number; stage: 'Listing' | 'Brand approval' | 'Contracting' | 'Live' | 'Reporting'; manager: string; listings: Listing[]; pricing: 'Per creator' | 'Package' | 'Management fee %' }

export const AGENCY_ORDERS: AgencyOrder[] = [
  {
    id: 'AO-311', client: 'Lumi Skin', title: 'Serum launch, 3 markets', markets: ['vn', 'kr', 'ph'], budgetUsd: 18000, stage: 'Brand approval', manager: 'Daniel Cho', pricing: 'Per creator',
    listings: [
      { creator: 'minh.beauty', market: 'vn', status: 'Approved by brand', feeUsd: 472, option: '1 TikTok video' },
      { creator: 'linh.glow', market: 'vn', status: 'Proposed', feeUsd: 310, option: '1 TikTok video + 1 story' },
      { creator: 'minji.beauty', market: 'kr', status: 'Contracted', feeUsd: 640, option: '1 Instagram Reel' },
      { creator: 'bea.beauty', market: 'ph', status: 'Posted', feeUsd: 380, option: 'TikTok LIVE, 60 min' },
      { creator: 'huong.makeup', market: 'vn', status: 'Declined', feeUsd: 260, option: '1 TikTok video' },
    ],
  },
  {
    id: 'AO-308', client: 'Kiro Snacks (sample)', title: 'Convenience-store launch, Japan', markets: ['jp'], budgetUsd: 9500, stage: 'Live', manager: 'Daniel Cho', pricing: 'Package',
    listings: [
      { creator: 'kenta.eats', market: 'jp', status: 'Posted', feeUsd: 520, option: '1 YouTube Short' },
      { creator: 'emi.foodie', market: 'jp', status: 'Contracted', feeUsd: 410, option: '1 Instagram Reel' },
    ],
  },
  {
    id: 'AO-305', client: 'Nova Audio (sample)', title: 'Earbuds review seeding, US', markets: ['us'], budgetUsd: 24000, stage: 'Reporting', manager: 'Daniel Cho', pricing: 'Management fee %',
    listings: [
      { creator: 'marcos.tech', market: 'us', status: 'Posted', feeUsd: 1900, option: '1 YouTube integration' },
      { creator: 'avery.unbox', market: 'us', status: 'Posted', feeUsd: 700, option: '1 TikTok video' },
    ],
  },
]

export const TEAM = [
  { name: 'Hana Park', email: 'brand@demo.megaevolution.io', role: 'Admin', access: 'Everything', status: 'Active' },
  { name: 'Leo Martin', email: 'leo@lumiskin.example', role: 'Campaign manager', access: 'Orders, lists, inbox', status: 'Active' },
  { name: 'Sora Ito', email: 'sora@lumiskin.example', role: 'Finance', access: 'Billing and invoices', status: 'Active' },
  { name: 'Ana Reyes', email: 'ana@lumiskin.example', role: 'Viewer', access: 'Read only', status: 'Invited' },
]
export const ACCESS_REQUESTS = [
  { name: 'Tom Becker', email: 'tom@lumiskin.example', wants: 'Agency Orders', note: 'Need to approve listings for the EU launch.' },
  { name: 'Mai Pham', email: 'mai@lumiskin.example', wants: 'Billing', note: 'Monthly invoice export.' },
]

export const INVOICES = [
  { id: 'INV-0931', date: '2026-11-12', what: 'Video Editing Studio · 3 videos', brand: 'Lumi Skin', amountUsd: 0, tbd: true, status: 'Paid' },
  { id: 'INV-0927', date: '2026-11-08', what: 'Creator order ORD-5118 · @minji.beauty', brand: 'Lumi Skin', amountUsd: 640, tbd: false, status: 'Paid' },
  { id: 'INV-0919', date: '2026-11-03', what: 'Video Editing Studio · 2 videos', brand: 'Lumi Skin', amountUsd: 0, tbd: true, status: 'Paid' },
  { id: 'INV-0912', date: '2026-11-01', what: 'Plus subscription · November', brand: 'Lumi Skin', amountUsd: 0, tbd: true, status: 'Paid' },
  { id: 'INV-0898', date: '2026-10-27', what: 'Creator order ORD-5102 · @kenta.eats', brand: 'Lumi Skin', amountUsd: 520, tbd: false, status: 'Refunded' },
]

export type Thread = { id: string; from: string; creator?: string; subject: string; preview: string; when: string; unread: boolean; stage: 'New' | 'Negotiating' | 'Agreed' | 'Posted'; aiDraft: string }
export const THREADS: Thread[] = [
  { id: 't1', from: 'Minh', creator: 'minh.beauty', subject: 'Re: Serum launch — draft v2', preview: 'I shortened the intro like you asked. Can you check the caption?', when: '10:42', unread: true, stage: 'Agreed', aiDraft: 'Thanks Minh — v2 reads much better. Two small things: please show the texture shot before the price, and add the disclosure tag in the first line of the caption. Then we’re good to post Friday.' },
  { id: 't2', from: 'Thùy Linh', creator: 'linh.glow', subject: 'Rate for 1 video + 1 story', preview: 'My rate for this set is ₫7.8M. I can post on the 25th.', when: '09:15', unread: true, stage: 'Negotiating', aiDraft: 'Hi Linh, thank you. ₫7.8M works for the video and story. Could you include 30 days of usage rights for paid ads at that rate? If yes, I’ll send the contract today.' },
  { id: 't3', from: 'Min-ji', creator: 'minji.beauty', subject: 'Reel scheduled for Thursday', preview: 'Scheduled for 19:00 KST. Link will follow.', when: 'Yesterday', unread: false, stage: 'Agreed', aiDraft: 'Perfect, thank you Min-ji. Please send the link once it’s live and we’ll add it to the report.' },
  { id: 't4', from: 'Bea', creator: 'bea.beauty', subject: 'LIVE recap + numbers', preview: 'Peak viewers 2.1K, sold out the bundle in 40 minutes.', when: 'Mon', unread: false, stage: 'Posted', aiDraft: 'Great result, Bea. Could you share the LIVE dashboard screenshot so we can include verified numbers in the report?' },
  { id: 't5', from: 'Thảo', creator: 'thao.skincare', subject: 'New: collaboration request', preview: 'Thanks for reaching out. What’s the timeline?', when: 'Mon', unread: false, stage: 'New', aiDraft: 'Hi Thảo, thanks for the quick reply. We’d like one TikTok video posted between 26 and 30 November. I’ll send the brief and the product this week if that works.' },
]

export const LISTS = [
  { name: 'Serum launch · Vietnam shortlist', creators: ['minh.beauty', 'linh.glow', 'thao.skincare', 'huong.makeup'], updated: '2 days ago' },
  { name: 'K-beauty Reels', creators: ['minji.beauty', 'seoyeon.glow', 'jiwooskin'], updated: 'Last week' },
  { name: 'Japan F & B', creators: ['kenta.eats', 'emi.foodie'], updated: '3 weeks ago' },
]

export const NOTIFICATIONS = [
  { text: 'Draft 2 is ready for “Serum launch — hook test A”', when: '12 min ago', to: 'orders' },
  { text: '@minh.beauty sent a draft for review', when: '1 h ago', to: 'orders' },
  { text: 'Tom Becker requested access to Agency Orders', when: 'Yesterday', to: 'team' },
]
