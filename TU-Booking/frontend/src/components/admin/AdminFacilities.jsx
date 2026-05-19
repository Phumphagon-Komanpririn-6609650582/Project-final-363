import React, { useState, useEffect } from 'react';

function AdminFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👉 เพิ่ม State สำหรับทำระบบ Filter ค้นหา
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All'); // ค่าเริ่มต้นโชว์ทั้งหมด

  // ฟังก์ชันดึงข้อมูลจากหลังบ้านพาร์ท Admin
  const fetchAdminFacilities = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/facilities/admin-list');
      const data = await response.json();
      
      if (response.ok) {
        let rawArray = [];
        if (Array.isArray(data)) {
          rawArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          rawArray = data.data;
        } else if (data.facilities && Array.isArray(data.facilities)) {
          rawArray = data.facilities;
        }

        const sanitizedData = rawArray.map(item => ({
          _id: item._id ? item._id.toString() : (item.id ? item.id.toString() : Math.random().toString()),
          type: item.type || 'ไม่ระบุ',
          name: item.name || 'ไม่มีชื่อสถานที่',
          room: item.room || 'ไม่มีชื่อห้องย่อย',
          status: item.status || 'เปิดให้บริการ'
        }));

        setFacilities(sanitizedData);
      }
    } catch (error) {
      console.error('❌ ดึงข้อมูลสถานที่หลังบ้านล้มเหลว:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminFacilities();
  }, []);

  // ฟังก์ชันยิง API สลับสถานะระบบในฐานข้อมูล
  const handleToggleStatus = async (id, currentStatus) => {
    const actionText = currentStatus === 'เปิดให้บริการ' ? 'ปิดปรับปรุงระบบ' : 'เปิดให้บริการตามปกติ';
    
    if (window.confirm(`คุณต้องการเปลี่ยนสถานะสถานที่นี้เป็น "${actionText}" ใช่หรือไม่?`)) {
      try {
        const response = await fetch(`http://localhost:4000/api/facilities/toggle/${id}`, {
          method: 'POST'
        });
        
        if (response.ok) {
          fetchAdminFacilities();
        } else {
          alert('ไม่สามารถเปลี่ยนสถานะระบบได้');
        }
      } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการเชื่อมต่อหลังบ้าน:', error);
        alert('เชื่อมต่อหลังบ้านล้มเหลว');
      }
    }
  };

  // 👉 3. ตรรกะประมวลผลการกรองข้อมูล (Filter Logic) ยิงสดบนหน้าจอแบบ Realtime
  const filteredFacilities = facilities.filter(item => {
    // กรองด้วยประเภทแท็บ (All, Sport, Karaoke, Study)
    const matchesType = selectedType === 'All' || item.type === selectedType;
    
    // กรองด้วยคำค้นหา (เช็คทั้งชื่อสถานที่หลัก และชื่อห้องย่อย)
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="admin-dashboard-container" style={{ padding: '2rem', backgroundColor: '#EEF0F8', minHeight: '100vh' }}>
      
      {/* ส่วนหัวข้อหลัก */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="admin-page-title" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <i className="fa-solid fa-gear" style={{ color: '#666' }}></i> จัดการสถานที่และห้องใช้งาน
          </h1>
          <p className="admin-page-subtitle" style={{ color: '#666', marginTop: '0.5rem', marginBottom: 0 }}>
            เปิด/ปิดสลับสถานะปรับปรุงห้องจองและสนามย่อยต่างๆ ในระบบ
          </p>
        </div>
      </div>

      {/* 👉 ชุดกล่องเครื่องมือฟิลเตอร์ (Filter Bar Section) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        
        {/* ฝั่งซ้าย: แท็บกดเลือกประเภทความกว้างพอดีมือ */}
        <div className="tab-switcher" style={{ display: 'flex', gap: '8px', margin: 0, backgroundColor: '#E0E3EB', padding: '4px', borderRadius: '8px' }}>
          {['All', 'Sport', 'Karaoke', 'Study'].map((type) => (
            <button
              key={type}
              className={`tab-btn ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                backgroundColor: selectedType === type ? '#FFF' : 'transparent',
                color: selectedType === type ? '#333' : '#666',
                boxShadow: selectedType === type ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {type === 'All' ? '🌐 ทั้งหมด' : type}
            </button>
          ))}
        </div>

        {/* ฝั่งขวา: ช่องพิมพ์ค้นหาอัจฉริยะ (Search Input) */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
          <input
            type="text"
            placeholder="🔍 พิมพ์ค้นหาตึก หรือชื่อห้องย่อย..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem 0.6rem 2.3rem',
              borderRadius: '8px',
              border: '1px solid #CCC',
              fontSize: '0.95rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              boxSet: 'border-box'
            }}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#999', fontSize: '1.1rem' }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: '#666' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
          <p style={{ fontSize: '1.2rem' }}>กำลังดึงข้อมูลระบบสถานที่...</p>
        </div>
      ) : (
        /* --- ตารางรายชื่อสถานที่ --- */
        <div className="booking-table-container" style={{ backgroundColor: '#FFF', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          {/* หัวตาราง */}
          <div className="booking-table-header" style={{ backgroundColor: '#F8F9FA', borderBottom: '2px solid #EEE', padding: '1rem', fontWeight: 'bold', display: 'flex', color: '#444' }}>
            <div style={{ flex: 2.0, textAlign: 'center' }}>การจัดการสถานะระบบ</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>สถานะปัจจุบัน</div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>ประเภท</div>
            <div style={{ flex: 3.5, textAlign: 'left', paddingLeft: '1rem' }}>ชื่อตึก / สถานที่หลัก</div>
            <div style={{ flex: 3.5, textAlign: 'left', paddingLeft: '1rem' }}>ชื่อห้อง / สนามย่อย</div>
          </div>

          {/* เรนเดอร์แถวข้อมูลจากคิวฟิลเตอร์ (filteredFacilities) */}
          {filteredFacilities && filteredFacilities.length > 0 ? (
            filteredFacilities.map((item) => (
              <div key={item._id} className="booking-table-row" style={{ display: 'flex', alignItems: 'center', padding: '1.2rem 1rem', borderBottom: '1px solid #EEE', cursor: 'default' }}>
                
                {/* 1. ปุ่มสลับสถานะด่วน */}
                <div style={{ flex: 2.0, textAlign: 'center' }}>
                  <button
                    onClick={() => handleToggleStatus(item._id, item.status)}
                    className="cancel-booking-btn"
                    style={{
                      backgroundColor: item.status === 'เปิดให้บริการ' ? '#E31B23' : '#1E8E3E',
                      borderColor: item.status === 'เปิดให้บริการ' ? '#E31B23' : '#1E8E3E',
                      color: '#FFF',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.2s',
                      width: '140px'
                    }}
                  >
                    {item.status === 'เปิดให้บริการ' ? '🛑 สั่งปิดปรับปรุง' : '✅ สั่งเปิดบริการ'}
                  </button>
                </div>

                {/* 2. ป้ายไฟสีบอกสถานะระบบปัจจุบัน */}
                <div style={{ flex: 1.5, textAlign: 'center' }}>
                  <span 
                    className="status-badge" 
                    style={{ 
                      backgroundColor: item.status === 'เปิดให้บริการ' ? '#8BE3A8' : '#FFB3B3', 
                      color: item.status === 'เปิดให้บริการ' ? '#0E431F' : '#610F0F',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                {/* 3. ประเภทหมวดหมู่ */}
                <div style={{ flex: 1.5, textAlign: 'center', fontWeight: 'bold', color: '#555' }}>
                  {item.type}
                </div>

                {/* 4. ชื่อสถานที่หลัก */}
                <div style={{ flex: 3.5, textAlign: 'left', paddingLeft: '1rem', color: '#333' }}>
                  {item.name}
                </div>

                {/* 5. ชื่อห้อง/สนามย่อย */}
                <div style={{ flex: 3.5, textAlign: 'left', paddingLeft: '1rem', color: '#0056B3' }}>
                  <strong>{item.room}</strong>
                </div>

              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
              <i className="fa-solid fa-folder-open" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
              <p>ไม่พบรายชื่อสถานที่ตามเงื่อนไขที่ค้นหา</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminFacilities;