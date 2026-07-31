# REVERSE_PROGRESS

> 迁移说明（2026-07-31）：本文件保留为迁移前的跨目标历史汇总，不再作为当前阶段的权威来源。新的机器状态见 `ORCHESTRATION_STATE.json`，人类摘要见 `ORCHESTRATION_STATUS.md`；目标详情已拆分到 `targets/<AppID>/<version>/REVERSE_PROGRESS.md`。

## 项目概览

- 授权范围: 用户当前电脑上运行的微信小游戏及其已授权本地包体；允许在项目工作区创建副本、解密、解包和静态分析
- AppID: `wxc761b90fabc11225`（已由包目录差分及包内配置交叉确认）
- 包版本: `7`
- 宿主环境: Windows；微信桌面端 xwechat/Radium
- 分析根目录: `E:\Projects\weichatAnalysis\cangshu`
- 包缓存根: `C:\Users\jiachengwei\AppData\Roaming\Tencent\xwechat\radium\users\d833ae57d25e1087edac741082077974\applet\packages`
- 引擎: Unity WebGL / 微信 UnityPlugin `1.3.7`；WASM split 已启用
- 当前阶段: 双线推进——Unity 目标继续追踪分包路径；Cocos 目标已确认倍率运行时语义并完成全部 31 条非主线回合分类
- 最后更新: 2026-07-31（完成 `wxf9af2417e78ce07a/18` 的倍率代码链、连败补偿与日常/额外怪物/无尽回合验证）

## 原始输入清单

| AppID/版本 | 工作副本 | 角色 | 大小 | SHA-256 | 状态 |
|---|---|---|---:|---|---|
| `wxc761b90fabc11225/7` | `reverse-work/input/wxc761b90fabc11225/7/__WITHOUT_MULTI_PLUGINCODE__.wxapkg` | 目标基础包 | 2,929,002 | `7FEC29B8959D65AE229CE02CBA264434490C2CDDAFACB02FBDCBF5B17B9D6BB4` | 原件/副本一致；已解包 |
| `wxe5a48f1ed5f544b7/335` | `reverse-work/input/wxe5a48f1ed5f544b7/335/__PLUGINCODE__.wxapkg` | UnityPlugin 依赖 | 691,274 | `D2E9D8278DA4B8BF64A18E19D804CA4856E53DDF4C099BBF2EC66B1882AF5C1E` | 原件/副本一致；已解包 |
| `wxaed5ace05d92b218/63` | `reverse-work/input/wxaed5ace05d92b218/63/__PLUGINCODE__.wxapkg` | 同次启动加载的插件依赖 | 316,405 | `9B2B2A19A236F27DEF3ADD27DF40736AF2343FB22479DF9442524EE07D4132FC` | 原件/副本一致；已解包 |

## 工具链记录

| 工具 | 来源/版本 | 用途 | 完整命令/版本证据 | 结果 |
|---|---|---|---|---|
| `locate_wechat_minigame_packages.ps1` | `$wechat-minigame-file-locator` | 标准缓存扫描与启动前后差分 | `-Mode Snapshot` / `-Mode Diff` | 目标基础包与两个插件依赖被同次启动捕获 |
| `inventory_wechat_packages.py` | `$wechat-minigame-package-inventory` | AppID/版本分组 | `python -X utf8 <script> --platform windows --limit 10` | 31 AppID、36 版本、74 包 |
| `unwx` | `unbyte/unwx` v0.4.0；commit `3a03465fb84d66e0a8a81e6f58b6c3636934d961`；MIT | V1MMWX 解密与安全预检后的解包 | `unwx.exe <input> -o <new-output> -w <appid>`；未使用 `--clean` | 17/17、2/2、3/3 文件；路径边界验证通过 |
| Node.js | v24.14.0 | 包索引安全预解析及局部字符串表静态还原 | 内存解析，不执行游戏入口 | 成功 |

## 阶段进度

| 阶段 | 状态 | 关键输出 | 证据 |
|---|---|---|---|
| 输入盘点 | 已完成 | 目标 AppID `wxc761b90fabc11225`、版本 7、两项插件依赖 | `.wechat-minigame-locator/diff.json`；`game.js:313:11694` |
| 解密与解包 | 已完成 | 三包均为 `V1MMWX`；解包结果 17、2、3 个文件 | `reverse-work/unpacked/`；`unwx-src/src/decryptor.rs:89` |
| 主包/分包重建 | 进行中 | 基础包和插件已重建；`data-package`/`wasmcode*` 尚未在标准缓存中找到 | `app-config.json:1`；`plugin.js:93:302664` |
| 引擎识别 | 已完成 | Unity WebGL、UnityPlugin 1.3.7、WASM split | `ace-protect.json:1`；`app-config.json:1`；`game.js:304` |
| 静态逻辑分析 | 进行中 | 已还原资源配置和数据加载链；提取 125 个唯一 Unity bundle 路径，其中 7 个为场景/地图/关卡候选 | `game.js:313:11694`；`plugin.js:93:309672`；`reverse-work/resource-inventory.md` |
| 关卡数据与 Schema | 未开始 | 需要先取得 Unity 数据包/AssetBundle | 当前阻塞点 |
### Cocos 目标 `wxf9af2417e78ce07a/18`

