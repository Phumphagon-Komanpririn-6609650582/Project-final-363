import express from 'express';
// 👤 นำเข้า Controller ของฝั่งผู้ใช้งานทั่วไป (User)
import { 
  createBooking, 
  getMyBookings, 
  cancelBooking 
} from '../controllers/bookingController.js';

// 👑 นำเข้า Controller ของฝั่งผู้ดูแลระบบ (Admin) 
// 👉 🎯 [จุดที่แก้] เพิ่ม getAdminUsers และ clearUserPenalty เข้ามาในปีกกาอิมพอร์ต
import { 
  getAdminBookings, 
  approveBooking, 
  rejectBooking, 
  penaltyNoShow,
  getAdminUsers,      // นำเข้าฟังก์ชันดึงรายชื่อนักศึกษาทั้งหมด
  clearUserPenalty    // นำเข้าฟังก์ชันด่วนสำหรับปลดแบนรีเซ็ตแต้ม
} from '../controllers/adminBookingController.js';

const router = express.Router();

/* ========================================== */
/* 👤 USER ROUTES (สำหรับระบบนักศึกษาทั่วไป)      */
/* ========================================== */
router.post('/reserve', createBooking);          // ท่อส่งคำขอจองห้อง/สนามใหม่
router.get('/my-history', getMyBookings);        // ท่อดึงประวัติการจองของตนเอง
router.post('/cancel/:id', cancelBooking);       // ท่อสำหรับกดยกเลิกคิวจองด้วยตัวเอง (กฎ 2 ชม.)

/* ========================================== */
/* 👑 ADMIN ROUTES (สำหรับระบบผู้ดูแลหลังบ้าน)     */
/* ========================================== */
router.get('/admin/list', getAdminBookings);       // ท่อดึงคิวจองทั้งหมด (ซ่อนรายการที่ "ยกเลิกแล้ว")
router.put('/admin/approve/:id', approveBooking);  // ท่อกดปุ่มอนุมัติใบจอง
router.put('/admin/reject/:id', rejectBooking);    // ท่อกดปุ่มปฏิเสธใบจองพร้อมส่งเหตุผล
router.put('/admin/penalty/:id', penaltyNoShow);   // ท่อปุ่มด่วนลงโทษนักศึกษาทำผิดกฎ "ไม่มาตามนัด" (No-show)

// 👉 🎯 [จุดที่เพิ่มใหม่] เส้นทาง API สำหรับเชื่อมต่อหน้าจอ AdminManageUsers.jsx
router.get('/admin/users', getAdminUsers);                  // ท่อดึงรายชื่อนักศึกษาทั้งหมดไปแสดงในตาราง
router.put('/admin/clear-penalty/:studentId', clearUserPenalty); // ท่อคลิกปุ่มเขียวเพื่อปลดแบนและล้างแต้ม No-show สดๆ

export default router;