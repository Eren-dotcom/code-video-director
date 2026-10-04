# Video type & visual style — decide it, declare it, keep it

A video that is the right *content* in the wrong *style* still fails the brief ("I wanted a Pixar
look, you gave me flat text"). Before the Shot List, the AI must decide **two things** and write
them into `DIRECTION.md` → `## Type & Style`:

1. **Type** — what kind of video this is (its job and structure).
2. **Style** — how it looks and moves (its rendering approach inside HyperFrames).

If the user named them, use exactly that. If not, pick from the tables below, mark the row
`ASSUMED`, and say it in one line at the top of your reply ("Treating this as a **product promo**
in a **clean motion-graphics** style — say the word to change it"). Ask a question only when two
*very different* styles fit equally (e.g. "3D product render" vs "flat explainer") and the build
cost differs a lot.

## 1. Video TYPE (what it is)

| Type                    | Job                                              | Typical length | Structure / arc                                            | Official route (when it exists) |
| ----------------------- | ------------------------------------------------ | -------------- | ---------------------------------------------------------- | ------------------------------- |
| Logo sting / intro      | brand hit at the start of other content          | 2–6 s          | reveal → lockup → hold                                     | `/motion-graphics`              |
| Title card / lower third| name a section or a speaker                      | 3–8 s          | in → hold → out                                            | `/motion-graphics`              |
| Product promo / launch  | make people want a product                       | 15–60 s        | hook → problem → product → proof → CTA                     | `/product-launch-video`         |
| Ad / social cut         | stop the scroll, one message                     | 6–30 s         | hook (≤ 2 s) → payoff → CTA                                | `/general-video`                |
| Explainer               | teach one idea                                   | 30–120 s       | question → concept → example → recap                       | `/faceless-explainer`           |
| Tutorial / how-to       | show steps                                       | 30–180 s       | goal → step 1..n → result                                  | `/general-video`                |
| Product / UI demo       | show the software doing the thing                | 20–90 s        | context → cursor/typing flow → outcome                     | `/product-launch-video`, blueprint `cursor-ui-demo` |
| Data story / chart      | make a number land                               | 10–60 s        | setup → reveal → count-up → takeaway                       | blueprint `dataviz-countup`     |
| Kinetic typography      | words as the visual                              | 10–60 s        | beat-synced lines                                          | `/motion-graphics`, blueprint `kinetic-type-beats` |
| Slideshow / deck        | sequence of slides, maybe navigable              | any            | slide 1..n                                                 | `/slideshow`                    |
| Talking head + graphics | real person footage with overlays/captions        | any            | footage spine + overlays                                   | `/talking-head-recut`, `/embedded-captions` |
| Avatar presenter        | HeyGen avatar speaks; graphics around it         | 20–120 s       | avatar clip as `<video>` + designed scene                  | HeyGen API + `/general-video`   |
| Music video / montage   | cut to the beat                                  | 15–90 s        | beat grid drives everything                                | `/music-to-video`               |
| Story / narrative short | characters, scenes, emotion                      | 30 s–3 min     | setup → conflict → resolution                              | `/general-video` + external assets (see Style) |
| Year-in-review / personalized | per-user data card                          | 15–40 s        | greeting → stats → share card; variables per render        | `/general-video` + `render --batch` |
| PR / code change        | explain a diff                                   | 20–60 s        | what changed → why → how                                   | `/pr-to-video`                  |

Record: `type`, `arc`, `target length`, `platform/destination`, `audience`, `one-line message`.

## 2. Visual STYLE (how it looks) — and what each one *means* in HyperFrames

HyperFrames renders **whatever Chrome can draw**: HTML/CSS, SVG, Canvas/WebGL (Three.js), Lottie,
images and video files. That decides what each style costs. Be honest with the user about the
right-hand columns.

| Style                               | Look                                                                   | Engine inside HyperFrames                                          | Native or needs assets?                                                                 | Pick when the user says…                          |
| ----------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Simple / minimal**                | one background, big type, few shapes, lots of air                      | CSS + GSAP                                                         | Native                                                                                  | simple, clean, minimal, plain, Apple-like          |
| **Clean motion graphics (default)** | cards, icons, charts, UI panels, smooth eases                          | CSS/SVG + GSAP; registry blocks                                    | Native; icons via `/media-use`                                                          | corporate, SaaS, modern, professional             |
| **Kinetic typography**              | words move, scale, cut on beats                                        | GSAP + split text (`animate-text` adapter)                         | Native                                                                                  | typographic, bold text, lyric video               |
| **Flat 2D animation / cartoon**     | illustrated characters, scenes, props moving                           | SVG parts rigged with GSAP, or **Lottie** (After Effects export)   | Needs illustrations: user SVGs, Lottie files, or AI-generated layered images            | animated, cartoon, illustrated, 2D, explainer-style |
| **Whiteboard / hand-drawn**         | strokes drawing in, paper texture                                      | SVG `stroke-dashoffset` draw-on + GSAP                             | Native for line art; needs SVG paths of the drawings                                    | sketch, doodle, whiteboard                        |
| **Paper cut-out / collage**         | layered flat shapes, drop shadows, stop-motion feel                    | CSS layers + stepped easing (`steps()`) + textures                 | Native + texture images                                                                 | craft, collage, playful, stop-motion              |
| **Isometric / 2.5D**                | isometric scenes, parallax layers, fake depth                          | CSS 3D transforms, layered PNGs, GSAP                              | Native for shapes; illustrated layers needed for rich scenes                            | isometric, parallax, depth                        |
| **3D (real)**                       | lit 3D objects, camera orbits, product spins                           | **Three.js** via the `three` adapter (`hf-seek`), GLB/GLTF models  | Needs 3D models (user GLB, registry, or generated); heavier renders                     | 3D, product render, orbit, spin, WebGL            |
| **Pixar / CGI character look**      | soft-lit 3D characters, subsurface skin, expressive faces, story       | **Not producible from HTML alone.** Options: (a) pre-rendered clips from a 3D/AI video tool placed as `<video>` and composed/graded in HyperFrames; (b) Three.js with rigged GLB characters + AnimationMixer (needs professional assets); (c) "Pixar-*inspired*" — Three.js or AI image plates with soft lighting, rounded shapes, warm palette, parallax camera | Needs external assets in every option. Say this plainly and offer (a)/(b)/(c). | Pixar, Disney, CGI, 3D cartoon, animated movie look |
| **Realistic / cinematic footage**   | real video, color-graded, titles over it                               | `<video>` clips + LUT/grade via `media-treatment` + GSAP overlays  | Needs footage (user's, stock via `/media-use`, or generated)                            | cinematic, filmic, footage, b-roll                |
| **AI-generated plates**             | still images (or short gen clips) with Ken Burns / parallax / morphs   | `<img>`/`<video>` + GSAP camera moves                              | Needs generation step (`/media-use` generate) — fire early, in parallel                 | illustrated scenes but no artist, concept art      |
| **UI / screen demo**                | real or rebuilt product UI, cursor, typing                             | HTML rebuild of the UI, or `capture` of the site + overlays        | Native (rebuild) or needs site URL (`hyperframes capture`)                              | demo, walkthrough, show the app                   |
| **Retro / glitch / CRT**            | scanlines, chromatic aberration, VHS                                   | registry effects (search catalog first), CSS filters, shaders      | Native via registry                                                                     | retro, glitch, VHS, cyberpunk                     |
| **Data-viz**                        | charts drawing in, count-ups, maps                                     | SVG/Canvas + GSAP; blueprint `dataviz-countup`                     | Native; needs the data                                                                  | chart, graph, numbers, stats                      |
| **Mixed media**                     | footage + graphics + type together                                     | all of the above on tracks                                         | Depends on parts                                                                        | dynamic, energetic, modern ad                     |

Also inherit the official **visual identity presets** when they fit the mood
(`/hyperframes-creative` → `references/visual-styles.md`: Swiss Pulse, Velvet Standard,
Deconstructed, Maximalist Type, Data Drift, Soft Signal, Folk Frequency, Shadow Cut). A preset is
a *palette + type + motion energy* starting point; it sits under the Style row above, not instead
of it.

### Honesty rules for style

- Never promise a look the engine cannot draw. "Pixar" from pure HTML is impossible; say so
  **before** building and offer the three options with their asset needs.
- A style that needs assets gets an `ASSET NEEDED` ledger row per asset, with where it will come
  from (user upload / registry / `/media-use` generate / HeyGen avatar API / Three.js model).
- One style for the whole video. A 3D hero scene followed by flat cards is a style break unless
  the user asked for it; if you need to mix, declare the rule ("3D only for the product shot").
- "Simple" means fewer elements and slower, not lower quality: still real typography, spacing,
  easing, and a hold long enough to read.

## 3. The Style Declaration (goes into `DIRECTION.md` → `## Type & Style`)

Fill every row. `ASSUMED` where the user didn't say.

```markdown
## Type & Style

| Field            | Value                                                    | Source   |
| ---------------- | -------------------------------------------------------- | -------- |
| Type             | Product promo                                            | MUST     |
| Arc              | hook → feature → feature → feature → CTA                 | ASSUMED  |
| Platform         | YouTube pre-roll, 16:9 1920×1080, 30 fps                 | MUST     |
| Audience / tone  | developers; confident, calm, no hype words               | ASSUMED  |
| Style            | Clean motion graphics (preset: Swiss Pulse, dark variant)| ASSUMED  |
| Engine           | CSS + GSAP; SVG icons; no 3D                             | derived  |
| Palette          | bg #0B0F14 · surface #141A23 · brand #6C5CE7 · text #FFFFFF / #C9CDD6 | brand MUST, rest ASSUMED |
| Typography       | Inter (shipped), headline 84/700, label 56/700, url 72/600; max 6 words per line | ASSUMED |
| Shapes / texture | 28 px radius cards, 2 px brand border, no gradients, no noise | ASSUMED |
| Lighting / depth | flat, no shadows                                         | ASSUMED  |
| Camera           | static; no pans/zooms                                    | ASSUMED  |
| Motion energy    | medium; entrances 0.5–0.8 s, `power2.out`/`power3.out`; exits 0.3 s `power2.in` | ASSUMED |
| Transitions      | hard cuts between scenes (one family)                    | ASSUMED  |
| Sound palette    | soft electronic bed at −14 dB (vol 0.2), airy whoosh SFX, no VO | MUST (music/whoosh), ASSUMED (levels) |
| Captions         | none (no narration)                                      | derived  |
| References       | user said "like Linear's launch videos" → restrained, dark, precise | MUST |
| Forbidden        | stock photos, emoji, drop shadows, more than one accent color | ASSUMED |
```

Every scene in the Scene Breakdown must obey this block. The Fidelity Report carries one row
**S0 — Style adherence** with evidence from snapshots (palette, type, motion verbs, transition
family all match the declaration).

## 4. Quick decision helper

- User gave only content, no look → **Clean motion graphics**, dark or light by brand, static
  camera, hard cuts. Fast, native, safe.
- User says "animated" with no other hint → ask one question: *flat 2D illustrated* vs *motion
  graphics*? (very different asset needs). Default to motion graphics if they say "just do it".
- User says "3D" → confirm model source. No model → Three.js primitives / text / product-like
  shapes, or AI image plates with parallax. Say which.
- User says "Pixar / Disney / CGI" → offer (a) pre-rendered clips composed in HyperFrames,
  (b) Three.js with rigged GLB (needs assets), (c) Pixar-*inspired* 2.5D. Build nothing until they
  pick.
- User gives footage → **Cinematic footage** style; HyperFrames does titles, grade, cuts, music.
- User gives a URL → **UI / screen demo** or **Product promo** with `capture`.
- User gives music and says "cut to it" → `/music-to-video`, style from the track's mood.
