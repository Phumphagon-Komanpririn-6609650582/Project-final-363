import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  // รายการเมนูหลัก
  const menus = [
    { name: 'หน้าหลัก', icon: 'fa-solid fa-house', path: '/' },
    { name: 'ประกาศข่าวสาร', icon: 'fa-solid fa-bullhorn', path: '/news' },
    { name: 'แลกของรางวัล', icon: 'fa-solid fa-gift', path: '/rewards' },
    { name: 'การจองของฉัน', icon: 'fa-solid fa-list-ul', path: '/my-booking' },
  ];

  // รายการหน้าลูก ที่ต้องการให้ปุ่ม "หน้าหลัก" ยังคงสว่าง (Active) อยู่
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

  // ฟังก์ชันจำลองการออกจากระบบ
  const handleLogout = () => {
    // ล้างข้อมูลใน localStorage แล้วรีเฟรชหน้าเพื่อกลับไปหน้า Login
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <nav className="navbar-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* --- ส่วนโลโก้ --- */}
      <div className="logo-section">
        <div className="logo-circle"><span className="logo-text">TU</span></div>
        <h2 className="brand-name">TU-BOOKING</h2>
      </div>

      {/* --- ส่วนเมนู --- */}
      <div className="menu-list" style={{ flex: 1 }}>
        {menus.map((menu) => {
          // เช็คว่า URL ปัจจุบัน ตรงกับ path ของเมนูนี้หรือไม่ 
          // หรือถ้าเป็นเมนู 'หน้าหลัก' (/) ให้เช็คด้วยว่าอยู่ในหน้าลูกๆ หรือเปล่า
          const isActive = location.pathname === menu.path || 
                           (menu.path === '/' && homeSubPages.includes(location.pathname));

          return (
            <Link 
              key={menu.name}
              to={menu.path}
              className={`menu-item ${isActive ? 'active' : ''}`}
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              <i className={menu.icon} style={{ width: '25px', textAlign: 'center', marginRight: '10px' }}></i>
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </div>

      {/* --- ส่วนล่างสุด: ปุ่มออกจากระบบ --- */}
      <div className="nav-footer" style={{ padding: '1.5rem' }}>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '0.8rem',
            backgroundColor: 'transparent',
            border: '1px solid #E31B23',
            color: '#E31B23',
            borderRadius: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#E31B23';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#E31B23';
          }}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          ออกจากระบบ
        </button>
      </div>

    </nav>
  );
}

export default Navbar;