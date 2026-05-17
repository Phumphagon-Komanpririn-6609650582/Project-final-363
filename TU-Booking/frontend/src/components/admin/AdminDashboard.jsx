import React from 'react';

function AdminDashboard() {
  // ข้อมูลจำลอง (Mock Data) สำหรับสถิติภาพรวม
  const overviewStats = [
    { title: 'การจองทั้งหมด (เดือนนี้)', count: '1,284', icon: 'fa-solid fa-calendar-check', color: '#4A90E2', bgColor: '#EBF4FF' },
    { title: 'ผู้ใช้งานที่ Active', count: '856', icon: 'fa-solid fa-users', color: '#1E8E3E', bgColor: '#E6F4EA' },
    { title: 'รอการอนุมัติจอง', count: '12', icon: 'fa-solid fa-hourglass-half', color: '#F5A623', bgColor: '#FFF8E6' },
    { title: 'แจ้งซ่อม/ปัญหา', count: '3', icon: 'fa-solid fa-triangle-exclamation', color: '#E31B23', bgColor: '#FFF5F5' },
  ];

  // ข้อมูลจำลองสำหรับกราฟ: สถานที่ยอดฮิต
  const popularFacilities = [
    { name: 'Puey Ungphakorn Library (Study)', bookings: 450, percentage: 85 },
    { name: 'Melody Sphere Zone (Karaoke)', bookings: 320, percentage: 65 },
    { name: 'Badminton Court Interzone', bookings: 280, percentage: 55 },
    { name: 'Tennis Court', bookings: 150, percentage: 30 },
  ];

  // ข้อมูลจำลองสำหรับกราฟ: ช่วงเวลายอดฮิต
  const peakHours = [
    { time: '16:00 - 18:00', count: 380, percentage: 90 },
    { time: '18:00 - 20:00', count: 310, percentage: 75 },
    { time: '12:00 - 14:00', count: 240, percentage: 60 },
    { time: '10:00 - 12:00', count: 120, percentage: 25 },
  ];

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-page-title">Dashboard สรุปข้อมูลการใช้งาน</h1>
      <p className="admin-page-subtitle">ภาพรวมสถิติ Data Analytics ของระบบ TU-Booking</p>

      {/* --- ส่วนที่ 1: การ์ดสรุปสถิติด้านบน --- */}
      <div className="admin-stat-grid">
        {overviewStats.map((stat, index) => (
          <div key={index} className="admin-stat-card">
            <div className="stat-icon" style={{ color: stat.color, backgroundColor: stat.bgColor }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <h3>{stat.count}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-charts-wrapper">
        {/* --- ส่วนที่ 2: กราฟสถานที่ยอดฮิต --- */}
        <div className="admin-chart-box">
          <h2 className="chart-title">📍 สถานที่ถูกจองบ่อยที่สุด</h2>
          <div className="bar-chart-container">
            {popularFacilities.map((item, index) => (
              <div key={index} className="bar-row">
                <div className="bar-label">
                  <span className="bar-name">{item.name}</span>
                  <span className="bar-value">{item.bookings} ครั้ง</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${item.percentage}%`, backgroundColor: '#4A90E2' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ส่วนที่ 3: กราฟช่วงเวลายอดฮิต --- */}
        <div className="admin-chart-box">
          <h2 className="chart-title">⏰ ช่วงเวลาที่คนใช้งานเยอะที่สุด</h2>
          <div className="bar-chart-container">
            {peakHours.map((item, index) => (
              <div key={index} className="bar-row">
                <div className="bar-label">
                  <span className="bar-name">{item.time} น.</span>
                  <span className="bar-value">{item.count} การจอง</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${item.percentage}%`, backgroundColor: '#F5A623' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;