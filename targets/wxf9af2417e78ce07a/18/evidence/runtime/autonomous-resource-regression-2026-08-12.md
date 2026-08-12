# 原始资源恢复与自主回归（2026-08-12）

## 恢复内容

- `fightscene_02`：v18 resources3 原始 UUID `c0490936-1909-46ae-a013-c986a397cee8`，750×1000，SHA-256 `b74b0e0e9ecc57c5aaa0002c797236fc79c216aa50d4a6be727406f04d66c679`。
- `fightscene_04`：v18 resources3 原始 UUID `abbaf37f-bc23-4466-985a-62b9d59738f6`，750×1000，SHA-256 `74b929f83873b8627fef00495c13bdcce1173d36c642231d2a44f6824b7e429d`。
- H05/H06/H16 的 1–4 级共 12 套、36 个原始 Spine 文件；`inspect_spine_binary.py --runtime 3.8` 均确认 Spine 3.8.99。
- 25 种普通关敌人统一消费 `VISUAL_ENEMY_ROSTER` 的 `spinePath/spineScale`；修复动态登记敌人的空模型路径。
- 主页五个侧栏入口使用原 `image/main` 图集中的 `zjm006 / zjm002_icon / zjm001_icon / zjm004 / zjm005` 精确帧。

原始背景与英雄模型的逐文件来源和哈希分别记录在：

- `evidence/assets/original/fightscene-backgrounds/manifest.json`
- `evidence/assets/original/hero-spines/manifest.json`

## 自动化门禁

- `resource-fidelity-gate.test.mjs`：25 种敌人、12 套后期英雄、2 张背景、5 个侧栏图标通过。
- 全量测试：51/51；200 关、2,978 波、54,816 个刷怪项通过。
- Golden cases：47/47。
- Creator TypeScript：通过。
- Creator 工程检查：240 assets，0 missing meta，0 warning/error。
- Web Mobile：Creator 3.8.8 新鲜构建时间 2026-08-12 18:59:56。

## Web Mobile 运行回归

- `?directBattle=1&level=1009`：进入 `1009 / 初见火山`，P01 状态 `P01:P01=0/0/0,...`，供能核心存在，0 新 warning/error。
- `?directBattle=1&level=1005`：进入 `1005 / 雪山脚下`，0 新 warning/error。
- `?visualCatalog=enemies`：等待 25 种 Spine 异步加载完成，0 `[visual-catalog]` 失败、0 新 warning/error。
- `?directBattle=1&level=1003&longRunValidation=1`：本构建覆盖正常失败重试、特质选择、回合清场与第 2 波，供能齿轮/生产/阴影/Y 深度观测均有效，missing gear/config 为 0。

本轮运行验收最初发现：直达锁定关卡时 `loadAccountProfile()` 会在动力角色状态初始化前执行回退导航，导致 P01 渲染读取未定义 `equippedRoleId`。现已把角色状态初始化提前，并让明确的 `directBattle` 验证路由与 `launchLevel()` 一致地旁路账号关卡门禁；修复后 1009 可直接进入。

完整长跑无需重复制造新结论；同日闭环仍为：1003 10/10、1100 15/15、1200 15/15、每日 10/10、无尽 293.182 秒摧毁敌方兵营。结构化数据见 `evidence/runtime/final-presentation-and-long-run-closure-2026-08-12/manifest.json`。
