import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  type: { type: String, enum: ['info', 'warning', 'success'], required: true },
  message: { type: String, required: true },
  date: { type: String, required: true } // เก็บฟอร์แมตสตริงวันที่ (เช่น 20/05/2026) เพื่อความง่ายในการดึงไปแสดงผล
}, { 
  timestamps: true 
});

export default mongoose.model('Announcement', announcementSchema);