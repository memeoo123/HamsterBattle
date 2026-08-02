// Module: chunks:///_virtual/FruitSkillRayUnit.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./FruitSkillUnit.ts
(function(t) {
    var n, i, r;
    return 0, function() {
        var u;
        return (u = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t["FruitSkillUnit"];
        } ], u[T] = function() {
            i[E][R]({}, xBt, KBt, void 0), t(KBt, function(t) {
                var i;
                return i = function() {
                    var n;
                    return n = arguments, t[H](this, n) || this;
                }, n(i, t), i[U]["onUpdate"] = function(n) {
                    var i, r;
                    t[U]["onUpdate"]["call"](this, n), this["_data"] && (i = this["_data"], (r = this["_world"]["getUnit"](this["_data"]["createId"])) ? this["setPosition"](r["x"] + i["triggerX"], r["y"] + i["triggerY"]) : this["remove"]());
                }, i;
            }(r)), i[E][z]();
        }, u;
    }[Q](this)[H]();
});