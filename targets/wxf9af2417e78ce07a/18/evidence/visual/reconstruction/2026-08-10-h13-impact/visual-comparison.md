# H13 impact and damage-frame visual comparison

- Original: `evidence/visual/original/2026-08-01/battle-wave-1.png`.
- Reconstruction: `developed-h13-impact-canvas.png`, captured from the level-1004 4.010-second fixture at 750×1334.
- Source route: `TZ_1301 → M_TZ_1301_1 → B_TZ_1301_2 → H13_S1_LOWER`.

The original behavior table applies `hurt` and binds low-layer model
`H13_S1_LOWER` in the same impact behavior. `ModelConfig` resolves that model to
the Spine 3.8.99 resource `spine/skill/touzhi/baomihua_hill` and non-looping action
`pskill01`. The recovered runtime's `SkillBehavior.showSkillEffect` routes `low`
models to `BgLayer`, below role units.

The reconstruction now follows that route for every H13 initial and bounce impact:
the recovered popcorn projectile reaches its endpoint, the original impact Spine is
created below the enemy unit, and damage plus the `Font_white2` floating number are
resolved in the same update. The 4.010-second capture shows the orange/yellow popcorn
fragments beneath the right-side enemies while the 23-point numbers are still in their
source transition.

The original reference's 27 versus the fixture's 23 remains an explicit account-growth
difference. H13 base projectile/impact linkage, layer, action and damage-frame binding are
closed as a visual sub-baseline. Battle gear glow, shadow, sorting and animation remain
pending, so `check:visualBaseline` stays pending.
