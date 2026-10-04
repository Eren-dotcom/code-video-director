# Requirement Ledger — how to read a brief without losing anything

The ledger is the first section of `DIRECTION.md`. It exists because the single biggest cause of
"this is not the video I described" is **requirements silently dropped during reading**. The fix is
mechanical: extract before you interpret.

## Extraction procedure

Go through the user's description **sentence by sentence, then word by word**. For each sentence,
pull out every item in the categories below. Do not merge two requirements into one row. Do not
skip anything because it "seems obvious".

| Category     | Trigger words / shapes                                                               | Becomes a row of type |
| ------------ | ------------------------------------------------------------------------------------ | --------------------- |
| Subject      | nouns: logo, title, card, chart, person, product, photo, button, URL                 | `ELEMENT`             |
| Copy         | anything in quotes, a tagline, a label, a number shown on screen                     | `TEXT` (verbatim)     |
| Count        | "three", "a few" (→ ask or assume 3), "each", "every", "both"                        | `COUNT`               |
| Order        | then, after, next, before, finally, first, last, one by one, in sequence             | `SEQUENCE`            |
| Simultaneity | while, at the same time, meanwhile, over, under, with                                | `OVERLAP`             |
| Timing       | "at 5 seconds", "for 2 seconds", "quick", "slow", "hold", total length               | `TIME`                |
| Motion       | fade, slide, pop, bounce, zoom, pan, typewriter, count-up, wipe, spin, shake, pulse  | `MOTION` (exact verb) |
| Look         | colors (hex or names), dark/light, minimal, bold, font names, rounded, gradient      | `STYLE`               |
| Layout       | center, left, right, top, bottom, lower-third, corner, full-screen, split            | `LAYOUT`              |
| Media        | video file, image, music, voiceover, SFX, "my logo", a URL to capture                | `MEDIA` / `ASSET`     |
| Audio        | music, quiet/loud, duck, whoosh, click, voice, silence, "no sound"                   | `AUDIO`               |
| Format       | 16:9, 9:16, vertical, square, for TikTok/Reels/YouTube/LinkedIn, 1080p, 4K, fps      | `FORMAT`              |
| Audience     | "for investors", "for kids", "for developers"                                        | `TONE`                |
| Negatives    | "no", "don't", "without", "avoid", "never"                                           | `FORBIDDEN`           |
| Ending       | "end with", "last frame", "close on", CTA                                            | `ENDING`              |

### Implicit requirements you must still write down (as `ASSUMED`)

- Total duration when not stated (state your assumption, e.g. `ASSUMED 15s`).
- Aspect ratio when a platform is named (Reels/TikTok/Shorts → 9:16 1080×1920; LinkedIn/X feed →
  1:1 or 16:9; YouTube → 16:9 1920×1080).
- Language of on-screen text (the language of the brief unless stated).
- Background when none is described (state it: `ASSUMED dark #0B0F14 background`).
- Hold time for readable text (≥ 1.5 s for a short title; ≥ 0.25 s per word for sentences).

### Things that are NOT requirements (do not add them)

- Your taste. "It would look better with a gradient" is not in the brief.
- **A voiceover or narrator.** If the brief has no spoken words, the video is silent of speech.
- **Any on-screen text not quoted or clearly described** — no titles, labels, subtitles,
  "Introducing…", dates, footers.
- **Captions / subtitles, music, sound effects** when not mentioned.
- Filler: outros, "thanks for watching", social handles, extra taglines.
- Stock media the user did not ask for.
- A second CTA, a second logo appearance, a "cinematic" intro.

Write the absences down as `FORBIDDEN` rows (`F1 no voiceover`, `F2 no extra text`, `F3 no music`,
`F4 no captions`) so they get verified, not just remembered. See `opt-in-content.md`.

If you genuinely believe the video needs something the user did not ask for, add it as a row with
status `[ADDED]` and a one-line reason, and get it accepted (collaborative) or clearly flag it in
the report (autonomous). Never slip it in.

## Ledger format

```markdown
## Requirement Ledger

| ID  | Requirement (user's words)                | Type     | Exact value / target                      | Status |
| --- | ----------------------------------------- | -------- | ----------------------------------------- | ------ |
| R1  | "16:9, 15 seconds"                        | FORMAT   | 1920×1080, root data-duration=15, 30 fps   | MUST   |
| R2  | "dark background"                         | STYLE    | #0B0F14 (assumed exact hex)               | ASSUMED|
| R3  | "the logo fades in center"                | ELEMENT+MOTION+LAYOUT | assets/logo.svg, opacity 0→1, centered | ASSET NEEDED |
| R4  | "then the tagline 'Ship faster' slides up under it" | SEQUENCE+TEXT+MOTION+LAYOUT | text "Ship faster" verbatim; y +40→0; after R3; below logo | MUST |
| …   |                                           |          |                                           |        |
```

Rules:

- `Requirement` column quotes the user. Do not rewrite their words there.
- `Exact value` column is where interpretation happens — and it must be specific enough to code
  from and to test (a hex, a selector, a time, a count).
- One `ID` per atomic requirement. "logo fades in center" is three facts (element, motion,
  layout) but one *atomic* visual event; keep it one row with a compound type. "Three cards appear
  one by one: Speed, Safety, Scale" is **four** rows: the count/sequence row plus one `TEXT` row per
  card label (so a dropped card is visible in the report).
- Status `BLOCKED` must come with a proposal in the "Open questions" section.

## Self-test before leaving this step

- Count the sentences in the brief. If any sentence produced zero rows, re-read it.
- Count quoted strings in the brief. Each must have its own `TEXT` row.
- Count list items in the brief. Each must have its own row.
- Search the brief for "then / after / before / finally". Each must have a `SEQUENCE` row.
- Search for "no / don't / without". Each must have a `FORBIDDEN` row.
- Is total duration present? Is format present? If not, both are `ASSUMED` rows at the top.
