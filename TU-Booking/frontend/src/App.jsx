import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import MyBooking from './components/MyBooking'; // 👉 1. Import หน้า MyBooking เข้ามา

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPoints, setUserPoints] = useState(150);
  const navigate = useNavigate(); 

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="App">
      <Navbar />
      
      <div className="main-wrapper">
        <Header userPoints={userPoints} />
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
                  // แยกเงื่อนไขการไปแต่ละตึก
                  if (roomName === 'Puey Ungphakorn Library') {
                    navigate('/study_booking'); 
                  } else if (roomName === 'Krom Luang Naradhiwas Rajanagarinda Learning Centre') {
                    navigate('/krom_luang_booking'); 
                  }
                }}
              />
            } />
            
            {/* หน้าจองห้องตึกป๋วย */}
            <Route path="/study_booking" element={
              <StudyBooking onBack={() => navigate('/study')} />
            } />

            {/* หน้าจองห้องตึกกรมหลวงฯ */}
            <Route path="/krom_luang_booking" element={
              <KromLuangBooking onBack={() => navigate('/study')} />
            } />

            {/* --- เมนูจากแถบ Navbar --- */}
            <Route path="/news" element={<Attention />} />
            
            {/* 👉 2. อัปเดต Route การจองของฉันให้เรียกใช้ MyBooking Component */}
            <Route path="/my-booking" element={<MyBooking />} />

            <Route path="/rewards" element={
              <Rewards points={userPoints} setPoints={setUserPoints} />
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