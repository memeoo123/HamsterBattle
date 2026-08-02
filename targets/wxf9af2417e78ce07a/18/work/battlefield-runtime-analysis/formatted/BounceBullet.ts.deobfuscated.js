// Module: chunks:///_virtual/BounceBullet.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./MathUtils2.ts, ./FeatureType.ts, ./GBattleIns.ts, ./SkillEnum.ts, ./SkillUtils.ts, ./BulletUnit.ts
(function(t) {
    var n, i, r, u, o, s, e, h, c;
    return wYn && EVn && (lut += Ayn), wYn && bVn && (yut += HKt), wYn && RVn && (yut += "atk"), 
    wYn && RVn && (lut += "F7LeR"), wYn && LVn && (lut += "Py1CPHzK"), wYn = 0, function() {
        var a;
        return EYn && LVn && (yut += "_"), EYn = 0, (a = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t["MathUtils"];
        }, function(t) {
            u = t["FeatureType"];
        }, function(t) {
            o = t[w];
        }, function(t) {
            s = t["SkillTargetType"], e = t["TargetFaction"];
        }, function(t) {
            h = t["SkillUtils"];
        }, function(t) {
            c = t["BulletUnit"];
        } ], a[T] = function() {
            bYn && EVn && (yut += Z_n), bYn && RVn && (yut += "ins"), bYn = 0, i[E][R]({}, lut, dut, void 0), 
            t(dut, function(t) {
                var i, c;
                return c = function() {
                    for (var n, i, r = (n = arguments)["length"], u = new Array(r), o = 0; o < r; o++) u[o] = n[o];
                    return (i = t["call"][H](t, [ this ]["concat"](u)) || this)["bouncelTimes"] = void 0, 
                    i["bouncelMaxTimes"] = void 0, i["num"] = void 0, i["hitUnitMap"] = void 0, i["missile"] = void 0, 
                    i["atkIns"] = void 0, i;
                }, n(c, t), (i = c[U])["initParam"] = function(t, n, i, s, e) {
                    var h, c, a, f, v;
                    this["atk"] = t, c = this["_cfg"]["parameter"], this["bouncelMaxTimes"] = +c["times"] || 0, 
                    this["bouncelTimes"] = 0, this["num"] = +c["num"] || 1, this["missile"] = c["missile"], 
                    this["atkIns"] = c[""] || 0, this["hitUnitMap"] = {}, this[F] = e, this["attrHeroId"] = s["attrHeroId"], 
                    this["_startVec"]["set"](i["x"], i["y"]), this["pos"]["set"](i["x"], i["y"]), this["_spineNode"]["setPosition"](i["x"], i["y"]), 
                    h = r["getRadians"](this["_pos"]["x"], this["_pos"]["y"], n["x"], n["y"]), a = r["radians2Angle"](h), 
                    this["_spineNode"]["angle"] = a + Dw, this["_moveVec"]["set"](this["moveSpeed"] * Math["cos"](h), this["moveSpeed"] * Math["sin"](h)), 
                    v = r["getDistance"](this["pos"]["x"], this["pos"]["y"], n["x"], n["y"]) - l, this["_maxTime"] = v / this["moveSpeed"], 
                    this["attrHeroId"] && (f = o["exAttrMgr"]["getFeatureAttr"](this["attrHeroId"], u["BOUNCE_TIMES"])) && (this["bouncelMaxTimes"] += f["times"]), 
                    c["last_missile"] && this["bouncelTimes"] == this["bouncelMaxTimes"] - 1 && (this["missile"] = c["last_missile"]);
                }, i["action"] = function() {
                    var t;
                    this["_isActive"] = !1, this["actionBehavior"](!0), (t = o["StateMemory"]["getBatteUintByUid"](this["targetUid"])) && (this["hitUnitMap"][t["uid"]] = !0, 
                    this["bouncelTimes"] >= this["bouncelMaxTimes"] || this["onHit"](t));
                }, i["onHit"] = function(t) {
                    var n;
                    if ((n = h["skillTarget"](s["Nearset"], e["EnemySide"], this, null, MB, gz)) && !(n["length"] < d)) {
                        this["bouncelTimes"]++;
                        for (var i = 0, r = 0; r < n["length"]; r++) if (!this["hitUnitMap"][n[r]["uid"]]) {
                            if (i >= this["num"]) break;
                            this["createBulle"](n[r]), i++;
                        }
                    }
                }, i["createBulle"] = function(t) {
                    var n;
                    return (n = o["UnitFactory"]["createBulletUnit"](this["missile"], this["teamId"], this["targetTeamId"], this["attrHeroId"]))["skill"] = this["skill"], 
                    n["initParam"](this["atk"], t["hurtPoint"], this[F]["hurtPoint"], this, t), n["casterUid"] = this["casterUid"], 
                    n["targetUid"] = t["uid"], this["atkIns"] && (n["atk"] *= 1 + this["atkIns"] / sC), 
                    o["StateMemory"]["curUnitProcessor"]["addBullet"](n), n instanceof c && (n["bouncelTimes"] = this["bouncelTimes"], 
                    n["hitUnitMap"] = this["hitUnitMap"]), n;
                }, c;
            }(c)), i[E][z]();
        }, a;
    }[Q](this)[H]();
});