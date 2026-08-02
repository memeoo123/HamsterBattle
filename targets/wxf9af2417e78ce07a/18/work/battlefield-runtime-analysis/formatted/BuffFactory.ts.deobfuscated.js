// Module: chunks:///_virtual/BuffFactory.ts
// Dependencies: cc, ./PoolManager.ts, ./AbnormalHurtBuff.ts, ./HealMaxHpBuff.ts, ./HurtBuff.ts, ./HurtCutHpBuff.ts, ./KillBuff.ts, ./PullBuff.ts, ./RealHurtBuff.ts, ./ShieldAtkBuff.ts, ./ShieldMaxHpBuff.ts, ./SkillBuff.ts, ./SkillEnum.ts
(function(t) {
    var n, i, r, u, o, s, e, h, c, a, f, v, l;
    return 0, function() {
        var d;
        return (d = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[M];
        }, function(t) {
            i = t["PoolManager"];
        }, function(t) {
            r = t[D];
        }, function(t) {
            u = t["HealMaxHpBuff"];
        }, function(t) {
            o = t["HurtBuff"];
        }, function(t) {
            s = t["HurtCutHpBuff"];
        }, function(t) {
            e = t["KillBuff"];
        }, function(t) {
            h = t["PullBuff"];
        }, function(t) {
            c = t["RealHurtBuff"];
        }, function(t) {
            a = t["ShieldAtkBuff"];
        }, function(t) {
            f = t["ShieldMaxHpBuff"];
        }, function(t) {
            v = t[b];
        }, function(t) {
            l = t["BuffType"];
        } ], d[T] = function() {
            n[E][R]({}, gst, hQ, void 0), t(w, function() {
                var t;
                return (t = function() {})["createBuff"] = function(t, n) {
                    var d;
                    switch (t["effectType"]) {
                      case l["Kill"]:
                        d = i["getItem"](e);
                        break;

                      case l["Pull"]:
                        d = i["getItem"](h);
                        break;

                      case l["Hurt"]:
                        d = i["getItem"](o);
                        break;

                      case l["RealHurt"]:
                        d = i["getItem"](c);
                        break;

                      case l["HealMax"]:
                        d = i["getItem"](u);
                        break;

                      case l["ShieldAtk"]:
                        d = i["getItem"](a);
                        break;

                      case l["ShieldMaxHp"]:
                        d = i["getItem"](f);
                        break;

                      case l["AbnormalHurt"]:
                        d = i["getItem"](r);
                        break;

                      case l["HurtCutHp"]:
                        d = i["getItem"](s);
                        break;

                      default:
                        d = i["getItem"](v);
                    }
                    return d["init"](t, n), d;
                }, t;
            }()), n[E][z]();
        }, d;
    }[H]();
});