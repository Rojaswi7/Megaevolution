// Markets MegaEvolution currently lists on megaevolution.io.
// To add a market, add a row here; the hero, market desk and filters all read from it.
export const MARKETS = [
  { id: 'id', city: 'Jakarta', country: 'Indonesia', tz: 'Asia/Jakarta', langs: 'Bahasa Indonesia', strong: ['F&B', 'Beauty', 'Vlog'], region: 'SEA' },
  { id: 'vn', city: 'Ho Chi Minh City', short: 'Saigon', country: 'Vietnam', tz: 'Asia/Ho_Chi_Minh', langs: 'Tiếng Việt', strong: ['F&B', 'Vlog', 'Tech'], region: 'SEA' },
  { id: 'th', city: 'Bangkok', country: 'Thailand', tz: 'Asia/Bangkok', langs: 'ภาษาไทย', strong: ['F&B', 'Beauty', 'Vlog'], region: 'SEA' },
  { id: 'ph', city: 'Manila', country: 'Philippines', tz: 'Asia/Manila', langs: 'Filipino, English', strong: ['Vlog', 'F&B', 'Beauty'], region: 'SEA' },
  { id: 'my', city: 'Kuala Lumpur', country: 'Malaysia', tz: 'Asia/Kuala_Lumpur', langs: 'Bahasa Melayu, English, 中文', strong: ['F&B', 'Beauty', 'Vlog'], region: 'SEA' },
  { id: 'sg', city: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore', langs: 'English, 中文, Bahasa Melayu', strong: ['F&B', 'Beauty', 'Tech'], region: 'SEA' },
  { id: 'tw', city: 'Taipei', country: 'Taiwan', tz: 'Asia/Taipei', langs: '繁體中文', strong: ['F&B', 'Tech', 'Gaming'], region: 'NE Asia' },
  { id: 'cn', city: 'Shanghai', country: 'China', tz: 'Asia/Shanghai', langs: '简体中文', strong: ['Beauty', 'Tech', 'F&B'], region: 'NE Asia' },
  { id: 'kr', city: 'Seoul', country: 'South Korea', tz: 'Asia/Seoul', langs: '한국어', strong: ['Beauty', 'Vlog', 'Gaming'], region: 'NE Asia' },
  { id: 'jp', city: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo', langs: '日本語', strong: ['Gaming', 'Tech', 'F&B'], region: 'NE Asia' },
  { id: 'in', city: 'Mumbai', country: 'India', tz: 'Asia/Kolkata', langs: 'हिन्दी, English', strong: ['Tech', 'F&B', 'Vlog'], region: 'South Asia' },
  { id: 'me', city: 'Dubai', country: 'Middle East', short: 'Middle East', tz: 'Asia/Dubai', langs: 'العربية, English', strong: ['Beauty', 'F&B', 'Tech'], region: 'Middle East', isRegion: true },
  { id: 'eu', city: 'Berlin', country: 'European Union', short: 'Europe', tz: 'Europe/Berlin', langs: 'English, Deutsch, Français and more', strong: ['Beauty', 'Tech', 'Gaming'], region: 'EU' },
  { id: 'us', city: 'Los Angeles', country: 'United States', tz: 'America/Los_Angeles', langs: 'English, Español', strong: ['Tech', 'Beauty', 'Gaming'], region: 'US' },
  { id: 'latam', city: 'Mexico City', country: 'Latin America', short: 'Latin America', tz: 'America/Mexico_City', langs: 'Español, Português', strong: ['Vlog', 'F&B', 'Beauty'], region: 'Latin America', isRegion: true },
]

export const CATEGORIES = ['F&B', 'Beauty', 'Vlog', 'Gaming', 'Tech']

// Sample creators for the design. Swap in real profiles + photos (`img`) before launch.
export const CREATORS = [
  { handle: 'dapurnadia', name: 'Nadia P.', market: 'id', cat: 'F&B', followers: '1.2M', rate: '150–775', platform: 'TikTok', caption: 'Cobain kopi susu viral di Jakarta', tone: 'clay' },
  { handle: 'bao.an.eats', name: 'Bảo An', market: 'vn', cat: 'F&B', followers: '500K', rate: '100', platform: 'TikTok', caption: 'Ăn thử bánh mì ngon nhất Sài Gòn', tone: 'saffron' },
  { handle: 'yuting.unbox', name: 'Yu-Ting', market: 'tw', cat: 'Tech', followers: '640K', rate: '500–1,000', platform: 'YouTube', caption: '新手機一週使用心得', tone: 'forest' },
  { handle: 'minji.daily', name: 'Min-ji', market: 'kr', cat: 'Beauty', followers: '3.0M', rate: '1,900', platform: 'Instagram', caption: '가을 데일리 메이크업', tone: 'sage' },
  { handle: 'kaito_plays', name: 'Kaito', market: 'jp', cat: 'Gaming', followers: '1.9M', rate: '600–1,000', platform: 'YouTube', caption: '新作ゲーム実況', tone: 'night' },
  { handle: 'marcos.builds', name: 'Marcos R.', market: 'us', cat: 'Tech', followers: '880K', rate: '500–1,000', platform: 'YouTube', caption: 'Testing the thinnest laptop of 2026', tone: 'sand' },
  { handle: 'rizky.jalan', name: 'Rizky', market: 'id', cat: 'Vlog', followers: '320K', rate: '35–60', platform: 'Instagram', caption: 'Seharian di Bandung', tone: 'forest' },
  { handle: 'linh.glow', name: 'Thùy Linh', market: 'vn', cat: 'Beauty', followers: '410K', rate: '150–775', platform: 'TikTok', caption: 'Skincare buổi sáng 5 phút', tone: 'sage' },
  { handle: 'axel.gg', name: 'Axel', market: 'id', cat: 'Gaming', followers: '2.0M', rate: '600–1,000', platform: 'YouTube', caption: 'Push rank sampai pagi', tone: 'night' },
  { handle: 'hana.walks', name: 'Hana', market: 'jp', cat: 'Vlog', followers: '270K', rate: '150–775', platform: 'Instagram', caption: '東京の朝さんぽ', tone: 'sand' },
  { handle: 'jun.techlab', name: 'Jun-ho', market: 'kr', cat: 'Tech', followers: '3.3M', rate: '1,900', platform: 'YouTube', caption: '신형 이어폰 솔직 리뷰', tone: 'saffron' },
  { handle: 'bella.eats.la', name: 'Bella', market: 'us', cat: 'F&B', followers: '150K', rate: '100', platform: 'TikTok', caption: 'Every taco truck on one street', tone: 'clay' },
]

export const GREETINGS = ['Halo', 'Xin chào', '你好', '안녕하세요', 'こんにちは', 'Hello', 'Hola', 'Kumusta', 'สวัสดี', 'Selamat datang']

// ------------------------------------------------------------------
// Hero collage + spotlight media.
// Drop files into /public/media and set `src` (e.g. '/media/saigon-food.mp4').
// type: 'image' | 'video'  (videos autoplay muted + loop; add `poster` for a still)
// Leave src empty to show the tonal placeholder.
// ------------------------------------------------------------------
export const MEDIA = [
  { type: 'video', src: '', poster: '', credit: '@bao.an.eats', place: 'Saigon', tone: 'sand' },
  { type: 'image', src: '', credit: '@minji.daily', place: 'Seoul', tone: 'sage' },
  { type: 'video', src: '', poster: '', credit: '@dapurnadia', place: 'Jakarta', tone: 'clay' },
  { type: 'image', src: '', credit: '@hana.walks', place: 'Tokyo', tone: 'stone' },
  { type: 'video', src: '', poster: '', credit: '@yuting.unbox', place: 'Taipei', tone: 'forest' },
  { type: 'image', src: '', credit: '@linh.glow', place: 'Saigon', tone: 'butter' },
  { type: 'video', src: '', poster: '', credit: '@rizky.jalan', place: 'Bandung', tone: 'moss' },
  { type: 'image', src: '', credit: '@marcos.builds', place: 'Los Angeles', tone: 'sand' },
  { type: 'video', src: '', poster: '', credit: '@kaito_plays', place: 'Tokyo', tone: 'ink' },
  { type: 'image', src: '', credit: '@jun.techlab', place: 'Seoul', tone: 'clay' },
]

// ------------------------------------------------------------------
// Market detail cards (map section). General market knowledge as of 2026 —
// have each local team confirm the order before launch.
// ------------------------------------------------------------------
export const MARKET_INFO = {
  id: { code: 'ID', lat: -6.2, lon: 106.8, team: 'Local manager', watched: ['YouTube', 'TikTok', 'Instagram', 'Facebook'], buy: ['Shopee', 'Tokopedia', 'TikTok Shop', 'Lazada'] },
  vn: { code: 'VN', lat: 10.8, lon: 106.7, team: 'Local manager', watched: ['TikTok', 'Facebook', 'YouTube', 'Instagram'], buy: ['Shopee', 'TikTok Shop', 'Lazada'] },
  tw: { code: 'TW', lat: 25.0, lon: 121.5, team: 'Local manager', watched: ['YouTube', 'Facebook', 'Instagram', 'LINE'], buy: ['Shopee', 'momo', 'PChome'] },
  kr: { code: 'KR', lat: 37.6, lon: 127.0, team: 'Local manager', watched: ['YouTube', 'Instagram', 'Naver', 'TikTok'], buy: ['Coupang', 'Naver Shopping', 'Gmarket'] },
  jp: { code: 'JP', lat: 35.7, lon: 139.7, team: 'Local manager', watched: ['YouTube', 'X', 'Instagram', 'TikTok'], buy: ['Amazon', 'Rakuten', 'Yahoo! Shopping'] },
  my: { code: 'MY', lat: 3.14, lon: 101.69, team: '', watched: ['YouTube', 'Facebook', 'TikTok', 'Instagram'], buy: ['Shopee', 'Lazada', 'TikTok Shop'] },
  sg: { code: 'SG', lat: 1.35, lon: 103.82, team: '', watched: ['YouTube', 'Instagram', 'TikTok', 'Facebook'], buy: ['Shopee', 'Lazada', 'Amazon'] },
  cn: { code: 'CN', lat: 31.23, lon: 121.47, team: '', watched: ['Douyin', 'Xiaohongshu', 'Bilibili', 'WeChat'], buy: ['Taobao', 'JD.com', 'Pinduoduo'] },
  in: { code: 'IN', lat: 19.08, lon: 72.88, team: '', watched: ['YouTube', 'Instagram', 'Facebook', 'X'], buy: ['Amazon', 'Flipkart', 'Meesho'] },
  th: { code: 'TH', lat: 13.75, lon: 100.5, team: '', watched: ['YouTube', 'Facebook', 'TikTok', 'LINE'], buy: ['Shopee', 'Lazada', 'TikTok Shop'] },
  ph: { code: 'PH', lat: 14.6, lon: 120.98, team: '', watched: ['Facebook', 'YouTube', 'TikTok', 'Instagram'], buy: ['Shopee', 'Lazada', 'TikTok Shop'] },
  me: { code: 'ME', lat: 25.2, lon: 55.27, team: '', watched: ['YouTube', 'Instagram', 'TikTok', 'Snapchat'], buy: ['Amazon', 'Noon', 'Namshi'] },
  latam: { code: 'LATAM', lat: 19.43, lon: -99.13, team: '', watched: ['YouTube', 'Facebook', 'Instagram', 'TikTok'], buy: ['Mercado Libre', 'Amazon', 'Shein'] },
  eu: { code: 'EU', lat: 52.52, lon: 13.4, team: '', watched: ['YouTube', 'Instagram', 'TikTok', 'Facebook'], buy: ['Amazon', 'Zalando', 'Temu'] },
  us: { code: 'US', lat: 34.05, lon: -118.24, team: 'Local manager', watched: ['YouTube', 'Instagram', 'TikTok', 'Facebook'], buy: ['Amazon', 'TikTok Shop', 'Walmart'] },
}

export const PLATFORM_COLORS = {
  TikTok: '#0d0d38', YouTube: '#ff0033', Instagram: '#d6336c', Facebook: '#4c7cf3',
  LINE: '#06c755', Naver: '#03c75a', X: '#111111',
  Snapchat: '#f5c400', Douyin: '#0d0d38', Xiaohongshu: '#ff2442', Bilibili: '#00a1d6', WeChat: '#07c160',
}

// ------------------------------------------------------------------
// Creator rates follow the creator's country. Sample rates are stored in USD
// and shown in local currency with rough conversions — replace with real
// local rates when the creator data is wired up.
// ------------------------------------------------------------------
const FX = {
  th: ['THB', 36], my: ['MYR', 4.7], ph: ['PHP', 56], me: ['AED', 3.67], latam: ['MXN', 17], id: ['IDR', 16000], vn: ['VND', 25000], sg: ['SGD', 1.35], tw: ['TWD', 32], cn: ['CNY', 7.2], kr: ['KRW', 1350], jp: ['JPY', 150], in: ['INR', 83], eu: ['EUR', 0.92], us: ['USD', 1] }
export const minUsd = (rate) => Number(String(rate).split('–')[0].replace(/,/g, ''))
export function localRate(usd, market) {
  const [cur, r] = FX[market] || FX.us
  const v = usd * r
  return new Intl.NumberFormat('en', {
    style: 'currency', currency: cur, currencyDisplay: 'symbol',
    notation: v >= 100000 ? 'compact' : 'standard', maximumFractionDigits: v >= 100000 ? 1 : 0,
  }).format(v)
}

// ------------------------------------------------------------------
// Brand-side money (budgets) is shown in the visitor's currency.
// Order: ?currency=XXX in the URL, then the visitor's timezone, then their
// browser language, then USD. Once hosted on Vercel this can switch to the
// x-vercel-ip-country header for true IP-based detection.
// ------------------------------------------------------------------
const CURRENCY_RATES = { USD: 1, MYR: 4.7, IDR: 16000, VND: 25000, THB: 36, PHP: 56, SGD: 1.35, TWD: 32, CNY: 7.2, KRW: 1350, JPY: 150, INR: 83, AED: 3.67, EUR: 0.92, MXN: 17, GBP: 0.79, AUD: 1.5 }
const TZ_CURRENCY = {
  'Asia/Jakarta': 'IDR', 'Asia/Ho_Chi_Minh': 'VND', 'Asia/Saigon': 'VND', 'Asia/Bangkok': 'THB', 'Asia/Kuala_Lumpur': 'MYR', 'Asia/Manila': 'PHP',
  'Asia/Singapore': 'SGD', 'Asia/Taipei': 'TWD', 'Asia/Shanghai': 'CNY', 'Asia/Seoul': 'KRW', 'Asia/Tokyo': 'JPY',
  'Asia/Kolkata': 'INR', 'Asia/Calcutta': 'INR', 'Asia/Dubai': 'AED', 'America/Mexico_City': 'MXN', 'Europe/London': 'GBP',
  'Australia/Sydney': 'AUD',
}
const REGION_CURRENCY = { MY: 'MYR', ID: 'IDR', VN: 'VND', TH: 'THB', PH: 'PHP', SG: 'SGD', TW: 'TWD', CN: 'CNY', KR: 'KRW', JP: 'JPY', IN: 'INR', AE: 'AED', MX: 'MXN', GB: 'GBP', AU: 'AUD', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR' }

export function detectCurrency() {
  try {
    const q = new URLSearchParams(window.location.search).get('currency')
    if (q && CURRENCY_RATES[q.toUpperCase()]) return q.toUpperCase()
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (TZ_CURRENCY[tz]) return TZ_CURRENCY[tz]
    if (tz && tz.startsWith('Europe/')) return 'EUR'
    const region = (navigator.language || '').split('-')[1]
    if (region && REGION_CURRENCY[region.toUpperCase()]) return REGION_CURRENCY[region.toUpperCase()]
  } catch {}
  return 'USD'
}
export const VIEWER_CURRENCY = typeof window !== 'undefined' ? detectCurrency() : 'USD'

/** Format a USD amount in the visitor's currency. `compact` for scale labels. */
export function money(usd, { compact = false } = {}) {
  const cur = VIEWER_CURRENCY
  const v = usd * CURRENCY_RATES[cur]
  const step = v >= 1e7 ? 1e6 : v >= 1e5 ? 1e4 : v >= 1e3 ? 100 : 1
  return new Intl.NumberFormat('en', {
    style: 'currency', currency: cur, currencyDisplay: 'symbol',
    notation: compact || v >= 1e7 ? 'compact' : 'standard', maximumFractionDigits: compact || v >= 1e7 ? 1 : 0,
  }).format(Math.round(v / step) * step)
}
