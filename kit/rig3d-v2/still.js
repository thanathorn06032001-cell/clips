const { chromium } = require("playwright"); const fs = require("fs");
(async () => { const b = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  for (const s of process.argv.slice(2)) { const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    await p.goto("http://localhost:8765/v2.html?s=" + s); await p.waitForFunction(() => window.READY, null, { timeout: 60000 }).catch(()=>{});
    const t0 = Date.now(); try { const d = await p.evaluate(() => window.shot()); fs.writeFileSync(`v_${s}.jpg`, Buffer.from(d.split(",")[1], "base64")); } catch (e) { errs.push(String(e)); }
    console.log(s, Date.now() - t0, "ms", errs.join(" | ").slice(0, 400)); await p.close(); }
  await b.close(); })();
