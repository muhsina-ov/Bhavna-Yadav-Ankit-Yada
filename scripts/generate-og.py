"""Generate the WhatsApp-optimised link-preview images for this invite.

    python scripts/generate-og.py

Reads names + venue from src/config/invite.ts and the artwork from
public/baat-pakki.jpg, then writes:

    public/og-baat-pakki-1200x630.jpg   primary preview (1.91:1, WhatsApp/FB/LinkedIn)
    public/og-baat-pakki-800x800.jpg    square preview / WhatsApp thumbnail fallback
    public/apple-touch-icon.png         180x180 home-screen icon

Requires Pillow. Google Fonts are downloaded on first run into
scripts/.og-fonts/ (git-ignored).
"""

import io
import os
import re
import sys
import urllib.request

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PUBLIC = os.path.join(ROOT, "public")
ART = os.path.join(PUBLIC, "baat-pakki.jpg")
CONFIG = os.path.join(ROOT, "src", "config", "invite.ts")
FONT_DIR = os.path.join(HERE, ".og-fonts")

# ── palette lifted from the artwork ────────────────────────────────────────
INK = (58, 41, 31, 255)
INK_SOFT = (92, 68, 50, 255)
GOLD = (176, 140, 86, 255)
GOLD_SOFT = (197, 165, 116, 255)
ROSE = (193, 122, 124, 255)
WARM = (253, 246, 234, 255)
HAZE = (150, 122, 96, 255)

FONT_SOURCES = {
    "GreatVibes-Regular.ttf":
        "https://github.com/google/fonts/raw/main/ofl/greatvibes/GreatVibes-Regular.ttf",
    "CormorantGaramond.ttf":
        "https://github.com/google/fonts/raw/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf",
    "PlayfairDisplay.ttf":
        "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf",
    "JosefinSans.ttf":
        "https://github.com/google/fonts/raw/main/ofl/josefinsans/JosefinSans%5Bwght%5D.ttf",
}

F_SCRIPT = os.path.join(FONT_DIR, "GreatVibes-Regular.ttf")  # names + ampersand
F_SERIF = os.path.join(FONT_DIR, "CormorantGaramond.ttf")  # tagline
F_DISPLAY = os.path.join(FONT_DIR, "PlayfairDisplay.ttf")  # lining figures for the date
F_SANS = os.path.join(FONT_DIR, "JosefinSans.ttf")  # letter-spaced caps

GOLD_RULE = (GOLD[0], GOLD[1], GOLD[2], 150)
_cache = {}


# ── config + fonts ─────────────────────────────────────────────────────────
def read_config():
    src = io.open(CONFIG, encoding="utf-8").read()

    def field(name):
        m = re.search(r'^\s*%s:\s*"([^"]+)"' % name, src, re.M)
        return m.group(1) if m else ""

    venue = re.search(r"venue:\s*\{(.*?)\n  \}", src, re.S)
    venue_block = venue.group(1) if venue else ""
    venue_name = re.search(r'name:\s*"([^"]+)"', venue_block)
    venue_city = re.search(r"city:\s*\"([^\"]+)\"", src)
    groom, bride = field("groom"), field("bride")
    return {
        # surnames are dropped here on purpose: a WhatsApp preview renders this
        # image ~400px wide, and two long names shrink the script to the point
        # where it stops reading. Surnames live in <title>/og:title instead.
        "groom": groom.split()[0],
        "bride": bride.split()[0],
        "date": field("dateLabel"),  # 14.10.26
        "day": field("dayLine"),
        "time": field("timeLine"),
        "venue": venue_name.group(1) if venue_name else "",
        "city": venue_city.group(1) if venue_city else "",
    }


def ensure_fonts():
    os.makedirs(FONT_DIR, exist_ok=True)
    for name, url in FONT_SOURCES.items():
        path = os.path.join(FONT_DIR, name)
        if os.path.exists(path):
            continue
        print("downloading", name)
        urllib.request.urlretrieve(url, path)


def font(path, size, variation=None):
    key = (path, size, variation)
    if key not in _cache:
        f = ImageFont.truetype(path, size)
        if variation:
            f.set_variation_by_name(variation)
        _cache[key] = f
    return _cache[key]


