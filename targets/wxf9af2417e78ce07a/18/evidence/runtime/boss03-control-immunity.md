# Boss03 control immunity against optional abilities

Status: **confirmed from recovered configuration/runtime and live reconstruction routing**.

- The recovered Boss03 row owns passive `BT_001`, decoded as control immunity
  (`generated/RESTORE_SPEC.json`, Boss03 skills).
- The shipped `BattleUnit.setAbnormalStatus` rejects `NotMove`, `dizziness`,
  `NotAttack`, and `Silent` whenever `BattleAttr.isImmuneControl()` is true
  (`work/battlefield-runtime-analysis/formatted/BattleUnit.ts.deobfuscated.js:220-225`).
- `BattleAttr.isImmuneControl()` reads the `ImmuneControl` abnormal status directly
  (`work/battlefield-runtime-analysis/formatted/BattleAttr.ts.deobfuscated.js:298-306`).
- The reconstruction maps Boss03's recovered passive to `controlImmune: true`. Both
  live optional control producers consume that flag: H12's `LY_1202/LY_1203`
  paralysis path passes it into `applyH12Paralysis`, while H03's star-7 transform
  path passes it into `applyH03TransformHit`.

The production contract now has explicit source assertions for the Boss03 config and
both consumers. Boss03 still receives H12 damage and H03's changed-model lifetime;
only paralysis/dizziness is rejected, matching the generic shipped immunity boundary.
