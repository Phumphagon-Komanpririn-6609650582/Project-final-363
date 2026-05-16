import React from 'react';

function Attention() {
  // ข้อมูลประกาศ (สามารถเพิ่ม/ลดตรงนี้ได้เลย)
  const announcements = [
    {
      id: 1,
      type: 'success',
      icon: 'fa-solid fa-circle-check',
      title: 'สวัสดี #TUDI',
      detail: 'นักศึกษารหัส 66 สามารถเข้าใช้งานระบบ โดยใช้ Username: รหัสนักศึกษา 10 หลัก และ Password: เลขท้ายบัตรประชาชน 10 หลัก',
    },
    {
      id: 2,
      type: 'info',
      icon: 'fa-solid fa-circle-info',
      title: 'ช่องทางการติดต่อ โทร : 02-026-2345 , Line : @tudiofficial',
      detail: 'สามารถติดต่อรับเสื้อ และเข็มวิทยุ ได้ที่ห้องงานนักศึกษาชั้น 1 อาคารเรียนรวม 4 มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต',
    },
    {
      id: 3,
      type: 'info',
      icon: 'fa-solid fa-circle-info',
      title: 'สนามกีฬาเอ็กซ์ตรีม ยิมเนเซียม และสนามแบดมินตัน',
      detail: 'เปิดให้บริการวันจันทร์ - วันศุกร์ และปิดให้บริการทุกวันเสาร์-อาทิตย์',
    },
    {
      id: 4,
      type: 'error',
      icon: 'fa-solid fa-circle-xmark',
      title: 'ปิดให้บริการสนามแบดมินตัน ชั้น 4 วันที่ 13-18 มี.ค. 69',
      detail: '',
    },
    {
      id: 5,
      type: 'info',
      icon: 'fa-solid fa-circle-info',
      title: 'สนามแบดมินตัน - Badminton Workshop',
      detail: 'สนามจำกัดกิจกรรม Badminton Workshop รุ่น Advance Skill วันที่ 18-19 มีนาคม 2569 เปิดให้บริการตามปกติ',
    }
  ];

  return (
    <div className="attention-container">
      <div className="attention-header">
        <i className="fa-solid fa-bullhorn"></i>
      </div>
      
      <div className="attention-white-board">
        {announcements.map((item) => (
          <div key={item.id} className={`alert-card ${item.type}`}>
            <div className="alert-icon">
              <i className={item.icon}></i>
            </div>
            <div className="alert-content">
              <strong>{item.title}</strong>
              {item.detail && <p>{item.detail}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Attention;