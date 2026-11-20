'use client'
// Connect your AI: the live chat demo in the hero and the step-by-step setup.
import { useEffect, useRef, useState } from 'react'
import { MCP_URL } from '@/data/site'
import { Icon } from '../Icon'
import { APPS, CopyUrl } from './Interactive'
import { track } from '@/lib/track'

type Scene = { id: string; label: string; prompt: string; tool: string }
const SCENES: Scene[] = [
  { id: 'find', label: 'Find creators', prompt: 'Find beauty creators in Vietnam under $300 with 5%+ engagement.', tool: 'searchCreators' },
  { id: 'orders', label: 'Check orders', prompt: 'Which of my open orders are waiting on a draft?', tool: 'getOrders' },
  { id: 'reply', label: 'Draft a reply', prompt: 'Ask @minh.beauty for one more revision: show the texture first.', tool: 'draftMessage' },
]

function Answer({ id }: { id: string }) {
  if (id === 'find') {
    return (
      <>
        <ul className="ai-rows">
          {[['M', 'minh.beauty', '250K', '5.2%', '$472'], ['L', 'linh.glow', '180K', '6.4%', '$310'], ['T', 'thao.skincare', '96K', '7.1%', '$190']].map(([i, h, f, e, r], k) => (
            <li key={h}><span className={`av tone-${[3, 2, 7][k]}`}>{i}</span><b>@{h}</b><small>{f} · {e}</small><em>from {r}</em></li>
          ))}
        </ul>
        <p className="ai-more">7 more match (sample numbers). Add them to a list?</p>
      </>
    )
  }
  if (id === 'orders') {
    return (
      <ul className="ai-rows">
        {[['ORD-5120', '@minh.beauty', 'Draft ready'], ['ORD-5121', '@linh.glow', 'Script review'], ['VE-2041', 'Studio · 3 videos', 'Draft 2 ready']].map(([o, w, s]) => (
          <li key={o}><b>{o}</b><small>{w}</small><em className="ai-pill">{s}</em></li>
        ))}
      </ul>
    )
  }
  return (
    <div className="ai-draft">
      <small>Draft to @minh.beauty</small>
      <p>“Thanks Minh — v2 reads much better. Could you show the texture shot before the price? Then we’re good to post Friday.”</p>
      <span className="ai-wait"><Icon name="lock" size={13} />Waits for your approval before sending</span>
    </div>
  )
}

/** A chat window that types a question and shows MegaEvolution's answer, scene by scene. */
export function ChatDemo() {
  const [i, setI] = useState(0)
  const [typed, setTyped] = useState(SCENES[0].prompt.length)
  const [showAnswer, setShowAnswer] = useState(true)
  const held = useRef(false)
  const reduced = useRef(false)
  const scene = SCENES[i]

  useEffect(() => { reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches }, [])

  // type the prompt, then reveal the answer
  useEffect(() => {
    if (reduced.current) { setTyped(scene.prompt.length); setShowAnswer(true); return }
    setTyped(0); setShowAnswer(false)
    let n = 0
    const t = setInterval(() => {
      n += 2
      setTyped(Math.min(n, scene.prompt.length))
      if (n >= scene.prompt.length) { clearInterval(t); setTimeout(() => setShowAnswer(true), 350) }
    }, 28)
    return () => clearInterval(t)
  }, [i, scene.prompt.length])

  // move on to the next scene unless someone is reading
  useEffect(() => {
    if (!showAnswer || reduced.current) return
    const t = setTimeout(() => { if (!held.current) setI((x) => (x + 1) % SCENES.length) }, 5200)
    return () => clearTimeout(t)
  }, [showAnswer, i])

  return (
    <div className="ai-demo" onMouseEnter={() => { held.current = true }} onMouseLeave={() => { held.current = false }}>
      <div className="ai-win">
        <div className="ai-win__bar"><span className="tw__dots" aria-hidden="true"><i /><i /><i /></span><b>Your AI app</b><span className="ai-on"><i />MegaEvolution connected</span></div>
        <div className="ai-win__body" aria-live="polite">
          <p className="ai-q">{scene.prompt.slice(0, typed)}{typed < scene.prompt.length ? <span className="ai-caret" /> : null}</p>
          {showAnswer ? (
            <div className="ai-a" key={scene.id}>
              <span className="ai-tool"><Icon name="plug" size={13} />MegaEvolution · {scene.tool}</span>
              <Answer id={scene.id} />
            </div>
          ) : <div className="ai-thinking" aria-hidden="true"><i /><i /><i /></div>}
        </div>
      </div>
      <div className="ai-scenes" role="group" aria-label="Example questions">
        {SCENES.map((s, k) => (
          <button key={s.id} aria-pressed={k === i} onClick={() => { setI(k); track('cta_click', { cta: 'connect_ai_demo_scene', scene: s.id }) }}>{s.label}</button>
        ))}
      </div>
    </div>
  )
}

/** App switcher + four connected step cards. */
export function SetupSteps() {
  const [id, setId] = useState('claude')
  const app = APPS.find((a) => a.id === id)!
  return (
    <div className="ai-setup">
      <div className="ai-apps" role="group" aria-label="Your AI app">
        {APPS.map((a) => (
          <button key={a.id} aria-pressed={a.id === id} onClick={() => { setId(a.id); track('connect_app_selected', { app: a.id }) }}>
            <span className="ai-apps__mark" aria-hidden="true" />{a.name}
          </button>
        ))}
      </div>
      <ol className="ai-steps" key={id} aria-label={`Steps for ${app.name}`}>
        {app.steps.map((s, k) => (
          <li key={s.t} className={s.url ? 'is-url' : ''}>
            <span className="ai-steps__n">{k + 1}</span>
            <b>{s.t}</b>
            <p>{s.d}</p>
            {s.url ? <CopyUrl source={`steps_${app.id}`} /> : null}
          </li>
        ))}
      </ol>
    </div>
  )
}

export const CONNECTOR_URL = MCP_URL
