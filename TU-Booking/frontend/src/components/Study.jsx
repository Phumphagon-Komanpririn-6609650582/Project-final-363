import React from 'react';
import { useNavigate } from 'react-router-dom';

// ⚠️ อย่าลืม Import รูปภาพจากโฟลเดอร์ assets
import pueyImg from '../assets/puey_library.png'; 
import kromLuangImg from '../assets/krom_luang.png'; 

function Study({ onBack, onSelectRoom }) {
  const navigate = useNavigate();

  const studyRooms = [
    {
      id: 1,
      name: 'Puey Ungphakorn Library',
      img: pueyImg
    },
    {
      id: 2,
      name: 'Krom Luang Naradhiwas Rajanagarinda Learning Centre',
      img: kromLuangImg
    }
  ];

  return (
    <div className="study-selection-container">
      
      <div className="breadcrumb" onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#666', marginBottom: '1rem' }}>
        <i className="fa-solid fa-chevron-left"></i> ย้อนกลับ
      </div>

      {/* ใช้ Class ชื่อ study-card-grid ให้ถูกต้องตามบริบท */}
      <div className="study-card-grid">
        {studyRooms.map((room) => (
          <div 
            key={room.id} 
            className="study-item-card" 
            onClick={() => onSelectRoom(room.name)}
            
          >
            <img 
              src={room.img} 
              alt={room.name} 
              className="study-img" 
            />
            <div className="study-name">
              {room.name}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Study;