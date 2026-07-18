# Cartridge Shelf Refinement Design

## Goal

Refine the three playable cartridges so they visually match the supplied Library reference while remaining contained by the purple cabinet in the game-console page.

## Visual direction

- Each cartridge is a flat green, blue, or pink rounded rectangle with a dark outline.
- A separate, pure-black rounded rectangle sits behind it, offset down and right as the sole shadow. The existing coloured side slab and gradient-like depth treatment are removed.
- The top row retains the cartridge notch and code.
- The cream content panel uses the supplied HTML hierarchy: coloured source abbreviation, title, and a two-to-three-line summary.
- Status and date are removed from the cards entirely.
- The play strip is narrower than the cartridge body, placed close to its bottom edge, and may only slightly extend below the cabinet.

## Layout

- Raise the three-card group modestly inside the purple cabinet.
- Increase the horizontal spacing between cards slightly while retaining a centred, three-column composition.
- Resize the play strip so the group’s lowest edge only marginally overlaps the cabinet’s lower boundary.

## Navigation

- Keep the existing navigation labels and small icons.
- Render all navigation text and icons as pure black with no stroke, text shadow, or drop shadow.

## Scope and verification

- No change to playback, drag/drop, fullscreen, card data, or console assets.
- Add CSS contract checks for the shadow treatment, card content hierarchy, cabinet fit, spacing, and navigation styling.
- Verify with the production build and a desktop browser screenshot at the target page.
