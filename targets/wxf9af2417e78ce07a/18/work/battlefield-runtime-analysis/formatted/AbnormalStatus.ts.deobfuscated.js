// Module: chunks:///_virtual/AbnormalStatus.ts
// Dependencies: cc
(function(t) {
    var n;
    return QVn && EVn && (nt += M9t), QVn = 0, function() {
        var i;
        return $Vn && RVn && (nt += "_timeM"), $Vn = 0, (i = HVn(HVn({}, C, 0), T, 0))[C] = [ function(t) {
            n = t[M];
        } ], i[T] = function() {
            jVn && bVn && (nt += qot), jVn && RVn && (nt += "ap"), jVn = 0, n[E][R]({}, $, tt, void 0), 
            t(tt, function() {
                var t, n;
                return (t = (n = function() {
                    this[""] = {};
                })[U])["setStatus"] = function(t, n) {
                    this[""][t] || (this[""][t] = 0), this[""][t]++;
                }, t["cleanStatus"] = function(t) {
                    this[""][t] && this[""][t]--, this[""][t] || delete this._timeMap[t];
                }, t["clearAllAbnormalStatusByType"] = function(t) {
                    delete this._timeMap[t];
                }, t["hasStatus"] = function(t) {
                    return !!this[""][t];
                }, n;
            }()), n[E][z]();
        }, i;
    }[Q](this)[H]();
});