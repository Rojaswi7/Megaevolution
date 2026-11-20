// Brand workspace (logged-in preview). noindex. Sign in with the dummy brand account.
import { pageMeta } from '@/lib/seo'
import { TEAM, ACCESS_REQUESTS, INVOICES, NOTIFICATIONS, STUDIO_ORDERS, CREATOR_ORDERS, AGENCY_ORDERS, THREADS } from '@/data/workspace'
import WorkspaceShell, { type WsTab } from '@/components/workspace/Shell'
import ProfileScreen from '@/components/workspace/ProfileScreen'
import { TeamScreen, BillingScreen, ListsScreen, AlertsScreen } from '@/components/workspace/brand/common'
import { BrandHome, BrandOrders, BrandInbox, BrandAgencyOrders } from '@/components/workspace/brand/screens'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/preview/brand', title: 'Brand workspace (preview)', description: 'Logged-in preview of the brand workspace: orders, lists, Campaign Inbox, team and billing.', noindex: true })
}

export default async function BrandWorkspace({ params }: P) {
  const { lang } = await params
  const toReview = STUDIO_ORDERS.flatMap((o) => o.videos).filter((v) => v.status === 'Draft ready').length + CREATOR_ORDERS.filter((o) => /review/.test(o.status)).length + STUDIO_ORDERS.filter((o) => !o.briefSent).length
  const proposed = AGENCY_ORDERS.filter((o) => o.client === 'Lumi Skin').flatMap((o) => o.listings).filter((l) => l.status === 'Proposed').length
  const tabs: WsTab[] = [
    { id: 'home', label: 'Home', icon: 'home', status: 'dev', content: <BrandHome lang={lang} /> },
    { id: 'orders', label: 'My orders', icon: 'film', group: 'Work', badge: toReview, status: 'dev', content: <BrandOrders lang={lang} /> },
    { id: 'lists', label: 'Lists', icon: 'bookmark', group: 'Work', status: 'live', content: <ListsScreen lang={lang} /> },
    { id: 'messages', label: 'Campaign Inbox', icon: 'inbox', group: 'Work', badge: THREADS.filter((t) => t.unread).length, status: 'planned', content: <BrandInbox lang={lang} /> },
    { id: 'agency-orders', label: 'Agency Orders', icon: 'list', group: 'Work', badge: proposed, status: 'dev', content: <BrandAgencyOrders lang={lang} /> },
    { id: 'team', label: 'Team and roles', icon: 'users', group: 'Organisation', badge: ACCESS_REQUESTS.length, status: 'dev', content: <TeamScreen org="Lumi Skin" members={TEAM} requests={ACCESS_REQUESTS} /> },
    { id: 'billing', label: 'Billing', icon: 'card', group: 'Organisation', status: 'planned', content: <BillingScreen invoices={INVOICES} who="brand" /> },
    { id: 'alerts', label: 'Alerts', icon: 'bell', group: 'Organisation', badge: NOTIFICATIONS.length, status: 'live', content: <AlertsScreen items={NOTIFICATIONS} /> },
    { id: 'settings', label: 'Profile and settings', icon: 'settings', group: 'Organisation', status: 'planned', content: <ProfileScreen role="brand" /> },
  ]
  return (
    <>
      <div className="wrap wa-top"><h1 className="wa-h1">Brand workspace</h1><p>Logged-in preview · sample data · not indexed</p></div>
      <WorkspaceShell lang={lang} role="brand" tabs={tabs} title="Brand workspace" />
    </>
  )
}
