# Real Player Fallback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace simulated playback with official Bilibili embeds and a safe original-link fallback for unsupported platforms.

**Architecture:** Add one pure playback-target resolver and keep UI state unchanged. The existing player component consumes the resolver and renders either a full-size iframe or an external-link panel in both the console screen and overlay fullscreen.

**Tech Stack:** React, TypeScript, CSS, Node test runner.

## Global Constraints

- Do not add a “回看” button.
- Do not restore `PIXEL REPLAY`.
- Do not change the calibrated desktop geometry or mobile rules.
- Never scrape video files or bypass platform iframe restrictions.

---

### Task 1: Playback target resolver and player UI

**Files:**
- Create: `src/lib/playbackTarget.ts`
- Modify: `src/components/SimulatedPlayer.tsx`
- Modify: `src/styles/pixel.css`
- Test: `tests/playback-target.test.ts`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `Cartridge`.
- Produces: `getPlaybackTarget(cartridge): { kind: "embed"; src: string } | { kind: "external"; url: string }`.

- [ ] **Step 1: Write failing resolver tests**

Assert that both Bilibili URLs produce `player.bilibili.com/player.html` URLs with their exact BV IDs, and the Xiaohongshu card produces an external target with its original URL.

- [ ] **Step 2: Verify RED**

Run `node --import tsx --test tests/playback-target.test.ts`; expect failure because `playbackTarget.ts` does not exist.

- [ ] **Step 3: Implement the resolver**

Extract `BV[0-9A-Za-z]+` only for Bilibili cards and build `https://player.bilibili.com/player.html?bvid=<id>&autoplay=1&danmaku=0&refer=1`. Return the original URL for every unsupported source or malformed Bilibili URL.

- [ ] **Step 4: Replace the simulated UI**

Render a titled iframe for embed targets with `allowFullScreen`. Render a concise platform-limit message and a normal anchor using `target="_blank"` and `rel="noopener noreferrer"` for external targets. Reuse the same component in the existing fullscreen overlay.

- [ ] **Step 5: Style both paths**

Make the iframe and fallback fill `.sim-player` without changing `.screen-layer`, console controls, card geometry, or mobile media rules.

- [ ] **Step 6: Verify GREEN**

Run `npm run lint && npm test`; expect all tests and the production build to pass.

- [ ] **Step 7: Browser verification**

At 1440×900, play each card, verify two Bilibili iframes and one external fallback, open/close fullscreen with Escape, and confirm `PIXEL REPLAY` is absent.
