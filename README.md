# เกมไลฟ์ TikTok — ศาลเจ้าแม่ประทานพร

## ลองเล่น / ทดสอบ
เปิด public/index.html แล้วกด "แตะเพื่อเริ่ม" จากนั้นกด ⚙️ เพื่อใช้ปุ่มจำลองผู้ชม

## ต่อกับไลฟ์จริง (ทำบนมือถือได้)
1. อัปโหลดโฟลเดอร์นี้ขึ้น GitHub (repo ใหม่)
2. ไปที่ render.com → New → Web Service → เลือก repo
   - Build command: npm install
   - Start command: npm start
3. เปิดลิงก์ที่ Render ให้มา (https://xxxx.onrender.com) ใน Chrome บนมือถือ
4. ⚙️ → ใส่ชื่อบัญชี TikTok → เชื่อมต่อ (ต้องเปิดไลฟ์อยู่ก่อน)
5. ซ่อนแผง → แชร์หน้าจอเข้าไลฟ์ TikTok

ตัวเลือก (Environment ใน Render):
- TIKTOK_USERNAME = ชื่อบัญชี (ให้ต่ออัตโนมัติ)
- EULER_API_KEY = คีย์ฟรีจาก eulerstream.com (ช่วยให้ต่อได้เสถียรขึ้น)

หมายเหตุ: Render แผนฟรีจะหลับเมื่อไม่มีคนใช้ เปิดลิงก์ทิ้งไว้ก่อนไลฟ์ ~1 นาที
