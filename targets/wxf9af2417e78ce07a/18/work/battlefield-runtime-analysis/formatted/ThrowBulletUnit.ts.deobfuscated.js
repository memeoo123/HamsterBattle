// Module: chunks:///_virtual/ThrowBulletUnit.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./Bezier2Tween.ts, ./BulletUnit.ts, ./UnitSearchUtils.ts, ./BattleUnit.ts, ./MathUtils2.ts, ./BattleUtils.ts
(function(t) {
    var n, i, r, u, o, s, e, h;
    return c1n && EVn && (QEn += $p), c1n && LVn && ($En = "i"), c1n && bVn && ($En += vft), 
    c1n && RVn && (QEn += "9Iw"), c1n && LVn && (QEn += "YJYJaAgomB5"), c1n = 0, function() {
        var c;
        return f1n && bVn && ($En += _d), f1n && RVn && ($En += "sA"), f1n = 0, (c = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t["Bezier2Tween"];
        }, function(t) {
            u = t["BulletUnit"];
        }, function(t) {
            o = t[w];
        }, function(t) {
            s = t["BattleUnit"];
        }, function(t) {
            e = t["MathUtils"];
        }, function(t) {
            h = t["BattleUtils"];
        } ], c[T] = function() {
            a1n && LVn && ($En += "ngle"), a1n = 0, i[E][R]({}, QEn, jEn, void 0), t(jEn, function(t) {
                var i, u;
                return u = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)["factor"] = 0, i["bezier2Tween"] = void 0, 
                    i[8] = !0, i;
                }, n(u, t), (i = u[U])["initParam"] = function(t, n, i, u, o) {
                    var s;
                    this["atk"] = t, this["factor"] = 0, this["bezier2Tween"] || (this["bezier2Tween"] = new r), 
                    this["attrHeroId"] = u["attrHeroId"], this[F] = o, this["bezier2Tween"]["setPoint"](i["x"], i["y"], i["x"] + (n["x"] - i["x"]) / d, Math["max"](i["y"], n["y"]) + this["_cfg"][Y], this[F]["pos"]["x"], this[F]["pos"]["y"]), 
                    (s = this["_cfg"]["parameter"]) && 0 == s[8] && (this[8] = !1), this["pos"]["set"](i["x"], i["y"]), 
                    this["_spineNode"]["setPosition"](i["x"], i["y"]), this["_maxTime"] = sC;
                }, i["update"] = function() {
                    var t, n, i, r, u;
                    n = h["frameDeltaMs"], this["_runTime"] += n, this["factor"] < 1 && (t = this["pos"]["x"], 
                    r = this["pos"]["y"], u = this["bezier2Tween"]["getPosByFactor"](this["factor"]), 
                    this["pos"]["set"](u["x"], u["y"]), i = e["getAngle"](t, r, u["x"], u["y"]), this[8] && (this["_spineNode"]["angle"] = i + Dw), 
                    this["_spineNode"]["setPosition"](this["pos"]["x"], this["pos"]["y"]), this["factor"] += this["moveSpeed"] / af), 
                    this["checkTrigger"]();
                }, i["checkTrigger"] = function() {
                    if (1 < this["factor"]) if (this["_isActive"] = !1, this[F] instanceof s) {
                        var t;
                        if (null != (t = o["getUnitsByCircle"](this, this["targetTeamId"], nh)) && t["length"]) {
                            for (var n, i = kan, r = 0; r < t["length"]; r++) {
                                var u, h;
                                u = t[r], h = e[Y](u["pos"], this["pos"]), u["attr"]["size"] + $m >= h && h < i && (n = u, 
                                i = h);
                            }
                            if (n) return this["targetUid"] = n["uid"], void this["action"]();
                        }
                    } else this["action"]();
                    this["_runTime"] >= this["_maxTime"] && (this["_isActive"] = !1);
                }, u;
            }(u)), i[E][z]();
        }, c;
    }[Q](this)[H]();
});