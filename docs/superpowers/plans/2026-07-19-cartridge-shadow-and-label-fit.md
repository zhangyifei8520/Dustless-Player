# Cartridge Shadow and Label Fit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct cartridge shadow layering without moving its geometry, and keep the shortened information panel clear of the play strip.

**Architecture:** Preserve the card element’s existing shadow coordinates and move only its stacking order relative to a new coloured surface layer. Constrain the existing cream label with CSS, reduce summaries in local data to one sentence, and verify the exact source-level geometry before visual QA.

**Tech Stack:** React, TypeScript, CSS, Node test runner, Vinext.

## Global Constraints

- Do not change the black shadow’s `top`, `right`, `left`, `width`, or `height` declarations.
- Make only the shadow’s render layer sit behind the coloured card surface.
- The cream panel must end above the play button with a fixed gap; the button may not overlap it.
- Each grey summary is a concise single sentence and has one displayed line.
- Do not change console, playback, drag/drop, fullscreen, card-group placement, or navigation behavior.

---

### Task 1: Correct card layering and content-panel fit

**Files:**

- Modify: `src/styles/pixel.css`
- Modify: `src/data/cartridges.ts`
- Modify: `tests/pixel-controls-contract.test.mjs`

**Interfaces:**

- Consumes: `.cartridge`, `.cartridge::after`, `.cartridge-label`, `.cartridge-label p`, `.cartridge-play`, and the three `Cartridge` summary strings.
- Produces: a black shadow behind the coloured surface at unchanged coordinates, plus a non-overlapping short label and one-line summaries.

- [ ] **Step 1: Write the failing visual contract**

  Add a `cartridge shadow and label fit contract` test that asserts `.cartridge` creates an isolated stack, `.cartridge::after` retains `top: 8px`, `right: -8px`, `width: 100%`, and `height: 100%`, while using a lower z-index than the coloured card surface. Assert `.cartridge-label` has `flex: 0 0 55%` and `box-sizing: border-box`; assert `.cartridge-label p` has `-webkit-line-clamp: 1`; assert every summary in `cartridges.ts` contains no `。` before its final character.

- [ ] **Step 2: Verify RED**

  Run `node --test tests/pixel-controls-contract.test.mjs`.

  Expected: FAIL because the coloured surface is the parent background rather than its own layer, the label grows with `flex: 1`, summaries clamp to three lines, and data summaries contain multiple sentences.

- [ ] **Step 3: Implement the layer-only shadow correction**

  Remove `background: var(--shell)` from `.cartridge`. Add `.cartridge::before` with `position: absolute`, `inset: 0`, `z-index: -1`, `border-radius: inherit`, `background: var(--shell)`, and `content: ""`. Keep `.cartridge::after` values for `top`, `right`, `width`, and `height` unchanged, set it to `z-index: -2`, and retain `background: #000`. Set `.cartridge` to `isolation: isolate` so both layers stay behind content but above the cabinet.

- [ ] **Step 4: Shorten the label and summaries**

  Set `.cartridge-label` to `box-sizing: border-box; flex: 0 0 55%;` and keep its existing cream fill/border/padding. Set `.cartridge-label p` to `-webkit-line-clamp: 1`. Replace each summary with one concise sentence:

  ```ts
  "把值得回看的生活灵感重新装进卡带。"
  "用一次专注放映看完这份学习收藏。"
  "把曾经打动你的内容变成下一次行动。"
  ```

- [ ] **Step 5: Verify GREEN, inspect, and commit**

  Run `node --test tests/pixel-controls-contract.test.mjs && npm run lint && npm test`; expect PASS. Capture a desktop screenshot and verify the cream panel ends above the button and the black layer’s geometry has not changed. Commit:

  ```bash
  git add src/styles/pixel.css src/data/cartridges.ts tests/pixel-controls-contract.test.mjs
  git commit -m "fix: layer cartridge shadow behind card"
  ```

## Plan self-review

- The only shadow geometry in the plan is its existing geometry, repeated as an invariant; the change is exclusively z-order.
- The label’s fixed size, single-line summary, and explicit sentence text satisfy the confirmed information-panel requirement.
- No unrelated behaviors or assets are modified.
