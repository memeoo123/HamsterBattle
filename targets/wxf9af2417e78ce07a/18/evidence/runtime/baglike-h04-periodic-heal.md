# H04 knight-vitality periodic heal

Target: `wxf9af2417e78ce07a/18`

Status: confirmed from decoded configuration joined to the version-18 runtime consumer.

## Ability rows

`baglike.BagLikeAbilityEffectConfig` and
`baglike.BagLikeAbilityEffectiveConfig` define one mutually exclusive group:

| Row | H04 star | Draw values | Scope | Added skill |
|---|---:|---|---|---|
| `RG_H04_abl02_eff01` | 2 | quality 3, weight 100, times 1 | H04/H09 | `4001_1` |
| `RG_H04_abl02_eff02` | 3 | quality 3, weight 100, times 1 | H04/H09 | `4001_2` |

The later, highest star-qualified row is the only row from `RG_H04_abl02` that enters
the draw pool. Both effect rows use `ADD_PASSIVITY_SKILL`; the runtime stores the added
skill in `exSkillMgr`, so it is read when later H04/H09 units construct their skill set.
It does not retroactively rebuild already-created units.

Evidence:

- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectConfig.json:945`
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectiveConfig.json:330`
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/BagLikeBuffManager.ts.deobfuscated.js:3`

## Periodic trigger

`4001_1/4001_2` are passive skill wrappers containing `4001_p1/4001_p2`.
Both inner passives use condition 6 with `interval=1000` and `cd=1000`; after the first
one-second interval they repeatedly dispatch `4001_bh1/4001_bh2`. The behavior range is
`SELF`, so the caster is the only target. Passive cooldown updates occur with the unit's
skill update and are not stopped by movement/attack-control status; the reconstruction
therefore advances this timer before its frozen-AI early return.

Evidence:

- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.SkillConfig.json:2890`
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.PassivitySkillConfig.json:476`
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.BehaviorConfig.json:1358`
- `targets/wxf9af2417e78ce07a/18/work/targeting-movement-support/PassivitySkillData.ts.deobfuscated.js:3`
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/SkillUtils.ts.deobfuscated.js:147`

## Version-18 numeric behavior

The card copy says “2%/5% of maximum HP”, but the connected behaviors are literally
`effectType=heal` with amounts `200/500`. `FightSkillInfo.heal` sends that amount through
the generic attack-scaled heal path, not `healMaxHp`. `FightFormula.heal` consequently
computes:

```text
raw heal = floor(max(0, caster attack × amount / 10000 × (1 + HL_INC / 10000)))
applied heal = min(raw heal, target max HP - target HP)
```

There is no minimum-one rule. For the restored level-1 H04 attack of 51 this yields 1 HP
for `4001_bh1` and 2 HP for `4001_bh2`, not 4/9 HP from the 179 maximum-HP card wording.
The reconstruction preserves this observed configuration/runtime disconnect.

Evidence:

- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/FightSkillInfo.ts.deobfuscated.js:94`
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/FightFormula.ts.deobfuscated.js:107`
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BattleUnit.ts.deobfuscated.js:102`

## Reconstruction contract

- Default `h04HeroStar=1` keeps both rows out of the evidence-safe baseline.
- At H04 star 2, future H04/H09 units receive a one-second self-heal timer with ratio 200.
- At H04 star 3 or above, only the ratio-500 variant is drawable.
- The first heal occurs after one full interval; no immediate spawn heal is emitted.
- Timer catch-up is deterministic for elapsed simulation time and pauses with the battle.
- Healing continues while the unit's attack/movement AI is frozen and clamps at max HP.
