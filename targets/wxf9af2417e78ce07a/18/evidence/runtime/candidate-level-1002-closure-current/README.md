# Level 1002 full closure

- Captured: 2026-08-09, Creator 3.8.8 Web Mobile Release build, 750×1334.
- Scope: recovered static batches, normal drag/merge, trait selection, loss result, retry, mechanics-first defeat compensation, all eight waves, and final victory.
- No combat-stat, HP, wave, phase, or result override was used.

The first runner segment began at a fresh session and ran for 600 seconds. It observed four formal losses, reached wave 5, and timed out during the next attempt. A resume segment retained the browser session at `failedAttempts=4`: that attempt reached wave 8 and lost, then the following attempt completed all eight waves and entered `won` at 361/1375 HP and 80 gold. Victory correctly reset `failedAttempts` from 5 to 0.

Across the winning attempt, all three placed producer progress bars remained visible and their portraits loaded. The final trace records 5,916 gear triggers and 5,916 worker applications, with `powerMissingGear=0`, `powerMissingConfig=0`, and no browser runtime or project-console errors.

The raw resumed-run manifest reports `initialFailedAttempts=4` and `losses=1`; together these are the five losses retained by this continuous browser session. Older runner code wrote `cumulativeLossesObserved` from the post-victory counter and therefore shows 0 because victory intentionally clears it. The runner has been corrected to derive future cumulative counts as `initialFailedAttempts + losses`.

This is a deterministic minimal-loadout accessibility fixture: after the three recovered static batches it discards later candidates instead of optimizing the board. It proves that the production state machine and mechanics-first compensation converge without artificial combat overrides; it does not claim to reproduce the unknown target account's exact P01 level, hero stars, or unlock state.
