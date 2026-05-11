import React from 'react';
import { useLocation } from 'react-router-dom';

// 1. สร้าง Data Structure แบบ "ตามหาตัวแม่" (ไม่ต้องพิมพ์คำซ้ำๆ)
const routeConfig = {
  '/': { name: 'หมวดหมู่', parent: null },
  
  '/sport': { name: 'Sport', parent: '/' },
  '/tennis_court': { name: 'Tennis Court', parent: '/sport' },
  
  '/karaoke': { name: 'Karaoke & Music', parent: '/' },
  '/karaoke_booking': { name: 'Melody Sphere Zone Karaoke', parent: '/karaoke' },
  '/music_booking': { name: 'Melody Sphere Zone Music Room', parent: '/karaoke' },
  
  '/study': { name: 'Study', parent: '/' },
  '/study_booking': { name: 'Puey Ungphakorn Library', parent: '/study' },
  '/krom_luang_booking': { name: 'Krom Luangฯ Learning Centre', parent: '/study' },
  
  '/news': { name: 'ข่าวสารและประกาศ', parent: null },
  '/my-booking': { name: 'การจองของฉัน', parent: null },
};

function Header() {
  const location = useLocation();

  // 2. ฟังก์ชันต่อข้อความอัตโนมัติ (ย้อนกลับไปหาตัวแม่เรื่อยๆ)
  const getBreadcrumbText = (pathname) => {
    let currentPath = routeConfig[pathname];

    // ถ้าเปิดไปหน้าแปลกๆ ที่ไม่มีในข้อมูล ให้โชว์คำว่า หมวดหมู่
    if (!currentPath) return 'หมวดหมู่';

    let breadcrumbArray = [];

    // วนลูปตามหาหน้า parent ไปเรื่อยๆ จนกว่าจะหมด
    while (currentPath) {
      breadcrumbArray.unshift(currentPath.name); // ดันชื่อเข้าไปข้างหน้าสุด
      currentPath = currentPath.parent ? routeConfig[currentPath.parent] : null;
    }

    // เอาชื่อทั้งหมดมาต่อกันด้วย ' >> '
    return breadcrumbArray.join(' >> ');
  };

  const studentId = localStorage.getItem('studentId');
  const displayID = studentId || 'ผู้ใช้งาน';

  return (
    <header className="header-container">
      
      <div className="header-left">
        <span className="header-text" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          {/* 3. เรียกใช้ฟังก์ชันตรงนี้ */}
          {getBreadcrumbText(location.pathname)}
        </span>
      </div>

      <div className="header-right">
        <i className="fa-regular fa-bell bell-icon"></i>
        <span className="header-text">{displayID}</span>
        <div className="user-avatar">
          <i className="fa-solid fa-user"></i>
        </div>
      </div>

    </header>
  );
}

export default Header;