// Generated Open Graph images (1200×630), built at deploy time:
//   /og/default.png · /og/creator/<handle>.png · /og/case/<slug>.png
import { ImageResponse } from 'next/og'
import { CREATORS, creatorByHandle } from '@/data/creators'
import { CASES, caseBySlug } from '@/data/cases'
import { marketById } from '@/data/markets'
import { categoryBySlug } from '@/data/categories'
import { compact } from '@/lib/format'

export const dynamic = 'force-static'
export const dynamicParams = false
export function generateStaticParams() {
  return [
    { slug: ['default.png'] },
    ...CREATORS.map((c) => ({ slug: ['creator', `${c.handle}.png`] })),
    ...CASES.map((c) => ({ slug: ['case', `${c.slug}.png`] })),
  ]
}

const NAVY = '#0E0D39'
const LIME = '#C6F04D'

export async function GET(_: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const [kind, file] = slug.length === 1 ? ['default', slug[0]] : slug
  const id = (file || '').replace(/\.png$/, '')
  let eyebrow = 'CREATOR MARKETING · 11 MARKETS'
  let title = 'Find and book local creators'
  let accent = 'in any market.'
  let foot = 'megaevolution.io'
  if (kind === 'creator' && creatorByHandle[id]) {
    const c = creatorByHandle[id]
    const m = marketById[c.market]
    eyebrow = `${categoryBySlug[c.category].label.toUpperCase()} CREATOR · ${m.name.toUpperCase()}`
    title = `@${c.handle}`
    accent = `${compact(c.followers)} followers · ${c.er}% engagement`
    foot = 'Rates and audience on megaevolution.io'
  }
  if (kind === 'case' && caseBySlug[id]) {
    const c = caseBySlug[id]
    eyebrow = `CASE STUDY ${c.no} · ${c.category.toUpperCase()}`
    title = c.client
    accent = c.stats.slice(0, 2).map((s) => `${s.value} ${s.label}`).join(' · ')
  }
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: NAVY, color: '#fff', padding: 72 }}>
        <div style={{ display: 'flex', fontSize: 24, letterSpacing: 5, color: LIME, fontWeight: 600 }}>{eyebrow}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: title.length > 22 ? 76 : 104, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{title}</div>
          <div style={{ display: 'flex', fontSize: 50, color: LIME, marginTop: 18, letterSpacing: -1 }}>{accent}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 26, color: 'rgba(255,255,255,.75)' }}>
          <div style={{ display: 'flex', fontWeight: 700, color: '#fff', fontSize: 32 }}>MegaEvolution</div>
          <div style={{ display: 'flex' }}>{foot}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
