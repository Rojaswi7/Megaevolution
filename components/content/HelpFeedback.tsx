'use client'
// "Was this helpful?" at the end of a help article. Mock: records the vote with track() only.
import { useState } from 'react'
import { CONTACT_EMAIL } from '@/data/site'
import { Icon } from '../Icon'
import { track } from '@/lib/track'

export default function HelpFeedback({ slug }: { slug: string }) {
  const [vote, setVote] = useState<'yes' | 'no' | null>(null)
  const send = (v: 'yes' | 'no') => { setVote(v); track('help_feedback', { slug, helpful: v === 'yes' }) }
  if (vote === 'yes') return <p className="hf hf--done"><Icon name="check" size={18} />Thanks — glad it helped.</p>
  if (vote === 'no') return <p className="hf hf--done"><Icon name="message" size={18} />Sorry about that. Write to <b>{CONTACT_EMAIL}</b> and a person will answer.</p>
  return (
    <div className="hf">
      <b>Was this helpful?</b>
      <button onClick={() => send('yes')} data-cta="help_feedback_yes">Yes</button>
      <button onClick={() => send('no')} data-cta="help_feedback_no">Not really</button>
    </div>
  )
}
