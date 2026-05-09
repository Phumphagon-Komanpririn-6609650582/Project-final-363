// จำลองการใช้ fetch ใน Node.js (Node v18+ รองรับ fetch แล้ว)
export const login = async (req, res) => {
    // 1. รับค่า email และ password (รหัสนศ.) ที่ React ส่งมาให้
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'กรุณากรอก Username และ Password' });
    }

    try {
        // 2. Backend รับหน้าที่ไปคุยกับ API ของมธ. แทน (ซ่อน Key ไว้ตรงนี้)
        const tuApiUrl = `https://restapi.tu.ac.th/api/v2/profile/std/info/?id=${password}`;
        
        const response = await fetch(tuApiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Application-Key': 'TU6c11ad3c3e8a28360b79dc1c27bc6b0621ea2dd3b7410f5c2d76d74c39c1106b0a5f3a176400bd358d81f97bac8eb139' 
                // 💡 แนะนำ: ในอนาคตควรย้าย Key นี้ไปเก็บในไฟล์ .env เพื่อความปลอดภัยขั้นสุดครับ
            }
        });

        const result = await response.json();

        // 3. ตรวจสอบข้อมูลแบบเดียวกับที่เคยทำใน React
        if (response.ok && result.status === true) {
            const apiEmail = result.data.email.toLowerCase();
            const inputUsername = username.toLowerCase();

            if (inputUsername === apiEmail) {
                // ข้อมูลถูกต้อง ส่งข้อมูลกลับไปให้ React
                return res.status(200).json({
                    message: 'Login สำเร็จ',
                    studentData: {
                        name: result.data.displayname_th,
                        studentId: result.data.userName
                    }
                });
            } else {
                return res.status(401).json({ error: 'Username ไม่ถูกต้อง' });
            }
        } else {
            return res.status(401).json({ error: 'Password ไม่ถูกต้อง' });
        }

    } catch (error) {
        console.error('TU API Error:', error);
        return res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์มธ.ได้' });
    }
};