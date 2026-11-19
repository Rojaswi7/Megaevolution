// ------------------------------------------------------------------
// SAMPLE DATA — every creator below is made up. Handles, names, numbers and
// rates are generated from the pools in this file so the mockup has enough
// profiles to show search, filters and the programmatic SEO pages.
// Replace with the real creator API (see HANDOFF.md).
// ------------------------------------------------------------------
import { MARKETS } from './markets'
import { CATEGORIES } from './categories'
import { CREATOR_FX } from './pricing'

export type PlatformStat = { platform: string; followers: number; avgViews: number; er: number; posts: number }
export type Creator = {
  handle: string; name: string; market: string; city: string; category: string
  platforms: PlatformStat[]; followers: number; avgViews: number; er: number; posts: number
  langs: string[]; currency: string; rateLocal: number; rateUsd: number
  verified: boolean; caption: string; captions: string[]; tone: number; bio: string
  mcn: string | null
  gmv: null // reserved for Creator Commerce Data (TikTok Shop sales) — coming soon
}

const NAMES: Record<string, string[]> = {
  kr: ['Min-ji', 'Seo-yeon', 'Ji-woo', 'Ha-eun', 'Su-bin', 'Ye-jin', 'Jun-ho', 'Chae-won', 'Yu-na', 'So-hee', 'Ji-ho', 'Da-eun', 'Min-jun', 'Do-yoon', 'Hyun-woo', 'Tae-yang', 'Seung-min', 'Jae-won', 'Eun-ji', 'Na-yeon', 'Bo-ra', 'Ga-eun', 'Si-woo', 'Ha-joon'],
  jp: ['Kaito', 'Yui', 'Sakura', 'Rin', 'Mio', 'Aoi', 'Hana', 'Haruto', 'Sota', 'Ren', 'Yuki', 'Mei', 'Akari', 'Riku', 'Kenta', 'Nana', 'Emi', 'Daiki', 'Saki', 'Hinata', 'Koharu', 'Takumi', 'Ayaka', 'Shota'],
  cn: ['Xiao Yu', 'Mei Lin', 'Jia Hui', 'Zi Han', 'Yu Tong', 'Xin Yi', 'Hao Ran', 'Zi Xuan', 'Yi Fan', 'Jing Wen', 'Li Na', 'Wei Jie', 'Rui Qi', 'Shu Yan', 'Bo Wen', 'Yan Ni', 'Ke Xin', 'Jun Jie', 'Si Qi', 'Ming Hao', 'An Qi', 'Le Yi', 'Chen Xi', 'Tian Yu'],
  vn: ['Minh', 'Linh', 'Ngọc', 'Trang', 'Hương', 'Thảo', 'Bảo An', 'Khoa', 'Vy', 'Quân', 'Mai', 'Đức', 'Hà', 'Tú', 'Nhi', 'Phúc', 'Lan', 'Tuấn', 'Chi', 'Hiếu', 'My', 'Long', 'Yến', 'Nam'],
  th: ['Ploy', 'Fern', 'Mind', 'Bam', 'Praew', 'Ice', 'Earth', 'Mew', 'Gun', 'Pim', 'Noon', 'Beam', 'Jane', 'Tong', 'Fah', 'Ning', 'Win', 'Bow', 'May', 'Oat', 'Pear', 'Kao', 'Tar', 'Namtan'],
  id: ['Nadia', 'Rizky', 'Dewi', 'Putri', 'Ayu', 'Sari', 'Axel', 'Bima', 'Citra', 'Dimas', 'Intan', 'Fajar', 'Laras', 'Reza', 'Tiara', 'Yoga', 'Kirana', 'Agus', 'Salsa', 'Gilang', 'Maya', 'Rama', 'Nisa', 'Bayu'],
  ph: ['Bea', 'Jasmine', 'Andrea', 'Kyla', 'Bianca', 'Trisha', 'Miguel', 'Paolo', 'Carlo', 'Enzo', 'Marco', 'Ella', 'Joaquin', 'Nicole', 'Rafa', 'Sam', 'Iya', 'Luis', 'Chesca', 'Gab', 'Pia', 'Kiko', 'Jana', 'Migs'],
  us: ['Marcos', 'Avery', 'Jordan', 'Bella', 'Maya', 'Tyler', 'Zoe', 'Ethan', 'Nia', 'Caleb', 'Sofia', 'Dev', 'Harper', 'Mason', 'Layla', 'Owen', 'Camille', 'Jalen', 'Riley', 'Priya', 'Noah', 'Quinn', 'Elena', 'Theo'],
  mx: ['Camila', 'Valeria', 'Ximena', 'Renata', 'Regina', 'Mariana', 'Diego', 'Mateo', 'Santiago', 'Emilio', 'Leo', 'Fer', 'Andrés', 'Dani', 'Pau', 'Iker', 'Rodrigo', 'Majo', 'Sebas', 'Natalia', 'Luisa', 'Gael', 'Ana', 'Bruno'],
  br: ['Larissa', 'Júlia', 'Bia', 'Manu', 'Duda', 'Lívia', 'Gabriel', 'Lucas', 'Pedro', 'Rafael', 'Thiago', 'Caio', 'Isa', 'Vitor', 'Malu', 'João', 'Carol', 'Bruno', 'Clara', 'Felipe', 'Luana', 'Davi', 'Nanda', 'Guto'],
  eu: ['Elena', 'Chloé', 'Lena', 'Sofia', 'Inès', 'Emma', 'Lukas', 'Matteo', 'Hugo', 'Jonas', 'Marco', 'Pablo', 'Lea', 'Finn', 'Giulia', 'Noah', 'Clara', 'Emil', 'Marta', 'Louis', 'Nora', 'Tim', 'Alba', 'Max'],
}

