# 200关敌人与我方齿轮外观验收

- Target: `wxf9af2417e78ce07a/18`
- Date: `2026-08-10`
- Scope: 只验收“能认出200关出现的全部敌人/Boss，以及全部我方 HERO/COIN 齿轮长什么样”；不重做已经完成的200关数据与共享机制。
- Result: **PASS**

## Coverage

| Catalog | Evidence source | Count | Runtime pages | Result |
|---|---|---:|---:|---|
| Enemy/Boss identities used by normal levels | `assets/resources/data/normal-levels.json` + recovered monster/model tables | 25 | 1 | PASS |
| Unique recovered enemy Spine families | resources3 native assets | 16 | reused by 25 identities | PASS |
| Player HERO/COIN BagLike items | recovered `baglike.BagLikeItemConfig` | 58 | 3 | PASS |
| Recovered gear footprints | recovered `baglike.BagLikeShapeConfig.shapeArr` | 10 | included in gear cards | PASS |

The normal-level source contains 200 levels and 2978 rounds. The roster is derived from the union of every `monsterIds` entry in those rounds. `M08`, `Boss04`, `Boss05`, and `Boss08` are not referenced by those 200 normal levels and therefore are not counted in this milestone.

## Runtime entry points

- Enemies/Bosses: `index.html?visualCatalog=enemies`
- Gear page 1: `index.html?visualCatalog=gears&visualPage=0`
- Gear page 2: `index.html?visualCatalog=gears&visualPage=1`
- Gear page 3: `index.html?visualCatalog=gears&visualPage=2`

The visual-catalog route bypasses normal level boot, so it does not reopen or alter level mechanics. Enemy cards render recovered 3.8.99 Spine data; gear cards render the recovered tier body, connector/shape, level-five overlay where applicable, and exact `heroSmallHead` crop. The H11 healing gear now uses its recovered `H1101` portrait instead of the former star fallback.

## Visual evidence

- `enemies-25.png`
- `gears-page-1.png`
- `gears-page-2.png`
- `gears-page-3.png`

All four pages were captured from the Creator 3.8.8 `web-mobile` build. Browser console check for every page returned zero warnings/errors from catalog asset loading.

## Validation

- Cocos import/build: PASS (`Cocos Creator 3.8.8`, `web-mobile`, 2026-08-10 12:04:26 +08:00)
- Static project checker: PASS (`missingMetaCount: 0`, `assetFileCount: 169`)
- Project TypeScript: PASS with `--skipLibCheck true`; the unskipped failures are confined to Cocos 3.8.8 engine declaration files, with no project-script diagnostics.
- Automated test files: PASS (`26/26`)
- Visual-roster assertions: PASS (`10/10`)
- Recovered Spine inspection: PASS for all 16 triples (version `3.8.99`, runtime `3.8`, `idle` present, atlas texture matched)

## Remaining project-wide distinction

This PASS closes the requested visual-recognition milestone. It does not claim that every one of the 200 levels is currently wired as a separately selectable, fully playable runtime scene, nor does it replace the broader gameplay visual-baseline comparison against matched original recordings.
