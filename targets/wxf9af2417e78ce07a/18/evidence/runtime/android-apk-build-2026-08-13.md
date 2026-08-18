# Android APK build (2026-08-13)

## Artifact

- APK: `artifacts/android/cangshu-hamster-battle-1.0.1-v2-arm64-20260813.apk`
- Size: 35,413,894 bytes
- SHA-256: `66688F1794E2FB191C9D7B9B5E96E34C387F02C7F4E676119E97D452EE836DD0`
- Package: `com.cangshu.hamsterbattle`
- Version: `1.0.1` (`versionCode=2`)
- ABI: `arm64-v8a`; packaged native library: `lib/arm64-v8a/libcocos.so`
- Minimum/target SDK: 21 / 35
- Orientation: portrait
- Signing: same Android debug certificate as the earlier device package; APK Signature Schemes v1, v2, and v3 verified
- Alignment: `zipalign -c 4` passed

## Freshness and validation

- Cocos Creator 3.8.8 Android export completed with success exit code `36` at 2026-08-13 16:29.
- The packaged `assets/assets/main/index.js` SHA-256 exactly matches the freshly exported Android script.
- The deterministic Node suite passed 54/54 test files, including all 200 levels, 2,978 rounds, and 54,816 scheduled spawns.
- Android package-version and native browser-contract guard tests passed after Creator export.
- Creator project check reported 251 assets and zero missing `.meta` files.
- Gradle 8.11.1 `assembleDebug` completed successfully in 1m 54s: 90 tasks, 680/680 native compile/link steps, and a fresh `libcocos.so`.

This is a debug-signed device-test package, not a release-signed store artifact. No physical-device smoke test was run in this build task.
