// Module: chunks:///_virtual/BaseUnit.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./BattleEnum.ts, ./GBattleIns.ts
(function(t) {
    var n, i, r, u, o;
    return 0, function() {
        var s;
        return 0, (s = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t["createClass"];
        }, function(t) {
            i = t[M], r = t["v2"];
        }, function(t) {
            u = t["UnitType"];
        }, function(t) {
            o = t[w];
        } ], s[T] = function() {
            0, i[E][R]({}, NY, Xc, void 0), t(Xc, function() {
                var t, i;
                return (t = (i = function() {
                    this["_type"] = u["Unknow"], this["_uid"] = void 0, this["resId"] = void 0, this["_dirty"] = void 0, 
                    this["_pos"] = r(), this["_width"] = void 0, this["_height"] = void 0, this["_needDispose"] = !1, 
                    this["_uid"] = o["StateMemory"]["createUid"]();
                })[U])["init"] = function() {}, t["setPosXY"] = function(t, n) {
                    this["_pos"]["set"](t, n);
                }, t["update"] = function() {
                    this["_dirty"] = !1;
                }, t["resurgence"] = function() {
                    this["_needDispose"] = !1;
                }, t["onRecovery"] = function() {
                    this["_uid"] = null;
                }, t["needDispose"] = function() {
                    var t;
                    this["_needDispose"] || (this["_needDispose"] = !0, null == (t = o["StateMemory"]["curUnitProcessor"])) || t["disposeUnit"](this);
                }, t["removeUnit"] = function() {
                    this["needDispose"]();
                }, t["canSelect"] = function() {
                    return !0;
                }, t["dispose"] = function() {}, n(i, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = Bd, t["get"] = function() {
                        return this["_type"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = 0, t["get"] = 0, t["set"] = 0, 
                        t;
                    }[H]())["key"] = QY, t["get"] = function() {
                        return this["_uid"];
                    }, t["set"] = function(t) {
                        this["_uid"] = t;
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = Ea, t["get"] = function() {
                        return this["_pos"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = Xf, t["get"] = function() {
                        return this["_width"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = v_, t["get"] = function() {
                        return this["_height"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = nf, t["get"] = function() {
                        return this["_dirty"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = G, t["get"] = function() {
                        return !0;
                    }, t;
                }[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = jY, t["get"] = function() {
                        return this["_needDispose"];
                    }, t;
                }[Q](this)[H]() ]), i;
            }()), i[E][z]();
        }, s;
    }[Q](this)[H]();
});