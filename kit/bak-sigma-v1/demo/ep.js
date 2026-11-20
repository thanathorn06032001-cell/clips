// TEST: ถ้ามึงเจองูในห้องน้ำ (บักซิกม่าบอย)
const TL = await (await fetch("timeline.json?v=" + Date.now())).json();
const P = (n) => ({ s: TL.phrases[n - 1].start, e: TL.phrases[n - 1].end }), sc = (n) => P(n).s - 0.1, DUR = TL.duration;
const lin = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a))), eo = (x) => 1 - Math.pow(1 - x, 3);
// snake coiled in the toilet bowl, head rising by k (0..1)
const coil = (k, t) => { const pts = []; for (let i = 0; i <= 14; i++) { const a = i * 0.9 + t * 0.6, r = 0.11 - i * 0.002; pts.push([0.6 + Math.cos(a) * r, 0.36 + i * 0.004, -0.86 + Math.sin(a) * r]); } const top = pts[pts.length - 1]; pts.push([top[0], 0.46 + 0.25 * k, top[2] + 0.06 * k]); pts.push([top[0], 0.5 + 0.42 * k + Math.sin(t * 3) * 0.02, top[2] + 0.18 * k]); return pts; };
export const cuts = [["door", 0], ["reveal", 1.9], ["shock", 3.1], ["intro", sc(2)], ["rule1", sc(3)], ["rule2", sc(4)], ["rule3", sc(5)], ["end", sc(6)], ["_end", DUR]];
const rule = (n, txt, t) => ({ type: "wcard", t, end: sc(n + 3), tag: `ข้อ ${n} · RULE ${n}`, lines: [txt], icon: "✅", col: "#D9443C", x: 60, y: 170, w: 620 });
export default {
  channel: "บักซิกม่าบอย",
  shots: {
    door: (L) => { const B = L.bathroom(); const a = L.SIGMA("normal"); a.position.set(0, 0, 2.0); a.rotation.y = Math.PI; L.scene.add(a); const sn = L.snake(); sn.userData.pose(coil(0, 0));
      return (t) => { B.open(eo(lin(t, 0.2, 1.1))); sn.userData.pose(coil(0, t)); L.cam.position.set(0.3, 1.45, -0.9); L.cam.lookAt(0, 1.3, 1.6); L.cam.fov = 50; }; },
    reveal: (L) => { const B = L.bathroom(); B.open(1); const sn = L.snake();
      return (t) => { const k = eo(lin(t, 0.1, 0.7)); sn.userData.pose(coil(k, t)); sn.userData.anim(t); L.cam.position.set(0.05, 1.35, 0.7); L.cam.lookAt(0.6, 0.62, -0.86); L.cam.fov = 36; }; },
    shock: (L) => { const B = L.bathroom(); B.open(1); const a = L.SIGMA("shock"); a.position.set(0, 0, 1.75); a.rotation.y = Math.PI; L.scene.add(a);
      return (t) => { a.userData.arms.forEach((A, i) => { A.rotation.x = -2.85; A.rotation.z = (i ? -1 : 1) * 0.35; }); L.cam.position.set(0.1, 1.5, 0.0 - t * 0.05); L.cam.lookAt(0, 1.4, 1.75); L.cam.fov = 40; }; },
    intro: (L) => { L.soiDay(); const a = L.SIGMA("grin"); a.position.set(-1.2, 0, 0); a.rotation.y = 0.3; L.scene.add(a);
      return (t) => { const w = a.userData.arms[1]; w.rotation.x = 0; w.rotation.z = 2.3 + Math.sin(t * 8) * 0.3; L.cam.position.set(-0.8, 1.35, 3.0); L.cam.lookAt(-1.2, 1.15, 0); L.cam.fov = 42; }; },
    rule1: (L) => { const B = L.bathroom(); B.open(1); const a = L.SIGMA("worry"); a.rotation.y = Math.PI; L.scene.add(a); const sn = L.snake();
      return (t) => { a.position.set(0, 0, 1.5 + eo(lin(t, 0.3, 2.6)) * 1.2); L.walkPose(a, t * 3, 0.35); sn.userData.pose(coil(1, t)); sn.userData.anim(t); L.cam.position.set(0.25, 1.35, -0.7); L.cam.lookAt(0, 1.2, 2.5); L.cam.fov = 48; }; },
    rule2: (L) => { const B = L.bathroom(); B.open(0); const a = L.SIGMA("normal"); a.position.set(0.3, 0, 2.0); a.rotation.y = -0.2; L.scene.add(a); const towel = L.bx(0.9, 0.06, 0.16, L.M("#F2F2F0"), 0, 0.03, 1.42);
      return (t) => { const k = eo(lin(t, 1.4, 2.2)); towel.position.x = -1.0 + k * 1.0; towel.visible = t > 1.3; L.cam.position.set(-0.1, 1.35, 4.6); L.cam.lookAt(0.05, 0.9, 1.3); L.cam.fov = 50; }; },
    rule3: (L) => { L.soiDay(); const a = L.SIGMA("normal"); a.position.set(-1.2, 0, 0); a.rotation.y = 0.3; L.scene.add(a); L.phoneIn(a);
      return (t) => { L.cam.position.set(-0.9, 1.4, 2.6); L.cam.lookAt(-1.2, 1.25, 0); L.cam.fov = 40; }; },
    end: (L) => { const B = L.bathroom(); B.open(1); const a = L.SIGMA("grin"); a.position.set(-0.28, 0, 2.3); a.rotation.y = 0.2; L.scene.add(a); const sn = L.snake();
      return (t) => { sn.userData.pose(coil(1, t)); sn.userData.anim(t); L.cam.position.set(0.05, 1.4, 4.5); L.cam.lookAt(0.05, 1.0, 0.5); L.cam.fov = 50; }; },
  },
  fx: [
    { type: "flash", t: 1.9, d: 0.1 }, { type: "shake", t: 2.2, a: 18 }, { type: "bubble", t: 2.3, end: 3.1, text: "ฟ่อออ!", x: 700, y: 520, tx: 620, ty: 760, size: 60 },
    { type: "shake", t: 3.12, a: 14 },
    { type: "name", t: P(2).s + 0.1, end: sc(3), name: "บักซิกม่าบอย", status: "สายเอาตัวรอด · สอนรอดทุกสถานการณ์", y: 1150 },
    rule(1, "ตั้งสติ ถอยออกช้าๆ", P(3).s + 0.2), rule(2, "ปิดประตู อุดช่องใต้ประตู", P(4).s + 0.2), rule(3, "โทร 199 ให้เจ้าหน้าที่จับ", P(5).s + 0.2),
    { type: "wcard", t: P(5).s + 1.5, end: sc(6), tag: "สายด่วน · CALL", big: "199", icon: "📞", col: "#2E8C86", x: 560, y: 1080, w: 420, rot: 3 },
    { type: "choice", t: P(6).s + 0.9, items: ["🐍 จับเอง", "📞 โทร 199"], y: 230, xs: [130, 560] },
    { type: "black", t: DUR - 0.25, d: 1 },
  ],
  cues: [[0.25, "creak", 0.4], [1.9, "whoosh", 0.6], [2.2, "thud", 0.6], [sc(2), "whoosh", 0.4], [P(3).s + 0.2, "pop", 0.5], [sc(4), "whoosh", 0.4], [P(4).s + 1.4, "step", 0.4], [P(5).s + 0.2, "pop", 0.5], [P(5).s + 1.5, "click", 0.5], [sc(6), "whoosh", 0.4], [P(6).s + 0.9, "pop", 0.5], [P(6).s + 1.2, "pop", 0.5]],
};
