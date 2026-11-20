// MegaEvolution team workspace (logged-in preview). noindex. Sign in with the dummy agency account.
import { pageMeta } from '@/lib/seo'
import { AGENCY_ORDERS, THREADS } from '@/data/workspace'
import { AGENCY_TEAM, AGENCY_REQUESTS, AGENCY_NOTIFICATIONS, CLIENT_INVOICES, REPORTS } from '@/data/workspaceAgency'
import WorkspaceShell, { type WsTab } from '@/components/workspace/Shell'
import ProfileScreen from '@/components/workspace/ProfileScreen'
import { TeamScreen, BillingScreen, ListsScreen, AlertsScreen } from '@/components/workspace/brand/common'
import { AgencyHome, AgencyOrdersScreen, ListupCard, AgencyInbox, ReportsScreen, ClientsScreen } from '@/components/workspace/agency/screens'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/preview/agency', title: 'MegaEvolution team workspace (preview)', description: 'Logged-in preview of the agency workspace: Agency Orders, Campaign Inbox, reports and clients.', noindex: true })
}

export default async function AgencyWorkspace({ params }: P) {
  const { lang } = await params
  const tabs: WsTab[] = [
    { id: 'home', label: 'Home', icon: 'home', status: 'dev', content: <AgencyHome lang={lang} /> },
    { id: 'agency-orders', label: 'Agency Orders', icon: 'list', group: 'Campaigns', badge: AGENCY_ORDERS.length, status: 'dev', content: <AgencyOrdersScreen lang={lang} /> },
    { id: 'listup', label: 'AI Listup', icon: 'sparkle', group: 'Campaigns', status: 'dev', content: <ListupCard lang={lang} /> },
    { id: 'messages', label: 'Campaign Inbox', icon: 'inbox', group: 'Campaigns', badge: THREADS.filter((t) => t.unread).length, status: 'planned', content: <AgencyInbox lang={lang} /> },
    { id: 'reports', label: 'Reports', icon: 'chart', group: 'Campaigns', badge: REPORTS.filter((r) => r.status === 'Ready').length, status: 'dev', content: <ReportsScreen lang={lang} /> },
    { id: 'lists', label: 'Lists', icon: 'bookmark', group: 'Campaigns', status: 'live', content: <ListsScreen lang={lang} /> },
    { id: 'clients', label: 'Clients', icon: 'building', group: 'Organisation', status: 'planned', content: <ClientsScreen /> },
    { id: 'team', label: 'Team and roles', icon: 'users', group: 'Organisation', badge: AGENCY_REQUESTS.length, status: 'dev', content: <TeamScreen org="the MegaEvolution team" members={AGENCY_TEAM} requests={AGENCY_REQUESTS} /> },
    { id: 'billing', label: 'Billing', icon: 'card', group: 'Organisation', status: 'planned', content: <BillingScreen invoices={CLIENT_INVOICES} who="agency" /> },
    { id: 'alerts', label: 'Alerts', icon: 'bell', group: 'Organisation', badge: AGENCY_NOTIFICATIONS.length, status: 'live', content: <AlertsScreen items={AGENCY_NOTIFICATIONS} /> },
    { id: 'settings', label: 'Profile and settings', icon: 'settings', group: 'Organisation', status: 'planned', content: <ProfileScreen role="agency" /> },
  ]
  return (
    <>
      <div className="wrap wa-top"><h1 className="wa-h1">MegaEvolution team workspace</h1><p>Logged-in preview · sample data · not indexed</p></div>
      <WorkspaceShell lang={lang} role="agency" tabs={tabs} title="MegaEvolution team workspace" />
    </>
  )
}
