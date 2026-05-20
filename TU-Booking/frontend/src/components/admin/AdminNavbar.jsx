import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminNavbar() {
  const location = useLocation();

  const adminMenus = [
    { name: 'Dashboard สถิติ', icon: 'fa-solid fa-chart-line', path: '/admin-dashboard' },
    { name: 'จัดการสถานที่/ห้อง', icon: 'fa-solid fa-sliders', path: '/admin-facilities' },
    { name: 'อนุมัติการจอง', icon: 'fa-solid fa-calendar-check', path: '/admin-bookings' },
    { name: 'แจ้งซ่อม/รายงานปัญหา', icon: 'fa-solid fa-triangle-exclamation', path: '/admin-reports' },
    { name: 'จัดการผู้ใช้งาน/แบน', icon: 'fa-solid fa-user-gear', path: '/admin-users' },
    { name: 'ประกาศข่าวสาร', icon: 'fa-solid fa-bullhorn', path: '/admin-announcements' },
  ];

  // ฟังก์ชันจำลองการออกจากระบบของแอดมิน
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <nav className="navbar-container admin-navbar-theme" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      <div className="logo-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
        <div className="logo-circle" style={{ backgroundColor: '#2C3E50' }}>
          <span className="logo-text" style={{ color: '#E74C3C' }}>AD</span>
        </div>
        <div>
          <h2 className="brand-name" style={{ fontSize: '1.1rem', margin: 0 }}>TU-ฺBooking</h2>
          <span style={{ fontSize: '0.75rem', color: '#E74C3C', fontWeight: 'bold', letterSpacing: '1px' }}>ADMIN PANEL</span>
        </div>
      </div>

      <div className="menu-list" style={{ flex: 1, marginTop: '1.5rem' }}>
        {adminMenus.map((menu) => {
          const isActive = location.pathname === menu.path;

          return (
            <Link 
              key={menu.name}
              to={menu.path}
              className={`menu-item ${isActive ? 'admin-active' : ''}`}
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              <i className={menu.icon} style={{ width: '25px', textAlign: 'center', marginRight: '10px' }}></i>
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="nav-footer" style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%', padding: '0.6rem', backgroundColor: '#34495E', border: 'none',
            color: '#ECF0F1', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer',
            fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
          }}>
            <i className="fa-solid fa-shuffle"></i> สลับไปหน้า Student
          </button>
        </Link>

        <button 
          onClick={handleLogout}
          style={{
            width: '100%', padding: '0.6rem', backgroundColor: 'transparent',
            border: '1px solid #E74C3C', color: '#E74C3C', borderRadius: '0.5rem',
            fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#E74C3C'; e.currentTarget.style.color = 'white'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E74C3C'; }}
        >
          <i className="fa-solid fa-right-from-bracket"></i> ออกจากระบบ
        </button>
      </div>

    </nav>
  );
}

export default AdminNavbar;