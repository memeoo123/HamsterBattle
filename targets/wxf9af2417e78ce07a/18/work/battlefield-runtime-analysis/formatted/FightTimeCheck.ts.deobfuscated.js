// Module: chunks:///_virtual/FightTimeCheck.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./BattleTimer.ts, ./GBattleIns.ts
(function(t) {
    var n, i, r, u;
    return 0, function() {
        var o;
        return (o = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t["createClass"];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t[w];
        }, function(t) {
            u = t[w];
        } ], o[T] = function() {
            i[E][R]({}, Qyt, wW, void 0), t(wW, function() {
                var t, i;
                return (t = (i = function() {
                    this["time"] = 0, this["maxTime"] = 0, this["endCallback"] = void 0, this["exData"] = void 0, 
                    this["maxIndex"] = 1, this["index"] = 0, this["_isReadyToRemove"] = !1;
                })[U])["nextFrame"] = function() {
                    this["_isReadyToRemove"] || (this["index"]++, this["index"] >= this["maxIndex"] && (this["index"] = 0, 
                    this["time"] += r["speed"], this["triggerHandler"](), this["time"] >= this["maxTime"]) && (this["completeHandler"](), 
                    this["_isReadyToRemove"] = !0));
                }, t["triggerHandler"] = function() {}, t["completeHandler"] = function() {
                    this["endCallback"] && this["endCallback"]["run"](), this["destoryTimeCheck"]();
                }, t["destoryTimeCheck"] = function() {
                    u[X]["removeTimeCheck"](this), this["endCallback"] = null;
                }, n(i, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = 0, t["get"] = 0, t["set"] = 0, 
                        t;
                    }[H]())["key"] = nY, t["get"] = function() {
                        return this["_isReadyToRemove"];
                    }, t["set"] = function(t) {
                        this["_isReadyToRemove"] = t;
                    }, t;
                }[Q](this)[H]() ]), i;
            }()), i[E][z]();
        }, o;
    }[Q](this)[H]();
});