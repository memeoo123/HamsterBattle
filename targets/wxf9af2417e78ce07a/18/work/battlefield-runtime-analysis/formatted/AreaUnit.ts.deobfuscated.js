// Module: chunks:///_virtual/AreaUnit.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./BattleLayerManager.ts, ./MathUtils2.ts
(function(t) {
    var n, i, r, u, o, s, e, h;
    return XOn && EVn && (zm += Dht), XOn && LVn && (zm += "debugGr"), XOn = 0, function() {
        var c;
        return qOn && bVn && (zm += XAt), qOn && RVn && (zm += "a"), qOn && RVn && (zm += "phice"), 
        qOn = 0, (c = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t["createClass"];
        }, function(t) {
            i = t[M], r = t["Node"], u = t["Graphics"], o = t["Color"], s = t["Rect"];
        }, function(t) {
            e = t["BattleLayerManager"];
        }, function(t) {
            h = t["MathUtils"];
        } ], c[T] = function() {
            0, i[E][R]({}, Fm, Gm, void 0), t(Gm, function() {
                var t, i;
                return 0, (t = (i = function() {
                    this["_rect"] = new s, this["_points"] = void 0, this["_unlockId"] = void 0, this["_areaId"] = void 0, 
                    this["_mapObject"] = void 0;
                })[U])["init"] = function(t, n) {
                    this["_unlockId"] = n["unlock_id"] || 0, this["_areaId"] = n["area_id"] || 0, this["_mapObject"] = n, 
                    this["_points"] = [];
                    for (var i = Zm, r = Zm, u = -Zm, o = -Zm, s = 0, e = t["length"]; s < e; s++) {
                        var h, c, a;
                        c = t[s], a = c["x"], h = c["y"], this["_points"][R](function() {
                            var t;
                            return (t = function() {
                                var t;
                                return (t = HVn(HVn({}, Ra, 0), La, 0))["x"] = 0, t["y"] = 0, t;
                            }[H]())["x"] = a, t["y"] = h, t;
                        }[H]()), u < a && (u = a), a < i && (i = a), o < h && (o = h), h < r && (r = h);
                    }
                    this["_rect"]["set"](i, r, u - i, o - r);
                }, t["isInside"] = function(t) {
                    var n;
                    return !(null == (n = this["_points"]) || !n["length"]) && h["pointInPolygon"](t, this["_points"], this["_points"]["length"]);
                }, t[""] = function() {
                    var t, n;
                    t = (n = new r)["addComponent"](u), this["node"] = n, t["lineWidth"] = $m, t["color"] = o["BLUE"], 
                    t["clear"]();
                    for (var i = this["_points"]["length"], s = 0; s < i; s++) {
                        var h, c;
                        h = this["_points"][s], c = this["_points"][(s + 1) % i], t["moveTo"](h["x"], h["y"]), 
                        t["lineTo"](c["x"], c["y"]), console["log"](h["x"] + ok + h["y"]), t["stroke"]();
                    }
                    t["fill"](), e["ins"]()["floatLayer"]["addChild"](n);
                }, n(i, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = ck, t["get"] = function() {
                        return this["_mapObject"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = ak, t["get"] = function() {
                        return this["_unlockId"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = fk, t["get"] = function() {
                        return !this["_unlockId"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = vk, t["get"] = function() {
                        return this["_areaId"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = lk, t["get"] = function() {
                        return this["_rect"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = dk, t["get"] = function() {
                        return this["_points"];
                    }, t;
                }[Q](this)[H]() ]), i;
            }()), i[E][z]();
        }, c;
    }[Q](this)[H]();
});