| 阶段 | 状态 | 关键输出 | 证据 |
|---|---|---|---|
| 主包/分包解包 | 已完成 | 主包 16 个文件；`game` 分包 2 个文件 | `reverse-work/unpacked/wxf9af2417e78ce07a/18/` |
| 引擎与资源链识别 | 已完成 | Cocos Creator 3.8.2；远端 `resources2/resources3`；还原 `remote/<bundle>` URL 规则 | `main/src/settings.37a11.json`；`main/game.js:66,84` |
| LocalData 定位 | 已完成 | `localData` 为 `cc.BufferAsset`；130,712 字节 ZIP；SHA-256 `815FB0...B31D` | `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/localData.4952c.bin` |
| 紧凑表 Schema 解码 | 已完成 | 119 个 ZIP 条目；118 张配置表；`str.json` 字符串字典；全部通过长度校验 | `reverse-work/analyze-cocos-localdata.ps1`；`decoded/table-inventory.md` |
| 主线关卡数据 | 已完成首轮解析 | 200 关、2,978 个被引用回合、29 个怪物；引用与波次数组校验全部通过 | `decoded/trunkinstance.TrunkInstanceConfig.json`；`decoded/trunkinstance.TrunkInstanceRoundConfig.json` |
| 跨表关卡模型 | 已完成 | 200 关逐回合模型；六类主外键 0 缺失；难度、怪物投放、推荐英雄和奖励已汇总 | `reverse-work/build-cocos-level-model.ps1`；`decoded/level-model/`；`reverse-work/cocos-progression-analysis-wxf9af2417e78ce07a.md` |
| 运行时倍率与非主线回合 | 已完成 | 万分比及关卡×回合×连败补偿链已由代码确认；31 条非主线回合全部归类、0 未知；特殊玩法进度场景已建模 | `reverse-work/cocos-runtime-and-special-rounds-analysis.md`；`decoded/nonmain-rounds/`；`decoded/special-mode-model/` |

## 关卡数据挖掘进度

| 文件路径 | 解读程度 | 读取/解析入口 | Schema 状态 | 证据 |
|---|---:|---|---|---|
| `data-package/fbd8e870070f4b09.webgl.data.unityweb.bin.txt` | 5%（已确认文件名和预期大小，文件本体未取得） | UnityPlugin `_o.loadDataPackage` | 未开始 | `plugin.js:93:302664`、`:309672` |
| `https://tdboy-cdn.fuchenkj.com/v3.1.4/WebGL_Wechat/` | 10%（已确认 CDN 基址与 125 个 `.unity3d` 唯一路径；直接拼接的 3 个场景候选均为 HTTP 404） | `managerConfig.DATA_CDN` | 未开始 | `game.js:313:11694`；`reverse-work/resource-inventory.md` |

## 确凿知识点库

