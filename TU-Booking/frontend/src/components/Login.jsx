import React, { useState } from 'react';

function Login({ onLogin }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
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

      if (response.ok) {
        
        if (result.user) {
          localStorage.setItem('studentId', result.user.studentId);
          localStorage.setItem('role', result.user.role);
          localStorage.setItem('name', result.user.name);
        }
        
        onLogin(result.user); 

      } else {
        setErrorMsg(result.error || result.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }

    } catch (error) {
      console.error('Login Error:', error);
      setErrorMsg('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ Backend ได้');
    } finally {
      setLoading(false);
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
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Student ID*" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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