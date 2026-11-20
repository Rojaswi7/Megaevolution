# PLAN — megaevolution.io full-site mockup

The whole future site as a clickable mockup: every planned feature has a screen, every price comes from one config file, and every public page is statically rendered for SEO. No backend, no auth, no payments — sample data in `/data`, forms that show success and send nothing.

## What was already here (and what happens to it)

| Was | Now |
|---|---|
| Vite + React single page (`src/`, `index.html`, `blog/`) rendered only in the browser | Moved to `legacy/` untouched. The site runs on Next.js in the same repo (see DECISIONS #1). |
| `src/styles.css`, 179 KB, seven review themes | Replaced by `styles/globals.css` + `styles/blocks.css` built on tokens. Two themes kept: **lime** (default) and **purple** (the Brand tab). |
| `src/data.js` markets, creators, currency maths | Rewritten as typed files in `/data` (Taiwan removed, TH / PH / MX / BR added). |
| `marketStrengths.js`, `blogPosts.js` (fetched from the live site and blog) | Reused as-is in `/data`. |
| Dotted map, flag and platform-icon helpers | Kept; the map is regenerated to include Brazil and served as one static SVG. |
| Logos in `public/` | Reused. |

## Sitemap

Public (indexable), each in 5 locales — English without a prefix, `/ko`, `/ja`, `/zh`, `/vi` with one:

```
/                                  main page
/creators                          creator search (filters + list)
/creators/[country]                11 country hubs
/creators/[country]/[category]     66 hubs (noindex when under 6 creators)
/@[handle]                         creator profile with My Rates
/about-agency                      agency landing page (Pattern A) + inquiry form
/video-editing                     Video Editing Studio
/video-editing/checkout            mock checkout → brief → order (noindex)
/tools                             tools hub + plans
/tools/[tool]                      ai-listup, performance-report, ai-video-edit, commerce-data, script-studio
/pricing                           all plans in one place
/markets, /markets/[country]       market pages
/case-studies, /case-studies/[slug]
/mcn, /mcn/[name]                  for MCNs + sample homepage-builder result
/for-creators                      creator side
/connect-ai                        Claude / ChatGPT / Cursor / Gemini
/help, /help/[article]             help center (+ terms, privacy, cookies)
/blog, /blog/[slug]
/login, /signup                    with dummy accounts for every role
```

Logged-in previews (`noindex`, blocked in robots.txt). Sign in with a dummy account on `/login`, or use **Review mode → Preview as**:

```
/preview                 index of every logged-in screen
/preview/brand           workspace, teams & roles, My orders (brief, status, drafts, revisions), lists, Campaign Inbox (read-only board), billing portal
/preview/agency          Agency Orders (compact / full), listings, Campaign Inbox (Gmail, creator board, AI replies), reports, per-brand invoices
/preview/creator         dashboard, profile + My Rates, AI auto-pricing, brand ranking, orders, Script Studio, PDFs, MCN application
/preview/mcn             talent manager dashboard, applications, contracts + counter-offers, homepage builder, signed-creator portal
/preview/editor          editor queue, order detail, draft upload, revisions
```

Crawl files: `/sitemap.xml` (index) → `/sitemaps/{pages,creators,markets,cases,blog}.xml`, `/robots.txt`, `/og/...png`.

## Components

Shared (`/components`): `Header` (search-first, ⌘K, mobile sheet, role-aware tabs), `CommandPalette`, `Footer`, `AppState` (currency, dummy account, theme, roadmap mode), `Money` + `CurrencySwitch`, `ui` (`Cta`, `TLink`, `SectionHead`, `Breadcrumbs`, `Faq`, `JsonLd`, `RoadmapTag`, `Trust`, `StickyCta`, `Stat`, `Todo`), `Icon` / `Flag` / `PlatformIcon`, `CreatorCard` (+ `Thumb`, `Avatar`), `CreatorExplorer` (+ `HeroSearch`, `QuickChip`), `MarketMap`, `CaseCard`, `forms` (`InquiryForm`, `NewsletterForm`, `WaitlistForm`), `client` (`TrackClicks`, `GateDialog`, `SaveButton`, `GatedButton`, `ReviewDock`), plus page-level pieces added in phases 2–3 (`PlanTable`, `AudiencePanel`, `RateCard`, `Checkout`, `Workspace` shell and its screens).

## Data files (`/data`)

`site` (URLs, locales, nav, CTA wording, public proof figures) · `pricing` (**every price, plan and limit, with `TBD`**) · `markets` · `categories` · `creators` (generated sample profiles) · `cases` (public figures only) · `tools` · `faq` · `help` · `blog` · `mcns` · `accounts` (dummy logins) · `workspace` (sample orders, messages, invoices, contracts) · `i18n` (chrome strings in 5 languages) · `searchIndex` · `mapView`.

## Build order

1. **Foundation** — tokens (lime + purple), layout, header, footer, currency + locale switches, `track()`, data files, SEO helpers (metadata, JSON-LD, sitemaps, robots, OG images), 404. Main page built here too, as the test bed for the design system.
2. **Money pages** — `/creators` + programmatic hubs, `/@[handle]`, `/about-agency`, `/video-editing` + checkout mock, `/tools`, `/pricing`.
3. **Everything else** — tool pages, markets, case studies, MCN, for-creators, connect-ai, help, blog, login / signup with dummy accounts, the logged-in previews, roadmap debug mode.
4. **Checks and docs** — desktop 1440 and mobile 390 on every route, Lighthouse on the four named pages, sitemap + JSON-LD validation, `DECISIONS.md`, `TRACKING.md`, `REDIRECTS.md`, `HANDOFF.md`.

Commit after each phase.
