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
- Preserve transition history; do not delete failed checks.
- Require the ordered validation checks: `mechanicsData` first, technical integration
  (`goldenCases`, `assetImport`, `typescript`) next, and `visualBaseline` last. Historical
  targets already marked complete remain historical; active targets must satisfy the
  current checks before advancing.
- Set engine from confirmed reverse evidence, not package filename.
- Require `reverseAnalysisComplete: true` in the recorded reverse manifest before leaving
  `reverse-analysis`; manifest existence alone only proves that progress was recorded.
- Repair state by adding missing fields. Do not rewrite target identity or history unless
  the recorded JSON is demonstrably corrupt and the original is preserved.
