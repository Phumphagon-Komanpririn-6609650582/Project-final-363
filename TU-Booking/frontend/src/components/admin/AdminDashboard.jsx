import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/dashboard/analytics');
      const resData = await response.json();
      if (response.ok) {
        setData(resData);
      }
    } catch (error) {
      console.error('❌ โหลดข้อมูลสถิติหน้าแดชบอร์ดล้มเหลว:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: '#666', fontSize: '1.2rem', fontWeight: 'bold' }}>
        🔄 กำลังดึงและคำนวณข้อมูล Data Analytics
      </div>
    );
  }

  const { overview, popularFacilities, peakHours } = data || {
    overview: { totalBookings: 0, approvedBookings: 0, activeUsers: 0, pendingApprovals: 0, pendingReports: 0 },
    popularFacilities: [],
    peakHours: []
  };


  const totalB = (overview?.totalBookings ?? 0).toLocaleString();
  const approvedB = (overview?.approvedBookings ?? 0).toLocaleString();
  const activeU = (overview?.activeUsers ?? 0).toLocaleString();
  const pendingA = (overview?.pendingApprovals ?? 0).toLocaleString();
  const pendingR = (overview?.pendingReports ?? 0).toLocaleString();


  const overviewStats = [
    { title: 'การจองทั้งหมด (เดือนนี้)', count: totalB, icon: 'fa-solid fa-calendar-days', color: '#4A90E2', bgColor: '#EBF4FF' },
    { title: 'อนุมัติ/เช็คอินแล้ว', count: approvedB, icon: 'fa-solid fa-calendar-check', color: '#1E8E3E', bgColor: '#E6F4EA' }, 
    { title: 'ผู้ใช้งานที่ Active', count: activeU, icon: 'fa-solid fa-users', color: '#6A1B9A', bgColor: '#F3E5F5' },
    { title: 'รอการเช็คอิน/อนุมัติ', count: pendingA, icon: 'fa-solid fa-hourglass-half', color: '#F5A623', bgColor: '#FFF8E6' },
    { title: 'แจ้งซ่อม/ปัญหา', count: pendingR, icon: 'fa-solid fa-triangle-exclamation', color: '#E31B23', bgColor: '#FFF5F5' },
  ];

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-page-title">Dashboard สรุปข้อมูลการใช้งาน</h1>
      <p className="admin-page-subtitle">ภาพรวมสถิติ Data Analytics ของระบบ TU-Booking</p>

      <div className="admin-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {overviewStats.map((stat, index) => (
          <div key={index} className="admin-stat-card" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFF', padding: '1.2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div className="stat-icon" style={{ color: stat.color, backgroundColor: stat.bgColor, width: '50px', height: '50px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', marginRight: '1rem', flexShrink: 0 }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>{stat.count}</h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-charts-wrapper">
        <div className="admin-chart-box">
          <h2 className="chart-title">📍 สถานที่ถูกจองบ่อยที่สุด</h2>
          <div className="bar-chart-container">
            {popularFacilities.length > 0 ? (
              popularFacilities.map((item, index) => (
                <div key={index} className="bar-row">
                  <div className="bar-label">
                    <span className="bar-name">{item.name}</span>
                    <span className="bar-value">{(item.bookings ?? 0).toLocaleString()} ครั้ง</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${item.percentage ?? 0}%`, backgroundColor: '#4A90E2', transition: 'width 0.5s ease-out' }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#999', fontStyle: 'italic' }}>ยังไม่มีสถิติสถานที่ถูกจอง</p>
            )}
          </div>
        </div>

        <div className="admin-chart-box">
          <h2 className="chart-title">⏰ ช่วงเวลาที่คนใช้งานเยอะที่สุด</h2>
          <div className="bar-chart-container">
            {peakHours.length > 0 ? (
              peakHours.map((item, index) => (
                <div key={index} className="bar-row">
                  <div className="bar-label">
                    <span className="bar-name">{item.time} น.</span>
                    <span className="bar-value">{(item.count ?? 0).toLocaleString()} การจอง</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${item.percentage ?? 0}%`, backgroundColor: '#F5A623', transition: 'width 0.5s ease-out' }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#999', fontStyle: 'italic' }}>ยังไม่มีสถิติช่วงเวลาการใช้งาน</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;