#!/usr/bin/env python3
"""Tensile Grammar — visual canvas for Pružiny Praha."""

from PIL import Image, ImageDraw, ImageFont
import numpy as np
import math, os

FONTS = "/Users/luke/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/03f3aa0c-2374-4171-b75f-995eb4b90bdc/f402b5a4-2e92-48a8-ab59-36b21b2e2fb0/skills/canvas-design/canvas-fonts/"

W, H = 2200, 3100

# Palette
PAPER    = (245, 239, 226)
CHARCOAL = (22, 20, 18)
RUST     = (175, 62, 32)
INK_MED  = (105, 90, 68)
INK_FAINT= (200, 188, 168)
WHITE    = (255, 255, 255)

# ── helpers ──────────────────────────────────────────────────────────────────

def qbez_pts(p0, p1, p2, n=120):
    pts = []
    for i in range(n + 1):
        t = i / n
        x = (1-t)**2*p0[0] + 2*(1-t)*t*p1[0] + t**2*p2[0]
        y = (1-t)**2*p0[1] + 2*(1-t)*t*p1[1] + t**2*p2[1]
        pts.append((int(x), int(y)))
    return pts

def draw_dashed_line(draw, pts, fill, width=2, dash=14, gap=8):
    dist = 0
    drawing = True
    for i in range(len(pts)-1):
        x0, y0 = pts[i]; x1, y1 = pts[i+1]
        seg = math.hypot(x1-x0, y1-y0)
        if seg == 0: continue
        dx, dy = (x1-x0)/seg, (y1-y0)/seg
        pos = 0
        while pos < seg:
            rem = dash - dist if drawing else gap - dist
            end = min(pos + rem, seg)
            if drawing:
                draw.line([(x0+dx*pos, y0+dy*pos), (x0+dx*end, y0+dy*end)], fill=fill, width=width)
            dist += end - pos
            pos = end
            if drawing and dist >= dash: dist = 0; drawing = False
            elif not drawing and dist >= gap: dist = 0; drawing = True

