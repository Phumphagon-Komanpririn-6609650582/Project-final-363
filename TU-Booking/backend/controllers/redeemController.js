import RedeemHistory from '../models/RedeemHistory.js';
import User from '../models/User.js';
import Reward from '../models/Reward.js'; // นำเข้า Model ของรางวัลมาเช็คแต้ม/ชื่อจริง

// ฟังก์ชันที่ 1: จัดการแลกของรางวัลหักแต้ม (เวอร์ชันแก้ไขบั๊กฝังล็อคสถานะ)
export const redeemReward = async (req, res) => {
  try {
    const { studentId, rewardId } = req.body; 

    // 1. เช็คข้อมูลผู้ใช้และแต้มจริงใน DB
    const user = await User.findOne({ studentId });
    if (!user) return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ใช้งาน' });

    // 2. เช็คข้อมูลของรางวัลจริงใน DB
    const reward = await Reward.findById(rewardId);
    if (!reward) return res.status(404).json({ message: 'ไม่พบข้อมูลของรางวัลนี้' });

    // 3. ตรวจสอบแต้มจริง
    if (user.points < reward.points) {
      return res.status(400).json({ message: 'แต้มสะสมของคุณไม่เพียงพอ' });
    }

    // 4. เจนรหัสสิทธิ์รับรางวัลที่ฝั่งหลังบ้าน
    const generatedTicketCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 5. หักแต้มผู้ใช้และเซฟลง DB
    user.points -= reward.points;
    await user.save();

    // 6. [แก้ไขจุดบั๊ก] บันทึกประวัติการแลกรางวัล บังคับใส่สถานะ 'ยังไม่ใช้งาน' แน่นๆ ลงเอกสารเบสเลย
    const history = new RedeemHistory({
      studentId,
      rewardId,
      rewardName: reward.name, 
      pointsUsed: reward.points, 
      ticketCode: generatedTicketCode,
      status: 'ยังไม่ใช้งาน' // 🔥 ฝังตรงๆ ป้องกันปัญหาฟิลด์ขาดหายในบาง Document
    });
    await history.save();

    // 7. ส่งแต้มใหม่กับรหัสตั๋วกลับไปให้หน้าบ้านแสดงผล
    res.status(200).json({ 
      message: '✅ แลกของรางวัลสำเร็จ', 
      newPoints: user.points,
      ticketCode: generatedTicketCode 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้อง' });
  }
};

// ฟังก์ชันที่ 2: ดึงประวัติการแลกของรางวัลของนักศึกษา (ของเดิม)
export const getMyRewardsHistory = async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) return res.status(400).json({ message: 'ไม่พบรหัสนักศึกษา' });

    const history = await RedeemHistory.find({ studentId }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลประวัติรางวัลได้' });
  }
};

// 👉 🎯 ฟังก์ชันที่ 3: ดึงรายการประวัติการแลกทั้งหมดในระบบส่งให้ Admin
export const getAdminRedeemList = async (req, res) => {
  try {
    const list = await RedeemHistory.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (error) {
    console.error('❌ ดึงรายการของรางวัลฝั่งแอดมินขัดข้อง:', error);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลรายการแลกรางวัลได้' });
  }
};

// 👉 🎯 ฟังก์ชันที่ 4: อัปเดตสถานะสิทธิ์ตั๋วเป็น 'ใช้งานแล้ว' เมื่อแอดมินกดอนุมัติ
export const approveRedeemStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRedeem = await RedeemHistory.findByIdAndUpdate(
      id,
      { status: 'ใช้งานแล้ว' },
      { new: true } 
    );

    if (!updatedRedeem) {
      return res.status(404).json({ message: 'ไม่พบรายการรหัสของรางวัลชิ้นนี้ในระบบ' });
    }

    res.status(200).json({ message: '✅ อัปเดตสิทธิ์การรับของรางวัลสำเร็จเรียบร้อยเพื่อนรัก!', updatedRedeem });
  } catch (error) {
    console.error('❌ อัปเดตสิทธิ์ตั๋วรางวัลล้มเหลว:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' });
  }
};