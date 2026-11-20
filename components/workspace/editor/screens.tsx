'use client'
// Editor workspace (Video Editing Studio). Editor-only view: pick up orders, upload drafts, handle revisions.
import { useState } from 'react'
import '@/styles/ws-editor.css'
import { STUDIO_ORDERS, type VideoStatus } from '@/data/workspace'
import { EDITOR_NAME, EDITOR_EXTRA_QUEUE, BRIEFS, REVISION_NOTES } from '@/data/workspace-b'
import { STUDIO } from '@/data/pricing'
import { fmtDate } from '@/lib/format'
import { track } from '@/lib/track'
import { Icon } from '../../Icon'
import { Pill } from '../Shell'
import { createStore, useToast, goTab, BandHead } from '../common-b'

type EV = { id: string; order: string; brand: string; title: string; type: 'short' | 'long'; status: VideoStatus; draft: number; revisionsUsed: number; editor?: string; due: string; files: string[] }

const videos = createStore<EV[]>([
  ...STUDIO_ORDERS.flatMap((o) => o.videos.map((v): EV => ({ ...v, order: o.id, brand: o.brand, files: o.files }))),
  ...EDITOR_EXTRA_QUEUE.map((q): EV => ({ ...q, status: 'In queue', draft: 0, revisionsUsed: 0 })),
])
const patch = (id: string, p: Partial<EV>) => videos.set((l) => l.map((v) => (v.id === id ? { ...v, ...p } : v)))

// sample "today" so the countdowns read the same every time
const TODAY = '2026-11-20'
const daysLeft = (d: string) => (d.length === 10 ? Math.round((Date.parse(`${d}T00:00:00Z`) - Date.parse(`${TODAY}T00:00:00Z`)) / 86400000) : null)
const FREE = typeof STUDIO.freeRevisions === 'number' ? STUDIO.freeRevisions : 2

function Due({ d }: { d: string }) {
  const n = daysLeft(d)
  if (n === null) return <span className="ed-due">No due date</span>
  const tone = n < 0 ? 'is-late' : n <= 1 ? 'is-soon' : ''
  return <span className={`ed-due ${tone}`}><Icon name="clock" size={13} />{n < 0 ? `${-n} day${n === -1 ? '' : 's'} late` : n === 0 ? 'Due today' : n === 1 ? 'Due tomorrow' : `Due ${fmtDate(d)} · ${n} days`}</span>
}
function Thumb({ v }: { v: Pick<EV, 'type'> }) {
  return <span className={`ed-thumb ed-thumb--${v.type}`} aria-hidden="true"><Icon name="play" size={16} /><small>{v.type === 'short' ? '9:16' : '16:9'}</small></span>
}
function Files({ files }: { files: string[] }) {
  return <ul className="ed-files">{files.map((f) => <li key={f}><Icon name={/\.(mp4|mov|wav)$/.test(f) ? 'film' : /\.zip$/.test(f) ? 'download' : 'file'} size={13} />{f}</li>)}</ul>
}
function Upload({ label, hint, cta, onPick }: { label: string; hint: string; cta: string; onPick: () => void }) {
  return (
    <button type="button" className="ed-drop" onClick={onPick} data-cta={cta}>
      <span><Icon name="upload" size={18} /></span>
      <b>{label}</b><small>{hint}</small>
    </button>
  )
}
const ONLY = 'Editor-only view. Brands never see this screen.'

