import React, { useState } from 'react';

function AdminBookings() {
  // 👉 1. State เก็บข้อมูลคำขอจองของนักศึกษาทั้งหมด
  const [bookingRequests, setBookingRequests] = useState([
    { id: 1, studentId: '6609650582', studentName: 'ภูมิภากร โกเมนไปรรินทร์', type: 'Karaoke', room: 'Karaoke size M Room 1', date: '21/05/2026', time: '12:00 - 14:00', status: 'รอการอนุมัติ', statusColor: '#FDE073', rejectReason: '' },
    { id: 2, studentId: '6609650001', studentName: 'สมสมร รักเรียน', type: 'Study', room: 'Puey Library Room 03', date: '19/05/2026', time: '10:00 - 12:00', status: 'รอการอนุมัติ', statusColor: '#FDE073', rejectReason: '' },
    { id: 3, studentId: '6609650002', studentName: 'ใจดี มานะ', type: 'Sport', room: 'Interzone Badminton 03', date: '18/05/2026', time: '16:00 - 18:00', status: 'อนุมัติแล้ว', statusColor: '#8BE3A8', rejectReason: '' },
  ]);

  // State สำหรับควบคุม Modal ระบุเหตุผลการปฏิเสธ
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [reasonInput, setReasonInput] = useState('');

  // ฟังก์ชันกด "อนุมัติ"
  const handleApprove = (id, name) => {
    if (window.confirm(`คุณต้องการ "อนุมัติ" การจองของ ${name} ใช่หรือไม่?`)) {
      setBookingRequests(bookingRequests.map(item => 
        item.id === id ? { ...item, status: 'อนุมัติแล้ว', statusColor: '#8BE3A8', rejectReason: '' } : item
      ));
    }
  };

  // ฟังก์ชันเมื่อกดปุ่ม "ปฏิเสธ" (เปิดสลีปให้พิมพ์เหตุผลก่อน)
  const openRejectModal = (id) => {
    setSelectedBookingId(id);
    setReasonInput('');
    setIsRejectModalOpen(true);
  };

  // ฟังก์ชันกดยืนยันการปฏิเสธใน Modal
  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!reasonInput.trim()) return alert('กรุณาระบุเหตุผลในการปฏิเสธการจองด้วยครับ');

    setBookingRequests(bookingRequests.map(item => 
      item.id === selectedBookingId 
        ? { ...item, status: 'ปฏิเสธการจอง', statusColor: '#FFB3B3', rejectReason: reasonInput } 
        : item
    ));

    setIsRejectModalOpen(false);
    alert('ปฏิเสธการจองและส่งเหตุผลกลับให้นักศึกษาเรียบร้อย');
  };

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-page-title">📥 ตารางตรวจสอบและอนุมัติการจอง</h1>
      <p className="admin-page-subtitle">จัดการคำขอเข้าใช้งานห้องติว คาราโอเกะ และสนามจองกีฬาของนักศึกษา</p>

      {/* --- ตารางข้อมูลรายการจอง --- */}
      <div className="booking-table-container">
        <div className="booking-table-header">
          <div style={{ flex: 2, textAlign: 'center' }}>การจัดการคำขอ</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>สถานะ</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>เวลาจอง</div>
          <div style={{ flex: 1.2, textAlign: 'center' }}>วันที่จอง</div>
          <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>สถานที่ / รายละเอียดห้อง</div>
          <div style={{ flex: 1, textAlign: 'center' }}>ประเภท</div>
          <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>ผู้จอง (นศ.)</div>
        </div>

        {bookingRequests.map(item => (
          <div key={item.id} className="booking-table-row" style={{ cursor: 'default' }}>
            
            {/* 🛠️ ส่วนปุ่ม อนุมัติ / ปฏิเสธ */}
            <div style={{ flex: 2, textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {item.status === 'รอการอนุมัติ' ? (
                <>
                  <button 
                    className="admin-action-btn" 
                    style={{ backgroundColor: '#1E8E3E', padding: '0.4rem 0.8rem' }}
                    onClick={() => handleApprove(item.id, item.studentName)}
                  >
                    <i className="fa-solid fa-check"></i> อนุมัติ
                  </button>
                  <button 
                    className="admin-action-btn" 
                    style={{ backgroundColor: '#E31B23', padding: '0.4rem 0.8rem' }}
                    onClick={() => openRejectModal(item.id)}
                  >
                    <i className="fa-solid fa-xmark"></i> ปฏิเสธ
                  </button>
                </>
              ) : (
                <span style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                  จัดการเรียบร้อยแล้ว
                </span>
              )}
            </div>

            {/* แถบโชว์สถานะ */}
            <div style={{ flex: 1.5, textAlign: 'center' }}>
              <span className="status-badge" style={{ backgroundColor: item.statusColor }}>
                {item.status}
              </span>
            </div>

            <div style={{ flex: 1.5, textAlign: 'center' }}>{item.time}</div>
            <div style={{ flex: 1.2, textAlign: 'center' }}>{item.date}</div>
            
            {/* รายละเอียดสถานที่ + เหตุผลกรณีโดนปฏิเสธ */}
            <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>
              <strong>{item.facility}</strong><br/>
              <span style={{ fontSize: '0.85rem', color: '#555' }}>{item.room}</span>
              {item.rejectReason && (
                <div style={{ fontSize: '0.8rem', color: '#E31B23', marginTop: '0.3rem', backgroundColor: '#FFF0F0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  ❌ เหตุผล: {item.rejectReason}
                </div>
              )}
            </div>

            <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>{item.type}</div>
            
            {/* ข้อมูลนักศึกษาผู้จอง */}
            <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>
              <strong>{item.studentName}</strong><br/>
              <span style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'monospace' }}>ID: {item.studentId}</span>
            </div>

          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* ⚠️ MODAL POPUP: กรอกเหตุผลในการปฏิเสธการจอง */}
      {/* ========================================== */}
      {isRejectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <h2 style={{ color: '#E31B23', marginBottom: '1rem' }}>
              <i className="fa-solid fa-circle-xmark"></i> ระบุเหตุผลการปฏิเสธ
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              กรุณากรอกเหตุผล เพื่อให้ระบบแจ้งกลับไปทางหน้าจอ "การจองของฉัน" ของนักศึกษาให้รับทราบ
            </p>

            <form onSubmit={handleConfirmReject}>
              <textarea
                className="report-textarea"
                style={{ height: '100px', marginBottom: '1rem' }}
                placeholder="ตัวอย่างเช่น: ตึกปิดให้บริการในวันดังกล่าว, อุปกรณ์ภายในห้องชำรุดรอซ่อมบำรุง, เกิดการจองซ้ำซ้อนในระบบ..."
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                required
              />

              <div className="modal-actions">
                <button type="submit" className="btn-confirm" style={{ backgroundColor: '#E31B23' }}>
                  ยืนยันการปฏิเสธ
                </button>
                <button type="button" className="btn-cancel" onClick={() => setIsRejectModalOpen(false)}>
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminBookings;