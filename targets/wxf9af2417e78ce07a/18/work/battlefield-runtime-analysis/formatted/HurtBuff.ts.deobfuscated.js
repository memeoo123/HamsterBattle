// Module: chunks:///_virtual/HurtBuff.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./FightFormula.ts, ./GBattleIns.ts, ./SkillBuff.ts, ./SkillEnum.ts, ./BattleUnit.ts
(function(t) {
    var n, i, r, u, o, s, e;
    return czn && EVn && (Njt += Ngn), czn && RVn && (Njt += "7b5d4oepLRDNbDOYp"), czn && RVn && (Njt += "o10eOn"), 
    czn = 0, function() {
        var h;
        return (h = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t[B];
        }, function(t) {
            u = t[w];
        }, function(t) {
            o = t[b];
        }, function(t) {
            s = t["BuffType"];
        }, function(t) {
            e = t["BattleUnit"];
        } ], h[T] = function() {
            i[E][R]({}, Njt, vst, void 0), t(vst, function(t) {
                var i;
                return i = function() {
                    var n;
                    return n = arguments, t[H](this, n) || this;
                }, n(i, t), i[U][N] = function() {
                    var t;
                    if (t = this[P]) {
                        var n, i;
                        if (i = 0, this[x] instanceof e && this[x]["attr"]["buffStatueByType"](s["BuffNumSkill"])) for (var o = u["buffMgr"]["getBuffListByEffect"](this[x], s["BuffNumSkill"]), h = 0; h < o["length"]; h++) {
                            var c;
                            (c = o[h][P])["buff"] == this["cfg"]["group"] && (i += c[K] * o[h][W]);
                        }
                        (n = r[V](this[O], this[x], this[F], t[K] * this[W] + i, this[Y]))[Z] = this, u[X][q](n);
                    }
                }, i;
            }(o)), i[E][z]();
        }, h;
    }[Q](this)[H]();
});