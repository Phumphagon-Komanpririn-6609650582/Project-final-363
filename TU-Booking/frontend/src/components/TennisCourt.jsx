import React, { useState } from 'react';
import BookingDateSelector from './BookingDateSelector';
import TennisImg from '../assets/TennisCourt.png';

const initialCourtData = [
  {
    id: '02',
    title: 'Tennis Court',
    name: 'Tennis Court 02',
    desc: '',
    img: TennisImg,
    slots: [
      { time: '16:00', isAvailable: true },
      { time: '17:00', isAvailable: true },
      { time: '18:00', isAvailable: false },
      { time: '19:00', isAvailable: true },
      { time: '20:00', isAvailable: false },
    ]
  },
  {
    id: '03',
    title: 'Tennis Court',
    name: 'Tennis Court 03',
    desc: '',
    img: TennisImg,
    slots: [
      { time: '16:00', isAvailable: true },
      { time: '17:00', isAvailable: true },
      { time: '18:00', isAvailable: false },
      { time: '19:00', isAvailable: true },
      { time: '20:00', isAvailable: false },
    ]
  },
  {
    id: '04',
    title: 'Tennis Court',
    name: 'Tennis Court 04',
    desc: '',
    img: TennisImg,
    slots: [
      { time: '16:00', isAvailable: true },
      { time: '17:00', isAvailable: true },
      { time: '18:00', isAvailable: false },
      { time: '19:00', isAvailable: true },
      { time: '20:00', isAvailable: false },
    ]
  },
  {
    id: '05',
    title: 'Tennis Court',
    name: 'Tennis Court 05',
    desc: '',
    img: TennisImg,
    slots: [
      { time: '16:00', isAvailable: true },
      { time: '17:00', isAvailable: true },
      { time: '18:00', isAvailable: false },
      { time: '19:00', isAvailable: true },
      { time: '20:00', isAvailable: false },
    ]
  },
  {
    id: '07',
    title: 'Tennis Court',
    name: 'Tennis Court 07',
    desc: '',
    img: TennisImg,
    slots: [
      { time: '16:00', isAvailable: true },
      { time: '17:00', isAvailable: true },
    ]
  },
  {
    id: '08',
    title: 'Tennis Court',
    name: 'Tennis Court 08',
    desc: '',
    img: TennisImg,
    slots: [
      { time: '20:00', isAvailable: false },
    ]
  },
];

function TennisCourt({ onBack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [courts, setCourts] = useState(initialCourtData);

  const [selectedDate, setSelectedDate] = useState(
     new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })
  );

  const handleSlotClick = (courtId, courtName, time, isAvailable) => {
    if (isAvailable) {
      // ✅ แก้ไข: ใช้ selectedDate จาก State ตรงๆ ข้อมูลใน Popup จะได้ตรงกับวันที่เลือก
      setSelectedBooking({ courtId, courtName, time, date: selectedDate });
      setIsModalOpen(true);
    }
  };

  const confirmBooking = () => {
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

    alert('จองสำเร็จ!');
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
        {courts.map((court) => (
          <div key={court.id} className="court-booking-card">
            <h3 className="court-title">{court.title}</h3>
            <div className="court-details">
              <img src={court.img} alt={court.name} className="court-thumbnail" />
              <div className="court-info">
                <h4>{court.name}</h4>
                {/* ถ้ามี desc ค่อยแสดง ถ้าไม่มีก็ไม่กินพื้นที่ */}
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