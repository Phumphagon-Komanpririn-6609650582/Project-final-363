import React, { useState, useEffect } from 'react';

function Sport({ onBack, onSelectCourt }) {

  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/facilities?type=Sport');
        const data = await response.json();

        const uniqueSports = [];
        const seenNames = new Set();
        
        data.forEach((item) => {
          if (!seenNames.has(item.name)) {
            seenNames.add(item.name);
            uniqueSports.push({
              id: item._id,
              name: item.name,
              img: item.img
            });
          }
        });

        setSports(uniqueSports);
        setLoading(false);
      } catch (error) {
        console.error('❌ ดึงข้อมูลล้มเหลว:', error);
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  return (
    <div className="sport-selection-container">
      <div className="breadcrumb" onClick={onBack} style={{ cursor: 'pointer', color: '#666', marginBottom: '1rem' }}>
        <i className="fa-solid fa-chevron-left"></i> ย้อนกลับ
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <p>กำลังโหลดข้อมูลสนาม...</p>
        </div>
      ) : (
        <div className="sport-card-grid">
          {sports.map((sport) => (
            <div key={sport.id} className="sport-item-card" onClick={() => onSelectCourt(sport.name)}>
              <img src={sport.img} alt={sport.name} className="sport-img" />
              <div className="sport-name">{sport.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sport;