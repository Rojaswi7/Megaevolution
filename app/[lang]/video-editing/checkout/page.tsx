// Studio checkout (mock). noindex and blocked in robots.txt.
import '@/styles/studio.css'
import { pageMeta } from '@/lib/seo'
import { Breadcrumbs } from '@/components/ui'
import Checkout from '@/components/studio/Checkout'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/video-editing/checkout', title: 'Order a Video — Checkout', description: 'Order edited videos from the Video Editing Studio: choose short or long videos, pay by card and send your brief.', noindex: true })
}

export default async function CheckoutPage({ params }: P) {
  const { lang } = await params
  return (
    <div className="wrap st-co">
      <Breadcrumbs lang={lang} items={[{ name: 'Video Editing Studio', path: '/video-editing' }, { name: 'Checkout', path: '/video-editing/checkout' }]} />
      <header className="st-co__head">
        <p className="eyebrow">Video Editing Studio</p>
        <h1>Order a video</h1>
      </header>
      <Checkout lang={lang} />
    </div>
  )
}
