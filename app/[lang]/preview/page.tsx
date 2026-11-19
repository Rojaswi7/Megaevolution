// Index of every logged-in preview screen. noindex, and blocked in robots.txt.
import Link from 'next/link'
import '@/styles/wsa.css'
import { href } from '@/data/site'
import { ACCOUNTS } from '@/data/accounts'
import { PREVIEW_LINKS } from '@/data/workspaceAgency'
import { pageMeta } from '@/lib/seo'
import { Breadcrumbs, TLink } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { SignInAs } from '@/components/workspace/brand/SignInAs'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/preview', title: 'Logged-in previews', description: 'Every logged-in screen of the MegaEvolution mockup, by role, with dummy accounts.', noindex: true })
}

const NAMES: Record<string, string> = { brand: 'Brand workspace', agency: 'Agency workspace', creator: 'Creator dashboard', mcn: 'MCN workspace', editor: 'Editor workspace' }

export default async function PreviewIndex({ params }: P) {
  const { lang } = await params
  return (
    <div className="wrap">
      <Breadcrumbs lang={lang} items={[{ name: 'Logged-in previews', path: '/preview' }]} />
      <header className="phero">
        <p className="eyebrow">Logged-in previews · sample data</p>
        <h1 className="h1">Every screen<span className="it">behind the login.</span></h1>
        <p className="lede">Five dummy accounts, one per role. Sign in with one click and walk the whole flow. Nothing is saved outside this browser, and these pages are hidden from search engines.</p>
        <div className="phero__cta"><TLink lang={lang} to="/login" cta="preview_index_all_logins">See all demo logins</TLink></div>
      </header>
      <div className="wa-idx">
        {ACCOUNTS.map((a) => (
          <section className="wa-idx__card" key={a.role} aria-labelledby={`pv-${a.role}`}>
            <div className="wa-idx__acct">
              <span className={`av tone-${a.tone === 0 || a.tone === 5 ? 1 : a.tone}`}>{a.initial}</span>
              <div><h2 id={`pv-${a.role}`}><b>{NAMES[a.role]}</b></h2><small>{a.name} · {a.org}</small></div>
            </div>
            <p className="muted small">{a.blurb}</p>
            <p><code>{a.email}</code> <code>{a.password}</code></p>
            <div><SignInAs lang={lang} role={a.role} /></div>
            <nav className="wa-idx__links" aria-label={`${NAMES[a.role]} screens`}>
              {PREVIEW_LINKS[a.role].map((l) => (
                <Link key={l.label} href={href(lang, `/preview/${a.role}${l.tab ? `?tab=${l.tab}` : ''}`)} prefetch={false} data-cta={`preview_index_${a.role}_${l.tab || 'open'}`}>
                  {l.label}<Icon name="chevronRight" size={15} />
                </Link>
              ))}
            </nav>
          </section>
        ))}
      </div>
    </div>
  )
}
