"""Build wi3d.html (3D what-if page) from rig3d-v2/v2.html + daylight sets, 3D cats, glasses/tee lead, what-if UI overlay.
Run once from this folder: python3 make_page.py"""
s = open("../rig3d-v2/v2.html", encoding="utf-8").read()
def rep(a, b, cnt=1):
    global s
    if a not in s: raise SystemExit("pattern not found: " + a[:60])
    s = s.replace(a, b, cnt)

# ---- face: glasses, happy (open smile), talk ----
rep("""    else if (mood === "smile") { g.beginPath(); g.arc(256, ey + 100, 34, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); }""",
"""    else if (mood === "smile") { g.beginPath(); g.arc(256, ey + 100, 34, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); }
    else if (mood === "happy") { g.fillStyle = "#6A2018"; g.beginPath(); g.moveTo(214, ey + 108); g.quadraticCurveTo(256, ey + 178, 298, ey + 108); g.closePath(); g.fill(); g.fillStyle = "#E86A70"; g.beginPath(); g.ellipse(256, ey + 140, 20, 10, 0, 0, 7); g.fill(); }
    else if (mood === "talk") { g.fillStyle = "#4A1812"; g.beginPath(); g.ellipse(256, ey + 124, 22, 16, 0, 0, 7); g.fill(); }""")
rep("""    else { g.beginPath(); g.moveTo(232, ey + 120); g.quadraticCurveTo(256, ey + 130, 280, ey + 120); g.stroke(); }
  });""", """    else { g.beginPath(); g.moveTo(232, ey + 120); g.quadraticCurveTo(256, ey + 130, 280, ey + 120); g.stroke(); }
    if (o.glasses) { g.strokeStyle = "#24201E"; g.lineWidth = 12; for (const x of [170, 342]) { g.beginPath(); g.arc(x, ey + 2, 70, 0, 7); g.stroke(); } g.beginPath(); g.moveTo(236, ey - 4); g.quadraticCurveTo(256, ey - 18, 276, ey - 4); g.stroke(); g.fillStyle = "rgba(255,255,255,.18)"; for (const x of [170, 342]) { g.beginPath(); g.ellipse(x - 26, ey - 28, 18, 10, -0.6, 0, 7); g.fill(); } }
  });""")
# smile/happy eyes closed-arc as in "smile": happy reuses smile eyes
rep("""if (mood === "closed" || mood === "smile") {""", """if (mood === "closed" || mood === "smile" || mood === "happy") {""")
rep("""g.arc(x, ey + 6, 40, mood === "smile" ? 1.15 * Math.PI : 0.15 * Math.PI, mood === "smile" ? 1.85 * Math.PI : 0.85 * Math.PI)""",
    """g.arc(x, ey + 6, 40, mood !== "closed" ? 1.15 * Math.PI : 0.15 * Math.PI, mood !== "closed" ? 1.85 * Math.PI : 0.85 * Math.PI)""")

# ---- avatar: tee top (col + teal pocket), shorts ----
rep("""  } else if (o.top === "dress") {""", """  } else if (o.top === "tee") {
    const base = o.col || "#E8A93A";
    const st = tex(64, 64, (g) => { g.fillStyle = base; g.fillRect(0, 0, 64, 64); g.fillStyle = "rgba(0,0,0,.06)"; for (let y = 0; y < 64; y += 4) g.fillRect(0, y, 64, 1); g.fillStyle = shade(base, 0.75); g.beginPath(); g.arc(32, 0, 10, 0, 7); g.fill(); g.fillStyle = o.pocket || "#2E8C86"; g.fillRect(38, 14, 11, 12); }, true);
    const body = M(base); topMats = [body, body, body, body, new THREE.MeshStandardMaterial({ map: st, roughness: 0.9 }), body]; sleeveM = M(shade(base, 0.96));
  } else if (o.top === "dress") {""")
rep("""for (const s of [-1, 1]) { const L = new THREE.Group(); L.position.set(s * 0.25, hip, 0); P.add(L); bx(0.46, 1.0, 0.48, legM, 0, -0.5, 0, L, 0.05);""",
    """for (const s of [-1, 1]) { const L = new THREE.Group(); L.position.set(s * 0.25, hip, 0); P.add(L); if (o.shorts) { bx(0.48, 0.5, 0.5, M(o.shorts), 0, -0.25, 0, L, 0.05); bx(0.4, 0.52, 0.42, skinM, 0, -0.72, 0, L, 0.05); } else bx(0.46, 1.0, 0.48, legM, 0, -0.5, 0, L, 0.05);""")
