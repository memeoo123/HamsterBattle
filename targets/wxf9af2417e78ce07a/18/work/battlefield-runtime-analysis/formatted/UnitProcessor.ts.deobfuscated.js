// Module: chunks:///_virtual/UnitProcessor.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./UnitFactory.ts, ./BattleEnum.ts, ./BattleConstantConfig.ts, ./BattleUnit.ts, ./GBattleIns.ts, ./UnitCollisionsManager.ts
(function(t) {
    var n, i, r, u, o, s, e, h, c, a;
    return N2n && EVn && (wGn += yR), N2n && RVn && (OGn = "notKill"), N2n && EVn && (OGn += mtt), 
    N2n && LVn && (HGn += "u"), N2n && RVn && (wGn += "B"), N2n = 0, function() {
        var f;
        return F2n && RVn && (HGn += "id"), F2n = 0, (f = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t["createClass"];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t[w];
        }, function(t) {
            u = t["UnitType"], o = t["WorldUnitTeam"], s = t["DirctionType"];
        }, function(t) {
            e = t[w];
        }, function(t) {
            h = t["BattleUnit"];
        }, function(t) {
            c = t[w];
        }, function(t) {
            a = t[w];
        } ], f[T] = function() {
            P2n && bVn && (HGn += un, OGn += QV), P2n && LVn && (OGn += "edResou"), P2n && RVn && (HGn += "Map"), 
            P2n = 0, i[E][R]({}, wGn, bGn, void 0), t(w, function() {
                var t, i;
                return G2n && RVn && (OGn += "rceIdxs"), G2n = 0, (t = (i = function() {
                    this["_homeMap"] = void 0, this["_teamMap"] = void 0, this["_heros"] = void 0, this["_monsters"] = void 0, 
                    this["_bullets"] = void 0, this["_leaderSkill"] = void 0, this["_"] = void 0, this["_resIdToUid"] = void 0, 
                    this["_unitTypeMap"] = void 0, this["_waitDisposeUnit"] = [], this["isDeadDirty"] = void 0, 
                    this["initContainer"](), e["init"]();
                })[U])["initContainer"] = function() {
                    this["_unitTypeMap"] = {}, this["_unitTypeMap"][u["Hero"]] = this["_heros"] = [], 
                    this["_unitTypeMap"][u["Monster"]] = this["_monsters"] = [], this["_unitTypeMap"][u["Bullet"]] = this["_bullets"] = [], 
                    this["_unitTypeMap"][u["LeaderSkill"]] = this["_leaderSkill"] = [], this["_"] = {}, 
                    this["_resIdToUid"] = {}, this["_homeMap"] = {}, this["_teamMap"] = {};
                }, t["resetContainer"] = function() {
                    for (var t in this["_unitTypeMap"]) this["_unitTypeMap"][t]["length"] = 0;
                    this["_"] = {}, this["_resIdToUid"] = {}, this["_homeMap"] = {}, this["_teamMap"] = {}, 
                    c["unitCollisionsMgr"]["reset"]();
                }, t["getUnitByUid"] = function(t) {
                    return this["_"][t];
                }, t["getBattleUnitByUid"] = function(t) {
                    if (this["_"][t] instanceof h) return this["_"][t];
                }, t["getTeamById"] = function(t) {
                    return this["_teamMap"][t];
                }, t["getHomeUnitByTeamId"] = function(t) {
                    return this["_homeMap"][t];
                }, t["disposeUnit"] = function(t) {
                    this["_waitDisposeUnit"][R](t);
                }, t["doDisposeUnits"] = function(t) {
                    if (void 0 === t && (t = !1), this["_waitDisposeUnit"]["length"]) for (var n = t ? V_ : l, i = this["_waitDisposeUnit"]["length"] - 1; 0 <= i && 0 != n--; i--) {
                        var r, o, s, e, h, c;
                        (r = this["_waitDisposeUnit"][z]())["isNeedDispose"] && ((o = r["resId"]) && this["_resIdToUid"][o] && delete this._resIdToUid[o], 
                        (h = r["uid"]) && this["_"][h] && delete this._uidMap[h], e = r["type"] == u["Boss"] ? u["Monster"] : r["type"], 
                        s = this["_unitTypeMap"][e]) && -1 != (c = s["indexOf"](r)) && (s["splice"](c, 1), 
                        r["dispose"]());
                    }
                }, t["createHome"] = function(t, n) {
                    void 0 === n && (n = -1), this["_homeMap"] && (this["_homeMap"][o["Self"]] && delete this._uidMap[this._homeMap[o.Self].uid], 
                    this["_homeMap"][o["Enemy"]]) && delete this._uidMap[this._homeMap[o.Enemy].uid], 
                    this["_homeMap"] = {}, this["_homeMap"][o["Self"]] = r["createHomeUnit"](o["Self"], t), 
                    this["_homeMap"][o["Enemy"]] = r["createHomeUnit"](o["Enemy"], n), this["_"][this["_homeMap"][o["Self"]]["uid"]] = this["_homeMap"][o["Self"]], 
                    this["_"][this["_homeMap"][o["Enemy"]]["uid"]] = this["_homeMap"][o["Enemy"]], a["ins"]()["setHomeMap"](this["_homeMap"]);
                }, t["loadTeam"] = function(t) {
                    this["_teamMap"][t] = c["UnitFactory"]["createTeamUnit"](), this["_teamMap"][t]["teamId"] = t;
                }, t["createHeroes"] = function(t) {
                    for (var n = 0; n < t["length"]; n++) {
                        var i;
                        (i = c["UnitFactory"]["createHeroUnit"](o["Self"], t[n]))["setPosXY"](t[n]["x"], t[n]["y"]), 
                        this["_heros"][R](i), this["_"][i["uid"]] = i;
                    }
                }, t["removeHero"] = function(t) {
                    var n, i;
                    (i = t["uid"]) && this["_"][i] && delete this._uidMap[i], -1 != (n = this["_heros"]["indexOf"](t)) && this["_heros"]["splice"](n, 1), 
                    t["dispose"]();
                }, t["createMonsterUnits"] = function(t) {
                    for (var n = 0; n < t["length"]; n++) for (var i = t[n], r = 0; r < i["idxs"]["length"]; r++) {
                        var u, o, s, e;
                        u = i["idxs"][r], o = i["resourceId"] + Sm + u, (s = this["_resIdToUid"][o]) && this["_"][s] ? this["_"][s]["resurgence"]() : (e = c["UnitFactory"]["createMonsterUnit"](i, u)) && (i[2] && -1 == i[2]["indexOf"](u) && (e["firstKill"] = !0), 
                        e["dropRewards"] = i["drops"], i["resourceId"] && (e["resId"] = o, this["_resIdToUid"][o] = e["uid"]), 
                        e["summon"] = i["summon"], this["_monsters"][R](e), this["_"][e["uid"]] = e);
                    }
                }, t["createEnemyUnitsByBattleData"] = function(t) {
                    for (var n = 0; n < t["length"]; n++) {
                        var i;
                        (i = c["UnitFactory"]["createUnitByBattleData"](o["Enemy"], t[n])) && (this["_monsters"][R](i), 
                        (this["_"][i["uid"]] = i)["setPosXY"](t[n]["x"], t[n]["y"]), i["setDirction"](s["Rigth"]));
                    }
                }, t["createLeaderUnits"] = function(t) {}, t["addBullet"] = function(t) {
                    this["_bullets"][R](t);
                }, t["getUnitsByTeamId"] = function(t) {
                    return t == o["Self"] ? this["heroes"] : this["monsters"];
                }, t["hasAlive"] = function(t) {
                    for (var n = this["getUnitsByTeamId"](t), i = n["length"] - 1; 0 <= i; i--) if (n[i]["attr"]["isAlive"]()) return !0;
                    return !1;
                }, t["setUnitHide"] = function(t, n) {
                    this["_"][t] instanceof h && (this["_"][t]["visible"] = !n);
                }, t["setHeroScale"] = function(t, n) {
                    this["_heros"]["forEach"]((function(i) {
                        i["heroId"] == t && i["node"] && (i["node"]["baseScale"] = n);
                    }));
                }, n(i, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = V6, t["get"] = function() {
                        return this["_teamMap"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = z2, t["get"] = function() {
                        return this["_teamMap"][o["Self"]];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = Z2, t["get"] = function() {
                        return this["_heros"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = X2, t["get"] = function() {
                        return this["_monsters"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = u3, t["get"] = function() {
                        return this["_bullets"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = K6, t["get"] = function() {
                        return this["_leaderSkill"];
                    }, t;
                }[Q](this)[H]() ]), i;
            }()), i[E][z]();
        }, f;
    }[Q](this)[H]();
});