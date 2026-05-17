import React, { useState } from 'react';

function AdminReports() {
  // 👉 1. State เก็บข้อมูลการแจ้งซ่อม (จำลองว่าดึงมาจากที่ User กดแจ้งเข้ามา)
  const [reports, setReports] = useState([
    { 
      id: 1, date: '21/05/2026', time: '14:30', 
      facility: 'Melody Sphere Zone Karaoke', room: 'Karaoke size M Room 1', 
      problem: 'ไมโครโฟนตัวที่ 2 ติดๆ ดับๆ และแอร์ไม่ค่อยเย็นครับ', 
      reporter: 'ภูมิภากร โกเมนไปรรินทร์', 
      priority: 'ด่วนมาก', // ลำดับความสำคัญ
      status: 'รอดำเนินการ', statusColor: '#FFB3B3' 
    },
    { 
      id: 2, date: '20/05/2026', time: '09:15', 
      facility: 'Puey Ungphakorn Library', room: 'Study Room 04', 
      problem: 'ปลั๊กไฟใต้โต๊ะฝั่งซ้ายใช้งานไม่ได้ครับ ชาร์จแบตไม่เข้า', 
      reporter: 'สมสมร รักเรียน', 
      priority: 'ปานกลาง', 
      status: 'กำลังซ่อม', statusColor: '#FDE073' 
    },
    { 
      id: 3, date: '18/05/2026', time: '17:45', 
      facility: 'Badminton Court Interzone', room: 'Interzone Badminton Court 03', 
      problem: 'ตาข่ายกั้นสนามฝั่งขวาขาดนิดหน่อยครับ', 
      reporter: 'ใจดี มานะ', 
      priority: 'ทั่วไป', 
      status: 'ซ่อมเสร็จแล้ว', statusColor: '#8BE3A8' 
    }
  ]);

  // ฟังก์ชันอัปเดตสถานะการทำงาน
  const handleUpdateStatus = (id, currentStatus) => {
    let nextStatus = '';
    let nextColor = '';

    if (currentStatus === 'รอดำเนินการ') {
      nextStatus = 'กำลังซ่อม';
      nextColor = '#FDE073'; // สีเหลือง
    } else if (currentStatus === 'กำลังซ่อม') {
      nextStatus = 'ซ่อมเสร็จแล้ว';
      nextColor = '#8BE3A8'; // สีเขียว
    }

    if (nextStatus) {
      setReports(reports.map(item => 
        item.id === id ? { ...item, status: nextStatus, statusColor: nextColor } : item
      ));
    }
  };

  // ฟังก์ชันปรับความสำคัญ (Priority)
  const handlePriorityChange = (id, newPriority) => {
    setReports(reports.map(item => 
      item.id === id ? { ...item, priority: newPriority } : item
    ));
  };

  // ฟังก์ชันลบประวัติ (สำหรับอันที่ซ่อมเสร็จแล้ว)
  const handleDelete = (id) => {
    if (window.confirm('คุณต้องการลบประวัติการแจ้งซ่อมนี้ออกจากระบบใช่หรือไม่?')) {
      setReports(reports.filter(item => item.id !== id));
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="admin-page-title">🔧 รับเรื่องแจ้งซ่อมบำรุง</h1>
          <p className="admin-page-subtitle" style={{ marginBottom: 0 }}>
            จัดการปัญหาที่นักศึกษารายงานเข้ามา จัดลำดับความสำคัญ และอัปเดตสถานะงานซ่อม
          </p>
        </div>
      </div>

      {/* --- ตารางรายการแจ้งซ่อม --- */}
      <div className="booking-table-container">
        <div className="booking-table-header">
          <div style={{ flex: 1.5, textAlign: 'center' }}>อัปเดตสถานะ</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>สถานะปัจจุบัน</div>
          <div style={{ flex: 1.2, textAlign: 'center' }}>ความสำคัญ</div>
          <div style={{ flex: 2, textAlign: 'left', paddingLeft: '1rem' }}>สถานที่ / ห้อง</div>
          <div style={{ flex: 3, textAlign: 'left', paddingLeft: '1rem' }}>รายละเอียดปัญหา</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>ผู้แจ้ง / เวลา</div>
        </div>

        {reports.map(item => {
          // กำหนดสีตัวอักษรตามความสำคัญ
          let priorityColor = '#1E8E3E'; // ทั่วไป (เขียว)
          if (item.priority === 'ปานกลาง') priorityColor = '#F5A623'; // ปานกลาง (ส้ม)
          if (item.priority === 'ด่วนมาก') priorityColor = '#E31B23'; // ด่วน (แดง)

          return (
            <div key={item.id} className="booking-table-row" style={{ cursor: 'default', alignItems: 'flex-start' }}>
              
              {/* --- ปุ่มอัปเดตสถานะการซ่อม --- */}
              <div style={{ flex: 1.5, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                {item.status === 'รอดำเนินการ' && (
                  <button className="admin-action-btn" style={{ backgroundColor: '#F5A623', width: '100%' }} onClick={() => handleUpdateStatus(item.id, item.status)}>
                    <i className="fa-solid fa-wrench"></i> เริ่มรับงานช่าง
                  </button>
                )}
                
                {item.status === 'กำลังซ่อม' && (
                  <button className="admin-action-btn" style={{ backgroundColor: '#1E8E3E', width: '100%' }} onClick={() => handleUpdateStatus(item.id, item.status)}>
                    <i className="fa-solid fa-check-double"></i> ซ่อมเสร็จแล้ว
                  </button>
                )}

                {item.status === 'ซ่อมเสร็จแล้ว' && (
                  <button className="admin-action-btn delete" style={{ width: '100%' }} onClick={() => handleDelete(item.id)}>
                    <i className="fa-solid fa-trash"></i> ลบประวัติ
                  </button>
                )}
              </div>

              {/* --- Badge สถานะปัจจุบัน --- */}
              <div style={{ flex: 1.5, textAlign: 'center' }}>
                <span className="status-badge" style={{ backgroundColor: item.statusColor, display: 'inline-block', marginTop: '0.2rem' }}>
                  {item.status}
                </span>
              </div>

              {/* --- Dropdown ปรับความสำคัญ --- */}
              <div style={{ flex: 1.2, textAlign: 'center' }}>
                <select 
                  style={{ 
                    padding: '0.3rem', borderRadius: '0.3rem', border: `1px solid ${priorityColor}`, 
                    color: priorityColor, fontWeight: 'bold', outline: 'none', cursor: 'pointer',
                    backgroundColor: 'transparent'
                  }}
                  value={item.priority}
                  onChange={(e) => handlePriorityChange(item.id, e.target.value)}
                >
                  <option value="ด่วนมาก">ด่วนมาก</option>
                  <option value="ปานกลาง">ปานกลาง</option>
                  <option value="ทั่วไป">ทั่วไป</option>
                </select>
              </div>

              {/* --- สถานที่ --- */}
              <div style={{ flex: 2, textAlign: 'left', paddingLeft: '1rem' }}>
                <strong>{item.room}</strong><br/>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>{item.facility}</span>
              </div>

              {/* --- รายละเอียดปัญหา --- */}
              <div style={{ flex: 3, textAlign: 'left', paddingLeft: '1rem', color: '#E31B23', fontWeight: '500' }}>
                "{item.problem}"
              </div>

              {/* --- ผู้แจ้งและเวลา --- */}
              <div style={{ flex: 1.5, textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                <strong>{item.reporter}</strong><br/>
                {item.date} {item.time}
              </div>

            </div>
          );
        })}

        {reports.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
            <i className="fa-solid fa-clipboard-check" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#E0E0E0' }}></i><br/>
            ไม่มีรายการแจ้งซ่อมค้างในระบบ
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminReports;