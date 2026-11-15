// node render.js OUTDIR FPS F0 F1 | node render.js --preview t1 t2 ... | node render.js --cues   (run in the episode folder)
const path = require("path"), fs = require("fs"); const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto("file://" + path.resolve("index.html")); await p.evaluate(() => window.READY); await p.waitForTimeout(300);
  if (errs.length) console.log("ERRORS", errs);
  const a = process.argv.slice(2);
  const grab = async (t, f) => { await p.evaluate((t) => render(t), t); await p.screenshot({ path: f, type: "jpeg", quality: 88 }); };
  if (a[0] === "--cues") { fs.writeFileSync("cues.json", JSON.stringify(await p.evaluate(() => window.CUES))); console.log("cues saved", await p.evaluate(() => [window.CUES.length, window.END_BLACK])); }
  else if (a[0] === "--preview") { fs.mkdirSync("prev", { recursive: true }); for (const t of a.slice(1).map(Number)) await grab(t, `prev/t${t.toFixed(2)}.jpg`); console.log("preview ok"); }
  else { const [out, fps, f0, f1] = [a[0], +a[1], +a[2], +a[3]]; fs.mkdirSync(out, { recursive: true });
    for (let f = f0; f < f1; f++) await grab(f / fps, path.join(out, `f${String(f).padStart(5, "0")}.jpg`)); }
  if (errs.length) console.log("ERRORS", errs); await b.close();
})();
