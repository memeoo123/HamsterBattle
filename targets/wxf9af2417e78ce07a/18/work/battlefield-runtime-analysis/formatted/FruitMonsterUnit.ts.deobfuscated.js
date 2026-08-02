// Module: chunks:///_virtual/FruitMonsterUnit.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./G.ts, ./PoolManager.ts, ./FruitUnitCreateData.ts, ./BezierPathMgr.ts, ./BezierPathPos.ts, ./FruitMonsterBodyUnit.ts, ./FruitMonsterPartUnit.ts, ./FruitUnit.ts
(function(t) {
    var n, i, r, u, o, s, e, h, c, a, f, v;
    return $Zn && bVn && (HMt += qan), $Zn = 0, function() {
        var l;
        return nXn && EVn && (HMt += AMn), nXn && LVn && (HMt += "odyIn"), nXn = 0, (l = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A], i = t["createClass"];
        }, function(t) {
            r = t[M];
        }, function(t) {
            u = t[w];
        }, function(t) {
            o = t["PoolManager"];
        }, function(t) {
            s = t["FruitMonsterPartCreateData"], e = t["FruitMonsterBodyCreateData"];
        }, function(t) {
            h = t["BezierPathMgr"];
        }, function(t) {
            c = t["BezierPathPos"];
        }, function(t) {
            a = t["FruitMonsterBodyUnit"];
        }, function(t) {
            f = t["FruitMonsterPartUnit"];
        }, function(t) {
            v = t["FruitUnit"];
        } ], l[T] = function() {
            tXn && LVn && (HMt += "dexs"), tXn = 0, r[E][R]({}, yMt, pMt, void 0), t(pMt, function(t) {
                var r, v;
                return v = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)["_cfg"] = void 0, i["_head"] = void 0, 
                    i["_bodys"] = void 0, i["_bodyMap"] = void 0, i["_paths"] = void 0, i["_isLoaded"] = !1, 
                    i["_bodyCreateIdx"] = void 0, i["_tempPathPos"] = void 0, i["_lastPathPos"] = void 0, 
                    i["_backLastIdx"] = void 0, i;
                }, n(v, t), (r = v[U])["initData"] = function(t) {
                    var n, i;
                    i = this, this["_cfg"] = t["cfg"], this["_head"] = o["getItem"](f), (n = o["getItem"](s))["modelId"] = t["cfg"]["headPath"], 
                    n[W] = this["_world"]["monsterLayer"], n["index"] = 0, this["_head"]["init"](this["_world"], n), 
                    this["addChild"](this["_head"]), this["_isLoaded"] = !1, this["_bodyCreateIdx"] = 0, 
                    this["_tempPathPos"] = new c, this["_bodys"] = [], this["_backLastIdx"] = -1, h["ins"]()["getPaths"](t["cfg"]["path"], (function(t) {
                        i["onLoadPathComplete"](t);
                    }));
                }, r["onLoadPathComplete"] = function(t) {
                    var n, i, r;
                    this["_isDestroy"] || (this["_isLoaded"] = !0, this["_paths"] = t, i = (n = this["_paths"][0])["lineLens"]["length"] - 1, 
                    this["_head"]["paths"] = this["_paths"], this["_head"]["nextOffset"] = this["_cfg"]["offset"], 
                    this["_head"]["setPathPos"](0, i, n["lineLens"][i]), r = this["_paths"][this["_paths"]["length"] - 1], 
                    this["_lastPathPos"] = new c, this["_lastPathPos"]["idx"] = this["_paths"]["length"] - 1, 
                    this["_lastPathPos"]["subIdx"] = r["lineLens"]["length"] - 1, this["_lastPathPos"]["subLen"] = r["lineLens"][this["_lastPathPos"]["subIdx"]]);
                }, r["onCreateBody"] = function() {
                    var t, n, i, r, s;
                    return this["_bodyCreateIdx"] < this["_cfg"]["bodys"]["length"] && (null, n = 0 == (t = this["_bodyCreateIdx"]) || this["_bodys"]["length"] <= 0 ? this["_head"] : this["_bodys"][this["_bodys"]["length"] - 1]["lastPart"], 
                    this["_tempPathPos"]["moveFromOther"](n["pathPos"], -this["_cfg"]["offset"], this["_paths"]), 
                    0 != this["_tempPathPos"]["idx"] || 0 != this["_tempPathPos"]["subIdx"] || 0 != this["_tempPathPos"]["subLen"]) && (i = o["getItem"](a), 
                    (r = u["TableManager"]["getDataById"](table["battleFruit"]["FruitMonsterBodyConfig"], this["_cfg"]["bodys"][t])) && ((s = o["getItem"](e))["index"] = t, 
                    s["cfg"] = r, s["hitAnimInterval"] = this["_cfg"]["hitAnimInterval"], s["deadResidualTime"] = this["_cfg"]["deadResidualTime"], 
                    i["paths"] = this["_paths"], i["nextOffset"] = this["_cfg"]["offset"], i["init"](this["_world"], s), 
                    i["setPathPos"](this["_tempPathPos"]["idx"], this["_tempPathPos"]["subIdx"], this["_tempPathPos"]["subLen"]), 
                    this["addChild"](i), this["_bodys"][R](i)), this["_bodyCreateIdx"]++, this["sortB"](), 
                    !0);
                }, r["sortB"] = function() {
                    for (var t = 0, n = this["_bodys"]["length"] - 1; 0 <= n; n--) for (var i = this["_bodys"][n]["partUnits"]["length"] - 1; 0 <= i; i--) this["_bodys"][n]["partUnits"][i]["setSiblingIndex"](t), 
                    t++;
                }, r["moveForward"] = function(t) {
                    if (this["_backLastIdx"] <= -1) {
                        this["_head"]["move"](t);
                        for (var n = 0; n < this["_bodys"]["length"]; n++) this["_bodys"][n]["move"](t);
                    } else for (var i = this["_backLastIdx"]; i < this["_bodys"]["length"]; i++) this["_bodys"][i]["move"](t);
                }, r["moveBack"] = function(t) {
                    if (r = null, n = null, u = 0, 0 < this["_backLastIdx"] && 1 < this["_bodys"]["length"]) {
                        var n, i, r, u;
                        i = Math["min"](this["_backLastIdx"] - 1, this["_bodys"]["length"] - d), r = this["_bodys"][i], 
                        n = this["_bodys"][i + 1], u = r["lastPart"]["pathPos"][Y](n["firstPart"]["pathPos"], this["_paths"]), 
                        r["lastPart"]["pathPos"]["isLessThen"](n["firstPart"]["pathPos"]) && (u *= -1), 
                        t + this["_cfg"]["offset"] >= u && (t = u - this["_cfg"]["offset"], this["_backLastIdx"]--, 
                        0 == i) && (this["_backLastIdx"] = -1);
                        for (var o = i; 0 <= o; o--) o >= this["_bodys"]["length"] - 1 ? this["_backLastIdx"]-- : this["_bodys"][o]["move"](-t);
                    } else n = this["_bodys"][0], u = this["_head"]["pathPos"][Y](n["firstPart"]["pathPos"], this["_paths"]), 
                    this["_head"]["pathPos"]["isLessThen"](n["firstPart"]["pathPos"]) && (u *= -1), 
                    t + this["_cfg"]["offset"] >= u && (t = u - this["_cfg"]["offset"], this["_backLastIdx"] = -1);
                    this["_head"]["move"](-t);
                }, r["onUpdate"] = function(t) {
                    var n, i;
                    0 == this["_isLoaded"] || this["isDead"] || (n = this["_cfg"]["speed"] * t / qi, 
                    this["moveForward"](n), 0 <= this["_backLastIdx"] && (i = this["_cfg"]["backSpeed"] * t / qi, 
                    this["moveBack"](i)), this["onCreateBody"](), this["isMoveEnd"] && (this["isDead"] = !0));
                }, r["onRemove"] = function() {
                    this["_head"] = null, this["_bodys"]["length"] = 0, t[U]["onRemove"]["call"](this);
                }, r["onRemoveChild"] = function(t) {
                    var n;
                    t instanceof a && -1 != (n = this["_bodys"]["indexOf"](t)) && (n < this["_bodys"]["length"] - 1 && (this["_backLastIdx"] = Math["max"](this["_backLastIdx"], n)), 
                    this["_bodys"]["splice"](n, 1));
                }, i(v, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = Hv, t["get"] = function() {
                        return this["_isLoaded"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = GMt, t["get"] = function() {
                        return this["_head"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = X0, t["get"] = function() {
                        return this["_bodys"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = FMt, t["get"] = function() {
                        return this["_head"]["pathPos"]["isEqual"](this["_lastPathPos"]);
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = VMt, t["get"] = function() {
                        return this["_bodyCreateIdx"] >= this["_cfg"]["bodys"]["length"] && this["_bodys"]["length"] <= 0;
                    }, t;
                }[Q](this)[H]() ]), v;
            }(v)), r[E][z]();
        }, l;
    }[Q](this)[H]();
});