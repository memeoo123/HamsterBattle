# 战斗结束敌军血条残留修复（2026-08-12）

## 现象与根因

- 最后一名敌军死亡时，`killUnit` 会立刻把它从 `units` 战斗数组移除，但单位根节点会继续保留 0.42 秒播放死亡动画。
- 回合胜利随后调用 `clearUnits()`；旧实现只遍历 `units`，因此无法处理已经移出数组、仍等待销毁的最后一名敌军节点。
- 致死伤害发生后没有再绘制该单位血条，旧的血条几何因而会与死亡节点一起短暂残留。这造成“逻辑已完成，但敌军血条还在”的表现错位。

## 修复

- `killUnit` 在逻辑死亡的同一时刻清空并关闭 HP 节点，同时关闭阴影；单位身体仍可完成死亡动画。
- 新增 `dyingUnitNodes`，跟踪已退出逻辑数组但仍在播放死亡动画的节点。
- `clearUnits` 同时清理活动单位和死亡动画节点，并在 `destroy()` 前先把节点设为 inactive，避免 Cocos 延迟销毁造成一帧残影。
- `drawUnitHp` 增加死亡/零血量保护，任何后续绘制路径都不能重新显示死亡单位血条。

## 证据与验证

- 恢复源码 `BattleUnit.onDie` 明确在死亡时隐藏阴影，`BattleUnit.dispose` 负责释放单位附属表现；本次按这个生命周期修复，没有删除正常战斗中的死亡动画。
- 新增 `battlefield-terminal-presentation.test.mjs`：8 项结算表现契约通过。
- 项目全量测试：48/48 通过；包含 200 关、2,978 波、54,816 个刷怪项。
- Cocos Creator 3.8.8 TypeScript：通过。
- `check_cocos_project.py`：186 个资源文件、0 missing meta、0 errors、0 warnings。
- Web Mobile 构建产物于 2026-08-12 14:51 更新。
- 新鲜 `19281` 构建预览运行 1004 长跑，在第 3 波捕获到真实 `roundClear`：`enemyUnits=0`、`unitDepth=""`、`unitShadows=0`，控制台 0 warning/error。空 `unitDepth` 证明已从单位层同步移除最后一个死亡动画根节点及其 HP 子节点。
