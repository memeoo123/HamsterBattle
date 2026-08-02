# BagLike gear-level unit production evidence

Target: `wxf9af2417e78ce07a/18`.

## Confirmed runtime chain

- `baglike.BagLikeItemConfig.json` stores each producer's `level`, `headPath`, `modelId`,
  `skill0`, and `params`. For HAMSTER producers, `params` is
  `[heroId, workerPowerPerTrigger, attributeMultiple]`.
- H01/H02/H03/H04 levels 1–4 use attribute multiples
  `10000 / 15000 / 22500 / 33750`, level-specific head IDs and level-specific model IDs.
  H12/H13 use the same multiples for one-shot WHEEL skills but deliberately have no
  persistent `modelId`.
- `WorkerBar.ts.deobfuscated.js:3` reads `getHeroParam().attrMultiple`, resolves the
  level gear's `config.modelId` through the active hero skin, and emits both values in
  `PREPARE_CREATE_HERO_UNITS`.
- `BattleInstanceController.ts.deobfuscated.js:167`–`274` consumes the event. It multiplies
  the account hero's ATK/HP by `t.multiple`, carries the resolved `modelId`, and asks the
  BagLike skill manager for skills using the producing `baglikeId`.

## Level model mapping

`model.ModelConfig.json` confirms the default model paths:

| Gear family | Levels 1–4 |
|---|---|
| H01 | `js_zhanshi_1` … `js_zhanshi_4` |
| H02 | `js_sheshou_1` … `js_sheshou_4` |
| H03 | `js_fashi_1` … `js_fashi_4` |
| H04 | `js_qishi_1` … `js_qishi_4` |

Levels 1–3 use model scale `0.8`; level 4 uses `0.88`. The twelve previously missing
level-2/3/4 models were recovered under
`evidence/assets/original/hero-level-models/`, hash-recorded, and verified as Spine 3.8.99
with compatible atlas textures and attack/die/idle/move animations.

## Skill boundary

H0204 changes `skill0` from `2001` to `2002`. `battle.SkillConfig`,
`battle.BehaviorConfig`, and `battle.MissileConfig` show equal timing, range, speed and hit
behavior; the confirmed difference is the missile visual (`H29_S1` versus `H29_S2`). The
reconstruction now carries `productionSkillId=2002` for H0204. Restoring that distinct
projectile model belongs to presentation, not numeric combat.

## Reconstruction mapping

`BagLikeUnitProgression.ts` is the production source of truth for producer kind, level,
attribute multiple, head, model, resource path, scale, and primary skill. `CangshuGame.ts`
uses the profile when it creates HAMSTER units or scales one-shot WHEEL skills. Level
models are loaded from `assets/resources/spine/<gearId>/`.

Deterministic coverage: `baglike-unit-progression.test.mjs` passes 227 assertions across
all H01/H02/H03/H04 levels, H12/H13 scaling, exact paths/scales/skill identity, invalid
levels, and the imported atlas/png/skel files.

