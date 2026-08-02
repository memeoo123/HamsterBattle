# BagLike level-5 shape overlay evidence

Target: `wxf9af2417e78ce07a/18`

## Runtime rule

`work/gear-color-analysis/BrickShowBaseCom.ts.deobfuscated.js` implements
`updateGearAni`. The recovered primitive table resolves its threshold variable `e` to
`5`: when `config.level >= 5`, it reads the current `BagLikeShapeConfig`; if that row has
a `modelId`, it shows `modelNode2`, copies `panelRotate`, and loads that model. Otherwise
the overlay is hidden.

The decoded `baglike.BagLikeShapeConfig` gives the complete mapping:

| Shapes | Shape IDs | Model | Rotation |
|---|---|---|---|
| horizontal / vertical 2-cell | 2, 3 | `UI10020` | `0 / 90` |
| four L orientations | 6, 7, 8, 9 | `UI10021` | `-90 / 0 / 180 / 90` |
| 2x2 | 10 | `UI10022` | `0` |

One-cell and three-cell straight shapes have no `modelId`, so the original does not show
this animation for them. `model.ModelConfig` maps the three IDs to
`chilun_hongse_2/3/4`; the recovered Spine 3.8.99 files each contain an `idle` animation.

## Implementation boundary

`CangshuGame.renderGear` now creates the corresponding original Spine overlay, with the
same shape rotation, only when the rendered gear level is at least 5. Creator imports and
the release Web bundle path checks pass.

The current representative 1004 flow only implements same-family merges through level 4,
so this code path is not yet reachable in the normal smoke run. End-to-end visual closure
therefore depends on restoring the level-5 cross-family recipes and capturing one of the
six level-5 result items (`H0705`, `H0805`, `H0905`, `H1005`, `H1505`, `H1805`).
