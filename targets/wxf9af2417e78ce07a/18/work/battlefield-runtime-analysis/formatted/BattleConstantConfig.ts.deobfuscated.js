// Module: chunks:///_virtual/BattleConstantConfig.ts
// Dependencies: cc, ./TableManager.ts
(function(t) {
    var n, i;
    return sWn && bVn && (mq += xyt, Hz += io, Gz += 1), sWn && EVn && (Oz += C_), sWn && RVn && (Gq = "", 
    jq = "BA"), sWn && bVn && (Gq += N9t, jq += mVt), sWn && LVn && (mq += "3PapwN", 
    Rq += "HERO_ATTACK_", Dq += "RO_BLOCK_", Gz += 49), sWn && RVn && (Cq += "AT", fz += "Atta", 
    vz += "eB"), sWn && RVn && (mq += "DCbeuCvQJ7W", Gz += 26), sWn && LVn && (Bq += "AREA", 
    Oz += "Scale"), sWn && LVn && (mq += "Zq"), sWn && RVn && (Hz += "l", Gz += 19), 
    sWn = 0, function() {
        var r;
        return eWn && bVn && (Cq += mGt, Bq += PPt, vz += yct), eWn && EVn && (Rq += mV, 
        Dq += Tt), eWn && RVn && (Gq += "distance"), eWn && LVn && (jq += "TTLE:HERO_MOV", 
        $q += "oMoveFormatio"), eWn && RVn && (Cq += "E_MAX_RADIUS", Dq += "VALUE"), eWn && LVn && (Rq += "VALUE", 
        fz += "ck", vz += "loc"), eWn && RVn && (Bq += "_HEAL"), eWn = 0, (r = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[M];
        }, function(t) {
            i = t["TableManager"];
        } ], r[T] = function() {
            var r, o;
            hWn && EVn && (Gq += qGt, jq += gZ, $q += qRt, fz += z_t), hWn && RVn && (Gq += "Value", 
            $q += "nDis"), hWn && LVn && (jq += "E_FORMA"), hWn && RVn && (fz += "Value", vz += "kValue"), 
            hWn = 0, n[E][R]({}, mq, kq, void 0), r = function(t) {
                return t["HERO_MOVE_SPEED"] = Sq, t["MONSTER_MOVE_SPEED"] = yq, t["MONSTER_REFRESH_RANGE"] = Iq, 
                t["MONSTER_H"] = Tq, t["HERO_HATE_MAX_RADIUS"] = Mq, t["SAFE_"] = wq, t["REBIRTH_GREATER_DISTANCE_RESET_POSITION"] = Eq, 
                t[""] = Lq, t["HE"] = Hq, t["HERO_CRIT_VALUE"] = Nq, t["HERO_MISS_VALUE"] = Fq, 
                t;
            }({}), (o = t(w, function() {
                var t;
                return cWn && RVn && (jq += "TION_SPEED"), cWn = 0, (t = function() {})["init"] = function() {
                    if (0, !this["_isInit"]) {
                        var n, u, o;
                        o = table["battle"]["BattleConstantConfig"], this[4] = Number(i["getDataById"](o, Vq)["content"]), 
                        n = i["getDataById"](o, Oq)["content"]["split"](xq), this["monsterRandomMoveMinTime"] = +n[0], 
                        this["monsterRandomMoveMaxTime"] = +n[1], u = i["getDataById"](o, Yq)["content"]["split"](IM), 
                        this["checkRangeWidth"] = +u[0], this["checkRangeHeight"] = +u[1], this["crit3TextValue"] = Number(i["getDataById"](o, qq)["content"]) / sC, 
                        this["crit2TextValue"] = Number(i["getDataById"](o, qq)["content"]) / sC, this["heroMoveSpeed"] = Number(i["getDataById"](o, r["HERO_MOVE_SPEED"])["content"]) / qi, 
                        this["heroMoveFormationSpeed"] = Number(i["getDataById"](o, jq)["content"]) / qi, 
                        this["her"] = Number(i["getDataById"](o, tz)["content"]), this["heroCollectHateMaxRadius"] = Number(i["getDataById"](o, iz)["content"]), 
                        this["monsterMoveSpeed"] = Number(i["getDataById"](o, r["MONSTER_MOVE_SPEED"])["content"]) / qi, 
                        this["monsterRefreshRange"] = JSON["parse"](i["getDataById"](o, r["MONSTER_REFRESH_RANGE"])["content"]), 
                        this["monsterRandomMoveRange"] = JSON["parse"](i["getDataById"](o, sz)["content"]), 
                        this["monsterHateMaxRadius"] = Number(i["getDataById"](o, r["MONSTER_H"])["content"]), 
                        this["heroHateMaxRadius"] = Number(i["getDataById"](o, r["HERO_HATE_MAX_RADIUS"])["content"]), 
                        this["safeAreaHeal"] = Number(i["getDataById"](o, r["SAFE_"])["content"]), this["greaterDistResetPos"] = Number(i["getDataById"](o, r["REBIRTH_GREATER_DISTANCE_RESET_POSITION"])["content"]), 
                        this["base"] = Number(i["getDataById"](o, r[""])["content"]) / t["getRandBase"], 
                        this["bas"] = Number(i["getDataById"](o, r["HE"])["content"]), this["baseCritValue"] = Number(i["getDataById"](o, r["HERO_CRIT_VALUE"])["content"]), 
                        this["baseMissValue"] = Number(i["getDataById"](o, r["HERO_MISS_VALUE"])["content"]), 
                        this["talkKuangData"] = JSON["parse"](i["getDataById"](o, kz)["content"]), this["talkQiData"] = JSON["parse"](i["getDataById"](o, Sz)["content"]);
                        for (var s = 1; s < gz; s++) {
                            var e, h;
                            if (!(h = null == (e = i["getDataById"](o, yz + s)) ? void 0 : e["content"])) break;
                            this["abnormalTypeMap"][s] = h["split"](IM);
                        }
                    }
                }, t["checkAbnormalType"] = function(t, n) {
                    return !(!this["abnormalTypeMap"][t += ""] || -1 == this["abnormalTypeMap"][t]["indexOf"](n));
                }, t;
            }()))["_isInit"] = void 0, o["heroMoveSpeed"] = .2, o["monsterMoveSpeed"] = .12, 
            o["heroMoveFormationSpeed"] = .2, o["her"] = MB, o["monsterRefreshRange"] = function() {
                var t;
                return (t = function() {
                    var t;
                    return (t = HVn(HVn(HVn({}, UB, 0), Cz, 0), Tz, 0))["w"] = 0, t["h"] = 0, t["a"] = 0, 
                    t;
                }[H]())["w"] = nh, t["h"] = nh, t["a"] = 0, t;
            }[H](), o["monsterHateMaxRadius"] = Az, o["heroHateMaxRadius"] = Az, o["heroCollectHateMaxRadius"] = nh, 
            o["safeAreaHeal"] = qi, o["greaterDistResetPos"] = qi, o["rebirthWaitTime"] = Mz, 
            o["getRandBase"] = sC, o["monsterRandomMoveMinTime"] = 0, o["monsterRandomMoveMaxTime"] = 0, 
            o["monsterRandomMoveRange"] = function() {
                var t;
                return (t = function() {
                    var t;
                    return (t = HVn(HVn(HVn({}, UB, 0), Cz, 0), Tz, 0))["w"] = 0, t["h"] = 0, t["a"] = 0, 
                    t;
                }[H]())["w"] = nh, t["h"] = nh, t["a"] = 0, t;
            }[H](), o["Normal"] = 0, o["Miss"] = 1, o["Crit"] = d, o["Block"] = u, o["Heal"] = a, 
            o["CounterAttack"] = e, o["SpecialHurt"] = c, o["DmgRes"] = f, o["LeaderSkillHea"] = Uz, 
            o["LeaderSkillHurt"] = af, o["SafeAreaHeal"] = Fz, o["Kill"] = Gz, o["HealToShield"] = V_, 
            o["base"] = void 0, o["bas"] = void 0, o["baseCritValue"] = void 0, o["baseMissValue"] = void 0, 
            o["crit3TextValue"] = void 0, o["crit2TextValue"] = void 0, o[4] = void 0, o["battleModel"] = 1, 
            o["checkRangeWidth"] = void 0, o["checkRangeHeight"] = void 0, o["talkKuangData"] = void 0, 
            o["talkQiData"] = void 0, o["abnormalTypeMap"] = {}, n[E][z]();
        }, r;
    }[Q](this)[H]();
});