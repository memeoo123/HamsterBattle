// Module: chunks:///_virtual/SkillBuffGroup.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./G.ts, ./ArrayUtils.ts, ./BattleUnit.ts, ./SkillEnum.ts
(function(t) {
    var n, i, r, u, o, s;
    return E0n && bVn && (vAn += Lbt), E0n && RVn && (fAn = "i"), E0n && EVn && (fAn += YCt), 
    E0n = 0, function() {
        var e;
        return L0n && EVn && (vAn += MXt), L0n && RVn && (fAn += "sBr"), L0n = 0, (e = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t["createClass"];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t[w];
        }, function(t) {
            u = t[w];
        }, function(t) {
            o = t["BattleUnit"];
        }, function(t) {
            s = t["BuffConditionType"];
        } ], e[T] = function() {
            R0n && EVn && (fAn += wRn), R0n && RVn && (vAn = "移除 BUFF "), R0n && RVn && (fAn += "eak"), 
            R0n = 0, i[E][R]({}, cAn, Lst, void 0), t(Lst, function() {
                var t, i;
                return (t = (i = function(t) {
                    this["uid"] = void 0, this["cfg"] = void 0, this[F] = void 0, this["from"] = void 0, 
                    this["buffIds"] = [], this["buffs"] = [], this["behavior"] = void 0, this["cfg"] = t;
                })[U])["addBuff"] = function(t) {
                    u["iPush"](this["buffIds"], t["id"]) && this["buffs"][R](t);
                }, t["active"] = function() {
                    for (var t = this["buffs"]["concat"](), n = 0; n < t["length"]; n++) t[n]["cfg"]["conditionType"] == s["NOW"] && t[n]["actionBuffEffect"]();
                }, t["checkBreak"] = function() {
                    if (this["cfg"][6] && this["from"] instanceof o && this["behavior"] && this["behavior"]["skill"] && (!this["from"]["skillInfo"] || this["from"]["skillInfo"] != this["behavior"]["skill"])) {
                        for (;this["buffs"]["length"]; ) this["buffs"]["shift"]()["isReadyToRemove"] = !0;
                        this["buffIds"]["length"] = 0, this["buffs"]["length"] = 0, this[F]["clearBuffEffect"](this);
                    }
                }, t["removeBuffById"] = function(t) {
                    var n;
                    return -1 != (n = this["buffIds"]["indexOf"](t)) && (this["buffIds"]["splice"](n, 1), 
                    r["Logger"]["fight"](vAn + t), 0 == this["buffIds"]["length"]) && (this[F]["attr"]["removeBuffById"](t), 
                    this[F]["clearBuffEffect"](this), !0);
                }, t["removeAll"] = function() {
                    for (var t = 0; t < this["buffs"]["length"]; t++) this["buffs"][t]["isReadyToRemove"] = !0;
                }, n(i, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = wet, t["get"] = function() {
                        return 0 < this["buffIds"]["length"];
                    }, t;
                }[Q](this)[H]() ]), i;
            }()), i[E][z]();
        }, e;
    }[Q](this)[H]();
});