"""Light / funny / curious background score for non-horror "what if" stories (original, rendered with a real SoundFont).
python3 fun_score.py OUT.wav DURATION --map "0:intro,4:playful,18:build,26:chaos,34:twist,44:warm,52:outro" [--sf2 GeneralUser-GS.sf2] [--seed N] [--key 60] [--bpm 112] [--end-black T]
Moods: intro (curious hook), playful (bouncy pizzicato + marimba + light drums), build (adds drive, crescendo),
chaos (fast, full drums, brass stabs: things get out of hand), twist (minor, tense but not scary), warm (soft piano + strings),
outro (open question chord, music box), stop (silence for a comedic beat). 'hit:T' = a cartoon accent at time T.
"""
import argparse, wave, numpy as np, tinysoundfont as tsf
from scipy.signal import fftconvolve, butter, sosfilt

ap = argparse.ArgumentParser(); ap.add_argument("out"); ap.add_argument("dur", type=float)
ap.add_argument("--map", default="0:intro,4:playful"); ap.add_argument("--sf2", default="GeneralUser-GS.sf2")
ap.add_argument("--seed", type=int, default=1); ap.add_argument("--key", type=int, default=60); ap.add_argument("--bpm", type=float, default=112)
ap.add_argument("--end-black", type=float, default=None)
A = ap.parse_args(); SR = 44100; D = A.dur; R = np.random.default_rng(A.seed); K = A.key
items = sorted((float(a), b.strip()) for a, b in (x.split(":") for x in A.map.split(",") if x.strip()))
hits = [t for t, m in items if m == "hit"]; moods = [(t, m) for t, m in items if m != "hit"]
secs = []
for i, (t, m) in enumerate(moods):
    e = moods[i + 1][0] if i + 1 < len(moods) else D
    if A.end_black: e = min(e, A.end_black)
    if e - t > 0.2: secs.append((t, e, m))

EV = []
def note(ch, k, t, d, v):
    if t >= D or k < 21 or k > 108: return
    EV.append((t, 1, ch, int(k), int(np.clip(v, 1, 127)))); EV.append((min(D, t + d), 0, ch, int(k), 0))
