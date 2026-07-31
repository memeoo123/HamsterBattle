# Restoration contract

## Required artifacts

- `RESTORE_SPEC.json`: evidence-backed scene, entities, assets, formulas, and rounds.
- `golden-cases.json`: deterministic expected behavior.
- original screenshots or recordings for visual claims.
- recovered assets plus source-to-output mapping.

## Evidence-bearing values

Represent important values as:

```json
{"value": 500, "status": "confirmed", "evidence": ["K-021"]}
```

Allowed status values are `confirmed`, `inferred`, and `unknown`. Every `unknown` must
include a verification action. Do not hide unknowns behind default values.

## Ready gate

`implementationReady` may be true only when the representative level has:

- complete gameplay phases and objective;
- design resolution and stable coordinate anchors;
- exact wave identities/timestamps;
- unit/base attributes and creation intervals;
- regular damage equation and modifier order;
- mapped critical visuals or explicit approved fallbacks;
- three or more passing numeric golden cases.

## Suggested asset entry

```json
{
  "id": "fightscene_01",
  "kind": "sprite",
  "source": "absolute or evidence-relative path",
  "target": "assets/resources/original/fightscene_01.jpg",
  "status": "confirmed",
  "evidence": ["K-042"]
}
```
