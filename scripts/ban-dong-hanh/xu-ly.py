"""Chuẩn bị ảnh các bạn đồng hành (bộ thiết kế thú bông lông ngắn, mặt kem) cho ứng dụng.

- Tách nền trắng → nền trong suốt (giữ bóng mềm dưới chân), khử viền trắng ở ngọn lông.
- Tách ảnh nhóm thành từng bạn.
- Tự tạo khung "mắt nhắm cười" (tô mắt bằng màu mặt rồi thêu nét cong) để các bạn biết chớp mắt.

Chạy: python3 -I scripts/ban-dong-hanh/xu-ly.py <thư-mục-ảnh-gốc> public/thu-bong
"""

import sys
from collections import deque

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC, OUT = sys.argv[1], sys.argv[2]
SIZE = 512


def flood_bg(near_bg: np.ndarray) -> np.ndarray:
    """Vùng nền: các điểm gần màu nền nối liền với mép ảnh."""
    h, w = near_bg.shape
    reg = np.zeros_like(near_bg)
    reg[0, :] = near_bg[0, :]
    reg[-1, :] = near_bg[-1, :]
    reg[:, 0] = near_bg[:, 0]
    reg[:, -1] = near_bg[:, -1]
    while True:
        grow = reg.copy()
        grow[1:, :] |= reg[:-1, :]
        grow[:-1, :] |= reg[1:, :]
        grow[:, 1:] |= reg[:, :-1]
        grow[:, :-1] |= reg[:, 1:]
        grow &= near_bg
        if (grow == reg).all():
            return reg
        reg = grow


