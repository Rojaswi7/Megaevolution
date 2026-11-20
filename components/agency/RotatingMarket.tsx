'use client'
// Hero word that cycles through the markets we run. Screen readers and search engines get the
// full list once; the moving word is hidden from them. Reduced motion keeps the first market.
import { useEffect, useState } from 'react'

export default function RotatingMarket({ names, suffix = '' }: { names: string[]; suffix?: string }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((x) => (x + 1) % names.length), 2200)
    return () => clearInterval(t)
  }, [names.length])
  return (
    <>
      <span className="ag2-rot" aria-hidden="true"><span key={i}>{names[i]}{suffix}</span></span>
      <span className="sr">{names.slice(0, -1).join(', ')} or {names[names.length - 1]}{suffix}</span>
    </>
  )
}
