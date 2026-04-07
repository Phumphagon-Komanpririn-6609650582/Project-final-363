import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SportSelection from './components/Sport';
import TennisCourt from './components/TennisCourt';
import Attention from './components/Attention';
import Login from './components/Login'; // 1. นำเข้า Component หน้า Login

function App() {
  // 2. สร้าง State สำหรับเช็คว่าเข้าสู่ระบบแล้วหรือยัง (ค่าเริ่มต้นคือ false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [activeMenu, setActiveMenu] = useState('หน้าหลัก');
  const [currentView, setCurrentView] = useState('main');

  const renderContent = () => {
    switch (activeMenu) {
      case 'หน้าหลัก':
        if (currentView === 'main') {
          return <Home onChangePage={(pageName) => setCurrentView(pageName)} />;
        } else if (currentView === 'sport') {
          return <SportSelection 
                  onBack={() => setCurrentView('main')} 
                  onSelectCourt={(courtType) => {
                     if (courtType === 'Tennis Court') setCurrentView('tennis_court');
                   }}
                   />;
        }
        else if (currentView === 'tennis_court') {
          return <TennisCourt onBack={() => setCurrentView('sport')} />;
        }
        else if (currentView === 'karaoke') {
          return <div>หน้าคาราโอเกะ (กำลังสร้าง...) <button onClick={() => setCurrentView('main')}>กลับ</button></div>;
        }
        else if (currentView === 'study') {
          return <div>หน้าห้องติว (กำลังสร้าง...) <button onClick={() => setCurrentView('main')}>กลับ</button></div>;
        }
        return <Home onChangePage={(pageName) => setCurrentView(pageName)} />;

      case 'ประกาศข่าวสาร':
        return <Attention />;

      case 'การจองของฉัน':
        return <div style={{ padding: '20px' }}><h2>การจองของฉัน รอ Db</h2></div>;

      default:
        return <Home onChangePage={(pageName) => setCurrentView(pageName)} />;
    }
  };

  // 3. เงื่อนไข: ถ้ายังไม่ได้ Login ให้แสดงแค่หน้า Login อย่างเดียว (ไม่มี Navbar/Header)
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // 4. ถ้า Login แล้ว ให้แสดงโครงสร้างแอปปกติ
  return (
    <div className="App">
      <Navbar activeMenu={activeMenu} setActiveMenu={(menu) => {
        setActiveMenu(menu);
        setCurrentView('main');
      }} />
      <div className="main-wrapper">
        <Header />
        <main className="content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;