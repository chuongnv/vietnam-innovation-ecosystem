"""Tìm logo ứng viên cho các hồ sơ có website nhưng chưa có logo.

Cách dùng:
    python tools/logo_candidates.py [thư-mục-ra]        (mặc định .cache/logos)

Với mỗi hồ sơ: tải trang chủ, lấy ứng viên (logo trong JSON-LD, <img> có chữ "logo",
apple-touch-icon, icon, og:image), tải ảnh, chấm điểm (thấp = tốt), rồi ghi
candidates.json và review.html. Mở review.html, chọn logo đúng, bấm "Tải CSV",
rồi chạy tools/apply_logos.py với tệp CSV đó.
"""
import concurrent.futures, glob, hashlib, io, json, os, ssl, sys, urllib.error, urllib.parse, urllib.request
from collections import Counter
from html.parser import HTMLParser
import yaml
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, ".cache", "logos")
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; VietnamInnovationMap-LogoBot/0.1; +https://innovation.invietnam.vn)"}
# Nguồn đáng tin hơn có hạng thấp hơn
# "img2": <img> có chữ "logo" nhưng không phải cái đầu tiên, thường là logo khách hàng, đối tác
RANK = {"jsonld": 0, "img": 1, "touch": 2, "icon": 3, "og": 4, "img2": 4}
# <img> có chữ "logo" nhưng là logo của đơn vị khác (đối tác, khách hàng, danh mục đầu tư)
OTHERS = ("partner", "client", "customer", "sponsor", "investor", "portfolio", "award", "doi-tac", "khach-hang")


def fetch(url, limit=5_000_000):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        r = urllib.request.urlopen(req, timeout=20)
    except urllib.error.URLError as e:
        # Nhiều website .vn cấu hình chứng chỉ thiếu; chỉ đọc ảnh công khai nên thử lại không xác minh
        if not isinstance(e.reason, ssl.SSLError):
            raise
        r = urllib.request.urlopen(req, timeout=20, context=ssl._create_unverified_context())
    return r.geturl(), r.read(limit)


class Finder(HTMLParser):
    def __init__(self):
        super().__init__()
        self.found, self.ld, self.in_ld, self.recent = [], [], False, []

    def handle_starttag(self, tag, attrs):
        a = {k: v or "" for k, v in attrs}
        own = " ".join(a.get(k, "") for k in ("class", "id", "alt", "src", "title")).lower()
        if tag == "img":
            src = a.get("data-src") or a.get("data-lazy-src") or a.get("src") or a.get("srcset", "").split(" ")[0]
            near = " ".join(self.recent)
            if src and not src.startswith("data:") and not any(w in own + near for w in OTHERS) \
                    and ("logo" in own or "logo" in near or "brand" in near):
                self.found.append(("img", src))
        elif tag == "link":
            rel = a.get("rel", "").lower()
            if "apple-touch-icon" in rel:
                self.found.append(("touch", a.get("href")))
            elif "icon" in rel:
                self.found.append(("icon", a.get("href")))
        elif tag == "meta" and a.get("property") == "og:image":
            self.found.append(("og", a.get("content")))
        elif tag == "script" and a.get("type") == "application/ld+json":
            self.ld.append("")
            self.in_ld = True
        # class/id của 3 thẻ mở gần nhất: <a class="navbar-brand"><img src="x.png"> vẫn được tính
        self.recent = (self.recent + [(a.get("class", "") + " " + a.get("id", "")).lower()])[-3:]

    def handle_data(self, d):
        if self.in_ld:
            self.ld[-1] += d

    def handle_endtag(self, tag):
        if tag == "script":
            self.in_ld = False


def ld_logos(node):
    """Mọi giá trị của khóa "logo" trong JSON-LD, ở bất kỳ độ sâu nào."""
    if isinstance(node, list):
        return [u for x in node for u in ld_logos(x)]
    if not isinstance(node, dict):
        return []
    out = []
    for k, v in node.items():
        if k == "logo":
            v = v.get("url") or v.get("contentUrl") if isinstance(v, dict) else v
            if isinstance(v, str):
                out.append(v)
        else:
            out += ld_logos(v)
    return out


