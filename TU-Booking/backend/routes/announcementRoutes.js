import express from 'express';
import { 
  getAnnouncements, 
  createAnnouncement, 
  deleteAnnouncement 
} from '../controllers/announcementController.js';

const router = express.Router();

router.get('/list', getAnnouncements);         // ท่อดึงประกาศ (ใช้ร่วมกันทั้ง นศ. และ แอดมิน)
router.post('/create', createAnnouncement);     // ท่อแอดมินสร้างประกาศใหม่
router.delete('/delete/:id', deleteAnnouncement); // ท่อแอดมินลบประกาศ

export default router;