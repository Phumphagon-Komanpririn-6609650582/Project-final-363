import express from 'express';
import { 
  getAllFacilities, 
  getFacilityById, 
  getAdminFacilities,    
  toggleFacilityStatus   
} from '../controllers/facilityController.js';

const router = express.Router();

// 👤 Routes สำหรับฝั่งนักศึกษา (User)
router.get('/', getAllFacilities);

// 👑 Routes สำหรับฝั่งผู้ดูแลระบบ (Admin) - 🔥 ย้ายขึ้นมาไว้ตรงนี้ก่อนกติกา /:id
router.get('/admin-list', getAdminFacilities);       // หน้าบ้านแอดมินจะวิ่งเข้าท่อนี้ได้ถูกต้องแล้ว!
router.post('/toggle/:id', toggleFacilityStatus);    

// 👤 ท่อรับ ID ย้ายมาไว้ล่างสุด
router.get('/:id', getFacilityById);

export default router;