# H01 final-kill attack stacking

Target: `wxf9af2417e78ce07a/18`

Status: confirmed from decoded configuration joined to the version-18 death-event
consumer. The runtime behavior is narrower than the card wording.

## Ability row

`RG_H01_abl03_eff01` is the single row in group `RG_H01_abl03`. It requires H01
star 7, has quality 3, weight 100 and times 1, and is eligible when H01 or H07 is
used. Its effective row is:

```text
effectType = SPECIAL_WORD
param      = [DIE_ZHONG_DIE, 30]
attr       = { ATK_INC: 200 }
```

`BagLikeBuffManager.addSpecialWord` turns this into one shared state object with an
H01/H07 `rangeMap`, the configured attribute map, `maxTimes=30`, and `times=0`.

Evidence:

- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityConfig.json:100`
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectConfig.json:620`
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectiveConfig.json:223`
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BagLikeBuffManager.ts.deobfuscated.js:251`

## Final-kill event, not participation

The card says that any warrior “participating” in a defeat should count. The runtime
does not carry an assist or participant list. `MonsterUnit.onDie` resolves exactly one
`killerId` from the damage caster's `attrHeroId` or the live caster unit's hero config,
then synchronously emits `BATTLE_MONSTER_DIE` with that value.

`BagLikeBuffModel` passes only this `killerId` to `tryDieZhongDie`. A stack is added
only when the id exists, belongs to the H01/H07 range map, and the shared counter is
below 30. An H02/H03/H04 final blow therefore contributes no stack even when an H01
unit previously damaged the same monster.

Evidence:

- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/MonsterUnit.ts.deobfuscated.js:67`
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/MonsterUnit.ts.deobfuscated.js:74`
- `targets/wxf9af2417e78ce07a/18/work/round-home-heal-analysis/BagLikeBuffModel.ts.deobfuscated.js:3`

## Shared live attribute behavior

After a qualifying final kill, `tryDieZhongDie` increments the shared counter and calls
`exAttrMgr.addSpecialHeroAttr` for every id in the range map. Consequently one H01 or
H07 final kill grants both H01 and H07 another `ATK_INC +200` layer. The state is not
stored on the killing unit.

`BattleUnit.getAttrValue(ATK)` reads the current attribute layer whenever attack is
resolved:

```text
attack = base attack * max(0, 1 + (ATK_INC - ATK_DEC) / 10000)
```

Thus, absent another attack modifier, stack 1 is 102%, stack 2 is 104%, and stack 30
is 160% attack. The live lookup affects already-created and later-created H01/H07 units
and survives normal round unit cleanup; it resets when the full BagLike battle state is
reinitialized.

Evidence:

- `targets/wxf9af2417e78ce07a/18/work/round-home-heal-analysis/BagLikeBuffModel.ts.deobfuscated.js:3`
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BattleUnit.ts.deobfuscated.js:91`

## Reconstruction contract

- Default `h01HeroStar=1` keeps the row out of the evidence-safe pool.
- H01 star 7 exposes the one-time row when H01/H07 is used.
- Selecting the row starts a shared zero-stack H01/H07 counter.
- Only the final damage caster's H01/H07 identity increments it.
- Each stack adds 200 basis points to live H01/H07 attack; unrelated heroes are unchanged.
- The counter caps at 30, persists across rounds, and resets on a full level restart.
