// บักซิกม่าบอย: ถ้ามึงโดนหมา 5 โตไล่ มึงสิรอดบ่?
const TL = await (await fetch("timeline.json?v=" + Date.now())).json();
const P = (n) => ({ s: TL.phrases[n - 1].start, e: TL.phrases[n - 1].end }), sc = (n) => P(n).s - 0.1, DUR = TL.duration;
const lin = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a))), eo = (x) => 1 - Math.pow(1 - x, 3);

// ---------- Thai soi dog (~0.75 m tall at the head, s=1). mode: lie / sit / stand / run / walk; bark 0..1; wag speed ----------
const DOGC = { tan: ["#C99A5E", "#E9CFA6"], black: ["#34302E", "#5A524C"], white: ["#EDE6DA", "#FFFFFF"], brown: ["#8A5A3A", "#C49A74"], spot: ["#EDE6DA", "#3A3230"] };
function dog(L, o = {}) {
  o = { col: "tan", s: 1, ...o }; const [c, l] = DOGC[o.col]; const { bx, M } = L; const G = new L.THREE.Group(); L.scene.add(G); const R = new L.THREE.Group(); G.add(R);
  const cm = M(c, { roughness: 0.9 }), lm = M(l, { roughness: 0.9 }), dk = M("#1A1614");
  bx(0.34, 0.3, 0.74, cm, 0, 0.52, 0, R, 0.1); bx(0.26, 0.12, 0.5, lm, 0, 0.4, 0.04, R, 0.05);
  if (o.col === "spot") { bx(0.36, 0.2, 0.22, dk, 0, 0.58, -0.12, R, 0.06); }
  const legs = []; for (const [x, z] of [[-0.11, 0.26], [0.11, 0.26], [-0.11, -0.26], [0.11, -0.26]]) { const g = new L.THREE.Group(); g.position.set(x, 0.44, z); R.add(g); bx(0.1, 0.44, 0.11, cm, 0, -0.22, 0, g, 0.04); bx(0.11, 0.06, 0.14, lm, 0, -0.42, 0.02, g, 0.02); legs.push(g); }
  const head = new L.THREE.Group(); head.position.set(0, 0.74, 0.4); R.add(head);
  bx(0.32, 0.28, 0.3, cm, 0, 0, 0, head, 0.09); bx(0.18, 0.13, 0.2, lm, 0, -0.06, 0.2, head, 0.05); bx(0.08, 0.06, 0.05, dk, 0, -0.01, 0.31, head, 0.02);
  for (const s of [-1, 1]) { bx(0.06, 0.07, 0.02, dk, s * 0.085, 0.05, 0.155, head, 0.015); bx(0.022, 0.022, 0.01, M("#FFFFFF"), s * 0.085 + 0.012, 0.07, 0.166, head);
    const e = new L.THREE.Mesh(new L.THREE.ConeGeometry(0.065, 0.17, 4), cm); e.position.set(s * 0.1, 0.2, -0.04); e.rotation.y = Math.PI / 4; e.rotation.z = -s * 0.18; e.castShadow = true; head.add(e); }
  const jaw = new L.THREE.Group(); jaw.position.set(0, -0.11, 0.12); head.add(jaw); bx(0.16, 0.05, 0.19, lm, 0, -0.02, 0.09, jaw, 0.02); const tg = bx(0.08, 0.02, 0.12, M("#E8707A"), 0, 0.01, 0.1, jaw); bx(0.15, 0.03, 0.17, M("#6A2018"), 0, 0.015, 0.09, jaw);
  const tail = new L.THREE.Group(); tail.position.set(0, 0.62, -0.36); R.add(tail); bx(0.07, 0.07, 0.3, cm, 0, 0.1, -0.12, tail, 0.03); tail.rotation.x = -0.9;
  G.scale.setScalar(o.s);
  G.userData = { head, legs, tail, jaw, tongue: tg,
    pose: (t, mode = "stand", bark = 0, wag = 6, look = 0) => {
      legs.forEach((g) => (g.rotation.x = 0)); R.position.y = 0; R.rotation.x = 0; head.rotation.set(0, 0, 0); head.position.set(0, 0.74, 0.4);
      if (mode === "lie") { R.position.y = -0.36; legs[0].rotation.x = legs[1].rotation.x = -1.45; legs[2].rotation.x = legs[3].rotation.x = 1.45; head.position.set(0, 0.6, 0.42); }
      if (mode === "sit") { R.rotation.x = -0.5; R.position.y = -0.12; legs[0].rotation.x = legs[1].rotation.x = 0.5; legs[2].rotation.x = legs[3].rotation.x = -1.1; head.rotation.x = 0.45; }
      if (mode === "run") { const p = t * 14; legs[0].rotation.x = Math.sin(p) * 0.9; legs[1].rotation.x = Math.sin(p + 0.4) * 0.9; legs[2].rotation.x = Math.sin(p + Math.PI) * 0.9; legs[3].rotation.x = Math.sin(p + Math.PI + 0.4) * 0.9; R.position.y = Math.abs(Math.sin(p)) * 0.06; R.rotation.x = Math.sin(p) * 0.06; }
      if (mode === "walk") { const p = t * 8; legs[0].rotation.x = legs[3].rotation.x = Math.sin(p) * 0.45; legs[1].rotation.x = legs[2].rotation.x = -Math.sin(p) * 0.45; }
      head.rotation.x += -look; tail.rotation.y = Math.sin(t * wag) * 0.5;
      jaw.rotation.x = bark > 0 ? Math.max(0, Math.sin(t * 16)) * 0.55 * bark : 0.12; tg.visible = bark === 0; } };
  return G;
}
// pork-skewer bag (ถุงหมูปิ้ง) hanging from / held in the right hand (arm space)
function porkBag(L, a, held) { const A = a.userData.arms[1]; const g = new L.THREE.Group(); A.add(g); g.position.set(0, held ? -1.15 : -1.3, held ? 0.15 : 0.05);
  L.bx(0.55, 0.6, 0.32, L.M("#F4F2EA", { roughness: 0.3, transparent: true, opacity: 0.85 }), 0, -0.25, 0, g, 0.08);
  for (const x of [-0.12, 0, 0.12]) { L.bx(0.04, 0.6, 0.04, L.M("#D8B07A"), x, 0.1, 0.02, g); L.bx(0.13, 0.32, 0.1, L.M("#8A3E22", { roughness: 0.6 }), x, -0.12, 0.02, g, 0.03); }
  L.bx(0.4, 0.2, 0.22, L.M("#F7EED8"), 0, -0.42, -0.05, g, 0.06); return g; }
