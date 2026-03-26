import React from 'react';

function Header() {
  // Header container
  return (
    <header className="header-container">

      <div className="header-left"><span className="header-text">หมวดหมู่</span></div>

      <div className="header-right">
        
        <i className="fa-regular fa-bell bell-icon"></i>
        <span className="header-text">6609651234</span>
        <div className="user-avatar"><i className="fa-solid fa-user"></i></div>
        
      </div>
    </header>
  );
}

export default Header;