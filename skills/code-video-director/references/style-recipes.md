# Style recipes — the unique ingredients of each look, ready to build

One card per style from `video-type-and-style.md`. Each card is a complete starting spec: copy the
values into `## Type & Style`, then build with the listed HyperFrames techniques. Sound rows are
**only used if the user asked for sound** (`opt-in-content.md`). Hex values are defaults —
the user's brand colors always replace them.

Legend: *Signature* = what makes it instantly recognisable · *Ingredients* = palette / type /
shapes / texture · *Motion* = verbs, eases, durations · *Build* = how to do it in HyperFrames ·
*Don't* = the mistakes that break the look.

---

## 1. Simple / minimal

- **Signature:** one background, one big line of type, one accent, lots of empty space. Calm.
- **Ingredients:** bg `#0B0F14` (dark) or `#FAFAF7` (light); text `#FFFFFF`/`#111111`; **one** accent. One typeface (Inter, Helvetica Neue, SF-like), 2 sizes only (headline 96–140, label 32–40). No borders, no cards, radius 0 or full. No texture.
- **Motion:** fade (opacity) and 20–40 px slide; `power2.out`, 0.6–0.9 s; holds 2–3 s; exits 0.3 s `power2.in`. One thing moves at a time.
- **Transitions:** hard cut or 0.4 s crossfade. Never both.
- **Camera:** static.
- **Build:** flex-centered `.clip`, `gsap.fromTo` opacity/y; ≤ 3 elements per scene.
- **Don't:** add shapes, gradients, icons, or a second accent "to make it interesting". Minimal fails by addition.

## 2. Clean motion graphics (default)

- **Signature:** cards, icons, UI-like panels, crisp alignment, confident eases.
- **Ingredients:** bg `#0B0F14`, surface `#141A23`, border `rgba(255,255,255,.08)` or 2 px brand, brand accent, text white/`#C9CDD6`. Inter/Geist-like, headline 72–96/700, body 40–48/500, label 28–32/600 uppercase +0.08em. Radius 16–28. Subtle 1 px borders, no drop shadows (or one soft 0 24px 48px rgba(0,0,0,.35)).
- **Motion:** slide-up+fade 24–40 px, `power3.out` 0.5–0.7 s; staggers 0.08–0.12 s; pop for icons `back.out(1.6)` 0.4 s; count-ups 1–1.5 s `power1.out`. Exits 0.3 s.
- **Transitions:** hard cuts; or one shader transition family from the registry.
- **Camera:** static; optional 2–3 % slow push-in on hero panels (scale 1→1.03 over the scene).
- **Build:** blueprints `grid-card-assemble`, `titlecard-reveal`, `dataviz-countup`; search `npx hyperframes catalog --query "<move>"` first.
- **Don't:** mix radii, mix two accent colors, use `linear` eases, let elements enter all at once.

## 3. Kinetic typography

- **Signature:** words *are* the picture; scale jumps, rotations, line-by-line reveals on beats.
- **Ingredients:** high-contrast two-color (black/white + one hot accent `#FF3B30`/`#FFD60A`), condensed or grotesk bold (Anton, Bebas, Inter Black), sizes 160–400, tight leading 0.85–0.95, uppercase. No images.
- **Motion:** word/char reveal (`animate-text` adapter), scale 0.6→1 `expo.out` 0.3 s, `yPercent` 100→0 from clipped lines, rotate ±8°, quick cuts every 0.4–1 s; occasionally hold one word 1.5 s. With music: every change on a beat (`npx hyperframes beats`).
- **Transitions:** hard cuts, color flips (bg/fg swap on a beat).
- **Camera:** scale/pan on the whole text group as "camera".
- **Build:** blueprint `kinetic-type-beats`; `overflow:hidden` line masks; `fromTo` with `yPercent`.
- **Don't:** more than 4 words on screen at once; soft/slow eases; decorative elements competing with type.

## 4. Flat 2D animation / cartoon

- **Signature:** illustrated characters and props with clean outlines or flat fills, squash & stretch, expressive poses.
- **Ingredients:** 5–7 color palette with mid-saturation (e.g. `#2D3A8C` `#F6C453` `#E8674A` `#7FB069` `#F4EFE6`), 2–4 px outlines or none, rounded shapes; one rounded sans for any text (Nunito, Quicksand) 48–72. Flat shadows (offset ellipse), simple ground line.
- **Motion:** anticipation 0.1–0.2 s → action → overshoot `back.out(1.4–1.7)` → settle; squash/stretch `scaleX/Y` ±10 %; arcs not straight lines; eases `power2.inOut` for limbs; walk 0.6 s/step; blink 0.14 s every 3–5 s. See `character-and-dialogue.md` for speech.
- **Transitions:** wipes, iris, object-led match cuts (a prop carries into the next scene).
- **Camera:** static or slow pans on layered backgrounds (2–3 parallax layers at 0.3/0.6/1.0 speed).
- **Build:** SVG with named `<g>` per limb (`transformOrigin` at joints), GSAP `rotation`/`x`/`y`; or Lottie files via the `lottie` adapter; backgrounds as separate layers.
- **Don't:** animate the whole character as one PNG sliding around; linear motion; mouths looping during silence; mixing illustration styles across scenes.

