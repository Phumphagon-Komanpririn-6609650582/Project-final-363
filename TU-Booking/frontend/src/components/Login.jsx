import React, { useState } from 'react';

function Login({ onLogin }) {
  // 1. สร้าง State เก็บค่าที่ผู้ใช้พิมพ์
  const [username, setUsername] = useState(''); // จะใช้รับค่า อีเมล
  const [password, setPassword] = useState(''); // จะใช้รับค่า รหัสนักศึกษา
  
  // State สำหรับจัดการ Loading และ Error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 2. ฟังก์ชันยิง API เมื่อกดปุ่ม Login
  const handleLogin = async (e) => {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรช
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 👉 ยิง API ไปหา Backend ของเราที่พอร์ต 4000 โดยตรง
      const apiUrl = 'http://localhost:4000/api/login'; 

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
      });

      const result = await response.json();

      // 3. เช็คว่า Backend ตอบกลับมาว่าสำเร็จหรือไม่ (response.ok คือ status 200)
      if (response.ok) {
        
        // เซฟข้อมูลลงเครื่อง (Backend ของเราส่งข้อมูลกลับมาในชื่อ result.user)
        if (result.user) {
          localStorage.setItem('studentName', result.user.name);
          localStorage.setItem('studentId', result.user.studentId);
          localStorage.setItem('userRole', result.user.role); // เก็บ Role ลงไปด้วย
        }
        
        // 👉 สำคัญมาก: ส่งข้อมูล User กลับไปให้ App.jsx เพื่อสลับหน้า Admin/Student
        onLogin(result.user); 

      } else {
        // ถ้าไม่สำเร็จ ให้เอาข้อความ Error ที่ Backend ส่งมาไปแสดงผล
        setErrorMsg(result.error || result.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }

    } catch (error) {
      console.error('Login Error:', error);
      setErrorMsg('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ Backend ได้ กรุณาตรวจสอบว่า Backend กำลังรันอยู่');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-placeholder">
            <i className="fa-solid fa-university"></i>
          </div>
          <h1 className="login-brand">TU BOOKING</h1>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {/* แสดงข้อความ Error สีแดง ถ้ามีข้อผิดพลาด */}
          {errorMsg && (
            <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center', backgroundColor: '#FFEBEE', padding: '0.5rem', borderRadius: '4px' }}>
              {errorMsg}
            </div>
          )}

          <div className="input-group">
            <label>User name</label>
            <input 
              type="text" 
              placeholder="Email (e.g., name.sur@dome.tu.ac.th)*" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)} // เก็บค่าลง State
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Student ID*" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)} // เก็บค่าลง State
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;