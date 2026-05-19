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
  const [userRole, setUserRole] = useState('student'); 
  const [currentUser, setCurrentUser] = useState(null); 
  
  const navigate = useNavigate(); 
  const location = useLocation(); 

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData); 
    setUserRole(userData.role || 'student');
    if (userData.points !== undefined) {
      setUserPoints(userData.points);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  const isAdminPage = userRole === 'admin';

  return (
    <div className="App">
      {isAdminPage ? <AdminNavbar /> : <Navbar />}
      
      <div className="main-wrapper">
        <Header userPoints={userPoints} />
        <main className="content-area">
          
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/sport" element={
              <SportSelection 
                onBack={() => navigate('/')} 
                onSelectCourt={(courtType) => {
                  // 👉 แก้คำผิดตรงนี้! Inrerzone -> Interzone
                  if (courtType === 'Tennis Court') navigate('/tennis_court');
                  if (courtType === 'Badminton Court Interzone') navigate('/badminton_court_interzone');
                  if (courtType === 'Badminton Court Gym 4') navigate('/badminton_court_gym_4');
                }}
              />
            } />
            <Route path="/tennis_court" element={<TennisCourt onBack={() => navigate('/sport')} user={currentUser} />} />
            
            {/* 👉 แก้ Path ตรงนี้ให้ตรงกับข้างบนด้วย */}
            <Route path="/badminton_court_interzone" element={<BadmintonCourtInterzone onBack={() => navigate('/sport')} user={currentUser} />} />
            <Route path="/badminton_court_gym_4" element={<BadmintonCourtGym4 onBack={() => navigate('/sport')} user={currentUser} />} />
          
            <Route path="/karaoke" element={
              <Karaoke 
                onBack={() => navigate('/')} 
                onSelectRoom={(roomName) => {
                  if (roomName === 'Melody Sphere Zone Karaoke') navigate('/karaoke_booking');
                  else if (roomName === 'Melody Sphere Zone Music Room') navigate('/music_booking');
                }}
              />
            } />
            <Route path="/karaoke_booking" element={<KaraokeBooking onBack={() => navigate('/karaoke')} user={currentUser} />} />
            <Route path="/music_booking" element={<MusicBooking onBack={() => navigate('/karaoke')} user={currentUser} />} />
            
            <Route path="/study" element={
              <Study 
                onBack={() => navigate('/')}
                onSelectRoom={(roomName) => {
                  if (roomName === 'Puey Ungphakorn Library') navigate('/study_booking');
                  else if (roomName === 'Krom Luang Naradhiwas Rajanagarinda Learning Centre') navigate('/krom_luang_booking');
                }}
              />
            } />
            <Route path="/study_booking" element={<StudyBooking onBack={() => navigate('/study')} user={currentUser} />} />
            <Route path="/krom_luang_booking" element={<KromLuangBooking onBack={() => navigate('/study')} user={currentUser} />} />

            <Route path="/news" element={<Attention />} />
            <Route path="/my-booking" element={<MyBooking user={currentUser} />} />
            <Route path="/rewards" element={<Rewards points={userPoints} setPoints={setUserPoints} />} />

            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-facilities" element={<AdminFacilities />} />
            <Route path="/admin-bookings" element={<AdminBookings />} />
            <Route path="/admin-reports" element={<AdminReports />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/admin-announcements" element={<AdminAnnouncements />} />

            <Route path="*" element={<Home />} />
          </Routes>

        </main>
      </div>
    </div>
  );
}

export default App;