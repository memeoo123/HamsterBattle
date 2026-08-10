# Developed preparation visual comparison — 2026-08-09

The original screenshot's 88-pixel WeChat host header was removed before
normalizing its 820-pixel game width to the 750-pixel reconstruction viewport.
At that scale, the top HUD, backpack panel, HP bar, board, developed gear group,
coin candidate and three bottom actions use the same global anchors.

This pass removes the reconstruction-only home button that covered the original
coin counter, hides worker progress bars outside active battle, restores the
source-facing `刷新 / 刷新 / 开战` action labels, shows the paid refresh coin cost,
adds the ad-refresh quality hint, and restores the visible `获取格子 ×3` reward
entry for the developed fixture. The coin portrait is reduced to the inset size
seen inside the original cog. The fresh 750×1334 Web Mobile capture has no project
console errors, and the preparation presentation contract passes 15 assertions.

The preparation layout is no longer a visual-baseline blocker at the global
geometry/control level. Minor multi-cell connector composition remains, along
with the synchronized battle elapsed-time/RNG comparison required before the
overall `visualBaseline` can pass.
