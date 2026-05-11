import React, { useState } from 'react';
import studyRoomImg from '../assets/Study Room Category.png';
import BookingDateSelector from './BookingDateSelector';

const initialStudyData = [
  {
    id: 'SR1',
    title: 'Puey Ungphakorn Library',
    name: 'Study Room 1',
    desc: '', // ในรูปไม่มีคำอธิบายราคา/จำนวนคน เลยเว้นว่างไว้ครับ
    img: studyRoomImg,
    slots: [
      { time: '09:00-12:00', isAvailable: true }, 
      { time: '12:00-15:00', isAvailable: false },
      { time: '15:00-18:00', isAvailable: false }, 
      { time: '18:00-21:00', isAvailable: false },
      { time: '21:00-23:59', isAvailable: true }
    ]
  },
  {
    id: 'SR2',
    title: 'Puey Ungphakorn Library',
    name: 'Study Room 2',
    desc: '', // ในรูปไม่มีคำอธิบายราคา/จำนวนคน เลยเว้นว่างไว้ครับ
    img: studyRoomImg,
    slots: [
      { time: '09:00-12:00', isAvailable: true }, 
      { time: '12:00-15:00', isAvailable: false },
      { time: '15:00-18:00', isAvailable: false }, 
      { time: '18:00-21:00', isAvailable: false },
      { time: '21:00-23:59', isAvailable: true }
    ]
  },
  {
    id: 'SR3',
    title: 'Puey Ungphakorn Library',
    name: 'Study Room 3',
    desc: '', // ในรูปไม่มีคำอธิบายราคา/จำนวนคน เลยเว้นว่างไว้ครับ
    img: studyRoomImg,
    slots: [
      { time: '09:00-12:00', isAvailable: true }, 
      { time: '12:00-15:00', isAvailable: false },
      { time: '15:00-18:00', isAvailable: false }, 
      { time: '18:00-21:00', isAvailable: false },
      { time: '21:00-23:59', isAvailable: true }
    ]
  },
  {
    id: 'SR4',
    title: 'Puey Ungphakorn Library',
    name: 'Study Room 4',
    desc: '', // ในรูปไม่มีคำอธิบายราคา/จำนวนคน เลยเว้นว่างไว้ครับ
    img: studyRoomImg,
    slots: [
      { time: '09:00-12:00', isAvailable: true }, 
      { time: '12:00-15:00', isAvailable: false },
      { time: '15:00-18:00', isAvailable: false }, 
      { time: '18:00-21:00', isAvailable: false },
      { time: '21:00-23:59', isAvailable: true }
    ]
  },
  {
    id: 'SR5',
    title: 'Puey Ungphakorn Library',
    name: 'Study Room 5',
    desc: '', // ในรูปไม่มีคำอธิบายราคา/จำนวนคน เลยเว้นว่างไว้ครับ
    img: studyRoomImg,
    slots: [
      { time: '09:00-12:00', isAvailable: true }, 
      { time: '12:00-15:00', isAvailable: false },
      { time: '15:00-18:00', isAvailable: false }, 
      { time: '18:00-21:00', isAvailable: false },
      { time: '21:00-23:59', isAvailable: true }
    ]
  },
  {
    id: 'SR6',
    title: 'Puey Ungphakorn Library',
    name: 'Study Room 6',
    desc: '', // ในรูปไม่มีคำอธิบายราคา/จำนวนคน เลยเว้นว่างไว้ครับ
    img: studyRoomImg,
    slots: [
      { time: '09:00-12:00', isAvailable: true }, 
      { time: '12:00-15:00', isAvailable: false },
      { time: '15:00-18:00', isAvailable: false }, 
      { time: '18:00-21:00', isAvailable: false },
      { time: '21:00-23:59', isAvailable: true }
    ]
  },
  {
    id: 'SR7',
    title: 'Puey Ungphakorn Library',
    name: 'Study Room 7',
    desc: '', // ในรูปไม่มีคำอธิบายราคา/จำนวนคน เลยเว้นว่างไว้ครับ
    img: studyRoomImg,
    slots: [
      { time: '09:00-12:00', isAvailable: true }, 
      { time: '12:00-15:00', isAvailable: false },
      { time: '15:00-18:00', isAvailable: false }, 
      { time: '18:00-21:00', isAvailable: false },
      { time: '21:00-23:59', isAvailable: true }
    ]
  },
  {
    id: 'SR8',
    title: 'Puey Ungphakorn Library',
    name: 'Study Room 8',
    desc: '', // ในรูปไม่มีคำอธิบายราคา/จำนวนคน เลยเว้นว่างไว้ครับ
    img: studyRoomImg,
    slots: [
      { time: '09:00-12:00', isAvailable: true }, 
      { time: '12:00-15:00', isAvailable: false },
      { time: '15:00-18:00', isAvailable: false }, 
      { time: '18:00-21:00', isAvailable: false },
      { time: '21:00-23:59', isAvailable: true }
    ]
  },
  {
    id: 'SR9',
    title: 'Puey Ungphakorn Library',
    name: 'Study Room 9',
    desc: '', // ในรูปไม่มีคำอธิบายราคา/จำนวนคน เลยเว้นว่างไว้ครับ
    img: studyRoomImg,
    slots: [
      { time: '09:00-12:00', isAvailable: true }, 
      { time: '12:00-15:00', isAvailable: false },
      { time: '15:00-18:00', isAvailable: false }, 
      { time: '18:00-21:00', isAvailable: false },
      { time: '21:00-23:59', isAvailable: true }
    ]
  },
  {
    id: 'SR10',
    title: 'Puey Ungphakorn Library',
    name: 'Study Room 10',
    desc: '',
    img: studyRoomImg,
    slots: [
      { time: '09:00-12:00', isAvailable: false }, 
      { time: '12:00-15:00', isAvailable: false },
      { time: '15:00-18:00', isAvailable: false }, 
      { time: '18:00-21:00', isAvailable: false },
      { time: '21:00-23:59', isAvailable: true }
    ]
  }
];

