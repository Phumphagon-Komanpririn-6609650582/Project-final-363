import React, { useState, useEffect } from 'react';
import BookingDateSelector from './BookingDateSelector';
// ❌ ลบ import TennisImg ออก เพราะเราดึงรูปจาก DB 

function TennisCourt({ onBack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // 👉 1. State สำหรับเก็บข้อมูลคอร์ตที่ดึงมาจาก DB
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ดึงวันที่ปัจจุบันมาเป็นค่าเริ่มต้น
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })
  );

  // 👉 2. ยิง API ไปดึงข้อมูลคอร์ตเทนนิสจาก MongoDB
  useEffect(() => {
    const fetchTennisCourts = async () => {
      try {
        setLoading(true);
        // ขอข้อมูลทั้งหมดที่เป็นหมวด Sport
        const response = await fetch('http://localhost:4000/api/facilities?type=Sport');
        const data = await response.json();

        // ⚠️ กรองเอาเฉพาะข้อมูลที่ชื่อห้องหลักคือ "Tennis Court"
        const tennisData = data.filter(item => item.name === 'Tennis Court');

        // จัดรูปฟอร์แมตข้อมูลให้ตรงกับที่ UI มึงเขียนไว้
        const formattedCourts = tennisData.map(court => ({
          id: court._id,
          title: court.name,
          name: court.room, // ชื่อคอร์ตย่อย เช่น Tennis Court 02
          desc: court.desc,
          img: court.img,
          // ⚠️ สร้าง Object สล็อตเวลา (ดึงอาร์เรย์เวลาจาก DB มาแมปคู่กับ isAvailable)
          // *หมายเหตุ: ตรงนี้อนาคตต้องเขียนยิงไปถามตาราง bookings ด้วยว่าเวลานี้โดนจองไปยัง 
          // แต่ตอนนี้ตั้งค่าให้เป็น ว่าง (true) ไว้ก่อน เพื่อให้ปุ่มโชว์ขึ้นมา
          slots: court.slots.map(timeStr => ({
            time: timeStr,
            isAvailable: true 
          }))
        }));

        setCourts(formattedCourts);
        setLoading(false);
      } catch (error) {
        console.error('❌ ดึงข้อมูล Tennis Court ล้มเหลว:', error);
        setLoading(false);
      }
    };

    fetchTennisCourts();
  }, [selectedDate]); // ถ้าเปลี่ยนวัน ก็อาจจะต้องยิงไปเช็คคิวจองใหม่ (เดี๋ยวมาทำเพิ่มทีหลัง)

  // --------------------------------------------------------

  const handleSlotClick = (courtId, courtName, time, isAvailable) => {
    if (isAvailable) {
      setSelectedBooking({ courtId, courtName, time, date: selectedDate });
      setIsModalOpen(true);
    }
  };

  const confirmBooking = () => {
    // ⚠️ ตรงนี้เดี๋ยวต้องเปลี่ยนเป็นการยิง POST ไปหา API /api/bookings เพื่อบันทึกลง DB
    // แต่ตอนนี้ขอทำแค่จำลองเปลี่ยนสีปุ่มในหน้าจอก่อน
    const { courtId, time } = selectedBooking;

    const updatedCourts = courts.map(court => {
      if (court.id === courtId) {
        return {
          ...court,
          slots: court.slots.map(slot => {
            if (slot.time === time) {
              return { ...slot, isAvailable: false };
            }
            return slot;
          })
        };
      }
      return court;
    });

    setCourts(updatedCourts);
    setIsModalOpen(false);
    setSelectedBooking(null);
    alert('จองสำเร็จ! (จำลองการกดจอง)');
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

      {/* 👉 แสดง Loading หมุนๆ ตอนกำลังดึงข้อมูล */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <p>กำลังโหลดคิวสนามเทนนิส...</p>
        </div>
      ) : (
        <div className="court-list">
          {courts.map((court) => (
            <div key={court.id} className="court-booking-card">
              <h3 className="court-title">{court.title}</h3>
              <div className="court-details">
                <img src={court.img} alt={court.name} className="court-thumbnail" />
                <div className="court-info">
                  <h4>{court.name}</h4>
                  {court.desc && <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>{court.desc}</p>}
                  <p>ช่วงเวลาที่สามารถจองได้ :</p>
                  <div className="time-slots">
                    {court.slots.map((slot, index) => (
                      <button 
                        key={index} 
                        className={`time-btn ${slot.isAvailable ? 'available' : 'unavailable'}`}
                        onClick={() => handleSlotClick(court.id, court.name, slot.time, slot.isAvailable)}
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

      {/* --- Popup (Modal) --- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}> 
          <div className="modal-content" onClick={(e) => e.stopPropagation()}> 
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            <h2 className="modal-title">ยืนยันการจอง</h2>
            <div className="modal-icon">
              <i className="fa-solid fa-calendar-check" style={{ fontSize: '4rem', color: '#333' }}></i>
            </div>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>SPOT : {selectedBooking?.courtName}</h3>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              วันที่ : {selectedBooking?.date} เวลา : {selectedBooking?.time} น.
            </p>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>สนาม/ห้อง Tennis Court</p>
            
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

export default TennisCourt;