## 5. Whiteboard / hand-drawn

- **Signature:** lines drawing themselves on a paper/board; hand-written type; a hand or marker optional.
- **Ingredients:** paper `#F7F3EA` or board `#FFFFFF` with faint texture; ink `#1E1E1E`; one marker accent (`#D7263D` or `#1B6CA8`); hand-style font (Caveat, Patrick Hand) 56–84; rough 3–5 px strokes, slightly imperfect.
- **Motion:** draw-on via `stroke-dasharray`/`stroke-dashoffset` (`power1.inOut`, 0.8–2 s per shape, proportional to path length); fills fade in after the outline; text draws or types; small "settle" wobble none.
- **Transitions:** erase-wipe (white rect sweeps), or camera pan to the next area of the board.
- **Camera:** slow pans/zooms across one big board (one large composition, animate a wrapper's `x/y/scale`).
- **Build:** SVG paths with `getTotalLength()` computed at build time (not at seek), set `dashoffset` tween in the paused timeline; optional hand PNG following the path via GSAP MotionPath.
- **Don't:** instant appear of outlines; perfect geometric shapes; drop shadows; dark mode.

## 6. Paper cut-out / collage

- **Signature:** layered paper shapes with hard shadows, stepped (stop-motion) movement, textures.
- **Ingredients:** paper textures (subtle noise PNG overlays at 8–15 % opacity), warm palette (`#F2E8CF` `#BC4749` `#386641` `#6A994E` `#A7C957`), hard shadows `6px 8px 0 rgba(0,0,0,.25)`, torn/irregular edges (SVG paths), serif or typewriter font (Playfair, Courier Prime) 56–96.
- **Motion:** stepped easing `steps(8–12)` on moves so motion feels frame-by-frame; rotation ±3° jitters on holds (keyed every 0.25 s via `set`, deterministic, no random); pieces slide in from edges 0.4–0.6 s.
- **Transitions:** paper flip/peel (rotateX with perspective), layered slide-overs.
- **Camera:** static, or stepped push-ins.
- **Build:** each piece an absolutely positioned `<img>`/SVG layer; `ease: "steps(10)"`; shadow layers separate so they can offset on lift.
- **Don't:** smooth eases (kills the craft feel); glossy gradients; thin modern type.

## 7. Isometric / 2.5D

- **Signature:** isometric scenes, parallax depth, floating layers, soft long shadows.
- **Ingredients:** iso grid 30°, muted base + 1–2 bright accents (`#1C2541` `#3A506B` `#5BC0BE` `#FFE66D`), consistent light direction (top-left), long soft shadows, geometric sans (Space Grotesk, DM Sans) 48–72.
- **Motion:** elements rise into place (`y` +60→0 + opacity, `power3.out` 0.6 s) in build order (back to front); gentle float on holds (±4 px, 3 s `sine.inOut` yoyo, finite repeat count); parallax: layers move at 0.2/0.5/1.0 of the camera move.
- **Transitions:** camera travel between "stations" (blueprint `spatial-pan-stations`, `camera-journey`).
- **Camera:** slow pans and push-ins on a wrapper; CSS `perspective` + `rotateX` for tilt moments.
- **Build:** CSS 3D transforms on layer groups, `transform-style: preserve-3d`; iso shapes as SVG; animate the wrapper for camera, children for content.
- **Don't:** mix light directions; flat drop shadows under iso objects; perspective and iso in the same scene.

## 8. Real 3D (Three.js)

- **Signature:** lit 3D objects, reflections, orbiting camera, depth of field feel.
- **Ingredients:** HDRI/environment lighting + one key light; materials: physically based (metalness/roughness), neutral studio bg `#0E0E10` or soft gradient; type kept 2D on top (Inter 64–96) for clarity. Models GLB < 20 MB.
- **Motion:** camera orbit 15–30° over a scene (`sine.inOut`), slow dolly-in 5–10 %, object turntable 0.1 rev/s; all driven by HyperFrames time via `hf-seek` (adapter), never rAF.
- **Transitions:** camera cuts between fixed angles, or 2D overlays wiping over the canvas.
- **Camera:** this *is* the camera; one move per scene, eased.
- **Build:** `/hyperframes-animation` → `adapters/three.md`: create renderer/scene synchronously, preload assets, render on `hf-seek`; **set root `data-duration`** (no auto-inference). Match canvas to `data-width/height`, `devicePixelRatio` fixed to 1 for determinism.
- **Don't:** load textures at seek time; use `setAnimationLoop`; random particles without a seeded RNG; let 3D text replace readable 2D type.

## 9. Pixar-inspired / CGI character look

- **Signature:** soft studio lighting, rounded forms, warm palette, subsurface-looking skin, big expressive eyes, story beats with acting.
- **Honesty first:** pure HTML cannot produce this. Choose with the user: **(a)** pre-rendered clips (external 3D/AI video tool) composed, graded, and cut in HyperFrames; **(b)** Three.js with rigged GLB characters + AnimationMixer clips + blendshapes (requires professional assets); **(c)** *Pixar-inspired 2.5D*: AI-generated layered character/scene plates with soft light, parallax camera, and 2D rig tricks for eyes/mouth.
- **Ingredients (for b/c):** warm key light + cool fill, bg soft bokeh gradients (`#FFD7A8` → `#8CA9D3`), palette saturated but soft, no hard outlines; type: friendly rounded (Fredoka, Baloo) 64–96; depth of field via blurred back layers (`filter: blur(6px)` on the far layer only).
- **Motion:** acting rules from `character-and-dialogue.md` (anticipation, overshoot, eye-lead, blink); camera slow push-ins and gentle parallax; nothing linear; hold on faces 1–2 s for emotion.
- **Transitions:** crossfades 0.5–0.8 s, match cuts on action.
- **Camera:** cinematic — one deliberate move per shot, eye-level or slightly low for warmth.
- **Build:** (a) `<video>` clips on tracks + `media-treatment` grade + titles; (b) three adapter + `AnimationMixer.setTime(t)` on `hf-seek`; (c) layered `<img>` plates + GSAP parallax + SVG eye/mouth overlays.
- **Don't:** claim "Pixar" for flat cards; hard outlines; neon palettes; robotic constant motion; faces without blinks.

## 10. Cinematic / real footage

- **Signature:** graded footage, letterbox optional, restrained titles, rhythm from cuts.
- **Ingredients:** one grade/LUT across all clips (`media-treatment`), title type thin or serif (Inter Light 56–72 +0.2em uppercase, or Playfair), white/off-white text with 40 % black gradient scrim behind when over footage; 2.39:1 bars only if the user asked.
- **Motion:** titles fade 0.8–1.2 s; clips cut on beats or every 2–5 s; subtle Ken Burns (scale 1→1.06 over the clip) on stills; speed ramps via `data-playback-rate`/automation only if asked.
- **Transitions:** hard cuts (default), 12–20 frame crossfades, dip-to-black between chapters.
- **Camera:** footage's own; add only slow digital push-ins ≤ 8 %.
- **Build:** `<video data-start data-duration data-media-start data-volume>`; overlays on a higher track; `hyperframes-core/references/creator-editing-recipes.md` for cuts/trim; grade with `media-treatment`.
- **Don't:** different grades per clip; text without scrim over busy footage; stretching aspect; animated UI-style cards over cinematic shots.

## 11. AI-generated plates

- **Signature:** illustrated/photographic still scenes brought to life with camera moves and layered parallax.
- **Ingredients:** consistent prompt style across all plates (same medium, lighting, palette words); generate 2–3 layers per scene (bg / mid / subject) or one plate + cutout subject; 2048 px+ wide for push-ins. Type per the chosen sub-style.
- **Motion:** Ken Burns 4–8 % scale or 40–80 px pan per 4 s; parallax 0.3/0.6/1.0; subject subtle breathing scale 1→1.01; crossfade between plates 0.6 s.
- **Transitions:** crossfade, light-leak/flash from registry, match on composition.
- **Camera:** one slow move per plate; alternate direction plate to plate.
- **Build:** fire all generations first (`/media-use` generate), in parallel; `<img>` layers in a wrapper; animate wrapper for camera. Record the prompt per plate in `DIRECTION.md`.
- **Don't:** inconsistent styles between plates; moving text over detailed plates without a panel; zooming into low-res images.

## 12. UI / screen demo

- **Signature:** the product UI (real capture or faithful rebuild), a cursor, typing, highlights, zoom-ins on the action.
- **Ingredients:** product's own colors; device/browser frame optional (blueprint `device-surface-showcase`); annotation accent one color; callout type Inter 36–44; dimmed overlay `rgba(0,0,0,.45)` to spotlight.
- **Motion:** cursor moves on bezier 0.5–0.9 s `power2.inOut`, click = scale 0.9 pulse 0.15 s; typewriter 12–18 chars/s; zoom-in to 1.4–1.8× on the active area 0.6 s `power3.inOut`; highlights draw 0.3 s.
- **Transitions:** zoom-out to full UI between tasks; hard cuts between screens.
- **Camera:** zoom/pan on the UI wrapper — never animate the timed clip itself (animate an inner wrapper).
- **Build:** blueprints `cursor-ui-demo`, `prompt-type-submit-generate`, `zoom-out-workspace-reveal`; `hyperframes capture <url>` for real sites; keyframes via `/hyperframes-keyframes`.
- **Don't:** instant cursor jumps; typing faster than readable; zooming so far text blurs; fake UI that contradicts the real product.

## 13. Retro / glitch / CRT

- **Signature:** scanlines, chromatic aberration, VHS tracking, pixel fonts, neon on black.
- **Ingredients:** `#0A0A0A` bg, neon `#39FF14` `#FF2079` `#00E5FF`, pixel/mono fonts (Press Start 2P, VT323, IBM Plex Mono) 48–96; scanline overlay (repeating-linear-gradient 2 px) 10–20 %; vignette.
- **Motion:** glitch bursts 0.1–0.25 s (clip-path slices + `x` offsets ±12 px, RGB split via duplicated text layers offset ±3 px), 2–4 per 10 s **at planned times** (deterministic, keyed with `set`); typewriter with blinking block cursor (steps(1), 0.5 s); flicker opacity 0.9↔1 keyed.
- **Transitions:** tracking-roll wipe, white flash, signal-cut to black 3 frames.
- **Camera:** slight CRT barrel feel via static SVG filter or registry effect; static.
- **Build:** search the registry first (`catalog --query "crt scanlines"`, `"glitch"`); CSS `mix-blend-mode: screen` for RGB layers.
- **Don't:** random `Math.random()` glitches (non-deterministic); glitching the entire video; thin elegant type.

## 14. Data-viz / chart story

- **Signature:** one number or chart that reveals and lands; annotations guide the eye.
- **Ingredients:** neutral bg (`#FFFFFF` or `#0B0F14`), data color scale 1 primary + greys (`#4F46E5` + `#CBD5E1`), highlight color for "the point" (`#F97316`); labels Inter 28–36, big stat 160–240 tabular numerals (`font-variant-numeric: tabular-nums`); thin axes 1 px 30 % grey; grid optional.
- **Motion:** bars grow from baseline (`scaleY` with origin bottom, `power3.out` 0.8 s, stagger 0.05 s); lines draw via `stroke-dashoffset` 1.5–2.5 s `power1.inOut`; count-up synced to the line/bar end; annotation appears **after** the data settles (+0.3 s); dim non-focus series to 25 % when highlighting.
- **Transitions:** chart morphs (same axes, data re-tween) over cuts.
- **Camera:** static; optional zoom on the highlighted region.
- **Build:** blueprint `dataviz-countup`; SVG charts computed from the data at build time (no runtime fetch); numbers via GSAP `snap` to integers.
- **Don't:** animate axes with the data; count-ups longer than 1.5 s; 3D/pie effects; truncated y-axes without saying so.

## 15. Mixed media

- **Signature:** footage + graphics + type sharing frames; energetic, editorial.
- **Ingredients:** footage graded to one look; graphic layer uses the brand palette with one accent; type bold grotesk 72–140; shapes as frames/masks around footage (rounded rects, circles, split screens).
- **Motion:** footage in masks that scale/slide (`clip-path` or wrapper transforms) 0.5 s `power3.out`; type on beats; quick cuts 1–2 s; occasional whole-frame color flash 2 frames (only if style energy is high).
- **Transitions:** mask reveals, split-screen slides, whip pans (registry).
- **Camera:** mixed — footage static in masks, graphics panel moves.
- **Build:** tracks: footage (low), masks/shapes (mid), type (top); `comparison-split`, `video-text-pivot` blueprints.
- **Don't:** more than two moving layers at once; footage and graphics with different color temperatures; type over faces.

---

## Using a recipe

1. Pick the card; copy its Ingredients/Motion/Transitions/Camera into `## Type & Style`, replacing defaults with the user's brand values.
2. Every scene's motion table uses **only** the verbs/eases/durations from that card (deviations are listed as `ASSUMED` with a reason).
3. Build with the listed techniques; search the registry before hand-rolling an effect.
4. In the Fidelity Report, row `S0` cites the recipe and the snapshots that prove it was followed.
