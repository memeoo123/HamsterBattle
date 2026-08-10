# Trait RichText visual comparison — 2026-08-09

The deterministic level-1004 trait fixture now uses the exact three source-table
descriptions, including their green emphasis spans. The descriptions are rendered
with Cocos `RichText`, the recovered project TTF, explicit source-matched line
groups, and the same cream text/dark outline treatment used by the surrounding UI.

After removing the original screenshot's 88-pixel WeChat host header and
normalizing its 820-pixel width to the 750-pixel reconstruction viewport, the
card shells and description blocks align. The reconstructed description top is
approximately three pixels from the normalized reference position, and all text
remains inside the recovered purple description panels. The fresh Web Mobile
capture has no project console errors; the presentation contract passes 21
assertions.

This closes the trait overlay's known inline-color and line-break calibration
item. `visualBaseline` remains pending because the preparation/backpack geometry
and a synchronized battle elapsed-time/RNG frame still need paired validation.