| ID | 已确认结论 | 证据 | 验证方式 | 影响 |
|---|---|---|---|---|
| K-001 | 当前微信使用 xwechat/Radium 包缓存布局 | `.wechat-minigame-locator/before.json` 的 `roots[0]` | 定位器 `-Mode Scan` | 无需全盘搜索 |
| K-002 | 目标 AppID 为 `wxc761b90fabc11225` | 启动差分的基础包目录；`game.js:313:11694` 静态还原的 `APPID` | 局部字符串表轮转 40 次后 `d(335)` | AppID 可用于 V1MMWX 解密 |
| K-003 | 三个包均采用 `V1MMWX` Windows 加密格式 | 三个工作副本偏移 `0x00..0x05` 均为 `56 31 4D 4D 57 58` | 读取前 32 字节 | 必须先按 AppID 派生密钥 |
| K-004 | 引擎为 Unity WebGL，使用 UnityPlugin 1.3.7 并启用 WASM split | `ace-protect.json:1`、`app-config.json:1`、`game.js:304` | 配置和加载器交叉验证 | 后续按 Unity AssetBundle/Data 格式分析 |
| K-005 | 数据配置为 MD5 `fbd8e870070f4b09`、大小 18,022,817、CDN `v3.1.4/WebGL_Wechat/` | `game.js:313:11694` 的局部字符串表静态还原 | 映射 `d(370/345/335/324/253)` | 可精确构造数据文件名和候选 URL |
| K-006 | 未压缩数据分包路径为 `data-package/fbd8e870070f4b09.webgl.data.unityweb.bin.txt` | `plugin.js:93:302664` getter 与 `:309672` initConfig | 追踪 `packageName + downloadFilename` | 可在缓存或 CDN 精确查找 |
| K-007 | 二次进入游戏的 300 秒捕获窗口只记录到已知 `wxaed5ace05d92b218/63` 插件的 5 次文件事件，5 份副本均与原工作副本 SHA-256 `9B2B...32FC` 完全一致；没有目标数据/WASM 分包 | `reverse-work/captured-packages/capture-events.jsonl`；捕获副本哈希 | 递归文件监控、精确检索与 SHA-256 复核 | 不能依赖本次标准包缓存事件取得剩余分包 |
| K-008 | 静态清单含 125 个唯一 Unity bundle 路径，其中 7 个匹配 scene/map/level；直接拼接 CDN 的数据包与 3 个场景资源均返回 HTTP 404 | `reverse-work/resource-inventory.md`；HEAD 响应 | 静态正则提取与只读 HEAD | 当前 CDN 基址不能按朴素路径直接下载这些资源 |
| K-009 | 新目标 `wxf9af2417e78ce07a/18` 使用 Cocos Creator 3.8.2，业务代码位于 `game` 分包，资源来自远端 `resources2/resources3` | `main/src/settings.37a11.json`；`subpackages-game/.../game.js` | 本地配置与分包静态分析 | Cocos 目标不受 Unity 数据包阻塞影响 |
| K-010 | Cocos 远端 Bundle URL 必须插入 `remote/<bundle>`；两个配置索引均可达 | `main/game.js:66,84`；HEAD 200 | 还原加载器拼接逻辑并验证 | 可从资源索引精确构造原生资源路径 |
| K-011 | `resources3/localData` 是 130,712 字节 ZIP，包含 118 张紧凑表和一个全局字符串字典；所有表均可离线解码 | `localData.4952c.bin`；`analyze-cocos-localdata.ps1` | UUID 展开、版本映射、ZIP 与列式格式解析 | 已跨过关卡 Schema 阻塞点 |
| K-012 | 主线配置包含 200 关（`1001..1200`）和 2,978 个被引用回合；无缺失回合、无怪物引用缺失、无出生时间/怪物数组长度不一致 | 解码后的 `TrunkInstanceConfig`、`TrunkInstanceRoundConfig`、`MonsterAttributeConfig` | 全量引用一致性检查 | 可继续构建关卡难度、奖励和怪物波次模型 |
| K-013 | 200 关跨表模型中的回合、怪物、推荐英雄、奖励物品、怪物模型和技能六类引用均为 0 缺失 | `decoded/level-model/levels.json`；`level-summary.csv` | 全量主外键校验与模型重建 | 模型可用于关卡排序、生态与奖励分析 |
| K-014 | 主线波次骨架约按 15 关复用，但关卡攻击、生命、金币和敌方基地数值持续提升；静态难度峰值为 1199，1200 排名第 7 | `cocos-progression-analysis-wxf9af2417e78ce07a.md` | 185 对相隔 15 关比较与全量静态代理排序 | 关卡压力由模板复用和全局缩放共同形成 |
| K-015 | 运行时代码明确执行 `配置倍率 / 10000`，怪物最终 ATK/HP 分别为基础值乘“关卡倍率 × 回合倍率 × 连败补偿倍率” | 还原后的 `BattleTrunkChapterVo.ts`、`BattleInstanceController.ts` | 隔离 VM 恢复 9,154 个混淆常量并还原计算属性 | 现有关卡代理的万分比与乘法口径已确认；首次挑战补偿为 1 |
| K-016 | 31 条非主线回合全部有有效引用：20 条日常副本、10 条 `ADD_EXTRA_MONSTER`、1 条无尽模式；未知项 0 | `decoded/nonmain-rounds/`；还原后的 Daily/Endless 章节模块 | 118 表全量引用扫描与运行时代码交叉验证 | 纠正“测试/遗留候选”判断，可继续分别建模三类玩法 |
| K-017 | 连败补偿同时下调怪物 ATK 和 HP：第 1 次失败后 0.95，第 15 次及以后封顶 0.4633；胜利后清零 | `TrunkInstanceDefeatConfig`；还原后的 `TrunkInstanceModel.ts` | 失败记录、配置选择、倍率应用三段代码闭环 | 实际重复挑战难度会显著低于首次挑战静态代理 |
| K-018 | 日常与无尽玩法继承当前主线进度关卡倍率；`ADD_EXTRA_MONSTER` 仅使用 3000xx 出生计划和怪物 ID，新增怪物属性沿用宿主正常波次倍率 | `decoded/special-mode-model/`；还原后的 Daily/Endless/Trunk 章节模块 | 六个主线进度场景建模与创建怪物调用链复核 | 不应把 3000xx 自身倍率用于额外怪物；特殊玩法难度随主线进度缩放 |

