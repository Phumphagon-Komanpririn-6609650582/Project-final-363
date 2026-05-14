import React, { useState } from 'react'; // 👉 1. นำเข้า useState
import { useLocation } from 'react-router-dom';
import UserProfileDropdown from './UserProfileDropdown'; // 👉 2. นำเข้า Component โปรไฟล์

// สร้าง Data Structure แบบ "ตามหาตัวแม่" (ไม่ต้องพิมพ์คำซ้ำๆ)
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
  
  // 👉 3. สร้าง State สำหรับเปิด/ปิด Profile Dropdown
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // ฟังก์ชันต่อข้อความอัตโนมัติ (ย้อนกลับไปหาตัวแม่เรื่อยๆ)
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
          {getBreadcrumbText(location.pathname)}
        </span>
      </div>

      {/* 👉 4. เพิ่ม position: 'relative' เพื่อให้ Dropdown เกาะติดมุมนี้พอดี */}
      <div className="header-right" style={{ position: 'relative' }}>
        <i className="fa-regular fa-bell bell-icon"></i>
        <span className="header-text">{displayID}</span>
        
        {/* 👉 5. เพิ่ม onClick ให้ไอคอน เพื่อสลับสวิตช์เปิด/ปิดกล่องโปรไฟล์ */}
        <div 
          className="user-avatar" 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <i className="fa-solid fa-user"></i>
        </div>

        {/* 👉 6. ถ้า isProfileOpen เป็น true ให้โชว์กล่อง Profile */}
        {isProfileOpen && <UserProfileDropdown />}
      </div>

    </header>
  );
}

export default Header;