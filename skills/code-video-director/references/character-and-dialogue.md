# Characters, dialogue, and animation — making speech and movement match

Use this whenever the video has a **character** (illustrated, 3D, mascot, avatar, or a presenter)
and/or **dialogue / voiceover**. The goal: every spoken word has a matching mouth, gesture,
expression, and reaction at the right frame, and nothing moves without a reason.

HyperFrames seeks each frame, so character animation must be a **timeline of states** driven by
word timings — never a "play the audio and animate along" loop.

## 0. What can speak, in HyperFrames

| Character kind                | How it's built                                                                  | Lip-sync source                                                      |
| ----------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| HeyGen avatar (real-looking)  | generated via HeyGen API from the script → placed as `<video>`                  | done by HeyGen; you only time graphics around it                      |
| Flat 2D rig (SVG parts)       | head/body/arms/eyes/mouth as separate SVG groups; GSAP sets poses               | mouth-shape swaps from **word timings** (`audio_meta.json` from TTS)   |
| Lottie character              | After Effects export; mouth comp with named frames/markers                      | seek the mouth layer by frame from word timings                       |
| 3D (Three.js GLB)             | rigged model with AnimationClips (idle, talk, gesture) + blendshapes            | blendshape weights per viseme from word/phoneme timings               |
| Pre-rendered clip             | external tool renders the acting; HyperFrames composes it                       | baked in; you cut/time around it                                      |
| Text-only "speaker"           | no character — captions or kinetic words carry the line                          | word timings drive word reveals                                       |

If the user asked for a character but gave no art, the character is an `ASSET NEEDED` row with a
proposed source (user SVG/PNG layers, Lottie file, GLB, generated layered image, HeyGen avatar).
Never fake a character with a clipart silhouette and call it done.

## 1. The Dialogue Sheet (goes in `DIRECTION.md` under the scene)

