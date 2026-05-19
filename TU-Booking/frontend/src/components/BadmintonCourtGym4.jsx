import React, { useState, useEffect, useCallback } from 'react';
import BookingDateSelector from './BookingDateSelector';

function BadmintonGym4({ onBack, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
      new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })
  );

  const fetchBadmintonGym4 = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/facilities?type=Sport&date=${selectedDate}`);
      const data = await response.json();

      const gym4Data = data.filter(item => item.name === 'Badminton Court Gym 4');

      const formattedCourts = gym4Data.map(court => ({
        id: court._id,
        title: court.name,
        name: court.room,
        desc: court.desc,
        img: court.img,
        type: court.type, 
        slots: court.slots.map(slot => ({
          time: slot.time,
          isAvailable: slot.isAvailable 
        }))
      }));

      setCourts(formattedCourts);
      setLoading(false);
    } catch (error) {
      console.error('❌ ดึงข้อมูล Badminton Gym 4 ล้มเหลว:', error);
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchBadmintonGym4();
  }, [fetchBadmintonGym4]);

  // 👉 อัปเดตฟังก์ชันดักการกดสล็อตเวลาที่ผ่านมาแล้ว ให้ยืดหยุ่นและปลอดภัยจากบั๊กเรื่องปี
  const handleSlotClick = (courtId, courtName, time, isAvailable) => {
    // 1. เช็คว่ามีคนจองตัดหน้าไปแล้วหรือยัง
    if (!isAvailable) {
      alert("⚠️ ช่วงเวลานี้ถูกจองไปแล้วครับเพื่อน!");
      return;
    }

    // 2. 🛡️ เช็คว่าสล็อตเวลานี้เลยเวลาปัจจุบันไปหรือยัง
    try {
      const [d, m, y] = selectedDate.split('/');
      let year = parseInt(y);
      
      // แปลงปี พ.ศ. ให้เป็น ค.ศ. สำหรับใช้ใน Object Date ของ JavaScript (ปรับเงื่อนไขให้รัดกุม)
      if (year < 100) {
        year = year + 2500 - 543; // กรณีมาเป็นปี 2 หลัก เช่น 69 -> 2569 -> 2026
      } else if (year > 2500) {
        year = year - 543; // กรณีมาเป็นปี พ.ศ. 4 หลัก เช่น 2569 -> 2026
      }

      // แปลงเวลาเริ่มต้น (เช่น "12:00 - 13:00" ดึงออกมาแค่ "12:00")
      const startTime = time.split('-')[0].trim();
      const [hh, mm] = startTime.split(':');

      const slotDateTime = new Date(year, parseInt(m) - 1, parseInt(d), parseInt(hh), parseInt(mm));
      const now = new Date();

      // ถ้าเวลาสล็อตน้อยกว่าเวลาปัจจุบัน = อดีต (บล็อกทันที)
      if (slotDateTime < now) {
        alert("❌ ไม่สามารถจองได้ เนื่องจากเลยรอบเวลานี้ไปแล้วครับเพื่อน!");
        return; 
      }
    } catch (error) {
      console.error("Error parsing date/time validation:", error);
    }

    // ถ้าว่างและยังไม่เลยเวลา ค่อยเปิด Modal ยืนยันการจอง
    setSelectedBooking({ courtId, courtName, time, date: selectedDate });
    setIsModalOpen(true);
  };

  const confirmBooking = async () => {
    const { courtId, courtName, time, date } = selectedBooking;
    const currentCourt = courts.find(c => c.id === courtId);

    const bookingData = {
      studentId: user?.studentId || "6609650582",
      facilityId: courtId,
      facilityName: currentCourt?.title || "Badminton Court Gym 4",
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
        alert('🎉 จองสนามสำเร็จ!');
        fetchBadmintonGym4(); 
      } else {
        alert(result.message || 'เกิดข้อผิดพลาดในการจอง');
      }
    } catch (error) {
      alert('ระบบหลังบ้านมีปัญหา!');
    } finally {
      setIsModalOpen(false);
      setSelectedBooking(null);
    }
  };

  return (
    <div className="booking-page-container" style={{ backgroundColor: '#EEF0F8' }}>
      
      <div className="breadcrumb" onClick={onBack} style={{ cursor: 'pointer', color: '#666', marginBottom: '1rem' }}>
        <i className="fa-solid fa-chevron-left"></i> ย้อนกลับ
      </div>

      <div className="date-display-section" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
         <BookingDateSelector selectedDate={selectedDate} onDateChange={(newDate) => setSelectedDate(newDate)} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <p>กำลังโหลดคิวสนามแบดมินตัน ยิม 4...</p>
        </div>
      ) : (
        <div className="court-list">
          {courts.map((court) => (
            <div key={court.id} className="court-booking-card">
              <h3 className="court-title">{court.title}</h3>
              <div className="court-details">
                <img 
                  src={court.img} 
                  alt={court.name} 
                  className="court-thumbnail" 
                  onError={(e) => { e.target.onerror = null; e.target.src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=200&auto=format&fit=crop"}} 
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}> 
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            <h2 className="modal-title">ยืนยันการจอง</h2>
            <div className="modal-icon">
              <i className="fa-solid fa-calendar-check" style={{ fontSize: '4rem', color: '#333', margin: '1rem 0' }}></i>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>SPOT : {selectedBooking?.courtName}</h3>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              วันที่ : {selectedBooking?.date} เวลา : {selectedBooking?.time} น.
            </p>
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

export default BadmintonGym4;