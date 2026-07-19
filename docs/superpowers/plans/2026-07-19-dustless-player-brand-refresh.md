# Dustless Player Brand Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the console's desktop branding, side typography, random control, and idle-screen boot title while preserving all existing interaction logic.

**Architecture:** Keep all markup changes in `GameConsole.tsx` and all visual changes in `pixel.css`. Add the supplied Minimalism font as a local public asset and extend the existing contract test to lock the approved copy and geometry.

**Tech Stack:** React, TypeScript, CSS, Node test runner, Vinext

## Global Constraints

- Do not change playback, drag-and-drop, fullscreen, card data, or navigation behavior.
- Use the supplied `ChillPixels-Minimalism.otf` only for the new boot title.
- Preserve the current desktop console composition and pixel-art assets.

---

### Task 1: Lock the new visual contract

**Files:**
- Modify: `tests/pixel-controls-contract.test.mjs`

- [ ] Add assertions for the removed brand lockup, new left title copy, shortened random label, Minimalism font, rainbow title spans, and revised control geometry.
- [ ] Run `node --test tests/pixel-controls-contract.test.mjs` and verify the new assertions fail against the current UI.

### Task 2: Implement the branding and typography refresh

**Files:**
- Modify: `src/components/GameConsole.tsx`
- Modify: `src/styles/pixel.css`
- Create: `public/fonts/ChillPixels-Minimalism.otf`

- [ ] Remove the old top-left lockup and update the left decorative copy.
- [ ] Render `DUSTLESS PLAYER` as individually styled character spans in the idle screen.
- [ ] Change `随机推荐` to `随机` while preserving its click feedback.
- [ ] Add the Minimalism font face, rainbow boot-title styles, scaled side typography, helper-copy treatment, and revised random-button geometry.
- [ ] Run the contract test and verify it passes.

### Task 3: Verify and publish

**Files:**
- No additional source files.

- [ ] Run `npm test` and verify all unit, build, and rendered HTML checks pass.
- [ ] Inspect the desktop page visually and confirm the random control does not overlap the cards or leave the cabinet.
- [ ] Commit the validated source and publish the existing private site.
