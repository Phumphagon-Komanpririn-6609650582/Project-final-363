import express from 'express';
import { getAllRewards, createReward } from '../controllers/rewardController.js';

const router = express.Router();

router.get('/', getAllRewards);
router.post('/add', createReward);

export default router;