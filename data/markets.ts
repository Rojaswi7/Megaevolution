// Markets on the map and on /markets/[slug].
// Platform order and shopping apps are general market knowledge — each local
// team should confirm before launch. Manager names are SAMPLE placeholders.
// Taiwan is intentionally not listed. Facebook is intentionally never shown.
import { MARKET_STRENGTHS } from './marketStrengths'

export type Market = {
  id: string; slug: string; name: string; short: string; adjective: string; city: string
  langs: string[]; currency: string; lat: number; lon: number
  watches: string[] // ranked; logos are drawn only for Instagram / TikTok / YouTube
  shops: string[]
  strong: string[] // category slugs
  manager: { name: string; role: string } // SAMPLE
  fact: string // one market fact used in programmatic intros
  season: string
  near: string[]
}

export const MARKETS: Market[] = [
  {
    id: 'kr', slug: 'korea', name: 'South Korea', short: 'Korea', adjective: 'Korean', city: 'Seoul',
    langs: ['Korean'], currency: 'KRW', lat: 37.6, lon: 127.0,
    watches: ['YouTube', 'Instagram', 'TikTok', 'Naver'], shops: ['Coupang', 'Naver Shopping', 'Olive Young', 'Kurly'],
    strong: ['beauty', 'fashion', 'gaming'],
    manager: { name: 'Seo-yeon (sample)', role: 'Korea campaign manager' },
    fact: 'Korean shoppers check YouTube reviews and Naver before they buy, so long-form creators carry unusual weight.',
    season: 'Chuseok, Black Friday week and the December gifting season', near: ['japan', 'china', 'vietnam'],
  },
  {
    id: 'jp', slug: 'japan', name: 'Japan', short: 'Japan', adjective: 'Japanese', city: 'Tokyo',
    langs: ['Japanese'], currency: 'JPY', lat: 35.7, lon: 139.7,
    watches: ['YouTube', 'Instagram', 'TikTok', 'LINE', 'X'], shops: ['Amazon', 'Rakuten', 'Yahoo! Shopping', 'Qoo10'],
    strong: ['gaming', 'beauty', 'food'],
    manager: { name: 'Haruka (sample)', role: 'Japan campaign manager' },
    fact: 'Japanese audiences reward creators who post consistently in one niche, and disclosure rules for paid posts are strict.',
    season: 'New Year fukubukuro sales, Golden Week and the summer bonus season', near: ['korea', 'china', 'united-states'],
  },
  {
    id: 'cn', slug: 'china', name: 'China', short: 'China', adjective: 'Chinese', city: 'Shanghai',
    langs: ['Mandarin'], currency: 'CNY', lat: 31.2, lon: 121.5,
    watches: ['Douyin', 'Xiaohongshu', 'Bilibili'], shops: ['Taobao', 'JD.com', 'Pinduoduo', 'Douyin Shop'],
    strong: ['beauty', 'fashion', 'tech'],
    manager: { name: 'Lin (sample)', role: 'China campaign manager' },
    fact: 'Discovery and checkout happen inside the same app in China, so creator content is usually the storefront too.',
    season: '618, Singles’ Day (11.11) and Lunar New Year', near: ['korea', 'japan', 'vietnam'],
  },
  {
    id: 'vn', slug: 'vietnam', name: 'Vietnam', short: 'Vietnam', adjective: 'Vietnamese', city: 'Ho Chi Minh City',
    langs: ['Vietnamese'], currency: 'VND', lat: 10.8, lon: 106.7,
    watches: ['TikTok', 'YouTube', 'Instagram'], shops: ['Shopee', 'TikTok Shop', 'Lazada'],
    strong: ['beauty', 'food', 'lifestyle'],
    manager: { name: 'Ngọc (sample)', role: 'Vietnam campaign manager' },
    fact: 'TikTok Shop is a main shopping channel in Vietnam, and buyers lean heavily on creator reviews and livestreams.',
    season: 'Tết, the 9.9 to 12.12 double-day sales and back-to-school', near: ['thailand', 'philippines', 'indonesia'],
  },
  {
    id: 'th', slug: 'thailand', name: 'Thailand', short: 'Thailand', adjective: 'Thai', city: 'Bangkok',
    langs: ['Thai'], currency: 'THB', lat: 13.75, lon: 100.5,
    watches: ['YouTube', 'TikTok', 'Instagram', 'LINE'], shops: ['Shopee', 'Lazada', 'TikTok Shop'],
    strong: ['beauty', 'food', 'lifestyle'],
    manager: { name: 'Ploy (sample)', role: 'Thailand campaign manager' },
    fact: 'Thai buyers often close the sale in LINE chat, so creator posts work best with a clear chat or shop link.',
    season: 'Songkran, mid-year sales and the 11.11 / 12.12 double days', near: ['vietnam', 'indonesia', 'philippines'],
  },
  {
    id: 'id', slug: 'indonesia', name: 'Indonesia', short: 'Indonesia', adjective: 'Indonesian', city: 'Jakarta',
    langs: ['Bahasa Indonesia'], currency: 'IDR', lat: -6.2, lon: 106.8,
    watches: ['YouTube', 'TikTok', 'Instagram'], shops: ['Shopee', 'Tokopedia', 'TikTok Shop', 'Lazada'],
    strong: ['food', 'beauty', 'gaming'],
    manager: { name: 'Dewi (sample)', role: 'Indonesia campaign manager' },
    fact: 'Indonesia is many regional markets in one, so campaigns usually mix national names with city-level creators.',
    season: 'Ramadan and Lebaran, Harbolnas (12.12) and payday sales', near: ['vietnam', 'thailand', 'philippines'],
  },
  {
    id: 'ph', slug: 'philippines', name: 'Philippines', short: 'Philippines', adjective: 'Filipino', city: 'Manila',
    langs: ['Filipino', 'English'], currency: 'PHP', lat: 14.6, lon: 121.0,
    watches: ['YouTube', 'TikTok', 'Instagram'], shops: ['Shopee', 'Lazada', 'TikTok Shop'],
    strong: ['beauty', 'food', 'lifestyle'],
    manager: { name: 'Bea (sample)', role: 'Philippines campaign manager' },
    fact: 'TikTok LIVE selling is strong in the Philippines, and English-language briefs work without translation.',
    season: 'The long “ber months” Christmas season, payday sales and double days', near: ['vietnam', 'indonesia', 'thailand'],
  },
  {
    id: 'us', slug: 'united-states', name: 'United States', short: 'US', adjective: 'American', city: 'Los Angeles',
    langs: ['English', 'Spanish'], currency: 'USD', lat: 34.05, lon: -118.24,
    watches: ['YouTube', 'Instagram', 'TikTok'], shops: ['Amazon', 'TikTok Shop', 'Walmart', 'Target'],
    strong: ['tech', 'beauty', 'gaming'],
    manager: { name: 'Jordan (sample)', role: 'US campaign manager' },
    fact: 'US creators expect usage rights and exclusivity to be priced separately, so briefs need those terms up front.',
    season: 'Back-to-school, Black Friday to Cyber Monday and the holidays', near: ['mexico', 'brazil', 'europe'],
  },
  {
    id: 'mx', slug: 'mexico', name: 'Mexico', short: 'Mexico', adjective: 'Mexican', city: 'Mexico City',
    langs: ['Spanish'], currency: 'MXN', lat: 19.43, lon: -99.13,
    watches: ['YouTube', 'TikTok', 'Instagram'], shops: ['Mercado Libre', 'Amazon', 'TikTok Shop', 'Shein'],
    strong: ['beauty', 'food', 'lifestyle'],
    manager: { name: 'Camila (sample)', role: 'Mexico campaign manager' },
    fact: 'Mexico is the largest Spanish-speaking creator market, and its creators reach audiences well beyond the border.',
    season: 'Hot Sale, El Buen Fin and the December holidays', near: ['united-states', 'brazil', 'europe'],
  },
  {
    id: 'br', slug: 'brazil', name: 'Brazil', short: 'Brazil', adjective: 'Brazilian', city: 'São Paulo',
    langs: ['Portuguese'], currency: 'BRL', lat: -23.55, lon: -46.63,
    watches: ['YouTube', 'Instagram', 'TikTok'], shops: ['Mercado Livre', 'Shopee', 'Amazon', 'Magalu'],
    strong: ['beauty', 'fashion', 'gaming'],
    manager: { name: 'Larissa (sample)', role: 'Brazil campaign manager' },
    fact: 'Brazil is one of the most active Instagram markets, and campaigns there run in Portuguese, not Spanish.',
    season: 'Carnival, Dia das Mães and Black Friday', near: ['mexico', 'united-states', 'europe'],
  },
  {
    id: 'eu', slug: 'europe', name: 'Europe', short: 'Europe', adjective: 'European', city: 'Berlin',
    langs: ['English', 'German', 'French', 'Spanish'], currency: 'EUR', lat: 50.1, lon: 8.7,
    watches: ['YouTube', 'Instagram', 'TikTok'], shops: ['Amazon', 'Zalando', 'TikTok Shop', 'Vinted'],
    strong: ['beauty', 'fashion', 'tech'],
    manager: { name: 'Elena (sample)', role: 'Europe campaign manager' },
    fact: 'Europe is a set of language markets with shared ad-disclosure rules, so we cast creators country by country.',
    season: 'Summer sales, Black Week and the Christmas markets season', near: ['united-states', 'brazil', 'mexico'],
  },
]

// General region labels on the map. Not pages of their own — they route to the agency form.
export const REGIONS = [
  { id: 'me', name: 'Middle East', lat: 25.2, lon: 55.3 },
  { id: 'latam', name: 'Latin America', lat: 1, lon: -72 },
]

export const marketBySlug = Object.fromEntries(MARKETS.map((m) => [m.slug, m]))
export const marketById = Object.fromEntries(MARKETS.map((m) => [m.id, m]))

/** Copy lifted from the current megaevolution.io market pages (public content). */
export function strengths(id: string) {
  const key = id === 'mx' || id === 'br' ? 'latam' : id
  return (MARKET_STRENGTHS as any)[key] || null
}

export const LOGO_PLATFORMS = ['Instagram', 'TikTok', 'YouTube']
