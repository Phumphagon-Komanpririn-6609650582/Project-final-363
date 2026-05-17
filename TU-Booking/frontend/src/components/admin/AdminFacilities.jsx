import React, { useState } from 'react';

function AdminFacilities() {
  // 👉 1. State เก็บข้อมูลสถานที่ทั้งหมด (อิงตามหมวดหมู่ในระบบของคุณ)
  const [facilities, setFacilities] = useState([
    { id: 1, type: 'Karaoke', name: 'Melody Sphere Zone Karaoke', room: 'Karaoke size M Room 1', capacity: '4-6 คน', status: 'เปิดให้บริการ', statusColor: '#8BE3A8' },
    { id: 2, type: 'Karaoke', name: 'Melody Sphere Zone Karaoke', room: 'Karaoke size S Room 3', capacity: '2-3 คน', status: 'ปิดปรับปรุง', statusColor: '#FFB3B3' },
    { id: 3, type: 'Study', name: 'Puey Ungphakorn Library', room: 'Study Room 04', capacity: '5-8 คน', status: 'เปิดให้บริการ', statusColor: '#8BE3A8' },
    { id: 4, type: 'Sport', name: 'Badminton Court Interzone', room: 'Interzone Badminton Court 03', capacity: '2-4 คน', status: 'เปิดให้บริการ', statusColor: '#8BE3A8' },
  ]);

  // State สำหรับฟอร์ม เพิ่ม/แก้ไข
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    type: 'Study',
    name: '',
    room: '',
    capacity: '',
    status: 'เปิดให้บริการ'
  });

  // เปิดหน้าต่างเพื่อเพิ่มห้องใหม่
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ type: 'Study', name: '', room: '', capacity: '', status: 'เปิดให้บริการ' });
    setIsModalOpen(true);
  };

  // เปิดหน้าต่างเพื่อแก้ไขข้อมูล
  const openEditModal = (item) => {
    setIsEditMode(true);
    setCurrentId(item.id);
    setFormData({
      type: item.type,
      name: item.name,
      room: item.room,
      capacity: item.capacity,
      status: item.status
    });
    setIsModalOpen(true);
  };

  // บันทึกข้อมูล (ทั้งเพิ่มใหม่และแก้ไข)
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.room) return alert('กรุณากรอกข้อมูลให้ครบถ้วนครับ');

    const statusColor = formData.status === 'เปิดให้บริการ' ? '#8BE3A8' : '#FFB3B3';

    if (isEditMode) {
      // โหมดแก้ไข
      setFacilities(facilities.map(item => 
        item.id === currentId ? { ...item, ...formData, statusColor } : item
      ));
      alert('แก้ไขข้อมูลสถานที่สำเร็จ');
    } else {
      // โหมดเพิ่มใหม่
      const newFacility = {
        id: Date.now(),
        ...formData,
        statusColor
      };
      setFacilities([...facilities, newFacility]);
      alert('เพิ่มสถานที่ใหม่สำเร็จ');
    }
    setIsModalOpen(false);
  };

  // สลับสถานะ เปิด/ปิดปรับปรุง แบบด่วน (Quick Toggle)
  const toggleStatus = (id) => {
    setFacilities(facilities.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'เปิดให้บริการ' ? 'ปิดปรับปรุง' : 'เปิดให้บริการ';
        const nextColor = nextStatus === 'เปิดให้บริการ' ? '#8BE3A8' : '#FFB3B3';
        return { ...item, status: nextStatus, statusColor: nextColor };
      }
      return item;
    }));
  };

  // ลบสถานที่
  const handleDelete = (id, roomName) => {
    if (window.confirm(`คุณต้องการลบ "${roomName}" ใช่หรือไม่? (ไม่สามารถกู้คืนได้)`)) {
      setFacilities(facilities.filter(item => item.id !== id));
      alert('ลบข้อมูลเรียบร้อยแล้ว');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="admin-page-title">⚙️ จัดการสถานที่และห้องใช้งาน</h1>
          <p className="admin-page-subtitle" style={{ marginBottom: 0 }}>เพิ่ม, ลบ, แก้ไขข้อมูล หรือเปิด/ปิดปรับปรุงห้องจองต่างๆ ในระบบ</p>
        </div>
        
        {/* ปุ่มเพิ่มสถานที่ใหม่ */}
        <button className="admin-add-btn" onClick={openAddModal}>
          <i className="fa-solid fa-plus"></i> เพิ่มสถานที่ใหม่
        </button>
      </div>

      {/* --- ตารางรายชื่อสถานที่ --- */}
      <div className="booking-table-container">
        <div className="booking-table-header">
          <div style={{ flex: 2, textAlign: 'center' }}>การจัดการ / เครื่องมือ</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>สถานะระบบ</div>
          <div style={{ flex: 1.2, textAlign: 'center' }}>ความจุคน</div>
          <div style={{ flex: 1.2, textAlign: 'center' }}>ประเภท</div>
          <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>ชื่อตึก / สถานที่หลัก</div>
          <div style={{ flex: 3, textAlign: 'left', paddingLeft: '1rem' }}>ชื่อห้อง / สนามย่อย</div>
        </div>

        {facilities.map(item => (
          <div key={item.id} className="booking-table-row" style={{ cursor: 'default' }}>
            
            {/* ปุ่มเครื่องมือ Manage */}
            <div style={{ flex: 2, textAlign: 'center', display: 'flex', gap: '6px', justifyContent: 'center' }}>
              <button className="admin-action-btn edit" onClick={() => openEditModal(item)} title="แก้ไขข้อมูล">
                <i className="fa-solid fa-pen-to-square"></i> แก้ไข
              </button>
              
              <button 
                className="admin-action-btn toggle" 
                style={{ backgroundColor: item.status === 'เปิดให้บริการ' ? '#F5A623' : '#1E8E3E' }}
                onClick={() => toggleStatus(item.id)}
                title="สลับสถานะเปิด/ปิดปรับปรุง"
              >
                {item.status === 'เปิดให้บริการ' ? 'ปิดปรับปรุง' : 'เปิดใช้งาน'}
              </button>

              <button className="admin-action-btn delete" onClick={() => handleDelete(item.id, item.room)} title="ลบสถานที่">
                <i className="fa-solid fa-trash"></i> ลบ
              </button>
            </div>

            {/* สถานะ */}
            <div style={{ flex: 1.5, textAlign: 'center' }}>
              <span className="status-badge" style={{ backgroundColor: item.statusColor }}>
                {item.status}
              </span>
            </div>

            <div style={{ flex: 1.2, textAlign: 'center' }}>{item.capacity}</div>
            <div style={{ flex: 1.2, textAlign: 'center', fontWeight: 'bold' }}>{item.type}</div>
            <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>{item.name}</div>
            <div style={{ flex: 3, textAlign: 'left', paddingLeft: '1rem' }}>
              <strong>{item.room}</strong>
            </div>

          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* MODAL POPUP: ฟอร์ม เพิ่ม / แก้ไข สถานที่ */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>
              {isEditMode ? '📝 แก้ไขข้อมูลสถานที่' : '➕ เพิ่มสถานที่ใหม่'}
            </h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
              
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>ประเภทสถานที่:</label>
                <select 
                  className="report-textarea" style={{ height: '40px', padding: '0 0.5rem' }}
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Study">Study (ห้องติว/ห้องสมุด)</option>
                  <option value="Karaoke">Karaoke (ห้องคาราโอเกะ)</option>
                  <option value="Music">Music (ห้องซ้อมดนตรี)</option>
                  <option value="Sport">Sport (สนามย่อยกีฬา)</option>
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>ชื่อตึก / สถานที่หลัก:</label>
                <input 
                  type="text" className="report-textarea" style={{ height: '40px' }}
                  placeholder="เช่น ตึกป๋วยฯ, Interzone, Melody Sphere"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>ชื่อห้อง / สนามย่อย:</label>
                <input 
                  type="text" className="report-textarea" style={{ height: '40px' }}
                  placeholder="เช่น Study Room 05, Karaoke Room size L"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>ความจุจำนวนคน:</label>
                <input 
                  type="text" className="report-textarea" style={{ height: '40px' }}
                  placeholder="เช่น 2-4 คน, 5-10 คน"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>สถานะเริ่มต้น:</label>
                <select 
                  className="report-textarea" style={{ height: '40px', padding: '0 0.5rem' }}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="เปิดให้บริการ">เปิดให้บริการ</option>
                  <option value="ปิดปรับปรุง">ปิดปรับปรุง (ซ่อนชั่วคราว)</option>
                </select>
              </div>

              <div className="modal-actions" style={{ marginTop: '1rem' }}>
                <button type="submit" className="btn-confirm" style={{ backgroundColor: '#1E8E3E' }}>บันทึกข้อมูล</button>
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminFacilities;