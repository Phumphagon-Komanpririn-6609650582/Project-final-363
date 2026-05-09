import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SportSelection from './components/Sport';
import TennisCourt from './components/TennisCourt';
import Attention from './components/Attention';
import Login from './components/Login';
import Karaoke from './components/Karaoke';
import KaraokeBooking from './components/KaraokeBooking'; 
import MusicBooking from './components/MusicBooking'; // 1. Import หน้า Music ที่เพิ่งสร้างใหม่

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 


function App() {
  // State สำหรับเช็คว่าเข้าสู่ระบบแล้วหรือยัง
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 2. เรียกใช้ useNavigate สำหรับเปลี่ยน URL แทนการใช้ State
  const navigate = useNavigate(); 

  // ถ้ายังไม่ได้ Login ให้แสดงแค่หน้า Login
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }
  // ถ้า Login แล้ว ให้แสดงโครงสร้างแอปปกติ
  return (
    <div className="App">
      {/* 3. ลบ Props activeMenu ออก เพราะเดี๋ยวเราจะให้ Navbar จัดการเรื่อง Active ผ่าน URL แทน */}
      <Navbar />
 
      <div className="main-wrapper">
        <Header />
        <main className="content-area">
          
          <Routes>
            {/* --- หน้าหลัก --- */}
            <Route path="/" element={<Home />} />
            
            {/* --- หมวดหมู่กีฬา --- */}
          {/* 4. ใช้ Routes และ Route จัดการหน้าต่างๆ แทน switch...case เดิม */}
          <Routes>
            
            {/* --- หน้าหลักและหมวดหมู่ย่อย --- */}
            <Route path="/" element={<Home onChangePage={(pageName) => navigate(`/${pageName}`)} />} />
            
            <Route path="/sport" element={
              <SportSelection 
                onBack={() => navigate('/')} 
                onSelectCourt={(courtType) => {
                  if (courtType === 'Tennis Court') navigate('/tennis_court');
                }}
              />
            } />
            <Route path="/tennis_court" element={<TennisCourt onBack={() => navigate('/sport')} />} />
          
            {/* --- หมวดหมู่คาราโอเกะ & ดนตรี --- */}
            {/* หน้าเลือกประเภท (Karaoke / Music Room) */}
            <Route path="/karaoke" element={
              <Karaoke 
                onBack={() => navigate('/')} 
                onSelectRoom={(roomName) => {
                  // แยกเงื่อนไขการไปแต่ละหน้าให้ชัดเจน
                  if (roomName === 'Melody Sphere Zone Karaoke') {
                    navigate('/karaoke_booking'); 
                  } else if (roomName === 'Melody Sphere Zone Music Room') {
                    navigate('/music_booking'); // 2. ให้ไปที่หน้า MusicBooking แทน
                  }
                }}
              />
            } />

            {/* หน้าจองเวลาห้องคาราโอเกะ */}
            <Route path="/karaoke_booking" element={
              <KaraokeBooking onBack={() => navigate('/karaoke')} />
            } />

            {/* 3. หน้าจองเวลาห้องซ้อมดนตรี (Music Room) */}
            <Route path="/music_booking" element={
              <MusicBooking onBack={() => navigate('/karaoke')} />
            } />
            
            {/* --- หมวดหมู่ห้องเรียน --- */}
            <Route path="/study" element={
              <div style={{ padding: '2rem' }}><h2>หน้าห้องติว (กำลังสร้าง...)</h2> <button onClick={() => navigate('/')}>กลับ</button></div>
            
            <Route path="/tennis_court" element={
              <TennisCourt onBack={() => navigate('/sport')} />
            } />
            
            <Route path="/karaoke" element={
              <div>หน้าคาราโอเกะ (กำลังสร้าง...) <button onClick={() => navigate('/')}>กลับ</button></div>
            } />
            
            <Route path="/study" element={
              <div>หน้าห้องติว (กำลังสร้าง...) <button onClick={() => navigate('/')}>กลับ</button></div>
            } />

            {/* --- เมนูจากแถบ Navbar --- */}
            <Route path="/news" element={<Attention />} />
            <Route path="/my-booking" element={
              <div style={{ padding: '20px' }}><h2>การจองของฉัน (รอระบบ Database)</h2></div>
            } />

            {/* หน้าเผื่อฉุกเฉิน */}
            <Route path="*" element={<Home />} />
              <div style={{ padding: '20px' }}><h2>การจองของฉัน รอ Db</h2></div>
            } />

            {/* หน้าเผื่อฉุกเฉิน (ถ้าพิมพ์ URL ผิด ให้เด้งกลับมาหน้า Home) */}
            <Route path="*" element={<Home onChangePage={(pageName) => navigate(`/${pageName}`)} />} />

          </Routes>

        </main>
      </div>
    </div>
  );
}

export default App;