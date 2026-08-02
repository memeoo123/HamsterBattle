// Module: chunks:///_virtual/BattleAttr.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./G.ts, ./PoolManager.ts, ./TableManager.ts, ./MathUtils2.ts, ./SortUtils.ts, ./BattleUtils.ts, ./GBattleIns.ts, ./BattleConstantConfig.ts, ./BattleEnum.ts, ./FightSkillInfo.ts, ./PassivitySkillData.ts, ./PassivitySkillUtils.ts, ./SkillEnum.ts, ./SkillUtils.ts, ./AbnormalStatus.ts, ./AttrEnum.ts
(function(t) {
    var n, i, r, o, s, e, h, c, a, f, v, l, d, m, k, _, S, g, y, p, I, A, B, b;
    return nWn && EVn && (SJ += Rv, TJ += oZ, IZ += M_), nWn && bVn && (MJ += Qb), nWn && LVn && (jJ = "a", 
    uZ = "", QX = ""), nWn && bVn && (jJ += IBt), nWn && RVn && (SJ += "tOXos1syWmj", 
    JJ += "itSk"), nWn && LVn && (NJ += "buf", PJ += "kT"), nWn && RVn && (SJ += "aWK", 
    wZ += "peed"), nWn && RVn && (wZ += "Add"), nWn = 0, function() {
        var L;
        return rWn && bVn && (MJ += LRt), rWn && EVn && (JJ += svt, jJ += lwn, wZ += cmn), 
        rWn && RVn && (TJ += "searchRa", jJ += "ddActiveS", uZ += "horseSki", IZ += "surp", 
        QX += "at"), rWn && LVn && (MJ += "rthMaxTi"), rWn && RVn && (NJ += "f"), rWn && LVn && (PJ += "imeSp", 
        JJ += "ill"), rWn = 0, (L = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t["createClass"];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t[w];
        }, function(t) {
            o = t["PoolManager"];
        }, function(t) {
            s = t["TableManager"];
        }, function(t) {
            e = t["MathUtils"];
        }, function(t) {
            h = t["SortUtils"];
        }, function(t) {
            c = t["BattleUtils"];
        }, function(t) {
            a = t[w];
        }, function(t) {
            f = t[w];
        }, function(t) {
            v = t["UnitType"], l = t["MonsterType"];
        }, function(t) {
            d = t["FightSkillInfo"];
        }, function(t) {
            m = t["PassivitySkillData"];
        }, function(t) {
            k = t["PassivitySkillUtils"];
        }, function(t) {
            _ = t["SkillType"], S = t["PassivitySkillType"], g = t["SkillSubType"], y = t["SkillTargetType"], 
            p = t["BuffType"], I = t["AbnormalType"];
        }, function(t) {
            A = t["SkillUtils"];
        }, function(t) {
            B = t["AbnormalStatus"];
        }, function(t) {
            b = t["AttrEnum"];
        } ], L[T] = function() {
            iWn && bVn && (TJ += NF), iWn && EVn && (NJ += S5, PJ += F4, uZ += Ih, IZ += Gyt), 
            iWn && RVn && (TJ += "nge", jJ += "kill", uZ += "ll", IZ += "lus", QX += "kSpe"), 
            iWn && LVn && (MJ += "me"), iWn && RVn && (NJ += "Map", PJ += "eed"), iWn = 0, i[E][R]({}, SJ, gJ, void 0), 
            t(gJ, function() {
                var t, i;
                return uWn && EVn && (QX += uwn), uWn && RVn && (IZ += "Hp"), uWn && LVn && (QX += "ed"), 
                uWn = 0, (i = function() {
                    this["_hp"] = void 0, this["_shieldHp"] = 0, this["_isDeath"] = !1, this["_isBoom"] = !1, 
                    this["name"] = void 0, this["_cfg"] = void 0, this["_"] = void 0, this["_rebirthTime"] = void 0, 
                    this["_rebi"] = void 0, this["rebirthMaxTime"] = 0, this["_activeSkills"] = [], 
                    this["_passiveSkills"] = [], this["_horseSkillMap"] = {}, this["_attrs"] = void 0, 
                    this["_attrsMod"] = void 0, this["_secondAttrsMod"] = void 0, this["_buffs"] = void 0, 
                    this["_owner"] = void 0, this["_waitActiveBehavoirs"] = [], this["_abnormalStatus"] = new B, 
                    this["buffStatue"] = {}, this[""] = {}, this["at"] = qi, this["initMoveSpeed"] = void 0, 
                    this["normalMaxHp"] = void 0, this["_maxHp"] = 0, this["size"] = af, this["passSkillFlagMap"] = void 0, 
                    this["passSkillFlagSkillMap"] = void 0, this["isActBuffId"] = void 0;
                })["create"] = function(t) {
                    var n;
                    return (n = new i)["owner"] = t, n;
                }, (t = i[U])["initSkillByMonster"] = function() {
                    for (var t = a["UnitFactory"]["createSkillCfgs"](this["_cfg"]), n = 0; n < t["length"]; n++) this["initSkillHandler"](t[n]);
                    h["sortBy2"](this["_activeSkills"], [ "skillIndex" ], [ !0 ], !1);
                }, t["in"] = function(t) {
                    for (var n = 0; n < t["length"]; n++) {
                        var i;
                        (i = s["getDataById"](table["battle"]["SkillConfig"], t[n])) ? this["initSkillHandler"](i) : r["Logger"]["error"](ZJ + t[n]);
                    }
                    h["sortBy2"](this["_activeSkills"], [ "skillIndex" ], [ !0 ], !1);
                }, t["initSkillHandler"] = function(t) {
                    var n;
                    if ((n = a["SkillFactory"]["create"](t["belongType"]))["init"](this["owner"], t["id"]), 
                    n["cfg"]["type"] != _["ACTIVE_SKILL"] && n["cfg"]["type"] != _["Guiding_Skills"] && n["cfg"]["type"] != _["ATTACK"] || (n["skillIndex"] = n["type"] == _["ACTIVE_SKILL"] ? 1 : 0, 
                    this[9](n)), n["cfg"]["skills"]) for (var i = 0; i < n["cfg"]["skills"]["length"]; i++) this["addPassiveSkill"](n["cfg"]["skills"][i], n["fightSkillInfo"]);
                }, t["updateSkills"] = function(t) {
                    for (var n = [], i = 0; i < this["_activeSkills"]["length"]; i++) n[R](this["_activeSkills"][i]["skillId"]), 
                    -1 == t["indexOf"](this["_activeSkills"][i]["skillId"]) && (this["_activeSkills"][i]["removeAllBehaviorBuff"](), 
                    this["_activeSkills"]["splice"](i, 1), i--);
                    for (var u = 0; u < t["length"]; u++) {
                        var o;
                        (o = s["getDataById"](table["battle"]["SkillConfig"], t[u])) ? o["type"] == _["ATTR_SKILL"] ? -1 == n["indexOf"](t[u]) && this["initSkillHandler"](o) : o["type"] == _["PASSIVE_SKILL"] && this["initSkillHandler"](o) : r["Logger"]["error"](ZJ + t[u]);
                    }
                }, t[9] = function(t) {
                    var n;
                    this["_activeSkills"][R](t), t["cfg"][0] && ((n = a["SkillFactory"]["create"](t["cfg"]["belongType"]))["init"](this["owner"], t["cfg"][0]), 
                    n["skillIndex"] = t["skillIndex"], this["_horseSkillMap"][t["skillId"]] = n);
                }, t["addPassiveSkill"] = function(t, n) {
                    var i;
                    (i = o["getItem"](m))["init"](this["_owner"], t), i["fightSkillInfo"] = n;
                    for (var r = 0; r < this["_passiveSkills"]["length"]; r++) if (i["cfg"]["group"] && this["_passiveSkills"][r]["cfg"]["group"] == i["cfg"]["group"]) {
                        this["_passiveSkills"][r]["removeAllBehaviorBuff"](), this["_passiveSkills"]["splice"](r, 1);
                        break;
                    }
                    this["_passiveSkills"][R](i), k["checkPassSkillCon"](S["ConType_1"], this["owner"], this["owner"]);
                }, t["addOtherPassiveSkill"] = function(t) {
                    this["addPassiveSkill"](t + "", o["getItem"](d));
                }, t["removePassiveSkill"] = function(t) {
                    for (var n = 0; n < this["_passiveSkills"]["length"]; n++) if (this["_passiveSkills"][n]["skillId"] == t) {
                        this["_passiveSkills"]["splice"](n, 1);
                        break;
                    }
                }, t["addPassiveSkillFlag"] = function(t, n) {
                    this["passSkillFlagMap"] || (this["passSkillFlagMap"] = {}), this["passSkillFlagSkillMap"] || (this["passSkillFlagSkillMap"] = {}), 
                    this["passSkillFlagMap"][t] = n["cfg"]["param"] || !0, this["passSkillFlagSkillMap"][t] = n;
                }, t["removePassiveSkillFlag"] = function(t) {
                    this["passSkillFlagMap"] && delete this.passSkillFlagMap[t], this["passSkillFlagSkillMap"] && delete this.passSkillFlagSkillMap[t];
                }, t["getPassiveSkillFlag"] = function(t) {
                    return this["passSkillFlagMap"] ? this["passSkillFlagMap"][t] : null;
                }, t["getPassiveSkillFlagSkillBehavior"] = function(t) {
                    return this["passSkillFlagSkillMap"] ? this["passSkillFlagSkillMap"][t] : null;
                }, t["getHorseSkill"] = function(t) {
                    return this["_horseSkillMap"][t];
                }, t["init"] = function() {
                    this["_attrs"] = {}, this["_buffs"] = [], this["isActBuffId"] = null, this["_"] = this["_cfg"]["searchRange"], 
                    this["_rebi"] = c["getFrameByTime"](f["rebirthWaitTime"]), this["size"] = af;
                }, t["initByHome"] = function(t) {
                    this["_attrs"] = {}, this["_buffs"] = [], this["_attrs"][b["ATK"]] = 0, this["_attrs"][b["HP"]] = t, 
                    this["_hp"] = t, this["initMaxHp"]();
                }, t["initByHero"] = function(t, n) {
                    this["_cfg"] = t, this["init"](), this["_isBoom"] = !1, this["name"] = t["name"], 
                    this["initHeroAttr"](n), this["in"](n["skillIds"]);
                }, t["initByMonster"] = function(t, n) {
                    if (this["_cfg"] = t, this["init"](), n) {
                        for (var i in n["attrs"]) this["_attrs"][i] = n["attrs"][i];
                        if (n["secondAttrs"]) for (var r in n["secondAttrs"]) this["_attrs"][r] ? this["_attrs"][r] += n["secondAttrs"][r] : this["_attrs"][r] = n["secondAttrs"][r];
                        !n[""] || n[""] < 0 ? this["_hp"] = this["_attrs"][b["HP"]] : this["_hp"] = n[""];
                    } else {
                        if (this["_attrs"][b["ATK"]] = this["_attrsMod"] && this["_attrsMod"][b["ATK"]] ? Math["floor"](this["_attrsMod"][b["ATK"]] * this["_cfg"]["atk"]) : this["_cfg"]["atk"], 
                        this["_attrs"][b["HP"]] = this["_attrsMod"] && this["_attrsMod"][b["HP"]] ? Math["floor"](this["_attrsMod"][b["HP"]] * this["_cfg"]["hp"]) : this["_cfg"]["hp"], 
                        this["_secondAttrsMod"]) for (var u in this["_secondAttrsMod"]) this["_attrs"][u] ? this["_attrs"][u] += this["_secondAttrsMod"][u] : this["_attrs"][u] = this["_secondAttrsMod"][u];
                        this["_hp"] = this["_attrs"][b["HP"]];
                    }
                    this["initMoveSpeed"] = f["monsterMoveSpeed"], this["name"] = t["name"], this["_isBoom"] = !1, 
                    this["initMaxHp"](), this["in"](n["skillIds"]);
                }, t["initHeroAttr"] = function(t) {
                    for (var n in t["attrs"]) this["_attrs"][n] = t["attrs"][n];
                    if (t["secondAttrs"]) for (var i in t["secondAttrs"]) this["_attrs"][i] ? this["_attrs"][i] += t["secondAttrs"][i] : this["_attrs"][i] = t["secondAttrs"][i];
                    !t[""] || t[""] < 0 ? this["_hp"] = this["_attrs"][b["HP"]] : this["_hp"] = t[""], 
                    this["initMoveSpeed"] = f["heroMoveSpeed"], this["initMaxHp"]();
                }, t["setAttrMod"] = function(t, n, i) {
                    if (this["_attrsMod"] = {}, this["_secondAttrsMod"] = {}, t && (this["_attrsMod"][b["ATK"]] = t / f["getRandBase"]), 
                    n && (this["_attrsMod"][b["HP"]] = n / f["getRandBase"]), i) for (var r = 0; r < i["length"]; r++) {
                        var u;
                        u = s["getDataById"](table["battle"]["AttributeConfig"], i[r]["k"])["tid"], this["_secondAttrsMod"][u] = +i[r]["v"];
                    }
                }, t["initMaxHp"] = function() {
                    this["normalMaxHp"] = this["_attrs"][b["HP"]], this["maxHp"] = 0;
                }, t["addMaxHp"] = function(t, n) {
                    var i;
                    i = Math["floor"](this["normalMaxHp"] * t / f["getRandBase"]), n && 0 < t ? (this["_maxHp"] -= i, 
                    this["_maxHp"] = Math["max"](1, this["_maxHp"])) : (this["_maxHp"] += i, this["hp"] += Math["floor"](this["hp"] * t / f["getRandBase"]));
                }, t["getMoveS"] = function() {
                    return 1 + this["getBuffValue"](b["MOVE_SPD"]) / f["getRandBase"];
                }, t["getBuffValue"] = function(t, n) {
                    var i, r, u;
                    return r = +this["_attrs"][t] || 0, i = a["buffMgr"]["getBuffAttrMap"](this["owner"], n = void 0 !== n && n), 
                    u = function() {
                        var t;
                        return (t = function() {
                            var t;
                            return (t = HVn(HVn({}, b_, 0), LZ, 0))["per"] = 0, t;
                        }[H]())["per"] = 0, t;
                    }[H](), i && i[t] && (u = i[t]), this["owner"]["type"] == v["Hero"] ? r += a["exAttrMgr"]["getHeroAttr"](this["_cfg"]["id"], t) : (r += a["exAttrMgr"]["getMonsterAttr"](t), 
                    this["owner"]["type"] == v["Boss"] && (r += a["exAttrMgr"]["getBossAttr"](t)), this["owner"]["type"] == v["Monster"] && this["owner"]["monsterType"] == l["Elite"] && (r += a["exAttrMgr"]["getEliteAttr"](t))), 
                    r + u["value"];
                }, t["isFullHp"] = function() {
                    return this["hp"] >= this["maxHp"];
                }, t["isAlive"] = function() {
                    return !this["_isDeath"];
                }, t["isDeath"] = function() {
                    return this["_isDeath"];
                }, t["isCanRebirth"] = function() {
                    return !1;
                }, t["rebirth"] = function() {
                    this["hp"] = this["maxHp"], this["_rebirthTime"] = 0, this["_buffs"] = [];
                }, t[q] = function(t) {
                    var n;
                    if (0 < this["_shieldHp"]) {
                        if (this["_shieldHp"] > t) return void (this["_shieldHp"] -= t);
                        t -= this["_shieldHp"], this["_shieldHp"] = 0;
                    }
                    n = this["hp"], (n -= t) <= 0 && (n = 0), this["hp"] = n, 0 == this["hp"] && (this["_isBoom"] || (this["_isBoom"] = !0, 
                    k["checkPassSkillCon"](S["ConType_14"], this["owner"], this["owner"])), this["hp"] <= 0) && (this["_isDeath"] = !0, 
                    k["checkDiePassSkill"](this["owner"]), this["onDie"]());
                }, t["healShield"] = function(t) {
                    this["_shieldHp"] += t;
                }, t["heal"] = function(t) {
                    var n;
                    n = this["hp"], n += t, this["hp"] = Math["min"](n, this["maxHp"]);
                }, t["onDie"] = function() {
                    this["resetBuff"]();
                }, t["resetBuff"] = function(t) {
                    this["removeAllBuffs"](t = void 0 !== t && t), this["_waitActiveBehavoirs"] = [];
                }, t["resetSkillAllCd"] = function() {
                    for (var t = this["_activeSkills"]["length"] - 1; 0 <= t; t--) this["_activeSkills"][t]["clearAllCd"]();
                }, t["resetSkillPreCd"] = function() {
                    for (var t = this["_activeSkills"]["length"] - 1; 0 <= t; t--) this["_activeSkills"][t]["resPreCd"]();
                }, t["resetSkillCd"] = function() {
                    for (var t = this["_passiveSkills"]["length"] - 1; 0 <= t; t--) {
                        var n;
                        (n = this["_passiveSkills"][t])["cfg"]["exitClearCd"] && n["clearAllCd"]();
                    }
                }, t["getActiveSkill"] = function(t) {
                    var n;
                    if ("" != (t = void 0 === t ? "" : t)) for (var i = this["_activeSkills"]["length"] - 1; 0 <= i; i--) {
                        var r;
                        if (t == (r = this["_activeSkills"][i])["cfg"]["id"]) {
                            if (r[G]()) {
                                var u, o;
                                if (r["subType"] == g["Assassinate"]) if (o = A["searchTarget"](r, this["_owner"]), 
                                u = e[Y](o["pos"], this["_owner"]["pos"]), !o || u < this["getNormalSkillRange"]()) continue;
                                return r;
                            }
                            break;
                        }
                    }
                    for (var s = this["_activeSkills"]["length"] - 1; 0 <= s; s--) {
                        var h;
                        if ((h = this["_activeSkills"][s])[G]() && (this["canSkill"]() || _["ATTACK"] == h["type"]) && (h["subType"] != g["Assassinate"] || A["searchTarget"](h, this["_owner"]))) {
                            n = h;
                            break;
                        }
                    }
                    return n;
                }, t["getSkillByIndex"] = function(t) {
                    for (var n = this["_activeSkills"]["length"] - 1; 0 <= n; n--) {
                        var i;
                        if (t == (i = this["_activeSkills"][n])["skillIndex"] && i[G]()) return i;
                    }
                    return null;
                }, t["actionSkill"] = function(t, n) {
                    for (var i = t["actionSkill"](), r = 0; r < i["length"]; r++) {
                        var u, o;
                        (u = i[r])["setCaster"](this["_owner"]), (null == (o = u["cfg"]) ? void 0 : o["targetType"]) == y["SELF"] && (n = this["_owner"]), 
                        (u["skillTarget"] = n)["unit"] && (u["skillTargetUid"] = n["uid"]), u["isOnTime"] && u["actionEffect"](), 
                        u["isEnd"] || this["_waitActiveBehavoirs"][R](u);
                    }
                }, t["removeSkillBehavoirs"] = function() {
                    this["_waitActiveBehavoirs"]["length"] = 0;
                }, t["addSkillBehavoir"] = function(t) {
                    t["isEnd"] || this["_waitActiveBehavoirs"][R](t);
                }, t["updateSkillCD"] = function() {
                    for (var t = this["_activeSkills"]["length"] - 1; 0 <= t; t--) this["_activeSkills"][t]["nextFrame"]();
                    for (var n = this["_passiveSkills"]["length"] - 1; 0 <= n; n--) this["_passiveSkills"][n]["nextFrame"]();
                }, t["checkBehavoirs"] = function() {
                    if (this["_waitActiveBehavoirs"]["length"]) for (var t = 0; t < this["_waitActiveBehavoirs"]["length"]; t++) {
                        var n;
                        (n = this["_waitActiveBehavoirs"][t])["isReadyToRemove"] ? (this["_waitActiveBehavoirs"]["splice"](t, 1), 
                        t--) : n["nextFrame"]();
                    }
                }, t["addBuff"] = function(t) {
                    var n;
                    if (this["isDeath"]()) return !1;
                    this["_buffs"][R](t), this[""][t["id"]] = t, (n = this["buffStatue"][t["cfg"]["effectType"]]) ? n++ : n = 1, 
                    this["buffStatue"][t["cfg"]["effectType"]] = n, t["effectType"] == p["Attr"] && a["buffMgr"]["clearCacheAttrBuff"](this["owner"]);
                }, t["getBuffById"] = function(t) {
                    return this[""][t];
                }, t["removeAllBuffs"] = function(t) {
                    void 0 === t && (t = !1);
                    for (var n = [], i = 0; i < this["_buffs"]["length"]; i++) this["_buffs"][i]["notExitBattleOutBuff"] && t || (n[R](this["_buffs"][i]), 
                    this["_buffs"]["splice"](i, 1), i--);
                    for (;n["length"]; ) this["removeBuffById"](n["shift"]()["id"]);
                }, t["removeBuffStatueByEffectType"] = function(t) {
                    var n;
                    0 < (n = this["buffStatue"][t]) && (this["buffStatue"][t] = --n);
                }, t["removeBuffById"] = function(t) {
                    var n;
                    (n = this[""][t]) && n["effectType"] != p["Attr"] || a["buffMgr"]["clearCacheAttrBuff"](this["owner"]), 
                    delete this.buffMap[t], n && (n["isReadyToRemove"] = !0);
                }, t["removeBuffListById"] = function(t) {
                    for (var n = 0; n < this["_buffs"]["length"]; n++) if (this["_buffs"][n]["id"] == t) {
                        this["removeBuffById"](this["_buffs"][n]["id"]), this["_buffs"]["splice"](n, 1)[0];
                        break;
                    }
                }, t["getGroupBuff"] = function(t) {
                    var n, i;
                    for (i in n = [], this[""]) this[""][i]["cfg"]["group"] == t && n[R](this[""][i]);
                    return n;
                }, t["removeGroupBuff"] = function(t) {
                    for (var n in this[""]) this[""][n]["cfg"]["group"] == t && this["removeBuffById"](this[""][n]["id"]);
                }, t["setAbnormalStatus"] = function(t, n) {
                    this["_abnormalStatus"]["setStatus"](t, n);
                }, t["clearAbnormalStatus"] = function(t) {
                    this["_abnormalStatus"]["cleanStatus"](t);
                }, t["clearAllAbnormalStatusByType"] = function(t) {
                    this["_abnormalStatus"]["clearAllAbnormalStatusByType"](t);
                }, t["buffStatueByType"] = function(t) {
                    return !!this["buffStatue"][t];
                }, t["isImmuneControl"] = function() {
                    return this["_abnormalStatus"]["hasStatus"](I["ImmuneControl"]);
                }, t["canSelect"] = function() {
                    return !this["_abnormalStatus"]["hasStatus"](I["notSelect"]);
                }, t["isLowHatred"] = function() {
                    return this["_abnormalStatus"]["hasStatus"](I["lowHatred"]);
                }, t["canForceMove"] = function() {
                    return !this["_abnormalStatus"]["hasStatus"](I["StopForceMove"]) && !this["_abnormalStatus"]["hasStatus"](I["ImmuneControl"]);
                }, t["canMove"] = function() {
                    return !this["isDeath"]() && !this["_abnormalStatus"]["hasStatus"](I["NotMove"]) && !this["_abnormalStatus"]["hasStatus"](I["dizziness"]);
                }, t["canAttack"] = function() {
                    return !this["isDeath"]() && !this["_abnormalStatus"]["hasStatus"](I["NotAttack"]) && !this["_abnormalStatus"]["hasStatus"](I["dizziness"]);
                }, t["canSkill"] = function() {
                    return !!a[X]["canSkill"] && !this["_abnormalStatus"]["hasStatus"](I["Silent"]);
                }, t["isInvincible"] = function() {
                    return !this["isDeath"]() && !!this["_abnormalStatus"]["hasStatus"](I["Invincible"]);
                }, t["update"] = function() {
                    this["checkBehavoirs"]();
                }, t["updateRebirthTime"] = function() {
                    0 < this["_rebirthTime"] && this["_rebirthTime"]--;
                }, t["getHeroConfigId"] = function() {
                    return this["_cfg"]["id"];
                }, t["getConfigId"] = function() {
                    return this["_cfg"]["id"];
                }, t["getMonsterCfg"] = function() {
                    return this["_cfg"];
                }, t["getHeroCfg"] = function() {
                    return this["_cfg"];
                }, t["isReActSkill"] = function() {
                    for (var t = this["_activeSkills"]["length"] - 1; 0 <= t; t--) if (this["_activeSkills"][t]["subType"] == g["Assassinate"]) return !0;
                }, t["getNormalSkillRange"] = function() {
                    var t;
                    return (null == (t = this["_activeSkills"][0]) ? void 0 : t["castingRange"]) || af;
                }, n(i, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = 0, t["get"] = 0, t["set"] = 0, 
                        t;
                    }[H]())["key"] = $W, t["get"] = function() {
                        return this["_owner"];
                    }, t["set"] = function(t) {
                        this["_owner"] = t;
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = qX, t["get"] = function() {
                        return this["_passiveSkills"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = lZ, t["get"] = function() {
                        return this["_"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = 0, t["get"] = 0, t["set"] = 0, 
                        t;
                    }[H]())["key"] = pR, t["get"] = function() {
                        return this["_hp"];
                    }, t["set"] = function(t) {
                        this["_hp"] = Math["floor"](t), 0 < this["_hp"] && (this["_isDeath"] = !1);
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = 0, t["get"] = 0, t["set"] = 0, 
                        t;
                    }[H]())["key"] = FF, t["get"] = function() {
                        return Math["max"](this["normalMaxHp"] + this["_maxHp"], 1);
                    }, t["set"] = function(t) {
                        this["_maxHp"] = Math["floor"](t);
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = zX, t["get"] = function() {
                        return this[0] / qi;
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = QX, t["get"] = function() {
                        return this["at"] * (1 + this["getBuffValue"](b["ATK_SPD"]) / f["getRandBase"]);
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = jX, t["get"] = function() {
                        return this["hp"] / this["maxHp"] * V_;
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = $X, t["get"] = function() {
                        var t;
                        return t = e["toFiexd"](this["initMoveSpeed"] * this["getMoveS"](), u), Math["max"](0, t);
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = ux, t["get"] = function() {
                        return this["_buffs"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = 0, t["get"] = 0, t["set"] = 0, 
                        t;
                    }[H]())["key"] = nq, t["get"] = function() {
                        return this["_isBoom"];
                    }, t["set"] = function(t) {
                        this["_isBoom"] = t;
                    }, t;
                }[Q](this)[H]() ]), i;
            }()), i[E][z]();
        }, L;
    }[Q](this)[H]();
});