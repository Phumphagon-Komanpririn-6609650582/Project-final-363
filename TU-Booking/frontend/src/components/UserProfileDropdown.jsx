import React from 'react';

function UserProfileDropdown({ userPoints, user }) {
  // 👉 🎯 อ่านค่า noShowCount และสถานะจากฐานข้อมูลที่ยิง Fetch สดๆ ล่าสุดลงมา
  const noShowCount = user?.noShowCount !== undefined ? user.noShowCount : 0;
  const currentStatus = user?.status || 'ปกติ';
  const isBanned = currentStatus === 'ถูกระงับสิทธิ์';

  const studentName = user?.name || localStorage.getItem('studentName') || 'ทัศน์พล พารา';
  const expireDate = user?.expireDate || '22/08/2027';

  // 👉 ฟังก์ชันเรนเดอร์จุดความประพฤติ 3 จุดสลับ แดง-เขียว อิงตามประวัติ No-show ในเบสจริง
  const renderWarningDots = () => {
    const dots = [];
    for (let i = 1; i <= 3; i++) {
      const isRed = i <= noShowCount;
      
      dots.push(
        <div 
          key={i} 
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: isRed ? '#E31B23' : '#8BE3A8', // สีแดงเข้มชัดเจน / เขียวสด
            border: isRed ? '2px solid #610F0F' : '2px solid #1E8E3E',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.3s'
          }}
        ></div>
      );
    }
    return dots;
  };

  return (
    <div className="profile-dropdown-container" style={{ padding: '1rem', width: '280px', backgroundColor: '#FFF', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
      
      {/* ส่วนรูปโปรไฟล์ */}
      <div className="profile-large-avatar" style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '3rem' }}>
        <i className="fa-regular fa-user" style={{ border: '2px solid #CCC', padding: '10px', borderRadius: '50%', color: '#555' }}></i>
      </div>

      {/* ข้อมูลส่วนตัว */}
      <div className="profile-info-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
        <span style={{ fontWeight: 'bold', color: '#555' }}>Student Name:</span>
        <span style={{ color: '#4A90E2', fontWeight: '500' }}>{studentName}</span>
      </div>
      
      <div className="profile-info-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
        <span style={{ fontWeight: 'bold', color: '#555' }}>Status:</span>
        <span 
          className="status-badge" 
          style={{ 
            backgroundColor: isBanned ? '#FFB3B3' : '#8BE3A8', 
            color: isBanned ? '#E31B23' : '#1E8E3E',
            fontWeight: 'bold', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem'
          }}
        >
          {currentStatus}
        </span>
      </div>

      <div className="profile-info-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
        <span style={{ fontWeight: 'bold', color: '#555' }}>Expire Date:</span>
        <span style={{ color: '#333' }}>{expireDate}</span>
      </div>

      {/* แต้มสะสม */}
      <div className="profile-info-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.95rem' }}>
        <span style={{ fontWeight: 'bold', color: '#555' }}>แต้มสะสม:</span>
        <span style={{ color: '#E31B23', fontWeight: 'bold', backgroundColor: '#FFF5F5', padding: '0.1rem 0.6rem', borderRadius: '1rem' }}>
          <i className="fa-solid fa-coins" style={{ marginRight: '0.4rem', color: '#3333FF' }}></i> 
          {userPoints !== undefined ? userPoints : (user?.points || 0)} แต้ม
        </span>
      </div>

      <div className="profile-divider" style={{ borderBottom: '1px solid #EEE', margin: '1rem 0' }}></div>

      {/* ส่วนแจ้งเตือนผิดกฎความประพฤติ */}
      <div className="warning-section" style={{ textAlign: 'center' }}>
        <div className="warning-title" style={{ fontSize: '0.9rem', color: '#444', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ color: '#F5A623', marginRight: '0.4rem' }}></i>
          การแจ้งเตือนผิดกฎ (Warnings) {noShowCount}/3 ครั้ง
        </div>
        
        {/* แผงดวงไฟ 3 จุด Dynamic วิ่งตรงตาม Database จริง! */}
        <div className="warning-dots" style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '0.6rem 0' }}>
          {renderWarningDots()}
        </div>

        <div className="warning-desc" style={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic', marginTop: '0.5rem' }}>
          {isBanned 
            ? `❌ ระงับสิทธิ์การจองถึงวันที่: ${user?.banUntil}` 
            : '( หากครบ 3 ครั้ง จะถูกระงับสิทธิ์การจอง 7 วัน )'}
        </div>
      </div>

    </div>
  );
}

export default UserProfileDropdown;