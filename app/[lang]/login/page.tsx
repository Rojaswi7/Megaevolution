// Login in the new look. Lists every dummy account as a one-click card so each role's
// flow can be walked with dummy data. noindex.
import '@/styles/content.css'
import { pageMeta } from '@/lib/seo'
import { RoadmapTag } from '@/components/ui'
import { DemoAccounts, LoginForm } from '@/components/content/Auth'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/login', title: 'Log In', description: 'Log in to MegaEvolution. In this mockup, pick a dummy account for any role: brand, agency, creator, MCN or editor.', noindex: true })
}

export default async function LoginPage({ params }: P) {
  const { lang } = await params
  return (
    <div className="wrap ct-auth">
      <section className="ct-auth__form">
        <div>
          <p className="eyebrow">Welcome back <RoadmapTag status="dev" /></p>
          <h1 style={{ marginTop: 14 }}>Log in<span className="it">to your workspace.</span></h1>
        </div>
        <LoginForm lang={lang} />
      </section>
      <section className="slab ct-auth__side" aria-labelledby="demo-h">
        <p className="eyebrow">Mockup · dummy accounts</p>
        <h2 id="demo-h">One click signs you in as any role.</h2>
        <p className="muted small">Nothing is checked against a server. The account stays in this browser until you log out.</p>
        <DemoAccounts lang={lang} />
      </section>
    </div>
  )
}
