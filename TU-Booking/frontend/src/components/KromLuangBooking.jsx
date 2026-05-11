import React, { useState, useEffect } from 'react';
import kromLuangImg from '../assets/Krom_Luang_Category.png';
import BookingDateSelector from './BookingDateSelector';

const initialStudyData = [
  {
    id: 'AR1', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Advisor Room 1', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'AR2', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Advisor Room 2', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'AR3', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Advisor Room 3', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'AR4', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Advisor Room 4', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'TR1', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Tutoring Room1', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'TR2', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Tutoring Room2', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'TR3', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Tutoring Room3', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'TR4', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Tutoring Room4', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'TR5', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Tutoring Room5', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'TR7', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Tutoring Room7', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'TR8', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Tutoring Room8', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'TR9', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Tutoring Room9', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP1', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod1', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP2', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod2', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP3', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod3', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP4', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod4', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP5', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod5', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP6', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod6', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP7', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod7', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP8', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod8', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP9', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod9', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP10', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod10', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP11', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod11', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP12', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod12', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP13', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod13', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP14', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod14', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP15', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod15', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP16', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod16', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP17', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod17', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP18', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod18', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP19', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod19', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  },
  {
    id: 'SP20', title: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre', name: 'Study Pod20', desc: '', img: kromLuangImg,
    slots: [ { time: '09:00-12:00', isAvailable: false }, { time: '12:00-15:00', isAvailable: false }, { time: '15:00-18:00', isAvailable: false }, { time: '18:00-21:00', isAvailable: false }, { time: '21:00-23:59', isAvailable: true } ]
  }
];

function KromLuangBooking({ onBack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rooms, setRooms] = useState(initialStudyData);

// 👉 สร้าง State สำหรับวันที่ที่เลือก (เริ่มต้นเป็นวันที่วันนี้)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })
  );

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

export default KromLuangBooking;