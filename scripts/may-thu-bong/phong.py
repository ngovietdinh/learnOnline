"""Đóng gói ảnh thú bông thành PHÔNG EMOJI "Thu Bong" (bảng sbix + CBDT/CBLC).

Trình duyệt dùng phông này trước phông emoji của máy (giới hạn unicode-range ở các ký tự có hình),
nên MỌI emoji trong bài học — kể cả "🍎🍎🍎" nằm giữa câu chữ — đều hiện thành thú bông cùng một phong cách.

Chạy: python3 -I scripts/may-thu-bong/phong.py <danh-sách.json> <thư-mục-ảnh> <tệp-ra.ttf> [cỡ-ảnh]
  danh-sách.json: [{"e": "🍎", "key": "1f34e"}, ...]  — ảnh <thư-mục-ảnh>/<key>.webp (hoặc .png)
"""

import io
import json
import os
import struct
import sys

from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import newTable
from fontTools.ttLib.tables._s_b_i_x import table__s_b_i_x
from fontTools.ttLib.tables.sbixGlyph import Glyph as SbixGlyph
from fontTools.ttLib.tables.sbixStrike import Strike
from PIL import Image

UPM = 2048
ASC, DESC = 1900, 500  # khung cao hơn chữ một chút để hình thú bông không bị cắt


def png_bytes(path: str, px: int) -> bytes:
    im = Image.open(path).convert("RGBA").resize((px, px), Image.LANCZOS)
    b = io.BytesIO()
    im.save(b, "PNG", optimize=True)
    return b.getvalue()


def gname(seq: str) -> str:
    return "u" + "_".join(f"{ord(c):04X}" for c in seq)


