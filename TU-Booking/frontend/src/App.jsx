import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // 1. นำเข้าเครื่องมือจาก react-router-dom
import './App.css';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SportSelection from './components/Sport';
import TennisCourt from './components/TennisCourt';
import Attention from './components/Attention';
import Login from './components/Login';

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