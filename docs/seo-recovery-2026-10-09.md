# SEO recovery implementation — 9 October 2026

Status: landing website deployed October 9 (commit `a6d8b7e`); backend, SFU and webclient implementation remains local. Owner: one developer + founder/content. Preserve the existing design. Success means new activated players, not raw pageviews.

## Updated baseline through October 8

Read all 34 added October 7–8 CSVs (4,195 data rows), including duplicate registration exports on October 7. Metrika now contains 474 CSVs across the supplied folders. Do not sum chart and table exports.

| Shared-counter measure | Sep 25–Oct 1 | Oct 2–8 | Change |
|---|---:|---:|---:|
| Visits | 7,003 | 6,372 | −9.0% |
| Yandex search visits | 2,156 | 2,065 | −4.2% |
| Google search visits | 1,012 | 1,050 | +3.8% |
| Direct visits | 2,160 | 1,741 | −19.4% |
| Steam referrals | 640 | 527 | −17.7% |
| Landing pageviews | 3,122 | 2,829 | −9.4% |
| Homepage pageviews | 1,415 | 1,239 | −12.4% |
| Steam guide pageviews | 314 | 98 | −68.8% |
| Roblox news pageviews | 709 | 851 | +20.0% |
| Voice-chat pageviews | 120 | 117 | −2.5% |
| Registration-goal visits | 496 | 275 | −44.6% |

Oct 7–8 vs Sep 30–Oct 1: visits 1,733 → 1,759 (+1.5%), Yandex+Google 766 → 858 (+12.0%), landing pageviews 733 → 802 (+9.4%), registration-goal visits 76 → 52 (−31.6%). Search traffic has recovered modestly; these two days cannot establish the effect of the October 7 edits. Neither day contains synthetic `/native/` pageviews. A subsequent read-only production check confirmed that the native reporter is deployed but METRIKA_MP_TOKEN is unset. The Mac release and Windows native shift make registration-goal comparisons unreliable as true signup counts.

The prior GSC conclusion remains unchanged because no newer GSC export was supplied: Sep 21–27 vs Sep 28–Oct 4 clicks 835 → 754, impressions 17,845 → 18,953, CTR 4.68% → 3.98%, weighted position 6.51 → 6.40. October 5 is excluded as incomplete. No conclusion about a penalty or universal ranking loss is established.

Known-query clusters in the same matched weeks also show a changing audience mix: brand 574 → 543 (−5.4%), general voice chat 302 → 263 (−12.9%), Steam 203 → 80 (−60.6%), Roblox 489 → 640 (+30.9%). These are mutually exclusive parser categories within the disclosed query sample, not complete search demand or attributed signups. The growth in Roblox traffic does not establish recovery in core product intent.

## Production reconciliation, read-only

The deployed native signup reporter exists, but `METRIKA_MP_TOKEN` is unset in the inspected production environment. PostHog is configured. Native Metrika delivery therefore cannot occur under that configuration. Do not fabricate a token or retroactively attribute synthetic native events to SEO; the new backend ledger is the primary scorecard.

UTC account creation in the users table: October 7 = 49, October 8 = 38. The matched recent weeks are **591 → 414 (−30.0%)**, September 25–October 1 versus October 2–8, compared with Metrika goal visits **496 → 275 (−44.6%)**. A real signup decline remains; tracking amplifies its apparent size. Two-day comparison: September 30–October 1 **101** versus October 7–8 **87** (−13.9%). These are database account rows, not period-unique Metrika visitors or a platform split. The current schema does not retain the original platform for historical signups; do not infer it from the gap.

## Reproduce and interpret reporting

From landing:

```sh
node scripts/metrika-clusters.mjs ../analytics/metrika --json > /tmp/mute-metrika.json
node scripts/metrika-clusters.mjs ../analytics/metrika --gsc ../analytics/search-console --complete-through 2026-10-04
node --test scripts/tests/*.test.mjs
```

Parser rules: identify report schemas, use dates in goal rows, deduplicate repeated goal dates, never assign a monthly total to a day. Conflicting monthly/daily rows are flagged with provenance and the narrower report period wins. September 17 download reports disagree (23 daily vs 25 monthly); do not silently sum or average them. September 21 uses the source report's total visits/visitors, without fabricating missing engagement fields. Missing goal dates remain missing. Pageviews are additive across query variants; unique visitors are not. Synthetic native hits are separate from application views. A GSC completed-day cutoff is explicit, never guessed from a low number.

