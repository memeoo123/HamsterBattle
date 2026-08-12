# 关外、逐帧与后三种融合表现闭环（2026-08-12）

## 结果

- 关外底栏已按原版 `image/main` 图集恢复商店、角色、战斗、培养、活动五个图标，顺序保持 `SHOP → ROLE → TRUNK_INSTANCE → HERO → GAMEPLAY`。顶部数值和加号颜色分别校正为 `#FFFEFE`、`#FFE329`。
- 从原包 `FrameAnim.ts` 恢复 `_perFrameTime = 66.6` 毫秒；H0705、H08、H0905 以及新增 H1505 的逐帧特效统一改用该原始时基，删除 30 FPS 推定。
- H1005 恢复 R1004 飞碟鼠 Spine、H27_S1 弹体、H27_S2 核弹下层表现与 `bullet_hedan` 五次命中音效；核弹按原 `middle` 路径固定在 `(0,-160)`，覆盖 1–5 秒五段全场命中。
- H1505 恢复 H15_S1 齿轮冲撞 16 帧图集、精确 rect/offset、`351×213` 原尺寸和 `(0.5,0.2)` 锚点。
- H1805 恢复 R1005 哥吱拉 Spine；主动技使用角色自身 `skill01` 路由。原包 resources3 没有 H18_S1 主弹体资源实体，因此未伪造缺失资源。

## 验证

- Cocos 静态工程检查：202 assets，0 missing meta，0 warnings/errors。
- Creator 3.8.8 Web Mobile 构建：2026-08-12 18:34:52，日志明确 `build Task (web-mobile) Finished`。
- TypeScript：通过（`--skipLibCheck` 只跳过引擎声明，项目脚本零错误）。
- 测试：50/50 文件通过；新增 `late-fusion-presentation.test.mjs` 16 项，关外表现 25 项。
- RESTORE_SPEC ready 校验和 47 个 golden cases 全部通过。
- 本地 Web 实机：主页原图标正常显示；`late-battle` 中 H1005/H1805 真实 Spine 出兵，H1005 弹体可见，4 次出兵、1 次主动施放、2 次主动命中、4 次 H10 主弹体发射/2 次命中，`powerMissingGear=0`、`powerMissingConfig=0`，控制台 warning/error 为 0。

## 证据边界

- 当前没有授权原版关外同状态截图，因此关外工作只对齐了原配置、原图集、原颜色和可验证布局结构，不把未配对区域宣称为像素级一致。
- H18_S1 只存在逻辑引用而不在 resources3 资源表中；保留角色 Spine 攻击/技能动画，不用近似弹体代替。
