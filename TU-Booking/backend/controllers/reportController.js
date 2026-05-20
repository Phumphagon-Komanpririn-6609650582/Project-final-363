import Report from '../models/Report.js';

//สร้างรายงานสิ่งชำรุด
export const createReport = async (req, res) => {
  try {
    const { bookingId, facilityName, roomName, userEmail, description } = req.body;
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'กรุณาระบุรายละเอียดการชำรุด' });
    }
    const newReport = new Report({
      bookingId,
      facilityName,
      roomName,
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

//ดึงรายการรายงานสิ่งชำรุดทั้งหมดฝั่ง Admin
export const getAdminReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลรายการแจ้งซ่อมได้' });
  }
};

//อัปเดตสถานะงานซ่อม
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Report.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'ไม่พบประวัติ' });

    res.status(200).json({ message: '🔧 อัปเดตสถานะงานช่างสำเร็จ', updated });
  } catch (error) {
    res.status(500).json({ message: 'อัปเดตสถานะไม่สำเร็จ' });
  }
};

//ลบประวัติแจ้งซ่อมออกจากฐานข้อมูล
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    await Report.findByIdAndDelete(id);
    res.status(200).json({ message: '🗑️ ลบประวัติแจ้งซ่อมออกจากระบบเรียบร้อย' });
  } catch (error) {
    res.status(500).json({ message: 'ลบประวัติล้มเหลว' });
  }
};