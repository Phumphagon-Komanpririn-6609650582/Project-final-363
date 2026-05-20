import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
  type: { type: String, enum: ['Sport', 'Karaoke', 'Study'], required: true },
  name: { type: String, required: true },
  room: { type: String, required: true },
  status: { type: String, enum: ['เปิดให้บริการ', 'ปิดปรับปรุง'], default: 'เปิดให้บริการ' },
  desc: { type: String, default: '' },
  img: { type: String, default: '' },
  slots: { type: [String], required: true }
}, { 
  timestamps: true 
});

export default mongoose.model('Facility', facilitySchema);