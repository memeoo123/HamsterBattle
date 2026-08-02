// Module: chunks:///_virtual/BagLilkeManager.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./BaseSingleton.ts, ./AudioEnums.ts, ./G.ts, ./FacadeManager.ts, ./UploadEventManager.ts, ./TableManager.ts, ./BattleTimer.ts, ./ArrayUtils.ts, ./RandomUtils.ts, ./StringUtils.ts, ./AttrEnum.ts, ./FightType.ts, ./GBattleIns.ts, ./NotificationKey.ts, ./GIns.ts, ./BagLikeCoinWeightDatas.ts, ./BagLikeItemDatas.ts, ./BagLikeMergeDatas.ts, ./BagLikeShapeDatas.ts, ./ADEnums.ts, ./UIBagLikeBuffConfig.ts, ./BattleInstanceController.ts, ./HeroEnums.ts, ./ItemID.ts, ./UIMainConfig.ts, ./RewardEnums.ts, ./RewardMgr.ts, ./SpecialLevelMgr.ts, ./BagLikeUsedHeroMap.ts, ./BagLilkePowerUtils.ts, ./BagLikeEnums.ts, ./UIBagLikeConfig.ts, ./PowerSkillConst.ts, ./BagLikeItemDataVo.ts
(function(t) {
    var n, i, r, o, s, m, k, _, S, g, y, p, I, B, b, L, D, N, P, F, G, V, O, x, K, W, Y, J, Z, X, q, j, $, tt, nt, it, rt, ut, ot, st;
    return PKn && EVn && (vO += rNt, pO += Yon, KO += p7, Bx += Opt), PKn && bVn && (RO += vMn), 
    PKn && RVn && (aO = "BAGLIKE", Px = ""), PKn && LVn && (SO = "BAGLIKE", EO = "BAGLIKE:MU", 
    DO = "adRe", VO = "BAGLIKE:NORMAL_REF"), PKn && bVn && (aO += TL), PKn && LVn && (WV += "Unlock", 
    kO += "BATTL", dx += "tGridI"), PKn && RVn && (vO += "LIKE:MAX"), PKn && RVn && (dx += "ndexsByS"), 
    PKn = 0, function() {
        var et;
        return GKn && EVn && (aO += SFn, vO += jmn, dx += Dut), GKn && bVn && (bO += _G, 
        EO += GAt, VO += F6t, Px += im, qx += Ta), GKn && LVn && (pO = "r"), GKn && RVn && (Bx = "getCan"), 
        GKn && LVn && (aO += ":THR", Px += "add"), GKn && RVn && (SO += ":AUTO_OPEN_SP", 
        bO += "stGri", RO += "tGr", DO += "freshBric", qx += "ddMus"), GKn && RVn && (WV += "RefreshR", 
        vO += "_BATTLE_BRI"), GKn && LVn && (kO += "E_SPEED_UP_MULTIPL"), GKn && LVn && (dx += "id"), 
        GKn = 0, (et = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A], i = t["createClass"];
        }, function(t) {
            r = t[M];
        }, function(t) {
            o = t[w];
        }, function(t) {
            s = t["SoundType"];
        }, function(t) {
            m = t[w];
        }, function(t) {
            k = t[w];
        }, function(t) {
            _ = t["UploadEventManager"];
        }, function(t) {
            S = t["TableManager"];
        }, function(t) {
            g = t[w];
        }, function(t) {
            y = t[w];
        }, function(t) {
            p = t[w];
        }, function(t) {
            I = t["StringUtils"];
        }, function(t) {
            B = t["AttrEnum"];
        }, function(t) {
            b = t["FightType"];
        }, function(t) {
            L = t[w];
        }, function(t) {
            D = t[w];
        }, function(t) {
            N = t[w];
        }, function(t) {
            P = t["BagLikeCoinWeightDatas"];
        }, function(t) {
            F = t["BagLikeItemDatas"];
        }, function(t) {
            G = t["BagLikeMergeDatas"];
        }, function(t) {
            V = t["BagLikeShapeDatas"];
        }, function(t) {
            O = t["ADType"];
        }, function(t) {
            x = t["BagLikeBuffSpecialWordType"];
        }, function(t) {
            K = t["BattleInstanceController"];
        }, function(t) {
            W = t["HeroType"];
        }, function(t) {
            Y = t["ItemID"];
        }, function(t) {
            J = t["UIMainKey"];
        }, function(t) {
            Z = t["RewardDropKeyType"];
        }, function(t) {
            X = t["RewardMgr"];
        }, function(t) {
            q = t["SpecialLevelMgr"];
        }, function(t) {
            j = t["BagLikeUsedHeroMap"];
        }, function(t) {
            $ = t["BagLilkePowerUtils"];
        }, function(t) {
            tt = t["BagLikeRefreshType"];
        }, function(t) {
            nt = t["UIBagLikeKey"], it = t["BagLikeSubType"], rt = t["BagLikeBigType"], ut = t["BagLikeBattleState"];
        }, function(t) {
            ot = t["RoleFeatureType"];
        }, function(t) {
            st = t["BagLikeItemDataVo"];
        } ], et[T] = function() {
            function C(t, n, i) {
                var r = t[n];
                t[n] = t[i], t[i] = r;
            }
            FKn && EVn && (WV += _P, VO += Wdn), FKn && bVn && (kO += pUt, SO += gF, pO += yht, 
            bO += Awn, EO += W6, Bx += M_t, Px += Kj, qx += $wt), FKn && RVn && (pO += "evive", 
            Bx += "UseGridByLeve"), FKn && LVn && (EO += "ST_GR", VO += "RESH_NO_GRID_FOR_EN", 
            KO += "RMAL_REFRESH_FOR", $x += "eplaceMaxBrickCnt er"), FKn && RVn && (aO += "EE_LV_RATE", 
            SO += "EED_CHAPTER", Px += "MustGri", qx += "tGrid error"), FKn && LVn && (bO += "dRew", 
            RO += "idRefreshT", DO += "k"), FKn && LVn && (WV += "ate", kO += "E"), FKn && RVn && (vO += "CK_TYPE"), 
            FKn = 0;
            var T = [ v, a, l, c, e, h, u, d, 0, 1, f ], A = 1;
            KVn && C(T, u, d), JVn && C(T, 1, e), ZVn && C(T, d, l), A += 1, XVn && (A += 0), 
            r[E][R]({}, NV, PV, void 0), t(vy, function(t) {
                var r, o;
                return VKn && bVn && (RO += zst), VKn && EVn && (DO += kct, KO += kzt, $x += FY), 
                VKn && RVn && (pO += "DrawIds"), VKn && LVn && (EO += "ID_REWARD_ID", KO += "_ENDLESS", 
                Bx += "l", $x += "ror:"), VKn && RVn && (bO += "ardId", RO += "imes", Px += "d", 
                qx += ":"), VKn && LVn && (DO += "DrawIds"), VKn = 0, o = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)["gridSize"] = V_, i["_gridArr"] = [], 
                    i["_usedMap"] = {}, i["maxCol"] = f, i["maxRow"] = e, i["_sid"] = void 0, i["refreshCostArr"] = void 0, 
                    i["adGetGridMaxTimes"] = void 0, i["adCoinCount"] = void 0, i["adItemLevels"] = void 0, 
                    i["threeLvRate"] = void 0, i["first"] = void 0, i["maxBrickType"] = void 0, i["failedRefreshItems"] = void 0, 
                    i["initAllBuffBlackList"] = void 0, i["notExcludeHeroIds"] = void 0, i["speedUpMultiple"] = void 0, 
                    i["speedAdTimes"] = void 0, i["autoOpenSpeedChapterIds"] = void 0, i["buffRefreshMinQuality"] = void 0, 
                    i["adGetGridUsedTimes"] = void 0, i["reviveTimes"] = 0, i["notUseGridIds"] = new Set, 
                    i["refreshTimes"] = 0, i["refreshTimesPerRound"] = 0, i["failedTimes"] = 0, i["noAdRefreshTimes"] = 0, 
                    i["totalRefreshTimes"] = void 0, i["useFailedItems"] = !1, i["chooseCacheDatas"] = void 0, 
                    i["exp"] = void 0, i["lv"] = void 0, i["homeHpPercent"] = void 0, i["homeShieldHpPercent"] = void 0, 
                    i["speed"] = 1, i["hasAddSpeed"] = !1, i["prepareBricks"] = void 0, i["hasRefreshFromAd"] = !1, 
                    i["_usedHeroMap"] = new j, i["_realRefreshCostArr"] = void 0, i["_rewardCfgs"] = void 0, 
                    i["_gridLevelLimit"] = 0, i["battleState"] = ut["NONE"], i["startTime"] = 0, i;
                }, n(o, t), (r = o[U])["onInit"] = function() {
                    this["refreshCostArr"] = I["toObject1Arr"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], oO)["content"]), 
                    this["adGetGridMaxTimes"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], sO)["content"]), 
                    this["adCoinCount"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], eO)["content"]), 
                    this["adItemLevels"] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], cO)["content"]), 
                    this["threeLvRate"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], aO)["content"]), 
                    this["first"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], fO)["content"]), 
                    this["maxBrickType"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], vO)["content"]), 
                    this["failedRefreshItems"] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], lO)["content"]), 
                    this["initAllBuffBlackList"] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], dO)["content"]), 
                    this["notExcludeHeroIds"] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], mO)["content"]), 
                    this["speedUpMultiple"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], kO)["content"]) / sC, 
                    this["speedAdTimes"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], _O)["content"]), 
                    this["autoOpenSpeedChapterIds"] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], SO)["content"]), 
                    this["buffRefreshMinQuality"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], gO)["content"]), 
                    this["_usedHeroMap"]["notRecordHeroIds"] = this["notExcludeHeroIds"], this["initRewardCfg"]();
                }, r["initRewardCfg"] = function() {
                    var t, n;
                    OKn && LVn && (VO += "DLESS"), OKn = 0, this["_rewardCfgs"] = {}, n = function() {
                        var t;
                        0;
                        for (var n = 0, i = T; n < i.length; n++) {
                            var r = i[n];
                            if (-1 == r) ; else {
                                if (0 == r) {
                                    t[5] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], IO)["content"]);
                                    continue;
                                }
                                if (1 == r) {
                                    t["reviveNoGridDrawIds"] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], TO)["content"]);
                                    continue;
                                }
                                if (d == r) {
                                    t["noGridDrawIds"] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], MO)["content"]);
                                    continue;
                                }
                                if (u == r) {
                                    t["firstBrickDrawIds"] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], wO)["content"]);
                                    continue;
                                }
                            }
                            if (a != r) if (e != r) if (c != r) {
                                if (f == r) return t;
                                h != r ? v != r ? l != r || (t["adGetGridDrawId"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], FO)["content"])) : t = HVn(HVn(HVn(HVn(HVn(HVn(HVn(HVn(HVn({}, UO, 0), DO, 0), PO, 0), RO, 0), bO, 0), BO, 0), AO, 0), pO, 0), CO, 0) : t["refreshBrickDrawIds"] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], NO)["content"]);
                            } else t[6] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], HO)["content"]); else t["mus"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], LO)["content"]); else t["mu"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], EO)["content"]);
                        }
                    }[H](), t = function() {
                        for (var t, n = 0, i = A; n < GO; ) switch (++n, i) {
                          case l:
                            t["adGetGridDrawId"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], FO)["content"]), 
                            i = a;
                            break;

                          case v:
                            t["mu"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], EO)["content"]), 
                            i = e;
                            break;

                          case u:
                            t["noGridDrawIds"] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], VO)["content"]), 
                            i = f;
                            break;

                          case h:
                            return t;

                          case a:
                            t["mus"] = Number(S["getDataById"](table["baglike"]["BagLikeConstantConfig"], OO)["content"]), 
                            i = v;
                            break;

                          case 1:
                            t["reviveNoGridDrawIds"] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], TO)["content"]), 
                            i = h;
                            break;

                          case 0:
                            t["refreshBrickDrawIds"] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], xO)["content"]), 
                            i = c;
                            break;

                          case c:
                            t[6] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], KO)["content"]), 
                            i = l;
                            break;

                          case f:
                            t[5] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], IO)["content"]), 
                            i = 1;
                            break;

                          case d:
                            t = HVn(HVn(HVn(HVn(HVn(HVn(HVn(HVn(HVn({}, UO, 0), DO, 0), PO, 0), RO, 0), bO, 0), BO, 0), AO, 0), pO, 0), CO, 0), 
                            i = 0;
                            break;

                          case e:
                            t["firstBrickDrawIds"] = I["strToArr1"](S["getDataById"](table["baglike"]["BagLikeConstantConfig"], xO)["content"]), 
                            i = u;
                        }
                    }[H](), this["_rewardCfgs"][b["TRUNK_INSTANCE"]] = n, this["_rewardCfgs"][b["ENDLESS_MODE"]] = t;
                }, r["init"] = function() {
                    var t, n, i;
                    this["startTime"] = m["TimeManager"]["serverNow"], _["ins"]()["battleStart"](K["ins"]()["battleChapterVo"]["curChapterId"]), 
                    st["resetSid"](), this["_usedMap"] = {}, this["_gridArr"] = [], this["_sid"] = 0, 
                    this["adGetGridUsedTimes"] = 0, n = [ 1, u, d, a ], i = K["ins"]()["battleChapterVo"], 
                    q["ins"]()["isActivity"] ? n = i["setting"]["initSpGridArea"] : a <= (null == i || null == (t = i["setting"]) || null == (t = t["initGridArea"]) ? void 0 : t["length"]) && (n = i["setting"]["initGridArea"]);
                    for (var r = 0; r < this["maxRow"]; r++) for (var o = 0; o < this["maxCol"]; o++) {
                        var s;
                        s = r * this["maxCol"] + o, this["_gridArr"][s] = function() {
                            var t;
                            return (t = HVn(HVn(HVn({}, ND, 0), Vt, 0), wB, 0))["index"] = s, t["isUnlock"] = r >= n[0] && r <= n[1] && o >= n[d] && o <= n[u], 
                            t["itemSid"] = null, t;
                        }[H]();
                    }
                    N["bagLikeBuffMgr"]["init"](), N["bagLikePowerSkillMgr"]["init"](), N["bagLikeRecordMgr"]["init"](), 
                    this["initPower"](), this["reviveTimes"] = 0, this["notUseGridIds"]["clear"](), 
                    this["refreshTimes"] = 0, this["refreshTimesPerRound"] = 0, this["noAdRefreshTimes"] = 0, 
                    this["totalRefreshTimes"] = 0, this["failedTimes"] = 0, this["useFailedItems"] = !1, 
                    this["_realRefreshCostArr"] = null, this["exp"] = 0, this["lv"] = 1, this["homeHpPercent"] = sC, 
                    this["homeShieldHpPercent"] = 0, this["prepareBricks"] = [], this["hasRefreshFromAd"] = !1, 
                    this["speed"] = N["bagLikeModel"]["localVo"]["speed"], this["hasAddSpeed"] = !1, 
                    this["initExtraDatas"](), this["isResumeBattle"]() && this["resumeData"](), this["checkGridShapeValid"](), 
                    g["speed"] = this["speed"];
                }, r["initExtraDatas"] = function() {
                    K["ins"]()["battleChapterVo"]["fightType"] === b["DAILY_INSTANCE"] && this["initDailyBuffs"]();
                }, r["initDailyBuffs"] = function() {
                    var t, n;
                    null != (t = null == (n = N["dailyInstanceModel"]["curRandomCfg"]) ? void 0 : n["buffIds"]) && t["forEach"]((function(t) {
                        var n;
                        (n = m["TableManager"]["getDataById"](table["dailyInstance"]["DailyInstanceEffectConfig"], t)) && N["bagLikeBuffMgr"]["addEffective"](n["effectiveId"], n);
                    }));
                }, r["resumeData"] = function() {
                    var t;
                    if (t = N["trunkInstanceRecordModel"]["localVo"]) {
                        var n;
                        for (var i in this["adGetGridUsedTimes"] = t["adGetGridUsedTimes"], this["reviveTimes"] = t["reviveTimes"], 
                        this["refreshTimes"] = t["refreshTimes"], this["refreshTimesPerRound"] = t["refreshTimesPerRound"], 
                        this["noAdRefreshTimes"] = t["noAdRefreshTimes"], this["totalRefreshTimes"] = t["totalRefreshTimes"], 
                        this["failedTimes"] = t["failedTimes"], this["exp"] = t["exp"], this["lv"] = t["lv"], 
                        this["homeHpPercent"] = t["homeHpPercent"], this["homeShieldHpPercent"] = t["homeShieldHpPercent"] || 0, 
                        this["hasRefreshFromAd"] = t["hasRefreshFromAd"], t["speed"] && (this["speed"] = t["speed"]), 
                        t["hasAddSpeed"] ? this["hasAddSpeed"] = !0 : this["hasAddSpeed"] = !1, t["unlockGrids"]) this["_gridArr"][i]["isUnlock"] = !0;
                        for (var r in t["useBricks"]) {
                            var u, o, s, e, h;
                            if (s = t["useBricks"][r], (e = st["create"](s["configId"], s["itemSid"]))["showIndex"] = s["showIndex"], 
                            e["showAd"] = s["showAd"], h = (this["_usedMap"][s["itemSid"]] = e)["shapeArr"][0]["length"], 
                            u = e["shapeArr"]["length"], 0 <= e["showIndex"]) for (var c = 0; c < u; c++) for (var a = 0; a < h; a++) 1 == e["shapeArr"][c][a] && (o = e["showIndex"] + a + c * this["maxCol"], 
                            this["_gridArr"][o]["isUnlock"] = !0, this["_gridArr"][o]["itemSid"] = e["itemSid"]);
                        }
                        for (var f in t["buffs"]) {
                            var v, l;
                            if (l = t["buffs"][f], (v = m["TableManager"]["getDataById"](table["baglike"]["BagLikeAbilityEffectConfig"], f)) && !v["noRestore"]) for (var d = 0; d < l; d++) N["bagLikeBuffMgr"]["addBuff"](v);
                        }
                        (n = N["bagLikePowerSkillMgr"]["skillVo"]) && (n["curEnergy"] = t["skillEnergy"]), 
                        N["itemModel"]["onItemAdd"]([ function() {
                            var n;
                            return (n = HVn(HVn({}, Lr, 0), Gr, 0))["k"] = Y["COIN"], n["v"] = t["coinCnt"], 
                            n;
                        }[H]() ]), N["bagLikeRecordMgr"]["resumeData"](t["hurtRecords"]), K["ins"]()["resumeDatas"]();
                    }
                }, r["initPower"] = function() {
                    var t;
                    this["isResumeBattle"]() || ((t = st["create"](hx))["showIndex"] = XP, this["_usedMap"][t["itemSid"]] = t, 
                    this["_gridArr"][17]["itemSid"] = t["itemSid"], k["ins"]()["emit"](D["TAKE_ON_BRICK"], t));
                }, r["exitBattle"] = function() {
                    (null == (t = K["ins"]()["battleChapterVo"]) ? void 0 : t["fightType"]) == b["TRUNK_INSTANCE"] && N["trunkInstanceRecordModel"]["clearRecord"](), 
                    m["UIManager"]["isOpened"](nt["BagLikeBattlePage"]) && m["UIManager"]["close"](nt["BagLikeBattlePage"]), 
                    0 == m["UIManager"]["isOpened"](J["MainPage"]) && m["UIManager"]["open"](J["MainPage"]);
                    var t, n = Math["floor"]((m["TimeManager"]["serverNow"] - this["startTime"]) / qi);
                    _["ins"]()["battleEnd"](K["ins"]()["battleChapterVo"]["curChapterId"], n);
                }, r["getUsedHeroIdMap"] = function() {
                    var t, n;
                    for (n in t = {}, this["_usedMap"]) this["_usedMap"][n]["subType"] == it["HERO"] && (t[this["_usedMap"][n]["getHeroParam"]()["heroId"]] = !0);
                    return t;
                }, r["getUsedHeroNumByHeroId"] = function(t) {
                    var n, i;
                    if (!this["_usedMap"]) return 0;
                    for (n in i = 0, this["_usedMap"]) this["_usedMap"][n]["subType"] == it["HERO"] && this["_usedMap"][n]["getHeroParam"]()["heroId"] == t && i++;
                    return i;
                }, r["onDestroy"] = function() {}, r["getSid"] = function() {
                    return ++this["_sid"];
                }, r["getGridArr"] = function() {
                    return this["_gridArr"];
                }, r["getGridIndexBySid"] = function(t) {
                    for (var n = 0; n < this["_gridArr"]["length"]; n++) if (this["_gridArr"][n]["itemSid"] == t) return n;
                    return -1;
                }, r["ge"] = function(t) {
                    for (var n = [], i = 0; i < this["_gridArr"]["length"]; i++) this["_gridArr"][i]["itemSid"] == t && n[R](i);
                    return n;
                }, r["getGridByRowCol"] = function(t, n) {
                    var i;
                    return i = t * this["maxCol"] + n, this["_gridArr"][i];
                }, r["getGridByIndex"] = function(t) {
                    return this["_gridArr"][t];
                }, r["getItemDataBySid"] = function(t) {
                    return this["_usedMap"][t];
                }, r["isUsedItemBySid"] = function(t) {
                    return !!this["_usedMap"][t];
                }, r["isPowerOn"] = function() {
                    return !!this["_usedMap"][1];
                }, r["getPowerIndex"] = function() {
                    return this["getGridIndexBySid"](1);
                }, r["upgradeOneGear"] = function() {
                    var t, n, i, r;
                    for (r in n = [], t = this["_usedMap"]) {
                        var u;
                        (u = t[r])["subType"] != it["POWER"] && u["config"]["nextId"] && n[R](r);
                    }
                    n["length"] && ((i = t[n[Math["floor"](Math["random"]() * n["length"])]])["configId"] = i["config"]["nextId"], 
                    k["ins"]()["emit"](D["TAKE_ON_BRICK"], i), k["ins"]()["emit"](D["UPDATE_GRID_BRICK"], []), 
                    k["ins"]()["emit"](D["BAGLIKE_UP_ONE_GEAR_LV"], i));
                }, r["excludeOtherHero"] = function(t) {
                    for (var n = {}, i = F["ins"]()["getAllData"](), r = N["heroModel"]["lockHeroIds"], u = 0; u < i["length"]; u++) {
                        var o, s;
                        (o = i[u])["type"] == it["HERO"] ? (s = F["ins"]()["getHeroParams"](o["id"])["heroId"], 
                        r["has"](s) ? n[o["id"]] = !0 : this["notExcludeHeroIds"] && -1 != this["notExcludeHeroIds"]["indexOf"](s) || t && !t[s] && (n[o["id"]] = !0)) : o["type"] == it["GRID"] && this["notUseGridIds"]["has"](o["id"]) && (n[o["id"]] = !0);
                    }
                    return n;
                }, r["getStaticItemsIds"] = function() {
                    var t, n, i, r;
                    if ((i = K["ins"]()["battleChapterVo"], n = N["trunkInstanceModel"]["getChallengeTimes"](i["curChapterId"]), 
                    t = N["trunkInstanceModel"]["isForeverStaticChapter"](i["curChapterId"]), !(1 < n && 0 == t) && null != i && i["staticBricks"]) && (r = this["totalRefreshTimes"]) < (null == i ? void 0 : i["staticBricks"]["length"])) return null == i ? void 0 : i["staticBricks"][r];
                    return null;
                }, r["addGridFromAD"] = function() {
                    var t, n, i, r, u;
                    i = this, n = [], u = [ this["getCurRewardCfg"]()["adGetGridDrawId"] ], r = this["notUseGridIds"]["size"] < F["ins"]()["gridCfgs"]["length"], 
                    u["forEach"]((function(t) {
                        var i, r;
                        (i = X["ins"]()["getRewards"](t, 1))["length"] && ((r = st["create"](i[0]["k"]))["showAd"] = !0, 
                        n[R](r));
                    })), r && 0 < (t = n["filter"]((function(t) {
                        return t["config"]["type"] == it["GRID"];
                    })))["length"] && null != t && t["forEach"]((function(t) {
                        var n;
                        i["notUseGridIds"]["has"](t["configId"]) && (n = i[1]()) && null != t && t["updateItem"](n["id"]);
                    })), this["adGetGridUsedTimes"]++, k["ins"]()["emit"](D["REFRESH_ADD_BRICK"], n);
                }, r["getCurRewardCfg"] = function() {
                    var t;
                    return t = this["_rewardCfgs"][b["TRUNK_INSTANCE"]], K["ins"]()["battleChapterVo"]["fightType"] === b["ENDLESS_MODE"] ? this["_rewardCfgs"][b["ENDLESS_MODE"]] : t;
                }, r["getCurDrawIds"] = function(t) {
                    var n, i, r, o;
                    return i = null, r = this["getCurRewardCfg"](), n = this["notUseGridIds"]["size"] < F["ins"]()["gridCfgs"]["length"], 
                    this["_gridLevelLimit"] = 0, t == tt["AD"] ? i = r[6] : t == tt["Revive"] ? (i = r[5], 
                    null == this[1](u) ? i = r["reviveNoGridDrawIds"] : this["_gridLevelLimit"] = u) : (i = (1 == this["noAdRefreshTimes"] ? r["firstBrickDrawIds"] : 0 == n ? r["noGridDrawIds"] : r["refreshBrickDrawIds"])["concat"](), 
                    t == tt["Prepare"] && (o = N["bagLikePowerSkillMgr"]["getRoleFeature"](ot["START_ROUND_GET"])) && o["cur"] < o["maxTimes"] && (o["cur"]++, 
                    i[R](o["rewardDropId"]))), i;
                }, r["refreshBrick"] = function(t) {
                    var n, i, r, o, s;
                    if (r = this, n = [], o = null, t == tt["Normal"] && (this["refreshTimes"]++, this["refreshTimesPerRound"]++), 
                    t != tt["AD"] && this["noAdRefreshTimes"]++, this["useFailedItems"]) this["useFailedItems"] = !1, 
                    null != (i = this["failedRefreshItems"]) && i["forEach"]((function(t) {
                        var i;
                        (i = st["create"](t))["showAd"] = !0, n[R](i);
                    })); else if (s = this["getStaticItemsIds"](), this["totalRefreshTimes"]++, null != s) null != s && s["forEach"]((function(t) {
                        var i;
                        (i = st["create"](t))["showAd"] = !0, n[R](i);
                    })), this["replaceSpecialGrid"](n); else {
                        var e, h, c;
                        if (null == (o = this["getCurDrawIds"](t))) return;
                        this["_usedHeroMap"]["initMap"](this["_usedMap"]), c = this["excludeOtherHero"](null), 
                        e = !1, h = [], this["addTempWeightRate"](t), o["forEach"]((function(t) {
                            var i, o;
                            r["_usedHeroMap"]["size"] >= r["maxBrickType"] && 0 == e && (e = !0, c = r["excludeOtherHero"](r["_usedHeroMap"]["heroIds"])), 
                            (o = X["ins"]()["getRewards"](t, 1, c))["length"] && ((i = st["create"](o[0]["k"]))["showAd"] = !0, 
                            n[R](i), i["type"] == rt["BRICK"] && u == i["config"]["level"] && h[R](i), r["_usedHeroMap"]["addData"](i));
                        })), X["ins"]()["clearTempWeightRate"](), this[8](n), this["replaceThreeLvData"](h), 
                        this["replaceMaxBrickCnt"](n), this["replaceMaxLevelBrick"](n), this["replaceSpecialGrid"](n), 
                        this["replaceCanUseGrid"](n, this["_gridLevelLimit"]), t == tt["Revive"] && (n = this["addCacheBricks"](n));
                    }
                    k["ins"]()["emit"](D["REFRESH_BRICK"], n);
                }, r["addTempWeightRate"] = function(t) {
                    0;
                    try {
                        var n, i;
                        if (n = P["ins"]()["getWeightCfg"](this["_usedHeroMap"]["coinCnt"])) {
                            for (var r in n["rewardWeight"]) X["ins"]()["addTempWeightRate"](Z["REWARD"], r, n["rewardWeight"][r]);
                            for (var u in n["itemWeight"]) X["ins"]()["addTempWeightRate"](Z["BAGITEM"], u, n["itemWeight"][u]);
                        }
                        t == tt["Prepare"] && ((i = N["bagLikeBuffMgr"]["specialWordActiveMap"][x["ADD_LEVEL2_GEAR"]]) && X["ins"]()["addTempWeightRate"](Z["REWARD"], i["dropId"], i["weightMultiple"]), 
                        i = N["bagLikeBuffMgr"]["specialWordActiveMap"][x["ADD_LEVEL3_GEAR"]]) && X["ins"]()["addTempWeightRate"](Z["REWARD"], i["dropId"], i["weightMultiple"]);
                    } catch (t) {
                        console["error"](Xx, t);
                    }
                }, r[8] = function(t) {
                    try {
                        var n, i, r, o;
                        r = this["getCurRewardCfg"](), this["notUseGridIds"]["size"] < F["ins"]()["gridCfgs"]["length"] && this["noAdRefreshTimes"] % r["mus"] == 0 && t["filter"]((function(t) {
                            return t["config"]["type"] == it["GRID"];
                        }))["length"] <= 0 && u <= t["length"] && (i = X["ins"]()["getRewards"](r["mu"], 1))["length"] && (o = t[d], 
                        this["_usedHeroMap"]["removeData"](o), (n = st["create"](i[0]["k"]))["showAd"] = !0, 
                        t["splice"](d, 1, n), this["_usedHeroMap"]["addData"](n));
                    } catch (t) {
                        console["error"](qx, t);
                    }
                }, r["replaceThreeLvData"] = function(t) {
                    var n;
                    n = this;
                    try {
                        var i, r;
                        if (0 < t["length"]) if (r = p["random"](0, sC) <= this["threeLvRate"], i = !1, 
                        r) {
                            var o, s, e;
                            for (s in o = [], this["_usedMap"]) if (function() {
                                var r;
                                if ((r = n["_usedMap"][s])["type"] == rt["BRICK"] && u == r["config"]["level"] && (o[R](r), 
                                0 == i) && (i = -1 != t["findIndex"]((function(t) {
                                    return t["configId"] == r["configId"];
                                })))) return 1;
                            }()) break;
                            0 == i && 0 < o["length"] && (o = y["confound"](o), this["_usedHeroMap"]["removeData"](t[0]), 
                            null != (e = t[0]) && e["updateItem"](o[0]["configId"]), this["_usedHeroMap"]["addData"](t[0]));
                        }
                    } catch (t) {
                        console["error"](Qx, t);
                    }
                }, r["replaceMaxBrickCnt"] = function(t) {
                    try {
                        if (this["_usedHeroMap"]["size"] < this["maxBrickType"]) for (var n = y["confound"](Array["from"](N["heroModel"]["unlockHeroIds"])), i = 0, r = 0; r < n["length"]; r++) {
                            var u;
                            if (u = n[r], i > t["length"] || this["_usedHeroMap"]["size"] >= this["maxBrickType"]) break;
                            if (0 == this["_usedHeroMap"]["isUsedHero"](u)) for (;i < t["length"]; ) {
                                var o, s;
                                if (!((o = t[i])["subType"] == it["HERO"] && this["_usedHeroMap"]["getHeroTimes"](o["getHeroParam"]()["heroId"]) <= 1)) if (s = F["ins"]()["getHeroItemId"](u, o["config"]["level"])) {
                                    this["_usedHeroMap"]["removeData"](o), null != o && o["updateItem"](s), this["_usedHeroMap"]["addData"](o);
                                    break;
                                }
                                i++;
                            }
                        }
                    } catch (t) {
                        console["error"]($x, t);
                    }
                }, r["replaceMaxLevelBrick"] = function(t) {
                    try {
                        var n;
                        if ((n = N["bagLikeBuffMgr"]["specialWordActiveMap"][x["REFRESH_LEVEL5_GEAR"]]) && p["random"](0, sC) <= n["rate"]) {
                            var i, r, u, o, s;
                            for (u in s = F["ins"]()["maxLvItemHeroIds"], i = [], s) {
                                for (var e = s[u], h = !0, c = 0; c < (null == e ? void 0 : e["length"]); c++) if (0 == this["_usedHeroMap"]["isUsedHero"](e[c])) {
                                    h = !1;
                                    break;
                                }
                                h && i[R](u);
                            }
                            0 < i["length"] && (r = p["randomInt"](0, i["length"] - 1), o = t[0]) && (this["_usedHeroMap"]["removeData"](o), 
                            null != o && o["updateItem"](i[r]), this["_usedHeroMap"]["addData"](o));
                        }
                    } catch (t) {
                        console["error"](nK, t);
                    }
                }, r["replaceSpecialGrid"] = function(t, n) {
                    try {
                        var i;
                        if (q["ins"]()["isActivity"]) if ((i = q["ins"]()["getRandom"](u))["length"]) for (var r = 0; r < t["length"]; r++) {
                            var o, s;
                            s = i["shift"](), !(o = t[r]) || o["config"]["type"] != it["HERO"] && o["config"]["type"] != it["COIN"] || (this["_usedHeroMap"]["removeData"](o), 
                            null != o && o["updateItem"](s), this["_usedHeroMap"]["addData"](o));
                        }
                    } catch (t) {
                        console["error"](iK, t);
                    }
                }, r["replaceCanUseGrid"] = function(t, n) {
                    var i;
                    i = this, void 0 === n && (n = 0);
                    try {
                        var r;
                        0 < (r = t["filter"]((function(t) {
                            return t["config"]["type"] == it["GRID"];
                        })))["length"] && null != r && r["forEach"]((function(t) {
                            var r;
                            i["notUseGridIds"]["has"](t["configId"]) && (r = i[1](n)) && null != t && t["updateItem"](r["id"]);
                        }));
                    } catch (t) {
                        console["error"](rK, t);
                    }
                }, r["addCacheBricks"] = function(t) {
                    try {
                        0 < this["chooseCacheDatas"]["length"] && (t = this["chooseCacheDatas"]["concat"](t));
                    } catch (t) {
                        console["error"](uK, t);
                    }
                    return t;
                }, r["setGrid"] = function(t, n) {
                    for (var i = 0; i < t["length"]; i++) {
                        var r;
                        r = t[i], this["_gridArr"][r]["isUnlock"] = !0;
                    }
                    k["ins"]()["emit"](D["TAKE_ON_BRICK"], n), k["ins"]()["emit"](D["UPDATE_GRID_BRICK"], []);
                }, r["clearOldBrick"] = function(t, n) {
                    var i, r;
                    if (i = n["shapeArr"][0]["length"], r = n["shapeArr"]["length"], 0 <= t) for (var u = 0; u < r; u++) for (var o = 0; o < i; o++) {
                        var s;
                        s = t + o + u * this["maxCol"], n["shapeArr"][u][o] && 0 <= s && s < this["_gridArr"]["length"] && this["_gridArr"][s]["itemSid"] == n["itemSid"] && (this["_gridArr"][s]["itemSid"] = null);
                    }
                    delete this._usedMap[n.itemSid];
                }, r["setNewBrick"] = function(t, n) {
                    var i, r, u, o;
                    if (i = n["shapeArr"][0]["length"], o = n["shapeArr"]["length"], u = [], r = [], 
                    0 <= t) {
                        for (var s = 0; s < o; s++) for (var e = 0; e < i; e++) {
                            var h, c;
                            h = t + e + s * this["maxCol"], n["shapeArr"][s][e] && 0 <= h && h < this["_gridArr"]["length"] && ((c = this["_gridArr"][h]["itemSid"]) && c != n["itemSid"] && (u[R](c), 
                            this["_usedMap"][c]) && (this["_usedMap"][c]["showIndex"] = -1, r[R](this["_usedMap"][c]), 
                            delete this._usedMap[c]), this["_gridArr"][h]["itemSid"] = n["itemSid"]);
                        }
                        this["_usedMap"][n["itemSid"]] = n;
                    }
                    if (u["length"]) {
                        for (var a = 0; a < this["_gridArr"]["length"]; a++) -1 != u["indexOf"](this["_gridArr"][a]["itemSid"]) && (this["_gridArr"][a]["itemSid"] = null);
                        k["ins"]()["emit"](D["TAKE_OFF_BRICK"], r);
                    }
                }, r["setBrick"] = function(t, n) {
                    for (var i = [], r = [], u = 0; u < t["length"]; u++) {
                        var o, s;
                        s = t[u], (o = this["_gridArr"][s])["itemSid"] && -1 == i["indexOf"](o["itemSid"]) && (i[R](o["itemSid"]), 
                        r[R](this["_usedMap"][o["itemSid"]]), this["_usedMap"][o["itemSid"]]["showIndex"] = -1, 
                        delete this._usedMap[o.itemSid]), o["itemSid"] = n["itemSid"], this["_usedMap"][n["itemSid"]] = n;
                    }
                    if (k["ins"]()["emit"](D["TAKE_ON_BRICK"], n), i["length"]) {
                        for (var e = 0; e < this["_gridArr"]["length"]; e++) -1 != i["indexOf"](this["_gridArr"][e]["itemSid"]) && (this["_gridArr"][e]["itemSid"] = null);
                        k["ins"]()["emit"](D["TAKE_OFF_BRICK"], r);
                    }
                    $["calPowerLink"](), k["ins"]()["emit"](D["UPDATE_GRID_BRICK"], i);
                }, r["checkNeighbourUnlock"] = function(t) {
                    var n, i;
                    return n = t / this["maxCol"] >> 0, !!(0 < (i = t % this["maxCol"]) && this["getGridByIndex"](t - 1)["isUnlock"] || i < this["maxCol"] - 1 && this["getGridByIndex"](t + 1)["isUnlock"] || 0 < n && this["getGridByIndex"]((n - 1) * this["maxCol"] + i)["isUnlock"] || n < this["maxRow"] - 1 && this["getGridByIndex"]((1 + n) * this["maxCol"] + i)["isUnlock"]);
                }, r["checkHasParnter"] = function(t) {
                    var n;
                    if (n = G["ins"]()["getPartnerId"](t["configId"])) for (var i in this["_usedMap"]) if (this["_usedMap"][i]["configId"] == n) return !0;
                    return !1;
                }, r["tryMerge"] = function(t, n, i) {
                    var r, u, e, h, c, a, f, v;
                    if (t["length"] <= 0) return !1;
                    if (!this["checkHasParnter"](n)) return !1;
                    if ((a = G["ins"]()["getPartnerId"](n["configId"])) == n["configId"]) {
                        if (!i) return;
                        for (var l, d, _, S = 0; S < t["length"]; S++) {
                            var g;
                            if (!(g = this["_gridArr"][t[S]])["itemSid"] || l && g["itemSid"] != l) return !1;
                            l = l || g["itemSid"];
                        }
                        return this["_usedMap"][l]["configId"] == a && (d = G["ins"]()["getMergeId"](a), 
                        _ = m["TableManager"]["getDataById"](table["baglike"]["BagLikeItemConfig"], d), 
                        0 != N["conditionMgr"]["checkCondition"](_["verifys"]) && (this["clearOldBrick"](n["showIndex"], n), 
                        this["_usedMap"][l]["configId"] = d, $["calPowerLink"](), k["ins"]()["emit"](D["TAKE_ON_BRICK"], this["_usedMap"][l]), 
                        k["ins"]()["emit"](D["UPDATE_GRID_BRICK"]), N["audioMgr"]["playSound"](s["Merge"]), 
                        this["_usedMap"][l] && k["ins"]()["emit"](D["BAGLIKE_COMPOUND_WHEEL"], this["_usedMap"][l]), 
                        !0));
                    }
                    for (var y, p = 0; p < t["length"]; p++) {
                        var I;
                        if ((I = this["_gridArr"][t[p]])["itemSid"] && this["_usedMap"][I["itemSid"]]["configId"] == a) {
                            y = I["itemSid"];
                            break;
                        }
                    }
                    return v = G["ins"]()["getMergeId"](a), u = m["TableManager"]["getDataById"](table["baglike"]["BagLikeItemConfig"], v), 
                    0 != N["conditionMgr"]["checkCondition"](u["verifys"]) && !!y && (r = this["_usedMap"][y], 
                    this["clearOldBrick"](n["showIndex"], n), this["clearOldBrick"](r["showIndex"], r), 
                    null != r && r["updateItem"](v), c = r["showIndex"] % o["ins"]()["maxCol"], f = Math["floor"](r["showIndex"] / o["ins"]()["maxCol"]), 
                    h = r["shapeArr"][0]["length"], e = r["shapeArr"]["length"], 0 == o["ins"]()["checkBrick"](c, f, h, e, r["shapeArr"])["isInside"] ? (this["clearOldBrick"](r["showIndex"], r), 
                    r["showIndex"] = -1, k["ins"]()["emit"](D["TAKE_OFF_BRICK"], [ r ])) : (this["setNewBrick"](r["showIndex"], r), 
                    k["ins"]()["emit"](D["TAKE_ON_BRICK"], r)), $["calPowerLink"](), k["ins"]()["emit"](D["UPDATE_GRID_BRICK"]), 
                    N["audioMgr"]["playSound"](s["Merge"]), r && k["ins"]()["emit"](D["BAGLIKE_COMPOUND_WHEEL"], r), 
                    !0);
                }, r["checkGrid"] = function(t, n, i, r, u) {
                    var s;
                    if (s = [], e = !1, !(n + r < 0 || t + i < 0 || n > this["maxRow"] || t > this["maxCol"])) {
                        for (var e = 0 <= n && 0 <= t && n + r <= this["maxRow"] && t + i <= this["maxCol"], h = Math["min"](this["maxRow"], n + r), c = Math["min"](this["maxCol"], t + i), a = n; a < h; a++) if (!(a < 0)) {
                            if (h < a) break;
                            for (var f, v, l = t; l < c; l++) if (!(l < 0)) {
                                if (c < l) break;
                                u[a - n][l - t] && (v = a * this["maxCol"] + l, null != (f = o["ins"]()["getGridByIndex"](v)) && f["isUnlock"] && (e = !1), 
                                s[R](v));
                            }
                        }
                        if (e) {
                            for (var d = !1, m = 0; m < s["length"] && !(d = o["ins"]()["checkNeighbourUnlock"](s[m])); m++) ;
                            d || (e = !1);
                        }
                    }
                    return function() {
                        var t;
                        return (t = HVn(HVn({}, Xm, 0), zG, 0))["isInside"] = e, t["insideArr"] = s, t;
                    }[H]();
                }, r["checkBrick"] = function(t, n, i, r, u) {
                    var s;
                    if (s = [], e = !1, !(n + r < 0 || t + i < 0 || n > this["maxRow"] || t > this["maxCol"])) for (var e = 0 <= n && 0 <= t && n + r <= this["maxRow"] && t + i <= this["maxCol"], h = Math["min"](this["maxRow"], n + r), c = Math["min"](this["maxCol"], t + i), a = n; a < h; a++) if (!(a < 0)) {
                        if (h < a) break;
                        for (var f, v, l = t; l < c; l++) if (!(l < 0)) {
                            if (c < l) break;
                            u[a - n][l - t] && (v = a * this["maxCol"] + l, null != (f = o["ins"]()["getGridByIndex"](v)) && f["isUnlock"] || (e = !1), 
                            s[R](v));
                        }
                    }
                    return function() {
                        var t;
                        return (t = HVn(HVn({}, Xm, 0), zG, 0))["isInside"] = e, t["insideArr"] = s, t;
                    }[H]();
                }, r["isAdItem"] = function(t) {
                    var n;
                    return -1 != (null == (n = this["adItemLevels"]) ? void 0 : n["indexOf"](t["config"]["level"]));
                }, r[1] = function(t) {
                    var n;
                    if (void 0 === t && (t = 0), n = F["ins"]()["gridCfgs"], !(this["notUseGridIds"]["size"] >= n["length"])) for (var i = n["length"] - 1; 0 <= i; i--) if ((0 == t || n[i]["level"] == t) && 0 == this["notUseGridIds"]["has"](n[i]["id"])) return n[i];
                    return null;
                }, r["checkGridShapeValid"] = function() {
                    for (var t = this, n = !1, i = this["_gridArr"], r = F["ins"]()["gridCfgs"], u = new Set, o = V["ins"]()["totalValue"], s = r["length"] - 1; 0 <= s; s--) {
                        var e, h, c;
                        if (e = r[s]["id"], !this["notUseGridIds"]["has"](e)) if (h = 0, c = m["TableManager"]["getDataById"](table["baglike"]["BagLikeShapeConfig"], r[s]["shapeId"])) {
                            var a, f;
                            if (a = V["ins"]()["getShapeValue"](c["id"]), h) if ((f = h & a) == h || f == a) {
                                h |= a;
                                continue;
                            }
                            if (h == o) break;
                            for (var v = c["shapeArr"][0]["length"], l = c["shapeArr"]["length"], d = 0; d < i["length"]; d++) {
                                if (0 == i[d]["isUnlock"]) {
                                    n = !0;
                                    for (var k = 0; k < l; k++) {
                                        for (var _ = 0; _ < v; _++) if (1 == c["shapeArr"][k][_]) {
                                            var S, g;
                                            if (g = Math["floor"](d / this["maxCol"]), S = d % this["maxCol"], g + k >= this["maxRow"] || S + _ >= this["maxCol"]) {
                                                n = !1;
                                                break;
                                            }
                                            if (1 == i[d + _ + k * this["maxCol"]]["isUnlock"]) {
                                                n = !1;
                                                break;
                                            }
                                        }
                                        if (0 == n) break;
                                    }
                                } else n = !1;
                                if (n) {
                                    u["delete"](e), h |= a;
                                    break;
                                }
                                u["add"](e);
                            }
                        }
                    }
                    0 < u["size"] && u["forEach"]((function(n) {
                        t["notUseGridIds"]["add"](n);
                    }));
                }, r["isResumeBattle"] = function() {
                    var t;
                    return !(!(t = N["trunkInstanceRecordModel"]["localVo"]) || t["chapterId"] != K["ins"]()["battleChapterVo"]["curChapterId"]);
                }, r["getUsedMapSize"] = function() {
                    var t, n;
                    for (t in n = 0, this["_usedMap"]) n++;
                    return 0 <= n - 1 ? n - 1 : 0;
                }, r["getWheels"] = function() {
                    var t, n;
                    for (n in t = [], this["_usedMap"]) {
                        var i, r, u;
                        (i = this["_usedMap"][n])["subType"] == it["HERO"] && (u = i["getHeroParam"]()["heroId"], 
                        r = N["heroModel"]["getHeroVo"](u)) && r["cfg"]["type"] == W["WHEEL"] && t[R](r["cfg"]["id"]);
                    }
                    return t;
                }, r["getAllHeroMaxLvConfigId"] = function() {
                    var t, n, i;
                    for (i in n = {}, t = {}, this["_usedMap"]) {
                        var r, u, o;
                        (o = this["_usedMap"][i])["subType"] == it["HERO"] && (r = o["getHeroParam"]()["heroId"], 
                        u = o["config"]["level"], null == t[r] || t[r] < u) && (t[r] = u, n[r] = o["configId"]);
                    }
                    return n;
                }, r["getTotalAtk"] = function() {
                    var t, n;
                    for (t in n = 0, this["_usedMap"]) {
                        var i, r, u, o, s, e;
                        (e = this["_usedMap"][t])["subType"] == it["HERO"] && (s = e["getHeroParam"]()["heroId"], 
                        i = e["getHeroParam"]()["attrMultiple"], r = N["heroModel"]["getHeroVo"](s), u = $["isNearPower"](e["itemSid"]), 
                        o = r["atk"] * i * (1 + L["exAttrMgr"]["getHeroAttr"](s, B["ATK_INC"]) / sC), u && N["bagLikeBuffMgr"]["specialWordActiveMap"][x["POWER_NEAR_ATK_UP"]] && (o *= 1 + N["bagLikeBuffMgr"]["specialWordActiveMap"][x["POWER_NEAR_ATK_UP"]]["atkInc"]), 
                        n += o);
                    }
                    return n;
                }, r["setSpeed"] = function(t) {
                    this["speed"] != t && (this["speed"] = t, g["speed"] = t, m["FacadeManager"]["emit"](D["BAGLIKE_SPEED_CHANGE"]));
                }, r["changeSpeed"] = function() {
                    var t;
                    if (t = this["speed"], 1 == this["speed"]) {
                        if (!this["hasAddSpeed"] && N["bagLikeModel"]["localVo"]["speedAdTimes"] < this["speedAdTimes"]) return void m["UIManager"]["open"](nt["BagLikeSpeedView"]);
                        t = this["speedUpMultiple"];
                    } else t = 1;
                    this["setSpeed"](t);
                }, r["onPlaySpeedAdComplete"] = function(t) {
                    this["hasAddSpeed"] = !0, N["bagLikeModel"]["addSpeedAdTimes"](), this["setSpeed"](this["speedUpMultiple"]);
                }, r["addSpeedByAD"] = function() {
                    1 == this["speed"] && N["adMgr"]["playAd"](O["BATTLE_SPEED"], null, this["onPlaySpeedAdComplete"][Q](this));
                }, i(o, [ function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = fK, t["get"] = function() {
                        var t, n;
                        for (t in n = 0, this["_usedMap"]) {
                            var i, r, u, o;
                            (r = this["_usedMap"][t])["subType"] == it["HERO"] && (u = r["getHeroParam"]()["heroId"], 
                            i = N["heroModel"]["getHeroVo"](u)) && i["cfg"]["type"] == W["WHEEL"] && (o = r["getHeroParam"]()["attrMultiple"], 
                            n += i["hp"] * o);
                        }
                        return n;
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = fG, t["get"] = function() {
                        if (!this["_realRefreshCostArr"]) {
                            this["_realRefreshCostArr"] = [];
                            for (var t = N["bagLikeBuffMgr"]["specialWordActiveMap"][x["REDUCE_REFRESH_BRICK_COST"]], n = 0; n < this["refreshCostArr"]["length"]; n++) {
                                var i;
                                i = this["refreshCostArr"][n]["v"], t && (i = Math["floor"](this["refreshCostArr"][n]["v"] * (sC - t["rate"]) / sC)), 
                                this["_realRefreshCostArr"][R](function() {
                                    var t;
                                    return (t = function() {
                                        var t;
                                        return (t = HVn(HVn({}, Lr, 0), Gr, 0))["k"] = 0, t["v"] = 0, t;
                                    }[H]())["k"] = this["refreshCostArr"][n]["k"], t["v"] = i, t;
                                }[Q](this)[H]());
                            }
                        }
                        return this["_realRefreshCostArr"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = hG, t["get"] = function() {
                        for (var t = [], n = N["bagLikeBuffMgr"]["specialWordActiveMap"][x["REDUCE_REFRESH_BRICK_COST"]], i = 0; i < this["refreshCostArr"]["length"]; i++) {
                            var r;
                            r = this["refreshCostArr"][i]["v"], n && (r = Math["floor"](this["refreshCostArr"][i]["v"] * (sC - n["rate"]) / sC)), 
                            this["refreshCostArr"][i]["k"] == Y["COIN"] && t[R](function() {
                                var t;
                                return (t = function() {
                                    var t;
                                    return (t = HVn(HVn({}, Lr, 0), Gr, 0))["k"] = 0, t["v"] = 0, t;
                                }[H]())["k"] = Y["SP_COIN"], t["v"] = r, t;
                            }[H]());
                        }
                        return t;
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = vK, t["get"] = function() {
                        return this["_usedMap"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = tP, t["get"] = function() {
                        return 1 == this["speed"] ? lK : dK;
                    }, t;
                }[Q](this)[H]() ]), o;
            }(o)), r[E][z]();
        }, et;
    }[Q](this)[H]();
});