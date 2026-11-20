'use client'
// Search-first header. Top row: logo · ⌘K search · currency · language · log in · one lime CTA.
// Second row: the nav. Logged in (dummy accounts), it adds alerts, saved, messages and the org menu.
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { NAV, LOCALES, LOCALE_NAMES, href } from '@/data/site'
import type { Dict } from '@/data/i18n'
import { Icon, Arrow } from './Icon'
import { CurrencySwitch } from './Money'
import { useApp, useAccount, canSeeAgencyOrders } from './AppState'
import { track } from '@/lib/track'

const CommandPalette = dynamic(() => import('./CommandPalette'), { ssr: false })

/** Current path without the locale prefix, e.g. "/ko/creators" -> "/creators". */
function barePath() {
  const p = window.location.pathname
  const m = p.match(/^\/(ko|ja|zh|vi)(\/.*)?$/)
  return m ? m[2] || '/' : p
}

export function LangSwitch({ lang, label, id = 'lang' }: { lang: string; label: string; id?: string }) {
  return (
    <span className="sel">
      <label className="sr" htmlFor={id}>{label}</label>
      <select id={id} value={lang} onChange={(e) => { track('language_changed', { to: e.target.value }); window.location.href = href(e.target.value, barePath()) + window.location.search }}>
        {LOCALES.map((l) => <option key={l} value={l}>{LOCALE_NAMES[l]}</option>)}
      </select>
    </span>
  )
}

