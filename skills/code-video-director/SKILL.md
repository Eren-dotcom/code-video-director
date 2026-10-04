---
name: code-video-director
description: >
  Use whenever the user asks to make, change, or fix a video with HyperFrames (HeyGen's HTML-to-video
  framework) and the result MUST match what they described. This skill is the director: it turns the
  user's words into a numbered Requirement Ledger, a timed Shot List, a HyperFrames build, automated
  proof (motion.json + check + timeline + snapshots), and a Fidelity Report. Load it BEFORE the
  official /hyperframes skills when the user says things like "it's not what I described", "make it
  exactly like this", "follow my brief", or when a previous attempt drifted from the request.
---

# Code Video Director

You are the **director**, not just the coder. The user's description is the **contract**. Your job
is to deliver a video where every sentence of that description can be pointed to on the timeline,
and to prove it before you say "done".

The official HyperFrames skills (`/hyperframes`, `/hyperframes-core`, `/hyperframes-cli`,
`/hyperframes-animation`) own **syntax and tooling**. This skill owns **fidelity**: nothing the user
asked for gets dropped, reinterpreted, shortened, reordered, or replaced with something "similar".
When this skill and a generic creative instinct disagree, this skill wins. When this skill and the
HyperFrames technical contract disagree, the technical contract wins (then tell the user why).

## The 7 rules (memorize these)

1. **Every word is a requirement.** Nouns = things on screen. Adjectives = look. Numbers = exact
   values. Order words ("then", "after", "finally") = sequence. Time words = timestamps. Quoted
   text = copied verbatim, character for character.
2. **Never substitute.** No template swap, no "I used a similar animation", no paraphrased copy,
   no different color, no different duration, no different aspect ratio. If something is
   impossible, say so *before* building and offer the closest option — never silently.
3. **Never invent.** Do not add scenes, text, effects, music, or logos the user did not ask for,
   unless you label them `[ADDED]` in the plan and the user accepts them. "Filling time" is not a
   reason to invent.
4. **Numbers are law.** Duration, aspect ratio, fps, counts ("three cards"), positions
   ("bottom-left"), timings ("at 5 seconds") are implemented exactly and verified with tooling.
5. **Plan before code.** Write `DIRECTION.md` (Requirement Ledger + Shot List) first. Code only
   from the Shot List. Any code that does not trace back to a ledger row is suspect.
6. **Prove it, don't claim it.** "Done" requires: `lint` clean, `check` passing, every motion
   assertion green, `timeline --json` matches the Shot List, snapshots looked at, ffprobe duration
   matches. Then a Fidelity Report with one line per ledger row.
7. **Change requests touch only what was named.** Re-verify the touched rows and the final gate.
   Never "improve" untouched parts.

## Workflow

### Step 0 — Read the description like a lawyer

Before anything else, write down (in `DIRECTION.md`, section "Requirement Ledger") one row per
atomic requirement. Follow `references/requirement-ledger.md` for the extraction rules. Typical row
count for a 2-sentence brief: 8–15 rows. If you have fewer than that, you are summarizing instead
of extracting — go back.

Each row has: `ID · Requirement (user's words) · Type · Exact value · Status`.

Status values: `MUST` (explicit), `ASSUMED` (you inferred it; state the assumption), `ASSET NEEDED`
(user must supply a file), `BLOCKED` (impossible in HyperFrames as asked — propose an alternative),
`[ADDED]` (your addition, needs acceptance).

### Step 1 — Ask only blocking questions (max 3)

Ask only when a wrong guess would waste the build: missing asset, missing length, contradictory
instructions, or an impossible request. Everything else goes in as `ASSUMED` with your guess
stated. Do not interview the user about taste when they already described the video.

If the user says "just build it", build it with the assumptions listed at the top of your reply.

### Step 1.5 — Declare the TYPE, the STYLE, and the director decisions

Users describe *content* and rarely say what kind of video it is or how it should look. Decide
both explicitly, before any shot is planned, and write them into `DIRECTION.md` → `## Type & Style`
(`references/video-type-and-style.md`):

- **Type** — what the video is: logo sting, promo, ad/social cut, explainer, tutorial, UI demo,
  data story, kinetic typography, slideshow, talking-head overlay, avatar presenter, music video,
  narrative short, personalized card… Each implies an arc, a length, and often an official route.
- **Style** — how it looks and moves, *in HyperFrames terms*: simple/minimal, clean motion
  graphics (default), kinetic type, flat 2D animation (SVG/Lottie), whiteboard, paper cut-out,
  isometric/2.5D, real 3D (Three.js), Pixar/CGI look (**needs external assets — say so and offer
  options**), cinematic footage, AI-generated plates, UI/screen demo, retro/glitch, data-viz,
  mixed media. Record the engine, palette, typography, shapes, lighting, camera, motion energy,
  easing, transition family, sound palette, references, and forbidden things.
- **Director decisions** the brief skipped — format, hook, pacing, hold times, ending, CTA,
  typography, grid, logo rules, transitions, music/SFX/VO levels, captions, readability, safe zones,
  asset sourcing, templating (`references/director-decisions.md`). Decide them, mark `ASSUMED`,
  and show the 8–12 that matter as a short **Direction sheet** in your reply.