// temple wall + gate at the end of the soi (ซอยหลังวัด)
function temple(L, z = -26) { const { bx, M } = L; bx(10, 2.2, 0.4, M("#F4F0E6"), 0, 1.1, z); bx(10.2, 0.25, 0.6, M("#C9A24A"), 0, 2.3, z);
  for (const s of [-1, 1]) bx(0.7, 3.6, 0.7, M("#F4F0E6"), s * 1.8, 1.8, z + 0.3, null, 0.05);
  for (let k = 0; k < 3; k++) { const r = bx(4.6 - k * 1.1, 0.5, 1.2, M(k % 2 ? "#2E7A4A" : "#D8562E"), 0, 3.8 + k * 0.55, z + 0.3, null, 0.05); }
  bx(0.3, 1.0, 0.3, M("#E0B040"), 0, 5.6, z + 0.3); }
const soi = (L) => { L.soiDay(); temple(L); };
const pack5 = (L, cols = ["tan", "black", "white", "brown", "spot"]) => cols.map((c) => dog(L, { col: c }));
const ARMDOWN = (a) => a.userData.arms.forEach((A, i) => { A.rotation.x = 0; A.rotation.z = (i ? -1 : 1) * 0.06; });

export const cuts = [["hook", 0], ["hookdogs", 1.9], ["walk", sc(2)], ["walk2", 5.8], ["dog1", sc(3)], ["dog2", 8.8], ["dog3", 9.95], ["panic", sc(4)], ["run", 12.7],
  ["chase", sc(5)], ["intro", sc(6)], ["pant", 20.4], ["dont", sc(7)], ["dont2", 25.4], ["more", sc(8)], ["r1", sc(9)], ["r1b", 31.4], ["r2", sc(10)], ["r2b", 35.7],
  ["r3", sc(11)], ["r3b", 40.6], ["r4", sc(12)], ["r4b", 45.6], ["r5", sc(13)], ["r5b", 52.2], ["nowait", sc(14)], ["back", sc(15)], ["tw1", sc(16)], ["tw2", 62.7],
  ["look", sc(17)], ["eat", sc(18)], ["toll", sc(19)], ["toll2", 73.3], ["end", sc(20)], ["_end", DUR]];
const rule = (n, txt, t, end, y = 170) => ({ type: "wcard", t, end, tag: `ข้อ ${n} · RULE ${n}`, lines: [txt], icon: "✅", col: "#D9443C", x: 60, y, w: 640 });
// dogs in a loose arc facing +z toward a person at z0
const arc = (D, z0, r = 1.6, x0 = 0) => D.forEach((d, i) => { const a = (i - 2) * 0.42; d.position.set(x0 + Math.sin(a) * r, 0, z0 - Math.cos(a) * r); d.rotation.y = -a; });

