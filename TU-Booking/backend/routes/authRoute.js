import express from 'express';
import { login } from '../controllers/authController.js';
import User from '../models/User.js';

const router = express.Router();


router.post('/login', login);


router.get('/user/profile', async (req, res) => {
  try {
    const { studentId } = req.query;
    
    if (!studentId) {
      return res.status(400).json({ message: 'กรุณาระบุรหัสนักศึกษา' });
    }

    const user = await User.findOne({ studentId });
    
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลนักศึกษารายนี้ในระบบ' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูล', error);
    res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้อง ไม่สามารถดึงข้อมูลได้' });
  }
});

export default router;