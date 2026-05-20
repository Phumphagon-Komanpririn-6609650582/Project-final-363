import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  type: { type: String, enum: ['info', 'warning', 'success'], required: true },
  message: { type: String, required: true },
  date: { type: String, required: true } 
}, { 
  timestamps: true 
});

export default mongoose.model('Announcement', announcementSchema);