rep("""bx(0.48, 0.18, 0.56, M(o.top === "dress" ? o.skin : "#1A1A1E"), 0, -0.92, 0.04, L, 0.05); legs.push(L); }""",
    """bx(0.48, 0.18, 0.56, M(o.top === "dress" ? o.skin : (o.shoes || "#1A1A1E")), 0, -0.92, 0.04, L, 0.05); legs.push(L); }""")

# ---- sit(): keep shorts (thigh = shorts colour, shin = skin) ----
rep("""function sit(p) { for (const L of p.userData.legs) { L.children.forEach((c) => (c.visible = false)); const lm = L.children[0].material, sm = L.children[1].material; bx(0.46, 0.48, 0.9, lm, 0, -0.2, 0.42, L, 0.05); bx(0.46, 0.9, 0.48, lm, 0, -0.6, 0.66, L, 0.05);""",
    """function sit(p) { for (const L of p.userData.legs) { L.children.forEach((c) => (c.visible = false)); const n3 = L.children.length >= 3, lm = L.children[0].material, shin = n3 ? L.children[1].material : lm, sm = L.children[n3 ? 2 : 1].material; bx(0.46, 0.48, 0.9, lm, 0, -0.2, 0.42, L, 0.05); bx(0.46, 0.9, 0.48, shin, 0, -0.6, 0.66, L, 0.05);""")
