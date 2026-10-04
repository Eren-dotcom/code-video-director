# Director decisions — what the AI must decide even when the user didn't mention it

Most briefs cover *content* and skip everything a real director decides. If the AI doesn't decide
these explicitly, it decides them by accident — and the user sees "not what I imagined". Decide
each one, write it in `DIRECTION.md` (`## Type & Style` or `## Assumptions`), and mark it
`ASSUMED` so the user can override with one word.

## A. Format & delivery

| Decision             | Default when unspecified                                                        | Where it lands                         |
| -------------------- | ------------------------------------------------------------------------------- | -------------------------------------- |
| Aspect / canvas      | from platform: YouTube 16:9 1920×1080 · Reels/TikTok/Shorts 9:16 1080×1920 · feed 1:1 1080×1080 · LinkedIn 16:9 or 4:5 1080×1350 | root `data-width/height`           |
| Frame rate           | 30 fps (60 for fast UI/kinetic, 24 for cinematic footage)                       | `render --fps`, cloud `fps`            |
| Length               | ad 15–30 s · promo 30–60 s · explainer 60–90 s · sting 3–5 s                    | root `data-duration`                   |
| Container            | MP4 H.264, AAC; `--quality delivery` for final                                  | render command                         |
| Multiple cuts        | if the user names several platforms → one project, variables/aspect per render  | `render --batch`, `/general-video` "one shoot many cuts" |
| Poster / thumbnail   | pick the strongest key frame; note its time                                     | `snapshot --at <t>`                    |
| Loop                 | only if asked or destination is a looping surface (web hero, display)           | first/last frame match                 |

## B. Story & pacing

