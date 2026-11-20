'use client'
// Prices in the visitor's currency. Server HTML always carries the USD value
// (so crawlers see a price), and the client swaps it after hydration.
import { useApp } from './AppState'
import { CURRENCIES, formatAmount, type Amount, type Currency } from '@/data/pricing'
import { track } from '@/lib/track'

export function Money({ usd, per, from }: { usd: Amount | null | undefined; per?: string; from?: boolean }) {
  const { currency } = useApp()
  return (
    <span className="money tnum" data-usd={typeof usd === 'number' ? usd : 'TBD'} suppressHydrationWarning>
      {from ? 'from ' : ''}{formatAmount(usd, currency)}{per ? <span className="money__per">{per}</span> : null}
    </span>
  )
}

export function CurrencySwitch({ label = 'Currency', id = 'cur' }: { label?: string; id?: string }) {
  const { currency, setCurrency } = useApp()
  return (
    <span className="sel">
      <label className="sr" htmlFor={id}>{label}</label>
      <select id={id} value={currency} onChange={(e) => { setCurrency(e.target.value as Currency); track('cta_click', { cta: 'currency_switch', value: e.target.value }) }}>
        {Object.keys(CURRENCIES).map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </span>
  )
}
