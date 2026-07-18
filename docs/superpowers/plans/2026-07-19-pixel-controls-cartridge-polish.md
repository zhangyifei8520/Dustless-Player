# Pixel Controls and Cartridge Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved pixel-font, controller, card sizing, and full-screen video visual calibration without changing playback behavior.

**Architecture:** Keep the existing React state machine and console raster unchanged. Introduce the supplied local font as a static asset, move the slot instruction into the console stage, and enforce visual geometry through CSS plus source-level visual-contract tests.

**Tech Stack:** React, TypeScript, CSS, Node test runner, local TrueType font asset.

## Global Constraints

- Do not add a mute button or change Bilibili URL parameters.
- Do not change the drag/load/player state machine, real-link fallback, or single-player fullscreen behavior.
- Preserve the 16:9 console screen and one-page desktop layout.
- Navigation text must use white `PoxiaoPixel` with black pixel outline; `POWER`, `全屏`, and `播放` use black `PoxiaoPixel` without outline.
- Do not add a dashed outline around Power, fullscreen, card, or play controls.

---

### Task 1: Install pixel font and calibrate navigation/control semantics

**Files:**
- Create: `public/fonts/PoxiaoPixel.ttf`
- Create: `tests/pixel-controls-contract.test.mjs`
- Modify: `src/components/GameConsole.tsx`
- Modify: `src/styles/pixel.css`

**Interfaces:**
- Consumes: `/Users/zhangyifei/Downloads/破晓像素_猫啃网/破晓像素/FZG_CN.ttf`.
- Produces: local `PoxiaoPixel` font-face, in-stage `slot-hint`, and shared aligned console-control geometry.

- [ ] **Step 1: Write failing visual-contract tests**

Create `tests/pixel-controls-contract.test.mjs` to assert that the stylesheet contains a local `@font-face` named `PoxiaoPixel`, `site-header nav button` uses that family and a black text shadow, `console-control` hover/focus contains no `dashed`, and both Power and fullscreen selectors use the same `top` declaration. Assert the server source contains `className="slot-hint"` and no longer contains the standalone `drag-hint` paragraph.

- [ ] **Step 2: Verify RED**

Run `node --test tests/pixel-controls-contract.test.mjs`.

Expected: FAIL because the font face and `slot-hint` do not yet exist and the current control focus style is dashed.

- [ ] **Step 3: Copy font and move the instruction**

Copy the supplied TrueType file to `public/fonts/PoxiaoPixel.ttf`. In `GameConsole.tsx`, add `<p className="slot-hint"><span>↑</span> 把卡带拖进插槽 · 或点击播放</p>` immediately after the slot drop zone and remove the outer `drag-hint` paragraph.

- [ ] **Step 4: Implement navigation and control calibration**

Add `@font-face { font-family: "PoxiaoPixel"; src: url("/fonts/PoxiaoPixel.ttf") format("truetype"); }`. Set navigation text to `PoxiaoPixel`, `12px`, white with existing black pixel shadow; set icon geometry to `15px` and nav gap to `16px`. Set both console controls to `width: 5.8%`, `top: 58.9%`; set Power and fullscreen internal marks to `18px` and `22px` respectively. Replace dashed focus with an inset/internal highlight. Set all `console-control small` and `cartridge-play` text to `PoxiaoPixel`, black, with `text-shadow: none`. Position `.slot-hint` absolutely at `top: 63.4%`, centered under the slot.

- [ ] **Step 5: Verify GREEN and commit**

Run `node --test tests/pixel-controls-contract.test.mjs && npm run lint && npm test`. Commit with `feat: calibrate pixel controls and font`.

### Task 2: Scale card groups and fit full-screen video to the viewport

**Files:**
- Modify: `src/styles/pixel.css`
- Modify: `tests/pixel-controls-contract.test.mjs`

**Interfaces:**
- Consumes: existing `.card-rack`, `.cartridge`, `.cartridge-play`, and `.fullscreen-frame` CSS.
- Produces: centered 80%-scale card group and a height-constrained 16:9 fullscreen frame.

- [ ] **Step 1: Write failing visual-contract tests**

Extend `tests/pixel-controls-contract.test.mjs` to assert `.card-rack` has centered `left: 14%`, `right: 14%`, and `height: 21%`; `.cartridge-play` has `height: clamp(36px, 5.5vw, 52px)` and `left: 3%`/`right: 3%`; and `.fullscreen-frame` contains both `92vw` and `100dvh` constraints.

- [ ] **Step 2: Verify RED**

Run `node --test tests/pixel-controls-contract.test.mjs`.

Expected: FAIL because the rack remains at 5.2% side offsets, play control remains 31px tall, and fullscreen width only uses viewport width.

- [ ] **Step 3: Implement card-group calibration**

Set `.card-rack` to `left: 14%`, `right: 14%`, `height: 21%`, `bottom: 5%`, with three centered columns. Preserve the reference card language with 3px black outlines, cream labels, hard shadows, and top notches. Set `.cartridge-play` to `left: 3%`, `right: 3%`, `bottom: -24px`, and `height: clamp(36px, 5.5vw, 52px)` so it remains visually dominant but inside the cabinet.

- [ ] **Step 4: Implement full-screen fit**

Set `.fullscreen-overlay` to hide overflow. Set `.fullscreen-frame` width to `min(1280px, 92vw, calc((100dvh - 116px) * 16 / 9))`, `max-height: calc(100dvh - 116px)`, and preserve `aspect-ratio: 16 / 9`; retain the existing border and shadow.

- [ ] **Step 5: Verify GREEN and commit**

Run `node --test tests/pixel-controls-contract.test.mjs && npm run lint && npm test`. Commit with `feat: scale cartridges and fit fullscreen video`.

## Plan self-review

- Spec coverage: Task 1 covers font, navigation, aligned controls, removed dashed focus, and slot hint. Task 2 covers 20% card-group scaling, enlarged relative play bar, centered cabinet placement, and full-screen viewport fit.
- No placeholder scan: the two tasks name all files, selectors, values, and commands.
- Type consistency: no runtime interfaces change; both tasks operate on existing CSS selectors and JSX markup.
