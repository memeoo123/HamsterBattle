// Module: chunks:///_virtual/KillBuff.ts
// Dependencies: ./rollupPluginModLoBabelHelpers.js, cc, ./PoolManager.ts, ./Handler.ts, ./BattleUtils.ts, ./DamageVo.ts, ./FightTimeCheck.ts, ./GBattleIns.ts, ./SkillBuff.ts, ./SkillEnum.ts
(function(t) {
    var n, i, r, u, o, s, e, h, c, a;
    return 0, function() {
        var f;
        return 0, (f = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[A];
        }, function(t) {
            i = t[M];
        }, function(t) {
            r = t["PoolManager"];
        }, function(t) {
            u = t["Handler"];
        }, function(t) {
            o = t["BattleUtils"];
        }, function(t) {
            s = t["DamageVo"];
        }, function(t) {
            e = t["FightTimeCheck"];
        }, function(t) {
            h = t[w];
        }, function(t) {
            c = t[b];
        }, function(t) {
            a = t["AbnormalType"];
        } ], f[T] = function() {
            0, i[E][R]({}, $8t, dst, void 0), t(dst, function(t) {
                var i, c;
                return c = function() {
                    var n;
                    return n = arguments, t[H](this, n) || this;
                }, n(c, t), (i = c[U])[N] = function() {
                    var t, n;
                    (n = this[P]) && ((t = new e)["maxTime"] = o["getFrameByTime"](n["delay"]), t["endCallback"] = u["create"](this, this["onKillBuff"]), 
                    h[X]["addTimeCheck"](t));
                }, i["onAddBuff"] = function() {
                    t[U]["onAddBuff"]["call"](this), this[F] && this[F]["setAbnormalStatus"](a["Invincible"]);
                }, i["remove"] = function() {
                    this[F] && this[F]["clearAbnormalStatus"](a["Invincible"]), t[U]["remove"]["call"](this);
                }, i["onKillBuff"] = function() {
                    var t;
                    this[F] && this[F][G] && (((t = r["getItem"](s))[Z] = this)[O] && (t["skillInfo"] = this[O]["skill"]), 
                    t["value"] = this[F]["attr"]["maxHp"], this[F][q](t));
                }, c;
            }(c)), i[E][z]();
        }, f;
    }[Q](this)[H]();
});