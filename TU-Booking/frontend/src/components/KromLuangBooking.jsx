import React, { useState, useEffect } from 'react';
import BookingDateSelector from './BookingDateSelector';
// ❌ ลบการ import รูปภาพออก เพราะระบบเปลี่ยนไปดึงพาธ/ลิงก์รูปภาพจาก MongoDB แทนเรียบร้อยแล้ว

function KromLuangBooking({ onBack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // 👉 1. State สำหรับเก็บข้อมูลห้องติว/พอด ของตึกกรมหลวงฯ จากฐานข้อมูลจริง
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // สร้าง State สำหรับวันที่ที่เลือก (ค่าเริ่มต้นเป็นรูปแบบวันที่ปัจจุบันของระบบ)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })
  );

  // 👉 2. ใช้ useEffect ดึงข้อมูลห้องจากระบบหลังบ้านอัตโนมัติ
  useEffect(() => {
    const fetchKromLuangRooms = async () => {
      try {
        setLoading(true);
        // ยิงท่อส่งข้อมูลประเภท Study ไปหาหลังบ้าน (พอร์ต 4000)
        const response = await fetch('http://localhost:4000/api/facilities?type=Study');
        const data = await response.json();

        // ⚠️ กรองคัดเอาเฉพาะห้องที่สังกัดตึกกรมหลวงฯ เท่านั้น
        const kromLuangData = data.filter(item => item.name === 'Krom Luang Naradhiwas Rajanagarinda Learning Centre');

        // แมปโครงสร้างอ็อบเจกต์แปลงก้อนข้อมูลให้เข้าข่ายตัวแปรที่ลูปแสดงผลใน UI
        const formattedRooms = kromLuangData.map(room => ({
          id: room._id,
          title: room.name,
          name: room.room, // ชื่อห้อง/พอดจริง เช่น Advisor Room 1, Tutoring Room1, Study Pod1
          desc: room.desc,
          img: room.img,   // ลิงก์รูปภาพที่จะแสดงผลบนการ์ด
          // แปลงอาร์เรย์ก้อนสล็อตเวลาจากฐานข้อมูลมาเป็น Array Object เพื่อคุมสถานะปุ่ม
          slots: room.slots.map(timeStr => ({
            time: timeStr,
            isAvailable: true // ตั้งค่าให้ปุ่มสว่างพร้อมกดไปก่อนชั่วคราว
          }))
        }));

        setRooms(formattedRooms);
        setLoading(false);
      } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูลตึกกรมหลวงฯ:', error);
        setLoading(false);
      }
    };

    fetchKromLuangRooms();
  }, [selectedDate]);

  // --------------------------------------------------------

  // 👉 3. ฟังก์ชันดักจับเหตุการณ์คลิกเลือกสล็อตเวลา (เติมเข้าไปทดแทนของเก่าที่ขาดหาย)
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
            if (slot.time === time) {
              return { ...slot, isAvailable: false };
            }
            return slot;
          })
        };
      }
      return room;
    });

    setRooms(updatedRooms);
    setIsModalOpen(false);
    setSelectedBooking(null);
    alert('จองห้องเรียนสำเร็จ! (จำลองการกดจอง)');
  };

  // --------------------------------------------------------

  return (
    <div className="booking-page-container" style={{ backgroundColor: '#EEF0F8' }}>
      <div className="breadcrumb" onClick={onBack} style={{ cursor: 'pointer', color: '#666' }}>
        <i className="fa-solid fa-chevron-left"></i> ย้อนกลับ
      </div>

      <div className="date-display-section" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
         <BookingDateSelector 
            selectedDate={selectedDate} 
            onDateChange={(newDate) => setSelectedDate(newDate)} 
         />
      </div>

      {/* 👉 โชว์อนิเมชัน Loading หมุนติ้วๆ ป้องกันหน้าจอโล่งช่วงที่กำลัง Fetch ข้อมูล */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <p>กำลังโหลดรายการห้องและ Study Pod ของศูนย์เรียนรู้กรมหลวงฯ...</p>
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
                  {room.desc && <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>{room.desc}</p>}
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
            {/* ✅ ปรับแต่งป้ายชื่อให้ระบุพิกัดชัดเจนขึ้น */}
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>หมวดหมู่: ห้องเรียน (ศูนย์เรียนรู้กรมหลวงฯ)</p>
            
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

export default KromLuangBooking;