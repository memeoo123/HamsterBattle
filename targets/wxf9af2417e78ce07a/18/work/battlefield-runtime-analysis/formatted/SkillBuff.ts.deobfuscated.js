// Module: chunks:///_virtual/SkillBuff.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./BattleTimer.ts, ./PoolManager.ts, ./MathUtils2.ts, ./BattleUtils.ts, ./FightTimeCheck.ts, ./GBattleIns.ts, ./BattleUnit.ts, ./PassivitySkillData.ts, ./SkillEnum.ts
(function(t) {
    var n, i, r, u, o, s, e, h, c, a, f, v, l, d;
    return B0n && bVn && (nAn += YSt, iAn += Rz), B0n = 0, function() {
        var m;
        return b0n && bVn && (nAn += YYt, iAn += qh), b0n && RVn && (nAn += "Beh", iAn += "ectP"), 
        b0n = 0, (m = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A], i = t["createClass"];
        }, function(t) {
            r = t[M];
        }, function(t) {
            u = t[w];
        }, function(t) {
            o = t["PoolManager"];
        }, function(t) {
            s = t["MathUtils"];
        }, function(t) {
            e = t["BattleUtils"];
        }, function(t) {
            h = t["FightTimeCheck"];
        }, function(t) {
            c = t[w];
        }, function(t) {
            a = t["BattleUnit"];
        }, function(t) {
            f = t["PassivitySkillData"];
        }, function(t) {
            v = t["BuffEffectPos"], l = t["BuffType"], d = t["PassivitySkillType"];
        } ], m[T] = function() {
            w0n && LVn && (nAn += "avior", iAn += "aram2"), w0n = 0, r[E][R]({}, jTn, b, void 0), 
            t(b, function(t) {
                var r, h;
                return h = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)[x] = void 0, i["cfg"] = void 0, 
                    i["count"] = void 0, i["casterUid"] = void 0, i[Y] = 0, i["nestedTimes"] = 0, i["casterAtk"] = void 0, 
                    i[W] = 0, i[P] = void 0, i["effectParm2"] = void 0, i["notExitBattleOutBuff"] = !1, 
                    i["timeLoop"] = 0, i["trigger"] = 0, i["maxTime"] = 0, i[F] = void 0, i["_buffGroupUid"] = void 0, 
                    i["skillBuffGroup"] = void 0, i["_skill"] = void 0, i["isLastMax"] = !1, i;
                }, n(h, t), (r = h[U])["init"] = function(t, n) {
                    this["cfg"] = t, this[P] = t["effectParam"], this["effectParm2"] = t["eff"], n && (this["maxTime"] = e["getFrameByTime"](n)), 
                    t["interval"] && (this["trigger"] = e["getFrameByTime"](t["interval"])), t["countLimit"] && (this["count"] = t["countLimit"]), 
                    this["notExitBattleOutBuff"] = 1 == t["notExitBattleOutBuff"];
                }, r["setTimeLimit"] = function(t) {
                    t && (this["maxTime"] = e["getFrameByTime"](t));
                }, r["setTarget"] = function(t, n) {
                    var i;
                    this[x] = t, this[F] = n, (i = c["StateMemory"]["getBatteUintByUid"](t["casterUid"])) && n instanceof a && (this[Y] = s[Y](i["pos"], n["pos"]));
                }, r["active"] = function() {
                    var t;
                    this["isAlive"]() && ((t = this["skillBuffGroup"]["cfg"]["animPosType"]) != v["OnceForAct"] && t !== v["actBuffTime"] && t !== v["actChanged"] || this[F]["addBuffEff"](this["skillBuffGroup"]), 
                    0 < this["count"]) && (this[F]["attr"]["isActBuffId"] = this["id"], this["count"]--, 
                    this["count"] <= 0) && (this["isReadyToRemove"] = !0);
                }, r["resData"] = function() {
                    this["_isReadyToRemove"] = !1, this["time"] = 0, this["cfg"]["countLimit"] && (this["count"] = this["cfg"]["countLimit"]);
                }, r["isAlive"] = function() {
                    return !this["isReadyToRemove"];
                }, r["nextFrame"] = function() {
                    this["_isReadyToRemove"] || (this["index"]++, this["index"] >= this["maxIndex"] && (this["index"] = 0, 
                    this["time"] += u["speed"], this["triggerHandler"](), this["nestedTimes"] = 0, this["maxTime"]) && this["time"] >= this["maxTime"] && (this["completeHandler"](!0), 
                    this["_isReadyToRemove"] = !0));
                }, r["triggerHandler"] = function() {
                    this["timeLoop"] += u["speed"], 0 != this["trigger"] && this["timeLoop"] >= this["trigger"] && (this["actionBuffEffect"](), 
                    this["timeLoop"] = 0);
                }, r["completeHandler"] = function(n) {
                    this["remove"](), t[U]["completeHandler"]["call"](this);
                }, r["actionBuffEffect"] = function() {
                    this[F]["isDeath"] || (this[N](), this["effectType"] != l["Attr"] && this["active"]());
                }, r["onAddBuff"] = function() {}, r[N] = function() {
                    var t;
                    this[F]["attr"]["isDeath"]() || this["effectType"] != l["Abnormal"] || (t = this[P]) && this[F]["setAbnormalStatus"](t["type"]);
                }, r["remove"] = function() {
                    this[F] && this["effectType"] == l["Abnormal"] && (t = this[P], this[F]["attr"]["clearAbnormalStatus"](t["type"]));
                    var t, n = this["cfg"]["endParam"];
                    n && (n["remove"] && this[F]["attr"]["removeGroupBuff"](n["remove"]), n["removePassiveSkill"]) && this[F]["attr"]["removePassiveSkill"](n["removePassiveSkill"]), 
                    c["buffMgr"]["removeUpdateBuffGroup"](this), this[F] && (this[F]["attr"]["removeBuffStatueByEffectType"](this["effectType"]), 
                    this[F]["attr"]["removeBuffListById"](this["id"]));
                }, r["getCloneData"] = function() {
                    return null;
                }, r["setCloneData"] = function(t) {}, r["dispose"] = function() {
                    this[F] = null, o["recovery"](this);
                }, r["destoryTimeCheck"] = function() {}, i(h, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = 0, t["get"] = 0, t["set"] = 0, 
                        t;
                    }[H]())["key"] = O, t["get"] = function() {
                        return this["_skill"];
                    }, t["set"] = function(t) {
                        (this["_skill"] = t) && t["skill"] instanceof f && t["skill"]["condition"] == d["ConType_1"] && (this["notExitBattleOutBuff"] = !0);
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = Zo, t["get"] = function() {
                        return this["cfg"]["id"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = sAn, t["get"] = function() {
                        return this["cfg"]["conditionType"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = MC, t["get"] = function() {
                        return this["cfg"]["effectType"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = 0, t["get"] = 0, t["set"] = 0, 
                        t;
                    }[H]())["key"] = Ost, t["get"] = function() {
                        return this["_buffGroupUid"];
                    }, t["set"] = function(t) {
                        this["_buffGroupUid"] = t, this["skillBuffGroup"] = c["buffMgr"]["getBuffGroupByGroupUid"](this["_buffGroupUid"]);
                    }, t;
                }[Q](this)[H](), function() {
                    var n;
                    return (n = function() {
                        var t;
                        return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = 0, t["get"] = 0, t["set"] = 0, 
                        t;
                    }[H]())["key"] = nY, n["get"] = function() {
                        return t[U]["isReadyToRemove"];
                    }, n["set"] = function(t) {
                        this["_isReadyToRemove"] || (this["_isReadyToRemove"] = t) && this["completeHandler"]();
                    }, n;
                }[Q](this)[H]() ]), h;
            }(h)), r[E][z]();
        }, m;
    }[Q](this)[H]();
});