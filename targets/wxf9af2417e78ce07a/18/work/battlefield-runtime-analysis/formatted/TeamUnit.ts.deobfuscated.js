// Module: chunks:///_virtual/TeamUnit.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./BaseUnit.ts, ./BattleEnum.ts
(function(t) {
    var n, i, r, u;
    return 0, function() {
        var o;
        return (o = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t["BaseUnit"];
        }, function(t) {
            u = t["UnitType"];
        } ], o[T] = function() {
            i[E][R]({}, MEn, BEn, void 0), t(BEn, function(t) {
                var i;
                return i = function() {
                    for (var n, i, r = (n = arguments)["length"], o = new Array(r), s = 0; s < r; s++) o[s] = n[s];
                    return (i = t["call"][H](t, [ this ]["concat"](o)) || this)["_type"] = u["Team"], 
                    i["teamId"] = void 0, i;
                }, n(i, t), i;
            }(r)), i[E][z]();
        }, o;
    }[Q](this)[H]();
});