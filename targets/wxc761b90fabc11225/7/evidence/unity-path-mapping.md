# Unity package/path mapping evidence — `wxc761b90fabc11225/7`

Updated: 2026-08-10T08:30:58Z

## Confirmed configuration

- `base/app-config.json:1` declares the `data-package`, `wasmcode`, `wasmcode1`, and
  `wasmcode2` subpackages and UnityPlugin `1.3.7`.
- `base/game.js:313 @offset 1592101` contains `DATA_FILE_MD5 =
  fbd8e870070f4b09`; the local string table starts at offset `1580824`, has 166
  entries, and resolves after 40 left rotations.
- Static table decoding gives:
  - `DATA_CDN = https://tdboy-cdn.fuchenkj.com/v3.1.4/WebGL_Wechat/`
  - `CODE_FILE_MD5 = 1a7ba8c254c27845`
  - `GAME_NAME = webgl`
  - `APPID = wxc761b90fabc11225`
  - `DATA_FILE_SIZE = 18022817`
- `base/game.js:313 @offset 1592249` sets
  `loadDataPackageFromSubpackage: true` and `compressDataPackage: true`.

## Confirmed UnityPlugin path chain

All offsets below refer to the one-line bundled module at
`reverse-work/unpacked/wxe5a48f1ed5f544b7/335/plugin/plugin.js:93`.

1. Offset `328737`: `initConfig` constructs the uncompressed cache filename as
   `fbd8e870070f4b09.webgl.data.unityweb.bin`.
2. The same block appends `.br` when `compressDataPackage` is true, producing the
   actual subpackage member
   `fbd8e870070f4b09.webgl.data.unityweb.bin.br`.
3. Offset `321996`: `subpackagePath` is
   `data-package/<downloadFilename>`.
4. Offset `319908`: `invokeLoadDataPackage` calls
   `wx.loadSubpackage({name: "data-package"})`; after success, compressed mode
   decompresses `data-package/fbd8e870070f4b09.webgl.data.unityweb.bin.br`.
5. Offset `326208`: decompressed bytes are written through the plugin cache URI.
6. Offset `228538`: `PLUGIN_CACHE_PATH` resolves to
   `wx.env.USER_DATA_PATH/__GAME_FILE_CACHE`.
7. Offsets `316423` and `318186` show CDN download branches, but offset `323117`
   selects the subpackage branch under the current manager configuration. A naïve
   `DATA_CDN + filename` request therefore does not model this launch path.

## Local cache verification

The bounded scan root was:

`C:\Users\jiachengwei\AppData\Roaming\Tencent\xwechat\radium\users\d833ae57d25e1087edac741082077974`

Command:

```powershell
rg --files <radium-user-root> | rg -i 'fbd8e870070f4b09|__GAME_FILE_CACHE|wxc761b90fabc11225\\7\\_(data-package|wasmcode|wasmcode1|wasmcode2)_'
```

Result: no target data/WASM subpackage and no target-local
`applet/local/wxc761b90fabc11225` directory. The scan did find
`__GAME_FILE_CACHE` data from other AppIDs, confirming the expected local layout.

## Impact

The package/path reconstruction stage is complete. The next evidence gate is acquisition
of `_data-package_.wxapkg` and the required `wasmcode*` package bodies for this exact
AppID/version. Level/resource schema analysis remains blocked until the data container is
obtained and validated.
