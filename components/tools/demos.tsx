'use client'
// Interactive mock demos, one per tool. They run on the sample data in data/toolDemos.ts —
// nothing is analysed for real. Each demo shows the screen the real tool will have.
import Link from 'next/link'
import { useState } from 'react'
import { href } from '@/data/site'
import { creatorByHandle } from '@/data/creators'
import { compact } from '@/lib/format'
import { LISTUP_BRIEF, LISTUP_CARDS, LISTUP_RESULTS, LISTUP_RELAXED, REPORT, STORYBOARD, VIDEO_STYLES, VIDEO_LANGS, COMMERCE_ROWS, HOOKS, SCRIPT_ROWS, GUIDELINES } from '@/data/toolDemos'
import { Icon, Arrow, PlatformIcon, Flag } from '@/components/Icon'
import { GatedButton } from '@/components/client'
import { WaitlistForm } from '@/components/forms'
import { track } from '@/lib/track'

const Sample = () => <span className="tag tag--soon">Sample data</span>

function Frame({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <div className="tl-demo">
      <div className="tl-demo__bar"><span className="tl-demo__dots" aria-hidden="true"><i /><i /><i /></span><b>{title}</b><Sample /></div>
      <div className="tl-demo__body">{children}</div>
      {note ? <p className="tl-demo__note">{note}</p> : null}
    </div>
  )
}

function Who({ handle }: { handle: string }) {
  const c = creatorByHandle[handle]
  return (
    <span className="tl-who">
      <span className={`av tone-${c ? c.tone : 2}`}>{(c?.name || handle)[0].toUpperCase()}</span>
      <span><b>@{handle}</b>{c ? <small>{compact(c.followers)} followers</small> : null}</span>
    </span>
  )
}

