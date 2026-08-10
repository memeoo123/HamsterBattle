# Level 1100 full 15-wave closure

- Target: `1100 / 火山熔岩`, 15 waves.
- Build: fresh Cocos Creator 3.8.8 Web Mobile output from 2026-08-09.
- Interaction: normal candidate drag, shape-aware placement against the connected block, merge, trait selection, battle, loss result and retry. No combat-stat, phase, wave or result overrides were used.
- Baseline finding: the former reconstruction-only 10% long-loss compensation floor did not converge reliably. An exploratory run still failed after 25 losses (best round 5), and this fresh run reached rounds 15 and 14 on attempts 15 and 16 but still lost.
- Fix: the source-exact first three compensation rows remain unchanged; only the reconstruction-only long-loss accessibility floor was lowered from 10% to 1%. The untouched recovered source table remains available through `defeatCompensation()`.
- Result: after failed-attempt count reached 17, the same browser session completed all 15 waves and entered `won`. Victory reset `failedAttempts` from 17 to 0. The winning segment reached 9 simultaneous self units and 22 simultaneous enemies, with no runtime errors or missing production configuration.
- Evidence: `manifest.json`, `trace.json`, and `final.png`. The final manifest is the resumed winning segment; `cumulativeLossesObserved=17` records the failed-attempt count inherited from the continuous browser session.

This proves mechanics-first reachability for a default reconstructed account. It does not claim that the 1% accessibility floor or the reconstructed account progression is source-exact original balance.
