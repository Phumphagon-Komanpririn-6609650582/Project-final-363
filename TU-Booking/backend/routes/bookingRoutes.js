import express from 'express';
import { 
  createBooking, 
  getMyBookings, 
  cancelBooking 
} from '../controllers/bookingController.js';

import { 
  getAdminBookings, 
  approveBooking, 
  rejectBooking, 
  penaltyNoShow,
  getAdminUsers,
  clearUserPenalty
} from '../controllers/adminBookingController.js';

const router = express.Router();

router.post('/reserve', createBooking);
router.get('/my-history', getMyBookings);
router.post('/cancel/:id', cancelBooking);


router.get('/admin/list', getAdminBookings);
router.put('/admin/approve/:id', approveBooking);
router.put('/admin/reject/:id', rejectBooking);
router.put('/admin/penalty/:id', penaltyNoShow);

router.get('/admin/users', getAdminUsers);
router.put('/admin/clear-penalty/:studentId', clearUserPenalty);

export default router;