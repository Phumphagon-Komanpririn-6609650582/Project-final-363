import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './components/Home';

function App() {
  const [activeMenu, setActiveMenu] = useState('หน้าหลัก');

  const renderContent = () => {
    switch (activeMenu) {
      case 'หน้าหลัก':
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
      <Navbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
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
