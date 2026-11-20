// SAMPLE DATA — rate cards and audience breakdowns derived from each sample creator.
// One currency per rate card (the creator's own); brands see it converted.
import type { Creator } from './creators'
import { CREATOR_FX } from './pricing'

export type Package = { id: string; name: string; platform: string; detail: string; priceLocal: number; priceUsd: number; popular?: boolean }

const nice = (n: number) => { const p = Math.pow(10, Math.max(0, Math.floor(Math.log10(Math.max(n, 1))) - 1)); return Math.round(n / p) * p }

const MENU: Record<string, [string, string, number][]> = {
  TikTok: [['1 TikTok video', '30–60 s, one round of edits, link in bio for 7 days', 1], ['TikTok LIVE, 60 min', 'Product demo with pinned link', 1.6]],
  Instagram: [['1 Instagram Reel', '30–60 s, one round of edits, collab post', 1.1], ['3 Instagram Stories', 'Link sticker, posted within 24 hours', 0.5]],
  YouTube: [['1 YouTube Short', 'Up to 60 s, product link in description', 0.9], ['YouTube integration', '60–90 s inside a long video', 2.4]],
}

export function packagesFor(c: Creator): Package[] {
  const fx = CREATOR_FX[c.currency] || 1
  const out: Package[] = []
  c.platforms.forEach((p, i) => {
    const menu = MENU[p.platform] || [[`1 ${p.platform} post`, 'One post, one round of edits', 1]]
    const share = i === 0 ? 1 : Math.max(0.45, p.followers / c.followers)
    menu.forEach(([name, detail, mult], k) => {
      const local = nice(c.rateLocal * mult * share)
      out.push({ id: `${p.platform}-${k}`.toLowerCase(), name, platform: p.platform, detail, priceLocal: local, priceUsd: Math.round(local / fx), popular: i === 0 && k === 0 })
    })
  })
  const first = out[0]
  if (out.length > 2) {
    const local = nice((out[0].priceLocal + out[2].priceLocal) * 0.9)
    out.push({ id: 'bundle', name: `Bundle: ${out[0].name.replace('1 ', '')} + ${out[2].name.replace('1 ', '')}`, platform: first.platform, detail: 'Same concept cut for both platforms, 10% off', priceLocal: local, priceUsd: Math.round(local / fx) })
  }
  return out
}

export type Audience = { gender: [string, number][]; age: [string, number][]; countries: [string, number][]; interests: string[]; realFollowers: number }

function rng(seed: string) {
  let h = 1779033703
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19) }
  return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296 }
}

const NEIGHBOURS: Record<string, string[]> = {
  kr: ['Japan', 'United States', 'Vietnam'], jp: ['South Korea', 'United States', 'Thailand'], cn: ['Singapore', 'Malaysia', 'United States'], vn: ['Thailand', 'South Korea', 'United States'],
  th: ['Vietnam', 'Japan', 'Indonesia'], id: ['Malaysia', 'Singapore', 'Philippines'], ph: ['United States', 'Indonesia', 'Thailand'], us: ['Mexico', 'Canada', 'United Kingdom'],
  mx: ['United States', 'Colombia', 'Spain'], br: ['Portugal', 'United States', 'Argentina'], eu: ['United Kingdom', 'United States', 'Turkey'],
}
const INTERESTS: Record<string, string[]> = {
  beauty: ['Skincare', 'Make-up', 'K-beauty', 'Hair care', 'Wellness'], food: ['Street food', 'Cafés', 'Home cooking', 'Snacks', 'Travel'],
  fashion: ['Streetwear', 'Thrifting', 'Sneakers', 'Accessories', 'Beauty'], gaming: ['Mobile games', 'Esports', 'PC hardware', 'Anime', 'Streaming'],
  tech: ['Smartphones', 'Audio', 'Laptops', 'Smart home', 'Gaming'], lifestyle: ['Travel', 'Home', 'Fitness', 'Food', 'Family'],
}

export function audienceFor(c: Creator, homeCountry: string): Audience {
  const r = rng(c.handle)
  const female = c.category === 'beauty' || c.category === 'fashion' ? 62 + Math.round(r() * 24) : c.category === 'gaming' || c.category === 'tech' ? 22 + Math.round(r() * 22) : 44 + Math.round(r() * 20)
  const a = [8 + r() * 10, 30 + r() * 18, 26 + r() * 12, 8 + r() * 8]
  const sum = a.reduce((x, y) => x + y, 0)
  const ages = a.map((v) => Math.round((v / sum) * 100))
  const home = 68 + Math.round(r() * 22)
  const rest = 100 - home
  const n = NEIGHBOURS[c.market] || ['United States', 'Japan', 'South Korea']
  const c1 = Math.round(rest * 0.45), c2 = Math.round(rest * 0.3)
  return {
    gender: [['Women', female], ['Men', 100 - female]],
    age: [['13–17', ages[0]], ['18–24', ages[1]], ['25–34', ages[2]], ['35+', 100 - ages[0] - ages[1] - ages[2]]],
    countries: [[homeCountry, home], [n[0], c1], [n[1], c2], ['Other', rest - c1 - c2]],
    interests: INTERESTS[c.category] || [],
    realFollowers: 86 + Math.round(r() * 11),
  }
}
