import React, { useState, useEffect } from 'react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State คอยดักคำค้นหา

  // ฟังก์ชันยิง Fetch กวาดรายชื่อนักศึกษาทั้งหมดมาจากฐานข้อมูลจริง
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/bookings/admin/users');
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.error('❌ ดึงรายชื่อผู้ใช้จากฐานข้อมูลล้มเหลว:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ฟังก์ชันกดปุ่มปลดแบนฉุกเฉิน ยิงไปล้างแต้ม No-show ใน MongoDB ทันที
  const handleUnban = async (studentId, name) => {
    if (window.confirm(`คุณต้องการ "ปลดแบนและรีเซ็ตแต้มผิดกฎ" ให้กับคุณ ${name} ใช่หรือไม่?`)) {
      try {
        const response = await fetch(`http://localhost:4000/api/bookings/admin/clear-penalty/${studentId}`, {
          method: 'PUT'
        });
        if (response.ok) {
          alert('🔓 ปลดระงับสิทธิ์และรีเซ็ตประวัติความประพฤตินักศึกษาสำเร็จ!');
          fetchUsers(); // สั่งรีเฟรชตารางอัปเดตสีไฟทันที
        } else {
          alert('ไม่สามารถปลดแบนได้');
        }
      } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดเชื่อมต่อหลังบ้าน:', error);
        alert('เชื่อมต่อหลังบ้านล้มเหลว');
      }
    }
  };

  // 🎯 เครื่องยนต์ฟิลเตอร์คัดกรองคำค้นหา (Realtime Search Filter)
  const filteredUsers = users.filter(user => {
    const sId = user.studentId ? user.studentId.toLowerCase() : '';
    const sName = user.name ? user.name.toLowerCase() : '';
    const search = searchTerm.toLowerCase();
    
    return sId.includes(search) || sName.includes(search);
  });

  return (
    <div className="admin-dashboard-container" style={{ padding: '2rem', backgroundColor: '#EEF0F8', minHeight: '100vh' }}>
      
      {/* ส่วนหัวข้อหลัก */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="admin-page-title" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <i className="fa-solid fa-users-gear" style={{ color: '#555' }}></i> จัดการผู้ใช้งานและสิทธิ์การจอง
          </h1>
          <p className="admin-page-subtitle" style={{ color: '#666', marginTop: '0.5rem', margin: 0 }}>
            ตรวจสอบประวัติความประพฤติ และกดล้างมลทินคืนสิทธิ์จองให้นักศึกษาได้ทันทีเมื่อระบบขัดข้อง
          </p>
        </div>
      </div>

      {/* 🔍 กล่องแถค้นหาอัจฉริยะ (Search Bar) */}
      <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: '400px' }}>
        <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
        <input
          type="text"
          placeholder="🔎 พิมพ์ค้นหาด้วย รหัสนักศึกษา หรือ ชื่อ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.65rem 1rem 0.65rem 2.3rem',
            borderRadius: '8px',
            border: '1px solid #CCC',
            fontSize: '0.95rem',
            outline: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            boxSizing: 'border-box'
          }}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')} 
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#999' }}
          >
            ×
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>กำลังกวาดดึงบัญชีรายชื่อนักศึกษาจากระบบหลังบ้าน...</p>
      ) : (
        /* --- ตารางรายชื่อนักศึกษาเวอร์ชันคลีนระบบ --- */
        <div className="booking-table-container" style={{ backgroundColor: '#FFF', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          {/* หัวตาราง */}
          <div className="booking-table-header" style={{ display: 'flex', fontWeight: 'bold', padding: '1rem', backgroundColor: '#F8F9FA', borderBottom: '2px solid #EEE', color: '#444' }}>
            <div style={{ flex: 1.5, textAlign: 'center' }}>รหัสนักศึกษา</div>
            <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>ชื่อ-นามสกุลนักศึกษา</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>จองแล้วไม่มา (ครั้ง)</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>สถานะบัญชี</div>
            <div style={{ flex: 2.0, textAlign: 'center' }}>วันปลดล็อกแบนอัตโนมัติ</div>
            <div style={{ flex: 2.0, textAlign: 'center' }}>จัดการสิทธิ์</div>
          </div>

          {/* เรนเดอร์แถวข้อมูลที่ผ่านตัวกรองค้นหา */}
          {filteredUsers.length > 0 ? (
            filteredUsers.map((student) => (
              <div key={student._id} className="booking-table-row" style={{ display: 'flex', alignItems: 'center', padding: '1.1rem 1rem', borderBottom: '1px solid #EEE' }}>
                
                {/* 1. รหัสนักศึกษา */}
                <div style={{ flex: 1.5, textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold', color: '#0056B3' }}>
                  {student.studentId}
                </div>
                
                {/* 2. ชื่อ-นามสกุล */}
                <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem', fontWeight: '500', color: '#333' }}>
                  {student.name}
                </div>
                
                {/* 3. สถิติทำผิดนัดสะสม */}
                <div style={{ flex: 1.5, textAlign: 'center', fontWeight: 'bold', color: student.status === 'ถูกระงับสิทธิ์' ? '#E31B23' : (student.noShowCount > 0 ? '#F5A623' : '#1E8E3E') }}>
                  {student.noShowCount} / 3 ครั้ง
                </div>
                
                {/* 4. ป้ายสถานะสีสลับตามเบสจริง */}
                <div style={{ flex: 1.5, textAlign: 'center' }}>
                  <span style={{
                    backgroundColor: student.status === 'ปกติ' ? '#8BE3A8' : '#FFB3B3',
                    color: student.status === 'ปกติ' ? '#0E431F' : '#610F0F',
                    padding: '0.35rem 0.7rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem'
                  }}>
                    {student.status}
                  </span>
                </div>
                
                {/* 5. กำหนดเวลาปลดแบนอัตโนมัติ 👉 [แก้ไขจุดบั๊ก] บังคับโชว์แค่วันของคนที่สถานะโดนแบนเท่านั้น */}
                <div style={{ flex: 2.0, textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                  {student.status === 'ถูกระงับสิทธิ์' && student.banUntil ? `📅 ถึงวันที่ ${student.banUntil}` : '—'}
                </div>
                
                {/* 6. เครื่องมือปุ่มปลดแบน 👉 [แก้ไขจุดบั๊ก] บังคับให้ปุ่มขึ้นเฉพาะคนที่โดนระงับสิทธิ์จริงเท่านั้น */}
                <div style={{ flex: 2.0, textAlign: 'center' }}>
                  {student.status === 'ถูกระงับสิทธิ์' ? (
                    <button
                      onClick={() => handleUnban(student.studentId, student.name)}
                      style={{
                        backgroundColor: '#1E8E3E', color: '#FFF', border: 'none',
                        padding: '0.45rem 1rem', borderRadius: '6px', cursor: 'pointer',
                        fontWeight: 'bold', fontSize: '0.85rem', transition: 'all 0.2s',
                        boxShadow: '0 2px 6px rgba(30,142,62,0.2)'
                      }}
                    >
                      🔓 ปลดแบน
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#AAA', fontStyle: 'italic' }}>สิทธิ์ปกติ</span>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
              <i className="fa-solid fa-user-slash" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
              <p>ไม่พบรายชื่อหรือรหัสนักศึกษาตามที่ระบุ</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default AdminUsers;