'use client'
// Help center: "ask first". Search with an instant answer beside it, an audience switch,
// topic tiles with their top questions, and every answer readable in place.
// All article links are in the server HTML; the client only filters and expands.
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { href, CONTACT_EMAIL } from '@/data/site'
import type { HelpArticle } from '@/data/help'
import { Icon, Arrow } from '../Icon'
import { track } from '@/lib/track'

const TOPIC_ICON: Record<string, string> = {
  'Getting started': 'sparkle', 'Creator search': 'search', 'Orders and payments': 'card', 'Video Editing Studio': 'film',
  'Tools and plans': 'chart', 'For creators': 'user', 'For MCNs': 'building', Account: 'settings',
}
const AUDIENCES = [['', 'Everyone'], ['Brands', 'Brand'], ['Creators', 'Creator'], ['MCNs', 'MCN']] as const
const POPULAR = ['refund', 'revisions', 'rate card', 'audience', 'MCN']

function score(a: HelpArticle, words: string[]) {
  const t = a.title.toLowerCase(), s = a.summary.toLowerCase(), b = a.body.join(' ').toLowerCase()
  return words.reduce((n, w) => n + (t.includes(w) ? 5 : 0) + (s.includes(w) ? 2 : 0) + (b.includes(w) ? 1 : 0), 0)
}