function StudyBooking({ onBack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rooms, setRooms] = useState(initialStudyData);

  // 👉 สร้าง State สำหรับวันที่ที่เลือก (เริ่มต้นเป็นวันที่วันนี้)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })
  );

  const handleSlotClick = (roomId, roomName, time, isAvailable) => {
    if (isAvailable) {
      // ✅ แก้ไข: ใช้ selectedDate จาก State ตรงๆ ข้อมูลใน Popup จะได้ตรงกับวันที่เลือก
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
    alert('จองห้องเรียนสำเร็จ!');
  };

  return (
    <div className="booking-page-container" style={{ backgroundColor: '#EEF0F8' }}>
      <div className="breadcrumb" onClick={onBack} style={{ cursor: 'pointer', color: '#666' }}>
        <i className="fa-solid fa-chevron-left"></i> ย้อนกลับ
      </div>

      <div className="date-display-section" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
         {/* 👉 เรียกใช้ Component เลือกวันที่ตรงนี้ */}
         <BookingDateSelector 
            selectedDate={selectedDate} 
            onDateChange={(newDate) => setSelectedDate(newDate)} 
         />
      </div>

      <div className="court-list">
        {rooms.map((room) => (
          <div key={room.id} className="court-booking-card">
            <h3 className="court-title">{room.title}</h3>
            <div className="court-details">
              <img src={room.img} alt={room.name} className="court-thumbnail" />
              <div className="court-info">
                <h4>{room.name}</h4>
                {/* ถ้ามี desc ค่อยแสดง ถ้าไม่มีก็ไม่กินพื้นที่ */}
                {room.desc && <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>{room.desc}</p>}
                <p>ช่วงเวลาที่สามารถจองได้ :</p>
                <div className="time-slots">
                  {room.slots.map((slot, index) => (
                    <button 
                      key={index} 
                      className={`time-btn ${slot.isAvailable ? 'available' : 'unavailable'}`}
                      onClick={() => handleSlotClick(room.id, room.name, slot.time, slot.isAvailable)}
                    >
                      {/* แอบใส่ไอคอนนาฬิกาหรือปฏิทินนิดนึงให้เหมือนในรูป หรือโชว์แค่เวลาก็ได้ */}
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Popup (Modal) --- */}
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
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>หมวดหมู่: ห้องเรียน</p>
            
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

export default StudyBooking;