/* ---------------- AI Listup ---------------- */
function ListupDemo({ lang }: { lang: string }) {
  const [brief, setBrief] = useState(LISTUP_BRIEF)
  const [stage, setStage] = useState<'brief' | 'list'>('brief')
  const [relaxed, setRelaxed] = useState(false)
  const [removed, setRemoved] = useState<string[]>([])
  const [own, setOwn] = useState('')
  const [ownRows, setOwnRows] = useState<string[]>([])
  const [sent, setSent] = useState(false)
  const rows = [...LISTUP_RESULTS, ...(relaxed ? LISTUP_RELAXED : [])]
  const kept = rows.filter((r) => r.pass && !removed.includes(r.handle))
  const relaxCard = LISTUP_CARDS.must.find((m) => 'relax' in m)!

  return (
    <Frame title="AI Listup" note="Demo: the list is fixed sample output. The real tool reads each creator’s recent posts.">
      {stage === 'brief' ? (
        <div className="stack">
          <label className="field"><span>Paste your brief</span>
            <textarea className="textarea tl-brief" value={brief} onChange={(e) => setBrief(e.target.value)} />
          </label>
          <div className="row">
            <button className="btn" disabled={!brief.trim()} onClick={() => { setStage('list'); track('tool_demo', { tool: 'ai-listup', action: 'brief_to_list' }) }} data-cta="demo_listup_build">Build the creator list<Arrow /></button>
            <span className="small muted">No template needed. Plain words work.</span>
          </div>
        </div>
      ) : (
        <div className="stack">
          <div className="tl-cards">
            <div className="tl-rule tl-rule--must"><h4>Must</h4><ul>{LISTUP_CARDS.must.map((m) => <li key={m.id}>{m.id === 'er' && relaxed ? 'Engagement 3% or higher' : m.text}</li>)}</ul></div>
            <div className="tl-rule tl-rule--nice"><h4>Nice</h4><ul>{LISTUP_CARDS.nice.map((m) => <li key={m.id}>{m.text}</li>)}</ul></div>
            <div className="tl-rule tl-rule--avoid"><h4>Avoid</h4><ul>{LISTUP_CARDS.avoid.map((m) => <li key={m.id}>{m.text}</li>)}</ul></div>
          </div>

          {!relaxed ? (
            <p className="tl-relax"><Icon name="sparkle" size={15} /><span><b>+{LISTUP_RELAXED.length} creators</b> if you relax {(relaxCard as any).relax}.</span>
              <button className="ulink" onClick={() => { setRelaxed(true); track('tool_demo', { tool: 'ai-listup', action: 'relax_rule' }) }} data-cta="demo_listup_relax">Relax it</button></p>
          ) : (
            <p className="tl-relax"><Icon name="check" size={15} /><span>Engagement relaxed to 3%. <b>{LISTUP_RELAXED.length} more creators</b> passed.</span><button className="ulink" onClick={() => setRelaxed(false)}>Undo</button></p>
          )}

          <ul className="tl-list">
            {rows.map((r) => {
              const out = removed.includes(r.handle)
              return (
                <li key={r.handle} className={!r.pass || out ? 'is-out' : ''}>
                  <Who handle={r.handle} />
                  <p><span className={`tl-verdict ${r.pass ? 'tl-verdict--ok' : 'tl-verdict--no'}`}><Icon name={r.pass ? 'check' : 'close'} size={13} stroke={2.4} />{r.pass ? 'Passed' : 'Filtered out'}</span>{r.why}{r.nice.map((n) => <span className="tag" key={n}>{n}</span>)}</p>
                  {r.pass ? <button className="ulink small" onClick={() => setRemoved((x) => (out ? x.filter((h) => h !== r.handle) : [...x, r.handle]))}>{out ? 'Restore' : 'Remove'}</button> : <span />}
                </li>
              )
            })}
            {ownRows.map((h) => (
              <li key={h}><Who handle={h} /><p><span className="tl-verdict tl-verdict--ok"><Icon name="check" size={13} stroke={2.4} />Checked</span>From your own list. Same Must / Nice / Avoid check applied.</p><span /></li>
            ))}
          </ul>

          <form className="tl-own" onSubmit={(e) => { e.preventDefault(); const hs = own.split(/[\s,]+/).map((h) => h.replace(/^@/, '')).filter(Boolean); if (hs.length) { setOwnRows((x) => [...new Set([...x, ...hs])]); setOwn(''); track('tool_demo', { tool: 'ai-listup', action: 'review_own_list', count: hs.length }) } }}>
            <label className="field"><span>Review your own list <small>(paste handles)</small></span><input className="input" value={own} onChange={(e) => setOwn(e.target.value)} placeholder="@handle, @handle" /></label>
            <button className="btn btn--ghost">Check these</button>
          </form>

          <div className="row tl-demo__foot">
            {sent ? (
              <p className="form-ok" role="status"><Icon name="check" />{kept.length + ownRows.length} listings created in Agency Orders. <Link className="ulink" href={href(lang, '/preview/agency?tab=agency-orders')} prefetch={false} data-cta="demo_listup_open_agency_orders">Open Agency Orders</Link></p>
            ) : (
              <button className="btn" onClick={() => { setSent(true); track('tool_demo', { tool: 'ai-listup', action: 'create_agency_listings', count: kept.length + ownRows.length }) }} data-cta="demo_listup_create_listings">Create agency listings ({kept.length + ownRows.length})<Arrow /></button>
            )}
            <button className="tlink" onClick={() => { setStage('brief'); setSent(false) }}>Edit the brief</button>
          </div>
        </div>
      )}
    </Frame>
  )
}

