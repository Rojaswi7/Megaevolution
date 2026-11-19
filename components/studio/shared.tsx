// Pieces the Studio page, the checkout and /pricing share. Server-safe.
import { STUDIO, isTBD } from '@/data/pricing'
import { CLIENT_LOGOS } from '@/data/site'
import { Trust } from '@/components/ui'

const count = (v: unknown) => (isTBD(v) ? 'number TBD' : String(v))

/** Trust items that sit next to every Studio payment button. All values come from data/pricing.ts. */
export function studioTrustItems() {
  return [
    { icon: 'lock', text: 'Secure card checkout' },
    { icon: 'refresh', text: `Revisions included (${count(STUDIO.freeRevisions)})` },
    { icon: 'clock', text: STUDIO.products[0].delivery },
    { icon: 'shield', text: STUDIO.refundNote },
  ]
}

export function StudioTrust({ row, logos = true }: { row?: boolean; logos?: boolean }) {
  return (
    <div className="st-trust">
      <Trust row={row} items={studioTrustItems()} />
      {logos ? (
        <p className="st-trust__logos" aria-label="Brands we have worked with">
          <span>Trusted by teams at</span>
          {CLIENT_LOGOS.map((l) => <b key={l} title={`${l} logo — TODO: real logo file`}>{l}</b>)}
        </p>
      ) : null}
    </div>
  )
}

/** "TBD% off" until the config has a number. */
export const pct = (v: unknown) => (typeof v === 'number' ? `${v}%` : 'TBD%')
