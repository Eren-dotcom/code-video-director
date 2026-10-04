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

## Type & Style

| Field                   | Value                                                                                   | Source        |
| ----------------------- | --------------------------------------------------------------------------------------- | ------------- |
| Type / arc              | Product promo (intro) · logo → tagline → 3 features → URL                               | MUST ("product intro") |
| Platform / format       | YouTube/web · 1920×1080 · 30 fps · 15 s                                                 | MUST          |
| Audience / tone         | developers / tech buyers; confident, calm, no hype                                      | ASSUMED       |
| Style                   | **Clean motion graphics**, dark (preset mood: Swiss Pulse, dark variant)                | ASSUMED       |
| Engine                  | CSS + GSAP; inline SVG; no 3D, no footage, no Lottie                                    | derived       |
| Palette                 | bg #0B0F14 · surface #141A23 · brand #6C5CE7 · text #FFFFFF / #C9CDD6                   | brand MUST; rest ASSUMED |
| Typography              | system-ui (no shipped font yet); headline 84/700 −0.02em; card 56/700; URL 72/600        | ASSUMED       |
| Shapes · texture        | 28 px radius cards, 2 px brand border; no gradients, shadows, or grain                  | ASSUMED       |
| Lighting · depth        | flat                                                                                    | ASSUMED       |
| Camera                  | static                                                                                  | ASSUMED       |
| Motion energy · easing  | medium; entrances 0.5–0.8 s `power2.out`/`power3.out`; no exits (scenes cut)            | ASSUMED       |
| Transition family       | hard cuts only                                                                          | ASSUMED       |
| Sound palette           | music bed vol 0.2 (R12) · airy whoosh ×3 vol 0.6 (R9) · no VO · no captions             | MUST / levels ASSUMED |
| References              | none given                                                                              | —             |
| Forbidden               | stock photos, emoji, extra taglines/outro, second accent color                          | ASSUMED       |

## Direction sheet (shown to the user)

- Type/style: product intro · clean motion graphics · dark · static camera · hard cuts
- 1920×1080 · 30 fps · 15 s · YouTube/web
- Arc: logo (0–3) → tagline (3–6) → three cards (6–12) → URL (12–15)
- Palette #0B0F14 / #141A23 / #6C5CE7 / #FFF · system font (send a brand font to swap)
- Sound: music bed 0.2, whoosh ×3 at 6/7/8 s, no voiceover, no captions
- Assets needed from you: logo.svg, music file, whoosh file (placeholders in use)

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

## Scene Breakdown

### Scene 0 — Global
- **Background:** #0B0F14 on `body` and `#root`, all 15 s.
- **Persistent elements:** none (no watermark, no progress bar, no captions).
- **Music bed:** `#music` assets/music.wav 0.0 → 15.0 vol 0.2 (R12); no fade authored (file should end cleanly or be trimmed to 15 s).
- **Final frame (14.97):** dark background + "example.com" centered in #6C5CE7. Nothing else.

### Scene 1 — Logo + tagline
- **Time:** 0.0 → 6.0 (6.0 s) · `compositions/hero.html` · host `#hero` · local = abs − 0
- **Purpose (trace):** R2 dark bg, R3 "logo fades in center", R4 "then the tagline 'Ship faster' slides up under it"
- **Narration / VO:** none
- **On-screen text (verbatim):** "Ship faster"

| Layer | Element id     | What                    | Position / size                                   | Color / type                 |
| ----- | -------------- | ----------------------- | ------------------------------------------------- | ---------------------------- |
| 0     | root bg        | solid                   | full frame                                        | #0B0F14                      |
| 1     | #hero-logo     | logo (placeholder SVG)  | centered column, 220×220, 28 px gap above tagline | #6C5CE7 mark, white check    |
| 1     | #hero-tagline  | h1 "Ship faster"        | centered under logo                               | 84/700 #FFFFFF, −0.02em      |

- **Camera:** static.

| Element       | In                                                              | Hold        | Out                       |
| ------------- | --------------------------------------------------------------- | ----------- | ------------------------- |
| #hero-logo    | 0.3 fade: opacity 0→1, 0.8 s, power2.out (opacity only — "fades") | 1.1 → 6.0 | none; hard cut at 6.0     |
| #hero-tagline | 3.0 slide-up: y 40→0 + opacity 0→1, 0.6 s, power3.out            | 3.6 → 6.0 | none; hard cut at 6.0     |

- **Transitions:** in = video start · out = hard cut at 6.0
- **Audio:** music continues (0.2). No SFX.

| Abs t | Frame                                                                 |
| ----- | --------------------------------------------------------------------- |
| 0.00  | dark frame, nothing visible                                           |
| 0.30  | logo begins to fade in at center                                      |
| 1.10  | logo fully visible, centered; space below it empty                    |
| 1.50  | ← snapshot: logo alone                                                |
| 3.00  | tagline starts 40 px low, transparent                                 |
| 3.60  | "Ship faster" settled directly under the logo                         |
| 4.50  | ← snapshot: logo + tagline, centered stack                            |
| 5.97  | last frame, identical to 4.50                                         |

