// models/RedeemHistory.js
import mongoose from 'mongoose';

const redeemHistorySchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    index: true // ทำ Index ไว้เพื่อเวลาที่นักศึกษาดึงประวัติส่วนตัว หรือแอดมินค้นหาจะได้เร็วขึ้น
  },
  rewardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reward', // เชื่อมความสัมพันธ์โยงไปหาคอลเลกชัน Reward ของรางวัล
    required: true
  },
  rewardName: {
    type: String,
    required: true
  },
  pointsUsed: {
    type: Number,
    required: true
  },
  ticketCode: {
    type: String,
    required: true,
    unique: true // รหัสตั๋วห้ามซ้ำกันเด็ดขาดในระบบ
  },
  status: {
    type: String,
    enum: ['ยังไม่ใช้งาน', 'ใช้งานแล้ว'],
    default: 'ยังไม่ใช้งาน',
    required: true
  }
}, { 
  timestamps: true // บังคับให้สร้างฟิลด์ createdAt และ updatedAt อัตโนมัติ (สำคัญมากเพราะหน้าบ้านใช้เรียงคิวจากใหม่ไปเก่า)
});

const RedeemHistory = mongoose.model('RedeemHistory', redeemHistorySchema);

export default RedeemHistory;