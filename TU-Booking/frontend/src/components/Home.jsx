import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <p className="select-title">เลือกหมวดหมู่ที่ต้องการจอง</p>
      
      <div className="card-grid">
        <div className="category-card sport-card" onClick={() => navigate('/sport')}>
          <div className="card-content">
            <i className="fa-solid fa-basketball"></i>
            <span>Sport</span>
          </div>
        </div>

        <div className="category-card karaoke-card" onClick={() => navigate('/karaoke')}>
          <div className="card-content">
            <i className="fa-solid fa-microphone-lines"></i>
            <span>Melody Sphere Zone Karaoke</span>
          </div>
        </div>

        <div className="category-card study-card" onClick={() => navigate('/study')}>
          <div className="card-content">
            <i className="fa-solid fa-book-open-reader"></i>
            <span>STUDY ROOM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;