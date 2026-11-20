# HANDOFF — megaevolution.io full-site mockup

For the dev team building the real site. This repo is a clickable mockup of the whole future site: every planned feature has a screen, nothing talks to a server.

## Run it

```
npm install
npm run dev        # http://localhost:3000
npm run build      # 2,658 static pages, about a minute
npm start
```

Next.js 16 (App Router), React 19, TypeScript, plain CSS with tokens. No backend, no auth, no payments, no API keys.

## What is real and what is mocked

| Real (keep) | Mocked (replace) |
|---|---|
| Routes, URL structure, locale prefixes, hreflang, canonicals | All data in `/data` (sample creators, orders, messages, invoices) |
| Metadata patterns, JSON-LD, sitemaps, robots, OG image route | Login: dummy accounts in `data/accounts.ts`, stored in `localStorage` |
| Design tokens, components, layouts, copy | Checkout, card form, uploads, PDF export: success states only |
| `track()` call sites and `data-cta` ids | `track()` body (console log) |
| Pricing config shape (`data/pricing.ts`) | Currency detection (saved choice → domain → time zone) and FX rates |

## Values still TBD (all in `data/pricing.ts`)

| Value | Key | Note |
|---|---|---|
| Tool plan prices, monthly and yearly | `TOOL_PLANS[].monthly / .yearly` | Basic: $10 vs $19 not decided |
| Yearly saving | `YEARLY_DISCOUNT` | |
| Pay-per-use price per tool | `PAY_PER_USE` | |
| "from" price per tool | `TOOL_FROM` | |
| Studio short and long video prices, delivery time | `STUDIO.products` | |
| Bundle discount percentages | `STUDIO.bundles` | |
| Free revisions per order, paid revision price | `STUDIO.freeRevisions`, `STUDIO.paidRevision` | The orders screen assumes 2 free only to demo the free → paid switch |
| Refund terms | `STUDIO.refundNote` | Shown beside every pay button |
| Editing add-on price on creator profiles | `STUDIO.addOnFrom` | |
| Plus and Max price, videos included, saving | `STUDIO_SUBSCRIPTIONS` | |
| Audience breakdowns per day on paid plans | `ANALYTICS_LIMITS.basic / .pro` | Logged out = 2, verified brand = 10 are set |

Fill a number in and every page updates, including `Offer` JSON-LD (it carries no price while a value is TBD).

## Open questions for the team

1. **Facebook login.** The live site offers Google, Facebook and email. The mockup brief says "do not show Facebook anywhere", so the login shows email + login code only. Decide whether that rule covers sign-in buttons.
2. **Five languages.** Built as en, ko, ja, zh, vi. Confirm the set (`data/site.ts → LOCALES`).
3. **Client logos.** Typeset wordmarks stand in for Samsung, LG H&H, Olive Young, CJ, Hite Jinro and Sony. Real logo files and usage permission are needed.
4. **Old creator URLs.** `/$id` → `/@handle` needs an id-to-handle lookup (see `REDIRECTS.md`).
5. **Who sees Agency Orders.** Mockup: brand, MCN and the MegaEvolution team. The roles doc says platform admins, plus org-scoped Agency Orders for MCNs.
6. **Editor ↔ brand order state** is separate in the mockup; in production it is one order record.

## Pages

`[lang]` is `en` (no prefix), `ko`, `ja`, `zh`, `vi`. All pages live under `app/[lang]/`.

### Public

