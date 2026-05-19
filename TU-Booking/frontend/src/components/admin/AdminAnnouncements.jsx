import React, { useState, useEffect } from 'react';

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // State สำหรับ Modal เพิ่มประกาศใหม่
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ type: 'info', message: '' });

  // 🎯 ฟังก์ชันดึงข่าวสารอัปเดตล่าสุดจากฐานข้อมูลจริง
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/announcements/list');
      const data = await response.json();
      if (response.ok) {
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('❌ โหลดข้อมูลประกาศล้มเหลว:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // 🎯 ฟังก์ชันวิเคราะห์ข้อมูลสไตล์ป้ายตามค่าประเภทที่เก็บใน MongoDB
  const getAnnouncementMeta = (type) => {
    switch (type) {
      case 'warning':
        return { label: 'ประกาศเตือน', icon: 'fa-solid fa-triangle-exclamation', color: '#F5A623' };
      case 'success':
        return { label: 'ข่าวดี/อัปเดต', icon: 'fa-solid fa-circle-check', color: '#1E8E3E' };
      default:
        return { label: 'ข่าวสารทั่วไป', icon: 'fa-solid fa-circle-info', color: '#4A90E2' };
    }
  };

  // 🗑️ ฟังก์ชันลบประกาศออกจาก MongoDB จริง
  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบประกาศนี้ออกจากระบบใช่หรือไม่?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/announcements/delete/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('🗑️ ลบประกาศข่าวสารออกจากระบบเรียบร้อยแล้ว!');
          fetchAnnouncements(); // โหลดตารางใหม่ทันที
        } else {
          alert('ไม่สามารถลบประกาศได้');
        }
      } catch (error) {
        console.error(error);
        alert('เชื่อมต่อเซิร์ฟเวอร์ขัดข้อง');
      }
    }
  };

  // 📝 ฟังก์ชันบันทึกประกาศใหม่เข้าฐานข้อมูลจริง
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return alert('กรุณาระบุข้อความประกาศด้วยครับเพื่อน');

    try {
      const response = await fetch('http://localhost:4000/api/announcements/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          message: formData.message
        })
      });

      if (response.ok) {
        alert('📢 สร้างประกาศข่าวสารเรียบร้อย! ระบบจะส่งข้อมูลไปแสดงที่หน้านักศึกษาทันที');
        setIsModalOpen(false);
        setFormData({ type: 'info', message: '' });
        fetchAnnouncements(); // อัปเดตรีเฟรชหน้าจอหลัก
      } else {
        alert('สร้างประกาศล้มเหลว');
      }
    } catch (error) {
      console.error(error);
      alert('เชื่อมต่อหลังบ้านล้มเหลว');
    }
  };

  return (
    <div className="admin-dashboard-container" style={{ padding: '2rem', backgroundColor: '#EEF0F8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="admin-page-title" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', margin: 0 }}>📢 จัดการประกาศข่าวสาร</h1>
          <p className="admin-page-subtitle" style={{ color: '#666', marginTop: '0.5rem', marginBottom: 0 }}>สร้างข้อความประกาศเพื่อแสดงผลที่หน้า "ประกาศข่าวสาร" ของผู้ใช้งาน</p>
        </div>
        
        {/* ปุ่มสร้างประกาศใหม่ */}
        <button className="admin-add-btn" onClick={() => setIsModalOpen(true)} style={{ backgroundColor: '#1E8E3E', color: '#FFF', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-bullhorn"></i> สร้างประกาศใหม่
        </button>
      </div>

      {/* --- ตารางรายการประกาศ --- */}
      <div className="booking-table-container" style={{ backgroundColor: '#FFF', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div className="booking-table-header" style={{ display: 'flex', fontWeight: 'bold', padding: '1rem', backgroundColor: '#F8F9FA', borderBottom: '2px solid #EEE', color: '#444' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>จัดการ</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>วันที่ประกาศ</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>ประเภท</div>
          <div style={{ flex: 5, textAlign: 'left', paddingLeft: '1rem' }}>เนื้อหาประกาศ</div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>กำลังดึงข้อมูลประกาศข่าวสารจากเซิร์ฟเวอร์...</p>
        ) : announcements.length > 0 ? (
          announcements.map(item => {
            const meta = getAnnouncementMeta(item.type);
            return (
              <div key={item._id} className="booking-table-row" style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #EEE', cursor: 'default' }}>
                
                {/* ปุ่มลบ */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(item._id)} title="ลบประกาศ" style={{ backgroundColor: '#E31B23', color: '#FFF', border: 'none', padding: '0.35rem 0.7rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <i className="fa-solid fa-trash"></i> ลบ
                  </button>
                </div>

                <div style={{ flex: 1.5, textAlign: 'center', color: '#666' }}>{item.date}</div>
                
                <div style={{ flex: 1.5, textAlign: 'center', fontWeight: 'bold', color: meta.color }}>
                  <i className={meta.icon} style={{ marginRight: '0.5rem' }}></i>
                  {meta.label}
                </div>

                <div style={{ flex: 5, textAlign: 'left', paddingLeft: '1rem', fontSize: '1rem', color: '#333' }}>
                  {item.message}
                </div>

              </div>
            );
          })
        ) : (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>
            <i className="fa-solid fa-folder-open" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <p>ยังไม่มีประกาศข่าวสารบันทึกอยู่ในฐานข้อมูลขณะนี้</p>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL POPUP: ฟอร์มสร้างประกาศใหม่ */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '500px', backgroundColor: '#FFF', padding: '2rem', borderRadius: '8px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333', marginTop: 0 }}>
              <i className="fa-solid fa-bullhorn" style={{ color: '#4A90E2', marginRight: '0.5rem' }}></i> 
              สร้างประกาศใหม่
            </h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
              
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>ประเภทประกาศ:</label>
                <select 
                  style={{ height: '40px', padding: '0 0.5rem', width: '100%', borderRadius: '4px', border: '1px solid #CCC' }}
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
                  style={{ height: '100px', width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #CCC', resize: 'none' }}
                  placeholder="พิมพ์ข้อความที่ต้องการแจ้งให้นักศึกษาทราบ..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <div className="modal-actions" style={{ marginTop: '1rem', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="submit" style={{ backgroundColor: '#4A90E2', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ส่งประกาศ</button>
                <button type="button" style={{ backgroundColor: '#BBB', color: '#FFF', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminAnnouncements;