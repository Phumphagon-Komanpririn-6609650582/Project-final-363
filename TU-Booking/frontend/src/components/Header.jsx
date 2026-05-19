import React, { useState, useEffect, useCallback } from 'react'; 
import { useLocation } from 'react-router-dom';
import UserProfileDropdown from './UserProfileDropdown'; 

const routeConfig = {
  // ==========================================
  // โซนนักศึกษา (Student Panel)
  // ==========================================
  '/': { name: 'หมวดหมู่', parent: null },
  '/sport': { name: 'Sport', parent: '/' },
  '/tennis_court': { name: 'Tennis Court', parent: '/sport' },
  '/badminton_court_gym_4': { name: 'Badminton Court Gym 4', parent: '/sport' },
  '/badminton_court_interzone': { name: 'Badminton Court Interzone', parent: '/sport' },
  '/karaoke': { name: 'Karaoke & Music', parent: '/' },
  '/karaoke_booking': { name: 'Melody Sphere Zone Karaoke', parent: '/karaoke' },
  '/music_booking': { name: 'Melody Sphere Zone Music Room', parent: '/karaoke' },
  '/study': { name: 'Study', parent: '/' },
  '/study_booking': { name: 'Puey Ungphakorn Library', parent: '/study' },
  '/krom_luang_booking': { name: 'Krom Luangฯ Learning Centre', parent: '/study' },
  '/news': { name: 'ข่าวสารและประกาศ', parent: null },
  '/my-booking': { name: 'การจองของฉัน', parent: null },
  '/rewards': { name: 'แลกของรางวัล', parent: null },
  
  // ==========================================
  // โซนผู้ดูแลระบบ (Admin Panel) - เรียงตามเมนู Sidebar จริง
  // ==========================================
  '/admin/dashboard': { name: 'Dashboard สถิติ', parent: null },
  '/admin/facilities': { name: 'จัดการสถานที่และห้องใช้งาน', parent: null },
  '/admin/bookings': { name: 'อนุมัติการจอง', parent: null },
  '/admin/reports': { name: 'แจ้งซ่อม/รายงานปัญหา', parent: null },
  '/admin/users': { name: 'จัดการผู้ใช้', parent: null },
  '/admin/announcements': { name: 'ประกาศข่าวสาร', parent: null },
  
  // แถมกรณีไม่มีพอร์ต /admin/ นำหน้าเผื่อมึงสลับใช้เร้าเตอร์สั้น
  '/admin-dashboard': { name: 'Dashboard สถิติ', parent: null },
  '/admin-reports': { name: 'แจ้งซ่อม/รายงานปัญหา', parent: null },
  '/admin-facilities': { name: 'จัดการสถานที่และห้องใช้งาน', parent: null },
  '/admin-bookings': { name: 'อนุมัติการจอง', parent: null },
  '/admin-users': { name: 'จัดการผู้ใช้', parent: null },
  '/admin-announcements': { name: 'ประกาศข่าวสาร', parent: null },
};

function Header({ userPoints: initialPoints }) {
  const location = useLocation();
  const studentId = localStorage.getItem('studentId');
  const userRole = localStorage.getItem('role'); // ตรวจสอบบทบาทผู้ใช้งาน 'admin' หรือ 'student'

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dbUser, setDbUser] = useState(null);

  // การแสดงผลข้อความฝั่งขวาตามสั่ง: "Admin : ชื่อแอดมิน"
  let displayID = '';
  if (userRole === 'admin') {
    const adminName = dbUser?.name || localStorage.getItem('name') || 'ผู้ดูแลระบบ';
    displayID = `Admin : ${adminName}`;
  } else {
    displayID = studentId || 'ผู้ใช้งาน';
  }

  // ฟังก์ชันสอยข้อมูลโปรไฟล์ล่าสุดจาก MongoDB
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!studentId || userRole === 'admin') return; 
      const response = await fetch(`http://localhost:4000/api/user/profile?studentId=${studentId}`);
      const data = await response.json();
      if (response.ok) {
        setDbUser(data); 
      }
    } catch (error) {
      console.error('❌ ดึงประวัติโปรไฟล์อัปเดตเหลวที่ Header:', error);
    }
  }, [studentId, userRole]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleToggleProfile = () => {
    if (!isProfileOpen) {
      fetchUserProfile(); 
    }
    setIsProfileOpen(!isProfileOpen);
  };

  // ฟังก์ชันคำนวณข้อความส่วนหัว Breadcrumb ด้านซ้าย
  const getBreadcrumbText = (pathname) => {
    if (pathname.includes('/admin/bookings') || pathname.includes('/bookings')) {
      return "อนุมัติการจอง";
    }

    if (userRole === 'admin') {
      let adminPath = routeConfig[pathname];
      return adminPath ? adminPath.name : 'จัดการระบบ TU-Booking';
    }

    let currentPath = routeConfig[pathname];
    if (!currentPath) return 'หมวดหมู่';
    let breadcrumbArray = [];
    while (currentPath) {
      breadcrumbArray.unshift(currentPath.name);
      currentPath = currentPath.parent ? routeConfig[currentPath.parent] : null;
    }
    return breadcrumbArray.join(' >> ');
  };

  return (
    <header className="header-container">
      
      {/* 🧭 ข้อความบอกหมวดหมู่ด้านซ้าย */}
      <div className="header-left">
        <span className="header-text" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
          {getBreadcrumbText(location.pathname)}
        </span>
      </div>

      <div className="header-right" style={{ position: 'relative' }}>
        
        {/* 🔔 บล็อกกระดิ่งแจ้งเตือน: แสดงผลทุกสถานะ (ทั้งสิทธิ์ Student และ Admin เห็นหมดชิวๆ) */}
        <i className="fa-regular fa-bell bell-icon" style={{ marginRight: '12px', cursor: 'pointer' }}></i>
        
        {/* แสดงป้ายชื่อ Admin : ชื่อจริง หรือ รหัส นศ. */}
        <span className="header-text" style={{ 
          fontWeight: 'bold', 
          color: userRole === 'admin' ? '#E31B23' : '#555',
          fontSize: '0.95rem',
          marginRight: userRole === 'admin' ? '0' : '12px'
        }}>
          {displayID}
        </span>
        
        {/* 👉 🎯 [ซ่อนเฉพาะไอคอนรูปคน] ซ่อนวงกลม Avatar ทันทีถ้าเป็น Admin */}
        {userRole !== 'admin' && (
          <div 
            className="user-avatar" 
            onClick={handleToggleProfile}
            style={{ cursor: 'pointer' }}
          >
            <i className="fa-solid fa-user"></i>
          </div>
        )}

        {/* ดรอปดาวน์แสดงผลเฉพาะฝั่งนักศึกษา */}
        {isProfileOpen && userRole !== 'admin' && (
          <UserProfileDropdown 
            userPoints={dbUser?.points !== undefined ? dbUser.points : initialPoints} 
            user={dbUser} 
          />
        )}
      </div>

    </header>
  );
}

export default Header;