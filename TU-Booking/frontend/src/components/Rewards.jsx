import React, { useState } from 'react';

function Rewards({ points, setPoints }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 👉 1. เพิ่ม State เก็บข้อมูลตั๋ว (Ref Code)
  const [ticketCode, setTicketCode] = useState(null);

  // รายการของรางวัล
  const rewardItems = [
    { id: 1, name: 'น้ำดื่ม TU', points: 20, icon: 'fa-solid fa-bottle-water', color: '#4A90E2', category: 'ทั่วไป' },
    { id: 2, name: 'ดินสอ 2B / ปากกาน้ำเงิน', points: 15, icon: 'fa-solid fa-pen', color: '#F5A623', category: 'ทั่วไป' },
    { id: 3, name: 'ขนมขบเคี้ยว (Snack)', points: 30, icon: 'fa-solid fa-cookie', color: '#D0021B', category: 'ทั่วไป' },
    { id: 4, name: 'ฟรี! คาราโอเกะ 1 ชั่วโมง', points: 100, icon: 'fa-solid fa-microphone', color: '#BD10E0', category: 'บันเทิง' },
  ];

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // 👉 2. แก้ไขฟังก์ชันกดยืนยัน ให้สร้างรหัสโชว์พนักงานแทนการใช้ alert()
  const confirmRedeem = () => {
    if (points >= selectedItem.points) {
      setPoints(points - selectedItem.points); // หักแต้ม
      setIsModalOpen(false); // ปิดหน้าต่างถามยืนยัน

      // สุ่มรหัสอ้างอิง 6 หลัก (A-Z, 0-9)
      const randomRef = Math.random().toString(36).substring(2, 8).toUpperCase();
      setTicketCode(randomRef); // เปิด Popup ตั๋วรับรางวัลโชว์พนักงาน
    }
  };

  return (
    <div className="home-container rewards-container">
      <h2 className="rewards-title">แลกของรางวัล</h2>
      <p className="rewards-subtitle">
        แต้มสะสมของคุณ: <span className="points-highlight">{points} แต้ม</span>
      </p>

      <div className="rewards-grid">
        {rewardItems.map((item) => (
          <div key={item.id} className="reward-card">
            <div className="reward-icon-wrapper" style={{ color: item.color }}>
              <i className={item.icon}></i>
            </div>
            <h3 className="reward-name">{item.name}</h3>
            <p className="reward-category">หมวดหมู่: {item.category}</p>
            
            <button 
              onClick={() => handleSelectItem(item)}
              className="btn-redeem"
              disabled={points < item.points}
            >
              ใช้ {item.points} แต้ม
            </button>
            {points < item.points && <span className="reward-error-text">แต้มไม่พอ</span>}
          </div>
        ))}
      </div>

      {/* --- Popup ที่ 1: ถามเพื่อยืนยันการหักแต้ม --- */}
      {isModalOpen && selectedItem && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}> 
          <div className="modal-content" onClick={(e) => e.stopPropagation()}> 
            <h2 className="modal-title">ยืนยันการแลกรางวัล</h2>
            
            <div className="modal-icon" style={{ color: selectedItem.color }}>
              <i className={selectedItem.icon} style={{ fontSize: '4rem' }}></i>
            </div>
            
            <h3 className="reward-name" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              {selectedItem.name}
            </h3>
            
            <div className="modal-summary-box">
              <div className="summary-row">
                <span>แต้มสะสมปัจจุบัน:</span>
                <span style={{ fontWeight: 'bold' }}>{points} แต้ม</span>
              </div>
              <div className="summary-row deduct">
                <span>หักแต้ม:</span>
                <span style={{ fontWeight: 'bold' }}>- {selectedItem.points} แต้ม</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row balance">
                <span>แต้มคงเหลือ:</span>
                <span>{points - selectedItem.points} แต้ม</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-confirm" onClick={confirmRedeem}>ยืนยันการแลก</button>
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}

      {/* 👉 3. Popup ที่ 2: โชว์ตั๋วให้พนักงานดู (จะเด้งขึ้นมาหลังจากกดยืนยันแล้ว) */}
      {ticketCode && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '4rem', color: '#1E8E3E' }}></i>
            <h2 style={{ marginTop: '1rem', color: '#1E8E3E' }}>แลกรางวัลสำเร็จ!</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{selectedItem?.name}</p>
            
            <div style={{ backgroundColor: '#F8F9FA', padding: '1rem', borderRadius: '0.5rem', margin: '1rem 0' }}>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>กรุณาแสดงรหัสนี้ให้พนักงาน</p>
              
              {/* โชว์รหัส 6 หลักตัวใหญ่ๆ ให้พนักงานเห็นชัดๆ */}
              <h1 style={{ letterSpacing: '0.2rem', margin: '0.5rem 0', color: '#333' }}>
                {ticketCode}
              </h1>
              
              {/* โชว์เวลา ณ ตอนที่กดแลก */}
              <p style={{ fontSize: '0.85rem', color: '#999' }}>
                 เวลาแลกสิทธิ์: {new Date().toLocaleTimeString('th-TH')} น.
              </p>
            </div>

            <button className="btn-confirm" onClick={() => setTicketCode(null)}>ปิดหน้าต่างนี้</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Rewards;