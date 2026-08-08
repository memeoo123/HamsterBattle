# H03/H08 projectile recovery

This directory preserves the original version-18 Spine projectile shared by H03 primary
skill `3001` and H08 primary skill `7001`.

- `MissileConfig.M_FS_3001`: speed `300`, time limit `2000`, distance `1000`, model
  `H13_S1`, behavior `M_FS_3001_1`.
- `MissileConfig.M_ATM_7001`: speed `500`, time limit `2000`, distance `2000`, the same
  model `H13_S1`, behavior `7001_11`, delay `300`.
- `ModelConfig.H13_S1`: `spine/skill/touzhi/zidan`, animation `idle`, no scale override.
- The recovered skeleton is Spine `3.8.99` and exposes the `idle` animation.
- Atlas UUID `11XHUfl/dNXKYNbMfgQAee` →
  `115c751f-97f7-4d5c-a60d-6cc7e040079e`, native version `d12d7`.
- Texture UUID `a9Gh2NpJJOnJQooITXL7zf` →
  `a91a1d8d-a492-4e9c-9428-a084d72fbcdf`, native version `ba5e0`.
- Skeleton UUID `d5TTfUcHZKoZHA9IwLNFLO` →
  `d54d37d4-7076-4aa1-91c0-f48c0b3452ce`, native version `0dbbb`.

The Cocos restoration imports an unmodified triplet at
`assets/resources/spine/H03Projectile/zidan.*`. H03 and H08 retain their distinct
configured missile speeds and attack behavior delays while sharing the recovered visual.
