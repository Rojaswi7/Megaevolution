// SAMPLE DATA for the interactive tool demos on /tools/[tool]. Every row is made up.

// --- AI Listup ---
export const LISTUP_BRIEF = 'We’re launching a vitamin C serum in Vietnam in December. Budget around $4,000. Looking for beauty creators on TikTok who do honest skincare reviews. They must post in Vietnamese and have real engagement. Nice if they have sold on TikTok Shop before. Avoid anyone who promoted a competing serum in the last 3 months.'
export const LISTUP_CARDS = {
  must: [
    { id: 'lang', text: 'Posts in Vietnamese' },
    { id: 'er', text: 'Engagement 5% or higher', relax: 'engagement to 3%', gain: ['thao.skincare', 'huong.makeup'] },
    { id: 'skin', text: 'Skincare reviews in the last 30 posts' },
  ],
  nice: [{ id: 'shop', text: 'Has sold on TikTok Shop' }, { id: 'live', text: 'Goes LIVE at least monthly' }],
  avoid: [{ id: 'comp', text: 'Promoted a competing serum in the last 3 months' }],
}
export const LISTUP_RESULTS = [
  { handle: 'minh.beauty', pass: true, why: '9 skincare reviews in the last 30 posts. No competing serum found.', nice: ['TikTok Shop'] },
  { handle: 'linh.glow', pass: true, why: 'Morning-routine series, all in Vietnamese. No competitor posts.', nice: ['TikTok Shop', 'LIVE'] },
  { handle: 'ngocskin', pass: true, why: '12 of the last 30 posts are ingredient breakdowns.', nice: [] },
  { handle: 'glowwithtrang', pass: false, why: 'Posted a paid review of a competing vitamin C serum 5 weeks ago.', nice: ['LIVE'] },
  { handle: 'khoa.beauty', pass: true, why: 'Review format matches the brief. Disclosure tags used on paid posts.', nice: [] },
]
export const LISTUP_RELAXED = [
  { handle: 'thao.skincare', pass: true, why: 'Just under the 5% line. Strong skincare focus, all in Vietnamese.', nice: ['TikTok Shop'] },
  { handle: 'huong.makeup', pass: true, why: 'Above 3%. Mostly make-up, with 6 skincare posts.', nice: [] },
]

// --- Performance Report (sample campaign) ---
export const REPORT = {
  name: 'Serum launch · sample campaign', posts: 14, creators: 9,
  totals: [{ label: 'Views', value: '1.84M' }, { label: 'Engagements', value: '112K' }, { label: 'Engagement rate', value: '6.1%' }, { label: 'Posts', value: '14' }],
  platforms: [
    { platform: 'TikTok', views: 1120000, er: 7.2, posts: 8 },
    { platform: 'Instagram', views: 430000, er: 5.1, posts: 4 },
    { platform: 'YouTube', views: 290000, er: 3.4, posts: 2 },
  ],
  daily: [18, 42, 96, 150, 210, 260, 244, 198, 170, 132, 108, 90, 74, 62], // thousand views per day
  top: [
    { handle: 'minh.beauty', platform: 'TikTok', views: '412K', er: '8.4%' },
    { handle: 'bea.beauty', platform: 'TikTok', views: '288K', er: '7.9%' },
    { handle: 'minji.beauty', platform: 'Instagram', views: '201K', er: '5.6%' },
  ],
}

// --- AI Video Edit ---
export const STORYBOARD = [
  { t: '0:00', scene: 'Hook', text: '“I stopped buying serums. Then this one.”', tone: 0 },
  { t: '0:03', scene: 'Problem', text: 'Close-up: dull skin in morning light', tone: 3 },
  { t: '0:07', scene: 'Product', text: 'Texture shot, two drops on the hand', tone: 1 },
  { t: '0:12', scene: 'Proof', text: 'Day 1 / day 14 split screen', tone: 4 },
  { t: '0:18', scene: 'Call to action', text: '“Link in bio. Launch price this week.”', tone: 5 },
]
export const VIDEO_STYLES = ['Fast cuts', 'Clean tutorial', 'Vlog diary', 'Text-led']
export const VIDEO_LANGS = [{ code: 'KO', name: 'Korean', voices: ['Jiwoo', 'Minho'] }, { code: 'JA', name: 'Japanese', voices: ['Aoi', 'Ren'] }, { code: 'EN', name: 'English', voices: ['Maya', 'Theo'] }]

// --- Creator Commerce Data ---
export const COMMERCE_ROWS = {
  vn: [
    { handle: 'linh.glow', product: 'Vitamin C serum 30ml', gmv: '₫486M', units: '1,940', live: '62%' },
    { handle: 'minh.beauty', product: 'Cleansing balm', gmv: '₫312M', units: '1,105', live: '38%' },
    { handle: 'ngocskin', product: 'Sunscreen SPF50', gmv: '₫274M', units: '2,260', live: '15%' },
    { handle: 'vy.eats', product: 'Instant pho bundle', gmv: '₫198M', units: '3,410', live: '71%' },
  ],
  ph: [
    { handle: 'bea.beauty', product: 'Lip tint trio', gmv: '₱1.92M', units: '4,870', live: '80%' },
    { handle: 'jasmine.glow', product: 'Niacinamide toner', gmv: '₱1.14M', units: '2,030', live: '44%' },
    { handle: 'carlo.eats', product: 'Chili garlic oil', gmv: '₱860K', units: '5,120', live: '56%' },
    { handle: 'kyla.tech', product: 'Wireless earbuds', gmv: '₱742K', units: '610', live: '22%' },
  ],
}

// --- Script Studio ---
export const HOOKS = [
  { cat: 'Beauty', text: 'I stopped buying serums. Then this one.' },
  { cat: 'Beauty', text: 'Three things I’d buy again, and one I wouldn’t.' },
  { cat: 'F & B', text: 'I ate at every stall on this street so you don’t have to.' },
  { cat: 'F & B', text: 'This costs less than a coffee and it’s my whole lunch.' },
  { cat: 'Tech', text: 'I used it for a week. Here’s what broke.' },
  { cat: 'Tech', text: 'The setting nobody turns on.' },
]
export const SCRIPT_ROWS = [
  { scene: 'Hook', line: 'I stopped buying serums. Then this one.', screen: 'Day 1' },
  { scene: 'Problem', line: 'My skin looked tired by 3pm, every day.', screen: '3:00 pm' },
  { scene: 'Product', line: 'Two drops, morning only. It cures dark spots in a week.', screen: 'Vitamin C 15%' },
  { scene: 'Close', line: 'Launch price this week. Link in bio.', screen: 'Launch week' },
]
export const GUIDELINES = [
  { id: 'disclosure', rule: 'Paid partnership disclosure in the first line', test: 'disclosure' },
  { id: 'claims', rule: 'No medical claims (“cures”, “treats”)', test: 'claims' },
  { id: 'name', rule: 'Product name said within the first 10 seconds', test: 'name' },
  { id: 'competitor', rule: 'No competitor names', test: 'competitor' },
]