| Route | Main components | Data it needs from the real API |
|---|---|---|
| `/` | `Collage`, `HeroSearch`, `CreatorExplorer` (spotlight + tiles), `MarketMap`, `CaseCard`, `Faq` | Featured creators; creator search; markets; tool "from" prices; Studio prices; cases |
| `/creators` | `CreatorExplorer`, `CreatorCard`, `GateDialog` | Creator search with filters: country, category, platform, follower band, engagement, min. posts, language; later GMV |
| `/creators/[country]`, `/creators/[country]/[category]` | `CreatorExplorer`, `HubParts` (`MarketFacts`, `CategoryLinks`, `CountryLinks`), `lib/hubCopy` | Creators by market and category; counts per combination (drives `noindex` under 6) |
| `/@[handle]` (internal `/profile/[handle]`) | `RateCard`, `AudiencePanel`, `SaveButton`, `GatedButton`, `PlatformChrome` | Profile; per-platform stats; recent posts; rate card (one currency); audience analytics + daily view count; MCN; similar creators |
| `/about-agency` | `InquirySection` (`InquiryForm`), `CaseCard`, `MarketMap` | Inquiry endpoint; cases |
| `/video-editing` | `Portfolio`, `studio/shared` | Portfolio items per market (admin-managed); prices; subscriptions |
| `/video-editing/checkout` | `Checkout` | Cart pricing; auth; payment; brief + file upload; order creation |
| `/tools`, `/tools/[tool]` | `PlanTable`, `tools/demos` | Plans; per-tool usage; each tool's own API |
| `/pricing` | `PlanTable` | Plans, subscriptions, analytics limits |
| `/markets`, `/markets/[country]` | `MarketMap`, `CreatorCard` | Market facts; local manager (name + photo); top creators |
| `/case-studies`, `/case-studies/[slug]` | `CaseCard` | Cases (flexible fields, any can be empty) |
| `/mcn`, `/mcn/[name]` | `content/Interactive` | MCN public page from the homepage builder; roster |
| `/for-creators` | `RateCardMock` | — |
| `/connect-ai` | `ConnectTabs`, `CopyUrl`, `WaitlistForm` | Connector URL `https://api.megaevolution.io/mcp`; waitlist endpoint |
| `/help`, `/help/[article]` | `HelpBrowser` | Help CMS |
| `/blog`, `/blog/[slug]` | `BlogList` | Blog CMS (today: fetched from the Tistory blog) |
| `/login`, `/signup` | `content/Auth` | Auth; MCN invite lookup for "Join {MCN} as my MCN" |

### Logged in (`noindex`, blocked in robots.txt)

Shell: `components/workspace/Shell.tsx` (`WorkspaceShell`, `WsHead`, `Pill`), styles in `styles/workspace.css`. One screen per `?tab=`.

| Route | Screens (tabs) | Data it needs |
|---|---|---|
| `/preview` | Index of all roles and screens | — |
| `/preview/brand` | home, orders (Studio + creator orders, brief, drafts, revisions), lists, messages (read-only Campaign Inbox board), agency-orders, team (roles, access requests, login codes), billing (subscription, invoices, refunds), alerts | Orders, deliverables, revisions, lists, org members and roles, invoices, subscription |
| `/preview/agency` (MegaEvolution team) | home, agency-orders (compact / full, pricing options, listings), listup, messages (Gmail, creator board, search, AI-drafted replies), reports, clients, team, billing, lists, alerts | Agency orders and listings, Gmail integration, AI draft, reports, client orgs, per-brand invoices |
| `/preview/creator` | home, orders, messages, profile (pending MCN application), rates (AI pre-fill, AI auto-pricing), ranking, scripts, pdfs, earnings, lists, alerts | Profile, rate card, AI pricing, ranking, orders, earnings, PDF export |
| `/preview/mcn` | home, talent (applications), contracts (counter-offers), messages, builder (homepage), portal, agency-orders, billing, lists, alerts | Roster, applications, contracts, homepage blocks, payouts |
| `/preview/editor` | queue, mine, revisions, delivered, messages, lists, alerts | Studio order queue, briefs and files, drafts |

## Every planned feature and where to find it

Turn on **Review mode → Show roadmap tags** to see Live / In development / Planned on each one.

