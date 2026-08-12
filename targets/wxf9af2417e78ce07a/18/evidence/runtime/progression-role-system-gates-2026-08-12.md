# Progression, role and system-gate audit — 2026-08-12

Target: `wxf9af2417e78ce07a/18`

## Confirmed source behavior

- `RoleModel` + `POWER:INIT_DATA`: P01 starts at level 0 / star 0 and is
  equipped; P02–P04 start at star -1 and must be recruited.
- `RoleMgr`: each role has three daily free-fragment advertisements, each
  awarding two fragments. Star -1 activates at ten fragments.
- `PowerLevelConfig`: the equipped role contributes `ATK_BONUS = level * 100`;
  levels 10/30/50/.../170 each add a global `ATK_BONUS = 1000` milestone.
- `PowerStarConfig` and `PowerAbilityConfig`: the equipped role contributes
  `ATK_BONUS = star * 1000`; every owned role adds global gear attack at stars
  2/4/6 (+1000 each) and 8 (+2000).
- P01 star 1 appends reward drop 3011 (one random level-1 gear) to the first
  eligible prepare draw; star 5 replaces it with 3012 (one random level-2 gear).
- `PowerSkillVo` emits `CREATE_POWER_SKILL` for P04. `BattleInstanceController`
  sets its attack to `BagLilkeManager.getTotalAtk() || 1`, where `getTotalAtk`
  sums every placed HERO gear's star-adjusted attack and gear-level multiple.
- P04 `FB_1601_1/2/3` resolves to `M_FB_P04_1/2/3`: a left-to-right Dart at
  y=0, radius 150, at most ten distinct targets. Its base ratios are
  6000/9000/12000 and `amount_Dec=1000` reduces each later target by 10% of
  that tier's base ratio (for example 6000, 5400, ... 600).
- P04 star 1 adds 1% productivity per active-skill kill, capped at ten kills;
  star 5 raises the cap to twenty. `BagLilkePowerSkillManager.tryDieByRole`
  verifies the killing skill group is `FB_1601`.

Primary extracted modules:

- `work/battlefield-runtime-analysis/formatted/BagLilkeManager.ts.deobfuscated.js`
- `work/battlefield-runtime-analysis/formatted/BagLilkePowerSkillManager.ts.deobfuscated.js`
- `work/battlefield-runtime-analysis/formatted/BattleInstanceController.ts.deobfuscated.js`
- `work/battlefield-runtime-analysis/formatted/DartUnit.ts.deobfuscated.js`
- `work/power-role-analysis/PowerSkillVo.ts.deobfuscated.js`
- `work/power-role-analysis/HeroMgr.ts.deobfuscated.js`
- `work/power-role-analysis/RoleModel.ts.deobfuscated.js`

Decoded tables:

- `power.PowerConstantConfig.json`
- `power.PowerConfig.json`
- `power.PowerLevelConfig.json`
- `power.PowerStarConfig.json`
- `power.PowerAbilityConfig.json`
- `power.PowerSkillConfig.json`
- `battle.SkillConfig.json`
- `battle.BehaviorConfig.json`
- `battle.MissileConfig.json`

## Reconstruction changes

- Normal levels now enforce sequential unlock and spend five energy on entry;
  explicit validation URLs remain isolated bypasses.
- Locked main-page systems and activity entries are non-interactable, not merely
  grey. Level selection exposes only passed levels plus the latest challenge.
- Unit candidate pools use the account's recovered chapter unlock table rather
  than all twelve families at account creation.
- Role acquisition, daily fragment limits, 0–8 star progression, equipped-role
  persistence and three daily free level-ups are connected to the role page.
- Equipped-role own level/star attack, all-role global level/star milestones,
  P01 prepare reward, P02/P03 active effects and P04 total-attack Dart/passive
  productivity are connected to the battle runtime.
- Shop energy advertisement and diamond purchase each enforce their recovered
  three-times-per-day limit. Advertisements remain the user-authorized local
  deterministic mock and never grant rewards on cancel/failure.

## Validation

- Creator 3.8.8 TypeScript: pass.
- Node suite: 46/46 test files pass.
- Full normal-level reducer: 200 levels / 2,978 rounds / 54,816 scheduled spawns.
- Web Mobile build: `2026-08-12 12:59:09`; log ends with
  `build Task (web-mobile) Finished`.
- Fresh browser smoke before this source-trace slice confirmed sequential level
  locks, 30→25 energy on entry, locked role navigation, and role acquisition UI
  with zero console warnings/errors.

## Explicit visual limitation

P04 uses an evidence-backed moving Dart path and mechanics, but the projectile
is currently drawn as a local purple streak because the exact `H33_S1` visual
asset is not in the imported reconstruction bundle. P02–P04 exact role portrait
atlas crops are likewise unavailable and remain labeled fallback badges. These
are visual fidelity gaps only; they are not replaced with invented art.
