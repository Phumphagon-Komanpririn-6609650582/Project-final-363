import Facility from '../models/Facility.js';

// 1. ดึงข้อมูลสถานที่ทั้งหมด (รองรับการกรองตามหมวดหมู่ด้วย)
export const getAllFacilities = async (req, res) => {
  try {
    // ถ้ายิงมาแบบ /api/facilities?type=Sport มันจะดึงแค่ Sport ไปโชว์หน้า Sport.jsx
    const { type } = req.query; 
    let query = {};
    
    if (type) {
      query.type = type;
    }

    const facilities = await Facility.find(query);
    res.status(200).json(facilities);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้อง ไม่สามารถดึงข้อมูลได้' });
  }
};

// 2. ดึงข้อมูลสถานที่แค่ห้องเดียว (เผื่อใช้ตอนกดเข้าดูรายละเอียด)
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