## Implementation scope

- Native architecture, platform requirements, account requirements and Steam broadcasting facts corrected. Removed unsupported guaranteed ping/FPS/resource comparisons. Original URLs retained.
- Homepage copy and compact proof section updated; no performance numbers invented. Explicit installer choices on every device, browser fallback, reduced motion and improved muted-text contrast.
- Metrika uses deferred initialization plus one initial/SPA hit. CTA goals preserve their names and include page/placement; internal navigation no longer writes campaign UTMs.
- Anonymous first acquisition is preserved in `mute_acquisition` for 30 days on `.mute.ac`; `mute_cta` lasts one hour. Fields: source, medium, landing path and click location. No account identifiers, full referrer URLs or arbitrary query values. Existing cookies blocked/unavailable means attribution can remain unknown.
- Web signup accepts optional `acquisition`; the server allowlists fields and forces native acquisition to unknown. Existing clients remain compatible.
- `growth_signups` stores backend-confirmed signup context. `growth_activations` stores one qualifying activation per user and acts as a durable PostHog outbox; retries reuse the event UUID.
- First-call guidance clarified in the Russian empty friends view.

Activation v1: at least two participants with connected send/receive transports and observed audio packet progression (or intentional mute after confirmed audio), fresh SFU observations no more than 20 seconds apart, for 60 seconds. Observation is conservative: setup, unconfirmed early seconds and intervals interrupted by a backend restart do not count. Eligibility is checked against the database signup timestamp within seven days. Signaling joins and empty rooms do not count. No extra SFU stats polling was added. The new health fields must be deployed on SFU nodes; older nodes yield no activation rather than false positives. This confirms a connected audio session, not that a human subjectively heard every word.

## Deployment and verification

**Live-call constraint from Alex:** do not restart the production backend without asking Alex first. No production backend/SFU restart, migration, or deployment has been performed during this work. On October 9, the landing website alone was deployed at Alex’s request; only `mute-landing` restarted. Backend and SFU process IDs, uptimes and restart counts were verified unchanged. Database tests remain local and isolated.

1. Review all four repositories: landing, webclient, backend, sfu-node. Apply the backend migration using the existing process before enabling the new backend. Tables are additive; account deletion cascades metrics deletion. No migration has been run against production.
2. Deploy additive SFU health fields and backend, then landing and webclient together. Rolling clients remain compatible because signup context is optional. Native installers are unchanged. Native Metrika reporting remains disabled until a valid token is configured through the normal secret-management process; the backend ledger and PostHog provide primary measurement meanwhile.
3. In the production environment, inspect configuration presence with `node scripts/growth-scorecard.js --check-config`. This prints booleans only. Verify native Measurement Protocol delivery independently; a configured token is not proof of successful delivery.
4. Reconcile actual signups and activation after migration with `node scripts/growth-scorecard.js 2026-10-09 2026-10-16`. It opens a read-only transaction and outputs aggregate UTC cohorts, attribution coverage and pending activation deliveries. Compare timezone-aligned days. Historical activation cannot be backfilled from this new observation stream; unknown platform/acquisition must stay unknown.
5. Verify a real web organic→CTA→signup path, a native signup, a two-person call, a group call, a sub-minute call and a failed call. Check one logical `user_activated` per eligible user and no growing outbox backlog. Use test accounts and ordinary calls, not production data edits.
6. Roll back application code if necessary; keep the additive analytics tables. Older SFU/client code remains compatible. Do not drop collected metrics during rollback.

Local checks: production build, content checker, schema/reporting tests, acquisition tests, backend registration tests, calls-context tests, SFU health tests, isolated PostgreSQL eligibility/retry tests, and `node scripts/verify-seo.mjs` against a local build. Browser platform checks simulate UAs in Chrome; physical OS/browser smoke tests remain a deployment gate.

## Page ownership and editorial queue

| Page | Primary intent | Next action |
|---|---|---|
| `/` | Lightweight native calls for gamers | Publish current copy; later add verified benchmark teaser |
| `/voice-chat` | Browser calls with friends | Preserve existing title; observe query/device results |
| `/download` | Installation and requirements | Verify explicit choices and conversion quality |
| `/discord-alternative` | Evaluate Mute against Discord | Current facts and comparable capabilities |
| Alternatives roundup | Fair multi-product comparison | Recheck each vendor before material changes |
| `/voice-chat/screen-share` | Product capability | Keep OS/browser caveats consistent |
| Existing screen-sharing article | Practical how-to | Correct Steam facts; relevant product CTA |
| `/games/steam` | Troubleshooting | Observe event-demand decay; avoid causal certainty |
| Benchmark draft | Resource evidence | Publish only after Windows measurements |