/* ---------------- Performance Report ---------------- */
function ReportDemo({ lang }: { lang: string }) {
  const [metric, setMetric] = useState<'views' | 'er'>('views')
  const maxV = Math.max(...REPORT.platforms.map((p) => p.views)), maxE = Math.max(...REPORT.platforms.map((p) => p.er))
  const maxD = Math.max(...REPORT.daily)
  const W = 560, H = 150
  const pts = REPORT.daily.map((v, i) => `${(i / (REPORT.daily.length - 1)) * W},${H - (v / maxD) * (H - 12)}`).join(' ')
  return (
    <Frame title={REPORT.name} note="Demo: sample numbers. Real reports are built from your post links.">
      <div className="stack">
        <ul className="tl-totals">{REPORT.totals.map((t) => <li key={t.label}><b className="num">{t.value}</b><span>{t.label}</span></li>)}</ul>

        <div className="tl-rep">
          <div className="tl-rep__plat">
            <div className="tl-rep__h">
              <h4>By platform, next to the totals</h4>
              <div className="tl-seg tl-seg--sm" role="group" aria-label="Metric">
                <button aria-pressed={metric === 'views'} onClick={() => setMetric('views')}>Views</button>
                <button aria-pressed={metric === 'er'} onClick={() => setMetric('er')}>Engagement</button>
              </div>
            </div>
            <ul>
              {REPORT.platforms.map((p) => (
                <li key={p.platform}>
                  <span className="pname"><PlatformIcon name={p.platform} size={16} />{p.platform}</span>
                  <span className="tl-bar"><i style={{ width: `${metric === 'views' ? (p.views / maxV) * 100 : (p.er / maxE) * 100}%` }} /></span>
                  <b className="tnum">{metric === 'views' ? compact(p.views) : `${p.er}%`}</b>
                  <small>{p.posts} posts</small>
                </li>
              ))}
            </ul>
          </div>
          <div className="tl-rep__chart">
            <h4>Views per day, first two weeks</h4>
            <svg viewBox={`0 0 ${W} ${H + 18}`} role="img" aria-label="Line chart: daily views rise to a peak on day 6, then taper off">
              {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="var(--line)" strokeWidth="1" />)}
              <line x1="0" x2={W} y1={H} y2={H} stroke="var(--ink)" strokeWidth="1.5" />
              <polyline points={pts} fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {REPORT.daily.map((v, i) => (v === maxD ? <circle key={i} cx={(i / (REPORT.daily.length - 1)) * W} cy={H - (v / maxD) * (H - 12)} r="6" fill="var(--accent)" stroke="var(--ink)" strokeWidth="2" /> : null))}
              <text x="0" y={H + 15} fontSize="11" fill="var(--ink-3)">Day 1</text>
              <text x={W} y={H + 15} fontSize="11" fill="var(--ink-3)" textAnchor="end">Day 14</text>
            </svg>
            <p className="small muted">Peak: {maxD}K views on day {REPORT.daily.indexOf(maxD) + 1}.</p>
          </div>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Top posts</th><th>Platform</th><th>Views</th><th>Engagement</th></tr></thead>
            <tbody>{REPORT.top.map((t) => <tr key={t.handle}><td><b>@{t.handle}</b></td><td><span className="pname"><PlatformIcon name={t.platform} size={15} />{t.platform}</span></td><td className="tnum">{t.views}</td><td className="tnum">{t.er}</td></tr>)}</tbody>
          </table>
        </div>

        <div className="row tl-demo__foot">
          <GatedButton lang={lang} reason="export_report_pdf" title="Export the client PDF" text="Create a free account to export this report as a clean PDF with your logo, in your language." variant="dark">Export client PDF</GatedButton>
          <span className="small muted">{REPORT.creators} creators · {REPORT.posts} posts</span>
        </div>
      </div>
    </Frame>
  )
}

