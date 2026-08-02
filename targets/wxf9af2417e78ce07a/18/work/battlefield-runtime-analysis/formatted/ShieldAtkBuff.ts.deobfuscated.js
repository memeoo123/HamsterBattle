// Module: chunks:///_virtual/ShieldAtkBuff.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./BattleConstantConfig.ts, ./BattleEnum.ts, ./GBattleIns.ts, ./SkillBuff.ts
(function(t) {
    var n, i, r, u, o, s;
    return 0, function() {
        var e;
        return (e = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t[w];
        }, function(t) {
            u = t["HurtNumType"];
        }, function(t) {
            o = t[w];
        }, function(t) {
            s = t[b];
        } ], e[T] = function() {
            i[E][R]({}, Zyn, _st, void 0), t(_st, function(t) {
                var i, s;
                return s = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)["hp"] = 0, i["maxHp"] = 0, 
                    i;
                }, n(s, t), (i = s[U])[N] = function() {
                    var t, n;
                    (t = this[P]) && (n = Math["floor"](this[x]["atk"] * t[K] / r["getRandBase"]), this["maxHp"] += n, 
                    this["hp"] += n, o["BattleShowFactory"]["createNum"](u["ShieldNum"], n, this[F]["pos"], this[F]["modelHeight"]));
                }, i["dispose"] = function() {
                    this["maxHp"] = this["hp"] = 0, t[U]["dispose"]["call"](this);
                }, s;
            }(s)), i[E][z]();
        }, e;
    }[Q](this)[H]();
});