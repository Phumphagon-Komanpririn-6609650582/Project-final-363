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
    default: 'fa-solid fa-gift'
  },
  img: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#4A90E2'
  }
}, { timestamps: true });

const Reward = mongoose.model('Reward', rewardSchema);
export default Reward;