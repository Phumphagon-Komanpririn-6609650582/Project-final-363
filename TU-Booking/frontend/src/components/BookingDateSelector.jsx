import React, { useState, useEffect, useRef } from 'react';

function BookingDateSelector({ selectedDate, onDateChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // คำนวณวันที่วันนี้ และ พรุ่งนี้
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => {
    return date.toLocaleDateString('th-TH', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  };

  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);

  const options = [
    { label: `วันนี้ (${todayStr})`, value: todayStr },
    { label: `พรุ่งนี้ (${tomorrowStr})`, value: tomorrowStr }
  ];

  // หา Label ปัจจุบันมาแสดงผล
  const currentLabel = options.find(opt => opt.value === selectedDate)?.label || options[0].label;

  // ฟังก์ชันคลิกพื้นที่อื่นแล้วให้ Dropdown ปิดอัตโนมัติ
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    onDateChange(value);
    setIsOpen(false); // เลือกเสร็จให้พับเก็บ
  };

  return (
    <div className="date-box" style={{ textAlign: 'right' }}>
      <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#333' }}>
        วันที่จอง
      </span>
      
      {/* Container หลักของ Custom Dropdown */}
      <div 
        ref={dropdownRef}
        style={{ position: 'relative', display: 'inline-block', textAlign: 'left' }}
      >
        {/* ปุ่มที่กดเพื่อกางเมนู */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            backgroundColor: 'white', 
            padding: '0.6rem 1.2rem', 
            borderRadius: '2rem', 
            border: isOpen ? '2px solid #E31B23' : '1px solid #ddd', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            minWidth: '180px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <i className="fa-regular fa-calendar" style={{ marginRight: '0.6rem', color: '#E31B23' }}></i>
            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>
              {currentLabel}
            </span>
          </div>
          <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ marginLeft: '1rem', color: '#999', fontSize: '0.8rem' }}></i>
        </div>

        {/* เมนู Dropdown ที่จะโผล่มาตอนกด (แอบแทรกสไตล์ Hover ในนี้เลย) */}
        {isOpen && (
          <div 
            style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              zIndex: 100,
              border: '1px solid #eee'
            }}
          >
            {/* ฝัง CSS สำหรับ Hover Effect เพื่อความสวยงาม */}
            <style>
              {`
                .date-option-item {
                  padding: 0.8rem 1.2rem;
                  cursor: pointer;
                  font-weight: 500;
                  color: #555;
                  transition: background-color 0.2s ease, color 0.2s ease;
                }
                .date-option-item:hover {
                  background-color: #FFF0F0;
                  color: #E31B23;
                }
                .date-option-item.selected {
                  background-color: #E31B23;
                  color: white;
                  font-weight: bold;
                }
              `}
            </style>

            {options.map((option) => (
              <div 
                key={option.value}
                className={`date-option-item ${selectedDate === option.value ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingDateSelector;