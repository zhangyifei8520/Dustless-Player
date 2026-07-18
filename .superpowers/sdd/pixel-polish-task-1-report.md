# Pixel Polish Task 1 Report

## Status

Implemented only Task 1: installed the supplied PoxiaoPixel font, calibrated desktop navigation and console-control semantics, and moved the cartridge instruction into the console stage. Mobile media-query rules, card dimensions, fullscreen sizing, sound behavior, playback state logic, and external player URLs were not changed.

## RED evidence

Command run before production changes:

```sh
node --test tests/pixel-controls-contract.test.mjs
```

Result: failed as expected (1 failing test, 0 passing). The first failing assertion reported that the stylesheet did not contain the required local `@font-face` for `PoxiaoPixel`. At that point, the source also still had no `slot-hint` and the console hover/focus rule still used a dashed outline, matching the Task 1 RED condition.

## GREEN evidence

Command run after implementation:

```sh
node --test tests/pixel-controls-contract.test.mjs
```

Result: passed (1 passing test, 0 failures).

Required complete verification command:

```sh
node --test tests/pixel-controls-contract.test.mjs && npm run lint && npm test
```

Result: passed. The visual-contract test passed; ESLint completed with no errors; `npm test` passed 11 unit tests, completed the production build, and passed the rendered HTML test. The build emitted only tool/environment warnings about proxy variables and Vinext static route classification.

## Changed files

- `public/fonts/PoxiaoPixel.ttf` — copied from `/Users/zhangyifei/Downloads/破晓像素_猫啃网/破晓像素/FZG_CN.ttf`.
- `tests/pixel-controls-contract.test.mjs` — source-level contract for the local font, nav shadow/family, control focus treatment/alignment, and relocated instruction.
- `src/components/GameConsole.tsx` — moved the instruction into `.console-stage` as `.slot-hint` immediately after the slot drop zone.
- `src/styles/pixel.css` — added the local font-face and the requested desktop navigation, control, label, and slot-instruction calibration.
- `.superpowers/sdd/pixel-polish-task-1-report.md` — this evidence record.

## Implementation commit

`bf984d580c5df60af21ba210654892966b99ce7c` — `feat: calibrate pixel controls and font`

## Review follow-up: navigation artwork and fullscreen label

### RED evidence

After extending `tests/pixel-controls-contract.test.mjs` with the review requirements, the focused command was run before CSS production changes:

```sh
node --test tests/pixel-controls-contract.test.mjs
```

Result: failed as expected (1 passing test, 1 failing test). The new test failed on `.nav-home::before`, reporting the existing `width: 25px; height: 13px;` rather than the calibrated `15px × 8px` geometry. This established the reported oversized navigation artwork defect before the CSS change.

### GREEN evidence

The navigation icons were retained and their internal home/library pseudo-element geometry was scaled to fit the existing 15px icon container; `.nav-about` was set to 15px. Their existing white `currentcolor` fill and black drop-shadow outline were preserved. `.fullscreen-control small` now explicitly uses `color: #171a31`.

The selector test helper was corrected after the first post-change run because the repeated `.nav-library::after` selector initially matched its shared base rule instead of its dedicated geometry rule. The focused contract was then rerun with the required complete verification command:

```sh
node --test tests/pixel-controls-contract.test.mjs && npm run lint && npm test
```

Result: passed. The focused contract passed 2 tests; ESLint completed with no errors; `npm test` passed 11 unit tests, completed the production build, and passed the rendered HTML test. The build emitted only the pre-existing proxy-variable and Vinext static-route-classification warnings.

## Review follow-up: literal fullscreen label black

### RED evidence

The fullscreen-label contract was changed to require literal pure black before the production CSS declaration was modified:

```sh
node --test tests/pixel-controls-contract.test.mjs
```

Result: failed as expected (1 passing test, 1 failing test). The failure reported `.fullscreen-control small` as `color: #171a31;`, which did not satisfy the required `color: #000;` assertion.

### GREEN evidence

Changed only `.fullscreen-control small` to `color: #000;`, then ran:

```sh
node --test tests/pixel-controls-contract.test.mjs && npm run lint && npm test
```

Result: passed. The focused contract passed 2 tests; ESLint completed with no errors; `npm test` passed 11 unit tests, completed the production build, and passed the rendered HTML test. The build emitted only the existing proxy-variable and Vinext static-route-classification warnings.
