// Module: chunks:///_virtual/HealMaxHpBuff.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./FightFormula.ts, ./GBattleIns.ts, ./BattleConstantConfig.ts, ./SkillBuff.ts
(function(t) {
    var n, i, r, u, o, s;
    return kqn && LVn && (LWt = "4"), kqn && EVn && (LWt += eo), kqn && RVn && (LWt += "fb381aNz9Bc6ZHNhk/"), 
    kqn && RVn && (LWt += "QDhS"), kqn = 0, function() {
        var e;
        return 0, (e = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t[B];
        }, function(t) {
            u = t[w];
        }, function(t) {
            o = t[w];
        }, function(t) {
            s = t[b];
        } ], e[T] = function() {
            0, i[E][R]({}, LWt, fst, void 0), t(fst, function(t) {
                var i;
                return i = function() {
                    var n;
                    return n = arguments, t[H](this, n) || this;
                }, n(i, t), i[U][N] = function() {
                    var t, n, i;
                    (i = this[P]) && (t = Math["floor"](this[F]["attr"]["maxHp"] * i["hpRate"] * this[W] / o["getRandBase"]), 
                    n = r["heal"](this[O], this[x], this[F], t, !1), u[X]["heal"](n));
                }, i;
            }(s)), i[E][z]();
        }, e;
    }[Q](this)[H]();
});