const CITIES: Record<string, string[]> = {
  kr: ['Seoul', 'Busan', 'Incheon', 'Daegu'], jp: ['Tokyo', 'Osaka', 'Fukuoka', 'Nagoya'], cn: ['Shanghai', 'Chengdu', 'Hangzhou', 'Guangzhou'],
  vn: ['Ho Chi Minh City', 'Hanoi', 'Da Nang'], th: ['Bangkok', 'Chiang Mai', 'Phuket'], id: ['Jakarta', 'Bandung', 'Surabaya', 'Bali'],
  ph: ['Manila', 'Cebu', 'Davao', 'Quezon City'], us: ['Los Angeles', 'New York', 'Austin', 'Atlanta'], mx: ['Mexico City', 'Guadalajara', 'Monterrey'],
  br: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'], eu: ['Berlin', 'Paris', 'Madrid', 'Milan', 'Amsterdam'],
}

const HANDLES: Record<string, string[]> = {
  beauty: ['{n}.beauty', '{n}.glow', '{n}skin', 'glowwith{n}', '{n}.makeup', '{n}.skincare', 'by.{n}'],
  food: ['{n}.eats', 'eatwith{n}', '{n}.foodie', '{n}.kitchen', 'hungry.{n}', '{n}.bites', '{n}cooks'],
  fashion: ['{n}.fits', '{n}.style', 'wear.{n}', '{n}.closet', '{n}.ootd', 'styledby{n}', '{n}.looks'],
  gaming: ['{n}.gg', '{n}_plays', '{n}.games', 'play{n}', '{n}.live', '{n}xgaming', 'gg.{n}'],
  tech: ['{n}.tech', '{n}.unbox', '{n}techlab', '{n}.reviews', '{n}.builds', 'tech.{n}', '{n}.setup'],
  lifestyle: ['{n}.daily', '{n}.vlogs', '{n}.walks', 'lifeof{n}', '{n}.diary', 'with.{n}', '{n}.home'],
}

