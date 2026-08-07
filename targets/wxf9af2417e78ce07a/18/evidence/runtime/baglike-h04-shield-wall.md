# H04 shield-wall passive (`RG_H04_abl03`)

Status: **confirmed from decoded configuration joined to shipped runtime consumers**.

## Draw rows and hero scope

- `BagLikeAbilityEffectConfig` contains `RG_H04_abl03_eff01` and
  `RG_H04_abl03_eff02` at
  `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectConfig.json:995`
  and `:1020`. Both are one-time quality-4 rows with weight 50 and range
  `H04/H09`; the lower row requires H04 star 7 and the higher row requires
  star 10.
- Their effective rows select `ADD_PASSIVITY_SKILL` IDs `4001_3` and `4001_4`
  at `baglike.BagLikeAbilityEffectiveConfig.json:346-357`.
- `BagLikeBuffManager.addEffective` dispatches `ADD_PASSIVITY_SKILL` into the
  hero-range skill map (`work/battlefield-runtime-analysis/formatted/BagLikeBuffManager.ts.deobfuscated.js:132-145,200-205`). This is the same future-unit
  snapshot boundary used by the recovered H04 periodic-heal passive.

## Passive chain and timing

- `battle.SkillConfig.json:3000-3014` joins `4001_3` to `4001_p3`, while
  `:3055-3069` joins `4001_4` to `4001_p4`.
- `battle.PassivitySkillConfig.json:507-524` and `:531-548` set condition 6,
  `interval=5000`, `cd=5000`, and route to `4001_bh3`/`4001_bh4`.
- Shipped `PassivitySkillData.triggerHandler` fires condition 6 when the
  interval and cooldown reach zero, then resets both
  (`work/battlefield-runtime-analysis/formatted/PassivitySkillData.ts.deobfuscated.js:59-65`).
- `4001_bh3` and `4001_bh4` add Buff groups `4001_bf3` and `4001_bf4`
  (`battle.BehaviorConfig.json:1400-1438`). Both groups last 2000 ms;
  `4001_bf4` contains the same reduction Buff plus the counterattack Buff
  (`battle.BuffGroupConfig.json:406-439`).

Therefore a newly created qualifying H04/H09 unit first activates shield wall
after five seconds, keeps it for two seconds, and repeats on the five-second
passive cycle.

## Damage reduction and counterattack order

- `4001_bf3_1` is an attribute Buff with `DMG_RES=3000`
  (`battle.BuffConfig.json:603-609`). The normal damage coefficient subtracts
  target `DMG_RES` and clamps at zero
  (`work/battlefield-runtime-analysis/formatted/FightFormula.ts.deobfuscated.js:55-60`).
- The star-10-only `4001_bf4_1` is `counterattack` with `amount=3000`
  (`battle.BuffConfig.json:631-637`).
- `BuffManager.checkCounterAttack` computes
  `floor(DamageVo.notDefValue * 3000 / 10000)` and dispatches a
  `CounterAttack` DamageVo (`work/battlefield-runtime-analysis/formatted/BuffManager.ts.deobfuscated.js:106-111`).
- `DamageVo.notDefValue` is the resistance-adjusted floating damage before the
  normal minimum/floor. `BattleManager.damage` invokes counterattack before
  shield absorption and before applying the original hit, while excluding
  `CounterAttack` status from recursively triggering another counterattack
  (`work/battlefield-runtime-analysis/formatted/BattleManager.ts.deobfuscated.js:110-118`).

Production contract:

1. star 7: every five seconds, two seconds of `DMG_RES +3000`;
2. star 10: the same reduction plus 30% reflection of resistance-adjusted,
   pre-floor incoming damage;
3. reflection resolves before the original hit and ignores later shield
   absorption; a reflected value below 1 floors to zero;
4. counterattack damage never recursively reflects.

## Remaining verification

The numeric and event-order contract is confirmed. A matched original trace is
still needed only for the precise frame offset of the first five-second trigger
and the missing shield-wall presentation effect; neither is used to invent a
mechanical value.
