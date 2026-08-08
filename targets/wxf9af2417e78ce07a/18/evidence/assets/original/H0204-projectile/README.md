# H0204 projectile recovery

This directory preserves the original version-18 projectile image used by H0204's
primary skill `2002`.

- `MissileConfig.M_SS_2002`: speed `700`, time limit `1000`, distance `2000`, model
  `H29_S2`, behavior `M_SS_2001_1`, with no shoot or hit sound configured.
- `ModelConfig.H29_S2`: `spriteFrame/skill/js_sheshou_lanqiu`, action `idle`, anchor
  `(0.5, 0.2)`, and no scale override.
- resources3 bundle path indices `565`/`566` resolve the texture and SpriteFrame.
- Compressed base UUID `30mnhShiZO0JVLueGJJzLZ` decodes with Creator 3.8.8's
  `decodeUuid` implementation to `309a7852-8626-4ed0-954b-b9e1892732d9`.
- The resources3 native version is `b9661`; the preserved source URL is
  `https://kxmnrs-res.chuxinhd.com/cangshu/wx_xylxs/res/remote/resources3/native/30/309a7852-8626-4ed0-954b-b9e1892732d9.b9661.png`.
- The native PNG is 43×43 pixels. Its single packed SpriteFrame is the rect
  `(1, 1, 41, 41)` with original size 43×43.
- SHA-256: `7bacf2cbf4fef931996b604691015369d0677469ce3b82637bf48a358631d942`.

The Cocos restoration imports an unmodified copy at
`assets/resources/original/js_sheshou_lanqiu.png` and selects it only when the spawned
unit's recovered `productionSkillId` is `2002`.
