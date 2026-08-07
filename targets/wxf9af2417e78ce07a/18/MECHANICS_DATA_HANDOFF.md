# Mechanics and data handoff

Updated: 2026-08-07

## Authority and scope

- Active target: `wxf9af2417e78ce07a/18`
- Representative level: `1004 / 荒漠沙地`
- Resolution and flow baseline: `750 × 1334`, 15 waves
- Orchestration phase: `validation / in_progress`
- Machine-readable authority: `BATTLEFIELD_RESTORE_STATE.json`
- Current user priority: mechanics and data first. Do not spend the next work slice on
  exact effect FPS, audio volume, typography, pixel layout, or other presentation polish.
- Completion claim remains `incomplete`. Do not mark representative-level or battlefield-
  faithful until the battlefield gates in the state file pass.

## Current completion estimate

- Level 1004 mechanics/data: approximately `75%–80%` restored.
- Full parsed in-stage system across roughly 200 levels: approximately `50%–55%` restored.
- These are planning estimates, not gate results. The four formal battlefield gates remain
  pending.

## Confirmed and implemented baseline

- Phase loop: deploy, battle, trait selection, round clear, victory, defeat, retry.
- Preparation: static/dynamic deals, normal/ad refresh economy, candidate lifecycle,
  multi-cell placement, occupied replacement/return, 1–4 merge, six level-5 recipes and
  star gates.
- Dynamic preparation rewards: account-family input filtering, coin-gear count
  (`1/2/4/8`) and reward-3034 weight decay, five tracked hero-family cap/fill, and forced
  reward-3030 grid candidate on every seventh non-ad refresh when applicable.
- Production: power-core contact graph, 100-point worker progress, fractional remainder,
  0.75-second HAMSTER output, H12/H13 WHEEL routing, coin payout, 1.5× battle speed, and
  direct-core-neighbor attack/worker modifiers.
- H11 healing gear: four level profiles, 9-point worker progress, 0.25-second WHEEL
  completion, lowest-friendly-HP% targeting, radius-200 unit healing at 100% attack,
  paired base repair at 50% attack, caps/flooring, and the untracked-family candidate
  exception. The star-2 `RG_H11_abl02_eff01` converts full or overflow unit healing into
  additive shield consumed before HP; `HomeUnit` keeps base repair as normal healing. The
  star-5 `RG_H11_abl01_eff02` row replaces later casts with `ZL_1103`:
  unit healing and the living-friendly-target requirement remain unchanged, while paired
  base repair rises to 100% attack. The star-7 `RG_H11_abl03_eff01` row can be drawn and
  consumed once, but version 18's `addEffective` switch has no `HEAL_MORE_TARGER` branch
  and no id/times-based side consumer; it is therefore preserved as a runtime no-op and
  `B_ZL_1101` remains single-target. The evidence-safe account default remains H11 star 1.
- H12 paralysis replacement: the star-1 `LY_1202` and star-3 `LY_1203` variants share
  the original 500-ms delayed 5000-ratio, radius-50, five-target area damage and add
  one/two seconds of `dizziness` to the primary random target. Highest-qualified group
  selection, control immunity and non-shortening reapplication are connected; the
  evidence-safe default H12 star is 1 until the target account proves otherwise.
- H12 guaranteed critical: the star-2 `RG_H12_abl02_eff01` adds `CRI_RATE=10000`
  to the decoded H12/H08 hero scope. Dodge remains first and retains the half-damage miss
  branch; a non-dodge uses the base 15000 critical factor. Damage RNG now follows the
  recovered lazy order for dodge, forced critical and attribute critical checks.
- H12 critical damage: the star-7 `RG_H12_abl03_eff01` adds `CRI_DMG=5000` to
  H12/H08, clamped to the recovered 25000 attribute maximum. It does not add critical
  chance; an actual critical uses 20000 rather than 15000 as its damage factor.
- H12 electrified: the star-10 `RG_H12_abl04_eff01` replaces the shared `LY_1201`
  group with `LY_1204`. The last selected H12 replacement wins, so it can replace or be
  replaced by paralysis. Its persistent layer-1 `DMG_RES=-1000` clamps to zero on the
  current level targets and therefore does not justify an invented 10% multiplier.
- H13 corn bounce count: `TZ_1301` uses a speed-1000 BounceBullet with two base
  follow-up bounces, one-target 3500-ratio impacts, a shared hit map and nearest-unvisited
  routing inside a strict 300 radius. The star-2/star-3 `RG_H13_abl01` rows add two/four
  `BOUNCE_TIMES` to H13/H09, yielding four/six follow-up bounces.
- H13 popcorn replacement: the star-7/star-10 `RG_H13_abl02` rows replace later
  H13/H09 launches with `TZ_1302/TZ_1303`. Each follow-up segment compounds inherited
  attack by 10%. `TZ_1303` configures a radius-50 final explosion, but version 18 checks
  `last_missile` while the child bounce counter is still reset to zero and copies the
  parent counter afterwards, so the explosion is a confirmed runtime no-op.
