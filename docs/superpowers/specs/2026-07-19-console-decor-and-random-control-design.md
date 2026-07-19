# Console Decor and Random Control Design

## Goal

Expand the desktop game page with restrained pixel decorations, a clickable random-recommendation control, wider card controls, and refined console instruction copy while preserving the console as the focal point.

## Layout and controls

- Increase each cartridge and its play strip width by 20% while retaining the current card-rack gap. The three cards remain centred in the purple cabinet.
- Move Power and fullscreen controls upward by the same amount so they remain horizontally aligned.
- Add a blue-purple random-recommendation button at the vertical centre on the right edge of the purple cabinet. It includes a pixel loop/shuffle mark and `随机推荐` in `PoxiaoPixel`. It is interactive but only shows `随机推荐功能准备中` for now.
- Change the centred slot hint to `↑ 把卡带拖进插槽`.

## Decorative copy

- Top-left identity: a CSS pixel handheld icon plus `不吃灰 · 播放器` in the supplied pixel font.
- Left-middle decoration: a yellow pixel smile, `Ready to play?`, a two-line `Favorites / Game Player` headline, a yellow pixel underline, the exact sentence `Drag your favorite game cartridge into the slot and let's play!`, and blue pixel arrows.
- Right-middle decoration: `LET'S PLAY!` speech-card, yellow smile, pink pixel star, pink heart, a blue dashed information card containing `COLLECT GAMES`, `UNLOCK MEMORIES`, and `PLAY FOREVER`, plus a blue pixel lightning mark.
- Both decorative groups are intentionally small and remain background accents; they do not overlap the console stage at desktop size.

## Scope and verification

- Build illustrations from CSS pixel rectangles and text; do not add new external image assets.
- Preserve player state machine, card data/interaction, fullscreen behavior, navigation behavior, and mobile behavior.
- Add source-level contracts for the new control, copy, alignment, and card-width geometry; run the full suite and inspect a desktop screenshot.
