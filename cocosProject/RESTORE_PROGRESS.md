# Cocos Restore Progress

> 编排迁移说明（2026-07-31）：本文件继续记录实现过程；严格验收结果改由 `VALIDATION_REPORT.md` 维护，总阶段以项目根目录的 `ORCHESTRATION_STATE.json` 为准。原始设置确认设计分辨率为 `750 × 1334`，当前实现中的 `750 × 1000` 已登记为待修正差异。

## Target

- Source AppID/version: `wxf9af2417e78ce07a/18`
- Original engine: Cocos Creator `3.8.2`
- Reconstruction editor: Cocos Creator `3.8.8`
- Current fidelity baseline: main level `1001` / `宁静森林`

## Implemented

- Replaced the earlier five-tower path-defense prototype with the original battle structure:
  - upper battlefield with player/enemy mushroom camps;
  - lower `7 × 5` backpack grid;
  - original centered `3 × 3` unlocked area and power core at index `17`;
  - draggable hero/coin gears and staged grid expansion;
  - preparation, battle, round-clear, victory and defeat phases.
- Imported reachable original assets:
  - `fightscene_01` forest scene;
  - red and blue mushroom camps from the original FairyGUI atlas;
  - original Spine 3.8.99 models for `H0101`, `H0201`, `M02` and `M03`;
  - retained original UI/head/shape atlases for subsequent detailed UI matching.
- Restored level `1001` battle data:
  - player camp HP `500`;
  - enemy camp HP `4000`;
  - five original round schedules and monster timestamps;
  - level and round ATK/HP multipliers;
  - `H01`/`H02`, `M02`/`M03`, and `Boss03` base attributes;
  - hero spawn intervals (`H01` 10 seconds, `H02` 8 seconds);
  - coin gear output and enemy gold rewards.
- Restored the core regular-damage path:
  - actor ATK × effect ratio × hit × critical × damage-increase/resistance;
  - integer floor with minimum damage `1`;
  - no invented traditional defense stat;
  - common attack has `100%` ATK, `1s` cooldown and `0.3s` hit delay;
  - attack-speed adjustment and hero/tower/boss modifiers are represented.
- Restored automatic spawning, movement, target acquisition, melee/ranged distances,
  camp attacks, death cleanup and round transitions.

## Verification

- TypeScript project check with the Cocos Creator 3.8.8 declarations: passed.
- Spine headers: all four imported skeletons report Spine `3.8.99`, compatible with
  the original game's 3.8 runtime.
- Animation names found in the source skeletons and used by the runtime:
  `idle`, `move`, `attack`, `die`.
- A Cocos headless build attempt was stopped after its editor process stalled before
  asset metadata generation; no existing interactive editor process was terminated.

## Remaining fidelity work

- Open the project in Creator once so the newly copied images and Spine files receive
  editor-generated `.meta` records, then run the scene preview.
- Compare the preview against a fresh capture of the original level to tune exact
  FairyGUI spacing, layer order, camp scale, unit scale and UI skins.
- Restore the remaining level-specific gears, hero active skills, status effects,
  sound effects and later fight scenes after level `1001` is accepted as the visual
  and numerical baseline.
