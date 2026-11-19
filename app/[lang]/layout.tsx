import type { Metadata, Viewport } from 'next'
import { Poppins, DM_Serif_Display } from 'next/font/google'
import { notFound } from 'next/navigation'
import '@/styles/globals.css'
import '@/styles/blocks.css'
import '@/styles/v2.css'
import '@/styles/v3.css'
import { LOCALES, SITE_URL, SITE_NAME } from '@/data/site'
import { getDict } from '@/data/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AppStateProvider } from '@/components/AppState'
import { TrackClicks, ReviewDock } from '@/components/client'

// Self-hosted at build time, latin subset, font-display: swap.
const sans = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-sans' })
const serif = DM_Serif_Display({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], display: 'swap', variable: '--font-serif' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  icons: { icon: '/icon.svg' },
}
export const viewport: Viewport = { themeColor: '#0E0D39', width: 'device-width', initialScale: 1 }

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}
export const dynamicParams = false

// Applies the saved theme / roadmap mode before paint, so there is no flash.
const BOOT = `try{var d=document.documentElement,s=localStorage;d.dataset.theme=s.getItem('me.theme')||'lime';d.dataset.roadmap=s.getItem('me.roadmap')==='1'?'on':'off'}catch(e){}`

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!(LOCALES as readonly string[]).includes(lang)) notFound()
  const dict = getDict(lang)
  return (
    <html lang={lang} data-theme="lime" data-roadmap="off" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: BOOT }} /></head>
      <body>
        <AppStateProvider>
          <Header lang={lang} dict={dict} />
          <main id="main">{children}</main>
          <Footer lang={lang} dict={dict} />
          <ReviewDock lang={lang} />
          <TrackClicks />
        </AppStateProvider>
      </body>
    </html>
  )
}
