import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoute from './routes/authRoute.js';
import facilityRoutes from './routes/facilityRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js'; 
import rewardRoutes from './routes/rewardRoutes.js';   
import redeemRoutes from './routes/redeemRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
// 👉 🎯 [จุดที่เพิ่มใหม่] นำเข้าท่อเราเตอร์สำหรับคำนวณสถิติ Dashboard
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
const port = 4000;

app.use(cors()); 
app.use(express.json()); 

mongoose.connect('mongodb://127.0.0.1:27017/tu_booking')
    .then(() => console.log('✅ เชื่อมต่อ MongoDB สำเร็จ!'))
    .catch((err) => console.error('❌ เชื่อมต่อ MongoDB ล้มเหลว:', err));

// Routes หลักของระบบมึง
app.use('/api', authRoute);
app.use('/api/facilities', facilityRoutes);
app.use('/api/bookings', bookingRoutes); 
app.use('/api/rewards', rewardRoutes);   
app.use('/api/redeem', redeemRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/reports', reportRoutes);

// 👉 🎯 [จุดที่เพิ่มใหม่] เสียบปลั๊กเปิดใช้งานท่อประมวลผล Data Analytics หน้า Dashboard จริง
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.send('TU-Booking Backend is running!');
});

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});