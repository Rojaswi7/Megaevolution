'use client'
// Tools on the home page: pick a tool on the left, see a small working picture of it on the right.
// All five tools and their links are in the HTML; the preview just swaps.
import Link from 'next/link'
import { useState } from 'react'
import { href } from '@/data/site'
import { TOOLS } from '@/data/tools'
import { TOOL_FROM } from '@/data/pricing'
import { Icon, Arrow, PlatformIcon } from '../Icon'
import { Money } from '../Money'
import { track } from '@/lib/track'

const ICONS = ['list', 'chart', 'film', 'bag', 'pen']

function Preview({ slug }: { slug: string }) {
  if (slug === 'ai-listup') {
    return (
      <div className="tsx__ui">
        <p className="tsx__brief">“Vietnamese beauty creators, 100K+, no competitor posts in 90 days”</p>
        <div className="tsx__rules"><span className="is-must">Must · Beauty</span><span className="is-must">Must · Vietnam</span><span className="is-nice">Nice · 5%+ eng.</span><span className="is-avoid">Avoid · competitor posts</span></div>
        <ul className="tsx__rows">
          {[['minh.beauty', '250K', 'Passed 4 of 4'], ['linh.glow', '3.1M', 'Passed 4 of 4'], ['thao.skincare', '120K', 'Passed 3 of 4']].map(([h, f, r], i) => (
            <li key={h}><span className={`av tone-${[3, 2, 7][i]}`}>{h[0].toUpperCase()}</span><b>@{h}</b><small>{f}</small><em>{r}</em></li>
          ))}
        </ul>
        <p className="tsx__hint"><Icon name="sparkle" size={14} />+6 creators if you relax “100K+”</p>
      </div>
    )
  }
  if (slug === 'performance-report') {
    return (
      <div className="tsx__ui">
        <div className="tsx__kpis"><div><b>1.9M</b><span>views</span></div><div><b>6.1%</b><span>engagement</span></div><div><b>12</b><span>posts</span></div></div>
        <div className="tsx__bars" role="img" aria-label="Sample chart: views per platform">
          {[['TikTok', 86], ['Instagram', 58], ['YouTube', 41]].map(([p, w]) => <div key={p}><span><PlatformIcon name={String(p)} size={14} />{p}</span><i style={{ width: `${w}%` }} /></div>)}
        </div>
        <p className="tsx__hint"><Icon name="download" size={14} />Client PDF, your logo, no tool branding</p>
      </div>
    )
  }
  if (slug === 'ai-video-edit') {
    return (
      <div className="tsx__ui">
        <div className="tsx__frames">{['Hook', 'Problem', 'Demo', 'Proof', 'CTA'].map((s, i) => <div key={s} className={`tone-${[1, 5, 2, 4, 0][i]}`}><small>0{i + 1}</small><b>{s}</b></div>)}</div>
        <div className="tsx__rules"><span className="is-must">Style · Fast cuts</span><span className="is-nice">Korean</span><span className="is-nice">Japanese</span><span className="is-nice">English</span></div>
        <p className="tsx__hint"><Icon name="play" size={13} />Voice previews before you render</p>
      </div>
    )
  }
  if (slug === 'commerce-data') {
    return (
      <div className="tsx__ui">
        <ul className="tsx__rows tsx__rows--blur" aria-hidden="true">
          {[['creator', 'GMV', 'Units'], ['@•••••••', '₫•••M', '•,•••'], ['@•••••', '₱•••K', '•••'], ['@••••••••', '₫••M', '•,•••']].map((r, i) => <li key={i}><b>{r[0]}</b><small>{r[1]}</small><em>{r[2]}</em></li>)}
        </ul>
        <p className="tsx__hint"><Icon name="lock" size={14} />TikTok Shop sales per creator · Vietnam and the Philippines first</p>
      </div>
    )
  }
  return (
    <div className="tsx__ui">
      <p className="tsx__brief">Hook bank · Beauty</p>
      <ul className="tsx__hooks"><li>“I stopped buying toner. Here’s why.”</li><li>“Three things I’d buy again, one I wouldn’t.”</li><li>“My skin at 7am, no filter.”</li></ul>
      <div className="tsx__rules"><span className="is-must">Disclosure · OK</span><span className="is-must">Claims · OK</span><span className="is-avoid">Flag · competitor named</span></div>
    </div>
  )
}

export default function ToolsShowcase({ lang }: { lang: string }) {
  const [on, setOn] = useState(0)
  const t = TOOLS[on]
  const pick = (i: number) => { setOn(i); track('cta_click', { cta: 'home_tool_tab', tool: TOOLS[i].slug }) }
  return (
    <div className="tw">
      <div className="tw__bar">
        <span className="tw__dots" aria-hidden="true"><i /><i /><i /></span>
        <div className="tw__tabs scroller" role="group" aria-label="Tools">
          {TOOLS.map((x, i) => (
            <button key={x.slug} className={i === on ? 'is-on' : ''} aria-pressed={i === on} onClick={() => pick(i)}>
              <Icon name={ICONS[i]} size={15} />{x.name}{x.comingSoon ? <em>Soon</em> : null}
            </button>
          ))}
        </div>
      </div>
      <div className="tw__url"><Icon name="lock" size={12} /><span>megaevolution.io/tools/<b>{t.slug}</b></span></div>
      <div className="tw__body">
        <div key={t.slug} className="tw__screen"><Preview slug={t.slug} /></div>
        <aside className="tw__info">
          <span className={'rtag rtag--' + t.status}>{{ live: 'Live', dev: 'In development', planned: 'Planned' }[t.status]}</span>
          <h3>{t.name}</h3>
          <p className="tw__job">{t.job}</p>
          <ol className="tw__steps">{t.steps.slice(0, 3).map((st, i) => <li key={st.title}><i>{i + 1}</i><b>{st.title}</b></li>)}</ol>
          <div className="tw__buy">
            <span><small>Plans</small><b><Money usd={TOOL_FROM[t.slug]} from per="/mo" /></b><small>or pay per use</small></span>
            <Link className="btn" href={href(lang, '/tools/' + t.slug)} data-cta={'home_tool_open_' + t.slug} prefetch={false}>{t.comingSoon ? 'Join waitlist' : 'Try ' + t.name}<Arrow size={15} /></Link>
          </div>
          <Link className="tw__all" href={href(lang, '/tools')} data-cta="home_all_tools" prefetch={false}>See all tools &amp; plans<Arrow size={14} /></Link>
        </aside>
      </div>
    </div>
  )
}