Oct 12–18: deploy measurement/factual fixes; reconcile actual backend signups; export missing search data. Oct 19–November 1: run the first three-app benchmark and review existing product pages. November 2–15: inspect complete cohorts and begin selective outreach after proof is published. November 16–December 6: evaluate completed 28-day windows and concentrate on productive evergreen clusters. At most one substantive new article per week; no new synonym pages.

Preserve recent titles through approximately November 4 unless a factual error requires correction. Record deployment time, page, change, expected effect and comparison window here. October 9 is now the landing deployment date; backend, SFU and webclient changes have no production deployment timestamp yet. Acquisition cookies are live on the landing; end-to-end signup attribution and activation await those separate deployments. Separate branded/non-branded, evergreen/event-led, Yandex/Google and desktop/mobile results; do not infer conversions from engagement alone.

## Evidence gates and work requiring access or elapsed time

- Windows benchmark: this workspace runs on macOS and has no Windows measurement results. Draft: `content/drafts/blog/legkiy-golosovoy-chat-dlya-igr.md`. Use the existing Windows footprint specification, initially Mute, Discord, TeamSpeak 6. Preserve raw runs, versions, machine record and failed scenarios. Publish only after verifying every numerical claim against results, then add the homepage/download/comparison links. Do not put a draft in the sitemap.
- Wordstat/Webmaster: authenticated Russian volume and query×page×date exports are not supplied. Gather broad/constrained phrases, devices and history before adding game pages. Wordstat volumes are not interchangeable with GSC impressions.
- A read-only check through the existing `mute-prod` SSH connection verified aggregate account creation and configuration: database and PostHog configured, native Metrika token absent, reporter present. No credentials were copied and no production settings changed. Backend UTC account-creation totals are not the same measure as Metrika goal visits; report timezone and deleted-account treatment must be aligned before exact reconciliation.
- GSC after October 7, localized SERPs, current field Core Web Vitals and backlink history are still needed. User-agent simulation is not an actual Windows/Mac/iPhone call test or a Russia-network availability test.
- D7 repeat-call retention is not inferred from the one-time activation ledger. Use a separate verified recurring-call dataset before adding that scorecard metric.
- No outreach has been sent. Drafts and recipients must be fact-checked after benchmark publication. No paid links, bulk submissions or duplicate promotional posts.

## Primary scorecard

New activated users weekly; backend-confirmed signups; signup→activation within seven days for complete cohorts; known organic acquisition separately from unknown native acquisition; qualified non-brand evergreen clicks; query/page CTR, impressions and position. Set a numeric growth target only after collecting a corrected baseline.

## Verification results, October 9

- Landing production build and content checker: pass; all 62 sitemap pages remain valid in the local crawl.
- Browser checks: one initial hit, one SPA-navigation hit, no automatic installer navigation, one explicit Windows download goal, correct legacy redirect and 404. Simulated Windows, Mac, Linux, Android and iPhone widths pass; no horizontal overflow or page errors. Mac architecture is not inferred from browser UA; both compatible and Intel users receive explicit requirements and a web option.
- Backend: registration/acquisition, activation and call-context regression tests pass. Activation additionally rejects a stale partner at the minute boundary and rotating short-lived partners. Isolated PostgreSQL verifies minimum duration, seven-day eligibility, concurrent duplicate prevention, delivery retries with a stable UUID, and account-deletion cleanup.
- SFU health regression tests: 44 passed. Web acquisition/auth-service tests: 8 passed. CSV parser fixtures: 4 passed.
- Changed landing files lint with no errors; two existing noscript tracking-image warnings remain. Full repository lint also reports pre-existing errors in CookieBanner, the help article's internal anchor, and ecosystem.config.js. These are not production-build failures.
- Lighthouse 13.5.0 local production build: mobile performance **98 / 96 / 97 / 96** for home / voice-chat / download / Steam; desktop **100** on all four. Automated accessibility and SEO checks score **100** on all eight runs. Mobile LCP is **2.49 / 2.78 / 2.62 / 2.77 seconds**; CLS is zero. Several mobile pages still exceed the 2.5-second good-LCP boundary in this simulated run.
- Measurements are local lab results with analytics requests blocked, not Russia-network results, field Core Web Vitals, a guarantee of ranking, or a native-client resource benchmark. One final run per page/device; do not treat the scores as statistically stable. Compact results are in `docs/measurements/2026-10-09-lighthouse.json`.

