# `DIRECTION.md` — template

Lives at the project root next to `index.html`. It is written **before** any HTML and updated on
every change request. It is the single source of truth for "what did the user ask for" — when the
code and `DIRECTION.md` disagree, the code is wrong.

If the official HyperFrames workflow also wrote a `BRIEF.md` / `STORYBOARD.md`, keep them; this file
is the fidelity layer on top (ledger + shot list + proof plan). Do not duplicate their content —
reference it.

```markdown
---
title: <short name>
format: 1920x1080          # exact canvas
duration: 15               # seconds, exact — equals root data-duration
fps: 30
source_brief: |
  <paste the user's description VERBATIM here — never paraphrased>
status: planned | built | verified | delivered
---

## Assumptions (user can override any of these)

- A1 — Background color not specified → using #0B0F14.
- A2 — Font not specified → Inter (shipped locally in fonts/).
- A3 — …

## Open questions / blockers

- Q1 — Logo file not provided. Need `assets/logo.svg` (or .png ≥ 1024px). Using a placeholder
  until then; the placeholder is NOT acceptable for delivery.

## Requirement Ledger

| ID | Requirement (user's words) | Type | Exact value / target | Status |
| -- | -------------------------- | ---- | -------------------- | ------ |
| R1 | … | … | … | MUST |

## Shot List

| Shot | Start | End | On screen (trace) | Motion | Audio | Element ids |
| ---- | ----- | --- | ----------------- | ------ | ----- | ----------- |
| S1 | 0.0 | 3.0 | dark bg (R2); logo centered (R3) | logo opacity 0→1 over 0.8s from 0.3s | music starts (R9) vol 0.25 | #s1, #logo |
| S2 | 3.0 | 6.0 | logo stays; tagline "Ship faster" under logo (R4) | tagline y+40→0 + opacity over 0.6s at 3.0s | — | #s2, #tagline |
| … | | | | | | |
| S5 | 12.0 | 15.0 | URL "example.com" centered (R8); logo small top (R3) | URL fade in 0.5s; hold to end | music fade out 13.5→15 (R9) | #s5, #url |

**Checks:** last End = `duration` ✓ · every MUST ID appears in a trace ✓ · sequence words →
increasing starts ✓ · all quoted strings verbatim ✓ · counts match ✓

## Proof plan (becomes index.motion.json)

| Ledger | Assertion |
| ------ | --------- |
| R3 | appearsBy #logo 1.2 |
| R4 | before #logo #tagline; appearsBy #tagline 3.7 |
| R5–R7 | before #card-1 #card-2; before #card-2 #card-3; appearsBy #card-3 9.5 |
| R8 | appearsBy #url 12.6; staysInFrame #url |
| R1 | ffprobe duration == 15.0; 1920x1080 |
| R9 | timeline --json has audio row src=assets/music.mp3 absStart 0 absEnd 15 |

## Change log

- v1 — initial plan from brief.
- v2 — user: "make the tagline red" → R4 color #E0245E; S2 updated; re-verified.
```

## Notes on filling it

- `source_brief` is sacred. Paste the exact text. If the user sent several messages, paste them all
  in order, labeled.
- `Start`/`End` are **absolute** seconds on the main timeline, with one decimal unless the brief
  gives finer timings. The HTML copies these numbers; it never re-estimates them.
- Element ids in the table are the ids you will use in HTML and in the motion sidecar. Decide
  them here so the proof can be written before the code.
- When a shot is a sub-composition (`data-composition-src`), note the file in the `Element ids`
  column; the host id, the inner `data-composition-id`, and the `window.__timelines` key must all
  match.
- A `[ADDED]` item in the shot list must point to a `[ADDED]` ledger row. No orphan creativity.
