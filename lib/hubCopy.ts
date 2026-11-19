// Copy for the programmatic creator hubs (/creators/[country] and /creators/[country]/[category]).
// Each intro is assembled from that market's own facts and that hub's own numbers,
// so no two pages read the same.
import type { Market } from '@/data/markets'
import type { Category } from '@/data/categories'
import type { Creator } from '@/data/creators'
import { compact, localMoney } from '@/lib/format'

const logoPlats = (m: Market) => m.watches.filter((p) => ['TikTok', 'Instagram', 'YouTube'].includes(p))
const list = (a: string[]) => (a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`)

export function hubTitle(m: Market, cat?: Category) {
  const p = logoPlats(m)
  const plats = p.length >= 2 ? `${p[0]} & ${p[1]}` : p[0] || m.watches[0]
  return cat
    ? `${cat.label} Influencers in ${m.name} · ${plats} Creators`
    : `${m.adjective} Influencers & Creators · Hire ${plats} Creators in ${m.name}`
}

export function hubDescription(m: Market, list_: Creator[], cat?: Category) {
  const from = list_.length ? localMoney(Math.min(...list_.map((c) => c.rateLocal)), m.currency) : ''
  return cat
    ? `Find ${cat.noun} creators in ${m.name}: ${list_.length} profiles with followers, engagement and rates${from ? ` from ${from}` : ''}. ${m.watches[0]} leads in ${m.short}; buyers shop on ${m.shops[0]}.`
    : `Hire creators in ${m.name}. ${list_.length} profiles on ${list(m.watches.slice(0, 3))} with rates shown up front${from ? `, from ${from}` : ''}, plus a local manager in ${m.city}.`
}

export function hubIntro(m: Market, list_: Creator[], cat?: Category) {
  const top = [...list_].sort((a, b) => b.followers - a.followers)[0]
  const avgEr = list_.length ? (list_.reduce((s, c) => s + c.er, 0) / list_.length).toFixed(1) : null
  const p1 = cat
    ? `${m.adjective} ${cat.noun} creators make ${cat.blurb}. ${m.fact}`
    : `${m.fact} People in ${m.short} watch ${list(m.watches.slice(0, 3))} most, and buy on ${list(m.shops.slice(0, 3))}.`
  const p2 = list_.length
    ? `This page lists ${list_.length} ${cat ? `${cat.noun} ` : ''}${list_.length === 1 ? 'creator' : 'creators'} in ${m.name}${top ? `, from ${compact(Math.min(...list_.map((c) => c.followers)))} followers up to @${top.handle} with ${compact(top.followers)}` : ''}. ${avgEr ? `Average engagement across them is ${avgEr}%. ` : ''}Each card shows a starting rate in ${m.currency}, converted to your currency.`
    : `We are still adding ${cat ? cat.noun : ''} creators in ${m.name}. Ask our ${m.short} manager for a shortlist.`
  const p3 = `Planning around a date? The busy seasons in ${m.short} are ${m.season}.`
  return [p1, p2, p3]
}

export function hubFaq(m: Market, list_: Creator[], cat?: Category) {
  const what = cat ? `${cat.noun} creators` : 'creators'
  const cheapest = list_.length ? localMoney(Math.min(...list_.map((c) => c.rateLocal)), m.currency) : null
  return [
    { q: `How much do ${what} in ${m.name} charge?`, a: cheapest ? `Rates on this page start from ${cheapest} for one post, and rise with audience size. Every creator sets their own rate card in ${m.currency}; you see it converted to your currency.` : `Rates vary with audience size. Ask our ${m.short} manager for current rates.` },
    { q: `Which platforms matter most in ${m.name}?`, a: `${list(m.watches.slice(0, 3))}, in that order of reach. Shoppers then buy on ${list(m.shops.slice(0, 3))}.` },
    { q: `Do I need to speak ${m.langs[0]} to work with these creators?`, a: `No. You can order in English, or let our ${m.short} manager brief the creators in ${m.langs[0]} and check the content before it goes live.` },
    { q: `When should I book ${what} in ${m.name}?`, a: `Book a few weeks ahead of the busy seasons: ${m.season}.` },
  ]
}
