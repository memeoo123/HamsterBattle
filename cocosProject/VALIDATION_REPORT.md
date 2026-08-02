# VALIDATION_REPORT

## Baseline

- Target: `wxf9af2417e78ce07a/18`
- Representative level: `1004 / 荒漠沙地`
- Original reference: 已有 4 张原版 1004 截图；当前工程已对齐场景，尚待采集重建端同阶段截图
- Original Cocos version: `3.8.2`
- Reconstruction Cocos version: `3.8.8`
- Resolution: `750 × 1334` portrait（已纠正）
- Validation date: 2026-08-02

## Automated checks

| Check | Result | Evidence |
|---|---|---|
| Restore spec structure | Pass | validator: `valid=true` |
| Restore spec ready gate | Pass | `implementationReady=true`，无阻塞 unknown |
| Golden cases | Pass | `47/47`；含普通占用格覆盖替换、核心保护、核心触发进度/余数、伤害分支和 15 档失败补偿 |
| Production combat kernel | Pass | `34/34` assertions；含原版伤害、攻速/失败补偿、严格范围、四叉树等距优先、归一化移动、基地路径、英雄分离碰撞、弹丸实时攻击/死亡快照边界、H0905 首发后最多两次近邻弹射，以及强制暴击、附加暴伤和闪避优先级 |
| Production mechanism kernel | Pass | `24/24` assertions；含连通块、多侧核心接触、产率、满 100、余数、输出延迟、1.5 倍速、直接相邻/仅连通边界，以及相邻效率的小数进度与显示率 |
| Unit level progression | Pass (numeric + asset import) | `254/254`：H01/H02/H03/H04 的 1–4 级及 H0705/H0805/H0905 的倍率、头像、模型 ID、资源路径、缩放、主技能编号，H0204 技能 2002，以及 H12/H13 等级倍率；15 套新增 Spine 3.8.99 均完成 Creator 导入 |
| Level-5 cross-family fusion | Pass (rules + fixture render), matched account pending | `10/10`：六组原表配方、双向材料、全部星级门槛和非配方拒绝；750×1334 显式夹具已验证 H0705/H0805/H0905 的候选/棋盘形状、正式生产队列及 R1001/R1002/R1003 Spine 加载。目标账号星级未知，夹具截图不等于竞品正常存档 |
| H0905 recovered effects | Pass (asset/linkage), matched timing pending | `15/15`：原包飞弹、三帧命中图和音频哈希，精确裁切、offset、锚点、0.7 缩放、首发/弹射段创建、逐段命中播放和占位线关闭均通过；三帧时长暂按 30 FPS 推定 |
| Asset metadata | Pass | 99 asset files，missing meta `0`；新增 `js_zhanche_dandao.png`、`js_zhanche_hill.png`、`bullet_zhanche.mp3` 已进入 Web 产物；既有原始 UI、shape Spine 与融合英雄 Spine 保持可加载 |
| TypeScript | Pass (project scripts) | Creator 3.8.8 declarations with `--skipLibCheck true`, exit code 0；full lib check only reports bundled `cc.d.ts/jsb.d.ts` environment errors |
| Web build smoke | Pass (artifact), launcher warning recorded | Creator 日志完成 `build Task (web-mobile) Finished`，H0905 三项新资源进入产物，750×1334 浏览器夹具正常加载且无项目控制台错误；CLI 最终码 36 来自构建后扩展商店请求 `ECONNRESET`，不是项目编译/资源失败 |
| Creator project open | Pass | pre-existing main process PID 49776 opened `cocosProject`；未启动第二个编辑器 |
| Main startup rendering | Pass | 修复同节点重复 Renderable2D 后，显式 Main UUID 预览显示完整布阵首屏且无新增同类警告 |
| Post-change interactive preview | Partial | 五级候选、棋盘和产兵显式夹具已完成实机截图与日志验证，并修复战斗 `BackpackPanel` 遮挡战场回归；仍需用有证据的账号星级执行正常拖拽融合完整点击测试 |
| Original visual references | Pass (reference only) | 4 张：初始准备、发展后准备、第 1 波战斗、特性三选一；清单见目标目录 `evidence/visual/original/2026-08-01/manifest.json` |
| Level-1004 deterministic scenario | Pass | `28/28`：15 波、Boss 顺序、准备棋盘/候选分区、阶段布局、EXP 阈值、截图三能力 ID，以及 1.5 倍 EXP 的单级升级/小数余数 |
| Weighted trait draw and gear upgrade | Pass | `82/82`：权重边界、不重复、阵容/账号星级/次数/波次/基地生命过滤、同组最高星级版本、普通升级无保底、仅刷新品质 4 保底；覆盖随机棋盘升级、3012 no-op、经验强化、全敌军减攻、核心相邻强化、两种基地治疗，以及 H01 连击必暴四版本 |
| Weighted preparation draw | Pass (supported-family runtime path) | `38/38`：静态资格、3000–3004 路由、独立槽位抽取、账号已解锁族过滤、金币计数权重、五英雄族上限/缺失族替换、第七次非广告刷新强制扩格、Prepare 精确倍率及原版 3012 no-op；仍缺目标账号精确解锁集合与 H11 完整治疗消费者 |
| Preparation placement | Pass (numeric + user smoke) | `24/24`：合成优先后的整件覆盖退回、主动取下、边界/核心保护、候选/棋盘固定同尺寸、候选溢出分行，以及 1–5 级精确色值、等级色覆盖兵种色和无等级特殊件回退色；用户已确认尺寸、重叠和棋盘分区问题解决 |
| Level-specific hero Spine import | Pass | H01/H02/H03/H04 的 1–4 级模型路径已接入；本轮新增 12 套二/三/四级原始 Spine 3.8.99，atlas/texture/skeleton 均由 Creator 导入 |
| Matched visual baseline | Partial / Pending | 已采集 750×1334 release 准备态与真实拖放后进入的第 1 波。顶部 HUD、准备区 `y=300` 起点、背包/候选/按钮分区以及战斗 HUD/背包常驻已结构对齐；`cl1..cl5`、操作底/背包/开放格、通用 HUD/按钮、ItemConfig 银币/观影券均使用原始资源。五阶融合另有显式夹具三态截图，并由此修复战斗 `BackpackPanel` 遮挡战场回归，但该夹具不是竞品同账号状态。竞品战斗参考是 863 HP 发展中存档，当前为 500 HP 初始局；仍无同状态特性截图，因此不得标 Pass。证据见 `evidence/visual/reconstruction/2026-08-02/manifest.json` 与其 `fusion-validation/manifest.json` |

