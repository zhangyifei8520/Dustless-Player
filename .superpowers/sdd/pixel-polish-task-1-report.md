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
