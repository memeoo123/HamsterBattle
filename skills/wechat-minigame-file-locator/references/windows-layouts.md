# Windows WeChat package layouts

Use these bounded candidates only when the bundled locator returns no roots. Do not recursively search whole drives by default.

## Current xwechat/Radium layout

```text
%APPDATA%\Tencent\xwechat\radium\users\<account-hash>\applet\packages\
└─ wx<AppID>\
   └─ <version>\
      ├─ __APP__.wxapkg
      └─ <subpackage>.wxapkg
```

`__APP__.wxapkg` is normally the main package. Other `.wxapkg` files in the same AppID/version group can be subpackages or plugins.

The WMPF runtime binaries under `XPlugin\Plugins\RadiumWMPF` are platform components, not the target mini-game package.

## Configured data roots

Small files under:

```text
%APPDATA%\Tencent\xwechat\config\*.ini
```

may contain the user-selected WeChat data root. Treat that location as a bounded hint. Chat data roots and mini-game runtime roots can differ.

## Legacy candidates

Check exact descendants of the user's Documents folder or configured WeChat data root:

```text
WeChat Files\Applet
WeChat Files\<account>\Applet
xwechat_files\Applet
xwechat_files\<account>\Applet
```

Layouts vary by client generation. Report the discovered evidence rather than asserting a client version from path names alone.
