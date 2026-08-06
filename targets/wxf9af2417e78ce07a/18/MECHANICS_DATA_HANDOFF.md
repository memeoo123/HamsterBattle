# Mechanics and data handoff

Updated: 2026-08-06

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
  exception. Star-gated H11 upgrades remain excluded without target-account evidence.
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
- Combat kernel: recovered target selection, movement, strict range boundaries, attack
  delay/cooldown, typed resistance, dodge/critical paths, projectile lifetime boundaries,
  H0905 two-bounce chain, death, wave scaling, and loss compensation.
- Level data: level 1004's 15 schedules, monsters, bosses, multipliers, EXP thresholds,
  victory/defeat and in-session retry flow.
- Restored trait consumers include random gear upgrade, EXP gain, enemy attack decrease,
  power-neighbor attack/worker increases, immediate/round-start home healing, and H01
  star-gated combo critical, plus the H12 star-gated paralysis, guaranteed-critical,
  critical-damage and electrified consumers.

## Automated baseline

- Golden cases: `47/47`.
- Rule/resource assertions logged by the 12 test scripts: `604/604`.
- Dynamic preparation assertions: `40/40`.
- H11 healing assertions: `19/19`.
- H12 replacement/status assertions: `15/15`; trait-pool assertions including H12 paralysis,
  guaranteed critical, critical damage and electrified: `110/110`; combat kernel including lazy RNG
  and the H12 20000 critical factor: `38/38`.
- Creator 3.8.8 TypeScript (`--noEmit --skipLibCheck true`): pass.
- Battlefield state schema validation: pass.
- The successful numbers do not close evidence, deterministic, integration, or matched-
  replay gates; incomplete content is deliberately excluded rather than represented by
  inert fake effects.

## Remaining mechanics/data work, in order

1. **Remaining BagLike ability consumers**
   - The source table contains 78 effect rows; about 50 can affect the currently represented
     H01/H02/H03/H04/H12/H13 families. 33 are modeled, leaving at least about 17
     relevant rows/groups to route and implement.
   - Prioritize behaviors that change simulation: add/replace skills, passives, multi-target,
     periodic effects, control, stacking, refresh, immunity and condition handlers.
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
