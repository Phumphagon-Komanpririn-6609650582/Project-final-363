import User from '../models/User.js';

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'กรุณากรอก Username และ Password' });
    }

    try {
        // 1. คุยกับ REST API ของมหาลัยตามลอจิกเดิมของคุณ
        const tuApiUrl = `https://restapi.tu.ac.th/api/v2/profile/std/info/?id=${password}`;
        
        const response = await fetch(tuApiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Application-Key': 'TU6c11ad3c3e8a28360b79dc1c27bc6b0621ea2dd3b7410f5c2d76d74c39c1106b0a5f3a176400bd358d81f97bac8eb139' 
            }
        });

        const result = await response.json();

        if (response.ok && result.status === true) {
            const apiEmail = result.data.email.toLowerCase();
            const inputUsername = username.toLowerCase();

            if (inputUsername === apiEmail) {
                
                const stdId = result.data.userName;
                
                
                let user = await User.findOne({ studentId: stdId });

                //หากเป็นการเข้าสู่ระบบครั้งแรก ให้บันทึกข้อมูลใหม่ลงไปทันที
                if (!user) {
                    user = await User.create({
                        studentId: stdId,
                        name: result.data.displayname_th,
                        role: 'student', 
                        points: 0     
                    });
                }

            
                if (user.banUntil) {
                    const today = new Date();
                    if (today <= user.banUntil) {
                        return res.status(403).json({ 
                            error: `บัญชีนี้ถูกระงับสิทธิ์ชั่วคราวเนื่องจากผิดกฎระบบจอง จนถึงวันที่ ${new Date(user.banUntil).toLocaleDateString('th-TH')}` 
                        });
                    }
                }

            
                return res.status(200).json({
                    message: 'Login สำเร็จ',
                    user: {
                        studentId: user.studentId,
                        name: user.name,
                        role: user.role, 
                        points: user.points
                    }
                });

            } else {
                return res.status(401).json({ error: 'Username ไม่ถูกต้อง' });
            }
        } else {
            return res.status(401).json({ error: result.message || 'รหัสนักศึกษา หรือ Password ของ TU ไม่ถูกต้อง' });
        }

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์มหาลัย' });
    }
};