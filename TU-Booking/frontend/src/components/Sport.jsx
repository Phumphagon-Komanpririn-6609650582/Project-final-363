import React from 'react';

function Sport({ onBack, onSelectCourt }) {
  const sports = [
    { id: 1, name: 'Tennis Court', img: 'https://psm.tu.ac.th/wp-content/uploads/2023/08/%E0%B9%80%E0%B8%97%E0%B8%99%E0%B8%99%E0%B8%B4%E0%B8%AA%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A1-scaled.jpg' },
    { id: 2, name: 'Badminton Court', img: 'https://psm.tu.ac.th/wp-content/uploads/2023/08/%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B9%81%E0%B8%9A%E0%B8%94%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A1-scaled.jpg' },
    { id: 3, name: 'TUFitness', img: 'https://psm.tu.ac.th/wp-content/uploads/2023/08/%E0%B8%AB%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%9F%E0%B8%B4%E0%B8%95%E0%B9%80%E0%B8%99%E0%B8%AA%E0%B8%9B%E0%B8%81-scaled.jpg' }
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