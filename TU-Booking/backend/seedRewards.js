import mongoose from 'mongoose';
import Reward from './models/Reward.js'; // เช็คพาร์ทไฟล์ Model ดีๆ ว่าตรงไหม

// 1. เชื่อมต่อฐานข้อมูล MongoDB (อิงตามเซิร์ฟเวอร์หลักของมึง)
mongoose.connect('mongodb://127.0.0.1:27017/tu_booking')
  .then(() => console.log('✅ [Seed] เชื่อมต่อ MongoDB สำเร็จ! กำลังล้างและลงข้อมูล...'))
  .catch((err) => {
    console.error('❌ [Seed] เชื่อมต่อ MongoDB ล้มเหลว:', err);
    process.exit(1);
  });

// 2. เตรียมชุดข้อมูลของรางวัลที่จะเอาเข้าฐานข้อมูล
const rewardsData = [
  {
    name: 'น้ำดื่ม TU',
    points: 20,
    category: 'ทั่วไป',
    icon: 'fa-solid fa-bottle-water',
    color: '#4A90E2'
  },
  {
    name: 'ดินสอ 2B / ปากกาน้ำเงิน',
    points: 15,
    category: 'ทั่วไป',
    icon: 'fa-solid fa-pen',
    color: '#F5A623'
  },
  {
    name: 'ขนมขบเคี้ยว (Snack)',
    points: 30,
    category: 'ทั่วไป',
    icon: 'fa-solid fa-cookie',
    color: '#D0021B'
  },
  {
    name: 'ฟรี! คาราโอเกะ 1 ชั่วโมง',
    points: 100,
    category: 'บันเทิง',
    icon: 'fa-solid fa-microphone',
    color: '#BD10E0'
  }
];

// 3. ฟังก์ชันหลักในการยัดข้อมูลลง DB
const seedDB = async () => {
  try {
    // ล้างข้อมูลเก่าในคอลเลกชัน Reward ออกก่อน (กันข้อมูลซ้ำซ้อนตอนรันซ้ำ)
    await Reward.deleteMany({});
    console.log('🗑️ ล้างข้อมูลเก่าในคอลเลกชัน Reward เรียบร้อย');

    // ยัดข้อมูลใหม่ทั้งหมดเข้าไปรวดเดียว
    await Reward.insertMany(rewardsData);
    console.log('🎉 เสกข้อมูลของรางวัลเข้า MongoDB สำเร็จครบถ้วนแล้วเพื่อน!');
    
    // รันเสร็จแล้วปิดการเชื่อมต่อฐานข้อมูล
    mongoose.connection.close();
    console.log('🔌 ปิดการเชื่อมต่อฐานข้อมูลเรียบร้อย');
    process.exit(0);
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการ Seed ข้อมูล:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// สั่งรันฟังก์ชัน
seedDB();