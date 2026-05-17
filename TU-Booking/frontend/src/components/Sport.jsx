import React from 'react';
import TennisImg from '../assets/TennisCourt.png';
import BadmintonInterzoneImg from '../assets/BadmintonInterzone.png';
import BadmintongymImg from '../assets/BadmintonGym4.png';

function Sport({ onBack, onSelectCourt }) {
  const sports = [
    { id: 1, name: 'Tennis Court', img: TennisImg },
    { id: 2, name: 'Badminton Court Inrerzone', img: BadmintonInterzoneImg },
    { id: 3, name: 'Badminton Court Gym 4', img: BadmintongymImg }
  ];

  return (
    <div className="sport-selection-container">
      <div className="breadcrumb" onClick={onBack} style={{ cursor: 'pointer', color: '#666', marginBottom: '1rem' }}>
        <i className="fa-solid fa-chevron-left"></i> ย้อนกลับ
      </div>
      
      <div className="sport-card-grid">
        {sports.map((sport) => (
          <div key={sport.id} className="sport-item-card" onClick={() => onSelectCourt(sport.name)}>
            <img src={sport.img} alt={sport.name} className="sport-img" />
            <div className="sport-name">{sport.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sport;