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
// รองรับกรณีอัปโหลดไฟล์ไว้ระดับเดียวกัน (ไม่มีโฟลเดอร์ public)
app.get('/', (_req, res) => {
  const inPublic = path.join(__dirname, 'public', 'index.html');
  res.sendFile(fs.existsSync(inPublic) ? inPublic : path.join(__dirname, 'index.html'));
});
app.get('/health', (_req, res) => res.json({ ok: true }));
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
const who = d => ({ user: d?.user?.uniqueId || '', nick: d?.user?.nickname || d?.user?.uniqueId || 'ผู้ชม' });

async function connectTo(username) {
  clearTimeout(retryTimer);
  username = String(username || '').replace(/^@/, '').trim();
  if (!username) return status('กรุณาใส่ชื่อบัญชี TikTok');
  wantUser = username;
  if (conn) { try { conn.disconnect(); } catch {} conn = null; }
  status(`กำลังเชื่อม @${username}…`);
  const c = new TikTokLiveConnection(username, {
    enableExtendedGiftInfo: true,
    processInitialData: false,
    signApiKey: process.env.EULER_API_KEY || undefined,
  });
  conn = c;

  c.on(WebcastEvent.CHAT, d => broadcast({ type: 'chat', ...who(d), comment: d.comment || '' }));
  c.on(WebcastEvent.MEMBER, d => broadcast({ type: 'member', ...who(d) }));
  c.on(WebcastEvent.LIKE, d => broadcast({ type: 'like', ...who(d), count: d.likeCount || 1, total: d.totalLikeCount || 0 }));
  c.on(WebcastEvent.FOLLOW, d => broadcast({ type: 'follow', ...who(d) }));
  c.on(WebcastEvent.SHARE, d => broadcast({ type: 'share', ...who(d) }));
  c.on(WebcastEvent.GIFT, d => {
    const giftType = d.giftDetails?.giftType;
    if (giftType === 1 && !d.repeatEnd) return; // รอให้คอมโบจบก่อน ค่อยนับทีเดียว
    broadcast({
      type: 'gift', ...who(d),
      giftName: d.giftDetails?.giftName || d.extendedGiftInfo?.name || 'ของขวัญ',
      diamonds: d.giftDetails?.diamondCount || d.extendedGiftInfo?.diamond_count || 1,
      count: d.repeatCount || 1,
    });
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
    if (m.type === 'connect') connectTo(m.username);
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
