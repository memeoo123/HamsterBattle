// Module: chunks:///_virtual/UnitFactory.ts
// Dependencies: cc, ./PoolManager.ts, ./MathUtils2.ts, ./BattleEnum.ts, ./BattleLayerManager.ts, ./SpriteFrameUnitNode.ts, ./ActorUnitNode.ts, ./BulletUnit.ts, ./AreaUnit.ts, ./TeamUnit.ts, ./MonsterFactory.ts, ./TableManager.ts, ./BattleConstantConfig.ts, ./BattleTimer.ts, ./GIns.ts, ./BagLilkePowerSkillManager.ts, ./UIBagLikeBuffConfig.ts, ./PreLoadMgr.ts, ./HomeUnit.ts, ./BombUnit.ts, ./BounceBullet.ts, ./DartUnit.ts, ./PhysicalBulletUnit.ts, ./RayUnit.ts, ./RocketBulletUnit.ts, ./StretchBounceBullet.ts, ./ThrowBulletUnit.ts, ./HeroFactory.ts
(function(t) {
    var n, i, r, o, s, h, c, f, l, m, k, _, S, g, y, p, I, A, B, b, L, D, U, N, P, F, G, V, O, x, K;
    return L2n && LVn && (_Gn = ""), L2n && bVn && (_Gn += VW), L2n && LVn && (IGn += "ateAreaUni"), 
    L2n && RVn && (CGn += "ien"), L2n = 0, function() {
        var W;
        return U2n && EVn && (fGn += RFt, IGn += OA), U2n && LVn && (IGn += "t"), U2n && RVn && (CGn += "t"), 
        U2n = 0, (W = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[M], i = t["Vec2"], r = t["TiledMap"];
        }, function(t) {
            o = t["PoolManager"];
        }, function(t) {
            s = t["MathUtils"];
        }, function(t) {
            h = t["WorldUnitTeam"], c = t["UnitType"], f = t["BulletType"];
        }, function(t) {
            l = t["BattleLayerManager"];
        }, function(t) {
            m = t["SpriteFrameUnitNode"];
        }, function(t) {
            k = t["ActorUnitNode"];
        }, function(t) {
            _ = t["BulletUnit"];
        }, function(t) {
            S = t["AreaUnit"];
        }, function(t) {
            g = t["TeamUnit"];
        }, function(t) {
            y = t["MonsterFactory"];
        }, function(t) {
            p = t["TableManager"];
        }, null, function(t) {
            I = t[w];
        }, function(t) {
            A = t[w];
        }, function(t) {
            B = t["BagLikePowerSkillManager"];
        }, function(t) {
            b = t["BagLikeBuffSpecialWordType"];
        }, function(t) {
            L = t["PreLoadMgr"];
        }, function(t) {
            D = t["HomeUnit"];
        }, function(t) {
            U = t["BombUnit"];
        }, function(t) {
            N = t["BounceBullet"];
        }, function(t) {
            P = t["DartUnit"];
        }, function(t) {
            F = t["PhysicalBulletUnit"];
        }, function(t) {
            G = t["RayUnit"];
        }, function(t) {
            V = t["RocketBulletUnit"];
        }, function(t) {
            O = t["StretchBounceBullet"];
        }, function(t) {
            x = t["ThrowBulletUnit"];
        }, function(t) {
            K = t["HeroFactory"];
        } ], W[T] = function() {
            H2n && EVn && (fGn += BM, _Gn += QTn, CGn += RM), H2n && RVn && (_Gn += "und"), 
            H2n && RVn && (CGn += "ation"), H2n = 0, n[E][R]({}, oGn, Ma, void 0), t(w, function() {
                var t;
                return D2n && RVn && (fGn = "创建单位成功但是没有配置. 导致单位创建失败. not found table.monster.MonsterAttributeConfig. configId="), 
                D2n && LVn && (_Gn += "er"), D2n = 0, (t = function() {})["createAnimNode"] = function(t) {
                    return p["getDataById"](table["model"]["ModelConfig"], t)["spriteFrame"] ? o["getItem"](m) : o["getItem"](k);
                }, t["createHomeUnit"] = function(t, n) {
                    var i;
                    return ((i = o["getItem"](D))["teamId"] = t) == h["Self"] ? i["setPosXY"](-MB, 0) : i["setPosXY"](MB, 0), 
                    i["init"](n), i;
                }, t["createTeamUnit"] = function() {
                    var t;
                    return (t = o["getItem"](g))["setPosXY"](0, 0), t;
                }, t["createHeroUnit"] = function(t, n) {
                    var i, r, u, o, s, e;
                    if (u = p["getDataById"](table["hero"]["HeroConfig"], n["configId"]), e = K["create"](n["configId"]), 
                    (s = this["createAnimNode"](n["modelId"]))["loadByModelId"](n["modelId"]), e["teamId"] = t, 
                    o = null == (i = A["bagLikeBuffMgr"]["specialWordActiveMap"][b["BIGGER_SIZES"]]) ? void 0 : i["rangeMap"]) for (var h in o) h == u["id"] && (s["baseScale"] = i["scale"] || 1);
                    return l["ins"]()["roleLayer"]["addChild"](s), e["setSpineNode"](s), e["init"](u, n), 
                    L["ins"]()["loadHeroEffect"](n["configId"]), (r = B["ins"]()["skillVo"]) && r["addBuffEff"](e, !0), 
                    e;
                }, t["createRandomCoordinate"] = function(t, n, r, u) {
                    var o, e, h;
                    return o = Math["random"]() * n - .5 * n, h = Math["random"]() * r - .5 * r, e = -s["angle2Radians"](u), 
                    new i(o * Math["cos"](e) - h * Math["sin"](e) + t["x"], o * Math["sin"](e) + h * Math["cos"](e) + t["y"]);
                }, t["createUnitByBattleData"] = function(t, n) {
                    if (n["type"] == c["Hero"]) return this["createHeroUnit"](t, n);
                    if (n["type"] == c["Monster"]) {
                        var i, r, u, o, s;
                        if (i = function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn({}, Ra, 0), La, 0))["x"] = 0, t["y"] = 0, t;
                            }[H]())["x"] = Ck, t["y"] = Ck, t;
                        }[H](), o = n["configId"], s = p["getDataById"](table["monster"]["MonsterAttributeConfig"], o)) return u = y["create"](o), 
                        (r = this["createAnimNode"](s["modelId"]))["loadByModelId"](n["modelId"]), u["teamId"] = t, 
                        n["uid"] && (u["uid"] = n["uid"]), u["pos"]["set"](i["x"] + d * (Math["random"]() - .5), i["y"] + d * (Math["random"]() - .5)), 
                        r["setPosition"](u["pos"]["x"], u["pos"]["y"]), l["ins"]()["roleLayer"]["addChild"](r), 
                        u["setSpineNode"](r), u["init"](s, n), u;
                        console["error"](fGn + o + vGn + t + lGn, n);
                    }
                }, t["createMonsterUnit"] = function(t, n) {
                    var i, r, u;
                    if (r = (r = p["getDataById"](table["monster"]["MonsterAttributeConfig"], t["monsterId"])) || p["getDataById"](table["monster"]["MonsterAttributeConfig"], 1)) return i = y["create"](t["monsterId"]), 
                    (u = this["createAnimNode"](r["modelId"]))["loadByModelId"](r["modelId"]), i["teamId"] = h["Enemy"], 
                    i["resourceId"] = t["resourceId"], i["resourceIdx"] = n, i["pos"]["set"](t["pos"]["x"] + d * (Math["random"]() - .5), t["pos"]["y"] + d * (Math["random"]() - .5)), 
                    u["setPosition"](i["pos"]["x"], i["pos"]["y"]), l["ins"]()["roleLayer"]["addChild"](u), 
                    i["setSpineNode"](u), i["init"](r), i;
                }, t["createTowerSkillUnit"] = function(t) {}, t["createBulletUnit"] = function(t, n, i, r) {
                    var u, s;
                    if (void 0 === i && (i = 0), s = p["getDataById"](table["battle"]["MissileConfig"], t)) {
                        var e, h, c, a;
                        switch (a = 0 == s["notLoop"] || null == s["notLoop"], s["type"]) {
                          case f["SmartBullet"]:
                            break;

                          case f["PhysicalBullet"]:
                            h = o["getItem"](F);
                            break;

                          case f["Bomb"]:
                            h = o["getItem"](U), a = !1;
                            break;

                          case f["Throw"]:
                            h = o["getItem"](x);
                            break;

                          case f["Bounce"]:
                            h = o["getItem"](N);
                            break;

                          case f["StretchBounceBullet"]:
                            h = o["getItem"](O);
                            break;

                          case f["Rocket"]:
                            h = o["getItem"](V);
                            break;

                          case f["Ray"]:
                            h = o["getItem"](G), a = !1;
                            break;

                          case f["Dart"]:
                            h = o["getItem"](P);
                            break;

                          default:
                            f["NormalBullet"], h = o["getItem"](_);
                        }
                        if (h) return h["teamId"] = n, h["targetTeamId"] = i, c = s["modelId"]["toString"](), 
                        r && (c = A["heroSkinModel"]["getReplaceModelId"](c, r)), (e = this["createAnimNode"](c))["loadByModelId"](c, a), 
                        e["timeScale"] = I["speed"], h["setSpineNode"](e), h["init"](s), (null != s && null != (u = s["parameter"]) && u[7] ? l["ins"]()["bgLayer"] : l["ins"]()["effectSecondTopLayer"])["addChild"](e), 
                        h;
                    }
                }, t["createOrthoAreaUnit"] = function(t, n) {
                    var i;
                    if (null == (i = t["points"]) || !i["length"]) return null;
                    for (var r = o["getItem"](S), u = [], s = t["x"], e = t["y"], h = 0; h < t["points"]["length"]; h++) {
                        var c, a, f;
                        a = t["points"][h], c = s + a["x"], f = e + a["y"], u[R](function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn({}, Ra, 0), La, 0))["x"] = 0, t["y"] = 0, t;
                            }[H]())["x"] = c, t["y"] = f, t;
                        }[H]());
                    }
                    return r["init"](u, t), r;
                }, t["createIsoAreaUnit"] = function(t, n) {
                    var i;
                    if (null == (i = t["points"]) || !i["length"]) return null;
                    for (var r = o["getItem"](S), u = n["tileSize"]["width"], s = n["tileSize"]["height"], e = .5 * u, h = .5 * s, c = n["mapSize"]["height"], a = n["mapSize"]["width"] + c, f = [], v = t["offset"]["x"], l = t["offset"]["y"], d = 0; d < t["points"]["length"]; d++) {
                        var m, k, _;
                        _ = t["points"][d], k = (v + _["x"]) / s, m = (l - _["y"]) / s, f[R](function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn({}, Ra, 0), La, 0))["x"] = 0, t["y"] = 0, t;
                            }[H]())["x"] = e * (c + k - m), t["y"] = h * (a - k - m), t;
                        }[H]());
                    }
                    return r["init"](f, t), r;
                }, t["cre"] = function(t, n) {
                    return n["type"] == r["Or"]["ISO"] ? this["createIsoAreaUnit"](t, n) : this["createOrthoAreaUnit"](t, n);
                }, t["createSkillCfgs"] = function(t) {
                    for (var n = [], i = 0; i < e; i++) {
                        var r;
                        (r = p["getDataById"](table["battle"]["SkillConfig"], t[sY + i])) && n[R](r);
                    }
                    return n;
                }, t["getDebugSkillByHeroIdSkill"] = function(t, n) {
                    0;
                    for (var i = p["getDataById"](table["hero"]["HeroConfig"], t), r = function() {
                        var t = function() {
                            var t = HVn(HVn(HVn(HVn(HVn({}, MGn, 0), Awn, 0), d, 0), u, 0), a, 0);
                            return t[0] = 0, t[1] = 0, t[d] = 0, t[u] = 0, t[a] = 0, t;
                        }[H]();
                        return t[0] = 1, t[1] = 1, t[d] = 1, t[u] = 1, t[a] = 1, t;
                    }[H](), o = 0; o < n["length"]; o++) r[o] = n[o];
                    for (var s, h = [], c = 0; c < e; c++) r[c] && (s = i[sY + c], h[R](s += r[c] <= v ? mU + r[c] : r[c]));
                    return h;
                }, t;
            }()), n[E][z]();
        }, W;
    }[Q](this)[H]();
});