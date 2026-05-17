import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'; 
import './App.css';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SportSelection from './components/Sport';
import TennisCourt from './components/TennisCourt';
import BadmintonCourtInterzone from './components/BadmintonCourtInterzone';
import BadmintonCourtGym4 from './components/BadmintonCourtGym4';
import Attention from './components/Attention';
import Login from './components/Login';
import Karaoke from './components/Karaoke';
import KaraokeBooking from './components/KaraokeBooking'; 
import MusicBooking from './components/MusicBooking';
import Study from './components/Study'; 
import StudyBooking from './components/StudyBooking';
import KromLuangBooking from './components/KromLuangBooking';
import Rewards from './components/Rewards';
import MyBooking from './components/MyBooking'; 

// --- นำเข้า Component ฝั่ง Admin ---
import AdminDashboard from './components/admin/AdminDashboard';
import AdminFacilities from './components/admin/AdminFacilities';
import AdminNavbar from './components/admin/AdminNavbar'; 
import AdminBookings from './components/admin/AdminBookings';
import AdminAnnouncements from './components/admin/AdminAnnouncements';
import AdminUsers from './components/admin/AdminUsers';
import AdminReports from './components/admin/AdminReports';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPoints, setUserPoints] = useState(150);
  
  // 👉 1. เพิ่ม State เก็บ Role ของผู้ใช้งาน (ดึงมาจาก Database)
  const [userRole, setUserRole] = useState('student'); 
  
  const navigate = useNavigate(); 
  const location = useLocation(); 

  // 👉 2. ฟังก์ชันจัดการเมื่อ Login สำเร็จ โดยรับข้อมูล userData มาจาก Login.jsx
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    if (userData) {
      setUserRole(userData.role || 'student'); // เก็บสิทธิ์ Admin หรือ Student
      if (userData.points !== undefined) {
        setUserPoints(userData.points); // เก็บแต้มสะสม
      }
    }
  };

  if (!isLoggedIn) {
    // 👉 3. ส่งฟังก์ชัน handleLoginSuccess ไปให้หน้า Login ทำงาน
    return <Login onLogin={handleLoginSuccess} />;
  }

  // 👉 4. เช็คหน้า Admin จากสิทธิ์ (Role) จริงๆ ใน Database
  const isAdminPage = userRole === 'admin';

  return (
    <div className="App">
      
      {/* 👉 5. สลับ Navbar อัตโนมัติตามสิทธิ์ของผู้ใช้ */}
      {isAdminPage ? <AdminNavbar /> : <Navbar />}
      
      <div className="main-wrapper">
        <Header userPoints={userPoints} />
        <main className="content-area">
          
          <Routes>
            {/* ========================================== */}
            {/* 🎓 ROUTES ฝั่งนักศึกษา (STUDENT) */}
            {/* ========================================== */}
            <Route path="/" element={<Home />} />
            
            {/* --- หมวดหมู่กีฬา --- */}
            <Route path="/sport" element={
              <SportSelection 
                onBack={() => navigate('/')} 
                onSelectCourt={(courtType) => {
                  if (courtType === 'Tennis Court') navigate('/tennis_court');
                  if (courtType === 'Badminton Court Inrerzone') navigate('/badminton_court_inrerzone');
                  if (courtType === 'Badminton Court Gym 4') navigate('/badminton_court_gym_4');
                }}
              />
            } />
            <Route path="/tennis_court" element={<TennisCourt onBack={() => navigate('/sport')} />} />
            <Route path="/badminton_court_inrerzone" element={<BadmintonCourtInterzone onBack={() => navigate('/sport')} />} />
            <Route path="/badminton_court_gym_4" element={<BadmintonCourtGym4 onBack={() => navigate('/sport')} />} />
          
            {/* --- หมวดหมู่คาราโอเกะ & ดนตรี --- */}
            <Route path="/karaoke" element={
              <Karaoke 
                onBack={() => navigate('/')} 
                onSelectRoom={(roomName) => {
                  if (roomName === 'Melody Sphere Zone Karaoke') {
                    navigate('/karaoke_booking'); 
                  } else if (roomName === 'Melody Sphere Zone Music Room') {
                    navigate('/music_booking'); 
                  }
                }}
              />
            } />
            <Route path="/karaoke_booking" element={<KaraokeBooking onBack={() => navigate('/karaoke')} />} />
            <Route path="/music_booking" element={<MusicBooking onBack={() => navigate('/karaoke')} />} />
            
            {/* --- หมวดหมู่ห้องเรียน --- */}
            <Route path="/study" element={
              <Study 
                onBack={() => navigate('/')}
                onSelectRoom={(roomName) => {
                  if (roomName === 'Puey Ungphakorn Library') {
                    navigate('/study_booking'); 
                  } else if (roomName === 'Krom Luang Naradhiwas Rajanagarinda Learning Centre') {
                    navigate('/krom_luang_booking'); 
                  }
                }}
              />
            } />
            <Route path="/study_booking" element={<StudyBooking onBack={() => navigate('/study')} />} />
            <Route path="/krom_luang_booking" element={<KromLuangBooking onBack={() => navigate('/study')} />} />

            {/* --- เมนูจากแถบ Navbar --- */}
            <Route path="/news" element={<Attention />} />
            <Route path="/my-booking" element={<MyBooking />} />
            <Route path="/rewards" element={<Rewards points={userPoints} setPoints={setUserPoints} />} />


            {/* ========================================== */}
            {/* 💻 ROUTES ฝั่งผู้ดูแลระบบ (ADMIN) */}
            {/* ========================================== */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-facilities" element={<AdminFacilities />} />
            
            {/* หน้า Admin ที่เตรียมไว้เพื่อไม่ให้ขึ้น Error เวลาคลิก */}
            <Route path="/admin-bookings" element={<AdminBookings />} />
            <Route path="/admin-reports" element={<AdminReports />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/admin-announcements" element={<AdminAnnouncements />} />

            {/* หน้าเผื่อฉุกเฉิน / NotFound */}
            <Route path="*" element={<Home />} />
          </Routes>

        </main>
      </div>
    </div>
  );
}

export default App;