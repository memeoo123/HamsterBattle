# REVERSE_PROGRESS — `wxc761b90fabc11225/7`

## 单一目标概览

- 授权范围: 用户授权的本地包体分析与还原
- AppID/版本: `wxc761b90fabc11225/7`
- 宿主环境: Windows 微信 xwechat/Radium
- 引擎: Unity WebGL；UnityPlugin `1.3.7`；WASM split
- 当前阶段: 获取已精确映射的数据/WASM 分包
- 状态: 阻塞，等待真实目标分包落盘
- 最后更新: 2026-08-10

## 原始输入

| 角色 | 路径 | SHA-256 | 状态 |
|---|---|---|---|
| 主包 | `reverse-work/input/wxc761b90fabc11225/7/__WITHOUT_MULTI_PLUGINCODE__.wxapkg` | `7FEC29...D6BB4` | 已校验、已解包 |
| UnityPlugin | `reverse-work/input/wxe5a48f1ed5f544b7/335/__PLUGINCODE__.wxapkg` | `D2E9D8...F5C1E` | 已校验、已解包 |
| 相关插件 | `reverse-work/input/wxaed5ace05d92b218/63/__PLUGINCODE__.wxapkg` | `9B2B2A...32FC` | 已校验、已解包 |

## 阶段进度

| 阶段 | 状态 | 关键输出/证据 |
|---|---|---|
| 输入盘点 | 已完成 | `handoffs/wxc761b90fabc11225-7.json` |
| 解密与解包 | 已完成 | `reverse-work/unpacked/wxc761b90fabc11225/7/` |
| 主包/分包重建 | 已完成 | `evidence/unity-path-mapping.md`；已确认分包选择、压缩文件名、缓存及 CDN 分支 |
| 引擎识别 | 已完成 | `ace-protect.json`、`app-config.json`、UnityPlugin 加载器 |
| 静态逻辑分析 | 进行中 | 已确认数据文件名、大小、真实 `.br` 分包路径、缓存根及 125 个 bundle 路径；业务容器仍缺失 |
| 关卡数据与 Schema | 未开始 | 必须先取得 Unity 数据包或相关 AssetBundle |
| 还原交接 | 不适用 | 当前安装的实现 Skill 仅覆盖 Cocos；不得套用 Cocos 还原器 |

## 已确认结论

- 压缩数据分包成员: `data-package/fbd8e870070f4b09.webgl.data.unityweb.bin.br`
- 解压后插件缓存文件: `fbd8e870070f4b09.webgl.data.unityweb.bin`
- 预期大小: `18,022,817` 字节
- WASM 代码标识: `1a7ba8c254c27845`
- 当前启动配置为 `loadDataPackageFromSubpackage=true` 且
  `compressDataPackage=true`，因此先走 `wx.loadSubpackage("data-package")`，不走
  `DATA_CDN + filename` 的下载分支。
- 插件缓存根为 `wx.env.USER_DATA_PATH/__GAME_FILE_CACHE`；当前 Radium 用户目录中
  没有 `applet/local/wxc761b90fabc11225`。
- 300 秒缓存监控没有捕获到目标数据/WASM 分包。
- 先前 `.txt` 文件名是错误推断；本次依据主包配置与 UnityPlugin `1.3.7`
  文件名构造链更正为 `.br`。

## 当前阻塞点

- 标准包缓存没有 `data-package`、`wasmcode`、`wasmcode1`、`wasmcode2`。
- 目标 `_data-package_.wxapkg`、`_wasmcode_.wxapkg`、`_wasmcode1_.wxapkg`、
  `_wasmcode2_.wxapkg` 未落入已观察的包缓存。
- 目标 AppID 的 `applet/local/.../__GAME_FILE_CACHE` 尚未创建，无法从解压后缓存
  取得数据容器。
- 未取得数据容器前，不开始关卡 Schema 猜测。

## 下一步

- [x] 追踪 UnityPlugin 的分包、压缩文件名与缓存路径转换调用链。
- [ ] 在目标游戏实际启动并进入首个玩法场景时，对 `packages` 与
  `applet/local/wxc761b90fabc11225` 做同步元数据监控，捕获真实分包。
- [ ] 取得包体后先校验 AppID/版本、长度与 SHA-256，再解析 Unity 数据容器。
