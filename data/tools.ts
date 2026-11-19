// The five tools. Each one has a card on /tools and its own SEO page at /tools/[slug].
// status: live | dev | planned  (only shown when "Show roadmap tags" is on)
export type Tool = {
  slug: string; name: string; job: string; title: string; description: string; intent: string
  status: 'live' | 'dev' | 'planned'; comingSoon?: boolean
  steps: { title: string; text: string }[]
  features: { title: string; text: string }[]
  faq: { q: string; a: string }[]
}

export const TOOLS: Tool[] = [
  {
    slug: 'ai-listup', name: 'AI Listup', status: 'dev',
    job: 'Turn a brief into a checked creator list.',
    title: 'AI Listup — turn a campaign brief into a creator list',
    description: 'Paste a brief and get a shortlist of creators whose recent posts were checked against your must-haves. Review, relax a rule, and send the list to your agency listing.',
    intent: 'influencer shortlist tool',
    steps: [
      { title: 'Paste your brief', text: 'Product, market, budget and what the creator must be like. No template needed.' },
      { title: 'We search wide', text: 'Keywords are widened to related terms, in the local language, across Instagram, TikTok and YouTube.' },
      { title: 'Every creator is checked', text: 'Recent posts are read against your Must, Nice and Avoid cards, and each creator shows why they passed.' },
      { title: 'Review and send', text: 'Remove or restore creators, then create agency listings straight from the results.' },
    ],
    features: [
      { title: 'Brief → creator list', text: 'A brief in plain words becomes search rules you can read and edit.' },
      { title: 'Wide keyword search', text: 'One keyword expands to the words creators in that market really use.' },
      { title: 'Must / Nice / Avoid cards', text: 'An AI check of each creator’s posts against the three cards, with the evidence shown.' },
      { title: '“+N if you relax this”', text: 'See how many more creators you would get by loosening one rule.' },
      { title: 'Review your own list', text: 'Paste handles you already have and run the same check on them.' },
      { title: 'Create agency listings', text: 'Send approved creators straight into an agency order listing.' },
    ],
    faq: [
      { q: 'How is this different from the creator search?', a: 'Search filters by numbers. AI Listup also reads each creator’s recent posts, so it can check things like “has never promoted a competitor”.' },
      { q: 'Which platforms does it cover?', a: 'Instagram, TikTok and YouTube.' },
      { q: 'Can I check creators I already know?', a: 'Yes. Paste their handles and the same Must / Nice / Avoid check runs on your list.' },
    ],
  },
  {
    slug: 'performance-report', name: 'Performance Report', status: 'dev',
    job: 'One campaign report your client can read.',
    title: 'Performance Report — influencer campaign reporting',
    description: 'Campaign totals, engagement per platform next to the totals, charts, and a clean PDF for your client. Built from post links, so there are no screenshots to collect.',
    intent: 'influencer campaign report tool',
    steps: [
      { title: 'Add the post links', text: 'Paste the Instagram, TikTok and YouTube links from your campaign.' },
      { title: 'We collect the numbers', text: 'Views, likes, comments, shares and saves, refreshed on a schedule.' },
      { title: 'Read it by platform', text: 'Engagement per platform sits next to the campaign totals, so one strong channel can’t hide a weak one.' },
      { title: 'Send the PDF', text: 'Export a client-ready PDF in your language.' },
    ],
    features: [
      { title: 'Campaign totals', text: 'Reach, views and engagement across every post in one line.' },
      { title: 'Engagement per platform', text: 'Shown next to totals, not buried in a tab.' },
      { title: 'Charts', text: 'Views over time and creator-by-creator comparison.' },
      { title: 'Client PDF', text: 'A clean export with your logo and no tool branding.' },
    ],
    faq: [
      { q: 'Do creators need to connect their accounts?', a: 'No. Reports are built from public post links. Connected accounts add deeper numbers where creators allow it.' },
      { q: 'Can I share a live report?', a: 'Yes, with a view-only link, or export it as a PDF.' },
    ],
  },
  {
    slug: 'ai-video-edit', name: 'AI Video Edit', status: 'planned',
    job: 'A sample video from a script or raw clip.',
    title: 'AI Video Edit — storyboard and sample video from a script',
    description: 'Upload a video or a script, get a storyboard, then an AI sample video in several styles and languages, with voice previews. Use it to agree on a direction before the real edit.',
    intent: 'AI video editing tool for short video',
    steps: [
      { title: 'Upload a video or script', text: 'Raw footage, a finished ad you want to adapt, or just the script.' },
      { title: 'Check the storyboard', text: 'Scene by scene, with timing and on-screen text you can edit.' },
      { title: 'Pick a style and language', text: 'Preview voices and styles side by side.' },
      { title: 'Get a sample video', text: 'Share it for sign-off, or send it to the Video Editing Studio for a human edit.' },
    ],
    features: [
      { title: 'Video or script in', text: 'Start from what you have.' },
      { title: 'Storyboard first', text: 'Agree on the plan before anything is rendered.' },
      { title: 'Styles and languages', text: 'One idea, several markets.' },
      { title: 'Voice previews', text: 'Hear each voice before you choose.' },
    ],
    faq: [
      { q: 'Is the sample video final?', a: 'It is a draft for agreeing on direction. For a finished edit, order from the Video Editing Studio.' },
      { q: 'Which languages are supported?', a: 'The launch set is being confirmed. Korean, Japanese and English come first.' },
    ],
  },
  {
    slug: 'commerce-data', name: 'Creator Commerce Data', status: 'planned', comingSoon: true,
    job: 'TikTok Shop sales per creator and product.',
    title: 'Creator Commerce Data — TikTok Shop sales per creator',
    description: 'See which creators really sell: TikTok Shop sales per creator and per product, starting with Vietnam and the Philippines. Coming soon — join the waitlist.',
    intent: 'TikTok Shop creator sales data',
    steps: [
      { title: 'Pick a market', text: 'Vietnam and the Philippines first.' },
      { title: 'Search a creator or product', text: 'See estimated sales, units and the videos and LIVEs behind them.' },
      { title: 'Shortlist sellers', text: 'Add proven sellers to a list and brief them from the same place.' },
    ],
    features: [
      { title: 'Sales per creator', text: 'GMV and units, by period.' },
      { title: 'Sales per product', text: 'Which creators moved a given product.' },
      { title: 'Video and LIVE split', text: 'Where the sales actually came from.' },
      { title: 'In creator search', text: 'A GMV column and filter, right in the results.' },
    ],
    faq: [
      { q: 'When does it launch?', a: 'The date is not set. Join the waitlist and we will tell you first.' },
      { q: 'Which markets come first?', a: 'Vietnam and the Philippines, where TikTok Shop is a main shopping channel.' },
    ],
  },
  {
    slug: 'script-studio', name: 'Script Studio', status: 'planned',
    job: 'Scripts that pass the brand’s guidelines.',
    title: 'Script Studio — video scripts with a hook bank and guideline check',
    description: 'Write short-video scripts from a bank of proven hooks, check them against the brand’s guidelines before you film, and export a PDF to send for approval.',
    intent: 'short video script writing tool for creators',
    steps: [
      { title: 'Start from a hook', text: 'Browse the hook bank by category and market.' },
      { title: 'Write the script', text: 'Scene, line and on-screen text in one simple table.' },
      { title: 'Run the guideline check', text: 'Flags missing disclosures, banned claims and anything the brief asked you to avoid.' },
      { title: 'Export a PDF', text: 'Send it to the brand for approval before you film.' },
    ],
    features: [
      { title: 'Hook bank', text: 'Opening lines that worked, sorted by category.' },
      { title: 'Guideline check', text: 'Every script is checked against the brand’s brief.' },
      { title: 'PDF export', text: 'A clean script the brand can sign off.' },
    ],
    faq: [
      { q: 'Is Script Studio for creators or brands?', a: 'Creators write in it. Brands receive the PDF, or review the script in the order.' },
      { q: 'Does it write the script for me?', a: 'It suggests hooks and checks your draft. The voice stays yours.' },
    ],
  },
]

export const toolBySlug = Object.fromEntries(TOOLS.map((t) => [t.slug, t]))
