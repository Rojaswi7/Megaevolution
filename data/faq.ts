// FAQ blocks. Each one renders with FAQPage JSON-LD.
import { ANALYTICS_LIMITS } from './pricing'

export const HOME_FAQ = [
  { q: 'How do I find creators in a specific country?', a: 'Use the search on this page: pick a country, a category and a platform. Each result shows followers, average views, engagement and a starting rate, so you can shortlist without contacting anyone.' },
  { q: 'How much does it cost to work with a creator?', a: 'Every creator sets their own rates in their own currency. You see a “from” price on each card, converted to your currency, and the full rate card on their profile.' },
  { q: 'What if I don’t have time to run the campaign myself?', a: 'Use the agency service. You get one dedicated account manager, and a local manager in each market handles creators, contracts and posting. Send the short form — no brief needed.' },
  { q: 'Which platforms and markets do you cover?', a: 'Instagram, TikTok and YouTube, across Korea, Japan, China, Vietnam, Thailand, Indonesia, the Philippines, the US, Mexico, Brazil and Europe. For the Middle East and the rest of Latin America, ask our team.' },
  { q: 'Can you edit videos for us without a creator campaign?', a: 'Yes. The Video Editing Studio takes your raw footage and returns short or long videos ready to post, with revisions included.' },
  { q: 'Is the creator data reliable?', a: 'Channel numbers come from official platform access: our YouTube API use is approved, our Meta API access is verified and our TikTok app is approved.' },
]

export const AGENCY_FAQ = [
  { q: 'Do I need a brief to get started?', a: 'No. Tell us the product and the market you want to reach. Your account manager turns that into two or three campaign options with rough costs.' },
  { q: 'Who will I be talking to?', a: 'One dedicated account manager, in your language. Behind them, a local manager in each market works with the creators directly.' },
  { q: 'Can you run several countries at once?', a: 'Yes. For JINRO, 670 creators posted in 14 countries in the same window. Multi-country campaigns share one timeline and one report.' },
  { q: 'How is the agency service priced?', a: 'You approve a budget before anything is booked. Creator fees and our management fee are shown separately.' },
  { q: 'How long does a campaign take?', a: 'It depends on the number of creators and markets. Your manager gives you a timeline with the campaign options.' },
]

export const STUDIO_FAQ = [
  { q: 'What do I need to send?', a: 'Your raw footage or files, plus a short brief: what the video is for and any examples you like. You upload both right after payment.' },
  { q: 'How many revisions are included?', a: 'Each order includes free revisions (the number is being confirmed). Extra revisions can be added from the order page.' },
  { q: 'Do you edit long videos too?', a: 'Yes. Choose short videos for TikTok, Reels and Shorts, or long videos for YouTube.' },
  { q: 'What do Plus and Max change?', a: 'They are monthly subscriptions for teams that order regularly. Every video costs less, and you can change or cancel in the billing portal.' },
  { q: 'Can I get a refund?', a: 'Refund terms are shown next to the payment button before you pay. Final terms are being confirmed.' },
]

export const PRICING_FAQ = [
  { q: 'Can I use the tools without a plan?', a: 'Yes. Each tool has a pay-per-use price for a single run.' },
  { q: 'What does yearly billing save?', a: 'Yearly plans cost less than paying monthly. The exact saving is shown in the plan table.' },
  { q: 'How many audience breakdowns can I open?', a: `Without an account, ${ANALYTICS_LIMITS.loggedOut} a day. Verified brands can open ${ANALYTICS_LIMITS.verifiedBrand} a day, and paid plans raise the limit.` },
  { q: 'Is creator search free?', a: 'Yes. Searching and viewing profiles is free. A free account lets you save lists.' },
  { q: 'Do you offer enterprise plans?', a: 'Yes, for agencies and multi-brand groups. Contact us and we will set up organisations, roles and per-brand invoices.' },
]

export const CREATOR_FAQ = [
  { q: 'Does it cost anything to join?', a: 'Creating a profile is free.' },
  { q: 'Which currency are my rates in?', a: 'One currency per rate card — yours. Brands see it converted to their own currency.' },
  { q: 'Can AI set my prices?', a: 'AI pre-fills your rate card from your channel numbers. You can edit every rate, and turn “Let AI adjust my rates” on or off.' },
  { q: 'I’m signed to an MCN. Can I still join?', a: 'Yes. If your MCN invited you, “Join as my MCN” is ticked when you sign up. You can also apply to an MCN later from your profile.' },
]

export const MCN_FAQ = [
  { q: 'What do MCNs get?', a: 'A public homepage for your roster, a talent manager dashboard, contracts with counter-offers, and a shared inbox for brand requests.' },
  { q: 'Can we use our own domain?', a: 'Your page lives at megaevolution.io/mcn/your-name first. Custom domains are planned.' },
  { q: 'How do creators join our MCN?', a: 'Send them your invite link. “Join as my MCN” is ticked by default when they sign up, and you approve the application.' },
]
