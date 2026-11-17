import { CREATORS, localRate, minUsd } from './data.js'

/** One small creator card floating on the hero collage. */
export function HeroFloaters() {
  const c = CREATORS[3]
  return (
    <div className="float float--profile" aria-hidden="true">
      <span className="float__avatar">{c.name[0]}</span>
      <span className="float__who">
        <b>@{c.handle}</b>
        <small>{c.cat}, Seoul</small>
      </span>
      <span className="float__rate">
        <b>{c.followers}</b>
        <small>from {localRate(minUsd(c.rate), c.market)}</small>
      </span>
    </div>
  )
}