# ── drawing helpers ────────────────────────────────────────────────────────
def cover(img, w, h, fx=0.5, fy=0.5):
    """Scale to fill w*h, then crop keeping the focal point (fx, fy)."""
    s = max(w / img.width, h / img.height)
    img = img.resize(
        (int(round(img.width * s)), int(round(img.height * s))), Image.LANCZOS
    )
    left = max(0, min(img.width - w, int((img.width - w) * fx)))
    top = max(0, min(img.height - h, int((img.height - h) * fy)))
    return img.crop((left, top, left + w, top + h))


def tracked_width(f, text, tracking):
    return sum(f.getlength(c) for c in text) + tracking * max(0, len(text) - 1)


def draw_tracked(d, cx, y, text, f, fill, tracking=0):
    """Letter-spaced text horizontally centred on cx, vertically centred on y."""
    x = cx - tracked_width(f, text, tracking) / 2
    for ch in text:
        d.text((x, y), ch, font=f, fill=fill, anchor="lm")
        x += f.getlength(ch) + tracking


def rule(d, cx, y, w, color):
    d.line([(cx - w / 2, y), (cx - 16, y)], fill=color, width=1)
    d.line([(cx + 16, y), (cx + w / 2, y)], fill=color, width=1)
    d.polygon([(cx, y - 4), (cx + 4, y), (cx, y + 4), (cx - 4, y)], fill=color)


def ornament(d, cx, y, color):
    d.line([(cx - 34, y), (cx - 10, y)], fill=color, width=1)
    d.line([(cx + 10, y), (cx + 34, y)], fill=color, width=1)
    d.polygon([(cx, y - 5), (cx + 5, y), (cx, y + 5), (cx - 5, y)], fill=color)


def vignette(img, strength):
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).ellipse(
        (-w * 0.30, -h * 0.42, w * 1.30, h * 1.42), fill=255
    )
    mask = mask.filter(ImageFilter.GaussianBlur(radius=min(w, h) * 0.13))
    inv = mask.point(lambda v: int((255 - v) * strength / 255))
    dark = Image.new("RGBA", (w, h), (92, 62, 40, 255))
    clear = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    return Image.alpha_composite(img, Image.composite(dark, clear, inv))


def soften_centre(img, radius, amount):
    """Blur the middle band so the artwork's baked-in lettering melts away while
    the left/right florals stay crisp."""
    w, h = img.size
    blurred = img.filter(ImageFilter.GaussianBlur(radius=radius))

    vx, vy = max(1, int(w * 0.19)), max(1, int(h * 0.07))
    hx = Image.new("L", (w, 1), 0)
    px = hx.load()
    for x in range(w):
        t = (x / vx) if x < vx else ((w - x) / vx if x > w - vx else 1.0)
        px[x, 0] = int(255 * (t ** 0.85) * amount)

    vy_img = Image.new("L", (1, h), 0)
    py = vy_img.load()
    for y in range(h):
        py[0, y] = int(255 * (1.0 if y >= vy else (y / vy) ** 0.8))

    mask = ImageChops.multiply(hx.resize((w, h)), vy_img.resize((w, h)))
    return Image.composite(blurred, img, mask)


def panel(img, box, radius=10, fill=(255, 253, 248, 243)):
    x0, y0, x1, y1 = box
    shadow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        (x0, y0 + 7, x1, y1 + 9), radius=radius, fill=(74, 48, 30, 96)
    )
    img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(radius=17)))

    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle(box, radius=radius, fill=fill)
    d.rounded_rectangle(box, radius=radius, outline=GOLD_RULE, width=2)
    d.rounded_rectangle(
        (x0 + 9, y0 + 9, x1 - 9, y1 - 9),
        radius=radius - 9,
        outline=(GOLD[0], GOLD[1], GOLD[2], 62),
        width=1,
    )
    img.alpha_composite(layer)


def background(w, h, fy, blur, blur_amt, warm=52, vig=46):
    art = Image.open(ART).convert("RGBA")
    base = cover(art, w, h, fx=0.5, fy=fy)
    base = soften_centre(base, blur, blur_amt)
    base.alpha_composite(Image.new("RGBA", (w, h), WARM[:3] + (warm,)))
    return vignette(base, vig)


