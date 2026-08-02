// Module: chunks:///_virtual/BattleUnit.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./TableManager.ts, ./TweenUtils.ts, ./ScreenAdaptManager.ts, ./Logger.ts, ./GIns.ts, ./CollisionUtils.ts, ./MathUtils2.ts, ./BattleLayerManager.ts, ./BattleUtils.ts, ./GBattleIns.ts, ./AttrEnum.ts, ./UnitSearchUtils.ts, ./BattleConstantConfig.ts, ./BattleEnum.ts, ./FightType.ts, ./PassivitySkillUtils.ts, ./SkillEnum.ts, ./SkillUtils.ts, ./HpBar.ts, ./ActorUnit.ts, ./BattleTimer.ts
(function(t) {
    var n, i, r, u, o, s, h, c, a, f, v, m, k, _, S, g, y, p, I, b, L, D, N, V, O, x, K, W, J, Z, j, $, tt, nt, it, rt, ot, st, et, ht, at;
    return uYn && EVn && (m7 += F0, U7 += mSn, btt += $Sn, Ptt += ZM), uYn && bVn && (Ftt += Sa), 
    uYn && RVn && (B7 = "_", w7 = "formati"), uYn && LVn && (att = "", Wtt = "c"), uYn && bVn && (w7 += xh), 
    uYn && EVn && (att += lit), uYn && LVn && (L7 += "isAtta", U7 += "illStopEf", _9 += "i", 
    utt += "eBuff", Att += "Att"), uYn && RVn && (c9 += "ck", b9 += "kill", btt += "pSkil", 
    Ftt += "imPos"), uYn && LVn && (m7 += "JF2bI7b/7", utt += "EffectP"), uYn && RVn && (m7 += "ykTRo"), 
    uYn = 0, function() {
        var ft;
        return sYn && bVn && (a9 += xu, utt += CS, Ftt += vnt), sYn && EVn && (b9 += pTt, 
        Z9 += cGn, Att += Vj), sYn && RVn && (B7 += "envAct", Ptt += "modelI"), sYn && LVn && (w7 += "onPosit", 
        a9 += "ateSkillBeha", att += "_"), sYn && LVn && (L7 += "ckBac", U7 += "f", b9 += "S", 
        Att += "ac", btt += "lE"), sYn && RVn && (c9 += "SelfSta", _9 += "rcl", Ftt += "Typ"), 
        sYn && LVn && (utt += "os"), sYn = 0, (ft = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A], i = t["createForOfIteratorHelperLoose"], r = t["createClass"], u = t["assertThisInitialized"];
        }, function(t) {
            o = t[M], s = t["v2"], h = t["tween"], c = t["view"], a = t["Vec2"];
        }, function(t) {
            f = t["TableManager"];
        }, function(t) {
            v = t["TweenUtils"];
        }, function(t) {
            m = t["ScreenAdaptManager"];
        }, function(t) {
            k = t["Logger"];
        }, function(t) {
            _ = t[w];
        }, function(t) {
            S = t["CollisionUtils"];
        }, function(t) {
            g = t["MathUtils"];
        }, function(t) {
            y = t["BattleLayerManager"];
        }, function(t) {
            p = t["BattleUtils"];
        }, function(t) {
            I = t[w];
        }, function(t) {
            b = t["AttrEnum"];
        }, function(t) {
            L = t[w];
        }, function(t) {
            D = t[w];
        }, function(t) {
            N = t["WorldUnitTeam"], V = t["ActorState"], O = t["DirctionType"], x = t["HurtNumType"];
        }, function(t) {
            K = t["FightType"];
        }, function(t) {
            W = t["PassivitySkillUtils"];
        }, function(t) {
            J = t["PassivitySkillType"], Z = t["SkillSubType"], j = t["SkillType"], $ = t["EffectLayer"], 
            tt = t["SkillEffectPos"], nt = t["BuffEffectPos"], it = t["AbnormalType"], rt = t["BuffType"], 
            ot = t["TargetFaction"];
        }, function(t) {
            st = t["SkillUtils"];
        }, function(t) {
            et = t["HpBar"];
        }, function(t) {
            ht = t["ActorUnit"];
        }, function(t) {
            at = t[w];
        } ], ft[T] = function() {
            oYn && bVn && (B7 += u2t, w7 += HMn, c9 += Fst, att += iVt), oYn && EVn && (L7 += H6t, 
            U7 += N7, _9 += B, btt += e7, Ptt += cit), oYn && LVn && (Z9 = "技能"), oYn && RVn && (X9 = "没找到动作"), 
            oYn && EVn && (X9 += a1), oYn && LVn && (Wtt += "learBuffEffct"), oYn && LVn && (B7 += "ive", 
            w7 += "ion", att += "s"), oYn && RVn && (a9 += "vior", Ptt += "d2"), oYn && LVn && (L7 += "k", 
            U7 += "ectArr", b9 += "ound", Att += "king", Ftt += "e2"), oYn && RVn && (c9 += "te", 
            _9 += "e", btt += "ffect"), oYn = 0, o[E][R]({}, m7, k7, void 0), t(k7, function(t) {
                var o, C;
                return eYn && EVn && (Wtt += DRt), eYn && LVn && (Wtt += "Handler"), eYn = 0, C = function() {
                    var n;
                    return (n = t["call"](this) || this)["teamId"] = void 0, n["baglikeId"] = void 0, 
                    n["_hpBar"] = void 0, n["selectMainTarget"] = void 0, n["skillInfo"] = void 0, n["skillInfoCtrl"] = void 0, 
                    n["_width"] = y7, n["_height"] = y7, n["_attr"] = void 0, n["_attackEndTime"] = 0, 
                    n["_attackerUid"] = void 0, n["isBeginToFight"] = !0, n["isAutoFight"] = !0, n["isEndFight"] = !1, 
                    n["buffEffNameMap"] = {}, n["buffEffs"] = {}, n["disposeDelayTime"] = 0, n[5] = !0, 
                    n[8] = void 0, n["summon"] = !1, n["flashing"] = !1, n["animLoopTimes"] = 0, n["offAngle"] = 0, 
                    n[""] = !1, n["atkPointRotate"] = 0, n["skillMoveEffectArr"] = [], n["sk"] = [], 
                    n["moveAttackType"] = 0, n["isMoveing"] = !1, n["debugGraphics"] = void 0, n["repelTime"] = 0, 
                    n["repelSpeed"] = void 0, n["_hpBar"] = new et(u(n)), n;
                }, n(C, t), (o = C[U])["getAtkPoint"] = function(t) {
                    var n, i, r;
                    return i = t["x"], n = t["y"], r = this["node"], function() {
                        var t;
                        return (t = HVn(HVn({}, Ra, 0), La, 0))["x"] = (i * r["node"]["scale"]["x"] + r["node"]["position"]["x"]) * r["scale"]["x"] + r["position"]["x"], 
                        t["y"] = (n * r["node"]["scale"]["y"] + r["node"]["position"]["y"]) * r["scale"]["y"] + r["position"]["y"], 
                        t;
                    }[H]();
                }, o["getAttrValue"] = function(t, n) {
                    return void 0 === n && (n = !1), t == b["ATK"] ? this["_attr"]["getBuffValue"](b["ATK"]) * Math["max"](0, 1 + (this["_attr"]["getBuffValue"](b["ATK_INC"]) - this["_attr"]["getBuffValue"](b["ATK_DEC"])) / D["getRandBase"]) : this["_attr"]["getBuffValue"](t, n);
                }, o[q] = function(t, n) {
                    var i, r;
                    n && (this["_attackerUid"] = n), r = this["_attr"]["hp"], this["_attr"][q](t["value"]), 
                    this["_spineNode"]["colorDelay"](), this["updateHpBar"](), i = I["StateMemory"]["getBatteUintByUid"](this["_attackerUid"]), 
                    W["checkPassSkillCon"](J["ConType_4"], i, this, t["skillInfo"]), t["status"] == D["Crit"] ? W["checkPassSkillCon"](J["ConType_17"], i, this, t["skillInfo"]) : t["status"] == D["Block"] && W["checkPassSkillCon"](J["ConType_18"], this, i, t["skillInfo"]), 
                    W["checkPassSkillCon"](J["ConType_3"], this, i), W["updatePassSkillFunction"](this, J["ConType_19"], X7, t["value"]), 
                    W["checkPassSkillCon"](J["ConType_19"], this, this), _["bagLikeRecordMgr"]["onHurt"](t, r), 
                    this["_attr"]["isDeath"]() && this["onDie"](t);
                }, o["heal"] = function(t) {
                    if (t["status"] == D["HealToShield"]) {
                        if (this["attr"]["hp"] >= this["attr"]["maxHp"]) return void this["_attr"]["healShield"](t["value"]);
                        var n;
                        this["attr"]["hp"] + t["value"] >= this["attr"]["maxHp"] && (n = this["attr"]["hp"] + t["value"] - this["attr"]["maxHp"], 
                        this["_attr"]["healShield"](n), t["value"] -= n);
                    }
                    this["_attr"]["heal"](t["value"]), this["updateHpBar"]();
                }, o["initShowHpBar"] = function() {
                    this["updateHpBar"]();
                }, o["setOtherVisible"] = function(n) {
                    t[U]["setOtherVisible"]["call"](this, n), this["_hpBar"]["onHide"]();
                }, o["updateHpBar"] = function() {
                    this["_hpBar"]["hpPercentage"] = this["_attr"]["hpPercentage"];
                }, o["dieFlyAnim"] = function() {
                    var t, n, i, r;
                    n = this, r = this["teamId"] == N["Self"], t = s(this["pos"]["x"] + (r ? -Az : Az), this["pos"]["y"]), 
                    i = s(this["pos"]["x"] + (t["x"] - this["pos"]["x"]) / d, t["y"] + MB), v["bezierNodeTo"](this["_spineNode"], .8, this["pos"], i, t)["call"]((function() {
                        n["_spineNode"] && (n["_spineNode"]["active"] = !1, n["onDieActionComplete"]());
                    }))["start"](), h()[F](this["_spineNode"])["to"](.8, function() {
                        var t;
                        return (t = HVn({}, t9, 0))["angle"] = r ? n9 : -n9, t;
                    }[H]())["start"]();
                }, o["onDie"] = function(t) {
                    var n, i;
                    i = this, this["attackActionComplete"](!0), null != (n = this["selectMainTarget"]) && n["unit"] && !this["attr"]["isBoom"] && (this["attr"]["isBoom"] = !0, 
                    W["checkPassSkillCon"](J["ConType_14"], this, this["selectMainTarget"]["unit"], this["skillInfo"])), 
                    this["setState"](V["Die"]), this["setShadowVisible"](!1), this["isSubType"](Z["KillSelf"]) ? h(this["_spineNode"])["delay"](d)["call"]((function() {
                        i["_spineNode"]["active"] = !1, i["onDieActionComplete"]();
                    }))["start"]() : this["dieFlyAnim"](), I["StateMemory"]["markDead"](this["uid"], this["teamId"], this["_type"], this["_attr"]["getConfigId"]());
                }, o["onRebirth"] = function() {}, o["rebirth"] = function() {
                    this["attr"]["rebirth"](), this["onRebirth"]();
                }, o["onBeforUpdatePos"] = function() {}, o["update"] = function() {
                    var t;
                    this["updateModel"](), this["checkTargetStatue"](), this["che"]() && (this["_attr"]["updateSkillCD"](), 
                    this["upd"](), I[X]["isStopFightAi"] || this["isForcePathMove"] || this["repelHandler"]() || (this["updateAI"](), 
                    this["doOther"]()), this["checkPathMove"](), this["updatePos"](), this["updateNode"](), 
                    this["debugGraphics"]) && this["skillInfo"] && ((t = this["debugGraphics"])["clear"](), 
                    t["lineWidth"] = e, t["strokeColor"]["fromHEX"](k9), t["c"](this["atkPoint"]["x"], this["atkPoint"]["y"], l), 
                    t["stroke"](), t["fill"]());
                }, o["checkTargetStatue"] = function() {
                    this["selectMainTarget"] && (!this["selectMainTarget"]["unit"] || !this["selectMainTarget"]["unit"]["isDeath"] && this["selectMainTarget"]["unit"]["canSelect"]() ? g[Y](this["pos"], this["selectMainTarget"]["pos"]) >= this["searchRange"] && (this["selectMainTarget"] = null) : this["clearMainTarget"]());
                }, o["che"] = function() {
                    return this["attr"]["isAlive"]();
                }, o["checkOtherCondition"] = function() {
                    return !0;
                }, o["clearMainTarget"] = function() {
                    this["selectMainTarget"] = null;
                }, o["checkSkill"] = function() {
                    this["skillInfoCtrl"] ? (this["skillInfo"] = this["skillInfoCtrl"], this["skillInfoCtrl"] = null, 
                    this["clearMainTarget"]()) : !this["isAutoFight"] || this["skillInfo"] && !this["_attr"]["isReActSkill"]() || (this["skillInfo"] = this["getActiveSkill"](), 
                    this["clearMainTarget"]());
                }, o["getActiveSkill"] = function() {
                    return this["_attr"]["getActiveSkill"]();
                }, o["checkSelectTarget"] = function() {
                    this["skillInfo"] && (this["selectMainTarget"] = st["searchTarget"](this["skillInfo"], this));
                }, o["attack"] = function() {
                    var t, n, i, r, u, o, s, e, h, c, a, v;
                    return this["moveAttackType"] = 0, !!this["checkAttack"]() && (!W["checkPassSkillCon"](J["ConType_38"], this, this["selectMainTarget"]["unit"], this["skillInfo"]) && (this["selectMainTarget"]["pos"]["x"] != this["pos"]["x"] && this["setDirction"](this["selectMainTarget"]["pos"]["x"] > this["pos"]["x"] ? -1 : 1), 
                    a = this["skillInfo"], r = g["getAngle"](this["_pos"]["x"], this["_pos"]["y"], this["selectMainTarget"]["pos"]["x"], this["selectMainTarget"]["pos"]["y"]), 
                    a["subType"] == Z["Assassinate"] ? (t = af, g[Y](this["_pos"], this["selectMainTarget"]["pos"]) < (t = null != (i = this["_attr"]) && i["getNormalSkillRange"] ? this["_attr"]["getNormalSkillRange"]() : t) ? c = f["getDataById"](table["battle"]["SkillEffectConfig"], 1) : (c = this["checkAnimAction"](r), 
                    this["flashing"] = !0)) : c = this["checkAnimAction"](r), this["atkPointRotate"] = 0, 
                    h = null, a["castTime"] ? (this["animLoopTimes"] = (null == c ? void 0 : c["animLoopTimes"]) || 0, 
                    o = null != c && c["animLoopTimes"] ? 1 : 0, a["type"] == j["ATTACK"] ? (h = this["atkTimeScale"], 
                    this["_attackEndTime"] = Math["ceil"](a["castTime"] / h)) : this["_attackEndTime"] = a["castTime"], 
                    this["setState"](V["Attack"], null == c ? void 0 : c["anim"], h, this[""] ? 1 : 0, o)) : this["skillInfo"]["refreshCD"](), 
                    null != (v = this["skillInfo"]) && null != (v = v["cfg"]) && v["s"] && (u = E9 + (null == (e = this["skillInfo"]["cfg"]) ? void 0 : e["s"]), 
                    null != (n = this["skillInfo"]["cfg"]) && n["soundDelay"] ? _["audioMgr"]["playBattleSoundDelay"](null == (s = this["skillInfo"]["cfg"]) ? void 0 : s["soundDelay"], u) : _["audioMgr"]["playSound"](u)), 
                    W["checkPassSkillCon"](J["ConType_2"], this, this["selectMainTarget"]["unit"], this["skillInfo"]), 
                    this["_attr"]["actionSkill"](a, this["selectMainTarget"]), this["showSkillEfect"](c, r, h), 
                    a["castTime"] || (this["skillInfo"] = null), !0));
                }, o["showSkillEfect"] = function(t, n, i) {
                    var r, u, o, s, e;
                    if (o = t["modelId"], o = this[""] ? t["modelUpId"] : o) for (var h = 0; h < o["length"]; h++) r = this["createFightEffect"](o[h], t["animPosType"], this, $["EffectTopLayer"], !1, this["_spineNode"]["getScale"]()["x"], i), 
                    t["param"] && r && t["param"]["rotate"] && t["param"]["rotateIndex"] == h && (r["angle"] = -1 == this["_dirction"] ? n + t["param"]["rotate"] : n - Dw);
                    if (e = t["bgModelId"], e = this[""] ? t["bgModelUpId"] : e) for (var c = 0; c < e["length"]; c++) r = this["createFightEffect"](e[c], t["animPosType"], this, $["BgLayer"], !1, this["_spineNode"]["getScale"]()["x"], i), 
                    t["param"] && r && t["param"]["rotate"] && (r["angle"] = -1 == this["_dirction"] ? n + t["param"]["rotate"] : n - Dw);
                    t["sceneEffect"] && (s = t["sceneEffect"]["toString"](), u = tt["Screen_Center"], 
                    this["createFightEffect"](s, u, this, $["EffectTopLayer"], !1, this["_spineNode"]["getScale"]()["x"], i));
                }, o["getActionEffectData"] = function() {
                    return this["skillInfo"]["getActionEffectData"]();
                }, o["checkAnimAction"] = function(t) {
                    var n, i;
                    return i = this["skillInfo"], (n = this["getActionEffectData"]()) || k["fight"](Z9 + i["skillId"] + X9), 
                    n;
                }, o["createFightEffect"] = function(t, n, i, r, u, o, e) {
                    var h, c, a, f, v, l;
                    return l = this, void 0 === e && (e = null), a = i["pos"], n == tt["Hurt_Point"] ? a = i["hurtPoint"] : n == tt["Atk_Point"] || n == tt["Atk_Point_Move"] ? a = i["atkPoint"] : n == tt["Screen_Center"] && (a = s(0, 0)), 
                    h = 1, this["_spineNode"] && (h = (null == (v = this["_spineNode"]["getScale"]()) ? void 0 : v["x"]) || 1), 
                    n == tt["Player_Move_Fight_Dir"] && (h = o), f = r == $["BgLayer"], (c = I["BattleShowFactory"]["showEffectModel"](t["toString"](), a, h, f, u))["exData"] = n, 
                    f ? n == tt["Player_Move"] || n == tt["Player_Move_Fight_Dir"] || n == tt["Atk_Point_Move"] ? (c["setCompleteListener"]((function(t) {
                        for (var n = 0; n < l["skillMoveEffectArr"]["length"]; n++) if (l["skillMoveEffectArr"][n] == c) {
                            l["skillMoveEffectArr"][n]["delayDestroy"](0), l["skillMoveEffectArr"]["splice"](n, 1);
                            break;
                        }
                    })), this["skillMoveEffectArr"][R](c)) : n == tt["Screen_Center"] && (this["sk"][R](c), 
                    c["setWorldPosition"](.5 * m["viewWidth"], m["viewHeight"], 0), y["ins"]()["effectTopLayer"]["addChild"](c)) : r == $["EffectTopLayer"] && y["ins"]()["effectTopLayer"]["addChild"](c), 
                    c["timeScale"] = e ? e * at["speed"] : at["speed"], c;
                }, o["updateSkillMovePos"] = function() {
                    for (var t = 0; t < this["skillMoveEffectArr"]["length"]; t++) this["skillMoveEffectArr"][t]["exData"] == tt["Atk_Point_Move"] ? this["skillMoveEffectArr"][t]["setPosition"](this["atkPoint"]["x"], this["atkPoint"]["y"]) : this["skillMoveEffectArr"][t]["setPosition"](this["pos"]["x"], this["pos"]["y"]);
                }, o["updat"] = function() {
                    for (var t in this["buffEffs"]) {
                        var n;
                        n = this["buffEffs"][t]["exData"], this["buffEffs"][t]["isValid"] && (n == nt["SizePos"] ? this["buffEffs"][t]["setPosition"](this["pos"]["x"], this["pos"]["y"] + this["modelHeight"], 0) : this["buffEffs"][t]["setPosition"](this["pos"]["x"], this["pos"]["y"], 0), 
                        this["buffEffs"][t]["exData"] == nt["LoopScaleX"]) && (this["dirction"] == O["Rigth"] ? this["buffEffs"][t]["setScale"](-Math["abs"](this["buffEffs"][t]["getScale"]()["x"]), this["buffEffs"][t]["getScale"]()["y"]) : this["buffEffs"][t]["setScale"](Math["abs"](this["buffEffs"][t]["getScale"]()["x"]), this["buffEffs"][t]["getScale"]()["y"]));
                    }
                }, o["useSkill"] = function(t) {
                    this["skillInfoCtrl"] = this["_attr"]["getActiveSkill"](t);
                }, o["useSkillByIndex"] = function(t) {
                    this["skillInfoCtrl"] = this["_attr"]["getSkillByIndex"](t);
                }, o["usePassActiveSkillSkill"] = function(t) {
                    var n;
                    this["stopAction"](), n = +t["split"](att)[1] - 1, this["useSkillByIndex"](n);
                }, o["checkAttack"] = function(t) {
                    var n;
                    if (void 0 === t && (t = !1), this["selectMainTarget"] && this["skillInfo"]) return !!this["canAttack"]() && (!!t || g[Y](this["selectMainTarget"]["pos"], this["pos"]) <= this["skillInfo"]["castingRange"] || ((n = this["attr"]["getHorseSkill"](this["skillInfo"]["skillId"])) && (this["skillInfo"] = n), 
                    this["setMoveTarget"](this["selectMainTarget"]["pos"]), !1));
                }, o["upd"] = function() {
                    this["_attr"]["update"]();
                }, o["setAbnormalStatus"] = function(t, n) {
                    if (t == it["NotMove"] || t == it["dizziness"] || t == it["NotAttack"] || t == it["Silent"]) {
                        if (this["_attr"]["isImmuneControl"]()) return;
                        t == it["NotMove"] || t == it["dizziness"] ? this["stopAction"]() : t == it["Silent"] ? this["skillInfo"] && this["_attackEndTime"] && this["skillInfo"]["type"] != j["ATTACK"] && this["stopAttacAction"]() : t == it["NotAttack"] && this["stopAttacAction"]();
                    }
                    this["_attr"]["setAbnormalStatus"](t, n);
                }, o["clearAbnormalStatus"] = function(t) {
                    this["_attr"]["clearAbnormalStatus"](t);
                }, o["clearAllAbnormalStatusByType"] = function(t) {
                    this["_attr"]["clearAllAbnormalStatusByType"](t);
                }, o["canMove"] = function() {
                    return this["attr"]["canMove"]();
                }, o["canAttack"] = function() {
                    return this["attr"]["canAttack"]();
                }, o["canSkill"] = function() {
                    return this["attr"]["canSkill"]();
                }, o["canSelect"] = function() {
                    return this["attr"]["canSelect"]() && !this["attr"]["isLowHatred"]() && !I["unitCollisionsMgr"]["isInBlock"](this["pos"]);
                }, o["canBeHurt"] = function() {
                    return this["attr"]["isLowHatred"]() || this["canSelect"]();
                }, o["isSubType"] = function(t) {
                    var n, r;
                    if ((n = null == (r = null == this ? void 0 : this["attr"]["getMonsterCfg"]()) ? void 0 : r["skillIds"]) && n instanceof Array) for (var u, o = i(n); !(u = o())["done"]; ) {
                        var s;
                        if (s = u["value"], f["getDataById"](table["battle"]["SkillConfig"], s)["subType"] == t) return !0;
                    }
                    return !1;
                }, o["onMove"] = function(t) {
                    void 0 === t && (t = !1), this["checkCanBreakAttackAction"]() && t && this["attackActionComplete"](!0), 
                    W["updatePassSkillFunction"](this, J["ConType_12"], ktt, I[X]["frameIndex"]), W["checkPassSkillCon"](J["ConType_12"], this, this), 
                    W["updatePassSkillFunction"](this, J["ConType_21"], Stt, this["pos"]), W["checkPassSkillCon"](J["ConType_21"], this, this);
                }, o["checkCanBreakAttackAction"] = function() {
                    return !0;
                }, o["updateOtherPos"] = function() {
                    t[U]["updateOtherPos"]["call"](this), this["updateHpBarPos"](), this["updateSkillMovePos"](), 
                    this["updat"]();
                }, o["updateAI"] = function() {
                    var t, n, i, r;
                    0 < this["_attackEndTime"] && (this["_attackEndTime"]--, 0 == this["_attackEndTime"]) && this["attackActionComplete"](!1), 
                    this["checkCanActivateSkills"]() && (this["checkSkill"](), this["checkSelectTarget"](), 
                    this["skillInfo"]) && (this["selectMainTarget"] ? g[Y](this["selectMainTarget"]["pos"], this["pos"]) < this["skillInfo"]["castingRange"] ? this["attack"]() : (t = S["calVecTemp"](this["pos"], this["selectMainTarget"]["pos"], this["moveDistance"]), 
                    this["_moveVec"]["setMoveVec"](t)) : (this["selectMainTarget"] = st["searchEnemyHome"](this), 
                    (n = g[Y](this["selectMainTarget"]["pos"], this["pos"])) < this["skillInfo"]["castingRange"] ? this["canAttckHome"]() && this["attack"]() : Ttt < Math["abs"](this["selectMainTarget"]["pos"]["x"] - this["pos"]["x"]) && (i = s(this["selectMainTarget"]["pos"]["x"], this["selectMainTarget"]["pos"]["y"]), 
                    nh < n && (i["y"] = this["pos"]["y"]), r = S["calVecTemp"](this["pos"], i, this["moveDistance"]), 
                    this["_moveVec"]["setMoveVec"](r)), this["clearMainTarget"]()));
                }, o["canAttckHome"] = function() {
                    return this["teamId"] == N["Enemy"] || this["teamId"] == N["Self"] && I["StateMemory"]["playingMethod"] == K["ENDLESS_MODE"];
                }, o["checkCanActivateSkills"] = function() {
                    return this["isBeginToFight"] && !this["is"];
                }, o["doOther"] = function() {}, o["updateModel"] = function() {}, o["updateNode"] = function() {
                    var n;
                    (n = this["_moveVec"]["getDirectionScale"]()) && (this["is"] && this["selectMainTarget"] ? this["selectMainTarget"]["pos"]["x"] != this["pos"]["x"] && this["setDirction"](this["selectMainTarget"]["pos"]["x"] > this["pos"]["x"] ? -1 : 1) : this["setDirction"](n)), 
                    this["isMoveing"] = !1, this["_moveVec"]["isMoving"] ? (this["is"] || this["setState"](V["Running"]), 
                    this["isMoveing"] = !0) : this["is"] || this["isDeath"] || this["setState"](V["Idle"]), 
                    t[U]["updateNode"]["call"](this);
                }, o["updateHpBarPos"] = function() {
                    this["_hpBar"]["setPosition"](this["pos"]["x"], this["pos"]["y"]);
                }, o["setSpineNode"] = function(n) {
                    var i;
                    i = this, t[U]["setSpineNode"]["call"](this, n), n["setCompleteListener"]((function(t) {
                        i["nodeActionComplete"](t);
                    }));
                }, o["nodeActionComplete"] = function(t) {
                    this["_state"] != V["Die"] && -1 != this["animLoopTimes"] && this["animLoopTimes"]-- <= 0 && (this["_state"] == V["RunAttack"] ? this["isMoveing"] ? this["setState"](V["Running"]) : this["setState"](V["Idle"]) : this["_state"] != V["Attack"] && this["_state"] != V["Skill01"] && this["_state"] != V["Skill02"] || this["setState"](V["Idle"]), 
                    this["animLoopTimes"] = 0);
                }, o["attackActionComplete"] = function(t) {
                    !t && this["_attackEndTime"] || (this["_attackEndTime"] = 0, this["animLoopTimes"] = 0, 
                    this["skillInfo"] && (this["skillInfo"]["skillCompleteHandler"](), this["_attr"]["removeSkillBehavoirs"]()), 
                    this["skillInfo"] = null, this["sto"]());
                }, o["sto"] = function() {
                    for (var t = 0; t < this["sk"]["length"]; t++) this["sk"][t]["delayDestroy"](V_);
                    this["sk"]["length"] = 0;
                }, o["onStopMove"] = function() {
                    t[U]["onStopMove"]["call"](this), W["updatePassSkillFunction"](this, J["ConType_12"], ktt, 0);
                }, o["victor"] = function() {
                    this["stopAction"](), this["setState"](V["Victor"]);
                }, o["stopAction"] = function() {
                    this["_state"] != V["Die"] && this["setState"](V["Idle"]), this["attackActionComplete"](!0);
                }, o["stopAttacAction"] = function() {
                    this["setState"](V["Idle"]), this["attackActionComplete"](!0);
                }, o["onDieActionComplete"] = function() {}, o["addBuff"] = function(t) {
                    var n;
                    this["_attr"]["addBuff"](t), t["effectType"] == rt["Abnormal"] && (n = t[P], I["BattleShowFactory"]["createNum"](x["Abnormal"], 0, this["pos"], this["modelHeight"], n["type"]));
                }, o["updateBuff"] = function(t) {}, o["removeBuff"] = function(t) {}, o["addBuffEff"] = function(t, n) {
                    var i, r, u, o, s, e;
                    void 0 === n && (n = !1), (r = null == (e = t["cfg"]["modelId"]) ? void 0 : e[0]) && (o = t["cfg"]["animPosType"], 
                    n && (o == nt["Once"] || o == nt["OnceNotEnd"] || o == nt["OnceForAct"]) || this["addBuffEffectHandler"](r, t["cfg"]["animPosType"]), 
                    s = null == (i = t["cfg"][""]) ? void 0 : i[0]) && (u = t["cfg"]["an"], n && (u == nt["Once"] || u == nt["OnceNotEnd"] || u == nt["OnceForAct"]) || this["addBuffEffectHandler"](s, t["cfg"]["an"] || 1));
                }, o["addBuffEffectHandler"] = function(t, n) {
                    var i, r, u, o, s, e, h, c;
                    c = this, (u = this["buffEffNameMap"][t]) ? n != nt["Loop"] && n != nt["LoopScaleX"] || u++ : u = 1, 
                    this["buffEffNameMap"][t] = u, this["buffEffs"][t] || (s = f["getDataById"](table["model"]["ModelConfig"], t["toString"]()), 
                    i = this["pos"], r = n == nt["actBuffTime"] ? this["_spineNode"]["modelHeight"] / (s["height"] || V_) : 1, 
                    h = !(e = n == nt["Loop"] || n == nt["SizePos"]) && n != nt["actBuffTime"] && n != nt["actChanged"], 
                    ((o = I["BattleShowFactory"]["showEffectModel"](t["toString"](), i, this["_spineNode"]["getScale"]()["x"], !1, e, r, h))["exData"] = n) != nt["Once"] && n != nt["OnceNotEnd"] && n != nt["OnceForAct"] || o["setCompleteListener"]((function(t) {
                        for (var n in c["buffEffs"]) if (c["buffEffs"][n] == o) {
                            c["buffEffs"][n]["delayDestroy"](0), c[6](+n);
                            break;
                        }
                    })), this["buffEffs"][t] = o);
                }, o["clearBuffEffect"] = function(t) {
                    var n, i, r, u;
                    (n = null == (u = t["cfg"]["modelId"]) ? void 0 : u[0]) && (this[6](n), r = null == (i = t["cfg"][""]) ? void 0 : i[0]) && this[6](r);
                }, o[6] = function(t) {
                    var n, i;
                    null != (n = this["buffEffNameMap"][t]) && (n = Math["max"](n - 1, 0), (this["buffEffNameMap"][t] = n) <= 0) && ((i = this["buffEffs"][t]) && i["delayDestroy"](0), 
                    delete this.buffEffs[t]);
                }, o["getForceMovePathTarget"] = function() {
                    if (this["selectMainTarget"]) return this["selectMainTarget"]["pos"];
                }, o["checkEnterFight"] = function() {
                    var t, n;
                    !this["isBeginToFight"] && !I[X]["isStopFightAi"] && (t = this["searchRange"] + qi, 
                    n = L["getNearestBattleUnit"](this, st["getTeamIdByFaction"](this["teamId"], ot["EnemySide"]), t)) && (this["selectMainTarget"] = n, 
                    this["enterFight"]());
                }, o["enterFight"] = function(t) {}, o["exitFight"] = function() {
                    this["_hpBar"]["delayHide"](), this["isBeginToFight"] = !1, W["updatePassSkillFunction"](this, J["ConType_19"], X7, 0), 
                    this["attr"]["resetBuff"](!0), this["attr"]["resetSkillPreCd"](), this["attr"]["resetSkillCd"](), 
                    this["clearMainTarget"](), this["skillInfo"] = null, this["skillInfoCtrl"] = null;
                }, o["endFight"] = function() {
                    this["stopAction"](), this["isEndFight"] = !0, this["_moveVec"]["resetVec"]();
                }, o["startFight"] = function() {
                    this["isEndFight"] = !1, this["isDeath"] || this["setState"](V["Idle"]);
                }, o["dispose"] = function() {
                    var n;
                    this["sto"]();
                    for (var i = 0; i < this["skillMoveEffectArr"]["length"]; i++) this["skillMoveEffectArr"][i]["delayDestroy"](0);
                    this["skillMoveEffectArr"]["length"] = 0, this["exitFight"](), null != (n = this["_hpBar"]) && n["dispose"](), 
                    this["_hpBar"] = null, this["flashing"] = !1, t[U]["dispose"]["call"](this);
                }, o["repel"] = function(t, n) {
                    var i, r, u;
                    this["stopAction"](), this["stopMove"](), this["repelTime"] = l, i = c["getDesignResolutionSize"]()["width"], 
                    t["y"] = this["pos"]["y"], this["pos"]["x"] - n < -i / d + $m ? n = this["pos"]["x"] - (-i / d + $m) : this["pos"]["x"] + n > i / d - $m && (n = i / d - $m - this["pos"]["x"]), 
                    r = g["radian"](t, this["pos"]), u = n / this["repelTime"], this["repelSpeed"] = new a(u * Math["cos"](r), u * Math["sin"](r));
                }, o["repelHandler"] = function() {
                    return 0 < this["repelTime"] && (this["repelTime"]--, this["forceMove"](this["repelSpeed"]), 
                    !0);
                }, r(C, [ function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = IW, t["get"] = function() {
                        return this["_uid"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = pR, t["get"] = function() {
                        return this["_attr"]["hp"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = JC, t["get"] = function() {
                        return this["_attr"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = SR, t["get"] = function() {
                        return this["getAttrValue"](b["ATK"]);
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = zX, t["get"] = function() {
                        return this["_attr"]["atkTimeScale"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = Att, t["get"] = function() {
                        return this["_attackEndTime"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = G, t["get"] = function() {
                        return this["attr"]["isAlive"]();
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = GZ, t["get"] = function() {
                        return this["attr"]["isDeath"]();
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = int, t["get"] = function() {
                        return this[5];
                    }, t["set"] = function(t) {
                        this[5] = t;
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = lZ, t["get"] = function() {
                        return this["_attr"]["searchRange"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = iv, t["get"] = function() {
                        return this["_attr"]["moveSpeed"] * p["frameDeltaMs"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = qv, t["get"] = function() {
                        var t, n, i, r;
                        return this["skillInfo"] && this["skillInfo"]["atkPoint"] ? (t = this[""] ? this["skillInfo"]["atkPointBack"] : this["skillInfo"]["atkPoint"], 
                        0 != this["atkPointRotate"] ? (n = Math["abs"](t["x"]), i = -1 == this["_dirction"] ? Dw - this["atkPointRotate"] : this["atkPointRotate"], 
                        (r = g["getCoordinates"](i, n))["y"] += t["y"], this["getAtkPoint"](r)) : this["getAtkPoint"](t)) : this["pos"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = jv, t["get"] = function() {
                        var t;
                        return t = this["node"], function() {
                            var n;
                            return (n = function() {
                                var t;
                                return (t = HVn(HVn({}, Ra, 0), La, 0))["x"] = 0, t["y"] = 0, t;
                            }[H]())["x"] = t["node"]["position"]["x"] * t["scale"]["x"] + t["position"]["x"], 
                            n["y"] = t["node"]["position"]["y"] * t["scale"]["y"] + t["position"]["y"] + .5 * this["modelHeight"], 
                            n;
                        }[Q](this)[H]();
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = Y5, t["get"] = function() {
                        return this["modelHeight"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = Ga, t["get"] = function() {
                        return nv;
                    }, t;
                }[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = jX, t["get"] = function() {
                        return this["_attr"]["hpPercentage"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = ct, t["get"] = function() {
                        return this;
                    }, t;
                }[Q](this)[H]() ]), C;
            }(ht)), o[E][z]();
        }, ft;
    }[Q](this)[H]();
});