| Feature | Where |
|---|---|
| New main page | `/` |
| About Agency (Pattern A) | `/about-agency` |
| Search-first header, ⌘K | every page (`Header`, `CommandPalette`) |
| Header on phones, permission-aware Agency Orders tab | every page; tab shows for brand, MCN and team accounts |
| Site translated with context | `/ko`, `/ja`, `/zh`, `/vi` (chrome translated, body English) |
| New login and logged-in screens | `/login`, `/signup`, `/preview/*` |
| Success stories, Help/FAQ, ad tracking | `/case-studies`, `/help`, UTM capture in `lib/track.ts` |
| Studio page, pricing, checkout | `/video-editing`, `/video-editing/checkout` |
| Brief, My orders, revisions | checkout step 5, `/preview/brand?tab=orders` |
| Editor workspace | `/preview/editor` |
| Plus and Max, billing portal | `/video-editing#subscriptions`, `/preview/brand?tab=billing` |
| Portfolio videos per market + admin controls | `/video-editing#portfolio` ("Admin view (mock)") |
| Creator profile with My Rates | `/@minh.beauty`, `/preview/creator?tab=rates` |
| Audience analytics limits (2 / 10 / paid) | any profile; open a third profile logged out |
| AI auto-pricing, brand ranking | `/preview/creator?tab=rates`, `?tab=ranking` |
| Analytics and rate-card PDFs | "Export as PDF" on profiles, `/preview/creator?tab=pdfs` |
| Join my MCN at sign-up | `/signup?as=creator&mcn=lotus-talent` |
| Script Studio | `/tools/script-studio` |
| Tools page and plans | `/tools`, `/pricing` |
| AI Listup v2 | `/tools/ai-listup` |
| Performance Report | `/tools/performance-report` |
| AI Video Edit | `/tools/ai-video-edit` |
| Creator Commerce Data (coming soon) | `/tools/commerce-data`; disabled GMV filter, sort and card slot in creator search |
| Brand workspace + organisations | `/preview/brand` |
| Agency Orders | `/preview/agency?tab=agency-orders`, brand view at `/preview/brand?tab=agency-orders` |
| Campaign Inbox | `/preview/agency?tab=messages`, read-only at `/preview/brand?tab=messages` |
| MCN homepage builder | `/preview/mcn?tab=builder` → `/mcn/lotus-talent` |
| MCN contracts and counter-offers | `/preview/mcn?tab=contracts` |
| Talent manager dashboard + creator portal | `/preview/mcn`, `?tab=portal` |
| New payments core | shared checkout, receipts, refunds and billing screens |
| Connect your AI | `/connect-ai` |
| AI-native app | `/connect-ai#app` (waitlist) |

## SEO checklist as built

- Every public page is statically generated; first-page creator results are in the HTML.
- `pageMeta()` in `lib/seo.ts` sets title, description, canonical, hreflang (5 + `x-default`), Open Graph and Twitter for every page.
- JSON-LD: `Organization` + `WebSite`/`SearchAction` on `/`; `Service` + `Offer` on agency and Studio; `Product`/`Offer` on tool plans; `ProfilePage`/`Person` on profiles; `FAQPage` on every FAQ; `BreadcrumbList` on every page with breadcrumbs; `Article` on blog and case pages; `ItemList` on creator lists.
- `/sitemap.xml` → `/sitemaps/{pages,creators,markets,cases,blog}.xml`, each URL with hreflang alternates. `/robots.txt` blocks `/preview`, checkout and the debug query strings.
- Thin country × category pages (under 6 creators) are `noindex, follow` and left out of the sitemap.
- OG images are generated for the default, every creator and every case (`/og/...`).
- Fonts are self-hosted with `font-display: swap`. One `h1` per page. Flags and the map are lazy-loaded images with reserved space.

## Checks run on this build

- Automated sweep of 44 routes at 1920, 1440 and 390 px: status codes, no horizontal scroll, one `h1`, no console errors, alt text, labelled inputs.
- Lighthouse (mobile) on the production build:

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| `/` | 99 | 100 | 100 | 100 |
| `/creators/vietnam/beauty` | 100 | 100 | 100 | 100 |
| `/@minh.beauty` | 98 | 100 | 100 | 100 |
| `/video-editing` | 99 | 100 | 100 | 100 |
| `/creators` | 96 | 100 | 100 | 100 |

Scores were measured on localhost, where there is no network latency; expect lower Performance on real hosting, and re-run after deploy. JSON-LD and the sitemaps were checked for well-formed output, not submitted to Google's validators.

## Related files

`PLAN.md` (sitemap and build order) · `DECISIONS.md` (every judgment call) · `TRACKING.md` (events) · `REDIRECTS.md` (301 map) · `legacy/` (the previous Vite mockup, untouched).
