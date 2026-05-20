import mongoose from 'mongoose';
import Reward from './models/Reward.js';

mongoose.connect('mongodb://127.0.0.1:27017/tu_booking')
  .then(() => console.log('เชื่อมต่อ MongoDB สำเร็จ! กำลังล้างและลงข้อมูล...'))
  .catch((err) => {
    console.error('❌ [Seed] เชื่อมต่อ MongoDB ล้มเหลว:', err);
    process.exit(1);
  });

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

const seedDB = async () => {
  try {
    await Reward.deleteMany({});
    console.log('ล้างข้อมูลเก่าในคอลเลกชัน Reward เรียบร้อย');

    await Reward.insertMany(rewardsData);
    console.log('เอาข้อมูลลงสำเร็จ');
    
    mongoose.connection.close();
    console.log('ปิดการเชื่อมต่อฐานข้อมูลเรียบร้อย');
    process.exit(0);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการ Seed ข้อมูล:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// สั่งรันฟังก์ชัน
seedDB();