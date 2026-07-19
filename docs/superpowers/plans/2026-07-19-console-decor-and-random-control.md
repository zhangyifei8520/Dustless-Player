# Console Decor and Random Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved desktop pixel decorations and random-recommendation control while widening cards, moving console controls upward, and preserving the game console as the page focal point.

**Architecture:** Extend `GameConsole` with static decorative markup and one presentational random button that reuses the existing notice mechanism. Use CSS-only pixel shapes and fixed desktop positioning around the existing console stage. Preserve existing player reducer behavior and all card state.

**Tech Stack:** React, TypeScript, CSS, Node test runner, Vinext.

## Global Constraints

- Use the existing `PoxiaoPixel` font and CSS shapes; do not add image assets or external dependencies.
- Keep the console stage unobstructed and centred.
- Card width increases by 20%; the visual inter-card gap remains unchanged.
- Change only the middle cartridge shell colour from blue to warm yellow; preserve all other card behavior and styling.
- Random control provides only the `随机推荐功能准备中` click feedback.
- Left identity copy is exactly `不吃灰 · 播放器`.
- Slot hint is exactly `↑ 把卡带拖进插槽`.
- Preserve playback, drag/drop, fullscreen, navigation, and mobile behavior.

---

### Task 1: Add static desktop controls, identity, and decorations

**Files:**

- Modify: `src/components/GameConsole.tsx`
- Modify: `tests/pixel-controls-contract.test.mjs`

**Interfaces:**

- Consumes: `showNavNotice(label: string)` in `GameConsole` and `PoxiaoPixel` CSS class conventions.
- Produces: `.brand-lockup`, `.left-decor`, `.right-decor`, and `.random-recommendation` markup with stable labels/classes.

- [ ] **Step 1: Write the failing markup contract**

  Extend `tests/pixel-controls-contract.test.mjs` to assert `GameConsole.tsx` contains the exact strings `不吃灰 · 播放器`, `Ready to play?`, `Favorites`, `Game Player`, `Drag your favorite game cartridge into the slot and let's play!`, `LET'S PLAY!`, `COLLECT GAMES`, `UNLOCK MEMORIES`, `PLAY FOREVER`, `随机推荐`, `随机推荐功能准备中`, and `把卡带拖进插槽`. Assert it no longer contains `把卡带拖进插槽 · 或点击播放`. Assert markup classes include `brand-lockup`, `left-decor`, `right-decor`, and `random-recommendation`.

- [ ] **Step 2: Verify RED**

  Run `node --test tests/pixel-controls-contract.test.mjs`.

  Expected: FAIL because the decorative markup, random control, and revised slot copy do not exist.

- [ ] **Step 3: Add minimal markup and click feedback**

  Add a `brand-lockup` before the navigation, left/right decoration as non-interactive `aside` elements, and a `random-recommendation` button inside `.console-stage`. Its click handler calls `setNotice("随机推荐功能准备中")`. Use `aria-hidden="true"` on CSS-shape-only spans, `aria-label="随机推荐"` on the button, and keep all supplied English copy in visible text. Change the slot hint to `<p className="slot-hint"><span>↑</span> 把卡带拖进插槽</p>`.

- [ ] **Step 4: Verify GREEN and commit**

  Run `node --test tests/pixel-controls-contract.test.mjs && npm run lint && npm test`; expect PASS. Commit:

  ```bash
  git add src/components/GameConsole.tsx tests/pixel-controls-contract.test.mjs
  git commit -m "feat: add console decorations and random control"
  ```

### Task 2: Position and style approved pixel composition

**Files:**

- Modify: `src/styles/pixel.css`
- Modify: `tests/pixel-controls-contract.test.mjs`

**Interfaces:**

- Consumes: the Task 1 class names plus existing `.card-rack`, `.console-control`, `.power-control`, and `.fullscreen-control` selectors.
- Produces: 20%-wider cards at the original physical gap, raised controls, right-side random control, and restrained side/identity decorations.

- [ ] **Step 1: Write failing layout contracts**

  Add a `console decor geometry contract` test asserting `.card-rack` has `left: 8%`, `right: 8%`, and `gap: 6.86%`; both `.power-control` and `.fullscreen-control` have `top: 56.5%`; `.random-recommendation` has a blue-purple background and `right: -13%`; `.brand-lockup`, `.left-decor`, and `.right-decor` have `position: absolute`; and `.slot-hint` includes `text-align: center`.

- [ ] **Step 2: Verify RED**

  Run `node --test tests/pixel-controls-contract.test.mjs`.

  Expected: FAIL because the rack remains 14%/8%, controls remain at 58.9%, and no new decoration selectors exist.

- [ ] **Step 3: Implement card/control geometry**

  Set `.card-rack` to `left: 8%`, `right: 8%`, `gap: 6.86%`; this creates a 20% wider card while retaining the original physical card gap. Set both control selectors to `top: 56.5%`. Keep their existing left/right positions and control colors. Change only `.cartridge-blue` to use a new warm yellow token `--yellow: #f5c956` as its `--shell` value; do not alter its card content, play strip, shadow, or behavior.

- [ ] **Step 4: Implement decoration and random-control styling**

  Build the handheld, smile, heart, star, underline, arrows, speech card, dashed card, lightning, and shuffle mark from CSS rectangles/pseudo-elements. Use `PoxiaoPixel`, black outlines where the supplied references show them, blue/pink/yellow accents, and low-opacity or small-size placement. Position `.brand-lockup` at the desktop top-left; `.left-decor` at left-middle; `.right-decor` at right-middle; and `.random-recommendation` at `right: -13%`, vertically centred to the purple cabinet. Use the existing blue control palette for random button fill. Hide these extra desktop adornments under the existing mobile media query.

- [ ] **Step 5: Verify GREEN, inspect, and commit**

  Run `node --test tests/pixel-controls-contract.test.mjs && npm run lint && npm test`; expect PASS. Capture a desktop screenshot and check that the main console remains visually dominant, cards fit the cabinet, decorations do not overlap the console, and the random button is visible on the cabinet’s right edge. Commit:

  ```bash
  git add src/styles/pixel.css tests/pixel-controls-contract.test.mjs
  git commit -m "feat: position pixel console decor"
  ```

## Plan self-review

- Task 1 covers every approved text string, the interactive-but-placeholder random action, the identity, and revised slot hint.
- Task 2 covers exact 20%-width geometry, unchanged visual gap, raised controls, random button placement, and all approved CSS decorations.
- Existing player and card interaction paths remain untouched.
