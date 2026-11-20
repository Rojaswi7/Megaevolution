// FAQ as numbered answer cards, with a contact card beside them. Native <details>, so it
// works without JavaScript, and FAQPage JSON-LD ships with it.
import Link from 'next/link'
import { href, CONTACT_EMAIL } from '@/data/site'
import { faqLd } from '@/lib/seo'
import { JsonLd } from '../ui'
import { Icon, Arrow } from '../Icon'

export default function FaqCards({ lang, items, title = 'Before you|ask us.' }: { lang: string; items: { q: string; a: string }[]; title?: string }) {
  const [t1, t2] = title.split('|')
  return (
    <div className="fq">
      <div className="fq__side">
        <p className="eyebrow">FAQ</p>
        <h2 className="h2">{t1}{t2 ? <span className="it">{t2}</span> : null}</h2>
        <div className="fq__ask">
          <span className="fq__ico"><Icon name="message" size={22} /></span>
          <b>Still have a question?</b>
          <p>A campaign manager answers within one business day, in your language.</p>
          <Link className="btn btn--sm" href={href(lang, '/about-agency#inquiry')} data-cta="faq_ask_us">Ask us<Arrow size={14} /></Link>
          <span className="fq__mail">{CONTACT_EMAIL}</span>
        </div>
      </div>
      <div className="fq__list">
        {items.map((f, i) => (
          <details key={f.q} className="fq__item" open={i === 0}>
            <summary>
              <span className="fq__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="fq__q">{f.q}</span>
              <span className="fq__tg" aria-hidden="true"><Icon name="plus" size={18} /></span>
            </summary>
            <p className="fq__a">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqLd(items)} />
    </div>
  )
}
