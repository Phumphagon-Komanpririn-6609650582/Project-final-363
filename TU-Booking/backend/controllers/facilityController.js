import Facility from '../models/Facility.js';
import Booking from '../models/Booking.js';

//ดึงข้อมูลสถานที่พร้อมเช็คสถานะการจอง กรองเอาเฉพาะห้องที่ "เปิดให้บริการ"
export const getAllFacilities = async (req, res) => {
  try {
    const { type, date } = req.query; 
    
    let query = { status: 'เปิดให้บริการ' };
    
    if (type) {
      query.type = type;
    }

    const facilities = await Facility.find(query);
    
    const bookings = date 
      ? await Booking.find({ bookingDate: date, status: { $ne: 'ยกเลิกแล้ว' } })
      : await Booking.find({ status: { $ne: 'ยกเลิกแล้ว' } });

    const facilitiesWithStatus = facilities.map(facility => {
      return {
        ...facility._doc,
        slots: facility.slots.map(time => {
          const isBooked = bookings.some(b => 
            b.facilityId.toString() === facility._id.toString() && 
            b.timeSlot === time
          );
          
          return {
            time: time,
            isAvailable: !isBooked 
          };
        })
      };
    });

    res.status(200).json(facilitiesWithStatus);
  } catch (error) {
    console.error('Error fetching facilities with status:', error);
    res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้อง' });
  }
};

//สำหรับ Admin ดึงข้อมูลสถานที่ทั้งหมด เพื่อเอาไปเปิด/ปิดระบบ
export const getAdminFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ type: 1, name: 1 });
    res.status(200).json(facilities);
  } catch (error) {
    console.error('Error fetching admin facilities:', error);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลได้' });
  }
};

//Admin สลับสถานะห้อง ปิดปรับปรุง / เปิดให้บริการ
export const toggleFacilityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findById(id);

    if (!facility) {
      return res.status(404).json({ message: 'ไม่พบสถานที่นี้ในระบบ' });
    }

    if (facility.status === 'เปิดให้บริการ') {
      facility.status = 'ปิดปรับปรุง';
    } else {
      facility.status = 'เปิดให้บริการ';
    }

    await facility.save();
    res.status(200).json({ message: '✅ อัปเดตสถานะสถานที่สำเร็จ', facility });
  } catch (error) {
    console.error('Error toggling facility status:', error);
    res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้อง ไม่สามารถเปลี่ยนสถานะได้' });
  }
};

//ดึงข้อมูลห้องผ่าน ID รายห้อง
export const getFacilityById = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ message: 'ไม่พบสถานที่ที่ต้องการ' });
    }
    res.status(200).json(facility);
  } catch (error) {
    console.error('Error fetching facility by ID:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
};