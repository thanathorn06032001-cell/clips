const band = (L, a, col) => { const h = a.userData.head; L.bx(1.12, 0.14, 1.04, L.M(col), 0, 0.82, 0, h, 0.04); };
const pack = (L, a, col) => { L.bx(1.0, 1.2, 0.5, L.M(col), 0, 1.45, -0.5, a, 0.12); for (const s of [-1, 1]) L.bx(0.12, 1.0, 0.1, L.M("#2A2A2E"), s * 0.32, 1.55, 0.27, a, 0.03); };
const mk = (L, mood) => { const T = L.THREE; L.scene.background = new T.Color("#F2B63D"); L.scene.add(new T.HemisphereLight("#FFFFFF", "#C9A47A", 1.3)); L.sun("#FFF4E0", 2.2, [2, 4, 6], [0, 1, 0]);
  const fl = L.bx(8, 0.05, 8, L.M("#E8A23A"), 0, 0, 0); const a = L.avatar({ mood, top: "rider", hairCol: "#15161C", shorts: "#2E3A5C", shoes: "#2A2A2E" }); a.scale.setScalar(L.HUM); L.scene.add(a); band(L, a, "#D9443C"); pack(L, a, "#4A5A3A"); return a; };
export default { noSubs: true, noBadge: true, shots: {
  full: (L) => { mk(L, "grin"); return () => { L.cam.position.set(0, 0.95, 4.2); L.cam.lookAt(0, 0.88, 0); L.cam.fov = 30; }; },
  face: (L) => { mk(L, "grin"); return () => { L.cam.position.set(0, 1.35, 3.4); L.cam.lookAt(0, 1.3, 0); L.cam.fov = 26; }; },
} };
