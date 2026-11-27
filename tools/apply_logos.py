"""Áp dụng kết quả duyệt logo từ review.html.

Cách dùng:
    python tools/apply_logos.py <logo-decisions.csv> [thư-mục-ứng-viên]    (mặc định .cache/logos)

Mỗi dòng có `file` được thu về logos/<id>.webp như add_logo.py, và địa chỉ ảnh gốc
được ghi vào logos/sources.csv để biết logo lấy từ đâu khi cần thay hoặc gỡ.
"""
import csv, datetime, os, sys
from add_logo import ROOT, save


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src_dir = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, ".cache", "logos")
    log = os.path.join(ROOT, "logos", "sources.csv")
    new = not os.path.exists(log)
    with open(log, "a", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        if new:
            w.writerow(["id", "url", "date"])
        for row in csv.DictReader(open(sys.argv[1], encoding="utf-8")):
            if not row["file"]:
                continue
            print("Đã lưu", os.path.relpath(save(row["id"], os.path.join(src_dir, row["file"])), ROOT))
            w.writerow([row["id"], row["url"], datetime.date.today().isoformat()])


if __name__ == "__main__":
    main()
