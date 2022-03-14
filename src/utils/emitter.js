/* eslint-disable no-redeclare */
var Bf = { exports: {} },
    Oo = typeof Reflect == "object" ? Reflect : null,
    D_ =
        Oo && typeof Oo.apply == "function"
            ? Oo.apply
            : function (e, t, n) {
                  return Function.prototype.apply.call(e, t, n);
              },
    Jc;
Oo && typeof Oo.ownKeys == "function"
    ? (Jc = Oo.ownKeys)
    : Object.getOwnPropertySymbols
    ? (Jc = function (e) {
          return Object.getOwnPropertyNames(e).concat(
              Object.getOwnPropertySymbols(e)
          );
      })
    : (Jc = function (e) {
          return Object.getOwnPropertyNames(e);
      });
function AA(a) {
    console && console.warn && console.warn(a);
}
var O_ =
    Number.isNaN ||
    function (e) {
        return e !== e;
    };
function Lt() {
    Lt.init.call(this);
}
Bf.exports = Lt;
Bf.exports.once = PA;
Lt.EventEmitter = Lt;
Lt.prototype._events = void 0;
Lt.prototype._eventsCount = 0;
Lt.prototype._maxListeners = void 0;
var F_ = 10;
function Kc(a) {
    if (typeof a != "function")
        throw new TypeError(
            'The "listener" argument must be of type Function. Received type ' +
                typeof a
        );
}
Object.defineProperty(Lt, "defaultMaxListeners", {
    enumerable: !0,
    get: function () {
        return F_;
    },
    set: function (a) {
        if (typeof a != "number" || a < 0 || O_(a))
            throw new RangeError(
                'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
                    a +
                    "."
            );
        F_ = a;
    },
});
Lt.init = function () {
    (this._events === void 0 ||
        this._events === Object.getPrototypeOf(this)._events) &&
        ((this._events = Object.create(null)), (this._eventsCount = 0)),
        (this._maxListeners = this._maxListeners || void 0);
};
Lt.prototype.setMaxListeners = function (e) {
    if (typeof e != "number" || e < 0 || O_(e))
        throw new RangeError(
            'The value of "n" is out of range. It must be a non-negative number. Received ' +
                e +
                "."
        );
    return (this._maxListeners = e), this;
};
function N_(a) {
    return a._maxListeners === void 0
        ? Lt.defaultMaxListeners
        : a._maxListeners;
}
Lt.prototype.getMaxListeners = function () {
    return N_(this);
};
Lt.prototype.emit = function (e) {
    for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n]);
    var i = e === "error",
        r = this._events;
    if (r !== void 0) i = i && r.error === void 0;
    else if (!i) return !1;
    if (i) {
        var s;
        if ((t.length > 0 && (s = t[0]), s instanceof Error)) throw s;
        var l = new Error(
            "Unhandled error." + (s ? " (" + s.message + ")" : "")
        );
        throw ((l.context = s), l);
    }
    var c = r[e];
    if (c === void 0) return !1;
    if (typeof c == "function") D_(c, this, t);
    else
        for (var h = c.length, f = G_(c, h), n = 0; n < h; ++n)
            D_(f[n], this, t);
    return !0;
};
function B_(a, e, t, n) {
    var i, r, s;
    if (
        (Kc(t),
        (r = a._events),
        r === void 0
            ? ((r = a._events = Object.create(null)), (a._eventsCount = 0))
            : (r.newListener !== void 0 &&
                  (a.emit("newListener", e, t.listener ? t.listener : t),
                  (r = a._events)),
              (s = r[e])),
        s === void 0)
    )
        (s = r[e] = t), ++a._eventsCount;
    else if (
        (typeof s == "function"
            ? (s = r[e] = n ? [t, s] : [s, t])
            : n
            ? s.unshift(t)
            : s.push(t),
        (i = N_(a)),
        i > 0 && s.length > i && !s.warned)
    ) {
        s.warned = !0;
        var l = new Error(
            "Possible EventEmitter memory leak detected. " +
                s.length +
                " " +
                String(e) +
                " listeners added. Use emitter.setMaxListeners() to increase limit"
        );
        (l.name = "MaxListenersExceededWarning"),
            (l.emitter = a),
            (l.type = e),
            (l.count = s.length),
            AA(l);
    }
    return a;
}
Lt.prototype.addListener = function (e, t) {
    return B_(this, e, t, !1);
};
Lt.prototype.on = Lt.prototype.addListener;
Lt.prototype.prependListener = function (e, t) {
    return B_(this, e, t, !0);
};
function LA() {
    if (!this.fired)
        return (
            this.target.removeListener(this.type, this.wrapFn),
            (this.fired = !0),
            arguments.length === 0
                ? this.listener.call(this.target)
                : this.listener.apply(this.target, arguments)
        );
}
function U_(a, e, t) {
    var n = { fired: !1, wrapFn: void 0, target: a, type: e, listener: t },
        i = LA.bind(n);
    return (i.listener = t), (n.wrapFn = i), i;
}
Lt.prototype.once = function (e, t) {
    return Kc(t), this.on(e, U_(this, e, t)), this;
};
Lt.prototype.prependOnceListener = function (e, t) {
    return Kc(t), this.prependListener(e, U_(this, e, t)), this;
};
Lt.prototype.removeListener = function (e, t) {
    var n, i, r, s, l;
    if ((Kc(t), (i = this._events), i === void 0)) return this;
    if (((n = i[e]), n === void 0)) return this;
    if (n === t || n.listener === t)
        --this._eventsCount == 0
            ? (this._events = Object.create(null))
            : (delete i[e],
              i.removeListener &&
                  this.emit("removeListener", e, n.listener || t));
    else if (typeof n != "function") {
        for (r = -1, s = n.length - 1; s >= 0; s--)
            if (n[s] === t || n[s].listener === t) {
                (l = n[s].listener), (r = s);
                break;
            }
        if (r < 0) return this;
        r === 0 ? n.shift() : RA(n, r),
            n.length === 1 && (i[e] = n[0]),
            i.removeListener !== void 0 &&
                this.emit("removeListener", e, l || t);
    }
    return this;
};
Lt.prototype.off = Lt.prototype.removeListener;
Lt.prototype.removeAllListeners = function (e) {
    var t, n, i;
    if (((n = this._events), n === void 0)) return this;
    if (n.removeListener === void 0)
        return (
            arguments.length === 0
                ? ((this._events = Object.create(null)),
                  (this._eventsCount = 0))
                : n[e] !== void 0 &&
                  (--this._eventsCount == 0
                      ? (this._events = Object.create(null))
                      : delete n[e]),
            this
        );
    if (arguments.length === 0) {
        var r = Object.keys(n),
            s;
        for (i = 0; i < r.length; ++i)
            (s = r[i]), s !== "removeListener" && this.removeAllListeners(s);
        return (
            this.removeAllListeners("removeListener"),
            (this._events = Object.create(null)),
            (this._eventsCount = 0),
            this
        );
    }
    if (((t = n[e]), typeof t == "function")) this.removeListener(e, t);
    else if (t !== void 0)
        for (i = t.length - 1; i >= 0; i--) this.removeListener(e, t[i]);
    return this;
};
function z_(a, e, t) {
    var n = a._events;
    if (n === void 0) return [];
    var i = n[e];
    return i === void 0
        ? []
        : typeof i == "function"
        ? t
            ? [i.listener || i]
            : [i]
        : t
        ? CA(i)
        : G_(i, i.length);
}
Lt.prototype.listeners = function (e) {
    return z_(this, e, !0);
};
Lt.prototype.rawListeners = function (e) {
    return z_(this, e, !1);
};
Lt.listenerCount = function (a, e) {
    return typeof a.listenerCount == "function"
        ? a.listenerCount(e)
        : k_.call(a, e);
};
Lt.prototype.listenerCount = k_;
function k_(a) {
    var e = this._events;
    if (e !== void 0) {
        var t = e[a];
        if (typeof t == "function") return 1;
        if (t !== void 0) return t.length;
    }
    return 0;
}
Lt.prototype.eventNames = function () {
    return this._eventsCount > 0 ? Jc(this._events) : [];
};
function G_(a, e) {
    for (var t = new Array(e), n = 0; n < e; ++n) t[n] = a[n];
    return t;
}
function RA(a, e) {
    for (; e + 1 < a.length; e++) a[e] = a[e + 1];
    a.pop();
}
function CA(a) {
    for (var e = new Array(a.length), t = 0; t < e.length; ++t)
        e[t] = a[t].listener || a[t];
    return e;
}
function PA(a, e) {
    return new Promise(function (t, n) {
        function i(s) {
            a.removeListener(e, r), n(s);
        }
        function r() {
            typeof a.removeListener == "function" &&
                a.removeListener("error", i),
                t([].slice.call(arguments));
        }
        H_(a, e, r, { once: !0 }), e !== "error" && IA(a, i, { once: !0 });
    });
}
function IA(a, e, t) {
    typeof a.on == "function" && H_(a, "error", e, t);
}
function H_(a, e, t, n) {
    if (typeof a.on == "function") n.once ? a.once(e, t) : a.on(e, t);
    else if (typeof a.addEventListener == "function")
        a.addEventListener(e, function i(r) {
            n.once && a.removeEventListener(e, i), t(r);
        });
    else
        throw new TypeError(
            'The "emitter" argument must be of type EventEmitter. Received type ' +
                typeof a
        );
}

var MF = Bf.exports;

export default MF;
