# Fidelity Report — format

Post this in chat (and append it to `DIRECTION.md` under `## Fidelity Report vN`) before calling
anything "done", and again after every change request. It is **one row per ledger ID** — the user
must be able to find every sentence of their brief in it.

## Status vocabulary

| Status        | Meaning                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------- |
| `✅ verified` | implemented exactly as asked **and** backed by evidence named in the row                   |
| `⚠️ partial`  | implemented with a deviation (state it) or evidence is indirect (say which)                |
| `❌ not done` | missing — say why and what you need                                                       |
| `🔒 blocked`  | impossible as asked; alternative proposed in the row                                      |
| `➕ added`    | not in the brief; your addition; one-line reason; user may strike it                       |
| `↩ superseded`| replaced by a later instruction (name the new ID)                                         |

A row may be `✅` only with evidence from tooling or a looked-at snapshot. "I wrote the code for it"
is not evidence.

## Template

```markdown
## Fidelity Report v1 — <project name>

**Gate:** lint 0 errors · check PASS (N assertions green) · timeline matches shot list ·
7 snapshots reviewed · draft render 15.00 s, 1920×1080, 30 fps, audio stream present

| ID  | Requirement (user's words)                     | Status      | Evidence                                                                 |
| --- | ---------------------------------------------- | ----------- | ------------------------------------------------------------------------ |
| S0  | Type & style as declared (promo · clean motion graphics · dark · hard cuts) | ✅ verified | palette/type/easing identical in all 4 scenes (snapshots @1.5/4.5/9.0/14.9); no style break; transition family = cuts only |
| R1  | "16:9, 15 seconds"                             | ✅ verified | ffprobe 15.000 s, 1920×1080; root data-duration=15                        |
| R2  | "dark background"                              | ✅ verified | #0B0F14 on #bg (assumed hex, A1); snapshot@1.5                            |
| R3  | "the logo fades in center"                     | ⚠️ partial  | motion: appearsBy #logo 1.3 ✓; opacity-only tween ✓; **placeholder SVG — need your logo file (Q1)** |
| R4  | "then the tagline 'Ship faster' slides up under it" | ✅ verified | before(#logo,#tagline) ✓; appearsBy 3.9 ✓; y 40→0 tween; grep "Ship faster" ✓; snapshot@4.5 |
| R5  | "three feature cards appear one by one left to right" | ✅ verified | before chain card-1→2→3 ✓; timeline starts 6.0/7.0/8.0; snapshot@7.0 shows card-1 only, @8.0 cards 1–2, @9.0 all three |
| R6  | card label "Speed"                             | ✅ verified | grep ✓; snapshot@9.0                                                     |
| R7  | card label "Safety"                            | ✅ verified | grep ✓; snapshot@9.0                                                     |
| R8  | card label "Scale"                             | ✅ verified | grep ✓; snapshot@9.0                                                     |
| R9  | "a soft whoosh when the cards appear"          | ✅ verified | timeline audio rows sfx-1/2/3 at 6.0/7.0/8.0 src=assets/whoosh.mp3 vol 0.6 |
| R10 | "end with the URL"                             | ✅ verified | appearsBy #url 12.8 ✓; staysInFrame ✓; snapshot@14.9 shows URL, nothing else fading |
| R11 | "music quiet under everything"                 | ✅ verified | audio row music 0–15 s vol 0.2; ffprobe audio stream present              |
| R12 | "brand color #6C5CE7"                          | ✅ verified | grep ✓ on cards + URL; snapshot@9.0                                       |
| F1  | no voiceover (not requested)                   | ✅ verified | timeline audio rows = music + 3 sfx only; no SCRIPT.md / vo files         |
| F2  | no on-screen text beyond R4, R6–R8, R10        | ✅ verified | text inventory == {Ship faster, Speed, Safety, Scale, example.com}       |
| F4  | no captions (not requested)                    | ✅ verified | no caption track in timeline                                              |
| A1  | (assumed) background hex                       | ➕ added    | #0B0F14 — say the word and I'll change it                                 |

**Deviations you must know about:** R3 uses a placeholder logo until `assets/logo.svg` arrives.
**Nothing was added beyond A1.**

**Next:** preview is live at <URL>. Reply "render" for the final `--quality delivery` MP4, or name
the IDs to change.
```

## Rules

- Row `S0` is always first: it proves the declared type & style was kept across every scene.
- `F*` rows prove **absences** (no voiceover / extra text / music / captions unless asked). They
  need evidence like any other row: the audio inventory and the text inventory.
- Character videos add one row per dialogue line (`D1…`) with mouth/gesture/reaction evidence.
- Keep the user's words in column 2. They should recognise their own brief.
- Evidence names a tool result or a specific snapshot time. Prefer the strongest proof available:
  motion assertion > timeline row > ffprobe > grep > snapshot (snapshot is required *in addition*
  for anything visual).
- If any row is `❌` or `🔒`, lead the message with that — do not bury it under green rows.
- A report with any `⚠️`/`❌` cannot be summarised as "done"; say "built, with N open items".
- After a change request, report only the touched rows in full plus one line: "Untouched rows:
  re-ran check — still green."
