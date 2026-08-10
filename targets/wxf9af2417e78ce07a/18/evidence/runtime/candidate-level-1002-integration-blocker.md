# Candidate level 1002 integration closure

Date: 2026-08-09

## Result

The release-runtime production chain is now functional. A real 750x1334 Creator 3.8.8
Web Mobile build used the recovered three static batches, normal drag/merge actions, the
P01 round-start skill, trait selection, loss compensation and retry without overriding
combat stats. It passed rounds 1-3 and reached round 6 on each completed attempt. The
bounded 360-second run observed two round-6 losses and began a third round-6 battle; it did
not reach rounds 7-8 or victory.

The earliest remaining gameplay divergence is therefore no longer basic production. It is
the missing representative account/development input needed for the late-wave balance
closure. Level 1002 remains `runtime-ready-unverified`.

## Release-only defects closed

- `POWER:INIT_DATA` equips P01 level 0/star 0. `P01_SKILL_S0` applies
  `PRODUCTIVITY 1000` for 5000 ms at round start, so newly scheduled core quarter-laps and
  occupied-side delays run at productivity `1.1`. This exact window is implemented and
  covered by deterministic production tests.
- Creator 3.8.8 lowered iterable spread on a `Set` as `[].concat(set)`. The connected
  producer lookup consequently received the Set object instead of numeric gear UIDs, so
  release builds registered core contact without applying worker progress. Production now
  returns `Array.from(result)`; the browser trace records 1,986 gear triggers and 1,986
  successful worker applications with zero missing gear/config lookups.
- The same release transform corrupted dynamic candidate families into ids such as
  `[object Set]01` after the static batches. All candidate Set/Map iterator conversions now
  use `Array.from`; the fresh release artifact contains the explicit conversions. The six
  console errors in the bounded manifest were captured before this second correction and
  are retained as root-cause evidence, not treated as a passing closure.

## Interaction boundary

- Round 1 places H13/H12/H01 as a three-side connected component.
- Round 2 merges H13 to level 2.
- Round 3 replaces H01 with vertical H04 and merges H13 to level 3; the resulting grid is
  `P01,H1303,H1201,H0401`.
- Highest recovered round reached: 6 of 8. Completed losses: 2. Peak live self/enemy units:
  2/18. No arbitrary enemy, unit, home, wave, compensation or saved-star value was changed.

## Remaining evidence need

Recover the target account's saved P01 power level and hero-star/unlocked-family values, or
another original capture/profile that proves a late-wave-capable starting state. Do not
weaken the recovered monster table or invent progression values to force a victory.

## Evidence

- `evidence/runtime/candidate-level-1002-closure-fixed-v2/manifest.json`
- `evidence/runtime/candidate-level-1002-closure/manifest.json` (pre-fix round-1 boundary)
- `reverse-work/.../power.PowerConstantConfig.json` (`POWER:INIT_DATA`)
- `reverse-work/.../power.PowerSkillConfig.json` (`P01_SKILL_S0`)
- `work/battlefield-runtime-analysis/formatted/BagLilkePowerSkillManager.ts.deobfuscated.js`
- `work/production-runtime-analysis/BrickShowBaseCom.ts.deobfuscated.js`
- `cocosProject/tests/candidate-level-closure-browser-contract.mjs`
- `cocosProject/tests/battlefield-production.test.mjs`
