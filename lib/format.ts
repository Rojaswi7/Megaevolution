import { CREATOR_FX } from '@/data/pricing'

/** 1250000 -> "1.3M", 48200 -> "48K" */
export function compact(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '')}M`
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`
  return String(n)
}

const SYMBOL: Record<string, string> = { USD: '$', KRW: '₩', JPY: '¥', CNY: 'CN¥', VND: '₫', THB: '฿', IDR: 'Rp', PHP: '₱', MXN: 'MX$', BRL: 'R$', EUR: '€' }

/** A creator's own-currency amount: 3500000 VND -> "₫3.5M", 150000 KRW -> "₩150,000" */
export function localMoney(amount: number, currency: string) {
  const s = SYMBOL[currency] || `${currency} `
  if (amount >= 1e6) return `${s}${(amount / 1e6).toFixed(amount >= 1e7 ? 0 : 1).replace(/\.0$/, '')}M`
  return `${s}${Math.round(amount).toLocaleString('en-US')}`
}

export const toUsd = (amount: number, currency: string) => amount / (CREATOR_FX[currency] || 1)

export const fmtDate = (iso: string) => new Date(iso + (iso.length === 10 ? 'T00:00:00Z' : '')).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
