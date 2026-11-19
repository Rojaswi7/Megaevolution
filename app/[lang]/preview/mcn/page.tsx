// Logged-in preview: MCN workspace for the dummy account Trang Lê (Lotus Talent). noindex.
import { pageMeta } from '@/lib/seo'
import { CREATORS, creatorByHandle } from '@/data/creators'
import { MCNS, mcnBySlug, rosterOf } from '@/data/mcns'
import { categoryBySlug } from '@/data/categories'
import { MCN_CHATS, MCN_ALERTS, MCN_SAVED, MCN_DEALS, CONTRACTS } from '@/data/workspace-b'
import WorkspaceShell, { type WsTab } from '@/components/workspace/Shell'
import { Inbox, Alerts, Saved } from '@/components/workspace/common-b'
import { McnHome, McnTalent, McnContracts, McnBuilder, McnPortal, McnAgencyOrders, McnBilling, type RosterRow } from '@/components/workspace/mcn/screens'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/preview/mcn', title: 'MCN workspace (preview)', description: 'Logged-in preview of the MCN workspace with sample data.', noindex: true })
}

export default async function McnWorkspace({ params }: P) {
  const { lang } = await params
  const mcn = mcnBySlug['lotus-talent'] || MCNS[0]
  // Roster: the creators named in the sample deals and contracts first, then Lotus Talent's Vietnam creators.
  const named = [...MCN_DEALS.map((d) => d.creator), ...CONTRACTS.filter((c) => c.status === 'Signed').map((c) => c.handle)].map((h) => creatorByHandle[h]).filter(Boolean)
  const pool = [...named, ...rosterOf(mcn.name).filter((c) => c.market === mcn.market), ...CREATORS.filter((c) => c.market === mcn.market && c.handle !== 'minh.beauty')]
  const seen = new Set<string>()
  const roster: RosterRow[] = pool.filter((c) => !seen.has(c.handle) && seen.add(c.handle)).slice(0, 8)
    .map((c) => ({ handle: c.handle, name: c.name, city: c.city, category: categoryBySlug[c.category].label, followers: c.followers, er: c.er, tone: c.tone }))

  const tabs: WsTab[] = [
    { id: 'home', label: 'Dashboard', icon: 'home', status: 'planned', content: <McnHome roster={roster} lang={lang} /> },
    { id: 'talent', label: 'Talent', icon: 'users', badge: 2, status: 'planned', content: <McnTalent roster={roster} lang={lang} /> },
    { id: 'contracts', label: 'Contracts', icon: 'file', badge: 1, status: 'planned', content: <McnContracts /> },
    { id: 'messages', label: 'Inbox', icon: 'message', badge: 2, status: 'dev', content: <Inbox role="mcn" title="Shared inbox" sub="Brand, agency and creator messages for the whole team." chats={MCN_CHATS} /> },
    { id: 'builder', label: 'Homepage builder', icon: 'layout', group: 'Public page', status: 'planned', content: <McnBuilder lang={lang} mcn={mcn} roster={roster} /> },
    { id: 'portal', label: 'Creator portal', icon: 'eye', group: 'Public page', status: 'planned', content: <McnPortal /> },
    { id: 'agency-orders', label: 'Agency Orders', icon: 'building', group: 'Business', badge: 1, status: 'dev', content: <McnAgencyOrders lang={lang} /> },
    { id: 'billing', label: 'Billing', icon: 'card', group: 'Business', status: 'dev', content: <McnBilling /> },
    { id: 'lists', label: 'Saved', icon: 'bookmark', group: 'More', content: <Saved title="Saved lists" sub="Creators you are scouting." items={MCN_SAVED} /> },
    { id: 'alerts', label: 'Alerts', icon: 'bell', group: 'More', badge: MCN_ALERTS.length, content: <Alerts items={MCN_ALERTS} /> },
  ]
  return (
    <>
      <div className="wrap wb-top"><h1>MCN workspace</h1><p>Logged-in preview · sample data · not indexed</p></div>
      <WorkspaceShell lang={lang} role="mcn" title="MCN workspace" tabs={tabs} />
    </>
  )
}
