// Module: chunks:///_virtual/ActorUnit.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./FGUI.ts, ./BattleEnum.ts, ./BaseUnit.ts, ./MoveVec.ts, ./BattleUtils.ts, ./MathUtils2.ts, ./GBattleIns.ts, ./BattleTimer.ts, ./fairygui.mjs
(function(t) {
    var n, i, r, u, o, s, e, h, c, a, f, v, l, d;
    return ROn && bVn && (jc += qk, ka += U2, Zf += IFt), ROn && EVn && (hf += tlt), 
    ROn && LVn && (xa = ""), ROn && LVn && (jc += "abn2i", Sa += "ackMo", Ha += "eSha", 
    Zf += "i"), ROn && LVn && (jc += "h5Dy4SQH"), ROn && RVn && (jc += "cSH27Ob"), ROn = 0, 
    function() {
        var m;
        return DOn && EVn && (Sa += Z0, Va += uP, Zf += ggt), DOn && bVn && (xa += AHn), 
        DOn && RVn && (ha += "ove", hf += "formationP"), DOn && LVn && (ka += "isFirst"), 
        DOn && LVn && (Sa += "veTargetUpdat", Ha += "dow", Zf += "m"), DOn = 0, (m = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A], i = t["createClass"];
        }, function(t) {
            r = t[M], u = t["v2"];
        }, null, function(t) {
            o = t["ActorState"], s = t["UnitType"], e = t["DirctionType"];
        }, function(t) {
            h = t["BaseUnit"];
        }, function(t) {
            c = t["MoveVec"];
        }, function(t) {
            a = t["BattleUtils"];
        }, function(t) {
            f = t["MathUtils"];
        }, function(t) {
            v = t[w];
        }, function(t) {
            l = t[w];
        }, function(t) {
            d = t;
        } ], m[T] = function() {
            LOn && bVn && (ha += G1t, ka += Ift, Ha += Ke, Va += cHn, hf += qzt), LOn && LVn && (Va += "imeSca", 
            xa += "_"), LOn && RVn && (ha += "Point", ka += "Move", hf += "os"), LOn && RVn && (Sa += "eTime", 
            Ha += "ImgScale"), LOn && LVn && (Zf += "g"), LOn = 0, r[E][R]({}, jc, $c, void 0), 
            t($c, function(t) {
                var r, h;
                return HOn && bVn && (xa += Ptn), HOn && RVn && (Va += "le"), HOn && LVn && (xa += "up"), 
                HOn = 0, h = function() {
                    for (var n, i, r = (n = arguments)["length"], h = new Array(r), a = 0; a < r; a++) h[a] = n[a];
                    return (i = t["call"][H](t, [ this ]["concat"](h)) || this)["shadow"] = void 0, 
                    i["_type"] = s["Actor"], i["_state"] = o["Idle"], i["_animKey"] = void 0, i["_spineNode"] = void 0, 
                    i["_spineNodeList"] = void 0, i["nowM"] = void 0, i["isPathMove"] = !1, i["isForcePathMove"] = !1, 
                    i["movePaths"] = void 0, i["_moveVec"] = new c, i["_tempPosVec"] = u(), i["_formationPos"] = u(), 
                    i["isBackAction"] = !1, i[""] = !0, i["stopByBlockTimes"] = 0, i["att"] = ga, i["_dirction"] = e["Rigth"], 
                    i;
                }, n(h, t), (r = h[U])["setSpineNode"] = function(t) {
                    this["_spineNode"] = t, this["_spineNode"]["active"] = !0, this["_spineNode"]["once"](Ca, this["onSpineLoaded"], this), 
                    this["_spineNodeList"] = [ this["_spineNode"] ];
                }, r["createOtherSpineNode"] = function(t, n) {
                    var i;
                    (i = v["UnitFactory"]["createAnimNode"](t))["loadByModelId"](t), n["addChild"](i), 
                    this["_spineNodeList"][R](i), i["setPosition"](this["pos"]["x"], this["pos"]["y"]);
                }, r["setSpinesPosXY"] = function(t, n) {
                    for (var i = 0; i < this["_spineNodeList"]["length"]; i++) this["_spineNodeList"][i]["setPosition"](t, n);
                }, r["onSpineLoaded"] = function() {
                    this["updat"]();
                }, r["setState"] = function(t, n, i, r, u) {
                    var s;
                    if (void 0 === r && (r = 0), void 0 === u && (u = 0), this["_spineNode"] && (this["_state"] != t || n != this["_animKey"] || t == o["Attack"])) switch (this["_state"] = t, 
                    this["_animKey"] = n, s = 1 == u, t != o["Idle"] && (this["isBackAction"] = 1 == r), 
                    this["_state"]) {
                      case o["Running"]:
                        this["setStateHandler"](this["moveAction"], !0, this["_spineNode"]["runT"]);
                        break;

                      case o["Idle"]:
                        var e = Oa;
                        this["isBackAction"] && (e += xa), this["setStateHandler"](e, !0);
                        break;

                      case o["Attack"]:
                        var h = 1 == r ? Ka : Wa;
                        this["setStateHandler"](n || h, s, i);
                        break;

                      case o["Die"]:
                        this["setStateHandler"](Ja, !1);
                        break;

                      case o["Victor"]:
                        this["setStateHandler"](Xa, !0);
                    }
                }, r["setStateHandler"] = function(t, n, i) {
                    for (var r = 0; r < this["_spineNodeList"]["length"]; r++) this["_spineNodeList"][r]["play"](t, n, i * l["speed"]);
                }, r["setMoveVec"] = function(t) {
                    this["_moveVec"]["setMoveVec"](t);
                }, r["addEnvVec"] = function(t) {
                    this["_moveVec"]["addEnvVec"](t);
                }, r["forceMove"] = function(t) {
                    this["_moveVec"]["setForceMove"](t);
                }, r["setPosXY"] = function(n, i) {
                    t[U]["setPosXY"]["call"](this, n, i), this["_moveVec"]["isDirty"] = !0, this["updateShadowPos"]();
                }, r["tryMove"] = function(t, n) {
                    var i, r;
                    return (r = v["unitCollisionsMgr"]["tryMove"](t, n, this["isPathMove"])) || this["_moveVec"]["resetVec"](), 
                    r ? this["stopByBlockTimes"] = 0 : (this["stopByBlockTimes"]++, i = (i = this["getForceMovePathTarget"]()) || this[""], 
                    cf < f[Y](i, this["pos"]) && this["stopByBlockTimes"]++), !r && (this[""] || af <= this["stopByBlockTimes"]) && (this["stopByBlockTimes"] = 0, 
                    this["forceMovePathHandler"]()), this[""] = !0, r;
                }, r["setMoveTarget"] = function(t, n) {
                    if (void 0 === n && (n = !1), this["isPathMove"]) {
                        if (this["att"]--, !n && 0 < this["att"]) return !1;
                        this["att"] = af;
                    }
                    return !1;
                }, r["checkPathMove"] = function() {}, r["stopMove"] = function() {
                    this["_moveVec"]["resetVec"](), this["clearPathMove"]();
                }, r["onStopMove"] = function() {
                    this["clearPathMove"]();
                }, r["updatePos"] = function() {
                    var t;
                    this["_moveVec"]["isForce"] ? (this["tryMove"](this["pos"], this["_moveVec"]["envVec"]), 
                    this["updateOtherPos"]()) : this["canMove"]() && (this["_moveVec"]["isDirty"] ? ((t = c["tempVec"])["set"](this["_moveVec"]["envVec"]), 
                    this["_moveVec"]["isMoving"] && t["add"](this["_moveVec"]["moveVec"]), this["onMove"](this["_moveVec"]["isForce"]), 
                    this["tryMove"](this["pos"], t)) : this["onStopMove"](), this["updateOtherPos"]());
                }, r["onBeforUpdatePos"] = function() {}, r["canMove"] = function() {
                    return !0;
                }, r["onMove"] = function(t) {}, r["updateOtherPos"] = function() {
                    this["updateShadowPos"]();
                }, r["runPaths"] = function(t, n) {
                    t && 0 == t["length"] || (this["isForcePathMove"] = n, this["isPathMove"] = !0, 
                    this["movePaths"] = t, this["moveNextPath"]());
                }, r["moveNextPath"] = function() {
                    return 0 != this["movePaths"]["length"] && (this["nowM"] = this["movePaths"]["shift"](), 
                    !0);
                }, r["clearPathMove"] = function() {
                    this["isPathMove"] && (this["isPathMove"] = !1, this["isForcePathMove"] = !1, this["movePaths"]["length"] = 0, 
                    this["nowM"] = null);
                }, r["getForceMovePathTarget"] = function() {
                    return null;
                }, r["forceMovePathHandler"] = function() {
                    this["getForceMovePathTarget"]() || this[""];
                }, r["updateNode"] = function() {
                    this["_moveVec"]["isDirty"] && (this["setSpinesPosXY"](this["pos"]["x"], this["pos"]["y"]), 
                    this["_moveVec"]["resetVec"]());
                }, r["setDirction"] = function(t) {
                    this["_spineNode"]["setDirction"](t), this["_dirction"] = t;
                }, r["removeShadow"] = function() {
                    this["shadow"] && this["shadow"]["node"] && this["shadow"]["node"]["parent"] && this["shadow"]["node"]["removeFromParent"](), 
                    this["shadow"] = null;
                }, r["createShadow"] = function() {
                    this["initShadowImg"](), this["updat"](), v["battleLayerMgr"]["shadowLayer"]["addChild"](this["shadow"]["node"]), 
                    this["updateShadowPos"]();
                }, r["initShadowImg"] = function() {
                    this["shadow"] || (this["shadow"] = d["UIPackage"]["createObject"](xf, Kf));
                }, r["updat"] = function() {
                    this["shadow"]["scaleX"] = this["shadow"]["scaleY"] = this["_spineNode"]["modelWidth"] / this["shadow"][""]["width"];
                }, r["updateShadowPos"] = function() {
                    this["shadow"] && (this["shadow"]["x"] = this["pos"]["x"], this["shadow"]["y"] = -this["pos"]["y"]);
                }, r["setShadowVisible"] = function(t) {
                    this["shadow"] && (this["shadow"]["visible"] = t);
                }, r["setOtherVisible"] = function(t) {
                    this["setShadowVisible"](t);
                }, r["dispose"] = function() {
                    var n;
                    this["removeShadow"](), null != (n = this["_spineNode"]) && n["isValid"] && this["_spineNode"]["destroy"](), 
                    t[U]["dispose"]["call"](this);
                }, i(h, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = 0, t["get"] = 0, t["set"] = 0, 
                        t;
                    }[H]())["key"] = hf, t["get"] = function() {
                        return this["_formationPos"];
                    }, t["set"] = function(t) {
                        this["_formationPos"]["set"](t);
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = tv, t["get"] = function() {
                        return null;
                    }, t;
                }[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = Df, t["get"] = function() {
                        return this["_spineNode"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = Ga, t["get"] = function() {
                        return nv;
                    }, t;
                }[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = iv, t["get"] = function() {
                        return a["frameDeltaMs"];
                    }, t;
                }[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = uv, t["get"] = function() {
                        return this["_spineNode"] ? this["_spineNode"]["modelHeight"] : 0;
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = ov, t["get"] = function() {
                        return this["_dirction"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn(HVn({}, hn, 0), Ut, 0), di, 0))["key"] = 0, t["get"] = 0, t["set"] = 0, 
                        t;
                    }[H]())["key"] = Vr, t["get"] = function() {
                        return this["node"]["active"];
                    }, t["set"] = function(t) {
                        this["node"]["active"] = t, this["setShadowVisible"](t);
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = sv, t["get"] = function() {
                        return this["_spineNode"]["modelScale"];
                    }, t;
                }[Q](this)[H]() ]), h;
            }(h)), r[E][z]();
        }, m;
    }[Q](this)[H]();
});