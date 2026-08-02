# Original battlefield visual audit — 2026-08-01

## Identification

The four user-supplied screenshots are original-game references for level `1004 / 荒漠沙地`, not the current reconstruction's representative level `1001 / 宁静森林`.

This identification is high confidence because the screenshots combine a desert battlefield and a `1/15波` HUD. In the recovered v18 `TrunkInstanceConfig`, level 1004 uniquely combines `fightscene_03`, 15 rounds, and 500 initial home HP. Level 1001 uses `fightscene_01` and only five rounds.

The screenshots are therefore suitable for recovering original layout and phase behavior, but they are not yet a matched visual-baseline pair against the current 750×1334 level-1001 reconstruction.

## Earliest structural divergences

| Priority | Original behavior visible in screenshots | Current reconstruction | Consequence |
|---|---|---|---|
| P0 | Level 1004 uses the desert scene and 15-wave content. | `CangshuGame.ts` is hard-coded to level 1001, the forest scene, and five waves. | The compared scenarios differ before the first frame, so later visual tuning cannot converge. |
| P0 | Starting battle expands the battlefield vertically while retaining the backpack and its placed gears below it. | `startRound()` sets `prepareLayer.active = false`; the battlefield remains a fixed 750×300 layer. | Battle silhouette, vertical hierarchy, gear visibility, and production feedback all diverge immediately. |
| P0 | The backpack is a dark rounded panel with only the unlocked cells visibly emphasized; occupied gear silhouettes are full original artwork spanning their actual cells. | The reconstruction draws a full synthetic 7×5 grid, lock marks, labels, and simplified gear graphics. | Occupancy is technically modeled but visually communicates the wrong structure and footprint. |
| P0 | EXP/level progression can interrupt the battle with a dimmed three-card “选择激活特性” overlay. | No BagLike EXP/level or trait-selection phase exists. | Phase flow and combat modifiers diverge, not just presentation. |
| P1 | Candidate pieces use original cog artwork and show live production rates such as `0.07/s`, `0.13/s`, and `0.17/s`. | Candidate cards use reconstructed shapes/text and do not present the original rate treatment. | Preparation choices and merge feedback are not readable like the original. |
| P1 | The top HUD is a compact graphical strip: pause, currency, ticket count, EXP/wave progress, level badge, and utility icons. | The reconstruction uses a large custom text panel with level title, objective, phase, and separate speed/pause buttons. | The entire top third has a different visual hierarchy. |
| P1 | Preparation controls are three artwork-backed bottom actions: ad grid reward, refresh, and start battle. | The reconstruction uses generic drawn buttons with different copy, dimensions, and counters. | Layout and affordances are visibly different even if actions partially overlap. |
| P1 | Battle shows original camps, many small units, health bars, projectiles/hits, and compact damage numbers in layered lanes. | Units, effects, scale, sorting, and combat feedback are still reconstructed approximations. | Battle density, motion, and readability do not match. |

## Screenshot-specific observations

### `preparation-initial.png`

- Initial HP is `500` and the HUD shows `1/15波`.
- Only a centered 3×3 region is visibly available around the hamster power core.
- Three candidate gears appear as irregular cog silhouettes with per-second production labels.
- Bottom actions include an ad-driven grid acquisition, a normal refresh, and start battle.

### `preparation-developed.png`

- Multiple irregular, multi-cell gears connect around the center core.
- Each placed gear retains its artwork and shows a production-rate label at the occupied shape.
- The ad action explicitly offers `获取格子 x3`, confirming that grid expansion is a first-class preparation reward.

### `battle-wave-1.png`

- The battlefield expands to occupy roughly the upper half of gameplay space.
- The backpack remains visible below the HP divider during battle; placed gears continue to communicate production.
- Enemy and allied units coexist in several vertical lanes with individual HP bars and damage feedback.

### `trait-selection.png`

- A modal `选择激活特性` overlays the live battle/backpack composition.
- Three choices include global and unit-specific modifiers; visible examples affect all spell gears, shooter extra-target chance, and mage freeze chance.
- `换一批` and `全都要` are limited-use actions with remaining counters, so this is a stateful subsystem rather than a cosmetic dialog.

## Correct restoration order

1. Switch the representative visual scenario from hard-coded level 1001 to a level-selectable implementation and reproduce level 1004 from recovered tables.
2. Restore phase geometry: preparation layout, battle expansion, persistent backpack, and overlay stacking.
3. Restore BagLike EXP/level and trait selection because it changes both phase flow and damage/skills.
4. Restore original gear artwork, silhouettes, cell occupancy treatment, production-rate labels, and merge feedback.
5. Restore top HUD and bottom controls from recovered UI packages/assets.
6. Only then tune unit scale/sorting, animations, projectiles, damage text, audio, and frame-level timing.

## Validation boundary

These references close the “no original screenshots at all” gap, but do not pass `visualBaseline`. A pass still requires reconstruction captures of level 1004 at the same phase, resolution, and controlled event, or a new original capture of level 1001 paired to the existing representative scenario.
