// Module: chunks:///_virtual/SkillData.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./TableManager.ts, ./BattleUtils.ts, ./SkillBehavior.ts, ./SkillEnum.ts, ./BaseSkillData.ts, ./G.ts, ./PassivitySkillUtils.ts
(function(t) {
    var n, i, r, u, o, s, e, h, c, a, f, v, l, d;
    return P0n && bVn && (wAn += pbt), P0n && LVn && (PAn = "anim"), P0n && EVn && (PAn += nst), 
    P0n && RVn && (wAn += "ionEffect"), P0n = 0, function() {
        var m;
        return G0n && EVn && (wAn += Q6), G0n && LVn && (PAn += "BackN"), G0n && RVn && (wAn += "Data"), 
        G0n = 0, (m = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A], i = t["createClass"];
        }, function(t) {
            r = t[M], u = t["Vec2"];
        }, function(t) {
            o = t["TableManager"];
        }, function(t) {
            s = t["BattleUtils"];
        }, function(t) {
            e = t["SkillBehavior"];
        }, function(t) {
            h = t["PassivitySkillFlag"], c = t["SkillType"], a = t["AbnormalType"], f = t["PassivitySkillType"];
        }, function(t) {
            v = t["BaseSkillData"];
        }, function(t) {
            l = t[w];
        }, function(t) {
            d = t["PassivitySkillUtils"];
        } ], m[T] = function() {
            F0n && EVn && (PAn += wmt), F0n && LVn && (PAn += "ame"), F0n = 0, r[E][R]({}, TAn, Dst, void 0), 
            t(Dst, function(t) {
                var r, v;
                return v = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)["_cfg"] = void 0, i["atkPoint"] = void 0, 
                    i["atkPointBack"] = void 0, i["isImmuneControl"] = !1, i["isCdCheck"] = !1, i;
                }, n(v, t), (r = v[U])["init"] = function(n, i) {
                    t[U]["init"]["call"](this, n, i), this["_cfg"] && (this["_cfg"]["atkPoint"] && (this["atkPoint"] = new u(+this["_cfg"]["atkPoint"]["x"], +this["_cfg"]["atkPoint"]["y"]), 
                    null != this["_cfg"]["atkPoint"]["bx"] && null != this["_cfg"]["atkPoint"]["by"] ? this["atkPointBack"] = new u(+this["_cfg"]["atkPoint"]["bx"], +this["_cfg"]["atkPoint"]["by"]) : this["atkPointBack"] = this["atkPoint"]), 
                    this["resPreCd"]());
                }, r["initConfig"] = function() {
                    this["_cfg"] = o["getDataById"](table["battle"]["SkillConfig"], this["skillId"]), 
                    this["_cfg"] || l["Logger"]["fight"](BAn + this["skillId"] + jhn);
                }, r["nextFrame"] = function() {
                    this["isCdCheck"] = !1, this["index"]++, this["index"] >= this["maxIndex"] && (this["index"] = 0, 
                    this["triggerHandler"]());
                }, r["getActionEffectData"] = function() {
                    return o["getDataById"](table["battle"]["SkillEffectConfig"], this["cfg"]["anim"]) || o["getDataById"](table["battle"]["SkillEffectConfig"], 1);
                }, r["getBackAct"] = function() {
                    return this["cfg"]["anim2"] ? o["getDataById"](table["battle"]["SkillEffectConfig"], this["cfg"]["anim2"]) : null;
                }, r["actionSkill"] = function() {
                    this["isBeginBehavior"] = !1, this["fightSkillInfo"]["beginSkillHandler"](), this["isImmuneControl"] = !1, 
                    this["owner"]["attr"]["getPassiveSkillFlag"](h["PSkill_ImmuneControl"]) && this["cfg"]["type"] == c["Guiding_Skills"] && (this["owner"]["setAbnormalStatus"](a["ImmuneControl"]), 
                    this["isImmuneControl"] = !0);
                    for (var t = [], n = this["behaviorsTiming"], i = 0; i < n["length"]; i++) {
                        var r, u;
                        r = n[i]["delay"] || 0, 0 == this["skillIndex"] && (r = Math["ceil"](r / this["owner"]["atkTimeScale"])), 
                        (u = e["createBehavior"](n[i]["behaviorId"], r, this)) && (u["index"] = i, t[R](u));
                    }
                    return t;
                }, r["skillCompleteHandler"] = function() {
                    this["isImmuneControl"] && (this["owner"]["clearAbnormalStatus"](a["ImmuneControl"]), 
                    this["isImmuneControl"] = !1), this["fightSkillInfo"]["skillCompleteHandler"](), 
                    this["isBeginBehavior"] && (d["checkPassSkillCon"](f["ConType_9"], this["owner"], this["owner"], this), 
                    d["updatePassSkillFunction"](this["owner"], f["ConType_23"], icn), d["checkPassSkillCon"](f["ConType_23"], this["owner"], this["owner"], this)), 
                    this["isBeginBehavior"] = !1;
                }, r["updateMaxPreCd"] = function(t) {
                    this["_maxPreCD"] = -1 == t ? s["getFrameByTime"](this["_cfg"]["precd"] || 0) : s["getFrameByTime"](t), 
                    this["_preCD"] > this["_maxPreCD"] && this["setPreCd"](this["_maxPreCD"]);
                }, r["updatePreCd"] = function(t) {
                    this["_preCD"] -= s["getFrameByTime"](t), this["_preCD"] > this["_maxPreCD"] ? this["setPreCd"](this["_maxPreCD"]) : this["_preCD"] < 0 && (this["_preCD"] = 0);
                }, r["updateMaxCd"] = function(t) {
                    this["_maxCd"] = -1 == t ? s["getFrameByTime"](this["_cfg"]["cd"] || 0) : s["getFrameByTime"](t), 
                    this["_cd"] > this["_maxCd"] && (this["_cd"] = this["_maxCd"]);
                }, r["updateCd"] = function(t) {
                    this["_cd"] -= s["getFrameByTime"](t), this["_cd"] > this["_maxCd"] ? this["_cd"] = this["_maxCd"] : this["_cd"] < 0 && (this["_cd"] = 0);
                }, r["refreshCD"] = function() {
                    this["isCdCheck"] || (this["isCdCheck"] = !0, this["resCd"]());
                }, i(v, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = $W, t["get"] = function() {
                        return this["_owner"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = _n, t["get"] = function() {
                        if (this["_cfg"]) return this["_cfg"]["name"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = UAn, t["get"] = function() {
                        return this["_cfg"]["targetType"];
                    }, t;
                }[Q](this)[H](), function() {
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
                    }[H]())["key"] = Bd, t["get"] = function() {
                        return this["cfg"]["type"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = ob, t["get"] = function() {
                        return this["cfg"]["subType"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = NAn, t["get"] = function() {
                        return this["getActionEffectData"]()["anim"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = PAn, t["get"] = function() {
                        return this["getBackAct"]()["anim"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = XX, t["get"] = function() {
                        return this["_cfg"]["castingRange"] || af;
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = B9, t["get"] = function() {
                        return s["getFrameByTime"](this["cfg"]["castTime"] || 0);
                    }, t;
                }[Q](this)[H]() ]), v;
            }(v)), r[E][z]();
        }, m;
    }[Q](this)[H]();
});