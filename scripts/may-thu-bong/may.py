"""MAY THÚ BÔNG — biến mọi hình (emoji) thành thú bông lông nhung cùng một phong cách với bộ thú.

Mỗi hình: lấy dáng và màu của biểu tượng → phồng thành khối tròn mềm (bản đồ độ cao từ khoảng cách
tới mép) → chiếu sáng như studio (đèn chính trên-trái, đèn viền, bóng đổ mềm dưới chân) → phủ thớ lông
nhung ngắn và viền lông xù → (tuỳ loại) gắn mắt hạt cườm, má hồng, miệng chỉ như các bạn thú.

Chạy: python3 -I scripts/may-thu-bong/may.py <danh-sách.json> <thư-mục-ra> [cỡ]
"""

import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"
SIZE = int(sys.argv[3]) if len(sys.argv) > 3 else 320
SS = 2  # vẽ to gấp đôi rồi thu nhỏ cho mịn
rng = np.random.default_rng(7)


def glyph(ch: str) -> Image.Image:
    font = ImageFont.truetype(FONT, 109)
    im = Image.new("RGBA", (160, 160), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((80, 80), ch, font=font, embedded_color=True, anchor="mm")
    bb = im.getbbox()
    if not bb:
        raise ValueError("không vẽ được " + ch)
    return im.crop(bb)


def blur(a: np.ndarray, r: float) -> np.ndarray:
    im = Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r))).astype(np.float32) / 255


def distance(mask: np.ndarray) -> np.ndarray:
    """Khoảng cách từ mỗi điểm bên trong tới mép."""
    try:
        from scipy.ndimage import distance_transform_edt

        return distance_transform_edt(mask).astype(np.float32)
    except ImportError:  # không có scipy: quét hai chiều (chậm hơn)
        return _distance_slow(mask)


def _distance_slow(mask: np.ndarray) -> np.ndarray:
    h, w = mask.shape
    d = np.where(mask, 1e6, 0.0).astype(np.float64)
    a, b = 1.0, 1.4142
    for y in range(h):
        row = d[y]
        if y > 0:
            up = d[y - 1]
            row = np.minimum(row, up + a)
            row[1:] = np.minimum(row[1:], up[:-1] + b)
            row[:-1] = np.minimum(row[:-1], up[1:] + b)
        for x in range(1, w):
            if row[x - 1] + a < row[x]:
                row[x] = row[x - 1] + a
        d[y] = row
    for y in range(h - 1, -1, -1):
        row = d[y]
        if y < h - 1:
            dn = d[y + 1]
            row = np.minimum(row, dn + a)
            row[1:] = np.minimum(row[1:], dn[:-1] + b)
            row[:-1] = np.minimum(row[:-1], dn[1:] + b)
        for x in range(w - 2, -1, -1):
            if row[x + 1] + a < row[x]:
                row[x] = row[x + 1] + a
        d[y] = row
    return d.astype(np.float32)