- H02 split shot: the star-3/star-5/star-10 `RG_H02_abl02` rows select only the
  highest qualified 3000/5000/10000 probability for H02/H07. `ConType_2` runs before
  the main skill action; on success it randomly selects one enemy, including the main
  target, from the caster-centered radius-250 set and launches an independent speed-700,
  10000-ratio projectile. The evidence-safe default H02 star remains 1.
- H02 barrage time: the star-7/star-8 `RG_H02_abl03` rows select only the highest
  qualified variant and append active skill `2001_5/2001_6` to later-created H02/H07.
  After a 6000-ms pre-cooldown, the reachable skills cast for 2000/3000 ms and launch
  nine/six speed-700, 5000-ratio missiles at their locked target. The star-8 row's
  configured 3500-ms seventh behavior is removed at the 3000-ms cast boundary. The
  separate 3/4-second `ATK_SPD=30000` Buff groups have no inbound runtime edge and are
  not applied; this card/config disconnect is preserved.
- H03 transform: the star-7/star-8 `RG_H03_abl03` rows select only the highest
  qualified variant and add `3001_3/3001_4` to later-created H03/H08 units.
  Each ordinary-hit damage event applies a 2000-ms changed-model Buff to the hit target.
  Star 7 adds control-immune-aware dizziness; star 8 replaces both the row and abnormal
  component with `DMG_INC=3000`. Version 18 reads that attribute from the transformed
  target when it later attacks, so the target deals 30% more damage rather than receiving
  30% more as the card claims. This runtime disconnect is preserved, and the evidence-safe
  default H03 star remains 1.
- H03 penetrating laser: the star-10 `RG_H03_abl04_eff01` row appends active skill
  `3001_5` to later-created H03/H08 units. It takes priority over their basic skill when
  ready, moves into the strict 50-unit cast range, casts for 1000 ms, and fires behavior
  `bh3001_5` at 300 ms. That behavior starts the 4000-ms cooldown and directly deals a
  5000-ratio hit to at most 999 enemy centers inside an inclusive 100-by-300 forward
  rectangle aimed at the locked target. Collision input order is preserved. Control before
  300 ms cancels without cooldown; interruption after the behavior keeps cooldown. H0301
  and H0805 both carry the recovered `skill01` animation. The configured `skill_jiguang`
  audio asset is absent from current and recovered trees and remains a presentation gap.
- H04 knight vitality: the star-2/star-3 `RG_H04_abl02` rows select only the highest
  qualified variant and add `4001_1/4001_2` to later-created H04/H09 units. After the
  first 1000 ms, `ConType_6` repeats every 1000 ms against self. Despite max-HP wording,
  version 18 routes amounts 200/500 through generic attack-scaled `heal`, applies
  `HL_INC`, floors, and clamps to max HP; a level-1 H04 therefore heals 1/2 HP per tick.
  Passive time continues while attack/movement AI is frozen.
- H01 final-kill attack stacking: the star-7 `RG_H01_abl03_eff01` row is selectable once
  and shares a live `ATK_INC=200` stack across H01/H07. The shipped death event exposes
  one resolved killer ID and no assist list, so the card's “participated in a kill” wording
  is implemented as final blow only. Each qualifying kill adds 2% attack to current and
  future H01/H07 units, caps at 30 stacks (+60%), survives ordinary round cleanup, and
  resets only when the whole battle is initialized again.
- H04 attack kill-fly: the star-8 `RG_H04_abl04_eff01` row adds
  `ATTACK_KILL_FLY/3000` to the H04/H09 scope. Only basic `ATTACK` hits against a
  non-Boss MonsterUnit with `canKillFly=true` consume the inclusive 0-10000 roll. A
  success returns shipped status `Kill` and value `999999` before dodge, critical and
  regular damage; Boss and active-skill paths consume no feature RNG.
- H04 shield wall: the star-7/star-10 `RG_H04_abl03` rows select only the highest
  qualified variant and add `4001_3/4001_4` to later-created H04/H09 units. Every
  5000 ms they add a 2000 ms `DMG_RES=3000` Buff; the star-10 variant also reflects
  `floor(resistance-adjusted pre-floor damage * 3000/10000)` before original-hit
  shield/HP application. Reflected damage below 1 stays zero and cannot recurse.
- Combat kernel: recovered target selection, movement, strict range boundaries, attack
  delay/cooldown, typed resistance, dodge/critical paths, projectile lifetime boundaries,
  H09/H13 base and feature-extended bounce chains, death, wave scaling, and loss compensation.
- Level data: level 1004's 15 schedules, monsters, bosses, multipliers, EXP thresholds,
  victory/defeat and in-session retry flow.
