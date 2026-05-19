import Booking from '../models/Booking.js';
import User from '../models/User.js';

// ==========================================
// 📥 SECTION 1: จัดการรายการคำขอจอง (Bookings)
// ==========================================

// 1. ดึงรายการจองทั้งหมด (🛡️ ซ่อนสถานะ "ยกเลิกแล้ว" ออกไปตามบรีฟมึงเลย จะได้ไม่รกตาราง)
export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: { $ne: 'ยกเลิกแล้ว' } }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลรายการจองได้' });
  }
};

// 2. อัปเดตสถานะ: แอดมินกดอนุมัติการเช็คอิน (เมื่อมาทันเวลา)
export const approveBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(id, { status: 'เช็คอินเรียบร้อย' }, { new: true });
    res.status(200).json({ message: '✅ อนุมัติการเช็คอินเรียบร้อย', booking });
  } catch (error) {
    console.error('Error approving booking:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอนุมัติ' });
  }
};

// 3. อัปเดตสถานะ: ปฏิเสธการจองพร้อมส่งเหตุผล
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

// 4. 🚨 ลงโทษกรณีไม่มาตามนัด (No-show) เปลี่ยนสถานะใบจอง และหักแต้มจุดแดงทันที
export const penaltyNoShow = async (req, res) => {
  try {
    const { id } = req.params;
    
    // ค้นหาใบจองชิ้นนั้นก่อน
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: '❌ ไม่พบรายการจองนี้ในระบบ' });
    }

    // 🎯 1. บังคับเปลี่ยนสถานะในตาราง Booking ทันที
    booking.status = 'ไม่มาตามนัด';
    await booking.save();
    console.log(`📌 เปลี่ยนสถานะใบจอง ${id} เป็น "ไม่มาตามนัด" เรียบร้อย`);

    // 🎯 2. วิ่งไปค้นหาตัวนักศึกษาด้วย studentId จากใบจองใบนี้
    const user = await User.findOne({ studentId: booking.studentId });
    
    if (!user) {
      console.log(`⚠️ ไม่พบไอดีนักศึกษา ${booking.studentId} ในตาราง User (อาจใช้ ID จำลองเทส)`);
      return res.status(200).json({ 
        message: '⚠️ เปลี่ยนสถานะใบจองแล้ว แต่ไม่สามารถหักจุดแดงได้เนื่องจากไม่พบรหัสนักศึกษานี้ในระบบโปรไฟล์',
        booking 
      });
    }

    // 🎯 3. มีผู้ใช้อยู่จริง ทำการบวกแต้มผิดนัดสะสม (noShowCount)
    user.noShowCount = (user.noShowCount || 0) + 1;

    // ถ้าผิดนัดสะสมครบ 3 หน เปลี่ยนสถานะเป็น ถูกระงับสิทธิ์ และบันทึกวันแบนล่วงหน้า 7 วัน
    if (user.noShowCount >= 3) {
      user.status = 'ถูกระงับสิทธิ์';
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      user.banUntil = futureDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    await user.save();
    console.log(`✅ อัปเดตประวัติ User ${booking.studentId} เรียบร้อย: No-Show = ${user.noShowCount}`);

    return res.status(200).json({ 
      message: '⚠️ ลงบันทึกประวัติ No-show และหักจุดประพฤตินักศึกษาสำเร็จ!', 
      booking,
      user 
    });

  } catch (error) {
    console.error('❌ คอนโทรลเลอร์ทำโทษพัง:', error);
    return res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้องในการดำเนินการลงโทษ' });
  }
};

// ==========================================
// 👤 SECTION 2: จัดการรายชื่อผู้ใช้งาน (Users)
// ==========================================

// 5. 🌐 ดึงรายชื่อนักศึกษาทั้งหมดในระบบ (พร้อมสถิติ No-show เพื่อนำไปใช้แสดงในตารางแอดมิน)
export const getAdminUsers = async (req, res) => {
  try {
    // ดึงเฉพาะบัญชีที่เป็นนักศึกษา (student) เรียงจากรหัสจากน้อยไปมาก
    const users = await User.find({ role: 'student' }).sort({ studentId: 1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error fetching admin users:', error);
    res.status(500).json({ message: 'ไม่สามารถดึงรายชื่อผู้ใช้งานได้' });
  }
};

// 6. 🔓 ฟังก์ชันฉุกเฉิน: ปลดล็อกระงับสิทธิ์และรีเซ็ตแต้ม No-show ทั้งหมดให้กลับเป็น 0 ทันที
export const clearUserPenalty = async (req, res) => {
  try {
    const { studentId } = req.params; // รับรหัสนักศึกษาผ่านทาง URL Parameter

    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลนักศึกษารายนี้ในระบบ' });
    }

    // 🔥 ล้างมลทินกู้ประวัติระบบเอ๋อกลับเป็นค่าเริ่มต้นปกติ
    user.status = 'ปกติ';
    user.noShowCount = 0;   // จุดสีแดงหน้านักศึกษาจะดับวูบกลับเป็นสีเขียว 3 ดวงทันที
    user.banUntil = null;   // ล้างวันหมดอายุการแบนทิ้งทั้งหมด
    
    await user.save();
    console.log(`🔓 ปลดล็อกระบบกู้คืนบัญชีนักศึกษา ID: ${studentId} สำเร็จเรียบร้อยแล้วเพื่อน!`);

    res.status(200).json({ message: '🎉 ปลดแบนและรีเซ็ตประวัติความประพฤติให้นักศึกษาเรียบร้อยแล้วเพื่อน!', user });
  } catch (error) {
    console.error('❌ Error clearing user penalty:', error);
    res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้อง ไม่สามารถปลดระงับสิทธิ์ได้' });
  }
};