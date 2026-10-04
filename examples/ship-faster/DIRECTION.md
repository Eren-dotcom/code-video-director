---
title: Ship Faster — product intro
format: 1920x1080
duration: 15
fps: 30
source_brief: |
  Make a 15 second, 16:9 product intro. Start with a dark background, the logo fades in center,
  then the tagline "Ship faster" slides up under it, then three feature cards appear one by one
  left to right: Speed, Safety, Scale, with a soft whoosh when each card appears. End with the URL
  example.com. Brand color #6C5CE7. Music quiet under everything.
status: built
---

## Assumptions (user can override any of these)

- A1 — "dark background" has no hex → using `#0B0F14`.
- A2 — No font named → system UI font (no `@font-face` needed; swap for a shipped font if a brand font exists).
- A3 — No per-card timing given → 1.0 s apart (6.0 / 7.0 / 8.0), 0.5 s entrance each, hold until 12.0.
- A4 — "soft whoosh" volume → 0.6; "music quiet" → 0.2.
- A5 — Cards hold on screen 8.5 → 12.0 so all three are readable together.

## Open questions / blockers

- Q1 — No logo file provided. Using an inline placeholder SVG (purple rounded square with a check).
  **Not acceptable for delivery** — supply `assets/logo.svg` or `.png`.
- Q2 — No music/SFX files provided. `assets/make-placeholders.mjs` writes silent stand-ins so the
  project lints/renders; replace `assets/music.wav` and `assets/whoosh.wav` with real audio.

## Requirement Ledger

| ID  | Requirement (user's words)                                    | Type                         | Exact value / target                                                        | Status       |
| --- | ------------------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------- | ------------ |
| R1  | "15 second, 16:9"                                             | FORMAT + TIME                | root `data-width=1920 data-height=1080 data-duration=15`; last shot ends 15.0 | MUST         |
| R2  | "Start with a dark background"                                | STYLE                        | `#0B0F14` on body/#root, present from 0.0                                   | ASSUMED (A1) |
| R3  | "the logo fades in center"                                    | ELEMENT + MOTION + LAYOUT    | `#hero-logo`, opacity-only tween, centered; 0.3→1.1 s                        | ASSET NEEDED (Q1) |
| R4  | "then the tagline "Ship faster" slides up under it"           | SEQUENCE + TEXT + MOTION + LAYOUT | `#hero-tagline` text `Ship faster` verbatim; y 40→0; starts 3.0 (after R3); below logo | MUST |
| R5  | "then three feature cards appear one by one left to right"    | SEQUENCE + COUNT + LAYOUT    | exactly 3 `.card`; starts 6.0 / 7.0 / 8.0; DOM order left→right             | MUST         |
| R6  | card label "Speed"                                            | TEXT                         | `#cards-1` text `Speed`                                                      | MUST         |
| R7  | card label "Safety"                                           | TEXT                         | `#cards-2` text `Safety`                                                     | MUST         |
| R8  | card label "Scale"                                            | TEXT                         | `#cards-3` text `Scale`                                                      | MUST         |
| R9  | "a soft whoosh when each card appears"                        | AUDIO + TIME                 | 3× `<audio>` `assets/whoosh.wav` at 6.0 / 7.0 / 8.0, vol 0.6                 | ASSET NEEDED (Q2) |
| R10 | "End with the URL example.com"                                | ENDING + TEXT                | `#outro-url` text `example.com`, visible 12.0→15.0, nothing after            | MUST         |
| R11 | "Brand color #6C5CE7"                                         | STYLE                        | `#6C5CE7` on card borders, logo, URL                                         | MUST         |
| R12 | "Music quiet under everything"                                | AUDIO                        | `<audio id="music">` 0→15 s, vol 0.2                                         | ASSET NEEDED (Q2) |

## Shot List

| Shot | Start | End  | On screen (trace)                                   | Motion                                           | Audio                              | Element ids / file                        |
| ---- | ----- | ---- | --------------------------------------------------- | ------------------------------------------------ | ---------------------------------- | ----------------------------------------- |
| S1   | 0.0   | 3.0  | dark bg (R2); logo centered (R3)                    | logo opacity 0→1, 0.3→1.1 s                      | music starts (R12) vol 0.2         | `#hero` → compositions/hero.html, `#hero-logo` |
| S2   | 3.0   | 6.0  | logo stays; tagline "Ship faster" under it (R4)     | tagline y 40→0 + opacity, 3.0→3.6 s              | —                                  | `#hero-tagline`                           |
| S3   | 6.0   | 12.0 | three cards Speed / Safety / Scale (R5–R8, R11)     | each card y 30→0 + opacity 0.5 s at 6.0/7.0/8.0  | whoosh ×3 at 6.0/7.0/8.0 (R9)      | `#cards` → compositions/cards.html, `#cards-1..3` |
| S4   | 12.0  | 15.0 | URL example.com centered, brand color (R10, R11)    | URL opacity 0→1, 12.0→12.6 s; hold to 15.0       | music continues to 15.0 (R12)      | `#outro` → compositions/outro.html, `#outro-url` |

**Checks:** last End = 15 ✓ · every MUST ID traced (R1 root, R2 S1, R4 S2, R5–R8 S3, R10–R11 S4) ✓ ·
"then" ×2 → 3.0 > 0.3, 6.0 > 3.0 ✓ · quoted strings verbatim ✓ · count 3 ✓

Local-time note: sub-composition timelines start at 0 when their host clip starts. `cards.html`
places its tweens at local 0.0 / 1.0 / 2.0 = absolute 6.0 / 7.0 / 8.0. The SFX in `index.html` use
the absolute values.

## Proof plan (→ index.motion.json)

| Ledger | Assertion / check                                                                         |
| ------ | ----------------------------------------------------------------------------------------- |
| R1     | ffprobe duration 15.00, 1920×1080; `timeline --json` `.timeline.duration == 15`          |
| R3     | appearsBy `#hero-logo` 1.3; staysInFrame                                                  |
| R4     | before(`#hero-logo`,`#hero-tagline`); appearsBy 3.9; grep "Ship faster"                   |
| R5     | before chain cards-1→2→3; appearsBy 6.9 / 7.9 / 8.9; count of `#cards-*` rows == 3        |
| R6–R8  | grep each label; snapshot@9.0                                                             |
| R9     | timeline audio rows sfx-1/2/3 at 6.0/7.0/8.0 src=assets/whoosh.wav                        |
| R10    | before(`#cards-3`,`#outro-url`); appearsBy 12.8; staysInFrame; snapshot@14.9              |
| R11    | grep `#6c5ce7`; snapshot@9.0, @14.9                                                       |
| R12    | timeline audio row music 0–15 vol 0.2; ffprobe audio stream                               |

## Change log

- v1 — initial plan from brief; built; `lint` 0/0; `timeline` matches table.
