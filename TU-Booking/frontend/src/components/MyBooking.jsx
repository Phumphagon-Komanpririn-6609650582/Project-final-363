import React, { useState, useEffect } from 'react';

function MyBooking({ user }) {
  const [viewMode, setViewMode] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ส่วนจัดการฝั่งประวัติของรางวัล
  const [myRewards, setMyRewards] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  // 👉 🎯 1. [เพิ่มใหม่] สเตตควบคุมเปิด/ปิด และเก็บข้อมูลสำหรับระบบรายงานสิ่งชำรุด
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportBooking, setReportBooking] = useState(null);
  const [reportDescription, setReportDescription] = useState('');

  // ฟังก์ชันดึงประวัติคิวจองสิ่งอำนวยความสะดวก
  const fetchBookings = async () => {
    try {
      if (!user?.studentId) return;
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/bookings/my-history?studentId=${user.studentId}`);
      const data = await response.json();
      
      if (response.ok) {
        const formatted = data.map(b => {
          // 👉 ตรรกะกระจายสีป้ายสถานะให้ตรงตามเงื่อนไขฐานข้อมูลจริงของระบบ
          let statusColor = '#FDE073'; // รอการเช็คอิน (เหลือง)
          if (b.status === 'เช็คอินเรียบร้อย') statusColor = '#8BE3A8'; // เขียว
          if (b.status === 'ปฏิเสธการจอง') statusColor = '#FFB3B3'; // แดงอ่อน
          if (b.status === 'ไม่มาตามนัด') statusColor = '#E0E0E0'; // เทาประวัติเสีย
          if (b.status === 'ยกเลิกแล้ว') statusColor = '#FFC0CB'; // ชมพู/แดงจางๆ

          return {
            id: b._id,
            facility: b.facilityName,
            room: b.roomName,
            date: b.bookingDate,
            time: b.timeSlot,
            code: b.bookingCode || 'N/A', 
            status: b.status,
            rejectReason: b.rejectReason || '', 
            type: b.type || 'ทั่วไป',
            statusColor: statusColor,
            createdAt: new Date(b.createdAt).toLocaleString('th-TH')
          };
        });
        setBookings(formatted);
      }
    } catch (error) {
      console.error('❌ ไม่สามารถดึงข้อมูลการจองได้:', error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันดึงข้อมูลประวัติของรางวัลที่แลกมาจากฐานข้อมูล
  const fetchMyRewards = async () => {
    try {
      if (!user?.studentId) return;
      setLoadingRewards(true);
      const response = await fetch(`http://localhost:4000/api/redeem/my-rewards?studentId=${user.studentId}`);
      const data = await response.json();
      
      if (response.ok) {
        setMyRewards(data);
      }
    } catch (error) {
      console.error('❌ ดึงประวัติของรางวัลพัง:', error);
    } finally {
      setLoadingRewards(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchMyRewards();
  }, [user]);

  // 👉 🎯 2. [เพิ่มใหม่] ฟังก์ชันเปิด Modal กรอกข้อความส่งรายงานชำรุด
  const openReportModal = (e, booking) => {
    e.stopPropagation(); // 🛡️ กันไม่ให้แถวคลิกทำงานจนหน้าต่างข้อมูลการจองเด้งซ้อน
    setReportBooking(booking);
    setReportDescription('');
    setIsReportModalOpen(true);
  };

  // 👉 🎯 3. [เพิ่มใหม่] ฟังก์ชันยิง Fetch บันทึกรายงานชำรุดลง MongoDB จริง
  const handleSendReport = async (e) => {
    e.preventDefault();
    if (!reportDescription.trim()) return alert('กรุณากรอกรายละเอียดสิ่งที่ชำรุดเสียหาย');

    try {
      const response = await fetch('http://localhost:4000/api/reports/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: reportBooking.id,
          facilityName: reportBooking.facility,
          userName: user?.name, // ดึงเมลจริงจาก Object user ของมึง
          description: reportDescription
        })
      });

      if (response.ok) {
        alert('📢 ส่งรายงานสิ่งชำรุดเข้าสู่ระบบสำเร็จ! แอดมินจะรีบเข้าดำเนินการแก้ไข');
        setIsReportModalOpen(false);
      } else {
        alert('❌ ส่งรายงานแจ้งซ่อมล้มเหลว');
      }
    } catch (error) {
      console.error(error);
      alert('❌ เชื่อมต่อเซิร์ฟเวอร์หลังบ้านขัดข้อง');
    }
  };

  const handleCancelBooking = async (booking) => {
    try {
      const [d, m, y] = booking.date.split('/');
      let year = parseInt(y);
      if (year < 100) year = year + 2500 - 543;
      else if (year > 2500) year = year - 543;

      const startTime = booking.time.split('-')[0].trim();
      const [hh, mm] = startTime.split(':');
      const bookingDateTime = new Date(year, parseInt(m) - 1, parseInt(d), parseInt(hh), parseInt(mm));
      const now = new Date();
      const diffHours = (bookingDateTime - now) / (1000 * 60 * 60);

      if (diffHours < 0) {
        alert("❌ ไม่สามารถยกเลิกได้ เนื่องจากเลยเวลาที่จอง");
        return;
      }
      if (diffHours < 2) {
        alert("❌ ไม่สามารถยกเลิกได้ ต้องยกเลิกก่อนเวลาจองอย่างน้อย 2 ชั่วโมง");
        return;
      }

      if (window.confirm("คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?")) {
        const response = await fetch(`http://localhost:4000/api/bookings/cancel/${booking.id}`, { method: 'POST' });
        if (response.ok) {
          alert("✅ ยกเลิกการจองสำเร็จ");
          fetchBookings(); 
        } else {
          alert("❌ ไม่สามารถยกเลิกได้");
        }
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="my-booking-container" style={{ padding: '1rem' }}>
      <div className="tab-switcher" style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
        <button className={viewMode === 'bookings' ? 'tab-btn active' : 'tab-btn'} onClick={() => setViewMode('bookings')}>การจองของฉัน</button>
        <button className={viewMode === 'rewards' ? 'tab-btn active' : 'tab-btn'} onClick={() => setViewMode('rewards')}>ของรางวัลของฉัน</button>
      </div>

      {/* --- แท็บระบบที่ 1: รายการคิวจอง --- */}
      {viewMode === 'bookings' && (
        <div className="booking-table-container">
          <div className="booking-table-header" style={{ display: 'flex', fontWeight: 'bold', padding: '1rem', backgroundColor: '#F8F9FA' }}>
            <div style={{ flex: 1.8, textAlign: 'center' }}>จัดการ</div> {/* ขยับสเปซเพิ่มปุ่มรายงาน */}
            <div style={{ flex: 1.5, textAlign: 'center' }}>官สถานะ</div>
            <div style={{ flex: 1.2, textAlign: 'center' }}>รหัสการจอง</div>
            <div style={{ flex: 1.2, textAlign: 'center' }}>วันที่</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>เวลา</div>
            <div style={{ flex: 1.0, textAlign: 'center' }}>ประเภท</div>
            <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>ชื่อสนาม/ห้อง</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>เวลาสร้าง</div>
          </div>
          
          {loading ? (
            <p style={{textAlign:'center', padding:'2rem'}}>กำลังโหลดข้อมูล...</p> 
          ) : bookings.length > 0 ? (
            bookings.map(item => (
              <div key={item.id} className="booking-table-row" onClick={() => setSelectedBooking(item)} style={{ display: 'flex', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #EEE', cursor: 'pointer' }}>
                
                {/* 🛠️ ส่วนจัดการ: พ่นปุ่มอิงตามความเงื่อนไขสถานะจริง */}
                <div style={{ flex: 1.8, textAlign: 'center', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  {item.status === 'รอการเช็คอิน' && (
                    <button className="cancel-booking-btn" onClick={(e) => { e.stopPropagation(); handleCancelBooking(item); }} style={{ backgroundColor: '#E31B23', color: '#FFF', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>ยกเลิก</button>
                  )}
                  
                  {/* 👉 🎯 [จุดแก้ไขบรีฟหลัก] เช็คสถานะ "เช็คอินเรียบร้อย" สั่งเรนเดอร์ปุ่มแดงรายงานชำรุดทันที */}
                  {item.status === 'เช็คอินเรียบร้อย' && (
                    <button 
                      onClick={(e) => openReportModal(e, item)} 
                      style={{ backgroundColor: '#E31B23', color: '#FFF', border: 'none', padding: '0.35rem 0.7rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <i className="fa-solid fa-triangle-exclamation"></i> รายงานชำรุด
                    </button>
                  )}
                </div>

                <div style={{ flex: 1.5, textAlign: 'center' }}><span className="status-badge" style={{ backgroundColor: item.statusColor, padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', color: '#222' }}>{item.status}</span></div>
                <div style={{ flex: 1.2, textAlign: 'center', fontWeight: 'bold' }}>{item.code}</div>
                <div style={{ flex: 1.2, textAlign: 'center' }}>{item.date}</div>
                <div style={{ flex: 1.5, textAlign: 'center' }}>{item.time}</div>
                <div style={{ flex: 1.0, textAlign: 'center' }}>{item.type}</div> 
                <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}><strong>{item.facility}</strong><br/><span style={{ fontSize: '0.85rem', color: '#666' }}>{item.room}</span></div>
                <div style={{ flex: 1.5, textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>{item.createdAt}</div>
              </div>
            ))
          ) : (
            <div style={{textAlign:'center', padding:'3rem', color: '#666'}}>
              <p>ยังไม่มีรายการจองในขณะนี้</p>
            </div>
          )}
        </div>
      )}

      {/* --- แท็บระบบที่ 2: ของรางวัลของฉัน --- */}
      {viewMode === 'rewards' && (
        <div className="booking-table-container">
          <div className="booking-table-header" style={{ display: 'flex', fontWeight: 'bold', padding: '1rem', backgroundColor: '#F8F9FA' }}>
            <div style={{ flex: 1.5, textAlign: 'center' }}>สถานะสิทธิ์</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>รหัสรับรางวัล</div>
            <div style={{ flex: 3.0, textAlign: 'left', paddingLeft: '1rem' }}>ชื่อของรางวัล</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>แต้มที่ใช้</div>
            <div style={{ flex: 2.5, textAlign: 'center' }}>วันที่-เวลาที่แลก</div>
          </div>

          {loadingRewards ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>กำลังโหลดข้อมูลประวัติรับของรางวัล...</p>
          ) : myRewards.length > 0 ? (
            myRewards.map(reward => (
              <div key={reward._id} className="booking-table-row" onClick={() => setSelectedReward(reward)} style={{ display: 'flex', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #EEE', cursor: 'pointer' }}>
                <div style={{ flex: 1.5, textAlign: 'center' }}>
                  <span className="status-badge" style={{ backgroundColor: reward.status === 'ยังไม่ใช้งาน' ? '#8BE3A8' : '#FFB3B3', color: '#333', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                    {reward.status}
                  </span>
                </div>
                <div style={{ flex: 1.5, textAlign: 'center', fontWeight: 'bold', color: '#333' }}>{reward.ticketCode}</div>
                <div style={{ flex: 3.0, textAlign: 'left', paddingLeft: '1rem' }}><strong>{reward.rewardName}</strong></div>
                <div style={{ flex: 1.5, textAlign: 'center', color: '#D0021B', fontWeight: 'bold' }}>-{reward.pointsUsed} แต้ม</div>
                <div style={{ flex: 2.5, textAlign: 'center', color: '#666' }}>{new Date(reward.createdAt).toLocaleString('th-TH')}</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <p>คุณยังไม่เคยแลกของรางวัลใดๆ ในขณะนี้</p>
            </div>
          )}
        </div>
      )}

      {/* PopUp รายละเอียดคิวจอง */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{textAlign: 'center', padding: '2rem', backgroundColor: '#FFF', borderRadius: '8px', maxWidth: '400px', width: '100%' }}>
            <h2>ข้อมูลการจอง</h2>
            <div style={{ padding: '1.5rem 1rem', border: '2px dashed #CCC', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '3rem', color: '#E31B23', margin: 0 }}>{selectedBooking.code}</h1>
            </div>
            <div style={{ textAlign: 'left', backgroundColor: '#FFF5F5', padding: '1.2rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
              <p style={{ margin: '0.4rem 0' }}><strong>ประเภท:</strong> {selectedBooking.type}</p>
              <p style={{ margin: '0.4rem 0' }}><strong>สถานที่:</strong> {selectedBooking.facility}</p>
              <p style={{ margin: '0.4rem 0' }}><strong>ห้อง/สนาม:</strong> {selectedBooking.room}</p>
              <p style={{ margin: '0.4rem 0' }}><strong>วันที่:</strong> {selectedBooking.date} | <strong>เวลา:</strong> {selectedBooking.time}</p>
              <p style={{ margin: '0.4rem 0' }}><strong>สถานะ:</strong> {selectedBooking.status}</p>
              
              {selectedBooking.status === 'ปฏิเสธการจอง' && selectedBooking.rejectReason && (
                <div style={{ marginTop: '0.8rem', padding: '0.5rem', backgroundColor: '#FFD2D2', borderRadius: '4px', borderLeft: '4px solid #E31B23' }}>
                  <span style={{ color: '#CD1818', fontWeight: 'bold', fontSize: '0.9rem' }}>❌ เหตุผลที่ปฏิเสธ:</span>
                  <p style={{ color: '#333', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>{selectedBooking.rejectReason}</p>
                </div>
              )}
            </div>
            <button className="btn-close-modal" onClick={() => setSelectedBooking(null)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>ปิดหน้าต่าง</button>
          </div>
        </div>
      )}

      {/* PopUp ตั๋วโชว์รหัสของรางวัล */}
      {selectedReward && (
        <div className="modal-overlay" onClick={() => setSelectedReward(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#FFF', borderRadius: '8px', maxWidth: '400px', width: '100%' }}>
            <h2 style={{ color: '#1E8E3E', margin: '0 0 0.5rem 0' }}>ตั๋วรับของรางวัล</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>{selectedReward.rewardName}</p>
            
            <div style={{ backgroundColor: '#F8F9FA', padding: '1.5rem', borderRadius: '0.5rem', margin: '1.5rem 0', border: '2px dashed #1E8E3E' }}>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>กรุณาแสดงรหัสรับของชิ้นนี้ให้กับพนักงาน</p>
              <h1 style={{ letterSpacing: '0.2rem', margin: '0.5rem 0', color: '#333', fontSize: '3rem' }}>
                {selectedReward.ticketCode}
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#999', margin: 0 }}>สถานะสิทธิ์: {selectedReward.status}</p>
            </div>
            <button className="btn-close-modal" onClick={() => setSelectedReward(null)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>ปิดหน้าต่าง</button>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 👉 🎯 4. [เพิ่มใหม่] MODAL POPUP: ฟอร์มส่งข้อมูลแจ้งสิ่งของชำรุดเสียหาย */}
      {/* ======================================================= */}
      {isReportModalOpen && reportBooking && (
        <div className="modal-overlay" onClick={() => setIsReportModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', backgroundColor: '#FFF', padding: '2rem', borderRadius: '8px', width: '100%' }}>
            
            <h3 style={{ marginTop: 0, color: '#E31B23', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.3rem' }}>
              <i className="fa-solid fa-screwdriver-wrench"></i> แจ้งรายงานสิ่งชำรุดเสียหาย
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1.2rem', textAlign: 'left' }}>
              สถานที่พบปัญหา: <strong style={{ color: '#0056B3' }}>{reportBooking.facility} - {reportBooking.room}</strong>
            </p>
            
            <form onSubmit={handleSendReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                  ระบุรายละเอียดสิ่งชำรุดเสียหาย:
                </label>
                <textarea 
                  style={{ height: '120px', width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #CCC', resize: 'none', fontSize: '0.9rem', outline: 'none' }}
                  placeholder="ตัวอย่างเช่น: เน็ตตาข่ายแบดมินตันฉีกขาด, เครื่องปรับอากาศน้ำรั่วเปิดไม่เย็น, ลำโพงคาราโอเกะเสียงแตกฝั่งขวา..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" style={{ backgroundColor: '#E31B23', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ส่งรายงานแจ้งซ่อม
                </button>
                <button type="button" style={{ backgroundColor: '#BBB', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsReportModalOpen(false)}>
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

export default MyBooking;