def analyze(data):
    """Trả về (đuôi tệp, rộng, cao, có phải logo trắng trên nền trong suốt) hoặc ném lỗi nếu không phải ảnh."""
    if b"<svg" in data[:2000]:
        import cairosvg
        ext, data = "svg", cairosvg.svg2png(bytestring=data, output_width=256)
    else:
        ext = None
    im = Image.open(io.BytesIO(data))
    ext = ext or im.format.lower().replace("jpeg", "jpg")
    if im.format == "ICO":
        im = max((im.ico.getimage(s) for s in im.ico.sizes()), key=lambda x: x.size[0])
    im = im.convert("RGBA")
    # Logo trắng trên nền trong suốt sẽ biến mất trên nền trắng của trang (style.css: .lg)
    solid = [(n, p) for n, p in im.resize((64, 64)).getcolors(64 * 64) if p[3] > 128]
    total = sum(n for n, _ in solid)
    light = total < 64 * 64 * 0.9 and sum(n * sum(p[:3]) / 3 for n, p in solid) > 210 * total
    return ext, im.size[0], im.size[1], light


def candidates(a):
    rec = {"id": a["id"], "name": a["name"]["vi"], "website": a["website"], "cands": []}
    try:
        final, page = fetch(a["website"])
    except Exception as e:
        rec["error"] = f"{type(e).__name__}: {e}"[:200]
        return rec
    rec["final_url"] = final
    f = Finder()
    f.feed(page.decode("utf-8", "replace"))
    found = []
    for block in f.ld:
        try:
            found += [("jsonld", u) for u in ld_logos(json.loads(block))]
        except ValueError:
            pass
    imgs = [u for s, u in f.found if s == "img"][:3]
    found += [("img" if i == 0 else "img2", u) for i, u in enumerate(imgs)] +[x for x in f.found if x[0] != "img"] + [("icon", "/favicon.ico")]
    seen = set()
    os.makedirs(os.path.join(OUT, a["id"]), exist_ok=True)
    for src, u in found:
        if not u:
            continue
        url = urllib.parse.urljoin(final, u.strip())
        if url in seen or not url.startswith("http"):
            continue
        seen.add(url)
        try:
            data = fetch(url)[1]
            ext, w, h, light = analyze(data)
        except Exception:
            continue
        flags = []
        if max(w, h) < 64 and ext != "svg":
            flags.append("small")
        if light:
            flags.append("light")
        if max(w, h) > 6 * min(w, h):
            flags.append("wide")
        name = f"{len(rec['cands'])}.{ext}"
        with open(os.path.join(OUT, a["id"], name), "wb") as fh:
            fh.write(data)
        rec["cands"].append({"file": f"{a['id']}/{name}", "url": url, "src": src, "w": w, "h": h,
                             "sha": hashlib.sha256(data).hexdigest(), "flags": flags})
        if len(rec["cands"]) >= 6:
            break
    return rec


PENALTY = {"small": 15, "light": 40, "wide": 5, "shared": 50}


def score(c):
    return RANK[c["src"]] * 10 + sum(PENALTY[f] for f in c["flags"])


def main():
    actors = []
    for p in sorted(glob.glob(os.path.join(ROOT, "data", "*", "actors", "*.yaml"))):
        a = yaml.safe_load(open(p, encoding="utf-8"))
        if a.get("website") and not os.path.exists(os.path.join(ROOT, "logos", a["id"] + ".webp")):
            actors.append(a)
    print(f"{len(actors)} hồ sơ có website, chưa có logo")
    os.makedirs(OUT, exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(8) as ex:
        recs = list(ex.map(candidates, actors))
    # Cùng một ảnh ở hai hồ sơ khác nhau: thường là biểu tượng của nền tảng làm web, không phải logo
    owners = Counter(sha for r in recs for sha in {c["sha"] for c in r["cands"]})
    for r in recs:
        for c in r["cands"]:
            if owners[c["sha"]] > 1:
                c["flags"].append("shared")
            c["score"] = score(c)
        r["cands"].sort(key=lambda c: c["score"])
    json.dump(recs, open(os.path.join(OUT, "candidates.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    tpl = open(os.path.join(ROOT, "tools", "logo_review.html"), encoding="utf-8").read()
    open(os.path.join(OUT, "review.html"), "w", encoding="utf-8").write(
        tpl.replace("/*DATA*/[]", json.dumps(recs, ensure_ascii=False)))
    ok = sum(1 for r in recs if r["cands"])
    print(f"Có ứng viên: {ok}/{len(recs)}; lỗi tải trang: {sum(1 for r in recs if 'error' in r)}")
    print("Mở", os.path.join(OUT, "review.html"))


if __name__ == "__main__":
    main()
