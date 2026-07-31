# WeChat package cache layouts

Use these as bounded discovery candidates. Paths vary by WeChat generation and distribution channel, so report only layouts that actually exist.

## Windows

Current xwechat/Radium candidates:

```text
%APPDATA%\Tencent\xwechat\radium\users\<account-hash>\applet\packages
%APPDATA%\Tencent\xwechat\radium\Applet\packages
```

Legacy or configured-data candidates:

```text
%USERPROFILE%\Documents\WeChat Files\Applet
<configured-data-root>\WeChat Files\<account>\Applet
<configured-data-root>\xwechat_files\<account>\Applet
```

The WMPF binaries under `XPlugin\Plugins\RadiumWMPF` are runtime components, not cached app packages.

## macOS

Current sandbox-container candidates:

```text
~/Library/Containers/com.tencent.xinWeChat/Data/.wxapplet/packages
~/Library/Containers/com.tencent.xinWeChat/Data/Library/Caches/applet/release
~/Library/Containers/com.tencent.xinWeChat/Data/Library/Caches/applet/debug
```

Legacy container candidates can occur below:

```text
~/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat
```

Look only at the bounded `WeChat Files/Applet` and `Message/Applet` descendants handled by the bundled script. Do not recursively scan the entire Library directory.

macOS may deny access to sandbox-container data. Report the error and ask the user to grant access or supply an exported, user-approved package directory; never change privacy permissions automatically.

## Interpretation

A common package grouping is:

```text
wx<AppID>/<version>/__APP__.wxapkg
```

Other `.wxapkg` files in the same AppID/version group can be subpackages or plugins. Filesystem metadata alone cannot reliably determine whether the AppID represents a mini-game or an ordinary mini program, nor can it establish the product title.
