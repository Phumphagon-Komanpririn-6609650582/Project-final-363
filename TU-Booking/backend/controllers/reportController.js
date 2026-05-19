import Report from '../models/Report.js';

// 📝 1. สร้างรายงานสิ่งชำรุดใหม่ (ตัวเดิมที่มึงมีอยู่แล้ว)
export const createReport = async (req, res) => {
  try {
    const { bookingId, facilityName, userEmail, description } = req.body;
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'กรุณาระบุรายละเอียดการชำรุดด้วยครับ' });
    }
    const newReport = new Report({
      bookingId,
      facilityName,
      userEmail,
      description,
      date: new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })
    });
    await newReport.save();
    res.status(201).json({ message: '✅ ส่งรายงานสิ่งชำรุดเรียบร้อย' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
};

// 📥 2. [เพิ่มใหม่] ดึงรายการรายงานสิ่งชำรุดทั้งหมดให้ฝั่ง Admin
export const getAdminReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }); // เรียงจากใบแจ้งล่าสุดขึ้นก่อน
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลรายการแจ้งซ่อมได้' });
  }
};

// 🔄 3. [เพิ่มใหม่] อัปเดตสถานะงานซ่อม หรือ ลบประวัติกรณีสับเปลี่ยนสถานะสำเร็จ
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // รับค่า 'resolved' เพื่อปิดงาน

    const updated = await Report.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'ไม่พบประวัติใบนี้' });

    res.status(200).json({ message: '🔧 อัปเดตสถานะงานช่างสำเร็จแล้วเพื่อน!', updated });
  } catch (error) {
    res.status(500).json({ message: 'อัปเดตสถานะขัดข้อง' });
  }
};

// 🗑️ 4. [เพิ่มใหม่] ลบประวัติใบแจ้งซ่อมออกจากฐานข้อมูลเด็ดขาด
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    await Report.findByIdAndDelete(id);
    res.status(200).json({ message: '🗑️ ลบประวัติแจ้งซ่อมออกจากระบบเรียบร้อย' });
  } catch (error) {
    res.status(500).json({ message: 'ลบประวัติล้มเหลว' });
  }
};