PIANO, PIZZ, MAR, CLAR, STR, BRASS, BOX, TREM, BASS, DR = 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
PROG = {PIANO: 0, PIZZ: 45, MAR: 12, CLAR: 71, STR: 48, BRASS: 61, BOX: 10, TREM: 44, BASS: 32}
MAJ = [0, 2, 4, 5, 7, 9, 11]; MIN = [0, 2, 3, 5, 7, 8, 10]
def deg(d, o=0, sc=MAJ): return K + 12 * (o + d // 7) + sc[d % 7]
PROGR = [[0, 2, 4], [5, 7, 9], [3, 5, 7], [4, 6, 8]]      # I vi IV V
b = 60 / A.bpm
def drums(t0, t1, dens, v):
    t, i = t0, 0
    while t < t1 - 0.02:
        if i % 4 == 0: note(DR, 36, t, 0.1, v)
        if i % 8 == 4: note(DR, 38 if dens > 1 else 39, t, 0.1, v - 10)
        if dens >= 1 and i % 2 == 0: note(DR, 42, t, 0.05, v - 35)
        if dens >= 2: note(DR, 42, t + b / 4, 0.05, v - 45)
        if dens >= 1 and i % 2 == 1: note(DR, 70, t, 0.05, v - 40)
        t += b / 2; i += 1
for (t0, t1, m) in secs:
    L = t1 - t0
    if m == "intro":     # curious: plucked rising figure, question-like
        t = t0; i = 0; fig = [0, 2, 4, 7, 4, 9, 7, 11]
        while t < t1 - 0.1: note(PIZZ, deg(fig[i % 8]), t, b * 0.4, 70); note(MAR, deg(fig[i % 8], 1), t, b * 0.4, 50) if i % 2 == 0 else None; t += b / 2; i += 1
        note(STR, deg(0, -1), t0, L, 45); note(STR, deg(4, -1), t0, L, 40)
    elif m in ("playful", "build"):
        t = t0; i = 0; mel = [deg(R.choice([0, 1, 2, 4, 5]), 1) for _ in range(16)]
        while t < t1 - 0.05:
            c = PROGR[(i // 8) % 4]; f = (t - t0) / L
            note(PIZZ, deg(c[0], -1), t, b * 0.3, 85) if i % 2 == 0 else note(PIZZ, deg(c[2], -1), t, b * 0.3, 70)
            if i % 2 == 1: [note(PIANO, deg(x), t, b * 0.25, 52 + (25 * f if m == "build" else 0)) for x in c]
            if i % 2 == 0 or R.random() < 0.3: note(MAR, mel[i % 16] + (12 if m == "build" and f > 0.5 else 0), t, b * 0.5, 62)
            if i % 16 == 0: note(CLAR, deg(c[1], 1), t, b * 3.5, 50)
            t += b / 2; i += 1
        drums(t0, t1, 1 if m == "playful" else 2, 70 if m == "playful" else 82)
        if m == "build":
            for j in range(8): note(STR, deg(j, 0), t0 + L * j / 8, L / 8, 50 + 6 * j)
    elif m == "chaos":
        bb = b * 0.8; t = t0; i = 0; root = [0, 0, 3, 4]
        while t < t1 - 0.05:
            r = deg(root[(i // 8) % 4], -1)
            note(PIANO, r, t, bb * 0.4, 95); note(PIANO, r + 12, t, bb * 0.4, 85); note(BASS, r - 12, t, bb * 0.4, 100)
            if i % 4 == 2: [note(BRASS, deg(x, 0), t, bb * 0.35, 100) for x in PROGR[(i // 8) % 4]]
            t += bb / 2; i += 1
        t = t0; i = 0
        while t < t1 - 0.02:
            note(DR, 36, t, 0.1, 110) if i % 2 == 0 else note(DR, 38, t, 0.1, 100); note(DR, 42, t, 0.05, 70); note(DR, 54, t + bb / 4, 0.05, 60); t += bb / 2; i += 1
        note(DR, 49, t0, 1.5, 100)
    elif m == "twist":    # minor, tense but not horror
        t = t0; i = 0
        while t < t1 - 0.05:
            note(PIANO, deg(0, -1, MIN), t, b * 0.45, 70); note(PIANO, deg(0, -2, MIN), t, b * 0.45, 60) if i % 2 == 0 else None
            if i % 8 == 0: note(PIZZ, deg(R.choice([2, 4, 6]), 0, MIN), t, b, 75)
            t += b / 2; i += 1
        note(TREM, deg(2, 0, MIN), t0, L, 55); note(TREM, deg(4, 0, MIN), t0 + L / 3, L * 2 / 3, 60)
        tt = t0
        while tt < t1: note(DR, 36, tt, 0.1, 65); tt += b * 2
    elif m == "warm":
        t = t0; i = 0
        while t < t1 - 0.1:
            c = PROGR[(i // 8) % 4]; pat = [c[0] - 7, c[1], c[2], c[1] + 7]
            note(PIANO, deg(pat[i % 4]), t, b * 1.5, 55)
            if i % 8 == 0: [note(STR, deg(x, -1), t, min(b * 4, t1 - t), 45) for x in c]
            t += b / 2; i += 1
    elif m == "outro":    # sus chord + music box question
        for x in [0, 3, 4, 7]: note(STR, deg(x, -1), t0, L, 50)
        t = t0 + 0.2
        for d_ in [4, 3, 1, 3, 4, 7]:
            if t > t1 - 0.6: break
            note(BOX, deg(d_, 1), t, 1.2, 70); t += b
        note(PIANO, deg(3), max(t0, t1 - 1.2), 2, 50); note(PIANO, deg(4, -1), max(t0, t1 - 1.2), 2, 45)
for h in hits:   # cartoon accent: crash + brass + timpani-ish kick
    note(DR, 49, h, 1.2, 110); note(DR, 36, h, 0.2, 120); [note(BRASS, deg(x), h, 0.35, 105) for x in (0, 2, 4)]

syn = tsf.Synth(samplerate=SR, gain=-4); sf = syn.sfload(A.sf2)
for ch, pg in PROG.items(): syn.program_select(ch, sf, 0, pg)
syn.program_select(DR, sf, 128, 0)
EV.sort(key=lambda e: (e[0], e[1]))
N = int((D + 0.5) * SR); out = np.zeros((N, 2), np.float32); pos = 0
for (t, kind, ch, k, v) in EV + [(D + 0.5, -1, 0, 0, 0)]:
    i = min(N, int(t * SR))
    if i > pos: buf = np.frombuffer(syn.generate(i - pos), dtype=np.float32).reshape(-1, 2); out[pos:pos + len(buf)] = buf; pos = i
    if kind == 1: syn.noteon(ch, k, v)
    elif kind == 0: syn.noteoff(ch, k)
out = out[:int(D * SR)]
n = int(1.6 * SR); ir = R.standard_normal((n, 2)) * np.exp(-np.arange(n) / SR / 0.3)[:, None]
ir = sosfilt(butter(2, 7000, "low", fs=SR, output="sos"), ir, axis=0); ir /= np.sqrt((ir ** 2).sum(0))
mix = out * 0.85 + np.stack([fftconvolve(out[:, c], ir[:, c])[:len(out)] for c in range(2)], 1) * 0.2
t = np.arange(len(mix)) / SR
LV = {"intro": (0.55, 0.65), "playful": (0.6, 0.7), "build": (0.6, 0.8), "chaos": (0.42, 0.5), "twist": (0.55, 0.7), "warm": (0.5, 0.5), "outro": (0.55, 0.45), "stop": (0, 0)}
lev = np.zeros(len(t))
for (a, b_, m) in secs:
    lo, hi = LV.get(m, (0.6, 0.6)); seg = (t >= a) & (t < b_ + 0.3); f = np.clip((t[seg] - a) / max(0.1, b_ - a), 0, 1); lev[seg] = lo + (hi - lo) * f
k_ = int(0.25 * SR); lev = np.convolve(lev, np.ones(k_) / k_, mode="same")
mix *= lev[:, None]
fade = np.clip((D - t) / 1.0, 0, 1)
if A.end_black: fade *= np.where(t > A.end_black, np.clip(1 - (t - A.end_black) / 0.3, 0, 1), 1)
mix *= fade[:, None]; mix /= np.percentile(np.abs(mix), 99.95) + 1e-9; mix = np.tanh(mix * 0.9) * 0.89
w = wave.open(A.out, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes()); w.close()
print("fun score", A.out, [(round(a, 1), round(b_, 1), m) for a, b_, m in secs], "hits", hits)
