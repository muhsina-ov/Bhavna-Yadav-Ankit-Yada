"""Generate the link-preview images for this invite.

    npm run og

Reads names + venue from src/config/invite.ts and the artwork from
public/baat-pakki.jpg, then writes exactly two files:

    public/og-card.jpg             1200x630 preview (WhatsApp/Facebook/LinkedIn)
    public/apple-touch-icon.png    180x180 home-screen icon

One preview image on purpose. Two og:image tags make crawlers disagree about
which one wins, so the same link can preview as either. If you ever need a
square crop for a status post, generate it separately rather than adding a
second og:image.

The filename is deliberately stable. WhatsApp caches a preview against the
page URL, not the image URL, so renaming the file does not force a refresh for
links already shared - a new share URL is the only thing that does.

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
    "AlexBrush-Regular.ttf":
        "https://github.com/google/fonts/raw/main/ofl/alexbrush/AlexBrush-Regular.ttf",
    "CormorantGaramond.ttf":
        "https://github.com/google/fonts/raw/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf",
    "PlayfairDisplay.ttf":
        "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf",
    "JosefinSans.ttf":
        "https://github.com/google/fonts/raw/main/ofl/josefinsans/JosefinSans%5Bwght%5D.ttf",
}

# Alex Brush is the brush hand the client picked in the reference artwork, and it
# is the face the invitation itself now uses for the couple's names, so the card
# and the page agree. It is also a heavy face - thick downstrokes - so unlike a
# fine script it keeps a solid silhouette at WhatsApp's preview width.
F_SCRIPT = os.path.join(FONT_DIR, "AlexBrush-Regular.ttf")  # names + ampersand
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
        # First names only: what the 180px icon has room for.
        "groom": groom.split()[0],
        "bride": bride.split()[0],
        # Full names, surnames included, in the config's own casing. The card
        # sets these in a brush script, which must not be shouted - uppercasing
        # Alex Brush turns the capitals into unreadable swashy forms.
        "groom_full": groom,
        "bride_full": bride,
        "date": field("dateLabel"),  # 14.10.26
        "day": field("dayLine"),
        "time": field("timeLine"),
        "venue": venue_name.group(1) if venue_name else "",
        "city": venue_city.group(1) if venue_city else "",
        "initials": (groom[0].upper(), bride[0].upper()),
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
    """Lay out (measure, gap, draw) rows vertically centred inside box.

    `measure` is a fixed height or a callable returning the row's true ink
    height. Each draw fn receives the centre of its own ink and is responsible
    for centring on it.
    """
    x0, y0, x1, y1 = box
    heights = [(m() if callable(m) else m) for m, _, _ in rows]
    total = sum(heights) + sum(g for _, g, _ in rows)
    y = y0 + ((y1 - y0) - total) / 2
    for h, (_, g, fn) in zip(heights, rows):
        y += h / 2
        fn(y)
        y += h / 2 + g


def ink_span(f, text):
    """(top, bottom) of a text run's real ink, relative to its own baseline.

    `top` is negative for anything reaching above the baseline. Faces like
    Alex Brush carry ascenders, swashes and descenders well outside the nominal
    em box, so the spacing of a lockup has to come from measured glyphs rather
    than from the point size - and measuring against the baseline (not against
    an em-box anchor) is what keeps the measured block the same height as the
    drawn one.
    """
    _, top, _, bottom = f.getbbox(text, anchor="ls")
    return top, bottom


def lockup_metrics(
    max_w, max_h, face, lines, start, floor, gap_ratio=0.12, step=2, variation=None
):
    """Largest point size at which a stacked lockup fits the box on both axes.

    `lines` is [(text, size_ratio, fill), ...] in draw order, where `size_ratio`
    scales that line off the lockup's point size; optional 4th and 5th elements
    override `face` and `variation` for that line alone (used to set one line in
    a different hand). Returns `(size, gap, spans, height)`, with each span a
    `(font, width, top, bottom)` tuple describing that line's ink against its
    own baseline.

    Height is a real constraint here, not just width: a brush script is a wide
    face (`Bhavna Yadav` runs about 5.4em in Alex Brush), so two stacked lines
    plus the ampersand run out of a 630px card's vertical room well before they
    run out of its width. A width-only fit overflows the panel.
    """
    size = start
    metrics = None
    while size >= floor:
        gap = size * gap_ratio
        spans, height, widest = [], 0.0, 0.0
        for line in lines:
            text, ratio, fill = line[0], line[1], line[2]
            f = font(
                line[3] if len(line) > 3 else face,
                max(8, int(size * ratio)),
                line[4] if len(line) > 4 else variation,
            )
            top, bottom = ink_span(f, text)
            width = f.getlength(text)
            spans.append((f, width, top, bottom))
            height += bottom - top
            widest = max(widest, width)
        metrics = (size, gap, spans, height + gap * (len(lines) - 1))
        if widest <= max_w and metrics[3] <= max_h:
            break
        size -= step
    return metrics


def lockup_height(max_w, max_h, face, lines, start, floor, **kw):
    """Total ink height of a stacked lockup, including its inter-line gaps."""
    return lockup_metrics(max_w, max_h, face, lines, start, floor, **kw)[3]


def lockup(d, cx, y, max_w, max_h, face, lines, start, floor, **kw):
    """Draw a stacked lockup with the whole block's ink centred on `y`.

    Lines are laid out baseline-first from the top of the block, so a line's
    flourishes can never eat into its neighbour's space.
    """
    size, gap, spans, height = lockup_metrics(
        max_w, max_h, face, lines, start, floor, **kw
    )
    top = y - height / 2
    for line, (f, width, above, below) in zip(lines, spans):
        d.text((cx - width / 2, top - above), line[0], font=f, fill=line[2],
               anchor="ls")
        top += (below - above) + gap
    return size


def save_jpeg(img, path, quality=88):
    img.convert("RGB").save(
        path, "JPEG", quality=quality, optimize=True, progressive=True, subsampling=1
    )
    print("wrote %s (%d KB)" % (os.path.basename(path), os.path.getsize(path) // 1024))


# ── the two outputs ────────────────────────────────────────────────────────
def build_wide(cfg, out):
    """1200x630 — the ratio WhatsApp renders a link preview at full width."""
    w, h = 1200, 630
    base = background(w, h, fy=0.42, blur=7, blur_amt=0.92)
    box = (186, 34, 1014, 596)
    panel(base, box)
    d = ImageDraw.Draw(base)
    cx = (box[0] + box[2]) / 2
    inner = (box[2] - box[0]) - 118
    g, b = cfg["groom_full"], cfg["bride_full"]
    # The couple's names, stacked, in the same brush hand the invitation uses.
    # Full names, not first names: the surnames are the point of a wedding card,
    # and at this size the pair still fills the column (508 of 710px).
    #
    # The panel is 562px tall and the other seven rows claim ~296 of it, so 236
    # is what the three-line lockup gets once it is given room to breathe.
    name_max_h = 236
    name_lines = [(g, 1.0, INK), ("&", 0.44, ROSE), (b, 1.0, INK)]

    stack(box, [
        (26, 8, lambda y: ornament(d, cx, y, GOLD_SOFT)),
        (24, 26, lambda y: draw_tracked(
            d, cx, y, "BAAT PAKKI", font(F_SANS, 16, "Medium"), GOLD, 6.5)),
        (lambda: lockup_height(inner, name_max_h, F_SCRIPT, name_lines, 120, 28,
                               gap_ratio=0.11), 16,
         lambda y: lockup(d, cx, y, inner, name_max_h, F_SCRIPT, name_lines, 120, 28,
                          gap_ratio=0.11)),
        (16, 18, lambda y: rule(d, cx, y, 236, GOLD_RULE)),
        (56, 11, lambda y: draw_tracked(
            d, cx, y, "14 · 10 · 2026",
            font(F_DISPLAY, 50, "SemiBold"), INK, 4)),
        (25, 10, lambda y: draw_tracked(
            d, cx, y, "TUESDAY · 7:00 PM ONWARDS",
            font(F_SANS, 17, "Medium"), INK_SOFT, 5)),
        (23, 12, lambda y: draw_tracked(
            d, cx, y, "%s · %s" % (cfg["venue"].upper(), cfg["city"].upper()),
            font(F_SANS, 13, "Light"), HAZE, 4.2)),
        (25, 0, lambda y: draw_tracked(
            d, cx, y, "TWO FAMILIES, ONE BOND",
            font(F_SERIF, 21, "Medium"), ROSE, 2.2)),
    ])
    save_jpeg(base, out)


def build_icon(cfg, out):
    """180x180 apple-touch-icon — a monogram, since the brush hand is too
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

    # First names only here: at 180px the surnames drop below legibility, and
    # this is the one place the lockup must stay readable at ~40px. Serif caps
    # rather than the brush hand for the same reason - a 40px script is mush.
    cx = s / 2
    lockup(d, cx, 74, 136, 90, F_DISPLAY, [
        (cfg["groom"].upper(), 1.0, INK),
        ("&", 0.52, ROSE, F_SCRIPT, None),
        (cfg["bride"].upper(), 1.0, INK),
    ], 40, 34, gap_ratio=0.10, variation="SemiBold")
    rule(d, cx, 122, 84, GOLD_RULE)
    draw_tracked(d, cx, 143, "14 · 10 · 26", font(F_SANS, 13, "Medium"), GOLD, 2.4)

    base.convert("RGB").save(out, "PNG", optimize=True)
    print("wrote %s (%d KB)" % (os.path.basename(out), os.path.getsize(out) // 1024))


def main():
    if not os.path.exists(ART):
        sys.exit("missing artwork: %s" % ART)
    ensure_fonts()
    cfg = read_config()
    print("groom=%s  bride=%s" % (cfg["groom"], cfg["bride"]))
    build_wide(cfg, os.path.join(PUBLIC, "og-card.jpg"))
    build_icon(cfg, os.path.join(PUBLIC, "apple-touch-icon.png"))


if __name__ == "__main__":
    main()