def arrowhead(draw, tip, direction, size=18, fill=RUST):
    angle = math.atan2(direction[1], direction[0])
    for side in (+0.4, -0.4):
        ax = tip[0] - size * math.cos(angle + side)
        ay = tip[1] - size * math.sin(angle + side)
        draw.polygon([tip, (ax, ay), (int((tip[0]+ax)//2), int((tip[1]+ay)//2))], fill=fill)

def dim_line_h(draw, x0, x1, y, label, fnt, color=RUST, tick_h=22, above=True):
    draw.line([(x0, y - tick_h), (x0, y + tick_h)], fill=color, width=2)
    draw.line([(x1, y - tick_h), (x1, y + tick_h)], fill=color, width=2)
    draw.line([(x0, y), (x1, y)], fill=color, width=2)
    arrowhead(draw, (x0+2, y), (1, 0), fill=color)
    arrowhead(draw, (x1-2, y), (-1, 0), fill=color)
    mx = (x0 + x1) // 2
    bb = fnt.getbbox(label)
    tw = bb[2] - bb[0]; th = bb[3] - bb[1]
    ty = y - th - 14 if above else y + 14
    draw.text((mx - tw//2, ty), label, fill=color, font=fnt)

def dim_line_v(draw, x, y0, y1, label, fnt, color=RUST, tick_w=22, right=True):
    draw.line([(x - tick_w, y0), (x + tick_w, y0)], fill=color, width=2)
    draw.line([(x - tick_w, y1), (x + tick_w, y1)], fill=color, width=2)
    draw.line([(x, y0), (x, y1)], fill=color, width=2)
    arrowhead(draw, (x, y0+2), (0, 1), fill=color)
    arrowhead(draw, (x, y1-2), (0, -1), fill=color)
    my = (y0 + y1) // 2
    bb = fnt.getbbox(label)
    tw = bb[2] - bb[0]; th = bb[3] - bb[1]
    tx = x + 18 if right else x - tw - 18
    draw.text((tx, my - th//2), label, fill=color, font=fnt)

def reg_mark(draw, cx, cy, size=26):
    draw.line([(cx-size, cy), (cx+size, cy)], fill=INK_MED, width=1)
    draw.line([(cx, cy-size), (cx, cy+size)], fill=INK_MED, width=1)
    draw.ellipse([(cx-6, cy-6), (cx+6, cy+6)], outline=INK_MED, width=1)

def callout(draw, cx, cy, num, r=28, fnt=None, color=RUST):
    draw.ellipse([(cx-r, cy-r), (cx+r, cy+r)], outline=color, width=2)
    label = str(num)
    if fnt:
        bb = fnt.getbbox(label)
        tw = bb[2]-bb[0]; th = bb[3]-bb[1]
        draw.text((cx - tw//2, cy - th//2 - 2), label, fill=color, font=fnt)

# ── canvas ───────────────────────────────────────────────────────────────────

img = Image.new('RGB', (W, H), PAPER)

# paper noise
rng = np.random.default_rng(42)
noise = rng.normal(0, 4, (H, W, 3)).astype(np.int16)
arr = np.array(img).astype(np.int16)
arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
img = Image.fromarray(arr)
draw = ImageDraw.Draw(img)

# faint orthographic grid 40px
for gx in range(0, W, 40):
    draw.line([(gx, 0), (gx, H)], fill=INK_FAINT, width=1)
for gy in range(0, H, 40):
    draw.line([(0, gy), (W, gy)], fill=INK_FAINT, width=1)

# ── fonts ─────────────────────────────────────────────────────────────────────
f_display = ImageFont.truetype(FONTS + "BigShoulders-Bold.ttf", 340)
f_head    = ImageFont.truetype(FONTS + "BigShoulders-Bold.ttf", 52)
f_sub     = ImageFont.truetype(FONTS + "GeistMono-Regular.ttf", 26)
f_label   = ImageFont.truetype(FONTS + "GeistMono-Regular.ttf", 22)
f_tiny    = ImageFont.truetype(FONTS + "GeistMono-Regular.ttf", 18)
f_dim     = ImageFont.truetype(FONTS + "GeistMono-Regular.ttf", 28)
f_callout = ImageFont.truetype(FONTS + "GeistMono-Regular.ttf", 26)

# ── ghost watermark ───────────────────────────────────────────────────────────
ghost = Image.new('RGBA', (W, H), (0,0,0,0))
ghost_draw = ImageDraw.Draw(ghost)
wm = "PRUŽINY"
bb = f_display.getbbox(wm)
tw = bb[2]-bb[0]; th = bb[3]-bb[1]
ghost_draw.text(((W-tw)//2, (H-th)//2 - 180), wm, fill=(26,24,22,22), font=f_display)
img = Image.alpha_composite(img.convert('RGBA'), ghost).convert('RGB')
draw = ImageDraw.Draw(img)

# ── registration marks ────────────────────────────────────────────────────────
M = 60
for (rx, ry) in [(M, M), (W-M, M), (M, H-M), (W-M, H-M)]:
    reg_mark(draw, rx, ry)

# ── top header band ───────────────────────────────────────────────────────────
draw.line([(M+30, 108), (W-M-30, 108)], fill=CHARCOAL, width=1)
draw.text((M+40, 72), "TENSILE  GRAMMAR", fill=CHARCOAL, font=f_sub)
draw.text((W-M-40-200, 72), "REF: PP-2024-001", fill=INK_MED, font=f_tiny)

# ── secondary rule ────────────────────────────────────────────────────────────
draw.line([(M+30, 132), (W-M-30, 132)], fill=INK_FAINT, width=1)

# ── SPRING DRAWING ────────────────────────────────────────────────────────────
CX      = W // 2
Y_TOP   = 220
Y_BOT   = 2080
SPR_H   = Y_BOT - Y_TOP
N_COILS = 11
PITCH   = SPR_H / N_COILS
R       = 220                # wider for drama
WIRE_W  = 6
WIRE_D  = 3
CAP_H   = 28

# axis (center line — thin dash-dot)
axis_pts = [(CX, Y_TOP - 60), (CX, Y_BOT + 60)]
draw_dashed_line(draw, axis_pts, INK_FAINT, width=1, dash=20, gap=6)

# ghost offset shadow (offset +6,+6 in very faint ink — aged print feel)
SHADOW = (165, 152, 132)
draw.line([(CX - R + 2, Y_TOP + 4), (CX + R + 8, Y_TOP + 4)], fill=SHADOW, width=WIRE_W+2)
for i in range(N_COILS):
    y0 = Y_TOP + i * PITCH
    pts_r = qbez_pts((CX+4, y0+4), (CX+2*R+4, y0+PITCH*0.25+4), (CX+4, y0+PITCH*0.5+4))
    draw.line(pts_r, fill=SHADOW, width=WIRE_W)
draw.line([(CX - R + 2, Y_BOT + 4), (CX + R + 8, Y_BOT + 4)], fill=SHADOW, width=WIRE_W+2)

# top end cap
draw.line([(CX - R - 4, Y_TOP), (CX + R + 4, Y_TOP)], fill=CHARCOAL, width=WIRE_W+2)

# coils
for i in range(N_COILS):
    y0 = Y_TOP + i * PITCH
    # right arc (front face — solid, dark)
    pts_r = qbez_pts(
        (CX, y0),
        (CX + 2*R, y0 + PITCH*0.25),
        (CX, y0 + PITCH*0.5)
    )
    draw.line(pts_r, fill=CHARCOAL, width=WIRE_W)
    # left arc (back face — dashed, lighter)
    pts_l = qbez_pts(
        (CX, y0 + PITCH*0.5),
        (CX - 2*R, y0 + PITCH*0.75),
        (CX, y0 + PITCH)
    )
    draw_dashed_line(draw, pts_l, INK_MED, width=WIRE_D, dash=18, gap=10)

# bottom end cap
draw.line([(CX - R - 4, Y_BOT), (CX + R + 4, Y_BOT)], fill=CHARCOAL, width=WIRE_W+2)

# ── DIMENSION LINES ───────────────────────────────────────────────────────────
# Outer diameter (horizontal, above spring)
DIM_Y_TOP = Y_TOP - 80
dim_line_h(draw, CX - R, CX + R, DIM_Y_TOP, "Ø 18.5 mm", f_dim, above=True)

# Total free length (vertical, right side)
DIM_X_R = CX + R + 160
dim_line_v(draw, DIM_X_R, Y_TOP, Y_BOT, "L₀  186 mm", f_dim, right=True)

# Coil pitch (vertical, left side, shows 2 coils)
DIM_X_L = CX - R - 140
pitch_y0 = Y_TOP + 2 * PITCH
pitch_y1 = Y_TOP + 4 * PITCH
dim_line_v(draw, DIM_X_L, int(pitch_y0), int(pitch_y1), "p  16.9 mm", f_dim, right=False)

# leader line from left dim to spring edge
draw.line([(DIM_X_L + 22, int(pitch_y0 + (pitch_y1-pitch_y0)//2)),
           (CX - R, int(pitch_y0 + (pitch_y1-pitch_y0)//2))],
          fill=RUST, width=1)

# Wire diameter callout leader
wire_demo_y = Y_TOP + PITCH * 1.25
wire_cx = int(CX + R * 0.35)
wire_cy = int(wire_demo_y)
# small wire circle at coil midpoint
draw.ellipse([(wire_cx-18, wire_cy-18), (wire_cx+18, wire_cy+18)], outline=RUST, width=2)
leader_end_x = CX + R + 320
leader_end_y = wire_cy - 80
draw.line([(wire_cx+18, wire_cy), (leader_end_x, leader_end_y)], fill=RUST, width=1)
draw.line([(leader_end_x, leader_end_y), (leader_end_x + 140, leader_end_y)], fill=RUST, width=1)
draw.text((leader_end_x + 8, leader_end_y - 34), "d  2.5 mm", fill=RUST, font=f_label)
draw.text((leader_end_x + 8, leader_end_y + 6),  "ČSN EN 10270-1", fill=INK_MED, font=f_tiny)

# ── CALLOUT CIRCLES ───────────────────────────────────────────────────────────
call_x = CX - R - 300
callout(draw, call_x, Y_TOP + 60,             1, fnt=f_callout)
callout(draw, call_x, int(Y_TOP + PITCH*5.5), 2, fnt=f_callout)
callout(draw, call_x, Y_BOT - 60,             3, fnt=f_callout)
# leader lines from callouts to spring
draw.line([(call_x + 30, Y_TOP + 60),        (CX - R - 8, Y_TOP + 60)],        fill=RUST, width=1)
draw.line([(call_x + 30, int(Y_TOP+PITCH*5.5)), (CX - R - 8, int(Y_TOP+PITCH*5.5))], fill=RUST, width=1)
draw.line([(call_x + 30, Y_BOT - 60),        (CX - R - 8, Y_BOT - 60)],        fill=RUST, width=1)

# callout legend
leg_x = M + 40
leg_y = Y_BOT + 90
draw.line([(leg_x, leg_y - 10), (W - M - 40, leg_y - 10)], fill=INK_FAINT, width=1)
entries = [
    ("① KONEC UZAVŘENÝ BROUŠENÝ", "CLOSED & GROUND END"),
    ("② AKTIVNÍ ZÁVIT",           "ACTIVE COIL"),
    ("③ KONEC UZAVŘENÝ BROUŠENÝ", "CLOSED & GROUND END"),
]
for idx, (cz, en) in enumerate(entries):
    draw.text((leg_x, leg_y + idx * 46), cz, fill=CHARCOAL, font=f_label)
    draw.text((leg_x + 660, leg_y + idx * 46), en, fill=INK_MED, font=f_tiny)

# ── BOTTOM TITLE BLOCK ────────────────────────────────────────────────────────
TB_Y = leg_y + 3 * 46 + 50
draw.line([(M+30, TB_Y), (W-M-30, TB_Y)], fill=CHARCOAL, width=2)
draw.line([(M+30, TB_Y+2), (W-M-30, TB_Y+2)], fill=CHARCOAL, width=1)

# company name large
comp = "PRUŽINY PRAHA"
bb = f_head.getbbox(comp)
draw.text((M+40, TB_Y + 26), comp, fill=CHARCOAL, font=f_head)

# vertical dividers in title block
div_x1 = M + 30 + 640
div_x2 = W - M - 30 - 360
for dx in [div_x1, div_x2]:
    draw.line([(dx, TB_Y), (dx, H - M - 30)], fill=INK_MED, width=1)

# left block text
draw.text((M+40, TB_Y + 100), "Radějovice 12 · Kamenice · 251 68", fill=INK_MED, font=f_tiny)
draw.text((M+40, TB_Y + 130), "info@pruzina.cz · +420 603 426 796", fill=INK_MED, font=f_tiny)
draw.text((M+40, TB_Y + 164), "ISO 9001:2015  ·  OHSAS 18001:2007", fill=RUST, font=f_tiny)

# middle block
draw.text((div_x1 + 24, TB_Y + 26),  "TLAČNÁ PRUŽINA",   fill=CHARCOAL, font=f_sub)
draw.text((div_x1 + 24, TB_Y + 74),  "VÝKRES č.",        fill=INK_MED, font=f_tiny)
draw.text((div_x1 + 24, TB_Y + 98),  "PP-TL-0042",       fill=CHARCOAL, font=f_label)
draw.text((div_x1 + 24, TB_Y + 134), "MATERIÁL",         fill=INK_MED, font=f_tiny)
draw.text((div_x1 + 24, TB_Y + 158), "1.4301 (AISI 304)",fill=CHARCOAL, font=f_label)
draw.text((div_x1 + 24, TB_Y + 194), "POVRCH. ÚPRAVA",   fill=INK_MED, font=f_tiny)
draw.text((div_x1 + 24, TB_Y + 218), "BEZ ÚPRAVY",       fill=CHARCOAL, font=f_label)

# right block
draw.text((div_x2 + 24, TB_Y + 26),  "MĚŘÍTKO",          fill=INK_MED, font=f_tiny)
draw.text((div_x2 + 24, TB_Y + 50),  "1 : 1",            fill=CHARCOAL, font=f_sub)
draw.text((div_x2 + 24, TB_Y + 100), "DATUM",            fill=INK_MED, font=f_tiny)
draw.text((div_x2 + 24, TB_Y + 124), "11.06.2024",       fill=CHARCOAL, font=f_label)
draw.text((div_x2 + 24, TB_Y + 170), "Rev. A",           fill=INK_MED, font=f_label)

# bottom border line
draw.line([(M+30, H-M-30), (W-M-30, H-M-30)], fill=CHARCOAL, width=1)

# ── surface finish symbol (top-right of spring area) ─────────────────────────
sf_x = CX + R + 320
sf_y = Y_TOP + 180
# classic check-mark surface finish symbol
draw.line([(sf_x, sf_y+30), (sf_x+18, sf_y)],  fill=RUST, width=2)
draw.line([(sf_x+18, sf_y), (sf_x+44, sf_y+24)], fill=RUST, width=2)
draw.text((sf_x + 8, sf_y + 36), "Ra 1.6", fill=RUST, font=f_tiny)

# tolerance note lower left
tol_x = M + 40
tol_y = Y_BOT + 22
draw.text((tol_x, tol_y), "VŠEOBECNÉ TOLERANCE DLE ISO 2768-m", fill=INK_MED, font=f_tiny)

# ── save ──────────────────────────────────────────────────────────────────────
out = "/Users/luke/Documents/Pruzina-redesign/tensile-grammar.png"
img.save(out, "PNG", dpi=(150, 150))
print(f"Saved → {out}")
