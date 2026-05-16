import React, { useState } from 'react';

function MyBooking() {
  const [viewMode, setViewMode] = useState('bookings');

  // ฟังก์ชันเช็คเงื่อนไข 2 ชั่วโมงก่อนเวลาจอง
  const checkIsModifiable = (dateStr, timeStr) => {
    try {
      const [day, month, year] = dateStr.split('/');
      const startTime = timeStr.split(' - ')[0]; 
      const [hours, minutes] = startTime.split(':');
      const bookingDateTime = new Date(year, month - 1, day, hours, minutes);
      const currentDateTime = new Date(); 
      const diffHours = (bookingDateTime - currentDateTime) / (1000 * 60 * 60);
      return diffHours >= 2; 
    } catch (error) {
      return false;
    }
  };

  // State ข้อมูลการจอง
  const [bookings, setBookings] = useState([
    { 
      id: 1, 
      type: 'Karaoke', 
      facility: 'Melody Sphere Zone Karaoke', 
      room: 'Karaoke size M Room 1', 
      date: '21/05/2026', 
      time: '12:00 - 14:00', 
      code: 'EAWRUH', 
      status: 'รอการเช็คอิน', 
      statusColor: '#FDE073', 
      canReport: false,
      createdAt: '14/05/2026 09:30'
    },
    { 
      id: 2, 
      type: 'Study', 
      facility: 'Puey Ungphakorn Library', 
      room: 'Study Room 04', 
      date: new Date().toLocaleDateString('en-GB'), 
      time: `${new Date().getHours() + 1}:00 - ${new Date().getHours() + 2}:00`, 
      code: '998XCY', 
      status: 'รอการเช็คอิน', 
      statusColor: '#FDE073', 
      canReport: false,
      createdAt: '14/05/2026 10:15'
    },
    { 
      id: 3, 
      type: 'Badminton', 
      facility: 'Badminton Court Interzone', 
      room: 'Interzone Badminton Court 03', 
      date: '10/12/2025', 
      time: '16:00 - 18:00', 
      code: '7ZVOIUO', 
      status: 'เช็กอินเรียบร้อย', 
      statusColor: '#8BE3A8', 
      canReport: true,
      createdAt: '06/12/2025 23:59'
    },
  ]);

  // ข้อมูลของรางวัล
  const myRedeemedRewards = [
    { id: 1, name: 'น้ำดื่ม TU', points: 20, refCode: 'TU-W8821', date: '14/05/2026', time: '14:20', status: 'ยังไม่ได้มารับ', statusColor: '#8BE3A8', icon: 'fa-solid fa-bottle-water', color: '#4A90E2' },
    { id: 2, name: 'ขนมขบเคี้ยว (Snack)', points: 30, refCode: 'TU-S1109', date: '10/05/2026', time: '10:05', status: 'รับแล้ว', statusColor: '#EEEEEE', icon: 'fa-solid fa-cookie', color: '#D0021B' },
  ];

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reportingBooking, setReportingBooking] = useState(null);
  const [reportText, setReportText] = useState('');

  // ฟังก์ชันยกเลิกการจอง
  const handleCancelBooking = (id) => {
    if (window.confirm("คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?")) {
      setBookings(bookings.map(item => 
        item.id === id ? { ...item, status: 'ยกเลิกการจอง', statusColor: '#FFB3B3' } : item
      ));
      alert("ยกเลิกการจองสำเร็จ");
    }
  };

  const handleSubmitReport = () => {
    if (!reportText.trim()) return alert('กรุณากรอกรายละเอียดปัญหาครับ');
    alert('ระบบได้ทำการบันทึกแล้วแจ้งแอดมินแล้ว');
    setReportText('');
    setReportingBooking(null);
  };

  return (
    <div className="my-booking-container">
      <div className="tab-switcher">
        <button className={viewMode === 'bookings' ? 'tab-btn active' : 'tab-btn'} onClick={() => setViewMode('bookings')}>การจองของฉัน</button>
        <button className={viewMode === 'rewards' ? 'tab-btn active' : 'tab-btn'} onClick={() => setViewMode('rewards')}>ของรางวัลของฉัน</button>
      </div>

      {/* --- ตารางการจอง --- */}
      {viewMode === 'bookings' && (
        <div className="booking-table-container">
          <div className="booking-table-header">
            <div style={{ flex: 1.5, textAlign: 'center' }}>จัดการ</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>สถานะการจอง</div>
            <div style={{ flex: 1.2, textAlign: 'center' }}>รหัสการจอง</div>
            <div style={{ flex: 1.2, textAlign: 'center' }}>วันที่จอง</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>เวลาจอง</div>
            <div style={{ flex: 1, textAlign: 'center' }}>ประเภท</div>
            <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>ชื่อสนาม/ห้อง</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>เวลาสร้างการจอง</div>
          </div>
          {bookings.map(item => {
            const isPending = item.status === 'รอการเช็คอิน';
            const canCancel = isPending && checkIsModifiable(item.date, item.time);
            return (
              <div key={item.id} className="booking-table-row" onClick={() => setSelectedBooking(item)}>
                <div style={{ flex: 1.5, textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {item.canReport && (
                    <button className="report-btn active" onClick={(e) => { e.stopPropagation(); setReportingBooking(item); }}>
                       รายงาน
                    </button>
                  )}
                  {isPending && (
                    <button 
                      className={`cancel-booking-btn ${!canCancel ? 'disabled' : ''}`} 
                      onClick={(e) => { e.stopPropagation(); if(canCancel) handleCancelBooking(item.id); }} 
                      disabled={!canCancel}
                    >
                      ยกเลิก
                    </button>
                  )}
                </div>
                <div style={{ flex: 1.5, textAlign: 'center' }}><span className="status-badge" style={{ backgroundColor: item.statusColor }}>{item.status}</span></div>
                <div style={{ flex: 1.2, textAlign: 'center', fontWeight: 'bold' }}>{item.code}</div>
                <div style={{ flex: 1.2, textAlign: 'center' }}>{item.date}</div>
                <div style={{ flex: 1.5, textAlign: 'center' }}>{item.time}</div>
                <div style={{ flex: 1, textAlign: 'center' }}>{item.type}</div>
                <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}><strong>{item.facility}</strong><br/><span style={{ fontSize: '0.85rem', color: '#666' }}>{item.room}</span></div>
                <div style={{ flex: 1.5, textAlign: 'center', color: '#666' }}>{item.createdAt}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- ตารางของรางวัล --- */}
      {viewMode === 'rewards' && (
        <div className="booking-table-container">
          <div className="booking-table-header">
            <div style={{ flex: 0.5, textAlign: 'center' }}>ไอคอน</div>
            <div style={{ flex: 2, textAlign: 'left' }}>ชื่อของรางวัล</div>
            <div style={{ flex: 1, textAlign: 'center' }}>ใช้แต้ม</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>รหัสอ้างอิง</div>
            <div style={{ flex: 1.2, textAlign: 'center' }}>วันที่แลก</div>
            <div style={{ flex: 1.2, textAlign: 'center' }}>เวลาที่แลก</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>สถานะ</div>
          </div>
          {myRedeemedRewards.map(item => (
            <div key={item.id} className="booking-table-row" style={{ cursor: 'default' }}>
              <div style={{ flex: 0.5, textAlign: 'center', fontSize: '1.5rem', color: item.color }}><i className={item.icon}></i></div>
              <div style={{ flex: 2, textAlign: 'left', fontWeight: 'bold' }}>{item.name}</div>
              <div style={{ flex: 1, textAlign: 'center', color: '#E31B23', fontWeight: 'bold' }}>-{item.points}</div>
              <div style={{ flex: 1.5, textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold' }}>{item.refCode}</div>
              <div style={{ flex: 1.2, textAlign: 'center' }}>{item.date}</div>
              <div style={{ flex: 1.2, textAlign: 'center' }}>{item.time}</div>
              <div style={{ flex: 1.5, textAlign: 'center' }}><span className="status-badge" style={{ backgroundColor: item.statusColor }}>{item.status}</span></div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================== */}
      {/* 👉 POPUP 1: ข้อมูลการจอง (เอารายละเอียดกลับมาแล้ว!) */}
      {/* ========================================== */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{textAlign: 'center', padding: '2rem'}}>
            <h2 style={{ marginBottom: '1.5rem' }}>ข้อมูลการจอง</h2>
            
            {/* กล่องรหัสดีไซน์แบบในรูป (มีกรอบเส้นประ) */}
            <div style={{ backgroundColor: '#FAFAFA', padding: '2rem 1rem', borderRadius: '1rem', border: '2px dashed #CCC', marginBottom: '1.5rem' }}>
              <p style={{ color: '#555', marginBottom: '0.5rem' }}>รหัสการจอง (Booking Code)</p>
              <h1 style={{ fontSize: '3.5rem', color: '#E31B23', letterSpacing: '0.2rem', margin: '0' }}>{selectedBooking.code}</h1>
            </div>

            {/* ข้อมูลรายละเอียดที่เคยหายไป... กลับมาแล้วครับ! */}
            <div style={{ textAlign: 'left', backgroundColor: '#FFF5F5', padding: '1.2rem', borderRadius: '0.5rem', marginBottom: '1.5rem', lineHeight: '1.8' }}>
              <p><strong>สถานที่:</strong> {selectedBooking.facility}</p>
              <p><strong>ห้อง/สนาม:</strong> {selectedBooking.room}</p>
              <p><strong>วันที่เข้าใช้งาน:</strong> {selectedBooking.date} &nbsp;|&nbsp; <strong>เวลา:</strong> {selectedBooking.time}</p>
              <p><strong>สถานะปัจจุบัน:</strong> <span style={{ color: selectedBooking.statusColor === '#FDE073' ? '#D4A017' : '#1E8E3E', fontWeight: 'bold' }}>{selectedBooking.status}</span></p>
            </div>

            {/* ปุ่มปิดสีเหลืองตามรูปเป๊ะๆ */}
            <button 
              style={{ 
                width: '100%', 
                backgroundColor: '#E8C547', /* สีเหลืองมัสตาร์ด */
                color: 'white', 
                padding: '0.8rem', 
                border: 'none', 
                borderRadius: '0.5rem', 
                fontSize: '1.1rem', 
                fontWeight: 'bold', 
                cursor: 'pointer' 
              }} 
              onClick={() => setSelectedBooking(null)}
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* POPUP 2: รายงานปัญหา */}
      {/* ========================================== */}
      {reportingBooking && (
        <div className="modal-overlay" onClick={() => setReportingBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{color: '#E31B23'}}><i className="fa-solid fa-triangle-exclamation"></i> รายงานปัญหา</h2>
            <textarea className="report-textarea" placeholder="ระบุรายละเอียดปัญหา..." value={reportText} onChange={(e) => setReportText(e.target.value)}></textarea>
            <div className="modal-actions" style={{marginTop: '1rem'}}>
              <button className="btn-confirm" style={{backgroundColor: '#E31B23'}} onClick={handleSubmitReport}>ส่งรายงาน</button>
              <button className="btn-cancel" onClick={() => setReportingBooking(null)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBooking;