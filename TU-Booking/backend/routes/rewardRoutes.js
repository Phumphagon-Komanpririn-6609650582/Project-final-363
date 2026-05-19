import express from 'express';
import { getAllRewards, createReward } from '../controllers/rewardController.js';

const router = express.Router();

// GET: ดึงข้อมูลไปโชว์หน้าเว็บ / POST: เอาไว้ให้มึงยิงแอดข้อมูลผ่าน Postman
router.get('/', getAllRewards);
router.post('/add', createReward);

export default router;