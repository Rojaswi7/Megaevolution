'use client'
// One-click dummy sign-in used on the /preview index.
import { href } from '@/data/site'
import { accountByRole, type Role } from '@/data/accounts'
import { track } from '@/lib/track'
import { Arrow } from '../../Icon'
import { useApp } from '../../AppState'

export function SignInAs({ lang, role, dark }: { lang: string; role: Exclude<Role, 'guest'>; dark?: boolean }) {
  const { role: current, setRole } = useApp()
  const a = accountByRole[role]
  return (
    <button className={`btn btn--sm ${dark ? '' : ''}`} data-cta={`preview_index_signin_${role}`}
      onClick={() => { setRole(role); track('login', { role, method: 'dummy_account', source: 'preview_index' }); window.location.href = href(lang, a.home) }}>
      {current === role ? 'Open workspace' : `Sign in as ${a.title}`}<Arrow size={14} />
    </button>
  )
}