def build(items, img_dir: str, out: str, px: int):
    singles: dict[int, str] = {}
    ligs: list[tuple[list[int], str]] = []
    images: dict[str, str] = {}
    for it in items:
        seq = it["e"]
        path = next((os.path.join(img_dir, it["key"] + x) for x in (".png", ".webp") if os.path.exists(os.path.join(img_dir, it["key"] + x))), None)
        if not path:
            continue
        cps = [ord(c) for c in seq]
        core = [c for c in cps if c != 0xFE0F]
        name = gname("".join(chr(c) for c in core))
        images[name] = path
        if len(core) == 1:
            singles[core[0]] = name
        else:
            ligs.append((core, name))
    # ký tự thành phần của chuỗi ghép cũng cần có trong bảng mã
    helpers: dict[int, str] = {}
    for core, _ in ligs:
        for c in core:
            if c not in singles:
                helpers[c] = f"h{c:04X}"
    names = [".notdef", "space", "uFE0F"] + sorted(set(images)) + sorted(set(helpers.values()))
    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(names)
    cmap = {0x20: "space", 0xFE0F: "uFE0F", **{c: n for c, n in helpers.items()}, **singles}
    fb.setupCharacterMap(cmap)
    pen = TTGlyphPen(None)
    empty = pen.glyph()
    fb.setupGlyf({n: empty for n in names})
    adv = ASC + DESC
    metrics = {n: (adv, 0) for n in names}
    metrics["uFE0F"] = (0, 0)
    metrics["space"] = (UPM // 4, 0)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=ASC, descent=-DESC)
    fb.setupNameTable({"familyName": "Thu Bong", "styleName": "Regular"})
    fb.setupOS2(sTypoAscender=ASC, sTypoDescender=-DESC, usWinAscent=ASC, usWinDescent=DESC, fsType=0)
    fb.setupPost()
    if ligs:
        fea = "languagesystem DFLT dflt;\nfeature ccmp {\n"
        for core, name in sorted(ligs, key=lambda x: -len(x[0])):
            parts = " ".join(singles.get(c) or helpers[c] for c in core)
            fea += f"  sub {parts} by {name};\n"
        # chuỗi có kèm dấu chọn kiểu FE0F
        for core, name in ligs:
            pass
        fea += "} ccmp;\n"
        addOpenTypeFeaturesFromString(fb.font, fea)
    font = fb.font
    # sbix (Safari, Chrome trên Mac và nhiều trình duyệt khác)
    sbix = table__s_b_i_x()
    strike = Strike(ppem=px, resolution=72)
    data = {n: png_bytes(p, px) for n, p in images.items()}
    for n in names:
        if n in data:
            strike.glyphs[n] = SbixGlyph(glyphName=n, graphicType="png ", imageData=data[n], originOffsetX=0, originOffsetY=int(-DESC / UPM * px))
        else:
            strike.glyphs[n] = SbixGlyph(glyphName=n)
    sbix.strikes[px] = strike
    font["sbix"] = sbix
    if os.environ.get("CBDT"):
        build_cbdt(font, names, data, px)
    font.save(out)
    print(f"{out}: {len(images)} hình, {os.path.getsize(out) // 1024} KB")
    # @font-face chỉ áp cho đúng các ký tự có hình — chữ thường không bị ảnh hưởng
    cps = sorted(set(cmap) - {0x20, 0xFE0F} | {0xFE0F, 0x200D})
    ranges, start, prev = [], None, None
    for c in cps:
        if start is None:
            start = prev = c
        elif c == prev + 1:
            prev = c
        else:
            ranges.append((start, prev))
            start = prev = c
    ranges.append((start, prev))
    ur = ", ".join(f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}" for a, b in ranges)
    css = os.path.splitext(out)[0] + ".css"
    with open(css, "w", encoding="utf-8") as f:
        f.write(f"@font-face {{\n  font-family: 'Thu Bong';\n  src: url('{os.path.basename(out)}') format('truetype');\n  font-display: swap;\n  unicode-range: {ur};\n}}\n")
    print(css)


def build_cbdt(font, names, data, px):
    """CBDT/CBLC (Chrome/Edge/Android dùng FreeType): định dạng ảnh 17 (PNG + metrics nhỏ)."""
    from fontTools.ttLib.tables.BitmapGlyphMetrics import SmallGlyphMetrics
    from fontTools.ttLib.tables.C_B_D_T_ import cbdt_bitmap_format_17
    from fontTools.ttLib.tables.E_B_L_C_ import BitmapSizeTable, SbitLineMetrics, eblc_index_sub_table_1
    from fontTools.ttLib import newTable as nt

    cbdt = nt("CBDT")
    cblc = nt("CBLC")
    cbdt.version = 3.0
    cblc.version = 3.0
    order = font.getGlyphOrder()
    gids = sorted(order.index(n) for n in data)
    strike = {}
    for n in data:
        m = SmallGlyphMetrics()
        m.height = px
        m.width = px
        m.BearingX = 0
        m.BearingY = int(ASC / UPM * px)
        m.Advance = int((ASC + DESC) / UPM * px)
        bmp = cbdt_bitmap_format_17(b"", font)
        bmp.metrics = m
        bmp.imageData = data[n]
        strike[n] = bmp
    cbdt.strikeData = [strike]
    size = BitmapSizeTable(None, font)
    size.colorRef = 0
    size.startGlyphIndex = gids[0]
    size.endGlyphIndex = gids[-1]
    size.ppemX = size.ppemY = px
    size.bitDepth = 32
    size.flags = 1
    for attr in ("hori", "vert"):
        lm = SbitLineMetrics()
        lm.ascender = int(ASC / UPM * px)
        lm.descender = -int(DESC / UPM * px)
        lm.widthMax = px
        for k in ("caretSlopeNumerator", "caretSlopeDenominator", "caretOffset", "minOriginSB", "minAdvanceSB", "maxBeforeBL", "minAfterBL", "pad1", "pad2"):
            setattr(lm, k, 0)
        lm.caretSlopeNumerator = 1
        setattr(size, attr, lm)
    # các khoảng chỉ số glyph liên tiếp → mỗi khoảng một bảng con
    runs, cur = [], [gids[0]]
    for g in gids[1:]:
        if g == cur[-1] + 1:
            cur.append(g)
        else:
            runs.append(cur)
            cur = [g]
    runs.append(cur)
    subs = []
    for r in runs:
        st = eblc_index_sub_table_1(None, font)
        st.indexFormat = 1
        st.imageFormat = 17
        st.firstGlyphIndex = r[0]
        st.lastGlyphIndex = r[-1]
        st.names = [order[g] for g in r]
        subs.append(st)
    size.indexSubTables = subs
    size.numberOfIndexSubTables = len(subs)
    cblc.strikes = [type("S", (), {})()]
    cblc.strikes[0].bitmapSizeTable = size
    cblc.strikes[0].indexSubTables = subs
    font["CBDT"] = cbdt
    font["CBLC"] = cblc


if __name__ == "__main__":
    items = json.load(open(sys.argv[1], encoding="utf-8"))
    build(items, sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 160)
