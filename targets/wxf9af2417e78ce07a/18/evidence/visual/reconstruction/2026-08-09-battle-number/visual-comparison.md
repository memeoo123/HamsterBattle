# Battle damage-number visual comparison

- Original: `evidence/visual/original/2026-08-01/battle-wave-1.png`.
- Reconstruction: `developed-battle-number-canvas.png`, captured from the same level-1004 4.010-second browser fixture at 750×1334.
- Source package: `resources2/ui/battleNum`; normal damage uses `HurtNum2` and bitmap font `Font_white2`.

The reconstruction now uses the original 240×256 bitmap atlas and exact glyph rectangles
instead of a system `Label`. `BattleNum.setValue` writes the value directly, so the old
reconstruction-added minus sign is removed. The source class applies scale 1.3 before
playing transition `t`; the decoded transition moves the text 46 pixels upward over
two-thirds of a second and fades it from 0.3 to 1.0 seconds, both with QuadOut easing.

The original reference displays damage 27 while the current fixture resolves 23. That is a
combat/account-state value difference, not a glyph or animation-style difference, and is
kept explicit rather than falsified in the visual fixture. Normal damage glyph art,
formatting, initial scale, movement and alpha timing are closed as a source-backed
sub-baseline. Hit presentation and battle gear glow/shadow/layer/animation remain pending,
so `check:visualBaseline` stays pending.
