# H02 projectile recovery

This directory preserves the original version-18 `H29_S1` projectile shared by the
lower-level H02 primary attack, the H02 split-shot feature, and the recovered barrage
missile chain.

- `MissileConfig.M_SS_2001`: speed `700`, time limit `1000`, distance `2000`, model
  `H29_S1`, behavior `M_SS_2001_1`, with no shoot or hit sound configured.
- `ModelConfig.H29_S1`: `spriteFrame/skill/js_sheshou_zidan`, action `idle`, anchor
  `(0.5, 0.2)`, and scale `(-1, 1)`.
- Compressed UUID `bcm9T8h1BHR4MO81jJPDZI` decodes to
  `bc9bd4fc-8750-4747-830e-f358c93c3648`; resources3 native version is `b8a9d`.
- The native PNG is 74×50. Its packed frame is `(1, 1, 72, 48)` with original size
  72×48.
- SHA-256: `c6d99066f49548c87b38bc664753c994e45bcb36845ac95b3303343675541371`.

The Cocos restoration imports an unmodified copy at
`assets/resources/original/js_sheshou_zidan.png`. H0204's primary skill `2002` remains
bound to the distinct `H29_S2` basketball; feature-driven split and barrage shots keep
the fixed `H29_S1` model.
