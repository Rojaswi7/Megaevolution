/**
 * Section header. `layout`: 'split' (title left, note right), 'stack' (note under title), 'center'.
 */
export function Head({ label, title, children, layout = 'stack' }) {
  return (
    <div className={`hd hd--${layout}`}>
      <div className="hd__main">
        {label && <p className="hd__eyebrow">{label}</p>}
        <h2 className="hd__title">
          {title.includes('|') ? <>{title.split('|')[0]} <span className="it">{title.split('|')[1]}</span></> : title}
        </h2>
      </div>
      {children && <p className="hd__note">{children}</p>}
    </div>
  )
}

export function Eyebrow({ label }) {
  return <p className="hd__eyebrow">{label}</p>
}
