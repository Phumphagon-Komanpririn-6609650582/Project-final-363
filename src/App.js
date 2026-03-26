import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import Header from './components/header';
import Navbar from './components/navbar';
import Home from './components/Home';
import SportSelection from './components/Sport';

function App() {
  const [activeMenu, setActiveMenu] = useState('หน้าหลัก');
  const [currentView, setCurrentView] = useState('main');

  const renderContent = () => {
    switch (activeMenu) {
      case 'หน้าหลัก':

        if (currentView === 'main') {
          return <Home onChangePage={(pageName) => setCurrentView(pageName)} />;
        } else if (currentView === 'sport') {
          return <SportSelection onBack={() => setCurrentView('main')} />;
        }
        else if (currentView === 'karaoke') {
          // รอสร้างไฟล์ KaraokeSelection แล้วค่อยเอาคอมเมนต์ออก
          // return <KaraokeSelection onBack={() => setCurrentView('main')} />;
          return <div>หน้าคาราโอเกะ (กำลังสร้าง...) <button onClick={() => setCurrentView('main')}>กลับ</button></div>;
        }
        else if (currentView === 'study') {
          // return <StudySelection onBack={() => setCurrentView('main')} />;
          return <div>หน้าห้องติว (กำลังสร้าง...) <button onClick={() => setCurrentView('main')}>กลับ</button></div>;
        }
        return <Home />;

      case 'ประกาศข่าวสาร':
        return <div style={{ padding: '20px' }}><h2>ประกาศข่าวสาร</h2></div>;

      case 'การจองของฉัน':
        return <div style={{ padding: '20px' }}><h2>การจองของฉัน</h2></div>;

      default:
        return <Home />;
    }
  };

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
