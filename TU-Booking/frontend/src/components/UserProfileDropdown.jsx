import React from 'react';

function UserProfileDropdown({ userPoints }) {
  // ดึงชื่อมาจาก localStorage (ถ้าไม่มีให้ใช้ชื่อจำลองไปก่อน)
  const studentName = localStorage.getItem('studentName') || 'ภูมิภากร โกเมนไปรรินทร์';

  return (
    <div className="profile-dropdown-container">
      
      {/* ส่วนรูปโปรไฟล์วงกลมใหญ่ */}
      <div className="profile-large-avatar">
        <i className="fa-regular fa-user"></i>
      </div>

      {/* ข้อมูลส่วนตัว */}
      <div className="profile-info-row">
        <span style={{ fontWeight: 'bold' }}>Student Name:</span>
        <span style={{ color: '#4A90E2' }}>{studentName}</span>
      </div>
      
      <div className="profile-info-row">
        <span style={{ fontWeight: 'bold' }}>Status:</span>
        <span className="status-badge">Active</span>
      </div>

      <div className="profile-info-row">
        <span style={{ fontWeight: 'bold' }}>Expire Date:</span>
        <span>22/08/2027</span>
      </div>

      {/* แต้มสะสม */}
      <div className="profile-info-row" style={{ marginTop: '0.5rem' }}>
        <span style={{ fontWeight: 'bold' }}>แต้มสะสม:</span>
        <span style={{ 
          color: '#E31B23', 
          fontWeight: 'bold', 
          backgroundColor: '#FFF5F5', 
          padding: '0.1rem 0.6rem', 
          borderRadius: '1rem' 
        }}>
          {/* สีไอคอนสีน้ำเงินตามที่คุณปรับมา */}
          <i className="fa-solid fa-coins" style={{ marginRight: '0.4rem', color: '#3333FF' }}></i> 
          {userPoints !== undefined ? userPoints : 0} แต้ม
        </span>
      </div>

      {/* เส้นคั่น */}
      <div className="profile-divider"></div>

      {/* ส่วนแจ้งเตือนผิดกฎ */}
      <div className="warning-section">
        <div className="warning-title">
          <i className="fa-solid fa-triangle-exclamation" style={{ color: '#666', marginRight: '0.4rem' }}></i>
          การแจ้งเตือนผิดกฎ (Warnings) 0/3 ครั้ง
        </div>
        
        {/* จุดสถานะ 3 จุด (สีเขียว = ยังไม่ผิดกฎ) */}
        <div className="warning-dots">
          <div className="dot green"></div>
          <div className="dot green"></div>
          <div className="dot green"></div>
        </div>

        <div className="warning-desc">
          ( หากครบ 3 ครั้ง จะถูกระงับสิทธิ์การจอง )
        </div>
      </div>

    </div>
  );
}

export default UserProfileDropdown;