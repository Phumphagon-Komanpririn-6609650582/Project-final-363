import React, { useState, useEffect } from 'react';

function AdminBookings() {
  const [viewMode, setViewMode] = useState('bookings'); 

  // ข้อมูลฝั่งคิวจอง
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [reasonInput, setReasonInput] = useState('');

  // ข้อมูลฝั่งของรางวัล
  const [redeemList, setRedeemList] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [rewardStatusFilter, setRewardStatusFilter] = useState('ทั้งหมด');

  const [searchTerm, setSearchTerm] = useState('');

  // ฟังก์ชันดึงข้อมูลการจอง
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/bookings/admin/list');
      const data = await response.json();
      if (response.ok) {
        setBookingRequests(data);
      }
    } catch (error) {
      console.error('❌ ดึงข้อมูลรายการจองล้มเหลว:', error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันดึงข้อมูลประวัติการแลกของรางวัล
  const fetchRedeemHistory = async () => {
    try {
      setLoadingRewards(true);
      const response = await fetch('http://localhost:4000/api/redeem/admin/list');
      const data = await response.json();
      if (response.ok) {
        setRedeemList(data);
      }
    } catch (error) {
      console.error('❌ ดึงประวัติของรางวัลไม่สำเร็จ', error);
    } finally {
      setLoadingRewards(false);
    }
  };

  useEffect(() => {
    setSearchTerm('');
  }, [viewMode]);

  useEffect(() => {
    fetchBookings();
    fetchRedeemHistory();
  }, []);

  // ฟังก์ชันอนุมัติ คิวจองสถานที่
  const handleApprove = async (id, name) => {
    if (window.confirm(`คุณต้องการยืนยันการเช็คอินของคุณ ${name} ใช่หรือไม่?`)) {
      try {
        const response = await fetch(`http://localhost:4000/api/bookings/admin/approve/${id}`, {
          method: 'PUT'
        });
        const data = await response.json();

        if (response.ok) {
          alert(data.message || '✅ บันทึกสถานะอนุมัติเช็คอินสำเร็จ!');
          fetchBookings(); 
        } else {
          alert(`❌ เกิดข้อผิดพลาด: ${data.message}`);
        }
      } catch (error) {
        console.error('❌ อนุมัติการเช็คอินล้มเหลว:', error);
        alert('❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      }
    }
  };

  // ฟังก์ชันทำโทษกรณีผู้ใช้ ไม่มาตามนัด
  const handleNoShowPenalty = async (id, name) => {
    if (window.confirm(`ยืนยันการลงโทษตัดสิทธิ์เนื่องจากคุณ ${name}ไม่มาตามนัดใช่หรือไม่?`)) {
      try {
        const response = await fetch(`http://localhost:4000/api/bookings/admin/penalty/${id}`, {
          method: 'PUT'
        });
        if (response.ok) {
          alert('⚠️ บันทึกประวัติผิดกฎเรียบร้อย!');
          fetchBookings();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const openRejectModal = (id) => {
    setSelectedBookingId(id);
    setReasonInput('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!reasonInput.trim()) return alert('กรุณาระบุเหตุผลในการปฏิเสธการจอง');

    try {
      const response = await fetch(`http://localhost:4000/api/bookings/admin/reject/${selectedBookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectReason: reasonInput })
      });

      if (response.ok) {
        setIsRejectModalOpen(false);
        alert('ปฏิเสธการจองและส่งเหตุผลกลับให้นักศึกษาเรียบร้อย');
        fetchBookings();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ฟังก์ชันแอดมินกดอนุมัติใช้ของรางวัล
  const handleApproveRedeem = async (id, rewardName, studentId) => {
    if (window.confirm(`คุณต้องการยืนยันการอนุมัติรับของรางวัล "${rewardName}" ของนักศึกษา รหัส ${studentId} ใช่หรือไม่?`)) {
      try {
        const response = await fetch(`http://localhost:4000/api/redeem/admin/approve/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          alert('✅ อนุมัติการใช้สิทธิ์รับของรางวัลสำเร็จ!');
          fetchRedeemHistory(); 
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const checkIfPastTime = (bookingDate, timeSlot) => {
    try {
      if (!bookingDate || !timeSlot) return false;
      const [d, m, y] = bookingDate.split('/');
      let year = parseInt(y);
      if (year < 100) year = year + 2500 - 543;
      else if (year > 2500) year = year - 543;

      const startTime = timeSlot.split('-')[0].trim();
      const [hh, mm] = startTime.split(':');
      const slotDateTime = new Date(year, parseInt(m) - 1, parseInt(d), parseInt(hh), parseInt(mm));
      const now = new Date();
      return slotDateTime < now; 
    } catch (err) {
      return false;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'รอการเช็คอิน': return { backgroundColor: '#E0E0E0', color: '#333' };
      case 'เช็คอินเรียบร้อย': return { backgroundColor: '#8BE3A8', color: '#0E431F' }; 
      case 'ปฏิเสธการจอง': return { backgroundColor: '#FFB3B3', color: '#610F0F' };
      case 'ไม่มาตามนัด': return { backgroundColor: '#444444', color: '#FFFFFF', fontWeight: 'bold' };
      default: return { backgroundColor: '#E0E0E0', color: '#333' };
    }
  };

  const getRewardStatusStyle = (status) => {
    switch (status) {
      case 'ยังไม่ใช้งาน': return { backgroundColor: '#FFF8E6', color: '#F5A623', border: '1px solid #FFE0B2' };
      case 'ใช้งานแล้ว': return { backgroundColor: '#E6F4EA', color: '#1E8E3E', border: '1px solid #C4E1A4' };
      default: return { backgroundColor: '#F8F9FA', color: '#333' };
    }
  };

  const filteredBookings = bookingRequests.filter(item => {
    const matchSearch = 
      item.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.facilityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const filteredRewards = redeemList.filter(item => {
    // กรองสถานะปุ่มเมนู
    if (rewardStatusFilter !== 'ทั้งหมด' && item.status !== rewardStatusFilter) return false;
    
    // กรองคำค้นหา Search
    const matchSearch = 
      item.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rewardName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ticketCode?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="admin-dashboard-container" style={{ padding: '2rem', backgroundColor: '#EEF0F8', minHeight: '100vh' }}>
      
      <h1 className="admin-page-title" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', margin: 0 }}>
        {viewMode === 'bookings' ? '📥 ตารางตรวจสอบและอนุมัติการจอง' : '🎁 ตารางตรวจสอบอนุมัติของรางวัล'}
      </h1>
      <p className="admin-page-subtitle" style={{ color: '#666', marginTop: '0.4rem', marginBottom: '1.5rem' }}>
        {viewMode === 'bookings' 
          ? 'จัดการสิทธิ์เข้าใช้งาน คุมวินัยการเข้าเช็คอินห้องติว คาราโอเกะ และสนามย่อยของนักศึกษา' 
          : 'ตัดสิทธิ์หรือยืนยันการแจกสิทธิพิเศษของทางมหาวิทยาลัย'}
      </p>

      <div className="tab-switcher" style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setViewMode('bookings')}
          style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: viewMode === 'bookings' ? '#4A90E2' : '#FFF', color: viewMode === 'bookings' ? '#FFF' : '#555', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
        >
          🗂️ รายการคำขอจองคิว
        </button>
        <button 
          onClick={() => setViewMode('rewards')}
          style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: viewMode === 'rewards' ? '#4A90E2' : '#FFF', color: viewMode === 'rewards' ? '#FFF' : '#555', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
        >
          🎁 รายการแลกของรางวัล
        </button>
      </div>

      <div style={{ backgroundColor: '#FFF', padding: '1rem 1.2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.2rem' }}>
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', color: '#888' }}></i>
          <input 
            type="text" 
            placeholder={viewMode === 'bookings' ? "ค้นหาด้วยรหัสนักศึกษา, ชื่อสถานที่ หรือชื่อผู้จอง..." : "ค้นหาด้วยรหัสนักศึกษา, รหัสตั๋ว Ticket หรือชื่อของรางวัล..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #DDD', outline: 'none', fontSize: '0.9rem', color: '#333', transition: 'border-color 0.2s' }}
            onFocus={(e) => e.target.style.borderColor = '#4A90E2'}
            onBlur={(e) => e.target.style.borderColor = '#DDD'}
          />
          {searchTerm && (
            <i className="fa-solid fa-circle-xmark" style={{ position: 'absolute', right: '12px', color: '#BBB', cursor: 'pointer' }} onClick={() => setSearchTerm('')}></i>
          )}
        </div>
      </div>

      {viewMode === 'bookings' && (
  <div className="booking-table-container" style={{ backgroundColor: '#FFF', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
    {/* 📋 หัวตารางคำขอจองคิว: เพิ่มคอลัมน์รหัสการจอง และเฉลี่ยสัดส่วน flex ใหม่ */}
    <div className="booking-table-header" style={{ display: 'flex', padding: '1rem', backgroundColor: '#F8F9FA', color: '#444', borderBottom: '2px solid #EEE' }}>
      <div style={{ flex: 2.5, textAlign: 'center', fontWeight: 'bold' }}>การจัดการคำขอ / เครื่องมือควบคุม</div>
      <div style={{ flex: 1.5, textAlign: 'center', fontWeight: 'bold' }}>สถานะ</div>
      <div style={{ flex: 1.2, textAlign: 'center', fontWeight: 'bold' }}>รหัสการจอง</div>
      <div style={{ flex: 1.2, textAlign: 'center', fontWeight: 'bold' }}>เวลาจอง</div>
      <div style={{ flex: 1.2, textAlign: 'center', fontWeight: 'bold' }}>วันที่จอง</div>
      <div style={{ flex: 2.8, textAlign: 'left', paddingLeft: '1rem', fontWeight: 'bold' }}>สถานที่ / รายละเอียดห้อง</div>
      <div style={{ flex: 1,   textAlign: 'center', fontWeight: 'bold' }}>ประเภท</div>
      <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem', fontWeight: 'bold' }}>ผู้จอง</div>
    </div>

    {loading ? (
      <p style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>กำลังดึงข้อมูลตารางตรวจสอบจากฐานข้อมูล...</p>
    ) : filteredBookings.length > 0 ? (
      filteredBookings.map(item => {
        const isPast = checkIfPastTime(item.bookingDate, item.timeSlot);
        const studentDisplayName = item.studentName || 'นักศึกษาในระบบ';

        return (
          <div key={item._id} className="booking-table-row" style={{ display: 'flex', alignItems: 'center', padding: '1.2rem 1rem', borderBottom: '1px solid #EEE' }}>
         
            <div style={{ flex: 2.5, textAlign: 'center', display: 'flex', gap: '6px', justifyContent: 'center' }}>
              {item.status === 'รอการเช็คอิน' ? (
                !isPast ? (
                  <>
                    <button style={{ backgroundColor: '#1E8E3E', color: '#FFF', border: 'none', padding: '0.45rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleApprove(item._id, studentDisplayName)}>
                      <i className="fa-solid fa-check"></i> อนุมัติ
                    </button>
                    <button style={{ backgroundColor: '#E31B23', color: '#FFF', border: 'none', padding: '0.45rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => openRejectModal(item._id)}>
                      <i className="fa-solid fa-xmark"></i> ปฏิเสธ
                    </button>
                  </>
                ) : (
                  <button style={{ backgroundColor: '#F5A623', color: '#222', border: 'none', padding: '0.45rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleNoShowPenalty(item._id, studentDisplayName)}>
                    🚨 ลงโทษ (ไม่มาตามนัด)
                  </button>
                )
              ) : item.status === 'เช็คอินเรียบร้อย' ? (
                <span style={{ fontSize: '0.85rem', color: '#1E8E3E', fontWeight: 'bold', fontStyle: 'italic' }}>✓ เช็คอินเรียบร้อย (+2 แต้ม)</span>
              ) : (
                <span style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>จัดการเรียบร้อยแล้ว</span>
              )}
            </div>

            <div style={{ flex: 1.5, textAlign: 'center' }}>
              <span className="status-badge" style={{ ...getStatusStyle(item.status), padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                {item.status}
              </span>
            </div>


            <div style={{ flex: 1.2, textAlign: 'center', fontWeight: 'bold', color: '#333', fontFamily: 'monospace', fontSize: '1rem' }}>
              {item.bookingCode || 'N/A'}
            </div>

            <div style={{ flex: 1.2, textAlign: 'center', fontWeight: '500' }}>{item.timeSlot || item.time}</div>
            
            <div style={{ flex: 1.2, textAlign: 'center' }}>{item.bookingDate || item.date}</div>
            
            <div style={{ flex: 2.8, textAlign: 'left', paddingLeft: '1rem' }}>
              <strong style={{ color: '#333' }}>{item.facilityName || item.facility}</strong><br/>
              <span style={{ fontSize: '0.85rem', color: '#0056B3' }}>{item.roomName || item.room}</span>
              {item.rejectReason && (
                <div style={{ fontSize: '0.8rem', color: '#E31B23', marginTop: '0.3rem', backgroundColor: '#FFF0F0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  ❌ เหตุผล: {item.rejectReason}
                </div>
              )}
            </div>

            <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#555' }}>{item.type}</div>

            <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>
              <strong style={{ color: '#333' }}>{studentDisplayName}</strong><br/>
              <span style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'monospace' }}>ID: {item.studentId}</span>
            </div>

          </div>
        );
      })
    ) : (
      <p style={{ textAlign: 'center', padding: '4rem', color: '#999', fontStyle: 'italic' }}>ไม่พบลำดับคิวการจองที่ตรงตามเงื่อนไขการค้นหาของคุณ</p>
    )}
  </div>
)}

   
      {viewMode === 'rewards' && (
        <>

          <div className="filter-button-group" style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem' }}>
            {['ทั้งหมด', 'ยังไม่ใช้งาน', 'ใช้งานแล้ว'].map((status) => (
              <button
                key={status}
                onClick={() => setRewardStatusFilter(status)}
                style={{ padding: '0.5rem 1.2rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: rewardStatusFilter === status ? '#4A90E2' : '#FFF', color: rewardStatusFilter === status ? '#FFF' : '#555', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
              >
                {status === 'ทั้งหมด' && `📌 ทั้งหมด (${redeemList.length})`}
                {status === 'ยังไม่ใช้งาน' && `⏳ ยังไม่ใช้งาน (${redeemList.filter(x => x.status === 'ยังไม่ใช้งาน').length})`}
                {status === 'ใช้งานแล้ว' && `✅ ใช้งานแล้ว (${redeemList.filter(x => x.status === 'ใช้งานแล้ว').length})`}
              </button>
            ))}
          </div>

          <div className="booking-table-container" style={{ backgroundColor: '#FFF', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div className="booking-table-header" style={{ display: 'flex', padding: '1rem', backgroundColor: '#F8F9FA', color: '#444', borderBottom: '2px solid #EEE' }}>
              <div style={{ flex: 2.0, textAlign: 'center', fontWeight: 'bold' }}>การจัดการ / อนุมัติ</div>
              <div style={{ flex: 1.5, textAlign: 'center', fontWeight: 'bold' }}>สถานะสิทธิ์</div>
              <div style={{ flex: 2.0, textAlign: 'center', fontWeight: 'bold' }}>Ticket Code (รหัสตั๋ว)</div>
              <div style={{ flex: 1.2, textAlign: 'center', fontWeight: 'bold' }}>คะแนนที่ใช้</div>
              <div style={{ flex: 3.5, textAlign: 'left', paddingLeft: '1rem', fontWeight: 'bold' }}>ของรางวัลที่แลก</div>
              <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem', fontWeight: 'bold' }}>ผู้ใช้สิทธิ์</div>
            </div>

            {loadingRewards ? (
              <p style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>กำลังดึงข้อมูลประวัติของรางวัลจาก</p>
            ) : filteredRewards.length > 0 ? (
              filteredRewards.map(reward => (
                <div key={reward._id} className="booking-table-row" style={{ display: 'flex', alignItems: 'center', padding: '1.2rem 1rem', borderBottom: '1px solid #EEE', backgroundColor: '#FFF' }}>
                  
                  <div style={{ flex: 2.0, textAlign: 'center' }}>
                    {reward.status === 'ยังไม่ใช้งาน' ? (
                      <button 
                        style={{ backgroundColor: '#1E8E3E', color: '#FFF', border: 'none', padding: '0.45rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(30,142,62,0.2)' }} 
                        onClick={() => handleApproveRedeem(reward._id, reward.rewardName, reward.studentId)}
                      >
                        <i className="fa-solid fa-gift"></i> อนุมัติใช้งาน
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#AAA', fontStyle: 'italic', fontWeight: '500' }}>✔️ แจกรางวัลแล้ว</span>
                    )}
                  </div>

                  <div style={{ flex: 1.5, textAlign: 'center' }}>
                    <span className="status-badge" style={{ ...getRewardStatusStyle(reward.status), padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', display: 'inline-block', minWidth: '85px' }}>
                      {reward.status}
                    </span>
                  </div>

                  <div style={{ flex: 2.0, textAlign: 'center', fontWeight: 'bold', color: '#0056B3', fontFamily: 'monospace', fontSize: '1.05rem', backgroundColor: '#F0F4F8', padding: '0.3rem 0.6rem', borderRadius: '6px', display: 'inline-block' }}>
                    {reward.ticketCode}
                  </div>

                  <div style={{ flex: 1.2, textAlign: 'center', fontWeight: 'bold', color: '#E31B23', fontSize: '1rem' }}>
                    -{reward.pointsUsed} Pt.
                  </div>

                  <div style={{ flex: 3.5, textAlign: 'left', paddingLeft: '1rem' }}>
                    <strong style={{ color: '#333', fontSize: '0.95rem' }}>{reward.rewardName}</strong>
                  </div>

                  <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>ID: </span>
                    <strong style={{ color: '#333', fontFamily: 'monospace', fontSize: '0.95rem' }}>{reward.studentId}</strong>
                  </div>

                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#999', backgroundColor: '#FFF' }}>
                <i className="fa-solid fa-gift" style={{ fontSize: '2.5rem', color: '#DDD', marginBottom: '0.5rem' }}></i>
                <p style={{ margin: 0, fontStyle: 'italic' }}>ไม่พบรายการของรางวัลที่ตรงตามข้อกำหนดการค้นหา</p>
              </div>
            )}
          </div>
        </>
      )}

      {isRejectModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div className="modal-content" style={{ maxWidth: '450px', backgroundColor: '#FFF', padding: '2rem', borderRadius: '8px', width: '100%' }}>
            <h2 style={{ color: '#E31B23', marginBottom: '1rem', marginTop: 0 }}><i className="fa-solid fa-circle-xmark"></i> ระบุเหตุผลการปฏิเสธ</h2>
            <form onSubmit={handleConfirmReject}>
              <textarea style={{ height: '100px', marginBottom: '1rem', width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #CCC', resize: 'none' }} placeholder="ระบุเหตุผลในการปฏิเสธคำขอ..." value={reasonInput} onChange={(e) => setReasonInput(e.target.value)} required />
              <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="submit" style={{ backgroundColor: '#E31B23', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ยืนยันการปฏิเสธ</button>
                <button type="button" style={{ backgroundColor: '#BBB', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsRejectModalOpen(false)}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookings;