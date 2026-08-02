# BagLike merge and footprint evidence

Target: `wxf9af2417e78ce07a/18`

## Confirmed findings

- `BagLikeMergeDatas` builds a bidirectional partner map from `material1` and
  `material2`, and maps either material to the result item id. Evidence:
  `work/merge-shape-analysis/BagLikeMergeDatas.ts.deobfuscated.js:3`, byte
  offsets 838 (`getPartnerId`) and 933 (`getMergeId`).
- A drop over an existing partner merges in both locations used by the game:
  `ChooseCom.tryMerge` handles the candidate container, while
  `BagLilkeManager.tryMerge` handles occupied backpack cells. The dragged item
  is consumed and the target item's config is replaced with the merge result.
  Evidence: `work/merge-shape-analysis/ChooseCom.ts.deobfuscated.js:3`, byte
  offsets 3886-6170; `work/merge-shape-analysis/BagLilkeManager.ts.deobfuscated.js:3`,
  byte offsets 24816-26200.
- The reachable level-1001 families use same-item recipes through level 4:
  `H0101 + H0101 -> H0102 -> H0103 -> H0104`, with the same pattern for H02,
  H04, H12, and C01-C04. Evidence: decoded
  `baglike.BagLikeItemConfig.json:120`, `:147`, `:174`, `:201`, and
  `:1558-1637`.
- Level 5 does **not** continue the same-family chain. The table defines six
  cross-family recipes: `H0104+H0204→H0705`, `H0304+H1204→H0805`,
  `H0404+H1304→H0905`, `H0504+H0604→H1005`, `H1404+C04→H1505`, and
  `H1604+H1704→H1805`. Each result also carries one or two `HERO_STAR_GE`
  verification gates. Evidence: decoded `baglike.BagLikeItemConfig.json`, rows
  `H0705` through `H1805`; exact gates and recovered assets are recorded in
  `baglike-level5-fusion.md`.
- `BrickBaseCom.setData` sizes the piece view to `shape columns × gridSize` by
  `shape rows × gridSize`; `onListRender` renders every truthy shape cell.
  Evidence: `work/merge-shape-analysis/BrickBaseCom.ts.deobfuscated.js:3`, byte
  offsets 1261-2600.
- Confirmed shape matrices include one cell, horizontal two cells, vertical two
  cells, and vertical three cells. Evidence: decoded
  `baglike.BagLikeShapeConfig.json:63-146`.

## Extraction command

```shell
node skills/wechat-minigame-reverse-expert/scripts/extract-cocos-module-source.js \
  targets/wxf9af2417e78ce07a/18/work/ui-module-analysis/game.analysis.js \
  targets/wxf9af2417e78ce07a/18/work/merge-shape-analysis \
  '(BagLikeMergeDatas|BagLikeShapeDatas|BaglikeMergeLineCtrl|BagLikeMergeLine|BagLilkeManager|BagLikeItemDatas|BagLikeItemDataVo|BagLikeDragCtrl|BagLikeDragListCtrl|BrickBaseCom|BrickCom|BrickShowCom|ChooseCom|ShowNodeCom|BagLikeEnums)'
```

Exit code: `0`; extracted modules: `15`.

## Implementation impact

- Preparation must permit drag-to-merge in both the candidate area and the
  backpack grid.
- Multi-cell pieces must render at the same 100-pixel spacing used by occupancy
  checks; a compressed icon is insufficient because it hides the real footprint.
- Level changes must be visible after a merge, and merged coin gears must use the
  configured per-completion production values `2/4/8/16`. Completion is driven by 100-point
  worker progress with 3 points per power-core trigger, not a fixed three-second interval.
- A level-5 merge must be order-independent, must fail without consuming either
  material when its hero-star gates are not met, and must re-evaluate the result
  footprint at the target location. If the new footprint cannot fit, the result
  returns to the candidate tray; newly overlapped pieces are returned whole.
