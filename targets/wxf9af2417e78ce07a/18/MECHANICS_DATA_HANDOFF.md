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

- Level 1004 mechanics/data: approximately `70%–75%` restored.
- Full parsed in-stage system across roughly 200 levels: approximately `45%–55%` restored.
- These are planning estimates, not gate results. The four formal battlefield gates remain
  pending.

## Confirmed and implemented baseline

- Phase loop: deploy, battle, trait selection, round clear, victory, defeat, retry.
- Preparation: static/dynamic deals, normal/ad refresh economy, candidate lifecycle,
  multi-cell placement, occupied replacement/return, 1–4 merge, six level-5 recipes and
  star gates.
- Dynamic preparation rewards: account-family input filtering, coin-gear count
  (`1/2/4/8`) and reward-3034 weight decay, five tracked hero-family cap/fill, and forced
  reward-3030 grid candidate on every seventh non-ad refresh when applicable. H11 is the
  confirmed account-lock-filter exception and is enabled in the official candidate pool.
- Production: power-core contact graph, 100-point worker progress, fractional remainder,
  0.75-second HAMSTER output, H12/H13 WHEEL routing, coin payout, 1.5× battle speed, and
  direct-core-neighbor attack/worker modifiers.
- Combat kernel: recovered target selection, movement, strict range boundaries, attack
  delay/cooldown, typed resistance, dodge/critical paths, projectile lifetime boundaries,
  H0905 two-bounce chain, death, wave scaling, and loss compensation.
- Level data: level 1004's 15 schedules, monsters, bosses, multipliers, EXP thresholds,
  victory/defeat and in-session retry flow.
- Restored trait consumers include random gear upgrade, EXP gain, enemy attack decrease,
  power-neighbor attack/worker increases, immediate/round-start home healing, and H01
  star-gated combo critical.
- H11 healing vertical slice: H1101–H1104 power/multipliers, 0.25-second WHEEL completion,
  lowest-HP-percentage live-friendly targeting, attack-derived unit/home healing, floor and
  max-HP clamps. Unproven account-star extensions remain disabled.

## Automated baseline

- Golden cases: `47/47`.
- Production rule/resource assertions: `564/564`.
- Dynamic preparation assertions: `40/40`.
- H11 healing assertions: `43/43`.
- Creator 3.8.8 TypeScript (`--noEmit --skipLibCheck true`): pass.
- Battlefield state schema validation: pass.
- The successful numbers do not close evidence, deterministic, integration, or matched-
  replay gates; incomplete content is deliberately excluded rather than represented by
  inert fake effects.

## Remaining mechanics/data work, in order

1. **Remaining BagLike ability consumers**
   - The source table contains 78 effect rows; about 53 can affect the currently represented
     H01/H02/H03/H04/H11/H12/H13 families. About 23 are modeled, leaving at least about 30
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

- Restore remaining base/fusion families, including H05, H06, H10 and H14–H18.
- Restore the remaining monster/Boss special behaviors and special-mode consumers.
- Apply the already decoded schedules/configuration across the roughly 200 parsed levels;
  decoded rows alone do not prove their runtime behavior.

## Exact resume point

Start with the remaining simulation-changing BagLike ability consumers, not presentation:

1. Run the reconstruction orchestrator `status`.
2. Read `BATTLEFIELD_RESTORE_STATE.json`, this handoff, and the existing runtime evidence
   notes for the next selected effect family.
3. Route runtime/schema recovery through `wechat-minigame-reverse-expert` and record an
   evidence note before implementation.
4. Route the Cocos implementation through `cocos-minigame-restorer`; keep logic in a pure
   TypeScript module with injectable clock/RNG where applicable.
5. Add focused deterministic tests, run the entire `tests/*.test.mjs` suite, Creator 3.8.8
   TypeScript, and the battlefield-state validator.
6. Update `REVERSE_PROGRESS.md`, `cocosProject/RESTORE_PROGRESS.md`,
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
