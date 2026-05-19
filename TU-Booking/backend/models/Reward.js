import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    default: 'ทั่วไป'
  },
  icon: {
    type: String,
    default: 'fa-solid fa-gift' // กรณีใช้ FontAwesome
  },
  img: {
    type: String,
    default: '' // กรณีใส่ลิงก์รูปภาพ
  },
  color: {
    type: String,
    default: '#4A90E2' // สีประจำการ์ดของรางวัล
  }
}, { timestamps: true });

const Reward = mongoose.model('Reward', rewardSchema);
export default Reward;