// Captions in the creator's own language, used as cover text on the content tiles.
const CAPTIONS: Record<string, Record<string, string[]>> = {
  kr: {
    beauty: ['가을 데일리 메이크업', '5분 아침 스킨케어 루틴'], food: ['성수동 신상 카페 다녀왔어요', '편의점 신상 다 먹어봄'], fashion: ['이번 주 출근룩 모음', '겨울 코트 하울'],
    gaming: ['신작 게임 첫 플레이', '랭크 올리는 법 알려드림'], tech: ['신형 이어폰 솔직 리뷰', '책상 셋업 투어'], lifestyle: ['자취생 주말 브이로그', '서울 하루 산책'],
  },
  jp: {
    beauty: ['毎日メイクのやり方', 'ドラコス購入品レビュー'], food: ['コンビニ新作ぜんぶ食べた', '東京ラーメン巡り'], fashion: ['1週間コーデ', '古着屋さん巡り'],
    gaming: ['新作ゲーム実況', '初見プレイで全クリ目指す'], tech: ['新型スマホ1週間レビュー', 'デスクツアー2026'], lifestyle: ['東京の朝さんぽ', '一人暮らしの休日ルーティン'],
  },
  cn: {
    beauty: ['换季护肤全流程', '平价彩妆红黑榜'], food: ['成都街头小吃一日游', '在家复刻网红奶茶'], fashion: ['一周通勤穿搭', '秋冬外套怎么选'],
    gaming: ['新游戏开荒实况', '上分技巧分享'], tech: ['新手机一周体验', '桌面改造计划'], lifestyle: ['周末独居日常', '上海城市漫步'],
  },
  vn: {
    beauty: ['Skincare buổi sáng 5 phút', 'Review son mới siêu xinh'], food: ['Ăn thử bánh mì ngon nhất Sài Gòn', 'Một ngày ăn sập chợ đêm'], fashion: ['Phối đồ đi làm cả tuần', 'Unbox đồ thu đông'],
    gaming: ['Leo rank xuyên đêm', 'Chơi thử game mới ra'], tech: ['Trên tay điện thoại mới', 'Góc làm việc của mình'], lifestyle: ['Một ngày ở Đà Lạt', 'Cuối tuần ở Sài Gòn'],
  },
  th: {
    beauty: ['สกินแคร์ตอนเช้า 5 นาที', 'รีวิวลิปสติกสีใหม่'], food: ['ตะลุยกินเยาวราช', 'คาเฟ่เปิดใหม่ย่านอารีย์'], fashion: ['แต่งตัวไปทำงาน 7 วัน', 'ช้อปจตุจักรงบ 500'],
    gaming: ['ไต่แรงค์ยันเช้า', 'ลองเกมใหม่ครั้งแรก'], tech: ['รีวิวมือถือรุ่นใหม่', 'จัดโต๊ะคอมใหม่'], lifestyle: ['วันหยุดที่เชียงใหม่', 'หนึ่งวันในกรุงเทพ'],
  },
  id: {
    beauty: ['Skincare pagi 5 menit', 'Review lipstik lokal terbaru'], food: ['Cobain kopi susu viral di Jakarta', 'Kulineran malam di Bandung'], fashion: ['OOTD ngantor seminggu', 'Haul baju lebaran'],
    gaming: ['Push rank sampai pagi', 'Nyobain game baru rilis'], tech: ['Review HP baru sejutaan', 'Setup meja kerja'], lifestyle: ['Seharian di Bandung', 'Weekend di Bali'],
  },
  ph: {
    beauty: ['5-minute morning skincare', 'Trying the viral lip tint'], food: ['Binondo food crawl', 'Rating every new milk tea'], fashion: ['Office outfits for a week', 'Divisoria haul under ₱1,000'],
    gaming: ['Rank push hanggang umaga', 'First look at the new patch'], tech: ['Budget phone, honest review', 'Desk setup tour'], lifestyle: ['A day in Siargao', 'Weekend sa Tagaytay'],
  },
  us: {
    beauty: ['My 5-minute morning routine', 'Drugstore dupes that work'], food: ['Every taco truck on one street', 'Rating NYC’s viral bagels'], fashion: ['A week of work outfits', 'Thrift haul, $50 budget'],
    gaming: ['First run of the new release', 'Climbing ranked, no tilt'], tech: ['Testing the thinnest laptop of 2026', 'Desk setup tour'], lifestyle: ['A slow Sunday in LA', 'Moving day vlog'],
  },
  mx: {
    beauty: ['Mi rutina de skincare en 5 minutos', 'Probando el labial viral'], food: ['Los mejores tacos de la CDMX', 'Antojitos por menos de $100'], fashion: ['Outfits para la oficina', 'Haul de temporada'],
    gaming: ['Subiendo de rango toda la noche', 'Primer gameplay del nuevo juego'], tech: ['Reseña honesta del nuevo celular', 'Tour por mi setup'], lifestyle: ['Un día en Oaxaca', 'Fin de semana en la ciudad'],
  },
  br: {
    beauty: ['Minha rotina de skincare em 5 minutos', 'Testando o batom viral'], food: ['Comendo tudo na feira de SP', 'Os melhores pastéis do Rio'], fashion: ['Looks da semana pro trabalho', 'Achadinhos de brechó'],
    gaming: ['Subindo de rank a noite toda', 'Primeira gameplay do lançamento'], tech: ['Review sincero do celular novo', 'Tour pelo meu setup'], lifestyle: ['Um dia no Rio', 'Domingo em casa'],
  },
  eu: {
    beauty: ['Meine 5-Minuten-Morgenroutine', 'Ma routine skincare du matin'], food: ['Le meilleur croissant de Paris', 'Street food in Berlin, getestet'], fashion: ['Una semana de looks de oficina', 'Vintage haul a Milano'],
    gaming: ['First run of the new release', 'Ranked bis zum Morgen'], tech: ['Das dünnste Laptop 2026 im Test', 'Mon setup de bureau'], lifestyle: ['Un domingo en Madrid', 'A slow weekend in Amsterdam'],
  },
}

const MCNS = ['Lotus Talent', 'Seoul Wave Media', 'Kanto Creators', null, null, null, null]

// Small deterministic PRNG so the sample data is the same on every build.
function rng(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const slugName = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '')
const nice = (n: number) => { const p = Math.pow(10, Math.max(0, Math.floor(Math.log10(n)) - 1)); return Math.round(n / p) * p }

