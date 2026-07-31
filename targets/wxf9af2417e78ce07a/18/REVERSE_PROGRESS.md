# REVERSE_PROGRESS — `wxf9af2417e78ce07a/18`

## 单一目标概览

- 授权范围: 用户授权的本地包体分析与 Cocos 工程还原
- AppID/版本: `wxf9af2417e78ce07a/18`
- 宿主环境: Windows 微信小游戏
- 引擎: Cocos Creator `3.8.2`
- 当前阶段: 还原交接契约补齐
- 状态: `RESTORE_SPEC.json` 已建立但尚未达到 `implementationReady`
- 活动实现工程: `E:\Projects\weichatAnalysis\cangshu\cocosProject`
- 最后迁移: 2026-07-31

## 原始输入

| 角色 | 路径 | SHA-256 | 状态 |
|---|---|---|---|
| 主包 | `reverse-work/input/wxf9af2417e78ce07a/18/__WITHOUT_MULTI_PLUGINCODE__.wxapkg` | `E1FB5E...EC42` | 已校验、已解包 |
| game 分包 | `reverse-work/input/wxf9af2417e78ce07a/18/_subpackages_game_.wxapkg` | `224938...F17F` | 已校验、已解包 |
| localData | `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/localData.4952c.bin` | `815FB0...B31D` | 已校验、已解码 |

## 阶段进度

| 阶段 | 状态 | 关键输出/证据 |
|---|---|---|
| 输入盘点 | 已完成 | `handoffs/wxf9af2417e78ce07a-18.json` |
| 解密与解包 | 已完成 | 主包 16 个文件；game 分包 2 个文件 |
| 主包/分包重建 | 已完成 | main/game/remote bundle 加载关系已确认 |
| 引擎识别 | 已完成 | 原始设置明确 `CocosEngine: 3.8.2` |
| 静态逻辑分析 | 已完成代表关卡主链 | 玩法阶段、倍率、伤害、连败补偿与特殊回合均有代码证据 |
| 关卡数据与 Schema | 已完成 | 118 表；200 关；2,978 引用回合；六类主外键 0 缺失 |
| 还原交接 | 进行中 | `generated/RESTORE_SPEC.json`、`generated/golden-cases.json` |

## 已确认结论

- 原始设计分辨率是 `750 × 1334`、竖屏；现有工程代码使用 `750 × 1000`，必须纠正。
- 代表关卡 `1001 / 宁静森林`：己方基地 HP `500`、敌方基地 HP `4000`、5 回合。
- 怪物最终 ATK/HP 使用基础值 × 关卡倍率 × 回合倍率 × 连败补偿倍率。
- 普通伤害按攻击、效果倍率、命中、暴击、增伤/抗性顺序计算，向下取整且最小为 1。
- `H01`、`H02` 的创建间隔分别是 10 秒和 8 秒。

## 还原交接门禁

- [x] 玩法循环与阶段转换已确认
- [ ] 原始场景精确锚点已确认
- [x] 代表关卡波次完整
- [x] 普通伤害公式完整
- [x] 关键背景、基地和四套 Spine 资源已映射
- [x] 至少三个数值黄金测试已建立
- [ ] 同关卡、同阶段、同时间点的原游戏视觉基线已取得

## 当前阻塞点

- 缺少匹配的原游戏截图或录像，无法确认精确锚点、UI 几何和单位比例。
- 现有 Cocos 工程的设计高度与原始设置不一致。
- 在上述问题解决前，`implementationReady` 保持 `false`，现有实现作为提前存在的下游产物登记，不倒推门禁通过。

## 下一步

- [ ] 将 Cocos 工程设计分辨率纠正为 `750 × 1334`。
- [ ] 取得关卡 1001 的部署/战斗匹配截图或录像。
- [ ] 完成资源导入、预览和视觉基线检查后再推进到完成。

