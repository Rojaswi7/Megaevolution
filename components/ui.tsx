// Small server-safe building blocks shared by every page.
import Link from 'next/link'
import { href } from '@/data/site'
import { Arrow, Icon } from './Icon'
import { breadcrumbLd, faqLd } from '@/lib/seo'

/** JSON-LD script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}

type CtaProps = {
  lang: string; to: string; cta: string // `cta` is the analytics id → data-cta
  children: React.ReactNode; variant?: 'accent' | 'dark' | 'ghost' | 'white'; size?: 'sm' | 'md' | 'lg'
  arrow?: boolean; block?: boolean; className?: string; ariaLabel?: string
}
/** The one button. Every instance carries data-cta, which TrackClicks turns into a track() call. */
export function Cta({ lang, to, cta, children, variant = 'accent', size = 'md', arrow = true, block, className = '', ariaLabel }: CtaProps) {
  const cls = ['btn', variant !== 'accent' && `btn--${variant}`, size !== 'md' && `btn--${size}`, block && 'btn--block', className].filter(Boolean).join(' ')
  return (
    <Link href={href(lang, to)} className={cls} data-cta={cta} aria-label={ariaLabel} prefetch={false}>
      {children}{arrow ? <Arrow /> : null}
    </Link>
  )
}

/** Underlined text link with a steady arrow. */
export function TLink({ lang, to, cta, children, className = '' }: { lang: string; to: string; cta: string; children: React.ReactNode; className?: string }) {
  return <Link href={href(lang, to)} className={`tlink ${className}`} data-cta={cta} prefetch={false}>{children}<Arrow size={15} /></Link>
}

/** Section header: spaced uppercase eyebrow, bold line + italic serif second line. `title` uses "|" to split the lines. */
export function SectionHead({ eyebrow, title, children, as: H = 'h2', center, id }: { eyebrow?: string; title: string; children?: React.ReactNode; as?: 'h1' | 'h2'; center?: boolean; id?: string }) {
  const [a, b] = title.split('|')
  return (
    <div className={`shead ${center ? 'shead--center' : ''}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <H className={`${H === 'h1' ? 'h1' : 'h2'} shead__title`} id={id}>{a}{b ? <span className="it">{b}</span> : null}</H>
      </div>
      {children ? <div className="shead__note">{children}</div> : null}
    </div>
  )
}

export function Breadcrumbs({ lang, items }: { lang: string; items: { name: string; path: string }[] }) {
  const all = [{ name: 'Home', path: '/' }, ...items]
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        {all.map((it, i) => (
          <span key={it.path} style={{ display: 'contents' }}>
            {i > 0 && <Icon name="chevronRight" size={12} />}
            {i < all.length - 1 ? <Link href={href(lang, it.path)} prefetch={false}>{it.name}</Link> : <span aria-current="page">{it.name}</span>}
          </span>
        ))}
      </nav>
      <JsonLd data={breadcrumbLd(lang, all)} />
    </>
  )
}

/** FAQ block. Always ships FAQPage JSON-LD with it. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <>
      <div className="faq">
        {items.map((f) => (
          <details key={f.q}>
            <summary>{f.q}<Icon name="plus" size={20} /></summary>
            <p className="faq__a">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqLd(items)} />
    </>
  )
}

/** Roadmap status. Hidden unless "Show roadmap tags" is on in the review dock. */
export function RoadmapTag({ status }: { status: 'live' | 'dev' | 'planned' }) {
  const label = { live: 'Live', dev: 'In development', planned: 'Planned' }[status]
  return <span className={`rtag rtag--${status}`}>{label}</span>
}

/** Trust items shown next to every payment button. Values come from data/pricing.ts. */
export function Trust({ items, row }: { items: { icon: string; text: React.ReactNode }[]; row?: boolean }) {
  return (
    <ul className={`trust ${row ? 'trust--row' : ''}`}>
      {items.map((t, i) => <li key={i}><Icon name={t.icon} size={16} />{t.text}</li>)}
    </ul>
  )
}

/** Neutral image placeholder. Real photography replaces these — never AI imagery. */
export function Todo({ label = 'TODO: real photo', ratio = '4 / 3', className = '' }: { label?: string; ratio?: string; className?: string }) {
  return <div className={`todo ${className}`} style={{ aspectRatio: ratio }} role="img" aria-label={label}><span>{label}</span></div>
}

/** Mobile bottom CTA bar. Its label changes per page (prompt section 5). */
export function StickyCta({ lang, to, cta, label, note }: { lang: string; to: string; cta: string; label: string; note?: string }) {
  return (
    <div className="sticky">
      {note ? <span className="sticky__note">{note}</span> : null}
      <Link href={href(lang, to)} className="btn" data-cta={`sticky_${cta}`} prefetch={false}>{label}<Arrow /></Link>
    </div>
  )
}

export function Stat({ value, label }: { value: string; label: string }) {
  return <div className="stat"><b>{value}</b><span>{label}</span></div>
}