Honesty rule: never promise a look the engine cannot draw. If the user names a style that needs
assets (3D models, illustrated characters, footage, Pixar-look clips), list each as `ASSET NEEDED`
with its source, or `🔒 blocked` with alternatives — before building.

One style for the whole video. Every later scene is checked against this block, and the Fidelity
Report carries a row **S0 — Style adherence**.

### Step 2 — Write the Shot List and the Scene Breakdown

In `DIRECTION.md`, section "Shot List" (template: `references/direction-template.md`). One row per
shot: `Shot · Start · End · What is on screen (traced ledger IDs) · Motion · Audio · Element ids`.

Hard checks before continuing:

- The last shot ends exactly at the requested total duration.
- Every `MUST` ledger row appears in at least one shot's trace column. A ledger row that appears
  nowhere is a bug in the plan.
- Sequence words from the brief are reflected in strictly increasing start times. "Then" means
  *after*, not *at the same time*.
- Every quoted string in the brief appears in the shot list exactly as quoted.
- Counts match ("three cards" → three element ids).

Then expand every shot into a **Scene Breakdown** (`references/scene-breakdown.md`) — the
frame-by-frame contract. Per scene: time in/out, purpose traced to ledger IDs, narration verbatim,
on-screen text verbatim, a composition table (every element: id, position, size, color, type), the
camera, a motion table (in → hold → out with exact time, verb, from→to, duration, easing), the
transitions in/out, an audio cue table, a **key-frame table** (what the viewer sees at each moment
something changes, at the snapshot point, and at the last frame), and the proof assertions. Add a
**Scene 0 — Global** block (background, persistent elements, music bed, final frame). Code is
written *from* this breakdown; nothing in the HTML may contradict it.

Show the Direction sheet + Shot List to the user as a short table when running collaboratively
(the full breakdown stays in `DIRECTION.md`); otherwise continue and include them in the final
report.

### Step 3 — Build with HyperFrames (follow the technical contract)