def fur_noise(h: int, w: int, scale: float) -> np.ndarray:
    """Thớ lông: nhiễu hạt mịn kéo dài theo một hướng nghiêng nhẹ."""
    n = rng.random((h, w)).astype(np.float32)
    im = Image.fromarray((n * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(scale * 0.6))
    im = im.transform(im.size, Image.AFFINE, (1, 0.25, 0, 0, 1, 0), resample=Image.BILINEAR)
    m = np.asarray(im).astype(np.float32) / 255
    return (m - m.mean()) / (m.std() + 1e-6)


def plush(ch: str, face: bool = False, tint: tuple | None = None) -> Image.Image:
    g = glyph(ch)
    W = SIZE * SS
    body = int(W * 0.8)
    s = body / max(g.size)
    g = g.resize((max(1, int(g.width * s)), max(1, int(g.height * s))), Image.LANCZOS)
    canvas = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    ox, oy = (W - g.width) // 2, int(W * 0.05) + (body - g.height) // 2
    canvas.paste(g, (ox, oy), g)
    arr = np.asarray(canvas).astype(np.float32) / 255
    rgb, alpha = arr[..., :3], arr[..., 3]
    # mép mềm, bịt lỗ nhỏ
    soft = blur(alpha, W * 0.006)
    mask = soft > 0.45
    # màu: làm dịu, ngả phấn như lông bông (bớt gắt, bớt bão hoà)
    col = blur(rgb * alpha[..., None], W * 0.004) / np.maximum(blur(alpha, W * 0.004)[..., None], 1e-3)
    col = np.clip(col, 0, 1)
    lum = col.mean(axis=2, keepdims=True)
    col = lum + (col - lum) * 0.82
    col = col * 0.86 + 0.12
    if tint:
        col = col * 0.5 + np.array(tint, np.float32) / 255 * 0.5
    # chiều cao: vòm phồng theo khoảng cách tới mép (tính ở độ phân giải thấp cho nhanh)
    d = distance(mask)
    D = max(d.max(), 1)
    t = np.clip(d / (D * 0.55), 0, 1)
    hgt = np.sqrt(1 - (1 - t) ** 2) * D * 0.9 + d * 0.15
    hgt = blur(hgt / (hgt.max() + 1e-6), W * 0.01) * (hgt.max() + 1e-6)
    # thớ lông làm gồ ghề bề mặt một chút
    fn = fur_noise(W, W, 1.6)
    hgt_f = hgt + fn * (W * 0.0025)
    gy, gx = np.gradient(hgt_f)
    n = np.dstack([-gx, -gy, np.ones_like(gx) * 1.0])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    L = np.array([-0.45, -0.6, 0.66])
    L /= np.linalg.norm(L)
    V = np.array([0, 0, 1.0])
    diff = np.clip((n * L).sum(axis=2), 0, 1)
    # nhung: sáng ở rìa khi nhìn nghiêng (sheen) + ánh viền phía sau-phải
    ndv = np.clip(n[..., 2], 0, 1)
    sheen = (1 - ndv) ** 2.2
    R = np.array([0.7, -0.2, 0.3])
    R /= np.linalg.norm(R)
    rim = np.clip((n * R).sum(axis=2), 0, 1) ** 3
    ao = np.clip(0.55 + 0.45 * (hgt / (hgt.max() + 1e-6)) ** 0.5, 0, 1)
    shade = 0.42 + 0.62 * diff
    out = col * shade[..., None] * ao[..., None]
    out += sheen[..., None] * (col * 0.5 + 0.28) * 0.55
    out += rim[..., None] * 0.22
    # thớ lông: chấm sáng tối li ti
    fine = fur_noise(W, W, 0.7)
    out *= (1 + fine[..., None] * 0.07)
    out = np.clip(out, 0, 1)
    # viền lông xù: alpha bị nhiễu ở mép
    edge = np.clip(1 - d / (W * 0.018), 0, 1)
    fuzz = blur(rng.random((W, W)).astype(np.float32), 0.8)
    a = soft.copy()
    a = np.where(edge > 0, np.clip(a - edge * (fuzz - 0.35) * 1.3, 0, 1), a)
    grow = blur(soft, W * 0.004)
    a = np.maximum(a, np.clip((grow - 0.25) * 2, 0, 1) * (fuzz > 0.62))
    a = np.where(a < 0.04, 0, a)
    img = Image.fromarray(np.dstack([out, a]).__mul__(255).clip(0, 255).astype(np.uint8), "RGBA")
    if face:
        img = add_face(img, d, D)
    # bóng đổ mềm dưới chân
    ys = np.where(a > 0.5)[0]
    bottom = ys.max() if len(ys) else W
    sh = Image.new("L", (W, W), 0)
    xs = np.where(a > 0.5)[1]
    cx = (xs.min() + xs.max()) / 2 if len(xs) else W / 2
    wid = (xs.max() - xs.min()) * 0.42 if len(xs) else W * 0.3
    ImageDraw.Draw(sh).ellipse((cx - wid, bottom - W * 0.025, cx + wid, bottom + W * 0.03), fill=70)
    sh = sh.filter(ImageFilter.GaussianBlur(W * 0.016))
    base = Image.new("RGBA", (W, W), (40, 60, 58, 0))
    base.putalpha(sh)
    base.alpha_composite(img)
    return base.resize((SIZE, SIZE), Image.LANCZOS)


def add_face(img: Image.Image, d: np.ndarray, D: float) -> Image.Image:
    """Mắt hạt cườm, má hồng, miệng chỉ — đặt ở vùng dày nhất (xa mép nhất) của hình."""
    W = img.width
    # vùng dày nhất, ưu tiên phần thân (thấp hơn) để mặt không nằm trên lá, cuống
    yy = np.arange(d.shape[0], dtype=np.float32)[:, None] / d.shape[0]
    y, x = np.unravel_index(np.argmax(d * (0.7 + 0.6 * yy)), d.shape)
    r = max(D * 0.15, W * 0.022)
    r = float(min(r, W * 0.045))
    gap = r * 2.6
    cy = y + r * 0.1
    lay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    dr = ImageDraw.Draw(lay)
    for sx in (-1, 1):
        ex = x + sx * gap
        dr.ellipse((ex - r * 1.7 - r * 0.2 * sx, cy + r * 0.9, ex + r * 1.7 - r * 0.2 * sx, cy + r * 2.3), fill=(255, 140, 160, 95))
    lay = lay.filter(ImageFilter.GaussianBlur(r * 0.55))
    dr = ImageDraw.Draw(lay)
    for sx in (-1, 1):
        ex = x + sx * gap
        dr.ellipse((ex - r, cy - r * 1.1, ex + r, cy + r * 1.1), fill=(22, 16, 20, 255))
        dr.ellipse((ex - r * 0.55, cy - r * 0.75, ex - r * 0.05, cy - r * 0.25), fill=(255, 255, 255, 255))
    mw = gap * 0.42
    dr.arc((x - mw, cy + r * 0.2, x + mw, cy + r * 1.7), 25, 155, fill=(40, 24, 28, 255), width=max(2, int(r * 0.32)))
    out = img.copy()
    out.alpha_composite(lay)
    return out


if __name__ == "__main__":
    items = json.load(open(sys.argv[1], encoding="utf-8"))
    os.makedirs(sys.argv[2], exist_ok=True)
    for it in items:
        if os.path.exists(os.path.join(sys.argv[2], it["key"] + ".webp")) and not os.environ.get("LAM_LAI"):
            continue
        try:
            if it.get("src"):
                im = Image.open(it["src"]).convert("RGBA").resize((SIZE, SIZE), Image.LANCZOS)
                im.save(os.path.join(sys.argv[2], it["key"] + ".webp"), "WEBP", quality=88, method=6)
                print(it["key"], "ảnh có sẵn", flush=True)
                continue
            im = plush(it["e"], it.get("face", False), tuple(it["tint"]) if it.get("tint") else None)
            im.save(os.path.join(sys.argv[2], it["key"] + ".webp"), "WEBP", quality=86, method=6)
            print(it["key"], "ok", flush=True)
        except Exception as ex:  # một hình lỗi không làm dừng cả lô
            print(it["key"], "LỖI", ex, flush=True)
