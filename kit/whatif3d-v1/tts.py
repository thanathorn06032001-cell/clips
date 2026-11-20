import json, os, urllib.request, time, base64
K = open(os.path.expanduser("~/.secrets/elevenlabs")).read().strip()
S = json.load(open("script.json")); V = "nPczCjzI2devNBz1zQrb"
for i, (t, _, _) in enumerate(S):
    out = f"vo/{i+1:02d}.mp3"
    if os.path.exists(out): continue
    body = {"text": t, "model_id": "eleven_v4", "language_code": "th",
            "voice_settings": {"stability": 0.35, "similarity_boost": 0.8, "style": 0.45, "speed": 0.92},
            "previous_text": S[i-1][0] if i else None, "next_text": S[i+1][0] if i+1 < len(S) else None,
            "seed": 4242}
    # with-timestamps: same credits, also returns per-character times -> word-by-word subtitles
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{V}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), headers={"xi-api-key": K, "Content-Type": "application/json"})
    for a in range(3):
        try:
            r = json.loads(urllib.request.urlopen(req, timeout=90).read())
            open(out, "wb").write(base64.b64decode(r["audio_base64"]))
            json.dump(r.get("normalized_alignment") or r.get("alignment"), open(f"vo/{i+1:02d}.align.json", "w"), ensure_ascii=False); break
        except Exception as e:
            print("retry", i+1, e); time.sleep(2)
    print(i+1, os.path.getsize(out))
