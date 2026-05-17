import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
  type: { type: String, enum: ['Sport', 'Karaoke', 'Study'], required: true }, // หมวดหมู่ใหญ่
  name: { type: String, required: true },         // ชื่อสถานที่หลัก เช่น 'Melody Sphere Zone Karaoke'
  room: { type: String, required: true },         // ชื่อห้องย่อย เช่น 'Karaoke size M Room 1'
  status: { type: String, enum: ['เปิดให้บริการ', 'ปิดปรับปรุง'], default: 'เปิดให้บริการ' }, // สถานะ
  desc: { type: String, default: '' },            // คำอธิบายเพิ่มเติม
  img: { type: String, default: '' },             // ลิงก์รูปภาพสถานที่
  slots: { type: [String], required: true }       // 👉 เพิ่มบรรทัดนี้เข้ามา เพื่อเก็บอาร์เรย์เวลาของแต่ละห้อง!
}, { 
  timestamps: true 
});

export default mongoose.model('Facility', facilitySchema);