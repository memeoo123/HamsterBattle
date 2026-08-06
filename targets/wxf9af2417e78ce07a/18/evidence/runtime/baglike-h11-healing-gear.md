# H11 healing gear runtime evidence

Updated: 2026-08-06

## Conclusion

H11 is a one-shot `WHEEL` producer, not a persistent battlefield unit. Each power-core
contact adds `9` worker points. At `100`, `WorkerBar.make` emits `CREATE_TOWER_SKILL`;
the shared WHEEL completion path waits the recovered `0.25 s` worker-complete animation.

`ZL_1101` searches the whole battlefield for an allied unit with the lowest HP
percentage. Its two behaviors execute in the same successful cast:

- `B_ZL_1101`: `TARGET_CIRCLE`, radius `200`, allied `LOWEST_HP`, one target, `heal`,
  amount `10000` (100% of caster attack).
- `B_ZL_1102`: `SELF_HOME`, allied base, `healHome`, amount `5000` (50% of caster
  attack). A full/dead base is skipped by the runtime.

The healing formula is
`floor(max(0, casterAtk * amount/10000 * (1 + HL_INC/10000)))`. The gear levels pass
attribute multipliers `1 / 1.5 / 2.25 / 3.375` before this floor. H11's base attack is
`63`, so a level-1 cast produces raw unit/home heals `63 / 31`.

The cast requires a living friendly unit target. A full-health friendly unit remains a
valid cast target, so the paired base repair can still execute. Equal-HP-percentage ties
are randomized because the runtime shuffles the candidate list before sorting.

## Evidence map

- `baglike.BagLikeItemConfig.json`: H1101-H1104 shape `3`, `perPowerPoint=9`, skill
  `ZL_1101`, multipliers `10000/15000/22500/33750`; `BagLikeShapeConfig` resolves shape
  `3` to the vertical two-cell array `[[1],[1]]`.
- `hero.HeroConfig.json`: H11 `type=WHEEL`, attack `63`, HP `220`, search range `400`.
- `battle.SkillConfig.json`: `ZL_1101`, allied lowest-HP target, range `9999`, behaviors
  `B_ZL_1101` and `B_ZL_1102`.
- `battle.BehaviorConfig.json`: the two target modes, radius, counts, effect kinds and
  `10000/5000` amounts above.
- `work/production-runtime-analysis/WorkerBar.ts.deobfuscated.js`: WHEEL completion emits
  `CREATE_TOWER_SKILL`; HAMSTER uses the separate persistent-unit event.
- `work/production-runtime-analysis/FightSkillInfo.ts.deobfuscated.js`: `heal` and
  `healHome` both route through the attack-scaled heal formula.
- `work/production-runtime-analysis/FightFormula.ts.deobfuscated.js`: attack source,
  `HL_INC`, final floor and non-negative clamp.
- `work/production-runtime-analysis/SkillUtils.ts.deobfuscated.js`: `LOWEST_HP` means HP
  percentage and uses shuffle-before-sort; range types resolve to target circle/home.

## Deliberate boundary

The baseline implements star-1 `ZL_1101`. Star-gated H11 upgrades (`HEAL_TO_SHIELD`,
`REPLACE_SKILL/ZL_1103`, `HEAL_MORE_TARGER`, and additional `HL_INC`) remain excluded
until the target account's H11 star is evidenced and their complete consumers are joined.
This prevents unevidenced account power from leaking into the representative baseline.