Read `/hyperframes-core` before writing HTML if you haven't this session. Then build from the Scene
Breakdown: one element id per composition-table row, `data-start`/`data-duration` copied from the
tables — not re-estimated; motion verbs, durations, and eases copied from the motion tables; the
style block's palette/typography/transition family applied everywhere. Read `references/hyperframes-gotchas.md` first: it lists the exact mistakes that make
a render silently differ from the preview or the plan (silent audio, cut-off endings, clips that
never appear, fonts that fall back, timelines that don't seek).

Minimum rules (the full contract is in `/hyperframes-core`):

- Root `<div data-composition-id data-width data-height data-duration>`; `data-duration` equals the
  brief's total length. Render length is the root `data-duration` — a longer timeline is cut off.
- Every timed element: `class="clip" data-start data-duration` (seconds). Optional
  `data-track-index` is only a Studio lane.
- Exactly one `gsap.timeline({ paused: true })` registered at
  `window.__timelines["<composition-id>"]`. Never a playing timeline, never wall-clock.
- Every `<audio>` has an `id` and a local `src`. No `crossorigin` on media.
- Never tween `visibility`/`autoAlpha`/`display` on a `.clip`; animate a child.
- No CSS `transform` on an element you also tween with GSAP `x`/`y`/`scale`; use `fromTo`.
- Named fonts need an in-file `@font-face` pointing to a shipped local file.
- Current lint convention: the root composition is built from **sub-compositions**
  (`data-composition-src`, one file per scene, everything inside `<template>`). Sub-composition
  timelines are **local** — local 0 = the host clip's `data-start`. The Shot List stays absolute;
  convert when writing the sub-comp's tweens (see `references/worked-example.md` § 3).

Prefer a registry primitive over hand-rolled motion when one matches the brief's wording
(`npx hyperframes catalog --query "<the move in plain English>"`), but never accept a primitive
that changes what the user asked for.

### Step 4 — Write the proof before you run it

Create `index.motion.json` next to the composition (see `references/motion-sidecar.md`). Convert
the Shot List into assertions:

- Each element that must appear → `appearsBy` at its Shot List start + a small grace (≤ 0.5 s).
- Each "then / after / one by one" → `before(a, b)` pairs.
- Each element that must stay visible/readable → `staysInFrame`.
- Each scene that must not freeze → `keepsMoving`.

`npx hyperframes check` picks the sidecar up automatically and fails on any divergence. This is
your automated "did I build what was described" test — write it from the **plan**, not from the
code, so it can catch the code being wrong.

### Step 5 — Verify (all of these, in order; stop on the first failure)

```bash
npx hyperframes lint                       # must report 0 errors (warnings: read each one)
npx hyperframes check --snapshots          # must pass; includes motion.json assertions
npx hyperframes timeline --json > /tmp/tl.json
```

Cross-check `/tmp/tl.json` against the Shot List: every row's `absStart`/`absEnd` equals the
table (±0.05 s), audio rows exist with the expected `src`, nothing is `pending`. Query recipes are
in `references/verification-recipes.md`.

```bash
npx hyperframes snapshot --at <midpoint of every shot, comma-separated>
```

**Open and look at every PNG** (read the image files). For each, answer: does this frame show what
the Shot List says for that time? Wrong text, missing element, wrong color, overflowing text,
element off-canvas, or a black frame = not done. Fix, then re-run from `lint`.

```bash
npx hyperframes render --quality draft --output /tmp/draft.mp4
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of default=nw=1 /tmp/draft.mp4
```

Duration must equal the root `data-duration` (±1 frame). Width × height must equal the requested
aspect ratio. If the brief has audio, confirm an audio stream exists (`-show_streams` lists
`codec_type=audio`).

Only after all of that: preview for the user (`npx hyperframes preview --background`) and ask
"render final, or change something?" Final render: `--quality delivery` (or `cloud render`).

### Step 6 — Fidelity Report (mandatory before "done")

Reply with the table from `references/fidelity-report.md`: a row **S0 — Style adherence**, then one row per ledger ID, status
`✅ verified` / `⚠️ partial` / `❌ not done` / `[ADDED]`, and the **evidence** (which assertion,
which snapshot time, which timeline row). Never mark ✅ without evidence. Never hide a ⚠️ or ❌ —
state it and say what you need to fix it. A report with zero ⚠️/❌ and every row evidenced is the
only thing that may be called "done".

### Step 7 — Change requests

1. Add/modify ledger rows for the change; mark old rows `SUPERSEDED` rather than deleting.
2. Edit only the shots that trace to the changed rows. Preserve ids, timing, tracks, assets
   elsewhere. Use `npx hyperframes timeline --json` to locate clips instead of re-reading all files.
3. Update `index.motion.json` for the changed rows.
4. Re-run Step 5 in full (the gate is cheap; the user's time is not).
5. Fidelity Report for the changed rows + confirmation that untouched rows still pass `check`.

## Anti-drift checklist (run mentally before Step 5)

These are the ways an agent most often ends up with "not the video I described":

- [ ] Total duration equals the brief, not "about" it. (Root `data-duration`, ffprobe.)
- [ ] Aspect ratio / canvas size is what was asked (9:16 → 1080×1920, 1:1 → 1080×1080, 16:9 →
      1920×1080), not the example default.
- [ ] Every quoted string is verbatim: same words, case, punctuation, line breaks, emoji.
- [ ] Lists keep their count and order ("A, B and C" → 3 items, A first).
- [ ] "Then" / "after" / "next" became later `data-start` values, not simultaneous ones.
- [ ] "At the same time" / "while" became overlapping windows.
- [ ] Brand colors are the exact hex given; nothing recolored "for contrast" without saying so.
- [ ] Requested positions respected (center / lower-third / top-right) — check the snapshots.
- [ ] Requested motion verbs respected: "fade" ≠ "slide" ≠ "pop" ≠ "typewriter". Match the verb.
- [ ] Requested media is the user's file, placed where they said, trimmed how they said
      (`data-media-start`), at the volume they said (`data-volume`).
- [ ] Music/voice/SFX actually in the mix: every `<audio>` has `id`; timeline shows the audio rows;
      ffprobe shows an audio stream.
- [ ] No extra scenes, taglines, logos, stock imagery, or "outro" the user didn't request
      (or they are labeled `[ADDED]` and accepted).
- [ ] Last item in a list is present (the most commonly dropped element).
- [ ] The end state holds: the final frame shows what the brief says ends the video, not a blank.
- [ ] Nothing depends on time of day, random numbers, network, or user input (render determinism).
- [ ] The declared **type & style** is what got built: same engine, palette, type, motion energy,
      transition family in every scene; no style break (e.g. a 3D hero then flat cards) unless asked.
- [ ] Every key frame in the Scene Breakdown matches its snapshot; the final frame is the declared
      end state.
- [ ] Director decisions marked `ASSUMED` were shown to the user, not buried.

## References (read on demand)

| File                                   | Read it to…                                                                      |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| `references/requirement-ledger.md`     | extract requirements from a brief without losing anything; ledger template       |
| `references/direction-template.md`     | the `DIRECTION.md` file shape (ledger + type & style + shot list + scene breakdown + proof plan) |
| `references/video-type-and-style.md`   | decide and declare the video TYPE and visual STYLE; what each style means (and costs) in HyperFrames |
| `references/scene-breakdown.md`        | the scene-by-scene / frame-by-frame contract: composition, motion, audio, key frames per scene |
| `references/director-decisions.md`     | every decision the brief usually skips (format, pacing, look, motion, sound, text, assets) with defaults |
| `references/hyperframes-gotchas.md`    | the HyperFrames mistakes that silently break fidelity, with the fix for each      |
| `references/motion-sidecar.md`         | turn a Shot List into `index.motion.json` assertions                             |
| `references/verification-recipes.md`   | copy-paste commands for timeline cross-check, snapshots, ffprobe                 |
| `references/fidelity-report.md`        | the final report format                                                          |
| `references/worked-example.md`         | a complete brief → ledger → shot list → HTML → motion.json → report (project files in `examples/ship-faster/`) |