export default {
  channel: "บักซิกม่าบอย",
  shots: {
    cover: (L) => { soi(L); const a = L.SIGMA("shock"); a.position.set(0, 0, -2.2); a.rotation.y = 0.15; L.scene.add(a); porkBag(L, a, true); const D = pack5(L); D.forEach((d, i) => { d.position.set(-1.5 + i * 0.75, 0, -4.4 - Math.abs(i - 2) * 0.3); d.rotation.y = (2 - i) * 0.15; });
      return (t) => { a.userData.arms.forEach((A, i) => { A.rotation.x = -2.85; A.rotation.z = (i ? -1 : 1) * 0.5; }); D.forEach((d, i) => d.userData.pose(0.03 + i * 0.05, "stand", i % 2 ? 1 : 0, 3, 0.1)); L.cam.position.set(0.2, 1.2, 1.6); L.cam.lookAt(0, 0.75, -3); L.cam.fov = 52; }; },
    hook: (L) => { soi(L); const D = pack5(L); D.forEach((d, i) => { d.position.set(-2.6 + i * 1.25, 0, -6 - (i % 2) * 0.8); d.rotation.y = 0.2 - i * 0.1; }); const a = L.SIGMA("normal"); a.position.set(0.3, 0, -1); a.rotation.y = Math.PI; L.scene.add(a); porkBag(L, a);
      return (t) => { D.forEach((d, i) => { const up = lin(t, 0.4 + i * 0.22, 0.8 + i * 0.22); d.userData.pose(t, up > 0.5 ? "stand" : "lie", 0, 4, 0); }); L.cam.position.set(1.7, 1.5, 3.4 - t * 0.2); L.cam.lookAt(-0.3, 0.7, -6); L.cam.fov = 46; }; },
    hookdogs: (L) => { soi(L); const D = pack5(L); D.forEach((d, i) => { d.position.set(-1.6 + i * 0.8, 0, -1.8 + Math.abs(i - 2) * -0.4); d.rotation.y = (2 - i) * 0.12; });
      return (t) => { D.forEach((d, i) => d.userData.pose(t + i, "stand", i === 2 ? 1 : 0, 3, 0.15)); L.cam.position.set(0, 0.45, 1.4 - t * 0.3); L.cam.lookAt(0, 0.75, -2.2); L.cam.fov = 52; }; },
    walk: (L) => { soi(L); const a = L.SIGMA("grin"); a.rotation.y = 0; L.scene.add(a); porkBag(L, a);
      return (t) => { a.position.set(0.4, 0, -14 + t * 1.1); L.walkPose(a, t * 6, 0.5); a.userData.arms[1].rotation.x = 0.05; L.cam.position.set(0.5, 1.5, a.position.z + 3.0); L.cam.lookAt(0.4, 1.15, a.position.z); L.cam.fov = 42; }; },
    walk2: (L) => { soi(L); const a = L.SIGMA("grin"); a.rotation.y = Math.PI; L.scene.add(a); porkBag(L, a);
      return (t) => { a.position.set(-1.2, 0, -12 - t * 1.1); L.walkPose(a, t * 6, 0.5); a.userData.arms[1].rotation.x = 0.05; L.cam.position.set(1.6, 1.4, a.position.z + 3.2); L.cam.lookAt(-1.0, 1.4, a.position.z - 6); L.cam.fov = 48; }; },
    dog1: (L) => { soi(L); const d = dog(L, { col: "tan" }); d.position.set(0, 0, -20);
      return (t) => { const k = eo(lin(t, 0.2, 0.7)); d.userData.pose(t, "lie", 0, 2, -0.6 * k + 0.25); L.cam.position.set(0.9, 0.75, -17.3); L.cam.lookAt(0, 0.45, -20); L.cam.fov = 44; }; },
    dog2: (L) => { soi(L); const d = dog(L, { col: "black" }); d.position.set(0, 0, -20); const b = dog(L, { col: "tan" }); b.position.set(-1, 0, -20.6);
      return (t) => { d.userData.pose(t, t > 0.35 ? "stand" : "lie", 0, 5, 0.1); b.userData.pose(t, "lie", 0, 2, -0.3); L.cam.position.set(-1.0, 0.85, -17.3); L.cam.lookAt(-0.3, 0.6, -20.2); L.cam.fov = 44; }; },
    dog3: (L) => { soi(L); const d = dog(L, { col: "white" }); d.position.set(0, 0, -20);
      return (t) => { d.userData.pose(t, "stand", t > 0.2 ? 1 : 0, 3, 0.25); L.cam.position.set(0.5, 0.95, -18.1 + t * 0.15); L.cam.lookAt(0, 0.78, -20); L.cam.fov = 40; }; },
    panic: (L) => { soi(L); const a = L.SIGMA("shock"); a.position.set(0, 0, -17); a.rotation.y = Math.PI * 0.9; L.scene.add(a); porkBag(L, a);
      return (t) => { L.cam.position.set(0.15, 1.5, -18.4 + t * 0.12); L.cam.lookAt(0, 1.5, -17); L.cam.fov = 38; }; },
    run: (L) => { soi(L); const a = L.SIGMA("shock"); L.scene.add(a); porkBag(L, a); const D = pack5(L);
      return (t) => { a.position.set(0, 0, -14 + t * 4.2); L.walkPose(a, t * 14, 1.1); D.forEach((d, i) => { d.position.set(-1.6 + i * 0.8, 0, a.position.z - 3.2 - (i % 2) * 0.9 + t * 0.4); d.userData.pose(t + i * 0.3, "run", i % 2, 10, -0.1); });
        L.cam.position.set(0.4, 1.3, a.position.z + 4.2); L.cam.lookAt(0, 1.0, a.position.z - 1.5); L.cam.fov = 50; }; },
    chase: (L) => { soi(L); const a = L.SIGMA("shock"); a.rotation.y = Math.PI / 2; L.scene.add(a); porkBag(L, a); const D = pack5(L);
      return (t) => { a.position.set(-4 + t * 4.0 + 1.6, 0, -6); L.walkPose(a, t * 14, 1.1); D.forEach((d, i) => { d.rotation.y = Math.PI / 2; d.position.set(-4 + t * 4.0 - 0.9 - i * 0.55, 0, -6.6 + (i % 3) * 0.55); d.userData.pose(t + i * 0.2, "run", 0, 14, 0); });
        L.cam.position.set(-4 + t * 4.0 + 0.5, 1.1, -0.6); L.cam.lookAt(-4 + t * 4.0 + 0.5, 0.85, -6.3); L.cam.fov = 52; }; },
    intro: (L) => { soi(L); const a = L.SIGMA("grin"); a.position.set(0, 0, -3); a.rotation.y = 0.15; L.scene.add(a);
      return (t) => { const w = a.userData.arms[1]; w.rotation.x = 0; w.rotation.z = 2.3 + Math.sin(t * 8) * 0.3; L.cam.position.set(0.25, 1.35, -0.2); L.cam.lookAt(0, 1.2, -3); L.cam.fov = 42; }; },
    pant: (L) => { soi(L); const a = L.SIGMA("worry"); a.position.set(0, 0, -3); a.rotation.y = -0.1; L.scene.add(a);
      return (t) => { a.rotation.x = 0.35; a.position.y = -0.08; a.userData.arms.forEach((A, i) => { A.rotation.x = -0.9; A.rotation.z = (i ? -1 : 1) * 0.15; }); a.userData.head.rotation.x = -0.3 + Math.sin(t * 9) * 0.06; L.cam.position.set(0.0, 1.15, -0.8); L.cam.lookAt(0, 1.0, -3); L.cam.fov = 42; }; },
    dont: (L) => { soi(L); const a = L.SIGMA("shock"); a.rotation.y = Math.PI / 2; L.scene.add(a); const d = dog(L, { col: "brown", s: 1.1 }); d.rotation.y = Math.PI / 2;
      return (t) => { L.walkPose(a, t * 14, 1.1); d.userData.pose(t, "run", 0, 12, 0); a.position.set(t * 3, 0, -6); d.position.set(t * 3 - 1.6 + t * 0.35, 0, -6.4); L.cam.position.set(t * 3 + 0.0, 0.7, -1.6); L.cam.lookAt(t * 3 - 0.3, 0.55, -6.2); L.cam.fov = 48; }; },
    dont2: (L) => { soi(L); const a = L.SIGMA("shock"); a.rotation.y = Math.PI / 2; L.scene.add(a); const D = pack5(L).slice(0, 3); D.forEach((d) => (d.rotation.y = Math.PI / 2));
      return (t) => { L.walkPose(a, t * 12, 1.1); a.position.set(t * 2.6, 0, -6); D.forEach((d, i) => { d.userData.pose(t + i, "run", i === 1 ? 1 : 0, 12, 0); d.position.set(t * 2.6 - 1.4 + t * 0.4 - i * 0.6, 0, -6.4 - i * 0.4); });
        L.cam.position.set(t * 2.6 - 0.5, 1.3, -2.2); L.cam.lookAt(t * 2.6 - 0.6, 0.8, -6.2); L.cam.fov = 52; }; },
    more: (L) => { soi(L); const D = pack5(L);
      return (t) => { D.forEach((d, i) => { d.position.set(-1.4 + i * 0.7, 0, -6 + t * 3.5 - (i % 2) * 0.8); d.userData.pose(t + i * 0.25, "run", i % 2, 16, 0.1); }); L.cam.position.set(0, 0.5, -1 + t * 3.5); L.cam.lookAt(0, 0.6, -6 + t * 3.5); L.cam.fov = 54; }; },
    r1: (L) => { soi(L); const a = L.SIGMA("normal"); a.position.set(0, 0, -3); L.scene.add(a); const D = pack5(L).slice(0, 3); arc(D, -3, 1.5);
      return (t) => { ARMDOWN(a); D.forEach((d, i) => d.userData.pose(t + i, "stand", 0, 2, 0.1)); L.cam.position.set(0.3, 1.6, 0.4); L.cam.lookAt(0, 1.0, -3.4); L.cam.fov = 46; }; },
    r1b: (L) => { soi(L); const a = L.SIGMA("normal"); a.position.set(0, 0, -3); L.scene.add(a); const D = pack5(L);
      return (t) => { ARMDOWN(a); D.forEach((d, i) => { const ang = i * 1.25 + t * 0.5; d.position.set(Math.sin(ang) * 1.3, 0, -3 + Math.cos(ang) * 1.3); d.rotation.y = ang + Math.PI / 2; d.userData.pose(t + i, "walk", 0, 3, 0.2); });
        L.cam.position.set(0, 4.6, -0.1); L.cam.lookAt(0, 0.4, -3); L.cam.fov = 48; }; },
    r2: (L) => { soi(L); const a = L.SIGMA("normal"); a.position.set(0, 0, -3); L.scene.add(a); const d = dog(L, { col: "black" }); d.position.set(0.1, 0, -1.6); d.rotation.y = Math.PI;
      return (t) => { ARMDOWN(a); a.userData.head.rotation.y = -0.7 * eo(lin(t, 0.3, 0.9)); d.userData.pose(t, "stand", 0, 2, 0.35); L.cam.position.set(1.3, 1.25, -0.4); L.cam.lookAt(0, 1.0, -2.5); L.cam.fov = 44; }; },
    r2b: (L) => { soi(L); const a = L.SIGMA("normal", { pack: false }); a.position.set(0, 0, -3); a.rotation.y = 0.1; L.scene.add(a);
      return (t) => { ARMDOWN(a); a.userData.head.rotation.x = Math.sin(t * 5) * 0.02; L.cam.position.set(0.05, 1.55, -1.5 + t * 0.06); L.cam.lookAt(0, 1.42, -3); L.cam.fov = 40; }; },
    r3: (L) => { soi(L); const a = L.SIGMA("normal"); a.rotation.y = Math.PI; L.scene.add(a); const D = pack5(L).slice(0, 3); D.forEach((d, i) => { d.position.set(-0.8 + i * 0.8, 0, -5.7 + Math.abs(i - 1) * 0.2); });
      return (t) => { a.position.set(0, 0, -4.6 + t * 0.35); L.walkPose(a, t * 3, 0.25); D.forEach((d, i) => d.userData.pose(t + i, t > 0.8 + i * 0.4 ? "sit" : "stand", 0, 2, 0)); L.cam.position.set(-4.3, 1.6, -4.8); L.cam.lookAt(0, 0.8, -4.8); L.cam.fov = 50; L.cam.fov = 48; }; },
    r3b: (L) => { soi(L); const a = L.SIGMA("normal"); a.rotation.y = Math.PI; L.scene.add(a); const D = pack5(L); D.forEach((d, i) => d.position.set(-1.6 + i * 0.8, 0, -8 + (i % 2) * 0.4));
      return (t) => { a.position.set(0, 0, -5 + t * 0.35); L.walkPose(a, t * 3, 0.25); D.forEach((d, i) => d.userData.pose(t + i, i % 2 ? "lie" : "sit", 0, 1, 0)); L.cam.position.set(2.0, 1.4, -4.4 + t * 0.35); L.cam.lookAt(0, 0.7, -7.2); L.cam.fov = 46; }; },
    r4: (L) => { soi(L); const a = L.SIGMA("worry", { pack: false }); a.position.set(0, 0, -3); L.scene.add(a); const pk = L.bx(1.0, 1.2, 0.5, L.M("#4A5A3A"), 0, 1.55, 0.75, a, 0.12); const d = dog(L, { col: "brown" }); d.rotation.y = Math.PI;
      return (t) => { a.userData.arms.forEach((A, i) => { A.rotation.x = -1.35; A.rotation.z = (i ? -1 : 1) * 0.25; }); const k = eo(lin(t, 0.2, 0.8)); d.position.set(0.05, 0, -1.2 - k * 0.9); d.userData.pose(t, k < 1 ? "run" : "stand", 1, 6, 0); L.cam.position.set(1.9, 1.1, -1.0); L.cam.lookAt(0, 0.9, -2.6); L.cam.fov = 46; }; },
    r4b: (L) => { soi(L); const a = L.SIGMA("closed"); a.position.set(0, 0, -3); a.rotation.y = 0.2; L.scene.add(a);
      return (t) => { const k = eo(lin(t, 0.1, 0.5)); a.position.y = -0.25 * k; a.rotation.x = 0.35 * k; a.userData.arms.forEach((A, i) => { A.rotation.x = -2.7 * k; A.rotation.z = (i ? 1 : -1) * 0.55 * k; }); L.cam.position.set(0.3, 1.3, 0.4); L.cam.lookAt(0, 0.95, -3); L.cam.fov = 46; }; },
    r5: (L) => { const B = L.bathroom(); B.open(1); const a = L.SIGMA("worry", { pack: false }); a.position.set(-0.75, 0, -0.45); a.rotation.y = Math.PI; L.scene.add(a); L.bx(0.06, 0.06, 0.2, L.M("#C8CCD0", { metalness: 0.6, roughness: 0.2 }), -0.8, 1.05, -1.12);
      const w = new L.THREE.Mesh(new L.THREE.CylinderGeometry(0.018, 0.022, 0.2, 8), L.M("#BFE6FF", { transparent: true, opacity: 0.75, roughness: 0.05 })); w.position.set(-0.8, 0.95, -1.03); L.scene.add(w);
      const soap = L.bx(0.12, 0.05, 0.08, L.M("#F2A7C0"), -0.6, 0.94, -1.1, null, 0.02);
      return (t) => { a.userData.arms.forEach((A, i) => { A.rotation.x = -1.25 + Math.sin(t * 7 + i * 2) * 0.12; A.rotation.z = (i ? -1 : 1) * 0.35; }); w.scale.y = 1 + Math.sin(t * 30) * 0.05; L.cam.position.set(0.9, 2.3, 1.0); L.cam.lookAt(-0.7, 0.85, -0.8); L.cam.fov = 60; }; },
    r5b: (L) => { L.roomDay(); const a = L.SIGMA("grin", { pack: false }); a.position.set(0, 0, 0); L.scene.add(a); const A = a.userData.arms[0]; L.bx(0.32, 0.12, 0.05, L.M("#F2D6B0"), 0, -0.55, 0.28, A, 0.02);
      return (t) => { A.rotation.x = -0.9; A.rotation.z = 0.9; const w = a.userData.arms[1]; w.rotation.x = -1.2; w.rotation.z = -0.5; L.cam.position.set(0.1, 1.35, 2.6); L.cam.lookAt(0, 1.2, 0); L.cam.fov = 42; }; },
    nowait: (L) => { soi(L); const a = L.SIGMA("talk"); a.position.set(0, 0, -3); a.rotation.y = 0.1; L.scene.add(a);
      return (t) => { const w = a.userData.arms[1]; w.rotation.x = -1.6; w.rotation.z = -0.1 + Math.sin(t * 6) * 0.08; a.userData.setMood && a.userData.setMood(Math.floor(t * 7) % 2 ? "talk" : "normal"); L.cam.position.set(-0.3, 1.4, -0.4); L.cam.lookAt(0, 1.25, -3); L.cam.fov = 40; }; },
    back: (L) => { soi(L); const a = L.SIGMA("normal"); a.position.set(0, 0, -5); a.rotation.y = 0; L.scene.add(a); porkBag(L, a); const D = pack5(L); D.forEach((d, i) => { d.position.set(-1.6 + i * 0.8, 0, -8); d.userData.pose(0, "run", 0, 1, 0); });
      return (t) => { L.cam.position.set(0, 1.2, -1.4 + t * 0.4); L.cam.lookAt(0, 0.9, -6.5); L.cam.fov = 48; }; },
    tw1: (L) => { soi(L); const a = L.SIGMA("worry"); a.position.set(0, 0, -3); a.rotation.y = 0; L.scene.add(a); const bag = porkBag(L, a, true); const D = pack5(L); arc(D, -3, 1.7);
      return (t) => { const k = eo(lin(t, 0.6, 1.4)); const A = a.userData.arms[1]; A.rotation.x = -1.45 * k; A.rotation.z = -0.15; a.userData.arms[0].rotation.x = 0; a.userData.head.rotation.y = -0.5 * eo(lin(t, 1.0, 1.6)); D.forEach((d, i) => d.userData.pose(t + i, "stand", 0, 3, 0.15));
        L.cam.position.set(-2.0, 1.5, -0.2); L.cam.lookAt(0.2, 0.9, -3.8); L.cam.fov = 48; }; },
    tw2: (L) => { soi(L); const a = L.SIGMA("worry"); a.position.set(0, 0, -3); L.scene.add(a); porkBag(L, a, true); const D = pack5(L); arc(D, -3, 1.4);
      return (t) => { const A = a.userData.arms[1]; A.rotation.x = -1.45; A.rotation.z = -0.15; a.userData.head.rotation.y = -0.5; D.forEach((d, i) => d.userData.pose(t + i, "sit", 0, 4, -0.2)); L.cam.position.set(0.0, 2.0, -5.6); L.cam.lookAt(0, 1.0, -3); L.cam.fov = 50; }; },
    look: (L) => { soi(L); const a = L.SIGMA("worry"); a.position.set(0, 0, -3); L.scene.add(a); porkBag(L, a, true); const D = pack5(L); arc(D, -3, 1.3);
      return (t) => { const A = a.userData.arms[1]; A.rotation.x = -1.45; A.rotation.z = -0.15; const k = eo(lin(t, 1.2, 1.7)); D.forEach((d, i) => { d.userData.pose(t + i, "sit", 0, 4 + k * 10, -0.25 + k * 0.05); d.userData.head.rotation.y = k * 0.35 * (i < 2 ? -1 : i > 2 ? 1 : 0); d.userData.head.rotation.z = Math.sin(t * 2 + i) * 0.15 * k; });
        L.cam.position.set(2.7, 1.4, -2.0); L.cam.lookAt(0, 0.9, -3.5); L.cam.fov = 52; }; },
    eat: (L) => { soi(L); const a = L.SIGMA("smile"); a.position.set(0, 0, -2.6); L.scene.add(a); const D = pack5(L); D.forEach((d, i) => { const ang = i * 1.25; d.position.set(Math.sin(ang) * 0.6 + 1.0, 0, -4.4 + Math.cos(ang) * 0.6); d.rotation.y = ang + Math.PI; });
      const bag = L.bx(0.3, 0.06, 0.25, L.M("#F4F2EA"), 1.0, 0.04, -4.4, null, 0.03); for (const x of [-0.06, 0.06]) L.bx(0.03, 0.02, 0.3, L.M("#D8B07A"), 1.0 + x, 0.09, -4.4);
      return (t) => { ARMDOWN(a); D.forEach((d, i) => { d.userData.pose(t + i, "stand", 0, 12, -0.55 + Math.sin(t * 9 + i) * 0.1); }); L.cam.position.set(-1.9, 1.7, 0.7); L.cam.lookAt(0.5, 0.6, -3.7); L.cam.fov = 46; }; },
    toll: (L) => { soi(L); const a = L.SIGMA("grin"); a.rotation.y = Math.PI; L.scene.add(a); porkBag(L, a); const b2 = (() => { const A = a.userData.arms[0]; const g = new L.THREE.Group(); A.add(g); g.position.set(0, -1.3, 0.05); L.bx(0.55, 0.6, 0.32, L.M("#F4F2EA", { transparent: true, opacity: 0.85 }), 0, -0.25, 0, g, 0.08); for (const x of [-0.12, 0.12]) L.bx(0.04, 0.6, 0.04, L.M("#D8B07A"), x, 0.1, 0.02, g); return g; })();
      const D = pack5(L); D.forEach((d, i) => { d.position.set(-1.8 + i * 0.9, 0, -10); d.rotation.y = 0; });
      return (t) => { a.position.set(0, 0, -6 - t * 0.9); L.walkPose(a, t * 6, 0.45); D.forEach((d, i) => d.userData.pose(t + i, "sit", 0, 14, 0)); L.cam.position.set(1.2, 1.6, -3.0 - t * 0.9); L.cam.lookAt(0, 0.9, -9.5); L.cam.fov = 48; }; },
    toll2: (L) => { soi(L); const a = L.SIGMA("grin"); a.position.set(0, 0, -8.6); a.rotation.y = Math.PI; L.scene.add(a); const D = pack5(L); D.forEach((d, i) => { d.position.set(-1.8 + i * 0.9, 0, -10); });
      const g = L.bx(0.5, 0.5, 0.3, L.M("#F4F2EA", { transparent: true, opacity: 0.85 }), 0, 0.7, -9.3, null, 0.06);
      return (t) => { const k = eo(lin(t, 0.2, 1.0)); g.position.y = 0.95 - k * 0.9; a.userData.arms[1].rotation.x = -1.2 * (1 - k * 0.7); D.forEach((d, i) => d.userData.pose(t + i, i === 2 ? "stand" : "sit", 0, 14, 0)); L.cam.position.set(-3.0, 1.3, -12.0); L.cam.lookAt(0, 0.8, -9.2); L.cam.fov = 50; }; },
    end: (L) => { soi(L); const a = L.SIGMA("grin"); a.position.set(0, 0, -3); a.rotation.y = 0.1; L.scene.add(a); const D = pack5(L); D.forEach((d, i) => { d.position.set(-1.3 + i * 0.65, 0, -3.3 + (i === 2 ? -0.5 : 0.35)); d.rotation.y = 0.1; });
      return (t) => { const w = a.userData.arms[1]; w.rotation.x = 0; w.rotation.z = 2.3 + Math.sin(t * 6) * 0.3; D.forEach((d, i) => d.userData.pose(t + i, "sit", i === 4 && t % 2 < 0.4 ? 1 : 0, 10, 0)); L.cam.position.set(0.1, 1.3, 0.6); L.cam.lookAt(0, 0.95, -3); L.cam.fov = 48; }; },
  },
  fx: [] || [
    { type: "shake", t: 2.0, a: 10 }, { type: "bubble", t: 2.1, end: 3.8, text: "โฮ่ง! โฮ่ง!", x: 560, y: 560, tx: 540, ty: 820, size: 58 },
    { type: "bubble", t: 10.2, end: sc(4), text: "โฮ่งงง!", x: 620, y: 520, tx: 560, ty: 760, size: 60 }, { type: "shake", t: 10.2, a: 12 },
    { type: "flash", t: 12.7, d: 0.1 }, { type: "bubble", t: P(5).s + 0.7, end: sc(6), text: "ว้าว ของเล่นวิ่งได้!", x: 480, y: 520, tx: 360, ty: 820, size: 52 },
    { type: "name", t: P(6).s + 0.1, end: 22.9, name: "บักซิกม่าบอย", status: "สายเอาตัวรอด · รอดเพราะดวง 😅", y: 1150 },
    { type: "wcard", t: P(7).s + 0.1, end: sc(9), tag: "อย่าเฮ็ด · DON'T", lines: ["อย่าวิ่งหนี อย่าหันหลัง"], icon: "❌", col: "#1F1F24", x: 60, y: 170, w: 640 },
    { type: "wcard", t: P(7).s + 2.0, end: sc(8), tag: "2 ขา vs 4 ขา", big: "0 : 1", icon: "🏃", col: "#2E8C86", x: 560, y: 1060, w: 440, rot: 3 },
    rule(1, "ยืนนิ่ง แขนแนบตัว บ่ฮ้อง", P(9).s + 0.2, sc(10)), rule(2, "อย่าจ้องตาหมา", P(10).s + 0.2, sc(11)),
    { type: "bubble", t: 35.9, end: sc(11), text: "สายตาตึง (ใช้บ่ได้)", x: 560, y: 600, tx: 520, ty: 820, size: 46 },
    rule(3, "ถอยช้าๆ หันหน้าหามัน", P(11).s + 0.2, sc(12)), rule(4, "เอากระเป๋า/เสื้อขวางไว้", P(12).s + 0.2, sc(13)),
    { type: "wcard", t: 45.8, end: sc(13), tag: "ถ้าล้ม · IF DOWN", lines: ["ขดตัว เอามือป้องหูกับคอ"], icon: "🛡️", col: "#2E8C86", x: 60, y: 1190, w: 640 },
    rule(5, "ล้างแผลสบู่ + น้ำไหล", P(13).s + 0.2, sc(14)),
    { type: "wcard", t: P(13).s + 1.6, end: 52.2, tag: "ล้างแผล · WASH", big: "15 นาที", icon: "🧼", col: "#2E8C86", x: 560, y: 1040, w: 460, rot: 3 },
    { type: "wcard", t: 52.4, end: sc(14), tag: "แล้วไปหาหมอ · DOCTOR", lines: ["ฉีดวัคซีนพิษสุนัขบ้า"], icon: "💉", col: "#2E8C86", x: 60, y: 1060, w: 640 },
    { type: "wcard", t: P(14).s + 0.1, end: sc(15), tag: "บ่ต้องรอดูหมา · GO NOW", big: "ไปเลย!", icon: "🏥", col: "#D9443C", x: 160, y: 200, w: 560, rot: -2 },
    { type: "flash", t: sc(16), d: 0.1 }, { type: "wcard", t: 63.2, end: sc(17), tag: "ครบทุกข้อ · CHECK", big: "4/4 ✅", icon: "🏆", col: "#2E8C86", x: 520, y: 180, w: 460, rot: 3 },
    { type: "bubble", t: P(17).s + 1.6, end: sc(18), text: "…หมูปิ้ง 👀", x: 560, y: 560, tx: 540, ty: 820, size: 54 },
    { type: "wcard", t: P(18).s + 0.2, end: sc(19), tag: "สรุป · RESULT", lines: ["กู: รอด ✅", "หมูปิ้ง: บ่รอด ❌"], icon: "🍢", col: "#D9443C", x: 60, y: 170, w: 640 },
    { type: "wcard", t: P(19).s + 1.0, end: sc(20), tag: "ค่าผ่านทาง · TOLL", big: "1 ถุง", icon: "🍢", col: "#F2A23D", x: 520, y: 180, w: 460, rot: 3 },
    { type: "choice", t: P(20).s + 0.6, items: ["🧍 ยืนนิ่ง", "🏃 วิ่งสุดชีวิต"], y: 230, xs: [90, 470] },
    { type: "black", t: DUR - 0.25, d: 1 },
  ],
  cues: [[2.0, "thud", 0.5], [sc(3), "whoosh", 0.4], [10.2, "thud", 0.5], [12.7, "whoosh", 0.6], [sc(5), "whoosh", 0.4], [sc(6), "whoosh", 0.4], [P(7).s + 0.1, "hit", 0.5], [P(7).s + 2.0, "pop", 0.5],
    [P(9).s + 0.2, "pop", 0.5], [P(10).s + 0.2, "pop", 0.5], [P(11).s + 0.2, "pop", 0.5], [P(12).s + 0.2, "pop", 0.5], [P(12).s + 0.5, "thud", 0.4], [45.8, "pop", 0.4], [P(13).s + 0.2, "pop", 0.5], [P(13).s + 1.6, "click", 0.5],
    [52.4, "pop", 0.4], [P(14).s + 0.1, "hit", 0.4], [sc(16), "whoosh", 0.5], [63.2, "pop", 0.5], [P(17).s + 1.6, "click", 0.5], [P(18).s + 0.2, "hit", 0.5], [P(19).s + 1.0, "pop", 0.5], [sc(20), "whoosh", 0.4], [P(20).s + 0.6, "pop", 0.5], [P(20).s + 0.9, "pop", 0.5]],
};
