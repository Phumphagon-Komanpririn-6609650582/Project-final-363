import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },                    
  role: { type: String, enum: ['student', 'admin'], default: 'student' }, 
  points: { type: Number, default: 150 },                    
  noShowCount: { type: Number, default: 0 },                
  status: { type: String, enum: ['ปกติ', 'ถูกระงับสิทธิ์'], default: 'ปกติ' }, 
  banUntil: { type: String, default: null },                 
  expireDate: { type: String, default: '22/08/2027' }        
}, { 
  timestamps: true 
});

export default mongoose.model('User', userSchema);