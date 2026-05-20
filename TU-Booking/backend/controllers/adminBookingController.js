import Booking from '../models/Booking.js';
import User from '../models/User.js';

// ดึงรายการจองทั้งหมด 
export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: { $ne: 'ยกเลิกแล้ว' } }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลรายการจองได้' });
  }
};

export const approveBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(id, { status: 'เช็คอินเรียบร้อย' }, { new: true });

    if (!booking) {
      return res.status(404).json({ message: 'ไม่พบรายการจองนี้ในระบบ' });
    }

    const user = await User.findOne({ studentId: booking.studentId });
    
    if (!user) {
      console.log(`⚠️ อนุมัติการจองสำเร็จ แต่ไม่พบรหัสนักศึกษา ${booking.studentId} ในระบบเพื่ออัปเดตแต้ม`);
      return res.status(200).json({ 
        message: 'อนุมัติการเช็คอินเรียบร้อย แต่ไม่สามารถเพิ่มแต้มสะสมได้เนื่องจากไม่พบรหัสนักศึกษานี้ในระบบโปรไฟล์',
        booking 
      });
    }

    user.points = (user.points || 0) + 2;
    await user.save();

    console.log(`✅ อัปเดตแต้มสะสมให้นักศึกษารหัส ${booking.studentId} เรียบร้อย: +2 แต้ม (แต้มปัจจุบัน: ${user.points} Pt.)`);

    return res.status(200).json({ 
      message: '✅ อนุมัติการเช็คอินสำเร็จ และเพิ่มแต้มสะสมให้นักศึกษาจำนวน 2 แต้มเรียบร้อยแล้ว!', 
      booking,
      user 
    });

  } catch (error) {
    console.error('Error approving booking and adding points:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอนุมัติเช็คอินและอัปเดตแต้มรางวัล' });
  }
};

// อัปเดตสถานะ: ปฏิเสธการจองพร้อมส่งเหตุผล
export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectReason } = req.body;
    const booking = await Booking.findByIdAndUpdate(id, { status: 'ปฏิเสธการจอง', rejectReason }, { new: true });
    res.status(200).json({ message: '❌ ปฏิเสธการจองเรียบร้อย', booking });
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
};

// ลงโทษกรณีไม่มาตามนัด
export const penaltyNoShow = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'ไม่พบรายการจองนี้ในระบบ' });
    }

    booking.status = 'ไม่มาตามนัด';
    await booking.save();
    console.log(`เปลี่ยนสถานะการจองเป็นไม่มาตามนัดเรียบร้อย`);

    const user = await User.findOne({ studentId: booking.studentId });
    
    if (!user) {
      console.log(`ไม่พบนักศึกษา`);
      return res.status(200).json({ 
        message: 'เปลี่ยนสถานะการจองเป็นไม่มาตามนัดเรียบร้อย แต่ไม่สามารถหักจุดแดงได้เนื่องจากไม่พบรหัสนักศึกษานี้ในระบบโปรไฟล์',
        booking 
      });
    }

    user.noShowCount = (user.noShowCount || 0) + 1;

    if (user.noShowCount >= 3) {
      user.status = 'ถูกระงับสิทธิ์';
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      user.banUntil = futureDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    await user.save();
    console.log(`อัปเดตประวัติ User ${booking.studentId} เรียบร้อย: No-Show = ${user.noShowCount}`);

    return res.status(200).json({ 
      message: 'ลงโทษสำเร็จ', 
      booking,
      user 
    });

  } catch (error) {
    console.error('เซิร์ฟเวอร์ขัดข้อง', error);
    return res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้อง' });
  }
};

// ดึงรายชื่อนักศึกษาทั้งหมดในระบบ
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).sort({ studentId: 1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ message: 'ไม่สามารถดึงรายชื่อผู้ใช้งานได้' });
  }
};

// ปลดระงับสิทธิ์และรีเซ็ตประวัติความประพฤติ
export const clearUserPenalty = async (req, res) => {
  try {
    const { studentId } = req.params; 

    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลนักศึกษารายนี้ในระบบ' });
    }

    user.status = 'ปกติ';
    user.noShowCount = 0;   
    user.banUntil = null;  
    
    await user.save();

    res.status(200).json({ message: '🎉 ปลดแบนและรีเซ็ตประวัติความประพฤติให้นักศึกษาเรียบร้อย', user });
  } catch (error) {
    console.error('❌ Error clearing user penalty:', error);
    res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้อง ไม่สามารถปลดระงับสิทธิ์ได้' });
  }
};