Repeat Lighthouse against the local production preview using Lighthouse 13.5.0, performance/accessibility/SEO categories, default mobile settings or the desktop preset, and block `*mc.yandex.ru/*` and `*top-fwz1.mail.ru/*`. Keep live counter traffic out of local verification. The separate browser regression script also intercepts all non-local requests.

## Landing deployment log

October 9, 2026, approximately 20:53 Asia/Tbilisi (16:53 UTC): deployed landing commit `a6d8b7e` through the existing website-only deployment script. Production build and content check passed; IndexNow accepted the update (HTTP 200). Backend and SFU process IDs, start timestamps and restart counts match the pre-deployment snapshot. No nginx reload or application-backend restart. Private analysis, parser work and the benchmark draft were excluded from the public deployment commit. Observe affected pages from this timestamp; preserve the existing title observation window.

Post-deployment live verification passed: all 62 sitemap pages, one initial and one SPA pageview, explicit installer choice, five simulated platforms, legacy 308 redirect and missing-page 404. Browser verification blocked outgoing analytics and installer requests. Mobile screenshot inspected; no overflow.

October 9 follow-up: at Alex’s request, removed the hero account/Mac-requirements note (`0036f5f`) and then the complete three-column native-client/feature/invitation section (`2fcd031`). The lightweight voice-chat headline and native Windows/macOS subtitle remain. Compatibility information stays on the download page. These follow-up deployments affect the landing website only.

October 9 positioning follow-up (`4fa07c3`): replaced architecture-led marketing with plain-language resource benefits across the hero, download/comparison pages, two evergreen articles, FAQ and AI summaries. Alex refined the hero to «Общайтесь во время игры без лишней нагрузки на компьютер» and requested an announcement of upcoming comparative measurements without a date. Titles, URLs and historical releases unchanged; existing October 9 modification dates remain correct. Content check, changed-file lint and production build pass; hero inspected at 1440, 390 and 360 px. No analytics, backend, SFU or webclient files included.

October 10 follow-up (`b8ef018`): Alex requested restoration of the previous platform download flow. Windows/macOS again start the matching installer automatically; mobile and iPad redirect to the browser app; unknown platforms retain manual choices. Existing goal names preserved with auto/page/placement properties. Manual fallback and current Windows 1.0.5 / Mac 1.0.4 requirements remain. Local seven-platform browser regression and 62-page SEO check passed. This supersedes the earlier explicit-download-only acceptance criterion; backend/SFU remain outside this deployment.

October 10 design follow-up (`60f4ddf`): Alex requested the original download-page appearance as well. Restored the pre-SEO download component markup: original logo/image sizing, inline retry link, installation and Telegram cards, manual installer links for unknown platforms. Preserved current download URLs and the already-restored automatic routing with deduplicated goals. Updated article copy remains below the restored component. Build, content check, lint, seven-platform browser checks and desktop/narrow visual inspection passed.

October 29, 2026, approximately 19:10 Asia/Tbilisi (15:10 UTC): deployed landing commit `3ca5773` through the website-only deployment script (build and content check passed on the server, IndexNow HTTP 200, only `mute-landing` restarted; backend and SFU uptime unchanged). Changes: 29 Oct status lines on the Discord, Steam and Roblox pages; `/games/cs2` description no longer gives the answer and gained the «Не слышу тиммейтов в CS2» section (expect CTR > 1 % from 0.1 %, compare 18–29 Oct vs 30 Oct–12 Nov); checklist post seoTitle in the «не слышу тиммейтов в кс 2» form; Roblox post seoTitle «Что будет с Roblox 1 ноября 2026 и когда вернут чат» with the 1 Nov section moved second (temporary, revert after 15 Nov; expect > 4 % CTR on that cluster); descriptions of `/games/roblox`, `/voice-chat` (mobile and «без случайных собеседников») and the Discord «что делать» post. These are the only title changes made inside the 4 Nov observation window, all on pages under 1 % CTR. Full diagnosis in `docs/seo-keyword-research-2026-09.md` §11.
