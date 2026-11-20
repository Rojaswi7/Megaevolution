// Case-study card in the flexible format: case number, category, brand origin and
// target market on top, then client goal → what they achieved → their feedback.
// Any field can be empty; empty fields are simply left out.
import Link from 'next/link'
import { href } from '@/data/site'
import type { CaseStudy } from '@/data/cases'
import { Arrow } from './Icon'

export function CaseCard({ c, lang, wide = false }: { c: CaseStudy; lang: string; wide?: boolean }) {
  const [lead, ...rest] = c.stats
  return (
    <article className={`case ${wide ? 'case--wide' : ''}`}>
      <header className="case__meta">
        <span className="case__no">Case {c.no}</span>
        {c.category ? <span>{c.category}</span> : null}
        {c.origin || c.target ? <span>{[c.origin, c.target].filter(Boolean).join(' → ')}</span> : null}
      </header>
      {lead ? <p className="case__big"><b className="num">{lead.value}</b><span>{lead.label}</span></p> : null}
      <h3 className="h3"><Link href={href(lang, `/case-studies/${c.slug}`)} className="case__link" data-cta="case_card_open" prefetch={false}>{c.client}</Link></h3>
      <dl className="case__body">
        {c.goal ? <div><dt>Client goal</dt><dd>{c.goal}</dd></div> : null}
        {c.achieved ? <div><dt>What they achieved</dt><dd>{c.achieved}</dd></div> : null}
        {c.feedback ? <div><dt>Their feedback</dt><dd><q>{c.feedback}</q>{c.feedbackBy ? <cite> {c.feedbackBy}</cite> : null}</dd></div> : null}
      </dl>
      {rest.length ? <ul className="case__stats">{rest.map((s) => <li key={s.label}><b className="num">{s.value}</b>{s.label}</li>)}</ul> : null}
      <span className="tlink case__more">Read the case<Arrow size={15} /></span>
    </article>
  )
}
