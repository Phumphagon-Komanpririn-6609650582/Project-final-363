import React, { useState, useEffect, useCallback } from 'react';
import BookingDateSelector from './BookingDateSelector';

function KromLuangBooking({ onBack, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })
  );

  // 1. แยกฟังก์ชัน fetch ออกมาข้างนอก เพื่อให้เรียกใช้ซ้ำได้หลังจอง
  const fetchKromLuangRooms = useCallback(async () => {
    try {
      setLoading(true);
      // ส่ง date ไปให้หลังบ้านเช็คสถานะในตาราง bookings ด้วย
      const response = await fetch(`http://localhost:4000/api/facilities?type=Study&date=${selectedDate}`);
      const data = await response.json();

      const kromLuangData = data.filter(item => item.name === 'Krom Luang Naradhiwas Rajanagarinda Learning Centre');

      const formattedRooms = kromLuangData.map(room => ({
        id: room._id,
        title: room.name,
        name: room.room,
        desc: room.desc,
        img: room.img, 
        type: room.type, 
        slots: room.slots.map(slot => ({
          time: slot.time,
          isAvailable: slot.isAvailable // 👉 รับค่าที่เช็คมาจาก DB
        }))
      }));

      setRooms(formattedRooms);
      setLoading(false);
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchKromLuangRooms();
  }, [fetchKromLuangRooms]);

  // 👉 อัปเดตฟังก์ชันดักการกดสล็อตเวลาที่ผ่านมาแล้ว ให้ปลอดภัยจากบั๊กปี ค.ศ.
  const handleSlotClick = (roomId, roomName, time, isAvailable) => {
    // 1. เช็คว่าเวลานี้มีคนจองตัดหน้าไปหรือยัง
    if (!isAvailable) {
      alert("⚠️ เวลานี้มีคนจองแล้วเพื่อน!");
      return;
    }

    // 2. 🛡️ เช็คว่าเวลาที่จะจอง มันเลยเวลาปัจจุบันไปหรือยัง
    try {
      const [d, m, y] = selectedDate.split('/');
      let year = parseInt(y);
      
      // แปลงปี พ.ศ. ให้เป็น ค.ศ. สำหรับใช้ใน Object Date ของ JavaScript (ปรับเงื่อนไขให้รัดกุม)
      if (year < 100) {
        year = year + 2500 - 543; // กรณีมาเป็นปี 2 หลัก เช่น 69 -> 2569 -> 2026
      } else if (year > 2500) {
        year = year - 543; // กรณีมาเป็นปี พ.ศ. 4 หลัก เช่น 2569 -> 2026
      }

      // ดึงเวลาเริ่มต้นของสล็อต (เช่น "13:00 - 15:00" ดึงออกมาแค่ "13:00")
      const startTime = time.split('-')[0].trim();
      const [hh, mm] = startTime.split(':');

      const slotDateTime = new Date(year, parseInt(m) - 1, parseInt(d), parseInt(hh), parseInt(mm));
      const now = new Date();

      // ถ้าเวลาของสล็อตน้อยกว่าเวลาปัจจุบัน แปลว่าเลยรอบไปแล้ว (เป็นอดีต)
      if (slotDateTime < now) {
        alert("❌ ไม่สามารถจองได้ เนื่องจากเลยรอบเวลานี้ไปแล้วครับเพื่อน!");
        return; // บล็อกไว้ ไม่เปิด Modal ยืนยัน
      }
    } catch (error) {
      console.error("Error parsing date/time validation:", error);
    }

    // ถ้าผ่านเงื่อนไข ค่อยเปิดกางกล่อง Modal
    setSelectedBooking({ roomId, roomName, time, date: selectedDate });
    setIsModalOpen(true);
  };

  const confirmBooking = async () => {
    const { roomId, roomName, time, date } = selectedBooking;
    const currentRoom = rooms.find(r => r.id === roomId);

    const bookingData = {
      studentId: user?.studentId || "6609650582",
      facilityId: roomId,      
      facilityName: currentRoom?.title || "Krom Luang Naradhiwas Rajanagarinda Learning Centre",
      roomName: currentRoom?.name || roomName,
      bookingDate: date,        
      timeSlot: time,
      type: currentRoom?.type || 'Study' 
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
        fetchKromLuangRooms(); 
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
          <p>กำลังโหลดข้อมูลคิวห้อง...</p>
        </div>
      ) : (
        <div className="court-list">
          {rooms.map((room) => (
            <div key={room.id} className="court-booking-card">
              <h3 className="court-title">{room.title}</h3>
              <div className="court-details">
                <img 
                  src={room.img} 
                  alt={room.name} 
                  className="court-thumbnail" 
                  onError={(e) => { e.target.onerror = null; e.target.src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=200&auto=format&fit=crop" }} // ใส่รูปสำรองเผื่อ Path พัง
                />
                <div className="court-info">
                  <h4>{room.name}</h4>
                  
                  {/* 👉 ดึงคำอธิบายห้องมาโชว์ให้เรียบร้อยแล้วตรงนี้ */}
                  {room.desc && <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>{room.desc}</p>}
                  
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}> 
          <div className="modal-content" onClick={(e) => e.stopPropagation()}> 
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            <h2 className="modal-title">ยืนยันการจอง</h2>
            <div className="modal-icon"><i className="fa-solid fa-calendar-check" style={{ fontSize: '4rem', color: '#333', margin: '1rem 0' }}></i></div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>ROOM : {selectedBooking?.roomName}</h3>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              วันที่ : {selectedBooking?.date} เวลา : {selectedBooking?.time} น.
            </p>
            <div className="modal-actions">
              <button className="btn-confirm" onClick={confirmBooking}>ยืนยันการจอง</button>
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KromLuangBooking;