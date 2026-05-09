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
import KaraokeBooking from './components/KaraokeBooking'; // 1. เปลี่ยนจาก KaraokeRoom เป็น KaraokeBooking

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="App">
      <Navbar />
      
      <div className="main-wrapper">
        <Header />
        <main className="content-area">
          
          <Routes>
            {/* --- หน้าหลัก --- */}
            <Route path="/" element={<Home />} />
            
            {/* --- หมวดหมู่กีฬา --- */}
            <Route path="/sport" element={
              <SportSelection 
                onBack={() => navigate('/')} 
                onSelectCourt={(courtType) => {
                  if (courtType === 'Tennis Court') navigate('/tennis_court');
                }}
              />
            } />
            <Route path="/tennis_court" element={<TennisCourt onBack={() => navigate('/sport')} />} />
          
            {/* --- หมวดหมู่คาราโอเกะ --- */}
            {/* หน้าเลือกประเภท (Karaoke / Music Room) */}
            <Route path="/karaoke" element={
              <Karaoke 
                onBack={() => navigate('/')} 
                onSelectRoom={(roomName) => {
                  // ถ้าเลือก Melody Sphere Zone Karaoke ให้ไปหน้าจองเวลา
                  if (roomName === 'Melody Sphere Zone Karaoke') {
                    navigate('/karaoke_booking'); 
                  } else if (roomName === 'Melody Sphere Zone Music Room') {
                    // เผื่อทำหน้าแยกสำหรับ Music Room ในอนาคต ตอนนี้ส่งไปที่เดียวกันก่อนได้ครับ
                    navigate('/karaoke_booking');
                  }
                }}
              />
            } />

            {/* หน้าจองเวลาห้องคาราโอเกะ (ที่เราเพิ่งสร้าง) */}
            <Route path="/karaoke_booking" element={
              <KaraokeBooking onBack={() => navigate('/karaoke')} />
            } />
            
            {/* --- หมวดหมู่ห้องเรียน --- */}
            <Route path="/study" element={
              <div style={{ padding: '2rem' }}><h2>หน้าห้องติว (กำลังสร้าง...)</h2> <button onClick={() => navigate('/')}>กลับ</button></div>
            } />

            {/* --- เมนูจากแถบ Navbar --- */}
            <Route path="/news" element={<Attention />} />
            <Route path="/my-booking" element={
              <div style={{ padding: '20px' }}><h2>การจองของฉัน (รอระบบ Database)</h2></div>
            } />

            {/* หน้าเผื่อฉุกเฉิน */}
            <Route path="*" element={<Home />} />
          </Routes>

        </main>
      </div>
    </div>
  );
}

export default App;