- Restored trait consumers include random gear upgrade, EXP gain, enemy attack decrease,
  power-neighbor attack/worker increases, immediate/round-start home healing, and H01
  star-gated combo critical, H03 transform, plus the H12 star-gated paralysis, guaranteed-critical,
  critical-damage and electrified consumers, plus the H13 bounce-count and popcorn
  replacement consumers, and the H04 star-gated periodic self-heal consumer.

## Automated baseline

- Golden cases: `47/47` (current `golden-cases.json` case count).
- Rule/resource assertions logged by the 13 test scripts: `871/871`.
- Dynamic preparation assertions: `40/40`.
- Healing/shield/H04-periodic assertions: `42/42`.
- H12 replacement/status assertions: `15/15`; trait-pool assertions including H01 final-kill stacking, H02 split shot/barrage, H03 transform/laser, H04 kill-fly/shield-wall, H12 and H13
  star-gated consumers and all three H11 rows: `240/240`; combat kernel including H02 split-shot selection and barrage timing/disconnect, H03 transform duration/immunity/runtime attribute direction plus laser timing/rectangle selection, H04 kill-fly gating and shield-wall timing/order, lazy RNG, H12's 20000 critical
  factor, H13's 2/4/6 bounce limits, popcorn compounding and the last-missile disconnect:
  `109/109`.
- Creator 3.8.8 TypeScript (`--noEmit --skipLibCheck true`): pass.
- Battlefield state schema validation: pass.
- The successful numbers do not close evidence, deterministic, integration, or matched-
  replay gates; incomplete content is deliberately excluded rather than represented by
  inert fake effects.

## Remaining mechanics/data work, in order

1. **BagLike ability consumers and exact ordering**
   - The source table contains 78 effect rows; 53 can affect the currently represented
     H01/H02/H03/H04/H11/H12/H13 families. All 53 rows are modeled in 41 mutually
     exclusive groups, including two evidence-confirmed runtime no-ops.
   - Next: continue through same-frame ordering, RNG order and remaining condition handlers;
     no currently known represented-family effect row remains unrouted.
2. **Account-derived mechanics data**
   - Obtain the competitor account's exact unlocked hero set and hero-star values.
   - Apply those values to trait eligibility and level-5 fusion gates.
   - Recover any remaining verify/condition branches and the actual ad completion boundary
     for reroll/take-all.
3. **Exact event/RNG order**
   - Recover first power-core contact phase.
   - Lock same-frame spawn, movement, target, cast, impact, death, reward, EXP, wave-clear
     and phase-transition order.
   - Lock RNG call order for hit, critical, equal-distance target paths and spawn offsets.
4. **Persistence and edge cases**
   - Simultaneous deaths, pending hits after attacker/target removal, process-restart defeat
     count, and any modal phase that can interrupt a wave.
5. **Integration gate**
   - Run deploy → waves 1–15 → victory and defeat → retry → compensation without manual
     state edits; capture event traces before returning to visual work.

## Broader full-system work after level 1004

- Restore remaining base/fusion families, including H05, H06, H10, H11 and H14–H18.
- Restore the remaining monster/Boss special behaviors and special-mode consumers.
- Apply the already decoded schedules/configuration across the roughly 200 parsed levels;
  decoded rows alone do not prove their runtime behavior.

## Exact resume point

Start with the next simulation-affecting BagLike ability consumer, not presentation:

1. Run the reconstruction orchestrator `status`.
2. Read `BATTLEFIELD_RESTORE_STATE.json`, this handoff, and
   `evidence/runtime/baglike-preparation-dynamic-rewards.md`.
3. Select the next ability group from the decoded tables and route its runtime/schema
   recovery through `wechat-minigame-reverse-expert`.
4. Record a runtime evidence note before implementation.
5. Route the Cocos implementation through `cocos-minigame-restorer`; keep logic in a pure
   TypeScript module with injectable clock/RNG where applicable.
6. Add focused deterministic tests, run the entire `tests/*.test.mjs` suite, Creator 3.8.8
   TypeScript, and the battlefield-state validator.
7. Update `REVERSE_PROGRESS.md`, `cocosProject/RESTORE_PROGRESS.md`,
   `cocosProject/VALIDATION_REPORT.md`, and `BATTLEFIELD_RESTORE_STATE.json` together.

## Validation commands

```shell
python3 skills/wechat-minigame-reconstruction-orchestrator/scripts/orchestrate.py status \
  --project-root .

for test_file in cocosProject/tests/*.test.mjs; do
  node --experimental-strip-types "$test_file"
done

python3 skills/cocos-minigame-restorer/scripts/check_cocos_project.py cocosProject \
  --creator-root "<Creator.app>/Contents"

python3 skills/wechat-minigame-battlefield-restorer/scripts/validate_battlefield_state.py \
  targets/wxf9af2417e78ce07a/18/BATTLEFIELD_RESTORE_STATE.json
```

Pass the local Cocos Creator 3.8.8 application `Contents` directory to `--creator-root`.
Repository skills, scripts, evidence and source references must continue to use
repository-relative paths.
