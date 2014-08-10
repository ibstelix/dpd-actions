"no use strict";

function initBaseUrls(e) {
  require.tlns = e
}

function initSender() {
  var e = require(null, "ace/lib/event_emitter")
    .EventEmitter,
    t = require(null, "ace/lib/oop"),
    n = function () {};
  return function () {
    t.implement(this, e), this.callback = function (e, t) {
      postMessage({
        type: "call",
        id: t,
        data: e
      })
    }, this.emit = function (e, t) {
      postMessage({
        type: "event",
        name: e,
        data: t
      })
    }
  }.call(n.prototype), new n
}
var console = {
    log: function (e) {
      postMessage({
        type: "log",
        data: e
      })
    }
  },
  window = {
    console: console
  },
  normalizeModule = function (e, t) {
    if (t.indexOf("!") !== -1) {
      var n = t.split("!");
      return normalizeModule(e, n[0]) + "!" + normalizeModule(e, n[1])
    }
    if (t.charAt(0) == ".") {
      var r = e.split("/")
        .slice(0, -1)
        .join("/"),
        t = r + "/" + t;
      while (t.indexOf(".") !== -1 && i != t) var i = t,
        t = t.replace(/\/\.\//, "/")
        .replace(/[^\/]+\/\.\.\//, "")
    }
    return t
  },
  require = function (e, t) {
    var t = normalizeModule(e, t),
      n = require.modules[t];
    if (n) return n.initialized || (n.exports = n.factory()
      .exports, n.initialized = !0), n.exports;
    var r = t.split("/");
    r[0] = require.tlns[r[0]] || r[0];
    var i = r.join("/") + ".js";
    return require.id = t, importScripts(i), require(e, t)
  };
require.modules = {}, require.tlns = {};
var define = function (e, t, n) {
    arguments.length == 2 ? n = t : arguments.length == 1 && (n = e, e = require.id);
    if (e.indexOf("text!") === 0) return;
    var r = function (t, n) {
      return require(e, t, n)
    };
    require.modules[e] = {
      factory: function () {
        var e = {
            exports: {}
          },
          t = n(r, e.exports, e);
        return t && (e.exports = t), e
      }
    }
  },
  main, sender;
onmessage = function (e) {
  var t = e.data;
  if (t.command) main[t.command].apply(main, t.args);
  else if (t.init) {
    initBaseUrls(t.tlns), require(null, "ace/lib/fixoldbrowsers"), sender = initSender();
    var n = require(null, t.module)[t.classname];
    main = new n(sender)
  } else t.event && sender && sender._emit(t.event, t.data)
}, define("ace/lib/fixoldbrowsers", ["require", "exports", "module", "ace/lib/regexp", "ace/lib/es5-shim"], function (e, t, n) {
  e("./regexp"), e("./es5-shim")
}), define("ace/lib/regexp", ["require", "exports", "module"], function (e, t, n) {
  function o(e) {
    return (e.global ? "g" : "") + (e.ignoreCase ? "i" : "") + (e.multiline ? "m" : "") + (e.extended ? "x" : "") + (e.sticky ? "y" : "")
  }

  function u(e, t, n) {
    if (Array.prototype.indexOf) return e.indexOf(t, n);
    for (var r = n || 0; r < e.length; r++)
      if (e[r] === t) return r;
    return -1
  }
  var r = {
      exec: RegExp.prototype.exec,
      test: RegExp.prototype.test,
      match: String.prototype.match,
      replace: String.prototype.replace,
      split: String.prototype.split
    },
    i = r.exec.call(/()??/, "")[1] === undefined,
    s = function () {
      var e = /^/g;
      return r.test.call(e, ""), !e.lastIndex
    }();
  if (s && i) return;
  RegExp.prototype.exec = function (e) {
    var t = r.exec.apply(this, arguments),
      n, a;
    if (typeof e == "string" && t) {
      !i && t.length > 1 && u(t, "") > -1 && (a = RegExp(this.source, r.replace.call(o(this), "g", "")), r.replace.call(e.slice(t.index), a, function () {
        for (var e = 1; e < arguments.length - 2; e++) arguments[e] === undefined && (t[e] = undefined)
      }));
      if (this._xregexp && this._xregexp.captureNames)
        for (var f = 1; f < t.length; f++) n = this._xregexp.captureNames[f - 1], n && (t[n] = t[f]);
      !s && this.global && !t[0].length && this.lastIndex > t.index && this.lastIndex--
    }
    return t
  }, s || (RegExp.prototype.test = function (e) {
    var t = r.exec.call(this, e);
    return t && this.global && !t[0].length && this.lastIndex > t.index && this.lastIndex--, !!t
  })
}), define("ace/lib/es5-shim", ["require", "exports", "module"], function (e, t, n) {
  function v(e) {
    try {
      return Object.defineProperty(e, "sentinel", {}), "sentinel" in e
    } catch (t) {}
  }
  Function.prototype.bind || (Function.prototype.bind = function (t) {
    var n = this;
    if (typeof n != "function") throw new TypeError;
    var r = o.call(arguments, 1),
      i = function () {
        if (this instanceof i) {
          var e = function () {};
          e.prototype = n.prototype;
          var s = new e,
            u = n.apply(s, r.concat(o.call(arguments)));
          return u !== null && Object(u) === u ? u : s
        }
        return n.apply(t, r.concat(o.call(arguments)))
      };
    return i
  });
  var r = Function.prototype.call,
    i = Array.prototype,
    s = Object.prototype,
    o = i.slice,
    u = r.bind(s.toString),
    a = r.bind(s.hasOwnProperty),
    f, l, c, h, p;
  if (p = a(s, "__defineGetter__")) f = r.bind(s.__defineGetter__), l = r.bind(s.__defineSetter__), c = r.bind(s.__lookupGetter__), h = r.bind(s.__lookupSetter__);
  Array.isArray || (Array.isArray = function (t) {
    return u(t) == "[object Array]"
  }), Array.prototype.forEach || (Array.prototype.forEach = function (t) {
    var n = _(this),
      r = arguments[1],
      i = 0,
      s = n.length >>> 0;
    if (u(t) != "[object Function]") throw new TypeError;
    while (i < s) i in n && t.call(r, n[i], i, n), i++
  }), Array.prototype.map || (Array.prototype.map = function (t) {
    var n = _(this),
      r = n.length >>> 0,
      i = Array(r),
      s = arguments[1];
    if (u(t) != "[object Function]") throw new TypeError;
    for (var o = 0; o < r; o++) o in n && (i[o] = t.call(s, n[o], o, n));
    return i
  }), Array.prototype.filter || (Array.prototype.filter = function (t) {
    var n = _(this),
      r = n.length >>> 0,
      i = [],
      s = arguments[1];
    if (u(t) != "[object Function]") throw new TypeError;
    for (var o = 0; o < r; o++) o in n && t.call(s, n[o], o, n) && i.push(n[o]);
    return i
  }), Array.prototype.every || (Array.prototype.every = function (t) {
    var n = _(this),
      r = n.length >>> 0,
      i = arguments[1];
    if (u(t) != "[object Function]") throw new TypeError;
    for (var s = 0; s < r; s++)
      if (s in n && !t.call(i, n[s], s, n)) return !1;
    return !0
  }), Array.prototype.some || (Array.prototype.some = function (t) {
    var n = _(this),
      r = n.length >>> 0,
      i = arguments[1];
    if (u(t) != "[object Function]") throw new TypeError;
    for (var s = 0; s < r; s++)
      if (s in n && t.call(i, n[s], s, n)) return !0;
    return !1
  }), Array.prototype.reduce || (Array.prototype.reduce = function (t) {
    var n = _(this),
      r = n.length >>> 0;
    if (u(t) != "[object Function]") throw new TypeError;
    if (!r && arguments.length == 1) throw new TypeError;
    var i = 0,
      s;
    if (arguments.length >= 2) s = arguments[1];
    else
      do {
        if (i in n) {
          s = n[i++];
          break
        }
        if (++i >= r) throw new TypeError
      } while (!0);
    for (; i < r; i++) i in n && (s = t.call(void 0, s, n[i], i, n));
    return s
  }), Array.prototype.reduceRight || (Array.prototype.reduceRight = function (t) {
    var n = _(this),
      r = n.length >>> 0;
    if (u(t) != "[object Function]") throw new TypeError;
    if (!r && arguments.length == 1) throw new TypeError;
    var i, s = r - 1;
    if (arguments.length >= 2) i = arguments[1];
    else
      do {
        if (s in n) {
          i = n[s--];
          break
        }
        if (--s < 0) throw new TypeError
      } while (!0);
    do s in this && (i = t.call(void 0, i, n[s], s, n)); while (s--);
    return i
  }), Array.prototype.indexOf || (Array.prototype.indexOf = function (t) {
    var n = _(this),
      r = n.length >>> 0;
    if (!r) return -1;
    var i = 0;
    arguments.length > 1 && (i = O(arguments[1])), i = i >= 0 ? i : Math.max(0, r + i);
    for (; i < r; i++)
      if (i in n && n[i] === t) return i;
    return -1
  }), Array.prototype.lastIndexOf || (Array.prototype.lastIndexOf = function (t) {
    var n = _(this),
      r = n.length >>> 0;
    if (!r) return -1;
    var i = r - 1;
    arguments.length > 1 && (i = Math.min(i, O(arguments[1]))), i = i >= 0 ? i : r - Math.abs(i);
    for (; i >= 0; i--)
      if (i in n && t === n[i]) return i;
    return -1
  }), Object.getPrototypeOf || (Object.getPrototypeOf = function (t) {
    return t.__proto__ || (t.constructor ? t.constructor.prototype : s)
  });
  if (!Object.getOwnPropertyDescriptor) {
    var d = "Object.getOwnPropertyDescriptor called on a non-object: ";
    Object.getOwnPropertyDescriptor = function (t, n) {
      if (typeof t != "object" && typeof t != "function" || t === null) throw new TypeError(d + t);
      if (!a(t, n)) return;
      var r, i, o;
      r = {
        enumerable: !0,
        configurable: !0
      };
      if (p) {
        var u = t.__proto__;
        t.__proto__ = s;
        var i = c(t, n),
          o = h(t, n);
        t.__proto__ = u;
        if (i || o) return i && (r.get = i), o && (r.set = o), r
      }
      return r.value = t[n], r
    }
  }
  Object.getOwnPropertyNames || (Object.getOwnPropertyNames = function (t) {
    return Object.keys(t)
  }), Object.create || (Object.create = function (t, n) {
    var r;
    if (t === null) r = {
      __proto__: null
    };
    else {
      if (typeof t != "object") throw new TypeError("typeof prototype[" + typeof t + "] != 'object'");
      var i = function () {};
      i.prototype = t, r = new i, r.__proto__ = t
    }
    return n !== void 0 && Object.defineProperties(r, n), r
  });
  if (Object.defineProperty) {
    var m = v({}),
      g = typeof document == "undefined" || v(document.createElement("div"));
    if (!m || !g) var y = Object.defineProperty
  }
  if (!Object.defineProperty || y) {
    var b = "Property description must be an object: ",
      w = "Object.defineProperty called on non-object: ",
      E = "getters & setters can not be defined on this javascript engine";
    Object.defineProperty = function (t, n, r) {
      if (typeof t != "object" && typeof t != "function" || t === null) throw new TypeError(w + t);
      if (typeof r != "object" && typeof r != "function" || r === null) throw new TypeError(b + r);
      if (y) try {
        return y.call(Object, t, n, r)
      } catch (i) {}
      if (a(r, "value"))
        if (p && (c(t, n) || h(t, n))) {
          var o = t.__proto__;
          t.__proto__ = s, delete t[n], t[n] = r.value, t.__proto__ = o
        } else t[n] = r.value;
      else {
        if (!p) throw new TypeError(E);
        a(r, "get") && f(t, n, r.get), a(r, "set") && l(t, n, r.set)
      }
      return t
    }
  }
  Object.defineProperties || (Object.defineProperties = function (t, n) {
    for (var r in n) a(n, r) && Object.defineProperty(t, r, n[r]);
    return t
  }), Object.seal || (Object.seal = function (t) {
    return t
  }), Object.freeze || (Object.freeze = function (t) {
    return t
  });
  try {
    Object.freeze(function () {})
  } catch (S) {
    Object.freeze = function (t) {
      return function (n) {
        return typeof n == "function" ? n : t(n)
      }
    }(Object.freeze)
  }
  Object.preventExtensions || (Object.preventExtensions = function (t) {
    return t
  }), Object.isSealed || (Object.isSealed = function (t) {
    return !1
  }), Object.isFrozen || (Object.isFrozen = function (t) {
    return !1
  }), Object.isExtensible || (Object.isExtensible = function (t) {
    if (Object(t) === t) throw new TypeError;
    var n = "";
    while (a(t, n)) n += "?";
    t[n] = !0;
    var r = a(t, n);
    return delete t[n], r
  });
  if (!Object.keys) {
    var x = !0,
      T = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
      N = T.length;
    for (var C in {
      toString: null
    }) x = !1;
    Object.keys = function D(e) {
      if (typeof e != "object" && typeof e != "function" || e === null) throw new TypeError("Object.keys called on a non-object");
      var D = [];
      for (var t in e) a(e, t) && D.push(t);
      if (x)
        for (var n = 0, r = N; n < r; n++) {
          var i = T[n];
          a(e, i) && D.push(i)
        }
      return D
    }
  }
  if (!Date.prototype.toISOString || (new Date(-621987552e5))
    .toISOString()
    .indexOf("-000001") === -1) Date.prototype.toISOString = function () {
    var t, n, r, i;
    if (!isFinite(this)) throw new RangeError;
    t = [this.getUTCMonth() + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()], i = this.getUTCFullYear(), i = (i < 0 ? "-" : i > 9999 ? "+" : "") + ("00000" + Math.abs(i))
      .slice(0 <= i && i <= 9999 ? -4 : -6), n = t.length;
    while (n--) r = t[n], r < 10 && (t[n] = "0" + r);
    return i + "-" + t.slice(0, 2)
      .join("-") + "T" + t.slice(2)
      .join(":") + "." + ("000" + this.getUTCMilliseconds())
      .slice(-3) + "Z"
  };
  Date.now || (Date.now = function () {
    return (new Date)
      .getTime()
  }), Date.prototype.toJSON || (Date.prototype.toJSON = function (t) {
    if (typeof this.toISOString != "function") throw new TypeError;
    return this.toISOString()
  }), Date.parse("+275760-09-13T00:00:00.000Z") !== 864e13 && (Date = function (e) {
    var t = function i(t, n, r, s, o, u, a) {
        var f = arguments.length;
        if (this instanceof e) {
          var l = f == 1 && String(t) === t ? new e(i.parse(t)) : f >= 7 ? new e(t, n, r, s, o, u, a) : f >= 6 ? new e(t, n, r, s, o, u) : f >= 5 ? new e(t, n, r, s, o) : f >= 4 ? new e(t, n, r, s) : f >= 3 ? new e(t, n, r) : f >= 2 ? new e(t, n) : f >= 1 ? new e(t) : new e;
          return l.constructor = i, l
        }
        return e.apply(this, arguments)
      },
      n = new RegExp("^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:\\.(\\d{3}))?)?(?:Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$");
    for (var r in e) t[r] = e[r];
    return t.now = e.now, t.UTC = e.UTC, t.prototype = e.prototype, t.prototype.constructor = t, t.parse = function (r) {
      var i = n.exec(r);
      if (i) {
        i.shift();
        for (var s = 1; s < 7; s++) i[s] = +(i[s] || (s < 3 ? 1 : 0)), s == 1 && i[s]--;
        var o = +i.pop(),
          u = +i.pop(),
          a = i.pop(),
          f = 0;
        if (a) {
          if (u > 23 || o > 59) return NaN;
          f = (u * 60 + o) * 6e4 * (a == "+" ? -1 : 1)
        }
        var l = +i[0];
        return 0 <= l && l <= 99 ? (i[0] = l + 400, e.UTC.apply(this, i) + f - 126227808e5) : e.UTC.apply(this, i) + f
      }
      return e.parse.apply(this, arguments)
    }, t
  }(Date));
  var k = "  \n\f\r   ᠎             　\u2028\u2029﻿";
  if (!String.prototype.trim || k.trim()) {
    k = "[" + k + "]";
    var L = new RegExp("^" + k + k + "*"),
      A = new RegExp(k + k + "*$");
    String.prototype.trim = function () {
      return String(this)
        .replace(L, "")
        .replace(A, "")
    }
  }
  var O = function (e) {
      return e = +e, e !== e ? e = 0 : e !== 0 && e !== 1 / 0 && e !== -1 / 0 && (e = (e > 0 || -1) * Math.floor(Math.abs(e))), e
    },
    M = "a" [0] != "a",
    _ = function (e) {
      if (e == null) throw new TypeError;
      return M && typeof e == "string" && e ? e.split("") : Object(e)
    }
}), define("ace/lib/event_emitter", ["require", "exports", "module"], function (e, t, n) {
  var r = {};
  r._emit = r._dispatchEvent = function (e, t) {
    this._eventRegistry = this._eventRegistry || {}, this._defaultHandlers = this._defaultHandlers || {};
    var n = this._eventRegistry[e] || [],
      r = this._defaultHandlers[e];
    if (!n.length && !r) return;
    t = t || {}, t.type = e, t.stopPropagation || (t.stopPropagation = function () {
      this.propagationStopped = !0
    }), t.preventDefault || (t.preventDefault = function () {
      this.defaultPrevented = !0
    });
    for (var i = 0; i < n.length; i++) {
      n[i](t);
      if (t.propagationStopped) break
    }
    if (r && !t.defaultPrevented) return r(t)
  }, r.setDefaultHandler = function (e, t) {
    this._defaultHandlers = this._defaultHandlers || {};
    if (this._defaultHandlers[e]) throw new Error("The default handler for '" + e + "' is already set");
    this._defaultHandlers[e] = t
  }, r.on = r.addEventListener = function (e, t) {
    this._eventRegistry = this._eventRegistry || {};
    var n = this._eventRegistry[e];
    if (!n) var n = this._eventRegistry[e] = [];
    n.indexOf(t) == -1 && n.push(t)
  }, r.removeListener = r.removeEventListener = function (e, t) {
    this._eventRegistry = this._eventRegistry || {};
    var n = this._eventRegistry[e];
    if (!n) return;
    var r = n.indexOf(t);
    r !== -1 && n.splice(r, 1)
  }, r.removeAllListeners = function (e) {
    this._eventRegistry && (this._eventRegistry[e] = [])
  }, t.EventEmitter = r
}), define("ace/lib/oop", ["require", "exports", "module"], function (e, t, n) {
  t.inherits = function () {
    var e = function () {};
    return function (t, n) {
      e.prototype = n.prototype, t.super_ = n.prototype, t.prototype = new e, t.prototype.constructor = t
    }
  }(), t.mixin = function (e, t) {
    for (var n in t) e[n] = t[n]
  }, t.implement = function (e, n) {
    t.mixin(e, n)
  }
}), define("ace/mode/javascript_worker", ["require", "exports", "module", "ace/lib/oop", "ace/worker/mirror", "ace/worker/jshint", "ace/narcissus/parser"], function (e, t, n) {
  var r = e("../lib/oop"),
    i = e("../worker/mirror")
    .Mirror,
    s = e("../worker/jshint")
    .JSHINT,
    o = e("../narcissus/parser"),
    u = t.JavaScriptWorker = function (e) {
      i.call(this, e), this.setTimeout(500)
    };
  r.inherits(u, i),
  function () {
    this.onUpdate = function () {
      var e = this.doc.getValue();
      e = e.replace(/^#!.*\n/, "\n");
      try {
        o.parse(e)
      } catch (t) {
        var n = t.message.split(":"),
          r = n.pop()
          .trim(),
          i = parseInt(n.pop()
            .trim()) - 1;
        this.sender.emit("narcissus", {
          row: i,
          column: null,
          text: r,
          type: "error"
        });
        return
      } finally {}
      s(e, {
        undef: !1,
        onevar: !1,
        passfail: !1
      }), this.sender.emit("jslint", s.errors)
    }
  }.call(u.prototype)
}), define("ace/worker/mirror", ["require", "exports", "module", "ace/document", "ace/lib/lang"], function (e, t, n) {
  var r = e("../document")
    .Document,
    i = e("../lib/lang"),
    s = t.Mirror = function (e) {
      this.sender = e;
      var t = this.doc = new r(""),
        n = this.deferredUpdate = i.deferredCall(this.onUpdate.bind(this)),
        s = this;
      e.on("change", function (e) {
        t.applyDeltas([e.data]), n.schedule(s.$timeout)
      })
    };
  (function () {
    this.$timeout = 500, this.setTimeout = function (e) {
      this.$timeout = e
    }, this.setValue = function (e) {
      this.doc.setValue(e), this.deferredUpdate.schedule(this.$timeout)
    }, this.getValue = function (e) {
      this.sender.callback(this.doc.getValue(), e)
    }, this.onUpdate = function () {}
  })
    .call(s.prototype)
}), define("ace/document", ["require", "exports", "module", "ace/lib/oop", "ace/lib/event_emitter", "ace/range", "ace/anchor"], function (e, t, n) {
  var r = e("./lib/oop"),
    i = e("./lib/event_emitter")
    .EventEmitter,
    s = e("./range")
    .Range,
    o = e("./anchor")
    .Anchor,
    u = function (e) {
      this.$lines = [], e.length == 0 ? this.$lines = [""] : Array.isArray(e) ? this.insertLines(0, e) : this.insert({
        row: 0,
        column: 0
      }, e)
    };
  (function () {
    r.implement(this, i), this.setValue = function (e) {
      var t = this.getLength();
      this.remove(new s(0, 0, t, this.getLine(t - 1)
        .length)), this.insert({
        row: 0,
        column: 0
      }, e)
    }, this.getValue = function () {
      return this.getAllLines()
        .join(this.getNewLineCharacter())
    }, this.createAnchor = function (e, t) {
      return new o(this, e, t)
    }, "aaa".split(/a/)
      .length == 0 ? this.$split = function (e) {
        return e.replace(/\r\n|\r/g, "\n")
          .split("\n")
    } : this.$split = function (e) {
      return e.split(/\r\n|\r|\n/)
    }, this.$detectNewLine = function (e) {
      var t = e.match(/^.*?(\r\n|\r|\n)/m);
      t ? this.$autoNewLine = t[1] : this.$autoNewLine = "\n"
    }, this.getNewLineCharacter = function () {
      switch (this.$newLineMode) {
      case "windows":
        return "\r\n";
      case "unix":
        return "\n";
      case "auto":
        return this.$autoNewLine
      }
    }, this.$autoNewLine = "\n", this.$newLineMode = "auto", this.setNewLineMode = function (e) {
      if (this.$newLineMode === e) return;
      this.$newLineMode = e
    }, this.getNewLineMode = function () {
      return this.$newLineMode
    }, this.isNewLine = function (e) {
      return e == "\r\n" || e == "\r" || e == "\n"
    }, this.getLine = function (e) {
      return this.$lines[e] || ""
    }, this.getLines = function (e, t) {
      return this.$lines.slice(e, t + 1)
    }, this.getAllLines = function () {
      return this.getLines(0, this.getLength())
    }, this.getLength = function () {
      return this.$lines.length
    }, this.getTextRange = function (e) {
      if (e.start.row == e.end.row) return this.$lines[e.start.row].substring(e.start.column, e.end.column);
      var t = this.getLines(e.start.row + 1, e.end.row - 1);
      return t.unshift((this.$lines[e.start.row] || "")
        .substring(e.start.column)), t.push((this.$lines[e.end.row] || "")
        .substring(0, e.end.column)), t.join(this.getNewLineCharacter())
    }, this.$clipPosition = function (e) {
      var t = this.getLength();
      return e.row >= t && (e.row = Math.max(0, t - 1), e.column = this.getLine(t - 1)
        .length), e
    }, this.insert = function (e, t) {
      if (!t || t.length === 0) return e;
      e = this.$clipPosition(e), this.getLength() <= 1 && this.$detectNewLine(t);
      var n = this.$split(t),
        r = n.splice(0, 1)[0],
        i = n.length == 0 ? null : n.splice(n.length - 1, 1)[0];
      return e = this.insertInLine(e, r), i !== null && (e = this.insertNewLine(e), e = this.insertLines(e.row, n), e = this.insertInLine(e, i || "")), e
    }, this.insertLines = function (e, t) {
      if (t.length == 0) return {
        row: e,
        column: 0
      };
      if (t.length > 65535) {
        var n = this.insertLines(e, t.slice(65535));
        t = t.slice(0, 65535)
      }
      var r = [e, 0];
      r.push.apply(r, t), this.$lines.splice.apply(this.$lines, r);
      var i = new s(e, 0, e + t.length, 0),
        o = {
          action: "insertLines",
          range: i,
          lines: t
        };
      return this._emit("change", {
        data: o
      }), n || i.end
    }, this.insertNewLine = function (e) {
      e = this.$clipPosition(e);
      var t = this.$lines[e.row] || "";
      this.$lines[e.row] = t.substring(0, e.column), this.$lines.splice(e.row + 1, 0, t.substring(e.column, t.length));
      var n = {
          row: e.row + 1,
          column: 0
        },
        r = {
          action: "insertText",
          range: s.fromPoints(e, n),
          text: this.getNewLineCharacter()
        };
      return this._emit("change", {
        data: r
      }), n
    }, this.insertInLine = function (e, t) {
      if (t.length == 0) return e;
      var n = this.$lines[e.row] || "";
      this.$lines[e.row] = n.substring(0, e.column) + t + n.substring(e.column);
      var r = {
          row: e.row,
          column: e.column + t.length
        },
        i = {
          action: "insertText",
          range: s.fromPoints(e, r),
          text: t
        };
      return this._emit("change", {
        data: i
      }), r
    }, this.remove = function (e) {
      e.start = this.$clipPosition(e.start), e.end = this.$clipPosition(e.end);
      if (e.isEmpty()) return e.start;
      var t = e.start.row,
        n = e.end.row;
      if (e.isMultiLine()) {
        var r = e.start.column == 0 ? t : t + 1,
          i = n - 1;
        e.end.column > 0 && this.removeInLine(n, 0, e.end.column), i >= r && this.removeLines(r, i), r != t && (this.removeInLine(t, e.start.column, this.getLine(t)
          .length), this.removeNewLine(e.start.row))
      } else this.removeInLine(t, e.start.column, e.end.column);
      return e.start
    }, this.removeInLine = function (e, t, n) {
      if (t == n) return;
      var r = new s(e, t, e, n),
        i = this.getLine(e),
        o = i.substring(t, n),
        u = i.substring(0, t) + i.substring(n, i.length);
      this.$lines.splice(e, 1, u);
      var a = {
        action: "removeText",
        range: r,
        text: o
      };
      return this._emit("change", {
        data: a
      }), r.start
    }, this.removeLines = function (e, t) {
      var n = new s(e, 0, t + 1, 0),
        r = this.$lines.splice(e, t - e + 1),
        i = {
          action: "removeLines",
          range: n,
          nl: this.getNewLineCharacter(),
          lines: r
        };
      return this._emit("change", {
        data: i
      }), r
    }, this.removeNewLine = function (e) {
      var t = this.getLine(e),
        n = this.getLine(e + 1),
        r = new s(e, t.length, e + 1, 0),
        i = t + n;
      this.$lines.splice(e, 2, i);
      var o = {
        action: "removeText",
        range: r,
        text: this.getNewLineCharacter()
      };
      this._emit("change", {
        data: o
      })
    }, this.replace = function (e, t) {
      if (t.length == 0 && e.isEmpty()) return e.start;
      if (t == this.getTextRange(e)) return e.end;
      this.remove(e);
      if (t) var n = this.insert(e.start, t);
      else n = e.start;
      return n
    }, this.applyDeltas = function (e) {
      for (var t = 0; t < e.length; t++) {
        var n = e[t],
          r = s.fromPoints(n.range.start, n.range.end);
        n.action == "insertLines" ? this.insertLines(r.start.row, n.lines) : n.action == "insertText" ? this.insert(r.start, n.text) : n.action == "removeLines" ? this.removeLines(r.start.row, r.end.row - 1) : n.action == "removeText" && this.remove(r)
      }
    }, this.revertDeltas = function (e) {
      for (var t = e.length - 1; t >= 0; t--) {
        var n = e[t],
          r = s.fromPoints(n.range.start, n.range.end);
        n.action == "insertLines" ? this.removeLines(r.start.row, r.end.row - 1) : n.action == "insertText" ? this.remove(r) : n.action == "removeLines" ? this.insertLines(r.start.row, n.lines) : n.action == "removeText" && this.insert(r.start, n.text)
      }
    }
  })
    .call(u.prototype), t.Document = u
}), define("ace/range", ["require", "exports", "module"], function (e, t, n) {
  var r = function (e, t, n, r) {
    this.start = {
      row: e,
      column: t
    }, this.end = {
      row: n,
      column: r
    }
  };
  (function () {
    this.isEqual = function (e) {
      return this.start.row == e.start.row && this.end.row == e.end.row && this.start.column == e.start.column && this.end.column == e.end.column
    }, this.toString = function () {
      return "Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]"
    }, this.contains = function (e, t) {
      return this.compare(e, t) == 0
    }, this.compareRange = function (e) {
      var t, n = e.end,
        r = e.start;
      return t = this.compare(n.row, n.column), t == 1 ? (t = this.compare(r.row, r.column), t == 1 ? 2 : t == 0 ? 1 : 0) : t == -1 ? -2 : (t = this.compare(r.row, r.column), t == -1 ? -1 : t == 1 ? 42 : 0)
    }, this.comparePoint = function (e) {
      return this.compare(e.row, e.column)
    }, this.containsRange = function (e) {
      return this.comparePoint(e.start) == 0 && this.comparePoint(e.end) == 0
    }, this.intersects = function (e) {
      var t = this.compareRange(e);
      return t == -1 || t == 0 || t == 1
    }, this.isEnd = function (e, t) {
      return this.end.row == e && this.end.column == t
    }, this.isStart = function (e, t) {
      return this.start.row == e && this.start.column == t
    }, this.setStart = function (e, t) {
      typeof e == "object" ? (this.start.column = e.column, this.start.row = e.row) : (this.start.row = e, this.start.column = t)
    }, this.setEnd = function (e, t) {
      typeof e == "object" ? (this.end.column = e.column, this.end.row = e.row) : (this.end.row = e, this.end.column = t)
    }, this.inside = function (e, t) {
      return this.compare(e, t) == 0 ? this.isEnd(e, t) || this.isStart(e, t) ? !1 : !0 : !1
    }, this.insideStart = function (e, t) {
      return this.compare(e, t) == 0 ? this.isEnd(e, t) ? !1 : !0 : !1
    }, this.insideEnd = function (e, t) {
      return this.compare(e, t) == 0 ? this.isStart(e, t) ? !1 : !0 : !1
    }, this.compare = function (e, t) {
      return !this.isMultiLine() && e === this.start.row ? t < this.start.column ? -1 : t > this.end.column ? 1 : 0 : e < this.start.row ? -1 : e > this.end.row ? 1 : this.start.row === e ? t >= this.start.column ? 0 : -1 : this.end.row === e ? t <= this.end.column ? 0 : 1 : 0
    }, this.compareStart = function (e, t) {
      return this.start.row == e && this.start.column == t ? -1 : this.compare(e, t)
    }, this.compareEnd = function (e, t) {
      return this.end.row == e && this.end.column == t ? 1 : this.compare(e, t)
    }, this.compareInside = function (e, t) {
      return this.end.row == e && this.end.column == t ? 1 : this.start.row == e && this.start.column == t ? -1 : this.compare(e, t)
    }, this.clipRows = function (e, t) {
      if (this.end.row > t) var n = {
        row: t + 1,
        column: 0
      };
      if (this.start.row > t) var i = {
        row: t + 1,
        column: 0
      };
      if (this.start.row < e) var i = {
        row: e,
        column: 0
      };
      if (this.end.row < e) var n = {
        row: e,
        column: 0
      };
      return r.fromPoints(i || this.start, n || this.end)
    }, this.extend = function (e, t) {
      var n = this.compare(e, t);
      if (n == 0) return this;
      if (n == -1) var i = {
        row: e,
        column: t
      };
      else var s = {
        row: e,
        column: t
      };
      return r.fromPoints(i || this.start, s || this.end)
    }, this.isEmpty = function () {
      return this.start.row == this.end.row && this.start.column == this.end.column
    }, this.isMultiLine = function () {
      return this.start.row !== this.end.row
    }, this.clone = function () {
      return r.fromPoints(this.start, this.end)
    }, this.collapseRows = function () {
      return this.end.column == 0 ? new r(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0) : new r(this.start.row, 0, this.end.row, 0)
    }, this.toScreenRange = function (e) {
      var t = e.documentToScreenPosition(this.start),
        n = e.documentToScreenPosition(this.end);
      return new r(t.row, t.column, n.row, n.column)
    }
  })
    .call(r.prototype), r.fromPoints = function (e, t) {
      return new r(e.row, e.column, t.row, t.column)
  }, t.Range = r
}), define("ace/anchor", ["require", "exports", "module", "ace/lib/oop", "ace/lib/event_emitter"], function (e, t, n) {
  var r = e("./lib/oop"),
    i = e("./lib/event_emitter")
    .EventEmitter,
    s = t.Anchor = function (e, t, n) {
      this.document = e, typeof n == "undefined" ? this.setPosition(t.row, t.column) : this.setPosition(t, n), this.$onChange = this.onChange.bind(this), e.on("change", this.$onChange)
    };
  (function () {
    r.implement(this, i), this.getPosition = function () {
      return this.$clipPositionToDocument(this.row, this.column)
    }, this.getDocument = function () {
      return this.document
    }, this.onChange = function (e) {
      var t = e.data,
        n = t.range;
      if (n.start.row == n.end.row && n.start.row != this.row) return;
      if (n.start.row > this.row) return;
      if (n.start.row == this.row && n.start.column > this.column) return;
      var r = this.row,
        i = this.column;
      t.action === "insertText" ? n.start.row === r && n.start.column <= i ? n.start.row === n.end.row ? i += n.end.column - n.start.column : (i -= n.start.column, r += n.end.row - n.start.row) : n.start.row !== n.end.row && n.start.row < r && (r += n.end.row - n.start.row) : t.action === "insertLines" ? n.start.row <= r && (r += n.end.row - n.start.row) : t.action == "removeText" ? n.start.row == r && n.start.column < i ? n.end.column >= i ? i = n.start.column : i = Math.max(0, i - (n.end.column - n.start.column)) : n.start.row !== n.end.row && n.start.row < r ? (n.end.row == r && (i = Math.max(0, i - n.end.column) + n.start.column), r -= n.end.row - n.start.row) : n.end.row == r && (r -= n.end.row - n.start.row, i = Math.max(0, i - n.end.column) + n.start.column) : t.action == "removeLines" && n.start.row <= r && (n.end.row <= r ? r -= n.end.row - n.start.row : (r = n.start.row, i = 0)), this.setPosition(r, i, !0)
    }, this.setPosition = function (e, t, n) {
      var r;
      n ? r = {
        row: e,
        column: t
      } : r = this.$clipPositionToDocument(e, t);
      if (this.row == r.row && this.column == r.column) return;
      var i = {
        row: this.row,
        column: this.column
      };
      this.row = r.row, this.column = r.column, this._emit("change", {
        old: i,
        value: r
      })
    }, this.detach = function () {
      this.document.removeEventListener("change", this.$onChange)
    }, this.$clipPositionToDocument = function (e, t) {
      var n = {};
      return e >= this.document.getLength() ? (n.row = Math.max(0, this.document.getLength() - 1), n.column = this.document.getLine(n.row)
        .length) : e < 0 ? (n.row = 0, n.column = 0) : (n.row = e, n.column = Math.min(this.document.getLine(n.row)
        .length, Math.max(0, t))), t < 0 && (n.column = 0), n
    }
  })
    .call(s.prototype)
}), define("ace/lib/lang", ["require", "exports", "module"], function (e, t, n) {
  t.stringReverse = function (e) {
    return e.split("")
      .reverse()
      .join("")
  }, t.stringRepeat = function (e, t) {
    return (new Array(t + 1))
      .join(e)
  };
  var r = /^\s\s*/,
    i = /\s\s*$/;
  t.stringTrimLeft = function (e) {
    return e.replace(r, "")
  }, t.stringTrimRight = function (e) {
    return e.replace(i, "")
  }, t.copyObject = function (e) {
    var t = {};
    for (var n in e) t[n] = e[n];
    return t
  }, t.copyArray = function (e) {
    var t = [];
    for (var n = 0, r = e.length; n < r; n++) e[n] && typeof e[n] == "object" ? t[n] = this.copyObject(e[n]) : t[n] = e[n];
    return t
  }, t.deepCopy = function (e) {
    if (typeof e != "object") return e;
    var t = e.constructor();
    for (var n in e) typeof e[n] == "object" ? t[n] = this.deepCopy(e[n]) : t[n] = e[n];
    return t
  }, t.arrayToMap = function (e) {
    var t = {};
    for (var n = 0; n < e.length; n++) t[e[n]] = 1;
    return t
  }, t.arrayRemove = function (e, t) {
    for (var n = 0; n <= e.length; n++) t === e[n] && e.splice(n, 1)
  }, t.escapeRegExp = function (e) {
    return e.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
  }, t.getMatchOffsets = function (e, t) {
    var n = [];
    return e.replace(t, function (e) {
      n.push({
        offset: arguments[arguments.length - 2],
        length: e.length
      })
    }), n
  }, t.deferredCall = function (e) {
    var t = null,
      n = function () {
        t = null, e()
      },
      r = function (e) {
        return r.cancel(), t = setTimeout(n, e || 0), r
      };
    return r.schedule = r, r.call = function () {
      return this.cancel(), e(), r
    }, r.cancel = function () {
      return clearTimeout(t), t = null, r
    }, r
  }
}), define("ace/worker/jshint", ["require", "exports", "module"], function (e, t, n) {
  var r = function () {
    function tt() {}

    function nt(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t)
    }

    function rt(e, t) {
      i[e] === undefined && n[e] === undefined && at("Bad option: '" + e + "'.", t)
    }

    function it(e, t) {
      var n;
      for (n in t) nt(t, n) && (e[n] = t[n])
    }

    function st() {
      k.couch && it(L, o), k.rhino && it(L, _), k.prototypejs && it(L, M), k.node && (it(L, N), k.globalstrict = !0), k.devel && it(L, u), k.dojo && it(L, a), k.browser && it(L, s), k.nonstandard && it(L, B), k.jquery && it(L, y), k.mootools && it(L, x), k.wsh && it(L, X), k.esnext && z(), k.globalstrict && k.strict !== !1 && (k.strict = !0)
    }

    function ot(e, t, n) {
      var r = Math.floor(t / b.length * 100);
      throw {
        name: "JSHintError",
        line: t,
        character: n,
        message: e + " (" + r + "% scanned).",
        raw: e
      }
    }

    function ut(e, t, n, i) {
      return r.undefs.push([e, t, n, i])
    }

    function at(e, t, n, i, s, o) {
      var u, a, f;
      return t = t || T, t.id === "(end)" && (t = R), a = t.line || 0, u = t.from || 0, f = {
        id: "(error)",
        raw: e,
        evidence: b[a - 1] || "",
        line: a,
        character: u,
        a: n,
        b: i,
        c: s,
        d: o
      }, f.reason = e.supplant(f), r.errors.push(f), k.passfail && ot("Stopping. ", a, u), W += 1, W >= k.maxerr && ot("Too many errors.", a, u), f
    }

    function ft(e, t, n, r, i, s, o) {
      return at(e, {
        line: t,
        from: n
      }, r, i, s, o)
    }

    function lt(e, t, n, r, i, s) {
      var o = at(e, t, n, r, i, s)
    }

    function ct(e, t, n, r, i, s, o) {
      return lt(e, {
        line: t,
        from: n
      }, r, i, s, o)
    }

    function pt(e, t) {
      e === "hasOwnProperty" && at("'hasOwnProperty' is a really bad name."), nt(l, e) && !l["(global)"] && (l[e] === !0 ? k.latedef && at("'{a}' was used before it was defined.", T, e) : !k.shadow && t !== "exception" && at("'{a}' is already defined.", T, e)), l[e] = t, l["(global)"] ? (p[e] = l, nt(d, e) && (k.latedef && at("'{a}' was used before it was defined.", T, e), delete d[e])) : D[e] = l
    }

    function dt() {
      var e, t, r, i = T.value,
        s, o;
      switch (i) {
      case "*/":
        lt("Unbegun comment.");
        break;
      case "/*members":
      case "/*member":
        i = "/*members", S || (S = {}), t = S;
        break;
      case "/*jshint":
      case "/*jslint":
        t = k, r = n;
        break;
      case "/*global":
        t = L;
        break;
      default:
        lt("What?")
      }
      s = ht.token();
      e: for (;;) {
        for (;;) {
          if (s.type === "special" && s.value === "*/") break e;
          if (s.id !== "(endline)" && s.id !== ",") break;
          s = ht.token()
        }
        s.type !== "(string)" && s.type !== "(identifier)" && i !== "/*members" && lt("Bad option.", s), o = ht.token(), o.id === ":" ? (o = ht.token(), t === S && lt("Expected '{a}' and instead saw '{b}'.", s, "*/", ":"), i === "/*jshint" && rt(s.value, s), s.value !== "indent" || i !== "/*jshint" && i !== "/*jslint" ? s.value !== "maxerr" || i !== "/*jshint" && i !== "/*jslint" ? s.value !== "maxlen" || i !== "/*jshint" && i !== "/*jslint" ? s.value === "validthis" ? l["(global)"] ? lt("Option 'validthis' can't be used in a global scope.") : o.value === "true" || o.value === "false" ? t[s.value] = o.value === "true" : lt("Bad option value.", o) : o.value === "true" ? t[s.value] = !0 : o.value === "false" ? t[s.value] = !1 : lt("Bad option value.", o) : (e = +o.value, (typeof e != "number" || !isFinite(e) || e <= 0 || Math.floor(e) !== e) && lt("Expected a small integer and instead saw '{a}'.", o, o.value), t.maxlen = e) : (e = +o.value, (typeof e != "number" || !isFinite(e) || e <= 0 || Math.floor(e) !== e) && lt("Expected a small integer and instead saw '{a}'.", o, o.value), t.maxerr = e) : (e = +o.value, (typeof e != "number" || !isFinite(e) || e <= 0 || Math.floor(e) !== e) && lt("Expected a small integer and instead saw '{a}'.", o, o.value), t.white = !0, t.indent = e), s = ht.token()) : ((i === "/*jshint" || i === "/*jslint") && lt("Missing option value.", s), t[s.value] = !1, s = o)
      }
      r && st()
    }

    function vt(e) {
      var t = e || 0,
        n = 0,
        r;
      while (n <= t) r = w[n], r || (r = w[n] = ht.token()), n += 1;
      return r
    }

    function mt(t, n) {
      switch (R.id) {
      case "(number)":
        T.id === "." && at("A dot following a number can be confused with a decimal point.", R);
        break;
      case "-":
        (T.id === "-" || T.id === "--") && at("Confusing minusses.");
        break;
      case "+":
        (T.id === "+" || T.id === "++") && at("Confusing plusses.")
      }
      if (R.type === "(string)" || R.identifier) e = R.value;
      t && T.id !== t && (n ? T.id === "(end)" ? at("Unmatched '{a}'.", n, n.id) : at("Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.", T, t, n.id, n.line, T.value) : (T.type !== "(identifier)" || T.value !== t) && at("Expected '{a}' and instead saw '{b}'.", T, t, T.value)), O = R, R = T;
      for (;;) {
        T = w.shift() || ht.token();
        if (T.id === "(end)" || T.id === "(error)") return;
        if (T.type === "special") dt();
        else if (T.id !== "(endline)") break
      }
    }

    function gt(t, n) {
      var r, i = !1,
        s = !1;
      T.id === "(end)" && lt("Unexpected early end of program.", R), mt(), n && (e = "anonymous", l["(verb)"] = R.value);
      if (n === !0 && R.fud) r = R.fud();
      else {
        if (R.nud) r = R.nud();
        else {
          if (T.type === "(number)" && R.id === ".") return at("A leading decimal point can be confused with a dot: '.{a}'.", R, T.value), mt(), R;
          lt("Expected an identifier and instead saw '{a}'.", R, R.id)
        }
        while (t < T.lbp) i = R.value === "Array", s = R.value === "Object", mt(), i && R.id === "(" && T.id === ")" && at("Use the array literal notation [].", R), s && R.id === "(" && T.id === ")" && at("Use the object literal notation {}.", R), R.led ? r = R.led(r) : lt("Expected an operator and instead saw '{a}'.", R, R.id)
      }
      return r
    }

    function yt(e, t) {
      e = e || R, t = t || T, k.white && e.character !== t.from && e.line === t.line && (e.from += e.character - e.from, at("Unexpected space after '{a}'.", e, e.value))
    }

    function bt(e, t) {
      e = e || R, t = t || T, k.white && (e.character !== t.from || e.line !== t.line) && at("Unexpected space before '{a}'.", t, t.value)
    }

    function wt(e, t) {
      e = e || R, t = t || T, k.white && !e.comment && e.line === t.line && yt(e, t)
    }

    function Et(e, t) {
      k.white && (e = e || R, t = t || T, e.line === t.line && e.character === t.from && (e.from += e.character - e.from, at("Missing space after '{a}'.", e, e.value)))
    }

    function St(e, t) {
      e = e || R, t = t || T, !k.laxbreak && e.line !== t.line ? at("Bad line breaking before '{a}'.", t, t.id) : k.white && (e = e || R, t = t || T, e.character === t.from && (e.from += e.character - e.from, at("Missing space after '{a}'.", e, e.value)))
    }

    function xt(e) {
      var t;
      k.white && T.id !== "(end)" && (t = m + (e || 0), T.from !== t && at("Expected '{a}' to have an indentation at {b} instead at {c}.", T, T.value, t, T.from))
    }

    function Tt(e) {
      e = e || R, e.line !== T.line && at("Line breaking error '{a}'.", e, e.value)
    }

    function Nt() {
      R.line !== T.line ? k.laxcomma || (Nt.first && (at("Comma warnings can be turned off with 'laxcomma'"), Nt.first = !1), at("Bad line breaking before '{a}'.", R, T.id)) : !R.comment && R.character !== T.from && k.white && (R.from += R.character - R.from, at("Unexpected space after '{a}'.", R, R.value)), mt(","), Et(R, T)
    }

    function Ct(e, t) {
      var n = I[e];
      if (!n || typeof n != "object") I[e] = n = {
        id: e,
        lbp: t,
        value: e
      };
      return n
    }

    function kt(e) {
      return Ct(e, 0)
    }

    function Lt(e, t) {
      var n = kt(e);
      return n.identifier = n.reserved = !0, n.fud = t, n
    }

    function At(e, t) {
      var n = Lt(e, t);
      return n.block = !0, n
    }

    function Ot(e) {
      var t = e.id.charAt(0);
      if (t >= "a" && t <= "z" || t >= "A" && t <= "Z") e.identifier = e.reserved = !0;
      return e
    }

    function Mt(e, t) {
      var n = Ct(e, 150);
      return Ot(n), n.nud = typeof t == "function" ? t : function () {
        this.right = gt(150), this.arity = "unary";
        if (this.id === "++" || this.id === "--") k.plusplus ? at("Unexpected use of '{a}'.", this, this.id) : (!this.right.identifier || this.right.reserved) && this.right.id !== "." && this.right.id !== "[" && at("Bad operand.", this);
        return this
      }, n
    }

    function _t(e, t) {
      var n = kt(e);
      return n.type = e, n.nud = t, n
    }

    function Dt(e, t) {
      var n = _t(e, t);
      return n.identifier = n.reserved = !0, n
    }

    function Pt(e, t) {
      return Dt(e, function () {
        return typeof t == "function" && t(this), this
      })
    }

    function Ht(e, t, n, r) {
      var i = Ct(e, n);
      return Ot(i), i.led = function (i) {
        return r || (St(O, R), Et(R, T)), e === "in" && i.id === "!" && at("Confusing use of '{a}'.", i, "!"), typeof t == "function" ? t(i, this) : (this.left = i, this.right = gt(n), this)
      }, i
    }

    function Bt(e, t) {
      var n = Ct(e, 100);
      return n.led = function (e) {
        St(O, R), Et(R, T);
        var n = gt(100);
        return e && e.id === "NaN" || n && n.id === "NaN" ? at("Use the isNaN function to compare with NaN.", this) : t && t.apply(this, [e, n]), e.id === "!" && at("Confusing use of '{a}'.", e, "!"), n.id === "!" && at("Confusing use of '{a}'.", n, "!"), this.left = e, this.right = n, this
      }, n
    }

    function jt(e) {
      return e && (e.type === "(number)" && +e.value === 0 || e.type === "(string)" && e.value === "" || e.type === "null" && !k.eqnull || e.type === "true" || e.type === "false" || e.type === "undefined")
    }

    function Ft(e, t) {
      return Ct(e, 20)
        .exps = !0, Ht(e, function (e, t) {
          var n;
          t.left = e, L[e.value] === !1 && D[e.value]["(global)"] === !0 ? at("Read only.", e) : e["function"] && at("'{a}' is a function.", e, e.value);
          if (e) {
            k.esnext && l[e.value] === "const" && at("Attempting to override '{a}' which is a constant", e, e.value);
            if (e.id === "." || e.id === "[") return (!e.left || e.left.value === "arguments") && at("Bad assignment.", t), t.right = gt(19), t;
            if (e.identifier && !e.reserved) return l[e.value] === "exception" && at("Do not assign to the exception parameter.", e), t.right = gt(19), t;
            e === I["function"] && at("Expected an identifier in an assignment and instead saw a function invocation.", R)
          }
          lt("Bad assignment.", t)
        }, 20)
    }

    function It(e, t, n) {
      var r = Ct(e, n);
      return Ot(r), r.led = typeof t == "function" ? t : function (e) {
        return k.bitwise && at("Unexpected use of '{a}'.", this, this.id), this.left = e, this.right = gt(n), this
      }, r
    }

    function qt(e) {
      return Ct(e, 20)
        .exps = !0, Ht(e, function (e, t) {
          k.bitwise && at("Unexpected use of '{a}'.", t, t.id), Et(O, R), Et(R, T);
          if (e) return e.id === "." || e.id === "[" || e.identifier && !e.reserved ? (gt(19), t) : (e === I["function"] && at("Expected an identifier in an assignment, and instead saw a function invocation.", R), t);
          lt("Bad assignment.", t)
        }, 20)
    }

    function Rt(e, t) {
      var n = Ct(e, 150);
      return n.led = function (e) {
        return k.plusplus ? at("Unexpected use of '{a}'.", this, this.id) : (!e.identifier || e.reserved) && e.id !== "." && e.id !== "[" && at("Bad operand.", this), this.left = e, this
      }, n
    }

    function Ut(e) {
      if (T.identifier) return mt(), R.reserved && !k.es5 && (!e || R.value !== "undefined") && at("Expected an identifier and instead saw '{a}' (a reserved word).", R, R.id), R.value
    }

    function zt(e) {
      var t = Ut(e);
      if (t) return t;
      R.id === "function" && T.id === "(" ? at("Missing name in function declaration.") : lt("Expected an identifier and instead saw '{a}'.", T, T.value)
    }

    function Wt(e) {
      var t = 0,
        n;
      if (T.id !== ";" || C) return;
      for (;;) {
        n = vt(t);
        if (n.reach) return;
        if (n.id !== "(endline)") {
          if (n.id === "function") {
            if (!k.latedef) break;
            at("Inner functions should be listed at the top of the outer function.", n);
            break
          }
          at("Unreachable '{a}' after '{b}'.", n, n.value, e);
          break
        }
        t += 1
      }
    }

    function Xt(e) {
      var t = m,
        n, r = D,
        i = T;
      if (i.id === ";") {
        mt(";");
        return
      }
      i.identifier && !i.reserved && vt()
        .id === ":" && (mt(), mt(":"), D = Object.create(r), pt(i.value, "label"), T.labelled || at("Label '{a}' on {b} statement.", T, i.value, T.value), Z.test(i.value + ":") && at("Label '{a}' looks like a javascript url.", i, i.value), T.label = i.value, i = T), e || xt(), n = gt(0, !0);
      if (!i.block) {
        !k.expr && (!n || !n.exps) ? at("Expected an assignment or function call and instead saw an expression.", R) : k.nonew && n.id === "(" && n.left.id === "new" && at("Do not use 'new' for side effects.");
        if (T.id === ",") return Nt();
        T.id !== ";" ? k.asi || (!k.lastsemic || T.id !== "}" || T.line !== R.line) && ft("Missing semicolon.", R.line, R.character) : (yt(R, T), mt(";"), Et(R, T))
      }
      return m = t, D = r, n
    }

    function Vt(e) {
      var t = [],
        n, r;
      while (!T.reach && T.id !== "(end)") T.id === ";" ? (r = vt(), (!r || r.id !== "(") && at("Unnecessary semicolon."), mt(";")) : t.push(Xt(e === T.line));
      return t
    }

    function $t() {
      var e, t, n;
      for (;;) {
        if (T.id === "(string)") {
          t = vt(0);
          if (t.id === "(endline)") {
            e = 1;
            do n = vt(e), e += 1; while (n.id === "(endline)");
            if (n.id !== ";") {
              if (n.id !== "(string)" && n.id !== "(number)" && n.id !== "(regexp)" && n.identifier !== !0 && n.id !== "}") break;
              at("Missing semicolon.", T)
            } else t = n
          } else if (t.id === "}") at("Missing semicolon.", t);
          else if (t.id !== ";") break;
          xt(), mt(), F[R.value] && at('Unnecessary directive "{a}".', R, R.value), R.value === "use strict" && (k.newcap = !0, k.undef = !0), F[R.value] = !0, t.id === ";" && mt(";");
          continue
        }
        break
      }
    }

    function Jt(e, t, n) {
      var r, i = v,
        s = m,
        o, u = D,
        a, f, c;
      v = e;
      if (!e || !k.funcscope) D = Object.create(D);
      Et(R, T), a = T;
      if (T.id === "{") {
        mt("{"), f = R.line;
        if (T.id !== "}") {
          m += k.indent;
          while (!e && T.from > m) m += k.indent;
          if (n) {
            o = {};
            for (c in F) nt(F, c) && (o[c] = F[c]);
            $t(), k.strict && l["(context)"]["(global)"] && !o["use strict"] && !F["use strict"] && at('Missing "use strict" statement.')
          }
          r = Vt(f), n && (F = o), m -= k.indent, f !== T.line && xt()
        } else f !== T.line && xt();
        mt("}", a), m = s
      } else e ? ((!t || k.curly) && at("Expected '{a}' and instead saw '{b}'.", T, "{", T.value), C = !0, m += k.indent, r = [Xt(T.line === R.line)], m -= k.indent, C = !1) : lt("Expected '{a}' and instead saw '{b}'.", T, "{", T.value);
      l["(verb)"] = null;
      if (!e || !k.funcscope) D = u;
      return v = i, e && k.noempty && (!r || r.length === 0) && at("Empty block."), r
    }

    function Kt(e) {
      S && typeof S[e] != "boolean" && at("Unexpected /*member '{a}'.", R, e), typeof E[e] == "number" ? E[e] += 1 : E[e] = 1
    }

    function Qt(e) {
      var t = e.value,
        n = e.line,
        r = d[t];
      typeof r == "function" && (r = !1), r ? r[r.length - 1] !== n && r.push(n) : (r = [n], d[t] = r)
    }

    function Gt() {
      var e = Ut(!0);
      return e || (T.id === "(string)" ? (e = T.value, mt()) : T.id === "(number)" && (e = T.value.toString(), mt())), e
    }

    function Yt() {
      var e, t = T,
        n = [];
      mt("("), wt();
      if (T.id === ")") {
        mt(")");
        return
      }
      for (;;) {
        e = zt(!0), n.push(e), pt(e, "parameter");
        if (T.id !== ",") return mt(")", t), wt(O, R), n;
        Nt()
      }
    }

    function Zt(t, n) {
      var r, i = k,
        s = D;
      return k = Object.create(k), D = Object.create(D), l = {
        "(name)": t || '"' + e + '"',
        "(line)": T.line,
        "(context)": l,
        "(breakage)": 0,
        "(loopage)": 0,
        "(scope)": D,
        "(statement)": n
      }, r = l, R.funct = l, h.push(l), t && pt(t, "function"), l["(params)"] = Yt(), Jt(!1, !1, !0), D = s, k = i, l["(last)"] = R.line, l = l["(context)"], r
    }

    function tn() {
      function e() {
        var e = {},
          t = T;
        mt("{");
        if (T.id !== "}")
          for (;;) {
            if (T.id === "(end)") lt("Missing '}' to match '{' from line {a}.", T, t.line);
            else {
              if (T.id === "}") {
                at("Unexpected comma.", R);
                break
              }
              T.id === "," ? lt("Unexpected comma.", T) : T.id !== "(string)" && at("Expected a string and instead saw {a}.", T, T.value)
            }
            e[T.value] === !0 ? at("Duplicate key '{a}'.", T, T.value) : T.value === "__proto__" && !k.proto || T.value === "__iterator__" && !k.iterator ? at("The '{a}' key may produce unexpected results.", T, T.value) : e[T.value] = !0, mt(), mt(":"), tn();
            if (T.id !== ",") break;
            mt(",")
          }
        mt("}")
      }

      function t() {
        var e = T;
        mt("[");
        if (T.id !== "]")
          for (;;) {
            if (T.id === "(end)") lt("Missing ']' to match '[' from line {a}.", T, e.line);
            else {
              if (T.id === "]") {
                at("Unexpected comma.", R);
                break
              }
              T.id === "," && lt("Unexpected comma.", T)
            }
            tn();
            if (T.id !== ",") break;
            mt(",")
          }
        mt("]")
      }
      switch (T.id) {
      case "{":
        e();
        break;
      case "[":
        t();
        break;
      case "true":
      case "false":
      case "null":
      case "(number)":
      case "(string)":
        mt();
        break;
      case "-":
        mt("-"), R.character !== T.from && at("Unexpected space after '-'.", R), yt(R, T), mt("(number)");
        break;
      default:
        lt("Expected a JSON value.", T)
      }
    }
    var e, t = {
        "<": !0,
        "<=": !0,
        "==": !0,
        "===": !0,
        "!==": !0,
        "!=": !0,
        ">": !0,
        ">=": !0,
        "+": !0,
        "-": !0,
        "*": !0,
        "/": !0,
        "%": !0
      },
      n = {
        asi: !0,
        bitwise: !0,
        boss: !0,
        browser: !0,
        couch: !0,
        curly: !0,
        debug: !0,
        devel: !0,
        dojo: !0,
        eqeqeq: !0,
        eqnull: !0,
        es5: !0,
        esnext: !0,
        evil: !0,
        expr: !0,
        forin: !0,
        funcscope: !0,
        globalstrict: !0,
        immed: !0,
        iterator: !0,
        jquery: !0,
        lastsemic: !0,
        latedef: !0,
        laxbreak: !0,
        laxcomma: !0,
        loopfunc: !0,
        mootools: !0,
        multistr: !0,
        newcap: !0,
        noarg: !0,
        node: !0,
        noempty: !0,
        nonew: !0,
        nonstandard: !0,
        nomen: !0,
        onevar: !0,
        onecase: !0,
        passfail: !0,
        plusplus: !0,
        proto: !0,
        prototypejs: !0,
        regexdash: !0,
        regexp: !0,
        rhino: !0,
        undef: !0,
        scripturl: !0,
        shadow: !0,
        smarttabs: !0,
        strict: !0,
        sub: !0,
        supernew: !0,
        trailing: !0,
        validthis: !0,
        withstmt: !0,
        white: !0,
        wsh: !0
      },
      i = {
        maxlen: !1,
        indent: !1,
        maxerr: !1,
        predef: !1
      },
      s = {
        ArrayBuffer: !1,
        ArrayBufferView: !1,
        Audio: !1,
        addEventListener: !1,
        applicationCache: !1,
        atob: !1,
        blur: !1,
        btoa: !1,
        clearInterval: !1,
        clearTimeout: !1,
        close: !1,
        closed: !1,
        DataView: !1,
        DOMParser: !1,
        defaultStatus: !1,
        document: !1,
        event: !1,
        FileReader: !1,
        Float32Array: !1,
        Float64Array: !1,
        FormData: !1,
        focus: !1,
        frames: !1,
        getComputedStyle: !1,
        HTMLElement: !1,
        HTMLAnchorElement: !1,
        HTMLBaseElement: !1,
        HTMLBlockquoteElement: !1,
        HTMLBodyElement: !1,
        HTMLBRElement: !1,
        HTMLButtonElement: !1,
        HTMLCanvasElement: !1,
        HTMLDirectoryElement: !1,
        HTMLDivElement: !1,
        HTMLDListElement: !1,
        HTMLFieldSetElement: !1,
        HTMLFontElement: !1,
        HTMLFormElement: !1,
        HTMLFrameElement: !1,
        HTMLFrameSetElement: !1,
        HTMLHeadElement: !1,
        HTMLHeadingElement: !1,
        HTMLHRElement: !1,
        HTMLHtmlElement: !1,
        HTMLIFrameElement: !1,
        HTMLImageElement: !1,
        HTMLInputElement: !1,
        HTMLIsIndexElement: !1,
        HTMLLabelElement: !1,
        HTMLLayerElement: !1,
        HTMLLegendElement: !1,
        HTMLLIElement: !1,
        HTMLLinkElement: !1,
        HTMLMapElement: !1,
        HTMLMenuElement: !1,
        HTMLMetaElement: !1,
        HTMLModElement: !1,
        HTMLObjectElement: !1,
        HTMLOListElement: !1,
        HTMLOptGroupElement: !1,
        HTMLOptionElement: !1,
        HTMLParagraphElement: !1,
        HTMLParamElement: !1,
        HTMLPreElement: !1,
        HTMLQuoteElement: !1,
        HTMLScriptElement: !1,
        HTMLSelectElement: !1,
        HTMLStyleElement: !1,
        HTMLTableCaptionElement: !1,
        HTMLTableCellElement: !1,
        HTMLTableColElement: !1,
        HTMLTableElement: !1,
        HTMLTableRowElement: !1,
        HTMLTableSectionElement: !1,
        HTMLTextAreaElement: !1,
        HTMLTitleElement: !1,
        HTMLUListElement: !1,
        HTMLVideoElement: !1,
        history: !1,
        Int16Array: !1,
        Int32Array: !1,
        Int8Array: !1,
        Image: !1,
        length: !1,
        localStorage: !1,
        location: !1,
        MessageChannel: !1,
        MessageEvent: !1,
        MessagePort: !1,
        moveBy: !1,
        moveTo: !1,
        name: !1,
        navigator: !1,
        onbeforeunload: !0,
        onblur: !0,
        onerror: !0,
        onfocus: !0,
        onload: !0,
        onresize: !0,
        onunload: !0,
        open: !1,
        openDatabase: !1,
        opener: !1,
        Option: !1,
        parent: !1,
        print: !1,
        removeEventListener: !1,
        resizeBy: !1,
        resizeTo: !1,
        screen: !1,
        scroll: !1,
        scrollBy: !1,
        scrollTo: !1,
        sessionStorage: !1,
        setInterval: !1,
        setTimeout: !1,
        SharedWorker: !1,
        status: !1,
        top: !1,
        Uint16Array: !1,
        Uint32Array: !1,
        Uint8Array: !1,
        WebSocket: !1,
        window: !1,
        Worker: !1,
        XMLHttpRequest: !1,
        XMLSerializer: !1,
        XPathEvaluator: !1,
        XPathException: !1,
        XPathExpression: !1,
        XPathNamespace: !1,
        XPathNSResolver: !1,
        XPathResult: !1
      },
      o = {
        require: !1,
        respond: !1,
        getRow: !1,
        emit: !1,
        send: !1,
        start: !1,
        sum: !1,
        log: !1,
        exports: !1,
        module: !1,
        provides: !1
      },
      u = {
        alert: !1,
        confirm: !1,
        console: !1,
        Debug: !1,
        opera: !1,
        prompt: !1
      },
      a = {
        dojo: !1,
        dijit: !1,
        dojox: !1,
        define: !1,
        require: !1
      },
      f = {
        "\b": "\\b",
        "  ": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "/": "\\/",
        "\\": "\\\\"
      },
      l, c = ["closure", "exception", "global", "label", "outer", "unused", "var"],
      h, p, d, v, m, g, y = {
        $: !1,
        jQuery: !1
      },
      b, w, E, S, x = {
        $: !1,
        $$: !1,
        Assets: !1,
        Browser: !1,
        Chain: !1,
        Class: !1,
        Color: !1,
        Cookie: !1,
        Core: !1,
        Document: !1,
        DomReady: !1,
        DOMReady: !1,
        Drag: !1,
        Element: !1,
        Elements: !1,
        Event: !1,
        Events: !1,
        Fx: !1,
        Group: !1,
        Hash: !1,
        HtmlTable: !1,
        Iframe: !1,
        IframeShim: !1,
        InputValidator: !1,
        instanceOf: !1,
        Keyboard: !1,
        Locale: !1,
        Mask: !1,
        MooTools: !1,
        Native: !1,
        Options: !1,
        OverText: !1,
        Request: !1,
        Scroller: !1,
        Slick: !1,
        Slider: !1,
        Sortables: !1,
        Spinner: !1,
        Swiff: !1,
        Tips: !1,
        Type: !1,
        typeOf: !1,
        URI: !1,
        Window: !1
      },
      T, N = {
        __filename: !1,
        __dirname: !1,
        Buffer: !1,
        console: !1,
        exports: !1,
        GLOBAL: !1,
        global: !1,
        module: !1,
        process: !1,
        require: !1,
        setTimeout: !1,
        clearTimeout: !1,
        setInterval: !1,
        clearInterval: !1
      },
      C, k, L, A, O, M = {
        $: !1,
        $$: !1,
        $A: !1,
        $F: !1,
        $H: !1,
        $R: !1,
        $break: !1,
        $continue: !1,
        $w: !1,
        Abstract: !1,
        Ajax: !1,
        Class: !1,
        Enumerable: !1,
        Element: !1,
        Event: !1,
        Field: !1,
        Form: !1,
        Hash: !1,
        Insertion: !1,
        ObjectRange: !1,
        PeriodicalExecuter: !1,
        Position: !1,
        Prototype: !1,
        Selector: !1,
        Template: !1,
        Toggle: !1,
        Try: !1,
        Autocompleter: !1,
        Builder: !1,
        Control: !1,
        Draggable: !1,
        Draggables: !1,
        Droppables: !1,
        Effect: !1,
        Sortable: !1,
        SortableObserver: !1,
        Sound: !1,
        Scriptaculous: !1
      },
      _ = {
        defineClass: !1,
        deserialize: !1,
        gc: !1,
        help: !1,
        importPackage: !1,
        java: !1,
        load: !1,
        loadClass: !1,
        print: !1,
        quit: !1,
        readFile: !1,
        readUrl: !1,
        runCommand: !1,
        seal: !1,
        serialize: !1,
        spawn: !1,
        sync: !1,
        toint32: !1,
        version: !1
      },
      D, P, H = {
        Array: !1,
        Boolean: !1,
        Date: !1,
        decodeURI: !1,
        decodeURIComponent: !1,
        encodeURI: !1,
        encodeURIComponent: !1,
        Error: !1,
        eval: !1,
        EvalError: !1,
        Function: !1,
        hasOwnProperty: !1,
        isFinite: !1,
        isNaN: !1,
        JSON: !1,
        Math: !1,
        Number: !1,
        Object: !1,
        parseInt: !1,
        parseFloat: !1,
        RangeError: !1,
        ReferenceError: !1,
        RegExp: !1,
        String: !1,
        SyntaxError: !1,
        TypeError: !1,
        URIError: !1
      },
      B = {
        escape: !1,
        unescape: !1
      },
      j = {
        E: !0,
        LN2: !0,
        LN10: !0,
        LOG2E: !0,
        LOG10E: !0,
        MAX_VALUE: !0,
        MIN_VALUE: !0,
        NEGATIVE_INFINITY: !0,
        PI: !0,
        POSITIVE_INFINITY: !0,
        SQRT1_2: !0,
        SQRT2: !0
      },
      F, I = {},
      q, R, U, z, W, X = {
        ActiveXObject: !0,
        Enumerator: !0,
        GetObject: !0,
        ScriptEngine: !0,
        ScriptEngineBuildVersion: !0,
        ScriptEngineMajorVersion: !0,
        ScriptEngineMinorVersion: !0,
        VBArray: !0,
        WSH: !0,
        WScript: !0,
        XDomainRequest: !0
      },
      V, $, J, K, Q, G, Y, Z, et;
    (function () {
      V = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i, $ = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/, J = /^\s*([(){}\[.,:;'"~\?\]#@]|==?=?|\/(\*(jshint|jslint|members?|global)?|=|\/)?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|%=?|&[&=]?|\|[|=]?|>>?>?=?|<([\/=!]|\!(\[|--)?|<=?)?|\^=?|\!=?=?|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+([xX][0-9a-fA-F]+|\.[0-9]*)?([eE][+\-]?[0-9]+)?)/, K = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/, Q = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, G = /\*\/|\/\*/, Y = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/, Z = /^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i, et = /^\s*\/\*\s*falls\sthrough\s*\*\/\s*$/
    })(), typeof Array.isArray != "function" && (Array.isArray = function (e) {
      return Object.prototype.toString.apply(e) === "[object Array]"
    }), typeof Object.create != "function" && (Object.create = function (e) {
      return tt.prototype = e, new tt
    }), typeof Object.keys != "function" && (Object.keys = function (e) {
      var t = [],
        n;
      for (n in e) nt(e, n) && t.push(n);
      return t
    }), typeof String.prototype.entityify != "function" && (String.prototype.entityify = function () {
      return this.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
    }), typeof String.prototype.isAlpha != "function" && (String.prototype.isAlpha = function () {
      return this >= "a" && this <= "z￿" || this >= "A" && this <= "Z￿"
    }), typeof String.prototype.isDigit != "function" && (String.prototype.isDigit = function () {
      return this >= "0" && this <= "9"
    }), typeof String.prototype.supplant != "function" && (String.prototype.supplant = function (e) {
      return this.replace(/\{([^{}]*)\}/g, function (t, n) {
        var r = e[n];
        return typeof r == "string" || typeof r == "number" ? r : t
      })
    }), typeof String.prototype.name != "function" && (String.prototype.name = function () {
      return Y.test(this) ? this : K.test(this) ? '"' + this.replace(Q, function (e) {
        var t = f[e];
        return t ? t : "\\u" + ("0000" + e.charCodeAt()
            .toString(16))
          .slice(-4)
      }) + '"' : '"' + this + '"'
    });
    var ht = function () {
      function s() {
        var e, n;
        return r >= b.length ? !1 : (t = 1, i = b[r], r += 1, k.smarttabs ? e = i.search(/ \t/) : e = i.search(/ \t|\t /), e >= 0 && ft("Mixed spaces and tabs.", r, e + 1), i = i.replace(/\t/g, q), e = i.search($), e >= 0 && ft("Unsafe character.", r, e), k.maxlen && k.maxlen < i.length && ft("Line too long.", r, i.length), n = k.trailing && i.match(/^(.*?)\s+$/), n && !/^\s+$/.test(i) && ft("Trailing whitespace.", r, n[1].length + 1), !0)
      }

      function o(e, i) {
        var s, o;
        return e === "(color)" || e === "(range)" ? o = {
          type: e
        } : e === "(punctuator)" || e === "(identifier)" && nt(I, i) ? o = I[i] || I["(error)"] : o = I[e], o = Object.create(o), (e === "(string)" || e === "(range)") && !k.scripturl && Z.test(i) && ft("Script URL.", r, n), e === "(identifier)" && (o.identifier = !0, i === "__proto__" && !k.proto ? ft("The '{a}' property is deprecated.", r, n, i) : i === "__iterator__" && !k.iterator ? ft("'{a}' is only available in JavaScript 1.7.", r, n, i) : k.nomen && (i.charAt(0) === "_" || i.charAt(i.length - 1) === "_") && (!k.node || R.id === "." || i !== "__dirname" && i !== "__filename") && ft("Unexpected {a} in '{b}'.", r, n, "dangling '_'", i)), o.value = i, o.line = r, o.character = t, o.from = n, s = o.id, s !== "(endline)" && (A = s && ("(,=:[!&|?{};".indexOf(s.charAt(s.length - 1)) >= 0 || s === "return" || s === "case")), o
      }
      var t, n, r, i;
      return {
        init: function (e) {
          typeof e == "string" ? b = e.replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .split("\n") : b = e, b[0] && b[0].substr(0, 2) === "#!" && (b[0] = ""), r = 0, s(), n = 1
        },
        range: function (e, s) {
          var u, a = "";
          n = t, i.charAt(0) !== e && ct("Expected '{a}' and instead saw '{b}'.", r, t, e, i.charAt(0));
          for (;;) {
            i = i.slice(1), t += 1, u = i.charAt(0);
            switch (u) {
            case "":
              ct("Missing '{a}'.", r, t, u);
              break;
            case s:
              return i = i.slice(1), t += 1, o("(range)", a);
            case "\\":
              ft("Unexpected '{a}'.", r, t, u)
            }
            a += u
          }
        },
        token: function () {
          function E(e) {
            var r = e.exec(i),
              s;
            if (r) return p = r[0].length, s = r[1], u = s.charAt(0), i = i.substr(p), n = t + p - s.length, t += p, s
          }

          function S(e) {
            function c(e) {
              var n = parseInt(i.substr(a + 1, e), 16);
              a += e, n >= 32 && n <= 126 && n !== 34 && n !== 92 && n !== 39 && ft("Unnecessary escapement.", r, t), t += e, u = String.fromCharCode(n)
            }
            var u, a, f = "",
              l = !1;
            g && e !== '"' && ft("Strings must use doublequote.", r, t), a = 0;
            e: for (;;) {
              while (a >= i.length) {
                a = 0;
                var h = r,
                  p = n;
                if (!s()) {
                  ct("Unclosed string.", h, p);
                  break e
                }
                l ? l = !1 : ft("Unclosed string.", h, p)
              }
              u = i.charAt(a);
              if (u === e) return t += 1, i = i.substr(a + 1), o("(string)", f, e);
              if (u < " ") {
                if (u === "\n" || u === "\r") break;
                ft("Control character in string: {a}.", r, t + a, i.slice(0, a))
              } else if (u === "\\") {
                a += 1, t += 1, u = i.charAt(a), w = i.charAt(a + 1);
                switch (u) {
                case "\\":
                case '"':
                case "/":
                  break;
                case "'":
                  g && ft("Avoid \\'.", r, t);
                  break;
                case "b":
                  u = "\b";
                  break;
                case "f":
                  u = "\f";
                  break;
                case "n":
                  u = "\n";
                  break;
                case "r":
                  u = "\r";
                  break;
                case "t":
                  u = " ";
                  break;
                case "0":
                  u = "\0", w >= 0 && w <= 7 && F["use strict"] && ft("Octal literals are not allowed in strict mode.", r, t);
                  break;
                case "u":
                  c(4);
                  break;
                case "v":
                  g && ft("Avoid \\v.", r, t), u = "";
                  break;
                case "x":
                  g && ft("Avoid \\x-.", r, t), c(2);
                  break;
                case "":
                  l = !0;
                  if (k.multistr) {
                    g && ft("Avoid EOL escapement.", r, t), u = "", t -= 1;
                    break
                  }
                  ft("Bad escapement of EOL. Use option multistr if needed.", r, t);
                  break;
                default:
                  ft("Bad escapement.", r, t)
                }
              }
              f += u, t += 1, a += 1
            }
          }
          var e, u, a, f, l, c, h, p, d, v, m, y, b, w;
          for (;;) {
            if (!i) return o(s() ? "(endline)" : "(end)", "");
            m = E(J);
            if (!m) {
              m = "", u = "";
              while (i && i < "!") i = i.substr(1);
              i && (ct("Unexpected '{a}'.", r, t, i.substr(0, 1)), i = "")
            } else {
              if (u.isAlpha() || u === "_" || u === "$") return o("(identifier)", m);
              if (u.isDigit()) return isFinite(Number(m)) || ft("Bad number '{a}'.", r, t, m), i.substr(0, 1)
                .isAlpha() && ft("Missing space after '{a}'.", r, t, m), u === "0" && (f = m.substr(1, 1), f.isDigit() ? R.id !== "." && ft("Don't use extra leading zeros '{a}'.", r, t, m) : g && (f === "x" || f === "X") && ft("Avoid 0x-. '{a}'.", r, t, m)), m.substr(m.length - 1) === "." && ft("A trailing decimal point can be confused with a dot '{a}'.", r, t, m), o("(number)", m);
              switch (m) {
              case '"':
              case "'":
                return S(m);
              case "//":
                i = "", R.comment = !0;
                break;
              case "/*":
                for (;;) {
                  h = i.search(G);
                  if (h >= 0) break;
                  s() || ct("Unclosed comment.", r, t)
                }
                t += h + 2, i.substr(h, 1) === "/" && ct("Nested comment.", r, t), i = i.substr(h + 2), R.comment = !0;
                break;
              case "/*members":
              case "/*member":
              case "/*jshint":
              case "/*jslint":
              case "/*global":
              case "*/":
                return {
                  value: m,
                  type: "special",
                  line: r,
                  character: t,
                  from: n
                };
              case "":
                break;
              case "/":
                R.id === "/=" && ct("A regular expression literal can be confused with '/='.", r, n);
                if (A) {
                  l = 0, a = 0, p = 0;
                  for (;;) {
                    e = !0, u = i.charAt(p), p += 1;
                    switch (u) {
                    case "":
                      return ct("Unclosed regular expression.", r, n), ot("Stopping.", r, n);
                    case "/":
                      l > 0 && ft("{a} unterminated regular expression group(s).", r, n + p, l), u = i.substr(0, p - 1), v = {
                        g: !0,
                        i: !0,
                        m: !0
                      };
                      while (v[i.charAt(p)] === !0) v[i.charAt(p)] = !1, p += 1;
                      return t += p, i = i.substr(p), v = i.charAt(0), (v === "/" || v === "*") && ct("Confusing regular expression.", r, n), o("(regexp)", u);
                    case "\\":
                      u = i.charAt(p), u < " " ? ft("Unexpected control character in regular expression.", r, n + p) : u === "<" && ft("Unexpected escaped character '{a}' in regular expression.", r, n + p, u), p += 1;
                      break;
                    case "(":
                      l += 1, e = !1;
                      if (i.charAt(p) === "?") {
                        p += 1;
                        switch (i.charAt(p)) {
                        case ":":
                        case "=":
                        case "!":
                          p += 1;
                          break;
                        default:
                          ft("Expected '{a}' and instead saw '{b}'.", r, n + p, ":", i.charAt(p))
                        }
                      } else a += 1;
                      break;
                    case "|":
                      e = !1;
                      break;
                    case ")":
                      l === 0 ? ft("Unescaped '{a}'.", r, n + p, ")") : l -= 1;
                      break;
                    case " ":
                      v = 1;
                      while (i.charAt(p) === " ") p += 1, v += 1;
                      v > 1 && ft("Spaces are hard to count. Use {{a}}.", r, n + p, v);
                      break;
                    case "[":
                      u = i.charAt(p), u === "^" && (p += 1, k.regexp ? ft("Insecure '{a}'.", r, n + p, u) : i.charAt(p) === "]" && ct("Unescaped '{a}'.", r, n + p, "^")), u === "]" && ft("Empty class.", r, n + p - 1), y = !1, b = !1;
                      e: do {
                        u = i.charAt(p), p += 1;
                        switch (u) {
                        case "[":
                        case "^":
                          ft("Unescaped '{a}'.", r, n + p, u), b ? b = !1 : y = !0;
                          break;
                        case "-":
                          y && !b ? (y = !1, b = !0) : b ? b = !1 : i.charAt(p) === "]" ? b = !0 : (k.regexdash !== (p === 2 || p === 3 && i.charAt(1) === "^") && ft("Unescaped '{a}'.", r, n + p - 1, "-"), y = !0);
                          break;
                        case "]":
                          b && !k.regexdash && ft("Unescaped '{a}'.", r, n + p - 1, "-");
                          break e;
                        case "\\":
                          u = i.charAt(p), u < " " ? ft("Unexpected control character in regular expression.", r, n + p) : u === "<" && ft("Unexpected escaped character '{a}' in regular expression.", r, n + p, u), p += 1, /[wsd]/i.test(u) ? (b && (ft("Unescaped '{a}'.", r, n + p, "-"), b = !1), y = !1) : b ? b = !1 : y = !0;
                          break;
                        case "/":
                          ft("Unescaped '{a}'.", r, n + p - 1, "/"), b ? b = !1 : y = !0;
                          break;
                        case "<":
                          b ? b = !1 : y = !0;
                          break;
                        default:
                          b ? b = !1 : y = !0
                        }
                      } while (u);
                      break;
                    case ".":
                      k.regexp && ft("Insecure '{a}'.", r, n + p, u);
                      break;
                    case "]":
                    case "?":
                    case "{":
                    case "}":
                    case "+":
                    case "*":
                      ft("Unescaped '{a}'.", r, n + p, u)
                    }
                    if (e) switch (i.charAt(p)) {
                    case "?":
                    case "+":
                    case "*":
                      p += 1, i.charAt(p) === "?" && (p += 1);
                      break;
                    case "{":
                      p += 1, u = i.charAt(p), (u < "0" || u > "9") && ft("Expected a number and instead saw '{a}'.", r, n + p, u), p += 1, d = +u;
                      for (;;) {
                        u = i.charAt(p);
                        if (u < "0" || u > "9") break;
                        p += 1, d = +u + d * 10
                      }
                      c = d;
                      if (u === ",") {
                        p += 1, c = Infinity, u = i.charAt(p);
                        if (u >= "0" && u <= "9") {
                          p += 1, c = +u;
                          for (;;) {
                            u = i.charAt(p);
                            if (u < "0" || u > "9") break;
                            p += 1, c = +u + c * 10
                          }
                        }
                      }
                      i.charAt(p) !== "}" ? ft("Expected '{a}' and instead saw '{b}'.", r, n + p, "}", u) : p += 1, i.charAt(p) === "?" && (p += 1), d > c && ft("'{a}' should not be greater than '{b}'.", r, n + p, d, c)
                    }
                  }
                  return u = i.substr(0, p - 1), t += p, i = i.substr(p), o("(regexp)", u)
                }
                return o("(punctuator)", m);
              case "#":
                return o("(punctuator)", m);
              default:
                return o("(punctuator)", m)
              }
            }
          }
        }
      }
    }();
    _t("(number)", function () {
      return this
    }), _t("(string)", function () {
      return this
    }), I["(identifier)"] = {
      type: "(identifier)",
      lbp: 0,
      identifier: !0,
      nud: function () {
        var t = this.value,
          n = D[t],
          r;
        typeof n == "function" ? n = undefined : typeof n == "boolean" && (r = l, l = h[0], pt(t, "var"), n = l, l = r);
        if (l === n) switch (l[t]) {
          case "unused":
            l[t] = "var";
            break;
          case "unction":
            l[t] = "function", this["function"] = !0;
            break;
          case "function":
            this["function"] = !0;
            break;
          case "label":
            at("'{a}' is a statement label.", R, t)
          } else if (l["(global)"]) k.undef && typeof L[t] != "boolean" && (e !== "typeof" && e !== "delete" || T && (T.value === "." || T.value === "[")) && ut(l, "'{a}' is not defined.", R, t), Qt(R);
          else switch (l[t]) {
          case "closure":
          case "function":
          case "var":
          case "unused":
            at("'{a}' used out of scope.", R, t);
            break;
          case "label":
            at("'{a}' is a statement label.", R, t);
            break;
          case "outer":
          case "global":
            break;
          default:
            if (n === !0) l[t] = !0;
            else if (n === null) at("'{a}' is not allowed.", R, t), Qt(R);
            else if (typeof n != "object") k.undef && (e !== "typeof" && e !== "delete" || T && (T.value === "." || T.value === "[")) && ut(l, "'{a}' is not defined.", R, t), l[t] = !0, Qt(R);
            else switch (n[t]) {
            case "function":
            case "unction":
              this["function"] = !0, n[t] = "closure", l[t] = n["(global)"] ? "global" : "outer";
              break;
            case "var":
            case "unused":
              n[t] = "closure", l[t] = n["(global)"] ? "global" : "outer";
              break;
            case "closure":
            case "parameter":
              l[t] = n["(global)"] ? "global" : "outer";
              break;
            case "label":
              at("'{a}' is a statement label.", R, t)
            }
          }
          return this
      },
      led: function () {
        lt("Expected an operator and instead saw '{a}'.", T, T.value)
      }
    }, _t("(regexp)", function () {
      return this
    }), kt("(endline)"), kt("(begin)"), kt("(end)")
      .reach = !0, kt("</")
      .reach = !0, kt("<!"), kt("<!--"), kt("-->"), kt("(error)")
      .reach = !0, kt("}")
      .reach = !0, kt(")"), kt("]"), kt('"')
      .reach = !0, kt("'")
      .reach = !0, kt(";"), kt(":")
      .reach = !0, kt(","), kt("#"), kt("@"), Dt("else"), Dt("case")
      .reach = !0, Dt("catch"), Dt("default")
      .reach = !0, Dt("finally"), Pt("arguments", function (e) {
        F["use strict"] && l["(global)"] && at("Strict violation.", e)
      }), Pt("eval"), Pt("false"), Pt("Infinity"), Pt("NaN"), Pt("null"), Pt("this", function (e) {
        F["use strict"] && !k.validthis && (l["(statement)"] && l["(name)"].charAt(0) > "Z" || l["(global)"]) && at("Possible strict violation.", e)
      }), Pt("true"), Pt("undefined"), Ft("=", "assign", 20), Ft("+=", "assignadd", 20), Ft("-=", "assignsub", 20), Ft("*=", "assignmult", 20), Ft("/=", "assigndiv", 20)
      .nud = function () {
        lt("A regular expression literal can be confused with '/='.")
    }, Ft("%=", "assignmod", 20), qt("&=", "assignbitand", 20), qt("|=", "assignbitor", 20), qt("^=", "assignbitxor", 20), qt("<<=", "assignshiftleft", 20), qt(">>=", "assignshiftright", 20), qt(">>>=", "assignshiftrightunsigned", 20), Ht("?", function (e, t) {
      return t.left = e, t.right = gt(10), mt(":"), t["else"] = gt(10), t
    }, 30), Ht("||", "or", 40), Ht("&&", "and", 50), It("|", "bitor", 70), It("^", "bitxor", 80), It("&", "bitand", 90), Bt("==", function (e, t) {
      var n = k.eqnull && (e.value === "null" || t.value === "null");
      return !n && k.eqeqeq ? at("Expected '{a}' and instead saw '{b}'.", this, "===", "==") : jt(e) ? at("Use '{a}' to compare with '{b}'.", this, "===", e.value) : jt(t) && at("Use '{a}' to compare with '{b}'.", this, "===", t.value), this
    }), Bt("==="), Bt("!=", function (e, t) {
      var n = k.eqnull && (e.value === "null" || t.value === "null");
      return !n && k.eqeqeq ? at("Expected '{a}' and instead saw '{b}'.", this, "!==", "!=") : jt(e) ? at("Use '{a}' to compare with '{b}'.", this, "!==", e.value) : jt(t) && at("Use '{a}' to compare with '{b}'.", this, "!==", t.value), this
    }), Bt("!=="), Bt("<"), Bt(">"), Bt("<="), Bt(">="), It("<<", "shiftleft", 120), It(">>", "shiftright", 120), It(">>>", "shiftrightunsigned", 120), Ht("in", "in", 120), Ht("instanceof", "instanceof", 120), Ht("+", function (e, t) {
      var n = gt(130);
      return e && n && e.id === "(string)" && n.id === "(string)" ? (e.value += n.value, e.character = n.character, !k.scripturl && Z.test(e.value) && at("JavaScript URL.", e), e) : (t.left = e, t.right = n, t)
    }, 130), Mt("+", "num"), Mt("+++", function () {
      return at("Confusing pluses."), this.right = gt(150), this.arity = "unary", this
    }), Ht("+++", function (e) {
      return at("Confusing pluses."), this.left = e, this.right = gt(130), this
    }, 130), Ht("-", "sub", 130), Mt("-", "neg"), Mt("---", function () {
      return at("Confusing minuses."), this.right = gt(150), this.arity = "unary", this
    }), Ht("---", function (e) {
      return at("Confusing minuses."), this.left = e, this.right = gt(130), this
    }, 130), Ht("*", "mult", 140), Ht("/", "div", 140), Ht("%", "mod", 140), Rt("++", "postinc"), Mt("++", "preinc"), I["++"].exps = !0, Rt("--", "postdec"), Mt("--", "predec"), I["--"].exps = !0, Mt("delete", function () {
      var e = gt(0);
      return (!e || e.id !== "." && e.id !== "[") && at("Variables should not be deleted."), this.first = e, this
    })
      .exps = !0, Mt("~", function () {
        return k.bitwise && at("Unexpected '{a}'.", this, "~"), gt(150), this
      }), Mt("!", function () {
        return this.right = gt(150), this.arity = "unary", t[this.right.id] === !0 && at("Confusing use of '{a}'.", this, "!"), this
      }), Mt("typeof", "typeof"), Mt("new", function () {
        var e = gt(155),
          t;
        if (e && e.id !== "function")
          if (e.identifier) {
            e["new"] = !0;
            switch (e.value) {
            case "Number":
            case "String":
            case "Boolean":
            case "Math":
            case "JSON":
              at("Do not use {a} as a constructor.", R, e.value);
              break;
            case "Function":
              k.evil || at("The Function constructor is eval.");
              break;
            case "Date":
            case "RegExp":
              break;
            default:
              e.id !== "function" && (t = e.value.substr(0, 1), k.newcap && (t < "A" || t > "Z") && at("A constructor name should start with an uppercase letter.", R))
            }
          } else e.id !== "." && e.id !== "[" && e.id !== "(" && at("Bad constructor.", R);
        else k.supernew || at("Weird construction. Delete 'new'.", this);
        return yt(R, T), T.id !== "(" && !k.supernew && at("Missing '()' invoking a constructor."), this.first = e, this
      }), I["new"].exps = !0, Mt("void")
      .exps = !0, Ht(".", function (e, t) {
        yt(O, R), bt();
        var n = zt();
        return typeof n == "string" && Kt(n), t.left = e, t.right = n, !e || e.value !== "arguments" || n !== "callee" && n !== "caller" ? !k.evil && e && e.value === "document" && (n === "write" || n === "writeln") && at("document.write can be a form of eval.", e) : k.noarg ? at("Avoid arguments.{a}.", e, n) : F["use strict"] && lt("Strict violation."), !k.evil && (n === "eval" || n === "execScript") && at("eval is evil."), t
      }, 160, !0), Ht("(", function (e, t) {
        O.id !== "}" && O.id !== ")" && bt(O, R), wt(), k.immed && !e.immed && e.id === "function" && at("Wrap an immediate function invocation in parentheses to assist the reader in understanding that the expression is the result of a function, and not the function itself.");
        var n = 0,
          r = [];
        e && e.type === "(identifier)" && e.value.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/) && e.value !== "Number" && e.value !== "String" && e.value !== "Boolean" && e.value !== "Date" && (e.value === "Math" ? at("Math is not a function.", e) : k.newcap && at("Missing 'new' prefix when invoking a constructor.", e));
        if (T.id !== ")")
          for (;;) {
            r[r.length] = gt(10), n += 1;
            if (T.id !== ",") break;
            Nt()
          }
        return mt(")"), wt(O, R), typeof e == "object" && (e.value === "parseInt" && n === 1 && at("Missing radix parameter.", e), k.evil || (e.value === "eval" || e.value === "Function" || e.value === "execScript" ? at("eval is evil.", e) : r[0] && r[0].id === "(string)" && (e.value === "setTimeout" || e.value === "setInterval") && at("Implied eval is evil. Pass a function instead of a string.", e)), !e.identifier && e.id !== "." && e.id !== "[" && e.id !== "(" && e.id !== "&&" && e.id !== "||" && e.id !== "?" && at("Bad invocation.", e)), t.left = e, t
      }, 155, !0)
      .exps = !0, Mt("(", function () {
        wt(), T.id === "function" && (T.immed = !0);
        var e = gt(0);
        return mt(")", this), wt(O, R), k.immed && e.id === "function" && (T.id === "(" || T.id === "." && (vt()
          .value === "call" || vt()
          .value === "apply") ? at("Move the invocation into the parens that contain the function.", T) : at("Do not wrap function literals in parens unless they are to be immediately invoked.", this)), e
      }), Ht("[", function (e, t) {
        bt(O, R), wt();
        var n = gt(0),
          r;
        return n && n.type === "(string)" && (!k.evil && (n.value === "eval" || n.value === "execScript") && at("eval is evil.", t), Kt(n.value), !k.sub && Y.test(n.value) && (r = I[n.value], (!r || !r.reserved) && at("['{a}'] is better written in dot notation.", n, n.value))), mt("]", t), wt(O, R), t.left = e, t.right = n, t
      }, 160, !0), Mt("[", function () {
        var e = R.line !== T.line;
        this.first = [], e && (m += k.indent, T.from === m + k.indent && (m += k.indent));
        while (T.id !== "(end)") {
          while (T.id === ",") at("Extra comma."), mt(",");
          if (T.id === "]") break;
          e && R.line !== T.line && xt(), this.first.push(gt(10));
          if (T.id !== ",") break;
          Nt();
          if (T.id === "]" && !k.es5) {
            at("Extra comma.", R);
            break
          }
        }
        return e && (m -= k.indent, xt()), mt("]", this), this
      }, 160),
    function (e) {
      e.nud = function () {
        function u(e, t) {
          o[e] && nt(o, e) ? at("Duplicate member '{a}'.", T, n) : o[e] = {}, o[e].basic = !0, o[e].basicToken = t
        }

        function a(e, t) {
          o[e] && nt(o, e) ? (o[e].basic || o[e].setter) && at("Duplicate member '{a}'.", T, n) : o[e] = {}, o[e].setter = !0, o[e].setterToken = t
        }

        function f(e) {
          o[e] && nt(o, e) ? (o[e].basic || o[e].getter) && at("Duplicate member '{a}'.", T, n) : o[e] = {}, o[e].getter = !0, o[e].getterToken = R
        }
        var e, t, n, r, i, s, o = {};
        e = R.line !== T.line, e && (m += k.indent, T.from === m + k.indent && (m += k.indent));
        for (;;) {
          if (T.id === "}") break;
          e && xt();
          if (T.value === "get" && vt()
            .id !== ":") mt("get"), k.es5 || lt("get/set are ES5 features."), n = Gt(), n || lt("Missing property name."), f(n), s = T, yt(R, T), t = Zt(), i = t["(params)"], i && at("Unexpected parameter '{a}' in get {b} function.", s, i[0], n), yt(R, T);
          else if (T.value === "set" && vt()
            .id !== ":") mt("set"), k.es5 || lt("get/set are ES5 features."), n = Gt(), n || lt("Missing property name."), a(n, T), s = T, yt(R, T), t = Zt(), i = t["(params)"], (!i || i.length !== 1) && at("Expected a single parameter in set {a} function.", s, n);
          else {
            n = Gt(), u(n, T);
            if (typeof n != "string") break;
            mt(":"), Et(R, T), gt(10)
          }
          Kt(n);
          if (T.id !== ",") break;
          Nt(), T.id === "," ? at("Extra comma.", R) : T.id === "}" && !k.es5 && at("Extra comma.", R)
        }
        e && (m -= k.indent, xt()), mt("}", this);
        if (k.es5)
          for (var l in o) nt(o, l) && o[l].setter && !o[l].getter && at("Setter is defined without getter.", o[l].setterToken);
        return this
      }, e.fud = function () {
        lt("Expected to see a statement and instead saw a block.", R)
      }
    }(kt("{")), z = function () {
      var e = Lt("const", function (e) {
        var t, n, r;
        this.first = [];
        for (;;) {
          Et(R, T), t = zt(), l[t] === "const" && at("const '" + t + "' has already been declared"), l["(global)"] && L[t] === !1 && at("Redefinition of '{a}'.", R, t), pt(t, "const");
          if (e) break;
          n = R, this.first.push(R), T.id !== "=" && at("const '{a}' is initialized to 'undefined'.", R, t), T.id === "=" && (Et(R, T), mt("="), Et(R, T), T.id === "undefined" && at("It is not necessary to initialize '{a}' to 'undefined'.", R, t), vt(0)
            .id === "=" && T.identifier && lt("Constant {a} was not declared correctly.", T, T.value), r = gt(0), n.first = r);
          if (T.id !== ",") break;
          Nt()
        }
        return this
      });
      e.exps = !0
    };
    var en = Lt("var", function (e) {
      var t, n, r;
      l["(onevar)"] && k.onevar ? at("Too many var statements.") : l["(global)"] || (l["(onevar)"] = !0), this.first = [];
      for (;;) {
        Et(R, T), t = zt(), k.esnext && l[t] === "const" && at("const '" + t + "' has already been declared"), l["(global)"] && L[t] === !1 && at("Redefinition of '{a}'.", R, t), pt(t, "unused");
        if (e) break;
        n = R, this.first.push(R), T.id === "=" && (Et(R, T), mt("="), Et(R, T), T.id === "undefined" && at("It is not necessary to initialize '{a}' to 'undefined'.", R, t), vt(0)
          .id === "=" && T.identifier && lt("Variable {a} was not declared correctly.", T, T.value), r = gt(0), n.first = r);
        if (T.id !== ",") break;
        Nt()
      }
      return this
    });
    en.exps = !0, At("function", function () {
      v && at("Function declarations should not be placed in blocks. Use a function expression or move the statement to the top of the outer function.", R);
      var e = zt();
      return k.esnext && l[e] === "const" && at("const '" + e + "' has already been declared"), yt(R, T), pt(e, "unction"), Zt(e, !0), T.id === "(" && T.line === R.line && lt("Function declarations are not invocable. Wrap the whole function invocation in parens."), this
    }), Mt("function", function () {
      var e = Ut();
      return e ? yt(R, T) : Et(R, T), Zt(e), !k.loopfunc && l["(loopage)"] && at("Don't make functions within a loop."), this
    }), At("if", function () {
      var e = T;
      return mt("("), Et(this, e), wt(), gt(20), T.id === "=" && (k.boss || at("Expected a conditional expression and instead saw an assignment."), mt("="), gt(20)), mt(")", e), wt(O, R), Jt(!0, !0), T.id === "else" && (Et(R, T), mt("else"), T.id === "if" || T.id === "switch" ? Xt(!0) : Jt(!0, !0)), this
    }), At("try", function () {
      var e, t, n;
      Jt(!1), T.id === "catch" && (mt("catch"), Et(R, T), mt("("), n = D, D = Object.create(n), t = T.value, T.type !== "(identifier)" ? at("Expected an identifier and instead saw '{a}'.", T, t) : pt(t, "exception"), mt(), mt(")"), Jt(!1), e = !0, D = n);
      if (T.id === "finally") {
        mt("finally"), Jt(!1);
        return
      }
      return e || lt("Expected '{a}' and instead saw '{b}'.", T, "catch", T.value), this
    }), At("while", function () {
      var e = T;
      return l["(breakage)"] += 1, l["(loopage)"] += 1, mt("("), Et(this, e), wt(), gt(20), T.id === "=" && (k.boss || at("Expected a conditional expression and instead saw an assignment."), mt("="), gt(20)), mt(")", e), wt(O, R), Jt(!0, !0), l["(breakage)"] -= 1, l["(loopage)"] -= 1, this
    })
      .labelled = !0, At("with", function () {
        var e = T;
        return F["use strict"] ? lt("'with' is not allowed in strict mode.", R) : k.withstmt || at("Don't use 'with'.", R), mt("("), Et(this, e), wt(), gt(0), mt(")", e), wt(O, R), Jt(!0, !0), this
      }), At("switch", function () {
        var e = T,
          t = !1;
        l["(breakage)"] += 1, mt("("), Et(this, e), wt(), this.condition = gt(20), mt(")", e), wt(O, R), Et(R, T), e = T, mt("{"), Et(R, T), m += k.indent, this.cases = [];
        for (;;) switch (T.id) {
        case "case":
          switch (l["(verb)"]) {
          case "break":
          case "case":
          case "continue":
          case "return":
          case "switch":
          case "throw":
            break;
          default:
            et.test(b[T.line - 2]) || at("Expected a 'break' statement before 'case'.", R)
          }
          xt(-k.indent), mt("case"), this.cases.push(gt(20)), t = !0, mt(":"), l["(verb)"] = "case";
          break;
        case "default":
          switch (l["(verb)"]) {
          case "break":
          case "continue":
          case "return":
          case "throw":
            break;
          default:
            et.test(b[T.line - 2]) || at("Expected a 'break' statement before 'default'.", R)
          }
          xt(-k.indent), mt("default"), t = !0, mt(":");
          break;
        case "}":
          m -= k.indent, xt(), mt("}", e);
          if (this.cases.length === 1 || this.condition.id === "true" || this.condition.id === "false") k.onecase || at("This 'switch' should be an 'if'.", this);
          l["(breakage)"] -= 1, l["(verb)"] = undefined;
          return;
        case "(end)":
          lt("Missing '{a}'.", T, "}");
          return;
        default:
          if (t) switch (R.id) {
          case ",":
            lt("Each value should have its own case label.");
            return;
          case ":":
            t = !1, Vt();
            break;
          default:
            lt("Missing ':' on a case clause.", R);
            return
          } else {
            if (R.id !== ":") {
              lt("Expected '{a}' and instead saw '{b}'.", T, "case", T.value);
              return
            }
            mt(":"), lt("Unexpected '{a}'.", R, ":"), Vt()
          }
        }
      })
      .labelled = !0, Lt("debugger", function () {
        return k.debug || at("All 'debugger' statements should be removed."), this
      })
      .exps = !0,
    function () {
      var e = Lt("do", function () {
        l["(breakage)"] += 1, l["(loopage)"] += 1, this.first = Jt(!0), mt("while");
        var e = T;
        return Et(R, e), mt("("), wt(), gt(20), T.id === "=" && (k.boss || at("Expected a conditional expression and instead saw an assignment."), mt("="), gt(20)), mt(")", e), wt(O, R), l["(breakage)"] -= 1, l["(loopage)"] -= 1, this
      });
      e.labelled = !0, e.exps = !0
    }(), At("for", function () {
      var e, t = T;
      l["(breakage)"] += 1, l["(loopage)"] += 1, mt("("), Et(this, t), wt();
      if (vt(T.id === "var" ? 1 : 0)
        .id === "in") {
        if (T.id === "var") mt("var"), en.fud.call(en, !0);
        else {
          switch (l[T.value]) {
          case "unused":
            l[T.value] = "var";
            break;
          case "var":
            break;
          default:
            at("Bad for in variable '{a}'.", T, T.value)
          }
          mt()
        }
        return mt("in"), gt(20), mt(")", t), e = Jt(!0, !0), k.forin && e && (e.length > 1 || typeof e[0] != "object" || e[0].value !== "if") && at("The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.", this), l["(breakage)"] -= 1, l["(loopage)"] -= 1, this
      }
      if (T.id !== ";")
        if (T.id === "var") mt("var"), en.fud.call(en);
        else
          for (;;) {
            gt(0, "for");
            if (T.id !== ",") break;
            Nt()
          }
        Tt(R), mt(";"), T.id !== ";" && (gt(20), T.id === "=" && (k.boss || at("Expected a conditional expression and instead saw an assignment."), mt("="), gt(20))), Tt(R), mt(";"), T.id === ";" && lt("Expected '{a}' and instead saw '{b}'.", T, ")", ";");
      if (T.id !== ")")
        for (;;) {
          gt(0, "for");
          if (T.id !== ",") break;
          Nt()
        }
      return mt(")", t), wt(O, R), Jt(!0, !0), l["(breakage)"] -= 1, l["(loopage)"] -= 1, this
    })
      .labelled = !0, Lt("break", function () {
        var e = T.value;
        return l["(breakage)"] === 0 && at("Unexpected '{a}'.", T, this.value), k.asi || Tt(this), T.id !== ";" && R.line === T.line && (l[e] !== "label" ? at("'{a}' is not a statement label.", T, e) : D[e] !== l && at("'{a}' is out of scope.", T, e), this.first = T, mt()), Wt("break"), this
      })
      .exps = !0, Lt("continue", function () {
        var e = T.value;
        return l["(breakage)"] === 0 && at("Unexpected '{a}'.", T, this.value), k.asi || Tt(this), T.id !== ";" ? R.line === T.line && (l[e] !== "label" ? at("'{a}' is not a statement label.", T, e) : D[e] !== l && at("'{a}' is out of scope.", T, e), this.first = T, mt()) : l["(loopage)"] || at("Unexpected '{a}'.", T, this.value), Wt("continue"), this
      })
      .exps = !0, Lt("return", function () {
        return this.line === T.line ? (T.id === "(regexp)" && at("Wrap the /regexp/ literal in parens to disambiguate the slash operator."), T.id !== ";" && !T.reach && (Et(R, T), vt()
          .value === "=" && !k.boss && ft("Did you mean to return a conditional instead of an assignment?", R.line, R.character + 1), this.first = gt(0))) : k.asi || Tt(this), Wt("return"), this
      })
      .exps = !0, Lt("throw", function () {
        return Tt(this), Et(R, T), this.first = gt(20), Wt("throw"), this
      })
      .exps = !0, Dt("class"), Dt("const"), Dt("enum"), Dt("export"), Dt("extends"), Dt("import"), Dt("super"), Dt("let"), Dt("yield"), Dt("implements"), Dt("interface"), Dt("package"), Dt("private"), Dt("protected"), Dt("public"), Dt("static");
    var nn = function (e, t, n) {
      var i, s, o;
      r.errors = [], r.undefs = [], L = Object.create(H), it(L, n || {});
      if (t) {
        i = t.predef;
        if (i)
          if (Array.isArray(i))
            for (s = 0; s < i.length; s += 1) L[i[s]] = !0;
          else if (typeof i == "object") {
          o = Object.keys(i);
          for (s = 0; s < o.length; s += 1) L[o[s]] = !!i[o[s]]
        }
        k = t
      } else k = {};
      k.indent = k.indent || 4, k.maxerr = k.maxerr || 50, q = "";
      for (s = 0; s < k.indent; s += 1) q += " ";
      m = 1, p = Object.create(L), D = p, l = {
        "(global)": !0,
        "(name)": "(global)",
        "(scope)": D,
        "(breakage)": 0,
        "(loopage)": 0
      }, h = [l], U = [], P = null, E = {}, S = null, d = {}, v = !1, w = [], g = !1, W = 0, ht.init(e), A = !0, F = {}, O = R = T = I["(begin)"];
      for (var u in t) nt(t, u) && rt(u, R);
      st(), it(L, n || {}), Nt.first = !0;
      try {
        mt();
        switch (T.id) {
        case "{":
        case "[":
          k.laxbreak = !0, g = !0, tn();
          break;
        default:
          $t(), F["use strict"] && !k.globalstrict && at('Use the function form of "use strict".', O), Vt()
        }
        mt("(end)");
        var a = function (e, t) {
            do {
              if (typeof t[e] == "string") return t[e] === "unused" ? t[e] = "var" : t[e] === "unction" && (t[e] = "closure"), !0;
              t = t["(context)"]
            } while (t);
            return !1
          },
          f = function (e, t) {
            if (!d[e]) return;
            var n = [];
            for (var r = 0; r < d[e].length; r += 1) d[e][r] !== t && n.push(d[e][r]);
            n.length === 0 ? delete d[e] : d[e] = n
          };
        for (s = 0; s < r.undefs.length; s += 1) o = r.undefs[s].slice(0), a(o[2].value, o[0]) ? f(o[2].value, o[2].line) : at.apply(at, o.slice(1))
      } catch (c) {
        if (c) {
          var y = T || {};
          r.errors.push({
            raw: c.raw,
            reason: c.message,
            line: c.line || y.line,
            character: c.character || y.from
          }, null)
        }
      }
      return r.errors.length === 0
    };
    return nn.data = function () {
      var e = {
          functions: [],
          options: k
        },
        t, n, r = [],
        i, s, o, u = [],
        a, f = [],
        l;
      nn.errors.length && (e.errors = nn.errors), g && (e.json = !0);
      for (a in d) nt(d, a) && r.push({
        name: a,
        line: d[a]
      });
      r.length > 0 && (e.implieds = r), U.length > 0 && (e.urls = U), n = Object.keys(D), n.length > 0 && (e.globals = n);
      for (s = 1; s < h.length; s += 1) {
        i = h[s], t = {};
        for (o = 0; o < c.length; o += 1) t[c[o]] = [];
        for (a in i) nt(i, a) && a.charAt(0) !== "(" && (l = i[a], l === "unction" && (l = "unused"), Array.isArray(t[l]) && (t[l].push(a), l === "unused" && f.push({
          name: a,
          line: i["(line)"],
          "function": i["(name)"]
        })));
        for (o = 0; o < c.length; o += 1) t[c[o]].length === 0 && delete t[c[o]];
        t.name = i["(name)"], t.param = i["(params)"], t.line = i["(line)"], t.last = i["(last)"], e.functions.push(t)
      }
      f.length > 0 && (e.unused = f), u = [];
      for (a in E)
        if (typeof E[a] == "number") {
          e.member = E;
          break
        }
      return e
    }, nn.report = function (e) {
      function d(e, t) {
        var n, r, i;
        if (t) {
          h.push("<div><i>" + e + "</i> "), t = t.sort();
          for (r = 0; r < t.length; r += 1) t[r] !== i && (i = t[r], h.push((n ? ", " : "") + i), n = !0);
          h.push("</div>")
        }
      }
      var t = nn.data(),
        n = [],
        r, i, s, o, u, a, f, l = "",
        c, h = [],
        p;
      if (t.errors || t.implieds || t.unused) {
        s = !0, h.push("<div id=errors><i>Error:</i>");
        if (t.errors)
          for (u = 0; u < t.errors.length; u += 1) r = t.errors[u], r && (i = r.evidence || "", h.push("<p>Problem" + (isFinite(r.line) ? " at line " + r.line + " character " + r.character : "") + ": " + r.reason.entityify() + "</p><p class=evidence>" + (i && (i.length > 80 ? i.slice(0, 77) + "..." : i)
            .entityify()) + "</p>"));
        if (t.implieds) {
          p = [];
          for (u = 0; u < t.implieds.length; u += 1) p[u] = "<code>" + t.implieds[u].name + "</code>&nbsp;<i>" + t.implieds[u].line + "</i>";
          h.push("<p><i>Implied global:</i> " + p.join(", ") + "</p>")
        }
        if (t.unused) {
          p = [];
          for (u = 0; u < t.unused.length; u += 1) p[u] = "<code><u>" + t.unused[u].name + "</u></code>&nbsp;<i>" + t.unused[u].line + "</i> <code>" + t.unused[u]["function"] + "</code>";
          h.push("<p><i>Unused variable:</i> " + p.join(", ") + "</p>")
        }
        t.json && h.push("<p>JSON: bad.</p>"), h.push("</div>")
      }
      if (!e) {
        h.push("<br><div id=functions>"), t.urls && d("URLs<br>", t.urls, "<br>"), t.json && !s ? h.push("<p>JSON: good.</p>") : t.globals ? h.push("<div><i>Global</i> " + t.globals.sort()
          .join(", ") + "</div>") : h.push("<div><i>No new global variables introduced.</i></div>");
        for (u = 0; u < t.functions.length; u += 1) o = t.functions[u], h.push("<br><div class=function><i>" + o.line + "-" + o.last + "</i> " + (o.name || "") + "(" + (o.param ? o.param.join(", ") : "") + ")</div>"), d("<big><b>Unused</b></big>", o.unused), d("Closure", o.closure), d("Variable", o["var"]), d("Exception", o.exception), d("Outer", o.outer), d("Global", o.global), d("Label", o.label);
        if (t.member) {
          n = Object.keys(t.member);
          if (n.length) {
            n = n.sort(), l = "<br><pre id=members>/*members ", f = 10;
            for (u = 0; u < n.length; u += 1) a = n[u], c = a.name(), f + c.length > 72 && (h.push(l + "<br>"), l = "    ", f = 1), f += c.length + 2, t.member[a] === 1 && (c = "<i>" + c + "</i>"), u < n.length - 1 && (c += ", "), l += c;
            h.push(l + "<br>*/</pre>")
          }
          h.push("</div>")
        }
      }
      return h.join("")
    }, nn.jshint = nn, nn
  }();
  typeof t == "object" && t && (t.JSHINT = r)
}), define("ace/narcissus/parser", ["require", "exports", "module", "ace/narcissus/lexer", "ace/narcissus/definitions", "ace/narcissus/options"], function (require, exports, module) {
  function pushDestructuringVarDecls(e, t) {
    for (var n in e) {
      var r = e[n];
      r.type === IDENTIFIER ? t.varDecls.push(r) : pushDestructuringVarDecls(r, t)
    }
  }

  function Parser(e) {
    e.parser = this, this.t = e, this.x = null, this.unexpectedEOF = !1, options.mozillaMode && (this.mozillaMode = !0), options.parenFreeMode && (this.parenFreeMode = !0)
  }

  function StaticContext(e, t, n, r, i) {
    this.parentScript = e, this.parentBlock = t || e, this.inModule = n || !1, this.inFunction = r || !1, this.inForLoopInit = !1, this.topLevel = !0, this.allLabels = new Stack, this.currentLabels = new Stack, this.labeledTargets = new Stack, this.defaultLoopTarget = null, this.defaultTarget = null, this.strictMode = i
  }

  function Pragma(e) {
    if (e.type === SEMICOLON) {
      var t = e.expression;
      if (t.type === STRING && t.value === "use strict") return e.pragma = "strict", !0
    }
    return !1
  }

  function Node(e, t) {
    var n = e.token;
    n ? (this.type = n.type, this.value = n.value, this.lineno = n.lineno, this.start = n.start, this.end = n.end) : this.lineno = e.lineno, this.filename = e.filename, this.children = [];
    for (var r in t) this[r] = t[r]
  }

  function SyntheticNode(e) {
    this.children = [];
    for (var t in e) this[t] = e[t];
    this.synthetic = !0
  }

  function unevalableConst(e) {
    var t = definitions.tokens[e],
      n = definitions.opTypeNames.hasOwnProperty(t) ? definitions.opTypeNames[t] : t in definitions.keywords ? t.toUpperCase() : t;
    return {
      toSource: function () {
        return n
      }
    }
  }

  function tokenString(e) {
    var t = definitions.tokens[e];
    return /^\W/.test(t) ? definitions.opTypeNames[t] : t.toUpperCase()
  }

  function blockInit() {
    return {
      type: BLOCK,
      varDecls: []
    }
  }

  function scriptInit() {
    return {
      type: SCRIPT,
      funDecls: [],
      varDecls: [],
      modDefns: new Dict,
      modAssns: new Dict,
      modDecls: new Dict,
      modLoads: new Dict,
      impDecls: [],
      expDecls: [],
      exports: new Dict,
      hasEmptyReturn: !1,
      hasReturnWithValue: !1,
      hasYield: !1
    }
  }

  function Export(e, t) {
    this.node = e, this.isDefinition = t, this.resolved = null
  }

  function registerExport(e, t) {
    function n(t, n) {
      if (e.has(t)) throw new SyntaxError("multiple exports of " + t);
      e.set(t, n)
    }
    switch (t.type) {
    case MODULE:
    case FUNCTION:
      n(t.name, new Export(t, !0));
      break;
    case VAR:
      for (var r = 0; r < t.children.length; r++) n(t.children[r].name, new Export(t.children[r], !0));
      break;
    case LET:
    case CONST:
      throw new Error("NYI: " + definitions.tokens[t.type]);
    case EXPORT:
      for (var r = 0; r < t.pathList.length; r++) {
        var i = t.pathList[r];
        switch (i.type) {
        case OBJECT_INIT:
          for (var s = 0; s < i.children.length; s++) {
            var o = i.children[s];
            o.type === IDENTIFIER ? n(o.value, new Export(o, !1)) : n(o.children[0].value, new Export(o.children[1], !1))
          }
          break;
        case DOT:
          n(i.children[1].value, new Export(i, !1));
          break;
        case IDENTIFIER:
          n(i.value, new Export(i, !1));
          break;
        default:
          throw new Error("unexpected export path: " + definitions.tokens[i.type])
        }
      }
      break;
    default:
      throw new Error("unexpected export decl: " + definitions.tokens[exp.type])
    }
  }

  function Module(e) {
    var t = e.body.exports,
      n = e.body.modDefns,
      r = new Dict;
    t.forEach(function (e, t) {
      var i = t.node;
      if (i.type === MODULE) r.set(e, i);
      else if (!t.isDefinition && i.type === IDENTIFIER && n.has(i.value)) {
        var s = n.get(i.value);
        r.set(e, s)
      }
    }), this.node = e, this.exports = t, this.exportedModules = r
  }

  function isPragmaToken(e) {
    switch (e) {
    case IDENTIFIER:
    case STRING:
    case NUMBER:
    case NULL:
    case TRUE:
    case FALSE:
      return !0
    }
    return !1
  }

  function parse(e, t, n) {
    var r = new Tokenizer(e, t, n, options.allowHTMLComments),
      i = new Parser(r);
    return i.Script(!1, !1, !0)
  }

  function parseFunction(e, t, n, r, i) {
    var s = new Tokenizer(e, r, i),
      o = new Parser(s);
    return o.x = new StaticContext(null, null, !1, !1, !1), o.FunctionDefinition(t, n)
  }

  function parseStdin(e, t, n, r) {
    if (e.match(/^[\s]*\.begin[\s]*$/)) return ++t.value, parseMultiline(t, n);
    r(e.trim()) && (e = "");
    for (;;) try {
      var i = new Tokenizer(e, "stdin", t.value, !1),
        s = new Parser(i),
        o = s.Script(!1, !1);
      return t.value = i.lineno, o
    } catch (u) {
      if (!s.unexpectedEOF) throw u;
      var a;
      do {
        n && putstr(n), a = readline();
        if (!a) throw u
      } while (r(a.trim()));
      e += "\n" + a
    }
  }

  function parseMultiline(e, t) {
    var n = "";
    for (;;) {
      t && putstr(t);
      var r = readline();
      if (r === null) return null;
      if (r.match(/^[\s]*\.end[\s]*$/)) break;
      n += "\n" + r
    }
    var i = new Tokenizer(n, "stdin", e.value, !1),
      s = new Parser(i),
      o = s.Script(!1, !1);
    return e.value = i.lineno, o
  }
  var lexer = require("./lexer"),
    definitions = require("./definitions"),
    options = require("./options"),
    Tokenizer = lexer.Tokenizer,
    Dict = definitions.Dict,
    Stack = definitions.Stack;
  eval(definitions.consts), StaticContext.prototype = {
    update: function (e) {
      var t = {};
      for (var n in e) t[n] = {
        value: e[n],
        writable: !0,
        enumerable: !0,
        configurable: !0
      };
      return Object.create(this, t)
    },
    pushLabel: function (e) {
      return this.update({
        currentLabels: this.currentLabels.push(e),
        allLabels: this.allLabels.push(e)
      })
    },
    pushTarget: function (e) {
      var t = e.isLoop,
        n = t || e.type === SWITCH;
      return this.currentLabels.isEmpty() ? (t && this.update({
        defaultLoopTarget: e
      }), n && this.update({
        defaultTarget: e
      }), this) : (e.labels = new Dict, this.currentLabels.forEach(function (t) {
        e.labels.set(t, !0)
      }), this.update({
        currentLabels: new Stack,
        labeledTargets: this.labeledTargets.push(e),
        defaultLoopTarget: t ? e : this.defaultLoopTarget,
        defaultTarget: n ? e : this.defaultTarget
      }))
    },
    nest: function () {
      return this.topLevel ? this.update({
        topLevel: !1
      }) : this
    },
    canImport: function () {
      return this.topLevel && !this.inFunction
    },
    canExport: function () {
      return this.inModule && this.topLevel && !this.inFunction
    },
    banWith: function () {
      return this.strictMode || this.inModule
    },
    modulesAllowed: function () {
      return this.topLevel && !this.inFunction
    }
  };
  var Pp = Parser.prototype;
  Pp.mozillaMode = !1, Pp.parenFreeMode = !1, Pp.withContext = function (e, t) {
    var n = this.x;
    this.x = e;
    var r = t.call(this);
    return this.x = n, r
  }, Pp.newNode = function (t) {
    return new Node(this.t, t)
  }, Pp.fail = function (t) {
    throw this.t.newSyntaxError(t)
  }, Pp.match = function (t, n, r) {
    return this.t.match(t, n, r)
  }, Pp.mustMatch = function (t, n) {
    return this.t.mustMatch(t, n)
  }, Pp.peek = function (t) {
    return this.t.peek(t)
  }, Pp.peekOnSameLine = function (t) {
    return this.t.peekOnSameLine(t)
  }, Pp.done = function () {
    return this.t.done
  }, Pp.Script = function (t, n, r) {
    var i = this.newNode(scriptInit()),
      s = new StaticContext(i, i, t, n);
    return this.withContext(s, function () {
      this.Statements(i, !0)
    }), r && !this.done() && this.fail("expected end of input"), i
  };
  var Np = Node.prototype = SyntheticNode.prototype = {};
  Np.constructor = Node;
  var TO_SOURCE_SKIP = {
    type: !0,
    value: !0,
    lineno: !0,
    start: !0,
    end: !0,
    tokenizer: !0,
    assignOp: !0
  };
  Np.toSource = function () {
    var t = {},
      n = this;
    t.type = unevalableConst(this.type);
    if (this.generatingSource) return t.toSource();
    this.generatingSource = !0, "value" in this && (t.value = this.value), "lineno" in this && (t.lineno = this.lineno), "start" in this && (t.start = this.start), "end" in this && (t.end = this.end), this.assignOp && (t.assignOp = unevalableConst(this.assignOp));
    for (var r in this) this.hasOwnProperty(r) && !(r in TO_SOURCE_SKIP) && (t[r] = this[r]);
    try {
      return t.toSource()
    } finally {
      delete this.generatingSource
    }
  }, Np.push = function (e) {
    return e !== null && (e.start < this.start && (this.start = e.start), this.end < e.end && (this.end = e.end)), this.children.push(e)
  }, Node.indentLevel = 0, Np.toString = function () {
    var e = [];
    for (var t in this) this.hasOwnProperty(t) && t !== "type" && t !== "target" && e.push({
      id: t,
      value: this[t]
    });
    e.sort(function (e, t) {
      return e.id < t.id ? -1 : 1
    });
    var n = "    ",
      r = ++Node.indentLevel,
      i = "{\n" + n.repeat(r) + "type: " + tokenString(this.type);
    for (t = 0; t < e.length; t++) i += ",\n" + n.repeat(r) + e[t].id + ": " + e[t].value;
    return r = --Node.indentLevel, i += "\n" + n.repeat(r) + "}", i
  }, Np.synth = function (e) {
    var t = new SyntheticNode(e);
    return t.filename = this.filename, t.lineno = this.lineno, t.start = this.start, t.end = this.end, t
  };
  var LOOP_INIT = {
    isLoop: !0
  };
  definitions.defineGetter(Np, "length", function () {
    throw new Error("Node.prototype.length is gone; use n.children.length instead")
  }), definitions.defineProperty(String.prototype, "repeat", function (e) {
    var t = "",
      n = this + t;
    while (--e >= 0) t += n;
    return t
  }, !1, !1, !0), Pp.MaybeLeftParen = function () {
    return this.parenFreeMode ? this.match(LEFT_PAREN) ? LEFT_PAREN : END : this.mustMatch(LEFT_PAREN)
      .type
  }, Pp.MaybeRightParen = function (t) {
    t === LEFT_PAREN && this.mustMatch(RIGHT_PAREN)
  }, Pp.Statements = function (t, n) {
    var r = !!n;
    try {
      while (!this.done() && this.peek(!0) !== RIGHT_CURLY) {
        var i = this.Statement();
        t.push(i), r && Pragma(i) ? (this.x.strictMode = !0, t.strict = !0) : r = !1
      }
    } catch (s) {
      try {
        this.done() && (this.unexpectedEOF = !0)
      } catch (s) {}
      throw s
    }
  }, Pp.Block = function () {
    this.mustMatch(LEFT_CURLY);
    var t = this.newNode(blockInit()),
      n = this.x.update({
        parentBlock: t
      })
      .pushTarget(t);
    return this.withContext(n, function () {
      this.Statements(t)
    }), this.mustMatch(RIGHT_CURLY), t
  };
  var DECLARED_FORM = 0,
    EXPRESSED_FORM = 1,
    STATEMENT_FORM = 2;
  Pp.Statement = function () {
    var t, n, r, i, s, o, u, a = this.t.get(!0),
      f, l, c, h, p = this.t.blockComments;
    switch (a) {
    case IMPORT:
      this.x.canImport() || this.fail("illegal context for import statement"), r = this.newNode(), r.pathList = this.ImportPathList(), this.x.parentScript.impDecls.push(r);
      break;
    case EXPORT:
      this.x.canExport() || this.fail("export statement not in module top level");
      switch (this.peek()) {
      case MODULE:
      case FUNCTION:
      case LET:
      case VAR:
      case CONST:
        return r = this.Statement(), r.blockComments = p, r.exported = !0, this.x.parentScript.expDecls.push(r), registerExport(this.x.parentScript.exports, r), r
      }
      r = this.newNode(), r.pathList = this.ExportPathList(), this.x.parentScript.expDecls.push(r), registerExport(this.x.parentScript.exports, r);
      break;
    case FUNCTION:
      return this.FunctionDefinition(!0, this.x.topLevel ? DECLARED_FORM : STATEMENT_FORM, p);
    case LEFT_CURLY:
      return r = this.newNode(blockInit()), c = this.x.update({
          parentBlock: r
        })
        .pushTarget(r)
        .nest(), this.withContext(c, function () {
          this.Statements(r)
        }), this.mustMatch(RIGHT_CURLY), r;
    case IF:
      return r = this.newNode(), r.condition = this.HeadExpression(), c = this.x.pushTarget(r)
        .nest(), this.withContext(c, function () {
          r.thenPart = this.Statement(), r.elsePart = this.match(ELSE, !0) ? this.Statement() : null
        }), r;
    case SWITCH:
      return r = this.newNode({
          cases: [],
          defaultIndex: -1
        }), r.discriminant = this.HeadExpression(), c = this.x.pushTarget(r)
        .nest(), this.withContext(c, function () {
          this.mustMatch(LEFT_CURLY);
          while ((a = this.t.get()) !== RIGHT_CURLY) {
            switch (a) {
            case DEFAULT:
              r.defaultIndex >= 0 && this.fail("More than one switch default");
            case CASE:
              i = this.newNode(), a === DEFAULT ? r.defaultIndex = r.cases.length : i.caseLabel = this.Expression(COLON);
              break;
            default:
              this.fail("Invalid switch case")
            }
            this.mustMatch(COLON), i.statements = this.newNode(blockInit());
            while ((a = this.peek(!0)) !== CASE && a !== DEFAULT && a !== RIGHT_CURLY) i.statements.push(this.Statement());
            r.cases.push(i)
          }
        }), r;
    case FOR:
      return r = this.newNode(LOOP_INIT), r.blockComments = p, this.match(IDENTIFIER) && (this.t.token.value === "each" ? r.isEach = !0 : this.t.unget()), this.parenFreeMode || this.mustMatch(LEFT_PAREN), c = this.x.pushTarget(r)
        .nest(), h = this.x.update({
          inForLoopInit: !0
        }), i = null, (a = this.peek(!0)) !== SEMICOLON && this.withContext(h, function () {
          a === VAR || a === CONST ? (this.t.get(), i = this.Variables()) : a === LET ? (this.t.get(), this.peek() === LEFT_PAREN ? i = this.LetBlock(!1) : (this.x.parentBlock = r, r.varDecls = [], i = this.Variables())) : i = this.Expression()
        }), i && this.match(IN) ? (r.type = FOR_IN, this.withContext(h, function () {
          r.object = this.Expression();
          if (i.type === VAR || i.type === LET) {
            o = i.children;
            if (o.length !== 1 && i.destructurings.length !== 1) throw new SyntaxError("Invalid for..in left-hand side", this.filename, i.lineno);
            i.destructurings.length > 0 ? r.iterator = i.destructurings[0] : r.iterator = o[0], r.varDecl = i
          } else {
            if (i.type === ARRAY_INIT || i.type === OBJECT_INIT) i.destructuredNames = this.checkDestructuring(i);
            r.iterator = i
          }
        })) : (h.inForLoopInit = !1, r.setup = i, this.mustMatch(SEMICOLON), r.isEach && this.fail("Invalid for each..in loop"), this.withContext(h, function () {
          r.condition = this.peek(!0) === SEMICOLON ? null : this.Expression(), this.mustMatch(SEMICOLON), f = this.peek(!0), r.update = (this.parenFreeMode ? f === LEFT_CURLY || definitions.isStatementStartCode[f] : f === RIGHT_PAREN) ? null : this.Expression()
        })), this.parenFreeMode || this.mustMatch(RIGHT_PAREN), this.withContext(c, function () {
          r.body = this.Statement()
        }), r;
    case WHILE:
      return r = this.newNode({
          isLoop: !0
        }), r.blockComments = p, r.condition = this.HeadExpression(), c = this.x.pushTarget(r)
        .nest(), this.withContext(c, function () {
          r.body = this.Statement()
        }), r;
    case DO:
      return r = this.newNode({
          isLoop: !0
        }), r.blockComments = p, c = this.x.pushTarget(r)
        .next(), this.withContext(c, function () {
          r.body = this.Statement()
        }), this.mustMatch(WHILE), r.condition = this.HeadExpression(), this.match(SEMICOLON), r;
    case BREAK:
    case CONTINUE:
      r = this.newNode(), r.blockComments = p, c = this.x.pushTarget(r), this.peekOnSameLine() === IDENTIFIER && (this.t.get(), r.label = this.t.token.value), r.label ? r.target = c.labeledTargets.find(function (e) {
        return e.labels.has(r.label)
      }) : a === CONTINUE ? r.target = c.defaultLoopTarget : r.target = c.defaultTarget, r.target || this.fail("Invalid " + (a === BREAK ? "break" : "continue")), !r.target.isLoop && a === CONTINUE && this.fail("Invalid continue");
      break;
    case TRY:
      r = this.newNode({
        catchClauses: []
      }), r.blockComments = p, r.tryBlock = this.Block();
      while (this.match(CATCH)) {
        i = this.newNode(), s = this.MaybeLeftParen();
        switch (this.t.get()) {
        case LEFT_BRACKET:
        case LEFT_CURLY:
          this.t.unget(), i.varName = this.DestructuringExpression(!0);
          break;
        case IDENTIFIER:
          i.varName = this.t.token.value;
          break;
        default:
          this.fail("missing identifier in catch")
        }
        this.match(IF) && (this.mozillaMode || this.fail("Illegal catch guard"), r.catchClauses.length && !r.catchClauses.top()
          .guard && this.fail("Guarded catch after unguarded"), i.guard = this.Expression()), this.MaybeRightParen(s), i.block = this.Block(), r.catchClauses.push(i)
      }
      return this.match(FINALLY) && (r.finallyBlock = this.Block()), !r.catchClauses.length && !r.finallyBlock && this.fail("Invalid try statement"), r;
    case CATCH:
    case FINALLY:
      this.fail(definitions.tokens[a] + " without preceding try");
    case THROW:
      r = this.newNode(), r.exception = this.Expression();
      break;
    case RETURN:
      r = this.ReturnOrYield();
      break;
    case WITH:
      return this.x.banWith() && this.fail("with statements not allowed in strict code or modules"), r = this.newNode(), r.blockComments = p, r.object = this.HeadExpression(), c = this.x.pushTarget(r)
        .next(), this.withContext(c, function () {
          r.body = this.Statement()
        }), r;
    case VAR:
    case CONST:
      r = this.Variables();
      break;
    case LET:
      if (this.peek() === LEFT_PAREN) return r = this.LetBlock(!0), r;
      r = this.Variables();
      break;
    case DEBUGGER:
      r = this.newNode();
      break;
    case NEWLINE:
    case SEMICOLON:
      return r = this.newNode({
        type: SEMICOLON
      }), r.blockComments = p, r.expression = null, r;
    case IDENTIFIER:
    case USE:
    case MODULE:
      switch (this.t.token.value) {
      case "use":
        if (!isPragmaToken(this.peekOnSameLine())) {
          this.t.unget();
          break
        }
        return this.newNode({
          type: USE,
          params: this.Pragmas()
        });
      case "module":
        this.x.modulesAllowed() || this.fail("module declaration not at top level"), this.x.parentScript.hasModules = !0, a = this.peekOnSameLine();
        if (a !== IDENTIFIER && a !== LEFT_CURLY) {
          this.t.unget();
          break
        }
        r = this.newNode({
          type: MODULE
        }), r.blockComments = p, this.mustMatch(IDENTIFIER), n = this.t.token.value;
        if (this.match(LEFT_CURLY)) return r.name = n, r.body = this.Script(!0, !1), r.module = new Module(r), this.mustMatch(RIGHT_CURLY), this.x.parentScript.modDefns.set(r.name, r), r;
        return this.t.unget(), this.ModuleVariables(r), r;
      default:
        a = this.peek();
        if (a === COLON) return n = this.t.token.value, this.x.allLabels.has(n) && this.fail("Duplicate label: " + n), this.t.get(), r = this.newNode({
            type: LABEL,
            label: n
          }), r.blockComments = p, c = this.x.pushLabel(n)
          .nest(), this.withContext(c, function () {
            r.statement = this.Statement()
          }), r.target = r.statement.type === LABEL ? r.statement.target : r.statement, r
      };
    default:
      r = this.newNode({
        type: SEMICOLON
      }), this.t.unget(), r.blockComments = p, r.expression = this.Expression(), r.end = r.expression.end
    }
    return r.blockComments = p, this.MagicalSemicolon(), r
  }, Pp.Pragmas = function () {
    var t = [];
    do t.push(this.Pragma()); while (this.match(COMMA));
    return this.MagicalSemicolon(), t
  }, Pp.Pragma = function () {
    var t = [],
      n;
    do n = this.t.get(!0), t.push(this.t.token); while (isPragmaToken(this.peek()));
    return t
  }, Pp.MagicalSemicolon = function () {
    var t;
    this.t.lineno === this.t.token.lineno && (t = this.peekOnSameLine(), t !== END && t !== NEWLINE && t !== SEMICOLON && t !== RIGHT_CURLY && this.fail("missing ; before statement")), this.match(SEMICOLON)
  }, Pp.ReturnOrYield = function () {
    var t, n, r = this.t.token.type,
      i, s = this.x.parentScript;
    return r === RETURN ? this.x.inFunction || this.fail("Return not in function") : (this.x.inFunction || this.fail("Yield not in function"), s.hasYield = !0), t = this.newNode({
      value: undefined
    }), i = r === RETURN ? this.peekOnSameLine(!0) : this.peek(!0), i !== END && i !== NEWLINE && i !== SEMICOLON && i !== RIGHT_CURLY && (r !== YIELD || i !== r && i !== RIGHT_BRACKET && i !== RIGHT_PAREN && i !== COLON && i !== COMMA) ? r === RETURN ? (t.value = this.Expression(), s.hasReturnWithValue = !0) : t.value = this.AssignExpression() : r === RETURN && (s.hasEmptyReturn = !0), t
  }, Pp.ModuleExpression = function () {
    return this.match(STRING) ? this.newNode() : this.QualifiedPath()
  }, Pp.ImportPathList = function () {
    var t = [];
    do t.push(this.ImportPath()); while (this.match(COMMA));
    return t
  }, Pp.ImportPath = function () {
    var t = this.QualifiedPath();
    if (!this.match(DOT)) return t.type === IDENTIFIER && this.fail("cannot import local variable"), t;
    var n = this.newNode();
    return n.push(t), n.push(this.ImportSpecifierSet()), n
  }, Pp.ExplicitSpecifierSet = function (t) {
    var n, r, i, s;
    n = this.newNode({
      type: OBJECT_INIT
    }), this.mustMatch(LEFT_CURLY);
    if (!this.match(RIGHT_CURLY))
      do i = this.Identifier(), this.match(COLON) ? (r = this.newNode({
        type: PROPERTY_INIT
      }), r.push(i), r.push(t()), n.push(r)) : n.push(i); while (!this.match(RIGHT_CURLY) && this.mustMatch(COMMA));
    return n
  }, Pp.ImportSpecifierSet = function () {
    var t = this;
    return this.match(MUL) ? this.newNode({
      type: IDENTIFIER,
      name: "*"
    }) : ExplicitSpecifierSet(function () {
      return t.Identifier()
    })
  }, Pp.Identifier = function () {
    return this.mustMatch(IDENTIFIER), this.newNode({
      type: IDENTIFIER
    })
  }, Pp.IdentifierName = function () {
    return this.mustMatch(IDENTIFIER, !0), this.newNode({
      type: IDENTIFIER
    })
  }, Pp.QualifiedPath = function () {
    var t, n;
    t = this.Identifier();
    while (this.match(DOT)) {
      if (this.peek() !== IDENTIFIER) {
        this.t.unget();
        break
      }
      n = this.newNode(), n.push(t), n.push(this.Identifier()), t = n
    }
    return t
  }, Pp.ExportPath = function () {
    var t = this;
    return this.peek() === LEFT_CURLY ? this.ExplicitSpecifierSet(function () {
      return t.QualifiedPath()
    }) : this.QualifiedPath()
  }, Pp.ExportPathList = function () {
    var t = [];
    do t.push(this.ExportPath()); while (this.match(COMMA));
    return t
  }, Pp.FunctionDefinition = function (t, n, r) {
    var i, s = this.newNode({
      params: [],
      paramComments: []
    });
    typeof r == "undefined" && (r = null), s.blockComments = r, s.type !== FUNCTION && (s.type = s.value === "get" ? GETTER : SETTER), this.match(MUL) && (s.isExplicitGenerator = !0), this.match(IDENTIFIER, !1, !0) ? s.name = this.t.token.value : t && this.fail("missing function identifier");
    var o = this.x.inModule;
    x2 = new StaticContext(null, null, o, !0, this.x.strictMode), this.withContext(x2, function () {
      this.mustMatch(LEFT_PAREN);
      if (!this.match(RIGHT_PAREN)) {
        do {
          i = this.t.get(), s.paramComments.push(this.t.lastBlockComment());
          switch (i) {
          case LEFT_BRACKET:
          case LEFT_CURLY:
            this.t.unget(), s.params.push(this.DestructuringExpression());
            break;
          case IDENTIFIER:
            s.params.push(this.t.token.value);
            break;
          default:
            this.fail("missing formal parameter")
          }
        } while (this.match(COMMA));
        this.mustMatch(RIGHT_PAREN)
      }
      i = this.t.get(!0), i !== LEFT_CURLY && this.t.unget(), i !== LEFT_CURLY ? s.body = this.AssignExpression() : s.body = this.Script(o, !0)
    }), i === LEFT_CURLY && this.mustMatch(RIGHT_CURLY), s.end = this.t.token.end, s.functionForm = n, n === DECLARED_FORM && this.x.parentScript.funDecls.push(s), this.x.inModule && !s.isExplicitGenerator && s.body.hasYield && this.fail("yield in non-generator function");
    if (s.isExplicitGenerator || s.body.hasYield) s.body = this.newNode({
      type: GENERATOR,
      body: s.body
    });
    return s
  }, Pp.ModuleVariables = function (t) {
    var n, r;
    do n = this.Identifier(), this.match(ASSIGN) && (r = this.ModuleExpression(), n.initializer = r, r.type === STRING ? this.x.parentScript.modLoads.set(n.value, r.value) : this.x.parentScript.modAssns.set(n.value, n)), t.push(n); while (this.match(COMMA))
  }, Pp.Variables = function (t) {
    var n, r, i, s, o, u;
    u = this.t.token.type;
    switch (u) {
    case VAR:
    case CONST:
      o = this.x.parentScript;
      break;
    case LET:
      o = this.x.parentBlock;
      break;
    case LEFT_PAREN:
      u = LET, o = t
    }
    n = this.newNode({
      type: u,
      destructurings: []
    });
    do {
      u = this.t.get();
      if (u === LEFT_BRACKET || u === LEFT_CURLY) {
        this.t.unget();
        var a = this.DestructuringExpression(!0);
        r = this.newNode({
          type: IDENTIFIER,
          name: a,
          readOnly: n.type === CONST
        }), n.push(r), pushDestructuringVarDecls(r.name.destructuredNames, o), n.destructurings.push({
          exp: a,
          decl: r
        });
        if (this.x.inForLoopInit && this.peek() === IN) continue;
        this.mustMatch(ASSIGN), this.t.token.assignOp && this.fail("Invalid variable initialization"), r.blockComment = this.t.lastBlockComment(), r.initializer = this.AssignExpression();
        continue
      }
      u !== IDENTIFIER && this.fail("missing variable name"), r = this.newNode({
        type: IDENTIFIER,
        name: this.t.token.value,
        readOnly: n.type === CONST
      }), n.push(r), o.varDecls.push(r);
      if (this.match(ASSIGN)) {
        var f = this.t.lastBlockComment();
        this.t.token.assignOp && this.fail("Invalid variable initialization"), r.initializer = this.AssignExpression()
      } else var f = this.t.lastBlockComment();
      r.blockComment = f
    } while (this.match(COMMA));
    return n
  }, Pp.LetBlock = function (t) {
    var n, r;
    return n = this.newNode({
      type: LET_BLOCK,
      varDecls: []
    }), this.mustMatch(LEFT_PAREN), n.variables = this.Variables(n), this.mustMatch(RIGHT_PAREN), t && this.peek() !== LEFT_CURLY && (r = this.newNode({
      type: SEMICOLON,
      expression: n
    }), t = !1), t ? n.block = this.Block() : n.expression = this.AssignExpression(), n
  }, Pp.checkDestructuring = function (t, n) {
    t.type === ARRAY_COMP && this.fail("Invalid array comprehension left-hand side");
    if (t.type !== ARRAY_INIT && t.type !== OBJECT_INIT) return;
    var r = {},
      i, s, o, u, a, f = t.children;
    for (var l = 0, c = f.length; l < c; l++) {
      if (!(i = f[l])) continue;
      i.type === PROPERTY_INIT ? (a = i.children, u = a[1], o = a[0].value) : t.type === OBJECT_INIT ? (u = i, o = i.value) : (u = i, o = l), u.type === ARRAY_INIT || u.type === OBJECT_INIT ? r[o] = this.checkDestructuring(u, n) : (n && u.type !== IDENTIFIER && this.fail("missing name in pattern"), r[o] = u)
    }
    return r
  }, Pp.DestructuringExpression = function (t) {
    var n = this.PrimaryExpression();
    return n.destructuredNames = this.checkDestructuring(n, t), n
  }, Pp.GeneratorExpression = function (t) {
    return this.newNode({
      type: GENERATOR,
      expression: t,
      tail: this.ComprehensionTail()
    })
  }, Pp.ComprehensionTail = function () {
    var t, n, r, i, s;
    t = this.newNode({
      type: COMP_TAIL
    });
    do {
      n = this.newNode({
        type: FOR_IN,
        isLoop: !0
      }), this.match(IDENTIFIER) && (this.mozillaMode && this.t.token.value === "each" ? n.isEach = !0 : this.t.unget()), s = this.MaybeLeftParen();
      switch (this.t.get()) {
      case LEFT_BRACKET:
      case LEFT_CURLY:
        this.t.unget(), n.iterator = this.DestructuringExpression();
        break;
      case IDENTIFIER:
        n.iterator = i = this.newNode({
          type: IDENTIFIER
        }), i.name = i.value, n.varDecl = r = this.newNode({
          type: VAR
        }), r.push(i), this.x.parentScript.varDecls.push(i);
        break;
      default:
        this.fail("missing identifier")
      }
      this.mustMatch(IN), n.object = this.Expression(), this.MaybeRightParen(s), t.push(n)
    } while (this.match(FOR));
    return this.match(IF) && (t.guard = this.HeadExpression()), t
  }, Pp.HeadExpression = function () {
    var t = this.MaybeLeftParen(),
      n = this.ParenExpression();
    this.MaybeRightParen(t);
    if (t === END && !n.parenthesized) {
      var r = this.peek();
      r !== LEFT_CURLY && !definitions.isStatementStartCode[r] && this.fail("Unparenthesized head followed by unbraced body")
    }
    return n
  }, Pp.ParenExpression = function () {
    var t = this.x.update({
        inForLoopInit: this.x.inForLoopInit && this.t.token.type === LEFT_PAREN
      }),
      n = this.withContext(t, function () {
        return this.Expression()
      });
    return this.match(FOR) && (n.type === YIELD && !n.parenthesized && this.fail("Yield expression must be parenthesized"), n.type === COMMA && !n.parenthesized && this.fail("Generator expression must be parenthesized"), n = this.GeneratorExpression(n)), n
  }, Pp.Expression = function () {
    var t, n;
    t = this.AssignExpression();
    if (this.match(COMMA)) {
      n = this.newNode({
        type: COMMA
      }), n.push(t), t = n;
      do n = t.children[t.children.length - 1], n.type === YIELD && !n.parenthesized && this.fail("Yield expression must be parenthesized"), t.push(this.AssignExpression()); while (this.match(COMMA))
    }
    return t
  }, Pp.AssignExpression = function () {
    var t, n;
    if (this.match(YIELD, !0)) return this.ReturnOrYield();
    t = this.newNode({
      type: ASSIGN
    }), n = this.ConditionalExpression();
    if (!this.match(ASSIGN)) return n;
    t.blockComment = this.t.lastBlockComment();
    switch (n.type) {
    case OBJECT_INIT:
    case ARRAY_INIT:
      n.destructuredNames = this.checkDestructuring(n);
    case IDENTIFIER:
    case DOT:
    case INDEX:
    case CALL:
      break;
    default:
      this.fail("Bad left-hand side of assignment")
    }
    return t.assignOp = n.assignOp = this.t.token.assignOp, t.push(n), t.push(this.AssignExpression()), t
  }, Pp.ConditionalExpression = function () {
    var t, n;
    t = this.OrExpression();
    if (this.match(HOOK)) {
      n = t, t = this.newNode({
        type: HOOK
      }), t.push(n);
      var r = this.x.update({
        inForLoopInit: !1
      });
      this.withContext(r, function () {
        t.push(this.AssignExpression())
      }), this.match(COLON) || this.fail("missing : after ?"), t.push(this.AssignExpression())
    }
    return t
  }, Pp.OrExpression = function () {
    var t, n;
    t = this.AndExpression();
    while (this.match(OR)) n = this.newNode(), n.push(t), n.push(this.AndExpression()), t = n;
    return t
  }, Pp.AndExpression = function () {
    var t, n;
    t = this.BitwiseOrExpression();
    while (this.match(AND)) n = this.newNode(), n.push(t), n.push(this.BitwiseOrExpression()), t = n;
    return t
  }, Pp.BitwiseOrExpression = function () {
    var t, n;
    t = this.BitwiseXorExpression();
    while (this.match(BITWISE_OR)) n = this.newNode(), n.push(t), n.push(this.BitwiseXorExpression()), t = n;
    return t
  }, Pp.BitwiseXorExpression = function () {
    var t, n;
    t = this.BitwiseAndExpression();
    while (this.match(BITWISE_XOR)) n = this.newNode(), n.push(t), n.push(this.BitwiseAndExpression()), t = n;
    return t
  }, Pp.BitwiseAndExpression = function () {
    var t, n;
    t = this.EqualityExpression();
    while (this.match(BITWISE_AND)) n = this.newNode(), n.push(t), n.push(this.EqualityExpression()), t = n;
    return t
  }, Pp.EqualityExpression = function () {
    var t, n;
    t = this.RelationalExpression();
    while (this.match(EQ) || this.match(NE) || this.match(STRICT_EQ) || this.match(STRICT_NE)) n = this.newNode(), n.push(t), n.push(this.RelationalExpression()), t = n;
    return t
  }, Pp.RelationalExpression = function () {
    var t, n, r = this.x.update({
      inForLoopInit: !1
    });
    return this.withContext(r, function () {
      t = this.ShiftExpression();
      while (this.match(LT) || this.match(LE) || this.match(GE) || this.match(GT) || !this.x.inForLoopInit && this.match(IN) || this.match(INSTANCEOF)) n = this.newNode(), n.push(t), n.push(this.ShiftExpression()), t = n
    }), t
  }, Pp.ShiftExpression = function () {
    var t, n;
    t = this.AddExpression();
    while (this.match(LSH) || this.match(RSH) || this.match(URSH)) n = this.newNode(), n.push(t), n.push(this.AddExpression()), t = n;
    return t
  }, Pp.AddExpression = function () {
    var t, n;
    t = this.MultiplyExpression();
    while (this.match(PLUS) || this.match(MINUS)) n = this.newNode(), n.push(t), n.push(this.MultiplyExpression()), t = n;
    return t
  }, Pp.MultiplyExpression = function () {
    var t, n;
    t = this.UnaryExpression();
    while (this.match(MUL) || this.match(DIV) || this.match(MOD)) n = this.newNode(), n.push(t), n.push(this.UnaryExpression()), t = n;
    return t
  }, Pp.UnaryExpression = function () {
    var t, n, r;
    switch (r = this.t.get(!0)) {
    case DELETE:
    case VOID:
    case TYPEOF:
    case NOT:
    case BITWISE_NOT:
    case PLUS:
    case MINUS:
      r === PLUS ? t = this.newNode({
        type: UNARY_PLUS
      }) : r === MINUS ? t = this.newNode({
        type: UNARY_MINUS
      }) : t = this.newNode(), t.push(this.UnaryExpression());
      break;
    case INCREMENT:
    case DECREMENT:
      t = this.newNode(), t.push(this.MemberExpression(!0));
      break;
    default:
      this.t.unget(), t = this.MemberExpression(!0), this.t.tokens[this.t.tokenIndex + this.t.lookahead - 1 & 3].lineno === this.t.lineno && (this.match(INCREMENT) || this.match(DECREMENT)) && (n = this.newNode({
        postfix: !0
      }), n.push(t), t = n)
    }
    return t
  }, Pp.MemberExpression = function (t) {
    var n, r, i, s;
    this.match(NEW) ? (n = this.newNode(), n.push(this.MemberExpression(!1)), this.match(LEFT_PAREN) && (n.type = NEW_WITH_ARGS, n.push(this.ArgumentList()))) : n = this.PrimaryExpression();
    while ((s = this.t.get()) !== END) {
      switch (s) {
      case DOT:
        r = this.newNode(), r.push(n), r.push(this.IdentifierName());
        break;
      case LEFT_BRACKET:
        r = this.newNode({
          type: INDEX
        }), r.push(n), r.push(this.Expression()), this.mustMatch(RIGHT_BRACKET);
        break;
      case LEFT_PAREN:
        if (t) {
          r = this.newNode({
            type: CALL
          }), r.push(n), r.push(this.ArgumentList());
          break
        };
      default:
        return this.t.unget(), n
      }
      n = r
    }
    return n
  }, Pp.ArgumentList = function () {
    var t, n;
    t = this.newNode({
      type: LIST
    });
    if (this.match(RIGHT_PAREN, !0)) return t;
    do n = this.AssignExpression(), n.type === YIELD && !n.parenthesized && this.peek() === COMMA && this.fail("Yield expression must be parenthesized"), this.match(FOR) && (n = this.GeneratorExpression(n), (t.children.length > 1 || this.peek(!0) === COMMA) && this.fail("Generator expression must be parenthesized")), t.push(n); while (this.match(COMMA));
    return this.mustMatch(RIGHT_PAREN), t
  }, Pp.PrimaryExpression = function () {
    var t, n, r = this.t.get(!0);
    switch (r) {
    case FUNCTION:
      t = this.FunctionDefinition(!1, EXPRESSED_FORM);
      break;
    case LEFT_BRACKET:
      t = this.newNode({
        type: ARRAY_INIT
      });
      while ((r = this.peek(!0)) !== RIGHT_BRACKET) {
        if (r === COMMA) {
          this.t.get(), t.push(null);
          continue
        }
        t.push(this.AssignExpression());
        if (r !== COMMA && !this.match(COMMA)) break
      }
      t.children.length === 1 && this.match(FOR) && (n = this.newNode({
        type: ARRAY_COMP,
        expression: t.children[0],
        tail: this.ComprehensionTail()
      }), t = n), this.mustMatch(RIGHT_BRACKET);
      break;
    case LEFT_CURLY:
      var i, s;
      t = this.newNode({
        type: OBJECT_INIT
      });
      e: if (!this.match(RIGHT_CURLY)) {
        do {
          r = this.t.get();
          if (this.t.token.value !== "get" && this.t.token.value !== "set" || this.peek() !== IDENTIFIER) {
            var o = this.t.blockComments;
            switch (r) {
            case IDENTIFIER:
            case NUMBER:
            case STRING:
              i = this.newNode({
                type: IDENTIFIER
              });
              break;
            case RIGHT_CURLY:
              break e;
            default:
              if (this.t.token.value in definitions.keywords) {
                i = this.newNode({
                  type: IDENTIFIER
                });
                break
              }
              this.fail("Invalid property name")
            }
            this.match(COLON) ? (n = this.newNode({
              type: PROPERTY_INIT
            }), n.push(i), n.push(this.AssignExpression()), n.blockComments = o, t.push(n)) : (this.peek() !== COMMA && this.peek() !== RIGHT_CURLY && this.fail("missing : after property"), t.push(i))
          } else t.push(this.FunctionDefinition(!0, EXPRESSED_FORM))
        } while (this.match(COMMA));
        this.mustMatch(RIGHT_CURLY)
      }
      break;
    case LEFT_PAREN:
      t = this.ParenExpression(), this.mustMatch(RIGHT_PAREN), t.parenthesized = !0;
      break;
    case LET:
      t = this.LetBlock(!1);
      break;
    case NULL:
    case THIS:
    case TRUE:
    case FALSE:
    case IDENTIFIER:
    case NUMBER:
    case STRING:
    case REGEXP:
      t = this.newNode();
      break;
    default:
      this.fail("missing operand; found " + definitions.tokens[r])
    }
    return t
  }, exports.parse = parse, exports.parseStdin = parseStdin, exports.parseFunction = parseFunction, exports.Node = Node, exports.DECLARED_FORM = DECLARED_FORM, exports.EXPRESSED_FORM = EXPRESSED_FORM, exports.STATEMENT_FORM = STATEMENT_FORM, exports.Tokenizer = Tokenizer, exports.Parser = Parser, exports.Module = Module, exports.Export = Export
}), define("ace/narcissus/lexer", ["require", "exports", "module", "ace/narcissus/definitions"], function (require, exports, module) {
  function isValidIdentifierChar(e, t) {
    if (e <= "") return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "$" || e === "_" || !t && e >= "0" && e <= "9" ? !0 : !1;
    var n = {};
    n["x" + e] = !0, n[e] = !0;
    var r = !1;
    try {
      r = Function("x", "return (x." + (t ? "" : "x") + e + ");")(n) === !0
    } catch (i) {}
    return r
  }

  function isIdentifier(e) {
    if (typeof e != "string") return !1;
    if (e.length === 0) return !1;
    if (!isValidIdentifierChar(e[0], !0)) return !1;
    for (var t = 1; t < e.length; t++)
      if (!isValidIdentifierChar(e[t], !1)) return !1;
    return !0
  }

  function Tokenizer(e, t, n, r) {
    this.cursor = 0, this.source = String(e), this.tokens = [], this.tokenIndex = 0, this.lookahead = 0, this.scanNewlines = !1, this.filename = t || "", this.lineno = n || 1, this.allowHTMLComments = r, this.blockComments = null
  }
  var definitions = require("./definitions");
  eval(definitions.consts);
  var opTokens = {};
  for (var op in definitions.opTypeNames) {
    if (op === "\n" || op === ".") continue;
    var node = opTokens;
    for (var i = 0; i < op.length; i++) {
      var ch = op[i];
      ch in node || (node[ch] = {}), node = node[ch], node.op = op
    }
  }
  Tokenizer.prototype = {
    get done() {
      return this.peek(!0) === END
    }, get token() {
      return this.tokens[this.tokenIndex]
    }, match: function (e, t, n) {
      return this.get(t, n) === e || this.unget()
    },
    mustMatch: function (e, t) {
      if (!this.match(e, !1, t)) throw this.newSyntaxError("Missing " + definitions.tokens[e].toLowerCase());
      return this.token
    },
    peek: function (e) {
      var t, n;
      return this.lookahead ? (n = this.tokens[this.tokenIndex + this.lookahead & 3], t = this.scanNewlines && n.lineno !== this.lineno ? NEWLINE : n.type) : (t = this.get(e), this.unget()), t
    },
    peekOnSameLine: function (e) {
      this.scanNewlines = !0;
      var t = this.peek(e);
      return this.scanNewlines = !1, t
    },
    lastBlockComment: function () {
      var e = this.blockComments.length;
      return e ? this.blockComments[e - 1] : null
    },
    skip: function () {
      var e = this.source;
      this.blockComments = [];
      for (;;) {
        var t = e[this.cursor++],
          n = e[this.cursor];
        if (t === "\r") {
          if (n === "\n") continue;
          t = "\n"
        }
        if (t === "\n" && !this.scanNewlines) this.lineno++;
        else if (t === "/" && n === "*") {
          var r = ++this.cursor;
          for (;;) {
            t = e[this.cursor++];
            if (t === undefined) throw this.newSyntaxError("Unterminated comment");
            if (t === "*") {
              n = e[this.cursor];
              if (n === "/") {
                var i = this.cursor - 1;
                this.cursor++;
                break
              }
            } else t === "\n" && this.lineno++
          }
          this.blockComments.push(e.substring(r, i))
        } else if (t === "/" && n === "/" || this.allowHTMLComments && t === "<" && n === "!" && e[this.cursor + 1] === "-" && e[this.cursor + 2] === "-" && (this.cursor += 2)) {
          this.cursor++;
          for (;;) {
            t = e[this.cursor++], n = e[this.cursor];
            if (t === undefined) return;
            t === "\r" && n !== "\n" && (t = "\n");
            if (t === "\n") {
              this.scanNewlines ? this.cursor-- : this.lineno++;
              break
            }
          }
        } else if (!(t in definitions.whitespace)) {
          this.cursor--;
          return
        }
      }
    },
    lexExponent: function () {
      var e = this.source,
        t = e[this.cursor];
      if (t === "e" || t === "E") {
        this.cursor++, ch = e[this.cursor++];
        if (ch === "+" || ch === "-") ch = e[this.cursor++];
        if (ch < "0" || ch > "9") throw this.newSyntaxError("Missing exponent");
        do ch = e[this.cursor++]; while (ch >= "0" && ch <= "9");
        return this.cursor--, !0
      }
      return !1
    },
    lexZeroNumber: function (e) {
      var t = this.token,
        n = this.source;
      t.type = NUMBER, e = n[this.cursor++];
      if (e === ".") {
        do e = n[this.cursor++]; while (e >= "0" && e <= "9");
        this.cursor--, this.lexExponent(), t.value = parseFloat(n.substring(t.start, this.cursor))
      } else if (e === "x" || e === "X") {
        do e = n[this.cursor++]; while (e >= "0" && e <= "9" || e >= "a" && e <= "f" || e >= "A" && e <= "F");
        this.cursor--, t.value = parseInt(n.substring(t.start, this.cursor))
      } else if (e >= "0" && e <= "7") {
        do e = n[this.cursor++]; while (e >= "0" && e <= "7");
        this.cursor--, t.value = parseInt(n.substring(t.start, this.cursor))
      } else this.cursor--, this.lexExponent(), t.value = 0
    },
    lexNumber: function (e) {
      var t = this.token,
        n = this.source;
      t.type = NUMBER;
      var r = !1;
      do e = n[this.cursor++], e === "." && !r && (r = !0, e = n[this.cursor++]); while (e >= "0" && e <= "9");
      this.cursor--;
      var i = this.lexExponent();
      r = r || i;
      var s = n.substring(t.start, this.cursor);
      t.value = r ? parseFloat(s) : parseInt(s)
    },
    lexDot: function (e) {
      var t = this.token,
        n = this.source,
        r = n[this.cursor];
      if (r >= "0" && r <= "9") {
        do e = n[this.cursor++]; while (e >= "0" && e <= "9");
        this.cursor--, this.lexExponent(), t.type = NUMBER, t.value = parseFloat(n.substring(t.start, this.cursor))
      } else t.type = DOT, t.assignOp = null, t.value = "."
    },
    lexString: function (ch) {
      var token = this.token,
        input = this.source;
      token.type = STRING;
      var hasEscapes = !1,
        delim = ch;
      if (input.length <= this.cursor) throw this.newSyntaxError("Unterminated string literal");
      while ((ch = input[this.cursor++]) !== delim) {
        if (ch == "\n" || ch == "\r") throw this.newSyntaxError("Unterminated string literal");
        if (this.cursor == input.length) throw this.newSyntaxError("Unterminated string literal");
        if (ch === "\\") {
          hasEscapes = !0;
          if (++this.cursor == input.length) throw this.newSyntaxError("Unterminated string literal")
        }
      }
      token.value = hasEscapes ? eval(input.substring(token.start, this.cursor)) : input.substring(token.start + 1, this.cursor - 1)
    },
    lexRegExp: function (ch) {
      var token = this.token,
        input = this.source;
      token.type = REGEXP;
      do {
        ch = input[this.cursor++];
        if (ch === "\\") this.cursor++;
        else if (ch === "[") {
          do {
            if (ch === undefined) throw this.newSyntaxError("Unterminated character class");
            ch === "\\" && this.cursor++, ch = input[this.cursor++]
          } while (ch !== "]")
        } else if (ch === undefined) throw this.newSyntaxError("Unterminated regex")
      } while (ch !== "/");
      do ch = input[this.cursor++]; while (ch >= "a" && ch <= "z");
      this.cursor--, token.value = eval(input.substring(token.start, this.cursor))
    },
    lexOp: function (e) {
      var t = this.token,
        n = this.source,
        r = opTokens[e],
        i = n[this.cursor];
      i in r && (r = r[i], this.cursor++, i = n[this.cursor], i in r && (r = r[i], this.cursor++, i = n[this.cursor]));
      var s = r.op;
      definitions.assignOps[s] && n[this.cursor] === "=" ? (this.cursor++, t.type = ASSIGN, t.assignOp = definitions.tokenIds[definitions.opTypeNames[s]], s += "=") : (t.type = definitions.tokenIds[definitions.opTypeNames[s]], t.assignOp = null), t.value = s
    },
    lexIdent: function (e, t) {
      var n = this.token,
        r = e;
      while ((e = this.getValidIdentifierChar(!1)) !== null) r += e;
      n.type = IDENTIFIER, n.value = r;
      if (t) return;
      var i;
      if (this.parser.mozillaMode) {
        i = definitions.mozillaKeywords[r];
        if (i) {
          n.type = i;
          return
        }
      }
      if (this.parser.x.strictMode) {
        i = definitions.strictKeywords[r];
        if (i) {
          n.type = i;
          return
        }
      }
      i = definitions.keywords[r], i && (n.type = i)
    },
    get: function (e, t) {
      var n;
      while (this.lookahead) {
        --this.lookahead, this.tokenIndex = this.tokenIndex + 1 & 3, n = this.tokens[this.tokenIndex];
        if (n.type !== NEWLINE || this.scanNewlines) return n.type
      }
      this.skip(), this.tokenIndex = this.tokenIndex + 1 & 3, n = this.tokens[this.tokenIndex], n || (this.tokens[this.tokenIndex] = n = {});
      var r = this.source;
      if (this.cursor >= r.length) return n.type = END;
      n.start = this.cursor, n.lineno = this.lineno;
      var i = this.getValidIdentifierChar(!0),
        s = i === null ? r[this.cursor++] : null;
      if (i !== null) this.lexIdent(i, t);
      else if (e && s === "/") this.lexRegExp(s);
      else if (s in opTokens) this.lexOp(s);
      else if (s === ".") this.lexDot(s);
      else if (s >= "1" && s <= "9") this.lexNumber(s);
      else if (s === "0") this.lexZeroNumber(s);
      else if (s === '"' || s === "'") this.lexString(s);
      else {
        if (!this.scanNewlines || s !== "\n" && s !== "\r") throw this.newSyntaxError("Illegal token");
        s === "\r" && r[this.cursor] === "\n" && this.cursor++, n.type = NEWLINE, n.value = "\n", this.lineno++
      }
      return n.end = this.cursor, n.type
    },
    unget: function () {
      if (++this.lookahead === 4) throw "PANIC: too much lookahead!";
      this.tokenIndex = this.tokenIndex - 1 & 3
    },
    newSyntaxError: function (e) {
      e = (this.filename ? this.filename + ":" : "") + this.lineno + ": " + e;
      var t = new SyntaxError(e, this.filename, this.lineno);
      return t.source = this.source, t.cursor = this.lookahead ? this.tokens[this.tokenIndex + this.lookahead & 3].start : this.cursor, t
    },
    getValidIdentifierChar: function (e) {
      var t = this.source;
      if (this.cursor >= t.length) return null;
      var n = t[this.cursor];
      if (n === "\\" && t[this.cursor + 1] === "u") {
        try {
          n = String.fromCharCode(parseInt(t.substring(this.cursor + 2, this.cursor + 6), 16))
        } catch (r) {
          return null
        }
        this.cursor += 5
      }
      var i = isValidIdentifierChar(n, e);
      return i && this.cursor++, i ? n : null
    }
  }, exports.isIdentifier = isIdentifier, exports.Tokenizer = Tokenizer
}), define("ace/narcissus/definitions", ["require", "exports", "module"], function (require, exports, module) {
  function defineGetter(e, t, n, r, i) {
    Object.defineProperty(e, t, {
      get: n,
      configurable: !r,
      enumerable: !i
    })
  }

  function defineGetterSetter(e, t, n, r, i, s) {
    Object.defineProperty(e, t, {
      get: n,
      set: r,
      configurable: !i,
      enumerable: !s
    })
  }

  function defineMemoGetter(e, t, n, r, i) {
    Object.defineProperty(e, t, {
      get: function () {
        var s = n();
        return defineProperty(e, t, s, r, !0, i), s
      },
      configurable: !0,
      enumerable: !i
    })
  }

  function defineProperty(e, t, n, r, i, s) {
    Object.defineProperty(e, t, {
      value: n,
      writable: !i,
      configurable: !r,
      enumerable: !s
    })
  }

  function isNativeCode(e) {
    return typeof e == "function" && e.toString()
      .match(/\[native code\]/)
  }

  function apply(e, t, n) {
    return Fpapply.call(e, [t].concat(n))
  }

  function getPropertyDescriptor(e, t) {
    while (e) {
      if ({}.hasOwnProperty.call(e, t)) return Object.getOwnPropertyDescriptor(e, t);
      e = Object.getPrototypeOf(e)
    }
  }

  function getPropertyNames(e) {
    var t = Object.create(null, {});
    while (e) {
      var n = Object.getOwnPropertyNames(e);
      for (var r = 0, i = n.length; r < i; r++) t[n[r]] = !0;
      e = Object.getPrototypeOf(e)
    }
    return Object.keys(t)
  }

  function getOwnProperties(e) {
    var t = {};
    for (var n in Object.getOwnPropertyNames(e)) t[n] = Object.getOwnPropertyDescriptor(e, n);
    return t
  }

  function blacklistHandler(e, t) {
    var n = Object.create(null, {}),
      r = Dict.create(t)
      .mapObject(function (e) {
        return n
      });
    return mixinHandler(r, e)
  }

  function whitelistHandler(e, t) {
    var n = Object.create(null, {}),
      r = Dict.create(t)
      .mapObject(function (t) {
        return e
      });
    return mixinHandler(r, n)
  }

  function mixinHandler(e, t) {
    function n(n) {
      return hasOwn(e, n) ? e[n] : t
    }

    function r(e) {
      var t = getPropertyDescriptor(n(e), e);
      return t && (t.configurable = !0), t
    }

    function i() {
      var n = Object.getOwnPropertyNames(e)
        .filter(function (t) {
          return t in e[t]
        }),
        r = getPropertyNames(t)
        .filter(function (t) {
          return !hasOwn(e, t)
        });
      return n.concat(r)
    }

    function s() {
      var n = Object.getOwnPropertyNames(e)
        .filter(function (t) {
          return t in e[t]
        });
      for (name in t) hasOwn(e, name) || n.push(name);
      return n
    }

    function o(e) {
      return e in n(e)
    }
    return {
      getOwnPropertyDescriptor: r,
      getPropertyDescriptor: r,
      getOwnPropertyNames: i,
      defineProperty: function (e, t) {
        Object.defineProperty(n(e), e, t)
      },
      "delete": function (e) {
        var t = n(e);
        return delete t[e]
      },
      fix: function () {},
      has: o,
      hasOwn: o,
      get: function (e, t) {
        var r = n(t);
        return r[t]
      },
      set: function (e, t, r) {
        var i = n(t);
        return i[t] = r, !0
      },
      enumerate: s,
      keys: s
    }
  }

  function makePassthruHandler(e) {
    return {
      getOwnPropertyDescriptor: function (t) {
        var n = Object.getOwnPropertyDescriptor(e, t);
        return n.configurable = !0, n
      },
      getPropertyDescriptor: function (t) {
        var n = getPropertyDescriptor(e, t);
        return n.configurable = !0, n
      },
      getOwnPropertyNames: function () {
        return Object.getOwnPropertyNames(e)
      },
      defineProperty: function (t, n) {
        Object.defineProperty(e, t, n)
      },
      "delete": function (t) {
        return delete e[t]
      },
      fix: function () {
        return Object.isFrozen(e) ? getOwnProperties(e) : undefined
      },
      has: function (t) {
        return t in e
      },
      hasOwn: function (t) {
        return {}.hasOwnProperty.call(e, t)
      },
      get: function (t, n) {
        return e[n]
      },
      set: function (t, n, r) {
        return e[n] = r, !0
      },
      enumerate: function () {
        var t = [];
        for (name in e) t.push(name);
        return t
      },
      keys: function () {
        return Object.keys(e)
      }
    }
  }

  function hasOwn(e, t) {
    return hasOwnProperty.call(e, t)
  }

  function Dict(e, t) {
    this.table = e || Object.create(null, {}), this.size = t || 0
  }

  function Stack(e) {
    this.elts = e || null
  }
  var tokens = ["END", "\n", ";", ",", "=", "?", ":", "CONDITIONAL", "||", "&&", "|", "^", "&", "==", "!=", "===", "!==", "<", "<=", ">=", ">", "<<", ">>", ">>>", "+", "-", "*", "/", "%", "!", "~", "UNARY_PLUS", "UNARY_MINUS", "++", "--", ".", "[", "]", "{", "}", "(", ")", "SCRIPT", "BLOCK", "LABEL", "FOR_IN", "CALL", "NEW_WITH_ARGS", "INDEX", "ARRAY_INIT", "OBJECT_INIT", "PROPERTY_INIT", "GETTER", "SETTER", "GROUP", "LIST", "LET_BLOCK", "ARRAY_COMP", "GENERATOR", "COMP_TAIL", "IMPLEMENTS", "INTERFACE", "LET", "MODULE", "PACKAGE", "PRIVATE", "PROTECTED", "PUBLIC", "STATIC", "USE", "YIELD", "IDENTIFIER", "NUMBER", "STRING", "REGEXP", "break", "case", "catch", "const", "continue", "debugger", "default", "delete", "do", "else", "export", "false", "finally", "for", "function", "if", "import", "in", "instanceof", "new", "null", "return", "switch", "this", "throw", "true", "try", "typeof", "var", "void", "while", "with"],
    strictKeywords = {
      __proto__: null,
      "implements": !0,
      "interface": !0,
      let: !0,
      "package": !0,
      "private": !0,
      "protected": !0,
      "public": !0,
      "static": !0,
      use: !0,
      yield: !0
    },
    statementStartTokens = ["break", "const", "continue", "debugger", "do", "for", "if", "let", "return", "switch", "throw", "try", "var", "yield", "while", "with"],
    whitespaceChars = ["  ", "", "\f", " ", " ", "﻿", " ", "᠎", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "　"],
    whitespace = {};
  for (var i = 0; i < whitespaceChars.length; i++) whitespace[whitespaceChars[i]] = !0;
  var opTypeNames = {
      "\n": "NEWLINE",
      ";": "SEMICOLON",
      ",": "COMMA",
      "?": "HOOK",
      ":": "COLON",
      "||": "OR",
      "&&": "AND",
      "|": "BITWISE_OR",
      "^": "BITWISE_XOR",
      "&": "BITWISE_AND",
      "===": "STRICT_EQ",
      "==": "EQ",
      "=": "ASSIGN",
      "!==": "STRICT_NE",
      "!=": "NE",
      "<<": "LSH",
      "<=": "LE",
      "<": "LT",
      ">>>": "URSH",
      ">>": "RSH",
      ">=": "GE",
      ">": "GT",
      "++": "INCREMENT",
      "--": "DECREMENT",
      "+": "PLUS",
      "-": "MINUS",
      "*": "MUL",
      "/": "DIV",
      "%": "MOD",
      "!": "NOT",
      "~": "BITWISE_NOT",
      ".": "DOT",
      "[": "LEFT_BRACKET",
      "]": "RIGHT_BRACKET",
      "{": "LEFT_CURLY",
      "}": "RIGHT_CURLY",
      "(": "LEFT_PAREN",
      ")": "RIGHT_PAREN"
    },
    keywords = {
      __proto__: null
    },
    mozillaKeywords = {
      __proto__: null
    },
    tokenIds = {},
    hostSupportsEvalConst = function () {
      try {
        return eval("(function(s) { eval(s); return x })('const x = true;')")
      } catch (e) {
        return !1
      }
    }(),
    consts = hostSupportsEvalConst ? "const " : "var ";
  for (var i = 0, j = tokens.length; i < j; i++) {
    i > 0 && (consts += ", ");
    var t = tokens[i],
      name;
    if (/^[a-z]/.test(t)) {
      name = t.toUpperCase();
      if (name === "LET" || name === "YIELD") mozillaKeywords[name] = i;
      strictKeywords[name] && (strictKeywords[name] = i), keywords[t] = i
    } else name = /^\W/.test(t) ? opTypeNames[t] : t;
    consts += name + " = " + i, tokenIds[name] = i, tokens[t] = i
  }
  consts += ";";
  var isStatementStartCode = {
    __proto__: null
  };
  for (i = 0, j = statementStartTokens.length; i < j; i++) isStatementStartCode[keywords[statementStartTokens[i]]] = !0;
  var assignOps = ["|", "^", "&", "<<", ">>", ">>>", "+", "-", "*", "/", "%"];
  for (i = 0, j = assignOps.length; i < j; i++) t = assignOps[i], assignOps[t] = tokens[t];
  var Fpapply = Function.prototype.apply,
    applyNew;
  Function.prototype.bind ? applyNew = function (t, n) {
    return new(t.bind.apply(t, [, ].concat(Array.prototype.slice.call(n))))
  } : applyNew = function applyNew(f, a) {
    switch (a.length) {
    case 0:
      return new f;
    case 1:
      return new f(a[0]);
    case 2:
      return new f(a[0], a[1]);
    case 3:
      return new f(a[0], a[1], a[2]);
    default:
      var argStr = "a[0]";
      for (var i = 1, n = a.length; i < n; i++) argStr += ",a[" + i + "]";
      return eval("new f(" + argStr + ")")
    }
  };
  var hasOwnProperty = {}.hasOwnProperty;
  Dict.create = function (e) {
    var t = Object.create(null, {}),
      n = 0,
      r = Object.getOwnPropertyNames(e);
    for (var i = 0, s = r.length; i < s; i++) {
      var o = r[i];
      t[o] = e[o], n++
    }
    return new Dict(t, n)
  }, Dict.prototype = {
    has: function (e) {
      return hasOwnProperty.call(this.table, e)
    },
    set: function (e, t) {
      hasOwnProperty.call(this.table, e) || this.size++, this.table[e] = t
    },
    get: function (e) {
      return this.table[e]
    },
    getDef: function (e, t) {
      return hasOwnProperty.call(this.table, e) || (this.size++, this.table[e] = t()), this.table[e]
    },
    forEach: function (e) {
      var t = this.table;
      for (var n in t) e.call(this, n, t[n])
    },
    map: function (e) {
      var t = this.table,
        n = Object.create(null, {});
      return this.forEach(function (t, r) {
        n[t] = e.call(this, r, t)
      }), new Dict(n, this.size)
    },
    mapObject: function (e) {
      var t = this.table,
        n = Object.create(null, {});
      return this.forEach(function (t, r) {
        n[t] = e.call(this, r, t)
      }), n
    },
    toObject: function () {
      return this.mapObject(function (e) {
        return e
      })
    },
    choose: function () {
      return Object.getOwnPropertyNames(this.table)[0]
    },
    remove: function (e) {
      hasOwnProperty.call(this.table, e) && (this.size--, delete this.table[e])
    },
    copy: function () {
      var e = Object.create(null, {});
      for (var t in this.table) e[t] = this.table[t];
      return new Dict(e, this.size)
    },
    keys: function () {
      return Object.keys(this.table)
    },
    toString: function () {
      return "[object Dict]"
    }
  };
  var _WeakMap = typeof WeakMap == "function" ? WeakMap : function () {
    function e(e) {
      this.array = e || []
    }

    function t(e, t, n, r) {
      var i = e.array;
      for (var s = 0, o = i.length; s < o; s++) {
        var u = i[s];
        if (u.key === t) return n(u, s)
      }
      return r()
    }
    return e.prototype = {
      has: function (e) {
        return t(this, e, function () {
          return !0
        }, function () {
          return !1
        })
      },
      set: function (e, n) {
        var r = this.array;
        t(this, e, function (e) {
          e.value = n
        }, function () {
          r.push({
            key: e,
            value: n
          })
        })
      },
      get: function (e) {
        return t(this, e, function (e) {
          return e.value
        }, function () {
          return null
        })
      },
      "delete": function (e) {
        var n = this.array;
        t(this, e, function (e, t) {
          n.splice(t, 1)
        }, function () {})
      },
      toString: function () {
        return "[object WeakMap]"
      }
    }, e
  }();
  Stack.prototype = {
    push: function (e) {
      return new Stack({
        top: e,
        rest: this.elts
      })
    },
    top: function () {
      if (!this.elts) throw new Error("empty stack");
      return this.elts.top
    },
    isEmpty: function () {
      return this.top === null
    },
    find: function (e) {
      for (var t = this.elts; t; t = t.rest)
        if (e(t.top)) return t.top;
      return null
    },
    has: function (e) {
      return Boolean(this.find(function (t) {
        return t === e
      }))
    },
    forEach: function (e) {
      for (var t = this.elts; t; t = t.rest) e(t.top)
    }
  }, Array.prototype.copy || defineProperty(Array.prototype, "copy", function () {
    var e = [];
    for (var t = 0, n = this.length; t < n; t++) e[t] = this[t];
    return e
  }, !1, !1, !0), Array.prototype.top || defineProperty(Array.prototype, "top", function () {
    return this.length && this[this.length - 1]
  }, !1, !1, !0), exports.tokens = tokens, exports.whitespace = whitespace, exports.opTypeNames = opTypeNames, exports.keywords = keywords, exports.mozillaKeywords = mozillaKeywords, exports.strictKeywords = strictKeywords, exports.isStatementStartCode = isStatementStartCode, exports.tokenIds = tokenIds, exports.consts = consts, exports.assignOps = assignOps, exports.defineGetter = defineGetter, exports.defineGetterSetter = defineGetterSetter, exports.defineMemoGetter = defineMemoGetter, exports.defineProperty = defineProperty, exports.isNativeCode = isNativeCode, exports.apply = apply, exports.applyNew = applyNew, exports.mixinHandler = mixinHandler, exports.whitelistHandler = whitelistHandler, exports.blacklistHandler = blacklistHandler, exports.makePassthruHandler = makePassthruHandler, exports.Dict = Dict, exports.WeakMap = _WeakMap, exports.Stack = Stack
}), define("ace/narcissus/options", ["require", "exports", "module"], function (e, t, n) {
  t.hiddenHostGlobals = {
    Narcissus: !0
  }, t.desugarExtensions = !1, t.allowHTMLComments = !1, t.mozillaMode = !0, t.parenFreeMode = !1
})