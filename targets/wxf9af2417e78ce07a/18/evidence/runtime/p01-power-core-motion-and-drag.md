# P01 动力核心旋转与拖动验证（2026-08-12）

## 竞品证据

- `BrickShowBaseCom.ts.deobfuscated.js`：POWER 的面板节点每 `lapTime / 4` 连续转过 90°；完成一段后按右、下、左、上的顺序检查相邻格，命中占用格会插入 `getDelayTime()` 暂停。
- 同一组件把当前装备角色加载到独立 `modelNode`，循环播放 `aniNameForBattle`，因此角色不会跟随齿轮倒转。
- `BagLikeDragListCtrl.ts.deobfuscated.js`：所有存在 `itemSid` 的棋盘物件共用拖动入口，没有排除 POWER。
- `BagLikeItemCell.ts.deobfuscated.js` 与 `BagLikeView.ts.deobfuscated.js`：普通齿轮只在收到动力触发时旋转，啮合相位使用当前动力格索引。
- `bagLike.layout.json`：`power1.png` 位于 `bagLike_0.png` 的 `(775,341,108,102)`，原始尺寸 `114×114`。

## 还原实现

- P01 使用原始 `power1.png` 金色动力齿轮，并与仓鼠表现拆成 `PowerCoreRotor` / `PowerCoreHamster` 两层。
- 动力齿轮沿连续四分之一圈时钟旋转；有接触的一侧保持恢复出的 0.2 秒暂停，准备态与战斗态不重置相位。
- P01 在准备态共用棋盘拖动控制器。有效落点更新真实行列与动力索引；无效落点回原位；普通齿轮仍不能覆盖当前动力格。
- P01 移位后，普通齿轮的 22.5° 啮合相位按新的动力索引重算；普通齿轮仍只在被触发时完成一整圈。
- 当前仓鼠层使用已恢复 P01 头像做独立循环位移/轻微形变，确保可见移动且不随齿轮旋转。竞品使用的 P01 Spine 模型路径已确认，但三件原始资源尚未纳入工程，因此不声称逐骨骼动画已完全匹配。

## 验证

- `battlefield-production.test.mjs`：48 项通过，包含起始角、半圈进度、占用侧暂停、整圈回绕、P01 拖动入口、动态动力格与分层节点。
- 全量 `cocosProject/tests/*.test.mjs`：44/44 文件通过。
- Creator 3.8.8 项目 TypeScript：`--noEmit --skipLibCheck true` 退出码 0。
- Creator 3.8.8 Web Mobile：2026-08-12 10:51 新构建完成。
- 1004 浏览器实测：初始 `P01#1@2,3`，拖到上方空格后为 `P01#1@1,3`；移位后的连续样本为 `243.3° → 297.3° → 351.4° → 45.4°`，仓鼠局部坐标同步变化，warning/error 为 0。

