# Battlefield failure persistence boundary

## Finding

[Confirmed] The recovered `bagLikeMgr.failedTimes` value belongs to an unfinished
battle's resumable record. It is not a durable completed-defeat counter:

1. `BagLilkeManager.init()` resets `failedTimes` to zero, then restores it only when
   `trunkInstanceRecordModel.localVo` matches the current chapter
   (`work/battlefield-runtime-analysis/formatted/BagLilkeManager.ts.deobfuscated.js:237-264`).
2. `TrunkInstanceRecordController.updateRecord()` copies `bagLikeMgr.failedTimes` into
   that local record and calls `saveRecord()`. The controller updates this checkpoint
   on loadout-choice and speed-change notifications
   (`work/failure-persistence-analysis/TrunkInstanceRecordController.ts.deobfuscated.js:3`).
3. The same controller maps `BAGLIKE_BATTLE_END`, `BAGLIKE_BATTLE_LOST`, and
   `EXIT_BATTLE` directly to `clearRecord()`. Therefore a completed loss does not leave
   this checkpoint available for a later process restart (same source, line 3).
4. `BagLikeView.onBattleLost()` increments the in-memory `failedTimes` value for the
   current result/retry flow, but it does not save it and the loss notification also
   clears the checkpoint
   (`work/failure-persistence-analysis/BagLikeView.ts.deobfuscated.js:3`).

`BattleTrunkChapterVo.updateFailMultiple()` separately reads
`trunkInstanceModel.getFailMultipleCfg(chapterId)`. That model is supplied through the
common/account layer and is not present as a module in the captured battle subpackage.
It must not be conflated with `bagLikeMgr.failedTimes` or invented as a battlefield
local-storage rule.

## Reconstruction consequence

The mechanics-first reconstruction keeps consecutive defeat compensation during the
live retry flow and clears it on victory. It intentionally does not persist
`failedAttempts` across an application restart. Any server/account-backed challenge
history belongs to external progression fidelity, not to the deterministic 200-level
battlefield contract.

## Reproduction

```sh
node skills/wechat-minigame-reverse-expert/scripts/extract-cocos-module-source.js \
  targets/wxf9af2417e78ce07a/18/work/ui-module-analysis/game.analysis.js \
  targets/wxf9af2417e78ce07a/18/work/failure-persistence-analysis \
  '(TrunkInstanceRecordController|BagLilkeManager|BagLikeView)'
```