def stack(box, rows):
    """Lay out (height, gap, draw) rows vertically centred inside box."""
    x0, y0, x1, y1 = box
    total = sum(h for h, _, _ in rows) + sum(g for _, g, _ in rows)
    y = y0 + ((y1 - y0) - total) / 2
    for h, g, fn in rows:
        y += h / 2
        fn(y)
        y += h / 2 + g


def names_row(d, cx, y, max_w, max_size, cfg):
    """`Groom & Bride` in Great Vibes with a rose ampersand, auto-fitted."""
    gap = max_size * 0.20
    for size in range(max_size, 24, -4):
        fa = font(F_SCRIPT, size)
        fb = font(F_SCRIPT, int(size * 0.88))
        if (
            fa.getlength(cfg["groom"])
            + gap
            + fb.getlength("&")
            + gap
            + fa.getlength(cfg["bride"])
            <= max_w
        ):
            break
    wa = fa.getlength(cfg["groom"])
    wb = fb.getlength("&")
    wc = fa.getlength(cfg["bride"])
    x = cx - (wa + gap + wb + gap + wc) / 2
    d.text((x, y), cfg["groom"], font=fa, fill=INK, anchor="lm")
    x += wa + gap
    d.text((x, y + size * 0.06), "&", font=fb, fill=ROSE, anchor="lm")
    x += wb + gap
    d.text((x, y), cfg["bride"], font=fa, fill=INK, anchor="lm")


def one_name(d, cx, y, max_w, max_size, name):
    size = max_size
    while size > 20 and font(F_SCRIPT, size).getlength(name) > max_w:
        size -= 4
    f = font(F_SCRIPT, size)
    d.text((cx - f.getlength(name) / 2, y), name, font=f, fill=INK, anchor="lm")


