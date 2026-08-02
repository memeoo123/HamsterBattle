// Module: chunks:///_virtual/BattleManager.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./BaseSingleton.ts, ./BaseAutoFight.ts, ./BattleEnum.ts, ./DamageVo.ts, ./AttrEnum.ts, ./BattleConstantConfig.ts, ./BattleUtils.ts, ./FightTimeLoop.ts, ./BaseLeaderSkillUnit.ts, ./LeaderSkillData.ts, ./FightSkillInfo.ts, ./PoolManager.ts, ./GBattleIns.ts, ./FightType.ts, ./TrunkInstanceAutoHandler.ts, ./TableManager.ts, ./HeroEnums.ts, ./BattleInstanceController.ts
(function(t) {
    var n, i, r, o, s, h, c, a, f, v, l, m, k, _, S, g, y, p, I, B, b, L, D, N;
    return NWn && EVn && (Z5 += cl, X5 += xJt), NWn && RVn && (S5 = 8244533), NWn && EVn && (S5 += 4), 
    NWn && RVn && (v5 += "n", Q5 += 77921, $5 += "eLeaderSk"), NWn && LVn && (Z5 += "ed"), 
    NWn = 0, function() {
        var P;
        return FWn && EVn && (v5 += J6, Z5 += wGn, $5 += Yq), FWn && bVn && (X5 += u7t, 
        Q5 += 1), FWn && LVn && (S5 += 46001290), FWn && LVn && (v5 += "itSee", Q5 += 21239), 
        FWn && RVn && ($5 += "ill"), FWn && RVn && (X5 += "om"), FWn = 0, (P = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A], i = t["createClass"];
        }, function(t) {
            r = t[M], o = t["Vec2"], s = t["view"];
        }, function(t) {
            h = t[w];
        }, function(t) {
            c = t["BaseAutoFight"];
        }, function(t) {
            a = t["HurtNumType"], f = t["WorldUnitTeam"];
        }, function(t) {
            v = t["DamageVo"];
        }, function(t) {
            l = t["AttrEnum"];
        }, function(t) {
            m = t[w];
        }, function(t) {
            k = t["BattleUtils"];
        }, function(t) {
            _ = t["FightTimeLoop"];
        }, function(t) {
            S = t["BaseLeaderSkillUnit"];
        }, function(t) {
            g = t["LeaderSkillData"];
        }, function(t) {
            y = t["FightSkillInfo"];
        }, function(t) {
            p = t["PoolManager"];
        }, function(t) {
            I = t[w];
        }, function(t) {
            B = t["FightType"];
        }, function(t) {
            b = t["TrunkInstanceAutoHandler"];
        }, function(t) {
            L = t["TableManager"];
        }, function(t) {
            D = t["HeroType"];
        }, function(t) {
            N = t["BattleInstanceController"];
        } ], P[T] = function() {
            PWn && bVn && (S5 += 8), PWn && LVn && (S5 += 45754176), PWn && LVn && (v5 += "d"), 
            PWn && RVn && (Q5 += 76333), PWn = 0, r[E][R]({}, $4, zy, void 0), t(zy, function(t) {
                var r, h;
                return h = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)["_isAutoFight"] = !0, 
                    i["_mainScene"] = void 0, i["otherTimeCheck"] = [], i["leaderSkillList"] = [], i["isEndFight"] = !1, 
                    i["isStopFightAi"] = !1, i["battleConfigId"] = 1, i["frameIndex"] = 0, i["monsterHateInfinite"] = !0, 
                    i["canSkill"] = !0, i["bottomDistance"] = void 0, i["isLockCamera"] = !1, i["seed"] = e, 
                    i["i"] = e, i["autoHandlerMap"] = {}, i;
                }, n(h, t), (r = h[U])["onInit"] = function() {}, r["initLeaderSkill"] = function(t, n, i) {
                    t && (this["leaderSkillList"] = []);
                    for (var r = 0; r < n["length"]; r++) {
                        var u;
                        (u = new g)["teamId"] = i, u["fightSkillInfo"] = new y, u["init"](null, n[r]), u["cfg"] && this["leaderSkillList"][R](u);
                    }
                }, r["lockCamera"] = function(t) {
                    this["isLockCamera"] = t;
                }, r["createTimeCheck"] = function(t, n, i, r) {
                    var u;
                    return void 0 === i && (i = 1), void 0 === r && (r = !1), (u = new _)["trigger"] = k["getFrameByTime"](t), 
                    u["maxTime"] = u["trigger"] * (i = -1 == i ? S5 : i), u["endCallback"] = n, r && n["run"](), 
                    this["addTimeCheck"](u), u;
                }, r["addTimeCheck"] = function(t) {
                    this["otherTimeCheck"][R](t);
                }, r["removeTimeCheck"] = function(t) {}, r["clear"] = function() {
                    this["frameIndex"] = 0, this["otherTimeCheck"]["length"] = 0, I["buffMgr"]["clear"]();
                }, r["getLeaderSkillById"] = function(t) {
                    for (var n = 0; n < this["leaderSkillList"]["length"]; n++) if (this["leaderSkillList"][n]["cfg"]["id"] + "" == t) return this["leaderSkillList"][n];
                    return null;
                }, r["stopFightAi"] = function() {
                    this["isStopFightAi"] = !0;
                    for (var t = this["_mainScene"]["getHeroes"](), n = 0; n < t["length"]; n++) t[n]["stopAction"]();
                    var i = this["_mainScene"]["getMonsters"]();
                    for (n = 0; n < i["length"]; n++) i[n]["stopAction"]();
                }, r["openFightAi"] = function() {
                    this["isStopFightAi"] = !1, this["startFight"]();
                }, r["endFight"] = function() {
                    this["isEndFight"] = !0;
                    for (var t = this["_mainScene"]["getHeroes"](), n = 0; n < t["length"]; n++) t[n]["endFight"]();
                    var i = this["_mainScene"]["getMonsters"]();
                    for (n = 0; n < i["length"]; n++) i[n]["endFight"]();
                    this["clear"]();
                }, r["startFight"] = function() {
                    this["isEndFight"] = !1;
                    for (var t = this["_mainScene"]["getHeroes"](), n = 0; n < t["length"]; n++) t[n]["startFight"]();
                    var i = this["_mainScene"]["getMonsters"]();
                    for (n = 0; n < i["length"]; n++) i[n]["startFight"]();
                }, r["doFrameHandler"] = function() {
                    this["frameIndex"]++;
                    for (var t = 0; t < this["leaderSkillList"]["length"]; t++) this["leaderSkillList"][t]["isReadyToRemove"] || this["leaderSkillList"][t]["nextFrame"]();
                    for (t = 0; t < this["otherTimeCheck"]["length"]; t++) this["otherTimeCheck"][t]["isReadyToRemove"] ? (this["otherTimeCheck"]["splice"](t, 1), 
                    t--) : this["otherTimeCheck"][t]["nextFrame"]();
                }, r["enterFight"] = function(t) {
                    for (var n = this["mainScene"]["getUnitByTeam"](t), i = 0; i < n["length"]; i++) n[i][G] && !n[i]["isBeginToFight"] && n[i]["enterFight"](!1);
                }, r["isNoEnemyInSearchRange"] = function() {
                    for (var t = this["_mainScene"]["getHeroes"](), n = 0; n < t["length"]; n++) if (t[n][G] && I["unitCollisionsMgr"]["getNearestEnemyUnit"](t[n], t[n]["searchRange"])) return !1;
                    return !0;
                }, r["getDrop"] = function(t, n) {}, r[q] = function(t) {
                    var n, i, r, o, s, e, h, c, k, _, y, C, T, A;
                    t[F]["attr"]["isInvincible"]() || (!(0 < (null == (n = t[x]) ? void 0 : n["casterUid"])) || t["skillInfo"] instanceof g || t["status"] == m["SpecialHurt"] || t["status"] == m["CounterAttack"] || t[Z] || I["buffMgr"]["checkCounterAttack"](t["originalCaster"], t[F], t["notDefValue"]), 
                    i = t[x], r = I["StateMemory"]["getBatteUintByUid"](null == i ? void 0 : i["casterUid"]), 
                    t["status"] != m["Kill"] && (r || i["attrHeroId"]) && (e = i["attrHeroId"] || (null == r || null == (o = r["attr"]) ? void 0 : o["getHeroConfigId"]()) || null, 
                    h = L["getDataById"](table["hero"]["HeroConfig"], e)) && (h["type"] == D["HAMSTER"] ? s = t[F]["getAttrValue"](l["HERO_DMG_RES"]) : h["type"] == D["WHEEL"] && (s = t[F]["getAttrValue"](l["TOWER_DMG_RES"])), 
                    0 < s) && (t["status"] = m["DmgRes"]), t["value"] = Math["floor"](t["value"] * (1 + I["buffMgr"]["getAddHurtByType"](t[F], t["hurtType"]))), 
                    k = I["buffMgr"]["updateShieldHp"](t[F], t["value"]), t["value"] = k, t["ignoreNotSelect"] || t[F]["canBeHurt"]() ? (t[F][q](t, t[x]["casterUid"]), 
                    0 < (null == (c = t[x]) ? void 0 : c["casterUid"]) && t["status"] != m["SpecialHurt"] && t["status"] != m["CounterAttack"] && t["originalCaster"] && !(t["originalCaster"] instanceof S) && (_ = t["originalCaster"]["getAttrValue"](l["LIFE_STEAL"])) && (y = Math["floor"](t["value"] * _ / m["getRandBase"]), 
                    (C = p["getItem"](v))[x] = t["originalCaster"], C[F] = t["originalCaster"], C["status"] = m["Heal"], 
                    C["value"] = y, I[X]["heal"](C))) : t["value"] = 0, t["value"] <= 0) || (T = 1, 
                    (A = t["value"] / t[F]["attr"]["maxHp"]) >= m["crit3TextValue"] ? T = u : A >= m["crit2TextValue"] && (T = d), 
                    t["status"] == m["Normal"] || t["status"] == m["LeaderSkillHurt"] || t["status"] == m["Block"] || t["status"] == m["Miss"] || t["status"] == m["SpecialHurt"] || t["status"] == m["CounterAttack"] ? I["BattleShowFactory"]["createNum"](a["Hurt"], t["value"], t[F]["hurtPoint"], .3 * t[F]["hurtNumHight"], t[F]["teamId"] == f["Enemy"], T) : t["status"] == m["Crit"] ? I["BattleShowFactory"]["createNum"](a["CirtHurt"], t["value"], t[F]["hurtPoint"], .6 * t[F]["hurtNumHight"], T) : (t["status"] = m["DmgRes"]) && I["BattleShowFactory"]["createNum"](a["Dmg_Res"], t["value"], t[F]["hurtPoint"], .3 * t[F]["hurtNumHight"], t[F]["teamId"] == f["Enemy"], T));
                }, r["heal"] = function(t) {
                    t[F]["heal"](t), I["BattleShowFactory"]["createNum"](a["Heal"], t["value"], t[F]["pos"], t[F]["hurtNumHight"]);
                }, r["healHome"] = function(t) {
                    var n, i, r;
                    (n = N["ins"]()["getHomeUnit"]()) && (r = new v, i = n["attr"]["maxHp"], r["value"] = Math["floor"](i * t / sC), 
                    (r[F] = n)["heal"](r), I["BattleShowFactory"]["createNum"](a["Heal"], r["value"], r[F]["pos"], r[F]["hurtNumHight"]));
                }, r["setRandomSeed"] = function(t) {
                    this["i"] = t;
                }, r["resRandomSe"] = function() {
                    this["seed"] = this["i"];
                }, r["seedRand"] = function() {
                    return this["seed"] = (q5 * this["seed"] + z5) % Q5, this["seed"] / Q5;
                }, r["randomInt"] = function(t, n, i) {
                    (n = void 0 === n ? 0 : n) < t && (r = t, t = n, n = r);
                    var r, u = n - t + +(i = void 0 === i ? 1 : i), o = this["seedRand"]() * u;
                    return o += t, Math["floor"](o / i) * i;
                }, r["randomBoolean"] = function() {
                    return 1 == this["randomInt"](1, d);
                }, r["isRandTrue"] = function(t) {
                    return this["randomInt"](0, sC) <= t;
                }, r["us"] = function(t) {
                    this["_mainScene"]["createLeaderUnits"](t);
                }, r["createMonster"] = function(t, n, i, r, u) {
                    var s;
                    void 0 === r && (r = 1), void 0 === u && (u = !1), (s = {})["monsterId"] = t, s["pos"] = new o(n, i), 
                    s["idxs"] = [], s["summon"] = u;
                    for (var e = 0; e < r; e++) s["idxs"][R](r);
                    this["_mainScene"]["createMonsterUnits"]([ s ]);
                }, r["enterScene"] = function() {
                    B["TRUNK_INSTANCE"] == this["mainScene"]["playingMethod"] ? this["autoHandlerMap"][this["mainScene"]["playingMethod"]] || (this["autoHandlerMap"][this["mainScene"]["playingMethod"]] = new b) : this["autoHandlerMap"][this["mainScene"]["playingMethod"]] || (this["autoHandlerMap"][this["mainScene"]["playingMethod"]] = new c), 
                    this["autoHandlerMap"][this["mainScene"]["playingMethod"]]["setData"]();
                }, r["updateAutoHandler"] = function() {
                    !this["isAutoFight"] || this["isStopFightAi"] || this["autoHandlerMap"][this["mainScene"]["playingMethod"]] && this["autoHandlerMap"][this["mainScene"]["playingMethod"]]["autoHandler"]();
                }, r["setBottomDistance"] = function(t) {
                    this["bottomDistance"] = t;
                }, r["getBottonDistance"] = function() {
                    return this["bottomDistance"];
                }, r["getMiddleX"] = function() {
                    return s["getDesignResolutionSize"]()["width"] / d;
                }, i(h, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = 0, t["get"] = 0, t["set"] = 0, 
                        t;
                    }[H]())["key"] = Ak, t["get"] = function() {
                        return this["_mainScene"];
                    }, t["set"] = function(t) {
                        this["_mainScene"] = t, this["canSkill"] = !0, this["monsterHateInfinite"] = !1;
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = 0, t["get"] = 0, t["set"] = 0, 
                        t;
                    }[H]())["key"] = u6, t["get"] = function() {
                        return this["_isAutoFight"];
                    }, t["set"] = function(t) {
                        var n;
                        (this["_isAutoFight"] = t) || null == (n = this["autoHandlerMap"][this["mainScene"]["playingMethod"]]) || n["stop"]();
                    }, t;
                }[Q](this)[H]() ]), h;
            }(h)), r[E][z]();
        }, P;
    }[Q](this)[H]();
});