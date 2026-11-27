/* Danh bạ: tìm kiếm tức thì, lọc bằng biểu tượng theo loại và lĩnh vực, bộ lọc phụ, thẻ có logo.
   Trạng thái lưu trên đường dẫn để chia sẻ. */
(function () {
  var PER = 36, all = [], SECT = [], st, CUR = [];
  function downloadCSV() {
    var cols = [["id", "id"], ["name", "ten"], ["type", "loai"], ["sectors", "linh_vuc"], ["region", "khu_vuc"], ["status", "tinh_trang"], ["founded", "nam_thanh_lap"], ["website", "website"], ["linkedin", "linkedin"], ["description", "mo_ta"], ["verification", "muc_xac_minh"], ["sources", "nguon"], ["url", "trang_ho_so"]];
    var esc = function (v) { v = v == null ? "" : String(v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var rows = [cols.map(function (c) { return c[1]; }).join(",")];
    CUR.forEach(function (a) {
      var r = { id: a.id, name: a.name.vi, type: a.type, sectors: (a.sectors || []).join("; "), region: a.region, status: a.status || "", founded: a.founded || "",
        website: a.website || "", linkedin: a.linkedin || "", description: a.description && a.description.vi || "", verification: a.verification.level,
        sources: (a.sources || []).join("; "), url: location.origin + VIE.root + (a.url || ("to-chuc/" + a.id + "/")) };
      rows.push(cols.map(function (c) { return esc(r[c[0]]); }).join(","));
    });
    var blob = new Blob(["\ufeff" + rows.join("\r\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "he-sinh-thai-khoi-nghiep-" + new Date().toISOString().slice(0, 10) + ".csv"; document.body.append(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  var TYPES = ["startup", "fund", "incubator", "accelerator", "space", "support_org", "university", "government", "company", "international", "community", "media", "creator", "expert", "research"];
  var REGIONS = ["da-nang", "former-quang-nam", "ha-noi", "ho-chi-minh", "hai-phong", "viet-nam", "quoc-te"];
  var VERS = ["partner_verified", "org_confirmed", "source_checked", "unverified"];
  var STATUSES = ["active", "inactive", "unknown"];
  var HAS = ["logo", "website", "description", "linkedin"];
  var KEYS = ["type", "sector", "region", "ver", "status", "has"];
  var $ = function (id) { return document.getElementById(id); };
  var norm = function (s) { return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase(); };
  var L = function (vi, en) { return VIE.lang() === "en" ? en : vi; };
  function fresh() { return { q: "", type: [], sector: [], region: [], ver: [], status: [], has: [], sort: "rich", view: "cards", page: 1 }; }
  st = fresh();

  function readURL() {
    var p = new URLSearchParams(location.search); st = fresh();
    st.q = p.get("q") || "";
    KEYS.forEach(function (k) { st[k] = (p.get(k) || "").split(",").filter(Boolean); });
    st.sort = p.get("sort") || "rich"; st.view = p.get("view") || "cards"; st.page = +p.get("page") || 1;
  }
  function writeURL() {
    var p = new URLSearchParams();
    if (st.q) p.set("q", st.q);
    KEYS.forEach(function (k) { if (st[k].length) p.set(k, st[k].join(",")); });
    if (st.sort !== "rich") p.set("sort", st.sort);
    if (st.view !== "cards") p.set("view", st.view);
    if (st.page > 1) p.set("page", st.page);
    var s = p.toString(); history.replaceState(null, "", location.pathname + (s ? "?" + s : ""));
  }
  function hay(a) {
    if (!a._h) a._h = norm([a.name.vi, a.name.en, (a.alt_names || []).join(" "), (a.categories || []).join(" "), a.description && a.description.vi, a.description_source && a.description_source.text, a.website].join(" "));
    return a._h;
  }
  function has(a, h) { return h === "logo" ? !!a.logo : h === "description" ? !!(a.description && a.description.vi) : !!a[h]; }
  function val(a, k) {
    if (k === "ver") return [a.verification.level];
    if (k === "status") return [a.status || "unknown"];
    if (k === "sector") return a.sectors && a.sectors.length ? a.sectors : ["other"];
    if (k === "has") return HAS.filter(function (h) { return has(a, h); });
    return [a[k]];
  }
  function matches(a, skip) {
    if (st.q) { var ws = norm(st.q).split(/\s+/).filter(Boolean), h = hay(a); for (var i = 0; i < ws.length; i++) if (!VIE.hit(h, ws[i])) return false; }
    for (var j = 0; j < KEYS.length; j++) {
      var k = KEYS[j]; if (k === skip || !st[k].length) continue;
      var v = val(a, k);
      if (k === "has") { if (!st.has.every(function (x) { return v.indexOf(x) >= 0; })) return false; }
      else if (!st[k].some(function (x) { return v.indexOf(x) >= 0; })) return false;
    }
    return true;
  }
  function score(a) { return (a.logo ? 4 : 0) + (a.description && a.description.vi ? 3 : 0) + (a.website ? 2 : 0) + (a.linkedin ? 1 : 0) + (3 - VERS.indexOf(a.verification.level)) * 0.5 + (a.status === "inactive" ? -5 : 0); }
  function logo(a, cls) {
    if (a.logo) { var i = document.createElement("img"); i.className = cls + (a.logo.indexOf("photos/") === 0 ? " person" : ""); i.src = VIE.root + a.logo; i.alt = ""; i.loading = "lazy"; i.width = 44; i.height = 44; return i; }
    var s = VIE.el("span", cls + " ini", (VIE.name(a).replace(/[^\p{L}\p{N}\s]/gu, " ").trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("") || "?").toUpperCase());
    s.setAttribute("aria-hidden", "true"); return s;
  }
  function sectLabel(k) { if (k === "other") return L("Khác", "Other"); var s = SECT.filter(function (x) { return x.id === k; })[0]; return s ? L(s.vi, s.en) : k; }
  function chipRow(box, key, values, label, iconOf) {
    box.replaceChildren();
    var base = all.filter(function (a) { return matches(a, key); });
    var counts = {}; base.forEach(function (a) { val(a, key).forEach(function (v) { counts[v] = (counts[v] || 0) + 1; }); });
    var allBtn = VIE.el("button", "chip" + (st[key].length ? "" : " on")); allBtn.type = "button";
    allBtn.innerHTML = ICON("all") + "<span>" + L("Tất cả", "All") + "</span><b>" + base.length + "</b>";
    allBtn.setAttribute("aria-pressed", !st[key].length);
    allBtn.onclick = function () { st[key] = []; st.page = 1; render(); };
    box.append(allBtn);
    values.forEach(function (v) {
      var n = counts[v] || 0; if (!n && st[key].indexOf(v) < 0) return;
      var on = st[key].indexOf(v) >= 0, b = VIE.el("button", "chip" + (on ? " on" : "")); b.type = "button";
      b.setAttribute("aria-pressed", on);
      b.innerHTML = ICON(iconOf(v)) + "<span></span><b>" + n + "</b>"; b.querySelector("span").textContent = label(v);
      b.onclick = function () { st[key] = on ? st[key].filter(function (x) { return x !== v; }) : st[key].concat(v); st.page = 1; render(); };
      box.append(b);
    });
  }
  function checks(id, key, values, label) {
    var fs = $(id); fs.querySelectorAll(".check").forEach(function (n) { n.remove(); });
    var base = all.filter(function (a) { return matches(a, key); });
    values.forEach(function (v) {
      var n = base.filter(function (a) { return val(a, key).indexOf(v) >= 0; }).length;
      if (!n && st[key].indexOf(v) < 0) return;
      var lb = VIE.el("label", "check"), cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = st[key].indexOf(v) >= 0;
      cb.onchange = function () { st[key] = cb.checked ? st[key].concat(v) : st[key].filter(function (x) { return x !== v; }); st.page = 1; render(); };
      lb.append(cb, VIE.el("span", null, label(v)), VIE.el("span", "c", String(n))); fs.append(lb);
    });
  }
  var HASL = { logo: ["Logo", "Logo"], website: ["Website", "Website"], description: ["Mô tả", "Description"], linkedin: ["LinkedIn", "LinkedIn"] };
  function pills() {
    var box = $("pills"); box.replaceChildren(); var n = 0;
    [["region", VIE.regionLabel], ["status", function (x) { return VIE.t("s_" + x); }], ["ver", VIE.verLabel], ["has", function (x) { return L(HASL[x][0], HASL[x][1]); }]].forEach(function (p) {
      st[p[0]].forEach(function (v) {
        n++; var b = VIE.el("button", "pill-x"); b.type = "button"; b.innerHTML = "<span></span>" + ICON("x", 14);
        b.querySelector("span").textContent = p[1](v); b.setAttribute("aria-label", L("Bỏ lọc ", "Remove ") + p[1](v));
        b.onclick = function () { st[p[0]] = st[p[0]].filter(function (x) { return x !== v; }); render(); }; box.append(b);
      });
    });
    $("more-n").hidden = !n; $("more-n").textContent = n;
  }
  function card(x) {
    var a = VIE.el("a", "dcard"); a.href = VIE.root + (x.url || ("to-chuc/" + x.id + "/"));
    var top = VIE.el("div", "dc-top"); top.append(logo(x, "dc-logo"));
    var tt = VIE.el("div", "dc-tt"); tt.append(VIE.el("span", "nm", VIE.name(x)));
    var meta = VIE.el("span", "dc-meta"); meta.innerHTML = ICON(x.type, 14); meta.append(" " + VIE.typeLabel(x.type) + " · " + VIE.regionLabel(x.region));
    tt.append(meta); top.append(tt); a.append(top);
    var d = x.description && (VIE.lang() === "en" && x.description.en || x.description.vi);
    if (d) a.append(VIE.el("p", "dc-desc", d.length > 140 ? d.slice(0, 137) + "…" : d));
    var foot = VIE.el("div", "dc-foot");
    (x.sectors || []).slice(0, 2).forEach(function (s) { var t = VIE.el("span", "stag"); t.innerHTML = ICON(s, 13); t.append(" " + sectLabel(s)); foot.append(t); });
    if (x.status === "inactive") foot.append(VIE.el("span", "stag off", VIE.t("s_inactive")));
    var vb = VIE.el("span", "ver " + VIE.verClass(x.verification.level)), i = document.createElement("i"); vb.append(i, VIE.el("span", null, VIE.verLabel(x.verification.level))); foot.append(vb);
    a.append(foot); return a;
  }
  function row(x) {
    var li = document.createElement("li"), a = VIE.el("a", "drow"); a.href = VIE.root + (x.url || ("to-chuc/" + x.id + "/"));
    a.append(logo(x, "dr-logo"), VIE.el("span", "nm", VIE.name(x)));
    var t = VIE.el("span", "tag"); t.innerHTML = ICON(x.type, 13); t.append(" " + VIE.typeLabel(x.type)); a.append(t);
    a.append(VIE.el("span", "muted small dr-sec", (x.sectors || []).map(sectLabel).join(", ")), VIE.el("span", "muted small", VIE.regionLabel(x.region)));
    li.append(a); return li;
  }
  function render() {
    writeURL();
    chipRow($("c-type"), "type", TYPES, VIE.typeLabel, function (v) { return v; });
    chipRow($("c-sector"), "sector", SECT.map(function (s) { return s.id; }).concat("other"), sectLabel, function (v) { return v; });
    checks("f-region", "region", REGIONS, VIE.regionLabel);
    checks("f-status", "status", STATUSES, function (x) { return VIE.t("s_" + x); });
    checks("f-ver", "ver", VERS, VIE.verLabel);
    checks("f-has", "has", HAS, function (x) { return L(HASL[x][0], HASL[x][1]); });
    pills();
    var list = all.filter(function (a) { return matches(a); });
    var coll = new Intl.Collator(VIE.lang() === "en" ? "en" : "vi");
    list.sort(function (a, b) {
      if (st.sort === "rich") { var d = score(b) - score(a); if (d) return d; }
      if (st.sort === "ver") { var v = VERS.indexOf(a.verification.level) - VERS.indexOf(b.verification.level); if (v) return v; }
      return coll.compare(VIE.name(a), VIE.name(b));
    });
    var pages = Math.max(1, Math.ceil(list.length / PER)); if (st.page > pages) st.page = pages;
    $("count").textContent = VIE.t("results", { n: list.length });
    var box = $("results"); box.replaceChildren(); CUR = list;
    $("mapwrap").hidden = st.view !== "map"; box.hidden = st.view === "map"; $("pager").hidden = st.view === "map";
    if (st.view === "map") { VIEMAP.render($("mapbox"), list.map(function (a) { return a.id; }), $("mapnote")); }
    if (!list.length) {
      var em = VIE.el("div", "empty"); em.append(VIE.el("p", null, VIE.t("none")));
      var lk = VIE.el("a", "btn primary", VIE.t("add_missing")); lk.href = "https://github.com/chuongnv/vietnam-innovation-ecosystem/issues/new?template=them-hoac-sua-ho-so.yml"; lk.style.marginTop = "16px";
      em.append(lk); box.append(em);
    } else {
      var wrap = st.view === "cards" ? VIE.el("div", "dgrid") : VIE.el("ul", "drows");
      list.slice((st.page - 1) * PER, st.page * PER).forEach(function (x) { wrap.append(st.view === "cards" ? card(x) : row(x)); });
      box.append(wrap);
    }
    var pg = $("pager"); pg.replaceChildren();
    if (pages > 1) {
      var prev = VIE.el("button", "btn ghost", VIE.t("prev")); prev.type = "button"; prev.disabled = st.page === 1; prev.onclick = function () { st.page--; render(); scrollTo(0, 0); };
      var next = VIE.el("button", "btn ghost", VIE.t("next")); next.type = "button"; next.disabled = st.page === pages; next.onclick = function () { st.page++; render(); scrollTo(0, 0); };
      pg.append(prev, VIE.el("span", "muted", VIE.t("page", { p: st.page, t: pages })), next);
    }
    $("v-list").setAttribute("aria-pressed", st.view === "list"); $("v-cards").setAttribute("aria-pressed", st.view === "cards"); $("v-map").setAttribute("aria-pressed", st.view === "map");
    $("sort").value = st.sort;
  }
  /* gợi ý tức thì dưới ô tìm */
  var sel = -1;
  function suggest() {
    var q = $("q").value.trim(), ul = $("sugg"); ul.replaceChildren(); sel = -1;
    if (q.length < 2) { ul.hidden = true; $("q").setAttribute("aria-expanded", "false"); return; }
    var ws = norm(q).split(/\s+/), nq = norm(q);
    var hits = all.filter(function (a) { var h = hay(a); return ws.every(function (w) { return VIE.hit(h, w); }); })
      .sort(function (a, b) { var an = norm(VIE.name(a)).indexOf(nq) === 0 ? 0 : 1, bn = norm(VIE.name(b)).indexOf(nq) === 0 ? 0 : 1; return an - bn || score(b) - score(a); }).slice(0, 7);
    hits.forEach(function (x, k) {
      var li = VIE.el("li"); li.setAttribute("role", "option"); li.id = "sg" + k;
      var a = VIE.el("a"); a.href = VIE.root + (x.url || ("to-chuc/" + x.id + "/")); a.append(logo(x, "sg-logo"));
      var t = VIE.el("span", "sg-t"); t.append(VIE.el("span", "nm", VIE.name(x)), VIE.el("span", "muted small", VIE.typeLabel(x.type) + " · " + VIE.regionLabel(x.region)));
      a.append(t); li.append(a); ul.append(li);
    });
    var more = VIE.el("li", "sg-all"); more.innerHTML = ICON("search", 16) + "<span></span>"; more.querySelector("span").textContent = L("Xem tất cả kết quả cho “", "See all results for “") + q + "”";
    more.onclick = function () { ul.hidden = true; }; ul.append(more);
    ul.hidden = false; $("q").setAttribute("aria-expanded", "true");
  }
  document.addEventListener("DOMContentLoaded", function () {
    readURL();
    $("bs-ico").innerHTML = ICON("search", 22); $("more-ico").innerHTML = ICON("filter", 16);
    $("q").value = st.q;
    var timer;
    $("q").addEventListener("input", function () { suggest(); clearTimeout(timer); timer = setTimeout(function () { st.q = $("q").value.trim(); st.page = 1; render(); }, 200); });
    $("q").addEventListener("keydown", function (ev) {
      var items = $("sugg").querySelectorAll("li[role=option]");
      if (ev.key === "ArrowDown" || ev.key === "ArrowUp") { ev.preventDefault(); if (!items.length) return; sel = (sel + (ev.key === "ArrowDown" ? 1 : -1) + items.length) % items.length; items.forEach(function (n, k) { n.classList.toggle("act", k === sel); }); $("q").setAttribute("aria-activedescendant", "sg" + sel); }
      else if (ev.key === "Enter") { if (sel >= 0 && items[sel]) { location.href = items[sel].querySelector("a").href; } else { $("sugg").hidden = true; } }
      else if (ev.key === "Escape") { $("sugg").hidden = true; }
    });
    document.addEventListener("click", function (ev) { if (!ev.target.closest(".bigsearch")) $("sugg").hidden = true; });
    $("sort").onchange = function () { st.sort = $("sort").value; render(); };
    $("v-list").onclick = function () { st.view = "list"; render(); };
    $("v-cards").onclick = function () { st.view = "cards"; render(); };
    $("v-map").onclick = function () { st.view = "map"; render(); };
    $("csv").onclick = downloadCSV;
    $("more").onclick = function () { var p = $("morepanel"); p.hidden = !p.hidden; $("more").setAttribute("aria-expanded", !p.hidden); };
    $("clear").onclick = function () { var v = st.view; st = fresh(); st.view = v; $("q").value = ""; render(); };
    Promise.all([VIE.load("actors.json"), VIE.load("sectors.json")]).then(function (r) { all = r[0]; SECT = r[1]; render(); document.addEventListener("vie:lang", render); })
      .catch(function () { $("count").textContent = ""; });
  });
})();
