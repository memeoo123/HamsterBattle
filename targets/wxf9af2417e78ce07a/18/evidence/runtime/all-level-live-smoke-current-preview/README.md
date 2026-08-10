# Current Creator preview smoke — 2026-08-09

The existing Cocos Creator 3.8.8 process (PID 4363) exposes its own Web Desktop preview
at port 7456, so no competing editor instance was started.

## Confirmed live path

`level-1001.json` records a real canvas interaction using the current editor preview:

- loaded recovered level 1001 with 5 rounds and 8 static batches;
- dragged `H0101` from the candidate tray into a core-adjacent grid cell;
- entered the battle phase;
- observed 6 production triggers and 6 worker applications;
- observed zero missing gear or production configuration lookups.

## Refreshed early/middle/late contract

After the editor refresh, `levels-1001-1100-1200.json` passed against the current compiled
source. All three requested IDs resolved correctly, used a real candidate drag into a
core-connectable cell, started the production battle action, and recorded 6/6 production
triggers/applications with zero missing gear or configuration lookups. The recovered wave
counts were 5, 15 and 15 respectively.

The earlier stale-preview boundary is retained in `level-1001.json` as historical evidence,
but it no longer describes the refreshed 200-level selector build.

## Full-closure boundary found afterwards

The 1001 full-interaction runner then exercised formal drag/merge, trait selection, defeat
and retry for 20 minutes. The original 15-row compensation table reached its 46.33% floor
but the fresh zero-progression profile still stopped at round 3. This prompted two source
changes: consume the recovered level-keyed `staticBuffs` choice and add an explicitly
non-fidelity mechanics-first assist after the first three source-exact retry rows. Pure
tests and TypeScript pass, but the editor must refresh once more before the final victory
run can be accepted; the last browser run visibly selected a random healing card and was
therefore still executing the prior compiled trait module.
