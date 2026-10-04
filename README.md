# code-video-director

An agent **skill** for [HyperFrames](https://github.com/heygen-com/hyperframes) (HeyGen's
HTML-to-video framework) that makes your AI build **the video you actually described** — not
something "similar".

The official HyperFrames skills teach the AI the *syntax* (`data-start`, GSAP timelines, lint,
render). This skill adds the missing **director layer**: it forces the AI to turn your words into a
numbered requirement list, a timed shot list, a build that copies those numbers, automated proof
that each requirement is on the timeline, and a fidelity report you can audit line by line.

```
your description
   → Requirement Ledger   (every noun / number / "then" / quoted string becomes a row)
   → Shot List            (absolute start/end per shot, traced to ledger IDs)
   → HyperFrames build    (code copies the table; never re-estimates)
   → Proof                (index.motion.json + check + timeline --json + snapshots + ffprobe)
   → Fidelity Report      (one line per requirement, with evidence, before "done")
```

## Install

Pick the one that matches your tool. The skill is the folder `skills/code-video-director/`.

**Any agent that supports the `skills` CLI (Claude Code, Cursor, Codex, Gemini CLI, …):**

```bash
npx skills add Eren-dotcom/code-video-director
# plus the official HyperFrames skills, which this one builds on:
npx skills add heygen-com/hyperframes
```

**Claude Code (manual):**

```bash
git clone https://github.com/Eren-dotcom/code-video-director
mkdir -p .claude/skills
cp -r code-video-director/skills/code-video-director .claude/skills/
```

**Cursor / other `.agents` layouts:** copy the same folder to `.cursor/skills/` or `.agents/skills/`.

**No skill support at all:** paste the contents of `skills/code-video-director/SKILL.md` at the top
of your prompt and attach the `references/` files you need.

## Use

Tell the agent to use the skill and describe the video in one message, as precisely as you can:

```
Using /code-video-director (and /hyperframes), make a 15 second, 16:9 product intro.
Start with a dark background, the logo fades in center, then the tagline "Ship faster"
slides up under it, then three feature cards appear one by one left to right: Speed,
Safety, Scale, with a soft whoosh when each card appears. End with the URL example.com.
Brand color #6C5CE7. Music quiet under everything.
```

What you should get back, in order:

1. A **Requirement Ledger** + **Shot List** (`DIRECTION.md`) and at most 3 blocking questions.
2. The build, then the verification gate (`lint` → `check` → `timeline` → snapshots → draft render).
3. A **Fidelity Report** — one row per requirement with ✅/⚠️/❌ and the evidence. Anything not
   exactly as you asked is called out, never hidden.
4. A preview link and the question "render final, or change something?"

For changes, name the requirement IDs ("R4: make the tagline red"). The agent edits only those,
re-runs the gate, and reports the touched rows.

## Writing a brief the agent can't misread

- Give the **total length** and **aspect ratio** (or the platform).
- Put every on-screen text in **quotes** — it will be copied character for character.
- Use **sequence words** deliberately: "then / after" = one after another; "while / at the same
  time" = overlapping.
- Use the **motion verb** you mean: fade, slide, pop, zoom, typewriter, count-up.
- Give **hex colors** and **counts** ("three cards", not "some cards").
- Say what the video **ends on**.
- Say what you **don't** want ("no music", "no extra outro").
- Attach your files (logo, music, footage) or expect them to be listed as `ASSET NEEDED`.

## Repository layout

```
skills/code-video-director/
  SKILL.md                          the skill (entry point)
  references/
    requirement-ledger.md           how to extract requirements without losing any
    direction-template.md           DIRECTION.md template (ledger + shot list + proof plan)
    hyperframes-gotchas.md          HyperFrames mistakes that silently break fidelity, with fixes
    motion-sidecar.md               turning the shot list into index.motion.json assertions
    verification-recipes.md         copy-paste commands for the verification gate
    fidelity-report.md              the final report format
    worked-example.md               full walkthrough of the example below
examples/ship-faster/               runnable HyperFrames project built with this process
  DIRECTION.md · index.html · index.motion.json · compositions/ · assets/make-placeholders.mjs
```

Try the example:

```bash
cd examples/ship-faster
node assets/make-placeholders.mjs      # silent stand-in audio (replace with real files)
npx hyperframes lint                    # 0 errors, 0 warnings
npx hyperframes timeline                # matches DIRECTION.md's shot list
npx hyperframes check --snapshots       # runs the 15 motion assertions
npx hyperframes preview
```

Requires Node.js ≥ 22 and FFmpeg (for render).

## License

MIT for this repository. HyperFrames itself is Apache-2.0 (© HeyGen).