# ---- daylight sets, living room, 3D cats ----
rep("""const GH = () => avatar(""", r"""// ================= WHAT-IF DAYLIGHT KIT =================
function sun(col = "#FFF2DA", i = 2.6, pos = [4, 7, 3], tgt = [0, 0, -1]) { const d = new THREE.DirectionalLight(col, i); d.position.set(...pos); d.target.position.set(...tgt); d.castShadow = true; d.shadow.mapSize.set(1024, 1024); const c = d.shadow.camera; c.left = c.bottom = -8; c.right = c.top = 8; c.far = 40; scene.add(d, d.target); return d; }
function skyTex() { return tex(16, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#5FA8E8"); gr.addColorStop(0.7, "#BFE2F6"); gr.addColorStop(1, "#F4F0E2"); g.fillStyle = gr; g.fillRect(0, 0, 16, 256); }); }
// bright bedroom in the morning: same layout as room() (bed x -1.2 z -0.95, desk x 1.3, window x 0.8 z -2.05, door x 1.96 z 1.0)
function roomDay() {
  scene.background = new THREE.Color("#F4EEE2");
  bx(4.2, 0.05, 4.2, pmat("dfloor", "#C49A6A", 0.14, "plank", 4.2, 4.2, 0.6), 0, 0, 0); bx(4.2, 0.05, 4.2, M("#F4F2EC"), 0, 2.6, 0);
  const wm = pmat("dwall", "#F1DCCB", 0.06, null, 4.2, 2.6); bx(4.2, 2.6, 0.1, wm, 0, 1.3, -2.1); bx(0.1, 2.6, 4.2, wm, -2.1, 1.3, 0); bx(0.1, 2.6, 4.2, wm, 2.1, 1.3, 0);
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.1), new THREE.MeshBasicMaterial({ map: skyTex() })); sky.position.set(0.8, 1.55, -2.04); scene.add(sky);
  bx(1.4, 0.06, 0.1, M("#FFFFFF"), 0.8, 2.12, -2.02); bx(1.4, 0.06, 0.1, M("#FFFFFF"), 0.8, 0.98, -2.02); bx(0.06, 1.2, 0.1, M("#FFFFFF"), 0.8, 1.55, -2.02);
  for (const x of [0.0, 1.6]) bx(0.45, 2.1, 0.06, pmat("dcurt", "#6FB7AE", 0.08, null, 0.45, 2.1), x, 1.25, -1.97);
  bx(1.6, 0.32, 2.1, pmat("dbedf", "#B07A50", 0.15, "plank", 1.6, 2.1), -1.2, 0.18, -0.95); bx(1.55, 0.2, 2.05, M("#FFFFFF"), -1.2, 0.44, -0.95, null, 0.06); bx(1.5, 0.12, 1.2, M("#F2A7B5"), -1.2, 0.58, -0.4, null, 0.05); bx(0.62, 0.15, 0.42, M("#FFFFFF"), -1.35, 0.62, -1.7, null, 0.07);
  bx(1.2, 0.06, 0.62, pmat("ddesk", "#D2A874", 0.15, "plank", 1.2, 0.6), 1.3, 0.75, -1.7); for (const x of [0.75, 1.85]) bx(0.06, 0.75, 0.58, M("#B08A5C"), x, 0.37, -1.7);
  bx(0.32, 0.4, 0.04, M("#F2B63D"), -0.5, 1.7, -2.04); bx(0.5, 0.5, 0.04, M("#E89AA6"), 1.85, 1.9, -1.0).rotation.y = Math.PI / 2;
  const clk = tex(128, 128, (g) => { g.fillStyle = "#FFF"; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.strokeStyle = "#D9443C"; g.lineWidth = 8; g.stroke(); g.strokeStyle = "#333"; g.lineWidth = 6; g.beginPath(); g.moveTo(64, 64); g.lineTo(64, 24); g.moveTo(64, 64); g.lineTo(90, 64); g.stroke(); });
  const cm = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24), new THREE.MeshStandardMaterial({ map: clk })); cm.position.set(-1.4, 1.95, -2.04); scene.add(cm);
  sun("#FFF0D8", 2.4, [1.6, 3.2, -4.5], [-0.6, 0.4, 0.4]); scene.add(new THREE.HemisphereLight("#FFFFFF", "#C9A47A", 1.1)); lamp(0.8, 1.6, -1.2, "#FFF4E0", 2.5, 4); R.toneMappingExposure = 1.05;
}
// living room: sofa against the back wall (seat x -1.2..1.2, z -1.3, seat top y 0.45), TV on the right wall facing -x at x 2.0
function livingDay(warm) {
  scene.background = new THREE.Color("#F4EEE2");
  bx(6, 0.05, 6, pmat("lfloor", "#C8A27A", 0.12, "plank", 6, 6, 0.6), 0, 0, 0); bx(6, 0.05, 6, M("#F6F4EE"), 0, 2.7, 0);
  const wm = pmat("lwall", warm ? "#F3C9A8" : "#E7E1D2", 0.05, null, 6, 2.7); bx(6, 2.7, 0.1, wm, 0, 1.35, -2.0); bx(0.1, 2.7, 6, wm, -3, 1.35, 0); bx(0.1, 2.7, 6, wm, 3, 1.35, 0);
  const sm = M("#4FA89E", { roughness: 0.95 }); bx(2.8, 0.42, 0.9, sm, 0, 0.26, -1.4, null, 0.08); bx(2.8, 0.7, 0.25, sm, 0, 0.75, -1.8, null, 0.08); for (const s of [-1, 1]) bx(0.3, 0.62, 0.95, sm, s * 1.5, 0.36, -1.4, null, 0.08);
  for (const s of [-1, 1]) bx(0.55, 0.12, 0.5, M("#F2B63D"), s * 0.75, 0.53, -1.35, null, 0.05);
  bx(1.2, 0.05, 0.6, M("#B07A50"), 0, 0.4, -0.2); for (const x of [-0.5, 0.5]) bx(0.05, 0.4, 0.05, M("#8A5E3A"), x, 0.2, -0.2);
  bx(0.06, 0.8, 1.4, M("#15161A"), 2.93, 1.35, -0.2); const tvs = bx(0.02, 0.7, 1.3, E("#2C4A8C", 0.8), 2.89, 1.35, -0.2);
  bx(0.7, 0.5, 0.04, M("#F4E6C8"), -1.2, 1.75, -1.94); bx(0.5, 0.6, 0.04, M("#F4E6C8"), 0.6, 1.8, -1.94); bx(0.4, 0.3, 0.02, M("#6FB7AE"), -1.2, 1.75, -1.91); bx(0.3, 0.4, 0.02, M("#E89AA6"), 0.6, 1.8, -1.91);
  bx(0.3, 0.45, 0.3, M("#B07A54"), -2.5, 0.22, -1.5); const pl = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), M("#7FB069")); pl.position.set(-2.5, 0.85, -1.5); pl.castShadow = true; scene.add(pl);
  const skyM = new THREE.MeshBasicMaterial({ map: warm ? tex(16, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#8C4A9E"); gr.addColorStop(0.6, "#E77F8C"); gr.addColorStop(1, "#F6C27A"); g.fillStyle = gr; g.fillRect(0, 0, 16, 256); }) : skyTex() });
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.3), skyM); win.position.set(-2.94, 1.55, 0.3); win.rotation.y = Math.PI / 2; scene.add(win);
  sun(warm ? "#FFB070" : "#FFF0D8", warm ? 2.0 : 2.4, [-5, 3.5, 0.6], [0.5, 0.3, -0.6]); scene.add(new THREE.HemisphereLight(warm ? "#FFD9C0" : "#FFFFFF", "#B08A64", warm ? 0.8 : 1.05)); R.toneMappingExposure = 1.05;
  return { tvScreen: tvs };
}
// Thai soi in daytime (same layout as street(): road along z, footpaths x +-6.5, shophouses x +-11) + a low wall at x -4.6 for cats
function soiDay() {
  const sk = new THREE.Mesh(new THREE.SphereGeometry(80, 16, 12), new THREE.MeshBasicMaterial({ map: skyTex(), side: THREE.BackSide })); scene.add(sk); scene.background = new THREE.Color("#BFE2F6"); scene.fog = new THREE.Fog("#DCEBF2", 30, 75);
  bx(30, 0.05, 80, pmat("dasph", "#6A6B70", 0.12, null, 30, 80, 1), 0, 0, -20);
  for (const s of [-1, 1]) bx(3, 0.15, 80, pmat("dpave", "#B8B2A6", 0.12, "tile", 3, 80, 0.6), s * 6.5, 0.07, -20);
  for (let z = 6; z > -60; z -= 6) bx(0.15, 0.01, 3, M("#F2E6B0"), 0, 0.03, z);
  const cols = ["#F1DCCB", "#CFE3DE", "#F4E2B8", "#E8D2DA"], signs = [["ข้าวมันไก่", "#E2553B"], ["ร้านชำ", "#2E8C86"], ["ซักรีด", "#3A7AD0"], ["ก๋วยเตี๋ยว", "#F2A23D"], ["ร้านตัดผม", "#8A5AB8"]];
  for (const side of [-1, 1]) for (let i = 0; i < 11; i++) {
    const z = 4 - i * 4.2, x = side * 11;
    bx(6, 12, 4.1, pmat("dbld" + (i % 4), cols[i % 4], 0.08, "brick", 6, 12, 0.6), x, 6, z);
    for (let f = 1; f < 3; f++) bx(0.1, 1.5, 2.6, M("#8FB8CC", { roughness: 0.2, metalness: 0.2 }), x - side * 3.02, 4 * f + 2.2, z);
    const open = i % 2 === 1; bx(0.1, 3.0, 3.6, open ? M("#5A4A40") : pmat("dshut", "#A8AEB2", 0.1, "plank", 3.6, 3, 0.25), x - side * 3.02, 1.55, z);
    for (let k = 0; k < 6; k++) bx(0.5, 0.06, 0.6, M(k % 2 ? "#FFFFFF" : signs[i % 5][1]), x - side * (3.3 + 0.22 * Math.floor(k / 2)), 3.1 - 0.04 * Math.floor(k / 2), z - 1.5 + (k % 2) * 0.6 + Math.floor(k / 2) * 0);
    bx(1.2, 0.08, 4.1, M(signs[i % 5][1]), x - side * 3.6, 3.2, z);
    if (i % 2 === 0) { const [tx, bg] = signs[i % 5]; const t = tex(512, 128, (g) => { g.fillStyle = bg; g.fillRect(0, 0, 512, 128); g.fillStyle = "#FFF"; g.font = "700 76px Kanit"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(tx, 256, 70); }); const sg = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.65), new THREE.MeshStandardMaterial({ map: t })); sg.position.set(x - side * 3.08, 3.75, z); sg.rotation.y = -side * Math.PI / 2; scene.add(sg); }
  }
  for (let z = 2; z > -56; z -= 14) for (const s of [-1, 1]) { bx(0.3, 9, 0.3, pmat("dpole", "#B8B4AC", 0.1, null, 0.3, 9), s * 5.4, 4.5, z); bx(1.4, 0.12, 0.12, M("#8A8680"), s * 5.4, 8.2, z);
    if (z > -42) for (let k = 0; k < 4; k++) { const c = new THREE.CatmullRomCurve3([new THREE.Vector3(s * 5.4 + (k - 2) * 0.1, 8.1 - k * 0.15, z), new THREE.Vector3(s * 5.4 + (k - 2) * 0.1, 7.2 - k * 0.15, z - 7), new THREE.Vector3(s * 5.4 + (k - 2) * 0.1, 8.1 - k * 0.15, z - 14)]); scene.add(new THREE.Mesh(new THREE.TubeGeometry(c, 16, 0.025, 4), M("#2A2A2E"))); } }
  bx(0.4, 0.9, 30, pmat("dlwall", "#D8D0C2", 0.08, "brick", 30, 0.9, 0.5), -4.6, 0.45, -8); bx(0.5, 0.08, 30, M("#E8E2D6"), -4.6, 0.94, -8);   // low wall, top y 0.98
  sun("#FFF2DA", 2.8, [6, 10, 4], [0, 0, -4]); scene.add(new THREE.HemisphereLight("#CFE6FF", "#B8A88E", 1.0)); R.toneMappingExposure = 1.0;
}
// 3D blocky cat (sits on the ground, ~0.45 m tall at s=1). col: orange, black, white, grey, calico. mood: calm, talk, angry, smug, sleepy, shock. setMood(m).
const CATC = { orange: ["#EFA555", "#C9772E", "#FBE3C4"], black: ["#3A353E", "#221E25", "#5A5260"], white: ["#F7F2EA", "#D9D0C4", "#FFFFFF"], grey: ["#A3A9B2", "#7C838D", "#D6DADF"], calico: ["#F7F2EA", "#E59A4A", "#4A403E"] };
function catFace(col, mood) { const [c, d, l] = CATC[col]; return tex(256, 256, (g) => {
  g.fillStyle = c; g.fillRect(0, 0, 256, 256); if (col === "orange") { g.fillStyle = d; for (const x of [96, 128, 160]) g.fillRect(x - 6, 0, 12, 50); } if (col === "calico") { g.fillStyle = d; g.beginPath(); g.ellipse(50, 60, 70, 60, 0, 0, 7); g.fill(); g.fillStyle = l; g.beginPath(); g.ellipse(210, 50, 50, 50, 0, 0, 7); g.fill(); }
  g.fillStyle = col === "black" ? "#4A4450" : "#FFF7EE"; g.beginPath(); g.ellipse(128, 190, 62, 46, 0, 0, 7); g.fill();
  const ey = 120, eye = col === "black" ? "#E9C64A" : "#7DBF6A";
  for (const x of [82, 174]) { if (mood === "sleepy" || mood === "smug") { g.strokeStyle = "#1A1414"; g.lineWidth = 9; g.beginPath(); g.arc(x, ey + (mood === "smug" ? -6 : 6), 22, mood === "smug" ? 0.1 * Math.PI : 1.1 * Math.PI, mood === "smug" ? 0.9 * Math.PI : 1.9 * Math.PI); g.stroke(); continue; }
    const r = mood === "shock" ? 30 : 26; g.fillStyle = eye; g.beginPath(); g.ellipse(x, ey, r, r * 1.1, 0, 0, 7); g.fill(); g.lineWidth = 6; g.strokeStyle = "#1A1414"; g.stroke(); g.fillStyle = "#1A1414"; g.beginPath(); g.ellipse(x, ey, mood === "shock" ? 6 : 9, 24, 0, 0, 7); g.fill(); g.fillStyle = "#FFF"; g.beginPath(); g.arc(x + 8, ey - 10, 6, 0, 7); g.fill(); }
  if (mood === "angry") { g.strokeStyle = "#1A1414"; g.lineWidth = 10; g.beginPath(); g.moveTo(52, 80); g.lineTo(108, 98); g.moveTo(204, 80); g.lineTo(148, 98); g.stroke(); }
  g.fillStyle = "#E87F8E"; g.beginPath(); g.moveTo(116, 160); g.lineTo(140, 160); g.lineTo(128, 174); g.closePath(); g.fill();
  g.strokeStyle = "#1A1414"; g.lineWidth = 6;
  if (mood === "talk" || mood === "angry" || mood === "shock") { g.fillStyle = "#6A2018"; g.beginPath(); g.ellipse(128, 198, 22, mood === "shock" ? 22 : 16, 0, 0, 7); g.fill(); g.fillStyle = "#E86A70"; g.beginPath(); g.ellipse(128, 206, 12, 6, 0, 0, 7); g.fill(); }
  else { g.beginPath(); g.moveTo(104, 184); g.quadraticCurveTo(116, 198, 128, 182); g.quadraticCurveTo(140, 198, 152, 184); g.stroke(); }
  g.lineWidth = 3; g.strokeStyle = "rgba(30,20,20,.6)"; for (const s of [-1, 1]) for (const dy of [-6, 8]) { g.beginPath(); g.moveTo(128 + s * 56, 176 + dy); g.lineTo(128 + s * 120, 170 + dy * 1.6); g.stroke(); }
}); }
function cat3d(o = {}) { o = { col: "orange", mood: "calm", s: 1, ...o }; const [c, d, l] = CATC[o.col]; const P = new THREE.Group(), cm = M(c, { roughness: 0.9 }), lm = M(l, { roughness: 0.9 });
  const body = bx(0.3, 0.3, 0.42, cm, 0, 0.17, -0.04, P, 0.08); bx(0.2, 0.2, 0.05, lm, 0, 0.2, 0.17, P, 0.04);
  for (const s of [-1, 1]) { bx(0.08, 0.16, 0.08, cm, s * 0.09, 0.08, 0.13, P, 0.03); bx(0.09, 0.08, 0.14, cm, s * 0.11, 0.04, -0.16, P, 0.03); }
  const head = new THREE.Group(); head.position.set(0, 0.42, 0.06); P.add(head);
  const fm = new THREE.MeshStandardMaterial({ map: catFace(o.col, o.mood), roughness: 0.85 }); const hm = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.28, 0.26, 3, 0.08), [cm, cm, cm, cm, fm, cm]); hm.castShadow = true; head.add(hm);
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.13, 4), cm); e.position.set(s * 0.1, 0.17, -0.01); e.rotation.y = Math.PI / 4; e.rotation.z = -s * 0.15; e.castShadow = true; head.add(e); const ei = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 4), M("#F2A7B0")); ei.position.set(s * 0.1, 0.16, 0.02); ei.rotation.y = Math.PI / 4; ei.rotation.z = -s * 0.15; head.add(ei); }
  const tail = new THREE.Group(); tail.position.set(0.08, 0.08, -0.24); P.add(tail); const segs = []; let par = tail; for (let k = 0; k < 5; k++) { const g = new THREE.Group(); g.position.y = k ? 0.07 : 0; par.add(g); bx(0.06, 0.08, 0.06, k === 4 && o.col === "orange" ? M(d) : cm, 0, 0.04, 0, g, 0.025); segs.push(g); par = g; }
  P.scale.setScalar(o.s); let mood = o.mood;
  P.userData = { head, tail: segs, setMood: (m) => { if (m === mood) return; mood = m; fm.map = catFace(o.col, m); fm.needsUpdate = true; },
    anim: (t, talk) => { segs.forEach((g, k) => { g.rotation.z = Math.sin(t * 3 + k * 0.6) * 0.18; g.rotation.x = -0.25; }); head.rotation.z = Math.sin(t * 1.3) * 0.04; if (talk !== undefined) P.userData.setMood(talk ? (Math.floor(t * 8) % 2 ? "talk" : o.mood) : o.mood); } };
  return P; }
// the what-if lead "ต้น" in 3D: round glasses, mustard tee with teal pocket, navy shorts, white sneakers
const LEAD = (mood = "normal", extra = {}) => { const a = avatar({ mood, top: "tee", col: "#E8A93A", glasses: 1, shorts: "#2E3A5C", shoes: "#F4F4F0", hairCol: "#3A2A22", ...extra }); a.scale.setScalar(HUM); return a; };
const GH = () => avatar(""")

