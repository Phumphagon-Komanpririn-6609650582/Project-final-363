import express from 'express';
import { 
  createReport, 
  getAdminReports, 
  updateReportStatus, 
  deleteReport 
} from '../controllers/reportController.js';

const router = express.Router();

router.post('/create', createReport);              // นศ. ส่งแจ้งชำรุด
router.get('/admin/list', getAdminReports);         // แอดมินดึงรายการทั้งหมด
router.put('/admin/update/:id', updateReportStatus); // แอดมินกดปิดงานซ่อม
router.delete('/admin/delete/:id', deleteReport);    // แอดมินกดลบประวัติซ่อม

export default router;