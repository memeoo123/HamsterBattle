// Module: chunks:///_virtual/MoveVec.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc
(function(t) {
    var n, i, r;
    return 0, function() {
        var u;
        return 0, (u = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t["createClass"];
        }, function(t) {
            i = t[M], r = t["v2"];
        } ], u[T] = function() {
            0, i[E][R]({}, Usn, qc, void 0), t(qc, function() {
                var t, i;
                return (t = (i = function() {
                    this["isDirty"] = void 0, this["isMoving"] = void 0, this["isForce"] = void 0, this["_envVec"] = r(), 
                    this["_moveVec"] = r();
                })[U])["get2VecSumTemp"] = function() {
                    return i["tempVec"]["set"](this["_envVec"]["x"] + this["_moveVec"]["x"], this["_envVec"]["y"] + this["_moveVec"]["y"]);
                }, t["hasEnvVec"] = function() {
                    return !(!this["_envVec"]["x"] && !this["_envVec"]["y"]);
                }, t["getDirectionScale"] = function() {
                    var t;
                    return t = this["_moveVec"]["x"], Math["abs"](t) < .1 ? 0 : 0 < t ? -1 : 1;
                }, t["setMoveVec"] = function(t) {
                    this["isDirty"] = !0, this["isMoving"] = !0, this["_moveVec"]["set"](t);
                }, t["addEnvVec"] = function(t) {
                    this["isDirty"] = !0, this["_envVec"]["add"](t);
                }, t["setForceMove"] = function(t) {
                    this["isDirty"] = !0, this["isForce"] = !0, this["_envVec"]["set"](t);
                }, t["resetVec"] = function() {
                    this["isDirty"] = !1, this["isMoving"] = !1, this["isForce"] = !1, this["_envVec"]["set"](0, 0), 
                    this["_moveVec"]["set"](0, 0);
                }, t["onRecovery"] = function() {
                    this["resetVec"]();
                }, n(i, [ function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = Tf, t["get"] = function() {
                        return this["_moveVec"];
                    }, t;
                }[Q](this)[H](), function() {
                    var t;
                    return (t = function() {
                        var t;
                        return (t = HVn(HVn({}, hn, 0), Ut, 0))["key"] = 0, t["get"] = 0, t;
                    }[H]())["key"] = gf, t["get"] = function() {
                        return this["_envVec"];
                    }, t;
                }[Q](this)[H]() ]), i;
            }())["tempVec"] = r(), i[E][z]();
        }, u;
    }[Q](this)[H]();
});