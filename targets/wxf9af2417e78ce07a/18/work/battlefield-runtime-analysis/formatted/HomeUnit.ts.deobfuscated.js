// Module: chunks:///_virtual/HomeUnit.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./FacadeManager.ts, ./NotificationKey.ts, ./BattleAttr.ts, ./BattleEnum.ts, ./BattleUnit.ts
(function(t) {
    var n, i, r, u, o, s, e, h, c;
    return 0, function() {
        var a;
        return 0, (a = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A], i = t["createClass"];
        }, function(t) {
            r = t[M];
        }, function(t) {
            u = t[w];
        }, function(t) {
            o = t[w];
        }, function(t) {
            s = t["BattleAttr"];
        }, function(t) {
            e = t["WorldUnitTeam"], h = t["UnitType"];
        }, function(t) {
            c = t["BattleUnit"];
        } ], a[T] = function() {
            0, r[E][R]({}, mjt, kjt, void 0), t(kjt, function(t) {
                var r, c;
                return c = function() {
                    var n;
                    return (n = t["call"](this) || this)["_type"] = h["Home"], n["_percent"] = 1, n;
                }, n(c, t), (r = c[U])["init"] = function(t) {
                    this["_attr"] = s["create"](this), this["_attr"]["initByHome"](t), this["updateHpPercent"](), 
                    this["updateHpBarPos"]();
                }, r["setPosXY"] = function(n, i) {
                    t[U]["setPosXY"]["call"](this, n, i), this["updateHpBarPos"]();
                }, r["addMaxHp"] = function(t) {
                    this["_attr"]["addMaxHp"](t, !1);
                }, r["updateHpBarPos"] = function() {
                    this["_hpBar"]["setPosition"](this["pos"]["x"] + (this["teamId"] === e["Self"] ? -af : af), this["pos"]["y"]);
                }, r["updateHpBar"] = function() {
                    this["_hpBar"]["hpPercentage"] = this["_attr"]["hpPercentage"], u["ins"]()["emit"](o["BATTLE_HOME_HP_CHANGED"], function() {
                        var t;
                        return (t = function() {
                            var t;
                            return (t = HVn(HVn(HVn({}, PF, 0), FF, 0), GF, 0))["teamId"] = 0, t["maxHp"] = 0, 
                            t["curHp"] = 0, t;
                        }[H]())["teamId"] = this["teamId"], t["maxHp"] = this["attr"]["maxHp"], t["curHp"] = Math["ceil"](this["attr"]["hp"]), 
                        t;
                    }[Q](this)[H]());
                }, r[q] = function(t, n) {
                    this["_attr"][q](t["value"]), this["updateHpPercent"](), this["updateHpBar"]();
                }, r["heal"] = function(t) {
                    this["_attr"]["heal"](t["value"]), this["updateHpPercent"](), this["updateHpBar"]();
                }, r["updateHpPercent"] = function() {
                    this["_percent"] = this["_attr"]["hp"] / this["_attr"]["maxHp"];
                }, r["canSelect"] = function() {
                    return 0 < this["_attr"]["hp"] && t[U]["canSelect"]["call"](this);
                }, i(c, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = uv, t["get"] = function() {
                        return V_;
                    }, t;
                }[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = jv, t["get"] = function() {
                        return function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = function() {
                                    var t;
                                    return (t = HVn(HVn({}, Ra, 0), La, 0))["x"] = 0, t["y"] = 0, t;
                                }[H]())["x"] = 0, t["y"] = 0, t;
                            }[H]())["x"] = this["pos"]["x"], t["y"] = this["pos"]["y"] + V_, t;
                        }[Q](this)[H]();
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), di, 0))["key"] = 0, t["set"] = 0, t;
                    }[H]())["key"] = pR, t["set"] = function(t) {
                        this["_attr"]["hp"] != t && (this["_attr"]["hp"] = t, this["updateHpPercent"](), 
                        this["updateHpBar"]());
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), di, 0))["key"] = 0, t["set"] = 0, t;
                    }[H]())["key"] = FF, t["set"] = function(t) {
                        this["_attr"]["maxHp"] - this["_attr"]["normalMaxHp"] != t && (0 < this["_attr"]["maxHp"] && (this["_attr"]["hp"] = Math["floor"]((t + this["_attr"]["normalMaxHp"]) * this["_percent"])), 
                        this["_attr"]["maxHp"] = t, this["updateHpBar"]());
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = GZ, t["get"] = function() {
                        return this["_attr"]["isDeath"]();
                    }, t;
                }[Q](this)[H]() ]), c;
            }(c)), r[E][z]();
        }, a;
    }[Q](this)[H]();
});