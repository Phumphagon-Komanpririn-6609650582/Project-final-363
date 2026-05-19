import React, { useState, useEffect, useCallback } from 'react';
import BookingDateSelector from './BookingDateSelector';

function TennisCourt({ onBack, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })
  );

  // 1. แยกฟังก์ชัน fetch ออกมาเป็น useCallback เพื่อเรียกซ้ำหลังจองเสร็จ
  const fetchTennisCourts = useCallback(async () => {
    try {
      setLoading(true);
      // ส่ง date ไปให้หลังบ้านเช็คสถานะว่างจริงจากตาราง bookings ด้วย
      const response = await fetch(`http://localhost:4000/api/facilities?type=Sport&date=${selectedDate}`);
      const data = await response.json();

      const tennisData = data.filter(item => item.name === 'Tennis Court');

      const formattedCourts = tennisData.map(court => ({
        id: court._id,
        title: court.name,
        name: court.room,
        desc: court.desc,
        img: court.img,
        type: court.type, 
        slots: court.slots.map(slot => ({
          time: slot.time,
          isAvailable: slot.isAvailable // 👉 รับค่า boolean ที่คำนวณมาจากหลังบ้าน
        }))
      }));

      setCourts(formattedCourts);
      setLoading(false);
    } catch (error) {
      console.error('❌ ดึงข้อมูล Tennis Court ล้มเหลว:', error);
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchTennisCourts();
  }, [fetchTennisCourts]);

  // 👉 อัปเดตฟังก์ชันดักการกดสล็อตเวลาที่ผ่านมาแล้ว
  const handleSlotClick = (courtId, courtName, time, isAvailable) => {
    // 1. เช็คว่าสล็อตนี้เต็มหรือมีคนจองไปแล้วหรือยัง
    if (!isAvailable) {
      alert("⚠️ ช่วงเวลานี้ถูกจองไปแล้วครับ!");
      return;
    }

    // 2. 🛡️ เช็คว่าสล็อตเวลานี้เลยเวลาปัจจุบันไปหรือยัง
    try {
      const [d, m, y] = selectedDate.split('/');
      let year = parseInt(y);
      
      // แปลงปี พ.ศ. ของไทย เป็น ค.ศ. ให้ Date Object คํานวณได้ถูกต้อง ปรับให้ปลอดภัยขึ้น
      if (year < 100) {
        year = year + 2500 - 543; // กรณีมาเป็น 69 -> 2569 -> 2026
      } else if (year > 2500) {
        year = year - 543; // กรณีมาเป็น 2569 -> 2026
      }
      // หมายเหตุ: ถ้าค่าส่งมาเป็น ค.ศ. อยู่แล้ว (เช่น 2026) มันจะไม่เข้าเงื่อนไขไหนเลย ซึ่งถูกต้องแล้ว

      // ดึงเวลาเริ่มต้นของสล็อต (เช่น "17:00 - 18:00" ดึงออกมาแค่ "17:00")
      const startTime = time.split('-')[0].trim();
      const [hh, mm] = startTime.split(':');

      const slotDateTime = new Date(year, parseInt(m) - 1, parseInt(d), parseInt(hh), parseInt(mm));
      const now = new Date();

      // ถ้าเวลาของสล็อตน้อยกว่าเวลาปัจจุบัน แปลว่าเลยรอบไปแล้ว
      if (slotDateTime < now) {
        alert("❌ ไม่สามารถจองได้ เนื่องจากเลยรอบเวลานี้ไปแล้วครับ!");
        return; // บล็อกไว้ ไม่ให้เปิด Modal ยืนยันการจอง
      }
    } catch (error) {
      console.error("Error parsing date/time validation:", error);
    }

    // ถ้าว่างและยังไม่เลยเวลา ให้เปิด Modal จองได้ตามปกติ
    setSelectedBooking({ courtId, courtName, time, date: selectedDate });
    setIsModalOpen(true);
  };

  const confirmBooking = async () => {
    const { courtId, courtName, time, date } = selectedBooking;
    const currentCourt = courts.find(c => c.id === courtId);

    const bookingData = {
      studentId: user?.studentId || "6609650582",
      facilityId: courtId,      
      facilityName: currentCourt?.title || "Tennis Court",
      roomName: currentCourt?.name || courtName,
      bookingDate: date,        
      timeSlot: time,
      type: currentCourt?.type || 'Sport' 
    };

    try {
      const response = await fetch('http://localhost:4000/api/bookings/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('🎉 จองสำเร็จ!');
        // 👉 สั่ง Refresh ข้อมูลใหม่ทันที ปุ๊บปั๊บปุ่มเปลี่ยนเป็นสีแดง (Unavailable)
        fetchTennisCourts(); 
      } else {
        alert(result.message || 'เกิดข้อผิดพลาดในการจอง');
      }
    } catch (error) {
      console.error('❌ เชื่อมต่อหลังบ้านไม่ได้:', error);
      alert('ระบบหลังบ้านมีปัญหา!');
    } finally {
      setIsModalOpen(false);
      setSelectedBooking(null);
    }
  };

  return (
    <div className="booking-page-container" style={{ backgroundColor: '#EEF0F8' }}>
      <div className="breadcrumb" onClick={onBack} style={{ cursor: 'pointer', color: '#666' }}>
        <i className="fa-solid fa-chevron-left"></i> ย้อนกลับ
      </div>

      <div className="date-display-section" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
         <BookingDateSelector selectedDate={selectedDate} onDateChange={(newDate) => setSelectedDate(newDate)} />
      </div>

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
                {/* 👉 เพิ่มตัวดักรูปภาพพัง (Image Fallback) ป้องกันการ์ดเบี้ยว */}
                <img 
                  src={court.img} 
                  alt={court.name} 
                  className="court-thumbnail" 
                  onError={(e) => { e.target.onerror = null; e.target.src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=200&auto=format&fit=crop" }}
                />
                <div className="court-info">
                  <h4>{court.name}</h4>
                  {court.desc && <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>{court.desc}</p>}
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}> 
          <div className="modal-content" onClick={(e) => e.stopPropagation()}> 
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            <h2 className="modal-title">ยืนยันการจอง</h2>
            <div className="modal-icon"><i className="fa-solid fa-calendar-check" style={{ fontSize: '4rem', color: '#333' }}></i></div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>SPOT : {selectedBooking?.courtName}</h3>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>วันที่ : {selectedBooking?.date} เวลา : {selectedBooking?.time} น.</p>
            <div className="modal-actions">
              <button className="btn-confirm" onClick={confirmBooking}><i className="fa-solid fa-check"></i> ยืนยันการจอง</button>
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TennisCourt;