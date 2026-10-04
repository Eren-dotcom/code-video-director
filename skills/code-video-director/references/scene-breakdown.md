# Scene Breakdown — scene by scene, frame by frame, full detail

The Shot List (one row per shot) is the *index*. The Scene Breakdown is the *full script* the AI
builds from: for every scene, everything the viewer sees and hears at every moment, in enough
detail that two different agents would build the same video. It lives in `DIRECTION.md` →
`## Scene Breakdown`, after the Shot List, and every number in it is copied into the HTML.

Write it **before** the HTML. Keep the user's words in the *Purpose* line so each scene traces
back to the brief.

## Per-scene template

```markdown
### Scene 3 — Feature cards                                   ← number + name
- **Time:** 6.0 → 12.0 (6.0 s)  · file `compositions/cards.html` · host `#cards`
- **Purpose (trace):** R5 "three feature cards appear one by one left to right", R6–R8 labels,
  R9 whoosh, R11 brand color
- **Narration / VO:** none          ← verbatim text if any, with the word that each visual waits for
- **On-screen text (verbatim):** "Speed" · "Safety" · "Scale"
- **Style check:** palette, type, motion energy, transition family per `## Type & Style` ✓

**Composition (what is where):**
| Layer | Element id | What it is                | Position / size (1920×1080)                     | Color / type                     |
| ----- | ---------- | ------------------------- | ----------------------------------------------- | -------------------------------- |
| 0     | (root bg)  | solid background          | full frame                                      | #0B0F14                          |
| 1     | #cards-1   | card "Speed"              | left; 440×300; row centered vertically; gap 48  | surface #141A23, 2 px #6C5CE7, text 56/700 #FFF |
| 1     | #cards-2   | card "Safety"             | center; same                                    | same                             |
| 1     | #cards-3   | card "Scale"              | right; same                                     | same                             |

**Camera:** static (no pan/zoom).

**Motion (per element: in → hold → out):**
| Element  | In (abs time, verb, from → to, duration, ease)              | Hold        | Out                                  |
| -------- | ----------------------------------------------------------- | ----------- | ------------------------------------ |
| #cards-1 | 6.0 slide-up+fade: y 30→0, opacity 0→1, 0.5 s, power2.out   | 6.5 → 12.0  | none — scene ends on hard cut at 12.0 |
| #cards-2 | 7.0 same                                                    | 7.5 → 12.0  | none                                 |
| #cards-3 | 8.0 same                                                    | 8.5 → 12.0  | none                                 |

**Transitions:** in = hard cut from Scene 2 at 6.0 · out = hard cut to Scene 4 at 12.0

**Audio:**
| Cue      | Abs time | Source               | Level | Note                                   |
| -------- | -------- | -------------------- | ----- | -------------------------------------- |
| music    | 0–15     | assets/music.wav     | 0.2   | continues under                        |
| whoosh 1 | 6.0      | assets/whoosh.wav    | 0.6   | starts exactly with #cards-1 entrance  |
| whoosh 2 | 7.0      | assets/whoosh.wav    | 0.6   |                                        |
| whoosh 3 | 8.0      | assets/whoosh.wav    | 0.6   |                                        |

**Key frames (what the viewer sees — this is the frame-by-frame contract):**
| Abs t  | Frame description                                                                 |
| ------ | --------------------------------------------------------------------------------- |
| 6.00   | empty dark frame (cards not yet visible; opacity 0)                               |
| 6.25   | "Speed" card half-faded, 15 px below final position                               |
| 6.50   | "Speed" card fully in, alone, left slot; center and right slots empty             |
| 7.00   | "Safety" begins; "Speed" static                                                   |
| 7.50   | two cards in; right slot empty                                                    |
| 8.00   | "Scale" begins                                                                    |
| 8.50   | all three cards in, evenly spaced, baseline aligned                               |
| 9.00   | ← snapshot point: all three readable, brand border visible                        |
| 11.97  | last frame of scene: identical to 8.50 (nothing drifts)                           |