def save_jpeg(img, path, quality=88):
    img.convert("RGB").save(
        path, "JPEG", quality=quality, optimize=True, progressive=True, subsampling=1
    )
    print("wrote %s (%d KB)" % (os.path.basename(path), os.path.getsize(path) // 1024))


# ── the three outputs ──────────────────────────────────────────────────────
def build_wide(cfg, out):
    """1200x630 — the ratio WhatsApp renders a link preview at full width."""
    w, h = 1200, 630
    base = background(w, h, fy=0.42, blur=7, blur_amt=0.92)
    box = (214, 58, 986, 572)
    panel(base, box)
    d = ImageDraw.Draw(base)
    cx = (box[0] + box[2]) / 2
    inner = (box[2] - box[0]) - 118

    stack(box, [
        (26, 12, lambda y: ornament(d, cx, y, GOLD_SOFT)),
        (26, 12, lambda y: draw_tracked(
            d, cx, y, "BAAT PAKKI", font(F_SANS, 17, "Medium"), GOLD, 6.5)),
        (152, 20, lambda y: names_row(d, cx, y, inner, 158, cfg)),
        (20, 20, lambda y: rule(d, cx, y, 250, GOLD_RULE)),
        (58, 13, lambda y: draw_tracked(
            d, cx, y, "14 \u00b7 10 \u00b7 2026",
            font(F_DISPLAY, 53, "SemiBold"), INK, 4)),
        (26, 13, lambda y: draw_tracked(
            d, cx, y, "TUESDAY \u00b7 7:00 PM ONWARDS",
            font(F_SANS, 18, "Medium"), INK_SOFT, 5)),
        (24, 15, lambda y: draw_tracked(
            d, cx, y, "%s \u00b7 %s" % (cfg["venue"].upper(), cfg["city"].upper()),
            font(F_SANS, 14, "Light"), HAZE, 4.2)),
        (26, 0, lambda y: draw_tracked(
            d, cx, y, "TWO FAMILIES, ONE BOND",
            font(F_SERIF, 22, "Medium"), ROSE, 2.2)),
    ])
    save_jpeg(base, out)


def build_square(cfg, out):
    """800x800 — square fallback for clients that prefer a 1:1 thumbnail."""
    w = h = 800
    base = background(w, h, fy=0.5, blur=8, blur_amt=0.95, warm=54, vig=50)
    box = (58, 60, 742, 740)
    panel(base, box)
    d = ImageDraw.Draw(base)
    cx = (box[0] + box[2]) / 2
    inner = (box[2] - box[0]) - 104

    stack(box, [
        (28, 12, lambda y: ornament(d, cx, y, GOLD_SOFT)),
        (28, 12, lambda y: draw_tracked(
            d, cx, y, "BAAT PAKKI", font(F_SANS, 17, "Medium"), GOLD, 6.5)),
        (124, 4, lambda y: one_name(d, cx, y, inner, 142, cfg["groom"])),
        (62, 2, lambda y: draw_tracked(
            d, cx, y, "&", font(F_SCRIPT, 78), ROSE)),
        (124, 20, lambda y: one_name(d, cx, y, inner, 142, cfg["bride"])),
        (20, 22, lambda y: rule(d, cx, y, 230, GOLD_RULE)),
        (54, 12, lambda y: draw_tracked(
            d, cx, y, "14 \u00b7 10 \u00b7 2026",
            font(F_DISPLAY, 48, "SemiBold"), INK, 4)),
        (26, 12, lambda y: draw_tracked(
            d, cx, y, "TUESDAY \u00b7 7:00 PM ONWARDS",
            font(F_SANS, 17, "Medium"), INK_SOFT, 5)),
        (24, 14, lambda y: draw_tracked(
            d, cx, y, "%s \u00b7 %s" % (cfg["venue"].upper(), cfg["city"].upper()),
            font(F_SANS, 13, "Light"), HAZE, 4.2)),
        (26, 0, lambda y: draw_tracked(
            d, cx, y, "TWO FAMILIES, ONE BOND",
            font(F_SERIF, 21, "Medium"), ROSE, 2.2)),
    ])
    save_jpeg(base, out)


def build_icon(out):
    """180x180 apple-touch-icon — a monogram, since the script caps are too
    wide to fit legibly at this size."""
    s = 180
    base = background(s, s, fy=0.5, blur=3, blur_amt=0.9, warm=40, vig=0)
    d = ImageDraw.Draw(base)
    d.rounded_rectangle(
        (3, 3, s - 4, s - 4), radius=36, outline=GOLD_RULE, width=2
    )
    d.rounded_rectangle(
        (10, 10, s - 11, s - 11), radius=29, fill=(255, 253, 248, 236)
    )
    d.rounded_rectangle(
        (16, 16, s - 17, s - 17), radius=23, outline=(GOLD[0], GOLD[1], GOLD[2], 70)
    )

    cx, gap = s / 2, 7
    for size in range(60, 18, -2):
        fa = font(F_DISPLAY, size, "SemiBold")
        fb = font(F_SCRIPT, int(size * 0.62))
        if fa.getlength("A") + gap + fb.getlength("&") + gap + fa.getlength("B") <= 118:
            break
    wa, wb = fa.getlength("A"), fb.getlength("&")
    wc = fa.getlength("B")
    x = cx - (wa + gap + wb + gap + wc) / 2
    d.text((x, 76), "A", font=fa, fill=INK, anchor="lm")
    x += wa + gap
    d.text((x, 74), "&", font=fb, fill=ROSE, anchor="lm")
    x += wb + gap
    d.text((x, 76), "B", font=fa, fill=INK, anchor="lm")
    rule(d, cx, 112, 84, GOLD_RULE)
    draw_tracked(d, cx, 136, "14 \u00b7 10 \u00b7 26", font(F_SANS, 14, "Medium"), GOLD, 2.6)

    base.convert("RGB").save(out, "PNG", optimize=True)
    print("wrote %s (%d KB)" % (os.path.basename(out), os.path.getsize(out) // 1024))


def main():
    if not os.path.exists(ART):
        sys.exit("missing artwork: %s" % ART)
    ensure_fonts()
    cfg = read_config()
    print("groom=%s  bride=%s" % (cfg["groom"], cfg["bride"]))
    build_wide(cfg, os.path.join(PUBLIC, "og-baat-pakki-1200x630.jpg"))
    build_square(cfg, os.path.join(PUBLIC, "og-baat-pakki-800x800.jpg"))
    build_icon(os.path.join(PUBLIC, "apple-touch-icon.png"))


if __name__ == "__main__":
    main()
