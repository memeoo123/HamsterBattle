// Module: chunks:///_virtual/RocketBulletUnit.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./Bezier2Tween.ts, ./PhysicalBulletUnit.ts, ./BattleUnit.ts, ./BattleEnum.ts, ./MathUtils2.ts, ./BattleUtils.ts
(function(t) {
    var n, i, r, u, o, s, h, c, a;
    return r$n && RVn && (Amn += "targ"), r$n = 0, function() {
        var f;
        return o$n && EVn && (Amn += IQ), o$n && RVn && (Bmn += 120), o$n && LVn && (Amn += "etAngl"), 
        o$n = 0, (f = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A];
        }, function(t) {
            i = t[M], r = t["v2"];
        }, function(t) {
            u = t["Bezier2Tween"];
        }, function(t) {
            o = t["PhysicalBulletUnit"];
        }, function(t) {
            s = t["BattleUnit"];
        }, function(t) {
            h = t["DirctionType"];
        }, function(t) {
            c = t["MathUtils"];
        }, function(t) {
            a = t["BattleUtils"];
        } ], f[T] = function() {
            u$n && EVn && (Bmn += 1), u$n && RVn && (Bmn += 107), u$n && RVn && (Amn += "e"), 
            u$n = 0, i[E][R]({}, pmn, Imn, void 0), t(Imn, function(t) {
                var i, o;
                return o = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)["addSpeed"] = 0, i["step"] = 0, 
                    i["bezier2Tween"] = void 0, i["factor"] = 0, i["targetPos"] = void 0, i[""] = 0, 
                    i;
                }, n(o, t), (i = o[U])["initParam"] = function(t, n, i, o, e) {
                    this["atk"] = t, this["factor"] = 0, this["nowDis"] = 0, this["addSpeed"] = 0, this["step"] = 0, 
                    this["attrHeroId"] = o["attrHeroId"], this["bezier2Tween"] || (this["bezier2Tween"] = new u), 
                    this["targetPos"] = n, o instanceof s && o["dirction"] == h["Left"] ? (a = r(i["x"] - y7, i["y"]), 
                    this["bezier2Tween"]["setPoint"](a["x"], a["y"], a["x"] - Mmn, a["y"] + V_, a["x"] - rP, a["y"])) : (a = r(i["x"] + y7, i["y"]), 
                    this["bezier2Tween"]["setPoint"](a["x"], a["y"], a["x"] + Mmn, a["y"] + V_, a["x"] + rP, a["y"]));
                    var a, f = c["getRadians"](this["pos"]["x"], this["pos"]["y"], this["targetPos"]["x"], this["targetPos"]["y"]);
                    this[""] = c["radians2Angle"](f) + Dw, this["pos"]["set"](a["x"], a["y"]), this["_spineNode"]["setPosition"](a["x"], a["y"]), 
                    this["_spineNode"]["angle"] = Bmn, this["missileDis"] = this["_cfg"][Y], this["_maxTime"] = this["_cfg"]["timeLimit"] || Cd;
                }, i["update"] = function() {
                    var t, n, i, r, u;
                    i = a["frameDeltaMs"], this["_runTime"] += i, 0 == this["step"] ? (t = this["bezier2Tween"]["getPosByFactor"](this["factor"]), 
                    this["pos"]["set"](t["x"], t["y"]), this["_spineNode"]["setPosition"](this["pos"]["x"], this["pos"]["y"]), 
                    this["factor"] += this["moveSpeed"] / $m, u = c["getRadians"](this["pos"]["x"], this["pos"]["y"], this["targetPos"]["x"], this["targetPos"]["y"]), 
                    this[""] = c["radians2Angle"](u) + Dw, 0 < this[""] && this[""] < Uw && (this[""] += Bot), 
                    1 <= this["factor"] ? (this["step"] = 1, this["rotateToAngle"](this[""]), this["_moveVec"]["set"](this["moveSpeed"] * Math["cos"](u), this["moveSpeed"] * Math["sin"](u))) : .5 < this["factor"] && this["rotateToAngle"](this[""])) : (1 == this["step"] ? (this["addSpeed"] -= .04, 
                    this["addSpeed"] < -.2 && (this["step"] = d)) : this["addSpeed"] += .08, d < this["addSpeed"] && (this["addSpeed"] = d), 
                    r = this["_moveVec"]["x"] * i * this["addSpeed"], n = this["_moveVec"]["y"] * i * this["addSpeed"], 
                    this["nowDis"] += Math["abs"](r) + Math["abs"](n), this["pos"]["add2f"](r, n), this["_spineNode"]["setPosition"](this["pos"]["x"], this["pos"]["y"]), 
                    this["checkTrigger"]());
                }, i["rotateToAngle"] = function(t) {
                    var n, i;
                    i = (n = Math["abs"](t - this["_spineNode"]["angle"])) / e, 0 !== n && (n < i ? this["_spineNode"]["angle"] = t : t < this["_spineNode"]["angle"] ? this["_spineNode"]["angle"] -= i : this["_spineNode"]["angle"] += i);
                }, i["checkDis"] = function() {
                    this["nowDis"] >= this["missileDis"] && (this[J](null), this["_isActive"] = !1);
                }, o;
            }(o)), i[E][z]();
        }, f;
    }[Q](this)[H]();
});