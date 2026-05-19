import express from 'express';
import { login } from '../controllers/authController.js';
import User from '../models/User.js'; // 👉 ดึงโมเดล User ของมึงมาค้นหาข้อมูลสดๆ จาก MongoDB

const router = express.Router();

// 🔐 เส้นทางสำหรับการ Login เดิมของมึง
router.post('/login', login);

// 👤 👉 เส้นทางใหม่สำหรับให้หน้าบ้านยิง Fetch มาดึงข้อมูลนักศึกษาล่าสุด (แก้บั๊กจุดสีแดงไม่ขึ้น)
router.get('/user/profile', async (req, res) => {
  try {
    const { studentId } = req.query; // รับรหัสนักศึกษาผ่าน Query string (เช่น ?studentId=6609650392)
    
    if (!studentId) {
      return res.status(400).json({ message: 'กรุณาระบุรหัสนักศึกษา' });
    }

    // ค้นหาข้อมูลล่าสุดใน MongoDB คอลเลกชัน users
    const user = await User.findOne({ studentId });
    
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลนักศึกษารายนี้ในระบบ' });
    }

    // ส่ง Object ข้อมูลจริงที่มีฟิลด์ noShowCount และ status อัปเดตล่าสุดกลับไปให้หน้าบ้าน
    res.status(200).json(user);
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในท่อดึงข้อมูลโปรไฟล์ล่าสุด:', error);
    res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้อง ไม่สามารถดึงข้อมูลได้' });
  }
});

export default router;