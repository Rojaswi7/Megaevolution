// Sign-up in the new look. With ?mcn=<slug> (an MCN invite) it shows
// "Join {MCN} as my MCN", ticked by default. noindex.
import '@/styles/content.css'
import { pageMeta } from '@/lib/seo'
import { RoadmapTag } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { SignupForm } from '@/components/content/Auth'
import { PROOF } from '@/data/site'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/signup', title: 'Sign Up Free', description: 'Create a free MegaEvolution account as a brand, agency, creator or MCN.', noindex: true })
}

const GET = ['Save creators to lists and share them with your team', 'More audience breakdowns every day', 'Order creator packages and edited videos', 'One login for search, tools and orders']

export default async function SignupPage({ params }: P) {
  const { lang } = await params
  return (
    <div className="wrap ct-auth">
      <section className="ct-auth__form">
        <div>
          <p className="eyebrow">Free account <RoadmapTag status="dev" /></p>
          <h1 style={{ marginTop: 14 }}>Sign up<span className="it">in under a minute.</span></h1>
        </div>
        <SignupForm lang={lang} />
      </section>
      <section className="slab ct-auth__side">
        <p className="eyebrow">What you get</p>
        <h2>Free to start. Pay only when you order.</h2>
        <ul className="ticks" style={{ marginTop: 6 }}>{GET.map((g) => <li key={g}><Icon name="check" size={16} />{g}</li>)}</ul>
        <div className="row" style={{ gap: '18px 36px', marginTop: 18 }}>
          <div className="stat"><b>{PROOF.creators}</b><span>creators worked with</span></div>
          <div className="stat"><b>{PROOF.views}</b><span>views</span></div>
        </div>
        <p className="muted small" style={{ marginTop: 10 }}>Mockup: submitting signs you in as the dummy account for the role you picked. Nothing is sent.</p>
      </section>
    </div>
  )
}
