/* Dùng chung: ngôn ngữ, giao diện sáng/tối, nhãn dữ liệu */
(function () {
  var D = {
    vi: {
      nav_home: "Trang chủ", nav_dir: "Danh bạ", nav_map: "Bản đồ", nav_opps: "Cơ hội", nav_cities: "Địa phương", nav_sectors: "Lĩnh vực", nav_data: "Dữ liệu", search_ph2: "Tìm theo tên, lĩnh vực, mô tả…", r_hai_phong: "Hải Phòng", nav_events: "Sự kiện", nav_policy: "Chính sách", nav_contribute: "Đóng góp",
      theme: "Đổi giao diện sáng, tối", lang: "English",
      foot_data: "Dữ liệu mở theo CC BY 4.0, mã nguồn theo MIT.", foot_src: "Mã nguồn và dữ liệu trên GitHub",
      search_ph: "Tìm tổ chức, startup, quỹ…", search_btn: "Tìm",
      f_type: "Loại", f_region: "Khu vực", f_ver: "Mức xác minh", f_filters: "Bộ lọc", f_clear: "Xoá bộ lọc",
      sort_az: "Tên A–Z", sort_ver: "Đã xác minh trước", view_list: "Danh sách", view_cards: "Thẻ",
      results: "{n} kết quả", none: "Không có kết quả khớp. Thử bỏ bớt bộ lọc, hoặc thêm hồ sơ còn thiếu.", add_missing: "Thêm hồ sơ còn thiếu",
      prev: "Trang trước", next: "Trang sau", page: "Trang {p}/{t}",
      t_expert: "Chuyên gia", t_research: "Viện, tổ chức KH&CN", t_startup: "Startup", t_creator: "Dự án sáng tạo xứ Quảng", t_company: "Doanh nghiệp", t_fund: "Quỹ, nhà đầu tư", t_incubator: "Vườn ươm", t_accelerator: "Chương trình tăng tốc", t_space: "Không gian ĐMST", t_university: "Viện, trường", t_government: "Cơ quan nhà nước", t_support_org: "Tổ chức hỗ trợ", t_international: "Đối tác quốc tế", t_community: "Cộng đồng", t_media: "Truyền thông",
      r_da_nang: "Đà Nẵng", r_former_quang_nam: "Khu vực Quảng Nam cũ", r_ha_noi: "Hà Nội", r_ho_chi_minh: "TP. Hồ Chí Minh", r_viet_nam: "Việt Nam (chưa rõ tỉnh, thành)", r_quoc_te: "Quốc tế",
      v_unverified: "Chưa xác minh", v_source_checked: "Đã đối chiếu nguồn", v_org_confirmed: "Tổ chức xác nhận", v_partner_verified: "Đối tác xác minh", s_active: "Đang hoạt động", s_inactive: "Đã ngừng hoạt động", s_unknown: "Chưa rõ", f_status: "Tình trạng",
      upcoming: "Sắp diễn ra", past: "Đã diễn ra", organizer: "Đơn vị tổ chức", all_events: "Tất cả sự kiện",
      policy_search: "Tìm văn bản, nội dung…", all_policies: "Tất cả chính sách",
      map_note: "{a} trên {b} hồ sơ đã có vị trí trên bản đồ.", map_help: "Biết địa chỉ chính xác của một tổ chức? Thêm tọa độ để tổ chức đó hiện trên bản đồ.",
      no_place: "Chưa có vị trí", by_ward: "Vị trí theo phường, xã", by_addr: "Vị trí theo địa chỉ"
    },
    en: {
      nav_home: "Home", nav_dir: "Directory", nav_map: "Map", nav_opps: "Opportunities", nav_cities: "Places", nav_sectors: "Sectors", nav_data: "Data", search_ph2: "Search by name, sector, description…", r_hai_phong: "Hai Phong", nav_events: "Events", nav_policy: "Policies", nav_contribute: "Contribute",
      theme: "Switch light or dark theme", lang: "Tiếng Việt",
      foot_data: "Open data under CC BY 4.0, code under MIT.", foot_src: "Code and data on GitHub",
      search_ph: "Search organisations, startups, funds…", search_btn: "Search",
      f_type: "Type", f_region: "Area", f_ver: "Verification", f_filters: "Filters", f_clear: "Clear filters",
      sort_az: "Name A–Z", sort_ver: "Verified first", view_list: "List", view_cards: "Cards",
      results: "{n} results", none: "Nothing matches. Remove a filter, or add the profile that is missing.", add_missing: "Add a missing profile",
      prev: "Previous", next: "Next", page: "Page {p} of {t}",
      t_expert: "Expert", t_research: "Research & S&T org", t_startup: "Startup", t_creator: "Quang Nam creative project", t_company: "Company", t_fund: "Fund, investor", t_incubator: "Incubator", t_accelerator: "Accelerator", t_space: "Innovation space", t_university: "University, institute", t_government: "Government body", t_support_org: "Support organisation", t_international: "International partner", t_community: "Community", t_media: "Media",
      r_da_nang: "Da Nang", r_former_quang_nam: "Former Quang Nam area", r_ha_noi: "Hanoi", r_ho_chi_minh: "Ho Chi Minh City", r_viet_nam: "Vietnam (province unknown)", r_quoc_te: "International",
      v_unverified: "Unverified", v_source_checked: "Checked against source", v_org_confirmed: "Confirmed by organisation", v_partner_verified: "Verified by partner", s_active: "Active", s_inactive: "No longer active", s_unknown: "Unknown", f_status: "Status",
      upcoming: "Upcoming", past: "Past", organizer: "Organiser", all_events: "All events",
      policy_search: "Search documents, content…", all_policies: "All policies",
      map_note: "{a} of {b} profiles have a location on the map.", map_help: "Know an organisation's exact address? Add coordinates so it shows on the map.",
      no_place: "No location yet", by_ward: "Located by ward or commune", by_addr: "Located by address"
    }
  };
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var lang = store.get("vie-lang") || "vi";
  var theme = store.get("vie-theme");
  if (theme) document.documentElement.setAttribute("data-theme", theme);

  function t(key, vars) {
    var s = (D[lang] && D[lang][key]) || D.vi[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace("{" + k + "}", vars[k]); });
    return s;
  }
  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.getAttribute("data-i18n-ph")); });
    document.querySelectorAll("[data-i18n-label]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-label"))); });
    document.querySelectorAll("[data-vi]").forEach(function (el) {
      var v = el.getAttribute("data-" + lang) || el.getAttribute("data-vi"); if (v) el.textContent = v;
    });
    document.dispatchEvent(new CustomEvent("vie:lang"));
  }
  window.VIE = {
    t: t, lang: function () { return lang; },
    typeLabel: function (x) { return t("t_" + x); },
    regionLabel: function (x) { return t("r_" + String(x).replace(/-/g, "_")); },
    verLabel: function (x) { return t("v_" + x); },
    verClass: function (x) { return { unverified: "l0", source_checked: "l1", org_confirmed: "l2", partner_verified: "l3" }[x] || "l0"; },
    name: function (a) { return (lang === "en" && a.name.en) || a.name.vi; },
    root: document.documentElement.getAttribute("data-root") || "/",
    load: function (f) { return fetch((document.documentElement.getAttribute("data-root") || "/") + "data/" + f).then(function (r) { if (!r.ok) throw new Error(f); return r.json(); }); },
    el: function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; },
    /* Từ tìm (đã bỏ dấu) có trong chuỗi h không. Từ ngắn (≤ 3 ký tự) phải khớp ở đầu một từ,
       nếu không "ai" sẽ khớp "đại", "hải", "mại" và trả về gần hết danh bạ. */
    hit: function (h, w) { return w.length > 3 ? h.indexOf(w) >= 0 : new RegExp("(^|[^a-z0-9])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(h); }
  };
  document.addEventListener("DOMContentLoaded", function () {
    var lb = document.getElementById("lang-toggle");
    if (lb) lb.addEventListener("click", function () { lang = lang === "vi" ? "en" : "vi"; store.set("vie-lang", lang); apply(); });
    var tb = document.getElementById("theme-toggle");
    if (tb) tb.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next); store.set("vie-theme", next);
    });
    apply();
  });

  /* Tìm nhanh toàn trang: nút trên thanh điều hướng, phím "/" */
  document.addEventListener("DOMContentLoaded", function () {
    var acts = document.querySelector("header.top .tools");
    if (!acts || !window.ICON) return;
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "btn ghost qs-btn"; btn.innerHTML = ICON("search", 16);
    btn.setAttribute("aria-label", VIE.lang() === "en" ? "Search" : "Tìm nhanh"); btn.title = (VIE.lang() === "en" ? "Search" : "Tìm nhanh") + " ( / )";
    acts.insertBefore(btn, acts.firstChild);
    var ov = document.createElement("div"); ov.className = "qs"; ov.hidden = true;
    ov.innerHTML = '<div class="qs-box" role="dialog" aria-modal="true"><div class="bigsearch"><span class="bs-ico">' + ICON("search", 20) + '</span><input type="search" autocomplete="off"></div><ul class="sugg"></ul></div>';
    document.body.append(ov);
    var inp = ov.querySelector("input"), ul = ov.querySelector("ul"), data = null, sel = -1;
    var norm = function (s) { return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase(); };
    function open() { ov.hidden = false; inp.value = ""; ul.replaceChildren(); inp.placeholder = VIE.t("search_ph2"); inp.focus(); if (!data) VIE.load("actors.json").then(function (d) { data = d; if (inp.value) inp.dispatchEvent(new Event("input")); }); }
    function close() { ov.hidden = true; }
    btn.onclick = open;
    ov.addEventListener("click", function (ev) { if (ev.target === ov) close(); });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) { ev.preventDefault(); open(); }
      else if (ev.key === "Escape" && !ov.hidden) close();
    });
    inp.addEventListener("input", function () {
      ul.replaceChildren(); sel = -1; if (!data) return;
      var q = norm(inp.value.trim()); if (q.length < 2) return; var ws = q.split(/\s+/);
      var hits = data.filter(function (a) { var h = norm([a.name.vi, a.name.en, (a.alt_names || []).join(" "), (a.categories || []).join(" ")].join(" ")); return ws.every(function (w) { return VIE.hit(h, w); }); })
        .sort(function (a, b) { return (norm(a.name.vi).indexOf(q) === 0 ? 0 : 1) - (norm(b.name.vi).indexOf(q) === 0 ? 0 : 1) || (b.logo ? 1 : 0) - (a.logo ? 1 : 0); }).slice(0, 8);
      hits.forEach(function (x) {
        var li = document.createElement("li"); li.setAttribute("role", "option"); var a = document.createElement("a"); a.href = VIE.root + (x.url || ("to-chuc/" + x.id + "/"));
        var im;
        if (x.logo) { im = document.createElement("img"); im.src = VIE.root + x.logo; im.alt = ""; } else { im = VIE.el("span", "ini", (x.name.vi[0] || "?").toUpperCase()); }
        im.className = "sg-logo" + (x.logo ? "" : " ini"); a.append(im);
        var t = VIE.el("span", "sg-t"); t.append(VIE.el("span", "nm", VIE.name(x)), VIE.el("span", "muted small", VIE.typeLabel(x.type) + " · " + VIE.regionLabel(x.region))); a.append(t); li.append(a); ul.append(li);
      });
      var all = VIE.el("li", "sg-all"); all.innerHTML = ICON("search", 16) + "<span></span>"; all.querySelector("span").textContent = (VIE.lang() === "en" ? "Search the directory for “" : "Tìm trong danh bạ “") + inp.value.trim() + "”";
      all.onclick = function () { location.href = VIE.root + "danh-ba/?q=" + encodeURIComponent(inp.value.trim()); }; ul.append(all);
    });
    inp.addEventListener("keydown", function (ev) {
      var items = ul.querySelectorAll("li[role=option]");
      if (ev.key === "ArrowDown" || ev.key === "ArrowUp") { ev.preventDefault(); if (!items.length) return; sel = (sel + (ev.key === "ArrowDown" ? 1 : -1) + items.length) % items.length; items.forEach(function (n, k) { n.classList.toggle("act", k === sel); }); }
      else if (ev.key === "Enter") { location.href = sel >= 0 && items[sel] ? items[sel].querySelector("a").href : VIE.root + "danh-ba/?q=" + encodeURIComponent(inp.value.trim()); }
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.ICON) return;
    document.querySelectorAll(".jsico").forEach(function (n) { n.outerHTML = ICON(n.dataset.ico, +n.dataset.size || 16); });
  });

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest(".mailbtn"); if (!b) return;
    var rev = function (x) { return (x || "").split("").reverse().join(""); };
    location.href = "mailto:" + rev(b.dataset.u) + "@" + rev(b.dataset.d);
  });
})();
