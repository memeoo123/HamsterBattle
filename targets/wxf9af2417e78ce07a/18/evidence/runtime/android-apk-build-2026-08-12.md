# Android APK build and device smoke test (2026-08-12)

## Artifact

- APK: `artifacts/android/cangshu-hamster-battle-1.0.1-v2-arm64.apk`
- Size: 35,095,085 bytes
- SHA-256: `846555C43C3FBBB97F8CA45DBD56D06857941599B79524D3DAF833AA79B6AD4A`
- Package: `com.cangshu.hamsterbattle`
- Version: `1.0.1` (`versionCode=2`)
- ABI: `arm64-v8a`; packaged native library: `lib/arm64-v8a/libcocos.so`
- Minimum/target SDK: 21 / 35
- Orientation: portrait
- Signing: original Android debug certificate; APK Signature Scheme v1, v2 and v3 verified
- Alignment: `zipalign -c -v 4` verified

## Build

- Cocos Creator: 3.8.8
- JDK: Amazon Corretto 17.0.18
- Android platform: 36; Build Tools: 36.1.0
- Android NDK: r23c (`23.2.8568313`)
- CMake/Ninja: 3.22.1 / 1.10.2
- Gradle/Android Gradle Plugin: 8.11.1 / 8.10.1
- Target architecture: arm64-v8a only
- `assembleDebug`: `BUILD SUCCESSFUL in 5m 54s`; 90 actionable tasks executed
- Native build: 680/680 C/C++ tasks completed, producing `libcocos.so`

The build emitted only Cocos/Android deprecation warnings, with no compile, link,
packaging, signing, or alignment failure.

## Physical-device smoke test

- Device: Xiaomi Redmi Note 8
- Android: 13 (API 33)
- ABI: arm64-v8a
- Existing same-package installation before test: none
- Install: succeeded; package path returned by Android package manager
- Launch: `com.cangshu.hamsterbattle/com.cocos.game.AppActivity` became the top resumed activity
- Runtime: process remained alive after launch; recent logcat contained no matching fatal exception,
  native fatal signal, package ANR, or process crash

This is a debug test build for local device evaluation, not a release-signed store artifact.

## Native level-entry black-screen fix

The first device build opened the main scene, but entering level 1004 cleared the main
scene and then stopped on a black frame. A clean device logcat trace identified the first
failure:

`TypeError: Cannot set properties of undefined (setting 'levelId')`

The exception came from `CangshuGame.syncBrowserContractState()`. Cocos native exposes a
partial `document`/canvas shim, but its canvas has no browser `dataset`. The browser-only
validation contract now returns before any DOM write when `querySelector` or `dataset` is
unavailable. Web builds retain the complete dataset contract.

Validation after the fix:

- dedicated Android/native guard: 4 assertions passed;
- complete deterministic suite: 52/52 test files passed, including 200 levels, 2,978
  rounds and 54,816 scheduled spawns;
- Creator project check: 240 assets, 0 missing meta, TypeScript passed;
- Creator 3.8.8 Android resource rebuild finished in 5 seconds;
- incremental Gradle build: `BUILD SUCCESSFUL in 27s`, 90 tasks, 6 executed and 84 up-to-date;
- same Redmi Note 8: overwrite install succeeded, level-1004 preparation rendered, battle
  rendered units/enemies/damage/HP/shadows/production, and both stages had zero matching
  JS exception, fatal signal, fatal Java exception, or ANR;
- diagnostic challenge consumption was restored to the pre-test account state:
  `energy=30`, empty `challengeTimesByLevel`, `maxPassedLevelId=1003`.

## Huawei report intake

A later Huawei report still described a black frame after level entry. At intake time the
Huawei device was absent from both `adb devices -l` and ADB mDNS discovery, so no Huawei
model, OS/GPU information, installed APK fingerprint, screenshot, or logcat trace was
available. The distributed fixed APK was opened as a ZIP and its packaged
`assets/assets/main/index.js` was confirmed to contain the native `dataset` guard.

The earlier fixed package and the pre-fix package both reported version `1.0 (1)` and used
the same filename, leaving stale-package installation ambiguous on a second phone. The
package is therefore reissued as `1.0.1 (2)` under a distinct filename while retaining the
same signing certificate, package ID, save data, arm64 ABI, min SDK and target SDK. The
versioned APK passed v1/v2/v3 signature verification, zipalign, the 53-file regression
suite, 200-level state machine, Creator TypeScript and asset/meta checks. Huawei-specific
render-backend changes remain deliberately unmade until a device trace identifies a GPU
or shader failure; a working main scene already proves that the device created the GLES3
runtime successfully.
