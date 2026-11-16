// Markets MegaEvolution currently lists on megaevolution.io.
// To add a market, add a row here; the hero, market desk and filters all read from it.
export const MARKETS = [
  { id: 'id', city: 'Jakarta', country: 'Indonesia', tz: 'Asia/Jakarta', langs: 'Bahasa Indonesia', strong: ['Food', 'Beauty', 'Vlog'], region: 'SEA' },
  { id: 'vn', city: 'Ho Chi Minh City', short: 'Saigon', country: 'Vietnam', tz: 'Asia/Ho_Chi_Minh', langs: 'Tiếng Việt', strong: ['Food', 'Vlog', 'Tech'], region: 'SEA' },
  { id: 'tw', city: 'Taipei', country: 'Taiwan', tz: 'Asia/Taipei', langs: '繁體中文', strong: ['Food', 'Tech', 'Gaming'], region: 'NE Asia' },
  { id: 'kr', city: 'Seoul', country: 'South Korea', tz: 'Asia/Seoul', langs: '한국어', strong: ['Beauty', 'Vlog', 'Gaming'], region: 'NE Asia' },
  { id: 'jp', city: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo', langs: '日本語', strong: ['Gaming', 'Tech', 'Food'], region: 'NE Asia' },
  { id: 'us', city: 'Los Angeles', country: 'United States', tz: 'America/Los_Angeles', langs: 'English, Español', strong: ['Tech', 'Beauty', 'Gaming'], region: 'US' },
]

export const CATEGORIES = ['Food', 'Beauty', 'Vlog', 'Gaming', 'Tech']

// Sample creators for the design. Swap in real profiles + photos (`img`) before launch.
export const CREATORS = [
  { handle: 'dapurnadia', name: 'Nadia P.', market: 'id', cat: 'Food', followers: '1.2M', rate: '150–775', platform: 'TikTok', caption: 'Cobain kopi susu viral di Jakarta', tone: 'clay' },
  { handle: 'bao.an.eats', name: 'Bảo An', market: 'vn', cat: 'Food', followers: '500K', rate: '100', platform: 'TikTok', caption: 'Ăn thử bánh mì ngon nhất Sài Gòn', tone: 'saffron' },
  { handle: 'yuting.unbox', name: 'Yu-Ting', market: 'tw', cat: 'Tech', followers: '640K', rate: '500–1,000', platform: 'YouTube', caption: '新手機一週使用心得', tone: 'forest' },
  { handle: 'minji.daily', name: 'Min-ji', market: 'kr', cat: 'Beauty', followers: '3.0M', rate: '1,900', platform: 'Instagram', caption: '가을 데일리 메이크업', tone: 'sage' },
  { handle: 'kaito_plays', name: 'Kaito', market: 'jp', cat: 'Gaming', followers: '1.9M', rate: '600–1,000', platform: 'YouTube', caption: '新作ゲーム実況', tone: 'night' },
  { handle: 'marcos.builds', name: 'Marcos R.', market: 'us', cat: 'Tech', followers: '880K', rate: '500–1,000', platform: 'YouTube', caption: 'Testing the thinnest laptop of 2026', tone: 'sand' },
  { handle: 'rizky.jalan', name: 'Rizky', market: 'id', cat: 'Vlog', followers: '320K', rate: '35–60', platform: 'Instagram', caption: 'Seharian di Bandung', tone: 'forest' },
  { handle: 'linh.glow', name: 'Thùy Linh', market: 'vn', cat: 'Beauty', followers: '410K', rate: '150–775', platform: 'TikTok', caption: 'Skincare buổi sáng 5 phút', tone: 'sage' },
  { handle: 'axel.gg', name: 'Axel', market: 'id', cat: 'Gaming', followers: '2.0M', rate: '600–1,000', platform: 'YouTube', caption: 'Push rank sampai pagi', tone: 'night' },
  { handle: 'hana.walks', name: 'Hana', market: 'jp', cat: 'Vlog', followers: '270K', rate: '150–775', platform: 'Instagram', caption: '東京の朝さんぽ', tone: 'sand' },
  { handle: 'jun.techlab', name: 'Jun-ho', market: 'kr', cat: 'Tech', followers: '3.3M', rate: '1,900', platform: 'YouTube', caption: '신형 이어폰 솔직 리뷰', tone: 'saffron' },
  { handle: 'bella.eats.la', name: 'Bella', market: 'us', cat: 'Food', followers: '150K', rate: '100', platform: 'TikTok', caption: 'Every taco truck on one street', tone: 'clay' },
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
  us: { code: 'US', lat: 34.05, lon: -118.24, team: 'Local manager', watched: ['YouTube', 'Instagram', 'TikTok', 'Facebook'], buy: ['Amazon', 'TikTok Shop', 'Walmart'] },
}

export const PLATFORM_COLORS = {
  TikTok: '#0d0d38', YouTube: '#ff0033', Instagram: '#d6336c', Facebook: '#4c7cf3',
  LINE: '#06c755', Naver: '#03c75a', X: '#111111',
}
