// node animr.js <shotName> <globalStart s> <dur s> <firstFrame> [ep.js] [fps]
const { chromium } = require("playwright"); const fs = require("fs");
const [name, g0, dur, start, ep, fpsA] = [process.argv[2], +process.argv[3], +process.argv[4], +process.argv[5], process.argv[6], process.argv[7]]; const FPS = +(fpsA || 30);
(async () => { const b = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on("pageerror", (e) => console.log("ERR", e.message));
  await p.goto("http://localhost:8765/v2.html"); await p.waitForFunction(() => window.READY, null, { timeout: 60000 }).catch(() => {});
  if (ep && ep !== "-") await p.evaluate((e) => window.loadEp(e), ep);
  await p.evaluate((n) => window.prep(n), name); const OUT = process.env.OUT || "frames"; fs.mkdirSync(OUT, { recursive: true });
  const N = Math.round(dur * FPS), t0 = Date.now();
  for (let i = 0; i < N; i++) { const f = `${OUT}/f${String(start + i).padStart(5, "0")}.jpg`; if (fs.existsSync(f)) continue; const d = await p.evaluate(([t, tg]) => window.frame(t, tg), [i / FPS, g0 + i / FPS]); fs.writeFileSync(f, Buffer.from(d.split(",")[1], "base64")); }
  console.log(name, N, "frames", ((Date.now() - t0) / Math.max(1, N)).toFixed(0), "ms/frame"); await b.close(); })();
