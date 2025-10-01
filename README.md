# TodoList API

## ภาพรวมโปรเจค

โปรเจคนี้เป็น **Express.js API** สำหรับจัดการรายการสิ่งที่ต้องทำ (Todo List) ที่ใช้ **MongoDB** เป็นฐานข้อมูล พร้อมด้วยระบบการกรองข้อมูล การเรียงลำดับ และการแสดงสถิติแบบ Real-time

## โครงสร้างโปรเจค

```
myapp/
├── app.js                     # ไฟล์หลักของแอปพลิเคชัน
├── package.json               # การตั้งค่า dependencies
├── API_DOCUMENTATION.md       # เอกสาร API
├── config/
│   └── database.js           # การเชื่อมต่อฐานข้อมูล MongoDB
├── models/
│   └── Todo.js               # Schema ของ Todo
├── routes/
│   ├── index.js              # Route หลัก
│   ├── users.js              # Route ผู้ใช้
│   └── todos.js              # Route ของ Todo API
├── views/                    # Template Jade/Pug
└── public/                   # Static files
```

## เทคโนโลยีที่ใช้

- **Backend Framework**: Express.js 4.21.2
- **Database**: MongoDB with Mongoose ODM 8.18.3
- **View Engine**: Jade/Pug 1.9.2
- **Middleware**:
  - Morgan (HTTP request logger)
  - Cookie-parser
  - Express built-in middleware

## การติดตั้งและรันโปรเจค

### ข้อกำหนดเบื้องต้น
- Node.js
- MongoDB Atlas Account (Cloud Database)

### ขั้นตอนการติดตั้ง

1. **Clone หรือ Download โปรเจค**

2. **ติดตั้ง Dependencies**
   ```bash
   npm install
   ```

3. **ตั้งค่า MongoDB Atlas**
   - สร้างบัญชี [MongoDB Atlas](https://www.mongodb.com/atlas)
   - สร้าง Cluster ใหม่
   - สร้าง Database User
   - ตั้งค่า Network Access (IP Whitelist)
   - คัดลอก Connection String

4. **ตั้งค่า Environment Variables**
   ```bash
   # สร้างไฟล์ .env จาก .env.example
   cp .env.example .env

   # แก้ไขไฟล์ .env และใส่ MongoDB Atlas connection string
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todolist?retryWrites=true&w=majority
   ```

5. **รันแอปพลิเคชัน**
   ```bash
   npm start
   ```

6. **เข้าถึง API**
   ```
   http://localhost:3000/api/todos
   ```

## โครงสร้างข้อมูล Todo

```javascript
{
  "_id": "ObjectId",
  "title": "string (required, max 100 chars)",
  "description": "string (optional, max 500 chars)",
  "completed": "boolean (default: false)",
  "priority": "enum ['low', 'medium', 'high'] (default: 'medium')",
  "dueDate": "Date (optional)",
  "createdAt": "Date (auto-generated)",
  "updatedAt": "Date (auto-updated)"
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | ดึงรายการ Todo ทั้งหมด |
| GET | `/api/todos/:id` | ดึง Todo ตาม ID |
| POST | `/api/todos` | สร้าง Todo ใหม่ |
| PUT | `/api/todos/:id` | อัพเดท Todo |
| PATCH | `/api/todos/:id/toggle` | สลับสถานะเสร็จสิ้น |
| DELETE | `/api/todos/:id` | ลบ Todo |
| DELETE | `/api/todos` | ลบ Todo ที่เสร็จแล้วทั้งหมด |
| GET | `/api/todos/stats/summary` | ดึงสถิติ Todo |

### รายละเอียด API

#### 1. GET /api/todos - ดึงรายการ Todo ทั้งหมด

**Query Parameters:**
- `completed` (boolean): กรองตามสถานะเสร็จสิ้น
- `priority` (string): กรองตามระดับความสำคัญ (low/medium/high)
- `sort` (string): เรียงลำดับ เช่น "createdAt", "-priority,createdAt"

**ตัวอย่าง:**
```bash
# ดึง Todo ทั้งหมด
GET /api/todos

# ดึง Todo ที่เสร็จแล้ว
GET /api/todos?completed=true

# ดึง Todo ความสำคัญสูง เรียงตามวันที่สร้าง (ใหม่ไปเก่า)
GET /api/todos?priority=high&sort=-createdAt
```

#### 2. POST /api/todos - สร้าง Todo ใหม่

**Request Body:**
```json
{
  "title": "ทำการบ้าน",
  "description": "ทำการบ้านวิชาคณิตศาสตร์",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

#### 3. PUT /api/todos/:id - อัพเดท Todo

**Request Body:**
```json
{
  "title": "ทำการบ้าน (แก้ไข)",
  "completed": true,
  "priority": "medium",
  "description": "เพิ่มรายละเอียด"
}
```

#### 4. GET /api/todos/stats/summary - สถิติ Todo

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "completed": 5,
    "pending": 5,
    "overdue": 2,
    "priority": {
      "low": 3,
      "medium": 4,
      "high": 3
    }
  }
}
```

## รูปแบบ Response

ทุก API จะตอบกลับในรูปแบบ:
```json
{
  "success": boolean,
  "message": "string (optional)",
  "data": object|array,
  "count": number (for list endpoints),
  "errors": array (for validation errors)
}
```

## ตัวอย่างการใช้งานด้วย curl

### สร้าง Todo ใหม่
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "เรียนภาษาอังกฤษ",
    "description": "อ่านหนังสือไวยากรณ์",
    "priority": "medium"
  }'
```