**Proof:** before(#cards-1,#cards-2), before(#cards-2,#cards-3), appearsBy #cards-1 6.9 / #cards-2 7.9 /
#cards-3 8.9, staysInFrame #cards-3; timeline rows sfx-1/2/3 at 6/7/8; snapshot @7.0 (one card),
@8.0 (two), @9.0 (three).
```

## Rules for filling it

1. **Times are absolute** (main timeline). When the scene is a sub-composition, add one line
   `local = abs − 6.0` so the tween positions are converted correctly.
2. **Every element has in / hold / out.** "Out: none" is allowed only when the scene ends on a
   cut. An element that should disappear mid-scene needs an explicit out row.
3. **Motion verbs are exact**: fade (opacity only), slide (x/y + usually opacity), pop (scale
   0.8→1 with back.out), zoom/push-in (scale on the wrapper), wipe (clip-path), typewriter (chars
   revealed), count-up (number tween), draw-on (stroke-dashoffset), morph (path/FLIP). Use the
   verb the user used.
4. **Key frames**: one row for the first frame, one for each moment something starts or ends, one
   mid-hold row (the snapshot point), and one for the last frame of the scene. For a 3-second
   scene that is ~5 rows; for a busy 10-second scene it may be 15. Describe what is *visible*,
   not what the code does.
5. **Readability math**: text hold ≥ 1.5 s for a title, ≥ 0.25 s per word for a sentence, +0.5 s
   on mobile/vertical. Minimum font size 48 px on 1080p for body copy intended for phones; ≤ 6
   words per line; ≤ 2 lines per card. If the brief's timing violates this, flag it in Open
   questions rather than silently stretching.
6. **Safe zones**: keep text inside 5 % margins (96 px horizontally, 54 px vertically on 1920×1080);
   on 9:16 keep the bottom 20 % and top 12 % free of essential text (platform UI overlaps).
7. **Narration sync**: if there is VO, write the VO sentence for the scene verbatim and mark the
   word each visual lands on ("cards appear on *Speed* / *Safety* / *Scale*"). Real voice duration
   wins over estimates — scene length is trued after TTS (`production-loop.md` Duration sync).
8. **Audio per scene**: music state (continues / enters / ducks / ends), each SFX with the exact
   visual it is tied to, VO file + offset. Levels as `data-volume` numbers.
9. **Transitions**: name the family once in `## Type & Style` and only use that family. Each
   scene lists in/out with the exact time the transition starts and its duration; crossfades
   overlap the neighbouring scene — reflect the overlap in both scenes' times and in the host
   clips' `data-start`/`data-duration`.
10. **Nothing uncounted**: if an element is in the key frames it is in the composition table, has
    an id, and has an in/hold/out row. If it is in the composition table it appears in at least
    one key frame.

## Minimum per video

- A **Scene 0 — Global** block before Scene 1: background, persistent elements (watermark, logo
  bug, progress bar, caption track), music bed, and the end-state frame (what the last frame of
  the video is).
- One scene block per Shot List row (merge S1+S2 into one scene only when they share a
  sub-composition and the breakdown lists both beats).
- Total of scene durations (minus transition overlaps) equals the root `data-duration`.

## From breakdown to code — a mapping the AI must follow

| Breakdown field              | Becomes                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| Time (abs)                   | host clip `data-start` / `data-duration` in `index.html`                                  |
| Element ids                  | the exact `id` attributes (prefixed with scene id)                                        |
| Composition table            | the markup + CSS (position, size, color, type)                                            |
| Motion rows                  | `gsap.fromTo(...)` calls at `local` positions with the listed duration and ease           |
| Audio rows                   | `<audio id data-start data-duration data-volume data-media-start>` in `index.html`        |
| Transitions                  | overlapping host clips + opacity/clip-path tweens, or a registry/shader transition        |
| Key frames                   | the `snapshot --at` list and what you check in each PNG                                   |
| Proof line                   | entries in `index.motion.json`                                                            |
