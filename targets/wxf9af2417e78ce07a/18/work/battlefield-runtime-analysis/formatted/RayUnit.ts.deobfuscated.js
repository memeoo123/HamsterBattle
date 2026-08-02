// Module: chunks:///_virtual/RayUnit.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./PoolManager.ts, ./BulletUnit.ts, ./BattleManager.ts, ./SkillBehavior.ts, ./BattleTimer.ts, ./BattleUtils.ts
(function(t) {
    var n, i, r, u, o, s, e, h;
    return 0, function() {
        var c;
        return 0, (c = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t["PoolManager"];
        }, function(t) {
            u = t["BulletUnit"];
        }, function(t) {
            o = t["BattleManager"];
        }, function(t) {
            s = t["SkillBehavior"];
        }, function(t) {
            e = t[w];
        }, function(t) {
            h = t["BattleUtils"];
        } ], c[T] = function() {
            0, i[E][R]({}, Qfn, jfn, void 0), t(jfn, function(t) {
                var i, u;
                return u = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)["_startAngle"] = void 0, 
                    i["_startoffAngle"] = void 0, i["_allAngle"] = void 0, i["_realHeight"] = void 0, 
                    i;
                }, n(u, t), (i = u[U])["initParam"] = function(t, n, i, r, u) {
                    var s, h, c;
                    this["atk"] = t, this["attrHeroId"] = r["attrHeroId"], this["realH"] = 0, this["pos"]["set"](i["x"], i["y"]), 
                    this["_spineNode"]["setPosition"](i["x"], i["y"]), this["_spineNode"]["scaleY"](), 
                    this["_allAngle"] = 0, this["offAngle"] = 0, this["_maxTime"] = this["_cfg"]["timeLimit"] || Cd, 
                    (s = this["_cfg"]["parameter"])["offAngle"] && this["setOffAngle"](s["offAngle"]), 
                    s["originalW"] ? (c = o["ins"]()["getBottonDistance"]() - ivn, h = (this["realH"] = c) / s["originalW"], 
                    this["_spineNode"]["scaleY"](h)) : this["_spineNode"]["scaleY"](), this["_spineNode"]["timeScale"] = Hp / this["_maxTime"] * e["speed"];
                }, i["createBehavior"] = function() {
                    this["_behaviors"] = [];
                    for (var t = this["_cfg"]["behaviors"], n = this["_cfg"]["delays"], i = 0; i < t["length"]; i++) {
                        var r, u;
                        r = t[i], (u = s["createBehavior"](r, (null == n ? void 0 : n[i]) || 0, this["skill"])) && this["_behaviors"][R](u);
                    }
                }, i["setOffAngle"] = function(t) {
                    this["_startAngle"] = this["_spineNode"]["angle"] + t / d, this["_spineNode"]["angle"] = this["_startAngle"], 
                    this["offAngle"] = t / d, this["_startoffAngle"] = t / d, this["_allAngle"] = t;
                }, i["checkTrigger"] = function() {
                    this["action"]();
                }, i["action"] = function() {
                    this["actionBehavior"]();
                }, i["update"] = function() {
                    var t;
                    t = h["frameDeltaMs"], this["_runTime"] + t > this["_maxTime"] && (t = this["_maxTime"] - this["_runTime"]), 
                    this["_maxTime"] <= this["_runTime"] && (this["_isActive"] = !1), this["_runTime"] += t, 
                    this["checkTrigger"](), this["updateAngle"]();
                }, i["updateAngle"] = function() {
                    var t;
                    this["offAngle"] && (t = this["_allAngle"] * this["_runTime"] / this["_maxTime"], 
                    this["_spineNode"]["angle"] = this["_startAngle"] - t, this["offAngle"] = this["_startoffAngle"] - t);
                }, i["onRecovery"] = function() {}, i["dispose"] = function() {
                    var t;
                    null != (t = this["_spineNode"]) && t["isValid"] && this["_spineNode"]["delayDestroy"](Cd), 
                    r["recovery"](this);
                }, u;
            }(u)), i[E][z]();
        }, c;
    }[Q](this)[H]();
});