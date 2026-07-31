# REVERSE_PROGRESS — `wxc761b90fabc11225/7`

## 单一目标概览

- 授权范围: 用户授权的本地包体分析与还原
- AppID/版本: `wxc761b90fabc11225/7`
- 宿主环境: Windows 微信 xwechat/Radium
- 引擎: Unity WebGL；UnityPlugin `1.3.7`；WASM split
- 当前阶段: 主包/分包重建与路径映射
- 状态: 阻塞，等待真实数据分包或可达映射
- 最后迁移: 2026-07-31

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
| 主包/分包重建 | 进行中 | 基础包和插件已重建；数据与 WASM 分包缺失 |
| 引擎识别 | 已完成 | `ace-protect.json`、`app-config.json`、UnityPlugin 加载器 |
| 静态逻辑分析 | 进行中 | 已确认数据文件名、大小、CDN 基址及 125 个 bundle 路径 |
| 关卡数据与 Schema | 未开始 | 必须先取得 Unity 数据包或相关 AssetBundle |
| 还原交接 | 不适用 | 当前安装的实现 Skill 仅覆盖 Cocos；不得套用 Cocos 还原器 |

## 已确认结论

- 数据文件: `data-package/fbd8e870070f4b09.webgl.data.unityweb.bin.txt`
- 预期大小: `18,022,817` 字节
- WASM 代码标识: `1a7ba8c254c27845`
- 300 秒缓存监控没有捕获到目标数据/WASM 分包。
- 朴素 CDN 路径返回 404，只能否定该拼接方式，不能证明资源不存在。

## 当前阻塞点

- 标准包缓存没有 `data-package`、`wasmcode`、`wasmcode1`、`wasmcode2`。
- UnityPlugin 的 `Subpackage`/缓存路径转换尚未完全还原。
- 未取得数据容器前，不开始关卡 Schema 猜测。

## 下一步

- [ ] 继续追踪 UnityPlugin 的分包和缓存路径转换调用链。
- [ ] 若取得真实 URL 或包体，校验长度/哈希后再解析 Unity 容器。

