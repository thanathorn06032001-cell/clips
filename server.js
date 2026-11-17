// เซิร์ฟเวอร์ส่งต่อเหตุการณ์จาก TikTok LIVE ไปยังหน้าเกม (public/index.html)
// รัน: npm install แล้ว npm start  จากนั้นเปิด http://localhost:3000
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { WebSocketServer } from 'ws';
import { TikTokLiveConnection, WebcastEvent, ControlEvent } from 'tiktok-live-connector';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: '7d', setHeaders: (res, p) => { if (/\.(js|html)$/.test(p)) res.setHeader('Cache-Control', 'no-cache'); } }));
// รองรับกรณีอัปโหลดไฟล์ไว้ระดับเดียวกัน (ไม่มีโฟลเดอร์ public)
app.get('/', (_req, res) => {
  const inPublic = path.join(__dirname, 'public', 'index.html');
  res.sendFile(fs.existsSync(inPublic) ? inPublic : path.join(__dirname, 'index.html'));
});
app.get('/health', (_req, res) => res.json({ ok: true }));
// เกมที่ 3: รถแห่ม่วนซื่น
app.get('/parade', (_req, res) => {
  const inPublic = path.join(__dirname, 'public', 'parade.html');
  res.sendFile(fs.existsSync(inPublic) ? inPublic : path.join(__dirname, 'parade.html'));
});
// เกมที่ 2: มวยไลฟ์ สังเวียนเดือด
app.get('/boxing', (_req, res) => {
  const inPublic = path.join(__dirname, 'public', 'boxing.html');
  res.sendFile(fs.existsSync(inPublic) ? inPublic : path.join(__dirname, 'boxing.html'));
});
// ส่งต่อรูปโปรไฟล์ TikTok (กันมือถือโดนบล็อก + แคชไว้)
const avCache = new Map();
app.get('/av', async (req, res) => {
  const u = String(req.query.u || '');
  let host = '';
  try { host = new URL(u).hostname; } catch { return res.status(400).end(); }
  if (!/(tiktokcdn|tiktokcdn-us|ibyteimg|byteimg|muscdn)\.com$/.test(host)) return res.status(403).end();
  const hit = avCache.get(u);
  if (hit) return res.type(hit.type).set('Cache-Control', 'public, max-age=86400').send(hit.buf);
  try {
    const r = await fetch(u, { signal: AbortSignal.timeout(6000) });
    if (!r.ok) return res.status(502).end();
    const buf = Buffer.from(await r.arrayBuffer());
    const type = r.headers.get('content-type') || 'image/jpeg';
    if (avCache.size > 500) avCache.delete(avCache.keys().next().value);
    avCache.set(u, { buf, type });
    res.type(type).set('Cache-Control', 'public, max-age=86400').send(buf);
  } catch { res.status(504).end(); }
});
// ติดตั้งเป็นแอปบนหน้าจอหลัก (เปิดแบบเต็มจอ ไม่มีแถบเว็บ)
app.get('/manifest.json', (_req, res) => res.json({
  name: 'ศาลเจ้าแม่ประทานพร', short_name: 'ศาลเจ้าแม่', start_url: '/', scope: '/',
  display: 'fullscreen', orientation: 'portrait', background_color: '#000000', theme_color: '#000000',
  icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
}));
app.get('/icon.svg', (_req, res) => res.type('image/svg+xml').send(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="#5a0a14"/><circle cx="256" cy="230" r="150" fill="#ffd36b" opacity=".35"/><path d="M256 70 L290 210 L222 210Z" fill="#ffd36b"/><circle cx="256" cy="250" r="60" fill="#ffe2b8"/><path d="M150 450 Q256 300 362 450Z" fill="#c2183a"/><text x="256" y="490" font-size="56" text-anchor="middle" fill="#ffd36b" font-family="sans-serif">🙏</text></svg>`));
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let conn = null;
let wantUser = process.env.TIKTOK_USERNAME || '';
let lastStatus = 'ยังไม่ได้เชื่อม TikTok';
let retryTimer = null;

function broadcast(obj) {
  const s = JSON.stringify(obj);
  for (const c of wss.clients) if (c.readyState === 1) c.send(s);
}
function status(text) { lastStatus = text; broadcast({ type: 'status', text }); console.log('[status]', text); }
// ราคาเพชรสำรอง เผื่อข้อมูลของขวัญไม่ส่งราคามา
const GIFT_PRICE = { rose: 1, tiktok: 1, 'finger heart': 5, 'heart me': 1, perfume: 20, doughnut: 30, 'hand hearts': 100, corgi: 299, 'money gun': 500, galaxy: 1000, lion: 29999, universe: 34999 };
const GIFT_ID = { 5655: ['Rose', 1], 5269: ['TikTok', 1], 5487: ['Finger Heart', 5], 6064: ['GG', 1], 5827: ['Ice Cream Cone', 1], 7934: ['Heart Me', 1], 5658: ['Perfume', 20], 5879: ['Doughnut', 30], 5660: ['Hand Hearts', 100], 7168: ['Money Gun', 500], 11046: ['Galaxy', 1000], 6820: ['Whale diving', 2150], 6369: ['Lion', 29999], 7312: ['TikTok Universe', 44999] };
const giftSeen = new Map();
const giftImgCache = {};
function giftImage(d) {
  const direct = picUrl(d.giftDetails?.giftImage) || picUrl(d.giftDetails?.image) || picUrl(d.giftDetails?.icon) || picUrl(d.extendedGiftInfo?.image) || picUrl(d.extendedGiftInfo?.icon);
  if (direct) return (giftImgCache[d.giftId] = direct);
  let found = '';
  const seen = new Set();
  (function walk(o, k0, depth) {
    if (found || !o || typeof o !== 'object' || depth > 5 || seen.has(o)) return;
    seen.add(o);
    for (const [k, v] of Object.entries(o)) {
      if (found) return;
      if (k === 'user' || k === 'toUser' || /background|effect|banner|tray|frame|badge/i.test(k)) continue;
      if (Array.isArray(v) && /urlList|url_list|urls/i.test(k) && /gift|image|icon/i.test(k0) && typeof v[0] === 'string' && /^https?:/.test(v[0])) { found = v[0]; return; }
      if (typeof v === 'object') walk(v, k, depth + 1);
    }
  })(d, '', 0);
  if (found) giftImgCache[d.giftId] = found;
  return found || giftImgCache[d.giftId] || '';
}
function giftInfo(d) {
  const gd = d.giftDetails || d.extendedGiftInfo || d.gift || {};
  let name = gd.giftName || gd.name || d.giftName || '';
  let dia = Number(gd.diamondCount || gd.diamond_count || 0);
  const byId = GIFT_ID[d.giftId];
  if (!name && byId) name = byId[0];
  if (!dia && byId) dia = byId[1];
  if (!name) { // ลองหาจากข้อความที่ TikTok แสดง เช่น "ส่ง กุหลาบ"
    const t = [d.common?.describe, d.trayDisplayText?.defaultPattern, d.displayTextForAudience?.defaultPattern].find(x => typeof x === 'string' && x) || '';
    const m = t.match(/(?:sent|ส่ง)\s+(.+?)(?:\s*x\s*\d+)?$/i); if (m) name = m[1].trim();
  }
  const known = !!name;
  if (!dia) dia = GIFT_PRICE[(name || '').toLowerCase()] || (/กุหลาบ/.test(name) ? 1 : 1);
  return { name: name || 'ของขวัญ', diamonds: dia, known };
}
const picUrl = x => x?.urlList?.[0] || x?.url?.[0] || x?.urls?.[0] || '';
const who = d => ({ user: d?.user?.uniqueId || '', nick: d?.user?.nickname || d?.user?.uniqueId || 'ผู้ชม',
  avatar: picUrl(d?.user?.avatarThumb) || picUrl(d?.user?.avatarMedium) || picUrl(d?.user?.avatarLarge) || picUrl(d?.user?.profilePicture) || '' });

// ดึงข้อความคอมเมนต์ให้ได้ แม้ TikTok เปลี่ยนชื่อฟิลด์
function chatText(d) {
  if (!d) return '';
  const direct = d.comment ?? d.content ?? d.text ?? d.message ?? d.common?.displayText?.defaultPattern;
  if (typeof direct === 'string' && direct.trim()) return direct.trim();
  let found = '';
  const seen = new Set();
  (function walk(o, depth) {
    if (found || !o || typeof o !== 'object' || depth > 4 || seen.has(o)) return;
    seen.add(o);
    for (const [k, v] of Object.entries(o)) {
      if (found) return;
      if (k === 'user' || k === 'atUser' || /image|url|avatar|nickname|uniqueId|signature|language|key/i.test(k)) continue;
      if (typeof v === 'string' && /comment|content|text/i.test(k) && v.trim() && !/^https?:/.test(v)) { found = v.trim(); return; }
      if (typeof v === 'object') walk(v, depth + 1);
    }
  })(d, 0);
  return found;
}

async function connectTo(username) {
  clearTimeout(retryTimer);
  username = String(username || '').replace(/^@/, '').trim();
  if (!username) return status('กรุณาใส่ชื่อบัญชี TikTok');
  wantUser = username;
  if (conn) { try { conn.disconnect(); } catch {} conn = null; }
  status(`กำลังเชื่อม @${username}…`);
  const c = new TikTokLiveConnection(username, {
    enableExtendedGiftInfo: false, // ต้องใช้แผนเสียเงินของ Euler — ไม่จำเป็น
    processInitialData: false,
    signApiKey: process.env.EULER_API_KEY || undefined,
  });
  conn = c;

  c.on(WebcastEvent.CHAT, d => {
    const text = chatText(d);
    console.log('[chat]', d?.user?.uniqueId, JSON.stringify(text));
    if (!text) { try { broadcast({ type: 'debug', text: 'chat ว่าง keys=' + Object.keys(d || {}).join(',') + ' ' + JSON.stringify(d, (k, v) => (k === 'user' || k === 'atUser' || /image|Image|url|Url/.test(k)) ? undefined : v).slice(0, 400) }); } catch {} }
    broadcast({ type: 'chat', ...who(d), comment: text });
  });
  c.on(WebcastEvent.EMOTE, d => broadcast({ type: 'chat', ...who(d), comment: '[emote]' }));
  c.on(WebcastEvent.MEMBER, d => broadcast({ type: 'member', ...who(d) }));
  c.on(WebcastEvent.LIKE, d => broadcast({ type: 'like', ...who(d), count: d.likeCount || 1, total: d.totalLikeCount || 0 }));
  c.on(WebcastEvent.FOLLOW, d => broadcast({ type: 'follow', ...who(d) }));
  c.on(WebcastEvent.SHARE, d => broadcast({ type: 'share', ...who(d) }));
  c.on(WebcastEvent.GIFT, d => {
    const info = giftInfo(d);
    const rc = Math.max(1, Number(d.repeatCount) || Number(d.comboCount) || 1);
    // นับเฉพาะส่วนที่เพิ่มขึ้นของคอมโบ (กันนับซ้ำ แม้ TikTok ไม่บอกชนิดของขวัญ)
    const key = (d?.user?.uniqueId || '') + '|' + (d.giftId || info.name) + '|' + (d.groupId || '');
    const now = Date.now(), last = giftSeen.get(key);
    let count = rc;
    if (last && now - last.t < 30000) {
      if (rc > last.n) count = rc - last.n;
      else if (rc === last.n && (d.repeatEnd || now - last.t < 1500)) { last.t = now; return; }
    }
    giftSeen.set(key, { n: rc, t: now });
    if (giftSeen.size > 500) for (const [k, v] of giftSeen) if (now - v.t > 60000) giftSeen.delete(k);
    console.log('[gift]', d?.user?.uniqueId, info.name, 'id', d.giftId, 'x', count);
    if (!info.known) { try { broadcast({ type: 'debug', text: 'gift id=' + d.giftId + ' ' + JSON.stringify(d, (k, v) => (k === 'user' || k === 'toUser' || /image|Image|url|Url|icon|Icon/.test(k)) ? undefined : v).slice(0, 400) }); } catch {} }
    broadcast({ type: 'gift', ...who(d), giftName: info.name, giftId: d.giftId || 0, diamonds: info.diamonds, count, giftImg: giftImage(d) });
  });
  c.on(ControlEvent.DISCONNECTED, () => {
    if (conn !== c) return;
    status('⚠️ หลุดจาก TikTok — จะลองต่อใหม่ใน 15 วินาที');
    retryTimer = setTimeout(() => wantUser && connectTo(wantUser), 15000);
  });
  c.on(WebcastEvent.STREAM_END, () => { if (conn === c) status('ไลฟ์จบแล้ว'); });

  try {
    await c.connect();
    status(`✅ เชื่อม @${username} แล้ว — พร้อมรับของขวัญ`);
  } catch (err) {
    if (conn !== c) return;
    const msg = String(err?.message || err);
    const offline = /offline|not live|UserOffline/i.test(msg) || err?.name === 'UserOfflineError';
    status(offline ? `@${username} ยังไม่ได้เปิดไลฟ์ — จะลองใหม่ใน 30 วินาที` : `เชื่อมไม่สำเร็จ: ${msg.slice(0, 120)} — ลองใหม่ใน 30 วินาที`);
    retryTimer = setTimeout(() => wantUser && connectTo(wantUser), 30000);
  }
}

wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'status', text: lastStatus }));
  ws.on('message', raw => {
    let m; try { m = JSON.parse(raw); } catch { return; }
    if (m.type === 'connect') {
      const u = String(m.username || '').replace(/^@/, '').trim();
      if (!m.force && conn && u && u === wantUser) { ws.send(JSON.stringify({ type: 'status', text: lastStatus })); return; }
      connectTo(u);
    }
    if (m.type === 'disconnect') {
      wantUser = ''; clearTimeout(retryTimer);
      if (conn) { try { conn.disconnect(); } catch {} conn = null; }
      status('ตัดการเชื่อมต่อแล้ว');
    }
  });
});

server.listen(PORT, () => {
  console.log(`เปิดเกมที่ http://localhost:${PORT}`);
  if (wantUser) connectTo(wantUser);
});
