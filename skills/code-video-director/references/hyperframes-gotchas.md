# HyperFrames gotchas that silently break fidelity

These are not style tips. Each one produces a render that **differs from the plan or the preview
without an obvious error**, which the user experiences as "that's not what I described". Full
technical contract: `/hyperframes-core` and its `references/`. Confirm against the installed
version's `npx hyperframes lint` output when in doubt — lint rule codes are quoted where known.

## Timing & length

| Symptom                                         | Cause                                                                                     | Fix                                                                                                                        |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Video is shorter than asked; ending cut off     | Root `data-duration` smaller than the last clip's end. Render length = root duration.    | Set root `data-duration` to the brief's total; lint warns `clip_ends_past_root_duration`. Last shot End must equal it.     |
| Video is longer than asked / holds a dead frame | Root `data-duration` larger than content; timeline ends early and holds its last frame.   | Make root duration exact; make the final shot hold intentionally (end card) rather than freezing on leftover state.        |
| Things happen "at the same time" when brief said "then" | Same `data-start` or GSAP tweens placed at the same position.                      | Give sequential clips increasing `data-start`; in GSAP use explicit positions (`tl.to(..., 3.0)`) copied from the shot list.|
| Element never appears                           | `data-start` outside root duration, or `data-hidden` left on, or clip's parent also timed with a window that excludes it. | Check `npx hyperframes timeline --json` for its `absStart/absEnd`; remove `data-hidden`; time wrapper **or** child, not both. |
| Animation plays in preview but not in render    | Timeline not `paused: true`, not registered on `window.__timelines["<id>"]`, or key ≠ root `data-composition-id`; or built after an `await` and registered too early. | Exactly one paused timeline, registered **after** it is fully built, key equals root id.                                 |
| Motion starts "already finished" in render      | Seek-unsafe animation: CSS `transition`, `setTimeout`, `requestAnimationFrame`, `Date.now()`, `Math.random()`. | Only seekable runtimes (GSAP timeline, CSS keyframes via adapter, Lottie, etc.). No clocks/random/network. |
| Element jumps at the start of its tween         | CSS `transform` on the same element you tween with GSAP `x/y/scale/rotate` (`gsap_css_transform_conflict`). | Center with flex/grid/`inset`; set initial state in `gsap.fromTo(...)` not CSS.                                          |
| Scene inside a sub-composition fires 6 s late (or never) | Sub-composition timelines are **local**: local 0 = the host clip's `data-start`. Writing absolute times (`6.0`) inside `compositions/cards.html` whose host starts at 6 fires at absolute 12. | Shot list keeps absolute times; convert to local (`abs − host data-start`) inside the sub-comp. Host-level clips (audio, overlays in `index.html`) stay absolute. Verify with `timeline --json` `absStart` and a snapshot. |
| Sub-composition goes blank before the video ends | Host clip `data-duration` shorter than the window it should cover (`subcomposition_blanks_before_host`). | The host clip's `data-duration` is the visible window; make it span the shot. A shorter inner timeline simply holds its last frame. |
| Clip flickers or vanishes mid-slot              | Tweening `visibility`/`autoAlpha`/`display` on a `.clip` (`gsap_animates_clip_element`), or a scene-exit `set({visibility:"hidden"})`. | The runtime owns clip visibility. Animate an inner child; fade `opacity` only.                                  |

## Audio

| Symptom                                      | Cause                                                                                 | Fix                                                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Render is **silent**                         | `<audio>` has no `id` (`media_missing_id`) → mixer ignores it. Or `src` is remote/missing. | Every `<audio id="…" src="local/file">`. Check `timeline --json` shows the audio row and ffprobe shows an audio stream. |
| Music too loud / voice buried                | No `data-volume`; no duck.                                                            | `data-volume="0.2"` on music; when voice plays under music, carve/duck per `/hyperframes-audio`.                    |
| SFX at the wrong moment                      | `data-start` of the SFX not copied from the shot list; or the visual moved and the SFX didn't. | Treat SFX `data-start` as derived from the visual's start; update both together; assert in the report.        |
| Audio starts from the wrong point in the file| Missing `data-media-start` (trim offset).                                              | `data-media-start="<seconds into the file>"`.                                                                        |
| Preview breaks / render differs with media   | `crossorigin` on `<video>/<audio>` (`media_crossorigin_breaks_preview`).              | Remove it; ship local files.                                                                                        |

## Visual fidelity

| Symptom                                   | Cause                                                                                   | Fix                                                                                             |
| ----------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Wrong font in render                      | `font-family` names a font with no local `@font-face` (`font_family_without_font_face`); render machine falls back. | Ship the font file in the project and declare `@font-face` in the composition file.   |
| Layout wrong size / cropped               | `#root` hardcoded to `1920px×1080px` instead of `100%`; or wrong `data-width/height` for the requested aspect. | `#root { width:100%; height:100% }`; canvas size comes from `data-width`/`data-height`. |
| Text overflows / wraps differently        | `<br>` in body text; unsized transformed elements; long copy with fixed font-size.      | No `<br>` in body text; size containers; check passes layout audit; look at snapshots.          |
| Sub-composition shows nothing / unstyled  | Standalone root wrapped in `<template>` (or the inverse); sub-comp `<style>/<script>` placed outside the `<template>`; id mismatch between host, inner root, and timelines key. | Standalone: no template. Sub-comp: template with style/script **inside**; all three ids equal. |
| Element hidden in both preview and render | `data-hidden` attribute left on (Studio eye icon).                                      | Remove the attribute.                                                                            |
| Full-screen background missing            | Shader transitions / HDR path forces root transparent.                                  | Put the fill on a full-bleed child `position:absolute; inset:0`, not the root.                   |
| `check` looks clean but did nothing       | A lint **error** disables layout/contrast audits (`0 sample(s)`, `0/0 text checks`).    | Clear lint errors first; then trust `check`.                                                     |

## Process gotchas (agent behaviour)

- **Using an example as a base and forgetting to remove its content.** `init --example` ships real
  copy, colors, and music. Every leftover is an unrequested element. Grep the project for the
  example's text and assets before verification.
- **Re-estimating timings in code.** The shot list has `3.0`; the code says `2.8` "because it felt
  better". The code copies the table. Taste changes go through the table first.
- **Declaring success from `lint` alone.** Lint checks syntax contracts, not whether the video matches
  the brief. Only the full Step 5 gate plus the Fidelity Report counts.
- **Rendering before the user approved.** Preview first (`preview --background`), ask, then render.
- **Reading every file to answer a timeline question.** Use `npx hyperframes timeline --json`.
