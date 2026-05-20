import Booking from '../models/Booking.js';
import User from '../models/User.js'; 

export const createBooking = async (req, res) => {
  try {
    const { studentId, facilityId, facilityName, roomName, bookingDate, timeSlot, type } = req.body;

    // แบนสะสมครบ 3 ครั้งของนักศึกษา
    const user = await User.findOne({ studentId });
    
    if (user && user.status === 'ถูกระงับสิทธิ์') {
      if (user.banUntil) {
        const [banD, banM, banY] = user.banUntil.split('/');
        let calculatedBanYear = parseInt(banY);
        if (calculatedBanYear > 2500) calculatedBanYear = calculatedBanYear - 543;

        const banDateTime = new Date(calculatedBanYear, parseInt(banM) - 1, parseInt(banD), 23, 59, 59);
        const now = new Date();

        if (now < banDateTime) {
          // ยังไม่พ้นกำหนดแบน 7 วัน 
          return res.status(403).json({ 
            message: `❌ บัญชีของคุณถูกระงับสิทธิ์การจองชั่วคราวเนื่องจากไม่มาเช็คอินครบ 3 ครั้ง จะสามารถใช้งานได้อีกครั้งหลังจากวันที่ ${user.banUntil} ` 
          });
        } else {
          user.status = 'ปกติ';
          user.noShowCount = 0;
          user.banUntil = null;
          await user.save();
        }
      }
    }

    // ตรวจสอบเวลาฝั่งหลังบ้านทำให้ไม่สามารถจองอดีตได้
    try {
      const [d, m, y] = bookingDate.split('/');
      let year = parseInt(y);
       
      if (year < 100) year = year + 2500 - 543;
      else if (year > 2500) year = year - 543;

      const startTime = timeSlot.split('-')[0].trim();
      const [hh, mm] = startTime.split(':');

      const slotDateTime = new Date(year, parseInt(m) - 1, parseInt(d), parseInt(hh), parseInt(mm));
      const now = new Date();

      if (slotDateTime < now) {
        return res.status(400).json({ message: '❌ ไม่สามารถจองย้อนหลัง หรือจองรอบเวลาที่ผ่านไปแล้วได้' });
      }
    } catch (err) {
      console.error('Time validation parsing error:', err);
      return res.status(400).json({ message: 'รูปแบบวันที่หรือเวลาไม่ถูกต้อง' });
    }

    // เช็คการจองซ้ำในฐานข้อมูล ถ้ายกเลิกสามารถจองได้
    const existingBooking = await Booking.findOne({
      facilityId,
      bookingDate,
      timeSlot,
      status: { $ne: 'ยกเลิกแล้ว' }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'ช่วงเวลานี้มีคนจองแล้ว' });
    }

    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    //สร้างการจองใหม่พร้อมบันทึกข้อมูลลงฐานข้อมูล
    const newBooking = new Booking({
      studentId,
      facilityId,
      facilityName,
      roomName,
      bookingDate,
      timeSlot,
      type,            
      bookingCode: generatedCode,
      status: 'รอการเช็คอิน' 
    });

    await newBooking.save();
    res.status(201).json({ message: 'บันทึกการจองสำเร็จ!', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้อง' });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const { studentId } = req.query; 
    
    if (!studentId) return res.status(400).json({ message: 'ไม่พบรหัสนักศึกษา' });

    const bookings = await Booking.find({ studentId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลได้' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'ไม่พบรายการจอง' });
    }

    // ป้องกันการยกเลิกซ้ำ
    if (booking.status === 'ยกเลิกแล้ว') {
      return res.status(400).json({ message: 'รายการนี้ถูกยกเลิกไปแล้ว' });
    }

    // คำนวณเวลาฝั่งเซิร์ฟเวอร์สำหรับการยกเลิก ต้องมากกว่า 2 ชั่วโมง
    const [d, m, y] = booking.bookingDate.split('/');
    let year = parseInt(y);
    if (year < 100) year = year + 2500 - 543;
    else if (year > 2500) year = year - 543;

    const startTime = booking.timeSlot.split('-')[0].trim();
    const [hh, mm] = startTime.split(':');

    const bookingDateTime = new Date(year, parseInt(m) - 1, parseInt(d), parseInt(hh), parseInt(mm));
    const now = new Date();
    const diffHours = (bookingDateTime - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return res.status(400).json({ message: '❌ เลยเวลาจองมาแล้ว ไม่สามารถยกเลิกได้' });
    }
    if (diffHours < 2) {
      return res.status(400).json({ message: '❌ ต้องยกเลิกก่อนเวลาจองอย่างน้อย 2 ชั่วโมง' });
    }

    
    booking.status = 'ยกเลิกแล้ว';
    await booking.save();

    res.status(200).json({ message: '✅ ยกเลิกการจองสำเร็จ' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้อง' });
  }
};