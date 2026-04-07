import React, { useState } from 'react';

function Login({ onLogin }) {
  // 1. สร้าง State เก็บค่าที่ผู้ใช้พิมพ์
  const [username, setUsername] = useState(''); // จะใช้รับค่า อีเมล (เช่น phumphagon.kom@dome.tu.ac.th)
  const [password, setPassword] = useState(''); // จะใช้รับค่า รหัสนักศึกษา (เช่น 6609650582)
  
  // State สำหรับจัดการ Loading และ Error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 2. ฟังก์ชันยิง API เมื่อกดปุ่ม Login
  const handleLogin = async (e) => {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรช
    setIsLoading(true);
    setErrorMsg('');

    try {
      // ⚠️ ใช้ Password (รหัสนศ.) ไปต่อท้าย URL เพื่อดึงข้อมูลโปรไฟล์
      const apiUrl = `https://restapi.tu.ac.th/api/v2/profile/std/info/?id=${password}`; 

      // เปลี่ยนเป็น GET และไม่ต้องส่ง body 
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Application-Key': 'TU6c11ad3c3e8a28360b79dc1c27bc6b0621ea2dd3b7410f5c2d76d74c39c1106b0a5f3a176400bd358d81f97bac8eb139' // 🔑 อย่าลืมเอา Key ยาวๆ ของคุณมาใส่ตรงนี้
        }
      });

      const result = await response.json();

      // 3. เช็คว่า API ตอบกลับมาว่าเจอข้อมูลนักศึกษาหรือไม่ (status: true)
      if (response.ok && result.status === true) {
        
        // แปลงตัวอักษรเป็นพิมพ์เล็กทั้งหมดเพื่อเทียบกัน ป้องกันพิมพ์เล็ก/ใหญ่สลับกัน
        const apiEmail = result.data.email.toLowerCase();
        const inputUsername = username.toLowerCase();

        // เช็คว่า Username (อีเมล) ที่พิมพ์ ตรงกับอีเมลในระบบมธ. หรือไม่
        if (inputUsername === apiEmail) {
            
          // เซฟชื่อและรหัสนักศึกษาลงเครื่อง เพื่อเอาไปแสดงผลที่ Header
          if (result.data) {
            localStorage.setItem('studentName', result.data.displayname_th);
            localStorage.setItem('studentId', result.data.userName);
          }
          
          onLogin(); // เรียกฟังก์ชันเพื่อให้ App.js เปลี่ยนไปหน้าหลัก

        } else {
          // รหัสนศ.ถูก แต่อีเมลผิด
          setErrorMsg('Username (อีเมล) ไม่ถูกต้อง');
        }

      } else {
        // หาข้อมูลรหัสนศ. ไม่เจอ
        setErrorMsg('Password (รหัสนักศึกษา) ไม่ถูกต้อง หรือไม่พบในระบบ');
      }

    } catch (error) {
      console.error('Login Error:', error);
      setErrorMsg('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์มธ.ได้ กรุณาลองใหม่อีกครั้ง');
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
          {errorMsg && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center', backgroundColor: '#FFEBEE', padding: '0.5rem', borderRadius: '4px' }}>{errorMsg}</div>}

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