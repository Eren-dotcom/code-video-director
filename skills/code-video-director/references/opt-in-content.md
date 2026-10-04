# Opt-in content — nothing is added unless the user asked for it

The most common complaint about agent-made videos: **extra text and a voiceover nobody asked
for.** The agent "fills" the video with captions, subtitles, a narrator, taglines, a music bed, an
outro, a CTA, a logo bug — because templates have them. Every one of those is a deviation from
the brief.

## The rule

> If the brief does not mention it, it does not exist in the video.

This applies to **every** item below. Each is **OFF by default** and turns on only when the user's
words ask for it (directly: "add a voiceover", or by clear implication: "explain in a narrator's
voice", "with subtitles", "with music").

| Content kind                       | OFF unless the user says…                                                        | If you think it's needed anyway                                                        |
| ---------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Voiceover / narration (TTS)        | "voiceover", "narrator", "someone says", "explain with voice", gives a script     | Ask one question **before** building: "Silent, or with a voiceover? (default: silent)" — only when the type normally has one (explainer/tutorial). Otherwise don't ask; build silent. |
| On-screen text that isn't in the brief | the exact words, or "add a title/label/caption that says…"                   | Never add. Not a title, not a label, not "Introducing", not a date, not a subtitle line. |
| Captions / subtitles               | "captions", "subtitles", "burned-in text", "for muted viewing"                   | If there IS speech and the destination is social, you may ask once. Never add silently. |
| Background music                   | "music", "soundtrack", "background track", "with a beat", attaches a file         | Don't add. A silent video is a correct video when no sound was requested.               |
| Sound effects                      | "whoosh", "click", "sound when…", "SFX"                                           | Don't add.                                                                             |
| Taglines / slogans / CTA           | the exact copy, or "end with a call to action saying…"                            | Don't invent one. "End with the URL" means the URL only.                                |
| Outro / end card / "thanks for watching" | explicitly asked                                                           | Don't add; end on the thing the user named.                                              |
| Logo / watermark / logo bug        | "logo", "brand mark", "watermark", attaches one                                  | Don't add; a placeholder appears only when the user asked for a logo and gave no file.   |
| Intro animation / logo sting       | asked                                                                            | Don't add. Start on the first thing the user described.                                  |
| Stock photos / footage / icons     | asked, or the style requires imagery the user described ("a photo of a city")    | Don't add decorative imagery to "fill" a frame.                                          |
| Decorative extras                  | asked                                                                            | No particles, confetti, grain, gradients, glows, lines, grids, shapes unless the declared style's recipe includes them *and* the user accepted the style. |
| Characters / presenter / avatar    | asked                                                                            | Don't add a narrator figure.                                                             |
| Emoji                              | present in the user's copy                                                       | Never add.                                                                               |
| Extra scenes                       | asked                                                                            | Don't pad to reach a round length; shorten instead and tell the user.                    |

## How this looks in the ledger

- Add explicit **`FORBIDDEN`** rows for the big four when the brief is silent on them, so they
  appear in the Fidelity Report as verified absences:
  `F1 — no voiceover (not requested)`, `F2 — no on-screen text beyond R4/R6–R8/R10`,
  `F3 — no music (not requested)`, `F4 — no captions`.
- Anything you still want to propose goes in as **`[ADDED]`** with a one-line reason, and is built
  **only after the user accepts**. In autonomous mode, do not add it — mention it as an offer in the
  delivery note.

## How this is verified (the "nothing extra" proof)

```bash
# 1. Every text node in the composition must be in the brief's quoted strings
sed '/<title>/d' index.html compositions/*.html | grep -oE '>[^<>{}]{2,}<' | sed 's/^>//; s/<$//; s/^[[:space:]]*//; s/[[:space:]]*$//' | sed '/^$/d' | sort -u
#    → compare this list against the ledger's TEXT rows. Any line not in the ledger = unrequested text.

# 2. Audio inventory must equal the ledger's AUDIO rows (empty when no sound was requested)
npx hyperframes timeline --json | jq '[.timeline.tracks[] | select(.kind=="audio") | .rows[] | {id, src}]'

# 3. No caption track / TTS artifacts unless requested
ls captions* audio_meta.json vo*.mp3 SCRIPT.md 2>/dev/null   # should not exist for a silent brief

# 4. Snapshot pass: each PNG shows only elements listed in that scene's composition table
```

The Fidelity Report then carries rows like:
`F1 — no voiceover · ✅ verified · timeline audio rows = [] ; no SCRIPT.md`
`F2 — no extra text · ✅ verified · text inventory == {Ship faster, Speed, Safety, Scale, example.com}`

## When the user *does* ask for it

Then it is a normal `MUST` requirement with exact values:

- **Voiceover:** the script is **verbatim** from the user or written and **approved before TTS**;
  voice (gender, accent, language, pace) stated; file placed with `data-start` from word timings;
  music ducked under it. Scenes are re-timed to the real voice length — never the other way round.
- **Captions:** style, position (safe zone), max 2 lines, word-timed from the actual audio.
- **Music:** mood/genre as described; `data-volume` stated; starts/ends where the user said; carved
  under speech.
- **Text:** verbatim, one element per string, in the declared typography.

## Common agent failures this file forbids

- Adding "Introducing…" above the product name.
- Narrating a video that was described with only visuals.
- Captioning a video that has no speech.
- A music bed on a "simple logo animation".
- A closing "Follow us" or social handles.
- A second appearance of the logo "for branding".
- A date, version number, or "© 2026" footer.
- Replacing the user's short copy with a "better" longer sentence.
