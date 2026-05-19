import express from 'express';
// 👉 🎯 อิมพอร์ตฟังก์ชันสำหรับ Admin เพิ่มเติมจากคอนโทรลเลอร์ให้ครบ 4 ตัว
import { 
  redeemReward, 
  getMyRewardsHistory, 
  getAdminRedeemList, 
  approveRedeemStatus 
} from '../controllers/redeemController.js';

const router = express.Router();

router.post('/exchange', redeemReward);               // นักศึกษาแลกของรางวัล
router.get('/my-rewards', getMyRewardsHistory);        // นักศึกษาดูตั๋วตัวเอง

// 👉 🎯 [จุดที่เพิ่มแก้] ขุดท่อเปิดสิทธิ์ให้แอดมินวิ่งเข้ามาเขียนอ่านข้อมูลได้จริง
router.get('/admin/list', getAdminRedeemList);         // แอดมินดึงรายการตั๋วทั้งหมด
router.put('/admin/approve/:id', approveRedeemStatus); // แอดมินกดอนุมัติสิทธิ์แจกของ

export default router;