Build it **after** TTS/VO exists (or after the user's audio is transcribed), because real timings
win. One row per line — or per clause for lines longer than ~3 s.

```markdown
**Dialogue sheet — Scene 2**
| # | Speaker | Line (verbatim)                 | Start | End  | Mouth        | Gesture (stroke at)            | Face / eyes                | Body                 | Listener reaction            | Camera        |
|---|---------|---------------------------------|-------|------|--------------|--------------------------------|----------------------------|----------------------|------------------------------|---------------|
| 1 | Maya    | "This is the part everyone skips." | 6.20 | 8.10 | talk cycle   | palm-out push on "skips" (7.70) | brow up, eyes to camera    | lean in 6.1→6.6      | Ravi: head tilt @ 8.3        | static MCU    |
| 2 | Ravi    | "Wait — why?"                   | 8.60  | 9.30 | talk cycle   | small shrug on "why" (9.05)    | squint, eyes to Maya       | weight shift L        | Maya: blink + half smile @ 9.4 | static 2-shot |
```

Columns are mandatory. "none" is a valid value, but it must be written.

## 2. Timing rules (the physics of acting)

| Rule                                   | Numbers                                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------------------------- |
| Mouth leads sound                      | mouth opens **1–2 frames (≈ 0.05 s) before** the first phoneme; closes within 2 frames after the last |
| No sound → no mouth                    | between lines the mouth is **closed/neutral**; never a looping "talk" during a pause > 0.15 s |
| Gesture anticipates the word           | the gesture's **stroke** (its fastest point) lands on the **stressed syllable**, preparation starts 0.2–0.4 s before, retraction 0.3–0.6 s after |
| One gesture per clause                 | max 1 beat gesture per 2–3 s; hands return to a rest pose between                          |
| Reaction after the cue                 | the listener reacts **0.2–0.4 s after** the triggering word; never before, never simultaneous |
| Blink                                  | every 3–5 s, 0.12–0.16 s long; add a blink on head turns and 0.1 s **before** a line starts; never during a cut |
| Eye line                               | speaker looks at the listener or camera (as declared); eyes move **before** the head (eyes 0.05–0.1 s ahead) |
| Breathing / idle                       | 0.5–1 % scale or 2–4 px rise every 3–4 s on the torso; never on the head of the speaker mid-line |
| Head accents                           | small nod/tilt on emphasized words (≤ 3° / ≤ 6 px), not on every word                     |
| Walk cycle                             | 0.5–0.7 s per step at normal pace; feet never slide (ground contact position locked)        |
| Anticipation → action → follow-through | squash/anticipate 0.1–0.2 s, action, then overshoot 5–10 % and settle (`back.out(1.2–1.7)`) |
| Hold after a line                      | 0.3–0.6 s of stillness (except blink/breath) before the next speaker or a cut              |
| Turn-taking                            | gap between speakers 0.3–0.6 s; interruptions only if the script marks them ("—")           |

## 3. Mouth shapes (visemes) for 2D/Lottie/3D blendshapes

A simple **6-shape set** is enough and reads well:

| Shape | Sounds                       | 2D use                                        |
| ----- | ---------------------------- | --------------------------------------------- |
| REST  | silence, M B P (closed)      | default between lines                         |
| AI    | a, i, e (open)               | most vowels                                   |
| O     | o, u, w (round)              |                                               |
| E     | ee, s, z, t, d, n, k, g      | wide/teeth                                    |
| FV    | f, v                         | lower lip under teeth                         |
| L     | l, th                        | tongue visible (optional; fall back to E)     |

How to drive them without phoneme data: from **word timings**, alternate `AI → E → O → AI` at
8–12 shapes per second across each word's window, open on the vowel, and force `REST` at every
inter-word gap > 0.12 s and at the line end. With phoneme timings (if the TTS/aligner provides
them), map directly. Implement as `tl.set(mouth, {attr/className}, t)` calls on the paused GSAP
timeline — seek-safe and frame-exact.

```js
// seek-safe mouth from word timings (abs → local already converted)
const shapes = ["AI", "E", "O", "AI"];
words.forEach(({ start, end }) => {
  const n = Math.max(1, Math.round((end - start) * 10)); // ~10 shapes/s
  for (let i = 0; i < n; i++) tl.set("#maya-mouth", { attr: { "data-shape": shapes[i % 4] } }, start - 0.05 + (i * (end - start)) / n);
  tl.set("#maya-mouth", { attr: { "data-shape": "REST" } }, end + 0.05);
});
```

CSS shows one `<g>` per shape: `#maya-mouth [data-shape] > g { display:none } … [data-shape="AI"] > .m-ai { display:block }`.

## 4. Gesture & pose vocabulary (name them once, reuse)

Define 6–10 named poses per character in `DIRECTION.md` (`rest`, `lean-in`, `palm-out`,
`point-screen`, `shrug`, `arms-cross`, `thumbs-up`, `wave`), each as a set of GSAP targets
(rotation/x/y per limb group). A gesture is `rest → pose → rest` with the stroke timed per § 2.
Reusing named poses keeps the acting consistent across scenes and makes the Dialogue Sheet
buildable.

## 5. Staging rules (who the viewer looks at)

- The **speaker** gets the motion; listeners are near-still except timed reactions.
- One focal point per frame; the character faces into the frame, not out of it.
- Text that appears with a spoken line enters **on the word** (word timing), not before.
- Props/objects a character refers to appear **before** the pointing gesture lands (0.2 s).
- Never cut in the middle of a word; cut on the gap between lines or on the stroke of a gesture.
- If a HeyGen avatar is the speaker, graphics around it obey the same word-timing rules — the
  avatar's own gestures are baked in, so time your card/text entrances to its words.

## 6. Verification for character scenes

- Dialogue Sheet times equal the word timings file (±0.05 s). Timeline rows for VO match.
- Snapshots at: 0.05 s after each line start (mouth open), the gap between lines (mouth closed),
  each gesture stroke time (pose at peak), each reaction time.
- `index.motion.json`: `appearsBy` for every on-word text; `before(speakerPose, listenerReaction)`.
- Watch-through check (preview): no talking during silence, no silent mouth during speech, no
  gesture that lands > 0.2 s off its word, no simultaneous reaction, feet don't slide.
- Report rows: one per dialogue line (`D1 … ✅ mouth/gesture/reaction verified @ t`), plus the
  character's asset status.

## 7. Agent failures this prevents

- Looping "talking" mouth over the whole scene, including pauses.
- Gestures on a fixed 2-second cycle unrelated to the words.
- Both characters moving all the time; no one is clearly speaking.
- Text cards appearing before the narrator says the words.
- Reactions at the same frame as the cue (feels robotic) or 1 s late (feels broken).
- Scenes timed by estimate while the voice file is a different length.
- A character the user didn't ask for narrating a visual-only brief (see `opt-in-content.md`).
