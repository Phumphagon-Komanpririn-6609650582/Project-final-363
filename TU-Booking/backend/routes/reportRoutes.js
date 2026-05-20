import express from 'express';
import { 
  createReport, 
  getAdminReports, 
  updateReportStatus, 
  deleteReport 
} from '../controllers/reportController.js';

const router = express.Router();

router.post('/create', createReport);
router.get('/admin/list', getAdminReports);
router.put('/admin/update/:id', updateReportStatus);
router.delete('/admin/delete/:id', deleteReport);

export default router;