// ---------- Queue ----------
export function EditorQueue() {
  const all = videos.use()
  const [kind, setKind] = useState<'all' | 'short' | 'long'>('all')
  const queue = all.filter((v) => v.status === 'In queue').sort((a, b) => a.due.localeCompare(b.due))
  const list = queue.filter((v) => kind === 'all' || v.type === kind)
  const waiting = all.filter((v) => v.status === 'Waiting for brief').length
  const editing = all.filter((v) => v.editor === EDITOR_NAME && v.status === 'Editing').length
  const revisions = all.filter((v) => v.status === 'Revision requested').length
  const [toast, show] = useToast()
  const pick = (v: EV) => { patch(v.id, { status: 'Editing', editor: EDITOR_NAME }); track('order_picked_up', { video: v.id, order: v.order, type: v.type }); show(`Picked up “${v.title}”. It is now under My videos.`) }
  const pickKind = (k: typeof kind) => { setKind(k); track('filter_changed', { type: k, source: 'editor_queue' }) }

  return (
    <>
      <BandHead icon="inbox" title="Queue" sub={<>Paid orders with a brief, soonest due first. {ONLY}</>}
        stats={[{ n: queue.length, l: 'ready to pick up', hot: queue.length > 0 }, { n: editing, l: 'you are editing' }, { n: revisions, l: 'revisions open' }, { n: waiting, l: 'waiting for a brief' }]}>
        <button className="btn btn--sm" onClick={() => goTab('mine')}>My videos<Icon name="arrow" size={14} /></button>
      </BandHead>

      <div className="ed-bar">
        <div className="wb2-seg" role="group" aria-label="Video type">
          {(['all', 'short', 'long'] as const).map((k) => (
            <button key={k} aria-pressed={kind === k} onClick={() => pickKind(k)}>
              {k === 'all' ? 'All' : k === 'short' ? 'Short · 9:16' : 'Long · 16:9'}<span>{k === 'all' ? queue.length : queue.filter((v) => v.type === k).length}</span>
            </button>
          ))}
        </div>
        {waiting ? <p className="ed-hint"><Icon name="clock" size={14} />{waiting} more paid video joins the queue when its brief arrives.</p> : null}
      </div>

      {list.length === 0 ? (
        <div className="wb2-empty"><span className="wb2-ico"><Icon name="check" size={18} /></span><b>The queue is empty</b><p>New orders appear here once the brand has paid and sent a brief.</p></div>
      ) : (
        <div className="ed-jobs">
          {list.map((v, i) => (
            <article className={`ed-job ${i === 0 && kind === 'all' ? 'is-next' : ''}`} key={v.id}>
              <Thumb v={v} />
              <div className="ed-job__body">
                <div className="ed-job__top"><small>{v.brand} · {v.id}</small>{i === 0 && kind === 'all' ? <em>Next up</em> : null}</div>
                <h3>{v.title}</h3>
                <Due d={v.due} />
                <p className="ed-brief">{BRIEFS[v.order]}</p>
                <Files files={v.files} />
              </div>
              <button className="btn btn--sm ed-job__go" onClick={() => pick(v)} data-cta="ws_editor_pick_up">Pick up<Icon name="arrow" size={14} /></button>
            </article>
          ))}
        </div>
      )}
      {toast}
    </>
  )
}

