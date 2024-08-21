const P = typeof window < "u" ? window : global;
function ua(e) {
  let i = [], t = !1, n = null, s = null;
  function r() {
    return e.config.drag_highlight && e.markTimespan;
  }
  function _(o) {
    const l = e.getView(o);
    return l ? l.layout : o;
  }
  function d(o) {
    const { event: l, layout: h, viewName: y, sectionId: m, eventNode: f } = o;
    (function(c, p) {
      switch (p) {
        case "month":
          c.style.top = "", c.style.left = "";
          break;
        case "timeline":
          c.style.left = "", c.style.marginLeft = "1px";
          break;
        default:
          c.style.top = "";
      }
    })(f, h);
    const u = {};
    let v = { start_date: l.start_date, end_date: l.end_date, css: "dhx_scheduler_dnd_marker", html: f };
    return h != "timeline" && h != "month" || (v = { ...v, end_date: e.date.add(l.start_date, 1, "minute") }), m && (u[y] = m, v.sections = u), v;
  }
  function a(o) {
    const { layout: l } = o;
    let h;
    switch (l) {
      case "month":
        h = function(y) {
          let m = [];
          const { event: f, layout: u, viewName: v, sectionId: c } = y, p = [];
          let g = new Date(f.start_date);
          for (; g.valueOf() < f.end_date.valueOf(); ) {
            let x = { start_date: g };
            p.push(x), g = e.date.week_start(e.date.add(g, 1, "week"));
          }
          let b = e.$container.querySelectorAll(`[${e.config.event_attribute}='${f.id}']`);
          for (let x = 0; x < b.length; x++) {
            const k = { event: p[x], layout: u, viewName: v, sectionId: c, eventNode: b[x].cloneNode(!0) };
            m.push(d(k));
          }
          return m;
        }(o);
        break;
      case "timeline":
      case "units":
        h = function(y) {
          let m = [];
          const { event: f, layout: u, viewName: v, eventNode: c } = y;
          let p = function(g) {
            const b = e.getView(g);
            return b.y_property ? b.y_property : b.map_to ? b.map_to : void 0;
          }(v);
          if (e.config.multisection && p) {
            const g = String(f[p]).split(e.config.section_delimiter).map((x) => String(x)), b = [];
            for (let x = 0; x < g.length; x++) {
              b[x] = c.cloneNode(!0);
              const k = { event: f, layout: u, viewName: v, sectionId: g[x], eventNode: b[x] };
              m.push(d(k));
            }
          }
          return m;
        }(o);
        break;
      default:
        h = function(y) {
          const { event: m, layout: f, viewName: u, sectionId: v } = y;
          let c = [], p = e.$container.querySelectorAll(`[${e.config.event_attribute}='${m.id}']:not(.dhx_cal_select_menu):not(.dhx_drag_marker)`);
          if (p)
            for (let g = 0; g < p.length; g++) {
              let b = p[g].cloneNode(!0);
              const x = { event: { start_date: /* @__PURE__ */ new Date(+b.getAttribute("data-bar-start")), end_date: /* @__PURE__ */ new Date(+b.getAttribute("data-bar-end")) }, layout: f, viewName: u, sectionId: v, eventNode: b };
              c.push(d(x));
            }
          return c;
        }(o);
    }
    h.forEach((y) => {
      i.push(e.markTimespan(y));
    });
  }
  e.attachEvent("onBeforeDrag", function(o, l, h) {
    return r() && (t = !0, s = e.getEvent(o), n = h.target.closest(`[${e.config.event_attribute}]`), _(e.getState().mode) == "units" && e.config.cascade_event_display && (e.unselect(o), n = h.target.closest(`[${e.config.event_attribute}]`))), !0;
  }), e.attachEvent("onEventDrag", function(o, l, h) {
    if (t && r()) {
      t = !1;
      const y = e.getState().mode, m = _(y), f = e.getActionData(h).section;
      s && a({ event: s, layout: m, viewName: y, sectionId: f, eventNode: n });
    }
  }), e.attachEvent("onDragEnd", function(o, l, h) {
    for (let y = 0; y < i.length; y++)
      e.unmarkTimespan(i[y]);
    i = [], n = null, s = null;
  });
}
function fa(e) {
  e.config.mark_now = !0, e.config.display_marked_timespans = !0, e.config.overwrite_marked_timespans = !0;
  var i = "dhx_time_block", t = "default", n = function(r, _, d) {
    var a = typeof r == "object" ? r : { days: r };
    return a.type = i, a.css = "", _ && (d && (a.sections = d), a = function(o, l, h) {
      return l instanceof Date && h instanceof Date ? (o.start_date = l, o.end_date = h) : (o.days = l, o.zones = h), o;
    }(a, r, _)), a;
  };
  function s(r, _, d, a, o) {
    var l = e, h = [], y = { _props: "map_to", matrix: "y_property" };
    for (var m in y) {
      var f = y[m];
      if (l[m])
        for (var u in l[m]) {
          var v = l[m][u][f];
          r[v] && (h = l._add_timespan_zones(h, e._get_blocked_zones(_[u], r[v], d, a, o)));
        }
    }
    return h = l._add_timespan_zones(h, e._get_blocked_zones(_, "global", d, a, o));
  }
  e.blockTime = function(r, _, d) {
    var a = n(r, _, d);
    return e.addMarkedTimespan(a);
  }, e.unblockTime = function(r, _, d) {
    var a = n(r, _ = _ || "fullday", d);
    return e.deleteMarkedTimespan(a);
  }, e.checkInMarkedTimespan = function(r, _, d) {
    _ = _ || t;
    for (var a = !0, o = new Date(r.start_date.valueOf()), l = e.date.add(o, 1, "day"), h = e._marked_timespans; o < r.end_date; o = e.date.date_part(l), l = e.date.add(o, 1, "day")) {
      var y = +e.date.date_part(new Date(o)), m = s(r, h, o.getDay(), y, _);
      if (m)
        for (var f = 0; f < m.length; f += 2) {
          var u = e._get_zone_minutes(o), v = r.end_date > l || r.end_date.getDate() != o.getDate() ? 1440 : e._get_zone_minutes(r.end_date), c = m[f], p = m[f + 1];
          if (c < v && p > u && !(a = typeof d == "function" && d(r, u, v, c, p)))
            break;
        }
    }
    return !a;
  }, e.checkLimitViolation = function(r) {
    if (!r || !e.config.check_limits)
      return !0;
    var _ = e, d = _.config, a = [];
    if (r.rec_type && r._end_date || r.rrule) {
      const m = r._end_date || r.end_date;
      return !d.limit_start || !d.limit_end || m.valueOf() >= d.limit_start.valueOf() && r.start_date.valueOf() <= d.limit_end.valueOf();
    }
    a = [r];
    for (var o = !0, l = 0; l < a.length; l++) {
      var h = !0, y = a[l];
      y._timed = e.isOneDayEvent(y), (h = !d.limit_start || !d.limit_end || y.start_date.valueOf() >= d.limit_start.valueOf() && y.end_date.valueOf() <= d.limit_end.valueOf()) && (h = !e.checkInMarkedTimespan(y, i, function(m, f, u, v, c) {
        var p = !0;
        return f <= c && f >= v && ((c == 1440 || u <= c) && (p = !1), m._timed && _._drag_id && _._drag_mode == "new-size" ? (m.start_date.setHours(0), m.start_date.setMinutes(c)) : p = !1), (u >= v && u <= c || f < v && u > c) && (m._timed && _._drag_id && _._drag_mode == "new-size" ? (m.end_date.setHours(0), m.end_date.setMinutes(v)) : p = !1), p;
      })), h || (h = _.checkEvent("onLimitViolation") ? _.callEvent("onLimitViolation", [y.id, y]) : h), o = o && h;
    }
    return o || (_._drag_id = null, _._drag_mode = null), o;
  }, e._get_blocked_zones = function(r, _, d, a, o) {
    var l = [];
    if (r && r[_])
      for (var h = r[_], y = this._get_relevant_blocked_zones(d, a, h, o), m = 0; m < y.length; m++)
        l = this._add_timespan_zones(l, y[m].zones);
    return l;
  }, e._get_relevant_blocked_zones = function(r, _, d, a) {
    var o;
    return e.config.overwrite_marked_timespans ? o = d[_] && d[_][a] ? d[_][a] : d[r] && d[r][a] ? d[r][a] : [] : (o = [], d[_] && d[_][a] && (o = o.concat(d[_][a])), d[r] && d[r][a] && (o = o.concat(d[r][a]))), o;
  }, e._mark_now = function(r) {
    var _ = "dhx_now_time";
    this._els[_] || (this._els[_] = []);
    var d = e._currentDate(), a = this.config;
    if (e._remove_mark_now(), !r && a.mark_now && d < this._max_date && d > this._min_date && d.getHours() >= a.first_hour && d.getHours() < a.last_hour) {
      var o = this.locate_holder_day(d);
      this._els[_] = e._append_mark_now(o, d);
    }
  }, e._append_mark_now = function(r, _) {
    var d = "dhx_now_time", a = e._get_zone_minutes(_), o = { zones: [a, a + 1], css: d, type: d };
    if (!this._table_view) {
      if (this._props && this._props[this._mode]) {
        var l, h, y = this._props[this._mode], m = y.size || y.options.length;
        y.days > 1 ? (y.size && y.options.length && (r = (y.position + r) / y.options.length * y.size), l = r, h = r + m) : h = (l = 0) + m;
        for (var f = [], u = l; u < h; u++) {
          var v = u;
          o.days = v;
          var c = e._render_marked_timespan(o, null, v)[0];
          f.push(c);
        }
        return f;
      }
      return o.days = r, e._render_marked_timespan(o, null, r);
    }
    if (this._mode == "month")
      return o.days = +e.date.date_part(_), e._render_marked_timespan(o, null, null);
  }, e._remove_mark_now = function() {
    for (var r = "dhx_now_time", _ = this._els[r], d = 0; d < _.length; d++) {
      var a = _[d], o = a.parentNode;
      o && o.removeChild(a);
    }
    this._els[r] = [];
  }, e._marked_timespans = { global: {} }, e._get_zone_minutes = function(r) {
    return 60 * r.getHours() + r.getMinutes();
  }, e._prepare_timespan_options = function(r) {
    var _ = [], d = [];
    if (r.days == "fullweek" && (r.days = [0, 1, 2, 3, 4, 5, 6]), r.days instanceof Array) {
      for (var a = r.days.slice(), o = 0; o < a.length; o++) {
        var l = e._lame_clone(r);
        l.days = a[o], _.push.apply(_, e._prepare_timespan_options(l));
      }
      return _;
    }
    if (!r || !(r.start_date && r.end_date && r.end_date > r.start_date || r.days !== void 0 && r.zones) && !r.type)
      return _;
    r.zones == "fullday" && (r.zones = [0, 1440]), r.zones && r.invert_zones && (r.zones = e.invertZones(r.zones)), r.id = e.uid(), r.css = r.css || "", r.type = r.type || t;
    var h = r.sections;
    if (h) {
      for (var y in h)
        if (h.hasOwnProperty(y)) {
          var m = h[y];
          for (m instanceof Array || (m = [m]), o = 0; o < m.length; o++)
            (b = e._lame_copy({}, r)).sections = {}, b.sections[y] = m[o], d.push(b);
        }
    } else
      d.push(r);
    for (var f = 0; f < d.length; f++) {
      var u = d[f], v = u.start_date, c = u.end_date;
      if (v && c)
        for (var p = e.date.date_part(new Date(v)), g = e.date.add(p, 1, "day"); p < c; ) {
          var b;
          delete (b = e._lame_copy({}, u)).start_date, delete b.end_date, b.days = p.valueOf();
          var x = v > p ? e._get_zone_minutes(v) : 0, k = c > g || c.getDate() != p.getDate() ? 1440 : e._get_zone_minutes(c);
          b.zones = [x, k], _.push(b), p = g, g = e.date.add(g, 1, "day");
        }
      else
        u.days instanceof Date && (u.days = e.date.date_part(u.days).valueOf()), u.zones = r.zones.slice(), _.push(u);
    }
    return _;
  }, e._get_dates_by_index = function(r, _, d) {
    var a = [];
    _ = e.date.date_part(new Date(_ || e._min_date)), d = new Date(d || e._max_date);
    for (var o = _.getDay(), l = r - o >= 0 ? r - o : 7 - _.getDay() + r, h = e.date.add(_, l, "day"); h < d; h = e.date.add(h, 1, "week"))
      a.push(h);
    return a;
  }, e._get_css_classes_by_config = function(r) {
    var _ = [];
    return r.type == i && (_.push(i), r.css && _.push(i + "_reset")), _.push("dhx_marked_timespan", r.css), _.join(" ");
  }, e._get_block_by_config = function(r) {
    var _ = document.createElement("div");
    return r.html && (typeof r.html == "string" ? _.innerHTML = r.html : _.appendChild(r.html)), _;
  }, e._render_marked_timespan = function(r, _, d) {
    var a = [], o = e.config, l = this._min_date, h = this._max_date, y = !1;
    if (!o.display_marked_timespans)
      return a;
    if (!d && d !== 0) {
      if (r.days < 7)
        d = r.days;
      else {
        var m = new Date(r.days);
        if (y = +m, !(+h > +m && +l <= +m))
          return a;
        d = m.getDay();
      }
      var f = l.getDay();
      f > d ? d = 7 - (f - d) : d -= f;
    }
    var u = r.zones, v = e._get_css_classes_by_config(r);
    if (e._table_view && e._mode == "month") {
      var c = [], p = [];
      if (_)
        c.push(_), p.push(d);
      else {
        p = y ? [y] : e._get_dates_by_index(d);
        for (var g = 0; g < p.length; g++)
          c.push(this._scales[p[g]]);
      }
      for (g = 0; g < c.length; g++) {
        _ = c[g], d = p[g];
        var b = this.locate_holder_day(d, !1) % this._cols.length;
        if (!this._ignores[b]) {
          var x = e._get_block_by_config(r);
          x.className = v, x.style.top = "0px", x.style.height = "100%";
          for (var k = 0; k < u.length; k += 2) {
            var w = u[g];
            if ((M = u[g + 1]) <= w)
              return [];
            (N = x.cloneNode(!0)).style.left = "0px", N.style.width = "100%", _.appendChild(N), a.push(N);
          }
        }
      }
    } else {
      var E = d;
      if (this._ignores[this.locate_holder_day(d, !1)])
        return a;
      if (this._props && this._props[this._mode] && r.sections && r.sections[this._mode]) {
        var D = this._props[this._mode];
        E = D.order[r.sections[this._mode]];
        var S = D.order[r.sections[this._mode]];
        D.days > 1 ? E = E * (D.size || D.options.length) + S : (E = S, D.size && E > D.position + D.size && (E = 0));
      }
      for (_ = _ || e.locate_holder(E), g = 0; g < u.length; g += 2) {
        var M, N;
        if (w = Math.max(u[g], 60 * o.first_hour), (M = Math.min(u[g + 1], 60 * o.last_hour)) <= w) {
          if (g + 2 < u.length)
            continue;
          return [];
        }
        (N = e._get_block_by_config(r)).className = v;
        var T = 24 * this.config.hour_size_px + 1, A = 36e5;
        N.style.top = Math.round((60 * w * 1e3 - this.config.first_hour * A) * this.config.hour_size_px / A) % T + "px", N.style.height = Math.max(Math.round(60 * (M - w) * 1e3 * this.config.hour_size_px / A) % T, 1) + "px", _.appendChild(N), a.push(N);
      }
    }
    return a;
  }, e._mark_timespans = function() {
    var r = this._els.dhx_cal_data[0], _ = [];
    if (e._table_view && e._mode == "month")
      for (var d in this._scales) {
        var a = /* @__PURE__ */ new Date(+d);
        _.push.apply(_, e._on_scale_add_marker(this._scales[d], a));
      }
    else {
      a = new Date(e._min_date);
      for (var o = 0, l = r.childNodes.length; o < l; o++) {
        var h = r.childNodes[o];
        h.firstChild && e._getClassName(h.firstChild).indexOf("dhx_scale_hour") > -1 || (_.push.apply(_, e._on_scale_add_marker(h, a)), a = e.date.add(a, 1, "day"));
      }
    }
    return _;
  }, e.markTimespan = function(r) {
    if (!this._els)
      throw new Error("`scheduler.markTimespan` can't be used before scheduler initialization. Place `scheduler.markTimespan` call after `scheduler.init`.");
    var _ = !1;
    this._els.dhx_cal_data || (e.get_elements(), _ = !0);
    var d = e._marked_timespans_ids, a = e._marked_timespans_types, o = e._marked_timespans;
    e.deleteMarkedTimespan(), e.addMarkedTimespan(r);
    var l = e._mark_timespans();
    return _ && (e._els = []), e._marked_timespans_ids = d, e._marked_timespans_types = a, e._marked_timespans = o, l;
  }, e.unmarkTimespan = function(r) {
    if (r)
      for (var _ = 0; _ < r.length; _++) {
        var d = r[_];
        d.parentNode && d.parentNode.removeChild(d);
      }
  }, e._addMarkerTimespanConfig = function(r) {
    var _ = "global", d = e._marked_timespans, a = r.id, o = e._marked_timespans_ids;
    o[a] || (o[a] = []);
    var l = r.days, h = r.sections, y = r.type;
    if (r.id = a, h) {
      for (var m in h)
        if (h.hasOwnProperty(m)) {
          d[m] || (d[m] = {});
          var f = h[m], u = d[m];
          u[f] || (u[f] = {}), u[f][l] || (u[f][l] = {}), u[f][l][y] || (u[f][l][y] = [], e._marked_timespans_types || (e._marked_timespans_types = {}), e._marked_timespans_types[y] || (e._marked_timespans_types[y] = !0));
          var v = u[f][l][y];
          r._array = v, v.push(r), o[a].push(r);
        }
    } else
      d[_][l] || (d[_][l] = {}), d[_][l][y] || (d[_][l][y] = []), e._marked_timespans_types || (e._marked_timespans_types = {}), e._marked_timespans_types[y] || (e._marked_timespans_types[y] = !0), v = d[_][l][y], r._array = v, v.push(r), o[a].push(r);
  }, e._marked_timespans_ids = {}, e.addMarkedTimespan = function(r) {
    var _ = e._prepare_timespan_options(r);
    if (_.length) {
      for (var d = _[0].id, a = 0; a < _.length; a++)
        e._addMarkerTimespanConfig(_[a]);
      return d;
    }
  }, e._add_timespan_zones = function(r, _) {
    var d = r.slice();
    if (_ = _.slice(), !d.length)
      return _;
    for (var a = 0; a < d.length; a += 2)
      for (var o = d[a], l = d[a + 1], h = a + 2 == d.length, y = 0; y < _.length; y += 2) {
        var m = _[y], f = _[y + 1];
        if (f > l && m <= l || m < o && f >= o)
          d[a] = Math.min(o, m), d[a + 1] = Math.max(l, f), a -= 2;
        else {
          if (!h)
            continue;
          var u = o > m ? 0 : 2;
          d.splice(a + u, 0, m, f);
        }
        _.splice(y--, 2);
        break;
      }
    return d;
  }, e._subtract_timespan_zones = function(r, _) {
    for (var d = r.slice(), a = 0; a < d.length; a += 2)
      for (var o = d[a], l = d[a + 1], h = 0; h < _.length; h += 2) {
        var y = _[h], m = _[h + 1];
        if (m > o && y < l) {
          var f = !1;
          o >= y && l <= m && d.splice(a, 2), o < y && (d.splice(a, 2, o, y), f = !0), l > m && d.splice(f ? a + 2 : a, f ? 0 : 2, m, l), a -= 2;
          break;
        }
      }
    return d;
  }, e.invertZones = function(r) {
    return e._subtract_timespan_zones([0, 1440], r.slice());
  }, e._delete_marked_timespan_by_id = function(r) {
    var _ = e._marked_timespans_ids[r];
    if (_) {
      for (var d = 0; d < _.length; d++)
        for (var a = _[d], o = a._array, l = 0; l < o.length; l++)
          if (o[l] == a) {
            o.splice(l, 1);
            break;
          }
    }
  }, e._delete_marked_timespan_by_config = function(r) {
    var _, d = e._marked_timespans, a = r.sections, o = r.days, l = r.type || t;
    if (a) {
      for (var h in a)
        if (a.hasOwnProperty(h) && d[h]) {
          var y = a[h];
          d[h][y] && (_ = d[h][y]);
        }
    } else
      _ = d.global;
    if (_) {
      if (o !== void 0)
        _[o] && _[o][l] && (e._addMarkerTimespanConfig(r), e._delete_marked_timespans_list(_[o][l], r));
      else
        for (var m in _)
          if (_[m][l]) {
            var f = e._lame_clone(r);
            r.days = m, e._addMarkerTimespanConfig(f), e._delete_marked_timespans_list(_[m][l], r);
          }
    }
  }, e._delete_marked_timespans_list = function(r, _) {
    for (var d = 0; d < r.length; d++) {
      var a = r[d], o = e._subtract_timespan_zones(a.zones, _.zones);
      if (o.length)
        a.zones = o;
      else {
        r.splice(d, 1), d--;
        for (var l = e._marked_timespans_ids[a.id], h = 0; h < l.length; h++)
          if (l[h] == a) {
            l.splice(h, 1);
            break;
          }
      }
    }
  }, e.deleteMarkedTimespan = function(r) {
    if (arguments.length || (e._marked_timespans = { global: {} }, e._marked_timespans_ids = {}, e._marked_timespans_types = {}), typeof r != "object")
      e._delete_marked_timespan_by_id(r);
    else {
      r.start_date && r.end_date || (r.days !== void 0 || r.type || (r.days = "fullweek"), r.zones || (r.zones = "fullday"));
      var _ = [];
      if (r.type)
        _.push(r.type);
      else
        for (var d in e._marked_timespans_types)
          _.push(d);
      for (var a = e._prepare_timespan_options(r), o = 0; o < a.length; o++)
        for (var l = a[o], h = 0; h < _.length; h++) {
          var y = e._lame_clone(l);
          y.type = _[h], e._delete_marked_timespan_by_config(y);
        }
    }
  }, e._get_types_to_render = function(r, _) {
    var d = r ? e._lame_copy({}, r) : {};
    for (var a in _ || {})
      _.hasOwnProperty(a) && (d[a] = _[a]);
    return d;
  }, e._get_configs_to_render = function(r) {
    var _ = [];
    for (var d in r)
      r.hasOwnProperty(d) && _.push.apply(_, r[d]);
    return _;
  }, e._on_scale_add_marker = function(r, _) {
    if (!e._table_view || e._mode == "month") {
      var d = _.getDay(), a = _.valueOf(), o = this._mode, l = e._marked_timespans, h = [], y = [];
      if (this._props && this._props[o]) {
        var m = this._props[o], f = m.options, u = f[e._get_unit_index(m, _)];
        if (m.days > 1) {
          var v = Math.round((_ - e._min_date) / 864e5), c = m.size || f.length;
          _ = e.date.add(e._min_date, Math.floor(v / c), "day"), _ = e.date.date_part(_);
        } else
          _ = e.date.date_part(new Date(this._date));
        if (d = _.getDay(), a = _.valueOf(), l[o] && l[o][u.key]) {
          var p = l[o][u.key], g = e._get_types_to_render(p[d], p[a]);
          h.push.apply(h, e._get_configs_to_render(g));
        }
      }
      var b = l.global;
      if (e.config.overwrite_marked_timespans) {
        var x = b[a] || b[d];
        h.push.apply(h, e._get_configs_to_render(x));
      } else
        b[a] && h.push.apply(h, e._get_configs_to_render(b[a])), b[d] && h.push.apply(h, e._get_configs_to_render(b[d]));
      for (var k = 0; k < h.length; k++)
        y.push.apply(y, e._render_marked_timespan(h[k], r, _));
      return y;
    }
  }, e.attachEvent("onScaleAdd", function() {
    e._on_scale_add_marker.apply(e, arguments);
  }), e.dblclick_dhx_marked_timespan = function(r, _) {
    e.callEvent("onScaleDblClick", [e.getActionData(r).date, _, r]), e.config.dblclick_create && e.addEventNow(e.getActionData(r).date, null, r);
  };
}
function pa(e) {
  var i = {}, t = !1;
  function n(a, o) {
    o = typeof o == "function" ? o : function() {
    }, i[a] || (i[a] = this[a], this[a] = o);
  }
  function s(a) {
    i[a] && (this[a] = i[a], i[a] = null);
  }
  function r(a) {
    for (var o in a)
      n.call(this, o, a[o]);
  }
  function _() {
    for (var a in i)
      s.call(this, a);
  }
  function d(a) {
    try {
      a();
    } catch (o) {
      window.console.error(o);
    }
  }
  return e.$stateProvider.registerProvider("batchUpdate", function() {
    return { batch_update: t };
  }, !1), function(a, o) {
    if (t)
      return void d(a);
    var l, h = this._dp && this._dp.updateMode != "off";
    h && (l = this._dp.updateMode, this._dp.setUpdateMode("off"));
    const y = { setModeDate: { date: null, mode: null }, needRender: !1, needUpdateView: !1, repaintEvents: {} }, m = (u, v) => {
      u && (y.setModeDate.date = u), v && (y.setModeDate.mode = v);
    };
    var f = { render: (u, v) => {
      y.needRender = !0, m(u, v);
    }, setCurrentView: (u, v) => {
      y.needRender = !0, m(u, v);
    }, updateView: (u, v) => {
      y.needUpdateView = !0, m(u, v);
    }, render_data: () => y.needRender = !0, render_view_data: (u) => {
      u && u.length ? u.forEach((v) => y.repaintEvents[v.id] = !0) : y.needRender = !0;
    } };
    if (r.call(this, f), t = !0, this.callEvent("onBeforeBatchUpdate", []), d(a), this.callEvent("onAfterBatchUpdate", []), _.call(this), t = !1, !o)
      if (y.needRender)
        e.render(y.setModeDate.date, y.setModeDate.mode);
      else if (y.needUpdateView)
        e.updateView(y.setModeDate.date, y.setModeDate.mode);
      else
        for (const u in y.repaintEvents)
          e.updateEvent(u);
    h && (this._dp.setUpdateMode(l), this._dp.sendData());
  };
}
function ma(e) {
  (function(i) {
    i.attachEvent("onEventDeleted", function(t, n) {
      let s = i.copy(n);
      i.config.undo_deleted && !i.getState().new_event && i.message({ text: `<div class="dhx_info_message">
                            <span class="undo_popup_text">Event deleted</span>
                            <button class="undo_button" data-deleted-event-id="${n.id}">Undo</button>
                        </div>`, expire: 1e4, type: "popup_after_delete", callback: function(r) {
        r.target.closest(`[data-deleted-event-id="${n.id}"]`) && (i.addEvent(s), i.render());
      } });
    });
  })(e), ua(e), fa(e), function(i) {
    i.batchUpdate = pa(i);
  }(e);
}
var va = Date.now();
function it(e) {
  return !(!e || typeof e != "object") && !!(e.getFullYear && e.getMonth && e.getDate);
}
const ge = { uid: function() {
  return va++;
}, mixin: function(e, i, t) {
  for (var n in i)
    (e[n] === void 0 || t) && (e[n] = i[n]);
  return e;
}, copy: function e(i) {
  var t, n, s;
  if (i && typeof i == "object")
    switch (!0) {
      case it(i):
        n = new Date(i);
        break;
      case (s = i, Array.isArray ? Array.isArray(s) : s && s.length !== void 0 && s.pop && s.push):
        for (n = new Array(i.length), t = 0; t < i.length; t++)
          n[t] = e(i[t]);
        break;
      case function(r) {
        return r && typeof r == "object" && Function.prototype.toString.call(r.constructor) === "function String() { [native code] }";
      }(i):
        n = new String(i);
        break;
      case function(r) {
        return r && typeof r == "object" && Function.prototype.toString.call(r.constructor) === "function Number() { [native code] }";
      }(i):
        n = new Number(i);
        break;
      case function(r) {
        return r && typeof r == "object" && Function.prototype.toString.call(r.constructor) === "function Boolean() { [native code] }";
      }(i):
        n = new Boolean(i);
        break;
      default:
        for (t in n = {}, i) {
          const r = typeof i[t];
          r === "string" || r === "number" || r === "boolean" ? n[t] = i[t] : it(i[t]) ? n[t] = new Date(i[t]) : Object.prototype.hasOwnProperty.apply(i, [t]) && (n[t] = e(i[t]));
        }
    }
  return n || i;
}, defined: function(e) {
  return e !== void 0;
}, isDate: it, delay: function(e, i) {
  var t, n = function() {
    n.$cancelTimeout(), n.$pending = !0;
    var s = Array.prototype.slice.call(arguments);
    t = setTimeout(function() {
      e.apply(this, s), n.$pending = !1;
    }, i);
  };
  return n.$pending = !1, n.$cancelTimeout = function() {
    clearTimeout(t), n.$pending = !1;
  }, n.$execute = function() {
    var s = Array.prototype.slice.call(arguments);
    e.apply(this, s), n.$cancelTimeout();
  }, n;
} };
function ga(e) {
  function i(d) {
    var a = document.createElement("div");
    return (d || "").split(" ").forEach(function(o) {
      a.classList.add(o);
    }), a;
  }
  var t = { rows_container: function() {
    return i("dhx_cal_navbar_rows_container");
  }, row: function() {
    return i("dhx_cal_navbar_row");
  }, view: function(d) {
    var a = i("dhx_cal_tab");
    return a.setAttribute("name", d.view + "_tab"), a.setAttribute("data-tab", d.view), e.config.fix_tab_position && (d.$firstTab ? a.classList.add("dhx_cal_tab_first") : d.$lastTab ? a.classList.add("dhx_cal_tab_last") : d.view !== "week" && a.classList.add("dhx_cal_tab_standalone"), d.$segmentedTab && a.classList.add("dhx_cal_tab_segmented")), a;
  }, date: function() {
    return i("dhx_cal_date");
  }, button: function(d) {
    return i("dhx_cal_nav_button dhx_cal_nav_button_custom dhx_cal_tab");
  }, builtInButton: function(d) {
    return i("dhx_cal_" + d.view + "_button dhx_cal_nav_button");
  }, spacer: function() {
    return i("dhx_cal_line_spacer");
  }, minicalendarButton: function(d) {
    var a = i("dhx_minical_icon");
    return d.click || a.$_eventAttached || e.event(a, "click", function() {
      e.isCalendarVisible() ? e.destroyCalendar() : e.renderCalendar({ position: this, date: e.getState().date, navigation: !0, handler: function(o, l) {
        e.setCurrentView(o), e.destroyCalendar();
      } });
    }), a;
  }, html_element: function(d) {
    return i("dhx_cal_nav_content");
  } };
  function n(d) {
    var a = function(h) {
      var y;
      if (h.view)
        switch (h.view) {
          case "today":
          case "next":
          case "prev":
            y = t.builtInButton;
            break;
          case "date":
            y = t.date;
            break;
          case "spacer":
            y = t.spacer;
            break;
          case "button":
            y = t.button;
            break;
          case "minicalendar":
            y = t.minicalendarButton;
            break;
          default:
            y = t.view;
        }
      else
        h.rows ? y = t.rows_container : h.cols && (y = t.row);
      return y;
    }(d);
    if (a) {
      var o = a(d);
      if (d.css && o.classList.add(d.css), d.width && ((l = d.width) === 1 * l && (l += "px"), o.style.width = l), d.height && ((l = d.height) === 1 * l && (l += "px"), o.style.height = l), d.click && e.event(o, "click", d.click), d.html && (o.innerHTML = d.html), d.align) {
        var l = "";
        d.align == "right" ? l = "flex-end" : d.align == "left" && (l = "flex-start"), o.style.justifyContent = l;
      }
      return o;
    }
  }
  function s(d) {
    return typeof d == "string" && (d = { view: d }), d.view || d.rows || d.cols || (d.view = "button"), d;
  }
  function r(d) {
    var a, o = document.createDocumentFragment();
    a = Array.isArray(d) ? d : [d];
    for (var l = 0; l < a.length; l++) {
      var h, y = s(a[l]);
      y.view === "day" && a[l + 1] && ((h = s(a[l + 1])).view !== "week" && h.view !== "month" || (y.$firstTab = !0, y.$segmentedTab = !0)), y.view === "week" && a[l - 1] && ((h = s(a[l + 1])).view !== "week" && h.view !== "month" || (y.$segmentedTab = !0)), y.view === "month" && a[l - 1] && ((h = s(a[l - 1])).view !== "week" && h.view !== "day" || (y.$lastTab = !0, y.$segmentedTab = !0));
      var m = n(y);
      o.appendChild(m), (y.cols || y.rows) && m.appendChild(r(y.cols || y.rows));
    }
    return o;
  }
  e._init_nav_bar = function(d) {
    var a = this.$container.querySelector(".dhx_cal_navline");
    return a || ((a = document.createElement("div")).className = "dhx_cal_navline dhx_cal_navline_flex", e._update_nav_bar(d, a), a);
  };
  var _ = null;
  e._update_nav_bar = function(d, a) {
    if (d) {
      var o = !1, l = d.height || e.xy.nav_height;
      _ !== null && _ === l || (o = !0), o && (e.xy.nav_height = l), a.innerHTML = "", a.appendChild(r(d)), e.unset_actions(), e._els = [], e.get_elements(), e.set_actions(), a.style.display = l === 0 ? "none" : "", _ = l;
    }
  };
}
function ya(e) {
  function i(r) {
    for (var _ = document.body; r && r != _; )
      r = r.parentNode;
    return _ == r;
  }
  function t(r) {
    return { w: r.innerWidth || document.documentElement.clientWidth, h: r.innerHeight || document.documentElement.clientHeight };
  }
  function n(r, _) {
    var d, a = t(_);
    r.event(_, "resize", function() {
      clearTimeout(d), d = setTimeout(function() {
        if (i(r.$container) && !r.$destroyed) {
          var o, l, h = t(_);
          l = h, ((o = a).w != l.w || o.h != l.h) && (a = h, s(r));
        }
      }, 150);
    });
  }
  function s(r) {
    !r.$destroyed && r.$root && i(r.$root) && r.callEvent("onSchedulerResize", []) && (r.updateView(), r.callEvent("onAfterSchedulerResize", []));
  }
  (function(r) {
    var _ = r.$container;
    window.getComputedStyle(_).getPropertyValue("position") == "static" && (_.style.position = "relative");
    var d = document.createElement("iframe");
    d.className = "scheduler_container_resize_watcher", d.tabIndex = -1, r.config.wai_aria_attributes && (d.setAttribute("role", "none"), d.setAttribute("aria-hidden", !0)), window.Sfdc || window.$A || window.Aura ? function(a) {
      var o = a.$root.offsetHeight, l = a.$root.offsetWidth;
      (function h() {
        a.$destroyed || (a.$root && (a.$root.offsetHeight == o && a.$root.offsetWidth == l || s(a), o = a.$root.offsetHeight, l = a.$root.offsetWidth), setTimeout(h, 200));
      })();
    }(r) : (_.appendChild(d), d.contentWindow ? n(r, d.contentWindow) : (_.removeChild(d), n(r, window)));
  })(e);
}
class ba {
  constructor() {
    this._silent_mode = !1, this.listeners = {};
  }
  _silentStart() {
    this._silent_mode = !0;
  }
  _silentEnd() {
    this._silent_mode = !1;
  }
}
const xa = function(e) {
  let i = {}, t = 0;
  const n = function() {
    let s = !0;
    for (const r in i) {
      const _ = i[r].apply(e, arguments);
      s = s && _;
    }
    return s;
  };
  return n.addEvent = function(s, r) {
    if (typeof s == "function") {
      let _;
      if (r && r.id ? _ = r.id : (_ = t, t++), r && r.once) {
        const d = s;
        s = function() {
          d(), n.removeEvent(_);
        };
      }
      return i[_] = s, _;
    }
    return !1;
  }, n.removeEvent = function(s) {
    delete i[s];
  }, n.clear = function() {
    i = {};
  }, n;
};
function nt(e) {
  const i = new ba();
  e.attachEvent = function(t, n, s) {
    t = "ev_" + t.toLowerCase(), i.listeners[t] || (i.listeners[t] = xa(this)), s && s.thisObject && (n = n.bind(s.thisObject));
    let r = t + ":" + i.listeners[t].addEvent(n, s);
    return s && s.id && (r = s.id), r;
  }, e.attachAll = function(t) {
    this.attachEvent("listen_all", t);
  }, e.callEvent = function(t, n) {
    if (i._silent_mode)
      return !0;
    const s = "ev_" + t.toLowerCase(), r = i.listeners;
    return r.ev_listen_all && r.ev_listen_all.apply(this, [t].concat(n)), !r[s] || r[s].apply(this, n);
  }, e.checkEvent = function(t) {
    return !!i.listeners["ev_" + t.toLowerCase()];
  }, e.detachEvent = function(t) {
    if (t) {
      let n = i.listeners;
      for (const r in n)
        n[r].removeEvent(t);
      const s = t.split(":");
      if (n = i.listeners, s.length === 2) {
        const r = s[0], _ = s[1];
        n[r] && n[r].removeEvent(_);
      }
    }
  }, e.detachAllEvents = function() {
    for (const t in i.listeners)
      i.listeners[t].clear();
  };
}
const Nt = { event: function(e, i, t) {
  e.addEventListener ? e.addEventListener(i, t, !1) : e.attachEvent && e.attachEvent("on" + i, t);
}, eventRemove: function(e, i, t) {
  e.removeEventListener ? e.removeEventListener(i, t, !1) : e.detachEvent && e.detachEvent("on" + i, t);
} };
function wa(e) {
  var i = function() {
    var t = function(n, s) {
      n = n || Nt.event, s = s || Nt.eventRemove;
      var r = [], _ = { attach: function(d, a, o, l) {
        r.push({ element: d, event: a, callback: o, capture: l }), n(d, a, o, l);
      }, detach: function(d, a, o, l) {
        s(d, a, o, l);
        for (var h = 0; h < r.length; h++) {
          var y = r[h];
          y.element === d && y.event === a && y.callback === o && y.capture === l && (r.splice(h, 1), h--);
        }
      }, detachAll: function() {
        for (var d = r.slice(), a = 0; a < d.length; a++) {
          var o = d[a];
          _.detach(o.element, o.event, o.callback, o.capture), _.detach(o.element, o.event, o.callback, void 0), _.detach(o.element, o.event, o.callback, !1), _.detach(o.element, o.event, o.callback, !0);
        }
        r.splice(0, r.length);
      }, extend: function() {
        return t(this.event, this.eventRemove);
      } };
      return _;
    };
    return t();
  }();
  e.event = i.attach, e.eventRemove = i.detach, e._eventRemoveAll = i.detachAll, e._createDomEventScope = i.extend, e._trim = function(t) {
    return (String.prototype.trim || function() {
      return this.replace(/^\s+|\s+$/g, "");
    }).apply(t);
  }, e._isDate = function(t) {
    return !(!t || typeof t != "object") && !!(t.getFullYear && t.getMonth && t.getDate);
  }, e._isObject = function(t) {
    return t && typeof t == "object";
  };
}
function Xt(e) {
  if (!e)
    return "";
  var i = e.className || "";
  return i.baseVal && (i = i.baseVal), i.indexOf || (i = ""), i || "";
}
function Kt(e, i, t) {
  t === void 0 && (t = !0);
  for (var n = e.target || e.srcElement, s = ""; n; ) {
    if (s = Xt(n)) {
      var r = s.indexOf(i);
      if (r >= 0) {
        if (!t)
          return n;
        var _ = r === 0 || !(s.charAt(r - 1) || "").trim(), d = r + i.length >= s.length || !s.charAt(r + i.length).trim();
        if (_ && d)
          return n;
      }
    }
    n = n.parentNode;
  }
  return null;
}
function ka(e) {
  var i = !1, t = !1;
  if (window.getComputedStyle) {
    var n = window.getComputedStyle(e, null);
    i = n.display, t = n.visibility;
  } else
    e.currentStyle && (i = e.currentStyle.display, t = e.currentStyle.visibility);
  var s = !1, r = Kt({ target: e }, "dhx_form_repeat", !1);
  return r && (s = r.style.height == "0px"), s = s || !e.offsetHeight, i != "none" && t != "hidden" && !s;
}
function Ea(e) {
  return !isNaN(e.getAttribute("tabindex")) && 1 * e.getAttribute("tabindex") >= 0;
}
function Da(e) {
  return !{ a: !0, area: !0 }[e.nodeName.loLowerCase()] || !!e.getAttribute("href");
}
function Sa(e) {
  return !{ input: !0, select: !0, textarea: !0, button: !0, object: !0 }[e.nodeName.toLowerCase()] || !e.hasAttribute("disabled");
}
function Gt() {
  return document.head.createShadowRoot || document.head.attachShadow;
}
function Tt(e) {
  if (!e || !Gt())
    return document.body;
  for (; e.parentNode && (e = e.parentNode); )
    if (e instanceof ShadowRoot)
      return e.host;
  return document.body;
}
const Ae = { getAbsoluteLeft: function(e) {
  return this.getOffset(e).left;
}, getAbsoluteTop: function(e) {
  return this.getOffset(e).top;
}, getOffsetSum: function(e) {
  for (var i = 0, t = 0; e; )
    i += parseInt(e.offsetTop), t += parseInt(e.offsetLeft), e = e.offsetParent;
  return { top: i, left: t };
}, getOffsetRect: function(e) {
  var i = e.getBoundingClientRect(), t = 0, n = 0;
  if (/Mobi/.test(navigator.userAgent)) {
    var s = document.createElement("div");
    s.style.position = "absolute", s.style.left = "0px", s.style.top = "0px", s.style.width = "1px", s.style.height = "1px", document.body.appendChild(s);
    var r = s.getBoundingClientRect();
    t = i.top - r.top, n = i.left - r.left, s.parentNode.removeChild(s);
  } else {
    var _ = document.body, d = document.documentElement, a = window.pageYOffset || d.scrollTop || _.scrollTop, o = window.pageXOffset || d.scrollLeft || _.scrollLeft, l = d.clientTop || _.clientTop || 0, h = d.clientLeft || _.clientLeft || 0;
    t = i.top + a - l, n = i.left + o - h;
  }
  return { top: Math.round(t), left: Math.round(n) };
}, getOffset: function(e) {
  return e.getBoundingClientRect ? this.getOffsetRect(e) : this.getOffsetSum(e);
}, closest: function(e, i) {
  return e && i ? lt(e, i) : null;
}, insertAfter: function(e, i) {
  i.nextSibling ? i.parentNode.insertBefore(e, i.nextSibling) : i.parentNode.appendChild(e);
}, remove: function(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}, isChildOf: function(e, i) {
  return i.contains(e);
}, getFocusableNodes: function(e) {
  for (var i = e.querySelectorAll(["a[href]", "area[href]", "input", "select", "textarea", "button", "iframe", "object", "embed", "[tabindex]", "[contenteditable]"].join(", ")), t = Array.prototype.slice.call(i, 0), n = 0; n < t.length; n++)
    t[n].$position = n;
  for (t.sort(function(r, _) {
    return r.tabIndex === 0 && _.tabIndex !== 0 ? 1 : r.tabIndex !== 0 && _.tabIndex === 0 ? -1 : r.tabIndex === _.tabIndex ? r.$position - _.$position : r.tabIndex < _.tabIndex ? -1 : 1;
  }), n = 0; n < t.length; n++) {
    var s = t[n];
    (Ea(s) || Sa(s) || Da(s)) && ka(s) || (t.splice(n, 1), n--);
  }
  return t;
}, getClassName: Xt, locateCss: Kt, getRootNode: Tt, hasShadowParent: function(e) {
  return !!Tt(e);
}, isShadowDomSupported: Gt, getActiveElement: function() {
  var e = document.activeElement;
  return e.shadowRoot && (e = e.shadowRoot.activeElement), e === document.body && document.getSelection && (e = document.getSelection().focusNode || document.body), e;
}, getRelativeEventPosition: function(e, i) {
  var t = document.documentElement, n = function(s) {
    var r = 0, _ = 0, d = 0, a = 0;
    if (s.getBoundingClientRect) {
      var o = s.getBoundingClientRect(), l = document.body, h = document.documentElement || document.body.parentNode || document.body, y = window.pageYOffset || h.scrollTop || l.scrollTop, m = window.pageXOffset || h.scrollLeft || l.scrollLeft, f = h.clientTop || l.clientTop || 0, u = h.clientLeft || l.clientLeft || 0;
      r = o.top + y - f, _ = o.left + m - u, d = document.body.offsetWidth - o.right, a = document.body.offsetHeight - o.bottom;
    } else {
      for (; s; )
        r += parseInt(s.offsetTop, 10), _ += parseInt(s.offsetLeft, 10), s = s.offsetParent;
      d = document.body.offsetWidth - s.offsetWidth - _, a = document.body.offsetHeight - s.offsetHeight - r;
    }
    return { y: Math.round(r), x: Math.round(_), width: s.offsetWidth, height: s.offsetHeight, right: Math.round(d), bottom: Math.round(a) };
  }(i);
  return { x: e.clientX - t.clientLeft - n.x + i.scrollLeft, y: e.clientY - t.clientTop - n.y + i.scrollTop };
}, getTargetNode: function(e) {
  var i;
  return e.tagName ? i = e : (i = (e = e || window.event).target || e.srcElement).shadowRoot && e.composedPath && (i = e.composedPath()[0]), i;
}, getNodePosition: function(e) {
  var i = 0, t = 0, n = 0, s = 0;
  if (e.getBoundingClientRect) {
    var r = e.getBoundingClientRect(), _ = document.body, d = document.documentElement || document.body.parentNode || document.body, a = window.pageYOffset || d.scrollTop || _.scrollTop, o = window.pageXOffset || d.scrollLeft || _.scrollLeft, l = d.clientTop || _.clientTop || 0, h = d.clientLeft || _.clientLeft || 0;
    i = r.top + a - l, t = r.left + o - h, n = document.body.offsetWidth - r.right, s = document.body.offsetHeight - r.bottom;
  } else {
    for (; e; )
      i += parseInt(e.offsetTop, 10), t += parseInt(e.offsetLeft, 10), e = e.offsetParent;
    n = document.body.offsetWidth - e.offsetWidth - t, s = document.body.offsetHeight - e.offsetHeight - i;
  }
  return { y: Math.round(i), x: Math.round(t), width: e.offsetWidth, height: e.offsetHeight, right: Math.round(n), bottom: Math.round(s) };
} };
var lt;
if (Element.prototype.closest)
  lt = function(e, i) {
    return e.closest(i);
  };
else {
  var Ma = Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  lt = function(e, i) {
    var t = e;
    do {
      if (Ma.call(t, i))
        return t;
      t = t.parentElement || t.parentNode;
    } while (t !== null && t.nodeType === 1);
    return null;
  };
}
var Te = typeof window < "u";
const Na = { isIE: Te && (navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0), isOpera: Te && navigator.userAgent.indexOf("Opera") >= 0, isChrome: Te && navigator.userAgent.indexOf("Chrome") >= 0, isKHTML: Te && (navigator.userAgent.indexOf("Safari") >= 0 || navigator.userAgent.indexOf("Konqueror") >= 0), isFF: Te && navigator.userAgent.indexOf("Firefox") >= 0, isIPad: Te && navigator.userAgent.search(/iPad/gi) >= 0, isEdge: Te && navigator.userAgent.indexOf("Edge") != -1, isNode: !Te || typeof navigator > "u" };
function ot(e) {
  if (typeof e == "string" || typeof e == "number")
    return e;
  var i = "";
  for (var t in e) {
    var n = "";
    e.hasOwnProperty(t) && (n = t + "=" + (n = typeof e[t] == "string" ? encodeURIComponent(e[t]) : typeof e[t] == "number" ? e[t] : encodeURIComponent(JSON.stringify(e[t]))), i.length && (n = "&" + n), i += n);
  }
  return i;
}
function Ta(e) {
  var i = function(r, _) {
    for (var d = "var temp=date.match(/[a-zA-Z]+|[0-9]+/g);", a = r.match(/%[a-zA-Z]/g), o = 0; o < a.length; o++)
      switch (a[o]) {
        case "%j":
        case "%d":
          d += "set[2]=temp[" + o + "]||1;";
          break;
        case "%n":
        case "%m":
          d += "set[1]=(temp[" + o + "]||1)-1;";
          break;
        case "%y":
          d += "set[0]=temp[" + o + "]*1+(temp[" + o + "]>50?1900:2000);";
          break;
        case "%g":
        case "%G":
        case "%h":
        case "%H":
          d += "set[3]=temp[" + o + "]||0;";
          break;
        case "%i":
          d += "set[4]=temp[" + o + "]||0;";
          break;
        case "%Y":
          d += "set[0]=temp[" + o + "]||0;";
          break;
        case "%a":
        case "%A":
          d += "set[3]=set[3]%12+((temp[" + o + "]||'').toLowerCase()=='am'?0:12);";
          break;
        case "%s":
          d += "set[5]=temp[" + o + "]||0;";
          break;
        case "%M":
          d += "set[1]=this.locale.date.month_short_hash[temp[" + o + "]]||0;";
          break;
        case "%F":
          d += "set[1]=this.locale.date.month_full_hash[temp[" + o + "]]||0;";
      }
    var l = "set[0],set[1],set[2],set[3],set[4],set[5]";
    return _ && (l = " Date.UTC(" + l + ")"), new Function("date", "var set=[0,0,1,0,0,0]; " + d + " return new Date(" + l + ");");
  }, t = function(r, _) {
    const d = r.match(/%[a-zA-Z]/g);
    return function(a) {
      for (var o = [0, 0, 1, 0, 0, 0], l = a.match(/[a-zA-Z]+|[0-9]+/g), h = 0; h < d.length; h++)
        switch (d[h]) {
          case "%j":
          case "%d":
            o[2] = l[h] || 1;
            break;
          case "%n":
          case "%m":
            o[1] = (l[h] || 1) - 1;
            break;
          case "%y":
            o[0] = 1 * l[h] + (l[h] > 50 ? 1900 : 2e3);
            break;
          case "%g":
          case "%G":
          case "%h":
          case "%H":
            o[3] = l[h] || 0;
            break;
          case "%i":
            o[4] = l[h] || 0;
            break;
          case "%Y":
            o[0] = l[h] || 0;
            break;
          case "%a":
          case "%A":
            o[3] = o[3] % 12 + ((l[h] || "").toLowerCase() == "am" ? 0 : 12);
            break;
          case "%s":
            o[5] = l[h] || 0;
            break;
          case "%M":
            o[1] = e.locale.date.month_short_hash[l[h]] || 0;
            break;
          case "%F":
            o[1] = e.locale.date.month_full_hash[l[h]] || 0;
        }
      return _ ? new Date(Date.UTC(o[0], o[1], o[2], o[3], o[4], o[5])) : new Date(o[0], o[1], o[2], o[3], o[4], o[5]);
    };
  };
  let n;
  function s() {
    var r = !1;
    return e.config.csp === "auto" ? (n === void 0 && (n = function() {
      try {
        new Function("cspEnabled = false;"), n = !1;
      } catch {
        n = !0;
      }
      return n;
    }()), r = n) : r = e.config.csp, r;
  }
  e.date = { init: function() {
    for (var r = e.locale.date.month_short, _ = e.locale.date.month_short_hash = {}, d = 0; d < r.length; d++)
      _[r[d]] = d;
    for (r = e.locale.date.month_full, _ = e.locale.date.month_full_hash = {}, d = 0; d < r.length; d++)
      _[r[d]] = d;
  }, date_part: function(r) {
    var _ = new Date(r);
    return r.setHours(0), r.setMinutes(0), r.setSeconds(0), r.setMilliseconds(0), r.getHours() && (r.getDate() < _.getDate() || r.getMonth() < _.getMonth() || r.getFullYear() < _.getFullYear()) && r.setTime(r.getTime() + 36e5 * (24 - r.getHours())), r;
  }, time_part: function(r) {
    return (r.valueOf() / 1e3 - 60 * r.getTimezoneOffset()) % 86400;
  }, week_start: function(r) {
    var _ = r.getDay();
    return e.config.start_on_monday && (_ === 0 ? _ = 6 : _--), this.date_part(this.add(r, -1 * _, "day"));
  }, month_start: function(r) {
    return r.setDate(1), this.date_part(r);
  }, year_start: function(r) {
    return r.setMonth(0), this.month_start(r);
  }, day_start: function(r) {
    return this.date_part(r);
  }, _add_days: function(r, _) {
    var d = new Date(r.valueOf());
    if (d.setDate(d.getDate() + _), _ == Math.round(_) && _ > 0) {
      var a = (+d - +r) % 864e5;
      if (a && r.getTimezoneOffset() == d.getTimezoneOffset()) {
        var o = a / 36e5;
        d.setTime(d.getTime() + 60 * (24 - o) * 60 * 1e3);
      }
    }
    return _ >= 0 && !r.getHours() && d.getHours() && (d.getDate() < r.getDate() || d.getMonth() < r.getMonth() || d.getFullYear() < r.getFullYear()) && d.setTime(d.getTime() + 36e5 * (24 - d.getHours())), d;
  }, add: function(r, _, d) {
    var a = new Date(r.valueOf());
    switch (d) {
      case "day":
        a = e.date._add_days(a, _);
        break;
      case "week":
        a = e.date._add_days(a, 7 * _);
        break;
      case "month":
        a.setMonth(a.getMonth() + _);
        break;
      case "year":
        a.setYear(a.getFullYear() + _);
        break;
      case "hour":
        a.setTime(a.getTime() + 60 * _ * 60 * 1e3);
        break;
      case "minute":
        a.setTime(a.getTime() + 60 * _ * 1e3);
        break;
      default:
        return e.date["add_" + d](r, _, d);
    }
    return a;
  }, to_fixed: function(r) {
    return r < 10 ? "0" + r : r;
  }, copy: function(r) {
    return new Date(r.valueOf());
  }, date_to_str: function(r, _) {
    return s() ? function(d, a) {
      return function(o) {
        return d.replace(/%[a-zA-Z]/g, function(l) {
          switch (l) {
            case "%d":
              return a ? e.date.to_fixed(o.getUTCDate()) : e.date.to_fixed(o.getDate());
            case "%m":
              return a ? e.date.to_fixed(o.getUTCMonth() + 1) : e.date.to_fixed(o.getMonth() + 1);
            case "%j":
              return a ? o.getUTCDate() : o.getDate();
            case "%n":
              return a ? o.getUTCMonth() + 1 : o.getMonth() + 1;
            case "%y":
              return a ? e.date.to_fixed(o.getUTCFullYear() % 100) : e.date.to_fixed(o.getFullYear() % 100);
            case "%Y":
              return a ? o.getUTCFullYear() : o.getFullYear();
            case "%D":
              return a ? e.locale.date.day_short[o.getUTCDay()] : e.locale.date.day_short[o.getDay()];
            case "%l":
              return a ? e.locale.date.day_full[o.getUTCDay()] : e.locale.date.day_full[o.getDay()];
            case "%M":
              return a ? e.locale.date.month_short[o.getUTCMonth()] : e.locale.date.month_short[o.getMonth()];
            case "%F":
              return a ? e.locale.date.month_full[o.getUTCMonth()] : e.locale.date.month_full[o.getMonth()];
            case "%h":
              return a ? e.date.to_fixed((o.getUTCHours() + 11) % 12 + 1) : e.date.to_fixed((o.getHours() + 11) % 12 + 1);
            case "%g":
              return a ? (o.getUTCHours() + 11) % 12 + 1 : (o.getHours() + 11) % 12 + 1;
            case "%G":
              return a ? o.getUTCHours() : o.getHours();
            case "%H":
              return a ? e.date.to_fixed(o.getUTCHours()) : e.date.to_fixed(o.getHours());
            case "%i":
              return a ? e.date.to_fixed(o.getUTCMinutes()) : e.date.to_fixed(o.getMinutes());
            case "%a":
              return a ? o.getUTCHours() > 11 ? "pm" : "am" : o.getHours() > 11 ? "pm" : "am";
            case "%A":
              return a ? o.getUTCHours() > 11 ? "PM" : "AM" : o.getHours() > 11 ? "PM" : "AM";
            case "%s":
              return a ? e.date.to_fixed(o.getUTCSeconds()) : e.date.to_fixed(o.getSeconds());
            case "%W":
              return a ? e.date.to_fixed(e.date.getUTCISOWeek(o)) : e.date.to_fixed(e.date.getISOWeek(o));
            default:
              return l;
          }
        });
      };
    }(r, _) : (r = r.replace(/%[a-zA-Z]/g, function(d) {
      switch (d) {
        case "%d":
          return '"+this.date.to_fixed(date.getDate())+"';
        case "%m":
          return '"+this.date.to_fixed((date.getMonth()+1))+"';
        case "%j":
          return '"+date.getDate()+"';
        case "%n":
          return '"+(date.getMonth()+1)+"';
        case "%y":
          return '"+this.date.to_fixed(date.getFullYear()%100)+"';
        case "%Y":
          return '"+date.getFullYear()+"';
        case "%D":
          return '"+this.locale.date.day_short[date.getDay()]+"';
        case "%l":
          return '"+this.locale.date.day_full[date.getDay()]+"';
        case "%M":
          return '"+this.locale.date.month_short[date.getMonth()]+"';
        case "%F":
          return '"+this.locale.date.month_full[date.getMonth()]+"';
        case "%h":
          return '"+this.date.to_fixed((date.getHours()+11)%12+1)+"';
        case "%g":
          return '"+((date.getHours()+11)%12+1)+"';
        case "%G":
          return '"+date.getHours()+"';
        case "%H":
          return '"+this.date.to_fixed(date.getHours())+"';
        case "%i":
          return '"+this.date.to_fixed(date.getMinutes())+"';
        case "%a":
          return '"+(date.getHours()>11?"pm":"am")+"';
        case "%A":
          return '"+(date.getHours()>11?"PM":"AM")+"';
        case "%s":
          return '"+this.date.to_fixed(date.getSeconds())+"';
        case "%W":
          return '"+this.date.to_fixed(this.date.getISOWeek(date))+"';
        default:
          return d;
      }
    }), _ && (r = r.replace(/date\.get/g, "date.getUTC")), new Function("date", 'return "' + r + '";').bind(e));
  }, str_to_date: function(r, _, d) {
    var a = s() ? t : i, o = a(r, _), l = /^[0-9]{4}(\-|\/)[0-9]{2}(\-|\/)[0-9]{2} ?(([0-9]{1,2}:[0-9]{1,2})(:[0-9]{1,2})?)?$/, h = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4} ?(([0-9]{1,2}:[0-9]{2})(:[0-9]{1,2})?)?$/, y = /^[0-9]{2}\-[0-9]{2}\-[0-9]{4} ?(([0-9]{1,2}:[0-9]{1,2})(:[0-9]{1,2})?)?$/, m = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/, f = a("%Y-%m-%d %H:%i:%s", _), u = a("%m/%d/%Y %H:%i:%s", _), v = a("%d-%m-%Y %H:%i:%s", _);
    return function(c) {
      if (!d && !e.config.parse_exact_format) {
        if (c && c.getISOWeek)
          return new Date(c);
        if (typeof c == "number")
          return new Date(c);
        if (p = c, l.test(String(p)))
          return f(c);
        if (function(g) {
          return h.test(String(g));
        }(c))
          return u(c);
        if (function(g) {
          return y.test(String(g));
        }(c))
          return v(c);
        if (function(g) {
          return m.test(g);
        }(c))
          return new Date(c);
      }
      var p;
      return o.call(e, c);
    };
  }, getISOWeek: function(r) {
    if (!r)
      return !1;
    var _ = (r = this.date_part(new Date(r))).getDay();
    _ === 0 && (_ = 7);
    var d = new Date(r.valueOf());
    d.setDate(r.getDate() + (4 - _));
    var a = d.getFullYear(), o = Math.round((d.getTime() - new Date(a, 0, 1).getTime()) / 864e5);
    return 1 + Math.floor(o / 7);
  }, getUTCISOWeek: function(r) {
    return this.getISOWeek(this.convert_to_utc(r));
  }, convert_to_utc: function(r) {
    return new Date(r.getUTCFullYear(), r.getUTCMonth(), r.getUTCDate(), r.getUTCHours(), r.getUTCMinutes(), r.getUTCSeconds());
  } };
}
function Zt(e) {
  return (function() {
    var i = {};
    for (var t in this._events) {
      var n = this._events[t];
      n.id.toString().indexOf("#") == -1 && (i[n.id] = n);
    }
    return i;
  }).bind(e);
}
function Aa(e) {
  e._loaded = {}, e._load = function(t, n) {
    if (t = t || this._load_url) {
      var s;
      if (t += (t.indexOf("?") == -1 ? "?" : "&") + "timeshift=" + (/* @__PURE__ */ new Date()).getTimezoneOffset(), this.config.prevent_cache && (t += "&uid=" + this.uid()), n = n || this._date, this._load_mode) {
        var r = this.templates.load_format;
        for (n = this.date[this._load_mode + "_start"](new Date(n.valueOf())); n > this._min_date; )
          n = this.date.add(n, -1, this._load_mode);
        s = n;
        for (var _ = !0; s < this._max_date; )
          s = this.date.add(s, 1, this._load_mode), this._loaded[r(n)] && _ ? n = this.date.add(n, 1, this._load_mode) : _ = !1;
        var d = s;
        do
          s = d, d = this.date.add(s, -1, this._load_mode);
        while (d > n && this._loaded[r(d)]);
        if (s <= n)
          return !1;
        for (e.ajax.get(t + "&from=" + r(n) + "&to=" + r(s), a); n < s; )
          this._loaded[r(n)] = !0, n = this.date.add(n, 1, this._load_mode);
      } else
        e.ajax.get(t, a);
      return this.callEvent("onXLS", []), this.callEvent("onLoadStart", []), !0;
    }
    function a(o) {
      e.on_load(o), e.callEvent("onLoadEnd", []);
    }
  }, e._parsers = {}, function(t) {
    t._parsers.xml = { canParse: function(n, s) {
      if (s.responseXML && s.responseXML.firstChild)
        return !0;
      try {
        var r = t.ajax.parse(s.responseText), _ = t.ajax.xmltop("data", r);
        if (_ && _.tagName === "data")
          return !0;
      } catch {
      }
      return !1;
    }, parse: function(n) {
      var s;
      if (n.xmlDoc.responseXML || (n.xmlDoc.responseXML = t.ajax.parse(n.xmlDoc.responseText)), (s = t.ajax.xmltop("data", n.xmlDoc)).tagName != "data")
        return null;
      var r = s.getAttribute("dhx_security");
      r && (window.dhtmlx && (window.dhtmlx.security_key = r), t.security_key = r);
      for (var _ = t.ajax.xpath("//coll_options", n.xmlDoc), d = 0; d < _.length; d++) {
        var a = _[d].getAttribute("for"), o = t.serverList[a];
        o || (t.serverList[a] = o = []), o.splice(0, o.length);
        for (var l = t.ajax.xpath(".//item", _[d]), h = 0; h < l.length; h++) {
          for (var y = l[h].attributes, m = { key: l[h].getAttribute("value"), label: l[h].getAttribute("label") }, f = 0; f < y.length; f++) {
            var u = y[f];
            u.nodeName != "value" && u.nodeName != "label" && (m[u.nodeName] = u.nodeValue);
          }
          o.push(m);
        }
      }
      _.length && t.callEvent("onOptionsLoad", []);
      var v = t.ajax.xpath("//userdata", n.xmlDoc);
      for (d = 0; d < v.length; d++) {
        var c = t._xmlNodeToJSON(v[d]);
        t._userdata[c.name] = c.text;
      }
      var p = [];
      for (s = t.ajax.xpath("//event", n.xmlDoc), d = 0; d < s.length; d++) {
        var g = p[d] = t._xmlNodeToJSON(s[d]);
        t._init_event(g);
      }
      return p;
    } };
  }(e), function(t) {
    t.json = t._parsers.json = { canParse: function(n) {
      if (n && typeof n == "object")
        return !0;
      if (typeof n == "string")
        try {
          var s = JSON.parse(n);
          return Object.prototype.toString.call(s) === "[object Object]" || Object.prototype.toString.call(s) === "[object Array]";
        } catch {
          return !1;
        }
      return !1;
    }, parse: function(n) {
      var s = [];
      typeof n == "string" && (n = JSON.parse(n)), Object.prototype.toString.call(n) === "[object Array]" ? s = n : n && (n.events ? s = n.events : n.data && (s = n.data)), s = s || [], n.dhx_security && (window.dhtmlx && (window.dhtmlx.security_key = n.dhx_security), t.security_key = n.dhx_security);
      var r = n && n.collections ? n.collections : {}, _ = !1;
      for (var d in r)
        if (r.hasOwnProperty(d)) {
          _ = !0;
          var a = r[d], o = t.serverList[d];
          o || (t.serverList[d] = o = []), o.splice(0, o.length);
          for (var l = 0; l < a.length; l++) {
            var h = a[l], y = { key: h.value, label: h.label };
            for (var m in h)
              if (h.hasOwnProperty(m)) {
                if (m == "value" || m == "label")
                  continue;
                y[m] = h[m];
              }
            o.push(y);
          }
        }
      _ && t.callEvent("onOptionsLoad", []);
      for (var f = [], u = 0; u < s.length; u++) {
        var v = s[u];
        t._init_event(v), f.push(v);
      }
      return f;
    } };
  }(e), function(t) {
    t.ical = t._parsers.ical = { canParse: function(n) {
      return typeof n == "string" && new RegExp("^BEGIN:VCALENDAR").test(n);
    }, parse: function(n) {
      var s = n.match(RegExp(this.c_start + "[^\f]*" + this.c_end, ""));
      if (s.length) {
        s[0] = s[0].replace(/[\r\n]+ /g, ""), s[0] = s[0].replace(/[\r\n]+(?=[a-z \t])/g, " "), s[0] = s[0].replace(/;[^:\r\n]*:/g, ":");
        for (var r, _ = [], d = RegExp("(?:" + this.e_start + ")([^\f]*?)(?:" + this.e_end + ")", "g"); (r = d.exec(s)) !== null; ) {
          for (var a, o = {}, l = /[^\r\n]+[\r\n]+/g; (a = l.exec(r[1])) !== null; )
            this.parse_param(a.toString(), o);
          o.uid && !o.id && (o.id = o.uid), _.push(o);
        }
        return _;
      }
    }, parse_param: function(n, s) {
      var r = n.indexOf(":");
      if (r != -1) {
        var _ = n.substr(0, r).toLowerCase(), d = n.substr(r + 1).replace(/\\,/g, ",").replace(/[\r\n]+$/, "");
        _ == "summary" ? _ = "text" : _ == "dtstart" ? (_ = "start_date", d = this.parse_date(d, 0, 0)) : _ == "dtend" && (_ = "end_date", d = this.parse_date(d, 0, 0)), s[_] = d;
      }
    }, parse_date: function(n, s, r) {
      var _ = n.split("T"), d = !1;
      _[1] && (s = _[1].substr(0, 2), r = _[1].substr(2, 2), d = _[1][6] == "Z");
      var a = _[0].substr(0, 4), o = parseInt(_[0].substr(4, 2), 10) - 1, l = _[0].substr(6, 2);
      return t.config.server_utc || d ? new Date(Date.UTC(a, o, l, s, r)) : new Date(a, o, l, s, r);
    }, c_start: "BEGIN:VCALENDAR", e_start: "BEGIN:VEVENT", e_end: "END:VEVENT", c_end: "END:VCALENDAR" };
  }(e), e.on_load = function(t) {
    var n;
    this.callEvent("onBeforeParse", []);
    var s = !1, r = !1;
    for (var _ in this._parsers) {
      var d = this._parsers[_];
      if (d.canParse(t.xmlDoc.responseText, t.xmlDoc)) {
        try {
          var a = t.xmlDoc.responseText;
          _ === "xml" && (a = t), (n = d.parse(a)) || (s = !0);
        } catch {
          s = !0;
        }
        r = !0;
        break;
      }
    }
    if (!r)
      if (this._process && this[this._process])
        try {
          n = this[this._process].parse(t.xmlDoc.responseText);
        } catch {
          s = !0;
        }
      else
        s = !0;
    (s || t.xmlDoc.status && t.xmlDoc.status >= 400) && (this.callEvent("onLoadError", [t.xmlDoc]), n = []), this._process_loading(n), this.callEvent("onXLE", []), this.callEvent("onParse", []);
  }, e._process_loading = function(t) {
    this._loading = !0, this._not_render = !0;
    for (var n = 0; n < t.length; n++)
      this.callEvent("onEventLoading", [t[n]]) && this.addEvent(t[n]);
    this._not_render = !1, this._render_wait && this.render_view_data(), this._loading = !1, this._after_call && this._after_call(), this._after_call = null;
  }, e._init_event = function(t) {
    t.text = t.text || t._tagvalue || "", t.start_date = e._init_date(t.start_date), t.end_date = e._init_date(t.end_date);
  }, e._init_date = function(t) {
    return t ? typeof t == "string" ? e._helpers.parseDate(t) : new Date(t) : null;
  };
  const i = Zt(e);
  e.serialize = function() {
    const t = [], n = i();
    for (var s in n) {
      const d = {};
      var r = n[s];
      for (var _ in r) {
        if (_.charAt(0) == "$" || _.charAt(0) == "_")
          continue;
        let a;
        const o = r[_];
        a = e.utils.isDate(o) ? e.defined(e.templates.xml_format) ? e.templates.xml_format(o) : e.templates.format_date(o) : o, d[_] = a;
      }
      t.push(d);
    }
    return t;
  }, e.parse = function(t, n) {
    this._process = n, this.on_load({ xmlDoc: { responseText: t } });
  }, e.load = function(t, n) {
    typeof n == "string" && (this._process = n, n = arguments[2]), this._load_url = t, this._after_call = n, this._load(t, this._date);
  }, e.setLoadMode = function(t) {
    t == "all" && (t = ""), this._load_mode = t;
  }, e.serverList = function(t, n) {
    return n ? (this.serverList[t] = n.slice(0), this.serverList[t]) : (this.serverList[t] = this.serverList[t] || [], this.serverList[t]);
  }, e._userdata = {}, e._xmlNodeToJSON = function(t) {
    for (var n = {}, s = 0; s < t.attributes.length; s++)
      n[t.attributes[s].name] = t.attributes[s].value;
    for (s = 0; s < t.childNodes.length; s++) {
      var r = t.childNodes[s];
      r.nodeType == 1 && (n[r.tagName] = r.firstChild ? r.firstChild.nodeValue : "");
    }
    return n.text || (n.text = t.firstChild ? t.firstChild.nodeValue : ""), n;
  }, e.attachEvent("onXLS", function() {
    var t;
    this.config.show_loading === !0 && ((t = this.config.show_loading = document.createElement("div")).className = "dhx_loading", t.style.left = Math.round((this._x - 128) / 2) + "px", t.style.top = Math.round((this._y - 15) / 2) + "px", this._obj.appendChild(t));
  }), e.attachEvent("onXLE", function() {
    var t = this.config.show_loading;
    t && typeof t == "object" && (t.parentNode && t.parentNode.removeChild(t), this.config.show_loading = !0);
  });
}
function Ca(e) {
  e._init_touch_events = function() {
    if ((this.config.touch && (navigator.userAgent.indexOf("Mobile") != -1 || navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("Android") != -1 || navigator.userAgent.indexOf("Touch") != -1) && !window.MSStream || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && (this.xy.scroll_width = 0, this._mobile = !0), this.config.touch) {
      var i = !0;
      try {
        document.createEvent("TouchEvent");
      } catch {
        i = !1;
      }
      i ? this._touch_events(["touchmove", "touchstart", "touchend"], function(t) {
        return t.touches && t.touches.length > 1 ? null : t.touches[0] ? { target: t.target, pageX: t.touches[0].pageX, pageY: t.touches[0].pageY, clientX: t.touches[0].clientX, clientY: t.touches[0].clientY } : t;
      }, function() {
        return !1;
      }) : window.PointerEvent || window.navigator.pointerEnabled ? this._touch_events(["pointermove", "pointerdown", "pointerup"], function(t) {
        return t.pointerType == "mouse" ? null : t;
      }, function(t) {
        return !t || t.pointerType == "mouse";
      }) : window.navigator.msPointerEnabled && this._touch_events(["MSPointerMove", "MSPointerDown", "MSPointerUp"], function(t) {
        return t.pointerType == t.MSPOINTER_TYPE_MOUSE ? null : t;
      }, function(t) {
        return !t || t.pointerType == t.MSPOINTER_TYPE_MOUSE;
      });
    }
  }, e._touch_events = function(i, t, n) {
    var s, r, _, d, a, o, l = 0;
    function h(m, f, u) {
      e.event(m, f, function(v) {
        return !!e._is_lightbox_open() || (n(v) ? void 0 : u(v));
      }, { passive: !1 });
    }
    function y(m) {
      n(m) || (e._hide_global_tip(), d && (e._on_mouse_up(t(m)), e._temp_touch_block = !1), e._drag_id = null, e._drag_mode = null, e._drag_pos = null, e._pointerDragId = null, clearTimeout(_), d = o = !1, a = !0);
    }
    h(document.body, i[0], function(m) {
      if (!n(m)) {
        var f = t(m);
        if (f) {
          if (d)
            return function(u) {
              if (!n(u)) {
                var v = e.getState().drag_mode, c = !!e.matrix && e.matrix[e._mode], p = e.render_view_data;
                v == "create" && c && (e.render_view_data = function() {
                  for (var g = e.getState().drag_id, b = e.getEvent(g), x = c.y_property, k = e.getEvents(b.start_date, b.end_date), w = 0; w < k.length; w++)
                    k[w][x] != b[x] && (k.splice(w, 1), w--);
                  b._sorder = k.length - 1, b._count = k.length, this.render_data([b], e.getState().mode);
                }), e._on_mouse_move(u), v == "create" && c && (e.render_view_data = p), u.preventDefault && u.preventDefault(), u.cancelBubble = !0;
              }
            }(f), m.preventDefault && m.preventDefault(), m.cancelBubble = !0, e._update_global_tip(), !1;
          r = t(m), o && (r ? (s.target != r.target || Math.abs(s.pageX - r.pageX) > 5 || Math.abs(s.pageY - r.pageY) > 5) && (a = !0, clearTimeout(_)) : a = !0);
        }
      }
    }), h(this._els.dhx_cal_data[0], "touchcancel", y), h(this._els.dhx_cal_data[0], "contextmenu", function(m) {
      if (!n(m))
        return o ? (m && m.preventDefault && m.preventDefault(), m.cancelBubble = !0, !1) : void 0;
    }), h(this._obj, i[1], function(m) {
      var f;
      if (document && document.body && document.body.classList.add("dhx_cal_touch_active"), !n(m))
        if (e._pointerDragId = m.pointerId, d = a = !1, o = !0, f = r = t(m)) {
          var u = /* @__PURE__ */ new Date();
          if (!a && !d && u - l < 250)
            return e._click.dhx_cal_data(f), window.setTimeout(function() {
              e.$destroyed || e._on_dbl_click(f);
            }, 50), m.preventDefault && m.preventDefault(), m.cancelBubble = !0, e._block_next_stop = !0, !1;
          if (l = u, !a && !d && e.config.touch_drag) {
            var v = e._locate_event(document.activeElement), c = e._locate_event(f.target), p = s ? e._locate_event(s.target) : null;
            if (v && c && v == c && v != p)
              return m.preventDefault && m.preventDefault(), m.cancelBubble = !0, e._ignore_next_click = !1, e._click.dhx_cal_data(f), s = f, !1;
            _ = setTimeout(function() {
              if (!e.$destroyed) {
                d = !0;
                var g = s.target, b = e._getClassName(g);
                g && b.indexOf("dhx_body") != -1 && (g = g.previousSibling), e._on_mouse_down(s, g), e._drag_mode && e._drag_mode != "create" && e.for_rendered(e._drag_id, function(x, k) {
                  x.style.display = "none", e._rendered.splice(k, 1);
                }), e.config.touch_tip && e._show_global_tip(), e.updateEvent(e._drag_id);
              }
            }, e.config.touch_drag), s = f;
          }
        } else
          a = !0;
    }), h(this._els.dhx_cal_data[0], i[2], function(m) {
      if (document && document.body && document.body.classList.remove("dhx_cal_touch_active"), !n(m))
        return e.config.touch_swipe_dates && !d && function(f, u, v, c) {
          if (!f || !u)
            return !1;
          for (var p = f.target; p && p != e._obj; )
            p = p.parentNode;
          if (p != e._obj || e.matrix && e.matrix[e.getState().mode] && e.matrix[e.getState().mode].scrollable)
            return !1;
          var g = Math.abs(f.pageY - u.pageY), b = Math.abs(f.pageX - u.pageX);
          return g < c && b > v && (!g || b / g > 3) && (f.pageX > u.pageX ? e._click.dhx_cal_next_button() : e._click.dhx_cal_prev_button(), !0);
        }(s, r, 200, 100) && (e._block_next_stop = !0), d && (e._ignore_next_click = !0, setTimeout(function() {
          e._ignore_next_click = !1;
        }, 100)), y(m), e._block_next_stop ? (e._block_next_stop = !1, m.preventDefault && m.preventDefault(), m.cancelBubble = !0, !1) : void 0;
    }), e.event(document.body, i[2], y);
  }, e._show_global_tip = function() {
    e._hide_global_tip();
    var i = e._global_tip = document.createElement("div");
    i.className = "dhx_global_tip", e._update_global_tip(1), document.body.appendChild(i);
  }, e._update_global_tip = function(i) {
    var t = e._global_tip;
    if (t) {
      var n = "";
      if (e._drag_id && !i) {
        var s = e.getEvent(e._drag_id);
        s && (n = "<div>" + (s._timed ? e.templates.event_header(s.start_date, s.end_date, s) : e.templates.day_date(s.start_date, s.end_date, s)) + "</div>");
      }
      e._drag_mode == "create" || e._drag_mode == "new-size" ? t.innerHTML = (e.locale.labels.drag_to_create || "Drag to create") + n : t.innerHTML = (e.locale.labels.drag_to_move || "Drag to move") + n;
    }
  }, e._hide_global_tip = function() {
    var i = e._global_tip;
    i && i.parentNode && (i.parentNode.removeChild(i), e._global_tip = 0);
  };
}
function Oa(e) {
  var i, t;
  function n() {
    if (e._is_material_skin())
      return !0;
    if (t !== void 0)
      return t;
    var d = document.createElement("div");
    d.style.position = "absolute", d.style.left = "-9999px", d.style.top = "-9999px", d.innerHTML = "<div class='dhx_cal_container'><div class='dhx_cal_data'><div class='dhx_cal_event'><div class='dhx_body'></div></div><div>", document.body.appendChild(d);
    var a = window.getComputedStyle(d.querySelector(".dhx_body")).getPropertyValue("box-sizing");
    document.body.removeChild(d), (t = a === "border-box") || setTimeout(function() {
      t = void 0;
    }, 1e3);
  }
  function s() {
    if (!e._is_material_skin() && !e._border_box_events()) {
      var d = t;
      t = void 0, i = void 0, d !== n() && e.$container && e.getState().mode && e.setCurrentView();
    }
  }
  function r(d) {
    var a = d.getMinutes();
    return a = a < 10 ? "0" + a : a, "<span class='dhx_scale_h'>" + d.getHours() + "</span><span class='dhx_scale_m'>&nbsp;" + a + "</span>";
  }
  e._addThemeClass = function() {
    document.documentElement.setAttribute("data-scheduler-theme", e.skin);
  }, e._skin_settings = { fix_tab_position: [1, 0], use_select_menu_space: [1, 0], wide_form: [1, 0], hour_size_px: [44, 42], displayed_event_color: ["#ff4a4a", "ffc5ab"], displayed_event_text_color: ["#ffef80", "7e2727"] }, e._skin_xy = { lightbox_additional_height: [90, 50], nav_height: [59, 22], bar_height: [24, 20] }, e._is_material_skin = function() {
    return e.skin ? (e.skin + "").indexOf("material") > -1 : function() {
      if (i === void 0) {
        var d = document.createElement("div");
        d.style.position = "absolute", d.style.left = "-9999px", d.style.top = "-9999px", d.innerHTML = "<div class='dhx_cal_container'><div class='dhx_cal_scale_placeholder'></div><div>", document.body.appendChild(d);
        var a = window.getComputedStyle(d.querySelector(".dhx_cal_scale_placeholder")).getPropertyValue("position");
        i = a === "absolute", setTimeout(function() {
          i = null, d && d.parentNode && d.parentNode.removeChild(d);
        }, 500);
      }
      return i;
    }();
  }, e._build_skin_info = function() {
    (function() {
      const m = e.$container;
      clearInterval(_), m && (_ = setInterval(() => {
        const f = getComputedStyle(m).getPropertyValue("--dhx-scheduler-theme");
        f && f !== e.skin && e.setSkin(f);
      }, 100));
    })();
    const d = getComputedStyle(this.$container), a = d.getPropertyValue("--dhx-scheduler-theme");
    let o, l = !!a, h = {}, y = !1;
    if (l) {
      o = a;
      for (let m in e.xy)
        h[m] = d.getPropertyValue(`--dhx-scheduler-xy-${m}`);
      h.hour_size_px = d.getPropertyValue("--dhx-scheduler-config-hour_size_px"), h.wide_form = d.getPropertyValue("--dhx-scheduler-config-form_wide");
    } else
      o = function() {
        for (var m = document.getElementsByTagName("link"), f = 0; f < m.length; f++) {
          var u = m[f].href.match("dhtmlxscheduler_([a-z]+).css");
          if (u)
            return u[1];
        }
      }(), y = e._is_material_skin();
    if (e._theme_info = { theme: o, cssVarTheme: l, oldMaterialTheme: y, values: h }, e._theme_info.cssVarTheme) {
      const m = this._theme_info.values;
      for (let f in e.xy)
        isNaN(parseInt(m[f])) || (e.xy[f] = parseInt(m[f]));
    }
  }, e.event(window, "DOMContentLoaded", s), e.event(window, "load", s), e._border_box_events = function() {
    return n();
  }, e._configure = function(d, a, o) {
    for (var l in a)
      d[l] === void 0 && (d[l] = a[l][o]);
  }, e.setSkin = function(d) {
    this.skin = d, e._addThemeClass(), e.$container && (this._skin_init(), this.render());
  };
  let _ = null;
  e.attachEvent("onDestroy", function() {
    clearInterval(_);
  }), e._skin_init = function() {
    this._build_skin_info(), this.skin || (this.skin = this._theme_info.theme), e._addThemeClass(), e.skin === "flat" ? e.templates.hour_scale = r : e.templates.hour_scale === r && (e.templates.hour_scale = e.date.date_to_str(e.config.hour_date)), e.attachEvent("onTemplatesReady", function() {
      var d = e.date.date_to_str("%d");
      e.templates._old_month_day || (e.templates._old_month_day = e.templates.month_day);
      var a = e.templates._old_month_day;
      e.templates.month_day = function(o) {
        if (this._mode == "month") {
          var l = d(o);
          return o.getDate() == 1 && (l = e.locale.date.month_full[o.getMonth()] + " " + l), +o == +e.date.date_part(this._currentDate()) && (l = e.locale.labels.dhx_cal_today_button + " " + l), l;
        }
        return a.call(this, o);
      }, e.config.fix_tab_position && (e._els.dhx_cal_navline[0].querySelectorAll("[data-tab]").forEach((o) => {
        switch (o.getAttribute("data-tab") || o.getAttribute("name")) {
          case "day":
          case "day_tab":
            o.classList.add("dhx_cal_tab_first"), o.classList.add("dhx_cal_tab_segmented");
            break;
          case "week":
          case "week_tab":
            o.classList.add("dhx_cal_tab_segmented");
            break;
          case "month":
          case "month_tab":
            o.classList.add("dhx_cal_tab_last"), o.classList.add("dhx_cal_tab_segmented");
            break;
          default:
            o.classList.add("dhx_cal_tab_standalone");
        }
      }), function(o) {
        if (e.config.header)
          return;
        const l = Array.from(o.querySelectorAll(".dhx_cal_tab")), h = ["day", "week", "month"].map((m) => l.find((f) => f.getAttribute("data-tab") === m)).filter((m) => m !== void 0);
        let y = l.length > 0 ? l[0] : null;
        h.reverse().forEach((m) => {
          o.insertBefore(m, y), y = m;
        });
      }(e._els.dhx_cal_navline[0]));
    }, { once: !0 });
  };
}
function La(e, i) {
  this.$scheduler = e, this.$dp = i, this._dataProcessorHandlers = [], this.attach = function() {
    var t = this.$dp, n = this.$scheduler;
    this._dataProcessorHandlers.push(n.attachEvent("onEventAdded", function(s) {
      !this._loading && this._validId(s) && t.setUpdated(s, !0, "inserted");
    })), this._dataProcessorHandlers.push(n.attachEvent("onConfirmedBeforeEventDelete", function(s) {
      if (this._validId(s)) {
        var r = t.getState(s);
        return r == "inserted" || this._new_event ? (t.setUpdated(s, !1), !0) : r != "deleted" && (r == "true_deleted" || (t.setUpdated(s, !0, "deleted"), !1));
      }
    })), this._dataProcessorHandlers.push(n.attachEvent("onEventChanged", function(s) {
      !this._loading && this._validId(s) && t.setUpdated(s, !0, "updated");
    })), this._dataProcessorHandlers.push(n.attachEvent("onClearAll", function() {
      t._in_progress = {}, t._invalid = {}, t.updatedRows = [], t._waitMode = 0;
    })), t.attachEvent("insertCallback", n._update_callback), t.attachEvent("updateCallback", n._update_callback), t.attachEvent("deleteCallback", function(s, r) {
      n.getEvent(r) ? (n.setUserData(r, this.action_param, "true_deleted"), n.deleteEvent(r)) : n._add_rec_marker && n._update_callback(s, r);
    });
  }, this.detach = function() {
    for (var t in this._dataProcessorHandlers) {
      var n = this._dataProcessorHandlers[t];
      this.$scheduler.detachEvent(n);
    }
    this._dataProcessorHandlers = [];
  };
}
function ct(e) {
  return this.serverProcessor = e, this.action_param = "!nativeeditor_status", this.object = null, this.updatedRows = [], this.autoUpdate = !0, this.updateMode = "cell", this._tMode = "GET", this._headers = null, this._payload = null, this.post_delim = "_", this._waitMode = 0, this._in_progress = {}, this._invalid = {}, this.messages = [], this.styles = { updated: "font-weight:bold;", inserted: "font-weight:bold;", deleted: "text-decoration : line-through;", invalid: "background-color:FFE0E0;", invalid_cell: "border-bottom:2px solid red;", error: "color:red;", clear: "font-weight:normal;text-decoration:none;" }, this.enableUTFencoding(!0), nt(this), this;
}
function Ha(e) {
  var i = "data-dhxbox", t = null;
  function n(c, p) {
    var g = c.callback;
    f.hide(c.box), t = c.box = null, g && g(p);
  }
  function s(c) {
    if (t) {
      var p = c.which || c.keyCode, g = !1;
      if (u.keyboard) {
        if (p == 13 || p == 32) {
          var b = c.target || c.srcElement;
          Ae.getClassName(b).indexOf("scheduler_popup_button") > -1 && b.click ? b.click() : (n(t, !0), g = !0);
        }
        p == 27 && (n(t, !1), g = !0);
      }
      return g ? (c.preventDefault && c.preventDefault(), !(c.cancelBubble = !0)) : void 0;
    }
  }
  function r(c) {
    r.cover || (r.cover = document.createElement("div"), e.event(r.cover, "keydown", s), r.cover.className = "dhx_modal_cover", document.body.appendChild(r.cover)), r.cover.style.display = c ? "inline-block" : "none";
  }
  function _(c, p, g) {
    var b = e._waiAria.messageButtonAttrString(c), x = (p || "").toLowerCase().replace(/ /g, "_");
    return `<div ${b} class='scheduler_popup_button dhtmlx_popup_button ${`scheduler_${x}_button dhtmlx_${x}_button`}' data-result='${g}' result='${g}' ><div>${c}</div></div>`;
  }
  function d() {
    for (var c = [].slice.apply(arguments, [0]), p = 0; p < c.length; p++)
      if (c[p])
        return c[p];
  }
  function a(c, p, g) {
    var b = c.tagName ? c : function(w, E, D) {
      var S = document.createElement("div"), M = ge.uid();
      e._waiAria.messageModalAttr(S, M), S.className = " scheduler_modal_box dhtmlx_modal_box scheduler-" + w.type + " dhtmlx-" + w.type, S.setAttribute(i, 1);
      var N = "";
      if (w.width && (S.style.width = w.width), w.height && (S.style.height = w.height), w.title && (N += '<div class="scheduler_popup_title dhtmlx_popup_title">' + w.title + "</div>"), N += '<div class="scheduler_popup_text dhtmlx_popup_text" id="' + M + '"><span>' + (w.content ? "" : w.text) + '</span></div><div  class="scheduler_popup_controls dhtmlx_popup_controls">', E && (N += _(d(w.ok, e.locale.labels.message_ok, "OK"), "ok", !0)), D && (N += _(d(w.cancel, e.locale.labels.message_cancel, "Cancel"), "cancel", !1)), w.buttons)
        for (var T = 0; T < w.buttons.length; T++) {
          var A = w.buttons[T];
          N += typeof A == "object" ? _(A.label, A.css || "scheduler_" + A.label.toLowerCase() + "_button dhtmlx_" + A.label.toLowerCase() + "_button", A.value || T) : _(A, A, T);
        }
      if (N += "</div>", S.innerHTML = N, w.content) {
        var C = w.content;
        typeof C == "string" && (C = document.getElementById(C)), C.style.display == "none" && (C.style.display = ""), S.childNodes[w.title ? 1 : 0].appendChild(C);
      }
      return e.event(S, "click", function(H) {
        var O = H.target || H.srcElement;
        if (O.className || (O = O.parentNode), Ae.closest(O, ".scheduler_popup_button")) {
          var $ = O.getAttribute("data-result");
          n(w, $ = $ == "true" || $ != "false" && $);
        }
      }), w.box = S, (E || D) && (t = w), S;
    }(c, p, g);
    c.hidden || r(!0), document.body.appendChild(b);
    var x = Math.abs(Math.floor(((window.innerWidth || document.documentElement.offsetWidth) - b.offsetWidth) / 2)), k = Math.abs(Math.floor(((window.innerHeight || document.documentElement.offsetHeight) - b.offsetHeight) / 2));
    return c.position == "top" ? b.style.top = "-3px" : b.style.top = k + "px", b.style.left = x + "px", e.event(b, "keydown", s), f.focus(b), c.hidden && f.hide(b), e.callEvent("onMessagePopup", [b]), b;
  }
  function o(c) {
    return a(c, !0, !1);
  }
  function l(c) {
    return a(c, !0, !0);
  }
  function h(c) {
    return a(c);
  }
  function y(c, p, g) {
    return typeof c != "object" && (typeof p == "function" && (g = p, p = ""), c = { text: c, type: p, callback: g }), c;
  }
  function m(c, p, g, b, x) {
    return typeof c != "object" && (c = { text: c, type: p, expire: g, id: b, callback: x }), c.id = c.id || ge.uid(), c.expire = c.expire || u.expire, c;
  }
  e.event(document, "keydown", s, !0);
  var f = function() {
    var c = y.apply(this, arguments);
    return c.type = c.type || "alert", h(c);
  };
  f.hide = function(c) {
    for (; c && c.getAttribute && !c.getAttribute(i); )
      c = c.parentNode;
    c && (c.parentNode.removeChild(c), r(!1), e.callEvent("onAfterMessagePopup", [c]));
  }, f.focus = function(c) {
    setTimeout(function() {
      var p = Ae.getFocusableNodes(c);
      p.length && p[0].focus && p[0].focus();
    }, 1);
  };
  var u = function(c, p, g, b) {
    switch ((c = m.apply(this, arguments)).type = c.type || "info", c.type.split("-")[0]) {
      case "alert":
        return o(c);
      case "confirm":
        return l(c);
      case "modalbox":
        return h(c);
      default:
        return function(x) {
          u.area || (u.area = document.createElement("div"), u.area.className = "scheduler_message_area dhtmlx_message_area", u.area.style[u.position] = "5px", document.body.appendChild(u.area)), u.hide(x.id);
          var k = document.createElement("div");
          return k.innerHTML = "<div>" + x.text + "</div>", k.className = "scheduler-info dhtmlx-info scheduler-" + x.type + " dhtmlx-" + x.type, e.event(k, "click", function(w) {
            x.callback && x.callback.call(this, w), u.hide(x.id), x = null;
          }), e._waiAria.messageInfoAttr(k), u.position == "bottom" && u.area.firstChild ? u.area.insertBefore(k, u.area.firstChild) : u.area.appendChild(k), x.expire > 0 && (u.timers[x.id] = window.setTimeout(function() {
            u && u.hide(x.id);
          }, x.expire)), u.pull[x.id] = k, k = null, x.id;
        }(c);
    }
  };
  u.seed = (/* @__PURE__ */ new Date()).valueOf(), u.uid = ge.uid, u.expire = 4e3, u.keyboard = !0, u.position = "top", u.pull = {}, u.timers = {}, u.hideAll = function() {
    for (var c in u.pull)
      u.hide(c);
  }, u.hide = function(c) {
    var p = u.pull[c];
    p && p.parentNode && (window.setTimeout(function() {
      p.parentNode.removeChild(p), p = null;
    }, 2e3), p.className += " hidden", u.timers[c] && window.clearTimeout(u.timers[c]), delete u.pull[c]);
  };
  var v = [];
  return e.attachEvent("onMessagePopup", function(c) {
    v.push(c);
  }), e.attachEvent("onAfterMessagePopup", function(c) {
    for (var p = 0; p < v.length; p++)
      v[p] === c && (v.splice(p, 1), p--);
  }), e.attachEvent("onDestroy", function() {
    r.cover && r.cover.parentNode && r.cover.parentNode.removeChild(r.cover);
    for (var c = 0; c < v.length; c++)
      v[c].parentNode && v[c].parentNode.removeChild(v[c]);
    v = null, u.area && u.area.parentNode && u.area.parentNode.removeChild(u.area), u = null;
  }), { alert: function() {
    var c = y.apply(this, arguments);
    return c.type = c.type || "confirm", o(c);
  }, confirm: function() {
    var c = y.apply(this, arguments);
    return c.type = c.type || "alert", l(c);
  }, message: u, modalbox: f };
}
ct.prototype = { setTransactionMode: function(e, i) {
  typeof e == "object" ? (this._tMode = e.mode || this._tMode, e.headers !== void 0 && (this._headers = e.headers), e.payload !== void 0 && (this._payload = e.payload), this._tSend = !!i) : (this._tMode = e, this._tSend = i), this._tMode == "REST" && (this._tSend = !1, this._endnm = !0), this._tMode === "JSON" || this._tMode === "REST-JSON" ? (this._tSend = !1, this._endnm = !0, this._serializeAsJson = !0, this._headers = this._headers || {}, this._headers["Content-Type"] = "application/json") : this._headers && !this._headers["Content-Type"] && (this._headers["Content-Type"] = "application/x-www-form-urlencoded"), this._tMode === "CUSTOM" && (this._tSend = !1, this._endnm = !0, this._router = e.router);
}, escape: function(e) {
  return this._utf ? encodeURIComponent(e) : escape(e);
}, enableUTFencoding: function(e) {
  this._utf = !!e;
}, setDataColumns: function(e) {
  this._columns = typeof e == "string" ? e.split(",") : e;
}, getSyncState: function() {
  return !this.updatedRows.length;
}, enableDataNames: function(e) {
  this._endnm = !!e;
}, enablePartialDataSend: function(e) {
  this._changed = !!e;
}, setUpdateMode: function(e, i) {
  this.autoUpdate = e == "cell", this.updateMode = e, this.dnd = i;
}, ignore: function(e, i) {
  this._silent_mode = !0, e.call(i || window), this._silent_mode = !1;
}, setUpdated: function(e, i, t) {
  if (!this._silent_mode) {
    var n = this.findRow(e);
    t = t || "updated";
    var s = this.$scheduler.getUserData(e, this.action_param);
    s && t == "updated" && (t = s), i ? (this.set_invalid(e, !1), this.updatedRows[n] = e, this.$scheduler.setUserData(e, this.action_param, t), this._in_progress[e] && (this._in_progress[e] = "wait")) : this.is_invalid(e) || (this.updatedRows.splice(n, 1), this.$scheduler.setUserData(e, this.action_param, "")), this.markRow(e, i, t), i && this.autoUpdate && this.sendData(e);
  }
}, markRow: function(e, i, t) {
  var n = "", s = this.is_invalid(e);
  if (s && (n = this.styles[s], i = !0), this.callEvent("onRowMark", [e, i, t, s]) && (n = this.styles[i ? t : "clear"] + n, this.$scheduler[this._methods[0]](e, n), s && s.details)) {
    n += this.styles[s + "_cell"];
    for (var r = 0; r < s.details.length; r++)
      s.details[r] && this.$scheduler[this._methods[1]](e, r, n);
  }
}, getActionByState: function(e) {
  return e === "inserted" ? "create" : e === "updated" ? "update" : e === "deleted" ? "delete" : "update";
}, getState: function(e) {
  return this.$scheduler.getUserData(e, this.action_param);
}, is_invalid: function(e) {
  return this._invalid[e];
}, set_invalid: function(e, i, t) {
  t && (i = { value: i, details: t, toString: function() {
    return this.value.toString();
  } }), this._invalid[e] = i;
}, checkBeforeUpdate: function(e) {
  return !0;
}, sendData: function(e) {
  return this.$scheduler.editStop && this.$scheduler.editStop(), e === void 0 || this._tSend ? this.sendAllData() : !this._in_progress[e] && (this.messages = [], !(!this.checkBeforeUpdate(e) && this.callEvent("onValidationError", [e, this.messages])) && void this._beforeSendData(this._getRowData(e), e));
}, _beforeSendData: function(e, i) {
  if (!this.callEvent("onBeforeUpdate", [i, this.getState(i), e]))
    return !1;
  this._sendData(e, i);
}, serialize: function(e, i) {
  if (this._serializeAsJson)
    return this._serializeAsJSON(e);
  if (typeof e == "string")
    return e;
  if (i !== void 0)
    return this.serialize_one(e, "");
  var t = [], n = [];
  for (var s in e)
    e.hasOwnProperty(s) && (t.push(this.serialize_one(e[s], s + this.post_delim)), n.push(s));
  return t.push("ids=" + this.escape(n.join(","))), this.$scheduler.security_key && t.push("dhx_security=" + this.$scheduler.security_key), t.join("&");
}, serialize_one: function(e, i) {
  if (typeof e == "string")
    return e;
  var t = [], n = "";
  for (var s in e)
    if (e.hasOwnProperty(s)) {
      if ((s == "id" || s == this.action_param) && this._tMode == "REST")
        continue;
      n = typeof e[s] == "string" || typeof e[s] == "number" ? e[s] : JSON.stringify(e[s]), t.push(this.escape((i || "") + s) + "=" + this.escape(n));
    }
  return t.join("&");
}, _applyPayload: function(e) {
  var i = this.$scheduler.ajax;
  if (this._payload)
    for (var t in this._payload)
      e = e + i.urlSeparator(e) + this.escape(t) + "=" + this.escape(this._payload[t]);
  return e;
}, _sendData: function(e, i) {
  if (e) {
    if (!this.callEvent("onBeforeDataSending", i ? [i, this.getState(i), e] : [null, null, e]))
      return !1;
    i && (this._in_progress[i] = (/* @__PURE__ */ new Date()).valueOf());
    var t = this, n = this.$scheduler.ajax;
    if (this._tMode !== "CUSTOM") {
      var s, r = { callback: function(f) {
        var u = [];
        if (i)
          u.push(i);
        else if (e)
          for (var v in e)
            u.push(v);
        return t.afterUpdate(t, f, u);
      }, headers: t._headers }, _ = this.serverProcessor + (this._user ? n.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, "dhx_version=" + this.$scheduler.getUserData(0, "version")].join("&") : ""), d = this._applyPayload(_);
      switch (this._tMode) {
        case "GET":
          s = this._cleanupArgumentsBeforeSend(e), r.url = d + n.urlSeparator(d) + this.serialize(s, i), r.method = "GET";
          break;
        case "POST":
          s = this._cleanupArgumentsBeforeSend(e), r.url = d, r.method = "POST", r.data = this.serialize(s, i);
          break;
        case "JSON":
          s = {};
          var a = this._cleanupItemBeforeSend(e);
          for (var o in a)
            o !== this.action_param && o !== "id" && o !== "gr_id" && (s[o] = a[o]);
          r.url = d, r.method = "POST", r.data = JSON.stringify({ id: i, action: e[this.action_param], data: s });
          break;
        case "REST":
        case "REST-JSON":
          switch (d = _.replace(/(&|\?)editing=true/, ""), s = "", this.getState(i)) {
            case "inserted":
              r.method = "POST", r.data = this.serialize(e, i);
              break;
            case "deleted":
              r.method = "DELETE", d = d + (d.slice(-1) === "/" ? "" : "/") + i;
              break;
            default:
              r.method = "PUT", r.data = this.serialize(e, i), d = d + (d.slice(-1) === "/" ? "" : "/") + i;
          }
          r.url = this._applyPayload(d);
      }
      return this._waitMode++, n.query(r);
    }
    {
      var l = this.getState(i), h = this.getActionByState(l), y = function(u) {
        var v = l;
        if (u && u.responseText && u.setRequestHeader) {
          u.status !== 200 && (v = "error");
          try {
            u = JSON.parse(u.responseText);
          } catch {
          }
        }
        v = v || "updated";
        var c = i, p = i;
        u && (v = u.action || v, c = u.sid || c, p = u.id || u.tid || p), t.afterUpdateCallback(c, p, v, u);
      };
      const f = "event";
      var m;
      if (this._router instanceof Function)
        m = this._router(f, h, e, i);
      else
        switch (l) {
          case "inserted":
            m = this._router[f].create(e);
            break;
          case "deleted":
            m = this._router[f].delete(i);
            break;
          default:
            m = this._router[f].update(e, i);
        }
      if (m) {
        if (!m.then && m.id === void 0 && m.tid === void 0 && m.action === void 0)
          throw new Error("Incorrect router return value. A Promise or a response object is expected");
        m.then ? m.then(y).catch(function(u) {
          u && u.action ? y(u) : y({ action: "error", value: u });
        }) : y(m);
      } else
        y(null);
    }
  }
}, sendAllData: function() {
  if (this.updatedRows.length && this.updateMode !== "off") {
    this.messages = [];
    var e = !0;
    if (this._forEachUpdatedRow(function(i) {
      e = e && this.checkBeforeUpdate(i);
    }), !e && !this.callEvent("onValidationError", ["", this.messages]))
      return !1;
    this._tSend ? this._sendData(this._getAllData()) : this._forEachUpdatedRow(function(i) {
      if (!this._in_progress[i]) {
        if (this.is_invalid(i))
          return;
        this._beforeSendData(this._getRowData(i), i);
      }
    });
  }
}, _getAllData: function(e) {
  var i = {}, t = !1;
  return this._forEachUpdatedRow(function(n) {
    if (!this._in_progress[n] && !this.is_invalid(n)) {
      var s = this._getRowData(n);
      this.callEvent("onBeforeUpdate", [n, this.getState(n), s]) && (i[n] = s, t = !0, this._in_progress[n] = (/* @__PURE__ */ new Date()).valueOf());
    }
  }), t ? i : null;
}, findRow: function(e) {
  var i = 0;
  for (i = 0; i < this.updatedRows.length && e != this.updatedRows[i]; i++)
    ;
  return i;
}, defineAction: function(e, i) {
  this._uActions || (this._uActions = {}), this._uActions[e] = i;
}, afterUpdateCallback: function(e, i, t, n) {
  if (this.$scheduler) {
    var s = e, r = t !== "error" && t !== "invalid";
    if (r || this.set_invalid(e, t), this._uActions && this._uActions[t] && !this._uActions[t](n))
      return delete this._in_progress[s];
    this._in_progress[s] !== "wait" && this.setUpdated(e, !1);
    var _ = e;
    switch (t) {
      case "inserted":
      case "insert":
        i != e && (this.setUpdated(e, !1), this.$scheduler[this._methods[2]](e, i), e = i);
        break;
      case "delete":
      case "deleted":
        return this.$scheduler.setUserData(e, this.action_param, "true_deleted"), this.$scheduler[this._methods[3]](e, i), delete this._in_progress[s], this.callEvent("onAfterUpdate", [e, t, i, n]);
    }
    this._in_progress[s] !== "wait" ? (r && this.$scheduler.setUserData(e, this.action_param, ""), delete this._in_progress[s]) : (delete this._in_progress[s], this.setUpdated(i, !0, this.$scheduler.getUserData(e, this.action_param))), this.callEvent("onAfterUpdate", [_, t, i, n]);
  }
}, _errorResponse: function(e, i) {
  return this.$scheduler && this.$scheduler.callEvent && this.$scheduler.callEvent("onSaveError", [i, e.xmlDoc]), this.cleanUpdate(i);
}, _setDefaultTransactionMode: function() {
  this.serverProcessor && (this.setTransactionMode("POST", !0), this.serverProcessor += (this.serverProcessor.indexOf("?") !== -1 ? "&" : "?") + "editing=true", this._serverProcessor = this.serverProcessor);
}, afterUpdate: function(e, i, t) {
  var n = this.$scheduler.ajax;
  if (i.xmlDoc.status === 200) {
    var s;
    try {
      s = JSON.parse(i.xmlDoc.responseText);
    } catch {
      i.xmlDoc.responseText.length || (s = {});
    }
    if (s) {
      var r = s.action || this.getState(t) || "updated", _ = s.sid || t[0], d = s.tid || t[0];
      return e.afterUpdateCallback(_, d, r, s), void e.finalizeUpdate();
    }
    var a = n.xmltop("data", i.xmlDoc);
    if (!a)
      return this._errorResponse(i, t);
    var o = n.xpath("//data/action", a);
    if (!o.length)
      return this._errorResponse(i, t);
    for (var l = 0; l < o.length; l++) {
      var h = o[l];
      r = h.getAttribute("type"), _ = h.getAttribute("sid"), d = h.getAttribute("tid"), e.afterUpdateCallback(_, d, r, h);
    }
    e.finalizeUpdate();
  } else
    this._errorResponse(i, t);
}, cleanUpdate: function(e) {
  if (e)
    for (var i = 0; i < e.length; i++)
      delete this._in_progress[e[i]];
}, finalizeUpdate: function() {
  this._waitMode && this._waitMode--, this.callEvent("onAfterUpdateFinish", []), this.updatedRows.length || this.callEvent("onFullSync", []);
}, init: function(e) {
  if (!this._initialized) {
    this.$scheduler = e, this.$scheduler._dp_init && this.$scheduler._dp_init(this), this._setDefaultTransactionMode(), this._methods = this._methods || ["_set_event_text_style", "", "_dp_change_event_id", "_dp_hook_delete"], function(t, n) {
      t._validId = function(s) {
        return !this._is_virtual_event || !this._is_virtual_event(s);
      }, t.setUserData = function(s, r, _) {
        if (s) {
          var d = this.getEvent(s);
          d && (d[r] = _);
        } else
          this._userdata[r] = _;
      }, t.getUserData = function(s, r) {
        if (s) {
          var _ = this.getEvent(s);
          return _ ? _[r] : null;
        }
        return this._userdata[r];
      }, t._set_event_text_style = function(s, r) {
        if (t.getEvent(s)) {
          this.for_rendered(s, function(d) {
            d.style.cssText += ";" + r;
          });
          var _ = this.getEvent(s);
          _._text_style = r, this.event_updated(_);
        }
      }, t._update_callback = function(s, r) {
        var _ = t._xmlNodeToJSON(s.firstChild);
        _.rec_type == "none" && (_.rec_pattern = "none"), _.text = _.text || _._tagvalue, _.start_date = t._helpers.parseDate(_.start_date), _.end_date = t._helpers.parseDate(_.end_date), t.addEvent(_), t._add_rec_marker && t.setCurrentView();
      }, t._dp_change_event_id = function(s, r) {
        t.getEvent(s) && t.changeEventId(s, r);
      }, t._dp_hook_delete = function(s, r) {
        if (t.getEvent(s))
          return r && s != r && (this.getUserData(s, n.action_param) == "true_deleted" && this.setUserData(s, n.action_param, "updated"), this.changeEventId(s, r)), this.deleteEvent(r, !0);
      }, t.setDp = function() {
        this._dp = n;
      }, t.setDp();
    }(this.$scheduler, this);
    var i = new La(this.$scheduler, this);
    i.attach(), this.attachEvent("onDestroy", function() {
      delete this._getRowData, delete this.$scheduler._dp, delete this.$scheduler._dataprocessor, delete this.$scheduler._set_event_text_style, delete this.$scheduler._dp_change_event_id, delete this.$scheduler._dp_hook_delete, delete this.$scheduler, i.detach();
    }), this.$scheduler.callEvent("onDataProcessorReady", [this]), this._initialized = !0, e._dataprocessor = this;
  }
}, setOnAfterUpdate: function(e) {
  this.attachEvent("onAfterUpdate", e);
}, setOnBeforeUpdateHandler: function(e) {
  this.attachEvent("onBeforeDataSending", e);
}, setAutoUpdate: function(e, i) {
  e = e || 2e3, this._user = i || (/* @__PURE__ */ new Date()).valueOf(), this._need_update = !1, this._update_busy = !1, this.attachEvent("onAfterUpdate", function(s, r, _, d) {
    this.afterAutoUpdate(s, r, _, d);
  }), this.attachEvent("onFullSync", function() {
    this.fullSync();
  });
  var t = this;
  let n = P.setInterval(function() {
    t.loadUpdate();
  }, e);
  this.attachEvent("onDestroy", function() {
    clearInterval(n);
  });
}, afterAutoUpdate: function(e, i, t, n) {
  return i != "collision" || (this._need_update = !0, !1);
}, fullSync: function() {
  return this._need_update && (this._need_update = !1, this.loadUpdate()), !0;
}, getUpdates: function(e, i) {
  var t = this.$scheduler.ajax;
  if (this._update_busy)
    return !1;
  this._update_busy = !0, t.get(e, i);
}, _getXmlNodeValue: function(e) {
  return e.firstChild ? e.firstChild.nodeValue : "";
}, loadUpdate: function() {
  var e = this, i = this.$scheduler.ajax, t = this.$scheduler.getUserData(0, "version"), n = this.serverProcessor + i.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, "dhx_version=" + t].join("&");
  n = n.replace("editing=true&", ""), this.getUpdates(n, function(s) {
    var r = i.xpath("//userdata", s);
    e.$scheduler.setUserData(0, "version", e._getXmlNodeValue(r[0]));
    var _ = i.xpath("//update", s);
    if (_.length) {
      e._silent_mode = !0;
      for (var d = 0; d < _.length; d++) {
        var a = _[d].getAttribute("status"), o = _[d].getAttribute("id"), l = _[d].getAttribute("parent");
        switch (a) {
          case "inserted":
            this.callEvent("insertCallback", [_[d], o, l]);
            break;
          case "updated":
            this.callEvent("updateCallback", [_[d], o, l]);
            break;
          case "deleted":
            this.callEvent("deleteCallback", [_[d], o, l]);
        }
      }
      e._silent_mode = !1;
    }
    e._update_busy = !1, e = null;
  });
}, destructor: function() {
  this.callEvent("onDestroy", []), this.detachAllEvents(), this.updatedRows = [], this._in_progress = {}, this._invalid = {}, this._headers = null, this._payload = null, delete this._initialized;
}, url: function(e) {
  this.serverProcessor = this._serverProcessor = e;
}, _serializeAsJSON: function(e) {
  if (typeof e == "string")
    return e;
  var i = this.$scheduler.utils.copy(e);
  return this._tMode === "REST-JSON" && (delete i.id, delete i[this.action_param]), JSON.stringify(i);
}, _cleanupArgumentsBeforeSend: function(e) {
  var i;
  if (e[this.action_param] === void 0)
    for (var t in i = {}, e)
      i[t] = this._cleanupArgumentsBeforeSend(e[t]);
  else
    i = this._cleanupItemBeforeSend(e);
  return i;
}, _cleanupItemBeforeSend: function(e) {
  var i = null;
  return e && (e[this.action_param] === "deleted" ? ((i = {}).id = e.id, i[this.action_param] = e[this.action_param]) : i = e), i;
}, _forEachUpdatedRow: function(e) {
  for (var i = this.updatedRows.slice(), t = 0; t < i.length; t++) {
    var n = i[t];
    this.$scheduler.getUserData(n, this.action_param) && e.call(this, n);
  }
}, _prepareDataItem: function(e) {
  var i = {}, t = this.$scheduler, n = t.utils.copy(e);
  for (var s in n)
    s.indexOf("_") !== 0 && n[s] && (n[s].getUTCFullYear ? i[s] = t._helpers.formatDate(n[s]) : typeof n[s] == "object" ? i[s] = this._prepareDataItem(n[s]) : n[s] === null ? i[s] = "" : i[s] = n[s]);
  return i[this.action_param] = t.getUserData(e.id, this.action_param), i;
}, _getRowData: function(e) {
  var i = this.$scheduler.getEvent(e);
  return i || (i = { id: e }), this._prepareDataItem(i);
} };
const $a = { date: { month_full: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"], month_short: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"], day_full: ["الأحد", "الأثنين", "ألثلاثاء", "الأربعاء", "ألحميس", "ألجمعة", "السبت"], day_short: ["احد", "اثنين", "ثلاثاء", "اربعاء", "خميس", "جمعة", "سبت"] }, labels: { dhx_cal_today_button: "اليوم", day_tab: "يوم", week_tab: "أسبوع", month_tab: "شهر", new_event: "حدث جديد", icon_save: "اخزن", icon_cancel: "الغاء", icon_details: "تفاصيل", icon_edit: "تحرير", icon_delete: "حذف", confirm_closing: "التغييرات سوف تضيع, هل انت متأكد؟", confirm_deleting: "الحدث سيتم حذفها نهائيا ، هل أنت متأكد؟", section_description: "الوصف", section_time: "الفترة الزمنية", full_day: "طوال اليوم", confirm_recurring: "هل تريد تحرير مجموعة كاملة من الأحداث المتكررة؟", section_recurring: "تكرار الحدث", button_recurring: "تعطيل", button_recurring_open: "تمكين", button_edit_series: "تحرير سلسلة", button_edit_occurrence: "تعديل نسخة", grid_tab: "جدول", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "يومي", repeat_radio_week: "أسبوعي", repeat_radio_month: "شهري", repeat_radio_year: "سنوي", repeat_radio_day_type: "كل", repeat_text_day_count: "يوم", repeat_radio_day_type2: "كل يوم عمل", repeat_week: " تكرار كل", repeat_text_week_count: "أسبوع في الأيام التالية:", repeat_radio_month_type: "تكرار", repeat_radio_month_start: "في", repeat_text_month_day: "يوم كل", repeat_text_month_count: "شهر", repeat_text_month_count2_before: "كل", repeat_text_month_count2_after: "شهر", repeat_year_label: "في", select_year_day2: "من", repeat_text_year_day: "يوم", select_year_month: "شهر", repeat_radio_end: "بدون تاريخ انتهاء", repeat_text_occurences_count: "تكرارات", repeat_radio_end2: "بعد", repeat_radio_end3: "ينتهي في", repeat_never: "أبداً", repeat_daily: "كل يوم", repeat_workdays: "كل يوم عمل", repeat_weekly: "كل أسبوع", repeat_monthly: "كل شهر", repeat_yearly: "كل سنة", repeat_custom: "تخصيص", repeat_freq_day: "يوم", repeat_freq_week: "أسبوع", repeat_freq_month: "شهر", repeat_freq_year: "سنة", repeat_on_date: "في التاريخ", repeat_ends: "ينتهي", month_for_recurring: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"], day_for_recurring: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"] } }, za = { date: { month_full: ["Студзень", "Люты", "Сакавік", "Красавік", "Maй", "Чэрвень", "Ліпень", "Жнівень", "Верасень", "Кастрычнік", "Лістапад", "Снежань"], month_short: ["Студз", "Лют", "Сак", "Крас", "Maй", "Чэр", "Ліп", "Жнів", "Вер", "Каст", "Ліст", "Снеж"], day_full: ["Нядзеля", "Панядзелак", "Аўторак", "Серада", "Чацвер", "Пятніца", "Субота"], day_short: ["Нд", "Пн", "Аўт", "Ср", "Чцв", "Пт", "Сб"] }, labels: { dhx_cal_today_button: "Сёння", day_tab: "Дзень", week_tab: "Тыдзень", month_tab: "Месяц", new_event: "Новая падзея", icon_save: "Захаваць", icon_cancel: "Адмяніць", icon_details: "Дэталі", icon_edit: "Змяніць", icon_delete: "Выдаліць", confirm_closing: "", confirm_deleting: "Падзея будзе выдалена незваротна, працягнуць?", section_description: "Апісанне", section_time: "Перыяд часу", full_day: "Увесь дзень", confirm_recurring: "Вы хочаце змяніць усю серыю паўтаральных падзей?", section_recurring: "Паўтарэнне", button_recurring: "Адключана", button_recurring_open: "Уключана", button_edit_series: "Рэдагаваць серыю", button_edit_occurrence: "Рэдагаваць асобнік", agenda_tab: "Спіс", date: "Дата", description: "Апісанне", year_tab: "Год", week_agenda_tab: "Спіс", grid_tab: "Спic", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Дзень", repeat_radio_week: "Тыдзень", repeat_radio_month: "Месяц", repeat_radio_year: "Год", repeat_radio_day_type: "Кожны", repeat_text_day_count: "дзень", repeat_radio_day_type2: "Кожны працоўны дзень", repeat_week: " Паўтараць кожны", repeat_text_week_count: "тыдзень", repeat_radio_month_type: "Паўтараць", repeat_radio_month_start: "", repeat_text_month_day: " чысла кожнага", repeat_text_month_count: "месяцу", repeat_text_month_count2_before: "кожны ", repeat_text_month_count2_after: "месяц", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "дзень", select_year_month: "", repeat_radio_end: "Без даты заканчэння", repeat_text_occurences_count: "паўтораў", repeat_radio_end2: "", repeat_radio_end3: "Да ", repeat_never: "Ніколі", repeat_daily: "Кожны дзень", repeat_workdays: "Кожны працоўны дзень", repeat_weekly: "Кожны тыдзень", repeat_monthly: "Кожны месяц", repeat_yearly: "Кожны год", repeat_custom: "Наладжвальны", repeat_freq_day: "Дзень", repeat_freq_week: "Тыдзень", repeat_freq_month: "Месяц", repeat_freq_year: "Год", repeat_on_date: "На дату", repeat_ends: "Заканчваецца", month_for_recurring: ["Студзеня", "Лютага", "Сакавіка", "Красавіка", "Мая", "Чэрвеня", "Ліпeня", "Жніўня", "Верасня", "Кастрычніка", "Лістапада", "Снежня"], day_for_recurring: ["Нядзелю", "Панядзелак", "Аўторак", "Сераду", "Чацвер", "Пятніцу", "Суботу"] } }, qa = { date: { month_full: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"], month_short: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"], day_full: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"], day_short: ["Dg", "Dl", "Dm", "Dc", "Dj", "Dv", "Ds"] }, labels: { dhx_cal_today_button: "Hui", day_tab: "Dia", week_tab: "Setmana", month_tab: "Mes", new_event: "Nou esdeveniment", icon_save: "Guardar", icon_cancel: "Cancel·lar", icon_details: "Detalls", icon_edit: "Editar", icon_delete: "Esborrar", confirm_closing: "", confirm_deleting: "L'esdeveniment s'esborrarà definitivament, continuar ?", section_description: "Descripció", section_time: "Periode de temps", full_day: "Tot el dia", confirm_recurring: "¿Desitja modificar el conjunt d'esdeveniments repetits?", section_recurring: "Repeteixca l'esdeveniment", button_recurring: "Impedit", button_recurring_open: "Permés", button_edit_series: "Edit sèrie", button_edit_occurrence: "Edita Instància", agenda_tab: "Agenda", date: "Data", description: "Descripció", year_tab: "Any", week_agenda_tab: "Agenda", grid_tab: "Taula", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Diari", repeat_radio_week: "Setmanal", repeat_radio_month: "Mensual", repeat_radio_year: "Anual", repeat_radio_day_type: "Cada", repeat_text_day_count: "dia", repeat_radio_day_type2: "Cada dia laborable", repeat_week: " Repetir cada", repeat_text_week_count: "setmana els dies següents:", repeat_radio_month_type: "Repetir", repeat_radio_month_start: "El", repeat_text_month_day: "dia cada", repeat_text_month_count: "mes", repeat_text_month_count2_before: "cada", repeat_text_month_count2_after: "mes", repeat_year_label: "El", select_year_day2: "de", repeat_text_year_day: "dia", select_year_month: "mes", repeat_radio_end: "Sense data de finalització", repeat_text_occurences_count: "ocurrències", repeat_radio_end2: "Després", repeat_radio_end3: "Finalitzar el", repeat_never: "Mai", repeat_daily: "Cada dia", repeat_workdays: "Cada dia laborable", repeat_weekly: "Cada setmana", repeat_monthly: "Cada mes", repeat_yearly: "Cada any", repeat_custom: "Personalitzat", repeat_freq_day: "Dia", repeat_freq_week: "Setmana", repeat_freq_month: "Mes", repeat_freq_year: "Any", repeat_on_date: "En la data", repeat_ends: "Finalitza", month_for_recurring: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"], day_for_recurring: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"] } }, Pa = { date: { month_full: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], day_short: ["日", "一", "二", "三", "四", "五", "六"] }, labels: { dhx_cal_today_button: "今天", day_tab: "日", week_tab: "周", month_tab: "月", new_event: "新建日程", icon_save: "保存", icon_cancel: "关闭", icon_details: "详细", icon_edit: "编辑", icon_delete: "删除", confirm_closing: "请确认是否撤销修改!", confirm_deleting: "是否删除日程?", section_description: "描述", section_time: "时间范围", full_day: "整天", confirm_recurring: "请确认是否将日程设为重复模式?", section_recurring: "重复周期", button_recurring: "禁用", button_recurring_open: "启用", button_edit_series: "编辑系列", button_edit_occurrence: "编辑实例", agenda_tab: "议程", date: "日期", description: "说明", year_tab: "今年", week_agenda_tab: "议程", grid_tab: "电网", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "按天", repeat_radio_week: "按周", repeat_radio_month: "按月", repeat_radio_year: "按年", repeat_radio_day_type: "每", repeat_text_day_count: "天", repeat_radio_day_type2: "每个工作日", repeat_week: " 重复 每", repeat_text_week_count: "星期的:", repeat_radio_month_type: "重复", repeat_radio_month_start: "在", repeat_text_month_day: "日 每", repeat_text_month_count: "月", repeat_text_month_count2_before: "每", repeat_text_month_count2_after: "月", repeat_year_label: "在", select_year_day2: "的", repeat_text_year_day: "日", select_year_month: "月", repeat_radio_end: "无结束日期", repeat_text_occurences_count: "次结束", repeat_radio_end2: "重复", repeat_radio_end3: "结束于", repeat_never: "从不", repeat_daily: "每天", repeat_workdays: "每个工作日", repeat_weekly: "每周", repeat_monthly: "每月", repeat_yearly: "每年", repeat_custom: "自定义", repeat_freq_day: "天", repeat_freq_week: "周", repeat_freq_month: "月", repeat_freq_year: "年", repeat_on_date: "在日期", repeat_ends: "结束", month_for_recurring: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], day_for_recurring: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"] } }, Ra = { date: { month_full: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], month_short: ["Led", "Ún", "Bře", "Dub", "Kvě", "Čer", "Čec", "Srp", "Září", "Říj", "List", "Pro"], day_full: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"], day_short: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"] }, labels: { dhx_cal_today_button: "Dnes", day_tab: "Den", week_tab: "Týden", month_tab: "Měsíc", new_event: "Nová událost", icon_save: "Uložit", icon_cancel: "Zpět", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Smazat", confirm_closing: "", confirm_deleting: "Událost bude trvale smazána, opravdu?", section_description: "Poznámky", section_time: "Doba platnosti", confirm_recurring: "Přejete si upravit celou řadu opakovaných událostí?", section_recurring: "Opakování události", button_recurring: "Vypnuto", button_recurring_open: "Zapnuto", button_edit_series: "Edit series", button_edit_occurrence: "Upravit instance", agenda_tab: "Program", date: "Datum", description: "Poznámka", year_tab: "Rok", full_day: "Full day", week_agenda_tab: "Program", grid_tab: "Mřížka", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Denně", repeat_radio_week: "Týdně", repeat_radio_month: "Měsíčně", repeat_radio_year: "Ročně", repeat_radio_day_type: "každý", repeat_text_day_count: "Den", repeat_radio_day_type2: "pracovní dny", repeat_week: "Opakuje každých", repeat_text_week_count: "Týdnů na:", repeat_radio_month_type: "u každého", repeat_radio_month_start: "na", repeat_text_month_day: "Den každého", repeat_text_month_count: "Měsíc", repeat_text_month_count2_before: "každý", repeat_text_month_count2_after: "Měsíc", repeat_year_label: "na", select_year_day2: "v", repeat_text_year_day: "Den v", select_year_month: "", repeat_radio_end: "bez data ukončení", repeat_text_occurences_count: "Události", repeat_radio_end2: "po", repeat_radio_end3: "Konec", repeat_never: "Nikdy", repeat_daily: "Každý den", repeat_workdays: "Každý pracovní den", repeat_weekly: "Každý týden", repeat_monthly: "Každý měsíc", repeat_yearly: "Každý rok", repeat_custom: "Vlastní", repeat_freq_day: "Den", repeat_freq_week: "Týden", repeat_freq_month: "Měsíc", repeat_freq_year: "Rok", repeat_on_date: "Na datum", repeat_ends: "Končí", month_for_recurring: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], day_for_recurring: ["Neděle ", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"] } }, ja = { date: { month_full: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { dhx_cal_today_button: "Idag", day_tab: "Dag", week_tab: "Uge", month_tab: "Måned", new_event: "Ny begivenhed", icon_save: "Gem", icon_cancel: "Fortryd", icon_details: "Detaljer", icon_edit: "Tilret", icon_delete: "Slet", confirm_closing: "Dine rettelser vil gå tabt.. Er dy sikker?", confirm_deleting: "Bigivenheden vil blive slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", confirm_recurring: "Vil du tilrette hele serien af gentagne begivenheder?", section_recurring: "Gentag begivenhed", button_recurring: "Frakoblet", button_recurring_open: "Tilkoblet", button_edit_series: "Rediger serien", button_edit_occurrence: "Rediger en kopi", agenda_tab: "Dagsorden", date: "Dato", description: "Beskrivelse", year_tab: "År", week_agenda_tab: "Dagsorden", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daglig", repeat_radio_week: "Ugenlig", repeat_radio_month: "Månedlig", repeat_radio_year: "Årlig", repeat_radio_day_type: "Hver", repeat_text_day_count: "dag", repeat_radio_day_type2: "På hver arbejdsdag", repeat_week: " Gentager sig hver", repeat_text_week_count: "uge på følgende dage:", repeat_radio_month_type: "Hver den", repeat_radio_month_start: "Den", repeat_text_month_day: " i hver", repeat_text_month_count: "måned", repeat_text_month_count2_before: "hver", repeat_text_month_count2_after: "måned", repeat_year_label: "Den", select_year_day2: "i", repeat_text_year_day: "dag i", select_year_month: "", repeat_radio_end: "Ingen slutdato", repeat_text_occurences_count: "gentagelse", repeat_radio_end2: "Efter", repeat_radio_end3: "Slut", repeat_never: "Aldrig", repeat_daily: "Hver dag", repeat_workdays: "Hver hverdag", repeat_weekly: "Hver uge", repeat_monthly: "Hver måned", repeat_yearly: "Hvert år", repeat_custom: "Brugerdefineret", repeat_freq_day: "Dag", repeat_freq_week: "Uge", repeat_freq_month: "Måned", repeat_freq_year: "År", repeat_on_date: "På dato", repeat_ends: "Slutter", month_for_recurring: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"], day_for_recurring: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"] } }, Ia = { date: { month_full: [" Januar", " Februar", " März ", " April", " Mai", " Juni", " Juli", " August", " September ", " Oktober", " November ", " Dezember"], month_short: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], day_full: ["Sonntag", "Montag", "Dienstag", " Mittwoch", " Donnerstag", "Freitag", "Samstag"], day_short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"] }, labels: { dhx_cal_today_button: "Heute", day_tab: "Tag", week_tab: "Woche", month_tab: "Monat", new_event: "neuer Eintrag", icon_save: "Speichern", icon_cancel: "Abbrechen", icon_details: "Details", icon_edit: "Ändern", icon_delete: "Löschen", confirm_closing: "", confirm_deleting: "Der Eintrag wird gelöscht", section_description: "Beschreibung", section_time: "Zeitspanne", full_day: "Ganzer Tag", confirm_recurring: "Wollen Sie alle Einträge bearbeiten oder nur diesen einzelnen Eintrag?", section_recurring: "Wiederholung", button_recurring: "Aus", button_recurring_open: "An", button_edit_series: "Bearbeiten Sie die Serie", button_edit_occurrence: "Bearbeiten Sie eine Kopie", agenda_tab: "Agenda", date: "Datum", description: "Beschreibung", year_tab: "Jahre", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Täglich", repeat_radio_week: "Wöchentlich", repeat_radio_month: "Monatlich", repeat_radio_year: "Jährlich", repeat_radio_day_type: "jeden", repeat_text_day_count: "Tag", repeat_radio_day_type2: "an jedem Arbeitstag", repeat_week: " Wiederholt sich jede", repeat_text_week_count: "Woche am:", repeat_radio_month_type: "an jedem", repeat_radio_month_start: "am", repeat_text_month_day: "Tag eines jeden", repeat_text_month_count: "Monats", repeat_text_month_count2_before: "jeden", repeat_text_month_count2_after: "Monats", repeat_year_label: "am", select_year_day2: "im", repeat_text_year_day: "Tag im", select_year_month: "", repeat_radio_end: "kein Enddatum", repeat_text_occurences_count: "Ereignissen", repeat_radio_end3: "Schluß", repeat_radio_end2: "nach", repeat_never: "Nie", repeat_daily: "Jeden Tag", repeat_workdays: "Jeden Werktag", repeat_weekly: "Jede Woche", repeat_monthly: "Jeden Monat", repeat_yearly: "Jedes Jahr", repeat_custom: "Benutzerdefiniert", repeat_freq_day: "Tag", repeat_freq_week: "Woche", repeat_freq_month: "Monat", repeat_freq_year: "Jahr", repeat_on_date: "Am Datum", repeat_ends: "Endet", month_for_recurring: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"], day_for_recurring: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"] } }, Va = { date: { month_full: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάϊος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"], month_short: ["ΙΑΝ", "ΦΕΒ", "ΜΑΡ", "ΑΠΡ", "ΜΑΙ", "ΙΟΥΝ", "ΙΟΥΛ", "ΑΥΓ", "ΣΕΠ", "ΟΚΤ", "ΝΟΕ", "ΔΕΚ"], day_full: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"], day_short: ["ΚΥ", "ΔΕ", "ΤΡ", "ΤΕ", "ΠΕ", "ΠΑ", "ΣΑ"] }, labels: { dhx_cal_today_button: "Σήμερα", day_tab: "Ημέρα", week_tab: "Εβδομάδα", month_tab: "Μήνας", new_event: "Νέο έργο", icon_save: "Αποθήκευση", icon_cancel: "Άκυρο", icon_details: "Λεπτομέρειες", icon_edit: "Επεξεργασία", icon_delete: "Διαγραφή", confirm_closing: "", confirm_deleting: "Το έργο θα διαγραφεί οριστικά. Θέλετε να συνεχίσετε;", section_description: "Περιγραφή", section_time: "Χρονική περίοδος", full_day: "Πλήρης Ημέρα", confirm_recurring: "Θέλετε να επεξεργασθείτε ολόκληρη την ομάδα των επαναλαμβανόμενων έργων;", section_recurring: "Επαναλαμβανόμενο έργο", button_recurring: "Ανενεργό", button_recurring_open: "Ενεργό", button_edit_series: "Επεξεργαστείτε τη σειρά", button_edit_occurrence: "Επεξεργασία ένα αντίγραφο", agenda_tab: "Ημερήσια Διάταξη", date: "Ημερομηνία", description: "Περιγραφή", year_tab: "Έτος", week_agenda_tab: "Ημερήσια Διάταξη", grid_tab: "Πλέγμα", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Ημερησίως", repeat_radio_week: "Εβδομαδιαίως", repeat_radio_month: "Μηνιαίως", repeat_radio_year: "Ετησίως", repeat_radio_day_type: "Κάθε", repeat_text_day_count: "ημέρα", repeat_radio_day_type2: "Κάθε εργάσιμη", repeat_week: " Επανάληψη κάθε", repeat_text_week_count: "εβδομάδα τις επόμενες ημέρες:", repeat_radio_month_type: "Επανάληψη", repeat_radio_month_start: "Την", repeat_text_month_day: "ημέρα κάθε", repeat_text_month_count: "μήνα", repeat_text_month_count2_before: "κάθε", repeat_text_month_count2_after: "μήνα", repeat_year_label: "Την", select_year_day2: "του", repeat_text_year_day: "ημέρα", select_year_month: "μήνα", repeat_radio_end: "Χωρίς ημερομηνία λήξεως", repeat_text_occurences_count: "επαναλήψεις", repeat_radio_end3: "Λήγει την", repeat_radio_end2: "Μετά από", repeat_never: "Ποτέ", repeat_daily: "Κάθε μέρα", repeat_workdays: "Κάθε εργάσιμη μέρα", repeat_weekly: "Κάθε εβδομάδα", repeat_monthly: "Κάθε μήνα", repeat_yearly: "Κάθε χρόνο", repeat_custom: "Προσαρμοσμένο", repeat_freq_day: "Ημέρα", repeat_freq_week: "Εβδομάδα", repeat_freq_month: "Μήνας", repeat_freq_year: "Χρόνος", repeat_on_date: "Σε ημερομηνία", repeat_ends: "Λήγει", month_for_recurring: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάϊος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"], day_for_recurring: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"] } }, Ya = { date: { month_full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, labels: { dhx_cal_today_button: "Today", day_tab: "Day", week_tab: "Week", month_tab: "Month", new_event: "New event", icon_save: "Save", icon_cancel: "Cancel", icon_details: "Details", icon_edit: "Edit", icon_delete: "Delete", confirm_closing: "", confirm_deleting: "Event will be deleted permanently, are you sure?", section_description: "Description", section_time: "Time period", full_day: "Full day", confirm_recurring: "Do you want to edit the whole set of repeated events?", section_recurring: "Repeat event", button_recurring: "Disabled", button_recurring_open: "Enabled", button_edit_series: "Edit series", button_edit_occurrence: "Edit occurrence", agenda_tab: "Agenda", date: "Date", description: "Description", year_tab: "Year", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daily", repeat_radio_week: "Weekly", repeat_radio_month: "Monthly", repeat_radio_year: "Yearly", repeat_radio_day_type: "Every", repeat_text_day_count: "day", repeat_radio_day_type2: "Every workday", repeat_week: " Repeat every", repeat_text_week_count: "week next days:", repeat_radio_month_type: "Repeat", repeat_radio_month_start: "On", repeat_text_month_day: "day every", repeat_text_month_count: "month", repeat_text_month_count2_before: "every", repeat_text_month_count2_after: "month", repeat_year_label: "On", select_year_day2: "of", repeat_text_year_day: "day", select_year_month: "month", repeat_radio_end: "No end date", repeat_text_occurences_count: "occurrences", repeat_radio_end2: "After", repeat_radio_end3: "End by", repeat_never: "Never", repeat_daily: "Every day", repeat_workdays: "Every weekday", repeat_weekly: "Every week", repeat_monthly: "Every month", repeat_yearly: "Every year", repeat_custom: "Custom", repeat_freq_day: "Day", repeat_freq_week: "Week", repeat_freq_month: "Month", repeat_freq_year: "Year", repeat_on_date: "On date", repeat_ends: "Ends", month_for_recurring: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], day_for_recurring: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] } }, Ua = { date: { month_full: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], month_short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"], day_full: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], day_short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] }, labels: { dhx_cal_today_button: "Hoy", day_tab: "Día", week_tab: "Semana", month_tab: "Mes", new_event: "Nuevo evento", icon_save: "Guardar", icon_cancel: "Cancelar", icon_details: "Detalles", icon_edit: "Editar", icon_delete: "Eliminar", confirm_closing: "", confirm_deleting: "El evento se borrará definitivamente, ¿continuar?", section_description: "Descripción", section_time: "Período", full_day: "Todo el día", confirm_recurring: "¿Desea modificar el conjunto de eventos repetidos?", section_recurring: "Repita el evento", button_recurring: "Impedido", button_recurring_open: "Permitido", button_edit_series: "Editar la serie", button_edit_occurrence: "Editar este evento", agenda_tab: "Día", date: "Fecha", description: "Descripción", year_tab: "Año", week_agenda_tab: "Día", grid_tab: "Reja", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Diariamente", repeat_radio_week: "Semanalmente", repeat_radio_month: "Mensualmente", repeat_radio_year: "Anualmente", repeat_radio_day_type: "Cada", repeat_text_day_count: "dia", repeat_radio_day_type2: "Cada jornada de trabajo", repeat_week: " Repetir cada", repeat_text_week_count: "semana:", repeat_radio_month_type: "Repita", repeat_radio_month_start: "El", repeat_text_month_day: "dia cada ", repeat_text_month_count: "mes", repeat_text_month_count2_before: "cada", repeat_text_month_count2_after: "mes", repeat_year_label: "El", select_year_day2: "del", repeat_text_year_day: "dia", select_year_month: "mes", repeat_radio_end: "Sin fecha de finalización", repeat_text_occurences_count: "ocurrencias", repeat_radio_end3: "Fin", repeat_radio_end2: "Después de", repeat_never: "Nunca", repeat_daily: "Cada día", repeat_workdays: "Cada día laborable", repeat_weekly: "Cada semana", repeat_monthly: "Cada mes", repeat_yearly: "Cada año", repeat_custom: "Personalizado", repeat_freq_day: "Día", repeat_freq_week: "Semana", repeat_freq_month: "Mes", repeat_freq_year: "Año", repeat_on_date: "En la fecha", repeat_ends: "Termina", month_for_recurring: ["Enero", "Febrero", "Маrzo", "Аbril", "Mayo", "Junio", "Julio", "Аgosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"], day_for_recurring: ["Domingo", "Lunes", "Martes", "Miércoles", "Jeuves", "Viernes", "Sabado"] } }, Fa = { date: { month_full: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kes&auml;kuu", "Hein&auml;kuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"], month_short: ["Tam", "Hel", "Maa", "Huh", "Tou", "Kes", "Hei", "Elo", "Syy", "Lok", "Mar", "Jou"], day_full: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"], day_short: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"] }, labels: { dhx_cal_today_button: "Tänään", day_tab: "Päivä", week_tab: "Viikko", month_tab: "Kuukausi", new_event: "Uusi tapahtuma", icon_save: "Tallenna", icon_cancel: "Peru", icon_details: "Tiedot", icon_edit: "Muokkaa", icon_delete: "Poista", confirm_closing: "", confirm_deleting: "Haluatko varmasti poistaa tapahtuman?", section_description: "Kuvaus", section_time: "Aikajakso", full_day: "Koko päivä", confirm_recurring: "Haluatko varmasti muokata toistuvan tapahtuman kaikkia jaksoja?", section_recurring: "Toista tapahtuma", button_recurring: "Ei k&auml;yt&ouml;ss&auml;", button_recurring_open: "K&auml;yt&ouml;ss&auml;", button_edit_series: "Muokkaa sarja", button_edit_occurrence: "Muokkaa kopio", agenda_tab: "Esityslista", date: "Päivämäärä", description: "Kuvaus", year_tab: "Vuoden", week_agenda_tab: "Esityslista", grid_tab: "Ritilä", drag_to_create: "Luo uusi vetämällä", drag_to_move: "Siirrä vetämällä", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "P&auml;ivitt&auml;in", repeat_radio_week: "Viikoittain", repeat_radio_month: "Kuukausittain", repeat_radio_year: "Vuosittain", repeat_radio_day_type: "Joka", repeat_text_day_count: "p&auml;iv&auml;", repeat_radio_day_type2: "Joka arkip&auml;iv&auml;", repeat_week: "Toista joka", repeat_text_week_count: "viikko n&auml;in&auml; p&auml;ivin&auml;:", repeat_radio_month_type: "Toista", repeat_radio_month_start: "", repeat_text_month_day: "p&auml;iv&auml;n&auml; joka", repeat_text_month_count: "kuukausi", repeat_text_month_count2_before: "joka", repeat_text_month_count2_after: "kuukausi", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "p&auml;iv&auml;", select_year_month: "kuukausi", repeat_radio_end: "Ei loppumisaikaa", repeat_text_occurences_count: "Toiston j&auml;lkeen", repeat_radio_end3: "Loppuu", repeat_radio_end2: "", repeat_never: "Ei koskaan", repeat_daily: "Joka päivä", repeat_workdays: "Joka arkipäivä", repeat_weekly: "Joka viikko", repeat_monthly: "Joka kuukausi", repeat_yearly: "Joka vuosi", repeat_custom: "Mukautettu", repeat_freq_day: "Päivä", repeat_freq_week: "Viikko", repeat_freq_month: "Kuukausi", repeat_freq_year: "Vuosi", repeat_on_date: "Tiettynä päivänä", repeat_ends: "Päättyy", month_for_recurring: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kes&auml;kuu", "Hein&auml;kuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"], day_for_recurring: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"] } }, Ba = { date: { month_full: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"], month_short: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"], day_full: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"], day_short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] }, labels: { dhx_cal_today_button: "Aujourd'hui", day_tab: "Jour", week_tab: "Semaine", month_tab: "Mois", new_event: "Nouvel événement", icon_save: "Enregistrer", icon_cancel: "Annuler", icon_details: "Détails", icon_edit: "Modifier", icon_delete: "Effacer", confirm_closing: "", confirm_deleting: "L'événement sera effacé sans appel, êtes-vous sûr ?", section_description: "Description", section_time: "Période", full_day: "Journée complète", confirm_recurring: "Voulez-vous éditer toute une série d'évènements répétés?", section_recurring: "Périodicité", button_recurring: "Désactivé", button_recurring_open: "Activé", button_edit_series: "Modifier la série", button_edit_occurrence: "Modifier une copie", agenda_tab: "Jour", date: "Date", description: "Description", year_tab: "Année", week_agenda_tab: "Jour", grid_tab: "Grille", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Quotidienne", repeat_radio_week: "Hebdomadaire", repeat_radio_month: "Mensuelle", repeat_radio_year: "Annuelle", repeat_radio_day_type: "Chaque", repeat_text_day_count: "jour", repeat_radio_day_type2: "Chaque journée de travail", repeat_week: " Répéter toutes les", repeat_text_week_count: "semaine:", repeat_radio_month_type: "Répéter", repeat_radio_month_start: "Le", repeat_text_month_day: "jour chaque", repeat_text_month_count: "mois", repeat_text_month_count2_before: "chaque", repeat_text_month_count2_after: "mois", repeat_year_label: "Le", select_year_day2: "du", repeat_text_year_day: "jour", select_year_month: "mois", repeat_radio_end: "Pas de date d&quot;achèvement", repeat_text_occurences_count: "occurrences", repeat_radio_end3: "Fin", repeat_radio_end2: "Après", repeat_never: "Jamais", repeat_daily: "Chaque jour", repeat_workdays: "Chaque jour ouvrable", repeat_weekly: "Chaque semaine", repeat_monthly: "Chaque mois", repeat_yearly: "Chaque année", repeat_custom: "Personnalisé", repeat_freq_day: "Jour", repeat_freq_week: "Semaine", repeat_freq_month: "Mois", repeat_freq_year: "Année", repeat_on_date: "À la date", repeat_ends: "Se termine", month_for_recurring: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"], day_for_recurring: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] } }, Wa = { date: { month_full: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"], month_short: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"], day_full: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"], day_short: ["א", "ב", "ג", "ד", "ה", "ו", "ש"] }, labels: { dhx_cal_today_button: "היום", day_tab: "יום", week_tab: "שבוע", month_tab: "חודש", new_event: "ארוע חדש", icon_save: "שמור", icon_cancel: "בטל", icon_details: "פרטים", icon_edit: "ערוך", icon_delete: "מחק", confirm_closing: "", confirm_deleting: "ארוע ימחק סופית.להמשיך?", section_description: "תיאור", section_time: "תקופה", confirm_recurring: "האם ברצונך לשנות כל סדרת ארועים מתמשכים?", section_recurring: "להעתיק ארוע", button_recurring: "לא פעיל", button_recurring_open: "פעיל", full_day: "יום שלם", button_edit_series: "ערוך את הסדרה", button_edit_occurrence: "עריכת עותק", agenda_tab: "סדר יום", date: "תאריך", description: "תיאור", year_tab: "לשנה", week_agenda_tab: "סדר יום", grid_tab: "סורג", drag_to_create: "Drag to create", drag_to_move: "גרור כדי להזיז", message_ok: "OK", message_cancel: "בטל", next: "הבא", prev: "הקודם", year: "שנה", month: "חודש", day: "יום", hour: "שעה", minute: "דקה", repeat_radio_day: "יומי", repeat_radio_week: "שבועי", repeat_radio_month: "חודשי", repeat_radio_year: "שנתי", repeat_radio_day_type: "חזור כל", repeat_text_day_count: "ימים", repeat_radio_day_type2: "חזור כל יום עבודה", repeat_week: " חזור כל", repeat_text_week_count: "שבוע לפי ימים:", repeat_radio_month_type: "חזור כל", repeat_radio_month_start: "כל", repeat_text_month_day: "ימים כל", repeat_text_month_count: "חודשים", repeat_text_month_count2_before: "חזור כל", repeat_text_month_count2_after: "חודש", repeat_year_label: "כל", select_year_day2: "בחודש", repeat_text_year_day: "ימים", select_year_month: "חודש", repeat_radio_end: "לעולם לא מסתיים", repeat_text_occurences_count: "אירועים", repeat_radio_end3: "מסתיים ב", repeat_radio_end2: "אחרי", repeat_never: "אף פעם", repeat_daily: "כל יום", repeat_workdays: "כל יום עבודה", repeat_weekly: "כל שבוע", repeat_monthly: "כל חודש", repeat_yearly: "כל שנה", repeat_custom: "מותאם אישית", repeat_freq_day: "יום", repeat_freq_week: "שבוע", repeat_freq_month: "חודש", repeat_freq_year: "שנה", repeat_on_date: "בתאריך", repeat_ends: "מסתיים", month_for_recurring: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"], day_for_recurring: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"] } }, Ja = { date: { month_full: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"], month_short: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Vasárnap", "Hétfõ", "Kedd", "Szerda", "Csütörtök", "Péntek", "szombat"], day_short: ["Va", "Hé", "Ke", "Sze", "Csü", "Pé", "Szo"] }, labels: { dhx_cal_today_button: "Ma", day_tab: "Nap", week_tab: "Hét", month_tab: "Hónap", new_event: "Új esemény", icon_save: "Mentés", icon_cancel: "Mégse", icon_details: "Részletek", icon_edit: "Szerkesztés", icon_delete: "Törlés", confirm_closing: "", confirm_deleting: "Az esemény törölve lesz, biztosan folytatja?", section_description: "Leírás", section_time: "Idõszak", full_day: "Egesz napos", confirm_recurring: "Biztosan szerkeszteni akarod az összes ismétlõdõ esemény beállítását?", section_recurring: "Esemény ismétlése", button_recurring: "Tiltás", button_recurring_open: "Engedélyezés", button_edit_series: "Edit series", button_edit_occurrence: "Szerkesztés bíróság", agenda_tab: "Napirend", date: "Dátum", description: "Leírás", year_tab: "Év", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Napi", repeat_radio_week: "Heti", repeat_radio_month: "Havi", repeat_radio_year: "Éves", repeat_radio_day_type: "Minden", repeat_text_day_count: "nap", repeat_radio_day_type2: "Minden munkanap", repeat_week: " Ismételje meg minden", repeat_text_week_count: "héten a következő napokon:", repeat_radio_month_type: "Ismétlés", repeat_radio_month_start: "Ekkor", repeat_text_month_day: "nap minden", repeat_text_month_count: "hónapban", repeat_text_month_count2_before: "minden", repeat_text_month_count2_after: "hónapban", repeat_year_label: "Ekkor", select_year_day2: "-án/-én", repeat_text_year_day: "nap", select_year_month: "hónap", repeat_radio_end: "Nincs befejezési dátum", repeat_text_occurences_count: "esemény", repeat_radio_end2: "Után", repeat_radio_end3: "Befejező dátum", repeat_never: "Soha", repeat_daily: "Minden nap", repeat_workdays: "Minden munkanap", repeat_weekly: "Minden héten", repeat_monthly: "Minden hónapban", repeat_yearly: "Minden évben", repeat_custom: "Egyedi", repeat_freq_day: "Nap", repeat_freq_week: "Hét", repeat_freq_month: "Hónap", repeat_freq_year: "Év", repeat_on_date: "Dátum szerint", repeat_ends: "Befejeződik", month_for_recurring: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"], day_for_recurring: ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"] } }, Xa = { date: { month_full: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"], day_full: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], day_short: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] }, labels: { dhx_cal_today_button: "Hari Ini", day_tab: "Hari", week_tab: "Minggu", month_tab: "Bulan", new_event: "Acara Baru", icon_save: "Simpan", icon_cancel: "Batal", icon_details: "Detail", icon_edit: "Edit", icon_delete: "Hapus", confirm_closing: "", confirm_deleting: "Acara akan dihapus", section_description: "Keterangan", section_time: "Periode", full_day: "Hari penuh", confirm_recurring: "Apakah acara ini akan berulang?", section_recurring: "Acara Rutin", button_recurring: "Tidak Difungsikan", button_recurring_open: "Difungsikan", button_edit_series: "Mengedit seri", button_edit_occurrence: "Mengedit salinan", agenda_tab: "Agenda", date: "Tanggal", description: "Keterangan", year_tab: "Tahun", week_agenda_tab: "Agenda", grid_tab: "Tabel", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Harian", repeat_radio_week: "Mingguan", repeat_radio_month: "Bulanan", repeat_radio_year: "Tahunan", repeat_radio_day_type: "Setiap", repeat_text_day_count: "hari", repeat_radio_day_type2: "Setiap hari kerja", repeat_week: " Ulangi setiap", repeat_text_week_count: "minggu pada hari berikut:", repeat_radio_month_type: "Ulangi", repeat_radio_month_start: "Pada", repeat_text_month_day: "hari setiap", repeat_text_month_count: "bulan", repeat_text_month_count2_before: "setiap", repeat_text_month_count2_after: "bulan", repeat_year_label: "Pada", select_year_day2: "dari", repeat_text_year_day: "hari", select_year_month: "bulan", repeat_radio_end: "Tanpa tanggal akhir", repeat_text_occurences_count: "kejadian", repeat_radio_end2: "Setelah", repeat_radio_end3: "Berakhir pada", repeat_never: "Tidak pernah", repeat_daily: "Setiap hari", repeat_workdays: "Setiap hari kerja", repeat_weekly: "Setiap minggu", repeat_monthly: "Setiap bulan", repeat_yearly: "Setiap tahun", repeat_custom: "Kustom", repeat_freq_day: "Hari", repeat_freq_week: "Minggu", repeat_freq_month: "Bulan", repeat_freq_year: "Tahun", repeat_on_date: "Pada tanggal", repeat_ends: "Berakhir", month_for_recurring: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], day_for_recurring: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] } }, Ka = { date: { month_full: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"], month_short: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"], day_full: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"], day_short: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"] }, labels: { dhx_cal_today_button: "Oggi", day_tab: "Giorno", week_tab: "Settimana", month_tab: "Mese", new_event: "Nuovo evento", icon_save: "Salva", icon_cancel: "Chiudi", icon_details: "Dettagli", icon_edit: "Modifica", icon_delete: "Elimina", confirm_closing: "", confirm_deleting: "L'evento sarà eliminato, siete sicuri?", section_description: "Descrizione", section_time: "Periodo di tempo", full_day: "Intera giornata", confirm_recurring: "Vuoi modificare l'intera serie di eventi?", section_recurring: "Ripetere l'evento", button_recurring: "Disattivato", button_recurring_open: "Attivato", button_edit_series: "Modificare la serie", button_edit_occurrence: "Modificare una copia", agenda_tab: "Agenda", date: "Data", description: "Descrizione", year_tab: "Anno", week_agenda_tab: "Agenda", grid_tab: "Griglia", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Quotidiano", repeat_radio_week: "Settimanale", repeat_radio_month: "Mensile", repeat_radio_year: "Annuale", repeat_radio_day_type: "Ogni", repeat_text_day_count: "giorno", repeat_radio_day_type2: "Ogni giornata lavorativa", repeat_week: " Ripetere ogni", repeat_text_week_count: "settimana:", repeat_radio_month_type: "Ripetere", repeat_radio_month_start: "Il", repeat_text_month_day: "giorno ogni", repeat_text_month_count: "mese", repeat_text_month_count2_before: "ogni", repeat_text_month_count2_after: "mese", repeat_year_label: "Il", select_year_day2: "del", repeat_text_year_day: "giorno", select_year_month: "mese", repeat_radio_end: "Senza data finale", repeat_text_occurences_count: "occorenze", repeat_radio_end3: "Fine", repeat_radio_end2: "Dopo", repeat_never: "Mai", repeat_daily: "Ogni giorno", repeat_workdays: "Ogni giorno feriale", repeat_weekly: "Ogni settimana", repeat_monthly: "Ogni mese", repeat_yearly: "Ogni anno", repeat_custom: "Personalizzato", repeat_freq_day: "Giorno", repeat_freq_week: "Settimana", repeat_freq_month: "Mese", repeat_freq_year: "Anno", repeat_on_date: "Alla data", repeat_ends: "Finisce", month_for_recurring: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Jiugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"], day_for_recurring: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Jovedì", "Venerdì", "Sabato"] } }, Ga = { date: { month_full: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"], day_short: ["日", "月", "火", "水", "木", "金", "土"] }, labels: { dhx_cal_today_button: "今日", day_tab: "日", week_tab: "週", month_tab: "月", new_event: "新イベント", icon_save: "保存", icon_cancel: "キャンセル", icon_details: "詳細", icon_edit: "編集", icon_delete: "削除", confirm_closing: "", confirm_deleting: "イベント完全に削除されます、宜しいですか？", section_description: "デスクリプション", section_time: "期間", confirm_recurring: "繰り返されているイベントを全て編集しますか？", section_recurring: "イベントを繰り返す", button_recurring: "無効", button_recurring_open: "有効", full_day: "終日", button_edit_series: "シリーズを編集します", button_edit_occurrence: "コピーを編集", agenda_tab: "議題は", date: "日付", description: "説明", year_tab: "今年", week_agenda_tab: "議題は", grid_tab: "グリッド", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "毎日", repeat_radio_week: "毎週", repeat_radio_month: "毎月", repeat_radio_year: "毎年", repeat_radio_day_type: "毎", repeat_text_day_count: "日", repeat_radio_day_type2: "毎営業日", repeat_week: " 繰り返し毎", repeat_text_week_count: "週 次の日:", repeat_radio_month_type: "繰り返し", repeat_radio_month_start: "オン", repeat_text_month_day: "日毎", repeat_text_month_count: "月", repeat_text_month_count2_before: "毎", repeat_text_month_count2_after: "月", repeat_year_label: "オン", select_year_day2: "の", repeat_text_year_day: "日", select_year_month: "月", repeat_radio_end: "終了日なし", repeat_text_occurences_count: "回数", repeat_radio_end2: "後", repeat_radio_end3: "終了日まで", repeat_never: "決して", repeat_daily: "毎日", repeat_workdays: "毎営業日", repeat_weekly: "毎週", repeat_monthly: "毎月", repeat_yearly: "毎年", repeat_custom: "カスタム", repeat_freq_day: "日", repeat_freq_week: "週", repeat_freq_month: "月", repeat_freq_year: "年", repeat_on_date: "日にち", repeat_ends: "終了", month_for_recurring: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_for_recurring: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"] } };
class Za {
  constructor(i) {
    this._locales = {};
    for (const t in i)
      this._locales[t] = i[t];
  }
  addLocale(i, t) {
    this._locales[i] = t;
  }
  getLocale(i) {
    return this._locales[i];
  }
}
const Qa = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Mon", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { dhx_cal_today_button: "I dag", day_tab: "Dag", week_tab: "Uke", month_tab: "Måned", new_event: "Ny hendelse", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Rediger", icon_delete: "Slett", confirm_closing: "", confirm_deleting: "Hendelsen vil bli slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", confirm_recurring: "Vil du forandre hele dette settet av repeterende hendelser?", section_recurring: "Repeter hendelsen", button_recurring: "Av", button_recurring_open: "På", button_edit_series: "Rediger serien", button_edit_occurrence: "Redigere en kopi", agenda_tab: "Agenda", date: "Dato", description: "Beskrivelse", year_tab: "År", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daglig", repeat_radio_week: "Ukentlig", repeat_radio_month: "Månedlig", repeat_radio_year: "Årlig", repeat_radio_day_type: "Hver", repeat_text_day_count: "dag", repeat_radio_day_type2: "Alle hverdager", repeat_week: " Gjentas hver", repeat_text_week_count: "uke på:", repeat_radio_month_type: "På hver", repeat_radio_month_start: "På", repeat_text_month_day: "dag hver", repeat_text_month_count: "måned", repeat_text_month_count2_before: "hver", repeat_text_month_count2_after: "måned", repeat_year_label: "på", select_year_day2: "i", repeat_text_year_day: "dag i", select_year_month: "", repeat_radio_end: "Ingen sluttdato", repeat_text_occurences_count: "forekomst", repeat_radio_end3: "Stop den", repeat_radio_end2: "Etter", repeat_never: "Aldri", repeat_daily: "Hver dag", repeat_workdays: "Hver ukedag", repeat_weekly: "Hver uke", repeat_monthly: "Hver måned", repeat_yearly: "Hvert år", repeat_custom: "Tilpasset", repeat_freq_day: "Dag", repeat_freq_week: "Uke", repeat_freq_month: "Måned", repeat_freq_year: "År", repeat_on_date: "På dato", repeat_ends: "Slutter", month_for_recurring: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], day_for_recurring: ["Sondag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"] } }, en = { date: { month_full: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"], day_short: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"] }, labels: { dhx_cal_today_button: "Vandaag", day_tab: "Dag", week_tab: "Week", month_tab: "Maand", new_event: "Nieuw item", icon_save: "Opslaan", icon_cancel: "Annuleren", icon_details: "Details", icon_edit: "Bewerken", icon_delete: "Verwijderen", confirm_closing: "", confirm_deleting: "Item zal permanent worden verwijderd, doorgaan?", section_description: "Beschrijving", section_time: "Tijd periode", full_day: "Hele dag", confirm_recurring: "Wilt u alle terugkerende items bijwerken?", section_recurring: "Item herhalen", button_recurring: "Uit", button_recurring_open: "Aan", button_edit_series: "Bewerk de serie", button_edit_occurrence: "Bewerk een kopie", agenda_tab: "Agenda", date: "Datum", description: "Omschrijving", year_tab: "Jaar", week_agenda_tab: "Agenda", grid_tab: "Tabel", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Dagelijks", repeat_radio_week: "Wekelijks", repeat_radio_month: "Maandelijks", repeat_radio_year: "Jaarlijks", repeat_radio_day_type: "Elke", repeat_text_day_count: "dag(en)", repeat_radio_day_type2: "Elke werkdag", repeat_week: " Herhaal elke", repeat_text_week_count: "week op de volgende dagen:", repeat_radio_month_type: "Herhaal", repeat_radio_month_start: "Op", repeat_text_month_day: "dag iedere", repeat_text_month_count: "maanden", repeat_text_month_count2_before: "iedere", repeat_text_month_count2_after: "maanden", repeat_year_label: "Op", select_year_day2: "van", repeat_text_year_day: "dag", select_year_month: "maand", repeat_radio_end: "Geen eind datum", repeat_text_occurences_count: "keren", repeat_radio_end3: "Eindigd per", repeat_radio_end2: "Na", repeat_never: "Nooit", repeat_daily: "Elke dag", repeat_workdays: "Elke werkdag", repeat_weekly: "Elke week", repeat_monthly: "Elke maand", repeat_yearly: "Elk jaar", repeat_custom: "Aangepast", repeat_freq_day: "Dag", repeat_freq_week: "Week", repeat_freq_month: "Maand", repeat_freq_year: "Jaar", repeat_on_date: "Op datum", repeat_ends: "Eindigt", month_for_recurring: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"], day_for_recurring: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"] } }, tn = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { dhx_cal_today_button: "Idag", day_tab: "Dag", week_tab: "Uke", month_tab: "Måned", new_event: "Ny", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Endre", icon_delete: "Slett", confirm_closing: "Endringer blir ikke lagret, er du sikker?", confirm_deleting: "Oppføringen vil bli slettet, er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", full_day: "Full dag", confirm_recurring: "Vil du endre hele settet med repeterende oppføringer?", section_recurring: "Repeterende oppføring", button_recurring: "Ikke aktiv", button_recurring_open: "Aktiv", button_edit_series: "Rediger serien", button_edit_occurrence: "Redigere en kopi", agenda_tab: "Agenda", date: "Dato", description: "Beskrivelse", year_tab: "År", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daglig", repeat_radio_week: "Ukentlig", repeat_radio_month: "Månedlig", repeat_radio_year: "Årlig", repeat_radio_day_type: "Hver", repeat_text_day_count: "dag", repeat_radio_day_type2: "Hver arbeidsdag", repeat_week: " Gjenta hver", repeat_text_week_count: "uke neste dager:", repeat_radio_month_type: "Gjenta", repeat_radio_month_start: "På", repeat_text_month_day: "dag hver", repeat_text_month_count: "måned", repeat_text_month_count2_before: "hver", repeat_text_month_count2_after: "måned", repeat_year_label: "På", select_year_day2: "av", repeat_text_year_day: "dag", select_year_month: "måned", repeat_radio_end: "Ingen sluttdato", repeat_text_occurences_count: "forekomster", repeat_radio_end2: "Etter", repeat_radio_end3: "Slutt innen", repeat_never: "Aldri", repeat_daily: "Hver dag", repeat_workdays: "Hver ukedag", repeat_weekly: "Hver uke", repeat_monthly: "Hver måned", repeat_yearly: "Hvert år", repeat_custom: "Tilpasset", repeat_freq_day: "Dag", repeat_freq_week: "Uke", repeat_freq_month: "Måned", repeat_freq_year: "År", repeat_on_date: "På dato", repeat_ends: "Slutter", month_for_recurring: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], day_for_recurring: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"] } }, an = { date: { month_full: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"], month_short: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"], day_full: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"], day_short: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"] }, labels: { dhx_cal_today_button: "Dziś", day_tab: "Dzień", week_tab: "Tydzień", month_tab: "Miesiąc", new_event: "Nowe zdarzenie", icon_save: "Zapisz", icon_cancel: "Anuluj", icon_details: "Szczegóły", icon_edit: "Edytuj", icon_delete: "Usuń", confirm_closing: "", confirm_deleting: "Zdarzenie zostanie usunięte na zawsze, kontynuować?", section_description: "Opis", section_time: "Okres czasu", full_day: "Cały dzień", confirm_recurring: "Czy chcesz edytować cały zbiór powtarzających się zdarzeń?", section_recurring: "Powtórz zdarzenie", button_recurring: "Nieaktywne", button_recurring_open: "Aktywne", button_edit_series: "Edytuj serię", button_edit_occurrence: "Edytuj kopię", agenda_tab: "Agenda", date: "Data", description: "Opis", year_tab: "Rok", week_agenda_tab: "Agenda", grid_tab: "Tabela", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Codziennie", repeat_radio_week: "Co tydzie", repeat_radio_month: "Co miesic", repeat_radio_year: "Co rok", repeat_radio_day_type: "Kadego", repeat_text_day_count: "dnia", repeat_radio_day_type2: "Kadego dnia roboczego", repeat_week: " Powtarzaj kadego", repeat_text_week_count: "tygodnia w dni:", repeat_radio_month_type: "Powtrz", repeat_radio_month_start: "W", repeat_text_month_day: "dnia kadego", repeat_text_month_count: "miesica", repeat_text_month_count2_before: "kadego", repeat_text_month_count2_after: "miesica", repeat_year_label: "W", select_year_day2: "miesica", repeat_text_year_day: "dnia miesica", select_year_month: "", repeat_radio_end: "Bez daty kocowej", repeat_text_occurences_count: "wystpieniu/ach", repeat_radio_end3: "Zakocz w", repeat_radio_end2: "Po", repeat_never: "Nigdy", repeat_daily: "Codziennie", repeat_workdays: "Każdy dzień roboczy", repeat_weekly: "Co tydzień", repeat_monthly: "Co miesiąc", repeat_yearly: "Co rok", repeat_custom: "Niestandardowy", repeat_freq_day: "Dzień", repeat_freq_week: "Tydzień", repeat_freq_month: "Miesiąc", repeat_freq_year: "Rok", repeat_on_date: "W dniu", repeat_ends: "Kończy się", month_for_recurring: ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca", "Lipca", "Sierpnia", "Wrzenia", "Padziernka", "Listopada", "Grudnia"], day_for_recurring: ["Niedziela", "Poniedziaek", "Wtorek", "roda", "Czwartek", "Pitek", "Sobota"] } }, nn = { date: { month_full: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], month_short: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], day_full: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"], day_short: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"] }, labels: { dhx_cal_today_button: "Hoje", day_tab: "Dia", week_tab: "Semana", month_tab: "Mês", new_event: "Novo evento", icon_save: "Salvar", icon_cancel: "Cancelar", icon_details: "Detalhes", icon_edit: "Editar", icon_delete: "Deletar", confirm_closing: "", confirm_deleting: "Tem certeza que deseja excluir?", section_description: "Descrição", section_time: "Período de tempo", full_day: "Dia inteiro", confirm_recurring: "Deseja editar todos esses eventos repetidos?", section_recurring: "Repetir evento", button_recurring: "Desabilitar", button_recurring_open: "Habilitar", button_edit_series: "Editar a série", button_edit_occurrence: "Editar uma cópia", agenda_tab: "Dia", date: "Data", description: "Descrição", year_tab: "Ano", week_agenda_tab: "Dia", grid_tab: "Grade", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Diário", repeat_radio_week: "Semanal", repeat_radio_month: "Mensal", repeat_radio_year: "Anual", repeat_radio_day_type: "Cada", repeat_text_day_count: "dia(s)", repeat_radio_day_type2: "Cada trabalho diário", repeat_week: " Repita cada", repeat_text_week_count: "semana:", repeat_radio_month_type: "Repetir", repeat_radio_month_start: "Em", repeat_text_month_day: "todo dia", repeat_text_month_count: "mês", repeat_text_month_count2_before: "todo", repeat_text_month_count2_after: "mês", repeat_year_label: "Em", select_year_day2: "of", repeat_text_year_day: "dia", select_year_month: "mês", repeat_radio_end: "Sem data final", repeat_text_occurences_count: "ocorrências", repeat_radio_end3: "Fim", repeat_radio_end2: "Depois", repeat_never: "Nunca", repeat_daily: "Todos os dias", repeat_workdays: "Todos os dias úteis", repeat_weekly: "Toda semana", repeat_monthly: "Todo mês", repeat_yearly: "Todo ano", repeat_custom: "Personalizado", repeat_freq_day: "Dia", repeat_freq_week: "Semana", repeat_freq_month: "Mês", repeat_freq_year: "Ano", repeat_on_date: "Na data", repeat_ends: "Termina", month_for_recurring: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], day_for_recurring: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] } }, rn = { date: { month_full: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "November", "December"], month_short: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"], day_short: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sa"] }, labels: { dhx_cal_today_button: "Astazi", day_tab: "Zi", week_tab: "Saptamana", month_tab: "Luna", new_event: "Eveniment nou", icon_save: "Salveaza", icon_cancel: "Anuleaza", icon_details: "Detalii", icon_edit: "Editeaza", icon_delete: "Sterge", confirm_closing: "Schimbarile nu vor fi salvate, esti sigur?", confirm_deleting: "Evenimentul va fi sters permanent, esti sigur?", section_description: "Descriere", section_time: "Interval", full_day: "Toata ziua", confirm_recurring: "Vrei sa editezi toata seria de evenimente repetate?", section_recurring: "Repetare", button_recurring: "Dezactivata", button_recurring_open: "Activata", button_edit_series: "Editeaza serie", button_edit_occurrence: "Editeaza doar intrare", agenda_tab: "Agenda", date: "Data", description: "Descriere", year_tab: "An", week_agenda_tab: "Agenda", grid_tab: "Lista", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Zilnic", repeat_radio_week: "Saptamanal", repeat_radio_month: "Lunar", repeat_radio_year: "Anual", repeat_radio_day_type: "La fiecare", repeat_text_day_count: "zi(le)", repeat_radio_day_type2: "Fiecare zi lucratoare", repeat_week: " Repeta la fiecare", repeat_text_week_count: "saptamana in urmatoarele zile:", repeat_radio_month_type: "Repeta in", repeat_radio_month_start: "In a", repeat_text_month_day: "zi la fiecare", repeat_text_month_count: "luni", repeat_text_month_count2_before: "la fiecare", repeat_text_month_count2_after: "luni", repeat_year_label: "In", select_year_day2: "a lunii", repeat_text_year_day: "zi a lunii", select_year_month: "", repeat_radio_end: "Fara data de sfarsit", repeat_text_occurences_count: "evenimente", repeat_radio_end3: "La data", repeat_radio_end2: "Dupa", repeat_never: "Niciodată", repeat_daily: "În fiecare zi", repeat_workdays: "În fiecare zi lucrătoare", repeat_weekly: "În fiecare săptămână", repeat_monthly: "În fiecare lună", repeat_yearly: "În fiecare an", repeat_custom: "Personalizat", repeat_freq_day: "Zi", repeat_freq_week: "Săptămână", repeat_freq_month: "Lună", repeat_freq_year: "An", repeat_on_date: "La data", repeat_ends: "Se termină", month_for_recurring: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"], day_for_recurring: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"] } }, on = { date: { month_full: ["Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь", "Июль", "Август", "Сентябрь", "Oктябрь", "Ноябрь", "Декабрь"], month_short: ["Янв", "Фев", "Maр", "Aпр", "Maй", "Июн", "Июл", "Aвг", "Сен", "Окт", "Ноя", "Дек"], day_full: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"], day_short: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] }, labels: { dhx_cal_today_button: "Сегодня", day_tab: "День", week_tab: "Неделя", month_tab: "Месяц", new_event: "Новое событие", icon_save: "Сохранить", icon_cancel: "Отменить", icon_details: "Детали", icon_edit: "Изменить", icon_delete: "Удалить", confirm_closing: "", confirm_deleting: "Событие будет удалено безвозвратно, продолжить?", section_description: "Описание", section_time: "Период времени", full_day: "Весь день", confirm_recurring: "Вы хотите изменить всю серию повторяющихся событий?", section_recurring: "Повторение", button_recurring: "Отключено", button_recurring_open: "Включено", button_edit_series: "Редактировать серию", button_edit_occurrence: "Редактировать экземпляр", agenda_tab: "Список", date: "Дата", description: "Описание", year_tab: "Год", week_agenda_tab: "Список", grid_tab: "Таблица", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "День", repeat_radio_week: "Неделя", repeat_radio_month: "Месяц", repeat_radio_year: "Год", repeat_radio_day_type: "Каждый", repeat_text_day_count: "день", repeat_radio_day_type2: "Каждый рабочий день", repeat_week: " Повторять каждую", repeat_text_week_count: "неделю , в:", repeat_radio_month_type: "Повторять", repeat_radio_month_start: "", repeat_text_month_day: " числа каждый ", repeat_text_month_count: "месяц", repeat_text_month_count2_before: "каждый ", repeat_text_month_count2_after: "месяц", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "день", select_year_month: "", repeat_radio_end: "Без даты окончания", repeat_text_occurences_count: "повторений", repeat_radio_end3: "До ", repeat_radio_end2: "", repeat_never: "Никогда", repeat_daily: "Каждый день", repeat_workdays: "Каждый будний день", repeat_weekly: "Каждую неделю", repeat_monthly: "Каждый месяц", repeat_yearly: "Каждый год", repeat_custom: "Настроить", repeat_freq_day: "День", repeat_freq_week: "Неделя", repeat_freq_month: "Месяц", repeat_freq_year: "Год", repeat_on_date: "В дату", repeat_ends: "Заканчивается", month_for_recurring: ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"], day_for_recurring: ["Воскресенье", "Понедельник", "Вторник", "Среду", "Четверг", "Пятницу", "Субботу"] } }, sn = { date: { month_full: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"], day_short: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"] }, labels: { dhx_cal_today_button: "Danes", day_tab: "Dan", week_tab: "Teden", month_tab: "Mesec", new_event: "Nov dogodek", icon_save: "Shrani", icon_cancel: "Prekliči", icon_details: "Podrobnosti", icon_edit: "Uredi", icon_delete: "Izbriši", confirm_closing: "", confirm_deleting: "Dogodek bo izbrisan. Želite nadaljevati?", section_description: "Opis", section_time: "Časovni okvir", full_day: "Ves dan", confirm_recurring: "Želite urediti celoten set ponavljajočih dogodkov?", section_recurring: "Ponovi dogodek", button_recurring: "Onemogočeno", button_recurring_open: "Omogočeno", button_edit_series: "Edit series", button_edit_occurrence: "Edit occurrence", agenda_tab: "Zadeva", date: "Datum", description: "Opis", year_tab: "Leto", week_agenda_tab: "Zadeva", grid_tab: "Miza", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Dnevno", repeat_radio_week: "Tedensko", repeat_radio_month: "Mesečno", repeat_radio_year: "Letno", repeat_radio_day_type: "Vsak", repeat_text_day_count: "dan", repeat_radio_day_type2: "Vsak delovni dan", repeat_week: " Ponavljaj vsak", repeat_text_week_count: "teden na naslednje dni:", repeat_radio_month_type: "Ponavljaj", repeat_radio_month_start: "Na", repeat_text_month_day: "dan vsak", repeat_text_month_count: "mesec", repeat_text_month_count2_before: "vsak", repeat_text_month_count2_after: "mesec", repeat_year_label: "Na", select_year_day2: "od", repeat_text_year_day: "dan", select_year_month: "mesec", repeat_radio_end: "Brez končnega datuma", repeat_text_occurences_count: "pojavitve", repeat_radio_end2: "Po", repeat_radio_end3: "Končaj do", repeat_never: "Nikoli", repeat_daily: "Vsak dan", repeat_workdays: "Vsak delovni dan", repeat_weekly: "Vsak teden", repeat_monthly: "Vsak mesec", repeat_yearly: "Vsako leto", repeat_custom: "Po meri", repeat_freq_day: "Dan", repeat_freq_week: "Teden", repeat_freq_month: "Mesec", repeat_freq_year: "Leto", repeat_on_date: "Na datum", repeat_ends: "Konča se", month_for_recurring: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"], day_for_recurring: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"] } }, _n = { date: { month_full: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sept", "Okt", "Nov", "Dec"], day_full: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"], day_short: ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"] }, labels: { dhx_cal_today_button: "Dnes", day_tab: "Deň", week_tab: "Týždeň", month_tab: "Mesiac", new_event: "Nová udalosť", icon_save: "Uložiť", icon_cancel: "Späť", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Zmazať", confirm_closing: "Vaše zmeny nebudú uložené. Skutočne?", confirm_deleting: "Udalosť bude natrvalo vymazaná. Skutočne?", section_description: "Poznámky", section_time: "Doba platnosti", confirm_recurring: "Prajete si upraviť celú radu opakovaných udalostí?", section_recurring: "Opakovanie udalosti", button_recurring: "Vypnuté", button_recurring_open: "Zapnuté", button_edit_series: "Upraviť opakovania", button_edit_occurrence: "Upraviť inštancie", agenda_tab: "Program", date: "Dátum", description: "Poznámka", year_tab: "Rok", full_day: "Celý deň", week_agenda_tab: "Program", grid_tab: "Mriežka", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Denne", repeat_radio_week: "Týždenne", repeat_radio_month: "Mesaène", repeat_radio_year: "Roène", repeat_radio_day_type: "Každý", repeat_text_day_count: "deò", repeat_radio_day_type2: "Každý prac. deò", repeat_week: "Opakova každý", repeat_text_week_count: "týždeò v dòoch:", repeat_radio_month_type: "Opakova", repeat_radio_month_start: "On", repeat_text_month_day: "deò každý", repeat_text_month_count: "mesiac", repeat_text_month_count2_before: "každý", repeat_text_month_count2_after: "mesiac", repeat_year_label: "On", select_year_day2: "poèas", repeat_text_year_day: "deò", select_year_month: "mesiac", repeat_radio_end: "Bez dátumu ukonèenia", repeat_text_occurences_count: "udalostiach", repeat_radio_end3: "Ukonèi", repeat_radio_end2: "Po", repeat_never: "Nikdy", repeat_daily: "Každý deň", repeat_workdays: "Každý pracovný deň", repeat_weekly: "Každý týždeň", repeat_monthly: "Každý mesiac", repeat_yearly: "Každý rok", repeat_custom: "Vlastné", repeat_freq_day: "Deň", repeat_freq_week: "Týždeň", repeat_freq_month: "Mesiac", repeat_freq_year: "Rok", repeat_on_date: "Na dátum", repeat_ends: "Koniec", month_for_recurring: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"], day_for_recurring: ["Nede¾a", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"] } }, dn = { date: { month_full: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"], day_short: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"] }, labels: { dhx_cal_today_button: "Idag", day_tab: "Dag", week_tab: "Vecka", month_tab: "Månad", new_event: "Ny händelse", icon_save: "Spara", icon_cancel: "Ångra", icon_details: "Detaljer", icon_edit: "Ändra", icon_delete: "Ta bort", confirm_closing: "", confirm_deleting: "Är du säker på att du vill ta bort händelsen permanent?", section_description: "Beskrivning", section_time: "Tid", full_day: "Hela dagen", confirm_recurring: "Vill du redigera hela serien med repeterande händelser?", section_recurring: "Upprepa händelse", button_recurring: "Inaktiverat", button_recurring_open: "Aktiverat", button_edit_series: "Redigera serien", button_edit_occurrence: "Redigera en kopia", agenda_tab: "Dagordning", date: "Datum", description: "Beskrivning", year_tab: "År", week_agenda_tab: "Dagordning", grid_tab: "Galler", drag_to_create: "Dra för att skapa ny", drag_to_move: "Dra för att flytta", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Dagligen", repeat_radio_week: "Veckovis", repeat_radio_month: "Månadsvis", repeat_radio_year: "Årligen", repeat_radio_day_type: "Var", repeat_text_day_count: "dag", repeat_radio_day_type2: "Varje arbetsdag", repeat_week: " Upprepa var", repeat_text_week_count: "vecka dessa dagar:", repeat_radio_month_type: "Upprepa", repeat_radio_month_start: "Den", repeat_text_month_day: "dagen var", repeat_text_month_count: "månad", repeat_text_month_count2_before: "var", repeat_text_month_count2_after: "månad", repeat_year_label: "Den", select_year_day2: "i", repeat_text_year_day: "dag i", select_year_month: "månad", repeat_radio_end: "Inget slutdatum", repeat_text_occurences_count: "upprepningar", repeat_radio_end3: "Sluta efter", repeat_radio_end2: "Efter", repeat_never: "Aldrig", repeat_daily: "Varje dag", repeat_workdays: "Varje vardag", repeat_weekly: "Varje vecka", repeat_monthly: "Varje månad", repeat_yearly: "Varje år", repeat_custom: "Anpassad", repeat_freq_day: "Dag", repeat_freq_week: "Vecka", repeat_freq_month: "Månad", repeat_freq_year: "År", repeat_on_date: "På datum", repeat_ends: "Slutar", month_for_recurring: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"], day_for_recurring: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"] } }, ln = { date: { month_full: ["Ocak", "Þubat", "Mart", "Nisan", "Mayýs", "Haziran", "Temmuz", "Aðustos", "Eylül", "Ekim", "Kasým", "Aralýk"], month_short: ["Oca", "Þub", "Mar", "Nis", "May", "Haz", "Tem", "Aðu", "Eyl", "Eki", "Kas", "Ara"], day_full: ["Pazar", "Pazartes,", "Salý", "Çarþamba", "Perþembe", "Cuma", "Cumartesi"], day_short: ["Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cts"] }, labels: { dhx_cal_today_button: "Bugün", day_tab: "Gün", week_tab: "Hafta", month_tab: "Ay", new_event: "Uygun", icon_save: "Kaydet", icon_cancel: "Ýptal", icon_details: "Detaylar", icon_edit: "Düzenle", icon_delete: "Sil", confirm_closing: "", confirm_deleting: "Etkinlik silinecek, devam?", section_description: "Açýklama", section_time: "Zaman aralýðý", full_day: "Tam gün", confirm_recurring: "Tüm tekrar eden etkinlikler silinecek, devam?", section_recurring: "Etkinliði tekrarla", button_recurring: "Pasif", button_recurring_open: "Aktif", button_edit_series: "Dizi düzenleme", button_edit_occurrence: "Bir kopyasını düzenleyin", agenda_tab: "Ajanda", date: "Tarih", description: "Açýklama", year_tab: "Yýl", week_agenda_tab: "Ajanda", grid_tab: "Izgara", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Günlük", repeat_radio_week: "Haftalık", repeat_radio_month: "Aylık", repeat_radio_year: "Yıllık", repeat_radio_day_type: "Her", repeat_text_day_count: "gün", repeat_radio_day_type2: "Her iş günü", repeat_week: " Tekrar her", repeat_text_week_count: "hafta şu günlerde:", repeat_radio_month_type: "Tekrar et", repeat_radio_month_start: "Tarihinde", repeat_text_month_day: "gün her", repeat_text_month_count: "ay", repeat_text_month_count2_before: "her", repeat_text_month_count2_after: "ay", repeat_year_label: "Tarihinde", select_year_day2: "ayın", repeat_text_year_day: "günü", select_year_month: "ay", repeat_radio_end: "Bitiş tarihi yok", repeat_text_occurences_count: "olay", repeat_radio_end2: "Sonra", repeat_radio_end3: "Tarihinde bitir", repeat_never: "Asla", repeat_daily: "Her gün", repeat_workdays: "Her iş günü", repeat_weekly: "Her hafta", repeat_monthly: "Her ay", repeat_yearly: "Her yıl", repeat_custom: "Özel", repeat_freq_day: "Gün", repeat_freq_week: "Hafta", repeat_freq_month: "Ay", repeat_freq_year: "Yıl", repeat_on_date: "Tarihinde", repeat_ends: "Biter", month_for_recurring: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"], day_for_recurring: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"] } }, cn = { date: { month_full: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"], month_short: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"], day_full: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"], day_short: ["Нед", "Пон", "Вів", "Сер", "Чет", "Птн", "Суб"] }, labels: { dhx_cal_today_button: "Сьогодні", day_tab: "День", week_tab: "Тиждень", month_tab: "Місяць", new_event: "Нова подія", icon_save: "Зберегти", icon_cancel: "Відміна", icon_details: "Деталі", icon_edit: "Редагувати", icon_delete: "Вилучити", confirm_closing: "", confirm_deleting: "Подія вилучиться назавжди. Ви впевнені?", section_description: "Опис", section_time: "Часовий проміжок", full_day: "Весь день", confirm_recurring: "Хочете редагувати весь перелік повторюваних подій?", section_recurring: "Повторювана подія", button_recurring: "Відключено", button_recurring_open: "Включено", button_edit_series: "Редагувати серію", button_edit_occurrence: "Редагувати примірник", agenda_tab: "Перелік", date: "Дата", description: "Опис", year_tab: "Рік", week_agenda_tab: "Перелік", grid_tab: "Таблиця", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "День", repeat_radio_week: "Тиждень", repeat_radio_month: "Місяць", repeat_radio_year: "Рік", repeat_radio_day_type: "Кожний", repeat_text_day_count: "день", repeat_radio_day_type2: "Кожний робочий день", repeat_week: " Повторювати кожен", repeat_text_week_count: "тиждень , по:", repeat_radio_month_type: "Повторювати", repeat_radio_month_start: "", repeat_text_month_day: " числа кожний ", repeat_text_month_count: "місяць", repeat_text_month_count2_before: "кожен ", repeat_text_month_count2_after: "місяць", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "день", select_year_month: "", repeat_radio_end: "Без дати закінчення", repeat_text_occurences_count: "повторень", repeat_radio_end3: "До ", repeat_radio_end2: "", repeat_never: "Ніколи", repeat_daily: "Щодня", repeat_workdays: "Щодня в робочі дні", repeat_weekly: "Щотижня", repeat_monthly: "Щомісяця", repeat_yearly: "Щороку", repeat_custom: "Налаштоване", repeat_freq_day: "День", repeat_freq_week: "Тиждень", repeat_freq_month: "Місяць", repeat_freq_year: "Рік", repeat_on_date: "На дату", repeat_ends: "Закінчується", month_for_recurring: ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"], day_for_recurring: ["Неділям", "Понеділкам", "Вівторкам", "Середам", "Четвергам", "П'ятницям", "Суботам"] } };
class hn {
  constructor(i, t, n = {}) {
    this.state = { date: /* @__PURE__ */ new Date(), modes: ["days", "months", "years"], currentRange: [], eventDates: [], currentModeIndex: 0, ...n }, this.container = null, this.element = null, this.onStateChangeHandlers = [], this.scheduler = i, this._domEvents = i._createDomEventScope(), this.state = this.getState(), nt(this), t && (this.container = t, this.render(this.container)), this.onStateChange((s, r) => {
      this.callEvent("onStateChange", [r, s]);
    });
  }
  getState() {
    return { ...this.state, mode: this.state.modes[this.state.currentModeIndex] };
  }
  setState(i) {
    const t = { ...this.state };
    i.mode && (i.currentModeIndex = this.state.modes.indexOf(i.mode)), this.state = { ...this.state, ...i }, this._notifyStateChange(t, this.state), this.container && this.render(this.container);
  }
  onStateChange(i) {
    return this.onStateChangeHandlers.push(i), () => {
      const t = this.onStateChangeHandlers.indexOf(i);
      t !== -1 && this.onStateChangeHandlers.splice(t, 1);
    };
  }
  _notifyStateChange(i, t) {
    this.onStateChangeHandlers.forEach((n) => n(i, t));
  }
  _adjustDate(i) {
    const { mode: t, date: n } = this.getState(), s = new Date(n);
    t === "days" ? s.setMonth(n.getMonth() + i) : t === "months" ? s.setFullYear(n.getFullYear() + i) : s.setFullYear(n.getFullYear() + 10 * i), this.setState({ date: s });
  }
  _toggleMode() {
    const i = (this.state.currentModeIndex + 1) % this.state.modes.length;
    this.setState({ currentModeIndex: i });
  }
  _renderCalendarHeader(i) {
    const { mode: t, date: n } = this.getState(), s = document.createElement("div");
    s.classList.add("dhx_cal_datepicker_header");
    const r = document.createElement("button");
    r.classList.add("dhx_cal_datepicker_arrow", "scheduler_icon", "arrow_left"), s.appendChild(r);
    const _ = document.createElement("div");
    if (_.classList.add("dhx_cal_datepicker_title"), t === "days")
      _.innerText = n.toLocaleString("default", { month: "long" }) + " " + n.getFullYear();
    else if (t === "months")
      _.innerText = n.getFullYear();
    else {
      const a = 10 * Math.floor(n.getFullYear() / 10);
      _.innerText = `${a} - ${a + 9}`;
    }
    this._domEvents.attach(_, "click", this._toggleMode.bind(this)), s.appendChild(_);
    const d = document.createElement("button");
    d.classList.add("dhx_cal_datepicker_arrow", "scheduler_icon", "arrow_right"), s.appendChild(d), i.appendChild(s), this._domEvents.attach(r, "click", this._adjustDate.bind(this, -1)), this._domEvents.attach(d, "click", this._adjustDate.bind(this, 1));
  }
  render(i) {
    this._domEvents.detachAll(), this.container = i || this.container, this.container.innerHTML = "", this.element || (this.element = document.createElement("div"), this.element.classList.add("dhx_cal_datepicker")), this.element.innerHTML = "", this.container.appendChild(this.element), this._renderCalendarHeader(this.element);
    const t = document.createElement("div");
    t.classList.add("dhx_cal_datepicker_data"), this.element.appendChild(t);
    const { mode: n } = this.getState();
    n === "days" ? this._renderDayGrid(t) : n === "months" ? this._renderMonthGrid(t) : this._renderYearGrid(t);
  }
  _renderDayGridHeader(i) {
    const { date: t } = this.getState(), n = this.scheduler;
    let s = n.date.week_start(new Date(t));
    const r = n.date.add(n.date.week_start(new Date(t)), 1, "week");
    i.classList.add("dhx_cal_datepicker_days");
    const _ = n.date.date_to_str("%D");
    for (; s.valueOf() < r.valueOf(); ) {
      const d = _(s), a = document.createElement("div");
      a.setAttribute("data-day", s.getDay()), a.classList.add("dhx_cal_datepicker_dayname"), a.innerText = d, i.appendChild(a), s = n.date.add(s, 1, "day");
    }
  }
  _weeksBetween(i, t) {
    const n = this.scheduler;
    let s = 0, r = new Date(i);
    for (; r.valueOf() < t.valueOf(); )
      s += 1, r = n.date.week_start(n.date.add(r, 1, "week"));
    return s;
  }
  _renderDayGrid(i) {
    const { date: t, currentRange: n, eventDates: s, minWeeks: r } = this.getState();
    let _ = n[0], d = n[1];
    const a = s.reduce((g, b) => (g[this.scheduler.date.day_start(new Date(b)).valueOf()] = !0, g), {}), o = document.createElement("div");
    this._renderDayGridHeader(o), i.appendChild(o);
    const l = this.scheduler, h = l.date.week_start(l.date.month_start(new Date(t))), y = l.date.month_start(new Date(t)), m = l.date.add(l.date.month_start(new Date(t)), 1, "month");
    let f = l.date.add(l.date.month_start(new Date(t)), 1, "month");
    const u = l.date.date_part(l._currentDate());
    f.getDay() !== 0 && (f = l.date.add(l.date.week_start(f), 1, "week"));
    let v = this._weeksBetween(h, f);
    r && v < r && (f = l.date.add(f, r - v, "week"));
    let c = h;
    const p = document.createElement("div");
    for (p.classList.add("dhx_cal_datepicker_days"), this._domEvents.attach(p, "click", (g) => {
      const b = g.target.closest("[data-cell-date]"), x = new Date(b.getAttribute("data-cell-date"));
      this.callEvent("onDateClick", [x, g]);
    }); c.valueOf() < f.valueOf(); ) {
      const g = document.createElement("div");
      g.setAttribute("data-cell-date", l.templates.format_date(c)), g.setAttribute("data-day", c.getDay()), g.innerHTML = c.getDate(), c.valueOf() < y.valueOf() ? g.classList.add("dhx_before") : c.valueOf() >= m.valueOf() && g.classList.add("dhx_after"), c.getDay() !== 0 && c.getDay() !== 6 || g.classList.add("dhx_cal_datepicker_weekend"), c.valueOf() == u.valueOf() && g.classList.add("dhx_now"), _ && d && c.valueOf() >= _.valueOf() && c.valueOf() < d.valueOf() && g.classList.add("dhx_cal_datepicker_current"), a[c.valueOf()] && g.classList.add("dhx_cal_datepicker_event"), g.classList.add("dhx_cal_datepicker_date"), p.appendChild(g), c = l.date.add(c, 1, "day");
    }
    i.appendChild(p);
  }
  _renderMonthGrid(i) {
    const { date: t } = this.getState(), n = document.createElement("div");
    n.classList.add("dhx_cal_datepicker_months");
    const s = [];
    for (let a = 0; a < 12; a++)
      s.push(new Date(t.getFullYear(), a, 1));
    const r = this.scheduler.date.date_to_str("%M");
    s.forEach((a) => {
      const o = document.createElement("div");
      o.classList.add("dhx_cal_datepicker_month"), t.getMonth() === a.getMonth() && o.classList.add("dhx_cal_datepicker_current"), o.setAttribute("data-month", a.getMonth()), o.innerHTML = r(a), this._domEvents.attach(o, "click", () => {
        const l = new Date(a);
        this.setState({ date: l, mode: "days" });
      }), n.appendChild(o);
    }), i.appendChild(n);
    const _ = document.createElement("div");
    _.classList.add("dhx_cal_datepicker_done");
    const d = document.createElement("button");
    d.innerText = "Done", d.classList.add("dhx_cal_datepicker_done_btn"), this._domEvents.attach(d, "click", () => {
      this.setState({ mode: "days" });
    }), _.appendChild(d), i.appendChild(_);
  }
  _renderYearGrid(i) {
    const { date: t } = this.getState(), n = 10 * Math.floor(t.getFullYear() / 10), s = document.createElement("div");
    s.classList.add("dhx_cal_datepicker_years");
    for (let d = n - 1; d <= n + 10; d++) {
      const a = document.createElement("div");
      a.innerText = d, a.classList.add("dhx_cal_datepicker_year"), a.setAttribute("data-year", d), t.getFullYear() === d && a.classList.add("dhx_cal_datepicker_current"), this._domEvents.attach(a, "click", () => {
        this.setState({ date: new Date(d, t.getMonth(), 1), mode: "months" });
      }), s.appendChild(a);
    }
    i.appendChild(s);
    const r = document.createElement("div");
    r.classList.add("dhx_cal_datepicker_done");
    const _ = document.createElement("button");
    _.innerText = "Done", _.classList.add("dhx_cal_datepicker_done_btn"), this._domEvents.attach(_, "click", () => {
      this.setState({ mode: "months" });
    }), r.appendChild(_), i.appendChild(r);
  }
  destructor() {
    this.onStateChangeHandlers = [], this.element && (this.element.innerHTML = "", this.element.remove()), this._domEvents.detachAll(), this.callEvent("onDestroy", []), this.detachAllEvents(), this.scheduler = null;
  }
}
function un(e) {
  const i = { version: "7.1.0" };
  i.$stateProvider = function() {
    const a = {};
    return { getState: function(o) {
      if (a[o])
        return a[o].method();
      {
        const l = {};
        for (const h in a)
          a[h].internal || ge.mixin(l, a[h].method(), !0);
        return l;
      }
    }, registerProvider: function(o, l, h) {
      a[o] = { method: l, internal: h };
    }, unregisterProvider: function(o) {
      delete a[o];
    } };
  }(), i.getState = i.$stateProvider.getState, function(a) {
    var o = { agenda: "https://docs.dhtmlx.com/scheduler/agenda_view.html", grid: "https://docs.dhtmlx.com/scheduler/grid_view.html", map: "https://docs.dhtmlx.com/scheduler/map_view.html", unit: "https://docs.dhtmlx.com/scheduler/units_view.html", timeline: "https://docs.dhtmlx.com/scheduler/timeline_view.html", week_agenda: "https://docs.dhtmlx.com/scheduler/weekagenda_view.html", year: "https://docs.dhtmlx.com/scheduler/year_view.html", anythingElse: "https://docs.dhtmlx.com/scheduler/views.html" }, l = { agenda: "ext/dhtmlxscheduler_agenda_view.js", grid: "ext/dhtmlxscheduler_grid_view.js", map: "ext/dhtmlxscheduler_map_view.js", unit: "ext/dhtmlxscheduler_units.js", timeline: "ext/dhtmlxscheduler_timeline.js, ext/dhtmlxscheduler_treetimeline.js, ext/dhtmlxscheduler_daytimeline.js", week_agenda: "ext/dhtmlxscheduler_week_agenda.js", year: "ext/dhtmlxscheduler_year_view.js", limit: "ext/dhtmlxscheduler_limit.js" };
    a._commonErrorMessages = { unknownView: function(h) {
      var y = l[h] ? "You're probably missing " + l[h] + "." : "";
      return "`" + h + "` view is not defined. \nPlease check parameters you pass to `scheduler.init` or `scheduler.setCurrentView` in your code and ensure you've imported appropriate extensions. \nRelated docs: " + (o[h] || o.anythingElse) + `
` + (y ? y + `
` : "");
    }, collapsedContainer: function(h) {
      return `Scheduler container height is set to *100%* but the rendered height is zero and the scheduler is not visible. 
Make sure that the container has some initial height or use different units. For example:
<div id='scheduler_here' class='dhx_cal_container' style='width:100%; height:600px;'> 
`;
    } }, a.createTimelineView = function() {
      throw new Error("scheduler.createTimelineView is not implemented. Be sure to add the required extension: " + l.timeline + `
Related docs: ` + o.timeline);
    }, a.createUnitsView = function() {
      throw new Error("scheduler.createUnitsView is not implemented. Be sure to add the required extension: " + l.unit + `
Related docs: ` + o.unit);
    }, a.createGridView = function() {
      throw new Error("scheduler.createGridView is not implemented. Be sure to add the required extension: " + l.grid + `
Related docs: ` + o.grid);
    }, a.addMarkedTimespan = function() {
      throw new Error(`scheduler.addMarkedTimespan is not implemented. Be sure to add the required extension: ext/dhtmlxscheduler_limit.js
Related docs: https://docs.dhtmlx.com/scheduler/limits.html`);
    }, a.renderCalendar = function() {
      throw new Error(`scheduler.renderCalendar is not implemented. Be sure to add the required extension: ext/dhtmlxscheduler_minical.js
https://docs.dhtmlx.com/scheduler/minicalendar.html`);
    }, a.exportToPNG = function() {
      throw new Error(["scheduler.exportToPNG is not implemented.", "This feature requires an additional module, be sure to check the related doc here https://docs.dhtmlx.com/scheduler/png.html", "Licensing info: https://dhtmlx.com/docs/products/dhtmlxScheduler/export.shtml"].join(`
`));
    }, a.exportToPDF = function() {
      throw new Error(["scheduler.exportToPDF is not implemented.", "This feature requires an additional module, be sure to check the related doc here https://docs.dhtmlx.com/scheduler/pdf.html", "Licensing info: https://dhtmlx.com/docs/products/dhtmlxScheduler/export.shtml"].join(`
`));
    };
  }(i), wa(i), function(a) {
    nt(a), ga(a), a._detachDomEvent = function(u, v, c) {
      u.removeEventListener ? u.removeEventListener(v, c, !1) : u.detachEvent && u.detachEvent("on" + v, c);
    }, a._init_once = function() {
      ya(a), a._init_once = function() {
      };
    };
    const o = { render: function(u) {
      return a._init_nav_bar(u);
    } }, l = { render: function(u) {
      const v = document.createElement("div");
      return v.className = "dhx_cal_header", v;
    } }, h = { render: function(u) {
      const v = document.createElement("div");
      return v.className = "dhx_cal_data", v;
    } };
    function y(u) {
      return !!(u.querySelector(".dhx_cal_header") && u.querySelector(".dhx_cal_data") && u.querySelector(".dhx_cal_navline"));
    }
    a.init = function(u, v, c) {
      if (!this.$destroyed) {
        if (v = v || a._currentDate(), c = c || "week", this._obj && this.unset_actions(), this._obj = typeof u == "string" ? document.getElementById(u) : u, this.$container = this._obj, this.$root = this._obj, !this.$container.offsetHeight && this.$container.offsetWidth && this.$container.style.height === "100%" && window.console.error(a._commonErrorMessages.collapsedContainer(), this.$container), this.config.wai_aria_attributes && this.config.wai_aria_application_role && this.$container.setAttribute("role", "application"), this.config.header || y(this.$container) || (this.config.header = function(p) {
          const g = ["day", "week", "month"];
          if (p.matrix)
            for (const b in p.matrix)
              g.push(b);
          if (p._props)
            for (const b in p._props)
              g.push(b);
          if (p._grid && p._grid.names)
            for (const b in p._grid.names)
              g.push(b);
          return ["map", "agenda", "week_agenda", "year"].forEach(function(b) {
            p[b + "_view"] && g.push(b);
          }), g.concat(["date"]).concat(["prev", "today", "next"]);
        }(this), window.console.log(["Required DOM elements are missing from the scheduler container and **scheduler.config.header** is not specified.", "Using a default header configuration: ", "scheduler.config.header = " + JSON.stringify(this.config.header, null, 2), "Check this article for the details: https://docs.dhtmlx.com/scheduler/initialization.html"].join(`
`))), this.config.header)
          this.$container.innerHTML = "", this.$container.classList.add("dhx_cal_container"), this.config.header.height && (this.xy.nav_height = this.config.header.height), this.$container.appendChild(o.render(this.config.header)), this.$container.appendChild(l.render()), this.$container.appendChild(h.render());
        else if (!y(this.$container))
          throw new Error(["Required DOM elements are missing from the scheduler container.", "Be sure to either specify them manually in the markup: https://docs.dhtmlx.com/scheduler/initialization.html#initializingschedulerviamarkup", "Or to use **scheduler.config.header** setting so they could be created automatically: https://docs.dhtmlx.com/scheduler/initialization.html#initializingschedulerviaheaderconfig"].join(`
`));
        this.config.rtl && (this.$container.className += " dhx_cal_container_rtl"), this._skin_init && a._skin_init(), a.date.init(), this._scroll = !0, this._els = [], this.get_elements(), this.init_templates(), this.set_actions(), this._init_once(), this._init_touch_events(), this.set_sizes(), a.callEvent("onSchedulerReady", []), a.$initialized = !0, this.setCurrentView(v, c);
      }
    }, a.xy = { min_event_height: 20, bar_height: 24, scale_width: 50, scroll_width: 18, scale_height: 20, month_scale_height: 20, menu_width: 25, margin_top: 0, margin_left: 0, editor_width: 140, month_head_height: 22, event_header_height: 14 }, a.keys = { edit_save: 13, edit_cancel: 27 }, a.bind = function(u, v) {
      return u.bind ? u.bind(v) : function() {
        return u.apply(v, arguments);
      };
    }, a.set_sizes = function() {
      var u = this._x = this._obj.clientWidth - this.xy.margin_left, v = this._table_view ? 0 : this.xy.scale_width + this.xy.scroll_width, c = this.$container.querySelector(".dhx_cal_scale_placeholder");
      a._is_material_skin() ? (c || ((c = document.createElement("div")).className = "dhx_cal_scale_placeholder", this.$container.insertBefore(c, this._els.dhx_cal_header[0])), c.style.display = "block", this.set_xy(c, u, this.xy.scale_height + 1, 0, this._els.dhx_cal_header[0].offsetTop)) : c && c.parentNode.removeChild(c), this._lightbox && (a.$container.offsetWidth < 1200 || this._setLbPosition(document.querySelector(".dhx_cal_light"))), this._data_width = u - v, this._els.dhx_cal_navline[0].style.width = u + "px";
      const p = this._els.dhx_cal_header[0];
      this.set_xy(p, this._data_width, this.xy.scale_height), p.style.left = "", p.style.right = "", this._table_view ? this.config.rtl ? p.style.right = "-1px" : p.style.left = "-1px" : this.config.rtl ? p.style.right = `${this.xy.scale_width}px` : p.style.left = `${this.xy.scale_width}px`;
    }, a.set_xy = function(u, v, c, p, g) {
      function b(k) {
        let w = k;
        return isNaN(Number(w)) || (w = Math.max(0, w) + "px"), w;
      }
      var x = "left";
      v !== void 0 && (u.style.width = b(v)), c !== void 0 && (u.style.height = b(c)), arguments.length > 3 && (p !== void 0 && (this.config.rtl && (x = "right"), u.style[x] = p + "px"), g !== void 0 && (u.style.top = g + "px"));
    }, a.get_elements = function() {
      const u = this._obj.getElementsByTagName("DIV");
      for (let v = 0; v < u.length; v++) {
        let c = a._getClassName(u[v]);
        const p = u[v].getAttribute("data-tab") || u[v].getAttribute("name") || "";
        c && (c = c.split(" ")[0]), this._els[c] || (this._els[c] = []), this._els[c].push(u[v]);
        let g = a.locale.labels[p + "_tab"] || a.locale.labels[p || c];
        typeof g != "string" && p && !u[v].innerHTML && (g = p.split("_")[0]), g && (this._waiAria.labelAttr(u[v], g), u[v].innerHTML = g);
      }
    };
    const m = a._createDomEventScope();
    function f(u, v) {
      const c = new Date(u), p = (new Date(v).getTime() - c.getTime()) / 864e5;
      return Math.abs(p);
    }
    a.unset_actions = function() {
      m.detachAll();
    }, a.set_actions = function() {
      for (const u in this._els)
        if (this._click[u])
          for (let v = 0; v < this._els[u].length; v++) {
            const c = this._els[u][v], p = this._click[u].bind(c);
            m.attach(c, "click", p);
          }
      m.attach(this._obj, "selectstart", function(u) {
        return u.preventDefault(), !1;
      }), m.attach(this._obj, "mousemove", function(u) {
        a._temp_touch_block || a._on_mouse_move(u);
      }), m.attach(this._obj, "mousedown", function(u) {
        a._ignore_next_click || a._on_mouse_down(u);
      }), m.attach(this._obj, "mouseup", function(u) {
        a._ignore_next_click || a._on_mouse_up(u);
      }), m.attach(this._obj, "dblclick", function(u) {
        a._on_dbl_click(u);
      }), m.attach(this._obj, "contextmenu", function(u) {
        return a.checkEvent("onContextMenu") && u.preventDefault(), a.callEvent("onContextMenu", [a._locate_event(u.target), u]);
      });
    }, a.select = function(u) {
      this._select_id != u && (a._close_not_saved(), this.editStop(!1), this._select_id && this.unselect(), this._select_id = u, this.updateEvent(u), this.callEvent("onEventSelected", [u]));
    }, a.unselect = function(u) {
      if (u && u != this._select_id)
        return;
      const v = this._select_id;
      this._select_id = null, v && this.getEvent(v) && this.updateEvent(v), this.callEvent("onEventUnselected", [v]);
    }, a.$stateProvider.registerProvider("global", (function() {
      return { mode: this._mode, date: new Date(this._date), min_date: new Date(this._min_date), max_date: new Date(this._max_date), editor_id: this._edit_id, lightbox_id: this._lightbox_id, new_event: this._new_event, select_id: this._select_id, expanded: this.expanded, drag_id: this._drag_id, drag_mode: this._drag_mode };
    }).bind(a)), a._click = { dhx_cal_data: function(u) {
      if (a._ignore_next_click)
        return u.preventDefault && u.preventDefault(), u.cancelBubble = !0, a._ignore_next_click = !1, !1;
      const v = a._locate_event(u.target);
      if (v) {
        if (!a.callEvent("onClick", [v, u]) || a.config.readonly)
          return;
      } else
        a.callEvent("onEmptyClick", [a.getActionData(u).date, u]);
      if (v && a.config.select) {
        a.select(v);
        const c = u.target.closest(".dhx_menu_icon"), p = a._getClassName(c);
        p.indexOf("_icon") != -1 && a._click.buttons[p.split(" ")[1].replace("icon_", "")](v);
      } else
        a._close_not_saved(), a.getState().select_id && (/* @__PURE__ */ new Date()).valueOf() - (a._new_event || 0) > 500 && a.unselect();
    }, dhx_cal_prev_button: function() {
      a._click.dhx_cal_next_button(0, -1);
    }, dhx_cal_next_button: function(u, v) {
      let c = 1;
      a.config.rtl && (v = -v, c = -c), a.setCurrentView(a.date.add(a.date[a._mode + "_start"](new Date(a._date)), v || c, a._mode));
    }, dhx_cal_today_button: function() {
      a.callEvent("onBeforeTodayDisplayed", []) && a.setCurrentView(a._currentDate());
    }, dhx_cal_tab: function() {
      const u = this.getAttribute("data-tab"), v = this.getAttribute("name"), c = u || v.substring(0, v.search("_tab"));
      a.setCurrentView(a._date, c);
    }, buttons: { delete: function(u) {
      const v = a.locale.labels.confirm_deleting;
      a._dhtmlx_confirm({ message: v, title: a.locale.labels.title_confirm_deleting, callback: function() {
        a.deleteEvent(u);
      }, config: { ok: a.locale.labels.icon_delete } });
    }, edit: function(u) {
      a.edit(u);
    }, save: function(u) {
      a.editStop(!0);
    }, details: function(u) {
      a.showLightbox(u);
    }, form: function(u) {
      a.showLightbox(u);
    }, cancel: function(u) {
      a.editStop(!1);
    } } }, a._dhtmlx_confirm = function({ message: u, title: v, callback: c, config: p }) {
      if (!u)
        return c();
      p = p || {};
      const g = { ...p, text: u };
      v && (g.title = v), c && (g.callback = function(b) {
        b && c();
      }), a.confirm(g);
    }, a.addEventNow = function(u, v, c) {
      let p = {};
      a._isObject(u) && !a._isDate(u) && (p = u, u = null);
      const g = 6e4 * (this.config.event_duration || this.config.time_step);
      u || (u = p.start_date || Math.round(a._currentDate().valueOf() / g) * g);
      let b = new Date(u);
      if (!v) {
        let w = this.config.first_hour;
        w > b.getHours() && (b.setHours(w), u = b.valueOf()), v = u.valueOf() + g;
      }
      let x = new Date(v);
      b.valueOf() == x.valueOf() && x.setTime(x.valueOf() + g), p.start_date = p.start_date || b, p.end_date = p.end_date || x, p.text = p.text || this.locale.labels.new_event, p.id = this._drag_id = p.id || this.uid(), this._drag_mode = "new-size", this._loading = !0;
      const k = this.addEvent(p);
      return this.callEvent("onEventCreated", [this._drag_id, c]), this._loading = !1, this._drag_event = {}, this._on_mouse_up(c), k;
    }, a._on_dbl_click = function(u, v) {
      if (v = v || u.target, this.config.readonly)
        return;
      const c = a._getClassName(v).split(" ")[0];
      switch (c) {
        case "dhx_scale_holder":
        case "dhx_scale_holder_now":
        case "dhx_month_body":
        case "dhx_wa_day_data":
          if (!a.config.dblclick_create)
            break;
          this.addEventNow(this.getActionData(u).date, null, u);
          break;
        case "dhx_cal_event":
        case "dhx_wa_ev_body":
        case "dhx_agenda_line":
        case "dhx_cal_agenda_event_line":
        case "dhx_grid_event":
        case "dhx_cal_event_line":
        case "dhx_cal_event_clear": {
          const p = this._locate_event(v);
          if (!this.callEvent("onDblClick", [p, u]))
            return;
          this.config.details_on_dblclick || this._table_view || !this.getEvent(p)._timed || !this.config.select ? this.showLightbox(p) : this.edit(p);
          break;
        }
        case "dhx_time_block":
        case "dhx_cal_container":
          return;
        default: {
          const p = this["dblclick_" + c];
          if (p)
            p.call(this, u);
          else if (v.parentNode && v != this)
            return a._on_dbl_click(u, v.parentNode);
          break;
        }
      }
    }, a._get_column_index = function(u) {
      let v = 0;
      if (this._cols) {
        let c = 0, p = 0;
        for (; c + this._cols[p] < u && p < this._cols.length; )
          c += this._cols[p], p++;
        if (v = p + (this._cols[p] ? (u - c) / this._cols[p] : 0), this._ignores && v >= this._cols.length)
          for (; v >= 1 && this._ignores[Math.floor(v)]; )
            v--;
      }
      return v;
    }, a._week_indexes_from_pos = function(u) {
      if (this._cols) {
        const v = this._get_column_index(u.x);
        return u.x = Math.min(this._cols.length - 1, Math.max(0, Math.ceil(v) - 1)), u.y = Math.max(0, Math.ceil(60 * u.y / (this.config.time_step * this.config.hour_size_px)) - 1) + this.config.first_hour * (60 / this.config.time_step), u;
      }
      return u;
    }, a._mouse_coords = function(u) {
      let v;
      const c = document.body, p = document.documentElement;
      v = this.$env.isIE || !u.pageX && !u.pageY ? { x: u.clientX + (c.scrollLeft || p.scrollLeft || 0) - c.clientLeft, y: u.clientY + (c.scrollTop || p.scrollTop || 0) - c.clientTop } : { x: u.pageX, y: u.pageY }, this.config.rtl && this._colsS ? (v.x = this.$container.querySelector(".dhx_cal_data").offsetWidth - v.x, v.x += this.$domHelpers.getAbsoluteLeft(this._obj), this._mode !== "month" && (v.x -= this.xy.scale_width)) : v.x -= this.$domHelpers.getAbsoluteLeft(this._obj) + (this._table_view ? 0 : this.xy.scale_width);
      const g = this.$container.querySelector(".dhx_cal_data");
      v.y -= this.$domHelpers.getAbsoluteTop(g) - this._els.dhx_cal_data[0].scrollTop, v.ev = u;
      const b = this["mouse_" + this._mode];
      if (b)
        v = b.call(this, v);
      else if (this._table_view) {
        const x = this._get_column_index(v.x);
        if (!this._cols || !this._colsS)
          return v;
        let k = 0;
        for (k = 1; k < this._colsS.heights.length && !(this._colsS.heights[k] > v.y); k++)
          ;
        v.y = Math.ceil(24 * (Math.max(0, x) + 7 * Math.max(0, k - 1)) * 60 / this.config.time_step), (a._drag_mode || this._mode == "month") && (v.y = 24 * (Math.max(0, Math.ceil(x) - 1) + 7 * Math.max(0, k - 1)) * 60 / this.config.time_step), this._drag_mode == "move" && a._ignores_detected && a.config.preserve_length && (v._ignores = !0, this._drag_event._event_length || (this._drag_event._event_length = this._get_real_event_length(this._drag_event.start_date, this._drag_event.end_date, { x_step: 1, x_unit: "day" }))), v.x = 0;
      } else
        v = this._week_indexes_from_pos(v);
      return v.timestamp = +/* @__PURE__ */ new Date(), v;
    }, a._close_not_saved = function() {
      if ((/* @__PURE__ */ new Date()).valueOf() - (a._new_event || 0) > 500 && a._edit_id) {
        const u = a.locale.labels.confirm_closing;
        a._dhtmlx_confirm({ message: u, title: a.locale.labels.title_confirm_closing, callback: function() {
          a.editStop(a.config.positive_closing);
        } }), u && (this._drag_id = this._drag_pos = this._drag_mode = null);
      }
    }, a._correct_shift = function(u, v) {
      return u - 6e4 * (new Date(a._min_date).getTimezoneOffset() - new Date(u).getTimezoneOffset()) * (v ? -1 : 1);
    }, a._is_pos_changed = function(u, v) {
      function c(p, g, b) {
        return Math.abs(p - g) > b;
      }
      return !u || !this._drag_pos || !!(this._drag_pos.has_moved || !this._drag_pos.timestamp || v.timestamp - this._drag_pos.timestamp > 100 || c(u.ev.clientX, v.ev.clientX, 5) || c(u.ev.clientY, v.ev.clientY, 5));
    }, a._correct_drag_start_date = function(u) {
      let v;
      a.matrix && (v = a.matrix[a._mode]), v = v || { x_step: 1, x_unit: "day" }, u = new Date(u);
      let c = 1;
      return (v._start_correction || v._end_correction) && (c = 60 * (v.last_hour || 0) - (60 * u.getHours() + u.getMinutes()) || 1), 1 * u + (a._get_fictional_event_length(u, c, v) - c);
    }, a._correct_drag_end_date = function(u, v) {
      let c;
      a.matrix && (c = a.matrix[a._mode]), c = c || { x_step: 1, x_unit: "day" };
      const p = 1 * u + a._get_fictional_event_length(u, v, c);
      return new Date(1 * p - (a._get_fictional_event_length(p, -1, c, -1) + 1));
    }, a._on_mouse_move = function(u) {
      if (this._drag_mode) {
        var v = this._mouse_coords(u);
        if (this._is_pos_changed(this._drag_pos, v)) {
          var c, p;
          if (this._edit_id != this._drag_id && this._close_not_saved(), !this._drag_mode)
            return;
          var g = null;
          if (this._drag_pos && !this._drag_pos.has_moved && ((g = this._drag_pos).has_moved = !0), this._drag_pos = v, this._drag_pos.has_moved = !0, this._drag_mode == "create") {
            if (g && (v = g), this._close_not_saved(), this.unselect(this._select_id), this._loading = !0, c = this._get_date_from_pos(v).valueOf(), !this._drag_start)
              return this.callEvent("onBeforeEventCreated", [u, this._drag_id]) ? (this._loading = !1, void (this._drag_start = c)) : void (this._loading = !1);
            p = c, this._drag_start;
            var b = new Date(this._drag_start), x = new Date(p);
            this._mode != "day" && this._mode != "week" || b.getHours() != x.getHours() || b.getMinutes() != x.getMinutes() || (x = new Date(this._drag_start + 1e3)), this._drag_id = this.uid(), this.addEvent(b, x, this.locale.labels.new_event, this._drag_id, v.fields), this.callEvent("onEventCreated", [this._drag_id, u]), this._loading = !1, this._drag_mode = "new-size";
          }
          var k, w = this.config.time_step, E = this.getEvent(this._drag_id);
          if (a.matrix && (k = a.matrix[a._mode]), k = k || { x_step: 1, x_unit: "day" }, this._drag_mode == "move")
            c = this._min_date.valueOf() + 6e4 * (v.y * this.config.time_step + 24 * v.x * 60), !v.custom && this._table_view && (c += 1e3 * this.date.time_part(E.start_date)), !this._table_view && this._dragEventBody && this._drag_event._move_event_shift === void 0 && (this._drag_event._move_event_shift = c - E.start_date), this._drag_event._move_event_shift && (c -= this._drag_event._move_event_shift), c = this._correct_shift(c), v._ignores && this.config.preserve_length && this._table_view && k ? (c = a._correct_drag_start_date(c), p = a._correct_drag_end_date(c, this._drag_event._event_length)) : p = E.end_date.valueOf() - (E.start_date.valueOf() - c);
          else {
            if (c = E.start_date.valueOf(), p = E.end_date.valueOf(), this._table_view) {
              var D = this._min_date.valueOf() + v.y * this.config.time_step * 6e4 + (v.custom ? 0 : 864e5);
              if (this._mode == "month")
                if (D = this._correct_shift(D, !1), this._drag_from_start) {
                  var S = 864e5;
                  D <= a.date.date_part(new Date(p + S - 1)).valueOf() && (c = D - S);
                } else
                  p = D;
              else
                this.config.preserve_length ? v.resize_from_start ? c = a._correct_drag_start_date(D) : p = a._correct_drag_end_date(D, 0) : v.resize_from_start ? c = D : p = D;
            } else {
              var M = this.date.date_part(new Date(E.end_date.valueOf() - 1)).valueOf(), N = new Date(M), T = this.config.first_hour, A = 60 / w * (this.config.last_hour - T);
              this.config.time_step = 1;
              var C = this._mouse_coords(u);
              this.config.time_step = w;
              var H = v.y * w * 6e4, O = Math.min(v.y + 1, A) * w * 6e4, $ = 6e4 * C.y;
              p = Math.abs(H - $) > Math.abs(O - $) ? M + O : M + H, p += 6e4 * (new Date(p).getTimezoneOffset() - N.getTimezoneOffset()), this._els.dhx_cal_data[0].style.cursor = "s-resize", this._mode != "week" && this._mode != "day" || (p = this._correct_shift(p));
            }
            if (this._drag_mode == "new-size")
              if (p <= this._drag_start) {
                var R = v.shift || (this._table_view && !v.custom ? 864e5 : 0);
                c = p - (v.shift ? 0 : R), p = this._drag_start + (R || 6e4 * w);
              } else
                c = this._drag_start;
            else
              p <= c && (p = c + 6e4 * w);
          }
          var j = new Date(p - 1), I = new Date(c);
          if (this._drag_mode == "move" && a.config.limit_drag_out && (+I < +a._min_date || +p > +a._max_date)) {
            if (+E.start_date < +a._min_date || +E.end_date > +a._max_date)
              I = new Date(E.start_date), p = new Date(E.end_date);
            else {
              var Y = p - I;
              +I < +a._min_date ? (I = new Date(a._min_date), v._ignores && this.config.preserve_length && this._table_view ? (I = new Date(a._correct_drag_start_date(I)), k._start_correction && (I = new Date(I.valueOf() + k._start_correction)), p = new Date(1 * I + this._get_fictional_event_length(I, this._drag_event._event_length, k))) : p = new Date(+I + Y)) : (p = new Date(a._max_date), v._ignores && this.config.preserve_length && this._table_view ? (k._end_correction && (p = new Date(p.valueOf() - k._end_correction)), p = new Date(1 * p - this._get_fictional_event_length(p, 0, k, !0)), I = new Date(1 * p - this._get_fictional_event_length(p, this._drag_event._event_length, k, !0)), this._ignores_detected && (I = a.date.add(I, k.x_step, k.x_unit), p = new Date(1 * p - this._get_fictional_event_length(p, 0, k, !0)), p = a.date.add(p, k.x_step, k.x_unit))) : I = new Date(+p - Y));
            }
            j = new Date(p - 1);
          }
          if (!this._table_view && this._dragEventBody && !a.config.all_timed && (!a._get_section_view() && v.x != this._get_event_sday({ start_date: new Date(c), end_date: new Date(c) }) || new Date(c).getHours() < this.config.first_hour) && (Y = p - I, this._drag_mode == "move" && (S = this._min_date.valueOf() + 24 * v.x * 60 * 6e4, (I = new Date(S)).setHours(this.config.first_hour), p = new Date(I.valueOf() + Y), j = new Date(p - 1))), this._table_view || a.config.all_timed || !(!a.getView() && v.x != this._get_event_sday({ start_date: new Date(p), end_date: new Date(p) }) || new Date(p).getHours() >= this.config.last_hour) || (Y = p - I, S = this._min_date.valueOf() + 24 * v.x * 60 * 6e4, (p = a.date.date_part(new Date(S))).setHours(this.config.last_hour), j = new Date(p - 1), this._drag_mode == "move" && (I = new Date(+p - Y))), this._table_view || j.getDate() == I.getDate() && j.getHours() < this.config.last_hour || a._allow_dnd)
            if (E.start_date = I, E.end_date = new Date(p), this.config.update_render) {
              var J = a._els.dhx_cal_data[0].scrollTop;
              this.update_view(), a._els.dhx_cal_data[0].scrollTop = J;
            } else
              this.updateEvent(this._drag_id);
          this._table_view && this.for_rendered(this._drag_id, function(X) {
            X.className += " dhx_in_move dhx_cal_event_drag";
          }), this.callEvent("onEventDrag", [this._drag_id, this._drag_mode, u]);
        }
      } else if (a.checkEvent("onMouseMove")) {
        var oe = this._locate_event(u.target || u.srcElement);
        this.callEvent("onMouseMove", [oe, u]);
      }
    }, a._on_mouse_down = function(u, v) {
      if (u.button != 2 && !this.config.readonly && !this._drag_mode) {
        v = v || u.target || u.srcElement;
        var c = a._getClassName(v).split(" ")[0];
        switch (this.config.drag_event_body && c == "dhx_body" && v.parentNode && v.parentNode.className.indexOf("dhx_cal_select_menu") === -1 && (c = "dhx_event_move", this._dragEventBody = !0), c) {
          case "dhx_cal_event_line":
          case "dhx_cal_event_clear":
            this._table_view && (this._drag_mode = "move");
            break;
          case "dhx_event_move":
          case "dhx_wa_ev_body":
            this._drag_mode = "move";
            break;
          case "dhx_event_resize":
            this._drag_mode = "resize", a._getClassName(v).indexOf("dhx_event_resize_end") < 0 ? a._drag_from_start = !0 : a._drag_from_start = !1;
            break;
          case "dhx_scale_holder":
          case "dhx_scale_holder_now":
          case "dhx_month_body":
          case "dhx_matrix_cell":
          case "dhx_marked_timespan":
            this._drag_mode = "create";
            break;
          case "":
            if (v.parentNode)
              return a._on_mouse_down(u, v.parentNode);
            break;
          default:
            if ((!a.checkEvent("onMouseDown") || a.callEvent("onMouseDown", [c, u])) && v.parentNode && v != this && c != "dhx_body")
              return a._on_mouse_down(u, v.parentNode);
            this._drag_mode = null, this._drag_id = null;
        }
        if (this._drag_mode) {
          var p = this._locate_event(v);
          if (this.config["drag_" + this._drag_mode] && this.callEvent("onBeforeDrag", [p, this._drag_mode, u])) {
            if (this._drag_id = p, (this._edit_id != this._drag_id || this._edit_id && this._drag_mode == "create") && this._close_not_saved(), !this._drag_mode)
              return;
            this._drag_event = a._lame_clone(this.getEvent(this._drag_id) || {}), this._drag_pos = this._mouse_coords(u);
          } else
            this._drag_mode = this._drag_id = 0;
        }
        this._drag_start = null;
      }
    }, a._get_private_properties = function(u) {
      var v = {};
      for (var c in u)
        c.indexOf("_") === 0 && (v[c] = !0);
      return v;
    }, a._clear_temporary_properties = function(u, v) {
      var c = this._get_private_properties(u), p = this._get_private_properties(v);
      for (var g in p)
        c[g] || delete v[g];
    }, a._on_mouse_up = function(u) {
      if (!u || u.button != 2 || !this._mobile) {
        if (this._drag_mode && this._drag_id) {
          this._els.dhx_cal_data[0].style.cursor = "default";
          var v = this._drag_id, c = this._drag_mode, p = !this._drag_pos || this._drag_pos.has_moved;
          delete this._drag_event._move_event_shift;
          var g = this.getEvent(this._drag_id);
          if (p && (this._drag_event._dhx_changed || !this._drag_event.start_date || g.start_date.valueOf() != this._drag_event.start_date.valueOf() || g.end_date.valueOf() != this._drag_event.end_date.valueOf())) {
            var b = this._drag_mode == "new-size";
            if (this.callEvent("onBeforeEventChanged", [g, u, b, this._drag_event]))
              if (this._drag_id = this._drag_mode = null, b && this.config.edit_on_create) {
                if (this.unselect(), this._new_event = /* @__PURE__ */ new Date(), this._table_view || this.config.details_on_create || !this.config.select || !this.isOneDayEvent(this.getEvent(v)))
                  return a.callEvent("onDragEnd", [v, c, u]), this.showLightbox(v);
                this._drag_pos = !0, this._select_id = this._edit_id = v;
              } else
                this._new_event || this.callEvent(b ? "onEventAdded" : "onEventChanged", [v, this.getEvent(v)]);
            else
              b ? this.deleteEvent(g.id, !0) : (this._drag_event._dhx_changed = !1, this._clear_temporary_properties(g, this._drag_event), a._lame_copy(g, this._drag_event), this.updateEvent(g.id));
          }
          this._drag_pos && (this._drag_pos.has_moved || this._drag_pos === !0) && (this._drag_id = this._drag_mode = null, this.render_view_data()), a.callEvent("onDragEnd", [v, c, u]);
        }
        this._drag_id = null, this._drag_mode = null, this._drag_pos = null, this._drag_event = null, this._drag_from_start = null;
      }
    }, a._trigger_dyn_loading = function() {
      return !(!this._load_mode || !this._load() || (this._render_wait = !0, 0));
    }, a.update_view = function() {
      this._reset_ignores(), this._update_nav_bar(this.config.header, this.$container.querySelector(".dhx_cal_navline"));
      var u = this[this._mode + "_view"];
      if (u ? u.call(this, !0) : this._reset_scale(), this._trigger_dyn_loading())
        return !0;
      this.render_view_data();
    }, a.isViewExists = function(u) {
      return !!(a[u + "_view"] || a.date[u + "_start"] && a.templates[u + "_date"] && a.templates[u + "_scale_date"]);
    }, a._set_aria_buttons_attrs = function() {
      for (var u = ["dhx_cal_next_button", "dhx_cal_prev_button", "dhx_cal_tab", "dhx_cal_today_button"], v = 0; v < u.length; v++)
        for (var c = this._els[u[v]], p = 0; c && p < c.length; p++) {
          var g = c[p].getAttribute("data-tab") || c[p].getAttribute("name"), b = this.locale.labels[u[v]];
          g && (b = this.locale.labels[g + "_tab"] || this.locale.labels[g] || b), u[v] == "dhx_cal_next_button" ? b = this.locale.labels.next : u[v] == "dhx_cal_prev_button" && (b = this.locale.labels.prev), this._waiAria.headerButtonsAttributes(c[p], b || "");
        }
    }, a.updateView = function(u, v) {
      if (!this.$container)
        throw new Error(`The scheduler is not initialized. 
 **scheduler.updateView** or **scheduler.setCurrentView** can be called only after **scheduler.init**`);
      u = u || this._date, v = v || this._mode;
      var c = "dhx_cal_data";
      this.locale.labels.icon_form || (this.locale.labels.icon_form = this.locale.labels.icon_edit);
      var p = this._obj, g = "dhx_scheduler_" + this._mode, b = "dhx_scheduler_" + v;
      this._mode && p.className.indexOf(g) != -1 ? p.className = p.className.replace(g, b) : p.className += " " + b;
      var x, k = "dhx_multi_day", w = !(this._mode != v || !this.config.preserve_scroll) && this._els[c][0].scrollTop;
      this._els[k] && this._els[k][0] && (x = this._els[k][0].scrollTop), this[this._mode + "_view"] && v && this._mode != v && this[this._mode + "_view"](!1), this._close_not_saved(), this._els[k] && (this._els[k][0].parentNode.removeChild(this._els[k][0]), this._els[k] = null), this._mode = v, this._date = u, this._table_view = this._mode == "month", this._dy_shift = 0, this.update_view(), this._set_aria_buttons_attrs();
      var E = this._els.dhx_cal_tab;
      if (E)
        for (var D = 0; D < E.length; D++) {
          var S = E[D];
          S.getAttribute("data-tab") == this._mode || S.getAttribute("name") == this._mode + "_tab" ? (S.classList.add("active"), this._waiAria.headerToggleState(S, !0)) : (S.classList.remove("active"), this._waiAria.headerToggleState(S, !1));
        }
      typeof w == "number" && (this._els[c][0].scrollTop = w), typeof x == "number" && this._els[k] && this._els[k][0] && (this._els[k][0].scrollTop = x);
    }, a.setCurrentView = function(u, v) {
      this.callEvent("onBeforeViewChange", [this._mode, this._date, v || this._mode, u || this._date]) && (this.updateView(u, v), this.callEvent("onViewChange", [this._mode, this._date]));
    }, a.render = function(u, v) {
      a.setCurrentView(u, v);
    }, a._render_x_header = function(u, v, c, p, g) {
      g = g || 0;
      var b = document.createElement("div");
      b.className = "dhx_scale_bar", this.templates[this._mode + "_scalex_class"] && (b.className += " " + this.templates[this._mode + "_scalex_class"](c));
      var x = this._cols[u];
      this._mode == "month" && u === 0 && this.config.left_border && (b.className += " dhx_scale_bar_border", v += 1), this.set_xy(b, x, this.xy.scale_height - 1, v, g);
      var k = this.templates[this._mode + "_scale_date"](c, this._mode);
      b.innerHTML = k, this._waiAria.dayHeaderAttr(b, k), p.appendChild(b);
    }, a._get_columns_num = function(u, v) {
      var c = 7;
      if (!a._table_view) {
        var p = a.date["get_" + a._mode + "_end"];
        p && (v = p(u)), c = Math.round((v.valueOf() - u.valueOf()) / 864e5);
      }
      return c;
    }, a._get_timeunit_start = function() {
      return this.date[this._mode + "_start"](new Date(this._date.valueOf()));
    }, a._get_view_end = function() {
      var u = this._get_timeunit_start(), v = a.date.add(u, 1, this._mode);
      if (!a._table_view) {
        var c = a.date["get_" + a._mode + "_end"];
        c && (v = c(u));
      }
      return v;
    }, a._calc_scale_sizes = function(u, v, c) {
      var p = this.config.rtl, g = u, b = this._get_columns_num(v, c);
      this._process_ignores(v, b, "day", 1);
      for (var x = b - this._ignores_detected, k = 0; k < b; k++)
        this._ignores[k] ? (this._cols[k] = 0, x++) : this._cols[k] = Math.floor(g / (x - k)), g -= this._cols[k], this._colsS[k] = (this._cols[k - 1] || 0) + (this._colsS[k - 1] || (this._table_view ? 0 : p ? this.xy.scroll_width : this.xy.scale_width));
      this._colsS.col_length = b, this._colsS[b] = this._cols[b - 1] + this._colsS[b - 1] || 0;
    }, a._set_scale_col_size = function(u, v, c) {
      var p = this.config;
      this.set_xy(u, v, p.hour_size_px * (p.last_hour - p.first_hour), c + this.xy.scale_width + 1, 0);
    }, a._render_scales = function(u, v) {
      var c = new Date(a._min_date), p = new Date(a._max_date), g = this.date.date_part(a._currentDate()), b = parseInt(u.style.width, 10) - 1, x = new Date(this._min_date), k = this._get_columns_num(c, p);
      this._calc_scale_sizes(b, c, p);
      var w = 0;
      u.innerHTML = "";
      for (var E = 0; E < k; E++) {
        if (this._ignores[E] || this._render_x_header(E, w, x, u), !this._table_view) {
          var D = document.createElement("div"), S = "dhx_scale_holder";
          x.valueOf() == g.valueOf() && (S += " dhx_scale_holder_now"), D.setAttribute("data-column-index", E), this._ignores_detected && this._ignores[E] && (S += " dhx_scale_ignore");
          for (let M = 1 * this.config.first_hour; M < this.config.last_hour; M++) {
            const N = document.createElement("div");
            N.className = "dhx_scale_time_slot dhx_scale_time_slot_hour_start", N.style.height = this.config.hour_size_px / 2 + "px";
            let T = new Date(x.getFullYear(), x.getMonth(), x.getDate(), M, 0);
            N.setAttribute("data-slot-date", this.templates.format_date(T));
            let A = this.templates.time_slot_text(T);
            A && (N.innerHTML = A);
            let C = this.templates.time_slot_class(T);
            C && N.classList.add(C), D.appendChild(N);
            const H = document.createElement("div");
            H.className = "dhx_scale_time_slot", T = new Date(x.getFullYear(), x.getMonth(), x.getDate(), M, 30), H.setAttribute("data-slot-date", this.templates.format_date(T)), H.style.height = this.config.hour_size_px / 2 + "px", A = this.templates.time_slot_text(T), A && (H.innerHTML = A), C = this.templates.time_slot_class(T), C && H.classList.add(C), D.appendChild(H);
          }
          D.className = S + " " + this.templates.week_date_class(x, g), this._waiAria.dayColumnAttr(D, x), this._set_scale_col_size(D, this._cols[E], w), v.appendChild(D), this.callEvent("onScaleAdd", [D, x]);
        }
        w += this._cols[E], x = this.date.add(x, 1, "day"), x = this.date.day_start(x);
      }
    }, a._getNavDateElement = function() {
      return this.$container.querySelector(".dhx_cal_date");
    }, a._reset_scale = function() {
      if (this.templates[this._mode + "_date"]) {
        var u = this._els.dhx_cal_header[0], v = this._els.dhx_cal_data[0], c = this.config;
        u.innerHTML = "", v.innerHTML = "";
        var p, g, b = (c.readonly || !c.drag_resize ? " dhx_resize_denied" : "") + (c.readonly || !c.drag_move ? " dhx_move_denied" : "");
        v.className = "dhx_cal_data" + b, this._scales = {}, this._cols = [], this._colsS = { height: 0 }, this._dy_shift = 0, this.set_sizes();
        var x = this._get_timeunit_start(), k = a._get_view_end();
        p = g = this._table_view ? a.date.week_start(x) : x, this._min_date = p;
        var w = this.templates[this._mode + "_date"](x, k, this._mode), E = this._getNavDateElement();
        if (E && (E.innerHTML = w, this._waiAria.navBarDateAttr(E, w)), this._max_date = k, a._render_scales(u, v), this._table_view)
          this._reset_month_scale(v, x, g);
        else if (this._reset_hours_scale(v, x, g), c.multi_day) {
          var D = "dhx_multi_day";
          this._els[D] && (this._els[D][0].parentNode.removeChild(this._els[D][0]), this._els[D] = null);
          var S = document.createElement("div");
          S.className = D, S.style.visibility = "hidden", S.style.display = "none";
          var M = this._colsS[this._colsS.col_length], N = c.rtl ? this.xy.scale_width : this.xy.scroll_width, T = Math.max(M + N, 0);
          this.set_xy(S, T, 0, 0), v.parentNode.insertBefore(S, v);
          var A = S.cloneNode(!0);
          A.className = D + "_icon", A.style.visibility = "hidden", A.style.display = "none", this.set_xy(A, this.xy.scale_width + 1, 0, 0), S.appendChild(A), this._els[D] = [S, A], a.event(this._els[D][0], "click", this._click.dhx_cal_data);
        }
      }
    }, a._reset_hours_scale = function(u, v, c) {
      var p = document.createElement("div");
      p.className = "dhx_scale_holder";
      for (var g = new Date(1980, 1, 1, this.config.first_hour, 0, 0), b = 1 * this.config.first_hour; b < this.config.last_hour; b++) {
        var x = document.createElement("div");
        x.className = "dhx_scale_hour", x.style.height = this.config.hour_size_px + "px";
        var k = this.xy.scale_width;
        this.config.left_border && (x.className += " dhx_scale_hour_border"), x.style.width = k + "px";
        var w = a.templates.hour_scale(g);
        x.innerHTML = w, this._waiAria.hourScaleAttr(x, w), p.appendChild(x), g = this.date.add(g, 1, "hour");
      }
      u.appendChild(p), this.config.scroll_hour && (u.scrollTop = this.config.hour_size_px * (this.config.scroll_hour - this.config.first_hour));
    }, a._currentDate = function() {
      return a.config.now_date ? new Date(a.config.now_date) : /* @__PURE__ */ new Date();
    }, a._reset_ignores = function() {
      this._ignores = {}, this._ignores_detected = 0;
    }, a._process_ignores = function(u, v, c, p, g) {
      this._reset_ignores();
      var b = a["ignore_" + this._mode];
      if (b)
        for (var x = new Date(u), k = 0; k < v; k++)
          b(x) && (this._ignores_detected += 1, this._ignores[k] = !0, g && v++), x = a.date.add(x, p, c), a.date[c + "_start"] && (x = a.date[c + "_start"](x));
    }, a._render_month_scale = function(u, v, c, p) {
      var g = a.date.add(v, 1, "month"), b = new Date(c), x = a._currentDate();
      this.date.date_part(x), this.date.date_part(c), p = p || Math.ceil(Math.round((g.valueOf() - c.valueOf()) / 864e5) / 7);
      for (var k = [], w = 0; w <= 7; w++) {
        var E = this._cols[w] || 0;
        isNaN(Number(E)) || (E += "px"), k[w] = E;
      }
      function D(I) {
        var Y = a._colsS.height;
        return a._colsS.heights[I + 1] !== void 0 && (Y = a._colsS.heights[I + 1] - (a._colsS.heights[I] || 0)), Y;
      }
      var S = 0;
      const M = document.createElement("div");
      for (M.classList.add("dhx_cal_month_table"), w = 0; w < p; w++) {
        var N = document.createElement("div");
        N.classList.add("dhx_cal_month_row"), N.style.height = D(w) + "px", M.appendChild(N);
        for (var T = 0; T < 7; T++) {
          var A = document.createElement("div");
          N.appendChild(A);
          var C = "dhx_cal_month_cell";
          c < v ? C += " dhx_before" : c >= g ? C += " dhx_after" : c.valueOf() == x.valueOf() && (C += " dhx_now"), this._ignores_detected && this._ignores[T] && (C += " dhx_scale_ignore"), A.className = C + " " + this.templates.month_date_class(c, x), A.setAttribute("data-cell-date", a.templates.format_date(c));
          var H = "dhx_month_body", O = "dhx_month_head";
          if (T === 0 && this.config.left_border && (H += " dhx_month_body_border", O += " dhx_month_head_border"), this._ignores_detected && this._ignores[T])
            A.appendChild(document.createElement("div")), A.appendChild(document.createElement("div"));
          else {
            A.style.width = k[T], this._waiAria.monthCellAttr(A, c);
            var $ = document.createElement("div");
            $.style.height = a.xy.month_head_height + "px", $.className = O, $.innerHTML = this.templates.month_day(c), A.appendChild($);
            var R = document.createElement("div");
            R.className = H, A.appendChild(R);
          }
          var j = c.getDate();
          (c = this.date.add(c, 1, "day")).getDate() - j > 1 && (c = new Date(c.getFullYear(), c.getMonth(), j + 1, 12, 0));
        }
        a._colsS.heights[w] = S, S += D(w);
      }
      return this._min_date = b, this._max_date = c, u.innerHTML = "", u.appendChild(M), this._scales = {}, u.querySelectorAll("[data-cell-date]").forEach((I) => {
        const Y = a.templates.parse_date(I.getAttribute("data-cell-date")), J = I.querySelector(".dhx_month_body");
        this._scales[+Y] = J, this.callEvent("onScaleAdd", [this._scales[+Y], Y]);
      }), this._max_date;
    }, a._reset_month_scale = function(u, v, c, p) {
      var g = a.date.add(v, 1, "month"), b = a._currentDate();
      this.date.date_part(b), this.date.date_part(c), p = p || Math.ceil(Math.round((g.valueOf() - c.valueOf()) / 864e5) / 7);
      var x = Math.floor(u.clientHeight / p) - this.xy.month_head_height;
      return this._colsS.height = x + this.xy.month_head_height, this._colsS.heights = [], a._render_month_scale(u, v, c, p);
    }, a.getView = function(u) {
      return u || (u = a.getState().mode), a.matrix && a.matrix[u] ? a.matrix[u] : a._props && a._props[u] ? a._props[u] : null;
    }, a.getLabel = function(u, v) {
      for (var c = this.config.lightbox.sections, p = 0; p < c.length; p++)
        if (c[p].map_to == u) {
          for (var g = c[p].options, b = 0; b < g.length; b++)
            if (g[b].key == v)
              return g[b].label;
        }
      return "";
    }, a.updateCollection = function(u, v) {
      var c = a.serverList(u);
      return !!c && (c.splice(0, c.length), c.push.apply(c, v || []), a.callEvent("onOptionsLoad", []), a.resetLightbox(), a.hideCover(), !0);
    }, a._lame_clone = function(u, v) {
      var c, p, g;
      for (v = v || [], c = 0; c < v.length; c += 2)
        if (u === v[c])
          return v[c + 1];
      if (u && typeof u == "object") {
        for (g = Object.create(u), p = [Array, Date, Number, String, Boolean], c = 0; c < p.length; c++)
          u instanceof p[c] && (g = c ? new p[c](u) : new p[c]());
        for (c in v.push(u, g), u)
          Object.prototype.hasOwnProperty.apply(u, [c]) && (g[c] = a._lame_clone(u[c], v));
      }
      return g || u;
    }, a._lame_copy = function(u, v) {
      for (var c in v)
        v.hasOwnProperty(c) && (u[c] = v[c]);
      return u;
    }, a._get_date_from_pos = function(u) {
      var v = this._min_date.valueOf() + 6e4 * (u.y * this.config.time_step + 24 * (this._table_view ? 0 : u.x) * 60);
      return new Date(this._correct_shift(v));
    }, a.getActionData = function(u) {
      var v = this._mouse_coords(u);
      return { date: this._get_date_from_pos(v), section: v.section };
    }, a._focus = function(u, v) {
      if (u && u.focus)
        if (this._mobile)
          window.setTimeout(function() {
            u.focus();
          }, 10);
        else
          try {
            v && u.select && u.offsetWidth && u.select(), u.focus();
          } catch {
          }
    }, a._get_real_event_length = function(u, v, c) {
      var p, g = v - u, b = this["ignore_" + this._mode], x = 0;
      c.render ? (x = this._get_date_index(c, u), p = this._get_date_index(c, v), u.valueOf() < a.getState().min_date.valueOf() && (x = -f(u, a.getState().min_date)), v.valueOf() > a.getState().max_date.valueOf() && (p += f(v, a.getState().max_date))) : p = Math.round(g / 60 / 60 / 1e3 / 24);
      for (var k = !0; x < p; ) {
        var w = a.date.add(v, -c.x_step, c.x_unit);
        if (b && b(v) && (!k || k && b(w)))
          g -= v - w;
        else {
          let E = 0;
          const D = new Date(Math.max(w.valueOf(), u.valueOf())), S = v, M = new Date(D.getFullYear(), D.getMonth(), D.getDate(), c.first_hour), N = new Date(D.getFullYear(), D.getMonth(), D.getDate(), c.last_hour || 24), T = new Date(v.getFullYear(), v.getMonth(), v.getDate(), c.first_hour), A = new Date(v.getFullYear(), v.getMonth(), v.getDate(), c.last_hour || 24);
          S.valueOf() > A.valueOf() && (E += S - A), S.valueOf() > T.valueOf() ? E += c._start_correction : E += 60 * S.getHours() * 60 * 1e3 + 60 * S.getMinutes() * 1e3, D.valueOf() < N.valueOf() && (E += c._end_correction), D.valueOf() < M.valueOf() && (E += M.valueOf() - D.valueOf()), g -= E, k = !1;
        }
        v = w, p--;
      }
      return g;
    }, a._get_fictional_event_length = function(u, v, c, p) {
      var g = new Date(u), b = p ? -1 : 1;
      if (c._start_correction || c._end_correction) {
        var x;
        x = p ? 60 * g.getHours() + g.getMinutes() - 60 * (c.first_hour || 0) : 60 * (c.last_hour || 0) - (60 * g.getHours() + g.getMinutes());
        var k = 60 * (c.last_hour - c.first_hour), w = Math.ceil((v / 6e4 - x) / k);
        w < 0 && (w = 0), v += w * (1440 - k) * 60 * 1e3;
      }
      var E, D = new Date(1 * u + v * b), S = this["ignore_" + this._mode], M = 0;
      for (c.render ? (M = this._get_date_index(c, g), E = this._get_date_index(c, D)) : E = Math.round(v / 60 / 60 / 1e3 / 24); M * b <= E * b; ) {
        var N = a.date.add(g, c.x_step * b, c.x_unit);
        S && S(g) && (v += (N - g) * b, E += b), g = N, M += b;
      }
      return v;
    }, a._get_section_view = function() {
      return this.getView();
    }, a._get_section_property = function() {
      return this.matrix && this.matrix[this._mode] ? this.matrix[this._mode].y_property : this._props && this._props[this._mode] ? this._props[this._mode].map_to : null;
    }, a._is_initialized = function() {
      var u = this.getState();
      return this._obj && u.date && u.mode;
    }, a._is_lightbox_open = function() {
      var u = this.getState();
      return u.lightbox_id !== null && u.lightbox_id !== void 0;
    };
  }(i), function(a) {
    (function() {
      var o = new RegExp(`<(?:.|
)*?>`, "gm"), l = new RegExp(" +", "gm");
      function h(u) {
        return (u + "").replace(o, " ").replace(l, " ");
      }
      var y = new RegExp("'", "gm");
      function m(u) {
        return (u + "").replace(y, "&#39;");
      }
      for (var f in a._waiAria = { getAttributeString: function(u) {
        var v = [" "];
        for (var c in u)
          if (typeof u[c] != "function" && typeof u[c] != "object") {
            var p = m(h(u[c]));
            v.push(c + "='" + p + "'");
          }
        return v.push(" "), v.join(" ");
      }, setAttributes: function(u, v) {
        for (var c in v)
          u.setAttribute(c, h(v[c]));
        return u;
      }, labelAttr: function(u, v) {
        return this.setAttributes(u, { "aria-label": v });
      }, label: function(u) {
        return a._waiAria.getAttributeString({ "aria-label": u });
      }, hourScaleAttr: function(u, v) {
        this.labelAttr(u, v);
      }, monthCellAttr: function(u, v) {
        this.labelAttr(u, a.templates.day_date(v));
      }, navBarDateAttr: function(u, v) {
        this.labelAttr(u, v);
      }, dayHeaderAttr: function(u, v) {
        this.labelAttr(u, v);
      }, dayColumnAttr: function(u, v) {
        this.dayHeaderAttr(u, a.templates.day_date(v));
      }, headerButtonsAttributes: function(u, v) {
        return this.setAttributes(u, { role: "button", "aria-label": v });
      }, headerToggleState: function(u, v) {
        return this.setAttributes(u, { "aria-pressed": v ? "true" : "false" });
      }, getHeaderCellAttr: function(u) {
        return a._waiAria.getAttributeString({ "aria-label": u });
      }, eventAttr: function(u, v) {
        this._eventCommonAttr(u, v);
      }, _eventCommonAttr: function(u, v) {
        v.setAttribute("aria-label", h(a.templates.event_text(u.start_date, u.end_date, u))), a.config.readonly && v.setAttribute("aria-readonly", !0), u.$dataprocessor_class && v.setAttribute("aria-busy", !0), v.setAttribute("aria-selected", a.getState().select_id == u.id ? "true" : "false");
      }, setEventBarAttr: function(u, v) {
        this._eventCommonAttr(u, v);
      }, _getAttributes: function(u, v) {
        var c = { setAttribute: function(p, g) {
          this[p] = g;
        } };
        return u.apply(this, [v, c]), c;
      }, eventBarAttrString: function(u) {
        return this.getAttributeString(this._getAttributes(this.setEventBarAttr, u));
      }, agendaHeadAttrString: function() {
        return this.getAttributeString({ role: "row" });
      }, agendaHeadDateString: function(u) {
        return this.getAttributeString({ role: "columnheader", "aria-label": u });
      }, agendaHeadDescriptionString: function(u) {
        return this.agendaHeadDateString(u);
      }, agendaDataAttrString: function() {
        return this.getAttributeString({ role: "grid" });
      }, agendaEventAttrString: function(u) {
        var v = this._getAttributes(this._eventCommonAttr, u);
        return v.role = "row", this.getAttributeString(v);
      }, agendaDetailsBtnString: function() {
        return this.getAttributeString({ role: "button", "aria-label": a.locale.labels.icon_details });
      }, gridAttrString: function() {
        return this.getAttributeString({ role: "grid" });
      }, gridRowAttrString: function(u) {
        return this.agendaEventAttrString(u);
      }, gridCellAttrString: function(u, v, c) {
        return this.getAttributeString({ role: "gridcell", "aria-label": [v.label === void 0 ? v.id : v.label, ": ", c] });
      }, mapAttrString: function() {
        return this.gridAttrString();
      }, mapRowAttrString: function(u) {
        return this.gridRowAttrString(u);
      }, mapDetailsBtnString: function() {
        return this.agendaDetailsBtnString();
      }, minicalHeader: function(u, v) {
        this.setAttributes(u, { id: v + "", "aria-live": "assertice", "aria-atomic": "true" });
      }, minicalGrid: function(u, v) {
        this.setAttributes(u, { "aria-labelledby": v + "", role: "grid" });
      }, minicalRow: function(u) {
        this.setAttributes(u, { role: "row" });
      }, minicalDayCell: function(u, v) {
        var c = v.valueOf() < a._max_date.valueOf() && v.valueOf() >= a._min_date.valueOf();
        this.setAttributes(u, { role: "gridcell", "aria-label": a.templates.day_date(v), "aria-selected": c ? "true" : "false" });
      }, minicalHeadCell: function(u) {
        this.setAttributes(u, { role: "columnheader" });
      }, weekAgendaDayCell: function(u, v) {
        var c = u.querySelector(".dhx_wa_scale_bar"), p = u.querySelector(".dhx_wa_day_data"), g = a.uid() + "";
        this.setAttributes(c, { id: g }), this.setAttributes(p, { "aria-labelledby": g });
      }, weekAgendaEvent: function(u, v) {
        this.eventAttr(v, u);
      }, lightboxHiddenAttr: function(u) {
        u.setAttribute("aria-hidden", "true");
      }, lightboxVisibleAttr: function(u) {
        u.setAttribute("aria-hidden", "false");
      }, lightboxSectionButtonAttrString: function(u) {
        return this.getAttributeString({ role: "button", "aria-label": u, tabindex: "0" });
      }, yearHeader: function(u, v) {
        this.setAttributes(u, { id: v + "" });
      }, yearGrid: function(u, v) {
        this.minicalGrid(u, v);
      }, yearHeadCell: function(u) {
        return this.minicalHeadCell(u);
      }, yearRow: function(u) {
        return this.minicalRow(u);
      }, yearDayCell: function(u) {
        this.setAttributes(u, { role: "gridcell" });
      }, lightboxAttr: function(u) {
        u.setAttribute("role", "dialog"), u.setAttribute("aria-hidden", "true"), u.firstChild.setAttribute("role", "heading");
      }, lightboxButtonAttrString: function(u) {
        return this.getAttributeString({ role: "button", "aria-label": a.locale.labels[u], tabindex: "0" });
      }, eventMenuAttrString: function(u) {
        return this.getAttributeString({ role: "button", "aria-label": a.locale.labels[u] });
      }, lightboxHeader: function(u, v) {
        u.setAttribute("aria-label", v);
      }, lightboxSelectAttrString: function(u) {
        var v = "";
        switch (u) {
          case "%Y":
            v = a.locale.labels.year;
            break;
          case "%m":
            v = a.locale.labels.month;
            break;
          case "%d":
            v = a.locale.labels.day;
            break;
          case "%H:%i":
            v = a.locale.labels.hour + " " + a.locale.labels.minute;
        }
        return a._waiAria.getAttributeString({ "aria-label": v });
      }, messageButtonAttrString: function(u) {
        return "tabindex='0' role='button' aria-label='" + u + "'";
      }, messageInfoAttr: function(u) {
        u.setAttribute("role", "alert");
      }, messageModalAttr: function(u, v) {
        u.setAttribute("role", "dialog"), v && u.setAttribute("aria-labelledby", v);
      }, quickInfoAttr: function(u) {
        u.setAttribute("role", "dialog");
      }, quickInfoHeaderAttrString: function() {
        return " role='heading' ";
      }, quickInfoHeader: function(u, v) {
        u.setAttribute("aria-label", v);
      }, quickInfoButtonAttrString: function(u) {
        return a._waiAria.getAttributeString({ role: "button", "aria-label": u, tabindex: "0" });
      }, tooltipAttr: function(u) {
        u.setAttribute("role", "tooltip");
      }, tooltipVisibleAttr: function(u) {
        u.setAttribute("aria-hidden", "false");
      }, tooltipHiddenAttr: function(u) {
        u.setAttribute("aria-hidden", "true");
      } }, a._waiAria)
        a._waiAria[f] = function(u) {
          return function() {
            return a.config.wai_aria_attributes ? u.apply(this, arguments) : " ";
          };
        }(a._waiAria[f]);
    })();
  }(i), i.utils = ge, i.$domHelpers = Ae, i.utils.dom = Ae, i.uid = ge.uid, i.mixin = ge.mixin, i.defined = ge.defined, i.assert = function(a) {
    return function(o, l) {
      o || a.config.show_errors && a.callEvent("onError", [l]) !== !1 && (a.message ? a.message({ type: "error", text: l, expire: -1 }) : console.log(l));
    };
  }(i), i.copy = ge.copy, i._createDatePicker = function(a, o) {
    return new hn(i, a, o);
  }, i._getFocusableNodes = Ae.getFocusableNodes, i._getClassName = Ae.getClassName, i._locate_css = Ae.locateCss;
  const t = Ha(i);
  var n, s, r;
  i.utils.mixin(i, t), i.env = i.$env = Na, i.Promise = window.Promise, function(a) {
    a.destructor = function() {
      for (var o in a.callEvent("onDestroy", []), this.clearAll(), this.$container && (this.$container.innerHTML = ""), this._eventRemoveAll && this._eventRemoveAll(), this.resetLightbox && this.resetLightbox(), this._dp && this._dp.destructor && this._dp.destructor(), this.detachAllEvents(), this)
        o.indexOf("$") === 0 && delete this[o];
      a.$destroyed = !0;
    };
  }(i), function(a) {
    function o(l, h) {
      var y = { method: l };
      if (h.length === 0)
        throw new Error("Arguments list of query is wrong.");
      if (h.length === 1)
        return typeof h[0] == "string" ? (y.url = h[0], y.async = !0) : (y.url = h[0].url, y.async = h[0].async || !0, y.callback = h[0].callback, y.headers = h[0].headers), h[0].data ? typeof h[0].data != "string" ? y.data = ot(h[0].data) : y.data = h[0].data : y.data = "", y;
      switch (y.url = h[0], l) {
        case "GET":
        case "DELETE":
          y.callback = h[1], y.headers = h[2];
          break;
        case "POST":
        case "PUT":
          h[1] ? typeof h[1] != "string" ? y.data = ot(h[1]) : y.data = h[1] : y.data = "", y.callback = h[2], y.headers = h[3];
      }
      return y;
    }
    a.Promise = window.Promise, a.ajax = { cache: !0, method: "get", serializeRequestParams: ot, parse: function(l) {
      return typeof l != "string" ? l : (l = l.replace(/^[\s]+/, ""), typeof DOMParser > "u" || a.$env.isIE ? window.ActiveXObject !== void 0 && ((h = new window.ActiveXObject("Microsoft.XMLDOM")).async = "false", h.loadXML(l)) : h = new DOMParser().parseFromString(l, "text/xml"), h);
      var h;
    }, xmltop: function(l, h, y) {
      if (h.status === void 0 || h.status < 400) {
        var m = h.responseXML ? h.responseXML || h : this.parse(h.responseText || h);
        if (m && m.documentElement !== null && !m.getElementsByTagName("parsererror").length)
          return m.getElementsByTagName(l)[0];
      }
      return y !== -1 && a.callEvent("onLoadXMLError", ["Incorrect XML", arguments[1], y]), document.createElement("DIV");
    }, xpath: function(l, h) {
      if (h.nodeName || (h = h.responseXML || h), a.$env.isIE)
        return h.selectNodes(l) || [];
      for (var y, m = [], f = (h.ownerDocument || h).evaluate(l, h, null, XPathResult.ANY_TYPE, null); y = f.iterateNext(); )
        m.push(y);
      return m;
    }, query: function(l) {
      return this._call(l.method || "GET", l.url, l.data || "", l.async || !0, l.callback, l.headers);
    }, get: function(l, h, y) {
      var m = o("GET", arguments);
      return this.query(m);
    }, getSync: function(l, h) {
      var y = o("GET", arguments);
      return y.async = !1, this.query(y);
    }, put: function(l, h, y, m) {
      var f = o("PUT", arguments);
      return this.query(f);
    }, del: function(l, h, y) {
      var m = o("DELETE", arguments);
      return this.query(m);
    }, post: function(l, h, y, m) {
      arguments.length == 1 ? h = "" : arguments.length == 2 && typeof h == "function" && (y = h, h = "");
      var f = o("POST", arguments);
      return this.query(f);
    }, postSync: function(l, h, y) {
      h = h === null ? "" : String(h);
      var m = o("POST", arguments);
      return m.async = !1, this.query(m);
    }, _call: function(l, h, y, m, f, u) {
      return new a.Promise((function(v, c) {
        var p = typeof XMLHttpRequest === void 0 || a.$env.isIE ? new window.ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest(), g = navigator.userAgent.match(/AppleWebKit/) !== null && navigator.userAgent.match(/Qt/) !== null && navigator.userAgent.match(/Safari/) !== null;
        if (m && p.addEventListener("readystatechange", function() {
          if (p.readyState == 4 || g && p.readyState == 3) {
            if ((p.status != 200 || p.responseText === "") && !a.callEvent("onAjaxError", [p]))
              return;
            setTimeout(function() {
              typeof f == "function" && f.apply(window, [{ xmlDoc: p, filePath: h }]), v(p), typeof f == "function" && (f = null, p = null);
            }, 0);
          }
        }), l != "GET" || this.cache || (h += (h.indexOf("?") >= 0 ? "&" : "?") + "dhxr" + (/* @__PURE__ */ new Date()).getTime() + "=1"), p.open(l, h, m), u)
          for (var b in u)
            p.setRequestHeader(b, u[b]);
        else
          l.toUpperCase() == "POST" || l == "PUT" || l == "DELETE" ? p.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") : l == "GET" && (y = null);
        if (p.setRequestHeader("X-Requested-With", "XMLHttpRequest"), p.send(y), !m)
          return { xmlDoc: p, filePath: h };
      }).bind(this));
    }, urlSeparator: function(l) {
      return l.indexOf("?") != -1 ? "&" : "?";
    } }, a.$ajax = a.ajax;
  }(i), Ta(i), function(a) {
    a.config = { default_date: "%j %M %Y", month_date: "%F %Y", load_date: "%Y-%m-%d", week_date: "%l", day_date: "%D %j", hour_date: "%H:%i", month_day: "%d", date_format: "%Y-%m-%d %H:%i", api_date: "%d-%m-%Y %H:%i", parse_exact_format: !1, preserve_length: !0, time_step: 5, displayed_event_color: "#ff4a4a", displayed_event_text_color: "#ffef80", wide_form: 0, day_column_padding: 8, use_select_menu_space: !0, fix_tab_position: !0, start_on_monday: !0, first_hour: 0, last_hour: 24, readonly: !1, drag_resize: !0, drag_move: !0, drag_create: !0, drag_event_body: !0, dblclick_create: !0, details_on_dblclick: !0, edit_on_create: !0, details_on_create: !0, header: null, hour_size_px: 44, resize_month_events: !1, resize_month_timed: !1, responsive_lightbox: !1, separate_short_events: !0, rtl: !1, cascade_event_display: !1, cascade_event_count: 4, cascade_event_margin: 30, multi_day: !0, multi_day_height_limit: 200, drag_lightbox: !0, preserve_scroll: !0, select: !0, undo_deleted: !0, server_utc: !1, touch: !0, touch_tip: !0, touch_drag: 500, touch_swipe_dates: !1, quick_info_detached: !0, positive_closing: !1, drag_highlight: !0, limit_drag_out: !1, icons_edit: ["icon_save", "icon_cancel"], icons_select: ["icon_details", "icon_edit", "icon_delete"], buttons_left: ["dhx_save_btn", "dhx_cancel_btn"], buttons_right: ["dhx_delete_btn"], lightbox: { sections: [{ name: "description", map_to: "text", type: "textarea", focus: !0 }, { name: "time", height: 72, type: "time", map_to: "auto" }] }, highlight_displayed_event: !0, left_border: !1, ajax_error: "alert", delay_render: 0, timeline_swap_resize: !0, wai_aria_attributes: !0, wai_aria_application_role: !0, csp: "auto", event_attribute: "data-event-id", show_errors: !0 }, a.config.buttons_left.$initial = a.config.buttons_left.join(), a.config.buttons_right.$initial = a.config.buttons_right.join(), a._helpers = { parseDate: function(o) {
      return (a.templates.xml_date || a.templates.parse_date)(o);
    }, formatDate: function(o) {
      return (a.templates.xml_format || a.templates.format_date)(o);
    } }, a.templates = {}, a.init_templates = function() {
      var o = a.date.date_to_str, l = a.config;
      (function(h, y) {
        for (var m in y)
          h[m] || (h[m] = y[m]);
      })(a.templates, { day_date: o(l.default_date), month_date: o(l.month_date), week_date: function(h, y) {
        return l.rtl ? a.templates.day_date(a.date.add(y, -1, "day")) + " &ndash; " + a.templates.day_date(h) : a.templates.day_date(h) + " &ndash; " + a.templates.day_date(a.date.add(y, -1, "day"));
      }, day_scale_date: o(l.default_date), time_slot_text: function(h) {
        return "";
      }, time_slot_class: function(h) {
        return "";
      }, month_scale_date: o(l.week_date), week_scale_date: o(l.day_date), hour_scale: o(l.hour_date), time_picker: o(l.hour_date), event_date: o(l.hour_date), month_day: o(l.month_day), load_format: o(l.load_date), format_date: o(l.date_format, l.server_utc), parse_date: a.date.str_to_date(l.date_format, l.server_utc), api_date: a.date.str_to_date(l.api_date, !1, !1), event_header: function(h, y, m) {
        return m._mode === "small" || m._mode === "smallest" ? a.templates.event_date(h) : a.templates.event_date(h) + " - " + a.templates.event_date(y);
      }, event_text: function(h, y, m) {
        return m.text;
      }, event_class: function(h, y, m) {
        return "";
      }, month_date_class: function(h) {
        return "";
      }, week_date_class: function(h) {
        return "";
      }, event_bar_date: function(h, y, m) {
        return a.templates.event_date(h);
      }, event_bar_text: function(h, y, m) {
        return m.text;
      }, month_events_link: function(h, y) {
        return "<a>View more(" + y + " events)</a>";
      }, drag_marker_class: function(h, y, m) {
        return "";
      }, drag_marker_content: function(h, y, m) {
        return "";
      }, tooltip_date_format: a.date.date_to_str("%Y-%m-%d %H:%i"), tooltip_text: function(h, y, m) {
        return "<b>Event:</b> " + m.text + "<br/><b>Start date:</b> " + a.templates.tooltip_date_format(h) + "<br/><b>End date:</b> " + a.templates.tooltip_date_format(y);
      }, calendar_month: o("%F %Y"), calendar_scale_date: o("%D"), calendar_date: o("%d"), calendar_time: o("%d-%m-%Y") }), this.callEvent("onTemplatesReady", []);
    };
  }(i), function(a) {
    a._events = {}, a.clearAll = function() {
      this._events = {}, this._loaded = {}, this._edit_id = null, this._select_id = null, this._drag_id = null, this._drag_mode = null, this._drag_pos = null, this._new_event = null, this.clear_view(), this.callEvent("onClearAll", []);
    }, a.addEvent = function(o, l, h, y, m) {
      if (!arguments.length)
        return this.addEventNow();
      var f = o;
      arguments.length != 1 && ((f = m || {}).start_date = o, f.end_date = l, f.text = h, f.id = y), f.id = f.id || a.uid(), f.text = f.text || "", typeof f.start_date == "string" && (f.start_date = this.templates.api_date(f.start_date)), typeof f.end_date == "string" && (f.end_date = this.templates.api_date(f.end_date));
      var u = 6e4 * (this.config.event_duration || this.config.time_step);
      f.start_date.valueOf() == f.end_date.valueOf() && f.end_date.setTime(f.end_date.valueOf() + u), f.start_date.setMilliseconds(0), f.end_date.setMilliseconds(0), f._timed = this.isOneDayEvent(f);
      var v = !this._events[f.id];
      return this._events[f.id] = f, this.event_updated(f), this._loading || this.callEvent(v ? "onEventAdded" : "onEventChanged", [f.id, f]), f.id;
    }, a.deleteEvent = function(o, l) {
      var h = this._events[o];
      (l || this.callEvent("onBeforeEventDelete", [o, h]) && this.callEvent("onConfirmedBeforeEventDelete", [o, h])) && (h && (a.getState().select_id == o && a.unselect(), delete this._events[o], this.event_updated(h), this._drag_id == h.id && (this._drag_id = null, this._drag_mode = null, this._drag_pos = null)), this.callEvent("onEventDeleted", [o, h]));
    }, a.getEvent = function(o) {
      return this._events[o];
    }, a.setEvent = function(o, l) {
      l.id || (l.id = o), this._events[o] = l;
    }, a.for_rendered = function(o, l) {
      for (var h = this._rendered.length - 1; h >= 0; h--)
        this._rendered[h].getAttribute(this.config.event_attribute) == o && l(this._rendered[h], h);
    }, a.changeEventId = function(o, l) {
      if (o != l) {
        var h = this._events[o];
        h && (h.id = l, this._events[l] = h, delete this._events[o]), this.for_rendered(o, function(y) {
          y.setAttribute("event_id", l), y.setAttribute(a.config.event_attribute, l);
        }), this._select_id == o && (this._select_id = l), this._edit_id == o && (this._edit_id = l), this.callEvent("onEventIdChange", [o, l]);
      }
    }, function() {
      for (var o = ["text", "Text", "start_date", "StartDate", "end_date", "EndDate"], l = function(m) {
        return function(f) {
          return a.getEvent(f)[m];
        };
      }, h = function(m) {
        return function(f, u) {
          var v = a.getEvent(f);
          v[m] = u, v._changed = !0, v._timed = this.isOneDayEvent(v), a.event_updated(v, !0);
        };
      }, y = 0; y < o.length; y += 2)
        a["getEvent" + o[y + 1]] = l(o[y]), a["setEvent" + o[y + 1]] = h(o[y]);
    }(), a.event_updated = function(o, l) {
      this.is_visible_events(o) ? this.render_view_data() : this.clear_event(o.id);
    }, a.is_visible_events = function(o) {
      if (!this._min_date || !this._max_date)
        return !1;
      if (o.start_date.valueOf() < this._max_date.valueOf() && this._min_date.valueOf() < o.end_date.valueOf()) {
        var l = o.start_date.getHours(), h = o.end_date.getHours() + o.end_date.getMinutes() / 60, y = this.config.last_hour, m = this.config.first_hour;
        return !(!this._table_view && (h > y || h <= m) && (l >= y || l < m) && !((o.end_date.valueOf() - o.start_date.valueOf()) / 36e5 > 24 - (this.config.last_hour - this.config.first_hour) || l < y && h > m));
      }
      return !1;
    }, a.isOneDayEvent = function(o) {
      var l = new Date(o.end_date.valueOf() - 1);
      return o.start_date.getFullYear() === l.getFullYear() && o.start_date.getMonth() === l.getMonth() && o.start_date.getDate() === l.getDate() && o.end_date.valueOf() - o.start_date.valueOf() < 864e5;
    }, a.get_visible_events = function(o) {
      var l = [];
      for (var h in this._events)
        this.is_visible_events(this._events[h]) && (o && !this._events[h]._timed || this.filter_event(h, this._events[h]) && l.push(this._events[h]));
      return l;
    }, a.filter_event = function(o, l) {
      var h = this["filter_" + this._mode];
      return !h || h(o, l);
    }, a._is_main_area_event = function(o) {
      return !!o._timed;
    }, a.render_view_data = function(o, l) {
      var h = !1;
      if (!o) {
        if (h = !0, this._not_render)
          return void (this._render_wait = !0);
        this._render_wait = !1, this.clear_view(), o = this.get_visible_events(!(this._table_view || this.config.multi_day));
      }
      for (var y = 0, m = o.length; y < m; y++)
        this._recalculate_timed(o[y]);
      if (this.config.multi_day && !this._table_view) {
        var f = [], u = [];
        for (y = 0; y < o.length; y++)
          this._is_main_area_event(o[y]) ? f.push(o[y]) : u.push(o[y]);
        if (!this._els.dhx_multi_day) {
          var v = a._commonErrorMessages.unknownView(this._mode);
          throw new Error(v);
        }
        this._rendered_location = this._els.dhx_multi_day[0], this._table_view = !0, this.render_data(u, l), this._table_view = !1, this._rendered_location = this._els.dhx_cal_data[0], this._table_view = !1, this.render_data(f, l);
      } else {
        var c = document.createDocumentFragment(), p = this._els.dhx_cal_data[0];
        this._rendered_location = c, this.render_data(o, l), p.appendChild(c), this._rendered_location = p;
      }
      h && this.callEvent("onDataRender", []);
    }, a._view_month_day = function(o) {
      var l = a.getActionData(o).date;
      a.callEvent("onViewMoreClick", [l]) && a.setCurrentView(l, "day");
    }, a._render_month_link = function(o) {
      for (var l = this._rendered_location, h = this._lame_clone(o), y = o._sday; y < o._eday; y++) {
        h._sday = y, h._eday = y + 1;
        var m = a.date, f = a._min_date;
        f = m.add(f, h._sweek, "week"), f = m.add(f, h._sday, "day");
        var u = a.getEvents(f, m.add(f, 1, "day")).length, v = this._get_event_bar_pos(h), c = v.x2 - v.x, p = document.createElement("div");
        a.event(p, "click", function(g) {
          a._view_month_day(g);
        }), p.className = "dhx_month_link", p.style.top = v.y + "px", p.style.left = v.x + "px", p.style.width = c + "px", p.innerHTML = a.templates.month_events_link(f, u), this._rendered.push(p), l.appendChild(p);
      }
    }, a._recalculate_timed = function(o) {
      var l;
      o && (l = typeof o != "object" ? this._events[o] : o) && (l._timed = a.isOneDayEvent(l));
    }, a.attachEvent("onEventChanged", a._recalculate_timed), a.attachEvent("onEventAdded", a._recalculate_timed), a.render_data = function(o, l) {
      o = this._pre_render_events(o, l);
      for (var h = {}, y = 0; y < o.length; y++)
        if (this._table_view)
          if (a._mode != "month")
            this.render_event_bar(o[y]);
          else {
            var m = a.config.max_month_events;
            m !== 1 * m || o[y]._sorder < m ? this.render_event_bar(o[y]) : m !== void 0 && o[y]._sorder == m && a._render_month_link(o[y]);
          }
        else {
          var f = o[y], u = a.locate_holder(f._sday);
          if (!u)
            continue;
          h[f._sday] || (h[f._sday] = { real: u, buffer: document.createDocumentFragment(), width: u.clientWidth });
          var v = h[f._sday];
          this.render_event(f, v.buffer, v.width);
        }
      for (var y in h)
        (v = h[y]).real && v.buffer && v.real.appendChild(v.buffer);
    }, a._get_first_visible_cell = function(o) {
      for (var l = 0; l < o.length; l++)
        if ((o[l].className || "").indexOf("dhx_scale_ignore") == -1)
          return o[l];
      return o[0];
    }, a._pre_render_events = function(o, l) {
      var h = this.xy.bar_height, y = this._colsS.heights, m = this._colsS.heights = [0, 0, 0, 0, 0, 0, 0], f = this._els.dhx_cal_data[0];
      if (o = this._table_view ? this._pre_render_events_table(o, l) : this._pre_render_events_line(o, l), this._table_view)
        if (l)
          this._colsS.heights = y;
        else {
          var u = f.querySelectorAll(".dhx_cal_month_row");
          if (u.length) {
            for (var v = 0; v < u.length; v++) {
              m[v]++;
              var c = u[v].querySelectorAll(".dhx_cal_month_cell"), p = this._colsS.height - this.xy.month_head_height;
              if (m[v] * h > p) {
                var g = p;
                1 * this.config.max_month_events !== this.config.max_month_events || m[v] <= this.config.max_month_events ? g = m[v] * h : (this.config.max_month_events + 1) * h > p && (g = (this.config.max_month_events + 1) * h), u[v].style.height = g + this.xy.month_head_height + "px";
              }
              m[v] = (m[v - 1] || 0) + a._get_first_visible_cell(c).offsetHeight;
            }
            m.unshift(0);
            const N = this.$container.querySelector(".dhx_cal_data");
            if (N.offsetHeight < N.scrollHeight && !a._colsS.scroll_fix && a.xy.scroll_width) {
              var b = a._colsS, x = b[b.col_length], k = b.heights.slice();
              x -= a.xy.scroll_width || 0, this._calc_scale_sizes(x, this._min_date, this._max_date), a._colsS.heights = k, this.set_xy(this._els.dhx_cal_header[0], x), a._render_scales(this._els.dhx_cal_header[0]), a._render_month_scale(this._els.dhx_cal_data[0], this._get_timeunit_start(), this._min_date), b.scroll_fix = !0;
            }
          } else if (o.length || this._els.dhx_multi_day[0].style.visibility != "visible" || (m[0] = -1), o.length || m[0] == -1) {
            var w = (m[0] + 1) * h + 4, E = w, D = w + "px";
            this.config.multi_day_height_limit && (D = (E = Math.min(w, this.config.multi_day_height_limit)) + "px");
            var S = this._els.dhx_multi_day[0];
            S.style.height = D, S.style.visibility = m[0] == -1 ? "hidden" : "visible", S.style.display = m[0] == -1 ? "none" : "";
            var M = this._els.dhx_multi_day[1];
            M.style.height = D, M.style.visibility = m[0] == -1 ? "hidden" : "visible", M.style.display = m[0] == -1 ? "none" : "", M.className = m[0] ? "dhx_multi_day_icon" : "dhx_multi_day_icon_small", this._dy_shift = (m[0] + 1) * h, this.config.multi_day_height_limit && (this._dy_shift = Math.min(this.config.multi_day_height_limit, this._dy_shift)), m[0] = 0, E != w && (S.style.overflowY = "auto", M.style.position = "fixed", M.style.top = "", M.style.left = "");
          }
        }
      return o;
    }, a._get_event_sday = function(o) {
      var l = this.date.day_start(new Date(o.start_date));
      return Math.round((l.valueOf() - this._min_date.valueOf()) / 864e5);
    }, a._get_event_mapped_end_date = function(o) {
      var l = o.end_date;
      if (this.config.separate_short_events) {
        var h = (o.end_date - o.start_date) / 6e4;
        h < this._min_mapped_duration && (l = this.date.add(l, this._min_mapped_duration - h, "minute"));
      }
      return l;
    }, a._pre_render_events_line = function(o, l) {
      o.sort(function(M, N) {
        return M.start_date.valueOf() == N.start_date.valueOf() ? M.id > N.id ? 1 : -1 : M.start_date > N.start_date ? 1 : -1;
      });
      var h = [], y = [];
      this._min_mapped_duration = Math.floor(60 * this.xy.min_event_height / this.config.hour_size_px);
      for (var m = 0; m < o.length; m++) {
        var f = o[m], u = f.start_date, v = f.end_date, c = u.getHours(), p = v.getHours();
        if (f._sday = this._get_event_sday(f), this._ignores[f._sday])
          o.splice(m, 1), m--;
        else {
          if (h[f._sday] || (h[f._sday] = []), !l) {
            f._inner = !1;
            for (var g = h[f._sday]; g.length; ) {
              var b = g[g.length - 1];
              if (!(this._get_event_mapped_end_date(b).valueOf() <= f.start_date.valueOf()))
                break;
              g.splice(g.length - 1, 1);
            }
            for (var x = g.length, k = !1, w = 0; w < g.length; w++)
              if (b = g[w], this._get_event_mapped_end_date(b).valueOf() <= f.start_date.valueOf()) {
                k = !0, f._sorder = b._sorder, x = w, f._inner = !0;
                break;
              }
            if (g.length && (g[g.length - 1]._inner = !0), !k)
              if (g.length)
                if (g.length <= g[g.length - 1]._sorder) {
                  if (g[g.length - 1]._sorder)
                    for (w = 0; w < g.length; w++) {
                      for (var E = !1, D = 0; D < g.length; D++)
                        if (g[D]._sorder == w) {
                          E = !0;
                          break;
                        }
                      if (!E) {
                        f._sorder = w;
                        break;
                      }
                    }
                  else
                    f._sorder = 0;
                  f._inner = !0;
                } else {
                  var S = g[0]._sorder;
                  for (w = 1; w < g.length; w++)
                    g[w]._sorder > S && (S = g[w]._sorder);
                  f._sorder = S + 1, f._inner = !1;
                }
              else
                f._sorder = 0;
            g.splice(x, x == g.length ? 0 : 1, f), g.length > (g.max_count || 0) ? (g.max_count = g.length, f._count = g.length) : f._count = f._count ? f._count : 1;
          }
          (c < this.config.first_hour || p >= this.config.last_hour) && (y.push(f), o[m] = f = this._copy_event(f), c < this.config.first_hour && (f.start_date.setHours(this.config.first_hour), f.start_date.setMinutes(0)), p >= this.config.last_hour && (f.end_date.setMinutes(0), f.end_date.setHours(this.config.last_hour)), f.start_date > f.end_date || c == this.config.last_hour) && (o.splice(m, 1), m--);
        }
      }
      if (!l) {
        for (m = 0; m < o.length; m++)
          o[m]._count = h[o[m]._sday].max_count;
        for (m = 0; m < y.length; m++)
          y[m]._count = h[y[m]._sday].max_count;
      }
      return o;
    }, a._time_order = function(o) {
      o.sort(function(l, h) {
        return l.start_date.valueOf() == h.start_date.valueOf() ? l._timed && !h._timed ? 1 : !l._timed && h._timed ? -1 : l.id > h.id ? 1 : -1 : l.start_date > h.start_date ? 1 : -1;
      });
    }, a._is_any_multiday_cell_visible = function(o, l, h) {
      var y = this._cols.length, m = !1, f = o, u = !0, v = new Date(l);
      for (a.date.day_start(new Date(l)).valueOf() != l.valueOf() && (v = a.date.day_start(v), v = a.date.add(v, 1, "day")); f < v; ) {
        u = !1;
        var c = this.locate_holder_day(f, !1, h) % y;
        if (!this._ignores[c]) {
          m = !0;
          break;
        }
        f = a.date.add(f, 1, "day");
      }
      return u || m;
    }, a._pre_render_events_table = function(o, l) {
      this._time_order(o);
      for (var h, y = [], m = [[], [], [], [], [], [], []], f = this._colsS.heights, u = this._cols.length, v = {}, c = 0; c < o.length; c++) {
        var p = o[c], g = p.id;
        v[g] || (v[g] = { first_chunk: !0, last_chunk: !0 });
        var b = v[g], x = h || p.start_date, k = p.end_date;
        x < this._min_date && (b.first_chunk = !1, x = this._min_date), k > this._max_date && (b.last_chunk = !1, k = this._max_date);
        var w = this.locate_holder_day(x, !1, p);
        if (p._sday = w % u, !this._ignores[p._sday] || !p._timed) {
          var E = this.locate_holder_day(k, !0, p) || u;
          if (p._eday = E % u || u, p._length = E - w, p._sweek = Math.floor((this._correct_shift(x.valueOf(), 1) - this._min_date.valueOf()) / (864e5 * u)), a._is_any_multiday_cell_visible(x, k, p)) {
            var D, S = m[p._sweek];
            for (D = 0; D < S.length && !(S[D]._eday <= p._sday); D++)
              ;
            if (p._sorder && l || (p._sorder = D), p._sday + p._length <= u)
              h = null, y.push(p), S[D] = p, f[p._sweek] = S.length - 1, p._first_chunk = b.first_chunk, p._last_chunk = b.last_chunk;
            else {
              var M = this._copy_event(p);
              M.id = p.id, M._length = u - p._sday, M._eday = u, M._sday = p._sday, M._sweek = p._sweek, M._sorder = p._sorder, M.end_date = this.date.add(x, M._length, "day"), M._first_chunk = b.first_chunk, b.first_chunk && (b.first_chunk = !1), y.push(M), S[D] = M, h = M.end_date, f[p._sweek] = S.length - 1, c--;
            }
          } else
            h = null;
        }
      }
      return y;
    }, a._copy_dummy = function() {
      var o = new Date(this.start_date), l = new Date(this.end_date);
      this.start_date = o, this.end_date = l;
    }, a._copy_event = function(o) {
      return this._copy_dummy.prototype = o, new this._copy_dummy();
    }, a._rendered = [], a.clear_view = function() {
      for (var o = 0; o < this._rendered.length; o++) {
        var l = this._rendered[o];
        l.parentNode && l.parentNode.removeChild(l);
      }
      this._rendered = [];
    }, a.updateEvent = function(o) {
      var l = this.getEvent(o);
      this.clear_event(o), l && this.is_visible_events(l) && this.filter_event(o, l) && (this._table_view || this.config.multi_day || l._timed) && (this.config.update_render ? this.render_view_data() : this.getState().mode != "month" || this.getState().drag_id || this.isOneDayEvent(l) ? this.render_view_data([l], !0) : this.render_view_data());
    }, a.clear_event = function(o) {
      this.for_rendered(o, function(l, h) {
        l.parentNode && l.parentNode.removeChild(l), a._rendered.splice(h, 1);
      });
    }, a._y_from_date = function(o) {
      var l = 60 * o.getHours() + o.getMinutes();
      return Math.round((60 * l * 1e3 - 60 * this.config.first_hour * 60 * 1e3) * this.config.hour_size_px / 36e5) % (24 * this.config.hour_size_px);
    }, a._calc_event_y = function(o, l) {
      l = l || 0;
      var h = 60 * o.start_date.getHours() + o.start_date.getMinutes(), y = 60 * o.end_date.getHours() + o.end_date.getMinutes() || 60 * a.config.last_hour;
      return { top: this._y_from_date(o.start_date), height: Math.max(l, (y - h) * this.config.hour_size_px / 60) };
    }, a.render_event = function(o, l, h) {
      var y = a.xy.menu_width, m = this.config.use_select_menu_space ? 0 : y;
      if (!(o._sday < 0)) {
        var f = a.locate_holder(o._sday);
        if (f) {
          l = l || f;
          var u = this._calc_event_y(o, a.xy.min_event_height), v = u.top, c = u.height, p = o._count || 1, g = o._sorder || 0;
          h = h || f.clientWidth, this.config.day_column_padding && (h -= this.config.day_column_padding);
          var b = Math.floor((h - m) / p), x = g * b + 1;
          if (o._inner || (b *= p - g), this.config.cascade_event_display) {
            var k = this.config.cascade_event_count, w = this.config.cascade_event_margin;
            x = g % k * w;
            var E = o._inner ? (p - g - 1) % k * w / 2 : 0;
            b = Math.floor(h - m - x - E);
          }
          o._mode = c < 30 ? "smallest" : c < 42 ? "small" : null;
          var D = this._render_v_bar(o, m + x, v, b, c, o._text_style, a.templates.event_header(o.start_date, o.end_date, o), a.templates.event_text(o.start_date, o.end_date, o));
          if (o._mode === "smallest" ? D.classList.add("dhx_cal_event--xsmall") : o._mode === "small" && D.classList.add("dhx_cal_event--small"), this._waiAria.eventAttr(o, D), this._rendered.push(D), l.appendChild(D), x = x + parseInt(this.config.rtl ? f.style.right : f.style.left, 10) + m, this._edit_id == o.id) {
            D.style.zIndex = 1, b = Math.max(b, a.xy.editor_width), (D = document.createElement("div")).setAttribute("event_id", o.id), D.setAttribute(this.config.event_attribute, o.id), this._waiAria.eventAttr(o, D), D.className = "dhx_cal_event dhx_cal_editor", this.config.rtl && x++, this.set_xy(D, b, c, x, v), o.color && D.style.setProperty("--dhx-scheduler-event-background", o.color);
            var S = a.templates.event_class(o.start_date, o.end_date, o);
            S && (D.className += " " + S);
            var M = document.createElement("div");
            M.style.cssText += "overflow:hidden;height:100%", D.appendChild(M), this._els.dhx_cal_data[0].appendChild(D), this._rendered.push(D), M.innerHTML = "<textarea class='dhx_cal_editor'>" + o.text + "</textarea>", this._editor = M.querySelector("textarea"), a.event(this._editor, "keydown", function(O) {
              if (O.shiftKey)
                return !0;
              var $ = O.keyCode;
              $ == a.keys.edit_save && a.editStop(!0), $ == a.keys.edit_cancel && a.editStop(!1), $ != a.keys.edit_save && $ != a.keys.edit_cancel || O.preventDefault && O.preventDefault();
            }), a.event(this._editor, "selectstart", function(O) {
              return O.cancelBubble = !0, !0;
            }), a._focus(this._editor, !0), this._els.dhx_cal_data[0].scrollLeft = 0;
          }
          if (this.xy.menu_width !== 0 && this._select_id == o.id) {
            this.config.cascade_event_display && this._drag_mode && (D.style.zIndex = 1);
            for (var N, T = this.config["icons_" + (this._edit_id == o.id ? "edit" : "select")], A = "", C = 0; C < T.length; C++) {
              const O = T[C];
              N = this._waiAria.eventMenuAttrString(O), A += `<div class='dhx_menu_icon ${O}' title='${this.locale.labels[O]}' ${N}></div>`;
            }
            var H = this._render_v_bar(o, x - y - 1, v, y, null, "", "<div class='dhx_menu_head'></div>", A, !0);
            o.color && H.style.setProperty("--dhx-scheduler-event-background", o.color), o.textColor && H.style.setProperty("--dhx-scheduler-event-color", o.textColor), this._els.dhx_cal_data[0].appendChild(H), this._rendered.push(H);
          }
          this.config.drag_highlight && this._drag_id == o.id && this.highlightEventPosition(o);
        }
      }
    }, a._render_v_bar = function(o, l, h, y, m, f, u, v, c) {
      var p = document.createElement("div"), g = o.id, b = c ? "dhx_cal_event dhx_cal_select_menu" : "dhx_cal_event", x = a.getState();
      x.drag_id == o.id && (b += " dhx_cal_event_drag"), x.select_id == o.id && (b += " dhx_cal_event_selected");
      var k = a.templates.event_class(o.start_date, o.end_date, o);
      k && (b = b + " " + k), this.config.cascade_event_display && (b += " dhx_cal_event_cascade");
      var w = y - 1, E = `<div event_id="${g}" ${this.config.event_attribute}="${g}" class="${b}"
				style="position:absolute; top:${h}px; ${this.config.rtl ? "right:" : "left:"}${l}px; width:${w}px; height:${m}px; ${f || ""}" 
				data-bar-start="${o.start_date.valueOf()}" data-bar-end="${o.end_date.valueOf()}">
				</div>`;
      p.innerHTML = E;
      var D = p.cloneNode(!0).firstChild;
      if (!c && a.renderEvent(D, o, y, m, u, v))
        return o.color && D.style.setProperty("--dhx-scheduler-event-background", o.color), o.textColor && D.style.setProperty("--dhx-scheduler-event-color", o.textColor), D;
      D = p.firstChild, o.color && D.style.setProperty("--dhx-scheduler-event-background", o.color), o.textColor && D.style.setProperty("--dhx-scheduler-event-color", o.textColor);
      var S = '<div class="dhx_event_move dhx_header" >&nbsp;</div>';
      S += '<div class="dhx_event_move dhx_title">' + u + "</div>", S += '<div class="dhx_body">' + v + "</div>";
      var M = "dhx_event_resize dhx_footer";
      return (c || o._drag_resize === !1) && (M = "dhx_resize_denied " + M), S += '<div class="' + M + '" style=" width:' + (c ? " margin-top:-1px;" : "") + '" ></div>', D.innerHTML = S, D;
    }, a.renderEvent = function() {
      return !1;
    }, a.locate_holder = function(o) {
      return this._mode == "day" ? this._els.dhx_cal_data[0].firstChild : this._els.dhx_cal_data[0].childNodes[o];
    }, a.locate_holder_day = function(o, l) {
      var h = Math.floor((this._correct_shift(o, 1) - this._min_date) / 864e5);
      return l && this.date.time_part(o) && h++, h;
    }, a._get_dnd_order = function(o, l, h) {
      if (!this._drag_event)
        return o;
      this._drag_event._orig_sorder ? o = this._drag_event._orig_sorder : this._drag_event._orig_sorder = o;
      for (var y = l * o; y + l > h; )
        o--, y -= l;
      return Math.max(o, 0);
    }, a._get_event_bar_pos = function(o) {
      var l = this.config.rtl, h = this._colsS, y = h[o._sday], m = h[o._eday];
      l && (y = h[h.col_length] - h[o._eday] + h[0], m = h[h.col_length] - h[o._sday] + h[0]), m == y && (m = h[o._eday + 1]);
      var f = this.xy.bar_height, u = o._sorder;
      if (o.id == this._drag_id) {
        var v = h.heights[o._sweek + 1] - h.heights[o._sweek] - this.xy.month_head_height;
        u = a._get_dnd_order(u, f, v);
      }
      var c = u * f;
      return { x: y, x2: m, y: h.heights[o._sweek] + (h.height ? this.xy.month_scale_height + 2 : 2) + c };
    }, a.render_event_bar = function(o) {
      var l = this._rendered_location, h = this._get_event_bar_pos(o), y = h.y, m = h.x, f = h.x2, u = "";
      if (f) {
        var v = a.config.resize_month_events && this._mode == "month" && (!o._timed || a.config.resize_month_timed), c = document.createElement("div"), p = o.hasOwnProperty("_first_chunk") && o._first_chunk, g = o.hasOwnProperty("_last_chunk") && o._last_chunk, b = v && (o._timed || p), x = v && (o._timed || g), k = !0, w = "dhx_cal_event_clear";
        o._timed && !v || (k = !1, w = "dhx_cal_event_line"), p && (w += " dhx_cal_event_line_start"), g && (w += " dhx_cal_event_line_end"), b && (u += "<div class='dhx_event_resize dhx_event_resize_start'></div>"), x && (u += "<div class='dhx_event_resize dhx_event_resize_end'></div>");
        var E = a.templates.event_class(o.start_date, o.end_date, o);
        E && (w += " " + E);
        var D = o.color ? "--dhx-scheduler-event-background:" + o.color + ";" : "", S = o.textColor ? "--dhx-scheduler-event-color:" + o.textColor + ";" : "", M = ["position:absolute", "top:" + y + "px", "left:" + m + "px", "width:" + (f - m - (k ? 1 : 0)) + "px", "height:" + (this.xy.bar_height - 2) + "px", S, D, o._text_style || ""].join(";"), N = "<div event_id='" + o.id + "' " + this.config.event_attribute + "='" + o.id + "' class='" + w + "' style='" + M + "'" + this._waiAria.eventBarAttrString(o) + ">";
        v && (N += u), a.getState().mode == "month" && (o = a.getEvent(o.id)), o._timed && (N += `<span class='dhx_cal_event_clear_date'>${a.templates.event_bar_date(o.start_date, o.end_date, o)}</span>`), N += "<div class='dhx_cal_event_line_content'>", N += a.templates.event_bar_text(o.start_date, o.end_date, o) + "</div>", N += "</div>", N += "</div>", c.innerHTML = N, this._rendered.push(c.firstChild), l.appendChild(c.firstChild);
      }
    }, a._locate_event = function(o) {
      for (var l = null; o && !l && o.getAttribute; )
        l = o.getAttribute(this.config.event_attribute), o = o.parentNode;
      return l;
    }, a.edit = function(o) {
      this._edit_id != o && (this.editStop(!1, o), this._edit_id = o, this.updateEvent(o));
    }, a.editStop = function(o, l) {
      if (!l || this._edit_id != l) {
        var h = this.getEvent(this._edit_id);
        h && (o && (h.text = this._editor.value), this._edit_id = null, this._editor = null, this.updateEvent(h.id), this._edit_stop_event(h, o));
      }
    }, a._edit_stop_event = function(o, l) {
      this._new_event ? (l ? this.callEvent("onEventAdded", [o.id, o]) : o && this.deleteEvent(o.id, !0), this._new_event = null) : l && this.callEvent("onEventChanged", [o.id, o]);
    }, a.getEvents = function(o, l) {
      var h = [];
      for (var y in this._events) {
        var m = this._events[y];
        m && (!o && !l || m.start_date < l && m.end_date > o) && h.push(m);
      }
      return h;
    }, a.getRenderedEvent = function(o) {
      if (o) {
        for (var l = a._rendered, h = 0; h < l.length; h++) {
          var y = l[h];
          if (y.getAttribute(a.config.event_attribute) == o)
            return y;
        }
        return null;
      }
    }, a.showEvent = function(o, l) {
      o && typeof o == "object" && (l = o.mode, g = o.section, o = o.section);
      var h = typeof o == "number" || typeof o == "string" ? a.getEvent(o) : o;
      if (l = l || a._mode, h && (!this.checkEvent("onBeforeEventDisplay") || this.callEvent("onBeforeEventDisplay", [h, l]))) {
        var y = a.config.scroll_hour;
        a.config.scroll_hour = h.start_date.getHours();
        var m = a.config.preserve_scroll;
        a.config.preserve_scroll = !1;
        var f = h.color, u = h.textColor;
        if (a.config.highlight_displayed_event && (h.color = a.config.displayed_event_color, h.textColor = a.config.displayed_event_text_color), a.setCurrentView(new Date(h.start_date), l), a.config.scroll_hour = y, a.config.preserve_scroll = m, a.matrix && a.matrix[l]) {
          var v = a.getView(), c = v.y_property, p = a.getEvent(h.id);
          if (p) {
            if (!g) {
              var g = p[c];
              Array.isArray(g) ? g = g[0] : typeof g == "string" && a.config.section_delimiter && g.indexOf(a.config.section_delimiter) > -1 && (g = g.split(a.config.section_delimiter)[0]);
            }
            var b = v.getSectionTop(g), x = v.posFromDate(p.start_date), k = a.$container.querySelector(".dhx_timeline_data_wrapper");
            if (x -= (k.offsetWidth - v.dx) / 2, b = b - k.offsetHeight / 2 + v.dy / 2, v._smartRenderingEnabled())
              var w = v.attachEvent("onScroll", function() {
                E(), v.detachEvent(w);
              });
            v.scrollTo({ left: x, top: b }), v._smartRenderingEnabled() || E();
          }
        } else
          E();
        a.callEvent("onAfterEventDisplay", [h, l]);
      }
      function E() {
        h.color = f, h.textColor = u;
      }
    };
  }(i), function(a) {
    a._append_drag_marker = function(o) {
      if (!o.parentNode) {
        var l = a._els.dhx_cal_data[0].lastChild, h = a._getClassName(l);
        h.indexOf("dhx_scale_holder") < 0 && l.previousSibling && (l = l.previousSibling), h = a._getClassName(l), l && h.indexOf("dhx_scale_holder") === 0 && l.appendChild(o);
      }
    }, a._update_marker_position = function(o, l) {
      var h = a._calc_event_y(l, 0);
      o.style.top = h.top + "px", o.style.height = h.height + "px";
    }, a.highlightEventPosition = function(o) {
      var l = document.createElement("div");
      l.setAttribute("event_id", o.id), l.setAttribute(this.config.event_attribute, o.id), this._rendered.push(l), this._update_marker_position(l, o);
      var h = this.templates.drag_marker_class(o.start_date, o.end_date, o), y = this.templates.drag_marker_content(o.start_date, o.end_date, o);
      l.className = "dhx_drag_marker", h && (l.className += " " + h), y && (l.innerHTML = y), this._append_drag_marker(l);
    };
  }(i), Aa(i), function(a) {
    function o() {
      const l = a.config.csp === !0, h = !!window.Sfdc || !!window.$A || window.Aura || "$shadowResolver$" in document.body;
      return l || h ? a.$root : document.body;
    }
    a._lightbox_controls = {}, a.formSection = function(l) {
      for (var h = this.config.lightbox.sections, y = 0; y < h.length && h[y].name != l; y++)
        ;
      if (y === h.length)
        return null;
      var m = h[y];
      a._lightbox || a.getLightbox();
      var f = a._lightbox.querySelector(`#${m.id}`), u = f.nextSibling, v = { section: m, header: f, node: u, getValue: function(p) {
        return a.form_blocks[m.type].get_value(u, p || {}, m);
      }, setValue: function(p, g) {
        return a.form_blocks[m.type].set_value(u, p, g || {}, m);
      } }, c = a._lightbox_controls["get_" + m.type + "_control"];
      return c ? c(v) : v;
    }, a._lightbox_controls.get_template_control = function(l) {
      return l.control = l.node, l;
    }, a._lightbox_controls.get_select_control = function(l) {
      return l.control = l.node.getElementsByTagName("select")[0], l;
    }, a._lightbox_controls.get_textarea_control = function(l) {
      return l.control = l.node.getElementsByTagName("textarea")[0], l;
    }, a._lightbox_controls.get_time_control = function(l) {
      return l.control = l.node.getElementsByTagName("select"), l;
    }, a._lightbox_controls.defaults = { template: { height: 30 }, textarea: { height: 200 }, select: { height: 23 }, time: { height: 20 } }, a.form_blocks = { template: { render: function(l) {
      return "<div class='dhx_cal_ltext dhx_cal_template' ></div>";
    }, set_value: function(l, h, y, m) {
      l.innerHTML = h || "";
    }, get_value: function(l, h, y) {
      return l.innerHTML || "";
    }, focus: function(l) {
    } }, textarea: { render: function(l) {
      return `<div class='dhx_cal_ltext'><textarea ${l.placeholder ? `placeholder='${l.placeholder}'` : ""}></textarea></div>`;
    }, set_value: function(l, h, y) {
      a.form_blocks.textarea._get_input(l).value = h || "";
    }, get_value: function(l, h) {
      return a.form_blocks.textarea._get_input(l).value;
    }, focus: function(l) {
      var h = a.form_blocks.textarea._get_input(l);
      a._focus(h, !0);
    }, _get_input: function(l) {
      return l.getElementsByTagName("textarea")[0];
    } }, select: { render: function(l) {
      for (var h = "<div class='dhx_cal_ltext dhx_cal_select'><select style='width:100%;'>", y = 0; y < l.options.length; y++)
        h += "<option value='" + l.options[y].key + "'>" + l.options[y].label + "</option>";
      return h + "</select></div>";
    }, set_value: function(l, h, y, m) {
      var f = l.firstChild;
      !f._dhx_onchange && m.onchange && (a.event(f, "change", m.onchange), f._dhx_onchange = !0), h === void 0 && (h = (f.options[0] || {}).value), f.value = h || "";
    }, get_value: function(l, h) {
      return l.firstChild.value;
    }, focus: function(l) {
      var h = l.firstChild;
      a._focus(h, !0);
    } }, time: { render: function(l) {
      l.time_format || (l.time_format = ["%H:%i", "%d", "%m", "%Y"]), l._time_format_order = {};
      var h = l.time_format, y = a.config, m = a.date.date_part(a._currentDate()), f = 1440, u = 0;
      a.config.limit_time_select && (f = 60 * y.last_hour + 1, u = 60 * y.first_hour, m.setHours(y.first_hour));
      for (var v = "", c = 0; c < h.length; c++) {
        var p = h[c];
        c > 0 && (v += " ");
        var g = "", b = "";
        switch (p) {
          case "%Y":
            var x, k, w;
            g = "dhx_lightbox_year_select", l._time_format_order[3] = c, l.year_range && (isNaN(l.year_range) ? l.year_range.push && (k = l.year_range[0], w = l.year_range[1]) : x = l.year_range), x = x || 10;
            var E = E || Math.floor(x / 2);
            k = k || m.getFullYear() - E, w = w || k + x;
            for (var D = k; D < w; D++)
              b += "<option value='" + D + "'>" + D + "</option>";
            break;
          case "%m":
            for (g = "dhx_lightbox_month_select", l._time_format_order[2] = c, D = 0; D < 12; D++)
              b += "<option value='" + D + "'>" + this.locale.date.month_full[D] + "</option>";
            break;
          case "%d":
            for (g = "dhx_lightbox_day_select", l._time_format_order[1] = c, D = 1; D < 32; D++)
              b += "<option value='" + D + "'>" + D + "</option>";
            break;
          case "%H:%i":
            g = "dhx_lightbox_time_select", l._time_format_order[0] = c, D = u;
            var S = m.getDate();
            for (l._time_values = []; D < f; )
              b += "<option value='" + D + "'>" + this.templates.time_picker(m) + "</option>", l._time_values.push(D), m.setTime(m.valueOf() + 60 * this.config.time_step * 1e3), D = 24 * (m.getDate() != S ? 1 : 0) * 60 + 60 * m.getHours() + m.getMinutes();
        }
        if (b) {
          var M = a._waiAria.lightboxSelectAttrString(p);
          v += "<select class='" + g + "' " + (l.readonly ? "disabled='disabled'" : "") + M + ">" + b + "</select> ";
        }
      }
      return "<div class='dhx_section_time'>" + v + "<span style='font-weight:normal; font-size:10pt;' class='dhx_section_time_spacer'> &nbsp;&ndash;&nbsp; </span>" + v + "</div>";
    }, set_value: function(l, h, y, m) {
      var f, u, v = a.config, c = l.getElementsByTagName("select"), p = m._time_format_order;
      if (v.full_day) {
        if (!l._full_day) {
          var g = "<label class='dhx_fullday'><input type='checkbox' name='full_day' value='true'> " + a.locale.labels.full_day + "&nbsp;</label></input>";
          a.config.wide_form || (g = l.previousSibling.innerHTML + g), l.previousSibling.innerHTML = g, l._full_day = !0;
        }
        var b = l.previousSibling.getElementsByTagName("input")[0];
        b.checked = a.date.time_part(y.start_date) === 0 && a.date.time_part(y.end_date) === 0, c[p[0]].disabled = b.checked, c[p[0] + c.length / 2].disabled = b.checked, b.$_eventAttached || (b.$_eventAttached = !0, a.event(b, "click", function() {
          if (b.checked) {
            var E = {};
            a.form_blocks.time.get_value(l, E, m), f = a.date.date_part(E.start_date), (+(u = a.date.date_part(E.end_date)) == +f || +u >= +f && (y.end_date.getHours() !== 0 || y.end_date.getMinutes() !== 0)) && (u = a.date.add(u, 1, "day"));
          } else
            f = null, u = null;
          c[p[0]].disabled = b.checked, c[p[0] + c.length / 2].disabled = b.checked, w(c, 0, f || y.start_date), w(c, 4, u || y.end_date);
        }));
      }
      if (v.auto_end_date && v.event_duration)
        for (var x = function() {
          v.auto_end_date && v.event_duration && (f = new Date(c[p[3]].value, c[p[2]].value, c[p[1]].value, 0, c[p[0]].value), u = new Date(f.getTime() + 60 * a.config.event_duration * 1e3), w(c, 4, u));
        }, k = 0; k < 4; k++)
          c[k].$_eventAttached || (c[k].$_eventAttached = !0, a.event(c[k], "change", x));
      function w(E, D, S) {
        for (var M = m._time_values, N = 60 * S.getHours() + S.getMinutes(), T = N, A = !1, C = 0; C < M.length; C++) {
          var H = M[C];
          if (H === N) {
            A = !0;
            break;
          }
          H < N && (T = H);
        }
        E[D + p[0]].value = A ? N : T, A || T || (E[D + p[0]].selectedIndex = -1), E[D + p[1]].value = S.getDate(), E[D + p[2]].value = S.getMonth(), E[D + p[3]].value = S.getFullYear();
      }
      w(c, 0, y.start_date), w(c, 4, y.end_date);
    }, get_value: function(l, h, y) {
      var m = l.getElementsByTagName("select"), f = y._time_format_order;
      if (h.start_date = new Date(m[f[3]].value, m[f[2]].value, m[f[1]].value, 0, m[f[0]].value), h.end_date = new Date(m[f[3] + 4].value, m[f[2] + 4].value, m[f[1] + 4].value, 0, m[f[0] + 4].value), !m[f[3]].value || !m[f[3] + 4].value) {
        var u = a.getEvent(a._lightbox_id);
        u && (h.start_date = u.start_date, h.end_date = u.end_date);
      }
      return h.end_date <= h.start_date && (h.end_date = a.date.add(h.start_date, a.config.time_step, "minute")), { start_date: new Date(h.start_date), end_date: new Date(h.end_date) };
    }, focus: function(l) {
      a._focus(l.getElementsByTagName("select")[0]);
    } } }, a._setLbPosition = function(l) {
      l && (l.style.top = Math.max(o().offsetHeight / 2 - l.offsetHeight / 2, 0) + "px", l.style.left = Math.max(o().offsetWidth / 2 - l.offsetWidth / 2, 0) + "px");
    }, a.showCover = function(l) {
      l && (l.style.display = "block", this._setLbPosition(l)), a.config.responsive_lightbox && (document.documentElement.classList.add("dhx_cal_overflow_container"), o().classList.add("dhx_cal_overflow_container")), this.show_cover(), this._cover.style.display = "";
    }, a.showLightbox = function(l) {
      if (l)
        if (this.callEvent("onBeforeLightbox", [l])) {
          this.showCover(h);
          var h = this.getLightbox();
          this._setLbPosition(h), this._fill_lightbox(l, h), this._waiAria.lightboxVisibleAttr(h), this.callEvent("onLightbox", [l]);
        } else
          this._new_event && (this._new_event = null);
    }, a._fill_lightbox = function(l, h) {
      var y = this.getEvent(l), m = h.getElementsByTagName("span"), f = [];
      if (a.templates.lightbox_header) {
        f.push("");
        var u = a.templates.lightbox_header(y.start_date, y.end_date, y);
        f.push(u), m[1].innerHTML = "", m[2].innerHTML = u;
      } else {
        var v = this.templates.event_header(y.start_date, y.end_date, y), c = (this.templates.event_bar_text(y.start_date, y.end_date, y) || "").substr(0, 70);
        f.push(v), f.push(c), m[1].innerHTML = v, m[2].innerHTML = c;
      }
      this._waiAria.lightboxHeader(h, f.join(" "));
      for (var p = this.config.lightbox.sections, g = 0; g < p.length; g++) {
        var b = p[g], x = a._get_lightbox_section_node(b), k = this.form_blocks[b.type], w = y[b.map_to] !== void 0 ? y[b.map_to] : b.default_value;
        k.set_value.call(this, x, w, y, b), p[g].focus && k.focus.call(this, x);
      }
      a._lightbox_id = l;
    }, a._get_lightbox_section_node = function(l) {
      return a._lightbox.querySelector(`#${l.id}`).nextSibling;
    }, a._lightbox_out = function(l) {
      for (var h = this.config.lightbox.sections, y = 0; y < h.length; y++) {
        var m = a._lightbox.querySelector(`#${h[y].id}`);
        m = m && m.nextSibling;
        var f = this.form_blocks[h[y].type].get_value.call(this, m, l, h[y]);
        h[y].map_to != "auto" && (l[h[y].map_to] = f);
      }
      return l;
    }, a._empty_lightbox = function(l) {
      var h = a._lightbox_id, y = this.getEvent(h);
      this._lame_copy(y, l), this.setEvent(y.id, y), this._edit_stop_event(y, !0), this.render_view_data();
    }, a.hide_lightbox = function(l) {
      a.endLightbox(!1, this.getLightbox());
    }, a.hideCover = function(l) {
      l && (l.style.display = "none"), this.hide_cover(), a.config.responsive_lightbox && (document.documentElement.classList.remove("dhx_cal_overflow_container"), o().classList.remove("dhx_cal_overflow_container"));
    }, a.hide_cover = function() {
      this._cover && this._cover.parentNode.removeChild(this._cover), this._cover = null;
    }, a.show_cover = function() {
      this._cover || (this._cover = document.createElement("div"), this._cover.className = "dhx_cal_cover", this._cover.style.display = "none", a.event(this._cover, "mousemove", a._move_while_dnd), a.event(this._cover, "mouseup", a._finish_dnd), o().appendChild(this._cover));
    }, a.save_lightbox = function() {
      var l = this._lightbox_out({}, this._lame_copy(this.getEvent(this._lightbox_id)));
      this.checkEvent("onEventSave") && !this.callEvent("onEventSave", [this._lightbox_id, l, this._new_event]) || (this._empty_lightbox(l), this.hide_lightbox());
    }, a.startLightbox = function(l, h) {
      this._lightbox_id = l, this._custom_lightbox = !0, this._temp_lightbox = this._lightbox, this._lightbox = h, this.showCover(h);
    }, a.endLightbox = function(l, h) {
      h = h || a.getLightbox();
      var y = a.getEvent(this._lightbox_id);
      y && this._edit_stop_event(y, l), l && a.render_view_data(), this.hideCover(h), this._custom_lightbox && (this._lightbox = this._temp_lightbox, this._custom_lightbox = !1), this._temp_lightbox = this._lightbox_id = null, this._waiAria.lightboxHiddenAttr(h), this.resetLightbox(), this.callEvent("onAfterLightbox", []);
    }, a.resetLightbox = function() {
      a._lightbox && !a._custom_lightbox && a._lightbox.parentNode.removeChild(a._lightbox), a._lightbox = null;
    }, a.cancel_lightbox = function() {
      this._lightbox_id && this.callEvent("onEventCancel", [this._lightbox_id, !!this._new_event]), this.hide_lightbox();
    }, a.hideLightbox = a.cancel_lightbox, a._init_lightbox_events = function() {
      if (this.getLightbox().$_eventAttached)
        return;
      const l = this.getLightbox();
      l.$_eventAttached = !0, a.event(l, "click", function(h) {
        h.target.closest(".dhx_cal_ltitle_close_btn") && a.cancel_lightbox();
        const y = a.$domHelpers.closest(h.target, ".dhx_btn_set");
        if (!y) {
          const u = a.$domHelpers.closest(h.target, ".dhx_custom_button[data-section-index]");
          if (u) {
            const v = Number(u.getAttribute("data-section-index"));
            a.form_blocks[a.config.lightbox.sections[v].type].button_click(a.$domHelpers.closest(u, ".dhx_cal_lsection"), u, h);
          }
          return;
        }
        const m = y ? y.getAttribute("data-action") : null;
        switch (m) {
          case "dhx_save_btn":
          case "save":
            if (a.config.readonly_active)
              return;
            a.save_lightbox();
            break;
          case "dhx_delete_btn":
          case "delete":
            if (a.config.readonly_active)
              return;
            var f = a.locale.labels.confirm_deleting;
            a._dhtmlx_confirm({ message: f, title: a.locale.labels.title_confirm_deleting, callback: function() {
              a.deleteEvent(a._lightbox_id), a._new_event = null, a.hide_lightbox();
            }, config: { ok: a.locale.labels.icon_delete } });
            break;
          case "dhx_cancel_btn":
          case "cancel":
            a.cancel_lightbox();
            break;
          default:
            a.callEvent("onLightboxButton", [m, y, h]);
        }
      }), a.event(l, "keydown", function(h) {
        var y = h || window.event, m = h.target || h.srcElement, f = m.querySelector("[dhx_button]");
        switch (f || (f = m.parentNode.querySelector(".dhx_custom_button, .dhx_readonly")), (h || y).keyCode) {
          case 32:
            if ((h || y).shiftKey)
              return;
            f && f.click && f.click();
            break;
          case a.keys.edit_save:
            if ((h || y).shiftKey)
              return;
            if (f && f.click)
              f.click();
            else {
              if (a.config.readonly_active)
                return;
              a.save_lightbox();
            }
            break;
          case a.keys.edit_cancel:
            a.cancel_lightbox();
        }
      });
    }, a.setLightboxSize = function() {
    }, a._init_dnd_events = function() {
      a.event(o(), "mousemove", a._move_while_dnd), a.event(o(), "mouseup", a._finish_dnd), a._init_dnd_events = function() {
      };
    }, a._move_while_dnd = function(l) {
      if (a._dnd_start_lb) {
        document.dhx_unselectable || (o().classList.add("dhx_unselectable"), document.dhx_unselectable = !0);
        var h = a.getLightbox(), y = [l.pageX, l.pageY];
        h.style.top = a._lb_start[1] + y[1] - a._dnd_start_lb[1] + "px", h.style.left = a._lb_start[0] + y[0] - a._dnd_start_lb[0] + "px";
      }
    }, a._ready_to_dnd = function(l) {
      var h = a.getLightbox();
      a._lb_start = [h.offsetLeft, h.offsetTop], a._dnd_start_lb = [l.pageX, l.pageY];
    }, a._finish_dnd = function() {
      a._lb_start && (a._lb_start = a._dnd_start_lb = !1, o().classList.remove("dhx_unselectable"), document.dhx_unselectable = !1);
    }, a.getLightbox = function() {
      if (!this._lightbox) {
        var l = document.createElement("div");
        l.className = "dhx_cal_light", a.config.wide_form && (l.className += " dhx_cal_light_wide"), a.form_blocks.recurring && (l.className += " dhx_cal_light_rec"), a.config.rtl && (l.className += " dhx_cal_light_rtl"), a.config.responsive_lightbox && (l.className += " dhx_cal_light_responsive"), l.style.visibility = "hidden";
        var h = this._lightbox_template, y = this.config.buttons_left;
        h += "<div class='dhx_cal_lcontrols'>";
        for (var m = 0; m < y.length; m++)
          h += "<div " + this._waiAria.lightboxButtonAttrString(y[m]) + " data-action='" + y[m] + "' class='dhx_btn_set dhx_" + (a.config.rtl ? "right" : "left") + "_btn_set " + y[m] + "_set'><div class='dhx_btn_inner " + y[m] + "'></div><div>" + a.locale.labels[y[m]] + "</div></div>";
        y = this.config.buttons_right;
        var f = a.config.rtl;
        for (m = 0; m < y.length; m++)
          h += "<div class='dhx_cal_lcontrols_push_right'></div>", h += "<div " + this._waiAria.lightboxButtonAttrString(y[m]) + " data-action='" + y[m] + "' class='dhx_btn_set dhx_" + (f ? "left" : "right") + "_btn_set " + y[m] + "_set'><div class='dhx_btn_inner " + y[m] + "'></div><div>" + a.locale.labels[y[m]] + "</div></div>";
        h += "</div>", h += "</div>", l.innerHTML = h, a.config.drag_lightbox && (a.event(l.firstChild, "mousedown", a._ready_to_dnd), a.event(l.firstChild, "selectstart", function(x) {
          return x.preventDefault(), !1;
        }), l.firstChild.style.cursor = "move", a._init_dnd_events()), this._waiAria.lightboxAttr(l), this.show_cover(), this._cover.insertBefore(l, this._cover.firstChild), this._lightbox = l;
        var u = this.config.lightbox.sections;
        for (h = "", m = 0; m < u.length; m++) {
          var v = this.form_blocks[u[m].type];
          if (v) {
            u[m].id = "area_" + this.uid();
            var c = "";
            u[m].button && (c = "<div " + a._waiAria.lightboxSectionButtonAttrString(this.locale.labels["button_" + u[m].button]) + " class='dhx_custom_button' data-section-index='" + m + "' index='" + m + "'><div class='dhx_custom_button_" + u[m].button + "'></div><div>" + this.locale.labels["button_" + u[m].button] + "</div></div>"), this.config.wide_form && (h += "<div class='dhx_wrap_section'>");
            var p = this.locale.labels["section_" + u[m].name];
            typeof p != "string" && (p = u[m].name), h += "<div id='" + u[m].id + "' class='dhx_cal_lsection dhx_cal_lsection_" + u[m].name + "'>" + c + "<label>" + p + "</label></div>" + v.render.call(this, u[m]), h += "</div>";
          }
        }
        var g = l.getElementsByTagName("div");
        for (m = 0; m < g.length; m++) {
          var b = g[m];
          if (a._getClassName(b) == "dhx_cal_larea") {
            b.innerHTML = h;
            break;
          }
        }
        a._bindLightboxLabels(u), this.setLightboxSize(), this._init_lightbox_events(this), l.style.visibility = "visible";
      }
      return this._lightbox;
    }, a._bindLightboxLabels = function(l) {
      for (var h = 0; h < l.length; h++) {
        var y = l[h];
        if (y.id && a._lightbox.querySelector(`#${y.id}`)) {
          for (var m = a._lightbox.querySelector(`#${y.id}`).querySelector("label"), f = a._get_lightbox_section_node(y); f && !f.querySelector; )
            f = f.nextSibling;
          var u = !0;
          if (f) {
            var v = f.querySelector("input, select, textarea");
            v && (y.inputId = v.id || "input_" + a.uid(), v.id || (v.id = y.inputId), m.setAttribute("for", y.inputId), u = !1);
          }
          u && a.form_blocks[y.type].focus && a.event(m, "click", function(c) {
            return function() {
              var p = a.form_blocks[c.type], g = a._get_lightbox_section_node(c);
              p && p.focus && p.focus.call(a, g);
            };
          }(y));
        }
      }
    }, a.attachEvent("onEventIdChange", function(l, h) {
      this._lightbox_id == l && (this._lightbox_id = h);
    }), a._lightbox_template = `<div class='dhx_cal_ltitle'><div class="dhx_cal_ltitle_descr"><span class='dhx_mark'>&nbsp;</span><span class='dhx_time'></span><span class='dhx_title'></span>
</div>
<div class="dhx_cal_ltitle_controls">
<a class="dhx_cal_ltitle_close_btn scheduler_icon close"></a>
</div></div><div class='dhx_cal_larea'></div>`;
  }(i), Ca(i), function(a) {
    a.getRootView = function() {
      return { view: { render: function() {
        return { tag: "div", type: 1, attrs: { style: "width:100%;height:100%;" }, hooks: { didInsert: function() {
          a.setCurrentView();
        } }, body: [{ el: this.el, type: 1 }] };
      }, init: function() {
        var o = document.createElement("DIV");
        o.id = "scheduler_" + a.uid(), o.style.width = "100%", o.style.height = "100%", o.classList.add("dhx_cal_container"), o.cmp = "grid", o.innerHTML = '<div class="dhx_cal_navline"><div class="dhx_cal_prev_button"></div><div class="dhx_cal_next_button"></div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div><div class="dhx_cal_tab" data-tab="day"></div><div class="dhx_cal_tab" data-tab="week"></div><div class="dhx_cal_tab" data-tab="month"></div></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>', a.init(o), this.el = o;
      } }, type: 4 };
    };
  }(i), Oa(i), window.jQuery && (n = window.jQuery, s = 0, r = [], n.fn.dhx_scheduler = function(a) {
    if (typeof a != "string") {
      var o = [];
      return this.each(function() {
        if (this && this.getAttribute)
          if (this.getAttribute("dhxscheduler"))
            o.push(window[this.getAttribute("dhxscheduler")]);
          else {
            var l = "scheduler";
            s && (l = "scheduler" + (s + 1), window[l] = Scheduler.getSchedulerInstance());
            var h = window[l];
            for (var y in this.setAttribute("dhxscheduler", l), a)
              y != "data" && (h.config[y] = a[y]);
            this.getElementsByTagName("div").length || (this.innerHTML = '<div class="dhx_cal_navline"><div class="dhx_cal_prev_button"></div><div class="dhx_cal_next_button"></div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div><div class="dhx_cal_tab" name="day_tab" data-tab="day" style="right:204px;"></div><div class="dhx_cal_tab" name="week_tab" data-tab="week" style="right:140px;"></div><div class="dhx_cal_tab" name="month_tab" data-tab="month" style="right:76px;"></div></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>', this.className += " dhx_cal_container"), h.init(this, h.config.date, h.config.mode), a.data && h.parse(a.data), o.push(h), s++;
          }
      }), o.length === 1 ? o[0] : o;
    }
    if (r[a])
      return r[a].apply(this, []);
    n.error("Method " + a + " does not exist on jQuery.dhx_scheduler");
  }), function(a) {
    (function() {
      var o = a.setCurrentView, l = a.updateView, h = null, y = null, m = function(v, c) {
        var p = this;
        P.clearTimeout(y), P.clearTimeout(h);
        var g = p._date, b = p._mode;
        u(this, v, c), y = setTimeout(function() {
          a.$destroyed || (p.callEvent("onBeforeViewChange", [b, g, c || p._mode, v || p._date]) ? (l.call(p, v, c), p.callEvent("onViewChange", [p._mode, p._date]), P.clearTimeout(h), y = 0) : u(p, g, b));
        }, a.config.delay_render);
      }, f = function(v, c) {
        var p = this, g = arguments;
        u(this, v, c), P.clearTimeout(h), h = setTimeout(function() {
          a.$destroyed || y || l.apply(p, g);
        }, a.config.delay_render);
      };
      function u(v, c, p) {
        c && (v._date = c), p && (v._mode = p);
      }
      a.attachEvent("onSchedulerReady", function() {
        a.config.delay_render ? (a.setCurrentView = m, a.updateView = f) : (a.setCurrentView = o, a.updateView = l);
      });
    })();
  }(i), function(a) {
    a.createDataProcessor = function(o) {
      var l, h;
      o instanceof Function ? l = o : o.hasOwnProperty("router") ? l = o.router : o.hasOwnProperty("event") && (l = o), h = l ? "CUSTOM" : o.mode || "REST-JSON";
      var y = new ct(o.url);
      return y.init(a), y.setTransactionMode({ mode: h, router: l }, o.batchUpdate), y;
    }, a.DataProcessor = ct;
  }(i), function(a) {
    a.attachEvent("onSchedulerReady", function() {
      typeof dhtmlxError < "u" && window.dhtmlxError.catchError("LoadXML", function(o, l, h) {
        var y = h[0].responseText;
        switch (a.config.ajax_error) {
          case "alert":
            P.alert(y);
            break;
          case "console":
            P.console.log(y);
        }
      });
    });
  }(i);
  const _ = new Za({ en: Ya, ar: $a, be: za, ca: qa, cn: Pa, cs: Ra, da: ja, de: Ia, el: Va, es: Ua, fi: Fa, fr: Ba, he: Wa, hu: Ja, id: Xa, it: Ka, jp: Ga, nb: Qa, nl: en, no: tn, pl: an, pt: nn, ro: rn, ru: on, si: sn, sk: _n, sv: dn, tr: ln, ua: cn });
  i.i18n = { addLocale: _.addLocale, setLocale: function(a) {
    if (typeof a == "string") {
      var o = _.getLocale(a);
      o || (o = _.getLocale("en")), i.locale = o;
    } else if (a)
      if (i.locale)
        for (var l in a)
          a[l] && typeof a[l] == "object" ? (i.locale[l] || (i.locale[l] = {}), i.mixin(i.locale[l], a[l], !0)) : i.locale[l] = a[l];
      else
        i.locale = a;
    var h = i.locale.labels;
    h.dhx_save_btn = h.icon_save, h.dhx_cancel_btn = h.icon_cancel, h.dhx_delete_btn = h.icon_delete, i.$container && i.get_elements();
  }, getLocale: _.getLocale }, i.i18n.setLocale("en"), ma(i), i.ext = {};
  const d = {};
  return i.plugins = function(a) {
    (function(l, h, y) {
      const m = [];
      for (const f in l)
        if (l[f]) {
          const u = f.toLowerCase();
          h[u] && h[u].forEach(function(v) {
            const c = v.toLowerCase();
            l[c] || m.push(c);
          }), m.push(u);
        }
      return m.sort(function(f, u) {
        const v = y[f] || 0, c = y[u] || 0;
        return v > c ? 1 : v < c ? -1 : 0;
      }), m;
    })(a, { treetimeline: ["timeline"], daytimeline: ["timeline"], outerdrag: ["legacy"] }, { legacy: 1, limit: 1, timeline: 2, daytimeline: 3, treetimeline: 3, outerdrag: 6 }).forEach(function(l) {
      if (!d[l]) {
        const h = e.getExtension(l);
        if (!h)
          throw new Error("unknown plugin " + l);
        h(i), d[l] = !0;
      }
    });
  }, i;
}
class fn {
  constructor(i) {
    this._extensions = {};
    for (const t in i)
      this._extensions[t] = i[t];
  }
  addExtension(i, t) {
    this._extensions[i] = t;
  }
  getExtension(i) {
    return this._extensions[i];
  }
}
typeof dhtmlx < "u" && dhtmlx.attaches && (dhtmlx.attaches.attachScheduler = function(e, i, t, n) {
  t = t || '<div class="dhx_cal_tab" name="day_tab" data-tab="day" style="right:204px;"></div><div class="dhx_cal_tab" name="week_tab" data-tab="week" style="right:140px;"></div><div class="dhx_cal_tab" name="month_tab" data-tab="month" style="right:76px;"></div>';
  var s = document.createElement("DIV");
  return s.id = "dhxSchedObj_" + this._genStr(12), s.innerHTML = '<div id="' + s.id + '" class="dhx_cal_container" style="width:100%; height:100%;"><div class="dhx_cal_navline"><div class="dhx_cal_prev_button"></div><div class="dhx_cal_next_button"></div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div>' + t + '</div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div></div>', document.body.appendChild(s.firstChild), this.attachObject(s.id, !1, !0), this.vs[this.av].sched = n, this.vs[this.av].schedId = s.id, n.setSizes = n.updateView, n.destructor = function() {
  }, n.init(s.id, e, i), this.vs[this._viewRestore()].sched;
});
function At(e) {
  e._inited_multisection_copies || (e.attachEvent("onEventIdChange", function(i, t) {
    var n = this._multisection_copies;
    if (n && n[i] && !n[t]) {
      var s = n[i];
      delete n[i], n[t] = s;
    }
  }), e._inited_multisection_copies = !0), e._register_copies_array = function(i) {
    for (var t = 0; t < i.length; t++)
      this._register_copy(i[t]);
  }, e._register_copy = function(i) {
    if (this._multisection_copies) {
      this._multisection_copies[i.id] || (this._multisection_copies[i.id] = {});
      var t = i[this._get_section_property()];
      this._multisection_copies[i.id][t] = i;
    }
  }, e._get_copied_event = function(i, t) {
    if (!this._multisection_copies[i])
      return null;
    if (this._multisection_copies[i][t])
      return this._multisection_copies[i][t];
    var n = this._multisection_copies[i];
    if (e._drag_event && e._drag_event._orig_section && n[e._drag_event._orig_section])
      return n[e._drag_event._orig_section];
    var s = 1 / 0, r = null;
    for (var _ in n)
      n[_]._sorder < s && (r = n[_], s = n[_]._sorder);
    return r;
  }, e._clear_copied_events = function() {
    this._multisection_copies = {};
  }, e._restore_render_flags = function(i) {
    for (var t = this._get_section_property(), n = 0; n < i.length; n++) {
      var s = i[n], r = e._get_copied_event(s.id, s[t]);
      if (r)
        for (var _ in r)
          _.indexOf("_") === 0 && (s[_] = r[_]);
    }
  };
}
const Ge = { from_scheduler: null, to_scheduler: null, drag_data: null, drag_placeholder: null, delete_dnd_holder: function() {
  var e = this.drag_placeholder;
  e && (e.parentNode && e.parentNode.removeChild(e), document.body.className = document.body.className.replace(" dhx_no_select", ""), this.drag_placeholder = null);
}, copy_event_node: function(e, i) {
  for (var t = null, n = 0; n < i._rendered.length; n++) {
    var s = i._rendered[n];
    if (s.getAttribute(i.config.event_attribute) == e.id || s.getAttribute(i.config.event_attribute) == i._drag_id) {
      (t = s.cloneNode(!0)).style.position = t.style.top = t.style.left = "";
      break;
    }
  }
  return t || document.createElement("div");
}, create_dnd_holder: function(e, i) {
  if (this.drag_placeholder)
    return this.drag_placeholder;
  var t = document.createElement("div"), n = i.templates.event_outside(e.start_date, e.end_date, e);
  return n ? t.innerHTML = n : t.appendChild(this.copy_event_node(e, i)), t.className = "dhx_drag_placeholder", t.style.position = "absolute", this.drag_placeholder = t, document.body.appendChild(t), document.body.className += " dhx_no_select", t;
}, move_dnd_holder: function(e) {
  var i = { x: e.clientX, y: e.clientY };
  if (this.create_dnd_holder(this.drag_data.ev, this.from_scheduler), this.drag_placeholder) {
    var t = i.x, n = i.y, s = document.documentElement, r = document.body, _ = this.drag_placeholder;
    _.style.left = 10 + t + (s && s.scrollLeft || r && r.scrollLeft || 0) - (s.clientLeft || 0) + "px", _.style.top = 10 + n + (s && s.scrollTop || r && r.scrollTop || 0) - (s.clientTop || 0) + "px";
  }
}, clear_scheduler_dnd: function(e) {
  e._drag_id = e._drag_pos = e._drag_mode = e._drag_event = e._new_event = null;
}, stop_drag: function(e) {
  e && this.clear_scheduler_dnd(e), this.delete_dnd_holder(), this.drag_data = null;
}, inject_into_scheduler: function(e, i, t) {
  e._count = 1, e._sorder = 0, e.event_pid && e.event_pid != "0" && (e.event_pid = null, e.rec_type = e.rec_pattern = "", e.event_length = 0), i._drag_event = e, i._events[e.id] = e, i._drag_id = e.id, i._drag_mode = "move", t && i._on_mouse_move(t);
}, start_dnd: function(e) {
  if (e.config.drag_out) {
    this.from_scheduler = e, this.to_scheduler = e;
    var i = this.drag_data = {};
    i.ev = e._drag_event, i.orig_id = e._drag_event.id;
  }
}, land_into_scheduler: function(e, i) {
  if (!e.config.drag_in)
    return this.move_dnd_holder(i), !1;
  var t = this.drag_data, n = e._lame_clone(t.ev);
  if (e != this.from_scheduler) {
    n.id = e.uid();
    var s = n.end_date - n.start_date;
    n.start_date = new Date(e.getState().min_date), n.end_date = new Date(n.start_date.valueOf() + s);
  } else
    n.id = this.drag_data.orig_id, n._dhx_changed = !0;
  return this.drag_data.target_id = n.id, !!e.callEvent("onBeforeEventDragIn", [n.id, n, i]) && (this.to_scheduler = e, this.inject_into_scheduler(n, e, i), this.delete_dnd_holder(), e.updateView(), e.callEvent("onEventDragIn", [n.id, n, i]), !0);
}, drag_from_scheduler: function(e, i) {
  if (this.drag_data && e._drag_id && e.config.drag_out) {
    if (!e.callEvent("onBeforeEventDragOut", [e._drag_id, e._drag_event, i]))
      return !1;
    this.to_scheduler == e && (this.to_scheduler = null), this.create_dnd_holder(this.drag_data.ev, e);
    var t = e._drag_id;
    return this.drag_data.target_id = null, delete e._events[t], this.clear_scheduler_dnd(e), e.updateEvent(t), e.callEvent("onEventDragOut", [t, this.drag_data.ev, i]), !0;
  }
  return !1;
}, reset_event: function(e, i) {
  this.inject_into_scheduler(e, i), this.stop_drag(i), i.updateView();
}, move_permanently: function(e, i, t, n) {
  n.callEvent("onEventAdded", [i.id, i]), this.inject_into_scheduler(e, t), this.stop_drag(t), e.event_pid && e.event_pid != "0" ? (t.callEvent("onConfirmedBeforeEventDelete", [e.id]), t.updateEvent(i.event_pid)) : t.deleteEvent(e.id), t.updateView(), n.updateView();
} };
let ht = !1;
const Qt = [];
function ea(e) {
  e.attachEvent("onSchedulerReady", function() {
    (function(i) {
      i.event(document.body, "mousemove", function(t) {
        var n = Ge, s = n.target_scheduler;
        if (s)
          if (n.from_scheduler) {
            if (!s._drag_id) {
              var r = n.to_scheduler;
              r && !n.drag_from_scheduler(r, t) || n.land_into_scheduler(s, t);
            }
          } else
            s.getState().drag_mode == "move" && s.config.drag_out && n.start_dnd(s);
        else
          n.from_scheduler && (n.to_scheduler ? n.drag_from_scheduler(n.to_scheduler, t) : n.move_dnd_holder(t));
        n.target_scheduler = null;
      }), i.event(document.body, "mouseup", function(t) {
        var n = Ge, s = n.from_scheduler, r = n.to_scheduler;
        if (s)
          if (r && s == r)
            s.updateEvent(n.drag_data.target_id);
          else if (r && s !== r) {
            var _ = n.drag_data.ev, d = r.getEvent(n.drag_data.target_id);
            s.callEvent("onEventDropOut", [_.id, _, r, t]) ? n.move_permanently(_, d, s, r) : n.reset_event(_, s);
          } else
            _ = n.drag_data.ev, s.callEvent("onEventDropOut", [_.id, _, null, t]) && n.reset_event(_, s);
        n.stop_drag(), n.current_scheduler = n.from_scheduler = n.to_scheduler = null;
      });
    })(e), ht = !0;
  }, { once: !0 }), e.attachEvent("onDestroy", function() {
    ht = !1;
    const i = Qt.pop();
    i && ea(i);
  }, { once: !0 });
}
function pn(e) {
  (function() {
    var i = [];
    function t() {
      return !!i.length;
    }
    function n(d) {
      setTimeout(function() {
        if (e.$destroyed)
          return !0;
        t() || function(a, o) {
          for (; a && a != o; )
            a = a.parentNode;
          return a == o;
        }(document.activeElement, e.$container) || e.focus();
      }, 1);
    }
    function s(d) {
      var a = (d = d || window.event).currentTarget;
      a == i[i.length - 1] && e.$keyboardNavigation.trapFocus(a, d);
    }
    if (e.attachEvent("onLightbox", function() {
      var d;
      d = e.getLightbox(), e.eventRemove(d, "keydown", s), e.event(d, "keydown", s), i.push(d);
    }), e.attachEvent("onAfterLightbox", function() {
      var d = i.pop();
      d && e.eventRemove(d, "keydown", s), n();
    }), e.attachEvent("onAfterQuickInfo", function() {
      n();
    }), !e._keyNavMessagePopup) {
      e._keyNavMessagePopup = !0;
      var r = null, _ = null;
      const d = [];
      e.attachEvent("onMessagePopup", function(a) {
        for (r = document.activeElement, _ = r; _ && e._getClassName(_).indexOf("dhx_cal_data") < 0; )
          _ = _.parentNode;
        _ && (_ = _.parentNode), e.eventRemove(a, "keydown", s), e.event(a, "keydown", s), d.push(a);
      }), e.attachEvent("onAfterMessagePopup", function() {
        var a = d.pop();
        a && e.eventRemove(a, "keydown", s), setTimeout(function() {
          if (e.$destroyed)
            return !0;
          for (var o = document.activeElement; o && e._getClassName(o).indexOf("dhx_cal_light") < 0; )
            o = o.parentNode;
          o || (r && r.parentNode ? r.focus() : _ && _.parentNode && _.focus(), r = null, _ = null);
        }, 1);
      });
    }
    e.$keyboardNavigation.isModal = t;
  })();
}
function mn(e) {
  e._temp_key_scope = function() {
    e.config.key_nav = !0, e.$keyboardNavigation._pasteDate = null, e.$keyboardNavigation._pasteSection = null;
    var i = null, t = {};
    function n(_) {
      _ = _ || window.event, t.x = _.clientX, t.y = _.clientY;
    }
    function s() {
      for (var _, d, a = document.elementFromPoint(t.x, t.y); a && a != e._obj; )
        a = a.parentNode;
      return _ = a == e._obj, d = e.$keyboardNavigation.dispatcher.isEnabled(), _ || d;
    }
    function r(_) {
      return e._lame_copy({}, _);
    }
    document.body ? e.event(document.body, "mousemove", n) : e.event(window, "load", function() {
      e.event(document.body, "mousemove", n);
    }), e.attachEvent("onMouseMove", function(_, d) {
      var a = e.getState();
      if (a.mode && a.min_date) {
        var o = e.getActionData(d);
        e.$keyboardNavigation._pasteDate = o.date, e.$keyboardNavigation._pasteSection = o.section;
      }
    }), e._make_pasted_event = function(_) {
      var d = e.$keyboardNavigation._pasteDate, a = e.$keyboardNavigation._pasteSection, o = _.end_date - _.start_date, l = r(_);
      if (function(y) {
        delete y.rec_type, delete y.rec_pattern, delete y.event_pid, delete y.event_length;
      }(l), l.start_date = new Date(d), l.end_date = new Date(l.start_date.valueOf() + o), a) {
        var h = e._get_section_property();
        e.config.multisection ? l[h] = _[h] : l[h] = a;
      }
      return l;
    }, e._do_paste = function(_, d, a) {
      e.callEvent("onBeforeEventPasted", [_, d, a]) !== !1 && (e.addEvent(d), e.callEvent("onEventPasted", [_, d, a]));
    }, e._is_key_nav_active = function() {
      return !(!this._is_initialized() || this._is_lightbox_open() || !this.config.key_nav);
    }, e.event(document, "keydown", function(_) {
      (_.ctrlKey || _.metaKey) && _.keyCode == 86 && e._buffer_event && !e.$keyboardNavigation.dispatcher.isEnabled() && (e.$keyboardNavigation.dispatcher.isActive = s());
    }), e._key_nav_copy_paste = function(_) {
      if (!e._is_key_nav_active())
        return !0;
      if (_.keyCode == 37 || _.keyCode == 39) {
        _.cancelBubble = !0;
        var d = e.date.add(e._date, _.keyCode == 37 ? -1 : 1, e._mode);
        return e.setCurrentView(d), !0;
      }
      var a, o = (a = e.$keyboardNavigation.dispatcher.getActiveNode()) && a.eventId ? a.eventId : e._select_id;
      if ((_.ctrlKey || _.metaKey) && _.keyCode == 67)
        return o && (e._buffer_event = r(e.getEvent(o)), i = !0, e.callEvent("onEventCopied", [e.getEvent(o)])), !0;
      if ((_.ctrlKey || _.metaKey) && _.keyCode == 88 && o) {
        i = !1;
        var l = e._buffer_event = r(e.getEvent(o));
        e.updateEvent(l.id), e.callEvent("onEventCut", [l]);
      }
      if ((_.ctrlKey || _.metaKey) && _.keyCode == 86 && s()) {
        if (l = (l = e._buffer_event ? e.getEvent(e._buffer_event.id) : e._buffer_event) || e._buffer_event) {
          var h = e._make_pasted_event(l);
          i ? (h.id = e.uid(), e._do_paste(i, h, l)) : e.callEvent("onBeforeEventChanged", [h, _, !1, l]) && (e._do_paste(i, h, l), i = !0);
        }
        return !0;
      }
    };
  }, e._temp_key_scope();
}
function vn(e) {
  e.$keyboardNavigation.attachSchedulerHandlers = function() {
    var i, t = e.$keyboardNavigation.dispatcher, n = function(a) {
      if (e.config.key_nav)
        return t.keyDownHandler(a);
    }, s = function() {
      t.keepScrollPosition(function() {
        t.focusGlobalNode();
      });
    };
    e.attachEvent("onDataRender", function() {
      e.config.key_nav && t.isEnabled() && !e.getState().editor_id && (clearTimeout(i), i = setTimeout(function() {
        if (e.$destroyed)
          return !0;
        t.isEnabled() || t.enable(), r();
      }));
    });
    var r = function() {
      if (t.isEnabled()) {
        var a = t.getActiveNode();
        a && (a.isValid() || (a = a.fallback()), !a || a instanceof e.$keyboardNavigation.MinicalButton || a instanceof e.$keyboardNavigation.MinicalCell || t.keepScrollPosition(function() {
          a.focus(!0);
        }));
      }
    };
    function _(a) {
      if (!e.config.key_nav)
        return !0;
      const o = e.getView();
      let l = !1;
      if (e.getState().mode === "month")
        l = e.$keyboardNavigation.isChildOf(a.target || a.srcElement, e.$container.querySelector(".dhx_cal_month_table"));
      else if (o && o.layout === "timeline")
        l = e.$keyboardNavigation.isChildOf(a.target || a.srcElement, e.$container.querySelector(".dhx_timeline_data_col"));
      else {
        const m = e.$container.querySelectorAll(".dhx_scale_holder");
        l = Array.from(m).some((f) => f === a.target.parentNode);
      }
      var h, y = e.getActionData(a);
      e._locate_event(a.target || a.srcElement) ? h = new e.$keyboardNavigation.Event(e._locate_event(a.target || a.srcElement)) : l && (h = new e.$keyboardNavigation.TimeSlot(), y.date && l && (h = h.nextSlot(new e.$keyboardNavigation.TimeSlot(y.date, null, y.section)))), h && (t.isEnabled() ? y.date && l && t.delay(function() {
        t.setActiveNode(h);
      }) : t.activeNode = h);
    }
    e.attachEvent("onSchedulerReady", function() {
      var a = e.$container;
      e.eventRemove(document, "keydown", n), e.eventRemove(a, "mousedown", _), e.eventRemove(a, "focus", s), e.config.key_nav ? (e.event(document, "keydown", n), e.event(a, "mousedown", _), e.event(a, "focus", s), a.setAttribute("tabindex", "0")) : a.removeAttribute("tabindex");
    });
    var d = e.updateEvent;
    e.updateEvent = function(a) {
      var o = d.apply(this, arguments);
      if (e.config.key_nav && t.isEnabled() && e.getState().select_id == a) {
        var l = new e.$keyboardNavigation.Event(a);
        e.getState().lightbox_id || function(h) {
          if (e.config.key_nav && t.isEnabled()) {
            var y = h, m = new e.$keyboardNavigation.Event(y.eventId);
            if (!m.isValid()) {
              var f = m.start || y.start, u = m.end || y.end, v = m.section || y.section;
              (m = new e.$keyboardNavigation.TimeSlot(f, u, v)).isValid() || (m = new e.$keyboardNavigation.TimeSlot());
            }
            t.setActiveNode(m);
            var c = t.getActiveNode();
            c && c.getNode && document.activeElement != c.getNode() && t.focusNode(t.getActiveNode());
          }
        }(l);
      }
      return o;
    }, e.attachEvent("onEventDeleted", function(a) {
      return e.config.key_nav && t.isEnabled() && t.getActiveNode().eventId == a && t.setActiveNode(new e.$keyboardNavigation.TimeSlot()), !0;
    }), e.attachEvent("onClearAll", function() {
      if (!e.config.key_nav)
        return !0;
      t.isEnabled() && t.getActiveNode() instanceof e.$keyboardNavigation.Event && t.setActiveNode(new e.$keyboardNavigation.TimeSlot());
    });
  };
}
function ut(e, i, t) {
  return this.catches || (this.catches = []), this;
}
ut.prototype.catchError = function(e, i) {
  this.catches[e] = i;
}, ut.prototype.throwError = function(e, i, t) {
  return this.catches[e] ? this.catches[e](e, i, t) : this.catches.ALL ? this.catches.ALL(e, i, t) : (global.alert("Error type: " + arguments[0] + `
Description: ` + arguments[1]), null);
};
class gn {
  constructor(i) {
    this.map = null, this._markers = [], this.scheduler = i;
  }
  onEventClick(i) {
    if (this._markers && this._markers.length > 0) {
      for (let t = 0; t < this._markers.length; t++)
        if (i.id == this._markers[t].event.id) {
          let n = this.settings.zoom_after_resolve || this.settings.initial_zoom;
          i.lat && i.lng ? (this.map.setCenter({ lat: i.lat, lng: i.lng }), this.map.setZoom(n)) : (this.map.setCenter({ lat: this.settings.error_position.lat, lng: this.settings.error_position.lng }), this.map.setZoom(n)), google.maps.event.trigger(this._markers[t].marker, "click");
        }
    }
  }
  initialize(i, t) {
    this.settings = t;
    let n = this.scheduler, s = { center: { lat: t.initial_position.lat, lng: t.initial_position.lng }, zoom: t.initial_zoom, mapId: i.id, scrollwheel: !0, mapTypeId: t.type };
    if (this.map === null)
      this.map = new google.maps.Map(i, s);
    else {
      let r = this.map;
      i.appendChild(this.map.__gm.messageOverlay), i.appendChild(this.map.__gm.outerContainer), setTimeout(function() {
        r.setOptions({ container: i.id });
      }, 500);
    }
    google.maps.event.addListener(this.map, "dblclick", function(r) {
      const _ = new google.maps.Geocoder();
      if (!n.config.readonly && n.config.dblclick_create) {
        let d = r.latLng;
        _.geocode({ latLng: d }, function(a, o) {
          o == google.maps.GeocoderStatus.OK ? (d = a[0].geometry.location, n.addEventNow({ lat: d.lat(), lng: d.lng(), event_location: a[0].formatted_address, start_date: n.getState().date, end_date: n.date.add(n.getState().date, n.config.time_step, "minute") })) : console.error("Geocode was not successful for the following reason: " + o);
        });
      }
    });
  }
  destroy(i) {
    for (google.maps.event.clearInstanceListeners(window), google.maps.event.clearInstanceListeners(document), google.maps.event.clearInstanceListeners(i); i.firstChild; )
      i.firstChild.remove();
    i.innerHTML = "";
  }
  async addEventMarker(i) {
    let t = { title: i.text, position: {}, map: {} };
    i.lat && i.lng ? t.position = { lat: i.lat, lng: i.lng } : t.position = { lat: this.settings.error_position.lat, lng: this.settings.error_position.lng };
    const { AdvancedMarkerElement: n } = await google.maps.importLibrary("marker");
    let s;
    this.scheduler.ext.mapView.createMarker ? (t.map = this.map, s = this.scheduler.ext.mapView.createMarker(t)) : (s = new n(t), s.map = this.map), s.setMap(this.map), i["!nativeeditor_status"] == "true_deleted" && s.setMap(null), google.maps.event.addListener(s, "click", () => {
      this.infoWindow && this.infoWindow.close(), this.infoWindow = new google.maps.InfoWindow({ maxWidth: this.settings.info_window_max_width }), this.infoWindow.setContent(this.scheduler.templates.map_info_content(i)), this.infoWindow.open({ anchor: s, map: this.map });
    });
    let r = { event: i, ...t, marker: s };
    this._markers.push(r);
  }
  removeEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      i == this._markers[t].event.id && (this._markers[t].marker.setVisible(!1), this._markers[t].marker.setMap(null), this._markers[t].marker.setPosition(null), this._markers[t].marker = null, this._markers.splice(t, 1), t--);
  }
  updateEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      if (this._markers[t].event.id == i.id) {
        this._markers[t].event = i, this._markers[t].position.lat = i.lat, this._markers[t].position.lng = i.lng, this._markers[t].text = i.text;
        let n = new google.maps.LatLng(i.lat, i.lng);
        this._markers[t].marker.setPosition(n);
      }
  }
  clearEventMarkers() {
    if (this._markers.length > 0) {
      for (let i = 0; i < this._markers.length; i++)
        this._markers[i].marker.setMap(null);
      this._markers = [];
    }
  }
  setView(i, t, n) {
    this.map.setCenter({ lat: i, lng: t }), this.map.setZoom(n);
  }
  async resolveAddress(i) {
    const t = new google.maps.Geocoder();
    return await new Promise((n) => {
      t.geocode({ address: i }, function(s, r) {
        r == google.maps.GeocoderStatus.OK ? n({ lat: s[0].geometry.location.lat(), lng: s[0].geometry.location.lng() }) : (console.error("Geocode was not successful for the following reason: " + r), n({}));
      });
    });
  }
}
class yn {
  constructor(i) {
    this.map = null, this._markers = [], this.scheduler = i;
  }
  onEventClick(i) {
    if (this._markers && this._markers.length > 0)
      for (let t = 0; t < this._markers.length; t++)
        i.id == this._markers[t].event.id && (this._markers[t].marker.openPopup(), this._markers[t].marker.closeTooltip(), i.lat && i.lng ? this.setView(i.lat, i.lng, this.settings.zoom_after_resolve || this.settings.initial_zoom) : this.setView(this.settings.error_position.lat, this.settings.error_position.lng, this.settings.zoom_after_resolve || this.settings.initial_zoom));
  }
  initialize(i, t) {
    let n = this.scheduler, s = document.createElement("div");
    s.className = "mapWrapper", s.id = "mapWrapper", s.style.width = i.style.width, s.style.height = i.style.height, i.appendChild(s);
    let r = L.map(s, { center: L.latLng(t.initial_position.lat, t.initial_position.lng), zoom: t.initial_zoom, keyboard: !1 });
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(r), r.on("dblclick", async function(_) {
      let d = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${_.latlng.lat}&lon=${_.latlng.lng}&format=json`, { method: "GET", headers: { "Accept-Language": "en" } }).then((a) => a.json());
      if (d.address) {
        let a = d.address.country;
        n.addEventNow({ lat: _.latlng.lat, lng: _.latlng.lng, event_location: a, start_date: n.getState().date, end_date: n.date.add(n.getState().date, n.config.time_step, "minute") });
      } else
        console.error("unable recieve a position of the event", d.error);
    }), this.map = r, this.settings = t;
  }
  destroy(i) {
    for (this.map.remove(); i.firstChild; )
      i.firstChild.remove();
    i.innerHTML = "";
  }
  addEventMarker(i) {
    const t = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.0.3/dist/images/marker-icon.png", iconSize: [25, 41], shadowSize: [30, 65], iconAnchor: [12, 41], shadowAnchor: [7, 65] });
    let n = { minWidth: 180, maxWidth: this.settings.info_window_max_width };
    const s = L.popup(n).setContent(this.scheduler.templates.map_info_content(i)), r = L.tooltip().setContent(i.text);
    let _ = [i.lat, i.lng];
    i.lat && i.lng || (_ = [this.settings.error_position.lat, this.settings.error_position.lng]);
    const d = { event: i, marker: L.marker(_, { icon: t }).bindPopup(s).bindTooltip(r).addTo(this.map) };
    this._markers.push(d);
  }
  removeEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      i == this._markers[t].event.id && (this.map.removeLayer(this._markers[t].marker), this._markers.splice(t, 1), t--);
  }
  updateEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      this._markers[t].event.id == i.id && (this._markers[t].event = i, i.lat && i.lng ? this._markers[t].marker.setLatLng([i.lat, i.lng]) : this._markers[t].marker.setLatLng([this.settings.error_position.lat, this.settings.error_position.lng]));
  }
  clearEventMarkers() {
    if (this._markers) {
      for (let i = 0; i < this._markers.length; i++)
        this.map.removeLayer(this._markers[i].marker);
      this._markers = [];
    }
  }
  setView(i, t, n) {
    this.map.setView([i, t], n);
  }
  async resolveAddress(i) {
    let t = {}, n = await fetch(`https://nominatim.openstreetmap.org/search?q=${i}&format=json`, { method: "GET", headers: { "Accept-Language": "en" } }).then((s) => s.json());
    return n && n.length ? (t.lat = +n[0].lat, t.lng = +n[0].lon) : console.error(`Unable recieve a position of the event's location: ${i}`), t;
  }
}
class bn {
  constructor(i) {
    this.map = null, this._markers = [], this.scheduler = i;
  }
  onEventClick(i) {
    if (this._markers && this._markers.length > 0)
      for (let t = 0; t < this._markers.length; t++) {
        const n = this._markers[t].marker.getPopup();
        n.isOpen() && n.remove(), i.id == this._markers[t].event.id && (this._markers[t].marker.togglePopup(), i.lat && i.lng ? this.setView(i.lat, i.lng, this.settings.zoom_after_resolve || this.settings.initial_zoom) : this.setView(this.settings.error_position.lat, this.settings.error_position.lng, this.settings.zoom_after_resolve || this.settings.initial_zoom));
      }
  }
  initialize(i, t) {
    let n = this.scheduler;
    mapboxgl.accessToken = t.accessToken;
    const s = new mapboxgl.Map({ container: i, center: [t.initial_position.lng, t.initial_position.lat], zoom: t.initial_zoom + 1 });
    s.on("dblclick", async function(r) {
      let _ = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${r.lngLat.lng},${r.lngLat.lat}.json?access_token=${t.accessToken}`).then((d) => d.json());
      if (_.features) {
        let d = _.features[0].place_name;
        n.addEventNow({ lat: r.lngLat.lat, lng: r.lngLat.lng, event_location: d, start_date: n.getState().date, end_date: n.date.add(n.getState().date, n.config.time_step, "minute") });
      } else
        console.error("unable recieve a position of the event");
    }), this.map = s, this.settings = t;
  }
  destroy(i) {
    for (this.map.remove(); i.firstChild; )
      i.firstChild.remove();
    i.innerHTML = "";
  }
  addEventMarker(i) {
    let t = [i.lng, i.lat];
    i.lat && i.lng || (t = [this.settings.error_position.lng, this.settings.error_position.lat]);
    const n = new mapboxgl.Popup({ offset: 25, focusAfterOpen: !1 }).setMaxWidth(`${this.settings.info_window_max_width}px`).setHTML(this.scheduler.templates.map_info_content(i)), s = { event: i, marker: new mapboxgl.Marker().setLngLat(t).setPopup(n).addTo(this.map) };
    this._markers.push(s);
  }
  removeEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      i == this._markers[t].event.id && (this._markers[t].marker.remove(), this._markers.splice(t, 1), t--);
  }
  updateEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      this._markers[t].event.id == i.id && (this._markers[t].event = i, i.lat && i.lng ? this._markers[t].marker.setLngLat([i.lng, i.lat]) : this._markers[t].marker.setLngLat([this.settings.error_position.lng, this.settings.error_position.lat]));
  }
  clearEventMarkers() {
    for (let i = 0; i < this._markers.length; i++)
      this._markers[i].marker.remove();
    this._markers = [];
  }
  setView(i, t, n) {
    this.map.setCenter([t, i]), this.map.setZoom(n);
  }
  async resolveAddress(i) {
    let t = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${i}.json?access_token=${this.settings.accessToken}`).then((s) => s.json()), n = {};
    return t && t.features.length ? (n.lng = t.features[0].center[0], n.lat = t.features[0].center[1]) : console.error(`Unable recieve a position of the event's location: ${i}`), n;
  }
}
var ft = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"], ie = function() {
  function e(i, t) {
    if (t === 0)
      throw new Error("Can't create weekday with n == 0");
    this.weekday = i, this.n = t;
  }
  return e.fromStr = function(i) {
    return new e(ft.indexOf(i));
  }, e.prototype.nth = function(i) {
    return this.n === i ? this : new e(this.weekday, i);
  }, e.prototype.equals = function(i) {
    return this.weekday === i.weekday && this.n === i.n;
  }, e.prototype.toString = function() {
    var i = ft[this.weekday];
    return this.n && (i = (this.n > 0 ? "+" : "") + String(this.n) + i), i;
  }, e.prototype.getJsWeekday = function() {
    return this.weekday === 6 ? 0 : this.weekday + 1;
  }, e;
}(), Z = function(e) {
  return e != null;
}, be = function(e) {
  return typeof e == "number";
}, Ct = function(e) {
  return typeof e == "string" && ft.includes(e);
}, ce = Array.isArray, we = function(e, i) {
  i === void 0 && (i = e), arguments.length === 1 && (i = e, e = 0);
  for (var t = [], n = e; n < i; n++)
    t.push(n);
  return t;
}, U = function(e, i) {
  var t = 0, n = [];
  if (ce(e))
    for (; t < i; t++)
      n[t] = [].concat(e);
  else
    for (; t < i; t++)
      n[t] = e;
  return n;
};
function je(e, i, t) {
  t === void 0 && (t = " ");
  var n = String(e);
  return i >>= 0, n.length > i ? String(n) : ((i -= n.length) > t.length && (t += U(t, i / t.length)), t.slice(0, i) + String(n));
}
var xn = function(e, i, t) {
  var n = e.split(i);
  return t ? n.slice(0, t).concat([n.slice(t).join(i)]) : n;
}, pe = function(e, i) {
  var t = e % i;
  return t * i < 0 ? t + i : t;
}, st = function(e, i) {
  return { div: Math.floor(e / i), mod: pe(e, i) };
}, xe = function(e) {
  return !Z(e) || e.length === 0;
}, ae = function(e) {
  return !xe(e);
}, W = function(e, i) {
  return ae(e) && e.indexOf(i) !== -1;
}, ze = function(e, i, t, n, s, r) {
  return n === void 0 && (n = 0), s === void 0 && (s = 0), r === void 0 && (r = 0), new Date(Date.UTC(e, i - 1, t, n, s, r));
}, wn = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], ta = 864e5, aa = 9999, na = ze(1970, 1, 1), kn = [6, 0, 1, 2, 3, 4, 5], Be = function(e) {
  return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
}, ra = function(e) {
  return e instanceof Date;
}, We = function(e) {
  return ra(e) && !isNaN(e.getTime());
}, pt = function(e) {
  return i = na, t = e.getTime() - i.getTime(), Math.round(t / ta);
  var i, t;
}, ia = function(e) {
  return new Date(na.getTime() + e * ta);
}, En = function(e) {
  var i = e.getUTCMonth();
  return i === 1 && Be(e.getUTCFullYear()) ? 29 : wn[i];
}, Ye = function(e) {
  return kn[e.getUTCDay()];
}, Ot = function(e, i) {
  var t = ze(e, i + 1, 1);
  return [Ye(t), En(t)];
}, oa = function(e, i) {
  return i = i || e, new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), i.getHours(), i.getMinutes(), i.getSeconds(), i.getMilliseconds()));
}, mt = function(e) {
  return new Date(e.getTime());
}, Lt = function(e) {
  for (var i = [], t = 0; t < e.length; t++)
    i.push(mt(e[t]));
  return i;
}, Je = function(e) {
  e.sort(function(i, t) {
    return i.getTime() - t.getTime();
  });
}, bt = function(e, i) {
  i === void 0 && (i = !0);
  var t = new Date(e);
  return [je(t.getUTCFullYear().toString(), 4, "0"), je(t.getUTCMonth() + 1, 2, "0"), je(t.getUTCDate(), 2, "0"), "T", je(t.getUTCHours(), 2, "0"), je(t.getUTCMinutes(), 2, "0"), je(t.getUTCSeconds(), 2, "0"), i ? "Z" : ""].join("");
}, xt = function(e) {
  var i = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/.exec(e);
  if (!i)
    throw new Error("Invalid UNTIL value: ".concat(e));
  return new Date(Date.UTC(parseInt(i[1], 10), parseInt(i[2], 10) - 1, parseInt(i[3], 10), parseInt(i[5], 10) || 0, parseInt(i[6], 10) || 0, parseInt(i[7], 10) || 0));
}, Ht = function(e, i) {
  return e.toLocaleString("sv-SE", { timeZone: i }).replace(" ", "T") + "Z";
}, Ve = function() {
  function e(i, t) {
    this.minDate = null, this.maxDate = null, this._result = [], this.total = 0, this.method = i, this.args = t, i === "between" ? (this.maxDate = t.inc ? t.before : new Date(t.before.getTime() - 1), this.minDate = t.inc ? t.after : new Date(t.after.getTime() + 1)) : i === "before" ? this.maxDate = t.inc ? t.dt : new Date(t.dt.getTime() - 1) : i === "after" && (this.minDate = t.inc ? t.dt : new Date(t.dt.getTime() + 1));
  }
  return e.prototype.accept = function(i) {
    ++this.total;
    var t = this.minDate && i < this.minDate, n = this.maxDate && i > this.maxDate;
    if (this.method === "between") {
      if (t)
        return !0;
      if (n)
        return !1;
    } else if (this.method === "before") {
      if (n)
        return !1;
    } else if (this.method === "after")
      return !!t || (this.add(i), !1);
    return this.add(i);
  }, e.prototype.add = function(i) {
    return this._result.push(i), !0;
  }, e.prototype.getValue = function() {
    var i = this._result;
    switch (this.method) {
      case "all":
      case "between":
        return i;
      default:
        return i.length ? i[i.length - 1] : null;
    }
  }, e.prototype.clone = function() {
    return new e(this.method, this.args);
  }, e;
}(), vt = function(e, i) {
  return vt = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var s in n)
      Object.prototype.hasOwnProperty.call(n, s) && (t[s] = n[s]);
  }, vt(e, i);
};
function wt(e, i) {
  if (typeof i != "function" && i !== null)
    throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
  function t() {
    this.constructor = e;
  }
  vt(e, i), e.prototype = i === null ? Object.create(i) : (t.prototype = i.prototype, new t());
}
var he = function() {
  return he = Object.assign || function(e) {
    for (var i, t = 1, n = arguments.length; t < n; t++)
      for (var s in i = arguments[t])
        Object.prototype.hasOwnProperty.call(i, s) && (e[s] = i[s]);
    return e;
  }, he.apply(this, arguments);
};
function q(e, i, t) {
  if (t || arguments.length === 2)
    for (var n, s = 0, r = i.length; s < r; s++)
      !n && s in i || (n || (n = Array.prototype.slice.call(i, 0, s)), n[s] = i[s]);
  return e.concat(n || Array.prototype.slice.call(i));
}
var F, $t = function(e) {
  function i(t, n, s) {
    var r = e.call(this, t, n) || this;
    return r.iterator = s, r;
  }
  return wt(i, e), i.prototype.add = function(t) {
    return !!this.iterator(t, this._result.length) && (this._result.push(t), !0);
  }, i;
}(Ve), Ze = { dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], tokens: { SKIP: /^[ \r\n\t]+|^\.$/, number: /^[1-9][0-9]*/, numberAsText: /^(one|two|three)/i, every: /^every/i, "day(s)": /^days?/i, "weekday(s)": /^weekdays?/i, "week(s)": /^weeks?/i, "hour(s)": /^hours?/i, "minute(s)": /^minutes?/i, "month(s)": /^months?/i, "year(s)": /^years?/i, on: /^(on|in)/i, at: /^(at)/i, the: /^the/i, first: /^first/i, second: /^second/i, third: /^third/i, nth: /^([1-9][0-9]*)(\.|th|nd|rd|st)/i, last: /^last/i, for: /^for/i, "time(s)": /^times?/i, until: /^(un)?til/i, monday: /^mo(n(day)?)?/i, tuesday: /^tu(e(s(day)?)?)?/i, wednesday: /^we(d(n(esday)?)?)?/i, thursday: /^th(u(r(sday)?)?)?/i, friday: /^fr(i(day)?)?/i, saturday: /^sa(t(urday)?)?/i, sunday: /^su(n(day)?)?/i, january: /^jan(uary)?/i, february: /^feb(ruary)?/i, march: /^mar(ch)?/i, april: /^apr(il)?/i, may: /^may/i, june: /^june?/i, july: /^july?/i, august: /^aug(ust)?/i, september: /^sep(t(ember)?)?/i, october: /^oct(ober)?/i, november: /^nov(ember)?/i, december: /^dec(ember)?/i, comma: /^(,\s*|(and|or)\s*)+/i } }, zt = function(e, i) {
  return e.indexOf(i) !== -1;
}, Dn = function(e) {
  return e.toString();
}, Sn = function(e, i, t) {
  return "".concat(i, " ").concat(t, ", ").concat(e);
}, De = function() {
  function e(i, t, n, s) {
    if (t === void 0 && (t = Dn), n === void 0 && (n = Ze), s === void 0 && (s = Sn), this.text = [], this.language = n || Ze, this.gettext = t, this.dateFormatter = s, this.rrule = i, this.options = i.options, this.origOptions = i.origOptions, this.origOptions.bymonthday) {
      var r = [].concat(this.options.bymonthday), _ = [].concat(this.options.bynmonthday);
      r.sort(function(l, h) {
        return l - h;
      }), _.sort(function(l, h) {
        return h - l;
      }), this.bymonthday = r.concat(_), this.bymonthday.length || (this.bymonthday = null);
    }
    if (Z(this.origOptions.byweekday)) {
      var d = ce(this.origOptions.byweekday) ? this.origOptions.byweekday : [this.origOptions.byweekday], a = String(d);
      this.byweekday = { allWeeks: d.filter(function(l) {
        return !l.n;
      }), someWeeks: d.filter(function(l) {
        return !!l.n;
      }), isWeekdays: a.indexOf("MO") !== -1 && a.indexOf("TU") !== -1 && a.indexOf("WE") !== -1 && a.indexOf("TH") !== -1 && a.indexOf("FR") !== -1 && a.indexOf("SA") === -1 && a.indexOf("SU") === -1, isEveryDay: a.indexOf("MO") !== -1 && a.indexOf("TU") !== -1 && a.indexOf("WE") !== -1 && a.indexOf("TH") !== -1 && a.indexOf("FR") !== -1 && a.indexOf("SA") !== -1 && a.indexOf("SU") !== -1 };
      var o = function(l, h) {
        return l.weekday - h.weekday;
      };
      this.byweekday.allWeeks.sort(o), this.byweekday.someWeeks.sort(o), this.byweekday.allWeeks.length || (this.byweekday.allWeeks = null), this.byweekday.someWeeks.length || (this.byweekday.someWeeks = null);
    } else
      this.byweekday = null;
  }
  return e.isFullyConvertible = function(i) {
    if (!(i.options.freq in e.IMPLEMENTED) || i.origOptions.until && i.origOptions.count)
      return !1;
    for (var t in i.origOptions) {
      if (zt(["dtstart", "tzid", "wkst", "freq"], t))
        return !0;
      if (!zt(e.IMPLEMENTED[i.options.freq], t))
        return !1;
    }
    return !0;
  }, e.prototype.isFullyConvertible = function() {
    return e.isFullyConvertible(this.rrule);
  }, e.prototype.toString = function() {
    var i = this.gettext;
    if (!(this.options.freq in e.IMPLEMENTED))
      return i("RRule error: Unable to fully convert this rrule to text");
    if (this.text = [i("every")], this[z.FREQUENCIES[this.options.freq]](), this.options.until) {
      this.add(i("until"));
      var t = this.options.until;
      this.add(this.dateFormatter(t.getUTCFullYear(), this.language.monthNames[t.getUTCMonth()], t.getUTCDate()));
    } else
      this.options.count && this.add(i("for")).add(this.options.count.toString()).add(this.plural(this.options.count) ? i("times") : i("time"));
    return this.isFullyConvertible() || this.add(i("(~ approximate)")), this.text.join("");
  }, e.prototype.HOURLY = function() {
    var i = this.gettext;
    this.options.interval !== 1 && this.add(this.options.interval.toString()), this.add(this.plural(this.options.interval) ? i("hours") : i("hour"));
  }, e.prototype.MINUTELY = function() {
    var i = this.gettext;
    this.options.interval !== 1 && this.add(this.options.interval.toString()), this.add(this.plural(this.options.interval) ? i("minutes") : i("minute"));
  }, e.prototype.DAILY = function() {
    var i = this.gettext;
    this.options.interval !== 1 && this.add(this.options.interval.toString()), this.byweekday && this.byweekday.isWeekdays ? this.add(this.plural(this.options.interval) ? i("weekdays") : i("weekday")) : this.add(this.plural(this.options.interval) ? i("days") : i("day")), this.origOptions.bymonth && (this.add(i("in")), this._bymonth()), this.bymonthday ? this._bymonthday() : this.byweekday ? this._byweekday() : this.origOptions.byhour && this._byhour();
  }, e.prototype.WEEKLY = function() {
    var i = this.gettext;
    this.options.interval !== 1 && this.add(this.options.interval.toString()).add(this.plural(this.options.interval) ? i("weeks") : i("week")), this.byweekday && this.byweekday.isWeekdays ? this.options.interval === 1 ? this.add(this.plural(this.options.interval) ? i("weekdays") : i("weekday")) : this.add(i("on")).add(i("weekdays")) : this.byweekday && this.byweekday.isEveryDay ? this.add(this.plural(this.options.interval) ? i("days") : i("day")) : (this.options.interval === 1 && this.add(i("week")), this.origOptions.bymonth && (this.add(i("in")), this._bymonth()), this.bymonthday ? this._bymonthday() : this.byweekday && this._byweekday(), this.origOptions.byhour && this._byhour());
  }, e.prototype.MONTHLY = function() {
    var i = this.gettext;
    this.origOptions.bymonth ? (this.options.interval !== 1 && (this.add(this.options.interval.toString()).add(i("months")), this.plural(this.options.interval) && this.add(i("in"))), this._bymonth()) : (this.options.interval !== 1 && this.add(this.options.interval.toString()), this.add(this.plural(this.options.interval) ? i("months") : i("month"))), this.bymonthday ? this._bymonthday() : this.byweekday && this.byweekday.isWeekdays ? this.add(i("on")).add(i("weekdays")) : this.byweekday && this._byweekday();
  }, e.prototype.YEARLY = function() {
    var i = this.gettext;
    this.origOptions.bymonth ? (this.options.interval !== 1 && (this.add(this.options.interval.toString()), this.add(i("years"))), this._bymonth()) : (this.options.interval !== 1 && this.add(this.options.interval.toString()), this.add(this.plural(this.options.interval) ? i("years") : i("year"))), this.bymonthday ? this._bymonthday() : this.byweekday && this._byweekday(), this.options.byyearday && this.add(i("on the")).add(this.list(this.options.byyearday, this.nth, i("and"))).add(i("day")), this.options.byweekno && this.add(i("in")).add(this.plural(this.options.byweekno.length) ? i("weeks") : i("week")).add(this.list(this.options.byweekno, void 0, i("and")));
  }, e.prototype._bymonthday = function() {
    var i = this.gettext;
    this.byweekday && this.byweekday.allWeeks ? this.add(i("on")).add(this.list(this.byweekday.allWeeks, this.weekdaytext, i("or"))).add(i("the")).add(this.list(this.bymonthday, this.nth, i("or"))) : this.add(i("on the")).add(this.list(this.bymonthday, this.nth, i("and")));
  }, e.prototype._byweekday = function() {
    var i = this.gettext;
    this.byweekday.allWeeks && !this.byweekday.isWeekdays && this.add(i("on")).add(this.list(this.byweekday.allWeeks, this.weekdaytext)), this.byweekday.someWeeks && (this.byweekday.allWeeks && this.add(i("and")), this.add(i("on the")).add(this.list(this.byweekday.someWeeks, this.weekdaytext, i("and"))));
  }, e.prototype._byhour = function() {
    var i = this.gettext;
    this.add(i("at")).add(this.list(this.origOptions.byhour, void 0, i("and")));
  }, e.prototype._bymonth = function() {
    this.add(this.list(this.options.bymonth, this.monthtext, this.gettext("and")));
  }, e.prototype.nth = function(i) {
    var t;
    i = parseInt(i.toString(), 10);
    var n = this.gettext;
    if (i === -1)
      return n("last");
    var s = Math.abs(i);
    switch (s) {
      case 1:
      case 21:
      case 31:
        t = s + n("st");
        break;
      case 2:
      case 22:
        t = s + n("nd");
        break;
      case 3:
      case 23:
        t = s + n("rd");
        break;
      default:
        t = s + n("th");
    }
    return i < 0 ? t + " " + n("last") : t;
  }, e.prototype.monthtext = function(i) {
    return this.language.monthNames[i - 1];
  }, e.prototype.weekdaytext = function(i) {
    var t = be(i) ? (i + 1) % 7 : i.getJsWeekday();
    return (i.n ? this.nth(i.n) + " " : "") + this.language.dayNames[t];
  }, e.prototype.plural = function(i) {
    return i % 100 != 1;
  }, e.prototype.add = function(i) {
    return this.text.push(" "), this.text.push(i), this;
  }, e.prototype.list = function(i, t, n, s) {
    var r = this;
    s === void 0 && (s = ","), ce(i) || (i = [i]), t = t || function(d) {
      return d.toString();
    };
    var _ = function(d) {
      return t && t.call(r, d);
    };
    return n ? function(d, a, o) {
      for (var l = "", h = 0; h < d.length; h++)
        h !== 0 && (h === d.length - 1 ? l += " " + o + " " : l += a + " "), l += d[h];
      return l;
    }(i.map(_), s, n) : i.map(_).join(s + " ");
  }, e;
}(), Mn = function() {
  function e(i) {
    this.done = !0, this.rules = i;
  }
  return e.prototype.start = function(i) {
    return this.text = i, this.done = !1, this.nextSymbol();
  }, e.prototype.isDone = function() {
    return this.done && this.symbol === null;
  }, e.prototype.nextSymbol = function() {
    var i, t;
    this.symbol = null, this.value = null;
    do {
      if (this.done)
        return !1;
      for (var n in i = null, this.rules) {
        var s = this.rules[n].exec(this.text);
        s && (i === null || s[0].length > i[0].length) && (i = s, t = n);
      }
      if (i != null && (this.text = this.text.substr(i[0].length), this.text === "" && (this.done = !0)), i == null)
        return this.done = !0, this.symbol = null, void (this.value = null);
    } while (t === "SKIP");
    return this.symbol = t, this.value = i, !0;
  }, e.prototype.accept = function(i) {
    if (this.symbol === i) {
      if (this.value) {
        var t = this.value;
        return this.nextSymbol(), t;
      }
      return this.nextSymbol(), !0;
    }
    return !1;
  }, e.prototype.acceptNumber = function() {
    return this.accept("number");
  }, e.prototype.expect = function(i) {
    if (this.accept(i))
      return !0;
    throw new Error("expected " + i + " but found " + this.symbol);
  }, e;
}();
function sa(e, i) {
  i === void 0 && (i = Ze);
  var t = {}, n = new Mn(i.tokens);
  return n.start(e) ? (function() {
    n.expect("every");
    var l = n.acceptNumber();
    if (l && (t.interval = parseInt(l[0], 10)), n.isDone())
      throw new Error("Unexpected end");
    switch (n.symbol) {
      case "day(s)":
        t.freq = z.DAILY, n.nextSymbol() && (r(), o());
        break;
      case "weekday(s)":
        t.freq = z.WEEKLY, t.byweekday = [z.MO, z.TU, z.WE, z.TH, z.FR], n.nextSymbol(), r(), o();
        break;
      case "week(s)":
        t.freq = z.WEEKLY, n.nextSymbol() && (s(), r(), o());
        break;
      case "hour(s)":
        t.freq = z.HOURLY, n.nextSymbol() && (s(), o());
        break;
      case "minute(s)":
        t.freq = z.MINUTELY, n.nextSymbol() && (s(), o());
        break;
      case "month(s)":
        t.freq = z.MONTHLY, n.nextSymbol() && (s(), o());
        break;
      case "year(s)":
        t.freq = z.YEARLY, n.nextSymbol() && (s(), o());
        break;
      case "monday":
      case "tuesday":
      case "wednesday":
      case "thursday":
      case "friday":
      case "saturday":
      case "sunday":
        t.freq = z.WEEKLY;
        var h = n.symbol.substr(0, 2).toUpperCase();
        if (t.byweekday = [z[h]], !n.nextSymbol())
          return;
        for (; n.accept("comma"); ) {
          if (n.isDone())
            throw new Error("Unexpected end");
          var y = d();
          if (!y)
            throw new Error("Unexpected symbol " + n.symbol + ", expected weekday");
          t.byweekday.push(z[y]), n.nextSymbol();
        }
        r(), function() {
          n.accept("on"), n.accept("the");
          var f = a();
          if (f)
            for (t.bymonthday = [f], n.nextSymbol(); n.accept("comma"); ) {
              if (!(f = a()))
                throw new Error("Unexpected symbol " + n.symbol + "; expected monthday");
              t.bymonthday.push(f), n.nextSymbol();
            }
        }(), o();
        break;
      case "january":
      case "february":
      case "march":
      case "april":
      case "may":
      case "june":
      case "july":
      case "august":
      case "september":
      case "october":
      case "november":
      case "december":
        if (t.freq = z.YEARLY, t.bymonth = [_()], !n.nextSymbol())
          return;
        for (; n.accept("comma"); ) {
          if (n.isDone())
            throw new Error("Unexpected end");
          var m = _();
          if (!m)
            throw new Error("Unexpected symbol " + n.symbol + ", expected month");
          t.bymonth.push(m), n.nextSymbol();
        }
        s(), o();
        break;
      default:
        throw new Error("Unknown symbol");
    }
  }(), t) : null;
  function s() {
    var l = n.accept("on"), h = n.accept("the");
    if (l || h)
      do {
        var y = a(), m = d(), f = _();
        if (y)
          m ? (n.nextSymbol(), t.byweekday || (t.byweekday = []), t.byweekday.push(z[m].nth(y))) : (t.bymonthday || (t.bymonthday = []), t.bymonthday.push(y), n.accept("day(s)"));
        else if (m)
          n.nextSymbol(), t.byweekday || (t.byweekday = []), t.byweekday.push(z[m]);
        else if (n.symbol === "weekday(s)")
          n.nextSymbol(), t.byweekday || (t.byweekday = [z.MO, z.TU, z.WE, z.TH, z.FR]);
        else if (n.symbol === "week(s)") {
          n.nextSymbol();
          var u = n.acceptNumber();
          if (!u)
            throw new Error("Unexpected symbol " + n.symbol + ", expected week number");
          for (t.byweekno = [parseInt(u[0], 10)]; n.accept("comma"); ) {
            if (!(u = n.acceptNumber()))
              throw new Error("Unexpected symbol " + n.symbol + "; expected monthday");
            t.byweekno.push(parseInt(u[0], 10));
          }
        } else {
          if (!f)
            return;
          n.nextSymbol(), t.bymonth || (t.bymonth = []), t.bymonth.push(f);
        }
      } while (n.accept("comma") || n.accept("the") || n.accept("on"));
  }
  function r() {
    if (n.accept("at"))
      do {
        var l = n.acceptNumber();
        if (!l)
          throw new Error("Unexpected symbol " + n.symbol + ", expected hour");
        for (t.byhour = [parseInt(l[0], 10)]; n.accept("comma"); ) {
          if (!(l = n.acceptNumber()))
            throw new Error("Unexpected symbol " + n.symbol + "; expected hour");
          t.byhour.push(parseInt(l[0], 10));
        }
      } while (n.accept("comma") || n.accept("at"));
  }
  function _() {
    switch (n.symbol) {
      case "january":
        return 1;
      case "february":
        return 2;
      case "march":
        return 3;
      case "april":
        return 4;
      case "may":
        return 5;
      case "june":
        return 6;
      case "july":
        return 7;
      case "august":
        return 8;
      case "september":
        return 9;
      case "october":
        return 10;
      case "november":
        return 11;
      case "december":
        return 12;
      default:
        return !1;
    }
  }
  function d() {
    switch (n.symbol) {
      case "monday":
      case "tuesday":
      case "wednesday":
      case "thursday":
      case "friday":
      case "saturday":
      case "sunday":
        return n.symbol.substr(0, 2).toUpperCase();
      default:
        return !1;
    }
  }
  function a() {
    switch (n.symbol) {
      case "last":
        return n.nextSymbol(), -1;
      case "first":
        return n.nextSymbol(), 1;
      case "second":
        return n.nextSymbol(), n.accept("last") ? -2 : 2;
      case "third":
        return n.nextSymbol(), n.accept("last") ? -3 : 3;
      case "nth":
        var l = parseInt(n.value[1], 10);
        if (l < -366 || l > 366)
          throw new Error("Nth out of range: " + l);
        return n.nextSymbol(), n.accept("last") ? -l : l;
      default:
        return !1;
    }
  }
  function o() {
    if (n.symbol === "until") {
      var l = Date.parse(n.text);
      if (!l)
        throw new Error("Cannot parse until date:" + n.text);
      t.until = new Date(l);
    } else
      n.accept("for") && (t.count = parseInt(n.value[0], 10), n.expect("number"));
  }
}
function _t(e) {
  return e < F.HOURLY;
}
(function(e) {
  e[e.YEARLY = 0] = "YEARLY", e[e.MONTHLY = 1] = "MONTHLY", e[e.WEEKLY = 2] = "WEEKLY", e[e.DAILY = 3] = "DAILY", e[e.HOURLY = 4] = "HOURLY", e[e.MINUTELY = 5] = "MINUTELY", e[e.SECONDLY = 6] = "SECONDLY";
})(F || (F = {}));
var Nn = function(e, i) {
  return i === void 0 && (i = Ze), new z(sa(e, i) || void 0);
}, Ie = ["count", "until", "interval", "byweekday", "bymonthday", "bymonth"];
De.IMPLEMENTED = [], De.IMPLEMENTED[F.HOURLY] = Ie, De.IMPLEMENTED[F.MINUTELY] = Ie, De.IMPLEMENTED[F.DAILY] = ["byhour"].concat(Ie), De.IMPLEMENTED[F.WEEKLY] = Ie, De.IMPLEMENTED[F.MONTHLY] = Ie, De.IMPLEMENTED[F.YEARLY] = ["byweekno", "byyearday"].concat(Ie);
var Tn = De.isFullyConvertible, Qe = function() {
  function e(i, t, n, s) {
    this.hour = i, this.minute = t, this.second = n, this.millisecond = s || 0;
  }
  return e.prototype.getHours = function() {
    return this.hour;
  }, e.prototype.getMinutes = function() {
    return this.minute;
  }, e.prototype.getSeconds = function() {
    return this.second;
  }, e.prototype.getMilliseconds = function() {
    return this.millisecond;
  }, e.prototype.getTime = function() {
    return 1e3 * (60 * this.hour * 60 + 60 * this.minute + this.second) + this.millisecond;
  }, e;
}(), An = function(e) {
  function i(t, n, s, r, _, d, a) {
    var o = e.call(this, r, _, d, a) || this;
    return o.year = t, o.month = n, o.day = s, o;
  }
  return wt(i, e), i.fromDate = function(t) {
    return new this(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), t.valueOf() % 1e3);
  }, i.prototype.getWeekday = function() {
    return Ye(new Date(this.getTime()));
  }, i.prototype.getTime = function() {
    return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond)).getTime();
  }, i.prototype.getDay = function() {
    return this.day;
  }, i.prototype.getMonth = function() {
    return this.month;
  }, i.prototype.getYear = function() {
    return this.year;
  }, i.prototype.addYears = function(t) {
    this.year += t;
  }, i.prototype.addMonths = function(t) {
    if (this.month += t, this.month > 12) {
      var n = Math.floor(this.month / 12), s = pe(this.month, 12);
      this.month = s, this.year += n, this.month === 0 && (this.month = 12, --this.year);
    }
  }, i.prototype.addWeekly = function(t, n) {
    n > this.getWeekday() ? this.day += -(this.getWeekday() + 1 + (6 - n)) + 7 * t : this.day += -(this.getWeekday() - n) + 7 * t, this.fixDay();
  }, i.prototype.addDaily = function(t) {
    this.day += t, this.fixDay();
  }, i.prototype.addHours = function(t, n, s) {
    for (n && (this.hour += Math.floor((23 - this.hour) / t) * t); ; ) {
      this.hour += t;
      var r = st(this.hour, 24), _ = r.div, d = r.mod;
      if (_ && (this.hour = d, this.addDaily(_)), xe(s) || W(s, this.hour))
        break;
    }
  }, i.prototype.addMinutes = function(t, n, s, r) {
    for (n && (this.minute += Math.floor((1439 - (60 * this.hour + this.minute)) / t) * t); ; ) {
      this.minute += t;
      var _ = st(this.minute, 60), d = _.div, a = _.mod;
      if (d && (this.minute = a, this.addHours(d, !1, s)), (xe(s) || W(s, this.hour)) && (xe(r) || W(r, this.minute)))
        break;
    }
  }, i.prototype.addSeconds = function(t, n, s, r, _) {
    for (n && (this.second += Math.floor((86399 - (3600 * this.hour + 60 * this.minute + this.second)) / t) * t); ; ) {
      this.second += t;
      var d = st(this.second, 60), a = d.div, o = d.mod;
      if (a && (this.second = o, this.addMinutes(a, !1, s, r)), (xe(s) || W(s, this.hour)) && (xe(r) || W(r, this.minute)) && (xe(_) || W(_, this.second)))
        break;
    }
  }, i.prototype.fixDay = function() {
    if (!(this.day <= 28)) {
      var t = Ot(this.year, this.month - 1)[1];
      if (!(this.day <= t))
        for (; this.day > t; ) {
          if (this.day -= t, ++this.month, this.month === 13 && (this.month = 1, ++this.year, this.year > aa))
            return;
          t = Ot(this.year, this.month - 1)[1];
        }
    }
  }, i.prototype.add = function(t, n) {
    var s = t.freq, r = t.interval, _ = t.wkst, d = t.byhour, a = t.byminute, o = t.bysecond;
    switch (s) {
      case F.YEARLY:
        return this.addYears(r);
      case F.MONTHLY:
        return this.addMonths(r);
      case F.WEEKLY:
        return this.addWeekly(r, _);
      case F.DAILY:
        return this.addDaily(r);
      case F.HOURLY:
        return this.addHours(r, n, d);
      case F.MINUTELY:
        return this.addMinutes(r, n, d, a);
      case F.SECONDLY:
        return this.addSeconds(r, n, d, a, o);
    }
  }, i;
}(Qe);
function _a(e) {
  for (var i = [], t = 0, n = Object.keys(e); t < n.length; t++) {
    var s = n[t];
    W(Qn, s) || i.push(s), ra(e[s]) && !We(e[s]) && i.push(s);
  }
  if (i.length)
    throw new Error("Invalid options: " + i.join(", "));
  return he({}, e);
}
function Cn(e) {
  var i = he(he({}, kt), _a(e));
  if (Z(i.byeaster) && (i.freq = z.YEARLY), !Z(i.freq) || !z.FREQUENCIES[i.freq])
    throw new Error("Invalid frequency: ".concat(i.freq, " ").concat(e.freq));
  if (i.dtstart || (i.dtstart = new Date((/* @__PURE__ */ new Date()).setMilliseconds(0))), Z(i.wkst) ? be(i.wkst) || (i.wkst = i.wkst.weekday) : i.wkst = z.MO.weekday, Z(i.bysetpos)) {
    be(i.bysetpos) && (i.bysetpos = [i.bysetpos]);
    for (var t = 0; t < i.bysetpos.length; t++)
      if ((r = i.bysetpos[t]) === 0 || !(r >= -366 && r <= 366))
        throw new Error("bysetpos must be between 1 and 366, or between -366 and -1");
  }
  if (!(i.byweekno || ae(i.byweekno) || ae(i.byyearday) || i.bymonthday || ae(i.bymonthday) || Z(i.byweekday) || Z(i.byeaster)))
    switch (i.freq) {
      case z.YEARLY:
        i.bymonth || (i.bymonth = i.dtstart.getUTCMonth() + 1), i.bymonthday = i.dtstart.getUTCDate();
        break;
      case z.MONTHLY:
        i.bymonthday = i.dtstart.getUTCDate();
        break;
      case z.WEEKLY:
        i.byweekday = [Ye(i.dtstart)];
    }
  if (Z(i.bymonth) && !ce(i.bymonth) && (i.bymonth = [i.bymonth]), Z(i.byyearday) && !ce(i.byyearday) && be(i.byyearday) && (i.byyearday = [i.byyearday]), Z(i.bymonthday))
    if (ce(i.bymonthday)) {
      var n = [], s = [];
      for (t = 0; t < i.bymonthday.length; t++) {
        var r;
        (r = i.bymonthday[t]) > 0 ? n.push(r) : r < 0 && s.push(r);
      }
      i.bymonthday = n, i.bynmonthday = s;
    } else
      i.bymonthday < 0 ? (i.bynmonthday = [i.bymonthday], i.bymonthday = []) : (i.bynmonthday = [], i.bymonthday = [i.bymonthday]);
  else
    i.bymonthday = [], i.bynmonthday = [];
  if (Z(i.byweekno) && !ce(i.byweekno) && (i.byweekno = [i.byweekno]), Z(i.byweekday))
    if (be(i.byweekday))
      i.byweekday = [i.byweekday], i.bynweekday = null;
    else if (Ct(i.byweekday))
      i.byweekday = [ie.fromStr(i.byweekday).weekday], i.bynweekday = null;
    else if (i.byweekday instanceof ie)
      !i.byweekday.n || i.freq > z.MONTHLY ? (i.byweekday = [i.byweekday.weekday], i.bynweekday = null) : (i.bynweekday = [[i.byweekday.weekday, i.byweekday.n]], i.byweekday = null);
    else {
      var _ = [], d = [];
      for (t = 0; t < i.byweekday.length; t++) {
        var a = i.byweekday[t];
        be(a) ? _.push(a) : Ct(a) ? _.push(ie.fromStr(a).weekday) : !a.n || i.freq > z.MONTHLY ? _.push(a.weekday) : d.push([a.weekday, a.n]);
      }
      i.byweekday = ae(_) ? _ : null, i.bynweekday = ae(d) ? d : null;
    }
  else
    i.bynweekday = null;
  return Z(i.byhour) ? be(i.byhour) && (i.byhour = [i.byhour]) : i.byhour = i.freq < z.HOURLY ? [i.dtstart.getUTCHours()] : null, Z(i.byminute) ? be(i.byminute) && (i.byminute = [i.byminute]) : i.byminute = i.freq < z.MINUTELY ? [i.dtstart.getUTCMinutes()] : null, Z(i.bysecond) ? be(i.bysecond) && (i.bysecond = [i.bysecond]) : i.bysecond = i.freq < z.SECONDLY ? [i.dtstart.getUTCSeconds()] : null, { parsedOptions: i };
}
function gt(e) {
  var i = e.split(`
`).map(On).filter(function(t) {
    return t !== null;
  });
  return he(he({}, i[0]), i[1]);
}
function et(e) {
  var i = {}, t = /DTSTART(?:;TZID=([^:=]+?))?(?::|=)([^;\s]+)/i.exec(e);
  if (!t)
    return i;
  var n = t[1], s = t[2];
  return n && (i.tzid = n), i.dtstart = xt(s), i;
}
function On(e) {
  if (!(e = e.replace(/^\s+|\s+$/, "")).length)
    return null;
  var i = /^([A-Z]+?)[:;]/.exec(e.toUpperCase());
  if (!i)
    return qt(e);
  var t = i[1];
  switch (t.toUpperCase()) {
    case "RRULE":
    case "EXRULE":
      return qt(e);
    case "DTSTART":
      return et(e);
    default:
      throw new Error("Unsupported RFC prop ".concat(t, " in ").concat(e));
  }
}
function qt(e) {
  var i = et(e.replace(/^RRULE:/i, ""));
  return e.replace(/^(?:RRULE|EXRULE):/i, "").split(";").forEach(function(t) {
    var n = t.split("="), s = n[0], r = n[1];
    switch (s.toUpperCase()) {
      case "FREQ":
        i.freq = F[r.toUpperCase()];
        break;
      case "WKST":
        i.wkst = ve[r.toUpperCase()];
        break;
      case "COUNT":
      case "INTERVAL":
      case "BYSETPOS":
      case "BYMONTH":
      case "BYMONTHDAY":
      case "BYYEARDAY":
      case "BYWEEKNO":
      case "BYHOUR":
      case "BYMINUTE":
      case "BYSECOND":
        var _ = function(o) {
          return o.indexOf(",") !== -1 ? o.split(",").map(Pt) : Pt(o);
        }(r), d = s.toLowerCase();
        i[d] = _;
        break;
      case "BYWEEKDAY":
      case "BYDAY":
        i.byweekday = function(o) {
          var l = o.split(",");
          return l.map(function(h) {
            if (h.length === 2)
              return ve[h];
            var y = h.match(/^([+-]?\d{1,2})([A-Z]{2})$/);
            if (!y || y.length < 3)
              throw new SyntaxError("Invalid weekday string: ".concat(h));
            var m = Number(y[1]), f = y[2], u = ve[f].weekday;
            return new ie(u, m);
          });
        }(r);
        break;
      case "DTSTART":
      case "TZID":
        var a = et(e);
        i.tzid = a.tzid, i.dtstart = a.dtstart;
        break;
      case "UNTIL":
        i.until = xt(r);
        break;
      case "BYEASTER":
        i.byeaster = Number(r);
        break;
      default:
        throw new Error("Unknown RRULE property '" + s + "'");
    }
  }), i;
}
function Pt(e) {
  return /^[+-]?\d+$/.test(e) ? Number(e) : e;
}
var tt = function() {
  function e(i, t) {
    if (isNaN(i.getTime()))
      throw new RangeError("Invalid date passed to DateWithZone");
    this.date = i, this.tzid = t;
  }
  return Object.defineProperty(e.prototype, "isUTC", { get: function() {
    return !this.tzid || this.tzid.toUpperCase() === "UTC";
  }, enumerable: !1, configurable: !0 }), e.prototype.toString = function() {
    var i = bt(this.date.getTime(), this.isUTC);
    return this.isUTC ? ":".concat(i) : ";TZID=".concat(this.tzid, ":").concat(i);
  }, e.prototype.getTime = function() {
    return this.date.getTime();
  }, e.prototype.rezonedDate = function() {
    return this.isUTC ? this.date : (i = this.date, t = this.tzid, n = Intl.DateTimeFormat().resolvedOptions().timeZone, s = new Date(Ht(i, n)), r = new Date(Ht(i, t ?? "UTC")).getTime() - s.getTime(), new Date(i.getTime() - r));
    var i, t, n, s, r;
  }, e;
}();
function yt(e) {
  for (var i, t = [], n = "", s = Object.keys(e), r = Object.keys(kt), _ = 0; _ < s.length; _++)
    if (s[_] !== "tzid" && W(r, s[_])) {
      var d = s[_].toUpperCase(), a = e[s[_]], o = "";
      if (Z(a) && (!ce(a) || a.length)) {
        switch (d) {
          case "FREQ":
            o = z.FREQUENCIES[e.freq];
            break;
          case "WKST":
            o = be(a) ? new ie(a).toString() : a.toString();
            break;
          case "BYWEEKDAY":
            d = "BYDAY", o = (i = a, ce(i) ? i : [i]).map(function(f) {
              return f instanceof ie ? f : ce(f) ? new ie(f[0], f[1]) : new ie(f);
            }).toString();
            break;
          case "DTSTART":
            n = Ln(a, e.tzid);
            break;
          case "UNTIL":
            o = bt(a, !e.tzid);
            break;
          default:
            if (ce(a)) {
              for (var l = [], h = 0; h < a.length; h++)
                l[h] = String(a[h]);
              o = l.toString();
            } else
              o = String(a);
        }
        o && t.push([d, o]);
      }
    }
  var y = t.map(function(f) {
    var u = f[0], v = f[1];
    return "".concat(u, "=").concat(v.toString());
  }).join(";"), m = "";
  return y !== "" && (m = "RRULE:".concat(y)), [n, m].filter(function(f) {
    return !!f;
  }).join(`
`);
}
function Ln(e, i) {
  return e ? "DTSTART" + new tt(new Date(e), i).toString() : "";
}
function Hn(e, i) {
  return Array.isArray(e) ? !!Array.isArray(i) && e.length === i.length && e.every(function(t, n) {
    return t.getTime() === i[n].getTime();
  }) : e instanceof Date ? i instanceof Date && e.getTime() === i.getTime() : e === i;
}
var $n = function() {
  function e() {
    this.all = !1, this.before = [], this.after = [], this.between = [];
  }
  return e.prototype._cacheAdd = function(i, t, n) {
    t && (t = t instanceof Date ? mt(t) : Lt(t)), i === "all" ? this.all = t : (n._value = t, this[i].push(n));
  }, e.prototype._cacheGet = function(i, t) {
    var n = !1, s = t ? Object.keys(t) : [], r = function(l) {
      for (var h = 0; h < s.length; h++) {
        var y = s[h];
        if (!Hn(t[y], l[y]))
          return !0;
      }
      return !1;
    }, _ = this[i];
    if (i === "all")
      n = this.all;
    else if (ce(_))
      for (var d = 0; d < _.length; d++) {
        var a = _[d];
        if (!s.length || !r(a)) {
          n = a._value;
          break;
        }
      }
    if (!n && this.all) {
      var o = new Ve(i, t);
      for (d = 0; d < this.all.length && o.accept(this.all[d]); d++)
        ;
      n = o.getValue(), this._cacheAdd(i, n, t);
    }
    return ce(n) ? Lt(n) : n instanceof Date ? mt(n) : n;
  }, e;
}(), zn = q(q(q(q(q(q(q(q(q(q(q(q(q([], U(1, 31), !0), U(2, 28), !0), U(3, 31), !0), U(4, 30), !0), U(5, 31), !0), U(6, 30), !0), U(7, 31), !0), U(8, 31), !0), U(9, 30), !0), U(10, 31), !0), U(11, 30), !0), U(12, 31), !0), U(1, 7), !0), qn = q(q(q(q(q(q(q(q(q(q(q(q(q([], U(1, 31), !0), U(2, 29), !0), U(3, 31), !0), U(4, 30), !0), U(5, 31), !0), U(6, 30), !0), U(7, 31), !0), U(8, 31), !0), U(9, 30), !0), U(10, 31), !0), U(11, 30), !0), U(12, 31), !0), U(1, 7), !0), Pn = we(1, 29), Rn = we(1, 30), Ce = we(1, 31), ne = we(1, 32), jn = q(q(q(q(q(q(q(q(q(q(q(q(q([], ne, !0), Rn, !0), ne, !0), Ce, !0), ne, !0), Ce, !0), ne, !0), ne, !0), Ce, !0), ne, !0), Ce, !0), ne, !0), ne.slice(0, 7), !0), In = q(q(q(q(q(q(q(q(q(q(q(q(q([], ne, !0), Pn, !0), ne, !0), Ce, !0), ne, !0), Ce, !0), ne, !0), ne, !0), Ce, !0), ne, !0), Ce, !0), ne, !0), ne.slice(0, 7), !0), Vn = we(-28, 0), Yn = we(-29, 0), Oe = we(-30, 0), re = we(-31, 0), Un = q(q(q(q(q(q(q(q(q(q(q(q(q([], re, !0), Yn, !0), re, !0), Oe, !0), re, !0), Oe, !0), re, !0), re, !0), Oe, !0), re, !0), Oe, !0), re, !0), re.slice(0, 7), !0), Fn = q(q(q(q(q(q(q(q(q(q(q(q(q([], re, !0), Vn, !0), re, !0), Oe, !0), re, !0), Oe, !0), re, !0), re, !0), Oe, !0), re, !0), Oe, !0), re, !0), re.slice(0, 7), !0), Bn = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366], Wn = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365], Rt = function() {
  for (var e = [], i = 0; i < 55; i++)
    e = e.concat(we(7));
  return e;
}();
function Jn(e, i) {
  var t, n, s = ze(e, 1, 1), r = Be(e) ? 366 : 365, _ = Be(e + 1) ? 366 : 365, d = pt(s), a = Ye(s), o = he(he({ yearlen: r, nextyearlen: _, yearordinal: d, yearweekday: a }, function(w) {
    var E = Be(w) ? 366 : 365, D = ze(w, 1, 1), S = Ye(D);
    return E === 365 ? { mmask: zn, mdaymask: In, nmdaymask: Fn, wdaymask: Rt.slice(S), mrange: Wn } : { mmask: qn, mdaymask: jn, nmdaymask: Un, wdaymask: Rt.slice(S), mrange: Bn };
  }(e)), { wnomask: null });
  if (xe(i.byweekno))
    return o;
  o.wnomask = U(0, r + 7);
  var l = t = pe(7 - a + i.wkst, 7);
  l >= 4 ? (l = 0, n = o.yearlen + pe(a - i.wkst, 7)) : n = r - l;
  for (var h = Math.floor(n / 7), y = pe(n, 7), m = Math.floor(h + y / 4), f = 0; f < i.byweekno.length; f++) {
    var u = i.byweekno[f];
    if (u < 0 && (u += m + 1), u > 0 && u <= m) {
      var v = void 0;
      u > 1 ? (v = l + 7 * (u - 1), l !== t && (v -= 7 - t)) : v = l;
      for (var c = 0; c < 7 && (o.wnomask[v] = 1, v++, o.wdaymask[v] !== i.wkst); c++)
        ;
    }
  }
  if (W(i.byweekno, 1) && (v = l + 7 * m, l !== t && (v -= 7 - t), v < r))
    for (f = 0; f < 7 && (o.wnomask[v] = 1, v += 1, o.wdaymask[v] !== i.wkst); f++)
      ;
  if (l) {
    var p = void 0;
    if (W(i.byweekno, -1))
      p = -1;
    else {
      var g = Ye(ze(e - 1, 1, 1)), b = pe(7 - g.valueOf() + i.wkst, 7), x = Be(e - 1) ? 366 : 365, k = void 0;
      b >= 4 ? (b = 0, k = x + pe(g - i.wkst, 7)) : k = r - l, p = Math.floor(52 + pe(k, 7) / 4);
    }
    if (W(i.byweekno, p))
      for (v = 0; v < l; v++)
        o.wnomask[v] = 1;
  }
  return o;
}
var Xn = function() {
  function e(i) {
    this.options = i;
  }
  return e.prototype.rebuild = function(i, t) {
    var n = this.options;
    if (i !== this.lastyear && (this.yearinfo = Jn(i, n)), ae(n.bynweekday) && (t !== this.lastmonth || i !== this.lastyear)) {
      var s = this.yearinfo, r = s.yearlen, _ = s.mrange, d = s.wdaymask;
      this.monthinfo = function(a, o, l, h, y, m) {
        var f = { lastyear: a, lastmonth: o, nwdaymask: [] }, u = [];
        if (m.freq === z.YEARLY)
          if (xe(m.bymonth))
            u = [[0, l]];
          else
            for (var v = 0; v < m.bymonth.length; v++)
              o = m.bymonth[v], u.push(h.slice(o - 1, o + 1));
        else
          m.freq === z.MONTHLY && (u = [h.slice(o - 1, o + 1)]);
        if (xe(u))
          return f;
        for (f.nwdaymask = U(0, l), v = 0; v < u.length; v++)
          for (var c = u[v], p = c[0], g = c[1] - 1, b = 0; b < m.bynweekday.length; b++) {
            var x = void 0, k = m.bynweekday[b], w = k[0], E = k[1];
            E < 0 ? (x = g + 7 * (E + 1), x -= pe(y[x] - w, 7)) : (x = p + 7 * (E - 1), x += pe(7 - y[x] + w, 7)), p <= x && x <= g && (f.nwdaymask[x] = 1);
          }
        return f;
      }(i, t, r, _, d, n);
    }
    Z(n.byeaster) && (this.eastermask = function(a, o) {
      o === void 0 && (o = 0);
      var l = a % 19, h = Math.floor(a / 100), y = a % 100, m = Math.floor(h / 4), f = h % 4, u = Math.floor((h + 8) / 25), v = Math.floor((h - u + 1) / 3), c = Math.floor(19 * l + h - m - v + 15) % 30, p = Math.floor(y / 4), g = y % 4, b = Math.floor(32 + 2 * f + 2 * p - c - g) % 7, x = Math.floor((l + 11 * c + 22 * b) / 451), k = Math.floor((c + b - 7 * x + 114) / 31), w = (c + b - 7 * x + 114) % 31 + 1, E = Date.UTC(a, k - 1, w + o), D = Date.UTC(a, 0, 1);
      return [Math.ceil((E - D) / 864e5)];
    }(i, n.byeaster));
  }, Object.defineProperty(e.prototype, "lastyear", { get: function() {
    return this.monthinfo ? this.monthinfo.lastyear : null;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "lastmonth", { get: function() {
    return this.monthinfo ? this.monthinfo.lastmonth : null;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "yearlen", { get: function() {
    return this.yearinfo.yearlen;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "yearordinal", { get: function() {
    return this.yearinfo.yearordinal;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "mrange", { get: function() {
    return this.yearinfo.mrange;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "wdaymask", { get: function() {
    return this.yearinfo.wdaymask;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "mmask", { get: function() {
    return this.yearinfo.mmask;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "wnomask", { get: function() {
    return this.yearinfo.wnomask;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "nwdaymask", { get: function() {
    return this.monthinfo ? this.monthinfo.nwdaymask : [];
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "nextyearlen", { get: function() {
    return this.yearinfo.nextyearlen;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "mdaymask", { get: function() {
    return this.yearinfo.mdaymask;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "nmdaymask", { get: function() {
    return this.yearinfo.nmdaymask;
  }, enumerable: !1, configurable: !0 }), e.prototype.ydayset = function() {
    return [we(this.yearlen), 0, this.yearlen];
  }, e.prototype.mdayset = function(i, t) {
    for (var n = this.mrange[t - 1], s = this.mrange[t], r = U(null, this.yearlen), _ = n; _ < s; _++)
      r[_] = _;
    return [r, n, s];
  }, e.prototype.wdayset = function(i, t, n) {
    for (var s = U(null, this.yearlen + 7), r = pt(ze(i, t, n)) - this.yearordinal, _ = r, d = 0; d < 7 && (s[r] = r, ++r, this.wdaymask[r] !== this.options.wkst); d++)
      ;
    return [s, _, r];
  }, e.prototype.ddayset = function(i, t, n) {
    var s = U(null, this.yearlen), r = pt(ze(i, t, n)) - this.yearordinal;
    return s[r] = r, [s, r, r + 1];
  }, e.prototype.htimeset = function(i, t, n, s) {
    var r = this, _ = [];
    return this.options.byminute.forEach(function(d) {
      _ = _.concat(r.mtimeset(i, d, n, s));
    }), Je(_), _;
  }, e.prototype.mtimeset = function(i, t, n, s) {
    var r = this.options.bysecond.map(function(_) {
      return new Qe(i, t, _, s);
    });
    return Je(r), r;
  }, e.prototype.stimeset = function(i, t, n, s) {
    return [new Qe(i, t, n, s)];
  }, e.prototype.getdayset = function(i) {
    switch (i) {
      case F.YEARLY:
        return this.ydayset.bind(this);
      case F.MONTHLY:
        return this.mdayset.bind(this);
      case F.WEEKLY:
        return this.wdayset.bind(this);
      case F.DAILY:
      default:
        return this.ddayset.bind(this);
    }
  }, e.prototype.gettimeset = function(i) {
    switch (i) {
      case F.HOURLY:
        return this.htimeset.bind(this);
      case F.MINUTELY:
        return this.mtimeset.bind(this);
      case F.SECONDLY:
        return this.stimeset.bind(this);
    }
  }, e;
}();
function Kn(e, i, t, n, s, r) {
  for (var _ = [], d = 0; d < e.length; d++) {
    var a = void 0, o = void 0, l = e[d];
    l < 0 ? (a = Math.floor(l / i.length), o = pe(l, i.length)) : (a = Math.floor((l - 1) / i.length), o = pe(l - 1, i.length));
    for (var h = [], y = t; y < n; y++) {
      var m = r[y];
      Z(m) && h.push(m);
    }
    var f = void 0;
    f = a < 0 ? h.slice(a)[0] : h[a];
    var u = i[o], v = ia(s.yearordinal + f), c = oa(v, u);
    W(_, c) || _.push(c);
  }
  return Je(_), _;
}
function da(e, i) {
  var t = i.dtstart, n = i.freq, s = i.interval, r = i.until, _ = i.bysetpos, d = i.count;
  if (d === 0 || s === 0)
    return Ee(e);
  var a = An.fromDate(t), o = new Xn(i);
  o.rebuild(a.year, a.month);
  for (var l = function(E, D, S) {
    var M = S.freq, N = S.byhour, T = S.byminute, A = S.bysecond;
    return _t(M) ? function(C) {
      var H = C.dtstart.getTime() % 1e3;
      if (!_t(C.freq))
        return [];
      var O = [];
      return C.byhour.forEach(function($) {
        C.byminute.forEach(function(R) {
          C.bysecond.forEach(function(j) {
            O.push(new Qe($, R, j, H));
          });
        });
      }), O;
    }(S) : M >= z.HOURLY && ae(N) && !W(N, D.hour) || M >= z.MINUTELY && ae(T) && !W(T, D.minute) || M >= z.SECONDLY && ae(A) && !W(A, D.second) ? [] : E.gettimeset(M)(D.hour, D.minute, D.second, D.millisecond);
  }(o, a, i); ; ) {
    var h = o.getdayset(n)(a.year, a.month, a.day), y = h[0], m = h[1], f = h[2], u = Zn(y, m, f, o, i);
    if (ae(_))
      for (var v = Kn(_, l, m, f, o, y), c = 0; c < v.length; c++) {
        var p = v[c];
        if (r && p > r)
          return Ee(e);
        if (p >= t) {
          var g = jt(p, i);
          if (!e.accept(g) || d && !--d)
            return Ee(e);
        }
      }
    else
      for (c = m; c < f; c++) {
        var b = y[c];
        if (Z(b))
          for (var x = ia(o.yearordinal + b), k = 0; k < l.length; k++) {
            var w = l[k];
            if (p = oa(x, w), r && p > r || p >= t && (g = jt(p, i), !e.accept(g) || d && !--d))
              return Ee(e);
          }
      }
    if (i.interval === 0 || (a.add(i, u), a.year > aa))
      return Ee(e);
    _t(n) || (l = o.gettimeset(n)(a.hour, a.minute, a.second, 0)), o.rebuild(a.year, a.month);
  }
}
function Gn(e, i, t) {
  var n = t.bymonth, s = t.byweekno, r = t.byweekday, _ = t.byeaster, d = t.bymonthday, a = t.bynmonthday, o = t.byyearday;
  return ae(n) && !W(n, e.mmask[i]) || ae(s) && !e.wnomask[i] || ae(r) && !W(r, e.wdaymask[i]) || ae(e.nwdaymask) && !e.nwdaymask[i] || _ !== null && !W(e.eastermask, i) || (ae(d) || ae(a)) && !W(d, e.mdaymask[i]) && !W(a, e.nmdaymask[i]) || ae(o) && (i < e.yearlen && !W(o, i + 1) && !W(o, -e.yearlen + i) || i >= e.yearlen && !W(o, i + 1 - e.yearlen) && !W(o, -e.nextyearlen + i - e.yearlen));
}
function jt(e, i) {
  return new tt(e, i.tzid).rezonedDate();
}
function Ee(e) {
  return e.getValue();
}
function Zn(e, i, t, n, s) {
  for (var r = !1, _ = i; _ < t; _++) {
    var d = e[_];
    (r = Gn(n, d, s)) && (e[d] = null);
  }
  return r;
}
var ve = { MO: new ie(0), TU: new ie(1), WE: new ie(2), TH: new ie(3), FR: new ie(4), SA: new ie(5), SU: new ie(6) }, kt = { freq: F.YEARLY, dtstart: null, interval: 1, wkst: ve.MO, count: null, until: null, tzid: null, bysetpos: null, bymonth: null, bymonthday: null, bynmonthday: null, byyearday: null, byweekno: null, byweekday: null, bynweekday: null, byhour: null, byminute: null, bysecond: null, byeaster: null }, Qn = Object.keys(kt), z = function() {
  function e(i, t) {
    i === void 0 && (i = {}), t === void 0 && (t = !1), this._cache = t ? null : new $n(), this.origOptions = _a(i);
    var n = Cn(i).parsedOptions;
    this.options = n;
  }
  return e.parseText = function(i, t) {
    return sa(i, t);
  }, e.fromText = function(i, t) {
    return Nn(i, t);
  }, e.fromString = function(i) {
    return new e(e.parseString(i) || void 0);
  }, e.prototype._iter = function(i) {
    return da(i, this.options);
  }, e.prototype._cacheGet = function(i, t) {
    return !!this._cache && this._cache._cacheGet(i, t);
  }, e.prototype._cacheAdd = function(i, t, n) {
    if (this._cache)
      return this._cache._cacheAdd(i, t, n);
  }, e.prototype.all = function(i) {
    if (i)
      return this._iter(new $t("all", {}, i));
    var t = this._cacheGet("all");
    return t === !1 && (t = this._iter(new Ve("all", {})), this._cacheAdd("all", t)), t;
  }, e.prototype.between = function(i, t, n, s) {
    if (n === void 0 && (n = !1), !We(i) || !We(t))
      throw new Error("Invalid date passed in to RRule.between");
    var r = { before: t, after: i, inc: n };
    if (s)
      return this._iter(new $t("between", r, s));
    var _ = this._cacheGet("between", r);
    return _ === !1 && (_ = this._iter(new Ve("between", r)), this._cacheAdd("between", _, r)), _;
  }, e.prototype.before = function(i, t) {
    if (t === void 0 && (t = !1), !We(i))
      throw new Error("Invalid date passed in to RRule.before");
    var n = { dt: i, inc: t }, s = this._cacheGet("before", n);
    return s === !1 && (s = this._iter(new Ve("before", n)), this._cacheAdd("before", s, n)), s;
  }, e.prototype.after = function(i, t) {
    if (t === void 0 && (t = !1), !We(i))
      throw new Error("Invalid date passed in to RRule.after");
    var n = { dt: i, inc: t }, s = this._cacheGet("after", n);
    return s === !1 && (s = this._iter(new Ve("after", n)), this._cacheAdd("after", s, n)), s;
  }, e.prototype.count = function() {
    return this.all().length;
  }, e.prototype.toString = function() {
    return yt(this.origOptions);
  }, e.prototype.toText = function(i, t, n) {
    return function(s, r, _, d) {
      return new De(s, r, _, d).toString();
    }(this, i, t, n);
  }, e.prototype.isFullyConvertibleToText = function() {
    return Tn(this);
  }, e.prototype.clone = function() {
    return new e(this.origOptions);
  }, e.FREQUENCIES = ["YEARLY", "MONTHLY", "WEEKLY", "DAILY", "HOURLY", "MINUTELY", "SECONDLY"], e.YEARLY = F.YEARLY, e.MONTHLY = F.MONTHLY, e.WEEKLY = F.WEEKLY, e.DAILY = F.DAILY, e.HOURLY = F.HOURLY, e.MINUTELY = F.MINUTELY, e.SECONDLY = F.SECONDLY, e.MO = ve.MO, e.TU = ve.TU, e.WE = ve.WE, e.TH = ve.TH, e.FR = ve.FR, e.SA = ve.SA, e.SU = ve.SU, e.parseString = gt, e.optionsToString = yt, e;
}(), It = { dtstart: null, cache: !1, unfold: !1, forceset: !1, compatible: !1, tzid: null };
function er(e, i) {
  var t = [], n = [], s = [], r = [], _ = et(e), d = _.dtstart, a = _.tzid, o = function(l, h) {
    if (h === void 0 && (h = !1), l = l && l.trim(), !l)
      throw new Error("Invalid empty string");
    if (!h)
      return l.split(/\s/);
    for (var y = l.split(`
`), m = 0; m < y.length; ) {
      var f = y[m] = y[m].replace(/\s+$/g, "");
      f ? m > 0 && f[0] === " " ? (y[m - 1] += f.slice(1), y.splice(m, 1)) : m += 1 : y.splice(m, 1);
    }
    return y;
  }(e, i.unfold);
  return o.forEach(function(l) {
    var h;
    if (l) {
      var y = function(c) {
        var p = function(k) {
          if (k.indexOf(":") === -1)
            return { name: "RRULE", value: k };
          var w = xn(k, ":", 1), E = w[0], D = w[1];
          return { name: E, value: D };
        }(c), g = p.name, b = p.value, x = g.split(";");
        if (!x)
          throw new Error("empty property name");
        return { name: x[0].toUpperCase(), parms: x.slice(1), value: b };
      }(l), m = y.name, f = y.parms, u = y.value;
      switch (m.toUpperCase()) {
        case "RRULE":
          if (f.length)
            throw new Error("unsupported RRULE parm: ".concat(f.join(",")));
          t.push(gt(l));
          break;
        case "RDATE":
          var v = ((h = /RDATE(?:;TZID=([^:=]+))?/i.exec(l)) !== null && h !== void 0 ? h : [])[1];
          v && !a && (a = v), n = n.concat(Vt(u, f));
          break;
        case "EXRULE":
          if (f.length)
            throw new Error("unsupported EXRULE parm: ".concat(f.join(",")));
          s.push(gt(u));
          break;
        case "EXDATE":
          r = r.concat(Vt(u, f));
          break;
        case "DTSTART":
          break;
        default:
          throw new Error("unsupported property: " + m);
      }
    }
  }), { dtstart: d, tzid: a, rrulevals: t, rdatevals: n, exrulevals: s, exdatevals: r };
}
function at(e, i) {
  return i === void 0 && (i = {}), function(t, n) {
    var s = er(t, n), r = s.rrulevals, _ = s.rdatevals, d = s.exrulevals, a = s.exdatevals, o = s.dtstart, l = s.tzid, h = n.cache === !1;
    if (n.compatible && (n.forceset = !0, n.unfold = !0), n.forceset || r.length > 1 || _.length || d.length || a.length) {
      var y = new tr(h);
      return y.dtstart(o), y.tzid(l || void 0), r.forEach(function(f) {
        y.rrule(new z(dt(f, o, l), h));
      }), _.forEach(function(f) {
        y.rdate(f);
      }), d.forEach(function(f) {
        y.exrule(new z(dt(f, o, l), h));
      }), a.forEach(function(f) {
        y.exdate(f);
      }), n.compatible && n.dtstart && y.rdate(o), y;
    }
    var m = r[0] || {};
    return new z(dt(m, m.dtstart || n.dtstart || o, m.tzid || n.tzid || l), h);
  }(e, function(t) {
    var n = [], s = Object.keys(t), r = Object.keys(It);
    if (s.forEach(function(_) {
      W(r, _) || n.push(_);
    }), n.length)
      throw new Error("Invalid options: " + n.join(", "));
    return he(he({}, It), t);
  }(i));
}
function dt(e, i, t) {
  return he(he({}, e), { dtstart: i, tzid: t });
}
function Vt(e, i) {
  return function(t) {
    t.forEach(function(n) {
      if (!/(VALUE=DATE(-TIME)?)|(TZID=)/.test(n))
        throw new Error("unsupported RDATE/EXDATE parm: " + n);
    });
  }(i), e.split(",").map(function(t) {
    return xt(t);
  });
}
function Yt(e) {
  var i = this;
  return function(t) {
    if (t !== void 0 && (i["_".concat(e)] = t), i["_".concat(e)] !== void 0)
      return i["_".concat(e)];
    for (var n = 0; n < i._rrule.length; n++) {
      var s = i._rrule[n].origOptions[e];
      if (s)
        return s;
    }
  };
}
var tr = function(e) {
  function i(t) {
    t === void 0 && (t = !1);
    var n = e.call(this, {}, t) || this;
    return n.dtstart = Yt.apply(n, ["dtstart"]), n.tzid = Yt.apply(n, ["tzid"]), n._rrule = [], n._rdate = [], n._exrule = [], n._exdate = [], n;
  }
  return wt(i, e), i.prototype._iter = function(t) {
    return function(n, s, r, _, d, a) {
      var o = {}, l = n.accept;
      function h(u, v) {
        r.forEach(function(c) {
          c.between(u, v, !0).forEach(function(p) {
            o[Number(p)] = !0;
          });
        });
      }
      d.forEach(function(u) {
        var v = new tt(u, a).rezonedDate();
        o[Number(v)] = !0;
      }), n.accept = function(u) {
        var v = Number(u);
        return isNaN(v) ? l.call(this, u) : !(!o[v] && (h(new Date(v - 1), new Date(v + 1)), !o[v])) || (o[v] = !0, l.call(this, u));
      }, n.method === "between" && (h(n.args.after, n.args.before), n.accept = function(u) {
        var v = Number(u);
        return !!o[v] || (o[v] = !0, l.call(this, u));
      });
      for (var y = 0; y < _.length; y++) {
        var m = new tt(_[y], a).rezonedDate();
        if (!n.accept(new Date(m.getTime())))
          break;
      }
      s.forEach(function(u) {
        da(n, u.options);
      });
      var f = n._result;
      switch (Je(f), n.method) {
        case "all":
        case "between":
          return f;
        case "before":
          return f.length && f[f.length - 1] || null;
        default:
          return f.length && f[0] || null;
      }
    }(t, this._rrule, this._exrule, this._rdate, this._exdate, this.tzid());
  }, i.prototype.rrule = function(t) {
    Ut(t, this._rrule);
  }, i.prototype.exrule = function(t) {
    Ut(t, this._exrule);
  }, i.prototype.rdate = function(t) {
    Ft(t, this._rdate);
  }, i.prototype.exdate = function(t) {
    Ft(t, this._exdate);
  }, i.prototype.rrules = function() {
    return this._rrule.map(function(t) {
      return at(t.toString());
    });
  }, i.prototype.exrules = function() {
    return this._exrule.map(function(t) {
      return at(t.toString());
    });
  }, i.prototype.rdates = function() {
    return this._rdate.map(function(t) {
      return new Date(t.getTime());
    });
  }, i.prototype.exdates = function() {
    return this._exdate.map(function(t) {
      return new Date(t.getTime());
    });
  }, i.prototype.valueOf = function() {
    var t = [];
    return !this._rrule.length && this._dtstart && (t = t.concat(yt({ dtstart: this._dtstart }))), this._rrule.forEach(function(n) {
      t = t.concat(n.toString().split(`
`));
    }), this._exrule.forEach(function(n) {
      t = t.concat(n.toString().split(`
`).map(function(s) {
        return s.replace(/^RRULE:/, "EXRULE:");
      }).filter(function(s) {
        return !/^DTSTART/.test(s);
      }));
    }), this._rdate.length && t.push(Bt("RDATE", this._rdate, this.tzid())), this._exdate.length && t.push(Bt("EXDATE", this._exdate, this.tzid())), t;
  }, i.prototype.toString = function() {
    return this.valueOf().join(`
`);
  }, i.prototype.clone = function() {
    var t = new i(!!this._cache);
    return this._rrule.forEach(function(n) {
      return t.rrule(n.clone());
    }), this._exrule.forEach(function(n) {
      return t.exrule(n.clone());
    }), this._rdate.forEach(function(n) {
      return t.rdate(new Date(n.getTime()));
    }), this._exdate.forEach(function(n) {
      return t.exdate(new Date(n.getTime()));
    }), t;
  }, i;
}(z);
function Ut(e, i) {
  if (!(e instanceof z))
    throw new TypeError(String(e) + " is not RRule instance");
  W(i.map(String), String(e)) || i.push(e);
}
function Ft(e, i) {
  if (!(e instanceof Date))
    throw new TypeError(String(e) + " is not Date instance");
  W(i.map(Number), Number(e)) || (i.push(e), Je(i));
}
function Bt(e, i, t) {
  var n = !t || t.toUpperCase() === "UTC", s = n ? "".concat(e, ":") : "".concat(e, ";TZID=").concat(t, ":"), r = i.map(function(_) {
    return bt(_.valueOf(), n);
  }).join(",");
  return "".concat(s).concat(r);
}
function ar(e) {
  let i = null, t = null;
  function n(_) {
    i && clearInterval(i);
    const d = e.matrix[e._mode];
    if (!d)
      return;
    e._schedulerOuter = e.$container.querySelector(".dhx_timeline_data_wrapper"), d.scrollable || (e._schedulerOuter = e.$container.querySelector(".dhx_cal_data"));
    const a = { pageX: _.touches ? _.touches[0].pageX : _.pageX, pageY: _.touches ? _.touches[0].pageY : _.pageY };
    i = setInterval(function() {
      (function(o) {
        if (!e.getState().drag_id)
          return clearInterval(i), void (t = null);
        const l = e.matrix[e._mode];
        if (!l)
          return;
        const h = e._schedulerOuter, y = function(b, x) {
          const k = e.matrix[e._mode], w = {}, E = {};
          let D = x;
          for (w.x = b.touches ? b.touches[0].pageX : b.pageX, w.y = b.touches ? b.touches[0].pageY : b.pageY, E.left = D.offsetLeft + k.dx, E.top = D.offsetTop; D; )
            E.left += D.offsetLeft, E.top += D.offsetTop, D = D.offsetParent;
          return { x: w.x - E.left, y: w.y - E.top };
        }(o, h), m = h.offsetWidth - l.dx, f = h.offsetHeight, u = y.x, v = y.y;
        let c = l.autoscroll || {};
        c === !0 && (c = {}), e._merge(c, { range_x: 200, range_y: 100, speed_x: 20, speed_y: 10 });
        let p = s(u, m, t ? t.x : 0, c.range_x);
        l.scrollable || (p = 0);
        let g = s(v, f, t ? t.y : 0, c.range_y);
        !g && !p || t || (t = { x: u, y: v }, p = 0, g = 0), p *= c.speed_x, g *= c.speed_y, p && g && (Math.abs(p / 5) > Math.abs(g) ? g = 0 : Math.abs(g / 5) > Math.abs(p) && (p = 0)), p || g ? (t.started = !0, function(b, x) {
          const k = e._schedulerOuter;
          x && (k.scrollTop += x), b && (k.scrollLeft += b);
        }(p, g)) : clearInterval(i);
      })(a);
    }, 10);
  }
  function s(_, d, a, o) {
    return _ < o && (!t || t.started || _ < a) ? -1 : d - _ < o && (!t || t.started || _ > a) ? 1 : 0;
  }
  e.attachEvent("onDestroy", function() {
    clearInterval(i);
  });
  var r = e.attachEvent("onSchedulerReady", function() {
    e.matrix && (e.event(document.body, "mousemove", n), e.detachEvent(r));
  });
}
const nr = function() {
  var e, i = { minMax: "[0;max]", maxMin: "[max;0]", nMaxMin: "[-max;0]" };
  function t() {
    var r = i.minMax, _ = function() {
      var d = document.createElement("div");
      d.style.cssText = "direction: rtl;overflow: auto;width:100px;height: 100px;position:absolute;top: -100500px;left: -100500px;";
      var a = document.createElement("div");
      return a.style.cssText = "width: 100500px;height: 1px;", d.appendChild(a), d;
    }();
    return document.body.appendChild(_), _.scrollLeft > 0 ? r = i.minMax : (_.scrollLeft = -50, r = _.scrollLeft === -50 ? i.nMaxMin : i.maxMin), document.body.removeChild(_), r;
  }
  function n(r, _) {
    var d = s();
    return d === i.nMaxMin ? r ? -r : 0 : d === i.minMax ? _ - r : r;
  }
  function s() {
    return e || (e = t()), e;
  }
  return { modes: i, getMode: s, normalizeValue: n, getScrollValue: function(r) {
    var _ = getComputedStyle(r).direction;
    if (_ && _ !== "ltr") {
      var d = r.scrollWidth - r.offsetWidth;
      return n(r.scrollLeft, d);
    }
    return r.scrollLeft;
  }, setScrollValue: function(r, _) {
    var d = getComputedStyle(r).direction;
    if (d && d !== "ltr") {
      var a = n(_, r.scrollWidth - r.offsetWidth);
      r.scrollLeft = a;
    } else
      r.scrollLeft = _;
  } };
};
class rr {
  constructor(i) {
    this._scheduler = i;
  }
  getNode() {
    const i = this._scheduler;
    return this._tooltipNode || (this._tooltipNode = document.createElement("div"), this._tooltipNode.className = "dhtmlXTooltip scheduler_tooltip tooltip", i._waiAria.tooltipAttr(this._tooltipNode)), i.config.rtl ? this._tooltipNode.classList.add("dhtmlXTooltip_rtl") : this._tooltipNode.classList.remove("dhtmlXTooltip_rtl"), this._tooltipNode;
  }
  setViewport(i) {
    return this._root = i, this;
  }
  show(i, t) {
    const n = this._scheduler, s = n.$domHelpers, r = document.body, _ = this.getNode();
    if (s.isChildOf(_, r) || (this.hide(), r.appendChild(_)), this._isLikeMouseEvent(i)) {
      const d = this._calculateTooltipPosition(i);
      t = d.top, i = d.left;
    }
    return _.style.top = t + "px", _.style.left = i + "px", n._waiAria.tooltipVisibleAttr(_), this;
  }
  hide() {
    const i = this._scheduler, t = this.getNode();
    return t && t.parentNode && t.parentNode.removeChild(t), i._waiAria.tooltipHiddenAttr(t), this;
  }
  setContent(i) {
    return this.getNode().innerHTML = i, this;
  }
  _isLikeMouseEvent(i) {
    return !(!i || typeof i != "object") && "clientX" in i && "clientY" in i;
  }
  _getViewPort() {
    return this._root || document.body;
  }
  _calculateTooltipPosition(i) {
    const t = this._scheduler, n = t.$domHelpers, s = this._getViewPortSize(), r = this.getNode(), _ = { top: 0, left: 0, width: r.offsetWidth, height: r.offsetHeight, bottom: 0, right: 0 }, d = t.config.tooltip_offset_x, a = t.config.tooltip_offset_y, o = document.body, l = n.getRelativeEventPosition(i, o), h = n.getNodePosition(o);
    l.y += h.y, _.top = l.y, _.left = l.x, _.top += a, _.left += d, _.bottom = _.top + _.height, _.right = _.left + _.width;
    const y = window.scrollY + o.scrollTop;
    return _.top < s.top - y ? (_.top = s.top, _.bottom = _.top + _.height) : _.bottom > s.bottom && (_.bottom = s.bottom, _.top = _.bottom - _.height), _.left < s.left ? (_.left = s.left, _.right = s.left + _.width) : _.right > s.right && (_.right = s.right, _.left = _.right - _.width), l.x >= _.left && l.x <= _.right && (_.left = l.x - _.width - d, _.right = _.left + _.width), l.y >= _.top && l.y <= _.bottom && (_.top = l.y - _.height - a, _.bottom = _.top + _.height), _;
  }
  _getViewPortSize() {
    const i = this._scheduler, t = i.$domHelpers, n = this._getViewPort();
    let s, r = n, _ = window.scrollY + document.body.scrollTop, d = window.scrollX + document.body.scrollLeft;
    return n === i.$event_data ? (r = i.$event, _ = 0, d = 0, s = t.getNodePosition(i.$event)) : s = t.getNodePosition(r), { left: s.x + d, top: s.y + _, width: s.width, height: s.height, bottom: s.y + s.height + _, right: s.x + s.width + d };
  }
}
class ir {
  constructor(i) {
    this._listeners = {}, this.tooltip = new rr(i), this._scheduler = i, this._domEvents = i._createDomEventScope(), this._initDelayedFunctions();
  }
  destructor() {
    this.tooltip.hide(), this._domEvents.detachAll();
  }
  hideTooltip() {
    this.delayHide();
  }
  attach(i) {
    let t = document.body;
    const n = this._scheduler, s = n.$domHelpers;
    i.global || (t = n.$root);
    let r = null;
    const _ = (d) => {
      const a = s.getTargetNode(d), o = s.closest(a, i.selector);
      if (s.isChildOf(a, this.tooltip.getNode()))
        return;
      const l = () => {
        r = o, i.onmouseenter(d, o);
      };
      r ? o && o === r ? i.onmousemove(d, o) : (i.onmouseleave(d, r), r = null, o && o !== r && l()) : o && l();
    };
    this.detach(i.selector), this._domEvents.attach(t, "mousemove", _), this._listeners[i.selector] = { node: t, handler: _ };
  }
  detach(i) {
    const t = this._listeners[i];
    t && this._domEvents.detach(t.node, "mousemove", t.handler);
  }
  tooltipFor(i) {
    const t = (n) => {
      let s = n;
      return document.createEventObject && !document.createEvent && (s = document.createEventObject(n)), s;
    };
    this._initDelayedFunctions(), this.attach({ selector: i.selector, global: i.global, onmouseenter: (n, s) => {
      const r = i.html(n, s);
      r && this.delayShow(t(n), r);
    }, onmousemove: (n, s) => {
      const r = i.html(n, s);
      r ? this.delayShow(t(n), r) : (this.delayShow.$cancelTimeout(), this.delayHide());
    }, onmouseleave: () => {
      this.delayShow.$cancelTimeout(), this.delayHide();
    } });
  }
  _initDelayedFunctions() {
    const i = this._scheduler;
    this.delayShow && this.delayShow.$cancelTimeout(), this.delayHide && this.delayHide.$cancelTimeout(), this.tooltip.hide(), this.delayShow = ge.delay((t, n) => {
      i.callEvent("onBeforeTooltip", [t]) === !1 ? this.tooltip.hide() : (this.tooltip.setContent(n), this.tooltip.show(t));
    }, i.config.tooltip_timeout || 1), this.delayHide = ge.delay(() => {
      this.delayShow.$cancelTimeout(), this.tooltip.hide();
    }, i.config.tooltip_hide_timeout || 1);
  }
}
const or = { active_links: function(e) {
  e.config.active_link_view = "day", e._active_link_click = function(i) {
    var t = i.target.getAttribute("data-link-date"), n = e.date.str_to_date(e.config.api_date, !1, !0);
    if (t)
      return e.setCurrentView(n(t), e.config.active_link_view), i && i.preventDefault && i.preventDefault(), !1;
  }, e.attachEvent("onTemplatesReady", function() {
    var i = function(n, s) {
      s = s || n + "_scale_date", e.templates["_active_links_old_" + s] || (e.templates["_active_links_old_" + s] = e.templates[s]);
      var r = e.templates["_active_links_old_" + s], _ = e.date.date_to_str(e.config.api_date);
      e.templates[s] = function(d) {
        return "<a data-link-date='" + _(d) + "' href='#'>" + r(d) + "</a>";
      };
    };
    if (i("week"), i("", "month_day"), this.matrix)
      for (var t in this.matrix)
        i(t);
    this._detachDomEvent(this._obj, "click", e._active_link_click), e.event(this._obj, "click", e._active_link_click);
  });
}, agenda_legacy: function(e) {
  e.date.add_agenda_legacy = function(i) {
    return e.date.add(i, 1, "year");
  }, e.templates.agenda_legacy_time = function(i, t, n) {
    return n._timed ? this.day_date(n.start_date, n.end_date, n) + " " + this.event_date(i) : e.templates.day_date(i) + " &ndash; " + e.templates.day_date(t);
  }, e.templates.agenda_legacy_text = function(i, t, n) {
    return n.text;
  }, e.templates.agenda_legacy_date = function() {
    return "";
  }, e.date.agenda_legacy_start = function() {
    return e.date.date_part(e._currentDate());
  }, e.attachEvent("onTemplatesReady", function() {
    var i = e.dblclick_dhx_cal_data;
    e.dblclick_dhx_cal_data = function() {
      if (this._mode == "agenda_legacy")
        !this.config.readonly && this.config.dblclick_create && this.addEventNow();
      else if (i)
        return i.apply(this, arguments);
    };
    var t = e.render_data;
    e.render_data = function(r) {
      if (this._mode != "agenda_legacy")
        return t.apply(this, arguments);
      s();
    };
    var n = e.render_view_data;
    function s() {
      var r = e.get_visible_events();
      r.sort(function(c, p) {
        return c.start_date > p.start_date ? 1 : -1;
      });
      for (var _, d = "<div class='dhx_agenda_area' " + e._waiAria.agendaDataAttrString() + ">", a = 0; a < r.length; a++) {
        var o = r[a], l = o.color ? "--dhx-scheduler-event-background:" + o.color + ";" : "", h = o.textColor ? "--dhx-scheduler-event-color:" + o.textColor + ";" : "", y = e.templates.event_class(o.start_date, o.end_date, o);
        _ = e._waiAria.agendaEventAttrString(o);
        var m = e._waiAria.agendaDetailsBtnString();
        d += "<div " + _ + " class='dhx_agenda_line" + (y ? " " + y : "") + "' event_id='" + o.id + "' " + e.config.event_attribute + "='" + o.id + "' style='" + h + l + (o._text_style || "") + "'><div class='dhx_agenda_event_time'>" + (e.config.rtl ? e.templates.agenda_time(o.end_date, o.start_date, o) : e.templates.agenda_time(o.start_date, o.end_date, o)) + "</div>", d += `<div ${m} class='dhx_event_icon icon_details'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M15.4444 16.4H4.55556V7.6H15.4444V16.4ZM13.1111 2V3.6H6.88889V2H5.33333V3.6H4.55556C3.69222 3.6 3 4.312 3 5.2V16.4C3 16.8243 3.16389 17.2313 3.45561 17.5314C3.74733 17.8314 4.143 18 4.55556 18H15.4444C15.857 18 16.2527 17.8314 16.5444 17.5314C16.8361 17.2313 17 16.8243 17 16.4V5.2C17 4.312 16.3 3.6 15.4444 3.6H14.6667V2H13.1111ZM13.8889 10.8H10V14.8H13.8889V10.8Z" fill="#A1A4A6"/>
			</svg></div>`, d += "<span>" + e.templates.agenda_text(o.start_date, o.end_date, o) + "</span></div>";
      }
      d += "<div class='dhx_v_border'></div></div>", e._els.dhx_cal_data[0].innerHTML = d, e._els.dhx_cal_data[0].childNodes[0].scrollTop = e._agendaScrollTop || 0;
      var f = e._els.dhx_cal_data[0].childNodes[0];
      f.childNodes[f.childNodes.length - 1].style.height = f.offsetHeight < e._els.dhx_cal_data[0].offsetHeight ? "100%" : f.offsetHeight + "px";
      var u = e._els.dhx_cal_data[0].firstChild.childNodes, v = e._getNavDateElement();
      for (v && (v.innerHTML = e.templates.agenda_date(e._min_date, e._max_date, e._mode)), e._rendered = [], a = 0; a < u.length - 1; a++)
        e._rendered[a] = u[a];
    }
    e.render_view_data = function() {
      return this._mode == "agenda_legacy" && (e._agendaScrollTop = e._els.dhx_cal_data[0].childNodes[0].scrollTop, e._els.dhx_cal_data[0].childNodes[0].scrollTop = 0), n.apply(this, arguments);
    }, e.agenda_legacy_view = function(r) {
      e._min_date = e.config.agenda_start || e.date.agenda_legacy_start(e._date), e._max_date = e.config.agenda_end || e.date.add_agenda_legacy(e._min_date, 1), function(_) {
        if (_) {
          var d = e.locale.labels, a = e._waiAria.agendaHeadAttrString(), o = e._waiAria.agendaHeadDateString(d.date), l = e._waiAria.agendaHeadDescriptionString(d.description);
          e._els.dhx_cal_header[0].innerHTML = "<div " + a + " class='dhx_agenda_line dhx_agenda_line_header'><div " + o + ">" + d.date + "</div><span class = 'description_header' style='padding-left:25px' " + l + ">" + d.description + "</span></div>", e._table_view = !0, e.set_sizes();
        }
      }(r), r ? (e._cols = null, e._colsS = null, e._table_view = !0, s()) : e._table_view = !1;
    };
  });
}, agenda_view: function(e) {
  e.date.add_agenda = function(s, r) {
    return e.date.add(s, 1 * r, "month");
  }, e.templates.agenda_time = function(s, r, _) {
    return _._timed ? `${this.event_date(s)} - ${this.event_date(r)}` : e.locale.labels.full_day;
  }, e.templates.agenda_text = function(s, r, _) {
    return _.text;
  };
  const i = e.date.date_to_str("%F %j"), t = e.date.date_to_str("%l");
  e.templates.agenda_day = function(s) {
    return `<div class="dhx_agenda_day_date">${i(s)}</div>
		<div class="dhx_agenda_day_dow">${t(s)}</div>`;
  }, e.templates.agenda_date = function(s, r) {
    return e.templates.month_date(e.getState().date);
  }, e.date.agenda_start = function(s) {
    return e.date.month_start(new Date(s));
  };
  let n = 0;
  e.attachEvent("onTemplatesReady", function() {
    var s = e.dblclick_dhx_cal_data;
    e.dblclick_dhx_cal_data = function() {
      if (this._mode == "agenda")
        !this.config.readonly && this.config.dblclick_create && this.addEventNow();
      else if (s)
        return s.apply(this, arguments);
    };
    var r = e.render_data;
    e.render_data = function(o) {
      if (this._mode != "agenda")
        return r.apply(this, arguments);
      d();
    };
    var _ = e.render_view_data;
    function d() {
      const o = e.get_visible_events();
      o.sort(function(v, c) {
        return v.start_date > c.start_date ? 1 : -1;
      });
      const l = {};
      let h = e.getState().min_date;
      const y = e.getState().max_date;
      for (; h.valueOf() < y.valueOf(); )
        l[h.valueOf()] = [], h = e.date.add(h, 1, "day");
      let m = !1;
      if (o.forEach((v) => {
        let c = e.date.day_start(new Date(v.start_date));
        for (; c.valueOf() < v.end_date.valueOf(); )
          l[c.valueOf()] && (l[c.valueOf()].push(v), m = !0), c = e.date.day_start(e.date.add(c, 1, "day"));
      }), m) {
        let v = "";
        for (let c in l)
          v += a(new Date(1 * c), l[c]);
        e._els.dhx_cal_data[0].innerHTML = v;
      } else
        e._els.dhx_cal_data[0].innerHTML = `<div class="dhx_cal_agenda_no_events">${e.locale.labels.agenda_tab}</div>`;
      e._els.dhx_cal_data[0].scrollTop = n;
      let f = e._els.dhx_cal_data[0].querySelectorAll(".dhx_cal_agenda_event_line");
      e._rendered = [];
      for (var u = 0; u < f.length - 1; u++)
        e._rendered[u] = f[u];
    }
    function a(o, l) {
      if (!l.length)
        return "";
      let h = `
<div class="dhx_cal_agenda_day">
	<div class="dhx_cal_agenda_day_header">${e.templates.agenda_day(o)}</div>
	<div class="dhx_cal_agenda_day_events">
`;
      return l.forEach((y) => {
        h += function(m, f) {
          const u = e.templates.agenda_time(f.start_date, f.end_date, f), v = e.getState().select_id, c = e.templates.event_class(f.start_date, f.end_date, f), p = e.templates.agenda_text(f.start_date, f.end_date, f);
          let g = "";
          return (f.color || f.textColor) && (g = ` style="${f.color ? "--dhx-scheduler-event-background:" + f.color + ";" : ""}${f.textColor ? "--dhx-scheduler-event-color:" + f.textColor + ";" : ""}" `), `<div class="dhx_cal_agenda_event_line ${c || ""} ${f.id == v ? "dhx_cal_agenda_event_line_selected" : ""}" ${g} ${e.config.event_attribute}="${f.id}">
	<div class="dhx_cal_agenda_event_line_marker"></div>
	<div class="dhx_cal_agenda_event_line_time">${u}</div>
	<div class="dhx_cal_agenda_event_line_text">${p}</div>
</div>`;
        }(0, y);
      }), h += "</div></div>", h;
    }
    e.render_view_data = function() {
      return this._mode == "agenda" && (n = e._els.dhx_cal_data[0].scrollTop, e._els.dhx_cal_data[0].scrollTop = 0), _.apply(this, arguments);
    }, e.agenda_view = function(o) {
      o ? (e._min_date = e.config.agenda_start || e.date.agenda_start(e._date), e._max_date = e.config.agenda_end || e.date.add_agenda(e._min_date, 1), e._cols = null, e._colsS = null, e._table_view = !0, e._getNavDateElement().innerHTML = e.templates.agenda_date(e._date), d()) : e._table_view = !1;
    };
  });
}, all_timed: function(e) {
  e.config.all_timed = "short", e.config.all_timed_month = !1;
  var i = function(d) {
    return !((d.end_date - d.start_date) / 36e5 >= 24) || e._drag_mode == "resize" && e._drag_id == d.id;
  };
  e._safe_copy = function(d) {
    var a = null, o = e._copy_event(d);
    return d.event_pid && (a = e.getEvent(d.event_pid)), a && a.isPrototypeOf(d) && (delete o.event_length, delete o.event_pid, delete o.rec_pattern, delete o.rec_type), o;
  };
  var t = e._pre_render_events_line, n = e._pre_render_events_table, s = function(d, a) {
    return this._table_view ? n.call(this, d, a) : t.call(this, d, a);
  };
  e._pre_render_events_line = e._pre_render_events_table = function(d, a) {
    if (!this.config.all_timed || this._table_view && this._mode != "month" || this._mode == "month" && !this.config.all_timed_month)
      return s.call(this, d, a);
    for (var o = 0; o < d.length; o++) {
      var l = d[o];
      if (!l._timed)
        if (this.config.all_timed != "short" || i(l)) {
          var h = this._safe_copy(l);
          l._virtual ? h._first_chunk = !1 : h._first_chunk = !0, h._drag_resize = !1, h._virtual = !0, h.start_date = new Date(h.start_date), u(l) ? (h.end_date = v(h.start_date), this.config.last_hour != 24 && (h.end_date = c(h.start_date, this.config.last_hour))) : h.end_date = new Date(l.end_date);
          var y = !1;
          h.start_date < this._max_date && h.end_date > this._min_date && h.start_date < h.end_date && (d[o] = h, y = !0);
          var m = this._safe_copy(l);
          if (m._virtual = !0, m.end_date = new Date(m.end_date), m.start_date < this._min_date ? m.start_date = c(this._min_date, this.config.first_hour) : m.start_date = c(v(l.start_date), this.config.first_hour), m.start_date < this._max_date && m.start_date < m.end_date) {
            if (!y) {
              d[o--] = m;
              continue;
            }
            d.splice(o + 1, 0, m), m._last_chunk = !1;
          } else
            h._last_chunk = !0, h._drag_resize = !0;
        } else
          this._mode != "month" && d.splice(o--, 1);
    }
    var f = this._drag_mode != "move" && a;
    return s.call(this, d, f);
    function u(p) {
      var g = v(p.start_date);
      return +p.end_date > +g;
    }
    function v(p) {
      var g = e.date.add(p, 1, "day");
      return g = e.date.date_part(g);
    }
    function c(p, g) {
      var b = e.date.date_part(new Date(p));
      return b.setHours(g), b;
    }
  };
  var r = e.get_visible_events;
  e.get_visible_events = function(d) {
    return this.config.all_timed && this.config.multi_day ? r.call(this, !1) : r.call(this, d);
  }, e.attachEvent("onBeforeViewChange", function(d, a, o, l) {
    return e._allow_dnd = o == "day" || o == "week" || e.getView(o), !0;
  }), e._is_main_area_event = function(d) {
    return !!(d._timed || this.config.all_timed === !0 || this.config.all_timed == "short" && i(d));
  };
  var _ = e.updateEvent;
  e.updateEvent = function(d) {
    var a, o, l = e.getEvent(d);
    l && (a = e.config.all_timed && !(e.isOneDayEvent(e._events[d]) || e.getState().drag_id)) && (o = e.config.update_render, e.config.update_render = !0), _.apply(e, arguments), l && a && (e.config.update_render = o);
  };
}, collision: function(e) {
  var i, t;
  function n(s) {
    e._get_section_view() && s && (i = e.getEvent(s)[e._get_section_property()]);
  }
  e.config.collision_limit = 1, e.attachEvent("onBeforeDrag", function(s) {
    return n(s), !0;
  }), e.attachEvent("onBeforeLightbox", function(s) {
    var r = e.getEvent(s);
    return t = [r.start_date, r.end_date], n(s), !0;
  }), e.attachEvent("onEventChanged", function(s) {
    if (!s || !e.getEvent(s))
      return !0;
    var r = e.getEvent(s);
    if (!e.checkCollision(r)) {
      if (!t)
        return !1;
      r.start_date = t[0], r.end_date = t[1], r._timed = this.isOneDayEvent(r);
    }
    return !0;
  }), e.attachEvent("onBeforeEventChanged", function(s, r, _) {
    return e.checkCollision(s);
  }), e.attachEvent("onEventAdded", function(s, r) {
    e.checkCollision(r) || e.deleteEvent(s);
  }), e.attachEvent("onEventSave", function(s, r, _) {
    if ((r = e._lame_clone(r)).id = s, !r.start_date || !r.end_date) {
      var d = e.getEvent(s);
      r.start_date = new Date(d.start_date), r.end_date = new Date(d.end_date);
    }
    return r.rec_type && e._roll_back_dates(r), e.checkCollision(r);
  }), e._check_sections_collision = function(s, r) {
    var _ = e._get_section_property();
    return s[_] == r[_] && s.id != r.id;
  }, e.checkCollision = function(s) {
    var r = [], _ = e.config.collision_limit;
    if (s.rec_type)
      for (var d = e.getRecDates(s), a = 0; a < d.length; a++)
        for (var o = e.getEvents(d[a].start_date, d[a].end_date), l = 0; l < o.length; l++)
          (o[l].event_pid || o[l].id) != s.id && r.push(o[l]);
    else {
      r = e.getEvents(s.start_date, s.end_date);
      for (var h = 0; h < r.length; h++) {
        var y = r[h];
        if (y.id == s.id || y.event_length && [y.event_pid, y.event_length].join("#") == s.id) {
          r.splice(h, 1);
          break;
        }
      }
    }
    var m = e._get_section_view(), f = e._get_section_property(), u = !0;
    if (m) {
      var v = 0;
      for (h = 0; h < r.length; h++)
        r[h].id != s.id && this._check_sections_collision(r[h], s) && v++;
      v >= _ && (u = !1);
    } else
      r.length >= _ && (u = !1);
    if (!u) {
      var c = !e.callEvent("onEventCollision", [s, r]);
      return c || (s[f] = i || s[f]), c;
    }
    return u;
  };
}, container_autoresize: function(e) {
  e.config.container_autoresize = !0, e.config.month_day_min_height = 90, e.config.min_grid_size = 25, e.config.min_map_size = 400;
  var i = e._pre_render_events, t = !0, n = 0, s = 0;
  e._pre_render_events = function(l, h) {
    if (!e.config.container_autoresize || !t)
      return i.apply(this, arguments);
    var y = this.xy.bar_height, m = this._colsS.heights, f = this._colsS.heights = [0, 0, 0, 0, 0, 0, 0], u = this._els.dhx_cal_data[0];
    if (l = this._table_view ? this._pre_render_events_table(l, h) : this._pre_render_events_line(l, h), this._table_view)
      if (h)
        this._colsS.heights = m;
      else {
        var v = u.firstChild;
        const w = v.querySelectorAll(".dhx_cal_month_row");
        if (w) {
          for (var c = 0; c < w.length; c++) {
            if (f[c]++, f[c] * y > this._colsS.height - this.xy.month_head_height) {
              var p = w[c].querySelectorAll(".dhx_cal_month_cell"), g = this._colsS.height - this.xy.month_head_height;
              1 * this.config.max_month_events !== this.config.max_month_events || f[c] <= this.config.max_month_events ? g = f[c] * y : (this.config.max_month_events + 1) * y > this._colsS.height - this.xy.month_head_height && (g = (this.config.max_month_events + 1) * y), w[c].style.height = g + this.xy.month_head_height + "px";
              for (var b = 0; b < p.length; b++)
                p[b].childNodes[1].style.height = g + "px";
              f[c] = (f[c - 1] || 0) + p[0].offsetHeight;
            }
            f[c] = (f[c - 1] || 0) + w[c].querySelectorAll(".dhx_cal_month_cell")[0].offsetHeight;
          }
          f.unshift(0), v.parentNode.offsetHeight < v.parentNode.scrollHeight && v._h_fix;
        } else if (l.length || this._els.dhx_multi_day[0].style.visibility != "visible" || (f[0] = -1), l.length || f[0] == -1) {
          var x = (f[0] + 1) * y + 1;
          s != x + 1 && (this._obj.style.height = n - s + x - 1 + "px"), x += "px";
          const E = this._els.dhx_cal_navline[0].offsetHeight, D = this._els.dhx_cal_header[0].offsetHeight;
          u.style.height = this._obj.offsetHeight - E - D - (this.xy.margin_top || 0) + "px";
          var k = this._els.dhx_multi_day[0];
          k.style.height = x, k.style.visibility = f[0] == -1 ? "hidden" : "visible", (k = this._els.dhx_multi_day[1]).style.height = x, k.style.visibility = f[0] == -1 ? "hidden" : "visible", k.style.visibility == "hidden" ? k.style.display = "none" : k.style.display = "", k.className = f[0] ? "dhx_multi_day_icon" : "dhx_multi_day_icon_small", this._dy_shift = (f[0] + 1) * y, f[0] = 0;
        }
      }
    return l;
  };
  var r = ["dhx_cal_navline", "dhx_cal_header", "dhx_multi_day", "dhx_cal_data"], _ = function(l) {
    n = 0;
    for (var h = 0; h < r.length; h++) {
      var y = r[h], m = e._els[y] ? e._els[y][0] : null, f = 0;
      switch (y) {
        case "dhx_cal_navline":
        case "dhx_cal_header":
          f = m.offsetHeight;
          break;
        case "dhx_multi_day":
          f = m ? m.offsetHeight - 1 : 0, s = f;
          break;
        case "dhx_cal_data":
          var u = e.getState().mode;
          if (m.childNodes[1] && u != "month") {
            let N = 0;
            for (let T = 0; T < m.childNodes.length; T++)
              m.childNodes[T].offsetHeight > N && (N = m.childNodes[T].offsetHeight);
            f = N;
          } else
            f = Math.max(m.offsetHeight - 1, m.scrollHeight);
          if (u == "month")
            e.config.month_day_min_height && !l && (f = m.querySelectorAll(".dhx_cal_month_row").length * e.config.month_day_min_height), l && (m.style.height = f + "px");
          else if (u == "year")
            f = 190 * e.config.year_y;
          else if (u == "agenda") {
            if (f = 0, m.childNodes && m.childNodes.length)
              for (var v = 0; v < m.childNodes.length; v++)
                f += m.childNodes[v].offsetHeight;
            f + 2 < e.config.min_grid_size ? f = e.config.min_grid_size : f += 2;
          } else if (u == "week_agenda") {
            for (var c, p, g = e.xy.week_agenda_scale_height + e.config.min_grid_size, b = 0; b < m.childNodes.length; b++)
              for (p = m.childNodes[b], v = 0; v < p.childNodes.length; v++) {
                for (var x = 0, k = p.childNodes[v].childNodes[1], w = 0; w < k.childNodes.length; w++)
                  x += k.childNodes[w].offsetHeight;
                c = x + e.xy.week_agenda_scale_height, (c = b != 1 || v != 2 && v != 3 ? c : 2 * c) > g && (g = c);
              }
            f = 3 * g;
          } else if (u == "map") {
            f = 0;
            var E = m.querySelectorAll(".dhx_map_line");
            for (v = 0; v < E.length; v++)
              f += E[v].offsetHeight;
            f + 2 < e.config.min_map_size ? f = e.config.min_map_size : f += 2;
          } else if (e._gridView)
            if (f = 0, m.childNodes[1].childNodes[0].childNodes && m.childNodes[1].childNodes[0].childNodes.length) {
              for (E = m.childNodes[1].childNodes[0].childNodes[0].childNodes, v = 0; v < E.length; v++)
                f += E[v].offsetHeight;
              (f += 2) < e.config.min_grid_size && (f = e.config.min_grid_size);
            } else
              f = e.config.min_grid_size;
          if (e.matrix && e.matrix[u]) {
            if (l)
              f += 0, m.style.height = f + "px";
            else {
              f = 0;
              for (var D = e.matrix[u], S = D.y_unit, M = 0; M < S.length; M++)
                f += D.getSectionHeight(S[M].key);
              e.$container.clientWidth != e.$container.scrollWidth && (f += o());
            }
            f -= 1;
          }
          (u == "day" || u == "week" || e._props && e._props[u]) && (f += 2);
      }
      n += f += 1;
    }
    e._obj.style.height = n + "px", l || e.updateView();
  };
  function d() {
    t = !1, e.callEvent("onAfterSchedulerResize", []), t = !0;
  }
  var a = function() {
    if (!e.config.container_autoresize || !t)
      return !0;
    var l = e.getState().mode;
    if (!l)
      return !0;
    var h = window.requestAnimationFrame || window.setTimeout, y = document.documentElement.scrollTop;
    h(function() {
      !e.$destroyed && e.$initialized && _();
    }), e.matrix && e.matrix[l] || l == "month" ? h(function() {
      !e.$destroyed && e.$initialized && (_(!0), document.documentElement.scrollTop = y, d());
    }, 1) : d();
  };
  function o() {
    var l = document.createElement("div");
    l.style.cssText = "visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;", document.body.appendChild(l);
    var h = l.offsetWidth - l.clientWidth;
    return document.body.removeChild(l), h;
  }
  e.attachEvent("onBeforeViewChange", function() {
    var l = e.config.container_autoresize;
    if (e.xy.$original_scroll_width || (e.xy.$original_scroll_width = e.xy.scroll_width), e.xy.scroll_width = l ? 0 : e.xy.$original_scroll_width, e.matrix)
      for (var h in e.matrix) {
        var y = e.matrix[h];
        y.$original_section_autoheight || (y.$original_section_autoheight = y.section_autoheight), y.section_autoheight = !l && y.$original_section_autoheight;
      }
    return !0;
  }), e.attachEvent("onViewChange", a), e.attachEvent("onXLE", a), e.attachEvent("onEventChanged", a), e.attachEvent("onEventCreated", a), e.attachEvent("onEventAdded", a), e.attachEvent("onEventDeleted", a), e.attachEvent("onAfterSchedulerResize", a), e.attachEvent("onClearAll", a), e.attachEvent("onBeforeExpand", function() {
    return t = !1, !0;
  }), e.attachEvent("onBeforeCollapse", function() {
    return t = !0, !0;
  });
}, cookie: function(e) {
  function i(s) {
    return (s._obj.id || "scheduler") + "_settings";
  }
  var t = !0;
  e.attachEvent("onBeforeViewChange", function(s, r, _, d) {
    if (t && e._get_url_nav) {
      var a = e._get_url_nav();
      (a.date || a.mode || a.event) && (t = !1);
    }
    var o = i(e);
    if (t) {
      t = !1;
      var l = function(y) {
        var m = y + "=";
        if (document.cookie.length > 0) {
          var f = document.cookie.indexOf(m);
          if (f != -1) {
            f += m.length;
            var u = document.cookie.indexOf(";", f);
            return u == -1 && (u = document.cookie.length), document.cookie.substring(f, u);
          }
        }
        return "";
      }(o);
      if (l) {
        e._min_date || (e._min_date = d), (l = unescape(l).split("@"))[0] = this._helpers.parseDate(l[0]);
        var h = this.isViewExists(l[1]) ? l[1] : _;
        return d = isNaN(+l[0]) ? d : l[0], window.setTimeout(function() {
          e.$destroyed || e.setCurrentView(d, h);
        }, 1), !1;
      }
    }
    return !0;
  }), e.attachEvent("onViewChange", function(s, r) {
    var _, d, a = i(e), o = escape(this._helpers.formatDate(r) + "@" + s);
    d = a + "=" + o + ((_ = "expires=Sun, 31 Jan 9999 22:00:00 GMT") ? "; " + _ : ""), document.cookie = d;
  });
  var n = e._load;
  e._load = function() {
    var s = arguments;
    if (e._date)
      n.apply(this, s);
    else {
      var r = this;
      window.setTimeout(function() {
        n.apply(r, s);
      }, 1);
    }
  };
}, daytimeline: function(e) {
  At(e);
  var i = e.createTimelineView;
  e.createTimelineView = function(t) {
    if (t.render == "days") {
      var n = t.name, s = t.y_property = "timeline-week" + n;
      t.y_unit = [], t.render = "bar", t.days = t.days || 7, i.call(this, t), e.templates[n + "_scalex_class"] = function() {
      }, e.templates[n + "_scaley_class"] = function() {
      }, e.templates[n + "_scale_label"] = function(b, x, k) {
        return e.templates.day_date(x);
      }, e.date[n + "_start"] = function(b) {
        return b = e.date.week_start(b), b = e.date.add(b, t.x_step * t.x_start, t.x_unit);
      }, e.date["add_" + n] = function(b, x) {
        return e.date.add(b, x * t.days, "day");
      };
      var r = e._renderMatrix;
      e._renderMatrix = function(b, x) {
        b && function() {
          var k = new Date(e.getState().date), w = e.date[n + "_start"](k);
          w = e.date.date_part(w);
          var E = [], D = e.matrix[n];
          D.y_unit = E, D.order = {};
          for (var S = 0; S < t.days; S++)
            E.push({ key: +w, label: w }), D.order[D.y_unit[S].key] = S, w = e.date.add(w, 1, "day");
        }(), r.apply(this, arguments);
      };
      var _ = e.checkCollision;
      e.checkCollision = function(b) {
        return b[s] && delete (b = function(x) {
          var k = {};
          for (var w in x)
            k[w] = x[w];
          return k;
        }(b))[s], _.apply(e, [b]);
      }, e.attachEvent("onBeforeDrag", function(b, x, k) {
        var w = k.target || k.srcElement, E = e._getClassName(w);
        if (x == "resize")
          E.indexOf("dhx_event_resize_end") < 0 ? e._w_line_drag_from_start = !0 : e._w_line_drag_from_start = !1;
        else if (x == "move" && E.indexOf("no_drag_move") >= 0)
          return !1;
        return !0;
      });
      var d = e["mouse_" + n];
      e["mouse_" + n] = function(b) {
        var x;
        this._drag_event && (x = this._drag_event._move_delta);
        var k = e.matrix[this._mode];
        if (k.scrollable && !b.converted && (b.converted = 1, b.x -= -k._x_scroll, b.y += k._y_scroll), x === void 0 && e._drag_mode == "move") {
          var w = { y: b.y };
          e._resolve_timeline_section(k, w);
          var E = b.x - k.dx, D = new Date(w.section);
          p(e._timeline_drag_date(k, E), D);
          var S = e._drag_event, M = this.getEvent(this._drag_id);
          M && (S._move_delta = (M.start_date - D) / 6e4, this.config.preserve_length && b._ignores && (S._move_delta = this._get_real_event_length(M.start_date, D, k), S._event_length = this._get_real_event_length(M.start_date, M.end_date, k)));
        }
        if (b = d.apply(e, arguments), e._drag_mode && e._drag_mode != "move") {
          var N = null;
          N = e._drag_event && e._drag_event["timeline-week" + n] ? new Date(e._drag_event["timeline-week" + n]) : new Date(b.section), b.y += Math.round((N - e.date.date_part(new Date(e._min_date))) / (6e4 * this.config.time_step)), e._drag_mode == "resize" && (b.resize_from_start = e._w_line_drag_from_start);
        } else if (e._drag_event) {
          var T = Math.floor(Math.abs(b.y / (1440 / e.config.time_step)));
          T *= b.y > 0 ? 1 : -1, b.y = b.y % (1440 / e.config.time_step);
          var A = e.date.date_part(new Date(e._min_date));
          A.valueOf() != new Date(b.section).valueOf() && (b.x = Math.floor((b.section - A) / 864e5), b.x += T);
        }
        return b;
      }, e.attachEvent("onEventCreated", function(b, x) {
        return e._events[b] && delete e._events[b][s], !0;
      }), e.attachEvent("onBeforeEventChanged", function(b, x, k, w) {
        return e._events[b.id] && delete e._events[b.id][s], !0;
      });
      var a = e._update_timeline_section;
      e._update_timeline_section = function(b) {
        var x, k;
        this._mode == n && (x = b.event) && (k = e._get_copied_event(x.id, e.date.day_start(new Date(x.start_date.valueOf())))) && (b.event._sorder = k._sorder, b.event._count = k._count), a.apply(this, arguments), x && k && (k._count = x._count, k._sorder = x._sorder);
      };
      var o = e.render_view_data;
      e.render_view_data = function(b, x) {
        return this._mode == n && b && (b = f(b), e._restore_render_flags(b)), o.apply(e, [b, x]);
      };
      var l = e.get_visible_events;
      e.get_visible_events = function() {
        if (this._mode == n) {
          this._clear_copied_events(), e._max_date = e.date.date_part(e.date.add(e._min_date, t.days, "day"));
          var b = l.apply(e, arguments);
          return b = f(b), e._register_copies_array(b), b;
        }
        return l.apply(e, arguments);
      };
      var h = e.addEventNow;
      e.addEventNow = function(b) {
        if (e.getState().mode == n)
          if (b[s]) {
            var x = new Date(b[s]);
            m(x, b.start_date), m(x, b.end_date);
          } else {
            var k = new Date(b.start_date);
            b[s] = +e.date.date_part(k);
          }
        return h.apply(e, arguments);
      };
      var y = e._render_marked_timespan;
      e._render_marked_timespan = function() {
        if (e._mode != n)
          return y.apply(this, arguments);
      };
    } else
      i.apply(this, arguments);
    function m(b, x) {
      x.setDate(1), x.setFullYear(b.getFullYear()), x.setMonth(b.getMonth()), x.setDate(b.getDate());
    }
    function f(b) {
      for (var x = [], k = 0; k < b.length; k++) {
        var w = v(b[k]);
        if (e.isOneDayEvent(w))
          c(w), x.push(w);
        else {
          for (var E = new Date(Math.min(+w.end_date, +e._max_date)), D = new Date(Math.max(+w.start_date, +e._min_date)), S = []; +D < +E; ) {
            var M = v(w);
            M.start_date = D, M.end_date = new Date(Math.min(+g(M.start_date), +E)), D = g(D), c(M), x.push(M), S.push(M);
          }
          u(S, w);
        }
      }
      return x;
    }
    function u(b, x) {
      for (var k = !1, w = !1, E = 0, D = b.length; E < D; E++) {
        var S = b[E];
        k = +S._w_start_date == +x.start_date, w = +S._w_end_date == +x.end_date, S._no_resize_start = S._no_resize_end = !0, k && (S._no_resize_start = !1), w && (S._no_resize_end = !1);
      }
    }
    function v(b) {
      var x = e.getEvent(b.event_pid);
      return x && x.isPrototypeOf(b) ? (delete (b = e._copy_event(b)).event_length, delete b.event_pid, delete b.rec_pattern, delete b.rec_type) : b = e._lame_clone(b), b;
    }
    function c(b) {
      if (!b._w_start_date || !b._w_end_date) {
        var x = e.date, k = b._w_start_date = new Date(b.start_date), w = b._w_end_date = new Date(b.end_date);
        b[s] = +x.date_part(b.start_date), b._count || (b._count = 1), b._sorder || (b._sorder = 0);
        var E = w - k;
        b.start_date = new Date(e._min_date), p(k, b.start_date), b.end_date = new Date(+b.start_date + E), k.getTimezoneOffset() != w.getTimezoneOffset() && (b.end_date = new Date(b.end_date.valueOf() + 6e4 * (k.getTimezoneOffset() - w.getTimezoneOffset())));
      }
    }
    function p(b, x) {
      x.setMinutes(b.getMinutes()), x.setHours(b.getHours());
    }
    function g(b) {
      var x = e.date.add(b, 1, "day");
      return x = e.date.date_part(x);
    }
  };
}, drag_between: function(e) {
  window.Scheduler && window.Scheduler.plugin && (window.Scheduler._outer_drag = Ge), Qt.push(e), ht || ea(e), e.config.drag_in = !0, e.config.drag_out = !0, e.templates.event_outside = function(t, n, s) {
  };
  var i = Ge;
  e.attachEvent("onTemplatesReady", function() {
    e.event(e._obj, "mousemove", function(t) {
      i.target_scheduler = e;
    }), e.event(e._obj, "mouseup", function(t) {
      i.target_scheduler = e;
    });
  });
}, editors: function(e) {
  e.form_blocks.combo = { render: function(i) {
    i.cached_options || (i.cached_options = {});
    var t = "";
    return t += "<div class='" + i.type + "' ></div>";
  }, set_value: function(i, t, n, s) {
    (function() {
      m();
      var y = e.attachEvent("onAfterLightbox", function() {
        m(), e.detachEvent(y);
      });
      function m() {
        if (i._combo && i._combo.DOMParent) {
          var f = i._combo;
          f.unload ? f.unload() : f.destructor && f.destructor(), f.DOMParent = f.DOMelem = null;
        }
      }
    })(), window.dhx_globalImgPath = s.image_path || "/", i._combo = new dhtmlXCombo(i, s.name, i.offsetWidth - 8), s.onchange && i._combo.attachEvent("onChange", s.onchange), s.options_height && i._combo.setOptionHeight(s.options_height);
    var r = i._combo;
    if (r.enableFilteringMode(s.filtering, s.script_path || null, !!s.cache), s.script_path) {
      var _ = n[s.map_to];
      _ ? s.cached_options[_] ? (r.addOption(_, s.cached_options[_]), r.disable(1), r.selectOption(0), r.disable(0)) : e.ajax.get(s.script_path + "?id=" + _ + "&uid=" + e.uid(), function(y) {
        var m, f = y.xmlDoc.responseText;
        try {
          m = JSON.parse(f).options[0].text;
        } catch {
          m = e.ajax.xpath("//option", y.xmlDoc)[0].childNodes[0].nodeValue;
        }
        s.cached_options[_] = m, r.addOption(_, m), r.disable(1), r.selectOption(0), r.disable(0);
      }) : r.setComboValue("");
    } else {
      for (var d = [], a = 0; a < s.options.length; a++) {
        var o = s.options[a], l = [o.key, o.label, o.css];
        d.push(l);
      }
      if (r.addOption(d), n[s.map_to]) {
        var h = r.getIndexByValue(n[s.map_to]);
        r.selectOption(h);
      }
    }
  }, get_value: function(i, t, n) {
    var s = i._combo.getSelectedValue();
    return n.script_path && (n.cached_options[s] = i._combo.getSelectedText()), s;
  }, focus: function(i) {
  } }, e.form_blocks.radio = { render: function(i) {
    var t = "";
    t += `<div class='dhx_cal_ltext dhx_cal_radio ${i.vertical ? "dhx_cal_radio_vertical" : ""}' style='max-height:${i.height}px;'>`;
    for (var n = 0; n < i.options.length; n++) {
      var s = e.uid();
      t += "<label class='dhx_cal_radio_item' for='" + s + "'><input id='" + s + "' type='radio' name='" + i.name + "' value='" + i.options[n].key + "'><span> " + i.options[n].label + "</span></label>";
    }
    return t += "</div>";
  }, set_value: function(i, t, n, s) {
    for (var r = i.getElementsByTagName("input"), _ = 0; _ < r.length; _++) {
      r[_].checked = !1;
      var d = n[s.map_to] || t;
      r[_].value == d && (r[_].checked = !0);
    }
  }, get_value: function(i, t, n) {
    for (var s = i.getElementsByTagName("input"), r = 0; r < s.length; r++)
      if (s[r].checked)
        return s[r].value;
  }, focus: function(i) {
  } }, e.form_blocks.checkbox = { render: function(i) {
    return e.config.wide_form ? '<div class="dhx_cal_wide_checkbox"></div>' : "";
  }, set_value: function(i, t, n, s) {
    i = e._lightbox.querySelector(`#${s.id}`);
    var r = e.uid(), _ = s.checked_value !== void 0 ? t == s.checked_value : !!t;
    i.className += " dhx_cal_checkbox";
    var d = "<input id='" + r + "' type='checkbox' value='true' name='" + s.name + "'" + (_ ? "checked='true'" : "") + "'>", a = "<label for='" + r + "'>" + (e.locale.labels["section_" + s.name] || s.name) + "</label>";
    if (e.config.wide_form ? (i.innerHTML = a, i.nextSibling.innerHTML = d) : i.innerHTML = d + a, s.handler) {
      var o = i.getElementsByTagName("input")[0];
      if (o.$_eventAttached)
        return;
      o.$_eventAttached = !0, e.event(o, "click", s.handler);
    }
  }, get_value: function(i, t, n) {
    var s = (i = e._lightbox.querySelector(`#${n.id}`)).getElementsByTagName("input")[0];
    return s || (s = i.nextSibling.getElementsByTagName("input")[0]), s.checked ? n.checked_value || !0 : n.unchecked_value || !1;
  }, focus: function(i) {
  } };
}, expand: function(e) {
  e.ext.fullscreen = { toggleIcon: null }, e.expand = function() {
    if (e.callEvent("onBeforeExpand", [])) {
      var i = e._obj;
      do
        i._position = i.style.position || "", i.style.position = "static";
      while ((i = i.parentNode) && i.style);
      (i = e._obj).style.position = "absolute", i._width = i.style.width, i._height = i.style.height, i.style.width = i.style.height = "100%", i.style.top = i.style.left = "0px";
      var t = document.body;
      t.scrollTop = 0, (t = t.parentNode) && (t.scrollTop = 0), document.body._overflow = document.body.style.overflow || "", document.body.style.overflow = "hidden", e._maximize(), e.callEvent("onExpand", []);
    }
  }, e.collapse = function() {
    if (e.callEvent("onBeforeCollapse", [])) {
      var i = e._obj;
      do
        i.style.position = i._position;
      while ((i = i.parentNode) && i.style);
      (i = e._obj).style.width = i._width, i.style.height = i._height, document.body.style.overflow = document.body._overflow, e._maximize(), e.callEvent("onCollapse", []);
    }
  }, e.attachEvent("onTemplatesReady", function() {
    var i = document.createElement("div");
    i.className = "dhx_expand_icon", e.ext.fullscreen.toggleIcon = i, i.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g>
	<line x1="0.5" y1="5" x2="0.5" y2="3.0598e-08" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line y1="0.5" x2="5" y2="0.5" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line x1="0.5" y1="11" x2="0.5" y2="16" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line y1="15.5" x2="5" y2="15.5" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line x1="11" y1="0.5" x2="16" y2="0.5" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line x1="15.5" y1="2.18557e-08" x2="15.5" y2="5" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line x1="11" y1="15.5" x2="16" y2="15.5" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line x1="15.5" y1="16" x2="15.5" y2="11" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	</g>
	</svg>
	`, e._obj.appendChild(i), e.event(i, "click", function() {
      e.expanded ? e.collapse() : e.expand();
    });
  }), e._maximize = function() {
    this.expanded = !this.expanded, this.expanded ? this.ext.fullscreen.toggleIcon.classList.add("dhx_expand_icon--expanded") : this.ext.fullscreen.toggleIcon.classList.remove("dhx_expand_icon--expanded");
    for (var i = ["left", "top"], t = 0; t < i.length; t++) {
      var n = e["_prev_margin_" + i[t]];
      e.xy["margin_" + i[t]] ? (e["_prev_margin_" + i[t]] = e.xy["margin_" + i[t]], e.xy["margin_" + i[t]] = 0) : n && (e.xy["margin_" + i[t]] = e["_prev_margin_" + i[t]], delete e["_prev_margin_" + i[t]]);
    }
    e.setCurrentView();
  };
}, export_api: function(e) {
  (function() {
    function i(n, s) {
      for (var r in s)
        n[r] || (n[r] = s[r]);
      return n;
    }
    function t(n, s) {
      var r = {};
      return (n = s._els[n]) && n[0] ? (r.x = n[0].scrollWidth, r.y = n[0].scrollHeight) : (r.x = 0, r.y = 0), r;
    }
    window.dhtmlxAjax || (window.dhtmlxAjax = { post: function(n, s, r) {
      return window.dhx4.ajax.post(n, s, r);
    }, get: function(n, s) {
      return window.ajax.get(n, s);
    } }), function(n) {
      function s() {
        var r = n.getState().mode;
        return n.matrix && n.matrix[r] ? n.matrix[r] : null;
      }
      n.exportToPDF = function(r) {
        (r = i(r || {}, { name: "calendar.pdf", format: "A4", orientation: "landscape", dpi: 96, zoom: 1, rtl: n.config.rtl })).html = this._export_html(r), r.mode = this.getState().mode, this._send_to_export(r, "pdf");
      }, n.exportToPNG = function(r) {
        (r = i(r || {}, { name: "calendar.png", format: "A4", orientation: "landscape", dpi: 96, zoom: 1, rtl: n.config.rtl })).html = this._export_html(r), r.mode = this.getState().mode, this._send_to_export(r, "png");
      }, n.exportToICal = function(r) {
        r = i(r || {}, { name: "calendar.ical", data: this._serialize_plain(null, r) }), this._send_to_export(r, "ical");
      }, n.exportToExcel = function(r) {
        r = i(r || {}, { name: "calendar.xlsx", title: "Events", data: this._serialize_plain(this.templates.xml_format, r), columns: this._serialize_columns() }), this._send_to_export(r, "excel");
      }, n._ajax_to_export = function(r, _, d) {
        delete r.callback;
        var a = r.server || "https://export.dhtmlx.com/scheduler";
        window.dhtmlxAjax.post(a, "type=" + _ + "&store=1&data=" + encodeURIComponent(JSON.stringify(r)), function(o) {
          var l = null;
          if (!(o.xmlDoc.status > 400))
            try {
              l = JSON.parse(o.xmlDoc.responseText);
            } catch {
            }
          d(l);
        });
      }, n._plain_export_copy = function(r, _) {
        var d = {};
        for (var a in r)
          d[a] = r[a];
        return d.start_date = _(d.start_date), d.end_date = _(d.end_date), d.$text = this.templates.event_text(r.start_date, r.end_date, r), d;
      }, n._serialize_plain = function(r, _) {
        var d;
        r = r || n.date.date_to_str("%Y%m%dT%H%i%s", !0), d = _ && _.start && _.end ? n.getEvents(_.start, _.end) : n.getEvents();
        for (var a = [], o = 0; o < d.length; o++)
          a[o] = this._plain_export_copy(d[o], r);
        return a;
      }, n._serialize_columns = function() {
        return [{ id: "start_date", header: "Start Date", width: 30 }, { id: "end_date", header: "End Date", width: 30 }, { id: "$text", header: "Text", width: 100 }];
      }, n._send_to_export = function(r, _) {
        if (r.version || (r.version = n.version), r.skin || (r.skin = n.skin), r.callback)
          return n._ajax_to_export(r, _, r.callback);
        var d = this._create_hidden_form();
        d.firstChild.action = r.server || "https://export.dhtmlx.com/scheduler", d.firstChild.childNodes[0].value = JSON.stringify(r), d.firstChild.childNodes[1].value = _, d.firstChild.submit();
      }, n._create_hidden_form = function() {
        if (!this._hidden_export_form) {
          var r = this._hidden_export_form = document.createElement("div");
          r.style.display = "none", r.innerHTML = "<form method='POST' target='_blank'><input type='text' name='data'><input type='hidden' name='type' value=''></form>", document.body.appendChild(r);
        }
        return this._hidden_export_form;
      }, n._get_export_size = function(r, _, d, a, o, l, h) {
        a = parseInt(a) / 25.4 || 4;
        var y = { A5: { x: 148, y: 210 }, A4: { x: 210, y: 297 }, A3: { x: 297, y: 420 }, A2: { x: 420, y: 594 }, A1: { x: 594, y: 841 }, A0: { x: 841, y: 1189 } }, m = t("dhx_cal_data", this).x, f = { y: t("dhx_cal_data", this).y + t("dhx_cal_header", this).y + t("dhx_multi_day", this).y };
        return f.x = r === "full" ? m : Math.floor((_ === "landscape" ? y[r].y : y[r].x) * a), h && (f.x *= parseFloat(h.x) || 1, f.y *= parseFloat(h.y) || 1), f;
      }, n._export_html = function(r) {
        var _ = function() {
          var o = void 0, l = void 0, h = s();
          return h && (l = h.scrollable, o = h.smart_rendering), { nav_height: n.xy.nav_height, scroll_width: n.xy.scroll_width, style_width: n._obj.style.width, style_height: n._obj.style.height, timeline_scrollable: l, timeline_smart_rendering: o };
        }(), d = n._get_export_size(r.format, r.orientation, r.zoom, r.dpi, r.header, r.footer, r.scales), a = "";
        try {
          (function(o, l) {
            n._obj.style.width = o.x + "px", n._obj.style.height = o.y + "px", n.xy.nav_height = 0, n.xy.scroll_width = 0;
            var h = s();
            (l.timeline_scrollable || l.timeline_smart_rendering) && (h.scrollable = !1, h.smart_rendering = !1);
          })(d, _), n.setCurrentView(), a = n._obj.innerHTML;
        } catch (o) {
          console.error(o);
        } finally {
          (function(o) {
            n.xy.scroll_width = o.scroll_width, n.xy.nav_height = o.nav_height, n._obj.style.width = o.style_width, n._obj.style.height = o.style_height;
            var l = s();
            (o.timeline_scrollable || o.timeline_smart_rendering) && (l.scrollable = o.timeline_scrollable, l.smart_rendering = o.timeline_smart_rendering);
          })(_), n.setCurrentView();
        }
        return a;
      };
    }(e);
  })();
}, grid_view: function(e) {
  e._grid = { names: {}, sort_rules: { int: function(i, t, n) {
    return 1 * n(i) < 1 * n(t) ? 1 : -1;
  }, str: function(i, t, n) {
    return n(i) < n(t) ? 1 : -1;
  }, date: function(i, t, n) {
    return new Date(n(i)) < new Date(n(t)) ? 1 : -1;
  } }, _getObjName: function(i) {
    return "grid_" + i;
  }, _getViewName: function(i) {
    return i.replace(/^grid_/, "");
  } }, e.createGridView = function(i) {
    var t = i.name || "grid", n = e._grid._getObjName(t);
    function s(d) {
      return !(d !== void 0 && (1 * d != d || d < 0));
    }
    e._grid.names[t] = t, e.config[t + "_start"] = i.from || /* @__PURE__ */ new Date(0), e.config[t + "_end"] = i.to || new Date(9999, 1, 1), e[n] = i, e[n].defPadding = 8, e[n].columns = e[n].fields, e[n].unit = i.unit || "month", e[n].step = i.step || 1, delete e[n].fields;
    for (var r = e[n].columns, _ = 0; _ < r.length; _++)
      s(r[_].width) && (r[_].initialWidth = r[_].width), s(r[_].paddingLeft) || delete r[_].paddingLeft, s(r[_].paddingRight) || delete r[_].paddingRight;
    e[n].select = i.select === void 0 || i.select, e.locale.labels[t + "_tab"] === void 0 && (e.locale.labels[t + "_tab"] = e[n].label || e.locale.labels.grid_tab), e[n]._selected_divs = [], e.date[t + "_start"] = function(d) {
      return e.date[i.unit + "_start"] ? e.date[i.unit + "_start"](d) : d;
    }, e.date["add_" + t] = function(d, a) {
      return e.date.add(d, a * e[n].step, e[n].unit);
    }, e.templates[t + "_date"] = function(d, a) {
      return e.config.rtl ? e.templates.day_date(a) + " - " + e.templates.day_date(d) : e.templates.day_date(d) + " - " + e.templates.day_date(a);
    }, e.templates[t + "_full_date"] = function(d, a, o) {
      return e.isOneDayEvent(o) ? this[t + "_single_date"](d) : e.config.rtl ? e.templates.day_date(a) + " &ndash; " + e.templates.day_date(d) : e.templates.day_date(d) + " &ndash; " + e.templates.day_date(a);
    }, e.templates[t + "_single_date"] = function(d) {
      return e.templates.day_date(d) + " " + this.event_date(d);
    }, e.templates[t + "_field"] = function(d, a) {
      return a[d];
    }, e.attachEvent("onTemplatesReady", function() {
      e.attachEvent("onEventSelected", function(o) {
        if (this._mode == t && e[n].select)
          return e._grid.selectEvent(o, t), !1;
      }), e.attachEvent("onEventUnselected", function(o) {
        this._mode == t && e[n].select && e._grid.unselectEvent("", t);
      });
      var d = e.render_data;
      e.render_data = function(o) {
        if (this._mode != t)
          return d.apply(this, arguments);
        e._grid._fill_grid_tab(n);
      };
      var a = e.render_view_data;
      e.render_view_data = function() {
        var o = e._els.dhx_cal_data[0].lastChild;
        return this._mode == t && o && (e._grid._gridScrollTop = o.scrollTop), a.apply(this, arguments);
      };
    }), e[t + "_view"] = function(d) {
      if (e._grid._sort_marker = null, delete e._gridView, e._grid._gridScrollTop = 0, e._rendered = [], e[n]._selected_divs = [], d) {
        var a = null, o = null;
        e[n].paging ? (a = e.date[t + "_start"](new Date(e._date)), o = e.date["add_" + t](a, 1)) : (a = e.config[t + "_start"], o = e.config[t + "_end"]), e._min_date = a, e._max_date = o, e._grid.set_full_view(n);
        var l = "";
        +a > +/* @__PURE__ */ new Date(0) && +o < +new Date(9999, 1, 1) && (l = e.templates[t + "_date"](a, o));
        var h = e._getNavDateElement();
        h && (h.innerHTML = l), e._gridView = n;
      }
    };
  }, e.dblclick_dhx_grid_area = function() {
    !this.config.readonly && this.config.dblclick_create && this.addEventNow();
  }, e._click.dhx_cal_header && (e._old_header_click = e._click.dhx_cal_header), e._click.dhx_cal_header = function(i) {
    if (e._gridView) {
      var t = i || window.event, n = e._grid._get_target_column(t, e._gridView);
      e._grid._toggle_sort_state(e._gridView, n.id), e.clear_view(), e._grid._fill_grid_tab(e._gridView);
    } else if (e._old_header_click)
      return e._old_header_click.apply(this, arguments);
  }, e._grid.selectEvent = function(i, t) {
    if (e.callEvent("onBeforeRowSelect", [i])) {
      var n = e._grid._getObjName(t);
      e.for_rendered(i, function(s) {
        s.classList.add("dhx_grid_event_selected"), e[n]._selected_divs.push(s);
      });
    }
  }, e._grid._unselectDiv = function(i) {
    i.className = i.classList.remove("dhx_grid_event_selected");
  }, e._grid.unselectEvent = function(i, t) {
    var n = e._grid._getObjName(t);
    if (n && e[n]._selected_divs)
      if (i) {
        for (s = 0; s < e[n]._selected_divs.length; s++)
          if (e[n]._selected_divs[s].getAttribute(e.config.event_attribute) == i) {
            e._grid._unselectDiv(e[n]._selected_divs[s]), e[n]._selected_divs.slice(s, 1);
            break;
          }
      } else {
        for (var s = 0; s < e[n]._selected_divs.length; s++)
          e._grid._unselectDiv(e[n]._selected_divs[s]);
        e[n]._selected_divs = [];
      }
  }, e._grid._get_target_column = function(i, t) {
    var n = i.originalTarget || i.srcElement;
    e._getClassName(n) == "dhx_grid_view_sort" && (n = n.parentNode);
    for (var s = 0, r = 0; r < n.parentNode.childNodes.length; r++)
      if (n.parentNode.childNodes[r] == n) {
        s = r;
        break;
      }
    return e[t].columns[s];
  }, e._grid._get_sort_state = function(i) {
    return e[i].sort;
  }, e._grid._toggle_sort_state = function(i, t) {
    var n = this._get_sort_state(i), s = e[i];
    n && n.column == t ? n.direction = n.direction == "asc" ? "desc" : "asc" : s.sort = { column: t, direction: "desc" };
  }, e._grid._get_sort_value_for_column = function(i) {
    var t = null;
    if (i.template) {
      var n = i.template;
      t = function(r) {
        return n(r.start_date, r.end_date, r);
      };
    } else {
      var s = i.id;
      s == "date" && (s = "start_date"), t = function(r) {
        return r[s];
      };
    }
    return t;
  }, e._grid.draw_sort_marker = function(i, t) {
    if (e._grid._sort_marker && (e._grid._sort_marker.className = e._grid._sort_marker.className.replace(/( )?dhx_grid_sort_(asc|desc)/, ""), e._grid._sort_marker.removeChild(e._grid._sort_marker.lastChild)), t) {
      var n = e._grid._get_column_node(i, t.column);
      n.className += " dhx_grid_sort_" + t.direction, e._grid._sort_marker = n;
      var s = "<div class='dhx_grid_view_sort' style='left:" + (+n.style.width.replace("px", "") - 15 + n.offsetLeft) + "px'>&nbsp;</div>";
      n.innerHTML += s;
    }
  }, e._grid.sort_grid = function(i) {
    i = i || { direction: "desc", value: function(n) {
      return n.start_date;
    }, rule: e._grid.sort_rules.date };
    var t = e.get_visible_events();
    return t.sort(function(n, s) {
      return i.rule(n, s, i.value);
    }), i.direction == "asc" && (t = t.reverse()), t;
  }, e._grid.set_full_view = function(i) {
    if (i) {
      var t = e._grid._print_grid_header(i);
      e._els.dhx_cal_header[0].innerHTML = t, e._table_view = !0, e.set_sizes();
    }
  }, e._grid._calcPadding = function(i, t) {
    return (i.paddingLeft !== void 0 ? 1 * i.paddingLeft : e[t].defPadding) + (i.paddingRight !== void 0 ? 1 * i.paddingRight : e[t].defPadding);
  }, e._grid._getStyles = function(i, t) {
    for (var n = [], s = "", r = 0; t[r]; r++)
      switch (s = t[r] + ":", t[r]) {
        case "text-align":
          i.align && n.push(s + i.align);
          break;
        case "vertical-align":
          i.valign && n.push(s + i.valign);
          break;
        case "padding-left":
          i.paddingLeft !== void 0 && n.push(s + (i.paddingLeft || "0") + "px");
          break;
        case "padding-right":
          i.paddingRight !== void 0 && n.push(s + (i.paddingRight || "0") + "px");
      }
    return n;
  }, e._grid._get_column_node = function(i, t) {
    for (var n = -1, s = 0; s < i.length; s++)
      if (i[s].id == t) {
        n = s;
        break;
      }
    return n < 0 ? null : e._obj.querySelectorAll(".dhx_grid_line > div")[n];
  }, e._grid._get_sort_rule = function(i) {
    var t, n = e[i], s = this._get_sort_state(i);
    if (s) {
      for (var r, _ = 0; _ < n.columns.length; _++)
        if (n.columns[_].id == s.column) {
          r = n.columns[_];
          break;
        }
      if (r) {
        var d = e._grid._get_sort_value_for_column(r), a = r.sort;
        typeof a != "function" && (a = e._grid.sort_rules[a] || e._grid.sort_rules.str), t = { direction: s.direction, rule: a, value: d };
      }
    }
    return t;
  }, e._grid._fill_grid_tab = function(i) {
    var t = e[i], n = this._get_sort_state(i), s = this._get_sort_rule(i);
    s && e._grid.draw_sort_marker(t.columns, n);
    for (var r = e._grid.sort_grid(s), _ = e[i].columns, d = "<div>", a = -1, o = 0; o < _.length; o++)
      a += _[o].width, o < _.length - 1 && (d += "<div class='dhx_grid_v_border' style='" + (e.config.rtl ? "right" : "left") + ":" + a + "px'></div>");
    for (d += "</div>", d += "<div class='dhx_grid_area'><table " + e._waiAria.gridAttrString() + ">", o = 0; o < r.length; o++)
      d += e._grid._print_event_row(r[o], i);
    d += "</table></div>", e._els.dhx_cal_data[0].innerHTML = d, e._els.dhx_cal_data[0].lastChild.scrollTop = e._grid._gridScrollTop || 0;
    var l = e._els.dhx_cal_data[0].getElementsByTagName("tr");
    for (e._rendered = [], o = 0; o < l.length; o++)
      e._rendered[o] = l[o];
  }, e._grid._getCellContent = function(i, t) {
    var n = e.getState().mode;
    return t.template ? t.template(i.start_date, i.end_date, i) : t.id == "date" ? e.templates[n + "_full_date"](i.start_date, i.end_date, i) : t.id == "start_date" || t.id == "end_date" ? e.templates[n + "_single_date"](i[t.id]) : e.templates[n + "_field"](t.id, i);
  }, e._grid._print_event_row = function(i, t) {
    var n = [];
    i.color && n.push("--dhx-scheduler-event-background:" + i.color), i.textColor && n.push("--dhx-scheduler-event-color:" + i.textColor), i._text_style && n.push(i._text_style), e[t].rowHeight && n.push("height:" + e[t].rowHeight + "px");
    var s = "";
    n.length && (s = "style='" + n.join(";") + "'");
    var r = e[t].columns, _ = e.templates.event_class(i.start_date, i.end_date, i);
    e.getState().select_id == i.id && (_ += " dhx_grid_event_selected");
    for (var d = "<tr " + e._waiAria.gridRowAttrString(i) + " class='dhx_grid_event" + (_ ? " " + _ : "") + "' event_id='" + i.id + "' " + e.config.event_attribute + "='" + i.id + "' " + s + ">", a = ["text-align", "vertical-align", "padding-left", "padding-right"], o = 0; o < r.length; o++) {
      var l = e._grid._getCellContent(i, r[o]), h = e._waiAria.gridCellAttrString(i, r[o], l), y = e._grid._getStyles(r[o], a), m = r[o].css ? ' class="' + r[o].css + '"' : "";
      d += "<td " + h + " style='width:" + r[o].width + "px;" + y.join(";") + "' " + m + ">" + l + "</td>";
    }
    return d += "<td class='dhx_grid_dummy'></td></tr>";
  }, e._grid._print_grid_header = function(i) {
    for (var t = "<div class='dhx_grid_line'>", n = e[i].columns, s = [], r = n.length, _ = e._obj.clientWidth - 2 * n.length - 20, d = 0; d < n.length; d++) {
      var a = 1 * n[d].initialWidth;
      isNaN(a) || n[d].initialWidth === "" || n[d].initialWidth === null || typeof n[d].initialWidth == "boolean" ? s[d] = null : (r--, _ -= a, s[d] = a);
    }
    for (var o = Math.floor(_ / r), l = ["text-align", "padding-left", "padding-right"], h = 0; h < n.length; h++) {
      var y = s[h] ? s[h] : o;
      n[h].width = y;
      var m = e._grid._getStyles(n[h], l);
      t += "<div class='dhx_grid_column_label' style='line-height: " + e.xy.scale_height + "px;width:" + n[h].width + "px;" + m.join(";") + "'>" + (n[h].label === void 0 ? n[h].id : n[h].label) + "</div>";
    }
    return t += "</div>";
  };
}, html_templates: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    for (var i = document.body.getElementsByTagName("DIV"), t = 0; t < i.length; t++) {
      var n = i[t].className || "";
      if ((n = n.split(":")).length == 2 && n[0] == "template") {
        var s = 'return "' + (i[t].innerHTML || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/[\n\r]+/g, "") + '";';
        s = unescape(s).replace(/\{event\.([a-z]+)\}/g, function(r, _) {
          return '"+ev.' + _ + '+"';
        }), e.templates[n[1]] = Function("start", "end", "ev", s), i[t].style.display = "none";
      }
    }
  });
}, key_nav: function(e) {
  function i(t) {
    var n = { minicalButton: e.$keyboardNavigation.MinicalButton, minicalDate: e.$keyboardNavigation.MinicalCell, scheduler: e.$keyboardNavigation.SchedulerNode, dataArea: e.$keyboardNavigation.DataArea, timeSlot: e.$keyboardNavigation.TimeSlot, event: e.$keyboardNavigation.Event }, s = {};
    for (var r in n)
      s[r.toLowerCase()] = n[r];
    return s[t = (t + "").toLowerCase()] || n.scheduler;
  }
  e.config.key_nav = !0, e.config.key_nav_step = 30, e.addShortcut = function(t, n, s) {
    var r = i(s);
    r && r.prototype.bind(t, n);
  }, e.getShortcutHandler = function(t, n) {
    var s = i(n);
    if (s) {
      var r = e.$keyboardNavigation.shortcuts.parse(t);
      if (r.length)
        return s.prototype.findHandler(r[0]);
    }
  }, e.removeShortcut = function(t, n) {
    var s = i(n);
    s && s.prototype.unbind(t);
  }, e.focus = function() {
    if (e.config.key_nav) {
      var t = e.$keyboardNavigation.dispatcher;
      t.enable();
      var n = t.getActiveNode();
      !n || n instanceof e.$keyboardNavigation.MinicalButton || n instanceof e.$keyboardNavigation.MinicalCell ? t.setDefaultNode() : t.focusNode(t.getActiveNode());
    }
  }, e.$keyboardNavigation = {}, e._compose = function() {
    for (var t = Array.prototype.slice.call(arguments, 0), n = {}, s = 0; s < t.length; s++) {
      var r = t[s];
      for (var _ in typeof r == "function" && (r = new r()), r)
        n[_] = r[_];
    }
    return n;
  }, function(t) {
    t.$keyboardNavigation.shortcuts = { createCommand: function() {
      return { modifiers: { shift: !1, alt: !1, ctrl: !1, meta: !1 }, keyCode: null };
    }, parse: function(n) {
      for (var s = [], r = this.getExpressions(this.trim(n)), _ = 0; _ < r.length; _++) {
        for (var d = this.getWords(r[_]), a = this.createCommand(), o = 0; o < d.length; o++)
          this.commandKeys[d[o]] ? a.modifiers[d[o]] = !0 : this.specialKeys[d[o]] ? a.keyCode = this.specialKeys[d[o]] : a.keyCode = d[o].charCodeAt(0);
        s.push(a);
      }
      return s;
    }, getCommandFromEvent: function(n) {
      var s = this.createCommand();
      s.modifiers.shift = !!n.shiftKey, s.modifiers.alt = !!n.altKey, s.modifiers.ctrl = !!n.ctrlKey, s.modifiers.meta = !!n.metaKey, s.keyCode = n.which || n.keyCode, s.keyCode >= 96 && s.keyCode <= 105 && (s.keyCode -= 48);
      var r = String.fromCharCode(s.keyCode);
      return r && (s.keyCode = r.toLowerCase().charCodeAt(0)), s;
    }, getHashFromEvent: function(n) {
      return this.getHash(this.getCommandFromEvent(n));
    }, getHash: function(n) {
      var s = [];
      for (var r in n.modifiers)
        n.modifiers[r] && s.push(r);
      return s.push(n.keyCode), s.join(this.junctionChar);
    }, getExpressions: function(n) {
      return n.split(this.junctionChar);
    }, getWords: function(n) {
      return n.split(this.combinationChar);
    }, trim: function(n) {
      return n.replace(/\s/g, "");
    }, junctionChar: ",", combinationChar: "+", commandKeys: { shift: 16, alt: 18, ctrl: 17, meta: !0 }, specialKeys: { backspace: 8, tab: 9, enter: 13, esc: 27, space: 32, up: 38, down: 40, left: 37, right: 39, home: 36, end: 35, pageup: 33, pagedown: 34, delete: 46, insert: 45, plus: 107, f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123 } };
  }(e), function(t) {
    t.$keyboardNavigation.EventHandler = { _handlers: null, findHandler: function(n) {
      this._handlers || (this._handlers = {});
      var s = t.$keyboardNavigation.shortcuts.getHash(n);
      return this._handlers[s];
    }, doAction: function(n, s) {
      var r = this.findHandler(n);
      r && (r.call(this, s), s.preventDefault ? s.preventDefault() : s.returnValue = !1);
    }, bind: function(n, s) {
      this._handlers || (this._handlers = {});
      for (var r = t.$keyboardNavigation.shortcuts, _ = r.parse(n), d = 0; d < _.length; d++)
        this._handlers[r.getHash(_[d])] = s;
    }, unbind: function(n) {
      for (var s = t.$keyboardNavigation.shortcuts, r = s.parse(n), _ = 0; _ < r.length; _++)
        this._handlers[s.getHash(r[_])] && delete this._handlers[s.getHash(r[_])];
    }, bindAll: function(n) {
      for (var s in n)
        this.bind(s, n[s]);
    }, initKeys: function() {
      this._handlers || (this._handlers = {}), this.keys && this.bindAll(this.keys);
    } };
  }(e), function(t) {
    t.$keyboardNavigation.getFocusableNodes = t._getFocusableNodes, t.$keyboardNavigation.trapFocus = function(n, s) {
      if (s.keyCode != 9)
        return !1;
      for (var r, _ = t.$keyboardNavigation.getFocusableNodes(n), d = document.activeElement, a = -1, o = 0; o < _.length; o++)
        if (_[o] == d) {
          a = o;
          break;
        }
      if (s.shiftKey) {
        if (r = _[a <= 0 ? _.length - 1 : a - 1])
          return r.focus(), s.preventDefault(), !0;
      } else if (r = _[a >= _.length - 1 ? 0 : a + 1])
        return r.focus(), s.preventDefault(), !0;
      return !1;
    };
  }(e), function(t) {
    t.$keyboardNavigation.marker = { clear: function() {
      for (var n = t.$container.querySelectorAll(".dhx_focus_slot"), s = 0; s < n.length; s++)
        n[s].parentNode.removeChild(n[s]);
    }, createElement: function() {
      var n = document.createElement("div");
      return n.setAttribute("tabindex", -1), n.className = "dhx_focus_slot", n;
    }, renderMultiple: function(n, s, r) {
      for (var _ = [], d = new Date(n), a = new Date(Math.min(s.valueOf(), t.date.add(t.date.day_start(new Date(n)), 1, "day").valueOf())); d.valueOf() < s.valueOf(); )
        _ = _.concat(r.call(this, d, new Date(Math.min(a.valueOf(), s.valueOf())))), d = t.date.day_start(t.date.add(d, 1, "day")), a = t.date.day_start(t.date.add(d, 1, "day")), a = new Date(Math.min(a.valueOf(), s.valueOf()));
      return _;
    }, render: function(n, s, r) {
      this.clear();
      var _ = [], d = t.$keyboardNavigation.TimeSlot.prototype._modes;
      switch (t.$keyboardNavigation.TimeSlot.prototype._getMode()) {
        case d.units:
          _ = this.renderVerticalMarker(n, s, r);
          break;
        case d.timeline:
          _ = this.renderTimelineMarker(n, s, r);
          break;
        case d.year:
          _ = _.concat(this.renderMultiple(n, s, this.renderYearMarker));
          break;
        case d.month:
          _ = this.renderMonthMarker(n, s);
          break;
        case d.weekAgenda:
          _ = _.concat(this.renderMultiple(n, s, this.renderWeekAgendaMarker));
          break;
        case d.list:
          _ = this.renderAgendaMarker(n, s);
          break;
        case d.dayColumns:
          _ = _.concat(this.renderMultiple(n, s, this.renderVerticalMarker));
      }
      this.addWaiAriaLabel(_, n, s, r), this.addDataAttributes(_, n, s, r);
      for (var a = _.length - 1; a >= 0; a--)
        if (_[a].offsetWidth)
          return _[a];
      return null;
    }, addDataAttributes: function(n, s, r, _) {
      for (var d = t.date.date_to_str(t.config.api_date), a = d(s), o = d(r), l = 0; l < n.length; l++)
        n[l].setAttribute("data-start-date", a), n[l].setAttribute("data-end-date", o), _ && n[l].setAttribute("data-section", _);
    }, addWaiAriaLabel: function(n, s, r, _) {
      var d = "", a = t.getState().mode, o = !1;
      if (d += t.templates.day_date(s), t.date.day_start(new Date(s)).valueOf() != s.valueOf() && (d += " " + t.templates.hour_scale(s), o = !0), t.date.day_start(new Date(s)).valueOf() != t.date.day_start(new Date(r)).valueOf() && (d += " - " + t.templates.day_date(r), (o || t.date.day_start(new Date(r)).valueOf() != r.valueOf()) && (d += " " + t.templates.hour_scale(r))), _) {
        if (t.matrix && t.matrix[a]) {
          const h = t.matrix[a], y = h.y_unit[h.order[_]];
          d += ", " + t.templates[a + "_scale_label"](y.key, y.label, y);
        } else if (t._props && t._props[a]) {
          const h = t._props[a], y = h.options[h.order[_]];
          d += ", " + t.templates[a + "_scale_text"](y.key, y.label, y);
        }
      }
      for (var l = 0; l < n.length; l++)
        t._waiAria.setAttributes(n[l], { "aria-label": d, "aria-live": "polite" });
    }, renderWeekAgendaMarker: function(n, s) {
      for (var r = t.$container.querySelectorAll(".dhx_wa_day_cont .dhx_wa_scale_bar"), _ = t.date.week_start(new Date(t.getState().min_date)), d = -1, a = t.date.day_start(new Date(n)), o = 0; o < r.length && (d++, t.date.day_start(new Date(_)).valueOf() != a.valueOf()); o++)
        _ = t.date.add(_, 1, "day");
      return d != -1 ? this._wrapDiv(r[d]) : [];
    }, _wrapDiv: function(n) {
      var s = this.createElement();
      return s.style.top = n.offsetTop + "px", s.style.left = n.offsetLeft + "px", s.style.width = n.offsetWidth + "px", s.style.height = n.offsetHeight + "px", n.appendChild(s), [s];
    }, renderYearMarker: function(n, s) {
      var r = t._get_year_cell(n);
      r.style.position = "relative";
      var _ = this.createElement();
      return _.style.top = "0px", _.style.left = "0px", _.style.width = "100%", _.style.height = "100%", r.appendChild(_), [_];
    }, renderAgendaMarker: function(n, s) {
      var r = this.createElement();
      return r.style.height = "1px", r.style.width = "100%", r.style.opacity = 1, r.style.top = "0px", r.style.left = "0px", t.$container.querySelector(".dhx_cal_data").appendChild(r), [r];
    }, renderTimelineMarker: function(n, s, r) {
      var _ = t._lame_copy({}, t.matrix[t._mode]), d = _._scales;
      _.round_position = !1;
      var a = [], o = n ? new Date(n) : t._min_date, l = s ? new Date(s) : t._max_date;
      if (o.valueOf() < t._min_date.valueOf() && (o = new Date(t._min_date)), l.valueOf() > t._max_date.valueOf() && (l = new Date(t._max_date)), !_._trace_x)
        return a;
      for (var h = 0; h < _._trace_x.length && !t._is_column_visible(_._trace_x[h]); h++)
        ;
      if (h == _._trace_x.length)
        return a;
      var y = d[r];
      if (!(o < s && l > n))
        return a;
      var m = this.createElement();
      let f, u;
      function v(x, k) {
        k.setDate(1), k.setFullYear(x.getFullYear()), k.setMonth(x.getMonth()), k.setDate(x.getDate());
      }
      if (t.getView().days) {
        const x = new Date(n);
        v(t._min_date, x);
        const k = new Date(s);
        v(t._min_date, k), f = t._timeline_getX({ start_date: x }, !1, _), u = t._timeline_getX({ start_date: k }, !1, _);
      } else
        f = t._timeline_getX({ start_date: n }, !1, _), u = t._timeline_getX({ start_date: s }, !1, _);
      var c = _._section_height[r] - 1 || _.dy - 1, p = 0;
      t._isRender("cell") && (p = y.offsetTop, f += _.dx, u += _.dx, y = t.$container.querySelector(".dhx_cal_data"));
      var g = Math.max(1, u - f - 1);
      let b = "left";
      return t.config.rtl && (b = "right"), m.style.cssText = `height:${c}px; ${b}:${f}px; width:${g}px; top:${p}px;`, y && (y.appendChild(m), a.push(m)), a;
    }, renderMonthCell: function(n) {
      for (var s = t.$container.querySelectorAll(".dhx_month_head"), r = [], _ = 0; _ < s.length; _++)
        r.push(s[_].parentNode);
      var d = -1, a = 0, o = -1, l = t.date.week_start(new Date(t.getState().min_date)), h = t.date.day_start(new Date(n));
      for (_ = 0; _ < r.length && (d++, o == 6 ? (a++, o = 0) : o++, t.date.day_start(new Date(l)).valueOf() != h.valueOf()); _++)
        l = t.date.add(l, 1, "day");
      if (d == -1)
        return [];
      var y = t._colsS[o], m = t._colsS.heights[a], f = this.createElement();
      f.style.top = m + "px", f.style.left = y + "px", f.style.width = t._cols[o] + "px", f.style.height = (t._colsS.heights[a + 1] - m || t._colsS.height) + "px";
      var u = t.$container.querySelector(".dhx_cal_data"), v = u.querySelector(".dhx_cal_month_table");
      return v.nextSibling ? u.insertBefore(f, v.nextSibling) : u.appendChild(f), f;
    }, renderMonthMarker: function(n, s) {
      for (var r = [], _ = n; _.valueOf() < s.valueOf(); )
        r.push(this.renderMonthCell(_)), _ = t.date.add(_, 1, "day");
      return r;
    }, renderVerticalMarker: function(n, s, r) {
      var _ = t.locate_holder_day(n), d = [], a = null, o = t.config;
      if (t._ignores[_])
        return d;
      if (t._props && t._props[t._mode] && r) {
        var l = t._props[t._mode];
        _ = l.order[r];
        var h = l.order[r];
        l.days > 1 ? _ = t.locate_holder_day(n) + h : (_ = h, l.size && _ > l.position + l.size && (_ = 0));
      }
      if (!(a = t.locate_holder(_)) || a.querySelector(".dhx_scale_hour"))
        return document.createElement("div");
      var y = Math.max(60 * n.getHours() + n.getMinutes(), 60 * o.first_hour), m = Math.min(60 * s.getHours() + s.getMinutes(), 60 * o.last_hour);
      if (!m && t.date.day_start(new Date(s)).valueOf() > t.date.day_start(new Date(n)).valueOf() && (m = 60 * o.last_hour), m <= y)
        return [];
      var f = this.createElement(), u = t.config.hour_size_px * o.last_hour + 1, v = 36e5;
      return f.style.top = Math.round((60 * y * 1e3 - t.config.first_hour * v) * t.config.hour_size_px / v) % u + "px", f.style.lineHeight = f.style.height = Math.max(Math.round(60 * (m - y) * 1e3 * t.config.hour_size_px / v) % u, 1) + "px", f.style.width = "100%", a.appendChild(f), d.push(f), d[0];
    } };
  }(e), function(t) {
    t.$keyboardNavigation.SchedulerNode = function() {
    }, t.$keyboardNavigation.SchedulerNode.prototype = t._compose(t.$keyboardNavigation.EventHandler, { getDefaultNode: function() {
      var n = new t.$keyboardNavigation.TimeSlot();
      return n.isValid() || (n = n.fallback()), n;
    }, _modes: { month: "month", year: "year", dayColumns: "dayColumns", timeline: "timeline", units: "units", weekAgenda: "weekAgenda", list: "list" }, getMode: function() {
      var n = t.getState().mode;
      return t.matrix && t.matrix[n] ? this._modes.timeline : t._props && t._props[n] ? this._modes.units : n == "month" ? this._modes.month : n == "year" ? this._modes.year : n == "week_agenda" ? this._modes.weekAgenda : n == "map" || n == "agenda" || t._grid && t["grid_" + n] ? this._modes.list : this._modes.dayColumns;
    }, focus: function() {
      t.focus();
    }, blur: function() {
    }, disable: function() {
      t.$container.setAttribute("tabindex", "0");
    }, enable: function() {
      t.$container && t.$container.removeAttribute("tabindex");
    }, isEnabled: function() {
      return t.$container.hasAttribute("tabindex");
    }, _compareEvents: function(n, s) {
      return n.start_date.valueOf() == s.start_date.valueOf() ? n.id > s.id ? 1 : -1 : n.start_date.valueOf() > s.start_date.valueOf() ? 1 : -1;
    }, _pickEvent: function(n, s, r, _) {
      var d = t.getState();
      n = new Date(Math.max(d.min_date.valueOf(), n.valueOf())), s = new Date(Math.min(d.max_date.valueOf(), s.valueOf()));
      var a = t.getEvents(n, s);
      a.sort(this._compareEvents), _ && (a = a.reverse());
      for (var o = !!r, l = 0; l < a.length && o; l++)
        a[l].id == r && (o = !1), a.splice(l, 1), l--;
      for (l = 0; l < a.length; l++)
        if (new t.$keyboardNavigation.Event(a[l].id).getNode())
          return a[l];
      return null;
    }, nextEventHandler: function(n) {
      var s = t.$keyboardNavigation.dispatcher.activeNode, r = n || s && s.eventId, _ = null;
      if (r && t.getEvent(r)) {
        var d = t.getEvent(r);
        _ = t.$keyboardNavigation.SchedulerNode.prototype._pickEvent(d.start_date, t.date.add(d.start_date, 1, "year"), d.id, !1);
      }
      if (!_ && !n) {
        var a = t.getState();
        _ = t.$keyboardNavigation.SchedulerNode.prototype._pickEvent(a.min_date, t.date.add(a.min_date, 1, "year"), null, !1);
      }
      if (_) {
        var o = new t.$keyboardNavigation.Event(_.id);
        o.isValid() ? (s && s.blur(), t.$keyboardNavigation.dispatcher.setActiveNode(o)) : this.nextEventHandler(_.id);
      }
    }, prevEventHandler: function(n) {
      var s = t.$keyboardNavigation.dispatcher.activeNode, r = n || s && s.eventId, _ = null;
      if (r && t.getEvent(r)) {
        var d = t.getEvent(r);
        _ = t.$keyboardNavigation.SchedulerNode.prototype._pickEvent(t.date.add(d.end_date, -1, "year"), d.end_date, d.id, !0);
      }
      if (!_ && !n) {
        var a = t.getState();
        _ = t.$keyboardNavigation.SchedulerNode.prototype._pickEvent(t.date.add(a.max_date, -1, "year"), a.max_date, null, !0);
      }
      if (_) {
        var o = new t.$keyboardNavigation.Event(_.id);
        o.isValid() ? (s && s.blur(), t.$keyboardNavigation.dispatcher.setActiveNode(o)) : this.prevEventHandler(_.id);
      }
    }, keys: { "alt+1, alt+2, alt+3, alt+4, alt+5, alt+6, alt+7, alt+8, alt+9": function(n) {
      var s = t.$keyboardNavigation.HeaderCell.prototype.getNodes(".dhx_cal_navline .dhx_cal_tab"), r = n.key;
      r === void 0 && (r = n.keyCode - 48), s[1 * r - 1] && s[1 * r - 1].click();
    }, "ctrl+left,meta+left": function(n) {
      t._click.dhx_cal_prev_button();
    }, "ctrl+right,meta+right": function(n) {
      t._click.dhx_cal_next_button();
    }, "ctrl+up,meta+up": function(n) {
      t.$container.querySelector(".dhx_cal_data").scrollTop -= 20;
    }, "ctrl+down,meta+down": function(n) {
      t.$container.querySelector(".dhx_cal_data").scrollTop += 20;
    }, e: function() {
      this.nextEventHandler();
    }, home: function() {
      t.setCurrentView(/* @__PURE__ */ new Date());
    }, "shift+e": function() {
      this.prevEventHandler();
    }, "ctrl+enter,meta+enter": function() {
      t.addEventNow({ start_date: new Date(t.getState().date) });
    }, "ctrl+c,meta+c": function(n) {
      t._key_nav_copy_paste(n);
    }, "ctrl+v,meta+v": function(n) {
      t._key_nav_copy_paste(n);
    }, "ctrl+x,meta+x": function(n) {
      t._key_nav_copy_paste(n);
    } } }), t.$keyboardNavigation.SchedulerNode.prototype.bindAll(t.$keyboardNavigation.SchedulerNode.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.KeyNavNode = function() {
    }, t.$keyboardNavigation.KeyNavNode.prototype = t._compose(t.$keyboardNavigation.EventHandler, { isValid: function() {
      return !0;
    }, fallback: function() {
      return null;
    }, moveTo: function(n) {
      t.$keyboardNavigation.dispatcher.setActiveNode(n);
    }, compareTo: function(n) {
      if (!n)
        return !1;
      for (var s in this) {
        if (!!this[s] != !!n[s])
          return !1;
        var r = !(!this[s] || !this[s].toString), _ = !(!n[s] || !n[s].toString);
        if (_ != r)
          return !1;
        if (_ && r) {
          if (n[s].toString() != this[s].toString())
            return !1;
        } else if (n[s] != this[s])
          return !1;
      }
      return !0;
    }, getNode: function() {
    }, focus: function() {
      var n = this.getNode();
      n && (n.setAttribute("tabindex", "-1"), n.focus && n.focus());
    }, blur: function() {
      var n = this.getNode();
      n && n.setAttribute("tabindex", "-1");
    } });
  }(e), function(t) {
    t.$keyboardNavigation.HeaderCell = function(n) {
      this.index = n || 0;
    }, t.$keyboardNavigation.HeaderCell.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { getNode: function(n) {
      n = n || this.index || 0;
      var s = this.getNodes();
      if (s[n])
        return s[n];
    }, getNodes: function(n) {
      n = n || [".dhx_cal_navline .dhx_cal_prev_button", ".dhx_cal_navline .dhx_cal_next_button", ".dhx_cal_navline .dhx_cal_today_button", ".dhx_cal_navline .dhx_cal_tab"].join(", ");
      var s = Array.prototype.slice.call(t.$container.querySelectorAll(n));
      return s.sort(function(r, _) {
        return r.offsetLeft - _.offsetLeft;
      }), s;
    }, _handlers: null, isValid: function() {
      return !!this.getNode(this.index);
    }, fallback: function() {
      var n = this.getNode(0);
      return n || (n = new t.$keyboardNavigation.TimeSlot()), n;
    }, keys: { left: function() {
      var n = this.index - 1;
      n < 0 && (n = this.getNodes().length - 1), this.moveTo(new t.$keyboardNavigation.HeaderCell(n));
    }, right: function() {
      var n = this.index + 1;
      n >= this.getNodes().length && (n = 0), this.moveTo(new t.$keyboardNavigation.HeaderCell(n));
    }, down: function() {
      this.moveTo(new t.$keyboardNavigation.TimeSlot());
    }, enter: function() {
      var n = this.getNode();
      n && n.click();
    } } }), t.$keyboardNavigation.HeaderCell.prototype.bindAll(t.$keyboardNavigation.HeaderCell.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.Event = function(n) {
      if (this.eventId = null, t.getEvent(n)) {
        var s = t.getEvent(n);
        this.start = new Date(s.start_date), this.end = new Date(s.end_date), this.section = this._getSection(s), this.eventId = n;
      }
    }, t.$keyboardNavigation.Event.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { _getNodes: function() {
      return Array.prototype.slice.call(t.$container.querySelectorAll("[" + t.config.event_attribute + "]"));
    }, _modes: t.$keyboardNavigation.SchedulerNode.prototype._modes, getMode: t.$keyboardNavigation.SchedulerNode.prototype.getMode, _handlers: null, isValid: function() {
      return !(!t.getEvent(this.eventId) || !this.getNode());
    }, fallback: function() {
      var n = this._getNodes()[0], s = null;
      if (n && t._locate_event(n)) {
        var r = t._locate_event(n);
        s = new t.$keyboardNavigation.Event(r);
      } else
        s = new t.$keyboardNavigation.TimeSlot();
      return s;
    }, isScrolledIntoView: function(n) {
      var s = n.getBoundingClientRect(), r = t.$container.querySelector(".dhx_cal_data").getBoundingClientRect();
      return !(s.bottom < r.top || s.top > r.bottom);
    }, getNode: function() {
      var n = "[" + t.config.event_attribute + "='" + this.eventId + "']", s = t.$keyboardNavigation.dispatcher.getInlineEditor(this.eventId);
      if (s)
        return s;
      if (t.isMultisectionEvent && t.isMultisectionEvent(t.getEvent(this.eventId))) {
        for (var r = t.$container.querySelectorAll(n), _ = 0; _ < r.length; _++)
          if (this.isScrolledIntoView(r[_]))
            return r[_];
        return r[0];
      }
      return t.$container.querySelector(n);
    }, focus: function() {
      var n = t.getEvent(this.eventId), s = t.getState();
      (n.start_date.valueOf() > s.max_date.valueOf() || n.end_date.valueOf() <= s.min_date.valueOf()) && t.setCurrentView(n.start_date);
      var r = this.getNode();
      this.isScrolledIntoView(r) ? t.$keyboardNavigation.dispatcher.keepScrollPosition((function() {
        t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
      }).bind(this)) : t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
    }, blur: function() {
      t.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this);
    }, _getSection: function(n) {
      var s = null, r = t.getState().mode;
      return t.matrix && t.matrix[r] ? s = n[t.matrix[t.getState().mode].y_property] : t._props && t._props[r] && (s = n[t._props[r].map_to]), s;
    }, _moveToSlot: function(n) {
      var s = t.getEvent(this.eventId);
      if (s) {
        var r = this._getSection(s), _ = new t.$keyboardNavigation.TimeSlot(s.start_date, null, r);
        this.moveTo(_.nextSlot(_, n));
      } else
        this.moveTo(new t.$keyboardNavigation.TimeSlot());
    }, keys: { left: function() {
      this._moveToSlot("left");
    }, right: function() {
      this._moveToSlot("right");
    }, down: function() {
      this.getMode() == this._modes.list ? t.$keyboardNavigation.SchedulerNode.prototype.nextEventHandler() : this._moveToSlot("down");
    }, space: function() {
      var n = this.getNode();
      n && n.click ? n.click() : this.moveTo(new t.$keyboardNavigation.TimeSlot());
    }, up: function() {
      this.getMode() == this._modes.list ? t.$keyboardNavigation.SchedulerNode.prototype.prevEventHandler() : this._moveToSlot("up");
    }, delete: function() {
      t.getEvent(this.eventId) ? t._click.buttons.delete(this.eventId) : this.moveTo(new t.$keyboardNavigation.TimeSlot());
    }, enter: function() {
      t.getEvent(this.eventId) ? t.showLightbox(this.eventId) : this.moveTo(new t.$keyboardNavigation.TimeSlot());
    } } }), t.$keyboardNavigation.Event.prototype.bindAll(t.$keyboardNavigation.Event.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.TimeSlot = function(n, s, r, _) {
      var d = t.getState(), a = t.matrix && t.matrix[d.mode];
      n || (n = this.getDefaultDate()), s || (s = a ? t.date.add(n, a.x_step, a.x_unit) : t.date.add(n, t.config.key_nav_step, "minute")), this.section = r || this._getDefaultSection(), this.start_date = new Date(n), this.end_date = new Date(s), this.movingDate = _ || null;
    }, t.$keyboardNavigation.TimeSlot.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { _handlers: null, getDefaultDate: function() {
      var n, s = t.getState(), r = new Date(s.date);
      r.setSeconds(0), r.setMilliseconds(0);
      var _ = /* @__PURE__ */ new Date();
      _.setSeconds(0), _.setMilliseconds(0);
      var d = t.matrix && t.matrix[s.mode], a = !1;
      if (r.valueOf() === _.valueOf() && (a = !0), d)
        a ? (d.x_unit === "day" ? (_.setHours(0), _.setMinutes(0)) : d.x_unit === "hour" && _.setMinutes(0), n = _) : n = t.date[d.name + "_start"](new Date(s.date)), n = this.findVisibleColumn(n);
      else if (n = new Date(t.getState().min_date), a && (n = _), n = this.findVisibleColumn(n), a || n.setHours(t.config.first_hour), !t._table_view) {
        var o = t.$container.querySelector(".dhx_cal_data");
        o.scrollTop && n.setHours(t.config.first_hour + Math.ceil(o.scrollTop / t.config.hour_size_px));
      }
      return n;
    }, clone: function(n) {
      return new t.$keyboardNavigation.TimeSlot(n.start_date, n.end_date, n.section, n.movingDate);
    }, _getMultisectionView: function() {
      var n, s = t.getState();
      return t._props && t._props[s.mode] ? n = t._props[s.mode] : t.matrix && t.matrix[s.mode] && (n = t.matrix[s.mode]), n;
    }, _getDefaultSection: function() {
      var n = null;
      return this._getMultisectionView() && !n && (n = this._getNextSection()), n;
    }, _getNextSection: function(n, s) {
      var r = this._getMultisectionView(), _ = r.order[n], d = _;
      (d = _ !== void 0 ? _ + s : r.size && r.position ? r.position : 0) < 0 && (d = 0);
      var a = r.options || r.y_unit;
      return d >= a.length && (d = a.length - 1), a[d] ? a[d].key : null;
    }, isValid: function() {
      var n = t.getState();
      if (this.start_date.valueOf() < n.min_date.valueOf() || this.start_date.valueOf() >= n.max_date.valueOf() || !this.isVisible(this.start_date, this.end_date))
        return !1;
      var s = this._getMultisectionView();
      return !s || s.order[this.section] !== void 0;
    }, fallback: function() {
      var n = new t.$keyboardNavigation.TimeSlot();
      return n.isValid() ? n : new t.$keyboardNavigation.DataArea();
    }, getNodes: function() {
      return Array.prototype.slice.call(t.$container.querySelectorAll(".dhx_focus_slot"));
    }, getNode: function() {
      return this.getNodes()[0];
    }, focus: function() {
      this.section && t.getView() && t.getView().smart_rendering && t.getView().scrollTo && !t.$container.querySelector(`[data-section-id="${this.section}"]`) && t.getView().scrollTo({ section: this.section }), t.$keyboardNavigation.marker.render(this.start_date, this.end_date, this.section), t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this), t.$keyboardNavigation._pasteDate = this.start_date, t.$keyboardNavigation._pasteSection = this.section;
    }, blur: function() {
      t.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this), t.$keyboardNavigation.marker.clear();
    }, _modes: t.$keyboardNavigation.SchedulerNode.prototype._modes, _getMode: t.$keyboardNavigation.SchedulerNode.prototype.getMode, addMonthDate: function(n, s, r) {
      var _;
      switch (s) {
        case "up":
          _ = t.date.add(n, -1, "week");
          break;
        case "down":
          _ = t.date.add(n, 1, "week");
          break;
        case "left":
          _ = t.date.day_start(t.date.add(n, -1, "day")), _ = this.findVisibleColumn(_, -1);
          break;
        case "right":
          _ = t.date.day_start(t.date.add(n, 1, "day")), _ = this.findVisibleColumn(_, 1);
          break;
        default:
          _ = t.date.day_start(new Date(n));
      }
      var d = t.getState();
      return (n.valueOf() < d.min_date.valueOf() || !r && n.valueOf() >= d.max_date.valueOf()) && (_ = new Date(d.min_date)), _;
    }, nextMonthSlot: function(n, s, r) {
      var _, d;
      return (_ = this.addMonthDate(n.start_date, s, r)).setHours(t.config.first_hour), (d = new Date(_)).setHours(t.config.last_hour), { start_date: _, end_date: d };
    }, _alignTimeSlot: function(n, s, r, _) {
      for (var d = new Date(s); d.valueOf() < n.valueOf(); )
        d = t.date.add(d, _, r);
      return d.valueOf() > n.valueOf() && (d = t.date.add(d, -_, r)), d;
    }, nextTimelineSlot: function(n, s, r) {
      var _ = t.getState(), d = t.matrix[_.mode], a = this._alignTimeSlot(n.start_date, t.date[d.name + "_start"](new Date(n.start_date)), d.x_unit, d.x_step), o = this._alignTimeSlot(n.end_date, t.date[d.name + "_start"](new Date(n.end_date)), d.x_unit, d.x_step);
      o.valueOf() <= a.valueOf() && (o = t.date.add(a, d.x_step, d.x_unit));
      var l = this.clone(n);
      switch (l.start_date = a, l.end_date = o, l.section = n.section || this._getNextSection(), s) {
        case "up":
          l.section = this._getNextSection(n.section, -1);
          break;
        case "down":
          l.section = this._getNextSection(n.section, 1);
          break;
        case "left":
          l.start_date = this.findVisibleColumn(t.date.add(l.start_date, -d.x_step, d.x_unit), -1), l.end_date = t.date.add(l.start_date, d.x_step, d.x_unit);
          break;
        case "right":
          l.start_date = this.findVisibleColumn(t.date.add(l.start_date, d.x_step, d.x_unit), 1), l.end_date = t.date.add(l.start_date, d.x_step, d.x_unit);
      }
      return (l.start_date.valueOf() < _.min_date.valueOf() || l.start_date.valueOf() >= _.max_date.valueOf()) && (r && l.start_date.valueOf() >= _.max_date.valueOf() ? l.start_date = new Date(_.max_date) : (l.start_date = t.date[_.mode + "_start"](t.date.add(_.date, s == "left" ? -1 : 1, _.mode)), l.end_date = t.date.add(l.start_date, d.x_step, d.x_unit))), l;
    }, nextUnitsSlot: function(n, s, r) {
      var _ = this.clone(n);
      _.section = n.section || this._getNextSection();
      var d = n.section || this._getNextSection(), a = t.getState(), o = t._props[a.mode];
      switch (s) {
        case "left":
          d = this._getNextSection(n.section, -1);
          var l = o.size ? o.size - 1 : o.options.length;
          o.days > 1 && o.order[d] == l - 1 && t.date.add(n.start_date, -1, "day").valueOf() >= a.min_date.valueOf() && (_ = this.nextDaySlot(n, s, r));
          break;
        case "right":
          d = this._getNextSection(n.section, 1), o.days > 1 && !o.order[d] && t.date.add(n.start_date, 1, "day").valueOf() < a.max_date.valueOf() && (_ = this.nextDaySlot(n, s, r));
          break;
        default:
          _ = this.nextDaySlot(n, s, r), d = n.section;
      }
      return _.section = d, _;
    }, _moveDate: function(n, s) {
      var r = this.findVisibleColumn(t.date.add(n, s, "day"), s);
      return r.setHours(n.getHours()), r.setMinutes(n.getMinutes()), r;
    }, isBeforeLastHour: function(n, s) {
      var r = n.getMinutes(), _ = n.getHours(), d = t.config.last_hour;
      return _ < d || !s && (d == 24 || _ == d) && !r;
    }, isAfterFirstHour: function(n, s) {
      var r = n.getMinutes(), _ = n.getHours(), d = t.config.first_hour, a = t.config.last_hour;
      return _ >= d || !s && !r && (!_ && a == 24 || _ == a);
    }, isInVisibleDayTime: function(n, s) {
      return this.isBeforeLastHour(n, s) && this.isAfterFirstHour(n, s);
    }, nextDaySlot: function(n, s, r) {
      var _, d, a = t.config.key_nav_step, o = this._alignTimeSlot(n.start_date, t.date.day_start(new Date(n.start_date)), "minute", a), l = n.start_date;
      switch (s) {
        case "up":
          if (_ = t.date.add(o, -a, "minute"), !this.isInVisibleDayTime(_, !0) && (!r || this.isInVisibleDayTime(l, !0))) {
            var h = !0;
            r && t.date.date_part(new Date(_)).valueOf() != t.date.date_part(new Date(l)).valueOf() && (h = !1), h && (_ = this.findVisibleColumn(t.date.add(n.start_date, -1, "day"), -1)), _.setHours(t.config.last_hour), _.setMinutes(0), _ = t.date.add(_, -a, "minute");
          }
          d = t.date.add(_, a, "minute");
          break;
        case "down":
          _ = t.date.add(o, a, "minute");
          var y = r ? _ : t.date.add(_, a, "minute");
          this.isInVisibleDayTime(y, !1) || r && !this.isInVisibleDayTime(l, !1) || (r ? (h = !0, t.date.date_part(new Date(l)).valueOf() == l.valueOf() && (h = !1), h && (_ = this.findVisibleColumn(t.date.add(n.start_date, 1, "day"), 1)), _.setHours(t.config.first_hour), _.setMinutes(0), _ = t.date.add(_, a, "minute")) : ((_ = this.findVisibleColumn(t.date.add(n.start_date, 1, "day"), 1)).setHours(t.config.first_hour), _.setMinutes(0))), d = t.date.add(_, a, "minute");
          break;
        case "left":
          _ = this._moveDate(n.start_date, -1), d = this._moveDate(n.end_date, -1);
          break;
        case "right":
          _ = this._moveDate(n.start_date, 1), d = this._moveDate(n.end_date, 1);
          break;
        default:
          _ = o, d = t.date.add(_, a, "minute");
      }
      return { start_date: _, end_date: d };
    }, nextWeekAgendaSlot: function(n, s) {
      var r, _, d = t.getState();
      switch (s) {
        case "down":
        case "left":
          r = t.date.day_start(t.date.add(n.start_date, -1, "day")), r = this.findVisibleColumn(r, -1);
          break;
        case "up":
        case "right":
          r = t.date.day_start(t.date.add(n.start_date, 1, "day")), r = this.findVisibleColumn(r, 1);
          break;
        default:
          r = t.date.day_start(n.start_date);
      }
      return (n.start_date.valueOf() < d.min_date.valueOf() || n.start_date.valueOf() >= d.max_date.valueOf()) && (r = new Date(d.min_date)), (_ = new Date(r)).setHours(t.config.last_hour), { start_date: r, end_date: _ };
    }, nextAgendaSlot: function(n, s) {
      return { start_date: n.start_date, end_date: n.end_date };
    }, isDateVisible: function(n) {
      if (!t._ignores_detected)
        return !0;
      var s, r = t.matrix && t.matrix[t.getState().mode];
      return s = r ? t._get_date_index(r, n) : t.locate_holder_day(n), !t._ignores[s];
    }, findVisibleColumn: function(n, s) {
      var r = n;
      s = s || 1;
      for (var _ = t.getState(); !this.isDateVisible(r) && (s > 0 && r.valueOf() <= _.max_date.valueOf() || s < 0 && r.valueOf() >= _.min_date.valueOf()); )
        r = this.nextDateColumn(r, s);
      return r;
    }, nextDateColumn: function(n, s) {
      s = s || 1;
      var r = t.matrix && t.matrix[t.getState().mode];
      return r ? t.date.add(n, s * r.x_step, r.x_unit) : t.date.day_start(t.date.add(n, s, "day"));
    }, isVisible: function(n, s) {
      if (!t._ignores_detected)
        return !0;
      for (var r = new Date(n); r.valueOf() < s.valueOf(); ) {
        if (this.isDateVisible(r))
          return !0;
        r = this.nextDateColumn(r);
      }
      return !1;
    }, nextSlot: function(n, s, r, _) {
      var d;
      r = r || this._getMode();
      var a = t.$keyboardNavigation.TimeSlot.prototype.clone(n);
      switch (r) {
        case this._modes.units:
          d = this.nextUnitsSlot(a, s, _);
          break;
        case this._modes.timeline:
          d = this.nextTimelineSlot(a, s, _);
          break;
        case this._modes.year:
        case this._modes.month:
          d = this.nextMonthSlot(a, s, _);
          break;
        case this._modes.weekAgenda:
          d = this.nextWeekAgendaSlot(a, s, _);
          break;
        case this._modes.list:
          d = this.nextAgendaSlot(a, s, _);
          break;
        case this._modes.dayColumns:
          d = this.nextDaySlot(a, s, _);
      }
      return d.start_date.valueOf() >= d.end_date.valueOf() && (d = this.nextSlot(d, s, r)), t.$keyboardNavigation.TimeSlot.prototype.clone(d);
    }, extendSlot: function(n, s) {
      var r;
      switch (this._getMode()) {
        case this._modes.units:
          r = s == "left" || s == "right" ? this.nextUnitsSlot(n, s) : this.extendUnitsSlot(n, s);
          break;
        case this._modes.timeline:
          r = s == "down" || s == "up" ? this.nextTimelineSlot(n, s) : this.extendTimelineSlot(n, s);
          break;
        case this._modes.year:
        case this._modes.month:
          r = this.extendMonthSlot(n, s);
          break;
        case this._modes.dayColumns:
          r = this.extendDaySlot(n, s);
          break;
        case this._modes.weekAgenda:
          r = this.extendWeekAgendaSlot(n, s);
          break;
        default:
          r = n;
      }
      var _ = t.getState();
      return r.start_date.valueOf() < _.min_date.valueOf() && (r.start_date = this.findVisibleColumn(_.min_date), r.start_date.setHours(t.config.first_hour)), r.end_date.valueOf() > _.max_date.valueOf() && (r.end_date = this.findVisibleColumn(_.max_date, -1)), t.$keyboardNavigation.TimeSlot.prototype.clone(r);
    }, extendTimelineSlot: function(n, s) {
      return this.extendGenericSlot({ left: "start_date", right: "end_date" }, n, s, "timeline");
    }, extendWeekAgendaSlot: function(n, s) {
      return this.extendGenericSlot({ left: "start_date", right: "end_date" }, n, s, "weekAgenda");
    }, extendGenericSlot: function(n, s, r, _) {
      var d, a = s.movingDate;
      if (a || (a = n[r]), !a || !n[r])
        return s;
      if (!r)
        return t.$keyboardNavigation.TimeSlot.prototype.clone(s);
      (d = this.nextSlot({ start_date: s[a], section: s.section }, r, _, !0)).start_date.valueOf() == s.start_date.valueOf() && (d = this.nextSlot({ start_date: d.start_date, section: d.section }, r, _, !0)), d.movingDate = a;
      var o = this.extendSlotDates(s, d, d.movingDate);
      return o.end_date.valueOf() <= o.start_date.valueOf() && (d.movingDate = d.movingDate == "end_date" ? "start_date" : "end_date"), o = this.extendSlotDates(s, d, d.movingDate), d.start_date = o.start_date, d.end_date = o.end_date, d;
    }, extendSlotDates: function(n, s, r) {
      var _ = { start_date: null, end_date: null };
      return r == "start_date" ? (_.start_date = s.start_date, _.end_date = n.end_date) : (_.start_date = n.start_date, _.end_date = s.start_date), _;
    }, extendMonthSlot: function(n, s) {
      return (n = this.extendGenericSlot({ up: "start_date", down: "end_date", left: "start_date", right: "end_date" }, n, s, "month")).start_date.setHours(t.config.first_hour), n.end_date = t.date.add(n.end_date, -1, "day"), n.end_date.setHours(t.config.last_hour), n;
    }, extendUnitsSlot: function(n, s) {
      var r;
      switch (s) {
        case "down":
        case "up":
          r = this.extendDaySlot(n, s);
          break;
        default:
          r = n;
      }
      return r.section = n.section, r;
    }, extendDaySlot: function(n, s) {
      return this.extendGenericSlot({ up: "start_date", down: "end_date", left: "start_date", right: "end_date" }, n, s, "dayColumns");
    }, scrollSlot: function(n) {
      var s = t.getState(), r = this.nextSlot(this, n);
      (r.start_date.valueOf() < s.min_date.valueOf() || r.start_date.valueOf() >= s.max_date.valueOf()) && t.setCurrentView(new Date(r.start_date)), this.moveTo(r);
    }, keys: { left: function() {
      this.scrollSlot("left");
    }, right: function() {
      this.scrollSlot("right");
    }, down: function() {
      this._getMode() == this._modes.list ? t.$keyboardNavigation.SchedulerNode.prototype.nextEventHandler() : this.scrollSlot("down");
    }, up: function() {
      this._getMode() == this._modes.list ? t.$keyboardNavigation.SchedulerNode.prototype.prevEventHandler() : this.scrollSlot("up");
    }, "shift+down": function() {
      this.moveTo(this.extendSlot(this, "down"));
    }, "shift+up": function() {
      this.moveTo(this.extendSlot(this, "up"));
    }, "shift+right": function() {
      this.moveTo(this.extendSlot(this, "right"));
    }, "shift+left": function() {
      this.moveTo(this.extendSlot(this, "left"));
    }, enter: function() {
      var n = { start_date: new Date(this.start_date), end_date: new Date(this.end_date) }, s = t.getState().mode;
      t.matrix && t.matrix[s] ? n[t.matrix[t.getState().mode].y_property] = this.section : t._props && t._props[s] && (n[t._props[s].map_to] = this.section), t.addEventNow(n);
    } } }), t.$keyboardNavigation.TimeSlot.prototype.bindAll(t.$keyboardNavigation.TimeSlot.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.MinicalButton = function(n, s) {
      this.container = n, this.index = s || 0;
    }, t.$keyboardNavigation.MinicalButton.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { isValid: function() {
      return !!this.container.offsetWidth;
    }, fallback: function() {
      var n = new t.$keyboardNavigation.TimeSlot();
      return n.isValid() ? n : new t.$keyboardNavigation.DataArea();
    }, focus: function() {
      t.$keyboardNavigation.dispatcher.globalNode.disable(), this.container.removeAttribute("tabindex"), t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
    }, blur: function() {
      this.container.setAttribute("tabindex", "0"), t.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this);
    }, getNode: function() {
      return this.index ? this.container.querySelector(".dhx_cal_next_button") : this.container.querySelector(".dhx_cal_prev_button");
    }, keys: { right: function(n) {
      this.moveTo(new t.$keyboardNavigation.MinicalButton(this.container, this.index ? 0 : 1));
    }, left: function(n) {
      this.moveTo(new t.$keyboardNavigation.MinicalButton(this.container, this.index ? 0 : 1));
    }, down: function() {
      var n = new t.$keyboardNavigation.MinicalCell(this.container, 0, 0);
      n && !n.isValid() && (n = n.fallback()), this.moveTo(n);
    }, enter: function(n) {
      this.getNode().click();
    } } }), t.$keyboardNavigation.MinicalButton.prototype.bindAll(t.$keyboardNavigation.MinicalButton.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.MinicalCell = function(n, s, r) {
      this.container = n, this.row = s || 0, this.col = r || 0;
    }, t.$keyboardNavigation.MinicalCell.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { isValid: function() {
      var n = this._getGrid();
      return !(!n[this.row] || !n[this.row][this.col]);
    }, fallback: function() {
      var n = this.row, s = this.col, r = this._getGrid();
      r[n] || (n = 0);
      var _ = !0;
      if (n > r.length / 2 && (_ = !1), !r[n]) {
        var d = new t.$keyboardNavigation.TimeSlot();
        return d.isValid() ? d : new t.$keyboardNavigation.DataArea();
      }
      if (_) {
        for (var a = s; r[n] && a < r[n].length; a++)
          if (r[n][a] || a != r[n].length - 1 || (n++, s = 0), r[n][a])
            return new t.$keyboardNavigation.MinicalCell(this.container, n, a);
      } else
        for (a = s; r[n] && a < r[n].length; a--)
          if (r[n][a] || a || (s = r[--n].length - 1), r[n][a])
            return new t.$keyboardNavigation.MinicalCell(this.container, n, a);
      return new t.$keyboardNavigation.MinicalButton(this.container, 0);
    }, focus: function() {
      t.$keyboardNavigation.dispatcher.globalNode.disable(), this.container.removeAttribute("tabindex"), t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
    }, blur: function() {
      this.container.setAttribute("tabindex", "0"), t.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this);
    }, _getNode: function(n, s) {
      return this.container.querySelector(".dhx_year_body tr:nth-child(" + (n + 1) + ") td:nth-child(" + (s + 1) + ")");
    }, getNode: function() {
      return this._getNode(this.row, this.col);
    }, _getGrid: function() {
      for (var n = this.container.querySelectorAll(".dhx_year_body tr"), s = [], r = 0; r < n.length; r++) {
        s[r] = [];
        for (var _ = n[r].querySelectorAll("td"), d = 0; d < _.length; d++) {
          var a = _[d], o = !0, l = t._getClassName(a);
          (l.indexOf("dhx_after") > -1 || l.indexOf("dhx_before") > -1 || l.indexOf("dhx_scale_ignore") > -1) && (o = !1), s[r][d] = o;
        }
      }
      return s;
    }, keys: { right: function(n) {
      var s = this._getGrid(), r = this.row, _ = this.col + 1;
      s[r] && s[r][_] || (s[r + 1] ? (r += 1, _ = 0) : _ = this.col);
      var d = new t.$keyboardNavigation.MinicalCell(this.container, r, _);
      d.isValid() || (d = d.fallback()), this.moveTo(d);
    }, left: function(n) {
      var s = this._getGrid(), r = this.row, _ = this.col - 1;
      s[r] && s[r][_] || (_ = s[r - 1] ? s[r -= 1].length - 1 : this.col);
      var d = new t.$keyboardNavigation.MinicalCell(this.container, r, _);
      d.isValid() || (d = d.fallback()), this.moveTo(d);
    }, down: function() {
      var n = this._getGrid(), s = this.row + 1, r = this.col;
      n[s] && n[s][r] || (s = this.row);
      var _ = new t.$keyboardNavigation.MinicalCell(this.container, s, r);
      _.isValid() || (_ = _.fallback()), this.moveTo(_);
    }, up: function() {
      var n = this._getGrid(), s = this.row - 1, r = this.col;
      if (n[s] && n[s][r]) {
        var _ = new t.$keyboardNavigation.MinicalCell(this.container, s, r);
        _.isValid() || (_ = _.fallback()), this.moveTo(_);
      } else {
        var d = 0;
        this.col > n[this.row].length / 2 && (d = 1), this.moveTo(new t.$keyboardNavigation.MinicalButton(this.container, d));
      }
    }, enter: function(n) {
      this.getNode().querySelector(".dhx_month_head").click();
    } } }), t.$keyboardNavigation.MinicalCell.prototype.bindAll(t.$keyboardNavigation.MinicalCell.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.DataArea = function(n) {
      this.index = n || 0;
    }, t.$keyboardNavigation.DataArea.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { getNode: function(n) {
      return t.$container.querySelector(".dhx_cal_data");
    }, _handlers: null, isValid: function() {
      return !0;
    }, fallback: function() {
      return this;
    }, keys: { "up,down,right,left": function() {
      this.moveTo(new t.$keyboardNavigation.TimeSlot());
    } } }), t.$keyboardNavigation.DataArea.prototype.bindAll(t.$keyboardNavigation.DataArea.prototype.keys);
  }(e), pn(e), function(t) {
    t.$keyboardNavigation.dispatcher = { isActive: !1, activeNode: null, globalNode: new t.$keyboardNavigation.SchedulerNode(), keepScrollPosition: function(n) {
      var s, r, _ = t.$container.querySelector(".dhx_timeline_scrollable_data");
      _ || (_ = t.$container.querySelector(".dhx_cal_data")), _ && (s = _.scrollTop, r = _.scrollLeft), n(), _ && (_.scrollTop = s, _.scrollLeft = r);
    }, enable: function() {
      if (t.$container) {
        this.isActive = !0;
        var n = this;
        this.keepScrollPosition(function() {
          n.globalNode.enable(), n.setActiveNode(n.getActiveNode());
        });
      }
    }, disable: function() {
      this.isActive = !1, this.globalNode.disable();
    }, isEnabled: function() {
      return !!this.isActive;
    }, getDefaultNode: function() {
      return this.globalNode.getDefaultNode();
    }, setDefaultNode: function() {
      this.setActiveNode(this.getDefaultNode());
    }, getActiveNode: function() {
      var n = this.activeNode;
      return n && !n.isValid() && (n = n.fallback()), n;
    }, focusGlobalNode: function() {
      this.blurNode(this.globalNode), this.focusNode(this.globalNode);
    }, setActiveNode: function(n) {
      n && n.isValid() && (this.activeNode && this.activeNode.compareTo(n) || this.isEnabled() && (this.blurNode(this.activeNode), this.activeNode = n, this.focusNode(this.activeNode)));
    }, focusNode: function(n) {
      n && n.focus && (n.focus(), n.getNode && document.activeElement != n.getNode() && this.setActiveNode(new t.$keyboardNavigation.DataArea()));
    }, blurNode: function(n) {
      n && n.blur && n.blur();
    }, getInlineEditor: function(n) {
      var s = t.$container.querySelector(".dhx_cal_editor[" + t.config.event_attribute + "='" + n + "'] textarea");
      return s && s.offsetWidth ? s : null;
    }, keyDownHandler: function(n) {
      if (!n.defaultPrevented) {
        var s = this.getActiveNode();
        if ((!t.$keyboardNavigation.isModal() || s && s.container && t.utils.dom.locateCss({ target: s.container }, "dhx_minical_popup", !1)) && (!t.getState().editor_id || !this.getInlineEditor(t.getState().editor_id)) && this.isEnabled()) {
          n = n || window.event;
          var r = this.globalNode, _ = t.$keyboardNavigation.shortcuts.getCommandFromEvent(n);
          s ? s.findHandler(_) ? s.doAction(_, n) : r.findHandler(_) && r.doAction(_, n) : this.setDefaultNode();
        }
      }
    }, _timeout: null, delay: function(n, s) {
      clearTimeout(this._timeout), this._timeout = setTimeout(n, s || 1);
    } };
  }(e), mn(e), function() {
    vn(e), function(d) {
      d.$keyboardNavigation._minicalendars = [], d.$keyboardNavigation.isMinical = function(a) {
        for (var o = d.$keyboardNavigation._minicalendars, l = 0; l < o.length; l++)
          if (this.isChildOf(a, o[l]))
            return !0;
        return !1;
      }, d.$keyboardNavigation.isChildOf = function(a, o) {
        for (; a && a !== o; )
          a = a.parentNode;
        return a === o;
      }, d.$keyboardNavigation.patchMinicalendar = function() {
        var a = d.$keyboardNavigation.dispatcher;
        function o(m) {
          var f = m.target;
          a.enable(), a.setActiveNode(new d.$keyboardNavigation.MinicalButton(f, 0));
        }
        function l(m) {
          var f = m.target || m.srcElement, u = d.utils.dom.locateCss(m, "dhx_cal_prev_button", !1), v = d.utils.dom.locateCss(m, "dhx_cal_next_button", !1), c = d.utils.dom.locateCss(m, "dhx_year_body", !1), p = 0, g = 0;
          if (c) {
            for (var b, x, k = f; k && k.tagName.toLowerCase() != "td"; )
              k = k.parentNode;
            if (k && (b = (x = k).parentNode), b && x) {
              for (var w = b.parentNode.querySelectorAll("tr"), E = 0; E < w.length; E++)
                if (w[E] == b) {
                  p = E;
                  break;
                }
              var D = b.querySelectorAll("td");
              for (E = 0; E < D.length; E++)
                if (D[E] == x) {
                  g = E;
                  break;
                }
            }
          }
          var S = m.currentTarget;
          a.delay(function() {
            var M;
            (u || v || c) && (u ? (M = new d.$keyboardNavigation.MinicalButton(S, 0), a.setActiveNode(new d.$keyboardNavigation.MinicalButton(S, 0))) : v ? M = new d.$keyboardNavigation.MinicalButton(S, 1) : c && (M = new d.$keyboardNavigation.MinicalCell(S, p, g)), M && (a.enable(), M.isValid() && (a.activeNode = null, a.setActiveNode(M))));
          });
        }
        if (d.renderCalendar) {
          var h = d.renderCalendar;
          d.renderCalendar = function() {
            var m = h.apply(this, arguments), f = d.$keyboardNavigation._minicalendars;
            d.eventRemove(m, "click", l), d.event(m, "click", l), d.eventRemove(m, "focus", o), d.event(m, "focus", o);
            for (var u = !1, v = 0; v < f.length; v++)
              if (f[v] == m) {
                u = !0;
                break;
              }
            if (u || f.push(m), a.isEnabled()) {
              var c = a.getActiveNode();
              c && c.container == m ? a.focusNode(c) : m.setAttribute("tabindex", "0");
            } else
              m.setAttribute("tabindex", "0");
            return m;
          };
        }
        if (d.destroyCalendar) {
          var y = d.destroyCalendar;
          d.destroyCalendar = function(m, f) {
            m = m || (d._def_count ? d._def_count.firstChild : null);
            var u = y.apply(this, arguments);
            if (!m || !m.parentNode)
              for (var v = d.$keyboardNavigation._minicalendars, c = 0; c < v.length; c++)
                v[c] == m && (d.eventRemove(v[c], "focus", o), v.splice(c, 1), c--);
            return u;
          };
        }
      };
    }(e);
    var t = e.$keyboardNavigation.dispatcher;
    if (e.$keyboardNavigation.attachSchedulerHandlers(), e.renderCalendar)
      e.$keyboardNavigation.patchMinicalendar();
    else
      var n = e.attachEvent("onSchedulerReady", function() {
        e.detachEvent(n), e.$keyboardNavigation.patchMinicalendar();
      });
    function s() {
      if (e.config.key_nav) {
        var d = document.activeElement;
        return !(!d || e.utils.dom.locateCss(d, "dhx_cal_quick_info", !1)) && (e.$keyboardNavigation.isChildOf(d, e.$container) || e.$keyboardNavigation.isMinical(d));
      }
    }
    function r(d) {
      d && !t.isEnabled() ? t.enable() : !d && t.isEnabled() && t.disable();
    }
    const _ = setInterval(function() {
      if (e.$container && e.$keyboardNavigation.isChildOf(e.$container, document.body)) {
        var d = s();
        d ? r(d) : !d && t.isEnabled() && setTimeout(function() {
          e.$destroyed || (e.config.key_nav ? r(s()) : e.$container.removeAttribute("tabindex"));
        }, 100);
      }
    }, 500);
    e.attachEvent("onDestroy", function() {
      clearInterval(_);
    });
  }();
}, layer: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    this.layers.sort(function(t, n) {
      return t.zIndex - n.zIndex;
    }), e._dp_init = function(t) {
      t._methods = ["_set_event_text_style", "", "changeEventId", "deleteEvent"], this.attachEvent("onEventAdded", function(n) {
        !this._loading && this.validId(n) && this.getEvent(n) && this.getEvent(n).layer == t.layer && t.setUpdated(n, !0, "inserted");
      }), this.attachEvent("onBeforeEventDelete", function(n) {
        if (this.getEvent(n) && this.getEvent(n).layer == t.layer) {
          if (!this.validId(n))
            return;
          var s = t.getState(n);
          return s == "inserted" || this._new_event ? (t.setUpdated(n, !1), !0) : s != "deleted" && (s == "true_deleted" || (t.setUpdated(n, !0, "deleted"), !1));
        }
        return !0;
      }), this.attachEvent("onEventChanged", function(n) {
        !this._loading && this.validId(n) && this.getEvent(n) && this.getEvent(n).layer == t.layer && t.setUpdated(n, !0, "updated");
      }), t._getRowData = function(n, s) {
        var r = this.obj.getEvent(n), _ = {};
        for (var d in r)
          d.indexOf("_") !== 0 && (r[d] && r[d].getUTCFullYear ? _[d] = this.obj._helpers.formatDate(r[d]) : _[d] = r[d]);
        return _;
      }, t._clearUpdateFlag = function() {
      }, t.attachEvent("insertCallback", e._update_callback), t.attachEvent("updateCallback", e._update_callback), t.attachEvent("deleteCallback", function(n, s) {
        this.obj.setUserData(s, this.action_param, "true_deleted"), this.obj.deleteEvent(s);
      });
    }, function() {
      var t = function(r) {
        if (r === null || typeof r != "object")
          return r;
        var _ = new r.constructor();
        for (var d in r)
          _[d] = t(r[d]);
        return _;
      };
      e._dataprocessors = [], e._layers_zindex = {};
      for (var n = 0; n < e.layers.length; n++) {
        if (e.config["lightbox_" + e.layers[n].name] = {}, e.config["lightbox_" + e.layers[n].name].sections = t(e.config.lightbox.sections), e._layers_zindex[e.layers[n].name] = e.config.initial_layer_zindex || 5 + 3 * n, e.layers[n].url) {
          var s = e.createDataProcessor({ url: e.layers[n].url });
          s.layer = e.layers[n].name, e._dataprocessors.push(s), e._dataprocessors[n].init(e);
        }
        e.layers[n].isDefault && (e.defaultLayer = e.layers[n].name);
      }
    }(), e.showLayer = function(t) {
      this.toggleLayer(t, !0);
    }, e.hideLayer = function(t) {
      this.toggleLayer(t, !1);
    }, e.toggleLayer = function(t, n) {
      var s = this.getLayer(t);
      s.visible = n !== void 0 ? !!n : !s.visible, this.setCurrentView(this._date, this._mode);
    }, e.getLayer = function(t) {
      var n, s;
      typeof t == "string" && (s = t), typeof t == "object" && (s = t.layer);
      for (var r = 0; r < e.layers.length; r++)
        e.layers[r].name == s && (n = e.layers[r]);
      return n;
    }, e.attachEvent("onBeforeLightbox", function(t) {
      var n = this.getEvent(t);
      return this.config.lightbox.sections = this.config["lightbox_" + n.layer].sections, e.resetLightbox(), !0;
    }), e.attachEvent("onClick", function(t, n) {
      var s = e.getEvent(t);
      return !e.getLayer(s.layer).noMenu;
    }), e.attachEvent("onEventCollision", function(t, n) {
      var s = this.getLayer(t);
      if (!s.checkCollision)
        return !1;
      for (var r = 0, _ = 0; _ < n.length; _++)
        n[_].layer == s.name && n[_].id != t.id && r++;
      return r >= e.config.collision_limit;
    }), e.addEvent = function(t, n, s, r, _) {
      var d = t;
      arguments.length != 1 && ((d = _ || {}).start_date = t, d.end_date = n, d.text = s, d.id = r, d.layer = this.defaultLayer), d.id = d.id || e.uid(), d.text = d.text || "", typeof d.start_date == "string" && (d.start_date = this.templates.api_date(d.start_date)), typeof d.end_date == "string" && (d.end_date = this.templates.api_date(d.end_date)), d._timed = this.isOneDayEvent(d);
      var a = !this._events[d.id];
      this._events[d.id] = d, this.event_updated(d), this._loading || this.callEvent(a ? "onEventAdded" : "onEventChanged", [d.id, d]);
    }, this._evs_layer = {};
    for (var i = 0; i < this.layers.length; i++)
      this._evs_layer[this.layers[i].name] = [];
    e.addEventNow = function(t, n, s) {
      var r = {};
      typeof t == "object" && (r = t, t = null);
      var _ = 6e4 * (this.config.event_duration || this.config.time_step);
      t || (t = Math.round(e._currentDate().valueOf() / _) * _);
      var d = new Date(t);
      if (!n) {
        var a = this.config.first_hour;
        a > d.getHours() && (d.setHours(a), t = d.valueOf()), n = t + _;
      }
      r.start_date = r.start_date || d, r.end_date = r.end_date || new Date(n), r.text = r.text || this.locale.labels.new_event, r.id = this._drag_id = this.uid(), r.layer = this.defaultLayer, this._drag_mode = "new-size", this._loading = !0, this.addEvent(r), this.callEvent("onEventCreated", [this._drag_id, s]), this._loading = !1, this._drag_event = {}, this._on_mouse_up(s);
    }, e._t_render_view_data = function(t) {
      if (this.config.multi_day && !this._table_view) {
        for (var n = [], s = [], r = 0; r < t.length; r++)
          t[r]._timed ? n.push(t[r]) : s.push(t[r]);
        this._table_view = !0, this.render_data(s), this._table_view = !1, this.render_data(n);
      } else
        this.render_data(t);
    }, e.render_view_data = function() {
      if (this._not_render)
        this._render_wait = !0;
      else {
        this._render_wait = !1, this.clear_view(), this._evs_layer = {};
        for (var t = 0; t < this.layers.length; t++)
          this._evs_layer[this.layers[t].name] = [];
        var n = this.get_visible_events();
        for (t = 0; t < n.length; t++)
          this._evs_layer[n[t].layer] && this._evs_layer[n[t].layer].push(n[t]);
        if (this._mode == "month") {
          var s = [];
          for (t = 0; t < this.layers.length; t++)
            this.layers[t].visible && (s = s.concat(this._evs_layer[this.layers[t].name]));
          this._t_render_view_data(s);
        } else
          for (t = 0; t < this.layers.length; t++)
            if (this.layers[t].visible) {
              var r = this._evs_layer[this.layers[t].name];
              this._t_render_view_data(r);
            }
      }
    }, e._render_v_bar = function(t, n, s, r, _, d, a, o, l) {
      var h = t.id;
      a.indexOf("<div class=") == -1 && (a = e.templates["event_header_" + t.layer] ? e.templates["event_header_" + t.layer](t.start_date, t.end_date, t) : a), o.indexOf("<div class=") == -1 && (o = e.templates["event_text_" + t.layer] ? e.templates["event_text_" + t.layer](t.start_date, t.end_date, t) : o);
      var y = document.createElement("div"), m = "dhx_cal_event", f = e.templates["event_class_" + t.layer] ? e.templates["event_class_" + t.layer](t.start_date, t.end_date, t) : e.templates.event_class(t.start_date, t.end_date, t);
      f && (m = m + " " + f);
      var u = e._border_box_events(), v = r - 2, c = u ? v : r - 4, p = u ? v : r - 6, g = u ? v : r - 14, b = u ? v - 2 : r - 8, x = u ? _ - this.xy.event_header_height : _ - 30 + 1, k = '<div event_id="' + h + '" ' + e.config.event_attribute + '="' + h + '" class="' + m + '" style="position:absolute; top:' + s + "px; left:" + n + "px; width:" + c + "px; height:" + _ + "px;" + (d || "") + '">';
      return k += '<div class="dhx_header" style=" width:' + p + 'px;" >&nbsp;</div>', k += '<div class="dhx_title">' + a + "</div>", k += '<div class="dhx_body" style=" width:' + g + "px; height:" + x + 'px;">' + o + "</div>", k += '<div class="dhx_footer" style=" width:' + b + "px;" + (l ? " margin-top:-1px;" : "") + '" ></div></div>', y.innerHTML = k, y.style.zIndex = 100, y.firstChild;
    }, e.render_event_bar = function(t) {
      var n = this._els.dhx_cal_data[0], s = this._colsS[t._sday], r = this._colsS[t._eday];
      r == s && (r = this._colsS[t._eday + 1]);
      var _ = this.xy.bar_height, d = this._colsS.heights[t._sweek] + (this._colsS.height ? this.xy.month_scale_height + 2 : 2) + t._sorder * _, a = document.createElement("div"), o = t._timed ? "dhx_cal_event_clear" : "dhx_cal_event_line", l = e.templates["event_class_" + t.layer] ? e.templates["event_class_" + t.layer](t.start_date, t.end_date, t) : e.templates.event_class(t.start_date, t.end_date, t);
      l && (o = o + " " + l);
      var h = '<div event_id="' + t.id + '" ' + this.config.event_attribute + '="' + t.id + '" class="' + o + '" style="position:absolute; top:' + d + "px; left:" + s + "px; width:" + (r - s - 15) + "px;" + (t._text_style || "") + '">';
      t._timed && (h += e.templates["event_bar_date_" + t.layer] ? e.templates["event_bar_date_" + t.layer](t.start_date, t.end_date, t) : e.templates.event_bar_date(t.start_date, t.end_date, t)), h += e.templates["event_bar_text_" + t.layer] ? e.templates["event_bar_text_" + t.layer](t.start_date, t.end_date, t) : e.templates.event_bar_text(t.start_date, t.end_date, t) + "</div>)", h += "</div>", a.innerHTML = h, this._rendered.push(a.firstChild), n.appendChild(a.firstChild);
    }, e.render_event = function(t) {
      var n = e.xy.menu_width;
      if (e.getLayer(t.layer).noMenu && (n = 0), !(t._sday < 0)) {
        var s = e.locate_holder(t._sday);
        if (s) {
          var r = 60 * t.start_date.getHours() + t.start_date.getMinutes(), _ = 60 * t.end_date.getHours() + t.end_date.getMinutes() || 60 * e.config.last_hour, d = Math.round((60 * r * 1e3 - 60 * this.config.first_hour * 60 * 1e3) * this.config.hour_size_px / 36e5) % (24 * this.config.hour_size_px) + 1, a = Math.max(e.xy.min_event_height, (_ - r) * this.config.hour_size_px / 60) + 1, o = Math.floor((s.clientWidth - n) / t._count), l = t._sorder * o + 1;
          t._inner || (o *= t._count - t._sorder);
          var h = this._render_v_bar(t.id, n + l, d, o, a, t._text_style, e.templates.event_header(t.start_date, t.end_date, t), e.templates.event_text(t.start_date, t.end_date, t));
          if (this._rendered.push(h), s.appendChild(h), l = l + parseInt(s.style.left, 10) + n, d += this._dy_shift, h.style.zIndex = this._layers_zindex[t.layer], this._edit_id == t.id) {
            h.style.zIndex = parseInt(h.style.zIndex) + 1;
            var y = h.style.zIndex;
            o = Math.max(o - 4, e.xy.editor_width), (h = document.createElement("div")).setAttribute("event_id", t.id), h.setAttribute(this.config.event_attribute, t.id), this.set_xy(h, o, a - 20, l, d + 14), h.className = "dhx_cal_editor", h.style.zIndex = y;
            var m = document.createElement("div");
            this.set_xy(m, o - 6, a - 26), m.style.cssText += ";margin:2px 2px 2px 2px;overflow:hidden;", m.style.zIndex = y, h.appendChild(m), this._els.dhx_cal_data[0].appendChild(h), this._rendered.push(h), m.innerHTML = "<textarea class='dhx_cal_editor'>" + t.text + "</textarea>", this._editor = m.firstChild, this._editor.addEventListener("keypress", function(p) {
              if (p.shiftKey)
                return !0;
              var g = p.keyCode;
              g == e.keys.edit_save && e.editStop(!0), g == e.keys.edit_cancel && e.editStop(!1);
            }), this._editor.addEventListener("selectstart", function(p) {
              return p.cancelBubble = !0, !0;
            }), m.firstChild.focus(), this._els.dhx_cal_data[0].scrollLeft = 0, m.firstChild.select();
          }
          if (this._select_id == t.id) {
            h.style.zIndex = parseInt(h.style.zIndex) + 1;
            for (var f = this.config["icons_" + (this._edit_id == t.id ? "edit" : "select")], u = "", v = 0; v < f.length; v++)
              u += "<div class='dhx_menu_icon " + f[v] + "' title='" + this.locale.labels[f[v]] + "'></div>";
            var c = this._render_v_bar(t.id, l - n + 1, d, n, 20 * f.length + 26, "", "<div class='dhx_menu_head'></div>", u, !0);
            c.style.left = l - n + 1, c.style.zIndex = h.style.zIndex, this._els.dhx_cal_data[0].appendChild(c), this._rendered.push(c);
          }
        }
      }
    }, e.filter_agenda = function(t, n) {
      var s = e.getLayer(n.layer);
      return s && s.visible;
    };
  });
}, legacy: function(e) {
  (function() {
    P.dhtmlx || (P.dhtmlx = function(a) {
      for (var o in a)
        i[o] = a[o];
      return i;
    });
    let i = P.dhtmlx;
    function t(a, o, l, h) {
      return this.xmlDoc = "", this.async = l === void 0 || l, this.onloadAction = a || null, this.mainObject = o || null, this.waitCall = null, this.rSeed = h || !1, this;
    }
    function n() {
      return P.dhtmlDragAndDrop ? P.dhtmlDragAndDrop : (this.lastLanding = 0, this.dragNode = 0, this.dragStartNode = 0, this.dragStartObject = 0, this.tempDOMU = null, this.tempDOMM = null, this.waitDrag = 0, P.dhtmlDragAndDrop = this, this);
    }
    i.extend_api = function(a, o, l) {
      var h = P[a];
      h && (P[a] = function(y) {
        var m;
        if (y && typeof y == "object" && !y.tagName) {
          for (var f in m = h.apply(this, o._init ? o._init(y) : arguments), i)
            o[f] && this[o[f]](i[f]);
          for (var f in y)
            o[f] ? this[o[f]](y[f]) : f.indexOf("on") === 0 && this.attachEvent(f, y[f]);
        } else
          m = h.apply(this, arguments);
        return o._patch && o._patch(this), m || this;
      }, P[a].prototype = h.prototype, l && function(y, m) {
        for (var f in m)
          typeof m[f] == "function" && (y[f] = m[f]);
      }(P[a].prototype, l));
    }, P.dhtmlxAjax = { get: function(a, o) {
      var l = new t(!0);
      return l.async = arguments.length < 3, l.waitCall = o, l.loadXML(a), l;
    }, post: function(a, o, l) {
      var h = new t(!0);
      return h.async = arguments.length < 4, h.waitCall = l, h.loadXML(a, !0, o), h;
    }, getSync: function(a) {
      return this.get(a, null, !0);
    }, postSync: function(a, o) {
      return this.post(a, o, null, !0);
    } }, P.dtmlXMLLoaderObject = t, t.count = 0, t.prototype.waitLoadFunction = function(a) {
      var o = !0;
      return this.check = function() {
        if (a && a.onloadAction && (!a.xmlDoc.readyState || a.xmlDoc.readyState == 4)) {
          if (!o)
            return;
          o = !1, t.count++, typeof a.onloadAction == "function" && a.onloadAction(a.mainObject, null, null, null, a), a.waitCall && (a.waitCall.call(this, a), a.waitCall = null);
        }
      }, this.check;
    }, t.prototype.getXMLTopNode = function(a, o) {
      var l;
      if (this.xmlDoc.responseXML) {
        if ((h = this.xmlDoc.responseXML.getElementsByTagName(a)).length === 0 && a.indexOf(":") != -1)
          var h = this.xmlDoc.responseXML.getElementsByTagName(a.split(":")[1]);
        l = h[0];
      } else
        l = this.xmlDoc.documentElement;
      return l ? (this._retry = !1, l) : !this._retry && r ? (this._retry = !0, o = this.xmlDoc, this.loadXMLString(this.xmlDoc.responseText.replace(/^[\s]+/, ""), !0), this.getXMLTopNode(a, o)) : (dhtmlxError.throwError("LoadXML", "Incorrect XML", [o || this.xmlDoc, this.mainObject]), document.createElement("div"));
    }, t.prototype.loadXMLString = function(a, o) {
      if (r)
        this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM"), this.xmlDoc.async = this.async, this.xmlDoc.onreadystatechange = function() {
        }, this.xmlDoc.loadXML(a);
      else {
        var l = new DOMParser();
        this.xmlDoc = l.parseFromString(a, "text/xml");
      }
      o || (this.onloadAction && this.onloadAction(this.mainObject, null, null, null, this), this.waitCall && (this.waitCall(), this.waitCall = null));
    }, t.prototype.loadXML = function(a, o, l, h) {
      this.rSeed && (a += (a.indexOf("?") != -1 ? "&" : "?") + "a_dhx_rSeed=" + (/* @__PURE__ */ new Date()).valueOf()), this.filePath = a, !r && P.XMLHttpRequest ? this.xmlDoc = new XMLHttpRequest() : this.xmlDoc = new ActiveXObject("Microsoft.XMLHTTP"), this.async && (this.xmlDoc.onreadystatechange = new this.waitLoadFunction(this)), typeof o == "string" ? this.xmlDoc.open(o, a, this.async) : this.xmlDoc.open(o ? "POST" : "GET", a, this.async), h ? (this.xmlDoc.setRequestHeader("User-Agent", "dhtmlxRPC v0.1 (" + navigator.userAgent + ")"), this.xmlDoc.setRequestHeader("Content-type", "text/xml")) : o && this.xmlDoc.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), this.xmlDoc.setRequestHeader("X-Requested-With", "XMLHttpRequest"), this.xmlDoc.send(l), this.async || new this.waitLoadFunction(this)();
    }, t.prototype.destructor = function() {
      return this._filterXPath = null, this._getAllNamedChilds = null, this._retry = null, this.async = null, this.rSeed = null, this.filePath = null, this.onloadAction = null, this.mainObject = null, this.xmlDoc = null, this.doXPath = null, this.doXPathOpera = null, this.doXSLTransToObject = null, this.doXSLTransToString = null, this.loadXML = null, this.loadXMLString = null, this.doSerialization = null, this.xmlNodeToJSON = null, this.getXMLTopNode = null, this.setXSLParamValue = null, null;
    }, t.prototype.xmlNodeToJSON = function(a) {
      for (var o = {}, l = 0; l < a.attributes.length; l++)
        o[a.attributes[l].name] = a.attributes[l].value;
      for (o._tagvalue = a.firstChild ? a.firstChild.nodeValue : "", l = 0; l < a.childNodes.length; l++) {
        var h = a.childNodes[l].tagName;
        h && (o[h] || (o[h] = []), o[h].push(this.xmlNodeToJSON(a.childNodes[l])));
      }
      return o;
    }, P.dhtmlDragAndDropObject = n, n.prototype.removeDraggableItem = function(a) {
      a.onmousedown = null, a.dragStarter = null, a.dragLanding = null;
    }, n.prototype.addDraggableItem = function(a, o) {
      a.onmousedown = this.preCreateDragCopy, a.dragStarter = o, this.addDragLanding(a, o);
    }, n.prototype.addDragLanding = function(a, o) {
      a.dragLanding = o;
    }, n.prototype.preCreateDragCopy = function(a) {
      if (!a && !P.event || (a || event).button != 2)
        return P.dhtmlDragAndDrop.waitDrag ? (P.dhtmlDragAndDrop.waitDrag = 0, document.body.onmouseup = P.dhtmlDragAndDrop.tempDOMU, document.body.onmousemove = P.dhtmlDragAndDrop.tempDOMM, !1) : (P.dhtmlDragAndDrop.dragNode && P.dhtmlDragAndDrop.stopDrag(a), P.dhtmlDragAndDrop.waitDrag = 1, P.dhtmlDragAndDrop.tempDOMU = document.body.onmouseup, P.dhtmlDragAndDrop.tempDOMM = document.body.onmousemove, P.dhtmlDragAndDrop.dragStartNode = this, P.dhtmlDragAndDrop.dragStartObject = this.dragStarter, document.body.onmouseup = P.dhtmlDragAndDrop.preCreateDragCopy, document.body.onmousemove = P.dhtmlDragAndDrop.callDrag, P.dhtmlDragAndDrop.downtime = (/* @__PURE__ */ new Date()).valueOf(), !(!a || !a.preventDefault || (a.preventDefault(), 1)));
    }, n.prototype.callDrag = function(a) {
      a || (a = P.event);
      var o = P.dhtmlDragAndDrop;
      if (!((/* @__PURE__ */ new Date()).valueOf() - o.downtime < 100)) {
        if (!o.dragNode) {
          if (!o.waitDrag)
            return o.stopDrag(a, !0);
          if (o.dragNode = o.dragStartObject._createDragNode(o.dragStartNode, a), !o.dragNode)
            return o.stopDrag();
          o.dragNode.onselectstart = function() {
            return !1;
          }, o.gldragNode = o.dragNode, document.body.appendChild(o.dragNode), document.body.onmouseup = o.stopDrag, o.waitDrag = 0, o.dragNode.pWindow = P, o.initFrameRoute();
        }
        if (o.dragNode.parentNode != P.document.body && o.gldragNode) {
          var l = o.gldragNode;
          o.gldragNode.old && (l = o.gldragNode.old), l.parentNode.removeChild(l);
          var h = o.dragNode.pWindow;
          if (l.pWindow && l.pWindow.dhtmlDragAndDrop.lastLanding && l.pWindow.dhtmlDragAndDrop.lastLanding.dragLanding._dragOut(l.pWindow.dhtmlDragAndDrop.lastLanding), r) {
            var y = document.createElement("div");
            y.innerHTML = o.dragNode.outerHTML, o.dragNode = y.childNodes[0];
          } else
            o.dragNode = o.dragNode.cloneNode(!0);
          o.dragNode.pWindow = P, o.gldragNode.old = o.dragNode, document.body.appendChild(o.dragNode), h.dhtmlDragAndDrop.dragNode = o.dragNode;
        }
        var m;
        o.dragNode.style.left = a.clientX + 15 + (o.fx ? -1 * o.fx : 0) + (document.body.scrollLeft || document.documentElement.scrollLeft) + "px", o.dragNode.style.top = a.clientY + 3 + (o.fy ? -1 * o.fy : 0) + (document.body.scrollTop || document.documentElement.scrollTop) + "px", m = a.srcElement ? a.srcElement : a.target, o.checkLanding(m, a);
      }
    }, n.prototype.calculateFramePosition = function(a) {
      if (P.name) {
        for (var o = parent.frames[P.name].frameElement.offsetParent, l = 0, h = 0; o; )
          l += o.offsetLeft, h += o.offsetTop, o = o.offsetParent;
        if (parent.dhtmlDragAndDrop) {
          var y = parent.dhtmlDragAndDrop.calculateFramePosition(1);
          l += 1 * y.split("_")[0], h += 1 * y.split("_")[1];
        }
        if (a)
          return l + "_" + h;
        this.fx = l, this.fy = h;
      }
      return "0_0";
    }, n.prototype.checkLanding = function(a, o) {
      a && a.dragLanding ? (this.lastLanding && this.lastLanding.dragLanding._dragOut(this.lastLanding), this.lastLanding = a, this.lastLanding = this.lastLanding.dragLanding._dragIn(this.lastLanding, this.dragStartNode, o.clientX, o.clientY, o), this.lastLanding_scr = r ? o.srcElement : o.target) : a && a.tagName != "BODY" ? this.checkLanding(a.parentNode, o) : (this.lastLanding && this.lastLanding.dragLanding._dragOut(this.lastLanding, o.clientX, o.clientY, o), this.lastLanding = 0, this._onNotFound && this._onNotFound());
    }, n.prototype.stopDrag = function(a, o) {
      var l = P.dhtmlDragAndDrop;
      if (!o) {
        l.stopFrameRoute();
        var h = l.lastLanding;
        l.lastLanding = null, h && h.dragLanding._drag(l.dragStartNode, l.dragStartObject, h, r ? event.srcElement : a.target);
      }
      l.lastLanding = null, l.dragNode && l.dragNode.parentNode == document.body && l.dragNode.parentNode.removeChild(l.dragNode), l.dragNode = 0, l.gldragNode = 0, l.fx = 0, l.fy = 0, l.dragStartNode = 0, l.dragStartObject = 0, document.body.onmouseup = l.tempDOMU, document.body.onmousemove = l.tempDOMM, l.tempDOMU = null, l.tempDOMM = null, l.waitDrag = 0;
    }, n.prototype.stopFrameRoute = function(a) {
      a && P.dhtmlDragAndDrop.stopDrag(1, 1);
      for (var o = 0; o < P.frames.length; o++)
        try {
          P.frames[o] != a && P.frames[o].dhtmlDragAndDrop && P.frames[o].dhtmlDragAndDrop.stopFrameRoute(P);
        } catch {
        }
      try {
        parent.dhtmlDragAndDrop && parent != P && parent != a && parent.dhtmlDragAndDrop.stopFrameRoute(P);
      } catch {
      }
    }, n.prototype.initFrameRoute = function(a, o) {
      a && (P.dhtmlDragAndDrop.preCreateDragCopy(), P.dhtmlDragAndDrop.dragStartNode = a.dhtmlDragAndDrop.dragStartNode, P.dhtmlDragAndDrop.dragStartObject = a.dhtmlDragAndDrop.dragStartObject, P.dhtmlDragAndDrop.dragNode = a.dhtmlDragAndDrop.dragNode, P.dhtmlDragAndDrop.gldragNode = a.dhtmlDragAndDrop.dragNode, P.document.body.onmouseup = P.dhtmlDragAndDrop.stopDrag, P.waitDrag = 0, !r && o && (!s || d < 1.8) && P.dhtmlDragAndDrop.calculateFramePosition());
      try {
        parent.dhtmlDragAndDrop && parent != P && parent != a && parent.dhtmlDragAndDrop.initFrameRoute(P);
      } catch {
      }
      for (var l = 0; l < P.frames.length; l++)
        try {
          P.frames[l] != a && P.frames[l].dhtmlDragAndDrop && P.frames[l].dhtmlDragAndDrop.initFrameRoute(P, !a || o ? 1 : 0);
        } catch {
        }
    };
    var s = !1, r = !1, _ = !1, d = !1;
    navigator.userAgent.indexOf("Macintosh"), navigator.userAgent.toLowerCase().indexOf("chrome"), navigator.userAgent.indexOf("Safari") != -1 || navigator.userAgent.indexOf("Konqueror") != -1 ? parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf("Safari") + 7, 5)) > 525 ? (s = !0, d = 1.9) : _ = !0 : navigator.userAgent.indexOf("Opera") != -1 ? parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf("Opera") + 6, 3)) : navigator.appName.indexOf("Microsoft") != -1 ? (r = !0, navigator.appVersion.indexOf("MSIE 8.0") == -1 && navigator.appVersion.indexOf("MSIE 9.0") == -1 && navigator.appVersion.indexOf("MSIE 10.0") == -1 || document.compatMode == "BackCompat" || (r = 8)) : navigator.appName == "Netscape" && navigator.userAgent.indexOf("Trident") != -1 ? r = 8 : (s = !0, d = parseFloat(navigator.userAgent.split("rv:")[1])), t.prototype.doXPath = function(a, o, l, h) {
      if (_ || !r && !P.XPathResult)
        return this.doXPathOpera(a, o);
      if (r)
        return o || (o = this.xmlDoc.nodeName ? this.xmlDoc : this.xmlDoc.responseXML), o || dhtmlxError.throwError("LoadXML", "Incorrect XML", [o || this.xmlDoc, this.mainObject]), l && o.setProperty("SelectionNamespaces", "xmlns:xsl='" + l + "'"), h == "single" ? o.selectSingleNode(a) : o.selectNodes(a) || new Array(0);
      var y = o;
      o || (o = this.xmlDoc.nodeName ? this.xmlDoc : this.xmlDoc.responseXML), o || dhtmlxError.throwError("LoadXML", "Incorrect XML", [o || this.xmlDoc, this.mainObject]), o.nodeName.indexOf("document") != -1 ? y = o : (y = o, o = o.ownerDocument);
      var m = XPathResult.ANY_TYPE;
      h == "single" && (m = XPathResult.FIRST_ORDERED_NODE_TYPE);
      var f = [], u = o.evaluate(a, y, function(c) {
        return l;
      }, m, null);
      if (m == XPathResult.FIRST_ORDERED_NODE_TYPE)
        return u.singleNodeValue;
      for (var v = u.iterateNext(); v; )
        f[f.length] = v, v = u.iterateNext();
      return f;
    }, P.dhtmlxError = new ut(), t.prototype.doXPathOpera = function(a, o) {
      var l = a.replace(/[\/]+/gi, "/").split("/"), h = null, y = 1;
      if (!l.length)
        return [];
      if (l[0] == ".")
        h = [o];
      else {
        if (l[0] !== "")
          return [];
        h = (this.xmlDoc.responseXML || this.xmlDoc).getElementsByTagName(l[y].replace(/\[[^\]]*\]/g, "")), y++;
      }
      for (; y < l.length; y++)
        h = this._getAllNamedChilds(h, l[y]);
      return l[y - 1].indexOf("[") != -1 && (h = this._filterXPath(h, l[y - 1])), h;
    }, t.prototype._filterXPath = function(a, o) {
      for (var l = [], h = (o = o.replace(/[^\[]*\[\@/g, "").replace(/[\[\]\@]*/g, ""), 0); h < a.length; h++)
        a[h].getAttribute(o) && (l[l.length] = a[h]);
      return l;
    }, t.prototype._getAllNamedChilds = function(a, o) {
      var l = [];
      _ && (o = o.toUpperCase());
      for (var h = 0; h < a.length; h++)
        for (var y = 0; y < a[h].childNodes.length; y++)
          _ ? a[h].childNodes[y].tagName && a[h].childNodes[y].tagName.toUpperCase() == o && (l[l.length] = a[h].childNodes[y]) : a[h].childNodes[y].tagName == o && (l[l.length] = a[h].childNodes[y]);
      return l;
    }, P.dhtmlxEvent === void 0 && (P.dhtmlxEvent = function(a, o, l) {
      a.addEventListener ? a.addEventListener(o, l, !1) : a.attachEvent && a.attachEvent("on" + o, l);
    }), t.prototype.xslDoc = null, t.prototype.setXSLParamValue = function(a, o, l) {
      l || (l = this.xslDoc), l.responseXML && (l = l.responseXML);
      var h = this.doXPath("/xsl:stylesheet/xsl:variable[@name='" + a + "']", l, "http://www.w3.org/1999/XSL/Transform", "single");
      h && (h.firstChild.nodeValue = o);
    }, t.prototype.doXSLTransToObject = function(a, o) {
      var l;
      if (a || (a = this.xslDoc), a.responseXML && (a = a.responseXML), o || (o = this.xmlDoc), o.responseXML && (o = o.responseXML), r) {
        l = new ActiveXObject("Msxml2.DOMDocument.3.0");
        try {
          o.transformNodeToObject(a, l);
        } catch {
          l = o.transformNode(a);
        }
      } else
        this.XSLProcessor || (this.XSLProcessor = new XSLTProcessor(), this.XSLProcessor.importStylesheet(a)), l = this.XSLProcessor.transformToDocument(o);
      return l;
    }, t.prototype.doXSLTransToString = function(a, o) {
      var l = this.doXSLTransToObject(a, o);
      return typeof l == "string" ? l : this.doSerialization(l);
    }, t.prototype.doSerialization = function(a) {
      return a || (a = this.xmlDoc), a.responseXML && (a = a.responseXML), r ? a.xml : new XMLSerializer().serializeToString(a);
    }, P.dhtmlxEventable = function(a) {
      a.attachEvent = function(o, l, h) {
        return this[o = "ev_" + o.toLowerCase()] || (this[o] = new this.eventCatcher(h || this)), o + ":" + this[o].addEvent(l);
      }, a.callEvent = function(o, l) {
        return !this[o = "ev_" + o.toLowerCase()] || this[o].apply(this, l);
      }, a.checkEvent = function(o) {
        return !!this["ev_" + o.toLowerCase()];
      }, a.eventCatcher = function(o) {
        var l = [], h = function() {
          for (var y = !0, m = 0; m < l.length; m++)
            if (l[m]) {
              var f = l[m].apply(o, arguments);
              y = y && f;
            }
          return y;
        };
        return h.addEvent = function(y) {
          if (typeof y != "function")
            throw new Error(`Invalid argument addEvent(${y})`);
          return !!y && l.push(y) - 1;
        }, h.removeEvent = function(y) {
          l[y] = null;
        }, h;
      }, a.detachEvent = function(o) {
        if (o) {
          var l = o.split(":");
          this[l[0]].removeEvent(l[1]);
        }
      }, a.detachAllEvents = function() {
        for (var o in this)
          o.indexOf("ev_") === 0 && (this.detachEvent(o), this[o] = null);
      }, a = null;
    };
  })();
}, limit: function(e) {
  e.config.limit_start = null, e.config.limit_end = null, e.config.limit_view = !1, e.config.check_limits = !0, e._temp_limit_scope = function() {
    var i = null;
    e.attachEvent("onBeforeViewChange", function(t, n, s, r) {
      function _(d, a) {
        var o = e.config.limit_start, l = e.config.limit_end, h = e.date.add(d, 1, a);
        return d.valueOf() > l.valueOf() || h <= o.valueOf();
      }
      return !e.config.limit_view || !_(r = r || n, s = s || t) || n.valueOf() == r.valueOf() || (setTimeout(function() {
        if (e.$destroyed)
          return !0;
        var d = _(n, s) ? e.config.limit_start : n;
        e.setCurrentView(_(d, s) ? null : d, s);
      }, 1), !1);
    }), e.attachEvent("onMouseDown", function(t) {
      return t != "dhx_time_block";
    }), e.attachEvent("onBeforeDrag", function(t) {
      return !t || e.checkLimitViolation(e.getEvent(t));
    }), e.attachEvent("onClick", function(t, n) {
      return e.checkLimitViolation(e.getEvent(t));
    }), e.attachEvent("onBeforeLightbox", function(t) {
      var n = e.getEvent(t);
      return i = [n.start_date, n.end_date], e.checkLimitViolation(n);
    }), e.attachEvent("onEventSave", function(t, n, s) {
      if (!n.start_date || !n.end_date) {
        var r = e.getEvent(t);
        n.start_date = new Date(r.start_date), n.end_date = new Date(r.end_date);
      }
      if (n.rec_type) {
        var _ = e._lame_clone(n);
        return e._roll_back_dates(_), e.checkLimitViolation(_);
      }
      return e.checkLimitViolation(n);
    }), e.attachEvent("onEventAdded", function(t) {
      if (!t)
        return !0;
      var n = e.getEvent(t);
      return !e.checkLimitViolation(n) && e.config.limit_start && e.config.limit_end && (n.start_date < e.config.limit_start && (n.start_date = new Date(e.config.limit_start)), n.start_date.valueOf() >= e.config.limit_end.valueOf() && (n.start_date = this.date.add(e.config.limit_end, -1, "day")), n.end_date < e.config.limit_start && (n.end_date = new Date(e.config.limit_start)), n.end_date.valueOf() >= e.config.limit_end.valueOf() && (n.end_date = this.date.add(e.config.limit_end, -1, "day")), n.start_date.valueOf() >= n.end_date.valueOf() && (n.end_date = this.date.add(n.start_date, this.config.event_duration || this.config.time_step, "minute")), n._timed = this.isOneDayEvent(n)), !0;
    }), e.attachEvent("onEventChanged", function(t) {
      if (!t)
        return !0;
      var n = e.getEvent(t);
      if (!e.checkLimitViolation(n)) {
        if (!i)
          return !1;
        n.start_date = i[0], n.end_date = i[1], n._timed = this.isOneDayEvent(n);
      }
      return !0;
    }), e.attachEvent("onBeforeEventChanged", function(t, n, s) {
      return e.checkLimitViolation(t);
    }), e.attachEvent("onBeforeEventCreated", function(t) {
      var n = e.getActionData(t).date, s = { _timed: !0, start_date: n, end_date: e.date.add(n, e.config.time_step, "minute") };
      return e.checkLimitViolation(s);
    }), e.attachEvent("onViewChange", function() {
      e._mark_now();
    }), e.attachEvent("onAfterSchedulerResize", function() {
      return window.setTimeout(function() {
        if (e.$destroyed)
          return !0;
        e._mark_now();
      }, 1), !0;
    }), e.attachEvent("onTemplatesReady", function() {
      e._mark_now_timer = window.setInterval(function() {
        e._is_initialized() && e._mark_now();
      }, 6e4);
    }), e.attachEvent("onDestroy", function() {
      clearInterval(e._mark_now_timer);
    });
  }, e._temp_limit_scope();
}, map_view: function(e) {
  let i = null, t = [];
  const n = { googleMap: new gn(e), openStreetMaps: new yn(e), mapbox: new bn(e) };
  function s(_) {
    i = _.ext.mapView.createAdapter(), t.push(e.attachEvent("onEventSave", function(d, a, o) {
      let l = e.getEvent(d);
      return l && l.event_location != a.event_location && (e._eventLocationChanged = !0), !0;
    }), e.attachEvent("onEventChanged", (d, a) => {
      const { start_date: o, end_date: l } = a, { min_date: h, max_date: y } = e.getState();
      return o.valueOf() < y.valueOf() && l.valueOf() > h.valueOf() && i && (e.config.map_settings.resolve_event_location && a.event_location && !e._latLngUpdate ? r(a, i) : i.updateEventMarker(a)), e._latLngUpdate = !1, !0;
    }), e.attachEvent("onEventIdChange", function(d, a) {
      let o = e.getEvent(a);
      i == null || i.removeEventMarker(d), i == null || i.addEventMarker(o);
    }), e.attachEvent("onEventAdded", (d, a) => {
      const { start_date: o, end_date: l } = a, { min_date: h, max_date: y } = e.getState();
      o.valueOf() < y.valueOf() && l.valueOf() > h.valueOf() && i && (e.config.map_settings.resolve_event_location && a.event_location && e._eventLocationChanged ? (r(a, i), e._eventLocationChanged = !1) : (i.addEventMarker(a), i.onEventClick(a)));
    }), e.attachEvent("onClick", function(d, a) {
      const o = e.getEvent(d);
      return i && o && i.onEventClick(o), !1;
    }), e.attachEvent("onBeforeEventDelete", (d, a) => (i && i.removeEventMarker(d), !0)));
  }
  async function r(_, d) {
    let a = await d.resolveAddress(_.event_location);
    return _.lat = a.lat, _.lng = a.lng, d.removeEventMarker(String(_.id)), d.addEventMarker(_), _;
  }
  e.ext || (e.ext = {}), e.ext.mapView = { createAdapter: function() {
    return n[e.config.map_view_provider];
  }, createMarker: function(_) {
    return new google.maps.Marker(_);
  }, currentAdapter: null, adapters: n }, e._latLngUpdate = !1, e._eventLocationChanged = !1, e.config.map_view_provider = "googleMap", e.config.map_settings = { initial_position: { lat: 48.724, lng: 8.215 }, error_position: { lat: 15, lng: 15 }, initial_zoom: 1, zoom_after_resolve: 15, info_window_max_width: 300, resolve_user_location: !0, resolve_event_location: !0, view_provider: "googleMap" }, e.config.map_initial_position && (e.config.map_settings.initial_position = { lat: e.config.map_initial_position.lat(), lng: e.config.map_initial_position.lng() }), e.config.map_error_position && (e.config.map_settings.error_position = { lat: e.config.map_error_position.lat(), lng: e.config.map_error_position.lng() }), e.xy.map_date_width = 188, e.xy.map_icon_width = 25, e.xy.map_description_width = 400, e.date.add_map = function(_, d, a) {
    return new Date(_.valueOf());
  }, e.templates.map_date = function(_, d, a) {
    return "";
  }, e.templates.map_time = function(_, d, a) {
    return e.config.rtl && !a._timed ? e.templates.day_date(d) + " &ndash; " + e.templates.day_date(_) : a._timed ? this.day_date(a.start_date, a.end_date, a) + " " + this.event_date(_) : e.templates.day_date(_) + " &ndash; " + e.templates.day_date(d);
  }, e.templates.map_text = function(_, d, a) {
    return a.text;
  }, e.templates.map_info_content = function(_) {
    return `<div><b>Event's text:</b> ${_.text}
				<div><b>Location:</b> ${_.event_location}</div>
				<div><b>Starts:</b> ${e.templates.tooltip_date_format(_.start_date)}</div>
				<div><b>Ends:</b> ${e.templates.tooltip_date_format(_.end_date)}</div>
			</div>`;
  }, e.date.map_start = function(_) {
    return _;
  }, e.dblclick_dhx_map_area = function(_) {
    let d = _.target.closest(`[${e.config.event_attribute}]`);
    if (d) {
      let a = d.getAttribute(`${e.config.event_attribute}`);
      e.showLightbox(a);
    }
    this.config.readonly || !this.config.dblclick_create || d || this.addEventNow({ start_date: e.config.map_start, end_date: e.date.add(e.config.map_start, e.config.time_step, "minute") });
  }, e.attachEvent("onSchedulerReady", function() {
    e.config.map_initial_zoom !== void 0 && (e.config.map_settings.initial_zoom = e.config.map_initial_zoom), e.config.map_zoom_after_resolve !== void 0 && (e.config.map_settings.zoom_after_resolve = e.config.map_zoom_after_resolve), e.config.map_infowindow_max_width !== void 0 && (e.config.map_settings.info_window_max_width = e.config.map_infowindow_max_width), e.config.map_resolve_user_location !== void 0 && (e.config.map_settings.resolve_user_location = e.config.map_resolve_user_location), e.config.map_view_provider !== void 0 && (e.config.map_settings.view_provider = e.config.map_view_provider), e.config.map_type !== void 0 && (e.config.map_settings.type = e.config.map_type), e.config.map_resolve_event_location !== void 0 && (e.config.map_settings.resolve_event_location = e.config.map_resolve_event_location), e.ext.mapView.currentAdapter = e.config.map_view_provider;
    let _ = document.createElement("div");
    _.className = "mapContainer", _.id = "mapContainer", _.style.display = "none", _.style.zIndex = "1", e._obj.appendChild(_);
    const d = e.render_data;
    function a() {
      let l = e.get_visible_events();
      l.sort(function(f, u) {
        return f.start_date.valueOf() == u.start_date.valueOf() ? f.id > u.id ? 1 : -1 : f.start_date > u.start_date ? 1 : -1;
      });
      let h = "<div " + e._waiAria.mapAttrString() + " class='dhx_map_area'>";
      for (let f = 0; f < l.length; f++) {
        let u = l[f], v = u.id == e._selected_event_id ? "dhx_map_line highlight" : "dhx_map_line", c = u.color ? "--dhx-scheduler-event-background:" + u.color + ";" : "", p = u.textColor ? "--dhx-scheduler-event-color:" + u.textColor + ";" : "", g = e._waiAria.mapRowAttrString(u), b = e._waiAria.mapDetailsBtnString();
        h += "<div " + g + " class='" + v + "' event_id='" + u.id + "' " + e.config.event_attribute + "='" + u.id + "' style='" + c + p + (u._text_style || "") + " width: " + (e.xy.map_date_width + e.xy.map_description_width + 2) + "px;'><div class='dhx_map_event_time' style='width: " + e.xy.map_date_width + "px;' >" + e.templates.map_time(u.start_date, u.end_date, u) + "</div>", h += `<div ${b} class='dhx_event_icon icon_details'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M15.4444 16.4H4.55556V7.6H15.4444V16.4ZM13.1111 2V3.6H6.88889V2H5.33333V3.6H4.55556C3.69222 3.6 3 4.312 3 5.2V16.4C3 16.8243 3.16389 17.2313 3.45561 17.5314C3.74733 17.8314 4.143 18 4.55556 18H15.4444C15.857 18 16.2527 17.8314 16.5444 17.5314C16.8361 17.2313 17 16.8243 17 16.4V5.2C17 4.312 16.3 3.6 15.4444 3.6H14.6667V2H13.1111ZM13.8889 10.8H10V14.8H13.8889V10.8Z" fill="#A1A4A6"/>
			</svg></div>`, h += "<div class='line_description' style='width:" + (e.xy.map_description_width - e.xy.map_icon_width) + "px;'>" + e.templates.map_text(u.start_date, u.end_date, u) + "</div></div>";
      }
      h += "<div class='dhx_v_border' style=" + (e.config.rtl ? "'right: " : "'left: ") + (e.xy.map_date_width - 1) + "px;'></div><div class='dhx_v_border_description'></div></div>", e._els.dhx_cal_data[0].scrollTop = 0, e._els.dhx_cal_data[0].innerHTML = h;
      let y = e._els.dhx_cal_data[0].firstChild.childNodes, m = e._getNavDateElement();
      m && (m.innerHTML = e.templates[e._mode + "_date"](e._min_date, e._max_date, e._mode)), e._rendered = [];
      for (let f = 0; f < y.length - 2; f++)
        e._rendered[f] = y[f];
    }
    e.render_data = function(l, h) {
      if (this._mode != "map")
        return d.apply(this, arguments);
      {
        a();
        let y = e.get_visible_events();
        i && (i.clearEventMarkers(), y.forEach((m) => i == null ? void 0 : i.addEventMarker(m)));
      }
    }, e.map_view = function(l) {
      e._els.dhx_cal_data[0].style.width = e.xy.map_date_width + e.xy.map_description_width + 1 + "px", e._min_date = e.config.map_start || e._currentDate(), e._max_date = e.config.map_end || e.date.add(e._currentDate(), 1, "year"), e._table_view = !0, function(f) {
        if (f) {
          const u = e.locale.labels;
          e._els.dhx_cal_header[0].innerHTML = "<div class='dhx_map_head' style='width: " + (e.xy.map_date_width + e.xy.map_description_width + 2) + "px;' ><div class='headline_date' style='width: " + e.xy.map_date_width + "px;'>" + u.date + "</div><div class='headline_description' style='width: " + e.xy.map_description_width + "px;'>" + u.description + "</div></div>", e._table_view = !0, e.set_sizes();
        }
      }(l);
      let h = document.getElementById("mapContainer");
      var y, m;
      (function(f) {
        let u = document.getElementById(f);
        if (u) {
          const v = e.$container.querySelector(".dhx_cal_navline").offsetHeight;
          let c = e.$container.querySelector(".dhx_cal_data").offsetHeight + e.$container.querySelector(".dhx_cal_header").offsetHeight;
          c < 0 && (c = 0);
          let p = e._x - e.xy.map_date_width - e.xy.map_description_width - 1;
          p < 0 && (p = 0), u.style.height = c + "px", u.style.width = p + "px", u.style.position = "absolute", u.style.top = v + "px", e.config.rtl ? u.style.marginRight = e.xy.map_date_width + e.xy.map_description_width + 1 + "px" : u.style.marginLeft = e.xy.map_date_width + e.xy.map_description_width + 1 + "px", u.style.marginTop = e.xy.nav_height + 2 + "px";
        }
      })("mapContainer"), l && h ? (_.style.display = "block", a(), e.config.map_view_provider == e.ext.mapView.currentAdapter ? (i == null || i.destroy(h), s(e), i == null || i.initialize(h, e.config.map_settings)) : (i == null || i.destroy(h), s(e), i == null || i.initialize(h, e.config.map_settings), e.ext.mapView.currentAdapter = e.config.map_view_provider), i && (y = e.config.map_settings, m = i, y.resolve_user_location ? navigator.geolocation && navigator.geolocation.getCurrentPosition(function(f) {
        m.setView(f.coords.latitude, f.coords.longitude, y.zoom_after_resolve || y.initial_zoom);
      }) : m.setView(y.initial_position.lat, y.initial_position.lng, y.initial_zoom))) : (_.style.display = "none", e._els.dhx_cal_data[0].style.width = "100%", i && h && (i.destroy(h), i = null, e.ext.mapView.currentAdapter = e.config.map_view_provider), t.forEach((f) => e.detachEvent(f)), t = []);
    }, e.attachEvent("onLocationError", function(l) {
      return alert("Location can't be found"), google.maps.LatLng(51.47784, -1492e-6);
    });
    let o = async function(l) {
      if (i) {
        const h = await i.resolveAddress(l.event_location);
        h.lat && h.lng ? (l.lat = +h.lat, l.lng = +h.lng) : (e.callEvent("onLocationError", [l.id]), l.lng = e.config.map_settings.error_position.lng, l.lat = e.config.map_settings.error_position.lat), e._latLngUpdate = !0, e.callEvent("onEventChanged", [l.id, l]);
      }
    };
    e._event_resolve_delay = 1500, e.attachEvent("onEventLoading", function(l) {
      return l.lat && l.lng && (l.lat = +l.lat, l.lng = +l.lng), e.config.map_settings.resolve_event_location && l.event_location && !l.lat && !l.lng && (e._event_resolve_delay += 1500, function(h, y, m, f) {
        setTimeout(function() {
          if (e.$destroyed)
            return !0;
          let u = h.apply(y, m);
          return h = y = m = null, u;
        }, f || 1);
      }(o, this, [l], e._event_resolve_delay)), !0;
    });
  });
}, minical: function(e) {
  const i = e._createDomEventScope();
  e.config.minicalendar = { mark_events: !0 }, e._synced_minicalendars = [], e.renderCalendar = function(t, n, s) {
    var r = null, _ = t.date || e._currentDate();
    if (typeof _ == "string" && (_ = this.templates.api_date(_)), n)
      r = this._render_calendar(n.parentNode, _, t, n), e.unmarkCalendar(r);
    else {
      var d = t.container, a = t.position;
      if (typeof d == "string" && (d = document.getElementById(d)), typeof a == "string" && (a = document.getElementById(a)), a && a.left === void 0 && a.right === void 0) {
        var o = e.$domHelpers.getOffset(a);
        a = { top: o.top + a.offsetHeight, left: o.left };
      }
      d || (d = e._get_def_cont(a)), (r = this._render_calendar(d, _, t)).$_eventAttached || (r.$_eventAttached = !0, i.attach(r, "click", (function(p) {
        var g = p.target || p.srcElement, b = e.$domHelpers;
        if (b.closest(g, ".dhx_month_head") && !b.closest(g, ".dhx_after") && !b.closest(g, ".dhx_before")) {
          var x = b.closest(g, "[data-cell-date]").getAttribute("data-cell-date"), k = e.templates.parse_date(x);
          e.unmarkCalendar(this), e.markCalendar(this, k, "dhx_calendar_click"), this._last_date = k, this.conf.handler && this.conf.handler.call(e, k, this);
        }
      }).bind(r)));
    }
    if (e.config.minicalendar.mark_events)
      for (var l = e.date.month_start(_), h = e.date.add(l, 1, "month"), y = this.getEvents(l, h), m = this["filter_" + this._mode], f = {}, u = 0; u < y.length; u++) {
        var v = y[u];
        if (!m || m(v.id, v)) {
          var c = v.start_date;
          for (c.valueOf() < l.valueOf() && (c = l), c = e.date.date_part(new Date(c.valueOf())); c < v.end_date && (f[+c] || (f[+c] = !0, this.markCalendar(r, c, "dhx_year_event")), !((c = this.date.add(c, 1, "day")).valueOf() >= h.valueOf())); )
            ;
        }
      }
    return this._markCalendarCurrentDate(r), r.conf = t, t.sync && !s && this._synced_minicalendars.push(r), r.conf._on_xle_handler || (r.conf._on_xle_handler = e.attachEvent("onXLE", function() {
      e.updateCalendar(r, r.conf.date);
    })), this.config.wai_aria_attributes && this.config.wai_aria_application_role && r.setAttribute("role", "application"), r;
  }, e._get_def_cont = function(t) {
    return this._def_count || (this._def_count = document.createElement("div"), this._def_count.className = "dhx_minical_popup", e.event(this._def_count, "click", function(n) {
      n.cancelBubble = !0;
    }), document.body.appendChild(this._def_count)), t.left && (this._def_count.style.left = t.left + "px"), t.right && (this._def_count.style.right = t.right + "px"), t.top && (this._def_count.style.top = t.top + "px"), t.bottom && (this._def_count.style.bottom = t.bottom + "px"), this._def_count._created = /* @__PURE__ */ new Date(), this._def_count;
  }, e._locateCalendar = function(t, n) {
    if (typeof n == "string" && (n = e.templates.api_date(n)), +n > +t._max_date || +n < +t._min_date)
      return null;
    for (var s = t.querySelector(".dhx_year_body").childNodes[0], r = 0, _ = new Date(t._min_date); +this.date.add(_, 1, "week") <= +n; )
      _ = this.date.add(_, 1, "week"), r++;
    var d = e.config.start_on_monday, a = (n.getDay() || (d ? 7 : 0)) - (d ? 1 : 0);
    const o = s.querySelector(`.dhx_cal_month_row:nth-child(${r + 1}) .dhx_cal_month_cell:nth-child(${a + 1})`);
    return o ? o.firstChild : null;
  }, e.markCalendar = function(t, n, s) {
    var r = this._locateCalendar(t, n);
    r && (r.className += " " + s);
  }, e.unmarkCalendar = function(t, n, s) {
    if (s = s || "dhx_calendar_click", n = n || t._last_date) {
      var r = this._locateCalendar(t, n);
      r && (r.className = (r.className || "").replace(RegExp(s, "g")));
    }
  }, e._week_template = function(t) {
    for (var n = t || 250, s = 0, r = document.createElement("div"), _ = this.date.week_start(e._currentDate()), d = 0; d < 7; d++)
      this._cols[d] = Math.floor(n / (7 - d)), this._render_x_header(d, s, _, r), _ = this.date.add(_, 1, "day"), n -= this._cols[d], s += this._cols[d];
    return r.lastChild.className += " dhx_scale_bar_last", r;
  }, e.updateCalendar = function(t, n) {
    t.conf.date = n, this.renderCalendar(t.conf, t, !0);
  }, e._mini_cal_arrows = ["&nbsp;", "&nbsp;"], e._render_calendar = function(t, n, s, r) {
    var _ = e.templates, d = this._cols;
    this._cols = [];
    var a = this._mode;
    this._mode = "calendar";
    var o = this._colsS;
    this._colsS = { height: 0 };
    var l = new Date(this._min_date), h = new Date(this._max_date), y = new Date(e._date), m = _.month_day, f = this._ignores_detected;
    this._ignores_detected = 0, _.month_day = _.calendar_date, n = this.date.month_start(n);
    var u, v = this._week_template(t.offsetWidth - 1 - this.config.minicalendar.padding);
    r ? u = r : (u = document.createElement("div")).className = "dhx_cal_container dhx_mini_calendar", u.setAttribute("date", this._helpers.formatDate(n)), u.innerHTML = "<div class='dhx_year_month'></div><div class='dhx_year_grid" + (e.config.rtl ? " dhx_grid_rtl'>" : "'>") + "<div class='dhx_year_week'>" + (v ? v.innerHTML : "") + "</div><div class='dhx_year_body'></div></div>";
    var c = u.querySelector(".dhx_year_month"), p = u.querySelector(".dhx_year_week"), g = u.querySelector(".dhx_year_body");
    if (c.innerHTML = this.templates.calendar_month(n), s.navigation)
      for (var b = function($, R) {
        var j = e.date.add($._date, R, "month");
        e.updateCalendar($, j), e._date.getMonth() == $._date.getMonth() && e._date.getFullYear() == $._date.getFullYear() && e._markCalendarCurrentDate($);
      }, x = ["dhx_cal_prev_button", "dhx_cal_next_button"], k = ["left:1px;top:4px;position:absolute;", "left:auto; right:1px;top:4px;position:absolute;"], w = [-1, 1], E = function($) {
        return function() {
          if (s.sync)
            for (var R = e._synced_minicalendars, j = 0; j < R.length; j++)
              b(R[j], $);
          else
            e.config.rtl && ($ = -$), b(u, $);
        };
      }, D = [e.locale.labels.prev, e.locale.labels.next], S = 0; S < 2; S++) {
        var M = document.createElement("div");
        M.className = x[S], e._waiAria.headerButtonsAttributes(M, D[S]), M.style.cssText = k[S], M.innerHTML = this._mini_cal_arrows[S], c.appendChild(M), i.attach(M, "click", E(w[S]));
      }
    u._date = new Date(n), u.week_start = (n.getDay() - (this.config.start_on_monday ? 1 : 0) + 7) % 7;
    var N = u._min_date = this.date.week_start(n);
    u._max_date = this.date.add(u._min_date, 6, "week"), this._reset_month_scale(g, n, N, 6), r || t.appendChild(u), p.style.height = p.childNodes[0].offsetHeight - 1 + "px";
    var T = e.uid();
    e._waiAria.minicalHeader(c, T), e._waiAria.minicalGrid(u.querySelector(".dhx_year_grid"), T), e._waiAria.minicalRow(p);
    for (var A = p.querySelectorAll(".dhx_scale_bar"), C = 0; C < A.length; C++)
      e._waiAria.minicalHeadCell(A[C]);
    var H = g.querySelectorAll(".dhx_cal_month_cell"), O = new Date(N);
    for (C = 0; C < H.length; C++)
      e._waiAria.minicalDayCell(H[C], new Date(O)), O = e.date.add(O, 1, "day");
    return e._waiAria.minicalHeader(c, T), this._cols = d, this._mode = a, this._colsS = o, this._min_date = l, this._max_date = h, e._date = y, _.month_day = m, this._ignores_detected = f, u;
  }, e.destroyCalendar = function(t, n) {
    !t && this._def_count && this._def_count.firstChild && (n || (/* @__PURE__ */ new Date()).valueOf() - this._def_count._created.valueOf() > 500) && (t = this._def_count.firstChild), t && (i.detachAll(), t.innerHTML = "", t.parentNode && t.parentNode.removeChild(t), this._def_count && (this._def_count.style.top = "-1000px"), t.conf && t.conf._on_xle_handler && e.detachEvent(t.conf._on_xle_handler));
  }, e.isCalendarVisible = function() {
    return !!(this._def_count && parseInt(this._def_count.style.top, 10) > 0) && this._def_count;
  }, e.attachEvent("onTemplatesReady", function() {
    e.event(document.body, "click", function() {
      e.destroyCalendar();
    });
  }, { once: !0 }), e.form_blocks.calendar_time = { render: function(t) {
    var n = "<span class='dhx_minical_input_wrapper'><input class='dhx_readonly dhx_minical_input' type='text' readonly='true'></span>", s = e.config, r = this.date.date_part(e._currentDate()), _ = 1440, d = 0;
    s.limit_time_select && (d = 60 * s.first_hour, _ = 60 * s.last_hour + 1), r.setHours(d / 60), t._time_values = [], n += " <select class='dhx_lightbox_time_select'>";
    for (var a = d; a < _; a += 1 * this.config.time_step)
      n += "<option value='" + a + "'>" + this.templates.time_picker(r) + "</option>", t._time_values.push(a), r = this.date.add(r, this.config.time_step, "minute");
    return "<div class='dhx_section_time dhx_lightbox_minical'>" + (n += "</select>") + "<span class='dhx_lightbox_minical_spacer'> &nbsp;&ndash;&nbsp; </span>" + n + "</div>";
  }, set_value: function(t, n, s, r) {
    var _, d, a = t.getElementsByTagName("input"), o = t.getElementsByTagName("select"), l = function(c, p, g) {
      e.event(c, "click", function() {
        e.destroyCalendar(null, !0), e.renderCalendar({ position: c, date: new Date(this._date), navigation: !0, handler: function(b) {
          c.value = e.templates.calendar_time(b), c._date = new Date(b), e.destroyCalendar(), e.config.event_duration && e.config.auto_end_date && g === 0 && f();
        } });
      });
    };
    if (e.config.full_day) {
      if (!t._full_day) {
        var h = "<label class='dhx_fullday'><input type='checkbox' name='full_day' value='true'> " + e.locale.labels.full_day + "&nbsp;</label></input>";
        e.config.wide_form || (h = t.previousSibling.innerHTML + h), t.previousSibling.innerHTML = h, t._full_day = !0;
      }
      var y = t.previousSibling.getElementsByTagName("input")[0], m = e.date.time_part(s.start_date) === 0 && e.date.time_part(s.end_date) === 0;
      y.checked = m, o[0].disabled = y.checked, o[1].disabled = y.checked, y.$_eventAttached || (y.$_eventAttached = !0, e.event(y, "click", function() {
        if (y.checked === !0) {
          var c = {};
          e.form_blocks.calendar_time.get_value(t, c), _ = e.date.date_part(c.start_date), (+(d = e.date.date_part(c.end_date)) == +_ || +d >= +_ && (s.end_date.getHours() !== 0 || s.end_date.getMinutes() !== 0)) && (d = e.date.add(d, 1, "day"));
        }
        var p = _ || s.start_date, g = d || s.end_date;
        u(a[0], p), u(a[1], g), o[0].value = 60 * p.getHours() + p.getMinutes(), o[1].value = 60 * g.getHours() + g.getMinutes(), o[0].disabled = y.checked, o[1].disabled = y.checked;
      }));
    }
    if (e.config.event_duration && e.config.auto_end_date) {
      var f = function() {
        e.config.auto_end_date && e.config.event_duration && (_ = e.date.add(a[0]._date, o[0].value, "minute"), d = new Date(_.getTime() + 60 * e.config.event_duration * 1e3), a[1].value = e.templates.calendar_time(d), a[1]._date = e.date.date_part(new Date(d)), o[1].value = 60 * d.getHours() + d.getMinutes());
      };
      o[0].$_eventAttached || o[0].addEventListener("change", f);
    }
    function u(c, p, g) {
      l(c, p, g), c.value = e.templates.calendar_time(p), c._date = e.date.date_part(new Date(p));
    }
    function v(c) {
      for (var p = r._time_values, g = 60 * c.getHours() + c.getMinutes(), b = g, x = !1, k = 0; k < p.length; k++) {
        var w = p[k];
        if (w === g) {
          x = !0;
          break;
        }
        w < g && (b = w);
      }
      return x || b ? x ? g : b : -1;
    }
    u(a[0], s.start_date, 0), u(a[1], s.end_date, 1), l = function() {
    }, o[0].value = v(s.start_date), o[1].value = v(s.end_date);
  }, get_value: function(t, n) {
    var s = t.getElementsByTagName("input"), r = t.getElementsByTagName("select");
    return n.start_date = e.date.add(s[0]._date, r[0].value, "minute"), n.end_date = e.date.add(s[1]._date, r[1].value, "minute"), n.end_date <= n.start_date && (n.end_date = e.date.add(n.start_date, e.config.time_step, "minute")), { start_date: new Date(n.start_date), end_date: new Date(n.end_date) };
  }, focus: function(t) {
  } }, e.linkCalendar = function(t, n) {
    var s = function() {
      var r = e._date, _ = new Date(r.valueOf());
      return n && (_ = n(_)), _.setDate(1), e.updateCalendar(t, _), !0;
    };
    e.attachEvent("onViewChange", s), e.attachEvent("onXLE", s), e.attachEvent("onEventAdded", s), e.attachEvent("onEventChanged", s), e.attachEvent("onEventDeleted", s), s();
  }, e._markCalendarCurrentDate = function(t) {
    var n = e.getState(), s = n.min_date, r = n.max_date, _ = n.mode, d = e.date.month_start(new Date(t._date)), a = e.date.add(d, 1, "month");
    if (!({ month: !0, year: !0, agenda: !0, grid: !0 }[_] || s.valueOf() <= d.valueOf() && r.valueOf() >= a.valueOf()))
      for (var o = s; o.valueOf() < r.valueOf(); )
        d.valueOf() <= o.valueOf() && a > o && e.markCalendar(t, o, "dhx_calendar_click"), o = e.date.add(o, 1, "day");
  }, e.attachEvent("onEventCancel", function() {
    e.destroyCalendar(null, !0);
  }), e.attachEvent("onDestroy", function() {
    e.destroyCalendar();
  });
}, monthheight: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    e.xy.scroll_width = 0;
    var i = e.render_view_data;
    e.render_view_data = function() {
      var n = this._els.dhx_cal_data[0];
      n.firstChild._h_fix = !0, i.apply(e, arguments);
      var s = parseInt(n.style.height);
      n.style.height = "1px", n.style.height = n.scrollHeight + "px", this._obj.style.height = this._obj.clientHeight + n.scrollHeight - s + "px";
    };
    var t = e._reset_month_scale;
    e._reset_month_scale = function(n, s, r, _) {
      var d = { clientHeight: 100 };
      t.apply(e, [d, s, r, _]), n.innerHTML = d.innerHTML;
    };
  });
}, multisection: function(e) {
  e.config.multisection = !0, e.config.multisection_shift_all = !0, e.config.section_delimiter = ",", e.attachEvent("onSchedulerReady", function() {
    At(e);
    var i = e._update_unit_section;
    e._update_unit_section = function(d) {
      return e._update_sections(d, i);
    };
    var t = e._update_timeline_section;
    e._update_timeline_section = function(d) {
      return e._update_sections(d, t);
    }, e.isMultisectionEvent = function(d) {
      return !(!d || !this._get_multisection_view()) && this._get_event_sections(d).length > 1;
    }, e._get_event_sections = function(d) {
      var a = d[this._get_section_property()] || "";
      return this._parse_event_sections(a);
    }, e._parse_event_sections = function(d) {
      return d instanceof Array ? d : d.toString().split(e.config.section_delimiter);
    }, e._clear_copied_events(), e._split_events = function(d) {
      var a = [], o = this._get_multisection_view(), l = this._get_section_property();
      if (o)
        for (var h = 0; h < d.length; h++) {
          var y = this._get_event_sections(d[h]);
          if (y.length > 1) {
            for (var m = 0; m < y.length; m++)
              if (o.order[y[m]] !== void 0) {
                var f = e._copy_event(d[h]);
                f[l] = y[m], a.push(f);
              }
          } else
            a.push(d[h]);
        }
      else
        a = d;
      return a;
    }, e._get_multisection_view = function() {
      return !!this.config.multisection && e._get_section_view();
    };
    var n = e.get_visible_events;
    e.get_visible_events = function(d) {
      this._clear_copied_events();
      var a = n.apply(this, arguments);
      if (this._get_multisection_view()) {
        a = this._split_events(a);
        for (var o = 0; o < a.length; o++)
          this.is_visible_events(a[o]) || (a.splice(o, 1), o--);
        this._register_copies_array(a);
      }
      return a;
    }, e._rendered_events = {};
    var s = e.render_view_data;
    e.render_view_data = function(d, a) {
      return this._get_multisection_view() && d && (d = this._split_events(d), this._restore_render_flags(d)), s.apply(this, [d, a]);
    }, e._update_sections = function(d, a) {
      var o = d.view, l = d.event, h = d.pos;
      if (e.isMultisectionEvent(l)) {
        if (e._drag_event._orig_section || (e._drag_event._orig_section = h.section), e._drag_event._orig_section != h.section) {
          var y = o.order[h.section] - o.order[e._drag_event._orig_section];
          if (y) {
            var m = this._get_event_sections(l), f = [], u = !0;
            if (e.config.multisection_shift_all)
              for (var v = 0; v < m.length; v++) {
                if ((c = e._shift_sections(o, m[v], y)) === null) {
                  f = m, u = !1;
                  break;
                }
                f[v] = c;
              }
            else
              for (v = 0; v < m.length; v++) {
                if (m[v] == h.section) {
                  f = m, u = !1;
                  break;
                }
                if (m[v] == e._drag_event._orig_section) {
                  var c;
                  if ((c = e._shift_sections(o, m[v], y)) === null) {
                    f = m, u = !1;
                    break;
                  }
                  f[v] = c;
                } else
                  f[v] = m[v];
              }
            u && (e._drag_event._orig_section = h.section), l[e._get_section_property()] = f.join(e.config.section_delimiter);
          }
        }
      } else
        a.apply(e, [d]);
    }, e._shift_sections = function(d, a, o) {
      for (var l = null, h = d.y_unit || d.options, y = 0; y < h.length; y++)
        if (h[y].key == a) {
          l = y;
          break;
        }
      var m = h[l + o];
      return m ? m.key : null;
    };
    var r = e._get_blocked_zones;
    e._get_blocked_zones = function(d, a, o, l, h) {
      if (a && this.config.multisection) {
        a = this._parse_event_sections(a);
        for (var y = [], m = 0; m < a.length; m++)
          y = y.concat(r.apply(this, [d, a[m], o, l, h]));
        return y;
      }
      return r.apply(this, arguments);
    };
    var _ = e._check_sections_collision;
    e._check_sections_collision = function(d, a) {
      if (this.config.multisection && this._get_section_view()) {
        d = this._split_events([d]), a = this._split_events([a]);
        for (var o = !1, l = 0, h = d.length; l < h && !o; l++)
          for (var y = 0, m = a.length; y < m; y++)
            if (_.apply(this, [d[l], a[y]])) {
              o = !0;
              break;
            }
        return o;
      }
      return _.apply(this, arguments);
    };
  });
}, multiselect: function(e) {
  e.form_blocks.multiselect = { render: function(i) {
    var t = "dhx_multi_select_control dhx_multi_select_" + i.name;
    i.vertical && (t += " dhx_multi_select_control_vertical");
    for (var n = "<div class='" + t + "' style='overflow: auto; max-height: " + i.height + "px; position: relative;' >", s = 0; s < i.options.length; s++)
      n += "<label><input type='checkbox' value='" + i.options[s].key + "'/>" + i.options[s].label + "</label>";
    return n += "</div>";
  }, set_value: function(i, t, n, s) {
    for (var r = i.getElementsByTagName("input"), _ = 0; _ < r.length; _++)
      r[_].checked = !1;
    function d(y) {
      for (var m = i.getElementsByTagName("input"), f = 0; f < m.length; f++)
        m[f].checked = !!y[m[f].value];
    }
    var a = {};
    if (n[s.map_to]) {
      var o = (n[s.map_to] + "").split(s.delimiter || e.config.section_delimiter || ",");
      for (_ = 0; _ < o.length; _++)
        a[o[_]] = !0;
      d(a);
    } else {
      if (e._new_event || !s.script_url)
        return;
      var l = document.createElement("div");
      l.className = "dhx_loading", l.style.cssText = "position: absolute; top: 40%; left: 40%;", i.appendChild(l);
      var h = [s.script_url, s.script_url.indexOf("?") == -1 ? "?" : "&", "dhx_crosslink_" + s.map_to + "=" + n.id + "&uid=" + e.uid()].join("");
      e.ajax.get(h, function(y) {
        var m = function(f, u) {
          try {
            for (var v = JSON.parse(f.xmlDoc.responseText), c = {}, p = 0; p < v.length; p++) {
              var g = v[p];
              c[g.value || g.key || g.id] = !0;
            }
            return c;
          } catch {
            return null;
          }
        }(y);
        m || (m = function(f, u) {
          for (var v = e.ajax.xpath("//data/item", f.xmlDoc), c = {}, p = 0; p < v.length; p++)
            c[v[p].getAttribute(u.map_to)] = !0;
          return c;
        }(y, s)), d(m), i.removeChild(l);
      });
    }
  }, get_value: function(i, t, n) {
    for (var s = [], r = i.getElementsByTagName("input"), _ = 0; _ < r.length; _++)
      r[_].checked && s.push(r[_].value);
    return s.join(n.delimiter || e.config.section_delimiter || ",");
  }, focus: function(i) {
  } };
}, multisource: function(e) {
  var i = e._load;
  e._load = function(t, n) {
    if (typeof (t = t || this._load_url) == "object")
      for (var s = function(_) {
        var d = function() {
        };
        return d.prototype = _, d;
      }(this._loaded), r = 0; r < t.length; r++)
        this._loaded = new s(), i.call(this, t[r], n);
    else
      i.apply(this, arguments);
  };
}, mvc: function(e) {
  var i, t = { use_id: !1 };
  function n(_) {
    var d = {};
    for (var a in _)
      a.indexOf("_") !== 0 && (d[a] = _[a]);
    return t.use_id || delete d.id, d;
  }
  function s(_) {
    _._not_render = !1, _._render_wait && _.render_view_data(), _._loading = !1, _.callEvent("onXLE", []);
  }
  function r(_) {
    return t.use_id ? _.id : _.cid;
  }
  e.backbone = function(_, d) {
    d && (t = d), _.bind("change", function(l, h) {
      var y = r(l), m = e._events[y] = l.toJSON();
      m.id = y, e._init_event(m), clearTimeout(i), i = setTimeout(function() {
        if (e.$destroyed)
          return !0;
        e.updateView();
      }, 1);
    }), _.bind("remove", function(l, h) {
      var y = r(l);
      e._events[y] && e.deleteEvent(y);
    });
    var a = [];
    function o() {
      if (e.$destroyed)
        return !0;
      a.length && (e.parse(a, "json"), a = []);
    }
    _.bind("add", function(l, h) {
      var y = r(l);
      if (!e._events[y]) {
        var m = l.toJSON();
        m.id = y, e._init_event(m), a.push(m), a.length == 1 && setTimeout(o, 1);
      }
    }), _.bind("request", function(l) {
      var h;
      l instanceof Backbone.Collection && ((h = e)._loading = !0, h._not_render = !0, h.callEvent("onXLS", []));
    }), _.bind("sync", function(l) {
      l instanceof Backbone.Collection && s(e);
    }), _.bind("error", function(l) {
      l instanceof Backbone.Collection && s(e);
    }), e.attachEvent("onEventCreated", function(l) {
      var h = new _.model(e.getEvent(l));
      return e._events[l] = h.toJSON(), e._events[l].id = l, !0;
    }), e.attachEvent("onEventAdded", function(l) {
      if (!_.get(l)) {
        var h = n(e.getEvent(l)), y = new _.model(h), m = r(y);
        m != l && this.changeEventId(l, m), _.add(y), _.trigger("scheduler:add", y);
      }
      return !0;
    }), e.attachEvent("onEventChanged", function(l) {
      var h = _.get(l), y = n(e.getEvent(l));
      return h.set(y), _.trigger("scheduler:change", h), !0;
    }), e.attachEvent("onEventDeleted", function(l) {
      var h = _.get(l);
      return h && (_.trigger("scheduler:remove", h), _.remove(l)), !0;
    });
  };
}, outerdrag: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    var i, t = new dhtmlDragAndDropObject(), n = t.stopDrag;
    function s(r, _, d, a) {
      if (!e.checkEvent("onBeforeExternalDragIn") || e.callEvent("onBeforeExternalDragIn", [r, _, d, a, i])) {
        var o = e.attachEvent("onEventCreated", function(f) {
          e.callEvent("onExternalDragIn", [f, r, i]) || (this._drag_mode = this._drag_id = null, this.deleteEvent(f));
        }), l = e.getActionData(i), h = { start_date: new Date(l.date) };
        if (e.matrix && e.matrix[e._mode]) {
          var y = e.matrix[e._mode];
          h[y.y_property] = l.section;
          var m = e._locate_cell_timeline(i);
          h.start_date = y._trace_x[m.x], h.end_date = e.date.add(h.start_date, y.x_step, y.x_unit);
        }
        e._props && e._props[e._mode] && (h[e._props[e._mode].map_to] = l.section), e.addEventNow(h), e.detachEvent(o);
      }
    }
    t.stopDrag = function(r) {
      return i = r, n.apply(this, arguments);
    }, t.addDragLanding(e._els.dhx_cal_data[0], { _drag: function(r, _, d, a) {
      s(r, _, d, a);
    }, _dragIn: function(r, _) {
      return r;
    }, _dragOut: function(r) {
      return this;
    } }), dhtmlx.DragControl && dhtmlx.DragControl.addDrop(e._els.dhx_cal_data[0], { onDrop: function(r, _, d, a) {
      var o = dhtmlx.DragControl.getMaster(r);
      i = a, s(r, o, _, a.target || a.srcElement);
    }, onDragIn: function(r, _, d) {
      return _;
    } }, !0);
  });
}, pdf: function(e) {
  var i, t, n = new RegExp("<[^>]*>", "g"), s = new RegExp("<br[^>]*>", "g");
  function r(x) {
    return x.replace(s, `
`).replace(n, "");
  }
  function _(x, k) {
    x = parseFloat(x), k = parseFloat(k), isNaN(k) || (x -= k);
    var w = a(x);
    return x = x - w.width + w.cols * i, isNaN(x) ? "auto" : 100 * x / i;
  }
  function d(x, k, w) {
    x = parseFloat(x), k = parseFloat(k), !isNaN(k) && w && (x -= k);
    var E = a(x);
    return x = x - E.width + E.cols * i, isNaN(x) ? "auto" : 100 * x / (i - (isNaN(k) ? 0 : k));
  }
  function a(x) {
    for (var k = 0, w = e._els.dhx_cal_header[0].childNodes, E = w[1] ? w[1].childNodes : w[0].childNodes, D = 0; D < E.length; D++) {
      var S = E[D].style ? E[D] : E[D].parentNode, M = parseFloat(S.style.width);
      if (!(x > M))
        break;
      x -= M + 1, k += M + 1;
    }
    return { width: k, cols: D };
  }
  function o(x) {
    return x = parseFloat(x), isNaN(x) ? "auto" : 100 * x / t;
  }
  function l(x, k) {
    return (window.getComputedStyle ? window.getComputedStyle(x, null)[k] : x.currentStyle ? x.currentStyle[k] : null) || "";
  }
  function h(x, k) {
    for (var w = parseInt(x.style.left, 10), E = 0; E < e._cols.length; E++)
      if ((w -= e._cols[E]) < 0)
        return E;
    return k;
  }
  function y(x, k) {
    for (var w = parseInt(x.style.top, 10), E = 0; E < e._colsS.heights.length; E++)
      if (e._colsS.heights[E] > w)
        return E;
    return k;
  }
  function m(x) {
    return x ? "</" + x + ">" : "";
  }
  function f(x, k, w, E) {
    var D = "<" + x + " profile='" + k + "'";
    return w && (D += " header='" + w + "'"), E && (D += " footer='" + E + "'"), D += ">";
  }
  function u() {
    var x = "", k = e._mode;
    if (e.matrix && e.matrix[e._mode] && (k = e.matrix[e._mode].render == "cell" ? "matrix" : "timeline"), x += "<scale mode='" + k + "' today='" + e._els.dhx_cal_date[0].innerHTML + "'>", e._mode == "week_agenda")
      for (var w = e._els.dhx_cal_data[0].getElementsByTagName("DIV"), E = 0; E < w.length; E++)
        w[E].className == "dhx_wa_scale_bar" && (x += "<column>" + r(w[E].innerHTML) + "</column>");
    else if (e._mode == "agenda" || e._mode == "map")
      x += "<column>" + r((w = e._els.dhx_cal_header[0].childNodes[0].childNodes)[0].innerHTML) + "</column><column>" + r(w[1].innerHTML) + "</column>";
    else if (e._mode == "year")
      for (w = e._els.dhx_cal_data[0].childNodes, E = 0; E < w.length; E++)
        x += "<month label='" + r(w[E].querySelector(".dhx_year_month").innerHTML) + "'>", x += c(w[E].querySelector(".dhx_year_week").childNodes), x += v(w[E].querySelector(".dhx_year_body")), x += "</month>";
    else {
      x += "<x>", x += c(w = e._els.dhx_cal_header[0].childNodes), x += "</x>";
      var D = e._els.dhx_cal_data[0];
      if (e.matrix && e.matrix[e._mode]) {
        for (x += "<y>", E = 0; E < D.firstChild.rows.length; E++)
          x += "<row><![CDATA[" + r(D.firstChild.rows[E].cells[0].innerHTML) + "]]></row>";
        x += "</y>", t = D.firstChild.rows[0].cells[0].offsetHeight;
      } else if (D.firstChild.tagName == "TABLE")
        x += v(D);
      else {
        for (D = D.childNodes[D.childNodes.length - 1]; D.className.indexOf("dhx_scale_holder") == -1; )
          D = D.previousSibling;
        for (D = D.childNodes, x += "<y>", E = 0; E < D.length; E++)
          x += `
<row><![CDATA[` + r(D[E].innerHTML) + "]]></row>";
        x += "</y>", t = D[0].offsetHeight;
      }
    }
    return x += "</scale>";
  }
  function v(x) {
    for (var k = "", w = x.querySelectorAll("tr"), E = 0; E < w.length; E++) {
      for (var D = [], S = w[E].querySelectorAll("td"), M = 0; M < S.length; M++)
        D.push(S[M].querySelector(".dhx_month_head").innerHTML);
      k += `
<row height='` + S[0].offsetHeight + "'><![CDATA[" + r(D.join("|")) + "]]></row>", t = S[0].offsetHeight;
    }
    return k;
  }
  function c(x) {
    var k, w = "";
    e.matrix && e.matrix[e._mode] && (e.matrix[e._mode].second_scale && (k = x[1].childNodes), x = x[0].childNodes);
    for (var E = 0; E < x.length; E++)
      w += `
<column><![CDATA[` + r(x[E].innerHTML) + "]]></column>";
    if (i = x[0].offsetWidth, k) {
      var D = 0, S = x[0].offsetWidth, M = 1;
      for (E = 0; E < k.length; E++)
        w += `
<column second_scale='` + M + "'><![CDATA[" + r(k[E].innerHTML) + "]]></column>", (D += k[E].offsetWidth) >= S && (S += x[M] ? x[M].offsetWidth : 0, M++), i = k[0].offsetWidth;
    }
    return w;
  }
  function p(x) {
    var k = "", w = e._rendered, E = e.matrix && e.matrix[e._mode];
    if (e._mode == "agenda" || e._mode == "map")
      for (var D = 0; D < w.length; D++)
        k += "<event><head><![CDATA[" + r(w[D].childNodes[0].innerHTML) + "]]></head><body><![CDATA[" + r(w[D].childNodes[2].innerHTML) + "]]></body></event>";
    else if (e._mode == "week_agenda")
      for (D = 0; D < w.length; D++)
        k += "<event day='" + w[D].parentNode.getAttribute("day") + "'><body>" + r(w[D].innerHTML) + "</body></event>";
    else if (e._mode == "year")
      for (w = e.get_visible_events(), D = 0; D < w.length; D++) {
        var S = w[D].start_date;
        for (S.valueOf() < e._min_date.valueOf() && (S = e._min_date); S < w[D].end_date; ) {
          var M = S.getMonth() + 12 * (S.getFullYear() - e._min_date.getFullYear()) - e.week_starts._month, N = e.week_starts[M] + S.getDate() - 1, T = x ? l(e._get_year_cell(S), "color") : "", A = x ? l(e._get_year_cell(S), "backgroundColor") : "";
          if (k += "<event day='" + N % 7 + "' week='" + Math.floor(N / 7) + "' month='" + M + "' backgroundColor='" + A + "' color='" + T + "'></event>", (S = e.date.add(S, 1, "day")).valueOf() >= e._max_date.valueOf())
            break;
        }
      }
    else if (E && E.render == "cell")
      for (w = e._els.dhx_cal_data[0].getElementsByTagName("TD"), D = 0; D < w.length; D++)
        T = x ? l(w[D], "color") : "", k += `
<event><body backgroundColor='` + (A = x ? l(w[D], "backgroundColor") : "") + "' color='" + T + "'><![CDATA[" + r(w[D].innerHTML) + "]]></body></event>";
    else
      for (D = 0; D < w.length; D++) {
        var C, H;
        if (e.matrix && e.matrix[e._mode])
          C = _(w[D].style.left), H = _(w[D].offsetWidth) - 1;
        else {
          var O = e.config.use_select_menu_space ? 0 : 26;
          C = d(w[D].style.left, O, !0), H = d(w[D].style.width, O) - 1;
        }
        if (!isNaN(1 * H)) {
          var $ = o(w[D].style.top), R = o(w[D].style.height), j = w[D].className.split(" ")[0].replace("dhx_cal_", "");
          if (j !== "dhx_tooltip_line") {
            var I = e.getEvent(w[D].getAttribute(e.config.event_attribute));
            if (I) {
              N = I._sday;
              var Y = I._sweek, J = I._length || 0;
              if (e._mode == "month")
                R = parseInt(w[D].offsetHeight, 10), $ = parseInt(w[D].style.top, 10) - e.xy.month_head_height, N = h(w[D], N), Y = y(w[D], Y);
              else if (e.matrix && e.matrix[e._mode]) {
                N = 0, Y = w[D].parentNode.parentNode.parentNode.rowIndex;
                var oe = t;
                t = w[D].parentNode.offsetHeight, $ = o(w[D].style.top), $ -= 0.2 * $, t = oe;
              } else {
                if (w[D].parentNode == e._els.dhx_cal_data[0])
                  continue;
                var X = e._els.dhx_cal_data[0].childNodes[0], B = parseFloat(X.className.indexOf("dhx_scale_holder") != -1 ? X.style.left : 0);
                C += _(w[D].parentNode.style.left, B);
              }
              k += `
<event week='` + Y + "' day='" + N + "' type='" + j + "' x='" + C + "' y='" + $ + "' width='" + H + "' height='" + R + "' len='" + J + "'>", j == "event" ? (k += "<header><![CDATA[" + r(w[D].childNodes[1].innerHTML) + "]]></header>", T = x ? l(w[D].childNodes[2], "color") : "", k += "<body backgroundColor='" + (A = x ? l(w[D].childNodes[2], "backgroundColor") : "") + "' color='" + T + "'><![CDATA[" + r(w[D].childNodes[2].innerHTML) + "]]></body>") : (T = x ? l(w[D], "color") : "", k += "<body backgroundColor='" + (A = x ? l(w[D], "backgroundColor") : "") + "' color='" + T + "'><![CDATA[" + r(w[D].innerHTML) + "]]></body>"), k += "</event>";
            }
          }
        }
      }
    return k;
  }
  function g(x, k, w, E, D, S) {
    var M = !1;
    E == "fullcolor" && (M = !0, E = "color"), E = E || "color";
    var N, T = "";
    if (x) {
      var A = e._date, C = e._mode;
      k = e.date[w + "_start"](k), k = e.date["get_" + w + "_end"] ? e.date["get_" + w + "_end"](k) : e.date.add(k, 1, w), T = f("pages", E, D, S);
      for (var H = new Date(x); +H < +k; H = this.date.add(H, 1, w))
        this.setCurrentView(H, w), T += ((N = "page") ? "<" + N + ">" : "") + u().replace("–", "-") + p(M) + m("page");
      T += m("pages"), this.setCurrentView(A, C);
    } else
      T = f("data", E, D, S) + u().replace("–", "-") + p(M) + m("data");
    return T;
  }
  function b(x, k, w, E, D, S, M) {
    (function(N, T) {
      var A = e.uid(), C = document.createElement("div");
      C.style.display = "none", document.body.appendChild(C), C.innerHTML = '<form id="' + A + '" method="post" target="_blank" action="' + T + '" accept-charset="utf-8" enctype="application/x-www-form-urlencoded"><input type="hidden" name="mycoolxmlbody"/> </form>', document.getElementById(A).firstChild.value = encodeURIComponent(N), document.getElementById(A).submit(), C.parentNode.removeChild(C);
    })(typeof D == "object" ? function(N) {
      for (var T = "<data>", A = 0; A < N.length; A++)
        T += N[A].source.getPDFData(N[A].start, N[A].end, N[A].view, N[A].mode, N[A].header, N[A].footer);
      return T += "</data>", T;
    }(D) : g.apply(this, [x, k, w, D, S, M]), E);
  }
  e.getPDFData = g, e.toPDF = function(x, k, w, E) {
    return b.apply(this, [null, null, null, x, k, w, E]);
  }, e.toPDFRange = function(x, k, w, E, D, S, M) {
    return typeof x == "string" && (x = e.templates.api_date(x), k = e.templates.api_date(k)), b.apply(this, arguments);
  };
}, quick_info: function(e) {
  e.config.icons_select = ["icon_form", "icon_delete"], e.config.details_on_create = !0, e.config.show_quick_info = !0, e.xy.menu_width = 0;
  let i = null;
  function t(s) {
    const r = s.getBoundingClientRect(), _ = e.$container.getBoundingClientRect().bottom - r.bottom;
    _ < 0 && (s.style.top = `${parseFloat(s.style.top) + _}px`);
  }
  function n(s) {
    let r = 0, _ = 0, d = s;
    for (; d && d != e._obj; )
      r += d.offsetLeft, _ += d.offsetTop - d.scrollTop, d = d.offsetParent;
    return d ? { left: r, top: _, dx: r + s.offsetWidth / 2 > e._x / 2 ? 1 : 0, dy: _ + s.offsetHeight / 2 > e._y / 2 ? 1 : 0, width: s.offsetWidth, height: s.offsetHeight } : 0;
  }
  e.attachEvent("onSchedulerReady", function() {
    const s = e.$container;
    s._$quickInfoHandler || (s._$quickInfoHandler = !0, e.event(s, "mousedown", function(r) {
      const _ = r.target.closest(`[${e.config.event_attribute}]`);
      _ && (i = { id: _.getAttribute(e.config.event_attribute), position: n(_) });
    }), e.attachEvent("onDestroy", () => {
      delete s._$quickInfoHandler;
    }));
  }), e.attachEvent("onClick", function(s) {
    if (e.config.show_quick_info)
      return e.showQuickInfo(s), !0;
  }), function() {
    for (var s = ["onEmptyClick", "onViewChange", "onLightbox", "onBeforeEventDelete", "onBeforeDrag"], r = function() {
      return e.hideQuickInfo(!0), !0;
    }, _ = 0; _ < s.length; _++)
      e.attachEvent(s[_], r);
  }(), e.templates.quick_info_title = function(s, r, _) {
    return _.text.substr(0, 50);
  }, e.templates.quick_info_content = function(s, r, _) {
    return _.details || "";
  }, e.templates.quick_info_date = function(s, r, _) {
    return e.isOneDayEvent(_) && e.config.rtl ? e.templates.day_date(s, r, _) + " " + e.templates.event_header(r, s, _) : e.isOneDayEvent(_) ? e.templates.day_date(s, r, _) + " " + e.templates.event_header(s, r, _) : e.config.rtl ? e.templates.week_date(r, s, _) : e.templates.week_date(s, r, _);
  }, e.showQuickInfo = function(s) {
    if (s == this._quick_info_box_id || (this.hideQuickInfo(!0), this.callEvent("onBeforeQuickInfo", [s]) === !1))
      return;
    let r;
    r = i && i.id == s ? i.position : this._get_event_counter_part(s), r && (this._quick_info_box = this._init_quick_info(r), this._fill_quick_data(s), this._show_quick_info(r), this.callEvent("onQuickInfo", [s]));
  }, function() {
    function s(r) {
      r = r || "";
      var _, d = parseFloat(r), a = r.match(/m?s/);
      switch (a && (a = a[0]), a) {
        case "s":
          _ = 1e3 * d;
          break;
        case "ms":
          _ = d;
          break;
        default:
          _ = 0;
      }
      return _;
    }
    e.hideQuickInfo = function(r) {
      var _ = this._quick_info_box, d = this._quick_info_box_id;
      if (this._quick_info_box_id = 0, _ && _.parentNode) {
        var a = _.offsetWidth;
        if (e.config.quick_info_detached)
          return this.callEvent("onAfterQuickInfo", [d]), _.parentNode.removeChild(_);
        if (_.style.right == "auto" ? _.style.left = -a + "px" : _.style.right = -a + "px", r)
          _.parentNode.removeChild(_);
        else {
          var o;
          window.getComputedStyle ? o = window.getComputedStyle(_, null) : _.currentStyle && (o = _.currentStyle);
          var l = s(o["transition-delay"]) + s(o["transition-duration"]);
          setTimeout(function() {
            _.parentNode && _.parentNode.removeChild(_);
          }, l);
        }
        this.callEvent("onAfterQuickInfo", [d]);
      }
    };
  }(), e.event(window, "keydown", function(s) {
    s.keyCode == 27 && e.hideQuickInfo();
  }), e._show_quick_info = function(s) {
    var r = e._quick_info_box;
    e._obj.appendChild(r);
    var _ = r.offsetWidth, d = r.offsetHeight;
    if (e.config.quick_info_detached) {
      var a = s.left - s.dx * (_ - s.width);
      e.getView() && e.getView()._x_scroll && (e.config.rtl ? a += e.getView()._x_scroll : a -= e.getView()._x_scroll), a + _ > window.innerWidth && (a = window.innerWidth - _), a = Math.max(0, a), r.style.left = a + "px", r.style.top = s.top - (s.dy ? d : -s.height) + "px";
    } else {
      const o = e.$container.querySelector(".dhx_cal_data").offsetTop;
      r.style.top = o + 20 + "px", s.dx == 1 ? (r.style.right = "auto", r.style.left = -_ + "px", setTimeout(function() {
        r.style.left = "-10px";
      }, 1)) : (r.style.left = "auto", r.style.right = -_ + "px", setTimeout(function() {
        r.style.right = "-10px";
      }, 1)), r.className = r.className.replace(" dhx_qi_left", "").replace(" dhx_qi_right", "") + " dhx_qi_" + (s.dx == 1 ? "left" : "right");
    }
    r.ontransitionend = () => {
      t(r), r.ontransitionend = null;
    }, setTimeout(() => {
      t(r);
    }, 1);
  }, e.attachEvent("onTemplatesReady", function() {
    if (e.hideQuickInfo(), this._quick_info_box) {
      var s = this._quick_info_box;
      s.parentNode && s.parentNode.removeChild(s), this._quick_info_box = null;
    }
  }), e._quick_info_onscroll_handler = function(s) {
    e.hideQuickInfo();
  }, e._init_quick_info = function() {
    if (!this._quick_info_box) {
      var s = this._quick_info_box = document.createElement("div");
      this._waiAria.quickInfoAttr(s), s.className = "dhx_cal_quick_info", e.$testmode && (s.className += " dhx_no_animate"), e.config.rtl && (s.className += " dhx_quick_info_rtl");
      var r = `
		<div class="dhx_cal_qi_tcontrols">
			<a class="dhx_cal_qi_close_btn scheduler_icon close"></a>
		</div>
		<div class="dhx_cal_qi_title" ${this._waiAria.quickInfoHeaderAttrString()}>
				
				<div class="dhx_cal_qi_tcontent"></div>
				<div class="dhx_cal_qi_tdate"></div>
			</div>
			<div class="dhx_cal_qi_content"></div>`;
      r += '<div class="dhx_cal_qi_controls">';
      for (var _ = e.config.icons_select, d = 0; d < _.length; d++)
        r += `<div ${this._waiAria.quickInfoButtonAttrString(this.locale.labels[_[d]])} class="dhx_qi_big_icon ${_[d]}" title="${e.locale.labels[_[d]]}">
				<div class='dhx_menu_icon ${_[d]}'></div><div>${e.locale.labels[_[d]]}</div></div>`;
      r += "</div>", s.innerHTML = r, e.event(s, "click", function(a) {
        e._qi_button_click(a.target || a.srcElement);
      }), e.config.quick_info_detached && (e._detachDomEvent(e._els.dhx_cal_data[0], "scroll", e._quick_info_onscroll_handler), e.event(e._els.dhx_cal_data[0], "scroll", e._quick_info_onscroll_handler));
    }
    return this._quick_info_box;
  }, e._qi_button_click = function(s) {
    var r = e._quick_info_box;
    if (s && s != r)
      if (s.closest(".dhx_cal_qi_close_btn"))
        e.hideQuickInfo();
      else {
        var _ = e._getClassName(s);
        if (_.indexOf("_icon") != -1) {
          var d = e._quick_info_box_id;
          e._click.buttons[_.split(" ")[1].replace("icon_", "")](d);
        } else
          e._qi_button_click(s.parentNode);
      }
  }, e._get_event_counter_part = function(s) {
    return n(e.getRenderedEvent(s));
  }, e._fill_quick_data = function(s) {
    var r = e.getEvent(s), _ = e._quick_info_box;
    e._quick_info_box_id = s;
    var d = { content: e.templates.quick_info_title(r.start_date, r.end_date, r), date: e.templates.quick_info_date(r.start_date, r.end_date, r) };
    _.querySelector(".dhx_cal_qi_tcontent").innerHTML = `<span>${d.content}</span>`, _.querySelector(".dhx_cal_qi_tdate").innerHTML = d.date, e._waiAria.quickInfoHeader(_, [d.content, d.date].join(" "));
    var a = _.querySelector(".dhx_cal_qi_content");
    const o = e.templates.quick_info_content(r.start_date, r.end_date, r);
    o ? (a.classList.remove("dhx_hidden"), a.innerHTML = o) : a.classList.add("dhx_hidden");
  };
}, readonly: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    var i;
    e.form_blocks.recurring && (i = e.form_blocks.recurring.set_value);
    var t = e.config.buttons_left.slice(), n = e.config.buttons_right.slice();
    function s(d, a, o, l) {
      for (var h = a.getElementsByTagName(d), y = o.getElementsByTagName(d), m = y.length - 1; m >= 0; m--)
        if (o = y[m], l) {
          var f = document.createElement("span");
          f.className = "dhx_text_disabled", f.innerHTML = l(h[m]), o.parentNode.insertBefore(f, o), o.parentNode.removeChild(o);
        } else
          o.disabled = !0, a.checked && (o.checked = !0);
    }
    e.attachEvent("onBeforeLightbox", function(d) {
      this.config.readonly_form || this.getEvent(d).readonly ? this.config.readonly_active = !0 : (this.config.readonly_active = !1, e.config.buttons_left = t.slice(), e.config.buttons_right = n.slice(), e.form_blocks.recurring && (e.form_blocks.recurring.set_value = i));
      var a = this.config.lightbox.sections;
      if (this.config.readonly_active) {
        for (var o = 0; o < a.length; o++)
          a[o].type == "recurring" && this.config.readonly_active && e.form_blocks.recurring && (e.form_blocks.recurring.set_value = function(c, p, g) {
            var b = e.$domHelpers.closest(c, ".dhx_wrap_section"), x = "none";
            b.querySelector(".dhx_cal_lsection").display = x, b.querySelector(".dhx_form_repeat").display = x, b.style.display = x, e.setLightboxSize();
          });
        var l = ["dhx_delete_btn", "dhx_save_btn"], h = [e.config.buttons_left, e.config.buttons_right];
        for (o = 0; o < l.length; o++)
          for (var y = l[o], m = 0; m < h.length; m++) {
            for (var f = h[m], u = -1, v = 0; v < f.length; v++)
              if (f[v] == y) {
                u = v;
                break;
              }
            u != -1 && f.splice(u, 1);
          }
      }
      return this.resetLightbox(), !0;
    });
    var r = e._fill_lightbox;
    e._fill_lightbox = function() {
      var d = this.getLightbox();
      this.config.readonly_active && (d.style.visibility = "hidden", d.style.display = "block");
      var a = r.apply(this, arguments);
      if (this.config.readonly_active && (d.style.visibility = "", d.style.display = "none"), this.config.readonly_active) {
        var o = this.getLightbox(), l = this._lightbox_r = o.cloneNode(!0);
        l.id = e.uid(), l.className += " dhx_cal_light_readonly", s("textarea", o, l, function(h) {
          return h.value;
        }), s("input", o, l, !1), s("select", o, l, function(h) {
          return h.options.length ? h.options[Math.max(h.selectedIndex || 0, 0)].text : "";
        }), o.parentNode.insertBefore(l, o), this.showCover(l), e._lightbox && e._lightbox.parentNode.removeChild(e._lightbox), this._lightbox = l, e.config.drag_lightbox && e.event(l.firstChild, "mousedown", e._ready_to_dnd), e._init_lightbox_events(), this.setLightboxSize();
      }
      return a;
    };
    var _ = e.hide_lightbox;
    e.hide_lightbox = function() {
      return this._lightbox_r && (this._lightbox_r.parentNode.removeChild(this._lightbox_r), this._lightbox_r = this._lightbox = null), _.apply(this, arguments);
    };
  });
}, recurring: function(e) {
  function i(m) {
    return new Date(m.getFullYear(), m.getMonth(), m.getDate(), m.getHours(), m.getMinutes(), m.getSeconds(), 0);
  }
  function t(m) {
    return !!m.rrule && !m.recurring_event_id;
  }
  var n;
  function s() {
    const m = {};
    for (const f in e._events) {
      const u = e._events[f];
      u.recurring_event_id && (m[u.recurring_event_id] || (m[u.recurring_event_id] = {}), m[u.recurring_event_id][u.original_start.valueOf()] = u);
    }
    return m;
  }
  e._rec_temp = [], e._rec_markers_pull = {}, e._rec_markers = {}, e._add_rec_marker = function(m, f) {
    m._pid_time = f, this._rec_markers[m.id] = m, this._rec_markers_pull[m.event_pid] || (this._rec_markers_pull[m.event_pid] = {}), this._rec_markers_pull[m.event_pid][f] = m;
  }, e._get_rec_marker = function(m, f) {
    let u = this._rec_markers_pull[f];
    return u ? u[m] : null;
  }, e._get_rec_markers = function(m) {
    return this._rec_markers_pull[m] || [];
  }, n = e.addEvent, e.addEvent = function(m, f, u, v, c) {
    var p = n.apply(this, arguments);
    if (p && e.getEvent(p)) {
      var g = e.getEvent(p);
      g.start_date && (g.start_date = i(g.start_date)), g.end_date && (g.end_date = i(g.end_date));
    }
    return p;
  }, e.attachEvent("onEventLoading", function(m) {
    return m.original_start && (m.original_start = e.templates.parse_date(m.original_start)), !0;
  }), e.attachEvent("onEventIdChange", function(m, f) {
    if (!this._ignore_call) {
      this._ignore_call = !0, e._rec_markers[m] && (e._rec_markers[f] = e._rec_markers[m], delete e._rec_markers[m]), e._rec_markers_pull[m] && (e._rec_markers_pull[f] = e._rec_markers_pull[m], delete e._rec_markers_pull[m]);
      for (var u = 0; u < this._rec_temp.length; u++)
        (v = this._rec_temp[u]).recurring_event_id == m && (v.recurring_event_id = f, this.changeEventId(v.id, f + "#" + v.id.split("#")[1]));
      for (var u in this._rec_markers) {
        var v;
        (v = this._rec_markers[u]).recurring_event_id == m && (v.recurring_event_id = f, v._pid_changed = !0);
      }
      var c = e._rec_markers[f];
      c && c._pid_changed && (delete c._pid_changed, setTimeout(function() {
        if (e.$destroyed)
          return !0;
        e.callEvent("onEventChanged", [f, e.getEvent(f)]);
      }, 1)), delete this._ignore_call;
    }
  }), e.attachEvent("onConfirmedBeforeEventDelete", function(m) {
    var f = this.getEvent(m);
    if (this._is_virtual_event(m) || this._is_modified_occurence(f) && !function(c) {
      return !!c.deleted;
    }(f))
      (function(c, p) {
        c = c.split("#");
        let g = e.uid(), b = c[1] ? c[1] : p._pid_time, x = e._copy_event(p);
        x.id = g, x.recurring_event_id = p.recurring_event_id || c[0], x.original_start = new Date(Number(b)), x.deleted = !0, e.addEvent(x);
      })(m, f);
    else {
      t(f) && this._lightbox_id && this._roll_back_dates(f);
      var u = this._get_rec_markers(m);
      for (var v in u)
        u.hasOwnProperty(v) && (m = u[v].id, this.getEvent(m) && this.deleteEvent(m, !0));
    }
    return !0;
  }), e.attachEvent("onEventDeleted", function(m, f) {
    !this._is_virtual_event(m) && this._is_modified_occurence(f) && (e._events[m] || (f.deleted = !0, this.setEvent(m, f)));
  }), e.attachEvent("onEventChanged", function(m, f) {
    if (this._loading)
      return !0;
    var u = this.getEvent(m);
    if (this._is_virtual_event(m))
      (function(b) {
        let x = b.id.split("#"), k = e.uid();
        e._not_render = !0;
        let w = e._copy_event(b);
        w.id = k, w.recurring_event_id = x[0];
        let E = x[1];
        w.original_start = new Date(Number(E)), e._add_rec_marker(w, E), e.addEvent(w), e._not_render = !1;
      })(u);
    else {
      u.start_date && (u.start_date = i(u.start_date)), u.end_date && (u.end_date = i(u.end_date)), t(u) && this._lightbox_id && this._roll_back_dates(u);
      var v = this._get_rec_markers(m);
      for (var c in v)
        v.hasOwnProperty(c) && (delete this._rec_markers[v[c].id], this.deleteEvent(v[c].id, !0));
      delete this._rec_markers_pull[m];
      for (var p = !1, g = 0; g < this._rendered.length; g++)
        this._rendered[g].getAttribute(this.config.event_attribute) == m && (p = !0);
      p || (this._select_id = null);
    }
    return !0;
  }), e.attachEvent("onEventAdded", function(m) {
    if (!this._loading) {
      var f = this.getEvent(m);
      t(f) && this._roll_back_dates(f);
    }
    return !0;
  }), e.attachEvent("onEventSave", function(m, f, u) {
    return t(this.getEvent(m)) && (this._select_id = null), !0;
  }), e.attachEvent("onEventCreated", function(m) {
    var f = this.getEvent(m);
    return t(f) || function(u) {
      u.rrule = "", u.original_start = null, u.recurring_event_id = null, u.duration = null, u.deleted = null;
    }(f), !0;
  }), e.attachEvent("onEventCancel", function(m) {
    var f = this.getEvent(m);
    t(f) && (this._roll_back_dates(f), this.render_view_data());
  }), e._roll_back_dates = function(m) {
    m.start_date && (m.start_date = i(m.start_date)), m.end_date && (m.end_date = i(m.end_date)), m.duration = Math.round((m.end_date.valueOf() - m.start_date.valueOf()) / 1e3), m.end_date = m._end_date, m._start_date && (m.start_date.setMonth(0), m.start_date.setDate(m._start_date.getDate()), m.start_date.setMonth(m._start_date.getMonth()), m.start_date.setFullYear(m._start_date.getFullYear()));
  }, e._is_virtual_event = function(m) {
    return m.toString().indexOf("#") != -1;
  }, e._is_modified_occurence = function(m) {
    return m.recurring_event_id && m.recurring_event_id != "0";
  }, e.showLightbox_rec = e.showLightbox, e.showLightbox = function(m) {
    var f = this.locale, u = e.config.lightbox_recurring, v = this.getEvent(m), c = v.recurring_event_id, p = this._is_virtual_event(m);
    p && (c = m.split("#")[0]);
    var g = function(x) {
      var k = e.getEvent(x);
      return k._end_date = k.end_date, k.end_date = new Date(k.start_date.valueOf() + 1e3 * k.duration), e.showLightbox_rec(x);
    };
    if ((c || 1 * c == 0) && t(v))
      return g(m);
    if (!c || c === "0" || !f.labels.confirm_recurring || u == "instance" || u == "series" && !p)
      return this.showLightbox_rec(m);
    if (u == "ask") {
      var b = this;
      e.modalbox({ text: f.labels.confirm_recurring, title: f.labels.title_confirm_recurring, width: "500px", position: "middle", buttons: [f.labels.button_edit_series, f.labels.button_edit_occurrence, f.labels.icon_cancel], callback: function(x) {
        switch (+x) {
          case 0:
            return g(c);
          case 1:
            return b.showLightbox_rec(m);
          case 2:
            return;
        }
      } });
    } else
      g(c);
  }, e.get_visible_events_rec = e.get_visible_events, e.get_visible_events = function(m) {
    for (var f = 0; f < this._rec_temp.length; f++)
      delete this._events[this._rec_temp[f].id];
    this._rec_temp = [];
    const u = s();
    var v = this.get_visible_events_rec(m), c = [];
    for (f = 0; f < v.length; f++)
      v[f].deleted || v[f].recurring_event_id || (t(v[f]) ? this.repeat_date(v[f], c, void 0, void 0, void 0, void 0, u) : c.push(v[f]));
    return c;
  }, function() {
    var m = e.isOneDayEvent;
    e.isOneDayEvent = function(u) {
      return !!t(u) || m.call(this, u);
    };
    var f = e.updateEvent;
    e.updateEvent = function(u) {
      var v = e.getEvent(u);
      v && t(v) && !this._is_virtual_event(u) ? e.update_view() : f.call(this, u);
    };
  }();
  const r = e.date.date_to_str("%Y%m%dT%H%i%s");
  function _(m) {
    const f = m.getDay(), u = m.getDate();
    return { dayOfWeek: f, dayNumber: Math.ceil(u / 7) };
  }
  e.repeat_date = function(m, f, u, v, c, p, g) {
    if (!m.rrule)
      return;
    let b = g ? g[m.id] : s()[m.id];
    b || (b = {}), v || (v = e._min_date), c || (c = e._max_date);
    const x = new Date(Date.UTC(m.start_date.getFullYear(), m.start_date.getMonth(), m.start_date.getDate(), m.start_date.getHours(), m.start_date.getMinutes(), m.start_date.getSeconds())), k = at(`RRULE:${m.rrule};UNTIL=${r(m.end_date)}`, { dtstart: x }).between(v, c).map((D) => {
      const S = new Date(D);
      return S.setHours(m.start_date.getHours()), S.setMinutes(m.start_date.getMinutes()), S.setSeconds(m.start_date.getSeconds()), S;
    });
    let w = 0;
    const E = m.duration;
    for (let D = 0; D < k.length && !(p && w >= p); D++) {
      const S = k[D];
      let M = b[S.valueOf()];
      if (M) {
        if (M.deleted)
          continue;
        w++, f.push(M);
      } else {
        const N = e._copy_event(m);
        if (N.text = m.text, N.start_date = S, N.id = m.id + "#" + Math.ceil(S.valueOf()), N.end_date = new Date(S.valueOf() + 1e3 * E), N.end_date = e._fix_daylight_saving_date(N.start_date, N.end_date, m, S, N.end_date), N._timed = e.isOneDayEvent(N), !N._timed && !e._table_view && !e.config.multi_day)
          continue;
        f.push(N), u || (e._events[N.id] = N, e._rec_temp.push(N)), w++;
      }
    }
  }, e._fix_daylight_saving_date = function(m, f, u, v, c) {
    var p = m.getTimezoneOffset() - f.getTimezoneOffset();
    return p ? p > 0 ? new Date(v.valueOf() + 1e3 * u.duration - 60 * p * 1e3) : new Date(f.valueOf() - 60 * p * 1e3) : new Date(c.valueOf());
  }, e.getRecDates = function(m, f) {
    var u = typeof m == "object" ? m : e.getEvent(m), v = [];
    if (f = f || 100, !t(u))
      return [{ start_date: u.start_date, end_date: u.end_date }];
    if (u.deleted)
      return [];
    e.repeat_date(u, v, !0, u.start_date, u.end_date, f);
    for (var c = [], p = 0; p < v.length; p++)
      v[p].deleted || c.push({ start_date: v[p].start_date, end_date: v[p].end_date });
    return c;
  }, e.getEvents = function(m, f) {
    var u = [];
    const v = s();
    for (var c in this._events) {
      var p = this._events[c];
      if (!p.recurring_event_id)
        if (t(p))
          if (m && f && p.start_date < f && p.end_date > m) {
            var g = [];
            this.repeat_date(p, g, !0, m, f, void 0, v), g.forEach(function(b) {
              b.start_date < f && b.end_date > m && u.push(b);
            });
          } else
            m || f || u.push(p);
        else
          this._is_virtual_event(p.id) || u.push(p);
    }
    return u;
  }, e._copy_dummy = function(m) {
    var f = new Date(this.start_date), u = new Date(this.end_date);
    this.start_date = f, this.end_date = u, this.duration = this.rrule = null;
  }, e.config.include_end_by = !1, e.config.lightbox_recurring = "ask", e.config.recurring_workdays = [z.MO.weekday, z.TU.weekday, z.WE.weekday, z.TH.weekday, z.FR.weekday], e.config.repeat_date = "%m.%d.%Y", e.config.lightbox.sections = [{ name: "description", map_to: "text", type: "textarea", focus: !0 }, { name: "recurring", type: "recurring", map_to: "rec_type" }, { name: "time", height: 72, type: "time", map_to: "auto" }], e.attachEvent("onClearAll", function() {
    e._rec_markers = {}, e._rec_markers_pull = {}, e._rec_temp = [];
  });
  const d = { 0: "SU", 1: "MO", 2: "TU", 3: "WE", 4: "TH", 5: "FR", 6: "SA" }, a = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 0 };
  function o(m) {
    switch (m) {
      case 1:
      case 31:
        return `${m}st`;
      case 2:
        return `${m}nd`;
      case 3:
        return `${m}rd`;
      default:
        return `${m}th`;
    }
  }
  e.templates.repeat_monthly_date = function(m, f) {
    return `Every ${o(m.getDate())}`;
  }, e.templates.repeat_monthly_weekday = function(m, f) {
    const u = _(m);
    return `Every ${o(u.dayNumber)} ${e.locale.date.day_full[u.dayOfWeek]}`;
  }, e.templates.repeat_yearly_month_date = function(m, f) {
    const u = m.getDate(), v = e.locale.date.month_full[m.getMonth()];
    return `Every ${o(u)} day of ${v}`;
  }, e.templates.repeat_yearly_month_weekday = function(m, f) {
    const u = _(m), v = e.locale.date.month_full[m.getMonth()];
    return `Every ${o(u.dayNumber)} ${e.locale.date.day_full[u.dayOfWeek]} of ${v}`;
  };
  const l = { MONTHLY: function(m) {
    return { rrule: { freq: z.MONTHLY, interval: 1, bymonthday: m.start.getDate() }, until: new Date(9999, 1, 1) };
  }, WEEKLY: function(m) {
    let f = m.start.getDay() - 1;
    return f == -1 && (f = 6), { rrule: { freq: z.WEEKLY, interval: 1, byweekday: [f] }, until: new Date(9999, 1, 1) };
  }, DAILY: function(m) {
    return { rrule: { freq: z.DAILY, interval: 1 }, until: new Date(9999, 1, 1) };
  }, YEARLY: function(m) {
    return { rrule: { freq: z.YEARLY, bymonth: m.start.getMonth() + 1, interval: 1, bymonthday: m.start.getDate() }, until: new Date(9999, 1, 1) };
  }, WORKDAYS: function(m) {
    return { rrule: { freq: z.WEEKLY, interval: 1, byweekday: e.config.recurring_workdays }, until: new Date(9999, 1, 1) };
  }, CUSTOM: function(m, f) {
    const u = {}, v = f.querySelector('[name="repeat_interval_unit"]').value, c = Math.max(1, f.querySelector('[name="repeat_interval_value"]').value), p = f.querySelector('[name="dhx_custom_month_option"]').value, g = f.querySelector('[name="dhx_custom_year_option"]').value;
    let b, x;
    switch (u.interval = c, v) {
      case "DAILY":
        u.freq = z.DAILY;
        break;
      case "WEEKLY":
        u.freq = z.WEEKLY, b = [], f.querySelectorAll('.dhx_form_repeat_custom_week [name="week_day"]').forEach((E) => {
          E.checked && b.push(E.value);
        }), u.byweekday = b.map((E) => {
          switch (E) {
            case "MO":
              return z.MO.weekday;
            case "TU":
              return z.TU.weekday;
            case "WE":
              return z.WE.weekday;
            case "TH":
              return z.TH.weekday;
            case "FR":
              return z.FR.weekday;
            case "SA":
              return z.SA.weekday;
            case "SU":
              return z.SU.weekday;
          }
        });
        break;
      case "MONTHLY":
        u.freq = z.MONTHLY, p === "month_date" ? u.bymonthday = m.start.getDate() : (x = m.start.getDay() - 1, x == -1 && (x = 6), u.byweekday = [x], u.bysetpos = _(m.start).dayNumber);
        break;
      case "YEARLY":
        u.freq = z.YEARLY, u.bymonth = m.start.getMonth() + 1, g == "month_date" ? u.bymonthday = m.start.getDate() : (x = m.start.getDay() - 1, x == -1 && (x = 6), u.byweekday = [x], u.bysetpos = _(m.start).dayNumber);
    }
    let k = new Date(9999, 1, 1);
    const w = f.querySelector('[name="dhx_custom_repeat_ends"]');
    return w === "ON" ? k = f.querySelector('[name="dhx_form_repeat_ends_ondate"]').value : w === "AFTER" && (u.count = Math.max(1, f.querySelector('[name="dhx_form_repeat_ends_after"]').value)), { rrule: u, until: k };
  }, NEVER: function() {
  } };
  function h(m, f, u) {
    (function(v, c) {
      v.querySelector("[name='repeat_interval_value']").value = (c ? c.interval : 1) || 1;
    })(m, f), function(v, c, p) {
      if (v.querySelector("[name='repeat_interval_value']").value = (c ? c.interval : 1) || 1, v.querySelectorAll(".dhx_form_repeat_custom_week input").forEach((g) => g.checked = !1), c && c.byweekday)
        c.byweekday.forEach((g) => {
          const b = a[g.weekday], x = d[b];
          v.querySelector(`.dhx_form_repeat_custom_week input[value="${x}"]`).checked = !0;
        });
      else {
        const g = d[p.start_date.getDay()];
        v.querySelector(`.dhx_form_repeat_custom_week input[value="${g}"]`).checked = !0;
      }
    }(m, f, u), function(v, c, p) {
      v.querySelector("[name='repeat_interval_value']").value = (c ? c.interval : 1) || 1;
      const g = v.querySelector('.dhx_form_repeat_custom_month [value="month_date"]'), b = v.querySelector('.dhx_form_repeat_custom_month [value="month_nth_weekday"]');
      g.innerText = e.templates.repeat_monthly_date(p.start_date, p), b.innerText = e.templates.repeat_monthly_weekday(p.start_date, p), c && (!c.bysetpos || c.byweekday && c.byweekday.length) ? v.querySelector('[name="dhx_custom_month_option"]').value = "month_nth_weekday" : v.querySelector('[name="dhx_custom_month_option"]').value = "month_date";
    }(m, f, u), function(v, c, p) {
      const g = v.querySelector('.dhx_form_repeat_custom_year [value="month_date"]'), b = v.querySelector('.dhx_form_repeat_custom_year [value="month_nth_weekday"]');
      g.innerText = e.templates.repeat_yearly_month_date(p.start_date, p), b.innerText = e.templates.repeat_yearly_month_weekday(p.start_date, p), c && (!c.bysetpos || c.byweekday && c.byweekday.length) ? v.querySelector('[name="dhx_custom_year_option"]').value = "month_nth_weekday" : v.querySelector('[name="dhx_custom_year_option"]').value = "month_date";
    }(m, f, u), function(v, c, p) {
      const g = v.querySelector('.dhx_form_repeat_ends_extra [name="dhx_form_repeat_ends_after"]'), b = v.querySelector('.dhx_form_repeat_ends_extra [name="dhx_form_repeat_ends_ondate"]'), x = v.querySelector("[name='dhx_custom_repeat_ends']");
      g.value = 1;
      let k = e.date.date_to_str("%Y-%m-%d");
      e.config.repeat_date_of_end || (e.config.repeat_date_of_end = k(e.date.add(e._currentDate(), 30, "day"))), b.value = e.config.repeat_date_of_end, c && c.count ? (x.value = "AFTER", g.value = c.count) : p._end_date && p._end_date.getFullYear() !== 9999 ? (x.value = "ON", b.value = k(p._end_date)) : x.value = "NEVER", x.dispatchEvent(new Event("change"));
    }(m, f, u);
  }
  function y(m) {
    for (let f = 0; f < e.config.lightbox.sections.length; f++) {
      let u = e.config.lightbox.sections[f];
      if (u.type === m)
        return e.formSection(u.name);
    }
    return null;
  }
  e.form_blocks.recurring = { render: function(m) {
    if (m.form) {
      let u = e.form_blocks.recurring, v = u._get_node(m.form), c = u._outer_html(v);
      return v.style.display = "none", c;
    }
    let f = e.locale.labels;
    return `<div class="dhx_form_rrule">
		<div class="dhx_form_repeat_pattern">
			<select>
				<option value="NEVER">${f.repeat_never}</option>
				<option value="DAILY">${f.repeat_daily}</option>
				<option value="WEEKLY">${f.repeat_weekly}</option>
				<option value="MONTHLY">${f.repeat_monthly}</option>
				<option value="YEARLY">${f.repeat_yearly}</option>
				<option value="WORKDAYS">${f.repeat_workdays}</option>
				<option value="CUSTOM">${f.repeat_custom}</option>
			</select>
		</div>
		<div class="dhx_form_repeat_custom dhx_hidden">
			<div class="dhx_form_repeat_custom_interval">
				<input name="repeat_interval_value" type="number" min="1">
				<select name="repeat_interval_unit">
					<option value="DAILY">${f.repeat_freq_day}</option>
					<option value="WEEKLY">${f.repeat_freq_week}</option>
					<option value="MONTHLY">${f.repeat_freq_month}</option>
					<option value="YEARLY">${f.repeat_freq_year}</option>
				</select>
			</div>

			<div class="dhx_form_repeat_custom_additional">
				<div class="dhx_form_repeat_custom_week dhx_hidden">
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="MO" />${f.day_for_recurring[1]}</label>
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="TU" />${f.day_for_recurring[2]}</label>
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="WE" />${f.day_for_recurring[3]}</label>
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="TH" />${f.day_for_recurring[4]}</label>
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="FR" />${f.day_for_recurring[5]}</label>
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="SA" />${f.day_for_recurring[6]}</label>
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="SU" />${f.day_for_recurring[0]}</label>
				</div>

				<div class="dhx_form_repeat_custom_month dhx_hidden">
					<select name="dhx_custom_month_option">
						<option value="month_date"></option>
						<option value="month_nth_weekday"></option>
					</select>
				</div>

				<div class="dhx_form_repeat_custom_year dhx_hidden">
					<select name="dhx_custom_year_option">
						<option value="month_date"></option>
						<option value="month_nth_weekday"></option>
					</select>
				</div>
			</div>

			<div class="dhx_form_repeat_ends">
				<div>${f.repeat_ends}</div>
				<div class="dhx_form_repeat_ends_options">
					<select name="dhx_custom_repeat_ends">
						<option value="NEVER">${f.repeat_never}</option>
						<option value="AFTER">${f.repeat_radio_end2}</option>
						<option value="ON">${f.repeat_on_date}</option>
					</select>
					<div class="dhx_form_repeat_ends_extra">
						<div class="dhx_form_repeat_ends_after dhx_hidden">
							<label><input type="number" min="1" name="dhx_form_repeat_ends_after">${f.repeat_text_occurences_count}</label>
						</div>
						<div class="dhx_form_repeat_ends_on dhx_hidden">
							<input type="date" name="dhx_form_repeat_ends_ondate">
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>`;
  }, _init_set_value: function(m, f, u) {
    function v(p) {
      p.classList.add("dhx_hidden");
    }
    function c(p) {
      p.classList.remove("dhx_hidden");
    }
    e.form_blocks.recurring._ds = { start: u.start_date, end: u.end_date }, m.querySelector(".dhx_form_repeat_pattern select").addEventListener("change", function() {
      (function(p) {
        const g = m.querySelector(".dhx_form_repeat_custom");
        p === "CUSTOM" ? c(g) : v(g);
      })(this.value);
    }), m.querySelector(".dhx_form_repeat_custom_interval [name='repeat_interval_unit']").addEventListener("change", function() {
      (function(p) {
        const g = { weekly: m.querySelector(".dhx_form_repeat_custom_week"), monthly: m.querySelector(".dhx_form_repeat_custom_month"), yearly: m.querySelector(".dhx_form_repeat_custom_year") };
        switch (p) {
          case "DAILY":
            v(g.weekly), v(g.monthly), v(g.yearly);
            break;
          case "WEEKLY":
            c(g.weekly), v(g.monthly), v(g.yearly);
            break;
          case "MONTHLY":
            v(g.weekly), c(g.monthly), v(g.yearly);
            break;
          case "YEARLY":
            v(g.weekly), v(g.monthly), c(g.yearly);
        }
      })(this.value);
    }), m.querySelector(".dhx_form_repeat_ends [name='dhx_custom_repeat_ends']").addEventListener("change", function() {
      (function(p) {
        const g = { after: m.querySelector(".dhx_form_repeat_ends_extra .dhx_form_repeat_ends_after"), on: m.querySelector(".dhx_form_repeat_ends_extra .dhx_form_repeat_ends_on") };
        switch (p) {
          case "NEVER":
            v(g.after), v(g.on);
            break;
          case "AFTER":
            c(g.after), v(g.on);
            break;
          case "ON":
            v(g.after), c(g.on);
        }
      })(this.value);
    }), e._lightbox._rec_init_done = !0;
  }, button_click: function() {
  }, set_value: function(m, f, u) {
    let v = e.form_blocks.recurring;
    e._lightbox._rec_init_done || v._init_set_value(m, f, u), m.open = !u.rrule, m.blocked = this._is_modified_occurence(u);
    let c = v._ds;
    if (c.start = u.start_date, c.end = u._end_date, u.rrule) {
      const p = at(u.rrule);
      h(m, p.origOptions, u);
      const g = function(b, x) {
        const k = b.options, w = k.until || x;
        return k.count || w && w.getFullYear() !== 9999 ? "CUSTOM" : k.freq !== z.DAILY || k.interval !== 1 || k.byweekday ? k.freq !== z.WEEKLY || k.interval !== 1 || k.byweekday ? k.freq !== z.MONTHLY || k.interval !== 1 || k.bysetpos ? k.freq !== z.YEARLY || k.interval !== 1 || k.bysetpos ? k.freq === z.DAILY && k.byweekday && k.byweekday.length === e.config.recurring_workdays.length && k.byweekday.includes(z.MO) && k.byweekday.includes(z.TU) && k.byweekday.includes(z.WE) && k.byweekday.includes(z.TH) && k.byweekday.includes(z.FR) ? "WORKDAYS" : "CUSTOM" : "YEARLY" : "MONTHLY" : "WEEKLY" : "DAILY";
      }(p, u._end_date);
      if (m.querySelector(".dhx_form_repeat_pattern select").value = g, g === "CUSTOM") {
        let b;
        switch (p.origOptions.freq) {
          case z.DAILY:
            b = "DAILY";
            break;
          case z.WEEKLY:
            b = "WEEKLY";
            break;
          case z.MONTHLY:
            b = "MONTHLY";
            break;
          case z.YEARLY:
            b = "YEARLY";
        }
        b && (m.querySelector('[name="repeat_interval_unit"]').value = b, m.querySelector('[name="repeat_interval_unit"]').dispatchEvent(new Event("change")));
      }
    } else
      h(m, null, u), m.querySelector(".dhx_form_repeat_pattern select").value = "NEVER";
    m.querySelector(".dhx_form_repeat_pattern select").dispatchEvent(new Event("change"));
  }, get_value: function(m, f) {
    if (m.blocked || m.querySelector(".dhx_form_repeat_pattern select").value === "NEVER")
      f.rrule = f.rrule = "", f._end_date = f.end_date;
    else {
      let u = e.form_blocks.recurring._ds, v = {};
      (function() {
        let g = e.formSection("time");
        if (g || (g = y("time")), g || (g = y("calendar_time")), !g)
          throw new Error(["Can't calculate the recurring rule, the Recurring form block can't find the Time control. Make sure you have the time control in 'scheduler.config.lightbox.sections' config.", "You can use either the default time control https://docs.dhtmlx.com/scheduler/time.html, or the datepicker https://docs.dhtmlx.com/scheduler/minicalendar.html, or a custom control. ", 'In the latter case, make sure the control is named "time":', "", "scheduler.config.lightbox.sections = [", '{name:"time", height:72, type:"YOU CONTROL", map_to:"auto" }];'].join(`
`));
        return g;
      })().getValue(v), u.start = v.start_date;
      const c = m.querySelector(".dhx_form_repeat_pattern select").value, p = l[c](u, m);
      f.rrule = new z(p.rrule).toString().replace("RRULE:", ""), u.end = p.until, f.duration = Math.floor((v.end_date - v.start_date) / 1e3), u._start ? (f.start_date = new Date(u.start), f._start_date = new Date(u.start), u._start = !1) : f._start_date = null, f._end_date = u.end;
    }
    return f.rrule;
  }, focus: function(m) {
  } };
}, recurring_legacy: function(e) {
  function i() {
    var r = e.formSection("recurring");
    if (r || (r = t("recurring")), !r)
      throw new Error(["Can't locate the Recurring form section.", "Make sure that you have the recurring control on the lightbox configuration https://docs.dhtmlx.com/scheduler/recurring_events.html#recurringlightbox ", 'and that the recurring control has name "recurring":', "", "scheduler.config.lightbox.sections = [", '	{name:"recurring", ... }', "];"].join(`
`));
    return r;
  }
  function t(r) {
    for (var _ = 0; _ < e.config.lightbox.sections.length; _++) {
      var d = e.config.lightbox.sections[_];
      if (d.type === r)
        return e.formSection(d.name);
    }
    return null;
  }
  function n(r) {
    return new Date(r.getFullYear(), r.getMonth(), r.getDate(), r.getHours(), r.getMinutes(), r.getSeconds(), 0);
  }
  var s;
  e.config.occurrence_timestamp_in_utc = !1, e.config.recurring_workdays = [1, 2, 3, 4, 5], e.form_blocks.recurring = { _get_node: function(r) {
    if (typeof r == "string") {
      let _ = e._lightbox.querySelector(`#${r}`);
      _ || (_ = document.getElementById(r)), r = _;
    }
    return r.style.display == "none" && (r.style.display = ""), r;
  }, _outer_html: function(r) {
    return r.outerHTML || (_ = r, (a = document.createElement("div")).appendChild(_.cloneNode(!0)), d = a.innerHTML, a = null, d);
    var _, d, a;
  }, render: function(r) {
    if (r.form) {
      var _ = e.form_blocks.recurring, d = _._get_node(r.form), a = _._outer_html(d);
      return d.style.display = "none", a;
    }
    var o = e.locale.labels;
    return '<div class="dhx_form_repeat"> <form> <div class="dhx_repeat_left"> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="day" />' + o.repeat_radio_day + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="week"/>' + o.repeat_radio_week + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="month" checked />' + o.repeat_radio_month + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="year" />' + o.repeat_radio_year + '</label></div> </div> <div class="dhx_repeat_divider"></div> <div class="dhx_repeat_center"> <div style="display:none;" id="dhx_repeat_day"> <div><label><input class="dhx_repeat_radio" type="radio" name="day_type" value="d"/>' + o.repeat_radio_day_type + '</label><label><input class="dhx_repeat_text" type="text" name="day_count" value="1" />' + o.repeat_text_day_count + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="day_type" checked value="w"/>' + o.repeat_radio_day_type2 + '</label></div> </div> <div style="display:none;" id="dhx_repeat_week"><div><label>' + o.repeat_week + '<input class="dhx_repeat_text" type="text" name="week_count" value="1" /></label><span>' + o.repeat_text_week_count + '</span></div>  <table class="dhx_repeat_days"> <tr> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="1" />' + o.day_for_recurring[1] + '</label></div> <div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="4" />' + o.day_for_recurring[4] + '</label></div></td> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="2" />' + o.day_for_recurring[2] + '</label></div> <div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="5" />' + o.day_for_recurring[5] + '</label></div></td> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="3" />' + o.day_for_recurring[3] + '</label></div> <div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="6" />' + o.day_for_recurring[6] + '</label></div></td> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="0" />' + o.day_for_recurring[0] + '</label></div> </td> </tr> </table> </div> <div id="dhx_repeat_month"> <div><label class = "dhx_repeat_month_label"><input class="dhx_repeat_radio" type="radio" name="month_type" value="d"/>' + o.repeat_radio_month_type + '</label><label><input class="dhx_repeat_text" type="text" name="month_day" value="1" />' + o.repeat_text_month_day + '</label><label><input class="dhx_repeat_text" type="text" name="month_count" value="1" />' + o.repeat_text_month_count + '</label></div> <div><label class = "dhx_repeat_month_label"><input class="dhx_repeat_radio" type="radio" name="month_type" checked value="w"/>' + o.repeat_radio_month_start + '</label><input class="dhx_repeat_text" type="text" name="month_week2" value="1" /><label><select name="month_day2">	<option value="1" selected >' + e.locale.date.day_full[1] + '<option value="2">' + e.locale.date.day_full[2] + '<option value="3">' + e.locale.date.day_full[3] + '<option value="4">' + e.locale.date.day_full[4] + '<option value="5">' + e.locale.date.day_full[5] + '<option value="6">' + e.locale.date.day_full[6] + '<option value="0">' + e.locale.date.day_full[0] + "</select>" + o.repeat_text_month_count2_before + '</label><label><input class="dhx_repeat_text" type="text" name="month_count2" value="1" />' + o.repeat_text_month_count2_after + '</label></div> </div> <div style="display:none;" id="dhx_repeat_year"> <div><label class = "dhx_repeat_year_label"><input class="dhx_repeat_radio" type="radio" name="year_type" value="d"/>' + o.repeat_radio_day_type + '</label><label><input class="dhx_repeat_text" type="text" name="year_day" value="1" />' + o.repeat_text_year_day + '</label><label><select name="year_month"><option value="0" selected >' + o.month_for_recurring[0] + '<option value="1">' + o.month_for_recurring[1] + '<option value="2">' + o.month_for_recurring[2] + '<option value="3">' + o.month_for_recurring[3] + '<option value="4">' + o.month_for_recurring[4] + '<option value="5">' + o.month_for_recurring[5] + '<option value="6">' + o.month_for_recurring[6] + '<option value="7">' + o.month_for_recurring[7] + '<option value="8">' + o.month_for_recurring[8] + '<option value="9">' + o.month_for_recurring[9] + '<option value="10">' + o.month_for_recurring[10] + '<option value="11">' + o.month_for_recurring[11] + "</select>" + o.select_year_month + '</label></div> <div><label class = "dhx_repeat_year_label"><input class="dhx_repeat_radio" type="radio" name="year_type" checked value="w"/>' + o.repeat_year_label + '</label><input class="dhx_repeat_text" type="text" name="year_week2" value="1" /><select name="year_day2"><option value="1" selected >' + e.locale.date.day_full[1] + '<option value="2">' + e.locale.date.day_full[2] + '<option value="3">' + e.locale.date.day_full[3] + '<option value="4">' + e.locale.date.day_full[4] + '<option value="5">' + e.locale.date.day_full[5] + '<option value="6">' + e.locale.date.day_full[6] + '<option value="7">' + e.locale.date.day_full[0] + "</select>" + o.select_year_day2 + '<select name="year_month2"><option value="0" selected >' + o.month_for_recurring[0] + '<option value="1">' + o.month_for_recurring[1] + '<option value="2">' + o.month_for_recurring[2] + '<option value="3">' + o.month_for_recurring[3] + '<option value="4">' + o.month_for_recurring[4] + '<option value="5">' + o.month_for_recurring[5] + '<option value="6">' + o.month_for_recurring[6] + '<option value="7">' + o.month_for_recurring[7] + '<option value="8">' + o.month_for_recurring[8] + '<option value="9">' + o.month_for_recurring[9] + '<option value="10">' + o.month_for_recurring[10] + '<option value="11">' + o.month_for_recurring[11] + '</select></div> </div> </div> <div class="dhx_repeat_divider"></div> <div class="dhx_repeat_right"> <div><label><input class="dhx_repeat_radio" type="radio" name="end" checked/>' + o.repeat_radio_end + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="end" />' + o.repeat_radio_end2 + '</label><input class="dhx_repeat_text" type="text" name="occurences_count" value="1" />' + o.repeat_text_occurences_count + '</div> <div><label><input class="dhx_repeat_radio" type="radio" name="end" />' + o.repeat_radio_end3 + '</label><input class="dhx_repeat_date" type="text" name="date_of_end" value="' + e.config.repeat_date_of_end + '" /></div> </div> </form> </div> </div>';
  }, _ds: {}, _get_form_node: function(r, _, d) {
    var a = r[_];
    if (!a)
      return null;
    if (a.nodeName)
      return a;
    if (a.length) {
      for (var o = 0; o < a.length; o++)
        if (a[o].value == d)
          return a[o];
    }
  }, _get_node_value: function(r, _, d) {
    var a = r[_];
    if (!a)
      return "";
    if (a.length) {
      if (d) {
        for (var o = [], l = 0; l < a.length; l++)
          a[l].checked && o.push(a[l].value);
        return o;
      }
      for (l = 0; l < a.length; l++)
        if (a[l].checked)
          return a[l].value;
    }
    return a.value ? d ? [a.value] : a.value : void 0;
  }, _get_node_numeric_value: function(r, _) {
    return 1 * e.form_blocks.recurring._get_node_value(r, _) || 0;
  }, _set_node_value: function(r, _, d) {
    var a = r[_];
    if (a) {
      if (a.name == _)
        a.value = d;
      else if (a.length)
        for (var o = typeof d == "object", l = 0; l < a.length; l++)
          (o || a[l].value == d) && (a[l].checked = o ? !!d[a[l].value] : !!d);
    }
  }, _init_set_value: function(r, _, d) {
    var a = e.form_blocks.recurring, o = a._get_node_value, l = a._set_node_value;
    e.form_blocks.recurring._ds = { start: d.start_date, end: d._end_date };
    var h = e.date.str_to_date(e.config.repeat_date, !1, !0), y = e.date.date_to_str(e.config.repeat_date), m = r.getElementsByTagName("FORM")[0], f = {};
    function u(E) {
      for (var D = 0; D < E.length; D++) {
        var S = E[D];
        if (S.name)
          if (f[S.name])
            if (f[S.name].nodeType) {
              var M = f[S.name];
              f[S.name] = [M, S];
            } else
              f[S.name].push(S);
          else
            f[S.name] = S;
      }
    }
    if (u(m.getElementsByTagName("INPUT")), u(m.getElementsByTagName("SELECT")), !e.config.repeat_date_of_end) {
      var v = e.date.date_to_str(e.config.repeat_date);
      e.config.repeat_date_of_end = v(e.date.add(e._currentDate(), 30, "day"));
    }
    l(f, "date_of_end", e.config.repeat_date_of_end);
    var c = function(E) {
      return e._lightbox.querySelector(`#${E}`) || { style: {} };
    };
    function p() {
      c("dhx_repeat_day").style.display = "none", c("dhx_repeat_week").style.display = "none", c("dhx_repeat_month").style.display = "none", c("dhx_repeat_year").style.display = "none", c("dhx_repeat_" + this.value).style.display = "", e.setLightboxSize();
    }
    function g(E, D) {
      var S = E.end;
      if (S.length)
        if (S[0].value && S[0].value != "on")
          for (var M = 0; M < S.length; M++)
            S[M].value == D && (S[M].checked = !0);
        else {
          var N = 0;
          switch (D) {
            case "no":
              N = 0;
              break;
            case "date_of_end":
              N = 2;
              break;
            default:
              N = 1;
          }
          S[N].checked = !0;
        }
      else
        S.value = D;
    }
    e.form_blocks.recurring._get_repeat_code = function(E) {
      var D = [o(f, "repeat")];
      for (b[D[0]](D, E); D.length < 5; )
        D.push("");
      var S = "", M = function(N) {
        var T = N.end;
        if (T.length) {
          for (var A = 0; A < T.length; A++)
            if (T[A].checked)
              return T[A].value && T[A].value != "on" ? T[A].value : A ? A == 2 ? "date_of_end" : "occurences_count" : "no";
        } else if (T.value)
          return T.value;
        return "no";
      }(f);
      return M == "no" ? (E.end = new Date(9999, 1, 1), S = "no") : M == "date_of_end" ? E.end = function(N) {
        var T = h(N);
        return e.config.include_end_by && (T = e.date.add(T, 1, "day")), T;
      }(o(f, "date_of_end")) : (e.transpose_type(D.join("_")), S = Math.max(1, o(f, "occurences_count")), E.end = e.date["add_" + D.join("_")](new Date(E.start), S + 0, { start_date: E.start }) || E.start), D.join("_") + "#" + S;
    };
    var b = { month: function(E, D) {
      var S = e.form_blocks.recurring._get_node_value, M = e.form_blocks.recurring._get_node_numeric_value;
      S(f, "month_type") == "d" ? (E.push(Math.max(1, M(f, "month_count"))), D.start.setDate(S(f, "month_day"))) : (E.push(Math.max(1, M(f, "month_count2"))), E.push(S(f, "month_day2")), E.push(Math.max(1, M(f, "month_week2"))), e.config.repeat_precise || D.start.setDate(1)), D._start = !0;
    }, week: function(E, D) {
      var S = e.form_blocks.recurring._get_node_value, M = e.form_blocks.recurring._get_node_numeric_value;
      E.push(Math.max(1, M(f, "week_count"))), E.push(""), E.push("");
      for (var N = [], T = S(f, "week_day", !0), A = D.start.getDay(), C = !1, H = 0; H < T.length; H++)
        N.push(T[H]), C = C || T[H] == A;
      N.length || (N.push(A), C = !0), N.sort(), e.config.repeat_precise ? C || (e.transpose_day_week(D.start, N, 1, 7), D._start = !0) : (D.start = e.date.week_start(D.start), D._start = !0), E.push(N.join(","));
    }, day: function(E) {
      var D = e.form_blocks.recurring._get_node_value, S = e.form_blocks.recurring._get_node_numeric_value;
      D(f, "day_type") == "d" ? E.push(Math.max(1, S(f, "day_count"))) : (E.push("week"), E.push(1), E.push(""), E.push(""), E.push(e.config.recurring_workdays.join(",")), E.splice(0, 1));
    }, year: function(E, D) {
      var S = e.form_blocks.recurring._get_node_value;
      S(f, "year_type") == "d" ? (E.push("1"), D.start.setMonth(0), D.start.setDate(S(f, "year_day")), D.start.setMonth(S(f, "year_month"))) : (E.push("1"), E.push(S(f, "year_day2")), E.push(S(f, "year_week2")), D.start.setDate(1), D.start.setMonth(S(f, "year_month2"))), D._start = !0;
    } }, x = { week: function(E, D) {
      var S = e.form_blocks.recurring._set_node_value;
      S(f, "week_count", E[1]);
      for (var M = E[4].split(","), N = {}, T = 0; T < M.length; T++)
        N[M[T]] = !0;
      S(f, "week_day", N);
    }, month: function(E, D) {
      var S = e.form_blocks.recurring._set_node_value;
      E[2] === "" ? (S(f, "month_type", "d"), S(f, "month_count", E[1]), S(f, "month_day", D.start.getDate())) : (S(f, "month_type", "w"), S(f, "month_count2", E[1]), S(f, "month_week2", E[3]), S(f, "month_day2", E[2]));
    }, day: function(E, D) {
      var S = e.form_blocks.recurring._set_node_value;
      S(f, "day_type", "d"), S(f, "day_count", E[1]);
    }, year: function(E, D) {
      var S = e.form_blocks.recurring._set_node_value;
      E[2] === "" ? (S(f, "year_type", "d"), S(f, "year_day", D.start.getDate()), S(f, "year_month", D.start.getMonth())) : (S(f, "year_type", "w"), S(f, "year_week2", E[3]), S(f, "year_day2", E[2]), S(f, "year_month2", D.start.getMonth()));
    } };
    e.form_blocks.recurring._set_repeat_code = function(E, D) {
      var S = e.form_blocks.recurring._set_node_value, M = E.split("#");
      switch (E = M[0].split("_"), x[E[0]](E, D), M[1]) {
        case "no":
          g(f, "no");
          break;
        case "":
          g(f, "date_of_end");
          var N = D.end;
          e.config.include_end_by && (N = e.date.add(N, -1, "day")), S(f, "date_of_end", y(N));
          break;
        default:
          g(f, "occurences_count"), S(f, "occurences_count", M[1]);
      }
      S(f, "repeat", E[0]);
      var T = e.form_blocks.recurring._get_form_node(f, "repeat", E[0]);
      T.nodeName == "SELECT" ? (T.dispatchEvent(new Event("change")), T.dispatchEvent(new MouseEvent("click"))) : T.dispatchEvent(new MouseEvent("click"));
    };
    for (var k = 0; k < m.elements.length; k++) {
      var w = m.elements[k];
      w.name === "repeat" && (w.nodeName != "SELECT" || w.$_eventAttached ? w.$_eventAttached || (w.$_eventAttached = !0, w.addEventListener("click", p)) : (w.$_eventAttached = !0, w.addEventListener("change", p)));
    }
    e._lightbox._rec_init_done = !0;
  }, set_value: function(r, _, d) {
    var a = e.form_blocks.recurring;
    e._lightbox._rec_init_done || a._init_set_value(r, _, d), r.open = !d.rec_type, r.blocked = this._is_modified_occurence(d);
    var o = a._ds;
    o.start = d.start_date, o.end = d._end_date, a._toggle_block(), _ && a._set_repeat_code(_, o);
  }, get_value: function(r, _) {
    if (r.open) {
      var d = e.form_blocks.recurring._ds, a = {};
      (function() {
        var o = e.formSection("time");
        if (o || (o = t("time")), o || (o = t("calendar_time")), !o)
          throw new Error(["Can't calculate the recurring rule, the Recurring form block can't find the Time control. Make sure you have the time control in 'scheduler.config.lightbox.sections' config.", "You can use either the default time control https://docs.dhtmlx.com/scheduler/time.html, or the datepicker https://docs.dhtmlx.com/scheduler/minicalendar.html, or a custom control. ", 'In the latter case, make sure the control is named "time":', "", "scheduler.config.lightbox.sections = [", '{name:"time", height:72, type:"YOU CONTROL", map_to:"auto" }];'].join(`
`));
        return o;
      })().getValue(a), d.start = a.start_date, _.rec_type = e.form_blocks.recurring._get_repeat_code(d), d._start ? (_.start_date = new Date(d.start), _._start_date = new Date(d.start), d._start = !1) : _._start_date = null, _._end_date = d.end, _.rec_pattern = _.rec_type.split("#")[0];
    } else
      _.rec_type = _.rec_pattern = "", _._end_date = _.end_date;
    return _.rec_type;
  }, _get_button: function() {
    return i().header.firstChild.firstChild;
  }, _get_form: function() {
    return i().node;
  }, open: function() {
    var r = e.form_blocks.recurring;
    r._get_form().open || r._toggle_block();
  }, close: function() {
    var r = e.form_blocks.recurring;
    r._get_form().open && r._toggle_block();
  }, _toggle_block: function() {
    var r = e.form_blocks.recurring, _ = r._get_form(), d = r._get_button();
    _.open || _.blocked ? (_.style.height = "0px", d && (d.style.backgroundPosition = "-5px 20px", d.nextSibling.innerHTML = e.locale.labels.button_recurring)) : (_.style.height = "auto", d && (d.style.backgroundPosition = "-5px 0px", d.nextSibling.innerHTML = e.locale.labels.button_recurring_open)), _.open = !_.open, e.setLightboxSize();
  }, focus: function(r) {
  }, button_click: function(r, _, d) {
    e.form_blocks.recurring._get_form().blocked || e.form_blocks.recurring._toggle_block();
  } }, e._rec_markers = {}, e._rec_markers_pull = {}, e._add_rec_marker = function(r, _) {
    r._pid_time = _, this._rec_markers[r.id] = r, this._rec_markers_pull[r.event_pid] || (this._rec_markers_pull[r.event_pid] = {}), this._rec_markers_pull[r.event_pid][_] = r;
  }, e._get_rec_marker = function(r, _) {
    var d = this._rec_markers_pull[_];
    return d ? d[r] : null;
  }, e._get_rec_markers = function(r) {
    return this._rec_markers_pull[r] || [];
  }, e._rec_temp = [], s = e.addEvent, e.addEvent = function(r, _, d, a, o) {
    var l = s.apply(this, arguments);
    if (l && e.getEvent(l)) {
      var h = e.getEvent(l);
      h.start_date && (h.start_date = n(h.start_date)), h.end_date && (h.end_date = n(h.end_date)), this._is_modified_occurence(h) && e._add_rec_marker(h, 1e3 * h.event_length), h.rec_type && (h.rec_pattern = h.rec_type.split("#")[0]);
    }
    return l;
  }, e.attachEvent("onEventIdChange", function(r, _) {
    if (!this._ignore_call) {
      this._ignore_call = !0, e._rec_markers[r] && (e._rec_markers[_] = e._rec_markers[r], delete e._rec_markers[r]), e._rec_markers_pull[r] && (e._rec_markers_pull[_] = e._rec_markers_pull[r], delete e._rec_markers_pull[r]);
      for (var d = 0; d < this._rec_temp.length; d++)
        (a = this._rec_temp[d]).event_pid == r && (a.event_pid = _, this.changeEventId(a.id, _ + "#" + a.id.split("#")[1]));
      for (var d in this._rec_markers) {
        var a;
        (a = this._rec_markers[d]).event_pid == r && (a.event_pid = _, a._pid_changed = !0);
      }
      var o = e._rec_markers[_];
      o && o._pid_changed && (delete o._pid_changed, setTimeout(function() {
        if (e.$destroyed)
          return !0;
        e.callEvent("onEventChanged", [_, e.getEvent(_)]);
      }, 1)), delete this._ignore_call;
    }
  }), e.attachEvent("onConfirmedBeforeEventDelete", function(r) {
    var _ = this.getEvent(r);
    if (this._is_virtual_event(r) || this._is_modified_occurence(_) && _.rec_type && _.rec_type != "none") {
      r = r.split("#");
      var d = this.uid(), a = r[1] ? r[1] : Math.round(_._pid_time / 1e3), o = this._copy_event(_);
      o.id = d, o.event_pid = _.event_pid || r[0];
      var l = a;
      o.event_length = l, o.rec_type = o.rec_pattern = "none", this.addEvent(o), this._add_rec_marker(o, 1e3 * l);
    } else {
      _.rec_type && this._lightbox_id && this._roll_back_dates(_);
      var h = this._get_rec_markers(r);
      for (var y in h)
        h.hasOwnProperty(y) && (r = h[y].id, this.getEvent(r) && this.deleteEvent(r, !0));
    }
    return !0;
  }), e.attachEvent("onEventDeleted", function(r, _) {
    !this._is_virtual_event(r) && this._is_modified_occurence(_) && (e._events[r] || (_.rec_type = _.rec_pattern = "none", this.setEvent(r, _)));
  }), e.attachEvent("onEventChanged", function(r, _) {
    if (this._loading)
      return !0;
    var d = this.getEvent(r);
    if (this._is_virtual_event(r)) {
      r = r.split("#");
      var a = this.uid();
      this._not_render = !0;
      var o = this._copy_event(_);
      o.id = a, o.event_pid = r[0];
      var l = r[1];
      o.event_length = l, o.rec_type = o.rec_pattern = "", this._add_rec_marker(o, 1e3 * l), this.addEvent(o), this._not_render = !1;
    } else {
      d.start_date && (d.start_date = n(d.start_date)), d.end_date && (d.end_date = n(d.end_date)), d.rec_type && this._lightbox_id && this._roll_back_dates(d);
      var h = this._get_rec_markers(r);
      for (var y in h)
        h.hasOwnProperty(y) && (delete this._rec_markers[h[y].id], this.deleteEvent(h[y].id, !0));
      delete this._rec_markers_pull[r];
      for (var m = !1, f = 0; f < this._rendered.length; f++)
        this._rendered[f].getAttribute(this.config.event_attribute) == r && (m = !0);
      m || (this._select_id = null);
    }
    return !0;
  }), e.attachEvent("onEventAdded", function(r) {
    if (!this._loading) {
      var _ = this.getEvent(r);
      _.rec_type && !_.event_length && this._roll_back_dates(_);
    }
    return !0;
  }), e.attachEvent("onEventSave", function(r, _, d) {
    return this.getEvent(r).rec_type || !_.rec_type || this._is_virtual_event(r) || (this._select_id = null), !0;
  }), e.attachEvent("onEventCreated", function(r) {
    var _ = this.getEvent(r);
    return _.rec_type || (_.rec_type = _.rec_pattern = _.event_length = _.event_pid = ""), !0;
  }), e.attachEvent("onEventCancel", function(r) {
    var _ = this.getEvent(r);
    _.rec_type && (this._roll_back_dates(_), this.render_view_data());
  }), e._roll_back_dates = function(r) {
    r.start_date && (r.start_date = n(r.start_date)), r.end_date && (r.end_date = n(r.end_date)), r.event_length = Math.round((r.end_date.valueOf() - r.start_date.valueOf()) / 1e3), r.end_date = r._end_date, r._start_date && (r.start_date.setMonth(0), r.start_date.setDate(r._start_date.getDate()), r.start_date.setMonth(r._start_date.getMonth()), r.start_date.setFullYear(r._start_date.getFullYear()));
  }, e._is_virtual_event = function(r) {
    return r.toString().indexOf("#") != -1;
  }, e._is_modified_occurence = function(r) {
    return r.event_pid && r.event_pid != "0";
  }, e.showLightbox_rec = e.showLightbox, e.showLightbox = function(r) {
    var _ = this.locale, d = e.config.lightbox_recurring, a = this.getEvent(r), o = a.event_pid, l = this._is_virtual_event(r);
    l && (o = r.split("#")[0]);
    var h = function(m) {
      var f = e.getEvent(m);
      return f._end_date = f.end_date, f.end_date = new Date(f.start_date.valueOf() + 1e3 * f.event_length), e.showLightbox_rec(m);
    };
    if ((o || 1 * o == 0) && a.rec_type)
      return h(r);
    if (!o || o === "0" || !_.labels.confirm_recurring || d == "instance" || d == "series" && !l)
      return this.showLightbox_rec(r);
    if (d == "ask") {
      var y = this;
      e.modalbox({ text: _.labels.confirm_recurring, title: _.labels.title_confirm_recurring, width: "500px", position: "middle", buttons: [_.labels.button_edit_series, _.labels.button_edit_occurrence, _.labels.icon_cancel], callback: function(m) {
        switch (+m) {
          case 0:
            return h(o);
          case 1:
            return y.showLightbox_rec(r);
          case 2:
            return;
        }
      } });
    } else
      h(o);
  }, e.get_visible_events_rec = e.get_visible_events, e.get_visible_events = function(r) {
    for (var _ = 0; _ < this._rec_temp.length; _++)
      delete this._events[this._rec_temp[_].id];
    this._rec_temp = [];
    var d = this.get_visible_events_rec(r), a = [];
    for (_ = 0; _ < d.length; _++)
      d[_].rec_type ? d[_].rec_pattern != "none" && this.repeat_date(d[_], a) : a.push(d[_]);
    return a;
  }, function() {
    var r = e.isOneDayEvent;
    e.isOneDayEvent = function(d) {
      return !!d.rec_type || r.call(this, d);
    };
    var _ = e.updateEvent;
    e.updateEvent = function(d) {
      var a = e.getEvent(d);
      a && a.rec_type && (a.rec_pattern = (a.rec_type || "").split("#")[0]), a && a.rec_type && !this._is_virtual_event(d) ? e.update_view() : _.call(this, d);
    };
  }(), e.transponse_size = { day: 1, week: 7, month: 1, year: 12 }, e.date.day_week = function(r, _, d) {
    r.setDate(1);
    var a = e.date.month_start(new Date(r)), o = 1 * _ + (d = 7 * (d - 1)) - r.getDay() + 1;
    r.setDate(o <= d ? o + 7 : o);
    var l = e.date.month_start(new Date(r));
    return a.valueOf() === l.valueOf();
  }, e.transpose_day_week = function(r, _, d, a, o) {
    for (var l = (r.getDay() || (e.config.start_on_monday ? 7 : 0)) - d, h = 0; h < _.length; h++)
      if (_[h] > l)
        return r.setDate(r.getDate() + 1 * _[h] - l - (a ? d : o));
    this.transpose_day_week(r, _, d + a, null, d);
  }, e.transpose_type = function(r) {
    var _ = "transpose_" + r;
    if (!this.date[_]) {
      var d = r.split("_"), a = "add_" + r, o = this.transponse_size[d[0]] * d[1];
      if (d[0] == "day" || d[0] == "week") {
        var l = null;
        if (d[4] && (l = d[4].split(","), e.config.start_on_monday)) {
          for (var h = 0; h < l.length; h++)
            l[h] = 1 * l[h] || 7;
          l.sort();
        }
        this.date[_] = function(y, m) {
          var f = Math.floor((m.valueOf() - y.valueOf()) / (864e5 * o));
          return f > 0 && y.setDate(y.getDate() + f * o), l && e.transpose_day_week(y, l, 1, o), y;
        }, this.date[a] = function(y, m) {
          var f = new Date(y.valueOf());
          if (l)
            for (var u = 0; u < m; u++)
              e.transpose_day_week(f, l, 0, o);
          else
            f.setDate(f.getDate() + m * o);
          return f;
        };
      } else
        d[0] != "month" && d[0] != "year" || (this.date[_] = function(y, m, f) {
          var u = Math.ceil((12 * m.getFullYear() + 1 * m.getMonth() + 1 - (12 * y.getFullYear() + 1 * y.getMonth() + 1)) / o - 1);
          return u >= 0 && (y.setDate(1), y.setMonth(y.getMonth() + u * o)), e.date[a](y, 0, f);
        }, this.date[a] = function(y, m, f, u) {
          if (u ? u++ : u = 1, u > 12)
            return null;
          var v = new Date(y.valueOf());
          v.setDate(1), v.setMonth(v.getMonth() + m * o);
          var c = v.getMonth(), p = v.getFullYear();
          v.setDate(f.start_date.getDate()), d[3] && e.date.day_week(v, d[2], d[3]);
          var g = e.config.recurring_overflow_instances;
          return v.getMonth() != c && g != "none" && (v = g === "lastDay" ? new Date(p, c + 1, 0, v.getHours(), v.getMinutes(), v.getSeconds(), v.getMilliseconds()) : e.date[a](new Date(p, c + 1, 0), m || 1, f, u)), v;
        });
    }
  }, e.repeat_date = function(r, _, d, a, o, l) {
    a = a || this._min_date, o = o || this._max_date;
    var h = l || -1, y = new Date(r.start_date.valueOf()), m = y.getHours(), f = 0;
    for (!r.rec_pattern && r.rec_type && (r.rec_pattern = r.rec_type.split("#")[0]), this.transpose_type(r.rec_pattern), y = e.date["transpose_" + r.rec_pattern](y, a, r); y && (y < r.start_date || e._fix_daylight_saving_date(y, a, r, y, new Date(y.valueOf() + 1e3 * r.event_length)).valueOf() <= a.valueOf() || y.valueOf() + 1e3 * r.event_length <= a.valueOf()); )
      y = this.date["add_" + r.rec_pattern](y, 1, r);
    for (; y && y < o && y < r.end_date && (h < 0 || f < h); ) {
      y.setHours(m);
      var u = e.config.occurrence_timestamp_in_utc ? Date.UTC(y.getFullYear(), y.getMonth(), y.getDate(), y.getHours(), y.getMinutes(), y.getSeconds()) : y.valueOf(), v = this._get_rec_marker(u, r.id);
      if (v)
        d && (v.rec_type != "none" && f++, _.push(v));
      else {
        var c = new Date(y.valueOf() + 1e3 * r.event_length), p = this._copy_event(r);
        if (p.text = r.text, p.start_date = y, p.event_pid = r.id, p.id = r.id + "#" + Math.round(u / 1e3), p.end_date = c, p.end_date = e._fix_daylight_saving_date(p.start_date, p.end_date, r, y, p.end_date), p._timed = this.isOneDayEvent(p), !p._timed && !this._table_view && !this.config.multi_day)
          return;
        _.push(p), d || (this._events[p.id] = p, this._rec_temp.push(p)), f++;
      }
      y = this.date["add_" + r.rec_pattern](y, 1, r);
    }
  }, e._fix_daylight_saving_date = function(r, _, d, a, o) {
    var l = r.getTimezoneOffset() - _.getTimezoneOffset();
    return l ? l > 0 ? new Date(a.valueOf() + 1e3 * d.event_length - 60 * l * 1e3) : new Date(_.valueOf() - 60 * l * 1e3) : new Date(o.valueOf());
  }, e.getRecDates = function(r, _) {
    var d = typeof r == "object" ? r : e.getEvent(r), a = [];
    if (_ = _ || 100, !d.rec_type)
      return [{ start_date: d.start_date, end_date: d.end_date }];
    if (d.rec_type == "none")
      return [];
    e.repeat_date(d, a, !0, d.start_date, d.end_date, _);
    for (var o = [], l = 0; l < a.length; l++)
      a[l].rec_type != "none" && o.push({ start_date: a[l].start_date, end_date: a[l].end_date });
    return o;
  }, e.getEvents = function(r, _) {
    var d = [];
    for (var a in this._events) {
      var o = this._events[a];
      if (o && o.start_date < _ && o.end_date > r)
        if (o.rec_pattern) {
          if (o.rec_pattern == "none")
            continue;
          var l = [];
          this.repeat_date(o, l, !0, r, _);
          for (var h = 0; h < l.length; h++)
            !l[h].rec_pattern && l[h].start_date < _ && l[h].end_date > r && !this._rec_markers[l[h].id] && d.push(l[h]);
        } else
          this._is_virtual_event(o.id) || d.push(o);
    }
    return d;
  }, e.config.repeat_date = "%m.%d.%Y", e.config.lightbox.sections = [{ name: "description", map_to: "text", type: "textarea", focus: !0 }, { name: "recurring", type: "recurring", map_to: "rec_type", button: "recurring" }, { name: "time", height: 72, type: "time", map_to: "auto" }], e._copy_dummy = function(r) {
    var _ = new Date(this.start_date), d = new Date(this.end_date);
    this.start_date = _, this.end_date = d, this.event_length = this.event_pid = this.rec_pattern = this.rec_type = null;
  }, e.config.include_end_by = !1, e.config.lightbox_recurring = "ask", e.attachEvent("onClearAll", function() {
    e._rec_markers = {}, e._rec_markers_pull = {}, e._rec_temp = [];
  });
}, serialize: function(e) {
  const i = Zt(e);
  e.data_attributes = function() {
    var t = [], n = e._helpers.formatDate, s = i();
    for (var r in s) {
      var _ = s[r];
      for (var d in _)
        d.substr(0, 1) != "_" && t.push([d, d == "start_date" || d == "end_date" ? n : null]);
      break;
    }
    return t;
  }, e.toXML = function(t) {
    var n = [], s = this.data_attributes(), r = i();
    for (var _ in r) {
      var d = r[_];
      n.push("<event>");
      for (var a = 0; a < s.length; a++)
        n.push("<" + s[a][0] + "><![CDATA[" + (s[a][1] ? s[a][1](d[s[a][0]]) : d[s[a][0]]) + "]]></" + s[a][0] + ">");
      n.push("</event>");
    }
    return (t || "") + "<data>" + n.join(`
`) + "</data>";
  }, e._serialize_json_value = function(t) {
    return t === null || typeof t == "boolean" ? t = "" + t : (t || t === 0 || (t = ""), t = '"' + t.toString().replace(/\n/g, "").replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"'), t;
  }, e.toJSON = function() {
    return JSON.stringify(this.serialize());
  }, e.toICal = function(t) {
    var n = e.date.date_to_str("%Y%m%dT%H%i%s"), s = e.date.date_to_str("%Y%m%d"), r = [], _ = i();
    for (var d in _) {
      var a = _[d];
      r.push("BEGIN:VEVENT"), a._timed && (a.start_date.getHours() || a.start_date.getMinutes()) ? r.push("DTSTART:" + n(a.start_date)) : r.push("DTSTART:" + s(a.start_date)), a._timed && (a.end_date.getHours() || a.end_date.getMinutes()) ? r.push("DTEND:" + n(a.end_date)) : r.push("DTEND:" + s(a.end_date)), r.push("SUMMARY:" + a.text), r.push("END:VEVENT");
    }
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//dhtmlXScheduler//NONSGML v2.2//EN
DESCRIPTION:` + (t || "") + `
` + r.join(`
`) + `
END:VCALENDAR`;
  };
}, timeline: function(e) {
  function i() {
    var t = document.createElement("p");
    t.style.width = "100%", t.style.height = "200px";
    var n = document.createElement("div");
    n.style.position = "absolute", n.style.top = "0px", n.style.left = "0px", n.style.visibility = "hidden", n.style.width = "200px", n.style.height = "150px", n.style.overflow = "hidden", n.appendChild(t), document.body.appendChild(n);
    var s = t.offsetWidth;
    n.style.overflow = "scroll";
    var r = t.offsetWidth;
    return s == r && (r = n.clientWidth), document.body.removeChild(n), s - r;
  }
  e.ext.timeline = { renderCells: function(t, n, s) {
    if (!t || !t.length)
      return;
    const r = [];
    for (let _ = 0; _ < t.length; _++) {
      const d = t[_];
      let a = "";
      d.$width && (a = "width:" + d.$width + "px;");
      let o = s;
      d.css && (o += " " + d.css), _ === 0 && (o += " " + s + "_first"), _ === t.length - 1 && (o += " " + s + "_last");
      const l = n(d) || "";
      r.push(`<div class='${o}' style='${a}'><div class='dhx_timeline_label_content_wrapper'>${l}</div></div>`);
    }
    return r.join("");
  }, renderHeading: function() {
    return this.renderCells(this.columns, function(t) {
      return t.label;
    }, "dhx_timeline_label_column dhx_timeline_label_column_header");
  }, renderColumns: function(t) {
    return this.renderCells(this.columns, function(n) {
      return n.template && n.template.call(self, t) || "";
    }, "dhx_timeline_label_column");
  }, scrollTo: function(t) {
    if (t) {
      var n;
      n = t.date ? t.date : t.left ? t.left : t;
      var s, r = -1;
      if (t.section ? r = this.getSectionTop(t.section) : t.top && (r = t.top), s = typeof n == "number" ? n : this.posFromDate(n), e.config.rtl) {
        var _ = +e.$container.querySelector(".dhx_timeline_label_wrapper").style.height.replace("px", ""), d = this._section_height[this.y_unit.length] + this._label_rows[this._label_rows.length - 1].top;
        this.scrollHelper.getMode() == this.scrollHelper.modes.minMax && (d > _ || this.render == "tree") && (s -= i());
      }
      var a = e.$container.querySelector(".dhx_timeline_data_wrapper");
      this.scrollable || (a = e.$container.querySelector(".dhx_cal_data")), this.scrollable && this.scrollHelper.setScrollValue(a, s), r > 0 && (a.scrollTop = r);
    }
  }, getScrollPosition: function() {
    return { left: this._x_scroll || 0, top: this._y_scroll || 0 };
  }, posFromDate: function(t) {
    return e._timeline_getX({ start_date: t }, !1, this) - 1;
  }, dateFromPos: function(t) {
    return e._timeline_drag_date(this, t);
  }, sectionFromPos: function(t) {
    var n = { y: t };
    return e._resolve_timeline_section(this, n), n.section;
  }, resolvePosition: function(t) {
    var n = { date: null, section: null };
    return t.left && (n.date = this.dateFromPos(t.left)), t.top && (n.section = this.sectionFromPos(t.top)), n;
  }, getSectionHeight: function(t) {
    return this._section_height[t];
  }, getSectionTop: function(t) {
    return this._rowStats[t].top;
  }, getEventTop: function(t) {
    var n = this.getEventHeight(t), s = t._sorder || 0, r = 1 + s * (n - 3) + (s ? 2 * s : 0);
    return e.config.cascade_event_display && (r = 1 + s * e.config.cascade_event_margin + (s ? 2 * s : 0)), r;
  }, getEventHeight: function(t) {
    var n = this, s = t[n.y_property], r = n.event_dy;
    const _ = n.order[s];
    return n.event_dy == "full" && (n.section_autoheight ? (e._timeline_get_cur_row_stats(this, _), r = n.getSectionHeight(s) - 6) : r = n.dy - 3), n.resize_events && (r = Math.max(Math.floor(r / (t._count || 1)), n.event_min_dy)), r;
  } }, e._temp_matrix_scope = function() {
    function t(c, p) {
      if (p = p || [], c.children)
        for (var g = 0; g < c.children.length; g++)
          p.push(c.children[g].key), t(c.children[g], p);
      return p;
    }
    function n(c, p) {
      var g = p.order[c];
      return g === void 0 && (g = "$_" + c), g;
    }
    function s(c, p) {
      if (p[c.key] = c, c.children)
        for (var g = 0; g < c.children.length; g++)
          s(c.children[g], p);
    }
    function r(c, p) {
      for (var g, b = [], x = 0; x < p.y_unit.length; x++)
        b[x] = [];
      b[g] || (b[g] = []);
      var k = function(O) {
        for (var $ = {}, R = O.y_unit_original || O.y_unit, j = 0; j < R.length; j++)
          s(R[j], $);
        return $;
      }(p), w = p.render == "tree";
      function E(O, $, R, j) {
        O[$] || (O[$] = []);
        for (var I = R; I <= j; I++)
          O[$][I] || (O[$][I] = []), O[$][I].push(S);
      }
      w && (b.$tree = {});
      var D = p.y_property;
      for (x = 0; x < c.length; x++) {
        var S = c[x], M = S[D];
        g = n(M, p);
        var N = e._get_date_index(p, S.start_date), T = e._get_date_index(p, S.end_date);
        S.end_date.valueOf() == p._trace_x[T].valueOf() && (T -= 1), b[g] || (b[g] = []), E(b, g, N, T);
        var A = k[M];
        if (w && A && A.$parent)
          for (var C = {}; A.$parent; ) {
            if (C[A.key])
              throw new Error("Invalid sections tree. Section `{key:'" + A.key + "', label:'" + A.label + "'}` has the same key as one of its parents. Make sure all sections have unique keys");
            C[A.key] = !0;
            var H = k[A.$parent];
            E(b.$tree, H.key, N, T), A = H;
          }
      }
      return b;
    }
    e.matrix = {}, e._merge = function(c, p) {
      for (var g in p)
        c[g] === void 0 && (c[g] = p[g]);
    }, e.createTimelineView = function(c) {
      e._merge(c, { scrollHelper: nr(), column_width: 100, autoscroll: { range_x: 200, range_y: 100, speed_x: 20, speed_y: 10 }, _is_new_view: !0, _section_autowidth: !0, _x_scroll: 0, _y_scroll: 0, _h_cols: {}, _label_rows: [], section_autoheight: !0, layout: "timeline", name: "matrix", x: "time", y: "time", x_step: 1, x_unit: "hour", y_unit: "day", y_step: 1, x_start: 0, x_size: 24, y_start: 0, y_size: 7, x_date: e.config.hour_date, render: "cell", dx: 200, dy: 50, event_dy: e.xy.bar_height, event_min_dy: e.xy.bar_height, resize_events: !0, fit_events: !0, fit_events_offset: 0, show_unassigned: !1, second_scale: !1, round_position: !1, _logic: function(w, E, D) {
        var S = {};
        return e.checkEvent("onBeforeSectionRender") && (S = e.callEvent("onBeforeSectionRender", [w, E, D])), S;
      } }), c._original_x_start = c.x_start, c.x_unit != "day" && (c.first_hour = c.last_hour = 0), c._start_correction = c.first_hour ? 60 * c.first_hour * 60 * 1e3 : 0, c._end_correction = c.last_hour ? 60 * (24 - c.last_hour) * 60 * 1e3 : 0, e.checkEvent("onTimelineCreated") && e.callEvent("onTimelineCreated", [c]), nt(c), e.attachEvent("onDestroy", function() {
        c.detachAllEvents();
      });
      var p = e.render_data;
      e.render_data = function(w, E) {
        if (this._mode != c.name)
          return p.apply(this, arguments);
        if (!E || c.show_unassigned && !e.getState().drag_id || c.render == "cell")
          e._renderMatrix.call(c, !0, !0);
        else
          for (var D = 0; D < w.length; D++)
            this.clear_event(w[D]), this.render_timeline_event.call(this.matrix[this._mode], w[D], !0);
      }, e.matrix[c.name] = c, e.templates[c.name + "_cell_value"] = function(w) {
        return w ? w.length : "";
      }, e.templates[c.name + "_cell_class"] = function(w) {
        return "";
      }, e.templates[c.name + "_scalex_class"] = function(w) {
        return "";
      }, e.templates[c.name + "_second_scalex_class"] = function(w) {
        return "";
      }, e.templates[c.name + "_row_class"] = function(w, E) {
        return E.folder_events_available && w.children ? "folder" : "";
      }, e.templates[c.name + "_scaley_class"] = function(w, E, D) {
        return "";
      }, c.attachEvent("onBeforeRender", function() {
        return c.columns && c.columns.length && function(w, E) {
          var D = E.dx, S = 0, M = [];
          w.forEach(function(C) {
            C.width ? (S += C.width, C.$width = C.width) : M.push(C);
          });
          var N = !1, T = D - S;
          (T < 0 || M.length === 0) && (N = !0);
          var A = M.length;
          M.forEach(function(C) {
            C.$width = Math.max(Math.floor(T / A), 20), T -= C.$width, S += C.$width, A--;
          }), N && (E.dx = S);
        }(c.columns, c), !0;
      }), c.renderColumns = c.renderColumns || e.ext.timeline.renderColumns.bind(c), c.renderHeading = c.renderHeading || e.ext.timeline.renderHeading.bind(c), c.renderCells = c.renderCells || e.ext.timeline.renderCells.bind(c), e.templates[c.name + "_scale_label"] = function(w, E, D) {
        return c.columns && c.columns.length ? c.renderColumns(D) : E;
      }, e.templates[c.name + "_scale_header"] = function(w) {
        return c.columns ? w.renderHeading(w) : e.locale.labels[c.name + "_scale_header"] || "";
      }, e.templates[c.name + "_tooltip"] = function(w, E, D) {
        return D.text;
      }, e.templates[c.name + "_date"] = function(w, E) {
        return w.getDay() == E.getDay() && E - w < 864e5 || +w == +e.date.date_part(new Date(E)) || +e.date.add(w, 1, "day") == +E && E.getHours() === 0 && E.getMinutes() === 0 ? e.templates.day_date(w) : w.getDay() != E.getDay() && E - w < 864e5 ? e.templates.day_date(w) + " &ndash; " + e.templates.day_date(E) : e.templates.week_date(w, E);
      };
      let g = c.x_date || e.config.hour_date, b = null;
      e.templates[c.name + "_scale_date"] = function(w) {
        return g === (c.x_date || e.config.hour_date) && b || (g = c.x_date || e.config.hour_date, b = e.date.date_to_str(g)), b(w);
      };
      let x = c.second_scale && c.second_scale.x_date ? c.second_scale.x_date : e.config.hour_date, k = null;
      e.templates[c.name + "_second_scale_date"] = function(w) {
        return x === (c.second_scale.x_date || e.config.hour_date) && k || (x = c.second_scale && c.second_scale.x_date ? c.second_scale.x_date : e.config.hour_date, k = e.date.date_to_str(x)), k(w);
      }, e.date["add_" + c.name + "_private"] = function(w, E) {
        var D = E, S = c.x_unit;
        if (c.x_unit == "minute" || c.x_unit == "hour") {
          var M = D;
          c.x_unit == "hour" && (M *= 60), M % 1440 || (D = M / 1440, S = "day");
        }
        return e.date.add(w, D, S);
      }, e.date["add_" + c.name] = function(w, E, D) {
        var S = e.date["add_" + c.name + "_private"](w, (c.x_length || c.x_size) * c.x_step * E);
        if (c.x_unit == "minute" || c.x_unit == "hour") {
          var M = c.x_length || c.x_size, N = c.x_unit == "hour" ? 60 * c.x_step : c.x_step;
          if (N * M % 1440)
            if (+e.date.date_part(new Date(w)) == +e.date.date_part(new Date(S)))
              c.x_start += E * M;
            else {
              var T = 1440 / (M * N) - 1, A = Math.round(T * M);
              c.x_start = E > 0 ? c.x_start - A : A + c.x_start;
            }
        }
        return S;
      }, e.date[c.name + "_start"] = function(w) {
        var E = (e.date[c.x_unit + "_start"] || e.date.day_start).call(e.date, w), D = E.getTimezoneOffset(), S = (E = e.date.add(E, c.x_step * c.x_start, c.x_unit)).getTimezoneOffset();
        return D != S && E.setTime(E.getTime() + 6e4 * (S - D)), E;
      }, c._smartRenderingEnabled = function() {
        var w = null;
        (this.scrollable || this.smart_rendering) && (w = e._timeline_smart_render.getViewPort(this.scrollHelper, this._sch_height));
        var E = !!w;
        return !!(this.scrollable ? this.smart_rendering !== !1 && E : this.smart_rendering && E);
      }, c.scrollTo = c.scrollTo || e.ext.timeline.scrollTo.bind(c), c.getScrollPosition = c.getScrollPosition || e.ext.timeline.getScrollPosition.bind(c), c.posFromDate = c.posFromDate || e.ext.timeline.posFromDate.bind(c), c.dateFromPos = c.dateFromPos || e.ext.timeline.dateFromPos.bind(c), c.sectionFromPos = c.sectionFromPos || e.ext.timeline.sectionFromPos.bind(c), c.resolvePosition = c.resolvePosition || e.ext.timeline.resolvePosition.bind(c), c.getSectionHeight = c.getSectionHeight || e.ext.timeline.getSectionHeight.bind(c), c.getSectionTop = c.getSectionTop || e.ext.timeline.getSectionTop.bind(c), c.getEventTop = c.getEventTop || e.ext.timeline.getEventTop.bind(c), c.getEventHeight = c.getEventHeight || e.ext.timeline.getEventHeight.bind(c), c.selectEvents = e.bind(function(w) {
        var E = w.section, D = w.date, S = w.selectNested;
        return D ? function(M, N, T, A) {
          var C = e._timeline_smart_render.getPreparedEvents(A), H = [], O = [], $ = A.order[M], R = A.y_unit[$];
          if (!R)
            return [];
          var j = e._get_date_index(A, N);
          return C.$matrix ? (H = C.$matrix[$][j] || [], T && C.$matrix.$tree && C.$matrix.$tree[R.key] && (O = C.$matrix.$tree[R.key][j] || []), H.concat(O)) : C[$] || [];
        }(E, D, S, this) : E ? function(M, N, T) {
          var A = e._timeline_smart_render.getPreparedEvents(T), C = T.order[M], H = T.y_unit[C];
          if (!H)
            return [];
          var O = [M];
          N && t(H, O);
          for (var $ = [], R = 0; R < O.length; R++)
            if ((C = T.order[O[R]]) !== void 0 && A[C])
              $ = $.concat(A[C]);
            else if (A.undefined)
              for (var j = 0; j < A.undefined.length; j++) {
                var I = A.undefined[j];
                I[T.y_property] == O[R] && $.push(I);
              }
          return $;
        }(E, S, this) : void 0;
      }, c), c.setRange = e.bind(function(w, E) {
        var D = e.date[this.name + "_start"](new Date(w)), S = function(M, N, T) {
          for (var A = 0, C = e.date[T.name + "_start"](new Date(M)), H = T.x_step, O = T.x_unit; C < N; )
            A++, C = e.date.add(C, H, O);
          return A;
        }(w, E, this);
        this.x_size = S, e.setCurrentView(D, this.name);
      }, c), e.callEvent("onOptionsLoad", [c]), e[c.name + "_view"] = function(w) {
        w ? e._set_timeline_dates(c) : e._renderMatrix.apply(c, arguments);
      }, e["mouse_" + c.name] = function(w) {
        var E = this._drag_event;
        if (this._drag_id && (E = this.getEvent(this._drag_id)), c.scrollable && !w.converted) {
          if (w.converted = 1, w.x += -c.dx + c._x_scroll, e.config.rtl) {
            var D = +e.$container.querySelector(".dhx_timeline_label_wrapper").style.height.replace("px", ""), S = c._section_height[c.y_unit.length] + c._label_rows[c._label_rows.length - 1].top;
            w.x += e.xy.scale_width, c.scrollHelper.getMode() == c.scrollHelper.modes.minMax && (S > D || c.render == "tree") && (w.x += i());
          }
          w.y += c._y_scroll;
        } else
          e.config.rtl ? w.x -= c.dx - e.xy.scale_width : w.x -= c.dx;
        var M = e._timeline_drag_date(c, w.x);
        if (w.x = 0, w.force_redraw = !0, w.custom = !0, this._drag_mode == "move" && this._drag_id && this._drag_event) {
          E = this.getEvent(this._drag_id);
          var N = this._drag_event;
          if (w._ignores = this._ignores_detected || c._start_correction || c._end_correction, N._move_delta === void 0 && (N._move_delta = (E.start_date - M) / 6e4, this.config.preserve_length && w._ignores && (N._move_delta = this._get_real_event_length(E.start_date, M, c), N._event_length = this._get_real_event_length(E.start_date, E.end_date, c))), this.config.preserve_length && w._ignores) {
            var T = this._get_fictional_event_length(M, N._move_delta, c, !0);
            M = new Date(M - T);
          } else
            M = e.date.add(M, N._move_delta, "minute");
        }
        if (this._drag_mode == "resize" && E && (this.config.timeline_swap_resize && this._drag_id && (this._drag_from_start && +M > +E.end_date ? this._drag_from_start = !1 : !this._drag_from_start && +M < +E.start_date && (this._drag_from_start = !0)), w.resize_from_start = this._drag_from_start, !this.config.timeline_swap_resize && this._drag_id && this._drag_from_start && +M >= +e.date.add(E.end_date, -e.config.time_step, "minute") && (M = e.date.add(E.end_date, -e.config.time_step, "minute"))), c.round_position)
          switch (this._drag_mode) {
            case "move":
              this.config.preserve_length || (M = e._timeline_get_rounded_date.call(c, M, !1), c.x_unit == "day" && (w.custom = !1));
              break;
            case "resize":
              this._drag_event && (this._drag_event._resize_from_start !== null && this._drag_event._resize_from_start !== void 0 || (this._drag_event._resize_from_start = w.resize_from_start), w.resize_from_start = this._drag_event._resize_from_start, M = e._timeline_get_rounded_date.call(c, M, !this._drag_event._resize_from_start));
          }
        this._resolve_timeline_section(c, w), w.section && this._update_timeline_section({ pos: w, event: this.getEvent(this._drag_id), view: c }), w.y = Math.round((this._correct_shift(M, 1) - this._min_date) / (6e4 * this.config.time_step)), w.shift = this.config.time_step, c.round_position && this._drag_mode == "new-size" && M <= this._drag_start && (w.shift = e.date.add(this._drag_start, c.x_step, c.x_unit) - this._drag_start);
        var A = this._is_pos_changed(this._drag_pos, w);
        return this._drag_pos && A && (this._drag_event._dhx_changed = !0), A || this._drag_pos.has_moved || (w.force_redraw = !1), w;
      };
    }, e._prepare_timeline_events = function(c) {
      var p = [];
      if (c.render == "cell")
        p = e._timeline_trace_events.call(c);
      else {
        for (var g = e.get_visible_events(), b = c.order, x = 0; x < g.length; x++) {
          var k = g[x], w = k[c.y_property], E = c.order[w];
          if (c.show_unassigned && !w) {
            for (var D in b)
              if (b.hasOwnProperty(D)) {
                p[E = b[D]] || (p[E] = []);
                var S = e._lame_copy({}, k);
                S[c.y_property] = D, p[E].push(S);
                break;
              }
          } else
            p[E] || (p[E] = []), p[E].push(k);
        }
        p.$matrix = e._timeline_trace_events.call(c);
      }
      return p;
    }, e._populate_timeline_rendered = function(c) {
      e._rendered = [];
      const p = c.querySelector(".dhx_timeline_data_col"), g = Array.prototype.slice.call(p.children);
      e._timeline_smart_render && e._timeline_smart_render._rendered_events_cache && (e._timeline_smart_render._rendered_events_cache = []), g.forEach(function(b) {
        const x = Number(b.getAttribute("data-section-index"));
        Array.prototype.slice.call(b.children).forEach(function(k) {
          const w = k.getAttribute(e.config.event_attribute);
          if (w && (e._rendered.push(k), e._timeline_smart_render && e._timeline_smart_render._rendered_events_cache)) {
            const E = e._timeline_smart_render._rendered_events_cache;
            E[x] || (E[x] = []), E[x].push(w);
          }
        });
      });
    }, e.render_timeline_event = function(c, p) {
      var g = c[this.y_property];
      if (!g)
        return "";
      var b = c._sorder, x = e._timeline_getX(c, !1, this), k = e._timeline_getX(c, !0, this), w = e._get_timeline_event_height ? e._get_timeline_event_height(c, this) : this.getEventHeight(c), E = w - 2;
      if (!c._inner && this.event_dy == "full") {
        var D = c._count - b;
        D == 0 && (D = 1), E = (E + 1) * D - 2;
      }
      var S = e._get_timeline_event_y ? e._get_timeline_event_y(c._sorder, w) : this.getEventTop(c), M = w + S + 2;
      (!this._events_height[g] || this._events_height[g] < M) && (this._events_height[g] = M);
      var N = e.templates.event_class(c.start_date, c.end_date, c);
      N = "dhx_cal_event_line " + (N || ""), e.getState().select_id == c.id && (N += " dhx_cal_event_selected"), c._no_drag_move && (N += " no_drag_move");
      var T = c.color ? "--dhx-scheduler-event-background:" + c.color + ";" : "", A = c.textColor ? "--dhx-scheduler-event-color:" + c.textColor + ";" : "", C = e.templates.event_bar_text(c.start_date, c.end_date, c);
      const H = Math.max(0, k - x);
      H < 70 && (N += " dhx_cal_event--small"), H < 40 && (N += " dhx_cal_event--xsmall");
      var O = "<div " + e._waiAria.eventBarAttrString(c) + " event_id='" + c.id + "' " + e.config.event_attribute + "='" + c.id + "' class='" + N + "' style='" + T + A + "position:absolute; top:" + S + "px; height: " + E + "px; " + (e.config.rtl ? "right:" : "left:") + x + "px; width:" + H + "px;" + (c._text_style || "") + "'>";
      if (e.config.drag_resize && !e.config.readonly) {
        var $ = "dhx_event_resize", R = E + 1, j = "<div class='" + $ + " " + $ + "_start' style='height: " + R + "px;'></div>", I = "<div class='" + $ + " " + $ + "_end' style='height: " + R + "px;'></div>";
        O += (c._no_resize_start ? "" : j) + (c._no_resize_end ? "" : I);
      }
      if (O += C + "</div>", !p)
        return O;
      var Y = document.createElement("div");
      Y.innerHTML = O;
      var J = this._scales[g];
      J && (e._rendered.push(Y.firstChild), J.appendChild(Y.firstChild));
    };
    var _ = function(c) {
      return String(c).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
    };
    function d(c) {
      return c.height && !isNaN(Number(c.height));
    }
    function a(c) {
      return e._helpers.formatDate(c);
    }
    function o(c, p) {
      var g = c.querySelector(".dhx_timeline_data_wrapper");
      return p.scrollable || (g = e.$container.querySelector(".dhx_cal_data")), g;
    }
    function l() {
      return e.$container.querySelector(".dhx_cal_data .dhx_timeline_label_col");
    }
    e._timeline_trace_events = function() {
      return r(e.get_visible_events(), this);
    }, e._timeline_getX = function(c, p, g) {
      var b = 0, x = g._step, k = g.round_position, w = 0, E = p ? c.end_date : c.start_date;
      E.valueOf() > e._max_date.valueOf() && (E = e._max_date);
      var D = E - e._min_date_timeline;
      if (D > 0) {
        var S = e._get_date_index(g, E);
        e._ignores[S] && (k = !0);
        for (var M = 0; M < S; M++)
          b += e._cols[M];
        var N = e._timeline_get_rounded_date.apply(g, [E, !1]);
        k ? +E > +N && p && (w = e._cols[S]) : (D = E - N, g.first_hour || g.last_hour ? ((D -= g._start_correction) < 0 && (D = 0), (w = Math.round(D / x)) > e._cols[S] && (w = e._cols[S])) : w = Math.round(D / x));
      }
      return b += p && (D === 0 || k) ? w - 1 : w;
    }, e._timeline_get_rounded_date = function(c, p) {
      var g = e._get_date_index(this, c), b = this._trace_x[g];
      return p && +c != +this._trace_x[g] && (b = this._trace_x[g + 1] ? this._trace_x[g + 1] : e.date.add(this._trace_x[g], this.x_step, this.x_unit)), new Date(b);
    }, e._timeline_skip_ignored = function(c) {
      if (e._ignores_detected)
        for (var p, g, b, x, k = 0; k < c.length; k++) {
          for (x = c[k], b = !1, p = e._get_date_index(this, x.start_date), g = e._get_date_index(this, x.end_date); p < g; ) {
            if (!e._ignores[p]) {
              b = !0;
              break;
            }
            p++;
          }
          b || p != g || e._ignores[g] || +x.end_date > +this._trace_x[g] && (b = !0), b || (c.splice(k, 1), k--);
        }
    }, e._timeline_calculate_event_positions = function(c) {
      if (c && this.render != "cell") {
        e._timeline_skip_ignored.call(this, c), c.sort(this.sort || function($, R) {
          return $.start_date.valueOf() == R.start_date.valueOf() ? $.end_date.valueOf() > R.end_date.valueOf() ? -1 : 1 : $.start_date > R.start_date ? 1 : -1;
        });
        for (var p = [], g = c.length, b = -1, x = null, k = 0; k < g; k++) {
          var w = c[k];
          w._inner = !1;
          for (var E = this.round_position ? e._timeline_get_rounded_date.apply(this, [w.start_date, !1]) : w.start_date; p.length && p[p.length - 1].end_date.valueOf() <= E.valueOf(); )
            p.splice(p.length - 1, 1);
          for (var D = !1, S = 0; S < p.length; S++) {
            var M = p[S];
            if (M.end_date.valueOf() <= E.valueOf()) {
              D = !0, w._sorder = M._sorder, p.splice(S, 1), w._inner = !0;
              break;
            }
          }
          if (p.length && (p[p.length - 1]._inner = !0), !D)
            if (p.length)
              if (p.length <= p[p.length - 1]._sorder) {
                if (p[p.length - 1]._sorder)
                  for (var N = 0; N < p.length; N++) {
                    for (var T = !1, A = 0; A < p.length; A++)
                      if (p[A]._sorder == N) {
                        T = !0;
                        break;
                      }
                    if (!T) {
                      w._sorder = N;
                      break;
                    }
                  }
                else
                  w._sorder = 0;
                w._inner = !0;
              } else {
                for (var C = p[0]._sorder, H = 1; H < p.length; H++)
                  p[H]._sorder > C && (C = p[H]._sorder);
                w._sorder = C + 1, b < w._sorder && (b = w._sorder, x = w), w._inner = !1;
              }
            else
              w._sorder = 0;
          p.push(w), p.length > (p.max_count || 0) ? (p.max_count = p.length, w._count = p.length) : w._count = w._count ? w._count : 1;
        }
        for (var O = 0; O < c.length; O++)
          c[O]._count = p.max_count, e._register_copy && e._register_copy(c[O]);
        (x || c[0]) && e.render_timeline_event.call(this, x || c[0], !1);
      }
    }, e._timeline_get_events_html = function(c) {
      var p = "";
      if (c && this.render != "cell")
        for (var g = 0; g < c.length; g++)
          p += e.render_timeline_event.call(this, c[g], !1);
      return p;
    }, e._timeline_update_events_html = function(c) {
      var p = "";
      if (c && this.render != "cell") {
        var g = e.getView(), b = {};
        c.forEach(function(k) {
          var w, E;
          b[w = k.id, E = k[g.y_property], w + "_" + E] = !0;
        });
        for (var x = 0; x < c.length; x++)
          p += e.render_timeline_event.call(this, c[x], !1);
      }
      return p;
    }, e._timeline_get_block_stats = function(c, p) {
      var g = {};
      return p._sch_height = c.offsetHeight, g.style_data_wrapper = (e.config.rtl ? "padding-right:" : "padding-left:") + p.dx + "px;", g.style_label_wrapper = "width: " + p.dx + "px;", p.scrollable ? (g.style_data_wrapper += "height:" + (p._sch_height - 1) + "px;", p.html_scroll_width === void 0 && (p.html_scroll_width = i()), p._section_autowidth ? p.custom_scroll_width = 0 : p.custom_scroll_width = p.html_scroll_width, g.style_label_wrapper += "height:" + (p._sch_height - 1 - p.custom_scroll_width) + "px;") : (g.style_data_wrapper += "height:" + (p._sch_height - 1) + "px;", g.style_label_wrapper += "height:" + (p._sch_height - 1) + "px;overflow:visible;"), g;
    }, e._timeline_get_cur_row_stats = function(c, p) {
      var g = c.y_unit[p], b = c._logic(c.render, g, c);
      if (e._merge(b, { height: c.dy }), c.section_autoheight && !d(g)) {
        var x = function(E, D) {
          var S = 0, M = E.y_unit.length, N = 0;
          return E.y_unit.forEach(function(T) {
            d(T) && (S += Number(T.height), N += Number(T.height), M--);
          }), { totalHeight: S += M * D, rowsWithDefaultHeight: M, totalCustomHeight: N };
        }(c, b.height), k = c.scrollable ? c._sch_height - e.xy.scroll_width : c._sch_height;
        x.totalHeight < k && x.rowsWithDefaultHeight > 0 && (b.height = Math.max(b.height, Math.floor((k - 1 - x.totalCustomHeight) / x.rowsWithDefaultHeight)));
      }
      if (d(g) && (b.height = Number(g.height)), c._section_height[g.key] = b.height, !b.td_className) {
        b.td_className = "dhx_matrix_scell";
        var w = e.templates[c.name + "_scaley_class"](c.y_unit[p].key, c.y_unit[p].label, c.y_unit[p]);
        w && (b.td_className += " " + w), c.columns && (b.td_className += " dhx_matrix_scell_columns");
      }
      return b.td_content || (b.td_content = e.templates[c.name + "_scale_label"](c.y_unit[p].key, c.y_unit[p].label, c.y_unit[p])), e._merge(b, { tr_className: "", style_height: "height:" + b.height + "px;", style_width: "width:" + c.dx + "px;", summ_width: "width:" + c._summ + "px;", table_className: "" }), b;
    }, e._timeline_get_fit_events_stats = function(c, p, g) {
      if (c.fit_events) {
        var b = c._events_height[c.y_unit[p].key] || 0;
        c.fit_events_offset && (b += c.fit_events_offset), g.height = b > g.height ? b : g.height, g.style_height = "height:" + g.height + "px;", g.style_line_height = "line-height:" + (g.height - 1) + "px;", c._section_height[c.y_unit[p].key] = g.height;
      }
      return g.style_height = "height:" + g.height + "px;", g.style_line_height = "line-height:" + (g.height - 1) + "px;", c._section_height[c.y_unit[p].key] = g.height, g;
    }, e._timeline_set_scroll_pos = function(c, p) {
      var g = c.querySelector(".dhx_timeline_data_wrapper");
      g.scrollTop = p._y_scroll || 0, p.scrollHelper.setScrollValue(g, p._x_scroll || 0), p.scrollHelper.getMode() != p.scrollHelper.modes.maxMin && g.scrollLeft == p._summ - g.offsetWidth + p.dx && (g.scrollLeft += i());
    }, e._timeline_save_scroll_pos = function(c, p, g, b) {
      c._y_scroll = p || 0, c._x_scroll = g || 0;
    }, e._timeline_get_html_for_cell_data_row = function(c, p, g, b, x) {
      var k = "";
      return x.template && (k += " " + (x.template(x.section, x.view) || "")), "<div class='dhx_timeline_data_row" + k + "' data-section-id='" + _(b) + "' data-section-index='" + c + "' style='" + p.summ_width + p.style_height + " position:absolute; top:" + g + "px;'>";
    }, e._timeline_get_html_for_cell_ignores = function(c) {
      return '<div class="dhx_matrix_cell dhx_timeline_data_cell" style="' + c.style_height + c.style_line_height + ';display:none"></div>';
    }, e._timeline_get_html_for_cell = function(c, p, g, b, x, k) {
      var w = g._trace_x[c], E = g.y_unit[p], D = e._cols[c], S = a(w), M = e.templates[g.name + "_cell_value"](b, w, E);
      return "<div data-col-id='" + c + "' data-col-date='" + S + "' class='dhx_matrix_cell dhx_timeline_data_cell " + e.templates[g.name + "_cell_class"](b, w, E) + "' style='width:" + D + "px;" + x.style_height + x.style_line_height + (e.config.rtl ? " right:" : "  left:") + k + "px;'><div style='width:auto'>" + M + "</div></div>";
    }, e._timeline_get_html_for_bar_matrix_line = function(c, p, g, b) {
      return "<div style='" + p.summ_width + " " + p.style_height + " position:absolute; top:" + g + "px;' data-section-id='" + _(b) + "' data-section-index='" + c + "' class='dhx_matrix_line'>";
    }, e._timeline_get_html_for_bar_data_row = function(c, p) {
      var g = c.table_className;
      return p.template && (g += " " + (p.template(p.section, p.view) || "")), "<div class='dhx_timeline_data_row " + g + "' style='" + c.summ_width + " " + c.style_height + "' >";
    }, e._timeline_get_html_for_bar_ignores = function() {
      return "";
    }, e._timeline_get_html_for_bar = function(c, p, g, b, x, k) {
      var w = a(g._trace_x[c]), E = g.y_unit[p], D = "";
      g.cell_template && (D = e.templates[g.name + "_cell_value"](b, g._trace_x[c], E, k));
      var S = "line-height:" + g._section_height[E.key] + "px;";
      let M = "";
      return D && (M = "<div style='width:auto; height:100%;position:relative;" + S + "'>" + D + "</div>"), "<div class='dhx_matrix_cell dhx_timeline_data_cell " + e.templates[g.name + "_cell_class"](b, g._trace_x[c], E, k) + "' style='width:" + e._cols[c] + "px; " + (e.config.rtl ? "right:" : "left:") + x + "px;'  data-col-id='" + c + "' data-col-date='" + w + "' >" + M + "</div>";
    }, e._timeline_render_scale_header = function(c, p) {
      var g = e.$container.querySelector(".dhx_timeline_scale_header");
      if (g && g.remove(), !p)
        return;
      g = document.createElement("div");
      var b = "dhx_timeline_scale_header";
      c.second_scale && (b += " dhx_timeline_second_scale");
      var x = e.xy.scale_height;
      g.className = b, g.style.cssText = ["width:" + c.dx + "px", "height:" + x + "px", "line-height:" + x + "px", "top:0px", e.config.rtl ? "right:0px" : "left:0px"].join(";"), g.innerHTML = e.templates[c.name + "_scale_header"](c);
      const k = e.$container.querySelector(".dhx_cal_header");
      g.style.top = `${k.offsetTop}px`, g.style.height = `${k.offsetHeight}px`, e.$container.appendChild(g);
    }, e._timeline_y_scale = function(c) {
      var p = e._timeline_get_block_stats(c, this), g = this.scrollable ? " dhx_timeline_scrollable_data" : "", b = "<div class='dhx_timeline_table_wrapper'>", x = "<div class='dhx_timeline_label_wrapper' style='" + p.style_label_wrapper + "'><div class='dhx_timeline_label_col'>", k = "<div class='dhx_timeline_data_wrapper" + g + "' style='" + p.style_data_wrapper + "'><div class='dhx_timeline_data_col'>";
      e._load_mode && e._load(), e._timeline_smart_render.clearPreparedEventsCache(w);
      var w = e._timeline_smart_render.getPreparedEvents(this);
      e._timeline_smart_render.cachePreparedEvents(w);
      for (var E = 0, D = 0; D < e._cols.length; D++)
        E += e._cols[D];
      var S = /* @__PURE__ */ new Date(), M = e._cols.length - e._ignores_detected;
      S = (e.date.add(S, this.x_step * M, this.x_unit) - S - (this._start_correction + this._end_correction) * M) / E, this._step = S, this._summ = E;
      var N = e._colsS.heights = [], T = [];
      this._render_stats = T, this._events_height = {}, this._section_height = {}, this._label_rows = [];
      var A = !1, C = null;
      this._smartRenderingEnabled() && (C = e._timeline_smart_render.getViewPort(this.scrollHelper, this._sch_height)), e._timeline_smart_render._rendered_labels_cache = [], e._timeline_smart_render._rendered_events_cache = [];
      var H = !!C, O = this._smartRenderingEnabled(), $ = function(K, V) {
        for (var Re = [], ee = {}, ye = 0, _e = 0; _e < K.y_unit.length; _e++) {
          e._timeline_calculate_event_positions.call(K, V[_e]);
          var ke = e._timeline_get_cur_row_stats(K, _e);
          (ke = e._timeline_get_fit_events_stats(K, _e, ke)).top = ye, Re.push(ke), ee[K.y_unit[_e].key] = ke, ye += ke.height;
        }
        return { totalHeight: ye, rowStats: Re, rowStatsByKey: ee };
      }(this, w);
      C && $.totalHeight < C.scrollTop && (C.scrollTop = Math.max(0, $.totalHeight - C.height)), this._rowStats = $.rowStatsByKey;
      for (var R = 0; R < this.y_unit.length; R++) {
        var j = $.rowStats[R], I = this.y_unit[R], Y = j.top, J = "<div class='dhx_timeline_label_row " + j.tr_className + "' style='top:" + Y + "px;" + j.style_height + j.style_line_height + "'data-row-index='" + R + "' data-row-id='" + _(I.key) + "'><div class='" + j.td_className + "' style='" + j.style_width + " height:" + j.height + "px;' " + e._waiAria.label(j.td_content) + ">" + j.td_content + "</div></div>";
        if (O && this._label_rows.push({ div: J, top: Y, section: I }), O && (e._timeline_smart_render.isInYViewPort({ top: Y, bottom: Y + j.height }, C) || (A = !0)), A)
          A = !1;
        else {
          x += J, O && e._timeline_smart_render._rendered_labels_cache.push(R);
          var oe = { view: this, section: I, template: e.templates[this.name + "_row_class"] }, X = 0;
          if (this.render == "cell") {
            k += e._timeline_get_html_for_cell_data_row(R, j, j.top, I.key, oe);
            for (var B = 0; B < e._cols.length; B++)
              e._ignores[B] && !O ? k += e._timeline_get_html_for_cell_ignores(j) : O && H ? e._timeline_smart_render.isInXViewPort({ left: X, right: X + e._cols[B] }, C) && (k += e._timeline_get_html_for_cell(B, R, this, w[R][B], j, X)) : k += e._timeline_get_html_for_cell(B, R, this, w[R][B], j, X), X += e._cols[B];
            k += "</div>";
          } else {
            k += e._timeline_get_html_for_bar_matrix_line(R, j, j.top, I.key);
            var se = w[R];
            for (O && H && (se = e._timeline_smart_render.getVisibleEventsForRow(this, C, w, R)), k += e._timeline_get_events_html.call(this, se), k += e._timeline_get_html_for_bar_data_row(j, oe), B = 0; B < e._cols.length; B++)
              e._ignores[B] ? k += e._timeline_get_html_for_bar_ignores() : O && H ? e._timeline_smart_render.isInXViewPort({ left: X, right: X + e._cols[B] }, C) && (k += e._timeline_get_html_for_bar(B, R, this, w[R], X)) : k += e._timeline_get_html_for_bar(B, R, this, w[R], X), X += e._cols[B];
            k += "</div></div>";
          }
        }
        j.sectionKey = I.key, T.push(j);
      }
      b += x + "</div></div>", b += k + "</div></div>", b += "</div>", this._matrix = w, c.innerHTML = b, O && e._timeline_smart_render && (e._timeline_smart_render._rendered_events_cache = []), e._populate_timeline_rendered(c);
      const qe = c.querySelectorAll("[data-section-id]"), Pe = {};
      qe.forEach(function(K) {
        Pe[K.getAttribute("data-section-id")] = K;
      }), this._divBySectionId = Pe, O && (e.$container.querySelector(".dhx_timeline_data_col").style.height = $.totalHeight + "px"), this._scales = {}, D = 0;
      for (var Xe = T.length; D < Xe; D++) {
        N.push(T[D].height);
        var Se = T[D].sectionKey;
        e._timeline_finalize_section_add(this, Se, this._divBySectionId[Se]);
      }
      (O || this.scrollable) && function(K, V, Re) {
        V._is_ev_creating = !1;
        var ee = o(K, V), ye = e._els.dhx_cal_header[0], _e = K.querySelector(".dhx_timeline_label_wrapper");
        if (_e && !_e.$eventsAttached) {
          _e.$eventsAttached = !0;
          var ke = { pageX: 0, pageY: 0 };
          e.event(_e, "touchstart", function(de) {
            var me = de;
            de.touches && (me = de.touches[0]), ke = { pageX: me.pageX, pageY: me.pageY };
          }, { passive: !1 }), e.event(_e, "touchmove", function(de) {
            var me = de;
            de.touches && (me = de.touches[0]);
            var Ue = ke.pageY - me.pageY;
            ke = { pageX: me.pageX, pageY: me.pageY }, Ue && (ee.scrollTop += Ue), de && de.preventDefault && de.preventDefault();
          }, { passive: !1 });
        }
        if (!ee.$eventsAttached) {
          let Ue = function(G) {
            let te = !0;
            var le = e.env.isFF, Q = le ? G.deltaX : G.wheelDeltaX, ue = le ? G.deltaY : G.wheelDelta, fe = -20;
            le && (fe = G.deltaMode !== 0 ? -40 : -10);
            var Le = 1, He = 1, Fe = le ? Q * fe * Le : 2 * Q * Le, Me = le ? ue * fe * He : ue * He;
            if (Fe && Math.abs(Fe) > Math.abs(Me)) {
              var $e = Fe / -40;
              ee.scrollLeft += 30 * $e, ee.scrollLeft === de && (te = !1);
            } else
              $e = Me / -40, Me === void 0 && ($e = G.detail), ee.scrollTop += 30 * $e, ee.scrollTop === me && (te = !1);
            if (te)
              return G.preventDefault(), G.cancelBubble = !0, !1;
          }, de, me;
          ee.$eventsAttached = !0, e.event(ee, "mousewheel", Ue, { passive: !1 }), e.event(_e, "mousewheel", Ue, { passive: !1 });
          const ca = function(G) {
            if (e.getState().mode === V.name) {
              var te = o(K, V);
              G.preventDefault();
              var le = te.scrollTop, Q = V.scrollHelper.getScrollValue(te);
              de = Q, me = le;
              var ue = V._summ - e.$container.querySelector(".dhx_cal_data").offsetWidth + V.dx + V.custom_scroll_width, fe = e._timeline_smart_render.getViewPort(V.scrollHelper, 0, Q, le), Le = l();
              if (V.scrollable && (Le.style.top = -le + "px"), V._smartRenderingEnabled() && (Q !== V._x_scroll || V._is_ev_creating) && (V.second_scale ? e._timeline_smart_render.updateHeader(V, fe, ye.children[1]) : e._timeline_smart_render.updateHeader(V, fe, ye.children[0])), e.config.rtl) {
                var He = +e.$container.querySelector(".dhx_timeline_label_wrapper").style.height.replace("px", ""), Fe = V._section_height[V.y_unit.length] + V._label_rows[V._label_rows.length - 1].top;
                V.scrollHelper.getMode() == V.scrollHelper.modes.minMax && (Fe > He || V.render == "tree") ? ye.style.right = -1 - Q - i() + "px" : ye.style.right = -1 - Q + "px", ye.style.left = "unset";
              } else
                ye.style.left = -1 - Q + "px";
              if (V._smartRenderingEnabled()) {
                if ((V._options_changed || le !== V._y_scroll || V._is_ev_creating) && e._timeline_smart_render.updateLabels(V, fe, Le), V._is_ev_creating = !1, e._timeline_smart_render.updateGridCols(V, fe), e._timeline_smart_render.updateGridRows(V, fe), V.render != "cell") {
                  if (cancelAnimationFrame(void 0), V.name !== e.getState().mode)
                    return;
                  e._timeline_smart_render.updateEvents(V, fe);
                }
                var Me, $e = 0;
                V._scales = {}, Me = V.render === "cell" ? te.querySelectorAll(".dhx_timeline_data_col .dhx_timeline_data_row") : te.querySelectorAll(".dhx_timeline_data_col .dhx_matrix_line");
                for (var ha = V._render_stats, Ne = 0, rt = Me.length; Ne < rt; Ne++) {
                  var Et = Me[Ne].getAttribute("data-section-id"), Dt = V.order[Et];
                  Re[Dt] = ha[Dt].height, V._scales[Et] = Me[Ne];
                }
                for (Ne = 0, rt = Re.length; Ne < rt; Ne++)
                  $e += Re[Ne];
                e.$container.querySelector(".dhx_timeline_data_col").style.height = $e + "px";
                var St = le, Mt = Q;
                e._timeline_save_scroll_pos(V, St, Mt, ue), V.callEvent("onScroll", [Mt, St]), V._is_new_view = !1;
              }
            }
          };
          e.event(ee, "scroll", ca, { passive: !1 });
          var Ke = { pageX: 0, pageY: 0 };
          e.event(ee, "touchstart", function(G) {
            var te = G;
            G.touches && (te = G.touches[0]), Ke = { pageX: te.pageX, pageY: te.pageY };
          }, { passive: !1 }), e.event(ee, "touchmove", function(G) {
            var te = G;
            G.touches && (te = G.touches[0]);
            var le = l(), Q = Ke.pageX - te.pageX, ue = Ke.pageY - te.pageY;
            if (Ke = { pageX: te.pageX, pageY: te.pageY }, (Q || ue) && !e.getState().drag_id) {
              var fe = Math.abs(Q), Le = Math.abs(ue), He = Math.sqrt(Q * Q + ue * ue);
              fe / He < 0.42 ? Q = 0 : Le / He < 0.42 && (ue = 0), e.config.rtl && (Q = -Q), V.scrollHelper.setScrollValue(ee, V.scrollHelper.getScrollValue(ee) + Q), ee.scrollTop += ue, V.scrollable && ue && (le.style.top = -ee.scrollTop + "px");
            }
            return G && G.preventDefault && G.preventDefault(), !1;
          }, { passive: !1 });
        }
        V.scroll_position && V._is_new_view ? V.scrollTo(V.scroll_position) : e._timeline_set_scroll_pos(K, V), V._is_ev_creating = !0;
      }(c, this, N);
    }, e._timeline_finalize_section_add = function(c, p, g) {
      g && (c._scales[p] = g, e.callEvent("onScaleAdd", [g, p]));
    }, e.attachEvent("onBeforeViewChange", function(c, p, g, b) {
      if (e.matrix[g]) {
        var x = e.matrix[g];
        if (x.scrollable || x.smart_rendering) {
          if (x.render == "tree" && c === g && p === b)
            return !0;
          c === g && +p == +b || !e.$container.querySelector(".dhx_timeline_scrollable_data") || (x._x_scroll = x._y_scroll = 0, e.$container.querySelector(".dhx_timeline_scrollable_data") && e._timeline_set_scroll_pos(e._els.dhx_cal_data[0], x));
        }
      }
      return !0;
    }), e._timeline_x_dates = function(c) {
      var p = e._min_date, g = e._max_date;
      e._process_ignores(p, this.x_size, this.x_unit, this.x_step, c), e.date[this.x_unit + "_start"] && (p = e.date[this.x_unit + "_start"](p));
      for (var b = 0, x = 0; +p < +g; )
        if (this._trace_x[x] = new Date(p), this.x_unit == "month" && e.date[this.x_unit + "_start"] && (p = e.date[this.x_unit + "_start"](new Date(p))), p = e.date.add(p, this.x_step, this.x_unit), e.date[this.x_unit + "_start"] && (p = e.date[this.x_unit + "_start"](p)), e._ignores[x] || b++, x++, c) {
          if (b < this.x_size && !(+p < +g))
            g = e.date["add_" + this.name + "_private"](g, (this.x_length || this.x_size) * this.x_step);
          else if (b >= this.x_size) {
            e._max_date = p;
            break;
          }
        }
      return { total: x, displayed: b };
    }, e._timeline_x_scale = function(c) {
      var p = e._x - this.dx - e.xy.scroll_width, g = e._min_date, b = e.xy.scale_height, x = this._header_resized || e.xy.scale_height;
      e._cols = [], e._colsS = { height: 0 }, this._trace_x = [];
      var k = e.config.preserve_scale_length, w = e._timeline_x_dates.call(this, k);
      if (this.scrollable && this.column_width > 0) {
        var E = this.column_width * w.displayed;
        E > p && (p = E, this._section_autowidth = !1);
      }
      var D = [this.dx];
      e._els.dhx_cal_header[0].style.width = D[0] + p + 1 + "px", g = e._min_date_timeline = e._min_date;
      for (var S = w.displayed, M = w.total, N = 0; N < M; N++)
        e._ignores[N] ? (e._cols[N] = 0, S++) : e._cols[N] = Math.floor(p / (S - N)), p -= e._cols[N], D[N + 1] = D[N] + e._cols[N];
      if (c.innerHTML = "<div></div>", this.second_scale) {
        for (var T = this.second_scale.x_unit, A = [this._trace_x[0]], C = [], H = [this.dx, this.dx], O = 0, $ = 0; $ < this._trace_x.length; $++) {
          var R = this._trace_x[$];
          e._timeline_is_new_interval(T, R, A[O]) && (A[++O] = R, H[O + 1] = H[O]);
          var j = O + 1;
          C[O] = e._cols[$] + (C[O] || 0), H[j] += e._cols[$];
        }
        c.innerHTML = "<div></div><div></div>";
        var I = c.firstChild;
        I.style.height = x + "px";
        var Y = c.lastChild;
        Y.style.position = "relative", Y.className = "dhx_bottom_scale_container";
        for (var J = 0; J < A.length; J++) {
          var oe = A[J], X = e.templates[this.name + "_second_scalex_class"](oe), B = document.createElement("div");
          B.className = "dhx_scale_bar dhx_second_scale_bar" + (X ? " " + X : ""), e.set_xy(B, C[J], x, H[J], 0), B.innerHTML = e.templates[this.name + "_second_scale_date"](oe), I.appendChild(B);
        }
      }
      e.xy.scale_height = x, c = c.lastChild, this._h_cols = {};
      for (var se = 0; se < this._trace_x.length; se++)
        if (!e._ignores[se]) {
          g = this._trace_x[se], e._render_x_header(se, D[se], g, c);
          var qe = e.templates[this.name + "_scalex_class"](g);
          qe && (c.lastChild.className += " " + qe), c.lastChild.setAttribute("data-col-id", se), c.lastChild.setAttribute("data-col-date", a(g));
          var Pe = c.lastChild.cloneNode(!0);
          this._h_cols[se] = { div: Pe, left: D[se] };
        }
      e.xy.scale_height = b;
      var Xe = this._trace_x;
      c.$_clickEventsAttached || (c.$_clickEventsAttached = !0, e.event(c, "click", function(Se) {
        var K = e._timeline_locate_hcell(Se);
        K && e.callEvent("onXScaleClick", [K.x, Xe[K.x], Se]);
      }), e.event(c, "dblclick", function(Se) {
        var K = e._timeline_locate_hcell(Se);
        K && e.callEvent("onXScaleDblClick", [K.x, Xe[K.x], Se]);
      }));
    }, e._timeline_is_new_interval = function(c, p, g) {
      switch (c) {
        case "hour":
          return p.getHours() != g.getHours() || e._timeline_is_new_interval("day", p, g);
        case "day":
          return !(p.getDate() == g.getDate() && p.getMonth() == g.getMonth() && p.getFullYear() == g.getFullYear());
        case "week":
          return e.date.week_start(new Date(p)).valueOf() != e.date.week_start(new Date(g)).valueOf();
        case "month":
          return !(p.getMonth() == g.getMonth() && p.getFullYear() == g.getFullYear());
        case "year":
          return p.getFullYear() != g.getFullYear();
        default:
          return !1;
      }
    }, e._timeline_reset_scale_height = function(c) {
      if (this._header_resized && (!c || this.second_scale)) {
        e.xy.scale_height /= 2, this._header_resized = !1;
        var p = e._els.dhx_cal_header[0];
        p.className = p.className.replace(/ dhx_second_cal_header/gi, "");
      }
    }, e._timeline_set_full_view = function(c) {
      if (e._timeline_reset_scale_height.call(this, c), c) {
        this.second_scale && !this._header_resized && (this._header_resized = e.xy.scale_height, e.xy.scale_height *= 2, e._els.dhx_cal_header[0].className += " dhx_second_cal_header"), e.set_sizes(), e._init_matrix_tooltip();
        var p = e._min_date;
        if (e._timeline_x_scale.call(this, e._els.dhx_cal_header[0]), e.$container.querySelector(".dhx_timeline_scrollable_data") && this._smartRenderingEnabled()) {
          var g = e._timeline_smart_render.getViewPort(this.scrollHelper), b = e._timeline_smart_render.getVisibleHeader(this, g);
          b && (this.second_scale ? e._els.dhx_cal_header[0].children[1].innerHTML = b : e._els.dhx_cal_header[0].children[0].innerHTML = b);
        }
        e._timeline_y_scale.call(this, e._els.dhx_cal_data[0]), e._min_date = p;
        var x = e._getNavDateElement();
        x && (x.innerHTML = e.templates[this.name + "_date"](e._min_date, e._max_date)), e._mark_now && e._mark_now(), e._timeline_reset_scale_height.call(this, c);
      }
      e._timeline_render_scale_header(this, c), e._timeline_hideToolTip();
    }, e._timeline_hideToolTip = function() {
      e._tooltip && (e._tooltip.style.display = "none", e._tooltip.date = "");
    }, e._timeline_showToolTip = function(c, p, g) {
      if (c.render == "cell") {
        var b = p.x + "_" + p.y, x = c._matrix[p.y][p.x];
        if (!x)
          return e._timeline_hideToolTip();
        if (x.sort(function(M, N) {
          return M.start_date > N.start_date ? 1 : -1;
        }), e._tooltip) {
          if (e._tooltip.date == b)
            return;
          e._tooltip.innerHTML = "";
        } else {
          var k = e._tooltip = document.createElement("div");
          k.className = "dhx_year_tooltip", e.config.rtl && (k.className += " dhx_tooltip_rtl"), document.body.appendChild(k), e.event(k, "click", e._click.dhx_cal_data);
        }
        for (var w = "", E = 0; E < x.length; E++) {
          var D = x[E].color ? "--dhx-scheduler-event-color:" + x[E].color + ";" : "", S = x[E].textColor ? "--dhx-scheduler-event-background:" + x[E].textColor + ";" : "";
          w += "<div class='dhx_tooltip_line' event_id='" + x[E].id + "' " + e.config.event_attribute + "='" + x[E].id + "' style='" + D + S + "'>", w += "<div class='dhx_tooltip_date'>" + (x[E]._timed ? e.templates.event_date(x[E].start_date) : "") + "</div>", w += "<div class='dhx_event_icon icon_details'>&nbsp;</div>", w += e.templates[c.name + "_tooltip"](x[E].start_date, x[E].end_date, x[E]) + "</div>";
        }
        e._tooltip.style.display = "", e._tooltip.style.top = "0px", e.config.rtl && g.left - e._tooltip.offsetWidth >= 0 || document.body.offsetWidth - p.src.offsetWidth - g.left - e._tooltip.offsetWidth < 0 ? e._tooltip.style.left = g.left - e._tooltip.offsetWidth + "px" : e._tooltip.style.left = g.left + p.src.offsetWidth + "px", e._tooltip.date = b, e._tooltip.innerHTML = w, document.body.offsetHeight - g.top - e._tooltip.offsetHeight < 0 ? e._tooltip.style.top = g.top - e._tooltip.offsetHeight + p.src.offsetHeight + "px" : e._tooltip.style.top = g.top + "px";
      }
    }, e._matrix_tooltip_handler = function(c) {
      var p = e.matrix[e._mode];
      if (p && p.render == "cell") {
        if (p) {
          var g = e._locate_cell_timeline(c);
          if (g)
            return e._timeline_showToolTip(p, g, e.$domHelpers.getOffset(g.src));
        }
        e._timeline_hideToolTip();
      }
    }, e._init_matrix_tooltip = function() {
      e._detachDomEvent(e._els.dhx_cal_data[0], "mouseover", e._matrix_tooltip_handler), e.event(e._els.dhx_cal_data[0], "mouseover", e._matrix_tooltip_handler);
    }, e._set_timeline_dates = function(c) {
      e._min_date = e.date[c.name + "_start"](new Date(e._date)), e._max_date = e.date["add_" + c.name + "_private"](e._min_date, c.x_size * c.x_step), e.date[c.x_unit + "_start"] && (e._max_date = e.date[c.x_unit + "_start"](e._max_date)), e._table_view = !0;
    }, e._renderMatrix = function(c, p) {
      this.callEvent("onBeforeRender", []), p || (e._els.dhx_cal_data[0].scrollTop = 0), e._set_timeline_dates(this), e._timeline_set_full_view.call(this, c);
    }, e._timeline_html_index = function(c) {
      for (var p = c.parentNode.childNodes, g = -1, b = 0; b < p.length; b++)
        if (p[b] == c) {
          g = b;
          break;
        }
      var x = g;
      if (e._ignores_detected)
        for (var k in e._ignores)
          e._ignores[k] && 1 * k <= x && x++;
      return x;
    }, e._timeline_locate_hcell = function(c) {
      for (var p = c.target ? c.target : c.srcElement; p && p.tagName != "DIV"; )
        p = p.parentNode;
      if (p && p.tagName == "DIV" && e._getClassName(p).split(" ")[0] == "dhx_scale_bar")
        return { x: e._timeline_html_index(p), y: -1, src: p, scale: !0 };
    }, e._locate_cell_timeline = function(c) {
      for (var p = c.target ? c.target : c.srcElement, g = {}, b = e.matrix[e._mode], x = e.getActionData(c), k = e._ignores, w = 0, E = 0; E < b._trace_x.length - 1 && !(+x.date < b._trace_x[E + 1]); E++)
        k[E] || w++;
      g.x = w === 0 ? 0 : E, g.y = b.order[x.section];
      var D = 0;
      if (b.scrollable && b.render === "cell") {
        if (!b._scales[x.section] || !b._scales[x.section].querySelector(".dhx_matrix_cell"))
          return;
        var S = b._scales[x.section].querySelector(".dhx_matrix_cell");
        if (!S)
          return;
        var M = S.offsetLeft;
        if (M > 0) {
          for (var N = e._timeline_drag_date(b, M), T = 0; T < b._trace_x.length - 1 && !(+N < b._trace_x[T + 1]); T++)
            ;
          D = T;
        }
      }
      g.src = b._scales[x.section] ? b._scales[x.section].querySelectorAll(".dhx_matrix_cell")[E - D] : null;
      var A, C, H = !1, O = (A = p, C = ".dhx_matrix_scell", e.$domHelpers.closest(A, C));
      return O && (p = O, H = !0), H ? (g.x = -1, g.src = p, g.scale = !0) : g.x = E, g;
    };
    var h = e._click.dhx_cal_data;
    e._click.dhx_marked_timespan = e._click.dhx_cal_data = function(c) {
      var p = h.apply(this, arguments), g = e.matrix[e._mode];
      if (g) {
        var b = e._locate_cell_timeline(c);
        b && (b.scale ? e.callEvent("onYScaleClick", [b.y, g.y_unit[b.y], c]) : (e.callEvent("onCellClick", [b.x, b.y, g._trace_x[b.x], (g._matrix[b.y] || {})[b.x] || [], c]), e._timeline_set_scroll_pos(e._els.dhx_cal_data[0], g)));
      }
      return p;
    }, e.dblclick_dhx_matrix_cell = function(c) {
      var p = e.matrix[e._mode];
      if (p) {
        var g = e._locate_cell_timeline(c);
        g && (g.scale ? e.callEvent("onYScaleDblClick", [g.y, p.y_unit[g.y], c]) : e.callEvent("onCellDblClick", [g.x, g.y, p._trace_x[g.x], (p._matrix[g.y] || {})[g.x] || [], c]));
      }
    };
    var y = e.dblclick_dhx_marked_timespan || function() {
    };
    e.dblclick_dhx_marked_timespan = function(c) {
      return e.matrix[e._mode] ? e.dblclick_dhx_matrix_cell(c) : y.apply(this, arguments);
    }, e.dblclick_dhx_matrix_scell = function(c) {
      return e.dblclick_dhx_matrix_cell(c);
    }, e._isRender = function(c) {
      return e.matrix[e._mode] && e.matrix[e._mode].render == c;
    }, e.attachEvent("onCellDblClick", function(c, p, g, b, x) {
      if (!this.config.readonly && (x.type != "dblclick" || this.config.dblclick_create)) {
        var k = e.matrix[e._mode], w = {};
        w.start_date = k._trace_x[c], w.end_date = k._trace_x[c + 1] ? k._trace_x[c + 1] : e.date.add(k._trace_x[c], k.x_step, k.x_unit), k._start_correction && (w.start_date = new Date(1 * w.start_date + k._start_correction)), k._end_correction && (w.end_date = new Date(w.end_date - k._end_correction)), w[k.y_property] = k.y_unit[p].key, e.addEventNow(w, null, x);
      }
    }), e.attachEvent("onBeforeDrag", function(c, p, g) {
      return !e._isRender("cell");
    }), e.attachEvent("onEventChanged", function(c, p) {
      p._timed = this.isOneDayEvent(p);
    }), e.attachEvent("onBeforeEventChanged", function(c, p, g, b) {
      return c && (c._move_delta = void 0), b && (b._move_delta = void 0), !0;
    }), e._is_column_visible = function(c) {
      var p = e.matrix[e._mode], g = e._get_date_index(p, c);
      return !e._ignores[g];
    };
    var m = e._render_marked_timespan;
    e._render_marked_timespan = function(c, p, g, b, x) {
      if (!e.config.display_marked_timespans)
        return [];
      if (e.matrix && e.matrix[e._mode]) {
        if (e._isRender("cell"))
          return;
        var k = e._lame_copy({}, e.matrix[e._mode]);
        k.round_position = !1;
        var w = [], E = [], D = [], S = c.sections ? c.sections.units || c.sections.timeline : null;
        if (g)
          D = [p], E = [g];
        else {
          var M = k.order;
          if (S)
            M.hasOwnProperty(S) && (E.push(S), D.push(k._scales[S]));
          else if (k._scales)
            for (var N in M)
              M.hasOwnProperty(N) && k._scales[N] && (E.push(N), D.push(k._scales[N]));
        }
        if (b = b ? new Date(b) : e._min_date, x = x ? new Date(x) : e._max_date, b.valueOf() < e._min_date.valueOf() && (b = new Date(e._min_date)), x.valueOf() > e._max_date.valueOf() && (x = new Date(e._max_date)), !k._trace_x)
          return;
        for (var T = 0; T < k._trace_x.length && !e._is_column_visible(k._trace_x[T]); T++)
          ;
        if (T == k._trace_x.length)
          return;
        var A = [];
        if (c.days > 6) {
          var C = new Date(c.days);
          e.date.date_part(new Date(b)) <= +C && +x >= +C && A.push(C);
        } else
          A.push.apply(A, e._get_dates_by_index(c.days));
        for (var H = c.zones, O = e._get_css_classes_by_config(c), $ = 0; $ < E.length; $++)
          for (p = D[$], g = E[$], T = 0; T < A.length; T++)
            for (var R = A[T], j = 0; j < H.length; j += 2) {
              var I = H[j], Y = H[j + 1], J = new Date(+R + 60 * I * 1e3), oe = new Date(+R + 60 * Y * 1e3);
              if (J = new Date(J.valueOf() + 1e3 * (J.getTimezoneOffset() - R.getTimezoneOffset()) * 60), b < (oe = new Date(oe.valueOf() + 1e3 * (oe.getTimezoneOffset() - R.getTimezoneOffset()) * 60)) && x > J) {
                var X = e._get_block_by_config(c);
                X.className = O;
                var B = e._timeline_getX({ start_date: J }, !1, k) - 1, se = e._timeline_getX({ start_date: oe }, !1, k) - 1, qe = Math.max(1, se - B - 1), Pe = k._section_height[g] - 1 || k.dy - 1;
                X.style.cssText = "height: " + Pe + "px; " + (e.config.rtl ? "right: " : "left: ") + B + "px; width: " + qe + "px; top: 0;", p.insertBefore(X, p.firstChild), w.push(X);
              }
            }
        return w;
      }
      return m.apply(e, [c, p, g]);
    };
    var f = e._append_mark_now;
    e._append_mark_now = function(c, p) {
      if (e.matrix && e.matrix[e._mode]) {
        var g = e._currentDate(), b = e._get_zone_minutes(g), x = { days: +e.date.date_part(g), zones: [b, b + 1], css: "dhx_matrix_now_time", type: "dhx_now_time" };
        return e._render_marked_timespan(x);
      }
      return f.apply(e, [c, p]);
    };
    var u = e._mark_timespans;
    e._mark_timespans = function() {
      if (e.matrix && e.matrix[e.getState().mode]) {
        for (var c = [], p = e.matrix[e.getState().mode], g = p.y_unit, b = 0; b < g.length; b++) {
          var x = g[b].key, k = p._scales[x], w = e._on_scale_add_marker(k, x);
          c.push.apply(c, w);
        }
        return c;
      }
      return u.apply(this, arguments);
    };
    var v = e._on_scale_add_marker;
    e._on_scale_add_marker = function(c, p) {
      if (e.matrix && e.matrix[e._mode]) {
        var g = [], b = e._marked_timespans;
        if (b && e.matrix && e.matrix[e._mode])
          for (var x = e._mode, k = e._min_date, w = e._max_date, E = b.global, D = e.date.date_part(new Date(k)); D < w; D = e.date.add(D, 1, "day")) {
            var S = +D, M = D.getDay(), N = [];
            if (e.config.overwrite_marked_timespans) {
              var T = E[S] || E[M];
              N.push.apply(N, e._get_configs_to_render(T));
            } else
              E[S] && N.push.apply(N, e._get_configs_to_render(E[S])), E[M] && N.push.apply(N, e._get_configs_to_render(E[M]));
            if (b[x] && b[x][p]) {
              var A = [], C = e._get_types_to_render(b[x][p][M], b[x][p][S]);
              A.push.apply(A, e._get_configs_to_render(C)), e.config.overwrite_marked_timespans ? A.length && (N = A) : N = N.concat(A);
            }
            for (var H = 0; H < N.length; H++) {
              var O = N[H], $ = O.days;
              $ < 7 ? ($ = S, g.push.apply(g, e._render_marked_timespan(O, c, p, D, e.date.add(D, 1, "day"))), $ = M) : g.push.apply(g, e._render_marked_timespan(O, c, p, D, e.date.add(D, 1, "day")));
            }
          }
        return g;
      }
      return v.apply(this, arguments);
    }, e._resolve_timeline_section = function(c, p) {
      for (var g = 0, b = 0; g < this._colsS.heights.length && !((b += this._colsS.heights[g]) > p.y); g++)
        ;
      c.y_unit[g] || (g = c.y_unit.length - 1), this._drag_event && !this._drag_event._orig_section && (this._drag_event._orig_section = c.y_unit[g].key), p.fields = {}, g >= 0 && c.y_unit[g] && (p.section = p.fields[c.y_property] = c.y_unit[g].key);
    }, e._update_timeline_section = function(c) {
      var p = c.view, g = c.event, b = c.pos;
      if (g) {
        if (g[p.y_property] != b.section) {
          var x = this._get_timeline_event_height ? this._get_timeline_event_height(g, p) : p.getEventHeight(g);
          g._sorder = this._get_dnd_order(g._sorder, x, p.getSectionHeight(b.section));
        }
        g[p.y_property] = b.section;
      }
    }, e._get_date_index = function(c, p) {
      for (var g = c._trace_x, b = 0, x = g.length - 1, k = p.valueOf(); x - b > 3; ) {
        var w = b + Math.floor((x - b) / 2);
        g[w].valueOf() > k ? x = w : b = w;
      }
      for (var E = b; E <= x && +p >= +g[E + 1]; )
        E++;
      return E;
    }, e._timeline_drag_date = function(c, p) {
      var g = c, b = p;
      if (!g._trace_x.length)
        return new Date(e.getState().date);
      for (var x, k, w, E = 0, D = 0; D <= this._cols.length - 1; D++)
        if ((E += k = this._cols[D]) > b) {
          x = (x = (b - (E - k)) / k) < 0 ? 0 : x;
          break;
        }
      if (g.round_position) {
        var S = 1, M = e.getState().drag_mode;
        M && M != "move" && M != "create" && (S = 0.5), x >= S && D++, x = 0;
      }
      if (D === 0 && this._ignores[0])
        for (D = 1, x = 0; this._ignores[D]; )
          D++;
      else if (D == this._cols.length && this._ignores[D - 1]) {
        for (D = this._cols.length - 1, x = 0; this._ignores[D]; )
          D--;
        D++;
      }
      if (D >= g._trace_x.length)
        w = e.date.add(g._trace_x[g._trace_x.length - 1], g.x_step, g.x_unit), g._end_correction && (w = new Date(w - g._end_correction));
      else {
        var N = x * k * g._step + g._start_correction;
        w = new Date(+g._trace_x[D] + N);
      }
      return w;
    }, e.attachEvent("onBeforeTodayDisplayed", function() {
      for (var c in e.matrix) {
        var p = e.matrix[c];
        p.x_start = p._original_x_start;
      }
      return !0;
    }), e.attachEvent("onOptionsLoad", function() {
      for (var c in e.matrix) {
        var p = e.matrix[c];
        for (p.order = {}, e.callEvent("onOptionsLoadStart", []), c = 0; c < p.y_unit.length; c++)
          p.order[p.y_unit[c].key] = c;
        e.callEvent("onOptionsLoadFinal", []), e._date && p.name == e._mode && (p._options_changed = !0, e.setCurrentView(e._date, e._mode), setTimeout(function() {
          p._options_changed = !1;
        }));
      }
    }), e.attachEvent("onEventIdChange", function() {
      var c = e.getView();
      c && e.matrix[c.name] && e._timeline_smart_render && (e._timeline_smart_render.clearPreparedEventsCache(), e._timeline_smart_render.getPreparedEvents(c));
    }), e.attachEvent("onBeforeDrag", function(c, p, g) {
      if (p == "resize") {
        var b = g.target || g.srcElement;
        e._getClassName(b).indexOf("dhx_event_resize_end") < 0 ? e._drag_from_start = !0 : e._drag_from_start = !1;
      }
      return !0;
    }), ar(e), function(c) {
      function p(g, b) {
        for (let x = 0; x < g.length; x++)
          if (g[x].id == b)
            return !0;
        return !1;
      }
      c._timeline_smart_render = { _prepared_events_cache: null, _rendered_events_cache: [], _rendered_header_cache: [], _rendered_labels_cache: [], _rows_to_delete: [], _rows_to_add: [], _cols_to_delete: [], _cols_to_add: [], getViewPort: function(g, b, x, k) {
        var w = c.$container.querySelector(".dhx_cal_data"), E = w.getBoundingClientRect(), D = c.$container.querySelector(".dhx_timeline_scrollable_data");
        D && x === void 0 && (x = g.getScrollValue(D)), k === void 0 && (k = D ? D.scrollTop : w.scrollTop);
        var S = {};
        for (var M in E)
          S[M] = E[M];
        return S.scrollLeft = x || 0, S.scrollTop = k || 0, b && (E.height = b), S;
      }, isInXViewPort: function(g, b) {
        var x = b.scrollLeft, k = b.width + b.scrollLeft;
        return g.left < k + 100 && g.right > x - 100;
      }, isInYViewPort: function(g, b) {
        var x = b.scrollTop, k = b.height + b.scrollTop;
        return g.top < k + 80 && g.bottom > x - 80;
      }, getVisibleHeader: function(g, b) {
        var x = "";
        for (var k in this._rendered_header_cache = [], g._h_cols) {
          var w = g._h_cols[k];
          this.isInXViewPort({ left: w.left, right: w.left + c._cols[k] }, b) && (x += w.div.outerHTML, this._rendered_header_cache.push(w.div.getAttribute("data-col-id")));
        }
        return x;
      }, updateHeader: function(g, b, x) {
        this._cols_to_delete = [], this._cols_to_add = [];
        for (var k = c.$container.querySelectorAll(".dhx_cal_header > div"), w = k[k.length - 1].querySelectorAll(".dhx_scale_bar"), E = [], D = 0; D < w.length; D++)
          E.push(w[D].getAttribute("data-col-id"));
        if (this.getVisibleHeader(g, b)) {
          for (var S = this._rendered_header_cache.slice(), M = [], N = (D = 0, E.length); D < N; D++) {
            var T = S.indexOf(E[D]);
            T > -1 ? S.splice(T, 1) : M.push(E[D]);
          }
          M.length && (this._cols_to_delete = M.slice(), this._deleteHeaderCells(M, g, x)), S.length && (this._cols_to_add = S.slice(), this._addHeaderCells(S, g, x));
        }
      }, _deleteHeaderCells: function(g, b, x) {
        for (var k = 0; k < g.length; k++) {
          var w = x.querySelector('[data-col-id="' + g[k] + '"]');
          w && x.removeChild(w);
        }
      }, _addHeaderCells: function(g, b, x) {
        for (var k = "", w = 0; w < g.length; w++)
          k += b._h_cols[g[w]].div.outerHTML;
        const E = document.createElement("template");
        E.innerHTML = k, x.appendChild(E.content);
      }, getVisibleLabels: function(g, b) {
        if (g._label_rows.length) {
          var x = "";
          this._rendered_labels_cache = [];
          for (var k = 0; k < g._label_rows.length; k++)
            this.isInYViewPort({ top: g._label_rows[k].top, bottom: g._label_rows[k].top + g._section_height[g.y_unit[k].key] }, b) && (x += g._label_rows[k].div, this._rendered_labels_cache.push(k));
          return x;
        }
      }, updateLabels: function(g, b, x) {
        this._rows_to_delete = [], this._rows_to_add = [];
        let k = [];
        if (c.$container.querySelectorAll(".dhx_timeline_label_row").forEach((N) => {
          k.push(Number(N.getAttribute("data-row-index")));
        }), k.length || (this.getVisibleLabels(g, b), k = this._rendered_labels_cache.slice()), this.getVisibleLabels(g, b)) {
          for (var w = this._rendered_labels_cache.slice(), E = [], D = 0, S = k.length; D < S; D++) {
            var M = w.indexOf(k[D]);
            M > -1 ? w.splice(M, 1) : E.push(k[D]);
          }
          E.length && (this._rows_to_delete = E.slice(), this._deleteLabelCells(E, g, x)), w.length && (this._rows_to_add = w.slice(), this._addLabelCells(w, g, x));
        }
      }, _deleteLabelCells: function(g, b, x) {
        for (var k = 0; k < g.length; k++) {
          var w = x.querySelector('[data-row-index="' + g[k] + '"]');
          w && x.removeChild(w);
        }
      }, _addLabelCells: function(g, b, x) {
        for (var k = "", w = 0; w < g.length; w++)
          k += b._label_rows[g[w]].div;
        const E = document.createElement("template");
        E.innerHTML = k, x.appendChild(E.content);
      }, clearPreparedEventsCache: function() {
        this.cachePreparedEvents(null);
      }, cachePreparedEvents: function(g) {
        this._prepared_events_cache = g, this._prepared_events_coordinate_cache = g;
      }, getPreparedEvents: function(g) {
        var b;
        if (this._prepared_events_cache) {
          if (b = this._prepared_events_cache, c.getState().drag_id) {
            const x = c.getState().drag_id;
            let k = !1, w = !1;
            b.forEach((E, D) => {
              if (k)
                return;
              const S = g.y_unit[D];
              for (let M = 0; M < E.length; M++) {
                const N = E[M];
                if (N.id == x && N[g.y_property] !== S) {
                  w = !0, E.splice(M, 1), M--;
                  const T = g.order[N[g.y_property]];
                  b[T] != E && b[T] && !p(b[T], N.id) && b[T].push(N);
                }
              }
              w && (k = !0);
            });
          }
        } else
          (b = c._prepare_timeline_events(g)).$coordinates = {}, this.cachePreparedEvents(b);
        return b;
      }, updateEvents: function(g, b) {
        var x = this.getPreparedEvents(g), k = this._rendered_events_cache.slice();
        if (this._rendered_events_cache = [], !c.$container.querySelector(".dhx_cal_data .dhx_timeline_data_col"))
          return;
        const w = [];
        for (var E = 0; E < this._rendered_labels_cache.length; E++) {
          var D = this._rendered_labels_cache[E], S = [];
          const O = g.y_unit[D].key;
          var M = k[D] ? k[D].slice() : [];
          c._timeline_calculate_event_positions.call(g, x[D]);
          for (var N = c._timeline_smart_render.getVisibleEventsForRow(g, b, x, D), T = 0, A = N.length; T < A; T++) {
            var C = M.indexOf(String(N[T].id));
            if (C > -1)
              if (c.getState().drag_id == N[T].id)
                for (let R = 0; R < M.length; R++)
                  M[R] == N[T].id && (M.splice(R, 1), R--);
              else
                M.splice(C, 1);
            else
              S.push(N[T]);
          }
          var H = g._divBySectionId[O];
          if (!H)
            continue;
          M.length && this._deleteEvents(M, g, H);
          const $ = { DOMParent: H, buffer: document.createElement("template") };
          w.push($), S.length && this._addEvents(S, g, $.buffer, D);
        }
        w.forEach(function(O) {
          O.DOMParent.appendChild(O.buffer.content);
        }), c._populate_timeline_rendered(c.$container), g._matrix = x;
      }, _deleteEvents: function(g, b, x) {
        for (var k = 0; k < g.length; k++) {
          const E = "[" + c.config.event_attribute + '="' + g[k] + '"]';
          var w = x.querySelector(E);
          if (w)
            if (w.classList.contains("dhx_in_move")) {
              const D = x.querySelectorAll(E);
              for (let S = 0; S < D.length; S++)
                D[S].classList.contains("dhx_in_move") || D[S].remove();
            } else
              w.remove();
        }
      }, _addEvents: function(g, b, x, k) {
        var w = c._timeline_update_events_html.call(b, g);
        x.innerHTML = w;
      }, getVisibleEventsForRow: function(g, b, x, k) {
        var w = [];
        if (g.render == "cell")
          w = x;
        else {
          var E = x[k];
          if (E)
            for (var D = 0, S = E.length; D < S; D++) {
              var M, N, T = E[D], A = k + "_" + T.id;
              x.$coordinates && x.$coordinates[A] ? (M = x.$coordinates[A].xStart, N = x.$coordinates[A].xEnd) : (M = c._timeline_getX(T, !1, g), N = c._timeline_getX(T, !0, g), x.$coordinates && (x.$coordinates[A] = { xStart: M, xEnd: N })), c._timeline_smart_render.isInXViewPort({ left: M, right: N }, b) && (w.push(T), this._rendered_events_cache[k] || (this._rendered_events_cache[k] = []), this._rendered_events_cache[k].push(String(T.id)));
            }
        }
        return w;
      }, getVisibleRowCellsHTML: function(g, b, x, k, w) {
        for (var E, D = "", S = this._rendered_header_cache, M = 0; M < S.length; M++) {
          var N = S[M];
          E = g._h_cols[N].left - g.dx, c._ignores[N] ? g.render == "cell" ? D += c._timeline_get_html_for_cell_ignores(x) : D += c._timeline_get_html_for_bar_ignores() : g.render == "cell" ? D += c._timeline_get_html_for_cell(N, w, g, k[w][N], x, E) : D += c._timeline_get_html_for_bar(N, w, g, k[w], E);
        }
        return D;
      }, getVisibleTimelineRowsHTML: function(g, b, x, k) {
        var w = "", E = c._timeline_get_cur_row_stats(g, k);
        E = c._timeline_get_fit_events_stats(g, k, E);
        var D = g._label_rows[k], S = c.templates[g.name + "_row_class"], M = { view: g, section: D.section, template: S };
        return g.render == "cell" ? (w += c._timeline_get_html_for_cell_data_row(k, E, D.top, D.section.key, M), w += this.getVisibleRowCellsHTML(g, b, E, x, k), w += "</div>") : (w += c._timeline_get_html_for_bar_matrix_line(k, E, D.top, D.section.key, M), w += c._timeline_get_html_for_bar_data_row(E, M), w += this.getVisibleRowCellsHTML(g, b, E, x, k), w += "</div></div>"), w;
      }, updateGridRows: function(g, b) {
        this._rows_to_delete.length && this._deleteGridRows(this._rows_to_delete, g), this._rows_to_add.length && this._addGridRows(this._rows_to_add, g, b);
      }, _deleteGridRows: function(g, b) {
        if (c.$container.querySelector(".dhx_cal_data .dhx_timeline_data_col")) {
          for (var x = 0; x < g.length; x++) {
            const k = b.y_unit[g[x]] ? b.y_unit[g[x]].key : null;
            b._divBySectionId[k] && (b._divBySectionId[k].remove(), delete b._divBySectionId[k]);
          }
          this._rows_to_delete = [];
        }
      }, _addGridRows: function(g, b, x) {
        if (!(S = c.$container.querySelector(".dhx_cal_data .dhx_timeline_data_col")))
          return;
        for (var k = this.getPreparedEvents(b), w = "", E = 0; E < g.length; E++)
          w += this.getVisibleTimelineRowsHTML(b, x, k, g[E]);
        const D = document.createElement("template");
        D.innerHTML = w, S.appendChild(D.content);
        var S = c.$container.querySelector(".dhx_cal_data .dhx_timeline_data_col");
        b._divBySectionId = {};
        for (let N = 0, T = S.children.length; N < T; N++) {
          var M = S.children[N];
          M.hasAttribute("data-section-id") && (b._divBySectionId[M.getAttribute("data-section-id")] = M);
        }
        for (E = 0; E < g.length; E++) {
          const N = b.y_unit[g[E]] ? b.y_unit[g[E]].key : null;
          c._timeline_finalize_section_add(b, b.y_unit[g[E]].key, b._divBySectionId[N]);
        }
        c._mark_now && c._mark_now(), this._rows_to_add = [];
      }, updateGridCols: function(g, b) {
        for (var x = this._rendered_header_cache, k = {}, w = 0; w < x.length; w++)
          k[x[w]] = !0;
        c.$container.querySelectorAll(".dhx_timeline_data_row").forEach((function(E) {
          const D = E.querySelectorAll("[data-col-id]"), S = Array.prototype.reduce.call(D, function(A, C) {
            return A[C.dataset.colId] = C, A;
          }, {});
          var M = [], N = [];
          for (var T in S)
            k[T] || M.push(S[T]);
          for (var T in k)
            S[T] || N.push(T);
          M.forEach(function(A) {
            A.remove();
          }), N.length && this._addGridCols(E, N, g, b);
        }).bind(this));
      }, _addGridCols: function(g, b, x, k) {
        if (!c.$container.querySelector(".dhx_cal_data .dhx_timeline_data_col"))
          return;
        var w = this.getPreparedEvents(x);
        const E = g.closest("[data-section-id]").getAttribute("data-section-id"), D = x.order[E];
        var S = "", M = c._timeline_get_cur_row_stats(x, D);
        M = c._timeline_get_fit_events_stats(x, D, M);
        var N = g;
        if (N) {
          for (var T = 0; T < b.length; T++)
            if (!N.querySelector('[data-col-id="' + b[T] + '"]')) {
              var A = this.getVisibleGridCell(x, k, M, w, D, b[T]);
              A && (S += A);
            }
          const C = document.createElement("template");
          C.innerHTML = S, N.appendChild(C.content);
        }
      }, getVisibleGridCell: function(g, b, x, k, w, E) {
        if (g._h_cols[E]) {
          var D = "", S = g._h_cols[E].left - g.dx;
          return g.render == "cell" ? c._ignores[E] || (D += c._timeline_get_html_for_cell(E, w, g, k[w][E], x, S)) : c._ignores[E] || (D += c._timeline_get_html_for_bar(E, w, g, k[w], S)), D;
        }
      } }, c.attachEvent("onClearAll", function() {
        c._timeline_smart_render._prepared_events_cache = null, c._timeline_smart_render._rendered_events_cache = [];
      });
    }(e);
  }, e._temp_matrix_scope();
}, tooltip: function(e) {
  e.config.tooltip_timeout = 30, e.config.tooltip_offset_y = 20, e.config.tooltip_offset_x = 10, e.config.tooltip_hide_timeout = 30;
  const i = new ir(e);
  e.ext.tooltips = i, e.attachEvent("onSchedulerReady", function() {
    i.tooltipFor({ selector: "[" + e.config.event_attribute + "]", html: (t) => {
      if (e._mobile && !e.config.touch_tooltip)
        return;
      const n = e._locate_event(t.target);
      if (e.getEvent(n)) {
        const s = e.getEvent(n);
        return e.templates.tooltip_text(s.start_date, s.end_date, s);
      }
      return null;
    }, global: !1 });
  }), e.attachEvent("onDestroy", function() {
    i.destructor();
  }), e.attachEvent("onLightbox", function() {
    i.hideTooltip();
  }), e.attachEvent("onBeforeDrag", function() {
    return i.hideTooltip(), !0;
  }), e.attachEvent("onEventDeleted", function() {
    return i.hideTooltip(), !0;
  });
}, treetimeline: function(e) {
  var i;
  e.attachEvent("onTimelineCreated", function(t) {
    t.render == "tree" && (t.y_unit_original = t.y_unit, t.y_unit = e._getArrayToDisplay(t.y_unit_original), e.attachEvent("onOptionsLoadStart", function() {
      t.y_unit = e._getArrayToDisplay(t.y_unit_original);
    }), e.form_blocks[t.name] = { render: function(n) {
      return "<div class='dhx_section_timeline' style='overflow: hidden;'></div>";
    }, set_value: function(n, s, r, _) {
      var d = e._getArrayForSelect(e.matrix[_.type].y_unit_original, _.type);
      n.innerHTML = "";
      var a = document.createElement("select");
      n.appendChild(a);
      var o = n.getElementsByTagName("select")[0];
      !o._dhx_onchange && _.onchange && (o.addEventListener("change", _.onchange), o._dhx_onchange = !0);
      for (var l = 0; l < d.length; l++) {
        var h = document.createElement("option");
        h.value = d[l].key, h.value == r[e.matrix[_.type].y_property] && (h.selected = !0), h.innerHTML = d[l].label, o.appendChild(h);
      }
    }, get_value: function(n, s, r) {
      return n.firstChild.value;
    }, focus: function(n) {
    } });
  }), e.attachEvent("onBeforeSectionRender", function(t, n, s) {
    var r, _, d, a, o, l, h = {};
    return t == "tree" && (a = "dhx_matrix_scell dhx_treetimeline", n.children ? (r = s.folder_dy || s.dy, s.folder_dy && !s.section_autoheight && (d = "height:" + s.folder_dy + "px;"), _ = "dhx_row_folder", a += " folder", n.open ? a += " opened" : a += " closed", o = "<div class='dhx_scell_expand'></div>", l = s.folder_events_available ? "dhx_data_table folder_events" : "dhx_data_table folder") : (r = s.dy, _ = "dhx_row_item", a += " item", o = "", l = "dhx_data_table"), s.columns && (a += " dhx_matrix_scell_columns"), h = { height: r, style_height: d, tr_className: _, td_className: a += e.templates[s.name + "_scaley_class"](n.key, n.label, n) ? " " + e.templates[s.name + "_scaley_class"](n.key, n.label, n) : "", td_content: s.columns && s.columns.length ? "<div class='dhx_scell_name'><div class='dhx_scell_level dhx_scell_level" + n.level + "'>" + o + "</div>" + (e.templates[s.name + "_scale_label"](n.key, n.label, n) || n.label) + "</div>" : "<div class='dhx_scell_level" + n.level + "'>" + o + "<div class='dhx_scell_name'>" + (e.templates[s.name + "_scale_label"](n.key, n.label, n) || n.label) + "</div></div>", table_className: l }), h;
  }), e.attachEvent("onBeforeEventChanged", function(t, n, s) {
    if (e._isRender("tree"))
      for (var r = e._get_event_sections ? e._get_event_sections(t) : [t[e.matrix[e._mode].y_property]], _ = 0; _ < r.length; _++) {
        var d = e.getSection(r[_]);
        if (d && d.children && !e.matrix[e._mode].folder_events_available)
          return s || (t[e.matrix[e._mode].y_property] = i), !1;
      }
    return !0;
  }), e.attachEvent("onBeforeDrag", function(t, n, s) {
    if (e._isRender("tree")) {
      var r, _ = e._locate_cell_timeline(s);
      if (_ && (r = e.matrix[e._mode].y_unit[_.y].key, e.matrix[e._mode].y_unit[_.y].children && !e.matrix[e._mode].folder_events_available))
        return !1;
      var d = e.getEvent(t), a = e.matrix[e._mode].y_property;
      i = d && d[a] ? d[a] : r;
    }
    return !0;
  }), e._getArrayToDisplay = function(t) {
    var n = [], s = function(r, _, d, a) {
      for (var o = _ || 0, l = 0; l < r.length; l++) {
        var h = r[l];
        h.level = o, h.$parent = d || null, h.children && h.key === void 0 && (h.key = e.uid()), a || n.push(h), h.children && s(h.children, o + 1, h.key, a || !h.open);
      }
    };
    return s(t), n;
  }, e._getArrayForSelect = function(t, n) {
    var s = [], r = function(_) {
      for (var d = 0; d < _.length; d++)
        e.matrix[n].folder_events_available ? s.push(_[d]) : _[d].children || s.push(_[d]), _[d].children && r(_[d].children);
    };
    return r(t), s;
  }, e._toggleFolderDisplay = function(t, n, s) {
    var r = function(d, a, o, l) {
      for (var h = 0; h < a.length && (a[h].key != d && !l || !a[h].children || (a[h].open = o !== void 0 ? o : !a[h].open, l)); h++)
        a[h].children && r(d, a[h].children, o, l);
    }, _ = e.getSection(t);
    n !== void 0 || s || (n = !_.open), e.callEvent("onBeforeFolderToggle", [_, n, s]) && (r(t, e.matrix[e._mode].y_unit_original, n, s), e.matrix[e._mode].y_unit = e._getArrayToDisplay(e.matrix[e._mode].y_unit_original), e.callEvent("onOptionsLoad", []), e.callEvent("onAfterFolderToggle", [_, n, s]));
  }, e.attachEvent("onCellClick", function(t, n, s, r, _) {
    e._isRender("tree") && (e.matrix[e._mode].folder_events_available || e.matrix[e._mode].y_unit[n] !== void 0 && e.matrix[e._mode].y_unit[n].children && e._toggleFolderDisplay(e.matrix[e._mode].y_unit[n].key));
  }), e.attachEvent("onYScaleClick", function(t, n, s) {
    e._isRender("tree") && n.children && e._toggleFolderDisplay(n.key);
  }), e.getSection = function(t) {
    if (e._isRender("tree")) {
      var n, s = function(r, _) {
        for (var d = 0; d < _.length; d++)
          _[d].key == r && (n = _[d]), _[d].children && s(r, _[d].children);
      };
      return s(t, e.matrix[e._mode].y_unit_original), n || null;
    }
  }, e.deleteSection = function(t) {
    if (e._isRender("tree")) {
      var n = !1, s = function(r, _) {
        for (var d = 0; d < _.length && (_[d].key == r && (_.splice(d, 1), n = !0), !n); d++)
          _[d].children && s(r, _[d].children);
      };
      return s(t, e.matrix[e._mode].y_unit_original), e.matrix[e._mode].y_unit = e._getArrayToDisplay(e.matrix[e._mode].y_unit_original), e.callEvent("onOptionsLoad", []), n;
    }
  }, e.deleteAllSections = function() {
    e._isRender("tree") && (e.matrix[e._mode].y_unit_original = [], e.matrix[e._mode].y_unit = e._getArrayToDisplay(e.matrix[e._mode].y_unit_original), e.callEvent("onOptionsLoad", []));
  }, e.addSection = function(t, n) {
    if (e._isRender("tree")) {
      var s = !1, r = function(_, d, a) {
        if (n)
          for (var o = 0; o < a.length && (a[o].key == d && a[o].children && (a[o].children.push(_), s = !0), !s); o++)
            a[o].children && r(_, d, a[o].children);
        else
          a.push(_), s = !0;
      };
      return r(t, n, e.matrix[e._mode].y_unit_original), e.matrix[e._mode].y_unit = e._getArrayToDisplay(e.matrix[e._mode].y_unit_original), e.callEvent("onOptionsLoad", []), s;
    }
  }, e.openAllSections = function() {
    e._isRender("tree") && e._toggleFolderDisplay(1, !0, !0);
  }, e.closeAllSections = function() {
    e._isRender("tree") && e._toggleFolderDisplay(1, !1, !0);
  }, e.openSection = function(t) {
    e._isRender("tree") && e._toggleFolderDisplay(t, !0);
  }, e.closeSection = function(t) {
    e._isRender("tree") && e._toggleFolderDisplay(t, !1);
  };
}, units: function(e) {
  e._props = {}, e.createUnitsView = function(i, t, n, s, r, _, d) {
    function a(h) {
      return Math.round((e._correct_shift(+h, 1) - +e._min_date) / 864e5);
    }
    typeof i == "object" && (n = i.list, t = i.property, s = i.size || 0, r = i.step || 1, _ = i.skip_incorrect, d = i.days || 1, i = i.name), e._props[i] = { map_to: t, options: n, step: r, position: 0, days: d, layout: "units" }, s > e._props[i].options.length && (e._props[i]._original_size = s, s = 0), e._props[i].size = s, e._props[i].skip_incorrect = _ || !1, e.date[i + "_start"] = e.date.day_start, e.templates[i + "_date"] = function(h, y) {
      return e._props[i].days > 1 ? e.templates.week_date(h, y) : e.templates.day_date(h);
    }, e._get_unit_index = function(h, y) {
      var m = h.position || 0, f = a(y), u = h.size || h.options.length;
      return f >= u && (f %= u), m + f;
    }, e.templates[i + "_scale_text"] = function(h, y, m) {
      return m.css ? "<span class='" + m.css + "'>" + y + "</span>" : y;
    }, e.templates[i + "_scale_date"] = function(h) {
      var y = e._props[i], m = y.options;
      if (!m.length)
        return "";
      var f = m[e._get_unit_index(y, h)], u = a(h), v = y.size || y.options.length, c = e.date.add(e.getState().min_date, Math.floor(u / v), "day");
      return e.templates[i + "_scale_text"](f.key, f.label, f, c);
    }, e.templates[i + "_second_scale_date"] = function(h) {
      return e.templates.week_scale_date(h);
    }, e.date["add_" + i] = function(h, y) {
      return e.date.add(h, y * e._props[i].days, "day");
    }, e.date["get_" + i + "_end"] = function(h) {
      return e.date.add(h, (e._props[i].size || e._props[i].options.length) * e._props[i].days, "day");
    }, e.attachEvent("onOptionsLoad", function() {
      for (var h = e._props[i], y = h.order = {}, m = h.options, f = 0; f < m.length; f++)
        y[m[f].key] = f;
      h._original_size && h.size === 0 && (h.size = h._original_size, delete h._original_size), h.size > m.length ? (h._original_size = h.size, h.position = 0, h.size = 0) : h.size = h._original_size || h.size, e._date && e._mode == i && e.setCurrentView(e._date, e._mode);
    }), e["mouse_" + i] = function(h) {
      var y = e._props[this._mode];
      if (y) {
        if (h = this._week_indexes_from_pos(h), this._drag_event || (this._drag_event = {}), this._drag_id && this._drag_mode && (this._drag_event._dhx_changed = !0), this._drag_mode && this._drag_mode == "new-size") {
          var m = e._get_event_sday(e._events[e._drag_id]);
          Math.floor(h.x / y.options.length) != Math.floor(m / y.options.length) && (h.x = m);
        }
        var f = y.size || y.options.length, u = h.x % f, v = Math.min(u + y.position, y.options.length - 1);
        h.section = (y.options[v] || {}).key, h.x = Math.floor(h.x / f);
        var c = this.getEvent(this._drag_id);
        this._update_unit_section({ view: y, event: c, pos: h });
      }
      return h.force_redraw = !0, h;
    };
    var o = !1;
    function l() {
      o && (e.xy.scale_height /= 2, o = !1);
    }
    e[i + "_view"] = function(h) {
      var y = e._props[e._mode];
      h ? (y && y.days > 1 ? o || (o = e.xy.scale_height, e.xy.scale_height = 2 * e.xy.scale_height) : l(), e._reset_scale()) : l();
    }, e.callEvent("onOptionsLoad", []);
  }, e._update_unit_section = function(i) {
    var t = i.view, n = i.event, s = i.pos;
    n && (n[t.map_to] = s.section);
  }, e.scrollUnit = function(i) {
    var t = e._props[this._mode];
    t && (t.position = Math.min(Math.max(0, t.position + i), t.options.length - t.size), this.setCurrentView());
  }, function() {
    var i = function(f) {
      var u = e._props[e._mode];
      if (u && u.order && u.skip_incorrect) {
        for (var v = [], c = 0; c < f.length; c++)
          u.order[f[c][u.map_to]] !== void 0 && v.push(f[c]);
        f.splice(0, f.length), f.push.apply(f, v);
      }
      return f;
    }, t = e._pre_render_events_table;
    e._pre_render_events_table = function(f, u) {
      return f = i(f), t.apply(this, [f, u]);
    };
    var n = e._pre_render_events_line;
    e._pre_render_events_line = function(f, u) {
      return f = i(f), n.apply(this, [f, u]);
    };
    var s = function(f, u) {
      if (f && f.order[u[f.map_to]] === void 0) {
        var v = e, c = Math.floor((u.end_date - v._min_date) / 864e5);
        return f.options.length && (u[f.map_to] = f.options[Math.min(c + f.position, f.options.length - 1)].key), !0;
      }
    }, r = e.is_visible_events;
    e.is_visible_events = function(f) {
      var u = r.apply(this, arguments);
      if (u) {
        var v = e._props[this._mode];
        if (v && v.size) {
          var c = v.order[f[v.map_to]];
          if (c < v.position || c >= v.size + v.position)
            return !1;
        }
      }
      return u;
    };
    var _ = e._process_ignores;
    e._process_ignores = function(f, u, v, c, p) {
      if (e._props[this._mode]) {
        this._ignores = {}, this._ignores_detected = 0;
        var g = e["ignore_" + this._mode];
        if (g) {
          var b = e._props && e._props[this._mode] ? e._props[this._mode].size || e._props[this._mode].options.length : 1;
          u /= b;
          for (var x = new Date(f), k = 0; k < u; k++) {
            if (g(x))
              for (var w = (k + 1) * b, E = k * b; E < w; E++)
                this._ignores_detected += 1, this._ignores[E] = !0, p && u++;
            x = e.date.add(x, c, v), e.date[v + "_start"] && (x = e.date[v + "_start"](x));
          }
        }
      } else
        _.call(this, f, u, v, c, p);
    };
    var d = e._reset_scale;
    e._reset_scale = function() {
      var f = e._props[this._mode];
      f && (f.size && f.position && f.size + f.position > f.options.length ? f.position = Math.max(0, f.options.length - f.size) : f.size || (f.position = 0));
      var u = d.apply(this, arguments);
      if (f) {
        this._max_date = this.date.add(this._min_date, f.days, "day");
        for (var v = this._els.dhx_cal_data[0].childNodes, c = 0; c < v.length; c++)
          v[c].classList.remove("dhx_scale_holder_now");
        var p = this._currentDate();
        if (p.valueOf() >= this._min_date && p.valueOf() < this._max_date) {
          var g = Math.floor((p - e._min_date) / 864e5), b = f.size || f.options.length, x = g * b, k = x + b;
          for (c = x; c < k; c++)
            v[c] && v[c].classList.add("dhx_scale_holder_now");
        }
        if (f.size && f.size < f.options.length) {
          var w = this._els.dhx_cal_header[0], E = document.createElement("div");
          f.position && (this._waiAria.headerButtonsAttributes(E, ""), e.config.rtl ? (E.className = "dhx_cal_next_button", E.style.cssText = "left:auto;margin-top:1px;right:0px;position:absolute;") : (E.className = "dhx_cal_prev_button", E.style.cssText = "left:1px;margin-top:1px;position:absolute;"), w.firstChild.appendChild(E), E.addEventListener("click", function(D) {
            e.scrollUnit(-1 * f.step), D.preventDefault();
          })), f.position + f.size < f.options.length && (this._waiAria.headerButtonsAttributes(E, ""), E = document.createElement("div"), e.config.rtl ? (E.className = "dhx_cal_prev_button", E.style.cssText = "left:1px;margin-top:1px;position:absolute;") : (E.className = "dhx_cal_next_button", E.style.cssText = "left:auto;margin-top:1px;right:0px;position:absolute;"), w.lastChild.appendChild(E), E.addEventListener("click", function() {
            e.scrollUnit(f.step);
          }));
        }
      }
      return u;
    };
    var a = e._get_view_end;
    e._get_view_end = function() {
      var f = e._props[this._mode];
      if (f && f.days > 1) {
        var u = this._get_timeunit_start();
        return e.date.add(u, f.days, "day");
      }
      return a.apply(this, arguments);
    };
    var o = e._render_x_header;
    e._render_x_header = function(f, u, v, c) {
      var p = e._props[this._mode];
      if (!p || p.days <= 1)
        return o.apply(this, arguments);
      if (p.days > 1) {
        var g = c.querySelector(".dhx_second_cal_header");
        g || ((g = document.createElement("div")).className = "dhx_second_cal_header", c.appendChild(g));
        var b = e.xy.scale_height;
        e.xy.scale_height = Math.ceil(b / 2), o.call(this, f, u, v, g, Math.ceil(e.xy.scale_height));
        var x = p.size || p.options.length;
        if ((f + 1) % x == 0) {
          var k = document.createElement("div");
          k.className = "dhx_scale_bar dhx_second_scale_bar";
          var w = this.date.add(this._min_date, Math.floor(f / x), "day");
          this.templates[this._mode + "_second_scalex_class"] && (k.className += " " + this.templates[this._mode + "_second_scalex_class"](new Date(w)));
          var E, D = this._cols[f] * x;
          E = x > 1 && this.config.rtl ? this._colsS[f - (x - 1)] - this.xy.scroll_width : x > 1 ? this._colsS[f - (x - 1)] - this.xy.scale_width : u, this.set_xy(k, D, this.xy.scale_height, E, 0), k.innerHTML = this.templates[this._mode + "_second_scale_date"](new Date(w), this._mode), g.appendChild(k);
        }
        e.xy.scale_height = b;
      }
    };
    var l = e._get_event_sday;
    e._get_event_sday = function(f) {
      var u = e._props[this._mode];
      return u ? u.days <= 1 ? (s(u, f), this._get_section_sday(f[u.map_to])) : Math.floor((f.end_date.valueOf() - 1 - 60 * f.end_date.getTimezoneOffset() * 1e3 - (e._min_date.valueOf() - 60 * e._min_date.getTimezoneOffset() * 1e3)) / 864e5) * (u.size || u.options.length) + u.order[f[u.map_to]] - u.position : l.call(this, f);
    }, e._get_section_sday = function(f) {
      var u = e._props[this._mode];
      return u.order[f] - u.position;
    };
    var h = e.locate_holder_day;
    e.locate_holder_day = function(f, u, v) {
      var c, p = e._props[this._mode];
      return p ? (v ? s(p, v) : (v = { start_date: f, end_date: f }, c = 0), p.days <= 1 ? 1 * (c === void 0 ? p.order[v[p.map_to]] : c) + (u ? 1 : 0) - p.position : Math.floor((v.start_date.valueOf() - e._min_date.valueOf()) / 864e5) * (p.size || p.options.length) + 1 * (c === void 0 ? p.order[v[p.map_to]] : c) + (u ? 1 : 0) - p.position) : h.apply(this, arguments);
    };
    var y = e._time_order;
    e._time_order = function(f) {
      var u = e._props[this._mode];
      u ? f.sort(function(v, c) {
        return u.order[v[u.map_to]] > u.order[c[u.map_to]] ? 1 : -1;
      }) : y.apply(this, arguments);
    };
    var m = e._pre_render_events_table;
    e._pre_render_events_table = function(f, u) {
      var v = e._props[this._mode];
      if (v && v.days > 1) {
        for (var c, p = {}, g = 0; g < f.length; g++) {
          var b = f[g];
          if (e.isOneDayEvent(f[g]))
            p[w = +e.date.date_part(new Date(b.start_date))] || (p[w] = []), p[w].push(b);
          else {
            var x = new Date(Math.min(+b.end_date, +this._max_date)), k = new Date(Math.max(+b.start_date, +this._min_date));
            for (k = e.date.day_start(k), f.splice(g, 1), g--; +k < +x; ) {
              var w, E = this._copy_event(b);
              E.start_date = k, E.end_date = T(E.start_date), k = e.date.add(k, 1, "day"), p[w = +e.date.date_part(new Date(k))] || (p[w] = []), p[w].push(E);
            }
          }
        }
        f = [];
        for (var g in p) {
          var D = m.apply(this, [p[g], u]), S = this._colsS.heights;
          (!c || S[0] > c[0]) && (c = S.slice()), f.push.apply(f, D);
        }
        var M = this._colsS.heights;
        for (M.splice(0, M.length), M.push.apply(M, c), g = 0; g < f.length; g++)
          if (this._ignores[f[g]._sday])
            f.splice(g, 1), g--;
          else {
            var N = f[g];
            N._first_chunk = N._last_chunk = !1, this.getEvent(N.id)._sorder = N._sorder;
          }
        f.sort(function(A, C) {
          return A.start_date.valueOf() == C.start_date.valueOf() ? A.id > C.id ? 1 : -1 : A.start_date > C.start_date ? 1 : -1;
        });
      } else
        f = m.apply(this, [f, u]);
      function T(A) {
        var C = e.date.add(A, 1, "day");
        return C = e.date.date_part(C);
      }
      return f;
    }, e.attachEvent("onEventAdded", function(f, u) {
      if (this._loading)
        return !0;
      for (var v in e._props) {
        var c = e._props[v];
        u[c.map_to] === void 0 && c.options[0] && (u[c.map_to] = c.options[0].key);
      }
      return !0;
    }), e.attachEvent("onEventCreated", function(f, u) {
      var v = e._props[this._mode];
      if (v && u) {
        var c = this.getEvent(f);
        s(v, c);
        var p = this._mouse_coords(u);
        this._update_unit_section({ view: v, event: c, pos: p }), this.event_updated(c);
      }
      return !0;
    });
  }();
}, url: function(e) {
  e._get_url_nav = function() {
    for (var i = {}, t = (document.location.hash || "").replace("#", "").split(","), n = 0; n < t.length; n++) {
      var s = t[n].split("=");
      s.length == 2 && (i[s[0]] = s[1]);
    }
    return i;
  }, e.attachEvent("onTemplatesReady", function() {
    var i = !0, t = e.date.str_to_date("%Y-%m-%d"), n = e.date.date_to_str("%Y-%m-%d"), s = e._get_url_nav().event || null;
    function r(_) {
      if (e.$destroyed)
        return !0;
      s = _, e.getEvent(_) && e.showEvent(_);
    }
    e.attachEvent("onAfterEventDisplay", function(_) {
      return s = null, !0;
    }), e.attachEvent("onBeforeViewChange", function(_, d, a, o) {
      if (i) {
        i = !1;
        var l = e._get_url_nav();
        if (l.event)
          try {
            if (e.getEvent(l.event))
              return setTimeout(function() {
                r(l.event);
              }), !1;
            var h = e.attachEvent("onXLE", function() {
              setTimeout(function() {
                r(l.event);
              }), e.detachEvent(h);
            });
          } catch {
          }
        if (l.date || l.mode) {
          try {
            this.setCurrentView(l.date ? t(l.date) : null, l.mode || null);
          } catch {
            this.setCurrentView(l.date ? t(l.date) : null, a);
          }
          return !1;
        }
      }
      var y = ["date=" + n(o || d), "mode=" + (a || _)];
      s && y.push("event=" + s);
      var m = "#" + y.join(",");
      return document.location.hash = m, !0;
    });
  });
}, week_agenda: function(e) {
  var i;
  e._wa = {}, e.xy.week_agenda_scale_height = 20, e.templates.week_agenda_event_text = function(t, n, s, r) {
    return e.templates.event_date(t) + " " + s.text;
  }, e.date.week_agenda_start = e.date.week_start, e.date.week_agenda_end = function(t) {
    return e.date.add(t, 7, "day");
  }, e.date.add_week_agenda = function(t, n) {
    return e.date.add(t, 7 * n, "day");
  }, e.attachEvent("onSchedulerReady", function() {
    var t = e.templates;
    t.week_agenda_date || (t.week_agenda_date = t.week_date);
  }), i = e.date.date_to_str("%l, %F %d"), e.templates.week_agenda_scale_date = function(t) {
    return i(t);
  }, e.attachEvent("onTemplatesReady", function() {
    var t = e.render_data;
    function n(s) {
      return `<div class='dhx_wa_day_cont'>
	<div class='dhx_wa_scale_bar'></div>
	<div class='dhx_wa_day_data' data-day='${s}'></div>
</div>`;
    }
    e.render_data = function(s) {
      if (this._mode != "week_agenda")
        return t.apply(this, arguments);
      e.week_agenda_view(!0);
    }, e.week_agenda_view = function(s) {
      e._min_date = e.date.week_start(e._date), e._max_date = e.date.add(e._min_date, 1, "week"), e.set_sizes(), s ? (e._table_view = e._allow_dnd = !0, e.$container.querySelector(".dhx_cal_header").style.display = "none", e._els.dhx_cal_date[0].innerHTML = "", function() {
        e._els.dhx_cal_data[0].innerHTML = "", e._rendered = [];
        var r = `<div class="dhx_week_agenda_wrapper">
<div class='dhx_wa_column'>
	${n(0)}
	${n(1)}
	${n(2)}
</div>
<div class='dhx_wa_column'>
	${n(3)}
	${n(4)}
	${n(5)}
	${n(6)}
</div>
</div>`, _ = e._getNavDateElement();
        _ && (_.innerHTML = e.templates[e._mode + "_date"](e._min_date, e._max_date, e._mode)), e._els.dhx_cal_data[0].innerHTML = r;
        const d = e.$container.querySelectorAll(".dhx_wa_day_cont");
        e._wa._selected_divs = [];
        for (var a = e.get_visible_events(), o = e.date.week_start(e._date), l = e.date.add(o, 1, "day"), h = 0; h < 7; h++) {
          d[h]._date = o, d[h].setAttribute("data-date", e.templates.format_date(o)), e._waiAria.weekAgendaDayCell(d[h], o);
          var y = d[h].querySelector(".dhx_wa_scale_bar"), m = d[h].querySelector(".dhx_wa_day_data");
          y.innerHTML = e.templates.week_agenda_scale_date(o);
          for (var f = [], u = 0; u < a.length; u++) {
            var v = a[u];
            v.start_date < l && v.end_date > o && f.push(v);
          }
          f.sort(function(k, w) {
            return k.start_date.valueOf() == w.start_date.valueOf() ? k.id > w.id ? 1 : -1 : k.start_date > w.start_date ? 1 : -1;
          });
          for (var c = 0; c < f.length; c++) {
            var p = f[c], g = document.createElement("div");
            e._rendered.push(g);
            var b = e.templates.event_class(p.start_date, p.end_date, p);
            g.classList.add("dhx_wa_ev_body"), b && g.classList.add(b), e.config.rtl && g.classList.add("dhx_wa_ev_body_rtl"), p._text_style && (g.style.cssText = p._text_style), p.color && g.style.setProperty("--dhx-scheduler-event-background", p.color), p.textColor && g.style.setProperty("--dhx-scheduler-event-color", p.textColor), e._select_id && p.id == e._select_id && (e.config.week_agenda_select || e.config.week_agenda_select === void 0) && (g.classList.add("dhx_cal_event_selected"), e._wa._selected_divs.push(g));
            var x = "";
            p._timed || (x = "middle", p.start_date.valueOf() >= o.valueOf() && p.start_date.valueOf() <= l.valueOf() && (x = "start"), p.end_date.valueOf() >= o.valueOf() && p.end_date.valueOf() <= l.valueOf() && (x = "end")), g.innerHTML = e.templates.week_agenda_event_text(p.start_date, p.end_date, p, o, x), g.setAttribute("event_id", p.id), g.setAttribute(e.config.event_attribute, p.id), e._waiAria.weekAgendaEvent(g, p), m.appendChild(g);
          }
          o = e.date.add(o, 1, "day"), l = e.date.add(l, 1, "day");
        }
      }()) : (e._table_view = e._allow_dnd = !1, e.$container.querySelector(".dhx_cal_header").style.display = "");
    }, e.mouse_week_agenda = function(s) {
      var r = s.ev;
      const _ = s.ev.target.closest(".dhx_wa_day_cont");
      let d;
      if (_ && (d = _._date), !d)
        return s;
      s.x = 0;
      var a = d.valueOf() - e._min_date.valueOf();
      if (s.y = Math.ceil(a / 6e4 / this.config.time_step), this._drag_mode == "move" && this._drag_pos && this._is_pos_changed(this._drag_pos, s)) {
        var o;
        this._drag_event._dhx_changed = !0, this._select_id = this._drag_id;
        for (var l = 0; l < e._rendered.length; l++)
          e._drag_id == this._rendered[l].getAttribute(this.config.event_attribute) && (o = this._rendered[l]);
        if (!e._wa._dnd) {
          var h = o.cloneNode(!0);
          this._wa._dnd = h, h.className = o.className, h.id = "dhx_wa_dnd", h.className += " dhx_wa_dnd", document.body.appendChild(h);
        }
        var y = document.getElementById("dhx_wa_dnd");
        y.style.top = (r.pageY || r.clientY) + 20 + "px", y.style.left = (r.pageX || r.clientX) + 20 + "px";
      }
      return s;
    }, e.attachEvent("onBeforeEventChanged", function(s, r, _) {
      if (this._mode == "week_agenda" && this._drag_mode == "move") {
        var d = document.getElementById("dhx_wa_dnd");
        d.parentNode.removeChild(d), e._wa._dnd = !1;
      }
      return !0;
    }), e.attachEvent("onEventSave", function(s, r, _) {
      return _ && this._mode == "week_agenda" && (this._select_id = s), !0;
    }), e._wa._selected_divs = [], e.attachEvent("onClick", function(s, r) {
      if (this._mode == "week_agenda" && (e.config.week_agenda_select || e.config.week_agenda_select === void 0)) {
        if (e._wa._selected_divs)
          for (var _ = 0; _ < this._wa._selected_divs.length; _++) {
            var d = this._wa._selected_divs[_];
            d.className = d.className.replace(/ dhx_cal_event_selected/, "");
          }
        return this.for_rendered(s, function(a) {
          a.className += " dhx_cal_event_selected", e._wa._selected_divs.push(a);
        }), e._select_id = s, !1;
      }
      return !0;
    });
  });
}, wp: function(e) {
  e.attachEvent("onLightBox", function() {
    if (this._cover)
      try {
        this._cover.style.height = this.expanded ? "100%" : (document.body.parentNode || document.body).scrollHeight + "px";
      } catch {
      }
  }), e.form_blocks.select.set_value = function(i, t, n) {
    t !== void 0 && t !== "" || (t = (i.firstChild.options[0] || {}).value), i.firstChild.value = t || "";
  };
}, year_view: function(e) {
  e.templates.year_date = function(d) {
    return e.date.date_to_str(e.locale.labels.year_tab + " %Y")(d);
  }, e.templates.year_month = e.date.date_to_str("%F"), e.templates.year_scale_date = e.date.date_to_str("%D"), e.templates.year_tooltip = function(d, a, o) {
    return o.text;
  };
  const i = function() {
    return e._mode == "year";
  }, t = function(d) {
    var a = e.$domHelpers.closest(d, "[data-cell-date]");
    return a && a.hasAttribute("data-cell-date") ? e.templates.parse_date(a.getAttribute("data-cell-date")) : null;
  };
  e.dblclick_dhx_year_grid = function(d) {
    if (i()) {
      const a = d.target;
      if (e.$domHelpers.closest(a, ".dhx_before") || e.$domHelpers.closest(a, ".dhx_after"))
        return !1;
      const o = t(a);
      if (o) {
        const l = o, h = this.date.add(l, 1, "day");
        !this.config.readonly && this.config.dblclick_create && this.addEventNow(l.valueOf(), h.valueOf(), d);
      }
    }
  }, e.attachEvent("onEventIdChange", function() {
    i() && this.year_view(!0);
  });
  var n = e.render_data;
  e.render_data = function(d) {
    if (!i())
      return n.apply(this, arguments);
    for (var a = 0; a < d.length; a++)
      this._year_render_event(d[a]);
  };
  var s = e.clear_view;
  e.clear_view = function() {
    if (!i())
      return s.apply(this, arguments);
    var d = e._year_marked_cells;
    for (var a in d)
      d.hasOwnProperty(a) && d[a].classList.remove("dhx_year_event", "dhx_cal_datepicker_event");
    e._year_marked_cells = {};
  }, e._hideToolTip = function() {
    this._tooltip && (this._tooltip.style.display = "none", this._tooltip.date = new Date(9999, 1, 1));
  }, e._showToolTip = function(d, a, o, l) {
    if (this._tooltip) {
      if (this._tooltip.date.valueOf() == d.valueOf())
        return;
      this._tooltip.innerHTML = "";
    } else {
      var h = this._tooltip = document.createElement("div");
      h.className = "dhx_year_tooltip", this.config.rtl && (h.className += " dhx_tooltip_rtl"), document.body.appendChild(h), h.addEventListener("click", e._click.dhx_cal_data), h.addEventListener("click", function(p) {
        if (p.target.closest(`[${e.config.event_attribute}]`)) {
          const g = p.target.closest(`[${e.config.event_attribute}]`).getAttribute(e.config.event_attribute);
          e.showLightbox(g);
        }
      });
    }
    for (var y = this.getEvents(d, this.date.add(d, 1, "day")), m = "", f = 0; f < y.length; f++) {
      var u = y[f];
      if (this.filter_event(u.id, u)) {
        var v = u.color ? "--dhx-scheduler-event-background:" + u.color + ";" : "", c = u.textColor ? "--dhx-scheduler-event-color:" + u.textColor + ";" : "";
        m += "<div class='dhx_tooltip_line' style='" + v + c + "' event_id='" + y[f].id + "' " + this.config.event_attribute + "='" + y[f].id + "'>", m += "<div class='dhx_tooltip_date' style='" + v + c + "'>" + (y[f]._timed ? this.templates.event_date(y[f].start_date) : "") + "</div>", m += "<div class='dhx_event_icon icon_details'>&nbsp;</div>", m += this.templates.year_tooltip(y[f].start_date, y[f].end_date, y[f]) + "</div>";
      }
    }
    this._tooltip.style.display = "", this._tooltip.style.top = "0px", document.body.offsetWidth - a.left - this._tooltip.offsetWidth < 0 ? this._tooltip.style.left = a.left - this._tooltip.offsetWidth + "px" : this._tooltip.style.left = a.left + l.offsetWidth + "px", this._tooltip.date = d, this._tooltip.innerHTML = m, document.body.offsetHeight - a.top - this._tooltip.offsetHeight < 0 ? this._tooltip.style.top = a.top - this._tooltip.offsetHeight + l.offsetHeight + "px" : this._tooltip.style.top = a.top + "px";
  }, e._year_view_tooltip_handler = function(d) {
    if (i()) {
      var a = d.target || d.srcElement;
      a.tagName.toLowerCase() == "a" && (a = a.parentNode), e._getClassName(a).indexOf("dhx_year_event") != -1 ? e._showToolTip(e.templates.parse_date(a.getAttribute("data-year-date")), e.$domHelpers.getOffset(a), d, a) : e._hideToolTip();
    }
  }, e._init_year_tooltip = function() {
    e._detachDomEvent(e._els.dhx_cal_data[0], "mouseover", e._year_view_tooltip_handler), e.event(e._els.dhx_cal_data[0], "mouseover", e._year_view_tooltip_handler);
  }, e._get_year_cell = function(d) {
    for (var a = e.templates.format_date(d), o = this.$root.querySelectorAll(`.dhx_cal_data .dhx_cal_datepicker_date[data-cell-date="${a}"]`), l = 0; l < o.length; l++)
      if (!e.$domHelpers.closest(o[l], ".dhx_after, .dhx_before"))
        return o[l];
    return null;
  }, e._year_marked_cells = {}, e._mark_year_date = function(d, a) {
    var o = e.templates.format_date(d), l = this._get_year_cell(d);
    if (l) {
      var h = this.templates.event_class(a.start_date, a.end_date, a);
      e._year_marked_cells[o] || (l.classList.add("dhx_year_event", "dhx_cal_datepicker_event"), l.setAttribute("data-year-date", o), l.setAttribute("date", o), e._year_marked_cells[o] = l), h && l.classList.add(h);
    }
  }, e._unmark_year_date = function(d) {
    var a = this._get_year_cell(d);
    a && a.classList.remove("dhx_year_event", "dhx_cal_datepicker_event");
  }, e._year_render_event = function(d) {
    var a = d.start_date;
    for (a = a.valueOf() < this._min_date.valueOf() ? this._min_date : this.date.date_part(new Date(a)); a < d.end_date; )
      if (this._mark_year_date(a, d), (a = this.date.add(a, 1, "day")).valueOf() >= this._max_date.valueOf())
        return;
  }, e.year_view = function(d) {
    if (e.set_sizes(), e._table_view = d, !this._load_mode || !this._load())
      if (d) {
        if (e._init_year_tooltip(), e._reset_year_scale(), e._load_mode && e._load())
          return void (e._render_wait = !0);
        e.render_view_data();
      } else
        e._hideToolTip();
  }, e._reset_year_scale = function() {
    this._cols = [], this._colsS = {};
    var d = [], a = this._els.dhx_cal_data[0], o = this.config;
    a.scrollTop = 0, a.innerHTML = "", Math.floor((parseInt(a.style.height) - e.xy.year_top) / o.year_y);
    var l = document.createElement("div"), h = this.date.week_start(e._currentDate());
    this._process_ignores(h, 7, "day", 1);
    for (var y = 0; y < 7; y++)
      this._ignores && this._ignores[y] || (this._cols[y] = "var(--dhx-scheduler-datepicker-cell-size)", this._render_x_header(y, 0, h, l)), h = this.date.add(h, 1, "day");
    for (l.lastChild.className += " dhx_scale_bar_last", y = 0; y < l.childNodes.length; y++)
      this._waiAria.yearHeadCell(l.childNodes[y]);
    var m = this.date[this._mode + "_start"](this.date.copy(this._date)), f = m, u = null;
    const v = document.createElement("div");
    for (v.classList.add("dhx_year_wrapper"), y = 0; y < o.year_y; y++)
      for (var c = 0; c < o.year_x; c++) {
        (u = document.createElement("div")).className = "dhx_year_box", u.setAttribute("date", this._helpers.formatDate(m)), u.setAttribute("data-month-date", this._helpers.formatDate(m)), u.innerHTML = "<div class='dhx_year_month'></div><div class='dhx_year_grid'><div class='dhx_year_week'>" + l.innerHTML + "</div><div class='dhx_year_body'></div></div>";
        var p = u.querySelector(".dhx_year_month"), g = u.querySelector(".dhx_year_grid"), b = u.querySelector(".dhx_year_body"), x = e.uid();
        this._waiAria.yearHeader(p, x), this._waiAria.yearGrid(g, x), p.innerHTML = this.templates.year_month(m);
        var k = this.date.week_start(m);
        this._reset_month_scale(b, m, k, 6);
        for (var w = b.querySelectorAll("td"), E = 0; E < w.length; E++)
          this._waiAria.yearDayCell(w[E]);
        v.appendChild(u), d[y * o.year_x + c] = (m.getDay() - (this.config.start_on_monday ? 1 : 0) + 7) % 7, m = this.date.add(m, 1, "month");
      }
    a.appendChild(v);
    var D = this._getNavDateElement();
    D && (D.innerHTML = this.templates[this._mode + "_date"](f, m, this._mode)), this.week_starts = d, d._month = f.getMonth(), this._min_date = f, this._max_date = m;
  }, e._reset_year_scale = function() {
    var d = this._els.dhx_cal_data[0];
    d.scrollTop = 0, d.innerHTML = "";
    let a = this.date.year_start(new Date(this._date));
    this._min_date = this.date.week_start(new Date(a));
    const o = document.createElement("div");
    o.classList.add("dhx_year_wrapper");
    let l = a;
    for (let m = 0; m < 12; m++) {
      let f = document.createElement("div");
      f.className = "dhx_year_box", f.setAttribute("date", this._helpers.formatDate(l)), f.setAttribute("data-month-date", this._helpers.formatDate(l)), f.innerHTML = `<div class='dhx_year_month'>${this.templates.year_month(l)}</div>
			<div class='dhx_year_grid'></div>`;
      const u = f.querySelector(".dhx_year_grid"), v = e._createDatePicker(null, { date: l, minWeeks: 6 });
      v._renderDayGrid(u), v.destructor(), o.appendChild(f), l = this.date.add(l, 1, "month");
    }
    d.appendChild(o);
    let h = this.date.add(a, 1, "year");
    h.valueOf() != this.date.week_start(new Date(h)).valueOf() && (h = this.date.week_start(new Date(h)), h = this.date.add(h, 1, "week")), this._max_date = h;
    var y = this._getNavDateElement();
    y && (y.innerHTML = this.templates[this._mode + "_date"](a, h, this._mode));
  };
  var r = e.getActionData;
  e.getActionData = function(d) {
    return i() ? { date: t(d.target), section: null } : r.apply(e, arguments);
  };
  var _ = e._locate_event;
  e._locate_event = function(d) {
    var a = _.apply(e, arguments);
    if (!a) {
      var o = t(d);
      if (!o)
        return null;
      var l = e.getEvents(o, e.date.add(o, 1, "day"));
      if (!l.length)
        return null;
      a = l[0].id;
    }
    return a;
  }, e.attachEvent("onDestroy", function() {
    e._hideToolTip();
  });
} }, la = new class {
  constructor(e) {
    this._seed = 0, this._schedulerPlugins = [], this._bundledExtensions = e, this._extensionsManager = new fn(e);
  }
  plugin(e) {
    this._schedulerPlugins.push(e), P.scheduler && e(P.scheduler);
  }
  getSchedulerInstance(e) {
    for (var i = un(this._extensionsManager), t = 0; t < this._schedulerPlugins.length; t++)
      this._schedulerPlugins[t](i);
    return i._internal_id = this._seed++, this.$syncFactory && this.$syncFactory(i), e && this._initFromConfig(i, e), i;
  }
  _initFromConfig(e, i) {
    if (i.plugins && e.plugins(i.plugins), i.config && e.mixin(e.config, i.config, !0), i.templates && e.attachEvent("onTemplatesReady", function() {
      e.mixin(e.templates, i.templates, !0);
    }, { once: !0 }), i.events)
      for (const t in i.events)
        e.attachEvent(t, i.events[t]);
    i.locale && e.i18n.setLocale(i.locale), Array.isArray(i.calendars) && i.calendars.forEach(function(t) {
      e.addCalendar(t);
    }), i.container ? e.init(i.container) : e.init(), i.data && (typeof i.data == "string" ? e.load(i.data) : e.parse(i.data));
  }
}(or), Wt = la.getSchedulerInstance(), Jt = la;
window.scheduler = Wt, window.Scheduler = Jt, window.$dhx || (window.$dhx = {}), window.$dhx.scheduler = Wt, window.$dhx.Scheduler = Jt;
export {
  Jt as Scheduler,
  Wt as scheduler
};
