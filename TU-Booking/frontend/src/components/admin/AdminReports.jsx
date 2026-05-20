import React, { useState, useEffect } from 'react';

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/reports/admin/list');
      const data = await response.json();
      if (response.ok) {
        setReports(data);
      }
    } catch (error) {
      console.error('❌ ดึงข้อมูลรายการแจ้งชำรุดล้มเหลว:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ฟังก์ชันกดปิดงานซ่อม
  const handleResolve = async (id) => {
    if (window.confirm('ซ่อมแซมเสร็จสิ้นแล้วใช่หรือไม่?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/reports/admin/update/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'resolved' })
        });
        if (response.ok) {
          fetchReports();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ฟังก์ชันลบประวัติแจ้งซ่อม
  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบประวัติการแจ้งซ่อมนี้ออกจากฐานข้อมูลใช่หรือไม่?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/reports/admin/delete/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('🗑️ ลบประวัติแจ้งซ่อมเรียบร้อยแล้ว!');
          fetchReports();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // แมปปิ้งสีป้ายสถานะปัจจุบัน
  const getStatusMeta = (status) => {
    if (status === 'resolved') {
      return { text: 'ซ่อมเสร็จแล้ว', color: '#8BE3A8', textColor: '#0E431F' };
    }
    return { text: 'รอดำเนินการ', color: '#FFB3B3', textColor: '#610F0F' };
  };

  return (
    <div className="admin-dashboard-container" style={{ padding: '2rem', backgroundColor: '#EEF0F8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="admin-page-title" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', margin: 0 }}>🔧 รับเรื่องแจ้งซ่อมบำรุง</h1>
          <p className="admin-page-subtitle" style={{ color: '#666', marginTop: '0.5rem', marginBottom: 0 }}>
            จัดการปัญหาของชำรุดเสียหายที่นักศึกษารายงานเข้ามา
          </p>
        </div>
      </div>

      <div className="booking-table-container" style={{ backgroundColor: '#FFF', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div className="booking-table-header" style={{ display: 'flex', fontWeight: 'bold', padding: '1rem', backgroundColor: '#F8F9FA', borderBottom: '2px solid #EEE', color: '#444' }}>
          <div style={{ flex: 1.8, textAlign: 'center' }}>การควบคุม/อัปเดต</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>สถานะ</div>
          <div style={{ flex: 1.2, textAlign: 'center' }}>วันที่แจ้ง</div>
          <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>สถานที่ / ห้อง / สนาม</div>
          <div style={{ flex: 4.5, textAlign: 'left', paddingLeft: '1rem' }}>รายละเอียดปัญหาที่พบชำรุด</div>
          <div style={{ flex: 2.0, textAlign: 'center' }}>ผู้แจ้ง</div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>กำลังโหลดข้อมูลรายงานสิ่งชำรุดเสียหาย</p>
        ) : reports.length > 0 ? (
          reports.map(item => {
            const meta = getStatusMeta(item.status);

            return (
              <div key={item._id} className="booking-table-row" style={{ display: 'flex', alignItems: 'center', padding: '1.2rem 1rem', borderBottom: '1px solid #EEE', cursor: 'default' }}>
                
                <div style={{ flex: 1.8, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                  {item.status === 'pending' ? (
                    <button 
                      className="admin-action-btn" 
                      style={{ backgroundColor: '#F5A623', color: '#FFF', border: 'none', padding: '0.45rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', width: '110px' }} 
                      onClick={() => handleResolve(item._id)}
                    >
                      <i className="fa-solid fa-wrench"></i> กำลังดำเนินการ
                    </button>
                  ) : (
                    <button 
                      className="admin-action-btn delete" 
                      style={{ backgroundColor: '#E31B23', color: '#FFF', border: 'none', padding: '0.45rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', width: '110px' }} 
                      onClick={() => handleDelete(item._id)}
                    >
                      <i className="fa-solid fa-trash"></i> ลบประวัติ
                    </button>
                  )}
                </div>

                <div style={{ flex: 1.5, textAlign: 'center' }}>
                  <span className="status-badge" style={{ backgroundColor: meta.color, color: meta.textColor, padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', display: 'inline-block', minWidth: '90px' }}>
                    {meta.text}
                  </span>
                </div>

                <div style={{ flex: 1.2, textAlign: 'center', fontWeight: '500', color: '#555' }}>
                  {item.date}
                </div>

                <div style={{ flex: 2.5, textAlign: 'left', paddingLeft: '1rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>{item.facilityName}</span>
                  {item.roomName && (
                    <div style={{ fontSize: '0.85rem', color: '#0056B3', marginTop: '0.2rem' }}>
                      ห้องย่อย: <strong>{item.roomName}</strong>
                    </div>
                  )}
                </div>

                <div style={{ flex: 4.5, textAlign: 'left', paddingLeft: '1rem', color: item.status === 'pending' ? '#E31B23' : '#444', fontWeight: '500', fontStyle: item.status === 'resolved' ? 'italic' : 'normal' }}>
                  "{item.description}"
                </div>

                <div style={{ flex: 2.0, textAlign: 'center', color: '#0056B3', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  {item.userEmail}
                </div>

              </div>
            );
          })
        ) : (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>
            <i className="fa-solid fa-clipboard-check" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#CCC' }}></i>
            <p>ไม่มีรายการชำรุด</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReports;