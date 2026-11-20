'use client'
// The one agency inquiry form, with the market preselected from ?market=<slug>
// (market pages link here as /about-agency?market=vietnam#inquiry).
import { useEffect, useState } from 'react'
import { InquiryForm } from '@/components/forms'
import { marketBySlug } from '@/data/markets'

export default function InquirySection({ source = 'agency' }: { source?: string }) {
  const [market, setMarket] = useState<string | undefined>(undefined)
  useEffect(() => {
    const m = new URLSearchParams(window.location.search).get('market')
    if (m && marketBySlug[m]) setMarket(m)
  }, [])
  // key remounts the uncontrolled <select> once the market is known
  return <InquiryForm key={market || 'none'} source={source} market={market} />
}
