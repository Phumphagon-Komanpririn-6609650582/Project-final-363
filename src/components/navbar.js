import React from 'react';

function Navbar({ activeMenu, setActiveMenu }) {
    const menus = [
    { name: 'หน้าหลัก', icon: 'fa-solid fa-house' },
    { name: 'ประกาศข่าวสาร', icon: 'fa-solid fa-bullhorn' },
    { name: 'การจองของฉัน', icon: 'fa-solid fa-list-ul' },
  ];
  return (
    // Navbar container
    <nav className="navbar-container">

      <div className="logo-section">
        <div className="logo-circle"><span className="logo-text">TU</span></div>
        <h2 className="brand-name">TU-BOOKING</h2>
      </div>

      <div className="menu-list">
        {menus.map((menu) => (
          <div 
            key={menu.name}
            className={`menu-item ${activeMenu === menu.name ? 'active' : ''}`}
            onClick={() => setActiveMenu(menu.name)}
          >
            <i className={menu.icon}></i>
            <span>{menu.name}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;