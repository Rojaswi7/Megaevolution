// Logged-in preview: editor workspace for the Video Editing Studio (dummy account Jae Kim). noindex.
import { pageMeta } from '@/lib/seo'
import { EDITOR_CHATS, EDITOR_ALERTS, EDITOR_SAVED } from '@/data/workspace-b'
import WorkspaceShell, { type WsTab } from '@/components/workspace/Shell'
import { Inbox, Alerts, Saved } from '@/components/workspace/common-b'
import { EditorQueue, EditorMine, EditorRevisions, EditorDelivered } from '@/components/workspace/editor/screens'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P) {
  const { lang } = await params
  return pageMeta({ lang, path: '/preview/editor', title: 'Editor workspace (preview)', description: 'Logged-in preview of the Video Editing Studio editor workspace with sample data.', noindex: true })
}

export default async function EditorWorkspace({ params }: P) {
  const { lang } = await params
  const tabs: WsTab[] = [
    { id: 'queue', label: 'Queue', icon: 'inbox', badge: 3, status: 'dev', content: <EditorQueue /> },
    { id: 'mine', label: 'My videos', icon: 'film', status: 'dev', content: <EditorMine /> },
    { id: 'revisions', label: 'Revisions', icon: 'refresh', badge: 1, status: 'dev', content: <EditorRevisions /> },
    { id: 'delivered', label: 'Delivered', icon: 'check', status: 'dev', content: <EditorDelivered /> },
    { id: 'messages', label: 'Messages', icon: 'message', group: 'More', badge: 1, status: 'dev', content: <Inbox role="editor" title="Messages" sub="Order chats with brands and the studio lead." chats={EDITOR_CHATS} /> },
    { id: 'lists', label: 'Reference', icon: 'bookmark', group: 'More', content: <Saved title="Reference" sub="Brand guides and presets you saved." items={EDITOR_SAVED} /> },
    { id: 'alerts', label: 'Alerts', icon: 'bell', group: 'More', badge: EDITOR_ALERTS.length, content: <Alerts items={EDITOR_ALERTS} /> },
  ]
  return (
    <>
      <div className="wrap wb-top"><h1>Editor workspace</h1><p>Logged-in preview · editor-only · sample data · not indexed</p></div>
      <WorkspaceShell lang={lang} role="editor" title="Editor workspace" tabs={tabs} />
    </>
  )
}
