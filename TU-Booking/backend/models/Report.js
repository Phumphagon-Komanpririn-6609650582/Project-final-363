import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  facilityName: { type: String, required: true },
  roomName: { type: String, required: true },
  userEmail: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  date: { type: String, required: true }
}, { 
  timestamps: true 
});

export default mongoose.model('Report', reportSchema);