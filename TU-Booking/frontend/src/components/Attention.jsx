import React, { useState, useEffect } from 'react';

function Attention() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 👉 1. State สำหรับเก็บประเภทที่กำลังเลือกกรองข้อมูล (Default เป็น 'all' คือดูทั้งหมด)
  const [filterType, setFilterType] = useState('all');

  // ฟังก์ชันยิงกวาดดึงประวัติประกาศข่าวสารล่าสุดจากฐานข้อมูลจริง
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/announcements/list');
      const data = await response.json();
      if (response.ok) {
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('❌ นักศึกษาโหลดกระดานประกาศข่าวสารล้มเหลว:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ตรรกะจับสัญญาณพ่นไอคอนและคลาสตามประเภทความรุนแรงของฟิลด์หลังบ้าน
  const getAnnouncementMeta = (type) => {
    switch (type) {
      case 'warning':
        return { iconClass: 'fa-solid fa-triangle-exclamation', cssClass: 'warning' };
      case 'success':
        return { iconClass: 'fa-solid fa-circle-check', cssClass: 'success' };
      default:
        return { iconClass: 'fa-solid fa-circle-info', cssClass: 'info' };
    }
  };

  // 👉 2. เครื่องยนต์คัดกรองประกาศ (Filter Engine) อิงตามปุ่มที่แอดมินหรือนศ.คลิกเลือก
  const filteredAnnouncements = announcements.filter((item) => {
    if (filterType === 'all') return true; // ถ้าเลือก 'all' ให้ผ่านหมดทุกตัว
    return item.type === filterType; // คัดเอาเฉพาะไอเทมที่ประเภทตรงกับฟิลเตอร์
  });

  // สไตล์สำหรับจัดการความสวยงามของปุ่มกรอง (มึงไปปรับแก้คลาส CSS เพิ่มเติมได้นะเพื่อน)
  const getFilterBtnStyle = (type, activeColor) => {
    const isActive = filterType === type;
    return {
      padding: '0.4rem 1rem',
      borderRadius: '20px',
      border: `1.5px solid ${activeColor}`,
      backgroundColor: isActive ? activeColor : '#FFF',
      color: isActive ? '#FFF' : '#555',
      fontWeight: 'bold',
      fontSize: '0.85rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s',
      boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
    };
  };

  return (
    <div className="attention-container">
      <div className="attention-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <i className="fa-solid fa-bullhorn"></i>
        </div>

        {/* 👉 3. แผงปุ่มสำหรับกดกรองประเภทข่าวสารอัจฉริยะ */}
        <div className="announcement-filters" style={{ display: 'flex', gap: '8px', paddingRight: '1rem' }}>
          <button 
            style={getFilterBtnStyle('all', '#444')} 
            onClick={() => setFilterType('all')}
          >
            <i className="fa-solid fa-list"></i> ทั้งหมด
          </button>
          <button 
            style={getFilterBtnStyle('info', '#4A90E2')} 
            onClick={() => setFilterType('info')}
          >
            <i className="fa-solid fa-circle-info"></i> ข่าวสารทั่วไป
          </button>
          <button 
            style={getFilterBtnStyle('success', '#1E8E3E')} 
            onClick={() => setFilterType('success')}
          >
            <i className="fa-solid fa-circle-check"></i> ข่าวดี/อัปเดต
          </button>
          <button 
            style={getFilterBtnStyle('warning', '#F5A623')} 
            onClick={() => setFilterType('warning')}
          >
            <i className="fa-solid fa-triangle-exclamation"></i> ประกาศเตือน
          </button>
        </div>
      </div>
      
      <div className="attention-white-board" style={{ padding: '1rem', minHeight: '200px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666', fontStyle: 'italic' }}>
            🔄 กำลังอัปเดตข่าวสารล่าสุดจากแอดมิน...
          </p>
        ) : filteredAnnouncements.length > 0 ? (
          // 👉 เปลี่ยนมาลูปการ์ดจากอาเรย์ผลลัพธ์ตัวกรอง filteredAnnouncements แทนตัวเดิม
          filteredAnnouncements.map((item) => {
            const meta = getAnnouncementMeta(item.type);

            return (
              <div key={item._id} className={`alert-card ${meta.cssClass}`}>
                <div className="alert-icon">
                  <i className={meta.iconClass}></i>
                </div>
                
                <div className="alert-content" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '15px' }}>
                    <strong style={{ fontSize: '1.05rem' }}>{item.message}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#888', whiteSpace: 'nowrap', fontWeight: 'normal' }}>
                      📅 {item.date}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* กรณีกลุ่มข่าวสารประเภทนั้น ๆ ไม่มีข้อมูลอยู่ */
          <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
            <i className="fa-solid fa-folder-open" style={{ fontSize: '2.5rem', marginBottom: '0.8rem', color: '#CCC' }}></i>
            <p style={{ margin: 0 }}>ไม่มีรายการข่าวสารประเภทนี้ในขณะนี้</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attention;