## Fidelity matrix

| Area | Confirmed | Approximate / pending |
|---|---|---|
| Scene | 表驱动 1004、15 波、fightscene_03、750×1334；战斗扩展且背包常驻 | 战场高度/位移仍是截图推定值，待 matched capture 校正 |
| UI | 7×5、100×100 数据网格、84×84 空格/棋子可视面、候选拖放、同类 1-4 级合成、六组跨族五级配方/星级门槛、覆盖旧齿轮整件退回、主动取下、逐格占位；候选和棋盘均固定 1.0 倍，溢出分行；准备棋盘与候选区已分离，产率使用独立胶囊标签；生产齿轮使用原版 `cl1..cl5` atlas 表达 1 绿、2 蓝、3 紫、4 金、5 红，静态多格底板按 ShapeConfig 使用 `panel1..4` 和原旋转/等级着色；操作底、背包面板、开放格、顶部 HUD/按钮、银币/观影券及准备态已确认字体/描边均使用原始资源；五级 shape `UI10020/21/22` 原始 Spine 与旋转路径已接入 | 目标账号星级未知，五级 shape 动画尚未在有证据的正常流程实机触发；未访问弹窗文字；战斗与特性尚无同存档状态 matched pair |
| Refresh | 自动准备发牌、首次普通刷新免费、后续 15 金币、每准备回合一次广告刷新、刷新替换未摆放候选；静态资格与 3000–3004 基础权重树；账号解锁族过滤；金币齿轮计数驱动 3034 权重；最多五种英雄族及缺失族替换；每七次非广告刷新强制扩格；二级概率能力保留 3012 配置断链 no-op | 目标账号精确解锁集合、H11 治疗齿轮完整结算 |
| Units | H01/H02/H03/H04/H07/H08/H09/M02/M03/Boss03 基础属性、类型、移速、范围、攻速、奖励和 Boss 标志；生产齿轮 1–4 级及前三种五级融合兵使用精确属性倍率、模型路径和配置缩放；H0905 已恢复 `BounceBullet` 数值链及原始飞弹/三帧命中/音效；H12/H13 按原版作为一次性塔技能 | 单位排序、其他等级弹丸、H0905 三帧精确时长和状态特效待表现复验 |
| Production | 核心逐侧触发连通块、100 点工人进度、HAMSTER 0.75 秒输出延迟、H12 一次性技能、银币完成产出、1.5 倍速；核心直接相邻齿轮可按能力对后续 HAMSTER/WHEEL 攻击乘 1.2，或对每次工人进度及 `/s` 显示乘 1.2，且不会误作用于仅连通齿轮、候选区或 HP | 首次核心接触相位和同帧顺序仍待 matched trace |
| Combat | 原版伤害内核、攻速缩放行为延迟、弹丸存活规则；逐帧最近目标、四叉树等距优先、严格搜索/攻击边界、归一化移动、英雄分离、基地路径与更新顺序；EXP 20/50/100；升级暂停；28 条原表效果行按 25 个互斥能力组参与抽取（24 个有效组和 1 个证据确认的配置断链 no-op），并按原权重/阵容/账号星级/次数/基地生命/已恢复波次过滤；H01 连击必暴、经验强化、敌方攻击弱化、核心相邻强化、两种基地治疗及随机棋盘升级均已连接运行时消费者 | 目标账号 H01 实际星级仍需外部截图或存档确认；未实现的完整特性效果池、同帧事件/RNG 顺序与状态特效仍待 matched trace |
| Rounds | 关卡 1004 十五波完整排期、M07、三组 Boss 与真实清怪胜利条件 | 实际点击通关时长与手感 |
| Audio/effects | H0905 `H24_S1` 飞弹、`H24_S1_LOWER` 三帧命中与逐段 `bullet_zhanche` 已接入；胜败流程已实现 | H0905 帧时长/响度 matched 验收，以及其余声音、技能、状态和结算特效 |

## Completion decision

工程已切换到用户截图对应的关卡 1004，并补上十五波、战斗扩展/背包常驻以及首个
EXP 三选一闭环。准备态与第 1 波重建截图已经采集，最早的顶部/准备区结构偏差已修正；
但战斗参考不是同一存档状态、特性选择重建截图仍缺，且完整能力效果池、广告流程、原始
跨族五级配方虽已接入，但目标账号星级和 shape 动画实机触发尚未验收；同状态战斗/特性配对和部分未访问界面仍不完整，因此 `visualBaseline` 保持 Pending，不标记为最终完成。
