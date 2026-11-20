# REDIRECTS — 301 map from today's megaevolution.io to the new routes

All of these are permanent (301/308) and are implemented in `next.config.mjs → redirects()`.
Old routes were read from the current site's router (`apps/web/src/routes` in the main repo).
Keep this file and the config in sync.

## Public pages

| Current URL | New URL | Note |
|---|---|---|
| `/` | `/` | Same URL, new page. |
| `/search` | `/creators` | Creator search. Query strings are passed through. |
| `/$id` (creator profile by id) | `/@[handle]` | **Needs a lookup** from the old id to the handle at build or request time. Not in the mockup. |
| `/about` | `/about-agency` | |
| `/about-agency` | `/about-agency` | Same URL, new Pattern A page. |
| `/about-platform` | `/tools` | |
| `/about-creator` | `/for-creators` | |
| `/request-campaign` | `/about-agency#inquiry` | One merged inquiry form. |
| `/business-inquiry` | `/about-agency#inquiry` | |
| `/pricing` | `/pricing` | Same URL. |
| `/help-center` | `/help` | |
| `/help-center/[slug]` | `/help/[slug]` | Slugs must be carried over one to one. |
| `/support` | `/help` | |
| `/creator-registration` | `/signup?as=creator` | |
| `/terms-and-conditions` | `/help/terms` | |
| `/privacy-policy` | `/help/privacy` | |
| `/cookie-policy` | `/help/cookies` | |
| `/blog/post` (old mockup) | `/blog` | Posts now have their own URL: `/blog/[slug]`. |
| Market landing pages on the current site (e.g. the Vietnam / Indonesia service pages) | `/markets/[country]` | Map each one by country. Taiwan and Malaysia have no new page: send them to `/markets`. |
| Blog posts on `megaevolution-en.tistory.com` | `/blog/[slug]` | Only if the blog moves onto the main domain. Set canonical on Tistory first, then redirect. |

## Internal tidy-ups (so each page has exactly one URL)

| From | To | Why |
|---|---|---|
| `/en` and `/en/*` | `/` and `/*` | English has no prefix. |
| `/profile/[handle]`, `/[lang]/profile/[handle]` | `/@[handle]`, `/[lang]/@[handle]` | `/profile/…` is only the internal route behind `/@handle`. |

## Not redirected (stay as they are, behind login)

`/orders`, `/all-orders`, `/messages`, `/lists`, `/billing`, `/settings`, `/notifications`, `/proposals`, `/agency-orders`, `/admin/*`, `/auth/*`. In the mockup these are represented by the `/preview/*` screens, which are `noindex` and blocked in `robots.txt`.

## Before launch

1. Export the top landing URLs from Search Console and check each one resolves to a 200 or a single 301.
2. Build the id → handle lookup for old creator profile URLs.
3. Keep redirects for at least a year.
