# Cocos LocalData Inventory

- Source: `E:\Projects\weichatAnalysis\cangshu\reverse-work\resources\wxf9af2417e78ce07a\18\resources3\localData.4952c.bin`
- ZIP entries: 118
- Compact format: column count, `(type, field-token)` pairs, row count, then column-major values
- Field names resolved through `localdata/str.json` (2157 strings)

| Table | Rows | Columns | Compressed | Uncompressed | Length check | Schema |
|---|---:|---:|---:|---:|---|---|
| `activity.ActivityConfig` | 6 | 5 | 212 | 324 | True | id:t3, verifyModels:t4, showOpen:t5, showName:t3, icon_path:t3 |
| `activity.ActivityGroupConfig` | 3 | 4 | 93 | 147 | True | id:t1, activityId:t3, goodsList:t4, ui:t3 |
| `activity.ActivityGroupGoodsConfig` | 4 | 3 | 110 | 292 | True | id:t1, rewards:t4, adCost:t1 |
| `activity.feed.ActivityFeedConstantConfig` | 1 | 2 | 39 | 37 | True | id:t3, content:t3 |
| `activity.inviteGift.InviteGiftConfig` | 1 | 4 | 71 | 91 | True | id:t1, count:t1, chapterId:t1, rewards:t4 |
| `activity.sevenDay.SevenDayConfig` | 7 | 6 | 185 | 304 | True | id:t1, type:t1, rewards:t4, showItem:t4, showName:t3, extraItemIds:t4 |
| `activity.threeDay.ThreeDayConfig` | 3 | 2 | 75 | 169 | True | id:t1, rewards:t4 |
| `advertising.AdvertisingConfig` | 16 | 4 | 215 | 360 | True | id:t1, type:t3, param:t3, advertTimes:t1 |
| `baglike.BagLikeAbilityConfig` | 84 | 8 | 2155 | 7834 | True | id:t3, icon:t3, quality:t1, effectCfgId:t3, range:t4, attr:t4, name:t3, desc:t3 |
| `baglike.BagLikeAbilityEffectConfig` | 78 | 14 | 3160 | 13290 | True | id:t3, group:t3, effectiveId:t3, rangeType:t3, range:t4, verifys:t4, conditions:t4, weight:t1, times:t1, icon:t3, quality:t1, name:t3, desc:t3, noRestore:t1 |
| `baglike.BagLikeAbilityEffectiveConfig` | 93 | 4 | 997 | 2935 | True | id:t3, effectType:t3, param:t4, attr:t4 |
| `baglike.BagLikeCoinWeightConfig` | 100 | 3 | 248 | 1339 | True | id:t1, rewardWeight:t4, itemWeight:t4 |
| `baglike.BagLikeConstantConfig` | 31 | 2 | 446 | 1306 | True | id:t3, content:t3 |
| `baglike.BagLikeItemConfig` | 68 | 15 | 1419 | 6399 | True | id:t3, shapeId:t1, level:t1, material1:t3, material2:t3, nextId:t3, type:t3, skill0:t4, params:t4, headPath:t3, modelId:t3, verifys:t4, name:t3, desc:t3, showEffects:t4 |
| `baglike.BagLikeLevelConfig` | 100 | 2 | 161 | 705 | True | id:t1, exp:t1 |
| `baglike.BagLikeShapeConfig` | 11 | 9 | 279 | 708 | True | id:t1, panel:t3, icon:t3, adIcon:t3, mergeLightPath:t3, modelId:t3, panelRotate:t1, rolePos:t4, shapeArr:t4 |
| `battle.AttributeConfig` | 23 | 10 | 767 | 1734 | True | id:t3, attrName:t3, attrDesc:t3, tid:t1, type:t1, max:t1, min:t1, name:t3, icon:t3, isPermyriad:t1 |
| `battle.BattleConfig` | 2 | 15 | 198 | 319 | True | id:t1, name:t3, fightType:t3, icon:t3, fightMaxSecond:t1, quitFight:t5, monsterResourceIds:t4, mapId:t1, atkMod:t1, defMod:t1, hpMod:t1, secondAttrAddition:t4, power:t1, cpDamageMod:t3, pveMinWarnFight:t1 |
| `battle.BattleConstantConfig` | 36 | 2 | 726 | 1590 | True | id:t3, content:t3 |
| `battle.BattleSettingClientConfig` | 0 | 0 | 4 | 2 | True |  |
| `battle.BattleSettingConfig` | 3 | 7 | 124 | 172 | True | fightType:t3, initGridArea:t4, initSpGridArea:t4, totalTime:t1, lvMode:t1, showRound:t5, hasDropGold:t5 |
| `battle.BehaviorConfig` | 126 | 17 | 1478 | 10112 | True | id:t3, rangeType:t1, rangeParam:t4, byAtkDistance:t5, notSelf:t1, num:t1, targetFaction:t1, targetType:t1, targetParam:t4, shake:t4, animPosType:t1, modelId:t4, param:t4, behavior:t4, behaviorDelay:t4, effectType:t3, effectParam:t4 |
| `battle.BuffConfig` | 34 | 24 | 1014 | 3415 | True | id:t3, name:t3, desc:t3, group:t3, effectType:t3, effectParam:t4, effectParam2:t4, inheritTime:t1, endParam:t4, layer:t1, countLimit:t1, interval:t1, conditionType:t1, stateType:t1, isCtrlBuff:t1, abnormalType:t1, notExitBattleOutBuff:t1, range:t1, num:t1, targetFaction:t1, notSelf:t1, targetType:t1, targetParam:t4, missileNum:t1 |
| `battle.BuffGroupConfig` | 35 | 14 | 429 | 2610 | True | id:t3, flag:t1, flagParm:t4, isBreak:t1, animPosType:t1, modelId:t4, upLow1:t4, animPosType2:t1, modelId2:t4, upLow2:t4, param:t4, icon:t3, timeLimit:t1, buff:t4 |
| `battle.ClientDropConfig` | 0 | 0 | 4 | 2 | True |  |
| `battle.CollectionSkillConfig` | 0 | 0 | 4 | 2 | True |  |
| `battle.FormationSkillConfig` | 0 | 0 | 4 | 2 | True |  |
| `battle.GunConfig` | 0 | 0 | 4 | 2 | True |  |
| `battle.GunGroupConfig` | 0 | 0 | 4 | 2 | True |  |
| `battle.HaloConfig` | 0 | 0 | 4 | 2 | True |  |
| `battle.MissileConfig` | 36 | 17 | 863 | 3687 | True | id:t3, speed:t1, timeLimit:t1, distance:t1, type:t1, parameter:t4, layer:t1, animPosType:t1, effectModelId:t4, modelId:t3, notLoop:t1, behaviors:t4, delays:t4, hitTips:t4, pos:t4, shootSound:t3, hitSound:t3 |
| `battle.MonsterResourceConfig` | 0 | 0 | 4 | 2 | True |  |
| `battle.PassivitySkillConfig` | 27 | 20 | 681 | 3048 | True | id:t3, name:t3, desc:t3, group:t3, belongType:t3, subType:t1, exitClearCd:t1, notHatred:t1, precd:t1, interval:t1, cd:t1, condition:t1, conditionValue:t4, conditionValue2:t4, conditionNow:t1, statusGroup:t4, behavior_0:t4, behavior_1:t4, skills:t4, skillParm:t4 |
| `battle.SkillChargedShowConfig` | 0 | 0 | 4 | 2 | True |  |
| `battle.SkillConfig` | 90 | 51 | 2651 | 20000 | True | id:t3, group:t3, belongType:t3, level:t1, name:t3, careerCount:t1, type:t1, subType:t1, subTypeParm:t4, precd:t1, cd:t1, showCd:t4, castTime:t1, skills:t4, castingRange:t1, targetFaction:t1, clearTarget:t1, targetType:t1, targetParam:t4, notHatred:t1, isByAtkSpeed:t1, atkSpeed:t1, behavior_0:t4, behavior_1:t4, behavior_2:t4, behavior_3:t4, behavior_4:t4, behavior_5:t4, behavior_6:t4, behavior_7:t4, behavior_8:t4, behavior_9:t4, icon:t3, desc:t3, rangeDescType:t3, anim:t3, animList:t4, anim2:t3, rotateBoneName:t4, atkPoint:t4, activeSkill:t4, activeSkillNoRefreshCD:t1, horseSkill:t3, talk:t4, talkProbability:t1, skillAttrs:t4, shake:t4, cpWorth:t1, cpMod:t1, skillSound:t3, soundDelay:t2 |
| `battle.SkillEffectConfig` | 14 | 12 | 179 | 699 | True | id:t3, anim:t3, animLoopTimes:t1, animHorse:t3, sceneEffect:t1, layer:t1, animPosType:t1, modelId:t4, modelUpId:t4, bgModelId:t4, bgModelUpId:t4, param:t4 |
| `battle.SummonConfig` | 0 | 0 | 4 | 2 | True |  |
| `battleFruit.FruitBuffEffectConfig` | 12 | 3 | 170 | 401 | True | id:t3, type:t3, effect:t4 |
| `battleFruit.FruitBuffPoolConfig` | 17 | 9 | 286 | 1701 | True | id:t3, heroId:t3, effectId:t3, weight:t1, times:t1, icon:t3, quality:t1, name:t3, desc:t3 |
| `battleFruit.FruitBulletConifg` | 2 | 10 | 146 | 239 | True | id:t3, speed:t1, asset:t3, size:t4, passTimes:t1, backTimes:t1, splitCnt:t1, splitTimes:t1, offsetX:t1, angleArea:t4 |
| `battleFruit.FruitConstantConfig` | 4 | 2 | 107 | 135 | True | id:t3, content:t3 |
| `battleFruit.FruitHeroConfig` | 3 | 5 | 96 | 173 | True | id:t3, name:t3, headPath:t3, modelId:t3, skillId:t3 |
| `battleFruit.FruitMonsterBodyConfig` | 20 | 8 | 229 | 733 | True | id:t3, hp:t2, size:t4, bodyNum:t1, buffCnt:t1, staticBuffs:t4, boxPath:t3, bodyPath:t3 |
| `battleFruit.FruitMonsterConfig` | 1 | 9 | 164 | 253 | True | id:t3, speed:t1, backSpeed:t1, headPath:t3, bodys:t4, offset:t1, hitAnimInterval:t1, deadResidualTime:t1, path:t3 |
| `battleFruit.FruitSkillConfig` | 3 | 11 | 157 | 242 | True | id:t3, type:t3, cdTime:t1, effectId:t3, bulletCnt:t1, triggerPos:t4, range:t4, duration:t1, triggerTimes:t1, triggerDelay:t1, damage:t1 |
| `common.ConfigValue` | 13 | 2 | 294 | 571 | True | id:t3, content:t3 |
| `common.LoadingTipsConfig` | 3 | 2 | 65 | 126 | True | id:t1, content:t3 |
| `condition.ConditionConfig` | 3 | 5 | 170 | 550 | True | id:t3, title:t3, unlockTxt:t3, message:t3, jumpId:t1 |
| `dailyInstance.DailyInstanceConfig` | 10 | 6 | 101 | 289 | True | id:t1, roundIds:t4, name:t3, logoSpine:t3, fightscene:t3, initRewards:t4 |
| `dailyInstance.DailyInstanceConstantConfig` | 1 | 2 | 54 | 57 | True | id:t3, content:t3 |
| `dailyInstance.DailyInstanceEffectConfig` | 12 | 8 | 629 | 1431 | True | id:t3, effectiveId:t3, rangeType:t3, range:t4, icon:t3, type:t1, name:t3, desc:t3 |
| `dailyInstance.DailyInstanceRandomConfig` | 10 | 3 | 174 | 736 | True | id:t1, dailyInstanceId:t3, buffIds:t4 |
| `dailyInstance.DailyInstanceRewardConfig` | 200 | 7 | 4467 | 49074 | True | id:t1, cost:t4, rewardRounds:t4, rewards1:t4, rewards2:t4, rewards3:t4, rewards4:t4 |
| `dailyInstance.DailyInstanceRuleConfig` | 3 | 5 | 53 | 78 | True | id:t1, icon:t3, quality:t1, title:t3, desc:t3 |
| `dailytask.DailyActiveBoxConfig` | 5 | 3 | 125 | 208 | True | id:t1, rewards:t4, dailyActive:t1 |
| `dailytask.DailyTaskConfig` | 7 | 8 | 250 | 568 | True | id:t1, condition:t4, eventType:t3, content:t3, totalProgress:t1, activeScore:t1, desc:t3, jumpId:t1 |
| `dailytask.WeeklyActiveBoxConfig` | 5 | 3 | 92 | 121 | True | id:t1, rewardText:t3, needWeekScore:t1 |
| `formation.FormationConstantConfig` | 2 | 2 | 82 | 107 | True | id:t3, content:t3 |
| `formation.FormationPositionConfig` | 6 | 2 | 34 | 51 | True | id:t1, openVerify:t3 |
| `gameplay.GameplayConfig` | 3 | 6 | 192 | 304 | True | id:t1, moduleId:t3, bg:t3, showRewards:t4, name:t3, desc:t3 |
| `guide.GuideConfig` | 26 | 19 | 776 | 2912 | True | id:t1, nextId:t1, group:t1, partId:t1, savePoint:t1, passEnd:t1, type:t3, typeParam:t4, plot:t4, isForce:t5, triggerCondition:t4, finishCondition:t4, maskAlpha:t1, UI:t3, item:t3, focusAni:t4, script:t3, scriptParam:t4, canJump:t1 |
| `guide.GuideConstantConfig` | 3 | 2 | 101 | 145 | True | id:t3, content:t3 |
| `guide.GuideDialogConfig` | 20 | 12 | 823 | 1815 | True | id:t1, group:t1, xPercent:t1, yPercent:t1, yToBottom:t1, npcName:t3, time:t1, npcModel:t1, npcHead:t3, npcPos:t4, sound:t3, text:t3 |
| `guide.GuideGroupConfig` | 3 | 4 | 51 | 83 | True | groupId:t1, openVerify:t4, closeVerify:t4, endGuideId:t1 |
| `guide.GuideTeachConfig` | 6 | 10 | 201 | 472 | True | id:t1, group:t1, icon:t3, startUI:t3, startItem:t3, endUI:t3, endItem:t3, endIconStyle:t1, time:t1, dialogId:t1 |
| `guide.TrunkTaskGuideConfig` | 3 | 22 | 237 | 507 | True | id:t1, nextId:t1, group:t1, partId:t1, savePoint:t1, passEnd:t1, type:t3, typeParam:t4, plot:t4, isForce:t5, battle:t3, time:t3, triggerCondition:t4, finishCondition:t4, maskAlpha:t1, UI:t3, item:t3, fingerPos:t4, maskInverted:t4, script:t3, scriptParam:t4, canJump:t1 |
| `guide.TrunkTaskGuideGroupConfig` | 1 | 4 | 40 | 47 | True | groupId:t1, openVerify:t4, closeVerify:t4, endGuideId:t1 |
| `hero.HeroConfig` | 18 | 23 | 727 | 2066 | True | id:t3, name:t3, type:t3, unitType:t1, sort:t1, fragmentItemId:t3, shapeId:t1, initStar:t1, upStarType:t1, headPath:t3, searchRange:t1, atk:t1, hp:t1, baseSecondAttrs:t4, skill1:t3, skill2:t3, skill3:t3, skill4:t3, skill5:t3, skill6:t3, skill7:t3, unlockCondition:t4, formationEffectives:t4 |
| `hero.HeroConstantConfig` | 3 | 2 | 102 | 123 | True | id:t3, content:t3 |
| `hero.HeroStarConfig` | 40 | 9 | 322 | 1320 | True | id:t1, type:t1, star:t1, quality:t1, cost:t1, costGold:t1, unlockSkillPos:t1, attrModifier:t1, normalRecruitWeightMod:t1 |
| `i18n.I18nConfig` | 581 | 3 | 6437 | 30689 | True | id:t3, Chinese:t3, English:t3 |
| `i18n.I18nErrorCodeConfig` | 843 | 3 | 9709 | 44158 | True | id:t3, Chinese:t3, English:t3 |
| `i18n.I18nTipsConfig` | 270 | 3 | 5011 | 13755 | True | id:t3, Chinese:t3, English:t3 |
| `item.ItemConfig` | 50 | 24 | 1360 | 7624 | True | id:t3, name:t3, bagId:t1, showBackpackFlag:t5, type:t3, secondsType:t3, itemType:t3, quality:t1, sortId:t1, holdingCountLimit:t1, stackLimit:t1, isRed:t1, iconPath:t3, smallIconPath:t3, bigIconPath:t3, desc:t3, showLvFlag:t5, buyJumpId:t1, way:t4, comeFromText:t3, rewardId:t1, adWords:t3, priceDiamond:t1, priceGold:t1 |
| `item.ItemConstantConfig` | 2 | 2 | 77 | 82 | True | id:t3, content:t3 |
| `item.ItemGetAnimConfig` | 5 | 11 | 203 | 533 | True | id:t1, smallIconPath:t3, radius:t1, random:t1, maxCount:t1, uiKey:t3, compPaths:t4, fixPos:t4, callBegin:t3, callback:t3, endPos:t4 |
| `jump.JumpConfig` | 5 | 5 | 146 | 229 | True | id:t1, type:t3, keyName:t3, needModuleName:t3, args:t4 |
| `mainpage.MainPageHeaderItemConfig` | 4 | 4 | 85 | 104 | True | id:t1, itemId:t3, canBuyFlag:t5, progressColor:t3 |
| `mainpage.MainPageKvConfig` | 5 | 2 | 146 | 239 | True | id:t3, value:t3 |
| `mainpage.MainPageTabItemConfig` | 14 | 17 | 482 | 1238 | True | id:t1, sideType:t3, sort:t1, systemId:t3, nameForClient:t3, activityIds:t4, showName:t3, conditionText:t4, modelId:t1, showEffect:t5, iconEffect:t4, isShowInFold:t5, showEndTime:t5, iconNormalAssetPath:t3, iconModelId:t3, viewName:t3, viewArge:t3 |
| `mainpage.MainPageTabListConfig` | 5 | 4 | 82 | 109 | True | type:t3, layout:t1, maxRow:t1, showFoldCnt:t1 |
| `model.ModelConfig` | 162 | 12 | 1940 | 12003 | True | id:t3, modelPath:t3, framePath:t3, spriteFrame:t1, frameAnchor:t4, pos:t4, scale:t4, action:t3, noPremultipliedAlpha:t5, cache:t1, width:t1, height:t1 |
| `monster.MonsterAttributeConfig` | 29 | 20 | 856 | 3281 | True | id:t3, name:t3, modelId:t3, showModelId:t3, belongType:t1, belongId:t1, monsterType:t3, headPath:t3, halfBodyPath:t3, atk:t1, hp:t1, exp:t1, searchRange:t1, size:t1, hp_show:t3, skillIds:t4, passivitySkils:t4, gold:t1, desc:t3, baseSecondAttrs:t4 |
| `onlineReward.OnlineRewardConfig` | 6 | 3 | 79 | 133 | True | id:t1, time:t1, rewards:t4 |
| `otherGames.OtherGamesConfig` | 1 | 4 | 64 | 67 | True | id:t1, moduleId:t3, icon:t3, name:t3 |
| `power.PowerAbilityConfig` | 36 | 8 | 810 | 2940 | True | id:t3, powerId:t3, star:t1, desc:t3, skillId:t3, effectType:t3, param:t4, attr:t4 |
| `power.PowerConfig` | 4 | 9 | 344 | 1234 | True | id:t3, name:t3, modelId:t3, bigModelId:t3, quality:t1, fragmentItemId:t3, skills:t4, activeskillId:t3, desc:t3 |
| `power.PowerConstantConfig` | 7 | 2 | 162 | 285 | True | id:t3, content:t3 |
| `power.PowerLevelConfig` | 180 | 4 | 1375 | 14344 | True | level:t1, costItems:t4, attrs1:t4, attrs2:t4 |
| `power.PowerSkillConfig` | 12 | 11 | 214 | 745 | True | id:t3, group:t3, anim:t3, triggerType:t3, effectType:t3, param:t4, preEnergy:t1, maxEnergy:t1, time:t1, icon:t3, buff:t3 |
| `power.PowerStarConfig` | 9 | 5 | 108 | 184 | True | id:t1, star:t1, cost:t1, attrs:t4, maxLevel:t1 |
| `quality.QualityConfig` | 6 | 15 | 393 | 1579 | True | id:t1, desc:t3, fontColorType:t3, fontColor:t3, fontColor2:t3, fontColor3:t3, itemBgPath:t3, heroBgPath:t3, heroLvBgPath:t3, heroShapeBgPath:t3, skillBgPath:t3, buffBgPath:t3, bloodBgPath:t3, monsterBgPath:t3, fruitBuffBgPath:t3 |
| `rank.RankingConfig` | 25 | 17 | 901 | 6314 | True | id:t3, groupType:t3, tabType:t3, name:t3, tabName:t3, rankValuePrefixText:t3, rankSuffixText:t3, rankValueSmallLogo:t3, tapId:t1, isShowPrivate:t1, limit:t1, verifyStr:t4, systemType:t1, priority:t1, titleIcon:t3, icon1:t3, icon:t3 |
| `rank.RankingSubTypeTabConfig` | 4 | 6 | 113 | 274 | True | id:t1, rankType:t3, subType:t2, name:t3, bg:t3, fg:t3 |
| `recruit.RecruitConfig` | 2 | 8 | 176 | 250 | True | id:t1, type:t3, openCondition:t4, poolIdForNormal:t1, poolIdForXinYuan:t1, costItems:t4, costItems2:t4, costShopId:t1 |
| `recruit.RecruitConstantConfig` | 7 | 2 | 220 | 341 | True | id:t3, content:t3 |
| `recruit.RecruitMainViewAnimConfig` | 6 | 3 | 110 | 303 | True | id:t1, spinePath:t3, animName:t3 |
| `reward.RewardDropConfig` | 48 | 4 | 817 | 5616 | True | id:t1, type:t3, rewardType:t3, rewards:t4 |
| `rule.RuleConfig` | 2 | 3 | 42 | 47 | True | id:t1, title:t3, viewH:t1 |
| `rule.RuleItemConfig` | 7 | 6 | 325 | 424 | True | id:t1, groupId:t1, icon:t3, quality:t1, title:t3, desc:t3 |
| `setting.SettingCodeConfig` | 7 | 3 | 132 | 438 | True | id:t3, type:t1, rewards:t4 |
| `shop.ShopBoxConfig` | 20 | 4 | 248 | 1267 | True | id:t1, exp:t1, rewardId:t1, showRewards:t4 |
| `shop.ShopConfig` | 4 | 3 | 95 | 196 | True | id:t1, refreshType:t3, shopName:t3 |
| `shop.ShopConstantConfig` | 4 | 2 | 89 | 137 | True | id:t3, content:t3 |
| `shop.ShopGoodsConfig` | 13 | 9 | 327 | 782 | True | id:t1, shopId:t1, rewardId:t1, cost:t4, discount:t4, canManualRefresh:t5, name:t3, icon:t3, sort:t1 |
| `shop.ShopGoodsLimitBuyConfig` | 6 | 2 | 133 | 365 | True | id:t3, refreshStr:t3 |
| `shop.ShopManualRefreshConfig` | 20 | 4 | 87 | 322 | True | id:t1, shopId:t1, refreshTimes:t1, cost:t4 |
| `skin.SkinConfig` | 23 | 13 | 711 | 3051 | True | id:t3, heroId:t3, isDefault:t5, sort:t1, name:t3, quality:t1, fragmentItemId:t3, activeCostFragment:t1, headPath:t3, smallHeadPaths:t4, modelIds:t4, baseAttrs:t4, upAttrs:t4 |
| `skin.SkinConstantConfig` | 11 | 2 | 223 | 441 | True | id:t3, content:t3 |
| `skin.SkinLevelConfig` | 30 | 5 | 141 | 496 | True | id:t1, quality:t1, level:t1, cost:t1, chestWeightMod:t1 |
| `totalReward.TotalRewardConfig` | 95 | 3 | 343 | 1167 | True | id:t1, adTimes:t1, rewards:t4 |
| `trunkinstance.TrunkInstanceClickConfig` | 1 | 7 | 97 | 206 | True | id:t1, trunkid:t1, rewards1:t4, rewards2:t4, times1:t1, times2:t1, times:t1 |
| `trunkinstance.TrunkInstanceConfig` | 200 | 22 | 13089 | 65360 | True | id:t1, chapter:t1, roundIds:t4, cost:t4, rewardRounds:t4, rewards1:t4, rewards2:t4, rewards3:t4, name:t3, logoSpine:t3, fightscene:t3, initRewards:t4, staticBuffs:t4, staticBricks:t4, homeHp:t1, enemyHomeHp:t1, enemyHomeGold:t1, atkMultiple:t1, hpMultiple:t1, goldMultiple:t1, recommendHeroIds:t4, newMonsterIds:t4 |
| `trunkinstance.TrunkInstanceConstantConfig` | 13 | 2 | 227 | 506 | True | id:t3, content:t3 |
| `trunkinstance.TrunkInstanceDefeatConfig` | 15 | 3 | 86 | 210 | True | id:t1, atkMultiple:t1, hpMultiple:t1 |
| `trunkinstance.TrunkInstanceRoundConfig` | 3009 | 8 | 14455 | 147739 | True | id:t1, round:t1, monsterTimes:t4, monsterIds:t4, atkMultiple:t1, hpMultiple:t1, rewards:t4, coinRewards:t4 |
| `verify.ModuleEntranceConfig` | 42 | 4 | 392 | 906 | True | id:t3, type:t1, uiName:t3, itemPath:t3 |
| `verify.PlayerSystemOpenConfig` | 17 | 13 | 550 | 1252 | True | id:t3, verifyModels:t4, lockDesc:t3, serverOpenDays:t1, seeVerify:t3, iosAppExamineHide:t1, appExamineHide:t1, iosMiniExamineHide:t1, miniExamineHide:t1, jumpId:t1, showOpen:t5, showName:t3, icon_path:t3 |