## 数据结构与映射

| 结构/字段 | 值/构造 | 业务含义 | 证据 | 状态 |
|---|---|---|---|---|
| `managerConfig.APPID` | `wxc761b90fabc11225` | 目标小游戏 AppID | `game.js:313:11694` | 已确认 |
| `managerConfig.CODE_FILE_MD5` | `1a7ba8c254c27845` | Unity WASM 代码标识 | 同上 | 已确认 |
| `managerConfig.DATA_FILE_MD5` | `fbd8e870070f4b09` | Unity 数据包标识 | 同上 | 已确认 |
| `managerConfig.DATA_FILE_SIZE` | `18022817` | 数据包预期字节数 | 同上 | 已确认 |
| `downloadFilename` | `<DATA_MD5>.webgl.data.unityweb.bin.txt` | 未压缩数据文件名 | `plugin.js:93:309672` | 已确认 |

## 待确认假设

| ID | 假设 | 已有线索 | 缺失证据 | 验证方案 |
|---|---|---|---|---|

| H-002 | CDN 中的 `.unity3d` 清单包含关卡/地图数据 | `preloadDataList` 包含场景、prefab、atlas 等大量 Unity bundle | 尚未取得 bundle 并定位关卡读取代码 | 先取得数据包或最小相关 bundle，再做 Unity 结构扫描与引用追踪 |
| H-003 | `.unity3d` 资源由 UnityPlugin/微信分包映射到本地，而不是直接使用 `DATA_CDN + 相对路径` | 所测直接 URL 全部 404，插件代码存在 `Subpackage` 与缓存路径分支 | 尚未得到运行时请求 URL 或分包本体 | 仅在授权范围内捕获资源请求元数据，或定位插件的路径转换调用链 |

## 当前阻塞点

- 当前 AppID 的标准 `.wxapkg` 缓存只有基础包，未发现声明的 `data-package`、`wasmcode`、`wasmcode1`、`wasmcode2` 分包。
- 精确文件名在当前微信用户的 `radium/.../applet` 范围内也未找到；二次进入游戏期间只捕获到已知 `wxaed5ace05d92b218/63` 插件的重复事件，5 份副本哈希均与已解包输入一致，没有新的目标分包。
- 数据包候选 URL 与三个最相关场景 bundle 的朴素 CDN URL 均为 HTTP 404，必须继续还原 UnityPlugin 的路径映射，不能盲目拼接下载。
- Cocos 目标当前无包体阻塞；主线、倍率、非主线回合及日常/额外怪物/无尽场景模型均已完成。后续可继续分析特殊玩法奖励与解锁条件，或回到 Unity 分包路径追踪。

## 下一步任务

- [x] 对候选数据 URL 执行 HEAD：HTTP 404
- [x] 提取 Unity bundle 静态清单并筛选场景/关卡候选
- [ ] 继续追踪 UnityPlugin 的 `Subpackage`/缓存路径转换调用链
- [ ] 若取得真实可达 URL 或分包，经用户批准保存到 `reverse-work/resources/`
- [ ] 验证下载哈希/长度，识别 Unity 数据容器并开始关卡 Schema 定位
- [x] 还原 Cocos `remote/<bundle>` 路径并定位 `resources3/localData`
- [x] 保存并校验 Cocos `localData.4952c.bin`
- [x] 解码 118 张紧凑配置表和 `str.json` 字符串字典
- [x] 验证 200 个主线关卡、2,978 个引用回合及怪物引用完整性
- [x] 对 Cocos 关卡、奖励、怪物、技能和难度倍率做跨表关联
- [x] 在业务代码中验证关卡/回合倍率的实际计算语义
- [x] 对 31 条非主线回合做来源和用途分类
- [x] 建立日常副本、额外怪物能力与无尽模式的独立难度模型
- [ ] 分析特殊玩法的奖励、挑战次数与解锁条件




