// Module: chunks:///_virtual/TrunkInstanceAutoHandler.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./BattleManager.ts, ./BaseAutoFight.ts
(function(t) {
    var n, i, r, u;
    return 0, function() {
        var o;
        return (o = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t["BattleManager"];
        }, function(t) {
            u = t["BaseAutoFight"];
        } ], o[T] = function() {
            i[E][R]({}, $Ln, j4, void 0), t(j4, function(t) {
                var i, u;
                return u = function() {
                    var n;
                    return n = arguments, t[H](this, n) || this;
                }, n(u, t), (i = u[U])["setData"] = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    (i = t[U]["setData"])["call"][H](i, [ this ]["concat"](u));
                }, i["autoHandler"] = function() {
                    for (var t = r["ins"]()["mainScene"], n = t["getHeroes"](), i = 0; i < n["length"]; i++) n[i];
                    t["getMonsters"]();
                }, u;
            }(u)), i[E][z]();
        }, o;
    }[Q](this)[H]();
});