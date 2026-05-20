// models/RedeemHistory.js
import mongoose from 'mongoose';

const redeemHistorySchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    index: true
  },
  rewardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reward',
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
    unique: true
  },
  status: {
    type: String,
    enum: ['ยังไม่ใช้งาน', 'ใช้งานแล้ว'],
    default: 'ยังไม่ใช้งาน',
    required: true
  }
}, { 
  timestamps: true
});

const RedeemHistory = mongoose.model('RedeemHistory', redeemHistorySchema);

export default RedeemHistory;