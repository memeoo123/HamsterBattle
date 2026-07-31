# Handoff contracts

## Package metadata handoff

Accept locator or inventory schema `2.0`. Require:

```json
{
  "appId": "wx...",
  "version": "version folder",
  "mainPackage": "absolute path or null",
  "relatedPackages": [],
  "confidence": "high | medium | low",
  "evidence": "before-after-filesystem-metadata-diff",
  "classification": "unknown-from-metadata",
  "contentRead": false
}
```

Treat the handoff as target-location evidence, not authorization to unpack and not proof
of a product title.

## Reverse manifest

Store target identity, authorization scope, immutable source paths/hashes, generated
artifacts, commands, engine evidence, and current stage in `manifest.json`. Use paths
relative to the target root for generated artifacts.

## RESTORE_SPEC.json

Use this top-level structure:

```json
{
  "schemaVersion": "1.0",
  "target": {"appId": "wx...", "version": "...", "engine": "cocos", "engineVersion": "..."},
  "design": {"width": 0, "height": 0, "orientation": "portrait"},
  "representativeLevel": {},
  "scene": {"anchors": [], "layers": [], "uiHierarchy": []},
  "assets": [],
  "entities": [],
  "spawners": [],
  "combat": {},
  "rounds": [],
  "goldenCases": "golden-cases.json",
  "unknowns": [],
  "evidenceIndex": {}
}
```

Represent nontrivial scalar values as:

```json
{"value": 500, "status": "confirmed", "evidence": ["K-021"]}
```

Use `inferred` only for conclusions supported by multiple indirect observations. Add an
explicit verification action to every `unknown`.

## Implementation gate

Set `implementationReady: true` only when the representative level has:

- confirmed gameplay phases and objective;
- confirmed coordinate anchors;
- complete wave schedule;
- complete regular-damage equation;
- mapped critical assets or documented fallbacks;
- at least three numeric golden cases.

