import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // 1. นำเข้า Link และ useLocation

function Navbar() {
  // 2. เรียกใช้ useLocation เพื่อดูว่าตอนนี้เราอยู่ URL ไหน
  const location = useLocation();

  // 3. เพิ่ม properties 'path' เข้าไปให้แต่ละเมนู เพื่อให้รู้ว่าต้องลิงก์ไปที่ไหน
  const menus = [
    { name: 'หน้าหลัก', icon: 'fa-solid fa-house', path: '/' },
    { name: 'ประกาศข่าวสาร', icon: 'fa-solid fa-bullhorn', path: '/news' },
    { name: 'การจองของฉัน', icon: 'fa-solid fa-list-ul', path: '/my-booking' },
  ];

  const homeSubPages = [
  '/sport', 
  '/tennis_court', 
  '/karaoke', 
  '/karaoke_booking', 
  '/music_booking', 
  '/study', 
  '/study_booking', 
  '/krom_luang_booking'
];

  return (
    <nav className="navbar-container">

      <div className="logo-section">
        <div className="logo-circle"><span className="logo-text">TU</span></div>
        <h2 className="brand-name">TU-BOOKING</h2>
      </div>

      <div className="menu-list">
        {menus.map((menu) => {
          // 4. เช็คว่า URL ปัจจุบัน ตรงกับ path ของเมนูนี้หรือไม่ (ถ้าตรงให้เป็น true)
          // ปรับเงื่อนไขนิดหน่อยเพื่อให้หน้าย่อยๆ ของกีฬา ยังคง highlight ที่หน้าหลัก
          const isActive = location.pathname === menu.path || 
                 (menu.path === '/' && homeSubPages.includes(location.pathname));

          return (
            // 5. เปลี่ยน <div> เป็น <Link> และใช้ 'to' แทน 'onClick'
            <Link 
              key={menu.name}
              to={menu.path}
              className={`menu-item ${isActive ? 'active' : ''}`}
              style={{ textDecoration: 'none' }} // ป้องกันไม่ให้มีเส้นใต้ (เพราะ Link ทำงานเหมือนแท็ก <a>)
            >
              <i className={menu.icon}></i>
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;