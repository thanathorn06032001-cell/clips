// What-if flat 2D library: original characters, cats, Thai sets, UI cards. All SVG strings, 1080x1920 canvas.
const O = "#3E3029", SK = "#F2C9A5", SKD = "#DFAE88", HAIR = "#4A3226";
const W = 1080, H = 1920;
function line2(pts, w, col) { const d = "M" + pts.map((p) => p.join(" ")).join(" L"); return `<path d="${d}" fill="none" stroke="${O}" stroke-width="${w + 7}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`; }
const sw = `stroke="${O}" stroke-width="4" stroke-linejoin="round"`;

// ---------- person (original lead "ต้น": spiky black hair, round face) ----------
// pose: stand | shock | wave | hold | sit | point ; mood: smile | shock | tired | worry | talk | happy
function face(mood, hy) {
  let s = "";
  const ex = 24, ey = hy + 6;
  if (mood === "shock") s += `<g ${sw}><circle cx="${-ex}" cy="${ey}" r="13" fill="#fff"/><circle cx="${ex}" cy="${ey}" r="13" fill="#fff"/></g><circle cx="${-ex}" cy="${ey + 1}" r="5" fill="${O}"/><circle cx="${ex}" cy="${ey + 1}" r="5" fill="${O}"/>`;
  else if (mood === "tired") s += `<path d="M${-ex - 11} ${ey} Q${-ex} ${ey + 6} ${-ex + 11} ${ey} M${ex - 11} ${ey} Q${ex} ${ey + 6} ${ex + 11} ${ey}" fill="none" stroke="${O}" stroke-width="4" stroke-linecap="round"/><path d="M${-ex - 12} ${ey + 12} Q${-ex} ${ey + 18} ${-ex + 10} ${ey + 12} M${ex - 10} ${ey + 12} Q${ex} ${ey + 18} ${ex + 12} ${ey + 12}" fill="none" stroke="#9C7BA8" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
  else if (mood === "blink") s += `<path d="M${-ex - 10} ${ey} L${-ex + 10} ${ey} M${ex - 10} ${ey} L${ex + 10} ${ey}" stroke="${O}" stroke-width="5" stroke-linecap="round"/>`;
  else if (mood === "happy") s += `<path d="M${-ex - 10} ${ey + 3} Q${-ex} ${ey - 9} ${-ex + 10} ${ey + 3} M${ex - 10} ${ey + 3} Q${ex} ${ey - 9} ${ex + 10} ${ey + 3}" fill="none" stroke="${O}" stroke-width="5" stroke-linecap="round"/>`;
  else s += `<ellipse cx="${-ex}" cy="${ey}" rx="6.5" ry="9" fill="${O}"/><ellipse cx="${ex}" cy="${ey}" rx="6.5" ry="9" fill="${O}"/><circle cx="${-ex + 2}" cy="${ey - 3}" r="2.2" fill="#fff"/><circle cx="${ex + 2}" cy="${ey - 3}" r="2.2" fill="#fff"/>`;
  const by = ey - 22, up = mood === "shock" ? -8 : 0, tl = mood === "worry" || mood === "tired" ? 6 : 0;
  s += `<path d="M${-ex - 14} ${by + up + tl} L${-ex + 10} ${by + up - tl} M${ex - 10} ${by + up - tl} L${ex + 14} ${by + up + tl}" stroke="${O}" stroke-width="5" stroke-linecap="round"/>`;
  s += `<ellipse cx="-42" cy="${hy + 32}" rx="13" ry="7" fill="#F09A9A" opacity=".55"/><ellipse cx="42" cy="${hy + 32}" rx="13" ry="7" fill="#F09A9A" opacity=".55"/>`;
  const my = hy + 40;
  if (mood === "shock") s += `<ellipse cx="0" cy="${my + 4}" rx="11" ry="15" fill="#7A2E2E" ${sw}/>`;
  else if (mood === "talk") s += `<path d="M-13 ${my} Q0 ${my + 18} 13 ${my} Z" fill="#7A2E2E" ${sw}/>`;
  else if (mood === "smile" || mood === "happy") s += `<path d="M-14 ${my - 2} Q0 ${my + 12} 14 ${my - 2}" fill="none" stroke="${O}" stroke-width="4.5" stroke-linecap="round"/>`;
  else if (mood === "worry") s += `<path d="M-12 ${my + 6} Q0 ${my - 4} 12 ${my + 6}" fill="none" stroke="${O}" stroke-width="4.5" stroke-linecap="round"/>`;
  else s += `<path d="M-11 ${my + 2} L11 ${my + 2}" stroke="${O}" stroke-width="4.5" stroke-linecap="round"/>`;
  return s;
}
function head(hy, mood, hair = HAIR) {
  return `<g ${sw}><circle cx="-64" cy="${hy + 10}" r="13" fill="${SK}"/><circle cx="64" cy="${hy + 10}" r="13" fill="${SK}"/><ellipse cx="0" cy="${hy}" rx="66" ry="70" fill="${SK}"/></g>
  <path d="M-70 ${hy + 6} Q-78 ${hy - 84} 4 ${hy - 86} Q76 ${hy - 82} 70 ${hy + 6} Q66 ${hy - 30} 40 ${hy - 40} Q6 ${hy - 26} -22 ${hy - 50} Q-34 ${hy - 20} -60 ${hy - 26} Q-66 ${hy - 10} -70 ${hy + 6} Z" fill="${hair}" ${sw}/>
  <path d="M-4 ${hy - 84} Q-2 ${hy - 120} 26 ${hy - 118} Q6 ${hy - 108} 12 ${hy - 86}" fill="${hair}" ${sw}/>
  ${face(mood, hy)}
  <g fill="none" stroke="${O}" stroke-width="4.5"><circle cx="-24" cy="${hy + 6}" r="21"/><circle cx="24" cy="${hy + 6}" r="21"/><path d="M-3 ${hy + 4} Q0 ${hy} 3 ${hy + 4} M-45 ${hy + 2} L-64 ${hy - 2} M45 ${hy + 2} L64 ${hy - 2}"/></g>`;
}
function person({ x, y, s = 1, pose = "stand", mood = "smile", shirt = "#F2B63D", shorts = "#2E3A5C", flip = false, item = "", t = null, talk = false, walk = 0 }) {
  if (t !== null) {
    if (talk && mood !== "shock") mood = Math.floor(t * 9) % 2 ? "talk" : (mood === "talk" ? "smile" : mood);
    if (mood !== "shock" && mood !== "happy" && ((t * 1.0 + x * 0.001) % 3.3) < 0.12) mood = "blink";
  }
  let g = "", up = pose === "sit" ? 150 : 0;
  const hipY = -200 + up, shY = -325 + up, hy = -410 + up;
  // legs
  if (pose === "sit") {
    g += line2([[-22, hipY + 10], [-58, hipY - 50], [-66, -14]], 24, SK) + line2([[22, hipY + 10], [58, hipY - 50], [66, -14]], 24, SK);
    g += `<ellipse cx="-74" cy="-10" rx="26" ry="11" fill="#FFFFFF" ${sw}/><ellipse cx="74" cy="-10" rx="26" ry="11" fill="#FFFFFF" ${sw}/>`;
  } else {
    const sw_ = walk ? Math.sin(walk * Math.PI * 2) * 22 : 0, lf = walk ? Math.max(0, Math.sin(walk * Math.PI * 2)) * 14 : 0, rf = walk ? Math.max(0, -Math.sin(walk * Math.PI * 2)) * 14 : 0;
    g += line2([[-22, hipY], [-25 + sw_, -16 - lf]], 24, SK) + line2([[22, hipY], [25 - sw_, -16 - rf]], 24, SK);
    if (walk) g += `<g transform="translate(${sw_} ${-lf})"><ellipse cx="-32" cy="-9" rx="27" ry="12" fill="#FFFFFF" ${sw}/></g><g transform="translate(${-sw_} ${-rf})"><ellipse cx="32" cy="-9" rx="27" ry="12" fill="#FFFFFF" ${sw}/></g>`; else
    g += `<ellipse cx="-32" cy="-9" rx="27" ry="12" fill="#FFFFFF" ${sw}/><ellipse cx="32" cy="-9" rx="27" ry="12" fill="#FFFFFF" ${sw}/><path d="M-50 -10 L-16 -10 M16 -10 L50 -10" stroke="#3FA37A" stroke-width="5"/>`;
  }
  // shorts with hearts pattern-ish dots
  g += `<path d="M-54 ${hipY - 22} L54 ${hipY - 22} L56 ${hipY + 48} L6 ${hipY + 48} L0 ${hipY + 20} L-6 ${hipY + 48} L-56 ${hipY + 48} Z" fill="${shorts}" ${sw}/>`;
  g += `<path d="M-50 ${hipY + 34} L-8 ${hipY + 34} M8 ${hipY + 34} L50 ${hipY + 34}" stroke="#3F4D73" stroke-width="5"/>`;
  // arms (behind torso first for some poses)
  const A = {
    stand: [[[-50, shY + 8], [-66, shY + 80], [-60, shY + 148]], [[50, shY + 8], [66, shY + 80], [60, shY + 148]]],
    shock: [[[-50, shY + 8], [-104, shY - 40], [-92, shY - 110]], [[50, shY + 8], [104, shY - 40], [92, shY - 110]]],
    wave: [[[-50, shY + 8], [-66, shY + 80], [-60, shY + 148]], [[50, shY + 8], [110, shY - 30], [118, shY - 110]]],
    hold: [[[-50, shY + 8], [-70, shY + 75], [-26, shY + 70]], [[50, shY + 8], [70, shY + 75], [26, shY + 70]]],
    point: [[[-50, shY + 8], [-66, shY + 80], [-60, shY + 148]], [[50, shY + 8], [120, shY + 10], [190, shY - 10]]],
    sit: [[[-50, shY + 8], [-78, shY + 70], [-60, shY + 118]], [[50, shY + 8], [78, shY + 70], [60, shY + 118]]],
    head: [[[-50, shY + 8], [-100, shY - 40], [-50, shY - 120]], [[50, shY + 8], [100, shY - 40], [50, shY - 120]]],
  }[pose] || [];
  const armSvg = A.map((a) => line2(a, 20, SK) + `<circle cx="${a[2][0]}" cy="${a[2][1]}" r="14" fill="${SK}" ${sw}/>`).join("");
  // torso
  g += `<rect x="-56" y="${shY - 16}" width="112" height="${hipY - shY + 4}" rx="34" fill="${shirt}" ${sw}/>`;
  g += `<path d="M-20 ${shY - 14} Q0 ${shY + 8} 20 ${shY - 14}" fill="none" stroke="${O}" stroke-width="4"/><rect x="14" y="${shY + 22}" width="30" height="30" rx="4" fill="#2E8C86" ${sw}/>`;
  g += `<rect x="-16" y="${shY - 34}" width="32" height="26" fill="${SKD}" ${sw}/>`;
  const headSvg = head(hy, mood);
  const itemSvg = item;
  const by = t !== null ? Math.sin(t * 2.4 + x) * 0.012 : 0, bob = walk ? -Math.abs(Math.sin(walk * Math.PI * 2)) * 10 : 0;
  return `<g transform="translate(${x} ${y + bob}) scale(${flip ? -s : s} ${s * (1 + by)})"><ellipse cx="0" cy="0" rx="${pose === "sit" ? 120 : 70}" ry="14" fill="#000" opacity=".12"/>${g}${pose === "head" ? headSvg + armSvg : armSvg + headSvg}${itemSvg}</g>`;
}

// ---------- cat (sitting, front view) ----------
const CATC = { orange: ["#EFA555", "#C9772E", "#FBE3C4"], black: ["#36313A", "#221E25", "#4C4652"], white: ["#F7F2EA", "#D9D0C4", "#FFFFFF"], grey: ["#A3A9B2", "#7C838D", "#D6DADF"], calico: ["#F7F2EA", "#E59A4A", "#4A403E"] };
function cat({ x, y, s = 1, col = "orange", mood = "calm", flip = false, tie = false, t = null, talk = false }) {
  const [c, d, l] = CATC[col]; let g = "";
  if (t !== null) { if (talk) mood = Math.floor(t * 8 + x) % 2 ? (mood === "angry" ? "angry" : "talk") : (mood === "talk" || mood === "angry" ? "calm" : mood); if (mood !== "sleepy" && mood !== "smug" && ((t + x * 0.0013) % 2.9) < 0.12) mood = "sleepy"; }
  g += `<ellipse cx="0" cy="0" rx="62" ry="10" fill="#000" opacity=".12"/>`;
  g += `<path d="M48 -16 Q120 -20 108 -90 Q104 -118 84 -112" fill="none" stroke="${O}" stroke-width="24" stroke-linecap="round"/><path d="M48 -16 Q120 -20 108 -90 Q104 -118 84 -112" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round"/>`;
  g += `<path d="M-52 0 Q-62 -60 -38 -104 Q0 -128 38 -104 Q62 -60 52 0 Z" fill="${c}" ${sw}/>`;
  g += `<path d="M-22 0 Q-26 -50 0 -70 Q26 -50 22 0 Z" fill="${l}"/>`;
  if (col === "orange") g += `<path d="M-46 -60 L-30 -56 M-50 -40 L-34 -38 M46 -60 L30 -56 M50 -40 L34 -38" stroke="${d}" stroke-width="6" stroke-linecap="round"/>`;
  if (col === "calico") g += `<path d="M-50 -30 Q-40 -70 -20 -60 Q-30 -30 -50 -10Z" fill="${d}"/><path d="M30 -90 Q50 -70 50 -40 Q36 -60 22 -86Z" fill="${l}"/>`;
  g += `<path d="M-30 -2 Q-30 -26 -16 -26 Q-4 -26 -6 -2 Z M30 -2 Q30 -26 16 -26 Q4 -26 6 -2 Z" fill="${c}" ${sw}/>`;
  if (tie) g += `<path d="M-6 -104 L6 -104 L12 -60 L0 -46 L-12 -60Z" fill="#C0392B" ${sw}/><path d="M-30 -110 L0 -100 L30 -110" fill="none" stroke="#fff" stroke-width="10"/>`;
  // head
  const hy = -150;
  g += `<path d="M-50 ${hy - 14} L-46 ${hy - 72} L-12 ${hy - 44} Z M50 ${hy - 14} L46 ${hy - 72} L12 ${hy - 44} Z" fill="${c}" ${sw}/><path d="M-42 ${hy - 26} L-41 ${hy - 56} L-22 ${hy - 42} Z M42 ${hy - 26} L41 ${hy - 56} L22 ${hy - 42} Z" fill="#F2A7B0"/>`;
  g += `<ellipse cx="0" cy="${hy}" rx="60" ry="52" fill="${c}" ${sw}/>`;
  if (col === "orange") g += `<path d="M-14 ${hy - 50} L-10 ${hy - 32} M0 ${hy - 52} L0 ${hy - 30} M14 ${hy - 50} L10 ${hy - 32}" stroke="${d}" stroke-width="6" stroke-linecap="round"/>`;
  if (col === "calico") g += `<path d="M-60 ${hy} Q-58 ${hy - 46} -18 ${hy - 50} Q-30 ${hy - 20} -40 ${hy + 20} Z" fill="${d}" opacity=".95"/><path d="M58 ${hy - 6} Q56 ${hy - 40} 26 ${hy - 48} Q34 ${hy - 24} 30 ${hy} Z" fill="${l}"/>`;
  g += `<ellipse cx="0" cy="${hy + 22}" rx="28" ry="20" fill="${l}" opacity=".9"/>`;
  const ey = hy - 4, eye = col === "black" ? "#E9C64A" : "#7DBF6A";
  if (mood === "angry") g += `<path d="M-38 ${ey - 18} L-12 ${ey - 8} M38 ${ey - 18} L12 ${ey - 8}" stroke="${O}" stroke-width="6" stroke-linecap="round"/>`;
  if (mood === "smug" || mood === "sleepy") g += `<path d="M-34 ${ey} Q-24 ${ey - 8} -14 ${ey} M34 ${ey} Q24 ${ey - 8} 14 ${ey}" fill="none" stroke="${O}" stroke-width="5" stroke-linecap="round"/><path d="M-34 ${ey} L-14 ${ey} M34 ${ey} L14 ${ey}" stroke="${O}" stroke-width="4"/>`;
  else g += `<ellipse cx="-24" cy="${ey}" rx="12" ry="14" fill="${eye}" ${sw}/><ellipse cx="24" cy="${ey}" rx="12" ry="14" fill="${eye}" ${sw}/><ellipse cx="-24" cy="${ey}" rx="4" ry="11" fill="${O}"/><ellipse cx="24" cy="${ey}" rx="4" ry="11" fill="${O}"/><circle cx="-20" cy="${ey - 6}" r="3" fill="#fff"/><circle cx="28" cy="${ey - 6}" r="3" fill="#fff"/>`;
  g += `<path d="M-6 ${hy + 12} L6 ${hy + 12} L0 ${hy + 19} Z" fill="#E87F8E" stroke="${O}" stroke-width="2.5"/>`;
  if (mood === "talk" || mood === "angry") g += `<path d="M-12 ${hy + 22} Q0 ${hy + 46} 12 ${hy + 22} Q0 ${hy + 28} -12 ${hy + 22}Z" fill="#7A2E2E" ${sw}/>`;
  else g += `<path d="M-12 ${hy + 24} Q-6 ${hy + 31} 0 ${hy + 22} Q6 ${hy + 31} 12 ${hy + 24}" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>`;
  g += `<path d="M-30 ${hy + 16} L-76 ${hy + 8} M-30 ${hy + 24} L-74 ${hy + 28} M30 ${hy + 16} L76 ${hy + 8} M30 ${hy + 24} L74 ${hy + 28}" stroke="${O}" stroke-width="2.5" opacity=".7"/>`;
  const by = t !== null ? Math.sin(t * 3 + x) * 0.015 : 0;
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s * (1 + by)})">${g}</g>`;
}
// speech bubble (SVG); tail points to (tx,ty)
function bubble(x, y, text, tx, ty, size = 42, col = "#fff") {
  const w = text.length * size * 0.56 + 60, h = size + 46;
  const bx = x - w / 2, by = y - h / 2, cx = Math.max(bx + 40, Math.min(bx + w - 40, tx));
  const tailY = ty > y ? by + h : by;
  return `<g filter="url(#ds)"><path d="M${cx - 18} ${tailY} L${tx} ${ty} L${cx + 18} ${tailY} Z" fill="${col}" stroke="${O}" stroke-width="4"/><rect x="${bx}" y="${by}" width="${w}" height="${h}" rx="${h / 2}" fill="${col}" stroke="${O}" stroke-width="4"/><path d="M${cx - 15} ${tailY} L${cx + 15} ${tailY}" stroke="${col}" stroke-width="6"/>
  <text x="${x}" y="${y + size * 0.36}" text-anchor="middle" font-family="Kanit" font-weight="600" font-size="${size}" fill="${O}">${text}</text></g>`;
}
// ---------- sets ----------
const DEFS = `<defs><filter id="blur"><feGaussianBlur stdDeviation="3"/></filter><filter id="blur6"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="ds" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-opacity=".18"/></filter>
<radialGradient id="vig" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#2a1a10" stop-opacity=".38"/></radialGradient>
<linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8C4A9E"/><stop offset=".6" stop-color="#E77F8C"/><stop offset="1" stop-color="#F6C27A"/></linearGradient></defs>`;
function soi() {
  let g = `<rect width="${W}" height="${H}" fill="#E8D9C2"/>`;
  g += `<g filter="url(#blur)">`;
  for (const [x, c, sign, sc] of [[-40, "#EADBC6", "ข้าวมันไก่", "#F2B63D"], [520, "#E2CFB6", "ร้านชำ", "#D9443C"]]) {
    g += `<rect x="${x}" y="120" width="560" height="760" fill="${c}" stroke="#CDB89C" stroke-width="4"/>`;
    for (let i = 0; i < 4; i++) g += `<rect x="${x + 50 + i * 125}" y="200" width="90" height="200" fill="#B9C3C6" stroke="#8E8B85" stroke-width="5"/>` + [0, 1, 2, 3].map((k) => `<line x1="${x + 62 + i * 125 + k * 22}" y1="200" x2="${x + 62 + i * 125 + k * 22}" y2="400" stroke="#6E6A66" stroke-width="4"/>`).join("");
    g += `<rect x="${x}" y="470" width="560" height="110" fill="${sc}"/><text x="${x + 280}" y="545" text-anchor="middle" font-family="Kanit" font-weight="700" font-size="64" fill="#fff">${sign}</text>`;
    for (let i = 0; i < 8; i++) g += `<path d="M${x + i * 70} 580 L${x + i * 70 + 70} 580 L${x + i * 70 + 62} 650 L${x + i * 70 + 8} 650Z" fill="${i % 2 ? "#fff" : sc}"/>`;
    g += `<rect x="${x + 40}" y="650" width="480" height="230" fill="#7A6A5C"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => `<line x1="${x + 40}" y1="${670 + k * 24}" x2="${x + 520}" y2="${670 + k * 24}" stroke="#8C7B6C" stroke-width="5"/>`).join("");
  }
  g += `<path d="M0 60 Q540 140 1080 50 M0 90 Q540 175 1080 85" fill="none" stroke="#333" stroke-width="4"/></g>`;
  g += `<rect x="0" y="880" width="${W}" height="${H - 880}" fill="#B9AFA4"/><rect x="0" y="880" width="${W}" height="18" fill="#9F958A"/>`;
  // low wall where cats sit
  g += `<rect x="0" y="1040" width="${W}" height="230" fill="#D6CDBF" stroke="${O}" stroke-width="4"/><rect x="-10" y="1020" width="1100" height="34" fill="#E6DED2" stroke="${O}" stroke-width="4"/>`;
  for (let i = 0; i < 6; i++) g += `<line x1="${i * 200 + 90}" y1="1054" x2="${i * 200 + 90}" y2="1270" stroke="#C3B9AB" stroke-width="4"/>`;
  g += `<rect x="0" y="1270" width="${W}" height="${H - 1270}" fill="#A79B8E"/>`;
  return g;
}
function bedroom() {
  let g = `<rect width="${W}" height="${H}" fill="#EFD8CF"/><rect y="1180" width="${W}" height="${H - 1180}" fill="#B98F6E"/>` + [0, 1, 2, 3, 4, 5].map((k) => `<line x1="0" y1="${1240 + k * 120}" x2="${W}" y2="${1240 + k * 120}" stroke="#A97F60" stroke-width="5"/>`).join("");
  g += `<g filter="url(#blur)"><rect x="300" y="230" width="480" height="420" fill="#CFE6EE" stroke="#fff" stroke-width="16"/><line x1="540" y1="230" x2="540" y2="650" stroke="#fff" stroke-width="12"/>
  <path d="M260 200 Q300 420 270 700 L360 700 Q330 420 380 200Z M820 200 Q780 420 810 700 L720 700 Q750 420 700 200Z" fill="#6FB7AE"/><rect x="240" y="186" width="600" height="20" rx="10" fill="#8C6E58"/>
  <rect x="70" y="300" width="130" height="170" fill="#F4E6C8" stroke="#E07C8C" stroke-width="10"/><circle cx="135" cy="370" r="40" fill="#F2B63D"/>
  <circle cx="930" cy="330" r="56" fill="#fff" stroke="#D9443C" stroke-width="9"/><path d="M930 330 L930 292 M930 330 L956 344" stroke="${O}" stroke-width="6" stroke-linecap="round"/></g>`;
  // bed
  g += `<rect x="40" y="1020" width="1000" height="260" rx="30" fill="#8C6750" ${sw}/><rect x="60" y="930" width="960" height="190" rx="40" fill="#fff" ${sw}/>`;
  return g;
}
function livingroom(warm) {
  let g = `<rect width="${W}" height="${H}" fill="${warm ? "url(#sunset)" : "#E6DCCB"}"/><rect y="1250" width="${W}" height="${H - 1250}" fill="${warm ? "#7C5A66" : "#C4A88A"}"/>`;
  g += `<g filter="url(#blur)">`;
  if (warm) g += [[60, 380], [230, 300], [420, 420], [640, 330], [860, 400]].map(([x, h]) => `<rect x="${x}" y="${900 - h}" width="150" height="${h + 350}" fill="#5E3A63" opacity=".55"/>`).join("") + `<circle cx="760" cy="520" r="90" fill="#FFE2A6" opacity=".7"/>`;
  else g += `<rect x="130" y="330" width="200" height="150" fill="#F4E6C8" stroke="#8C6E58" stroke-width="10"/><path d="M150 460 L210 390 L260 440 L290 410 L320 460Z" fill="#6FB7AE"/><rect x="420" y="300" width="150" height="190" fill="#F4E6C8" stroke="#8C6E58" stroke-width="10"/><circle cx="495" cy="380" r="40" fill="#E89AA6"/><rect x="820" y="760" width="90" height="140" fill="#B07A54"/><circle cx="865" cy="700" r="90" fill="#7FB069"/><circle cx="820" cy="640" r="60" fill="#8DC07A"/>`;
  g += `</g>`;
  return g;
}
function sofa(x, y, w, col = "#6FB7AE") { return `<g ${sw}><rect x="${x}" y="${y - 260}" width="${w}" height="170" rx="40" fill="${col}"/><rect x="${x - 40}" y="${y - 170}" width="${w + 80}" height="120" rx="40" fill="${col}"/><rect x="${x - 60}" y="${y - 220}" width="80" height="200" rx="36" fill="${col}"/><rect x="${x + w - 20}" y="${y - 220}" width="80" height="200" rx="36" fill="${col}"/><rect x="${x - 20}" y="${y - 30}" width="24" height="40" fill="#5A4636"/><rect x="${x + w - 4}" y="${y - 30}" width="24" height="40" fill="#5A4636"/></g>`; }
const VIG = `<rect width="${W}" height="${H}" fill="url(#vig)"/>`;

// ---------- HTML overlays: card, subtitle, choice ----------
function card({ x, y, tag, big, lines, w = 520, icon = "", col = "#2E8C86", k = 1, rot = -2 }) {
  const body = big ? `<div class="big">${big}</div>` : `<div class="lines">${lines.map((l) => `<div>${l}</div>`).join("")}</div>`;
  const sc = k >= 1 ? 1 : 0.4 + 0.6 * (1 + 2.7 * Math.pow(k - 1, 3) + 1.7 * Math.pow(k - 1, 2));
  return k <= 0 ? "" : `<div class="card" style="left:${x}px;top:${y}px;width:${w}px;opacity:${Math.min(1, k * 4)};transform:rotate(${rot}deg) scale(${sc})"><div class="hd" style="background:${col}">${icon ? `<span>${icon}</span>` : ""}${tag}</div>${body}</div>`;
}
function sub(html, y = 1290) { return `<div class="sub" style="top:${y}px">${html}</div>`; }
function badge() { return `<div class="badge">เล่าเรื่อง2มิติ</div>`; }

// ---------- animation helpers ----------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lin = (t, a, b) => clamp((t - a) / (b - a));
const eo = (x) => 1 - Math.pow(1 - x, 3);
const back = (x) => (x >= 1 ? 1 : 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2));
// pop an SVG group in around (cx,cy): k 0..1 (use lin(t, start, start+0.25))
function popIn(svg, cx, cy, k) { if (k <= 0) return ""; const s = 0.3 + 0.7 * back(k); return `<g opacity="${Math.min(1, k * 4)}" transform="translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})">${svg}</g>`; }
// slide an SVG group in from dx,dy offset: k 0..1
function slideIn(svg, dx, dy, k) { const e = eo(clamp(k)); return `<g transform="translate(${dx * (1 - e)} ${dy * (1 - e)})">${svg}</g>`; }
// HTML element pop (cards, choices): returns style string
function popCss(k, rot = 0) { if (k <= 0) return "opacity:0"; return `opacity:${Math.min(1, k * 4)};transform:rotate(${rot}deg) scale(${0.4 + 0.6 * back(k)})`; }
function choice(x, y, text, k = 1) { return `<div class="choice" style="left:${x}px;top:${y}px;${popCss(k)}">${text}</div>`; }
// counter text that rolls up to a number: rollNum(4812, k) -> "4,812" at k=1
function rollNum(n, k) { return Math.round(n * eo(clamp(k))).toLocaleString("en-US"); }
// phone with lock-screen notifications (HTML); notes = [[emoji, color, name, text], ...]; shown = how many are visible
function phone(x, y, time, date, notes, shown = 99) {
  return `<div class="phone" style="left:${x}px;top:${y}px"><div class="isl"></div><div class="pd">${date}</div><div class="pt">${time}</div>` +
    notes.slice(0, shown).map(([e, c, n, tx]) => `<div class="notif"><div class="av" style="background:${c}">${e}</div><div><b>${n}</b><span>${tx}</span></div></div>`).join("") + `</div>`;
}
function hand(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})" ${sw}><path d="M-90 700 L-60 60 Q-40 -10 40 0 L160 20 Q220 40 200 110 L180 700Z" fill="${SK}"/>${[0, 80, 160, 240].map((d) => `<ellipse cx="250" cy="${-220 + d}" rx="62" ry="40" fill="${SK}"/>`).join("")}<ellipse cx="-140" cy="-120" rx="48" ry="70" fill="${SK}"/></g>`; }
function tv(fn) { return `<rect x="70" y="420" width="940" height="600" rx="24" fill="#1C1B22" ${sw}/><rect x="96" y="446" width="888" height="548" fill="#2C4A8C"/>${fn || ""}<rect x="500" y="1020" width="80" height="160" fill="#2a2a30"/><rect x="380" y="1170" width="320" height="30" rx="10" fill="#2a2a30"/>`; }
function newsBar(head, text) { return `<rect x="96" y="880" width="888" height="114" fill="#D9443C"/><rect x="96" y="880" width="250" height="114" fill="#fff"/><text x="221" y="955" text-anchor="middle" font-family="Kanit" font-weight="700" font-size="46" fill="#D9443C">${head}</text><text x="370" y="950" font-family="Kanit" font-weight="600" font-size="40" fill="#fff">${text}</text>`; }
function confetti(t, seed = 1, n = 60) { let s = "", r = seed * 9301; const rnd = () => ((r = (r * 16807) % 2147483647) / 2147483647); for (let i = 0; i < n; i++) { const x = rnd() * W, y0 = -100 - rnd() * 800, sp = 300 + rnd() * 300, c = ["#F2B63D", "#E2553B", "#2E8C86", "#E89AA6", "#6FA8DC"][i % 5]; const y = y0 + t * sp; if (y > H) continue; s += `<rect x="${x + Math.sin(t * 3 + i) * 30}" y="${y}" width="18" height="30" fill="${c}" transform="rotate(${(t * 200 + i * 40) % 360} ${x} ${y})"/>`; } return s; }