| Decision             | Default                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Hook                 | the user's first described element arrives within the first 1.5–2 s; never prepend an intro sting or title the user didn't ask for |
| Arc                  | per type (see `video-type-and-style.md` § 1); write it as `hook → … → CTA`                           |
| One message          | one sentence the video must leave behind; every scene serves it (cut scenes that don't)             |
| Scene count & rhythm | social: a visual change every 2–4 s · explainer: every 4–8 s · cinematic: 5–10 s                    |
| Hold times           | title ≥ 1.5 s · sentence ≥ 0.25 s/word · stat ≥ 2 s · end card ≥ 2.5 s                                |
| Ending               | end *on* the thing the user named (URL, logo, CTA); hold it; no black tail, no extra outro          |
| CTA                  | **only if the user gave one** (verbatim). Never invent CTA copy; "end with the URL" means the URL only |

## C. Look

| Decision             | Default                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Palette              | 1 background, 1 surface, 1 brand accent, 2 text tones; brand hex exact; WCAG AA contrast (4.5:1)  |
| Typography           | one family (two max), shipped locally with `@font-face`; 3 sizes: headline / body / label; no `<br>` in body |
| Hierarchy            | one dominant element per frame; nothing else competes                                               |
| Layout grid          | 12-col or thirds; consistent margins (5 % safe zone); align baselines across scenes                 |
| Shapes & texture     | radius, borders, shadows, grain decided once and reused                                             |
| Imagery treatment    | footage graded with one treatment; images never stretched; faces not covered by text                |
| Logo usage           | user's official file only (never redrawn); clear space = logo height × 0.5; min 120 px wide         |
| Dark/light           | from brand or platform; dark for tech/cinematic, light for consumer/wellness                        |
| Brand references     | if the user names a brand/film/video as reference, extract 3 concrete traits and list them          |

## D. Motion

| Decision             | Default                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Motion energy        | low / medium / high → entrance durations 0.8 / 0.5 / 0.3 s                                         |
| Easing family        | entrances `power2.out`/`power3.out`/`expo.out`; exits `power2.in`; playful `back.out(1.4)`; never `linear` for UI |
| Stagger              | lists enter in order with 0.08–0.15 s stagger (or the user's "one by one" interval)                 |
| Camera               | static unless asked; if moving: one language (slow push-in, parallax, or whip) used consistently    |
| Transition family    | one: hard cut · crossfade 0.3–0.5 s · wipe · match-cut · shader (registry). Don't mix              |
| Ambient motion       | only if the style recipe includes it; never on the text itself                                      |
| Exit rule            | elements either exit (0.3 s) or the scene cuts; don't leave half-faded leftovers                   |
| Idle/frozen check    | nothing static > 2 s except intentional end card (`keepsMoving` scope)                              |

## E. Sound — **everything here is OFF unless the user asked** (`opt-in-content.md`)

| Decision             | Default                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Music                | **none unless requested.** When requested: mood from style; `data-volume` 0.15–0.3 under VO, 0.4–0.6 alone; starts at 0; ends with the video (fade 1–1.5 s) |
| Beat alignment       | if music exists, land scene changes on beats (`npx hyperframes beats`)                               |
| SFX                  | **none unless requested.** When requested: only on the moments the user named; vol 0.4–0.7         |
| Voiceover            | **none unless requested.** For explainer/tutorial types you may ask once ("silent or narrated?"); never add silently. When requested: script verbatim or approved first; voice gender/accent/language stated; TTS via `/media-use`; duck music under speech; scenes re-timed to the real voice |
| Loudness             | normalize VO (−16 LUFS target) — `normalize-audio`; no clipping                                     |
| Silence              | if user says "no music", every `<audio>` is removed; report it                                      |
| Avatar               | if the presenter is a HeyGen avatar: generate via API, place as `<video>`, graphics around it       |

## F. Text & accessibility

| Decision             | Default                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Language             | the brief's language; locale formats for numbers/dates/currency                                     |
| Captions/subtitles   | **none unless requested.** If there is speech and the destination is social you may ask once; when requested: `/embedded-captions` style, safe zone, ≤ 2 lines, word-timed |
| Readability          | body ≥ 48 px @1080p for phone viewing; ≤ 6 words/line; ≤ 2 lines; high contrast                      |
| Flashing             | no > 3 flashes/s; no full-frame strobes                                                             |
| Alt/meta             | title in `<title>`; composition id meaningful                                                       |

## G. Assets & sourcing

| Decision             | Default                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Source of each asset | user file → registry/catalog → `/media-use` resolve/generate → placeholder (clearly marked, never delivered) |
| Logo                 | user's; if missing → `ASSET NEEDED`, placeholder box labelled "LOGO"                                 |
| Icons                | one icon set (consistent stroke); from `/media-use`                                                 |
| Footage / images     | licensed; no watermarked stock; never AI-generated people presented as real customers              |
| 3D models            | GLB/GLTF, < 20 MB, loaded before seek                                                               |
| Fonts                | shipped in `fonts/`, licensed for video                                                              |
| Generation jobs      | fire TTS / music / image generation first and in parallel; build while they run                     |

## H. Templating & reuse

| Decision             | Default                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Variables            | if the user mentions "per customer", "many versions", "swap the name" → `data-composition-variables` + `render --batch` |
| Recipe               | after approval, offer to freeze the run as a recipe (`review-loop.md` § 4)                           |
| Handoff              | `DIRECTION.md` current; `index.html` commented with ledger IDs; assets named by scene                 |

## I. Process

| Decision             | Default                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Collaboration mode   | collaborative: show plan → sketches optional → build → preview → render on approval; autonomous only if the user says "just make it" (then one question before render) |
| Questions            | ≤ 3, only blockers; everything else `ASSUMED` and visible                                           |
| Usage budget         | check `npx hyperframes usage --json` at start and before render when available                     |
| Draft first          | `render --quality draft` for the gate; `delivery` only on approval                                  |

## How to present these to the user

Don't dump the whole list. Put the 8–12 that matter for this video in a short **"Direction sheet"**
in your first reply, each with its value and `(assumed)` where relevant, and say: *"Change any
line and I'll update the plan."* Example:

```
Direction sheet (assumed unless you said it)
• Type/style: product promo · clean motion graphics · dark
• 1920×1080 · 30 fps · 15 s · YouTube
• Arc: logo → tagline → 3 features → URL
• Palette: #0B0F14 / #141A23 / #6C5CE7 / #FFF
• Type: Inter 84/56/72, static camera, hard cuts, medium energy
• Sound: music bed vol 0.2 + whoosh ×3 (both requested) · no VO · no captions · no extra text
• Assets needed from you: logo.svg, music, whoosh
```