/* ---------------- AI Video Edit ---------------- */
function VideoDemo({ lang }: { lang: string }) {
  const [src, setSrc] = useState<null | 'video' | 'script'>(null)
  const [style, setStyle] = useState(VIDEO_STYLES[0])
  const [langCode, setLangCode] = useState('EN')
  const [voice, setVoice] = useState('')
  const [playing, setPlaying] = useState('')
  const [made, setMade] = useState(false)
  const L = VIDEO_LANGS.find((l) => l.code === langCode)!
  const preview = (v: string) => { setPlaying(v); setVoice(v); track('tool_demo', { tool: 'ai-video-edit', action: 'voice_preview', voice: v }); setTimeout(() => setPlaying((p) => (p === v ? '' : p)), 1600) }
  return (
    <Frame title="AI Video Edit" note="Demo: storyboard and sample are placeholders. Voice previews are silent here.">
      <div className="stack">
        <div className="tl-up">
          <button className={`tl-up__btn ${src === 'video' ? 'is-on' : ''}`} onClick={() => { setSrc('video'); setMade(false); track('tool_demo', { tool: 'ai-video-edit', action: 'upload_video' }) }} data-cta="demo_video_upload_video"><Icon name="upload" size={20} /><b>Upload a video</b><small>Raw footage or a finished ad to adapt</small></button>
          <button className={`tl-up__btn ${src === 'script' ? 'is-on' : ''}`} onClick={() => { setSrc('script'); setMade(false); track('tool_demo', { tool: 'ai-video-edit', action: 'upload_script' }) }} data-cta="demo_video_upload_script"><Icon name="file" size={20} /><b>Paste a script</b><small>Just the words is enough</small></button>
        </div>

        {src && (
          <>
            <div>
              <h4 className="tl-h4">1 · Storyboard <small>from your {src === 'video' ? 'video: serum_raw_take3.mp4' : 'script'}</small></h4>
              <ol className="tl-story">
                {STORYBOARD.map((s) => (
                  <li key={s.t}><div className={`tl-story__f tone-${s.tone}`}><span>{s.t}</span><b>{s.scene}</b></div><p>{s.text}</p></li>
                ))}
              </ol>
            </div>

            <div className="tl-pick">
              <div>
                <h4 className="tl-h4">2 · Style</h4>
                <div className="tl-chips">{VIDEO_STYLES.map((s) => <button key={s} className="chip" aria-pressed={style === s} onClick={() => setStyle(s)}>{s}</button>)}</div>
              </div>
              <div>
                <h4 className="tl-h4">3 · Language and voice</h4>
                <div className="tl-chips">{VIDEO_LANGS.map((l) => <button key={l.code} className="chip" aria-pressed={langCode === l.code} onClick={() => { setLangCode(l.code); setVoice('') }}>{l.name}</button>)}</div>
                <div className="tl-voices">
                  {L.voices.map((v) => (
                    <button key={v} className={`tl-voice ${voice === v ? 'is-on' : ''}`} onClick={() => preview(v)} aria-label={`Preview voice ${v}`}>
                      <span className="tl-voice__play"><Icon name="play" size={12} stroke={2.2} /></span>{v}
                      <span className={`tl-wave ${playing === v ? 'is-playing' : ''}`} aria-hidden="true"><i /><i /><i /><i /><i /></span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {made ? (
              <div className="tl-sample">
                <div className="tl-sample__vid" role="img" aria-label="AI sample video placeholder — TODO: real sample video"><span className="tl-sample__play"><Icon name="play" size={20} stroke={2} /></span><b>Sample video</b><small>{style} · {L.name}{voice ? ` · voice: ${voice}` : ''} · 0:21</small></div>
                <div className="stack">
                  <p><b>Sample ready.</b> Share it for sign-off, or send it to a human editor for the finished cut.</p>
                  <div className="row"><Link className="btn btn--sm" href={href(lang, '/video-editing/checkout')} data-cta="demo_video_send_to_studio" prefetch={false}>Order a video<Arrow size={14} /></Link><button className="tlink" onClick={() => setMade(false)}>Try another style</button></div>
                </div>
              </div>
            ) : (
              <div className="row tl-demo__foot"><button className="btn" onClick={() => { setMade(true); track('tool_demo', { tool: 'ai-video-edit', action: 'make_sample', style, language: langCode, voice }) }} data-cta="demo_video_make_sample">Make the sample video<Arrow /></button></div>
            )}
          </>
        )}
      </div>
    </Frame>
  )
}

/* ---------------- Creator Commerce Data ---------------- */
function CommerceDemo() {
  const [m, setM] = useState<'vn' | 'ph'>('vn')
  return (
    <Frame title="Creator Commerce Data" note="Every row is made-up sample data. The real data set is not live yet.">
      <div className="stack">
        <div className="row">
          <div className="tl-seg tl-seg--sm" role="group" aria-label="Market">
            <button aria-pressed={m === 'vn'} onClick={() => setM('vn')}><Flag market="vn" /> Vietnam</button>
            <button aria-pressed={m === 'ph'} onClick={() => setM('ph')}><Flag market="ph" /> Philippines</button>
          </div>
          <span className="tag tag--soon">Coming soon</span>
        </div>
        <div className="gate tl-gate">
          <div className="gate__blur tbl-wrap" aria-hidden="true">
            <table className="tbl">
              <thead><tr><th>Creator</th><th>Top product</th><th>TikTok Shop sales</th><th>Units</th><th>From LIVE</th></tr></thead>
              <tbody>{COMMERCE_ROWS[m].map((r) => <tr key={r.handle}><td><b>@{r.handle}</b></td><td>{r.product}</td><td className="tnum">{r.gmv}</td><td className="tnum">{r.units}</td><td className="tnum">{r.live}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="gate__box">
            <span className="tag tag--dark">Coming soon</span>
            <h3>TikTok Shop sales per creator and product</h3>
            <p>{m === 'vn' ? 'Vietnam' : 'The Philippines'} first. Join the waitlist and we’ll tell you before anyone else.</p>
          </div>
        </div>
        <WaitlistForm source={`commerce_data_${m}`} />
      </div>
    </Frame>
  )
}

/* ---------------- Script Studio ---------------- */
function ScriptDemo({ lang }: { lang: string }) {
  const [cat, setCat] = useState('Beauty')
  const [rows, setRows] = useState(SCRIPT_ROWS)
  const [caption, setCaption] = useState('My honest two-week test of the new vitamin C serum.')
  const [checked, setChecked] = useState(false)
  const all = `${caption} ${rows.map((r) => r.line).join(' ')}`.toLowerCase()
  const results: Record<string, { ok: boolean; note: string }> = {
    disclosure: /#ad\b|paid partnership|sponsored/.test(caption.toLowerCase()) ? { ok: true, note: 'Disclosure found in the caption.' } : { ok: false, note: 'Add “Paid partnership” or #ad to the first line of the caption.' },
    claims: /\bcures?\b|\btreats?\b/.test(all) ? { ok: false, note: 'Remove the medical claim (“cures”). Say what you saw instead.' } : { ok: true, note: 'No medical claims.' },
    name: /serum/.test(`${rows[0]?.line} ${rows[1]?.line} ${rows[2]?.line}`.toLowerCase()) ? { ok: true, note: 'Product named in the opening scenes.' } : { ok: false, note: 'Name the product in the first 10 seconds.' },
    competitor: { ok: true, note: 'No competitor names.' },
  }
  const flags = GUIDELINES.filter((g) => !results[g.test].ok).length
  const edit = (i: number, line: string) => { setRows((r) => r.map((x, k) => (k === i ? { ...x, line } : x))); setChecked(false) }
  return (
    <Frame title="Script Studio" note="Demo: the check runs on simple rules here. Edit a line and run it again.">
      <div className="tl-script">
        <div className="tl-script__hooks">
          <h4 className="tl-h4">Hook bank</h4>
          <div className="tl-chips">{['Beauty', 'F & B', 'Tech'].map((c) => <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}</div>
          <ul>
            {HOOKS.filter((h) => h.cat === cat).map((h) => (
              <li key={h.text}><button onClick={() => { edit(0, h.text); track('tool_demo', { tool: 'script-studio', action: 'use_hook' }) }} data-cta="demo_script_use_hook"><span>“{h.text}”</span><small>Use as hook</small></button></li>
            ))}
          </ul>
        </div>

        <div className="stack">
          <h4 className="tl-h4">Script</h4>
          <div className="tl-script__tbl">
            {rows.map((r, i) => (
              <label key={r.scene} className="tl-script__row"><span>{r.scene}<small>{r.screen}</small></span><input className="input" value={r.line} onChange={(e) => edit(i, e.target.value)} aria-label={`${r.scene} line`} /></label>
            ))}
            <label className="tl-script__row"><span>Caption<small>first line</small></span><input className="input" value={caption} onChange={(e) => { setCaption(e.target.value); setChecked(false) }} aria-label="Caption" /></label>
          </div>

          {checked && (
            <ul className="tl-checks" aria-live="polite">
              {GUIDELINES.map((g) => {
                const r = results[g.test]
                return <li key={g.id} className={r.ok ? 'is-ok' : 'is-flag'}><Icon name={r.ok ? 'check' : 'close'} size={15} stroke={2.4} /><span><b>{g.rule}</b>{r.note}</span></li>
              })}
            </ul>
          )}

          <div className="row tl-demo__foot">
            <button className="btn" onClick={() => { setChecked(true); track('tool_demo', { tool: 'script-studio', action: 'guideline_check', flags }) }} data-cta="demo_script_check">{checked ? `Run the check again${flags ? ` (${flags} to fix)` : ''}` : 'Run the guideline check'}<Arrow /></button>
            <GatedButton lang={lang} reason="export_script_pdf" title="Export the script as a PDF" text="Create a free account to export a clean script PDF and send it to the brand for approval.">Export as PDF</GatedButton>
          </div>
        </div>
      </div>
    </Frame>
  )
}

export default function ToolDemo({ slug, lang }: { slug: string; lang: string }) {
  if (slug === 'ai-listup') return <ListupDemo lang={lang} />
  if (slug === 'performance-report') return <ReportDemo lang={lang} />
  if (slug === 'ai-video-edit') return <VideoDemo lang={lang} />
  if (slug === 'commerce-data') return <CommerceDemo />
  if (slug === 'script-studio') return <ScriptDemo lang={lang} />
  return null
}
