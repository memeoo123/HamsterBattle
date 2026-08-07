# H03 transform passives (`RG_H03_abl03`)

Status: **confirmed from decoded configuration joined to shipped runtime consumers**.

## Draw rows and replacement scope

- `BagLikeAbilityEffectConfig` contains one-time quality-3, weight-100 rows
  `RG_H03_abl03_eff01` and `RG_H03_abl03_eff02`. Both cover H03/H08; the
  lower row requires H03 star 7 and the higher row requires star 8.
- Their effective rows route `ADD_PASSIVITY_SKILL` to `3001_3` and `3001_4`.
  `SkillConfig` assigns both parent skills to group `3001_3`, so the star-8
  row is the higher replacement rather than an additive copy of star 7.
- `BagLikeBuffManager.addEffective` stores these IDs in the H03/H08 extra-skill
  map (`work/battlefield-runtime-analysis/formatted/BagLikeBuffManager.ts.deobfuscated.js:113-145,194-205`). The restored unit therefore snapshots the
  highest selected profile when a later H03/H08 unit is created.

## Hit trigger, target, duration, and immunity

- `3001_3` attaches `3001_p3`; `3001_4` attaches `3001_p4`.
  `PassivitySkillConfig` gives both child passives condition 4 with
  `conditionValue=[0]`, routing ordinary attack index 0 to
  `3001_bh3`/`3001_bh4`.
- `BattleUnit.damageHurt` fires `ConType_4` for the damage caster after a hit
  (`work/battlefield-runtime-analysis/formatted/BattleUnit.ts.deobfuscated.js:91-99`). `PassivitySkillUtils` accepts attack index 0, forwards the damaged
  unit as `skillTarget`, and executes the passive behavior
  (`work/battlefield-runtime-analysis/formatted/PassivitySkillUtils.ts.deobfuscated.js:20-45,62-64`).
- Both behaviors use `SKILL_TARGET`, enemy faction, one target, and add Buff
  groups `3001_bf3`/`3001_bf4`. Both groups last 2000 ms and use changed-model
  presentation `H28_S2`.
- Star 7's `3001_bf3_1` is abnormal type 3 (`dizziness`). The shipped unit
  runtime maps dizziness to both movement and attack suppression, but rejects
  it when `ImmuneControl` is present
  (`work/battlefield-runtime-analysis/formatted/BattleUnit.ts.deobfuscated.js:220-225`).

## Star-8 runtime/card conflict

- The star-8 card says that a transformed target receives 30% more damage.
  The shipped Buff does not encode incoming vulnerability: `3001_bf4_1` is an
  attribute Buff with `DMG_INC=3000` and no abnormal component.
- `AttributeConfig` names `DMG_INC` “造成伤害增加”. `FightFormula` reads it
  from the attacker and subtracts `DMG_RES` from the defender
  (`work/battlefield-runtime-analysis/formatted/FightFormula.ts.deobfuscated.js:55-60`). Applying `DMG_INC` to the damaged skill target therefore makes that
  target deal 30% more damage during the two-second Buff; it does not increase
  damage received and it does not retain the star-7 dizziness.
- The reconstruction preserves this version-18 runtime result and records the
  card mismatch as a runtime disconnect. It does not silently rewrite the Buff
  as target vulnerability.

Production contract:

1. star 7: each qualifying H03/H08 ordinary hit applies the two-second changed-
   model Buff and, unless control immune, two seconds of dizziness;
2. star 8: the higher row replaces star 7, applies the same two-second changed-
   model lifetime, adds `DMG_INC=3000` to the hit target, and applies no
   dizziness;
3. repeated hits refresh a shorter remaining lifetime without shortening a
   longer existing dizziness;
4. `DMG_INC` expires with the Buff and is consumed only when that transformed
   target later attacks.

## Remaining presentation verification

The numeric, target, replacement, refresh, and immunity contract is confirmed.
The original `H28_S2` changed-model asset is not present in the recovered
project asset set, so exact peanut/chestnut presentation and `skill_bianxing`
audio remain visual/audio work and are not claimed by this mechanics slice.
