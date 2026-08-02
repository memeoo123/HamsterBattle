// Module: chunks:///_virtual/FightTimeLoop.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./BattleTimer.ts, ./FightTimeCheck.ts
(function(t) {
    var n, i, r, u;
    return 0, function() {
        var o;
        return (o = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t[w];
        }, function(t) {
            u = t["FightTimeCheck"];
        } ], o[T] = function() {
            i[E][R]({}, ipt, z4, void 0), t(z4, function(t) {
                var i, u;
                return u = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)["timeLoop"] = 0, i["trigger"] = 0, 
                    i;
                }, n(u, t), (i = u[U])["triggerHandler"] = function() {
                    this["timeLoop"] += r["speed"], 0 != this["trigger"] && this["timeLoop"] >= this["trigger"] && (this["endCallback"] && this["endCallback"]["run"](), 
                    this["timeLoop"] = 0);
                }, i["completeHandler"] = function() {
                    this["destoryTimeCheck"]();
                }, u;
            }(u)), i[E][z]();
        }, o;
    }[Q](this)[H]();
});