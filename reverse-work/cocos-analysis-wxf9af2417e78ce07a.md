# Cocos Static Analysis: wxf9af2417e78ce07a/18

## Target

- AppID/version: `wxf9af2417e78ce07a/18`
- Engine: Cocos Creator `3.8.2`
- Platform: WeChat Mini Game
- Main package SHA-256: `E1FB5EF76B1E27DC00005028022FC858F3107D1A5B0FFF73E92CC1714DEFEC42`
- `game` subpackage SHA-256: `2249382D636ACECC1B82D2FEA87DBA75FB63A044D6A76F4A61EE84FB8800F17F`

## Resource loading chain

1. `main/src/settings.37a11.json` declares:
   - server: `https://kxmnrs-res.chuxinhd.com/cangshu/wx_xylxs/res/`
   - remote bundles: `resources2`, `resources3`
   - versions: `resources2=f7a66`, `resources3=cce0e`
2. Cocos loader code inserts `remote/<bundle>` between server and bundle name.
3. Reachable indexes:
   - `remote/resources2/config.f7a66.json` — 14,987 bytes
   - `remote/resources3/config.cce0e.json` — 111,932 bytes
4. `resources3` path index `136` identifies `localData` as `cc.BufferAsset`.
5. Expanded UUID: `50758c22-227f-409c-956b-71be0d08e2ed`; native version: `4952c`; extension: `.bin`.
6. Reachable native file:
   - `remote/resources3/native/50/50758c22-227f-409c-956b-71be0d08e2ed.4952c.bin`
   - length: 130,712 bytes
   - SHA-256: `815FB0AFA56DDFAA7B8BAA7C26BF4DA6B47AE8B87195919406D313F5565CB31D`
   - container: ZIP (`PK\x03\x04`)

## LocalData format

- ZIP entries: 119
- Compact tables: 118
- Global string table: `localdata/str.json`
- Uncompressed payload: 625,284 bytes
- Compact layout:
  1. column count
  2. `(type code, field-name token)` pairs
  3. row count
  4. column-major cell values
- Numeric field names and string/JSON values index into `str.json`.
- All 118 compact tables pass the expected-length check.

The offline decoder is `reverse-work/analyze-cocos-localdata.ps1`. Generated files are under:

`reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/`

## Main-level schema

`trunkinstance.TrunkInstanceConfig` contains 200 levels with 22 fields:

`id`, `chapter`, `roundIds`, `cost`, `rewardRounds`, `rewards1`, `rewards2`,
`rewards3`, `name`, `logoSpine`, `fightscene`, `initRewards`, `staticBuffs`,
`staticBricks`, `homeHp`, `enemyHomeHp`, `enemyHomeGold`, `atkMultiple`,
`hpMultiple`, `goldMultiple`, `recommendHeroIds`, `newMonsterIds`.

Coverage:

- Level IDs: `1001..1200`
- Chapters: `1..200`
- First: `1001 / 宁静森林`
- Last: `1200 / 火山熔岩`
- Round-count distribution:
  - 5 rounds: 1 level
  - 8 rounds: 1 level
  - 10 rounds: 1 level
  - 15 rounds: 197 levels
- Scene distribution:
  - `fightscene_01`: 80 levels
  - `fightscene_02`: 40 levels
  - `fightscene_03`: 40 levels
  - `fightscene_04`: 40 levels

## Round and monster integrity

`trunkinstance.TrunkInstanceRoundConfig` contains 3,009 rows with:

`id`, `round`, `monsterTimes`, `monsterIds`, `atkMultiple`, `hpMultiple`,
`rewards`, `coinRewards`.

Validation:

- The 200 main levels reference 2,978 unique round rows.
- Missing referenced rounds: 0.
- `monsterTimes`/`monsterIds` length mismatches: 0.
- Monster attribute rows: 29.
- Distinct monsters used by all round rows: 26.
- Missing monster references: 0.
- 31 unreferenced round rows use ID groups `2000xx`, `2001xx`, `3000xx`,
  and `400001`; these are likely special/test/legacy rounds and are not part
  of the 200-level main chain.

## Example

Level `1001 / 宁静森林`:

- rounds: `100101..100105`
- scene: `image/unpack/fightscene/fightscene_01`
- recommended heroes: `H01`, `H02`
- home HP: 500
- enemy home HP: 4,000
- initial enemy gold: 300

Round `100103`:

- 13 spawn timestamps and 13 monster IDs
- monsters: `M02` and `M03`
- attack multiplier: 23,879
- HP multiplier: 27,665
- rewards include currency `2 × 20` and item `F01 × 1`
## Cross-table main-level model

`reverse-work/build-cocos-level-model.ps1` joins levels, rounds, monsters, heroes,
items, models, and skills into a reproducible 200-level model. The generated model
has zero missing references in all six foreign-key categories. Outputs are under
`decoded/level-model/`; progression, template reuse, monster deployment, hero
recommendations, and reward findings are documented in
`reverse-work/cocos-progression-analysis-wxf9af2417e78ce07a.md`.

The difficulty value is a static comparison proxy based on base stats plus level
and round multipliers. Restored business code confirms that each configured
multiplier is divided by 10,000, the level and round values are multiplied, and
the result is applied to monster base ATK/HP. The proxy uses the first-attempt
case and therefore excludes the runtime consecutive-loss assistance multiplier.

The 31 rounds outside the main chain are all accounted for: 20 daily-instance
rounds, 10 `ADD_EXTRA_MONSTER` rounds, and one endless-mode round. See
`reverse-work/cocos-runtime-and-special-rounds-analysis.md`.

