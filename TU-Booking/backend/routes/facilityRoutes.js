import express from 'express';
import { getAllFacilities, getFacilityById } from '../controllers/facilityController.js';

const router = express.Router();

// เมื่อมีคนยิง GET มาที่ท่อนี้ ให้วิ่งไปทำงานที่ Controller
router.get('/', getAllFacilities);
router.get('/:id', getFacilityById);

export default router;