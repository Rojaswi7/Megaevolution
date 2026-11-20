'use client'
// Header popover: every language as a row (native name + English), currency as three symbol buttons.
import { LOCALES, LOCALE_NAMES, href } from '@/data/site'
import { CURRENCIES, type Currency } from '@/data/pricing'
import { useApp } from './AppState'
import { Icon } from './Icon'
import { track } from '@/lib/track'

const IN_ENGLISH: Record<string, string> = { en: '', ko: 'Korean', ja: 'Japanese', zh: 'Chinese', vi: 'Vietnamese' }

function barePath() {
  const m = window.location.pathname.match(/^\/(ko|ja|zh|vi)(\/.*)?$/)
  return m ? m[2] || '/' : window.location.pathname
}

export default function LocalePicker({ lang, labels }: { lang: string; labels: { language: string; currency: string } }) {
  const { currency, setCurrency } = useApp()
  const pickLang = (l: string) => {
    if (l === lang) return
    track('language_changed', { to: l })
    window.location.href = href(l, barePath()) + window.location.search
  }
  const pickCur = (c: Currency) => { setCurrency(c); track('cta_click', { cta: 'currency_switch', value: c }) }

  return (
    <div className="lp">
      <p className="lp__k">{labels.language}</p>
      <ul className="lp__langs" role="radiogroup" aria-label={labels.language}>
        {LOCALES.map((l) => (
          <li key={l}>
            <button role="radio" aria-checked={l === lang} lang={l} onClick={() => pickLang(l)}>
              <span className="lp__code">{l.toUpperCase()}</span>
              <span className="lp__name">{LOCALE_NAMES[l]}{IN_ENGLISH[l] ? <small>{IN_ENGLISH[l]}</small> : null}</span>
              <span className="lp__tick" aria-hidden="true"><Icon name="check" size={14} stroke={2.4} /></span>
            </button>
          </li>
        ))}
      </ul>
      <p className="lp__k">{labels.currency}</p>
      <div className="lp__cur" role="radiogroup" aria-label={labels.currency}>
        {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
          <button key={c} role="radio" aria-checked={c === currency} onClick={() => pickCur(c)} title={CURRENCIES[c].label}>
            <b>{CURRENCIES[c].symbol}</b>{c}
          </button>
        ))}
      </div>
      <p className="lp__note">Prices on the site show in this currency.</p>
    </div>
  )
}
