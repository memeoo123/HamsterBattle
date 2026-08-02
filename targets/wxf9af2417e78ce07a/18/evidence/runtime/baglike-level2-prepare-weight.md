# BagLike 准备刷新二级齿轮权重能力

## 结论

[已确认] `RG_ALL_abl11_eff01` 是品质 3、权重 10、最多选择 1 次的能力，描述为
“备战阶段免费刷新时，提升2级齿轮出现概率”。`ConditionWaveTimes` 对配置区间执行反向
资格判断，因此 `WAVE_TIMES/11/15` 让它在第 1–10 波可选、在代表关卡 1004 的第
11–15 波不可选。

[已确认] 版本 18 中这张能力会被正常抽取、选择并记录次数，但不会改变候选齿轮概率。
其消费者 `ADD_LEVEL2_GEAR` 写入临时权重键 `REWARD/3012`、倍率 `20000`；同版本完整且通过
长度校验的 `RewardDropConfig` 没有 ID `3012`，实际二级齿轮池是 `3015`。`RewardMgr`
按 reward type 与字符串化 ID 精确匹配，没有 `3012 → 3015` 的别名或转换。因此完全复原
必须保留这个配置断链，不能把目标擅自改成 `3015`。

[已确认] 临时权重只在 `refreshType=Prepare` 的动态权重抽取分支安装，在该批抽取结束后清空。
这里的 Prepare 是每波自动发牌；本局首次不扣金币的普通刷新仍是 `Normal`，广告刷新是 `Ad`，
二者都不安装该能力。关卡静态教学批次也在进入临时权重分支之前直接返回，不受它影响。

## 证据链

- `reverse-work/.../baglike.BagLikeAbilityEffectConfig.json:331`：能力 ID、
  `WAVE_TIMES/11/15`、`weight=10`、`times=1`、`quality=3` 与原描述。
- `reverse-work/.../baglike.BagLikeAbilityEffectiveConfig.json:111-116`：消费者为
  `SPECIAL_WORD`，参数是 `ADD_LEVEL2_GEAR, 3012, 20000`。
- `work/gear-upgrade-analysis/ConditionWaveTimes.ts.deobfuscated.js`：当前波次取
  `curRound + 1`，配置区间内返回检查失败。
- `work/battlefield-runtime-analysis/formatted/BagLikeBuffManager.ts.deobfuscated.js`：
  `ADD_LEVEL2_GEAR` 保存 `dropId` 与 `weightMultiple`。
- `work/battlefield-runtime-analysis/formatted/BagLilkeManager.ts.deobfuscated.js`：只在
  `Prepare` 调用 `RewardMgr.addTempWeightRate(REWARD, dropId, weightMultiple)`；静态批次绕过该
  路径，动态批次结束后调用 `clearTempWeightRate`。
- `work/gear-upgrade-analysis/RewardMgr.ts.deobfuscated.js`：临时倍率按精确 type 和
  `id.toString()` 存取，倍率换算为 `value / 10000`，没有 ID 别名。
- `reverse-work/.../reward.RewardDropConfig.json`：3000–3004 分支引用 3014/3015/3016；
  3015 是二级 BAGITEM 池，整表不存在 3012。

## 复原接入与验证

- `BagLikeProgression.ts` 把该卡加入原权重池，保留 3012、20000、一次上限和波次条件，并在
  被选择时生成精确的临时 REWARD 修正项。
- `BagLikeCandidateDrops.ts` 实现通用的精确 reward-ID 倍率路径，但只允许 Prepare 使用。
  生产测试同时证明：真实目标 3015 会改变确定性权重边界，而竞品配置的 3012 在同一边界
  保持原结果，所以实现并非把整个修正逻辑空置。
- `CangshuGame.ts` 只在动态自动准备发牌中传入能力修正；静态批次、Normal 和 Ad 均保持
  原路径。
- `baglike-traits.test.mjs`：27 项通过；`baglike-candidate-drops.test.mjs`：21 项通过。
  全部 7 组规则测试合计 367 项通过，Creator 3.8.8 随附 TypeScript 检查退出码 0。
