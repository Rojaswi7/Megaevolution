'use client'
// Editor workspace (Video Editing Studio). Editor-only view: pick up orders, upload drafts, handle revisions.
import { useState } from 'react'
import { STUDIO_ORDERS, type VideoStatus } from '@/data/workspace'
import { EDITOR_NAME, EDITOR_EXTRA_QUEUE, BRIEFS, REVISION_NOTES } from '@/data/workspace-b'
import { STUDIO } from '@/data/pricing'
import { fmtDate } from '@/lib/format'
import { track } from '@/lib/track'
import { Icon } from '../../Icon'
import { WsHead, Pill } from '../Shell'
import { createStore, useToast, goTab, DropButton } from '../common-b'

type EV = { id: string; order: string; brand: string; title: string; type: 'short' | 'long'; status: VideoStatus; draft: number; revisionsUsed: number; editor?: string; due: string; files: string[] }

const videos = createStore<EV[]>([
  ...STUDIO_ORDERS.flatMap((o) => o.videos.map((v): EV => ({ ...v, order: o.id, brand: o.brand, files: o.files }))),
  ...EDITOR_EXTRA_QUEUE.map((q): EV => ({ ...q, status: 'In queue', draft: 0, revisionsUsed: 0 })),
])
const patch = (id: string, p: Partial<EV>) => videos.set((l) => l.map((v) => (v.id === id ? { ...v, ...p } : v)))
const due = (d: string) => (d.length === 10 ? fmtDate(d) : d)
const Type = ({ t }: { t: 'short' | 'long' }) => <span className="tag">{t === 'short' ? 'Short · 9:16' : 'Long · 16:9'}</span>
const ONLY = 'Editor-only view. Brands never see this screen.'

export function EditorQueue() {
  const all = videos.use()
  const list = all.filter((v) => v.status === 'In queue')
  const waiting = all.filter((v) => v.status === 'Waiting for brief').length
  const [toast, show] = useToast()
  const pick = (v: EV) => { patch(v.id, { status: 'Editing', editor: EDITOR_NAME }); track('order_picked_up', { video: v.id, order: v.order, type: v.type }); show(`Picked up “${v.title}”. It is now under My videos.`) }
  return (
    <>
      <WsHead title="Queue" sub={`Paid orders with a brief, ready to pick up. ${ONLY}`}>
        <button className="btn btn--ghost btn--sm" onClick={() => goTab('mine')}>My videos</button>
      </WsHead>
      <div className="wgrid-3">
        <div className="kpi"><b>{list.length}</b><span>Waiting in the queue</span><small>oldest first</small></div>
        <div className="kpi"><b>{all.filter((v) => v.editor === EDITOR_NAME && v.status === 'Editing').length}</b><span>You are editing</span><small>{EDITOR_NAME}</small></div>
        <div className="kpi"><b>{all.filter((v) => v.status === 'Revision requested').length}</b><span>Revisions to handle</span><small>from brands</small></div>
      </div>
      <div className="stack">
        {list.length === 0 ? <p className="wnote"><Icon name="check" size={16} />The queue is empty. New orders appear here once the brand has paid and sent a brief.</p> : null}
        {list.map((v) => (
          <div className="wcard wb-vid" key={v.id}>
            <div className="wb-vid__t">
              <b>{v.title}</b>
              <small className="muted">{v.brand} · {v.id} · due {due(v.due)}</small>
              <p className="small">{BRIEFS[v.order]}</p>
              <div className="row" style={{ gap: 6 }}><Type t={v.type} />{v.files.map((f) => <span className="wb-file" key={f}><Icon name="file" size={13} />{f}</span>)}</div>
            </div>
            <button className="btn" onClick={() => pick(v)} data-cta="ws_editor_pick_up">Pick up</button>
          </div>
        ))}
      </div>
      {waiting ? <p className="wnote"><Icon name="clock" size={16} />{waiting} more video is paid for but still waiting for the brand’s brief. It joins the queue when the brief arrives.</p> : null}
      {toast}
    </>
  )
}

