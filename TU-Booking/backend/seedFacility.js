import mongoose from 'mongoose';
import Facility from './models/Facility.js'; 

mongoose.connect('mongodb://127.0.0.1:27017/tu_booking')
  .then(() => console.log('🔌 กำลังเตรียมเสกข้อมูลสถานที่พร้อมสล็อตเวลา...'))
  .catch((err) => console.error('❌ เชื่อมต่อล้มเหลว:', err));

const seedFacilities = async () => {
  try {
    await Facility.deleteMany({});
    console.log('🗑️ ล้างข้อมูลตาราง Facility เก่าเรียบร้อย!');

    // --- เตรียมก้อนเวลาแยกตามพฤติกรรมหน้าบ้านมึง ---
    const karaokeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
    const badmintonGym4Slots = ['17:00', '18:00', '19:00', '20:00'];
    const badmintonInterSlots = ['16:00', '17:00', '18:00', '19:00', '20:00'];
    const tennisSlots = ['16:00', '17:00', '18:00', '19:00', '20:00'];
    const studySlots = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00', '21:00-23:59'];

    const facilitiesData = [
      // ==========================================
      // 🎤 หมวด Karaoke & Music
      // ==========================================
      { type: 'Karaoke', name: 'Melody Sphere Zone Karaoke', room: 'Karaoke size S', desc: 'สามารถเข้าใช้บริการได้ไม่เกิน 4 ท่าน (ค่าสาธารณูปโภค 150/ชม.)', img: 'https://bookyourcourtapi.psm.tu.ac.th/File/DownloadBinaryFile?id=67bcff47-73e7-3081-f721-3a0d2d98bd45', slots: karaokeSlots },
      { type: 'Karaoke', name: 'Melody Sphere Zone Karaoke', room: 'Karaoke size M Room 1', desc: 'สามารถเข้าใช้บริการได้ไม่เกิน 8 ท่าน (ค่าสาธารณูปโภค 180/ชม.)', img: 'https://bookyourcourtapi.psm.tu.ac.th/File/DownloadBinaryFile?id=c311092b-250f-d341-19e9-3a0d2d984e3e', slots: karaokeSlots },
      { type: 'Karaoke', name: 'Melody Sphere Zone Karaoke', room: 'Karaoke size M Room 2', desc: 'สามารถเข้าใช้บริการได้ไม่เกิน 8 ท่าน (ค่าสาธารณูปโภค 180/ชม.)', img: 'https://bookyourcourtapi.psm.tu.ac.th/File/DownloadBinaryFile?id=6847e739-409c-dfa4-7849-3a0d2d981d94', slots: karaokeSlots },
      { type: 'Karaoke', name: 'Melody Sphere Zone Karaoke', room: 'Karaoke size L', desc: 'สามารถเข้าใช้บริการได้ไม่เกิน 12 ท่าน (ค่าสาธารณูปโภค 210/ชม.)', img: 'https://bookyourcourtapi.psm.tu.ac.th/File/DownloadBinaryFile?id=42ba0127-2e94-2a63-f3b2-3a0d2d9786d6', slots: karaokeSlots },
      { type: 'Karaoke', name: 'Melody Sphere Zone Karaoke', room: 'Karaoke size XL', desc: 'สามารถเข้าใช้บริการได้ไม่เกิน 20 ท่าน (ค่าสาธารณูปโภค 250/ชม.)', img: 'https://bookyourcourtapi.psm.tu.ac.th/File/DownloadBinaryFile?id=3ec35189-7e3c-f282-cdef-3a0d2d96eb03', slots: karaokeSlots },
      { type: 'Karaoke', name: 'Melody Sphere Zone Music', room: 'Music Practice Room 1', desc: 'ห้องซ้อมดนตรีพร้อมเครื่องดนตรีมาตรฐานครบครัน (ค่าสาธารณูปโภค 120/ชม.)', img: 'https://bookyourcourtapi.psm.tu.ac.th/File/DownloadBinaryFile?id=cac78969-20f9-8520-17a2-3a0d2d9c5992', slots: karaokeSlots },
      { type: 'Karaoke', name: 'Melody Sphere Zone Music', room: 'Music Practice Room 2', desc: 'ห้องซ้อมดนตรีพร้อมเครื่องดนตรีมาตรฐานครบครัน (ค่าสาธารณูปโภค 120/ชม.)', img: 'https://bookyourcourtapi.psm.tu.ac.th/File/DownloadBinaryFile?id=34233a40-b98e-0435-8643-3a0d2d9cafcb', slots: karaokeSlots },

      // ==========================================
      // 🏸 หมวด Sport
      // ==========================================
      // Badminton Gym 4
      ...['02', '04', '06', '07', '08'].map(id => ({ type: 'Sport', name: 'Badminton Court Gym 4', room: `Badminton Court ${id}`, desc: 'สนามแบดมินตันในร่ม ยิมเนเซียม 4 สภาพสนามมาตรฐานสากล', img: '/assets/BadmintonGym4.png', slots: badmintonGym4Slots })),
      // Badminton Interzone
      ...['02', '03', '04', '05', '07', '08'].map(id => ({ type: 'Sport', name: 'Badminton Court Interzone', room: `Badminton Court ${id}`, desc: 'สนามแบดมินตันโซน Interzone เปิดให้บริการสำหรับนักศึกษา', img: '/assets/BadmintonInterzone.png', slots: badmintonInterSlots })),
      // Tennis Court
      ...['02', '03', '04', '05', '07', '08'].map(id => ({ type: 'Sport', name: 'Tennis Court', room: `Tennis Court ${id}`, desc: 'สนามเทนนิสพื้นผิวมาตรฐาน พร้อมไฟส่องสว่างช่วงเย็น', img: '/assets/TennisCourt.png', slots: tennisSlots })),

      // ==========================================
      // 📚 หมวด Study
      // ==========================================
      // Puey Ungphakorn Library (1-10)
      ...Array.from({ length: 10 }, (_, i) => ({ type: 'Study', name: 'Puey Ungphakorn Library', room: `Study Room ${i + 1}`, desc: 'ห้องศึกษากลุ่มคูลๆ พร้อมสิ่งอำนวยความสะดวก ณ หอสมุดป๋วยฯ', img: '/assets/Study Room Category.png', slots: studySlots })),
      // Krom Luang - Advisor Room (1-4)
      ...Array.from({ length: 4 }, (_, i) => ({ type: 'Study', name: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', room: `Advisor Room ${i + 1}`, desc: 'ห้องสำหรับเข้าพบอาจารย์ที่ปรึกษา หรือประชุมโปรเจกต์ที่เป็นทางการ', img: '/assets/Krom_Luang_Category.png', slots: studySlots })),
      // Krom Luang - Tutoring Room
      ...[1, 2, 3, 4, 5, 7, 8, 9].map(num => ({ type: 'Study', name: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', room: `Tutoring Room${num}`, desc: 'ห้องติวหนังสือกลุ่มย่อย มีกระดานไวท์บอร์ดและหน้าจอทีวีเชื่อมต่อต่อพ่วง', img: '/assets/Krom_Luang_Category.png', slots: studySlots })),
      // Krom Luang - Study Pod (1-20)
      ...Array.from({ length: 20 }, (_, i) => ({ type: 'Study', name: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', room: `Study Pod${i + 1}`, desc: 'พื้นที่นั่งอ่านหนังสือส่วนตัว (Pod) เงียบสงบ โฟกัสงานได้เต็มที่', img: '/assets/Krom_Luang_Category.png', slots: studySlots }))
    ];

    await Facility.insertMany(facilitiesData);
    console.log(`✅ เสกข้อมูลสถานที่พร้อม "สล็อตเวลา" ครบทั้ง ${facilitiesData.length} ห้องลงฐานข้อมูลเรียบร้อยแล้วเพื่อน!`);

    process.exit(); 
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
    process.exit(1);
  }
};

seedFacilities();