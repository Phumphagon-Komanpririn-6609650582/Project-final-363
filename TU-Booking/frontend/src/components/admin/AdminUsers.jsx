import React, { useState } from 'react';

function AdminUsers() {
  // 👉 1. State เก็บข้อมูลผู้ใช้งาน และประวัติการทำผิดกฎ
  const [users, setUsers] = useState([
    { id: 1, studentId: '6609650582', name: 'ภูมิภากร โกเมนไปรรินทร์', email: 'phumphagon.kom@dome.tu.ac.th', noShowCount: 0, status: 'ปกติ', banUntil: null },
    { id: 2, studentId: '6609650001', name: 'สมสมร รักเรียน', email: 'somsamorn.ruk@dome.tu.ac.th', noShowCount: 2, status: 'ปกติ', banUntil: null },
    { id: 3, studentId: '6609650002', name: 'ใจดี มานะ', email: 'jaidee.man@dome.tu.ac.th', noShowCount: 3, status: 'ปกติ', banUntil: null }, // ⚠️ เป้าหมายให้จารย์ดูการกดแบน
    { id: 4, studentId: '6609650099', name: 'สายเสมอ เผลอหลับ', email: 'saisamer.ple@dome.tu.ac.th', noShowCount: 3, status: 'ถูกระงับสิทธิ์', banUntil: '24/05/2026' }
  ]);

  // ฟังก์ชัน: แบนผู้ใช้งาน 7 วัน
  const handleBanUser = (userId, name) => {
    if (window.confirm(`⚠️ คุณต้องการระงับสิทธิ์การจองของ "${name}" เป็นเวลา 7 วัน ใช่หรือไม่?`)) {
      
      // คำนวณวันที่ปลดแบน (วันนี้ + 7 วัน)
      const banDate = new Date();
      banDate.setDate(banDate.getDate() + 7);
      const banDateStr = banDate.toLocaleDateString('en-GB');

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: 'ถูกระงับสิทธิ์', banUntil: banDateStr } 
          : user
      ));
      alert(`ระงับสิทธิ์การจองของ ${name} สำเร็จ (ปลดแบนวันที่ ${banDateStr})`);
    }
  };

  // ฟังก์ชัน: ปลดแบนและรีเซ็ตความผิด
  const handleUnbanUser = (userId, name) => {
    if (window.confirm(`✅ คุณต้องการปลดแบนและรีเซ็ตประวัติการผิดกฎของ "${name}" ให้กลับเป็น 0 ใช่หรือไม่?`)) {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: 'ปกติ', banUntil: null, noShowCount: 0 } 
          : user
      ));
      alert(`ปลดแบน ${name} เรียบร้อยแล้ว`);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="admin-page-title">👥 จัดการผู้ใช้งานและสิทธิ์การจอง</h1>
          <p className="admin-page-subtitle" style={{ marginBottom: 0 }}>
            ตรวจสอบประวัติการจองทิ้ง/จองขว้าง และระงับสิทธิ์การใช้งานชั่วคราว
          </p>
        </div>
      </div>

      {/* --- ตารางรายชื่อนักศึกษา --- */}
      <div className="booking-table-container">
        <div className="booking-table-header">
          <div style={{ flex: 1.5, textAlign: 'center' }}>จัดการสิทธิ์</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>สถานะบัญชี</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>จองแล้วไม่มา (ครั้ง)</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>รหัสนักศึกษา</div>
          <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>ชื่อ-นามสกุล</div>
          <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>อีเมล (Email)</div>
        </div>

        {users.map(user => {
          // กำหนดสีของตัวเลขเตือนความผิด
          let countColor = '#1E8E3E'; // เขียว (0-1 ครั้ง)
          if (user.noShowCount === 2) countColor = '#F5A623'; // ส้ม (2 ครั้ง)
          if (user.noShowCount >= 3) countColor = '#E31B23'; // แดง (3 ครั้งขึ้นไป)

          return (
            <div key={user.id} className="booking-table-row" style={{ cursor: 'default' }}>
              
              {/* --- ปุ่มจัดการ (แบน / ปลดแบน) --- */}
              <div style={{ flex: 1.5, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                {user.status === 'ปกติ' ? (
                  <button 
                    className={`admin-action-btn ${user.noShowCount >= 3 ? '' : 'disabled'}`} 
                    style={{ 
                      backgroundColor: user.noShowCount >= 3 ? '#E31B23' : '#DDDDDD',
                      cursor: user.noShowCount >= 3 ? 'pointer' : 'not-allowed',
                      padding: '0.4rem 0.8rem'
                    }}
                    onClick={() => { if(user.noShowCount >= 3) handleBanUser(user.id, user.name); }}
                    title={user.noShowCount >= 3 ? 'ระงับสิทธิ์ 7 วัน' : 'ยังไม่ครบเงื่อนไขการแบน'}
                  >
                    <i className="fa-solid fa-ban"></i> แบน 7 วัน
                  </button>
                ) : (
                  <button 
                    className="admin-action-btn" 
                    style={{ backgroundColor: '#1E8E3E', padding: '0.4rem 0.8rem' }}
                    onClick={() => handleUnbanUser(user.id, user.name)}
                    title="ปลดแบนและรีเซ็ตความผิด"
                  >
                    <i className="fa-solid fa-unlock"></i> ปลดแบน
                  </button>
                )}
              </div>

              {/* --- สถานะบัญชี --- */}
              <div style={{ flex: 1.5, textAlign: 'center' }}>
                <span 
                  className="status-badge" 
                  style={{ 
                    backgroundColor: user.status === 'ปกติ' ? '#E6F4EA' : '#FFF5F5',
                    color: user.status === 'ปกติ' ? '#1E8E3E' : '#E31B23',
                    border: `1px solid ${user.status === 'ปกติ' ? '#1E8E3E' : '#E31B23'}`
                  }}
                >
                  {user.status}
                </span>
                {user.banUntil && (
                  <div style={{ fontSize: '0.75rem', color: '#E31B23', marginTop: '0.3rem' }}>
                    (ถึงวันที่ {user.banUntil})
                  </div>
                )}
              </div>

              {/* --- จำนวนครั้งที่ผิดกฎ --- */}
              <div style={{ flex: 1.5, textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: countColor }}>
                {user.noShowCount} / 3
              </div>

              {/* --- ข้อมูลนักศึกษา --- */}
              <div style={{ flex: 1.5, textAlign: 'center', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                {user.studentId}
              </div>
              <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem', fontWeight: 'bold', color: '#333' }}>
                {user.name}
              </div>
              <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem', color: '#666', fontSize: '0.9rem' }}>
                {user.email}
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}

export default AdminUsers;