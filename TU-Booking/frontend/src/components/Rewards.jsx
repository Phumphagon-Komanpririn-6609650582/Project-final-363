import React, { useState, useEffect } from 'react';

function Rewards({ points, setPoints }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketCode, setTicketCode] = useState(null);
  const [rewardItems, setRewardItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem('studentId') || "6609650582";

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/rewards');
        const data = await response.json();
        if (response.ok) {
          setRewardItems(data);
        }
      } catch (error) {
        console.error('❌ ดึงข้อมูลของรางวัลล้มเหลว:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const confirmRedeem = async () => {
    if (points < selectedItem.points) return;

    const redeemData = {
      studentId: studentId,
      rewardId: selectedItem._id || selectedItem.id
    };

    try {
      const response = await fetch('http://localhost:4000/api/redeem/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(redeemData)
      });

      const result = await response.json();

      if (response.ok) {
        setPoints(result.newPoints); 
        setTicketCode(result.ticketCode); 
        setIsModalOpen(false);
      } else {
        alert(result.message || 'เกิดข้อผิดพลาดในการแลกของรางวัล');
      }
    } catch (error) {
      console.error(error);
      alert('ระบบหลังบ้านมีปัญหา ไม่สามารถเชื่อมต่อได้!');
    }
  };

  return (
    <div className="home-container rewards-container">
      <h2 className="rewards-title">แลกของรางวัล</h2>
      <p className="rewards-subtitle">
        แต้มสะสมของคุณ: <span className="points-highlight">{points} แต้ม</span>
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <p>กำลังโหลดรายการของรางวัล...</p>
        </div>
      ) : rewardItems.length > 0 ? (
        <div className="rewards-grid">
          {rewardItems.map((item) => (
            <div key={item._id || item.id} className="reward-card">
              <div className="reward-icon-wrapper" style={{ color: item.color || '#4A90E2' }}>
                {item.img ? (
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px' }}
                    onError={(e) => { e.target.onerror = null; e.target.src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=150&auto=format&fit=crop" }}
                  />
                ) : (
                  <i className={item.icon || 'fa-solid fa-gift'}></i>
                )}
              </div>
              
              <h3 className="reward-name">{item.name}</h3>
              <p className="reward-category">หมวดหมู่: {item.category || 'ทั่วไป'}</p>
              
              <button 
                onClick={() => handleSelectItem(item)}
                className="btn-redeem"
                disabled={points < item.points}
              >
                Use {item.points} Points
              </button>
              {points < item.points && <span className="reward-error-text">แต้มไม่พอ</span>}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <p>ยังไม่มีรายการของรางวัลให้แลกในขณะนี้</p>
        </div>
      )}

      {isModalOpen && selectedItem && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}> 
          <div className="modal-content" onClick={(e) => e.stopPropagation()}> 
            <h2 className="modal-title">ยืนยันการแลกรางวัล</h2>
            <div className="modal-icon" style={{ color: selectedItem.color || '#4A90E2' }}>
              {selectedItem.img ? (
                <img src={selectedItem.img} alt={selectedItem.name} style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
              ) : (
                <i className={selectedItem.icon || 'fa-solid fa-gift'} style={{ fontSize: '4rem' }}></i>
              )}
            </div>
            
            <h3 className="reward-name" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{selectedItem.name}</h3>
            
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

      {ticketCode && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '4rem', color: '#1E8E3E' }}></i>
            <h2 style={{ marginTop: '1rem', color: '#1E8E3E' }}>แลกรางวัลสำเร็จ!</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{selectedItem?.name}</p>
            
            <div style={{ backgroundColor: '#F8F9FA', padding: '1rem', borderRadius: '0.5rem', margin: '1rem 0' }}>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>กรุณาแสดงรหัสนี้ให้พนักงาน</p>
              
              {/* รหัสตรงนี้เป็นข้อมูลจริงจากฐานข้อมูลหลังบ้านเรียบร้อยแล้ว */}
              <h1 style={{ letterSpacing: '0.2rem', margin: '0.5rem 0', color: '#333' }}>{ticketCode}</h1>
              
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