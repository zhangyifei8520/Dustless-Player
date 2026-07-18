# Cartridge Shadow and Label Fit Design

## Goal

Correct the cartridge layering and information-panel fit to match the confirmed visual rule.

## Card shadow

- The black rounded shadow remains behind the coloured cartridge in stacking order.
- Its left and right edges exactly match the coloured cartridge; it has no horizontal offset.
- It is translated downward by 8px, so black appears only as a narrow base below the coloured card and never as a right-side slab.

## Information panel and play strip

- The cream information panel has a fixed shortened height rather than growing to fill the card.
- Its lower edge ends above the play strip with a fixed visual gap.
- The play strip remains an independent absolute control and must not overlap the cream panel.
- The grey summary copy on every card is rewritten as one concise sentence; the card renderer clamps it to one displayed line.

## Scope and verification

- Preserve card colour, outer dimensions, cabinet placement, drag/play behavior, navigation, and screen behavior.
- Add source-level visual contracts proving the shadow has no horizontal offset, the panel has non-growing fixed sizing, and the summary has a one-line limit.
- Verify with the existing test suite and a desktop screenshot.