export default function HelpCenter({ lang, articles, topics }: { lang: string; articles: HelpArticle[]; topics: string[] }) {
  const [q, setQ] = useState('')
  const [who, setWho] = useState('')
  const [topic, setTopic] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const forWho = (a: HelpArticle) => !who || a.audience === who || a.audience === 'Everyone'
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const matches = useMemo(
    () => articles.filter(forWho).map((a) => ({ a, s: words.length ? score(a, words) : 1 })).filter((x) => x.s > 0).sort((x, y) => y.s - x.s).map((x) => x.a),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, who, articles],
  )
  const best = words.length ? matches[0] : null
  const list = matches.filter((a) => !topic || a.topic === topic)
  const visibleTopics = topics.filter((t) => articles.some((a) => a.topic === t && forWho(a)))

  const pickTopic = (t: string) => {
    setTopic(topic === t ? '' : t)
    track('filter_changed', { topic: t, source: 'help' })
    document.getElementById('answers')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* ---------- ask ---------- */}
      <section className="hc-hero on-dark">
        <div className="wrap hc-hero__grid">
          <div className="hc-hero__ask">
            <p className="eyebrow">Help center</p>
            <h1 className="h1">Ask us<span className="it">anything.</span></h1>
            <div className="hc-who" role="group" aria-label="I am a">
              <span>I’m a</span>
              {AUDIENCES.map(([v, l]) => (
                <button key={l} aria-pressed={who === v} onClick={() => { setWho(v); track('filter_changed', { audience: v || 'all', source: 'help' }) }}>{l}</button>
              ))}
            </div>
            <label className="hc-search">
              <Icon name="search" size={22} />
              <span className="sr">Search help</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => q.trim() && track('search', { query: q.trim(), results: matches.length, source: 'help' })}
                placeholder="Type a question, e.g. how do refunds work?" autoComplete="off" />
              {q ? <button className="hc-search__clear" onClick={() => setQ('')} aria-label="Clear search"><Icon name="close" size={16} /></button> : null}
            </label>
            <p className="hc-popular"><span>Popular</span>{POPULAR.map((p) => <button key={p} onClick={() => setQ(p)}>{p}</button>)}</p>
          </div>

          <aside className="hc-answer" aria-live="polite">
            {best ? (
              <>
                <p className="hc-answer__k"><Icon name="sparkle" size={14} />Best answer</p>
                <h2 className="h3">{best.title}</h2>
                <p className="hc-answer__s">{best.summary}</p>
                <p className="hc-answer__b">{best.body[0]}</p>
                <div className="hc-answer__f">
                  <Link className="btn btn--sm" href={href(lang, `/help/${best.slug}`)} data-cta="help_best_answer" prefetch={false}>Read the full answer<Arrow size={14} /></Link>
                  <span>{matches.length - 1 > 0 ? `+${matches.length - 1} more below` : ''}</span>
                </div>
              </>
            ) : words.length ? (
              <>
                <p className="hc-answer__k"><Icon name="message" size={14} />No match yet</p>
                <h2 className="h3">Ask a person instead</h2>
                <p className="hc-answer__s">We answer within one business day, in your language.</p>
                <div className="hc-answer__f"><a className="btn btn--sm" href={`mailto:${CONTACT_EMAIL}`} data-cta="help_no_match_email">Email {CONTACT_EMAIL}</a></div>
              </>
            ) : (
              <>
                <p className="hc-answer__k"><Icon name="sparkle" size={14} />Instant answers</p>
                <h2 className="h3">Start typing and the best answer shows up here.</h2>
                <ul className="hc-answer__try">
                  {articles.filter(forWho).slice(0, 3).map((a) => <li key={a.slug}><Link href={href(lang, `/help/${a.slug}`)} prefetch={false} data-cta="help_suggested">{a.title}<Arrow size={14} /></Link></li>)}
                </ul>
              </>
            )}
          </aside>
        </div>
      </section>

      {/* ---------- topics ---------- */}
      <section className="wrap hc-sec" aria-labelledby="h-topics">
        <div className="hc-head"><h2 className="h3" id="h-topics">Browse by topic</h2>{topic ? <button className="ulink" onClick={() => setTopic('')}>Show all topics</button> : null}</div>
        <div className="hc-topics">
          {visibleTopics.map((t, i) => {
            const inT = articles.filter((a) => a.topic === t && forWho(a))
            return (
              <article key={t} className={`hc-topic hc-topic--${i % 8} ${topic === t ? 'is-on' : ''}`}>
                <button className="hc-topic__pick" onClick={() => pickTopic(t)} aria-pressed={topic === t} aria-label={`Show answers about ${t}`} />
                <span className="hc-topic__ico"><Icon name={TOPIC_ICON[t] || 'file'} size={20} /></span>
                <h3>{t}</h3>
                <p className="hc-topic__n">{inT.length} {inT.length === 1 ? 'answer' : 'answers'}</p>
                <ul>{inT.slice(0, 2).map((a) => <li key={a.slug}><Link href={href(lang, `/help/${a.slug}`)} prefetch={false} data-cta="help_topic_article">{a.title}</Link></li>)}</ul>
              </article>
            )
          })}
        </div>
      </section>

      {/* ---------- answers, readable in place ---------- */}
      <section className="wrap hc-sec" id="answers" aria-labelledby="h-answers">
        <div className="hc-head">
          <h2 className="h3" id="h-answers">{topic || (words.length ? 'Answers for your question' : 'All answers')}</h2>
          <span className="small muted">{list.length} {list.length === 1 ? 'answer' : 'answers'}</span>
        </div>
        {list.length ? (
          <ol className="hc-list">
            {list.map((a) => (
              <li key={a.slug} className={open === a.slug ? 'is-open' : ''}>
                <button className="hc-row" onClick={() => { setOpen(open === a.slug ? null : a.slug); if (open !== a.slug) track('help_answer_opened', { slug: a.slug }) }} aria-expanded={open === a.slug}>
                  <span className="hc-row__ico"><Icon name={TOPIC_ICON[a.topic] || 'file'} size={17} /></span>
                  <span className="hc-row__t"><b>{a.title}</b><small>{a.topic} · {a.audience}</small></span>
                  <span className="hc-row__tg" aria-hidden="true"><Icon name="plus" size={16} /></span>
                </button>
                {open === a.slug ? (
                  <div className="hc-row__a">
                    <p>{a.summary}</p>
                    <ol>{a.body.map((p, i) => <li key={i}>{p}</li>)}</ol>
                    <Link className="tlink" href={href(lang, `/help/${a.slug}`)} prefetch={false} data-cta="help_open_full">Open as a page<Arrow size={14} /></Link>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <div className="hc-empty">
            <b>Nothing matches that yet.</b>
            <span>Try another word, or write to us and a person will answer.</span>
            <button className="btn btn--ghost btn--sm" onClick={() => { setQ(''); setTopic(''); setWho('') }}>Clear search</button>
          </div>
        )}
      </section>

      {/* ---------- talk to a person ---------- */}
      <section className="wrap hc-sec" aria-labelledby="h-talk">
        <div className="hc-talk">
          <div className="hc-talk__intro">
            <p className="eyebrow">Still stuck?</p>
            <h2 className="h2" id="h-talk">Talk to<span className="it">a person.</span></h2>
          </div>
          <div className="hc-ch hc-ch--lime">
            <span className="hc-ch__ico"><Icon name="message" size={20} /></span>
            <b>Live chat</b><span>Weekdays, usually within minutes.</span>
            <button className="btn btn--dark btn--sm" onClick={() => track('cta_click', { cta: 'help_live_chat' })} data-cta="help_live_chat">Start a chat</button>
          </div>
          <div className="hc-ch">
            <span className="hc-ch__ico"><Icon name="mail" size={20} /></span>
            <b>Email</b><span>Within one business day.</span>
            <a className="tlink" href={`mailto:${CONTACT_EMAIL}`} data-cta="help_email">{CONTACT_EMAIL}</a>
          </div>
          <div className="hc-ch">
            <span className="hc-ch__ico"><Icon name="users" size={20} /></span>
            <b>Campaign question</b><span>A manager replies with options. No brief needed.</span>
            <Link className="tlink" href={href(lang, '/about-agency#inquiry')} data-cta="help_to_agency" prefetch={false}>Explore your campaign options<Arrow size={14} /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
