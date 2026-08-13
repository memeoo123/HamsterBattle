# Orchestration state contract

`ORCHESTRATION_STATE.json` is project-local and append-safe.

```json
{
  "schemaVersion": "1.0",
  "project": {"name": "...", "root": "..."},
  "activeTarget": "wx.../version",
  "targets": {
    "wx.../version": {
      "phase": "discovery",
      "status": "in_progress",
      "platform": "windows",
      "engine": "unknown",
      "acceptanceTarget": "representative-level",
      "authorization": {"status": "pending", "scope": ""},
      "artifacts": {},
      "checks": {},
      "history": []
    }
  }
}
```

## Rules

- Keep one record per AppID/version key.
- Store artifact paths as absolute paths and verify existence on every status call.
- Store artifact fingerprints when recording artifacts. Store dependency fingerprints on
  every passing check and report the check stale when any dependency changes.
- Preserve transition history; do not delete failed checks.
- Require the ordered validation checks: `mechanicsData` first, technical integration
  (`goldenCases`, `assetImport`, `typescript`) next, and `visualBaseline` last. Historical
  targets already marked complete remain historical, but their effective status becomes
  in-progress when checks are stale or their configured acceptance target is not met.
- Keep `acceptanceTarget` separate from achieved `completionLevel`:
  `functional-complete`, `representative-level`, or `battlefield-faithful`.
- Require a valid `battlefieldState` claim for the latter two levels. Generic compile,
  asset, or screenshot checks cannot override battlefield unknowns or blockers.
- Set engine from confirmed reverse evidence, not package filename.
- Require `reverseAnalysisComplete: true` in the recorded reverse manifest before leaving
  `reverse-analysis`; manifest existence alone only proves that progress was recorded.
- Repair state by adding missing fields. Do not rewrite target identity or history unless
  the recorded JSON is demonstrably corrupt and the original is preserved.
- Use explicit `invalidate-check`, `reopen`, and `set-acceptance` operations. A read-only
  status audit must never silently mutate phase or history.
