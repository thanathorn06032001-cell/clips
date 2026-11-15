// TEST EPISODE: ถ้าวันหนึ่ง แมวทุกตัวพูดได้
const CATS = [[140, "orange", "talk"], [360, "black", "angry"], [590, "white", "talk", true], [820, "calico", "smug"], [990, "grey", "talk", true]];
// 1a hook: cats pop up on the wall one by one, bubbles
add(0, (t) => ({
  svg: soi() + CATS.map(([x, c, m, f], i) => popIn(cat({ x, y: 1030, s: 0.92, col: c, mood: m, flip: f, t, talk: m === "talk" }), x, 1030, lin(t, 0.5 + i * 0.22, 0.75 + i * 0.22))).join("")
    + popIn(bubble(220, 690, "หิวแล้วนะ!", 150, 820), 220, 690, lin(t, 1.7, 1.95)) + popIn(bubble(470, 560, "ใครเหยียบหางฉัน", 370, 820, 40), 470, 560, lin(t, 2.0, 2.25))
    + person({ x: 880, y: 1860, s: 1.0, pose: t > 2.3 ? "shock" : "stand", mood: t > 2.3 ? "shock" : "smile", t }),
}));
// 1b reaction close-up
add(2.9, (t) => ({ svg: `<g filter="url(#blur6)">${soi()}</g>` + person({ x: 540, y: 2150, s: 2.4, pose: "shock", mood: "shock", t }) + popIn(bubble(800, 520, "ข้าวไม่อร่อย", 820, 380), 800, 520, lin(t, 3.2, 3.45)) }));
// 2 bedroom, cat lands on the bed, 07:00 card
add(sc(2), (t) => ({
  svg: bedroom() + `<ellipse cx="300" cy="960" rx="150" ry="60" fill="#fff" ${sw}/><g transform="translate(300 900) rotate(-90)">${head(0, t > P(2).s + 1.2 ? "shock" : "tired")}</g>`
    + `<path d="M180 990 Q560 900 1000 980 L1010 1150 Q560 1180 70 1150 Q60 1040 180 990Z" fill="#F2A7B5" ${sw}/>`
    + slideIn(cat({ x: 620, y: 1010, s: 1.2, col: "orange", mood: "smug", t }), 0, -900, lin(t, P(2).s + 0.6, P(2).s + 1.0)),
  html: card({ x: 60, y: 160, tag: "วันแรก · DAY 1", big: "07:00", w: 380, icon: "⏰", k: lin(t, P(2).s, P(2).s + 0.25) }),
}));
// 3 big cat close-up, order
add(sc(3), (t) => ({ svg: bedroom() + `<rect width="1080" height="1920" fill="#F2B63D" opacity=".25"/>` + cat({ x: 540, y: 1420, s: 2.4, col: "orange", mood: "angry", t, talk: t < P(3).e }) + popIn(bubble(540, 330, "ข้าวเช้าอยู่ไหน ทาส!", 540, 470, 50), 540, 330, lin(t, P(3).s, P(3).s + 0.25)) }));
// 4 phone notifications + rolling counter
const NOTES = [["🐱", "#EFA555", "ส้มจี๊ด (แมวบ้าน)", "ทรายสกปรก เปลี่ยนด่วน"], ["🐈‍⬛", "#36313A", "ดำ (แมวบ้าน)", "ขนมหมดแล้วเหรอ?"], ["🏠", "#6FB7AE", "ป้าข้างบ้าน", "แมวคุณด่าแมวป้าอีกแล้ว"], ["🏢", "#E0567A", "นิติบุคคล", "แมวขอประชุมที่ล็อบบี้"]];
add(sc(4), (t) => ({
  svg: `<g filter="url(#blur6)">${bedroom()}</g>` + hand(470, 1230, 1),
  html: phone(250, 160, "07:05", "วันจันทร์ 16 พฤศจิกายน", NOTES, Math.floor(clamp((t - P(4).s) / 0.45, 0, 4)))
    + card({ x: 560, y: 1080, tag: "ข้อความ · MESSAGES", big: rollNum(4812, lin(t, P(4).s + 1.2, P(4).e)), w: 460, icon: "💬", col: "#E2553B", k: lin(t, P(4).s + 1.0, P(4).s + 1.25), rot: 3 }),
}));
// 5a TV news, 5b committee on the sofa
add(sc(5), (t) => ({
  svg: `<rect width="1080" height="1920" fill="#6A4E44"/><rect y="1300" width="1080" height="620" fill="#4E3830"/>` + tv(`<rect x="270" y="860" width="320" height="140" fill="#3B3B4A"/>` + cat({ x: 430, y: 990, s: 1.15, col: "white", mood: "talk", tie: true, t, talk: true }) + newsBar("ข่าวด่วน", "แมวทั่วประเทศยื่นข้อเรียกร้อง")),
  html: card({ x: 120, y: 160, tag: "ข้อเรียกร้อง · DEMANDS", big: "10 ข้อ", w: 520, icon: "📜", k: lin(t, P(5).s + 1.6, P(5).s + 1.85) }),
}));
add(P(5).s + 2.6, (t) => ({
  svg: livingroom(false) + sofa(170, 1330, 740) + [[270, "grey", "smug"], [470, "orange", "talk", true], [680, "black", "angry"], [870, "calico", "sleepy"]].map(([x, c, m, tie], i) => popIn(cat({ x, y: 1150, s: 0.9, col: c, mood: m, tie, t, talk: m === "talk" }), x, 1150, lin(t, P(5).s + 2.6 + i * 0.12, P(5).s + 2.85 + i * 0.12))).join(""),
}));
// 6 ending: buried in cats + choice
add(sc(6), (t) => ({
  svg: livingroom(true) + person({ x: 540, y: 1150, s: 1.1, pose: "sit", mood: "tired", t })
    + cat({ x: 370, y: 1170, s: 0.85, col: "black", mood: "sleepy", t }) + cat({ x: 710, y: 1180, s: 0.9, col: "calico", mood: "smug", flip: true, t })
    + `<g transform="translate(540 755) scale(.66)">${cat({ x: 0, y: 0, col: "orange", mood: "smug", t })}</g>` + popIn(bubble(820, 520, "ลูบต่อสิ", 650, 620, 40), 820, 520, lin(t, P(6).s + 0.4, P(6).s + 0.65)),
  html: choice(110, 220, "👑 อยากให้เป็นจริง", lin(t, P(6).s + 1.2, P(6).s + 1.45)) + choice(600, 220, "❌ ไม่เอาแล้ว", lin(t, P(6).s + 1.5, P(6).s + 1.75)),
}));
// ---- sound + edit ----
[0.5, 0.72, 0.94, 1.16, 1.38].forEach((d) => cue(d, "pop", 0.5)); cue(1.7, "pop", 0.4); cue(2.0, "pop", 0.4);
cue(2.3, "whoosh", 0.6); cue(2.9, "thud", 0.6); punch(2.9, 0.1); shake(2.92, 8);
cue(sc(2), "whoosh", 0.5); cue(P(2).s, "pop", 0.6); cue(P(2).s + 0.95, "thud", 0.7); shake(P(2).s + 0.98, 10);
cue(sc(3), "whoosh", 0.5); punch(P(3).s, 0.12);
for (let k = 0; k < 4; k++) cue(P(4).s + k * 0.45, "click", 0.6);
cue(P(4).s + 1.0, "pop", 0.6);
cue(sc(5), "whoosh", 0.5); cue(P(5).s + 1.6, "thud", 0.6); punch(P(5).s + 1.6, 0.08); flash(P(5).s + 2.6);
cue(sc(6), "whoosh", 0.4); cue(P(6).s + 1.2, "pop", 0.5); cue(P(6).s + 1.5, "pop", 0.5);
window.END_BLACK = DUR - 0.25;
