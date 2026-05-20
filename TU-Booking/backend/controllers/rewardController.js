import Reward from '../models/Reward.js';

//ดึงของรางวัลทั้งหมด
export const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find().sort({ points: 1 });
    res.status(200).json(rewards);
  } catch (error) {
    console.error('❌ Error fetching rewards:', error);
    res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้อง ไม่สามารถดึงข้อมูลได้' });
  }
};

//ฟังก์ชันเพิ่มของรางวัล
export const createReward = async (req, res) => {
  try {
    const { name, points, category, icon, img, color } = req.body;
    
    const newReward = new Reward({
      name,
      points,
      category,
      icon,
      img,
      color
    });

    await newReward.save();
    res.status(201).json({ message: '🎉 เพิ่มของรางวัลสำเร็จ!', reward: newReward });
  } catch (error) {
    console.error('❌ Error creating reward:', error);
    res.status(500).json({ message: 'เซิร์ฟเวอร์ขัดข้อง ไม่สามารถเพิ่มของรางวัลได้' });
  }
};