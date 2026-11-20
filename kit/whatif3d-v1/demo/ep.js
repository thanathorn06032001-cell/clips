// TEST: ถ้าวันหนึ่ง แมวทั้งซอยพูดได้ (3D what-if)
const TL = await (await fetch("timeline.json?v=" + Date.now())).json();
const P = (n) => ({ s: TL.phrases[n - 1].start, e: TL.phrases[n - 1].end }), sc = (n) => P(n).s - 0.1, DUR = TL.duration;
const lin = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a))), back = (x) => (x >= 1 ? 1 : 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2));
const CATS = ["orange", "black", "white", "calico", "grey"];
// cuts: [name, global start]; each shot runs until the next cut
export const cuts = [["soi_wide", 0], ["shock", 2.3], ["bed", sc(2)], ["wake", P(2).s + 2.3], ["catclose", sc(3)], ["phone", sc(4)], ["sofa", sc(5)], ["end", sc(6)], ["_end", DUR]];
export default {
  shots: {
    soi_wide: (L) => { L.soiDay(); const cs = CATS.map((col, i) => { const c = L.cat3d({ col, mood: i % 2 ? "angry" : "talk", s: 1.25 }); c.position.set(-4.6, 0.98, -2.6 + i * 0.8); c.rotation.y = Math.PI / 2; L.scene.add(c); return c; });
      return (t) => { cs.forEach((c, i) => { const k = back(lin(t, 0.3 + i * 0.2, 0.55 + i * 0.2)); c.scale.setScalar(1.25 * Math.max(0.001, k)); c.userData.anim(t, i % 2 === 0); }); L.cam.position.set(-1.2, 1.3, -0.9 + t * 0.05); L.cam.lookAt(-4.6, 1.15, -0.95); L.cam.fov = 52; }; },
    shock: (L) => { L.soiDay(); const a = L.LEAD("shock"); a.position.set(-2.4, 0, -1); a.rotation.y = 0.5; L.scene.add(a);
      return (t) => { a.userData.arms.forEach((A, i) => { A.rotation.z = (i ? -1 : 1) * 0.35; A.rotation.x = -2.85; }); L.cam.position.set(-1.6, 1.5, 0.95 - t * 0.1); L.cam.lookAt(-2.4, 1.42, -1); L.cam.fov = 40; }; },
    bed: (L) => { L.roomDay(); const a = L.LEAD("closed"); a.position.x = -1.2; L.lie(a, 0.72, -0.25); L.scene.add(a); L.bx(1.45, 0.16, 1.1, L.M("#F2A7B5"), -1.2, 0.72, -0.35, null, 0.08);
      const c = L.cat3d({ col: "orange", mood: "smug", s: 1.2 }); c.rotation.y = Math.PI; L.scene.add(c); const t0 = P(2).s + 1.0 - sc(2);
      return (t) => { const k = lin(t, t0, t0 + 0.45); c.position.set(-1.25, 0.82 + (1 - k) * 1.6 + Math.sin(k * Math.PI) * 0.3, -0.55); c.userData.anim(t); L.cam.position.set(-0.6, 2.4, 0.6); L.cam.lookAt(-1.2, 0.7, -0.9); L.cam.fov = 56; }; },
    wake: (L) => { L.roomDay(); const a = L.LEAD("shock"); L.sit(a); a.position.set(-0.55, 0, -0.5); a.rotation.y = Math.PI / 2 - 0.3; L.scene.add(a); const c = L.cat3d({ col: "orange", mood: "angry", s: 1.25 }); c.position.set(-1.2, 0.54, -0.9); c.rotation.y = 1.2; L.scene.add(c);
      return (t) => { c.userData.anim(t, true); L.cam.position.set(1.7, 1.25, 2.3); L.cam.lookAt(-0.8, 0.8, -0.7); L.cam.fov = 46; }; },
    catclose: (L) => { L.roomDay(); const c = L.cat3d({ col: "orange", mood: "angry", s: 1.3 }); c.position.set(-1.2, 0.54, -0.9); c.rotation.y = 0.2; L.scene.add(c);
      return (t) => { c.userData.anim(t, t < P(3).e - sc(3)); L.cam.position.set(-1.05, 0.95, 0.15 - t * 0.04); L.cam.lookAt(-1.2, 0.95, -0.9); L.cam.fov = 40; }; },
    phone: (L) => { L.roomDay(); const a = L.LEAD("worry"); L.sit(a); a.position.set(-0.55, 0, -0.5); a.rotation.y = Math.PI / 2 - 0.3; L.scene.add(a); L.phoneIn(a);
      return (t) => { L.cam.position.set(1.0, 1.3, 1.4); L.cam.lookAt(-0.6, 0.9, -0.6); L.cam.fov = 50; }; },
    sofa: (L) => { L.livingDay(); const cs = ["grey", "orange", "black", "calico"].map((col, i) => { const c = L.cat3d({ col, mood: ["smug", "talk", "angry", "sleepy"][i], s: 1.15 }); c.position.set(-1.05 + i * 0.7, 0.47, -1.35); L.scene.add(c); return c; });
      const a = L.LEAD("worry"); a.position.set(1.15, 0, 0.1); a.rotation.y = -0.45; L.scene.add(a);
      return (t) => { cs.forEach((c, i) => c.userData.anim(t, i === 1)); L.cam.position.set(0.25, 1.4, 3.2); L.cam.lookAt(0.45, 0.9, -0.8); L.cam.fov = 54; }; },
    end: (L) => { L.livingDay(true); const a = L.LEAD("happy"); L.sit(a); a.position.set(0, 0, -1.25); L.scene.add(a);
      const lap = L.cat3d({ col: "orange", mood: "sleepy", s: 0.75 }); lap.position.set(0, 0.6, -0.8); L.scene.add(lap); const side = ["black", "calico"].map((col, i) => { const c = L.cat3d({ col, mood: "smug", s: 1.1 }); c.position.set(i ? 0.95 : -0.95, 0.47, -1.35); L.scene.add(c); return c; });
      return (t) => { [lap, ...side].forEach((c) => c.userData.anim(t)); L.cam.position.set(0.1, 1.3, 2.4 - t * 0.08); L.cam.lookAt(0, 0.9, -1.2); L.cam.fov = 48; }; },
  },
  fx: [
    { type: "bubble", t: 1.2, end: 2.3, text: "หิวแล้วนะ!", x: 330, y: 560, tx: 300, ty: 760 }, { type: "bubble", t: 1.6, end: 2.3, text: "ใครเหยียบหางกู!", x: 700, y: 420, tx: 640, ty: 640 },
    { type: "shake", t: 2.32, a: 18 }, { type: "flash", t: 2.3, d: 0.1 },
    { type: "name", t: P(2).s + 0.1, end: P(2).s + 2.3, name: "ต้น", status: "ปี 2 · ทาสแมว 3 ตัว", y: 1150 },
    { type: "wcard", t: P(2).s + 2.4, end: sc(3), tag: "ตื่นนอน · WAKE UP", big: "07:00", icon: "⏰", x: 60, y: 170, w: 420 }, { type: "shake", t: P(2).s + 2.35, a: 12 },
    { type: "bubble", t: P(3).s, end: sc(4), text: "ข้าวเช้าอยู่ไส ทาส!", x: 540, y: 330, tx: 520, ty: 560, size: 54 }, { type: "shake", t: P(3).s + 0.05, a: 14 },
    { type: "phone", t: sc(4), end: sc(5), time: "07:05", date: "วันเสาร์ 21 พฤศจิกายน", step: 0.4, x: 250, y: 110, notes: [["🐱", "#EFA555", "ส้มจี๊ด (บ้านกู)", "ทรายสกปรก เปลี่ยนด่วน"], ["🐈", "#36313A", "ดำ (บ้านป้า)", "ขนมหมดแล้วบ่?"], ["🐾", "#6FB7AE", "กลุ่มแมวทั้งซอย", "ประชุม 9 โมง หน้าร้านชำ"], ["🏠", "#E0567A", "ป้าข้างบ้าน", "แมวมึงด่าแมวป้าอีกแล้ว"]] },
    { type: "wcard", t: P(4).s + 1.4, end: sc(5), tag: "ข้อความ · MESSAGES", roll: { n: 4812, d: 1.0 }, icon: "💬", col: "#E2553B", x: 520, y: 1200, w: 480, rot: 3 },
    { type: "wcard", t: P(5).s + 1.2, end: sc(6), tag: "ตารางงานทาส · SCHEDULE", lines: ["06:00 · เติมข้าว", "06:05 · ลูบหัว 300 ครั้ง", "07:00 · ห้ามขยับ (แมวนอนตัก)"], icon: "📋", x: 50, y: 150, w: 640 },
    { type: "choice", t: P(6).s + 1.0, items: ["👑 อยากให้เป็นจริง", "❌ บ่เอาแล้ว"], y: 230, xs: [90, 590] },
    { type: "black", t: DUR - 0.25, d: 1 },
  ],
  cues: [[0.5, "pop", 0.5], [0.9, "pop", 0.4], [1.3, "pop", 0.4], [2.3, "whoosh", 0.6], [sc(2), "whoosh", 0.4], [P(2).s + 1.4, "thud", 0.6], [P(2).s + 2.4, "pop", 0.5], [sc(3), "whoosh", 0.4], [sc(4), "click", 0.6], [sc(4) + 0.4, "click", 0.5], [sc(4) + 0.8, "click", 0.5], [sc(4) + 1.2, "click", 0.5], [sc(5), "whoosh", 0.4], [P(5).s + 1.2, "pop", 0.5], [sc(6), "whoosh", 0.4], [P(6).s + 1.0, "pop", 0.5], [P(6).s + 1.3, "pop", 0.5]],
};
