// Module: chunks:///_virtual/MonsterFactory.ts
// Dependencies: cc, ./PoolManager.ts, ./TableManager.ts, ./BattleEnum.ts, ./BossUnit.ts, ./MonsterUnit.ts
(function(t) {
    var n, i, r, u, o, s;
    return 0, function() {
        var e;
        return (e = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[M];
        }, function(t) {
            i = t["PoolManager"];
        }, function(t) {
            r = t["TableManager"];
        }, function(t) {
            u = t["MonsterType"];
        }, function(t) {
            o = t["BossUnit"];
        }, function(t) {
            s = t["MonsterUnit"];
        } ], e[T] = function() {
            n[E][R]({}, ssn, esn, void 0), t(esn, function() {
                var t;
                return (t = function() {})["create"] = function(t) {
                    return r["getDataById"](table["monster"]["MonsterAttributeConfig"], t)["monsterType"] == u["Boss"] ? i["getItem"](o) : i["getItem"](s);
                }, t;
            }()), n[E][z]();
        }, e;
    }[H]();
});