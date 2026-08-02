# BagLike gear level color evidence

Target: `wxf9af2417e78ce07a/18`

## Confirmed original behavior

- `work/gear-color-analysis/BrickShowBaseCom.ts.deobfuscated.js` calls
  `BagLikeGearColorUtils.getLevelColor(config.level)` for every brick whose worker bar is
  shown. Hero family/type is not part of this color decision.
- `work/gear-color-analysis/BrickBaseCom.ts.deobfuscated.js` and
  `BagLikeItemCell.ts.deobfuscated.js` call `getGearImg(config.level)`, so the occupied
  cells and candidate cells also select a level-specific `cl1..cl5` gear image.
- `work/gear-color-analysis/UIBagLikeConfig.ts.deobfuscated.js` defines the color and image
  arrays. Reconstructing its guarded string fragments gives:

| Level | Color | Gear image |
|---:|---|---|
| 1 | `#378A4A` green | `ui://bagLike/cl1` |
| 2 | `#3E6FD4` blue | `ui://bagLike/cl2` |
| 3 | `#8140CB` purple | `ui://bagLike/cl3` |
| 4 | `#CB9B40` gold | `ui://bagLike/cl4` |
| 5 | `#FF6363` red | `ui://bagLike/cl5` |

The original `preparation-initial.png` visually corroborates that different level-1 hero
families all use green gear bodies. `preparation-developed.png` shows a level-2 blue body
among level-1 green bodies.

## Reconstruction difference

`cocosProject/assets/scripts/CangshuGame.ts` currently stores a separate `tint` on every
`GEARS` row and `renderGear` paints each occupied cell from `config.tint`. Examples include
a red level-1 H01, blue level-1 H02/H03, green level-1 H04, purple level-1 H12, and orange
level-1 H13. Consequently color identifies the family accidentally and does not reliably
identify merge level.

## Required implementation correction

For hero/coin/other producing gears, derive both body color and, when imported, gear-body
sprite from `config.level`. Keep the power core and grid-unlock rewards on their separate
visual paths. Apply the same helper in candidate and backpack rendering so dragging and
merging cannot change the meaning of color.

## Implementation status

The Cocos implementation now exposes the recovered RGB array from
`BagLikeCandidateDrops.ts`. `CangshuGame.renderGear` derives every producing gear body from
`config.level`, so candidate, placed, returned, and merged gears share the same color
meaning. Power-core and grid-unlock visuals keep their independent configured tints.

The level-color behavior is implemented and deterministically tested. Importing the exact
`cl1..cl5` cog sprites remains part of the broader original-gear-artwork task.
