// Logged-in preview: creator dashboard for the dummy account @minh.beauty. noindex.
import { pageMeta } from '@/lib/seo'
import { creatorByHandle, CREATORS } from '@/data/creators'
import { CREATOR_CHATS, CREATOR_ALERTS, CREATOR_SAVED } from '@/data/workspace-b'
import WorkspaceShell, { type WsTab } from '@/components/workspace/Shell'
import { Inbox, Alerts, Saved } from '@/components/workspace/common-b'
import { CreatorHome, CreatorProfile, CreatorRates, CreatorRanking, CreatorOrders, CreatorScripts, CreatorPdfs, CreatorEarnings } from '@/components/workspace/creator/screens'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/preview/creator', title: 'Creator workspace (preview)', description: 'Logged-in preview of the creator dashboard with sample data.', noindex: true })
}

export default async function CreatorWorkspace({ params }: P) {
  const { lang } = await params
  const c = creatorByHandle['minh.beauty'] || CREATORS[0]
  const tabs: WsTab[] = [
    { id: 'home', label: 'Dashboard', icon: 'home', status: 'dev', content: <CreatorHome c={c} lang={lang} /> },
    { id: 'orders', label: 'Orders', icon: 'inbox', badge: 3, status: 'live', content: <CreatorOrders lang={lang} /> },
    { id: 'messages', label: 'Messages', icon: 'message', badge: 2, status: 'live', content: <Inbox role="creator" title="Messages" sub="Chats with brands and your MCN." chats={CREATOR_CHATS} /> },
    { id: 'profile', label: 'Profile', icon: 'user', group: 'My page', status: 'dev', content: <CreatorProfile c={c} lang={lang} /> },
    { id: 'rates', label: 'My Rates', icon: 'card', group: 'My page', status: 'dev', content: <CreatorRates /> },
    { id: 'ranking', label: 'Brand ranking', icon: 'chart', group: 'My page', status: 'planned', content: <CreatorRanking /> },
    { id: 'scripts', label: 'Script Studio', icon: 'pen', group: 'Tools', status: 'planned', content: <CreatorScripts lang={lang} /> },
    { id: 'pdfs', label: 'PDF exports', icon: 'download', group: 'Tools', status: 'planned', content: <CreatorPdfs lang={lang} /> },
    { id: 'earnings', label: 'Earnings', icon: 'bag', group: 'Money', status: 'dev', content: <CreatorEarnings /> },
    { id: 'lists', label: 'Saved', icon: 'bookmark', group: 'More', content: <Saved sub="Briefs, guides and hooks you kept." items={CREATOR_SAVED} /> },
    { id: 'alerts', label: 'Alerts', icon: 'bell', group: 'More', badge: CREATOR_ALERTS.length, content: <Alerts items={CREATOR_ALERTS} /> },
  ]
  return (
    <>
      <div className="wrap wb-top"><h1>Creator workspace</h1><p>Logged-in preview · sample data · not indexed</p></div>
      <WorkspaceShell lang={lang} role="creator" title="Creator workspace" tabs={tabs} />
    </>
  )
}
