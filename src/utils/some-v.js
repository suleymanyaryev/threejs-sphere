/* eslint-disable no-redeclare */
var L = Object.defineProperty;
var w = Object.getOwnPropertySymbols;
var I = Object.prototype.hasOwnProperty,
    M = Object.prototype.propertyIsEnumerable;
var _ = (a, e, t) =>
        e in a
            ? L(a, e, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: t,
              })
            : (a[e] = t),
    v = (a, e) => {
        for (var t in e || (e = {})) I.call(e, t) && _(a, t, e[t]);
        if (w) for (var t of w(e)) M.call(e, t) && _(a, t, e[t]);
        return a;
    };

export default v;
