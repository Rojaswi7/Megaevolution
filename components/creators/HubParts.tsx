// Server pieces shared by /creators and the country / category hubs.
import Link from 'next/link'
import { href } from '@/data/site'
import { MARKETS, LOGO_PLATFORMS, type Market } from '@/data/markets'
import { CATEGORIES } from '@/data/categories'
import { creatorsIn, MIN_INDEXABLE } from '@/data/creators'
import { Flag, Icon, PlatformIcon, Arrow } from '../Icon'

/** Compact payload for the client-side explorer (drops fields the card does not show). */
export const slim = (list: any[]) => list.map(({ bio, captions, mcn, ...c }) => ({ ...c, bio: '', captions: [], mcn: null }))

export function MarketFacts({ m, lang }: { m: Market; lang: string }) {
  return (
    <div className="cr-facts">
      <div>
        <h3>What {m.short} watches</h3>
        <ol className="cr-rank">{m.watches.map((p, i) => <li key={p}><small>{i + 1}</small>{LOGO_PLATFORMS.includes(p) ? <PlatformIcon name={p} size={15} /> : null}{p}</li>)}</ol>
      </div>
      <div>
        <h3>Where {m.short} shops</h3>
        <ul className="cr-shops">{m.shops.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>
      <div>
        <h3>Local manager</h3>
        <p className="cr-mgr"><span role="img" aria-label="TODO: real photo"><Icon name="user" size={17} /></span><span><b>{m.manager.role}</b><small>{m.city} · photo TODO: real photo</small></span></p>
        <Link className="tlink" href={href(lang, `/about-agency?market=${m.slug}#inquiry`)} data-cta="hub_talk_to_manager" prefetch={false}>Talk to our {m.short} manager<Arrow size={15} /></Link>
      </div>
    </div>
  )
}

/** Category links for one country. Thin combos are still linked from here (their parent), just not indexed. */
export function CategoryLinks({ m, lang, current }: { m: Market; lang: string; current?: string }) {
  return (
    <ul className="cr-links">
      {CATEGORIES.map((c) => {
        const n = creatorsIn(m.id, c.slug).length
        return (
          <li key={c.slug}>
            <Link href={href(lang, `/creators/${m.slug}/${c.slug}`)} aria-current={current === c.slug ? 'page' : undefined} data-cta="hub_category_link" prefetch={false}>
              <Icon name={c.icon} size={16} /><span>{c.label} creators in {m.short}</span><small>{n}{n < MIN_INDEXABLE ? '' : ''}</small>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function CountryLinks({ lang, current, category, only }: { lang: string; current?: string; category?: string; only?: string[] }) {
  const list = only ? MARKETS.filter((m) => only.includes(m.slug)) : MARKETS
  return (
    <ul className="cr-links cr-links--flags">
      {list.map((m) => (
        <li key={m.id}>
          <Link href={href(lang, category ? `/creators/${m.slug}/${category}` : `/creators/${m.slug}`)} aria-current={current === m.slug ? 'page' : undefined} data-cta="hub_country_link" prefetch={false}>
            <Flag market={m.id} /><span>{category ? `${CATEGORIES.find((c) => c.slug === category)!.label} creators in ${m.short}` : `${m.adjective} creators`}</span>
            <small>{creatorsIn(m.id, category).length}</small>
          </Link>
        </li>
      ))}
    </ul>
  )
}
