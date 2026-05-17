import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoute from './routes/authRoute.js';
import facilityRoutes from './routes/facilityRoutes.js'; // 👉 1. นำเข้าท่อสถานที่ที่เราเพิ่งสร้าง

const app = express();
const port = 4000;

// --- 1. Middleware ---
app.use(cors()); 
app.use(express.json()); 

// --- 2. ตั้งค่าเชื่อมต่อไปยัง MongoDB Database ---
mongoose.connect('mongodb://127.0.0.1:27017/tu_booking')
    .then(() => console.log('✅ เชื่อมต่อฐานข้อมูล MongoDB Compass สำเร็จ!'))
    .catch((err) => console.error('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ MongoDB:', err));

// --- 3. Routes ---
app.use('/api', authRoute); // ท่อสำหรับระบบ Login ของมึง (มีอยู่แล้ว)
app.use('/api/facilities', facilityRoutes); // 👉 2. เสียบปลั๊กท่อ Facility ตรงนี้เลยเพื่อน!

app.get('/', (req, res) => {
    res.send('TU-Booking Backend is running with MongoDB!');
});

// --- 4. Start Server ---
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📡 Ready to receive requests from Frontend`);
});