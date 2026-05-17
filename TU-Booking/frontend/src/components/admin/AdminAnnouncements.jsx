import React, { useState } from 'react';

function AdminAnnouncements() {
  // 👉 1. State เก็บข้อมูลประกาศข่าวสารทั้งหมด
  const [announcements, setAnnouncements] = useState([
    { id: 1, type: 'info', typeLabel: 'ข่าวสารทั่วไป', message: 'แจ้งปิดปรับปรุงระบบไฟฟ้าตึกป๋วยฯ ในวันที่ 25 พ.ค. นี้', date: '20/05/2026', icon: 'fa-solid fa-circle-info', color: '#4A90E2' },
    { id: 2, type: 'warning', typeLabel: 'ประกาศเตือน', message: 'งดใช้เสียงดังบริเวณหน้าห้อง Melody Sphere Zone เนื่องจากมีสอบ', date: '18/05/2026', icon: 'fa-solid fa-triangle-exclamation', color: '#F5A623' },
    { id: 3, type: 'success', typeLabel: 'ข่าวดี/อัปเดต', message: 'เพิ่มของรางวัลใหม่ในระบบสะสมแต้มแล้ว! แลกคูปองฟรีได้เลย', date: '15/05/2026', icon: 'fa-solid fa-circle-check', color: '#1E8E3E' },
  ]);

  // State สำหรับ Modal เพิ่มประกาศใหม่
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ type: 'info', message: '' });

  // ฟังก์ชันลบประกาศ
  const handleDelete = (id) => {
    if (window.confirm('คุณต้องการลบประกาศนี้ใช่หรือไม่?')) {
      setAnnouncements(announcements.filter(item => item.id !== id));
      alert('ลบประกาศเรียบร้อยแล้ว');
    }
  };

  // ฟังก์ชันบันทึกประกาศใหม่
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return alert('กรุณาระบุข้อความประกาศครับ');

    // กำหนดสีและไอคอนตามประเภทของประกาศ
    let icon = 'fa-solid fa-circle-info';
    let color = '#4A90E2';
    let typeLabel = 'ข่าวสารทั่วไป';

    if (formData.type === 'warning') {
      icon = 'fa-solid fa-triangle-exclamation';
      color = '#F5A623';
      typeLabel = 'ประกาศเตือน';
    } else if (formData.type === 'success') {
      icon = 'fa-solid fa-circle-check';
      color = '#1E8E3E';
      typeLabel = 'ข่าวดี/อัปเดต';
    }

    const newAnnouncement = {
      id: Date.now(),
      type: formData.type,
      typeLabel,
      message: formData.message,
      date: new Date().toLocaleDateString('en-GB'), // วันที่ปัจจุบัน
      icon,
      color
    };

    setAnnouncements([newAnnouncement, ...announcements]); // เอาประกาศใหม่ขึ้นบนสุด
    setIsModalOpen(false);
    setFormData({ type: 'info', message: '' });
    alert('สร้างประกาศข่าวสารเรียบร้อย ระบบได้ส่งไปยังหน้าจอของนักศึกษาแล้ว!');
  };

  return (
    <div className="admin-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="admin-page-title">📢 จัดการประกาศข่าวสาร</h1>
          <p className="admin-page-subtitle" style={{ marginBottom: 0 }}>สร้างข้อความประกาศเพื่อแสดงผลที่หน้า "ประกาศข่าวสาร" ของผู้ใช้งาน</p>
        </div>
        
        {/* ปุ่มสร้างประกาศใหม่ */}
        <button className="admin-add-btn" onClick={() => setIsModalOpen(true)}>
          <i className="fa-solid fa-bullhorn"></i> สร้างประกาศใหม่
        </button>
      </div>

      {/* --- ตารางรายการประกาศ --- */}
      <div className="booking-table-container">
        <div className="booking-table-header">
          <div style={{ flex: 1, textAlign: 'center' }}>จัดการ</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>วันที่ประกาศ</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>ประเภท</div>
          <div style={{ flex: 5, textAlign: 'left', paddingLeft: '1rem' }}>เนื้อหาประกาศ</div>
        </div>

        {announcements.map(item => (
          <div key={item.id} className="booking-table-row" style={{ cursor: 'default' }}>
            
            {/* ปุ่มลบ */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <button className="admin-action-btn delete" onClick={() => handleDelete(item.id)} title="ลบประกาศ">
                <i className="fa-solid fa-trash"></i> ลบ
              </button>
            </div>

            <div style={{ flex: 1.5, textAlign: 'center', color: '#666' }}>{item.date}</div>
            
            <div style={{ flex: 1.5, textAlign: 'center', fontWeight: 'bold', color: item.color }}>
              <i className={item.icon} style={{ marginRight: '0.5rem' }}></i>
              {item.typeLabel}
            </div>

            <div style={{ flex: 5, textAlign: 'left', paddingLeft: '1rem', fontSize: '1rem' }}>
              {item.message}
            </div>

          </div>
        ))}

        {/* กรณีไม่มีประกาศ */}
        {announcements.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
            ไม่มีประกาศข่าวสารในระบบ
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL POPUP: ฟอร์มสร้างประกาศใหม่ */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>
              <i className="fa-solid fa-bullhorn" style={{ color: '#4A90E2', marginRight: '0.5rem' }}></i> 
              สร้างประกาศใหม่
            </h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
              
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>ประเภทประกาศ:</label>
                <select 
                  className="report-textarea" style={{ height: '40px', padding: '0 0.5rem' }}
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="info">ข่าวสารทั่วไป (สีฟ้า)</option>
                  <option value="success">ข่าวดี / อัปเดต (สีเขียว)</option>
                  <option value="warning">ประกาศเตือน / กฎระเบียบ (สีส้ม)</option>
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>เนื้อหาประกาศ:</label>
                <textarea 
                  className="report-textarea" 
                  style={{ height: '100px' }}
                  placeholder="พิมพ์ข้อความที่ต้องการแจ้งให้นักศึกษาทราบ..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <div className="modal-actions" style={{ marginTop: '1rem' }}>
                <button type="submit" className="btn-confirm" style={{ backgroundColor: '#4A90E2' }}>ส่งประกาศ</button>
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminAnnouncements;