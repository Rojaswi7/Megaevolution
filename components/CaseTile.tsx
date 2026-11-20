// Case studies listing and "more cases": the result first, then who and one line on how.
// The full goal → result → feedback story lives on the case page.
import Link from 'next/link'
import { href } from '@/data/site'
import type { CaseStudy } from '@/data/cases'
import { marketBySlug } from '@/data/markets'
import { Arrow, Flag } from './Icon'

export function CaseMeta({ c }: { c: CaseStudy }) {
  return (
    <p className="cs-meta">
      <span className="cs-meta__no">Case {c.no}</span>
      {c.category ? <span>{c.category}</span> : null}
      {c.origin || c.target ? <span>{[c.origin, c.target].filter(Boolean).join(' → ')}</span> : null}
    </p>
  )
}

export function CaseTile({ c, lang, tone = 'light' }: { c: CaseStudy; lang: string; tone?: 'light' | 'accent' | 'dark' }) {
  const [lead, ...rest] = c.stats
  const markets = c.markets.map((s) => marketBySlug[s]).filter(Boolean)
  return (
    <article className={`cs-tile cs-tile--${tone}`}>
      <CaseMeta c={c} />
      {lead ? <p className="cs-tile__big"><b className="num">{lead.value}</b><span>{lead.label}</span></p> : null}
      <div className="cs-tile__who">
        <h3 className="h3"><Link href={href(lang, `/case-studies/${c.slug}`)} className="cs-tile__link" data-cta="case_tile_open" prefetch={false}>{c.client}</Link></h3>
        <p>{c.summary}</p>
      </div>
      {c.feedback ? <blockquote className="cs-tile__quote"><q>{c.feedback}</q>{c.feedbackBy ? <cite>{c.feedbackBy}</cite> : null}</blockquote> : null}
      {rest.length ? <ul className="cs-tile__stats">{rest.map((s) => <li key={s.label}><b className="num">{s.value}</b>{s.label}</li>)}</ul> : null}
      <footer className="cs-tile__foot">
        <span className="cs-tile__more">Read the case<Arrow size={15} /></span>
        {markets.length ? <span className="cs-tile__flags" aria-label="Markets">{markets.map((m) => <Flag key={m.id} market={m.id} title={m.name} />)}</span> : null}
      </footer>
    </article>
  )
}
