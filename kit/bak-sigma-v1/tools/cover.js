// node tools/cover.js IMG OUT W H "TITLE with | between lines" "KEYWORD" "BADGE" [focusY 0-100]   (max 3 lines; break only between Thai words). Run from the clip folder (needs fonts/).
// Thumbnail: still frame filling the canvas, dark gradient, huge Kanit title with black outline, KEYWORD in red, small red badge.
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const [img, out, W, H, title, key, badge, fy] = process.argv.slice(2);
const b64 = fs.readFileSync(img).toString("base64"), wide = +W > +H;
const t = title.split("|").map((l) => `<div class="ln">${key ? l.replace(key, `<b>${key}</b>`) : l}</div>`).join("");
const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@font-face{font-family:K;font-weight:700;src:url(file://${path.resolve("fonts/kanit-thai-700-normal.woff2")})}
@font-face{font-family:K;font-weight:700;src:url(file://${path.resolve("fonts/kanit-latin-700-normal.woff2")})}
html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#000}
.bg{position:absolute;inset:0;background:url(data:image/jpeg;base64,${b64}) center ${fy || 40}%/cover;filter:contrast(1.15) saturate(1.1)}
.sh{position:absolute;inset:0;background:${wide ? "linear-gradient(90deg,rgba(0,0,0,.85) 0%,rgba(0,0,0,.55) 45%,rgba(0,0,0,0) 75%)" : "linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.85) 78%)"};}
.vg{position:absolute;inset:0;box-shadow:inset 0 0 ${wide ? 160 : 260}px ${wide ? 40 : 80}px rgba(0,0,0,.7)}
.t{position:absolute;${wide ? "left:60px;top:50%;transform:translateY(-50%);width:62%;text-align:left;font-size:120px" : "left:50px;right:50px;bottom:300px;text-align:center;font-size:150px"};
 font-family:K;font-weight:700;line-height:1.08;color:#FFF;-webkit-text-stroke:${wide ? 14 : 18}px #000;paint-order:stroke fill}
.ln{white-space:nowrap}
.t b{color:#FFD447}
.bd{position:absolute;${wide ? "left:60px;top:50px" : "left:50%;transform:translateX(-50%);bottom:170px"};background:#E0332B;color:#fff;font-family:K;font-weight:700;font-size:${wide ? 52 : 64}px;padding:6px 34px;border-radius:14px;border:5px solid #000}
</style></head><body><div class="bg"></div><div class="sh"></div><div class="vg"></div><div class="t">${t}</div>${badge ? `<div class="bd">${badge}</div>` : ""}</body></html>`;
(async () => { fs.writeFileSync("_cover.html", html); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +W, height: +H } });
  await p.goto("file://" + path.resolve("_cover.html")); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.evaluate(() => { const t = document.querySelector(".t"); let fs = parseFloat(getComputedStyle(t).fontSize); const max = t.clientWidth; const widest = () => Math.max(...[...t.querySelectorAll(".ln")].map((l) => { const r = document.createRange(); r.selectNodeContents(l); return r.getBoundingClientRect().width; })); while (widest() > max && fs > 50) { fs -= 4; t.style.fontSize = fs + "px"; } });
  await p.screenshot({ path: out, type: "jpeg", quality: 92 }); await b.close(); console.log(out); })();
