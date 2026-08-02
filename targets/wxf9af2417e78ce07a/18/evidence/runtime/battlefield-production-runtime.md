# Battlefield production runtime evidence

Target: `wxf9af2417e78ce07a/18`.

The source package remains preserved under `reverse-work/unpacked/`. The files under
`work/production-runtime-analysis/` are extracted, formatted inspection aids from that package.

## Power-core scheduling

- `BagLilkePowerUtils.ts.deobfuscated.js` resolves the four orthogonal sides of the power core.
  Each occupied side triggers every worker in that side's orthogonally connected component. If
  one component touches two core sides, every worker in that component is triggered twice per lap.
- `baglike.BagLikeItemConfig.json` defines `P01.params` as `1000, 200, 10000`: a 1000 ms lap,
  200 ms delay for each occupied-side contact, and a 10000 productivity multiplier.
- The displayed output rate is
  `powerPerTrigger * contactCount / ((1 + 0.2 * contactCount) / productivity) / 100`.
  An unconnected gear has zero production.
- `BagLikeConstantConfig` sets `BATTLE_SPEED_UP_MULTIPLE=15000`; the original toggle is 1x/1.5x.

## Worker progress and outputs

- `WorkerBar.ts.deobfuscated.js` resets worker progress to zero when a round starts. A power event
  adds the configured amount; reaching 100 emits one completion and preserves modulo remainder.
  There is no immediate output at battle start.
- `WorkerBar` assigns the same recovered hero-head frame to `iconComp.bg` and `iconComp.bar`, then
  sets `bar.fillAmount = value / 100`. The latest battle capture
  (`capture/255d5eb5-7534-43db-a0aa-85a9d6b6a7ec.png`) confirms the resulting presentation:
  a dark unfilled portrait with its full-color foreground filling vertically from the bottom.
  This is the visible worker percentage; there is no numeric percent text on the original gear.
- Hero values in `BagLikeItemConfig.params` are per-trigger worker power, not seconds: H01=10,
  H02=8, H03=7, H04=6, H12=20, and H13=15. Coin gears use 3 per trigger.
- Worker completion animation lasts 0.25 seconds. `BagLikeEffectContainer.ts.deobfuscated.js` and
  `BagLikeEffectIcon.ts.deobfuscated.js` then give HAMSTER output a 0.5-second flight before the
  actual `CREATE_HERO_UNITS` event. The original HAMSTER spawn point is x=-300 and y=random(0,150).
- Coin gears pay 2/4/8/16 after worker completion. Their `3` is progress per power trigger, not a
  three-second interval.
- WHEEL producers H12/H13 do not create permanent battlefield units. Completion emits one tower
  skill from the placed gear position; `TowerSkillUtils.actionSkill` resolves that one-shot action.
- No maximum-alive gate exists in the recovered production event chain.

## Reconstruction mapping

`cocosProject/assets/scripts/BattlefieldProduction.ts` isolates connectivity, rate, and progress
semantics. `CangshuGame.ts` drives the core one side at a time, queues the original completion
delays, spawns HAMSTER units at the recovered offset, and emits H12/H13 as one-shot tower skills.
