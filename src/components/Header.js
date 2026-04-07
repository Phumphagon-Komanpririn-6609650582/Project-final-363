import React from 'react';

function Header() {
  // 1. ดึงข้อมูลจาก localStorage ที่เราเซฟไว้ตอน Login สำเร็จ
  const studentName = localStorage.getItem('studentName');
  const studentId = localStorage.getItem('studentId');

  // 2. เช็คเงื่อนไข: ถ้ามีชื่อให้โชว์ชื่อ -> ถ้าไม่มีให้โชว์รหัส -> ถ้าไม่มีอะไรเลยให้โชว์ 'ผู้ใช้งาน'
  const displayID = studentId || 'ผู้ใช้งาน';

  return (
    <header className="header-container">
      
      <div className="header-left">
        <span className="header-text">หมวดหมู่</span>
      </div>

      <div className="header-right">
        
        <i className="fa-regular fa-bell bell-icon"></i>
        
        {/* 3. นำตัวแปร displayName มาโชว์ตรงนี้แทนตัวเลขแข็งๆ */}
        <span className="header-text">{displayID}</span>
        
        <div className="user-avatar">
          <i className="fa-solid fa-user"></i>
        </div>
        
      </div>
    </header>
  );
}

export default Header;