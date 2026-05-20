import express from 'express';
import { 
  redeemReward, 
  getMyRewardsHistory, 
  getAdminRedeemList, 
  approveRedeemStatus 
} from '../controllers/redeemController.js';

const router = express.Router();

router.post('/exchange', redeemReward);
router.get('/my-rewards', getMyRewardsHistory);


router.get('/admin/list', getAdminRedeemList);
router.put('/admin/approve/:id', approveRedeemStatus);

export default router;