// ---------- My videos ----------
const MINE_STEPS = ['Picked up', 'Editing', 'Draft with brand', 'Final']
export function EditorMine() {
  const all = videos.use()
  const list = all.filter((v) => v.editor === EDITOR_NAME && (v.status === 'Editing' || v.status === 'Draft ready'))
  const [open, setOpen] = useState<string | null>(null)
  const [toast, show] = useToast()
  const upload = (v: EV) => { patch(v.id, { status: 'Draft ready', draft: v.draft + 1 }); track('draft_uploaded', { video: v.id, version: v.draft + 1, by: 'editor' }); show(`Draft ${v.draft + 1} uploaded. The brand has been told.`) }
  const editing = list.filter((v) => v.status === 'Editing').length

  return (
    <>
      <BandHead icon="film" title="My videos" sub={<>Open the brief, edit, then upload a draft. {ONLY}</>}
        stats={[{ n: editing, l: 'editing now', hot: editing > 0 }, { n: list.length - editing, l: 'drafts with brands' }, { n: list.filter((v) => (daysLeft(v.due) ?? 9) <= 1).length, l: 'due within a day' }]} />

      {list.length === 0 ? (
        <div className="wb2-empty"><span className="wb2-ico"><Icon name="film" size={18} /></span><b>Nothing in progress</b><p>Pick up an order and it shows here.</p><button className="btn btn--sm" onClick={() => goTab('queue')}>Open the queue</button></div>
      ) : null}

      <div className="ed-list">
        {list.map((v) => {
          const at = v.status === 'Draft ready' ? 2 : 1
          const isOpen = open === v.id
          return (
            <article className="ed-card" key={v.id}>
              <header className="ed-card__h">
                <Thumb v={v} />
                <div><small>{v.brand} · {v.id}</small><h3>{v.title}</h3><div className="ed-meta"><Due d={v.due} /><span>{v.draft ? `Draft ${v.draft} is with the brand` : 'No draft yet'}</span></div></div>
                <Pill>{v.status}</Pill>
              </header>
              <ol className="ed-steps" aria-label="Progress">
                {MINE_STEPS.map((s, i) => <li key={s} className={i < at ? 'is-done' : i === at ? 'is-now' : ''}><i />{s}</li>)}
              </ol>
              <button className="ed-toggle" onClick={() => setOpen(isOpen ? null : v.id)} aria-expanded={isOpen} data-cta="ws_editor_open_brief">
                <Icon name="file" size={15} />{isOpen ? 'Hide brief and files' : 'Brief and files'}<Icon name="chevron" size={14} />
              </button>
              {isOpen && (
                <div className="ed-brief-panel">
                  <div><h4>Brief</h4><p>{BRIEFS[v.order]}</p></div>
                  <div><h4>Files from the brand</h4><Files files={v.files} /></div>
                </div>
              )}
              <Upload label={v.draft ? `Upload draft ${v.draft + 1}` : 'Upload the first draft'} hint="MP4, up to 2 GB. The brand reviews it on their order page." cta="ws_editor_upload_draft" onPick={() => upload(v)} />
            </article>
          )
        })}
      </div>
      {toast}
    </>
  )
}

// ---------- Revisions ----------
export function EditorRevisions() {
  const list = videos.use().filter((v) => v.status === 'Revision requested')
  const [toast, show] = useToast()
  const [staged, setStaged] = useState<string[]>([])
  const upload = (v: EV) => { setStaged((s) => [...s, v.id]); patch(v.id, { draft: v.draft + 1 }); track('draft_uploaded', { video: v.id, version: v.draft + 1, by: 'editor', revision: true }); show(`Draft ${v.draft + 1} uploaded`) }
  const resolve = (v: EV) => { patch(v.id, { status: 'Draft ready' }); track('revision_resolved', { video: v.id }); show('Marked as resolved. The new draft is with the brand.') }

  return (
    <>
      <BandHead icon="refresh" title="Revisions" sub={<>Read the brand’s note, upload a new draft, then mark it resolved. {ONLY}</>}
        stats={[{ n: list.length, l: 'open requests', hot: list.length > 0 }, { n: typeof STUDIO.freeRevisions === 'number' ? FREE : 'TBD', l: 'free per order, then paid' }]} />

      {list.length === 0 ? <div className="wb2-empty"><span className="wb2-ico"><Icon name="check" size={18} /></span><b>No open revision requests</b><p>When a brand asks for changes, the note shows up here.</p></div> : null}

      <div className="ed-list">
        {list.map((v) => {
          const done = staged.includes(v.id)
          return (
            <article className="ed-card" key={v.id}>
              <header className="ed-card__h">
                <Thumb v={v} />
                <div><small>{v.brand} · {v.id}</small><h3>{v.title}</h3><div className="ed-meta"><Due d={v.due} /><span>Draft {v.draft}</span></div></div>
                <Pill>{v.status}</Pill>
              </header>
              <div className="ed-note">
                <span className="wb2-av">{v.brand[0]}</span>
                <div><small>{v.brand} asked for changes</small><p>{REVISION_NOTES[v.id] || 'Please tighten the pacing in the first five seconds.'}</p></div>
              </div>
              <div className="ed-meter" aria-label={`${v.revisionsUsed} of ${FREE} free revisions used`}>
                <span>Revisions</span>
                <span className="ed-meter__bar">{Array.from({ length: Math.max(FREE, v.revisionsUsed) }, (_, i) => <i key={i} className={i < v.revisionsUsed ? (i < FREE ? 'is-used' : 'is-paid') : ''} />)}</span>
                <small>{v.revisionsUsed} of {typeof STUDIO.freeRevisions === 'number' ? FREE : 'TBD'} free used</small>
              </div>
              {done ? (
                <div className="ed-staged">
                  <span><Icon name="check" size={15} />draft_{v.draft}.mp4 uploaded</span>
                  <button className="btn btn--sm" onClick={() => resolve(v)} data-cta="ws_editor_resolve_revision">Mark resolved<Icon name="arrow" size={14} /></button>
                </div>
              ) : (
                <Upload label={`Upload draft ${v.draft + 1}`} hint="Upload the fixed cut before you mark this resolved." cta="ws_editor_upload_revision" onPick={() => upload(v)} />
              )}
            </article>
          )
        })}
      </div>
      {toast}
    </>
  )
}

