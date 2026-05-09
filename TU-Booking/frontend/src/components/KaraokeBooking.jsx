import React, { useState } from 'react';
// นำเข้ารูปภาพคาราโอเกะ
import roomImg from '../assets/Karaoke Banner.png'; 

const initialRoomData = [
  {
    id: 'S',
    title: 'Melody Sphere Zone Karaoke',
    name: 'Karaoke size S',
    desc: 'สามารถเข้าใช้บริการได้ไม่เกิน 4 ท่าน (ค่าสาธารณูปโภค 150/ชม.)',
    img: roomImg,
    slots: [
      { time: '10:00', isAvailable: true }, { time: '11:00', isAvailable: true },
      { time: '12:00', isAvailable: true }, { time: '13:00', isAvailable: true },
      { time: '14:00', isAvailable: true }, { time: '15:00', isAvailable: true },
      { time: '16:00', isAvailable: true }, { time: '17:00', isAvailable: true },
      { time: '18:00', isAvailable: true }, { time: '19:00', isAvailable: false },
      { time: '20:00', isAvailable: false }, { time: '21:00', isAvailable: true },
    ]
  },
  {
    id: 'M1',
    title: 'Melody Sphere Zone Karaoke',
    name: 'Karaoke size M Room 1',
    desc: 'สามารถเข้าใช้บริการได้ไม่เกิน 8 ท่าน (ค่าสาธารณูปโภค 180/ชม.)',
    img: roomImg,
    slots: [
      { time: '10:00', isAvailable: true }, { time: '11:00', isAvailable: true },
      { time: '12:00', isAvailable: true }, { time: '13:00', isAvailable: true },
      { time: '14:00', isAvailable: true }, { time: '15:00', isAvailable: true },
      { time: '16:00', isAvailable: true }, { time: '17:00', isAvailable: true },
      { time: '18:00', isAvailable: true }, { time: '19:00', isAvailable: true },
      { time: '20:00', isAvailable: true }, { time: '21:00', isAvailable: true },
    ]
  },
  {
    id: 'M2',
    title: 'Melody Sphere Zone Karaoke',
    name: 'Karaoke size M Room 2',
    desc: 'สามารถเข้าใช้บริการได้ไม่เกิน 8 ท่าน (ค่าสาธารณูปโภค 180/ชม.)',
    img: roomImg,
    slots: [
      { time: '10:00', isAvailable: true }, { time: '11:00', isAvailable: true },
      { time: '12:00', isAvailable: true }, { time: '13:00', isAvailable: true },
      { time: '14:00', isAvailable: true }, { time: '15:00', isAvailable: true },
      { time: '16:00', isAvailable: true }, { time: '17:00', isAvailable: true },
      { time: '18:00', isAvailable: true }, { time: '19:00', isAvailable: true },
      { time: '20:00', isAvailable: true }, { time: '21:00', isAvailable: true },
    ]
  },
  {
    id: 'L',
    title: 'Melody Sphere Zone Karaoke',
    name: 'Karaoke size L',
    desc: 'สามารถเข้าใช้บริการได้ไม่เกิน 12 ท่าน (ค่าสาธารณูปโภค 210/ชม.)',
    img: roomImg,
    slots: [
      { time: '10:00', isAvailable: true }, { time: '11:00', isAvailable: false },
      { time: '12:00', isAvailable: true }, { time: '13:00', isAvailable: true },
      { time: '14:00', isAvailable: true }, { time: '15:00', isAvailable: true },
      { time: '16:00', isAvailable: true }, { time: '17:00', isAvailable: true },
      { time: '18:00', isAvailable: true }, { time: '19:00', isAvailable: true },
      { time: '20:00', isAvailable: true }, { time: '21:00', isAvailable: true },
    ]
  },
  {
    id: 'XL',
    title: 'Melody Sphere Zone Karaoke',
    name: 'Karaoke size XL',
    desc: 'สามารถเข้าใช้บริการได้ไม่เกิน 20 ท่าน (ค่าสาธารณูปโภค 250/ชม.)',
    img: roomImg,
    slots: [
      { time: '10:00', isAvailable: true }, { time: '11:00', isAvailable: true },
      { time: '12:00', isAvailable: true }, { time: '13:00', isAvailable: true },
      { time: '14:00', isAvailable: true }, { time: '15:00', isAvailable: true },
      { time: '16:00', isAvailable: true }, { time: '17:00', isAvailable: true },
      { time: '18:00', isAvailable: true }, { time: '19:00', isAvailable: true },
      { time: '20:00', isAvailable: true }, { time: '21:00', isAvailable: true },
    ]
  }
];

function KaraokeBooking({ onBack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [rooms, setRooms] = useState(initialRoomData);

  const handleSlotClick = (roomId, roomName, time, isAvailable) => {
    if (isAvailable) {
      setSelectedBooking({ roomId, roomName, time, date: '20/03/69' });
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

    alert('จองสำเร็จ!');
  };

  return (
    <div className="booking-page-container">
      <div className="breadcrumb" onClick={onBack} style={{ cursor: 'pointer', color: '#666' }}>
        <i className="fa-solid fa-chevron-left"></i> ย้อนกลับ
      </div>

      <div className="date-display-section">
         <div className="date-box">
           <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>วันที่จอง</span>
           <div className="date-badge"><i className="fa-regular fa-calendar"></i> 20/03/69</div>
         </div>
      </div>

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
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>หมวดหมู่: ห้องคาราโอเกะ</p>
            
            <p className="warning-text">
              กรุณาดำเนินการเช็คอินที่หน้า Counter ก่อนเวลา 15 นาที<br/>
              หรือต้องการยกเลิกสามารถดำเนินการยกเลิกการจองได้ก่อนเวลา 15 นาที
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

export default KaraokeBooking;