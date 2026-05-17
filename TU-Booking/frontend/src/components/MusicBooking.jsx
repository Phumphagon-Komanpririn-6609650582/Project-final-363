import React, { useState, useEffect } from 'react';
import BookingDateSelector from './BookingDateSelector';

function MusicBooking({ onBack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // 👉 1. State สำหรับเก็บข้อมูลห้องซ้อมดนตรีที่ดึงมาจากฐานข้อมูลจริง
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👉 สร้าง State สำหรับวันที่ที่เลือก (เริ่มต้นเป็นวันที่วันนี้)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })
  );

  // 👉 2. ยิง API ไปกวาดข้อมูลห้องซ้อมดนตรีทั้งหมดมาจาก MongoDB
  useEffect(() => {
    const fetchMusicRooms = async () => {
      try {
        setLoading(true);
        // ขอข้อมูลทั้งหมดที่เป็นหมวด Karaoke (หลังบ้านเราเซฟห้องดนตรีไว้ในก้อน type: 'Karaoke')
        const response = await fetch('http://localhost:4000/api/facilities?type=Karaoke');
        const data = await response.json();

        // ⚠️ คัดกรองเอาเฉพาะห้องที่เป็นของ "Melody Sphere Zone Music" เท่านั้น
        const musicData = data.filter(item => item.name === 'Melody Sphere Zone Music');

        // จัดรูปฟอร์แมตโครงสร้าง Object ให้เข้าข่ายตัวแปรที่ลูปแสดงผลใน UI
        const formattedRooms = musicData.map(room => ({
          id: room._id, // ใช้ ID ที่เจนมาจากวัตถุจริงของ MongoDB
          title: room.name,
          name: room.room, // ชื่อย่อยของห้อง เช่น Music Practice Room 1
          desc: room.desc, // รายละเอียดและราคาค่าบริการรายชั่วโมง
          img: room.img,   // ลิงก์ URL รูปภาพที่ดึงมาจาก DB
          // ดึงอาร์เรย์สล็อตเวลาที่แนบอยู่ในคอลเลกชันมาจัดเป็น Object สถานะปุ่ม
          slots: room.slots.map(timeStr => ({
            time: timeStr,
            isAvailable: true // เปิดปุ่มสถานะพร้อมจองเป็นค่าเริ่มต้น
          }))
        }));

        setRooms(formattedRooms);
        setLoading(false);
      } catch (error) {
        console.error('❌ ดึงข้อมูลห้องซ้อมดนตรีล้มเหลว:', error);
        setLoading(false);
      }
    };

    fetchMusicRooms();
  }, [selectedDate]);

  // --------------------------------------------------------

  const handleSlotClick = (roomId, roomName, time, isAvailable) => {
    if (isAvailable) {
      setSelectedBooking({ roomId, roomName, time, date: selectedDate });
      setIsModalOpen(true);
    }
  };

  const confirmBooking = () => {
    const { roomId, time } = selectedBooking;
    
    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          slots: room.slots.map(slot => {
            if (slot.time === time) return { ...slot, isAvailable: false };
            return slot;
          })
        };
      }
      return room;
    });

    setRooms(updatedRooms);
    setIsModalOpen(false);
    setSelectedBooking(null);
    alert('จองห้องซ้อมดนตรีสำเร็จ! (จำลองการกดจอง)');
  };

  // --------------------------------------------------------

  return (
    <div className="booking-page-container" style={{ backgroundColor: '#EEF0F8' }}>
      {/* Breadcrumb ย้อนกลับ */}
      <div className="breadcrumb" onClick={onBack} style={{ cursor: 'pointer', color: '#666' }}>
        <i className="fa-solid fa-chevron-left"></i> ย้อนกลับ
      </div>

      <div className="date-display-section" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
         <BookingDateSelector 
            selectedDate={selectedDate} 
            onDateChange={(newDate) => setSelectedDate(newDate)} 
         />
      </div>

      {/* 👉 แสดงวงล้อโหลดหมุนติ้ว ๆ ช่วงรอข้อมูลวิ่งมาจากเซิร์ฟเวอร์ */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <p>กำลังโหลดคิวห้องซ้อมดนตรี...</p>
        </div>
      ) : (
        <div className="court-list">
          {rooms.map((room) => (
            <div key={room.id} className="court-booking-card">
              <h3 className="court-title">{room.title}</h3>
              <div className="court-details">
                <img src={room.img} alt={room.name} className="court-thumbnail" />
                <div className="court-info">
                  <h4>{room.name}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>{room.desc}</p>
                  <p>ช่วงเวลาที่สามารถจองได้ :</p>
                  <div className="time-slots">
                    {room.slots.map((slot, index) => (
                      <button 
                        key={index} 
                        className={`time-btn ${slot.isAvailable ? 'available' : 'unavailable'}`}
                        onClick={() => handleSlotClick(room.id, room.name, slot.time, slot.isAvailable)}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Popup (Modal) ยืนยันการจอง --- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}> 
          <div className="modal-content" onClick={(e) => e.stopPropagation()}> 
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            <h2 className="modal-title">ยืนยันการจอง</h2>
            <div className="modal-icon">
              <i className="fa-solid fa-calendar-check" style={{ fontSize: '4rem', color: '#333' }}></i>
            </div>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>SPOT : {selectedBooking?.roomName}</h3>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              วันที่ : {selectedBooking?.date} เวลา : {selectedBooking?.time} น.
            </p>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>หมวดหมู่: ห้องซ้อมดนตรี</p>
            
            <p className="warning-text">
              กรุณาดำเนินการเช็คอินที่หน้า Counter ก่อนเวลา 15 นาที<br/>
              หรือต้องการยกเลิกสามารถดำเนินการยกเลิกการจองได้ก่อนเวลา 120 นาที
            </p>

            <div className="modal-actions">
              <button className="btn-confirm" onClick={confirmBooking}>
                <i className="fa-solid fa-check"></i> ยืนยันการจอง
              </button>
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicBooking;