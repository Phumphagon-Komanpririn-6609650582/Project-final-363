import React from 'react';

function Home() {
  return (
    <div className="home-container">
      <p className="select-title">เลือกหมวดหมู่ที่ต้องการจอง</p>
      
      <div className="card-grid">
        {/* หมวดหมู่กีฬา - สีฟ้า */}
        <div className="category-card sport-card">
          <div className="card-content">
            <i className="fa-solid fa-basketball"></i>
            <span>Sport</span>
          </div>
        </div>

        {/* หมวดหมู่คาราโอเกะ - สีม่วง */}
        <div className="category-card karaoke-card">
          <div className="card-content">
            <i className="fa-solid fa-microphone-lines"></i>
            <span>Melody Sphere Zone Karaoke</span>
          </div>
        </div>

        {/* หมวดหมู่ห้องเรียน - สีแดง */}
        <div className="category-card study-card">
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