### ดึง Todo ทั้งหมด
```bash
curl http://localhost:3000/api/todos
```

### อัพเดท Todo
```bash
curl -X PUT http://localhost:3000/api/todos/[TODO_ID] \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### สลับสถานะเสร็จสิ้น
```bash
curl -X PATCH http://localhost:3000/api/todos/[TODO_ID]/toggle
```

### ลบ Todo
```bash
curl -X DELETE http://localhost:3000/api/todos/[TODO_ID]
```

### ดึงสถิติ
```bash
curl http://localhost:3000/api/todos/stats/summary
```

## Features หลัก

### 🔍 การกรองและค้นหา
- กรองตามสถานะเสร็จสิ้น (completed/pending)
- กรองตามระดับความสำคัญ (low/medium/high)
- การเรียงลำดับแบบหลายฟิลด์

### 📊 ระบบสถิติ
- นับจำนวน Todo ทั้งหมด
- นับจำนวน Todo ที่เสร็จแล้ว/ยังไม่เสร็จ
- นับจำนวน Todo ที่เกินกำหนด
- สถิติตามระดับความสำคัญ

### 🔒 ความปลอดภัย
- Input Validation สำหรับทุกฟิลด์
- Error Handling ที่ครอบคลุม
- Data Sanitization ด้วย trim()
- MongoDB Injection Protection ผ่าน Mongoose

### ⚡ Performance
- การเรียงลำดับที่มีประสิทธิภาพ
- MongoDB Aggregation สำหรับสถิติ
- Connection pooling ผ่าน Mongoose

## การกำหนดค่าฐานข้อมูล MongoDB Atlas

### รูปแบบ Connection String
```
mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

### การใช้ Environment Variable
1. **สร้างไฟล์ .env**
   ```bash
   cp .env.example .env
   ```

2. **แก้ไขไฟล์ .env**
   ```bash
   MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/todolist?retryWrites=true&w=majority
   PORT=3000
   ```

3. **รันแอปพลิเคชัน**
   ```bash
   npm start
   ```

### การตั้งค่า MongoDB Atlas
1. **สร้างบัญชี**: ไปที่ [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **สร้าง Cluster**: เลือก Free Tier (M0)
3. **สร้าง Database User**:
   - ไปที่ Database Access
   - เพิ่มผู้ใช้ใหม่ พร้อม username และ password
4. **ตั้งค่า Network Access**:
   - ไปที่ Network Access
   - เพิ่ม IP Address (0.0.0.0/0 สำหรับการทดสอบ)
5. **คัดลอก Connection String**:
   - ไปที่ Clusters > Connect > Connect your application
   - เลือก Node.js และคัดลอก connection string

### ความปลอดภัย
- **ห้ามเปิดเผย credentials**: ไม่ให้ commit ไฟล์ .env
- **ใช้ Strong Password**: สำหรับ Database User
- **จำกัด Network Access**: ระบุ IP Address ที่ต้องการให้เข้าถึงได้

## Error Handling

API มีการจัดการข้อผิดพลาดดังนี้:

- **400 Bad Request**: ข้อมูล input ไม่ถูกต้อง
- **404 Not Found**: ไม่พบ Todo ที่ระบุ
- **500 Internal Server Error**: ข้อผิดพลาดจากเซิร์ฟเวอร์

## การพัฒนาต่อ

### การเพิ่ม Features
1. Authentication และ Authorization
2. การแจ้งเตือน (Notifications)
3. การแชร์ Todo ระหว่างผู้ใช้
4. การแนบไฟล์
5. Tags และ Categories

### การปรับปรุงประสิทธิภาพ
1. Caching ด้วย Redis
2. Pagination สำหรับรายการขนาดใหญ่
3. Search indexing
4. Rate limiting

## License

This project is open source and available under the [MIT License](LICENSE).

## การสนับสนุน

หากพบปัญหาหรือต้องการความช่วยเหลือ กรุณาสร้าง Issue ใน repository นี้