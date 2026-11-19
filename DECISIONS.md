# DECISIONS

Choices made where the brief was unclear or two items pulled against each other. Each one was settled by what best serves SEO, clicks and revenue.

| # | Decision | Why |
|---|---|---|
| 1 | **Moved the repo from Vite (browser-only rendering) to Next.js App Router**, in place. Old code is kept in `legacy/`. | The brief makes server-rendered pages non-negotiable; a Vite SPA ships an empty `<div>` to crawlers. Next gives static generation, per-page metadata, generated OG images and font self-hosting. Vercel detects it with no config. |
| 2 | **All public pages are statically generated**; nothing public waits on client JS. Filters, currency and gates enhance HTML that is already complete. | Crawlable and fast. The first page of creator results is always in the HTML and never gated. |
| 3 | **Five languages: English, Korean, Japanese, Chinese, Vietnamese.** English has no URL prefix; the others use `/ko`, `/ja`, `/zh`, `/vi`. | The brief says "5 languages" without naming them; these match the home markets with the most search demand. One line in `data/site.ts` changes the set. |
| 4 | **Header chrome is really translated; page body copy repeats English** in other locales. | The brief allows it. Routes, `hreflang` and dictionaries are real, so translation is a content job later, not a rebuild. |
| 5 | **Two-row header**: search, currency, language, log in and the one lime button on top; the nav underneath (it folds away on scroll). | Seven nav items plus a search-first bar don't fit one row at 1280px. Search stays visible at all times. |
| 6 | **Hero search filters the list right below it** instead of leaving the page; without JS it submits to `/creators`. | Seungchan's ask: visitors must reach creators immediately. One less page load before the first result. |
| 7 | **Categories sit as small icon links on the bottom line of the hero**, with quick chips under the search. | "Small icons, top right or under the search." Keeps the first screen about search. |
| 8 | **Local platforms are text, not logos.** Only Instagram, TikTok and YouTube get a logo; LINE, Naver, Douyin, Xiaohongshu etc. appear as plain names. Facebook is not in the data at all. | The brief limits logos to three and bans Facebook, but a market card for China or Japan is wrong without its local apps. |
| 9 | **Map labels appear on the active or hovered pin only**; all markets are also listed as flag chips above the map. | Seven Asian markets sit within a few pixels of each other at this scale; permanent labels collide. |
| 10 | **Client logos are typeset wordmarks marked `TODO: real logo file`.** | No logo files are in the repo, and recreating brand logos by hand would be wrong. LG H&H stays logo-only. |
| 11 | **Photos are neutral placeholders marked `TODO: real photo`.** Creator covers are flat colour tiles with the creator's own caption as cover text. | The brief bans AI-looking imagery. Typographic tiles look intentional and need no stock photos of real people. |
| 12 | **Every unset price renders as `$TBD`** straight from `data/pricing.ts`; nothing is invented. | Leadership should see exactly which numbers are still open. Filling a value in the config updates every page. |
| 13 | **`Offer` JSON-LD omits `price` while a price is TBD** (it is marked `PreOrder` / "Price to be announced"). | A fake price in structured data would be a false claim to Google. It switches to a real price automatically once the config has a number. |
| 14 | **Creator rates show the creator's currency first, the visitor's second** ("from ₫12M ≈ $472"). | One currency per rate card is the product rule; the conversion answers the buyer's real question. |
| 15 | **Currency detection is mocked** with saved choice → domain → browser time zone → USD. It never touches the URL. | No IP lookup in a mockup; and currency in the URL would split canonicals. |
| 16 | **Soft gate on search is a dismissible dialog**, shown once per visit after 20 results or 3 filter changes. | "Never block the first page." A wall would cost more sign-ups than it wins. |
| 17 | **Audience analytics gate counts per day in `localStorage`** (2 logged out, 10 for the brand account). | Mocks the real limit so the blurred state can be seen by opening a third profile. |
| 18 | **Country × category pages with fewer than 6 creators are `noindex, follow`**, left out of the sitemap and linked from their country hub. | Avoids thin duplicate pages while keeping them reachable. |
| 19 | **Creator profiles live at `/@handle`**, served by a rewrite to an internal `/profile/[handle]` route. | `@` is reserved in Next folder names. The public URL and canonical stay `/@handle`. |
| 20 | **Dummy accounts for every role** (brand, agency, creator, MCN, editor) on `/login`; one click signs in, in this browser only. | Requested during the build: every logged-in flow must be walkable with dummy data. Agency was added as its own role, since Agency Orders and the full Campaign Inbox belong to it. |
| 21 | **A "Review mode" dock** (bottom-left) holds the mockup-only switches: Preview as, theme, roadmap tags. | Keeps review controls out of the real UI. It is not part of the site to be built. |
| 22 | **Sales (GMV) has a disabled slot in three places**: a filter, a sort option and a line on each card. | The brief asks for a visible home for Commerce Data before it exists. |
| 23 | **Buttons have a hard navy edge that presses down**; no gradients, glows or glass anywhere. | The brief asks for flat lime / navy blocks that don't look AI-made. It also gives lime buttons a clear edge on the light page (contrast). |
| 24 | **Lime is never used as text on light backgrounds** — only as a fill with navy text, or as text on navy. | Lime on the page colour fails AA; both allowed pairings are above 13:1. |
| 25 | **Home page ships 84 of the sample creators**, the full set loads on `/creators`. | Keeps the home page HTML small for LCP while quick chips and filters still work. |
