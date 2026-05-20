import React from 'react';
import KaraokeImg from '/assets/Karaoke Banner.png'
import MusicImg from '/assets/MusicRoom Banner.png'
function Karaoke({ onBack, onSelectRoom }) {
  const karaokeRooms = [
    { 
      id: 1, 
      name: 'Melody Sphere Zone Karaoke', 
      img: KaraokeImg
    },
    { 
      id: 2, 
      name: 'Melody Sphere Zone Music Room', 
      img: MusicImg
    }
  ];

  return (
    <div className="karaoke-selection-container">
      
      <div className="breadcrumb" onClick={onBack} style={{ cursor: 'pointer', color: '#666', marginBottom: '1rem' }}>
        <i className="fa-solid fa-chevron-left"></i> ย้อนกลับ
      </div>
      
      <div className="karaoke-card-grid">
        {karaokeRooms.map((room) => (
          <div 
            key={room.id} 
            className="karaoke-item-card" 
            onClick={() => onSelectRoom(room.name)}
          >
            <img 
              src={room.img} 
              alt={room.name} 
              className="karaoke-img" 
            />
            <div className="karaoke-name">
              {room.name}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Karaoke;