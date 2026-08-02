// Module: chunks:///_virtual/BagLikeBuffManager.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./BaseSingleton.ts, ./G.ts, ./TableManager.ts, ./WeightUtils.ts, ./BattleEnum.ts, ./FeatureType.ts, ./GBattleIns.ts, ./NotificationKey.ts, ./GIns.ts, ./BagLikeItemDatas.ts, ./HeroEnums.ts, ./UIBagLikeBuffConfig.ts, ./BattleManager.ts, ./FacadeManager.ts
(function(t) {
    var n, i, r, o, s, e, h, c, a, f, v, m, k, _, S, g, y, p, I, B;
    return Axn && bVn && (jI += Zm), Axn && LVn && (tC = "BAGLIKE:MULTIPL"), Axn && EVn && (tC += zWt), 
    Axn && LVn && (zI += "E:AD_", jI += "KE:AD_", NC += "dPassiv"), Axn = 0, function() {
        var b;
        return Bxn && bVn && (NC += JL), Bxn && EVn && (NT += S8t), Bxn && LVn && ($I += "LE_CREATE_", 
        tC += "E_CREATE_TOW"), Bxn && LVn && (zI += "BUFF_CH", jI += "B"), Bxn && RVn && (NC += "itySki"), 
        Bxn = 0, (b = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A], i = t["createClass"];
        }, function(t) {
            r = t[M];
        }, function(t) {
            o = t[w];
        }, function(t) {
            s = t[w];
        }, function(t) {
            e = t["TableManager"];
        }, function(t) {
            h = t["WeightUtils"], c = t["WeightObject"];
        }, function(t) {
            a = t["MonsterType"];
        }, function(t) {
            f = t["FeatureType"];
        }, function(t) {
            v = t[w];
        }, function(t) {
            m = t[w];
        }, function(t) {
            k = t[w];
        }, function(t) {
            _ = t["BagLikeItemDatas"];
        }, function(t) {
            S = t["HeroType"];
        }, function(t) {
            g = t["BagLikeBuffRangeType"], y = t["BagLikeBuffEffectType"], p = t["BagLikeBuffSpecialWordType"];
        }, function(t) {
            I = t["BattleManager"];
        }, function(t) {
            B = t[w];
        } ], b[T] = function() {
            Mxn && EVn && (zI += RUt, $I += SDt, tC += N0t, NT += vDt), Mxn && bVn && (jI += lQt), 
            Mxn && LVn && (NT += "widget"), Mxn && LVn && ($I += "HERO_INTERVAL", tC += "ER_INTERVAL"), 
            Mxn && LVn && (zI += "ANGE", jI += "UFF_ALL"), Mxn && RVn && (NC += "ll"), Mxn = 0, 
            r[E][R]({}, HI, UI, void 0), t(UI, function(t) {
                var r, o;
                return wxn && LVn && (NT += "s"), wxn = 0, o = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)["_expGain"] = 0, i["adChangeMax"] = l, 
                    i["adALLMax"] = l, i["multipleCreateHeroInterval"] = V_, i["multipleCreateTowerInterval"] = V_, 
                    i["adChange"] = 0, i["adAll"] = 0, i["specialWordActiveMap"] = {}, i["_buffTimesMap"] = {}, 
                    i["_buffMap"] = {}, i["_configPool"] = void 0, i["_formationEffectiveMap"] = void 0, 
                    i["_createTimeWeight"] = new c, i;
                }, n(o, t), (r = o[U])["onInit"] = function() {
                    var t, n;
                    t = this, this["adChangeMax"] = Number(e["getDataById"](table["baglike"]["BagLikeConstantConfig"], zI)["content"]), 
                    this["adALLMax"] = Number(e["getDataById"](table["baglike"]["BagLikeConstantConfig"], jI)["content"]), 
                    this["multipleCreateHeroInterval"] = Number(e["getDataById"](table["baglike"]["BagLikeConstantConfig"], $I)["content"]), 
                    this["multipleCreateTowerInterval"] = Number(e["getDataById"](table["baglike"]["BagLikeConstantConfig"], tC)["content"]), 
                    null != (n = e["getAllData"](table["baglike"]["BagLikeAbilityEffectConfig"])) && n["forEach"]((function(n) {
                        var i;
                        i = null, t["_buffMap"][n["group"]] ? i = t["_buffMap"][n["group"]] : t["_buffMap"][n["group"]] = i = [], 
                        i[R](n);
                    }));
                }, r["init"] = function() {
                    this["adChange"] = 0, this["adAll"] = 0, this["_expGain"] = 0, this["specialWordActiveMap"] = {}, 
                    this["_buffTimesMap"] = {}, this["_formationEffectiveMap"] = {}, this["_configPool"] = [];
                    for (var t = e["getAllData"](table["baglike"]["BagLikeAbilityEffectConfig"]), n = {}, i = t["length"] - 1; 0 <= i; i--) {
                        var r;
                        n[(r = t[i])["group"]] || r["verifys"] && !k["conditionMgr"]["checkCondition"](r["verifys"]) || (this["_configPool"][R](r), 
                        r["group"] && (n[r["group"]] = !0));
                    }
                }, r["getBuffCfgByGroup"] = function(t) {
                    if (this["_buffMap"][t]) for (var n = this["_buffMap"][t], i = n["length"] - 1; 0 <= i; i--) if (k["conditionMgr"]["checkCondition"](n[i]["verifys"])) return n[i];
                    return null;
                }, r["getExpMultiple"] = function() {
                    return 1 + this["_expGain"] / sC;
                }, r["checkCanRangeCondition"] = function(t, n) {
                    var i, r;
                    if (r = !1, i = t["range"], !t || 0 != k["conditionMgr"]["checkCondition"](t["conditions"])) switch (t["rangeType"]) {
                      case g["HERO"]:
                        for (var u = 0; u < i["length"] && !(r = n[i[u]]); u++) ;
                        break;

                      case g["HERO_SHAPE"]:
                        for (var o = 0; o < i["length"]; o++) {
                            var s;
                            if (s = _["ins"]()["getHeroIdsForShape"](i[o])) for (var e = 0; e < s["length"] && !(r = n[s[e]]); e++) ;
                            if (r) break;
                        }
                        for (var h = 0; h < i["length"] && !(r = n[i[h]]); h++) ;
                        break;

                      default:
                        r = !0;
                    }
                    return r;
                }, r["getTimes"] = function(t) {
                    return this["_buffTimesMap"][t] || 0;
                }, r["getChooseBuff"] = function(t, n) {
                    void 0 === t && (t = u), void 0 === n && (n = 0);
                    for (var i = k["bagLikeMgr"]["getUsedHeroIdMap"](), r = h["create"](), o = 0; o < this["_configPool"]["length"]; o++) {
                        var s;
                        s = this["_configPool"][o], this["getTimes"](s["id"]) < s["times"] && (n && s["quality"] < n || this["checkCanRangeCondition"](s, i) && r["add"](s, s["weight"]));
                    }
                    return r["extract"](t);
                }, r["addBuffs"] = function(t) {
                    for (var n = 0; n < t["length"]; n++) this["addBuff"](t[n]);
                }, r["addBuff"] = function(t) {
                    t["id"] && !t["noRestore"] && (this["_buffTimesMap"][t["id"]] = (this["_buffTimesMap"][t["id"]] || 0) + 1), 
                    this["addEffective"](t["effectiveId"], t);
                }, r["addEffective"] = function(t, n) {
                    var i;
                    if (i = e["getDataById"](table["baglike"]["BagLikeAbilityEffectiveConfig"], t)) switch (i["effectType"]) {
                      case y["ATTR"]:
                        this["addAttr"](i, n);
                        break;

                      case y["EXP_GAIN"]:
                        this["addExpGain"](i, n);
                        break;

                      case y["REPLACE_SKILL"]:
                        this["exchangeSkill"](i, n);
                        break;

                      case y["ADD_SKILL"]:
                        this["addSkill"](i, n);
                        break;

                      case y["ADD_PASSIVITY_SKILL"]:
                        this["ad"](i, n);
                        break;

                      case y["GEAR_UPGRAGE"]:
                        this["gearUpgrage"](i, n);
                        break;

                      case y["SPECIAL_WORD"]:
                        this["addSpecialWord"](i, n);
                        break;

                      case y["FEATURE"]:
                        this["addFeature"](i, n);
                    }
                }, r["addFormationEffectives"] = function(t, n) {
                    if (!this["_formationEffectiveMap"][t]) {
                        this["_formationEffectiveMap"][t] = n;
                        for (var i = function() {
                            var n = function() {
                                var t = HVn(HVn({}, aC, 0), hC, 0);
                                return t["rangeType"] = 0, t["range"] = 0, t;
                            }[H]();
                            return n["rangeType"] = g["HERO"], n["range"] = [ t ], n;
                        }[H](), r = 0; r < n["length"]; r++) this["addEffective"](n[r], i);
                    }
                }, r["addAttr"] = function(t, n) {
                    switch (null == n ? void 0 : n["rangeType"]) {
                      case g["ALL"]:
                        v["exAttrMgr"]["addAllHeroAttr"](t["attr"]);
                        break;

                      case g["HERO"]:
                        for (var i = n["range"], r = 0; r < i["length"]; r++) {
                            var u;
                            u = i[r], v["exAttrMgr"]["addSpecialHeroAttr"](u, t["attr"]);
                        }
                        break;

                      case g["MONSTER"]:
                        v["exAttrMgr"]["addMonsterAttr"](t["attr"]);
                        break;

                      case g["BOSS"]:
                        v["exAttrMgr"]["addBossAttr"](t["attr"]);
                        break;

                      case g["ELITE"]:
                        v["exAttrMgr"]["addEliteAttr"](t["attr"]);
                        break;

                      case g["HERO_SHAPE"]:
                        for (var o = n["range"], s = 0; s < o["length"]; s++) {
                            var e, h;
                            if (h = Number(o[s]), e = _["ins"]()["getHeroIdsForShape"](h)) for (var c = 0; c < e["length"]; c++) v["exAttrMgr"]["addSpecialHeroAttr"](e[c], t["attr"]);
                        }
                    }
                }, r["addExpGain"] = function(t, n) {
                    this["_expGain"] += Number(t["param"][0]) || 0;
                }, r["exchangeSkill"] = function(t, n) {
                    var i;
                    null != (i = t["param"]) && i[0] && v["exSkillMgr"]["setExchangeSkill"](t["param"][0]);
                }, r["addSkill"] = function(t, n) {
                    var i;
                    if (null != (i = t["param"]) && i[0]) if ((null == n ? void 0 : n["rangeType"]) == g["HERO"]) for (var r = n["range"], u = 0; u < r["length"]; u++) for (var o = 0; o < t["param"]["length"]; o++) v["exSkillMgr"]["addSkill"](r[u], t["param"][o]); else if ((null == n ? void 0 : n["rangeType"]) == g["MONSTER"]) for (var s = 0; s < t["param"]["length"]; s++) v["exSkillMgr"]["addMonsterSkill"](a["Monster"], t["param"][s]); else if ((null == n ? void 0 : n["rangeType"]) == g["ELITE"]) for (var e = 0; e < t["param"]["length"]; e++) v["exSkillMgr"]["addMonsterSkill"](a["Elite"], t["param"][e]); else if ((null == n ? void 0 : n["rangeType"]) == g["BOSS"]) for (var h = 0; h < t["param"]["length"]; h++) v["exSkillMgr"]["addMonsterSkill"](a["Boss"], t["param"][h]); else if ((null == n ? void 0 : n["rangeType"]) == g["HERO_SHAPE"]) for (var c = n["range"], f = 0; f < c["length"]; f++) {
                        var l, d;
                        if (d = Number(c[f]), l = _["ins"]()["getHeroIdsForShape"](d)) for (var m = 0; m < l["length"]; m++) for (var k = 0; k < t["param"]["length"]; k++) v["exSkillMgr"]["addSkill"](l[m], t["param"][k]);
                    }
                }, r["ad"] = function(t, n) {
                    var i;
                    if (null != (i = t["param"]) && i[0]) if ((null == n ? void 0 : n["rangeType"]) == g["HERO"]) for (var r = n["range"], u = 0; u < r["length"]; u++) for (var o = 0; o < t["param"]["length"]; o++) v["exSkillMgr"]["addSkill"](r[u], t["param"][o]); else if ((null == n ? void 0 : n["rangeType"]) == g["MONSTER"]) for (var s = 0; s < t["param"]["length"]; s++) v["exSkillMgr"]["addMonsterSkill"](a["Monster"], t["param"][s]); else if ((null == n ? void 0 : n["rangeType"]) == g["ELITE"]) for (var e = 0; e < t["param"]["length"]; e++) v["exSkillMgr"]["addMonsterSkill"](a["Elite"], t["param"][e]); else if ((null == n ? void 0 : n["rangeType"]) == g["BOSS"]) for (var h = 0; h < t["param"]["length"]; h++) v["exSkillMgr"]["addMonsterSkill"](a["Boss"], t["param"][h]); else if ((null == n ? void 0 : n["rangeType"]) == g["HERO_SHAPE"]) for (var c = n["range"], f = 0; f < c["length"]; f++) {
                        var l, d;
                        if (d = Number(c[f]), l = _["ins"]()["getHeroIdsForShape"](d)) for (var m = 0; m < l["length"]; m++) for (var k = 0; k < t["param"]["length"]; k++) v["exSkillMgr"]["addSkill"](l[m], t["param"][k]);
                    }
                }, r["gearUpgrage"] = function(t, n) {
                    k["bagLikeMgr"]["upgradeOneGear"]();
                }, r["addFeature"] = function(t, n) {
                    var i;
                    if (i = null == n ? void 0 : n["range"]) for (var r = 0; r < i["length"]; r++) this["addFeatureByHero"](i[r], t);
                }, r["addFeatureByHero"] = function(t, n) {
                    var i, r;
                    switch (i = n["param"][0]) {
                      case f["ACTIVE_KILL_FLY"]:
                      case f["ATTACK_KILL_FLY"]:
                        r = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn({}, cT, 0))["random"] = 0, t;
                            }[H]())["random"] = n["param"][1], t;
                        }[H]();
                        break;

                      case f["BOUNCE_TIMES"]:
                        r = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn({}, _C, 0))["times"] = 0, t;
                            }[H]())["times"] = n["param"][1], t;
                        }[H]();
                        break;

                      case f["HEAL_TO_SHIELD"]:
                        r = function() {
                            return function() {
                                return HVn({}, b_, n["param"][1]);
                            }[H]();
                        }[H]();
                        break;

                      default:
                        return;
                    }
                    v["exAttrMgr"]["addFeatureAttr"](t, i, r);
                }, r["addSpecialWord"] = function(t, n) {
                    var i, r, o, e, h;
                    switch (0, i = t["param"][0], e = t["param"][1], r = t["param"][d], o = t["param"][u], 
                    i) {
                      case p["DIE_ZHONG_DIE"]:
                        var c = {};
                        if ((null == n ? void 0 : n["rangeType"]) == g["HERO"]) for (var a = n["range"], l = 0; l < a["length"]; l++) c[a[l]] = !0; else c = null;
                        h = function() {
                            var n;
                            return (n = function() {
                                var t;
                                return (t = HVn(HVn(HVn(HVn({}, dT, 0), mT, 0), kT, 0), _C, 0))["rangeMap"] = 0, 
                                t["attrs"] = 0, t["maxTimes"] = 0, t["times"] = 0, t;
                            }[H]())["rangeMap"] = c, n["attrs"] = t["attr"], n["maxTimes"] = t["param"][0], 
                            n["times"] = 0, n;
                        }[H]();
                        break;

                      case p["DIE_SKILL_DIE"]:
                        var _ = {};
                        if ((null == n ? void 0 : n["rangeType"]) == g["HERO"]) for (var y = n["range"], C = 0; C < y["length"]; C++) _[y[C]] = !0; else _ = null;
                        var T = function() {
                            var n = function() {
                                var t = HVn(HVn(HVn(HVn(HVn({}, dT, 0), mT, 0), ST, 0), kT, 0), _C, 0);
                                return t["rangeMap"] = 0, t["attrs"] = 0, t["skillID"] = 0, t["maxTimes"] = 0, t["times"] = 0, 
                                t;
                            }[H]();
                            return n["rangeMap"] = _, n["attrs"] = t["attr"], n["skillID"] = t["param"][1], 
                            n["maxTimes"] = t["param"][d], n["times"] = 0, n;
                        }[H](), A = this["specialWordActiveMap"][i];
                        (A = A || {})[t["param"][1]] = T, h = A;
                        break;

                      case p["ADD_LEVEL2_GEAR"]:
                        h = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn({}, yT, 0), pT, 0))["dropId"] = 0, t["weightMultiple"] = 0, 
                                t;
                            }[H]())["dropId"] = Number(e), t["weightMultiple"] = Number(r), t;
                        }[H]();
                        break;

                      case p["POWER_NEAR_ATK_UP"]:
                        h = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn({}, CT, 0))["atkInc"] = 0, t;
                            }[H]())["atkInc"] = Number(e) / sC, t;
                        }[H]();
                        break;

                      case p["POWER_NEAR_WORKER_UP"]:
                        h = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn({}, AT, 0))["workerInc"] = 0, t;
                            }[H]())["workerInc"] = Number(e) / sC, t;
                        }[H]();
                        break;

                      case p["KILL_GET_COIN"]:
                        h = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn(HVn({}, BT, 0), wT, 0), bT, 0))["probability"] = 0, t["num"] = 0, 
                                t["heroId"] = 0, t;
                            }[H]())["probability"] = Number(e) / sC, t["num"] = Number(r), t["heroId"] = null == n ? void 0 : n["range"][0], 
                            t;
                        }[H]();
                        break;

                      case p["ROUND_END_GET_COIN"]:
                        h = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn({}, wT, 0), bT, 0))["num"] = 0, t["heroId"] = 0, t;
                            }[H]())["num"] = Number(e), t["heroId"] = null == n ? void 0 : n["range"][0], t;
                        }[H]();
                        break;

                      case p["REDUCE_REFRESH_BRICK_COST"]:
                        h = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn({}, LT, 0))["rate"] = 0, t;
                            }[H]())["rate"] = Number(e), t;
                        }[H]();
                        break;

                      case p["ADD_LEVEL3_GEAR"]:
                        h = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn({}, yT, 0), pT, 0))["dropId"] = 0, t["weightMultiple"] = 0, 
                                t;
                            }[H]())["dropId"] = Number(e), t["weightMultiple"] = Number(r), t;
                        }[H]();
                        break;

                      case p["MULTIPLE_CREATE_HERO"]:
                      case p["MULTIPLE_CREATE_TOWER"]:
                        h = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn({}, NT, 0))[""] = 0, t;
                            }[H]())[""] = [ Number(e), Number(r), Number(o) ], t;
                        }[H]();
                        break;

                      case p["REFRESH_LEVEL5_GEAR"]:
                        h = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn({}, LT, 0))["rate"] = 0, t;
                            }[H]())["rate"] = Number(e), t;
                        }[H]();
                        break;

                      case p["ADD_EXTRA_MONSTER"]:
                        var M = t["param"]["concat"]();
                        M["splice"](0, 1), h = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn({}, GT, 0))["roundIds"] = 0, t;
                            }[H]())["roundIds"] = M, t;
                        }[H]();
                        break;

                      case f["REDUCE_DAMAGE_FROM_HERO"]:
                        h = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn(HVn({}, OT, 0), xT, 0), LT, 0))["heroType"] = 0, t["monsterType"] = 0, 
                                t["rate"] = 0, t;
                            }[H]())["heroType"] = S["HAMSTER"], t["monsterType"] = e, t["rate"] = Number(r), 
                            t;
                        }[H]();
                        break;

                      case f["REDUCE_DAMAGE_FROM_TOWER"]:
                        h = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn(HVn({}, OT, 0), xT, 0), LT, 0))["heroType"] = 0, t["monsterType"] = 0, 
                                t["rate"] = 0, t;
                            }[H]())["heroType"] = S["WHEEL"], t["monsterType"] = e, t["rate"] = Number(r), t;
                        }[H]();
                        break;

                      case p["BIGGER_SIZES"]:
                        var w = k["bagLikeMgr"]["getUsedMapSize"](), b = k["bagLikeBuffMgr"]["specialWordActiveMap"][p["BIGGER_SIZES"]], E = {};
                        if (null == b || !b["attrs"] || null != b && b["attrs"], t["attr"]) for (var R in t["attr"]) E[R] = (t["attr"][R] || 0) + r * w;
                        var L = {};
                        if ((null == n ? void 0 : n["rangeType"]) == g["HERO"]) for (var D = n["range"], U = 0; U < D["length"]; U++) L[D[U]] = !0, 
                        v["exAttrMgr"]["addSpecialHeroAttr"](D[U], E), B["ins"]()["emit"](m["HERO_SCALE_SET"], function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn({}, bT, 0), Rv, 0))["heroId"] = 0, t["scale"] = 0, t;
                            }[H]())["heroId"] = D[U], t["scale"] = e, t;
                        }[H]()); else L = null;
                        h = function() {
                            var n;
                            return (n = function() {
                                var t;
                                return (t = HVn(HVn(HVn(HVn(HVn({}, dT, 0), Rv, 0), mT, 0), zT, 0), QT, 0))["rangeMap"] = 0, 
                                t["scale"] = 0, t["attrs"] = 0, t["oldSize"] = 0, t["addScale"] = 0, t;
                            }[H]())["rangeMap"] = L, n["scale"] = Number(e), n["attrs"] = t["attr"], n["oldSize"] = w, 
                            n["addScale"] = Number(r), n;
                        }[H]();
                        break;

                      case p["FORMATION_ATTR"]:
                        for (var N = k["bagLikeMgr"]["getWheels"](), P = 0; P < N["length"]; P++) {
                            var F;
                            F = N[P], v["exAttrMgr"]["addSpecialHeroAttr"](F, t["attr"]);
                        }
                        h = function() {
                            var n;
                            return (n = function() {
                                var t;
                                return (t = HVn({}, mT, 0))["attrs"] = 0, t;
                            }[H]())["attrs"] = t["attr"], n;
                        }[H]();
                        break;

                      case p["HEAL_HOME"]:
                        var G, V = e;
                        nA == V ? I["ins"]()["healHome"](r) : rA == V && ((G = k["bagLikeBuffMgr"]["specialWordActiveMap"][p["HEAL_HOME"]]) ? G["round"] = r : h = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn({}, uA, 0))["round"] = 0, t;
                            }[H]())["round"] = r, t;
                        }[H]());
                    }
                    h && (this["specialWordActiveMap"][i] = h, i == p["POWER_NEAR_WORKER_UP"]) && s["FacadeManager"]["emit"](m["BAGLIKE_WORKER_SPEED_UPDATE"]);
                }, r["getExCoinReward"] = function() {
                    var t;
                    return k["bagLikeBuffMgr"]["specialWordActiveMap"][p["ROUND_END_GET_COIN"]] ? (t = k["bagLikeBuffMgr"]["specialWordActiveMap"][p["ROUND_END_GET_COIN"]], 
                    k["bagLikeMgr"]["getUsedHeroNumByHeroId"](t["heroId"]) * t["num"]) : 0;
                }, r["getCreateTimes"] = function(t) {
                    var n, i;
                    switch (i = 1, n = null, t) {
                      case S["HAMSTER"]:
                        n = this["specialWordActiveMap"][p["MULTIPLE_CREATE_HERO"]];
                        break;

                      case S["WHEEL"]:
                        n = this["specialWordActiveMap"][p["MULTIPLE_CREATE_TOWER"]];
                    }
                    if (n) {
                        this["_createTimeWeight"]["reset"]();
                        for (var r = 0; r < n[""]["length"]; r++) this["_createTimeWeight"]["add"](r + 1, n[""][r]);
                        i = this["_createTimeWeight"]["extractOne"]();
                    }
                    return i;
                }, i(o, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = fA, t["get"] = function() {
                        return this["_buffTimesMap"];
                    }, t;
                }[Q](this)[H]() ]), o;
            }(o)), r[E][z]();
        }, b;
    }[Q](this)[H]();
});