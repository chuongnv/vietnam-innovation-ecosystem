"""Thêm hoặc thay logo cho một hồ sơ.

Cách dùng:
    python tools/add_logo.py <id-hồ-sơ> <đường-dẫn-ảnh-hoặc-URL>

Nhận PNG, JPG, WebP, ICO hoặc SVG (SVG cần cài cairosvg). Ảnh được cắt viền trống,
thu về khung 128 × 128 px nền trong suốt và lưu thành logos/<id>.webp.
"""
import io, os, sys, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load(src):
    if src.startswith(("http://", "https://")):
        data = urllib.request.urlopen(urllib.request.Request(src, headers={"User-Agent": "Mozilla/5.0"}), timeout=30).read()
    else:
        data = open(src, "rb").read()
    if b"<svg" in data[:2000]:
        import cairosvg
        data = cairosvg.svg2png(bytestring=data, output_width=512)
    im = Image.open(io.BytesIO(data))
    if im.format == "ICO":
        im = max((im.ico.getimage(s) for s in im.ico.sizes()), key=lambda x: x.size[0])
    return im.convert("RGBA")

def save(aid, src):
    im = load(src)
    bb = im.getbbox()
    if bb: im = im.crop(bb)
    im.thumbnail((128, 128), Image.LANCZOS)
    out = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    out.paste(im, ((128 - im.size[0]) // 2, (128 - im.size[1]) // 2), im)
    path = os.path.join(ROOT, "logos", aid + ".webp")
    out.save(path, "WEBP", quality=90, method=6)
    return path

def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    aid, src = sys.argv[1], sys.argv[2]
    if not any(os.path.exists(os.path.join(ROOT, "data", r, "actors", aid + ".yaml")) for r in os.listdir(os.path.join(ROOT, "data")) if os.path.isdir(os.path.join(ROOT, "data", r))):
        sys.exit(f"Không thấy hồ sơ '{aid}' trong data/*/actors/")
    print("Đã lưu", os.path.relpath(save(aid, src), ROOT))

if __name__ == "__main__":
    main()
