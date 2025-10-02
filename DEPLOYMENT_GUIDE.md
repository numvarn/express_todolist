# 🚀 คู่มือการ Deploy โปรเจค Express.js บน Vercel

## 📋 ข้อกำหนดเบื้องต้น

- โปรเจค Express.js ที่ใช้ MongoDB Atlas
- GitHub repository
- บัญชี Vercel (สร้างฟรีได้ที่ [vercel.com](https://vercel.com))

## 🏗️ ไฟล์ Configuration ที่เตรียมไว้แล้ว

### 1. `vercel.json`
```json
{
  "version": 2,
  "builds": [{ "src": "app.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/app.js" }],
  "env": { "NODE_ENV": "production" },
  "functions": { "app.js": { "includeFiles": "views/**" } }
}
```

### 2. `package.json` (อัปเดตแล้ว)
- เพิ่ม build scripts
- ระบุ Node.js version requirement (≥18.0.0)
- เพิ่ม engines specification

### 3. API Structure
- โฟลเดอร์ `api/` สำหรับ Vercel serverless functions
- `api/index.js` เป็น entry point หลัก

## 🚀 ขั้นตอนการ Deploy

### Step 1: Push โค้ดไปยัง GitHub
```bash
git add .
git commit -m "🚀 Prepare for Vercel deployment"
git push origin main
```

### Step 2: เชื่อมต่อกับ Vercel
1. ไปที่ [vercel.com](https://vercel.com)
2. Sign up หรือ Login ด้วย GitHub account
3. คลิก "New Project"
4. เลือก repository ของโปรเจคนี้
5. คลิก "Import"

### Step 3: ตั้งค่า Environment Variables
ใน Vercel Dashboard:
1. ไปที่ **Settings** > **Environment Variables**
2. เพิ่มตัวแปรต่อไปนี้:

```env
# จำเป็น (ใช้ค่าจริงจากไฟล์ .env ของคุณ)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# แนะนำ
NODE_ENV=production
```

**⚠️ สำคัญ:** ใช้ค่าจริงจากไฟล์ `.env` ของคุณ ไม่ใช่ค่า template

### Step 4: Deploy
1. Vercel จะ deploy อัตโนมัติหลังจาก import repository
2. รอให้ build เสร็จ (ประมาณ 1-3 นาที)
3. จะได้ URL เช่น `https://your-app-name.vercel.app`

## 🧪 การทดสอบหลัง Deploy

### ทดสอบ Web Routes:
- `https://your-app.vercel.app/` - หน้าแรก
- `https://your-app.vercel.app/users` - หน้า users

### ทดสอบ API Routes:
- `https://your-app.vercel.app/api/todos` - รายการ todos (GET)
- `https://your-app.vercel.app/api/todos` - สร้าง todo ใหม่ (POST)

## 🔧 การแก้ไขปัญหา

### ปัญหา Database Connection
1. ตรวจสอบ MONGODB_URI ใน Vercel Dashboard
2. ใน MongoDB Atlas > Network Access ให้เพิ่ม IP `0.0.0.0/0` (Allow from anywhere)

### ปัญหา View Templates ไม่โหลด
- ตรวจสอบว่ามีไฟล์ `.pug` ในโฟลเดอร์ `views/`
- `vercel.json` มี `"includeFiles": "views/**"` แล้ว

### ปัญหา Static Files
- ไฟล์ใน `public/` จะโหลดอัตโนมัติ
- Path: `https://your-app.vercel.app/images/logo.png`

## 📝 Environment Variables ที่ต้องตั้งค่า

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | Connection string ของ MongoDB Atlas |
| `NODE_ENV` | ⚠️ | ควรตั้งเป็น `production` |

## 🔄 การ Deploy ใหม่

การ deploy จะเกิดขึ้นอัตโนมัติเมื่อ:
- Push โค้ดใหม่ไปยัง GitHub
- เปลี่ยน Environment Variables
- Manual deploy ใน Vercel Dashboard

## 📊 การตรวจสอบ Logs

1. ใน Vercel Dashboard > Functions tab
2. คลิกที่ function ที่ต้องการดู logs
3. ดู Real-time logs และ Error logs

## 💡 Tips เพิ่มเติม

1. **Custom Domain:** สามารถเพิ่มใน Vercel Dashboard > Domains
2. **Analytics:** เปิด Analytics ใน Vercel Dashboard
3. **Performance:** ใช้ Edge Functions สำหรับ static content
4. **Security:** ตั้งค่า CORS และ environment-specific configs

## 🆘 การขอความช่วยเหลือ

หากพบปัญหา:
1. ตรวจสอบ Vercel Function logs
2. ดู MongoDB Atlas connection logs  
3. ตรวจสอบ Network tab ใน browser developer tools

---

## ✅ Checklist ก่อน Deploy

- [ ] Push โค้ดไปยัง GitHub repository
- [ ] ตั้งค่า MongoDB Atlas Network Access (IP: 0.0.0.0/0)
- [ ] เตรียม MONGODB_URI connection string
- [ ] ตรวจสอบว่าไฟล์ views มีนามสกุล `.pug`
- [ ] ทดสอบโปรเจคใน local ให้ทำงานได้ปกติ

**🎉 เมื่อทำทุกขั้นตอนแล้ว โปรเจคของคุณจะทำงานบน Vercel ได้อย่างสมบูรณ์!**