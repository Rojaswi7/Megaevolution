// Footer. Links every money page plus every market and category hub — these
// internal links are the backbone of the programmatic SEO pages.
import Link from 'next/link'
import { href, CONTACT_EMAIL, LOCALES, LOCALE_NAMES } from '@/data/site'
import type { Dict } from '@/data/i18n'
import { MARKETS } from '@/data/markets'
import { CATEGORIES } from '@/data/categories'
import { TOOLS } from '@/data/tools'
import { PlatformIcon } from './Icon'
import { NewsletterForm } from './forms'

export default function Footer({ lang, dict }: { lang: string; dict: Dict }) {
  const L = ({ to, children, cta }: { to: string; children: React.ReactNode; cta?: string }) => <Link href={href(lang, to)} prefetch={false} data-cta={cta}>{children}</Link>
  const cols: [string, [string, string][]][] = [
    ['Brands', [['Search creators', '/creators'], ['Agency', '/about-agency'], ['Video Editing Studio', '/video-editing'], ['Pricing', '/pricing'], ['Case studies', '/case-studies'], ['Request a campaign', '/about-agency#inquiry']]],
    ['Tools', [['All tools & plans', '/tools'], ...TOOLS.map((t): [string, string] => [t.name, `/tools/${t.slug}`]), ['Connect your AI', '/connect-ai']]],
    ['Creators & MCNs', [['For creators', '/for-creators'], ['Create your profile', '/signup?as=creator'], ['For MCNs', '/mcn'], ['Sample MCN page', '/mcn/lotus-talent'], ['Script Studio', '/tools/script-studio']]],
    ['Company', [['Help center', '/help'], ['Blog', '/blog'], ['Log in', '/login'], ['Sign up', '/signup']]],
  ]
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__news">
          <div>
            <h2>{dict.newsletterTitle}</h2>
            <p>{dict.newsletterText}</p>
          </div>
          <NewsletterForm source="footer" label={dict.emailLabel} cta={dict.newsletterCta} />
        </div>

        <div className="ftr__grid">
          <div className="ftr__brand">
            <img src="/logo-deck.png" alt="MegaEvolution" width={168} height={25} loading="lazy" />
            <p>{dict.footerTag}</p>
            <span className="ftr__mail">{CONTACT_EMAIL}</span>
            <div className="ftr__soc">
              {[['Instagram', 'https://www.instagram.com/megaevo1ution/'], ['TikTok', 'https://tiktok.com/@megaevo1ution'], ['YouTube', 'https://www.youtube.com/'], ['LinkedIn', 'https://www.linkedin.com/company/megaevolution/']].map(([n, u]) => (
                <a key={n} href={u} target="_blank" rel="noreferrer" aria-label={`MegaEvolution on ${n}`}><PlatformIcon name={n} size={16} mono /></a>
              ))}
            </div>
          </div>
          {cols.map(([h, links]) => (
            <nav className="ftr__col" key={h} aria-label={h}>
              <h3>{h}</h3>
              <ul>{links.map(([t, to]) => <li key={t}><L to={to} cta={`footer_${t.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`}>{t}</L></li>)}</ul>
            </nav>
          ))}
        </div>

        <nav className="ftr__line" aria-label="Creators by market">
          <span>Creators in</span>
          {MARKETS.map((m) => <L key={m.id} to={`/creators/${m.slug}`}>{m.short}</L>)}
        </nav>

        <div className="ftr__bot">
          <span>© 2026 MegaEvolution Inc. · Wilmington, DE, USA</span>
          <ul aria-label="Languages">
            {LOCALES.map((l) => <li key={l}><Link href={href(l, '/')} hrefLang={l} lang={l} prefetch={false}>{LOCALE_NAMES[l]}</Link></li>)}
          </ul>
          <ul>
            <li><L to="/help/terms">Terms</L></li>
            <li><L to="/help/privacy">Privacy</L></li>
            <li><L to="/help/cookies">Cookies</L></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
