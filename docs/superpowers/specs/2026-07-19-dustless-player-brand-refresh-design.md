# Dustless Player Brand Refresh Design

## Goal

Refine the desktop visual hierarchy around the existing console without changing playback, drag-and-drop, fullscreen, card data, or navigation behavior.

## Approved Changes

- Remove the top-left handheld icon and `不吃灰 · 播放器` lockup.
- Replace the left decorative title with two lines: `不吃灰播放器` and `DUSTLESS PLAYER`.
- Double the supporting type on both background sides. Scale the left title and right `LET'S PLAY!` treatment to 1.5 times their current size.
- Keep the existing decorative smile, underline, arrows, heart, star, dashed card, and lightning.
- Change the blue cabinet control copy from `随机推荐` to `随机`, narrow it, keep its right edge inside the cabinet, and move it upward so it does not touch the cards.
- Remove the white panel behind the idle-screen helper copy. Move the helper copy downward and reduce it by 20%.
- Add a two-line `DUSTLESS PLAYER` boot title above the helper copy. Use `ChillPixels-Minimalism.otf`, stagger letters vertically, and assign a repeating rainbow color sequence per letter.

## Assets

- Copy `/Users/zhangyifei/Downloads/chill_pixels/ChillPixels-Minimalism.otf` to `public/fonts/ChillPixels-Minimalism.otf`.

## Validation

- Desktop screenshot shows no top-left lockup.
- Cabinet random control remains fully inside the purple cabinet and does not overlap any cartridge.
- Idle display shows the rainbow boot title with no white helper background.
- Existing unit, contract, rendered HTML, and production build checks pass.
