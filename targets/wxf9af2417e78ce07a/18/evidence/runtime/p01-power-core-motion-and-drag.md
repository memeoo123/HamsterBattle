# P01 动力核心旋转与拖动验证（2026-08-12，2026-08-13 修订）

## 竞品证据

- `BrickShowBaseCom.ts.deobfuscated.js`：POWER 的面板节点每 `lapTime / 4` 连续转过 90°；完成一段后按右、下、左、上的顺序检查相邻格，命中占用格会插入 `getDelayTime()` 暂停。
- 同一组件把当前装备角色加载到独立 `modelNode`，循环播放 `aniNameForBattle`，因此角色不会跟随齿轮倒转。
- `BagLikeDragListCtrl.ts.deobfuscated.js`：所有存在 `itemSid` 的棋盘物件共用拖动入口，没有排除 POWER。
- `BagLikeItemCell.ts.deobfuscated.js` 与 `BagLikeView.ts.deobfuscated.js`：普通齿轮只在收到动力触发时旋转，啮合相位使用当前动力格索引。
- `bagLike.layout.json`：`power1.png` 位于 `bagLike_0.png` 的 `(775,341,108,102)`，原始尺寸 `114×114`。
- 2026-08-13 用户对竞品运行阶段的直接观察纠正了此前仅凭组件生命周期作出的阶段推断：准备阶段中心动力齿轮静止，进入战斗后才启动；当前重建的 1 秒视觉整圈明显过快。该观察作为阶段门禁证据，精确视觉转速在缺少原始录像逐帧计时的情况下仍标为近似。

## 还原实现

- P01 使用原始 `power1.png` 金色动力齿轮，并与仓鼠表现拆成 `PowerCoreRotor` / `PowerCoreHamster` 两层。
- 准备态把动力齿轮、仓鼠层和生产时钟固定在初始姿态；每波开战时从 0° 和方向 1 重新启动。
- 原表 `P01.params=[1000,200,10000]` 仍驱动生产触发的 1 秒整圈与 0.2 秒接触延迟，不改出兵平衡；中心齿轮的视觉旋转独立降为 4 秒一圈，避免旧实现把生产频率直接当作可见转速。
- P01 在准备态共用棋盘拖动控制器。有效落点更新真实行列与动力索引；无效落点回原位；普通齿轮仍不能覆盖当前动力格。
- P01 移位后，普通齿轮的 22.5° 啮合相位按新的动力索引重算；普通齿轮仍只在被触发时完成一整圈。
- 当前仓鼠层使用已恢复 P01 头像做独立循环位移/轻微形变，确保可见移动且不随齿轮旋转。竞品使用的 P01 Spine 模型路径已确认，但三件原始资源尚未纳入工程，因此不声称逐骨骼动画已完全匹配。

## 验证

- `battlefield-production.test.mjs`：51 项通过，包含准备态门禁、战斗态启动、4 秒视觉整圈、生产时钟、P01 拖动入口、动态动力格与分层节点。
- 全量 `cocosProject/tests/*.test.mjs`：54/54 文件通过；Golden 47/47。
- Creator 3.8.8 项目 TypeScript：`--noEmit --skipLibCheck true` 退出码 0。
- Creator 3.8.8 Web Mobile：2026-08-13 12:13 新构建完成。
- 1004 浏览器实测：准备态相隔 1.2 秒的 `powerCore/powerClock` 均保持 `0.0° / 1:0.250`；开战后约一秒间隔连续样本为 `46.5° → 138.1° → 231.2°`，约 90°/秒，即 4 秒一圈；warning/error 为 0。新证据见 `evidence/runtime/p01-battle-only-motion-2026-08-13/manifest.json`。
