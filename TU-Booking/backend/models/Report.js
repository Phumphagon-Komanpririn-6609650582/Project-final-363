import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  facilityName: { type: String, required: true }, // ชื่อสถานที่/ห้อง/สนาม
  userEmail: { type: String, required: true },    // อีเมลผู้แจ้ง
  description: { type: String, required: true }, // รายละเอียดสิ่งที่ชำรุด
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' }, // สถานะการซ่อม
  date: { type: String, required: true }         // วันที่รายงาน
}, { 
  timestamps: true 
});

export default mongoose.model('Report', reportSchema);