- **Proof:** appearsBy #hero-logo 1.3; staysInFrame #hero-logo; before(#hero-logo,#hero-tagline); appearsBy #hero-tagline 3.9; staysInFrame; grep "Ship faster".

### Scene 2 — Feature cards
- **Time:** 6.0 → 12.0 (6.0 s) · `compositions/cards.html` · host `#cards` · **local = abs − 6.0**
- **Purpose (trace):** R5 "three feature cards appear one by one left to right", R6 "Speed", R7 "Safety", R8 "Scale", R9 whoosh, R11 brand color
- **Narration / VO:** none
- **On-screen text (verbatim):** "Speed" · "Safety" · "Scale"

| Layer | Element id | What           | Position / size                                      | Color / type                                   |
| ----- | ---------- | -------------- | ---------------------------------------------------- | ---------------------------------------------- |
| 0     | root bg    | solid          | full frame                                           | #0B0F14                                        |
| 1     | #cards-1   | card "Speed"   | left slot; 440×300; row centered; gap 48; padding 160 | #141A23, 2 px #6C5CE7, radius 28, text 56/700 #FFF |
| 1     | #cards-2   | card "Safety"  | center slot; same                                    | same                                           |
| 1     | #cards-3   | card "Scale"   | right slot; same                                     | same                                           |

- **Camera:** static.

| Element  | In (abs → local)                                                   | Hold        | Out                   |
| -------- | ------------------------------------------------------------------ | ----------- | --------------------- |
| #cards-1 | 6.0 → 0.0 slide-up+fade: y 30→0, opacity 0→1, 0.5 s, power2.out    | 6.5 → 12.0  | none; hard cut 12.0   |
| #cards-2 | 7.0 → 1.0 same                                                     | 7.5 → 12.0  | none                  |
| #cards-3 | 8.0 → 2.0 same                                                     | 8.5 → 12.0  | none                  |

- **Transitions:** in = hard cut at 6.0 · out = hard cut at 12.0

| Cue      | Abs time | Source            | Level | Tied to            |
| -------- | -------- | ----------------- | ----- | ------------------ |
| music    | cont.    | assets/music.wav  | 0.2   | —                  |
| #sfx-1   | 6.0      | assets/whoosh.wav | 0.6   | #cards-1 entrance  |
| #sfx-2   | 7.0      | assets/whoosh.wav | 0.6   | #cards-2 entrance  |
| #sfx-3   | 8.0      | assets/whoosh.wav | 0.6   | #cards-3 entrance  |

| Abs t | Frame                                                              |
| ----- | ------------------------------------------------------------------ |
| 6.00  | dark frame; all three slots empty                                  |
| 6.50  | "Speed" card in, left; two empty slots                             |
| 7.00  | ← snapshot: one card only                                          |
| 7.50  | "Speed" + "Safety"                                                 |
| 8.00  | ← snapshot: two cards; "Scale" just starting                       |
| 8.50  | all three cards in, evenly spaced, same baseline                   |
| 9.00  | ← snapshot: three readable cards with brand borders                |
| 11.97 | last frame identical to 8.50                                       |

- **Proof:** before chain cards-1→2→3; appearsBy 6.9 / 7.9 / 8.9; staysInFrame #cards-3; timeline rows sfx-1/2/3 at 6/7/8; count of `#cards-*` == 3.

### Scene 3 — URL end card
- **Time:** 12.0 → 15.0 (3.0 s) · `compositions/outro.html` · host `#outro` · **local = abs − 12.0**
- **Purpose (trace):** R10 "End with the URL example.com", R11 brand color
- **On-screen text (verbatim):** "example.com"

| Layer | Element id | What            | Position / size | Color / type        |
| ----- | ---------- | --------------- | --------------- | ------------------- |
| 0     | root bg    | solid           | full frame      | #0B0F14             |
| 1     | #outro-url | p "example.com" | dead center     | 72/600 #6C5CE7      |

- **Camera:** static.

| Element    | In (abs → local)                                  | Hold         | Out                           |
| ---------- | ------------------------------------------------- | ------------ | ----------------------------- |
| #outro-url | 12.0 → 0.0 fade: opacity 0→1, 0.6 s, power2.out   | 12.6 → 15.0  | none — video ends on this frame |

- **Transitions:** in = hard cut at 12.0 · out = end of video (hold ≥ 2.4 s ✓ readability rule)
- **Audio:** music continues to 15.0.

| Abs t | Frame                                            |
| ----- | ------------------------------------------------ |
| 12.00 | dark frame, URL transparent                      |
| 12.60 | "example.com" fully in, centered, brand color    |
| 13.50 | ← snapshot                                       |
| 14.97 | ← snapshot: final frame = declared end state     |

- **Proof:** before(#cards-3,#outro-url); appearsBy #outro-url 12.8; staysInFrame; snapshot @14.9 shows only the URL.

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
- v2 — added Type & Style declaration, Direction sheet, and full Scene Breakdown (no code change).
