// tiny example episode: 2 shots, subtitles come from timeline.json if present
export default {
  shots: {
    a: (L) => { L.corridor(); const p = L.avatar({ mood: "normal" }); p.scale.setScalar(L.HUM); L.scene.add(p);
      return (t) => { p.position.set(0, 0, -3 + Math.min(t, 2) * 1.5); L.walkPose(p, t * 7.5, t < 2 ? 1 : 0); L.cam.position.set(0.25, 1.45, 3.2); L.cam.lookAt(0, 1.2, -1); L.cam.fov = 42; }; },
    b: (L) => { L.corridor(); const p = L.avatar({ mood: "shock" }); p.scale.setScalar(L.HUM); p.position.set(0, 0, 0.3); L.scene.add(p);
      return (t) => { L.cam.position.set(-0.2, 1.55, 2.2 - t * 0.2); L.cam.lookAt(0, 1.45, 0.3); L.cam.fov = 36; }; },
  },
  fx: [{ type: "card", t: 2.2, end: 3.5, text: "03:00" }, { type: "flash", t: 2.0, d: 0.12 }, { type: "shake", t: 2.2, a: 25 }],
};
