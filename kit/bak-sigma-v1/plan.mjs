// node plan.mjs ep.js [--check]  -> "name start dur firstFrame" per shot (from the episode's exported `cuts`); --check -> "name globalMid 0.04 index localMid" for mid-frame stills
import fs from "fs"; globalThis.fetch = async (u) => ({ json: async () => JSON.parse(fs.readFileSync(String(u).split("?")[0], "utf8")) });
const m = await import("./" + process.argv[2] + "?v=" + Date.now()); const C = m.cuts, FPS = 30;
for (let i = 0; i + 1 < C.length; i++) { const [n, s] = C[i], e = C[i + 1][1], f0 = Math.round(s * FPS), f1 = Math.round(e * FPS);
  if (process.argv[3] === "--check") console.log(`${n} ${((s + e) / 2).toFixed(2)} 0.04 ${i} ${((e - s) / 2).toFixed(2)}`); else console.log(`${n} ${(f0 / FPS).toFixed(3)} ${((f1 - f0) / FPS).toFixed(3)} ${f0}`); }
