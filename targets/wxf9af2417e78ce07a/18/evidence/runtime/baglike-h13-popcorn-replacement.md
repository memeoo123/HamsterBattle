# H13 popcorn replacement and unreachable last-bounce explosion

Target: `wxf9af2417e78ce07a/18`
Recovered: 2026-08-07

## Confirmed draw and replacement contract

- `RG_H13_abl02_eff01` is a quality-4, weight-50, one-time H13-star-7 row
  scoped to H13/H09. Its effective row replaces the shared `TZ_1301` group with
  `TZ_1302`.
- `RG_H13_abl02_eff02` has the same draw values at H13 star 10 and replaces the
  same group with `TZ_1303`; only the highest account-star-qualified row enters a
  draw.
- Both replacement skills keep the random-enemy launch behavior, 1000 ms skill
  cooldown, speed-1000 type-8 bounce projectile and base two follow-up bounces.
- Each `TZ_1302`/`TZ_1303` bounce projectile carries `atk_ins=1000`. The runtime
  multiplies every child missile's inherited attack by `1 + 1000/10000`, so the
  initial hit is unchanged and later segments compound to 110%, 121%, 133.1%,
  and so on before the normal damage pipeline rounds the result.

## Version-18 last-missile disconnect

- `TZ_1303` config supplies `last_missile=M_TZ_1303_3`. That type-1 missile would
  run `B_TZ_1303_3`, a radius-50, at-most-five-target hurt behavior with ratio
  3000.
- The shipped `BounceBullet.initParam` resets the new child's `bouncelTimes` to
  zero and immediately evaluates `last_missile` against
  `bouncelMaxTimes - 1`.
- Only after `initParam` returns does `createBulle` copy the parent's incremented
  `bouncelTimes` into that child. With H13's supported limits of 2, 4 or 6, the
  earlier zero comparison is always false; `M_TZ_1303_3` is never selected.
- Therefore version 18 gives `TZ_1303` the same confirmed 10%-per-bounce damage
  growth as `TZ_1302`, but not the description's last-bounce area explosion.
  The reconstruction preserves this runtime result and records the configured
  explosion as an evidence-confirmed no-op.

## Evidence locations

- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectConfig.json:1567`
  and `:1592` contain the star-7/star-10 draw rows.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectiveConfig.json:532`
  and `:540` route them to `TZ_1302` and `TZ_1303`.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.SkillConfig.json:1609`
  and `:1664` define the two shared-group replacement skills.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.BehaviorConfig.json:772`
  and `:793` launch the two first missiles; the configured explosion behavior
  begins at line 814.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.MissileConfig.json:158`
  and `:183` define the `TZ_1302` first/follow-up missiles with `atk_ins=1000` at
  lines 166 and 191.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.MissileConfig.json:208`
  and `:234` define the `TZ_1303` bounce missiles; `atk_ins` and `last_missile`
  are at lines 216-217 and 242-243. The unreachable type-1 last missile begins
  at line 260.
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BounceBullet.ts.deobfuscated.js:35`
  resets the bounce count; line 43 evaluates `last_missile`; lines 57-63 create
  the child, apply the attack multiplier, and only then copy the parent count.

## Reconstruction and validation

- The two exact draw rows now participate in the production weighted pool.
- The production pending-projectile path snapshots the selected H13 replacement
  at launch and compounds attack once per later segment for both H13 and H09.
- The configured `TZ_1303` explosion remains inactive, matching the recovered
  reset-before-copy order.
- `baglike-traits.test.mjs`: 127/127 assertions.
- `battlefield-kernel.test.mjs`: 53/53 assertions, including skill identity,
  100%/110%/121% attack and the 2/4/6-bounce last-missile disconnect.
- Full rule/resource suite: 13 scripts, 679/679 assertions.
- Creator 3.8.8 bundled TypeScript: pass with `--noEmit --skipLibCheck true`.

## Remaining boundary

The target account's actual H13 star is still absent from package artifacts and
captures, so the reconstruction keeps `h13HeroStar=1` by default. Popcorn missile
art and matched impact presentation remain presentation-stage work.
