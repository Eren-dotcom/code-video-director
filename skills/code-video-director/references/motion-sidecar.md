# From Shot List to `index.motion.json`

`npx hyperframes check` automatically discovers a `*.motion.json` sidecar next to a composition
(same basename: `index.html` → `index.motion.json`; `compositions/hero.html` →
`compositions/hero.motion.json`). It evaluates the assertions against the **same seeked timeline the
renderer uses**, so a green run is the closest automated proxy to "render it and watch it". A
selector that matches nothing fails loudly (`motion_selector_missing`) — typos cannot pass.

Write the sidecar **from `DIRECTION.md`, before or independently of the HTML**, so it tests the
code rather than echoing it.

## Assertion vocabulary

| Assertion                                     | Proves (ledger types)                  | Fails with            |
| --------------------------------------------- | -------------------------------------- | --------------------- |
| `{ "kind": "appearsBy", "selector", "bySec" }` | the element is visible (opacity ≥ 0.5) by that time — ELEMENT, TEXT, TIME | `motion_appears_late` |
| `{ "kind": "before", "a", "b" }`              | `a` first appears strictly before `b` — SEQUENCE, COUNT ("one by one") | `motion_out_of_order` |
| `{ "kind": "staysInFrame", "selector" }`      | once visible, its box never leaves the canvas — LAYOUT, readability | `motion_off_frame`    |
| `{ "kind": "keepsMoving", "withinSelector"?, "maxStaticSec"? }` | the scene is not frozen for longer than `maxStaticSec` (default 2) — MOTION | `motion_frozen` |

Optional top-level `duration` (seconds) documents the expected length.

## Mapping rules

1. **Every element in the shot list gets an `appearsBy`** at `shot start + entrance duration +
   0.2 s` grace. Use the shot list numbers, not guesses.
2. **Every SEQUENCE / "one by one" / "then" gets `before` pairs** along the chain:
   `before(a,b)`, `before(b,c)` — not just first and last.
3. **Every text that must be readable gets `staysInFrame`.** Also logos, cards, charts.
4. **`keepsMoving` only where the brief implies continuous motion** (a background loop, a
   count-up, a "dynamic" montage). Do **not** add it to an intentional end-card hold — it would fail
   by design. If the composition does have an end hold, scope `keepsMoving` with `withinSelector`
   to the moving part or omit it.
5. For an element that should **disappear** ("the intro title goes away before the cards"), assert
   the next element with `before(title, firstCard)` plus a snapshot check at a time after the title
   should be gone (there is no `disappearsBy` assertion; snapshots cover it).
6. Sub-compositions: selectors are evaluated on the assembled page; prefix ids with the composition
   id as `/hyperframes-core` recommends (`#hero-title`) so they resolve uniquely.

## Example (from the worked example)

```json
{
  "duration": 15,
  "assertions": [
    { "kind": "appearsBy", "selector": "#logo", "bySec": 1.3 },
    { "kind": "staysInFrame", "selector": "#logo" },

    { "kind": "before", "a": "#logo", "b": "#tagline" },
    { "kind": "appearsBy", "selector": "#tagline", "bySec": 3.9 },
    { "kind": "staysInFrame", "selector": "#tagline" },

    { "kind": "before", "a": "#tagline", "b": "#card-1" },
    { "kind": "before", "a": "#card-1", "b": "#card-2" },
    { "kind": "before", "a": "#card-2", "b": "#card-3" },
    { "kind": "appearsBy", "selector": "#card-1", "bySec": 6.9 },
    { "kind": "appearsBy", "selector": "#card-2", "bySec": 7.9 },
    { "kind": "appearsBy", "selector": "#card-3", "bySec": 8.9 },
    { "kind": "staysInFrame", "selector": "#card-3" },

    { "kind": "before", "a": "#card-3", "b": "#url" },
    { "kind": "appearsBy", "selector": "#url", "bySec": 12.8 },
    { "kind": "staysInFrame", "selector": "#url" }
  ]
}
```

## What the sidecar cannot prove (cover with other checks)

| Requirement type        | Proof                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Exact text / spelling   | `grep -F '"Ship faster"' index.html` + look at the snapshot                             |
| Exact color             | grep the hex in CSS + look at the snapshot                                              |
| Position (center, etc.) | snapshot at the shot's midpoint; `check` layout audit for overflow/overlap               |
| Total duration / size   | `ffprobe` on a draft render; root `data-duration`, `data-width`, `data-height`          |
| Audio present & timed   | `npx hyperframes timeline --json` audio rows (`src`, `absStart`, `absEnd`, `volume`); ffprobe audio stream |
| Motion verb (fade vs slide) | read the tween properties (`opacity` only = fade; `y` = slide; `scale` = pop) + two snapshots inside the entrance |
| Nothing extra present   | `timeline --json` row count equals the shot list's element count; grep for example leftovers |
