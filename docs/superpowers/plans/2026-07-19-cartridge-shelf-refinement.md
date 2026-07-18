# Cartridge Shelf Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle and reposition the three game cartridges to match the supplied Library card reference without changing console playback behavior.

**Architecture:** Keep the existing console assets and player state machine unchanged. Simplify `CartridgeCard` to the reference information hierarchy and use CSS for the flat shell, separate black shadow, rack geometry, play-strip fit, and flat-black navigation treatment.

**Tech Stack:** React, TypeScript, CSS, Node test runner, Vinext.

## Global Constraints

- Preserve drag/drop, loading, inline player, and fullscreen behavior.
- Do not change console assets, screen geometry, or control placement.
- Content shows only source abbreviation/category, title, and a two-to-three-line summary; do not show status or date.
- Use flat green, blue, and pink rounded shells with a separate pure-black rounded backing shadow.
- Keep cards centred, slightly raised in the purple cabinet, with a play strip that only slightly exceeds the cabinet bottom.
- Navigation labels and icons must be pure black with no text shadow or filter outline.

---

### Task 1: Simplify cartridge information

**Files:**

- Modify: `src/components/CartridgeCard.tsx`
- Modify: `src/data/cartridges.ts`
- Modify: `src/styles/pixel.css`
- Modify: `tests/pixel-controls-contract.test.mjs`

**Interfaces:**

- Consumes: `CartridgeCardProps`, `Cartridge`, and existing cartridge class names.
- Produces: cards with a top notch/code plus cream content panel, but no footer metadata or unused `status`/`date` fields.

- [ ] **Step 1: Write the failing component contract**

  Add a `cartridge card content contract` test to `tests/pixel-controls-contract.test.mjs`. Read `CartridgeCard.tsx` and `cartridges.ts`; assert the source reads `cartridge-source`, `cartridge-label h3`, and `cartridge-label p`, and does not contain `cartridge-foot`, `status-`, `cartridge.status`, `cartridge.date`, `status:`, or `date:`.

- [ ] **Step 2: Verify RED**

  Run `node --test tests/pixel-controls-contract.test.mjs`.

  Expected: FAIL because the card still renders `.cartridge-foot` and the data still declares `status` and `date`.

- [ ] **Step 3: Remove metadata from data and markup**

  Remove `status: "sealed" | "ready" | "playing";` and `date: string;` from `Cartridge`, and remove every corresponding record property. Delete this JSX footer from `CartridgeCard.tsx`:

  ```tsx
  <footer className="cartridge-foot">
    <span className={`status status-${active ? "playing" : cartridge.status}`}>
      {active ? "PLAYING" : cartridge.status.toUpperCase()}
    </span>
    <time>{cartridge.date}</time>
  </footer>
  ```

  Preserve source abbreviation/category, title, summary, code, notch, and play button.

- [ ] **Step 4: Remove orphaned CSS**

  Delete `.cartridge-foot`, `.status`, `.status-playing`, and `.status-ready` rules. Keep `.cartridge-label p` with `-webkit-line-clamp: 3`.

- [ ] **Step 5: Verify GREEN and commit**

  Run `node --test tests/pixel-controls-contract.test.mjs && npm run lint && npm test`; expect PASS. Then commit:

  ```bash
  git add src/components/CartridgeCard.tsx src/data/cartridges.ts src/styles/pixel.css tests/pixel-controls-contract.test.mjs
  git commit -m "feat: simplify cartridge card content"
  ```

### Task 2: Apply flat card shells, cabinet fit, and black navigation

**Files:**

- Modify: `src/styles/pixel.css`
- Modify: `tests/pixel-controls-contract.test.mjs`

**Interfaces:**

- Consumes: `.card-rack`, `.cartridge`, `.cartridge::after`, `.cartridge-play`, `.site-header nav button`, and `.nav-icon`.
- Produces: a raised three-column card group with flat shells/black backing shadows, compact play strips, and black unoutlined navigation.

- [ ] **Step 1: Write failing visual contracts**

  Extend `tests/pixel-controls-contract.test.mjs` with a `flat cartridge rack and navigation contract` test asserting:

  ```js
  assert.match(selectorRule(css, ".card-rack"), /bottom:\s*7%;/);
  assert.match(selectorRule(css, ".card-rack"), /gap:\s*8%;/);
  assert.match(selectorRule(css, ".cartridge::after"), /background:\s*#000;/);
  assert.match(selectorRule(css, ".cartridge::after"), /width:\s*100%;/);
  assert.match(selectorRule(css, ".cartridge::after"), /height:\s*100%;/);
  assert.match(selectorRule(css, ".cartridge-play"), /left:\s*8%;/);
  assert.match(selectorRule(css, ".cartridge-play"), /right:\s*8%;/);
  assert.match(selectorRule(css, ".cartridge-play"), /bottom:\s*-9px;/);
  assert.match(selectorRule(css, ".cartridge-play"), /height:\s*clamp\(30px,\s*3\.8vw,\s*38px\);/);
  assert.match(selectorRule(css, ".site-header nav button"), /color:\s*#000;/);
  assert.match(selectorRule(css, ".site-header nav button"), /text-shadow:\s*none;/);
  assert.match(selectorRule(css, ".nav-icon"), /color:\s*#000;/);
  assert.match(selectorRule(css, ".nav-icon"), /filter:\s*none;/);
  ```

- [ ] **Step 2: Verify RED**

  Run `node --test tests/pixel-controls-contract.test.mjs`.

  Expected: FAIL because the rack is at `bottom: 5%`/`gap: 6%`, the side slab uses `var(--shade)`, the play strip is wider/taller/lower, and navigation is white with outline effects.

- [ ] **Step 3: Implement the flat shell and rack**

  Set `.card-rack` to `bottom: 7%` and `gap: 8%`, retaining the centred `left: 14%`, `right: 14%`, `height: 21%`, and three equal columns. Remove `.cartridge`’s `box-shadow`, retain `background: var(--shell)`, and set `z-index: 0`. Replace `.cartridge::after` with:

  ```css
  .cartridge::after {
    position: absolute;
    z-index: -1;
    top: 8px;
    right: -8px;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: #000;
    content: "";
  }
  ```

  Remove `--shade` from colour selectors. Update hover/dragging to use only transform/filter, keeping the backing rectangle as the single visible shadow. Set `.cartridge-source span` to `color: var(--shell)`.

- [ ] **Step 4: Fit play strip and flatten navigation**

  Set `.cartridge-play` to `left: 8%`, `right: 8%`, `bottom: -9px`, and `height: clamp(30px, 3.8vw, 38px)`. Retain its white fill, black border, and pixel triangle. Set `.site-header nav button` and `.nav-icon` to `color: #000`; set their `text-shadow` and `filter` to `none`. Do not change fonts, icon geometry, or click behavior.

- [ ] **Step 5: Verify GREEN, inspect, and commit**

  Run `node --test tests/pixel-controls-contract.test.mjs && npm run lint && npm test`; expect PASS. Start the local app and capture a desktop screenshot. Confirm cards are centred, separated, raised, and only slightly extend below the purple cabinet; confirm navigation has no outline. Then commit:

  ```bash
  git add src/styles/pixel.css tests/pixel-controls-contract.test.mjs
  git commit -m "feat: refine cartridge shelf layout"
  ```

## Plan self-review

- Task 1 covers removal of status/date and preserves the confirmed information hierarchy.
- Task 2 covers flat colour shells, independent black shadows, raised and spaced rack geometry, compact play strips, and black unoutlined navigation.
- No placeholders remain; selectors, values, test commands, and expected outcomes are explicit.
