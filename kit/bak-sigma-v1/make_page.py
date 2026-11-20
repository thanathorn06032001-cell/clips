"""Build bs.html for the channel บักซิกม่าบอย from ../whatif3d-v1/wi3d.html (run make_page.py there first if the base changed).
Adds: the channel lead SIGMA (red headband, orange jacket, backpack), bathroom set, snake, rule cards, default badge text.
python3 make_page.py"""
s = open("../whatif3d-v1/wi3d.html", encoding="utf-8").read()
def rep(a, b):
    global s
    if a not in s: raise SystemExit("pattern not found: " + a[:60])
    s = s.replace(a, b, 1)
rep('const BN = (EP && EP.channel) || "เล่าเรื่อง2มิติ";', 'const BN = (EP && EP.channel) || "บักซิกม่าบอย";')
rep("const GH = () => avatar(", r"""// ================= บักซิกม่าบอย additions =================
// channel lead: black hair, red headband, orange jacket, navy shorts, olive backpack (approved 2026-11-20)
const SIGMA = (mood = "grin", extra = {}) => { const a = avatar({ mood, top: "rider", hairCol: "#15161C", shorts: "#2E3A5C", shoes: "#2A2A2E", ...extra }); a.scale.setScalar(HUM);
  bx(1.12, 0.14, 1.04, M("#D9443C"), 0, 0.82, 0, a.userData.head, 0.04);
  if (extra.pack !== false) { bx(1.0, 1.2, 0.5, M("#4A5A3A"), 0, 1.45, -0.5, a, 0.12); for (const s of [-1, 1]) bx(0.12, 1.0, 0.1, M("#2A2A2E"), s * 0.32, 1.55, 0.27, a, 0.03); }
  return a; };
// small Thai bathroom: door at z +1.2 (opening x -0.45..0.45), toilet at x 0.6 z -0.9 (bowl top y 0.42), sink x -0.8 z -1.0, floor drain centre. open(k) swings the door.
function bathroom(night) {
  scene.background = new THREE.Color("#E8F0EE");
  bx(2.4, 0.05, 2.6, pmat("btile", "#BFD8D2", 0.06, "tile", 2.4, 2.6, 0.3, { roughness: 0.4 }), 0, 0, 0); bx(2.4, 0.05, 2.6, M("#F2F4F2"), 0, 2.5, 0);
  const wm = pmat("bwall", "#DDEDEA", 0.05, "tile", 2.6, 2.5, 0.25, { roughness: 0.35 }); bx(2.4, 2.5, 0.08, wm, 0, 1.25, -1.3); bx(0.08, 2.5, 2.6, wm, -1.2, 1.25, 0); bx(0.08, 2.5, 2.6, wm, 1.2, 1.25, 0);
  bx(0.75, 2.5, 0.08, wm, -0.83, 1.25, 1.3); bx(0.75, 2.5, 0.08, wm, 0.83, 1.25, 1.3); bx(0.9, 0.4, 0.08, wm, 0, 2.3, 1.3);
  bx(4, 0.05, 3.4, pmat("bout", "#C8A27A", 0.12, "plank", 4, 3.4, 0.6), 0, 0, 3.0); const ow = pmat("bowall", "#F1DCCB", 0.05, null, 3.4, 2.6); bx(0.08, 2.6, 3.4, ow, -2.0, 1.3, 3.0); bx(0.08, 2.6, 3.4, ow, 2.0, 1.3, 3.0); for (const s of [-1, 1]) bx(1.55, 2.6, 0.08, M("#F4E6D6"), s * 1.225, 1.3, 1.36); bx(0.9, 0.5, 0.08, M("#F4E6D6"), 0, 2.35, 1.36); bx(4, 0.05, 3.4, M("#F6F4EE"), 0, 2.6, 3.0); lamp(0, 2.3, 2.8, "#FFF4E0", 4, 5);
  const door = new THREE.Group(); door.position.set(-0.45, 0, 1.3); scene.add(door); bx(0.9, 2.08, 0.05, pmat("bdoor", "#E8E2D2", 0.06, "plank", 0.9, 2.1, 0.45), 0.45, 1.04, 0, door);
  const tm = M("#FAFAF8", { roughness: 0.25 }); bx(0.4, 0.38, 0.5, tm, 0.6, 0.19, -0.85, null, 0.08); bx(0.44, 0.06, 0.52, tm, 0.6, 0.41, -0.86, null, 0.03); bx(0.42, 0.42, 0.18, tm, 0.6, 0.62, -1.15, null, 0.05); bx(0.3, 0.02, 0.32, M("#9FC4D6", { roughness: 0.1, metalness: 0.2 }), 0.6, 0.42, -0.84);
  bx(0.5, 0.14, 0.38, tm, -0.8, 0.85, -1.08, null, 0.05); bx(0.12, 0.8, 0.12, tm, -0.8, 0.4, -1.1); bx(0.45, 0.6, 0.03, M("#CFE6F2", { roughness: 0.05, metalness: 0.6 }), -0.8, 1.45, -1.25);
  bx(0.5, 0.5, 0.4, M("#3A8AD0"), -0.8, 0.25, 0.3, null, 0.06); bx(0.12, 0.05, 0.12, M("#2A2A2E"), 0, 0.03, 0.1);   // water jar (ตุ่ม-style bucket) + drain
  bx(0.4, 0.04, 0.3, E(night ? "#FFE6B0" : "#FFFFFF", 2.2), 0, 2.46, 0); lamp(0, 2.2, 0, night ? "#FFE0A8" : "#FFFFFF", night ? 4 : 6, 5);
  scene.add(new THREE.HemisphereLight("#FFFFFF", "#9AB0AA", night ? 0.6 : 1.0)); R.toneMappingExposure = 1.0;
  return { open: (k) => (door.rotation.y = -1.6 * k) };
}
// snake: a thick tube along a curve, patterned, with a head + tongue. snake({len, col, s}) -> group; userData.pose(t, pts) bends it through points [[x,y,z]...] (local), userData.anim(t) flicks the tongue
function snake(o = {}) { o = { col: "#3E7A3A", band: "#C9B23A", s: 1, ...o }; const G = new THREE.Group(); scene.add(G);
  const skin = tex(64, 16, (g) => { g.fillStyle = o.col; g.fillRect(0, 0, 64, 16); g.fillStyle = o.band; for (let x = 0; x < 64; x += 16) g.fillRect(x, 0, 6, 16); g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(0, 12, 64, 4); }); skin.repeat.set(8, 1);
  const mat = new THREE.MeshStandardMaterial({ map: skin, roughness: 0.55 }); let body = null;
  const head = new THREE.Group(); G.add(head); const hm = M(o.col, { roughness: 0.5 }); bx(0.16, 0.08, 0.2, hm, 0, 0, 0.04, head, 0.035);
  for (const s of [-1, 1]) { bx(0.035, 0.035, 0.02, M("#F4E04A"), s * 0.06, 0.035, 0.08, head, 0.01); bx(0.012, 0.03, 0.022, M("#111"), s * 0.06, 0.035, 0.085, head); }
  const tongue = bx(0.012, 0.006, 0.09, M("#D9443C"), 0, -0.01, 0.17, head);
  G.scale.setScalar(o.s);
  G.userData = { head, pose: (pts) => { const v = pts.map((p) => new THREE.Vector3(...p)); const c = new THREE.CatmullRomCurve3(v); if (body) { G.remove(body); body.geometry.dispose(); }
      const geo = new THREE.TubeGeometry(c, 60, 0.045, 10); const r = geo.attributes.position; // taper the tail
      body = new THREE.Mesh(geo, mat); body.castShadow = true; G.add(body); const end = v[v.length - 1], pre = c.getPointAt(0.97); head.position.copy(end); head.lookAt(end.clone().add(end.clone().sub(pre))); },
    anim: (t) => { tongue.scale.z = Math.sin(t * 14) > 0.3 ? 1 : 0.2; } };
  return G; }
const GH = () => avatar(""")
rep("const L = { THREE, scene, cam, R, avatar,", "const L = { THREE, scene, cam, R, avatar, SIGMA, bathroom, snake,")
open("bs.html", "w", encoding="utf-8").write(s); print("bs.html", len(s))
