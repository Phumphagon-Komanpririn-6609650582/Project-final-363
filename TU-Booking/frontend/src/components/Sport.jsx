import React, { useState, useEffect } from 'react';
// ❌ ไม่ต้อง import รูปตรงๆ จากโฟลเดอร์ assets แล้ว เพราะเราจะดึงลิงก์รูปจาก DB แทน!

function Sport({ onBack, onSelectCourt }) {
  // 👉 1. สร้าง State มารับข้อมูลจาก DB และ State สำหรับตอนกำลังโหลด
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👉 2. ใช้ useEffect เพื่อดึงข้อมูลอัตโนมัติทันทีที่เปิดหน้านี้
  useEffect(() => {
    const fetchSports = async () => {
      try {
        // ยิงไปหลังบ้าน ขอเฉพาะข้อมูลหมวด Sport
        const response = await fetch('http://localhost:4000/api/facilities?type=Sport');
        const data = await response.json();

        // ⚠️ ทริคสำคัญ: เนื่องจากใน DB เราเก็บแยกเป็น "รายคอร์ต" (เช่น Tennis 02, 03)
        // แต่หน้านี้เราต้องการโชว์แค่ "การ์ดสถานที่หลัก" (Tennis Court ใบเดียว)
        // เราเลยต้องเขียนโค้ดกรองเอาเฉพาะชื่อสถานที่ที่ไม่ซ้ำกันมาโชว์!
        const uniqueSports = [];
        const seenNames = new Set();
        
        data.forEach((item) => {
          if (!seenNames.has(item.name)) {
            seenNames.add(item.name);
            uniqueSports.push({
              id: item._id,       // ใช้ ID จาก MongoDB
              name: item.name,    // ชื่อสถานที่หลัก
              img: item.img       // ลิงก์รูปจาก DB (ที่ชี้ไปหาโฟลเดอร์ public)
            });
          }
        });

        setSports(uniqueSports);
        setLoading(false);
      } catch (error) {
        console.error('❌ ดึงข้อมูลล้มเหลว:', error);
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  return (
    <div className="sport-selection-container">
      <div className="breadcrumb" onClick={onBack} style={{ cursor: 'pointer', color: '#666', marginBottom: '1rem' }}>
        <i className="fa-solid fa-chevron-left"></i> ย้อนกลับ
      </div>
      
      {/* 👉 3. ดักไว้ว่าถ้าข้อมูลกำลังมา ให้ขึ้นคำว่า Loading */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <p>กำลังโหลดข้อมูลสนาม...</p>
        </div>
      ) : (
        <div className="sport-card-grid">
          {/* 👉 4. วนลูปการ์ดจากข้อมูลจริงใน DB */}
          {sports.map((sport) => (
            <div key={sport.id} className="sport-item-card" onClick={() => onSelectCourt(sport.name)}>
              <img src={sport.img} alt={sport.name} className="sport-img" />
              <div className="sport-name">{sport.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sport;