// ---------- Delivered ----------
export function EditorDelivered() {
  const all = videos.use().filter((v) => v.status === 'Final delivered' || v.status === 'Draft ready')
  const [show, setShow] = useState<'all' | 'final' | 'draft'>('all')
  const list = all.filter((v) => show === 'all' || (show === 'final' ? v.status === 'Final delivered' : v.status === 'Draft ready'))
  const finals = all.filter((v) => v.status === 'Final delivered').length
  const avgDrafts = all.length ? (all.reduce((s, v) => s + v.draft, 0) / all.length).toFixed(1) : '0'
  const pick = (k: typeof show) => { setShow(k); track('filter_changed', { status: k, source: 'editor_delivered' }) }

  return (
    <>
      <BandHead icon="check" title="Delivered" sub={<>Drafts with the brand and finals they approved. {ONLY}</>}
        stats={[{ n: finals, l: 'finals approved', hot: true }, { n: all.length - finals, l: 'drafts with brands' }, { n: avgDrafts, l: 'drafts per video' }]} />

      <div className="wb2-seg" role="group" aria-label="Show">
        {([['all', 'All', all.length], ['draft', 'With the brand', all.length - finals], ['final', 'Final', finals]] as const).map(([k, l, n]) => (
          <button key={k} aria-pressed={show === k} onClick={() => pick(k)}>{l}<span>{n}</span></button>
        ))}
      </div>

      {list.length === 0 ? <div className="wb2-empty"><span className="wb2-ico"><Icon name="film" size={18} /></span><b>Nothing here yet</b><p>Videos show here once a draft is with the brand.</p></div> : (
        <div className="wb2-card ed-done">
          <div className="ed-done__h" aria-hidden="true"><span>Video</span><span>Brand</span><span>Drafts</span><span>Revisions</span><span>Status</span></div>
          <ol>
            {list.map((v) => (
              <li key={v.id}>
                <span className="ed-done__v"><Thumb v={v} /><span><b>{v.title}</b><small>{v.id} · {v.type === 'short' ? 'Short' : 'Long'}</small></span></span>
                <span data-k="Brand">{v.brand}</span>
                <span data-k="Drafts"><span className="ed-dots">{Array.from({ length: Math.max(v.draft, 1) }, (_, i) => <i key={i} className={i < v.draft ? 'on' : ''} />)}</span>{v.draft}</span>
                <span data-k="Revisions" className="num">{v.revisionsUsed}</span>
                <span data-k="Status"><Pill>{v.status}</Pill></span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  )
}
