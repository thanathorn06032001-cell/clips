// 3D ring + chibi boxers for มวยไลฟ์ (three.js). Game logic stays in index.html; this only draws.
import * as THREE from './three.module.min.js';

const W = 720, H = 1280, RING = 11.5, HALF = RING / 2;
const cvs = document.getElementById('c3');
let R;
try {
  R = new THREE.WebGLRenderer({ canvas: cvs, antialias: true, powerPreference: 'high-performance' });
} catch (e) { console.warn('no webgl', e); }
if (R) init();

function init() {
  R.setPixelRatio(1); R.setSize(W, H, false);
  R.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, W / H, 0.1, 300);
  cam.position.set(0, 24, 27); cam.lookAt(0, 1.6, -0.5);

  // ---------- helpers ----------
  const MATS = {};
  const mat = (c, o = {}) => { const k = c + JSON.stringify(o); return MATS[k] || (MATS[k] = new THREE.MeshLambertMaterial({ color: c, ...o })); };
  const G = {
    sph: new THREE.SphereGeometry(1, 22, 16),
    sphLo: new THREE.SphereGeometry(1, 10, 8),
    cap: new THREE.CapsuleGeometry(1, 1, 4, 10),
    cyl: new THREE.CylinderGeometry(1, 1, 1, 18),
    box: new THREE.BoxGeometry(1, 1, 1),
    hair: new THREE.SphereGeometry(1, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
    torus: new THREE.TorusGeometry(1, 0.09, 8, 28),
  };
  const mesh = (g, m, s, p, parent) => { const o = new THREE.Mesh(g, m); if (s) o.scale.set(...s); if (p) o.position.set(...p); if (parent) parent.add(o); return o; };
  function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }

  // ---------- sky / arena ----------
  scene.background = canvasTex(4, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0d0820'); g.addColorStop(.55, '#2a1240'); g.addColorStop(1, '#120a22'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
  scene.fog = new THREE.Fog(0x1a0e30, 30, 70);
  scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x3a2050, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.9); sun.position.set(5, 14, 9); scene.add(sun);
  const rim = new THREE.DirectionalLight(0xff8ad0, 0.7); rim.position.set(-8, 6, -10); scene.add(rim);

  mesh(new THREE.PlaneGeometry(200, 200), mat(0x1c1230), null, [0, -1.2, 0], scene).rotation.x = -Math.PI / 2;

  // ring platform (floor texture + apron text)
  const floorTex = canvasTex(1024, 1024, (x, w, h) => {
    const g = x.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, w * .72); g.addColorStop(0, '#3d8cff'); g.addColorStop(1, '#1d5ad0'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(255,255,255,.07)'; x.lineWidth = 3; for (let i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(i * w / 8, 0); x.lineTo(i * w / 8, h); x.stroke(); x.beginPath(); x.moveTo(0, i * h / 8); x.lineTo(w, i * h / 8); x.stroke(); }
    x.strokeStyle = 'rgba(255,255,255,.28)'; x.lineWidth = 14; x.beginPath(); x.arc(w / 2, h / 2, 190, 0, 7); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.26)'; x.font = '900 150px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('LIVE', w / 2, h / 2 + 6);
  });
  const apronDraw = (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#ff2a44'); g.addColorStop(1, '#a8081c'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = '#ffd23a'; x.fillRect(0, 0, w, 7);
    x.fillStyle = '#fff'; x.font = '700 62px Mitr, Chonburi, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('สังเวียนไลฟ์ • LIVE BOXING', w / 2, h / 2 + 6);
  };
  const apronTex = canvasTex(1024, 128, apronDraw);
  try { document.fonts.ready.then(() => { const c = apronTex.image; apronDraw(c.getContext('2d'), c.width, c.height); apronTex.needsUpdate = true; }); } catch (e) {}
  const apronSide = mat(0x8a0a1c);
  const plat = new THREE.Mesh(new THREE.BoxGeometry(RING + 1.2, 1.2, RING + 1.2), [apronSide, apronSide, new THREE.MeshLambertMaterial({ map: floorTex }), apronSide, new THREE.MeshLambertMaterial({ map: apronTex }), apronSide]);
  plat.position.y = -0.6; scene.add(plat);
  // posts + ropes
  const PC = [[-1, -1, 0xe8203a], [1, -1, 0x2f74e0], [1, 1, 0xffffff], [-1, 1, 0xffffff]];
  const P = HALF + 0.35;
  PC.forEach(([sx, sz, c]) => { mesh(G.cyl, mat(c), [.16, 1.9, .16], [sx * P, .95, sz * P], scene); mesh(G.cyl, mat(0xffd23a), [.2, .12, .2], [sx * P, 1.92, sz * P], scene); });
  const ropeC = [0xffffff, 0xe8203a, 0x2f74e0];
  [.55, 1.05, 1.55].forEach((y, i) => {
    const m = mat(ropeC[i], { emissive: ropeC[i], emissiveIntensity: .15 });
    for (let k = 0; k < 4; k++) {
      const a = PC[k], b = PC[(k + 1) % 4], ax = a[0] * P, az = a[1] * P, bx = b[0] * P, bz = b[1] * P, len = Math.hypot(bx - ax, bz - az);
      const r = mesh(G.cyl, m, [.055, len, .055], [(ax + bx) / 2, y, (az + bz) / 2], scene);
      r.rotation.z = Math.PI / 2; r.rotation.y = -Math.atan2(bz - az, bx - ax);
    }
  });
  // stands with instanced crowd (behind + sides)
  const seats = [];
  for (let row = 0; row < 5; row++) {
    const d = HALF + 3.2 + row * 1.5, y = -0.4 + row * 0.9;
    mesh(G.box, mat(row % 2 ? 0x2a1a44 : 0x241638), [d * 2 + 6, .9, 1.5], [0, y - .45, -d], scene);
    for (let x = -d - 2.5; x <= d + 2.5; x += 0.85) seats.push([x + (row % 2) * .4, y, -d]);
    for (const s of [-1, 1]) { mesh(G.box, mat(row % 2 ? 0x2a1a44 : 0x241638), [1.5, .9, d * 2], [s * d, y - .45, 0], scene); for (let z = -d + 1; z <= d - 1; z += 0.85) seats.push([s * d, y, z]); }
  }
  const CC = [0xff5a8a, 0xffd23a, 0x4fc3ff, 0x7dff8a, 0xffffff, 0xff8a2a, 0xb07aff, 0xf6d2ad];
  const crowdBody = new THREE.InstancedMesh(G.sphLo, new THREE.MeshLambertMaterial(), seats.length);
  const crowdHead = new THREE.InstancedMesh(G.sphLo, new THREE.MeshLambertMaterial(), seats.length);
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V3 = new THREE.Vector3(), SC = new THREE.Vector3(), col = new THREE.Color();
  const skins = [0xf6d2ad, 0xe8b88a, 0xd9a070];
  seats.forEach((p, i) => { crowdBody.setColorAt(i, col.set(CC[i * 7 % CC.length])); crowdHead.setColorAt(i, col.set(skins[i % 3])); });
  scene.add(crowdBody, crowdHead);
  const crowdPh = seats.map(() => Math.random() * 7);
  function crowdTick(t, hype) {
    seats.forEach((p, i) => {
      const j = Math.max(0, Math.sin(t * (hype ? 9 : 4) + crowdPh[i])) * (hype ? .35 : .12);
      M4.compose(V3.set(p[0], p[1] + .35 + j, p[2]), Q.identity(), SC.set(.26, .34, .22)); crowdBody.setMatrixAt(i, M4);
      M4.compose(V3.set(p[0], p[1] + .78 + j, p[2]), Q, SC.set(.19, .19, .19)); crowdHead.setMatrixAt(i, M4);
    });
    crowdBody.instanceMatrix.needsUpdate = crowdHead.instanceMatrix.needsUpdate = true;
  }
  // festival bunting + bulbs above back stands
  const flagG = new THREE.ConeGeometry(.28, .55, 3); flagG.rotateX(Math.PI);
  const bulbs = [];
  for (let k = 0; k < 2; k++) {
    const z = -HALF - 4 - k * 4, y0 = 6.5 + k * 1.2;
    for (let i = 0; i <= 26; i++) {
      const x = -15 + i * (30 / 26), y = y0 - Math.sin(i / 26 * Math.PI) * 1.4;
      mesh(flagG, mat(CC[(i + k * 3) % 6]), null, [x, y - .35, z], scene);
      bulbs.push(mesh(G.sphLo, new THREE.MeshBasicMaterial({ color: 0xfff0b0 }), [.1, .1, .1], [x, y, z + .05], scene));
    }
  }
  // spotlight cones (additive)
  const beamM = new THREE.MeshBasicMaterial({ color: 0xfff2cc, transparent: true, opacity: .08, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const beams = [-1, 1].map(s => { const g = new THREE.ConeGeometry(3.2, 18, 20, 1, true); g.translate(0, -9, 0); const b = mesh(g, beamM, null, [s * 7, 16, -2], scene); return b; });

  // ---------- shared fighter parts ----------
  const blobTex = canvasTex(64, 64, (x) => { const g = x.createRadialGradient(32, 32, 2, 32, 32, 32); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
  const blobM = new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false });
  const glowTex = canvasTex(64, 64, (x) => { const g = x.createRadialGradient(32, 32, 2, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
  const planeG = new THREE.PlaneGeometry(1, 1);
  const black = mat(0x1a0f0a), white = mat(0xffffff), red = mat(0xd81828), gold = mat(0xffc430, { emissive: 0x6a4000 }), gloveRed = mat(0xe0142a, { emissive: 0x300000 });
  const UP = new THREE.Vector3(0, 1, 0);

  function makeF(f) {
    const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
    const skin = new THREE.MeshLambertMaterial({ color: f.skin }), trunk = new THREE.MeshLambertMaterial({ color: f.trunk });
    const o = { root, body, skin, trunk };
    const sh = mesh(planeG, blobM, [1.3, 1.3, 1], [0, .02, 0], root); sh.rotation.x = -Math.PI / 2; o.shadow = sh;
    // legs + shoes
    o.legs = [-1, 1].map(s => { const g = new THREE.Group(); g.position.set(s * .14, .42, 0); body.add(g); mesh(G.cap, skin, [.1, .16, .1], [0, -.2, 0], g); mesh(G.sph, white, [.13, .08, .19], [0, -.38, .04], g); return g; });
    mesh(G.cyl, trunk, [.29, .26, .25], [0, .5, 0], body);
    mesh(G.torus, white, [.29, .29, .4], [0, .63, 0], body).rotation.x = Math.PI / 2;
    mesh(G.sph, skin, [.3, .3, .23], [0, .8, 0], body);
    // head
    const head = new THREE.Group(); head.position.set(0, 1.28, 0); body.add(head); o.head = head;
    mesh(G.sph, skin, [.44, .42, .42], [0, 0, 0], head);
    const hair = mesh(G.hair, mat(f.hair), [.455, .44, .45], [0, .06, -.1], head); hair.rotation.x = -1.0;
    const mg = mesh(G.torus, white, [.44, .44, .55], [0, .13, 0], head); mg.rotation.x = Math.PI / 2 - .3;
    mesh(G.torus, red, [.445, .445, .25], [0, .13, 0], head).rotation.x = Math.PI / 2 - .3;
    mesh(G.sph, red, [.06, .16, .04], [0, .2, -.44], head);
    o.eyes = [-1, 1].map(s => { const e = new THREE.Group(); e.position.set(s * .15, .02, .37); head.add(e); mesh(G.sph, black, [.07, .085, .05], null, e); mesh(G.sph, white, [.025, .025, .02], [.02, .03, .04], e); return e; });
    o.xeyes = [-1, 1].map(s => { const e = new THREE.Group(); e.position.set(s * .15, .02, .4); head.add(e); [-1, 1].forEach(r => { const b = mesh(G.box, black, [.16, .035, .02], null, e); b.rotation.z = r * .8; }); e.visible = false; return e; });
    [-1, 1].forEach(s => { const b = mesh(G.box, black, [.12, .03, .03], [s * .15, .14, .39], head); b.rotation.z = s * -.25; });
    mesh(G.box, mat(0x7a2a1a), [.12, .03, .02], [0, -.17, .4], head);
    mesh(G.sph, mat(0xff8a8a), [.06, .035, .02], [-.27, -.07, .32], head); mesh(G.sph, mat(0xff8a8a), [.06, .035, .02], [.27, -.07, .32], head);
    // arms + gloves
    o.arms = [-1, 1].map(s => mesh(G.cap, skin, [.07, .2, .07], null, body));
    o.gloves = [-1, 1].map(s => { const g = new THREE.Group(); body.add(g); o['gm' + s] = mesh(G.sph, gloveRed, [.21, .2, .23], null, g); mesh(G.cyl, white, [.13, .08, .13], [0, 0, -.2], g).rotation.x = Math.PI / 2; return g; });
    // weapons on right glove
    const wg = o.gloves[1];
    o.pan = new THREE.Group(); wg.add(o.pan); mesh(G.cyl, mat(0x5a3a1a), [.04, .45, .04], [0, .25, .1], o.pan).rotation.x = .4; const pd = mesh(G.cyl, mat(0x222222), [.32, .06, .32], [0, .55, .25], o.pan); pd.rotation.x = 1.3; mesh(G.cyl, mat(0xffc040), [.12, .07, .12], [0, .56, .27], o.pan).rotation.x = 1.3;
    o.hammer = new THREE.Group(); wg.add(o.hammer); mesh(G.cyl, mat(0xffd23a), [.04, .6, .04], [0, .32, 0], o.hammer); mesh(G.cyl, mat(0xff4f9a), [.17, .45, .17], [0, .66, 0], o.hammer).rotation.z = Math.PI / 2;
    o.fish = new THREE.Group(); wg.add(o.fish); mesh(G.sph, mat(0x7fa8c8), [.13, .45, .1], [0, .45, .05], o.fish); const tail = mesh(new THREE.ConeGeometry(.15, .2, 3), mat(0x6a90b0), null, [0, .02, .05], o.fish); tail.rotation.x = Math.PI;
    // crown, shield, glow
    o.crown = new THREE.Group(); o.crown.position.set(0, .45, 0); head.add(o.crown); mesh(G.cyl, gold, [.24, .12, .24], null, o.crown); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; mesh(new THREE.ConeGeometry(.06, .16, 6), gold, null, [Math.cos(a) * .2, .13, Math.sin(a) * .2], o.crown); }
    o.shield = mesh(G.sph, new THREE.MeshBasicMaterial({ color: 0xfff0b0, transparent: true, opacity: .18, blending: THREE.AdditiveBlending, depthWrite: false }), [.95, 1.05, .95], [0, .85, 0], root);
    o.glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xff7a1a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: .7 })); o.glow.scale.set(2.4, 2.8, 1); o.glow.position.y = .9; root.add(o.glow);
    o.face = f.dir > 0 ? Math.PI / 2 : -Math.PI / 2; o.px = null; o.walk = 0;
    scene.add(root); return o;
  }

  const objs = new Map();
  const toW = (u, v) => [(u - .5) * RING, (v - .5) * RING];
  const vA = new THREE.Vector3(), vB = new THREE.Vector3();
  function proj(x, y, z) { vA.set(x, y, z).project(cam); return [(vA.x + 1) / 2 * W, (1 - vA.y) / 2 * H]; }
  function toXY(u, v) { const [x, z] = toW(u, v); return proj(x, 0, z); }
  function scl(v) { const [, z] = toW(.5, v); const a = proj(0, 0, z), b = proj(0, 1.62, z); return (a[1] - b[1]) / 122; }
  const setArm = (arm, a, b) => { vB.subVectors(b, a); const len = vB.length(); arm.position.copy(a).addScaledVector(vB, .5); arm.quaternion.setFromUnitVectors(UP, vB.normalize()); arm.scale.set(.07, Math.max(.01, len / 3), .07); };
  const sh = new THREE.Vector3(), gl = new THREE.Vector3();

  function render(S, dt) {
    const t = S.t, fight = S.phase === 'fight';
    crowdTick(t, fight);
    bulbs.forEach((b, i) => { b.material.color.setHSL(((i * .13 + t * .3) % 1), 1, (i + Math.floor(t * 3)) % 3 ? .55 : .85); });
    beams[0].rotation.z = Math.sin(t * .6) * .35 - .25; beams[1].rotation.z = Math.sin(t * .6 + 2) * .35 + .25;
    const seen = new Set();
    for (const f of S.f) {
      seen.add(f.id);
      let o = objs.get(f.id); if (!o) { o = makeF(f); objs.set(f.id, o); }
      const [x, z] = toW(f.u, f.v);
      const moved = o.px == null ? 0 : Math.hypot(x - o.px, z - o.pz); o.px = x; o.pz = z;
      o.walk += moved * 9;
      o.root.position.set(x, 0, z);
      const gs = f.giant ? 1.6 : 1; o.root.scale.setScalar(gs);
      // facing
      let want = o.face;
      if (f._tg && !f._tg.ko && S.f.includes(f._tg)) { const [tx, tz] = toW(f._tg.u, f._tg.v); want = Math.atan2(tx - x, tz - z); }
      else if (moved > .002) want = Math.atan2(x - (o.lx ?? x), z - (o.lz ?? z)) || want;
      else want = f.dir > 0 ? Math.PI / 2 - .5 : -Math.PI / 2 + .5;
      o.lx = x; o.lz = z;
      const camA = 0; let wb = want + Math.atan2(Math.sin(camA - want), Math.cos(camA - want)) * .35; let d = wb - o.face; d = Math.atan2(Math.sin(d), Math.cos(d)); o.face += d * Math.min(1, dt * 10); o.root.rotation.y = o.face;
      // body anim
      const b = o.body;
      if (f.ko) {
        const k = Math.min(1, (t - f.koT) * 3.5); b.rotation.set(-Math.PI / 2 * k, 0, 0); b.position.set(0, .28 * k + Math.sin(k * Math.PI) * .6, -.2 * k);
        o.eyes.forEach(e => e.visible = false); o.xeyes.forEach(e => e.visible = true);
      } else {
        const bob = Math.abs(Math.sin(t * 7 + f.u * 20)) * .06;
        const hitLean = f.hit > 0 ? -f.hit * .9 : 0;
        b.rotation.set(hitLean + (fight ? .12 : 0), 0, f.hit > 0 ? Math.sin(t * 50) * .08 : 0); b.position.set(0, bob, f.hit > 0 ? -f.hit * .3 : 0);
        o.eyes.forEach(e => e.visible = true); o.xeyes.forEach(e => e.visible = false);
      }
      o.head.rotation.x = f.ko ? 0 : -.32;
      const sw = moved > .002 && !f.ko ? Math.sin(o.walk) * .7 : 0;
      o.legs[0].rotation.x = sw; o.legs[1].rotation.x = -sw;
      // gloves
      const pz = f.punch > 0 ? Math.sin(f.punch * Math.PI) : 0;
      const guard = fight || f.enter ? 1 : .6;
      [[-1, 0], [1, 1]].forEach(([s, i]) => {
        const ext = i === 1 ? pz : 0;
        gl.set(s * (.27 - ext * .12), .88 + guard * .14 + ext * .05 + Math.sin(t * 6 + s) * .03, .26 + guard * .1 + ext * .62);
        o.gloves[i].position.copy(gl); o.gloves[i].rotation.x = ext * .3;
        sh.set(s * .27, .9, .02); setArm(o.arms[i], sh, gl);
      });
      const gm = f.weap === 'gold' || f.weap === 'knuckle' ? gold : gloveRed; o['gm-1'].material = gm; o['gm1'].material = gm;
      const gsz = f.weap === 'gold' ? 1.25 : 1; o.gloves.forEach(g => g.scale.setScalar(gsz));
      o.pan.visible = f.weap === 'pan'; o.hammer.visible = f.weap === 'hammer'; o.fish.visible = f.weap === 'fish';
      o.crown.visible = !f.ko && (f.crown > 0 || !!f.isChamp);
      o.shield.visible = !f.ko && f.shield > 0; o.shield.material.opacity = .14 + .08 * Math.sin(t * 6);
      o.glow.visible = !f.ko && f.pow > 0; o.glow.material.opacity = .45 + .25 * Math.sin(t * 10);
      const fl = f.hit > 0 ? f.hit * 2.2 : 0; o.skin.emissive.setRGB(fl, fl, fl); o.trunk.emissive.setRGB(fl * .6, fl * .6, fl * .6);
      o.root.visible = !(f.ko && t - f.koT > 2.6 && Math.floor(t * 12) % 2);
    }
    for (const [id, o] of objs) if (!seen.has(id)) { scene.remove(o.root); o.skin.dispose(); o.trunk.dispose(); o.shield.material.dispose(); o.glow.material.dispose(); objs.delete(id); }
    R.render(scene, cam);
  }
  window.G3 = { toXY, scl, render, THREE };
  window.dispatchEvent(new Event('g3ready'));
}
