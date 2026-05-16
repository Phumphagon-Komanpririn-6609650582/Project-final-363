import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoute.js';

const app = express();
const port = 4000;

// --- 1. Middleware ---
// ถึงแม้จะใช้ Proxy แต่การใส่ cors ไว้ก็เป็นแนวทางที่ดี (Best Practice)
app.use(cors()); 

// สำคัญมาก: ต้องมีเพื่อให้ Server อ่าน data ที่ส่งมาจากฟอร์ม Login (req.body) ได้
app.use(express.json()); 

// --- 2. Routes ---
// ทุก Request ที่วิ่งมาหา /api จะถูกส่งไปจัดการต่อที่ authRoute.js
app.use('/api', authRoute); 

// ทดสอบหน้าแรกของ Server (เลือกใส่หรือไม่ใส่ก็ได้)
app.get('/', (req, res) => {
    res.send('TU-Booking Backend is running!');
});

// --- 3. Start Server ---
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📡 Ready to receive requests from Frontend via Proxy`);
});