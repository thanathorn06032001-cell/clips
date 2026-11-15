import json, os, subprocess, wave, numpy as np
S = json.load(open("script.json")); SR = 44100; LEAD = 0.6; THR = 10 ** (-45 / 20)
VIS = lambda c: 0 if (c.isspace() or "ั" == c or "ิ" <= c <= "ฺ" or "็" <= c <= "๎") else 1
def load(i):  # decode + trim silence at both ends; returns audio and seconds cut from the start
    w = f"vo/{i:02d}.wav"
    subprocess.run(["ffmpeg","-v","error","-y","-i",f"vo/{i:02d}.mp3","-ac","1","-ar",str(SR),w],check=True)
    x = wave.open(w); a = np.frombuffer(x.readframes(x.getnframes()),"<i2").astype(np.float32)/32768
    on = np.nonzero(np.abs(a) > THR)[0]; i0 = max(0, on[0] - int(0.02*SR)) if len(on) else 0; i1 = min(len(a), on[-1] + int(0.02*SR)) if len(on) else len(a)
    return a[i0:i1], i0 / SR
def warp(i, cut, dur):  # [[text fraction, seconds after phrase start], ...] from ElevenLabs character times (tags in [] skipped)
    f = f"vo/{i:02d}.align.json"
    if not os.path.exists(f): return None
    A = json.load(open(f)); ch, ts = A["characters"], A["character_start_times_seconds"]; pts, n, tag = [], 0, False
    for c, s in zip(ch, ts):
        if c == "[": tag = True
        if not tag and VIS(c): pts.append([n, s - cut]); n += 1
        if c == "]": tag = False
    if n < 2: return None
    return [[round(k / n, 4), round(min(max(t, 0), dur), 3)] for k, t in pts] + [[1, round(dur, 3)]]
parts=[np.zeros(int(LEAD*SR))]; t=LEAD; ph=[]
for i,(txt,sub,gap) in enumerate(S,1):
    a, cut = load(i); d = len(a)/SR
    ph.append({"n":i,"start":round(t,3),"end":round(t+d,3),"sub":sub,"warp":warp(i, cut, d)})
    parts += [a, np.zeros(int(gap*SR))]; t += d + gap
y=np.concatenate(parts); y=y/np.max(np.abs(y))*0.9
o=wave.open("vo/vo.wav","wb"); o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes((y*32767).astype("<i2").tobytes()); o.close()
json.dump({"duration":round(len(y)/SR,3),"phrases":ph},open("timeline.json","w"),ensure_ascii=False)
print("duration", round(len(y)/SR,2), "| word timing:", "ElevenLabs" if all(p["warp"] for p in ph) else "by text length (some lines)")
for p in ph: print(p["n"], p["start"], round(p["end"]-p["start"],2))