def cutout(img: Image.Image) -> Image.Image:
    a = np.asarray(img.convert("RGB")).astype(np.float32)
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    bg = np.median(border, axis=0)
    d = np.max(bg - a, axis=2)  # tối hơn nền bao nhiêu
    sat = a.max(axis=2) - a.min(axis=2)
    diff = np.maximum(np.abs(bg - a).max(axis=2), sat * 2.6)
    # tính vùng nền ở nửa độ phân giải cho nhanh
    small = Image.fromarray((diff < 11).astype(np.uint8) * 255).resize((a.shape[1] // 2, a.shape[0] // 2))
    reg = flood_bg(np.asarray(small) > 127)
    reg = np.asarray(Image.fromarray(reg.astype(np.uint8) * 255).resize((a.shape[1], a.shape[0]))) > 127
    alpha = np.where(reg, np.clip((diff - 3) / 20, 0, 1), 1.0)
    # khử màu nền ở điểm nửa trong: C = a*F + (1-a)*B  →  F = (C - (1-a)B)/a
    al = np.maximum(alpha, 1e-3)[..., None]
    fg = np.clip((a - (1 - al) * bg) / al, 0, 255)
    fg = np.where(alpha[..., None] > 0.995, a, fg)
    rgba = np.dstack([fg, alpha * 255]).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def largest_part(im: Image.Image) -> Image.Image:
    """Giữ phần nhân vật lớn nhất (bỏ tay/chân bạn bên cạnh lọt vào khung)."""
    al = np.asarray(im)[..., 3]
    small = np.asarray(Image.fromarray(al).resize((al.shape[1] // 4, al.shape[0] // 4))) > 140
    h, w = small.shape
    lab = np.zeros((h, w), np.int32)
    best, best_n, cur = 0, 0, 0
    for y in range(h):
        for x in range(w):
            if small[y, x] and not lab[y, x]:
                cur += 1
                q = deque([(y, x)])
                lab[y, x] = cur
                n = 0
                while q:
                    cy, cx = q.popleft()
                    n += 1
                    for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                        if 0 <= ny < h and 0 <= nx < w and small[ny, nx] and not lab[ny, nx]:
                            lab[ny, nx] = cur
                            q.append((ny, nx))
                if n > best_n:
                    best, best_n = cur, n
    keep = (lab == best).astype(np.uint8) * 255
    # nới vùng giữ một chút để không mất ngọn lông và bóng chân
    keep_img = Image.fromarray(keep).resize((al.shape[1], al.shape[0]))
    k = np.asarray(keep_img) > 0
    for _ in range(14):
        g = k.copy()
        g[1:] |= k[:-1]
        g[:-1] |= k[1:]
        g[:, 1:] |= k[:, :-1]
        g[:, :-1] |= k[:, 1:]
        k = g
    arr = np.asarray(im).copy()
    arr[..., 3] = np.where(k, arr[..., 3], 0)
    return Image.fromarray(arr, "RGBA")


def square(im: Image.Image) -> Image.Image:
    al = np.asarray(im)[..., 3]
    ys, xs = np.where(al > 12)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    side = int(max(x1 - x0, y1 - y0) * 1.03)
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im.crop((cx - side // 2, cy - side // 2, cx - side // 2 + side, cy - side // 2 + side)), (0, 0))
    return canvas.resize((SIZE, SIZE), Image.LANCZOS)


def eyes_of(im: Image.Image):
    """Tìm hai mắt: hai đốm đen tròn lớn nhất ở nửa trên."""
    a = np.asarray(im).astype(np.int32)
    lum = a[..., :3].mean(axis=2)
    dark = (lum < 70) & (a[..., 3] > 200)
    h, w = dark.shape
    dark[int(h * 0.62):] = False
    seen = np.zeros_like(dark)
    blobs = []
    for y in range(h):
        for x in range(w):
            if dark[y, x] and not seen[y, x]:
                q = deque([(y, x)])
                seen[y, x] = True
                pts = []
                while q:
                    cy, cx = q.popleft()
                    pts.append((cy, cx))
                    for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                        if 0 <= ny < h and 0 <= nx < w and dark[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            q.append((ny, nx))
                ys = [p[0] for p in pts]
                xs = [p[1] for p in pts]
                bw, bh = max(xs) - min(xs) + 1, max(ys) - min(ys) + 1
                round_ = min(bw, bh) / max(bw, bh)
                if len(pts) > 20 and round_ > 0.6:
                    cx, cy, r = sum(xs) / len(xs), sum(ys) / len(ys), max(bw, bh) / 2
                    # mắt thật nằm trên tấm mặt sáng màu (loại tai đen của gấu trúc, đốm bò…)
                    y0, y1, x0, x1 = int(cy - r * 2.2), int(cy + r * 2.2), int(cx - r * 2.2), int(cx + r * 2.2)
                    if y0 < 0 or x0 < 0 or y1 >= h or x1 >= w:
                        continue
                    yy, xx = np.mgrid[y0:y1, x0:x1]
                    ring = (np.hypot(xx - cx, yy - cy) > r * 1.6) & (np.hypot(xx - cx, yy - cy) < r * 2.1)
                    rc = a[y0:y1, x0:x1][ring][:, :3].mean(axis=0)
                    # quanh mắt là tấm mặt màu kem: sáng và ngả vàng (lông trắng/đốm bò thì trung tính)
                    if rc.mean() > 175 and 16 < rc[0] - rc[2] < 75 and cy < h * 0.5:
                        blobs.append((len(pts), cx, cy, r))
    # chọn cặp ngang hàng, cùng cỡ, cách nhau vừa phải
    best, score = blobs[:2], 1e9
    for i in range(len(blobs)):
        for j in range(i + 1, len(blobs)):
            p, q = blobs[i], blobs[j]
            dx, dy = abs(p[1] - q[1]), abs(p[2] - q[2])
            rr = (p[3] + q[3]) / 2
            if dy < rr and 3 * rr < dx < 14 * rr and abs(p[3] - q[3]) < rr * 0.5:
                sc = dy - (p[0] + q[0]) * 0.01
                if sc < score:
                    best, score = [p, q], sc
    return best


def blink(im: Image.Image) -> Image.Image:
    """Mắt nhắm cười: lấp mắt cũ bằng cách "loang" màu mặt xung quanh vào (không lộ vết vá), rồi thêu nét cong."""
    arr = np.asarray(im).astype(np.float32)
    rgb = arr[..., :3].copy()
    eyes = eyes_of(im)
    for _, cx, cy, r in eyes:
        box = int(r * 2.2) + 2
        y0, y1, x0, x1 = int(cy) - box, int(cy) + box, int(cx) - box, int(cx) + box
        sub = rgb[y0:y1, x0:x1]
        yy, xx = np.mgrid[y0:y1, x0:x1]
        hole = np.hypot(xx - cx, yy - cy) < r * 1.3
        sub[hole] = sub[~hole].mean(axis=0)
        for _ in range(400):
            avg = (np.roll(sub, 1, 0) + np.roll(sub, -1, 0) + np.roll(sub, 1, 1) + np.roll(sub, -1, 1)) / 4
            sub[hole] = avg[hole]
        rgb[y0:y1, x0:x1] = sub
    out = Image.fromarray(np.dstack([rgb, arr[..., 3]]).astype(np.uint8), "RGBA")
    S = 4
    for _, cx, cy, r in eyes:
        box = int(r * 3)
        patch = Image.new("RGBA", (box * 2 * S, box * 2 * S), (0, 0, 0, 0))
        d = ImageDraw.Draw(patch)
        c = box * S
        w = r * 1.15 * S
        d.arc((c - w, c - w * 0.55, c + w, c + w * 1.25), 200, 340, fill=(26, 20, 20, 255), width=max(2, int(r * 0.42 * S)))
        out.alpha_composite(patch.resize((box * 2, box * 2), Image.LANCZOS), (int(cx) - box, int(cy) - box))
    return out


def save(im: Image.Image, name: str):
    im.save(f"{OUT}/{name}.webp", "WEBP", quality=88, method=6)
    blink(im).save(f"{OUT}/{name}-nham.webp", "WEBP", quality=88, method=6)
    print(name, "ok", len(eyes_of(im)), "mắt")


import os

ANIMALS = {
    "cat": "meo", "dog": "cho", "bunny": "tho", "bear": "gau", "panda": "gautruc", "fox": "cao", "frog": "ech",
    "duck": "vit", "penguin": "canhcut", "elephant": "voi", "lion": "sutu", "tiger": "ho", "monkey": "khi",
    "koala": "koala", "pig": "heo", "cow": "bo", "sheep": "cuu", "hamster": "hamster", "owl": "cu", "chick": "gacon",
    "octopus": "bachtuoc", "whale": "cavoi", "deer": "nai", "raccoon": "gaumeo", "hedgehog": "nhim", "turtle": "rua",
    "seal": "haicau", "bat": "doi", "squirrel": "soc", "giraffe": "huou",
}
ONLY = os.environ.get("CHI")  # VD CHI=dong-vat để chỉ xử lý bộ con vật
PICK = set(filter(None, os.environ.get("CON", "").split(",")))  # VD CON=cuu,huou để làm lại vài bạn
singles = {} if ONLY == "dong-vat" else {"hong": "jolly-pink-waving", "bacha": "jolly-mint-daisy", "may": "jolly-blue-strawhat"}
for en, vi in ANIMALS.items():
    f = f"{SRC}/jolly-animal-{en}.webp"
    if ONLY != "co-ban" and os.path.exists(f) and (not PICK or vi in PICK):
        singles[vi] = f"jolly-animal-{en}"
for name, f in singles.items():
    save(square(largest_part(cutout(Image.open(f"{SRC}/{f}.webp")))), name)

def classes(arr: np.ndarray):
    rgb = arr[..., :3].astype(np.float32) / 255
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    sat = (rgb.max(axis=2) - rgb.min(axis=2)) / np.maximum(rgb.max(axis=2), 1e-3)
    return {
        "hong": r - g > 0.11,
        "bacha": g > r + 0.01,
        "kem": (r - g <= 0.09) & (g <= r + 0.01) & (g >= b - 0.01) & (sat < 0.3),
    }


def isolate(group: Image.Image, keep: str, x0: int, x1: int, face: tuple, cuts: list) -> Image.Image:
    """Giữ một bạn trong ảnh nhóm: cắt theo cột, bỏ các vùng chữ nhật `cuts` (tay bạn bên cạnh),
    và bỏ điểm ảnh mang màu lông bạn khác (trừ trong tấm mặt `face`)."""
    arr = np.asarray(group).copy()
    H, W = arr.shape[:2]
    cls = classes(arr)
    yy, xx = np.mgrid[0:H, 0:W]
    fx0, fy0, fx1, fy1 = face
    in_face = (xx >= fx0) & (xx < fx1) & (yy >= fy0) & (yy < fy1)
    others = [k for k in ("hong", "bacha") if k != keep] if keep != "kem" else []
    ok = (xx >= x0) & (xx < x1)
    for k in others:
        ok &= ~(cls[k] & ~in_face)
    for cx0, cy0, cx1, cy1 in cuts:
        ok &= ~((xx >= cx0) & (xx < cx1) & (yy >= cy0) & (yy < cy1))
    arr[..., 3] = np.where(ok, arr[..., 3], 0)
    return largest_part(Image.fromarray(arr, "RGBA"))


if ONLY == "dong-vat":
    sys.exit(0)
group = cutout(Image.open(f"{SRC}/jolly-family-lineup.webp"))
sx, sy = group.width / 1920, group.height / 1280
S = lambda b: tuple(int(v * (sx if i % 2 == 0 else sy)) for i, v in enumerate(b))
save(square(isolate(group, "kem", 0, int(714 * sx), S((200, 370, 540, 620)), [S((700, 0, 1920, 660))])), "kem")
save(
    square(isolate(group, "hong", int(560 * sx), int(1360 * sx), S((790, 280, 1110, 610)), [S((0, 640, 722, 1280)), S((1205, 640, 1920, 1280))])),
    "hongvui",
)