# ---- overlay: what-if style subtitles (white + yellow, navy stroke), lighter vignette, new fx ----
rep("""og.lineWidth = 15; og.strokeStyle = "#000"; og.strokeText(w.t, 0, 22); og.fillStyle = w.b ? "#FF4A3D" : "#FFF6E8";""",
    """og.lineWidth = 15; og.strokeStyle = "#1F2640"; og.strokeText(w.t, 0, 22); og.fillStyle = w.b ? "#FFD447" : "#FFFFFF";""")
rep("""v.addColorStop(1, "rgba(0,0,0,.5)");""", """v.addColorStop(1, "rgba(40,20,10,.28)");""")
rep("""function overlay(tg) {""", r"""// ---- what-if UI (canvas): cards with header strip, phone notifications, choice pills, name card, 2D speech bubble, confetti ----
const backE = (x) => (x >= 1 ? 1 : 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2));
function popK(tg, t0) { const e = tg - t0; return e < 0 ? -1 : Math.min(1, e / 0.25); }
function rrect(x, y, w, h, r) { og.beginPath(); og.roundRect(x, y, w, h, r); }
function wcard(f, tg) { const k = popK(tg, f.t); if (k < 0) return; const w = f.w || 520, x = f.x ?? 60, y = f.y ?? 170, lines = f.lines || [], hh = 62, bh = f.big !== undefined ? 130 : 30 + lines.length * 52, H2 = hh + bh;
  let big = f.big; if (f.roll) { const e = Math.min(1, Math.max(0, (tg - f.t) / (f.roll.d || 1.2))); big = Math.round(f.roll.n * (1 - Math.pow(1 - e, 3))).toLocaleString("en-US") + (f.roll.suf || ""); }
  og.save(); og.globalAlpha = Math.min(1, k * 4); og.translate(x + w / 2, y + H2 / 2); og.rotate((f.rot ?? -2) * Math.PI / 180); og.scale(0.4 + 0.6 * backE(k), 0.4 + 0.6 * backE(k)); og.translate(-w / 2, -H2 / 2);
  og.fillStyle = "rgba(62,48,41,.22)"; rrect(0, 14, w, H2, 30); og.fill(); og.fillStyle = "#FFFDF7"; rrect(0, 0, w, H2, 30); og.fill(); og.save(); rrect(0, 0, w, H2, 30); og.clip(); og.fillStyle = f.col || "#2E8C86"; og.fillRect(0, 0, w, hh); og.restore(); og.lineWidth = 5; og.strokeStyle = "#3E3029"; rrect(0, 0, w, H2, 30); og.stroke();
  og.fillStyle = "#FFF"; og.font = "600 30px Kanit"; og.textBaseline = "middle"; og.textAlign = "left"; og.fillText((f.icon ? f.icon + "  " : "") + f.tag, 26, hh / 2 + 2);
  og.fillStyle = "#24304F"; if (big !== undefined) { og.font = "700 96px Kanit"; og.fillText(typeof big === "number" ? big.toLocaleString("en-US") : String(big), 28, hh + bh / 2 + 4); } else { og.font = "600 34px Kanit"; lines.forEach((l, i) => og.fillText(l, 28, hh + 40 + i * 52)); }
  og.restore(); }
function phoneUI(f, tg) { const k = popK(tg, f.t); if (k < 0) return; const x = f.x ?? 250, y = f.y ?? 160, w = 580, h = 1080, sh = 140 * (1 - backE(k));
  og.save(); og.translate(0, sh); og.globalAlpha = Math.min(1, k * 3); og.fillStyle = "#1C1B22"; rrect(x, y, w, h, 76); og.fill(); const gr = og.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, "#3B3355"); gr.addColorStop(1, "#7B4D6A"); og.fillStyle = gr; rrect(x + 22, y + 22, w - 44, h - 44, 56); og.fill(); og.fillStyle = "#000"; rrect(x + w / 2 - 70, y + 40, 140, 36, 18); og.fill();
  og.textAlign = "center"; og.fillStyle = "rgba(255,255,255,.85)"; og.font = "600 30px Kanit"; og.fillText(f.date || "", x + w / 2, y + 150); og.fillStyle = "#FFF"; og.font = "600 130px Kanit"; og.fillText(f.time || "07:05", x + w / 2, y + 280);
  const notes = f.notes || [], n = Math.min(notes.length, Math.floor((tg - f.t) / (f.step || 0.45)) + 1); og.textAlign = "left";
  for (let i = 0; i < n; i++) { const [ic, c, nm, tx] = notes[i], ny = y + 330 + i * 140; og.fillStyle = "rgba(60,60,70,.85)"; rrect(x + 44, ny, w - 88, 122, 26); og.fill(); og.fillStyle = c; rrect(x + 62, ny + 30, 62, 62, 14); og.fill(); og.font = "36px sans-serif"; og.fillStyle = "#FFF"; og.fillText(ic, x + 72, ny + 74); og.font = "600 28px Kanit"; og.fillText(nm, x + 142, ny + 48); og.font = "400 26px Kanit"; og.globalAlpha = 0.9; og.fillText(tx, x + 142, ny + 88); og.globalAlpha = 1; }
  og.restore(); }
function choiceUI(f, tg) { (f.items || []).forEach((tx, i) => { const k = popK(tg, f.t + i * 0.3); if (k < 0) return; og.save(); og.font = "700 44px Kanit"; const w = og.measureText(tx).width + 70, x = (f.xs || [110, 600])[i] ?? 110, y = f.y ?? 220; og.globalAlpha = Math.min(1, k * 4); og.translate(x + w / 2, y + 45); og.scale(0.4 + 0.6 * backE(k), 0.4 + 0.6 * backE(k)); og.fillStyle = "rgba(0,0,0,.2)"; rrect(-w / 2, -40, w, 96, 48); og.fill(); og.fillStyle = "#FFFDF7"; rrect(-w / 2, -45, w, 90, 45); og.fill(); og.lineWidth = 5; og.strokeStyle = "#3E3029"; og.stroke(); og.fillStyle = "#2B1B22"; og.textAlign = "center"; og.textBaseline = "middle"; og.fillText(tx, 0, 2); og.restore(); }); }
function nameUI(f, tg) { const k = popK(tg, f.t); if (k < 0) return; const x = f.x ?? 60, y = f.y ?? 1180; og.save(); og.globalAlpha = Math.min(1, k * 4); og.translate(x - 300 * (1 - backE(k)), y); og.font = "700 54px Kanit"; const w1 = og.measureText(f.name).width + 50; og.font = "600 34px Kanit"; const w2 = og.measureText(f.status).width + 50;
  og.fillStyle = "#24304F"; rrect(0, 0, w1, 84, 20); og.fill(); og.fillStyle = "#FFD447"; og.font = "700 54px Kanit"; og.textBaseline = "middle"; og.fillText(f.name, 25, 44); og.fillStyle = "#FFFDF7"; rrect(10, 90, w2, 60, 16); og.fill(); og.lineWidth = 4; og.strokeStyle = "#3E3029"; og.stroke(); og.fillStyle = "#24304F"; og.font = "600 34px Kanit"; og.fillText(f.status, 35, 121); og.restore(); }
function bubbleUI(f, tg) { const k = popK(tg, f.t); if (k < 0) return; og.save(); const s = f.size || 46; og.font = `600 ${s}px Kanit`; const w = og.measureText(f.text).width + 64, h = s + 46, x = f.x, y = f.y; og.globalAlpha = Math.min(1, k * 4); og.translate(x, y); og.scale(0.4 + 0.6 * backE(k), 0.4 + 0.6 * backE(k));
  og.fillStyle = "#FFF"; og.strokeStyle = "#3E3029"; og.lineWidth = 5; og.beginPath(); og.moveTo(-18, h / 2 - 4); og.lineTo((f.tx ?? x) - x, (f.ty ?? y + 120) - y); og.lineTo(18, h / 2 - 4); og.closePath(); og.fill(); og.stroke(); rrect(-w / 2, -h / 2, w, h, h / 2); og.fill(); og.stroke(); og.fillRect(-16, h / 2 - 12, 32, 10);
  og.fillStyle = "#3E3029"; og.textAlign = "center"; og.textBaseline = "middle"; og.fillText(f.text, 0, 3); og.restore(); }
function confettiUI(f, tg) { const e = tg - f.t; if (e < 0 || e > (f.d || 2.5)) return; let r = 1234; const rnd = () => ((r = (r * 16807) % 2147483647) / 2147483647); for (let i = 0; i < 70; i++) { const x = rnd() * W, y0 = -100 - rnd() * 700, sp = 400 + rnd() * 300, y = y0 + e * sp; og.save(); og.translate(x + Math.sin(e * 3 + i) * 30, y); og.rotate(e * 4 + i); og.fillStyle = ["#F2B63D", "#E2553B", "#2E8C86", "#E89AA6", "#6FA8DC"][i % 5]; og.fillRect(-9, -15, 18, 30); og.restore(); } }
function badgeUI() { og.save(); og.font = "700 28px Kanit"; const w = og.measureText("เล่าเรื่อง2มิติ").width + 44; og.fillStyle = "#24304F"; rrect(W - 34 - w, 40, w, 50, 25); og.fill(); og.fillStyle = "#FFD447"; og.textBaseline = "middle"; og.textAlign = "left"; og.fillText("เล่าเรื่อง2มิติ", W - 34 - w + 22, 66); og.restore(); }
function overlay(tg) {""")
rep("""if (f.type === "card" && tg >= f.t && tg < (f.end ?? 1e9)) card(f.text, f.t, tg, f.y);""",
    """if (tg >= f.t && tg < (f.end ?? 1e9)) { if (f.type === "card") card(f.text, f.t, tg, f.y); else if (f.type === "wcard") wcard(f, tg); else if (f.type === "phone") phoneUI(f, tg); else if (f.type === "choice") choiceUI(f, tg); else if (f.type === "name") nameUI(f, tg); else if (f.type === "bubble") bubbleUI(f, tg); else if (f.type === "confetti") confettiUI(f, tg); }""")
rep("""  if (!(EP && EP.noSubs)) subs(tg); return OV.toDataURL""", """  if (!(EP && EP.noSubs)) subs(tg); badgeUI(); return OV.toDataURL""")
rep("""const L = { THREE, scene, cam, R, avatar,""", """const L = { THREE, scene, cam, R, avatar, roomDay, livingDay, soiDay, cat3d, LEAD, sun,""")
open("wi3d.html", "w", encoding="utf-8").write(s); print("wi3d.html", len(s))
