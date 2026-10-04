# Worked example — brief → ledger → shot list → build → proof → report

The complete project is in this repository at `examples/ship-faster/` (runnable:
`cd examples/ship-faster && node assets/make-placeholders.mjs && npx hyperframes preview`). This file
walks through the reasoning so you can reproduce the process on any brief.

## 1. The brief (verbatim)

> Make a 15 second, 16:9 product intro. Start with a dark background, the logo fades in center,
> then the tagline "Ship faster" slides up under it, then three feature cards appear one by one
> left to right: Speed, Safety, Scale, with a soft whoosh when each card appears. End with the URL
> example.com. Brand color #6C5CE7. Music quiet under everything.

## 2. Extraction (what a lawyer sees)

Two sentences produced **12 ledger rows** — see `examples/ship-faster/DIRECTION.md`. Note the
decisions that prevent drift:

- "fades in" → opacity-only tween. A `y` slide here would be a *different* motion verb than asked.
- "then" ×2 → three strictly increasing start times (0.3 → 3.0 → 6.0).
- "three … Speed, Safety, Scale" → one COUNT/SEQUENCE row **plus three TEXT rows**, so a dropped
  card shows up as its own ❌ in the report.
- "when each card appears" → three SFX rows whose `data-start` *derives from* the card times.
- "End with the URL" → the URL is the last thing on screen; nothing after it; it holds to 15.0.
- Logo and audio files were not supplied → `ASSET NEEDED`, with placeholders clearly marked
  "not acceptable for delivery".
- Background hex, font, card spacing, volumes → `ASSUMED`, each listed so the user can override.

## 3. Shot list → timing that the code copies

| Shot | Abs start | Abs end | Host clip (index.html)            | Local tween positions inside the sub-composition |
| ---- | --------- | ------- | --------------------------------- | ------------------------------------------------- |
| S1+S2| 0.0       | 6.0     | `#hero` `data-start=0 data-duration=6`  | logo 0.3; tagline 3.0                         |
| S3   | 6.0       | 12.0    | `#cards` `data-start=6 data-duration=6` | cards 0.0 / 1.0 / 2.0 (= abs 6 / 7 / 8)       |
| S4   | 12.0      | 15.0    | `#outro` `data-start=12 data-duration=3`| url 0.0 (= abs 12.0), holds                   |

The most common error at this step: writing `6.0 / 7.0 / 8.0` inside `cards.html`. Sub-composition
timelines are **local** — the host seeks them from 0 when the host clip begins. The audio clips in
`index.html` are on the **host** timeline, so they use absolute times.

## 4. Build decisions worth copying

- Host `index.html` contains only: root with exact `data-width/height/duration`, three
  sub-composition hosts, four `<audio id=…>` elements, and an empty paused `main` timeline.
  Lint: 0 errors, 0 warnings (the "root built from sub-compositions" convention is satisfied).
- Each sub-composition: everything inside `<template>` (style, root, script), root styled by
  `#root`, ids prefixed with the composition id (`#hero-logo`, `#cards-1`, `#outro-url`) so
  selectors are unique on the assembled page and the motion sidecar resolves them.
- `gsap.fromTo` everywhere (seek-safe on re-entry), explicit positions copied from the table, no
  CSS transforms on tweened nodes, no `visibility`/`autoAlpha` on clips.
- Brand color appears exactly as `#6c5ce7` in three places; grep-able.

## 5. Proof

`index.motion.json` (15 assertions) encodes R3–R5 and R10 as `appearsBy` / `before` /
`staysInFrame`. The remaining rows are covered by `timeline --json` (audio rows, duration), grep
(verbatim text, hex), ffprobe (container facts), and snapshots at 1.5, 4.5, 7.0, 8.0, 9.0, 13.5,
14.9.

Observed in this repository's sandbox (no browser available, so `check`/snapshots were not run
here — run them locally):

```
$ npx hyperframes lint
◇  0 errors, 0 warnings

$ npx hyperframes timeline
timeline 15s
graphics (3)
  |████████████████                        | #hero hero 0-6s src=compositions/hero.html
  |                ████████████████        | #cards cards 6-12s src=compositions/cards.html
  |                                ████████| #outro outro 12-15s src=compositions/outro.html
audio (4)
  |████████████████████████████████████████| #music music 0-15s src=assets/music.wav vol=0.2
  |                ██                      | #sfx-1 sfx-1 6-6.6s src=assets/whoosh.wav vol=0.6
  |                  ███                   | #sfx-2 sfx-2 7-7.6s src=assets/whoosh.wav vol=0.6
  |                     ██                 | #sfx-3 sfx-3 8-8.6s src=assets/whoosh.wav vol=0.6
```

Every row matches the shot list to the decimal. That is the standard: not "looks about right".

## 6. The report the user receives

```markdown
## Fidelity Report v1 — Ship Faster

**Gate:** lint 0/0 · check PASS (15 motion assertions) · timeline == shot list · 7 snapshots
reviewed · draft 15.00 s 1920×1080 30 fps, audio stream present

| ID  | Requirement                                   | Status      | Evidence                                                    |
| --- | --------------------------------------------- | ----------- | ----------------------------------------------------------- |
| R1  | "15 second, 16:9"                             | ✅ verified | ffprobe 15.000 s 1920×1080; timeline.duration 15            |
| R2  | "dark background"                             | ✅ verified | #0B0F14 (A1); snapshot@1.5                                  |
| R3  | "logo fades in center"                        | ⚠️ partial  | appearsBy 1.3 ✓ opacity-only ✓ centered (snapshot@1.5) — **placeholder logo, need your file (Q1)** |
| R4  | "then the tagline "Ship faster" slides up"    | ✅ verified | before(logo,tagline) ✓; appearsBy 3.9 ✓; y 40→0; grep ✓; snapshot@4.5 |
| R5  | "three cards one by one left to right"        | ✅ verified | before chain ✓; starts 6/7/8; snapshot@7.0 = card 1 only, @8.0 = 1–2, @9.0 = all |
| R6  | "Speed"                                       | ✅ verified | grep ✓; snapshot@9.0 left card                              |
| R7  | "Safety"                                      | ✅ verified | grep ✓; snapshot@9.0 middle card                            |
| R8  | "Scale"                                       | ✅ verified | grep ✓; snapshot@9.0 right card                             |
| R9  | "soft whoosh when each card appears"          | ⚠️ partial  | timeline sfx-1/2/3 at 6.0/7.0/8.0 vol 0.6 ✓ — **silent placeholder file (Q2)** |
| R10 | "End with the URL example.com"                | ✅ verified | appearsBy 12.8 ✓; staysInFrame ✓; snapshot@14.9 shows only the URL |
| R11 | "Brand color #6C5CE7"                         | ✅ verified | grep ×3 ✓; snapshot@9.0, @14.9                              |
| R12 | "Music quiet under everything"                | ⚠️ partial  | timeline music 0–15 vol 0.2 ✓ — **silent placeholder file (Q2)** |

**Built, with 3 open items** (all are missing files from you: logo, music, whoosh). Drop them into
`assets/` with the same names and I will re-run the gate and deliver.
```

Notice the headline is "built, with 3 open items", not "done" — the placeholders are real
deviations and the report says so first.
