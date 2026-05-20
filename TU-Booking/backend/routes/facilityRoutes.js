import express from 'express';
import { 
  getAllFacilities, 
  getFacilityById, 
  getAdminFacilities,    
  toggleFacilityStatus   
} from '../controllers/facilityController.js';

const router = express.Router();

router.get('/', getAllFacilities);

router.get('/admin-list', getAdminFacilities);
router.post('/toggle/:id', toggleFacilityStatus);

router.get('/:id', getFacilityById);

export default router;