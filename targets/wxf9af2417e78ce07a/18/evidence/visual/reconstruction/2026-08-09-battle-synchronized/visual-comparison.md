# Synchronized battle visual comparison

- Original: `evidence/visual/original/2026-08-01/battle-wave-1.png` (820×1542, including an 88 px WeChat host header).
- Reconstruction: `developed-battle-4.01s.png` (750×1334 game canvas).
- Matched state: level 1004, wave 1/15, 863/863 home HP, P01 + H1301 + H0301 + H0202, four scheduled enemies, no produced self unit.
- Matched time: 4.010 seconds. This is immediately after schedule entries at 1.001, 3.001, 3.501, and 4.001 seconds and before the fifth entry at 6.001 seconds.
- Matched geometry after host-header normalization: battlefield/backpack split ≈693 px, backpack HP bar ≈729 px, panel top ≈772 px. The gear-grid anchor remains unchanged; only the background, HP, and panel source-pivot offsets differ during an active battle.
- Determinism boundary: the original native monster Y placement reads `Math.random`; no recoverable seed exists. The isolated visual fixture therefore uses screenshot-constrained Y values while normal gameplay retains native random placement.

The HP presentation now uses the exact recovered `bagLike/xl_icon.png` red-heart frame and source-relative icon/text placement. This closes the synchronized battle-frame geometry/timing and HP sub-baselines. Remaining full visual-baseline work is presentation-level: combat damage/effect presentation and remaining battle art/animation comparison.
