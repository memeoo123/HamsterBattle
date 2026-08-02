// Module: chunks:///_virtual/PassivitySkillData.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./G.ts, ./TableManager.ts, ./BattleUtils.ts, ./BattleConstantConfig.ts, ./BaseSkillData.ts, ./PassivitySkillUtils.ts, ./SkillBehavior.ts, ./SkillEnum.ts, ./MathUtils2.ts
(function(t) {
    var n, i, r, u, o, s, e, h, c, a, f, v, l;
    return cjn && LVn && (Whn = "las"), cjn = 0, function() {
        var d;
        return fjn && bVn && (Whn += C6t), fjn && LVn && (xhn += "addMove"), fjn && RVn && (Whn += "tFr"), 
        fjn = 0, (d = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A], i = t["createClass"];
        }, function(t) {
            r = t[M], u = t["v2"];
        }, function(t) {
            o = t[w];
        }, function(t) {
            s = t["TableManager"];
        }, function(t) {
            e = t["BattleUtils"];
        }, function(t) {
            h = t[w];
        }, function(t) {
            c = t["BaseSkillData"];
        }, function(t) {
            a = t["PassivitySkillUtils"];
        }, function(t) {
            f = t["SkillBehavior"];
        }, function(t) {
            v = t["PassivitySkillType"];
        }, function(t) {
            l = t["MathUtils"];
        } ], d[T] = function() {
            ajn && bVn && (xhn += SHn), ajn && RVn && (xhn += "Dis"), ajn && LVn && (Whn += "ame"), 
            ajn = 0, r[E][R]({}, Ghn, cJ, void 0), t(cJ, function(t) {
                var r, c;
                return 0, c = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)["_cfg"] = void 0, i["_owner"] = void 0, 
                    i["condition"] = 0, i["onceTrigger"] = !1, i["interval"] = 0, i["lastMovePos"] = void 0, 
                    i[""] = 0, i["addTime"] = 0, i[1] = 0, i["beginTime"] = 0, i["skillCompleteNum"] = 0, 
                    i["totalHurt"] = 0, i["missileNum"] = 0, i;
                }, n(c, t), (r = c[U])["init"] = function(n, i) {
                    t[U]["init"]["call"](this, n, i), this["cfg"] && (this["condition"] = this["cfg"]["condition"], 
                    this["resPreCd"](), this["resInterval"]());
                }, r["resInterval"] = function() {
                    this["interval"] = e["getFrameByTime"](this["cfg"]["interval"] || 0);
                }, r["initConfig"] = function() {
                    this["_cfg"] = s["getDataById"](table["battle"]["PassivitySkillConfig"], this["skillId"]), 
                    this["_cfg"] || o["Logger"]["fight"](Qhn + this["skillId"] + jhn);
                }, r["actionSkill"] = function() {
                    if (!this["onceTrigger"]) {
                        for (var t = [], n = this["behaviorsTiming"], i = 0; i < n["length"]; i++) {
                            var r, u;
                            u = n[i]["delay"] || 0, (r = f["createBehavior"](n[i]["behaviorId"], u, this)) && (r["index"] = 0, 
                            t[R](r));
                        }
                        return t;
                    }
                }, r["refreshCD"] = function() {
                    this["resCd"]();
                }, r["nextFrame"] = function() {
                    this["_isReadyToRemove"] || (this["index"]++, this["index"] >= this["maxIndex"] && (this["index"] = 0, 
                    this["triggerHandler"]()));
                }, r["triggerHandler"] = function() {
                    t[U]["triggerHandler"]["call"](this), 0 == this["interval"] ? (this["resInterval"](), 
                    this["condition"] == v["ConType_6"] && 0 == this["_cd"] && (a["checkPassSkillCon"](this["condition"], this["_owner"], this["_owner"]), 
                    this["resCd"]())) : this["interval"]--;
                }, r["setMoveDistance"] = function(t) {
                    this["lastMovePos"] || (this["lastMovePos"] = u(t["x"], t["y"])), this[""] += l[Y](this["lastMovePos"], t), 
                    this["lastMovePos"]["x"] = t["x"], this["lastMovePos"]["y"] = t["y"];
                }, r["executeMoveDistance"] = function(t) {
                    return this[""] >= t && !(this[""] = 0);
                }, r["setMoveTime"] = function(t) {
                    var n;
                    0 == t ? (this["addTime"] = 0, this[1] = 0, this["beginTime"] = 0) : (0 < this[1] && (n = e["getTimeByFrame"](t - this[1]), 
                    this["addTime"] += n = n < 0 ? 0 : n, this["beginTime"] += n), this[1] = t);
                }, r["executeMoveTime"] = function(t, n) {
                    return this["beginTime"] >= n && this["addTime"] >= t && !(this["addTime"] = 0);
                }, r["setSkillCompleteNum"] = function() {
                    for (var t = this["behaviorsTiming"], n = 0; n < t["length"]; n++) {
                        var i, r, u, o, e;
                        if (i = t[n]["behaviorId"], !(o = s["getDataById"](table["battle"]["BehaviorConfig"], i))) return void console["warn"](rcn + i);
                        if (u = null == (e = o["effectParam"]) ? void 0 : e["buffId"], !(r = s["getDataById"](table["battle"]["BuffGroupConfig"], u))) return void console["warn"](ucn + u);
                        for (var h = r["buff"], c = 0; h["length"] > c; c++) {
                            var a, f;
                            if (f = h[0], (null == (a = this["_owner"]) || null == (a = a["attr"]) ? void 0 : a["isActBuffId"]) == f) return void (this["_owner"]["attr"]["isActBuffId"] = null);
                        }
                    }
                    this["skillCompleteNum"]++;
                }, r["executeSkillCompleteNum"] = function(t) {
                    return this["skillCompleteNum"] >= t && !(this["skillCompleteNum"] = 0);
                }, r["setTotalHurt"] = function(t) {
                    this["totalHurt"] += t;
                }, r["executeTotalHurt"] = function(t) {
                    return this["totalHurt"] / this["owner"]["attr"]["maxHp"] * h["getRandBase"] >= t;
                }, r["setMissileNum"] = function(t) {
                    this["missileNum"] += t;
                }, r["executeMissileNum"] = function(t) {
                    return this["missileNum"] >= t && !(this["missileNum"] = 0);
                }, i(c, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = zt, t["get"] = function() {
                        return this["_cfg"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = _n, t["get"] = function() {
                        if (this["_cfg"]) return this["_cfg"]["name"];
                    }, t;
                }[Q](this)[H]() ]), c;
            }(c)), r[E][z]();
        }, d;
    }[Q](this)[H]();
});