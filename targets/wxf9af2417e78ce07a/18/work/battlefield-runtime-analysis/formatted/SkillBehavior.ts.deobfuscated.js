// Module: chunks:///_virtual/SkillBehavior.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./FacadeManager.ts, ./PoolManager.ts, ./TableManager.ts, ./GIns.ts, ./NotificationKey.ts, ./BattleUtils.ts, ./FightTimeCheck.ts, ./BattleEnum.ts, ./BattleUnit.ts, ./LeaderSkillData.ts, ./SkillData.ts, ./SkillEnum.ts
(function(t) {
    var n, i, r, u, o, s, e, h, c, a, f, v, l, d, m;
    return A0n && EVn && (JTn += kNn), A0n && bVn && (qTn += fun), A0n && RVn && (JTn += "2962VE5BAN5kME"), 
    A0n && RVn && (JTn += "74ejNb7", qTn += "empAtt"), A0n = 0, function() {
        var k;
        return M0n && EVn && (qTn += hyn), M0n && RVn && (qTn += "r"), M0n = 0, (k = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A], i = t["createClass"];
        }, function(t) {
            r = t[M];
        }, function(t) {
            u = t[w];
        }, function(t) {
            o = t["PoolManager"];
        }, function(t) {
            s = t["TableManager"];
        }, function(t) {
            e = t[w];
        }, function(t) {
            h = t[w];
        }, function(t) {
            c = t["BattleUtils"];
        }, function(t) {
            a = t["FightTimeCheck"];
        }, function(t) {
            f = t["WorldUnitTeam"];
        }, function(t) {
            v = t["BattleUnit"];
        }, function(t) {
            l = t["LeaderSkillData"];
        }, function(t) {
            d = t["SkillData"];
        }, function(t) {
            m = t["EffectLayer"];
        } ], k[T] = function() {
            0, r[E][R]({}, JTn, Net, void 0), t(Net, function(t) {
                var r, a;
                return a = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)["owner"] = void 0, i["atk"] = 0, 
                    i["_attrs"] = void 0, i["skillTargetUid"] = void 0, i["offAngle"] = 0, i["skillTarget"] = void 0, 
                    i["index"] = 0, i["cfg"] = void 0, i["startTime"] = void 0, i["timeLoop"] = 0, i["trigger"] = 0, 
                    i["maxTime"] = 0, i["skill"] = void 0, i["addAttrMap"] = void 0, i["tempAddDamageValue"] = 0, 
                    i;
                }, n(a, t), a["createBehavior"] = function(t, n, i) {
                    var r, u;
                    if (void 0 === n && (n = 0), u = s["getDataById"](table["battle"]["BehaviorConfig"], t)) return (r = o["getItem"](a))["init"](u, n, i), 
                    r;
                    console["warn"](rcn + t);
                }, a["createBehaviorAndActionEffect"] = function(t, n, i, r) {
                    var u;
                    return (u = this["createBehavior"](t, 0, r))["index"] = 0, u["setCaster"](n), i && (u["skillTarget"] = i, 
                    u["skillTargetUid"] = i["uid"]), u["actionEffect"](), u;
                }, (r = a[U])["init"] = function(t, n, i) {
                    this["cfg"] = t, this["startTime"] = c["getFrameByTime"](n), this["maxTime"] = this["startTime"] || 0, 
                    this["skill"] = i, this["tempAddDamageValue"] = 0;
                }, r["setCaster"] = function(t) {
                    this["owner"] = t, this["atk"] = t["atk"];
                }, r["actionEffect"] = function() {
                    this["skill"]["fightSkillInfo"]["beginBehaviorEffect"](this, this["owner"]), this["skill"]["isBeginBehavior"] = !0, 
                    this["isReadyToRemove"] = !0, this["skill"] instanceof l || this["skill"]["refreshCD"](), 
                    this["owner"]["teamId"] == f["Self"] && this["skill"] instanceof d && u["ins"]()["emit"](h["BATTLE_SKILL_CD_UPDATE"], this["skill"]);
                }, r["showSkillEffect"] = function(t) {
                    if (this["cfg"]["modelId"]) {
                        var n, i, r;
                        if (i = 1, this["owner"] instanceof v && this["owner"]["node"]["isValid"] && (i = this["owner"]["node"]["getScale"]()["x"]), 
                        r = this["cfg"]["modelId"]["up"]) for (var u = 0; u < r["length"]; u++) {
                            var o;
                            o = r[u], this["owner"]["attrHeroId"] && (o = e["heroSkinModel"]["getReplaceModelId"](o, this["owner"]["attrHeroId"])), 
                            t["createFightEffect"](o, this["cfg"]["animPosType"], t, m["RoleLayer"], !1, i);
                        }
                        if (n = this["cfg"]["modelId"]["low"]) for (var s = 0; s < n["length"]; s++) {
                            var h;
                            h = n[s], this["owner"]["attrHeroId"] && e["heroSkinModel"]["getReplaceModelId"](h, this["owner"]["attrHeroId"]), 
                            t["createFightEffect"](n[s], this["cfg"]["animPosType"], t, m["BgLayer"], !1, i);
                        }
                    }
                }, r["triggerHandler"] = function() {
                    this["time"] >= this["startTime"] && (this["timeLoop"] = 0, this["actionEffect"]());
                }, r["pushT"] = function(t, n) {
                    this["addAttrMap"] || (this["addAttrMap"] = {}), this["addAttrMap"][t] || (this["addAttrMap"][t] = 0), 
                    this["addAttrMap"][t] += n;
                }, r["getTempAttrByKey"] = function(t) {
                    return this["addAttrMap"] && this["addAttrMap"][t] || 0;
                }, r["getTempAttr"] = function() {
                    return this["addAttrMap"];
                }, r["destoryTimeCheck"] = function() {}, i(a, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = fX, t["get"] = function() {
                        return 0 == this["startTime"] || this["time"] >= this["startTime"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = lW, t["get"] = function() {
                        return 0 == this["maxTime"] || this["time"] >= this["maxTime"];
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
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = qW, t["get"] = function() {
                        return this["cfg"]["effectParam"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = Gyt, t["get"] = function() {
                        var t, n;
                        return t = sC, (t = this["cfg"]["effectParam"] && (n = this["cfg"]["effectParam"]) ? n[K] : t) + this["tempAddDamageValue"];
                    }, t;
                }[Q](this)[H]() ]), a;
            }(a)), r[E][z]();
        }, k;
    }[Q](this)[H]();
});