// Module: chunks:///_virtual/FruitSkillData.ts
// Dependencies: cc, ./FruitSkillAttrMap.ts, ./FruitEnums.ts
(function(t) {
    var n, i, r, u;
    return hXn && RVn && (FBt += "cdT"), hXn = 0, function() {
        var o;
        return aXn && bVn && (FBt += $7t), aXn && RVn && (FBt += "im"), aXn = 0, (o = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[M];
        }, function(t) {
            i = t["FruitSkillAttrMap"];
        }, function(t) {
            r = t["FruitSkillAttr"], u = t["FruitSkillAttrAddition"];
        } ], o[T] = function() {
            cXn && RVn && (FBt += "e"), cXn = 0, n[E][R]({}, NBt, sBt, void 0), t(sBt, function() {
                var t;
                return (t = function() {
                    this["userId"] = void 0, this["id"] = void 0, this["cfg"] = void 0, this["attrs"] = void 0, 
                    this["skillCD"] = void 0;
                })[U]["setCfg"] = function(t) {
                    this["cfg"] = t, this["attrs"] ? this["attrs"]["clear"]() : this["attrs"] = new i, 
                    this["attrs"]["setAttr"](r["BULLET_CNT"], u["BASE"], t["bulletCnt"]), this["attrs"]["setAttr"](r["RANGE_WIDTH"], u["BASE"], t["range"] ? t["range"][0] : 0), 
                    this["attrs"]["setAttr"](r["RANGE_HEIGHT"], u["BASE"], t["range"] ? t["range"][1] : 0), 
                    this["attrs"]["setAttr"](r["CD"], u["BASE"], t[""]), this["attrs"]["setAttr"](r["DAMAGE"], u["BASE"], t["damage"]), 
                    this["attrs"]["setAttr"](r["DURATION"], u["BASE"], t["duration"]), this["attrs"]["setAttr"](r["TRIGGERTIMES"], u["BASE"], t["triggerTimes"]);
                }, t;
            }()), n[E][z]();
        }, o;
    }[Q](this)[H]();
});