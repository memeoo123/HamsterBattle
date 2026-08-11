# Local mock advertisement adapter validation

Date: 2026-08-11

## Scope

The user explicitly authorized fake advertisement data for the reconstructed project. This
adapter is a local functional substitute, not evidence of the original WeChat advertisement
SDK implementation.

## Implemented placements

- Endless trial third daily attempt: the challenge starts and spends energy only after a
  completed mock advertisement.
- Battle preparation advertisement refresh: a completed view consumes the one refresh and
  replaces candidates; cancellation/failure leaves both unchanged.
- Trait reroll and take-all: their recovered per-battle limits are consumed only after a
  completed view.
- Energy shop good `104002`: grants the recovered `10` energy, persists a natural-day limit
  of three completed views, and never grants on cancellation/failure.
- Daily task `1005` displays the local completed-view count. Other server-owned daily task
  state remains unavailable and is not fabricated.

Advertisement good `101002` remains disabled because its random chest reward pool is not
recovered. This avoids turning permission to mock the advertisement callback into permission
to invent a gameplay reward.

## Test controls

- Default or `?mockAd=success`: complete after 800 ms.
- `?mockAd=cancel`: return cancellation after 550 ms.
- `?mockAd=fail`: return failure after 550 ms.

The canvas publishes `mockAdBusy`, `mockAdPlacement`, `mockAdOutcome`, and `mockAdViews` for
repeatable browser checks. Persistent state uses `hamsterBattle.mockAdvertisement.v1` and
resets daily counters by the local natural date while retaining the lifetime total.

## Validation

- Dedicated pure adapter and integration-contract test: pass.
- Full test-file run: `43/43` pass.
- Restore spec: ready; Golden cases: `47/47` pass.
- Creator 3.8.8 bundled TypeScript: pass with project `tsconfig.json`, `--noEmit`, and
  `--skipLibCheck true`.
- Cocos project checker: `184` assets, `0` missing metadata.
- Fresh Creator 3.8.8 Web Mobile build at 14:43 reached
  `build Task (web-mobile) Finished in (7 s)`.
- 750×1334 browser success check: energy `40 → 50`, completed-view count `1 → 2`, and
  `mockAdBusy=false` after completion.
- 750×1334 browser cancellation check: energy stayed `50`, completed-view count stayed `2`,
  and outcome was `cancelled`.
- Browser warning/error count: `0/0`.
