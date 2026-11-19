# TRACKING — every analytics event in the mockup

All events go through one helper: `track(event, props)` in `lib/track.ts`. In the mockup it logs to the browser console (look for the lime `[track]` tag) and keeps the last 200 events on `window.__meEvents`. To go live, replace the body of `track()` with the real analytics call — no component changes.

Every event automatically carries: `path`, `ts`, and any captured ad parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `landing`).

## How clicks are tracked

- Every CTA has a `data-cta="…"` attribute (179 distinct ids). One listener (`TrackClicks` in `components/client.tsx`) turns any click on one into `cta_click` with `{ cta, label, href }`.
- Any button or arrow link without an id is still tracked, under `auto_<its label>`. Real analytics tools can hook the same `data-cta` attribute directly.
- Naming: `<place>_<action>`, e.g. `hero_search_creators`, `profile_order_package`, `sticky_order_video`, `nav_agency`, `footer_pricing`.

## Events

### Site-wide

| Event | When | Main props |
|---|---|---|
| `page_view` | Every page load | `title` |
| `utm_captured` | A visit arrives with UTM or gclid parameters | the parameters |
| `cta_click` | Any CTA is clicked | `cta`, `label`, `href` |
| `currency_changed` | Currency switch | `currency` |
| `language_changed` | Language switch | `to` |
| `search_opened` | Header search or Ctrl/⌘K opened | `via` |
| `search` | A search is run (hero, filters, palette, URL, quick chip) | `q`/`query`, `country`, `category`, `platform`, `source`, `results` |
| `search_result_click` | A ⌘K result is opened | `query`, `title`, `group` |
| `form_submitted` | Any form succeeds | `form` (`agency_inquiry`, `newsletter`, `waitlist`, `mcn_contact`, `signup`, …), `source` |

### Creator search and profile

| Event | When | Main props |
|---|---|---|
| `filter_changed` | A filter or sort changes | the filter and value, `source` |
| `filters_reset` | Clear filters | `source` |
| `results_load_more` | More results requested | `shown` |
| `market_selected` | A market is picked on the map | `market` |
| `creator_saved` | Save to list (logged in) | `handle`, `saved` |
| `package_selected` | A package is picked in My Rates | `handle`, `package` |
| `audience_viewed` | An audience breakdown is opened | `handle`, `used`, `limit` |

### Gates and paywalls

| Event | When | Main props |
|---|---|---|
| `gate_shown` | A gate appears | `gate`: `search_filters`, `search_results`, `save_to_list`, `audience_analytics`, `export_pdf_*`, `*_plan` |
| `gate_converted` | Sign up / log in / choose plan clicked from a gate | `gate`, `to` |
| `gate_dismissed` | "Not now" | `gate` |

### Checkout and plans

| Event | When | Main props |
|---|---|---|
| `checkout_started` | Studio checkout or a creator package order starts | `type`, `handle`, `package`, `usd` |
| `checkout_step` | Each Studio checkout step | `step` |
| `checkout_completed` | Mock payment succeeds | `type`, quantities, `plan` |
| `brief_submitted` | Brief sent after payment | `type` |
| `plan_selected` | A tool plan or Studio subscription is chosen | `plan`, `cycle`, `source` |
| `billing_cycle_changed` | Monthly / yearly toggle | `cycle` |
| `plan_changed` | Subscription changed or cancelled in the billing portal | `from`, `to` |

### Accounts

| Event | When | Main props |
|---|---|---|
| `login` | A dummy account signs in | `role`, `via` |
| `login_code_sent` | Email login code requested | — |
| `signup` | Sign-up submitted | `role`, `join_mcn` |
| `signup_role_selected` | Role picked on sign-up | `role` |
| `signup_join_mcn_toggled` | "Join {MCN} as my MCN" ticked or unticked | `checked` |
| `preview_role_changed` | "Preview as" in the review dock | `role` |
| `roadmap_tags_shown` | Roadmap tags switched on | — |

### Tools and AI

| Event | When | Main props |
|---|---|---|
| `tool_demo` | Any step of a tool's demo | `tool`, `step` |
| `report_exported`, `pdf_exported` | Report or PDF export | `kind`, `language` |
| `connector_url_copied` | Connector URL copied | — |
| `connect_app_selected` | Claude / ChatGPT / Cursor / Gemini tab | `app` |
| `portfolio_tab` | KR / JP / EN portfolio tab | `tab` |

### Logged-in workspaces

| Event | When |
|---|---|
| `workspace_tab` | A workspace screen is opened (`role`, `tab`) |
| `revision_requested`, `revision_resolved`, `final_approved`, `draft_downloaded`, `final_downloaded`, `receipt_downloaded` | Brand order actions |
| `draft_uploaded`, `order_picked_up` | Editor and creator delivery actions |
| `agency_orders_view`, `agency_order_stage_moved`, `agency_order_pricing_changed`, `listing_added`, `agency_request_*` | Agency Orders |
| `thread_opened`, `thread_stage_moved`, `ai_draft_inserted`, `reply_sent`, `message_sent`, `gmail_connected`, `gmail_disconnected` | Campaign Inbox |
| `team_role_changed`, `setting_changed` | Team and organisation settings |
| `rate_card_saved`, `ai_pricing_toggled`, `ai_rate_suggestion_accepted`, `creator_profile_saved` | Creator profile and My Rates |
| `mcn_application_sent`, `mcn_application_withdrawn`, `mcn_invite_link_copied` | MCN membership |
| `counter_offer_sent`, `counter_offer_accepted`, `counter_offer_declined` | MCN contracts |
| `homepage_template_selected`, `homepage_block_added`, `homepage_published` | MCN homepage builder |

## The revenue funnels to watch

1. **Creator order:** `search` → `cta_click (creator_card_view_profile)` → `package_selected` → `checkout_started` → `checkout_completed` → `brief_submitted`
2. **Video Editing Studio:** `cta_click (*order_video*)` → `checkout_started` → `checkout_step` → `checkout_completed` → `plan_selected` (Plus / Max upsell)
3. **Tool plans:** `tool_demo` → `plan_selected` → `signup`
4. **Audience analytics upgrade:** `audience_viewed` → `gate_shown (audience_analytics)` → `gate_converted`
5. **Agency inquiry:** `cta_click (*explore_your_campaign_options*)` → `form_submitted (agency_inquiry)`
6. **Sign-up from gates:** `gate_shown` → `gate_converted` → `signup`
