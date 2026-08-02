# Level 1001 battlefield runtime evidence

Target: `wxf9af2417e78ce07a/18`.

The analysis copy at `work/ui-module-analysis/game.analysis.js` has SHA-256
`f50bd1ffcdea0f6dd7d354ab7362fc6705e7707a3b2a75d646636fc1d31a5aa0`, identical to
`reverse-work/unpacked/wxf9af2417e78ce07a/18/subpackages-game/subpackages/game/game.js`.
Raw extracted factories are preserved under `work/battlefield-runtime-analysis/`; formatted
copies are derived inspection aids and are not treated as source packages.

## Damage and attributes

- `formatted/FightFormula.ts.deobfuscated.js:42-60,89-101` reads clamped live attributes,
  rolls dodge from the target's `DOD_RATE`, converts a dodge to `baseMissValue`, rolls
  critical separately, routes `HERO_DMG_RES` only for HAMSTER attackers and
  `TOWER_DMG_RES` only for WHEEL attackers, adds `BOSS_DMG_INS` against `BossUnit`, then
  floors the product with a minimum of 1.
- `battle.AttributeConfig.json` caps `DOD_RATE` and `DMG_RES` at 7000, `CRI_RATE` at 10000,
  and contains the separate hero/tower resistance attributes. Although `DOD_RES` exists,
  the recovered regular-damage dodge function does not consume it.
- `BattleConstantConfig` resolves `baseMissValue=5000`, `baseCritValue=15000`, and a random
  base of 10000. A dodge is therefore half damage, not zero damage.
- `formatted/BattleAttr.ts.deobfuscated.js:385-412` applies attack speed as
  `base * (1 + ATK_SPD/10000)` and derives move speed from the configured base plus
  `MOVE_SPD`.

## Entity and skill chain

- `formatted/BattleExSkillManager.ts.deobfuscated.js:29-47` proves that a placed gear's
  `BagLikeItemConfig.skill0` becomes the hero's battle skill list, while monsters receive
  `MonsterAttributeConfig.skillIds`.
- H01/H02/H04 use skills `1001`, `2001`/`2002`, and `4001`. Their behavior chain resolves
  to 10000 hurt; H02 uses missiles `M_SS_2001`/`M_SS_2002` at speed 700.
- H12 uses `LY_1201`: random target, range 9999, one-second cooldown. Its missile waits
  500 ms, then behavior `H_LY_1201` applies 5000 hurt to at most five enemy targets in a
  radius of 50.
- M02 uses `melee_attack` with 10000 hurt. M03 and Boss03 use `YGT_5002`, which launches
  `M_YGT_50002` at speed 800 and applies 5000 hurt. Boss03 also owns passive `BT_001`;
  `BT_p001 -> BT_bh001 -> BT_bf001 -> BT_bf001_1` applies abnormal type 12 (control
  immunity).
- `formatted/BulletUnit.ts.deobfuscated.js:47-89` derives projectile travel time from
  distance divided by move speed, advances using frame delta milliseconds, and triggers
  delayed behaviors after impact. It copies attack/source identity at launch, keeps its initial
  travel direction, and remains resolvable if the caster dies. A dead single target produces no
  hit; an area projectile can still resolve around its fixed impact point.
- `formatted/BattleUnit.ts.deobfuscated.js:155-171,214-217,256-266,329-333` confirms target
  selection through skill config, range gating, attack-speed-scaled normal casts, movement
  toward out-of-range targets, and enemy-only attacks on the player home in this mode.
- `SkillData.actionSkill` scales a basic attack's behavior delay as
  `ceil(baseDelayMs / (1 + ATK_SPD/10000))`; the normal attack cooldown and cast time use the same
  attack-speed attribute. H02's 300 ms delay therefore becomes 261 ms, while Boss03's becomes
  200 ms.

## Level 1001 values corrected in the reconstruction

- Global hero/monster base move speed is 60. H04 has `MOVE_SPD=5000`, so its effective
  move speed is 90. Hero search range is 400; monster search range is 1200.
- H02 has `ATK_SPD=1500`. Boss03 has `ATK_SPD=5000` and no tower vulnerability.
- M03 has `TOWER_DMG_RES=-5000`; this affects H12 (WHEEL) but not H01/H02/H04 (HAMSTER).
- Gear levels multiply base ATK/HP by 1, 1.5, 2.25, and 3.375. Production timing is not a fixed
  interval; its recovered power-core and worker-progress chain is documented separately in
  `battlefield-production-runtime.md`.
- `TrunkInstanceDefeatConfig` rows 1-15 reduce both enemy ATK and HP after consecutive
  defeats: 0.95, 0.9025, 0.8574, 0.8145, 0.7738, 0.7351, 0.6983, 0.6634, 0.6302,
  0.5987, 0.5688, 0.5404, 0.5133, 0.4877, and 0.4633. The runtime clamps later failures
  to the final configured row.

## Remaining boundary

The representative base skill chain above is confirmed and implemented. Optional
BagLike ability choices can add or exchange skills and attributes; those progression
choices are a separate preparation subsystem and still require a matched original trace
before their selection UI or resulting skill mutations can be claimed replay-faithful.
