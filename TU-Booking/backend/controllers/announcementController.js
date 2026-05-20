import Announcement from '../models/Announcement.js';

//ดึงข้อมูลประกาศทั้งหมด
export const getAnnouncements = async (req, res) => {
  try {
    const list = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
};

//สร้างประกาศข่าวสารใหม่
export const createAnnouncement = async (req, res) => {
  try {
    const { type, message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'กรุณาระบุข้อความประกาศ' });
    }

    const newAnnouncement = new Announcement({
      type,
      message,
      date: new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })
    });

    await newAnnouncement.save();
    res.status(201).json({ message: 'สร้างประกาศข่าวสารสำเร็จ', announcement: newAnnouncement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างประกาศ' });
  }
};

//ลบประกาศออกจากระบบ
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Announcement.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'ไม่พบประกาศที่ต้องการลบ' });
    }
    
    res.status(200).json({ message: 'ลบประกาศออกจากระบบสำเร็จ' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบประกาศ' });
  }
};