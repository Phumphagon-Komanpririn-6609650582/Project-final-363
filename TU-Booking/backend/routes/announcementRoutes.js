import express from 'express';
import { 
  getAnnouncements, 
  createAnnouncement, 
  deleteAnnouncement 
} from '../controllers/announcementController.js';

const router = express.Router();

router.get('/list', getAnnouncements);
router.post('/create', createAnnouncement);
router.delete('/delete/:id', deleteAnnouncement);

export default router;