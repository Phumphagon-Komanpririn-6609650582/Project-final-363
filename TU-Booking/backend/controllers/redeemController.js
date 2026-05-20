import RedeemHistory from '../models/RedeemHistory.js';
import User from '../models/User.js';
import Reward from '../models/Reward.js'; 

//จัดการแลกของรางวัลหักแต้ม
export const redeemReward = async (req, res) => {
  try {
    const { studentId, rewardId } = req.body; 

    const user = await User.findOne({ studentId });
    if (!user) return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ใช้งาน' });

    const reward = await Reward.findById(rewardId);
    if (!reward) return res.status(404).json({ message: 'ไม่พบข้อมูลของรางวัลนี้' });

    if (user.points < reward.points) {
      return res.status(400).json({ message: 'แต้มสะสมของคุณไม่เพียงพอ' });
    }

    const generatedTicketCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    user.points -= reward.points;
    await user.save();

    const history = new RedeemHistory({
      studentId,
      rewardId,
      rewardName: reward.name, 
      pointsUsed: reward.points, 
      ticketCode: generatedTicketCode,
      status: 'ยังไม่ใช้งาน'
    });
    await history.save();

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

//ดึงประวัติการแลกของรางวัลของนักศึกษา
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

// ดึงรายการประวัติการแลกทั้งหมดในระบบส่งให้ Admin
export const getAdminRedeemList = async (req, res) => {
  try {
    const list = await RedeemHistory.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (error) {
    console.error('❌ ดึงรายการของรางวัลฝั่งแอดมินขัดข้อง:', error);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลรายการแลกรางวัลได้' });
  }
};

//อัปเดตสถานะเป็น ใช้งานแล้ว เมื่อแอดมินกดอนุมัติ
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

    res.status(200).json({ message: '✅ อัปเดตการรับของรางวัลสำเร็จเรียบร้อย', updatedRedeem });
  } catch (error) {
    console.error('❌ อัปเดตสิทธิ์ตั๋วรางวัลล้มเหลว:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' });
  }
};