export default function Header({ lang, dict }: { lang: string; dict: Dict }) {
  const [stuck, setStuck] = useState(false)
  const [palette, setPalette] = useState(false)
  const [menu, setMenu] = useState(false)
  // the header lives in the layout and survives client navigation, so read the path on every route change
  const pathname = usePathname() || '/'
  const path = pathname.replace(/^\/(ko|ja|zh|vi)(?=\/|$)/, '') || '/'
  const moreRef = useRef<HTMLDetailsElement>(null)
  const locRef = useRef<HTMLDetailsElement>(null)
  const closeMenus = () => { moreRef.current?.removeAttribute('open'); locRef.current?.removeAttribute('open') }
  const [mac, setMac] = useState(true)
  const { role, setRole, saved, currency } = useApp()
  const account = useAccount()

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform))
    const onScroll = () => setStuck(window.scrollY > 8)
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette(true); track('search_opened', { via: 'shortcut' }) }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey) }
  }, [])
  useEffect(() => { document.body.style.overflow = menu || palette ? 'hidden' : '' }, [menu, palette])

  const openSearch = (via: string) => { setPalette(true); track('search_opened', { via }) }
  // close the More and language menus on navigation, on a click outside them, and on Escape
  useEffect(() => { closeMenus(); setMenu(false) }, [pathname])
  useEffect(() => {
    const outside = (e: MouseEvent) => {
      const t = e.target as Node
      if (moreRef.current && !moreRef.current.contains(t)) moreRef.current.removeAttribute('open')
      if (locRef.current && !locRef.current.contains(t)) locRef.current.removeAttribute('open')
    }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenus() }
    document.addEventListener('mousedown', outside)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', esc) }
  }, [])

  const isCurrent = (p: string) => path === p || (p !== '/' && path.startsWith(p + '/'))
  const nav = NAV.map((n) => ({ ...n, label: dict.nav[n.key] }))

  return (
    <>
      <a className="skip" href="#main">{dict.skip}</a>
      <header className={`hdr ${stuck ? 'is-stuck' : ''}`}>
        <div className="wrap hdr__row">
          <Link href={href(lang, '/')} className="hdr__logo" aria-label="MegaEvolution home" data-cta="logo_home">
            <img src="/logo-deck.png" alt="MegaEvolution" width={164} height={24} />
          </Link>

          <nav className="hdr__nav" aria-label="Main">
            {nav.filter((n) => ['creators', 'tools', 'video', 'agency', 'markets'].includes(n.key)).map((n) => (
              <Link key={n.key} href={href(lang, n.path)} aria-current={isCurrent(n.path) ? 'page' : undefined} data-cta={`nav_${n.key}`}>{n.label}</Link>
            ))}
            <details className="hdr__morenav" ref={moreRef}>
              <summary>More<Icon name="chevron" size={14} /></summary>
              <div className="hdr__menu" onClick={closeMenus}>
                <Link href={href(lang, '/connect-ai')} data-cta="nav_ai"><Icon name="plug" size={16} />{dict.nav.ai}<span className="tag tag--accent">{dict.new}</span></Link>
                <Link href={href(lang, '/case-studies')} data-cta="nav_cases"><Icon name="chart" size={16} />Case studies</Link>
                <Link href={href(lang, '/pricing')} data-cta="nav_pricing"><Icon name="card" size={16} />Pricing</Link>
                <Link href={href(lang, '/blog')} data-cta="nav_blog"><Icon name="file" size={16} />{dict.nav.blog}</Link>
                <Link href={href(lang, '/help')} data-cta="nav_help"><Icon name="message" size={16} />Help center</Link>
                <Link href={href(lang, '/for-creators')} data-cta="nav_for_creators"><Icon name="user" size={16} />For creators</Link>
              </div>
            </details>
            {canSeeAgencyOrders(role) && <Link href={href(lang, `/preview/${role}?tab=agency-orders`)} data-cta="nav_agency_orders">Agency Orders</Link>}
          </nav>

          <div className="hdr__tools">
            <button className="hdr__search" onClick={() => openSearch('header')} data-cta="header_search" aria-label={dict.searchPlaceholder}>
              <Icon name="search" size={18} />
            </button>
            <details className="hdr__loc" ref={locRef}>
              <summary aria-label={`${dict.language} / ${dict.currency}`} title={`${dict.language} · ${dict.currency}`}><Icon name="globe" size={18} /></summary>
              <div className="hdr__pop">
                <label><span>{dict.language}</span><LangSwitch lang={lang} label={dict.language} /></label>
                <label><span>{dict.currency}</span><CurrencySwitch label={dict.currency} /></label>
              </div>
            </details>
            {account ? (
              <>
                <Link className="hdr__icon" href={href(lang, `/preview/${role}?tab=alerts`)} aria-label="Alerts" data-cta="header_alerts"><Icon name="bell" /><i>3</i></Link>
                <Link className="hdr__icon" href={href(lang, `/preview/${role}?tab=lists`)} aria-label="Saved creators" data-cta="header_saved"><Icon name="bookmark" />{saved.length ? <i>{saved.length}</i> : null}</Link>
                <Link className="hdr__icon" href={href(lang, `/preview/${role}?tab=messages`)} aria-label="Messages" data-cta="header_messages"><Icon name="message" /><i>2</i></Link>
                <Link className="hdr__acct" href={href(lang, account.home)} data-cta="header_org_menu" title={`${account.name} · ${account.org} · My workspace`} aria-label={`My workspace: ${account.org}`}>
                  <span className={`av tone-${account.tone}`}>{account.initial}</span>
                </Link>
              </>
            ) : (
              <Link className="hdr__tool hdr__login" href={href(lang, '/login')} data-cta="header_login">{dict.login}</Link>
            )}
            <Link className="btn btn--sm hdr__cta" href={href(lang, '/about-agency#inquiry')} data-cta="header_request_campaign">{dict.request}<Arrow size={14} /></Link>
          </div>

          <div className="hdr__mob">
            <button className="hdr__icon" onClick={() => openSearch('mobile_icon')} aria-label={dict.searchCreators} data-cta="header_search_mobile"><Icon name="search" size={21} /></button>
            <button className="hdr__icon" onClick={() => setMenu(true)} aria-label={dict.menu} aria-expanded={menu}><Icon name="menu" size={22} /></button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="sheet" role="dialog" aria-modal="true" aria-label={dict.menu}>
          <div className="sheet__top">
            <img src="/logo-black.png" alt="MegaEvolution" width={142} height={21} />
            <button className="hdr__icon" onClick={() => setMenu(false)} aria-label={dict.close}><Icon name="close" size={22} /></button>
          </div>
          <nav className="sheet__nav" aria-label="Main" onClick={() => setMenu(false)}>
            {nav.map((n) => (
              <Link key={n.key} href={href(lang, n.path)} data-cta={`mnav_${n.key}`}>
                <span>{n.label} {'isNew' in n && n.isNew ? <span className="tag tag--accent">{dict.new}</span> : null}</span><Icon name="chevronRight" size={18} />
              </Link>
            ))}
            {canSeeAgencyOrders(role) && <Link href={href(lang, `/preview/${role}?tab=agency-orders`)} data-cta="mnav_agency_orders"><span>Agency Orders</span><Icon name="chevronRight" size={18} /></Link>}
            {account && <Link href={href(lang, account.home)} data-cta="mnav_workspace"><span>My workspace</span><Icon name="chevronRight" size={18} /></Link>}
          </nav>
          <div className="sheet__foot">
            <div className="sheet__row"><CurrencySwitch label={dict.currency} id="cur-m" /><LangSwitch lang={lang} label={dict.language} id="lang-m" /></div>
            <div className="sheet__row" onClick={() => setMenu(false)}>
              {account
                ? <button className="btn btn--ghost" onClick={() => setRole('guest')} data-cta="mnav_logout">Log out</button>
                : <Link className="btn btn--ghost" href={href(lang, '/login')} data-cta="mnav_login">{dict.login}</Link>}
              <Link className="btn" href={href(lang, '/about-agency#inquiry')} data-cta="mnav_request_campaign">{dict.request}</Link>
            </div>
          </div>
        </div>
      )}

      {palette && <CommandPalette lang={lang} dict={dict} onClose={() => setPalette(false)} />}
    </>
  )
}
