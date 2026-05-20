import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  studentId: { type: String, required: true }, 
  facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
  facilityName: { type: String, required: true }, 
  roomName: { type: String, required: true },     
  bookingDate: { type: String, required: true },  
  timeSlot: { type: String, required: true },
  type: { type: String, required: true }, 
  bookingCode: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['รอการเช็คอิน', 'เช็คอินเรียบร้อย', 'ปฏิเสธการจอง', 'ไม่มาตามนัด', 'ยกเลิกแล้ว'], 
    default: 'รอการเช็คอิน' 
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Booking', bookingSchema);