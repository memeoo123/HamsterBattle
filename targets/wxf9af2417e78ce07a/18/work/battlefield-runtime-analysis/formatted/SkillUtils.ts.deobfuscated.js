// Module: chunks:///_virtual/SkillUtils.ts
// Dependencies: cc, ./ArrayUtils.ts, ./MathUtils2.ts, ./SortUtils.ts, ./UnitSearchUtils.ts, ./BattleConstantConfig.ts, ./GBattleIns.ts, ./BattleUnit.ts, ./PointTarget.ts, ./SkillEnum.ts
(function(t) {
    var n, i, r, u, o, s, e, h, c, a, f, v, l, k;
    return x0n && RVn && (gwn += "at"), x0n = 0, function() {
        var _;
        return W0n && EVn && (gwn += Ja), W0n && LVn && (gwn += "kAng"), W0n = 0, (_ = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[M], i = t["Vec2"];
        }, function(t) {
            r = t[w];
        }, function(t) {
            u = t["MathUtils"];
        }, function(t) {
            o = t["SortUtils"];
        }, function(t) {
            s = t[w];
        }, function(t) {
            e = t[w];
        }, function(t) {
            h = t[w];
        }, function(t) {
            c = t["BattleUnit"];
        }, function(t) {
            a = t["PointTarget"];
        }, function(t) {
            f = t["TargetFaction"], v = t["SearchType"], l = t["SkillTargetType"], k = t["BehaviorRangeType"];
        } ], _[T] = function() {
            K0n && LVn && (gwn += "le"), K0n = 0, n[E][R]({}, ewn, _J, void 0), t(_J, function() {
                var t;
                return 0, (t = function() {})["getTeamIdByFaction"] = function(t, n) {
                    switch (n) {
                      case f["EnemySide"]:
                        return this["enemyTeamMap"][t];

                      case f["OurSide"]:
                        return t;

                      default:
                        return f["Both"], this["enemyTeamMap"][t];
                    }
                }, t["searchTarget"] = function(t, n) {
                    var i;
                    switch (i = n["searchRange"], t["searchType"]) {
                      case v["MainTarget"]:
                        return n["selectMainTarget"] || s["getNearestBattleUnit"](n, this["getTeamIdByFaction"](n["teamId"], t["cfg"]["targetFaction"]), i);

                      case v["Now"]:
                        return n;

                      case v["Random"]:
                        var r = this["getTeamIdByFaction"](n["teamId"], t["cfg"]["targetFaction"]), u = s["getUnitsByCircle"](n, r, i);
                        return 0 == u["length"] ? null : u[h[X]["randomInt"](0, u["length"] - 1)];

                      case v["Nearset"]:
                      case v["NearsetPoint"]:
                        var o, e = s["getNearestBattleUnit"](n, this["getTeamIdByFaction"](n["teamId"], t["cfg"]["targetFaction"]), i);
                        return t["searchType"] == v["NearsetPoint"] && e ? ((o = new a)["setPoint"](e["pos"]["x"], e["pos"]["y"]), 
                        o["teamId"] = e["teamId"], o) : e;

                      case v["Farthest"]:
                        return s["getFarthestBattleUnit"](n, this["getTeamIdByFaction"](n["teamId"], t["cfg"]["targetFaction"]), i);

                      case v["Hp_Most"]:
                        return s["getMostHpUnit"](n, this["getTeamIdByFaction"](n["teamId"], t["cfg"]["targetFaction"]), i);

                      case v["Hp_Lowest"]:
                        return s["getLowestHpUnit"](n, this["getTeamIdByFaction"](n["teamId"], t["cfg"]["targetFaction"]), i);

                      case v["Atk_Most"]:
                        return s["getMostAtkUnit"](n, this["getTeamIdByFaction"](n["teamId"], t["cfg"]["targetFaction"]), i);

                      case v["MOST_DENSE"]:
                        var c, f = this["getTeamIdByFaction"](n["teamId"], t["cfg"]["targetFaction"]), l = s["getUnitsByCircle"](n, f, i);
                        return 0 == l["length"] ? null : s["getMostDenseTarget"](l, (null == (c = t["cfg"]["targetParam"]) ? void 0 : c["radius"]) || cf);

                      case v["MOST_DENSE_AREA"]:
                        var d, m, k, _ = this["getTeamIdByFaction"](n["teamId"], t["cfg"]["targetFaction"]), S = s["getUnitsByCircle"](n, _, i);
                        return 0 == S["length"] ? null : (m = s["getMostDenseArea"](S, (null == (d = t["cfg"]["targetParam"]) ? void 0 : d["radius"]) || cf), 
                        (k = new a)["setPoint"](m["x"], m["y"]), k);

                      case v["ENEMY_HOME"]:
                        return n["selectMainTarget"] || this["searchEnemyHome"](n);
                    }
                    return null;
                }, t["skillTarget"] = function(t, n, i, r, u, o, e) {
                    switch (void 0 === u && (u = 0), 0 == (o = void 0 === o ? 1 : o) && (o = Syt), t) {
                      case l["SEARCH_TARGET"]:
                        return r ? [ r ] : null;

                      case l["SELF"]:
                        return i instanceof c ? [ i ] : null;

                      case l["ENEMY_HOME"]:
                        return [ this["searchEnemyHome"](i) ];

                      default:
                        var h = this["getTeamIdByFaction"](i["teamId"], n), a = s["getUnitsByCircle"](i, h, u);
                        return 0 == a["length"] ? null : this["behaviorFilterTargertsByTargetType"](i, a, t, e, o);
                    }
                }, t["behaviorFilterTargertsByTargetType"] = function(t, n, u, s, h, c) {
                    var a;
                    if (void 0 === h && (h = 1), null == n || !n["length"]) return null;
                    switch (u) {
                      case l["SEARCH_TARGET"]:
                        a = n[m](0, h);
                        break;

                      case l["Random"]:
                        a = r["randomAry"](n)[m](0, h);
                        break;

                      case l["SELF"]:
                        a = [ t ];
                        break;

                      case l["Nearset"]:
                      case l["Farthest"]:
                        for (var f = 0; f < n["length"]; f++) {
                            var v;
                            v = i[Y](n[f]["pos"], t["pos"]), n[f]["findLatelyEntity_dis"] = v;
                        }
                        a = (n = u == l["Nearset"] ? o["sortBy2"](n, [ "findLatelyEntity_dis" ], [ !0 ], !1) : o["sortBy2"](n, [ "findLatelyEntity_dis" ], [ !1 ], !1))[m](0, h);
                        break;

                      case l["LOWEST_HP"]:
                        if (r["confound"](n), n = o["sortBy2"](n, [ "hpPercentage" ], [ !0 ], !1), s && null != s["rate"]) {
                            var d, k, _;
                            d = 0, k = s["rate"], _ = 0, s["max"] && (_ = Math["ceil"](s["max"] / e["getRandBase"] * t["atk"]));
                            for (var S = 0; S < n["length"]; S++) n[S]["attr"]["hpPercentage"] <= k && (0 == _ || n[S]["attr"]["hp"] <= _) && d < h && d++;
                            a = n[m](0, d);
                        }
                        a = a || n[m](0, h);
                        break;

                      case l["Atk_Most"]:
                        a = (n = o["sortBy2"](n, [ "atk" ], [ !1 ], !1))[m](0, h);
                        break;

                      case l["ENEMY_HOME"]:
                        a = [ this["searchEnemyHome"](t) ];
                        break;

                      case l["ENEMY_ALL"]:
                        n && (a = n[m](0, h));
                    }
                    return a;
                }, t["behaviorRangeTargerts"] = function(n, r, o, e) {
                    var a, f, v, l, d, m, _, S, g, y, p;
                    switch (v = n["cfg"], m = this["getTeamIdByFaction"](r["teamId"], v["targetFaction"]), 
                    f = r["pos"], _ = o ? o["hurtPoint"] : null, v["rangeType"]) {
                      case k["SELF_HOME"]:
                        return [ this["searchHome"](r) ];

                      case k["SELF"]:
                        return r instanceof c ? [ r ] : (p = h["StateMemory"]["getBatteUintByUid"](r["casterUid"])) ? [ p ] : null;

                      case k["SELF_RECTANGLE_ANGEL"]:
                        return o ? (a = +v["rangeParam"][""], s["getUnitsByRect2Param"](r["pos"], m, a, v["rangeParam"])) : null;

                      case k["SELF_RECTANGLE"]:
                        var I, C, T = r["offAngle"] || 0, A = r["realH"] || v["rangeParam"]["height"];
                        return o ? (_ = o["pos"], C = u["angle"](f, _), s["getUnitsByRectParam"](r["pos"], m, C + T, function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn({}, Xf, 0), v_, 0))["width"] = 0, t["height"] = 0, t;
                            }[H]())["width"] = v["rangeParam"]["width"], t["height"] = A, t;
                        }[H]())) : pv == UVn(I = +v["rangeParam"][""]) ? s["getUnitsByRectParam"](new i(r["atkPoint"]["x"], r["atkPoint"]["y"]), m, I + T, function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn({}, Xf, 0), v_, 0))["width"] = 0, t["height"] = 0, t;
                            }[H]())["width"] = v["rangeParam"]["width"], t["height"] = A, t;
                        }[H]()) : null;

                      case k["SELF_TRAGET_RECTANGLE_POINT"]:
                        return o ? (g = u["angle"](f, _), s["getUnitsByRectParam"](r["pos"], m, g, function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn({}, Xf, 0), v_, 0))["width"] = 0, t["height"] = 0, t;
                            }[H]())["width"] = v["rangeParam"]["width"], t["height"] = u[Y](f, _) + Ttt, t;
                        }[H]())) : null;

                      case k["TRAGET_RECTANGLE"]:
                        return o ? (S = u["angle"](f, _), s["getUnitsByRectParam"](o["pos"], m, S, v["rangeParam"])) : null;

                      case k["SELF_CIRCLE"]:
                        var M, B, w, b, E = s["getUnitsByCircleParam"](r["pos"], m, v["rangeParam"]);
                        return e && (E = E || [], w = (B = t["searchEnemyHome"](r))["pos"], b = r["pos"], 
                        (null == (M = v["rangeParam"]) ? void 0 : M["radius"]) > u["getDistance"](w["x"], w["y"], b["x"], b["y"])) && E[R](B), 
                        E;

                      case k["TARGET_CIRCLE"]:
                        return o ? s["getUnitsByCircleParam"](o["pos"], m, v["rangeParam"]) : null;

                      case k["SELF_ARC"]:
                        return o ? (d = u["angle"](f, _), s["getUnitsByArcParam"](r["pos"], m, d, v["rangeParam"])) : pv == UVn(y = +v["rangeParam"][""]) ? s["getUnitsByArcParam"](new i(r["atkPoint"]["x"], r["atkPoint"]["y"]), m, y, v["rangeParam"]) : null;

                      case k["TRAGET_ARC"]:
                        return o ? (l = u["angle"](f, _), s["getUnitsByArcParam"](o["pos"], m, l, v["rangeParam"])) : null;

                      case k["TRAGET_POINT"]:
                        return [ o ];

                      default:
                        return k["SKILL_TARGET"], o && o["unit"] ? [ o["unit"] ] : null;
                    }
                }, t["searchEnemyHome"] = function(t) {
                    return h["unitCollisionsMgr"]["getEnemyHomeUnit"](t);
                }, t["searchHome"] = function(t) {
                    return h["unitCollisionsMgr"]["getHomeUnit"](t);
                }, t;
            }())["enemyTeamMap"] = function() {
                var t;
                return (t = function() {
                    var t;
                    return (t = HVn(HVn({}, Awn, 0), d, 0))[1] = 0, t[d] = 0, t;
                }[H]())[1] = d, t[d] = 1, t;
            }[H](), n[E][z]();
        }, _;
    }[Q](this)[H]();
});