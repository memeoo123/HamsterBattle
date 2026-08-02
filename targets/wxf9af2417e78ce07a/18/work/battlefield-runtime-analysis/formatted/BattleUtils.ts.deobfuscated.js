// Module: chunks:///_virtual/BattleUtils.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./BattleTimer.ts, ./RandomUtils.ts
(function(t) {
    var n, i, r, u;
    return cYn && RVn && (dnt = ""), cYn = 0, function() {
        var o;
        return fYn && EVn && (dnt += xIt), fYn && RVn && (dnt += "p"), fYn = 0, (o = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t["createClass"];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t[w];
        }, function(t) {
            u = t[w];
        } ], o[T] = function() {
            aYn && RVn && (dnt += "ro"), aYn = 0, i[E][R]({}, ant, zc, void 0), t(zc, function() {
                var t;
                return (t = function() {})["getFrameByTime"] = function(t) {
                    var n;
                    return n = y7 / r["battleTickFrame"], Math["ceil"](t / qi * n);
                }, t["getTimeByFrame"] = function(t) {
                    var n;
                    return n = y7 / r["battleTickFrame"], Math["ceil"](1 / n * t * qi);
                }, t["getUnitTalk"] = function(t, n) {
                    var i;
                    return t && u["isRandTrue"](n) ? (i = u["randomProbability"](t[1]), t["str"][i]) : null;
                }, n(t, null, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = rv, t["get"] = function() {
                        return 16.6 * r["battleTickFrame"] * r["speed"];
                    }, t;
                }[H]() ]), t;
            }()), i[E][z]();
        }, o;
    }[H]();
});