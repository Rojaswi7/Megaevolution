// Help center articles — PLACEHOLDER copy for the mockup. Real articles come from the Help CMS.
export type HelpArticle = { slug: string; topic: string; title: string; summary: string; body: string[]; audience: 'Brands' | 'Creators' | 'MCNs' | 'Everyone'; legal?: boolean }

export const HELP_TOPICS = ['Getting started', 'Creator search', 'Orders and payments', 'Video Editing Studio', 'Tools and plans', 'For creators', 'For MCNs', 'Account']

const a = (slug: string, topic: string, audience: HelpArticle['audience'], title: string, summary: string, body: string[]): HelpArticle => ({ slug, topic, audience, title, summary, body })

export const HELP: HelpArticle[] = [
  a('how-megaevolution-works', 'Getting started', 'Everyone', 'How MegaEvolution works', 'Three ways to work with creators: search yourself, let our team run it, or order edited videos.', [
    'MegaEvolution connects brands with local creators in each market. You can search and book creators yourself, hand the campaign to our agency team, or order edited videos from the Video Editing Studio.',
    'Every creator profile shows a starting rate in the creator’s own currency, converted to yours, so you know the price before you reach out.',
    'If you are not sure which path fits, send the short agency form. No brief is needed, and a manager replies with options.',
  ]),
  a('find-creators', 'Creator search', 'Brands', 'How to find creators by country and category', 'Use the filters for country, category, platform, follower range, engagement, minimum post count and language.', [
    'Open Creator search and pick a country and category. Results update as you change filters.',
    'Minimum post count hides accounts that are too new to judge. Language filters by the language the creator posts in.',
    'Save creators to a list to compare them later. Saving needs a free account.',
  ]),
  a('audience-analytics-limits', 'Creator search', 'Brands', 'How many audience breakdowns can I open?', 'Logged-out visitors can open 2 a day, verified brands 10, and paid plans more.', [
    'Audience analytics show where a creator’s followers live, their age and gender split, and what else they watch.',
    'Without an account you can open two breakdowns a day. Verified brands can open ten. Paid plans raise the limit.',
    'When you reach the limit the panel is blurred and you can sign up or upgrade to continue.',
  ]),
  a('order-a-package', 'Orders and payments', 'Brands', 'How to order a creator package', 'Pick a package on the creator’s profile, pay by card, then send your brief.', [
    'Each creator lists packages in My Rates. Choose one and pay by card through secure checkout.',
    'After payment you send the brief and any files. The creator accepts, then delivers a draft for your review.',
    'You can ask for the revisions included in the package. Payment is released when you approve the final post.',
  ]),
  a('payments-and-refunds', 'Orders and payments', 'Brands', 'Payments, receipts and refunds', 'Card checkout, receipts for every payment, and how refunds work.', [
    'All payments run through one checkout. A receipt is emailed for every payment and kept in your billing page.',
    'Refund terms are shown next to the pay button before you pay. Final terms are being confirmed.',
    'Teams can add per-brand invoices on shared orders from the organisation settings.',
  ]),
  a('studio-how-it-works', 'Video Editing Studio', 'Brands', 'How the Video Editing Studio works', 'Order, send your brief, review drafts, ask for revisions, download the final video.', [
    'Choose short or long videos and how many you need. Bundles of several videos are discounted.',
    'After payment, upload your footage and brief. An editor picks up the order and uploads a draft.',
    'Each order includes free revisions. Extra revisions can be bought from the order page.',
  ]),
  a('studio-subscriptions', 'Video Editing Studio', 'Brands', 'Plus and Max subscriptions', 'Monthly plans that lower the price of every video. Change or cancel any time.', [
    'Plus and Max are monthly subscriptions for teams that order videos regularly.',
    'Manage the plan yourself in the billing portal: upgrade, downgrade or cancel.',
  ]),
  a('tool-plans', 'Tools and plans', 'Brands', 'Tool plans: monthly, yearly and pay-per-use', 'Pay monthly, save with yearly, or pay for a single run.', [
    'Each tool can be used on a plan or paid for one run at a time.',
    'Yearly billing is cheaper than monthly. Enterprise plans are arranged with our team.',
  ]),
  a('connect-your-ai', 'Tools and plans', 'Everyone', 'Connect MegaEvolution to Claude or ChatGPT', 'Add the MegaEvolution connector and work from your AI assistant.', [
    'Add the connector URL https://api.megaevolution.io/mcp in your AI app’s connector settings, then sign in.',
    'You can then search creators, check orders and draft messages by asking in plain words.',
  ]),
  a('creator-my-rates', 'For creators', 'Creators', 'Set up My Rates', 'One currency per rate card. AI can pre-fill it and keep it up to date.', [
    'Your rate card uses one currency. Brands see it converted to theirs.',
    'AI pre-fills rates from your channel numbers. You can edit them, or let AI adjust them over time.',
  ]),
  a('creator-join-mcn', 'For creators', 'Creators', 'Join an MCN when you sign up', 'If an MCN invited you, “Join as my MCN” is ticked by default.', [
    'Sign-up links from an MCN carry the MCN’s name. Leave the box ticked to apply to join, or untick it.',
    'Your application shows as pending on your profile until the MCN responds.',
  ]),
  a('mcn-homepage-builder', 'For MCNs', 'MCNs', 'Build your MCN homepage', 'Blocks and templates for a public page listing your talent.', [
    'Pick a template, add blocks for your roster, services and contact form, then publish.',
    'Pages live at megaevolution.io/mcn/your-name. Custom domains come later.',
  ]),
  a('teams-and-roles', 'Account', 'Brands', 'Teams, roles and access requests', 'Invite teammates, set roles and approve access requests.', [
    'Admins invite members and set what each role can open. Agency Orders is only shown to roles that can use it.',
    'Members can request access to a brand or order; admins approve it from the team page.',
    'You can sign in with an email login code instead of a password.',
  ]),
  { slug: 'terms', topic: 'Account', audience: 'Everyone', legal: true, title: 'Terms & Conditions', summary: 'Placeholder for the Terms & Conditions.', body: ['Placeholder. The current Terms & Conditions from megaevolution.io move here unchanged.'] },
  { slug: 'privacy', topic: 'Account', audience: 'Everyone', legal: true, title: 'Privacy Policy', summary: 'Placeholder for the Privacy Policy.', body: ['Placeholder. The current Privacy Policy from megaevolution.io moves here unchanged.'] },
  { slug: 'cookies', topic: 'Account', audience: 'Everyone', legal: true, title: 'Cookie Policy', summary: 'Placeholder for the Cookie Policy.', body: ['Placeholder. The current Cookie Policy from megaevolution.io moves here unchanged.'] },
]

export const helpBySlug = Object.fromEntries(HELP.map((h) => [h.slug, h]))