export function EditorMine() {
  const list = videos.use().filter((v) => v.editor === EDITOR_NAME && (v.status === 'Editing' || v.status === 'Draft ready'))
  const [open, setOpen] = useState<string | null>(null)
  const [toast, show] = useToast()
  const upload = (v: EV) => { patch(v.id, { status: 'Draft ready', draft: v.draft + 1 }); track('draft_uploaded', { video: v.id, version: v.draft + 1, by: 'editor' }); show(`Draft ${v.draft + 1} uploaded. The brand has been told.`) }
  return (
    <>
      <WsHead title="My videos" sub={`Videos you picked up. Open the brief, edit, then upload a draft. ${ONLY}`} />
      <div className="stack">
        {list.length === 0 ? <p className="wnote"><Icon name="film" size={16} /><span>Nothing in progress. <button className="ulink" onClick={() => goTab('queue')}>Pick up an order from the queue</button></span></p> : null}
        {list.map((v) => (
          <div className="wcard stack" key={v.id}>
            <div className="wcard__h" style={{ marginBottom: 0 }}><h3>{v.title}</h3><Pill>{v.status}</Pill></div>
            <p className="small muted">{v.brand} · {v.id} · due {due(v.due)} · {v.draft ? `draft ${v.draft} is with the brand` : 'no draft yet'}</p>
            <ol className="wsteps">{['Picked up', 'Editing', 'Draft with brand', 'Final'].map((s, i) => { const at = v.status === 'Draft ready' ? 2 : 1; return <li key={s} className={i < at ? 'is-done' : i === at ? 'is-now' : ''}>{s}</li> })}</ol>
            <div className="row">
              <button className="btn btn--ghost btn--sm" onClick={() => setOpen(open === v.id ? null : v.id)} aria-expanded={open === v.id} data-cta="ws_editor_open_brief"><Icon name="file" size={15} />{open === v.id ? 'Hide brief and files' : 'Open brief and files'}</button>
              <Type t={v.type} />
            </div>
            {open === v.id && (
              <div className="wb-brief">
                <b>Brief</b><p>{BRIEFS[v.order]}</p>
                <b>Files from the brand</b>
                <ul>{v.files.map((f) => <li key={f}><Icon name="download" size={14} />{f}</li>)}</ul>
              </div>
            )}
            <DropButton label={v.draft ? `Upload draft ${v.draft + 1}` : 'Upload the first draft'} hint="MP4, up to 2 GB. The brand reviews it on the order page." cta="ws_editor_upload_draft" onPick={() => upload(v)} />
          </div>
        ))}
      </div>
      {toast}
    </>
  )
}

export function EditorRevisions() {
  const list = videos.use().filter((v) => v.status === 'Revision requested')
  const [toast, show] = useToast()
  const [staged, setStaged] = useState<string[]>([])
  const upload = (v: EV) => { setStaged((s) => [...s, v.id]); patch(v.id, { draft: v.draft + 1 }); track('draft_uploaded', { video: v.id, version: v.draft + 1, by: 'editor', revision: true }); show(`Draft ${v.draft + 1} uploaded`) }
  const resolve = (v: EV) => { patch(v.id, { status: 'Draft ready' }); track('revision_resolved', { video: v.id }); show('Marked as resolved. The new draft is with the brand.') }
  return (
    <>
      <WsHead title="Revision requests" sub={`Read the brand’s note, upload a new draft, then mark it resolved. ${ONLY}`} />
      <div className="stack">
        {list.length === 0 ? <p className="wnote"><Icon name="check" size={16} />No open revision requests.</p> : null}
        {list.map((v) => (
          <div className="wcard stack" key={v.id}>
            <div className="wcard__h" style={{ marginBottom: 0 }}><h3>{v.title}</h3><Pill>{v.status}</Pill></div>
            <p className="small muted">{v.brand} · {v.id} · draft {v.draft} · revision {v.revisionsUsed} used ({STUDIO.freeRevisions} free per order, then paid)</p>
            <p className="wnote"><Icon name="message" size={16} /><span><b>Note from the brand:</b> {REVISION_NOTES[v.id] || 'Please tighten the pacing in the first five seconds.'}</span></p>
            {staged.includes(v.id)
              ? <div className="row"><span className="wb-file"><Icon name="check" size={13} />draft_{v.draft}.mp4 uploaded</span><button className="btn" onClick={() => resolve(v)} data-cta="ws_editor_resolve_revision">Mark resolved</button></div>
              : <DropButton label={`Upload draft ${v.draft + 1}`} hint="Upload the fixed cut before you mark this resolved." cta="ws_editor_upload_revision" onPick={() => upload(v)} />}
          </div>
        ))}
      </div>
      {toast}
    </>
  )
}

export function EditorDelivered() {
  const list = videos.use().filter((v) => v.status === 'Final delivered' || v.status === 'Draft ready')
  return (
    <>
      <WsHead title="Delivered" sub={`Drafts with the brand and finals they approved. ${ONLY}`} />
      <div className="wcard wcard--flush">
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th>Video</th><th>Brand</th><th>Type</th><th>Drafts</th><th>Revisions</th><th>Status</th></tr></thead>
          <tbody>{list.map((v) => <tr key={v.id}><td><b>{v.title}</b><br /><small className="muted">{v.id}</small></td><td>{v.brand}</td><td>{v.type === 'short' ? 'Short' : 'Long'}</td><td className="tnum">{v.draft}</td><td className="tnum">{v.revisionsUsed}</td><td><Pill>{v.status}</Pill></td></tr>)}</tbody>
        </table></div>
      </div>
    </>
  )
}
