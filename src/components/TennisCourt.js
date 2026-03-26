import React, { useState } from 'react';

const initialCourtData = [
  {
    id: '03',
    name: 'Tennis Court 03',
    img: 'https://psm.tu.ac.th/wp-content/uploads/2023/08/%E0%B9%80%E0%B8%97%E0%B8%99%E0%B8%99%E0%B8%B4%E0%B8%AA%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A1-scaled.jpg',
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
    name: 'Tennis Court 04',
    img: 'https://psm.tu.ac.th/wp-content/uploads/2023/08/%E0%B9%80%E0%B8%97%E0%B8%99%E0%B8%99%E0%B8%B4%E0%B8%AA%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A1-scaled.jpg',
    slots: [
      { time: '16:00', isAvailable: true },
      { time: '17:00', isAvailable: true },
      { time: '18:00', isAvailable: false },
      { time: '19:00', isAvailable: false },
      { time: '20:00', isAvailable: false },
    ]
  }
];

function TennisCourt({ onBack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [courts, setCourts] = useState(initialCourtData);

  const handleSlotClick = (courtId, courtName, time, isAvailable) => {
    if (isAvailable) {
      setSelectedBooking({ courtId, courtName, time, date: '20/03/69' });
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
        {courts.map((court) => (
          <div key={court.id} className="court-booking-card">
            <h3 className="court-title">Tennis Court</h3>
            <div className="court-details">
              <img src={court.img} alt={court.name} className="court-thumbnail" />
              <div className="court-info">
                <h4>{court.name}</h4>
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

export default TennisCourt;