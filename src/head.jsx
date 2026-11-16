/**
 * Shared section header.
 * Wrap the highlighted word(s) in *asterisks* inside `title`, e.g. "Where we *work*."
 */
export function Head({ n, label, title, children, right, center = false }) {
  const parts = title.split('*')
  return (
    <div className={`hd ${center ? 'hd--center' : ''}`}>
      <div className="hd__main">
        <p className="hd__eyebrow">
          <span className="hd__n">{n}</span>
          <i aria-hidden="true" />
          {label}
        </p>
        <h2 className="hd__title">
          {parts.map((p, i) => (i % 2 ? <em key={i}>{p}</em> : p))}
        </h2>
      </div>
      {(children || right) && (
        <div className="hd__side">
          {children && <p>{children}</p>}
          {right}
        </div>
      )}
    </div>
  )
}

/** Eyebrow only — for headers that live inside cards. */
export function Eyebrow({ n, label }) {
  return (
    <p className="hd__eyebrow">
      <span className="hd__n">{n}</span>
      <i aria-hidden="true" />
      {label}
    </p>
  )
}
