# Verification recipes (copy-paste)

Run from the project directory. Stop at the first failure, fix, and restart from the top.
`jq` versions first, `node` fallbacks where it matters.

## 1. Lint and check

```bash
npx hyperframes lint
npx hyperframes check --snapshots            # motion.json assertions run here automatically
npx hyperframes check --snapshots --json > /tmp/check.json
jq '.findings | map(select(.severity=="error")) | length' /tmp/check.json   # must be 0
```

Read every warning. `clip_ends_past_root_duration` is a fidelity bug (ending cut off), not a nit.

## 2. Timeline vs. Shot List

```bash
npx hyperframes timeline                     # human table — eyeball against DIRECTION.md
npx hyperframes timeline --json > /tmp/tl.json
```

Total duration equals the brief:

```bash
jq '.timeline.duration' /tmp/tl.json
```

Every clip with absolute start/end and file (compare each row with the Shot List, ±0.05 s):

```bash
jq -r '.timeline.tracks[] | .kind as $k | .rows[] | "\($k)\t\(.id)\t\(.absStart)\t\(.absEnd)\t\(.src // "")\t\(.file)"' /tmp/tl.json | column -t
```

Audio rows exist (brief has music/voice/SFX → this must not be empty) and nothing is pending:

```bash
jq '[.timeline.tracks[] | select(.kind=="audio") | .rows[] | {id, src, absStart, absEnd, volume}]' /tmp/tl.json
jq '[.timeline.tracks[].rows[] | select(.durationSource=="pending") | {id, pendingReason}]' /tmp/tl.json   # must be []
```

What is on screen at a specific time T (check a "then" moment):

```bash
jq --argjson t 7.5 '[.timeline.tracks[].rows[] | select(.absStart<=$t and .absEnd>$t) | .id]' /tmp/tl.json
```

Sequence check — clip B must start after clip A (positive delta):

```bash
jq -r '[.timeline.tracks[].rows[]] | map({(.id): .absStart}) | add | "\(.["card-2"] - .["card-1"])"' /tmp/tl.json
```

Count check — "three cards" means exactly three matching rows:

```bash
jq '[.timeline.tracks[].rows[] | select(.id | test("^card-"))] | length' /tmp/tl.json
```

Node fallback for the full row dump when `jq` is missing:

```bash
node -e 'const j=JSON.parse(require("fs").readFileSync("/tmp/tl.json","utf8"));j.timeline.tracks.forEach(t=>t.rows.forEach(r=>console.log(t.kind,r.id,r.absStart,r.absEnd,r.src||"",r.file)))'
```

## 3. Text, colors, leftovers

```bash
# every quoted string from the brief must be present verbatim
grep -nF 'Ship faster' index.html compositions/*.html 2>/dev/null
# every exact hex from the brief
grep -niE '#6C5CE7' index.html compositions/*.html 2>/dev/null
# leftovers from an example scaffold (adapt the words to the example you started from)
grep -rniE 'lorem|swiss grid|warm grain|kinetic|placeholder|TODO' --include=*.html . | grep -v node_modules
```

## 4. Snapshots — then actually look

Midpoint of every shot, plus 0.1 s before the end (the end state):

```bash
npx hyperframes snapshot --at 1.5,4.5,7.0,8.0,9.0,13.5,14.9
ls -la snapshots/ 2>/dev/null || find . -name '*.png' -newer index.html -not -path '*/node_modules/*'
```

Open each PNG with your image-reading tool and answer, per frame: *what does the shot list say is
on screen at this time, and is it there, with the right text, color, and position?* Record the
answer in the Fidelity Report's evidence column (`snapshot@7.0 shows card-1 only ✓`).

To zoom on a doubtful area, re-run `check --snapshots` (it writes `finding-NN-<code>.png` crops for
every error with a bbox).

## 5. Draft render + container facts

```bash
npx hyperframes render --quality draft --output /tmp/draft.mp4
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 /tmp/draft.mp4     # == brief duration ±1 frame
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of csv=p=0 /tmp/draft.mp4
ffprobe -v error -show_entries stream=codec_type -of csv=p=0 /tmp/draft.mp4 | sort | uniq -c   # "audio" present if the brief has sound
```

Read the render summary's second line (`beginframe` vs `screenshot`, GPU). Confirm the file is
non-empty.

Optional: compare two candidates or a before/after at a key time:

```bash
npx hyperframes compare ./v1 ./v2 --at 7.5 --labels before,after
```

## 6. Preview for the user, then final render

```bash
npx hyperframes preview --background          # hand the URL to the user; ask: render or change?
npx hyperframes render --quality delivery --output renders/final.mp4    # only after approval
# or: npx hyperframes cloud render
```

## 7. On a change request

```bash
npx hyperframes history begin --who director --label "<change>"   # if the project uses history
# edit only the named shots
npx hyperframes history end
```

Then run sections 1–5 again in full.