function build(): Creator[] {
  const out: Creator[] = []
  const seen = new Set<string>()
  for (const m of MARKETS) {
    const pool = NAMES[m.id]
    let ni = 0
    // strong categories first, so the best-known names land in the biggest hubs
    const order = [...m.strong, ...CATEGORIES.map((c) => c.slug).filter((s) => !m.strong.includes(s))]
    order.forEach((cat, ci) => {
      const strong = ci < 3
      const count = strong ? (ci === 0 ? 8 : 6) : 2 + ((m.id.charCodeAt(0) + ci) % 3) // weak combos: 2–4, shows the noindex rule
      for (let k = 0; k < count; k++) {
        const name = pool[ni % pool.length]; ni++
        const pats = HANDLES[cat]
        let handle = pats[k % pats.length].replace('{n}', slugName(name))
        if (seen.has(handle)) handle = `${handle}.${m.id}`
        if (seen.has(handle)) handle = `${handle}${k + 2}`
        seen.add(handle)
        const r = rng(handle)
        const followers = nice(Math.round(Math.exp(Math.log(18000) + r() * (Math.log(3200000) - Math.log(18000)))))
        const logos = m.watches.filter((p) => ['YouTube', 'TikTok', 'Instagram'].includes(p))
        const own = logos.length ? logos : m.watches
        const primary = own[Math.floor(r() * Math.min(2, own.length))]
        const others = own.filter((p) => p !== primary).slice(0, r() > 0.45 ? 2 : 1)
        const mk = (p: string, share: number): PlatformStat => {
          const f = nice(Math.round(followers * share))
          return { platform: p, followers: f, avgViews: nice(Math.round(f * (0.08 + r() * 0.5))), er: +(2.1 + r() * 7.4).toFixed(1), posts: Math.round(40 + r() * 860) }
        }
        const platforms = [mk(primary, 1), ...others.map((p) => mk(p, 0.15 + r() * 0.5))]
        const usd = Math.max(40, (followers / 1000) * (0.6 + r() * 1.6))
        const fx = CREATOR_FX[m.currency] || 1
        const rateLocal = nice(usd * fx)
        const caps = CAPTIONS[m.id][cat]
        const cities = CITIES[m.id]
        const city = cities[Math.floor(r() * cities.length)]
        const label = CATEGORIES.find((c) => c.slug === cat)!
        out.push({
          handle, name, market: m.id, city, category: cat,
          platforms, followers, avgViews: platforms[0].avgViews, er: platforms[0].er, posts: platforms[0].posts,
          langs: m.langs.slice(0, r() > 0.6 ? 2 : 1).concat(m.id !== 'us' && m.id !== 'ph' && r() > 0.75 ? ['English'] : []).filter((v, i, a) => a.indexOf(v) === i),
          currency: m.currency, rateLocal, rateUsd: Math.round(rateLocal / fx),
          verified: r() > 0.35, caption: caps[k % caps.length], captions: caps, tone: Math.floor(r() * 8),
          bio: `${label.label} creator in ${city}. ${label.blurb.split(',')[0].replace(/^./, (c) => c.toUpperCase())} and more, in ${m.langs[0]}.`,
          mcn: MCNS[Math.floor(r() * MCNS.length)],
          gmv: null,
        })
      }
    })
  }
  return out
}

/** Six cover captions for a profile: the creator's own niche first, then the off-topic posts every creator has. */
export function captionMix(c: Creator): string[] {
  const own = CAPTIONS[c.market][c.category]
  const side = (['lifestyle', 'food', 'fashion'] as const).filter((k) => k !== c.category)
  const a = CAPTIONS[c.market][side[0]], b = CAPTIONS[c.market][side[1]]
  return [own[0], own[1], a[0], own[0] === c.caption ? b[0] : own[0], a[1], b[1]]
}

export const CREATORS: Creator[] = build()
export const creatorByHandle = Object.fromEntries(CREATORS.map((c) => [c.handle, c]))

export const creatorsIn = (market?: string, category?: string) =>
  CREATORS.filter((c) => (!market || c.market === market) && (!category || c.category === category)).sort((a, b) => b.followers - a.followers)

// A hand-picked mix for the home page: one strong creator from each market, widest spread of categories.
export const FEATURED: Creator[] = (() => {
  const picks: Creator[] = []
  const want = ['minh.beauty']
  for (const h of want) if (creatorByHandle[h]) picks.push(creatorByHandle[h])
  const cats = CATEGORIES.map((c) => c.slug)
  MARKETS.forEach((m, i) => {
    const c = CREATORS.find((x) => x.market === m.id && x.category === cats[i % cats.length] && !picks.includes(x)) || CREATORS.find((x) => x.market === m.id && !picks.includes(x))
    if (c) picks.push(c)
  })
  return picks.slice(0, 12)
})()

/** Minimum creators a country × category page needs before it is indexable. */
export const MIN_INDEXABLE = 6
